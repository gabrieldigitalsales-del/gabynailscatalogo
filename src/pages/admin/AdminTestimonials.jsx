import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'name', label: 'Nome da Cliente', type: 'text' },
  { name: 'text', label: 'Depoimento', type: 'textarea' },
  { name: 'rating', label: 'Nota (1-5)', type: 'number', default: 5 },
  { name: 'photo_url', label: 'Foto', type: 'image' },
  { name: 'service', label: 'Serviço Realizado', type: 'text' },
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativo', type: 'boolean', default: true },
];

export default function AdminTestimonials() {
  const { data } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => base44.adminEntities.Testimonial.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="Depoimentos"
      entityName="Testimonial"
      queryKey="admin-testimonials"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.name },
        { value: `${item.service || '-'} | ★${item.rating || 5}` },
      ]}
    />
  );
}
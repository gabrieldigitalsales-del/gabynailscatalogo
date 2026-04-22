import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text' },
  { name: 'subtitle', label: 'Subtítulo', type: 'textarea' },
  { name: 'image_url', label: 'Imagem', type: 'image' },
  { name: 'cta_text', label: 'Texto do Botão', type: 'text' },
  { name: 'cta_link', label: 'Link do Botão', type: 'text' },
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativo', type: 'boolean', default: true },
];

export default function AdminSlides() {
  const { data } = useQuery({
    queryKey: ['admin-slides'],
    queryFn: () => base44.adminEntities.HeroSlide.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="Hero / Slides"
      entityName="HeroSlide"
      queryKey="admin-slides"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.title },
        { value: `Ordem: ${item.order || '-'} | ${item.active ? 'Ativo' : 'Inativo'}` },
      ]}
    />
  );
}
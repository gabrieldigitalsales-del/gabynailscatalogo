import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'name', label: 'Nome', type: 'text' },
  { name: 'photo_url', label: 'Foto', type: 'image' },
  { name: 'specialty', label: 'Especialidade', type: 'text' },
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativa', type: 'boolean', default: true },
];

export default function AdminProfessionals() {
  const { data } = useQuery({
    queryKey: ['admin-professionals'],
    queryFn: () => base44.adminEntities.Professional.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="Profissionais"
      entityName="Professional"
      queryKey="admin-professionals"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.name },
        { value: item.specialty || '-' },
      ]}
    />
  );
}
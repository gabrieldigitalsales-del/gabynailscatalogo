import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'name', label: 'Nome', type: 'text' },
  { name: 'description', label: 'Descrição', type: 'textarea' },
  { name: 'duration', label: 'Duração', type: 'text' },
  { name: 'price_from', label: 'A partir de (R$)', type: 'number', default: 0 },
  { name: 'image_url', label: 'Imagem', type: 'image' },
  { name: 'category', label: 'Categoria', type: 'select', options: [
    { value: 'manicure', label: 'Manicure' },
    { value: 'blindagem', label: 'Blindagem' },
    { value: 'gel', label: 'Gel' },
    { value: 'alongamento', label: 'Alongamento' },
    { value: 'nail_art', label: 'Nail Art' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'spa', label: 'Spa' },
  ]},
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativo', type: 'boolean', default: true },
];

export default function AdminServices() {
  const { data } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => base44.adminEntities.Service.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="Serviços"
      entityName="Service"
      queryKey="admin-services"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.name },
        { value: `R$ ${item.price_from || 0} | ${item.duration || '-'} | ${item.active ? 'Ativo' : 'Inativo'}` },
      ]}
    />
  );
}
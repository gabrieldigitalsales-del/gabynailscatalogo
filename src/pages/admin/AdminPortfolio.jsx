import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text' },
  { name: 'image_url', label: 'Imagem', type: 'image' },
  { name: 'category', label: 'Categoria', type: 'select', options: [
    { value: 'alongamento', label: 'Alongamento' },
    { value: 'esmaltacao', label: 'Esmaltação' },
    { value: 'nail_art', label: 'Nail Art' },
    { value: 'blindagem', label: 'Blindagem' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'gel', label: 'Gel' },
  ]},
  { name: 'featured', label: 'Destaque (maior no mosaico)', type: 'boolean', default: false },
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativo', type: 'boolean', default: true },
];

export default function AdminPortfolio() {
  const { data } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => base44.adminEntities.PortfolioItem.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="Portfólio"
      entityName="PortfolioItem"
      queryKey="admin-portfolio"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.title || 'Sem título' },
        { value: `${item.category || '-'} | ${item.featured ? 'Destaque' : 'Normal'}` },
      ]}
    />
  );
}
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminCRUD from '../../components/admin/AdminCRUD';

const FIELDS = [
  { name: 'question', label: 'Pergunta', type: 'text' },
  { name: 'answer', label: 'Resposta', type: 'textarea' },
  { name: 'category', label: 'Categoria', type: 'select', options: [
    { value: 'servicos', label: 'Serviços' },
    { value: 'agendamento', label: 'Agendamento' },
    { value: 'curso', label: 'Curso' },
    { value: 'geral', label: 'Geral' },
  ]},
  { name: 'order', label: 'Ordem', type: 'number', default: 1 },
  { name: 'active', label: 'Ativo', type: 'boolean', default: true },
];

export default function AdminFAQ() {
  const { data } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: () => base44.adminEntities.FAQItem.list(),
    initialData: [],
  });

  return (
    <AdminCRUD
      title="FAQ"
      entityName="FAQItem"
      queryKey="admin-faq"
      items={data}
      fields={FIELDS}
      getDisplayFields={(item) => [
        { value: item.question },
        { value: item.category || 'geral' },
      ]}
    />
  );
}
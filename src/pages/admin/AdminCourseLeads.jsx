import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_COLORS = {
  novo: 'bg-gold/10 text-gold border-gold/20',
  em_contato: 'bg-blue-50 text-blue-700 border-blue-200',
  convertido: 'bg-green-50 text-green-700 border-green-200',
  arquivado: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
};

export default function AdminCourseLeads() {
  const queryClient = useQueryClient();

  const { data: leads } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => base44.adminEntities.CourseInquiry.list('-created_date', 50),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.adminEntities.CourseInquiry.update(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-leads'] }); toast.success('Atualizado!'); },
  });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-3xl text-charcoal mb-8">Leads do Curso</h1>

      <div className="space-y-2">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-sm border border-champagne/40 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-charcoal font-medium">{lead.name}</p>
              <p className="font-sans text-xs text-charcoal/50">{lead.phone} • {lead.city || '-'}</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">
                {lead.level === 'iniciante' ? 'Iniciante' : 'Já atua'} 
                {lead.question ? ` • "${lead.question}"` : ''}
              </p>
            </div>
            <div className="w-36">
              <Select value={lead.status || 'novo'} onValueChange={(v) => updateMutation.mutate({ id: lead.id, status: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <Badge variant="outline" className={STATUS_COLORS[lead.status || 'novo']}>
                    {(lead.status || 'novo').replace('_', ' ')}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="em_contato">Em Contato</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="text-center py-12 text-charcoal/40 font-sans text-sm">
            Nenhum lead recebido
          </div>
        )}
      </div>
    </div>
  );
}
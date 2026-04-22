import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pendente: 'bg-gold/10 text-gold border-gold/20',
  confirmado: 'bg-green-50 text-green-700 border-green-200',
  concluido: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
  cancelado: 'bg-red-50 text-red-600 border-red-200',
};

export default function AdminAppointments() {
  const queryClient = useQueryClient();

  const { data: appointments } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => base44.adminEntities.Appointment.list('-created_date', 50),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.adminEntities.Appointment.update(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }); toast.success('Status atualizado!'); },
  });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-3xl text-charcoal mb-8">Agendamentos</h1>

      <div className="space-y-2">
        {appointments.map((a) => (
          <div key={a.id} className="bg-white rounded-sm border border-champagne/40 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-charcoal font-medium">{a.client_name}</p>
              <p className="font-sans text-xs text-charcoal/50">{a.client_phone}</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">{a.service_name} • {a.professional_name}</p>
            </div>
            <div className="text-sm">
              <p className="font-sans text-charcoal">{a.date}</p>
              <p className="font-sans text-gold text-xs">{a.time}</p>
            </div>
            <div className="w-36">
              <Select value={a.status} onValueChange={(v) => updateMutation.mutate({ id: a.id, status: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <Badge variant="outline" className={STATUS_COLORS[a.status]}>
                    {a.status}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="text-center py-12 text-charcoal/40 font-sans text-sm">
            Nenhum agendamento
          </div>
        )}
      </div>
    </div>
  );
}
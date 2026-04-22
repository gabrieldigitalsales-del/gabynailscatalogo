import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Lock, Unlock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ALL_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

export default function AdminSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [reason, setReason] = useState('');
  const queryClient = useQueryClient();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const { data: professionals } = useQuery({
    queryKey: ['admin-professionals'],
    queryFn: () => base44.adminEntities.Professional.filter({ active: true }),
    initialData: [],
  });

  const { data: blocks } = useQuery({
    queryKey: ['admin-blocks', selectedProfessional, formattedDate],
    queryFn: () =>
      base44.adminEntities.ScheduleBlock.filter({
        professional_id: selectedProfessional,
        date: formattedDate,
      }),
    enabled: !!selectedProfessional,
    initialData: [],
  });

  const { data: appointments } = useQuery({
    queryKey: ['admin-appts-day', selectedProfessional, formattedDate],
    queryFn: () =>
      base44.adminEntities.Appointment.filter({
        professional_id: selectedProfessional,
        date: formattedDate,
      }),
    enabled: !!selectedProfessional,
    initialData: [],
  });

  const blockMutation = useMutation({
    mutationFn: (time) =>
      base44.adminEntities.ScheduleBlock.create({
        professional_id: selectedProfessional,
        professional_name: professionals.find((p) => p.id === selectedProfessional)?.name || '',
        date: formattedDate,
        time,
        reason: reason.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blocks'] });
      toast.success('Horário bloqueado!');
    },
  });

  const unblockMutation = useMutation({
    mutationFn: (blockId) => base44.adminEntities.ScheduleBlock.delete(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blocks'] });
      toast.success('Horário liberado!');
    },
  });

  const blockedTimes = new Set(blocks.map((b) => b.time));
  const appointedTimes = new Set(
    appointments.filter((a) => a.status !== 'cancelado').map((a) => a.time)
  );

  const toggleSlot = (time) => {
    if (appointedTimes.has(time)) return; // não pode bloquear horário com agendamento
    if (blockedTimes.has(time)) {
      const block = blocks.find((b) => b.time === time);
      if (block) unblockMutation.mutate(block.id);
    } else {
      blockMutation.mutate(time);
    }
  };

  const getSlotState = (time) => {
    if (appointedTimes.has(time)) return 'appointed';
    if (blockedTimes.has(time)) return 'blocked';
    return 'free';
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-serif text-3xl text-charcoal mb-2">Agenda / Bloqueios</h1>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-8">
        Bloqueie horários indisponíveis para que clientes não possam agendar
      </p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
          <SelectTrigger className="w-full sm:w-64 bg-white border-champagne/40">
            <SelectValue placeholder="Selecione a profissional" />
          </SelectTrigger>
          <SelectContent>
            {professionals.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 bg-white border border-champagne/40 rounded-sm hover:border-gold/40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-charcoal/60" />
          </button>
          <span className="font-serif text-lg text-charcoal capitalize min-w-[180px] text-center">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </span>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 bg-white border border-champagne/40 rounded-sm hover:border-gold/40 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>
      </div>

      {!selectedProfessional ? (
        <div className="text-center py-16 text-charcoal/40 font-sans text-sm">
          Selecione uma profissional para gerenciar a agenda
        </div>
      ) : (
        <>
          {/* Reason field */}
          <div className="mb-6 max-w-xs">
            <label className="text-xs font-sans text-charcoal/60 mb-1 block">Motivo do bloqueio (opcional)</label>
            <Input
              placeholder="Ex: Compromisso pessoal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-champagne/40"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/60 mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-white border border-champagne/40 inline-block" />
              Livre — clique para bloquear
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-charcoal/10 border border-charcoal/20 inline-block" />
              Bloqueado — clique para liberar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gold/20 border border-gold/30 inline-block" />
              Com agendamento (não editável aqui)
            </span>
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {ALL_TIMES.map((time) => {
              const state = getSlotState(time);
              const block = blocks.find((b) => b.time === time);
              const appt = appointments.find((a) => a.time === time && a.status !== 'cancelado');

              return (
                <button
                  key={time}
                  onClick={() => toggleSlot(time)}
                  disabled={state === 'appointed'}
                  title={
                    state === 'appointed'
                      ? `Agendamento: ${appt?.client_name || ''}`
                      : state === 'blocked'
                      ? `Bloqueado${block?.reason ? `: ${block.reason}` : ''} — clique para liberar`
                      : 'Clique para bloquear'
                  }
                  className={`relative py-3 px-2 rounded-sm text-sm font-sans transition-all duration-200 flex flex-col items-center gap-1 ${
                    state === 'appointed'
                      ? 'bg-gold/10 border border-gold/30 text-gold/70 cursor-default'
                      : state === 'blocked'
                      ? 'bg-charcoal/10 border border-charcoal/20 text-charcoal/50 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                      : 'bg-white border border-champagne/40 text-charcoal/70 hover:bg-charcoal/5 hover:border-charcoal/20'
                  }`}
                >
                  {state === 'blocked' && <Lock className="w-3 h-3" />}
                  {state === 'free' && <Unlock className="w-3 h-3 opacity-30" />}
                  {state === 'appointed' && <Plus className="w-3 h-3 rotate-45" />}
                  <span>{time}</span>
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-champagne/40 rounded-sm p-4 text-center">
              <p className="font-serif text-2xl text-charcoal">{ALL_TIMES.length - blockedTimes.size - appointedTimes.size}</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">Horários Livres</p>
            </div>
            <div className="bg-white border border-champagne/40 rounded-sm p-4 text-center">
              <p className="font-serif text-2xl text-gold">{appointedTimes.size}</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">Com Agendamento</p>
            </div>
            <div className="bg-white border border-champagne/40 rounded-sm p-4 text-center">
              <p className="font-serif text-2xl text-charcoal/50">{blockedTimes.size}</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">Bloqueados</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
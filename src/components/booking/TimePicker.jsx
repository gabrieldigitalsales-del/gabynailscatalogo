import React from 'react'
import { Ban } from 'lucide-react'
import { BOOKING_TIMES, isTimeSlotAvailable } from '@/lib/booking'

export default function TimePicker({ selected, onSelect, appointments = [], blockedSlots = [], serviceDuration = '1h' }) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-charcoal mb-2">Escolha o Horário</h3>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-6">
        Horários disponíveis · Duração do serviço:{' '}
        <span className="text-charcoal/70 font-medium">{serviceDuration}</span>
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {BOOKING_TIMES.map((time) => {
          const available = isTimeSlotAvailable(time, appointments, blockedSlots, serviceDuration)
          const isSelected = selected === time

          return (
            <button
              key={time}
              onClick={() => available && onSelect(time)}
              disabled={!available}
              title={!available ? 'Horário indisponível' : undefined}
              className={`relative py-3 px-4 rounded-sm text-sm font-sans transition-all duration-300 ${
                isSelected
                  ? 'bg-gold text-white font-medium shadow-sm'
                  : !available
                    ? 'bg-charcoal/5 text-charcoal/25 cursor-not-allowed border border-charcoal/10 line-through'
                    : 'bg-white border border-champagne/40 text-charcoal/70 hover:border-gold/40 hover:bg-gold/5'
              }`}
              type="button"
            >
              {!available && !isSelected && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Ban className="w-3 h-3 text-charcoal/20" />
                </span>
              )}
              <span className={!available ? 'opacity-40' : ''}>{time}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-xs font-sans text-charcoal/50">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white border border-champagne/40 inline-block" />
          Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-charcoal/5 border border-charcoal/10 inline-block" />
          Indisponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gold inline-block" />
          Selecionado
        </span>
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DatePicker({ selected, onSelect, fullyBookedDates = [] }) {
  const [viewMonth, setViewMonth] = useState(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);
  const paddedDays = Array(startPadding).fill(null).concat(days);
  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const fullyBookedSet = useMemo(() => new Set(fullyBookedDates), [fullyBookedDates]);

  return (
    <div>
      <h3 className="font-serif text-2xl text-charcoal mb-2">Escolha a Data</h3>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-6">
        Datas com todos os horários ocupados aparecem com X
      </p>

      <div className="bg-white rounded-sm border border-champagne/40 p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            className="p-2 hover:bg-champagne/30 rounded-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-charcoal/60" />
          </button>
          <span className="font-serif text-lg text-charcoal capitalize">
            {format(viewMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="p-2 hover:bg-champagne/30 rounded-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-sans font-medium tracking-wider uppercase text-charcoal/40 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {paddedDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;
            const dateKey = format(day, 'yyyy-MM-dd');
            const isPast = isBefore(day, startOfDay(new Date()));
            const isSunday = getDay(day) === 0;
            const isFullyBooked = fullyBookedSet.has(dateKey);
            const disabled = isPast || isSunday || isFullyBooked;
            const isSelected = selected && isSameDay(day, selected);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => !disabled && onSelect(day)}
                disabled={disabled}
                className={`h-10 rounded-sm text-sm font-sans transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-gold text-white font-medium'
                    : disabled
                      ? 'text-charcoal/20 cursor-not-allowed'
                      : isToday(day)
                        ? 'bg-gold/10 text-gold hover:bg-gold/20'
                        : 'text-charcoal/70 hover:bg-champagne/40'
                } ${isFullyBooked ? 'bg-stone-100 border border-stone-200 text-stone-400' : ''}`}
              >
                {format(day, 'd')}
                {isFullyBooked && (
                  <span className="absolute top-0.5 right-1 text-red-500 font-bold text-xs">X</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

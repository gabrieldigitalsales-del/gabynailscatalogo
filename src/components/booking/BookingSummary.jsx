import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Clock, User, Sparkles } from 'lucide-react';

export default function BookingSummary({ service, professional, date, time, loading, onConfirm }) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-charcoal mb-2">Confirme seu Agendamento</h3>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-6">
        Verifique os detalhes e confirme
      </p>

      <div className="bg-white rounded-sm border border-champagne/40 p-8 max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Serviço</p>
            <p className="font-serif text-lg text-charcoal">{service?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Profissional</p>
            <p className="font-serif text-lg text-charcoal">{professional?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Data</p>
            <p className="font-serif text-lg text-charcoal capitalize">
              {date ? format(date, "EEEE, d 'de' MMMM", { locale: ptBR }) : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Horário</p>
            <p className="font-serif text-lg text-charcoal">{time}</p>
          </div>
        </div>

        {service?.price_from > 0 && (
          <div className="pt-4 border-t border-champagne/30">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-charcoal/50">A partir de</span>
              <span className="font-serif text-xl text-gold">R$ {service.price_from}</span>
            </div>
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full py-4 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300 disabled:opacity-50 mt-4"
        >
          {loading ? 'Confirmando...' : 'Confirmar Horário'}
        </button>
      </div>
    </div>
  );
}
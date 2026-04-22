import React from 'react';
import { Clock } from 'lucide-react';

export default function ServicePicker({ services, selected, onSelect }) {
  const sorted = [...(services || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <h3 className="font-serif text-2xl text-charcoal mb-2">Escolha o Serviço</h3>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-6">
        Selecione o serviço desejado para continuar
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {sorted.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`text-left p-5 rounded-sm border transition-all duration-300 ${
              selected?.id === service.id
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-champagne/40 bg-white hover:border-gold/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${selected?.id === service.id ? 'bg-gold' : 'bg-champagne'}`} />
              <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-charcoal/50">
                {service.category?.replace('_', ' ') || 'Serviço'}
              </span>
            </div>
            <h4 className="font-serif text-lg text-charcoal mb-1">{service.name}</h4>
            <div className="flex items-center gap-3 text-xs text-charcoal/50">
              {service.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration}
                </span>
              )}
              {service.price_from > 0 && (
                <span>a partir de R$ {service.price_from}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
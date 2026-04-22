import React from 'react';
import { User } from 'lucide-react';

export default function ProfessionalPicker({ professionals, selected, onSelect }) {
  const sorted = [...(professionals || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <h3 className="font-serif text-2xl text-charcoal mb-2">Escolha a Profissional</h3>
      <p className="font-sans text-charcoal/50 text-sm font-light mb-6">
        Selecione com quem deseja ser atendida
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {sorted.map((pro) => (
          <button
            key={pro.id}
            onClick={() => onSelect(pro)}
            className={`text-left p-5 rounded-sm border transition-all duration-300 flex items-center gap-4 ${
              selected?.id === pro.id
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-champagne/40 bg-white hover:border-gold/40'
            }`}
          >
            {pro.photo_url ? (
              <img src={pro.photo_url} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-champagne/40 flex items-center justify-center">
                <User className="w-5 h-5 text-charcoal/40" />
              </div>
            )}
            <div>
              <h4 className="font-serif text-lg text-charcoal">{pro.name}</h4>
              {pro.specialty && (
                <p className="font-sans text-charcoal/50 text-xs font-light">{pro.specialty}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
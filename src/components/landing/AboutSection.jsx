import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Heart, Award, Sparkles, Eye } from 'lucide-react';

const DIFFERENTIALS = [
  { icon: Heart, label: 'Atendimento Exclusivo' },
  { icon: Gem, label: 'Acabamento Impecável' },
  { icon: Sparkles, label: 'Tendências Atuais' },
  { icon: Award, label: 'Experiência Premium' },
  { icon: Eye, label: 'Atenção aos Detalhes' },
];

export default function AboutSection({ settings }) {
  return (
    <section id="sobre" className="py-20 md:py-32 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden bg-champagne/30">
              {settings?.about_image_url ? (
                <img
                  src={settings.about_image_url}
                  alt="Sobre a Gaby Nails"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-champagne/50 to-champagne/20" />
              )}
            </div>
            {/* Gold accent line */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/30 rounded-sm" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-10 h-px bg-gold mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-medium mb-6">
              {settings?.about_title ?? 'Sobre a Gaby Nails'}
            </h2>
            <p className="font-sans text-charcoal/70 text-base font-light leading-relaxed mb-10">
              {settings?.about_text ??
                'Na Gaby Nails, cada atendimento é um compromisso com a sua identidade, entregando um acabamento que desafia a perfeição.'}
            </p>

            {/* Differentials */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DIFFERENTIALS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="flex flex-col items-center text-center p-4 rounded-sm bg-champagne/20 border border-champagne/40"
                >
                  <Icon className="w-5 h-5 text-gold mb-2" strokeWidth={1.5} />
                  <span className="text-xs font-sans font-medium tracking-wider uppercase text-charcoal/70">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
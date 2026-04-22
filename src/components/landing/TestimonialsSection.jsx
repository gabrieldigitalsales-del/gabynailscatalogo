import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection({ testimonials }) {
  const sorted = [...(testimonials || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="depoimentos" className="py-20 md:py-32 bg-champagne/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-medium mb-4">
            O Que Nossas Clientes Dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-sm p-8 border border-champagne/40 hover:shadow-md transition-shadow duration-500"
            >
              <Quote className="w-6 h-6 text-gold/40 mb-4" />
              <p className="font-sans text-charcoal/70 text-sm font-light leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-champagne/50 flex items-center justify-center">
                    <span className="font-serif text-charcoal/60 text-sm">{t.name?.[0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-sans text-charcoal text-sm font-medium">{t.name}</p>
                  {t.service && (
                    <p className="font-sans text-charcoal/50 text-xs">{t.service}</p>
                  )}
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

export default function ServicesSection({ services }) {
  const sorted = [...(services || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="servicos" className="py-20 md:py-32 bg-champagne/15">
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
            Nossos Serviços
          </h2>
          <p className="font-sans text-charcoal/60 text-base font-light max-w-lg mx-auto">
            Cada serviço é uma experiência pensada para realçar sua beleza com técnica e sofisticação
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white rounded-sm border border-champagne/40 p-6 hover:shadow-lg hover:border-gold/30 transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-gold">
                  {service.category?.replace('_', ' ') || 'Serviço'}
                </span>
              </div>

              <h3 className="font-serif text-xl text-charcoal font-medium mb-2">
                {service.name}
              </h3>

              <p className="font-sans text-charcoal/60 text-sm font-light leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>

              <div className="flex items-center gap-4 mb-5 text-xs text-charcoal/50">
                {service.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </span>
                )}
                {service.price_from > 0 && (
                  <span className="font-medium text-charcoal/70">
                    a partir de R$ {service.price_from}
                  </span>
                )}
              </div>

              <Link
                to="/agendar"
                className="inline-flex items-center gap-2 text-xs font-sans font-medium tracking-wider uppercase text-gold group-hover:text-charcoal transition-colors duration-300"
              >
                Agendar
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
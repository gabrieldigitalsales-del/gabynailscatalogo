import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection({ settings }) {
  return (
    <section className="py-20 md:py-32 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-champagne rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-medium mb-4">
            {settings?.cta_title ?? 'Pronta para uma Experiência Única?'}
          </h2>
          <p className="font-sans text-white/60 text-base font-light max-w-lg mx-auto mb-10">
            {settings?.cta_subtitle ?? 'Agende seu horário e descubra o padrão Gaby Nails de excelência'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agendar"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300"
            >
              Agendar Meu Horário
              <ArrowRight className="w-3 h-3" />
            </Link>
            <a
              href="#curso"
              onClick={(e) => { e.preventDefault(); document.querySelector('#curso')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/30 text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-white/10 transition-all duration-300"
            >
              Saber Mais Sobre o Curso
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
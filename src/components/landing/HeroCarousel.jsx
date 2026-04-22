import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});

  const sortedSlides = [...(slides || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const next = useCallback(() => {
    if (sortedSlides.length > 0) {
      setCurrent((prev) => (prev + 1) % sortedSlides.length);
    }
  }, [sortedSlides.length]);

  const prev = useCallback(() => {
    if (sortedSlides.length > 0) {
      setCurrent((prev) => (prev - 1 + sortedSlides.length) % sortedSlides.length);
    }
  }, [sortedSlides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    sortedSlides.forEach((slide) => {
      if (slide.image_url) {
        const img = new Image();
        img.onload = () => setImageLoaded((prev) => ({ ...prev, [slide.image_url]: true }));
        img.src = slide.image_url;
      }
    });
  }, [sortedSlides]);

  if (!sortedSlides.length) {
    return (
      <div className="h-screen bg-champagne/30 flex items-center justify-center">
        <p className="font-serif text-2xl text-charcoal/40">Carregando...</p>
      </div>
    );
  }

  const slide = sortedSlides[current];

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slide.image_url && imageLoaded[slide.image_url] ? (
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-champagne/50 to-champagne/20" />
          )}
          {/* Elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-charcoal/10" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-24 md:pb-32 lg:items-center lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl"
            >
              <div className="w-12 h-px bg-gold mb-6" />
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-tight mb-4">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="font-sans text-white/80 text-base md:text-lg font-light leading-relaxed mb-8 max-w-lg">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/agendar"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300"
                >
                  Agendar Horário
                </Link>
                <a
                  href="#curso"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#curso')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-white/10 transition-all duration-300"
                >
                  Falar Sobre o Curso
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-3">
        <button
          onClick={prev}
          className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-all duration-300"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-all duration-300"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {sortedSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-gold' : 'w-4 bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
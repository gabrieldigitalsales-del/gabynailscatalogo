import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'Tudo' },
  { value: 'alongamento', label: 'Alongamento' },
  { value: 'esmaltacao', label: 'Esmaltação' },
  { value: 'nail_art', label: 'Nail Art' },
  { value: 'blindagem', label: 'Blindagem' },
  { value: 'gel', label: 'Gel' },
];

export default function PortfolioSection({ items }) {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const sorted = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const filtered = filter === 'all' ? sorted : sorted.filter((item) => item.category === filter);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-medium mb-4">
            Portfólio
          </h2>
          <p className="font-sans text-charcoal/60 text-base font-light max-w-lg mx-auto">
            Cada trabalho é uma obra de arte dedicada a realçar sua beleza
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`text-xs font-sans font-medium tracking-widest uppercase px-5 py-2 rounded-sm transition-all duration-300 ${
                filter === cat.value
                  ? 'bg-charcoal text-white'
                  : 'bg-champagne/30 text-charcoal/60 hover:bg-champagne/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <div
                  className={`relative overflow-hidden rounded-sm bg-champagne/20 ${
                    item.featured ? 'aspect-[3/4]' : 'aspect-square'
                  }`}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title || 'Portfólio'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-champagne/40 to-champagne/10" />
                  )}
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-500 flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      {item.title && (
                        <span className="font-serif text-white text-lg">{item.title}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-3xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-gold transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightbox.image_url}
                alt={lightbox.title || 'Portfólio'}
                className="w-full h-full object-contain rounded-sm"
              />
              {lightbox.title && (
                <p className="text-center text-white/80 font-serif text-lg mt-4">{lightbox.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
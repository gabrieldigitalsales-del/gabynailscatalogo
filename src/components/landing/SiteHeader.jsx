import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Curso', href: '#curso' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'FAQ', href: '#faq' },
];

export default function SiteHeader({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-off-white/95 backdrop-blur-md shadow-sm border-b border-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <span className="font-serif text-xl md:text-2xl font-medium tracking-wide text-charcoal">
              {settings?.brand_name ?? 'Gaby Nails'}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-sans font-light tracking-widest uppercase text-charcoal/70 hover:text-gold transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/agendar"
              className="ml-2 px-6 py-2.5 bg-charcoal text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold transition-colors duration-300"
            >
              Agendar
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-charcoal"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-off-white/98 backdrop-blur-md border-b border-primary/10"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-sm font-sans font-light tracking-widest uppercase text-charcoal/70 hover:text-gold transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/agendar"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-6 py-3 bg-charcoal text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold transition-colors mt-4"
              >
                Agendar Horário
              </Link>
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold transition-colors py-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@gaby_nails.esmalteria</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
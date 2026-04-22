import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';

export default function SiteFooter({ settings }) {
  return (
    <footer className="bg-charcoal border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white font-medium mb-4">
              {settings?.brand_name ?? 'Gaby Nails Esmalteria'}
            </h3>
            <p className="font-sans text-white/50 text-sm font-light leading-relaxed">
              Beleza, sofisticação e cuidado em cada detalhe. Sua experiência premium começa aqui.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs font-medium tracking-widest uppercase text-gold mb-4">
              Contato
            </h4>
            <div className="space-y-3">
              {settings?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <span className="font-sans text-white/60 text-sm font-light">{settings.address}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <span className="font-sans text-white/60 text-sm font-light">{settings.phone}</span>
                </div>
              )}
              {settings?.working_hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <span className="font-sans text-white/60 text-sm font-light">{settings.working_hours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-sans text-xs font-medium tracking-widest uppercase text-gold mb-4">
              Redes Sociais
            </h4>
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-white/60 text-sm font-light hover:text-gold transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @gaby_nails.esmalteria
              </a>
            )}
            {settings?.maps_embed_url && (
              <div className="mt-6 aspect-video rounded-sm overflow-hidden border border-white/10">
                <iframe
                  src={settings.maps_embed_url}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Mapa"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center space-y-3">
          <p className="font-sans text-white/30 text-xs font-light">
            © {new Date().getFullYear()} {settings?.brand_name ?? 'Gaby Nails Esmalteria'}. Todos os direitos reservados.
          </p>
          <a
            href="https://www.instagram.com/nexor_digital_group_/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-sans text-white/50 text-xs font-light hover:text-gold transition-colors"
          >
            feito por nexor digital group
          </a>
        </div>
      </div>
    </footer>
  );
}
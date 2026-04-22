import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat({ whatsapp }) {
  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de mais informações sobre a Gaby Nails.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CourseSection({ settings }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', level: '', question: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const benefits = (settings?.course_benefits ?? '').split('|').filter(Boolean);
  const modules = (settings?.course_modules ?? '').split('|').filter(Boolean);
  const gabyWa = settings?.whatsapp_gaby ?? settings?.course_whatsapp ?? '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Preencha seu nome e telefone');
      return;
    }

    try {
      setLoading(true);
      await base44.entities.CourseInquiry.create(form);
      setSubmitted(true);
      toast.success('Recebemos seu interesse! Entraremos em contato em breve.');

      if (gabyWa) {
        const msg = encodeURIComponent(
          `Olá Gaby! Tenho interesse no curso.

` +
          `👤 *Nome:* ${form.name}
` +
          `📞 *Telefone:* ${form.phone}
` +
          `📍 *Cidade:* ${form.city || 'Não informado'}
` +
          `🎓 *Nível:* ${form.level === 'ja_atua' ? 'Já atua na área' : 'Iniciante'}
` +
          `❓ *Dúvida:* ${form.question || 'Nenhuma dúvida específica'}`
        );
        window.open(`https://wa.me/${gabyWa}?text=${msg}`, '_blank');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Não foi possível enviar seu interesse agora.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="curso" className="py-20 md:py-32 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal/95" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-10 h-px bg-gold mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-medium mb-4">
              {settings?.course_title ?? 'Aprenda a Transformar Talento em Profissão'}
            </h2>
            <p className="font-serif text-gold text-lg italic mb-6">
              {settings?.course_subtitle ?? 'Domine a técnica que encanta clientes de alto padrão'}
            </p>
            <p className="font-sans text-white/70 text-base font-light leading-relaxed mb-8">
              {settings?.course_text ??
                'Sua transição para o mercado premium começa aqui, através de um método focado na excelência e na rentabilidade.'}
            </p>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="space-y-3 mb-10">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="font-sans text-white/80 text-sm font-light">{b.trim()}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Modules */}
            {modules.length > 0 && (
              <div className="mb-10">
                <h3 className="font-serif text-xl text-white mb-4">O que você vai aprender</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modules.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-sm bg-white/5 border border-white/10">
                      <span className="text-gold font-serif text-sm">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-sans text-white/70 text-sm font-light">{m.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image */}
            {settings?.course_image_url && (
              <div className="aspect-video rounded-sm overflow-hidden bg-white/5">
                <img
                  src={settings.course_image_url}
                  alt="Curso Gaby Nails"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-start"
          >
            <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-8">
              <h3 className="font-serif text-2xl text-white mb-2">Quero Atendimento Sobre o Curso</h3>
              <p className="font-sans text-white/50 text-sm font-light mb-8">
                Preencha o formulário e nossa equipe entrará em contato
              </p>

              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h4 className="font-serif text-xl text-white mb-2">Recebemos seu interesse!</h4>
                  <p className="font-sans text-white/60 text-sm mb-6">Entraremos em contato em breve.</p>
                  {gabyWa && (
                    <a
                      href={`https://wa.me/${gabyWa}?text=${encodeURIComponent(`Olá Gaby! Enviei meu interesse pelo curso no site. Meu nome é ${form.name} e meu telefone é ${form.phone}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Falar com a Gaby no WhatsApp
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold"
                  />
                  <Input
                    placeholder="Seu telefone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold"
                  />
                  <Input
                    placeholder="Sua cidade"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold"
                  />
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                    <SelectTrigger className="bg-white/5 border-white/15 text-white">
                      <SelectValue placeholder="Seu nível atual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="ja_atua">Já atuo na área</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Sua principal dúvida"
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold resize-none"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Quero Atendimento'}
                    {!loading && <ArrowRight className="w-3 h-3" />}
                  </button>
                  {gabyWa && (
                    <a
                      href={`https://wa.me/${gabyWa}?text=Olá Gaby! Tenho interesse no curso da Gaby Nails.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 border border-white/20 text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Falar com a Gaby no WhatsApp
                    </a>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQSection({ faqItems }) {
  const sorted = [...(faqItems || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="faq" className="py-20 md:py-32 bg-off-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-10 h-px bg-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal font-medium mb-4">
            Perguntas Frequentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {sorted.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-white border border-champagne/40 rounded-sm px-6 data-[state=open]:border-gold/30 transition-colors duration-300"
              >
                <AccordionTrigger className="font-sans text-charcoal text-sm font-medium hover:text-gold transition-colors py-5 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-charcoal/60 text-sm font-light leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
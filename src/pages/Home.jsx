import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

import SiteHeader from '../components/landing/SiteHeader';
import HeroCarousel from '../components/landing/HeroCarousel';
import AboutSection from '../components/landing/AboutSection';
import ServicesSection from '../components/landing/ServicesSection';
import PortfolioSection from '../components/landing/PortfolioSection';
import CourseSection from '../components/landing/CourseSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import SiteFooter from '../components/landing/SiteFooter';
import WhatsAppFloat from '../components/landing/WhatsAppFloat';

export default function Home() {
  const { data: settingsArr } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list('-updated_date', 1),
    initialData: [],
  });
  const settings = settingsArr[0] ?? {};

  const { data: slides } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: () => base44.entities.HeroSlide.filter({ active: true }),
    initialData: [],
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ active: true }),
    initialData: [],
  });

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.PortfolioItem.filter({ active: true }),
    initialData: [],
  });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ active: true }),
    initialData: [],
  });

  const { data: faqItems } = useQuery({
    queryKey: ['faqItems'],
    queryFn: () => base44.entities.FAQItem.filter({ active: true }),
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-off-white">
      <SiteHeader settings={settings} />
      <HeroCarousel slides={slides} />
      <AboutSection settings={settings} />
      <ServicesSection services={services} />
      <PortfolioSection items={portfolio} />
      <CourseSection settings={settings} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqItems={faqItems} />
      <CTASection settings={settings} />
      <SiteFooter settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} />
    </div>
  );
}
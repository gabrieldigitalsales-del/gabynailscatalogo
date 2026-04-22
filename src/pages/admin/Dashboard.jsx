import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Scissors, Image, GraduationCap, MessageSquare } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-sm border border-champagne/40 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-serif text-3xl text-charcoal font-medium">{value}</p>
      <p className="font-sans text-charcoal/50 text-xs font-light mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: appointments } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => base44.adminEntities.Appointment.list(),
    initialData: [],
  });

  const { data: services } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => base44.adminEntities.Service.list(),
    initialData: [],
  });

  const { data: portfolio } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => base44.adminEntities.PortfolioItem.list(),
    initialData: [],
  });

  const { data: leads } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => base44.adminEntities.CourseInquiry.list(),
    initialData: [],
  });

  const { data: testimonials } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => base44.adminEntities.Testimonial.list(),
    initialData: [],
  });

  const pendingAppointments = appointments.filter(a => a.status === 'pendente');

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal mb-1">Dashboard</h1>
        <p className="font-sans text-charcoal/50 text-sm font-light">
          Painel administrativo da Gaby Nails Esmalteria
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={CalendarDays} label="Agendamentos Pendentes" value={pendingAppointments.length} color="bg-gold/10 text-gold" />
        <StatCard icon={CalendarDays} label="Total de Agendamentos" value={appointments.length} color="bg-champagne/50 text-charcoal/60" />
        <StatCard icon={Scissors} label="Serviços Cadastrados" value={services.length} color="bg-champagne/50 text-charcoal/60" />
        <StatCard icon={Image} label="Itens no Portfólio" value={portfolio.length} color="bg-champagne/50 text-charcoal/60" />
        <StatCard icon={GraduationCap} label="Leads do Curso" value={leads.length} color="bg-gold/10 text-gold" />
        <StatCard icon={MessageSquare} label="Depoimentos" value={testimonials.length} color="bg-champagne/50 text-charcoal/60" />
      </div>

      {/* Recent appointments */}
      {pendingAppointments.length > 0 && (
        <div className="bg-white rounded-sm border border-champagne/40 p-6">
          <h2 className="font-serif text-xl text-charcoal mb-4">Próximos Agendamentos</h2>
          <div className="space-y-3">
            {pendingAppointments.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-champagne/20 last:border-0">
                <div>
                  <p className="font-sans text-sm text-charcoal font-medium">{a.client_name}</p>
                  <p className="font-sans text-xs text-charcoal/50">{a.service_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-charcoal">{a.date}</p>
                  <p className="font-sans text-xs text-gold">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
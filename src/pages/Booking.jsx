import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

import { base44 } from '@/api/base44Client'
import { fetchAvailability } from '@/api/publicApi'
import { Input } from '@/components/ui/input'
import { getFullyBookedDates, isTimeSlotAvailable } from '@/lib/booking'

import ServicePicker from '../components/booking/ServicePicker'
import ProfessionalPicker from '../components/booking/ProfessionalPicker'
import DatePicker from '../components/booking/DatePicker'
import TimePicker from '../components/booking/TimePicker'
import BookingSummary from '../components/booking/BookingSummary'

const STEPS = ['Serviço', 'Profissional', 'Data', 'Horário', 'Confirmar']

export default function Booking() {
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [professional, setProfessional] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedDateKey = date ? format(date, 'yyyy-MM-dd') : null

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ active: true }),
    initialData: [],
  })

  const { data: professionals = [] } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => base44.entities.Professional.filter({ active: true }),
    initialData: [],
  })

  const { data: settingsRows = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list('-updated_date', 1),
    initialData: [],
  })

  const settings = settingsRows[0] ?? {}

  const { data: dayAvailability = { appointments: [], blocks: [] } } = useQuery({
    queryKey: ['public-availability-day', professional?.id, selectedDateKey],
    enabled: Boolean(professional?.id && selectedDateKey),
    queryFn: () => fetchAvailability({ professionalId: professional.id, date: selectedDateKey }),
    initialData: { appointments: [], blocks: [] },
    staleTime: 5_000,
  })

  const { data: rangeAvailability = { appointments: [], blocks: [] } } = useQuery({
    queryKey: ['public-availability-range', professional?.id],
    enabled: Boolean(professional?.id),
    queryFn: () => {
      const start = new Date()
      const end = addDays(start, 60)

      return fetchAvailability({
        professionalId: professional.id,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      })
    },
    initialData: { appointments: [], blocks: [] },
    staleTime: 5_000,
  })

  const existingAppointments = dayAvailability.appointments || []
  const scheduleBlocks = dayAvailability.blocks || []
  const allAppointments = rangeAvailability.appointments || []
  const allBlocks = rangeAvailability.blocks || []

  const fullyBookedDates = useMemo(
    () => getFullyBookedDates({ appointments: allAppointments, blocks: allBlocks }),
    [allAppointments, allBlocks],
  )

  const servicesWhatsapp =
    settings?.services_whatsapp ??
    settings?.whatsapp_staff ??
    settings?.whatsapp ??
    ''

  const resetFromStep = (targetStep) => {
    if (targetStep <= 1) {
      setProfessional(null)
      setDate(null)
      setTime(null)
    } else if (targetStep === 2) {
      setDate(null)
      setTime(null)
    } else if (targetStep === 3) {
      setTime(null)
    }

    setStep(targetStep)
  }

  const refreshBookingData = async (professionalId, dateKey) => {
    const tasks = []

    if (professionalId && dateKey) {
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ['public-availability-day', professionalId, dateKey] }),
      )
    }

    if (professionalId) {
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ['public-availability-range', professionalId] }),
      )
    }

    await Promise.all(tasks)
  }

  const handleConfirm = async () => {
    if (!clientName || !clientPhone) {
      toast.error('Preencha seu nome e telefone')
      return
    }

    if (!service || !professional || !date || !time) {
      toast.error('Complete todas as etapas do agendamento')
      return
    }

    const selectedDate = format(date, 'yyyy-MM-dd')
    setLoading(true)

    try {
      const latestAvailability = await fetchAvailability({
        professionalId: professional.id,
        date: selectedDate,
      })

      const canBookSelectedTime = isTimeSlotAvailable(
        time,
        latestAvailability.appointments,
        latestAvailability.blocks,
        service?.duration || '1h',
      )

      if (!canBookSelectedTime) {
        await refreshBookingData(professional.id, selectedDate)
        toast.error('Esse horário já está indisponível. Escolha outro horário.')
        setTime(null)
        setStep(3)
        return
      }

      await base44.entities.Appointment.create({
        client_name: clientName,
        client_phone: clientPhone,
        service_id: service?.id ?? null,
        service_name: service?.name ?? '',
        professional_id: professional?.id ?? null,
        professional_name: professional?.name ?? '',
        date: selectedDate,
        time,
      })

      await refreshBookingData(professional.id, selectedDate)

      const servicePrice =
        service?.price_from && Number(service.price_from) > 0
          ? `R$ ${Number(service.price_from).toFixed(2).replace('.', ',')}`
          : 'Consultar valor'

      const whatsappMessage = encodeURIComponent(
        `Olá, Eliane! Quero confirmar este agendamento:\n\n` +
        `Nome: ${clientName}\n` +
        `Telefone: ${clientPhone}\n` +
        `Serviço: ${service?.name || '-'}\n` +
        `Profissional: ${professional?.name || '-'}\n` +
        `Data: ${format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}\n` +
        `Horário: ${time || '-'}\n` +
        `Valor: ${servicePrice}`,
      )

      if (servicesWhatsapp) {
        window.location.href = `https://wa.me/${servicesWhatsapp}?text=${whatsappMessage}`
        return
      }

      toast.success('Horário confirmado com sucesso!')
      toast.error('Configure o WhatsApp das funcionárias no admin para finalizar pelo WhatsApp.')
    } catch (error) {
      const message = error?.message || ''
      const alreadyBooked =
        message.includes('duplicate key') ||
        message.includes('gabynails_unique_slot') ||
        message.includes('23505')

      if (alreadyBooked) {
        await refreshBookingData(professional?.id, selectedDate)
        toast.error('Esse horário já foi reservado por outra pessoa. Escolha outro horário.')
        setTime(null)
        setStep(3)
        return
      }

      console.error('Erro ao confirmar agendamento:', error)
      toast.error('Não foi possível confirmar no sistema. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-white border-b border-champagne/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/" className="text-charcoal/60 hover:text-gold transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-xl text-charcoal">Agendar Horário</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12 max-w-lg mx-auto">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-300 ${
                    index <= step ? 'bg-gold text-white' : 'bg-champagne/40 text-charcoal/40'
                  }`}
                >
                  {index < step ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className="text-[9px] font-sans tracking-wider uppercase mt-1.5 text-charcoal/40 hidden sm:block">
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-px mx-1 transition-colors duration-300 ${
                    index < step ? 'bg-gold' : 'bg-champagne/40'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 0 && (
          <ServicePicker
            services={services}
            selected={service}
            onSelect={(selectedService) => {
              setService(selectedService)
              setStep(1)
            }}
          />
        )}

        {step === 1 && (
          <ProfessionalPicker
            professionals={professionals}
            selected={professional}
            onSelect={(selectedProfessional) => {
              setProfessional(selectedProfessional)
              setStep(2)
            }}
          />
        )}

        {step === 2 && (
          <DatePicker
            selected={date}
            fullyBookedDates={fullyBookedDates}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setStep(3)
            }}
          />
        )}

        {step === 3 && (
          <TimePicker
            selected={time}
            onSelect={(selectedTime) => {
              setTime(selectedTime)
              setStep(4)
            }}
            appointments={existingAppointments}
            blockedSlots={scheduleBlocks}
            serviceDuration={service?.duration || '1h'}
          />
        )}

        {step === 4 && (
          <div>
            <div className="max-w-md mx-auto space-y-4 mb-8">
              <h3 className="font-serif text-2xl text-charcoal mb-2">Seus Dados</h3>
              <Input
                placeholder="Seu nome"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                className="bg-white border-champagne/40"
              />
              <Input
                placeholder="Seu telefone"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                className="bg-white border-champagne/40"
              />
            </div>
            <BookingSummary
              service={service}
              professional={professional}
              date={date}
              time={time}
              loading={loading}
              onConfirm={handleConfirm}
            />
          </div>
        )}

        {step > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => resetFromStep(step - 1)}
              className="text-xs font-sans font-medium tracking-widest uppercase text-charcoal/50 hover:text-gold transition-colors"
              type="button"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

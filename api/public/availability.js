import { getSupabaseAdmin, sendJson } from '../admin/_utils.js'

const ACTIVE_APPOINTMENT_STATUSES = ['pendente', 'confirmado']

function getQueryValue(value) {
  if (Array.isArray(value)) return value[0]
  return value
}

function getRangeFromQuery(query) {
  const exactDate = getQueryValue(query.date)
  if (exactDate) {
    return { startDate: exactDate, endDate: exactDate }
  }

  const startDate = getQueryValue(query.startDate)
  const endDate = getQueryValue(query.endDate)

  if (startDate && endDate) {
    return { startDate, endDate }
  }

  throw new Error('Informe uma data ou um intervalo válido para consultar disponibilidade.')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Método não permitido.' })

  try {
    const professionalId = getQueryValue(req.query.professionalId)
    if (!professionalId) {
      return sendJson(res, 400, { error: 'Profissional não informado.' })
    }

    const { startDate, endDate } = getRangeFromQuery(req.query)
    const supabase = getSupabaseAdmin()

    const [{ data: appointments, error: appointmentsError }, { data: blocks, error: blocksError }] = await Promise.all([
      supabase
        .from('gabynails_appointments')
        .select('id,date,time,status,service_id')
        .eq('professional_id', professionalId)
        .gte('date', startDate)
        .lte('date', endDate)
        .in('status', ACTIVE_APPOINTMENT_STATUSES)
        .order('date', { ascending: true })
        .order('time', { ascending: true }),
      supabase
        .from('gabynails_schedule_blocks')
        .select('id,date,time,reason')
        .eq('professional_id', professionalId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true }),
    ])

    if (appointmentsError) throw appointmentsError
    if (blocksError) throw blocksError

    const serviceIds = Array.from(
      new Set((appointments || []).map((appointment) => appointment.service_id).filter(Boolean)),
    )

    let durationsByServiceId = new Map()

    if (serviceIds.length > 0) {
      const { data: services, error: servicesError } = await supabase
        .from('gabynails_services')
        .select('id,duration')
        .in('id', serviceIds)

      if (servicesError) throw servicesError

      durationsByServiceId = new Map((services || []).map((service) => [service.id, service.duration]))
    }

    const appointmentsWithDuration = (appointments || []).map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      service_id: appointment.service_id,
      duration: durationsByServiceId.get(appointment.service_id) || '1h',
    }))

    return sendJson(res, 200, {
      appointments: appointmentsWithDuration,
      blocks: blocks || [],
    })
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Erro ao buscar disponibilidade.' })
  }
}

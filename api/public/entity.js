import { getSupabaseAdmin, getTableName, normalizeSort, sendJson } from '../admin/_utils.js'

const PUBLIC_READ_ENTITIES = new Set([
  'HeroSlide',
  'Service',
  'PortfolioItem',
  'Professional',
  'Testimonial',
  'FAQItem',
  'SiteSettings',
])

const PUBLIC_CREATE_ENTITIES = new Set(['Appointment', 'CourseInquiry'])
const COURSE_LEVELS = new Set(['iniciante', 'ja_atua'])

function applyFilters(query, filters = {}) {
  let nextQuery = query

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined) return

    if (Array.isArray(value)) {
      nextQuery = nextQuery.in(key, value)
      return
    }

    if (value === null) {
      nextQuery = nextQuery.is(key, null)
      return
    }

    nextQuery = nextQuery.eq(key, value)
  })

  return nextQuery
}

function sanitizeString(value, label, { required = false, maxLength = 4000 } = {}) {
  if (value === null || value === undefined) {
    if (required) throw new Error(`${label} é obrigatório.`)
    return ''
  }

  const nextValue = String(value).trim()

  if (required && !nextValue) {
    throw new Error(`${label} é obrigatório.`)
  }

  return nextValue.slice(0, maxLength)
}

function sanitizeNullableString(value, label, options = {}) {
  if (value === null || value === undefined || value === '') return null
  return sanitizeString(value, label, options)
}

function sanitizeAppointmentPayload(data = {}) {
  const date = sanitizeString(data.date, 'Data', { required: true, maxLength: 10 })
  const time = sanitizeString(data.time, 'Horário', { required: true, maxLength: 5 })

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Data inválida.')
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error('Horário inválido.')
  }

  return {
    client_name: sanitizeString(data.client_name, 'Nome', { required: true, maxLength: 120 }),
    client_phone: sanitizeString(data.client_phone, 'Telefone', { required: true, maxLength: 40 }),
    client_email: sanitizeNullableString(data.client_email, 'E-mail', { maxLength: 160 }),
    service_id: sanitizeNullableString(data.service_id, 'Serviço', { maxLength: 120 }),
    service_name: sanitizeString(data.service_name, 'Serviço', { required: true, maxLength: 160 }),
    professional_id: sanitizeNullableString(data.professional_id, 'Profissional', { maxLength: 120 }),
    professional_name: sanitizeNullableString(data.professional_name, 'Profissional', { maxLength: 160 }),
    date,
    time,
    status: 'pendente',
    notes: sanitizeNullableString(data.notes, 'Observações', { maxLength: 2000 }),
  }
}

function sanitizeCourseInquiryPayload(data = {}) {
  const level = data.level ? sanitizeString(data.level, 'Nível', { maxLength: 40 }) : null

  if (level && !COURSE_LEVELS.has(level)) {
    throw new Error('Nível inválido.')
  }

  return {
    name: sanitizeString(data.name, 'Nome', { required: true, maxLength: 120 }),
    phone: sanitizeString(data.phone, 'Telefone', { required: true, maxLength: 40 }),
    city: sanitizeNullableString(data.city, 'Cidade', { maxLength: 120 }),
    level,
    question: sanitizeNullableString(data.question, 'Dúvida', { maxLength: 2000 }),
    status: 'novo',
  }
}

function getCreatePayload(entityName, data) {
  if (entityName === 'Appointment') return sanitizeAppointmentPayload(data)
  if (entityName === 'CourseInquiry') return sanitizeCourseInquiryPayload(data)
  throw new Error('Criação pública não permitida para esta entidade.')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método não permitido.' })

  try {
    const { entityName, action, data, filters, sort, limit } = req.body || {}
    const table = getTableName(entityName)
    const supabase = getSupabaseAdmin()

    if (action === 'list' || action === 'filter') {
      if (!PUBLIC_READ_ENTITIES.has(entityName)) {
        return sendJson(res, 403, { error: 'Leitura pública não permitida para esta entidade.' })
      }

      const effectiveSort = sort || (entityName === 'SiteSettings' ? '-updated_date' : undefined)
      const { column, ascending } = normalizeSort(effectiveSort)
      let query = supabase.from(table).select('*')

      if (action === 'filter') {
        query = applyFilters(query, filters)
      }

      query = query.order(column, { ascending, nullsFirst: false })

      const effectiveLimit = entityName === 'SiteSettings' ? (limit || 1) : limit
      if (effectiveLimit) query = query.limit(effectiveLimit)

      const result = await query
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data || [] })
    }

    if (action === 'create') {
      if (!PUBLIC_CREATE_ENTITIES.has(entityName)) {
        return sendJson(res, 403, { error: 'Criação pública não permitida para esta entidade.' })
      }

      const payload = getCreatePayload(entityName, data)
      const result = await supabase.from(table).insert([payload]).select().single()
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data })
    }

    return sendJson(res, 400, { error: 'Ação inválida.' })
  } catch (error) {
    const isUniqueViolation = error?.code === '23505'
    return sendJson(res, isUniqueViolation ? 409 : 500, {
      error: error.message || 'Erro interno.',
      code: error.code || undefined,
    })
  }
}

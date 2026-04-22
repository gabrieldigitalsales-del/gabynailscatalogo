import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const ENTITY_TABLES = {
  HeroSlide: 'gabynails_hero_slides',
  Service: 'gabynails_services',
  PortfolioItem: 'gabynails_portfolio_items',
  Professional: 'gabynails_professionals',
  Appointment: 'gabynails_appointments',
  Testimonial: 'gabynails_testimonials',
  FAQItem: 'gabynails_faq_items',
  CourseInquiry: 'gabynails_course_inquiries',
  SiteSettings: 'gabynails_site_settings',
  ScheduleBlock: 'gabynails_schedule_blocks',
}

const SESSION_COOKIE = 'gaby_admin_session'

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'asd123'
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY na Vercel.')
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'gabynails-assets'
}

export function getTableName(entityName) {
  const table = ENTITY_TABLES[entityName]
  if (!table) throw new Error(`Entidade inválida: ${entityName}`)
  return table
}

export function parseCookies(req) {
  const header = req.headers.cookie || ''

  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return null
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
      .filter(Boolean),
  )
}

function createSessionToken(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function isAuthenticated(req) {
  const cookies = parseCookies(req)
  return cookies[SESSION_COOKIE] === createSessionToken(getAdminPassword())
}

export function setSessionCookie(res) {
  const token = createSessionToken(getAdminPassword())
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secureFlag}`,
  )
}

export function clearSessionCookie(res) {
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`,
  )
}

export function verifyPassword(password) {
  return password === getAdminPassword()
}

export function sendJson(res, status, payload) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.end(JSON.stringify(payload))
}

export async function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    sendJson(res, 401, { error: 'Não autorizado.' })
    return false
  }
  return true
}

export function normalizeSort(sort) {
  if (!sort) return { column: 'created_at', ascending: false }

  const descending = sort.startsWith('-')
  const rawColumn = sort.replace(/^-/, '')
  const column = rawColumn === 'created_date'
    ? 'created_at'
    : rawColumn === 'updated_date'
      ? 'updated_at'
      : rawColumn

  return { column, ascending: !descending }
}

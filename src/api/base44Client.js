import { adminEntityRequest, adminLogout, adminSession, adminUploadFile } from '@/api/adminApi'
import { publicEntityRequest } from '@/api/publicApi'
import { ENTITY_TABLES } from '@/lib/constants'

const ADMIN_ONLY_READ_ENTITIES = new Set(['Appointment', 'CourseInquiry', 'ScheduleBlock'])
const PUBLIC_CREATE_ENTITIES = new Set(['Appointment', 'CourseInquiry'])

const DEFAULT_FILTER_SORTS = {
  HeroSlide: 'order',
  Service: 'order',
  PortfolioItem: 'order',
  Professional: 'order',
  Testimonial: 'order',
  FAQItem: 'order',
  ScheduleBlock: 'time',
  Appointment: 'time',
  CourseInquiry: '-created_date',
  SiteSettings: '-updated_date',
}

function getDefaultFilterSort(entityName) {
  return DEFAULT_FILTER_SORTS[entityName] || '-created_date'
}

function publicEntity(entityName) {
  return {
    async list(sort, limit) {
      const result = await publicEntityRequest(entityName, 'list', { sort, limit })
      return result.data || []
    },
    async filter(filters, sort, limit) {
      const effectiveSort = sort || getDefaultFilterSort(entityName)
      const result = await publicEntityRequest(entityName, 'filter', { filters, sort: effectiveSort, limit })
      return result.data || []
    },
    async create(data) {
      if (!PUBLIC_CREATE_ENTITIES.has(entityName)) {
        throw new Error(`Criação pública não permitida para ${entityName}.`)
      }

      const result = await publicEntityRequest(entityName, 'create', { data })
      return result.data
    },
    async update() {
      throw new Error('Atualização pública não permitida.')
    },
    async delete() {
      throw new Error('Exclusão pública não permitida.')
    },
  }
}

function adminEntity(entityName) {
  return {
    async list(sort, limit) {
      const result = await adminEntityRequest(entityName, 'list', { sort, limit })
      return result.data || []
    },
    async filter(filters, sort, limit) {
      const effectiveSort = sort || getDefaultFilterSort(entityName)
      const result = await adminEntityRequest(entityName, 'filter', { filters, sort: effectiveSort, limit })
      return result.data || []
    },
    async create(data) {
      const result = await adminEntityRequest(entityName, 'create', { data })
      return result.data
    },
    async update(id, data) {
      const result = await adminEntityRequest(entityName, 'update', { id, data })
      return result.data
    },
    async delete(id) {
      const result = await adminEntityRequest(entityName, 'delete', { id })
      return result.data
    },
    async saveSingleton(data) {
      const result = await adminEntityRequest(entityName, 'saveSingleton', { data })
      return result.data
    },
  }
}

export const base44 = {
  entities: Object.fromEntries(
    Object.keys(ENTITY_TABLES)
      .filter((entityName) => !ADMIN_ONLY_READ_ENTITIES.has(entityName) || PUBLIC_CREATE_ENTITIES.has(entityName))
      .map((entityName) => [entityName, publicEntity(entityName)]),
  ),
  adminEntities: Object.fromEntries(
    Object.keys(ENTITY_TABLES).map((entityName) => [entityName, adminEntity(entityName)]),
  ),
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const result = await adminUploadFile(file)
        return { file_url: result.file_url }
      },
    },
  },
  auth: {
    async me() {
      const result = await adminSession()
      if (!result.authenticated) {
        throw new Error('Não autenticado')
      }
      return { role: 'admin', authenticated: true }
    },
    async logout() {
      await adminLogout()
    },
    redirectToLogin() {
      window.location.href = '/admin'
    },
  },
}

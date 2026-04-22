import { getSupabaseAdmin, getTableName, normalizeSort, requireAuth, sendJson } from './_utils.js'

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

async function saveSingletonEntity({ supabase, table, data }) {
  const payload = { ...data, updated_at: new Date().toISOString() }

  const existingResult = await supabase
    .from(table)
    .select('*')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false, nullsFirst: false })
    .limit(1)

  if (existingResult.error) throw existingResult.error

  const current = existingResult.data?.[0]

  let saved
  if (current?.id) {
    const updateResult = await supabase.from(table).update(payload).eq('id', current.id).select().single()
    if (updateResult.error) throw updateResult.error
    saved = updateResult.data
  } else {
    const createResult = await supabase.from(table).insert([payload]).select().single()
    if (createResult.error) throw createResult.error
    saved = createResult.data
  }

  const duplicatesResult = await supabase
    .from(table)
    .select('id')
    .neq('id', saved.id)

  if (duplicatesResult.error) throw duplicatesResult.error

  const duplicateIds = (duplicatesResult.data || []).map((item) => item.id).filter(Boolean)
  if (duplicateIds.length > 0) {
    const cleanupResult = await supabase.from(table).delete().in('id', duplicateIds)
    if (cleanupResult.error) throw cleanupResult.error
  }

  return saved
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método não permitido.' })
  if (!(await requireAuth(req, res))) return

  try {
    const { entityName, action, id, data, filters, sort, limit } = req.body || {}
    const table = getTableName(entityName)
    const supabase = getSupabaseAdmin()

    if (action === 'list') {
      const { column, ascending } = normalizeSort(sort)
      let query = supabase.from(table).select('*').order(column, { ascending, nullsFirst: false })
      if (limit) query = query.limit(limit)
      const result = await query
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data || [] })
    }

    if (action === 'filter') {
      const { column, ascending } = normalizeSort(sort)
      let query = supabase.from(table).select('*')
      query = applyFilters(query, filters)
      query = query.order(column, { ascending, nullsFirst: false })
      if (limit) query = query.limit(limit)
      const result = await query
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data || [] })
    }

    if (action === 'create') {
      const result = await supabase.from(table).insert([data]).select().single()
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data })
    }

    if (action === 'saveSingleton') {
      const saved = await saveSingletonEntity({ supabase, table, data })
      return sendJson(res, 200, { data: saved })
    }

    if (action === 'update') {
      const payload = { ...data, updated_at: new Date().toISOString() }
      const result = await supabase.from(table).update(payload).eq('id', id).select().single()
      if (result.error) throw result.error
      return sendJson(res, 200, { data: result.data })
    }

    if (action === 'delete') {
      const result = await supabase.from(table).delete().eq('id', id).select().single()
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

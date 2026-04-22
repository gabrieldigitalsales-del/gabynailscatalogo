async function parseResponse(response) {
  const text = await response.text()

  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Erro na requisição pública.')
  }

  return data
}

export async function publicEntityRequest(entityName, action, payload = {}) {
  const response = await fetch('/api/public/entity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entityName, action, ...payload }),
  })

  return parseResponse(response)
}

export async function fetchAvailability({ professionalId, date, startDate, endDate }) {
  const params = new URLSearchParams()

  if (professionalId) params.set('professionalId', professionalId)
  if (date) params.set('date', date)
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)

  const response = await fetch(`/api/public/availability?${params.toString()}`, {
    method: 'GET',
  })

  return parseResponse(response)
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

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
    throw new Error(data?.error || 'Erro na requisição administrativa.')
  }

  return data
}

export async function adminLogin(password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  return parseResponse(response)
}

export async function adminLogout() {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  })
  return parseResponse(response)
}

export async function adminSession() {
  const response = await fetch('/api/admin/session', {
    method: 'GET',
    credentials: 'include',
  })
  return parseResponse(response)
}

export async function adminEntityRequest(entityName, action, payload = {}) {
  const response = await fetch('/api/admin/entity', {
    method: 'POST',
    headers: JSON_HEADERS,
    credentials: 'include',
    body: JSON.stringify({ entityName, action, ...payload }),
  })
  return parseResponse(response)
}

export async function adminUploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  return parseResponse(response)
}

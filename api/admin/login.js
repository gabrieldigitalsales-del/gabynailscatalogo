import { sendJson, setSessionCookie, verifyPassword } from './_utils.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método não permitido.' })
  const { password } = req.body || {}
  if (!verifyPassword(password)) return sendJson(res, 401, { error: 'Senha inválida.' })
  setSessionCookie(res)
  return sendJson(res, 200, { ok: true, authenticated: true })
}

import { isAuthenticated, sendJson } from './_utils.js'

export default async function handler(req, res) {
  return sendJson(res, 200, { authenticated: isAuthenticated(req) })
}

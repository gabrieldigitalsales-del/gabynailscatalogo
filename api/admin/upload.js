import { randomUUID } from 'node:crypto'
import { readFile, unlink } from 'node:fs/promises'
import formidable from 'formidable'
import { getStorageBucket, getSupabaseAdmin, requireAuth, sendJson } from './_utils.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

function parseMultipartForm(req) {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    allowEmptyFiles: false,
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }

      resolve({ fields, files })
    })
  })
}

function getSingleFile(files) {
  const entry = files?.file
  if (!entry) return null
  return Array.isArray(entry) ? entry[0] : entry
}

function getFileExtension(filename = '') {
  const extension = filename.includes('.') ? filename.split('.').pop() : 'bin'
  return String(extension || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método não permitido.' })
  if (!(await requireAuth(req, res))) return

  let uploadedFile = null

  try {
    const { files } = await parseMultipartForm(req)
    uploadedFile = getSingleFile(files)

    if (!uploadedFile) {
      return sendJson(res, 400, { error: 'Arquivo não encontrado.' })
    }

    if (!uploadedFile.mimetype?.startsWith('image/')) {
      return sendJson(res, 400, { error: 'Envie apenas imagens válidas.' })
    }

    const fileBuffer = await readFile(uploadedFile.filepath)
    const supabase = getSupabaseAdmin()
    const bucket = getStorageBucket()
    const extension = getFileExtension(uploadedFile.originalFilename)
    const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`

    const uploadResult = await supabase.storage.from(bucket).upload(path, fileBuffer, {
      contentType: uploadedFile.mimetype,
      cacheControl: '31536000',
      upsert: false,
    })

    if (uploadResult.error) throw uploadResult.error

    const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(path)
    return sendJson(res, 200, { file_url: publicUrlResult.data.publicUrl, path })
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Falha ao enviar imagem.' })
  } finally {
    if (uploadedFile?.filepath) {
      await unlink(uploadedFile.filepath).catch(() => {})
    }
  }
}

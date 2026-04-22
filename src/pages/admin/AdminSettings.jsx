import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { base44 } from '@/api/base44Client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const MAX_IMAGE_SIZE_MB = 10

const EMPTY_FORM = {
  brand_name: '',
  tagline: '',
  about_title: '',
  about_text: '',
  about_image_url: '',
  course_title: '',
  course_subtitle: '',
  course_text: '',
  course_image_url: '',
  course_benefits: '',
  course_modules: '',
  cta_title: '',
  cta_subtitle: '',
  address: '',
  phone: '',
  whatsapp: '',
  whatsapp_staff: '',
  whatsapp_gaby: '',
  services_whatsapp: '',
  course_whatsapp: '',
  instagram: '',
  working_hours: '',
  maps_embed_url: '',
}

function validateImageFile(file) {
  if (!file) {
    throw new Error('Selecione uma imagem válida.')
  }

  if (!file.type?.startsWith('image/')) {
    throw new Error('Envie apenas arquivos de imagem.')
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`)
  }
}

function coalesceWhatsapp(primary, fallback) {
  if (primary !== null && primary !== undefined && primary !== '') return primary
  if (fallback !== null && fallback !== undefined && fallback !== '') return fallback
  return ''
}

function normalizeSettings(settings) {
  if (!settings) return { ...EMPTY_FORM }

  return {
    ...EMPTY_FORM,
    ...settings,
    whatsapp_staff: coalesceWhatsapp(settings.whatsapp_staff, settings.services_whatsapp),
    services_whatsapp: coalesceWhatsapp(settings.services_whatsapp, settings.whatsapp_staff),
    whatsapp_gaby: coalesceWhatsapp(settings.whatsapp_gaby, settings.course_whatsapp),
    course_whatsapp: coalesceWhatsapp(settings.course_whatsapp, settings.whatsapp_gaby),
  }
}

function ImageField({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
      setUploading(true)
      const { file_url } = await base44.integrations.Core.UploadFile({ file })
      onChange(file_url)
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error(error?.message || 'Falha ao enviar imagem.')
    } finally {
      setUploading(false)
      input.value = ''
    }
  }

  return (
    <div>
      <label className="text-xs font-sans text-charcoal/60 mb-1 block">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="w-20 h-14 rounded-sm overflow-hidden bg-champagne/20 shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-14 rounded-sm bg-champagne/20 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4 text-charcoal/30" />
          </div>
        )}
        <label className="cursor-pointer px-4 py-2 bg-champagne/30 text-charcoal/70 text-xs font-sans rounded-sm hover:bg-champagne/50 transition-colors">
          {uploading ? 'Enviando...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-charcoal/40 hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, multiline = false }) {
  return (
    <div>
      <label className="text-xs font-sans text-charcoal/60 mb-1 block">{label}</label>
      {multiline ? (
        <Textarea
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="bg-white border-champagne/40 resize-none"
          rows={3}
        />
      ) : (
        <Input
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="bg-white border-champagne/40"
        />
      )}
    </div>
  )
}

export default function AdminSettings() {
  const queryClient = useQueryClient()

  const {
    data: settingsArr = [],
    error: settingsError,
  } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => base44.adminEntities.SiteSettings.list('-updated_date', 1),
    initialData: [],
  })

  const existing = settingsArr[0]
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (existing) {
      setForm(normalizeSettings(existing))
    }
  }, [existing])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const normalizedForm = normalizeSettings(form)
      const { id, created_at, updated_at, ...raw } = normalizedForm
      const payload = {
        ...raw,
        whatsapp_staff: coalesceWhatsapp(raw.whatsapp_staff, raw.services_whatsapp),
        services_whatsapp: coalesceWhatsapp(raw.services_whatsapp, raw.whatsapp_staff),
        whatsapp_gaby: coalesceWhatsapp(raw.whatsapp_gaby, raw.course_whatsapp),
        course_whatsapp: coalesceWhatsapp(raw.course_whatsapp, raw.whatsapp_gaby),
      }

      return base44.adminEntities.SiteSettings.saveSingleton(payload)
    },
    onSuccess: async (saved) => {
      const normalized = normalizeSettings(saved)
      setForm(normalized)
      queryClient.setQueryData(['admin-settings'], [saved])
      queryClient.setQueryData(['siteSettings'], [saved])
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] }),
        queryClient.invalidateQueries({ queryKey: ['siteSettings'] }),
      ])
      toast.success('Configurações salvas!')
    },
    onError: (error) => {
      console.error(error)
      toast.error(error?.message || 'Erro ao salvar configurações.')
    },
  })

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Configurações</h1>
          <p className="font-sans text-sm text-charcoal/50 mt-1">Tudo que você salvar aqui precisa permanecer após atualizar.</p>
        </div>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
          type="button"
        >
          <Save className="w-3 h-3" />
          {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {settingsError && (
        <div className="mb-6 rounded-sm border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-sans text-sm font-medium">Não consegui carregar as configurações já salvas.</p>
              <p className="font-sans text-xs mt-1 break-words">{settingsError.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-white rounded-sm border border-champagne/40 p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal border-b border-champagne/20 pb-3">Marca</h2>
          <Field label="Nome da Marca" value={form.brand_name} onChange={(value) => setField('brand_name', value)} />
          <Field label="Tagline" value={form.tagline} onChange={(value) => setField('tagline', value)} />
        </div>

        <div className="bg-white rounded-sm border border-champagne/40 p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal border-b border-champagne/20 pb-3">Sobre</h2>
          <Field label="Título" value={form.about_title} onChange={(value) => setField('about_title', value)} />
          <Field label="Texto" value={form.about_text} onChange={(value) => setField('about_text', value)} multiline />
          <ImageField label="Imagem Sobre" value={form.about_image_url} onChange={(value) => setField('about_image_url', value)} />
        </div>

        <div className="bg-white rounded-sm border border-champagne/40 p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal border-b border-champagne/20 pb-3">Curso</h2>
          <Field label="Título" value={form.course_title} onChange={(value) => setField('course_title', value)} />
          <Field label="Subtítulo" value={form.course_subtitle} onChange={(value) => setField('course_subtitle', value)} />
          <Field label="Texto" value={form.course_text} onChange={(value) => setField('course_text', value)} multiline />
          <Field label="Benefícios (separados por |)" value={form.course_benefits} onChange={(value) => setField('course_benefits', value)} multiline />
          <Field label="Módulos (separados por |)" value={form.course_modules} onChange={(value) => setField('course_modules', value)} multiline />
          <ImageField label="Imagem Curso" value={form.course_image_url} onChange={(value) => setField('course_image_url', value)} />
        </div>

        <div className="bg-white rounded-sm border border-champagne/40 p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal border-b border-champagne/20 pb-3">CTA Final</h2>
          <Field label="Título" value={form.cta_title} onChange={(value) => setField('cta_title', value)} />
          <Field label="Subtítulo" value={form.cta_subtitle} onChange={(value) => setField('cta_subtitle', value)} />
        </div>

        <div className="bg-white rounded-sm border border-champagne/40 p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal border-b border-champagne/20 pb-3">Contato</h2>
          <Field label="Endereço" value={form.address} onChange={(value) => setField('address', value)} />
          <Field label="Telefone" value={form.phone} onChange={(value) => setField('phone', value)} />
          <Field label="WhatsApp flutuante do site (apenas números)" value={form.whatsapp} onChange={(value) => setField('whatsapp', value)} />
          <Field
            label="WhatsApp das Funcionárias — agendamento (apenas números)"
            value={form.whatsapp_staff}
            onChange={(value) => {
              setField('whatsapp_staff', value)
              setField('services_whatsapp', value)
            }}
          />
          <Field
            label="WhatsApp da Gaby — curso (apenas números)"
            value={form.whatsapp_gaby}
            onChange={(value) => {
              setField('whatsapp_gaby', value)
              setField('course_whatsapp', value)
            }}
          />
          <Field label="Instagram (URL)" value={form.instagram} onChange={(value) => setField('instagram', value)} />
          <Field label="Horário de Funcionamento" value={form.working_hours} onChange={(value) => setField('working_hours', value)} />
          <Field label="Google Maps Embed URL" value={form.maps_embed_url} onChange={(value) => setField('maps_embed_url', value)} />
        </div>
      </div>
    </div>
  )
}

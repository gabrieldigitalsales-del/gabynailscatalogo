import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { base44 } from '@/api/base44Client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const MAX_IMAGE_SIZE_MB = 10
const PUBLIC_QUERY_KEYS_BY_ENTITY = {
  HeroSlide: ['heroSlides'],
  Service: ['services'],
  PortfolioItem: ['portfolio'],
  Professional: ['professionals'],
  Testimonial: ['testimonials'],
  FAQItem: ['faqItems'],
  SiteSettings: ['siteSettings'],
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

async function invalidateEntityQueries(queryClient, queryKey, entityName) {
  const relatedQueryKeys = [queryKey, ...(PUBLIC_QUERY_KEYS_BY_ENTITY[entityName] || [])]

  await Promise.all(
    relatedQueryKeys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  )
}

function ImageUpload({ value, onChange, label }) {
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
          <div className="w-16 h-16 rounded-sm overflow-hidden bg-champagne/20 shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-sm bg-champagne/20 flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4 text-charcoal/30" />
          </div>
        )}

        <label className="cursor-pointer px-4 py-2 bg-champagne/30 text-charcoal/70 text-xs font-sans rounded-sm hover:bg-champagne/50 transition-colors">
          {uploading ? 'Enviando...' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            onClick={() => onChange('')}
            className="text-charcoal/40 hover:text-destructive transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminCRUD({ title, entityName, queryKey, items, fields, getDisplayFields }) {
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({})
  const queryClient = useQueryClient()

  const entity = base44.adminEntities[entityName]

  const createMutation = useMutation({
    mutationFn: (data) => entity.create(data),
    onSuccess: async () => {
      await invalidateEntityQueries(queryClient, queryKey, entityName)
      setEditing(null)
      toast.success('Criado com sucesso!')
    },
    onError: (error) => {
      console.error(error)
      toast.error(error?.message || 'Não foi possível criar o item.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entity.update(id, data),
    onSuccess: async () => {
      await invalidateEntityQueries(queryClient, queryKey, entityName)
      setEditing(null)
      toast.success('Atualizado!')
    },
    onError: (error) => {
      console.error(error)
      toast.error(error?.message || 'Não foi possível salvar as alterações.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => entity.delete(id),
    onSuccess: async () => {
      await invalidateEntityQueries(queryClient, queryKey, entityName)
      toast.success('Removido!')
    },
    onError: (error) => {
      console.error(error)
      toast.error(error?.message || 'Não foi possível remover o item.')
    },
  })

  const isSaving = createMutation.isPending || updateMutation.isPending

  const openNew = () => {
    const defaults = {}
    fields.forEach((field) => {
      defaults[field.name] = field.default ?? ''
    })
    setFormData(defaults)
    setEditing('new')
  }

  const openEdit = (item) => {
    const data = {}
    fields.forEach((field) => {
      data[field.name] = item[field.name] ?? field.default ?? ''
    })
    setFormData({ ...data, _id: item.id })
    setEditing('edit')
  }

  const handleDelete = (itemId) => {
    const confirmed = window.confirm('Tem certeza que deseja remover este item?')
    if (!confirmed) return
    deleteMutation.mutate(itemId)
  }

  const handleSave = () => {
    if (editing === 'new') {
      createMutation.mutate(formData)
      return
    }

    const { _id, ...data } = formData
    updateMutation.mutate({ id: _id, data })
  }

  const renderField = (field) => {
    const value = formData[field.name] ?? ''

    if (field.type === 'image') {
      return (
        <ImageUpload
          key={field.name}
          value={value}
          onChange={(nextValue) => setFormData({ ...formData, [field.name]: nextValue })}
          label={field.label}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <div key={field.name}>
          <label className="text-xs font-sans text-charcoal/60 mb-1 block">{field.label}</label>
          <Select value={value} onValueChange={(nextValue) => setFormData({ ...formData, [field.name]: nextValue })}>
            <SelectTrigger className="bg-white border-champagne/40">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name}>
          <label className="text-xs font-sans text-charcoal/60 mb-1 block">{field.label}</label>
          <Textarea
            value={value}
            onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
            className="bg-white border-champagne/40 resize-none"
            rows={3}
          />
        </div>
      )
    }

    if (field.type === 'number') {
      return (
        <div key={field.name}>
          <label className="text-xs font-sans text-charcoal/60 mb-1 block">{field.label}</label>
          <Input
            type="number"
            value={value}
            onChange={(event) => {
              const parsedValue = Number.parseFloat(event.target.value)
              setFormData({
                ...formData,
                [field.name]: Number.isNaN(parsedValue) ? 0 : parsedValue,
              })
            }}
            className="bg-white border-champagne/40"
          />
        </div>
      )
    }

    if (field.type === 'boolean') {
      return (
        <div key={field.name} className="flex items-center justify-between">
          <label className="text-xs font-sans text-charcoal/60">{field.label}</label>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(nextValue) => setFormData({ ...formData, [field.name]: nextValue })}
          />
        </div>
      )
    }

    return (
      <div key={field.name}>
        <label className="text-xs font-sans text-charcoal/60 mb-1 block">{field.label}</label>
        <Input
          value={value}
          onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
          className="bg-white border-champagne/40"
        />
      </div>
    )
  }

  const displayFields = getDisplayFields || ((item) => [{ label: fields[0]?.label, value: item[fields[0]?.name] }])

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-charcoal">{title}</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-colors"
          type="button"
        >
          <Plus className="w-3 h-3" />
          Adicionar
        </button>
      </div>

      <div className="space-y-2">
        {(items || []).map((item) => {
          const previewUrl = item.image_url || item.photo_url

          return (
            <div
              key={item.id}
              className="bg-white rounded-sm border border-champagne/40 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {previewUrl && (
                  <div className="w-12 h-12 rounded-sm overflow-hidden bg-champagne/20 shrink-0">
                    <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {displayFields(item).map((displayField, index) => (
                    <p
                      key={`${item.id}-${index}`}
                      className={`font-sans text-sm truncate ${
                        index === 0 ? 'text-charcoal font-medium' : 'text-charcoal/50 text-xs'
                      }`}
                    >
                      {displayField.value}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 text-charcoal/40 hover:text-gold transition-colors"
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-charcoal/40 hover:text-destructive transition-colors"
                  type="button"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}

        {(!items || items.length === 0) && (
          <div className="text-center py-12 text-charcoal/40 font-sans text-sm">Nenhum item cadastrado</div>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-off-white rounded-sm border border-champagne/40 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-champagne/30">
              <h2 className="font-serif text-xl text-charcoal">{editing === 'new' ? 'Novo Item' : 'Editar Item'}</h2>
              <button onClick={() => setEditing(null)} className="text-charcoal/40 hover:text-charcoal" type="button">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">{fields.map(renderField)}</div>
            <div className="p-6 border-t border-champagne/30 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2 text-xs font-sans tracking-widest uppercase text-charcoal/50 hover:text-charcoal transition-colors"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-60"
                type="button"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

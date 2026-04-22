import React, { useState } from 'react'
import { LockKeyhole, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { Input } from '@/components/ui/input'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const { login, isLoadingAuth } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    const result = await login(password)
    if (!result.success) {
      setLocalError(result.error?.message || 'Não foi possível entrar no admin.')
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-champagne/40 rounded-sm p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <LockKeyhole className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-2">Área Admin</h1>
          <p className="font-sans text-sm text-charcoal/60">Digite a senha para acessar o painel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-sans text-charcoal/60 mb-1 block">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha do admin"
              className="bg-white border-champagne/40"
            />
          </div>

          {(localError) && (
            <div className="text-sm text-destructive font-sans">{localError}</div>
          )}

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gold text-white text-xs font-sans font-medium tracking-widest uppercase rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {isLoadingAuth ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

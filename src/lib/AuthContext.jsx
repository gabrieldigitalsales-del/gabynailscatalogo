import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { adminLogin, adminLogout, adminSession } from '@/api/adminApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  const [authError, setAuthError] = useState(null)

  const checkSession = useCallback(async () => {
    setIsLoadingAuth(true)

    try {
      const result = await adminSession()
      setIsAuthenticated(Boolean(result.authenticated))
      setAuthError(null)
      return Boolean(result.authenticated)
    } catch {
      setIsAuthenticated(false)
      setAuthError(null)
      return false
    } finally {
      setIsLoadingAuth(false)
    }
  }, [])

  const login = useCallback(async (password) => {
    setIsLoadingAuth(true)

    try {
      await adminLogin(password)
      setIsAuthenticated(true)
      setAuthError(null)
      return { success: true }
    } catch (error) {
      setIsAuthenticated(false)
      setAuthError({ type: 'invalid_password', message: error.message })
      return { success: false, error }
    } finally {
      setIsLoadingAuth(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminLogout()
    } finally {
      setIsAuthenticated(false)
      setAuthError(null)
    }
  }, [])

  const value = useMemo(() => ({
    isAuthenticated,
    isLoadingAuth,
    authError,
    login,
    logout,
    checkSession,
  }), [authError, checkSession, isAuthenticated, isLoadingAuth, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

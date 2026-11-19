import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { clearAccessToken, setAccessToken, setUnauthorizedHandler } from '../../lib/api/client'
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../../features/auth/authApi'
import type { LoginInput, RegisterInput } from '../../features/auth/authApi'

export type UserRole = 'user' | 'admin'

export type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: { role: UserRole } }

const guestAuthState: AuthState = { status: 'guest' }

type AuthContextValue = AuthState & {
  postLoginRedirect?: '/guild' | '/onboarding'
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<{ redirectTo: '/guild' | '/onboarding' }>
  logout: () => Promise<{ serverRevoked: boolean }>
}

const AuthStateContext = createContext<AuthContextValue | null>(null)

interface AuthStateProviderProps extends PropsWithChildren {
  /** Provides controlled state for routing tests; production never supplies this prop. */
  state?: AuthState
}

/**
 * Passport token and the registration-onboarding marker both remain in memory.
 */
export function AuthStateProvider({ state: injectedState, children }: AuthStateProviderProps) {
  const queryClient = useQueryClient()
  const [authState, setAuthState] = useState<AuthState>(injectedState ?? guestAuthState)
  const onboardingEmailRef = useRef<string | null>(null)
  const [postLoginRedirect, setPostLoginRedirect] = useState<'/guild' | '/onboarding' | undefined>()
  const isTestDouble = injectedState !== undefined

  const resetSession = useCallback(() => {
    clearAccessToken()
    queryClient.clear()
    setPostLoginRedirect(undefined)
    setAuthState(guestAuthState)
  }, [queryClient])

  useEffect(() => {
    if (isTestDouble) return undefined
    setUnauthorizedHandler(resetSession)
    return () => setUnauthorizedHandler(undefined)
  }, [isTestDouble, resetSession])

  const register = useCallback(async (input: RegisterInput) => {
    const user = await registerRequest(input)
    onboardingEmailRef.current = user.email.toLowerCase()
  }, [])

  const login = useCallback(async (input: LoginInput): Promise<{ redirectTo: '/guild' | '/onboarding' }> => {
    try {
      const token = await loginRequest(input)
      setAccessToken(token.access_token)
      const user = await getCurrentUser()
      queryClient.setQueryData(['auth', 'user'], user)
      const isNewlyRegistered = onboardingEmailRef.current === user.email.toLowerCase()
      onboardingEmailRef.current = null
      const redirectTo = isNewlyRegistered ? '/onboarding' : '/guild'
      setPostLoginRedirect(redirectTo)
      setAuthState({ status: 'authenticated', user: { role: user.role as UserRole } })
      return { redirectTo }
    } catch (error) {
      resetSession()
      throw error
    }
  }, [queryClient, resetSession])

  const logout = useCallback(async () => {
    let serverRevoked = true
    try {
      await logoutRequest()
    } catch {
      serverRevoked = false
    } finally {
      resetSession()
      onboardingEmailRef.current = null
    }
    return { serverRevoked }
  }, [resetSession])

  const value = useMemo<AuthContextValue>(() => {
    if (isTestDouble) {
      return {
        ...(injectedState ?? guestAuthState),
        postLoginRedirect: undefined,
        register: async () => undefined,
        login: async () => ({ redirectTo: '/guild' as const }),
        logout: async () => ({ serverRevoked: true }),
      }
    }
    return { ...authState, postLoginRedirect, register, login, logout }
  }, [authState, injectedState, isTestDouble, login, logout, postLoginRedirect, register])

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>
}

export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) throw new Error('useAuthState must be used within AuthStateProvider')
  return context
}

export function useAuth() {
  return useAuthState()
}

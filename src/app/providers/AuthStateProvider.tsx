import { createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'

export type UserRole = 'user' | 'admin'

export type AuthState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; user: { role: UserRole } }

const guestAuthState: AuthState = { status: 'guest' }

const AuthStateContext = createContext<AuthState>(guestAuthState)

interface AuthStateProviderProps extends PropsWithChildren {
  state?: AuthState
}

/**
 * Routing-only authentication contract. Phase 3B will provide this state from
 * its real authentication context; the default intentionally remains guest.
 */
export function AuthStateProvider({ state = guestAuthState, children }: AuthStateProviderProps) {
  return <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
}

export function useAuthState() {
  return useContext(AuthStateContext)
}

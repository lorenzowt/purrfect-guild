import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { EmptyState, LoadingIndicator } from '../../components/ui'
import { useAuthState } from '../providers/AuthStateProvider'

export function RequireAuth() {
  const authState = useAuthState()
  const location = useLocation()

  if (authState.status === 'loading') return <RouteLoading />
  if (authState.status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}

export function RequireGuest() {
  const authState = useAuthState()

  if (authState.status === 'loading') return <RouteLoading />
  if (authState.status === 'authenticated') return <Navigate to={authState.postLoginRedirect ?? '/guild'} replace />

  return <Outlet />
}

export function RequireAdmin() {
  const authState = useAuthState()
  const location = useLocation()

  if (authState.status === 'loading') return <RouteLoading />
  if (authState.status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />
  if (authState.user.role !== 'admin') return <AccessDenied />

  return <Outlet />
}

export function RouteLoading() {
  return <main className="grid min-h-screen place-items-center bg-vanilla-cream p-6"><LoadingIndicator label="Opening the guild gates…" size="lg" /></main>
}

export function AccessDenied() {
  return <main className="grid min-h-screen place-items-center bg-vanilla-cream p-6"><div className="w-full max-w-xl"><EmptyState title="Guild doors locked" description="Only the Guild Master may enter this part of the hall." /></div></main>
}

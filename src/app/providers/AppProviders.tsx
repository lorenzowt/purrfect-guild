import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type PropsWithChildren } from 'react'
import { AuthStateProvider } from './AuthStateProvider'
import type { AuthState } from './AuthStateProvider'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

interface AppProvidersProps extends PropsWithChildren {
  authState?: AuthState
}

export function AppProviders({ children, authState }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)
  return <QueryClientProvider client={queryClient}><AuthStateProvider state={authState}>{children}</AuthStateProvider></QueryClientProvider>
}

import { render, screen } from '@testing-library/react'
import { App } from '../src/app/App'
import { apiClient, clearAccessToken, setAccessToken } from '../src/lib/api/client'

describe('project foundation', () => {
  afterEach(() => clearAccessToken())

  it('renders the application shell', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Purrfect Guild' })).toBeInTheDocument()
  })

  it('uses the configured API client with an in-memory bearer token', async () => {
    setAccessToken('test-access-token')

    const response = await apiClient.get('/users/me')

    expect(response.data.data.name).toBe('Test Guildmaster')
  })
})

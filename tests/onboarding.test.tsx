import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'

const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }

function renderRoute(path: string) {
  return render(
    <AppProviders authState={authenticatedUser}>
      <MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter>
    </AppProviders>,
  )
}

describe('player onboarding', () => {
  it('moves forward and backward through the keeper dialogue', async () => {
    const user = userEvent.setup()
    renderRoute('/onboarding')

    expect(screen.getByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { name: 'Adventurers’ Corner' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()
  })

  it('supports keyboard activation and skip returns to the Guild Hall', async () => {
    const user = userEvent.setup()
    renderRoute('/onboarding')

    const next = screen.getByRole('button', { name: 'Next' })
    next.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { name: 'Adventurers’ Corner' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Skip tour' }))
    expect(await screen.findByRole('heading', { name: 'Guild Hall' })).toBeInTheDocument()
  })

  it('finishes the final step by returning to the Guild Hall', async () => {
    const user = userEvent.setup()
    renderRoute('/onboarding')

    for (let step = 0; step < 7; step += 1) await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { name: 'The guild is yours' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Explore the Guild Hall' }))
    expect(await screen.findByRole('heading', { name: 'Guild Hall' })).toBeInTheDocument()
  })

  it('allows replay from the tavern keeper and profile page', async () => {
    const user = userEvent.setup()
    const guild = renderRoute('/guild')

    await user.click(await screen.findByRole('link', { name: /Visit Retired Tavern Keeper/i }))
    expect(await screen.findByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()

    guild.unmount()
    renderRoute('/profile')
    await user.click(screen.getByRole('link', { name: 'Replay Bramble’s welcome tour' }))
    expect(await screen.findByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()
  })
})

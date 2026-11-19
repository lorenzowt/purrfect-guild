import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import type { Hero } from '../src/features/heroes/heroesApi'
import type { Mission } from '../src/features/missions/missionsApi'
import { MissionOutcome } from '../src/features/missions/MissionOutcome'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }
const baseMission: Mission = { id: 1, status: 'assigned', quest: { id: 9, title: 'The Clockwork Catacombs' }, heroes: [{ id: 3, name: 'Biscuit' }], completed_at: null, created_at: '2026-01-01T00:00:00Z' }
const beforeHero: Hero = { id: 3, name: 'Biscuit', hero_class: 'warrior', level: 3, status: 'on_mission', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }

function renderDetail() {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={['/missions/1']}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function missionHandler(current: { mission: Mission }) {
  server.use(http.get(`${apiUrl}/missions/1`, () => HttpResponse.json({ data: current.mission, message: 'Mission retrieved successfully.' })))
}

describe('mission resolution', () => {
  it('uses Laravel completion, then renders a confirmed successful outcome and hero changes', async () => {
    const user = userEvent.setup()
    const current = { mission: baseMission }
    let heroReads = 0
    missionHandler(current)
    server.use(
      http.get(`${apiUrl}/heroes/3`, () => { heroReads += 1; return HttpResponse.json({ data: heroReads === 1 ? beforeHero : { ...beforeHero, level: 4, status: 'available' }, message: 'Hero retrieved successfully.' }) }),
      http.post(`${apiUrl}/missions/1/complete`, () => { current.mission = { ...baseMission, status: 'success', completed_at: '2026-01-02T00:00:00Z' }; return HttpResponse.json({ data: current.mission, message: 'Mission completed successfully.' }) }),
    )
    renderDetail()

    await user.click(await screen.findByRole('button', { name: 'Complete adventure' }))
    expect(await screen.findByRole('heading', { name: 'Adventure complete!' })).toBeInTheDocument()
    expect(screen.getByText('Level 3 → 4')).toBeInTheDocument()
    expect(screen.getByText('Status: On Mission → Available')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Complete adventure' })).not.toBeInTheDocument()
  })

  it('renders Laravel failure gently with confirmed injury data', async () => {
    const user = userEvent.setup()
    const current = { mission: baseMission }
    let heroReads = 0
    missionHandler(current)
    server.use(
      http.get(`${apiUrl}/heroes/3`, () => { heroReads += 1; return HttpResponse.json({ data: heroReads === 1 ? beforeHero : { ...beforeHero, level: 2, status: 'injured' }, message: 'Hero retrieved successfully.' }) }),
      http.post(`${apiUrl}/missions/1/complete`, () => { current.mission = { ...baseMission, status: 'failure', completed_at: '2026-01-02T00:00:00Z' }; return HttpResponse.json({ data: current.mission, message: 'Mission completed successfully.' }) }),
    )
    renderDetail()

    await user.click(await screen.findByRole('button', { name: 'Complete adventure' }))
    expect(await screen.findByRole('heading', { name: 'A brave attempt' })).toBeInTheDocument()
    expect(screen.getByText('Level 3 → 2')).toBeInTheDocument()
    expect(screen.getByText('Status: On Mission → Injured')).toBeInTheDocument()
  })

  it('confirms cancellation, closes its dialog, and updates the mission without local gameplay changes', async () => {
    const user = userEvent.setup()
    const current = { mission: baseMission }
    missionHandler(current)
    server.use(http.post(`${apiUrl}/missions/1/cancel`, () => { current.mission = { ...baseMission, status: 'canceled', completed_at: null }; return HttpResponse.json({ data: current.mission, message: 'Mission canceled successfully.' }) }))
    renderDetail()

    await user.click(await screen.findByRole('button', { name: 'Cancel mission' }))
    expect(screen.getByRole('dialog', { name: 'Cancel this mission?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirm cancellation' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Mission canceled. The adventurers are back at the guild.')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel mission' })).not.toBeInTheDocument()
  })

  it('keeps mission context and the cancellation dialog after Laravel rejects an invalid state', async () => {
    const user = userEvent.setup()
    missionHandler({ mission: baseMission })
    server.use(http.post(`${apiUrl}/missions/1/cancel`, () => HttpResponse.json({ message: 'Mission is not assigned.' }, { status: 409 })))
    renderDetail()

    await user.click(await screen.findByRole('button', { name: 'Cancel mission' }))
    await user.click(screen.getByRole('button', { name: 'Confirm cancellation' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Mission is not assigned.')
    expect(screen.getByRole('dialog', { name: 'Cancel this mission?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Clockwork Catacombs' })).toBeInTheDocument()
  })

  it('prevents a duplicate completion during its in-flight request', async () => {
    const user = userEvent.setup()
    let completions = 0
    missionHandler({ mission: baseMission })
    server.use(
      http.get(`${apiUrl}/heroes/3`, () => HttpResponse.json({ data: beforeHero, message: 'Hero retrieved successfully.' })),
      http.post(`${apiUrl}/missions/1/complete`, async () => { completions += 1; return new Promise<never>(() => {}) }),
    )
    renderDetail()

    const complete = await screen.findByRole('button', { name: 'Complete adventure' })
    await user.click(complete)
    expect(complete).toBeDisabled()
    await user.click(complete)
    expect(completions).toBe(1)
  })

  it('uses the reduced-motion preference for outcome animation', () => {
    render(<MissionOutcome reducedMotion mission={{ ...baseMission, status: 'success', completed_at: '2026-01-02T00:00:00Z' }} beforeHeroes={[beforeHero]} afterHeroes={[{ ...beforeHero, level: 4, status: 'available' }]} />)
    expect(screen.getByRole('status')).toHaveAttribute('data-reduced-motion', 'true')
  })
})

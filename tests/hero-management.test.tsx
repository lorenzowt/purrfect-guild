import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import type { Hero } from '../src/features/heroes/heroesApi'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }

function hero(overrides: Partial<Hero> = {}): Hero {
  return { id: 1, name: 'Biscuit', hero_class: 'warrior', level: 3, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z', ...overrides }
}

function roster(data: Hero[]) {
  return { data, links: { first: null, last: null, prev: null, next: null }, meta: { current_page: 1, from: data.length ? 1 : null, last_page: 1, per_page: 12, to: data.length || null, total: data.length }, message: 'Heroes retrieved successfully.' }
}

function renderRoute(path: string) {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

describe('hero management', () => {
  it('recruits an adventurer and refreshes the roster from Laravel data', async () => {
    const user = userEvent.setup()
    let heroes: Hero[] = []
    let submitted: unknown
    server.use(
      http.get(`${apiUrl}/heroes`, () => HttpResponse.json(roster(heroes))),
      http.post(`${apiUrl}/heroes`, async ({ request }) => {
        submitted = await request.json()
        heroes = [hero({ id: 2, name: 'Mallow', hero_class: 'cleric' })]
        return HttpResponse.json({ data: heroes[0], message: 'Hero created successfully.' }, { status: 201 })
      }),
    )
    renderRoute('/heroes')
    await user.click(await screen.findByRole('button', { name: 'Recruit an adventurer' }))
    await user.type(screen.getByLabelText('Adventurer name'), 'Mallow')
    await user.selectOptions(screen.getByLabelText('Class'), 'cleric')
    await user.click(screen.getByRole('button', { name: 'Welcome to the guild' }))

    expect(submitted).toEqual({ name: 'Mallow', hero_class: 'cleric' })
    expect(await screen.findByText('Mallow')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Mallow has joined the guild!')
    expect(screen.queryByRole('dialog', { name: 'Recruit an adventurer' })).not.toBeInTheDocument()
  })

  it('shows Laravel recruitment validation feedback', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json(roster([]))), http.post(`${apiUrl}/heroes`, () => HttpResponse.json({ message: 'Invalid.', errors: { name: ['Choose a less scratchy name.'] } }, { status: 422 })))
    renderRoute('/heroes')
    await user.click(await screen.findByRole('button', { name: 'Recruit an adventurer' }))
    await user.click(screen.getByRole('button', { name: 'Welcome to the guild' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a less scratchy name.')
  })

  it('edits only documented hero fields and reflects the confirmed response', async () => {
    const user = userEvent.setup()
    let current = hero()
    server.use(
      http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: current, message: 'Hero retrieved successfully.' })),
      http.patch(`${apiUrl}/heroes/1`, async ({ request }) => {
        expect(await request.json()).toEqual({ name: 'Sir Biscuit', hero_class: 'mage' })
        current = hero({ name: 'Sir Biscuit', hero_class: 'mage' })
        return HttpResponse.json({ data: current, message: 'Hero updated successfully.' })
      }),
    )
    renderRoute('/heroes/1')
    await user.click(await screen.findByRole('button', { name: 'Edit adventurer' }))
    const name = screen.getByLabelText('Adventurer name')
    await user.clear(name)
    await user.type(name, 'Sir Biscuit')
    await user.selectOptions(screen.getByLabelText('Class'), 'mage')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByRole('heading', { name: 'Sir Biscuit' })).toBeInTheDocument()
    expect(screen.getByText('The adventurer ledger has been updated.')).toBeInTheDocument()
  })

  it('keeps the edit dialog open for validation errors', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: hero(), message: 'Hero retrieved successfully.' })), http.patch(`${apiUrl}/heroes/1`, () => HttpResponse.json({ message: 'Invalid.', errors: { name: ['That name is already taken.'] } }, { status: 422 })))
    renderRoute('/heroes/1')
    await user.click(await screen.findByRole('button', { name: 'Edit adventurer' }))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('That name is already taken.')
    expect(screen.getByRole('dialog', { name: 'Edit Biscuit' })).toBeInTheDocument()
  })

  it('heals an injured adventurer using the confirmed backend result', async () => {
    const user = userEvent.setup()
    let current = hero({ status: 'injured' })
    server.use(
      http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: current, message: 'Hero retrieved successfully.' })),
      http.post(`${apiUrl}/heroes/1/heal`, () => { current = hero({ status: 'available' }); return HttpResponse.json({ data: current, message: 'Hero healed successfully.' }) }),
    )
    renderRoute('/heroes/1')
    await user.click(await screen.findByRole('button', { name: 'Heal adventurer' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Biscuit is feeling spry again!')
    expect(screen.getByRole('button', { name: 'Heal adventurer' })).toBeDisabled()
  })

  it('explains when healing is unavailable and surfaces backend healing rejection', async () => {
    const user = userEvent.setup()
    server.use(http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: hero(), message: 'Hero retrieved successfully.' })))
    const availableHero = renderRoute('/heroes/1')
    expect(await screen.findByText('Healing is available only when an adventurer is injured.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Heal adventurer' })).toBeDisabled()

    availableHero.unmount()
    const injured = hero({ status: 'injured' })
    server.use(http.get(`${apiUrl}/heroes/2`, () => HttpResponse.json({ data: injured, message: 'Hero retrieved successfully.' })), http.post(`${apiUrl}/heroes/2/heal`, () => HttpResponse.json({ message: 'This hero is not injured.' }, { status: 409 })))
    renderRoute('/heroes/2')
    await user.click(await screen.findByRole('button', { name: 'Heal adventurer' }))
    expect(await screen.findByRole('status')).toHaveTextContent('This hero is not injured.')
  })

  it('confirms deactivation, refreshes the roster, and reports backend rejection', async () => {
    const user = userEvent.setup()
    let heroes = [hero()]
    server.use(
      http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: heroes[0], message: 'Hero retrieved successfully.' })),
      http.get(`${apiUrl}/heroes`, () => HttpResponse.json(roster(heroes))),
      http.delete(`${apiUrl}/heroes/1`, () => { heroes = []; return HttpResponse.json({ data: hero({ status: 'deactivated' }), message: 'Hero deactivated successfully.' }) }),
    )
    const retiredHero = renderRoute('/heroes/1')
    await user.click(await screen.findByRole('button', { name: 'Retire adventurer' }))
    expect(screen.getByRole('dialog', { name: 'Retire Biscuit?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirm retirement' }))
    expect(await screen.findByRole('heading', { name: 'No adventurers yet' })).toBeInTheDocument()

    retiredHero.unmount()
    server.use(http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: hero(), message: 'Hero retrieved successfully.' })), http.delete(`${apiUrl}/heroes/1`, () => HttpResponse.json({ message: 'You may not retire this hero.' }, { status: 403 })))
    renderRoute('/heroes/1')
    await user.click(await screen.findByRole('button', { name: 'Retire adventurer' }))
    await user.click(screen.getByRole('button', { name: 'Confirm retirement' }))
    expect(await screen.findByRole('status')).toHaveTextContent('You may not retire this hero.')
  })
})

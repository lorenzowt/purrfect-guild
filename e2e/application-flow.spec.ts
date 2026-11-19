import { expect, test, type Page } from '@playwright/test'

const timestamp = '2026-11-19T12:00:00.000Z'

function pageResponse<T>(data: T[]) {
  return { data, links: { first: null, last: null, prev: null, next: null }, meta: { current_page: 1, last_page: 1, total: data.length } }
}

async function fulfill(route: Parameters<Page['route']>[1] extends (route: infer R) => unknown ? R : never, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
}

/**
 * Browser tests deliberately mock at the HTTP boundary. They exercise the real
 * application, router, auth provider and query cache without modifying a local
 * Laravel database.
 */
async function mockPlayerApi(page: Page) {
  const user = { id: 1, name: 'Mira', email: 'mira@example.test', role: 'user', created_at: timestamp, updated_at: timestamp }
  const quest = { id: 7, title: 'The Clockwork Catacombs', description: 'Find the missing silver bell.', boss: 'Clockwork Mouse', difficulty: 4, is_active: true, created_at: timestamp, updated_at: timestamp }
  let heroes: Array<Record<string, unknown>> = []
  let mission: Record<string, unknown> | null = null

  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const { pathname } = new URL(request.url())
    const method = request.method()
    const hero = heroes[0]

    if (method === 'POST' && pathname === '/api/register') return fulfill(route, user, 201)
    if (method === 'POST' && pathname === '/api/login') return fulfill(route, { access_token: 'player-token', token_type: 'Bearer' })
    if (method === 'POST' && pathname === '/api/logout') return fulfill(route, { message: 'Logged out.' })
    if (method === 'GET' && pathname === '/api/users/me') return fulfill(route, { data: user, message: 'User retrieved successfully.' })
    if (method === 'GET' && pathname === '/api/heroes') return fulfill(route, pageResponse(heroes))
    if (method === 'POST' && pathname === '/api/heroes') {
      const input = request.postDataJSON() as { name: string; hero_class: string }
      const created = { id: 11, user_id: 1, name: input.name, hero_class: input.hero_class, level: 1, status: 'available', created_at: timestamp, updated_at: timestamp }
      heroes = [created]
      return fulfill(route, { data: created }, 201)
    }
    if (method === 'GET' && pathname === '/api/heroes/11') return fulfill(route, { data: hero })
    if (method === 'GET' && pathname === '/api/quests') return fulfill(route, pageResponse([quest]))
    if (method === 'GET' && pathname === '/api/quests/7') return fulfill(route, { data: quest })
    if (method === 'GET' && pathname === '/api/missions') return fulfill(route, pageResponse(mission ? [mission] : []))
    if (method === 'POST' && pathname === '/api/missions') {
      heroes = heroes.map((entry) => ({ ...entry, status: 'on_mission' }))
      mission = { id: 44, status: 'assigned', quest: { id: quest.id, title: quest.title }, heroes: heroes.map(({ id, name, hero_class }) => ({ id, name, hero_class })), created_at: timestamp, completed_at: null }
      return fulfill(route, { data: mission }, 201)
    }
    if (method === 'GET' && pathname === '/api/missions/44') return fulfill(route, { data: mission })
    if (method === 'POST' && pathname === '/api/missions/44/complete') {
      heroes = heroes.map((entry) => ({ ...entry, status: 'available', level: Number(entry.level) + 1 }))
      mission = { ...mission, status: 'success', completed_at: timestamp }
      return fulfill(route, { data: mission })
    }

    return fulfill(route, { message: `Unexpected request: ${method} ${pathname}` }, 404)
  })
}

test('a newly registered player can recruit, launch, and resolve a mission', async ({ page }) => {
  await mockPlayerApi(page)
  // The app loads optional remote fonts; DOM content is sufficient for UI tests
  // and avoids waiting for those non-critical assets in an offline runner.
  await page.goto('/register', { waitUntil: 'domcontentloaded' })

  await page.getByLabel('Guildmaster name').fill('Mira')
  await page.getByLabel('Email').fill('mira@example.test')
  await page.getByLabel('Password', { exact: true }).fill('correct-horse-battery-staple')
  await page.getByLabel('Confirm password').fill('correct-horse-battery-staple')
  await page.getByRole('button', { name: 'Register the guild' }).click()
  await page.getByLabel('Email').fill('mira@example.test')
  await page.getByLabel('Password', { exact: true }).fill('correct-horse-battery-staple')
  await page.getByRole('button', { name: 'Enter the Guild Hall' }).click()

  await expect(page.getByRole('heading', { name: 'A warm welcome' })).toBeVisible()
  await page.getByRole('button', { name: 'Skip tour' }).click()
  await expect(page.getByRole('heading', { name: 'Guild Hall' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Player navigation' }).getByRole('link', { name: 'Adventurers' }).click()
  await page.getByRole('button', { name: 'Recruit an adventurer' }).click()
  await page.getByLabel('Adventurer name').fill('Juniper')
  await page.getByLabel('Class').selectOption('mage')
  await page.getByRole('button', { name: 'Welcome to the guild' }).click()
  await expect(page.getByRole('status')).toContainText('Juniper has joined the guild')

  await page.getByRole('navigation', { name: 'Player navigation' }).getByRole('link', { name: 'Quest Board' }).click()
  await page.getByRole('button', { name: 'Inspect quest' }).click()
  await page.getByRole('link', { name: 'Assemble your party' }).click()
  await expect(page.getByRole('heading', { name: 'Party Builder' })).toBeVisible()
  await page.getByRole('button', { name: /Juniper/ }).click()
  await page.getByRole('button', { name: 'Send on adventure!' }).click()
  await expect(page.getByRole('status')).toContainText('Your party is on its way')
  await page.waitForURL('**/missions/44')

  await page.getByRole('button', { name: 'Complete adventure' }).click()
  await expect(page.getByRole('heading', { name: 'Adventure complete!' })).toBeVisible()
  await expect(page.getByText('Level 1 → 2')).toBeVisible()

  await page.getByRole('navigation', { name: 'Player navigation' }).getByRole('link', { name: 'Journal' }).click()
  await expect(page.getByRole('link', { name: 'Open mission 44 journal entry' })).toBeVisible()
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page.getByRole('heading', { name: 'A Guild of Whiskers & Wonder' })).toBeVisible()
})

test('an administrator remains in the Guild Master’s Office', async ({ page }) => {
  const admin = { id: 2, name: 'Rowan', email: 'rowan@example.test', role: 'admin', created_at: timestamp, updated_at: timestamp }
  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const { pathname } = new URL(request.url())
    if (request.method() === 'POST' && pathname === '/api/login') return fulfill(route, { access_token: 'admin-token', token_type: 'Bearer' })
    if (request.method() === 'GET' && pathname === '/api/users/me') return fulfill(route, { data: admin, message: 'User retrieved successfully.' })
    if (request.method() === 'POST' && pathname === '/api/logout') return fulfill(route, { message: 'Logged out.' })
    return fulfill(route, { data: [], links: {}, meta: {} })
  })

  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.getByLabel('Email').fill(admin.email)
  await page.getByLabel('Password').fill('correct-horse-battery-staple')
  await page.getByRole('button', { name: 'Enter the Guild Hall' }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: 'Guild Master’s Office' })).toBeVisible()
  await expect(page.getByLabel('Administrator navigation')).toBeVisible()
  await expect(page.getByLabel('Player navigation')).toHaveCount(0)

  // Passport tokens are deliberately memory-only; this mimics entering a player
  // route while the current authenticated SPA session is still alive.
  await page.evaluate(() => {
    window.history.pushState({}, '', '/guild')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: 'Guild Master’s Office' })).toBeVisible()
})

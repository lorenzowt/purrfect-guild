import { http, HttpResponse } from 'msw'

const apiUrl = 'http://127.0.0.1:8000/api'

export const handlers = [
  http.get(`${apiUrl}/users/me`, () =>
    HttpResponse.json({
      data: {
        id: 1,
        name: 'Test Guildmaster',
        email: 'guildmaster@example.test',
        role: 'user',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      message: 'User retrieved successfully.',
    }),
  ),
  http.get(`${apiUrl}/users`, () => HttpResponse.json(paginated([], 0, 'Users retrieved successfully.'))),
  http.get(`${apiUrl}/heroes`, () => HttpResponse.json(paginated([], 0, 'Heroes retrieved successfully.'))),
  http.get(`${apiUrl}/quests`, () => HttpResponse.json(paginated([], 0, 'Quests retrieved successfully.'))),
  http.get(`${apiUrl}/missions`, () => HttpResponse.json(paginated([], 0, 'Missions retrieved successfully.'))),
]

function paginated<T>(data: T[], total: number, message: string) {
  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: { current_page: 1, from: data.length ? 1 : null, last_page: 1, links: [], path: `${apiUrl}/`, per_page: 100, to: data.length || null, total },
    message,
  }
}

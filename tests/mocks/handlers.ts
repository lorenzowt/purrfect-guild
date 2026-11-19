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
]

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, PlayerLayout, PublicLayout } from './Layouts'
import { NotFoundPage, PlaceholderPage, WelcomePage } from './Pages'
import { RequireAdmin, RequireAuth, RequireGuest } from './RouteGuards'
import { LoginPage, RegisterPage } from '../../features/auth/AuthPages'
import { GuildHallPage } from '../../features/guild/GuildHallPage'
import { OnboardingPage } from '../../features/onboarding/OnboardingPage'
import { ProfilePlaceholderPage } from '../../features/onboarding/ProfilePlaceholderPage'
import { HeroDetailPage } from '../../features/heroes/HeroDetailPage'
import { HeroRosterPage } from '../../features/heroes/HeroRosterPage'
import { QuestBoardPage } from '../../features/quests/QuestBoardPage'
import { PartyBuilderPage } from '../../features/missions/PartyBuilderPage'

export function AppRouter() {
  return <BrowserRouter><ApplicationRoutes /></BrowserRouter>
}

/** Exported separately so routing can be tested with MemoryRouter. */
export function ApplicationRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
      </Route>
      <Route element={<RequireGuest />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<PlayerLayout />}>
          <Route path="/guild" element={<GuildHallPage />} />
          <Route path="/heroes" element={<HeroRosterPage />} />
          <Route path="/heroes/:heroId" element={<HeroDetailPage />} />
          <Route path="/quests" element={<QuestBoardPage />} />
          <Route path="/quests/:questId" element={<PlaceholderPage title="Quest details" description="Quest details will appear here." />} />
          <Route path="/quests/:questId/party" element={<PartyBuilderPage />} />
          <Route path="/missions" element={<PlaceholderPage title="Mission Journal" description="Active and past missions will appear here." />} />
          <Route path="/missions/:missionId" element={<PlaceholderPage title="Mission details" description="Mission details will appear here." />} />
          <Route path="/profile" element={<ProfilePlaceholderPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<PlaceholderPage title="Guild Master’s Office" description="Administrative tools will appear here." />} />
          <Route path="/admin/users" element={<PlaceholderPage title="User Management" description="Guild members will appear here." />} />
          <Route path="/admin/quests" element={<PlaceholderPage title="Quest Management" description="Quest administration will appear here." />} />
          <Route path="/admin/heroes" element={<PlaceholderPage title="Guild Oversight: Heroes" description="Guild-wide hero oversight will appear here." />} />
          <Route path="/admin/missions" element={<PlaceholderPage title="Guild Oversight: Missions" description="Guild-wide mission oversight will appear here." />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, PlayerLayout, PublicLayout } from './Layouts'
import { NotFoundPage, PlaceholderPage, WelcomePage } from './Pages'
import { RequireAdmin, RequireGuest, RequirePlayer } from './RouteGuards'
import { LoginPage, RegisterPage } from '../../features/auth/AuthPages'
import { GuildHallPage } from '../../features/guild/GuildHallPage'
import { OnboardingPage } from '../../features/onboarding/OnboardingPage'
import { ProfilePage } from '../../features/profile/ProfilePage'
import { HeroDetailPage } from '../../features/heroes/HeroDetailPage'
import { HeroRosterPage } from '../../features/heroes/HeroRosterPage'
import { QuestBoardPage } from '../../features/quests/QuestBoardPage'
import { PartyBuilderPage } from '../../features/missions/PartyBuilderPage'
import { MissionDetailPage } from '../../features/missions/MissionDetailPage'
import { MissionJournalPage } from '../../features/missions/MissionJournalPage'
import { AdminHeroesPage, AdminMissionsPage, AdminOfficePage, AdminQuestsPage, AdminUsersPage } from '../../features/admin/AdminPages'
import { AdminHeroDetailPage, AdminMissionDetailPage } from '../../features/admin/AdminDetails'

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

      <Route element={<RequirePlayer />}>
        <Route element={<PlayerLayout />}>
          <Route path="/guild" element={<GuildHallPage />} />
          <Route path="/heroes" element={<HeroRosterPage />} />
          <Route path="/heroes/:heroId" element={<HeroDetailPage />} />
          <Route path="/quests" element={<QuestBoardPage />} />
          <Route path="/quests/:questId" element={<PlaceholderPage title="Quest details" description="Quest details will appear here." />} />
          <Route path="/quests/:questId/party" element={<PartyBuilderPage />} />
          <Route path="/missions" element={<MissionJournalPage />} />
          <Route path="/missions/:missionId" element={<MissionDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOfficePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/quests" element={<AdminQuestsPage />} />
          <Route path="/admin/heroes" element={<AdminHeroesPage />} />
          <Route path="/admin/heroes/:heroId" element={<AdminHeroDetailPage />} />
          <Route path="/admin/missions" element={<AdminMissionsPage />} />
          <Route path="/admin/missions/:missionId" element={<AdminMissionDetailPage />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

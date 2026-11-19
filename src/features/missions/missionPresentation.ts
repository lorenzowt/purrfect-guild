import type { BadgeProps } from '../../components/ui/Badge'
import type { Mission } from './missionsApi'

export const missionStatusVariant: Record<Mission['status'], NonNullable<BadgeProps['variant']>> = {
  assigned: 'magic',
  success: 'available',
  failure: 'injured',
  canceled: 'deactivated',
}

export function formatMissionDate(date: string | null) {
  if (!date) return 'Not completed'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
}

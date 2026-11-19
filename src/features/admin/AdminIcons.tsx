import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function OfficeIcon({ children, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>
}

export function MembersIcon(props: IconProps) { return <OfficeIcon {...props}><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7" r="3" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16 4.13a3 3 0 0 1 0 5.74" /></OfficeIcon> }
export function QuestLedgerIcon(props: IconProps) { return <OfficeIcon {...props}><path d="M5 3.5h11l3 3V20.5H5z" /><path d="M16 3.5v4h3M8 12h8M8 16h6" /></OfficeIcon> }
export function HeroOversightIcon(props: IconProps) { return <OfficeIcon {...props}><path d="M12 20.5c-4.5 0-7-2.9-7-6.3 0-2.2 1.6-3.7 3.3-2.8.4-2.6 1.7-4.4 3.7-4.4s3.3 1.8 3.7 4.4c1.7-.9 3.3.6 3.3 2.8 0 3.4-2.5 6.3-7 6.3Z" /><path d="M9.5 15.5h.01M14.5 15.5h.01M10.5 18c1 .6 2 .6 3 0" /></OfficeIcon> }
export function MissionArchiveIcon(props: IconProps) { return <OfficeIcon {...props}><path d="M6 4h12v16H6z" /><path d="M9 8h6M9 12h6M9 16h4" /><path d="m4 6 2-2m12 16 2-2" /></OfficeIcon> }

// Custom Zypply SVG Icons - unique to our brand
// All icons use the Zypply gradient: indigo → violet → pink

interface IconProps {
  className?: string;
  size?: number;
}

export function ZypplyLogo({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="zg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="50%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#EC4899"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#zg)"/>
      <path d="M9 10h14l-8.5 12H23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 9l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}

export function IconDashboard({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="2"/>
      <rect x="14" y="3" width="7" height="4" rx="1.5"/>
      <rect x="14" y="10" width="7" height="11" rx="2"/>
      <rect x="3" y="13" width="7" height="8" rx="2"/>
    </svg>
  );
}

export function IconApplications({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <path d="M12 12v4"/>
      <path d="M2 12h20"/>
    </svg>
  );
}

export function IconBoard({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="5" height="18" rx="1.5"/>
      <rect x="10" y="3" width="5" height="12" rx="1.5"/>
      <rect x="17" y="3" width="5" height="15" rx="1.5"/>
    </svg>
  );
}

export function IconResumes({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
      <path d="M14 2v6h6"/>
      <circle cx="10" cy="13" r="2"/>
      <path d="M14 17H6"/>
      <path d="M18 17h-2"/>
    </svg>
  );
}

export function IconInterview({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
      <path d="M12 18v4"/>
      <path d="M8 22h8"/>
    </svg>
  );
}

export function IconEmails({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

export function IconScore({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
      <path d="M16 8l2-2"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
    </svg>
  );
}

export function IconAnalytics({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18"/>
      <path d="M7 16l4-6 4 4 5-8"/>
      <circle cx="20" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export function IconQuickApply({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

export function IconCompany({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}

export function IconSalary({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0c0 2 5 2 5 4.5a2.5 2.5 0 0 1-5 0"/>
      <path d="M12 6v1.5"/>
      <path d="M12 16.5V18"/>
    </svg>
  );
}

export function IconNetworking({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="8" r="3"/>
      <circle cx="18" cy="10" r="2.5"/>
      <circle cx="13" cy="18" r="2.5"/>
      <path d="M10.5 9.5l5 1"/>
      <path d="M9.5 10.5l2.5 5.5"/>
      <path d="M16 12l-1.5 4"/>
    </svg>
  );
}

export function IconSkills({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.15"/>
    </svg>
  );
}

export function IconReports({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
      <path d="M8 10v6"/>
      <path d="M12 8v8"/>
      <path d="M16 11v5"/>
      <path d="M2 8h20"/>
    </svg>
  );
}

export function IconTimeline({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18"/>
      <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.3"/>
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.7"/>
      <path d="M14 6h5"/>
      <path d="M5 12h5"/>
      <path d="M14 18h4"/>
    </svg>
  );
}

export function IconProfile({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M20 21a8 8 0 0 0-16 0"/>
      <path d="M14.5 5.5l1.5-1.5"/>
      <circle cx="17" cy="3" r="1" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

export function IconSettings({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export function IconLogout({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

// Landing page feature icons with filled gradient style
export function IconATS({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="ats" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#6366F1"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#ats)" opacity="0.12"/>
      <circle cx="16" cy="16" r="8" stroke="url(#ats)" strokeWidth="2"/>
      <path d="M16 10v6l3.5 2" stroke="url(#ats)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 9l2-2" stroke="url(#ats)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconVoiceMatch({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="vm" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#EC4899"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#vm)" opacity="0.12"/>
      <path d="M8 16h2l2-4 2 8 2-6 2 4 2-2h2" stroke="url(#vm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconCoverLetter({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="cl" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#6366F1"/><stop offset="100%" stopColor="#06B6D4"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#cl)" opacity="0.12"/>
      <path d="M10 8h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" stroke="url(#cl)" strokeWidth="1.5"/>
      <path d="M12 12h8M12 15h6M12 18h4" stroke="url(#cl)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 17l2 2 3-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconTracker({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="tr" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#EF4444"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#tr)" opacity="0.12"/>
      <rect x="8" y="8" width="5" height="16" rx="1.5" stroke="url(#tr)" strokeWidth="1.5"/>
      <rect x="14.5" y="8" width="5" height="11" rx="1.5" stroke="url(#tr)" strokeWidth="1.5"/>
      <rect x="21" y="8" width="5" height="13" rx="1.5" stroke="url(#tr)" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}

export function IconExtension({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="ext" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#06B6D4"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#ext)" opacity="0.12"/>
      <path d="M10 12h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" stroke="url(#ext)" strokeWidth="1.5"/>
      <path d="M8 12V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" stroke="url(#ext)" strokeWidth="1.5"/>
      <circle cx="16" cy="17" r="2" stroke="url(#ext)" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconInterviewPrep({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs><linearGradient id="ip" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill="url(#ip)" opacity="0.12"/>
      <circle cx="16" cy="13" r="4" stroke="url(#ip)" strokeWidth="1.5"/>
      <path d="M10 23c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="url(#ip)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 9l3-3" stroke="url(#ip)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 7l2 1" stroke="url(#ip)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Step icons for landing page
export function IconStep1({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs><linearGradient id="s1" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#6366F1"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
      <rect width="40" height="40" rx="12" fill="url(#s1)"/>
      <path d="M14 14h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1V15a1 1 0 0 1 1-1Z" stroke="white" strokeWidth="1.5"/>
      <path d="M16 18h8M16 21h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 11l3-1 3 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconStep2({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs><linearGradient id="s2" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#EC4899"/></linearGradient></defs>
      <rect width="40" height="40" rx="12" fill="url(#s2)"/>
      <circle cx="20" cy="18" r="6" stroke="white" strokeWidth="1.5"/>
      <path d="M20 15v3l2 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 28h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 25h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconStep3({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <defs><linearGradient id="s3" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#F59E0B"/></linearGradient></defs>
      <rect width="40" height="40" rx="12" fill="url(#s3)"/>
      <path d="M14 20h4l-1 7 9-10h-4l1-7-9 10Z" fill="white" opacity="0.9"/>
    </svg>
  );
}

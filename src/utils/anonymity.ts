import { User, UserRole } from '../types';

/**
 * Deterministic color palettes for anonymous peer avatars
 */
const PEER_COLORS: { [key in UserRole]: { bg: string; text: string; ring: string } } = {
  student: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-400' },
  lecturer: { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-400' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-400' },
};

/**
 * Generates an anonymous alias for a user based on their ID and role.
 */
export function generateAnonymousAlias(role: UserRole = 'student', seed: string = ''): string {
  let hash = 0;
  const str = seed || Math.random().toString(36).substring(2, 9);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positiveNum = Math.abs(hash) % 900 + 100; // 100 - 999

  switch (role) {
    case 'student':
      return `Anon Scholar #${positiveNum}`;
    case 'lecturer':
      return `Anon Instructor #${positiveNum}`;
    case 'admin':
      return `Anon Proctor #${positiveNum}`;
    default:
      return `Anon User #${positiveNum}`;
  }
}

/**
 * Returns the display name for a peer.
 * Ensures all users are completely anonymous to each other.
 * Only the user themselves or an authorized administrator in Audit Unmask mode can see real names.
 */
export function getPeerDisplayName(
  target: { id?: string; name?: string; role?: UserRole; anonymousAlias?: string },
  viewer?: User | null,
  isAuditUnmask: boolean = false
): string {
  const alias = target.anonymousAlias || generateAnonymousAlias(target.role || 'student', target.id || target.name || 'peer');
  
  // If user is viewing themselves
  if (viewer && target.id && viewer.id === target.id) {
    return `${target.name || 'You'} (You • ${alias})`;
  }

  // If administrator is actively using unmask mode for institutional compliance/audits
  if (isAuditUnmask && viewer && viewer.role === 'admin') {
    return `${target.name || 'User'} [Audit Mode • Masked: ${alias}]`;
  }

  // Standard peer view: strictly anonymous
  return alias;
}

/**
 * Masks a private email address from peer view (e.g. j***@university.edu or anonymized handle).
 */
export function maskEmail(
  email?: string,
  targetId?: string,
  viewer?: User | null,
  isAuditUnmask: boolean = false
): string {
  if (!email) return 'hidden@anonymous.lms';

  if (viewer && targetId && viewer.id === targetId) {
    return email;
  }

  if (isAuditUnmask && viewer && viewer.role === 'admin') {
    return email;
  }

  const parts = email.split('@');
  if (parts.length < 2) return 'anon-id@shield.lms';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@***.${domain.split('.').pop() || 'edu'}`;
}

/**
 * Returns an anonymous SVG avatar data URL with unique geometric styling
 * to protect personal portraits from peer exposure.
 */
export function getPeerAvatar(
  target: { id?: string; name?: string; role?: UserRole; avatar?: string; anonymousAlias?: string },
  viewer?: User | null,
  isAuditUnmask: boolean = false
): string {
  // If viewing self or audit unmask active for admin, show real avatar
  if (viewer && target.id && viewer.id === target.id && target.avatar) {
    return target.avatar;
  }
  if (isAuditUnmask && viewer && viewer.role === 'admin' && target.avatar) {
    return target.avatar;
  }

  const alias = target.anonymousAlias || generateAnonymousAlias(target.role || 'student', target.id || 'peer');
  const numMatch = alias.match(/\d+/);
  const num = numMatch ? numMatch[0] : '88';
  const role = target.role || 'student';
  
  const colors: Record<UserRole, { bg: string; fg: string }> = {
    student: { bg: '#10B981', fg: '#FFFFFF' },
    lecturer: { bg: '#8B5CF6', fg: '#FFFFFF' },
    admin: { bg: '#F59E0B', fg: '#FFFFFF' }
  };
  const c = colors[role] || colors.student;

  // Generate lightweight inline SVG avatar
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <rect width="80" height="80" rx="40" fill="${c.bg}" />
    <path d="M40 16 L56 24 L56 42 Q56 56 40 64 Q24 56 24 42 L24 24 Z" fill="rgba(255,255,255,0.25)" />
    <text x="40" y="47" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="${c.fg}" text-anchor="middle">#${num.slice(-2)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Creates a temporal (ephemeral / guest) user session.
 */
export function createTemporalSessionUser(
  role: UserRole = 'student',
  durationMinutes: number = 60
): User {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const tempId = `usr_temp_${timestamp.toString(36)}_${randomSuffix}`;
  const token = `TEMP-${role.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
  const expiresAt = new Date(timestamp + durationMinutes * 60 * 1000).toISOString();
  
  const roleTitle = role === 'student' ? 'Scholar' : role === 'lecturer' ? 'Instructor' : 'Proctor';
  const alias = `Temp ${roleTitle} #${randomSuffix}`;

  return {
    id: tempId,
    name: `Temporal Guest (${role.toUpperCase()})`,
    email: `temp_${randomSuffix}@ephemeral.lms`,
    role,
    status: 'active',
    avatar: getPeerAvatar({ id: tempId, role, anonymousAlias: alias }),
    joined: new Date().toISOString().split('T')[0],
    anonymousAlias: alias,
    isTemporal: true,
    temporalToken: token,
    temporalExpiresAt: expiresAt
  };
}

/**
 * Calculates remaining time for a temporal user session.
 */
export function calculateTemporalRemainingTime(expiresAt?: string): {
  formatted: string;
  isExpired: boolean;
  secondsRemaining: number;
} {
  if (!expiresAt) {
    return { formatted: 'Permanent', isExpired: false, secondsRemaining: Infinity };
  }

  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const diffMs = expiryTime - now;

  if (diffMs <= 0) {
    return { formatted: '00:00 (Expired)', isExpired: true, secondsRemaining: 0 };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${mins}m ${secs}s`;
  } else {
    formatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  return {
    formatted,
    isExpired: false,
    secondsRemaining: totalSecs
  };
}

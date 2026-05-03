export type UserRole = 'admin' | 'hacker' | 'judge' | 'organizer'

/**
 * Determines whether a user can see scores.
 * - Admin and Judge always can.
 * - Hacker and Organizer only when results have been made public.
 */
export function canViewScores(role: UserRole | undefined, isResultPublic: boolean): boolean {
  if (!role) return false
  if (role === 'admin' || role === 'judge') return true
  return isResultPublic
}

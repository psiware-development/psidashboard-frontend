import type { User } from '~/types/user'
import { ROLE_SCRUM_MASTER, ROLE_OPERATIONS_MANAGER } from '~/types/user'

/**
 * Whether this user can see other users' names inside timeline entries.
 */
export function canViewUserNamesInTimeline(user: User | null): boolean {
  const roleId = user?.mainRole?.idRole
  return roleId === ROLE_SCRUM_MASTER || roleId === ROLE_OPERATIONS_MANAGER
}

/**
 * Whether this user can read another user's resume page.
 */
export function canAccessUserResume(user: User | null): boolean {
  return user?.roleAdmin === true
}

/**
 * Whether this user can read or write resources that belong to `targetUserId`.
 */
export function canAccessUserResource(
  user: User | null,
  targetUserId: string | number
): boolean {
  if (!user) return false
  return (
    user.mainRole?.idRole === ROLE_SCRUM_MASTER
    || user.roleAdmin === true
    || user.idUser === Number(targetUserId)
  )
}

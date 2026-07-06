import type { User } from '~/types/user'

export function canAccessUserResource(
  currentUser: User | null,
  targetUserId: string | number
): boolean {
  if (!currentUser) {
    return false
  }

  return (
    currentUser.mainRole?.idRole === 8
    || currentUser.roleAdmin === true
    || currentUser.idUser === Number(targetUserId)
  )
}

export function canAccessUserResume(currentUser: User | null): boolean {
  return currentUser?.roleAdmin === true
}

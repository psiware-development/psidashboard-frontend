export enum UserRoles {
  USER = 'user',
  SM = 'sm'
}

export const checkUserRoles = (userRoles: UserRoles[], neededRoles: UserRoles[]) => {
  if (neededRoles.length === 0) {
    return true
  }

  return neededRoles.some(role => userRoles.includes(role))
}

export enum UserRoles {
  ADMIN = "admin",
}


export const checkUserRoles = (userRoles: UserRoles[], neededRoles: UserRoles[]) => {
  if (neededRoles.length === 0) {
    return true;
  }
  return neededRoles.some(r => userRoles.includes(r))
}
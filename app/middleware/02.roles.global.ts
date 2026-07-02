import { checkUserRoles } from '~/utils/roles'
import { publicPages } from '~/utils/publicPages'

export default defineNuxtRouteMiddleware((to) => {
  const { userRoles } = useAuthStore()
  const { redirectToHome } = useHomeRedirection()
  const neededRoles = to.meta.roles as UserRoles[] | undefined

  if (publicPages.includes(to.path)) {
    return
  }

  if (!neededRoles || neededRoles.length === 0) {
    return
  }

  if (checkUserRoles(userRoles, neededRoles)) {
    return
  }

  return redirectToHome()
})

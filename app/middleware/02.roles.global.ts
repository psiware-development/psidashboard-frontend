import { checkUserRoles } from "~/utils/roles";
import { publicPages } from "~/utils/publicPages";

export default defineNuxtRouteMiddleware((to, from) => {
  const { userRoles } = useAuthStore();
  const { redirectToHome } = useHomeRedirection();
  const neededRoles = to.meta.roles as UserRoles[] | undefined;

  if (publicPages.some(p => to.path.includes(p))) {
    return true;
  }

  if (!neededRoles || neededRoles.length === 0) {
    return true;
  }

  if (checkUserRoles(userRoles, neededRoles)) {
    return true;
  }

  return redirectToHome();
});


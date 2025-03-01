export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth_token");

  if (to.fullPath.includes("/dashboard") && !token.value) {
    return navigateTo("/login");
  }
});

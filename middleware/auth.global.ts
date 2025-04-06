export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth_token");
  console.log(token.value);
  if (to.fullPath.includes("/dashboard") && token && !token.value) {
    return navigateTo("/login");
  }
});

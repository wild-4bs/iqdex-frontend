import Cookies from "universal-cookie";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookies = new Cookies();
  const token = cookies.get("auth_token");
  if (to.fullPath.includes("/dashboard") && !token) {
    return navigateTo("/login");
  } else if (token && token.length < 10 && to.fullPath.includes("/dashboard")) {
    return navigateTo("/");
  }
});

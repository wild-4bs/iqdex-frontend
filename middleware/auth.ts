import Cookies from "universal-cookie";

export default defineNuxtRouteMiddleware(async (to, from) => {
  await nextTick();
  const cookies = new Cookies();
  const token = cookies.get("auth_token");
  if (!token) {
    navigateTo("/login");
  }
});

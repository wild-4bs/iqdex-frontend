export default defineNuxtRouteMiddleware((to, from) => {
    const homeStore = useMyHomeStore()
    if (homeStore.user) {
        if (to.fullPath == "/success" && JSON.stringify(homeStore.user) == '{}') {
            return navigateTo("/")
        }
        if (to.fullPath != '/expired' && homeStore.expired) {
            return navigateTo("/expired")
        }
        if (to.fullPath == "/expired" && !homeStore.expired) {
            return navigateTo("/")
        }
    }
})

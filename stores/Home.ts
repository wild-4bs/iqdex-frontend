import { defineStore } from 'pinia'

export const useMyHomeStore = defineStore({
  id: 'HomeStore',
  state: () => ({
    baseUrl: "https://iqdex-api.netlify.app",
    user: {} as any,
    expired: false
  }),
  actions: {},
  getters: {
  }
})

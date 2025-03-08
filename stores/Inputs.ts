import { defineStore } from 'pinia'

export const useMyInputsStore = defineStore({
  id: 'myInputsStore',
  state: () => ({
    firstName: {
      value: "",
      error: false,
    },
    lastName: {
      value: "",
      error: false,
    },
    country: {
      value: "",
      error: false,
    },
    companyName: {
      value: "",
      error: false,
    },
    position: {
      value: "",
      error: false,
    },
    phoneNumber: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
    image: {
      value: "",
      error: false,
    },
    participationType: "",
    sendVia: "",
    countries: [],
  }),
  actions: {}
})

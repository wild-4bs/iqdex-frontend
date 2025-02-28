import { defineStore } from 'pinia'

export const useMyCountriesStore = defineStore({
  id: 'myCountriesStore',
  state: () => ({
    countries: [],
    defaultCountry: {},
    currentCountry: {}
  }),
  actions: {
    async getDefaultCountry() {
      try {
        const res = await fetch('https://restcountries.com/v3.1/name/iraq')
        const defaultCountry = await res.json()
        this.defaultCountry = defaultCountry[0]
        this.currentCountry = defaultCountry[0]
      } catch (error) {
        return null
      }
    },
    async getCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all")
        const countries = await res.json()
        this.countries = countries
      } catch (error) {
        return null
      }
    }
  },
  getters: {
    selectedCountry: (state) => {
      const selected: any = state.countries.find((c: any) => c.name.common == state.currentCountry)
      if (selected) {
        return selected
      } else {
        return state.defaultCountry
      }
    }
  }
})

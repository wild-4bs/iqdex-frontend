import { defineStore } from "pinia";

export const useMyCountriesStore = defineStore({
  id: "myCountriesStore",
  state: () => ({
    countries: [],
    defaultCountry: {},
    currentCountry: {},
    selectedCountry: {},
  }),
  actions: {
    async getDefaultCountry() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/name/iraq");
        const defaultCountry = await res.json();
        this.defaultCountry = defaultCountry[0];
        this.currentCountry = defaultCountry[0].name.common;
        this.setSelectedCountry(defaultCountry[0]);
      } catch (error) {
        return null;
      }
    },
    async getCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const countries = await res.json();
        this.countries = countries;
      } catch (error) {
        return null;
      }
    },
    getSelectedCountry() {
      if (this.currentCountry) {
        const selected = this.countries.find(
          (c: any) => c.name.common == this.currentCountry
        );
        return selected;
      }
      const selected = this.selectedCountry;
      return selected;
    },
    setSelectedCountry(country: any) {
      this.selectedCountry = country;
    },
  },
  getters: {},
});

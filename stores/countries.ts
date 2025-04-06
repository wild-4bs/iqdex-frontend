import { defineStore } from "pinia";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flag: string; // Emoji flag (e.g., "🇮🇶")
  idd: {
    root: string; // Root dial code (e.g., "+9")
    suffixes: string[]; // Suffixes (e.g., ["64"] → "+964")
  };
}

export const useMyCountriesStore = defineStore({
  id: "myCountriesStore",
  state: () => ({
    countries: [] as any[],
    defaultCountry: {},
    currentCountry: {},
    selectedCountry: {} as any,
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
        console.error(error);
        return null;
      }
    },
    async getCountries() {
      const { runErrorToast } = useShadcnHelpers();
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd",
          {
            headers: {
              "User-Agent": "iqdex/1.0", // اسم التطبيق هنا
            },
          }
        );
        const countries = await res.json();
        this.countries = countries;
      } catch (error) {
        runErrorToast({
          title: "Countries Error",
          message: "Error while getting the countries.",
        });
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

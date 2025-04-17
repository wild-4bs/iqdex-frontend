import { defineStore } from "pinia";

export const useMyCompaniesStore = defineStore({
  id: "myCompaniesStore",
  state: () => ({
    companies: [] as any,
    selectedCompany: {},
    canDoActions: true,
    page: 1,
    search: "",
    companiesCount: 0,
    limit: 50,
  }),
  actions: {
    async getCompanies() {
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();
      try {
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/company?page=${this.page}&search=${this.search}`,
          {
            method: "GET",
            headers: homeStore.headers,
          }
        );
        this.companies = response.companies;
        this.companiesCount = response.pagination.totalCount;
      } catch (error: any) {
        runErrorToast({
          title: "Something went wrong.",
          message: error.statusMessage,
        });
      }
    },
    async getCompaniesOnly() {
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();
      try {
        const response: any = await $fetch(`${homeStore.baseUrl}/api/company`, {
          method: "GET",
          headers: homeStore.headers,
        });
        this.companies = response.companies;
        this.companiesCount = response.pagination.totalCount;
      } catch (error: any) {
        runErrorToast({
          title: "Something went wrong.",
          message: error.statusMessage,
        });
      }
    },
    async deleteCompany(id: any) {
      const dashboardStore = useMyDashboardStore();
      const homeStore = useMyHomeStore();
      const { runErrorToast, runToast } = useShadcnHelpers();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/company/${id}`,
          {
            method: "DELETE",
            headers: homeStore.headers,
          }
        );
        this.canDoActions = true;
        dashboardStore.endLoading();
        await this.getCompanies();
        runToast(response.message);
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          title: "Company Error",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
  },
});

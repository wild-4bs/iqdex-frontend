import { defineStore } from "pinia";
import Cookies from "universal-cookie";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

export const useMyUsersStore = defineStore({
  id: "myUsersStore",
  state: () => ({
    canDoActions: true,
    addUser: false,
    inputs: {
      first_name: {
        value: "",
        error: false,
      },
      last_name: {
        value: "",
        error: false,
      },
      email: {
        value: "",
        error: false,
      },
      company_name: {
        value: "",
        error: false,
      },
      country: {
        value: "",
        error: false,
      },
      country_code: {
        value: "",
        error: false,
      },
      phone_number: {
        value: "",
        error: false,
      },
      position: {
        value: "",
        error: false,
      },
      participation_type: {
        value: "",
        error: false,
      },
      send_via: {
        value: "",
        error: false,
      },
      image: {
        value: "",
        error: false,
      },
    } as any,
    buttonContent: {
      value: "Register",
    },
  }),
  actions: {
    async createUser() {
      const dashboardStore = useMyDashboardStore();
      const homeStore = useMyHomeStore();
      const countriesStore = useMyCountriesStore();
      const { runErrorToast, runToast } = useShadcnHelpers();
      if (!this.canDoActions) return;
      this.canDoActions = false;
      const canSubmit = (inputs: any) => {
        let allFilled = true;
        for (const key in inputs) {
          if (
            inputs.hasOwnProperty(key) &&
            key != "country" &&
            key != "country_code"
          ) {
            const input = inputs[key];
            if (input.value === "") {
              input.error = true;
              allFilled = false;
            } else {
              input.error = false;
            }
          }
        }
        return allFilled;
      };
      try {
        if (!canSubmit(this.inputs)) return;
        dashboardStore.startLoading();
        this.inputs.country.value = countriesStore.selectedCountry;
        this.inputs.country_code.value =
          countriesStore.selectedCountry.idd.root +
          countriesStore.selectedCountry.idd.suffixes[0];
        const data = new FormData();
        data.append("first_name", this.inputs.first_name.value);
        data.append("last_name", this.inputs.last_name.value);
        data.append(
          "phone_number",
          this.inputs.country_code.value.toString() +
            " " +
            this.inputs.phone_number.value
        );
        data.append("email", this.inputs.email.value);
        data.append("company_name", this.inputs.company_name.value);
        data.append("country", this.inputs.country.value.name.common);
        data.append("country_code", this.inputs.country_code.value);
        data.append("position", this.inputs.position.value);
        data.append("participation_type", this.inputs.participation_type.value);
        data.append("send_via", this.inputs.send_via.value);
        data.append("image", this.inputs.image.value);
        this.buttonContent.value = "Registering...";
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/register`,
          {
            method: "POST",
            body: data,
            headers: homeStore.headers,
          }
        );
        homeStore.user = response.user;
        this.buttonContent.value = "Badge Registered";
        runToast(response.message);
        dashboardStore.endLoading();
        this.addUser = false;
        await dashboardStore.getUsers();
        for (const key in this.inputs) {
          if (this.inputs.hasOwnProperty(key)) {
            const input = this.inputs[key];
            input.value = "";
          }
        }
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        this.buttonContent.value = "Register Badge";
        runErrorToast({
          title: "Something went wrong.",
          message: error.statusMessage,
        });
        console.error(error);
      } finally {
        dashboardStore.endLoading();
        this.canDoActions = true;
      }
    },
    async acceptUser(userId: string) {
      const { runToast, runErrorToast } = useShadcnHelpers();
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/accept`,
          {
            body: { userId },
            method: "POST",
            headers: homeStore.headers,
          }
        );
        if (response.ok) {
          dashboardStore.endLoading();
          runToast(response.message);
          await dashboardStore.getUsers();
        }
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          message: error.message,
          title: "User acceptation Error",
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async DeleteUser(userId: string) {
      const { runToast, runErrorToast } = useShadcnHelpers();
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      try {
        if (!this.canDoActions) return;
        dashboardStore.startLoading();
        this.canDoActions = false;
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/${userId}`,
          {
            method: "DELETE",
            headers: homeStore.headers,
          }
        );
        dashboardStore.endLoading();
        runToast(response.message);
        await dashboardStore.getUsers();
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          message: error.statusMessage,
          title: "Error while deleting the user",
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async acceptAllUser(userId: string) {
      const { runToast, runErrorToast } = useShadcnHelpers();
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      try {
        dashboardStore.startLoading();
        if (!this.canDoActions) return;
        this.canDoActions = false;
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/acceptAll`,
          {
            method: "POST",
            headers: homeStore.headers,
          }
        );
        if (response.ok) {
          dashboardStore.endLoading();
          runToast(response.message);
          await dashboardStore.getUsers();
        }
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          message: error.message,
          title: "Users acceptation Error",
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async rejectUser(userId: string) {
      const { runToast, runErrorToast } = useShadcnHelpers();
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/reject`,
          {
            method: "POST",
            body: { userId },
            headers: homeStore.headers,
          }
        );
        if (response.ok) {
          dashboardStore.endLoading();
          runToast(response.message);
          await dashboardStore.getUsers();
        }
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.endLoading();
        runErrorToast({
          title: "User rejection Error",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async rejectAllUsers(userId: string) {
      const { runToast, runErrorToast } = useShadcnHelpers();
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/user/rejectAll`,
          {
            method: "POST",
            headers: homeStore.headers,
          }
        );
        if (response.ok) {
          dashboardStore.endLoading();
          runToast(response.message);
          await dashboardStore.getUsers();
        }
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.endLoading();
        runErrorToast({
          title: "Users rejection Error",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
    exportAsExcel() {
      const dashboardStore = useMyDashboardStore();
      const transformedUsers: any[] = [];
      dashboardStore.users.forEach((user: any) => {
        const userTransformer = {
          name: user.first_name + " " + user.last_name,
          phoneNumber: user.phone_number,
          email: user.email,
          company_name: user.company_name,
          country: user.country,
          position: user.position,
          status: user.status,
          participation_type: user.participation_type,
          send_via: user.send_via,
        };
        transformedUsers.push(userTransformer);
      });
      const worksheet = XLSX.utils.json_to_sheet(transformedUsers);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      XLSX.writeFile(workbook, "users.xlsx");
    },
    exportAsPdf() {
      const dashboardStore = useMyDashboardStore();
      const transformedUsers: any[] = [];
      dashboardStore.users.forEach((user: any) => {
        const userTransformer = {
          name: user.first_name + " " + user.last_name,
          "phone number": user.phone_number,
          email: user.email,
          "company name": user.company_name,
          country: user.country,
          position: user.position,
          status: user.status,
          "participation type": user.participation_type,
        };
        transformedUsers.push(userTransformer);
      });

      const doc = new jsPDF();

      const columns = Object.keys(transformedUsers[0]);
      const rows = transformedUsers.map((user) =>
        columns.map((col) => user[col])
      );

      doc.text("Users Report", 14, 10);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 20,
      });

      doc.save("users.pdf");
    },
    async sendPdfByEmail(userId: any) {
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        await $fetch(`${homeStore.baseUrl}/api/pdf/generate`, {
          method: "POST",
          body: {
            user_id: userId,
          },
          headers: homeStore.headers,
        });
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/pdf/send/email`,
          {
            method: "POST",
            body: {
              user_id: userId,
            },
            headers: homeStore.headers,
          }
        );
        dashboardStore.endLoading();
        runToast(response.message);
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          title: "Error while sending",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async downloadPdf(userData: any) {
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      if (!this.canDoActions) return;
      dashboardStore.startLoading();
      this.canDoActions = false;
      try {
        const user = dashboardStore.users.find((u) => u.id == userData.id);
        let pdfUrl = "";
        const pdfRes: any = await $fetch(
          `${homeStore.baseUrl}/api/pdf/generate`,
          {
            method: "POST",
            body: {
              user_id: user.id,
            },
            headers: homeStore.headers,
          }
        );
        pdfUrl = pdfRes.savedFile.url;
        const response = await axios.get(pdfUrl, {
          responseType: "arraybuffer",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${user.first_name}_iqdex2025.pdf`;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);

        dashboardStore.endLoading();
        runToast("Pdf downloaded");
      } catch (error: any) {
        dashboardStore.errorLoading();
        runErrorToast({
          title: "Downloading error",
          message: error,
        });
      } finally {
        this.canDoActions = true;
      }
    },
    async sendPdfByWhatsapp(userId: any) {
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      try {
        if (!this.canDoActions) return;
        this.canDoActions = false;
        dashboardStore.startLoading();
        await $fetch(`${homeStore.baseUrl}/api/pdf/generate`, {
          method: "POST",
          body: {
            user_id: userId,
          },
          headers: homeStore.headers,
        });
        const cookies = new Cookies();
        const token = cookies.get("auth_token");
        const response: any = await $fetch(
          `${homeStore.baseUrl}/api/pdf/send/whatsapp`,
          {
            method: "POST",
            body: {
              userId,
            },
            headers: homeStore.headers,
          }
        );
        dashboardStore.endLoading();
        runToast(response.message);
      } catch (error: any) {
        homeStore.handleError(error);
        dashboardStore.errorLoading();
        runErrorToast({
          title: "Error while sending",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
      }
    },
  },
});

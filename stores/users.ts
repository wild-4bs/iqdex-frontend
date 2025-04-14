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
    excelUsersCount: 1,
    excelExportedUsers: 0,
    excelCancel: false,
    excelTotalPages: 1,
    excelButtonContent: "Export",
    excelTitleContent: "Users Exporter",
    excelRequestPage: 1,
    excelExporting: false,

    pdfUsersCount: 1,
    pdfExportedUsers: 0,
    pdfCancel: false,
    pdfTotalPages: 1,
    pdfButtonContent: "Export",
    pdfTitleContent: "Users Exporter",
    pdfRequestPage: 1,
    pdfExporting: false,
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
    async fetchUsers(url: string) {
      const homeStore = useMyHomeStore();
      const { runErrorToast } = useShadcnHelpers();

      try {
        const response: any = await $fetch(url, {
          method: "GET",
          headers: homeStore.headers,
        });
        return response;
      } catch (error: any) {
        runErrorToast({
          title: "Error while exporting users.",
          message: error.statusMessage,
        });
      }
    },
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
    async exportAsExcel() {
      const homeStore = useMyHomeStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      let users = [] as any;
      if (!this.canDoActions) return;
      this.excelCancel = false;
      this.canDoActions = false;
      this.excelButtonContent = "Cancel";
      this.excelTitleContent = "Exporting users...";
      try {
        for (let i = 1; i <= this.excelTotalPages; i++) {
          if (this.excelCancel) return;
          this.excelExporting = true;
          const response = await this.fetchUsers(
            `${homeStore.baseUrl}/api/user?page=${this.excelRequestPage}&limit=150`
          );
          this.excelUsersCount = response.count;
          this.excelRequestPage++;
          this.excelTotalPages = response.totalPages;
          users.push(...response.users);
          this.excelExportedUsers = users.length;
        }
        runToast("users have been fetched");
        this.excelExporter(users);
      } catch (error: any) {
        runErrorToast({
          title: "Error while extracting users",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
        this.excelButtonContent = "Export";
        this.excelExportedUsers = 0;
        this.excelTitleContent = "Users Exporter";
        this.excelTotalPages = 1;
        this.excelUsersCount = 1;
        this.excelRequestPage = 1;
        this.excelExporting = false;
      }
    },
    async exportAsPdf() {
      const homeStore = useMyHomeStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      let users = [] as any;

      if (!this.canDoActions) return;
      this.pdfCancel = false;
      this.canDoActions = false;
      this.pdfButtonContent = "Cancel";
      this.pdfTitleContent = "Exporting Users...";
      try {
        for (let i = 1; i <= this.pdfTotalPages; i++) {
          if (this.pdfCancel) return;

          this.pdfExporting = true;
          const response = await this.fetchUsers(
            `${homeStore.baseUrl}/api/user?page=${this.pdfRequestPage}&limit=150`
          );
          this.pdfUsersCount = response.count;
          this.pdfRequestPage++;
          this.pdfTotalPages = response.totalPages;
          users.push(...response.users);
          this.pdfExportedUsers = users.length;
        }
        runToast("Users have been fetched");
        this.pdfExporter(users);
      } catch (error: any) {
        console.log(error);
        runErrorToast({
          title: "Error while extracting users",
          message: error.statusMessage,
        });
      } finally {
        this.canDoActions = true;
        this.pdfButtonContent = "Export";
        this.pdfExportedUsers = 0;
        this.pdfTitleContent = "Users Exporter";
        this.pdfTotalPages = 1;
        this.pdfUsersCount = 1;
        this.pdfRequestPage = 1;
        this.pdfExporting = false;
      }
    },
    async sendPdfByEmail(userId: any) {
      const homeStore = useMyHomeStore();
      const dashboardStore = useMyDashboardStore();
      const { runToast, runErrorToast } = useShadcnHelpers();
      try {
        if (!this.canDoActions) return;
        const user = dashboardStore.users.find((u) => u.id == userId);
        if (user.status != "accepted") {
          runErrorToast({
            title: "Validation Error",
            message: "The user have to bee accepted for this action.",
          });
          return;
        }
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
        const user = dashboardStore.users.find((u) => u.id == userId);
        if (user.status != "accepted") {
          runErrorToast({
            title: "Validation Error",
            message: "The user have to bee accepted for this action.",
          });
          return;
        }
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
    excelExporter(users: []) {
      const transformedUsers = [] as any;
      users.forEach((user: any) => {
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
    // pdfExporter(users: []) {
    //   const transformedUsers = [] as any;
    //   users.forEach((user: any) => {
    //     const userTransformer = {
    //       name: user.first_name + " " + user.last_name,
    //       "phone number": user.phone_number,
    //       email: user.email,
    //       "company name": user.company_name,
    //       country: user.country,
    //       position: user.position,
    //       status: user.status,
    //       "participation type": user.participation_type,
    //     };
    //     transformedUsers.push(userTransformer);
    //   });

    //   const doc = new jsPDF();
    //   const columns = Object.keys(transformedUsers[0]);
    //   const rows = transformedUsers.map((user: any) =>
    //     columns.map((col) => user[col])
    //   );

    //   doc.text("Users Report", 14, 10);

    //   autoTable(doc, {
    //     head: [columns],
    //     body: rows,
    //     startY: 20,
    //   });

    //   doc.save("users.pdf");
    // },
    pdfExporter(users: []) {
      // 1. التحقق من وجود بيانات
      if (!users || users.length === 0) {
        alert("No users to export!");
        return;
      }

      // 2. تحويل البيانات مع التعامل مع القيم غير المعرّفة
      const transformedUsers = users.map((user: any) => ({
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        "phone number": user.phone_number || "N/A",
        email: user.email || "N/A",
        "company name": user.company_name || "N/A",
        country: user.country || "N/A",
        position: user.position || "N/A",
        status: user.status || "N/A",
        "participation type": user.participation_type || "N/A",
      }));

      // 3. إنشاء مستند PDF مع إعدادات مخصصة
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // 4. إعداد العناوين والجدول
      const columns = Object.keys(transformedUsers[0]);
      const rows = transformedUsers.map((user: any) =>
        columns.map((col) => user[col])
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Users Report", 14, 15);

      // 5. استخدام autoTable بالطريقة الصحيحة
      autoTable(doc, {
        head: [columns.map((c) => c.toUpperCase())],
        body: rows,
        startY: 20,
        margin: { horizontal: 5 },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
          valign: "middle",
          halign: "left",
          textColor: [33, 37, 41],
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          // تأكد من تطابق الأسماء مع الأعمدة
          "phone number": { cellWidth: 25 },
          email: { cellWidth: 40 },
          "company name": { cellWidth: 35 },
          country: { cellWidth: 25 },
          position: { cellWidth: 30 },
        },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber}`,
            doc.internal.pageSize.width - 15,
            doc.internal.pageSize.height - 10,
            { align: "right" }
          );
        },
      });

      // 6. حفظ الملف
      doc.save("users-report.pdf");
    },
  },
});

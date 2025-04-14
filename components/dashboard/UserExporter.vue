<template>
  <div
    class="fixed w-full h-full wrapper top-0 left-0 flex items-center justify-center z-10 bg-[#0000006c]"
    @click="close($event, 'outside')"
  >
    <div
      class="content flex flex-col bg-white w-[90%] sm:w-[600px] h-[250px] rounded-xl px-5 py-4"
      ref="content"
    >
      <div class="loader flex items-center gap-4">
        <div
          class="loading-bar w-full bg-blue-100 border border-blue-500 h-[20px] rounded-full overflow-hidden relative"
        >
          <div
            :class="[
              'loader percentage absolute h-full top-0 left-0 bg-blue-500',
            ]"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
        <div class="value text-xl font-semibold text-blue-500">
          {{ Math.round(percentage) }}%
        </div>
      </div>
      <div class="usersCounter">
        <span v-if="props.role === 'excel'">
          {{ usersStore.excelExportedUsers }} /
          {{
            usersStore.excelUsersCount == 1 ? 0 : usersStore.excelUsersCount
          }}</span
        >
        <span v-else>
          {{ usersStore.pdfExportedUsers }} /
          {{
            usersStore.pdfUsersCount == 1 ? 0 : usersStore.pdfUsersCount
          }}</span
        >
      </div>
      <div class="title-options flex-1 flex items-end justify-between">
        <div class="title text-2xl font-bold">
          <h3
            v-html="usersStore.excelTitleContent"
            v-if="props.role == 'excel'"
          ></h3>
          <h3 v-html="usersStore.pdfTitleContent" v-else></h3>
        </div>
        <div class="options flex items-center gap-2">
          <Button
            :class="['rounded-full text-sm']"
            @click="
              usersStore.excelExporting ? cancel() : usersStore.exportAsExcel()
            "
            v-html="usersStore.excelButtonContent"
            v-if="props.role == 'excel'"
          ></Button>
          <Button
            v-else
            :class="['rounded-full text-sm']"
            @click="
              usersStore.pdfExporting ? cancel() : usersStore.exportAsPdf()
            "
            v-html="usersStore.pdfButtonContent"
          ></Button>
          <!-- <Button
            class="rounded-full text-sm underline"
            variant="ghost"
            @click="cancel"
            v-if="usersStore.excelExporting"
            >Cancel</Button
          > -->
          <Button
            class="rounded-full text-sm underline"
            variant="ghost"
            @click="close($event, 'inside')"
            >Close</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const usersStore = useMyUsersStore();
const content = ref("");
const percentage = computed(() => {
  if (props.role == "excel") {
    return (usersStore.excelExportedUsers / usersStore.excelUsersCount) * 100;
  } else {
    return (usersStore.pdfExportedUsers / usersStore.pdfUsersCount) * 100;
  }
});
const dashboardStore = useMyDashboardStore();

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const close = (e, closeType) => {
  if (
    content.value &&
    content.value.contains(e.target) &&
    closeType == "outside"
  )
    return;
  if (props.role == "excel") {
    dashboardStore.excelUsersExporter = false;
    usersStore.canDoActions = true;
    usersStore.excelButtonContent = "Export";
    usersStore.excelExportedUsers = 0;
    usersStore.excelTitleContent = "Users Exporter";
    usersStore.excelTotalPages = 1;
    usersStore.excelUsersCount = 1;
    usersStore.excelRequestPage = 1;
    usersStore.excelExporting = false;
  } else if (props.role == "pdf") {
    dashboardStore.pdfUsersExporter = false;
    usersStore.canDoActions = true;
    usersStore.pdfButtonContent = "Export";
    usersStore.pdfExportedUsers = 0;
    usersStore.pdfTitleContent = "Users Exporter";
    usersStore.pdfTotalPages = 1;
    usersStore.pdfUsersCount = 1;
    usersStore.pdfRequestPage = 1;
    usersStore.pdfExporting = false;
  }
};

const cancel = () => {
  if (props.role == "excel") {
    usersStore.excelCancel = true;
    usersStore.canDoActions = true;
    usersStore.excelExporting = false;
    usersStore.excelButtonContent = "Export";
    usersStore.excelExportedUsers = 0;
    usersStore.excelTitleContent = "Users Exporter";
    usersStore.excelTotalPages = 1;
    usersStore.excelUsersCount = 1;
    usersStore.excelRequestPage = 1;
    usersStore.excelExporting = false;
  } else if (props.role == "pdf") {
    usersStore.pdfCancel = true;
    usersStore.canDoActions = true;
    usersStore.pdfExporting = false;
    usersStore.pdfButtonContent = "Export";
    usersStore.pdfExportedUsers = 0;
    usersStore.pdfTitleContent = "Users Exporter";
    usersStore.pdfTotalPages = 1;
    usersStore.pdfUsersCount = 1;
    usersStore.pdfRequestPage = 1;
    usersStore.pdfExporting = false;
  }
};
</script>

<style scoped lang="scss">
.content {
  .loading-bar {
    .loader {
      transition: 0.2s;
      will-change: width;
    }
  }
}
</style>

<template>
  <div class="companies">
    <div class="helpers flex items-center justify-between">
      <div class="search">
        <input
          type="text"
          @input="search"
          placeholder="Search..."
          v-model="companiesStore.search"
        />
      </div>
      <div class="options">
        <DashboardCompaniesAdd />
      </div>
    </div>
    <DashboardCompaniesTable />
    <Pagination
      v-slot="{ page }"
      :items-per-page="50"
      :total="companiesStore.companiesCount"
      :sibling-count="4"
      show-edges
      :default-page="companiesStore.page"
      class="w-full"
      v-model:page="companiesStore.page"
    >
      <PaginationList
        v-slot="{ items }"
        class="flex justify-center items-center gap-1"
      >
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <Button
              class="w-10 h-10 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
</template>

<script setup>
const companiesStore = useMyCompaniesStore();

const search = () => {
  companiesStore.page = 1;
  companiesStore.getCompanies();
};

watch(
  () => companiesStore.page,
  () => {
    companiesStore.getCompanies();
  }
);
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<style scoped lang="scss">
.companies {
  overflow: hidden;
  max-width: calc(100vw - theme("sizes.sidebarWidth") - 1rem);
  min-height: calc(100vh - 1rem);

  .helpers {
    padding: 1rem 1rem 0 0;
    gap: 1rem;

    .search {
      flex: 1;

      input {
        border: 1px solid lightgray;
        padding: 5px 10px;
        border-radius: 5px;
        width: 100%;
        max-width: 500px;
      }
    }

    .options {
      margin-right: 1rem;

      .icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
        border: 1px solid transparent;
        border-radius: 50%;
        transition: 0.2s;

        &:hover {
          border-color: lightgray;
        }
      }
    }
  }
}
</style>

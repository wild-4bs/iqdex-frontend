<template>
  <div class="companies">
    <div class="helpers flex items-center justify-between">
      <div class="search">
        <input type="text" @input="search" placeholder="Search..." v-model="searchInput">
      </div>
      <div class="options">
        <DashboardCompaniesAdd />
      </div>
    </div>
    <DashboardCompaniesTable />
  </div>
</template>

<script setup>
const searchInput = ref('')
const companiesStore = useMyCompaniesStore()
const search = () => {
  const regex = new RegExp(searchInput.value.split(/\s+/).join("|"), "i");

  companiesStore.filteredCompanies = companiesStore.companies.filter(company =>
    regex.test(company.name)
  );
}
definePageMeta({
  layout: "dashboard"
})

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
        transition: .2s;

        &:hover {
          border-color: lightgray;
        }
      }
    }
  }
}
</style>
<template>
  <div class="dashboard">
    <DashboardUserExporter
      v-if="dashboardStore.excelUsersExporter"
      role="excel"
    />
    <DashboardUserExporter v-if="dashboardStore.pdfUsersExporter" role="pdf" />
    <DashboardMainAddUser v-if="usersStore.addUser" />
    <div class="helpers flex items-center justify-between">
      <div class="search">
        <input
          type="text"
          @input="search"
          v-model="dashboardStore.search"
          placeholder="Search By Email"
        />
      </div>
      <div class="options flex items-center justify-center">
        <DropdownMenu class="icon flex items-center justify-center">
          <DropdownMenuTrigger>
            <div class="icon flex items-center justify-center">
              <Icon name="ic:outline-more-vert" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="usersStore.rejectAllUsers()"
              >Reject all</DropdownMenuItem
            >
            <DropdownMenuItem @click="usersStore.acceptAllUser()"
              >Accept all</DropdownMenuItem
            >
            <DropdownMenuItem @click="dashboardStore.pdfUsersExporter = true"
              >Export all as pdf</DropdownMenuItem
            >
            <DropdownMenuItem @click="dashboardStore.excelUsersExporter = true"
              >Export all as Excel</DropdownMenuItem
            >
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <header class="flex items-center justify-between">
      <div class="users-count flex items-center gap-4">
        <div class="addUsers" @click="usersStore.addUser = true">
          <Button variant="outline">Add user</Button>
        </div>
        <span
          >All users:
          <span class="count">{{ dashboardStore.usersCount }}</span></span
        >
      </div>
      <div class="options">
        <div class="status">
          <DashboardMainStatusBar :options="cases" />
        </div>
      </div>
    </header>
    <div class="dataTable flex flex-col gap-4" ref="usersTable">
      <DashboardMainTable />
      <Pagination
        v-slot="{ page }"
        :items-per-page="50"
        :total="dashboardStore.usersCount"
        :sibling-count="7"
        show-edges
        :default-page="dashboardStore.page"
        class="w-full"
        v-model:page="dashboardStore.page"
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
  </div>
</template>

<script setup>
const dashboardStore = useMyDashboardStore();
const usersStore = useMyUsersStore();
const usersTable = ref("");

const cases = ref([]);

onMounted(async () => {
  await dashboardStore.getUsers();

  if (!localStorage.cases) {
    cases.value = [
      {
        name: "pending",
        color: "#F7CB73",
        active: true,
      },
      {
        name: "accepted",
        color: "#12BF0C",
        active: true,
      },
      {
        name: "rejected",
        color: "#f60303a6",
        active: true,
      },
    ];
    localStorage.setItem("cases", JSON.stringify(cases.value));
  } else if (localStorage.cases) {
    cases.value = JSON.parse(localStorage.cases);
  }
});

const search = () => {
  dashboardStore.page = 1;
  dashboardStore.getUsers();
};

watch(
  () => dashboardStore.page,
  (newVal, oldVal) => {
    if (dashboardStore.canGetUsers) {
      dashboardStore.getUsers();
    }
  }
);

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<style scoped lang="scss">
.dashboard {
  overflow: hidden;
  max-width: calc(100vw - theme("sizes.sidebarWidth") - 1rem);
  min-height: calc(100vh - 1rem);

  .helpers {
    padding: 1rem 1rem 0 0;

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

  header {
    padding: 0.2rem 1rem 1rem 0;

    .users-count {
      .count {
        color: rgba(0, 0, 0, 0.753);
        display: inline-block;
        transform: translateY(2%);
      }
    }

    .options {
      background-color: rgb(245, 245, 245);
      border: 1px solid rgba(211, 211, 211, 0.637);

      .option {
        text-transform: capitalize;
        transition: 0.2s;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: white;
        }
      }
    }
  }

  .dataTable {
    overflow: auto;
    width: 100;
  }
}
</style>

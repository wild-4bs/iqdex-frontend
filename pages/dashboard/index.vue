<template>
  <div class="dashboard">
    <DashboardMainAddUser v-if="usersStore.addUser" />
    <div class="helpers flex items-center justify-between">
      <div class="search">
        <input type="text" @input="search" v-model="searchInput" placeholder="Search By Email">
      </div>
      <div class="options flex items-center justify-center">
        <DropdownMenu class="icon flex items-center justify-center">
          <DropdownMenuTrigger>
            <div class="icon flex items-center justify-center">
              <Icon name="ic:outline-more-vert" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="usersStore.rejectAllUsers()">Reject all</DropdownMenuItem>
            <DropdownMenuItem @click="usersStore.acceptAllUser()">Accept all</DropdownMenuItem>
            <DropdownMenuItem @click="usersStore.exportAsPdf()">Export all as pdf</DropdownMenuItem>
            <DropdownMenuItem @click="usersStore.exportAsExcel()">Export all as Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <header class="flex items-center justify-between">
      <div class="users-count flex items-center gap-4">
        <div class="addUsers" @click="usersStore.addUser = true">
          <Button variant="outline">Add user</Button>
        </div>
        <span>All users: <span class="count">{{ dashboardStore.users.length }}</span></span>
      </div>
      <div class="options">
        <div class="status">
          <DashboardMainStatusBar :options="cases" />
        </div>
      </div>
    </header>
    <div class="dataTable">
      <DashboardMainTable />
    </div>
  </div>
</template>

<script setup>

const dashboardStore = useMyDashboardStore()
const usersStore = useMyUsersStore()

const cases = ref([])
const searchInput = ref('')
const search = () => {
  const regex = new RegExp(searchInput.value.split(/\s+/).join("|"), "i");

  dashboardStore.filteredUsers = dashboardStore.users.filter(user =>
    regex.test(user.email)
  );
}

onMounted(async () => {
  await dashboardStore.getUsers()

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
    ]
    localStorage.setItem("cases", JSON.stringify(cases.value))
  } else if (localStorage.cases) {
    cases.value = JSON.parse(localStorage.cases)
  }
})
definePageMeta({
  layout: "dashboard"
})
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
        transition: .2s;

        &:hover {
          border-color: lightgray;
        }
      }
    }
  }

  header {
    padding: .2rem 1rem 1rem 0;

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
        transition: .2s;
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
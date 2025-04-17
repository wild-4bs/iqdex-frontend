<template>
  <div class="user">
    <div
      class="userExist flex flex-col xl:flex-row gap-4 p-8"
      v-if="JSON.stringify(user) != '{}'"
    >
      <div class="image w-full xl:w-[600px]">
        <img :src="user.image[0].url" alt="" class="rounded-lg w-full" />
      </div>
      <div class="content">
        <form @submit.prevent="submit" class="flex flex-col gap-4 h-full">
          <div class="group">
            <input type="text" v-model="user.first_name" class="item" />
            <input type="text" v-model="user.last_name" class="item" />
          </div>
          <div class="group">
            <input type="text" v-model="user.email" class="item" />
          </div>
          <div class="group">
            <input
              type="text"
              v-model="user.company_name"
              class="item"
              v-if="!user.company_id"
            />
            <DashboardUsersCompanies
              :id="user.company_id"
              @select-company="handleCompanySelect"
              v-else
            />
            <input type="text" v-model="user.position" class="item" />
          </div>
          <div class="group">
            <input type="text" v-model="user.phone_number" class="item" />
          </div>
          <div class="group">
            <div class="item">
              <DashboardUsersParticipationTypes
                :type="user.participation_type"
                @select-type="handleTypeSelect"
              />
            </div>
            <div class="item">
              <DashboardUsersStatusBar
                :status="user.status"
                @select-status="handleSelect"
              />
            </div>
          </div>
          <div class="actions flex flex-1 gap-4 items-end">
            <Button
              class="flex-1"
              :class="canSend ? '' : ' opacity-45 cursor-not-allowed'"
              variant="outline"
              >{{ buttonContent }}</Button
            >
            <NuxtLink
              to="/dashboard"
              class="underline select-none cursor-pointer py-2 flex items-center justify-center"
              >Cancel
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
    <div class="userNotfound" v-else>
      <h1 class="text-center text-4xl text-gray-600 capitalize py-10">
        User not found
      </h1>
    </div>
  </div>
</template>

<script setup>
import stringify from "json-stringify-safe";
const route = useRoute();
const router = useRouter();
const user = ref({});
const homeStore = useMyHomeStore();
const canSend = ref(false);
const buttonContent = ref("Update");

const companiesStore = useMyCompaniesStore();

const handleSelect = (newStatus) => {
  user.value.status = newStatus;
};
const handleTypeSelect = (newType) => {
  user.value.participation_type = newType;
};
const handleCompanySelect = (newComp) => {
  user.value.company = newComp;
  user.value.company_name = newComp.name;
};

watch(
  () => user.value,
  (newVal, oldVal) => {
    if (JSON.stringify(oldVal) != "{}") {
      canSend.value = true;
    }
  },
  { deep: true }
);

onMounted(async () => {
  const dashboardStore = useMyDashboardStore();
  const { runErrorToast } = useShadcnHelpers();
  try {
    dashboardStore.startLoading();
    const id = route.params.id;
    const response = await $fetch(`${homeStore.baseUrl}/api/user/${id}`, {
      method: "GET",
      headers: homeStore.headers,
    });
    user.value = response.user;
    dashboardStore.endLoading();
    await companiesStore.getCompanies();
  } catch (error) {
    if (error.name == "FetchError") {
      navigateTo("/login");
    }
    dashboardStore.errorLoading();
    user.value = {};
    runErrorToast({
      title: "User fetching error.",
      message: error.statusMessage,
    });
  }
});

const submit = async () => {
  if (!canSend.value) return;
  canSend.value = false;
  buttonContent.value = "Updating...";
  const homeStore = useMyHomeStore();
  const dashboardStore = useMyDashboardStore();
  const { runErrorToast, runToast } = useShadcnHelpers();
  const id = route.params.id;
  try {
    dashboardStore.startLoading();

    const userData = stringify(user.value);

    const response = await $fetch(`${homeStore.baseUrl}/api/user/${id}`, {
      method: "patch",
      body: { newData: JSON.parse(userData) },
      headers: homeStore.headers,
    });

    await dashboardStore.getUsers();
    dashboardStore.endLoading();
    runToast(response.message);
    router.push("/dashboard");
  } catch (error) {
    if (error.name == "FetchError") {
      navigateTo("/login");
    }
    runErrorToast({
      title: "User update error",
      message: error.statusMessage,
    });
    console.error(error);
    dashboardStore.errorLoading();
  } finally {
    buttonContent.value = "Update";
    canSend.value = true;
  }
};

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<style scoped lang="scss">
.user {
  .content {
    .userExist {
      @media (max-width: 1080px) {
        flex-direction: column;
        gap: 1rem;
      }
    }
    form {
      input {
        padding: 5px 10px;
        border: 1px solid lightgray;
        border-radius: 2px;
      }

      .group {
        display: flex;
        gap: 1rem;

        .item {
          flex: 1;
        }
      }
    }
  }
}
</style>

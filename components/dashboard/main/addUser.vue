<template>
  <div class="fixed flex justify-center top-0 left-0 w-full h-full p-12 z-10 bg-white">
    <form class="content relative z-10" @submit.prevent="usersStore.createUser">
      <h1 class="text-center text-3xl font-bold text-gray-700 mb-4">Add New User</h1>
      <div class="group">
        <DashboardMainInput link-to="first_name" placeholder="First Name" type="text" />
        <DashboardMainInput link-to="last_name" placeholder="Last Name" type="text" />
      </div>
      <div class="group">
        <DashboardMainInput link-to="company_name" placeholder="Company Name" type="text" />
        <DashboardMainInput link-to="position" placeholder="position" type="text" />
        <DashboardMainInput link-to="email" placeholder="Email address" type="email" />
      </div>
      <div class="group">
        <div class="nestedGroup">
          <CustomCombobox :default-value="defaultValue" :options="countries" />
          <DashboardMainInput link-to="phone_number" placeholder="Phone Number" class="mb-2" type="text" />
        </div>
        <div class="el mb-4 options-wrapper">
          <div class="title">
            <h3>Participation Type</h3>
          </div>
          <div class="options flex flex-col gap-4 w-full">
            <div class="couple flex justify-between gap-4">
              <DashboardMainCheckbox value="exhibitor" group="participationTypeDash" link-to="participation_type"
                title="exhibitor" :error="usersStore.inputs.participation_type.error" />
              <DashboardMainCheckbox value="organizer" group="participationTypeDash" link-to="participation_type"
                title="Organizer" :error="usersStore.inputs.participation_type.error" />
            </div>
            <div class="couple flex justify-between gap-4">
              <DashboardMainCheckbox value="press" group="participationTypeDash" link-to="participation_type"
                title="Press" :error="usersStore.inputs.participation_type.error" />
              <DashboardMainCheckbox value="visitor" group="participationTypeDash" link-to="participation_type"
                title="Visitor" :error="usersStore.inputs.participation_type.error" />
            </div>
          </div>
        </div>
      </div>
      <div class="group">
        <DashboardMainImage />
        <div class="el gap-3 nestedGroup   flex flex-col">
          <div class="options">
            <div class="title">
              <h3>Send badge via</h3>
            </div>
            <div class="couple flex justify-between gap-2">
              <DashboardMainCheckbox value="whatsapp" group="sendVia" link-to="send_via" title="Whatsapp"
                :error="usersStore.inputs.send_via.error" />
              <DashboardMainCheckbox value="email" group="sendVia" link-to="send_via" title="E-Mail"
                :error="usersStore.inputs.send_via.error" />
            </div>
          </div>
        </div>
      </div>
      <div class="submit flex gap-4 items-center">
        <Button class="flex-1" :class="usersStore.canDoActions ? '' : 'cantDoActions'">{{ usersStore.buttonContent.value
        }}</Button>
        <span class="underline cursor-pointer flex-1" @click="usersStore.addUser = false">Close</span>
      </div>
    </form>
  </div>
</template>

<script setup>
const defaultValue = ref([])
const countries = ref([])
const countriesStore = useMyCountriesStore()
const usersStore = useMyUsersStore()

onMounted(async () => {
  await countriesStore.getDefaultCountry()
  defaultValue.value = {
    flag: countriesStore.defaultCountry.flags.png,
    name: countriesStore.defaultCountry.name.common
  }
  await countriesStore.getCountries()
  countries.value = countriesStore.countries.map(({ name, flags }) => {
    const transformedCountry = {
      label: name.common.toLowerCase(),
      value: name.common,
      flag: flags.png,
    }
    return transformedCountry
  })
})

</script>

<style scoped lang="scss">
.content {
  .group {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    .nestedGroup {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    input {
      flex: 1;
    }
  }

  .options-wrapper,
  .options {
    flex: .7;
    color: rgba(0, 0, 0, 0.692);
    user-select: none;

    .title {
      margin-bottom: .6rem;
    }

    .couple {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .submit {
    button {
      &.cantDoActions {
        opacity: .8;
        cursor: not-allowed;
      }
    }
  }
}
</style>
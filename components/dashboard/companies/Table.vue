<template>
  <div class="edit fixed top-0 transition-all bg-white shadow-lg z-20 z p-4 bottom-0" ref="editor"
    :class="openEditor ? 'right-0' : 'right-[-40%]'">
    <div class="title mb-4 text-center font-bold text-xl">
      <h1>Update company</h1>
    </div>
    <div class="inputs flex flex-col gap-5">
      <div class="input flex flex-col gap-2">
        <label for="company_name">Company Name</label>
        <Input id="company_name" :model-value="selectedCompany.name"
          @update:model-value="(value) => selectedCompany.name = value" />
      </div>
      <div class="input">
        <NumberField :min="1" @update:model-value="(value) => selectedCompany.users_limit = value">
          <label>Users limit</label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <Button @click="update">{{ buttonContent }}</Button>
      <Button variant="outline" @click="openEditor = false">Cancel</Button>
    </div>
  </div>
  <Table class="cursor-pointer table min-w-[600px]">
    <TableCaption>A list of your users.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="text-center">Name</TableHead>
        <TableHead class="text-center">Users / Limit</TableHead>
        <TableHead class="text-center">More</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="company in companiesStore.filteredCompanies" :key="company.id">
        <TableCell class="text-center capitalize">{{ company.name }}</TableCell>
        <TableCell class="text-center capitalize">{{ company.users.length }} / {{ company.users_limit }}</TableCell>
        <TableCell class="moreOptions text-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div class="icon flex items-center justify-center">
                <Icon name="ic:outline-more-horiz" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent :class="`${!companiesStore.canDoActions ? 'bg-gray-100' : ''}`">
              <DropdownMenuItem @click="updateCompany(company.id)"
                :class="`${!companiesStore.canDoActions ? 'cursor-not-allowed' : ''}`">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem @click="companiesStore.deleteCompany(company.id)"
                :class="`${!companiesStore.canDoActions ? 'cursor-not-allowed' : ''}`">
                Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup>
import stringify from 'json-stringify-safe';
const editor = ref('')
const openEditor = ref(false)
const buttonContent = ref('Update')
const dashboardStore = useMyDashboardStore()
const homeStore = useMyHomeStore()
const canUpdate = ref(true)
const selectedCompany = ref({
  name: "Company",
  users_limit: 1,
})

const updateCompany = (id) => {
  const selected = companiesStore.companies.find((c) => c.id == id)
  if (selected) {
    selectedCompany.value = { ...selected }
    openEditor.value = true
  }
}

const update = async () => {
  const { runErrorToast, runToast } = useShadcnHelpers()
  if (!canUpdate.value) return;
  buttonContent.value = "Updating..."
  canUpdate.value = false
  dashboardStore.startLoading()
  try {
    const dataToUpdate = stringify(selectedCompany.value)
    const response = await $fetch(`${homeStore.baseUrl}/api/company/${selectedCompany.value.id}`, {
      method: "PATCH",
      body: { newData: JSON.parse(dataToUpdate) }, headers:homeStore.headers
    })
    dashboardStore.endLoading()
    await companiesStore.getCompanies()
    runToast(response.message)
  } catch (error) {
    homeStore.handleError(error)
    dashboardStore.errorLoading()
    runErrorToast({
      title: "Company Error",
      message: error.statusMessage
    })
    console.error(error)
  } finally {
    buttonContent.value = "Update"
    canUpdate.value = true
    openEditor.value = false
  }
}

const companiesStore = useMyCompaniesStore()
onMounted(async () => {
  await companiesStore.getCompanies()
})

</script>

<style scoped lang="scss">
img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: auto;
  border-radius: 4px;
}

.status {
  span {
    text-transform: capitalize;
    font-size: .85rem;
  }

  .circle {
    text-transform: capitalize;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    transform: translateY(20%);
  }

  &.pending {
    .circle {
      color: white;
      background-color: #F7CB73;
    }
  }

  &.rejected {
    .circle {
      color: white;
      background-color: #f60303a6;
    }
  }

  &.accepted {
    .circle {
      color: white;
      background-color: #12BF0C;
    }
  }
}

.moreOptions {
  .icon {
    width: 30px;
    margin: auto;
    height: 30px;
    border-radius: 50%;
    font-size: 20px;
    transition: .2s;

    &:hover {
      background-color: rgb(218, 218, 218);
    }
  }
}
</style>
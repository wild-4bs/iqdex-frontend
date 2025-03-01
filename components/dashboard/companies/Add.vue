<template>
  <Dialog>
    <DialogTrigger as-child="">
      <Button variant="outline">
        Add Company
      </Button>
    </DialogTrigger>
    <DialogContent class="p-4" ref="dialogContent">
      <DialogHeader>
        <DialogTitle class="text-center">Add Company</DialogTitle>
      </DialogHeader>
      <div class="inputs flex flex-col gap-4">
        <div class="input">
          <label for="companyName">Company Name</label>
          <input type="text" id="companyName" v-model="companyName" placeholder="Name">
        </div>
        <div class="input">
          <NumberField :min="1" :default-value="1" @update:model-value="handle">
            <label>Users limit</label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
      <DialogFooter>
        <Button @click="submit" type="submit"
          :class="[companyName != '' ? '' : 'opacity-60', canSend ? '' : 'opacity-50 cursor-not-allowed']">
          {{ buttonContent }}
        </Button>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup>
const buttonContent = ref("Add")
const users_limit = ref(1)
const companyName = ref('')
const canSend = ref(true)
const openDialog = ref(true)
const companiesStore = useMyCompaniesStore()

const handle = (value) => {
  users_limit.value = value
}

const submit = async () => {
  const homeStore = useMyHomeStore()
  const dashboardStore = useMyDashboardStore()
  const { runErrorToast, runToast } = useShadcnHelpers()
  if (companyName.value == '') return;
  if (!canSend.value) return;
  canSend.value = false
  try {
    dashboardStore.startLoading()
    buttonContent.value = "Adding..."
    const response = await $fetch(`${homeStore.baseUrl}/api/company`, {
      method: "POST",
      body: {
        name: companyName.value,
        users_limit: users_limit.value
      }, headers: homeStore.headers
    })
    await companiesStore.getCompanies()
    dashboardStore.endLoading()
    runToast(response.message)
  } catch (error) {
    homeStore.handleError(error)
    dashboardStore.errorLoading()
    runErrorToast({
      title: "Company Error",
      message: error.statusMessage
    })
  } finally {
    buttonContent.value = "Add"
    canSend.value = true
  }
}
</script>

<style scoped lang="scss">
.inputs {
  .input {
    display: flex;
    flex-direction: column;

    label {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.699);
      margin-bottom: .7rem;
    }

    input {
      padding: .4rem .8rem;
      border: 1px solid lightgray;
      border-radius: 4px;
    }
  }
}
</style>
<template>
  <input :type="props.type" v-model="usersStore.inputs[linkTo].value"
    :class="usersStore.inputs[linkTo].error ? 'error' : ''" :placeholder="props.placeholder"
    v-if="props.linkTo != 'phone_number'">
  <div class="phoneNumberInput flex gap-2" v-else>
    <input type="text" readonly class="w-[70px]" :class="usersStore.inputs[linkTo].error ? 'error' : ''"
      :placeholder="countryIdd">
    <input type="text" :class="['w-full', usersStore.inputs[linkTo].error ? 'error' : '']"
      :placeholder="props.placeholder" v-model="usersStore.inputs[linkTo].value">
  </div>
</template>

<script setup>
const usersStore = useMyUsersStore()
const countriesStore = useMyCountriesStore()
const countryIdd = computed(() => {
  if (countriesStore.selectedCountry.idd) {
    const idd = countriesStore.selectedCountry.idd.root + countriesStore.selectedCountry.idd.suffixes[0]
    return idd
  } else {
    return '00'
  }
})
const props = defineProps({
  type: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  linkTo: {
    type: String,
    required: true
  }
})

watch(() => usersStore.inputs.phone_number.value, (newVal) => {
  usersStore.inputs.phone_number.value = newVal.replace(/\D/g, "")
})
</script>

<style scoped lang="scss">
input {
  border: none;
  border: 1px solid lightgray;
  background-color: none;
  padding: .2rem .5rem;
  transition: .2s;
  border-radius: .3rem;

  &.error {
    border-color: rgb(226, 45, 45);

    &::placeholder {
      color: rgb(226, 45, 45);
    }
  }

  &::placeholder {
    text-transform: capitalize;
  }
}

.phoneNumberInput {
  width: 100%;
}
</style>
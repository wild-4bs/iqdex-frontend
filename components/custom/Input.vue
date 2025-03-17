<template>
  <input
    :type="props.type"
    v-model="inputsStore[linkTo].value"
    :class="inputsStore[linkTo].error ? 'error' : ''"
    :placeholder="props.placeholder"
    v-if="props.linkTo != 'phoneNumber'"
  />
  <div class="phoneNumberInput flex gap-2" v-else>
    <input
      type="text"
      readonly
      class="w-[70px]"
      :class="inputsStore[linkTo].error ? 'error' : ''"
      :placeholder="countryIdd"
    />
    <input
      type="text"
      :class="['w-full', inputsStore[linkTo].error ? 'error' : '']"
      :placeholder="props.placeholder"
      v-model="inputsStore[linkTo].value"
    />
  </div>
</template>

<script setup>
const inputsStore = useMyInputsStore();
const countriesStore = useMyCountriesStore();
const countryIdd = computed(() => {
  if (countriesStore.selectedCountry.idd) {
    const idd =
      countriesStore.selectedCountry.idd.root +
      countriesStore.selectedCountry.idd.suffixes[0];
    return idd;
  } else {
    return "00";
  }
});
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  linkTo: {
    type: String,
    required: true,
  },
});
watch(
  () => inputsStore.phoneNumber.value,
  (newVal) => {
    inputsStore.phoneNumber.value =
      newVal?.replace(/\D/g, "").replace(/^0/, "") || "";
  }
);

watch(
  () => inputsStore.firstName.value,
  (newVal) => {
    const cleanned = newVal.replace(/[^\p{L}]/gu, ""); // السماح بجميع الأحرف من أي لغة وحذف الرموز غير الصالحة
    inputsStore.firstName.value = cleanned;
  }
);

watch(
  () => inputsStore.lastName.value,
  (newVal) => {
    const cleanned = newVal.replace(/[^\p{L}]/gu, ""); // السماح بجميع الأحرف من أي لغة وحذف الرموز غير الصالحة
    inputsStore.lastName.value = cleanned;
  }
);
</script>

<style scoped lang="scss">
input {
  border: none;
  border-bottom: 1px solid lightgray;
  background-color: none;
  padding: 0.2rem;
  transition: 0.3s;

  &.error {
    border-bottom-color: rgb(226, 45, 45);

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

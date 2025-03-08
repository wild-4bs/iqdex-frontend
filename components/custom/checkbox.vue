<template>
  <label :for="props.value" :class="['input', props.error ? 'error' : '']"
    @change="setValue(props.value, props.linkTo)">
    <input type="radio" :id="props.value" :value="props.value" :name="props.group">
    <label :for="props.value">
      <div class="icon flex items-center justify-center">
        <Icon name="ic:baseline-check" />
      </div>
    </label>
    <div class="value">
      <span>{{ props.title }}</span>
    </div>
  </label>
</template>

<script setup>
const inputsStore = useMyInputsStore()
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  linkTo: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  error: {
    type: Boolean,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})

const companiesStore = useMyCompaniesStore()

const setValue = (value, linkTo) => {
  if (value != "exhibitor") {
    companiesStore.selectedCompany = {}
  }
  console.log(inputsStore[linkTo]);
  inputsStore[linkTo] = value
}

</script>

<style scoped lang="scss">
.input {
  display: flex;
  align-items: center;
  gap: .3rem;
  flex: 1;
  width: 100%;
  cursor: pointer;

  &.error {
    label {
      border-color: rgb(223, 56, 56);
    }
  }

  input {
    display: none;

    &:checked {
      &+label {
        .icon {
          scale: 1;
          opacity: 1;
        }
      }
    }
  }

  .value {
    word-break: keep-all;
    text-wrap: none;
    min-width: 140px;
  }

  label {
    width: 20px;
    height: 20px;
    border: 1px solid lightgray;
    background-color: white;
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
    position: relative;

    .icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(17, 50, 201);
      color: white;
      font-size: 1.5rem;
      scale: .5;
      opacity: 0;
      transition: .1s;
    }
  }
}
</style>
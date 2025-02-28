<template>
  <div class="image flex gap-4 w-full">
    <label for="imageInput" :style="{ pointerEvents: usersStore.inputs.image.value ? 'none' : '' }" ref="dropArea"
      class="imageInput w-full h-[250px] mb-4" @drop.prevent="handleDrop" @dragleave="dragOver = false"
      @dragover="dragOver = true" @drop="handleDrop"
      :class="['input text-gray-500 flex flex-col relative overflow-hidden rounded-lg border-2 cursor-pointer items-center justify-between text-center border-dotted p-4 border-gray-300', dragOver ? 'dragging' : '', usersStore.inputs.image.error ? 'error' : '']">
      <input type="file" @change="handleFileChange($event.target.files)" class="hidden" id="imageInput"
        ref="imageInput">
      <div v-show="usersStore.inputs.image.value" class="viewer top-0 left-0 w-full h-full"
        style="z-index: 10; position: absolute;">
        <img src="" ref="actualImage" class="w-full h-full object-cover" alt="">
      </div>
      <div class="icon pointer-events-none flex flex-col  gap-2 items-center justify-between text-center">
        <div class="icon text-5xl">
          <Icon name="ic:outline-file-upload" />
        </div>
        <span class="font-medium text-sm">{{ imageInputContent }}</span>
      </div>
      <span class="mb-2 text-center">-OR-</span>
      <span class="py-2 px-4 bg-slate-900 rounded-lg text-gray-200 text-sm" @click="imageInput.click()">Brows
        files</span>
    </label>
  </div>
</template>

<script setup>
const usersStore = useMyUsersStore()
const dropArea = ref('')
const dragOver = ref(false)
const imageInput = ref(null)
const actualImage = ref(null)
const imageInputContent = ref("Drag and drop files here")


const handleFileChange = (files) => {
  const file = files[0];
  const { runErrorToast } = useShadcnHelpers()
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    runErrorToast({
      title: "Image Error",
      message: "Image type is not supported yet, please try PNG or JPG type."
    })
    return;
  }
  const maxSize = 5 * 1024 ** 2;
  if (file.size > maxSize) {
    runErrorToast({
      title: "Image Error",
      message: "Image size is not supported yet, please try to set the image size at the maximum of 5mb type."
    })
    return;
  }
  imageInputContent.value = "Drag and drop files here"
  usersStore.inputs.image.value = file
  const reader = new FileReader();
  reader.onload = function (e) {
    actualImage.value.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
}
const handleDrop = (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 0) {
    imageInput.value.files = files;
    handleFileChange(files);
  }
}

onMounted(() => {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.value.addEventListener(eventName, (e) => { preventDefaults(e) }, false);
  });
})
</script>

<style scoped lang="scss">
.image {
  @media (max-width: 767px) {
    flex-direction: column;
  }

  .imageInput {
    min-width: 230px;

    @media (max-width: 767px) {
      width: 100% !important;
    }

    &.dragging {
      border-color: rgb(0, 140, 255);
    }

    &.error {
      border-color: rgb(230, 42, 42);
    }
  }

  .eg {
    img {
      width: 140px;
    }

    @media (max-width: 1080px) {
      flex-direction: column;

      img {
        margin: auto;
      }

      .imageRequirements {
        width: 100%;
      }
    }
  }
}
</style>
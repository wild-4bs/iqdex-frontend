<template>
  <main>
    <HomeHeader />
    <form @submit.prevent="sendBadge">
      <div class="inputs">
        <div class="group">
          <CustomInput
            link-to="firstName"
            placeholder="first name"
            type="text"
          />
          <CustomInput link-to="lastName" placeholder="last name" type="text" />
        </div>
        <div class="group">
          <div class="el gap-2 nestedGroup flex flex-col">
            <CustomCombobox
              :default-value="defaultValue"
              :options="countries"
            />
            <CustomInput
              link-to="phoneNumber"
              placeholder="Phone Number"
              class="mb-2"
              type="text"
            />
            <div class="options">
              <div class="title">
                <h3>Send badge via</h3>
              </div>
              <div class="couple flex justify-between gap-2">
                <CustomCheckbox
                  value="whatsapp"
                  group="sendVia"
                  link-to="sendVia"
                  title="Whatsapp"
                  :error="sendViaError"
                />
                <CustomCheckbox
                  value="email"
                  group="sendVia"
                  link-to="sendVia"
                  title="E-Mail"
                  :error="sendViaError"
                />
              </div>
            </div>
          </div>
          <div class="el options-wrapper">
            <div class="title">
              <h3>Participation Type</h3>
            </div>
            <div class="options flex flex-col gap-2 w-full">
              <div class="couple flex justify-between gap-4 w-full">
                <CustomCheckbox
                  value="exhibitor"
                  group="participationType"
                  link-to="participationType"
                  title="exhibitor"
                  :error="pTypeError"
                />
                <CustomCheckbox
                  value="organizer"
                  group="participationType"
                  link-to="participationType"
                  title="Organizer"
                  :error="pTypeError"
                />
              </div>
              <div class="couple flex w-full justify-between gap-4">
                <CustomCheckbox
                  value="press"
                  group="participationType"
                  link-to="participationType"
                  title="Press"
                  :error="pTypeError"
                />
                <CustomCheckbox
                  value="visitor"
                  group="participationType"
                  link-to="participationType"
                  title="Visitor"
                  :error="pTypeError"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="group">
          <CustomInput
            link-to="companyName"
            placeholder="Company Name"
            type="text"
            v-if="inputsStore.participationType != 'exhibitor'"
          />
          <HomeCompaniesSelect v-else :error="companyError" />
          <CustomInput
            link-to="position"
            placeholder="Your Position"
            type="text"
          />
        </div>
        <div class="group">
          <CustomInput link-to="email" placeholder="Your Email" type="email" />
        </div>
        <HomeImageInput />
      </div>
      <div class="submit mt-2">
        <button
          :class="[
            'register py-2 px-4 rounded-sm',
            canSubmit ? '' : 'cantSubmit',
          ]"
          v-html="registerButtonContent"
        ></button>
        <span class="clear cursor-pointer p-2 select-none" @click="clearData"
          >Clear all</span
        >
      </div>
    </form>
  </main>
</template>

<script setup>
const inputsStore = useMyInputsStore();
const defaultValue = ref([]);
const companyError = ref(false);
const countries = ref([]);
const countriesStore = useMyCountriesStore();
const sendViaError = ref(false);
const pTypeError = ref(false);
const registerButtonContent = ref("Register Badge");
const canSubmit = ref(true);
const homeStore = useMyHomeStore();
const router = useRouter();
const companiesStore = useMyCompaniesStore();
const { runErrorToast } = useShadcnHelpers();

onMounted(async () => {
  const response = await $fetch(
    `${homeStore.baseUrl}/api/admin/badgeCondition`,
    {
      method: "GET",
    }
  );
  homeStore.expired = response.badge_expired;
  navigateTo("/expired");
  await countriesStore.getDefaultCountry();
  await companiesStore.getCompanies();
  defaultValue.value = {
    flag: countriesStore.defaultCountry.flags.png,
    name: countriesStore.defaultCountry.name.common,
  };
  await countriesStore.getCountries();
  countries.value = countriesStore.countries.map(({ name, flags }) => {
    const transformedCountry = {
      label: name.common.toLowerCase(),
      value: name.common,
      flag: flags.png,
    };
    return transformedCountry;
  });
});

const sendBadge = async () => {
  const inputs = [
    "firstName",
    "lastName",
    "country",
    "position",
    "companyName",
    "phoneNumber",
    "email",
  ];
  const canSend = ref(true);
  const firstName = inputsStore.firstName.value;
  const lastName = inputsStore.lastName.value;
  const companyName = inputsStore.companyName.value;
  const email = inputsStore.email.value;
  const phoneNumber = inputsStore.phoneNumber.value;
  const position = inputsStore.position.value;
  inputs.forEach((input) => {
    if (inputsStore.participationType != "exhibitor") {
      if (inputsStore[input].value == "") {
        canSend.value = false;
        inputsStore[input].error = true;
      } else {
        canSend.value = true;
        inputsStore[input].error = false;
      }
    } else {
      if (inputsStore[input].value == "") {
        if (input != "companyName") {
          canSend.value = false;
          inputsStore[input].error = true;
        }
      } else {
        canSend.value = true;
        inputsStore[input].error = false;
      }
    }
  });
  if (
    inputsStore.participationType == "exhibitor" &&
    !companiesStore.selectedCompany.id
  ) {
    companyError.value = true;
    canSend.value = false;
  } else if (
    inputsStore.participationType == "exhibitor" &&
    companiesStore.selectedCompany.id
  ) {
    companyError.value = false;
    canSend.value = true;
  }
  if (inputsStore.participationType == "") {
    canSend.value = false;
    pTypeError.value = true;
  } else {
    canSend.value = true;
    pTypeError.value = false;
  }
  if (inputsStore.sendVia == "") {
    canSend.value = false;
    sendViaError.value = true;
  } else {
    canSend.value = true;
    sendViaError.value = false;
  }
  if (inputsStore.image.value == "") {
    canSend.value = false;
    inputsStore.image.error = true;
  } else {
    canSend.value = true;
    inputsStore.image.error = false;
  }
  if (!canSend.value) {
    return;
  }
  const fields = ["position", "firstName", "lastName"];
  if (inputsStore.participationType != "exhibitor") {
    fields.push("companyName");
  }
  let hasError = false;

  fields.forEach((field) => {
    const value = inputsStore[field].value.trim();
    if (!/^[A-Za-z\s]+$/.test(value)) {
      // يسمح فقط بالأحرف الإنجليزية والمسافات
      inputsStore[field].error = true;
      hasError = true;

      runErrorToast({
        title: "Typing Error",
        message: `You can only use English letters in ${field}. Please remove any non-English characters.`,
      });
    } else {
      inputsStore[field].error = false;
    }
  });
  if (hasError) return;
  console.log(countriesStore.selectedCountry + "this from register.");
  const idd =
    countriesStore.selectedCountry.idd.root +
    countriesStore.selectedCountry.idd.suffixes[0];

  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append(
    "phone_number",
    idd.toString() + " " + phoneNumber.toString()
  );
  formData.append("email", email);
  formData.append("country", countriesStore.selectedCountry.name.common);
  formData.append("country_code", idd);
  formData.append("position", position);
  formData.append("participation_type", inputsStore.participationType);
  formData.append("send_via", inputsStore.sendVia);
  formData.append("image", inputsStore.image.value);
  if (inputsStore.participationType == "exhibitor") {
    formData.append("company_name", companiesStore.selectedCompany.name);
    formData.append("company_id", companiesStore.selectedCompany.id);
  } else {
    formData.append("company_name", companyName);
  }

  try {
    canSubmit.value = false;
    registerButtonContent.value = "Registering...";
    const response = await $fetch(`${homeStore.baseUrl}/api/user/register`, {
      method: "POST",
      body: formData,
    });
    homeStore.user = response.user;
    registerButtonContent.value = "Badge Registered";
    clearData();
    router.push("/success");
  } catch (error) {
    registerButtonContent.value = "Register Badge";
    runErrorToast({
      title: "Something went wrong.",
      message: error.statusMessage,
    });
    console.error(error);
  } finally {
    canSubmit.value = true;
  }
};

const clearData = () => {
  const inputs = [
    "firstName",
    "lastName",
    "country",
    "position",
    "companyName",
    "phoneNumber",
    "email",
  ];
  inputs.forEach((input) => {
    inputsStore[input].value = "";
  });
  inputsStore.image.value = "";
};
</script>

<style scoped lang="scss">
.inputs {
  width: 100%;
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  .group {
    display: flex;
    justify-content: space-between;
    gap: 3rem;

    @media (max-width: 1080px) {
      gap: 1rem;
    }

    .el {
      width: 45%;

      @media (max-width: 1080px) {
        width: 100%;
      }

      input {
        width: 100%;
      }
    }

    @media (max-width: 1080px) {
      flex-direction: column;
      justify-content: start;

      input {
        width: 100% !important;
      }
    }

    input {
      width: 45%;
    }
  }

  .options-wrapper,
  .options {
    flex: 0.7;
    color: rgba(0, 0, 0, 0.692);
    user-select: none;

    .title {
      margin-bottom: 0.3rem;
    }

    .couple {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .register {
    background-color: rgba(0, 68, 255, 0.884);
    color: rgb(255, 255, 255);
    border-radius: 100px;
    width: 200px;
    transition: 0.2s;

    &.cantSubmit {
      opacity: 0.5;
    }
  }

  .clear {
    text-decoration: underline;
  }
}
</style>

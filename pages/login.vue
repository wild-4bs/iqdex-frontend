<template>
  <div class="w-full h-[100dvh] bg-gray-700 flex items-center justify-center">
    <form
      class="p-4 bg-white rounded-lg w-full max-w-[500px] flex flex-col gap-4"
      @submit.prevent="login"
    >
      <div class="title text-center text-xl font-bold">
        <h1>Login to Malamih dashboard</h1>
      </div>
      <div class="inputs">
        <label for="emailInput">Email</label>
        <input
          type="email"
          v-model="email"
          required
          id="emailInput"
          placeholder="eg@gmail.com"
        />
      </div>
      <div class="inputs">
        <label for="passInput">Password</label>
        <input
          type="password"
          v-model="password"
          required
          id="passInput"
          placeholder="********"
        />
      </div>
      <div class="submit">
        <Button class="w-full" :disabled="!canSend">{{ buttonContent }}</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import Cookies from "universal-cookie";

definePageMeta({
  layout: "login",
});
const email = ref("");
const password = ref("");
const homeStore = useMyHomeStore();
const canSend = ref(true);
const buttonContent = ref("Sign in");

const login = async () => {
  if (!canSend.value) return;
  const { runToast, runErrorToast } = useShadcnHelpers();
  try {
    buttonContent.value = "Signing in...";
    canSend.value = false;
    const response = await $fetch(`${homeStore.baseUrl}/api/admin/login`, {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });
    const cookies = new Cookies();
    cookies.set("auth_token", response.token);
    localStorage.setItem("auth_token", JSON.stringify(response.token));
    runToast(response.message);
    buttonContent.value = "Login";
    navigateTo("/dashboard");
  } catch (error) {
    buttonContent.value = "Login";
    runErrorToast({
      title: "Login Error",
      message: error.statusMessage,
    });
  } finally {
    canSend.value = true;
  }
};
</script>

<style scoped lang="scss">
.inputs {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  input {
    padding: 0.5rem 1rem;
    border: 1px solid lightgray;
    border-radius: 0.3rem;
  }
}
</style>

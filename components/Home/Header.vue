<template>
  <header>
    <div class="logo">
      <img src="/logo.png" alt="IQDex logo" />
    </div>
    <div class="title">
      <h1>Iraq Defense Exhibition "IQDEX 2025"</h1>
      <p>
        The 13th session of Iraq Defense Exhibition for the period from April
        19th - 22nd, 2025 - Baghdad int. Fairground, Baghdad, Iraq
      </p>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid lightgray;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  .logo {
    img {
      width: 150px;
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 90%;
    padding: 0.3rem 0;

    h1 {
      font-weight: bold;
      font-size: 1.2rem;
    }

    p {
      width: 90%;
      font-weight: 600;
      color: rgb(51, 51, 51);
      font-size: 0.8rem;
    }
  }
}
</style>

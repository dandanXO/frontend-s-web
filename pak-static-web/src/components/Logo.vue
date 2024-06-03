<template>
  <div class="logo">
    <router-link to="/home">
      <img :src="require('@/assets/logo.png')" />
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: block;
  overflow: hidden;
  width: 162px;
  max-width: 162px;

  @media (min-width: 768px) {
    margin-block: 0.25rem;
  }

  img {
    display: block;
    width: 100%;
  }
}
</style>

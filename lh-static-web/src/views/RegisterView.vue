<template>
  <div class="register-page-container">
    <div class="center">
      <router-link to="/">
        <div class="logo">
          <img src="@/assets/app/logo.png" />
        </div>
      </router-link>

      <div class="card-bg">
        <RegisterAccount />
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterAccount from "@/components/auth/register/index.vue";
</script>

<style scoped lang="scss">
.register-page-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat top center;
  background-size: cover;
  display: flex;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin: 40px auto;
  width: 100%;
  max-width: 600px;
}

.logo img {
  width: 200px;
}

.card-bg {
  background-color: #f7f9fc;
  box-shadow: 0px 0px 10px 0px #0000001a;
  padding: 50px;
  border-radius: 10px;
}

.dark {
  .register-page-container {
    background: url("@/assets/home/auth/login-page-bg-dark.png") no-repeat top center;
    background-size: cover;
  }

  .card-bg {
    @include content-block-dark;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0) 98.7%);
  }
}
</style>

<template>
  <div class="register-page-container">
    <div class="center">
      <router-link to="/">
        <div class="logo">
          <img src="@/assets/logo.svg" />
        </div>
      </router-link>

      <div class="card-bg">
        <RegisterAccount />
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterAccount from "@/components/auth/RegisterAccount.vue";

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
  gap: 10px;
  margin: 8px auto 30px;
  width: 100%;
  max-width: 600px;
}

.logo img {
  width: 200px;
}

.card-bg {
  background-color: #F7F9FC;
  box-shadow: 0px 0px 10px 0px #0000001A;
  padding: 10px 30px 16px;
  border-radius: 10px;
}
</style>
  
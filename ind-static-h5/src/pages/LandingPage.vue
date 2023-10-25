<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/logo.png" />
    </div>

    <div class="landing-img">
      <img src="../assets/images/login/landing-img.png" />
    </div>

    <div class="landing-btns">
      <q-btn rounded flat no-caps class="btn-yellow" @click="$router.push('/login')">Login</q-btn>
      <q-btn rounded flat no-caps class="btn-yellow" @click="$router.push('/register')">Register</q-btn>
      <q-btn rounded flat no-caps class="btn-purple" @click="$router.push('/guestlogin')">Play As Guest</q-btn>
    </div>
  </div>
</template>

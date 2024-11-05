<template>
  <div class="redirect-page" v-if="!redirected">
    <!--    <h1>Redirecting Soon...</h1>-->
    <h1 id="countdown">Waiting time : {{ countdown }} seconds;</h1>
    <!--    <p class="redirect-info">Please wait while we take you to your destination.</p>-->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";

const countdown = ref(5);
const allowedDomains = ["pkmagr98.cc", "cbrfobx1.cc", "localhost"];

const router = useRouter();
const redirected = ref(false);

onMounted(() => {
  const currentDomain = window.location.hostname;
  if (allowedDomains.includes(currentDomain)) {
    countdown.value = 3;
  }

  const redirectKey = `redirected-${currentDomain}`;
  let redirectPath = SessionStorage.getItem("REDIRECT_PATH");
  if (!redirectPath || redirectPath === "/redirect") {
    redirectPath = "/";
  }

  if (SessionStorage.getItem(redirectKey)) {
    redirected.value = true;
    router.replace(redirectPath);
  } else {
    SessionStorage.setItem(redirectKey, "true");
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(timer);
        router.replace(redirectPath);
      }
    }, 1000);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #1a1a1d;
  color: #f5f5f5;
}

.redirect-page {
  text-align: center;
  /* background: #2e2e30; */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 1.8rem;
  color: #e2e2e2;
  margin: 0 0 20px 0;
  padding: 0;
  line-height: unset;
}

#countdown {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c8761;
}

.redirect-info {
  margin-top: 10px;
  font-size: 1rem;
  color: #cccccc;
}
</style>

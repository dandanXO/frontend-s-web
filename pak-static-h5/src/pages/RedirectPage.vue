<template>
  <div class="redirect-page" :class="wrapperClass" v-if="!redirected">
    <!--    <h1>Redirecting Soon...</h1>-->
    <!-- <h1 id="countdown">Waiting time : {{ countdown }} seconds;</h1> -->
    <!--    <p class="redirect-info">Please wait while we take you to your destination.</p>-->
    
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";

const countdown = ref(5);
const allowedDomains = ["pkmagr98.cc", "cbrfobx1.cc"];

const domains2Seconds = ["localhost", "b4qn4pb8.cc", "gey4oewd.cc", "3kxkvvuk.cc", "936tk9nn.cc", "jxbma2xq.cc"];

const allDomains = [
  "pkmagr98.cc",
  "cbrfobx1.cc",
  "xsu5qyks.cc",
  "5vh518iw.cc",
  "9o48ca3p.cc",
  "b4qn4pb8.cc",
  "gey4oewd.cc",
  "3kxkvvuk.cc",
  "936tk9nn.cc",
  "jxbma2xq.cc"
];

const router = useRouter();
const redirected = ref(false);
const wrapperClass = ref("");

onMounted(() => {
  const currentDomain = window.location.hostname;
  if (allowedDomains.includes(currentDomain)) {
    countdown.value = 3;
  } else if (domains2Seconds.includes(currentDomain)) {
    countdown.value = 2;
  }
  const index = allDomains.indexOf(currentDomain);
  wrapperClass.value = `special-bg-${(index % 10) + 1}`;

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

<style scoped lang="scss">
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
  max-width: 500px;
  margin: auto;
  background: url("../assets/images/redirect/0.png") no-repeat center center;
  background-size: contain;
  background-color: #041814;
  &:after {
    background: url("../assets/images/redirect/logo.gif") no-repeat center center;
    content: "";
    position: absolute;
    bottom: 2vh;
    width: 80%;
    height: 6vh;
    // transform: translateX(50%, -50%);
    background-size: contain;
    
  }
  // @for $i from 1 through 10 {
  //   &.special-bg-#{$i} {
  //     background: url("../assets/images/redirect/#{$i}.png") no-repeat center center;
  //     background-size: 100% 100%;
  //   }
  // }
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

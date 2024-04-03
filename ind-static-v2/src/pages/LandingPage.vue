<template>
  <div class="landing-container">
    <div class="logo">
      <img src="../assets/logo.png" />
    </div>

    <div class="landing-img">
      <img src="../assets/images/login/landing-img.png" />
    </div>

    <div class="landing-btns">
      <q-btn rounded flat no-caps class="btn-yellow" @click="$router.push('/login')">Login</q-btn>
      <q-btn rounded flat no-caps class="btn-yellow" @click="$router.push('/register')">Register</q-btn>
      <q-btn rounded flat no-caps class="btn-purple" @click="guestLogin()" v-if="Platform.is.capacitor">
        Play As Guest
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { Device } from "@capacitor/device";
import { useQuasar, Platform } from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const $q = useQuasar();
const qs = require("qs");
const store = userStore();
const router = useRouter();

const guestLoginInfo = reactive({
  sid: "",
  way: "ANDROID"
});

const guestLogin = () => {
  $q.loading.show({
    message: "Playing as guest"
  });

  (async () => {
    guestLoginInfo.sid = guestDeviceInfo.value;

    api
      .post("/member/quickRegister", qs.stringify(guestLoginInfo))
      .then((ret) => {
        const res = ret;
        console.log("res:", res);

        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Quick registered successfully",
            icon: "check_circle_outline"
          });
          store.autoLogin(res.data);
          sessionStorage.removeItem("REFERRAL_CODE");
          if (store.hasToken()) {
            router.push("/home");
          }
        } else if (res.code === 1010) {
          $q.notify({
            color: "warning",
            position: "top",
            message: "Please login with password to continue",
            icon: "report_problem"
          });
          router.push("/login");
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          });
        }
        $q.loading.hide();
      })
      .catch((error) => {
        $q.loading.hide();
      });
    // getCode();
  })();
};

const guestDeviceInfo = ref("");

const getAppInfo = async () => {
  const info = await Device.getId();
  guestDeviceInfo.value = info.identifier;
};

onMounted(() => {
  getAppInfo();
});
</script>

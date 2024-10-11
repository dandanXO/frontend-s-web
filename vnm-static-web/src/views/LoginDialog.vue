<template>
  <AccountLogin
    @close-dialog="closeLoginDialog"
    @open-reg-dialog="openRegDialog"
    @open-forgotpwd-dialog="openForgotpwdDialog"
  />
</template>

<script setup>
import { onMounted, defineEmits } from "vue";
import AccountLogin from "@/components/auth/AccountLogin.vue";

const emits = defineEmits(["close-dialog, open-reg-dialog, open-forgotpwd-dialog"]);

const openForgotpwdDialog = () => {
  emits("open-forgotpwd-dialog");
};

const closeLoginDialog = () => {
  emits("close-dialog");
};

const openRegDialog = () => {
  emits("open-reg-dialog");
};

onMounted(() => {
});
</script>

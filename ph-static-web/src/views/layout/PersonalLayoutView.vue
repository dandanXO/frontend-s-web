<template>
  <div class="account-container">
    <a-config-provider>
      <template #renderEmpty>
        <div style="text-align: center">
          <a-empty :image="simpleImage" :description="'No information'" />
        </div>
      </template>
      <div class="flex-box flex-wrap margin-center account-container-wrap">
        <div class="account-box account-box-wrapper">
          <account-menu />
        </div>
        <div class="account-box account-content-wrapper">
          <router-view />
        </div></div
    ></a-config-provider>
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import { Empty } from 'ant-design-vue'
import AccountMenu from "@/components/account/AccountMenu.vue";
import "@/assets/css/account.scss";

export default defineComponent({
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  name: "PersonalLayoutView",
  components: {
    AccountMenu
  },
  setup() {
    return {};
  }
});
</script>

<style scoped></style>

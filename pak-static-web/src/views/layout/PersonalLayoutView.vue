<template>
  <div class="account-container">
    <a-config-provider>
      <template #renderEmpty>
        <div style="text-align: center">
          <a-empty :image="simpleImage" :description="'No information'" />
        </div>
      </template>
      <div class="flex-box margin-center account-container-wrap">
        <div class="account-box account-box-wrapper">
          <account-menu />
        </div>
        <div class="account-box account-content-wrapper">
          <router-view :class="{ menuactive: globalStore.isMenuActive }" />
        </div>
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="js">
import { defineComponent, watchEffect, ref } from "vue";
import AccountMenu from "@/components/account/AccountMenu.vue";
import "@/assets/css/account.scss";
import Empty from "@/assets/images/empty.png";
import EmptyDark from "@/assets/images/emptydark.png";
import { globalStore } from "@/store";

export default defineComponent({
  name: "PersonalLayoutView",
  components: {
    AccountMenu
  },
  setup() {
    const simpleImage = ref(Empty)
    watchEffect(() => {
      // Update simpleImage based on isDarkMode
      simpleImage.value = globalStore.isDarkMode ? EmptyDark : Empty;
    });
    return {
      globalStore,
      simpleImage
    };
  }
});
</script>

<style scoped lang="scss">
.account-container-wrap {
  gap: 16px;
  border-radius: 0;
}

:deep(.ant-empty-image) {
  height: 200px;
  margin-bottom: 0;
}
</style>

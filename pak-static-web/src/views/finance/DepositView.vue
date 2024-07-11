<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">
        {{ $t(`personalView.finance.${activeName.toLocaleLowerCase()}.title`) }}
      </span>
    </div>

    <div class="account-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('personalView.finance.deposit.title')" name="Deposit">
          <DepositComponent />
        </el-tab-pane>
        <el-tab-pane :label="$t('personalView.finance.withdraw.title')" name="Withdraw">
          <WithdrawPage />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DepositComponent from "@/components/depositComponent.vue";
import WithdrawPage from "@/views/finance/WithdrawView.vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { userStore } from "@/store/index";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
components: {
  DepositComponent, WithdrawPage;
}
const store = userStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const activeName = ref("Deposit");
// Function to check the route query parameter and update activeName
const checkRoute = () => {
  if (route.query.tab === "withdraw") {
    activeName.value = "Withdraw";
  } else {
    activeName.value = "Deposit";
  }
};
const checkNewUser = () => {
  if (route.query.tab !== "withdraw") return;
  if (store.realName == "" || store.realName == null) {
    ElMessage.error(t("personalView.finance.newUserError"));
    router.push(`/center/personal`);
  }
};
// Initial check on mounted
onMounted(() => {
  checkRoute();
  checkNewUser();
});

// Watch for changes in the route query parameter
watch(
  () => route.query.tab,
  (newTab) => {
    checkRoute();
    checkNewUser();
  }
);
watch(
  () => activeName.value,
  () => {
    if (activeName.value === "Withdraw") {
      router.push({ query: { tab: "withdraw" } });
    }
    if (activeName.value === "Deposit") {
      router.push({ query: "" });
    }
  }
);
</script>
<style scoped lang="scss">
:deep(.el-tabs__item) {
  color: #8c968f;
}
:deep(.el-tabs__item.is-active),
:deep(.el-tabs__item:hover) {
  color: #ffffff;
}
:deep(.el-tabs__item.is-active) {
}
:deep(.el-tabs__active-bar.is-top) {
  background: #70bc62;
}
.el-tabs {
  --el-border-color-light: transparent;
}
</style>

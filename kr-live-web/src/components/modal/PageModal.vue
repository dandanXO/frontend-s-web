<template>
  <q-scroll-area>
    <q-dialog @hide="closeDialog" v-model="visible" class="pageDialog">
      <q-toolbar>
        <div class="topActions">
          <q-toolbar-title>1123</q-toolbar-title>
          <q-btn flat @click="closeDialog()" round dense icon="close" />
          <p>page={{page}}</p>
          <template v-if="page === 'finance/deposit'">
            <FinanceDeposit/>
          </template>
          <template v-if="page === 'finance/withdraw'">
            <FinanceWithdraw/>
          </template>
          <template v-if="page === 'notify'">
            <NotifyComponent/>
          </template>
          <template v-if="page === 'customer/service'">
            <CustomerService/>
          </template>
        </div>
      </q-toolbar>
    </q-dialog>
  </q-scroll-area>

</template>
<script setup id="PageModal">
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { ref, defineExpose, reactive, shallowRef, watch, nextTick } from "vue";
import FinanceDeposit from "components/pageModalContent/FinanceDeposit";
import FinanceWithdraw from "components/pageModalContent/FinanceWithdraw";
import NotifyComponent from "components/pageModalContent/NotifyComponent";
import CustomerService from "components/pageModalContent/CustomerService";

const route = useRoute();
const router = useRouter();
const visible = ref(false);
const store = userStore();
const page = ref("");

watch(() => route.query, () => {
  if (route.query && route.query.page) {
    nextTick(() => {
      page.value = route.query.page;
      open(route.query.page)
    })
  }
}, { immediate: true});

const closeDialog = () => {
  visible.value = false;
  page.value = "";
  router.push({ path: route.pathname });
};
const open = (pageName) => {
  console.log(pageName)
  if (store.hasToken()) {
    if (!visible.value) visible.value = true
  } else {
    router.push({ path: "/login", query: { redirect: route.path } });
  }
};

</script>
<style lang="scss">
.pageDialog {
  background: #23263cbc;
}
</style>

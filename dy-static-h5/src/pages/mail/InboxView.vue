<template>
  <div class="table-record">
    <q-tabs v-model="tab" indicator-color="primary" align="justify" @update:model-value="updateMailBox">
      <q-tab v-for="(tab, i) in mailboxMessageTypeData" :key="i" :name="tab.type" :label="tab.name" />
    </q-tabs>

    <MailComponent :loading="visible" :list="mailData" :type="tab" />
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";

components: {
  MailComponent;
}

const tab = ref("NOTIFICATION");

const mailboxMessageTypeData = ref([
  { num: 1, type: "NOTIFICATION", name: "通知" },
  { num: 2, type: "ACTIVITY", name: "活动" },
  { num: 3, type: "ANNOUNCEMENT", name: "公告" },
  { num: 4, type: "PAYMENT", name: "充提" },
  { num: 5, type: "ALL", name: "全部" }
]);
const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "sendTime"
});
const loadInbox = (tab) => {
  visible.value = true;
  mailData.value = [];
  tab = tab === "ALL" ? "" : tab;

  api
    .get("/session/inbox", {
      params: {
        type: mailboxData.value.type,
        orderBy: mailboxData.value.orderBy,
        messageType: tab
      }
    })
    .then((response) => {
      if (response.code === 0) {
        mailData.value = response.data.records;
        visible.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const updateMailBox = (e) => {
  console.log(e);
  loadInbox(e);
};
onMounted(() => {
  loadInbox(tab.value);
});
</script>
<style scoped lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .label {
    color: #bacef1;
  }
}
</style>

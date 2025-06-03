<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" :type="tab" @tabChange="handleTabChange" />
  </div>
</template>
<script setup>
import { onMounted, ref, watch, reactive } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";

components: {
  MailComponent;
}

const tab = ref("ACTIVITY");

// const mailboxMessageTypeData = ref([
//   { num: 1, type: "NOTIFICATION", name: "通知" },
//   { num: 2, type: "ACTIVITY", name: "活动" },
//   { num: 3, type: "ANNOUNCEMENT", name: "公告" },
//   { num: 4, type: "PAYMENT", name: "充提" },
//   { num: 5, type: "ALL", name: "全部" }
// ]);
const visible = ref(true);
const mailData = ref([]);
const mailboxData = reactive({
  type: null,
  orderBy: "sendTime",
  messageType: tab.value
});
const loadInbox = (tab) => {
  visible.value = true;
  mailData.value = [];
  tab = tab === "ALL" ? "" : tab;

  api
    .get("/session/pm/inbox", {
      params: {
        type: mailboxData.type,
        orderBy: mailboxData.orderBy,
        messageType: mailboxData.messageType
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

const handleTabChange = (type) => {
  tab.value = type;
  mailboxData.messageType = type;
  loadInbox(type);
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

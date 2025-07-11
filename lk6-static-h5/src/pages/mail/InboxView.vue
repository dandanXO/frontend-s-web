<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" :type="tab" />
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
  messageType: tab.value,
  current: 1
});
const loadInbox = () => {
  console.log(1);
  api
    .get("/session/pm/inbox", {
      params: {
        type: mailboxData.type,
        orderBy: mailboxData.orderBy,
        current: mailboxData.current
        // messageType: mailboxData.messageType
      }
    })
    .then((response) => {
      if (response.code === 0) {
        if (mailData.value.length === 0) {
          mailData.value = response.data.records;
        } else {
          mailData.value.push(...response.data.records);
        }
        visible.value = false;
        if (response.data.current < response.data.pages) {
          mailboxData.catch++;
          loadInbox();
        }
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
  loadInbox();
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

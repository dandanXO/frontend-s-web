<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" type="outbox" />
  </div>
</template>
<script setup>
import { onActivated, onBeforeMount, onMounted, ref } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";
components: {
  MailComponent;
}
const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime",
  current: 1,
  size: 100,
});
const loadOutbox = () => {
  api
    .get("/session/feedback/messages", {
      params: mailboxData.value,
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
onActivated(() => {
  loadOutbox();
});
</script>

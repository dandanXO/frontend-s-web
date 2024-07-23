<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" type="outbox" />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";
components: {
  MailComponent;
}
const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime"
});
const loadOutbox = () => {
  api
    .get("/session/outbox", {
      params: {
        type: mailboxData.value.type,
        orderBy: mailboxData.value.orderBy
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
onMounted(() => {
  loadOutbox();
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

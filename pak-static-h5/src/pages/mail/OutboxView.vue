<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" />
  </div>

  <div class="bottom-btn">
    <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="router.push('/account/write')">
      POST COMMENTS
    </q-btn>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

components: {
  MailComponent;
}
const visible = ref(true);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "createTime"
});

const store = userStore();
const router = useRouter();

const loadOutboxFeedback = () => {
  api
    .get(`/session/feedback/replies`)
    .then((res) => {
      console.log("res", res);
      mailData.value = res.data.records;
      visible.value = false;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

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
  // loadOutbox();
  loadOutboxFeedback();
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

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
  padding: 20px;
}
</style>

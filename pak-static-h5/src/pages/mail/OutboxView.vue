<template>
  <div class="table-record">
    <MailComponent :loading="visible" :list="mailData" />
  </div>

  <div class="bottom-btn">
    <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="isPostCommentsModal = true">
      {{ $t("btn.postComments") }}
    </q-btn>
  </div>

  <q-dialog class="flex-end" v-model="isPostCommentsModal">
    <div class="popout-dialog post-comments-modal">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />

      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("btn.postComments") }}</div>
        <!-- <q-toolbar class="post-dialog-toolbar">
        <q-toolbar-title>{{ $t("btn.postComments") }}</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" />
      </q-toolbar> -->
        <WriteComponent @close-modal="closeModal" />
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import MailComponent from "../../components/MailComponent.vue";
import WriteComponent from "../../components/WriteComponent.vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

components: {
  WriteComponent, MailComponent;
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

const isPostCommentsModal = ref(false);

const closeModal = () => {
  isPostCommentsModal.value = false;
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
    color: #B2BDBF;
  }
}

.bottom-btn {
  display: flex;
  width: 100%;
  margin-top: 20px;
  padding: 20px;
}

.post-dialog-card {
  background: #131313;
  width: calc(100% - 32px);
}
.post-comments-modal {
  background: #232626;
  border-radius: 6px 6px 0 0;
}
.post-dialog-toolbar {
  background: unset;
  .q-toolbar__title {
    // text-align: center;
    // position: absolute;
    // left: 50%;
    // transform: translateX(-50%);
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 18px;
    line-height: 20.92px;
    letter-spacing: 0px;
    text-align: center;
    color: #ffffff;
  }

  button {
    position: absolute;
    right: 16px;
  }
}
</style>

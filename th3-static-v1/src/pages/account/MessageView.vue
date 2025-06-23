<template>
  <q-page class="account-message-page">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('records.noMessage')"></NoInfoComponent>
    <q-card v-else v-for="(e, i) in mailData" :key="`${e}-${i}`" class="msg-container">
      <img
        class="new-message-ribbon"
        src="@/assets/images/message/new-message-ribbon.svg"
        v-if="!e.status && store.readMsgLists.indexOf(e.id) === -1"
      />

      <div class="message-wrapper">
        <q-card-section class="title">
          <div>{{ e.title }}</div>
        </q-card-section>
        <q-card-section class="content">{{ e.content }}</q-card-section>

        <q-card-section class="bottom-wrapper">
          <div class="time">{{ convertToGMT7(e.sendTime) }}</div>
          <q-btn class="detail-btn" @click="onDetailsClick(e)" flat unelevated>
            {{ $t("btn.more") }}&nbsp;
            <q-icon class="forward-icon" name="arrow_forward_ios" size="small" />
          </q-btn>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { onActivated, ref } from "vue";
import { useRouter } from "vue-router";

import { api } from "@/boot/axios";
import { convertToGMT7 } from "@/boot/utils";
import LoadingComponent from "@/components/LoadingComponent.vue";
import NoInfoComponent from "@/components/NoInfoComponent.vue";
import { userStore } from "@/stores/index";

const router = useRouter();
const store = userStore();
const isLoading = ref(true);
const isNoInfo = ref(true);
const readIdLists = ref([]);
const mailData = ref([]);
const mailboxData = ref({
  type: null,
  orderBy: "sendTime"
});
const loadInbox = () => {
  api
    .get("/session/inbox", {
      params: {
        type: mailboxData.value.type,
        orderBy: mailboxData.value.orderBy
      }
    })
    .then((response) => {
      if (response.code === 0) {
        const record = response.data.records;
        mailData.value = record;

        if (record.length === 0) isNoInfo.value = true;
        else isNoInfo.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isLoading.value = false;
    });
};

const onDetailsClick = (mailData) => {
  store.setMailData(mailData);

  // NOTE: /session/inbox/read api call inside message-detail page onMounted
  router.push("/account/message-detail");
};

onActivated(() => {
  loadInbox();
  store.setReadMsg();
});
</script>

<style lang="scss" scoped>
.account-message-page {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}
.msg-container {
  padding: 1rem;
  margin: 0;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #171e2b;
  position: relative;
  box-shadow: none;

  &:has(.new-message-ribbon) {
    background: #27344a;
  }

  .new-message-ribbon {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
  }

  .message-wrapper {
    height: 100%;
    width: 100%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    gap: 0.5rem;

    .status {
      border-radius: 12.5rem;
      background: rgba(255, 255, 255, 0.2);
      font-size: 1rem;
      font-weight: 700;
      padding: 0 1rem;
      min-height: unset;
      color: $negative;
    }
  }

  .content {
    font-size: 14px;
    // font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bottom-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0 0 0;

    .time {
      font-size: 1rem;
      // font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
    }

    .detail-btn {
      border-radius: 12.5rem;
      background: rgba(255, 255, 255, 0.3);
      font-size: 1rem;
      // font-weight: 700;
      padding: 0 1rem;
      min-height: unset;
      text-transform: capitalize;
    }
  }
}
</style>

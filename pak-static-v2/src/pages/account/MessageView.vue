<template>
  <q-page class="account-message-page">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Message"></NoInfoComponent>
    <q-card v-else v-for="(e, i) in mailData" :key="`${e}-${i}`" class="msg-container">
      <img
        class="new-message-ribbon"
        src="../../assets/images/message/new-message-ribbon.svg"
        v-if="!e.status && store.readMsgLists.indexOf(e.id) === -1"
      />

      <div class="message-wrapper">
        <q-card-section class="title">
          <div>{{ e.title }}</div>
        </q-card-section>
        <q-card-section class="content">{{ e.content }}</q-card-section>

        <q-card-section class="bottom-wrapper">
          <div class="time">{{ convertToGMT55(e.sendTime) }}</div>
          <q-btn class="detail-btn" @click="onDetailsClick(e)">
            {{ $t("btn.more") }}&nbsp;
            <q-icon class="forward-icon" name="arrow_forward_ios" size="small" />
          </q-btn>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { convertToGMT55 } from "src/boot/utils";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";

const router = useRouter();
const store = userStore();

let slideList = ref(["Message", "Personal Center", "Discount", "Record", "Order", "Bank"]);
let slideListPath = ref([
  "/account/message",
  "/account",
  "/account/discount",
  "/account/record",
  "/account/order",
  "/account/bank"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

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
    .get("/session/pm/inbox", {
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
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  >div:not(:last-child) {
    margin-bottom: 20px;
  }
}
.msg-container {
  padding: 1rem;
  margin: 0;
  border-radius: 4px;
  border: none;
  background: #fcfdfe;
  box-shadow: 0px -1px 8px 0px #c3d4e6 inset, 0px 3px 0px 0px #a7c2dd;
  position: relative;
  backdrop-filter: blur(4px);

  &:has(.new-message-ribbon) {
    //background: #2e30344f;
    // border: 1px solid #00AE00
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
    color: #424f72;

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
    color: #9f9f9f;
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
      color: #9f9f9f;
    }

    .detail-btn {
      border-radius: 6px;
      // background: radial-gradient(68.92% 68.92% at 50% 50%, #1D341D 0%, #466A45 100%);
      background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
      border: none;
      font-size: 1rem;
      // font-weight: 700;
      padding: 0.2rem 1rem;
      min-height: unset;
      text-transform: capitalize;
      color: #fff;
    }
  }
}
</style>

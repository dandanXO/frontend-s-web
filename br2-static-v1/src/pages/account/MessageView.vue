<template>
  <q-page class="account-message-page">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" :noInfoTitle="$t('records.noMessage')"></NoInfoComponent>
    <template v-else v-for="(e, i) in mailData" :key="`${e}-${i}`">
      <div class="time">{{ convertToGMT7Time(e.sendTime) }}</div>
      <q-card @click="onDetailsClick(e)" class="msg-container">

        <div class="message-wrapper">
          <q-card-section class="title">
            <div>{{ e.title }}</div>
            <div
              class="new-message-dot"
              v-if="!e.status && store.readMsgLists.indexOf(e.id) === -1"
            />
          </q-card-section>
          <q-card-section class="content">{{ e.content }}</q-card-section>

<!--          <q-card-section class="bottom-wrapper">-->

<!--            <q-btn class="detail-btn" @click="onDetailsClick(e)" flat unelevated>-->
<!--              {{ $t("btn.more") }}&nbsp;-->
<!--              <q-icon class="forward-icon" name="arrow_forward_ios" size="small" />-->
<!--            </q-btn>-->
<!--          </q-card-section>-->
        </div>
      </q-card>
    </template>


  </q-page>
</template>

<script setup>
import { ref, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { convertToGMT55, convertToGMT7, convertToGMT7Time } from "src/boot/utils";
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
  //gap: 20px;
  padding: 0 20px;
}

.time {
  font-size: 1.2rem;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}
.msg-container {
  padding: 0.8rem 2rem 1.6rem;
  margin: 0;
  border-radius: 6px;
  background: #1F241F;
  position: relative;
  box-shadow: none;
  margin-bottom: 6px;

  .new-message-dot{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    color: red;
    background: red;
    position:absolute;
    right: 8px;
    top: 8px;
  }

  &:has(.new-message-ribbon) {
    background: #1F241F;
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
    justify-content: flex-start;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    gap: 0.5rem;
    margin-top: 10px;
    margin-bottom: 10px;

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
    //white-space: nowrap;
    //text-overflow: ellipsis;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .bottom-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0 0 0;

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

<template>
  <q-page class="account-message-page">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Message"></NoInfoComponent>
    <q-card v-else v-for="(e, i) in mailData" :key="`${e}-${i}`" class="msg-container">
      <div class="time-wrapper">
        <div class="time">{{ convertToGMT55(e.sendTime) }}
         
          <!-- <img
        class="new-message-ribbon"
        src="../../assets/images/message/new-message-ribbon.svg"
        v-if="!e.status && store.readMsgLists.indexOf(e.id) === -1"
      /> -->
        </div>
        <div class="new-message-ribbon" v-if="!e.readTime"></div>
     
      </div>

      <div class="message-wrapper">
        <q-card-section class="title">
          <div>{{ e.title }}</div>
        </q-card-section>
        <q-card-section class="content">{{ e.content }}</q-card-section>

        <q-card-section class="bottom-wrapper">
          <q-btn class="detail-btn" @click="onDetailsClick(e)" flat unelevated>
            {{ $t("btn.more") }}&nbsp;
            <q-icon class="forward-icon" name="keyboard_arrow_down" size="medium" />
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
  gap: 20px;
  // padding: 0 20px;
  padding: 20px;
}
.msg-container {
  padding: 1rem;
  margin: 0;
  border-radius: 10px;
  // border: 1px solid rgba(255, 255, 255, 0.05);
  // background: #2e30344f;
  background: #323738;

  position: relative;
  box-shadow: none;
  backdrop-filter: blur(4px);

  &:has(.new-message-ribbon) {
    //background: #2e30344f;
    // border: 1px solid #00AE00
  }

  .time-wrapper {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
    margin-bottom: 15px;
    font-weight: 700;
    .new-message-ribbon {
      // position: absolute;
      // right: 0;
      // top: 0;
      // width: 30px;
      // height: 30px;
      background: #21EF89;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .time {
      font-size: 1rem;
      // font-weight: 700;
      color: #FFFFFFB2;

    }
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
    color: rgba(255, 255, 255, 0.5);
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: auto; /* Adjust automatically */
    max-height: 40px; /* Adjust based on font-size & line-height */
    line-height: 20px; /* Ensure spacing is correct */
    margin-bottom: 15px;
  }

  .bottom-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 1rem 0 0 0;

    .detail-btn {
    font-size: 1rem;
    padding: 0.2rem 1rem;
    min-height: unset;
    text-transform: capitalize;
    background: #464F50;
    border-radius: 6px;
    display: flex
;
    justify-content: center;
    font-weight: 700;
    align-items: center;
    }
  }
}
</style>

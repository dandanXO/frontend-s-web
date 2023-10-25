<template>
  <ProfileSummary></ProfileSummary>

  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <ContentView :contentTopStatus="`${isNoInfo ? '' : 'solid'}`">
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <NoInfoComponent v-else-if="isNoInfo" noInfoTitle="No Message"></NoInfoComponent>
    <q-card v-else v-for="(e, i) in mailData" :key="`${e}-${i}`" class="msg-container">
      <q-card-section class="title">{{ e.title }}</q-card-section>
      <q-card-section class="content">{{ e.content }}</q-card-section>

      <q-card-section class="bottom-wrapper">
        <div class="time">{{ moment(e.sendTime).format("YYYY-MM-DD HH:mm") }}</div>
        <q-btn class="detail-btn" label="Details >" @click="onDetailsClick(e)"></q-btn>
      </q-card-section>
    </q-card>
  </ContentView>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import moment from "moment";
import SwiperNav from "../../components/SwiperNav.vue";
import ContentView from "../../components/ContentView.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
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

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;
  router.push(slideListPath.value[i]);
  currentSlide.value = e;
};

const isLoading = ref(true);
const isNoInfo = ref(false);

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
  router.push("/account/message-detail");
};

onMounted(() => {
  loadInbox();
});
</script>

<style lang="scss" scoped>
.msg-container {
  border-radius: 0.5rem;
  background: rgba(21, 0, 37, 0.5);
  padding: 1rem;
  margin-top: 0;

  .title {
    font-size: 1rem;
    font-weight: 700;
  }

  .content {
    font-size: 1rem;
    font-weight: 700;
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
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
    }

    .detail-btn {
      border-radius: 12.5rem;
      background: rgba(255, 255, 255, 0.2);
      font-size: 1rem;
      font-weight: 700;
      padding: 0 1rem;
      min-height: unset;
    }
  }
}
</style>

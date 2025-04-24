<template>
  <q-page class="account-message-page">
    <q-tabs dense
      no-caps
      indicator-color="transparent"
      align="justify" v-model="activeTab" class="message-tab-toggle">
        <q-tab name="activity" :label="$t('message.activity')">
          <q-badge rounded color="#219efb" text-color="black" floating>{{unreadCount('activity')}}</q-badge>
        </q-tab>
        
        <q-tab name="payment" :label="$t('message.payment')">
          <q-badge rounded color="#219efb" text-color="black" floating>{{unreadCount('payment')}}</q-badge>
        </q-tab>
        
        <q-tab name="system" :label="$t('message.system')">
          <q-badge rounded color="#219efb" text-color="black" floating>{{unreadCount('system')}}</q-badge>
        </q-tab>
    </q-tabs>
    <LoadingComponent v-if="isLoading"></LoadingComponent>
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel v-for="(items, tab) in filteredMessages" :key="tab" :name="tab">
        <NoInfoComponent v-if="items.length === 0" :noInfoTitle="$t('message.noMessage')" />
        <MessageCard v-else v-for="(e) in items" :key="e.id" :message="e" @details="onDetailsClick" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onActivated, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { convertToGMT55 } from "src/boot/utils";
import LoadingComponent from "../../components/LoadingComponent.vue";
import NoInfoComponent from "../../components/NoInfoComponent.vue";
import MessageCard from "../../components/MessageCard.vue";

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
const isNoInfo = computed(() => {
  return Object.values(filteredMessages.value).every((items) => items.length === 0);
});
const readIdLists = ref([]);
const mailData = ref([]);
const activeTab = ref("activity");
const mailboxData = ref({
  type: null,
  orderBy: "sendTime"
});
const loadInbox = () => {
  api
    .get("/session/pm/inbox", {
      params: {
        type: mailboxData.value.type,
        orderBy: mailboxData.value.orderBy,
        size: 100
      }
    })
    .then((response) => {
      if (response.code === 0) {
        const record = response.data.records;
        mailData.value = record;
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
const filteredMessages = computed(() => ({
  activity: mailData.value.filter((e) => ["ACTIVITY", "MATCH"].includes(e.type)),
  payment: mailData.value.filter((e) => e.type === "PAYMENT"),
  system: mailData.value.filter((e) => ["NOTIFICATION", "ANNOUNCEMENT"].includes(e.type)),
}));

const unreadCount = (tab) => {
  const messages = filteredMessages.value[tab] || [];
  return messages.filter(message => !message.readTime).length;
};

onActivated(() => {
  loadInbox();
  store.setReadMsg();
});
</script>

<style lang="scss" scoped>
.account-message-page {
  :deep(.q-tab-panels) {
    background: transparent;
  }
  .message-tab-toggle {
    // background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background: #3237384D;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;
    width: calc(100% - 32px);
    margin: 16px auto 0;
    .q-tab {
      min-height: 44px;
      border-radius: 8px;
      color: #ffffff80;
      font-weight: 400;
      width: 50%;
      .q-badge {
        top: 10px;
        right: -20px;
      }
    }

    .right {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      background-size: 0;
    }

    :deep(.q-tab__label) {
      font-weight: 700;
      // color: #FFFFFF80;
    }

    :deep(.q-tab--active) {
      color: white;
      // background-size: 100% 100%;
      // background: linear-gradient(
      //   180deg,
      //   rgba(97, 255, 0, 0) 0%,
      //   rgba(97, 255, 0, 0.25) 50.5%,
      //   rgba(97, 255, 0, 0) 100%
      // );
      // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      // &:before {
      //   content: "";
      //   background-color: #21EF89;
      //   height: 3px;
      //   border-radius: 4px;
      //   width: 30%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      // background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
      background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);

    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}
</style>
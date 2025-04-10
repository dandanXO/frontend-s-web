<template>
  <div class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 38px auto 50px; width: 100%"
    />
    <div class="livestream-inner-wrapper">
      <LivestreamList v-model="currentLive" class="livestream-list" :list />
      <CurrentLivestream :livestream-data="currentLiveData" @click="handleBetClick" />
      <LivestreamChat class="livestream-chat" :messages="fullMessages" @send-chat-message="handleSendChatMessage" />
      <LivestreamVideo ref="livestreamVideoRef" :danmuList :livestream-data="currentLiveData" />
    </div>
    <GameModal ref="gameModalRef"></GameModal>
  </div>
</template>
<script setup>
import LivestreamList from "@/components/home/livestream/LivestreamList.vue";
import CurrentLivestream from "@/components/home/livestream/CurrentLivestream.vue";
import LivestreamChat from "@/components/home/livestream/LivestreamChat.vue";
import LivestreamVideo from "@/components/home/livestream/LivestreamVideo.vue";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { userStore } from "@/store";
import { getChatHistory, getLivestreamDetail, getLivestreamList, sendChat } from "@/api/index/livestream";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";

const MESSAGE_SYNC_INTERVAL = 1000 * 2; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;
const MAXIMUM_MESSAGE_LENGTH = 1000;

const LIVESTREAM_SYNC_INTERVAL = 1000 * 10; // 10 seconds

const store = userStore();
const notify = useNotify();

const messages = ref([]);
const danmuList = ref([]);
const list = ref([]);
const currentLive = ref(0);
const messageTimer = ref(null);
const livestreamTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const unsortMessages = ref([]);
const gameModalRef = ref(null);
const livestreamVideoRef = ref(null);
const livestreamSyncAbortController = ref(null);
// const channels = ref([
//   {
//     name: "线路1",
//     url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
//   }
//   // { name: "线路3", url: "" }
// ]);

const currentLiveData = computed(() => {
  if (!list.value.length) return {};
  return list.value[currentLive.value];
});

const fullMessages = computed(() => {
  return messages.value.concat(unsortMessages.value);
});

const handleSendChatMessage = (message) => {
  if (!store.hasToken()) {
    store.loginPageVisible = true;
    return;
  }
  sendChat({
    content: message,
    streamId: currentLiveData.value.id
  });
  messages.value.push({
    content: message,
    name: store.nickName,
    time: Date.now()
  });
  danmuList.value = [message];
};

const parseLivestreamData = (data) => {
  let parsedSupplierUrl = {};
  let parsedStreamerUrl = {};
  try {
    parsedSupplierUrl = JSON.parse(data.supplierCdnPullUrl);
    parsedStreamerUrl = JSON.parse(data.streamerCdnPullUrl);
  } catch (e) {
  } finally {
    return {
      ...data,
      supplierCdnPullUrl: parsedSupplierUrl,
      streamerCdnPullUrl: parsedStreamerUrl
    };
  }
};

const getData = () => {
  getLivestreamList().then((res) => {
    if (res.code === 0) {
      const parsedData = res.data.records.map(parseLivestreamData);
      list.value = parsedData;
    }
  });
};

const syncMessages = () => {
  messageTimer.value && clearTimeout(messageTimer.value);
  const now = Date.now();
  const pastTime = now - lastSyncMessageTime.value;

  const params = {
    siteId: process.env.VUE_APP_SITEID,
    streamId: currentLiveData.value.id,
    recordTime: [lastSyncMessageTime.value, now]
  };

  if (pastTime > MESSAGE_SYNC_INTERVAL) {
    lastSyncMessageTime.value = now;
    getChatHistory(params).then((res) => {
      if (res.code === 0) {
        const messagesFromApi = res.data.reduce((result, record) => {
          if (record.name !== store.nickName) {
            result.push({
              content: record.content,
              name: record.name,
              time: record.createTime
            });
          }

          return result;
        }, []);
        const combinedMessages = [...unsortMessages.value, ...messagesFromApi];
        combinedMessages.sort((a, b) => a.time - b.time);
        const messageLength = messages.value.length;
        const combinedMessagesLength = combinedMessages.length;
        if (messageLength + combinedMessagesLength > MAXIMUM_MESSAGE_LENGTH) {
          const excessMessages = messageLength + combinedMessagesLength - MAXIMUM_MESSAGE_LENGTH;
          messages.value = [...messages.value.slice(excessMessages), ...combinedMessages];
        } else {
          messages.value.push(...combinedMessages);
        }
        unsortMessages.value = [];
        danmuList.value = messagesFromApi.map((item) => item.content);
      }
    });
  }
  messageTimer.value = setTimeout(() => {
    syncMessages();
  }, MESSAGE_SYNC_INTERVAL);
};

const handleBetClick = () => {
  if (!gameModalRef.value || !livestreamVideoRef.value) return;
  livestreamVideoRef.value.pause();
  gameModalRef.value.open("IM体育", "IM");
};

const syncLivestreamInfo = async () => {
  if (!currentLiveData.value?.streamId) return;
  livestreamSyncAbortController.value = new AbortController();
  getLivestreamDetail(currentLiveData.value.streamId, livestreamSyncAbortController).then((res) => {
    if (res.code === 0) {
      if (currentLiveData.value.streamerStatus === res.data.streamerStatus) return;
      // TODO: wait for api
      const notifyMessage = res.data.streamerStatus
        ? "主播已开播，即将切换至主播直播"
        : "主播已下播，即将切换至赛事直播";
      notify({
        message: notifyMessage,
        type: "info",
        duration: 2000
      });
      const parsedData = parseLivestreamData(res.data);
      list.value[currentLive.value] = {
        ...currentLiveData.value,
        streamerStatus: parsedData.streamerStatus,
        streamerCdnPullUrl: parsedData.streamerCdnPullUrl,
        supplierCdnPullUrl: parsedData.supplierCdnPullUrl
      };
    }
  });
};

const resetSyncLivestreamInterval = (startNewInterval = false) => {
  if (livestreamTimer.value) {
    clearInterval(livestreamTimer.value);
    livestreamTimer.value = null;
  }
  if (startNewInterval) {
    livestreamTimer.value = setInterval(() => {
      syncLivestreamInfo();
    }, LIVESTREAM_SYNC_INTERVAL);
  }
};

watch(currentLive, () => {
  messages.value = [];
  unsortMessages.value = [];
  danmuList.value = [];
  lastSyncMessageTime.value = Date.now();
  syncMessages();
  livestreamSyncAbortController.value && livestreamSyncAbortController.value.abort();
  resetSyncLivestreamInterval(true);
});

onMounted(() => {
  getData();
  syncMessages();
  syncLivestreamInfo();
  resetSyncLivestreamInterval(true);
});

onUnmounted(() => {
  if (messageTimer.value) {
    clearTimeout(messageTimer.value);
    messageTimer.value = null;
  }
  resetSyncLivestreamInterval();
});
</script>
<style lang="scss" scoped>
.livestream-container {
  --grid-gap: 18.87px;
  max-width: 1320px;
  margin: 0 auto;

  .livestream-inner-wrapper {
    display: grid;
    grid-template-columns: 957.72px 306.66px;
    grid-template-rows: auto auto 1fr;
    gap: var(--grid-gap);
    padding: 18px;
    border: 2px solid #fff;
    border-radius: 15px;
    box-shadow: 0px 0px 5.76px 4.72px #22446e21 inset;

    .livestream-list {
      grid-column: 1 / span 2;
    }
    .livestream-chat {
      grid-row: 2 / span 2;
      grid-column: 2;
      height: 633px;
    }
  }
}
</style>

<template>
  <div class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 38px auto 50px; width: 100%"
    />
    <div class="livestream-inner-wrapper">
      <LivestreamList
        v-model="currentLive"
        class="livestream-list"
        :list
        :is-livestream-list-loading
        @scroll-reach-right="getData"
      />
      <div class="livestream-list__pseudo" />
      <CurrentLivestream :livestream-data="currentLiveData" @click="handleBetClick" />
      <LivestreamChat
        class="livestream-chat"
        :messages="fullMessages"
        :livestream-data="currentLiveData"
        @send-chat-message="handleSendChatMessage"
      />
      <LivestreamVideo ref="livestreamVideoRef" :danmuList :livestream-data="currentLiveData" :is-livestreaming />
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
import { extractVipLevelFromVipStr } from "@/utils/utils";
import { useSessionStorage } from "@vueuse/core";

/**
 * @typedef {Object} Message
 * @property {string} content
 * @property {string} name
 * @property {number} time
 * @property {number} vip
 * @property {string|null} profilePhoto
 */

const LATEST_WATCH_LIVESTREAM_ID_KEY = "LH_WEB_LATEST_WATCH_LIVESTREAM";

const MESSAGE_SYNC_INTERVAL = 1000 * 2; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;
const MAXIMUM_MESSAGE_LENGTH = 5000;

const LIVESTREAM_SYNC_INTERVAL = 1000 * 10; // 10 seconds
const MAXIMUM_MESSAGE_PROCESS_DELAY_COUNT = 5;

const store = userStore();
const notify = useNotify();
const latestWatchLivestreamId = useSessionStorage(LATEST_WATCH_LIVESTREAM_ID_KEY, null);

/**
 * chat message list
 * @type {import('vue').Ref<Message[]>}
 */
const messages = ref([]);
const danmuList = ref([]);
const list = ref([]);
const currentLive = ref(null);
const messageTimer = ref(null);
const livestreamTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const liveStartTime = ref();
const unsortMessages = ref([]);
const gameModalRef = ref(null);
const livestreamVideoRef = ref(null);
const livestreamSyncAbortController = ref(null);
const livestreamListMeta = ref({
  current: 1,
  max: 1
});
const isLivestreamListLoading = ref(false);
const isFirstMessageSync = ref(true);
const processedUserName = ref();
const isProcessingMessageHistory = ref(false);
const messagesHistoryMeta = ref({
  current: 1,
  max: 1
});
const latestProcessedMessageId = ref(-1);
// const channels = ref([
//   {
//     name: "线路1",
//     url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
//   }
//   // { name: "线路3", url: "" }
// ]);

const userVipLevel = computed(() => extractVipLevelFromVipStr(store.vip));

const currentLiveData = computed(() => {
  if (!list.value.length || currentLive.value === null) return {};
  return list.value[currentLive.value];
});

const isLivestreaming = computed(() => !!currentLiveData.value?.liveStatus);

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
  }).then((res) => {
    if (res.code === 0) {
      const { content, name } = res.data;
      messages.value.push({
        content,
        name,
        time: Date.now(),
        vip: userVipLevel.value,
        profilePhoto: store.profilePhoto
      });
      danmuList.value = [content];
      if (!processedUserName.value) {
        processedUserName.value = name;
      }
    } else {
      notify({
        message: "讯息发送失败",
        type: "error",
        duration: 2000
      });
    }
  });
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
  if (livestreamListMeta.value.current > livestreamListMeta.value.max) return;
  isLivestreamListLoading.value = true;
  getLivestreamList(livestreamListMeta.value.current)
    .then((res) => {
      if (res.code === 0) {
        const parsedData = res.data.records.map(parseLivestreamData);
        list.value.push(...parsedData);
        if (parsedData.length && livestreamListMeta.value.current === 1) {
          const { earliestLivestreamIndex, latestWatchLivestreamIndex } = parsedData.reduce(
            (result, livestream, index) => {
              if (!livestream.liveStatus) return;
              if (result.earliestLivestreamIndex === -1) {
                result.earliestLivestreamIndex = index;
              }
              if (latestWatchLivestreamId.value && livestream.streamId === latestWatchLivestreamId.value) {
                result.latestWatchLivestreamIndex = index;
              }
              return result;
            },
            { earliestLivestreamIndex: -1, latestWatchLivestreamIndex: -1 }
          );

          if (latestWatchLivestreamIndex !== -1) {
            currentLive.value = latestWatchLivestreamIndex;
          } else if (earliestLivestreamIndex !== -1) {
            currentLive.value = earliestLivestreamIndex;
          }
        }
        livestreamListMeta.value.current++;
        livestreamListMeta.value.max = res.data.pages;
      }
    })
    .finally(() => {
      isLivestreamListLoading.value = false;
    });
};

const syncMessages = () => {
  messageTimer.value && clearTimeout(messageTimer.value);
  const now = Date.now();
  const pastTime = now - lastSyncMessageTime.value;

  const params = {
    siteId: process.env.VUE_APP_SITEID,
    streamId: currentLiveData.value.id,
    recordTime: [liveStartTime.value, now]
  };

  if (pastTime > MESSAGE_SYNC_INTERVAL && !isProcessingMessageHistory.value) {
    lastSyncMessageTime.value = now;
    if (!isLivestreaming.value) return;
    isProcessingMessageHistory.value = true;
    getChatHistory(params, messagesHistoryMeta.value.current)
      .then(async (res) => {
        if (res.code === 0) {
          const requestQueue = [];
          const messagesFromApi = formatHistoryMessages(res.data.records);
          const remainingPage = res.data.pages - messagesHistoryMeta.value.current;
          messagesHistoryMeta.value.max = res.data.pages;

          for (let i = 0; i < remainingPage; i++) {
            requestQueue.push(syncMessagesPerPage(params, ++messagesHistoryMeta.value.current));
          }

          const remainingPageRes = await Promise.allSettled(requestQueue);
          for (const _res of remainingPageRes) {
            if (_res.status === "rejected") {
              console.error(_res.reason);
              continue;
            }
            messagesFromApi.push(..._res.value);
          }

          latestProcessedMessageId.value = messagesFromApi[messagesFromApi.length - 1]?.id;

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
          if (isFirstMessageSync.value) {
            isFirstMessageSync.value = false;
          } else {
            danmuList.value = messagesFromApi.map((item) => item.content);
          }
        }
      })
      .finally(() => {
        isProcessingMessageHistory.value = false;
      });
  }
  messageTimer.value = setTimeout(() => {
    syncMessages();
  }, MESSAGE_SYNC_INTERVAL);
};

const syncMessagesPerPage = async (params, current) => {
  try {
    const res = await getChatHistory(params, current);
    return formatHistoryMessages(res.data.records);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const formatHistoryMessages = (messages) => {
  return messages.reduce((result, record) => {
    if (record.name !== processedUserName.value && record.id > latestProcessedMessageId.value) {
      result.push({
        content: record.content,
        name: record.name,
        time: record.createTime,
        vip: extractVipLevelFromVipStr(record.vip),
        profilePhoto: record.profilePhoto
      });
    }

    return result;
  }, []);
};

const handleBetClick = () => {
  if (!gameModalRef.value) return;
  livestreamVideoRef.value?.pause();
  gameModalRef.value.open("IM体育", "IM");
};

const syncLivestreamInfo = async () => {
  if (!currentLiveData.value?.streamId) return;
  livestreamSyncAbortController.value = new AbortController();
  getLivestreamDetail(currentLiveData.value.streamId, livestreamSyncAbortController).then((res) => {
    if (res.code === 0) {
      if (currentLiveData.value.streamerStatus === res.data.streamerStatus) return;
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
        roomMessage: parsedData?.roomMessage,
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
  lastSyncMessageTime.value = currentLiveData.value?.eventStartTime || Date.now();
  liveStartTime.value = lastSyncMessageTime.value;
  syncMessages();
  livestreamSyncAbortController.value && livestreamSyncAbortController.value.abort();
  resetSyncLivestreamInterval(true);
});

watch(currentLiveData, (livestream) => {
  if (!livestream) return;
  latestWatchLivestreamId.value = livestream.streamId;
});

onMounted(() => {
  getData();
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
    grid-template-rows: auto auto auto 1fr;
    gap: var(--grid-gap);
    padding: 18px;
    border: 2px solid #fff;
    border-radius: 14px;
    box-shadow: 0px 0px 5.76px 4.72px #22446e21 inset;

    .livestream-list {
      grid-column: 1 / span 2;
    }

    .livestream-list__pseudo {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
    .livestream-chat {
      grid-row: 3 / span 2;
      grid-column: 2;
      height: 633px;
    }
  }
}

.dark {
  .livestream-inner-wrapper {
    background: url("@/assets/home/livestream/livestream-bg-dark.png") no-repeat center center;
    background-size: 100% 100%;
    border: none;
  }
}
</style>

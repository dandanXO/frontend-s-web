<template>
  <div v-if="!hideComponent" class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 38px auto 50px; width: 100%"
    />
    <div class="livestream-tabs">
      <LivestreamCategories v-model="activeTab" :categories="availableCategories" />
    </div>
    <div class="livestream-inner-wrapper">
      <!-- <template v-if="filteredLivestreamList.length === 0"><div>目前没有直播</div></template> -->
      <LivestreamList
        v-model="currentLiveId"
        class="livestream-list"
        :list="filteredLivestreamList"
        :is-livestream-list-loading
      />
      <div class="livestream-list__pseudo" />
      <CurrentLivestream :livestream-data="currentLiveData" :is-system-livestream @click="handleBetClick" />
      <LivestreamChat
        class="livestream-chat"
        :messages="fullMessages"
        :livestream-data="currentLiveData"
        :vip-status
        :is-system-livestream
        @send-chat-message="handleSendChatMessage"
      />
      <LivestreamVideo
        v-if="isLivestreaming"
        ref="livestreamVideoRef"
        :danmuList
        :livestream-data="currentLiveData"
        :is-livestreaming
      />
      <ComingMatch v-else :livestream-data="currentLiveData" @click="handleBetClick" />
    </div>
    <GameModal ref="gameModalRef"></GameModal>
  </div>
</template>
<script setup>
import LivestreamCategories from "@/components/home/livestream/LivestreamCategories.vue";
import LivestreamList from "@/components/home/livestream/LivestreamList.vue";
import CurrentLivestream from "@/components/home/livestream/CurrentLivestream.vue";
import LivestreamChat from "@/components/home/livestream/LivestreamChat.vue";
import LivestreamVideo from "@/components/home/livestream/LivestreamVideo.vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { userStore } from "@/store";
import { getChatHistory, getLivestreamDetail, getLivestreamList, sendChat } from "@/api/index/livestream";
import GameModal from "@/components/modal/GameModal.vue";
import { useNotify } from "@/hooks/notify";
import { extractVipLevelFromVipStr } from "@/utils/utils";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";
import ComingMatch from "@/components/home/livestream/ComingMatch.vue";

/**
 * @typedef {Object} Message
 * @property {string} content
 * @property {string} name
 * @property {number} time
 * @property {number} vip
 * @property {number|null} id
 * @property {string|null} profilePhoto
 */

const LATEST_WATCH_LIVESTREAM_ID_KEY = "LH_WEB_LATEST_WATCH_LIVESTREAM";

const MESSAGE_SYNC_INTERVAL = 1000 * 2; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;
const MAXIMUM_MESSAGE_LENGTH = 5000;
const MESSAGE_HISTORY_START_TIME = 1000 * 60 * 5; // 5 minutes

const LIVESTREAM_SYNC_INTERVAL = 1000 * 10; // 10 seconds
const MAXIMUM_MESSAGE_PROCESS_DELAY_COUNT = 5;

const DEFAULT_MESSAGES_HISTORY_META = {
  current: 1,
  max: 1
};

const store = userStore();
const notify = useNotify();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const latestWatchLivestreamId = useSessionStorage(LATEST_WATCH_LIVESTREAM_ID_KEY, null);
const latestActivatedTab = useSessionStorage("LH_WEB_LIVESTREAM_ACTIVE_TAB", null);

/**
 * chat message list
 * @type {import('vue').Ref<Message[]>}
 */
const messages = ref([]);
const danmuList = ref([]);
const list = ref([]);
const currentLiveId = ref(null);
const messageTimer = ref(null);
const livestreamTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const messageHistoryStartTime = ref();
const unsortMessages = ref([]);
const gameModalRef = ref(null);
const livestreamVideoRef = ref(null);
const livestreamSyncAbortController = ref(null);
const chatHistoryAbortController = ref(null);
const livestreamListMeta = ref({
  current: 1,
  max: 1
});
const isLivestreamListLoading = ref(false);
const isFirstMessageSync = ref(true);
const processedUserName = ref();
const isProcessingMessageHistory = ref(false);
const messagesHistoryMeta = ref(DEFAULT_MESSAGES_HISTORY_META);
const latestProcessedMessageId = ref(-1);
const vipStatus = ref(false);
const hideComponent = ref(true);
const activeTab = ref("popular");

const emit = defineEmits(["livestreamVisible"]);
// const channels = ref([
//   {
//     name: "线路1",
//     url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
//   }
//   // { name: "线路3", url: "" }
// ]);

const userVipLevel = computed(() => extractVipLevelFromVipStr(store.vip));

const currentLiveData = computed(() => {
  if (!list.value.length || currentLiveId.value === null) return {};
  const targetLive = list.value.find((livestream) => livestream.streamId === currentLiveId.value);
  return targetLive || {};
});

const isLivestreaming = computed(() => !!currentLiveData.value?.liveStatus);

const fullMessages = computed(() => {
  return messages.value.concat(unsortMessages.value);
});
const isSystemLivestream = computed(() => currentLiveData.value?.name === "SYSTEM");

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
        message: res.message || "讯息发送失败",
        type: "error",
        duration: 2000
      });
    }
  });
};

const parseLivestreamData = (data) => {
  let parsedSupplierUrl = {};
  let parsedStreamerUrl = {};
  let homeIcon = data.homeIcon;
  let awayIcon = data.awayIcon;
  try {
    parsedSupplierUrl = JSON.parse(data.supplierCdnPullUrl);
    parsedStreamerUrl = JSON.parse(data.streamerCdnPullUrl);
    if (homeIcon && !homeIcon.startsWith("http")) {
      homeIcon = imgURL + homeIcon;
    }
    if (awayIcon && !awayIcon.startsWith("http")) {
      awayIcon = imgURL + awayIcon;
    }
  } catch (e) {
  } finally {
    return {
      ...data,
      homeIcon,
      awayIcon,
      supplierCdnPullUrl: parsedSupplierUrl,
      streamerCdnPullUrl: parsedStreamerUrl
    };
  }
};

const getData = () => {
  if (livestreamListMeta.value.current > livestreamListMeta.value.max) return;
  isLivestreamListLoading.value = true;
  getLivestreamList(livestreamListMeta.value.current)
    .then(async (res) => {
      if (res.code === 0) {
        const parsedData = res.data.streamList.map(parseLivestreamData);
        parsedData.sort((a, b) => a.sort - b.sort);
        if (parsedData.length) {
          hideComponent.value = false;
          await nextTick();
          emit("livestreamVisible", true);
        }
        vipStatus.value = !!res.data.vipStatus;
        list.value.push(...parsedData);
        if (parsedData.length && livestreamListMeta.value.current === 1) {
          const { _earliestLivestream, _latestWatchLivestream } = parsedData.reduce(
            (result, livestream) => {
              if (!result._earliestLivestream) {
                result._earliestLivestream = livestream;
              }

              if (latestWatchLivestreamId.value && livestream.streamId === latestWatchLivestreamId.value) {
                result._latestWatchLivestream = livestream;
              }
              return result;
            },
            { _earliestLivestream: null, _latestWatchLivestream: null }
          );
          if (_latestWatchLivestream) {
            currentLiveId.value = _latestWatchLivestream.streamId;
          } else if (_earliestLivestream) {
            // activeTab.value = getLivestreamType(_earliestLivestream);
            currentLiveId.value = _earliestLivestream.streamId;
          }
        }
        livestreamListMeta.value.current++;
        // livestreamListMeta.value.max = res.data.pages;
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
    recordTime: [messageHistoryStartTime.value, now]
  };
  chatHistoryAbortController.value = new AbortController();
  if (pastTime > MESSAGE_SYNC_INTERVAL && !isProcessingMessageHistory.value) {
    lastSyncMessageTime.value = now;
    isProcessingMessageHistory.value = true;
    getChatHistory(params, messagesHistoryMeta.value.current, chatHistoryAbortController.value)
      .then(async (res) => {
        if (res.code === 0 && params.streamId === currentLiveData.value.id) {
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
          if (messagesFromApi.length > 0) {
            latestProcessedMessageId.value = messagesFromApi[messagesFromApi.length - 1]?.id;
          }

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
      .catch((e) => {
        console.error(e);
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
        id: record.id,
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
  if (!gameModalRef.value || !currentLiveData.value) return;
  switch (currentLiveData.value.sportId) {
    case 1:
    case 2:
      gameModalRef.value.open("IM体育", "IM", currentLiveData.value.eventCode || "");
      break;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      gameModalRef.value.open("雷火电竞", "TFGaming", currentLiveData.value.eventCode || "");
  }
};

const syncLivestreamInfo = async () => {
  if (!currentLiveData.value?.streamId) return;
  livestreamSyncAbortController.value = new AbortController();
  getLivestreamDetail(currentLiveData.value.streamId, livestreamSyncAbortController).then((res) => {
    if (res.code === 0) {
      vipStatus.value = !!res.data.vipStatus;
      if (
        currentLiveData.value.streamerStatus !== res.data.streamerStatus &&
        currentLiveData.value.id === res.data.id
      ) {
        const notifyMessage = res.data.streamerStatus
          ? "主播已开播，即将切换至主播直播"
          : "主播已下播，即将切换至赛事直播";
        notify({
          message: notifyMessage,
          type: "info",
          duration: 2000
        });
      }
      const parsedData = parseLivestreamData(res.data);
      list.value[currentLiveId.value] = {
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

const filteredLivestreamList = computed(() => {
  switch (activeTab.value) {
    case "popular":
      return list.value.filter((item) => item.isPopular);
    case "football":
      return list.value.filter((item) => [1].includes(item.sportId));
    case "basketball":
      return list.value.filter((item) => [2].includes(item.sportId));
    case "esports":
      return list.value.filter((item) => [3, 4, 5, 6].includes(item.sportId));
    default:
      return list.value;
  }
});

const getLivestreamType = (livestream) => {
  if (livestream.isPopular) return "popular";
  switch (livestream.sportId) {
    case 1:
      return "football";
    case 2:
      return "basketball";
    case 3:
    case 4:
    case 5:
    case 6:
      return "esports";
    default:
      return "popular";
  }
};

const availableCategories = computed(() => {
  const hasPopular = list.value.some((item) => item.isPopular);
  // const hasFootball = list.value.some((item) => item.sportId === 1);
  // const hasBasketball = list.value.some((item) => item.sportId === 2);
  // const hasEsports = list.value.some((item) => [3, 4, 5, 6].includes(item.sportId));

  const categories = [];

  if (hasPopular) categories.push({ value: "popular", slot: "popular" });
  categories.push({ value: "esports", slot: "esports" });
  categories.push({ value: "football", slot: "football" });
  categories.push({ value: "basketball", slot: "basketball" });

  return categories;
});

watch(availableCategories, (newCategories) => {
  const availableTabValues = newCategories.map((c) => c.value);
  if (!availableTabValues.includes(activeTab.value)) {
    activeTab.value = availableTabValues[0] || "";
  }
});

watch(currentLiveId, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  messages.value = [];
  unsortMessages.value = [];
  danmuList.value = [];
  lastSyncMessageTime.value = Date.now() - MESSAGE_HISTORY_START_TIME;
  messageHistoryStartTime.value = lastSyncMessageTime.value;
  latestProcessedMessageId.value = -1;
  livestreamSyncAbortController.value && livestreamSyncAbortController.value.abort();
  chatHistoryAbortController.value && chatHistoryAbortController.value.abort();
  isProcessingMessageHistory.value = false;
  processedUserName.value = null;
  syncMessages();
  resetSyncLivestreamInterval(true);
});

watch(currentLiveData, (livestream) => {
  if (!livestream) return;
  latestWatchLivestreamId.value = livestream.streamId;
  latestActivatedTab.value = activeTab.value;
});

onMounted(() => {
  getData();
  resetSyncLivestreamInterval(true);
});

onUnmounted(() => {
  if (messageTimer.value) {
    clearTimeout(messageTimer.value);
    messageTimer.value = null;
  }
  resetSyncLivestreamInterval();
  messagesHistoryMeta.value = DEFAULT_MESSAGES_HISTORY_META;
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

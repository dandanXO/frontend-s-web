<template>
  <div ref="pageContainer" class="page-style" :class="isDark ? 'dark' : 'white'">
    <LiveStreamVideo :danmuList :livestream-data="currentLiveData" :extensionState :extensionToken />

    <div class="transfer-mid-div">
      <div class="station-notice-wrapper" @click="showAnnouncementDialog">
        <div class="volume">
          <img v-if="$q.dark.isActive" src="../../assets/images/home/transfer-announce-icon-dark.svg" />
          <img v-else src="../../assets/images/home/announce-icon.png" />
        </div>
        <marquee-text :key="displayAnnouncementList.join('-')" :repeat="5" :duration="marqueeDuration">
          <span v-for="(announcement, i) in displayAnnouncementList" :key="i">
            {{ announcement }}
          </span>
        </marquee-text>
      </div>
    </div>

    <div class="room-message-container">
      <div class="container-box" @click="expandRoomMsg">
        <div class="type-tags">
          <div class="profile-tag">
            <img
              v-if="currentLiveData.name === 'SYSTEM'"
              :src="require('../../assets/images/livestream/system-avatar.png')"
            />
            <img v-else-if="currentLiveData.avatar" :src="imgURL + currentLiveData.avatar" />
            <img v-else :src="require('../../assets/images/profile/default-1.png')" />

            <!-- <img :src="imgURL + currentLiveData.avatar" /> -->
          </div>
          <template v-if="currentLiveData.name === 'SYSTEM'">
            <div class="tag tag--live">官方直播间</div>
          </template>
          <template v-else>
            <div class="tag tag--live">主播</div>
          </template>

          <div class="tag" :class="`tag--${sportType.val}`">{{ sportType.label }}</div>
        </div>

        <div class="room-message-txt" :class="{ expanded: isExpanded }" v-if="currentLiveData.roomMessage">
          {{ roomMessage }}
        </div>
      </div>
    </div>

    <LiveStreamChatMessages
      class="livestream-chat"
      :messages
      :vip-status
      :livestream-data="currentLiveData"
      @send-chat-message="handleSendChatMessage"
    />
  </div>
</template>

<script setup>
import { ref, onActivated, onUnmounted, onMounted, nextTick, reactive, watch, computed } from "vue";
import Danmu from "danmu.js";
import MarqueeText from "vue-marquee-text-component";
import { userStore } from "stores/index";
import LiveStreamVideo from "../../components/livestream/LiveStreamVideo.vue";
import LiveStreamChatMessages from "../../components/livestream/LiveStreamChatMessages.vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRoute, useRouter } from "vue-router";
import { getChatHistory, getLivestreamList, sendChat, getLivestreamDetail } from "../../api/livestream";
import { extractVipLevelFromVipStr } from "src/boot/utils";
import { useNotify } from "src/hooks/notify";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";

const MESSAGE_SYNC_INTERVAL = 1000 * 2; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;
const MAXIMUM_MESSAGE_LENGTH = 2000;

const LIVESTREAM_SYNC_INTERVAL = 1000 * 10; // 10 seconds

// const DEFAULT_ANNOUNCEMENT = "";
const DEFAULT_ANNOUNCEMENT = "禁止发表任何广告、低俗色情、辱骂平台等违规言论!";

const $q = useQuasar();
const isDark = computed(() => $q.dark.isActive);
const notify = useNotify();
const qs = require("qs");
const route = useRoute();
const router = useRouter();
const videoElement = ref(null);
const danmuContainer = ref(null);
const chatMessage = ref("");
const chatMessages = ref([]);
const announcementList = ref(["禁止发表任何广告、低俗色情、辱骂平台等违规言论!"]);
const chatContainer = ref(null);
const pageContainer = ref(null);
const store = userStore();
const livestreamTimer = ref(null);
const livestreamSyncAbortController = ref(null);
const isExpanded = ref(false);
const totalCharLength = computed(() => displayAnnouncementList.value.reduce((sum, msg) => sum + msg.length, 0));

const marqueeDuration = computed(() => {
  const baseSpeed = 50;
  return Math.max(20, (totalCharLength.value * baseSpeed) / 100);
});

let danmu = null;

const list = ref([]);
const currentLive = ref(0);
const messageTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const unsortMessages = ref([]);
const userVipLevel = computed(() => extractVipLevelFromVipStr(store.vip));

const current = ref(1);
const liveStartTime = ref();
const livestreamListMeta = ref({
  current: 1,
  max: 1
});
const processedUserName = ref();
const isFirstMessageSync = ref(true);
const isProcessingMessageHistory = ref(false);
const messagesHistoryMeta = ref({
  current: 1,
  max: 1
});
const vipStatus = ref(false);

const isLivestreaming = computed(() => !!currentLiveData.value?.liveStatus);
const latestProcessedMessageId = ref(-1);

const currentLiveData = computed(() => {
  const streamIdFromQuery = route.query.streamId;
  if (!streamIdFromQuery || !list.value.length) return {};

  return list.value.find((item) => item.streamId == streamIdFromQuery) || {};
});

const roomMessage = computed(() => {
  if (isExpanded.value) {
    return currentLiveData.value?.roomMessage;
  } else {
    return currentLiveData.value?.roomMessage?.split("\n")[0];
  }
});

const syncLivestreamInfo = async () => {
  if (!currentLiveData.value?.streamId) return;
  livestreamSyncAbortController.value = new AbortController();
  getLivestreamDetail(currentLiveData.value.streamId, livestreamSyncAbortController).then((res) => {
    if (res.code === 0) {
      vipStatus.value = !!res.data.vipStatus;
      if (currentLiveData.value.streamerStatus !== res.data.streamerStatus) {
        const notifyMessage = res.data.streamerStatus
          ? "主播已开播，即将切换至主播直播"
          : "主播已下播，即将切换至赛事直播";
        notify({
          message: notifyMessage,
          type: "info",
          duration: 2000
        });
      }
      // const parsedData = parseLivestreamData(res.data);
      // list.value[currentLive.value] = {
      //   ...currentLiveData.value,
      //   roomMessage: parsedData?.roomMessage,
      //   streamerStatus: parsedData.streamerStatus,
      //   streamerCdnPullUrl: parsedData.streamerCdnPullUrl,
      //   supplierCdnPullUrl: parsedData.supplierCdnPullUrl
      // };
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

// const fullMessages = computed(() => {
//   return messages.value.concat(unsortMessages.value);
// });

const displayAnnouncementList = computed(() => {
  return [DEFAULT_ANNOUNCEMENT];
  const msg = currentLiveData.value.roomMessage?.trim();
  const validMsg = msg ? [msg] : [DEFAULT_ANNOUNCEMENT];
  return validMsg.filter(Boolean);
});

// Initialize Danmu.js for chat overlay
const initDanmu = () => {
  danmu = new Danmu({
    container: danmuContainer.value,
    media: videoElement.value,
    engine: "canvas",
    speed: 100, // Adjust speed for smoother flow
    area: {
      start: 0, // Start at top
      end: 1 // Cover full height
    }
  });
};

const sendDanmu = () => {
  if (chatMessage.value.trim()) {
    // Add to chat messages
    const uniqueId = `danmu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message = chatMessage.value;
    const userName = store.realName ? store.realName : "User";

    chatMessages.value.push({
      user: userName,
      message: message
    });

    // Send as Danmu (弹幕) using danmu.emit
    danmu.emit({
      text: message,
      color: "#ffffff",
      size: 20
    });

    // Send with custom style via danmu.sendComment
    danmu.sendComment({
      duration: 10000,
      id: uniqueId, // Unique identifier for the comment
      start: 3000, // Delay before the Danmu is shown
      txt: message,
      style: {
        color: "#ffffff", // Custom text color
        fontSize: "14px", // Custom font size
        textShadow: "1px 3px 3px black"
      }
    });

    // Clear the input field
    chatMessage.value = "";

    // Scroll to bottom after adding a new message
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// Scroll to the bottom of the chat container
const scrollToBottom = () => {
  const container = chatContainer.value;
  container.scrollTop = container.scrollHeight;
};

const checkValue = ref();
const scrollToTop = () => {
  const container = pageContainer.value;
  container.scrollTop = 0; // Scroll to the top of the container
  checkValue.value = container.scrollTop;
};

const messages = ref([]);
const danmuList = ref([]);

const handleSendChatMessage = (message) => {
  if (!store.hasToken()) {
    // store.loginPageVisible = true;
    const currentPath = router.currentRoute.value.fullPath;
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    });
    return;
  }

  api
    .post(`/session/live/message`, {
      content: message,
      streamId: currentLiveData.value.id
    })
    .then((res) => {
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
      }
    });
};

const getData = () => {
  if (livestreamListMeta.value.current > livestreamListMeta.value.max) return;
  // isLivestreamListLoading.value = true;
  getLivestreamList(livestreamListMeta.value.current).then((res) => {
    if (res.code === 0) {
      vipStatus.value = !!res.data.vipStatus;
      const parsedData = res.data.streamList.map((record) => {
        let parsedSupplierUrl = {};
        let parsedStreamerUrl = {};
        try {
          parsedSupplierUrl = JSON.parse(record.supplierCdnPullUrl);
          parsedStreamerUrl = JSON.parse(record.streamerCdnPullUrl);
        } catch (e) {
        } finally {
          return {
            ...record,
            supplierCdnPullUrl: parsedSupplierUrl,
            streamerCdnPullUrl: parsedStreamerUrl
          };
        }
      });
      list.value = parsedData;
    }
  });
};

const syncMessages = () => {
  messageTimer.value && clearTimeout(messageTimer.value);
  const now = Date.now();
  const pastTime = now - lastSyncMessageTime.value;

  const params = {
    siteId: process.env.SITEID,
    streamId: currentLiveData.value.id,
    recordTime: [liveStartTime.value, now]
  };

  if (pastTime > MESSAGE_SYNC_INTERVAL && !isProcessingMessageHistory.value) {
    lastSyncMessageTime.value = now;
    if (!isLivestreaming.value) return;
    isProcessingMessageHistory.value = true;
    api
      .post(`/live/history?current=${messagesHistoryMeta.value.current}&sortType=ASC`, params)
      .then(async (res) => {
        if (res.code === 0) {
          // console.log("records:::", res.data.records);
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
          // console.log("messagesFromApi::", messagesFromApi);
          // console.log("latestProcessedMessageId::", latestProcessedMessageId.value);

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
    const res = await api.post(`/live/history?current=${current}&sortType=ASC`, params);
    return formatHistoryMessages(res.data.records);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const seenMessageIds = new Set();

const formatHistoryMessages = (messages) => {
  return messages.reduce((result, record) => {
    const isDifferentUser = record.name !== processedUserName.value;
    const isNew = !seenMessageIds.has(record.id);

    if (isDifferentUser && isNew) {
      seenMessageIds.add(record.id);
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

const sportType = computed(() => {
  switch (currentLiveData.value.sportId) {
    case 1:
      return { val: "football", label: "足球" };
    case 2:
      return { val: "basketball", label: "篮球" };
    case 3:
      return { val: "lol", label: "LOL" };
    case 4:
      return { val: "csgo", label: "CSGO" };
    case 5:
      return { val: "dota2", label: "DOTA2" };
    case 6:
      return { val: "kog", label: "王者荣耀" };
    default:
      return { val: "unknown", label: "未知" };
  }
});

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

let collapseTimeout = null;
const expandRoomMsg = () => {
  if (collapseTimeout) {
    clearTimeout(collapseTimeout);
    collapseTimeout = null;
  }

  if (!isExpanded.value) {
    isExpanded.value = true;
    collapseTimeout = setTimeout(() => {
      isExpanded.value = false;
      collapseTimeout = null;
    }, 8000);
  } else {
    isExpanded.value = false;
  }
};

// extension
const currentPath = ref(route.path);
const extensionState = ref(false);
const extensionToken = ref("");

const checkExtension = () => {
  if (currentPath.value === "/livestreampage/streamplayer") {
    extensionToken.value = route.query.token;
    extensionState.value = true;
  } else {
    extensionState.value = false;
  }
};

watch(currentLiveData, () => {
  messages.value = [];
  unsortMessages.value = [];
  danmuList.value = [];
  processedUserName.value = "";
  seenMessageIds.clear();
  latestProcessedMessageId.value = -1;
  lastSyncMessageTime.value = currentLiveData.value?.eventStartTime || Date.now();
  latestProcessedMessageId.value = -1;
  liveStartTime.value = lastSyncMessageTime.value;
  syncMessages();
  resetSyncLivestreamInterval(true);
});

// watch(
//   () => currentLiveData.value.roomMessage,
//   (newVal) => {
//     if (newVal) {
//       isExpanded.value = false;
//       setTimeout(() => {
//         isExpanded.value = true;
//       }, 5000); // Expand after 5 seconds
//     }
//   }
// );

onMounted(() => {
  getData();
  syncMessages();
  // syncLivestreamInfo();
  resetSyncLivestreamInterval(true);
  checkExtension();
});

onUnmounted(() => {
  if (messageTimer.value) {
    clearTimeout(messageTimer.value);
    messageTimer.value = null;
  }
  resetSyncLivestreamInterval();
});
</script>

<style scoped lang="scss">
/* Video Section */
.video-wrapper {
  // position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  z-index: 1000;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.danmu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;

  &.show {
    opacity: 1;
  }
}

.transfer-mid-div {
  position: fixed;
  left: 0;
  top: calc(56.25vw);
}

.room-message-container {
  position: fixed;
  left: 0;
  top: calc(56.25vw + 32px);
  width: 100%;
  display: flex;
  align-items: center;
  background: #e8f2fe;

  .container-box {
    padding: 8px 12px;
    background: #fcfdfe;
    color: #000000;
    width: 100%;
    margin: 12px;
    box-shadow: 0px -2.78px 2.78px 0px #c3d4e6 inset;
    border-radius: 12px;
    font-size: 10px;
    overflow: hidden;

    .type-tags {
      display: flex;
      align-items: center;
      gap: 8px;

      .profile-tag {
        // background: salmon;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          display: block;
          width: 24px;
          height: 24px;
        }
      }

      .tag {
        padding: 0px 12px;
        font-size: 10px;
        line-height: 1;
        border-radius: 24px;
        display: flex;
        align-items: center;
        height: 22px;
        color: #000000;
        box-shadow: 0px -2px 2px 0px #bbc1d6 inset;

        &--live {
          background-color: #bbaef9;
          color: #8658fb;
        }

        &--football {
          background-color: #fbcd74;
          color: #c84e16;
        }

        &--basketball {
          background-color: #a1e3d8;
          color: #107361;
        }

        &--lol {
          background-color: #f7a9a8;
          color: #b30000;
        }

        &--csgo {
          background-color: #ffd8a8;
          color: #b65d00;
        }

        &--dota2 {
          background-color: #c2f0fc;
          color: #157a9d;
        }
      }
    }

    .room-message-txt {
      margin-top: 8px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.3s ease;

      &.expanded {
        white-space: break-spaces;
      }
    }
  }
}

/* Chat Messages */
.chat-container {
  position: fixed;
  top: calc(56.25vw + 38px); /* Height of video (16:9 aspect ratio) */
  left: 0;
  width: 100%;
  height: calc(100dvh - 56.25vw - 60px - 38px);
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  z-index: 999;
  background: #e8f2fe;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chat-message {
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
}

/* Chat Input */
.chat-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #ffffff;
  z-index: 9999;
}

.chat-input {
  flex: 1;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  border-radius: 50px;

  :deep(.q-field__control) {
    padding-right: 0px;
  }
}

.bet-btn {
  background: linear-gradient(180deg, #1745ff 0%, #69fffa 100%);
  color: #fff;
}

.chat-user-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-message-text {
  font-size: 14px;
  color: #333;
  word-wrap: break-word;
  box-shadow: 0px 2px 8px 0px #0000001a;
  padding: 6px 12px;
  border-radius: 0px 10px 10px 10px;
  background: #ffffff;
  width: auto;
  display: inline-flex;
}

.page-style {
  color: #e8f2fe;

  &.dark {
    .room-message-container {
      position: fixed;
      left: 0;
      top: calc(56.25vw + 32px);
      background: unset;

      .container-box {
        background: #1c42a3;
        color: #ffffff;
        box-shadow: 0px -2.78px 2.78px 0px #6691ff inset;

        .type-tags {
          .tag {
            color: #ffffff;
            box-shadow: 0px 2px 2px 0px #16337e;

            &--live {
              background-color: #2d7b72;
              color: #54ff00;
            }

            &--football {
              background-color: #605c72;
              color: #ff9900;
            }

            &--basketball {
              background-color: #3b3a61;
              color: #00e0ff;
            }

            &--lol {
              bbackground-color: #4a2f45;
              color: #ff5ec4;
            }

            &--csgo {
              background-color: #374b3e;
              color: #a6ff00;
            }

            &--dota2 {
              background-color: #2f3e5c;
              color: #ffde59;
            }
          }
        }
      }
    }
  }
}
</style>

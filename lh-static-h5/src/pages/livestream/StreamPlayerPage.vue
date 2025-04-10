<template>
  <q-page ref="pageContainer" class="page-style">
    <!-- <div class="video-wrapper" :style="videoStyle"> -->
    <!-- <template v-if="liveStreamReady"> -->
    <LiveStreamVideo :danmuList :livestream-data="currentLiveData" />
    <!-- </template> -->
    <!-- </div> -->

    <div class="transfer-mid-div">
      <div class="station-notice-wrapper" @click="showAnnouncementDialog">
        <div class="volume">
          <img v-if="$q.dark.isActive" src="../../assets/images/home/transfer-announce-icon-dark.svg" />
          <img v-else src="../../assets/images/home/announce-icon.png" />
        </div>
        <marquee-text :repeat="5" :duration="announcementList.length * 10">
          <div v-if="announcementList">
            <span v-for="(announcement, i) in announcementList" :key="i">
              {{ announcement }}
            </span>
          </div>
        </marquee-text>
      </div>
    </div>
    <!-- <pre>currentLiveDatastreamId -- {{ currentLiveData.streamId }}</pre> -->
    <LiveStreamChatMessages class="livestream-chat" :messages @send-chat-message="handleSendChatMessage" />

    <!-- <pre style="color: salmon">danmuList --{{ danmuList }}</pre> -->
    <!-- <pre style="color: salmon">selectedLiveStream -- {{ selectedLiveStream }}</pre> -->

    <!-- <pre style="color: blue">... {{ selectedLiveStream.supplierCdnPullUrl }}</pre> -->

    <!-- <pre style="color: green">
  ~~~{{ selectedLiveStream.supplierCdnPullUrl ? selectedLiveStream.supplierCdnPullUrl["540p"] : "Loading..." }}
    </pre> -->

    <!-- <pre style="color: salmon">liveStreamList -- {{ liveStreamList }}</pre> -->
  </q-page>
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

const MESSAGE_SYNC_INTERVAL = 1000 * 10; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;
const MAXIMUM_MESSAGE_LENGTH = 1000;

const $q = useQuasar();
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
const isDanmuShow = ref(true);

let danmu = null;
let chatInterval = null;
let randomChatInterval = null;

const urls = ref([
  { name: "线路1", url: "" },
  { name: "线路2", url: "" },
  { name: "线路3", url: "" }
]);

// const channels = ref([
//   // { name: "线路1", url: "https://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8" },
//   // { name: "线路2", url: "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8" }
//   // { name: "线路3", url: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8" }

//   { name: "540p", url: "" },
//   { name: "720p", url: "" },
//   { name: "1080p", url: "" },
//   { name: "Original", url: "" }
// ]);

const list = ref([]);
const currentLive = ref(0);
const messageTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const unsortMessages = ref([]);

const currentLiveData = computed(() => {
  if (!list.value.length) return {};
  return list.value[currentLive.value];
});

const fullMessages = computed(() => {
  return messages.value.concat(unsortMessages.value);
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
      router.push("/login");
    });
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

// const selectedStreamId = reactive({
//   streamId: route.query.streamId
// });

const getData = () => {
  getLivestreamList().then((res) => {
    if (res.code === 0) {
      const parsedData = res.data.records.map((record) => {
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

      getLivestreamDetail(currentLiveData.value.streamId).then((res) => {
        console.log(res);
      });
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
    recordTime: [lastSyncMessageTime.value, now]
  };

  if (pastTime > MESSAGE_SYNC_INTERVAL) {
    lastSyncMessageTime.value = now;
    console.log("params::", params);

    api.post(`/live/history`, params).then((res) => {
      // getChatHistory(params).then((res) => {
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

watch(currentLiveData, () => {
  messages.value = [];
  unsortMessages.value = [];
  danmuList.value = [];
  lastSyncMessageTime.value = Date.now();
  syncMessages();
});

const selectedLiveStream = reactive({
  id: null,
  sportId: null,
  homeNameZh: null,
  homeNameEn: null,
  homeIcon: null,
  awayNameZh: null,
  awayNameEn: null,
  awayIcon: null,
  eventStartTime: null,
  title: null,
  streamerStatus: null,
  supplierCdnPullUrl: null,
  streamerCdnPullUrl: null,
  name: null,
  avatar: null
});

const getSelectedLiveStream = () => {
  api.get(`/live/${route.query.streamId}`).then((res) => {
    if (res.code === 0) {
      // selectedLiveStream.value = res.data.records;

      // temporary date
      // selectedLiveStream = {
      (selectedLiveStream.id = 41),
        (selectedLiveStream.sportId = 1),
        (selectedLiveStream.homeNameZh = "日本"),
        (selectedLiveStream.homeNameEn = "jacket"),
        (selectedLiveStream.homeIcon = "1/53ebfb0e-316f-48c3-8e2f-890e9cccaf62.jpg"),
        (selectedLiveStream.awayNameZh = "美國"),
        (selectedLiveStream.awayNameEn = "testgin"),
        (selectedLiveStream.awayIcon = "1/0f3b6265-1f81-4fd1-9ceb-e2cd64a57402.jpg"),
        (selectedLiveStream.eventStartTime = 1744185234000),
        (selectedLiveStream.title = "paul0409-01"),
        (selectedLiveStream.streamerStatus = 1),
        (selectedLiveStream.supplierCdnPullUrl = JSON.parse(
          '{"540p": {"flv_url": "https://ozqak6.me/live/F974R_540p.flv?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439", "hls_url": "https://ozqak6.me/live/F974R_540p.m3u8?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439"}, "720p": {"flv_url": "https://ozqak6.me/live/F974R_720p.flv?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439", "hls_url": "https://ozqak6.me/live/F974R_720p.m3u8?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439"}, "1080p": {"flv_url": "https://ozqak6.me/live/F974R_1080p.flv?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439", "hls_url": "https://ozqak6.me/live/F974R_1080p.m3u8?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439"}, "original": {"flv_url": "https://ozqak6.me/live/F974R.flv?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439", "hls_url": "https://ozqak6.me/live/F974R.m3u8?txSecret=fbdc9221abd13d8487a7123008c1b2ea&txTime=20250409135439"}}'
        )),
        (selectedLiveStream.streamerCdnPullUrl = JSON.parse(
          '{"540p": {"flv_url": "https://ozqak6.me/live/streamer/F974R_540p.flv?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727", "hls_url": "https://ozqak6.me/live/streamer/F974R_540p.m3u8?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727"}, "720p": {"flv_url": "https://ozqak6.me/live/streamer/F974R_720p.flv?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727", "hls_url": "https://ozqak6.me/live/streamer/F974R_720p.m3u8?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727"}, "1080p": {"flv_url": "https://ozqak6.me/live/streamer/F974R_1080p.flv?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727", "hls_url": "https://ozqak6.me/live/streamer/F974R_1080p.m3u8?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727"}, "original": {"flv_url": "https://ozqak6.me/live/streamer/F974R.flv?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727", "hls_url": "https://ozqak6.me/live/streamer/F974R.m3u8?txSecret=0ed62dff7b7fb358d6795424782246ea&txTime=20250409143727"}}'
        )),
        (selectedLiveStream.name = "paul001"),
        (selectedLiveStream.avatar = "paul002");
      // };
    }
  });
};

const selectedHistory = reactive({
  siteId: 7,
  streamId: route.query.streamId,
  recordTime: ["1744187432264", Date.now().toString()]
});

// const getSelectedLiveHistory = () => {
//   api.post("/live/history", selectedHistory).then((res) => {
//     if (res.code === 0) {
//       // selectedLiveStream.value = res.data.records;
//     }
//   });
// };

// const liveStreamReady = ref(false);

// onActivated(async () => {
//   // Make initial API calls to load the live stream and history
//   await getSelectedLiveStream();
//   await getSelectedLiveHistory();

//   // Define a function to poll the `selectedLiveStream.supplierCdnPullUrl`
//   const pollForLiveStreamData = async () => {
//     // Check if supplierCdnPullUrl has data
//     if (selectedLiveStream.supplierCdnPullUrl) {
//       // Populate channels when supplierCdnPullUrl is available
//       // channels.value = [
//       //   { name: "540p", url: selectedLiveStream.supplierCdnPullUrl["540p"].hls_url },
//       //   { name: "720p", url: selectedLiveStream.supplierCdnPullUrl["720p"].hls_url },
//       //   { name: "1080p", url: selectedLiveStream.supplierCdnPullUrl["1080p"].hls_url },
//       //   { name: "Original", url: selectedLiveStream.supplierCdnPullUrl["original"].hls_url }
//       // ];

//       liveStreamReady.value = true;
//     } else {
//       // If no data yet, wait a bit before checking again
//       setTimeout(() => {
//         pollForLiveStreamData(); // Recursively call the function to keep checking
//       }, 500); // Check again after 500ms (can adjust as needed)
//     }
//   };

//   // Start polling for live stream data
//   await pollForLiveStreamData();
// });

// watch(
//   () => selectedLiveStream.supplierCdnPullUrl,
//   (newValue) => {
//     if (newValue) {
//       // Once supplierCdnPullUrl is populated, update channels and set liveStreamReady
//       channels.value = [
//         { name: "540p", url: newValue["540p"].hls_url },
//         { name: "720p", url: newValue["720p"].hls_url },
//         { name: "1080p", url: newValue["1080p"].hls_url },
//         { name: "Original", url: newValue["original"].hls_url }
//       ];

//       liveStreamReady.value = true;
//     }
//   },
//   { immediate: true } // This will trigger the watcher immediately
// );

onMounted(() => {
  getData();
  syncMessages();
});

onUnmounted(() => {
  if (messageTimer.value) {
    clearTimeout(messageTimer.value);
    messageTimer.value = null;
  }
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
  top: calc(46.25vw);
}

/* Chat Messages */
.chat-container {
  position: fixed;
  top: calc(46.25vw + 38px); /* Height of video (16:9 aspect ratio) */
  left: 0;
  width: 100%;
  height: calc(100dvh - 46.25vw - 60px - 38px);
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
}
</style>

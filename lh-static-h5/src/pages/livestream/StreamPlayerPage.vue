<template>
  <q-page ref="pageContainer">
    <!-- Video Player (Fixed Full Width) -->
    <div class="video-wrapper" :style="videoStyle">
      <!-- <video ref="videoElement" class="video-player" controls muted autoplay>
        Your browser doesn't support HTML5 video.
      </video> -->
      <LiveStreamvideo />
      <div ref="danmuContainer" class="danmu-overlay"></div>
    </div>

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

    <!-- Chat Messages (Scrollable) -->
    <div class="chat-container" ref="chatContainer">
      <div class="chat-messages">
        <div v-for="(msg, index) in chatMessages" :key="index" class="chat-message">
          <div class="chat-user-name">{{ msg.user }}</div>
          <div class="chat-message-text">{{ msg.message }}</div>
        </div>
      </div>
    </div>

    <!-- Chat Input (Stays at Bottom) -->
    <div class="chat-input-container">
      <q-btn class="bet-btn" rounded>投一注</q-btn>

      <q-input
        v-model="chatMessage"
        class="chat-input"
        placeholder="输入您的消息..."
        @keyup.enter="sendDanmu"
        outlined
        rounded
        dense
      >
        <template v-slot:append>
          <div>
            <q-btn @click="sendDanmu" rounded outline color="primary" label="发弹幕" />
          </div>
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
// import flvjs from "flv.js";
import Danmu from "danmu.js";
import MarqueeText from "vue-marquee-text-component";
import { userStore } from "stores/index";
import LiveStreamvideo from "../../components/LiveStreamVideo.vue";

const videoElement = ref(null);
const danmuContainer = ref(null);
const chatMessage = ref("");
const chatMessages = ref([]);
const announcementList = ref(["禁止发表任何广告、低俗色情、辱骂平台等违规言论!"]);
const chatContainer = ref(null);
const pageContainer = ref(null);
const store = userStore();

// const streamUrl = ref("http://207.148.73.114:8080/live/livestream.flv");
const streamUrl = ref("http://www.html5videoplayer.net/videos/toystory.mp4");
let player = null;
let danmu = null;

// Load FLV Player
const flvLoad = () => {
  if (flvjs.isSupported()) {
    if (player) {
      player.unload();
      player.detachMediaElement();
      player.destroy();
      player = null;
    }

    player = flvjs.createPlayer({ type: "flv", url: streamUrl.value, isLive: true });
    player.attachMediaElement(videoElement.value);
    player.load();
  } else {
    console.log("FLV.js is not supported on this browser.");
  }
};

// Initialize Danmu.js for chat overlay
const initDanmu = () => {
  danmu = new Danmu({
    container: danmuContainer.value,
    media: videoElement.value,
    engine: "canvas"
  });
};

// Send Chat Message as Danmu (弹幕)
const sendDanmu = () => {
  if (chatMessage.value.trim()) {
    // Add to chat messages
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
      duration: 15000,
      id: "id", // Unique identifier for the comment
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

// adjust mobile keyboard
const isKeyboardOpen = ref(false);
const videoStyle = ref({});

const adjustLayout = () => {
  if (window.visualViewport.height < window.innerHeight) {
    isKeyboardOpen.value = true;
    videoStyle.value = { position: "fixed", bottom: "0px" }; // Adjust video position
  } else {
    isKeyboardOpen.value = false;
    videoStyle.value = { position: "fixed", top: "0px" };
  }
  console.log("resize~");
};

onMounted(() => {
  // flvLoad();
  initDanmu();

  window.visualViewport.addEventListener("resize", adjustLayout);
});

onUnmounted(() => {
  if (player) {
    player.pause();
    player.unload();
    player.detachMediaElement();
    player.destroy();
  }

  window.visualViewport.removeEventListener("resize", adjustLayout);
});
</script>

<style scoped lang="scss">
/* Video Section */
.video-wrapper {
  position: fixed;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.transfer-mid-div {
  position: fixed;
  left: 0;
  top: calc(56.25vw);
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
    padding-right: 4px;
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
</style>

<template>
  <div class="back-section" style="z-index: 4900" v-if="showPlayerController">
    <q-btn flat to="/livestream">
      <q-icon name="chevron_left" color="white" size="lg" />
      <div class="item-content">
        <div class="content-title">德国甲级联赛</div>
        <div class="content-desc">沃尔夫斯堡VS库勒沃斯</div>
      </div>
    </q-btn>
  </div>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @click="handlePauseChange(!playerConfig.isPause)"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
  >
    <template v-if="isFlvSupported">
      <video ref="videoRef" class="livestream-video" @progress="handlePlayerProgress" />
      <div ref="danmuRef" class="livestream-video-danmu" />
      <div
        class="livestream-video-controller"
        :class="{
          show: showPlayerController
        }"
        @click.stop
      >
        <div class="livestream-video-controller-group">
          <q-btn
            class="livestream-video-controller-pause-btn btn"
            flat
            :title="playerConfig.isPause ? '播放' : '暂停'"
            @click="handlePauseChange(!playerConfig.isPause)"
          >
            <img v-if="playerConfig.isPause" src="../../assets/images/livestream/icon-play.png" />
            <img v-else src="../../assets/images/livestream/icon-pause.png" />
          </q-btn>
          <div class="livestream-video-controller-volume-group">
            <q-btn flat class="livestream-video-controller-volume-btn btn" title="音量">
              <img src="../../assets/images/livestream/icon-volume.png" />
            </q-btn>
            <q-input
              class=""
              flat
              type="range"
              min="0"
              max="100"
              step="1"
              :value="playerConfig.volume"
              @input="handleVolumeChange"
            />
          </div>
        </div>

        <div class="livestream-video-controller-group">
          <q-btn
            class="livestream-video-controller-danmu-btn btn"
            flat
            :title="playerConfig.isDanmuClose ? '开启' : '关闭' + '弹幕'"
            @click="handleDanmuChange(!playerConfig.isDanmuClose)"
          >
            <img v-if="playerConfig.isDanmuClose" src="../../assets/images/livestream/icon-danmu-close.png" />
            <img v-else src="../../assets/images/livestream/icon-danmu-open.png" />
          </q-btn>
          <q-btn
            class="livestream-video-controller-fullscreen-btn btn"
            flat
            :title="playerConfig.isFullScreen ? '开启' : '退出' + '全屏'"
            @click="handleFullScreenChange(!playerConfig.isFullScreen)"
          >
            <img v-if="playerConfig.isFullScreen" src="../../assets/images/livestream/icon-fullscreen-exit.png" />
            <img v-else src="../../assets/images/livestream/icon-fullscreen.png" />
          </q-btn>
        </div>
      </div>
    </template>
    <div v-else>不支援的浏览器</div>
  </div>
</template>
<script setup>
import { onMounted, ref, toRefs, watch, onUnmounted } from "vue";

/** @type {import("flv.js").default.Config} */
const DEFAULT_FLV_CONFIG = {
  enableWorker: true
};

const PLAYER_CONFIG_KEY = "lh-livestream-player-config";

const DEFAULT_DANMU_CONFIG = {
  area: {
    start: 0.05,
    end: 1
  },
  channelSize: 30
};

const DANMU_STYLE = {
  color: "#fff",
  fontSize: "12px",
  lineHeight: "15px",
  borderRadius: "38px",
  padding: "6px 10px",
  backgroundColor: "#00000033"
};

const DANMU_CONFIG = {
  duration: 10000,
  start: 0,
  style: DANMU_STYLE
};

const props = defineProps(["danmuList"]);
const { danmuList } = toRefs(props);

/**  @type {import("vue").Ref<typeof import("flv.js").default | null>} */
const flv = ref(null);
const danmuJs = ref(null);

const videoRef = ref(null);
const danmuRef = ref(null);
const videoWrapperRef = ref(null);
const videoWrapperMouseLeaveTimer = ref(null);
const showPlayerController = ref(false);
const isFlvSupported = ref(true);
const player = ref(null);
const danmu = ref(null);
const playerConfig = ref({
  isPause: false,
  volume: 50,
  isFullScreen: false,
  isDanmuClose: false
});

const loadFlv = async () => {
  const _flv = (await import("flv.js")).default;
  flv.value = _flv;
  if (flv.value.isSupported() && videoRef.value) {
    player.value = flv.value.createPlayer(
      {
        type: "flv",
        url: "http://207.148.73.114:8080/live/livestream.flv",
        isLive: true
      },
      DEFAULT_FLV_CONFIG
    );
    player.value.on(flv.value.Events.ERROR, handlePlayerError);
    player.value.attachMediaElement(videoRef.value);
    player.value.load();
    player.value.play();
  }
};

const loadDanmu = async () => {
  const _danmu = (await import("danmu.js")).default;
  danmuJs.value = _danmu;
  if (danmuRef.value) {
    danmu.value = new danmuJs.value({
      ...DEFAULT_DANMU_CONFIG,
      container: danmuRef.value
    });
  }
};

const loadPlayerConfig = () => {
  let finalPlayerConfig = playerConfig.value;
  try {
    const savedPlayerConfigStr = localStorage.getItem(PLAYER_CONFIG_KEY);
    const savedPlayerConfig = JSON.parse(savedPlayerConfigStr);
    finalPlayerConfig = {
      ...finalPlayerConfig,
      ...savedPlayerConfig
    };
  } catch (e) {
  } finally {
    Object.entries(finalPlayerConfig).forEach(([key, value]) => {
      switch (key) {
        case "volume":
          videoRef.value.volume = value / 100;
          playerConfig.value[key] = value;
          break;
        case "isDanmuClose":
          handleDanmuChange(value);
      }
    });
  }
};

const changePlayerConfig = (key, value) => {
  playerConfig.value[key] = value;
  const playConfigStr = JSON.stringify(playerConfig.value);
  localStorage.setItem(PLAYER_CONFIG_KEY, playConfigStr);
};

const handlePauseChange = (value) => {
  changePlayerConfig("isPause", value);
  if (playerConfig.value.isPause) {
    player.value.pause();
  } else {
    player.value.play();
  }
};

const handleDanmuChange = (value) => {
  changePlayerConfig("isDanmuClose", value);
  if (playerConfig.value.isDanmuClose) {
    danmu.value.stop();
  } else {
    danmu.value.start();
  }
};

const handleFullScreenChange = (value) => {
  changePlayerConfig("isFullScreen", value);
  if (playerConfig.value.isFullScreen) {
    videoWrapperRef.value.requestFullscreen();
    if (screen.orientation) {
      screen.orientation.lock("landscape").catch((err) => {
        console.error("Error locking orientation:", err);
      });
    }
  } else {
    document.exitFullscreen();
  }
};

const handleVolumeChange = (e) => {
  const value = e.target.value;
  changePlayerConfig("volume", parseInt(value));
  videoRef.value.volume = value / 100;
};

const handleWrapperMouseEnter = () => {
  showPlayerController.value = true;
  videoWrapperMouseLeaveTimer.value && clearTimeout(videoWrapperMouseLeaveTimer.value);
};

const handleWrapperMouseLeave = () => {
  videoWrapperMouseLeaveTimer.value = setTimeout(() => {
    showPlayerController.value = false;
  }, 1500);
};

const handlePlayerProgress = () => {
  if (!videoRef.value || videoRef.value.paused) return;
  const bufferedEnd = videoRef.value.buffered.end(0);
  const delta = bufferedEnd - videoRef.value.currentTime;
  if (delta > 10 || delta < 0) {
    videoRef.value.currentTime = bufferedEnd - 0.5;
  }
};

const handlePlayerError = (e) => {
  console.log(e);
  if (!playerConfig.value.isPause) {
    changePlayerConfig("isPause", true);
  }
};

const generateRandomDanmu = () => {
  if (!danmu.value) return;

  const randomUsernames = [
    "进球大师99",
    "足球狂热者",
    "射手王",
    "传球专家",
    "VAR不行",
    "点球英雄",
    "红牌裁判",
    "越位巫师",
    "过人之神",
    "反击之王",
    "头球怪兽",
    "超级替补",
    "防守之墙",
    "门神",
    "任意球传奇",
    "金靴奖",
    "狂热球迷",
    "横幅制作人",
    "球场歌手",
    "最后时刻英雄"
  ];

  const randomMessages = [
    "比赛结束！精彩比赛！⚽",
    "太棒的传球！🔥",
    "裁判你瞎了吗？！🤬",
    "又是越位？！🤦‍♂️",
    "VAR真是毁了足球 😡",
    "精彩进球！🚀",
    "门将今天真是神勇！🧤",
    "传控流最强！👏",
    "这是什么恶意犯规！😬",
    "红牌来了！🟥",
    "反击开始，GO GO GO！⚡",
    "头球进了！🎯",
    "该换人了！🔄",
    "点球！🥅",
    "加时赛戏剧性时刻！⏳",
    "大家加油，前场压上！🔥",
    "防守啊，防守！🏰",
    "神扑！🧤",
    "0-0无聊比赛... 😴",
    "中场在哪里？！🤔",
    "90+5的绝杀来了！🚀",
    "我们需要奇迹！🙏"
  ];

  const randomMessageCount = Math.floor(Math.random() * 3) + 2; // Random between 2 to 6 messages

  const newComments = [];

  for (let i = 0; i < randomMessageCount; i++) {
    const randomDanmu = {
      ...DANMU_CONFIG,
      txt: `${randomMessages[Math.floor(Math.random() * randomMessages.length)]}`,
      id: Date.now() + i // Unique ID for each message
    };
    newComments.push(randomDanmu);
  }

  danmu.value.updateComments(newComments);
};

watch(danmuList, () => {
  if (danmuList.value.length && danmu.value) {
    const _danmuList = danmuList.value.map((content, index) => ({
      ...DANMU_CONFIG,
      txt: content,
      id: Date.now() + index
    }));
    danmu.value.updateComments(_danmuList);
  }
});

onMounted(() => {
  Promise.all([loadFlv(), loadDanmu()]).then(() => {
    loadPlayerConfig();
    setInterval(generateRandomDanmu, Math.random() * (5000 - 3000) + 3000);
  });
});

// // keyboard appear
// onMounted(() => {
//   window.visualViewport.addEventListener("resize", adjustLayout);
// });

// onUnmounted(() => {
//   window.visualViewport.removeEventListener("resize", adjustLayout);
// });

// // adjust mobile keyboard
// const isKeyboardOpen = ref(false);
// const videoStyle = ref({});

// const adjustLayout = () => {
//   if (window.visualViewport.height < window.innerHeight) {
//     isKeyboardOpen.value = true;
//     // videoStyle.value = { position: "fixed", bottom: window.visualViewport.height - window.innerHeight + 60 };
//     // document.documentElement.style.overflow = "hidden";
//     // document.body.style.overflow = "hidden";
//   } else {
//     isKeyboardOpen.value = false;
//     // videoStyle.value = { position: "fixed", bottom: "0px" };
//     // document.documentElement.style.overflow = "auto";
//     // document.body.style.overflow = "auto";
//   }

//   console.log("window.visualViewport.height:", window.visualViewport.height);
//   console.log("window.innerHeight:", window.innerHeight);
// };

// watch(isKeyboardOpen, (newValue) => {
//   if (newValue) {
//     // Disable scrolling when the keyboard is open
//     // document.documentElement.style.overflow = "hidden";
//     // document.body.style.overflow = "hidden";
//     // videoStyle.value = { marginTop: window.innerHeight - window.visualViewport.height };
//     // window.scrollTo({ top: 0, behavior: "smooth" });
//     // videoWrapperRef.value.requestHalfscreen();
//   } else {
//     // Re-enable scrolling when the keyboard is closed
//     // document.documentElement.style.overflow = "auto";
//     // document.body.style.overflow = "auto";
//     // videoStyle.value = { marginTop: "0px" };
//     // window.scrollTo({ top: 800, behavior: "smooth" });
//   }
// });
</script>

<style lang="scss" scoped>
.livestream-video-wrapper {
  position: relative;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;

  .livestream-video-danmu {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .livestream-video-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 8px 6px;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s;

    &.show {
      transform: translateY(0);
      opacity: 1;
    }

    &:before {
      // background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent 80%, rgba(0, 0, 0, 0.2));
      content: "";
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 100%);
      width: 100%;
      height: 20vw;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .livestream-video-controller-group {
      display: flex;
      align-items: center;
      justify-content: center;
      // gap: 10px;
    }

    .btn {
      background-color: transparent;
    }

    img {
      max-width: 24px;
    }

    .livestream-video-controller-volume-group {
      display: flex;
      align-items: center;
      gap: 10px;

      input[type="range"] {
        // -webkit-appearance: none;
        &::-webkit-slider-runnable-track,
        &::-webkit-slider-thumb,
        &::-moz-range-track,
        &::-moz-range-thumb,
        &::-ms-track,
        &::-ms-fill-lower,
        &::-ms-fill-upper,
        &::-ms-thumb {
          background: red;
        }
      }
    }
  }

  .livestream-video {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}

.back-section {
  position: absolute;
  top: 0;
  left: 0;
  text-align: left;
  width: 100%;
  font-size: 12px;
  display: flex;
  margin-right: auto;

  &:before {
    content: "";
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 100%);
    width: 100vw;
    height: 20dvh;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .item-content {
    text-align: left;
    .content-title {
      font-size: 13px;
      font-weight: bold;
      color: #fff;
    }
    .content-desc {
      color: #fff;
      font-size: 11px;
    }
  }
}
</style>

<style>
/* html,
body {
  overflow: hidden;
} */
</style>

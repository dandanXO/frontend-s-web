<template>
  <div class="back-section" style="z-index: 4900" v-if="showPlayerController">
    <q-btn flat to="/livestream">
      <q-icon name="chevron_left" color="white" size="lg" />
      <div class="item-content">
        <div class="content-title">{{ livestreamData.title }}</div>
        <div class="content-desc">{{ livestreamData.homeNameZh }} VS {{ livestreamData.awayNameZh }}</div>
      </div>
    </q-btn>
  </div>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
    @canplay="handlePlayerCanPlay"
  >
    <template v-if="isPlayerSupported">
      <div v-if="isFirstPlay" class="first-play" @click="firstPlayVideo()">
        <q-icon name="play_arrow" color="white" size="80px" />
      </div>

      <video
        ref="videoRef"
        class="livestream-video"
        crossorigin="anonymous"
        playsinline
        webkit-playsinline
        @progress="handlePlayerProgress"
      />

      <canvas v-show="showLatestScreenCanvas" ref="canvasRef" class="livestream-video-latest-screen" />

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
        </div>

        <div class="livestream-video-controller-volume-group">
          <q-btn flat class="livestream-video-controller-volume-btn btn" title="音量">
            <img src="../../assets/images/livestream/icon-volume.png" />
          </q-btn>

          <q-slider
            class="volume-slider"
            v-model="playerConfig.volume"
            @change="handleVolumeChange"
            :min="0"
            :max="100"
            :step="1"
            color="primary"
            track-color="grey-4"
            thumb-color="primary"
            style="width: 90px"
          />
        </div>

        <q-btn
          class="livestream-video-controller-url-btn"
          unelevated
          color="white"
          outline
          dense
          size="sm"
          title="线路选择"
        >
          &nbsp;{{ playerConfig.quality }}&nbsp;
          <q-popup-proxy ref="channelPopperRef" transition-show="scale" transition-hide="scale">
            <q-card class="livestream-video-controller-popover channel">
              <q-list separator>
                <q-item
                  v-for="(quality, index) in qualities"
                  :key="index"
                  clickable
                  @click="handleQualityChange(quality.value)"
                >
                  <q-item-section>
                    {{ quality.name }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-popup-proxy>
        </q-btn>

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

      <div v-if="isVideoLoading" class="livestream-video-mask" @click.stop>
        <div class="loader" />
        <span>正在加载视频...</span>
      </div>

      <div v-if="isVideoLoadFailed" class="livestream-video-mask" @click.stop>
        <q-btn class="btn" @click="loadData">
          <img src="../../assets/images/livestream/icon-reload.png" />
        </q-btn>
        <span>点击重新加载视频</span>
      </div>
    </template>

    <div v-else class="livestream-unsupported">不支援的浏览器</div>
  </div>

  <!-- <pre style="color: salmon">
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
  playerConfig --{{ playerConfig }}
  </pre> -->
  <pre style="color: grey; position: fixed; top: 0; left: 0; width: 100%">
  currentVideoUrl -- {{ currentVideoUrl }}
  </pre>
</template>
<script setup>
import { onMounted, ref, toRefs, watch, onUnmounted, computed, onActivated, nextTick, onBeforeUnmount } from "vue";
import { VideoPlayer } from "boot/videoPlayer";

/** @type {import("flv.js").default.Config} */
const DEFAULT_FLV_CONFIG = {
  enableWorker: true
};

/** @type {import("hls.js").HlsConfig} */
const DEFAULT_HLS_CONFIG = {
  enableWorker: true,
  debug: false,
  maxBufferLength: 10
};

const PLAYER_CONFIG_KEY = "lh-livestream-player-config";
const MAXIMUM_VIDEO_RELOAD_TIMEOUT = 30 * 1000; // 30 seconds

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

const DEFAULT_QUALITY = "original";

const props = defineProps(["danmuList", "channels", "livestreamData"]);
const { danmuList, channels, livestreamData } = toRefs(props);

const danmuJs = ref(null);

/**  @type {import("vue").Ref<HTMLVideoElement | null>} */
const videoRef = ref(null);
const danmuRef = ref(null);
const videoWrapperRef = ref(null);
const channelPopperRef = ref(null);
const qualityPopperRef = ref(null);
const canvasRef = ref(null);
const videoWrapperMouseLeaveTimer = ref(null);
const showPlayerController = ref(false);
const showLatestScreenCanvas = ref(false);
const isLatestScreenRecorded = ref(false);
const videoLoadErrorStartTime = ref(null);
const isPlayerSupported = ref(true);
const isVideoLoadFailed = ref(false);
const isVideoLoading = ref(false);
/** @type {import("vue").Ref< VideoPlayer | null>}*/
const player = ref(null);
const danmu = ref(null);
// const qualities = ref([DEFAULT_QUALITY]);
const qualities = ref([]);
const playerConfig = ref({
  isPause: false,
  volume: 50,
  isFullScreen: false,
  isDanmuClose: false,
  quality: DEFAULT_QUALITY,
  channel: 0
});

const videoSource = computed(() => {
  if (!livestreamData.value) return {};
  return livestreamData.value.streamerStatus
    ? livestreamData.value.streamerCdnPullUrl
    : livestreamData.value.supplierCdnPullUrl;
});

const currentVideoUrl = computed(() => {
  if (!videoSource.value) return "";
  const result = Object.entries(videoSource.value).find(([key, value]) => {
    return key === playerConfig.value.quality;
  });
  return result[1]?.hls_url ?? "";
});

const loadPlayer = async () => {
  getQualities();
  player.value = new VideoPlayer(
    {
      mediaType: "hls",
      // url: currentChannel.value.url,
      url: currentVideoUrl.value,
      maxLatency: 10,
      // ...DEFAULT_FLV_CONFIG,
      ...DEFAULT_HLS_CONFIG
    },
    videoRef.value
  );
  await initPlayer();
};

const initPlayer = async (play = true) => {
  console.log(player.value);
  if (!player.value) return;
  await player.value.init();
  isPlayerSupported.value = player.value.SupportPlayer !== "NONE";
  player.value.on(player.value.Events.CUSTOM_ERROR, handlePlayerError);
  isVideoLoading.value = true;
  await player.value.load(play);
  isVideoLoading.value = false;
  showLatestScreenCanvas.value = false;
  isLatestScreenRecorded.value = false;
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
          break;
        case "quality":
          // if (value < player.value.levels.length) {
          //   handleQualityChange(value);
          // }
          handleQualityChange(value);
          break;
      }
    });
  }
};

const changePlayerConfig = (key, value) => {
  playerConfig.value[key] = value;
  const playConfigStr = JSON.stringify(playerConfig.value);
  localStorage.setItem(PLAYER_CONFIG_KEY, playConfigStr);
};

const handleVolumeChange = (value) => {
  changePlayerConfig("volume", parseInt(value));
  if (videoRef.value) {
    videoRef.value.volume = value / 100;
  }
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

const isAppleDevice =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Macintosh") && "ontouchend" in document);

const handleFullScreenChange = (value) => {
  changePlayerConfig("isFullScreen", value);
  if (value) {
    if (isAppleDevice) {
      const video = videoRef.value;
      if (video && typeof video.webkitEnterFullscreen === "function") {
        video.webkitEnterFullscreen();
      }
    } else {
      const wrapper = videoWrapperRef.value;
      if (wrapper && typeof wrapper.requestFullscreen === "function") {
        wrapper.requestFullscreen();
        screen.orientation?.lock?.("landscape").catch((err) => {
          console.warn("Orientation lock failed:", err);
        });
      }
    }
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      screen.orientation?.lock?.("portrait").catch((err) => {
        console.warn("Failed to lock orientation to portrait:", err);
      });
    }
  }
};

const handleWrapperMouseEnter = () => {
  showPlayerController.value = true;
  videoWrapperMouseLeaveTimer.value && clearTimeout(videoWrapperMouseLeaveTimer.value);
};

const handleWrapperMouseLeave = () => {
  videoWrapperMouseLeaveTimer.value = setTimeout(() => {
    showPlayerController.value = false;
    channelPopperRef.value?.hide();
    qualityPopperRef.value?.hide();
  }, 500);
};

const handlePlayerProgress = () => {
  if (!videoRef.value || videoRef.value.paused) return;
  player.value.syncLive();
};

const handlePlayerCanPlay = () => {
  isLatestScreenRecorded.value = false;
};

const handlePlayerError = (data) => {
  console.error(data.detail);
  if (!playerConfig.value.isPause) {
    changePlayerConfig("isPause", true);
  }
  if (!videoLoadErrorStartTime.value) {
    videoLoadErrorStartTime.value = Date.now();
  }
  if (!isLatestScreenRecorded.value) {
    const ctx = canvasRef.value.getContext("2d");
    const videoWidth = videoRef.value.videoWidth;
    const videoHeight = videoRef.value.videoHeight;
    const clientWidth = videoRef.value.clientWidth;
    const clientHeight = videoRef.value.clientHeight;
    const scale = Math.min(clientWidth / videoWidth, clientHeight / videoHeight);
    const drawWidth = videoWidth * scale;
    const drawHeight = videoHeight * scale;
    const offsetX = (clientWidth - drawWidth) / 2;
    const offsetY = (clientHeight - drawHeight) / 2;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.drawImage(
      videoRef.value,
      0,
      0,
      canvasRef.value.width,
      canvasRef.value.height,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
    isLatestScreenRecorded.value = true;
    showLatestScreenCanvas.value = true;
  }
  if (Date.now() - videoLoadErrorStartTime.value > MAXIMUM_VIDEO_RELOAD_TIMEOUT) {
    videoLoadErrorStartTime.value = null;
    isVideoLoadFailed.value = true;
    isVideoLoading.value = false;
  } else {
    isVideoLoading.value = true;
    initPlayer(true);
  }
};

const handleQualityChange = async (level) => {
  const _level = videoSource.value[level] ? level : DEFAULT_QUALITY;
  changePlayerConfig("quality", _level);
  // player.value.setQualityLevel(index);
  player.value.changeSource(videoSource.value[_level].hls_url);
  await initPlayer(true);
};

const getQualities = () => {
  if (!videoSource.value) return;
  const result = Object.entries(videoSource.value).map(([level, value], index) => ({
    value: level,
    name: level,
    url: value.hls_url
  }));

  qualities.value = result;
};

const loadData = () => {
  isVideoLoadFailed.value = false;
  Promise.all([loadPlayer(), loadDanmu()]).then(loadPlayerConfig);
};

watch(livestreamData, () => {
  loadData();
});

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

const isFirstPlay = ref(true);
const firstPlayVideo = () => {
  isFirstPlay.value = false;
  player.value.play();
};

const mediaQuery = window.matchMedia("(orientation: landscape)");

const handleOrientationChange = (e) => {
  if (e.matches) {
    // Landscape mode
    if (!playerConfig.value.isFullScreen) {
      handleFullScreenChange(true);
    }
  } else {
    // Portrait mode
    if (playerConfig.value.isFullScreen) {
      handleFullScreenChange(false);
    }
  }
  canvasRef.value.width = videoRef.value.clientWidth;
  canvasRef.value.height = videoRef.value.clientHeight;
};

onActivated(() => {
  Promise.all([loadPlayer(), loadDanmu()]).then(() => {
    loadPlayerConfig();
  });
  mediaQuery.addEventListener("change", handleOrientationChange);
  // Run it once on mount
  handleOrientationChange(mediaQuery);
  // player.value.play();
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleOrientationChange);
});
</script>

<style lang="scss" scoped>
.livestream-video-wrapper {
  position: relative;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56.25vw;
  background: #000000;

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
      width: 100vw;
      height: 60px;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .livestream-video-controller-group {
      display: flex;
      align-items: center;
      justify-content: center;
      // gap: 10px;

      .livestream-video-controller-pause-btn,
      .livestream-video-controller-danmu-btn,
      .livestream-video-controller-fullscreen-btn,
      .livestream-video-controller-volume-btn {
        width: 24px;
      }
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
      // gap: 10px;

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

  .livestream-video-latest-screen {
    position: absolute;
    inset: 0;
  }

  .livestream-video-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0000004d;
    width: 100%;
    height: 100%;
    color: #fff;

    .livestream-video-mask-text-content {
      max-width: 100%;
      overflow: auto;
    }
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid #3981ff;
    animation: l20-1 0.8s infinite linear alternate, l20-2 1.6s infinite linear;
    margin-bottom: 10px;
  }
  @keyframes l20-1 {
    0% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
    }
    12.5% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
    }
    25% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
    }
    62.5% {
      clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
    }
    75% {
      clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
    }
    100% {
      clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
    }
  }
  @keyframes l20-2 {
    0% {
      transform: scaleY(1) rotate(0deg);
    }
    49.99% {
      transform: scaleY(1) rotate(135deg);
    }
    50% {
      transform: scaleY(-1) rotate(0deg);
    }
    100% {
      transform: scaleY(-1) rotate(-135deg);
    }
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
    height: 60px;
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

.livestream-video-controller-url-btn {
  margin-left: auto;
}

.volume-slider {
  :deep(.q-slider__thumb) {
    top: 0;
  }
}

.first-play {
  background: #000000;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  z-index: 8;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
</style>

<style lang="scss" scoped>
@media (orientation: landscape) {
  .livestream-video-wrapper {
    width: 55%;
    height: calc(100%);
    // opacity: 0;
  }

  .back-section {
    position: fixed;
    top: 0;
    left: 0;
    text-align: left;
    width: 100%;
    font-size: 12px;
    display: flex;
    margin-right: auto;
  }
}
</style>

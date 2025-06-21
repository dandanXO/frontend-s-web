<template>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    :class="{ landscape: isLandscape }"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
  >
    <div class="back-section" style="z-index: 4900" v-if="showPlayerController">
      <q-btn flat>
        <q-icon name="chevron_left" color="white" size="lg" @click="backToPrev()" />
        <div class="item-content">
          <div class="content-title">{{ livestreamData.title }}</div>
          <div class="content-desc">
            {{ livestreamData.homeNameZh ?? livestreamData.homeNameEn ?? livestreamData.homeName }} VS
            {{ livestreamData.awayNameZh ?? livestreamData.awayNameEn ?? livestreamData.awayName }}
          </div>
        </div>
      </q-btn>

      <q-btn flat @click="handleShareClick">
        <img class="share-icon" src="../../assets/images/livestream/icon-share.png" />
      </q-btn>
    </div>
    <template v-if="isPlayerSupported">
      <video
        ref="videoRef"
        class="livestream-video"
        crossorigin="anonymous"
        playsinline
        webkit-playsinline
        muted
        @progress="handlePlayerProgress"
        @canplay="handlePlayerCanPlay"
        @webkitendfullscreen="handleEndFullScreen"
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
            :disable="isVideoStuck"
            @click="handlePauseChange(!playerConfig.isPause)"
          >
            <img v-if="playerConfig.isPause" src="../../assets/images/livestream/icon-play.png" />
            <img v-else src="../../assets/images/livestream/icon-pause.png" />
          </q-btn>
        </div>

        <div class="livestream-video-controller-volume-group">
          <!-- <q-btn flat class="livestream-video-controller-volume-btn btn" title="音量">
            <img src="../../assets/images/livestream/icon-volume.png" />
          </q-btn> -->

          <!-- <q-slider
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
          />  -->
          <q-btn flat dense @click="toggleMute" :icon="playerConfig.muted ? 'volume_off' : 'volume_up'" color="white" />
        </div>

        <q-btn
          class="livestream-video-controller-url-btn"
          unelevated
          color="white"
          outline
          dense
          size="sm"
          title="线路选择"
          @click="showChannelChange()"
        >
          &nbsp;{{ currentQualityName }}&nbsp;

          <!-- <q-popup-proxy ref="channelPopperRef" transition-show="scale" transition-hide="scale">
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
          </q-popup-proxy> -->
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

      <template v-if="isVideoStuck">
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
        <div v-if="isErrorCaptured && env !== 'production'" class="livestream-video-mask" @click.stop>
          <q-btn color="primary" @click="copyMessage">已捕获错误，点击复制</q-btn>
        </div>
      </template>
      <div v-else-if="showUnmuteMask" class="livestream-video-mask" @click.stop="handleUnmuteClick">
        <button class="btn">
          <img src="../../assets/images/livestream/icon-volume-off.png" />
        </button>
        <span>点击取消静音</span>
      </div>
    </template>

    <div v-else class="livestream-unsupported">不支援的浏览器</div>
  </div>

  <!-- <pre style="color: salmon">
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
  playerConfig --{{ playerConfig }}
  </pre> -->
</template>

<script setup>
import {
  onMounted,
  ref,
  toRefs,
  watch,
  onUnmounted,
  computed,
  onActivated,
  nextTick,
  onBeforeUnmount,
  onDeactivated
} from "vue";
import { VideoPlayer } from "boot/videoPlayer";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useNotify } from "src/hooks/notify";
import { useLocalStorage, useSessionStorage, useDebounceFn } from "@vueuse/core";
import { isAndroid } from "boot/utils";

const $q = useQuasar();
const router = useRouter();

/** @type {import("flv.js").default.Config} */
const DEFAULT_FLV_CONFIG = {
  enableWorker: false
};

/** @type {import("hls.js").HlsConfig} */
const DEFAULT_HLS_CONFIG = {
  enableWorker: true,
  debug: false,
  maxBufferLength: 10
};

const PLAYER_CONFIG_KEY = "lh-livestream-player-config";
const MAXIMUM_VIDEO_RELOAD_TIMEOUT = 30 * 1000; // 30 seconds
const ERROR_HANDLER_DEBOUNCE_TIME = 5 * 1000; // 5 seconds

const DEFAULT_DANMU_CONFIG = {
  area: {
    start: 0.05,
    end: 1
  },
  channelSize: 30
};

const DANMU_STYLE = {
  color: "#fff",
  fontSize: "14px",
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
const env = process.env.NODE_ENV;

const QUALITY_ALIAS = {
  original: "原画"
};

const notify = useNotify();

const props = defineProps([
  "danmuList",
  "channels",
  "livestreamData",
  "extensionState",
  "extensionToken",
  "isTyping",
  "isLandscape"
]);
const { danmuList, channels, livestreamData, extensionState, extensionToken, isTyping, isLandscape } = toRefs(props);

const emit = defineEmits(["share-click", "landscape-change"]);

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
const isPlayerConfigLoaded = ref(false);
const showLatestScreenCanvas = ref(false);
const isLatestScreenRecorded = ref(false);
const videoLoadErrorStartTime = ref(null);
const isPlayerSupported = ref(true);
const isVideoLoadFailed = ref(false);
const isVideoLoading = ref(false);
const isErrorCaptured = ref(false);
const errorMsg = ref("");
const isActive = ref(false);
const showUnmuteMask = ref(true);
const orientationTimer = ref(null);
/** @type {import("vue").Ref< VideoPlayer | null>}*/
const player = ref(null);
const danmu = ref(null);
// const qualities = ref([DEFAULT_QUALITY]);
const qualities = ref([]);
const playerConfig = ref({
  isPause: false,
  volume: 1,
  isFullScreen: false,
  isDanmuClose: false,
  quality: DEFAULT_QUALITY,
  channel: 0,
  muted: false
});

const videoSource = computed(() => getVideoSource(livestreamData.value));

const currentVideoUrl = computed(() => getVideoUrl(videoSource.value));

const currentQualityName = computed(() => QUALITY_ALIAS[playerConfig.value.quality] ?? playerConfig.value.quality);

const isVideoStuck = computed(() => isVideoLoadFailed.value || isVideoLoading.value);

const getVideoSource = (target) => {
  if (!target) return {};
  return target.streamerStatus ? target.streamerCdnPullUrl : target.supplierCdnPullUrl;
};

const getVideoUrl = (source) => {
  if (!source) return "";
  const [_, obj] = Object.entries(source).find(([key, value]) => key === playerConfig.value.quality);
  return obj?.hls_url ?? obj?.flv_url ?? "";
};

const loadPlayer = async () => {
  let _mediaType = "";
  let _playerConfig;
  getQualities();
  if (player.value) {
    player.value.destroy();
  }

  if (currentVideoUrl.value.includes(".flv")) {
    _mediaType = "flv";
    _playerConfig = DEFAULT_FLV_CONFIG;
  } else if (currentVideoUrl.value.includes(".m3u8")) {
    _mediaType = "hls";
    _playerConfig = DEFAULT_HLS_CONFIG;
  }

  player.value = new VideoPlayer(
    {
      mediaType: _mediaType,
      url: currentVideoUrl.value,
      // url: "http://localhost:8000/live/test.flv",
      maxLatency: 10,
      ..._playerConfig
    },
    videoRef.value
  );
  await initPlayer(true);
};

const initPlayer = async (play = false) => {
  if (!player.value) return;
  try {
    await player.value.init();
    isPlayerSupported.value = player.value.supportPlayer !== "NONE";
    player.value.on(player.value.Events.CUSTOM_ERROR, handlePlayerErrorDebounce);
    // player.value.on(player.value.Events.AUTO_PLAY_FAILED, handleAutoPlayFailed);
    // emitting when hls.isSupported() is false
    player.value.on(player.value.Events.NATIVE_STREAM_BUFFERING, handleNativeStreamBuffering);
    isVideoLoading.value = true;
    await player.value.load(play);
    isVideoLoading.value = false;
    showLatestScreenCanvas.value = false;
    isLatestScreenRecorded.value = false;
    isErrorCaptured.value = false;
    errorMsg.value = "";
    isVideoLoadFailed.value = false;
  } catch (e) {
    console.error(e);
  }
};

const loadDanmu = async () => {
  if (danmu.value) return;
  if (!danmuJs.value) {
    const _danmu = (await import("danmu.js")).default;
    danmuJs.value = _danmu;
  }
  if (danmuRef.value) {
    danmu.value = new danmuJs.value({
      ...DEFAULT_DANMU_CONFIG,
      container: danmuRef.value
    });
  }
};

const loadPlayerConfig = () => {
  if (isPlayerConfigLoaded.value) return;
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
        // case "volume":
        //   videoRef.value.volume = value / 100;
        //   playerConfig.value[key] = value;
        //   break;
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
    isPlayerConfigLoaded.value = true;
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

const toggleMute = () => {
  changePlayerConfig("muted", !playerConfig.value.muted);
  if (videoRef.value) {
    videoRef.value.muted = playerConfig.value.muted;
  }
};

const handlePauseChange = (value) => {
  if (!player.value) return;
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

const showChannelChange = () => {
  $q.bottomSheet({
    actions: qualities.value.map((q) => ({
      label: q.name,
      id: q.value,
      icon: q.name === currentQualityName.value ? "check" : ""
    }))
  })
    .onOk((action) => {
      handleQualityChange(action.id);
    })
    .onCancel(() => {
      console.log("Selection cancelled");
    })
    .onDismiss(() => {
      console.log("Bottom sheet closed");
    });
};

const isAppleDevice =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Macintosh") && "ontouchend" in document);

const handleFullScreenChange = (value) => {
  changePlayerConfig("isFullScreen", value);
  const video = videoRef.value;
  emit("landscape-change", value);
  videoRef.value.focus();
  if (value) {
    if (isAppleDevice) {
      if (video && video.webkitSetPresentationMode) {
        video.webkitSetPresentationMode("fullscreen");
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
    if (isAppleDevice && video.webkitSetPresentationMode) {
      video.webkitSetPresentationMode("inline");
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        screen.orientation?.lock?.("portrait").catch((err) => {
          console.warn("Failed to lock orientation to portrait:", err);
        });
      }
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
  if (playerConfig.value.isPause) {
    changePlayerConfig("isPause", false);
  }
  isLatestScreenRecorded.value = false;
  isVideoLoading.value = false;
  isVideoLoadFailed.value = false;
};

const handlePlayerError = (data) => {
  // TODO: why only h5 trigger this error
  if (data.detail.details === "bufferSeekOverHole") return;
  console.error(data.detail);
  errorMsg.value = JSON.stringify(data.detail);
  data.detail.fetal && (isErrorCaptured.value = true);
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
    ctx.drawImage(videoRef.value, 0, 0, videoWidth, videoHeight, offsetX, offsetY, drawWidth, drawHeight);
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

const handlePlayerErrorDebounce = useDebounceFn(handlePlayerError, ERROR_HANDLER_DEBOUNCE_TIME);

const handleNativeStreamBuffering = () => {
  isVideoLoading.value = true;
};

const handleAutoPlayFailed = () => {
  showUnmuteMask.value = true;
  videoRef.value.muted = true;
  player.value.play();
};

const handleQualityChange = async (level) => {
  const _level = videoSource.value[level] ? level : DEFAULT_QUALITY;
  if (_level === playerConfig.value.quality) return;
  const videoUrl = videoSource.value[_level]?.hls_url ?? videoSource.value[_level]?.flv_url;
  changePlayerConfig("quality", _level);
  // player.value.setQualityLevel(index);
  player.value.changeSource(videoUrl);
  await initPlayer(true);
};

const getQualities = () => {
  if (!videoSource.value) return;
  const result = Object.entries(videoSource.value).map(([level, value]) => ({
    value: level,
    name: QUALITY_ALIAS[level] ?? level,
    url: value.hls_url ?? value.flv_url
  }));

  qualities.value = result;
};

const handleUnmuteClick = () => {
  if (!videoRef.value) return;
  videoRef.value.muted = false;
  showUnmuteMask.value = false;
};

const loadData = () => {
  if (!livestreamData.value?.liveStatus) return;
  isVideoLoadFailed.value = false;
  Promise.all([loadPlayer(), loadDanmu()]).then(loadPlayerConfig);
};

watch(livestreamData, (val, oldVal) => {
  if (!isActive.value) return;
  const newVideoSource = getVideoSource(val);
  const newVideoUrl = getVideoUrl(newVideoSource);
  const _currentVideoSource = getVideoSource(oldVal);
  const _currentVideoUrl = getVideoUrl(_currentVideoSource);
  if ((newVideoUrl === _currentVideoUrl && player.value) || !newVideoUrl) return;
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

watch(isTyping, () => {
  if (!isTyping.value || !videoRef.value || !isAppleDevice) return;
  // keep inline presentationMode for ios
  if (videoRef.value.webkitSetPresentationMode) {
    videoRef.value.webkitSetPresentationMode("inline");
  }
});

const mediaQuery = window.matchMedia("(orientation: landscape)");

const handleOrientationChange = (e) => {
  if (isTyping.value) return;
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

const handleVideoPresentationChange = () => {
  const mode = videoRef.value.webkitPresentationMode;
  if (mode === "inline") {
    changePlayerConfig("isFullScreen", false);
    changePlayerConfig("isPause", true);
  } else {
    changePlayerConfig("isFullScreen", true);
  }
};

const handleEndFullScreen = () => {
  if (orientationTimer.value) {
    clearInterval(orientationTimer.value);
  }
  if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
    window.flutter_inappwebview.callHandler("FlutterChannel", "LH_FLUTTER");
  }
  const checkOrientationManually = () => {
    const _isLandscape = window.matchMedia("(orientation: landscape)").matches;
    emit("landscape-change", _isLandscape);
  };
  orientationTimer.value = setInterval(checkOrientationManually, 300);
};

onActivated(() => {
  // Promise.all([loadPlayer(), loadDanmu()]).then(() => {
  //   loadPlayerConfig();
  // });
  mediaQuery.addEventListener("change", handleOrientationChange);
  // Run it once on mount
  handleOrientationChange(mediaQuery);
  // player.value.play();
  isActive.value = true;
  if (videoRef.value) {
    videoRef.value.addEventListener("webkitpresentationmodechanged", handleVideoPresentationChange);
  }
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleOrientationChange);
  player.value?.destroy();
  if (orientationTimer.value) {
    clearInterval(orientationTimer.value);
  }
});

onDeactivated(() => {
  mediaQuery.removeEventListener("change", handleOrientationChange);
  player.value?.destroy();
  player.value = null;
  isPlayerSupported.value = true;
  showUnmuteMask.value = true;
  videoRef.value.muted = true;
  isActive.value = false;
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
  if (videoRef.value) {
    videoRef.value.removeEventListener("webkitpresentationmodechanged", handleVideoPresentationChange);
  }
});

const copyMessage = () => {
  let copyText = errorMsg.value;
  // Create a temporary textarea element
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);

  notify({
    message: "错误讯息已复制，请联系技术",
    type: "info"
  });
};

const backToPrev = () => {
  if (playerConfig.value.isFullScreen) {
    handleFullScreenChange(false);
  } else {
    if (extensionState.value) {
      // extensionToken = localStorage.getItem("TOKEN");
      router.push({
        path: `/livestreampage`,
        query: { token: extensionToken.value }
      });
      // router.go(-1);
    } else {
      router.push(`/livestream`);
    }
  }
};

const handleShareClick = () => {
  handleFullScreenChange(false);
  emit("share-click");
};
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
    z-index: 1;

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

  .btn {
    background-color: transparent;
    border: none;
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
  justify-content: space-between;
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

  .share-icon {
    width: 24px;
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
</style>

<style lang="scss" scoped>
.landscape {
  &.livestream-video-wrapper {
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

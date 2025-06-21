<template>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @click="handlePauseChange(!playerConfig.isPause)"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
  >
    <template v-if="isPlayerSupported">
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
          <button
            class="livestream-video-controller-pause-btn btn"
            :class="{ disabled: isVideoStuck }"
            :title="playerConfig.isPause ? '播放' : '暂停'"
            @click="handlePauseChange(!playerConfig.isPause)"
          >
            <img v-if="playerConfig.isPause" src="@/assets/home/livestream/icon-play.png" />
            <img v-else src="@/assets/home/livestream/icon-pause.png" />
          </button>
          <div class="livestream-video-controller-volume-group">
            <button
              class="livestream-video-controller-volume-btn btn"
              title="音量"
              @click="handleVolumeChange(playerConfig.volume > 0 ? 0 : playerConfig.latestVolume)"
            >
              <img v-if="playerConfig.volume === 0" src="@/assets/home/livestream/icon-volume-off.png" />
              <img v-else src="@/assets/home/livestream/icon-volume.png" />
            </button>
            <el-slider
              class="livestream-video-controller-volume-slider"
              v-model="playerConfig.volume"
              :min="0"
              :max="100"
              :step="1"
              :show-tooltip="false"
              @input="handleVolumeChange"
            />
          </div>
        </div>

        <div class="livestream-video-controller-group">
          <!-- <el-popover
            ref="channelPopperRef"
            popper-class="livestream-video-controller-popover channel"
            placement="top"
            trigger="click"
            :offset="12"
            width="max-content"
            :show-arrow="false"
            :teleported="false"
          >
            <template #reference>
              <button class="livestream-video-controller-channel-btn btn" title="线路选择">
                {{ currentChannel.name }}
              </button>
            </template>
            <div class="livestream-video-controller-list">
              <div
                v-for="(channel, index) in channels"
                :key="index"
                class="livestream-video-controller-item"
                :class="{ selected: playerConfig.channel === index }"
              >
                <button class="livestream-video-controller-item-btn btn" @click="handleChannelChange(index)">
                  {{ channel.name }}
                </button>
              </div>
            </div>
          </el-popover> -->
          <el-popover
            ref="qualityPopperRef"
            popper-class="livestream-video-controller-popover quality"
            placement="top"
            trigger="click"
            :offset="12"
            width="max-content"
            :show-arrow="false"
            :teleported="false"
          >
            <template #reference>
              <button class="livestream-video-controller-quality-btn btn" title="画质选择">
                <img src="@/assets/home/livestream/icon-setting.png" />
              </button>
            </template>
            <div class="livestream-video-controller-list">
              <div
                v-for="(quality, index) in qualities"
                :key="index"
                class="livestream-video-controller-item"
                :class="{ selected: playerConfig.quality === quality.value }"
              >
                <button class="livestream-video-controller-item-btn btn" @click="handleQualityChange(quality.value)">
                  {{ quality.name }}
                </button>
              </div>
            </div>
          </el-popover>
          <button
            class="livestream-video-controller-danmu-btn btn"
            :title="playerConfig.isDanmuClose ? '开启' : '关闭' + '弹幕'"
            @click="handleDanmuChange(!playerConfig.isDanmuClose)"
          >
            <img v-if="playerConfig.isDanmuClose" src="@/assets/home/livestream/icon-danmu-close.png" />
            <img v-else src="@/assets/home/livestream/icon-danmu-open.png" />
          </button>
          <button
            class="livestream-video-controller-fullscreen-btn btn"
            :title="playerConfig.isFullScreen ? '开启' : '退出' + '全屏'"
            @click="handleFullScreenChange(!playerConfig.isFullScreen)"
          >
            <img v-if="playerConfig.isFullScreen" src="@/assets/home/livestream/icon-fullscreen-exit.png" />
            <img v-else src="@/assets/home/livestream/icon-fullscreen.png" />
          </button>
        </div>
      </div>
      <template v-if="isVideoStuck">
        <div v-if="isVideoLoadFailed" class="livestream-video-mask" @click.stop>
          <button class="btn" @click="loadData">
            <img src="@/assets/home/livestream/icon-reload.png" />
          </button>
          <span>点击重新加载视频</span>
          <p class="livestream-video-mask-text-content">
            视频加载失败
            <template v-if="env !== 'production'">
              <span>错误讯息：{{ videoLoadFailedReason }}</span>
            </template>
          </p>
        </div>
        <div v-if="isVideoLoading" class="livestream-video-mask" @click.stop>
          <div class="loader" />
          <span>正在加载视频...</span>
        </div>
      </template>
      <template v-else>
        <div v-if="showUnmuteMask" class="livestream-video-mask" @click.stop="handleUnmuteClick">
          <button class="btn">
            <img src="@/assets/home/livestream/icon-volume-off.png" />
          </button>
          <span>点击取消静音</span>
        </div>
        <div v-if="!isLivestreaming" class="livestream-video-mask" @click.stop>
          <span>直播尚未开始</span>
        </div>
      </template>
    </template>
    <div v-else class="livestream-unsupported">不支援的浏览器</div>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import { VideoPlayer } from "@/utils/videoPlayer";
import { useDebounceFn } from "@vueuse/core";
import { uiStore } from "@/store/ui";

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
  fontSize: "13.32px",
  lineHeight: "15.85px",
  borderRadius: "37.74px",
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

const props = defineProps(["danmuList", "channels", "livestreamData", "isLivestreaming"]);
const { danmuList, channels, livestreamData, isLivestreaming } = toRefs(props);

const ui = uiStore();

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
const isPlayerSupported = ref(true);
const isPlayerConfigLoaded = ref(false);
const isVideoLoadFailed = ref(false);
const isVideoLoading = ref(false);
const videoLoadFailedReason = ref("");
const showUnmuteMask = ref(false);
const showLatestScreenCanvas = ref(false);
const isLatestScreenRecorded = ref(false);
const videoLoadErrorStartTime = ref(null);
/** @type {import("vue").Ref< VideoPlayer | null>}*/
const player = ref(null);
const danmu = ref(null);
const qualities = ref([]);
const playerConfig = ref({
  isPause: false,
  volume: 50,
  isFullScreen: false,
  isDanmuClose: false,
  quality: DEFAULT_QUALITY,
  channel: 0,
  latestVolume: 50
});

const videoSource = computed(() => getVideoSource(livestreamData.value));

const currentVideoUrl = computed(() => getVideoUrl(videoSource.value));

const disableVideoController = computed(() => showUnmuteMask.value || !isLivestreaming.value);

const isVideoStuck = computed(() => isVideoLoadFailed.value || isVideoLoading.value);

// const currentChannel = computed(() => {
//   if (!channels.value.length) return {};
//   return channels.value[playerConfig.value.channel];
// });

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
    player.value.on(player.value.Events.STREAM_AVAILABLE, handlePlayerCanPlay);
    player.value.on(player.value.Events.AUTO_PLAY_FAILED, handleAutoPlayFailed);
    // emitting when hls.isSupported() is false
    player.value.on(player.value.Events.NATIVE_STREAM_BUFFERING, handleNativeStreamBuffering);
    isVideoLoading.value = true;
    await player.value.load(play);
    isVideoLoading.value = false;
    showLatestScreenCanvas.value = false;
    isLatestScreenRecorded.value = false;
  } catch (e) {}
};

const loadDanmu = async () => {
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
        case "volume":
          videoRef.value.volume = value / 100;
          playerConfig.value[key] = value;
          break;
        case "latestVolume":
          playerConfig.value[key] = value;
          break;
        case "isDanmuClose":
          handleDanmuChange(value);
          break;
        case "quality":
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

const handleFullScreenChange = (value) => {
  changePlayerConfig("isFullScreen", value);
  if (playerConfig.value.isFullScreen) {
    videoWrapperRef.value.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const handleVolumeChange = (value) => {
  if (value > 0) {
    changePlayerConfig("latestVolume", value);
  }
  changePlayerConfig("volume", parseInt(value));
  videoRef.value.volume = value / 100;
};

const handleWrapperMouseEnter = () => {
  if (disableVideoController.value) return;
  showPlayerController.value = true;
  videoWrapperMouseLeaveTimer.value && clearTimeout(videoWrapperMouseLeaveTimer.value);
};

const handleWrapperMouseLeave = () => {
  if (disableVideoController.value) return;
  videoWrapperMouseLeaveTimer.value = setTimeout(() => {
    showPlayerController.value = false;
    channelPopperRef.value?.hide();
    qualityPopperRef.value?.hide();
  }, 1500);
};

const handlePlayerProgress = () => {
  if (!videoRef.value || videoRef.value.paused) return;
  player.value.syncLive();
};

const handlePlayerCanPlay = () => {
  if (playerConfig.value.isPause) {
    changePlayerConfig("isPause", false);
  }
  isVideoLoading.value = false;
  isVideoLoadFailed.value = false;
  isLatestScreenRecorded.value = false;
  videoLoadErrorStartTime.value = null;
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
    ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
    isLatestScreenRecorded.value = true;
    showLatestScreenCanvas.value = true;
  }
  if (Date.now() - videoLoadErrorStartTime.value > MAXIMUM_VIDEO_RELOAD_TIMEOUT) {
    videoLoadErrorStartTime.value = null;
    isVideoLoadFailed.value = true;
    videoLoadFailedReason.value = data.detail;
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

// const handleChannelChange = async (index) => {
//   qualities.value = [DEFAULT_QUALITY];
//   changePlayerConfig("quality", -1);
//   changePlayerConfig("channel", index);
//   player.value.changeSource(currentChannel.value.url);
//   await initPlayer();
// };

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
  if (!videoRef.value || ui.isGameModalOpened) return;
  videoRef.value.muted = false;
  showUnmuteMask.value = false;
};

const loadData = () => {
  if (!isLivestreaming.value) return;
  isVideoLoadFailed.value = false;
  videoLoadFailedReason.value = "";
  Promise.all([loadPlayer(), loadDanmu()]).then(loadPlayerConfig);
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

watch(
  livestreamData,
  async (val, oldVal) => {
    if (oldVal) {
      const newVideoSource = getVideoSource(val);
      const newVideoUrl = getVideoUrl(newVideoSource);
      const _currentVideoSource = getVideoSource(oldVal);
      const _currentVideoUrl = getVideoUrl(_currentVideoSource);
      if (newVideoUrl === _currentVideoUrl) return;
      if (danmu.value) {
        danmu.value.stop();
      }
    }
    await nextTick();
    loadData();
  },
  { immediate: true }
);

watch(
  () => ui.isGameModalOpened,
  (val) => {
    if (!videoRef.value) return;
    if (val) {
      videoRef.value.muted = true;
    } else {
      if (showUnmuteMask.value) return;
      videoRef.value.muted = false;
    }
  }
);

onMounted(() => {
  // loadData();
  canvasRef.value.width = videoRef.value.clientWidth;
  canvasRef.value.height = videoRef.value.clientHeight;
  document.addEventListener("click", handleUnmuteClick);
});

onUnmounted(() => {
  player.value && player.value.destroy();
  player.value = null;
  danmu.value && danmu.value.stop();
  document.removeEventListener("click", handleUnmuteClick);
});
</script>
<style lang="scss" scoped>
.livestream-video-wrapper {
  position: relative;
  border-radius: 15.1px;
  overflow: hidden;
  aspect-ratio: 16 / 9;

  .livestream-video-danmu {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .livestream-unsupported {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #fff;
    font-size: 24px;
  }

  .livestream-video-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 16px 14px;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s;
    z-index: 1;

    &.show {
      transform: translateY(0);
      opacity: 1;
    }

    .livestream-video-controller-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    img {
      max-width: 24px;
    }

    .livestream-video-controller-volume-group {
      display: flex;
      align-items: center;
      gap: 10px;

      .livestream-video-controller-volume-slider {
        width: 10vw;
        max-width: 100px;
      }
    }

    .livestream-video-controller-channel-btn {
      border-radius: 15px;
      border: 1px solid #fff;
      font-size: 12px;
      color: #fff;
    }
  }

  .btn {
    background-color: transparent;
    -webkit-user-drag: none;
    &.disabled {
      pointer-events: none;
      filter: grayscale(0.5);
      opacity: 0.5;
    }
  }

  .livestream-video {
    object-fit: contain;
    width: 100%;
    height: 100%;
    background: #000;
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
</style>
<style lang="scss">
.el-popover.el-popper.livestream-video-controller-popover {
  background-color: #4f4f4fb3 !important;
  border: none !important;
  min-width: unset;
  padding: 8px 0;

  .livestream-video-controller-list {
    .livestream-video-controller-item {
      padding: 0 8px;
      &.selected {
        background-color: #12a3ff;

        .livestream-video-controller-item-btn:hover {
          color: #fff;
        }
      }

      .livestream-video-controller-item-btn {
        background-color: transparent;
        font-size: 12px;
        color: #fff;

        &:hover {
          color: #12a3ff;
        }
      }
    }
  }
}
</style>

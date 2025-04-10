<template>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @click="handlePauseChange(!playerConfig.isPause)"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
  >
    <template v-if="isPlayerSupported">
      <video ref="videoRef" class="livestream-video" crossorigin="anonymous" @progress="handlePlayerProgress" />
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
            :title="playerConfig.isPause ? '播放' : '暂停'"
            @click="handlePauseChange(!playerConfig.isPause)"
          >
            <img v-if="playerConfig.isPause" src="@/assets/home/livestream/icon-play.png" />
            <img v-else src="@/assets/home/livestream/icon-pause.png" />
          </button>
          <div class="livestream-video-controller-volume-group">
            <button class="livestream-video-controller-volume-btn btn" title="音量">
              <img src="@/assets/home/livestream/icon-volume.png" />
            </button>
            <input
              class=""
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
    </template>
    <div v-else class="livestream-unsupported">不支援的浏览器</div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import { VideoPlayer } from "@/utils/videoPlayer";

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

const DEFAULT_DANMU_CONFIG = {
  area: {
    start: 0.05,
    end: 1
  },
  channelSize: 30
};

const DANMU_STYLE = {
  color: "#fff",
  fontSize: "11.32px",
  lineHeight: "15.85px",
  borderRadius: "37.74px",
  padding: "6px 10px",
  backgroundColor: "#00000033"
};

const DANMU_CONFIG = {
  duration: 5000,
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
const videoWrapperMouseLeaveTimer = ref(null);
const showPlayerController = ref(false);
const isPlayerSupported = ref(true);
const isPlayerConfigLoaded = ref(false);
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
  channel: 0
});

const videoSource = computed(() => {
  if (!livestreamData.value) return {};
  // TODO: wait for api
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

// const currentChannel = computed(() => {
//   if (!channels.value.length) return {};
//   return channels.value[playerConfig.value.channel];
// });

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
  await initPlayer(true);
};

const initPlayer = async (play = false) => {
  if (!player.value) return;
  await player.value.init();
  isPlayerSupported.value = player.value.SupportPlayer !== "NONE";
  player.value.on(player.value.Events.ERROR, handlePlayerError);
  await player.value.load(play);
  // if (player.value.qualitySupported) getQualities();
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
    channelPopperRef.value?.hide();
    qualityPopperRef.value?.hide();
  }, 1500);
};

const handlePlayerProgress = () => {
  if (!videoRef.value || videoRef.value.paused) return;
  player.value.syncLive();
};

const handlePlayerError = (event, data) => {
  console.log(e);
  if (!playerConfig.value.isPause) {
    changePlayerConfig("isPause", true);
  }
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

const pause = () => {
  handlePauseChange(true);
};

const loadData = () => Promise.all([loadPlayer(), loadDanmu()]).then(loadPlayerConfig);

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

watch(livestreamData, () => {
  loadData();
});

onMounted(() => {
  // loadData();
});

onUnmounted(() => {
  player.value.destroy();
  danmu.value.stop();
});

defineExpose({
  pause
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

    .btn {
      background-color: transparent;
      -webkit-user-drag: none;
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

    .livestream-video-controller-channel-btn {
      border-radius: 15px;
      border: 1px solid #fff;
      font-size: 12px;
      color: #fff;
    }
  }

  .livestream-video {
    object-fit: contain;
    width: 100%;
    height: 100%;
    background: #000;
  }
}
</style>
<style lang="scss">
.el-popover.el-popper.livestream-video-controller-popover {
  background-color: #0000004d !important;
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

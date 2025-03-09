<template>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @click="handlePauseChange(!playerConfig.isPause)"
    @mouseenter="handleWrapperMouseEnter"
    @mouseleave="handleWrapperMouseLeave"
  >
    <template v-if="isFlvSupported">
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
          <el-popover
            ref="urlPopperRef"
            popper-class="livestream-video-controller-popover url"
            placement="top"
            trigger="click"
            :offset="12"
            width="max-content"
            :show-arrow="false"
            :teleported="false"
          >
            <template #reference>
              <button class="livestream-video-controller-url-btn btn" title="线路选择">
                {{ currentUrl.name }}
              </button>
            </template>
            <div class="livestream-video-controller-list">
              <div
                v-for="(url, index) in urls"
                :key="index"
                class="livestream-video-controller-item"
                :class="{ selected: playerConfig.channel === index }"
              >
                <button class="livestream-video-controller-item-btn btn" @click="handleUrlChange(index)">
                  {{ url.name }}
                </button>
              </div>
            </div>
          </el-popover>
          <el-popover
            ref="urlPopperRef"
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
    <div v-else>不支援的浏览器</div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, toRefs, watch } from "vue";
import { VideoPlayer } from "../../../utils/videoPlayer";

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

const DEFAULT_QUALITY = { value: -1, name: "自动" };

const props = defineProps(["danmuList", "urls"]);
const { danmuList, urls } = toRefs(props);

/**  @type {import("vue").Ref<typeof import("flv.js").default | null>} */
const flv = ref(null);
/**  @type {import("vue").Ref<typeof import("hls.js").default | null>} */
const hls = ref(null);
const danmuJs = ref(null);

/**  @type {import("vue").Ref<HTMLVideoElement | null>} */
const videoRef = ref(null);
const danmuRef = ref(null);
const videoWrapperRef = ref(null);
const urlPopperRef = ref(null);
const videoWrapperMouseLeaveTimer = ref(null);
const showPlayerController = ref(false);
const isFlvSupported = ref(true);
/** @type {import("vue").Ref< VideoPlayer | null>}*/
const player = ref(null);
const danmu = ref(null);
const qualities = ref([DEFAULT_QUALITY]);
const playerConfig = ref({
  isPause: false,
  volume: 50,
  isFullScreen: false,
  isDanmuClose: false,
  quality: -1,
  channel: 0
});

const currentUrl = computed(() => {
  return urls.value[playerConfig.value.channel];
});

const loadFlv = async () => {
  const _flv = (await import("flv.js")).default;
  flv.value = _flv;
  if (flv.value.isSupported() && videoRef.value) {
    player.value = flv.value.createPlayer(
      {
        type: "flv",
        // url: "http://207.148.73.114:8080/live/livestream.flv",
        url: "http://192.168.31.145:8000/live/stream.flv",
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

const loadPlayer = async () => {
  player.value = new VideoPlayer(
    {
      mediaType: "hls",
      // url: "http://192.168.31.145:8000/live/stream.flv",
      url: "http://192.168.31.145:8000/hls/index.m3u8",
      // url: "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8",
      // ...DEFAULT_FLV_CONFIG,
      ...DEFAULT_HLS_CONFIG
    },
    videoRef.value
  );
  await player.value.init();
  player.value.on(player.value.Events.ERROR, handlePlayerError);
  await player.value.load();
  if (player.value.qualitySupported) getQualities();
  // player.value.onManifestParsed(handleManifestParsed);
  player.value.play();
};

// const loadHls = async () => {
//   const _hls = (await import("hls.js")).default;
//   hls.value = _hls;
//   const videoSrc = "http://192.168.31.145:8000/live/stream.m3u8";
//   if(hls.value.isSupported()) {

//   }else if(videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
//     videoRef.value.src = videoSrc
//   }
// }

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
    urlPopperRef.value.hide();
  }, 1500);
};

const handlePlayerProgress = () => {
  // if (!videoRef.value || videoRef.value.paused) return;
  // const bufferedEnd = videoRef.value.buffered.end(0);
  // const delta = bufferedEnd - videoRef.value.currentTime;
  // if (delta > 10 || delta < 0) {
  //   videoRef.value.currentTime = bufferedEnd - 0.5;
  // }
};

const handlePlayerError = (event, data) => {
  console.log(e);
  if (!playerConfig.value.isPause) {
    changePlayerConfig("isPause", true);
  }
};

const handleUrlChange = (index) => {
  changePlayerConfig("channel", index);
  // player.value.changeUrl(urls.value[index].url);
};

const handleQualityChange = (index) => {
  changePlayerConfig("quality", index);
  player.value.setQualityLevel(index);
};

const getQualities = () => {
  console.log(player.value.levels);
  const result = player.value.levels.map((level, index) => ({
    value: index,
    name: `${level.height}p`
  }));
  qualities.value.push(...result);
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
  Promise.all([loadPlayer(), loadDanmu()]).then(loadPlayerConfig);
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

    .livestream-video-controller-url-btn {
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

<template>
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
import { onMounted, ref, toRefs, watch } from "vue";

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
  Promise.all([loadFlv(), loadDanmu()]).then(loadPlayerConfig);
});
</script>
<style lang="scss" scoped>
.livestream-video-wrapper {
  position: relative;
  border-radius: 15.1px;
  overflow: hidden;

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
  }

  .livestream-video {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}
</style>

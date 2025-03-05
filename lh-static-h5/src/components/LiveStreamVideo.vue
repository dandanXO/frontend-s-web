<template>
  <div
    ref="videoWrapperRef"
    class="livestream-video-wrapper"
    @click="handlePauseClick"
    @touchstart="handleWrapperMouseEnter"
    @touchend="handleWrapperMouseLeave"
  >
    <template v-if="isFlvSupported">
      <video ref="videoRef" class="livestream-video" muted @progress="handlePlayerProgress" />
      <div
        class="livestream-video-controller"
        :class="{
          show: showPlayerController
        }"
        @click.stop
      >
        <q-btn flat class="back-section" to="/livestream">
          <q-icon name="chevron_left" color="white" left size="lg" />
          <div class="item-content">
            <div class="content-title">德国甲级联赛</div>
            <div class="content-desc">沃尔夫斯堡VS库勒沃斯</div>
          </div>
        </q-btn>
        <div class="livestream-video-controller-group">
          <q-btn
            class="livestream-video-controller-pause-btn btn"
            :title="playerConfig.isPause ? '播放' : '暂停'"
            @click="handlePauseClick"
            flat
          >
            <img v-if="playerConfig.isPause" src="../assets/images/livestream/icon-play.png" />
            <img v-else src="../assets/images/livestream/icon-pause.png" />
          </q-btn>
          <div class="livestream-video-controller-volume-group">
            <q-btn class="livestream-video-controller-volume-btn btn" flat title="音量">
              <img src="../assets/images/livestream/icon-volume.png" />
            </q-btn>
            <q-input
              class=""
              type="range"
              min="0"
              max="100"
              step="1"
              :value="playerConfig.volume"
              @input="handleVolumeChange"
              flat
            />
          </div>
        </div>

        <div class="livestream-video-controller-group">
          <q-btn
            class="livestream-video-controller-danmu-btn btn"
            :title="playerConfig.isDanmuClose ? '开启' : '关闭' + '弹幕'"
            @click="handleDanmuClick"
            flat
          >
            <img v-if="playerConfig.isDanmuClose" src="../assets/images/livestream/icon-danmu-close.png" />
            <img v-else src="../assets/images/livestream/icon-danmu-open.png" />
          </q-btn>
          <q-btn
            class="livestream-video-controller-fullscreen-btn btn"
            :title="playerConfig.isFullScreen ? '开启' : '退出' + '全屏'"
            @click="handleFullScreenClick"
            flat
          >
            <img v-if="playerConfig.isFullScreen" src="../assets/images/livestream/icon-fullscreen-exit.png" />
            <img v-else src="../assets/images/livestream/icon-fullscreen.png" />
          </q-btn>
        </div>
      </div>
      <div ref="danmuRef" class="livestream-video-danmu" />
    </template>
    <div v-else>不支援的浏览器</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const videoRef = ref(null);
const danmuRef = ref(null);
const videoWrapperRef = ref(null);
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

const handlePauseClick = () => {
  playerConfig.value.isPause = !playerConfig.value.isPause;
  playerConfig.value.isPause ? player.value.pause() : player.value.play();
};

const handleDanmuClick = () => {
  playerConfig.value.isDanmuClose = !playerConfig.value.isDanmuClose;
  playerConfig.value.isDanmuClose ? danmu.value.stop() : danmu.value.start();
};

const handleFullScreenClick = async () => {
  // Toggle fullscreen state in playerConfig
  playerConfig.value.isFullScreen = !playerConfig.value.isFullScreen;

  if (playerConfig.value.isFullScreen) {
    if (videoWrapperRef.value.requestFullscreen) {
      await videoWrapperRef.value.requestFullscreen();
    } else if (videoWrapperRef.value.webkitRequestFullscreen) {
      await videoWrapperRef.value.webkitRequestFullscreen();
    } else if (videoWrapperRef.value.mozRequestFullScreen) {
      await videoWrapperRef.value.mozRequestFullScreen();
    } else if (videoWrapperRef.value.msRequestFullscreen) {
      await videoWrapperRef.value.msRequestFullscreen();
    }

    // Rotate to landscape
    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock("landscape");
      } catch (err) {
        console.error("Screen orientation lock failed:", err);
      }
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }

    // Unlock the screen orientation
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }
};

const handleVolumeChange = (value) => {
  videoRef.value.volume = value / 100;
};

const handleWrapperMouseEnter = () => {
  // showPlayerController.value = true;
  setTimeout(() => (showPlayerController.value = true), 500);
};

const handleWrapperMouseLeave = () => {
  setTimeout(() => (showPlayerController.value = false), 2500);
};

onMounted(async () => {
  const flv = (await import("flv.js")).default;
  isFlvSupported.value = flv.isSupported();
  if (isFlvSupported.value && videoRef.value) {
    player.value = flv.createPlayer({
      // type: "flv",
      // url: "http://207.148.73.114:8080/live/livestream.flv",
      type: "mp4",
      url: "http://www.html5videoplayer.net/videos/toystory.mp4",
      isLive: true
    });
    player.value.attachMediaElement(videoRef.value);
    player.value.load();
    player.value.play();
  }
});
</script>

<style lang="scss" scoped>
.livestream-video-wrapper {
  position: relative;
  overflow: hidden;
  height: 56.25vw;

  .livestream-video-danmu {
    position: absolute;
    z-index: 1000;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .livestream-video-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    z-index: 1001;
    bottom: 0;
    width: 100%;
    padding: 0 8px 8px;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s;
    pointer-events: none;

    &:before {
      // background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent 80%, rgba(0, 0, 0, 0.2));
      content: "";
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 100%);
      width: 100%;
      height: 20vw;
      position: absolute;
      top: 0;
      left: 0;
    }

    &.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    .back-section {
      position: absolute;
      top: calc(-56.25vw + 76px);
      left: 0;
      text-align: left;

      &:before {
        content: "";
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 100%);
        width: 100vw;
        height: 20vw;
        position: absolute;
        top: -20px;
        left: 0;
        overflow: hidden;
      }

      .item-content {
        text-align: left;
        .content-title {
          font-size: 18px;
          font-weight: bold;
          color: #fff;
        }
        .content-desc {
          color: #fff;
        }
      }
    }

    .livestream-video-controller-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // gap: 4px;
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
    object-fit: fill;
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :style="{ width: '80vw' }"
    :maximizable="true"
    :closable="true"
    @hide="onHide"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <template #header>
      <div class="dialog-header">
        <h3>{{ streamTitle }}</h3>
      </div>
    </template>
    <div class="video-container">
      <video
        ref="videoPlayer"
        id="streamPlayer"
        class="video-js vjs-big-play-centered"
        controls
        preload="auto"
        width="100%"
        height="auto"
        data-setup="{}"
      >
      </video>
    </div>
    <template #footer>
      <div class="quality-selector">
        <Button
          v-for="quality in availableQualities"
          :key="quality.label"
          :label="quality.label"
          :severity="currentQuality === quality.value ? 'success' : 'secondary'"
          :size="'small'"
          class="mr-2"
          @click="changeQuality(quality.value)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  streamData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:visible'])

const videoPlayer = ref(null)
const player = ref(null)
const streamTitle = ref('')
const currentQuality = ref('p1080')
const isLoading = ref(false)
const isInitialized = ref(false)
const availableQualities = ref([
  { label: '1080P', value: 'p1080' },
  { label: '720P', value: 'p720' },
  { label: '540P', value: 'p540' },
])

// 初始化播放器
const initializePlayer = () => {
  try {
    if (player.value) {
      player.value.dispose()
    }

    const options = {
      controls: true,
      fluid: true,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      },
    }

    player.value = videojs(videoPlayer.value, options)

    // 添加事件監聽
    player.value.on('error', (error) => {
      console.error('播放器錯誤:', error)
      isLoading.value = false
    })

    player.value.on('waiting', () => {
      isLoading.value = true
    })

    player.value.on('playing', () => {
      isLoading.value = false
    })

    isInitialized.value = true
  } catch (error) {
    console.error('初始化播放器失敗:', error)
    isInitialized.value = false
  }
}

// 開始播放指定質量的流
const startStreaming = async (quality = 'p1080') => {
  if (!props.streamData || !player.value || isLoading.value) return

  const playUrl = props.streamData.cdnPlayUrlsHls?.[quality]?.playUrl
  if (!playUrl) {
    console.error('無效的播放地址')
    return
  }

  try {
    isLoading.value = true

    // 重置播放器狀態
    player.value.pause()
    player.value.reset()

    // 設置新的播放源
    await new Promise((resolve) => {
      player.value.src({
        src: playUrl,
        type: 'application/x-mpegURL',
        withCredentials: false,
      })
      
      const handleCanPlay = () => {
        player.value.off('canplay', handleCanPlay)
        resolve()
      }
      
      player.value.on('canplay', handleCanPlay)
    })

    // 開始播放
    if (props.visible && isInitialized.value) {
      await player.value.play()
    }
  } catch (error) {
    console.error('播放錯誤:', error)
    isLoading.value = false
  }
}

// 切換視頻質量
const changeQuality = (quality) => {
  if (isLoading.value) return
  currentQuality.value = quality
  startStreaming(quality)
}

// 監聽對話框的可見性變化
watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      streamTitle.value = props.streamData.title || '直播'
      await nextTick()
      
      if (!isInitialized.value) {
        initializePlayer()
      }
      
      if (isInitialized.value) {
        await startStreaming(currentQuality.value)
      }
    } else {
      if (player.value) {
        player.value.pause()
        isLoading.value = false
      }
    }
  }
)

// 關閉對話框時的處理
const onHide = () => {
  if (player.value) {
    player.value.pause()
    player.value.reset()
    isLoading.value = false
  }
  emit('update:visible', false)
}

// 組件卸載時清理播放器
onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
    isInitialized.value = false
  }
})
</script>

<style scoped>
.video-container {
  width: 100%;
  background-color: #000;
  aspect-ratio: 16/9;
  position: relative;
}

.dialog-header {
  padding: 0 1rem;
}

.dialog-header h3 {
  margin: 0;
}

.quality-selector {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
  background-color: #000;
}

:deep(.vjs-big-play-centered .vjs-big-play-button) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.video-js) {
  width: 100%;
  height: 100%;
}
</style> 
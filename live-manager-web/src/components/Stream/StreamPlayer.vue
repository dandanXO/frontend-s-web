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
import 'video.js/dist/video-js.min.css'
import '@videojs/http-streaming'
import flvjs from 'flv.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  stream: {
    type: Object,
    default: () => ({
      title: '',
      playUrls: {
        hls: '',
        flv: ''
      }
    })
  }
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
  { label: 'original', value: 'originalUrl' }
])

// 註冊 FLV 插件
const registerFlvPlugin = () => {
  const Plugin = videojs.getPlugin('plugin');
  class FlvJsPlugin extends Plugin {
    constructor(player, options) {
      super(player, options);
      this.flvPlayer = null;
      this.player = player;
      
      player.on('dispose', () => {
        if (this.flvPlayer) {
          this.flvPlayer.destroy();
        }
      });
    }

    src(source) {
      if (this.flvPlayer) {
        this.flvPlayer.destroy();
      }

      if (source.type === 'video/x-flv') {
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: source.src,
          isLive: true,
          hasAudio: true,
          hasVideo: true,
        });
        this.flvPlayer.attachMediaElement(this.player.tech().el());
        this.flvPlayer.load();
      }
    }
  }
  videojs.registerPlugin('flvjs', FlvJsPlugin);
}

// 初始化播放器
const initializePlayer = () => {
  if (videoPlayer.value && !player.value) {
    registerFlvPlugin();
    const playUrl = props.stream?.cdnPlayUrlsHls[currentQuality.value].playUrl;

    console.log('播放地址:', playUrl)
    const options = {
      autoplay: false,
      controls: true,
      preload: 'auto',
      fluid: true,
      aspectRatio: '16:9',
      techOrder: ['html5'],
      plugins: {
        flvjs: {
          mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false
          }
        }
      },
      sources: [{
        src: playUrl || '',
        type: 'video/x-flv'
      }]
    }

    player.value = videojs(videoPlayer.value, options)
    player.value.flvjs(); // 初始化 FLV 插件
    isInitialized.value = true

    // 添加事件監聽
    player.value.on('waiting', () => {
      isLoading.value = true
    })

    player.value.on('playing', () => {
      isLoading.value = false
    })

    player.value.on('error', (error) => {
      console.error('播放器錯誤:', error)
      isLoading.value = false
    })
  }
}

// 開始播放指定質量的流
const startStreaming = async () => {
  if (!player.value || !props.stream) return

  try {
    isLoading.value = true
    await player.value.pause()

    const currentSource = props.stream?.cdnPlayUrlsFlv[currentQuality.value].playUrl;

    console.log('當前播放地址:', currentSource)
    if (!currentSource) {
      throw new Error('無效的播放地址');
    }

    player.value.src({
      src: currentSource,
      type: currentQuality.value === 'flv' ? 'video/x-flv' : 'application/x-mpegURL'
    })

    await player.value.load()
    await player.value.play()
  } catch (error) {
    console.error('播放錯誤:', error)
    console.log('當前播放地址:', currentSource)
  } finally {
    isLoading.value = false
  }
}

// 切換視頻質量
const changeQuality = (quality) => {
  if (isLoading.value) return
  currentQuality.value = quality

  const src = quality === 'flv' 
    ? props.stream?.cdnPlayUrlsFlv[currentQuality.value].playUrl 
    : props.stream?.cdnPlayUrlsHls[currentQuality.value].playUrl;
  
  if (!src) {
    console.error('無效的播放地址');
    return;
  }

  if (player.value) {
    player.value.src({
      src: src,
      type: quality === 'flv' ? 'video/x-flv' : 'application/x-mpegURL'
    });
  }
  startStreaming()
}

// 監聽對話框的可見性變化
watch(() => props.visible, async (newValue) => {
  if (newValue) {
    streamTitle.value = props.stream?.title || '直播'
    await nextTick()
    
    if (!isInitialized.value) {
      initializePlayer()
    }
    
    if (isInitialized.value) {
      await startStreaming()
    }
  } else {
    if (player.value) {
      player.value.pause()
      isLoading.value = false
    }
  }
})

// 監聽串流數據變化
watch(() => props.stream, async () => {
  if (props.visible && props.stream?.playUrls) {
    await startStreaming()
  }
})

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
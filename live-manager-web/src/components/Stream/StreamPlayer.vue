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
        <h3>{{ streamTitle }} - {{ formatQuality(currentQuality) }}</h3>
      </div>
    </template>
    <div class="stream-info">
      <div class="info-item">
        <span class="label">主播:</span>
        <span class="value">{{ stream.streamerName }}</span>
      </div>
      <div class="info-item">
        <span class="label">供應商串流ID:</span>
        <span class="value">{{ stream.supplierStreamId }}</span>
      </div>
      <div class="info-item">
        <span class="label">主播串流ID:</span>
        <span class="value">{{ stream.streamerStreamId }}</span>
      </div>
      <div class="info-item">
        <span class="label">當前質量:</span>
        <span class="value">{{ formatQuality(currentQuality) }}</span>
      </div>
      <div class="info-item">
        <span class="label">供應商播放鏈結:</span>
        <div class="url-container">
          <span class="url-text">{{ getCurrentPlayUrl() }}</span>
          <Button 
            icon="pi pi-copy" 
            severity="secondary" 
            text 
            @click="copyUrl(getCurrentPlayUrl())"
            v-tooltip.top="'複製鏈結'"
          />
        </div>
      </div>
      <div class="info-item">
        <span class="label">主播播放鏈結:</span>
        <div class="url-container">
          <span class="url-text">{{ getStreamerPlayUrl() }}</span>
          <Button 
            icon="pi pi-copy" 
            severity="secondary" 
            text 
            @click="copyUrl(getStreamerPlayUrl())"
            v-tooltip.top="'複製鏈結'"
          />
        </div>
      </div>
    </div>
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
import { useToast } from 'primevue/usetoast'

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
  { label: 'original', value: 'original' }
])

// 初始化 toast 服務
const toast = useToast()

// 註冊 FLV 插件
const registerFlvPlugin = () => {
  if (!videojs.getPlugin('flvjs')) {
    const Plugin = videojs.getPlugin('plugin');
    
    class FlvJsPlugin extends Plugin {
      constructor(player, options) {
        super(player, options);
        this.flvPlayer = null;
        this.player = player;
        
        player.on('dispose', () => {
          if (this.flvPlayer) {
            this.flvPlayer.destroy();
            this.flvPlayer = null;
          }
        });
      }

      src(source) {
        // 先銷毀現有的 flv 播放器
        if (this.flvPlayer) {
          this.flvPlayer.destroy();
          this.flvPlayer = null;
        }

        if (source.type === 'video/x-flv' || source.src.indexOf('.flv') > -1) {
          if (flvjs.isSupported()) {
            const flvOptions = {
              type: 'flv',
              url: source.src,
              isLive: true,
              hasAudio: true,
              hasVideo: true,
              cors: true,
              enableStashBuffer: false,
              stashInitialSize: 128,
              enableWorker: true,
              lazyLoad: false
            };

            console.log('創建 FLV 播放器，配置:', flvOptions);

            this.flvPlayer = flvjs.createPlayer(flvOptions);
            const mediaElement = this.player.tech().el();
            
            this.flvPlayer.attachMediaElement(mediaElement);
            this.flvPlayer.load();

            // 添加 FLV 播放器事件監聽
            this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
              console.error('FLV 播放器錯誤:', errorType, errorDetail);
            });

            this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
              console.log('FLV 載入完成');
            });

            return true;
          }
        }
        return false;
      }

      dispose() {
        if (this.flvPlayer) {
          this.flvPlayer.destroy();
          this.flvPlayer = null;
        }
      }
    }
    
    videojs.registerPlugin('flvjs', FlvJsPlugin);
  }
}

// 初始化播放器
const initializePlayer = async () => {
  if (videoPlayer.value && !player.value) {
    try {
      registerFlvPlugin();
      
      const playUrl = props.stream?.supplierCdnPullUrl[currentQuality.value]?.flvUrl;
      console.log('初始播放地址:', playUrl);

      const options = {
        autoplay: false,
        controls: true,
        preload: 'auto',
        fluid: true,
        aspectRatio: '16:9',
        techOrder: ['html5', 'flvjs'],
        html5: {
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
          hls: {
            overrideNative: true
          }
        },
        flvjs: {
          mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false
          }
        }
      };

      player.value = videojs(videoPlayer.value, options);
      
      // 等待播放器準備完成
      await new Promise(resolve => {
        player.value.ready(() => {
          resolve();
        });
      });
      
      // 添加事件監聽
      player.value.on('waiting', () => {
        isLoading.value = true;
      });

      player.value.on('playing', () => {
        isLoading.value = false;
      });

      player.value.on('error', (error) => {
        console.error('播放器錯誤:', error);
        isLoading.value = false;
      });
      
      isInitialized.value = true;
    } catch (error) {
      console.error('初始化播放器失敗:', error);
      isInitialized.value = false;
    }
  }
}

// 格式化質量顯示
const formatQuality = (quality) => {
  if (!quality) return '';
  // 如果是 p540 格式，轉換為 540P
  if (quality.startsWith('p')) {
    return quality.substring(1).toUpperCase() + 'P';
  }
  return quality;
};

// 開始播放
const startPlay = async () => {
  if (!player.value || !props.stream) {
    console.warn('播放器未初始化或無串流數據');
    return;
  }

  try {
    isLoading.value = true;
    // 以主播流鏈結為主, 如果沒有的話, 再以供應商流鏈結為主
    const currentSource = 
      props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.flvUrl || props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.flvUrl;
    console.log('當前播放地址:', currentSource);

    if (!currentSource) {
      throw new Error('無效的播放地址');
    }

    // 創建新的 FLV 播放器實例
    if (flvjs.isSupported()) {
      const flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: currentSource,
        isLive: true,
        hasAudio: true,
        hasVideo: true,
        cors: true,
        enableStashBuffer: false,
        stashInitialSize: 128,
        enableWorker: true,
        lazyLoad: false
      });

      // 獲取視頻元素
      const videoElement = player.value.tech().el();
      
      // 清理舊的播放器
      if (player.value.flvPlayer) {
        player.value.flvPlayer.destroy();
      }
      
      // 保存新的 FLV 播放器實例
      player.value.flvPlayer = flvPlayer;

      // 附加到視頻元素
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();

      // 監聽錯誤
      flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
        console.error('FLV Player Error:', errorType, errorDetail);
      });

      
    } else {
      throw new Error('當前瀏覽器不支持 FLV 播放');
    }

  } catch (error) {
    console.error('播放錯誤:', error);
  } finally {
    isLoading.value = false;
  }
}

// 切換視頻質量
const changeQuality = (quality) => {
  if (isLoading.value || !player.value) return;
  
  currentQuality.value = quality;
  const src = props.stream?.supplierCdnPullUrl[quality]?.flvUrl;
  
  if (!src) {
    console.error('無效的播放地址');
    return;
  }

  console.log('切換畫質:', quality, '地址:', src);
  startPlay();
}

// 監聽對話框的可見性變化
watch(() => props.visible, async (newValue) => {
  if (newValue) {
    streamTitle.value = props.stream?.title || '直播'
    await nextTick()
    
    if (!isInitialized.value) {
      await initializePlayer()
    }
    
    if (player.value && isInitialized.value) {
      console.log('初始載入開始播放')
      await startPlay()
    }
  } else {
    if (player.value) {
      try {
        await player.value.pause();
        player.value.reset();
      } catch (error) {
        console.warn('關閉播放器時發生錯誤:', error);
      }
      isLoading.value = false;
    }
  }
}, { immediate: true })

// 組件卸載時清理播放器
onBeforeUnmount(() => {
  if (player.value) {
    if (player.value.flvPlayer) {
      player.value.flvPlayer.destroy();
    }
    player.value.dispose();
    player.value = null;
    isInitialized.value = false;
  }
})

const getCurrentPlayUrl = () => {
  if (!props.stream) return '';
  return props.stream.supplierCdnPullUrl?.[currentQuality.value]?.flvUrl || '';
}

const getStreamerPlayUrl = () => {
  if (!props.stream) return '';
  return props.stream.streamerCdnPullUrl?.[currentQuality.value]?.flvUrl || '';
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.add({ 
      severity: 'success', 
      summary: '成功', 
      detail: '鏈結已複製到剪貼簿', 
      life: 3000 
    });
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: '錯誤', 
      detail: '複製失敗', 
      life: 3000 
    });
  }
}
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

.stream-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 1rem;
}

.info-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.info-item .label {
  font-weight: bold;
  min-width: 120px;
  color: #666;
}

.info-item .value {
  color: #333;
  word-break: break-all;
}

.url-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.url-text {
  flex: 1;
  word-break: break-all;
  font-family: monospace;
  background-color: #eee;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
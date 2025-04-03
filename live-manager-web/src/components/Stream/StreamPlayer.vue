<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :style="{ width: '90vw' }"
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

    <Tabs v-model:value="currentQuality" @update:value="changeQuality(currentQuality)">
      <TabList>
        <Tab :value="quality.value" v-for="quality in availableQualities">{{ quality.label }}</Tab>
      </TabList>

      <div class="stream-info">
        <div class="info-item">
          <span class="label">{{ $t('stream.host') }}</span>
          <span class="value">{{ stream.streamerName }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('stream.supplierStreamID') }}</span>
          <span class="value">{{ stream.supplierStreamId }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('stream.hostStreamID') }}</span>
          <span class="value">{{ stream.streamerStreamId }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('stream.currentQuality') }}</span>
          <span class="value">{{ formatQuality(currentQuality) }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ $t('stream.supplierPlaybackLink') }}</span>
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
          <span class="label">{{ $t('stream.hostPlaybackLink') }}</span>
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
      <div class="players-container">
        <div
          class="player-layout-toggle"
          :title="playerLayoutToggle ? $t('stream.vertical') : $t('stream.horizontal')"
        >
          <img
            v-if="playerLayoutToggle"
            @click="playerLayoutToggle = false"
            width="30px"
            src="../../assets/horizontal-icon.svg"
          />
          <img
            v-else
            @click="playerLayoutToggle = true"
            width="30px"
            src="../../assets/vertical-icon.svg"
          />
        </div>

        <Splitter :layout="playerLayoutToggle ? 'horizontal' : 'vertical'">
          <SplitterPanel class="flex items-center justify-center" :size="10" :minSize="10">
            <div class="player-section">
              <h4>{{ $t('stream.supplierPlayer') }}</h4>
              <div class="video-container">
                <div v-if="supplierLoadError" class="error-overlay">
                  <i
                    class="pi pi-exclamation-triangle"
                    style="font-size: 2rem; margin-bottom: 1rem"
                  ></i>
                  <p>{{ supplierLoadError }}</p>
                </div>
                <video
                  ref="supplierPlayer"
                  id="supplierPlayer"
                  class="video-js vjs-big-play-centered"
                  controls
                  preload="auto"
                  width="100%"
                  height="auto"
                  data-setup="{}"
                ></video>
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel class="flex items-center justify-center" :size="10">
            <div class="player-section">
              <h4>{{ $t('stream.hostPlayer') }}</h4>
              <div class="video-container">
                <div v-if="streamerLoadError" class="error-overlay">
                  <i
                    class="pi pi-exclamation-triangle"
                    style="font-size: 2rem; margin-bottom: 1rem"
                  ></i>
                  <p>{{ streamerLoadError }}</p>
                </div>
                <video
                  ref="streamerPlayer"
                  id="streamerPlayer"
                  class="video-js vjs-big-play-centered"
                  controls
                  preload="auto"
                  width="100%"
                  height="auto"
                  data-setup="{}"
                ></video>
              </div></div
          ></SplitterPanel>
        </Splitter>
      </div>
    </Tabs>

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
    default: false,
  },
  stream: {
    type: Object,
    default: () => ({
      title: '',
      playUrls: {
        hls: '',
        flv: '',
      },
    }),
  },
})

const emit = defineEmits(['update:visible'])

const playerLayoutToggle = ref(true)
const player = ref(null)
const supplierPlayer = ref(null)
const streamerPlayer = ref(null)
const supplierPlayerInstance = ref(null)
const streamerPlayerInstance = ref(null)
const streamTitle = ref('')
const currentQuality = ref('p1080')
const isLoading = ref(false)
const isInitialized = ref(false)
const availableQualities = ref([
  { label: '1080P', value: 'p1080' },
  { label: '720P', value: 'p720' },
  { label: '540P', value: 'p540' },
  { label: 'Original', value: 'original' },
])
const supplierLoadError = ref(null)
const streamerLoadError = ref(null)

// 初始化 toast 服務
const toast = useToast()

// 註冊 FLV 插件
const registerFlvPlugin = () => {
  if (!videojs.getPlugin('flvjs')) {
    const Plugin = videojs.getPlugin('plugin')

    class FlvJsPlugin extends Plugin {
      constructor(player, options) {
        super(player, options)
        this.flvPlayer = null
        this.player = player

        player.on('dispose', () => {
          if (this.flvPlayer) {
            this.flvPlayer.destroy()
            this.flvPlayer = null
          }
        })
      }

      src(source) {
        // 先銷毀現有的 flv 播放器
        if (this.flvPlayer) {
          this.flvPlayer.destroy()
          this.flvPlayer = null
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
              lazyLoad: false,
            }

            console.log('創建 FLV 播放器，配置:', flvOptions)

            this.flvPlayer = flvjs.createPlayer(flvOptions)
            const mediaElement = this.player.tech().el()

            this.flvPlayer.attachMediaElement(mediaElement)
            this.flvPlayer.load()

            // 添加 FLV 播放器事件監聽
            this.flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
              console.error('FLV 播放器錯誤:', errorType, errorDetail)
            })

            this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
              console.log('FLV 載入完成')
            })

            return true
          }
        }
        return false
      }

      dispose() {
        if (this.flvPlayer) {
          this.flvPlayer.destroy()
          this.flvPlayer = null
        }
      }
    }

    videojs.registerPlugin('flvjs', FlvJsPlugin)
  }
}

// 初始化播放器
const initializePlayers = async () => {
  // 初始化供應商播放器
  if (supplierPlayer.value && !supplierPlayerInstance.value) {
    try {
      registerFlvPlugin()
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
            overrideNative: true,
          },
        },
        flvjs: {
          mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false,
          },
        },
      }
      supplierPlayerInstance.value = videojs(supplierPlayer.value, options)
    } catch (error) {
      console.error('初始化供應商播放器失敗:', error)
      supplierLoadError.value = '播放器初始化失敗'
    }
  }

  // 初始化主播播放器
  if (streamerPlayer.value && !streamerPlayerInstance.value) {
    try {
      registerFlvPlugin()
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
            overrideNative: true,
          },
        },
        flvjs: {
          mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false,
          },
        },
      }
      streamerPlayerInstance.value = videojs(streamerPlayer.value, options)
    } catch (error) {
      console.error('初始化主播播放器失敗:', error)
      streamerLoadError.value = '播放器初始化失敗'
    }
  }
}

// 格式化質量顯示
const formatQuality = (quality) => {
  if (!quality) return ''
  // 如果是 p540 格式，轉換為 540P
  if (quality.startsWith('p')) {
    return quality.substring(1).toUpperCase() + 'P'
  }
  return quality
}

// 開始播放
const startPlay = async () => {
  // 播放供應商串流
  if (supplierPlayerInstance.value) {
    try {
      supplierLoadError.value = null
      const supplierUrl = props.stream?.supplierCdnPullUrl?.[currentQuality.value]?.flvUrl
      if (supplierUrl) {
        await playStream(supplierPlayerInstance.value, supplierUrl, 'supplier')
      } else {
        supplierLoadError.value = '無效的播放地址'
      }
    } catch (error) {
      console.error('供應商播放錯誤:', error)
      supplierLoadError.value = '串流載入失敗'
    }
  }

  // 播放主播串流
  if (streamerPlayerInstance.value) {
    try {
      streamerLoadError.value = null
      const streamerUrl = props.stream?.streamerCdnPullUrl?.[currentQuality.value]?.flvUrl
      if (streamerUrl) {
        await playStream(streamerPlayerInstance.value, streamerUrl, 'streamer')
      } else {
        streamerLoadError.value = '無效的播放地址'
      }
    } catch (error) {
      console.error('主播播放錯誤:', error)
      streamerLoadError.value = '串流載入失敗'
    }
  }
}

// 播放指定串流
const playStream = async (playerInstance, url, type) => {
  if (!playerInstance || !url) return

  try {
    await playerInstance.pause()
    if (flvjs.isSupported()) {
      const flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: url,
        isLive: true,
        hasAudio: true,
        hasVideo: true,
        cors: true,
        enableStashBuffer: false,
        stashInitialSize: 128,
        enableWorker: true,
        lazyLoad: false,
      })

      const videoElement = playerInstance.tech().el()
      if (playerInstance.flvPlayer) {
        playerInstance.flvPlayer.destroy()
      }

      playerInstance.flvPlayer = flvPlayer
      flvPlayer.attachMediaElement(videoElement)
      flvPlayer.load()

      flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
        console.error(`${type} FLV Player Error:`, errorType, errorDetail)
        if (type === 'supplier') {
          supplierLoadError.value = '串流載入失敗'
        } else {
          streamerLoadError.value = '串流載入失敗'
        }
      })
    }
  } catch (error) {
    throw error
  }
}

// 切換視頻質量
const changeQuality = (quality) => {
  if (isLoading.value || !supplierPlayerInstance.value || !streamerPlayerInstance.value) return

  currentQuality.value = quality
  const supplierSrc = props.stream?.supplierCdnPullUrl[quality]?.flvUrl
  const streamerSrc = props.stream?.streamerCdnPullUrl[quality]?.flvUrl

  if (!supplierSrc || !streamerSrc) {
    console.error('無效的播放地址')
    return
  }

  console.log('切換畫質:', quality, '供應商地址:', supplierSrc, '主播地址:', streamerSrc)
  startPlay()
}

// 監聽對話框的可見性變化
watch(
  () => props.visible,
  async (newValue) => {
    if (newValue) {
      supplierLoadError.value = null
      streamerLoadError.value = null
      streamTitle.value = props.stream?.title || '直播'
      await nextTick()

      if (!isInitialized.value) {
        await initializePlayers()
      }

      if (supplierPlayerInstance.value && isInitialized.value) {
        console.log('初始載入開始播放供應商串流')
        await startPlay()
      }
      if (streamerPlayerInstance.value && isInitialized.value) {
        console.log('初始載入開始播放主播串流')
        await startPlay()
      }
    } else {
      if (supplierPlayerInstance.value) {
        try {
          await supplierPlayerInstance.value.pause()
          supplierPlayerInstance.value.reset()
        } catch (error) {
          console.warn('關閉供應商播放器時發生錯誤:', error)
        }
        isLoading.value = false
      }
      if (streamerPlayerInstance.value) {
        try {
          await streamerPlayerInstance.value.pause()
          streamerPlayerInstance.value.reset()
        } catch (error) {
          console.warn('關閉主播播放器時發生錯誤:', error)
        }
        isLoading.value = false
      }
    }
  },
  { immediate: true },
)

// 組件卸載時清理播放器
onBeforeUnmount(() => {
  if (player.value) {
    if (player.value.flvPlayer) {
      player.value.flvPlayer.destroy()
    }
    player.value.dispose()
    player.value = null
    isInitialized.value = false
  }
})

const getCurrentPlayUrl = () => {
  if (!props.stream) return ''
  return props.stream.supplierCdnPullUrl?.[currentQuality.value]?.flvUrl || ''
}

const getStreamerPlayUrl = () => {
  if (!props.stream) return ''
  return props.stream.streamerCdnPullUrl?.[currentQuality.value]?.flvUrl || ''
}

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '鏈結已複製到剪貼簿',
      life: 3000,
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '複製失敗',
      life: 3000,
    })
  }
}
</script>

<style scoped lang="scss">
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
  margin: 1rem 0;
}

.info-item {
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0.5rem;
  align-items: center;
  font-size: 14px;
}

.info-item .label {
  font-weight: bold;
  white-space: pre-wrap;
  color: #666;
  position: relative;

  &:after {
    position: absolute;
    content: ':';
    right: 0;
  }
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

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 2;
  text-align: center;
  padding: 1rem;
}

.error-overlay p {
  margin: 0;
  font-size: 1.1rem;
}

.players-container {
  position: relative;
}

.player-section {
  margin: 1rem;
}

.player-layout-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: absolute;
  right: 1.2rem;
  top: 1rem;
  padding: 5px;
  border-radius: 20px;
  cursor: pointer;
}

:deep(.p-tab) {
  font-family: 'Inter';
}
</style>

<template>
  <div ref="dialog" class="media-preview" v-if="showDialog">
    <div v-if="isVideo">
      <div class="media-preview-container">
        <q-btn icon="close" flat round dense size="md" color="grey-3" class="close-btn" @click="onCloseClick" />
        <video width="100%" height="100%" controls autoplay>
          <source :src="file.url" />
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { isImageFile, isVideoFile } from "src/cs-client-web/utils/file";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";

export default defineComponent({
  name: "MediaPreview",
  props: {
    file: { type: Object, required: true }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const $router = useRouter();
    const dialog = ref(false);
    const showDialog = ref(false);

    let lightbox = null;
    let lightboxOpened = false;

    const isImage = computed(() => {
      return isImageFile(props.file.type);
    });

    const isVideo = computed(() => {
      return isVideoFile(props.file.type);
    });

    if (isImage.value) {
      lightbox = new PhotoSwipeLightbox({
        dataSource: [
          {
            src: props.file.url,
            width: 0,
            height: 0
          }
        ],
        pswpModule: PhotoSwipe,
        preload: [1, 2],
        initialZoomLevel: "fit",
        secondaryZoomLevel: "fit",
        tapAction: "close",
        doubleTapAction: false
      });

      lightbox.on("beforeOpen", () => {
        lightboxOpened = true;
      });

      lightbox.on("close", () => {
        if (lightboxOpened) {
          lightboxOpened = false;
          $router.back();
          emit("close");
        }
      });

      lightbox.on("itemData", async ({ itemData }) => {
        // 取当前原图尺寸
        if (itemData.width < 1 || itemData.height < 1) {
          let img = new Image();

          img.onload = await function () {
            // 设置尺寸
            itemData.width = this.width;
            itemData.height = this.height;
            lightbox.pswp.updateSize(true);
          };

          // 加载图片
          img.src = itemData.src;
        }
      });

      lightbox.init();

      lightbox.loadAndOpen(0);
    }

    if (isVideo.value) {
      showDialog.value = true;
    }

    onMounted(() => {
      $router.push({
        hash: "#MediaPreview"
      });
    });

    onBeforeUnmount(() => {
      showDialog.value = false;
    });

    // 监听手机返回键关闭图框
    watch(
      () => $router.currentRoute.value,
      (to, from) => {
        if (lightboxOpened && from.hash === "#MediaPreview") {
          lightboxOpened = false;
          lightbox.pswp.close();
          emit("close");
        } else if (from.hash === "#MediaPreview") {
          emit("close");
        }
      }
    );

    return {
      isVideo,
      dialog,
      showDialog,
      onCloseClick() {
        $router.back();
        emit("close");
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.media-preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
  outline: none;
}

.media-preview-container {
  display: flex;

  video {
    align-self: center;
    width: 100%;
    height: auto;
  }
}

.close-btn {
  position: absolute;
  right: 9px;
  top: 9px;
}
</style>

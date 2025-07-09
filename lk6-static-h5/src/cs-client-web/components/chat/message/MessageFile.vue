<template>
  <div class="message-file-container">
    <div v-if="isImage">
      <div :class="`message-image-${size}`" @click.prevent="openFile('preview')" v-if="isFileExists">
        <img
          :src="file.url"
          style="display: block; cursor: pointer; max-height: 300px; object-fit: contain"
          :width="imgWidth"
          :height="imgHeight"
        />
      </div>
      <div v-else>
        <q-icon name="error" color="red" />
        图片已无效
      </div>
    </div>
    <div
      :class="`message-video-container message-video-${size}`"
      v-else-if="isVideo"
      @click.prevent="openFile('preview')"
    >
      <div class="absolute fit flex items-center justify-center">
        <q-icon name="play_circle" :size="size === 'normal' ? 'xl' : 'sm'" color="white" />
      </div>
      <video width="100%" height="100%">
        <source :src="file.url" />
      </video>
    </div>
    <q-inner-loading :showing="showProgress">
      <q-circular-progress show-value :value="file?.progress" track-color="grey-3" size="50px">
        {{ file?.progress }}%
      </q-circular-progress>
    </q-inner-loading>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { isImageFile, isVideoFile } from "src/cs-client-web/utils/file";
import emitter from "src/cs-client-web/helpers/event-bus";

function resizeImage(image, width, height) {
  const { naturalWidth: orgWidth, naturalHeight: orgHeight } = image;
  let newWidth = 0;
  let newHeight = 0;
  let ratio = orgWidth / orgHeight;

  if (width / height > ratio) {
    newWidth = height * ratio;
    newHeight = height;
  } else {
    newHeight = width / ratio;
    newWidth = width;
  }

  return {
    width: newWidth,
    height: newHeight
  };
}

export default defineComponent({
  name: "MessageFile",
  props: {
    file: { type: Object, required: true },
    index: { type: Number, required: true },
    clickable: { type: Boolean, required: true },
    size: { type: String, default: "normal" }
  },
  setup(props) {
    const isFileExists = ref(true);
    const imgWidth = ref(0);
    const imgHeight = ref(0);

    const isImage = computed(() => {
      return isImageFile(props.file.type);
    });

    const isVideo = computed(() => {
      return isVideoFile(props.file.type);
    });

    const showProgress = computed(() => {
      return props.file?.progress && props.file?.progress >= 0;
    });

    const openFile = async (action) => {
      if (!props.clickable) {
        return;
      }

      emitter.emit("openFile", { file: props.file, action: action });
    };

    onMounted(() => {
      if (isImage.value) {
        let imgObj = new Image();

        imgObj.src = props.file.url;

        imgObj.onload = () => {
          isFileExists.value = true;

          const { naturalWidth: width, naturalHeight: height } = imgObj;

          imgWidth.value = width;
          imgHeight.value = height;

          if (width > 160 || height > 160) {
            let d = resizeImage(imgObj, 160, 160);

            imgWidth.value = d.width;
            imgHeight.value = d.height;
          }
        };
      }
    });

    return {
      isImage,
      isVideo,
      isFileExists,
      imgWidth,
      imgHeight,
      showProgress,
      openFile
    };
  }
});
</script>

<style lang="scss" scoped>
.message-file-container {
  position: relative;
  z-index: 0;

  .message-image-small {
    img {
      width: 80px;
    }
  }

  .message-video-container {
    width: 160px;
    max-width: 100%;
    cursor: pointer;

    &.message-video-small {
      width: 80px;
    }

    video {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
</style>

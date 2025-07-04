<template>
  <q-dialog v-model="dialog">
    <q-card class="my-card">
      <div class="col-6">
        <q-img :src="imageUrl" :ratio="4 / 3" fit="contain" v-if="imageUrl !== null" no-native-menu>
          <div class="absolute-bottom-right q-pa-none text-right">
            <q-btn unelevated flat icon="send" size="lg" @click="onSend">
              <q-tooltip anchor="top middle" self="bottom middle">
                {{ $t("send") }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-img>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import compressImage from "src/cs-client-web/utils/compress-image";
import { convertBase64UrlToImgFile } from "src/cs-client-web/utils/file";
import uploadFile from "src/cs-client-web/utils/upload-file";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { storeToRefs } from "pinia";
import toast from "src/cs-client-web/utils/toast";
import emitter from "src/cs-client-web/helpers/event-bus";
import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";

export default defineComponent({
  name: "DialogPasteImage",
  setup() {
    const chatStore = useChatStore();
    const { isChatEnded, chatFreeze } = storeToRefs(chatStore);
    const dialog = ref(false);
    const imageUrl = ref(null);
    // 随机文件名
    const fileName = ref(null);
    const imgFile = ref(null);

    fileName.value = new Date().getTime() + "chatImg" + ".jpeg";

    function readPasteData(e) {
      if (isChatEnded.value || chatFreeze.value || e == null) {
        return;
      }

      // 处理文本数据，移除样式
      e.preventDefault();
      const text = e.clipboardData && e.clipboardData.getData("text/plain");

      if (text?.includes("gif")) {
        alert("无法上传gif，请使用工具栏中的选择图片");
        return;
      }

      // text存在且不是img则将其插入可编辑div中
      if (
        !isEmpty(text) &&
        !isNull(text) &&
        !(text.includes("jpeg") || text.includes("png") || text.includes("jpg") || text.includes("gif"))
      ) {
        document.execCommand("insertText", false, text);
      }

      // 读取图片
      const items = e.clipboardData && e.clipboardData.items;
      let file = null;
      if (items && items.length) {
        // 检索剪切板items
        for (const item of Array.from(items)) {
          if (item.type.indexOf("image") !== -1) {
            file = item.getAsFile();
            break;
          }
        }
      }

      // 预览图片
      const reader = new FileReader();
      reader.onload = (event) => {
        // 图片内容
        const imgContent = event.target?.result;

        // 获取当前base64图片信息，计算当前图片宽高以及压缩比例
        const imgObj = new Image();
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let imgWidth;
        let imgHeight;
        let scale = 1;

        imgObj.src = imgContent;
        imgObj.onload = () => {
          imgWidth = imgObj.width;
          imgHeight = imgObj.height;

          let ratio = imgWidth / imgHeight;

          // 计算img宽高
          if (imgObj.width > 500) {
            if (MAX_WIDTH / MAX_HEIGHT > ratio) {
              imgWidth = MAX_HEIGHT * ratio;
              imgHeight = MAX_HEIGHT;
            } else {
              imgHeight = MAX_WIDTH / ratio;
              imgWidth = MAX_WIDTH;
            }

            // 图片宽度大于1920，图片压缩1.5倍
            if (imgObj.width > 1920) {
              // 真实比例缩小1.5倍
              scale = 1.5;
            }
          }
          // 设置可编辑div中图片宽高
          //imageWidth.value = imgWidth;
          //imageHeight.value = imgHeight;
          // 压缩图片，渲染页面
          compressImage(imgContent, scale, async (newBlob, newBase) => {
            // 图片渲染
            imageUrl.value = newBase;

            // 删除base64图片的前缀
            newBase = newBase.replace(/^data:image\/\w+;base64,/, "");

            imgFile.value = await convertBase64UrlToImgFile(newBase, fileName.value, "image/jpeg");
          });
        };
      };

      if (file) {
        dialog.value = true;
        // 文件不为空时渲染
        reader.readAsDataURL(file);
      }
    }

    onMounted(() => {
      document.body.addEventListener("paste", readPasteData);
    });

    onBeforeUnmount(() => {
      // 销毁时移除监听
      document.body.removeEventListener("paste", readPasteData);
    });

    const onSend = async () => {
      await uploadFile(fileName.value, imgFile.value)
        .then((file) => {
          dialog.value = false;
          emitter.emit("SendMessage", {
            type: "file",
            content: "",
            files: [file]
          });
        })
        .catch((e) => {
          toast.error(e.msg);
        });
    };

    return {
      dialog,
      imageUrl,
      onSend
    };
  }
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 600px;
}

.q-img__content > div {
  padding: 0;
}
</style>

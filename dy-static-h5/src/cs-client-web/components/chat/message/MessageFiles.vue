<template>
  <div>
    <div v-for="(file, index) in imageVideoFiles" :key="`message-iv-${index}`">
      <message-file
        :file="file"
        :index="index"
        :clickable="messageClickable"
        :size="!reply ? 'normal' : 'small'"
      ></message-file>
    </div>
    <div v-for="(file, index) in otherFiles" :key="`message-other-file-${index}`">
      <div class="rounded-borders bg-green-2">
        <q-btn flat stack @click="openFile(file, 'download')">
          <q-icon size="2.5em" name="file_download" />
          <div class="file-name">文件</div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import MessageFile from "src/cs-client-web/components/chat/message/MessageFile";
import { isImageVideoFile } from "src/cs-client-web/utils/file";
import emitter from "src/cs-client-web/helpers/event-bus";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "MessageFiles",
  components: { MessageFile },
  props: {
    message: { type: Object, required: true },
    reply: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chatStore = useChatStore();
    const { messageClickable } = storeToRefs(chatStore);

    const imageVideoFiles = computed(() => {
      return props.message.files.filter((file) => isImageVideoFile(file.type));
    });

    const otherFiles = computed(() => {
      return props.message.files.filter((file) => !isImageVideoFile(file.type));
    });

    const openFile = (file, action) => {
      if (!messageClickable.value) {
        return;
      }

      emitter.emit("openFile", { file: file, action: action });
    };

    return {
      messageClickable,
      imageVideoFiles,
      otherFiles,
      openFile
    };
  }
});
</script>

<style lang="scss" scoped>
.file-name {
  font-size: small;
}
</style>

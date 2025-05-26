<template>
  <div @dragover="onDragOver">
    <chat-container :draggable="false" :room="room" />
    <button v-shortkey="['ctrl', 'alt', 'v']" @shortkey="about()" style="display: none" />
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import ChatContainer from "src/cs-client-web/components/ChatContainer.vue";
import { useChatStore } from "src/cs-client-web/stores/chat";
import { useUserStore } from "src/cs-client-web/stores/user";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import useSocket from "src/cs-client-web/composables/use-socket";
import toast from "src/cs-client-web/utils/toast";
import { userStore } from "src/stores";

export default defineComponent({
  name: "ChatPage",
  components: {
    ChatContainer
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = userStore();
    const chatStore = useChatStore();
    const cSuserStore = useUserStore();
    const { wsDisconnect } = useSocket();
    const { room } = storeToRefs(chatStore);
    const isDragActive = ref(false);

    let $uploader = null;
    let dragOverTimeout = null;

    let qChatGuid = route.query?.uid ?? "";

    const getChatBaseUrl = () => {
      const url = route?.path?.split?.("/")?.[1] || "live-chat";
      if (url === "live-chat") {
        return `${url}/live-chat`;
      }
    };

    if (isEmpty(cSuserStore.token)) {
      // console.log("TOken Empty");
      const chatBaseUrl = getChatBaseUrl();
      if (store.chatGuid) {
        router.push({ path: `/${chatBaseUrl}/chat?uid=${store.chatGuid}` });
      } else {
        router.push({ path: `/${chatBaseUrl}` });
      }
    }

    const checkAloneTimer = () => {
      let chatGuid = LocalStorage.get("chatGuid");

      // console.log("ChatGuid"  + chatGuid );
      if (!qChatGuid || !chatGuid || !isEqual(qChatGuid, chatGuid)) {
        clearInterval(checkAloneTimer);

        try {
          try {
            wsDisconnect();
          } catch (e) {
            console.warn(e);
          }

          // alert("CLOSE WIN");
          // window.close();
        } catch (e) {
          console.warn(e);
        }
      }
    };

    onMounted(() => {
      // console.log("CHAT PAGE");

      $uploader = document.querySelector("#uploader");

      setInterval(checkAloneTimer, 300);
    });

    onBeforeUnmount(() => {
      clearInterval(checkAloneTimer);
    });

    watch(isDragActive, (newVal) => {
      if (newVal) {
        $uploader.addClass("uploader--active");
      } else {
        $uploader.removeClass("uploader--active");
      }
    });

    const onDragOver = (e) => {
      e.preventDefault();
      isDragActive.value = true;

      clearTimeout(dragOverTimeout);

      dragOverTimeout = setTimeout(() => {
        isDragActive.value = false;
      }, 100);
    };

    const about = () => {
      toast.info(`Version: ${process.env.VERSION}`, { position: "center", timeout: 3000 });
    };

    return {
      room,
      onDragOver,
      about
    };
  }
});
</script>

<style scoped></style>

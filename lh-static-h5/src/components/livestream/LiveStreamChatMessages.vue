<template>
  <div class="livestream-chat-wrapper" :class="$q.dark.isActive ? 'dark' : 'white'">
    <div ref="chatListRef" class="livestream-chat-list">
      <div v-for="(message, index) in messages" :key="index" class="livestream-chat-item">
        <div class="livestream-chat-item__name">{{ message.name }}</div>
        <div class="livestream-chat-item__message">{{ message.content }}</div>
      </div>
    </div>
    <div class="livestream-chat-input-wrapper" :style="chatBoxStyle">
      <q-form class="livestream-chat-input-inner-wrapper q-px-md" @submit.enter.prevent>
        <q-btn class="bet-btn" rounded label="投一注" @click="openGame('', 'IM', '', '')" />

        <q-input
          v-model="messageToSend"
          class="livestream-chat-input"
          placeholder="请输入聊天内容"
          autocomplete="off"
          rounded
          dense
          standout
        >
          <template v-slot:append>
            <q-btn
              class="livestream-chat-input-btn"
              type="submit"
              :disabled="!isMessageSendable"
              @click="handleSendChatMessage"
              rounded
              outline
              color="primary"
              label="发弹幕"
            ></q-btn>
          </template>
        </q-input>
      </q-form>
    </div>
  </div>
  <GameModal ref="gameRef" />
</template>

<script setup>
import { computed, nextTick, ref, toRefs, watch, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import GameModal from "components/modal/GameModal.vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

const store = userStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const props = defineProps(["messages"]);
const { messages } = toRefs(props);
const emit = defineEmits(["sendChatMessage"]);

const messageToSend = ref("");
const chatListRef = ref(null);

const isMessageSendable = computed(() => messageToSend.value.trim().length > 0);

const handleSendChatMessage = () => {
  emit("sendChatMessage", messageToSend.value);
  messageToSend.value = "";
};

watch(
  messages,
  async () => {
    if (chatListRef.value) {
      await nextTick();
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
    }
  },
  { deep: true }
);

const gameRef = ref();

const openGame = (gameName, code, gameCode) => {
  if (!store.hasToken()) {
    const currentPath = router.currentRoute.value.fullPath;
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    });
    return;
  } else {
    gameRef.value.open(gameName, code, gameCode);
  }
};

onMounted(() => {});

onBeforeUnmount(() => {
  clearInterval(messageInterval);
});
</script>

<style lang="scss" scoped>
.livestream-chat-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .livestream-chat-list {
    flex: 1;
    padding: 16px;
    overflow: auto;
    height: 100%;
    margin-top: calc(56.25vw + 38px);
    max-height: calc(100dvh - 56.25vw - 38px - 60px);
    scrollbar-width: none;
    -ms-overflow-style: none;

    .livestream-chat-list::-webkit-scrollbar {
      display: none;
    }

    .livestream-chat-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 12px;

      .livestream-chat-item__name {
        margin-bottom: 4px;
        font-size: 12px;
        line-height: 15px;
        font-weight: 600;
        color: #333333;
      }

      .livestream-chat-item__message {
        // @include livestream-content-block;
        padding: 6px 9px;
        border-top-left-radius: 0;
        font-size: 12px;
        line-height: 15px;
        color: #333333;
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px #0000001a;
        border-radius: 0px 16px 16px 16px;
        word-break: break-all;
        overflow-wrap: break-word;
        white-space: normal;
      }
    }
  }

  .livestream-chat-input-wrapper {
    background-color: #fff;
    // padding: 6px 12px;
    position: fixed;
    bottom: 0;

    left: 0;
    width: 100%;
    z-index: 2001;
    height: 70px;
    display: flex;
    align-items: center;
    transition: 0.3s all;

    .livestream-chat-input-inner-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 7.55px;
      // box-shadow: 0px 0px 7.55px 0px #a9c9ea inset;
      // border-radius: 13.21px;
      gap: 16px;
      width: 100%;

      .livestream-chat-input {
        // background: #f7f8fb;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        width: 100%;
        overflow: hidden;
        border-radius: 50px;
        :deep(.q-field__control) {
          padding-right: 2px;
        }
      }
      .livestream-chat-input-btn {
        background-color: transparent;
        border: 1px solid #4c88f8 !important;
        border-radius: 40px;
        padding: 5.66px 17.56px;
        font-size: 13px;
        line-height: 18px;
        white-space: nowrap;
        color: #4c88f8;
        &:disabled {
          cursor: not-allowed;
          color: #b0b0b0;
          border-color: #b0b0b0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.livestream-content-block {
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0px 3.77px 20.76px 0px #00000026;
}

.livestream-team-emblem {
  padding: 7px;
  border-radius: 50%;
  img {
    display: block;
    max-width: 30px;
  }
}

.-on-air {
  background-color: #1ac1a2;
  padding: 0 5px;
  border-radius: 4px;
  font-size: 10px;
  line-height: 13px;
  font-weight: 500;
  color: #fff;
}

.bet-btn {
  background: linear-gradient(180deg, #1745ff 0%, #69fffa 100%);
  color: #fff;
  white-space: nowrap;
  border: 2px solid transparent;
}

.livestream-chat-wrapper.dark {
  // background: #0f182e;
  .livestream-chat-list {
    .livestream-chat-item {
      .livestream-chat-item__name {
        color: #ffffff;
      }
      .livestream-chat-item__message {
        background: #2e4065;
        color: #ffffff;
      }
    }
  }
  .livestream-chat-input-wrapper {
    background: #0f182e;

    .livestream-chat-input-btn {
      background: linear-gradient(180deg, rgba(72, 100, 181, 0.5) 0%, rgba(25, 39, 85, 0.5) 100%) !important;
      border-color: #369eff !important;
      color: #ffffff !important;
    }
  }

  .bet-btn {
    color: #fff;
    white-space: nowrap;
    border-radius: 50px;
    // background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
    border-color: #369eff !important;
    background-image: url(../../assets/images/livestream/button-active.png) !important;
    background-size: 100% 100% !important;
    background-position: center center;
  }
}
</style>

<style lang="scss" scoped>
@media (orientation: landscape) {
  .livestream-chat-wrapper {
    width: 45%;
    height: 100%;
    margin-left: auto;
    right: 0;
    position: fixed;

    .livestream-chat-list {
      flex: 1;
      padding: 16px;
      overflow: auto;
      height: 100%;
      margin-top: 0;
      max-height: calc(100dvh - 70px);
      background: #f3f7fd;
    }
  }

  .livestream-chat-input-wrapper {
    width: 45% !important;
    right: 0 !important;
    left: auto !important;
  }

  .livestream-chat-wrapper.dark {
    .livestream-chat-list {
      background: #0f182e !important;
    }
  }
}
</style>

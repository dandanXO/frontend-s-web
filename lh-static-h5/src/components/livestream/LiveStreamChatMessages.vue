<template>
  <div class="livestream-chat-wrapper" :class="isDark ? 'dark' : 'white'">
    <div ref="chatListRef" class="livestream-chat-list">
      <div v-for="(message, index) in messages" :key="index" class="livestream-chat-item">
        <img
          class="livestream-chat-item__vip-badge"
          :src="
            require(`../../assets/images/livestream/chat/vip-badge-${message.vip}${isDark ? '-dark' : '-light'}.png`)
          "
          loading="lazy"
          width="44"
        />
        <img
          v-if="message.profilePhoto && message.profilePhoto.includes('default')"
          class="livestream-chat-item__profile-photo"
          :src="require(`../../assets/images/profile/${message.profilePhoto}.png`)"
        />
        <img
          v-else-if="message.profilePhoto"
          class="livestream-chat-item__profile-photo"
          :src="`${profilePhotoDir}${message.profilePhoto}?v=${now}`"
          loading="lazy"
        />
        <img v-else class="livestream-chat-item__profile-photo" src="../../assets/images/account/avatar.png" />
        <span class="livestream-chat-item__name">{{ message.name }}：</span>
        <span class="livestream-chat-item__message">{{ message.content }}</span>
      </div>
    </div>

    <div class="livestream-chat-input-wrapper" :style="chatBoxStyle">
      <q-form class="livestream-chat-input-inner-wrapper q-px-md" @submit.enter.prevent>
        <q-btn class="bet-btn" rounded label="投一注" @click="handleBetClick" />

        <q-input
          v-model="messageToSend"
          class="livestream-chat-input"
          :placeholder="inputConfig.placeholder"
          :disable="inputConfig.disabled"
          autocomplete="off"
          rounded
          dense
          standout
        >
          <template v-slot:append>
            <q-btn icon="emoji_emotions" round flat dense @click="togglePopover"></q-btn>
            <template v-if="popoverRef">
              <div class="emoji-picker" ref="emojiPickerRef"></div>
            </template>
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
import { useLocalStorage } from "@vueuse/core";
import { Picker } from "emoji-mart";

const now = Date.now();

const store = userStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const props = defineProps(["messages", "vipStatus", "livestreamData", "extensionState", "extensionToken"]);
const { messages, vipStatus, livestreamData, extensionState, extensionToken } = toRefs(props);
const emit = defineEmits(["sendChatMessage"]);

const messageToSend = ref("");
const chatListRef = ref(null);
const emojiPickerRef = ref(null);
const isPopoverVisible = ref(false);

const isDark = computed(() => $q.dark.isActive);
const profilePhotoDir = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/profile/";
const isMessageSendable = computed(() => messageToSend.value.trim().length > 0);

const inputConfig = computed(() => {
  let disabled = false;
  let placeholder = "请输入聊天内容";
  if ((!store.token && !extensionState.value) || !vipStatus.value) {
    disabled = true;
    if (!vipStatus.value) placeholder = "VIP特权不足，无法发言";
    // if (!store.token) placeholder = "请登录后发言";
  }

  return {
    disabled,
    placeholder
  };
});

const handleSendChatMessage = () => {
  emit("sendChatMessage", messageToSend.value);
  popoverRef.value = false;
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

const handleEmojiSelect = (emoji) => {
  messageToSend.value += emoji.native;
};

const popoverRef = ref(false);
const togglePopover = () => {
  popoverRef.value = !popoverRef.value;
  emojiPick();
};

const emojiPick = () => {
  nextTick(() => {
    const picker = new Picker({
      data: async () => {
        const response = await fetch("/emoji.json");
        return response.json();
      },
      locale: "zh",
      theme: isDark.value ? "dark" : "light",
      skinTonePosition: "none",
      onEmojiSelect: handleEmojiSelect
    });

    if (emojiPickerRef.value) {
      emojiPickerRef.value.appendChild(picker);
    } else {
      console.error("Emoji picker reference is not available.");
    }
  });
};

const handleBetClick = () => {
  const handler = route.path === "/livestreampage/streamplayer" ? handleAppBetClick : openGame;
  switch (livestreamData.value.sportId) {
    case 1:
    case 2:
      handler("IM体育", "IM", "", "SPORTS");
      break;
    case 3:
    case 4:
    case 5:
      handler("雷火电竞", "TFGaming", "", "ESPORTS");
      break;
  }
};

const handleAppBetClick = (platformName, platformId, platformCode, gameType) => {
  document.location.href = `app://to_platform?platformName=${platformName}&platformId=${platformId}&platformCode=${platformCode}&gameType=${gameType}`;
};

onMounted(() => {
  // emojiPick();
});

// onBeforeUnmount(() => {
// clearInterval(messageInterval);
// });
</script>

<style lang="scss" scoped>
.livestream-chat-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .livestream-chat-list {
    flex-grow: 1;
    padding: 16px;
    overflow: auto;
    height: 100dvh;
    margin-top: calc(56.25vw + 27px + 68px + 16px);
    max-height: calc(100dvh - 56.25vw - 27px - 60px - 68px - 16px);
    // Firefox
    scrollbar-width: thin;
    scrollbar-color: #c4c4c4 #b8d1ff;
    background-color: #e8f2fe;

    // WebKit Browsers
    &::-webkit-scrollbar {
      width: 8px;
      border-radius: 40px;
    }

    &::-webkit-scrollbar-track {
      background: #c4c4c4;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c4c4c4;
      border-radius: 50px;
      border: 2px solid #c4c4c4;
    }

    .livestream-chat-item {
      background-color: #ffffff80;
      border-radius: 4px;
      width: max-content;
      max-width: 100%;
      padding: 6px 8px 0.5px;
      margin-bottom: 8px;
      word-wrap: break-word;
      font-size: 12px;
      margin-bottom: 12px;

      > *:not(:last-child) {
        margin-right: 4px;
      }

      .livestream-chat-item__profile-photo {
        max-width: 18px;
        border-radius: 50%;
      }

      .livestream-chat-item__name {
        color: #666666;
        vertical-align: super;
      }

      .livestream-chat-item__message {
        color: #333333;
        vertical-align: super;
      }
    }
  }

  .livestream-chat-input-wrapper {
    background-color: #fff;
    // padding: 6px 12px;
    position: fixed;
    bottom: 0;
    box-shadow: 0px -6px 15px 0px #0000001a;
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
    background-color: #1a2338;
    .livestream-chat-item {
      background-color: #2e406580;

      .livestream-chat-item__name {
        color: #b5b5b5;
      }
      .livestream-chat-item__message {
        color: #ffffff;
      }
    }
  }
  .livestream-chat-input-wrapper {
    background: #0f182e;
    box-shadow: 0px -1.4px 5.24px 0px #dadada66;

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

.emoji-picker {
  position: fixed;
  bottom: 60px;
  right: 0;
}
</style>

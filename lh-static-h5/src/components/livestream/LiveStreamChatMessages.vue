<template>
  <div
    class="livestream-chat-wrapper"
    :class="{
      dark: isDark,
      white: !isDark,
      landscape: isLandscape
    }"
  >
    <div ref="chatListRef" class="livestream-chat-list" :style="chatListStyle">
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

    <div ref="inputWrapperRef" class="livestream-chat-input-wrapper">
      <q-form class="livestream-chat-input-inner-wrapper q-px-md" @submit.enter.prevent>
        <q-btn class="bet-btn" rounded label="投一注" @click="handleBetClick" />

        <q-input
          v-model="messageToSend"
          class="livestream-chat-input"
          :placeholder="inputConfig.placeholder"
          :disable="inputConfig.disabled"
          type="textarea"
          autocomplete="off"
          rounded
          dense
          standout
          autogrow
          @focus="handleInputFocus"
          @blur="handleInputBlur"
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
              label="发送"
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
import { useElementBounding, useLocalStorage } from "@vueuse/core";
import { Picker } from "emoji-mart";

const now = Date.now();

const store = userStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const props = defineProps([
  "messages",
  "vipStatus",
  "livestreamData",
  "extensionState",
  "extensionToken",
  "marginTop",
  "isLandscape"
]);
const { messages, vipStatus, livestreamData, extensionState, extensionToken, isLandscape } = toRefs(props);
const emit = defineEmits(["sendChatMessage"]);
const model = defineModel();

const messageToSend = ref("");
const chatListRef = ref(null);
const emojiPickerRef = ref(null);
const inputWrapperRef = ref(null);
const isPopoverVisible = ref(false);

const profilePhotoDir = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/profile/";
const { height: inputWrapperHeight } = useElementBounding(inputWrapperRef);

const isDark = computed(() => $q.dark.isActive);
const isMessageSendable = computed(() => messageToSend.value.trim().length > 0);

const inputConfig = computed(() => {
  let disabled = false;
  let placeholder = "请输入聊天内容";
  let vipLevel = store.vip.split("VIP")[1];
  if ((!store.token && !extensionState.value) || !vipStatus.value || vipLevel < 3) {
    disabled = true;
    if (!vipStatus.value || vipLevel < 3) placeholder = "VIP3等级或以上即可发言";
    // if (vipLevel < 3) placeholder = "VIP3等级或以上即可发言"
    // if (!store.token) placeholder = "请登录后发言";
  }

  return {
    disabled,
    placeholder
  };
});
const chatListStyle = computed(() => ({
  marginTop: `${props.marginTop}px`,
  maxHeight: `calc(100dvh - ${props.marginTop}px - ${inputWrapperHeight.value}px)`
}));

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
      handler("IM体育", "IM", livestreamData.value.eventCode || "", "SPORTS");
      break;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      handler("雷火电竞", "TFGaming", livestreamData.value.eventCode || "", "ESPORTS");
      break;
  }
};

const handleAppBetClick = (platformName, platformId, platformCode, gameType) => {
  document.location.href = `app://to_platform?platformName=${platformName}&platformId=${platformId}&platformCode=${platformCode}&gameType=${gameType}`;
};

const handleInputFocus = () => {
  model.value = true;
};

const handleInputBlur = () => {
  model.value = false;
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
    // max-height: calc(100dvh - 56.25vw - 27px - 60px - 68px - 16px);
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
        white-space: break-spaces;
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
    min-height: 70px;
    padding: 6px 0;
    display: flex;
    align-items: center;
    transition: 0.3s all;

    .livestream-chat-input-inner-wrapper {
      display: flex;
      align-items: flex-end;
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
        border-radius: 20px;
        overflow-y: auto;
        white-space: nowrap;

        :deep(textarea) {
          max-height: 90px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }

        :deep(textarea::placeholder) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :deep(.q-field__control) {
          padding-right: 2px;
        }

        :deep(.q-field__control .q-field__append) {
          margin-top: auto;
        }

        :deep(.q-field__native):focus {
          animation: blink-input-opacity-to-prevent-scrolling-when-focus 0.1s;
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
  height: 40px;
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

@keyframes blink-input-opacity-to-prevent-scrolling-when-focus {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.landscape {
  &.livestream-chat-wrapper {
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

  &.livestream-chat-wrapper.dark {
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

<template>
  <div class="livestream-chat-wrapper">
    <div class="livestream-chat-announcement-wrapper">
      <img class="livestream-chat-announcement-icon" src="@/assets/home/announcement/announcement-img.png" />
      <Vue3Marquee
        :clone="false"
        :duration="calculateMaxContentLength() < 30 ? calculateMaxContentLength() * 1 + 10 : 70"
      >
        <div
          v-for="(word, index) in displayAnnouncementList"
          :key="index"
          v-html="word"
          class="livestream-chat-announcement-marquee"
        />
      </Vue3Marquee>
    </div>
    <div ref="chatListRef" class="livestream-chat-list">
      <ChatFloatingPanel class="livestream-chat__chat-panel" :is-system-livestream :livestream-data />
      <div v-for="(message, index) in messages" :key="index" class="livestream-chat-item">
        <BadgeChip :level="message.vip">V{{ message.vip }}</BadgeChip>
        <img
          v-if="message.profilePhoto && message.profilePhoto.includes('default')"
          class="livestream-chat-item__profile-photo"
          :src="require(`@/assets/images/profile/${message.profilePhoto}.png`)"
        />
        <img
          v-else-if="message.profilePhoto"
          class="livestream-chat-item__profile-photo"
          :src="`${profilePhotoDir}${message.profilePhoto}?v=${now}`"
          loading="lazy"
        />
        <img v-else class="livestream-chat-item__profile-photo" src="@/assets/images/home/profile-pic.png" />
        <span class="livestream-chat-item__name">{{ message.name }}：</span>
        <span class="livestream-chat-item__message">{{ message.content }}</span>
      </div>
    </div>
    <div class="livestream-chat-input-wrapper">
      <el-form class="livestream-chat-input-inner-wrapper" @submit.enter.prevent>
        <el-input
          v-model="messageToSend"
          class="livestream-chat-input"
          :placeholder="inputConfig.placeholder"
          :disabled="inputConfig.disabled"
          autocomplete="off"
        />
        <el-popover popper-class="livestream-chat-emoji-popper" trigger="click" placement="top">
          <div ref="emojiPickerRef"></div>
          <template #reference>
            <button class="livestream-chat-input-emoji-btn" type="button">
              <img :src="require(`@/assets/home/livestream/icon-emoji${isDark ? '-dark' : ''}.png`)" />
            </button>
          </template>
        </el-popover>

        <button
          class="livestream-chat-input-btn"
          type="submit"
          :disabled="!isMessageSendable"
          @click="handleSendChatMessage"
        >
          发弹幕
        </button>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { userStore } from "@/store";
import { useDark, useLocalStorage } from "@vueuse/core";
import { computed, nextTick, onMounted, ref, toRefs, watch } from "vue";
import { Vue3Marquee } from "vue3-marquee";
import BadgeChip from "./BadgeChip.vue";
import ChatFloatingPanel from "./ChatFloatingPanel.vue";
import { Picker } from "emoji-mart";

const now = Date.now();
const DEFAULT_ANNOUNCEMENT = "禁止发表任何广告、低俗色情、辱骂平台等违规言论!";

const props = defineProps(["messages", "livestreamData", "vipStatus", "isSystemLivestream"]);
const { messages, livestreamData, vipStatus } = toRefs(props);
const emit = defineEmits(["sendChatMessage"]);

const profilePhotoDir = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/profile/";
const store = userStore();
const isDark = useDark();

const messageToSend = ref("");
const chatListRef = ref(null);
const emojiPickerRef = ref(null);

const isLivestreamExisted = computed(() => typeof livestreamData.value?.id === "number");
const isMessageSendable = computed(
  () => messageToSend.value.trim().length > 0 && isLivestreamExisted.value && vipStatus.value
);
const displayAnnouncementList = computed(() => {
  // TODO: wait for the backend to return the site live message
  // if (livestreamData.value?.roomMessage) {
  //   return [livestreamData.value?.roomMessage];
  // }
  return [DEFAULT_ANNOUNCEMENT];
});
const inputConfig = computed(() => {
  let disabled = false;
  let placeholder = "请输入聊天内容";
  if (!store.token || !vipStatus.value || !isLivestreamExisted.value) {
    disabled = true;
    if (!vipStatus.value) placeholder = "VIP特权不足，无法发言";
    if (!store.token) placeholder = "请登录后发言";
    if (!isLivestreamExisted.value) placeholder = "直播尚未开始";
  }
  return {
    disabled,
    placeholder
  };
});

const handleSendChatMessage = () => {
  emit("sendChatMessage", messageToSend.value);
  messageToSend.value = "";
};

const calculateMaxContentLength = () => {
  let maxLength = 0;
  for (const announcement of displayAnnouncementList.value) {
    if (announcement.length > maxLength) {
      maxLength = announcement.length;
    }
  }
  return maxLength;
};

const handleEmojiSelect = (emoji) => {
  messageToSend.value += emoji.native;
};

watch(
  messages,
  async () => {
    if (chatListRef.value) {
      const isAtBottom =
        chatListRef.value.scrollTop + chatListRef.value.clientHeight >= chatListRef.value.scrollHeight - 10;
      await nextTick();
      if (isAtBottom) {
        chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  const picker = new Picker({
    data: async () => {
      const response = await fetch(`/emoji.json`);
      return response.json();
    },
    locale: "zh",
    theme: isDark.value ? "dark" : "light",
    skinTonePosition: "none",
    onEmojiSelect: handleEmojiSelect
  });
  emojiPickerRef.value.appendChild(picker);
});
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.livestream-chat-wrapper {
  @include livestream-content-block;
  display: flex;
  flex-direction: column;
  background-color: #edf6ff;
  overflow: hidden;

  .livestream-chat-announcement-wrapper {
    @include livestream-content-block;
    display: flex;
    align-items: center;
    padding: 6px 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .livestream-chat-announcement-icon {
      margin-right: 8px;
      max-width: 20px;
    }

    .livestream-chat-announcement-marquee {
      font-size: 12px;
      color: #7a80a1;
    }
  }

  .livestream-chat-list {
    flex: 1;
    padding: 12px 11px 0;
    overflow: auto;
    position: relative;
    --chat-item-gap: 8px;

    .livestream-chat__chat-panel {
      margin-bottom: var(--chat-item-gap);
    }

    .livestream-chat-item {
      background-color: #ffffff80;
      border-radius: 4px;
      width: max-content;
      max-width: 100%;
      padding: 6px 8px 0.5px;
      margin-bottom: var(--chat-item-gap);
      word-wrap: break-word;
      font-size: 12px;

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
    padding: 22px 11px;

    .livestream-chat-input-inner-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7.55px;
      box-shadow: 0px 0px 7.55px 0px #a9c9ea inset;
      border-radius: 13.21px;

      .livestream-chat-input {
        background: #f7f8fb;
        &.is-disabled {
          background-color: transparent;
          :deep(.el-input__wrapper) {
            background-color: transparent;
          }
        }
      }
      .livestream-chat-input-emoji-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;

        img {
          max-width: 20px;
        }
      }

      .livestream-chat-input-btn {
        background-color: transparent;
        border: 0.94px solid #4c88f8;
        border-radius: 13.21px;
        padding: 5.66px 17.56px;
        font-size: 13px;
        line-height: 18px;
        white-space: nowrap;
        color: #4c88f8;
        &:disabled {
          cursor: not-allowed;
          color: #b0b0b0 !important;
          border-color: #b0b0b0 !important;
        }
      }
    }
  }
}

.dark {
  .livestream-chat-wrapper {
    background-color: #17223e;
    box-shadow: 2px 4px 10px 0px #00194b52;
    border: none;

    .livestream-chat-announcement-wrapper {
      background-color: #333e5e;
      box-shadow: 2px 4px 10px 0px #0000001a;
      .livestream-chat-announcement-marquee {
        color: #d8d8d8;
      }
    }

    .livestream-chat-list {
      .livestream-chat-item {
        background-color: #2e406580;

        .livestream-chat-item__name {
          color: #b5b5b5;
        }

        .livestream-chat-item__message {
          color: #fff;
        }
      }
    }

    .livestream-chat-input-wrapper {
      background-color: #333e5e;
      box-shadow: 0px -6px 10px 0px #0000001a;
      .livestream-chat-input-inner-wrapper {
        background-color: #697eb330;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;

        .livestream-chat-input {
          --el-input-bg-color: transparent;
          --el-input-text-color: #fff;
          background-color: transparent;
          box-shadow: none;
        }

        .livestream-chat-input-btn {
          background: linear-gradient(180deg, rgba(72, 100, 181, 0.5) 0%, rgba(25, 39, 85, 0.5) 100%);
          border: 0.84px solid #799df8;
          box-shadow: 0px 6.75px 6.75px 0px #08253d73;
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.livestream-chat-input {
  .el-input__wrapper {
    box-shadow: none !important;
  }
}

.el-popper.is-light.livestream-chat-emoji-popper {
  background-color: transparent;
  box-shadow: none;
  border: none;
  .el-popper__arrow {
    display: none;
  }
}
</style>

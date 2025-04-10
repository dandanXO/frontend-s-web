<template>
  <div class="livestream-chat-wrapper">
    <div ref="chatListRef" class="livestream-chat-list">
      <div v-for="(message, index) in messages" :key="index" class="livestream-chat-item">
        <div class="livestream-chat-item__name">{{ message.name }}</div>
        <div class="livestream-chat-item__message">{{ message.content }}</div>
      </div>
    </div>
    <div class="livestream-chat-input-wrapper">
      <el-form class="livestream-chat-input-inner-wrapper" @submit.enter.prevent>
        <el-input
          v-model="messageToSend"
          class="livestream-chat-input"
          placeholder="请输入聊天内容"
          autocomplete="off"
        />
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
import { computed, nextTick, ref, toRefs, watch } from "vue";

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
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.livestream-chat-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #edf6ff;
  border: 0.94px solid #ffffff;
  border-radius: 15px;
  box-shadow: 0px 3.77px 20.76px 0px #00000026;
  overflow: hidden;

  .livestream-chat-list {
    flex: 1;
    padding: 17px 11px 0;
    overflow: auto;

    .livestream-chat-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 11.32px;

      .livestream-chat-item__name {
        margin-bottom: 5.7px;
        font-size: 11px;
        line-height: 15px;
        font-weight: 600;
        color: #333333;
      }

      .livestream-chat-item__message {
        @include livestream-content-block;
        max-width: 100%;
        padding: 6px 9px;
        border-top-left-radius: 0;
        font-size: 11px;
        line-height: 15px;
        color: #333333;
        word-wrap: break-word;
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

    .livestream-chat-list {
      .livestream-chat-item {
        .livestream-chat-item__name {
          color: #fff;
        }

        .livestream-chat-item__message {
          background-color: #2e4065;
          box-shadow: 0px 2px 8px 0px #0000001a;
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
</style>

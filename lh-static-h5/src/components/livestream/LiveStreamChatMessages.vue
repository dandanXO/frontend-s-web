<template>
  <div class="livestream-chat-wrapper">
    <div ref="chatListRef" class="livestream-chat-list">
      <div v-for="(message, index) in messages" :key="index" class="livestream-chat-item">
        <div class="livestream-chat-item__name">{{ message.name }}</div>
        <div class="livestream-chat-item__message">{{ message.content }}</div>
      </div>
    </div>
    <div class="livestream-chat-input-wrapper" :style="chatBoxStyle">
      <q-form class="livestream-chat-input-inner-wrapper q-px-md" @submit.enter.prevent>
        <q-btn class="bet-btn" rounded label="投一注" />

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
</template>
<script setup>
import { computed, nextTick, ref, toRefs, watch, onMounted, onBeforeUnmount, onUnmounted } from "vue";

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

// generate stimulation chat
let messageInterval = null;
const randomUsernames = [
  "进球大师99",
  "足球狂热者",
  "射手王",
  "传球专家",
  "VAR不行",
  "点球英雄",
  "红牌裁判",
  "越位巫师",
  "过人之神",
  "反击之王",
  "头球怪兽",
  "超级替补",
  "防守之墙",
  "门神",
  "任意球传奇",
  "金靴奖",
  "狂热球迷",
  "横幅制作人",
  "球场歌手",
  "最后时刻英雄"
];

const randomMessages = [
  "比赛结束！精彩比赛！⚽",
  "太棒的传球！🔥",
  "裁判你瞎了吗？！🤬",
  "又是越位？！🤦‍♂️",
  "VAR真是毁了足球 😡",
  "精彩进球！🚀",
  "门将今天真是神勇！🧤",
  "传控流最强！👏",
  "这是什么恶意犯规！😬",
  "红牌来了！🟥",
  "反击开始，GO GO GO！⚡",
  "头球进了！🎯",
  "该换人了！🔄",
  "点球！🥅",
  "加时赛戏剧性时刻！⏳",
  "大家加油，前场压上！🔥",
  "防守啊，防守！🏰",
  "神扑！🧤",
  "0-0无聊比赛... 😴",
  "中场在哪里？！🤔",
  "90+5的绝杀来了！🚀",
  "我们需要奇迹！🙏"
];

// Function to generate random chat messages
const generateRandomMessages = () => {
  const messageCount = Math.floor(Math.random() * 2) + 2; // Random between 2 to 6 messages

  for (let i = 0; i < messageCount; i++) {
    const randomUsernameIndex = Math.floor(Math.random() * randomUsernames.length);
    const randomMessageIndex = Math.floor(Math.random() * randomMessages.length);

    const randomMessage = {
      name: randomUsernames[randomUsernameIndex],
      content: randomMessages[randomMessageIndex]
    };

    messages.value.push(randomMessage);
  }
};

// Start generating random messages every 2-5 seconds
onMounted(() => {
  // messageInterval = setInterval(generateRandomMessages, Math.random() * 10000 + 2000);
});

// Stop generating messages when component is destroyed
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
    margin-top: calc(46.25vw + 38px); // background: salmon;
    max-height: calc(100dvh - 46.25vw - 38px - 60px);
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
        border-radius: 0px 50px 50px 50px;
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
    height: 60px;
    display: flex;
    align-items: center;

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
        border: 0.94px solid #4c88f8;
        border-radius: 13.21px;
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
}
</style>

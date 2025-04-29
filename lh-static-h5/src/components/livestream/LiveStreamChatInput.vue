<template>
  <div class="chat-input-container">
    <q-btn class="bet-btn" rounded>投一注</q-btn>

    <q-input
      v-model="chatMessage"
      class="chat-input"
      placeholder="输入您的消息..."
      @keyup.enter="sendDanmu"
      outlined
      rounded
      dense
    >
      <template v-slot:append>
        <div>
          <q-btn @click="sendDanmu" rounded outline color="primary" label="发弹幕" />
        </div>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { userStore } from "stores/index";
import Danmu from "danmu.js";

const emit = defineEmits(["sendMessage"]);

const chatMessage = ref("");
const store = userStore();
let danmu = new Danmu({
  container: document.body,
  engine: "canvas"
});

const sendDanmu = () => {
  if (chatMessage.value.trim()) {
    const message = chatMessage.value;
    const userName = store.realName || "User";

    emit("sendMessage", { user: userName, message });

    // Send as Danmu (弹幕)
    danmu.emit({
      text: message,
      color: "#ffffff",
      size: 20
    });

    danmu.sendComment({
      duration: 15000,
      start: 3000,
      txt: message,
      style: {
        color: "#ffffff",
        fontSize: "14px",
        textShadow: "1px 3px 3px black"
      }
    });

    chatMessage.value = "";
  }
};
</script>

<style scoped>
.chat-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #ffffff;
  z-index: 9999;
}

.chat-input {
  flex: 1;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  border-radius: 50px;
}

.bet-btn {
  background: linear-gradient(180deg, #1745ff 0%, #69fffa 100%);
  color: #fff;
}
</style>

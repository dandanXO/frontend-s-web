<template>
  <div class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 38px auto 50px; width: 100%"
    />
    <div class="livestream-inner-wrapper">
      <LivestreamList class="livestream-list" />
      <CurrentLivestream />
      <LivestreamChat class="livestream-chat" :messages @send-chat-message="handleSendChatMessage" />
      <LivestreamVideo :danmuList :urls />
    </div>
  </div>
</template>
<script setup>
import LivestreamList from "@/components/home/livestream/LivestreamList.vue";
import CurrentLivestream from "@/components/home/livestream/CurrentLivestream.vue";
import LivestreamChat from "@/components/home/livestream/LivestreamChat.vue";
import LivestreamVideo from "@/components/home/livestream/LivestreamVideo.vue";
import { onMounted, ref } from "vue";
import { userStore } from "@/store";

const store = userStore();

const messages = ref([]);
const danmuList = ref([]);
const urls = ref([
  { name: "线路1", url: "" },
  { name: "线路2", url: "" },
  { name: "线路3", url: "" }
]);

const handleSendChatMessage = (message) => {
  if (!store.hasToken()) {
    store.loginPageVisible = true;
    return;
  }
  messages.value.push({
    content: message,
    name: store.nickName
  });
  danmuList.value = [message];
};

onMounted(() => {
  // setInterval(() => {
  //   const _messages = [];
  //   for (let i = 0; i < 1000; i++) {
  //     const randomIndex = Math.floor(Math.random() * mockMessagePool.length);
  //     const randomUserNameIndex = Math.floor(Math.random() * mockUserNamePool.length);
  //     _messages.push({
  //       name: mockUserNamePool[randomUserNameIndex],
  //       content: mockMessagePool[randomIndex]
  //     });
  //   }
  //   messages.value.push(..._messages);
  //   danmuList.value = _messages.map((item) => item.content);
  // }, 2000);
});
</script>
<style lang="scss" scoped>
.livestream-container {
  --grid-gap: 18.87px;
  max-width: 1320px;
  margin: 0 auto;

  .livestream-inner-wrapper {
    display: grid;
    grid-template-columns: 957.72px 306.66px;
    grid-template-rows: auto auto 1fr;
    gap: var(--grid-gap);
    padding: 18px;
    border: 2px solid #fff;
    border-radius: 15px;
    box-shadow: 0px 0px 5.76px 4.72px #22446e21 inset;

    .livestream-list {
      grid-column: 1 / span 2;
    }
    .livestream-chat {
      grid-row: 2 / span 2;
      grid-column: 2;
      height: 633px;
    }
  }
}
</style>

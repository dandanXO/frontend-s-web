<template>
  <div class="livestream-container">
    <img
      src="@/assets/home/livestream/livestream-title-light.png"
      style="display: flex; margin: 38px auto 50px; width: 100%"
    />
    <div class="livestream-inner-wrapper">
      <LivestreamList v-model="currentLive" class="livestream-list" :list />
      <CurrentLivestream :livestream-data="currentLiveData" />
      <LivestreamChat class="livestream-chat" :messages="fullMessages" @send-chat-message="handleSendChatMessage" />
      <LivestreamVideo :danmuList :livestream-data="currentLiveData" />
    </div>
  </div>
</template>
<script setup>
import LivestreamList from "@/components/home/livestream/LivestreamList.vue";
import CurrentLivestream from "@/components/home/livestream/CurrentLivestream.vue";
import LivestreamChat from "@/components/home/livestream/LivestreamChat.vue";
import LivestreamVideo from "@/components/home/livestream/LivestreamVideo.vue";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { userStore } from "@/store";
import { getChatHistory, getLivestreamList, sendChat } from "@/api/index/livestream";

const MESSAGE_SYNC_INTERVAL = 1000 * 10; // 2 seconds
const MESSAGE_HISTORY_DANMU_FIRE_GAP = 10;

const store = userStore();

const messages = ref([]);
const danmuList = ref([]);
const list = ref([]);
const currentLive = ref(0);
const messageTimer = ref(null);
const lastSyncMessageTime = ref(Date.now());
const unsortMessages = ref([]);
// const channels = ref([
//   {
//     name: "线路1",
//     url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
//   }
//   // { name: "线路3", url: "" }
// ]);

const currentLiveData = computed(() => {
  if (!list.value.length) return {};
  return list.value[currentLive.value];
});

const fullMessages = computed(() => {
  return messages.value.concat(unsortMessages.value);
});

const handleSendChatMessage = (message) => {
  if (!store.hasToken()) {
    store.loginPageVisible = true;
    return;
  }
  sendChat({
    content: message,
    streamId: currentLiveData.value.id
  });
  messages.value.push({
    content: message,
    name: store.nickName,
    time: Date.now()
  });
  danmuList.value = [message];
};

const getData = () => {
  getLivestreamList().then((res) => {
    if (res.code === 0) {
      const parsedData = res.data.records.map((record) => {
        let parsedSupplierUrl = {};
        let parsedStreamerUrl = {};
        try {
          parsedSupplierUrl = JSON.parse(record.supplierCdnPullUrl);
          parsedStreamerUrl = JSON.parse(record.streamerCdnPullUrl);
        } catch (e) {
        } finally {
          return {
            ...record,
            supplierCdnPullUrl: parsedSupplierUrl,
            streamerCdnPullUrl: parsedStreamerUrl
          };
        }
      });
      list.value = parsedData;
    }
  });
};

const syncMessages = () => {
  messageTimer.value && clearTimeout(messageTimer.value);
  const now = Date.now();
  const pastTime = now - lastSyncMessageTime.value;

  const params = {
    siteId: process.env.VUE_APP_SITEID,
    streamId: currentLiveData.value.id,
    recordTime: [lastSyncMessageTime.value, now]
  };

  if (pastTime > MESSAGE_SYNC_INTERVAL) {
    lastSyncMessageTime.value = now;
    getChatHistory(params).then((res) => {
      if (res.code === 0) {
        const messagesFromApi = res.data.reduce((result, record) => {
          if (record.name !== store.nickName) {
            result.push({
              content: record.content,
              name: record.name,
              time: record.createTime
            });
          }

          return result;
        }, []);
        const combinedMessages = [...unsortMessages.value, ...messagesFromApi];
        combinedMessages.sort((a, b) => a.time - b.time);
        messages.value.push(...combinedMessages);
        unsortMessages.value = [];
        danmuList.value = messagesFromApi.map((item) => item.content);
      }
    });
  }
  messageTimer.value = setTimeout(() => {
    syncMessages();
  }, MESSAGE_SYNC_INTERVAL);
};

watch(currentLiveData, () => {
  messages.value = [];
  unsortMessages.value = [];
  danmuList.value = [];
  lastSyncMessageTime.value = Date.now();
  syncMessages();
});

onMounted(() => {
  getData();
  syncMessages();
});

onUnmounted(() => {
  if (messageTimer.value) {
    clearTimeout(messageTimer.value);
    messageTimer.value = null;
  }
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

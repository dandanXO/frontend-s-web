<template>
  <el-button :loading="loading" @click="triggerMonitor">触发已储存配置</el-button>
</template>

<script setup>
import { defineProps, getCurrentInstance, watch, ref } from "vue";
import { useStore } from "@/store";
import { WebSocketActionTypes } from "@/store/modules/socket/action-types";
import { ElMessage } from "element-plus";
const store = useStore()
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const loading = ref(false);

function triggerMonitor() {
  loading.value = true;

  const message = JSON.stringify({
    type: "MONITOR_TEST_TRIGGER",
    content: {
      monitorType: props.title,
      siteId: store.state.user.siteId
    }
  });

  socket.sendWSMessage(message)
}

watch(
  () => store.state.socket.event,
  (newEvents) => {
    newEvents.forEach(event => {
      handleReceivedWsEvent(event);
    });
  },
  { deep: true }
);

const handleReceivedWsEvent = (event) => {
  switch (event.event) {
    case 'MONITOR_TEST_TRIGGER_RES':
      if (event.code === "0") {
        ElMessage({
          message: '触发成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '触发失败',
          type: 'error',
        })
      }

      store.dispatch(WebSocketActionTypes.REMOVE_SOCKET_EVENTS, event);
      loading.value = false;
      break;
    default:
      break;
  }
};

</script>

<style scoped>
button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>

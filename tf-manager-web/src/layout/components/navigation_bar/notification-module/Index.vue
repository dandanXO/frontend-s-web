<script setup>
import { ref, watch, computed, getCurrentInstance } from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { useStore } from "@/store";
import { UserActionTypes } from "@/store/modules/user/action-types";
import { WebSocketActionTypes } from "@/store/modules/socket/action-types";
import { CircleCloseFilled } from '@element-plus/icons-vue';
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const store = useStore()
const socket = getCurrentInstance().appContext.config.globalProperties.$socket;
const router = useRouter();

const sendWSMessage = (jsonStr) => {
  if (socket && socket.webSocket && socket.webSocket.readyState === WebSocket.OPEN) {
    socket.webSocket.send(jsonStr);
  } else {
    console.error('WebSocket is not open.');
  }
};

const storeNotifications = computed(() => store.state.user.notifications);

const isNotificationDialogVisible = ref(false);

const toggleNotificationDialog = () => {
  isNotificationDialogVisible.value = !isNotificationDialogVisible.value;
};

const handleReceivedWsEvent = (event) => {
  switch (event.event) {
    case 'NOTIFICATION':
      store.dispatch(UserActionTypes.ACTION_REFRESH_NOTIFICATIONS, JSON.parse(event.notificationRecords));
      store.dispatch(WebSocketActionTypes.REMOVE_SOCKET_EVENTS, event);
      break;
    case 'MARK_NOTIFICATION_READ_RES':
      if (event.code === "0") {
        const notificationRecordIdToRemove = Number(event.notificationRecordId)
        const updatedNotificationRecords = storeNotifications.value.filter(notification => notification.id !== notificationRecordIdToRemove);
        store.dispatch(UserActionTypes.ACTION_REFRESH_NOTIFICATIONS, updatedNotificationRecords);
        store.dispatch(WebSocketActionTypes.REMOVE_SOCKET_EVENTS, event);
        ElMessage({
          message: 'success',
          type: 'success',
        })
      }
      break;
    default:
      break;
  }
};

watch(
  () => store.state.socket.event,
  (newEvents) => {
    newEvents.forEach(event => {
      handleReceivedWsEvent(event);
    });
  },
  { deep: true }
);

function markNotificationRead(notificationRecordId) {
  const message = JSON.stringify({
    type: "MARK_NOTIFICATION_READ",
    content: {
      systemUserId: store.state.user.id,
      notificationRecordId: notificationRecordId
    }
  });
  sendWSMessage(message)
}

const closeDialogAndRedirectTo = (path) => {
  isNotificationDialogVisible.value = false;
  router.push(path);
}

function getSiteNameBySiteId(siteId) {
  const site = store.state.user.sites.find(e => e.id === siteId)
  return site ? site.siteName : "";
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<template>
  <div v-if="storeNotifications.length > 0" title="通知" style="font-size: 30px; margin-right: 10px">
    <SvgIcon iconClass="manager-notification" @click="toggleNotificationDialog" style="cursor: pointer;" />
  </div>
  <div id="notification-dialog-wrapper">
    <el-dialog
      title="通知详情"
      v-model="isNotificationDialogVisible"
      width="40%"
    >
      <div class="notification-body">
        <div v-for="notification in storeNotifications" :key="notification.id" class="notification-content">
          <div class="notification-item">
            <el-icon :size="25" title="不再显示" class="notification-item-close">
              <CircleCloseFilled v-if="notification.id" @click="markNotificationRead(notification.id)" style="cursor: pointer;" />
            </el-icon>

            <div class="notification-item-header">
              <div class="notification-item-title">{{ notification.siteId ? `[${getSiteNameBySiteId(notification.siteId)}]` : '' }}] {{ $te(`monitorTitle.${notification.title}`) ? $t(`monitorTitle.${notification.title}`) : "Alert" }}</div>
              <div class="notification-item-datetime">{{ formatTimestamp(notification.createTime) }}</div>
            </div>
            <div class="notification-item-body">
              <div class="notification-item-content">{{ $te(`fields.${notification.content}`) ? $t(`fields.${notification.content}`) : notification.content }}</div>
            </div>
            <button title="跳转页面" v-if="notification.redirectionPath" @click="closeDialogAndRedirectTo(notification.redirectionPath)" class="notification-item-redirection">
              {{ $t('fields.redirect') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
#notification-dialog-wrapper {
  :deep(.el-dialog__header) {
    border-bottom: 2px solid rgb(177.3, 179.4, 183.6);
    padding: 0 10px;
  }
  :deep(.el-dialog__body) {
    padding: 10px 5px;
  }
}

.notification-body {
  max-height: 500px;
  overflow-y: auto;
}

.notification-content {
  margin: 0 5px 10px 5px;
}

.notification-content-left {
  display: flex;            /* 使用 flexbox */
  align-items: center;      /* 垂直居中 */
  justify-content: center;  /* 水平居中，如果需要的话 */
}

.notification-content-middle {
  border: 1px solid #d3d3d3;
  padding: 0 5px;
}

.notification-content-right-header {
  font-weight: bold;
  font-size: 20px;
  text-align: left;
  height: auto;
}

.notification-content-right-body {
  margin: 0 30px;
  text-align: center;
  font-size: 17px;
}

.notification-content-right-footer {
  font-size: 13px;
}

.notification-content-right-footer-right {
  text-align: end;
}

.notification-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  border: 1px solid #d3d3d3;
  padding: 10px;

  .notification-item-close {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .notification-item-header {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .notification-item-redirection {
    display: flex;
    margin-left: auto;
  }

  .notification-item-title {
    font-weight: bold;
  }

  .notification-item-title, .notification-item-content, .notification-item-datetime {
    line-height: 1rem;
  }

  .notification-item-datetime {
    padding-right: 15px;
    font-size: smaller;
  }
}
</style>

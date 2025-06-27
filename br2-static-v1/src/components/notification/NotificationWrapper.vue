<template>
  <div v-if="notificationQueue.length" class="notification-wrapper" @click="handleMaskClick">
    <TransitionGroup name="notification">
      <NotificationInstance
        v-for="(notification, index) in notificationQueue"
        :key="notification.id"
        :notification="notification"
        :style="{
          zIndex: notification.zIndex,
          top: `calc(40vh + ${NOTIFICATION_GAP * index}px)`
        }"
        @remove="handleNotificationRemove"
      />
    </TransitionGroup>
  </div>
</template>
<script setup>
import { useUI } from "stores/ui";
import { storeToRefs } from "pinia";
import NotificationInstance from "components/notification/NotificationInstance.vue";

const NOTIFICATION_GAP = 40;

const ui = useUI();
const { notificationQueue } = storeToRefs(ui);
const { removeNotification } = ui;

const handleNotificationRemove = (id, type) => {
  remove(id, type);
};

const handleMaskClick = () => {
  const notification = notificationQueue.value.slice(-1)[0];
  if (!notification) return;

  remove(notification.id, "cancel");
};

const remove = (id, type) => {
  removeNotification(id, type);
};
</script>
<style lang="scss" scoped>
.notification-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000cc;
  z-index: 9500;
}
</style>

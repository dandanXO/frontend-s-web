<template>
  <TransitionGroup name="notification">
    <NotificationInstance
      v-for="(notification, index) in notificationQueue"
      :key="notification.id"
      :id="notification.id"
      :type="notification.type"
      :params="notification.params"
      :message="notification.message"
      :timeout="notification.timeout"
      :style="{
        zIndex: notification.zIndex,
        top: `calc(40vh + ${NOTIFICATION_GAP * index}px)`
      }"
      @remove="handleNotificationRemove"
    />
  </TransitionGroup>
</template>
<script setup>
import { useUI } from "stores/ui";
import { storeToRefs } from "pinia";
import NotificationInstance from "components/notification/NotificationInstance.vue";

const NOTIFICATION_GAP = 40;

const ui = useUI();
const { notificationQueue } = storeToRefs(ui);
const { removeNotification } = ui;

const handleNotificationRemove = (id) => {
  setTimeout(() => removeNotification(id), 500);
};
</script>

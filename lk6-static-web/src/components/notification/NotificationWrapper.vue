<template>
  <TransitionGroup name="notification">
    <NotificationInstance
      v-for="(notification, index) in notificationQueue"
      :key="notification.id"
      :id="notification.id"
      :type="notification.type"
      :params="notification.params"
      :message="notification.message"
      :duration="notification.duration"
      :style="{
        zIndex: notification.zIndex,
        top: `calc(40vh + ${NOTIFICATION_GAP * index}px)`
      }"
      @remove="handleNotificationRemove"
    />
  </TransitionGroup>
</template>
<script setup>
import { uiStore } from "@/store/ui";
import { storeToRefs } from "pinia";
import NotificationInstance from "@/components/notification/NotificationInstance.vue";

const NOTIFICATION_GAP = 40;

const ui = uiStore();
const { notificationQueue } = storeToRefs(ui);
const { removeNotification } = ui;

const handleNotificationRemove = (id) => {
  setTimeout(() => removeNotification(id), 500);
};
</script>

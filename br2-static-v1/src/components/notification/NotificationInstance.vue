<template>
  <div class="notification-instance-wrapper" :class="notification.type" @click.stop>
    <div class="notification-img">
      <img
        v-if="notification.type === 'success' || notification.type === 'red-packet'"
        src="../../assets/images/notification/success.svg"
      />
      <img v-else-if="notification.type === 'error'" src="../../assets/images/notification/error.svg" />
      <img v-else-if="notification.type === 'info'" src="../../assets/images/notification/notification.svg" />
      <img v-else-if="notification.type === 'warning'" src="../../assets/images/notification/warning.svg" />
    </div>
    <div class="notification-description">
      <img v-if="notification.type === 'red-packet'" src="../../assets/images/notification/red-packet.png" />
      <span v-if="notification.message">{{ notification.message }}</span>
    </div>
    <div class="notification-action-wrapper">
      <button
        v-if="notification.actions.includes('cancel')"
        class="notification-action cancel"
        @click="$emit('remove', notification.id, 'cancel')"
      >
        {{ notification.confirmBtnText || $t("notification.cancel") }}
      </button>
      <button
        v-if="notification.actions.includes('confirm')"
        class="notification-action"
        :class="notification.type"
        @click="$emit('remove', notification.id, 'confirm')"
      >
        {{ notification.cancelBtnText || $t("notification.confirm") }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, toRefs } from "vue";

defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["remove"]);
</script>
<style lang="scss" scoped>
.notification-instance-wrapper {
  --notification-primary-color: #2a8fdc;
  --notification-red-pack-color: #ffefd0;
  position: fixed;
  max-width: 70%;
  min-height: 170px;
  width: 100%;
  background: #fff padding-box;
  border-radius: 18.56px;
  border: 5px solid #ffffff40;
  transform: translate(-50%, -50%);
  top: 50vh;
  left: 50vw;
  font-family: Microsoft YaHei UI;
  color: var(--notification-primary-color);
  transition: opacity 0.5s ease, top 0.5s ease;

  &.success,
  &.red-packet {
    --notification-primary-color: #13ba65;
  }

  &.error {
    --notification-primary-color: #ec2728;
  }

  &.warning {
    --notification-primary-color: #dc802a;
  }

  &.red-packet {
    .notification-description {
      margin-top: 40px;
    }
  }

  .notification-img {
    position: absolute;
    top: -32px;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 5px solid #ffffff40;
    width: 65px;
    height: 65px;
    // padding: 18px 0 20px;
    background: var(--notification-primary-color) padding-box;
  }

  .notification-description {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 16px 12px;
    margin: 54px auto 23px;
    width: 100%;
    font-size: 1rem;
    line-height: 1.375rem;
    text-align: center;
    img {
      width: 50%;
    }
  }

  .notification-action-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 16px;

    .notification-action {
      padding: 6px 25px;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      background-size: 100% 100%;
      background-position: center;
      border: 0.4px solid #383838;
      border-radius: 15px;
      background-color: transparent;
      background-image: url("../../assets/images/notification/btn-bg-info.png");

      &.cancel {
        background-image: url("../../assets/images/notification/btn-bg-cancel.png");
      }

      &.success,
      &.red-packet {
        background-image: url("../../assets/images/notification/btn-bg-success.png");
      }
      &.error {
        background-image: url("../../assets/images/notification/btn-bg-error.png");
      }
      &.warning {
        background-image: url("../../assets/images/notification/btn-bg-warning.png");
      }
    }
  }
}

@media (min-width: 550px) {
  .notification-instance-wrapper {
    max-width: 385px;
  }
}
</style>

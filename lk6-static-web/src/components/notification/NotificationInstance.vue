<template>
  <div class="notification-instance-wrapper" :class="type">
    <div class="notification-img">
      <img v-if="type === 'success'" src="@/assets/images/notification/success.svg" />
      <img v-else-if="type === 'error'" src="@/assets/images/notification/error.svg" />
      <img v-else-if="type === 'info'" src="@/assets/images/notification/notification.svg" />
      <img v-else-if="type === 'warning'" src="@/assets/images/notification/warning.svg" />
      <img v-else-if="type === 'red-packet'" src="@/assets/images/notification/red-packet.png" />
      <span v-if="type === 'red-packet' && params.redPacket" class="red-packet-label">
        彩金:{{ params.redPacket }}元
      </span>
    </div>
    <div class="notification-description">
      <img v-if="type === 'red-packet'" src="@/assets/images/notification/success.svg" />
      <span v-if="message">{{ message }}</span>
      <template v-else>
        <span v-if="type === 'success'">成功</span>
        <span v-else-if="type === 'error'">错误</span>
        <span v-else-if="type === 'info'">提示</span>
        <span v-else-if="type === 'warning'">警告</span>
        <span v-else-if="type === 'red-packet'">领取彩金成功</span>
        <span>未知提示</span>
      </template>
    </div>
  </div>
</template>
<script setup>
import { onMounted, toRefs } from "vue";

const props = defineProps({
  id: String,
  type: String,
  params: Object,
  message: String,
  duration: Number
});
const { duration, id } = toRefs(props);

const emit = defineEmits(["remove"]);

onMounted(() => {
  if (!duration.value) return;
  setTimeout(() => {
    emit("remove", id.value);
  }, duration.value);
});
</script>
<style lang="scss" scoped>
.notification-instance-wrapper {
  --notification-primary-color: #468cff;
  --notification-primary-bg-color: #f1f4fd;
  --notification-red-pack-color: #ffefd0;
  --notification-bg-color: #ffffffcc;
  --notification-box-shadow: #00000026;
  position: fixed;
  min-width: 260px;
  box-shadow: 0px 0px 10px 0px var(--notification-box-shadow);
  background: var(--notification-bg-color);
  border-radius: 10px;
  overflow: hidden;
  transform: translate(-50%, -50%);
  top: 50vh;
  left: 50vw;
  color: var(--notification-primary-color);
  transition: opacity 0.5s ease, top 0.5s ease;
  background: url('../../assets/images/common/dialog-body-bg.jpg') center center no-repeat !important;
  background-size: 100% 100% !important;
  width: 304px;
  height: 213px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &.success,
  &.red-packet {
    --notification-primary-color: #52c41a;
    --notification-primary-bg-color: #f4fcf1;
  }

  &.error {
    --notification-primary-color: #ed2222;
    --notification-primary-bg-color: #fef0f1;
  }

  &.warning {
    --notification-primary-color: #ff9900;
    --notification-primary-bg-color: #fff9ef;
  }

  &.red-packet {
    .notification-img {
      position: relative;

      img {
        width: 191px;
      }
      .red-packet-label {
        position: absolute;
        bottom: 40px;
        font-size: 18px;
        font-weight: 700;
        line-height: 23.94px;
        color: #ffefd0;
      }
    }
  }

  .notification-img {
    display: flex;
    justify-content: center;
    padding: 18px 0 20px;
    margin: 0 auto;
    backdrop-filter: blur(5px);
  }

  .notification-description {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 16px 12px;
    width: 100%;
    font-size: 16px;
    line-height: 21.28px;
    text-align: center;
    img {
      width: 21px;
    }
  }
}

.dark {
  .notification-instance-wrapper {
    --notification-bg-color: #202a39;
  }
}
</style>

<template>
  <div class="chat-floating-panel-wrapper" @click="handleClick">
    <div class="chat-floating-panel__avatar-wrapper">
      <img class="chat-floating-panel__avatar" :src="avatarUrl" loading="lazy" />
    </div>
    <div v-if="livestreamData.id" class="chat-floating-panel__tag-wrapper">
      <div class="chat-floating-panel__tag streamer">
        {{ isSystemLivestream ? "官方直播间" : "主播" }}
      </div>
      <div class="chat-floating-panel__tag sport-type">
        {{ currentSportType }}
      </div>
    </div>
    <div v-if="roomMessage" class="chat-floating-panel__room-message" :class="{ expanded: isExpanded }">
      {{ roomMessage }}
    </div>
  </div>
</template>
<script setup>
import { SPORT_TYPE_LIST } from "@/constant/sportType";
import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";

const props = defineProps(["livestreamData", "isSystemLivestream"]);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const isExpanded = ref(true);

const currentSportType = computed(() => {
  const target = SPORT_TYPE_LIST.find((item) => item.value === props.livestreamData?.sportId);
  return target ? target.text : "";
});

const roomMessage = computed(() => {
  if (isExpanded.value) {
    return props.livestreamData?.roomMessage;
  } else {
    return props.livestreamData?.roomMessage?.split("\n")[0] || "";
  }
});

const avatarUrl = computed(() => {
  if (props.isSystemLivestream) {
    return require("@/assets/home/livestream/system-avatar.png");
  } else {
    return imgURL + props.livestreamData?.avatar;
  }
});

const handleClick = () => {
  return;
  isExpanded.value = !isExpanded.value;
};
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.chat-floating-panel-wrapper {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.66px 0px #a2bff4 inset, 0px 4px 4.5px 0px #00000029;
  background: linear-gradient(180deg, #d8eaff 0%, #fdfeff 100%);
  padding: 14px 10px;
  border-radius: 8px;
  position: sticky;
  top: 0;

  .chat-floating-panel__avatar-wrapper {
    .chat-floating-panel__avatar {
      @include img-pseudo;
      display: block;
      max-width: 100%;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
    }
  }

  .chat-floating-panel__tag-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    .chat-floating-panel__tag {
      border-radius: 12px;
      padding: 2px 12px;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      text-align: center;
      &.streamer {
        background-color: #bbaef9;
        color: #8800ff;
      }
      &.sport-type {
        background-color: #fbcd74;
        color: #c84e16;
      }
    }
  }

  .chat-floating-panel__room-message {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    grid-column: 1 / span 2;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transition: all 0.3s ease-in-out;

    &.expanded {
      white-space: pre;
    }
  }
}

.dark {
  .chat-floating-panel-wrapper {
    background: url(@/assets/home/livestream/chat-floating-panel-bg-dark.png) no-repeat;
    background-size: 100% 100%;
    box-shadow: 0px 4px 4px 0px #00000040;
  }
}
</style>

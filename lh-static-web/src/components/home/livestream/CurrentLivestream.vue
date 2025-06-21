<template>
  <div class="current-livestream-wrapper">
    <div class="current-livestream__streamer-info-wrapper">
      <div class="current-livestream__streamer-info">
        <div class="current-livestream__streamer-info__avatar">
          <img :src="avatarUrl" loading="lazy" />
        </div>
        <span class="current-livestream__streamer-info__name">
          {{ isSystemLivestream ? "雷火" : livestreamData.name }}
        </span>
        <div v-if="livestreamData.liveStatus" class="current-livestream__streamer-info__on-air">正在直播</div>
      </div>
    </div>

    <div v-if="livestreamData.id" class="current-livestream__livestream-info">
      <span class="current-livestream__livestream-info__title">
        {{ livestreamData.roomTitle }}
      </span>
      <BadgeChip class="current-livestream__livestream-info__badge-tag" :level="8">五星公会</BadgeChip>
      <div class="current-livestream__livestream-info__tag-wrapper">
        <div class="current-livestream__livestream-info__tag">
          {{ isSystemLivestream ? "官方直播间" : "主播" }}
        </div>
        <div v-if="currentSportType" class="current-livestream__livestream-info__tag">
          {{ currentSportType }}
        </div>
      </div>
    </div>

    <button class="current-livestream__bet-btn" @click="$emit('click')">投一注</button>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import BadgeChip from "./BadgeChip.vue";
import { computed } from "vue";
import { SPORT_TYPE_LIST } from "../../../constant/sportType";

const props = defineProps({
  livestreamData: {
    type: Object,
    default: () => ({})
  },
  isSystemLivestream: Boolean
});
defineEmits(["click"]);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const imgStreamerURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/streamer/";

const currentSportType = computed(() => {
  const target = SPORT_TYPE_LIST.find((item) => item.value === props.livestreamData?.sportId);
  return target ? target.text : "";
});

const avatarUrl = computed(() => {
  if (props.isSystemLivestream) {
    return require("@/assets/home/livestream/system-avatar.png");
  } else if (props.livestreamData?.avatar) {
    return imgStreamerURL + props.livestreamData?.avatar;
  } else {
    return require("@/assets/images/profile/default-1.png");
  }
});
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.current-livestream-wrapper {
  @include livestream-content-block;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .current-livestream__streamer-info-wrapper {
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    padding: 0 26px 0 40px;
    border-radius: 22px;
    box-shadow: 0px 1.89px 4.32px 0px #bbdcff inset, 0px -0.94px 3.46px 0px #a2bff4 inset;

    .current-livestream__streamer-info {
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      margin-left: -40px;

      img {
        max-width: 40px;
        display: block;
        border-radius: 50%;
      }
      .current-livestream__streamer-info__name {
        font-size: 15px;
        line-height: 21px;
        color: #7a80a1;
      }
      .current-livestream__streamer-info__on-air {
        @include livestream-on-air;
        position: absolute;
        bottom: -4px;
      }
      .current-livestream__streamer-info__avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        img {
          @include img-pseudo;
          max-width: 100%;
          width: 100%;
          aspect-ratio: 1;
        }
      }
    }
  }

  .current-livestream__livestream-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    padding-left: 16px;

    .current-livestream__livestream-info__title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
    }

    .current-livestream__livestream-info__badge-tag {
      :deep(.badge-chip__badge) {
        max-width: 30px;
      }
      :deep(.badge-chip__text) {
        font-size: 12px;
        line-height: 22px;
      }
    }

    .current-livestream__livestream-info__tag-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      .current-livestream__livestream-info__tag {
        border: 1px solid #7a80a1;
        border-radius: 12px;
        padding: 2px 14px;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        color: #7a80a1;
        text-align: center;
      }
    }
  }

  .current-livestream__bet-btn {
    background: linear-gradient(180deg, #1745ff 0%, #69fffa 100%);
    box-shadow: 0px -1.89px 4.32px 0px #b1d7ff inset, 0px -0.94px 3.46px 0px #5894ff inset;
    padding: 10px 45px;
    border-radius: 22px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    color: #fff;
  }
}

.dark {
  .current-livestream-wrapper {
    .current-livestream__streamer-info-wrapper {
      background: #405471;
      box-shadow: none;

      .current-livestream__streamer-info {
        .current-livestream__streamer-info__name {
          color: #fff;
        }
      }
    }

    .current-livestream__livestream-info {
      color: #fff;
      .current-livestream__livestream-info__tag-wrapper {
        .current-livestream__livestream-info__tag {
          border-color: #fff;
          color: #fff;
        }
      }
    }

    .current-livestream__bet-btn {
      background: url("@/assets/home/livestream/livestream-item-bg-dark.png") no-repeat center center;
      background-size: 100% 100%;
      box-shadow: none;
      border-radius: 6px;
    }
  }
}
</style>

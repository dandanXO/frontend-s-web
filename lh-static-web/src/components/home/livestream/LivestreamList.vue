<template>
  <swiper class="livestream-list-wrapper" v-bind="swiperConfig" @swiper="handleSwiper">
    <swiper-slide v-for="live in list" :key="live.streamId">
      <div
        class="livestream-list-item"
        :class="{
          selected: model === live.streamId
        }"
        @click="handleLivestreamClick(live.streamId)"
      >
        <div class="livestream-list-item__title">{{ live.title }}</div>
        <div class="livestream-list-item__match-info">
          <div class="livestream-list-item__match-info__team">
            <div class="livestream-list-item__match-info__team-emblem">
              <img :src="live.homeIcon || systemAvatarImg" loading="lazy" />
            </div>
            <span class="livestream-list-item__match-info__team-name">
              {{ live.homeNameZh || live.homeNameEn || live.homeName }}
            </span>
          </div>

          <div class="livestream-list-item__match-info__date">
            <div v-if="live.liveStatus" class="livestream-list-item__match-info__date__on-air">正在直播</div>
            <div v-else class="livestream-list-item__match-info__date__date">
              {{ getDisplayDateTime(live.eventStartTime) }}
            </div>
            <span class="livestream-list-item__match-info__date__vs">VS</span>
          </div>

          <div class="livestream-list-item__match-info__team">
            <div class="livestream-list-item__match-info__team-emblem">
              <img :src="live.awayIcon || systemAvatarImg" loading="lazy" />
            </div>
            <span class="livestream-list-item__match-info__team-name">
              {{ live.awayNameZh || live.awayNameEn || live.awayName }}
            </span>
          </div>
        </div>
        <div class="livestream-list-item__badge-wrapper">
          <div class="livestream-list-item__badge">
            <img v-if="live.name === 'SYSTEM'" src="@/assets/home/livestream/system-avatar.png" loading="lazy" />
            <img v-else-if="live.avatar" :src="imgStreamerURL + live.avatar" loading="lazy" />
            <img v-else src="@/assets/images/profile/default-1.png" loading="lazy" />
            {{ live.name === "SYSTEM" ? "雷火" : live.name }}
          </div>
        </div>
      </div>
    </swiper-slide>
    <div
      v-if="isLivestreamListLoading"
      v-loading="true"
      element-loading-background="transparent"
      class="livestream-list__pseudo"
    />
  </swiper>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import systemAvatarImg from "@/assets/home/livestream/system-avatar.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { computed, ref, toRefs, watch } from "vue";

const props = defineProps({
  list: Array,
  isLivestreamListLoading: Boolean
});
const { list } = toRefs(props);

const model = defineModel({ type: String });
const emit = defineEmits(["scroll-reach-right"]);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const imgStreamerURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/streamer/";

const swiperInstance = ref(null);

const swiperConfig = computed(() => {
  const SLIDE_PER_VIEW = 4;
  return {
    slidesPerView: SLIDE_PER_VIEW,
    slidesPerGroup: SLIDE_PER_VIEW,
    spaceBetween: 20,
    modules: [Navigation],
    navigation: props.list.length > SLIDE_PER_VIEW,
    allowTouchMove: false
  };
});

const handleLivestreamClick = (index) => {
  model.value = index;
};

const handleSwiper = (_swiperInstance) => {
  swiperInstance.value = _swiperInstance;
};

const getDisplayDateTime = (date) => {
  const today = moment().startOf("day");
  const eventDate = moment(date);
  const eventDateStart = moment(date).startOf("day");
  const diffInDays = eventDateStart.diff(today, "days");

  if (diffInDays === 0) {
    return eventDate.format("今日 HH:mm");
  } else if (diffInDays === 1) {
    return eventDate.format("明日 HH:mm");
  } else {
    return eventDate.format("MM/DD HH:mm");
  }
};

watch(model, () => {
  if (!swiperInstance.value) return;
  const currentIndex = list.value.findIndex((item) => item.streamId === model.value);
  if (currentIndex === -1) return;
  swiperInstance.value.slideTo(currentIndex, 0);
});

watch(list, () => {
  const currentIndex = list.value.findIndex((item) => item.streamId === model.value);
  if (currentIndex === -1) {
    swiperInstance.value.slideTo(0, 0);
  } else {
    swiperInstance.value.slideTo(currentIndex, 0);
  }
});
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.livestream-list-wrapper {
  display: flex;
  gap: 18.87px;
  padding: 0 18px 18px 0;
  align-items: center;
  margin: 0 -14px -28px 0;
  --swiper-navigation-color: #3981ff;

  :deep(.swiper-button-next) {
    right: 28px;
  }

  .livestream-list-item {
    --livestream-badge-gap: 6px;
    --livestream-img-size: 60px;
    @include livestream-content-block;
    position: relative;
    padding: 11px 0;
    margin: calc(var(--livestream-img-size) / 2 + var(--livestream-badge-gap)) 0 0;
    cursor: pointer;

    &.selected {
      border: 2px solid #468cff;
      background: #468cff1a;
      &::after {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #468cff;
      }
    }

    .livestream-list-item__title {
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      text-align: center;
      color: #333333;
    }
    .livestream-list-item__match-info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .livestream-list-item__match-info__team {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        flex-basis: 33%;
        max-width: 33%;
        .livestream-list-item__match-info__team-emblem {
          @include livestream-team-emblem;
        }
        .livestream-list-item__match-info__team-name {
          font-size: 12px;
          line-height: 15px;
          color: #7a80a1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 100%;
        }
      }
    }

    .livestream-list-item__match-info__date {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      .livestream-list-item__match-info__date__on-air {
        @include livestream-on-air;
      }
      .livestream-list-item__match-info__date__date {
        font-size: 11px;
        line-height: 15px;
        color: #7a80a1;
      }
      .livestream-list-item__match-info__date__vs {
        font-size: 16px;
        line-height: 23px;
        color: #3981ff;
      }
    }

    .livestream-list-item__badge-wrapper {
      position: absolute;
      top: calc(-1 * var(--livestream-badge-gap));
      left: 0;
      margin-left: calc(var(--livestream-img-size) / 2 + var(--livestream-badge-gap));
      transform: translateY(-50%);
      background: linear-gradient(
        259.14deg,
        #ffecce 11.64%,
        #f3cd92 27.82%,
        #fff2ca 52.4%,
        #efd190 72.12%,
        #e4bd80 99.13%
      );
      border: 0.94px solid #d3aa69;
      border-radius: 8px;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;

      .livestream-list-item__badge {
        position: relative;
        padding: 4px 14px 4px 28px;
        font-size: 11px;
        line-height: 15px;
        color: #000000;
        img {
          @include img-pseudo;
          position: absolute;
          top: 50%;
          left: -6px;
          transform: translate(-50%, -50%);
          border: 1px solid #d3aa69;
          border-radius: 50%;
          background: linear-gradient(
            259.14deg,
            #ffecce 11.64%,
            #f3cd92 27.82%,
            #fff2ca 52.4%,
            #efd190 72.12%,
            #e4bd80 99.13%
          );
          width: var(--livestream-img-size);
          aspect-ratio: 1;
        }
      }
    }
  }

  .livestream-list__pseudo {
    flex: 0 0 calc(25% - 12.87px);
    height: 100%;
    :deep(.path) {
      stroke: #4c88f8;
    }
  }
}

.dark {
  .livestream-list-wrapper {
    --swiper-navigation-color: #fff;
    .livestream-list-item {
      &.selected {
        background: url("@/assets/home/livestream/livestream-item-bg-dark.png") no-repeat center center;
        background-size: 100% 100%;
        background-clip: border-box;
        border-color: transparent;
        &::after {
          border-top: 10px solid #6691ff;
        }

        .livestream-list-item__match-info__date {
          .livestream-list-item__match-info__date__vs {
            color: #fff;
          }
        }
      }

      .livestream-list-item__title {
        color: #fff;
      }
      .livestream-list-item__match-info {
        .livestream-list-item__match-info__team {
          .livestream-list-item__match-info__team-emblem {
            @include livestream-team-emblem;
          }
          .livestream-list-item__match-info__team-name {
            color: #fff;
          }
        }
      }

      .livestream-list-item__match-info__date {
        .livestream-list-item__match-info__date__date {
          color: #fff;
        }
      }
    }

    .livestream-list__pseudo {
      :deep(.path) {
        stroke: #fff;
      }
    }
  }
}
</style>

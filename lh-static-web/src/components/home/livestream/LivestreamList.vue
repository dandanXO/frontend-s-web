<template>
  <div class="livestream-list-wrapper">
    <swiper class="livestream-list-swiper" v-bind="swiperConfig" @swiper="handleSwiper">
      <swiper-slide v-for="live in list" :key="live.streamId">
        <div
          class="livestream-list-item"
          :class="{
            selected: model === live.streamId
          }"
          @click="handleLivestreamClick(live.streamId)"
        >
          <div class="livestream-list-item__title" :title="live.title">{{ live.title }}</div>
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
              <div v-if="live.liveStatus" class="livestream-list-item__match-info__date__on-air">
                正在直播
                <img src="@/assets/home/livestream/on-air.gif" alt="正在直播" />
              </div>
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
    <button
      class="livestream-list__navigation-btn prev"
      :class="{ disabled: navigationStatus.prev }"
      @click="handlePrevClick"
    >
      <img src="@/assets/home/livestream/icon-arrow-left.svg" alt="Previous" />
    </button>
    <button
      class="livestream-list__navigation-btn next"
      :class="{ disabled: navigationStatus.next }"
      @click="handleNextClick"
    >
      <img src="@/assets/home/livestream/icon-arrow-left.svg" alt="Next" />
    </button>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import systemAvatarImg from "@/assets/home/livestream/system-avatar.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { computed, ref, toRefs, watch, nextTick } from "vue";

const props = defineProps({
  list: Array,
  isLivestreamListLoading: Boolean
});
const { list } = toRefs(props);

const model = defineModel({ type: String });
const emit = defineEmits(["scroll-reach-right"]);

const imgStreamerURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/streamer/";

const swiperInstance = ref(null);

const swiperConfig = computed(() => {
  const SLIDE_PER_VIEW = 4;
  return {
    slidesPerView: SLIDE_PER_VIEW,
    slidesPerGroup: SLIDE_PER_VIEW,
    spaceBetween: 20,
    // modules: [Navigation],
    // navigation: props.list.length > SLIDE_PER_VIEW,
    allowTouchMove: false
  };
});

const navigationStatus = computed(() => {
  if (!swiperInstance.value) return { prev: false, next: false };
  return {
    prev: swiperInstance.value.isBeginning,
    next: swiperInstance.value.isEnd
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

const handlePrevClick = () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slidePrev();
};

const handleNextClick = () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slideNext();
};

watch(model, () => {
  if (!swiperInstance.value) return;
  const currentIndex = list.value.findIndex((item) => item.streamId === model.value);
  if (currentIndex === -1) return;
  swiperInstance.value.slideTo(currentIndex, 0);
});

watch(list, async (newVal, oldVal) => {
  const newValStr = JSON.stringify(newVal);
  const oldValStr = JSON.stringify(oldVal);
  if (newValStr === oldValStr) return;

  const currentIndex = list.value.findIndex((item) => item.streamId === model.value);

  await nextTick();
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
  --livestream-badge-gap: 6px;
  --livestream-img-size: 62px;
  position: relative;
  margin: 0 -14px -28px 0;

  .livestream-list-swiper {
    display: flex;
    gap: 18.87px;
    padding: 0 18px 18px 0;
    align-items: center;
    --swiper-navigation-color: #3981ff;

    :deep(.swiper-button-next) {
      right: 28px;
    }

    .livestream-list-item {
      @include livestream-content-block;
      background: #dcecff;
      border: 1px solid #dbdbdb;
      box-shadow: none;
      position: relative;
      padding: 40px 0 12px;
      margin: calc(var(--livestream-img-size) / 2 + var(--livestream-badge-gap)) 0 0;
      cursor: pointer;

      &.selected {
        border: 2px solid #468cff;
        background: linear-gradient(180deg, #82c5ff 0%, #f1f6ff 100%);
        box-shadow: 0px 4px 22px 0px #00000026;

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
        margin-bottom: 13px;
        padding: 0 10px;
        overflow: hidden;
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
        text-align: center;
        color: #333333;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .livestream-list-item__match-info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .livestream-list-item__match-info__team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-basis: 33%;
          max-width: 33%;
          .livestream-list-item__match-info__team-emblem {
            @include livestream-team-emblem;
          }
          .livestream-list-item__match-info__team-name {
            font-size: 12px;
            line-height: 17px;
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
          display: flex;
          align-items: center;
          gap: 4px;
          img {
            max-width: 20px;
          }
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
        top: 0;
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

  .livestream-list__navigation-btn {
    --livestream-list-navigation-btn-transform: translateY(-50%);
    --livestream-list-navigation-btn-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: calc(50% - var(--livestream-img-size) / 2 - var(--livestream-badge-gap));
    z-index: 1;
    box-shadow: 0px 1.1px 1.93px 0px #c2faff inset 0px -1.1px 1.55px 0px #c7f9ffb5 inset;
    background: linear-gradient(0deg, #72c9f1 -17.33%, #266ed9 39.33%, #72c9f1 100%);
    width: var(--livestream-list-navigation-btn-size);
    height: var(--livestream-list-navigation-btn-size);
    padding: 0;
    border-radius: 50%;
    transform: var(--livestream-list-navigation-btn-transform);

    &.prev {
      left: calc(-1 * var(--livestream-list-navigation-btn-size) / 2);
    }

    &.next {
      right: 5px;
      transform: var(--livestream-list-navigation-btn-transform);
      img {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background: linear-gradient(0deg, #266ed9 -17.33%, #72c9f1 39.33%, #266ed9 100%);
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}

.dark {
  .livestream-list-wrapper {
    .livestream-list-swiper {
      --swiper-navigation-color: #fff;
      .livestream-list-item {
        border: none;
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

    .livestream-list__navigation-btn {
      background: url("@/assets/home/livestream/navigation-btn-bg-dark.png") no-repeat center center;
      background-size: 100% 100%;

      &:hover {
        filter: brightness(0.8);
      }
    }
  }
}
</style>

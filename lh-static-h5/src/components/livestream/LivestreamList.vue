<template>
  <div class="livestream-list-wrapper">
    <div class="row justify-center q-py-md">
      <CategoryToggle
        v-model="tab"
        :categories="availableCategories"
      />
    </div>

    <div class="selection-container">
      <TransitionGroup name="list">
        <button
          v-for="item in filteredLivestreamList"
          :key="item.streamId"
          class="selection-item"
          @click="$emit('livestreamClick', item)"
        >
          <!-- // put item.supplierCdnPullUrl + item.streamerCdnPushUrl + streanerCdnPullUrl to the next page. -->
          <div class="item-img">
            <img v-if="item.cover" class="cover" :src="`${imgURLLivePreview}${item.cover}`" />
            <img
              v-else-if="item.liveStatus && getPreviewUrl(item) && !previewImgLoadFailedSet.has(item.streamId)"
              class="cover"
              :src="`${imgURLLivePreview}${getPreviewUrl(item)}`"
              @error="handlePreviewImgLoadFailed(item.streamId)"
            />

            <template v-else>
              <img src="../../assets/images/livestream/img-placeholder-bg.jpg" />
              <div class="placeholder-vs">
                <img src="../../assets/images/livestream/placeholder-vs.png" />
                <template v-if="!item.liveStatus">
                  <div class="vs-timer-title">直播倒计时</div>
                  <div class="vs-timer">
                    <span
                      v-for="(char, cIndex) in countdowns[item.streamId]?.hours"
                      class="vs-timer__time"
                      :key="`hour-${cIndex}`"
                    >
                      {{ char }}
                    </span>
                    :
                    <span
                      v-for="(char, cIndex) in countdowns[item.streamId]?.minutes"
                      class="vs-timer__time"
                      :key="`minute-${cIndex}`"
                    >
                      {{ char }}
                    </span>
                    <span class="vs-timer__time-desc">小时</span>
                    <div />
                    <span class="vs-timer__time-desc">分钟</span>
                  </div>
                </template>
              </div>

              <div class="placeholder-left">
                <div class="left-logo">
                  <template v-if="item.homeIcon">
                    <img :src="item.homeIcon" />
                  </template>
                  <template v-else>
                    <img src="../../assets/images/livestream/system-avatar.png" />
                  </template>
                  <!-- <img :src="imgURL + item.homeIcon" /> -->
                </div>
                <div class="left-title">{{ item.homeNameZh ?? item.homeNameEn ?? item.homeName }}</div>
              </div>
              <div class="placeholder-right">
                <div class="right-logo">
                  <template v-if="item.awayIcon">
                    <img :src="item.awayIcon" />
                  </template>
                  <template v-else>
                    <img src="../../assets/images/livestream/system-avatar.png" />
                  </template>
                  <!-- <img :src="imgURL + item.awayIcon" /> -->
                </div>
                <div class="right-title">{{ item.awayNameZh ?? item.awayNameEn ?? item.awayName }}</div>
              </div>

              <!-- <img
                v-if="item.sportId === 1 || item.sportId === 2"
                src="../../assets/images/livestream/img-placeholder-stream-sport.png"
                alt=""
              />
              <img v-else src="../../assets/images/livestream/img-placeholder-stream-esport.png" alt="" /> -->
            </template>
          </div>
          <div class="item-content">
            <div class="content-title ellipsis">
              <!-- 德国甲级联赛 -->
              {{ item.title }}
            </div>
            <div class="content-desc ellipsis">
              {{ item.homeNameZh ?? item.homeNameEn ?? item.homeName }}
              VS
              {{ item.awayNameZh ?? item.awayNameEn ?? item.awayName }}
            </div>
          </div>
          <div class="item-float-content">
            <div class="content-float float-user">
              <div class="user-avatar">
                <img v-if="item.name === 'SYSTEM'" :src="require('../../assets/images/livestream/system-avatar.png')" />
                <img v-else-if="item.avatar" :src="imgURL + item.avatar" />
                <img v-else :src="require('../../assets/images/profile/default-1.png')" />
              </div>
              <div>{{ item.name === "SYSTEM" ? "雷火" : item.name }}</div>
            </div>
            <div class="content-float" :class="{ 'float-filled': item.liveStatus }">
              <div v-if="item.liveStatus">正在直播</div>
              <div v-else>
                {{ getDisplayDateTime(item.eventStartTime) }}
              </div>
            </div>
          </div>
        </button>
      </TransitionGroup>

      <div v-if="isLoading" class="selection-container__loading-wrapper">
        <q-spinner size="3em" />
      </div>
      <div v-else-if="!filteredLivestreamList.length" class="no-data">目前没有直播</div>
    </div>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import { computed, onActivated, onDeactivated, onMounted, ref, toRefs, watch } from "vue";
import CategoryToggle from "./CategoryToggle.vue";

const props = defineProps({
  livestreamList: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
const { livestreamList } = toRefs(props);

defineEmits(["livestreamClick"]);

const imgURLLivePreview = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

const previewImgLoadFailedSet = ref(new Set());
const countdowns = ref({});
const timer = ref(null);
const tab = ref("popular");

const filteredLivestreamList = computed(() => {
  switch (tab.value) {
    case "popular":
      return livestreamList.value.filter((item) => item.isPopular);
    case "football":
      return livestreamList.value.filter((item) => [1].includes(item.sportId));
    case "basketball":
      return livestreamList.value.filter((item) => [2].includes(item.sportId));
    case "esport":
      return livestreamList.value.filter((item) => [3, 4, 5, 6].includes(item.sportId));
    default:
      return livestreamList.value;
  }
});

const getPreviewUrl = (livestream) => {
  if (livestream.streamerStatus) {
    return livestream.streamerPreviewUrl ? livestream.streamerPreviewUrl : "";
  } else {
    return livestream.supplierPreviewUrl ? livestream.supplierPreviewUrl : "";
  }
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
    return eventDate.format("MM/DD");
  }
};

const handlePreviewImgLoadFailed = (streamId) => {
  if (previewImgLoadFailedSet.value.has(streamId)) return;
  previewImgLoadFailedSet.value.add(streamId);
};

const updateCountdowns = () => {
  const now = moment();
  livestreamList.value.forEach((item, index) => {
    if (!item.liveStatus && item.eventStartTime) {
      const eventTime = moment(item.eventStartTime);
      const diffInMs = eventTime.diff(now);
      const duration = moment.duration(diffInMs > 0 ? diffInMs : 0);
      const hours = String(Math.floor(duration.asHours())).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");

      countdowns.value[item.streamId] = {
        hours,
        minutes
      };
    }
  });
};

watch(livestreamList, updateCountdowns);

const availableCategories = computed(() => {
  const hasPopular = livestreamList.value.some(item => item.isPopular);
  const hasFootball = livestreamList.value.some(item => [1].includes(item.sportId));
  const hasBasketball = livestreamList.value.some(item => [2].includes(item.sportId));
  const hasEsport = livestreamList.value.some(item => [3, 4, 5, 6].includes(item.sportId));

  const categories = [];

  if (hasPopular) categories.push({ value: 'popular', slot: 'popular' });
  categories.push({ value: 'football', slot: 'football' });
  categories.push({ value: 'basketball', slot: 'basketball' });
  categories.push({ value: 'esport', slot: 'esport' });

  return categories;
});

watch(availableCategories, (newCategories) => {
  const availableTabValues = newCategories.map(c => c.value);
  if (!availableTabValues.includes(tab.value)) {
    tab.value = availableTabValues[0] || '';
  }
});

onActivated(() => {
  updateCountdowns();
  timer.value = setInterval(updateCountdowns, 1000 * 60);
});

onDeactivated(() => {
  clearInterval(timer.value);
});
</script>
<style lang="scss" scoped>
.selection-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 12px;
  column-gap: 12px;
  .selection-item {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 4px 4px 0px #10264517;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    border: none;
    padding: 0;
    margin-bottom: auto;

    .item-float-content {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      top: 0;
      left: 0;
      padding: 8px;
      gap: 8px;

      .content-float {
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 4px;
        border-radius: 24px;
        font-size: 10px;
        min-height: 16px;
        white-space: nowrap;

        &.float-user {
          padding: 0px 8px 0px 0px;
          .user-avatar {
            img {
              display: block;
              width: 100%;
              max-width: 16px;
              border-radius: 50%;
            }
          }
        }
        &.float-detail {
        }
        &.float-filled {
          border-radius: 6px;
          background: #1ac1a2;
          margin-left: auto;
        }
      }
    }

    .item-img {
      position: relative;
      aspect-ratio: 16/9;

      > img {
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0.9;
        &.cover {
          object-fit: cover;
        }
      }

      .placeholder-vs {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 40%;

        img {
          display: block;
          width: 100%;
        }

        .vs-timer-title {
          margin-top: -7%;
          font-size: 0.45rem;
          font-weight: bold;
          color: #fff;
        }

        .vs-timer {
          display: grid;
          grid-template-columns: repeat(5, max-content);
          justify-self: center;
          color: #ffffff;
          font-size: 10px;
          gap: 4px 2px;
          line-height: 1;
          margin-top: 10%;
          font-size: 0.85rem;
          font-weight: 600;

          .vs-timer__time {
            background-image: url("../../assets/images/livestream/placeholder-timer.png");
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 16px;
            width: max-content;
            padding: 0 2px;
          }

          .vs-timer__time-desc {
            grid-column: span 2;
            font-size: 0.4rem;
          }
        }
      }

      .placeholder-left {
        // background-image: url("../../assets/images/livestream/placeholder-left-title.png");
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        position: absolute;
        top: 40%;
        left: 5%;
        width: 30%;
        height: 10%;
        font-size: 0.5rem;
        padding: 2px 0;
        line-height: 1;
        flex-direction: column;

        img {
          display: block;
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 50%;
          background: #ffffff;
        }

        .left-logo {
          background-image: url("../../assets/images/livestream/placeholder-left-logo.png");
          // background-color: salmon;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
          width: 50%;
        }

        .left-title {
          background-image: url("../../assets/images/livestream/placeholder-left-title.png");
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 12px;
          margin-top: 20%;
        }
      }

      .placeholder-right {
        // background-image: url("../../assets/images/livestream/placeholder-left-title.png");
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        position: absolute;
        top: 40%;
        right: 5%;
        width: 30%;
        height: 10%;
        font-size: 0.5rem;
        padding: 2px 0;
        line-height: 1;
        flex-direction: column;

        img {
          display: block;
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 50%;
          background: #ffffff;
        }

        .right-logo {
          background-image: url("../../assets/images/livestream/placeholder-right-logo.png");
          // background-color: salmon;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
          width: 50%;
        }

        .right-title {
          background-image: url("../../assets/images/livestream/placeholder-right-title.png");
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 12px;
          margin-top: 20%;
        }
      }

      // .placeholder-left-logo {
      //   // background-image: url("../../assets/images/livestream/placeholder-left-title.png");
      //   background-color: salmon;
      //   background-size: 100% 100%;
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   color: #ffffff;
      //   position: absolute;
      //   top: 65%;
      //   left: 5%;
      //   width: 30%;
      //   height: 10%;
      //   font-size: 6px;
      //   line-height: 1;

      //   img {
      //     display: block;
      //     width: 100%;
      //   }
      // }

      // .placeholder-right-title {
      //   background-image: url("../../assets/images/livestream/placeholder-right-title.png");
      //   background-size: 100% 100%;
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   color: #ffffff;
      //   position: absolute;
      //   top: 65%;
      //   right: 5%;
      //   width: 30%;
      //   height: 10%;
      //   font-size: 6px;
      //   line-height: 1;
      // }
    }
    .item-content {
      padding: 3px 6px;
      text-align: left;

      .content-title {
        font-size: 0.9rem;
        font-weight: bold;
        color: #000000;
      }
      .content-desc {
        font-size: 0.8rem;
        color: #7a80a1;
      }
    }
  }

  .selection-container__loading-wrapper {
    display: flex;
    justify-content: center;
    grid-column: 1 / -1;
    .q-spinner {
      color: #4c88f8;
    }
  }

  :deep(.list-enter-active),
  :deep(.list-leave-active) {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  :deep(.list-leave-to) {
    opacity: 0;
    transform: scale(0.95);
  }

  :deep(.list-enter-from) {
    opacity: 0;
    transform: scale(1.05);
  }
  :deep(.list-enter-active) {
    transition-delay: 0.25s;
  }

  :deep(.list-move) {
    transition: transform 0.25s ease;
  }
}

.body--dark {
  .selection-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 12px;
    column-gap: 12px;
    .selection-item {
      width: 100%;
      background: #273354;
      box-shadow: 0px 4px 4px 0px #10264517;
      border: none;
      padding: 0;

      .item-content {
        padding: 3px 6px;
        .content-title {
          font-weight: bold;
          color: #ffffff;
        }
        .content-desc {
          color: #7a80a1;
        }
      }
    }

    .selection-container__loading-wrapper {
      .q-spinner {
        fill: #fff;
      }
    }
  }
}

.no-data {
  display: flex;
  justify-content: center;
  grid-column: 1 / span 2;
}
</style>

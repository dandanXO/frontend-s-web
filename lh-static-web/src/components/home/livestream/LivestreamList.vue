<template>
  <div ref="livestreamListWrapperRef" class="livestream-list-wrapper">
    <div
      v-for="(live, index) in list"
      :key="live"
      class="livestream-list-item"
      :class="{
        selected: model === index
      }"
      @click="handleLivestreamClick(index)"
    >
      <div class="livestream-list-item__title">{{ live.title }}</div>
      <div class="livestream-list-item__match-info">
        <div class="livestream-list-item__match-info__team">
          <div class="livestream-list-item__match-info__team-emblem">
            <img :src="live.homeIcon" loading="lazy" />
          </div>
          <span class="livestream-list-item__match-info__team-name">{{ live.homeNameZh }}</span>
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
            <img :src="live.awayIcon" loading="lazy" />
          </div>
          <span class="livestream-list-item__match-info__team-name">{{ live.awayNameZh }}</span>
        </div>
      </div>
      <div class="livestream-list-item__badge-wrapper">
        <div class="livestream-list-item__badge">
          <img :src="live.avatar" loading="lazy" />
          {{ live.name }}
        </div>
      </div>
    </div>
    <div
      v-if="isLivestreamListLoading"
      v-loading="true"
      element-loading-background="transparent"
      class="livestream-list__pseudo"
    />
  </div>
</template>
<script setup>
import { useNotify } from "@/hooks/notify";
import moment from "moment";
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps({
  list: Array,
  isLivestreamListLoading: Boolean
});

const model = defineModel({ type: Number });
const emit = defineEmits(["scroll-reach-right"]);

const notify = useNotify();

const livestreamListWrapperRef = ref(null);

const handleLivestreamClick = (index) => {
  if (!props.list[index].liveStatus) {
    notify.info("该赛事未开始");
    return;
  }
  model.value = index;
};

const getDisplayDateTime = (date) => {
  const now = moment();
  const eventDate = moment(date);
  const diffInDays = eventDate.diff(now, "days");

  if (diffInDays === 0) {
    return eventDate.format("今日 HH:mm");
  } else if (diffInDays === 1) {
    return eventDate.format("明日 HH:mm");
  } else {
    return eventDate.format("MM/DD");
  }
};

const handleLivestreamListScroll = () => {
  const threshold = 50;
  const isRight =
    livestreamListWrapperRef.value.scrollLeft + livestreamListWrapperRef.value.clientWidth >=
    livestreamListWrapperRef.value.scrollWidth - threshold;

  if (isRight && !props.isLivestreamListLoading) {
    emit("scroll-reach-right");
  }
};

onMounted(() => {
  if (!livestreamListWrapperRef.value) return;
  livestreamListWrapperRef.value.addEventListener("scroll", handleLivestreamListScroll);
});

onUnmounted(() => {
  if (!livestreamListWrapperRef.value) return;
  livestreamListWrapperRef.value.removeEventListener("scroll", handleLivestreamListScroll);
});
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.livestream-list-wrapper {
  display: flex;
  gap: 18.87px;
  padding: 0 18px 18px 0;
  align-items: center;
  overflow: auto;
  margin: 0 -14px -28px 0;

  .livestream-list-item {
    @include livestream-content-block;
    position: relative;
    flex: 0 0 calc(25% - 12.87px);
    padding: 11px 0;
    margin: 18px 0 0;
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
        .livestream-list-item__match-info__team-emblem {
          @include livestream-team-emblem;
        }
        .livestream-list-item__match-info__team-name {
          font-size: 12px;
          line-height: 15px;
          color: #7a80a1;
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
      top: 4px;
      left: 14px;
      transform: translateY(-100%);
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

      .livestream-list-item__badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 7px;
        margin-left: -7px;
        font-size: 11px;
        line-height: 15px;
        color: #000000;
        img {
          @include img-pseudo;
          border-radius: 50%;
          width: 22px;
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

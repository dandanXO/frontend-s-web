<template>
  <div class="current-livestream-wrapper">
    <div class="current-livestream__streamer-info-wrapper">
      <div class="current-livestream__streamer-info">
        <div class="current-livestream__streamer-info__avatar">
          <img :src="livestreamData.avatar" loading="lazy" />
        </div>
        <span class="current-livestream__streamer-info__name">{{ livestreamData.name }}</span>
        <div v-if="livestreamData.liveStatus" class="current-livestream__streamer-info__on-air">正在直播</div>
      </div>
    </div>

    <div class="current-livestream__match-info">
      <span class="current-livestream__match-info__team-name">{{ livestreamData.homeNameZh }}</span>
      <div class="current-livestream__match-info__team-emblem">
        <img :src="livestreamData.homeIcon" loading="lazy" />
      </div>
      <div class="current-livestream__match-info__team-vs">VS</div>
      <div class="current-livestream__match-info__team-emblem">
        <img :src="livestreamData.awayIcon" loading="lazy" />
      </div>
      <span class="current-livestream__match-info__team-name">{{ livestreamData.awayNameZh }}</span>
    </div>

    <button class="current-livestream__bet-btn" @click="$emit('click')">投一注</button>
  </div>
</template>
<script setup>
defineProps({
  livestreamData: {
    type: Object,
    default: () => ({})
  }
});
defineEmits(["click"]);
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

  .current-livestream__match-info {
    display: flex;
    align-items: center;
    gap: 18px;
    .current-livestream__match-info__team-name {
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      color: #7a80a1;
    }
    .current-livestream__match-info__team-emblem {
      @include livestream-team-emblem;
    }
    .current-livestream__match-info__team-vs {
      padding: 0 8px;
      font-size: 16px;
      line-height: 23px;
      color: #3981ff;
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
    .current-livestream__match-info {
      .current-livestream__match-info__team-name,
      .current-livestream__match-info__team-vs {
        color: #fff;
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

<template>
  <div class="coming-match-wrapper">
    <div class="coming-match-info home">
      <div class="coming-match-info__team-emblem">
        <img :src="livestreamData.homeIcon ?? systemAvatarImg" loading="lazy" />
      </div>
      <div class="coming-match-info__team-name">
        <span class="coming-match-info__team-name-placeholder">
          {{ livestreamData.homeNameZh ?? livestreamData.homeNameEn ?? livestreamData.homeName }}
        </span>
        <div class="coming-match-info__team-name-inner">
          {{ livestreamData.homeNameZh ?? livestreamData.homeNameEn ?? livestreamData.homeName }}
        </div>
        <div class="coming-match-info__team-name-stripe light left" />
        <div class="coming-match-info__team-name-stripe light right" />
      </div>
    </div>

    <div class="coming-match-info__countdown">
      <span class="coming-match-info__countdown-title">直播倒计时</span>
      <div class="coming-match-info__countdown__time">
        <div
          v-for="(char, index) in countdown.hours"
          :key="`hour-${index}`"
          class="coming-match-info__countdown-time-item"
        >
          {{ char }}
        </div>
        <span class="coming-match-info__countdown-time-colon">:</span>
        <div
          v-for="(char, index) in countdown.minutes"
          :key="`minute-${index}`"
          class="coming-match-info__countdown-time-item"
        >
          {{ char }}
        </div>
        <div class="coming-match-info__countdown-time-item-desc">小时</div>
        <div />
        <div class="coming-match-info__countdown-time-item-desc">分钟</div>
      </div>
      <button class="coming-match-info__bet-btn" @click="$emit('click')">投一注</button>
    </div>

    <div class="coming-match-info away">
      <div class="coming-match-info__team-emblem">
        <img :src="livestreamData.awayIcon ?? systemAvatarImg" loading="lazy" />
      </div>
      <div class="coming-match-info__team-name">
        <div class="coming-match-info__team-name-inner">
          {{ livestreamData.awayNameZh ?? livestreamData.awayNameEn ?? livestreamData.awayName }}
        </div>
        <div class="coming-match-info__team-name-stripe light left" />
        <div class="coming-match-info__team-name-stripe light right" />
      </div>
    </div>
  </div>
</template>
<script setup>
import systemAvatarImg from "@/assets/home/livestream/system-avatar.png";
import moment from "moment";
import { toRefs, watch, ref, onUnmounted } from "vue";

const DEFAULT_COUNTDOWN = {
  hours: "00",
  minutes: "00"
};

const props = defineProps(["livestreamData"]);
const { livestreamData } = toRefs(props);

defineEmits(["click"]);

const timer = ref(null);
const countdown = ref(DEFAULT_COUNTDOWN);

const handleCountdown = () => {
  const now = moment();
  const end = moment(livestreamData.value.eventStartTime);
  const duration = moment.duration(end.diff(now));
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  if (minutes < 0) {
    countdown.value = DEFAULT_COUNTDOWN;
  } else {
    countdown.value = {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0")
    };
  }
};

const startCountdown = () => {
  if (timer.value) {
    clearInterval(timer.value);
    countdown.value = DEFAULT_COUNTDOWN;
  }
  timer.value = setInterval(handleCountdown, 1000 * 60);
  handleCountdown();
};

watch(livestreamData, () => {
  startCountdown();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>
<style lang="scss" scoped>
.coming-match-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("@/assets/home/livestream/coming-match-bg.png") no-repeat center center;
  background-size: 100% 100%;
  border-radius: 15.1px;

  .coming-match-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &.home {
      .coming-match-info__team-emblem {
        --team-emblem-bg: linear-gradient(180deg, #5a0008 0%, #c00012 100%);
      }
      .coming-match-info__team-name {
        --bg-color: #f83e26;
      }
    }

    &.away {
      .coming-match-info__team-emblem {
        --team-emblem-bg: linear-gradient(180deg, #061445 0%, #0047ef 100%);
      }
      .coming-match-info__team-name {
        --bg-color: #2681f8;
      }
    }

    .coming-match-info__team-name-placeholder {
      color: transparent;
      pointer-events: none;
    }

    .coming-match-info__team-emblem {
      background: url("@/assets/home/livestream/hexagon-mask.png") no-repeat, var(--team-emblem-bg);
      background-position: bottom 30px left 50%, center;
      background-size: 100% 100%, cover;
      width: 100px;
      height: 100px;
      margin-bottom: 32px;
      border-radius: 50%;
      box-shadow: 0px 4px 7.7px 0px #00000094 inset;
      img {
        max-width: 100%;
        padding: 14px;
      }
    }

    .coming-match-info__team-name {
      position: relative;
      min-width: 226px;
      height: 48px;
      padding: 0 53px;
      .coming-match-info__team-name-inner {
        position: absolute;
        inset: 0 16%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-color);
        clip-path: polygon(20px 0%, calc(100% - 20px) 0%, 100% 100%, 0% 100%);
        padding: 0 20px;
      }
      .coming-match-info__team-name-stripe {
        position: absolute;
        top: 0;
        width: 27px;
        height: 100%;
        background-color: var(--bg-color);
        clip-path: polygon(calc(100% - 7px) 0%, 100% 0%, 7px 100%, 0% 100%);
        &.light {
          opacity: 0.6;
        }
        &.left {
          left: 11%;
        }
        &.right {
          right: 11%;
          transform: scaleX(-1);
        }
      }
    }
  }

  .coming-match-info__countdown {
    flex-basis: 305px;
    display: flex;
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    flex-direction: column;
    padding-bottom: 40px;

    .coming-match-info__countdown-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .coming-match-info__countdown__time {
      display: grid;
      grid-template-columns: 25px 25px max-content 25px 25px;
      gap: 4px;
      margin-bottom: 10px;

      .coming-match-info__countdown-time-item {
        height: 45px;
        background: url("@/assets/home/livestream/countdown-bg.png") no-repeat center center;
        background-size: 100% 100%;
        font-size: 32px;
        line-height: 45px;
        text-align: center;
      }

      .coming-match-info__countdown-time-colon {
        font-size: 32px;
        line-height: 45px;
        text-align: center;
        padding: 0 2px;
      }

      .coming-match-info__countdown-time-item-desc {
        grid-column: span 2;
        font-size: 12px;
        text-align: center;
      }
    }

    .coming-match-info__bet-btn {
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
}
</style>

<template>
  <div class="hot-matches-placeholder-wrapper" v-if="isFetchingHotMatches">
    <div class="hot-matches-placeholder">
      <img src="../../assets/images/home/icon-hot-matches.png" alt="hot matches" />
      <h1>{{ $t('common.loading') }}...</h1></div>
  </div>
  <div v-else class="hot-matches-wrapper">
    <div class="hot-matches-title-wrapper">
      <div class="hot-matches-title">
        <div>
          <img src="../../assets/images/home/icon-hot-matches.png" alt="hot matches" />
        </div>
        {{ $t("home.hotMatches") }}
      </div>
    </div>
    <div class="hot-matches-container">
      <swiper
        :slides-per-view="hotMatches.length > 2 ? '3' : hotMatches.length"
        :modules="modules"
        :loop="false"
        @swiper="onSwiper"
        effect="fade"
        :auto-height="false"
        :allow-slide-next="true"
        :space-between="20"
        :pagination="{ clickable: true, type: 'bullets' }"
        navigation
        class="hot-matches-carousel"
      >
        <swiper-slide
          v-for="(item, index) in hotMatches"
          :key="index"
          :name="index"
          class="hot-matches-slide"
          :class="hotMatches.length === 1 && 'one-slide-only'"
        >
          <div class="hot-matches-item">
            <div class="top-match-title">{{ item.competitionName }}</div>
            <div class="team-details team-details__home">
              <div class="team-icon">
                <img :src="hotMatchesImgURL + item.teamOneLogo" :alt="item.teamOneName" />
              </div>
              <div class="team-name">{{ item.teamOneName }}</div>
            </div>
            <div class="match-details">
              <div class="match-vs"><img src="../../assets/images/home/icon-vs.png" /></div>
              <div class="match-time">{{ formattedTime(item.competitionTime) }}</div>
              <div class="match-btn">
                <a class="standard-button lg-btn btn-color-blue" @click="goToSportPage(item)">
                  {{ $t("common.playnow") }}
                </a>
              </div>
            </div>
            <div class="team-details team-details__away">
              <div class="team-icon">
                <img
                  :src="hotMatchesImgURL + item.teamTwoLogo"
                  :style="item.teamTwoName === 'FC Tokyo' ? 'transform: scale(1.45);' : ''"
                  :alt="item.teamTwoName"
                />
              </div>
              <div class="team-name">{{ item.teamTwoName }}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>

  <GameModal ref="modalGame"></GameModal>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getHotMatches } from "../../api/index/hotMatches.js";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import GameModal from "@/components/modal/GameModal";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();
const store = userStore();
const { t } = useI18n();
const hotMatches = ref([]);
const hotMatchesImgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
const onSwiper = (swiper) => {};
const modules = [Navigation, Pagination, Scrollbar, A11y];
const isFetchingHotMatches = ref(false);

const modalGame = ref(null);
const openGame = (gameName, code, gameCode) => {
  modalGame.value.open(gameName, code, gameCode);
};

const loadHotMatches = () => {
  isFetchingHotMatches.value = true;

  getHotMatches().then((res) => {
    isFetchingHotMatches.value = false;

    if (res.code === 0) {
      hotMatches.value = res.data;
    }
  }).catch(() => {
    isFetchingHotMatches.value = false;
  }).finally(() => {
    isFetchingHotMatches.value = false;
  });
};

const goToSportPage = (item) => {
  if (!store.token) {
    router.push("/login");
  } else {
    openGame(item.platformName, item.platformCode, item.gameCode);
  }
};

const formattedTime = (timeString) => {
  if (!timeString) {
    return "";
  }

  const dateTime = new Date(timeString);
  const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}/${(dateTime.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const formattedTime = `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return `${formattedDate} ${formattedTime}`;
};

// const countDay = ref(25);
const euroCupStartDate = moment("2024-06-15");
const daysDiff = ref(euroCupStartDate.diff(moment(), "days"));

if (daysDiff.value <= 0) {
  daysDiff.value = 0;
}

const countDayString = computed(() => {
  return daysDiff.value.toString().padStart(2, "0");
});

const countDay01 = computed(() => {
  return parseInt(countDayString.value.substr(0, 1));
});

const countDay02 = computed(() => {
  return parseInt(countDayString.value.substr(1, 1));
});

watch(countDayString, () => {
  countDay01.value = parseInt(countDayString.value.substr(0, 1));
  countDay02.value = parseInt(countDayString.value.substr(1, 1));
});

onMounted(() => {
  loadHotMatches();
});
</script>

<style lang="scss" scoped>
.hot-matches-placeholder-wrapper {
  width: 1350px;
  height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .hot-matches-placeholder {
    max-width: 1350px;
    margin: 25px auto 0px;
    text-align: center;
  }
}
</style>

<style lang="scss">
@keyframes fly {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: translateY(20vh) translateX(20px) rotate(45deg);
    opacity: 0.9;
  }
  40% {
    transform: translateY(40vh) translateX(-20px) rotate(90deg);
    opacity: 0.8;
  }
  60% {
    transform: translateY(60vh) translateX(15px) rotate(135deg);
    opacity: 0.7;
  }
  80% {
    transform: translateY(80vh) translateX(-15px) rotate(180deg);
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) translateX(10px) rotate(225deg);
    opacity: 0;
  }
}

.hot-matches-wrapper {
  max-width: 1350px;
  margin: 25px auto 0px;
  position: relative;

  .euro-countdown {
    display: flex;
    justify-content: center;
    align-items: baseline;
    position: relative;
    margin-top: -40px;
    margin-bottom: -30px;

    .euro-countdown-fly-01 {
      position: absolute;
      left: -60px;
      // top: 50px;
      top: -100px;
      width: auto;
      // animation-delay: 0s;
      animation: fly 8s linear infinite;
    }

    .euro-countdown-fly-02 {
      position: absolute;
      left: 34px;
      // top: 100px;
      top: -100px;
      width: auto;
      animation: fly 7s linear infinite;
    }

    .euro-countdown-fly-03 {
      position: absolute;
      left: -60px;
      // top: 120px;
      top: -100px;
      width: auto;
      animation: fly 6s linear infinite;
    }

    .euro-countdown-fly-04 {
      position: absolute;
      right: -70px;
      // top: 43px;
      top: -100px;
      width: auto;
      animation: fly 7s linear infinite;
    }

    .euro-countdown-fly-05 {
      position: absolute;
      right: 0px;
      // top: 93px;
      top: -100px;
      width: auto;
      animation: fly 8s linear infinite;
    }

    .euro-countdown-fly-06 {
      position: absolute;
      right: -60px;
      // top: 120px;
      top: -100px;
      width: auto;
      animation: fly 10s linear infinite;
    }

    .euro-countdown-content {
      display: flex;
      justify-content: center;
      width: max-content;
      position: relative;

      img {
        display: block;
        width: 100%;
      }
    }

    .euro-countdown-txt {
      position: absolute;
      display: flex;
      top: 105px;
      left: 400px;
      font-size: 35px;
      font-weight: bold;
      color: #ffffff;
      line-height: 1;

      .euro-countdown-num {
        position: relative;
        display: flex;
        align-items: center;
        img {
          display: block;
          width: 145px;
          margin-top: -25px;
        }

        .num {
          background-image: url(../../assets/home/eurocup-countdown-number.png);
          height: 80px;
          width: 80px;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -23px;

          &:last-child {
            margin-left: -5px;
          }
        }
        span {
          background: linear-gradient(180deg, #087df6 0%, #0011ac 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
          font-size: 50px;
          line-height: 1;
          font-family: Arial, Helvetica, sans-serif;
        }
      }
    }
  }

  .hot-matches-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-top: 10px;
    position: relative;
  }

  .hot-matches-title {
    font-size: 24px;
    font-weight: 700;
    color: #313441;
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      display: block;
      width: 30px;
    }
  }

  .hot-matches-container {
    display: flex;
    flex-wrap: wrap;
  }

  .hot-matches-carousel {
    padding-bottom: 40px;
  }

  .hot-matches-slide {
    padding-top: 0;
    // width: 50%;

    &.one-slide-only {
      width: 650px !important;
    }
  }

  .hot-matches-item {
    background: #f4f9fe;
    border-radius: 20px;
    margin-top: 16px;
    padding: 24px 24px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    position: relative;
    flex-wrap: wrap;

    .top-match-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 24px;
      width: 100%;
      text-align: center;
      background-image: url("../../assets/images/home/top-match-title.png");
      background-size: 300px 100%;
      background-repeat: no-repeat;
      background-position: center center;
      padding: 8px 12px;
      margin-top: -32px;
    }

    .match-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      width: 40%;

      .match-title {
        color: #424f72;
        font-weight: 700;
        font-size: 24px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: 16px;
      }
      .match-time {
        color: #444444;
        font-size: 20px;
        text-align: center;
        margin-top: 12px;
      }

      .match-vs {
        font-size: 50px;
        line-height: 1;
        font-weight: 900;
        font-family: Poppins;
        margin-top: 20px;
        color: rgba(115, 178, 255, 0.2);

        img {
          display: block;
          width: 94px;
        }
      }

      .match-btn {
        margin-top: 12px;
        margin-bottom: 12px;
      }
    }

    .team-details {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 26%;

      .team-details__home {
      }

      .team-details__away {
      }

      .team-icon {
        // border-radius: 50%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: unset;
          height: 80px;
          max-width: 100px;
        }
      }

      .team-name {
        font-size: 18px;
        text-align: center;
        color: #444444;
        min-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

/* swiper-pagination */
.swiper-pagination {
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  margin: 0 5px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>

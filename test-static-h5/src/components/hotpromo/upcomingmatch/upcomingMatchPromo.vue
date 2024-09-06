<template>
  <div v-if="upcomingMatchDetails.length > 0">
    <div
      :slides-per-view="props.platformType === 'NBA' || upcomingMatchDetails.length < 2 ? 1 : 2"
      :loop="false"
      @swiper="onSwiper"
      :space-between="20"
      @slideChange="onSlideChange"
      class="swiper-wrapper bet-info-container"
    >
      <template v-for="(upcomingMatchDetail, index) in upcomingMatchDetails" :key="index">
        <!-- <swiper-slide> -->
        <div class="bet-info-box">
          <div class="bet-info-date">{{ getMatchDateOnly(upcomingMatchDetail.matchTime) }}</div>
          <div class="bet-info-details">
            <div class="info-team info-team-one">
              <div class="info-team-logo">
                <img :src="imgURL + upcomingMatchDetail.teamOneIcon" />
              </div>
              <div class="info-team-name" v-html="upcomingMatchDetail.teamOne" />
            </div>

            <div class="bet-info-title">
              <div>{{ upcomingMatchDetail.matchTitle }}</div>

              <div class="bet-info-time">{{ getMatchTimeOnly(upcomingMatchDetail.matchTime) }}</div>
            </div>

            <div class="info-team info-team-two">
              <div class="info-team-logo">
                <img :src="imgURL + upcomingMatchDetail.teamTwoIcon" />
              </div>
              <div class="info-team-name" v-html="upcomingMatchDetail.teamTwo" />
            </div>
          </div>
        </div>
        <!-- </swiper-slide> -->
      </template>
    </div>
    <!-- <div class="swiper-button-prev" @click="prevSlide"></div> -->
    <!-- <div class="swiper-button-next" @click="nextSlide"></div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import {useLocalStorage} from "@vueuse/core"
import "swiper/css";
import "swiper/css/navigation";

import { eventapi } from "src/boot/axios";

const props = defineProps({
  platformType: String
});

const upcomingMatchDetails = ref([]);
const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";

const getMatchDateOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const dateString = dateTimeString.split(" ")[0];
  return dateString || "";
};

const getMatchTimeOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const timeString = dateTimeString.split(" ")[1];
  return timeString || "";
};

const getupcomingMatchDetails = () => {
  eventapi
    .get(`/game-match/upcoming/${props.platformType}`)
    .then((res) => {
      if (res.code === 0) {
        upcomingMatchDetails.value = res.data;

        // res.data
        // upcomingMatchDetails.value = [
        //   {
        //     id: 20,
        //     siteId: 6,
        //     matchTitle: "LPL 春季赛",
        //     teamOne: "IG",
        //     teamOneIcon: "6/75c10428-1252-4e7e-8e63-d5fa4e6e2a7a.png",
        //     teamTwo: "TT",
        //     teamTwoIcon: "6/c463593a-225a-4f9e-9d74-6bf948ac42f5.png",
        //     gameType: "ESPORT",
        //     status: "ACTIVE",
        //     matchTime: "2024-02-03 17:00:00"
        //   }
        // ];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const $swiper = ref(null);

const onSwiper = (swiper) => {
  $swiper.value = swiper;
  console.log(swiper);
};

const onSlideChange = () => {};

// const prevSlide = () => {
//   $swiper.value.slidePrev();
// };

// const nextSlide = () => {
//   $swiper.value.slideNext();
// };

onMounted(() => {
  getupcomingMatchDetails();
});
</script>

<style scoped lang="scss">
.swiper-wrapper {
  max-width: 100%;
  margin-top: 20px;
}

:deep(.swiper-button-prev) {
  left: 0px;
  margin-top: -30px;
}
:deep(.swiper-button-next) {
  right: 0px;
  margin-top: -30px;
}

.bet-info-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bet-info-box {
  border-radius: 12px;
  // border: 1px solid #0c9bff;
  box-shadow: 0px -8px 8px 0px #c3d4e6 inset;

  // box-shadow: 0px 4px 0px 0px #a7c2dd;

  max-width: 90%;
  margin: auto;
  overflow: hidden;
  width: 100%;

  .bet-info-date {
    background: #e7f3ff;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    font-size: 12px;
    line-height: 1;
    color: #4c4c6c;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .bet-info-title {
    text-align: center;
    align-self: flex-start;
    color: #4c4c6c;
    font-weight: 700;
  }

  .bet-info-time {
    font-weight: 700;
    font-size: 18px;
    line-height: 1.3;
    text-align: center;
    color: #518bf7;
    margin-top: 4px;
  }

  .bet-info-vs {
    font-weight: bolder;
    font-size: 16px;
    line-height: 1.3;
    text-align: center;
  }

  .bet-info-details {
    padding: 12px 12px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .info-team {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      width: 35%;
      padding-bottom: 10px;

      .info-team-logo {
        // background: #c1c1c1;
        border-radius: 6px;
        padding: 6px;
        margin-bottom: 3px;

        img {
          display: block;
          width: 45px;
          margin-bottom: 0px;
        }
      }

      .info-team-name {
        color: #414655;
        font-size: 12px;
        line-height: 1;
        font-weight: bolder;
      }
    }
  }
}
</style>

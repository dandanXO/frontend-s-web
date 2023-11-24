<template>
  <div>
    <swiper
      :slides-per-view="1"
      :loop="false"
      @swiper="onSwiper"
      :space-between="50"
      @slideChange="onSlideChange"
      class="swiper-wrapper"
    >
      <!-- <template v-for="(item, index) in nbaDetails" :key="index"> -->
      <swiper-slide>
        <div class="bet-info-box">
          <div class="bet-info-date">{{ nbaDetails.matchTime }}</div>

          <div class="bet-info-title" v-html="nbaDetails.matchTitle" />

          <div class="bet-info-details">
            <div class="info-team info-team-one">
              <div class="info-team-logo">
                <img :src="imgURL + nbaDetails.siteId + '/' + nbaDetails.teamOneIcon" />
              </div>
              <div class="info-team-name" v-html="nbaDetails.teamOne" />
            </div>

            <div class="bet-info-vs">VS</div>

            <div class="info-team info-team-two">
              <div class="info-team-logo">
                <img :src="imgURL + nbaDetails.siteId + '/' + nbaDetails.teamTwoIcon" />
              </div>
              <div class="info-team-name" v-html="nbaDetails.teamTwo" />
            </div>
          </div>
        </div>
      </swiper-slide>
      <!-- </template> -->
    </swiper>
    <!-- <div class="swiper-button-prev" @click="prevSlide"></div> -->
    <!-- <div class="swiper-button-next" @click="nextSlide"></div> -->
  </div>
  <!-- <pre>{{ nbaDetails }}~~~~</pre> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

import { eventapi } from "src/boot/axios";

const nbaDetails = ref([]);
const imgURL = process.env.IMAGE_CDN + "/game-match/";

const formatDate = (dateTimeString) => {
  if (dateTimeString === undefined) {
    return { date: null, time: null };
  }

  const [date, time] = dateTimeString.split(" ");
  return { date, time };
};

const getNbaDetails = () => {
  eventapi
    .get("/game-match/upcoming/NBA")
    .then((res) => {
      if (res.code === 0) {
        nbaDetails.value = res.data;
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

// const prevSlide = () => {
//   $swiper.value.slidePrev();
// };

// const nextSlide = () => {
//   $swiper.value.slideNext();
// };

onMounted(() => {
  getNbaDetails();
});
</script>

<style scoped lang="scss">
.swiper-wrapper {
  max-width: 100%;
}

:deep(.swiper-button-prev) {
  left: 0px;
  margin-top: -30px;
}
:deep(.swiper-button-next) {
  right: 0px;
  margin-top: -30px;
}

.bet-info-box {
  border-radius: 12px;
  border: 1px solid #0c9bff;
  max-width: 90%;
  margin: auto;
  overflow: hidden;

  .bet-info-date {
    background: #0c9bff;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    font-size: 12px;
    line-height: 1;
    color: #ffffff;
    letter-spacing: 2px;
  }

  .bet-info-title {
    text-align: center;
    display: flex;
    justify-content: center;
    padding: 10px 10px 5px;
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
      width: 40%;
      padding-bottom: 10px;

      .info-team-logo {
        img {
          display: block;
          width: 45px;
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

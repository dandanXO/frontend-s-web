<template>
  <div v-if="upcomingMatchDetails.length > 0">
    <div @slideChange="onSlideChange" class="bet-info-container">
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

    <div class="row justify-center q-mt-md">
      <q-btn color="brightbtn" @click="handleSubmit" label="点击申请" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";

import { eventapi } from "src/boot/axios";
import { useUI } from "stores/ui";
import { useQuasar } from "quasar";
import { useLocalStorage } from "@vueuse/core";

const props = defineProps({
  platformType: String
});

const ui = useUI();
const upcomingMatchDetails = ref([]);
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const getupcomingMatchDetails = () => {
  eventapi
    .get(`/game-match/upcoming/COPA`)
    .then((res) => {
      if (res.code === 0) {
        upcomingMatchDetails.value = res.data;
        ui.matchInsuranceLists = upcomingMatchDetails.value;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getMatchDateOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const dateString = dateTimeString.split(" ")[0];
  return dateString || "";
};

const $q = useQuasar();

const getMatchTimeOnly = (matchTime) => {
  if (!matchTime) {
    return "";
  }
  const dateTimeString = matchTime;
  const timeString = dateTimeString.split(" ")[1];
  return timeString || "";
};

const handleSubmit = () => {
  eventapi
    .post("/game-match/submit/COPA")
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "已成功申请",
          icon: "check_circle_outline"
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: response.message,
          icon: "report_problem"
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
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
  if (!store.token) {
    return;
  }
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
  border: 1px solid #0c9bff;

  // box-shadow: 0px 4px 0px 0px #a7c2dd;

  max-width: 90%;
  margin: auto;
  overflow: hidden;
  width: 100%;

  .bet-info-date {
    background: #0c9bff;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    font-size: 12px;
    line-height: 1;
    color: #ffffff;
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
>

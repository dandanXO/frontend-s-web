<template>
  <div>
    <swiper
      :slides-per-view="1"
      :loop="true"
      @swiper="onSwiper"
      :space-between="50"
      @slideChange="onSlideChange"
      class="swiper-wrapper"
    >
      <template v-for="(item, index) in nbaDetails" :key="index">
        <swiper-slide>
          <div class="bet-info-box">
            <div class="bet-info-date">
              {{ formatDate(item.matchTime) }}
            </div>

            <div class="bet-info-title" v-html="item.matchTitle" />

            <div class="bet-info-details">
              <div class="info-team info-team-one">
                <div class="info-team-logo">
                  <img :src="item.teamOneLogo" />
                </div>
                <div class="info-team-name" v-html="item.teamOne" />
              </div>

              <div class="bet-info-vs">VS</div>

              <div class="info-team info-team-two">
                <div class="info-team-logo">
                  <img :src="item.teamTwoLogo" />
                </div>
                <div class="info-team-name" v-html="item.teamTwo" />
              </div>
            </div>
          </div>
        </swiper-slide>
      </template>
    </swiper>
    <div class="swiper-button-prev" @click="prevSlide"></div>
    <div class="swiper-button-next" @click="nextSlide"></div>
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

const nbaDetailsData = ref([
  {
    code: 0,
    data: [
      {
        id: 291,
        teamOne: "菲尼克斯太阳",
        teamOneLogo: "https://ipis-cdn.speedy4site.com/TeamImage/29342.png",
        teamTwo: "金州勇士",
        teamTwoLogo: "https://ipis-cdn.speedy4site.com/TeamImage/2439.png",
        matchTitle: "NBA 美国职业篮球",
        matchTime: 1700708400000,
        type: "NBA",
        endTime: "",
        award: 0
      },
      {
        id: 291,
        teamOne: "菲尼克斯太阳2",
        teamOneLogo: "https://ipis-cdn.speedy4site.com/TeamImage/29342.png",
        teamTwo: "金州勇士2",
        teamTwoLogo: "https://ipis-cdn.speedy4site.com/TeamImage/2439.png",
        matchTitle: "NBA 美国职业篮球",
        matchTime: 1700708400000,
        type: "NBA",
        endTime: "",
        award: 0
      }
    ]
  }
]);

const formatDate = (timestamp) => {
  const dateObject = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Use 24-hour format
    timeZone: "UTC" // Set the timeZone to UTC to prevent the display of the GMT offset
  };

  const formattedDate = dateObject.toLocaleString(undefined, options);
  return formattedDate;
};

const getNbaDetails = () => {
  eventapi
    .get("/game-match/upcoming")
    .then((res) => {
      if (res.code === 0) {
        console.log(res);

        if (!res.data) {
          nbaDetails.value = nbaDetailsData.value[0].data;
        } else {
          nbaDetails.value = res.data;
        }
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

const prevSlide = () => {
  $swiper.value.slidePrev();
};

const nextSlide = () => {
  $swiper.value.slideNext();
};

onMounted(() => {
  getNbaDetails();
});
</script>

<style scoped lang="scss">
.swiper-wrapper {
  max-width: 80%;
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

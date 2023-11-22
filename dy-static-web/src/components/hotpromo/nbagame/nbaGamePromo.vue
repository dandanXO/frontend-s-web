<template>
  <div>
    <swiper :slides-per-view="1" :loop="true" @swiper="onSwiper" @slideChange="onSlideChange" class="swiper-wrapper">
      <template v-for="(item, index) in nbaDetails" :key="index">
        <swiper-slide>
          <div class="bet-info-box">
            <div class="bet-info-date">{{ formatDate(item.matchTime).date }}</div>
            <div class="bet-info-details">
              <div class="info-team info-team-one">
                <div class="info-team-logo">
                  <img src="https://ipis-cdn.speedy4site.com/TeamImage/29342.png" />
                </div>
                <div class="info-team-name" v-html="item.teamOne" />
              </div>

              <div class="bet-info-vs">
                VS
                <br />
                {{ formatDate(item.matchTime).time }}
              </div>

              <div class="info-team info-team-two">
                <div class="info-team-logo">
                  <img src="https://ipis-cdn.speedy4site.com/TeamImage/29610.png" />
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

import { loadNbaDetails } from "@/api/promotion/nbaGame";

const nbaDetails = ref([]);

const nbaDetailsData = ref([
  {
    code: 0,
    data: [
      {
        id: 3,
        siteId: 6,
        matchTitle: "洛杉矶湖人 VS 休斯敦火箭",
        teamOne: "洛杉矶湖人",
        teamOneIcon: "14c91869-db48-43fe-b7e3-8db4ae7aa7dc.png",
        teamTwo: "休斯敦火箭",
        teamTwoIcon: "2ff0117d-4121-4ce4-9e03-104288254147.png",
        gameType: "NBA",
        status: "ACTIVE",
        matchTime: "2023-11-21 22:00:00"
      },
      {
        id: 5,
        siteId: 6,
        matchTitle: "洛杉矶湖人 VS 休斯敦火箭",
        teamOne: "洛杉矶湖人2",
        teamOneIcon: "14c91869-db48-43fe-b7e3-8db4ae7aa7dc.png",
        teamTwo: "休斯敦火箭2",
        teamTwoIcon: "2ff0117d-4121-4ce4-9e03-104288254147.png",
        gameType: "NBA",
        status: "ACTIVE",
        matchTime: "2023-11-21 22:00:00"
      }
    ]
  }
]);

const formatDate = (dateTimeString) => {
  const [date, time] = dateTimeString.split(" ");
  return { date, time };
};

const getNbaDetails = () => {
  loadNbaDetails()
    .then((res) => {
      if (res.code === 0) {
        console.log(res);

        if (!res.data) {
          nbaDetails.value = nbaDetailsData.value[0].data;
          console.log("iffffff");
        } else {
          nbaDetails.value = res.data;
          console.log("elseeeeee");
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
  max-width: 900px;
}

:deep(.swiper-button-prev) {
  left: 100px;
  margin-top: -30px;
}
:deep(.swiper-button-next) {
  right: 100px;
  margin-top: -30px;
}

.bet-info-box {
  border-radius: 12px;
  border: 1px solid #0c9bff;
  max-width: 800px;
  margin: auto;
  overflow: hidden;

  .bet-info-date {
    background: #0c9bff;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    color: #ffffff;
  }

  .bet-info-vs {
    font-weight: bolder;
    font-size: 28px;
    line-height: 1.3;
    text-align: center;
  }

  .bet-info-details {
    padding: 12px 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .info-team {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      width: 280px;
      padding-bottom: 20px;

      .info-team-logo {
        img {
          display: block;
          width: 45px;
        }
      }

      .info-team-name {
        color: #414655;
        font-size: 18px;
        line-height: 1;
        font-weight: bolder;
      }
    }
  }
}
</style>

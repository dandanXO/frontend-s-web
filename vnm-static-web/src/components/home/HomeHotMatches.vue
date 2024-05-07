<template>
  <div class="hot-matches-wrapper">
    <div class="hot-matches-title">🔥Trận Đấu Hot - Hot Matches</div>
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
            <div class="team-details team-details__home">
              <div class="team-icon">
                <img :src="hotMatchesImgURL + item.teamOneLogo" />
              </div>
              <div class="team-name">{{ item.teamOneName }}</div>
            </div>
            <div class="match-details">
              <div class="match-title">{{ item.competitionName }}</div>
              <div class="match-time">{{ item.competitionTime }}</div>

              <div class="match-vs">VS</div>

              <div class="match-btn">
                <a class="standard-button lg-btn btn-color-blue" @click="openGame(item.platformName, item.platformCode, '')">
                  {{ $t("home.playNow") }}
                </a>
              </div>
            </div>
            <div class="team-details team-details__away">
              <div class="team-icon">
                <img :src="hotMatchesImgURL + item.teamTwoLogo" />
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
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { getHotMatches } from "../../api/index/hotMatches.js";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import GameModal from "@/components/modal/GameModal";

const { t } = useI18n();
const hotMatches = ref([]);
const hotMatchesImgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
const onSwiper = (swiper) => {};
const modules = [Navigation, Pagination, Scrollbar, A11y];

const modalGame = ref(null);
const openGame = (gameName, code, gameCode) => {
  modalGame.value.open(gameName, code, gameCode);
};

const loadHotMatches = () => {
  getHotMatches().then((res) => {
    if (res.code === 0) {
      hotMatches.value = res.data;
    }
  });
};

onMounted(() => {
  loadHotMatches();
});
</script>

<style lang="scss">
.hot-matches-wrapper {
  max-width: 1350px;
  margin: 20px auto 10px;

  .hot-matches-title {
    font-size: 24px;
    font-weight: 700;
    color: #313441;
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
    gap: 12px;
    width: 100%;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    position: relative;

    .match-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;

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
        color: #7a80a1;
        font-size: 16px;
        text-align: center;
        margin-top: 40px;
      }

      .match-vs {
        font-size: 50px;
        line-height: 1;
        font-weight: 900;
        font-family: Poppins;
        margin: 10px 0;
        color: rgba(115, 178, 255, 0.2);
      }

      .match-btn {
        margin-top: auto;
        margin-bottom: 12px;
      }
    }

    .team-details {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 30%;

      .team-details__home {
      }

      .team-details__away {
      }

      .team-icon {
        // border-radius: 50%;
        img {
          width: 100px;
          height: 100px;
        }
      }

      .team-name {
        font-size: 18px;
        text-align: center;
        color: #7a80a1;
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

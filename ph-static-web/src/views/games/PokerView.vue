<template>
  <div class="poker-container">
    <div v-if="banner && banner.desktopImageUrl && banner.mobileImageUrl" class="banner-container">
      <div
        class="promo-bg isDesktop"
        :style="
          'background-image: url(' + imgURL + banner.desktopImageUrl + ')'
        "
      ></div>
      <div
        class="promo-bg isMobile"
        :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
      ></div>
    </div>
    <div class="section-product">
      <div
        class="item-group"
        data-aos="slide-down"
        data-aos-easing="ease-out"
        data-aos-duration="1000"
      >
        <div
          v-for="(p, index) in pokerGames"
          :key="index"
          class="set aos-init aos-animate"
          data-aos="fade-up"
        >
          <div class="items" @click="playGame(p.name, p.code, p.gameCode, p.status)">
            <div class="theme">
              <img :src="p.bg" alt="" />
            </div>
            <div class="main-object">
              <img :src="p.main" alt="" />
            </div>
            <div class="txt">
              <img
                :style="p.name === 'Evolution' ? 'max-height:23px;' : ''"
                :src="p.logo"
              />
              <p>
                ประสบการณ์การเล่นเกมที่ล้ำสมัยที่สุด เกมสดสุดคลาสสิก บาคาร่าสด
                ไฮโล เสือมังกร รูเล็ต แบล็คแจ็ค และรายการเกมสดอื่นๆ
              </p>
            </div>
          </div>
        </div>
      </div>
      <GameModal ref="casinoGame"></GameModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadPromoBanner } from "@/api/index/promo";
import GameModal from "@/components/modal/GameModal";
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/";
const casinoGame = ref(null);
const banner = ref([]);

const loadBanner = () => {
  loadPromoBanner("POKER").then((res) => {
    if (res.code === 0) {
      banner.value = res.data[0];
    }
  });
};
function playGame(gameName, platformCode, gameCode, status) {
  casinoGame.value.open(gameName, platformCode, gameCode, status);
}
const pokerGames = [
  // {
  //   code: "JILI",
  //   name: "Jili Games",
  //   gameName: "Jili",
  //   gameCode: "64",
  //   bg: require("../../assets/images/games/poker/poker_1.jpg"),
  //   main: require("../../assets/images/games/poker/poker1_1.png"),
  //   logo: require("../../assets/images/common/logo/jl.png"),
  // },
  // {
  //   code: "RICH88",
  //   name: "Rich88",
  //   gameName: "Rich88",
  //   bg: require("../../assets/images/games/poker/poker_2.jpg"),
  //   main: require("../../assets/images/games/poker/poker2_01.png"),
  //   logo: require("../../assets/images/common/logo/RICH88.png"),
  // },
  // {
  //   code: "KM",
  //   name: "KM",
  //   gameName: "KM",
  //   bg: require("../../assets/images/games/poker/poker_3.jpg"),
  //   main: require("../../assets/images/games/poker/poker3_01.png"),
  //   logo: require("../../assets/images/common/logo/KM.png"),
  // },
];

onMounted(() => {
  loadBanner();
});
</script>
<style scoped lang="scss">
$max-width: 1400px;
.poker-container {
  background: linear-gradient(to bottom, #23263c, #190f25);

  .banner-container {
    width: 100%;
    .promo-bg {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      &.isDesktop {
        display: block;
        height: 430px;
      }
      &.isMobile {
        display: none;
        height: 220px;
      }
    }
  }
}
.section-product {
  width: 95%;
  margin: 0 auto;
  padding: 50px 0 80px 0;
  max-width: $max-width;
  .title {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      margin-top: 20px;
      background-color: rgb(214, 214, 214);
    }
  }
  .subintro {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: 100;
    color: #190f25;
  }
  .item-group {
    padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    &:last-child {
      padding-top: 30px;
    }
  }
  .set {
    margin: auto;
    width: 100%;
  }
  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 340px;
    margin: auto;
    overflow: hidden;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 70px;
        border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }
    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    .txt {
      position: absolute;
      bottom: 0px;
      background: #2b2b4b;
      padding: 20px 80px 20px 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
      }
      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }
    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}
@media (max-width: 768px) {
  .section-product .item-group {
    grid-template-columns: 1fr;
  }
  .poker-container {
    .banner-container {
      .promo-bg {
        &.isDesktop {
          display: none;
        }
        &.isMobile {
          display: block;
        }
      }
    }
  }
}
</style>

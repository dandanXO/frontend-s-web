<template>
  <div class="home">
    <HomeBanner :goBannerPage="goBannerPage" />
    <div class="index-container">
      <div class="index-top-btn-container">
        <div class="index-operator-btn-box">
          <router-link to="/center/deposit">
            <div class="index-operator-btn deposit">我要充值</div>
          </router-link>
          <router-link to="/app" class="index-operator-btn download">下载APP</router-link>
          <router-link to="/promotion" class="index-operator-btn promo">热门活动</router-link>
        </div>
        <div class="index-platform-btn-box">
          <router-link class="index-platform-btn" to="/esports">
            <img src="../assets/home/index_icon_esports.png" />
            <div>电竞游戏</div>
          </router-link>
          <router-link class="index-platform-btn" to="/sports">
            <img src="../assets/home/index_icon_sport.png" />
            <div>体育竞猜</div>
          </router-link>
          <router-link class="index-platform-btn" to="/live-casino">
            <img src="../assets/home/index_icon_live.png" />
            <div>真人娱乐</div>
          </router-link>
        </div>
      </div>
      <div class="index-title-container">
        <div class="index-title-main">场馆投注</div>
        <div class="index-title-sub">VENUES BETTING</div>
      </div>
      <div class="index-platform-container">
        <div class="flip-container">
          <div class="flipper platform-esports">
            <div class="front">
              <div>电竞</div>
              <div class="platform-title-sub">ESPORTS</div>
            </div>
            <div class="back">
              <div
                class="game-platform"
                @click="openGame('东赢', 'onlyPlatform', 'TFGaming')"
                style="margin-top: 48px; margin-left: 46px"
              >
                <img src="../assets/home/dy.png" />
                <div>东赢电竞</div>
              </div>
              <div class="game-platform" @click="openGame('IM电竞', 'onlyPlatform', 'IMES')" style="margin-left: 30px">
                <img src="../assets/home/IM.png" />
                <div>IM电竞</div>
              </div>
              <div class="game-platform" @click="openGame('小艾', 'onlyPlatform', 'IA')" style="margin-left: 14px">
                <img src="../assets/home/IA.png" />
                <div>小艾电竞</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flip-container">
          <div class="flipper platform-sport">
            <div class="front">
              <div>体育竞技</div>
              <div class="platform-title-sub">SPORTS</div>
            </div>
            <div class="back">
              <div
                class="game-platform"
                @click="openGame('IM体育', 'IM', '')"
                style="margin-top: 48px; margin-left: 46px"
              >
                <img src="../assets/home/IM.png" />
                <div>IM体育</div>
              </div>
              <div class="game-platform" @click="openGame('SABA体育', 'SABA', '')" style="margin-left: 28px">
                <img src="../assets/home/saba.png" style="width: 75px" />
                <div>SABA体育</div>
              </div>
              <div class="game-platform" @click="openGame('熊猫体育', 'PM', '')" style="margin-left: 18px">
                <img src="../assets/home/pm.png" style="width: 75px" />
                <div>熊猫体育</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flip-container">
          <div class="flipper platform-live">
            <div class="front">
              <div>真人娱乐</div>
              <div class="platform-title-sub">LIVE CASINO</div>
            </div>
            <div class="back">
              <div
                class="game-platform"
                @click="openGame('DB真人', 'PMLIVE', '')"
                style="margin-top: 48px; margin-left: 46px"
              >
                <img src="../assets/home/db.png" style="width: 75px" />
                <div>DB真人</div>
              </div>
              <div class="game-platform" @click="openGame('PAs真人', 'AG', '')" style="margin-left: 30px">
                <img src="../assets/home/ag.png" style="width: 75px" />
                <div>PA真人</div>
              </div>
              <!-- <div class="game-platform" @click="openGame('欧博真人', 'ALLBET', '')" style="margin-left: 30px">
                <img src="../assets/home/allbet.png" />
                <div>欧博真人</div>
              </div> -->
              <div
                class="game-platform"
                @click="openGame('BBIN真人', 'BBINDY', 'bblive_lobby_pc')"
                style="margin-left: 19px"
              >
                <img src="../assets/home/bbin.png" />
                <div>BBIN真人</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flip-container">
          <div class="flipper platform-lottery">
            <div class="front">
              <div>彩票投注</div>
              <div class="platform-title-sub">LOTTERY</div>
            </div>
            <div class="back">
              <div
                class="game-platform"
                @click="openGame('TCG彩票', 'TCG', '')"
                style="margin-top: 125px; margin-left: 36px"
              >
                <img src="../assets/home/tcg.png" />
                <div>TCG彩票</div>
              </div>
              <div
                class="game-platform"
                @click="openGame('BBIN彩票', 'BBINDY', 'bbkeno_lobby_pc', 'scroll')"
                style="margin-left: 19px"
              >
                <img src="../assets/home/bbin.png" />
                <div>BBIN彩票</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flip-container">
          <div class="flipper platform-poker">
            <div class="front">
              <div>棋牌游戏</div>
              <div class="platform-title-sub">POKER</div>
            </div>
            <div class="back">
              <div
                class="game-platform"
                @click="openGame('开元棋牌', 'KY', '')"
                style="margin-top: 48px; margin-left: 46px"
              >
                <img src="../assets/home/ky.png" />
                <div>开元棋牌</div>
              </div>
              <div class="game-platform" @click="openGame('大唐棋牌', 'DT', '')" style="margin-left: 30px">
                <img src="../assets/home/tx.png" />
                <div>大唐棋牌</div>
              </div>

              <div class="game-platform" @click="openGame('乐游棋牌', 'LEG', '')" style="margin-left: 14px">
                <img src="../assets/home/leg.png" />
                <div>乐游棋牌</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flip-container">
          <div class="flipper platform-fish">
            <div class="front">
              <div>电子游艺</div>
              <div class="platform-title-sub">FISHING</div>
            </div>
            <div class="back">
              <router-link class="game-platform" to="/fishing" style="margin-top: 118px; margin-left: 38px">
                <img src="../assets/home/index_fish.png" />
                <div>捕鱼</div>
              </router-link>
              <router-link class="game-platform" to="/game" style="margin-left: 21px">
                <img src="../assets/home/index_slot.png" />
                <div>电子</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="czsj">
        <div class="title-czsj-zh">重置世界，颠覆未来</div>
        <div class="title-czsj-en">CHANGE THE WORLD</div>
      </div>
      <div class="avg-container">
        <div>
          <div class="avg-time-nv-box">
            <div class="avg-time-content-box">
              <span class="avg-advantage avg-dep-box">
                <Vue3autocounter
                  ref="counter"
                  :startAmount="0"
                  :endAmount="Math.floor(Math.random() * 31) + 50"
                  :duration="1"
                  separator=","
                  :autoinit="true"
                />
              </span>
              秒
            </div>
            <img src="../assets/home/avg-time-active-bg.png" class="avg-active-bg" />
            <div class="avg-circle-container">
              <div class="avg-schedule avg-schedule-container avg-schedule-left">
                <div id="avgDepAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-dep">
                  <div class="avg-circle avg-circle-left"></div>
                </div>
              </div>
              <div class="avg-schedule avg-schedule-container avg-schedule-right">
                <div class="avg-schedule avg-schedule-box avg-schedule-left">
                  <div class="avg-circle avg-circle-right"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="avg-container-en">
            DY
            <br />
            ADVANTAGE
          </div>
          <div>
            <span class="date_color sky_blue"></span>
            平均存款时间
          </div>
        </div>
        <div>
          <div class="avg-time-nv-box">
            <div class="avg-time-content-box">
              <span class="avg-advantage avg-with-box">
                <Vue3autocounter
                  ref="counter"
                  :startAmount="0"
                  :endAmount="Math.floor(Math.random() * 31) + 70"
                  :duration="2"
                  separator=","
                  :autoinit="true"
                />
              </span>
              秒
            </div>
            <img src="../assets/home/avg-time-active-bg.png" class="avg-active-bg" />
            <div class="avg-circle-container">
              <div class="avg-schedule avg-schedule-container avg-schedule-left">
                <div id="avgWithdrawAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-withdraw">
                  <div class="avg-circle avg-circle-left"></div>
                </div>
              </div>
              <div class="avg-schedule avg-schedule-container avg-schedule-right">
                <div class="avg-schedule avg-schedule-box avg-schedule-left">
                  <div class="avg-circle avg-circle-right"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="avg-container-en">
            DY
            <br />
            ADVANTAGE
          </div>
          <div>
            <span class="date_color blue"></span>
            平均取款时间
          </div>
        </div>
        <div>
          <div class="avg-time-nv-box">
            <div class="avg-time-content-box">
              <span class="avg-advantage avg-pay-box">
                <Vue3autocounter
                  ref="counter"
                  :startAmount="0"
                  :endAmount="14"
                  :duration="3"
                  separator=","
                  :autoinit="true"
                />
              </span>
              家
            </div>
            <img src="../assets/home/avg-time-active-bg.png" class="avg-active-bg" />
            <div class="avg-circle-container">
              <div class="avg-schedule avg-schedule-container avg-schedule-left">
                <div id="avgPayFullAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-full">
                  <div class="avg-circle avg-circle-left"></div>
                </div>
              </div>
              <div class="avg-schedule avg-schedule-container avg-schedule-right">
                <div id="avgPayAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-pay">
                  <div class="avg-circle avg-circle-right"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="avg-container-en">
            DY
            <br />
            ADVANTAGE
          </div>
          <div>
            <span class="date_color yellow"></span>
            合作支付平台
          </div>
        </div>
        <div>
          <div class="avg-time-nv-box">
            <div class="avg-time-content-box">
              <span class="avg-advantage avg-down-box">
                <Vue3autocounter
                  ref="counter"
                  :startAmount="0"
                  :endAmount="90"
                  :duration="3"
                  separator=","
                  :autoinit="true"
                />
              </span>
              万
            </div>
            <img src="../assets/home/avg-time-active-bg.png" class="avg-active-bg" />
            <div class="avg-circle-container">
              <div class="avg-schedule avg-schedule-container avg-schedule-left">
                <div id="avgDownFullAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-full">
                  <div class="avg-circle avg-circle-left"></div>
                </div>
              </div>
              <div class="avg-schedule avg-schedule-container avg-schedule-right">
                <div id="avgDownAni" class="avg-schedule avg-schedule-box avg-schedule-left avg-animate-down">
                  <div class="avg-circle avg-circle-right"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="avg-container-en">
            DY
            <br />
            ADVANTAGE
          </div>
          <div>
            <span class="date_color purple"></span>
            客户端下载数量
          </div>
        </div>
      </div>
      <div class="index-bottom-container">
        <div class="index-bottom-box">
          <div class="index-our-tc">
            <div>
              <img src="../assets/home/index_bottom_profession.png" />
            </div>
            <div>
              <div class="serve_tip">更专业</div>
              <div class="index-tc-desc">
                每天为您提供近千场精彩赛事，更有真人、彩票、电子游戏等多种娱乐，让您拥有完美游戏体验。
              </div>
            </div>
          </div>
          <div class="index-our-tc">
            <div>
              <img src="../assets/home/index_bottom_safe.png" />
            </div>
            <div>
              <div class="serve_tip">更安全</div>
              <div class="index-tc-desc">
                独家开发，采用128位加密技术和严格的安全管理体系，客户资金得到最完善的保障，让您全情尽享娱乐、赛事投注，无后顾之忧！
              </div>
            </div>
          </div>
        </div>
        <div class="index-bottom-box">
          <div class="index-our-tc">
            <div>
              <img src="../assets/home/index_bottom_easy.png" />
            </div>
            <div>
              <div class="serve_tip">更便捷</div>
              <div class="index-tc-desc">
                引领市场的卓越技术，自主研发了全套终端应用，让您畅享
                Web、H5，更有iOS、Android原生App，让您随时随地，娱乐投注随心所欲！7×24小时在线客服提供最贴心、最优质的服务。
              </div>
            </div>
          </div>
          <div class="index-our-tc">
            <div>
              <img src="../assets/home/index_bottom_fast.png" />
            </div>
            <div>
              <div class="serve_tip">更快速</div>
              <div class="index-tc-desc">
                最新技术自主研发的财务处理系统，真正做到极速存、取、转。独家网络优化技术，为您提供一流的游戏体验，最大优化网络延迟。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      @close="setWithExpiry('isImpt', true, 43200000)"
      class="imptann-modal"
      v-model="isImportantAnnouncementModal"
      v-if="!isImpt"
    >
      <a @click="clickHomePopupImg(homePopupPath)">
        <img :src="homePopupImg" class="alert-img" />
      </a>
    </el-dialog>
  </div>
  <GameModal ref="gameMenu" />

  <AnnouncementModal />
</template>

<script setup>
/* eslint-disable */
import GameModal from "@/components/modal/GameModal.vue";
import { ref, onMounted, watch } from "vue";
import { loadHomePopup } from "@/api/index/promo";
import Vue3autocounter from "vue3-autocounter";
import { useRouter } from "vue-router";
import { userStore } from "@/store";
import { useLocalStorage } from "@vueuse/core";
import HomeBanner from "@/components/home/HomeBanner.vue";
import AnnouncementModal from "@/components/modal/AnnouncementModal.vue";

const store = userStore();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";
const gameMenu = ref(null);
const router = useRouter();

const isImportantAnnouncementModal = ref(false);
const openGame = (gameName, platType, gameCode, scrollingState) => {
  gameMenu.value.open(gameName, platType, gameCode, scrollingState);
};
const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};
const getWithExpiry = (key) => {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    sessionStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const isFirstView = ref(false);
const isImpt = getWithExpiry("isImpt");
const homePopupImg = ref("");
const homePopupPath = ref("");
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);

const checkShowImgTop = () => {
  const lastTime = sessionStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) {
      isFirstView.value = true;
    }
  } else {
    loadHomePopup("")
      .then((res) => {
        // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
        //   res = apiMockData;
        // }
        const { code, data } = res;
        if (code === 0) {
          if (isImpt === null) {
            switch (data["frequency"]) {
              case "EVERYTIME":
                homePopupFrequencyNum.value = 0;
                break;
              case "EVERYDAY":
                homePopupFrequencyNum.value = 86400000; // 24hrs
                break;
              case "SESSION":
                homePopupFrequencyNum.value = 7866432000; // 3months
                break;
              default:
                homePopupFrequencyNum.value = 10000;
                break;
            }
            isImportantAnnouncementModal.value = true;
            homePopupPath.value = data["path"];
            homePopupImg.value = imgURL + data["desktopImgUrl"];
            homePopupContent.value = data["content"];
            homePopupType.value = data["type"];
            homePopupId.value = data["id"];
            homePopupFrequency.value = data["frequency"];
            isFirstView.value = true;
          } else {
            isImportantAnnouncementModal.value = false;
          }
        }
      })
      .catch(() => {});
  }
};

const clickHomePopupImg = (urlString) => {
  isImportantAnnouncementModal.value = false;

  const openPattern = /^\/open\/(.*)/;
  if (urlString.match(openPattern)) {
    const extractedUrl = urlString.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    gameMenu.value.open(gameName, platformCode, gameCode, "OPEN");
    return;
  }

  // debugger;
  let regexUrl = new RegExp(/^(https:\/\/)/g);
  if (regexUrl.test(urlString)) {
    // 跳轉
    location.href = urlString;
    return;
  }
  let regexName = new RegExp(/^(name|\?name)/g);
  if (regexName.test(urlString)) {
    //去優惠
    router.push(`/promotion${urlString}`);
    return;
  }

  router.push(`${urlString}`);
};

const goBannerPage = (redirectUrl) => {
  const openPattern = /^\/open\/(.*)/;
  if (redirectUrl.match(openPattern)) {
    const extractedUrl = redirectUrl.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");

    gameMenu.value.open(gameName, platformCode, gameCode, "OPEN");
  } else if (redirectUrl == "app://deposit") {
    router.push("/center/deposit");
  } else {
    router.push(`/promotion?name=${redirectUrl}`);
  }
};

onMounted(() => {
  if (store.token && store.memberType === "TEST") {
    checkShowImgTop();
  }
});

watch(
  () => store.token,
  () => {
    if (store.token && store.memberType === "TEST") {
      checkShowImgTop();
    }
  }
);
</script>

<style lang="scss">
.home {
  .banner-slider {
    width: 100%;

    .banner-container {
      .promo-bg {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;

        &.isDesktop {
          display: block;
          height: 100%;
        }

        &.isMobile {
          display: none;
          height: 100%;
        }
      }
    }
  }
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item {
  color: #475669;
  margin: 0;
  text-align: center;

  img {
    height: unset;
    width: 100%;
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #0e121b;
}

.index-container {
  background: url(../assets/home/index_bg_dsj.png) center 1280px no-repeat;
  font-family: "PingFang SC";

  .index-top-btn-container {
    display: flex;
    max-width: calc($maxwidth + 40px);
    justify-content: space-between;
    align-items: flex-start;
    margin: 20px auto;

    .index-operator-btn-box {
      display: flex;
      gap: 5px;

      .index-operator-btn {
        width: 240px;
        height: 90px;
        font-size: 22px;
        letter-spacing: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #e1d4d2;
        padding-left: 60px;
        background-repeat: no-repeat;
        text-decoration: none;
        font-family: "PingFang SC";

        &.deposit {
          background-image: url(../assets/home/btn_bg_deposit.png);
        }

        &.download {
          background-image: url(../assets/home/btn_bg_download.png);
        }

        &.promo {
          background-image: url(../assets/home/btn_bg_promo.png);
        }

        &:hover {
          filter: brightness(1.2);
        }
      }
    }

    .index-platform-btn-box {
      display: flex;

      .index-platform-btn {
        width: 162px;
        height: 96px;
        background-image: url(../assets/home/index_platform_bg.png);
        background-repeat: no-repeat;
        cursor: pointer;
        color: #e1d4d2;
        text-align: center;
        padding-top: 8px;
        font-size: 14px;
        text-decoration: none;

        &:hover {
          filter: brightness(1.2);
        }
      }
    }
  }

  .index-title-container {
    max-width: $maxwidth;
    margin: 0 auto;

    .index-title-main {
      font-size: 40px;
      line-height: 1.5;
      color: #4266ee;
      font-weight: 600;
    }

    .index-title-sub {
      font-size: 32px;
      color: #d0d6ed;
    }
  }

  .index-match-container {
    font-size: 12px;
    display: flex;
    align-items: center;
    color: #fff;
    max-width: $maxwidth;
    justify-content: space-between;
    margin: 0 auto;

    .index-match-box {
      -webkit-transition: all 0.5s;
      transition: all 0.5s;

      &:hover {
        -webkit-transform: scale(1.03);
        transform: scale(1.03);
      }
    }

    .index-match-title {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .index-match-team-container {
      width: 254px;
      margin: 26px auto 114px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .index-team-logo {
        background-color: #f8f8f8;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        margin: 0 auto 15px;
      }

      .txt-vs {
        width: 40px;
        height: 25px;
        background-color: #acb1bf;
        border-radius: 12px;
        line-height: 25px;
        margin-top: -26px;
      }
    }

    .index-match-enter-btn {
      color: #fefefe;
      width: 162px;
      height: 42px;
      background-color: #4765f3;
      border-radius: 20px;
      line-height: 42px;
      font-size: 18px;
      cursor: pointer;
      margin: 0 auto;
      display: block;
      text-decoration: none;
    }
  }

  .index-platform-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    max-width: $maxwidth;
    margin: 30px auto;

    .flipper {
      transition: 0.8s;
      transform-style: preserve-3d;
      position: relative;
      width: 228px;
      height: 500px;
      cursor: pointer;

      &.platform {
        &-live {
          .front {
            background-image: url(../assets/home/index_platform_detail_live.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_live_back.png);
          }
        }

        &-esports {
          .front {
            background-image: url(../assets/home/index_platform_detail_esports.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_esports_back.png);
          }
        }

        &-sport {
          .front {
            background-image: url(../assets/home/index_platform_detail_sport.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_sport_back.png);
          }
        }

        &-lottery {
          .front {
            background-image: url(../assets/home/index_platform_detail_lottery.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_lottery_back.png);
          }
        }

        &-fish {
          .front {
            background-image: url(../assets/home/index_platform_detail_fish.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_fish_back.png);
          }
        }

        &-poker {
          .front {
            background-image: url(../assets/home/index_platform_detail_poker.png);
          }

          .back {
            background-image: url(../assets/home/index_platform_detail_poker_back.png);
          }
        }
      }
    }

    .back,
    .front {
      top: 0;
      left: 0;
      backface-visibility: hidden;
      position: absolute;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      -webkit-transition: 0.8s ease-in-out;
      transition: 0.8s ease-in-out;
    }

    .front {
      width: 228px;
      height: 422px;
      z-index: 2;
      transform: rotateY(0);
      text-align: center;
      color: #fff;
      font-size: 20px;
      padding-left: 38px;
      padding-top: 40px;
      background-repeat: no-repeat;
      background-position: center center;

      .platform-title-sub {
        font-size: 14px;
      }
    }

    .back {
      width: 270px;
      height: 503px;
      transform: rotateY(-180deg);
      background-repeat: no-repeat;
      color: #fff;
      font-size: 20px;
      left: -22px;
      top: -21px;
      padding-top: 13px;

      .game-platform {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        text-decoration: none;
        height: 118px;
        width: 207px;
        padding-top: 10px;
        background-repeat: no-repeat;
        background-position: center center;
        text-align: center;
        cursor: pointer;
        margin-left: 54px;
        color: #fff;

        &:hover {
          color: #fff;
          background-image: url(../assets/home/index_platform_hover.png);
        }
      }
    }

    .flip-container {
      perspective: 1000px;
      transform-style: preserve-3d;

      &:hover {
        .front {
          transform: rotateY(180deg);
        }

        .back {
          transform: rotateY(0);
        }
      }
    }
  }

  .czsj {
    text-align: center;

    .title-czsj-zh {
      font-size: 40px;
      color: #4266ee;
    }

    .title-czsj-en {
      font-size: 32px;
      color: #d0d6ed;
    }
  }

  // .avg-earth,
  // .avg-fox {
  //   background-repeat: no-repeat;
  // }
  // .avg-fox {
  //   width: 1300px;
  //   height: 400px;
  //   margin: 0 auto;
  //   background-image: url(../assets/home/huli_bg.png);
  //   background-repeat: no-repeat;
  //   background-position: right;
  //   text-align: left;
  //   .game-title {
  //     margin: 50px 0 50px 100px;
  //   }
  //   .game-item {
  //     display: flex;
  //     gap: 5px;
  //     margin: 80px 40px;
  //   }
  //   .game-content {
  //     height: 180px;
  //     display: flex;
  //     gap: 5px;
  //   }
  //   .game-left {
  //     border-top-right-radius: 17px;
  //     border-bottom-right-radius: 17px;
  //   }
  //   .game-right {
  //     border-top-left-radius: 17px;
  //     border-bottom-left-radius: 17px;
  //   }
  //   .game-left,
  //   .game-right {
  //     width: 40px;
  //     height: 180px;
  //     line-height: 180px;
  //     background-color: #1c212e;
  //     opacity: 0.8;
  //     text-align: center;
  //     vertical-align: middle;
  //     cursor: pointer;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     > img {
  //       width: 40px;
  //       height: 50px;
  //     }
  //   }
  // }
  // .avg-list,
  // .avg-serve {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }
  // .game-item,
  // .list-content {
  //   display: flex;
  // }
  // .avg-earth {
  //   height: 700px;
  //   background-image: url(../assets/home/earth_bg.png);
  // }
  // .list-content div {
  //   margin: 0 5px;
  //   cursor: pointer;
  //   position: relative;
  // }
  // .list-content div > img {
  //   width: 310px;
  //   height: 310px;
  // }
  // .list-content div > span {
  //   display: block;
  //   width: 98px;
  //   height: 38px;
  //   line-height: 38px;
  //   border-radius: 6px;
  //   border: 2px solid #36eefc;
  //   text-align: center;
  //   color: #30b8c3;
  //   font-size: 14px;
  //   position: absolute;
  //   top: 127px;
  //   left: 110px;
  // }
  // .list-title {
  //   margin-left: 340px;
  // }
  // .avg-serve {
  //   height: 500px;
  // }
  // .serve-title {
  //   margin-left: 150px;
  //   width: 300px;
  //   text-align: center;
  // }
  // .serve-bg {
  //   margin-left: 50px;
  //   width: 800px;
  //   text-align: center;
  // }
  .avg-container {
    display: flex;
    justify-content: space-around;
    padding-bottom: 50px;
    text-align: center;
    color: #5e768c;
    max-width: $maxwidth;
    margin: 45px auto 0;

    .avg-advantage {
      font-size: 30px;
    }

    .avg-active-bg {
      position: absolute;
      left: 3px;
      top: 0;
    }

    .avg-circle-container {
      position: absolute;
      width: 130px;
      height: 130px;
      left: 0px;
      top: 0px;
    }

    .avg-time-nv-box {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 140px;
      height: 116px;
      background-image: url(../assets/home/avg-time-nv-bg.png);
      background-position: center;
      position: relative;
      background-repeat: no-repeat;
    }

    .avg-circle,
    .avg-schedule {
      position: absolute;
      top: 0;
      overflow: hidden;
    }

    .avg-time-content-box {
      width: 97px;
      height: 95px;
      background-image: url(../assets/home/avg-time-container.png);
      background-size: cover;
      line-height: 95px;
      color: #fff;
    }

    .avg-schedule {
      width: 71px;
    }

    .avg-schedule-container {
      height: 115px;
    }

    .avg-circle,
    .avg-schedule-box {
      height: 135px;
    }

    .avg-schedule-left {
      left: 0;
    }

    .avg-schedule-right {
      left: 71px;
      -webkit-transform-origin: left;
      transform-origin: left;
    }

    .avg-circle {
      width: 135px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 50%;
      border: 13px solid rgba(211, 227, 249, 0.8);
    }

    .avg-circle-left {
      left: 2px;
    }

    .avg-circle-right {
      right: 5px;
    }

    .avg-animate-dep {
      -webkit-transform: rotate(125deg);
      transform: rotate(125deg);
      -webkit-animation: avg-time-dep 0.7s linear infinite;
      animation: avg-time-dep 0.7s linear infinite;
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    .avg-animate-withdraw {
      -webkit-transform: rotate(175deg);
      transform: rotate(175deg);
      -webkit-animation: avg-time-withdraw 0.7s linear infinite;
      animation: avg-time-withdraw 0.7s linear infinite;
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    .avg-animate-full {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
      -webkit-transform-origin: right;
      transform-origin: right;
      -webkit-animation: avg-time-full 0.7s linear infinite;
      animation: avg-time-full 0.7s linear infinite;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    .avg-animate-pay {
      -webkit-transform: rotate(75deg);
      transform: rotate(75deg);
      -webkit-transform-origin: left;
      transform-origin: left;
      -webkit-animation: avg-time-pay 0.7s 0.7s linear infinite both;
      animation: avg-time-pay 0.7s 0.7s linear infinite both;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    .avg-animate-down {
      -webkit-transform: rotate(115deg);
      transform: rotate(115deg);
      -webkit-transform-origin: left;
      transform-origin: left;
      -webkit-animation: avg-time-down 0.7s 0.7s linear infinite both;
      animation: avg-time-down 0.7s 0.7s linear infinite both;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    .avg-container-en {
      color: #3d72f6;
      line-height: 16px;
      font-size: 12px;
    }

    @keyframes avg-time-dep {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(125deg);
      }
    }
    @keyframes avg-time-withdraw {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(175deg);
      }
    }
    @keyframes avg-time-pay {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(75deg);
      }
    }
    @keyframes avg-time-full {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(180deg);
      }
    }
    @keyframes avg-time-down {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(115deg);
      }
    }
    @-webkit-keyframes avg-time-dep {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(125deg);
      }
    }
    @-webkit-keyframes avg-time-withdraw {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(175deg);
      }
    }
    @-webkit-keyframes avg-time-pay {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(75deg);
      }
    }
    @-webkit-keyframes avg-time-full {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(180deg);
      }
    }
    @-webkit-keyframes avg-time-down {
      0% {
        -webkit-transform: rotate(0);
      }
      100% {
        -webkit-transform: rotate(115deg);
      }
    }
  }

  .index-bottom-container {
    text-align: left;
    padding-bottom: 83px;
    margin: 0 auto;
    max-width: $maxwidth;

    .index-bottom-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin: 10px auto;
      width: 100%;

      .index-our-tc {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        background-color: #fcfcfc;
        box-shadow: 2px 3px 10px 0 rgba(168, 168, 168, 0.28);
        border-radius: 6px;
        padding: 20px 60px;
        font-size: 18px;
        color: #4b71d2;
        min-height: 100px;
        gap: 20px;

        .index-tc-desc {
          color: #959dab;
          font-size: 14px;
        }

        img {
          display: block;
        }
      }
    }
  }
}

.imptann-modal {
  &.el-dialog {
    max-width: 1300px;
    width: max-content;
    box-shadow: none;
    outline: none;
    background: transparent;
    margin-top: 25%;
    transform: translate(0px, -50%);
    padding: 20px;
  }

  .el-dialog__body {
    padding: 0;

    .inotice-nomorecheck {
      position: absolute;
      clip: rect(0, 0, 0, 0);

      &:checked + .inotice-check-label::before {
        content: "\2713";
        color: #474747;
      }
    }

    .inotice-check-label {
      font-weight: 400;
      color: #474747;
      font-size: 16px;
      letter-spacing: 2px;
      line-height: 32px;

      &:before {
        content: "\a0";
        display: inline-block;
        text-align: center;
        font-weight: 700;
        width: 20px;
        height: 20px;
        background-color: #fff;
        border-radius: 2px;
        border: 1px solid #474747;
        vertical-align: middle;
        line-height: 20px;
        margin-right: 10px;
      }
    }

    .el-button {
      width: 156px;
      height: 44px;
      border-radius: 22px;
      text-align: center;
      color: #474747;
      font-size: 16px;
      letter-spacing: 2px;
      // line-height: 32px;
      cursor: pointer;

      &.knew {
        background-color: #fff;
        border: 1px solid #474747;

        > span {
          color: #474747;
        }
      }

      &.more {
        background-image: linear-gradient(90deg, #19c6ff 0, #0094ff 100%), linear-gradient(#fff, #fff);
        border: 0;

        a {
          text-decoration: none;
          color: #fff;
        }
      }
    }
  }

  .alert-img {
    display: block;
    width: 100%;
    border-radius: 12px;
  }

  .el-dialog__headerbtn {
    // background: #0fb0ff !important;
    // height: 36px !important;
  }
}
</style>

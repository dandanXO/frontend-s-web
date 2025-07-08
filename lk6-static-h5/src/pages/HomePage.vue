<template>
  <q-page>
    <div id="id-sticky-header" :class="!isH5 || isShowDownload == false ? 'sticky-header' : ''">
      <div v-if="isH5 && isShowDownload" class="download-top-container">
        <div class="download-top-box">
          <q-icon name="close" @click="closeTopBox" />
          <img class="headicon" src="../assets/index/logo-char.png" />
          <div class="download-txt-container">
            <span class="download-title text-bold">幸运6 APP</span>
            <span class="download-content">覆盖全部游戏，体验更流畅，更安全，更快捷</span>
          </div>
          <div class="buttons">
            <q-btn
              rounded
              size="12px"
              @click="openDownloadAppLink"
              label="立即下载"
              color="primary"
              class="top-btn no-shadow"
            />
          </div>
        </div>
      </div>

      <div class="home-header-section" style="height: 50px; padding: 1px 10px">
        <div class="header-left">
          <img class="top-logo" id="logo" src="../assets/index/logo.png" />
        </div>
        <div class="header-right">
          <!-- <span class="memorable-url">易记网址：{{ memorableUrl }}</span>
          <button class="copy-btn" @click="handleCopyMemorableUrlClick">🔍</button> -->
          <router-link class="notification-section" to="/account/inbox?redirect=home">
            <img src="../assets/index/home-notification-icon.svg" alt="" />
            <div class="notification-dot" v-if="store.unreadInboxMail > 0"></div>
          </router-link>
        </div>
      </div>

      <div v-if="isStickyGameType" class="home-header-section" style="height: 68px; width: 95%; margin: 0 auto">
        <GameTypeSwiper v-model="selectedTab" scroll-to-center :list="tabs" @swiper="setSecondSwiper" />
      </div>
    </div>

    <div class="home-all-slider" :class="isShowDownload && isH5 ? '' : 'padding-normal'">
      <div class="home-top-slider">
        <q-carousel
          class="home"
          autoplay
          navigation
          v-model="slide"
          swipeable
          transition-next="slide-left"
          transition-prev="slide-right"
          animated
          infinite
        >
          <template v-slot:navigation-icon="{ active, onClick }">
            <q-btn
              padding="3px"
              v-if="active"
              size="xs"
              color="white"
              @click="onClick"
              style="border: 1px solid #ffffff; border-radius: 50%; margin: 6px 8px"
            />
            <q-btn
              padding="3px"
              v-else
              size="xs"
              color="transparent"
              @click="onClick"
              style="border: 1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px"
            />
          </template>

          <q-carousel-slide
            v-for="(banner, i) in banners"
            :key="i"
            :name="i"
            class="column no-wrap flex-center"
            :img-src="imgURL + banner.mobileImageUrl"
            @click="gotoPromo(banner)"
          ></q-carousel-slide>
        </q-carousel>
      </div>

      <div class="midd" v-if="announcementList.length > 0">
        <div class="station-notice-wrapper">
          <div class="notice">
            <img src="../assets/index/home-announce-icon.svg" width="18px" />
          </div>
          <marquee-text :repeat="5" :duration="calculateMaxContentLength() < 30 ? calculateMaxContentLength() * 4 : 70">
            <div v-if="announcementList">
              <span style="color: #7a80a1" v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                {{ a.content }}
              </span>
            </div>
          </marquee-text>
          <img src="../assets/index/home-hot-match-icon.png" width="62px" />
        </div>
      </div>

      <div class="home-auth-section">
        <div class="row justify-center items-center gap-10">
          <router-link
            v-if="!store.hasToken()"
            class="text-center col home-auth-subsection"
            to="/login"
            style="text-decoration: none"
          >
            <div style="color: #333333">您还未登录</div>
            <div style="color: #96a9bb">登录/注册后查看</div>
          </router-link>
          <div v-else class="column justify-start home-login-section">
            <div class="row">
              <div class="welcome-liner">
                {{ store.nickName }}
              </div>
              <div class="badge-div">
                {{ store.vip }}
              </div>
            </div>
            <div class="row items-center justify-start gap-10" style="width: 100%">
              <span class="balance-text text-positive" v-if="isLoadingBalance" style="font-size: 20px">加载中...</span>
              <span class="balance-text" v-if="!isLoadingBalance">{{ mainWallet.toFixed(2) }}</span>
            </div>
          </div>

          <div class="row gap-8 justify-between home-quick-link-section">
            <router-link class="text-center cash-button" :unelevated="true" to="/finance/deposit?redirect=home">
              <img src="../assets/index/home-deposit-icon.svg" alt="" width="100%" />
              <p>存款</p>
            </router-link>
            <router-link class="text-center cash-button" :unelevated="true" to="/finance/withdraw?redirect=home">
              <img src="../assets/index/home-withdrawal-icon.svg" alt="" width="100%" />
              <p>提款</p>
            </router-link>
            <router-link class="text-center cash-button" :unelevated="true" to="/account/transfer?redirect=home">
              <img src="../assets/index/home-transfer-icon.svg" alt="" width="100%" />
              <p>转帐</p>
            </router-link>
            <router-link class="text-center cash-button" :unelevated="true" to="/account/vip?redirect=home">
              <img src="../assets/index/home-vip-icon.svg" alt="" width="100%" />
              <p>VIP</p>
            </router-link>
          </div>
        </div>
      </div>

      <div class="home-header-section" style="width: 95%; margin: 0 auto">
        <GameTypeSwiper
          v-if="!isStickyGameType"
          scroll-to-center
          :list="tabs"
          v-model="selectedTab"
          @swiper="setSecondSwiper"
        />
      </div>

      <div ref="swiperContainerRef" class="swiper-container">
        <!-- Thumbs Swiper -> store swiper instance -->

        <div class="index-platform-container" style="overflow: hidden">
          <!-- Main Swiper -> pass thumbs swiper instance -->
          <!--        <swiper-->
          <!--            :modules="[Thumbs, Controller]"-->
          <!--            :thumbs="{ swiper: thumbsSwiper }"-->
          <!--            :direction="'vertical'"-->
          <!--            slides-per-view="auto"-->
          <!--            :rewind="true"-->
          <!--            :scrollbar="{ draggable: true }"-->
          <!--            @slide-change-transition-end="onSlideChange"-->
          <!--            @swiper="setFirstSwiper"-->
          <!--            :controller="{ control: secondSwiper }"-->
          <!--            class="secondSwiper"-->
          <!--            id="btm-second-swiper"-->
          <!--        >-->

          <div class="secondSwiper" id="btm-second-swiper">
            <div v-if="selectedTab === 'sport'" id="id-sport-slide" class="sport-slides home-swiper-slide">
              <div class="home-game-boards">
                <div class="game-list-div">
                  <div v-for="(sp, i) in sport" :key="i" class="game-item-div">
                    <div class="game-board">
                      <!--                      <img class="game-bg"-->
                      <!--                           :src="require(`../assets/index/${sp.icon}/slide-${sp.icon}-${sp.name.toLowerCase()}.png`)"/>-->
                      <!--                      -->
                      <div
                        class="game-bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/index/${sp.icon}/slide-${
                                sp.icon
                              }-${sp.name.toLowerCase()}.png`)})`;
                            } catch (e) {
                              return '';
                            }
                          })()
                        }"
                      ></div>

                      <div class="game-title">
                        <span class="game-title-1">体育赛事</span>
                        <h3 class="game-title-2">{{ sp.title }}</h3>
                        <RedirectButton class="redirect-button" @click="playGame(sp.name, sp.code, sp.gameCode)">
                          立即投注
                        </RedirectButton>
                      </div>

                      <div class="maintenance-box" v-if="sp.underMaintenance">
                        <p>维护中</p>
                        <template v-if="sp.maintenanceStartTime && sp.maintenanceEndTime">
                          <div class="small-size q-mt-md">维护时间：</div>
                          <p class="small-size">
                            {{ moment(sp.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }}
                          </p>
                          <p class="small-size">-</p>
                          <p class="small-size">
                            {{ moment(sp.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }}
                          </p>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--          <PlatformBlock-->
              <!--              @click="playGame(sp.name, sp.code, sp.gameCode)"-->
              <!--              dataType="sport"-->
              <!--              :data="sp"-->
              <!--          />-->
            </div>

            <div v-if="selectedTab === 'live'" id="id-live-slide" class="live-slides home-swiper-slide">
              <div class="home-game-boards">
                <div class="game-list-div">
                  <div v-for="(live, i) in livecasino" :key="i" class="game-item-div">
                    <PlatformItem :platform="live" @click="playGame(live.title, live.code)" />
                    <!-- <template v-if="live.code === 'BBINDY' && live.name === 'BBIN'">
                      <div class="game-board" @click="playGame(live.name, live.code, 'bblive_lobby_app')">
                        <div
                          class="game-bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/index/${live.icon}/slide-${
                                  live.icon
                                }-${live.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return '';
                              }
                            })()
                          }"
                        ></div>

                        <div class="game-title">
                          <span>真人娱乐</span>
                          <h3>{{ live.title }}</h3>
                        </div>

                        <div class="maintenance-box" v-if="live.underMaintenance">
                          <p>维护中</p>
                          <template v-if="live.maintenanceStartTime && live.maintenanceEndTime">
                            <div class="small-size q-mt-md">维护时间：</div>
                            <p class="small-size">
                              {{ moment(live.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                            <p class="small-size">-</p>
                            <p class="small-size">
                              {{ moment(live.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                          </template>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="live.code === 'PMLIVE' && live.name === 'PMLIVE'">
                      <div class="game-board" @click="playGame(live.name, live.code, live.gameCode)">
                        <div
                          class="game-bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/index/${live.icon}/slide-${
                                  live.icon
                                }-${live.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return '';
                              }
                            })()
                          }"
                        ></div>

                        <div class="game-title">
                          <span>真人娱乐</span>
                          <h3>DB</h3>
                        </div>

                        <div class="maintenance-box" v-if="live.underMaintenance">
                          <p>维护中</p>
                          <template v-if="live.maintenanceStartTime && live.maintenanceEndTime">
                            <div class="small-size q-mt-md">维护时间：</div>
                            <p class="small-size">
                              {{ moment(live.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                            <p class="small-size">-</p>
                            <p class="small-size">
                              {{ moment(live.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                          </template>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="live.code === 'SEXY' && live.name === 'SEXY'">
                      <div class="game-board" @click="playGame(live.name, live.code, live.gameCode)">
                        <div
                          class="game-bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/index/${live.icon}/slide-${
                                  live.icon
                                }-${live.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return '';
                              }
                            })()
                          }"
                        ></div>

                        <div class="game-title">
                          <span>真人娱乐</span>
                          <h3>SEXY</h3>
                        </div>

                        <div class="maintenance-box" v-if="live.underMaintenance">
                          <p>维护中</p>
                          <template v-if="live.maintenanceStartTime && live.maintenanceEndTime">
                            <div class="small-size q-mt-md">维护时间：</div>
                            <p class="small-size">
                              {{ moment(live.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                            <p class="small-size">-</p>
                            <p class="small-size">
                              {{ moment(live.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                          </template>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="game-board" @click="playGame(live.title, live.code, live.gameCode)">
                        <div
                          class="game-bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/index/${live.icon}/slide-${
                                  live.icon
                                }-${live.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return '';
                              }
                            })()
                          }"
                        ></div>

                        <div class="game-title">
                          <span>真人娱乐</span>
                          <h3>{{ live.title }}</h3>
                        </div>

                        <div class="maintenance-box" v-if="live.underMaintenance">
                          <p>维护中</p>
                          <template v-if="live.maintenanceStartTime && live.maintenanceEndTime">
                            <div class="small-size q-mt-md">维护时间：</div>
                            <p class="small-size">
                              {{ moment(live.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                            <p class="small-size">-</p>
                            <p class="small-size">
                              {{ moment(live.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }}
                            </p>
                          </template>
                        </div>
                      </div>
                    </template> -->
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedTab === 'baccarat'" id="id-baccarat-slide" class="sport-slides home-swiper-slide">
              <div class="home-game-boards">
                <div class="game-list-div">
                  <template v-for="(platform, index) in baccaratCategoryList" :key="index">
                    <div class="game-list-inner-div">
                      <div class="game-list-header-wrapper">
                        <div class="game-list-header__title-wrapper">
                          <template v-if="index === 0">
                            <img src="../assets/index/baccarat/baccarat-header.png" />
                            百家乐
                          </template>
                          <template v-else-if="index === 1">
                            <img src="../assets/index/baccarat/roulette-header.png" />
                            轮盘
                          </template>
                          <template v-else-if="index === 2">
                            <img src="../assets/index/baccarat/lucky-lace-header.png" />
                            幸运蕾丝
                          </template>
                        </div>
                        <div class="game-list-header__action-wrapper">
                          <router-link :to="`/baccarat?platform=EEAI&tab=${platform.name}`">
                            <q-btn class="game-list-header__all-btn" rounded dense>全部</q-btn>
                          </router-link>
                          <q-btn
                            class="game-list-header__navigation-btn"
                            dense
                            :disable="getNavigationButtonStatus(index, 'prev')"
                            @click="handleSlidePrevClick(index)"
                          >
                            <q-icon name="keyboard_arrow_left" />
                          </q-btn>
                          <q-btn
                            class="game-list-header__navigation-btn"
                            dense
                            :disable="getNavigationButtonStatus(index, 'next')"
                            @click="handleSlideNextClick(index)"
                          >
                            <q-icon name="keyboard_arrow_right" />
                          </q-btn>
                        </div>
                      </div>
                      <swiper
                        :slides-per-view="3"
                        :slides-per-group="2"
                        :grid="{
                          rows: 2,
                          fill: 'row'
                        }"
                        :modules="[Grid]"
                        :space-between="6"
                        @swiper="(swiper) => setBaccaratSwiper(swiper, index)"
                      >
                        <swiper-slide
                          v-for="(game, gameIndex) in platform.list"
                          class="game-slide"
                          :key="`${index}-${gameIndex}`"
                        >
                          <div
                            class="game-bg"
                            :style="{
                              backgroundImage: (() => {
                                try {
                                  return `url(${imgURLGame}${item.icon})`;
                                } catch (e) {
                                  try {
                                    return `url(${require(`../assets/index/baccarat/slide-${platform.name}-img.png`)})`;
                                  } catch (e) {
                                    return '';
                                  }
                                }
                              })()
                            }"
                            @click="playGame(game.name, game.platformCode, game.code)"
                          />
                        </swiper-slide>
                      </swiper>
                    </div>
                  </template>
                  <!-- <div v-for="(sp, i) in baccarat" :key="i" class="game-item-div"> -->
                  <!-- <div class="game-board" @click="playGame(sp.name, sp.code, sp.gameCode)"> -->
                  <!-- <img class="game-bg" -->
                  <!-- :src="require(`../assets/index/${sp.icon}/slide-${sp.icon}-${sp.name.toLowerCase()}.png`)"/> -->

                  <!-- <div -->
                  <!-- class="game-bg" -->
                  <!-- :style="{ -->
                  <!-- backgroundImage: (() => { -->
                  <!-- try { -->
                  <!-- return `url(${require(`../assets/index/${sp.icon}/slide-${ -->
                  <!-- sp.icon -->
                  <!-- }-${sp.name.toLowerCase()}.png`)})`; -->
                  <!-- } catch (e) { -->
                  <!-- return ''; -->
                  <!-- } -->
                  <!-- })() -->
                  <!-- }" -->
                  <!-- ></div> -->
                  <!--  -->
                  <!-- <div class="game-title"> -->
                  <!-- <span>体育赛事</span> -->
                  <!-- <h3>{{ sp.title }}</h3> -->
                  <!-- </div> -->
                  <!--  -->
                  <!-- <div class="maintenance-box" v-if="sp.underMaintenance"> -->
                  <!-- <p>维护中</p> -->
                  <!-- <template v-if="sp.maintenanceStartTime && sp.maintenanceEndTime"> -->
                  <!-- <div class="small-size q-mt-md">维护时间：</div> -->
                  <!-- <p class="small-size"> -->
                  <!-- {{ moment(sp.maintenanceStartTime).format("YYYY/MM/DD hh:mm:ss A") }} -->
                  <!-- </p> -->
                  <!-- <p class="small-size">-</p> -->
                  <!-- <p class="small-size"> -->
                  <!-- {{ moment(sp.maintenanceEndTime).format("YYYY/MM/DD hh:mm:ss A") }} -->
                  <!-- </p> -->
                  <!-- </template> -->
                  <!-- </div> -->
                  <!-- </div> -->
                  <!-- </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <q-page-sticky v-if="isShowBackTop" position="bottom-right" :offset="[18, 76]" style="transform: none; z-index: 999">
    <q-btn padding="sm" color="blue-6" @click="scrollToTop" fab icon="keyboard_arrow_up" />
  </q-page-sticky>

  <GameModal ref="allGames"></GameModal>

  <q-dialog class="station-notice-dialog" width="100%" v-model="isStationNotice">
    <q-card
      style="width: 85%; border-radius: 12px; position: relative; padding: 20px 12px 12px 12px"
      class="bg-[#0000001A] text-black"
    >
      <q-card-section class="q-mb-md" style="display: flex; flex-direction: column">
        <q-tabs
          v-model="activeKey"
          dense
          align="justify"
          active-class="tab-active"
          content-class="tabs-wrapper"
          indicator-color="transparent"
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
            <q-list style="min-height: 65vh">
              <div v-for="(ann, idx) in announcementList" :key="idx">
                <span v-if="ann.typeId === tab.id">
                  <q-expansion-item
                    style="max-height: 65vh; overflow: auto; color: #6c6c6e"
                    expand-icon-class="text-grey-5"
                    group="somegroup"
                    icon="notifications_none"
                    :label="ann.title"
                  >
                    <q-card>
                      <q-card-section style="color: #9f9f9f">
                        {{ ann.content }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-separator></q-separator>
                </span>
              </div>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-page-sticky v-if="showDomain" position="bottom-right" :offset="domainPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingDomainFab" v-touch-pan.prevent.mouse="moveDomainFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideDomain()"></q-btn>
      <q-carousel
        class="float"
        :navigation="floatDomain.length > 1 ? true : false"
        v-model="domainSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(game, i) in floatDomain" :key="i" :name="i" @click="openLink(game.code)">
          <div class="rocket-wrapper">
            <div class="rocket">
              <img loading="lazy" style="width: 100px" :src="`${imgURLFloat}/promo/${game.icon}`" />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>
  <q-page-sticky v-if="showFloatPromo" position="bottom-right" :offset="promoPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingPromoFab" v-touch-pan.prevent.mouse="movePromoFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideFloatPromo()"></q-btn>
      <q-carousel
        class="float"
        :navigation="floatPromo.length > 1 ? true : false"
        v-model="promoSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        :keep-alive="false"
        autoplay
        :autoplay-interval="3000"
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(promo, i) in floatPromo" :key="i" :name="i" @click="gotoFloatPromo(promo.code)">
          <div class="rocket-wrapper">
            <div class="rocket">
              <img loading="lazy" style="width: 100px" :src="`${imgURLFloat}/promo/${promo.icon}`" />
              <span v-show="promo.showTime" class="promo-remaining-time">
                {{ floatPromoRemainingTime[i] }}
              </span>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>

  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isAppUpdateModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div class="titles backgroundColor">更新公告</div>
        </div>
        <div class="contents">检测到新版本，你是否要更新？</div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate">取消</div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">立即更新</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="isFirstView">
    <q-card style="width: 70%; max-width: 290px; margin: 0 auto" class="bg-white text-black">
      <q-card-section class="q-mb-md">
        <img :src="homePopupImg" alt="" class="alert-image" />
        <div class="close-alert" @click="closeAlert()">
                   <q-icon color="white" size="24px" name="close"></q-icon>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog> -->
  <q-dialog width="100%" v-model="isImportantAnnouncementModal" @update:model-value="setExpiryBanner()">
    <q-card flat style="width: 70%; max-width: 500px; background-color: transparent; margin: 0 auto" class="text-white">
      <q-card-section style="background-color: transparent">
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <div class="promo-banner-container">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" @click="clickHomePopupImg(homePopupPath)" v-else>
            <img loading="lazy" :src="homePopupImg" class="alert-img" style="max-width: 100%" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";

import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";

import { useUI } from "stores/ui";
import { Scrollbar } from "swiper";
// Import Swiper Vue.js components
import SwiperCore, { Keyboard, Mousewheel, HashNavigation, A11y, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, Controller, Grid } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/scrollbar";

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation, Navigation, Pagination]);

import PlatformBlock from "components/platform/PlatformBlock.vue";
import PlatformItem from "components/platform/PlatformItem.vue";
import { translateRecord } from "src/directives/translate";
import { isAndroid, isHuaweiPhone } from "boot/utils";
import moment from "moment";
import { useLocalStorage } from "@vueuse/core";
import GameTypeSwiper from "src/components/home/GameTypeSwiper.vue";
import { useNotify } from "src/hooks/notify";
import { LIVE_PLATFORMS } from "src/constant/platform";
import RedirectButton from "src/components/RedirectButton.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    MarqueeText,
    PlatformBlock,
    GameTypeSwiper,
    PlatformItem,
    RedirectButton
  },
  setup() {
    const notify = useNotify();

    const isFirstView = ref(false);
    const isStickyGameType = ref(false);
    const thumbsSwiper = ref(null);
    const firstSwiper = ref(null);
    const secondSwiper = ref(null);
    const slotSwiper = ref(null);
    const slotSwiper2 = ref(null);
    const baccaratSwiper = ref(null);
    const rouletteSwiper = ref(null);
    const luckyLaceSwiper = ref(null);

    const setFirstSwiper = (swiper) => {
      firstSwiper.value = swiper;
    };
    const setSecondSwiper = (swiper) => {
      secondSwiper.value = swiper;
    };
    const setSlotSwiper = (swiper) => {
      slotSwiper.value = swiper;
    };
    const setSlotSwiper2 = (swiper) => {
      slotSwiper2.value = swiper;
    };

    const setBaccaratSwiper = (swiper, index) => {
      switch (index) {
        case 0:
          baccaratSwiper.value = swiper;
          break;
        case 1:
          rouletteSwiper.value = swiper;
          break;
        case 2:
          luckyLaceSwiper.value = swiper;
          break;
      }
    };

    const setSelectedSwiper = (tab) => {
      // console.log(tab.name);
      var slideIndex = 0;
      if (tab.name === "live") {
        scrollToSlide("id-live-slide");
      }
      if (tab.name === "sport") {
        scrollToSlide("id-sport-slide");
      }
      if (tab.name === "esport") {
        scrollToSlide("id-esport-slide");
      }
      if (tab.name === "slot") {
        scrollToSlide("id-slot-slide");
      }
      if (tab.name === "fish") {
        scrollToSlide("id-fish-slide");
      }
      if (tab.name === "poker") {
        scrollToSlide("id-poker-slide");
      }
      if (tab.name === "lottery") {
        scrollToSlide("id-lottery-slide");
        // window.scrollTo(0, 0);
      }
    };

    const onSlideChange = (swiper) => {
      // Get the active slide index
      const activeIndex = swiper.activeIndex;

      // Get the active slide element
      const activeSlide = swiper.slides[activeIndex];

      // Get the class name of the active slide
      const activeSlideClassName = activeSlide.className;
      // Check if the class name contains "sport," "slot," or "esport"
      // Array of keywords to check
      const keywords = ["sport", "esport", "live", "poker", "lottery", "slot", "fishing"];

      // Iterate over each keyword
      for (const keyword of keywords) {
        // Check if the class name contains the current keyword
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword;
        }
      }
    };
    const selectedTab = ref("sport");
    const game_bg_color = ref([]);
    const tabs = ref([
      {
        name: "sport",
        icon: "slide-sport-icon.png",
        iconActive: "slide-sport-icon-active.png",
        label: "体育",
        labelact: "体育",
        mb: 0,
        gap: 8
      },
      {
        name: "live",
        icon: "slide-live-icon.png",
        iconActive: "slide-live-icon-active.png",
        label: "真人",
        labelact: "真人",
        mb: 0,
        gap: 8
      },
      // TODO: check name
      {
        name: "baccarat",
        icon: "slide-baccarat-icon.png",
        iconActive: "slide-baccarat-icon-active.png",
        label: "百家乐",
        labelact: "百家乐",
        mb: 0,
        gap: 8
      }
    ]);
    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
    const hotgames = ref([]);
    const poker = ref([]);
    const lottery = ref([]);
    const slot = ref([]);
    const fishing = ref([]);
    const baccarat = ref([]);
    const roulette = ref([]);
    const luckyLace = ref([]);

    const slot_odds = computed(() => {
      var filtered = slot.value.filter(function (element, index, array) {
        return index % 2 === 0;
      });
      return filtered;
    });
    const slot_evens = computed(() => {
      var filtered = slot.value.filter(function (element, index, array) {
        return index % 2 === 1;
      });
      return filtered;
    });

    const ui = useUI();
    const scrollPageRef = ref(null);
    const isH5 = ref(false);
    const checkPlatform = () => {
      //Is iOS Webclip App || Is Android Apk
      if (
        (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
      ) {
        isH5.value = false;
      } else {
        isH5.value = true;
      }
    };

    const scrollPosition = ref(0);
    const isZeroScrollPos = ref(true);
    const scrollSlotRef = ref();
    const scrollToTop = (el) => {
      window.scrollTo(0, 0, "smooth");
    };

    const isScrolling = ref(false);
    const swiperContainerRef = ref(null);
    const scrollToSlide = (slide_id) => {
      isScrolling.value = true;
      var slideItem = document.getElementById(slide_id);
      if (slideItem) {
        const positionY = slideItem.offsetTop;
        const topHeight = document.getElementById("id-sticky-header").offsetHeight;
        const parentOffset = swiperContainerRef.value.offsetTop ?? 0;
        let offset = isStickyGameType.value ? 0 : 60;
        const y_axis = positionY + parentOffset - topHeight - offset;

        window.scroll({
          top: y_axis,
          left: 0,
          behavior: "smooth"
        });
        setTimeout(() => {
          isScrolling.value = false;
        }, 1500);
      }
    };

    const store = userStore();
    const $q = useQuasar();
    const banners = ref(null);
    const route = useRoute();
    const router = useRouter();
    const isShowBackTop = ref(false);
    const isShowDownload = ref(true);
    // if (store.hasToken()) {
    //   isShowDownload.value = false;
    // }

    const onHomeScroll = (position) => {
      if (route.path === "/") {
        // console.log(position);
        scrollPosition.value = position;
        if (position === 0) {
          isZeroScrollPos.value = true;
        } else {
          isZeroScrollPos.value = false;
        }
        // if (!store.hasToken()) {
        if (position > 55) {
          isShowDownload.value = false;
        } else {
          isShowDownload.value = true;
        }
        // }

        if (position > 350) {
          isStickyGameType.value = true;
        } else {
          isStickyGameType.value = false;
        }

        if (position > 400) {
          isShowBackTop.value = true;
        } else {
          isShowBackTop.value = false;
        }

        const minScrollTop = swiperContainerRef.value.offsetTop;
        if (!isScrolling.value && position > minScrollTop) {
          const stickyHeight = document.getElementById("id-sticky-header").offsetHeight;

          const esportSlide = document.getElementById("id-esport-slide");
          const sportSlide = document.getElementById("id-sport-slide");
          const liveSlide = document.getElementById("id-live-slide");
          const slotSlide = document.getElementById("id-slot-slide");
          const pokerSlide = document.getElementById("id-poker-slide");
          const lotterySlide = document.getElementById("id-lottery-slide");
          const fishSlide = document.getElementById("id-fish-slide");

          const esportTop = esportSlide.getBoundingClientRect().top;
          const sportTop = sportSlide.getBoundingClientRect().top;
          const liveTop = liveSlide.getBoundingClientRect().top;
          const slotTop = slotSlide.getBoundingClientRect().top;
          const pokerTop = pokerSlide.getBoundingClientRect().top;
          const lotteryTop = lotterySlide.getBoundingClientRect().top;
          const fishTop = fishSlide.getBoundingClientRect().top;

          // console.log(topHeight);
          // console.log(positionTop6);
          // console.log(positionTop6 - 40 <= topHeight);

          if (fishTop - 100 <= stickyHeight) {
            selectedTab.value = "fish";
          } else if (lotteryTop <= stickyHeight) {
            selectedTab.value = "lottery";
          } else if (slotTop <= stickyHeight) {
            selectedTab.value = "slot";
          } else if (pokerTop <= stickyHeight) {
            selectedTab.value = "poker";
          } else if (liveTop <= stickyHeight) {
            selectedTab.value = "live";
          } else if (sportTop <= stickyHeight) {
            selectedTab.value = "sport";
          } else if (esportTop <= stickyHeight) {
            selectedTab.value = "esport";
          }
        }
      }
    };

    // ui.$onAction(({name, args}) => {
    //   switch (name) {
    //     case "setScrollPosition":
    //       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
    //   }
    // });

    const mainWallet = computed(() => {
      return store.balance;
    });

    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then((res) => {
        isLoadingBalance.value = false;
      });
    };
    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      allGames.value.open(gameName, platformCode, gameCode, gameStatus);
    };

    function loadData() {
      const randNum = Math.floor(Math.random() * 1000) + 1;
      api
        .get(`/opt-session/promo/banner?category=HOME&v=${randNum}`)
        .then((res) => {
          if (res.code === 0) {
            // banners.value = res.data;
            banners.value = res.data.filter((item) => {
              if (isH5.value) return item.showH5;
              if (!isH5.value) return item.showApp;
              return item.showH5; // For WEB or fallback
            });
            // console.log(banners.value)
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: res.data.message,
            //   icon: "report_problem"
            // });
          }
          // banners.value = response.data;
        })
        .catch(() => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: "Loading failed",
          //   icon: "report_problem"
          // });
        });
    }

    const platforms = ref([]);
    const selectedPlatId = ref();
    const selectedPlat = ref(platforms.value[0]);
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const gameListData = ref([]);
    const fishPlatforms = ref([]);

    const hotSlots = ref(["PG"]);
    const hotLives = ref(["AG"]);
    const hotEsports = ref(["TFGaming", "IMES"]);
    const hotSports = ref(["IM", "PM"]);
    const hotPokers = ref([""]);
    const hotLotterys = ref([""]);

    const baccaratCategoryList = computed(() => [
      { name: "baccarat", list: baccarat.value },
      { name: "roulette", list: roulette.value },
      { name: "lucky-lace", list: luckyLace.value }
    ]);

    var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
    var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";
    const getPlatList = () => {
      cached
        .get(platformApiKey, () =>
          api.get(platformApiUrl).then((res) => {
            return res;
          })
        )
        .then((data) => {
          var pf = data;
          ui.slotLists = [];
          pf.forEach((element) => {
            var gameStatus = element.status;
            if (gameStatus === "TEST" && store.memberType !== "TEST") {
              return;
            }

            const platTypes = element.gameType.split(",");

            if (platTypes.indexOf("ESPORT") > -1) {
              var espObj = Object.assign({}, element);
              var esportOrder = 1;

              if (espObj.code === "TFGaming") {
                espObj.title = "东赢电竞";
              } else {
                espObj.title = getAliasName(element, "ESPORT");
              }
              // if (espObj.code === "IA") {
              //   espObj.title = "小艾电竞";
              // }
              // if (espObj.code === "IMES") {
              //   espObj.title = "IM 电竞";
              //   esportOrder = 2;
              // }
              // if (!espObj.title) {
              //   espObj.title = espObj.code + "电竞";
              // }
              espObj.icon = "esport";
              espObj.subtitle = "电竞赛事";
              esport.value.push(espObj);

              if (hotEsports.value.indexOf(element.name) > -1) {
                espObj.order = esportOrder;
                hotgames.value.push(espObj);
              }
            }
            if (platTypes.indexOf("SPORT") > -1) {
              var spObj = Object.assign({}, element);
              var sportOrder = 3;
              spObj.title = getAliasName(element, "SPORT");
              // if (spObj.code === "IM") {
              //   spObj.title = "IM 体育";
              // }
              // if (spObj.code === "PM") {
              //   spObj.title = "熊猫体育";
              //   sportOrder = 4;
              // }
              // if (spObj.code === "IA") {
              //   spObj.title = "小艾体育";
              // }
              // if (spObj.code === "CR") {
              //   spObj.title = "CR 体育";
              // }
              // if (spObj.code === "SABA") {
              //   spObj.title = spObj.code + "体育";
              // }
              // if (spObj.code === "FB") {
              //   spObj.title = "FB 体育";
              // }
              spObj.icon = "sport";
              spObj.subtitle = "体育赛事";
              sport.value.push(spObj);

              if (hotSports.value.indexOf(element.name) > -1) {
                spObj.order = sportOrder;
                hotgames.value.push(spObj);
              }
            }
            if (platTypes.indexOf("LIVE") > -1) {
              const matchedPlatformInfo = LIVE_PLATFORMS.find((plat) => plat.code === element.code);
              var liveObj = Object.assign({}, matchedPlatformInfo, element);
              liveObj.title = getAliasName(element, "LIVE");
              // liveObj.title = translateRecord(liveObj.name);
              // liveObj.icon = "live";
              // liveObj.subtitle = "真人娱乐";
              livecasino.value.push(liveObj);

              if (hotLives.value.indexOf(element.name) > -1) {
                // debugger;
                liveObj.order = 6;
                // if (liveObj.code === "AG") {
                //   liveObj.title = "PA";
                // }

                hotgames.value.push(liveObj);
              }
            }
            if (platTypes.indexOf("SLOT") > -1) {
              var slotObj = Object.assign({}, element);
              // slotObj.title = translateRecord(slotObj.name, "SLOT");
              slotObj.title = getAliasName(element, "SLOT");

              slotObj.icon = "slot";
              slotObj.subtitle = "电子游戏";

              if (slotObj.name == "PG") {
                slotObj.num = 1;
              } else if (slotObj.name == "PT") {
                slotObj.num = 3;
              } else if (slotObj.name == "MGP") {
                slotObj.num = 5;
              } else if (slotObj.name == "SW") {
                slotObj.num = 2;
              } else if (slotObj.name == "BBIN") {
                slotObj.num = 4;
              } else if (slotObj.name == "AG") {
                slotObj.num = 6;
              } else if (slotObj.name == "CQ") {
                slotObj.num = 7;
              } else if (slotObj.name == "JDB") {
                slotObj.num = 8;
              } else {
                slotObj.num = 9;
              }

              let slotItem = {
                id: slotObj.id,
                code: slotObj.code,
                icon: slotObj.title
              };
              ui.slotLists.push(slotItem);
              slot.value.push(slotObj);

              if (hotSlots.value.indexOf(element.name) > -1) {
                slotObj.order = 5;
                hotgames.value.push(slotObj);
              }
            }
            if (platTypes.indexOf("FISH") > -1) {
              var fishObj = Object.assign({}, element);
              // fishObj.title = fishObj.name + " 捕鱼";
              // fishObj.title = fishObj.name;
              fishObj.title = getAliasName(element, "FISH");
              fishObj.icon = "fish";
              fishObj.subtitle = "捕鱼游戏";

              // if (fishObj.code === "AGF") {
              //   fishObj.title = "PA 捕鱼";
              // } else if (fishObj.code === "PMFISH") {
              //   fishObj.title = "DB 捕鱼";
              // }

              if (fishObj.code !== "AG") {
                fishing.value.push(fishObj);
              }
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              // pokerObj.title = translateRecord(pokerObj.name);
              pokerObj.title = getAliasName(element, "POKER");
              pokerObj.icon = "poker";
              pokerObj.subtitle = "棋牌娱乐";
              poker.value.push(pokerObj);

              if (hotPokers.value.indexOf(element.name) > -1) {
                pokerObj.order = 7;
                hotgames.value.push(pokerObj);
              }
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              // lottObj.title = translateRecord(lottObj.name);
              lottObj.title = getAliasName(element, "LOTTERY");
              lottObj.icon = "lottery";
              lottObj.subtitle = "彩票游戏";
              lottery.value.push(lottObj);

              if (hotLotterys.value.indexOf(element.name) > -1) {
                lottObj.order = 7;
                hotgames.value.push(lottObj);
              }
            }
          });

          slot.value.sort((a, b) => a.num - b.num);
          hotgames.value.sort((a, b) => a.order - b.order);

          // console.log(hotgames.value);
        })
        .catch((err) => {});
    };

    const getAliasName = (plat, platformType) => {
      // console.log(plat);
      if (plat.alias?.includes("、")) {
        const aliass = plat.alias.split("、");
        const gameTypes = plat.gameType.split(",");
        const itemIndex = gameTypes.indexOf(platformType);
        // console.log(platformType);
        // console.log(aliass);
        // console.log(aliass[itemIndex]);

        return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
      }
      return plat.alias;
    };
    const liveTabs = ref("");
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };

    const isSlotSlideEnd = computed(() => {
      if (slotSwiper.value) {
        return slotSwiper.value.isEnd;
      }
      return false;
    });
    const isSlotSlideBegin = computed(() => {
      if (slotSwiper.value) {
        return slotSwiper.value.isBeginning;
      }
      return false;
    });
    const changeSlotSlide = (type) => {
      // console.log(slotSwiper.value);
      if (type === 1) {
        slotSwiper.value?.slidePrev(500);
        slotSwiper2.value?.slidePrev(500);

        isSlotSlideEnd.value = false;
      } else if (type === 2) {
        slotSwiper.value?.slideNext(500);
        slotSwiper2.value?.slideNext(500);

        isSlotSlideBegin.value = false;
      }
    };

    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };

    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      api.get("/announcement").then((res) => {
        if (res.code === 0) {
          if (res.data.announcements) {
            const d = res.data.announcements;
            announcementList.value = d;
          }
          if (res.data.type) {
            announcementTypes.value = res.data.type;
            activeKey.value = res.data.type[0].id;
          }
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      });
    };
    const calculateMaxContentLength = () => {
      let maxLength = 0;
      for (const announcement of announcementList.value) {
        if (announcement.content.length > maxLength) {
          maxLength = announcement.content.length;
        }
      }
      return maxLength;
    };

    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const activeKey = ref(null);
    const openPopup = (noticeType) => {
      if (noticeType) {
        noticeTitle.value = "Announcement";
        isStationNotice.value = true;
        activeKey.value = announcementList.value ? announcementList.value[0].typeId : null;
      }
    };
    const gotoPromo = (banner) => {
      const openPattern = /^\/open\/(.*)/;
      if (banner.redirectUrl.match(openPattern)) {
        const extractedUrl = banner.redirectUrl.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");

        allGames.value.open(gameName, platformCode, gameCode, "OPEN");
      } else if (banner.redirectUrl == "app://deposit") {
        router.push("/finance/deposit");
      } else {
        const redirectU = "/promo?name=" + banner.redirectUrl;
        router.push(`${redirectU}`);
      }
    };

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    const getVersionNo = async () => {
      // console.log(store.hasCheckedVersion);
      // if (Platform.is.android && Platform.is.capacitor && !store.hasCheckedVersion) {
      //   const info = await App.getInfo();
      //   // const info = {
      //   //   version: "1.0.1"
      //   // };
      //   console.log("App Info");
      //   console.log(info);
      //   // alert(info.version);
      //   var current_version = parseInt(info.version.replaceAll(".", "") + info.build);
      //   console.log(current_version);
      //   // info.version && info.build
      //   const appType = "ALL";
      //   const device = Platform.is.android ? "ANDROID" : "IOS";
      //   const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
      //   // console.log(res);
      //   if (res.code === 0) {
      //     var version_info = res.data.version;
      //     var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
      //     download_url.value = res.data.url;
      //
      //     console.log(latest_ver_no);
      //     // alert(latest_ver_no);
      //     // console.log(download_url.value);
      //     if (latest_ver_no > current_version) {
      //       console.log("Need to Updat");
      //       isAppUpdateModal.value = true;
      //       store.hasCheckedVersion = true;
      //     }
      //   }
      // }
    };

    const openDownloadPage = () => {
      // console.log("open Page");
      window.open(download_url.value, "_system");
      isAppUpdateModal.value = false;
    };
    const cancelUpdate = () => {
      isAppUpdateModal.value = false;
    };

    const isiOS = () => {
      return (
        ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
          navigator.platform
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    };

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const imgURLGame = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/game/";
    const homePopupImg = ref("");
    const isImportantAnnouncementModal = ref(false);
    const homePopupContent = ref("");
    const homePopupType = ref("");
    const homePopupPath = ref("");
    const homePopupId = ref(0);
    const homePopupFrequency = ref(0);
    const homePopupFrequencyNum = ref(0);

    const checkShowImgTop = () => {
      const lastTime = sessionStorage.getItem("indexImgTop");
      if (lastTime) {
        const diff = new Date().getTime() - Number(lastTime);
        if (diff > 1000 * 60 * 60 * 12) {
          sessionStorage.removeItem("indexImgTop");
        }
      } else {
        api
          .get("/member/ads-popout")
          .then((res) => {
            // if (store.memberType === 'TEST' || store.memberType === 'PROMO_TEST')  {
            //   res = apiMockData
            // }
            if (res.code === 0) {
              // if (res.data[id] !== null) {
              if (isImpt === null) {
                switch (res.data["frequency"]) {
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
                homePopupImg.value = imgURL + "/promo/" + res.data["mobileImgUrl"];
                console.log(homePopupImg.value);
                homePopupContent.value = res.data["content"];
                homePopupType.value = res.data["type"];
                homePopupPath.value = res.data["path"];
                homePopupId.value = res.data["id"];
                homePopupFrequency.value = res.data["frequency"];
                isFirstView.value = true;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    const setExpiryBanner = () => {
      if (homePopupFrequencyNum.value !== 0) {
        setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
      }
      isImportantAnnouncementModal.value = false;
    };

    const setWithExpiry = (key, value, interval) => {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + interval,
        id: homePopupId.value,
        frequency: homePopupFrequency.value
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
    const isImpt = getWithExpiry("isImpt");

    const clickHomePopupImg = (urlString) => {
      // debugger;
      const openPattern = /^\/open\/(.*)/;
      if (urlString.match(openPattern)) {
        const extractedUrl = urlString.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");
        // /open/FB体育/FB/XXXX-123/OPEN

        allGames.value.open(gameName, platformCode, gameCode, "OPEN");
        return;
      }

      let regexUrl = new RegExp(/^(https:\/\/)/g);
      if (regexUrl.test(urlString)) {
        // 跳轉
        location.href = urlString;
        return;
      }
      let regexName = new RegExp(/^(name|\?name)/g);
      if (regexName.test(urlString)) {
        //去優惠
        router.push(`/promo${urlString}`);
        return;
      }

      router.push(`/promo?name=${urlString}`);
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      store.getAppDownloadUrl().then((url) => {
        downloadUrl.value = url;
      });
    };

    const openDownloadAppLink = () => {
      const affiliate = sessionStorage.getItem("AFFILIATE_CODE");
      const theurl = `${downloadUrl.value}?agentCode=${affiliate}`;
      window.open(theurl, "_blank");
    };

    const closeTopBox = () => {
      isH5.value = false;
      store.hasClosedDL = true;
      var btmSwiper = document.getElementById("btm-second-swiper");
      btmSwiper.classList.add("longer-swiper");
    };

    const memorableUrl = ref("dydy18.com");
    const handleCopyMemorableUrlClick = () => {
      // Create a temporary textarea element
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = memorableUrl.value;
      document.body.appendChild(tempTextarea);

      // Select the text and copy it
      tempTextarea.select();
      document.execCommand("copy");

      // Remove the temporary textarea element
      document.body.removeChild(tempTextarea);
      notify({
        type: "success",
        message: "易记网址复制成功"
      });
    };

    // const checkShowImgTop = () => {
    //   const lastTime = localStorage.getItem("indexImgTop");
    //   if (lastTime) {
    //     const diff = new Date().getTime() - Number(lastTime);
    //     if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
    //   } else {
    //     isFirstView.value = true;
    //   }
    // };
    const floatPromoRemainingTime = ref([]);
    const showFloatPromo = ref(false);
    const showDomain = ref(false);
    const floatPromo = ref([]);
    const gamePromo = ref([]);
    const domainPos = ref([18, 258]);
    const promoPos = ref([18, 128]);
    const floatDomain = ref([]);
    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const draggingDomainFab = ref(false);
    const draggingPromoFab = ref(false);
    const imgURLFloat = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

    const moveDomainFab = (ev) => {
      // console.log(ev);
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingDomainFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = domainPos.value[0] - ev.delta.x;
      let newY = domainPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      domainPos.value = [newX, newY];
    };
    const movePromoFab = (ev) => {
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingPromoFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = promoPos.value[0] - ev.delta.x;
      let newY = promoPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      promoPos.value = [newX, newY];
    };

    const hideDomain = () => {
      showDomain.value = false;
      promoPos.value = [18, 18];
    };

    const hideFloatPromo = () => {
      showFloatPromo.value = false;

      domainPos.value = [18, 18];
    };

    const checkFloatPromo = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showFloatPromo.value = true;
      // }
      if (gamePromo.length === 0) {
        promoPos.value = [18, 18];
      }
    };

    const updatePromo = () => {
      currentPromo.value = floatPromo.value[currentPromoIndex.value];
      currentPromoIndex.value = ((currentPromoIndex.value + 1) % floatPromo.value.length) + 1 - 1;
    };

    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      floatDomain.value = [];
      const apiUrl = store.hasToken() ? "/session/loggedInRedirect" : "/redirect";
      api
        .get(apiUrl)
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              if (element.type === "PROMO") {
                floatPromo.value.push(element);
                showFloatPromo.value = true;
              }
              if (element.type === "GAME") {
                gamePromo.push(element);
              }
              if (element.type === "DOMAIN") {
                floatDomain.push(element);
                showDomain.value = true;
              }
            });
            checkFloatPromo();
            updatePromo();
            updatePromoRemainingTime();
            setInterval(updatePromoRemainingTime, 1000);
          } else {
            ElMessage.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const updatePromoRemainingTime = () => {
      floatPromoRemainingTime.value = floatPromo.value.map((promo) => {
        let result = "00:00:00";

        if (promo?.showTime) {
          const now = moment(Date.now());
          const endTime = moment(promo?.endTime);
          const totalSeconds = endTime.diff(now, "seconds");
          if (totalSeconds > 0) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            result = `${`${hours}`.padStart(2, 0)}:${`${minutes}`.padStart(2, 0)}:${`${seconds}`.padStart(2, 0)}`;
          }
        }
        return result;
      });
    };

    const gotoFloatPromo = (code) => {
      router.push(`/promo?name=${code}`);
    };

    onMounted(() => {
      getPlatList();
      loadEEAILiveGameList();
      store.getUnreadTotal();
      loadAnnouncement();
      checkPlatform();
      loadData();
      // getVersionNo();
      getAppDownloadUrl();
      if (isAndroid() && !isHuaweiPhone()) {
        window.screen.orientation.lock("portrait");
      }
      // TODO: remove TEST lock
      if (store.token && store.memberType === "TEST") {
        checkShowImgTop();
      }

      setTimeout(() => {
        initFloating();
      }, 750);
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const getSwiperInstance = (index) => {
      switch (index) {
        case 0:
          return baccaratSwiper.value;
        case 1:
          return rouletteSwiper.value;
        case 2:
          return luckyLaceSwiper.value;
      }
      return null;
    };

    const getNavigationButtonStatus = (index, type) => {
      const _swiper = getSwiperInstance(index);
      if (!_swiper) return;
      if (type === "prev") {
        return _swiper.isBeginning;
      } else {
        return _swiper.isEnd;
      }
    };
    const handleSlideNextClick = (index) => {
      const _swiper = getSwiperInstance(index);
      if (!_swiper) return;
      _swiper.slideNext();
    };
    const handleSlidePrevClick = (index) => {
      const _swiper = getSwiperInstance(index);
      if (!_swiper) return;
      _swiper.slidePrev();
    };

    const platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
    const platformGamesApiKey = store.hasToken() ? "LOGGEDPLATFORMGAMES" : "PLATFORMGAMES";

    const loadEEAILiveGameList = () => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const key = `${platformApiKey}_EEAI_LIVE_GAMES_${regDevice}`;
      cached
        .get(key, () =>
          api
            .get(platformGamesApiUrl, {
              params: {
                platformId: 175,
                gameType: "LIVE",
                device: regDevice
              }
            })
            .then((res) => {
              if (res.code === 0) {
                return res;
              }
            })
            .catch((err) => {})
        )
        .then((res) => {
          res.forEach((item) => {
            if (item.code.startsWith("101")) {
              baccarat.value.push(item);
            } else if (item.code.startsWith("103")) {
              roulette.value.push(item);
            } else if (item.code.startsWith("112")) {
              luckyLace.value.push(item);
            }
          });
        });
    };

    return {
      imageLoading,
      slide: ref(0),
      tab: ref("esport"),
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(27),
      imgURL,
      banners,
      store,
      platforms,
      mainWallet,
      refreshBalance,
      isLoadingBalance,
      playGame,
      allGames,
      // casinoGame,
      gamePage,
      selectedPlatId,
      openDownloadAppLink,
      searchList,
      liveTabs,
      selectedLiveTab,
      onHomeScroll,
      scrollToTop,
      slot_evens,
      slot_odds,
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      gotoPromo,
      router,
      tabs,
      selectedTab,
      sport,
      esport,
      changeSlotSlide,
      slotSwiper,
      slotSwiper2,
      setSlotSwiper,
      setSlotSwiper2,
      isSlotSlideEnd,
      isSlotSlideBegin,
      slot,
      livecasino,
      baccarat,
      roulette,
      luckyLace,
      hotgames,
      poker,
      fishing,
      lottery,
      isH5,
      onSlideChange,
      Thumbs,
      Grid,
      thumbsSwiper,
      modules: [Scrollbar],
      Controller,
      firstSwiper,
      secondSwiper,
      setFirstSwiper,
      setSecondSwiper,
      setSelectedSwiper,
      isFirstView,
      isAppUpdateModal,
      cancelUpdate,
      openDownloadPage,
      homePopupImg,
      closeTopBox,
      getAppDownloadUrl,
      downloadUrl,
      isZeroScrollPos,
      scrollPosition,
      scrollSlotRef,
      isShowBackTop,
      isShowDownload,
      moment,
      calculateMaxContentLength,
      isImportantAnnouncementModal,
      homePopupContent,
      homePopupType,
      homePopupPath,
      homePopupId,
      homePopupFrequency,
      homePopupFrequencyNum,
      setExpiryBanner,
      setWithExpiry,
      getWithExpiry,
      isImpt,
      clickHomePopupImg,
      isStickyGameType,
      swiperContainerRef,
      memorableUrl,
      handleCopyMemorableUrlClick,
      floatPromoRemainingTime,
      showFloatPromo,
      showDomain,
      floatPromo,
      gamePromo,
      domainPos,
      promoPos,
      floatDomain,
      currentPromo,
      currentPromoIndex,
      draggingDomainFab,
      draggingPromoFab,
      domainSlide: ref(0),
      promoSlide: ref(0),
      imgURLFloat,
      hideDomain,
      hideFloatPromo,
      movePromoFab,
      moveDomainFab,
      gotoFloatPromo,
      setBaccaratSwiper,
      getNavigationButtonStatus,
      handleSlideNextClick,
      handleSlidePrevClick,
      baccaratCategoryList
    };
  }
});
</script>
<style scoped lang="scss">
.download-top-container {
  .download-top-box {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    height: 55px;
    background: #50aef330;

    .q-icon {
      font-size: 24px;
      color: #999;
    }

    .headicon {
      width: 36px;
    }

    .download-txt-container {
      flex: 4;
      font-size: 0.7rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: column;
      color: #333;

      .download-title {
        font-size: 0.8rem;
        color: #000;
        margin-bottom: 1px;
      }

      .download-content {
        max-width: 11rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .top-btn {
      background-image: linear-gradient(180deg, #52acff 0, #3559da 100%), linear-gradient(#52acff, #3559da);
      text-align: center;
      height: 32px;
      color: #fff;
      white-space: nowrap;
      letter-spacing: 0px;
      border-radius: 16px;
    }
  }
}

.sticky-header {
  position: fixed;
  top: 0px;
  z-index: 999;
  width: 100%;
  max-width: 500px;
  height: auto;
  background: #fff;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
}

.home-header-section {
  padding: 1px 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    height: 48px;
  }

  .top-logo {
    width: auto;
    height: 100%;
    max-height: 48px;
  }

  .header-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    .notification-section {
      position: relative;

      .notification-dot {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 6px;
        height: 6px;
        background: #ff0000;
        border-radius: 50%;
      }
    }

    .memorable-url {
      font-size: 0.8rem;
      font-weight: 600;
      color: #47537f;
    }
    .copy-btn {
      background: transparent;
      border: none;
      margin-right: 10px;
    }
  }

  .home-select-slide {
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    align-items: center;
    padding: 2px 5px;
    min-height: 46px;
    margin: 5px 0;

    img {
      width: auto;
    }

    span {
      color: #35648f;
      font-weight: 500;
      font-size: 12px;
    }

    &.selected {
      //background: linear-gradient(180deg, #52ACFF, #3559DA);
      background: linear-gradient(180deg, #7dd4fd 0, #4c9dec 100%);

      span {
        color: #fff;
      }

      img {
        filter: brightness(0) invert(1);
      }
    }
  }

  .firstSwiper {
    // height: 70px;
    // padding-right: 10px;
    // z-index: 999;
    background: #fff;
    justify-content: flex-start;
    align-items: stretch;
  }
}

.home-all-slider {
  &.padding-big {
    padding-top: 225px;
  }

  &.padding-normal {
    padding-top: 58px;
  }

  &.padding-second {
  }
}

.home-top-slider {
  border-radius: 8px;
  padding: 4px 10px;
}

.secondSwiper {
  //height: calc(100vh - 410px);
  padding-bottom: 10px;
  height: auto;
  //padding-top: 10px;
  //min-height: 380px;
}

.longer-swiper {
  //height: calc(100vh - 380px);
}

:deep(.secondSwiper) {
  .home-swiper-slide {
    //height: calc(45vh / 4);
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    //height: 230px;
    padding-top: 0;
    // margin-bottom: 5px;

    &.slot-slides {
      //height: 520px;

      .slot-swiper {
        margin-bottom: 10px;
      }
    }

    &.lottery-slides {
      //height: 400px;
    }

    a {
      display: block;
    }

    img {
      width: 100%;
      display: block;
    }

    &:first-child {
      // padding-top: 65px;
      // margin-top: -40px;
      // padding-top: 30px;
    }

    &-active {
      // padding-top: 30px;
    }
  }

  .home-game-boards {
    h2 {
      //margin-top: 15px;
      //margin-bottom: 15px;
      font-weight: 500;
      line-height: 18px;
      letter-spacing: 1px;
      font-size: 14px;
    }

    .game-list-div {
      display: flex;
      flex-direction: column;
      row-gap: 14px;
      justify-content: flex-start;

      .game-item-div {
        width: 100%;
        flex-wrap: nowrap;

        .game-board {
          position: relative;
          // height: 170px;

          .game-title {
            position: absolute;
            z-index: 2;
            top: 50%;
            left: 20%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #7a80a1;
            transform: translate(-50%, -50%);

            .redirect-button {
              font-size: 12px;
            }
          }

          .maintenance-box {
            position: absolute;
            top: 0;
            padding-top: 15px;
            padding-bottom: 15px;
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
            z-index: 33;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            width: 100%;
            height: 100%;
            border-radius: 3vw;
            background: rgba(2, 9, 73, 0.4);
            text-align: center;

            p {
              margin-top: 0px;
              margin-bottom: 0px;
            }

            .small-size {
              font-size: 12px;
            }
          }

          .game-bg {
            background-size: 100% 100%;
            aspect-ratio: 345/142;
            background-repeat: no-repeat;
          }

          .game-title-2 {
            line-height: 1rem;
            font-size: clamp(12px, 4vw, 24px);
            margin-top: 0px;
            font-weight: 600;
            letter-spacing: 1px;
          }

          .game-title-1 {
            margin-bottom: 7px;
            font-size: clamp(12px, 3.2vw, 24px);
            margin-bottom: 5px;
            letter-spacing: 1px;
          }

          &:hover {
            filter: brightness(1.05);
          }

          &:active {
            filter: brightness(1.15);
            transform: translate(1px, 1px);
          }
        }
      }

      .game-list-inner-div {
        margin-bottom: 14px;
        .game-list-header-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          font-weight: 600;
          color: #0e365b;

          .game-list-header__title-wrapper {
            display: flex;
            align-items: center;
            font-size: 16px;
            img {
              margin-right: 4px;
              max-width: 22px;
            }
          }

          .game-list-header__action-wrapper {
            display: flex;
            align-items: center;
            gap: 7px;

            .game-list-header__all-btn {
              padding: 1px 12px;
            }

            a {
              color: inherit;
            }

            .game-list-header__navigation-btn {
              min-width: 18px;
              min-height: 18px;
              border-radius: 50%;

              &.disabled {
                color: #c9c9c9;
              }

              .q-icon {
                font-size: 18px;
              }
            }

            .q-btn {
              background: #edf5ff;
            }
          }
        }
        .game-slide {
          .game-bg {
            background-size: 100% 100%;
            aspect-ratio: 110 / 145;
            background-repeat: no-repeat;
          }
        }
      }
    }
  }
}

:deep(.firstSwiper .swiper-wrapper) {
  background: #fff;
}

::-webkit-scrollbar-track {
  box-shadow: none;
}

.swiper-container {
  position: relative;
  background: transparent;

  .firstSwiper {
    height: 60px;
    margin-bottom: 10px;
    padding-right: 40px;
    padding-bottom: 10px;
    z-index: 999;
    text-align: center;

    .swiper-slide {
      // background: #23263c;
      background: #ffffff;
      padding: 8px 5px 2px;
      max-width: 110px;
      cursor: pointer;

      &.tbact {
        background: url("../assets/images/index/game_tab_active.png") no-repeat center center;
        background-size: cover;
        white-space: nowrap;
        padding: 8px 20px 2px;
        color: #ffffff;
      }
    }
  }
}

.modal-update-div {
  .modalcontent {
    background: #fff;
    height: 232px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px 16px;

    .headers {
      width: 100%;
      box-sizing: border-box;
      height: 37px;
      line-height: 37px;
      background: #1976d2;
      color: #fff;
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .contents {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      text-align: center;

      .contentfonts {
        text-align: center;
        color: #333;
        font-size: 16px;
        margin: 37px 0 20.5px 0;
      }

      .inputs {
        width: 292px;
        height: 36px;
        border-radius: 4px 4px;
        border: 1px solid #666;
        box-sizing: border-box;
        margin: 0 auto;
        padding-left: 20px;

        .van-field__control {
          height: 100%;
          width: 100%;
        }
      }
    }

    .btnsreas {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 23.5px;

      .cacnels {
        flex: 1;
        background: #f7fcfd;
        box-sizing: border-box;
        color: #1976d2;
        border: 1px solid #1976d2;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        letter-spacing: 1px;
        font-size: 14px;
        margin-right: 8px;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        color: #fff;
        background: #1976d2;
        letter-spacing: 1px;
        font-size: 14px;
      }
    }
  }
}

@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

.midd {
  margin: 10px auto;
  height: 30px;
  position: relative;
  overflow: hidden;

  .station-notice-wrapper {
    display: flex;
    gap: 4px;
    padding: 5px 15px;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;

    .marquee-text-wrap {
      color: #000;
    }

    .volume {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    span {
      margin-right: 10px;
      cursor: pointer;
      color: #000;
    }

    .notice {
      img {
        width: 19px;
      }
    }
  }
}

//.welcome-bar {
//  display: flex;
//  padding: 10px;
//  gap: 20px;
//  // background-color: #212534;
//  height: 35px;
//  justify-content: space-evenly;
//  align-items: center;
//  color: #000;
//  font-size: 12px;
//
//  .logo {
//    flex: 1;
//    height: 25px;
//
//    img {
//      height: 100%;
//    }
//  }
//
//
//  .login {
//    flex: 2;
//    display: flex;
//    justify-content: flex-end;
//    align-items: center;
//    gap: 12px;
//    text-decoration: none;
//    color: #000;
//
//    .user {
//      background: #ffffff;
//      padding: 0px 2px;
//      border-radius: 50%;
//    }
//  }
//}

.details-bar {
  gap: 10px;
  // background-color: #1a1c28;
  padding: 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 1;
    padding: 10px;
    border-right: 1px solid #45475f;
    color: #000;
    font-size: 16px;
  }

  .menulist {
    flex: 4;
    display: flex;
    justify-content: space-evenly;
    gap: 10px;

    .men {
      text-decoration: none;
      color: #000000;
      gap: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 30px;
      }
    }
  }
}

.index-platform-container {
  position: relative;

  :deep(.q-splitter__panel.q-splitter__before) {
    position: absolute;
    top: 0;
    position: absolute;
    top: 0;
    z-index: 99;
  }

  .q-dark {
    background: none;
  }

  .q-tab-panel {
    padding: 0px;
  }

  .q-tabs--vertical {
    margin: 0 5px 0 0;

    .q-tab {
      min-height: 40px;
      border-radius: 10px;
      margin: 0 0 5px;
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%), linear-gradient(#2d879c, #2d879c);
      border-radius: 6px;
      color: #000;
      display: flex;
      align-items: center;
      padding: 3px 0;

      &--active {
        background-image: linear-gradient(0deg, #07404b 0, #058096 100%), linear-gradient(#2d879c, #2d879c);
        color: #fff;
      }
    }

    .q-tab-panel {
      padding: 5px;
    }
  }

  :deep(.q-tab--active .q-tab__indicator) {
    display: none;
  }

  .q-tabs--horizontal {
    margin: 0 5px 0 0;

    .q-tab {
      min-height: unset;
      min-width: 60px;
      margin: 0 0 5px;
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%), linear-gradient(#2d879c, #2d879c);
      color: #000;
      display: flex;
      align-items: center;
      padding: 3px 0;

      &--active {
        background-image: unset;
        // background-image: linear-gradient(0deg,#07404b 0,#058096 100%),linear-gradient(#2d879c,#2d879c);
        border-radius: 6px;
        color: #fff;
      }
    }

    .q-tab-panel {
      padding: 5px;
    }
  }
}

.station-notice-close-btn {
  z-index: 999;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;

  &:hover {
    filter: brightness(0.9);
  }
}

.q-tab--active .q-tab__indicator {
  background: #ffffff;
  top: 0;
}

.q-tab-panel {
  .tabitems {
    display: grid;

    img {
      width: 100%;
      display: block;
    }

    &.quarter {
      grid-template-columns: repeat(4, 1fr);
      padding-top: 30px;
    }

    &.middle {
      gap: 10px;
    }

    &.five {
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;

      > div:first-child {
        grid-column-end: 3;
        grid-column-start: 1;
      }
    }
  }
}

.close-alert {
  display: block;
  position: absolute;
  top: 7px;
  right: 7px;
  width: 28px;
  padding: 2px;
  height: 28px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  color: #222a34 !important;
}

@media (max-width: 400px) {
  .grid {
    .q-card {
      .q-card__section {
        .text {
          transform: scale(1.2);
        }
      }
    }
  }
}

@media (max-width: 500px) {
  .maintenance-box {
    font-size: 4vw !important;

    .small-size {
      font-size: 2vw !important;
    }
  }
}
</style>
<style lang="scss">
.alert-image {
  width: 100%;
  margin: auto;
}

.close-alert {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: transparent;
}

.q-card__section.q-card__section--vert.q-mb-md {
  background: transparent;
  display: flex;
  justify-content: center;
}

.login.with-register {
  font-size: 16px;
  font-weight: bold;
}

.home-header-section {
  .swiper-button-next {
    background: rgba(0, 0, 0, 0.3);
    height: 60px;
    width: 20px;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0;
    > span {
      height: 30px;
      color: var(--q-primary);
      width: 18px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    &::after {
      display: none;
    }
  }
  .q-tabs--horizontal .q-tabs__arrow {
    height: unset;
  }
  .swiper-button-prev {
    background: rgba(0, 0, 0, 0.3);
    height: 60px;
    width: 20px;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;

    > span {
      height: 30px;
      color: var(--q-primary);
      width: 18px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    &::after {
      display: none;
    }
  }
}

.home-auth-section {
  background: linear-gradient(180deg, #f8fcff 0%, #dfecff 194.05%);
  padding: 16px;
  color: #7a80a1;
  margin-bottom: 16px;

  .home-auth-subsection {
    flex: 3;
    border-width: 0 1px 0 0;
    border-style: dashed;
    border-color: #a0a0a0;
  }

  .home-quick-link-section {
    flex: 6;
  }

  .home-login-section {
    flex: 3;
  }

  .cash-button {
    text-decoration: none;
    width: 36px;
    display: flex;
    flex-direction: column;

    > p {
      font-size: 14px;
      color: #313441;
      margin: 0;
    }
  }

  .welcome-liner {
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-right: 5px;
  }

  .badge-div {
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
    padding: 0 4px;
    border-radius: 3px;
    font-weight: 500;
    font-size: 13px;
    color: #ffffff;
  }

  .balance-text {
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    min-width: 50px;
  }
}

.tabs-wrapper {
  background: #ececec;
  border-radius: 6px !important;
  padding: 8px;
  color: #737373;
}

.tab-active {
  background: linear-gradient(180deg, #52acff 0%, #3559da 100%);
  color: white;
  border-radius: 6px;
}

.station-notice-dialog {
  :deep(.q-card) {
    width: 80%;
  }
  :deep(.q-tabs__content) {
    background: #ececec;
    padding: 5px 8px;
  }
}

// rocket animation
.rebates-absolute {
  display: flex;
  justify-content: center;
  align-items: center;

  .q-carousel {
    height: unset !important;
    background-color: transparent !important;
  }
}

.close-btn {
  width: 14px;
  min-width: 14px;
  height: 14px;
  min-height: 14px;
  border-radius: 50%;
  border: 1px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 6px;
  font-weight: bold;
  margin-left: 24px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 400;
}

.rocket-wrapper {
  position: relative;
  transition: all 0.3s;
  // cursor: pointer;

  img {
    width: 105px;
    pointer-events: none;
  }

  &:hover {
    filter: brightness(0.9);
  }
  .promo-remaining-time {
    position: absolute;
    bottom: 17px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    font-family: Arial;
    color: #444;
    // text-shadow: 2px 2px 0px #00000040;
    font-size: 14px;
  }
}
</style>

<template>
  <ProfileSummary :homeProfile="true" @gameClick="gameClickFromMenu" />
  <template v-if="bannerLoading">
    <q-skeleton style="height: 200px" />
  </template>
  <template v-else>
    <q-carousel
      class="home"
      id="home"
      autoplay
      navigation
      v-model="slide"
      swipeable
      transition-next="slide-left"
      transition-prev="slide-right"
      animated
      infinite
      data-aos="fade-in"
      data-aos-duration="1200"
      data-aos-once="true"
      style="padding: 15px"
    >
      <q-carousel-slide
        v-for="(banner, i) in banners"
        :key="i"
        :name="i"
        class="column no-wrap flex-center"
        :img-src="returnBannerUrl(banner)"
        @click="gotoPromo(banner)"
        style="background-color: #151d23; border-radius: 16px"
      ></q-carousel-slide>

      <template v-slot:navigation-icon="{ active, onClick }">
        <q-btn
          v-if="active"
          size="xs"
          @click="onClick"
          style="
            border-radius: 8px;
            margin: 6px 3px;
            height: 3px;
            min-height: 3px;
            width: 33px;
            padding: 0;
            background-color: #00b9a1;
          "
        />
        <q-btn
          v-else
          size="xs"
          @click="onClick"
          style="
            border-radius: 8px;
            margin: 6px 3px;
            height: 3px;
            min-height: 3px;
            width: 33px;
            padding: 0;
            background-color: rgba(255, 255, 255, 0.2);
          "
        />
      </template>
    </q-carousel>
  </template>

  <div class="home-wrapper" :class="detectAndroidVersion()">
    <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn">
      <div v-touch-pan.prevent.mouse="moveCsIcon" @click="openCSInNewTab(ui.CSAUrl)">
        <div class="cs-icon-wrapper"></div>
      </div>
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="hbDragPos" class="floating-btn" v-if="isHbShow">
      <div>
        <!-- <div class="hb-close">
          <q-btn dense rounded icon="close" class="bg-grey text-black" size="sm" @click="isHbShow = false" />
        </div> -->
        <div>
          <q-carousel
            class="hb-float"
            :navigation="hbPromo.length > 1 ? true : false"
            v-model="hbSlide"
            swipeable
            transition-next="slide-left"
            transition-prev="slide-right"
            animated
            infinite
            :autoplay="3000"
          >
            <q-carousel-slide
              v-for="(promo, i) in hbPromo"
              :key="i"
              :name="i"
              @click="gotoFloatPromo(promo)"
              style="padding: 0"
            >
              <template v-if="promo.code === 'spin-lucky-wheel' && isShowSticky">
                <SpinLuckyWheelPromoSticky style="width: 100%" />
              </template>
              <template v-else-if="promo.code === 'spin-lucky-wheel' && !isShowSticky">
                <img :src="promo.icon" />
              </template>
              <template v-else>
                <img :src="promo.icon" />
              </template>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </q-page-sticky>

    <PushNotification
      :pushNotificationData="pushNotificationData"
      v-if="Platform.is.android && Platform.is.capacitor"
    />

    <div class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <img style="width: 24px; height: 24px" src="../assets/images/index/volume-up-line.svg" />
        </div>
        <div class="marquee-container">
          <marquee-text :repeat="2" :duration="10">
            <div v-if="announcementList">
              <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                {{ a.title }}
              </span>
            </div>
          </marquee-text>
        </div>
      </div>
    </div>

    <div class="jackpot-banner">
      <div class="jackpot-digit-grp">
        <span
          v-for="(char, index) in convertToCommaAmount(ui.jackpotAmt, false)"
          :class="{ 'jackpot-symbol': char === ',', 'jackpot-digit': char !== ',' }"
          :key="index"
        >
          <span>{{ char }}</span>
        </span>
      </div>
    </div>

    <swiper
      :slidesPerGroup="1"
      :modules="[Navigation, Grid]"
      class="hometop-categories"
      @swiper="onSwiper"
      :breakpoints="{
        0: {
          slidesPerView: 3.5,
          spaceBetween: 4
        },
        330: {
          slidesPerView: 3.8,
          spaceBetween: 4
        },
        365: {
          slidesPerView: 4.2,
          spaceBetween: 4
        },
        390: {
          slidesPerView: 4.5,
          spaceBetween: 4
        },
        480: {
          slidesPerView: 5.5,
          spaceBetween: 10
        }
      }"
    >
      <template v-for="(item, index) in categoriesList" :key="index">
        <swiper-slide>
          <div class="cat-selection-item" :class="item.active && 'active'" @click="activateSlide(item)">
            <div class="cat-icon" v-if="item.title !== 'slot'">
              <img :src="require(`../assets/images/index/category/cat-${item.icon.toLowerCase()}.png`)" alt="" />
            </div>
            <div class="cat-icon" v-else>
              <img :src="getSlotImage(item.code)" alt="" />
            </div>
            <div class="cat-title">{{ translateTitle(item.icon) }}</div>
          </div>
        </swiper-slide>
      </template>
    </swiper>

    <template v-for="category in categoriesList" :key="category.title">
      <template
        v-if="
          ((category.title === 'Hot' || category.title === 'Popular') && category.active) ||
          (category.title === 'Lobby' && category.active)
        "
      >
        <div class="games-selection-wrapper" id="hotgames">
          <div class="title-game revamp">
            <div><img src="../assets/images/index/hot-icon.png" width="22" /></div>
            <span class="txt-style">{{ $t("home.cat_hotgames") }}</span>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div :class="`custom-hot-prev`"><img src="../assets/images/index/rgtarrow.svg" /></div>
              <div :class="`custom-hot-next`"><img src="../assets/images/index/rgtarrow.svg" /></div>
            </div>
          </div>
          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="4"
              :slidesPerGroup="3"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 2, fill: 'row' }"
              :navigation="{ nextEl: '.custom-hot-next', prevEl: '.custom-hot-prev' }"
              class="platform-game-container revamp two-row"
            >
              <!-- Add Evolution in Hot Game -->
              <template v-for="(item, index) in hotGameList" :key="index">
                <template v-if="item.type && item.type === 'game'">
                  <swiper-slide
                    class="platform-game-item btn-effect"
                    @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"
                  >
                    <div>
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/games/hot-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png`)})`;
                              } catch (e) {
                                try {
                                  return `url(${imgURLGame}${item.icon})`;
                                } catch (e) {
                                  return `url(${
                                    store.h5Url
                                  }static/images/index/hot/item-game-${item.name.toLowerCase()}.png)`;
                                }
                              }
                            })()
                          }"
                        ></div>
                      </div>

                      <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                    </div>
                  </swiper-slide>
                </template>
                <template v-else>
                  <swiper-slide
                    class="platform-game-item btn-effect"
                    @click="playGame(item.name, item.code, '', 'OPEN', 'LIVE')"
                  >
                    <div>
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/games/hot-games-${item.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return `url(${
                                  store.h5Url
                                }static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                              }
                            })()
                          }"
                        ></div>
                      </div>

                      <div class="platform-game-title">
                        {{ truncateText(item.alias ? item.alias : item.name, 22) }}
                      </div>
                    </div>
                  </swiper-slide>
                </template>
              </template>
            </swiper>
          </div>

          <div class="platform-game-wrapper" v-else>
            <div class="platform-game-container grid-view-col-4 revamp">
              <template v-for="(item, index) in hotGameList" :key="index">
                <template v-if="index < showValue">
                  <template v-if="item.type && item.type === 'game' && index < showValue">
                    <div
                      class="platform-game-item btn-effect"
                      @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"
                    >
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/games/hot-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png`)})`;
                              } catch (e) {
                                try {
                                  return `url(${imgURLGame}${item.icon})`;
                                } catch (e) {
                                  return `url(${
                                    store.h5Url
                                  }static/images/index/hot/item-game-${item.name.toLowerCase()}.png)`;
                                }
                              }
                            })()
                          }"
                        ></div>
                      </div>
                      <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                    </div>
                  </template>

                  <template v-else>
                    <div
                      class="platform-game-item btn-effect"
                      @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
                    >
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/games/hot-games-${item.name.toLowerCase()}.png`)})`;
                              } catch (e) {
                                return `url(${
                                  store.h5Url
                                }static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                              }
                            })()
                          }"
                        ></div>
                      </div>
                      <div class="platform-game-title">
                        {{ truncateText(item.alias ? item.alias : item.name, 22) }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>
              <q-btn
                v-if="hotGameList.length > 12"
                class="show-all-btn"
                :class="{ expanded: isShowAllFullGames }"
                flat
                no-caps
                @click="scrollDownFullGames"
              >
                {{ $t("home.showAll") }}
                <q-icon name="chevron_right" size="xs" />
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'slot' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="slotsgames">
          <div class="title-game revamp">
            <div><img src="../assets/images/index/title-icon-slot.png" width="22" /></div>
            <span class="txt-style">{{ category.icon }}</span>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div :class="`custom-slot-prev`"><img src="../assets/images/index/rgtarrow.svg" /></div>
              <div :class="`custom-slot-next`"><img src="../assets/images/index/rgtarrow.svg" /></div>
            </div>
          </div>
          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="4"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 1, fill: 'row' }"
              :navigation="{ nextEl: '.custom-slot-next', prevEl: '.custom-slot-prev' }"
              class="platform-game-container revamp"
            >
              <template v-for="(item, index) in slot" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="openGame(item.name, item.code, '', item.status, 'SLOT', item.id)"
                >
                  <div>
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/slot/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              return `url(${
                                store.h5Url
                              }static/images/index/slot/item-game-${item.code.toLowerCase()}.png)`;
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div v-if="item.name === 'JOKER' || item.name === 'PG'" class="burning-hot">
                      <img src="../assets/images/index/hot.png" />
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.alias ? item.alias : item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>
            </swiper>
          </div>

          <div class="platform-game-wrapper" v-else>
            <template v-if="isPlatLoading">
              <div class="skeleton-grid">
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
                <q-skeleton class="slot-skeleton" />
              </div>
            </template>

            <div class="platform-game-container grid-view revamp">
              <template v-if="isGameLoading">
                <div class="loader-container">
                  <div>
                    <q-spinner color="green-14" size="10em" :thickness="10" />
                  </div>
                  <div>{{ $t("btn.loading_plsWait") }}</div>
                </div>
              </template>
              <template v-else>
                <!--                <pre>{{filteredSubGameList}}</pre>-->
                <template v-for="(item, index) in filteredSubGameList" :key="index">
                  <template v-if="index < showValue">
                    <div
                      class="game-platform-item"
                      @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"
                      data-aos="zoom-in"
                      data-aos-duration="1200"
                      data-aos-once="true"
                      data-aos-anchor="#fullgame"
                    >
                      <div class="game-platform-img" :class="'game-' + item.gameType.toLowerCase()">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: `url(${imgURLGame}${item.icon})`
                          }"
                        ></div>
                      </div>
                      <div class="game-platform-title">{{ truncateText(item.name, 18) }}</div>

                      <div
                        class="game-platform-label game-platform-label--hot"
                        v-if="
                          (item.gameLabel && item.gameLabel.includes('LIST')) ||
                          (item.gameLabel && item.gameLabel.includes('HOT'))
                        "
                      >
                        <img src="../assets/images/index/platform-label-hot.png" alt="" />
                      </div>
                      <div
                        class="game-platform-label game-platform-label--new"
                        v-if="item.gameLabel && item.gameLabel.includes('NEW')"
                      >
                        <img src="../assets/images/index/platform-label-new.png" alt="" />
                      </div>
                    </div>
                  </template>
                </template>
              </template>

              <!--              <template v-for="(item, index) in slot" :key="index">-->
              <!--                <div-->
              <!--                  class="platform-game-item btn-effect"-->
              <!--                  @click="openGame(item.name, item.code, '', item.status, 'SLOT', item.id)"-->
              <!--                >-->
              <!--                  <div class="platform-game-img">-->
              <!--                    <div-->
              <!--                      class="game&#45;&#45;bg"-->
              <!--                      :style="{-->
              <!--                        backgroundImage: (() => {-->
              <!--                          try {-->
              <!--                            return `url(${require(`../assets/images/index/slot/item-game-${item.code.toLowerCase()}.png`)})`;-->
              <!--                          } catch (e) {-->
              <!--                            return `url(${-->
              <!--                              store.h5Url-->
              <!--                            }static/images/index/slot/item-game-${item.code.toLowerCase()}.png)`;-->
              <!--                          }-->
              <!--                        })()-->
              <!--                      }"-->
              <!--                    ></div>-->
              <!--                  </div>-->

              <!--                  <div v-if="item.name === 'JOKER' || item.name === 'PG'" class="burning-hot">-->
              <!--                    <img src="../assets/images/index/hot.png" />-->
              <!--                  </div>-->

              <!--                  <div class="platform-game-title">{{ truncateText(item.alias ? item.alias : item.name, 22) }}</div>-->
              <!--                </div>-->
              <!--              </template>-->
              <q-btn
                v-if="filteredSubGameList.length > 12"
                class="show-all-btn"
                :class="{ expanded: isShowAllFullGames }"
                flat
                no-caps
                @click="scrollDownFullGames"
              >
                {{ $t("home.showAll") }}
                <q-icon name="chevron_right" size="xs" />
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Casino' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="live">
          <div class="title-game revamp">
            <div><img src="../assets/images/index/title-icon-live.png" width="22" /></div>
            <span class="txt-style">{{ $t("home.cat_livecasino") }}</span>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div :class="`custom-live-prev`"><img src="../assets/images/index/rgtarrow.svg" /></div>
              <div :class="`custom-live-next`"><img src="../assets/images/index/rgtarrow.svg" /></div>
            </div>
          </div>
          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="2"
              :spaceBetween="15"
              :modules="[Navigation]"
              :navigation="{ nextEl: '.custom-live-next', prevEl: '.custom-live-prev' }"
              class="platform-game-container live-casino revamp"
            >
              <template v-for="(item, index) in livecasino" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
                >
                  <div>
                    <img src="../assets/images/index/live/item-game-maintenance.png" />
                    <div
                      class="platform-live-item--img"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/index/live/item-game-${item.name.toLowerCase()}.png`)})`;
                          } catch (e) {
                            return `url(${
                              store.h5Url
                            }static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                          }
                        })()
                      }"
                    >
                      <div
                        v-if="
                          item.name === 'Evo' || item.name === 'WCEvo' || item.name === 'PT' || item.name === 'WCPT'
                        "
                        class="burning-hot"
                      >
                        <img src="../assets/images/index/hot.png" />
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </template>
            </swiper>
          </div>

          <div class="platform-game-wrapper" v-else>
            <template v-if="isPlatLoading">
              <div class="skeleton-downs">
                <q-skeleton class="casino-skeleton" />
                <q-skeleton class="casino-skeleton" />
              </div>
            </template>

            <div class="platform-game-container revamp">
              <template v-for="(item, index) in livecasino" :key="index">
                <div
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
                >
                  <div>
                    <img src="../assets/images/index/live/item-game-maintenance.png" />
                    <div
                      class="platform-live-item--img"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/index/live/item-game-${item.name.toLowerCase()}.png`)})`;
                          } catch (e) {
                            return `url(${
                              store.h5Url
                            }static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                          }
                        })()
                      }"
                    >
                      <div
                        v-if="
                          item.name === 'Evo' || item.name === 'WCEvo' || item.name === 'PT' || item.name === 'WCPT'
                        "
                        class="burning-hot"
                      >
                        <img src="../assets/images/index/hot.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Fishing' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="fishing" v-if="category.title === 'Lobby' && category.active">
          <div class="title-game revamp">
            <div><img src="../assets/images/index/title-icon-fish.png" width="34" /></div>
            <span class="txt-style">{{ $t("home.cat_fishing") }}</span>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div :class="`custom-fish-prev`"><img src="../assets/images/index/rgtarrow.svg" /></div>
              <div :class="`custom-fish-next`"><img src="../assets/images/index/rgtarrow.svg" /></div>
            </div>
          </div>
          <div class="platform-game-wrapper">
            <swiper
              :slidesPerView="4"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 1, fill: 'row' }"
              :navigation="{ nextEl: '.custom-fish-next', prevEl: '.custom-fish-prev' }"
              class="platform-game-container revamp"
            >
              <template v-for="(item, index) in fishGameTADAList" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'TaDa', item.code, item.status, item.gameType, item.id)"
                >
                  <div>
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/games/fish/tada-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(${
                                  store.h5Url
                                }static/images/index/fish/item-game-${item.name.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>

              <template v-for="(item, index) in fishGameJILIList" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JILI', item.code, item.status, item.gameType, item.id)"
                >
                  <div>
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/games/fish/jili-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(${
                                  store.h5Url
                                }static/images/index/fish/item-game-${item.name.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>

              <template v-for="(item, index) in fishGameJDBList" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JDB', item.code, item.status, item.gameType, item.id)"
                >
                  <div>
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/games/fish/jdb-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(${
                                  store.h5Url
                                }static/images/index/fish/item-game-${item.name.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>
            </swiper>
          </div>
        </div>

        <div class="games-selection-wrapper" v-else>
          <div class="title-game revamp">
            <div><img src="../assets/images/index/title-icon-fish.png" width="34" /></div>
            <span class="txt-style">{{ $t("home.cat_fishing") }}</span>
          </div>
          <div class="platform-game-container grid-view revamp">
            <template v-for="(item, index) in fishGameList" :key="index">
              <template v-if="index < showValue">
                <div
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"
                >
                  <div class="platform-game-img">
                    <div
                      class="game--bg"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/games/fish/${
                              item._iconPrefix
                            }-${item.code.toLowerCase()}.png`)})`;
                          } catch (e) {
                            try {
                              return `url(${imgURLGame}${item.icon})`;
                            } catch (e) {
                              return `url(${
                                store.h5Url
                              }static/images/index/fish/item-game-${item.name.toLowerCase()}.png)`;
                            }
                          }
                        })()
                      }"
                    ></div>
                  </div>
                  <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                </div>
              </template>
            </template>
            <q-btn
              v-if="fishGameList.length > 12"
              class="show-all-btn"
              :class="{ expanded: isShowAllFullGames }"
              flat
              no-caps
              @click="scrollDownFullGames"
            >
              {{ $t("home.showAll") }}
              <q-icon name="chevron_right" size="xs" />
            </q-btn>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Sport' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="sport">
          <div class="title-game revamp">
            <div><img src="../assets/images/index/title-icon-sport.png" width="22" /></div>
            <span class="txt-style">{{ $t("home.cat_sport") }}</span>
          </div>
          <div class="platform-game-container sport-platform revamp">
            <template v-if="isPlatLoading">
              <div class="skeleton-grid">
                <q-skeleton class="sport-skeleton" />
                <q-skeleton class="sport-skeleton" />
                <q-skeleton class="sport-skeleton" />
              </div>
            </template>
            <template v-for="(item, index) in sport" :key="index">
              <div
                class="platform-game-item btn-effect"
                @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
              >
                <img src="../assets/images/index/sport/item-game-maintenance.png" />
                <div
                  class="platform-game-item--img"
                  :style="{
                    backgroundImage: (() => {
                      try {
                        return `url(${require(`../assets/images/index/sport/item-game-${item.name.toLowerCase()}.png`)})`;
                      } catch (e) {
                        return `url(${store.h5Url}static/images/index/sport/item-game-${item.code.toLowerCase()}.png)`;
                      }
                    })()
                  }"
                ></div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>

  <section class="app-download-section">
    <div class="app-board">
      <div class="character">
        <img src="../assets/images/index/download-app-left.png" alt="Mascot" />
      </div>
      <div class="app-info" style="display: none">
        <h3>
          <img src="../assets/images/index/tick-icon.png" />
          DOWNLOAD THE APP
        </h3>
        <p>
          Download And Install The Application
          <br />
          On Your Desktop For A Smoother
          <br />
          Gaming Experience.
        </p>

        <div class="download-buttons">
          <button class="android">
            <img src="../assets/images/index/android-icon.png" />
            <span>Android</span>
          </button>
        </div>
      </div>
    </div>

    <div class="logos">
      <div class="providers">
        <img src="../assets/images/index/logo-lists.png" />
      </div>

      <div class="payment-icons">
        <img src="../assets/images/index/payment-lists.png" />
      </div>
    </div>

    <footer class="footer">©{{ currentYear }} AKB188.COM Todos os direitos reservados</footer>
  </section>

  <GameModal
    v-if="route.path !== '/account/profile'"
    ref="allGames"
    :closeFullGameDialog="closeFullGameDialog"
  ></GameModal>

  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isAppUpdateModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
    :persistent="isOutdatedApp"
  >
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div class="titles backgroundColor">{{ $t("appUpdate.updateHeader") }}</div>
        </div>
        <div class="contents">
          <template v-if="isOutdatedApp">
            {{ $t("appUpdate.isOutdatedAppContent_01") }}
            <br />
            {{ $t("appUpdate.isOutdatedAppContent_02") }}
          </template>
          <template v-else>{{ $t("appUpdate.newAppVersionContent_01") }}</template>
        </div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate" v-if="!isOutdatedApp">
            {{ $t("appUpdate.cancel") }}
          </div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">{{ $t("appUpdate.updateNow") }}</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" class="announcement-dialog" v-model="isStationNotice">
    <div class="popout-dialog" style="padding-top: 16px">
      <q-btn dense rounded icon="close" class="bg-white text-black announcement-close" v-close-popup />
      <q-card style="width: calc(100% - 0px); margin: auto; padding-left: 10px" class="announcement-card">
        <q-card-section class="q-mb-md">
          <q-tabs v-model="activeKey" dense class="text-white" align="justify">
            <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
              <q-list style="min-height: auto">
                <div v-for="(ann, idx) in announcementList" :key="idx">
                  <span v-if="ann.typeId === tab.id">
                    <q-expansion-item
                      style="max-height: 65vh; overflow: auto"
                      group="somegroup"
                      icon="volume_up"
                      :label="ann.title"
                    >
                      <q-card>
                        <q-card-section>
                          <!-- {{ ann.content }} -->
                          <span v-html="ann.content" />
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
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isImportantAnnoucementModal">
    <q-card style="width: 90%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <div class="promo-banner-container">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="fullGameDialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="fullgame-dialog"
  >
    <q-card class="fullgame-card" id="fullgame">
      <ProfileSummary @closeslot="closeSlotModal" :homeProfile="true" />
      <q-card-section>
        <div class="home-wrapper fullgame-wrapper">
          <div class="fullgame-header">
            <div class="q-mt-sm q-mb-md">
              <q-btn dense rounded icon="chevron_left" class="back-btn text-white" size="16px" v-close-popup />
            </div>
            <div>
              <div class="game-logo-img">
                <div
                  class="game-logo"
                  :style="{
                    backgroundImage: (() => {
                      try {
                        return `url(${require(`../assets/images/index/logo/logo-${subGameCode.toLowerCase()}.png`)})`;
                      } catch (e) {
                        return '';
                      }
                    })()
                  }"
                >
                  &nbsp;
                </div>
              </div>
            </div>

            <div class="fullgame-search">
              <q-input standout v-model="searchText" :label="$t('btn.search')" clearable clear-icon="close">
                <template v-slot:prepend>
                  <q-icon name="search" size="20px" />
                </template>
              </q-input>
            </div>
          </div>

          <template v-if="isGameLoading">
            <div class="loader-container">
              <div>
                <q-spinner color="yellow" size="10em" :thickness="10" />
              </div>
              <div>{{ $t("btn.loading_plsWait") }}</div>
            </div>
          </template>

          <template v-else>
            <div class="games-selection-wrapper">
              <div class="game-platform-wrapper">
                <template v-if="hotGameOn">
                  <template v-for="(item, index) in filteredHotGameList" :key="index">
                    <template v-if="index < showValue">
                      <div
                        class="game-platform-item"
                        @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"
                        data-aos="zoom-in"
                        data-aos-duration="1200"
                        data-aos-once="true"
                        data-aos-anchor="#fullgame"
                      >
                        <div class="game-platform-img">
                          <div
                            class="game--bg"
                            :style="{
                              backgroundImage: `url(${imgURLGame}${item.icon})`
                            }"
                          ></div>
                        </div>
                        <div class="game-platform-title">{{ truncateText(item.name, 18) }}</div>

                        <div
                          class="game-platform-label game-platform-label--hot"
                          v-if="item.gameLabel && item.gameLabel.includes('HOT')"
                        >
                          <img src="../assets/images/index/platform-label-hot.png" alt="" />
                        </div>
                        <div
                          class="game-platform-label game-platform-label--new"
                          v-if="item.gameLabel && item.gameLabel.includes('NEW')"
                        >
                          <img src="../assets/images/index/platform-label-new.png" alt="" />
                        </div>
                      </div>
                    </template>
                  </template>
                </template>

                <template v-else>
                  <template v-for="(item, index) in filteredSubGameList" :key="index">
                    <template v-if="index < showValue">
                      <div
                        class="game-platform-item"
                        @click="playGame(item.name, subGameCode, item.code, item.status, item.gameType, item.id)"
                        data-aos="zoom-in"
                        data-aos-duration="1200"
                        data-aos-once="true"
                        data-aos-anchor="#fullgame"
                      >
                        <div class="game-platform-img" :class="'game-' + item.gameType.toLowerCase()">
                          <div
                            class="game--bg"
                            :style="{
                              backgroundImage: `url(${imgURLGame}${item.icon})`
                            }"
                          ></div>
                        </div>
                        <div class="game-platform-title">{{ truncateText(item.name, 18) }}</div>

                        <div
                          class="game-platform-label game-platform-label--hot"
                          v-if="
                            (item.gameLabel && item.gameLabel.includes('LIST')) ||
                            (item.gameLabel && item.gameLabel.includes('HOT'))
                          "
                        >
                          <img src="../assets/images/index/platform-label-hot.png" alt="" />
                        </div>
                        <div
                          class="game-platform-label game-platform-label--new"
                          v-if="item.gameLabel && item.gameLabel.includes('NEW')"
                        >
                          <img src="../assets/images/index/platform-label-new.png" alt="" />
                        </div>
                      </div>
                    </template>
                  </template>
                </template>
              </div>

              <q-btn class="btn-more-games btn-effect" @click="scrollDownFullGames" v-if="!isShowAllFullGames">
                More Games
              </q-btn>
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="withdrawalDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container popout-dialog-container--yel">
        <div class="popout-main-title">
          <div class="txt-title">Withdrawal</div>
        </div>
        <WithdrawalComponent @close-withdraw="closeWithDrawModal"></WithdrawalComponent>
      </div>
    </div>
  </q-dialog> -->
  <WithdrawalModal ref="withdrawalModalRef"></WithdrawalModal>

  <!-- <q-dialog width="100%" v-model="depositDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" @click="closeDepositDialog" />
      <div class="popout-dialog-container popout-dialog-container--yel">
        <div class="popout-main-title">
          <div class="txt-title">Deposit</div>
        </div>
        <DepositComponent />
      </div>
    </div>
  </q-dialog> -->

  <q-dialog width="100%" v-model="guestKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>

  <!-- Spin Lucky Wheel promo start -->
  <q-dialog
    v-if="popupPromo === 'spin-lucky-wheel' && isShownSpinLuckyWheel"
    full-width
    :model-value="isShownSpinLuckyWheel"
    class="isCentreDialog spin-lucky-wheel-dialog"
    persistent
  >
    <!-- <q-btn class="money-rain-close" icon="close" round dense @click="closeDialog" /> -->
    <SpinLuckyWheelPromoHomePopup @close-dialog="closeDialog" ref="spinLuckyWheelPromoHomePopupRef">
      <!-- <template #controller>
        <PopupController v-model="popupPromo" :hasSpin="true" />
      </template> -->
    </SpinLuckyWheelPromoHomePopup>
  </q-dialog>
  <!-- Spin Lucky Wheel promo end -->

  <q-dialog class="isCentreDialog" v-if="popupPromo === 'money-rain'" :model-value="true">
    <MoneyRainModal @closeModal="closeDialog">
      <template #controller>
        <PopupController v-model="popupPromo" :hasWheel="hasInviteWheelPromo" :hasSpin="isShownSpinLuckyWheel" />
      </template>
    </MoneyRainModal>
    <q-btn class="money-rain-close" icon="close" round dense @click="closeDialog" />
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch, onActivated, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, eventapi } from "boot/axios";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
import { App } from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";
import PushNotification from "../components/modal/PushNotification.vue";
import { useUI } from "stores/ui";
import { usePromoStore } from "stores/promo";
import ProfileSummary from "../components/ProfileSummary.vue";
import WithdrawalModal from "../components/modal/WithdrawalModal.vue";
import KYCGuestForm from "../components/KYCGuestForm.vue";
import KYCUserForm from "../components/KYCUserForm.vue";
import SpinLuckyWheelPromoHomePopup from "src/components/hotpromo/spin-lucky-wheel/HomePopup.vue";
import SpinLuckyWheelPromoSticky from "src/components/hotpromo/spin-lucky-wheel/PromoSticky.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { t } from "../boot/lang";
// Import Swiper modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Grid } from "swiper/core";
import { convertToCommaAmount, isAndroid } from "src/boot/utils";
import { storeToRefs } from "pinia";

import PopupController from "src/components/PopupController.vue";
import MoneyRainModal from "../components/modal/MoneyRainModal.vue";

// import SwiperCore, { Scrollbar, Navigation, Pagination, EffectCoverflow } from "swiper";
// Use ref to hold the modules
const modules = ref([Grid, Scrollbar, Navigation, Pagination]);
const gameModules = ref([Scrollbar, Navigation, Pagination]);

const categoriesList = ref([]);

const isSlotLoading = ref(false);
const activateSlide = (clickedItem) => {
  categoriesList.value.forEach((item) => {
    item.active = item === clickedItem;
  });

  console.log(clickedItem);
  console.log(categoriesList.value);

  isSlotLoading.value = true;
  isGameLoading.value = true;
  isShowAllFullGames.value = false;

  // debugger;

  if (clickedItem.title === "slot") {
    loadGameList("SLOT", clickedItem.id);
  }
};

const gameClickFromMenu = (gameCode) => {
  let catSelected = null;
  let index = 0;
  if (!gameCode) {
    catSelected = categoriesList.value.find((cat) => cat.title === "Hot");
  } else {
    index = categoriesList.value.findIndex((cat) => cat.code === gameCode);
    catSelected = categoriesList.value[index];
  }
  console.log("hit 1", catSelected);
  activateSlide(catSelected);
  slideToIndex(index);
};

const swiperInstance = ref(null);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const slideToIndex = (index) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index);
  }
};

const getSlotImage = (code) => {
  try {
    return require(`../assets/images/index/homeslot/${code.toLowerCase()}-slot.png`);
  } catch (e) {
    return require(`../assets/images/index/game-icon.png`);
  }
};

const csDragPos = ref([10, 0]);
const isDraggingCsIcon = ref(false);

const slide = ref(0);

const isFirstView = ref(false);

const promoStore = usePromoStore();
const { isShownSpinLuckyWheel, isShowSticky } = storeToRefs(promoStore);

const closeAlert = () => {
  // Create a new date object in GMT+5.5
  const currentTimeInGMT55 = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  localStorage.setItem("indexImgTop", currentTimeInGMT55.getTime());
  isFirstView.value = false;
};

const fullGameDialog = ref(false);
const searchText = ref("");

const withdrawalModalRef = ref();
const onWithdrawalClick = () => {
  // withdrawalDialog.value = true;
  if (!store.realName && !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName && store.guest) {
    guestKYCDialog.value = true;
  } else {
    withdrawalModalRef.value.open();
  }
};

const userKYCDialog = ref(false);
const guestKYCDialog = ref(false);
const depositDialog = ref(false);
const openDepositDialog = () => {
  if (!store.realName && !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName && store.guest) {
    guestKYCDialog.value = true;
  } else {
    depositDialog.value = true;
  }
};

const closeGuestKYCDialog = () => {
  guestKYCDialog.value = false;
  store.getMemberInfo();
  loadData();
};
const closeUserKYCDialog = () => {
  userKYCDialog.value = false;
  store.getMemberInfo();
  loadData();
};

const depositItems = reactive([
  { amount: 100, hotLabel: 5, isActive: false },
  { amount: 300, hotLabel: 15, isActive: false },
  { amount: 500, hotLabel: 25, isActive: false },
  { amount: 1000, hotLabel: 50, isActive: false },
  { amount: 3000, hotLabel: 150, isActive: false },
  { amount: 5000, hotLabel: 250, isActive: false },
  { amount: 10000, hotLabel: 500, isActive: false },
  { amount: 30000, hotLabel: 1500, isActive: false },
  { amount: 50000, hotLabel: 2500, isActive: false }
]);

const esport = ref([]);
const sport = ref([]);
const livecasino = ref([
  {
    id: 22,
    name: "PP",
    code: "PP",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,LIVE",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 4
  },
  {
    id: 102,
    name: "WCSW",
    code: "WCSW",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 4,
    name: "Awc",
    code: "AWC",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 5,
    name: "Ezugi",
    code: "EZUGI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 123,
    name: "Evo",
    code: "WCEvo",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 101,
    name: "WCMG",
    code: "WCMG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  }
]);
const poker = ref([]);
const lottery = ref([]);
const slot = ref([
  {
    id: 21,
    name: "PG",
    code: "PG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1
  },
  {
    id: 152,
    name: "TaDa",
    code: "TaDa",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 3
  },
  {
    id: 22,
    name: "PP",
    code: "PP",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,LIVE",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 4
  },
  {
    id: 31,
    name: "JDB",
    code: "JDB",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 5
  },
  {
    id: 36,
    name: "FC",
    code: "FC",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 6
  },
  {
    id: 142,
    name: "FiveG",
    code: "FiveG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "5G",
    sequence: 99
  },
  {
    id: 33,
    name: "CQ9",
    code: "CQ9",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 151,
    name: "TurboGames",
    code: "TurboGames",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 51,
    name: "JOKER",
    code: "JOKER",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 147,
    name: "Aviatrix",
    code: "Aviatrix",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 93,
    name: "Spribe",
    code: "Spribe",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 116,
    name: "Habanero",
    code: "WCHB",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 146,
    name: "Booming Games",
    code: "WCBMG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 121,
    name: "Spinix",
    code: "WCSpinix",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 111,
    name: "Relax",
    code: "WCRelax",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 106,
    name: "No limit city",
    code: "WCNLC",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 107,
    name: "Big time Gaming",
    code: "WCBTG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 108,
    name: "Wazdan",
    code: "WCWazdan",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 110,
    name: "Skywind",
    code: "WCSWS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 104,
    name: "Netent",
    code: "WCNetent",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 105,
    name: "Red tiger",
    code: "WCRT",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 109,
    name: "One touch",
    code: "WCOTS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 118,
    name: "MG",
    code: "WCMGS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 120,
    name: "World Match",
    code: "WCWM",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  },
  {
    id: 113,
    name: "PNG",
    code: "WCPNG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 99
  }
]);
const fishing = ref([]);
const casuals = ref([]);

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
    setTimeout(() => {
      getVersionNo();
    }, 1000);
  } else {
    isH5.value = true;
    setTimeout(() => {
      getAppData();
    }, 0);
  }
};

// ui.$onAction(({ name, args }) => {
//   switch (name) {
//     case "setScrollPosition":
//       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
//   }
// });
const qs = require("qs");
const $q = useQuasar();
const banners = ref([
  {
    mobileImageUrl: "empty-banner.png"
  }
]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const allGames = ref(null);
const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
  // debugger;
  allGames.value.open(gameName, platformCode, gameCode, gameType);
};

const isGameLoading = ref(true);
const isPlatLoading = ref(false);
const isHotGameLoading = ref(false);
const openGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
  isShowAllFullGames.value = false;
  isGameLoading.value = true;
  subGameCode.value = platformCode;
  loadGameList(gameType, gameId);
  fullGameDialog.value = true;
  hotGameOn.value = false;
};

const closeSlotModal = () => {
  fullGameDialog.value = false;
};

const closeFullGameDialog = () => {
  fullGameDialog.value = false;

  if (store.guest && !store.realName) {
    guestKYCDialog.value = true;
  } else if (!store.guest && !store.realName) {
    userKYCDialog.value = true;
  }
};

const hotGameOn = ref(false);
const subGameList = ref([]);
const filteredSubGameList = computed(() => {
  if (searchText.value) {
    return subGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  } else {
    return subGameList.value;
  }
});

const subGameCode = ref("");

const openHotGame = (hotGameList) => {
  subGameList.value = hotGameList;
  fullGameDialog.value = true;
  hotGameOn.value = true;
};

const hotGameList = ref([
  {
    id: 163,
    name: "Fortune Gems",
    code: "109",
    status: "OPEN",
    icon: "18/TaDa/109.png",
    sequence: 1,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 164,
    name: "Fortune Tiger",
    code: "126",
    status: "OPEN",
    icon: "13/PG/126.png",
    sequence: 2,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 165,
    name: "Fortune Rabbit",
    code: "1543462",
    status: "OPEN",
    icon: "13/PG/1543462.png",
    sequence: 3,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 166,
    name: "Fortune Ox",
    code: "98",
    status: "OPEN",
    icon: "13/PG/98.png",
    sequence: 4,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 167,
    name: "Fortune Dragon",
    code: "1695365",
    status: "OPEN",
    icon: "16/PG/1695365.png",
    sequence: 5,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 168,
    name: "Fortune Mouse",
    code: "68",
    status: "OPEN",
    icon: "13/PG/68.png",
    sequence: 6,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 169,
    name: "Turbo Mines",
    code: "turbomines",
    status: "OPEN",
    icon: "11/TurboGames/turbomines.jpg",
    sequence: 7,
    siteName: null,
    platformId: 151,
    platformName: "TurboGames",
    platformCode: "TurboGames",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TurboGames"
  },
  {
    id: 170,
    name: "Money Coming",
    code: "51",
    status: "OPEN",
    icon: "18/TaDa/51.png",
    sequence: 9,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 171,
    name: "Joker’s Jewels Wild",
    code: "vs5jjwild",
    status: "OPEN",
    icon: "14/PP/vs5jjwild.png",
    sequence: 10,
    siteName: null,
    platformId: 22,
    platformName: "PP",
    platformCode: "PP",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PP"
  },
  {
    id: 172,
    name: "Fortune Monkey",
    code: "303",
    status: "OPEN",
    icon: "18/TaDa/303.png",
    sequence: 11,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 177,
    name: "Gates of Olympus 1000",
    code: "vs20olympx",
    status: "OPEN",
    icon: "14/PP/vs20olympx.png",
    sequence: 12,
    siteName: null,
    platformId: 22,
    platformName: "PP",
    platformCode: "PP",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PP"
  },
  {
    id: 173,
    name: "Devil Fire",
    code: "193",
    status: "OPEN",
    icon: "18/TaDa/193.png",
    sequence: 13,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 174,
    name: "Jackpot Joker",
    code: "301",
    status: "OPEN",
    icon: "18/TaDa/301.png",
    sequence: 14,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 178,
    name: "Gold Party",
    code: "vs25goldparty",
    status: "OPEN",
    icon: "14/PP/vs25goldparty.png",
    sequence: 15,
    siteName: null,
    platformId: 22,
    platformName: "PP",
    platformCode: "PP",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PP"
  },
  {
    id: 175,
    name: "Crazy777",
    code: "35",
    status: "OPEN",
    icon: "18/TaDa/35.png",
    sequence: 17,
    siteName: null,
    platformId: 152,
    platformName: "TaDa",
    platformCode: "TaDa",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TaDa"
  },
  {
    id: 176,
    name: "Dragon Tiger Luck",
    code: "63",
    status: "OPEN",
    icon: "13/PG/63.png",
    sequence: 18,
    siteName: null,
    platformId: 21,
    platformName: "PG",
    platformCode: "PG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "PG"
  },
  {
    id: 179,
    name: "Aviator",
    code: "27",
    status: "OPEN",
    icon: "5/Spribe/4457f1e2-d1ea-4b53-a111-95a225bef685.png",
    sequence: 23,
    siteName: null,
    platformId: 16,
    platformName: "TFGaming",
    platformCode: "TFGaming",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TFGaming"
  }
]);

const filteredHotGameList = computed(() => {
  if (searchText.value) {
    return hotGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  } else {
    return hotGameList.value;
  }
});

const loadHotGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_HOT_GAMES_${regDevice}`;
  const key2 = `MEMBER_HOT_${regDevice}`;

  var gameLists = [];
  var hotlists = [];

  cached
    .get(key2, () =>
      api
        .get("/sitePlatformAndGamesByLabel", {
          params: {
            gameLabel: "HOT",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      hotlists = res;

      // cached
      cached
        .get(key, () =>
          api
            .get("/platformGamesByLabelV1", {
              params: {
                gameLabel: "HOT",
                device: regDevice
              }
            })
            .then((ret) => {
              const res = ret;
              if (res.code === 0) {
                return res;
              }
            })
            .catch((err) => {})
        )
        .then((res) => {
          gameLists = res;

          hotlists = hotlists.map((item1) => {
            const matchingItem = gameLists.find(
              (item2) => item1.type === "game" && item1.code === item2.code && item1.platform === item2.platformCode
            );
            return { ...matchingItem, ...item1 };
          });

          hotlists = hotlists.map((item3) => {
            const matchingItem = livecasino.value.find(
              (item4) => item3.type === "platform" && item3.code === item4.name
            );
            return { ...item3, ...matchingItem };
          });

          hotGameList.value = hotlists.map((item5) => {
            const matchingItem = sport.value.find((item6) => item5.type === "sport" && item5.code === item6.name);
            return { ...item5, ...matchingItem };
          });

          // console.log("End Hot");
          // console.log(JSON.stringify(hotGameList.value));
          isHotGameLoading.value = false;
        });
    });
};

const fishGameList = computed(() => {
  const result = [];
  for (const game of fishGameTADAList.value) {
    result.push({
      ...game,
      _iconPrefix: "tada"
    });
  }
  for (const game of fishGameJILIList.value) {
    result.push({
      ...game,
      _iconPrefix: "jili"
    });
  }
  for (const game of fishGameJDBList.value) {
    result.push({
      ...game,
      _iconPrefix: "jdb"
    });
  }
  return result;
});

const fishGameTADAList = ref([]);

const loadTADAFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_TADA_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get("/platformGames", {
          params: {
            platformId: 152,
            gameType: "FISH",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      fishGameTADAList.value = res;
    });
};

const fishGameJILIList = ref([]);

const loadJILIFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_JILI_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get("/platformGames", {
          params: {
            platformId: 8,
            gameType: "FISH",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      fishGameJILIList.value = res;
    });
};

const fishGameJDBList = ref([
  {
    id: 56236,
    name: "Cai Shen Fishing",
    code: "7003",
    status: "OPEN",
    icon: "13/JDB/7003.png",
    sequence: 999,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "8/28/24, 4:16 PM",
    type: null
  },
  {
    id: 56237,
    name: "Shade Dragons Fishing",
    code: "7004",
    status: "OPEN",
    icon: "13/JDB/7004.png",
    sequence: 999,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "8/28/24, 4:16 PM",
    type: null
  },
  {
    id: 56238,
    name: "Fishing YiLuFa",
    code: "7005",
    status: "OPEN",
    icon: "13/JDB/7005.png",
    sequence: 999,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "8/28/24, 4:16 PM",
    type: null
  },
  {
    id: 56239,
    name: "Dragon Master",
    code: "7006",
    status: "OPEN",
    icon: "13/JDB/7006.png",
    sequence: 999,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "8/28/24, 4:16 PM",
    type: null
  }
]);

const loadJDBFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_JDB_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get("/platformGames", {
          params: {
            platformId: 31,
            gameType: "FISH",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      fishGameJDBList.value = res;

      // console.log("JSD");
      // console.log(JSON.stringify(fishGameJDBList.value));
    });
};

const isShowAllHotGames = ref(false);
const scrollDownHotGames = () => {
  isShowAllHotGames.value = true;
};

const isShowAllFullGames = ref(false);
const scrollDownFullGames = () => {
  isShowAllFullGames.value = !isShowAllFullGames.value;
};

const showValue = computed(() => {
  if (!isShowAllFullGames.value) {
    return 12;
  } else {
    return 600;
  }
});

const loadGameList = (type, id) => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const code = id;
  const gameType = type;
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

  // cached
  cached
    .get(key, () =>
      api
        .get("/platformGames", {
          params: {
            platformId: code,
            gameType: gameType,
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
          isGameLoading.value = false;
        })
        .catch((err) => {})
    )
    .then((res) => {
      subGameList.value = res;
      isGameLoading.value = false;
    });
};

const imgURL = process.env.IMAGE_CDN;
const imgURLGame = imgURL + "/game/";
const imgURLPromo = imgURL + "/promo/";

// Pop out ads banner
const isImportantAnnoucementModal = ref(false);
const homePopupImg = ref("");
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const currentYear = ref(new Date().getFullYear());

const setExpiryBanner = () => {
  if (homePopupFrequencyNum.value !== 0) {
    setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
  }
  isImportantAnnoucementModal.value = false;
};

const setWithExpiry = (key, value, interval) => {
  // Create a new date object in GMT+5.5
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const item = {
    value: value,
    expiry: now.getTime() + interval,
    id: homePopupId.value,
    frequency: homePopupFrequency.value
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

const bannerLoading = ref(false);

function loadData() {
  bannerLoading.value = true;
  api
    .get("/opt-session/promo/banner?category=HOME")
    .then((res) => {
      if (res.code === 0) {
        banners.value = res.data;
        // banners.value = [
        //   {
        //     promoPageId: null,
        //     desktopImageUrl: "promo-1.png",
        //     desktopImageUrlDark: null,
        //     mobileImageUrl: "promo-1.png",
        //     mobileImageUrlDark: null,
        //     redirectUrl: "/url/promo",
        //     category: "HOME",
        //     displayStartTime: 1577847600000,
        //     displayEndTime: 1893553199000
        //   },
        //   {
        //     promoPageId: null,
        //     desktopImageUrl: "promo-2.png",
        //     desktopImageUrlDark: null,
        //     mobileImageUrl: "promo-2.png",
        //     mobileImageUrlDark: null,
        //     redirectUrl: "/url/promo",
        //     category: "HOME",
        //     displayStartTime: 1577836800000,
        //     displayEndTime: 1893542399000
        //   }
        // ];

        setTimeout(() => {
          bannerLoading.value = false;
        }, 1000);
      }
    })
    .finally(() => {
      setTimeout(() => {
        bannerLoading.value = false;
      }, 1000);
    });
}

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
      // console.log(pf);
      slot.value = [];
      livecasino.value = [];

      pf.forEach((element) => {
        const { status } = element;
        if (status === "TEST" && store.memberType !== "TEST") return;

        const platTypes = element.gameType.split(",");
        if (platTypes.indexOf("ESPORT") > -1) {
          var espObj = Object.assign({}, element);
          esport.value.push(espObj);
          //Add 1 More Casual minigame.
          var casualObj = Object.assign({}, element);
          casuals.value.push(casualObj);
        }
        if (platTypes.indexOf("SPORT") > -1) {
          var spObj = Object.assign({}, element);
          sport.value.push(spObj);
        }
        if (platTypes.indexOf("LIVE") > -1) {
          var liveObj = Object.assign({}, element);
          livecasino.value.push(liveObj);
        }
        if (platTypes.indexOf("SLOT") > -1) {
          var slotObj = Object.assign({}, element);
          let slotItem = {
            id: slotObj.id,
            code: slotObj.code,
            icon: slotObj.name
          };
          ui.slotLists.push(slotItem);
          slot.value.push(slotObj);
        }
        if (platTypes.indexOf("FISH") > -1 && element.code !== "AGF") {
          var fishObj = Object.assign({}, element);
          fishing.value.push(fishObj);
        }
        if (platTypes.indexOf("POKER") > -1) {
          var pokerObj = Object.assign({}, element);
          poker.value.push(pokerObj);
        }
        if (platTypes.indexOf("LOTTERY") > -1) {
          var lottObj = Object.assign({}, element);
          lottery.value.push(lottObj);
        }
      });

      // console.log("Before");
      // console.log(sport.value);
      livecasino.value.sort((a, b) => a.sequence - b.sequence);
      sport.value.sort((a, b) => a.sequence - b.sequence);
      esport.value.sort((a, b) => a.sequence - b.sequence);
      poker.value.sort((a, b) => a.sequence - b.sequence);
      slot.value.sort((a, b) => a.sequence - b.sequence);
      lottery.value.sort((a, b) => a.sequence - b.sequence);

      isPlatLoading.value = false;

      loadHotGameList();

      loadCategoryLists();

      setTimeout(() => {
        if (route.query.game) {
          gameClickFromMenu(route.query.game);
        }
      }, 100);
    })
    .catch((err) => {});
};

const announcementList = ref([]);
const announcementTypes = ref([]);
const loadAnnouncement = () => {
  api.get("/announcement").then((res) => {
    if (res.code === 0) {
      if (res.data.announcements) {
        const d = res.data.announcements;
        announcementList.value = d;
        // announcementList.value = [
        //   {
        //     title: "Bem-vindo ao AKB148",
        //     content: "Bem-vindo ao AKB148",
        //     typeId: 72,
        //     createTime: 1729150088000,
        //     attachment: null
        //   }
        // ];
      }
      if (res.data.type) {
        announcementTypes.value = res.data.type;
        activeKey.value = res.data.type[0].id;
      }
    }
  });
};
const isStationNotice = ref(false);
const noticeTitle = ref("");
const activeKey = ref(null);
const openPopup = (noticeType) => {
  if (noticeType) {
    noticeTitle.value = "Announcement";
    isStationNotice.value = true;
  }
};

const gotoPromo = (banner) => {
  const urlSplit = banner.redirectUrl.split("|");
  const gameSplit = urlSplit.map((part) => part.split("/"));

  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "open") {
      if (gameSplit[1][1] === "LuckySport") {
        playGame(
          gameSplit[1][0],
          gameSplit[1][1],
          "#/special/uefaeuro",
          gameSplit[1][3],
          gameSplit[1][4],
          gameSplit[1][5]
        );
      } else {
        playGame(gameSplit[1][0], gameSplit[1][1], gameSplit[1][2], gameSplit[1][3], gameSplit[1][4], gameSplit[1][5]);
      }
    } else if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promo?name=${banner.redirectUrl}`);
    }
  } else {
    if (banner.redirectUrl.includes("https://")) {
      window.open(banner.redirectUrl, "_blank");
    } else if (banner.redirectUrl === "app_login") {
      if (isH5.value && downloadAppRef.value) downloadAppRef.value.click();
    } else {
      if (banner.redirectUrl === "redpacketrain") {
        // isMoneyRainModal.value = true;
        popupPromo.value = "money-rain";
      } else {
        router.push(`/promo?name=${banner.redirectUrl}`);
      }
    }
  }
};

const returnBannerUrl = (banner) => {
  try {
    var bannerImg = "";
    const bannerSplit = banner.mobileImageUrl.split("/");
    // console.log(bannerSplit);
    if (bannerSplit.length > 1) {
      bannerImg = bannerSplit[1];
    } else {
      bannerImg = bannerSplit[0];
    }
    // return require(`../assets/images/banners/${bannerImg}`);
    return require(`../assets/images/promotion/tempo/${bannerImg}`);
  } catch (e) {
    return imgURLPromo + banner.mobileImageUrl;
  }
};

const gotoSignIn = () => {
  router.push("/login");
};

const gotoSignUp = () => {
  router.push("/register");
};

const spinLuckyWheelPromoHomePopupRef = ref();
const download_url = ref("");
const isAppUpdateModal = ref(false);
const isOutdatedApp = ref(false);
const getVersionNo = async () => {
  // alert("run")
  if (Platform.is.android && Platform.is.capacitor) {
    const info = await App.getInfo();
    // console.log("APP Info");
    // console.log(info);
    var current_version = parseInt(info.version.replaceAll(".", ""));
    // alert("Cur:" + current_version);
    // info.version && info.build
    const appType = "ALL";
    const affiliateCode = sessionStorage.getItem("AFFILIATE_CODE");
    // alert(affiliateCode) ;
    const res = await api.get(`/app/india/getAppData?affiliateCode=${affiliateCode}&appVersion=${info.version}`);
    // console.log(res);
    if (res.code === 0) {
      // alert(JSON.stringify(res.data));
      var version_info = res.data.version;
      var min_version = res.data.minVersion;
      var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
      // alert(latest_ver_no);
      download_url.value = res.data.downloadUrl;
      console.log("H5 Url");
      console.log(res.data.h5Url);

      store.h5Url = res.data.h5Url;
      if (latest_ver_no > current_version) {
        isAppUpdateModal.value = true;
      }

      if (min_version) {
        var min_ver_no = parseInt(min_version.replaceAll(".", ""));
        if (min_ver_no > current_version) {
          isOutdatedApp.value = true;
        }
      }
    }
  }
};

const getAppData = async () => {
  const affiliateCode = sessionStorage.getItem("AFFILIATE_CODE");
  const res = await api.get(`/app/india/getAppData?affiliateCode=${affiliateCode}`);
  // console.log(res);
  if (res.code === 0) {
    download_url.value = res.data.downloadUrl;
    store.h5Url = res.data.h5Url;
  }
};

const openDownloadPage = () => {
  window.open(download_url.value, "_system");
  // isAppUpdateModal.value = false;
};
const cancelUpdate = () => {
  isAppUpdateModal.value = false;
};

// const downloadUrl = ref("");

// const getAppDownloadUrl = () => {
//   api
//     .get("/config/appDownloadUrl")
//     .then((res) => {
//       // console.log(res);
//       downloadUrl.value = res.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const truncateText = (text, maxLength) => {
  if (!text) {
    return "";
  }
  if (text === "JiliGames") {
    text = "JILI";
  } else if (text.startsWith("WC")) {
    return text.substring(2);
  }

  if (window.innerWidth <= 450) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  } else {
    return text;
  }
};

const closeDepositDialog = () => {
  depositDialog.value = false;
};

const openCSInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};

const detectAndroidVersion = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.indexOf("android") > -1;

  if (isAndroid) {
    const androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));

    if (!isNaN(androidVersion)) {
      if (androidVersion <= 9) {
        return "android-low " + androidVersion;
      } else {
        return "android-high " + androidVersion;
      }
    }
  }

  return "not-android";
};

const moveCsIcon = (ev) => {
  isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};

const pushNotificationData = ref();

const populatePushNotificationData = (data) => {
  pushNotificationData.value = data;
};

const initOneSignal = () => {
  OneSignal.initialize("58af944a-61fc-4180-91db-af60216840d2");

  let myClickListener = async function (event) {
    console.log("CLICK PUSH");
    let notificationData = event;
    console.log(notificationData);
    console.log(notificationData.notification.title);
    console.log(notificationData.notification.body);
    console.log(notificationData.notification.additionalData);
    populatePushNotificationData(notificationData.notification);
  };
  OneSignal.Notifications.addEventListener("click", myClickListener);

  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.Notifications.requestPermission(true).then((accepted) => {
    console.log("User accepted notifications: " + accepted);
  });
};

const loadCustomerAddress = () => {
  cached
    .get("customerAddress", () =>
      api.get("/config/customerAddress/v2").then((res) => {
        return res;
      })
    )
    .then((data) => {
      var url = data.liveUrl1;
      ui.CSAUrl = url;
    });
};

const translateTitle = (title) => {
  const translations = {
    hot: t("home.menu_hot"),
    lobby: t("home.menu_lobby"),
    slot: t("home.menu_slot"),
    casino: t("home.menu_live"),
    fishing: t("home.menu_fish"),
    sport: t("home.menu_sport")
  };
  return translations[title.toLowerCase()] || title;
};

const loadAppTabs = () => {
  const localStorageKey = "appTabs";
  const savedTabs = JSON.parse(localStorage.getItem(localStorageKey));
  // if (savedTabs && savedTabs.length > 0) {
  //   categoriesList.value = savedTabs;
  //   categoriesList.value.forEach((tab, index) => {
  //     tab.active = index === 0;
  //   });
  // } else {
  categoriesList.value = [
    { title: "Hot", icon: "hot", active: true },
    // { title: "Lobby", icon: "lobby", active: false },
    // { title: "Slot", icon: "slot", active: false },
    { title: "Casino", icon: "casino", active: false },
    { title: "Fishing", icon: "fishing", active: false },
    { title: "Sport", icon: "sport", active: false }
  ];
  // }

  api
    .get("/opt-session/getAppTabs")
    .then((res) => {
      // debugger;
      if (res.code === 0) {
        const { data } = res;
        if (data && data.tabs) {
          const { tabs } = res.data;
          if (tabs.length > 0) {
            localStorage.setItem(localStorageKey, JSON.stringify(res.data.tabs));
          }
        }
        if (data && data.deposit) {
          store.paytypeWithPrivilege = data.deposit.paytypeWithPrivilege;
          store.extraPrivilegeId = data.deposit.privilegeId;
        }
        if (data && data.hasOwnProperty("ftd")) {
          store.ftd = data.ftd;
        }
      }
    })
    .catch((e) => {
      console.error("Failed to fetch tabs:", e);
    });
};

const loadCategoryLists = () => {
  // console.log(slot.value);
  slot.value.forEach((slotitem, ind1) => {
    categoriesList.value.splice(1, 0, {
      title: "slot",
      code: slotitem.code,
      icon: slotitem.name,
      active: false,
      id: slotitem.id
    });
  });
  // console.log(categoriesList.value)
};

const hbDragPos = ref([10, 120]);
const isHbShow = ref(true);
const hbSlide = ref(0);

const floatPromo = ref([]);
const hbPromo = computed(() => {
  const result = [...floatPromo.value];
  return result;
});

const checkSpinLuckyWheelPromo = async () => {
  if (store.token) {
    const res = await eventapi.post("/refer-spin/check");
    store.spinWheelLuckyPromoInfo = { ...store.spinWheelLuckyPromoInfo, ...res.data };
  }

  if (sessionStorage.getItem("isReload")) {
    sessionStorage.removeItem("isReload");
    sessionStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
  }

  if (!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP") && spinLuckyWheelPromoHomePopupRef.value) {
    spinLuckyWheelPromoHomePopupRef.value.checkIsCanShowPopup();
  }
};

const checkHbPromo = () => {
  api
    .get("/redirect")
    .then((res) => {
      return res;
    })
    .then((data) => {
      floatPromo.value = data.data.reduce((result, promo) => {
        if (
          promo.code !== "pak-mega-sharing-wheel" ||
          (promo.code === "pak-mega-sharing-wheel" && store.token && ui.promo_megaspin === "1")
        ) {
          result.push({
            ...promo,
            icon: `${imgURL}/promo/${promo.icon}`
          });
        }
        return result;
      }, []);
    });
};

const gotoFloatPromo = (val) => {
  if (val.type === "PROMO" && val.code === "money-rain") {
    // isMoneyRainModal.value = true;
    popupPromo.value = "money-rain";
  } else if (val.type === "PROMO") {
    if (store.hasToken()) {
      if (val.code.indexOf("url|") > -1) {
        const page = val.code.replace("url|", "");
        router.push(page);
      } else if (val.code === "/activity-details") {
        router.push(`/activity-details`);
      } else {
        router.push(`/promo?name=${val.code}`);
      }
    } else {
      router.push("/promo");
    }
  }

  if (val.type === "DOMAIN") {
    window.open(val.code, "_blank");
  }
};

let intervalId;

watch(
  () => promoStore.isShownSpinLuckyWheel,
  async (val) => {
    await nextTick();
    if (val) checkSpinLuckyWheelPromoHomePopupCanShow();
  }
);

watch(
  () => route.path,
  () => {
    gameClickFromMenu(route.query.game);
  }
);

const checkSpinLuckyWheelPromoHomePopupCanShow = () => {
  if (!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP") && spinLuckyWheelPromoHomePopupRef.value) {
    spinLuckyWheelPromoHomePopupRef.value.checkIsCanShowPopup();
  }
};

const isShowPrizeModal = ref(false);
const popupPromo = ref("");

const checkSpinWheel = () => {
  if (store.hasToken() && isAndroid()) {
    setTimeout(() => {
      showSpinWheel();
    }, 750);
  }
};

const getJackpotAmt = () => {
  api.get("/app/jackpot").then((res) => {
    // debugger;
    if (res.code === 0) {
      ui.jackpotAmt = res.data.value;
    }
  });
};

const showSpinWheel = () => {
  eventapi
    .get("/new-user-roulette/init")
    .then((res) => {
      if (res.code === 0) {
        if (res.data.hasUnusedCoupon === "YES") {
          isShowPrizeModal.value = true;
        } else if (res.data.showRoulette === "YES") {
          // isLuckyDrawModal.value = true;
          if (!promoStore.isShownSpinLuckyWheel) {
            popupPromo.value = "lucky-spin-wheel";
          }
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

onActivated(() => {
  store.getUnreadTotal();
  if (route.query.login === "true" || route.query.register === "true") {
    //TODO: change back.
    // popupPromo.value = "money-rain";
    popupPromo.value = "spin-lucky-wheel";
  }
  // popupPromo.value = "money-rain";
});

onMounted(() => {
  isPlatLoading.value = true;
  loadAppTabs();
  getPlatList();
  loadData();
  loadAnnouncement();
  checkPlatform();
  loadJILIFishGameList();
  loadJDBFishGameList();
  loadTADAFishGameList();
  loadCustomerAddress();
  checkHbPromo();
  checkSpinLuckyWheelPromo();
  getJackpotAmt();
  SwiperCore.use([Grid, Navigation, Pagination, Scrollbar, A11y]);

  if (Platform.is.android && Platform.is.capacitor) {
    initOneSignal();
  }

  intervalId = setInterval(checkPlatform, 300000);

  window.addEventListener("beforeunload", function () {
    sessionStorage.setItem("isReload", "true");
  });
});

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("isReload", "true");
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped lang="scss">
.q-page-container {
  min-height: 100vh;
}

.longer-swiper {
  height: calc(100vh - 380px);
}

:deep(.q-mb-md) {
  margin-bottom: 0;
}

.modal-update-div {
  .modalcontent {
    background: #fff;
    height: 180px;
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
      background: $primary;
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
      color: black;

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
      justify-content: center;
      gap: 20px;
      padding: 0 20px;
      margin-top: 0px;

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
        max-width: 200px;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        color: #fff;
        background: $primary;
        letter-spacing: 1px;
        font-size: 14px;
        max-width: 200px;
      }
    }
  }
}

.download-top-container {
  padding: 4px 10px;

  .download-top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .q-icon {
      font-size: 24px;
      color: #bacef1;
    }

    .headicon {
      flex: 1;
      width: 5%;
    }

    .download-txt-container {
      flex: 5;
      font-size: 0.7rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: column;
      color: #bacef1;

      .download-title {
        font-size: 0.8rem;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .q-btn {
    }
  }
}

.midd {
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 40px;
  overflow: hidden;

  .station-notice-wrapper {
    display: flex;
    background: linear-gradient(
      270deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.11) 50.48%,
      rgba(255, 255, 255, 0) 100%
    );
    gap: 10px;
    padding: 2px 10px;
    justify-content: center;
    align-items: center;

    .volume {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 28px;
      width: 28px;
    }

    .marquee-container {
      width: calc(100% - 28px);
    }

    span {
      margin-right: 10px;
      cursor: pointer;
      color: #fff;
    }
  }

  .share {
    background-image: linear-gradient(to right, #de4545, #db7e42);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    flex: 1;
  }
}

.jackpot-banner {
  background: url("../assets/images/index/jackpot-banner.svg") center center no-repeat;
  background-size: 100% 100%;
  aspect-ratio: 355/42;
  position: relative;
  margin: 10px 0;

  .jackpot-digit-grp {
    display: flex;
    gap: 3px;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translate(0%, -50%);

    .jackpot-digit {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #ffc27a 32.14%, #ffea9c 60.71%, #ffeeaf 89.29%);
      width: 15px;
      height: 20px;
      color: #0a4d13;
      font-weight: 700;
      font-size: 14px;
      line-height: 140%;
      letter-spacing: -0.08%;
      border-radius: 4px;
    }
  }
}

.welcome-bar {
  display: flex;
  padding: 10px;
  gap: 20px;
  background-color: #212534;
  height: 35px;
  justify-content: space-evenly;
  align-items: center;
  color: #bacef1;
  font-size: 12px;

  .logo {
    flex: 1;
    height: 25px;

    img {
      height: 100%;
    }
  }

  .welcome-liner {
    flex: 3;
    white-space: nowrap;
  }

  .login {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
    text-decoration: none;
    color: #bacef1;

    .log {
      white-space: normal;
      word-break: keep-all;
    }

    .user {
      background: #43465e;
      padding: 0px 2px;
      border-radius: 50%;
    }
  }
}

.details-bar {
  gap: 10px;
  background-color: #1a1c28;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 1;
    padding: 10px;
    border-right: 1px solid #45475f;
    color: #bacef1;
    font-size: 16px;
  }

  .menulist {
    flex: 4;
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .men {
      text-decoration: none;
      color: #ffffff;
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
      color: #bacef1;
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
      color: #bacef1;
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

.alert-image {
  width: 100%;
  margin: auto;
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
  // background: transparent;
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

.login.with-register {
  font-size: 14px;
  font-weight: bold;
}

.announcement-close {
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 3;
}

.announcement-dialog {
  height: calc(100vh - 108px);
}

.announcement-card {
  height: 400px;
  background: #1f241f;
  color: #fff;
  border-radius: 10px;
  overflow-y: auto;

  .q-tab__label {
    font-size: 18px;
  }

  .q-tab {
    color: #fff;
  }

  .q-card {
    background: transparent;
  }

  .q-tab-panels {
    background: transparent;
    width: calc(100% - 10px);
  }
}

.popout-dialog {
  width: 90%;
  max-width: 500px;
  position: relative;
  padding-top: 90px;
  padding-right: 10px;

  .popout-close {
    position: absolute;
    right: 0px;
    top: 80px;
    background: #cfcfcf;
    color: #787878;
  }

  .popout-dialog-container--yel {
    // background-image: url(../assets/images/index/popout/deposit-bg.png) !important;
    background-position: bottom center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }

  .popout-main-title {
    // background-image: url(../assets/images/index/popout/popout-title.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    width: 100%;
    max-width: 290px;
    height: 120px;
    margin: -110px auto 0;
    // position: absolute;
    // top: 0px;
    position: relative;

    .txt-title {
      background-color: #f3ec78;
      background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      line-height: 1;
      font-size: 22px;
      font-weight: 800;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;

      position: absolute;
      bottom: 28px;
      left: 52%;
      transform: translate(-50%, 0%);
    }
  }

  .deposit-item-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 12px;
    column-gap: 8x;

    .deposit-item {
      .deposit-icon {
        // background-image: url(../assets/images/index/popout/deposit-item-frame.png);
        background-position: top center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        height: 80px;
        position: relative;
        align-items: center;
        justify-content: center;
        margin-left: 3px;
        margin-right: 3px;
        transition: all 0.3s;

        img {
          display: block;
          width: 70%;
        }
      }

      &.active > .deposit-icon {
        // background-image: url(../assets/images/index/popout/deposit-item-frame-active.png);
      }

      .deposit-hot-label {
        position: absolute;
        top: 0;
        right: 0;
        // background-image: url(../assets/images/index/popout/hot-label.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        width: 50px;
        height: 28px;
        font-size: 0.725rem;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding-bottom: 3px;
      }

      .deposit-amt {
        // background-image: url(../assets/images/index/popout/deposit-item-frame-amount.png);
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding: 3px;
        width: 100%;
        max-width: 100px;
        margin: auto;
      }
    }
  }

  .deposit-enter-amt {
    display: flex;
    gap: 16px;
    align-items: center;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    .deposit-input {
      background-color: rgba(21, 0, 37, 0.5);
      border-radius: 5px;
      width: 100%;
    }
  }

  .deposit-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 16px;

    .deposit-option-btn {
      color: #cccccc;
      background-color: rgba(21, 0, 37, 0.5) !important;
      min-width: 100px;
      max-width: 160px;
      width: 100%;
      border-radius: 6px;
      border: 3px solid transparent;

      &.active {
        color: #ffe66b;
        border: 3px solid #ffe66b;
      }

      &.label-on-discount {
        position: relative;

        &:after {
          content: "";
          // background-image: url(../assets/images/index/popout/label-discount.png);
          background-repeat: no-repeat;
          display: block;
          position: absolute;
          top: -4px;
          right: -5px;
          width: 30px;
          height: 30px;
          background-size: 100%;
        }
      }
    }
  }
}

.game-logo-img {
  height: 30px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  .game-logo {
    width: 30vw;
    background-position: center;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
  }

  img {
    display: block;
    height: 100%;
    width: auto;
  }
}

.app-download-section {
  text-align: center;
  padding: 40px 20px;
}

.character {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 2;
  width: 24%;

  img {
    height: 100%;
  }

  @media (max-width: 400px) {
    width: 18%;

    img {
      height: 75%;
    }
  }
}

.app-board {
  position: relative;
}

.app-info {
  margin-left: auto;
  width: 80%;
  border: 1px solid #4b4943;
  border-radius: 10px;
  padding: 5px 12px;

  @media (max-width: 400px) {
    width: 65%;
  }
}

.app-info h3 {
  color: #00ff99;
  font-size: 20px;
  margin: 0 0 10px;
  line-height: 24px;
}

.app-info p {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  padding: 5px;
}

.download-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.download-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

button.ios {
  background-color: #fff;
  color: #000;
}

button.android {
  background-color: rgba(255, 255, 255, 0.25);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logos {
  margin-top: 40px;
}

.providers,
.payment-icons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 0px 0 20px;
}

.providers img,
.payment-icons img {
  width: 100%;
  height: auto;
}

.footer {
  font-size: 12px;
  color: #ccc;
  margin-top: 30px;
}
</style>

<style lang="scss">
.q-dialog__inner--maximized > div {
  overflow-x: hidden;
}

.promo-banner-container {
  color: #ffffff;

  .promo-banner-content {
    h3 {
      font-size: 20px;
      line-height: 0;
      padding: 20px 0 5px;
    }
  }

  .promo-banner-img {
    img {
      width: 100%;
      display: block;
    }
  }
}

.home-wrapper {
  width: calc(100% - 16px);
  margin: auto;
}

.cs-icon-wrapper {
  display: flex;
  width: 60px;
  height: 60px;
  background: url("../assets/images/index/csicon.png") no-repeat center center;
  background-size: contain;
  border-radius: 50%;
  border: 1px solid #000;
}

.home-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  height: 1px;
  width: 100%;
  // margin: 0 -2.5%;
}

.top-action {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 5px;

  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    font-weight: 600;
    width: 50%;
    height: 55px;
    text-shadow: 2px 2px 2px #882f00;
    transition: 0.3s all;

    &--withdrawal {
      background-image: url(../assets/images/index/action-btn-withdrawal.png);
      color: #ffffff;

      &:before {
        box-shadow: none;
      }
    }

    &--deposit {
      background-image: url(../assets/images/index/action-btn-deposit.png);
      color: #fae576;

      &:before {
        box-shadow: none;
      }
    }

    &:hover {
      filter: opacity(0.8);
    }
  }
}

.games-selection-wrapper {
  .hot-games-pattern-top {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    margin-top: 8px;
  }

  .hot-games-pattern-bottom {
    background-size: contain;
    background-repeat: no-repeat;
    height: 50px;
    background-position: center center;

    &--filled {
      height: 15px;
      width: 15px;
      margin: 20px auto 10px;
      border-radius: 50%;
      background-color: #fbe984;
      display: flex;
      justify-content: center;
    }
  }

  .title-game {
    margin-left: -8px;
    margin-right: -8px;
    padding: 15px 12px 8px;
    display: flex;
    gap: 8px;
    align-items: center;

    .txt-style {
      font-family: "Dongle", sans-serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 1px;
      line-height: 1;
      text-transform: uppercase;
      color: #ffffff;
      background-image: url("../assets/images/index/title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 24px;
      background-position: center center;
      width: 100%;
      border-radius: 40px;
    }

    &.revamp {
      margin: 0;
      padding: 10px;
      background: url("../assets/images/index/game-cat-section-header.png") center center no-repeat;
      background-size: 100% 100%;
      min-height: 40px;
      width: 100%;
      display: flex;
      gap: 5px;
      align-items: center;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;

      .txt-style {
        background-image: none;
      }

      .side {
        display: flex;
        // gap: 10px;
        :not(:last-child) {
          margin-right: 10px;
        }
        justify-content: center;
        align-items: center;
        margin: 0;
        .all-btn {
          background: #373c3d;
          padding: 8px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }
      }
    }
  }
}

.game-platform-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 6px;
  row-gap: 8px;
  margin-top: 10px;
  padding-bottom: 20px;
}

.game-platform-item {
  width: 100%;
  position: relative;

  .game-platform-label {
    position: absolute;
    top: 0;
    width: 45%;

    &--hot {
      left: 0;
    }

    &--new {
      right: 0;
    }

    img {
      display: block;
      width: 100%;
    }
  }

  .game-platform-img {
    // background-color: #cccccc;
    width: 100%;
    aspect-ratio: 1/1;
    background-size: cover;
    background-position: center center;
    position: relative;
    background-image: url("../assets/images/index/mini-game-bg.png");
    border-radius: 8px;

    &.game-fish {
      aspect-ratio: 1/1.2;
    }

    .game--bg {
      border-radius: 8px;
      background-size: 100% 100%;
      background-position: top center;
      height: 100%;
      width: 100%;
      background-repeat: no-repeat;
    }
  }

  .game-platform-title {
    // padding: 0px 5px;
    // color: #ffe248;
    margin-top: 6px;
    color: #ffffff;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.3;
    text-align: left;
    height: 30px;
    display: flex;
    word-break: break-all;
    // justify-content: center;
    // background: linear-gradient(270deg, #370f59 -0.1%, #57009d 50.22%, #340c56 97.6%);
  }
}

.skeleton-lists {
  overflow-x: auto;
  display: flex;
  gap: 15px;
  justify-content: flex-start;

  .casino-skeleton {
    height: 150px;
    width: calc((100vw - 20px) / 2);
    border-radius: 12px;
  }

  .slot-skeleton {
    height: 150px;
    width: calc((100vw - 20px) / 3);
    border-radius: 12px;
  }
}

.skeleton-downs {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  flex-direction: column;

  .casino-skeleton {
    height: 150px;
    width: 100%;
    border-radius: 12px;
  }
}

.skeleton-grid {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  flex-wrap: wrap;

  .slot-skeleton {
    height: 150px;
    width: calc(33% - 15px);
    border-radius: 12px;
  }

  .sport-skeleton {
    height: 125px;
    width: 100%;
    border-radius: 12px;
  }
}

.swiper-wrapper {
  width: 100%;
}

.platform-game-container {
  display: grid;
  padding-top: 12px;
  margin-bottom: 12px;
  column-gap: 8px;
  row-gap: 16px;
  padding-bottom: 24px;

  &.revamp {
    background-color: #1f241f;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    padding: 10px 10px 32px;

    &.two-row {
      .swiper-wrapper {
        flex-wrap: wrap;
      }

      .swiper-slide {
        height: auto;
      }
    }
  }

  &.live-casino {
    padding-top: 8px;
    margin-bottom: 0px;
  }

  .swiper-scrollbar.swiper-scrollbar-horizontal {
    bottom: 0px;
    background: rgba(43, 55, 74, 0.6);
    padding: 1px;
    height: 5px;
  }

  .swiper-scrollbar-drag {
    background: rgba(255, 255, 255, 0.4);
  }

  &.grid-view {
    display: grid;
    grid-template-columns: repeat(4, minmax(75px, 32%));
    column-gap: 8px;
    row-gap: 16px;
  }

  &.grid-view-col-4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(75px, 32%));
    column-gap: 8px;
    row-gap: 16px;
  }

  &.sport-platform {
    grid-template-columns: 1fr;
    row-gap: 12px;

    .platform-game-item--img {
      border-radius: 8px;
    }
  }

  .platform-live-item {
    position: relative;

    &--img {
      background-size: cover;
      background-position: center center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;

      .platform-live-title {
        position: absolute;
        top: 20px;
        left: 20px;

        img {
          max-height: 22px;
        }
      }
    }
  }

  .platform-game-item {
    position: relative;

    &--img {
      background-size: cover;
      background-position: center center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .platform-game-title {
      text-align: left;
      margin-top: 6px;
      color: #ffffff;
      font-weight: bold;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // max-width: 100px;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}

.hb-float {
  position: relative;
  height: 100px !important;
  width: 100px;
  background: transparent;
  overflow: hidden;

  img {
    height: 100px !important;
  }

  .q-carousel__control {
    display: none;
  }
}

.floating-btn {
  z-index: 2001;

  img {
    width: 100%;
  }
}

.fullgame-dialog {
  // &.fullscreen {
  // top: 81px !important;
  // bottom: auto !important;
  // height: calc(100vh - 81px) !important;
  // }
}

.fullgame-card {
  margin: 0;
  // background-color: #101114;
  background-image: url(../assets/images/index/dialog-game-bg.png);
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #1e1f24;
}

.fullgame-wrapper {
  padding: 0;

  .fullgame-header {
    // background-image: url(../assets/images/index/fullgame-banner.jpg);

    margin: 0 -2.5%;
    // min-height: 200px;
    padding: 12px;
  }

  .fullgame-search {
    margin-top: 10px;
    // background: #1E1F24;
    background: #0b0b0c;
    border-radius: 4px;
  }
}

.burning-hot {
  position: absolute;
  top: 0;
  right: 0;
  width: 35%;
  max-width: 50px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.cat-selection-wrapper {
  // overflow-x: hidden;
  // padding-bottom: 20px;
  margin-bottom: 10px;

  .cat-selection-container {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    overflow-x: scroll;
  }

  .swiper-scrollbar.swiper-scrollbar-horizontal {
    bottom: 0px;
    background: rgba(43, 55, 74, 0.6);
    padding: 1px;
    height: 5px;
  }

  .swiper-scrollbar-drag {
    background: rgba(255, 255, 255, 0.4);
  }

  .swiper-slide {
    width: 52px !important;
    height: 51px !important;
  }
}

.menu-category-btn {
  // background-image: url("../assets/images/index/category/menu-category-btns.png");
  background-size: 156px 379px;
  background-position: 0px 0px;
  width: 73px;
  height: 55px;
  background-repeat: no-repeat;

  &.cat-lobby {
    background-position: -83px 0px;

    &.active {
      background-position: 0px 0px;
    }
  }

  &.cat-hot {
    background-position: -83px -65px;

    &.active {
      background-position: 0px -65px;
    }
  }

  &.cat-casino {
    background-position: -83px -130px;

    &.active {
      background-position: 0px -130px;
    }
  }

  &.cat-slot {
    background-position: -83px -195px;

    &.active {
      background-position: 0px -195px;
    }
  }

  &.cat-fishing {
    background-position: -83px -260px;

    &.active {
      background-position: 0px -260px;
    }
  }

  &.cat-sport {
    background-position: -83px -325px;

    &.active {
      background-position: 0px -325px;
    }
  }
}

.cat-menu-item {
  img {
    width: 100%;
  }
}

.cat-selection-item {
  background: url("../assets/images/index/cat-selection-bg.svg") center center no-repeat;
  background-size: 100% 100%;
  width: 80px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  transition: 0.3s all;
  min-width: 100%;

  &.active {
    background: url("../assets/images/index/cat-selected-bg.png") center center no-repeat;
    background-size: 100% 100%;

    .cat-title {
      //color: #10211f;
      font-weight: bold;
    }
  }

  &:hover {
    filter: brightness(1.2);
  }

  .cat-icon {
    flex: 4;
    display: flex;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 40px;
    }
  }

  .cat-title {
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #bfc3c9;
    letter-spacing: 0px;
    font-weight: 500;
    font-size: 11px;
    text-align: center;
    line-height: 13px;
    white-space: normal;
  }
}

.platform-game-img {
  // background-color: #cccccc;
  width: 100%;
  aspect-ratio: 1/1.2;
  background-size: cover;
  background-position: center center;
  position: relative;
  // background-image: url("../assets/images/index/mini-game-bg.png");
  // background-image: url("../assets/images/index/item-game-maintenance.png");
  border-radius: 8px;

  .game--bg {
    background-size: 100% 100%;
    background-position: center center;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background-repeat: no-repeat;
    // background-image: url("../assets/images/index/mini-game-bg.png");
  }
}

.loader-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  grid-column: span 4;
}

.btn-more-games {
  display: flex;
  justify-content: center;
  margin: auto;
  border: 2px solid rgba(0, 151, 185, 1);
  padding: 12px 16px;
  width: 160px;
  border-radius: 8px;
  color: rgba(206, 206, 206, 0.8);
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.back-btn {
  background: rgb(255, 255, 255, 0.2);
}

// lower android version
.android-8 {
  .game-platform-img {
    height: 80px;
  }
}

.announcement-card {
  padding-top: 16px;

  font-family: "Manrope", sans-serif;

  .q-tab__label {
    font-size: 16px;
  }

  .q-tab--active .q-tab__indicator {
    height: 0px;
  }

  .q-item__label {
    color: #fff;
  }
}

.games-selection-wrapper {
  .custom-hot-prev,
  .custom-live-prev,
  .custom-slot-prev,
  .custom-poker-prev,
  .custom-fish-prev {
    transform: rotateZ(180deg);
  }
  .custom-hot-prev,
  .custom-hot-next,
  .custom-live-prev,
  .custom-live-next,
  .custom-slot-prev,
  .custom-slot-next,
  .custom-poker-prev,
  .custom-poker-next,
  .custom-fish-prev,
  .custom-fish-next {
    background: #373c3d;
    padding: 10px;
    border-radius: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
  }

  .custom-hot-prev.swiper-button-disabled,
  .custom-hot-next.swiper-button-disabled,
  .custom-live-prev.swiper-button-disabled,
  .custom-live-next.swiper-button-disabled,
  .custom-slot-prev.swiper-button-disabled,
  .custom-slot-next.swiper-button-disabled,
  .custom-poker-prev.swiper-button-disabled,
  .custom-poker-next.swiper-button-disabled,
  .custom-fish-prev.swiper-button-disabled,
  .custom-fish-next.swiper-button-disabled,
  .custom-hot-prev.swiper-button-lock,
  .custom-hot-next.swiper-button-lock,
  .custom-live-prev.swiper-button-lock,
  .custom-live-next.swiper-button-lock,
  .custom-slot-prev.swiper-button-lock,
  .custom-slot-next.swiper-button-lock,
  .custom-poker-prev.swiper-button-lock,
  .custom-poker-next.swiper-button-lock,
  .custom-fish-prev.swiper-button-lock,
  .custom-fish-next.swiper-button-lock {
    background: #ffffff0f;
    cursor: not-allowed;
  }
  &#live {
    margin-bottom: 10px;
  }
  .hot-games-pattern-top {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    margin-top: 8px;
  }

  .hot-games-pattern-bottom {
    background-size: contain;
    background-repeat: no-repeat;
    height: 50px;
    background-position: center center;

    &--filled {
      height: 15px;
      width: 15px;
      margin: 20px auto 10px;
      border-radius: 50%;
      background-color: #fbe984;
      display: flex;
      justify-content: center;
    }
  }
}

.hometop-categories {
  margin-bottom: 15px;

  .swiper-slide {
    // width: 80px !important;
    // background-image: url("../assets/images/index/icon-frame.png");
    // background-size: 100% auto;
    // background-repeat: no-repeat;
  }
}

.show-all-btn {
  grid-column: span 4;
  font-size: 18px;
  font-weight: 600;
  color: #00fd7c;

  &.expanded {
    .q-icon {
      transform: rotate(-90deg);
    }
  }

  .q-icon {
    background: #00fd7c;
    margin-left: 10px;
    border-radius: 50%;
    color: #1f241f;
    transform: rotate(90deg);
  }
}
</style>

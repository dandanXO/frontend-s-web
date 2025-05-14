<template>
  <ProfileSummary :homeProfile="true" />
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
    >
      <q-carousel-slide
        v-for="(banner, i) in banners"
        :key="i"
        :name="i"
        class="column no-wrap flex-center"
        :img-src="returnBannerUrl(banner)"
        @click="gotoPromo(banner)"
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
            background-color: #661ebf;
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
              :img-src="`${imgURL}/promo/${promo.icon}`"
            ></q-carousel-slide>
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
          <img
            style="width: 24px; height: 24px"
            class="filter-purple"
            src="../assets/images/index/volume-up-line.svg"
          />
        </div>
        <div class="marquee-container">
          <marquee-text :repeat="5" :duration="announcementList.length * 120">
            <div v-if="announcementList">
              <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                {{ a.content }}
              </span>
            </div>
          </marquee-text>
        </div>
      </div>
    </div>

    <!-- <div class="top-action" v-if="store.hasToken()">
      <q-btn class="action-btn action-btn--withdrawal" @click="onWithdrawalClick()" no-caps label="Withdrawal"></q-btn>
      <q-btn class="action-btn action-btn--deposit" @click="openDepositDialog()" no-caps label="Deposit" />
    </div>
    <div v-else class="top-action">
      <q-btn class="action-btn action-btn--withdrawal" @click="gotoSignIn()" no-caps label="Sign In"></q-btn>
      <q-btn class="action-btn action-btn--deposit" @click="gotoSignUp()" no-caps label="Sign Up" />
    </div> -->

    <swiper
      :slidesPerView="4.5"
      :spaceBetween="10"
      :scrollbar="{
        hide: true
      }"
      :modules="modules"
      class="cat-selection-wrapper"
      @swiper="handleCatSwiper"
    >
      <template v-for="(item, index) in categoriesList" :key="index">
        <swiper-slide>
          <div class="cat-selection-item" :class="item.active && 'active'" @click="activateSlide(item, index)">
            <div class="cat-icon">
              <img :src="require(`../assets/images/index/category/cat-${item.icon.toLowerCase()}.png`)" alt="" />
            </div>
            <div class="cat-title">{{ transformTitle(item.title) }}</div>
          </div>
        </swiper-slide>
      </template>
    </swiper>

    <template v-for="category in categoriesList" :key="category.title">
      <template v-if="(category.title === 'Hot' && category.active) || (category.title === 'Lobby' && category.active)">
        <div class="games-selection-wrapper" id="hotgames">
          <div class="title-game">
            <span class="txt-style">Hot Games</span>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <!--            <template v-if="isHotGameLoading">-->
            <!--              <div class="skeleton-lists">-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--              </div>-->
            <!--            </template>-->

            <!-- <pre>hotGameList{{hotGameList}}</pre> -->

            <swiper
              :slidesPerView="3.5"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container"
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
            <div class="platform-game-container grid-view-col-4">
              <template v-for="(item, index) in hotGameList" :key="index">
                <template v-if="item.type && item.type === 'game'">
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
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Slot' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="slotsgames">
          <div class="title-game">
            <span class="txt-style">Slots Games</span>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <!--            <template v-if="isPlatLoading">-->
            <!--              <div class="skeleton-lists">-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--                <q-skeleton class="slot-skeleton" />-->
            <!--              </div>-->
            <!--            </template>-->

            <swiper
              :slidesPerView="3.5"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container"
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

            <div
              :slidesPerView="3.5"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container grid-view"
            >
              <template v-for="(item, index) in slot" :key="index">
                <div
                  class="platform-game-item btn-effect"
                  @click="openGame(item.name, item.code, '', item.status, 'SLOT', item.id)"
                >
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
              </template>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Casino' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="live">
          <div class="title-game">
            <span class="txt-style">Live Casino</span>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <!--            <template v-if="isPlatLoading">-->
            <!--              <div class="skeleton-lists">-->
            <!--                <q-skeleton class="casino-skeleton" />-->
            <!--                <q-skeleton class="casino-skeleton" />-->
            <!--              </div>-->
            <!--            </template>-->

            <swiper
              :slidesPerView="1.5"
              :spaceBetween="0"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container live-casino"
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

            <div class="platform-game-container">
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

      <!--      <template-->
      <!--        v-if="-->
      <!--          (category.title === 'Fishing' && category.active) ||-->
      <!--          (category.title === 'Minigames' && category.active) ||-->
      <!--          (category.title === 'Lobby' && category.active)-->
      <!--        "-->
      <!--      >-->
      <!--        <div class="games-selection-wrapper" id="fishing">-->
      <!--          <div class="title-game">-->
      <!--            <span class="txt-style">Minigames</span>-->
      <!--          </div>-->

      <!--          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">-->
      <!--            <swiper-->
      <!--              :slidesPerView="3.5"-->
      <!--              :spaceBetween="10"-->
      <!--              :scrollbar="{-->
      <!--                hide: true-->
      <!--              }"-->
      <!--              :modules="gameModules"-->
      <!--              class="platform-game-container"-->
      <!--            >-->
      <!--              <template v-for="(item, index) in recommendList" :key="index">-->
      <!--                <swiper-slide-->
      <!--                  class="platform-game-item btn-effect"-->
      <!--                  @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"-->
      <!--                >-->
      <!--                  <div>-->
      <!--                    <div class="platform-game-img">-->
      <!--                      <div-->
      <!--                        class="game&#45;&#45;bg"-->
      <!--                        :style="{-->
      <!--                          backgroundImage: (() => {-->
      <!--                            try {-->
      <!--                              return `url(${require(`../assets/images/games/recommend/item-game-${item.code.toLowerCase()}.png`)})`;-->
      <!--                            } catch (e) {-->
      <!--                              try {-->
      <!--                                return `url(${imgURLGame}${item.icon})`;-->
      <!--                              } catch (e) {-->
      <!--                                return `url(${-->
      <!--                                  store.h5Url-->
      <!--                                }static/images/index/recommend/item-game-${item.name.toLowerCase()}.png)`;-->
      <!--                              }-->
      <!--                            }-->
      <!--                          })()-->
      <!--                        }"-->
      <!--                      ></div>-->
      <!--                    </div>-->

      <!--                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>-->
      <!--                  </div>-->
      <!--                </swiper-slide>-->
      <!--              </template>-->
      <!--            </swiper>-->
      <!--          </div>-->

      <!--          <div class="platform-game-container grid-view" v-else>-->
      <!--            <template v-for="(item, index) in recommendList" :key="index">-->
      <!--              <div-->
      <!--                class="platform-game-item btn-effect"-->
      <!--                @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id)"-->
      <!--              >-->
      <!--                <div class="platform-game-img">-->
      <!--                  <div-->
      <!--                    class="game&#45;&#45;bg"-->
      <!--                    :style="{-->
      <!--                      backgroundImage: (() => {-->
      <!--                        try {-->
      <!--                          return `url(${require(`../assets/images/games/recommend/item-game-${item.code.toLowerCase()}.png`)})`;-->
      <!--                        } catch (e) {-->
      <!--                          try {-->
      <!--                            return `url(${imgURLGame}${item.icon})`;-->
      <!--                          } catch (e) {-->
      <!--                            return `url(${-->
      <!--                              store.h5Url-->
      <!--                            }static/images/index/recommend/item-game-${item.name.toLowerCase()}.png)`;-->
      <!--                          }-->
      <!--                        }-->
      <!--                      })()-->
      <!--                    }"-->
      <!--                  ></div>-->
      <!--                </div>-->
      <!--                <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>-->
      <!--              </div>-->
      <!--            </template>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->

      <template
        v-if="(category.title === 'Sport' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="sport">
          <div class="title-game">
            <span class="txt-style">Sports</span>
          </div>
          <div class="platform-game-container sport-platform">
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
          <div class="titles backgroundColor">Update Announcement</div>
        </div>
        <div class="contents">
          <template v-if="isOutdatedApp">
            Your App Version Is Outdated,
            <br />
            Please Update The App Now
          </template>
          <template v-else>New Version Detected, Do You Want To Update?</template>
        </div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate" v-if="!isOutdatedApp">Cancel</div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">Update Now</div>
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
              <q-input standout v-model="searchText" label="Search" clearable clear-icon="close">
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
              <div>Loading... Please wait...</div>
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
  <HomePopup ref="spinLuckyWheelPromoPopupRef" />
  <SpinLuckyWheelPromoSticky v-if="store.spinWheelLuckyPromoInfo?.status === 'IN_PROGRESS'" />
  <!-- Spin Lucky Wheel promo end -->
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch, onActivated, onBeforeUnmount } from "vue";
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
import ProfileSummary from "../components/ProfileSummary.vue";
import WithdrawalModal from "../components/modal/WithdrawalModal.vue";
import DepositComponent from "../components/depositComponent.vue";
import KYCGuestForm from "../components/KYCGuestForm.vue";
import KYCUserForm from "../components/KYCUserForm.vue";
import HomePopup from "src/components/hotpromo/spin-lucky-wheel/HomePopup.vue";
import SpinLuckyWheelPromoSticky from "src/components/hotpromo/spin-lucky-wheel/PromoSticky.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
// import { ref, onMounted, onUnmounted } from 'vue';
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { useLocalStorage } from "@vueuse/core";
// Import Swiper modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper/core";
// import SwiperCore, { Scrollbar, Navigation, Pagination, EffectCoverflow } from "swiper";
// Use ref to hold the modules
const modules = ref([Scrollbar, Navigation, Pagination]);
const gameModules = ref([Scrollbar, Navigation, Pagination]);

const categoriesList = ref([]);
const catSwiper = ref(null);

const handleCatSwiper = (swiper) => (catSwiper.value = swiper);

const activateSlide = (clickedItem, index) => {
  categoriesList.value.forEach((item) => {
    item.active = item === clickedItem;
  });
  if (catSwiper.value) {
    catSwiper.value.slideTo(index);
  }
};

const csDragPos = ref([10, 0]);
const isDraggingCsIcon = ref(false);

const slide = ref(0);

const isFirstView = ref(false);
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
    sequence: 0
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
    alias: "Evolution",
    sequence: 0
  },
  {
    id: 103,
    name: "WCPT",
    code: "WCPT",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "PlayTech",
    sequence: 901
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
    alias: "Ezugi",
    sequence: 902
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
    sequence: 1000
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
    sequence: 1000
  },
  {
    id: 100,
    name: "WCOT",
    code: "WCOT",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
  },
  {
    id: 99,
    name: "WCAG",
    code: "WCAG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
  },
  {
    id: 98,
    name: "WCBG",
    code: "WCBG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
  }
]);
const poker = ref([]);
const lottery = ref([]);
const slot = ref([
  {
    id: 124,
    name: "Turbo",
    code: "Turbo",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 890
  },
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
    alias: "PG",
    sequence: 900
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
    alias: "JDB",
    sequence: 901
  },
  {
    id: 8,
    name: "JiliGames",
    code: "JILI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "JiliGames",
    sequence: 902
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
  },
  {
    id: 119,
    name: "PT",
    code: "WCPTS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
  },
  {
    id: 115,
    name: "Playson",
    code: "WCPS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
  },
  {
    id: 114,
    name: "BNG",
    code: "WCBNG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
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
    sequence: 1000
  },
  {
    id: 112,
    name: "Quick Spin",
    code: "WCQS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 1000
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
    alias: "JOKER",
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    sequence: 1000
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
    id: 116,
    name: "Super Ace",
    code: "49",
    status: "OPEN",
    icon: "5/JILI/49.png",
    sequence: 1,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 117,
    name: "Golden Empire",
    code: "103",
    status: "OPEN",
    icon: "5/JILI/103.png",
    sequence: 3,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 157,
    name: "Fortune Gems 2",
    code: "223",
    status: "OPEN",
    icon: "16/JILI/7a390a37-8613-47c5-93af-fda8491bd021.png",
    sequence: 4,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 118,
    name: "Fortune Gems",
    code: "109",
    status: "OPEN",
    icon: "5/JILI/109.png",
    sequence: 5,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 119,
    name: "Chinese New Year 2",
    code: "22041",
    status: "OPEN",
    icon: "16/FC/22041.png",
    sequence: 10,
    siteName: null,
    platformId: 36,
    platformName: "FC",
    platformCode: "FC",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "FC"
  },
  {
    id: 120,
    name: "Sweet Bonanza 1000",
    code: "vs20fruitswx",
    status: "OPEN",
    icon: "14/PP/vs20fruitswx.png",
    sequence: 11,
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
    id: 121,
    name: "Lucky Fortunes",
    code: "22040",
    status: "OPEN",
    icon: "16/FC/22040.png",
    sequence: 12,
    siteName: null,
    platformId: 36,
    platformName: "FC",
    platformCode: "FC",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "FC"
  },
  {
    id: 122,
    name: "Gates of Olympus 1000",
    code: "vs20olympx",
    status: "OPEN",
    icon: "14/PP/vs20olympx.png",
    sequence: 13,
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
    id: 123,
    name: "Sweet Bonanza",
    code: "vs20fruitsw",
    status: "OPEN",
    icon: "14/PP/vs20fruitsw.png",
    sequence: 14,
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
    id: 124,
    name: "Sugar Rush 1000",
    code: "vs20sugarrushx",
    status: "OPEN",
    icon: "14/PP/vs20sugarrushx.png",
    sequence: 17,
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
    id: 125,
    name: "Starlight Princess 1000",
    code: "vs20starlightx",
    status: "OPEN",
    icon: "14/PP/vs20starlightx.png",
    sequence: 20,
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
    id: 126,
    name: "Chinese New Year",
    code: "22020",
    status: "OPEN",
    icon: "16/FC/22020.png",
    sequence: 21,
    siteName: null,
    platformId: 36,
    platformName: "FC",
    platformCode: "FC",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "FC"
  },
  {
    id: 127,
    name: "Night Market",
    code: "22018",
    status: "OPEN",
    icon: "16/FC/22018.png",
    sequence: 22,
    siteName: null,
    platformId: 36,
    platformName: "FC",
    platformCode: "FC",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "FC"
  },
  {
    id: 129,
    name: "FRUITY BONANZA",
    code: "14085",
    status: "OPEN",
    icon: "13/JDB/14085.png",
    sequence: 24,
    siteName: null,
    platformId: 31,
    platformName: "JDB",
    platformCode: "JDB",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JDB"
  },
  {
    id: 130,
    name: "Coin Volcano",
    code: "WCBNG_185",
    status: "OPEN",
    icon: "5/WCBNG/185.png",
    sequence: 27,
    siteName: null,
    platformId: 114,
    platformName: "BNG",
    platformCode: "WCBNG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "WCBNG"
  },
  {
    id: 131,
    name: "3 Hot Chillies",
    code: "WCBNG_197",
    status: "OPEN",
    icon: "5/WCBNG/197.png",
    sequence: 29,
    siteName: null,
    platformId: 114,
    platformName: "BNG",
    platformCode: "WCBNG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "WCBNG"
  },
  {
    id: 132,
    name: "OPEN SESAME MEGA",
    code: "14086",
    status: "OPEN",
    icon: "13/JDB/14086.png",
    sequence: 32,
    siteName: null,
    platformId: 31,
    platformName: "JDB",
    platformCode: "JDB",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JDB"
  },
  {
    id: 133,
    name: "777 Coins",
    code: "WCBNG_194",
    status: "OPEN",
    icon: "5/WCBNG/194.png",
    sequence: 33,
    siteName: null,
    platformId: 114,
    platformName: "BNG",
    platformCode: "WCBNG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "WCBNG"
  },
  {
    id: 134,
    name: "Aztec Fire 2",
    code: "WCBNG_207",
    status: "OPEN",
    icon: "5/WCBNG/207.png",
    sequence: 36,
    siteName: null,
    platformId: 114,
    platformName: "BNG",
    platformCode: "WCBNG",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "WCBNG"
  },
  {
    id: 135,
    name: "Money Tree",
    code: "208",
    status: "OPEN",
    icon: "16/CQ9/208.png",
    sequence: 39,
    siteName: null,
    platformId: 33,
    platformName: "CQ9",
    platformCode: "CQ9",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "CQ9"
  }
]);

const filteredHotGameList = computed(() => {
  if (searchText.value) {
    return hotGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  } else {
    return hotGameList.value;
  }
});

const recommendList = ref([]);
const loadRecommendGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_RECOMMEND_GAMES_${regDevice}`;
  const key2 = `MEMBER_RECOMMEND_${regDevice}`;

  var gameLists = [];
  var recommendlists = [];

  cached
    .get(key2, () =>
      api
        .get("/sitePlatformAndGamesByLabel", {
          params: {
            gameLabel: "RECOMMEND",
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
      recommendlists = res;
      recommendList.value = res;

      // cached
      cached
        .get(key, () =>
          api
            .get("/platformGamesByLabelV1", {
              params: {
                gameLabel: "RECOMMEND",
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
          recommendlists = res;
          recommendList.value = res;
        });
    });
};

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

          console.log("End");
          isHotGameLoading.value = false;
        });
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
    id: 9765,
    name: "Dragon Fishing",
    code: "7001",
    status: "OPEN",
    icon: "5/JDB/7001.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9766,
    name: "Dragon Fishing II",
    code: "7002",
    status: "OPEN",
    icon: "5/JDB/7002.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9767,
    name: "Cai Shen Fishing",
    code: "7003",
    status: "OPEN",
    icon: "5/JDB/7003.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9768,
    name: "Shade Dragons Fishing",
    code: "7004",
    status: "OPEN",
    icon: "5/JDB/7004.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9769,
    name: "Fishing YiLuFa",
    code: "7005",
    status: "OPEN",
    icon: "5/JDB/7005.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9770,
    name: "Dragon Master",
    code: "7006",
    status: "OPEN",
    icon: "5/JDB/7006.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
  },
  {
    id: 9771,
    name: "Fishing Disco",
    code: "7007",
    status: "OPEN",
    icon: "5/JDB/7007.png",
    sequence: 1000,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "admin",
    updateTime: "1/5/24, 5:18 PM"
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

      console.log("JSD");
      console.log(JSON.stringify(fishGameJDBList.value));
    });
};

const isShowAllHotGames = ref(false);
const scrollDownHotGames = () => {
  isShowAllHotGames.value = true;
};

const isShowAllFullGames = ref(false);
const scrollDownFullGames = () => {
  isShowAllFullGames.value = true;
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
      console.log("After");
      console.log(sport.value);
      loadHotGameList();
      loadRecommendGameList();
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
  const urlPattern = /^\/url\/(.*)/;
  const platformPattern = /^\/platform\/(.*)/;
  const gamePattern = /^\/game\/(.*)/;
  const openPattern = /^\/open\/(.*)/;
  const openGamePattern = /^\/openGame\/(.*)/;

  if (banner.redirectUrl.match(urlPattern)) {
    const extractedUrl = banner.redirectUrl.match(urlPattern)[1];
    router.push(`${extractedUrl}`);
  } else if (banner.redirectUrl.match(platformPattern)) {
    const extractedUrl = banner.redirectUrl.match(platformPattern)[1];

    if (extractedUrl === "SABA") {
      // gameName: SABA platformCode: SABA gameCode:  gameStatus: OPEN gameType: SPORT gameId: 50
      playGame(extractedUrl, extractedUrl, "", "OPEN", "SPORT", "50");
    } else if (extractedUrl === "Evo") {
      // gameName: Evo platformCode: Evo gameCode:  gameStatus: OPEN gameType: LIVE gameId: 2
      playGame(extractedUrl, extractedUrl, "", "OPEN", "LIVE", "2");
    } else if (extractedUrl === "JILI") {
      // gameName: JiliGames platformCode: JILI gameCode:  gameStatus: OPEN gameType: SLOT gameId: 8
      openGame(extractedUrl, extractedUrl, "", "OPEN", "SLOT", "8");
    }
  } else if (banner.redirectUrl.match(gamePattern)) {
    const extractedUrl = banner.redirectUrl.match(gamePattern)[1];
    switch (extractedUrl) {
      case "spribe/aviator":
        // gameName: Aviator platformCode: Spribe gameCode: aviator gameStatus: OPEN gameType: CASUAL gameId: 9568
        playGame("Aviator", "Spribe", "aviator", "CASUAL", "LIVE", "9568");
      default:
        return null;
    }
  } else if (banner.redirectUrl.match(openPattern)) {
    const extractedUrl = banner.redirectUrl.match(openPattern)[1];
    const [gameName, platformCode, gameCode, gameStatus, gameType, gameId] = extractedUrl.split("/");
    playGame(gameName, platformCode, gameCode, gameStatus, gameType, gameId);
  } else if (banner.redirectUrl.match(openGamePattern)) {
    const extractedUrl = banner.redirectUrl.match(openGamePattern)[1];
    const queryString = extractedUrl.replace("/openGame/", "");
    const params = new URLSearchParams(queryString);
    const gameName = params.get("gameName");
    const platformCode = params.get("platformCode");
    const gameStatus = params.get("gameStatus");
    const gameType = params.get("gameType");
    const gameId = params.get("gameId");
    openGame(gameName, platformCode, "", gameStatus, gameType, gameId);
  } else if (banner.redirectUrl.slice(0, 4) === "http") {
    window.open(banner.redirectUrl, "_blank");
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
    return require(`../assets/images/banners/${bannerImg}`);
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

const spinLuckyWheelPromoPopupRef = ref();
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
  OneSignal.initialize("4366d12e-fccb-490d-b83d-d6aa019230f1");

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

const loadAppTabs = () => {
  const localStorageKey = "appTabs";
  const savedTabs = JSON.parse(localStorage.getItem(localStorageKey));
  if (savedTabs && savedTabs.length > 0) {
    categoriesList.value = savedTabs;
    categoriesList.value.forEach((tab, index) => {
      tab.active = index === 0;
    });
  } else {
    categoriesList.value = [
      { title: "Hot", icon: "hot", active: true },
      { title: "Lobby", icon: "lobby", active: false },
      { title: "Slot", icon: "slot", active: false },
      { title: "Casino", icon: "casino", active: false },
      // { title: "Fishing", icon: "fishing", active: false },
      { title: "Sport", icon: "sport", active: false }
    ];
  }

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

const transformTitle = (title) => {
  return title === "Fishing" ? "Minigames" : title;
};

const hbDragPos = ref([10, 120]);
const isHbShow = ref(true);
const hbSlide = ref(0);
const hbPromo = ref([]);

const checkSpinLuckyWheelPromo = async () => {
  if (store.token) {
    const res = await eventapi.post("/refer-spin/check");
    if(res.code === 0){
      store.spinWheelLuckyPromoInfo = { ...store.spinWheelLuckyPromoInfo, ...res.data };
    }

  }

  if (sessionStorage.getItem("isReload")) {
    sessionStorage.removeItem("isReload");
    sessionStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
  }

  if (!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
    spinLuckyWheelPromoPopupRef.value.checkIsCanShowPopup();
  }
};

const checkHbPromo = () => {
  api
    .get("/redirect")
    .then((res) => {
      return res;
    })
    .then((data) => {
      hbPromo.value = data.data;
    });
};

const gotoFloatPromo = (val) => {
  if (val.type === "PROMO") {
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

onActivated(() => {
  store.getUnreadTotal();
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
  loadCustomerAddress();
  checkHbPromo();
  checkSpinLuckyWheelPromo();

  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

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
    background: #2d0c5a;
    gap: 10px;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;

    .volume {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 28px;
      width: 28px;
    }

    .filter-purple {
      filter: brightness(0) saturate(100%) invert(30%) sepia(17%) saturate(1379%) hue-rotate(223deg) brightness(98%)
        contrast(96%);
    }

    .marquee-container {
      width: calc(100% - 28px);
    }

    span {
      margin-right: 10px;
      cursor: pointer;
      color: #bacef1;
      font-weight: light;
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
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 10px;
  overflow-y: auto;

  .q-tab__label {
    font-size: 18px;
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
  width: 70px;
  height: 76px;
  background: url("../assets/images/index/icon-cs.png") no-repeat center center;
  background-size: contain;
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
    background-image: url("../assets/images/index/title-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;

    .txt-style {
      font-family: "Dongle", sans-serif;
      font-size: 2.6rem;
      font-weight: 700;
      letter-spacing: 1px;
      line-height: 1;
      text-transform: uppercase;
      color: #ffffff;
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

.platform-game-container {
  display: grid;
  padding-top: 12px;
  margin-bottom: 12px;
  column-gap: 8px;
  row-gap: 16px;
  padding-bottom: 10px;

  &.live-casino {
    padding-top: 8px;
    margin-bottom: 0px;
  }

  .swiper-scrollbar.swiper-scrollbar-horizontal {
    bottom: 0px;
    background: rgba(43, 55, 74, 0.6);
    padding: 2px;
    height: 10px;
  }

  .swiper-scrollbar-drag {
    background: rgba(255, 255, 255, 0.4);
  }

  &.grid-view {
    display: grid;
    grid-template-columns: repeat(3, 32%);
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

  .q-carousel__slide {
    height: 100px !important;
    width: 100px;
    padding: 0px;
  }

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
    max-width: 70px;
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
    padding: 2px;
    height: 10px;
  }

  .swiper-scrollbar-drag {
    background: rgba(255, 255, 255, 0.4);
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
  background: #2b374a;
  // min-width: 80px;
  width: 80px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding-top: 3px;
  transition: 0.3s all;
  width: 100%;

  &.active {
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);

    .cat-title {
      color: #ffffff;
    }
  }

  &:hover {
    filter: brightness(1.2);
  }

  .cat-icon {
    img {
      display: block;
      width: 100%;
      max-width: 28px;
    }
  }

  .cat-title {
    font-size: 12px;
    font-weight: bold;
    color: #bfc3c9;
    font-family: "Poppins", sans-serif;
    letter-spacing: 0.5px;
  }
}

.platform-game-img {
  // background-color: #cccccc;
  width: 100%;
  aspect-ratio: 1/1.2;
  background-size: cover;
  background-position: center center;
  position: relative;
  background-image: url("../assets/images/index/mini-game-bg.png");
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
}

.btn-more-games {
  display: flex;
  justify-content: center;
  margin: auto;
  border: 2px solid #8b36f8;
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
</style>

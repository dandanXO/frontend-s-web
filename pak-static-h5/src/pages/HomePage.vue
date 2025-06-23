<template>
  <div
    :style="`background:linear-gradient(to bottom, ${bannerColors[slide]}, rgba(35,39,38,1)`"
    style="transition: background 0.5s ease-in-out"
    class="dynamic-bg"
  >
    <ProfileSummary :homeProfile="true" @activateSlide="handleActivateSlide" @showNewPlayer="showNewPlayer" />

    <!--    <pre>-->
    <!--      {{isNewPlayerModal}} <br/>-->
    <!--      {{currentStep !== "END"}}<br/>-->
    <!--      {{!isHotGameAdditionalSteps}}<br/>-->
    <!--      {{!isAdditionalDepositSteps}}<br/>-->
    <!--      {{!isAdditionalReferSteps}}<br/>-->
    <!--     {{!isAdditionalWithdrawSteps}} <br/>-->
    <!--    </pre>-->

    <q-carousel
      v-model="slide"
      id="home"
      class="home"
      transition-next="slide-left"
      transition-prev="slide-right"
      animated
      autoplay
      infinite
      navigation
      swipeable
    >
      <q-carousel-slide
        v-for="(banner, i) in banners"
        :key="i"
        :name="i"
        class="column no-wrap flex-center banner-slide"
        :img-src="returnBannerUrl(banner)"
        @click="gotoPromo(banner)"
      ></q-carousel-slide>

      <!-- :img-src="require(`../assets/images/index/${banner.mobileImageUrl}`)" -->

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
            background-color: #7edb5c;
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
            width: 3px;
            padding: 0;
            background-color: rgba(255, 255, 255, 0.2);
          "
        />
      </template>
    </q-carousel>

    <!-- <pre>
    banners--{{ banners }}
    banners--{{ bannerColors }}
    gradientStyle--{{ gradientStyle }}
    slide--{{ bannerColors[slide] }}
    </pre> -->
  </div>
  <div>
    <!--    <q-page-sticky v-if="isCharityShow && isShowStickyIcons" position="bottom-right" :offset="charityDragPos" class="floating-btn scalable" :style="{ transform: `scale(${scaleValue})` }">-->
    <!--      <div v-touch-pan.prevent.mouse="moveCharityGif" @click="openCharityUrl">-->
    <!--        &lt;!&ndash;        <div class="hb-close">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <q-btn dense rounded icon="close" class="bg-grey text-black" size="sm" @click.stop="isCharityShow = false" />&ndash;&gt;-->
    <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--        <img class="charity-gif" src="../assets/images/index/charity-float.gif" />-->
    <!--      </div>-->
    <!--    </q-page-sticky>-->
  </div>
  <div class="home-wrapper" :class="detectAndroidVersion()">
    <q-page-sticky
      v-if="isShowStickyIcons"
      style="z-index: 3000"
      position="bottom-right"
      :offset="csDragPos"
      class="floating-btn scalable"
      :style="{ transform: `scale(${scaleValue})` }"
    >
      <a v-touch-pan.prevent.mouse="moveCsIcon" ref="csTabRef" :href="ui.CSAUrl" target="_blank">
        <div class="cs-icon-wrapper" :class="{ active: isCsTabVisible }">
          <a class="cs-icon youtube" :href="ui.youtubeUrl" target="_blank">
            <img src="../assets/images/index/youtube-icon.png" />
          </a>
          <a class="cs-icon tiktok" :href="ui.instagramUrl" target="_blank">
            <img src="../assets/images/index/insta-icon.png" />
          </a>
          <!--          <a class="cs-icon tiktok" href="https://www.tiktok.com/@b9game" target="_blank">-->
          <!--            <img src="../assets/images/index/cs-tiktok.png" />-->
          <!--          </a>-->
          <a class="cs-icon whatsapp" :href="ui.whatsappUrl" target="_blank">
            <img src="../assets/images/index/cs-whatsapp.png" />
          </a>
          <a class="cs-icon cs" :href="ui.CSAUrl" target="_blank">
            <img src="../assets/images/index/cs-cs.png" />
          </a>
        </div>
      </a>
    </q-page-sticky>

    <q-page-sticky
      position="bottom-right"
      :offset="liveDragPos"
      class="floating-btn scalable"
      :style="{ transform: `scale(${scaleValue})` }"
      v-if="isLiveUrlShow && isShowStickyIcons"
    >
      <div v-touch-pan.prevent.mouse="moveLiveIcon" @click="openLiveInNewTab(ui.LiveUrl)">
        <div class="live-icon-wrapper"></div>
      </div>
    </q-page-sticky>

    <q-page-sticky
      position="bottom-right"
      :offset="hbDragPos"
      class="floating-btn scalable"
      :style="{ transform: `scale(${scaleValue})` }"
      v-if="isHbShow && isShowStickyIcons"
    >
      <div>
        <!--        <div class="hb-close">-->
        <!--          <q-btn dense rounded icon="close" class="bg-grey text-black" size="sm" @click="isHbShow = false" />-->
        <!--        </div>-->
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
              <!-- <img style="width: 100px" :src="`${imgURL}/promo/${promo.icon}`" /> -->
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
    <q-page-sticky
      @click="isShowStickyIcons = !isShowStickyIcons"
      position="bottom-right"
      :offset="[0, 400]"
      class="floating-btn scalable whitee"
      :style="{ transform: `scale(${scaleValue})` }"
    >
      <img class="stickyopenclose" :class="{ open: !isShowStickyIcons }" src="../assets/images/index/open.png" />
    </q-page-sticky>

    <PushNotification
      :pushNotificationData="pushNotificationData"
      v-if="Platform.is.android && Platform.is.capacitor"
    />

    <div class="notice-outer">
      <div class="midd">
        <div class="station-notice-wrapper">
          <div class="volume">
            <img src="../assets/images/index/icon-volume.svg" />
          </div>
          <!-- <div class="marquee-container">
            <marquee-text :repeat="5" :vertical="false" :duration="announcementList.length * 500">
              <div v-if="announcementList">
                <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                  {{ a.content }}
                </span>
              </div>
            </marquee-text>
          </div> -->
          <div class="marquee-container">
            <div class="new-icon" :class="{ show: hasNewAnnouncements }">
              <img src="../assets/images/index/icon-new.png" />
            </div>
            <div :key="currentAnnouncement?.title" class="marquee-text" @click="openPopup(currentAnnouncement)">
              {{ currentAnnouncement?.title }}
            </div>
          </div>
        </div>
      </div>
      <a class="notice-download" :href="ui.whatsappUrl" target="_blank">
        <img src="../assets/images/auth/whatsapp-icon-side.png" />
        <img class="absolute-hot" src="../assets/images/index/hot.gif" />
      </a>
    </div>
    <!-- <div class="top-action" v-if="store.hasToken()">
      <q-btn class="action-btn action-btn--withdrawal" @click="onWithdrawalClick()" no-caps label="Withdrawal"></q-btn>
      <q-btn class="action-btn action-btn--deposit" @click="openDepositDialog()" no-caps label="Deposit" />
    </div>
    <div v-else class="top-action">
      <q-btn class="action-btn action-btn--withdrawal" @click="gotoSignIn()" no-caps label="Sign In"></q-btn>
      <q-btn class="action-btn action-btn--deposit" @click="gotoSignUp()" no-caps label="Sign Up" />
    </div> -->
    <!-- <div class="hometop-categories">
      <template v-for="(item, index) in translatedCategoriesList" :key="index">
        <div v-if="item.icon !== 'lobby'" class="category" @click="activateSlide(item)" :style="{ backgroundImage: `url(${getImageUrl(item.icon)})` }">
          <div class="cat-label">
          {{ item.label }}
        </div>
        </div>
      </template>
    </div> -->
    <swiper
      :slidesPerView="4"
      :slidesPerGroup="4"
      :spaceBetween="10"
      :modules="[Navigation, Grid]"
      class="hometop-categories"
    >
      <template v-for="(item, index) in translatedCategoriesList" :key="index">
        <template v-if="item.icon !== 'lobby'">
          <swiper-slide @click="activateSlide(item)">
            <div class="category">
              <img :src="`${getImageUrl(item.icon)}`" />
              <div class="cat-label">
                {{ item.label }}
              </div>
            </div>
          </swiper-slide>
        </template>
      </template>
    </swiper>
    <!--
    <swiper
      :slidesPerView="5"
      :spaceBetween="0"
      :scrollbar="{
        hide: true
      }"
      :navigation="true"
      :modules="modules"
      class="cat-selection-wrapper"
      :data-aos-delay="200"
      data-aos-duration="1000"
      data-aos-once="true"
    >
      <template v-for="(item, index) in translatedCategoriesList" :key="index">
        <swiper-slide>
          <div class="cat-selection-item" :class="item.active && 'active'" @click="activateSlide(item)">
            <div class="cat-icon">
              <img :src="require(`../assets/images/index/category/cat-${item.icon.toLowerCase()}.png`)" alt="" />
            </div>
            <div class="cat-title">{{ item.label }}</div>
          </div>
        </swiper-slide>
      </template>

      <swiper-slide>
        <!- <div class="cat-selection-item"></div> ->
      </swiper-slide>
    </swiper> -->

    <!-- <pre>hotGameList{{ hotGameList }}</pre> -->
    <!-- <pre>pokerGameJILIList--{{ pokerGameJILIList }}</pre> -->

    <div v-if="showOverlay" class="highlight-overlay">
      <div class="highlight-box" @click="handleGamePlay"></div>
      <div class="next-btm-btn" @click="updateCurrentStep('3')">{{ $t("playerGuide.next") }}</div>
      <div class="videolink" @click="playVideo()">
        <img src="../assets/images/newplayerguide/video.png" />
        {{ $t("playerGuide.watchGameTutorial") }}
      </div>
    </div>
    <div ref="targetSection" class="target-section">
      <!-- The section to scroll to -->
    </div>
    <template v-for="category in categoriesList" :key="category.title">
      <template v-if="(category.title === 'Hot' && category.active) || (category.title === 'Lobby' && category.active)">
        <div class="games-selection-wrapper" id="hotgames">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-hotgames.png" class="label-img" /> -->
            <img src="../assets/images/index/menu-label-icon-hotgames.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_hotgames") }}</div>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div class="all-btn" @click="handleActivateSlide('Hot')">
                {{ $t("home.menu_all") }}
                <img src="../assets/images/account/rgtarrow.svg" />
              </div>
              <div :class="`custom-hot-prev`"><img src="../assets/images/account/rgtarrow.svg" /></div>
              <div :class="`custom-hot-next`"><img src="../assets/images/account/rgtarrow.svg" /></div>
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
              class="platform-game-container"
            >
              <template v-for="(item, index) in hotGameList" :key="index">
                <template v-if="item.type && item.type === 'game'">
                  <swiper-slide
                    class="platform-game-item btn-effect"
                    @click="
                      playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id, item.demo)
                    "
                  >
                    <div>
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/index/hot/item-game-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png`)})`;
                              } catch (e) {
                                try {
                                  return `url(${imgURLGame}${item.icon})`;
                                } catch (e) {
                                  return `url(https://m.b9mega1.com/static/images/index/hot/item-game-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png)`;
                                }
                              }
                            })()
                          }"
                        ></div>

                        <div
                          v-if="
                            index < 4 ||
                            item.code === 'Evo' ||
                            item.code === 'WCEvo' ||
                            item.code === '51' ||
                            item.code === '72' ||
                            item.code === '163' ||
                            item.code === '123'
                          "
                          class="burning-hot"
                        >
                          <img src="../assets/images/index/hot.png" />
                        </div>
                      </div>
                      <div class="platform-game-title">{{ truncateText(item.platform, 22) }}</div>
                    </div>
                  </swiper-slide>
                </template>
                <template v-else>
                  <swiper-slide
                    class="platform-game-item btn-effect"
                    @click="playGame(item.name, item.code, '', 'OPEN', 'LIVE', item.demo)"
                  >
                    <div>
                      <div class="platform-game-img">
                        <div
                          class="game--bg"
                          :style="{
                            backgroundImage: (() => {
                              try {
                                return `url(${require(`../assets/images/index/hot/item-game-${item.code.toLowerCase()}.png`)})`;
                              } catch (e) {
                                try {
                                  return `url(${imgURLGame}${item.icon})`;
                                } catch (e) {
                                  return `url(https://m.b9mega1.com/static/images/index/hot/item-game-${item.code.toLowerCase()}.png)`;
                                }
                              }
                            })()
                          }"
                        ></div>

                        <div v-if="index < 4 || item.code === 'Evo' || item.code === 'WCEvo'" class="burning-hot">
                          <img src="../assets/images/index/hot.png" />
                        </div>
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
            <div class="platform-game-container grid-view">
              <template v-for="(item, index) in hotGameList" :key="index">
                <template v-if="item.type && item.type === 'game'">
                  <div
                    class="platform-game-item btn-effect"
                    @click="
                      playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id, item.demo)
                    "
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/hot/item-game-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(https://m.b9mega1.com/static/images/index/hot/item-game-${item.platform.toLowerCase()}-${item.code.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>

                      <div
                        v-if="
                          index < 4 ||
                          item.code === 'Evo' ||
                          item.code === 'WCEvo' ||
                          item.code === '51' ||
                          item.code === '72' ||
                          item.code === '163' ||
                          item.code === '123'
                        "
                        class="burning-hot"
                      >
                        <img src="../assets/images/index/hot.png" />
                      </div>
                    </div>
                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </template>

                <template v-else>
                  <div
                    class="platform-game-item btn-effect"
                    @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id, item.demo)"
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/hot/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(https://m.b9mega1.com/static/images/index/hot/item-game-${item.code.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>

                      <div v-if="item.code === 'Evo' || item.code === 'WCEvo'" class="burning-hot">
                        <img src="../assets/images/index/hot.png" />
                      </div>
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
        v-if="(category.title === 'Live' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="Live">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-livecasino.png" class="label-img" /> -->
            <!-- <span class="txt-style">Live Casino</span> -->
            <img src="../assets/images/index/menu-label-icon-livecasino.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_livecasino") }}</div>
            <div v-if="category.title === 'Lobby' && category.active">
              <div class="all-btn" @click="handleActivateSlide('Live')">
                {{ $t("home.menu_all") }}
                <img src="../assets/images/account/rgtarrow.svg" />
              </div>
              <div :class="`custom-live-prev`"><img src="../assets/images/account/rgtarrow.svg" /></div>
              <div :class="`custom-live-next`"><img src="../assets/images/account/rgtarrow.svg" /></div>
            </div>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="2"
              :spaceBetween="15"
              :modules="[Navigation]"
              :navigation="{ nextEl: '.custom-live-next', prevEl: '.custom-live-prev' }"
              class="platform-game-container live-casino"
            >
              <template v-for="(item, index) in livecasino" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id, item.demo)"
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#hotgames"
                  >
                    <img src="../assets/images/index/live/item-game-maintenance.png" />
                    <div
                      class="platform-live-item--img"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/index/live/item-game-${item.name.toLowerCase()}.png`)})`;
                          } catch (e) {
                            return `url(https://m.b9mega1.com/static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                          }
                        })()
                      }"
                    >
                      <div
                        v-if="
                          item.name === 'Evo' || item.name === 'WCEvo' || item.name === 'PP' || item.name === 'WCPP'
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
            <div class="platform-game-container">
              <template v-for="(item, index) in livecasino" :key="index">
                <div
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id, item.demo)"
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
                            return `url(https://m.b9mega1.com/static/images/index/live/item-game-${item.name.toLowerCase()}.png)`;
                          }
                        })()
                      }"
                    >
                      <div
                        v-if="
                          item.name === 'Evo' || item.name === 'WCEvo' || item.name === 'PP' || item.name === 'WCPP'
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
        v-if="(category.title === 'Slot' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="Slot">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-slotgame.png" class="label-img" /> -->
            <!-- <img src="../assets/images/index/slots-games-icon-label.png" /> -->
            <!-- <span class="txt-style">Slots Games</span> -->
            <img src="../assets/images/index/menu-label-icon-slotsgame.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_slotsgame") }}</div>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div class="all-btn" @click="handleActivateSlide('Slot')">
                {{ $t("home.menu_all") }}
                <img src="../assets/images/account/rgtarrow.svg" />
              </div>
              <div :class="`custom-slot-prev`"><img src="../assets/images/account/rgtarrow.svg" /></div>
              <div :class="`custom-slot-next`"><img src="../assets/images/account/rgtarrow.svg" /></div>
            </div>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="4"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 1, fill: 'row' }"
              :navigation="{ nextEl: '.custom-slot-next', prevEl: '.custom-slot-prev' }"
              class="platform-game-container"
            >
              <template v-for="(item, index) in slot" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="
                    openGame(
                      item.name,
                      item.code,
                      '',
                      item.status,
                      item.gameType === 'CASUAL' ? 'CASUAL' : 'SLOT',
                      item.id
                    )
                  "
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#slotsgames"
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/slot/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              return `url(https://m.b9mega1.com/static/images/index/slot/item-game-${item.code.toLowerCase()}.png)`;
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div v-if="index < 2" class="burning-hot">
                      <img src="../assets/images/index/hot.png" />
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.alias ? item.alias : item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>
            </swiper>
          </div>

          <div class="platform-game-wrapper" v-else>
            <div
              :slidesPerView="4"
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
                  @click="
                    openGame(
                      item.name,
                      item.code,
                      '',
                      item.status,
                      item.gameType === 'CASUAL' ? 'CASUAL' : 'SLOT',
                      item.id
                    )
                  "
                >
                  <div class="platform-game-img">
                    <div
                      class="game--bg"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/index/slot/item-game-${item.code.toLowerCase()}.png`)})`;
                          } catch (e) {
                            return `url(https://m.b9mega1.com/static/images/index/slot/item-game-${item.code.toLowerCase()}.png)`;
                          }
                        })()
                      }"
                    ></div>
                  </div>

                  <div v-if="index < 2" class="burning-hot">
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
        v-if="(category.title === 'Fish' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="Fish" v-if="category.title === 'Lobby' && category.active">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-fishing.png" class="label-img" /> -->
            <!-- <img src="../assets/images/index/fishing-icon-label.png" /> -->
            <!-- <span class="txt-style">Fishing</span> -->
            <img src="../assets/images/index/menu-label-icon-fishing.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_fishing") }}</div>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div class="all-btn" @click="handleActivateSlide('Fish')">
                {{ $t("home.menu_all") }}
                <img src="../assets/images/account/rgtarrow.svg" />
              </div>
              <div :class="`custom-fish-prev`"><img src="../assets/images/account/rgtarrow.svg" /></div>
              <div :class="`custom-fish-next`"><img src="../assets/images/account/rgtarrow.svg" /></div>
            </div>
          </div>

          <div class="platform-game-wrapper">
            <swiper
              :slidesPerView="4"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 1, fill: 'row' }"
              :navigation="{ nextEl: '.custom-fish-next', prevEl: '.custom-fish-prev' }"
              class="platform-game-container"
            >
              <template v-for="(item, index) in fishGameJILIList" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JILI', item.code, item.status, item.gameType, item.id, item.demo)"
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#home"
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/fish/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(https://m.b9mega1.com/static/images/index/fish/item-game-${item.code.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>

                      <div v-if="index < 1" class="burning-hot">
                        <img src="../assets/images/index/hot.png" />
                      </div>
                    </div>
                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>

              <template v-for="(item, index) in fishGameJDBList" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JDB', item.code, item.status, item.gameType, item.id, item.demo)"
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#home"
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/fish/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(https://m.b9mega1.com/static/images/index/fish/item-game-${item.code.toLowerCase()}.png)`;
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

            <!-- <div class="platform-game-container sport-platform">
              <template v-for="(item, index) in fishing" :key="index">
                <div
                  class="platform-game-item btn-effect"
                  v-if="item.name !== 'JOKER'"
                  @click="openGame(item.name, item.code, '', item.status, 'FISH', item.id)"
                  data-aos="zoom-in"
                  :data-aos-delay="100 * index"
                  data-aos-duration="1200"
                  data-aos-once="true"
                  data-aos-anchor="#slotsgames"
                  data-aos-offset="300"
                >
                  <img src="../assets/images/index/fish/item-game-maintenance.png" />
                  <div
                    class="platform-game-item--img"
                    :style="{
                      backgroundImage: (() => {
                        try {
                          return `url(${require(`../assets/images/index/fish/item-game-${item.name.toLowerCase()}.png`)})`;
                        } catch (e) {
                          return '';
                        }
                      })()
                    }"
                  ></div>
                </div>
              </template>
            </div> -->

            <!-- <swiper
              :slidesPerView="3.5"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container"
            >
              <template v-for="(item, index) in fishing" :key="index">
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="openGame(item.name, item.code, '', item.status, 'SLOT', item.id)"
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#slotsgames"
                  >
                    <div class="platform-game-img">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: `url(${require(`../assets/images/index/fish/item-game-${item.name.toLowerCase()}.png`)})`
                        }"
                      ></div>
                    </div>

                    <div v-if="item.name === 'JOKER'" class="burning-hot">
                      <img src="../assets/images/index/hot.png" />
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                  </div>
                </swiper-slide>
              </template>
            </swiper> -->
          </div>

          <!-- <div class="platform-game-wrapper" v-else>
            <div
              :slidesPerView="3.5"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container grid-view"
            >
              <template v-for="(item, index) in fishing" :key="index">
                <div
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, item.platformCode, item.code, item.status, item.gameType, item.id, item.demo)"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-duration="1200"
                  data-aos-once="true"
                >
                  <div class="platform-game-img">
                    <div
                      class="game--bg"
                      :style="{
                        backgroundImage: `url(${require(`../assets/images/index/fish/item-game-${item.name.toLowerCase()}.png`)})`
                      }"
                    ></div>
                  </div>

                  <div v-if="item.name === 'JOKER'" class="burning-hot">
                    <img src="../assets/images/index/hot.png" />
                  </div>

                  <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
                </div>
              </template>
            </div>
          </div> -->
        </div>

        <div class="games-selection-wrapper" id="fishing" v-else>
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-fishing.png" class="label-img" /> -->
            <img src="../assets/images/index/menu-label-icon-fishing.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_fishing") }}</div>
          </div>

          <div class="platform-game-container grid-view">
            <template v-for="(item, index) in fishGameJILIList" :key="index">
              <div
                class="platform-game-item btn-effect"
                @click="playGame(item.name, 'JILI', item.code, item.status, item.gameType, item.id, item.demo)"
              >
                <div class="platform-game-img">
                  <div
                    class="game--bg"
                    :style="{
                      backgroundImage: (() => {
                        try {
                          return `url(${require(`../assets/images/index/fish/item-game-${item.code.toLowerCase()}.png`)})`;
                        } catch (e) {
                          try {
                            return `url(${imgURLGame}${item.icon})`;
                          } catch (e) {
                            return `url(https://m.b9mega1.com/static/images/index/fish/item-game-${item.code.toLowerCase()}.png)`;
                          }
                        }
                      })()
                    }"
                  ></div>

                  <div v-if="index < 1" class="burning-hot">
                    <img src="../assets/images/index/hot.png" />
                  </div>
                </div>
                <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
              </div>
            </template>

            <template v-for="(item, index) in fishGameJDBList" :key="index">
              <div
                class="platform-game-item btn-effect"
                @click="playGame(item.name, 'JDB', item.code, item.status, item.gameType, item.id, item.demo)"
              >
                <div class="platform-game-img">
                  <div
                    class="game--bg"
                    :style="{
                      backgroundImage: (() => {
                        try {
                          return `url(${require(`../assets/images/index/fish/item-game-${item.code.toLowerCase()}.png`)})`;
                        } catch (e) {
                          try {
                            return `url(${imgURLGame}${item.icon})`;
                          } catch (e) {
                            return `url(https://m.b9mega1.com/static/images/index/fish/item-game-${item.code.toLowerCase()}.png)`;
                          }
                        }
                      })()
                    }"
                  ></div>
                </div>
                <div class="platform-game-title">{{ truncateText(item.name, 22) }}</div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Poker' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="Poker">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-poker.png" class="label-img" /> -->
            <img src="../assets/images/index/menu-label-icon-poker.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_poker") }}</div>
            <div v-if="category.title === 'Lobby' && category.active" class="side">
              <div class="all-btn" @click="handleActivateSlide('Poker')">
                {{ $t("home.menu_all") }}
                <img src="../assets/images/account/rgtarrow.svg" />
              </div>
              <div :class="`custom-poker-prev`"><img src="../assets/images/account/rgtarrow.svg" /></div>
              <div :class="`custom-poker-next`"><img src="../assets/images/account/rgtarrow.svg" /></div>
            </div>
          </div>

          <div class="platform-game-wrapper" v-if="category.title === 'Lobby' && category.active">
            <swiper
              :slidesPerView="3"
              :spaceBetween="10"
              :modules="[Navigation, Grid]"
              :grid="{ rows: 1, fill: 'row' }"
              :navigation="{ nextEl: '.custom-poker-next', prevEl: '.custom-poker-prev' }"
              class="platform-game-container"
            >
              <template v-for="(item, index) in pokerGameJILIList" :key="index">
                <!-- <template v-if="item.code === 'JILI'"> -->
                <swiper-slide
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JILI', item.code, item.status, item.gameType, item.id, item.demo)"
                >
                  <div
                    data-aos="zoom-in"
                    :data-aos-delay="100 * index"
                    data-aos-duration="1200"
                    data-aos-once="true"
                    data-aos-anchor="#slotsgames"
                  >
                    <div class="platform-game-img pokerportion">
                      <div
                        class="game--bg"
                        :style="{
                          backgroundImage: (() => {
                            try {
                              return `url(${require(`../assets/images/index/poker/item-game-${item.code.toLowerCase()}.png`)})`;
                            } catch (e) {
                              try {
                                return `url(${imgURLGame}${item.icon})`;
                              } catch (e) {
                                return `url(https://m.b9mega1.com/static/images/index/poker/item-game-${item.code.toLowerCase()}.png)`;
                              }
                            }
                          })()
                        }"
                      ></div>
                    </div>

                    <div v-if="index < 3" class="burning-hot">
                      <img src="../assets/images/index/hot.png" />
                    </div>

                    <div class="platform-game-title">{{ truncateText(item.alias ? item.alias : item.name, 22) }}</div>
                  </div>
                </swiper-slide>
                <!-- </template> -->
              </template>
            </swiper>
          </div>

          <div class="platform-game-wrapper" v-else>
            <div
              :slidesPerView="4"
              :spaceBetween="10"
              :scrollbar="{
                hide: true
              }"
              :modules="gameModules"
              class="platform-game-container grid-view"
            >
              <template v-for="(item, index) in pokerGameJILIList" :key="index">
                <!-- <template v-if="item.code === 'JILI'"> -->
                <div
                  class="platform-game-item btn-effect"
                  @click="playGame(item.name, 'JILI', item.code, item.status, item.gameType, item.id, item.demo)"
                >
                  <div class="platform-game-img pokerportion">
                    <div
                      class="game--bg"
                      :style="{
                        backgroundImage: (() => {
                          try {
                            return `url(${require(`../assets/images/index/poker/item-game-${item.code.toLowerCase()}.png`)})`;
                          } catch (e) {
                            try {
                              return `url(${imgURLGame}${item.icon})`;
                            } catch (e) {
                              return `url(https://m.b9mega1.com/static/images/index/poker/item-game-${item.code.toLowerCase()}.png)`;
                            }
                          }
                        })()
                      }"
                    ></div>
                  </div>

                  <div v-if="index < 3" class="burning-hot">
                    <img src="../assets/images/index/hot.png" />
                  </div>

                  <div class="platform-game-title">{{ truncateText(item.alias ? item.alias : item.name, 22) }}</div>
                </div>
                <!-- </template> -->
              </template>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="(category.title === 'Sport' && category.active) || (category.title === 'Lobby' && category.active)"
      >
        <div class="games-selection-wrapper" id="Sport">
          <div class="title-game">
            <!-- <img src="../assets/images/index/menu-label-sport.png" class="label-img" /> -->
            <!-- <img src="../assets/images/index/sport-icon-label.png" /> -->
            <!-- <span class="txt-style">Sports</span> -->
            <img src="../assets/images/index/menu-label-icon-sport.png" class="label-img" />
            <div class="txt-style">{{ $t("home.cat_sport") }}</div>
          </div>
          <div class="platform-game-container sport-platform">
            <template v-for="(item, index) in sport" :key="index">
              <div
                class="platform-game-item btn-effect"
                @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id, item.demo)"
              >
                <img src="../assets/images/index/sport/item-game-maintenance.png" />
                <div
                  class="platform-game-item--img"
                  :style="{
                    backgroundImage: (() => {
                      try {
                        return `url(${require(`../assets/images/index/sport/item-game-${item.name.toLowerCase()}.png`)})`;
                      } catch (e) {
                        return `url(https://m.b9mega1.com/static/images/index/sport/item-game-${item.code.toLowerCase()}.png)`;
                      }
                    })()
                  }"
                >
                  <div v-if="item.name === 'LuckySport' || item.name === 'BTI'" class="burning-hot">
                    <img src="../assets/images/index/hot.png" />
                  </div>
                </div>
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
    <q-card style="width: 100%">
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

  <q-dialog width="100%" class="announcement-modal" v-model="isStationNotice">
    <div class="popout-dialog announcement-popout" style="width: 375px; height: 559px">
      <!-- <div class="announcement-top-img"><img src="../assets/images/index/notice-icon.png" /></div> -->

      <q-btn flat dense icon="close" class="text-black announcement-close" v-close-popup />
      <q-card :class="{ wPage: maxPage > 1 }" style="width: 90%; margin: auto" class="announcement-card">
        <q-card-section style="max-height: 100%; overflow: auto">
          <!--     -->
          <q-card
            v-for="(item, index) in paginatedAnnouncements"
            :key="`${page}` - `${index}`"
            class="q-mb-md announcement-item-card"
            :class="{ isExpanded: item.expanded }"
            flat
            bordered
          >
            <q-card-section v-if="!item.expanded" class="row items-center justify-between q-pb-none">
              <div class="announcement-icon" style="color: #000000">
                <!-- <img :src="`../assets/images/index/type-${item.typeId}.png`"> -->
                <img
                  :src="require(`../assets/images/index/type-${item.typeId}.png`)"
                  onerror="this.onerror=null;this.src='../assets/images/index/type-56.png';"
                />
              </div>
            </q-card-section>
            <q-card-section class="row items-center justify-between q-pb-none">
              <div class="text-title" style="color: #000000" v-html="item.title"></div>
            </q-card-section>

            <q-card-section class="text-caption">
              <div v-if="!item.expanded">
                <!-- <div v-html="getPreview(item.content)"></div> -->
              </div>
              <div v-else>
                <div v-html="processedContent(item.content)"></div>
                <q-img
                  v-if="item.image"
                  :src="item.image"
                  class="q-mt-sm"
                  style="border: 1px solid #ccc; border-radius: 4px"
                  height="150px"
                  fit="contain"
                />
              </div>
            </q-card-section>

            <q-card-actions class="lastitem" align="right">
              <div class="closemore-btns">
                <div
                  class="announcement-new"
                  :class="{ show: checkTime(item.createTime) && !item.hasBeenExpanded }"
                ></div>
                <!-- <q-btn
                  dense
                  size="sm"
                  flat
                  style="
                    background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
                    color: #ffffff;
                    padding-right: 2px;
                    border-radius: 6px;
                  "
                  :label="item.expanded ? 'close' : 'more'"
                  :icon-right="item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="toggleExpanded(index)"
                /> -->
                <img
                  @click="toggleExpanded(index)"
                  :src="
                    require(item.expanded
                      ? `../assets/images/index/btn-close.png`
                      : `../assets/images/index/btn-more.png`)
                  "
                />
              </div>
              <div class="text-date">{{ moment(item.createTime).format("DD/MM/YYYY") }}</div>
            </q-card-actions>
          </q-card>
          <!-- <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
              <q-list style="min-height: auto">
                <div v-for="(ann, idx) in announcementList" :key="idx" style="min-height: 50px">
                  <span v-if="ann.typeId === tab.id">
                    <q-expansion-item
                      style="max-height: 75vh; overflow: auto"
                      group="somegroup"
                      icon="volume_up"
                      :label="ann.title"
                    >
                      <q-card>
                        <q-card-section>
                          <div v-html="processedContent(ann.content)" />
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>

                    <q-separator></q-separator>
                  </span>
                </div>
              </q-list>
            </q-tab-panel>
          </q-tab-panels> -->
        </q-card-section>
      </q-card>

      <q-card-actions v-if="maxPage > 1" class="q-px-lg" align="center" style="padding: 0">
        <q-pagination class="pagiantion" v-model="page" :max="maxPage" :max-pages="7" boundary-numbers />
      </q-card-actions>
    </div>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="isImportantAnnoucementModal">
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
  </q-dialog> -->

  <q-dialog
    v-model="fullGameDialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="fullgame-dialog"
  >
    <q-card class="fullgame-card" id="fullgame">
      <!-- <ProfileSummary @closeslot="closeSlotModal" :homeProfile="true" /> -->
      <q-card-section>
        <div class="home-wrapper fullgame-wrapper">
          <div class="fullgame-header">
            <div class="back-top-logo">
              <div class="back-header-btn" @click="closeSlotModal">
                <img src="../assets/images/index/btn-back.png" />
              </div>
              <div class="game-logo-img">
                <!-- <div
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
                > -->
                {{ subGameCode }}
              </div>
            </div>

            <div class="fullgame-search q-ma-md">
              <div class="pc-form-input">
                <q-input
                  outlined
                  color="green"
                  v-model="searchText"
                  :label="$t('btn.search')"
                  clearable
                  clear-icon="close"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" size="20px" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <template v-if="isGameLoading">
            <div class="loader-container">
              <div>
                <q-spinner color="green" size="10em" :thickness="10" />
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
                        @click="
                          playGame(
                            item.name,
                            item.platformCode,
                            item.code,
                            item.status,
                            item.gameType,
                            item.id,
                            item.demo
                          )
                        "
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
                        @click="
                          playGame(item.name, subGameCode, item.code, item.status, item.gameType, item.id, item.demo)
                        "
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
                {{ $t("btn.moreGames") }}
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

  <!-- <q-dialog width="100%" v-model="guestKYCDialog" presistent>
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
  </q-dialog> -->

  <q-dialog width="100%" class="modal-home-popup" v-model="isImportantAnnoucementModal">
    <q-card style="width: 90%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <router-link class="promo-banner-container" :to="homePopupLink" :target="homePopupLinkOut ? '_blank' : '_self'">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </router-link>
      </q-card-section>
    </q-card>
  </q-dialog>

  <NewPlayerGuideModal
    ref="modalGuide"
    v-if="store.token && !store.hasDeposit"
    :modelValue="isNewPlayerModal"
    :currentStep="currentStep"
    @update:runAviator="handleGamePlay"
    @update:modelValue="handleModalUpdate"
    @update:showSteps="handleAdditionalSteps"
    @update:currentStep="updateCurrentStep"
  />
  <AdditionalSteps
    v-if="isAdditionalDepositSteps || isAdditionalReferSteps || isAdditionalWithdrawSteps"
    :currentAdditionalStep="currentAdditionalStep"
    :currentType="currentType"
    @updateStep="handleStepUpdate"
    @closeGuide="closePlayerGuide"
  />

  <!-- <template v-if="isAndroid()">
    <q-dialog class="isCentreDialog" v-if="popupPromo === 'lucky-spin-wheel'" :model-value="true">
      <div class="luckyspin-wrapper">
        <div class="luckyspin-header">
          <img src="../assets/images/index/modal/luckyspin-title.png" />
        </div>
        <div class="luckyspin-container">
          <PopupController v-model="popupPromo" :hasWheel="hasInviteWheelPromo" :hasSpin="isShownSpinLuckyWheel" />
          <div class="luckyspin-title">
            <img src="../assets/images/index/modal/luckyspin-welcome.png" />
          </div>

          <LuckySpinWheel show-controller />
        </div>
        <div class="q-mt-md">
          <q-icon name="highlight_off" size="md" v-close-popup />
        </div>
      </div>
    </q-dialog>
  </template>
  <template v-else>
    <q-dialog class="isCentreDialog" v-if="popupPromo === 'lucky-spin-wheel'" :model-value="true">
      <CongratsModal>
        <template #controller>
          <PopupController v-model="popupPromo" :hasWheel="hasInviteWheelPromo" :hasSpin="isShownSpinLuckyWheel" />
        </template>
      </CongratsModal>
    </q-dialog>
  </template>
  <div class="tac-footer" v-if="ui.siteType === 'CURACAO'">
    <img class="b9game-logo" alt="b9game-logo" src="../assets/images/common/b9game-logo.png" />
    <div class="footer-content">
      b9.game aims to become the global leader in online gaming and betting using the latest blockchain technologies,
      always putting our customers first. Trust, integrity and fairness are just three of our key values.
    </div>
    <div class="logo-wrapper">
      <a
        href="https://cert.gcb.cw/certificate?id=ZXlKcGRpSTZJa2cxV1RWYVVVTm1USEZ5VDJRdlVVYzNLM2N4U25jOVBTSXNJblpoYkhWbElqb2llRFp4ZFhBcmMwYzBUSGh5TDFkRE5sRXJRbFJUUVQwOUlpd2liV0ZqSWpvaVlXUm1PREUxWkROaU1UWTJOV1F5WWpkak5XUTRNRGN4TVdZNU16Y3pZV0pqT1RrNU1ETmtNRGxpWVRjNE1UTmtZakl5WmpsaE4yVmxOamxpTkRSaVlTSXNJblJoWnlJNklpSjk="
        target="_blank"
        rel="noopener noreferrer"
      >
        <img class="gcb-logo" alt="gcb-logo" src="../assets/images/license/curacao-license.png" />
      </a>
      <img class="eighteen-only-logo" alt="18+ only" src="../assets/images/common/18-only.png" />
    </div>
    <div class="footer-content">
      b9.game is operated by Bridge Technologies B.V., company registration number 160264(0), with registered address at
      Dr. M.J. Hugenholtzweg 25, Willemstad, Curaçao. Bridge Technologies B.V. is licensed and authorized by the
      Government of Curaçao, operating under licence number OGL/2024/431/0231 issued by the Curaçao Gaming Control Board
      (GCB).
    </div>
    <div class="copyright-txt">© 2024 b9.game ALL RIGHTS RESERVED</div>
  </div> -->

  <CongratsReuseableModal
    :isShowDialog="isShowCodeBonusModal"
    :bonusTitle="$t('modal.homeCodeBonus.congratsWonFreeCash')"
    :bonusTxt="$t('modal.homeCodeBonus.enterCodeToClaim')"
    :btnTxt="$t('btn.goNow')"
    :contentImg="require('../assets/images/index/modal/congrats-coupons-2.png')"
    @handleBtnClick="handleReceiveCodeBonus"
    @handleBtnClose="isShowCodeBonusModal = false"
  />

  <q-dialog class="isCentreDialog" v-if="popupPromo === 'money-rain'" :model-value="true" persistent>
    <MoneyRainModal @closeModal="closeDialog">
      <template #controller>
        <PopupController v-model="popupPromo" :hasWheel="hasInviteWheelPromo" :hasSpin="isShownSpinLuckyWheel" />
      </template>
    </MoneyRainModal>
    <q-btn class="money-rain-close" icon="close" round dense @click="closeDialog" />
  </q-dialog>

  <q-dialog
    v-if="popupPromo === 'mega-sharing-wheel'"
    :model-value="megaSharingWheelDialogModel"
    full-width
    class="isCentreDialog mega-sharing-wheel-dialog"
    persistent
  >
    <q-btn class="mega-sharing-wheel-dialog-close" icon="close" round dense @click="closeDialog" />
    <MegaSharingWheelModal>
      <template #controller>
        <PopupController v-model="popupPromo" :hasWheel="hasInviteWheelPromo" :hasSpin="true" />
      </template>
    </MegaSharingWheelModal>
  </q-dialog>

  <q-dialog
    v-if="popupPromo === 'spin-lucky-wheel' && isShownSpinLuckyWheel"
    full-width
    :model-value="isShownSpinLuckyWheel"
    class="isCentreDialog spin-lucky-wheel-dialog"
    persistent
  >
    <q-btn class="money-rain-close" icon="close" round dense @click="closeDialog" />
    <SpinLuckyWheelPromoHomePopup @close-dialog="closeDialog" ref="spinLuckyWheelPromoHomePopupRef">
      <template #controller v-if="isShownNewPlayerWheel">
        <PopupController v-model="popupPromo" :hasSpin="true" :hasNewPlayer="true" />
      </template>
    </SpinLuckyWheelPromoHomePopup>
  </q-dialog>
  <q-dialog class="isCentreDialog" v-model="isHasUnusedCoupon" @hide="isHasUnusedCoupon = false">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-heading">COUPON</div>
      <div class="congrats-coupons">
        <img :src="require('../assets/images/index/modal/congrats-coupons.png')" />
      </div>
      <div class="congrats-title">{{ $t("hotPromo.unusedCoupons") }}</div>

      <div class="congrats-button-container">
        <q-btn no-caps unelevated class="congrats-btn" @click="handleNewPlayerDeposit">
          {{ $t("btn.goNow") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>
  <q-dialog
    v-if="popupPromo === 'newplayer-spin-wheel'"
    full-width
    :model-value="isShownNewPlayerWheel"
    class="isCentreDialog spin-lucky-wheel-dialog"
    persistent
  >
    <q-btn class="money-rain-close" icon="close" round dense @click="closeDialog" />
    <NewPlayerPromoHomePopup @close-dialog="closeDialog" ref="newPlayerPromoHomePopupRef">
      <template #controller>
        <PopupController v-model="popupPromo" :hasSpin="true" :hasNewPlayer="true" />
      </template>
    </NewPlayerPromoHomePopup>
  </q-dialog>
  <q-dialog v-model="isMediaSettingsModal">
    <MediaSettingsComponent :media="mediaCode" />
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
  </q-dialog>
  <a ref="downloadAppRef" :href="ui.downloadAppUrl" download style="display: none" />

  <q-dialog v-model="isShowSetFirstPw">
    <SetFirstPasswordModal @closeDialog="isShowSetFirstPw = false" />
  </q-dialog>

  <AddToHomeScreenModal :isAddToHomeScreen="isAddToHomeScreen" @update:isAddToHomeScreen="isAddToHomeScreen = $event" />

  <!-- DONT REMOVE THIS GOT USE DE-->
  <SpinLuckyWheelPromoSticky v-show="false" />
  <!-- <SpinLuckyWheelPromoHomePopup v-if="isShownSpinLuckyWheel || popupPromo === 'spin-lucky-wheel'" ref="spinLuckyWheelPromoHomePopupRef" /> -->

  <DepositPromoModal v-if="ui.annoyingType !== 'NONE'" />
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onActivated,
  provide,
  nextTick,
  onDeactivated
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useQuasar, Platform, LocalStorage } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
import { App } from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";
import PushNotification from "../components/modal/PushNotification.vue";
import { useUI } from "stores/ui";
import ProfileSummary from "../components/ProfileSummary.vue";
import WithdrawalModal from "../components/modal/WithdrawalModal.vue";
import CongratsModal from "../components/modal/CongratsModal.vue";
import LuckySpinWheel from "../components/hotpromo/newPlayerWheel/LuckySpinWheel.vue";
import MoneyRainModal from "../components/modal/MoneyRainModal.vue";
import MediaSettingsComponent from "../components/MediaSettingsComponent.vue";
import NewPlayerGuideModal from "../components/modal/NewPlayerGuideModal.vue";
import AdditionalSteps from "../components/modal/AdditionalSteps.vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { isAndroid } from "boot/utils";
import { useI18n } from "vue-i18n";
import { eventapi } from "src/boot/axios";
import moment from "moment";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
// Import Swiper modules
import SwiperCore, { Navigation, Grid, Pagination, Scrollbar, A11y } from "swiper/core";
import { onClickOutside, useEventListener } from "@vueuse/core";
import { useCustomerTrigger } from "src/hooks/trigger";
import chroma from "chroma-js";
import PopupController from "src/components/PopupController.vue";
import MegaSharingWheelModal from "src/components/hotpromo/megaSharingWheel/MegaSharingWheelModal.vue";
import SetFirstPasswordModal from "src/components/modal/SetFirstPasswordModal.vue";
import AddToHomeScreenModal from "src/components/modal/AddToHomeScreenModal.vue";
import SpinLuckyWheelPromoSticky from "src/components/hotpromo/spin-lucky-wheel/PromoSticky.vue";
import SpinLuckyWheelPromoHomePopup from "src/components/hotpromo/spin-lucky-wheel/HomePopup.vue";
import NewPlayerPromoHomePopup from "src/components/hotpromo/newPlayerSpinWheel/NewPlayerPopup.vue";

import DepositPromoModal from "src/components/modal/DepositPromoModal.vue";
import { usePromoStore } from "src/stores/promo";
import { storeToRefs } from "pinia";

import CongratsReuseableModal from "src/components/modal/CongratsReuseableModal.vue";
// import SwiperCore, { Scrollbar, Navigation, Pagination, EffectCoverflow } from "swiper";
import { i18nStore } from "src/router/language";

const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);

const scaleValue = ref(1);
let lastScrollTop = 0;
const isShowStickyIcons = ref(true);
const handleScroll = () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScrollTop) {
    // Scrolling down
    scaleValue.value = 0;
  } else {
    // Scrolling up
    scaleValue.value = 1;
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
};

onDeactivated(() => {
  popupPromo.value = "";
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
// Use ref to hold the modules
const modules = ref([Scrollbar, Navigation, Pagination]);
const gameModules = ref([Navigation, Pagination]);

const { t } = useI18n();
const promoStore = usePromoStore();
const { isShownSpinLuckyWheel, isShownNewPlayerWheel, isShowSticky } = storeToRefs(promoStore);
// const isLuckyDrawModal = ref(false);
// const isCongratsModal = ref(true);
const isShowPrizeModal = ref(false);

const isHasUnusedCoupon = ref(false);
// const isMoneyRainModal = ref(false);
const isMediaSettingsModal = ref(false);
const popupPromo = ref("");
const megaSharingWheelDialogModel = ref(true);
const isAddToHomeScreen = ref(false);
const isShowSetFirstPw = ref(false);
const isShowCodeBonusModal = ref(false);
const currentStep = ref(localStorage.getItem("newPlayerGuide") || "1");
// Only show the guide if on `/home` or `/`
// const isNewPlayerModal = computed(() => {
//   return (
//     currentStep.value !== "END" &&
//     route.path !== "/language" &&
//     !isHotGameAdditionalSteps.value &&
//     !isAdditionalDepositSteps.value &&
//     !isAdditionalReferSteps.value &&
//     !isAdditionalWithdrawSteps.value
//   );
// });
const showNewPlayerModal = ref(false);
const isNewPlayerModal = computed(() => {
  return (
    showNewPlayerModal.value && // <-- manual trigger
    currentStep.value !== "END" &&
    route.path !== "/language" &&
    !isHotGameAdditionalSteps.value &&
    !isAdditionalDepositSteps.value &&
    !isAdditionalReferSteps.value &&
    !isAdditionalWithdrawSteps.value
  );
});
const handleModalUpdate = (value) => {
  isNewPlayerModal.value = value;
};
const targetSection = ref();
const showOverlay = ref();
const disableScroll = () => {
  document.body.style.overflow = "hidden"; // Disable scrolling
};

const enableScroll = () => {
  document.body.style.overflow = ""; // Restore scrolling
};
const isHotGameAdditionalSteps = ref(false);
const isAdditionalDepositSteps = ref(false);
const isAdditionalReferSteps = ref(false);
const isAdditionalWithdrawSteps = ref(false);
const currentType = ref("deposit");
const currentAdditionalStep = ref(1);

const handleStepUpdate = (newStep) => {
  currentAdditionalStep.value = newStep;
};
const handleAdditionalSteps = (index) => {
  if (index === 2) {
    isHotGameAdditionalSteps.value = true;
    handleActivateSlide("Hot");
    // Scroll to the target element
    // Scroll to the target element
    nextTick(() => {
      if (targetSection.value) {
        const offset = 130; // Adjust this offset as needed
        const rect = targetSection.value.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop; // Get current scroll position
        const finalPosition = rect.top + scrollTop - offset;

        // Smooth scroll to the calculated position
        window.scrollTo({
          top: finalPosition,
          behavior: "smooth"
        });
      }
    });
    // Show overlay after scrolling
    setTimeout(() => {
      showOverlay.value = true;
      disableScroll();
    }, 500);
  } else if (index === 3) {
    currentAdditionalStep.value = 1;
    currentType.value = "deposit";
    isAdditionalDepositSteps.value = true;
    disableScroll();
  } else if (index === 4) {
    currentAdditionalStep.value = 1;
    currentType.value = "refer";
    isAdditionalReferSteps.value = true;
    disableScroll();
  } else if (index === 5) {
    currentAdditionalStep.value = 1;
    currentType.value = "withdraw";
    isAdditionalWithdrawSteps.value = true;
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    disableScroll();
  }
};
onUnmounted(() => {
  enableScroll();
});
const resetSteps = () => {
  isHotGameAdditionalSteps.value = false;
  handleActivateSlide("Lobby");
  showOverlay.value = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  enableScroll();
};
const updateCurrentStep = (newStep) => {
  resetSteps();
  currentStep.value = newStep;
  // Optionally, update localStorage again in the parent component
  localStorage.setItem("newPlayerGuide", newStep);
};
const closePlayerGuide = (skipStep) => {
  if (skipStep === true) {
    updateCurrentStep("5");
    currentType.value = "withdraw";
  }
  isAdditionalReferSteps.value = false;
  isAdditionalDepositSteps.value = false;
  isAdditionalWithdrawSteps.value = false;
  enableScroll();
};
const handleGamePlay = (elementName) => {
  resetSteps();
  sessionStorage.setItem("isFromNewPlayerGuide", JSON.stringify(true));
  hotGameList.value.forEach((element) => {
    console.log(elementName);
    if (elementName === element.name.toLowerCase()) {
      if (element.code === "aviator" || element.code === "229" || element.code === "124") {
        playGame(
          element.name,
          element.platformCode,
          element.code,
          element.status,
          element.gameType,
          element.id,
          element.demo
        );
      }
    }
  });
};
const modalGuide = ref(null); // Ensure this is defined

const playVideo = () => {
  isHotGameAdditionalSteps.value = false;
  resetSteps();
  if (modalGuide.value) {
    modalGuide.value.showVideo(1); // Call showVideo with parameter 1
  }
};
const categoriesList = ref([
  { title: "Lobby", label: t("home.menu_lobby"), icon: "lobby", active: true },
  { title: "Hot", label: t("home.menu_hot"), icon: "hot", active: false },
  { title: "Slot", label: t("home.menu_slot"), icon: "slot", active: false },
  { title: "Live", label: t("home.menu_live"), icon: "live", active: false },
  { title: "Sport", label: t("home.menu_sport"), icon: "sport", active: false },
  { title: "Fish", label: t("home.menu_fish"), icon: "fish", active: false },
  { title: "Poker", label: t("home.menu_poker"), icon: "poker", active: false }
]);

const isCsTabVisible = ref(false);
const csTabRef = ref();

const isLiveTabVisible = ref(false);
const liveTabRef = ref();

const spinLuckyWheelPromoHomePopupRef = ref();
const newPlayerPromoHomePopupRef = ref();

const translatedCategoriesList = computed(() => {
  return categoriesList.value.map((category) => ({
    ...category,
    label: t(`home.menu_${category.title.toLowerCase()}`)
  }));
});
const getImageUrl = (title) => {
  return require(`../assets/images/index/category/hometop-${title.toLowerCase()}.png`);
};

const activeCategoryLabel = computed(() => {
  const activeCategory = translatedCategoriesList.value.find((category) => category.active);
  return activeCategory ? activeCategory.label : "";
});

// const activateSlide = (clickedItem) => {
//   categoriesList.value.forEach((item) => {
//     item.active = item === clickedItem;
//   });
// };

// const activateSlide = (item) => {
//   translatedCategoriesList.value.forEach((category) => (category.active = false));
//   item.active = true;
// };

provide("closeMegaSharingWheelDialog", () => {
  megaSharingWheelDialogModel.value = false;
});

const handleReceiveBonus = () => {};

const closeDialog = () => {
  popupPromo.value = "";
};
const activateSlide = (item) => {
  categoriesList.value.forEach((category) => (category.active = false));
  const category = categoriesList.value.find((cat) => cat.title === item.title);
  if (category) {
    category.active = true;
    router.replace({ hash: `#${category.label}` });
  }
};

const handleActivateSlide = (slot) => {
  const item = translatedCategoriesList.value.find((cat) => cat.title === slot);
  if (item) {
    activateSlide(item);
  }
};

const checkHash = () => {
  const hash = route.hash.replace("#", "");
  if (hash) {
    handleActivateSlide(hash);
  } else {
    if (route.path === "/home") {
      router.replace({ hash: `#Lobby` });
    }
  }
};

const isCharityShow = computed(() => {
  if (ui.charityUrl) {
    return true;
  }
  return false;
});
const charityDragPos = ref([10, 300]);
const isDraggingCharityGif = ref(false);

const csDragPos = ref([10, 80]);
const isDraggingCsIcon = ref(false);

const liveDragPos = ref([16, 0]);
const isDraggingLiveIcon = ref(false);
const isLiveUrlShow = ref(false);

const hbDragPos = ref([10, 300]);
const isDraggingHbIcon = ref(false);
const isHbShow = ref(true);
const hbSlide = ref(0);

const slide = ref(0);

const isFirstView = ref(false);
const closeAlert = () => {
  // Create a new date object in GMT+5.5
  const currentTimeInGMT55 = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));

  localStorage.setItem("indexImgTop", currentTimeInGMT55.getTime());
  isFirstView.value = false;
};

const fullGameDialog = ref(false);
const searchText = ref("");

const withdrawalModalRef = ref();
const onWithdrawalClick = () => {
  // withdrawalDialog.value = true;
  if (!store.realName & !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName & store.guest) {
    guestKYCDialog.value = true;
  } else {
    withdrawalModalRef.value.open();
  }
};

const userKYCDialog = ref(false);
const guestKYCDialog = ref(false);
const depositDialog = ref(false);
const openDepositDialog = () => {
  if (!store.realName & !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName & store.guest) {
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
  { amount: 300, hotLabel: 15, isActive: false },
  { amount: 500, hotLabel: 25, isActive: false },
  { amount: 800, hotLabel: 40, isActive: false },
  { amount: 1000, hotLabel: 50, isActive: false },
  { amount: 3000, hotLabel: 150, isActive: false },
  { amount: 5000, hotLabel: 250, isActive: false },
  { amount: 10000, hotLabel: 500, isActive: false },
  { amount: 30000, hotLabel: 1500, isActive: false },
  { amount: 50000, hotLabel: 2500, isActive: false }
]);

const esport = ref([]);
const sport = ref([
  {
    id: 133,
    name: "LuckySport",
    code: "LuckySport",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 95,
    name: "BTI",
    code: "BTI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 50,
    name: "SABA",
    code: "SABA",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  }
]);
const livecasino = ref([
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
    sequence: 1
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
    alias: "Sexy",
    sequence: 999
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
    sequence: 999
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
    alias: "One Touch",
    sequence: 999
  },
  {
    id: 143,
    name: "WCPP",
    code: "WCPP",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Evolution",
    sequence: 999
  }
]);
const poker = ref([]);
const lottery = ref([]);
const slot = ref([
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
    sequence: 1
  },
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
    sequence: 2
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
    alias: "Relax Gaming",
    sequence: 3
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
    alias: "Big Time",
    sequence: 6
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
    alias: "Relax Gaming",
    sequence: 7
  },
  {
    id: 16,
    name: "TFGaming",
    code: "TFGaming",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "CASUAL",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
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
    alias: "No Limit City",
    sequence: 999
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
    alias: "Wazdan",
    sequence: 999
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
    alias: "Netent",
    sequence: 999
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
    alias: "Red Tiger",
    sequence: 999
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
    alias: "One Touch Slot",
    sequence: 999
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
    alias: "World Match",
    sequence: 999
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
    alias: "PNG",
    sequence: 999
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
    alias: "Habanero",
    sequence: 999
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
    alias: "Spinix",
    sequence: 999
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
    sequence: 999
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
    (Platform.is.android && Platform.is.capacitor) ||
    store.isFromGooglePackage
  ) {
    downloadHeart.value = false;
    isH5.value = false;
    setTimeout(() => {
      getVersionNo();
    }, 1000);
  } else {
    downloadHeart.value = true;
    isH5.value = true;
    setTimeout(() => {
      getVersionNo();
    });
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

const route = useRoute();
const router = useRouter();
const store = userStore();

const bannerColors = ref([]);

// Extract dominant color from an image
const getImageDominantColor = (imgUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate average color
      const rgba = [0, 0, 0];
      for (let i = 0; i < data.length; i += 4) {
        rgba[0] += data[i]; // Red
        rgba[1] += data[i + 1]; // Green
        rgba[2] += data[i + 2]; // Blue
      }

      const pixelCount = data.length / 4;
      rgba[0] = Math.floor(rgba[0] / pixelCount);
      rgba[1] = Math.floor(rgba[1] / pixelCount);
      rgba[2] = Math.floor(rgba[2] / pixelCount);

      const dominantColor = chroma(rgba).hex(); // Convert to HEX
      resolve(dominantColor);
    };
  });
};

const extractColors = async () => {
  bannerColors.value = [];
  for (const banner of banners.value) {
    const imgUrl = returnBannerUrl(banner);
    const color = await getImageDominantColor(imgUrl);
    bannerColors.value.push(color);
  }
};

const gradientStyle = ref("");

const updateGradient = () => {
  const colors = bannerColors.value.join(", ");
  gradientStyle.value = `linear-gradient(to bottom, ${colors}, black)`;
};

// Watch for changes in bannerColors and update gradient
watch(bannerColors, updateGradient);

const allGames = ref(null);
const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId, demo) => {
  allGames.value.open(gameName, platformCode, gameCode, gameType, demo);
};

const isGameLoading = ref(true);
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

const showNewPlayer = () => {
  currentStep.value = localStorage.getItem("newPlayerGuide");
  showNewPlayerModal.value = true;
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
    id: 23,
    name: "Aviator",
    code: "27",
    status: "OPEN",
    icon: "5/Spribe/4457f1e2-d1ea-4b53-a111-95a225bef685.png",
    sequence: 1,
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
  },
  {
    id: 61,
    name: "Pirate Flip",
    code: "32",
    status: "OPEN",
    icon: "8/TFGaming/32.png",
    sequence: 2,
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
  },
  {
    id: 64,
    name: "Mines",
    code: "229",
    status: "OPEN",
    icon: "11/JILI/c77236e7-a298-488a-975d-c1fd7f8e30f2.jpg",
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
    id: 65,
    name: "7up7down",
    code: "124",
    status: "OPEN",
    icon: "11/JILI/9d163d59-27cc-4df7-8709-d2a2ecc0e65e.png",
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
    id: 62,
    name: "Dragon & Tiger",
    code: "123",
    status: "OPEN",
    icon: "11/JILI/d3ec422a-bb04-4d7a-b9a9-e54fbdcae042.png",
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
    id: 63,
    name: "Color Game",
    code: "197",
    status: "OPEN",
    icon: "11/JILI/86ae93d2-1e8d-4eb8-8b67-ce9db4e74ea6.png",
    sequence: 6,
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
  { code: "WCEvo", platform: "WCEvo", type: "platform", name: "" },
  {
    id: 46,
    name: "Sic Bo",
    code: "125",
    status: "OPEN",
    icon: "11/JILI/e69c37b0-5925-43e1-b02a-3c63ac25add0.png",
    sequence: 8,
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
    id: 47,
    name: "Money Coming",
    code: "51",
    status: "OPEN",
    icon: "11/JILI/51.png",
    sequence: 9,
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
    id: 48,
    name: "Andar Bahar",
    code: "79",
    status: "OPEN",
    icon: "11/JILI/5d214dcd-08fb-4c54-b808-12c55ac19473.png",
    sequence: 10,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 49,
    name: "Dinosaur Tycoon",
    code: "42",
    status: "OPEN",
    icon: "11/JILI/42.png",
    sequence: 11,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 50,
    name: "Ludo Quick",
    code: "163",
    status: "OPEN",
    icon: "11/JILI/acd9b0fd-625d-4fb2-ae19-5e69b34e6700.png",
    sequence: 12,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 51,
    name: "Fortune Gems 2",
    code: "223",
    status: "OPEN",
    icon: "11/JILI/109.png",
    sequence: 13,
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
    id: 53,
    name: "Bombing Fishing",
    code: "20",
    status: "OPEN",
    icon: "11/JILI/20.png",
    sequence: 14,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 54,
    name: "Happy Fishing",
    code: "82",
    status: "OPEN",
    icon: "11/JILI/82.png",
    sequence: 15,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 55,
    name: "Plinko",
    code: "242",
    status: "OPEN",
    icon: "11/JILI/c936c03d-316d-4fb8-804a-9e9ca837aa90.png",
    sequence: 16,
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
    id: 56,
    name: "Jackpot Fishing",
    code: "32",
    status: "OPEN",
    icon: "11/JILI/32.png",
    sequence: 17,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 57,
    name: "Baccarat",
    code: "152",
    status: "OPEN",
    icon: "11/JILI/ba81c2f8-dcaa-4de0-982c-7e198fa3c8fe.png",
    sequence: 18,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 26,
    name: "TeenPatti 20-20",
    code: "161",
    status: "OPEN",
    icon: "11/JILI/c3a5ab4f-19f8-4299-b046-1fc4ea38ef4c.png",
    sequence: 19,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 25,
    name: "All-star Fishing",
    code: "119",
    status: "OPEN",
    icon: "11/JILI/119.png",
    sequence: 20,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 4,
    name: "Teen Patti",
    code: "72",
    status: "OPEN",
    icon: "11/JILI/097df233-0329-427c-a596-9af968062624.png",
    sequence: 21,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
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
          // .get("/member/hot", {
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
      hotGameList.value = [];
      hotlists = res;

      // cached
      cached
        .get(
          key,
          () =>
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
              .catch((err) => {
                // Handle the error appropriately
              }),
          { expired_value: 300 }
        )
        .then((res) => {
          gameLists = res;

          // console.log("HERE");
          // console.log(gameLists);
          // console.log(hotlists);

          hotlists = hotlists.map((item1) => {
            const matchingItem = gameLists.find(
              (item2) => item1.type === "game" && item1.code === item2.code && item2.platformCode === item1.platform
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
          // console.log(JSON.stringify(hotGameList.value));
          // console.log(livecasino.value);
        });
    });
};

const fishGameJILIList = ref([
  {
    id: 25309,
    name: "Bombing Fishing",
    code: "20",
    status: "OPEN",
    icon: "11/JILI/20.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25310,
    name: "Dinosaur Tycoon",
    code: "42",
    status: "OPEN",
    icon: "11/JILI/42.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25311,
    name: "Jackpot Fishing",
    code: "32",
    status: "OPEN",
    icon: "11/JILI/32.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25312,
    name: "Dragon Fortune",
    code: "60",
    status: "OPEN",
    icon: "11/JILI/60.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "6/7/24, 10:14 AM"
  },
  {
    id: 25313,
    name: "Mega Fishing",
    code: "74",
    status: "OPEN",
    icon: "11/JILI/74.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25314,
    name: "Boom Legend",
    code: "71",
    status: "OPEN",
    icon: "11/JILI/71.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25315,
    name: "Happy Fishing",
    code: "82",
    status: "OPEN",
    icon: "11/JILI/82.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25316,
    name: "All-star Fishing",
    code: "119",
    status: "OPEN",
    icon: "11/JILI/119.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25368,
    name: "Royal Fishing",
    code: "1",
    status: "OPEN",
    icon: "11/JILI/1.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25372,
    name: "Dinosaur Tycoon II",
    code: "212",
    status: "OPEN",
    icon: "11/JILI/212.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  }
]);
const pokerGameJILIList = ref([
  {
    id: 25379,
    name: "Teen Patti",
    code: "72",
    status: "OPEN",
    icon: "11/JILI/097df233-0329-427c-a596-9af968062624.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25380,
    name: "Teen Patti Joker",
    code: "159",
    status: "OPEN",
    icon: "11/JILI/cbde9c3f-325f-4b11-9cda-7e8a8a3d147d.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25382,
    name: "Ludo Quick",
    code: "163",
    status: "OPEN",
    icon: "11/JILI/acd9b0fd-625d-4fb2-ae19-5e69b34e6700.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25383,
    name: "Andar Bahar",
    code: "79",
    status: "OPEN",
    icon: "11/JILI/5d214dcd-08fb-4c54-b808-12c55ac19473.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25384,
    name: "TeenPatti 20-20",
    code: "161",
    status: "OPEN",
    icon: "11/JILI/c3a5ab4f-19f8-4299-b046-1fc4ea38ef4c.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25387,
    name: "Baccarat",
    code: "152",
    status: "OPEN",
    icon: "11/JILI/ba81c2f8-dcaa-4de0-982c-7e198fa3c8fe.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:32 AM"
  }
]);

const loadJILIFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JILI_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
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
      fishGameJILIList.value = [];
      fishGameJILIList.value = res;
    });
};

const loadJILIPokerhGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JILI_POKER_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
          params: {
            platformId: 8,
            gameType: "POKER",
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
      pokerGameJILIList.value = [];
      pokerGameJILIList.value = res;
    });
};

const fishGameJDBList = ref([
  {
    id: 25188,
    name: "Cai Shen Fishing",
    code: "7003",
    status: "OPEN",
    icon: "11/JDB/7003.png",
    sequence: 1123,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25189,
    name: "Shade Dragons Fishing",
    code: "7004",
    status: "OPEN",
    icon: "11/JDB/7004.png",
    sequence: 1124,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25190,
    name: "Fishing YiLuFa",
    code: "7005",
    status: "OPEN",
    icon: "11/JDB/7005.png",
    sequence: 1125,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25191,
    name: "Dragon Master",
    code: "7006",
    status: "OPEN",
    icon: "11/JDB/7006.png",
    sequence: 1126,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  }
]);

const loadJDBFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JDB_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
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
      fishGameJDBList.value = [];
      fishGameJDBList.value = res;
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
  const key = `${platformGamesApiKey}_GAMES_${code}_${gameType}_${regDevice}`;

  // cached
  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
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
// const isImportantAnnoucementModal = ref(false);
// const homePopupImg = ref("");
// const homePopupContent = ref("");
// const homePopupType = ref("");
// const homePopupId = ref(0);
// const homePopupFrequency = ref(0);
// const homePopupFrequencyNum = ref(0);

// const setExpiryBanner = () => {
//   if (homePopupFrequencyNum.value !== 0) {
//     setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
//   }
//   isImportantAnnoucementModal.value = false;
// };

// const setWithExpiry = (key, value, interval) => {
//   // Create a new date object in GMT+5.5
//   const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));

//   const item = {
//     value: value,
//     expiry: now.getTime() + interval,
//     id: homePopupId.value,
//     frequency: homePopupFrequency.value
//   };
//   sessionStorage.setItem(key, JSON.stringify(item));
// };

function loadData() {
  const params = {
    category: "HOME",
    language: languageVal.value
  };
  api
    .get("/opt-session/promo/banner", { params })
    .then((res) => {
      if (res.code === 0) {
        banners.value = [];
        banners.value = res.data;

        extractColors();
        // banners.value = [
        //   {
        //     promoPageId: null,
        //     mobileImageUrl: "home-banner-01.jpg",
        //     redirectUrl: "",
        //     category: "HOME"
        //   }
        // ];
      } else {
      }
    })
    .catch(() => {});
}

var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";

var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
var platformGamesApiKey = store.hasToken() ? "LOGGEDPLATFORMGAMES" : "PLATFORMGAMES";

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
      livecasino.value = [];
      slot.value = [];
      sport.value = [];
      // console.log(pf);

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
        if (platTypes.indexOf("SLOT") > -1 || (platTypes.indexOf("CASUAL") > -1 && element.code !== "Spribe")) {
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

      // console.log("After");
      // console.log(JSON.stringify(slot.value));
      loadHotGameList();
    })
    .catch((err) => {});
};

const announcementList = ref([]);
const announcementTypes = ref([]);
function checkTime(time) {
  const givenDate = new Date(time);
  const today = new Date();
  today.setDate(today.getDate() - 1);
  // console.log("Given:", givenDate);
  // console.log("Today:", today);
  return (
    givenDate.getFullYear() === today.getFullYear() &&
    givenDate.getMonth() === today.getMonth() &&
    givenDate.getDate() === today.getDate()
  );
}
function getPreview(content, length = 0) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const textOnly = div.textContent || div.innerText || "";
  return textOnly.slice(0, length) + "...";
}
const hasNewAnnouncements = ref(false);
const loadAnnouncement = () => {
  api.get("/announcement").then((res) => {
    if (res.code === 0) {
      if (res.data.announcements) {
        const d = res.data.announcements;

        const stored = localStorage.getItem("announcementList");
        if (stored) {
          announcementList.value = JSON.parse(stored);
        } else {
          announcementList.value = d;
        }
        checkForNewAnnouncements();
        currentAnnouncement.value = announcementList.value[0];
        startRotation();
      }
      if (res.data.type) {
        announcementTypes.value = res.data.type;
        activeKey.value = res.data.type[0].id;
      }
    }
  });
};
const checkForNewAnnouncements = () => {
  hasNewAnnouncements.value = announcementList.value.some((ann) => checkTime(ann.createTime) && !ann.hasBeenExpanded);
};
const page = ref(1);
const pageSize = 5;

const paginatedAnnouncements = computed(() => {
  const start = (page.value - 1) * pageSize;
  return announcementList.value.slice(start, start + pageSize);
});

const maxPage = computed(() => Math.ceil(announcementList.value.length / pageSize));
function toggleExpanded(index) {
  const indexWithPagination = (page.value - 1) * pageSize + index;
  const targetAnouncement = announcementList.value[indexWithPagination];
  targetAnouncement.hasBeenExpanded = true;
  targetAnouncement.expanded = !targetAnouncement.expanded;
  checkForNewAnnouncements();
  saveToLocalStorage();
}
function saveToLocalStorage() {
  localStorage.setItem("announcementList", JSON.stringify(announcementList.value));
}
const currentIndex = ref(0);
const currentAnnouncement = ref(announcementList.value[0]);
let interval = null;

const startRotation = () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % announcementList.value.length;
    currentAnnouncement.value = announcementList.value[currentIndex.value];
  }, 2000); // 2 seconds
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

const gotoSignIn = () => {
  router.push("/login");
};

const gotoSignUp = () => {
  router.push("/register");
};

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
    const res = await api.get(`/app/india/getAppData?affiliateCode=${affiliateCode}`);
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

const openDownloadPage = () => {
  window.open(download_url.value, "_system");
  isAppUpdateModal.value = false;
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
  if (text === "JiliGames") {
    text = "JILI";
    // } else if (text.startsWith("WC")) {
    //   return text.substring(2);
  }

  // if (window.innerWidth <= 450) {
  //   return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  // } else {
  //   return text;
  // }
};

const closeDepositDialog = () => {
  depositDialog.value = false;
};

const toggleCSTab = () => (isCsTabVisible.value = !isCsTabVisible.value);
const closeCSTab = () => isCsTabVisible.value && (isCsTabVisible.value = false);
onClickOutside(csTabRef, closeCSTab);
useEventListener(document, "scroll", closeCSTab);

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

const openCharityUrl = () => {
  window.open(ui.charityUrl, "_blank");
};

const moveCharityGif = (ev) => {
  isDraggingCharityGif.value = ev.isFirst !== true && ev.isFinal !== true;

  charityDragPos.value = [charityDragPos.value[0] - ev.delta.x, charityDragPos.value[1] - ev.delta.y];
};

const moveCsIcon = (ev) => {
  isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};

const moveLiveIcon = (ev) => {
  isDraggingLiveIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  liveDragPos.value = [liveDragPos.value[0] - ev.delta.x, liveDragPos.value[1] - ev.delta.y];
};

const moveHbIcon = (ev) => {
  isDraggingHbIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  hbDragPos.value = [hbDragPos.value[0] - ev.delta.x, hbDragPos.value[1] - ev.delta.y];
};

const openLiveInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};

const pushNotificationData = ref();

const populatePushNotificationData = (data) => {
  pushNotificationData.value = data;
};

const initOneSignal = () => {
  OneSignal.initialize("3670fee8-23c0-465f-b067-03add84e835e");

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
      console.log(data);
      var url = data.liveUrl1;
      ui.CSAUrl = url;

      if (data.studioUrl) {
        var lvUrl = data.studioUrl;
        ui.LiveUrl = lvUrl;
        isLiveUrlShow.value = true;

        csDragPos.value = [10, 70];
      }
    });
};

const floatPromo = ref([]);
const hbPromo = computed(() => {
  const result = [...floatPromo.value];
  if (isCharityShow.value) {
    result.push({
      type: "DOMAIN",
      code: ui.charityUrl,
      icon: require("../assets/images/index/charity-float.gif")
    });
  }
  return result;
});

const checkHbPromo = () => {
  api
    .get("/redirect")
    .then((res) => {
      return res;
    })
    .then((data) => {
      // isHbShow.value = data.data.some((item) => item.code === "pak-redpacketrain");
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

// Pop out ads banner
const isImportantAnnoucementModal = ref(false);
const homePopupImg = ref("");
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const homePopupLink = ref("");
const homePopupLinkOut = ref(false);

const setExpiryBanner = () => {
  isImportantAnnoucementModal.value = false;
};

const setWithExpiry = (key, value, interval) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + interval,
    id: homePopupId.value,
    frequency: homePopupFrequency.value
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const isImpt = getWithExpiry("isImpt");

const checkShowImgTop = () => {
  const isImpt = getWithExpiry("isImpt");
  api
    .get("/member/ads-popout")
    .then((res) => {
      if (res.code === 0) {
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
          isImportantAnnoucementModal.value = true;
          homePopupImg.value = imgURLPromo + res.data["mobileImgUrl"];
          homePopupContent.value = res.data["content"];
          homePopupType.value = res.data["type"];
          homePopupId.value = res.data["id"];
          homePopupFrequency.value = res.data["frequency"];

          if (res.data["path"].includes("http")) {
            homePopupLink.value = res.data["path"];
            homePopupLinkOut.value = true;
          } else {
            homePopupLink.value = `/promo?name=${res.data["path"]}`;
          }

          if (homePopupFrequencyNum.value !== 0) {
            setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
          }

          isFirstView.value = true;
        }
      }
    })
    .catch(() => {});
};

const downloadHeart = ref(false);

// const getDownloadHeart = () => {
//   if (
//     ("standalone" in window.navigator && window.navigator.standalone) ||
//     (Platform.is.capacitor && Platform.is.android)
//   ) {
//     downloadHeart.value = false;
//   } else {
//     downloadHeart.value = true;
//   }
// };

const processedContent = (content) => {
  return content.replace(/\n/g, "<br>");
};

const mediaCode = ref("");

const gotoFloatPromo = (val) => {
  if (val.type === "PROMO" && val.code === "pak-redpacketrain") {
    // isMoneyRainModal.value = true;
    popupPromo.value = "money-rain";
  } else if (val.type === "PROMO" && val.code === "pak-mega-sharing-wheel") {
    megaSharingWheelDialogModel.value = true;
    popupPromo.value = "mega-sharing-wheel";
  } else if (val.type === "PROMO" && val.code === "pak-spin-lucky-wheel") {
    popupPromo.value = "spin-lucky-wheel";
    isShownSpinLuckyWheel.value = true;
  }

  if (val.type === "PROMO" && val.code === "interest-profit") {
    if (store.hasToken()) {
      router.push("/promo?name=interest-profit");
    } else {
      router.push("/promo");
    }
  } else if (val.type === "PROMO") {
    router.push(`/promo?name=${val.code}`);
  }

  if (val.type === "DOMAIN") {
    window.open(val.code, "_blank");
  }
  if (val.type === "VIDEO") {
    isMediaSettingsModal.value = true;
    mediaCode.value = val.code;
  }
};

function checkDepositStep() {
  if (isAdditionalDepositSteps.value) {
    const currentActiveStep = localStorage.getItem("newPlayerGuide");
    const completedGuide = localStorage.getItem("completeddepositguide");
    if (completedGuide === "true") {
      isAdditionalDepositSteps.value = false;
      updateCurrentStep("4");
    }
  }
}

function checkReferStep() {
  if (isAdditionalReferSteps.value && currentStep.value === "3") {
    const completedGuide = localStorage.getItem("completedreferguide");
    // alert("refer," + completedGuide);
    if (completedGuide === "true") {
      isAdditionalReferSteps.value = false;
      updateCurrentStep("5");
    }
  }
}

// const checkGameTipStep = () => {
//   const completedGuide = localStorage.getItem("completedlangguide");
//   if (completedGuide === "true" && currentStep.value === "2") {
//     updateCurrentStep("2");
//   }
// };

function checkWithdrawStep() {
  if (isAdditionalWithdrawSteps.value) {
    const completedGuide = localStorage.getItem("completedwithdrawguide");
    if (completedGuide === "true") {
      isAdditionalWithdrawSteps.value = false;
      updateCurrentStep("END");
      currentAdditionalStep.value = 1;
    }
  }
}

const checkNewGuideSteps = () => {
  checkDepositStep();
  checkReferStep();
  checkWithdrawStep();
};

// Keep watchers for real-time changes if necessary
watch(() => isAdditionalDepositSteps.value, checkDepositStep, { immediate: false });
watch(() => isAdditionalReferSteps.value, checkReferStep, { immediate: false });
watch(() => isAdditionalWithdrawSteps.value, checkWithdrawStep, { immediate: false });

const afterActivated = useCustomerTrigger(() => {
  checkShowImgTop();
  checkHbPromo();
});

const downloadAppRef = ref();

const checkSpinLuckyWheelPromoHomePopupCanShow = () => {
  if (!sessionStorage.getItem("SPIN_LUCKY_WHEEL_POPUP") && spinLuckyWheelPromoHomePopupRef.value) {
    spinLuckyWheelPromoHomePopupRef.value.checkIsCanShowPopup();
  }
};

const checkNewPlayerWheelPromoHomePopupCanShow = () => {
  if (!sessionStorage.getItem("NEW_PLAYER_WHEEL_POPUP") && newPlayerPromoHomePopupRef.value) {
    newPlayerPromoHomePopupRef.value.checkIsCanShowPopup();
  }
};
onActivated(async () => {
  nextTick(() => {
    if (
      LocalStorage.getItem("completeddepositguide") === "true" &&
      LocalStorage.getItem("completedreferguide") !== "true" &&
      LocalStorage.getItem("newPlayerGuide") === "4"
    ) {
      currentType.value = "refer";
      isAdditionalReferSteps.value = true;
      disableScroll();
      currentAdditionalStep.value = 1;
    }
  });
  // alert(currentStep.value);
  // alert(LocalStorage.getItem('completeddepositguide') === 'true')
  // alert(LocalStorage.getItem('completeddepositguide') === true)
  // if(LocalStorage.getItem('completeddepositguide') === 'true') {
  //   // updateCurrentStep("4");
  //   // handleAdditionalSteps(4);
  //   // currentType.value = 'refer'
  //   // isAdditionalReferSteps.value = true
  //   // disableScroll();
  //   // currentAdditionalStep.value = 1
  //   nextTick(() => {
  //     currentType.value = 'refer';
  //     isAdditionalReferSteps.value = true;
  //     disableScroll();
  //     currentAdditionalStep.value = 1;
  //   });
  // }
  // if (LocalStorage.getItem('completedreferguide') && LocalStorage.getItem('completedwithdrawguide')) {
  //   isAdditionalWithdrawSteps.value = false
  //   updateCurrentStep("END");
  //   currentAdditionalStep.value = 1
  // }

  checkNewGuideSteps();
  store.getUnreadTotal();
  checkHash();

  if (store.hasToken()) {
    await store.getMemberInfo();
  }
  if (store.hasToken()) {
    await showSpinWheel();
  }
  checkGoogleLoginSetPwd();

  if ((route.query.login === "true" || route.query.register === "true") && ui.annoyingType !== "NONE") {
    //TODO: change back.
    // popupPromo.value = "money-rain";
    popupPromo.value = "spin-lucky-wheel";
  }

  if (route.query.newPlayerGuide === "earn-money") {
    // debugger;
    closePlayerGuide();
  }

  if (store.hasToken() && ui.promo_megaspin === "1" && ui.annoyingType !== "NONE") {
    hasInviteWheelPromo.value = true;
  }

  if (route.query.token) {
    store.autoLogin(route.query.token);
    // checkSpinWheel();

    if (store.hasToken() && ui.promo_megaspin === "1" && ui.annoyingType !== "NONE") {
      hasInviteWheelPromo.value = true;
    }
  }
  afterActivated();

  if (!(Platform.is.android && Platform.is.capacitor) && !store.isFromGooglePackage && ui.annoyingType !== "NONE") {
    if (!sessionStorage.getItem("add_to_homescreen")) {
      setTimeout(() => {
        isAddToHomeScreen.value = true;
      }, 2000);
    }
  }
});

const afterMounted = useCustomerTrigger(loadCustomerAddress);

onMounted(() => {
  getPlatList();
  loadData();
  loadAnnouncement();
  checkPlatform();
  loadJILIFishGameList();
  loadJDBFishGameList();
  loadJILIPokerhGameList();
  ui.shouldFetchDownloadAppUrl = true;

  if (store.hasToken() && ui.annoyingType !== "NONE") {
    checkCodeBonusModal();
  }

  AOS.init();
  SwiperCore.use([Grid, Navigation, Pagination, A11y]);
  afterMounted();

  if (Platform.is.android && Platform.is.capacitor) {
    initOneSignal();
  }

  window.addEventListener("scroll", handleScroll);
});

watch(
  () => route.hash,
  (newHash, oldHash) => {
    // Check if the hash is different (including when it's empty)
    if (newHash !== oldHash) {
      checkHash();
    }
  }
);
watch(
  () => promoStore.isShownSpinLuckyWheel,
  async (val) => {
    await nextTick();
    if (val) checkSpinLuckyWheelPromoHomePopupCanShow();
  }
);
watch(
  () => promoStore.isShownNewPlayerWheel,
  async (val) => {
    await nextTick();
    if (val) checkNewPlayerWheelPromoHomePopupCanShow();
  }
);

watch(languageVal, loadData);
// watch(
//   () => route.query.register,
//   (newValue) => {
//     if (newValue === "true") {
//       if (!isAndroid()) {
//         isCongratsModal.value = true;
//       }
//     }
//   }
// );

const hasInviteWheelPromo = ref(false);

const handleReceiveCodeBonus = () => {
  router.push({ path: "/account", query: { openCodeModal: "true" } });
};
const handleNewPlayerDeposit = () => {
  router.push("/deposit?from=/home");
};
const checkCodeBonusModal = () => {
  eventapi.get("/session/promo-code-bonus/checkBonus").then((res) => {
    if (res.data.hasUnclaimed) {
      isShowCodeBonusModal.value = true;
    }
  });
};

const checkSpinWheel = () => {
  if (store.hasToken() && isAndroid()) {
    setTimeout(() => {
      showSpinWheel();
    }, 750);
  } else if (store.hasToken() && !isAndroid()) {
    setTimeout(() => {
      showCongratsModal();
    }, 500);
  }
};

const showSpinWheel = () => {
  eventapi
    .get("/new-user-roulette/init")
    .then((res) => {
      if (res.code === 0) {
        if (store.canClaimFtdPrivilege && isAndroid()) {
          isHasUnusedCoupon.value = true;
          store.hasUnusedCoupon = true;
        } else {
          store.hasUnusedCoupon = false;
        }
        if (store.canSpinPrivilegeCoupon && isAndroid()) {
          promoStore.addShownFloatingOrDialogList("newplayer-spin-wheel");
          popupPromo.value = "newplayer-spin-wheel";
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

// const showCongratsModal = () => {
//   eventapi.get("/new-user-roulette/init").then((res) => {
//     if (res.code === 0) {
//       if (res.data.hasUnusedCoupon === "YES" || res.data.showRoulette === "YES") {
//         // isCongratsModal.value = true;
//         isShowPrizeModal.value = true;
//           store.hasUnusedCoupon = true;
//         if (!promoStore.isShownSpinLuckyWheel) {
//           popupPromo.value = "newplayer-spin-wheel";
//         }
//       } else {
//           store.hasUnusedCoupon = false;
//       }
//     }
//   });
// };

const checkGoogleLoginSetPwd = () => {
  if (store.isGoogleLogin && store.isFirstLandOnHomePage) {
    api.get("/session/first-password").then((res) => {
      if (res.code === 0 && !res.data) {
        isShowSetFirstPw.value = true;
      }
    });
  }
};
</script>

<style scoped lang="scss">
.highlight-overlay {
  position: fixed;
  // top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  flex-direction: column;

  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 10px;
  top: 13%;
  .next-btm-btn {
    cursor: pointer;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    padding: 10px;
    font-family: Poppins;
    font-weight: 700;
    font-size: 2vh;
    line-height: 2vh;
    padding: 15px 35px;
    letter-spacing: 0px;
    text-align: center;
    color: #000000;
    border-radius: 8px;
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .videolink {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #f3d235cc;
    border-bottom: 1px solid #f3d235cc;
    font-family: Poppins;
    font-weight: 700;
    font-size: 1.5vh;
    line-height: 2vh;
    padding-bottom: 5px;
    cursor: pointer;

    img {
      width: 15px;
    }
  }
}

.highlight-box {
  width: 98%;
  margin: 0 auto;
  height: 340px;
  background: transparent;
  border: 2px dashed #5dcd77;
  box-shadow: 0px 0px 30px 0px #00e60091;
  border-radius: 10px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8); /* Creates the cutout effect */
  position: relative;
  margin-bottom: 10px;
  &:after {
    position: absolute;
    content: "";
    background: url(../assets/images/newplayerguide/finger.png) no-repeat center center;
    width: 10vh;
    background-size: contain;
    height: 10vh;
    bottom: 20vh;
    left: 10vh;
    animation: moveFinger 1.5s ease-in-out infinite;
  }
}
.q-page-container {
  min-height: 100vh;
}

.longer-swiper {
  height: calc(100vh - 380px);
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
      color: #b2bdbf;
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
      color: #b2bdbf;

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

.notice-outer {
  display: flex;
  margin-right: 0;
  padding-right: 0;
  margin-bottom: 10px;
}

.notice-download {
  display: flex;
  align-items: center;
  animation: beat 1.5s infinite;
  position: relative;
  .absolute-hot {
    position: absolute;
    right: -5px;
    top: 6px;
    width: 18px;
    height: unset;
    img {
      width: 100%;
    }
  }

  img {
    display: block;
    width: 32px;
    height: 32px;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}
.hometop-categories {
  // display: grid;
  // grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
  // grid-template-rows: auto auto; /* 2 rows */
  // gap: 15px;
  // margin-bottom: 20px;
  .category {
    // padding: 4vh 0;
    //   text-align: center;
    //   font-size: 20px;
    //   border-radius: 8px;
    // background-size: cover;
    // background-repeat: no-repeat;
    // min-height: 110px;
    img {
      width: 100%;
    }
    // @media screen and (min-width: 500px) {
    //   min-height: 150px;
    // }
    // position: relative;
    // background-position: center center;
    // background-size: contain;
    .cat-label {
      position: absolute;
      font-weight: bold;
      bottom: 10px;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      text-align: center;
    }
  }
}

.midd {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 8px 0 0 8px;
  overflow: hidden;

  margin-right: -10px;

  .station-notice-wrapper {
    display: flex;
    // background: #2e3037;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 2.05%,
      rgba(255, 255, 255, 0.05) 44.93%,
      rgba(255, 255, 255, 0.05) 53.13%,
      rgba(255, 255, 255, 0) 98.21%
    );
    background: #ffffff0f;

    gap: 5px;
    // padding: 5px 10px;
    padding: 0px 5px;
    margin-top: 2px;
    justify-content: center;
    align-items: center;

    .volume {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25px;
      width: 28px;
    }

    .marquee-container {
      .new-icon {
        position: absolute;
        width: 20px;
        top: -5px;
        display: none;
        &.show {
          display: block;
        }
        img {
          width: 100%;
        }
      }
      width: calc(100% - 28px);
      height: 25px;
      :deep(.marquee-text-content) {
        width: max-content;
      }
    }
    .marquee-text {
      line-height: 25px;
    }
    // .marquee-text {
    //   position: absolute;
    //   top: 30%; /* Start above the container */
    //   width: 100%;
    //   // animation: scroll-down 5s linear infinite;
    // }

    // @keyframes scroll-down {
    //   from {
    //     top: 30%;
    //   }
    //   to {
    //     top: -100%;
    //   }
    // }

    span {
      margin-right: 10px;
      cursor: pointer;
      // color: #5F6061;
      color: #ffffff80;
      font-family: "Poppins";
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      text-align: left;
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
.pagiantion {
  :deep(.q-btn) {
    background-color: #85c498;
  }
  :deep(.q-btn__content) {
    color: #000;
    font-size: 16px;
    font-weight: 900;
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
  color: #b2bdbf;
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
    color: #b2bdbf;

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
    color: #b2bdbf;
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
      color: #b2bdbf;
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
      color: #b2bdbf;
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
  // right: 20px;
  // top: 20px;
  right: 40px;
  top: 110px;
  z-index: 3;
  background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);

  padding: 5px;
  font-size: 10px;
}

.announcement-dialog {
  height: calc(100vh - 108px);
}
.announcement-top-img {
  width: 210px;
  top: -18px;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  img {
    width: 100%;
  }
}

.announcement-popout {
  // height: 470px;
  background: url(../assets/images/index/notice-bg.png) no-repeat center bottom;
  border-radius: 30px 30px 0 0;
  height: 580px;
  background-size: 100% 100%;
  padding-top: 40px;
}
.announcement-card {
  height: 100%;
  &.wPage {
    height: 85%;
  }
  // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  background: transparent;
  // padding: 120px 20px 20px 20px;

  // padding: 32% 10px 0px;

  padding: 33% 10px 5px;
  // overflow-y: auto;
  // background: transparent;
  // background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);

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

.announcement-card .q-card.announcement-item-card {
  // background: linear-gradient(90deg, rgba(220, 241, 105, 0.7) 0%, rgba(156, 242, 39, 0.7) 100%);
  background: #a7e0b8;

  border-radius: 24px;
  padding: 4px 12px;
  margin: 0 0 4px;
  display: flex;
  gap: 5px;
  &:last-child {
    margin: 0;
  }
  .lastitem {
    padding: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  &.isExpanded {
    display: block;
    .lastitem {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }
  }
  .announcement-new {
    // position: absolute;
    // top: 0;
    // left: 0;
    display: none;
    padding: 4px;
    background: #ff0000;
    border-radius: 10px;
    margin-right: 5px;
    &.show {
      display: block;
    }
  }
  .closemore-btns {
    max-width: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 70px;
    }
  }
  .announcement-icon {
    width: 40px;
    img {
      width: 100%;
    }
  }
  .text-title {
    font-weight: 900;
    font-family: "Inter";
    line-height: 19px;
    font-size: 16px;
  }
  .text-date {
    color: #6e6e6e;
    font-size: 10px;
    font-weight: bold;
    // position: absolute;
    // bottom: 10px;
    // left: 10px;
  }
  .text-caption {
    color: #312c2c;
    font-size: 14px;
    margin: 5px auto;
  }
}
.popout-dialog {
  width: 100%;
  max-width: 500px;
  position: relative;

  .popout-close {
    position: absolute;
    // right: 0px;
    // top: 80px;
    right: 15px;
    top: 15px;
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
  // height: 30px;
  // position: absolute;
  // top: 20px;
  // left: 50%;
  // transform: translateX(-50%);
  font-weight: 700;
  font-size: 20px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  .game-logo {
    width: 35vw;
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
.tac-footer {
  padding: 0 12px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  .b9game-logo {
    width: 50%;
    min-width: 150px;
  }
  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    a {
      width: min-content;
    }
    .gcb-logo {
      width: 25%;
      min-width: 100px;
      margin-right: 20px;
    }
    .eighteen-only-logo {
      width: 57px;
    }
  }
  .footer-content {
    margin-top: 24px;
    font-family: Poppins;
    font-weight: 400;
    line-height: 160%;
    letter-spacing: 0px;
    color: #ffffff80;
  }
  .copyright-txt {
    font-family: Poppins;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff80;
    margin-top: 28px;
    margin-bottom: 28px;
  }
}
</style>

<style lang="scss">
.q-carousel__slides-container {
  height: fit-content;
}
.swiper-slide,
.swiper-wrapper {
  height: fit-content;
}

.announcement-modal .q-dialog__inner {
  max-width: 500px;
  // max-height: 600px;
  margin: auto auto 0;
}
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
  width: calc(100% - 20px);
  margin: auto;
}

.hb-icon-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  background: url("../assets/images/index/hongbao-icon.gif") no-repeat center center;
  background-size: contain;
  position: relative;
}

.live-icon-wrapper {
  width: 63px;
  height: 70px;
  background: url("../assets/images/index/icon-live.png") no-repeat center center;
  background-size: contain;
  position: relative;
}

.charity-gif {
  pointer-events: none;
}

.cs-icon-wrapper {
  width: 55px;
  height: 55px;
  background: url("../assets/images/index/icon-cs.gif") no-repeat center center;
  background-size: contain;
  position: relative;
  aspect-ratio: 500/500;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }

  .cs-icon {
    position: absolute;
    width: 48px;
    height: 48px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;

    &.youtube {
      left: -60px;
      top: 65px;
    }

    &.tiktok {
      left: -70px;
      top: 13px;
      transition-delay: 0.2s;
    }

    &.whatsapp {
      left: -39px;
      top: -30px;
      transition-delay: 0.4s;
    }

    &.cs {
      top: -72px;
      left: 50%;
      transform: translateX(-50%);
      transition-delay: 0.6s;
    }
  }

  &.active {
    .cs-icon {
      pointer-events: unset;
      opacity: 1;
    }
  }
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

  .title-game {
    margin-left: -8px;
    margin-right: -8px;
    padding: 0px 12px 0px;
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: space-between;
    // background-image: url("../assets/images/index/title-bg.png");
    // background-repeat: no-repeat;
    // background-size: cover;
    // background-position: center center;

    .label-img {
      display: none;
      width: auto;
      height: 20px;
    }

    .txt-style {
      // font-family: "Dongle", sans-serif;
      // font-size: 16px;
      // font-weight: 700;
      // letter-spacing: 1px;
      // line-height: 1;
      // text-transform: uppercase;
      margin: 10px 0;
      color: #ffffff;
      font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-transform: uppercase;
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

.game-platform-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 6px;
  row-gap: 8px;
  margin-top: 10px;
  padding-bottom: 20px;
  width: 90%;
  margin: 0 auto;

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
      aspect-ratio: 1/1.2;
      background-size: cover;
      background-position: center center;
      position: relative;
      background-image: url("../assets/images/index/mini-game-bg.png");
      border-radius: 20px;

      // &.game-fish {
      //   aspect-ratio: 1/1.2;
      // }

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
      display: none;
      word-break: break-all;
      // justify-content: center;
      // background: linear-gradient(270deg, #370f59 -0.1%, #57009d 50.22%, #340c56 97.6%);
    }
  }
}

.platform-game-container {
  display: grid;
  padding-top: 12px;
  margin-bottom: 12px;
  // column-gap: 8px;
  min-height: 120px;
  gap: 8px;
  // row-gap: 16px;
  .swiper-slide {
    height: auto;
  }
  &.live-casino {
    padding-top: 8px;
    margin-bottom: 12px;
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
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 16px;
    .platform-game-img {
      height: 140px;

      @media (max-width: 375px) {
        max-height: 105px;
        height: auto;
      }
    }
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
      border-radius: 6px;
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
    > img {
      min-height: 145px;
    }

    &--img {
      background-size: 100% 100%;
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
      max-width: 100px;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}
.q-page-container {
  :not(.home-wrapper) > .floating-btn.scalable:first-child {
    border-radius: 10px 0 0 0;
  }
}
.floating-btn {
  &.scalable {
    transform-origin: center;
    transition: transform 0.5s ease-in-out;
    &.whitee {
      border-radius: 10px 0 0 10px;
      background: rgb(255 255 255 / 40%);
      padding: 5px 10px 3px;
    }
  }
  z-index: 2001;

  img {
    width: 100%;
    max-width: 100px;
    &.stickyopenclose {
      width: 15px;
      //  padding: 0px 40px;
    }
    &.open {
      transform: rotateZ(180deg);
      padding: 0px;
    }
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
  max-width: 500px !important;
}

.fullgame-wrapper {
  padding: 0;
  margin: 0;
  width: 100%;

  .fullgame-header {
    // background-image: url(../assets/images/index/fullgame-banner.jpg);
    position: sticky;
    top: 0px;
    // background: salmon;
    z-index: 99;
    // min-height: 200px;
    .back-top-logo {
      background: #323738;
      padding: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .back-header-btn {
        width: 40px;
        img {
          width: 100%;
        }
      }
    }
  }

  .fullgame-search {
    margin-top: 10px;
    // background: #1E1F24;
    background: #0b0b0c;
    border-radius: 4px;
    background: #292d2e;
    border: 1px solid #ffffff14;
  }
}

.burning-hot {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.cat-selection-wrapper {
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 2px;
  background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);
  margin-bottom: 15px;

  &:before {
    content: "";
    position: absolute;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: -1;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
  }

  .swiper-wrapper {
    padding: 0 36px;
    background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);
    border-radius: 8px;
  }

  .swiper-slide {
    background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);
    border-radius: 8px;
  }

  .swiper-button-next {
    right: 5px;
    top: 20px !important;
    height: 100% !important;
    &:after {
      content: "";
      background-image: url("../assets/images/index/nav-icon-right.png");
      background-size: cover;
      height: 12px;
      width: 14px;
      font-size: 0;
      background-repeat: no-repeat;
    }
  }
  .swiper-button-prev {
    left: 5px;
    top: 20px !important;
    height: 100% !important;
    &:after {
      content: "";
      background-image: url("../assets/images/index/nav-icon-left.png");
      background-size: cover;
      height: 12px;
      width: 14px;
      font-size: 0;
      background-repeat: no-repeat;
    }
  }

  // .swiper-scrollbar.swiper-scrollbar-horizontal {
  //   // bottom: 0px;
  //   // background: rgba(43, 55, 74, 0.6);
  //   // padding: 2px;
  //   // height: 10px;
  // }

  .swiper-scrollbar-drag {
    // background: rgba(255, 255, 255, 0.4);
    background: transparent;
  }
}

.menu-category-btn {
  // background-image: url("../assets/images/index/category/menu-category-btns.png");
  background-size: 156px 379px;
  background-position: 0px 0px;
  width: 73px;
  height: 55px;
  background-repeat: no-repeat;

  // &.cat-lobby {
  //   background-position: -83px 0px;

  //   &.active {
  //     background-position: 0px 0px;
  //   }
  // }

  // &.cat-hot {
  //   background-position: -83px -65px;

  //   &.active {
  //     background-position: 0px -65px;
  //   }
  // }

  // &.cat-casino {
  //   background-position: -83px -130px;

  //   &.active {
  //     background-position: 0px -130px;
  //   }
  // }

  // &.cat-slot {
  //   background-position: -83px -195px;

  //   &.active {
  //     background-position: 0px -195px;
  //   }
  // }

  // &.cat-fishing {
  //   background-position: -83px -260px;

  //   &.active {
  //     background-position: 0px -260px;
  //   }
  // }

  // &.cat-sport {
  //   background-position: -83px -325px;

  //   &.active {
  //     background-position: 0px -325px;
  //   }
  // }
}

.cat-menu-item {
  img {
    width: 100%;
  }
}

.cat-selection-item {
  padding-top: 4px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: 0.3s all;
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 2px;
    // background: salmon;
    background: linear-gradient(
      180deg,
      rgba(115, 115, 115, 0) 0%,
      rgba(153, 153, 153, 0.4) 48.5%,
      rgba(115, 115, 115, 0) 100%
    );
  }

  &.active {
    background: linear-gradient(180deg, rgba(97, 255, 0, 0) 0%, rgba(97, 255, 0, 0.25) 50.5%, rgba(97, 255, 0, 0) 100%);

    &:before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      background: #61ff00;
      border-radius: 4px;
    }

    .cat-title {
      color: #ffffff;
    }
  }

  &:hover {
    filter: brightness(1.2);
  }

  .cat-icon {
    height: 28px;
    display: flex;
    align-items: center;

    img {
      display: block;
      width: 100%;
      max-width: 28px;
    }
  }

  .cat-title {
    font-size: 12px;
    font-weight: 400;
    color: #bfc3c9;
    font-family: "Poppins", sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
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
  background: transparent;
  // background-image: url("../assets/images/index/item-game-maintenance.png");
  border-radius: 8px;
  height: 100px;
  &.pokerportion {
    height: 140px;
  }
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
  padding: 8px;
  border-radius: 8px;
  position: relative;
  transition: 0.3s all;
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  box-shadow: 0px 2px 0px 0px #1cca6a;
  text-transform: uppercase;
  font-weight: 700;
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
  // padding-top: 16px;

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

.alert-img {
  // background-color: salmon;
  // width: 70% !important;
  // margin: auto;
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

.modal-home-popup {
  .q-card {
    background: transparent;
  }
}

// congrats container
// .congrats-button {
//   position: absolute;
//   bottom: -60px;
//   left: 50%;
//   transform: translateX(-50%);
// }

.congrats-button {
  position: absolute;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.congrats-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.congrats-container {
  background-image: unset;
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 350px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  height: unset;
  aspect-ratio: unset;

  &:before {
    content: "";
    background-image: url(../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -158px;
  }

  // .congrats-header {
  //   display: flex;
  //   justify-content: center;
  //   margin-top: -26px;
  //   z-index: 2;

  //   img {
  //     display: block;
  //     width: 100%;
  //     max-width: 320px;
  //   }
  // }

  .congrats-heading {
    font-family: Poppins;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    text-transform: uppercase;
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  .congrats-highlight-txt,
  .congrats-highlight {
    color: #fff96f;
    font-size: 45px;
    text-align: center;
    // background: linear-gradient(90deg, transparent, #fff96f29, transparent);
    background-image: url(../assets/images/index/modal/green-congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
    position: relative;
    text-align: center;
    top: unset;
    left: 0;
    transform: unset;
    bottom: unset;
    margin: 16px auto;
  }

  .congrats-highlight-txt {
    font-size: 14px;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.congrats-button-container {
  // position: absolute;
  // bottom: -60px;
  // left: 50%;
  // transform: translateX(-50%);
  // white-space: nowrap;
  margin: 20px auto 0;
  text-align: center;
  .congrats-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000a01;
  }
}

.luckyspin-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.luckyspin-header {
  margin: 0 auto -7%;
  width: 90%;
  z-index: 2;
  img {
    display: block;
    width: 100%;
  }
}

.luckyspin-container {
  background-image: url(../assets/images/index/modal/luckyspin-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  background-color: #113413;
  max-width: 360px;
  width: 100%;
  padding: 16px;
  position: relative;
  // overflow: visible !important;
  border-radius: 12px;
  padding: 30px 16px 16px 16px;

  .luckyspin-title {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}

.money-rain-close {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: all;
}

.hb-float {
  position: relative;
  height: 100px;
  width: 100px;
  background: transparent;
  overflow: hidden;

  .q-carousel__control {
    display: none;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}
.mega-sharing-wheel-dialog-close {
  position: absolute;
  top: 16px;
  right: 0;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: all;
}
/* Keyframe animation to simulate finger moving towards the button */
@keyframes moveFinger {
  0% {
    bottom: 60%; /* Start position */
    right: -7vh; /* Start on the right */
  }
  25% {
    bottom: 55%; /* Move up slightly */
    right: -6vh; /* Move left slightly (towards the center) */
  }
  50% {
    bottom: 50%; /* Move up further */
    right: -5vh; /* Move further left */
  }
  75% {
    bottom: 55%; /* Move back down slightly */
    right: -6vh; /* Move back to the center */
  }
  100% {
    bottom: 60%; /* End position */
    right: -7vh; /* Back to the original position on the right */
  }
}
</style>

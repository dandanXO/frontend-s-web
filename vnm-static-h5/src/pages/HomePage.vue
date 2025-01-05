<template>
  <!-- TODO: -->
  <select v-if="store.token && store.memberType === 'TEST'" v-model="ui.edition">
    <option value="NORMAL">normal</option>
    <option value="SLOT">slot</option>
  </select>
  <div v-if="isH5 && topBoxVisible" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="closeTopBox" />
      <img class="headicon" src="../assets/logo-web.svg" alt="download TF88" />
      <div class="download-txt-container">
        <span class="download-title">
          <div class="sm-screen-txt">{{ $t("lang.app_download_title") }}</div>
        </span>
        <span class="sm-screen-txt">{{ $t("lang.app_download_desc") }}</span>
      </div>
      <div class="buttons">
        <div class="buttons">
          <q-btn
            :href="`${downloadUrl}`"
            target="_blank"
            :label="$t('lang.dowload_now')"
            color="brightbtn"
            class="top-btn sm-screen-txt"
            no-caps
          />
        </div>
      </div>
    </div>
  </div>

  <div class="home-header">
    <div class="header-left" @click="router.push('/')">
      <img alt="TF88 logo" src="../assets/logo-web.svg" />
    </div>
    <div class="header-middle" v-if="!isLogined">
      <q-btn rounded no-caps color="brightbtn" class="sm-screen-txt" @click="router.push('/login')">
        {{ $t("lang.login") }}
      </q-btn>
      <q-btn rounded no-caps color="lightbluebtn" class="sm-screen-txt" @click="goToRegister">
        {{ $t("lang.register") }}
      </q-btn>
    </div>
    <div class="header-middle" v-else>
      <div @click="router.push('/account')">{{ $t("lang.helloUsername") }} {{ store.nickName }}</div>
    </div>
    <div class="header-lang">
      <LangOptions />
    </div>

    <!-- <div class="header-right" @click="router.push('/account/inbox?redirect=home')">
      <img class="btn-pointer" src="../assets/images/home/home-message-box.png" />
      <div class="red-dot" v-if="unreadInboxMail > 0" />
    </div> -->
  </div>

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
    />
  </q-carousel>

  <PushNotification :pushNotificationData="pushNotificationData" v-if="Platform.is.android && Platform.is.capacitor" />

  <div class="mid-announcement-section">
    <div ref="marqueeWrapperRef" class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <img src="../assets/images/home/announce-icon.png" alt="announcement" />
        </div>
        <div ref="marqueePseudoRef" class="marquee-pseudo">
          <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
            {{ a.content }}
          </span>
        </div>
        <marquee-text :repeat="5" :duration="marqueeDuration">
          <div v-if="announcementList">
            <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
              {{ a.content }}
            </span>
          </div>
        </marquee-text>
      </div>
    </div>
  </div>

  <div v-if="ui.edition === EDITION.NORMAL" class="hot-matches-wrapper">
    <div class="euro-countdown">
      <div class="euro-countdown-fly-01">
        <img src="../assets/images/home/eurocup-countdown-fly-01.png" />
      </div>
      <div class="euro-countdown-fly-02">
        <img src="../assets/images/home/eurocup-countdown-fly-02.png" />
      </div>
      <div class="euro-countdown-fly-03">
        <img src="../assets/images/home/eurocup-countdown-fly-03.png" />
      </div>
      <div class="euro-countdown-fly-04">
        <img src="../assets/images/home/eurocup-countdown-fly-04.png" />
      </div>
      <div class="euro-countdown-fly-05">
        <img src="../assets/images/home/eurocup-countdown-fly-05.png" />
      </div>
      <div class="euro-countdown-fly-06">
        <img src="../assets/images/home/eurocup-countdown-fly-06.png" />
      </div>
      <!--      <div class="euro-countdown-content">-->
      <!--        <img src="../assets/images/home/eurocup-countdown-content-empty.png" />-->

      <!--        <div class="euro-countdown-txt">-->
      <!--          <div class="txt-logo">-->
      <!--            <img src="../assets/images/home/eurocup-countdown-logo.png" style="width: 60px" />-->
      <!--          </div>-->
      <!--          <div class="txt-2024"><img src="../assets/images/home/eurocup-countdown-2024.png" style="width: 60px" /></div>-->

      <!--          <div class="euro-countdown-num-wrap">-->
      <!--            {{ $t("lang.euroCountdown01a") }}-->
      <!--            <div class="euro-countdown-num">-->
      <!--              &lt;!&ndash; <img src="../assets/images/home/eurocup-countdown-numbers.png" /> &ndash;&gt;-->
      <!--              <div class="num">-->
      <!--                <span>{{ countDay01 }}</span>-->
      <!--              </div>-->
      <!--              <div class="num">-->
      <!--                <span>{{ countDay02 }}</span>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            {{ $t("lang.euroCountdown02") }}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>

    <!-- <div class="euro-countdown">
      <span>{{ $t("lang.euroCountdown01")}}</span><img src="../assets/images/home/eurocup-logo.png" /><em>{{ $t("lang.euroCountdown01a")}}</em><strong>{{ countDay }}</strong><span>{{$t("lang.euroCountdown02")}}</span>
    </div> -->

    <!--    <div class="hot-matches-title-wrapper">-->
    <!--      <div class="hot-matches-title">-->
    <!--        <div>-->
    <!--          <img src="../assets/images/home/icon-hot-matches.png" />-->
    <!--        </div>-->
    <!--        {{ $t("lang.hotMatches") }}-->
    <!--      </div>-->

    <!--      <div>-->
    <!--        <q-btn @click="playGame('', 'SABA', '')" rounded no-caps color="brightbtn" class="sm-screen-txt">-->
    <!--          {{ $t("lang.bet_now") }}-->
    <!--        </q-btn>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="hot-matches-container">
      <swiper
        :slides-per-view="1"
        :modules="modules"
        :loop="false"
        @swiper="onSwiper"
        effect="fade"
        :auto-height="false"
        :allow-slide-next="true"
        :pagination="{ clickable: true, type: 'bullets' }"
        :space-between="10"
        class="hot-matches-carousel"
      >
        <swiper-slide v-for="(item, index) in hotMatches" :key="index" :name="index" class="hot-matches-slide">
          <div class="hot-matches-item">
            <div class="top-match-title">
              <div class="title-frame">{{ item.competitionName }}</div>
            </div>
            <div class="team-details team-details__home">
              <div class="team-icon">
                <img :src="hotMatchesImgURL + item.teamOneLogo" :alt="item.teamOneName" />
              </div>
              <div class="team-name">{{ item.teamOneName }}</div>
            </div>
            <div class="match-details">
              <div class="match-vs"><img src="../assets/images/home/icon-vs.png" alt="matchup" /></div>
              <div class="match-time">{{ formattedTime(item.competitionTime) }}</div>
              <div class="match-btn">
                <q-btn
                  rounded
                  no-caps
                  color="brightbtn"
                  class="sm-screen-txt match-btn-button"
                  @click="openHotMatch(item)"
                >
                  {{ $t("lang.play_now") }}
                </q-btn>
              </div>
            </div>
            <div class="team-details team-details__away">
              <div class="team-icon">
                <img
                  :src="hotMatchesImgURL + item.teamTwoLogo"
                  :style="item.teamTwoName === 'FC Tokyo' ? 'transform: scale(1.45);' : ''"
                  :alt="item.teamTwoName"
                />
              </div>
              <div class="team-name">{{ item.teamTwoName }}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <template v-else-if="ui.edition === EDITION.SLOT">
    <SlotGameList
      :slot-platforms="slot"
      @game-click="playGame"
      @platform-click="(code) => router.push({ path: '/slot', query: { platform: code } })"
    />
    <SlotPromotion />
  </template>
  <!--  <div class="details-bar">-->
  <!--    <div class="message" @click="refreshBalance">-->
  <!--      <span class="main-balance" :class="!store.token ? 'main-nologin' : ''">-->
  <!--        {{-->
  <!--          store.token-->
  <!--            ? !isLoadingBalance-->
  <!--              ? "VNDP " + mainWallet.toLocaleString("en-US", { maximumFractionDigits: 0 })-->
  <!--              : $t("lang.loading")-->
  <!--            : $t("lang.not_logged_in")-->
  <!--        }}-->
  <!--      </span>-->
  <!--      <span>{{ store.token ? $t("lang.central_wallet") : $t("lang.login_register_to_view") }}</span>-->
  <!--    </div>-->
  <!--    <div class="menulist">-->
  <!--      <router-link to="/finance/deposit?redirect=home" class="men btn-pointer">-->
  <!--        <img src="../assets/images/home/deposit-mid.png" />-->
  <!--        <div class="">{{ $t("lang.deposit") }}</div>-->
  <!--      </router-link>-->
  <!--      <router-link to="/finance/withdraw?redirect=home" class="men btn-pointer">-->
  <!--        <img src="../assets/images/home/withdraw-mid.png" />-->
  <!--        <div class="">{{ $t("lang.withdraw") }}</div>-->
  <!--      </router-link>-->
  <!--      <router-link to="/account/vip?redirect=home" class="men btn-pointer">-->
  <!--        <img src="../assets/images/home/vip-mid.png" />-->
  <!--        <div class="">{{ $t("lang.vip") }}</div>-->
  <!--      </router-link>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="home-game-section">
    <div class="game-left-list">
      <GameTab
        v-for="(_tab, index) in tabs"
        v-model="tab"
        :key="index"
        :id="`${_tab.code}-platform`"
        :code="_tab.code"
        :text="_tab.text"
        @click="selectTab(_tab.code)"
      />
    </div>

    <!--      <div @click="selectTab('cockfight')" class="game-platform btn-pointer" id="cockfight-platform">-->
    <!--        <template v-if="tab === 'cockfight'">-->
    <!--          <img src="../assets/images/home/games/cockfight-icon-active.png" />-->
    <!--        </template>-->
    <!--        <template v-else>-->
    <!--          <img src="../assets/images/home/games/cockfight-icon.png" />-->
    <!--        </template>-->
    <!--        <span :class="tab === 'cockfight' && 'active'">{{ $t("lang.menu_cockfighting") }}</span>-->
    <!--      </div>-->

    <div class="game-right-platform" v-scroll="onHomeScroll" id="id-right-platform">
      <div
        v-for="(gameList, listIndex) in fullGameList"
        :key="listIndex"
        :id="`${gameList.code}-lists`"
        class="game-lists fade-in-image"
      >
        <template v-if="gameList.code === 'cockfight' && gameList.list.length === 0">
          <GameList
            :game="{ icon: 'cockfight', name: 'ws' }"
            :text="$t('lang.coming_soon')"
            @click="isPlatformComingSoon = true"
          />
        </template>
        <template v-else-if="gameList.redirectUrl">
          <GameList
            v-for="(game, index) in gameList.list"
            :key="`${listIndex}-${index}`"
            :game="game"
            @click="router.push({ path: gameList.redirectUrl, query: { platform: game.code } })"
          />
        </template>
        <template v-else>
          <GameList
            v-for="(game, index) in gameList.list"
            :key="`${listIndex}-${index}`"
            :game="game"
            @click="playGame(game.gameName, game.code, game.gameCode)"
          />
        </template>
      </div>
    </div>
  </div>

  <div class="home-news">
    <div class="home-news-title-section">
      <div class="news-title">{{ $t("lang.tf88_news") }}</div>
      <div class="news-see-all">
        <q-btn rounded no-caps color="lightbluebtn" class="sm-screen-txt" @click="goToNewsPage">
          {{ $t("lang.see_all") }}
        </q-btn>
      </div>
    </div>
    <div class="home-news-top-container">
      <a
        :href="newsDetail_00.url"
        target="_blank"
        class="top-news"
        :style="{ backgroundImage: `url(${newsDetail_00.pictureurl})` }"
      >
        <div class="title-txt">{{ newsDetail_00.title }}</div>
      </a>
      <a
        :href="newsDetail_01.url"
        target="_blank"
        class="top-news"
        :style="{ backgroundImage: `url(${newsDetail_01.pictureurl})` }"
      >
        <div class="title-txt">{{ newsDetail_01.title }}</div>
      </a>
    </div>

    <div class="home-news-bottom-container">
      <a :href="newsDetail_02.url" target="_blank" class="bottom-news">
        <div class="news-img" :style="{ backgroundImage: `url(${newsDetail_02.pictureurl})` }"></div>
        <div class="news-txt">{{ newsDetail_02.title }}</div>
      </a>
      <a :href="newsDetail_03.url" target="_blank" class="bottom-news">
        <div class="news-img" :style="{ backgroundImage: `url(${newsDetail_03.pictureurl})` }"></div>
        <div class="news-txt">{{ newsDetail_03.title }}</div>
      </a>
      <a :href="newsDetail_04.url" target="_blank" class="bottom-news">
        <div class="news-img" :style="{ backgroundImage: `url(${newsDetail_04.pictureurl})` }"></div>
        <div class="news-txt">{{ newsDetail_04.title }}</div>
      </a>
      <a :href="newsDetail_05.url" target="_blank" class="bottom-news">
        <div class="news-img" :style="{ backgroundImage: `url(${newsDetail_05.pictureurl})` }"></div>
        <div class="news-txt">{{ newsDetail_05.title }}</div>
      </a>
    </div>
  </div>

  <div class="float-service" @click="toggleMenuFloat">
    <div class="float-btn"><img src="../assets/images/home/floating-btn.png" width="20px" /></div>
    <div class="float-menu" :class="isMenuFloat && 'show-menu'">
      <router-link to="/liveChat" class="menu-item">
        <img src="../assets/images/home/float-cs-01.png" alt="customer service" />
      </router-link>
      <a href="mailto:vnsupport@tf88.com" class="menu-item">
        <img src="../assets/images/home/float-cs-02.png" alt="vnsupport@tf88.com" />
      </a>
      <!-- <a href="tel:+84945091999" class="menu-item"><img src="../assets/images/home/float-cs-03.png" /></a> -->
      <a href="https://t.me/TF88_CS" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-04.png" alt="TF88_CS Telegram" />
      </a>
      <!-- <a href="https://chat.zalo.me/?phone=+639672541561" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-05.png" />
      </a> -->
      <a href="https://www.facebook.com/TF88vnofficial" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-06.png" alt="TF88 VNOfficial facebook" />
      </a>
    </div>
  </div>

  <q-page-sticky position="bottom-right" :offset="packetPos" style="z-index: 999">
    <div v-if="store && store.token && isRedPacketShow" @click="getRedEnvelope">
      <img src="../assets/images/home/redpacket.png" class="red-envelope" />
    </div>
  </q-page-sticky>

  <q-page-sticky v-if="showRocket" position="bottom-right" :offset="fabPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingRocketFab" v-touch-pan.prevent.mouse="moveRocketFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideRocket()"></q-btn>
      <q-carousel
        class="float"
        :navigation="gamePromo.length > 1 ? true : false"
        v-model="rocketSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        infinite
        size="xs"
      >
        <q-carousel-slide
          v-for="(game, i) in gamePromo"
          :key="i"
          :name="i"
          @click="playGame(game.platform, game.platform, game.code)"
        >
          <div class="rocket-wrapper">
            <div class="rocket"><img style="width: 75px" :src="`${imgURLFloat}/game/${game.icon}`" /></div>
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
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(promo, i) in floatPromo" :key="i" :name="i" @click="gotoFloatPromo(promo.code)">
          <div class="rocket-wrapper">
            <div class="rocket"><img style="width: 75px" :src="`${imgURLFloat}/promo/${currentPromo.icon}`" /></div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>
  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isRebateModalVisible"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%; padding: 0px" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div style="width: 16px">&nbsp;</div>
          <div class="titles">{{ $t("lang.menu_rebate") }}</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <div class="contents">{{ rebateAmt }}</div>
        <div class="btnsreas">
          <div class="confirmsbtns common-md-btn" @click="claimRebateAmt">{{ $t("lang.rebate_claim_now") }}</div>
          <div class="cancels common-md-white-btn" @click="isRebateModalVisible = false">{{ $t("lang.cancel") }}</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <GameModal ref="allGames"></GameModal>
  <AnnouncementModal />

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
          <div style="width: 16px">&nbsp;</div>
          <div class="titles">{{ $t("lang.system_hint") }}</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <div class="contents" style="font-size: 20px">{{ $t("lang.system_newversiondetected") }}</div>
        <div class="btnsreas">
          <div class="confirmsbtns common-md-btn" @click="openDownloadPage">{{ $t("lang.system_updatenow") }}</div>
          <div class="cancels common-md-white-btn" @click="cancelUpdate">{{ $t("lang.system_cancel") }}</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    width="100%"
    class="modal-common-div"
    v-model="isLoginModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">{{ $t("lang.system_please_login") }}</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn btn-standard-height" @click="router.push('/login')">
          {{ $t("lang.system_loginnow") }}
        </div>
        <div class="cacnels common-md-white-btn btn-standard-height" @click="isLoginModal = false">
          {{ $t("lang.system_cancel") }}
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="bg-primary text-black">
      <q-card-section class="q-mb-md">
        <q-tabs
          v-model="activeKey"
          dense
          class="text-white"
          active-color="white"
          indicator-color="white"
          align="justify"
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
        </q-tabs>

        <!-- <q-separator /> -->

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
            <q-list style="max-height: 65vh">
              <div v-for="(ann, idx) in announcementList" :key="idx">
                <span v-if="ann.typeId === tab.id">
                  <q-expansion-item
                    style="max-height: 65vh; overflow: auto"
                    group="somegroup"
                    icon="volume_up"
                    :label="ann.title"
                  >
                    <q-card>
                      <q-card-section style="background: transparent">
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

  <q-dialog width="100%" class="modal-home-popup" v-model="isImportantAnnoucementModal" persistent>
    <q-card style="width: 85%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <!-- <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div> -->
        <SitePopout :closePopout="setExpiryBanner" />
        <!-- <router-link class="promo-banner-container" :to="homePopupLink" :target="homePopupLinkOut ? '_blank' : '_self'">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" alt="popup" />
          </div>
        </router-link> -->
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" class="modal-update-div" v-model="isPlatformComingSoon" show-cancel-button>
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div style="width: 16px">&nbsp;</div>
          <div class="titles">{{ $t("lang.coming_soon") }}</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <div class="contents">{{ $t("lang.game_is_coming_soon") }}</div>
        <div class="btnsreas" style="justify-content: center">
          <div class="confirmsbtns common-md-btn" v-close-popup>{{ $t("lang.confirm") }}</div>
          <!-- <div class="cancels common-md-white-btn" @click="isRebateModalVisible = false">{{ $t("lang.cancel") }}</div> -->
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isWelcomeFlag"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
    persistent
    @hide="removeRouterWelcome"
  >
    <q-card style="width: 100%; border-radius: 15px; padding: 10px; background: none">
      <div class="modalcontent welcome">
        <div class="q-pa-sm" style="text-align: right; width: 100%">
          <q-btn class="color-font-1" border v-close-popup round dense icon="close" />
        </div>
        <div class="welcome-header">
          <div class="welcome-header__ball"><img src="../assets/images/welcome/ball.png" /></div>
          <div class="welcome-header__title">Đăng ký thành công</div>
        </div>
        <div class="section">
          <div class="section-card">
            <div class="main-header">{{ $t("lang.firstSlide") }}</div>
            <div class="main-text">{{ $t("lang.firstSlideContent") }}</div>
            <div class="slide-qr"><VueQRCodeComponent :size="70" :text="ui.downloadUrl" /></div>
            <div class="lastline">{{ $t("lang.firstSlideSub") }}</div>
          </div>
          <div class="section-card">
            <div class="main-header">{{ $t("lang.secondSlide") }}</div>
            <div class="main-text">{{ $t("lang.secondSlideContent") }}</div>
            <div class="slide-img"><img src="../assets/images/welcome/secondslideimg.png" /></div>
            <router-link to="/finance/deposit" class="deposit-btn">{{ $t("lang.depositNow") }}</router-link>
          </div>
        </div>
        <div class="section last">
          <div class="section-card">
            <div class="main-header">{{ $t("lang.thirdSlide") }}</div>
            <div class="main-text">{{ $t("lang.thirdSlideContent") }}</div>
            <div class="slide-img full"><img src="../assets/images/welcome/thirdslideimg.png" /></div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
import { computed, defineComponent, onActivated, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, eventapi } from "boot/axios";
import { cached } from "boot/cache";
import { Platform, useQuasar } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import LangOptions from "components/LangOptions";
import SitePopout from "components/modal/SitePopout.vue";
import AnnouncementModal from "components/modal/AnnouncementModal";
import MarqueeText from "vue-marquee-text-component";
import { App } from "@capacitor/app";

import { useUI } from "stores/ui";
// Import Swiper Vue.js components
import SwiperCore, {
  A11y,
  Controller,
  HashNavigation,
  Keyboard,
  Mousewheel,
  Scrollbar,
  Thumbs,
  Pagination,
  Navigation
} from "swiper";
import moment from "moment";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import { translateRecord } from "src/directives/translate";
import MaintenanceBox from "components/MaintenanceBox.vue";
import { useLocalStorage } from "@vueuse/core";
import OneSignal from "onesignal-cordova-plugin";

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);

import { Swiper, SwiperSlide } from "swiper/vue";
import PushNotification from "../components/modal/PushNotification.vue";
import "swiper/css/pagination";
import { isAndroid } from "src/boot/utils";
import { useI18n } from "vue-i18n";
import { EDITION } from "src/constant/edition";
import GameTab from "src/components/home/GameTab.vue";
import GameList from "src/components/home/GameList.vue";
import SlotPromotion from "src/components/home/slotEdition/SlotPromotion.vue";
import SlotGameList from "src/components/home/slotEdition/SlotGameList.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    // MaintenanceBox,
    GameModal,
    MarqueeText,
    LangOptions,
    Swiper,
    SwiperSlide,
    PushNotification,
    VueQRCodeComponent,
    GameTab,
    GameList,
    SlotPromotion,
    SlotGameList,
    SitePopout,
    AnnouncementModal
  },
  setup() {
    const { t } = useI18n();

    const isWelcomeFlag = ref(true);
    const isRebateModalVisible = ref(false);
    const rebateAmt = ref(0);
    const getRebateAmt = () => {
      if (store.hasToken()) {
        eventapi.get("/daily-rebate/available-amount").then((res) => {
          if (res.code === 0) {
            rebateAmt.value = res.data;
            isRebateModalVisible.value = true;
          } else {
          }
        });
      } else {
        isLoginModal.value = true;
      }
    };
    const claimRebateAmt = () => {
      eventapi.put("/bonus/claim/vnm-daily-rebate").then((res) => {
        if (res.code === 0) {
          isRebateModalVisible.value = false;
        } else {
        }
      });
    };
    const isFirstView = ref(false);
    const closeAlert = () => {
      localStorage.setItem("indexImgTop", new Date().getTime());
      isFirstView.value = false;
    };
    const thumbsSwiper = ref(null);
    const firstSwiper = ref(null);
    const secondSwiper = ref(null);

    const setFirstSwiper = (swiper) => {
      firstSwiper.value = swiper;
    };
    const setSecondSwiper = (swiper) => {
      secondSwiper.value = swiper;
    };

    const scrollToTop = (el) => {
      window.scrollTo(0, 0, "smooth");
    };

    const isScrolling = ref(false);
    const scrollToSlide = (slide_id) => {
      // debugger;
      isScrolling.value = true;
      var slideItem = document.getElementById(slide_id);
      var bodyElement = document.body;

      if (slideItem) {
        var divOffset = slideItem.getBoundingClientRect();
        var bodyOffset = bodyElement.getBoundingClientRect();

        var distanceToBodyTop = divOffset.top - bodyOffset.top;
        var y_axis = distanceToBodyTop - 8;

        window.scroll({
          top: y_axis,
          left: 0,
          behavior: "smooth"
        });
      }

      setTimeout(() => {
        isScrolling.value = false;
      }, 2000);
    };

    const onHomeScroll = (position) => {
      if (isSelecting.value === true) {
        return;
      }
      if (route.path === "/") {
        if (!isScrolling.value) {
          const rightPlatform = document.getElementById("id-right-platform");
          const platformBlocks = document.getElementsByClassName("platform-block");
          const blockHeight = platformBlocks ? (platformBlocks[0].offsetHeight / 4) * 3 : 75;

          var checkItem1 = document.getElementById("sport-lists");
          var checkItem2 = document.getElementById("live-lists");
          var checkItem3 = document.getElementById("slot-lists");
          var checkItem4 = document.getElementById("poker-lists");
          var checkItem5 = document.getElementById("esport-lists");
          var checkItem6 = document.getElementById("lottery-lists");
          var checkItem6half = document.getElementById("casual-lists");
          var checkItem7 = document.getElementById("fishing-lists");
          var checkItem8 = document.getElementById("cockfight-lists");

          var positionTop1 = checkItem1.getBoundingClientRect().top;
          var positionTop2 = checkItem2.getBoundingClientRect().top;
          var positionTop3 = checkItem3.getBoundingClientRect().top;
          var positionTop4 = checkItem4.getBoundingClientRect().top;
          var positionTop5 = checkItem5.getBoundingClientRect().top;
          var positionTop6 = checkItem6.getBoundingClientRect().top;
          var positionTop6half = checkItem6half.getBoundingClientRect().top;
          var positionTop7 = checkItem7.getBoundingClientRect().top;
          var positionTop8 = checkItem8.getBoundingClientRect().top;

          var bodyElement = document.body;
          var bodyOffset = bodyElement.getBoundingClientRect();
          var windowHeight = window.innerHeight;

          if (windowHeight + 15 > bodyOffset.bottom) {
            tab.value = "cockfight";
          } else if (0 > positionTop7 - 5 && positionTop8 >= blockHeight) {
            tab.value = "fishing";
          } else if (0 > positionTop6half - 5 && positionTop7 >= blockHeight) {
            tab.value = "casual";
          } else if (0 > positionTop6 - 5 && positionTop6half >= blockHeight) {
            tab.value = "lottery";
          } else if (0 > positionTop5 - 5 && positionTop6 >= blockHeight) {
            tab.value = "esport";
          } else if (0 > positionTop4 - 5 && positionTop5 >= blockHeight) {
            tab.value = "poker";
          } else if (0 > positionTop3 - 5 && positionTop4 >= blockHeight) {
            tab.value = "slot";
          } else if (0 > positionTop2 - 5 && positionTop3 >= blockHeight) {
            tab.value = "live";
          } else if (0 > positionTop1 - 5 && positionTop2 >= blockHeight) {
            tab.value = "sport";
          }
        }
      }
    };

    const setSelectedSwiper = (tab) => {
      if (tab === "sport") {
        // slideIndex = 0;
        scrollToSlide("sport-lists");
      }
      if (tab === "live") {
        scrollToSlide("live-lists");
      }
      if (tab === "poker") {
        scrollToSlide("poker-lists");
      }
      if (tab === "lottery") {
        scrollToSlide("lottery-lists");
      }
      if (tab === "slot") {
        scrollToSlide("slot-lists");
      }
      if (tab === "esport") {
        scrollToSlide("esport-lists");
      }
      if (tab === "fishing") {
        scrollToSlide("fishing-lists");
      }
      if (tab === "cockfight") {
        scrollToSlide("cockfight-lists");
      }
      if (tab === "casual") {
        scrollToSlide("casual-lists");
      }
    };

    const onSlideChange = (swiper) => {
      const activeIndex = swiper.activeIndex;
      const activeSlide = swiper.slides[activeIndex];
      const activeSlideClassName = activeSlide.className;
      const keywords = ["slot", "live", "sport", "esport", "slot", "others"];
      for (const keyword of keywords) {
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword;
        }
      }
    };

    const imgNotFound = require(`../assets/images/home/img-not-found.png`);

    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
    const cockfight = ref([]);
    const poker = ref([]);
    const lottery = ref([]);
    const slot = ref([]);
    const fishing = ref([]);
    const casuals = ref([]);

    const ui = useUI();
    const scrollPageRef = ref(null);
    const isH5 = ref(false);
    const topBoxVisible = ref(true);
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

      let downloadPopup = sessionStorage.getItem("DOWNLOAD_POPUP");
      if (downloadPopup) {
        topBoxVisible.value = false;
      }
      if (window.location.href.indexOf("tf88bof.com") > -1) {
        topBoxVisible.value = false;
      }
    };

    const $q = useQuasar();
    const banners = ref([]);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const mainWallet = computed(() => {
      return store.balance;
    });
    const isLogined = ref(false);

    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      // console.log(gameName)
      // console.log(platformCode)
      // console.log(gameCode)
      // console.log(gameStatus);
      allGames.value.open(gameName, platformCode, gameCode, gameStatus);
    };

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const imgURLFloat = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

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

    const isRedPacketShow = ref(false);
    const getRedEnvelope = () => {
      router.push("/promo?name=phongbao-lixi2/9");
    };

    const getCheckRedPacket = () => {
      if (store && store.token) {
        eventapi("/redPacketVip/nextRainTime?promoCode=OP_SPE_quockhanh2/9_2888VNDP_1VC_082024")
          .then((res) => {
            if (res.code === 0) {
              isRedPacketShow.value = res.data.nowIsRain;
            }
          })
          .catch((err) => {});
      }
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
      const lastTime = sessionStorage.getItem("indexImgTop");
      if (lastTime) {
        const diff = new Date().getTime() - Number(lastTime);
        if (diff > 1000 * 60 * 60 * 12) {
          isFirstView.value = true;
        }
      } else {
        let siteType;
        switch (ui.edition) {
          case EDITION.SLOT:
            siteType = "SLOT";
            break;
          case EDITION.NORMAL:
          default:
          // siteType = "HOME";
        }
        api
          .get("/member/ads-popout", { params: { siteType } })
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
                homePopupImg.value = imgURL + res.data["mobileImgUrl"];
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
      }
    };

    function loadData() {
      let params;
      switch (ui.edition) {
        case EDITION.SLOT:
          params = "SLOT";
          break;
        case EDITION.NORMAL:
        default:
          params = "HOME";
      }
      api
        .get("/opt-session/promo/banner", { params: { category: params } })
        .then((res) => {
          if (res.code === 0) {
            banners.value = res.data;
          }
        })
        .catch(() => {});
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
          esport.value = [];
          sport.value = [];
          livecasino.value = [];
          cockfight.value = [];
          poker.value = [];
          lottery.value = [];
          slot.value = [];
          fishing.value = [];
          casuals.value = [];

          pf.forEach((element) => {
            const platTypes = element.gameType.split(",");
            // console.log(platTypes);
            if (platTypes.indexOf("ESPORT") > -1) {
              var espObj = Object.assign({}, element);
              espObj.title_vn = espObj.name + " ESPORTS";
              espObj.title_en = espObj.name + " ESPORTS";
              espObj.icon = "esport";
              esport.value.push(espObj);
            }

            if (platTypes.indexOf("SPORT") > -1) {
              var spObj = Object.assign({}, element);
              if (spObj.name === "GFSBO") {
                spObj.name = "SBO";
              }

              spObj.title_vn = "Thể Thao " + spObj.name;
              spObj.title_en = "Sport " + spObj.name;
              spObj.icon = "sport";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);
              if (liveObj.alias) {
                liveObj.name = liveObj.alias;
              }
              if (liveObj.name === "AE") {
                liveObj.name = "Sexy";
              }
              liveObj.title_vn = liveObj.name + " Live Casino";
              liveObj.title_en = liveObj.name + " Live Casino";
              liveObj.icon = "live";
              livecasino.value.push(liveObj);
            }
            if (platTypes.indexOf("COCKFIGHT") > -1) {
              var cockObj = Object.assign({}, element);
              cockObj.title_vn = "ĐÁ GÀ";
              cockObj.title_en = "Cockfighting";
              cockObj.icon = "cockfight";
              cockfight.value.push(cockObj);
            }
            if (platTypes.indexOf("SLOT") > -1) {
              var slotObj = Object.assign({}, element);
              if (slotObj.name === "JiliGames") {
                slotObj.name = "Jili";
              }
              if (slotObj.name === "AG") {
                slotObj.name = "XIN";
              }
              slotObj.title_vn = slotObj.name + " Slots";
              slotObj.title_en = slotObj.name + " Slot";
              slotObj.icon = "slot";

              let slotItem = {
                id: slotObj.id,
                code: slotObj.code,
                icon: slotObj.name,
                title: slotObj.title
              };
              ui.slotLists.push(slotItem);
              slot.value.push(slotObj);
            }

            if (platTypes.indexOf("FISH") > -1 && element.code !== "AGF") {
              var fishObj = Object.assign({}, element);
              if (fishObj.name === "JiliGames") {
                fishObj.name = "Jili";
              }
              fishObj.title_vn = fishObj.name + " Bắn Cá";
              fishObj.title_en = fishObj.name + " Fishing";
              fishObj.icon = "fish";
              fishing.value.push(fishObj);
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              if (pokerObj.name === "Spribe") {
                pokerObj.title_vn = pokerObj.name;
                pokerObj.title_en = pokerObj.name;
              } else {
                pokerObj.title_vn = pokerObj.name + " Poker";
                pokerObj.title_en = pokerObj.name + " Poker";
              }
              pokerObj.icon = "poker";
              if (pokerObj.code === "GPI") {
                pokerObj.gameCode = "";
              }
              poker.value.push(pokerObj);
            }
            if (platTypes.indexOf("CASUAL") > -1) {
              var casualObj = Object.assign({}, element);

              casualObj.title_vn = casualObj.name + " Hash Game";
              casualObj.title_en = casualObj.name + " Hash Game";

              casualObj.icon = "casual";
              casuals.value.push(casualObj);
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              lottObj.title_vn = "Xổ Số " + lottObj.name;
              lottObj.title_en = "Lottery " + lottObj.name;
              lottObj.icon = "lottery";
              if (lottObj.code === "GPI") {
                lottObj.gameCode = "sode";
              }
              lottery.value.push(lottObj);
            }
          });

          esport.value = esport.value.sort((a, b) => {
            return a.sequence - b.sequence;
          });
        })
        .catch((err) => {});
    };

    const tab = ref("sport");
    const isSelecting = ref(false);
    const timerTimeout = ref(null);
    const selectTab = (item) => {
      if (timerTimeout.value) {
        clearTimeout(timerTimeout.value);
      }
      isSelecting.value = true;
      tab.value = item;
      setSelectedSwiper(item);

      timerTimeout.value = setTimeout(() => {
        isSelecting.value = false;
      }, 750);
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

    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
    };

    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      if (store.token) {
        isLoadingBalance.value = true;
        store.getBalance().then((res) => {
          isLoadingBalance.value = false;
        });
      } else {
        router.push("/login");
      }
    };

    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      let siteType;
      switch (ui.edition) {
        case EDITION.SLOT:
          siteType = "SLOT";
          break;
        case EDITION.NORMAL:
        default:
        // siteType = "HOME";
      }
      api.get("/announcement", { params: { siteType } }).then((res) => {
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
    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const activeKey = ref(null);
    const openPopup = (noticeType) => {
      if (noticeType) {
        noticeTitle.value = "Announcement";
        isStationNotice.value = true;
      }
    };

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    const getVersionNo = async () => {
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        var current_version = parseInt(info.version.replace(/\./g, ""));
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
        if (res.code === 0) {
          var version_info = res.data.version;
          var latest_ver_no = parseInt(version_info.replace(/\./g, ""));
          download_url.value = res.data.url;
          if (latest_ver_no > current_version) {
            isAppUpdateModal.value = true;
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

    const closeTopBox = () => {
      isH5.value = false;
      sessionStorage.setItem("DOWNLOAD_POPUP", "1");
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      api
        .get("/app/getAppData?siteCode=vnm&appType=ALL_SITE")
        .then((res) => {
          // console.log(res);
          downloadUrl.value = res.data.downloadPageUrl;

          ui.downloadUrl = downloadUrl.value;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getImgPlatformLogo = (platform, code, alias) => {
      try {
        return `${require(`../assets/images/home/${platform}/logo-${code.toLowerCase()}.png`)}`;
      } catch (e) {
        return `${require(`../assets/images/home/logo-empty.png`)}`;
      }
    };

    const getImgPlatformBg = (platform, code, alias) => {
      try {
        return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
      } catch (e) {
        return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
      }
    };

    // const unreadInboxMail = ref(0);
    // const getUnreadTotal = () => {
    //   if (store.token) {
    //     return api.get("/session/pm/inbox/getUnreadTotal").then((res) => {
    //       if (res.code === 0) {
    //         unreadInboxMail.value = res.data;
    //       }
    //     });
    //   }
    // };

    const pushNotificationData = ref();
    const populatePushNotificationData = (data) => {
      pushNotificationData.value = data;
    };

    const initOneSignal = () => {
      OneSignal.initialize("4ac990ad-4330-458a-94f6-ef9e1f28639e");

      let myClickListener = async function (event) {
        console.log("CLICK PUSH");
        let notificationData = event;
        console.log(notificationData);
        console.log(notificationData.notification.title);
        console.log(notificationData.notification.body);
        console.log(notificationData.notification.additionalData);
        populatePushNotificationData(notificationData.notification);
        // alert(notificationData.notification.title + notificationData.notification.body);
      };
      OneSignal.Notifications.addEventListener("click", myClickListener);

      // Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
      OneSignal.Notifications.requestPermission(true).then((accepted) => {
        console.log("User accepted notifications: " + accepted);
      });
    };

    const checkEdition = () => {
      if (route.name === "homeslot") {
        sessionStorage.setItem("HOME_EDITION", EDITION.SLOT);
        ui.edition = EDITION.SLOT;
      } else if (route.name === "home") {
        sessionStorage.setItem("HOME_EDITION", EDITION.NORMAL);
        ui.edition = EDITION.NORMAL;
      }
    };

    onMounted(() => {
      if (Platform.is.android && Platform.is.capacitor) {
        initOneSignal();
      }
      initFloating();
      checkEdition();

      // eventapi.get("/redPacketVip/nextRainTime?promoCode=vi-mualixi-redpacket").then((resp) => {
      //   console.log(resp);
      // })
      if (marqueePseudoRef.value) {
        new ResizeObserver(calculateMarqueeDuration).observe(marqueePseudoRef.value);
      }
    });

    watch(() => route.name, checkEdition);
    watch(
      () => ui.edition,
      () => {
        loadAnnouncement();
        loadData();
      }
    );

    onActivated(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
      getAppDownloadUrl();
      // getUnreadTotal();
      getNewsDetails();
      runMenuFloat();
      loadHotMatches();
      getCheckRedPacket();
      if (store.token) {
        isLogined.value = true;
        store.getUnreadTotal();
      } else {
        isLogined.value = false;
      }
      checkShowImgTop();
    });

    const runMenuFloat = () => {
      toggleMenuFloat();
      setTimeout(() => {
        toggleMenuFloat();
      }, 2000);
    };

    const isMenuFloat = ref(false);

    const toggleMenuFloat = () => {
      isMenuFloat.value = !isMenuFloat.value;
    };

    const isLoginModal = ref(false);

    const newsDetails = ref([]);
    const newsDetail_00 = ref([]);
    const newsDetail_01 = ref([]);
    const newsDetail_02 = ref([]);
    const newsDetail_03 = ref([]);
    const newsDetail_04 = ref([]);
    const newsDetail_05 = ref([]);

    const goToNewsPage = () => {
      window.open(newsDetail_00.value.url);
    };

    const gotoPromo = (banner) => {
      const urlSplit = banner.redirectUrl.split("|");
      if (urlSplit.length >= 2) {
        const type = urlSplit[0];
        if (type === "page") {
          router.push(`/${urlSplit[1]}`);
        } else {
          router.push(`/promo?name=${banner.redirectUrl}`);
        }
      } else {
        const openPattern = /^\/open\/(.*)/;
        if (banner.redirectUrl.match(openPattern)) {
          const extractedUrl = banner.redirectUrl.match(openPattern)[1];
          const [gameName, platformCode, gameCode] = extractedUrl.split("/");

          allGames.value.open(gameName, platformCode, gameCode, "OPEN");
        } else if (banner.redirectUrl.includes("https://")) {
          window.open(banner.redirectUrl, "_blank");
        } else {
          router.push(`/promo?name=${banner.redirectUrl}`);
        }
      }
    };

    const getNewsDetails = () => {
      api.get("/news").then((res) => {
        if (res.code === 0) {
          const filteredData = res.data.filter((item) => item.category.includes("Soi kèo bóng đá"));
          if (filteredData.length > 0) {
            newsDetails.value = filteredData;
            newsDetail_00.value = filteredData[0];
            newsDetail_01.value = filteredData[1];
            newsDetail_02.value = filteredData[2];
            newsDetail_03.value = filteredData[3];
            newsDetail_04.value = filteredData[4];
            newsDetail_05.value = filteredData[5];
          }
        }
      });
    };

    const isPlatformComingSoon = ref(false);

    const hotMatches = ref([]);

    const loadHotMatches = () => {
      api
        .get("/platform-competition")
        .then((res) => {
          if (res.code === 0) {
            hotMatches.value = res.data;
          }
        })
        .catch(() => {});
    };

    const hotMatchesImgURL = process.env.IMAGE_CDN + "/promo/";

    const openHotMatch = (item) => {
      if (!store.token) {
        router.push("/login");
      } else {
        console.log(item);
        playGame(item.platformName, item.platformCode, item.gameCode);
      }
    };

    const formattedTime = (timeString) => {
      if (!timeString) {
        return "";
      }

      const dateTime = moment(timeString, "YYYY-MM-DD HH:mm:ss").format("DD/MM HH:mm");
      return dateTime;

      // const dateTime = new Date(timeString);
      // const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}/${(dateTime.getMonth() + 1)
      //   .toString()
      //   .padStart(2, "0")}`;
      // const formattedTime = `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime
      //   .getMinutes()
      //   .toString()
      //   .padStart(2, "0")}`;
      //
      // return `${formattedDate} ${formattedTime}`;
    };

    const onSwiper = (swiper) => {};

    const modulesHot = [Navigation, Pagination];

    // const countDay = ref(25);
    const euroCupStartDate = moment("2024-06-15");
    const daysDiff = ref(euroCupStartDate.diff(moment(), "days"));

    if (daysDiff.value <= 0) {
      daysDiff.value = 0;
    }

    const countDayString = computed(() => {
      return daysDiff.value.toString().padStart(2, "0");
    });

    const countDay01 = computed(() => {
      return parseInt(countDayString.value.substr(0, 1));
    });

    const countDay02 = computed(() => {
      return parseInt(countDayString.value.substr(1, 1));
    });

    const selectedTab = ref();
    const tabs = computed(() => {
      let index = -1;
      const fixedTabs = [];
      const baseTabs = [
        { code: "sport", text: t("lang.menu_sports") },
        { code: "live", text: t("lang.menu_livecasino") },
        { code: "slot", text: t("lang.menu_slots") },
        { code: "poker", text: t("lang.menu_poker") },
        { code: "esport", text: t("lang.menu_esports") },
        { code: "lottery", text: t("lang.menu_lottery") },
        { code: "casual", text: t("lang.menu_hashgame") },
        { code: "fishing", text: t("lang.menu_others") }
      ];

      switch (ui.edition) {
        case EDITION.SLOT:
          index = baseTabs.findIndex((tab) => tab.code === "slot");
          break;
      }

      if (index > -1) {
        fixedTabs.push(baseTabs[index]);
        baseTabs.splice(index, 1);
      }

      return [...fixedTabs, ...baseTabs];
    });

    const fullGameList = computed(() => {
      let index = -1;
      const fixedGameList = [];
      const baseGameList = [
        { code: "sport", list: sport.value },
        { code: "live", list: livecasino.value },
        { code: "slot", list: slot.value, redirectUrl: "/slot" },
        { code: "poker", list: poker.value },
        { code: "esport", list: esport.value },
        { code: "lottery", list: lottery.value },
        { code: "casual", list: casuals.value, redirectUrl: "/minigame" },
        { code: "fishing", list: fishing.value, redirectUrl: "/fishing" },
        { code: "cockfight", list: cockfight.value }
      ];
      switch (ui.edition) {
        case EDITION.SLOT:
          index = baseGameList.findIndex((game) => game.code === "slot");
          break;
      }

      if (index > -1) {
        fixedGameList.push(baseGameList[index]);
        baseGameList.splice(index, 1);
      }

      return [...fixedGameList, ...baseGameList];
    });

    const removeRouterWelcome = () => {
      router.push("/");
    };

    const trackRegisterClickEvent = () => {
      if (ui.adjust_click_register_event && isAndroid()) {
        console.log("Track Click Reg");
        var adjustEvent = new AdjustEvent(ui.adjust_click_register_event);
        Adjust.trackEvent(adjustEvent);
      }
    };

    const goToRegister = () => {
      trackRegisterClickEvent();
      router.push("/register");
    };

    watch(countDayString, () => {
      countDay01.value = parseInt(countDayString.value.substr(0, 1));
      countDay02.value = parseInt(countDayString.value.substr(1, 1));
    });

    watch(
      () => route.query,
      (newQuery) => {
        if (newQuery.name === "welcome") {
          isWelcomeFlag.value = true;
        } else {
          isWelcomeFlag.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      () => store.token,
      () => {
        if (store.token) {
          isLogined.value = true;
        }
      }
    );
    const gotoFloatPromo = (code) => {
      router.push(`/promo?name=${code}`);
    };
    const floatPromo = [];
    const gamePromo = [];
    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      api
        .get("/redirect")
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              if (element.type === "PROMO") {
                floatPromo.push(element);
                showFloatPromo.value = true;
              }
              if (element.type === "GAME") {
                gamePromo.push(element);
                showRocket.value = true;
              }
            });
            checkShowRocket();
            checkFloatPromo();
            updatePromo(); // Initially update the displayed promo
            // Update the displayed promo every 5 seconds
            setInterval(updatePromo, 3000);
            updateRocket(); // Initially update the displayed promo
            // Update the displayed promo every 5 seconds
            setInterval(updateRocket, 3000);
          } else {
            ElMessage.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const updatePromo = () => {
      currentPromo.value = floatPromo[currentPromoIndex.value];
      currentPromoIndex.value = (currentPromoIndex.value + 1) % floatPromo.length;
    };

    const currentRocket = ref(null);
    const currentRocketIndex = ref(0);
    const updateRocket = () => {
      currentRocket.value = gamePromo[currentRocketIndex.value];
      currentRocketIndex.value = (currentRocketIndex.value + 1) % floatPromo.length;
    };
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const showRocket = ref(false);
    const checkShowRocket = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showRocket.value = true;
      // }
    };

    const hideRocket = () => {
      showRocket.value = false;
      promoPos.value = [18, 18];
    };

    const showFloatPromo = ref(false);
    const checkFloatPromo = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showFloatPromo.value = true;
      // }
      if (gamePromo.length === 0) {
        promoPos.value = [18, 18];
      }
    };

    const hideFloatPromo = () => {
      showFloatPromo.value = false;
    };
    const fabPos = ref([18, 0]);
    const promoPos = ref([18, 108]);
    const packetPos = ref([18, 18]);
    const draggingRocketFab = ref(false);
    const draggingPromoFab = ref(false);

    const currentElement = ref(null);
    const moveRocketFab = (ev) => {
      console.log(ev);
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingRocketFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = fabPos.value[0] - ev.delta.x;
      let newY = fabPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      fabPos.value = [newX, newY];
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

    const marqueePseudoRef = ref();
    const marqueeWrapperRef = ref();
    const marqueeDuration = ref(0);
    const calculateMarqueeDuration = () => {
      if (!marqueePseudoRef.value || !marqueeWrapperRef.value) return;
      const marqueeWidth = marqueePseudoRef.value.scrollWidth;
      const wrapperWidth = marqueeWrapperRef.value.clientWidth;
      marqueeDuration.value = wrapperWidth / (wrapperWidth / 550);
    };

    return {
      imageLoading,
      slide: ref(0),
      tab,
      selectTab,
      imgNotFound,
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(27),
      imgURL,
      banners,
      store,
      platforms,
      mainWallet,
      isLogined,
      playGame,
      allGames,
      gamePage,
      selectedPlatId,
      searchList,
      liveTabs,
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      gotoPromo,
      onHomeScroll,
      router,
      sport,
      esport,
      slot,
      livecasino,
      cockfight,
      casuals,
      poker,
      fishing,
      lottery,
      isH5,
      onSlideChange,
      Thumbs,
      thumbsSwiper,
      modules: [Scrollbar, Pagination],
      Controller,
      firstSwiper,
      secondSwiper,
      setFirstSwiper,
      setSecondSwiper,
      setSelectedSwiper,
      isFirstView,
      closeAlert,
      isAppUpdateModal,
      cancelUpdate,
      openDownloadPage,
      homePopupImg,
      homePopupLink,
      homePopupLinkOut,
      refreshBalance,
      isLoadingBalance,
      closeTopBox,
      getAppDownloadUrl,
      downloadUrl,
      getWithExpiry,
      setWithExpiry,
      setExpiryBanner,
      homePopupContent,
      homePopupType,
      homePopupId,
      homePopupFrequency,
      homePopupFrequencyNum,
      isImpt,
      isImportantAnnoucementModal,
      getImgPlatformLogo,
      getImgPlatformBg,
      moment,
      // unreadInboxMail,
      // getUnreadTotal,
      topBoxVisible,
      isMenuFloat,
      toggleMenuFloat,
      isRebateModalVisible,
      rebateAmt,
      getRebateAmt,
      claimRebateAmt,
      isLoginModal,
      newsDetails,
      getNewsDetails,
      newsDetail_00,
      newsDetail_01,
      newsDetail_02,
      newsDetail_03,
      newsDetail_04,
      newsDetail_05,
      goToNewsPage,
      isPlatformComingSoon,
      loadHotMatches,
      hotMatches,
      hotMatchesImgURL,
      slideHotMatches: ref(0),
      formattedTime,
      openHotMatch,
      onSwiper,
      modulesHot,
      Platform,
      pushNotificationData,
      euroCupStartDate,
      getRedEnvelope,
      isRedPacketShow,
      daysDiff,
      countDayString,
      countDay01,
      countDay02,
      isWelcomeFlag,
      ui,
      removeRouterWelcome,
      trackRegisterClickEvent,
      goToRegister,
      showRocket,
      checkShowRocket,
      fabPos,
      packetPos,
      draggingRocketFab,
      draggingPromoFab,
      moveRocketFab,
      movePromoFab,
      hideRocket,
      promoPos,
      hideFloatPromo,
      showFloatPromo,
      currentPromo,
      currentPromoIndex,
      gotoFloatPromo,
      floatPromo,
      gamePromo,
      currentElement,
      imgURLFloat,
      updateRocket,
      currentRocket,
      currentRocketIndex,
      rocketSlide: ref(0),
      promoSlide: ref(0),
      tabs,
      fullGameList,
      EDITION,
      marqueeDuration,
      marqueePseudoRef,
      marqueeWrapperRef

      // moveFab(ev) {
      //   draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;
      //   fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y];
      // }
    };
  }
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800;900&display=swap");
.home-news {
  width: calc(100% - 2rem);
  margin: 0 auto 32px;

  .home-news-title-section {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;

    .news-title {
      font-size: 18px;
      font-weight: 700;
      color: #313441;
    }
  }

  .home-news-top-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 8px;
    margin-bottom: 8px;

    .top-news {
      background-color: #ffffff;
      border-radius: 12px;
      height: 140px;
      background-size: cover;
      position: relative;
      overflow: hidden;

      .title-txt {
        font-weight: 700;
        color: #ffffff;
        text-align: left;
        line-height: 1.4;
        font-size: 14px;
        padding: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-shadow: 10px 10px 10px #000;
        overflow: hidden;
        width: 100%;
        background: linear-gradient(0deg, #063c78 0%, rgba(0, 0, 0, 0) 72.73%);
      }
    }
  }
  .home-news-bottom-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 8px;
    row-gap: 8px;
    .bottom-news {
      display: flex;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0px -2px 5px 0px #b1d7ff inset;

      .news-img {
        min-width: 60px;
        min-height: 60px;
        background-color: #ffffff;
        border-radius: 12px;
        background-size: cover;
      }

      .news-txt {
        color: #333333;
        font-size: 12px;
        padding: 8px;
        max-height: 40px; /* Assuming 4 lines of text with 12px font size and 12px padding */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Limit to 2 lines */
        -webkit-box-orient: vertical;
      }
    }
  }
}

.float-service {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 99;

  .float-btn {
    margin-right: -5px;
  }

  .float-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
    background: rgba(252, 253, 254, 0.3);
    padding: 12px 6px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    backdrop-filter: blur(5px);
    margin-right: calc(-100% - 16px);
    transition: 0.3s all;

    &.show-menu {
      margin-right: 0;
    }

    .menu-item {
      padding: 8px;

      img {
        display: block;
        width: 30px;
        // width: 100%;
        // max-width: 30px;
      }
    }
  }
}

.rocket-wrapper {
  transition: all 0.3s;
  // cursor: pointer;

  img {
    width: 105px;
    pointer-events: none;
  }

  &:hover {
    filter: brightness(0.9);
  }
}

.q-page-container {
  min-height: 100vh;
}

.download-top-container {
  padding: 8px 10px;
  background: $white;
  box-shadow: 0px 5px 10px 0px #0000001f;

  .download-top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .q-icon {
      font-size: 1.5rem;
      color: $font-3;
    }

    .headicon {
      flex: 2;
      width: 15%;
      //width: 120px;
    }

    .download-txt-container {
      flex: 4;
      font-size: 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: $font-1;

      .download-title {
        font-size: 1.2rem;
        color: $font-3;
        font-weight: 600;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .top-btn {
      font-size: 1rem;
      border-radius: 10px;
      flex: 1;
      width: 15%;
    }
  }
}

.q-carousel.home {
  width: calc(100% - 2rem);
  margin: 6px auto;
  height: auto;
  border-radius: 16px;
  aspect-ratio: 1000/400;
  .q-panel > div {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  :deep(.q-carousel__navigation--bottom) {
    bottom: 0px;
  }
}

:deep(.q-carousel.float) {
  .swiper-wrapper {
    margin-bottom: 25px;
  }
  height: unset;
  background: transparent;
}
:deep(.q-carousel.float .q-carousel__navigation .q-btn) {
  margin: 0;
  padding: 0;
  font-size: 4px !important;
  color: #3382f4;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 1rem;
  margin: 0 auto;
  box-shadow: 0px -2px 6px 0px #c3d4e6 inset;

  .header-left {
    // height: 50px;

    // @media (max-width: 400px) {
    //   height: 40px;
    // }

    img {
      // height: 100%;
      // width: auto;
      width: 100%;
      max-width: 135px;
    }
  }

  .header-middle {
    margin-left: auto;
    margin-right: 12px;
    margin-top: 3px;
    display: flex;
    gap: 12px;

    :deep(.q-btn) {
      min-width: 80px;
      min-height: 12px;
      font-weight: bold;
      @media (max-width: 400px) {
        font-size: 80%;
      }
    }
  }

  .header-lang {
    margin-top: 2px;
  }

  .header-right {
    height: 25px;
    position: relative;

    img {
      height: 100%;
      width: auto;
    }

    .red-dot {
      height: 10px;
      width: 10px;
      background: #db0011;
      border-radius: 50%;
      position: absolute;
      top: -3px;
      right: -3px;
    }
  }
}

.mid-announcement-section {
  width: $box-width;
  margin: 10px auto 10px;
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #696d70;
  border-radius: 2.1875rem;
  background: #fff;
  box-shadow: 0px -20px 30px 0px rgba(158, 180, 210, 0.41) inset, 0px 4px 10px 0px;
  font-family: "Roboto";
  .hot-match-div {
    background-image: url("../assets/images/home/match-icon.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 36px;
    aspect-ratio: 128/40;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: $white;
    gap: 5px;

    span {
      white-space: nowrap;
    }

    img {
      height: 80%;
      width: auto;
      margin-left: 3px;
      margin-bottom: 3px;
    }
  }

  .midd {
    position: relative;
    overflow: hidden;

    .marquee-pseudo {
      display: flex;
      position: absolute;
      visibility: hidden;
      z-index: -1;
      width: max-content;
    }
  }
}

.details-bar {
  width: $box-width;
  margin: 0 auto;
  gap: 10px;
  padding: 10px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 3;
    padding: 0px 8px 0px 0px;
    //border-right: 1px dashed $font-1;
    color: $font-4;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }

  .main-balance {
    font-size: 1.6rem;
    color: $font-4;

    &.main-nologin {
      font-size: 1rem;
    }
  }

  .menulist {
    flex: 4;
    // padding-left: 8px;
    display: flex;
    // justify-content: space-evenly;
    justify-content: space-between;
    gap: 4px;

    .men {
      text-decoration: none;
      color: $font-4;
      gap: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;

      &:active {
        background: $grey-color;
      }

      img {
        display: block;
        height: 2rem;
      }
    }
  }
}

.modal-update-div {
  .modalcontent {
    &.welcome {
      font-family: "Inter";
      background: #ffffffcc;
      margin-top: 50px;
      padding: 0;
      .welcome-header {
        display: flex;
        flex-direction: column;
        margin-top: -100px;
        justify-content: center;
        align-items: center;
        width: 100%;
        &__ball {
          margin-bottom: -10px;
          img {
            display: block;
          }
        }
        &__title {
          color: #000000;
          font-size: 20px;
          font-weight: 900;
          line-height: 24.2px;
          text-align: center;
        }
      }
      .section {
        display: flex;
        gap: 10px;
        padding: 10px;
        &.last {
          padding-top: 0;
        }
        .section-card {
          box-shadow: 0px 0px 10px 0px #0000001a;
          background: #ffffffcc;
          border: 1px solid #ffffff;
          border-radius: 15px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          flex: 1;
          .main-header {
            color: #424f72;
            font-size: 16px;
            font-weight: 900;
            line-height: 19.36px;
            text-align: center;
            width: 85%;
          }
          .main-text {
            width: 95%;
            color: #7a80a1;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            text-align: center;
          }
          .slide-img {
            width: 80%;
            margin: 0 auto;
            &.full {
              width: 100%;
            }
            img {
              width: 100%;
            }
          }
          .slide-qr {
            background: url("../assets/images/welcome/welcome-qrbg.png") no-repeat center center;
            background-size: contain;
            width: 100px;
            height: 110px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .lastline {
            color: #424f72;
            font-size: 12px;
            font-weight: 900;
            line-height: 16px;
            text-align: center;
          }
          .deposit-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
            padding: 10px;
            font-weight: 500;
            background: url("../assets/images/welcome/title-bg-blue.png") no-repeat center center;
            background-size: contain;
            color: #ffffff;
          }
        }
      }
    }
    background: $white;
    // height: 232px;
    height: auto;
    min-height: 232px;
    border-radius: 10px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px 16px;

    .headers {
      width: calc(100% - 16px);
      border-radius: 10px 10px 0px 0px;
      box-sizing: border-box;
      height: 55px;
      line-height: 55px;
      background: $white;
      color: $primary;
      text-align: center;
      font-size: 1.2rem;
      border-bottom: 2px solid #ecedf0;
      font-weight: bold;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contents {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 12px 15px;
      text-align: center;
      color: #468cff;
      font-size: 2.2rem;

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
      padding: 0 1rem;
      margin-top: 20px;
      gap: 15px;

      .cancels {
        flex: 1;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 1px;
        max-width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        padding: 10px !important;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        text-align: center;
        max-width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 1px;
        padding: 10px !important;
      }
    }
  }
}

.q-card__section {
  background: rgba(0, 0, 0, 0.1);
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

.home-game-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: $box-width;
  margin: 0px auto 16px;
  gap: 8px;

  .game-left-list {
    position: sticky;
    padding-top: 10px;
    top: 0;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
    max-width: 58px;

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .game-platform {
      position: relative;
      span {
        position: absolute;
        text-align: center;
        font-size: 11px;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        color: #7a80a1;
        line-height: 1;
        font-weight: bold;

        @media (max-width: 400px) {
          font-size: 9px;
        }

        &.active {
          color: #ffffff;
        }
      }
    }
  }

  .game-right-platform {
    padding-top: 10px;
    flex: 11;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .game-lists {
      gap: 8px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 8px;
    }

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .platform-block {
      cursor: pointer;
      width: 100%;
      position: relative;

      &.maintenance {
        pointer-events: none;

        .platform-img-frame {
          filter: blur(2px);
        }
      }

      &.maintenance:after {
        content: "";
        position: absolute;
        background: #012c6a50;
        top: 0%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      .platform-img {
        width: 100%;
        max-width: 100%;
        height: auto;
        background-size: contain;
        background-repeat: no-repeat;
        aspect-ratio: 819/295;
      }

      .platform-img-frame {
        border-radius: 12px;
        height: auto;
        width: 100%;
        background-color: #f4f9fe;
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        aspect-ratio: 819/295;
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: 50% 50%;
        box-shadow: -1px 5px 11px rgb(0 0 0 / 10%);

        .platform-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          // align-items: center;
          justify-content: center;
          margin-left: 18px;
        }

        // .platform-item-bg {
        // width: 80%;
        // height: 100%;
        // background-repeat: no-repeat;
        // background-size: contain;
        // background-position: bottom center;
        // margin: auto;
        // }

        .platform-logo {
          height: 1.6rem;

          img {
            display: block;
            height: 100%;
            width: auto;
          }
        }

        .platform-title {
          font-weight: 800;
          font-size: 1.175rem;
          line-height: 1.3;
          margin-top: 10%;
          text-align: left;
          color: $font-4;
        }

        .platform-subtitle {
          margin-top: 5%;
          font-size: 0.875rem;
          line-height: 1;
          color: $font-1;
        }

        .platform-rebate {
          margin-bottom: 5%;
          margin-top: auto;
          font-size: 0.875rem;
          line-height: 1;
          color: $font-1;
          padding: 0.35rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid #fff;
          background: linear-gradient(180deg, #fafbff 0%, #e6edfe 100%);
          box-shadow: 0px 4px 4px 0px rgba(154, 176, 255, 0.1);
          display: none;
          align-items: center;

          span {
            font-weight: 800;
            font-size: 120%;
            display: inline-block;
            margin-left: 0.25rem;
          }
        }

        .platform-label {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          width: 40%;
          height: 40%;
          background-image: url(../assets/images/home/label-certified.png);
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }

  .fade-in-image {
    animation: fadeIn 1.5s;
  }
}
.rebates-absolute {
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  width: 14px;
  min-width: 14px;
  height: 14px;
  min-height: 14px;
  border-radius: 50%;
  color: #aaaaaa;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 10px;
  font-weight: bold;
  margin-left: 24px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 400;
}

.modal-home-popup {
  background: transparent;
  box-shadow: none;

  .q-card {
    background: transparent;
    box-shadow: none;
  }
  .q-card__section {
    background: none;
    box-shadow: none;
  }
  .q-card-section {
    background: transparent;
    box-shadow: none;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

//Above is New One (LH)

@media (max-width: 480px) {
  .modal-update-div .modalcontent.welcome .section .section-card {
    gap: 5px;
  }
  .modal-update-div .modalcontent.welcome .section .section-card .main-header {
    font-size: 14px;
    line-height: 17px;
  }
  .modal-update-div .modalcontent.welcome .section .section-card .deposit-btn {
    font-size: 12px;
  }
}

@media (max-width: 410px) {
  .grid {
    .q-card {
      .q-card__section {
        .text {
          transform: scale(1.2);
        }
      }
    }
  }

  .home-header {
    .header-middle {
      color: #313441;

      :deep(.q-btn) {
        min-width: 75px;
      }
    }
  }
}

@keyframes fly {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: translateY(5vh) translateX(20px) rotate(45deg);
    opacity: 0.9;
  }
  40% {
    transform: translateY(10vh) translateX(-20px) rotate(90deg);
    opacity: 0.8;
  }
  60% {
    transform: translateY(15vh) translateX(15px) rotate(135deg);
    opacity: 0.7;
  }
  80% {
    transform: translateY(20vh) translateX(-15px) rotate(180deg);
    opacity: 0.6;
  }
  100% {
    transform: translateY(25vh) translateX(10px) rotate(225deg);
    opacity: 0;
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

.red-envelope {
  width: 85px;
  margin-left: 30px;
  cursor: pointer;
  animation: shake 1s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes shake-with-pause {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-10px);
  }
  20% {
    transform: translateX(10px);
  }
  30% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0eg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.red-envelope {
  animation: tilt-shaking 1s infinite;
}

.hot-matches-wrapper {
  width: calc(100% - 1rem);
  margin: 0 auto 20px;
  // margin: 20px auto 0px;

  .euro-countdown {
    display: flex;
    justify-content: center;
    align-items: baseline;
    // padding-bottom: 35px;
    // padding-top: 15px;
    // padding-bottom: 8px;
    // padding-top: 8px;
    position: relative;

    img {
      width: 30px;
    }

    .euro-countdown-fly-01 {
      position: absolute;
      left: -6px;
      top: -10px;
      width: 30px;
      animation: fly 8s linear infinite;
    }

    .euro-countdown-fly-02 {
      position: absolute;
      left: 4px;
      top: -10px;
      width: 30px;
      animation: fly 7s linear infinite;
    }

    .euro-countdown-fly-03 {
      position: absolute;
      left: -6px;
      top: -10px;
      width: 30px;
      animation: fly 6s linear infinite;
    }

    .euro-countdown-fly-04 {
      position: absolute;
      right: -7px;
      top: -10px;
      width: 30px;
      animation: fly 7s linear infinite;
    }

    .euro-countdown-fly-05 {
      position: absolute;
      right: 0px;
      top: -10px;
      width: 30px;
      animation: fly 8s linear infinite;
    }

    .euro-countdown-fly-06 {
      position: absolute;
      right: -6px;
      top: -10px;
      width: 30px;
      animation: fly 10s linear infinite;
    }

    .euro-countdown-content {
      display: flex;
      justify-content: center;
      width: max-content;
      position: relative;
      background: url(../assets/images/home/eurocup-countdown-content-frame.png) no-repeat center center;
      // background-size: 100% 100%;

      background-size: 100% 70%;
      padding: 0 4px;
      margin-left: 12px;

      img {
        display: block;
        width: 100%;
      }
    }

    .euro-countdown-txt {
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      line-height: 1;
      align-items: center;
      width: 94%;
      padding: 0px 10px;

      @media (min-width: 440px) {
        font-size: 20px;
      }

      @media (min-width: 500px) {
        font-size: 28px;
      }

      .txt-logo {
        margin-left: -30px;
      }

      .txt-2024 {
        margin-right: 10px;
        @media (min-width: 440px) {
          margin: 0 auto;
        }
      }

      .euro-countdown-num-wrap {
        display: flex;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
      }

      .euro-countdown-num {
        position: relative;
        display: flex;

        .num {
          background-image: url(../assets/images/home/eurocup-countdown-number.png);
          // height: 40px;
          // width: 40px;

          height: 30px;
          width: 30px;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          // @media (min-width: 440px) {
          //   height: 50px;
          //   width: 50px;
          // }

          // @media (min-width: 500px) {
          //   height: 60px;
          //   width: 60px;
          // }

          &:last-child {
            margin-left: -3px;
          }
        }
        span {
          background: linear-gradient(180deg, #087df6 0%, #0011ac 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 22px;
          line-height: 1;
          font-family: Arial;

          @media (min-width: 440px) {
            font-size: 32px;
          }

          @media (min-width: 440px) {
            font-size: 36px;
          }
        }
      }
    }
  }

  .hot-matches-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hot-matches-title {
    font-size: 17px;
    font-weight: 700;
    color: #313441;
    display: flex;
    align-items: center;
    gap: 6px;

    img {
      display: block;
      width: 24px;
    }
  }

  .hot-matches-container {
    width: calc(100% - 2rem);
    height: 125px;
    margin: auto;
    :deep(.swiper-pagination) {
      //bottom: -20px;
      position: relative;
      // margin-top: 10px;
      transform: scale(0.75);
      margin-top: 10px;
    }
  }

  .hot-matches-carousel {
    height: auto !important;
    background: transparent;
    //padding-bottom: 10px;

    :deep(.q-carousel__navigation--bottom) {
      bottom: 0px !important;
    }
  }

  .hot-matches-slide {
    // padding-top: 0;
    // padding-left: 6px;
    // padding-right: 6px;
  }

  .hot-matches-item {
    background: #f4f9fe;
    border-radius: 16px;
    max-width: 450px;
    margin-top: 0px;
    padding: 8px 18px 6px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-shadow: 0px 0px 6px 0px #00324433;
    padding-bottom: 15px;

    .top-match-title {
      color: #033ac8;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      width: 100%;
      margin: -10px auto 0;

      .title-frame {
        background-image: url("../assets/images/home/top-title-btn.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        padding: 4px 12px;
        margin: auto;
        width: 70%;
        max-width: 200px;
      }
    }

    .match-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      margin-top: 6px;

      img {
        display: block;
        width: 30px;
      }

      .match-title {
        color: #424f72;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
      }
      .match-time {
        color: #444444;
        font-size: 13px;
        text-align: center;
        margin-top: 0px;
      }

      .match-btn {
        // margin-top: auto;
        margin-top: 0px;

        .match-btn-button {
          min-height: 15px;
          padding: 3px 8px;
          font-size: 10px !important;
        }
      }
    }

    .team-details {
      display: flex;
      justify-content: end;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      width: 100%;
      max-width: 30%;

      .team-details__home {
      }

      .team-details__away {
      }

      .team-icon {
        // border-radius: 50%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: unset;
          height: 40px;
        }
      }

      .team-name {
        text-align: center;
        color: #444444;
        // min-height: 22px;
      }
    }
  }
}

.alert-img {
  width: 70% !important;
  margin: auto;
}
</style>

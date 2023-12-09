<template>
  <div class="main-section">
    <q-carousel
      :class="!$q.screen.gt.sm ? 'home-banner-h5' : 'home-banner-web'"
      autoplay
      navigation
      v-model="slide"
      swipeable
      infinite
    >
      <template v-slot:navigation-icon="{ active, onClick }">
        <q-btn padding="3px 10px" v-if="active" size="xs" color="brand" @click="onClick" />
        <q-btn padding="3px 10px" v-else size="xs" color="white" @click="onClick" />
      </template>

      <!--      <q-carousel-slide-->
      <!--        name="mainSlide"-->
      <!--        class="column no-wrap flex-center"-->
      <!--        :img-src="-->
      <!--          !$q.screen.gt.sm-->
      <!--            ? require('../assets/images/index/main-home-banner-mobile.jpg')-->
      <!--            : require('../assets/images/index/main-home-banner-desktop.jpg')-->
      <!--        "-->
      <!--        @click="gotoPromo(0)"-->
      <!--      >-->
      <!--        <h1 class="main-slide-txt">ออนไลน์คาสิโนที่ไว้ใจได้-Jolly88</h1>-->
      <!--      </q-carousel-slide>-->

      <q-carousel-slide
        v-for="(banner, i) in banners"
        :key="i"
        :name="i"
        class="column no-wrap flex-center"
        :img-src="!$q.screen.gt.sm ? imgURL + banner.mobileImageUrl : imgURL + banner.desktopImageUrl"
        @click="gotoPromo(banner)"
      ></q-carousel-slide>
    </q-carousel>

    <div class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <img src="../assets/images/menu/announce-icon.png" />
        </div>
        <marquee-text :repeat="announcementList.length" :duration="announcementList.length * 20">
          <div v-if="announcementList">
            <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
              {{ a.content }}
            </span>
          </div>
        </marquee-text>
      </div>
    </div>
    <div class="grid-wrapper">
      <div class="items-center grid" ref="gameBoardRef">
        <div
          v-for="(e, i) in gameBoardItemData"
          :key="`gbi-${i}`"
          ref="gameBoardItemRef"
          class="game-board-item"
          :class="currentSelectedMenu == e.name ? 'active-board' : ''"
          @click="switchMenu(e.name, i)"
        >
          <img :src="require(`../assets/images/index/${e.imgName}`)" />
          <span>{{ e.label }}</span>
        </div>

        <!--      <div-->
        <!--        class="game-board-item"-->
        <!--        :class="currentSelectedMenu == 'xfj' ? 'active-board' : ''"-->
        <!--        @click="switchMenu('xfj')"-->
        <!--      >-->
        <!--        <img src="../assets/images/index/home-cf.png"/>-->
        <!--        <span>{{ $t("lang.fish2_list") }}</span>-->
        <!--      </div>-->

        <!--      <div class="game-board-item"-->
        <!--           :class="(currentSelectedMenu=='fish2') ? 'active-board' : ''"-->
        <!--           @click="switchMenu('fish2')"-->
        <!--      >-->
        <!--        <img src="../assets/images/index/home-fish2.png"/>-->
        <!--        <span>เกมส์เล็ก ๆ</span>-->
        <!--      </div>-->
      </div>
    </div>

    <Transition>
      <div class="game-grid-lists" id="id-sport-board" v-if="currentSelectedMenu === 'sport'">
        <div
          class="game-item btn-pointer mid-grid-column"
          v-for="(sport, index) in sportsGame"
          :key="`sports-${index}`"
          @click="playGame(sport.name, sport.code, sport.gameCode)"
        >
          <div
            class="platform-img"
            :style="{
              backgroundImage: (() => {
                try {
                  return `url(${require(`../assets/images/games/sport/${sport.gameName}.png`)})`;
                } catch (e) {
                  return `url(${comingSoonImg})`;
                }
              })()
            }"
          ></div>
        </div>
      </div>
    </Transition>

    <Transition>
      <div class="game-grid-lists" id="id-live-board" v-if="currentSelectedMenu === 'live'">
        <div
          class="game-item btn-pointer"
          v-for="(p, index) in liveCasinoGames"
          :key="`live-${index}`"
          @click="playGame(p.name, p.code, p.gameCode)"
        >
          <div
            class="platform-img"
            :style="{
              backgroundImage: (() => {
                try {
                  return `url(${require(`../assets/images/games/live/${p.code}.png`)})`;
                } catch (e) {
                  return `url(${comingSoonImg})`;
                }
              })()
            }"
          ></div>
        </div>
      </div>
    </Transition>

    <Transition>
      <div class="game-grid-lists" id="id-lottery-board" v-if="currentSelectedMenu === 'lottery'">
        <div v-if="lotteryGames.length === 0" class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t("lang.coming_soon") }}</span>
        </div>
      </div>
    </Transition>
    <Transition>
      <div class="game-grid-lists" id="id-cf-board" v-if="currentSelectedMenu === 'xfj'">
        <div v-if="xfjGames.length === 0" class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t("lang.coming_soon") }}</span>
        </div>

        <div
          class="game-item btn-pointer"
          :class="xfjGames.length === 1 ? 'mid-grid-column' : ''"
          v-for="(p, index) in xfjGames"
          :key="`xfj-${index}`"
          @click="playGame(p.name, p.code, 'aviator')"
        >
          <div
            class="platform-img"
            :style="{
              backgroundImage: (() => {
                try {
                  return `url(${require(`../assets/images/games/xfj/${p.code}.png`)})`;
                } catch (e) {
                  return `url(${comingSoonImg})`;
                }
              })()
            }"
          ></div>
        </div>


      </div>
    </Transition>
    <Transition>
      <div class="game-grid-lists" id="id-fish2-board" v-if="currentSelectedMenu === 'fish2'">
        <div class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t("lang.coming_soon") }}</span>
        </div>
      </div>
    </Transition>

    <Transition>
      <div class="game-grid-lists" id="id-slot-board" v-if="currentSelectedMenu === 'slots' && !isShow">
        <div v-if="store.hasToken()" class="game-item btn-pointer btn-slot-game" @click="showFavourite()">
          <img :src="require('../assets/home/slot/slot-favourite-board.png')" />
        </div>

        <template v-for="p in platforms" :key="p">
          <div class="game-item btn-pointer btn-slot-game" @click="selectSlotPlat(p)">
            <div
              class="platform-img"
              :style="{
                backgroundImage: (() => {
                  try {
                    return `url(${require(`../assets/home/slot/${p.code}.png`)})`;
                  } catch (e) {
                    return `url(${comingSoonImg})`;
                  }
                })()
              }"
            ></div>
          </div>
        </template>
      </div>
    </Transition>
    <Transition>
      <div class="game-scroll-lists" id="id-slot-board" v-if="currentSelectedMenu === 'slots' && isShow">
        <q-scroll-area
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: 80px; max-width: 80px' : 'width: 120px; max-width: 120px'"
        >
          <div class="bookmarks">
            <div
              v-if="store.hasToken()"
              class="plat-item"
              :class="{ active: selectedPlatId === -99 }"
              @click="showFavourite()"
            >
              <img :src="require('../assets/home/slot/favourite-icon.png')" />
            </div>

            <div
              class="plat-item"
              v-for="p in platforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p, 'slots')"
            >
              <div
                class="platform-img"
                :style="{
                  backgroundImage: (() => {
                    try {
                      return `url(${require(`../assets/logo/${p.code}.png`)})`;
                    } catch (e) {
                      return `url(${comingSoonImg})`;
                    }
                  })()
                }"
              ></div>

              <!--                <img :src="require('../assets/logo/' + p.code + '.png')" />-->
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId === -99"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
          <!-- FAVOURITE -->
          <div class="slot-grid" style="padding-bottom: 20px" v-if="sortedFavGamesList.length > 0">
            <div
              v-for="(game, index) in sortedFavGamesList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              style="height: auto"
              class="btn-pointer inner-slot-game"
            >
              <transition name="in-view">
                <q-list
                  class="btn-slot-game q-col-gutter-none"
                  @click="openFavGame(game.name, game.code, selectedPlat.status, game)"
                >
                  <div>
                    <q-img
                      loading="lazy"
                      :src="game.icon"
                      :placeholder-src="game.default"
                      fit="fill"
                      height="auto"
                      spinner-color="white"
                      position="50% 20%"
                      style="border-radius: 20px; overflow: hidden"
                      :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                    >
                      <template v-slot:loading>
                        <img
                          :src="game.default"
                          style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden"
                        />
                      </template>
                    </q-img>
                    <div class="slot-name">
                      {{ game.name }}
                    </div>
                  </div>
                </q-list>
              </transition>

              <template v-if="favLists.indexOf(game.id) === -1">
                <RiStarLine @click="toggleFavGame(game.id, true)" class="favourite-star" />
              </template>
              <template v-else>
                <RiStarFill
                  @click="toggleFavGame(game.id, false)"
                  class="favourite-star"
                  style="fill: #ffd700 !important"
                />
              </template>
            </div>
          </div>

          <div class="coming-soon-div" v-else>
            <img src="../assets/home/coming-soon-img.png" />
            <span>{{ $t("lang.no_fav_game_yet") }}</span>
          </div>
        </q-scroll-area>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId !== -99"
          ref="scrollSlotRef"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
          <div class="search-list">
            <q-form @submit="searchList">
              <q-input
                color="white"
                bg-color="primary"
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
                <template v-slot:prepend>
                  <q-icon color="white" name="search" @click="gamePage.searchKey = ''" class="cursor-pointer" />
                </template>
                <template v-slot:append>
                  <q-icon
                    style="margin-right: 5px"
                    @click="clearSearchInput"
                    class="clear-input-icon btn-pointer"
                    name="close"
                  ></q-icon>

                  <q-icon
                    color="brightbtn"
                    name="search"
                    style=""
                    @click="searchList"
                    class="clear-input-icon btn-pointer"
                  ></q-icon>

                  <!-- <q-btn type="submit" @click="searchList" :label="$t('lang.search')" color="brightbtn"/> -->
                </template>
              </q-input>
            </q-form>
          </div>
          <div class="slot-grid" style="padding-bottom: 20px">
            <div
              v-for="(game, index) in gamePage.gameList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              style="height: auto"
              class="btn-pointer inner-slot-game"
            >
              <transition name="in-view">
                <q-list
                  class="btn-slot-game q-col-gutter-none"
                  @click="openGame(game.name, game.code, selectedPlat.status, game)"
                >
                  <div>
                    <q-img
                      loading="lazy"
                      :src="game.icon"
                      :placeholder-src="game.default"
                      fit="fill"
                      height="auto"
                      spinner-color="white"
                      position="50% 20%"
                      style="border-radius: 20px; overflow: hidden"
                      :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                    >
                      <template v-slot:loading>
                        <img
                          :src="game.default"
                          style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden"
                        />
                      </template>
                    </q-img>
                    <div class="slot-name">{{ game.name }}</div>
                  </div>
                </q-list>
              </transition>

              <template v-if="favLists.indexOf(game.id) === -1">
                <RiStarLine @click="toggleFavGame(game.id, true)" v-if="store.hasToken()" class="favourite-star" />
              </template>
              <template v-else>
                <RiStarFill
                  v-if="store.hasToken()"
                  @click="toggleFavGame(game.id, false)"
                  class="favourite-star"
                  style="fill: #ffd700 !important"
                />
              </template>

              <!-- <q-img
                    loading="lazy"
                    :src="game.icon"
                    :placeholder-src="defaultImg"
                    fit="cover"
                    height="120px"
                    no-spinner
                >
                  <template v-slot:loading>
                    <img :src="game.default" style="height: 140px; max-width: 200px; border-radius: 15px; overflow:hidden;">
                  </template>
                </q-img> -->
              <!-- <img :loading="'lazy'" :class="selectedPlat.code === 'PG' ? 'zoomin' : ''" :src="game.icon" v-bind:alt="game.default" > -->
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>

    <Transition>
      <div class="game-grid-lists" id="id-fish-board" v-if="currentSelectedMenu === 'fish' && !isShow">
        <template v-for="p in fishPlatforms" :key="p">
          <div class="game-item btn-pointer btn-slot-game" @click="selectFishPlat(p)">
            <div
              class="platform-img"
              :style="{
                backgroundImage: (() => {
                  try {
                    return `url(${require(`../assets/home/fish/${p.code}.png`)})`;
                  } catch (e) {
                    return `url(${comingSoonImg})`;
                  }
                })()
              }"
            ></div>
          </div>
        </template>
      </div>
    </Transition>
    <Transition>
      <div class="game-scroll-lists" id="id-fish-board" v-if="currentSelectedMenu === 'fish' && isShow">
        <q-scroll-area
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: 80px; max-width: 80px' : 'width: 120px; max-width: 120px'"
        >
          <div class="bookmarks">
            <div
              class="plat-item"
              v-for="p in fishPlatforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p, 'fish')"
            >
              <div
                class="platform-img"
                :style="{
                  backgroundImage: (() => {
                    try {
                      return `url(${require(`../assets/logo/${p.code}.png`)})`;
                    } catch (e) {
                      return `url(${comingSoonImg})`;
                    }
                  })()
                }"
              ></div>
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>
        <q-scroll-area
          v-if="!isLoading"
          ref="scrollPageRef"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
          <div class="search-list">
            <q-form @submit="searchList">
              <q-input
                color="white"
                bg-color="primary"
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
                <template v-slot:prepend>
                  <q-icon color="white" name="search" @click="gamePage.searchKey = ''" class="cursor-pointer" />
                </template>
                <template v-slot:append>
                  <q-icon
                    style="margin-right: 5px"
                    @click="clearSearchInput"
                    class="clear-input-icon btn-pointer"
                    name="close"
                  ></q-icon>

                  <q-icon
                    color="brightbtn"
                    name="search"
                    style=""
                    @click="searchList"
                    class="clear-input-icon btn-pointer"
                  ></q-icon>

                  <!--                  <q-btn type="submit" @click="searchList" :label="$t('lang.search')" color="brightbtn"/>-->
                </template>
              </q-input>
            </q-form>
          </div>
          <div class="slot-grid" style="padding-bottom: 20px">
            <div
              v-for="(game, index) in gamePage.gameList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              @click="openGame(game.name, game.code, selectedPlat.status)"
              style="height: auto"
              class="btn-pointer btn-slot-game inner-slot-game"
            >
              <transition name="in-view">
                <q-list class="q-col-gutter-none">
                  <div>
                    <q-img
                      loading="lazy"
                      :src="game.icon"
                      :placeholder-src="game.default"
                      fit="fill"
                      height="auto"
                      spinner-color="white"
                      position="50% 20%"
                      style="border-radius: 20px; overflow: hidden"
                      :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                    >
                      <template v-slot:loading>
                        <img
                          :src="game.default"
                          style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden"
                        />
                      </template>
                    </q-img>
                    <div class="slot-name">{{ game.name }}</div>
                  </div>
                </q-list>
              </transition>
              <!-- <q-img
                    loading="lazy"
                    :src="game.icon"
                    :placeholder-src="defaultImg"
                    fit="cover"
                    height="120px"
                    no-spinner
                >
                  <template v-slot:loading>
                    <img :src="game.default" style="height: 140px; max-width: 200px; border-radius: 15px; overflow:hidden;">
                  </template>
                </q-img> -->
              <!-- <img :loading="'lazy'" :class="selectedPlat.code === 'PG' ? 'zoomin' : ''" :src="game.icon" v-bind:alt="game.default" > -->
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>

    <Transition>
      <div class="game-grid-lists" id="id-casual-board" v-if="currentSelectedMenu === 'casual' && !isShow">
        <template v-for="miniplat in platformMinigame" :key="miniplat.id">
          <div
            v-if="miniplat.code === 'Spribe'"
            class="game-item btn-pointer"
            @click="playGame(miniplat.name, miniplat.code, 'aviator')"
          >
            <div
              class="platform-img"
              :style="{
                backgroundImage: (() => {
                  try {
                    return `url(${require(`../assets/images/games/casual/${miniplat.code}.png`)})`;
                  } catch (e) {
                    return `url(${comingSoonImg})`;
                  }
                })()
              }"
            ></div>
          </div>
          <div v-else class="game-item btn-pointer" @click="selectCasualPlat(miniplat)">
            <div
              class="platform-img"
              :style="{
                backgroundImage: (() => {
                  try {
                    return `url(${require(`../assets/images/games/casual/${miniplat.code}.png`)})`;
                  } catch (e) {
                    return `url(${comingSoonImg})`;
                  }
                })()
              }"
            ></div>
          </div>
        </template>
      </div>
    </Transition>
    <Transition>
      <div class="game-grid-lists" id="id-minigame-board" v-if="currentSelectedMenu === 'casual' && isShow">
        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>
        <template v-if="!isLoading">
          <template v-for="(game, index) in miniGames" :key="index">
            <div class="game-item btn-pointer btn-slot-game" @click="playGame(game.name, selectedPlat.code, game.code)">
              <div
                class="platform-img"
                :style="{
                  backgroundImage: (() => {
                    try {
                      return `url(${game.icon})`;
                    } catch (e) {
                      return `url(${comingSoonImg})`;
                    }
                  })()
                }"
              ></div>
            </div>
          </template>

          <template v-if="selectedPlat.code === 'TFGaming'">
            <div
              class="game-item minigame-select-div"
              v-for="(game, index) in miniGamesMore"
              :key="index"
              @click="showTypeH5(game.id)"
              @mouseover="showTypeWeb(game.id)"
              @mouseleave="showTypeWeb(0)"
            >
              <img :src="game.logo" />

              <transition appear>
                <div class="select-type-div" v-if="showMiniType == game.id">
                  <div
                    class="game-type btn-pointer"
                    id="copper-type"
                    @click="playGame(game.name, 'TFGaming', game.copper)"
                  >
                    10 - 3,000
                  </div>
                  <div
                    class="game-type btn-pointer"
                    id="silver-type"
                    @click="playGame(game.id, 'TFGaming', game.silver)"
                  >
                    500 - 100K
                  </div>
                  <div class="game-type btn-pointer" id="gold-type" @click="playGame(game.id, 'TFGaming', game.gold)">
                    1,000 - 20K
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </template>
      </div>
    </Transition>
  </div>

  <div class="home-bottom-section">
    <div class="marquee">
      <Vue3Marquee pause-on-hover pause-on-click>
        <img src="../assets/logo/AE.png" height="30" />
        <img src="../assets/logo/AMBSLOT.png" height="30" />
        <img src="../assets/logo/ATA.png" height="30" />
        <img src="../assets/logo/CQ9.png" height="30" />
        <img src="../assets/logo/JILI.png" height="30" />
        <img src="../assets/logo/JOKER.png" height="30" />
        <img src="../assets/logo/KA.png" height="30" />
        <img src="../assets/logo/LIVE22.png" height="30" />
        <img src="../assets/logo/MANNAPLAY.png" height="30" />
        <img src="../assets/logo/PG.png" height="30" />
        <img src="../assets/logo/PNG.png" height="30" />
        <img src="../assets/logo/PP.png" height="30" />
        <img src="../assets/logo/SA.png" height="30" />
        <img src="../assets/logo/SLOTXO.png" height="30" />
        <img src="../assets/logo/TF88.png" height="30" />
        <img src="../assets/logo/WM.png" height="30" />
        <img src="../assets/logo/YGG.png" height="30" />
        <img src="../assets/logo/CG.png" height="30" />
        <img src="../assets/logo/SP.png" height="30" />
      </Vue3Marquee>
    </div>

    <div class="bottom-footer">
      <img class="footer-logo" src="../assets/logo.png" />
      <p>{{ $t("lang.footer_tnc") }}</p>

      <span>{{ $t("lang.footer_all_rights") }}</span>
    </div>
  </div>

  <GameModal ref="gameModalRef"></GameModal>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        <div class="menu-title flex justify-between items-center">
          <div style="margin-right: auto">&nbsp;</div>
          <div>{{ $t("lang.announcement") }}</div>
          <q-btn style="margin-left: auto" icon="close" flat round dense v-close-popup />
        </div>

        <q-tabs
          v-model="activeKey"
          dense
          class="text-grey"
          active-color="brand"
          indicator-color="black"
          align="justify"
          narrow-indicator
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
  </q-dialog>

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
          <div class="titles backgroundColor">
            {{ $t("lang.update_app_title") }}
          </div>
        </div>
        <div class="contents">{{ $t("lang.detected_new_version") }}</div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate">
            {{ $t("lang.cancel") }}
          </div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">
            {{ $t("lang.update_now") }}
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-page-sticky v-if="specialInviteBonusEligible" position="right" :offset="[0, 0]">
    <div class="special-invite-bonus-sticky" @click="redeemSpecialInviteBonus" />
  </q-page-sticky>

  <q-dialog class="special-invite-bonus-popup" width="100%" v-model="specialInviteBonusPopupVisible">
    <div class="special-invite-bonus-container">
      <div class="header-decoration-wrapper">
        <div class="header-decoration">
          <img class="confetti" src="./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-confetti.png" width="250" />
          <img class="money-bags" src="./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-money-bags.png" width="150" />
        </div>
      </div>
      <div class="special-invite-bonus-content">
        <div class="title-wrapper">
          <div class="title">โบนัสพิเศษสำหรับสมาชิกที่ได้รับเชิญ </div>
          <div class="reward-amt">200</div>
        </div>
        <div class="desc-wrapper">
          <div class="desc-title">
            ข้อกำหนดและเงื่อนไข
          </div>
          <div class="desc-content">
            - โบนัสนี้สามารถ ถอนได้ที่ 2000 บาทเท่านั้น<br>
            - สามารถแจ้งถอนได้เมื่อยอดเครดิตถึง 2000 บาท<br>
            - ยอดเงินที่เหลือตจะถูกหักออกทันทีหลังการถอนสำเร็จ<br>
            - โบนัสนี้ไม่สามารถใช้ซื้อฟรีสปินได้<br>
            - บัญชีที่มี IP เดียวกันหรือข้อมูลที่คล้ายกันจะถูกตัดสิทธิ์จากการรับโปรโมชั่นนี้
          </div>
        </div>
        <div class="special-invite-bonus-popup-confirm-btn" @click="toggleSpecialInviteBonusPopup(false)">{{ $t("lang.confirm") }}</div>
      </div>
    </div>
  </q-dialog>

  <q-dialog class="home-popup-banner" width="100%" v-model="isHomePromoModal">
    <div class="promo-popup-div">
      <q-btn
        round
        dense
        icon="close"
        class="btn-pointer popup-btn"
        color="white"
        text-color="dark"
        @click="closePopupModal"
        v-close-popup
      />

      <img src="../assets/images/common/home-popup-img.png" />

      <div class="popup-list">
        <router-link to="/promo?id=81">
          <div class="popup-item">
            <span>
              คลิกเพื่อหมุน รางวัลสูงสุด
              <em>8,880</em>
              และ
              <em>IPHONE</em>
            </span>
          </div>
        </router-link>
        <router-link to="/promo?id=80">
          <div class="popup-item">
            <span>
              แนะนำเพื่อน รับโบนัสสูงถึง
              <em>6,888</em>
              รับเงินคืนสูงสุด
              <em>20,000</em>
            </span>
          </div>
        </router-link>
        <router-link to="/promo?id=76">
          <div class="popup-item">
            <span>
              เลือกรับ
              <em>100%-200%</em>
              รับสูงสุด
              <em>10,000</em>
              ถอนไม่อั้น
            </span>
          </div>
        </router-link>
<!--        <router-link to="/promo?id=77">
          <div class="popup-item">
            <span>
              โบนัส
              <em>30%</em>
              สูงสุด
              <em>2,000</em>
              ถอนไม่อั้น
            </span>
          </div>
        </router-link>-->
        <router-link to="/promo?id=78">
          <div class="popup-item">
            <span>
              โบนัส
              <em>15%</em>
              สูงสุด
              <em>15,000</em>
              ถอนไม่อั้น
            </span>
          </div>
        </router-link>
<!--        <router-link to="/promo?id=79">
          <div class="popup-item">
            <span>
              ประกันยอดเสีย
              <em>10,000</em>
            </span>
          </div>
        </router-link>-->
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isSpinWheelPromo" class="modal-update-div">
    <q-card style="width: 100%; padding: 0px 20px 20px" class="bg-primary text-white text-center">
      <q-card-section class="q-mb-md">
        <div class="menu-title flex justify-between items-center">
          <div style="margin-right: auto">&nbsp;</div>
          <div>{{ $t("lang.announcement") }}</div>
          <q-btn style="margin-left: auto" icon="close" flat round dense v-close-popup />
        </div>

        <div class="">
          {{ $t("lang.you_got_new_spin_wheel_spin") }}
          <br />
        </div>
      </q-card-section>
      <q-btn @click="gotoPromoSpinWheel" :label="$t('lang.go_now')" color="brand" />
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { defineComponent, onMounted, ref, reactive, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, eventapi } from "boot/axios";
import { cached } from "boot/cache";
import { useQuasar, Platform, SessionStorage } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import * as _ from "lodash";
import MarqueeText from "vue-marquee-text-component";
import BacktoTop from "components/backtotop.vue";
import { Vue3Marquee } from "vue3-marquee";
import { RiStarLine, RiStarFill } from "vue-remix-icons";

import { useUI } from "stores/ui";
import { isMobile } from "boot/utils";
import { App } from "@capacitor/app";
import liff from "@line/liff";
import qs from "qs";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    MarqueeText,
    BacktoTop,
    Vue3Marquee,
    RiStarLine,
    RiStarFill
    // RiVolumeUpLine,
    // RiBilliardsLine,
    // RiBasketballLine,
    // RiUserShared2Line
  },
  setup() {
    const $q = useQuasar();
    const { t } = useI18n();
    const ui = useUI();
    const siteId = process.env.SITEID;
    // ui.$onAction(({ name, args }) => {
    //   switch (name) {
    //     case "setScrollPosition":
    //       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
    //   }
    // });
    const specialInviteBonusEligible = ref(false);
    const specialInviteBonusAmt = ref(0);
    const specialInviteBonusPopupVisible = ref(false);
    const banners = ref([]);

    const gameBoardRef = ref();
    const gameBoardItemRef = ref();

    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const mainWallet = computed(() => {
      return store.balance;
    });
    const gameModalRef = ref(null);
    const openGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(gameName, selectedPlat.code, gameCode, gameStatus);

      // gameInfo && console.log(gameInfo);
      // const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      // const clickCount = favGames[gameInfo.id]
      //     ? favGames[gameInfo.id].gameClicked + 1
      //     : 1;
      // const lastPlayedAt = moment().unix();
      // const revisedGameInfo = {
      //   ...gameInfo,
      //   gameClicked: clickCount,
      //   gamePlatformCode: selectedPlat.code,
      //   lastPlayed: lastPlayedAt
      // };
      // gameInfo.gameClicked = clickCount;
      //
      // favGames[gameInfo.id] = revisedGameInfo;
      // localStorage.setItem("FAV_GAMES", JSON.stringify(favGames));
      // favGamesList.value = favGames;
    };

    const openFavGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(gameName, gameInfo.platformCode, gameCode, gameStatus);

      // gameInfo && console.log(gameInfo);
      // const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      // const clickCount = favGames[gameInfo.id]
      //     ? favGames[gameInfo.id].gameClicked + 1
      //     : 1;
      // const lastPlayedAt = moment().unix();
      // const revisedGameInfo = {...gameInfo, gameClicked: clickCount, lastPlayed: lastPlayedAt};
      // gameInfo.gameClicked = clickCount;
      //
      // favGames[gameInfo.id] = revisedGameInfo;
      // localStorage.setItem("FAV_GAMES", JSON.stringify(favGames));
      // favGamesList.value = favGames;
    };

    const favGamesList = ref([]);
    const sortedFavGamesList = computed(() => {
      if (favGamesList.value.length === 0) {
        return [];
      }
      return favGamesList.value.sort((a, b) => a.updateTime - b.updateTime);
    });

    // const updateSortedFavGamesList = () => {
    //   favGamesList.value = Object.fromEntries(
    //       Object.entries(favGamesList.value).sort(([, a], [, b]) => b.lastPlayed - a.lastPlayed)
    //   );
    // };

    const isHomePromoModal = ref(false);
    const favLists = computed(() => {
      let lists = [];
      favGamesList.value.forEach((element) => {
        lists.push(element.id);
      });
      return lists;
    });
    const getFavGameList = () => {
      // const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      // favGamesList.value = favGames;
      // updateSortedFavGamesList();

      api.get("/session/member/fav-games").then((res) => {
        if (res.data.code === 0) {
          favGamesList.value = res.data.data;

          favGamesList.value.forEach((element) => {
            element.default = require("../assets/images/games/aviator/default.png");
            element.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${element.platformCode.toLowerCase()}/${
              element.icon
            }.png`;
          });
        }
      });
    };

    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      gameModalRef.value.open(gameName, platformCode, gameCode, gameStatus);
    };
    const pokerGames = [
      // {
      //   code: "JILI",
      //   name: "Jili Games",
      //   gameName: "Jili",
      //   gameCode: "64",
      //   bg: require("../assets/images/games/poker/poker_1.jpg"),
      //   main: require("../assets/images/games/poker/poker1_1.png"),
      //   logo: require("../assets/images/common/logo/jl.png")
      // },
      // {
      //   code: "RICH88",
      //   name: "Rich88",
      //   gameName: "Rich88",
      //   bg: require("../assets/images/games/poker/poker_2.jpg"),
      //   main: require("../assets/images/games/poker/poker2_01.png"),
      //   logo: require("../assets/images/common/logo/RICH88.png")
      // },
      // {
      //   code: "KM",
      //   name: "KM",
      //   gameName: "KM",
      //   bg: require("../assets/images/games/poker/poker_3.jpg"),
      //   main: require("../assets/images/games/poker/poker3_01.png"),
      //   logo: require("../assets/images/common/logo/km.png")
      // }
    ];
    const xfjGames = ref([]);
    const liveCasinoGames = ref([]);
    const esportsGame = ref([]);

    // {
    //   code: "TFGaming",
    //     name: "TF Gaming",
    //   gameName: "AE Sexy",
    //   gameCode: "MX-LIVE-001",
    //   logo: require("../assets/logo/TF88.png"),
    // },

    const sportsGame = [
      {
        code: "SABA",
        name: "SABA Sport",
        gameName: "SABA",
        gameCode: "SABA"
      }
    ];
    const platformMinigame = ref([]);
    const miniGames = ref([]);
    const miniGamesMore = ref([
      {
        name: "KOG Draw",
        logo: require("../assets/home/casual/2.png"),
        copper: "",
        silver: "",
        gold: ""
      },
      {
        name: "DOTA 2 Treasure",
        logo: require("../assets/home/casual/5.png"),
        copper: "",
        silver: "",
        gold: ""
      },
      {
        name: "LOL Draft",
        logo: require("../assets/home/casual/8.png"),
        copper: "",
        silver: "",
        gold: ""
      }
    ]);

    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.data.code === 0) {
            //
            if (res.data.data.length > 0) {
              banners.value = res.data.data;
            } else {
            }
          } else {
          }
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
    const selectedPlat = reactive({
      code: "",
      status: ""
    });
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const favGamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });
    const gameListData = ref([]);
    const fishPlatforms = ref([]);
    const lotteryGames = ref([]);

    const gameBoardItemData = [
      { name: "slots", imgName: "home-slot.png", label: t("lang.slot_header") },
      { name: "fish", imgName: "home-fish.png", label: t("lang.fish_header") },
      { name: "live", imgName: "home-live.png", label: t("lang.live_header") },
      { name: "sport", imgName: "home-sport.png", label: t("lang.sport_header") },
      { name: "casual", imgName: "home-esport.png", label: t("lang.minigame_header") },
      { name: "lottery", imgName: "home-lottery.png", label: t("lang.lottery_list") }
    ];

    const currentSelectedMenu = ref("slots");
    const switchMenu = (menu, index) => {
      currentSelectedMenu.value = menu;
      isShow.value = false;
      if (menu === "slots") {
        switchPlat(platforms.value[0], menu);
      } else if (menu === "live") {
        // switchPlat(liveCasinoGames[0], menu);
      } else if (menu === "fish") {
        switchPlat(fishPlatforms.value[0], menu);
      } else if (menu === "poker") {
        switchPlat(pokerGames[0], menu);
      } else if (menu === "sport") {
        switchPlat(sportsGame[0], menu);
      } else if (menu === "casual") {
        switchPlat(platformMinigame.value[0], menu);
      } else if (menu === "xfjGames") {
      } else if (menu === "lottery") {
      } else if (menu === "esport") {
      }

      const containerWidth = gameBoardRef.value.clientWidth;

      const item = gameBoardItemRef.value[index];
      const itemLeft = item.offsetLeft;
      const itemWidth = item.clientWidth;

      const scrollPosition = gameBoardRef.value.scrollLeft;

      /**
       * scrollLeft (scrollPosition) & offsetLeft (itemLeft) originated from left
       * no complex calculation for left is normal
       */
      let toLeft = 0;
      let isEdgeItem = false;

      const moveAmount = containerWidth / 2;
      const leftOffset = 30;

      const rightCal = itemLeft - scrollPosition;
      const rightEdge = containerWidth - itemWidth;
      if (rightCal >= rightEdge) {
        isEdgeItem = true;
        toLeft = scrollPosition + moveAmount;
      } else if (itemLeft <= scrollPosition + leftOffset) {
        isEdgeItem = true;
        toLeft = scrollPosition - moveAmount;
      }

      if (isEdgeItem) gameBoardRef.value.scrollTo({ left: toLeft, behavior: "smooth" });
    };
    const liveTabs = ref("");
    const switchPlat = (plat, menuType) => {
      isLoading.value = true;
      if (menuType === "slots") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("SLOT");
        if (scrollPageRef.value) {
          scrollSlotRef.value.setScrollPosition("vertical", 0);
        }
        gamePage.searchKey = "";
      } else if (menuType === "live") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "fish") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("FISH");
        if (scrollPageRef.value) {
          scrollPageRef.value.setScrollPosition("vertical", 0);
        }
      } else if (menuType === "poker") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "casual") {
        // debugger;
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;

        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;

        loadGameList("CASUAL");
      } else if (menuType === "sport") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      }
    };
    const clearSearchInput = () => {
      gamePage.searchKey = "";
      changePage(1, gamePage.pageSize);
    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const scrollSlotRef = ref();
    const scrollPageRef = ref();
    const isLoading = ref(false);
    const loadGameList = (type) => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const code = selectedPlatId.value;
      const gameType = type;
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

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
              const res = ret.data;
              if (res.code === 0) {
                isLoading.value = false;
                return res;
              }
            })
            .catch((err) => {
              isLoading.value = false;
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: "Loading failed",
              //   icon: "report_problem"
              // });
            })
        )
        .then((res) => {
          isLoading.value = false;

          // debugger;
          if (currentSelectedMenu.value === "casual") {
            miniGames.value = [];
            let minis = _.orderBy(res, "sequence");
            minis.forEach((mini) => {
              mini.lists = [];
            });
            let games = [];
            minis.forEach((mini) => {
              mini.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${selectedPlat.code.toLowerCase()}/${mini.code}.png`;

              if (mini.name.indexOf("(铜)") > -1 || mini.name.indexOf("(银)") > -1 || mini.name.indexOf("(金)") > -1) {
                games.push(mini);
              } else {
                miniGames.value.push(mini);
              }
            });

            // console.log(miniGames);

            games.forEach((game) => {
              let index = _.findIndex(miniGamesMore.value, function (o) {
                return game.name.indexOf(o.name) > -1;
              });
              if (game.name.indexOf("(铜)") > -1) {
                miniGamesMore.value[index]["copper"] = game.code;
              } else if (game.name.indexOf("(银)") > -1) {
                miniGamesMore.value[index]["silver"] = game.code;
              } else if (game.name.indexOf("(金)") > -1) {
                miniGamesMore.value[index]["gold"] = game.code;
              }
            });
            // console.log(miniGamesMore.value);
          } else {
            res.forEach((element) => {
              element.default = require("../assets/images/games/aviator/default.png");
              element.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${selectedPlat.code.toLowerCase()}/${
                element.icon
              }.png`;
            });
            gameListData.value = res;
            gamePage.total = res.length;
            changePage(1, gamePage.pageSize);
          }
        });
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };

    var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
    var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";
    const getPlatList = () => {
      cached
        .get(platformApiKey, () =>
          api.get(platformApiUrl).then((res) => {
            const response = res.data;
            return response;
          })
        )
        .then((data) => {
          if (store.memberType !== "TEST") {
            console.log(store.memberType);
            data = data.filter((element) => {
              return element.status === "OPEN";
            });
          }
          // console.log(data);

          fishPlatforms.value = data.filter((element) => element.gameType.includes("FISH"));
          platforms.value = data.filter((element) => element.gameType.includes("SLOT"));
          platformMinigame.value = data.filter((element) => element.gameType.includes("CASUAL"));
          platformMinigame.value.push(...data.filter((element) => element.gameType.includes("ESPORT")));
          liveCasinoGames.value = data.filter((element) => element.gameType.includes("LIVE"));
          xfjGames.value = data.filter((element) => element.gameType.includes("MINIGAME"));
          lotteryGames.value = data.filter((element) => element.gameType.includes("LOTTERY"));

          if (currentSelectedMenu.value === "slots") {
            switchPlat(platforms.value[0], "slots");
            platforms.value.forEach((e, i) => {
              if (e.code === "AWS") {
                platforms.value.splice(i, 1);
              }
            });
          } else if (currentSelectedMenu.value === "fish") {
            switchPlat(fishPlatforms.value[0], "fish");
          }

          // console.log("After");
          // console.log(platformMinigame.value);
          // alert(platformMinigame.value.length);
          // if (!route.query.plat) {
          //   switchPlat(platforms.value[0], "slot");
          //   switchPlat(fishPlatforms.value[0], "fish");
          // } else {
          //   platforms.value.forEach((element) => {
          //     if (parseInt(route.query.plat) === element.id) {
          //       switchPlat(element, "slot");
          //     }
          //   });
          // }
          // switchPlat(platforms.value[0], 'slots');
        })
        .catch((err) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: "Loading failed",
          //   icon: "report_problem"
          // });
        });
    };
    const getLength = (tab, ann) => {
      var categoryLength = announcementList.value.filter((item) => item.id == ann.typeId);
      return categoryLength.length;
    };
    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      api.get("/announcement").then((ret) => {
        const res = ret.data;
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
    const comingSoonImg = require(`../assets/home/slot/StayTuned.png`);

    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const activeKey = ref(null);
    const openPopup = (noticeType) => {
      if (noticeType) {
        noticeTitle.value = "Announcement";
        isStationNotice.value = true;
      }
    };

    const isShowBtt = ref(false);
    const scrollPosition = ref(0);
    const scrolling = (e) => {
      scrollPosition.value = e.position;
      if (e.position.top > 400) {
        isShowBtt.value = true;
      }
    };
    const gotoPromo = (banner) => {
      if (banner === 0) {
        router.push(`/promo`);
        return;
      } else if (banner.promoPageId) {
        router.push({ path: "/promo", query: { id: banner.promoPageId } });
      } else if (banner.redirectUrl) {
        const redirectPage = "/" + banner.redirectUrl;
        router.push(`${redirectPage}`);
      }
      router.push(`/promo`);
    };

    // isH5 -- platform checker
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

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    const getVersionNo = async () => {
      // console.log(Platform);
      // alert("Capacitor" + Platform.is.capacitor);
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        // const info = {
        //   version: "1.0.1"
        // };
        var current_version = parseInt(info.version.replaceAll(".", "") + info.build);
        ui.setVersion(info.version + " " + info.build);

        // info.version && info.build
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
        console.log(res, ">>res");
        if (res.data.code === 0) {
          var version_info = res.data.data.version;
          var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
          download_url.value = res.data.data.url;

          // alert(latest_ver_no);
          // console.log(download_url.value);
          if (latest_ver_no > current_version) {
            isAppUpdateModal.value = true;
          }
        }
      } else if (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) {
        ui.appVersion = "iOS App";
      }
    };

    const openDownloadPage = () => {
      window.open(download_url.value, "_system");
      isAppUpdateModal.value = false;
    };
    const cancelUpdate = () => {
      isAppUpdateModal.value = false;
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      api
        .get("/config/appDownloadUrl")
        .then((res) => {
          // console.log(res);
          downloadUrl.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const toggleFavGame = (gameId, status) => {
      if (status === true) {
        api.post("/session/member/fav-games", qs.stringify({ gameId: gameId })).then((res) => {
          // console.log(res);
          $q.notify({
            color: "positive",
            position: "top",
            message: t("lang.fav_game_added"),
            icon: "report_problem"
          });
          favGamesList.value.push({ id: gameId });
        });
      } else {
        api.delete("/session/member/fav-games?gameId=" + gameId).then((res) => {
          console.log(res);
          $q.notify({
            color: "positive",
            position: "top",
            message: t("lang.fav_game_removed"),
            icon: "report_problem"
          });
          _.remove(favGamesList.value, {
            id: gameId
          });
        });
      }
    };

    const onIntersection = (entry) => {
      // if (entry.isIntersecting === true) {
      //   add(entry.target.dataset.id)
      // }
      // else {
      //   remove(entry.target.dataset.id)
      // }
    };
    const position = ref(0);
    const scrollToTop = (el) => {
      scrollSlotRef.value?.setScrollPosition("vertical", position);
      scrollPageRef.value?.setScrollPosition("vertical", position);
      isShowBtt.value = false;
      // const target = getScrollTarget(el[0])
      // const duration = 1000
      // console.log(target)
    };

    const checkRedeemSpecialInviteBonusEligiblity = () => {
      if (store.hasToken()) {
        eventapi.get('/privi/telephone/canRedeem', {
          params: {
            promoCode: "special-invitation-bonus"
          }
        }).then((res) => {
          if(res.data.data === true) {
            specialInviteBonusEligible.value = true;
          }
        })
      }
    }

    const redeemSpecialInviteBonus = () => {
      eventapi.get('/privi/telephone/redeem', {
        params: {
          promoCode: "special-invitation-bonus"
        }
      }).then((res) => {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("lang.success"),
          icon: "check_circle_outline"
        });

        specialInviteBonusAmt.value = res.data.data
        toggleSpecialInviteBonusPopup(true);
      })
    }

    const toggleSpecialInviteBonusPopup = (status) => {
      if(status === false) {
        specialInviteBonusEligible.value = false;
      }

      specialInviteBonusPopupVisible.value = status;
    }

    onMounted(() => {
      checkPlatform();
      loadHomePromoPopup();
      loadHomeData();
      getAppDownloadUrl();
      getVersionNo();

      checkSpinWheelPromo();
      checkRedeemSpecialInviteBonusEligiblity();
    });

    const popupInterval = ref(null);
    const isSpinWheelPromo = ref(false);
    const checkSpinWheelPromo = () => {
      if (store.hasToken()) {
        setTimeout(() => {
          console.log("Check Spin Wheel.");
          getSpinWheelCount();
          popupInterval.value = setInterval(() => {
            // alert("YEs");
            getSpinWheelCount();
          }, 3600000);
        }, 60000);
      }
    };

    const getSpinWheelCount = () => {
      eventapi.get("/multiWheel/init?promoCode=multi-wheel").then((res) => {
        const { code, data } = res.data;
        if (code === 0) {
          console.log(data);
          const { leftCount, unlock } = data;
          if (leftCount > 0) {
            isSpinWheelPromo.value = true;
          }
        }
      });
    };

    const gotoPromoSpinWheel = () => {
      isSpinWheelPromo.value = false;
      router.push(`/promo?id=81`);
    };

    onUnmounted(() => {
      clearInterval(popupInterval.value);
    });

    const loadHomeData = async () => {
      if (store.hasToken()) {
        await store.getMemberInfo();

        getFavGameList();
        store.getUnreadTotal();
      }
      loadData();
      loadAnnouncement();
      getPlatList();
    };
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const loadHomePromoPopup = () => {
      const isPromoPopup = SessionStorage.getItem("isHomePromoModal");
      if (!isPromoPopup) {
        isHomePromoModal.value = true;
      }
    };

    const closePopupModal = () => {
      SessionStorage.set("isHomePromoModal", "1");
    };

    const isShow = ref(false);
    const selectSlotPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "slots");
    };
    const selectFishPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "fish");
    };
    const selectCasualPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "casual");
    };
    const isGoMiniGame = ref(false);
    const showTypeH5 = (id) => {
      if (isMobile()) {
        showMiniType.value = id;
        setTimeout(() => {
          isGoMiniGame.value = true;
        }, 500);
      }
    };

    const showFavourite = () => {
      isShow.value = true;
      selectedPlatId.value = -99;
      getFavGameList();
    };

    const showMiniType = ref(0);
    const showTypeWeb = (id) => {
      showMiniType.value = id;
      if (id === 0) {
        isGoMiniGame.value = false;
      }
    };

    return {
      imageLoading,
      slide: ref(0),
      imgURL: process.env.IMAGE_CDN + "/promo/",
      banners,
      gameBoardRef,
      gameBoardItemRef,
      gameBoardItemData,
      store,
      ui,
      platforms,
      fishPlatforms,
      comingSoonImg,
      liveCasinoGames,
      xfjGames,
      lotteryGames,
      isShow,
      mainWallet,
      playGame,
      gameModalRef,
      pokerGames,
      switchPlat,
      scrolling,
      scrollToTop,
      switchMenu,
      gamePage,
      onIntersection,
      toggleFavGame,
      favLists,
      isLoading,
      selectedPlat,
      scrollPosition,
      isShowBtt,
      scrollSlotRef,
      selectedPlatId,
      searchList,
      clearSearchInput,
      liveTabs,
      selectedLiveTab,
      currentSelectedMenu,
      esportsGame,
      showFavourite,
      selectFishPlat,
      selectSlotPlat,
      selectCasualPlat,
      platformMinigame,
      closePopupModal,
      isGoMiniGame,
      miniGames,
      miniGamesMore,
      sportsGame,
      showTypeH5,
      showTypeWeb,
      showMiniType,
      openGame,
      openFavGame,
      scrollPageRef,
      announcementList,
      isStationNotice,
      isHomePromoModal,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      getLength,
      isSpinWheelPromo,
      gotoPromo,
      gotoPromoSpinWheel,
      router,
      isAppUpdateModal,
      isH5,
      openDownloadPage,
      cancelUpdate,
      getAppDownloadUrl,
      favGamesList,
      sortedFavGamesList,
      // updateSortedFavGamesList,
      getFavGameList,
      specialInviteBonusEligible,
      specialInviteBonusPopupVisible,
      redeemSpecialInviteBonus,
      toggleSpecialInviteBonusPopup
    };
  }
});
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

.midd {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 10px 5px;

  @media (min-width: 769px) {
    margin: 10px;
  }

  .station-notice-wrapper {
    display: flex;
    border-radius: 8px;
    border: 1px solid $border-color;
    gap: 10px;
    padding: 2px 10px;
    justify-content: center;
    align-items: center;
    width: 85%;
    flex: 1;

    .volume {
      padding-top: 3px;

      img {
        width: 21px;
        height: auto;
      }
    }

    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .share {
    background-image: $linear-bg-red;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    flex: 1;
  }
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0px auto 10px;
  align-items: flex-start;
  column-gap: 10px;
  row-gap: 10px;
  width: calc(100% - 20px);

  .inner-slot-game {
    position: relative;
  }

  .q-list {
    .q-img {
      aspect-ratio: 1/1;

      .q-img__image {
        width: 100%;
        height: 100%;
        object-fit: fill !important;
      }
    }
  }

  .slot-name {
    text-align: center;
    padding: 5px 2px 0px;
    font-size: 10px;
    background: transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 75px;
    margin: auto;

    @media (min-width: 600px) {
      font-size: 12px;
      word-break: normal;
      padding: 10px 2px;
      width: auto;
      white-space: wrap;
    }

    @media (min-width: 769px) {
      font-size: 14px;
    }
  }
}

#id-fish-board {
  .q-list {
    aspect-ratio: 155/97;
  }
}

.grid-wrapper {
  overflow: hidden;
}

.grid {
  display: flex;
  margin: 0px auto 0px;
  align-items: flex-start;
  column-gap: 8px;
  row-gap: 14px;
  width: calc(100% - 20px);
  background: linear-gradient(180deg, rgba(0, 0, 40, 0.71) 0%, #303072 100%);
  padding: 6px 12px 6px;
  border-radius: 12px;
  overflow-x: auto;

  @media (min-width: 769px) {
    margin: 10px auto;
  }

  .game-board-item {
    border-radius: 8px;
    width: auto;
    gap: 12px;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 12px 12px;
    white-space: nowrap;

    &.active-board {
      // background: $linear-bg-4;
      background: #5555aa;
    }

    &:hover {
      filter: brightness(0.88);
      background: #5555aa;
    }

    &:active {
      opacity: 0.95;
      filter: brightness(0.86);
    }

    span {
      font-size: 0.9em;
    }

    img {
      width: auto;
      max-height: 30px;
    }
  }
}

.game-grid-lists {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: calc(100% - 20px);
  margin: 6px auto 20px;
  padding-bottom: 30px;
  // padding-top: 15px;
  column-gap: 15px;
  row-gap: 10px;
  transition: 1s ease-in;

  @media (min-width: 769px) {
    margin: 12px auto 20px;
    padding-top: 15px;
  }

  .game-item {
    border-radius: 8px;

    .platform-img {
      width: 100%;
      height: auto;
      aspect-ratio: 280/328;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top center;
    }

    img {
      width: 100%;
    }
  }
}

.home-bottom-section {
  margin-top: 16px;

  .marquee {
    background: $third-color;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    max-width: 100%;
    height: 50px;
    padding: 4px 10px;
    overflow-x: hidden;
  }

  .content {
    width: calc(100vw - 20px);
    margin: auto;

    img {
      margin-left: 15px;
      margin-right: 15px;
    }
  }

  .track {
    position: absolute;
    white-space: nowrap;
    will-change: transform;
    animation: marquee 30s linear infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-1500px);
    }
  }

  .bottom-footer {
    //background: url("../assets/images/index/footer-desc-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 60px 0px;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding: 6px 12px 60px;

    .footer-logo {
      text-align: center;
      width: 200px;
      margin: 0 auto;
    }
  }
}

.img-coming-soon {
  //max-width: 300px;
  grid-column: 1 / 4;
}

.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-leave-active {
  transition: none;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.favourite-star {
  position: absolute;
  z-index: 10;
  top: 3px;
  right: 3px;

  &:hover {
    opacity: 0.9;
    transform: scale(1.2);
    transform-origin: center;
  }

  &:active {
    filter: brightness(0.85);
    transform: scale(1.2);
    transform-origin: center;
  }
}

.game-scroll-lists {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  // width: calc(100% - 20px);
  width: 100%;
  margin: 6px auto 10px;
  position: relative;

  @media (min-width: 769px) {
    margin: 12px auto 20px;
    padding-top: 15px;
  }

  .bookmarks {
    width: 70px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    grid-gap: 0px;
    margin: 0px auto 10px 0px;
    padding: 0px 10px 10px;
    justify-content: flex-start;

    .plat-item {
      display: flex;
      width: 100%;
      height: 50px;
      box-sizing: content-box;
      padding: 10px 10px;
      justify-content: center;
      align-items: center;
      background: $third-color;

      .platform-img {
        max-width: 85px;
        filter: grayscale(1);

        width: 100%;
        height: auto;
        aspect-ratio: 200/133;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      img {
        max-width: 50px;
        filter: grayscale(1);
      }

      &:active {
        filter: brightness(0.86);
      }

      &:first-of-type {
        border-radius: 10px 10px 0px 0px;
      }

      &:last-of-type {
        border-radius: 0px 0px 10px 10px;
      }

      span {
        color: rgba(200, 200, 200, 0.5);
        font-size: 20px;
        font-weight: bold;
      }

      &.active {
        background: $linear-bg-2;
        box-shadow: inset 0 0 5px #ffffff;

        img {
          filter: grayscale(0);
        }

        .platform-img {
          filter: grayscale(0);
        }

        span {
          color: #ffffff;
        }
      }
    }
  }
}

.loading-div {
  z-index: 99;
  position: absolute;
  top: 0;
  text-align: center;
  right: 0px;
  width: calc(100% - 130px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: $header-color;
    width: 48px;
  }
}

.mid-grid-column {
  grid-column: 2/3;
}

.coming-soon-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  grid-column: 2/3;

  img {
    width: 200px;
    height: auto;
  }
}

.minigame-select-div {
  position: relative;

  &:hover {
  }

  .select-type-div {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;

    .game-type {
      width: 100%;
      height: 33.3%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      text-shadow: 1px 1px 1px $text-gray;

      &#copper-type {
        background: #b87333;
        opacity: 0.85;
        border-radius: 12px 12px 0px 0px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#silver-type {
        background: #c0c0c0;
        opacity: 0.85;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#gold-type {
        background: #ffd700;
        opacity: 0.85;
        border-radius: 0px 0px 12px 12px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }
    }
  }
}

.search-list {
  display: flex;
  margin-bottom: 16px;
  margin-right: 10px;
  margin-left: 10px;

  justify-content: flex-end;

  .search-input {
    max-width: 450px;
    margin-left: auto;

    &.q-field--filled .q-field__control {
      border-radius: 12px;
    }
  }

  .clear-input-icon {
    cursor: pointer;
    opacity: 0.8;
  }
}

.fav-slot-game {
  img {
    width: 100%;
    display: block;
  }
}

@media (min-width: 600px) {
}

@media (min-width: 769px) {
  .grid {
    // column-gap: 16px;
    // row-gap: 14px;
    // grid-template-columns: repeat(4, 1fr);

    .game-board-item {
      img {
        width: auto;
        max-height: 35px;
      }
    }
  }

  .game-grid-lists {
    padding-top: 15px;
    column-gap: 25px;
    grid-template-columns: repeat(4, 1fr);
  }

  .game-scroll-lists {
    .bookmarks {
      width: 100px;

      .plat-item {
        img {
          max-width: 70px;
        }
      }
    }
  }

  .slot-grid {
    grid-template-columns: repeat(4, 1fr);
    column-gap: 14px;
    row-gap: 14px;
  }
}

@media (min-width: 991px) {
  .grid .game-board-item {
    cursor: pointer;
    border-radius: 10px;
    // max-width: 110px;
    // max-height: 125px;
    // aspect-ratio: 110/125;

    span {
      font-size: 1em;
    }
  }

  .main-section {
    background-repeat: repeat-x;
  }

  .game-grid-lists {
    grid-template-columns: repeat(6, 1fr);
  }

  .slot-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .grid {
    // grid-template-columns: repeat(6, 1fr);
    // grid-template-rows: repeat(1, 1fr);
  }

  .game-grid-lists {
    grid-template-columns: repeat(8, 1fr);
  }

  #id-live-board {
    grid-template-columns: repeat(4, 1fr);
  }

  #id-casual-board {
    grid-template-columns: repeat(4, 1fr);
  }

  .mid-grid-column {
    grid-column: 4/6;
  }

  .coming-soon-div {
    grid-column: 4/6;
  }
}

.modal-update-div {
  .menu-title {
    > div:first-child {
      width: 32px;
    }
  }

  .description {
    color: $border-color;
  }

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

.special-invite-bonus-sticky {
  background: url("./../assets/images/promotion/special-invite-bonus/special-invite-bonus-sticky.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 190px;
  height: 136px;
  position: absolute;
  top: 10%;
  right: 0;
}

.special-invite-bonus-container {
  position: relative;

  .header-decoration-wrapper {
    .header-decoration {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 200px;
      position: relative;

      .confetti {
        position: absolute;
      }

      .money-bags {
        position: absolute;
        top: 150px;
      }
    }
  }
  

  .special-invite-bonus-content {
    background: url("./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: 30px;
    max-width: 495px;
    min-height: 300px;
    padding: 30px 20px 20px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    justify-content: center;

    .title-wrapper {
      display: flex;
      align-items: center;

      .reward-amt {
        font-size: 30px;
        font-weight: 700;
        color: #FFE35A;
        margin-left: 20px;
      }
    }

    .desc-wrapper {
      display: flex;
      flex-direction: column;

      .desc-title {
        color: #FFCF1F;
      }

      .desc-content {
        color: #E79DFF;
      }
    }

    .special-invite-bonus-popup-confirm-btn {
      background: url("../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-confirm-btn.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      max-width: 200px;
      width: 100%;
      min-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px auto 0px;
      font-weight: 700;
      font-size: 18px;
    }
  }
}

.home-popup-banner {
  .promo-popup-div {
    width: 100%;
    padding: 8px;
    position: relative;

    .popup-btn {
      position: absolute;
      top: 0px;
      left: 10px;
      z-index: 999;
      cursor: pointer;
    }

    img {
      width: 100%;
      position: relative;
      z-index: -1;
    }

    .popup-list {
      margin-top: -40px;
    }

    a,
    a:visited,
    a:active,
    a:focus {
      color: #fff9e2;
    }

    .popup-item {
      width: 92%;
      margin: 0 auto 14px;
      border: 2px solid #d483ff;
      background: rgba(52, 41, 97, 0.9);
      border-radius: 11px;
      //margin-bottom: 14px;
      line-height: 30px;
      font-size: 22px;
      text-align: center;
      padding: 8px;
      box-shadow: 0px 3px 2px 0px #ddb2ff42 inset;
      box-shadow: 0px 0px 5px 3px #8000ffd9;
      cursor: pointer;
      text-shadow: 1px 2px 2px #000000;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(1.1);
      }

      em {
        color: #ecff17;
        font-size: 26px;
        font-weight: 600;
        font-style: normal;
      }
    }
  }
}

.main-slide-txt {
  font-size: 1.5rem;
  max-width: 10rem;
  margin-right: auto;
  line-height: 1.4;
  color: #ffc700;

  @media (min-width: 769px) {
    font-size: 2rem;
    max-width: 15rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1280px) {
    font-size: 2.5rem;
    max-width: 20rem;
  }
}
</style>

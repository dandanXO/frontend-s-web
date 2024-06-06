<template>
  <div class="main-section">
    <LangToggle />

    <RollingText :depositRecordList="depositRecordList"/>

    <JackpotPrize />

    <GameCategory :onClickGameCategory="(categoryName, categoryIndex) => switchMenu(categoryName, categoryIndex)" :selectedCategory="currentSelectedMenu" />

    <Transition>
      <GameItem
        v-if="currentSelectedMenu === 'live'"
        :games="liveCasinoGames"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
        :onClickGameItem="openGame"
      />
    </Transition>

    <!-- slot start -->
    <Transition>
      <GameItem
        v-if="currentSelectedMenu === 'slots' && !isShow"
        :games="platforms"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
        :onClickGameItem="selectSlotPlat"
      />
    </Transition>

    <Transition>
      <div
        class="game-scroll-lists"
        id="id-slot-board"
        v-if="currentSelectedMenu === 'slots' && isShow"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
      >
        <q-scroll-area
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: 80px; max-width: 80px' : 'width: 120px; max-width: 120px'"
        >
          <div class="bookmarks">
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
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="'blue'" size="8em" />
        </div>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId === -99"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
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
                dense
                outlined
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
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
                  @click="openSlotGame(game.name, game.code, selectedPlat.status, game)"
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
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>
    <!-- slot end -->

    <Transition>
      <div
        class="game-grid-lists"
        id="id-fish-board"
        v-if="currentSelectedMenu === 'fish' && !isShow"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
      >
        <template v-for="p in fishPlatforms" :key="p">
          <div class="game-item btn-pointer btn-slot-game" @click="selectFishPlat(p)">
            <div
              class="platform-img"
              :style="{
                backgroundImage: (() => {
                  try {
                    return `url(${require(`../assets/images/people/people-${p.name.toLowerCase()}.png`)})`;
                  } catch (e) {
                    return `url(${comingSoonImg})`;
                  }
                })()
              }"
            ></div>
            <div class="plat-form-box">
              <div class="plat-form-text">{{ p.alias ? p.alias : p.name }}</div>
            </div>
            <div class="platform-company-box">
              <div
                class="company-image"
                :style="{
                  backgroundImage: (() => {
                    try {
                      return `url(${require(`../assets/images/footer/logo-${p.name.toLowerCase()}.png`)})`;
                    } catch (e) {
                      return '';
                    }
                  })()
                }"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-scroll-lists"
        id="id-fish-board"
        v-if="currentSelectedMenu === 'fish' && isShow"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
      >
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
          <q-spinner-hourglass :color="'blue'" size="8em" />
        </div>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId === -99"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
          <div class="fish-grid" style="padding-bottom: 20px" v-if="sortedFavGamesList.length > 0">
            <div
              v-for="(game, index) in sortedFavGamesList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              style="height: auto"
              class="btn-pointer inner-fish-game"
            >
              <transition name="in-view">
                <q-list
                  class="btn-fish-game q-col-gutter-none"
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
                    <div class="fish-name">
                      {{ game.name }}
                    </div>
                  </div>
                </q-list>
              </transition>
            </div>
          </div>

          <div class="coming-soon-div" v-else>
            <img src="../assets/home/coming-soon-img.png" />
            <span>{{ $t("lang.no_fav_game_yet") }}</span>
          </div>
        </q-scroll-area>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId !== -99"
          ref="scrollFishRef"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
          <div class="search-list">
            <q-form @submit="searchList">
              <q-input
                color="white"
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
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
                </template>
              </q-input>
            </q-form>
          </div>
          <div class="fish-grid" style="padding-bottom: 20px">
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
                  class="btn-fish-game q-col-gutter-none"
                  @click="openSlotGame(game.name, game.code, selectedPlat.status, game)"
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
                    <div class="fish-name">{{ game.name }}</div>
                  </div>
                </q-list>
              </transition>
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>

    <Transition>
      <GameItem
        v-if="currentSelectedMenu === 'esport'"
        :games="esportPlatform"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
        :onClickGameItem="openGame"
      />
    </Transition>

    <Transition>
      <GameItem
        v-if="currentSelectedMenu === 'casual' && !isShow"
        :games="platformMinigame"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
        :onClickGameItem="selectCasualPlat"
      />
    </Transition>
    <!-- cq9 start -->
    <Transition>
      <div
        class="game-scroll-lists"
        id="id-slot-board"
        v-if="currentSelectedMenu === 'casual' && isShow && selectedPlat.code === 'CQ9'"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
      >
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
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="'blue'" size="8em" />
        </div>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId === -99"
          style="height: 500px"
          :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'"
        >
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
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
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
                  @click="openSlotGame(game.name, game.code, selectedPlat.status, game)"
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
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>
    <!-- cq9 end -->
    

    <Transition>
      <MinigamesGrid v-if="currentSelectedMenu === 'casual' && selectedPlat.code === 'TFGaming' && isShow" :minigames="miniGames" :minigamesMore="miniGamesMore" :playGame="playGame" :showTypeWeb="showTypeWeb" :showTypeH5="showTypeH5" :showMiniType="showMiniType" :isLoading="isLoading" />
    </Transition>

    <Transition>
      <GameItem
        v-if="currentSelectedMenu === 'sport'"
        :games="sportPlatform"
        :gameType="currentSelectedMenu"
        :gameItemLoad="gameItemLoad"
        :onClickGameItem="openGame"
      />
    </Transition>
  </div>

  <div class="news-section">
    <div class="news-title">
      <div class="title-text">공지사항</div>
      <router-link class="more-text" :to="store.hasToken() ? '/?page=notify' : '/?page=login'">+ 더보기</router-link>
    </div>
    <template v-if="newsList.length > 0">
      <div v-for="(item, index) in newsList" :key="index" class="news-item-box">
        <div class="news-item-left">
          <div class="news-item-title" :title="item.title">
            [
            {{ item.title }}
            ] ※
            {{ item.content }}
            ※
          </div>
        </div>
        <div class="news-item-right">
          <div class="news-item-date">{{ item.createTime }}</div>
        </div>
      </div>
    </template>
    <div v-else class="news-item-box" style="justify-content: center;">
      아직 콘텐츠가 없습니다
    </div>
  </div>

  <div class="">
    <!--<div class="news-section">
      <div class="news-title news-title__sub">
        <div class="title-text">이벤트</div>
        <router-link class="more-text" :to="store.hasToken() ? '/?page=promo/all' : '/?page=login'">+ 더보기</router-link>
      </div>
      <div class="news-item-box">
        <div class="news-item-left">
          <div class="news-item-title">[필독] ※ 카지노 잭팟, 고배당 양방성 배팅 제재 안내 ※</div>
        </div>
      </div>
      <div class="news-item-box">
        <div class="news-item-left">
          <div class="news-item-title">[필독] ※ 카지노 잭팟, 고배당 양방성 배팅 제재 안내 ※</div>
        </div>
      </div>
      <div class="news-item-box">
        <div class="news-item-left">
          <div class="news-item-title">[필독] ※ 카지노 잭팟, 고배당 양방성 배팅 제재 안내 ※</div>
        </div>
      </div>
      <div class="news-item-box">
        <div class="news-item-left">
          <div class="news-item-title">[필독] ※ 카지노 잭팟, 고배당 양방성 배팅 제재 안내 ※</div>
        </div>
      </div>
    </div>-->

    <div class="news-section">
      <div class="news-title news-title__sub">
        <div class="title-text">출금현황</div>
        <!-- <router-link class="more-text" :to="store.hasToken() ? '/?page=notify' : '/?page=login'">+ 더보기</router-link> -->
      </div>
      
      <div class="news-item-box" v-for="d, index in depositRecordList" :key="index">
        <div class="news-item-left">
          <div class="news-item-title">
            {{ d.loginName }}
            <span style="color: #01e1ff">{{ d.amount }}원</span>
            <span style="color: #92959f; margin-left: 20px">{{ moment(d.transationTime).format('YYYY-MM-DD hh:mm A') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GameModal ref="gameModalRef"></GameModal>

  <!--  <q-dialog width="100%" v-model="isStationNotice">-->
  <!--    <q-card style="width: 100%" class="bg-primary text-white">-->
  <!--      <q-card-section class="q-mb-md">-->
  <!--        <div class="menu-title flex justify-between items-center">-->
  <!--          <div style="margin-right: auto">&nbsp;</div>-->
  <!--          <div>{{ $t("lang.announcement") }}</div>-->
  <!--          <q-btn style="margin-left: auto" icon="close" flat round dense v-close-popup />-->
  <!--        </div>-->

  <!--        <q-tabs-->
  <!--          v-model="activeKey"-->
  <!--          dense-->
  <!--          class="text-grey"-->
  <!--          active-color="brand"-->
  <!--          indicator-color="black"-->
  <!--          align="justify"-->
  <!--          narrow-indicator-->
  <!--        >-->
  <!--          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />-->
  <!--        </q-tabs>-->

  <!--        <q-separator />-->

  <!--        <q-tab-panels v-model="activeKey" animated>-->
  <!--          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">-->
  <!--            <q-list style="min-height: 65vh">-->
  <!--              <div v-for="(ann, idx) in announcementList" :key="idx">-->
  <!--                <span v-if="ann.typeId === tab.id">-->
  <!--                  <q-expansion-item-->
  <!--                    style="max-height: 65vh; overflow: auto"-->
  <!--                    group="somegroup"-->
  <!--                    icon="volume_up"-->
  <!--                    :label="ann.title"-->
  <!--                  >-->
  <!--                    <q-card>-->
  <!--                      <q-card-section>-->
  <!--                        {{ ann.content }}-->
  <!--                      </q-card-section>-->
  <!--                    </q-card>-->
  <!--                  </q-expansion-item>-->

  <!--                  <q-separator></q-separator>-->
  <!--                </span>-->
  <!--              </div>-->
  <!--            </q-list>-->
  <!--          </q-tab-panel>-->
  <!--        </q-tab-panels>-->
  <!--      </q-card-section>-->
  <!--    </q-card>-->
  <!--  </q-dialog>-->

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

  <!-- <q-page-sticky
    v-if="showSticky || specialInviteBonusEligible"
    class="home-sticky-div"
    position="right"
    :offset="[0, 0]"
  >
    <div v-if="showSticky" class="home-sticky"> -->
  <!-- <img class="sticky-bear" src="../assets/home/line-bear.png" /> -->
  <!-- <q-btn name="close" height="20" width="20" size="xs" @click="closeLineSticky" class="sticky-close-btn">
        <q-icon name="close"></q-icon>
      </q-btn>
      <div class="sticky-container">
        <div class="line-title">LINE</div>
        <img src="../assets/home/line-bg-thai-theme.png" class="line-img" />
        <div class="line-bottom">line ID:@jolly88</div>
      </div>
    </div>

    <div v-if="specialInviteBonusEligible" class="bonus-sticky-box">
      <div class="special-invite-bonus-sticky" @click="redeemSpecialInviteBonus" />
    </div>
  </q-page-sticky> -->

  <!--  <q-dialog class="special-invite-bonus-popup" width="100%" v-model="specialInviteBonusPopupVisible">-->
  <!--    <div class="special-invite-bonus-container">-->
  <!--      <div class="header-decoration-wrapper">-->
  <!--        <div class="header-decoration">-->
  <!--          <img-->
  <!--            class="confetti"-->
  <!--            src="./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-confetti.png"-->
  <!--            width="250"-->
  <!--          />-->
  <!--          <img-->
  <!--            class="money-bags"-->
  <!--            src="./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-money-bags.png"-->
  <!--            width="150"-->
  <!--          />-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="special-invite-bonus-content">-->
  <!--        <div class="title-wrapper">-->
  <!--          <div class="title">โบนัสพิเศษสำหรับสมาชิกที่ได้รับเชิญ</div>-->
  <!--          <div class="reward-amt">200</div>-->
  <!--        </div>-->
  <!--        <div class="desc-wrapper">-->
  <!--          <div class="desc-title">ข้อกำหนดและเงื่อนไข</div>-->
  <!--          <div class="desc-content">-->
  <!--            - โบนัสนี้สามารถ ถอนได้ที่ 2000 บาทเท่านั้น-->
  <!--            <br />-->
  <!--            - สามารถแจ้งถอนได้เมื่อยอดเครดิตถึง 2000 บาท-->
  <!--            <br />-->
  <!--            - ยอดเงินที่เหลือตจะถูกหักออกทันทีหลังการถอนสำเร็จ-->
  <!--            <br />-->
  <!--            - โบนัสนี้ไม่สามารถใช้ซื้อฟรีสปินได้-->
  <!--            <br />-->
  <!--            - บัญชีที่มี IP เดียวกันหรือข้อมูลที่คล้ายกันจะถูกตัดสิทธิ์จากการรับโปรโมชั่นนี้-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div class="special-invite-bonus-popup-confirm-btn" @click="toggleSpecialInviteBonusPopup(false)">-->
  <!--          {{ $t("lang.confirm") }}-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </q-dialog>-->

  <!-- <q-dialog class="home-popup-banner" width="100%" v-model="isHomePromoModal">
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

      <img src="../assets/images/common/home-popup-img-thai-theme.png" />

      <div class="popup-list">
        <router-link to="/promo?id=81">
          <div class="popup-item">
            <span>
              หมุนวงล้อ รับโบนัส
              <em>8,880</em>
              รางวัลสูงสุด
              <em>IPHONE</em>
            </span>
          </div>
        </router-link>

        <router-link to="/promo?id=217">
          <div class="popup-item">
            <span>
              รับโบนัสรายวัน เทิร์นโอเวอร์
              <em>3</em>
              เท่า
            </span>
          </div>
        </router-link>

        <router-link to="/promo?id=80">
          <div class="popup-item">
            <span>
              แนะนำเพื่อนรับเงินคืนสูงสุด
              <em>20,000</em>
            </span>
          </div>
        </router-link>

        <router-link to="/promo?id=216">
          <div class="popup-item">
            <span>
              ฝาก
              <em>200%</em>
              รับ
              <em>300</em>
              ทุกวันศุกร์
            </span>
          </div>
        </router-link>

        <router-link to="/promo?id=77">
          <div class="popup-item">
            <span>
              ยอดฝากรายวันรับ
              <em>30%</em>
              สูงสุด
              <em>2,000</em>
            </span>
          </div>
        </router-link>
        <router-link to="/promo?id=168">
          <div class="popup-item">
            <span>
              สะสมยอดฝาก
              <em>300</em>
              รับทันทีฟรีสปรินสล็อต
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </q-dialog> -->

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
      <q-btn @click="gotoPromoSpinWheel" :label="$t('lang.close_btn')" color="brand" />
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
import GameItem from "components/game/GameItem";
import GameCategory from "components/game/GameCategory";
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
import moment from "moment";
import MinigamesGrid from 'components/game/MinigamesGrid';
import LangToggle from "src/components/LangToggle.vue";
import RollingText from "src/components/home/RollingText.vue";
import JackpotPrize from "src/components/home/JackpotPrize.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    MarqueeText,
    BacktoTop,
    Vue3Marquee,
    RiStarLine,
    RiStarFill,
    GameItem,
    GameCategory,
    MinigamesGrid,
    LangToggle,
    RollingText,
    JackpotPrize
    // RiVolumeUpLine,
    // RiBilliardsLine,
    // RiBasketballLine,
    // RiUserShared2Line
  },
  setup() {
    const snowCount = 10;

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

    const getBackgroundImageStyle = (name) => {
      return {
        backgroundImage: `url(${require(`../assets/home/menu/menu-${name}.png`)})`
      };
    };

    const showSticky = ref(true);
    const checkSticky = () => {
      const stickyOff = localStorage.getItem("LINE_STICKY_OFF");
      if (stickyOff === "true") {
        showSticky.value = false;
      }
    };
    const closeLineSticky = () => {
      showSticky.value = false;
      localStorage.setItem("LINE_STICKY_OFF", "true");
    };

    const mainWallet = computed(() => {
      return store.balance;
    });
    const gameModalRef = ref(null);
    const openSlotGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(gameName, selectedPlat.code, gameCode, gameStatus);
    };
    const openGame = (p) => {
      // debugger;
      console.log(p);
      const gameType = p.gameType;
      const gameName = p.name;
      const platformCode = p.code;
      const gameStatus = "OPEN";
      var gameCode = "";
      if (gameType === "SLOT" || gameType === "FISH") {
        gameCode = p.id;
      }

      if (platformCode === "PP") {
        gameCode = 101;
      }

      gameModalRef.value.open(gameName, platformCode, gameCode, gameStatus);
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
    // const getFavGameList = () => {
    //   // const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
    //   // favGamesList.value = favGames;
    //   // updateSortedFavGamesList();
    //
    //   api.get("/session/member/fav-games").then((res) => {
    //     if (res.data.code === 0) {
    //       favGamesList.value = res.data.data;
    //
    //       favGamesList.value.forEach((element) => {
    //         element.default = require("../assets/images/games/aviator/default.png");
    //         if (element.icon.startsWith("3/")) {
    //           element.icon = `${process.env.IMAGE_CDN}/game/${element.icon}`;
    //         } else {
    //           element.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${element.platformCode.toLowerCase()}/${
    //             element.icon
    //           }.png`;
    //         }
    //       });
    //     }
    //   });
    // };

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
    const sportsGame = ref([]);

    // {
    //   code: "TFGaming",
    //     name: "TF Gaming",
    //   gameName: "AE Sexy",
    //   gameCode: "MX-LIVE-001",
    //   logo: require("../assets/logo/TF88.png"),
    // },
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
    const newsList = ref([]);
    const depositRecordList = ref([]);

    // /member/withdraw-deposit-record

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
    const esportPlatform = ref([]);
    const sportPlatform = ref([]);
    const lotteryGames = ref([]);
    const lotteryGamesMore = ref([]);
    const lotteryGamesList = computed(() => {
      if (isShow.value) {
        return lotteryGamesMore.value;
      }

      return lotteryGames.value;
    });
    const gameBoardItemData = [
      { name: "live", label: "라이브카지노", enLabel: "LIVE CASINO" },
      { name: "slots", label: "슬롯게임", enLabel: "SLOT GAME" },
      { name: "esport", label: "E-스포츠", enLabel: "ESPORTS" },
      { name: "sport", label: "스포츠", enLabel: "SPORTS" },
      { name: "casual", label: "미니게임", enLabel: "MINI GAME" }
      // { name: "fish", label: "낚시 게임" }
    ];

    const gameItemLoad = ref(false);

    const currentSelectedMenu = ref("live");
    const switchMenu = (menu, index) => {
      gameItemLoad.value = true;

      setTimeout(() => {
        gameItemLoad.value = false;
      }, 2500);

      currentSelectedMenu.value = menu;
      isShow.value = false;

      // platforms.value = platforms.value.reverse();

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
      } else if (menuType === "fish" || (menuType === "casual" && plat.code === "CQ9")) {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("FISH");
        if (scrollPageRef.value) {
          scrollFishRef.value.setScrollPosition("vertical", 0);
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
      } else if (menuType === "lottery") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;

        loadGameList("LOTTERY");
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
    const scrollFishRef = ref();
    const scrollPageRef = ref();
    const isLoading = ref(false);
    const loadGameList = (type) => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const code = selectedPlatId.value;
      const gameType = type;
      const key = store.hasToken()
        ? `LOGGED_PLATFORM_GAMES_${code}_${gameType}_${regDevice}`
        : `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

      var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";

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
          if (currentSelectedMenu.value === "casual" && selectedPlat.code !== 'CQ9') {
            miniGames.value = [];
            let minis = _.orderBy(res, "sequence");
            minis.forEach((mini) => {
              mini.lists = [];
            });
            let games = [];
            minis.forEach((mini) => {
              if (mini.icon.startsWith("10/")) {
                mini.icon = `${process.env.IMAGE_CDN}/game/${mini.icon}`;
              } else {
                mini.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${selectedPlat.code.toLowerCase()}/${
                  mini.code
                }.png`;
              }
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
          } else if (currentSelectedMenu.value === "lottery") {
            lotteryGamesMore.value = res;
          } else {
            res.forEach((element) => {
              element.default = require("../assets/images/games/aviator/default.png");
              element.icon = `${process.env.IMAGE_CDN}/game/${element.icon}`;
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

    const getPlatList = async () => {
      //假裝打 api 接 json 回傳
      // const res = await fetch("fakeData/homePagePlatList.json");

      // const result = await res.json();

      // const resData = result.data;
      cached
        .get(platformApiKey, () =>
          api.get(platformApiUrl).then((res) => {
            const response = res.data;
            return response;
          })
        )
        .then((data) => {
          // console.log("HEre");
          // console.log(data);

          fishPlatforms.value = data.filter((element) => element.gameType.includes("FISH"));
          platforms.value = data.filter((element) => element.gameType.includes("SLOT"));
          esportPlatform.value = data.filter((element) => element.gameType.includes("ESPORT"));
          liveCasinoGames.value = data.filter((element) => element.gameType.includes("LIVE"));

          //TODO:: HArdcoded.
          console.log(liveCasinoGames.value);
          liveCasinoGames.value = liveCasinoGames.value.sort((a,b) => b.id - a.id);

          sportPlatform.value = data.filter((element) => element.gameType.split(",").indexOf("SPORT") > -1);

          console.log("SORT");
          console.log(sportPlatform.value);

          platformMinigame.value = data.filter((element) => element.gameType.includes("CASUAL") || (element.gameType.includes("FISH") && element.code === "CQ9"));

          // xfjGames.value = data.filter((element) => element.gameType.includes("MINIGAME"));
          // lotteryGames.value = data.filter((element) => element.gameType.includes("LOTTERY"));

          //   if (currentSelectedMenu.value === "slots") {
          //     switchPlat(platforms.value[0], "slots");
          //     platforms.value.forEach((e, i) => {
          //       if (e.code === "AWS") {
          //         platforms.value.splice(i, 1);
          //       }
          //     });
          //   } else if (currentSelectedMenu.value === "fish") {
          //     switchPlat(fishPlatforms.value[0], "fish");
          //   }
        })
        .catch((err) => {});
    };

    const getLength = (tab, ann) => {
      var categoryLength = store.announcementList.value.filter((item) => item.id == ann.typeId);
      return categoryLength.length;
    };
    // const announcementList = ref([]);
    const announcementTypes = ref([]);
    const formatDate = (timestamp) => moment(timestamp).format("YYYY/MM/DD");
    const loadAnnouncement = () => {
      api
        .get("/announcement")
        .then((res) => {
          const {
            data: {
              code,
              data: { announcements }
            }
          } = res;

          if (code === 0) {
            console.log(announcements);
            const announcementsFormattedData = announcements.map((item) => ({
              ...item,
              createTime: formatDate(item.createTime)
            }));
            newsList.value = announcementsFormattedData;
            store.announcementList = announcements;
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "資料讀取失敗",
              icon: "report_problem"
            });
          }

          // newsList.value = announcements;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const loadDepositRecordList = () => {
      api
        .get("/member/withdraw-deposit-record")
        .then((res) => {
          const response = res.data;

          if (response.code === 0) {
            depositRecordList.value = response.data.records;
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "資料讀取失敗",
              icon: "report_problem"
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const comingSoonImg = require(`../assets/home/slot/StayTuned.png`);

    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const activeKey = ref(null);
    const openPopup = (noticeType) => {
      // router.push("/?page=personal/messages");
      // if (noticeType) {
      //   noticeTitle.value = "Announcement";
      //   isStationNotice.value = true;
      // }
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
        if (banner.redirectUrl.startsWith("promo/")) {
          const promoId = banner.redirectUrl.substring(6);
          router.push({ path: "/promo", query: { id: promoId } });
        } else if (banner.redirectUrl.startsWith("open/")) {
          const parts = banner.redirectUrl.split("/");
          if (parts.length === 5) {
            const gameName = parts[1];
            const platformCode = parts[2];
            const gameCode = parts[3];
            const status = parts[4];
            gameModalRef.value.open(gameName, platformCode, gameCode, status);
          }
        }
      }
      // router.push(`/promo`);
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
        var current_version = parseInt(info.version.replace(/\./g, "") + info.build);
        ui.setVersion(info.version + " " + info.build);
        // console.log("Current Ver: " + current_version);

        // info.version && info.build
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
        console.log(res, ">>res");
        if (res.data.code === 0) {
          var version_info = res.data.data.version;
          var latest_ver_no = parseInt(version_info.replace(/\./g, ""));
          download_url.value = res.data.data.url;
          // console.log("latest_ver_no Ver: " + latest_ver_no);

          // alert(latest_ver_no);
          // console.log(download_url.value);
          if (latest_ver_no > current_version) {
            isAppUpdateModal.value = true;
          }
        }
      } else if (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) {
        ui.appVersion = "iOS App";
      } else if (isH5.value && Platform.is.mobile) {
        const res = await api.get(`/config/appVersionAndUrl?type=ALL&device=ANDROID`);

        if (res.data.code === 0) {
          store.setAppDownloadUrl(res.data.data.url);
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

    const downloadUrl = ref("");

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

    // const checkRedeemSpecialInviteBonusEligiblity = () => {
    //   if (store.hasToken()) {
    //     eventapi
    //       .get("/privi/telephone/canRedeem", {
    //         params: {
    //           promoCode: "special-invitation-bonus"
    //         }
    //       })
    //       .then((res) => {
    //         if (res.data.data === true) {
    //           specialInviteBonusEligible.value = true;
    //         }
    //       });
    //   }
    // };

    const redeemSpecialInviteBonus = () => {
      eventapi
        .get("/privi/telephone/redeem", {
          params: {
            promoCode: "special-invitation-bonus"
          }
        })
        .then((res) => {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("lang.success"),
            icon: "check_circle_outline"
          });

          specialInviteBonusAmt.value = res.data.data;
          toggleSpecialInviteBonusPopup(true);
        });
    };

    const toggleSpecialInviteBonusPopup = (status) => {
      if (status === false) {
        specialInviteBonusEligible.value = false;
      }

      specialInviteBonusPopupVisible.value = status;
    };

    onMounted(() => {
      checkPlatform();
      loadHomePromoPopup();
      loadHomeData();
      getVersionNo();
      checkSticky();
      loadDepositRecordList();

      // checkSpinWheelPromo();
      // checkRedeemSpecialInviteBonusEligiblity();
    });

    const popupInterval = ref(null);
    const isSpinWheelPromo = ref(false);
    // const checkSpinWheelPromo = () => {
    //   if (store.hasToken()) {
    //     setTimeout(() => {
    //       console.log("Check Spin Wheel.");
    //       getSpinWheelCount();
    //       popupInterval.value = setInterval(() => {
    //         // alert("YEs");
    //         getSpinWheelCount();
    //       }, 3600000);
    //     }, 60000);
    //   }
    // };

    // const getSpinWheelCount = () => {
    //   eventapi.get("/multiWheel/init?promoCode=multi-wheel").then((res) => {
    //     const { code, data } = res.data;
    //     if (code === 0) {
    //       console.log(data);
    //       const { leftCount, unlock } = data;
    //       if (leftCount > 0) {
    //         isSpinWheelPromo.value = true;
    //       }
    //     }
    //   });
    // };

    const gotoPromoSpinWheel = () => {
      isSpinWheelPromo.value = false;
      // router.push(`/promo?id=81`);
    };

    onUnmounted(() => {
      clearInterval(popupInterval.value);
    });

    const loadHomeData = async () => {
      if (store.hasToken()) {
        await store.getMemberInfo();

        // getFavGameList();
        store.getUnreadTotal();
      }
      // loadData();
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
    const selectLotteryPlat = (plat) => {
      // debugger;
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "lottery");
    };
    const selectCasualPlat = (plat) => {
      console.log(plat);
      if (plat.code === "Spribe") {
        playGame(plat.name, plat.code, "aviator");
      } else if(plat.code === "CQ9") {
        selectedPlatId.value = plat.id;
        isShow.value = true;
        switchPlat(plat, "fish");
      } else {
        selectedPlatId.value = plat.id;
        isShow.value = true;
        switchPlat(plat, "casual");
      }
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
      // getFavGameList();
    };

    const showMiniType = ref(0);
    const showTypeWeb = (id) => {
      showMiniType.value = id;
      if (id === 0) {
        isGoMiniGame.value = false;
      }
    };

    return {
      snowCount,
      imageLoading,
      slide: ref(0),
      imgURL: process.env.IMAGE_CDN + "/promo/",
      gameImgURL: process.env.IMAGE_CDN + "/game/",
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
      lotteryGamesMore,
      lotteryGamesList,
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
      scrollFishRef,
      selectedPlatId,
      searchList,
      clearSearchInput,
      liveTabs,
      selectedLiveTab,
      currentSelectedMenu,
      esportsGame,
      esportPlatform,
      sportPlatform,
      showFavourite,
      selectFishPlat,
      selectLotteryPlat,
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
      openSlotGame,
      openFavGame,
      scrollPageRef,
      // announcementList,
      isStationNotice,
      closeLineSticky,
      showSticky,
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
      favGamesList,
      sortedFavGamesList,
      // updateSortedFavGamesList,
      // getFavGameList,
      specialInviteBonusEligible,
      specialInviteBonusPopupVisible,
      redeemSpecialInviteBonus,
      toggleSpecialInviteBonusPopup,
      newsList,
      getBackgroundImageStyle,
      gameItemLoad,
      depositRecordList,
      moment
    };
  }
});
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

.home-decor-flower,
.home-decor-bike,
.home-decor-bike-2,
.home-decor-tree {
  display: none;
}

.home-banner-wrapper {
  position: relative;
  width: 100%;
  height: 440px;
  background: url("../assets/images/headerBanner/banner.svg") no-repeat center center;
}

.slot-grid,
.fish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0px auto 10px;
  align-items: flex-start;
  column-gap: 10px;
  row-gap: 10px;
  width: calc(100% - 20px);

  .inner-slot-game,
  .inner-fish-game {
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

  .slot-name,
  .fish-name {
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



.game-grid-lists {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: calc(100% - 20px);
  margin: 6px auto 20px;
  padding-bottom: 30px;
  // padding-top: 15px;
  transition: 1s ease-in;

  @media (min-width: 769px) {
    margin: 12px auto 20px;
    padding-top: 15px;
  }

  .game-item {
    border-radius: 2px;
    position: relative;
    //border: 2px solid #789EFF;

    .platform-img {
      width: 100%;
      height: auto;
      aspect-ratio: 672/828;
      background-size: 100% 100%;
      /* background-size: contain; */
      background-repeat: no-repeat;
      background-position: top center;
    }

    .plat-form-box {
      position: absolute;
      /* position: relative; */
      left: 2px;
      bottom: 2px;
      right: 2px;
      width: calc(100% - 4px);
      height: 45px;
      background-color: #1f2833;
      display: flex;
      justify-content: center;
      align-items: center;

      .plat-form-text {
        color: #fff;
        font-size: 20px;
        line-height: 28px;
        position: relative;
      }
    }
    .platform-company-box {
      position: absolute;
      left: 3px;
      bottom: 46px;
      background-color: #0000004d;
      backdrop-filter: blur(5px);
      width: 98%;
      height: 41px;
      .company-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
      }
      @media (min-width: 760px) {
        height: 56px;
      }
    }

    /* img {
      width: 100%;
    } */
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
    width: 60px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    grid-gap: 0px;
    justify-content: flex-start;

    .plat-item {
      display: flex;
      width: 100%;
      height: 50px;
      box-sizing: content-box;
      padding: 10px 10px;
      justify-content: center;
      align-items: center;
      background: #4f4f4f36;

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
        // border-radius: 10px 10px 0px 0px;
      }

      &:last-of-type {
        // border-radius: 0px 0px 10px 10px;
      }

      span {
        color: rgba(200, 200, 200, 0.5);
        font-size: 20px;
        font-weight: bold;
      }

      &.active {
        background: linear-gradient(312deg, #0286FF 0%, #00FF85 100%);
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

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 672 / 828;
  }

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

#id-lottery-board {
  row-gap: 25px;
}

.lottery-tcg-list {
  &.game-item {
    width: 110px;
    height: 110px;
    margin: 0 auto 15px;
    padding: 9px;
    //background-image: url("../assets/images/index/thai-tcg-bg.png");
    background-size: 100% 100%;

    .platform-img {
      aspect-ratio: 1/1;
    }

    .game-name {
      width: 100%;
      display: block;
      padding: 10px 0px;
      white-space: normal;
      line-height: 14px;
      height: 30px;
      text-align: center;
    }
  }
}

.news-section {
  margin-top: 20px;
  padding: 0 16px;
}

.news-split {
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 769px) {
    gap: 10px;
  }

  .news-section {
    width: 100%;
    @media (min-width: 769px) {
      width: calc(50% - 5px);
    }
  }

  .news-item-left {
    width: 100% !important;
  }
}

.news-title {
  // background: linear-gradient(#3f4146, #202226);
  background: linear-gradient(180deg, #384a70 0%, #121c31 100%);

  height: 61px;
  border: 1px #454545 solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;

  &__sub {
    background: linear-gradient(180deg, #385f70 0%, #122931 100%);
  }

  @media (min-width: 769px) {
    padding: 0px 40x;
  }
  .title-text {
    font-size: 14px;
    line-height: 19.6px;
    @media (min-width: 769px) {
      font-size: 20px;
      line-height: 28px;
    }
  }
  .more-text {
    font-size: 14px;
    line-height: 19.6px;
    color: #ff3c3c;
    cursor: pointer;
    @media (min-width: 769px) {
      font-size: 20px;
      line-height: 28px;
    }
  }
}

.news-item-box {
  width: 100%;
  height: 60px;
  background-color: #192235;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 25px;
  font-size: 12px;
  line-height: 16.8px;
  border-bottom: 1px solid #3f3f3f;

  display: grid;
  grid-template-columns: minmax(calc(90% - 100px), 90%) minmax(100px, 10%);

  &:hover {
    .news-item-title,
    .news-item-date {
      transform: scale(1.02);
      color: #01e1ff !important;
    }
  }

  @media (min-width: 769px) {
    padding: 0px 40x;
    font-size: 16px;
    line-height: 22px;
  }
  .news-item-left {
    width: 100%;
    @media (min-width: 769px) {
      width: 60%;
    }

    .news-item-sort {
      padding-right: 8px;
    }
    .news-item-title {
      transition: 0.3s all;
      padding-right: 8px;
      padding-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @media (max-width: 769px) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .news-item-box {
    @media (min-width: 769px) {
      width: 100%;
    }
  }
  .news-item-right {
    .news-item-date {
      transition: 0.3s all;
      color: #92959f;
    }
  }
}

@media (min-width: 600px) {
}

@media (min-width: 769px) {
  .grid {
    .game-board-item {
      img {
        // width: auto;
        // max-height: 40px;
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
      width: 80px;

      .plat-item {
        img {
          max-width: 70px;
        }
      }
    }
  }

  .slot-grid,
  .fish-grid {
    grid-template-columns: repeat(4, 1fr);
    column-gap: 14px;
    row-gap: 14px;
  }
}

@media (min-width: 991px) {
  .grid {
    padding: 0px 12px;
  }

  .grid .game-board-item {
    cursor: pointer;
    // border-radius: 10px;
    // max-width: 110px;
    // max-height: 125px;
    // aspect-ratio: 110/125;

    span {
      font-size: 1em;
    }
  }

  .main-section {
    background-repeat: repeat-x;

    .home-decor-flower,
    .home-decor-bike,
    .home-decor-bike-2,
    .home-decor-tree {
      display: block;
      position: absolute;
    }
    .home-decor-flower {
      left: 0px;
      top: 15%;
      width: 100px;
    }
    .home-decor-bike {
      left: 0px;
      bottom: 92px;
      width: 80px;
    }
    .home-decor-tree {
      right: 0px;
      bottom: 65px;
      width: 80px;
    }
    .home-decor-bike-2 {
      right: 80px;
      bottom: 85px;
      width: 80px;
    }
  }

  .game-grid-lists {
    grid-template-columns: repeat(4, 1fr);
  }

  .slot-grid,
  .fish-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .grid {
    // grid-template-columns: repeat(6, 1fr);
    // grid-template-rows: repeat(1, 1fr);
  }

  .game-grid-lists {
    grid-template-columns: repeat(5, 1fr);
    column-gap: 20px;

    .platform-company-box {
      position: absolute;
      left: 3px;
      bottom: 46px;
      background-color: #0000004d;
      backdrop-filter: blur(5px);
      width: 98%;
      height: 56px;
      .company-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }

  //#id-live-board {
  //  grid-template-columns: repeat(4, 1fr);
  //}

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

.bonus-sticky-box {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  height: 101px;
  margin-top: 10px;
}

.special-invite-bonus-sticky {
  //background: url("./../assets/images/promotion/special-invite-bonus/special-invite-bonus-sticky.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 115px;
  height: 135px;
  //position: absolute;/**/
  //right: 50%;
  //top: 0;

  animation: tilt-shaking 2s ease-in-out infinite;
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }
  3% {
    transform: rotate(6deg);
  }
  6% {
    transform: rotate(0deg);
  }
  9% {
    transform: rotate(-6deg);
  }
  12% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(6deg);
  }
  18% {
    transform: rotate(0deg);
  }
  21% {
    transform: rotate(-6deg);
  }
  24% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
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
    //background: url("./../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-bg.png");
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
        color: #ffe35a;
        margin-left: 20px;
      }
    }

    .desc-wrapper {
      display: flex;
      flex-direction: column;

      .desc-title {
        color: #ffcf1f;
      }

      .desc-content {
        color: #e79dff;
      }
    }

    .special-invite-bonus-popup-confirm-btn {
      //background: url("../assets/images/promotion/special-invite-bonus/special-invite-bonus-popup-confirm-btn.png");
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
      margin-top: -100px;
    }

    a,
    a:visited,
    a:active,
    a:focus {
      color: #fff9e2;
      position: relative;
    }

    .popup-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 92%;
      margin: 0 auto;
      // border: 2px solid #d483ff;
      // background: rgba(52, 41, 97, 0.9);
      border-radius: 11px;
      //margin-bottom: 14px;
      line-height: 20px;
      font-size: 16px;
      text-align: center;
      padding: 8px;
      // box-shadow: 0px 3px 2px 0px #ddb2ff42 inset;
      // box-shadow: 0px 0px 5px 3px #8000ffd9;
      cursor: pointer;
      text-shadow: 1px 2px 2px #000000;
      //background: url("../assets/images/common/home-popup-item-bg-thai-theme.png") no-repeat center center;
      background-size: 100% 100%;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(1.1);
      }

      em {
        color: #ecff17;
        font-size: 16px;
        font-weight: 600;
        font-style: normal;
      }

      span {
        padding: 10px;
        margin: 0px 35px;
      }
    }
  }
}

.home-sticky-div {
  z-index: 4000;
}

.home-sticky {
  //display:none;
  position: relative;
  width: 175px;
  height: 240px;

  .sticky-bear {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 55;
  }

  .sticky-close-btn {
    position: absolute;
    right: 5px;
    top: 37px;
    z-index: 30;
    border-radius: 50%;
    width: 20px;
    padding: 0px;
    line-height: 20px;
    height: 20px;
    background: $white;
    color: $text-gray;

    &:active {
      filter: brightness(0.8);
    }
  }

  .sticky-container {
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 15;

    width: 125px;
    aspect-ratio: 184/518;
    //background: url("../assets/home/line-board.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    //padding: 10px 0;
    padding: 15px 0px 10px;
    border-radius: 10px 0px 0px 10px;

    color: $white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
    justify-content: flex-end;

    .line-title {
      padding-top: 3px;
      font-size: 12px;
    }

    .line-img {
      width: 80px;
      height: auto;
      margin: 0 auto;
      background: #fff;
    }

    .line-bottom {
      font-size: 12px;
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

@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}

.snow {
  $total: 50;
  position: absolute;
  z-index: 0;
  width: 23px;
  height: 23px;
  //background: url(../assets/images/common/snow.png);
  background-repeat: no-repeat;

  @for $i from 1 through $total {
    $random-x: random(1000000) * 0.0001vw;
    $random-offset: random_range(-100000, 100000) * 0.0001vw;
    $random-x-end: $random-x + $random-offset;
    $random-x-end-yoyo: $random-x + ($random-offset / 2);
    $random-yoyo-time: random_range(30000, 80000) / 100000;
    $random-yoyo-y: $random-yoyo-time * 100vh;
    $random-scale: random(10000) * 0.0001 + 1;
    $fall-duration: random_range(10, 30) * 1s;
    $fall-delay: random(10) * -1s;

    &:nth-child(#{$i}) {
      opacity: random(10000) * 0.0001;
      transform: translate($random-x, -10px) scale($random-scale);
      animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
    }

    @keyframes fall-#{$i} {
      #{percentage($random-yoyo-time)} {
        transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
      }

      to {
        transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
      }
    }
  }
}
</style>

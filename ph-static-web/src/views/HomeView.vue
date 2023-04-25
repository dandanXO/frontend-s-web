<template>
  <div class="main-container">
    <div class="main-wrapper">
      <div class="top-container-wrapper">
        <div class="top-container">
          <div class="banner-slider">
            <a-carousel autoplay :slides-to-show="1">
              <div
                class="banner-container"
                v-for="(banner, i) in banners"
                :key="i"
              >
                <router-link :to="`/promotion${banner.redirectUrl}`">
                  <div
                    class="promo-bg isDesktop"
                    :style="
                      'background-image: url(' +
                      imgURL +
                      banner.desktopImageUrl +
                      ')'
                    "
                  ></div>
                  <div
                    class="promo-bg isMobile"
                    :style="
                      'background-image: url(' +
                      imgURL +
                      banner.mobileImageUrl +
                      ')'
                    "
                  ></div>
                </router-link>
              </div>
            </a-carousel>
          </div>
        </div>
      </div>
      <div class="station-notice-wrapper">
        <div class="station-notice-container">
          <RiVolumeUpLine />
          <div class="station-notice-box">
            <div class="station-notice">
              <marquee-text
                :repeat="announcementList.length"
                :duration="announcementList.length * 10"
              >
                <div v-if="announcementList">
                  <span
                    v-for="(a, i) in announcementList"
                    :key="i"
                    @click="openPopup(a)"
                  >
                    {{ a.content }}
                  </span>
                </div>
              </marquee-text>
              <!-- -->
            </div>
          </div>
        </div>
      </div>
      <div class="esports">
        <div class="esport-wrapper">
          <div
            class="card bet-box"
            data-aos="slide-right"
            data-aos-easing="ease-out"
            data-aos-duration="800"
          >
            <div class="leftname">
              <div class="game-title">ESPORTS</div>
            </div>
            <a href="#" class="common-btn bet-more">Bet Now</a>

            <!-- <a-tabs class="sportsTabs" :tabBarGutter="0" v-model:activeKey="sportEsportTabActive" @change="sportEsportChange" tabPosition="top">
                              <a-tabpane tab="ESPORTS" key="1">
                              </a-tabpane>
                              <a-tabpane tab="SPORTS" key="2">
                              </a-tabpane>
                            </a-tabs> -->
            <a-tabs
              class="matchesTabs"
              :tabBarGutter="0"
              v-model:activeKey="matchTabActive"
              @change="tabsChange"
              tabPosition="right"
            >
              <a-tab-pane
                v-for="game in homeState.tabMatchs"
                :key="game.gameId"
              >
                <template #tab>
                  <img
                    v-if="game.gameLogo !== 'ALL'"
                    :src="game.gameLogo"
                    class="tab-top-img"
                  />
                  <RiFunctionLine v-else />
                </template>
                <template v-if="game.matchInfo && game.matchInfo.length">
                  <div class="inner-content">
                    <div
                      class="matches"
                      v-for="(match, matchindex) in game.matchInfo"
                      :key="matchindex"
                    >
                      <div class="tab-match-info-wrapper">
                        <div class="tab-match-info">
                          <span class="tab-match-info-game">
                            {{ match.gameName }}
                          </span>
                          {{ match.competitionName }}
                        </div>
                        <div class="tab-match-info-season">
                          {{ match.seasonName }}
                        </div>
                      </div>
                      <div class="bet-row">
                        <div class="competitor facing-right">
                          <div class="match">{{ match.home }}</div>
                          <img :src="match.homeLogo" />
                        </div>
                        <div class="vs">VS</div>
                        <div class="competitor facing-left">
                          <img :src="match.awayLogo" />
                          <div class="match">{{ match.away }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="nomatches" v-else>
                  There is currently no matches available.
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>

          <div
            class="sports"
            data-aos="slide-left"
            data-aos-easing="ease-out"
            data-aos-duration="800"
          >
            <div class="leftname">
              <div class="game-title">SPORTS</div>
            </div>
            <a href="#" class="common-btn bet-more">Bet Now</a>

            <div class="sports-wrapper">
              <div
                class="matches"
                v-for="(match, matchindex) in homeState.sportMatchs"
                :key="matchindex"
              >
                <div class="tab-match-info-wrapper">
                  <div class="tab-match-info">
                    <span class="tab-match-info-game">
                      {{ match.name }}
                    </span>
                    {{ match.competitionName }}
                  </div>
                  <div class="tab-match-info-season">
                    {{ match.seasonName }}
                  </div>
                </div>
                <div class="bet-row">
                  <div class="competitor facing-right">
                    <div class="match">{{ match.homeName }}</div>
                    <img :src="match.homeImg" />
                  </div>
                  <div class="vs">VS</div>
                  <div class="competitor facing-left">
                    <img :src="match.awayImg" />
                    <div class="match">{{ match.awayName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="centername">
        <div class="game-title">SLOTS GAMES</div>
      </div>
      <div class="hot-slots">
        <div class="plat-item" v-for="p in platforms.slice(0, 3)" :key="p">
          <div class="top-content">
            <img
              class="plat-icon"
              :src="require('../assets/images/common/logo/' + p.code + '.png')"
            />
            <router-link :to="'/slot?plat=' + p.code" class="more-btn"
              >More &gt;&gt;</router-link
            >
          </div>
          <div class="game-container" v-if="p.games">
            <div
              class="game-slot"
              v-for="game in p.games.slice(0, 10)"
              :key="game.id"
              @click="openGame(game, p.code, p.status)"
            >
              <div>
                <img :src="game.default" v-image="game.icon" />
              </div>
              <div class="slot-name">
                <span class="slide"> {{ game.name }}</span>
              </div>
            </div>
          </div>

          <!-- <template v-if="p.name === 'SpadeGaming'">
            <div class="top-content">
              <img class="plat-icon" src="../assets/images/common/logo/sg.png" />
              <router-link :to="'/slot?plat=' + p.id" class="more-btn">More >></router-link>
            </div>

            <div class="game-container">
              <div
                class="game-slot"
                v-for="game in homeState.sgGamesList.slice(0, 10)"
                :key="game.id"
                @click="openGame(game, p.name)"
              >
                <div>
                  <img :src="game.default" v-image="game.icon" />
                </div>
                <div class="slot-name">
                  <span class="slide"> {{ game.name }}</span>
                </div>
              </div>
            </div>
          </template>

          <template v-if="p.name === '.Spin'">
            <div class="top-content">
              <img class="plat-icon" src="../assets/images/common/logo/es.png" />
              <router-link :to="'/slot?plat=' + p.id" class="more-btn">More >></router-link>
            </div>

            <div class="game-container">
              <div
                class="game-slot"
                v-for="game in homeState.esGamesList.slice(0, 10)"
                :key="game.id"
                @click="openGame(game, p.name)"
              >
                <div>
                  <img :src="game.default" v-image="game.icon" />
                </div>
                <div class="slot-name">
                  <span class="slide"> {{ game.name }}</span>
                </div>
              </div>
            </div>
          </template> -->
        </div>
      </div>
      <!--Removed on 5 July 2022 -->
      <!-- <div class="centername">
        <div class="game-title">TOP TRENDING MATCHES</div>
      </div>
      <div class="trending-matches">
        <a
          href="#"
          class="trending-match"
          v-for="(trend, gameIndex) in homeState.trendingGames"
          :key="gameIndex"
          data-aos="flip-up"
          data-aos-easing="ease-out"
          data-aos-duration="1000"
          @click="openGame(trend)"
        >
          <div class="overlay">
            <img :src="trend.logo" />
            <div class="gamename">{{ trend.gameName }}</div>
            <img
              class="play"
              src="../assets/images/games/slots/play-icon.png"
            />
          </div>
          <img :src="trend.game" />
        </a>
      </div> -->
      <section class="section-advantage" id="advantage">
        <div class="fluid">
          <div class="centername">
            <div class="game-title">SERVICE ADVANTAGES</div>
          </div>
          <div class="item-group">
            <div class="aos-item aos-init aos-animate" data-aos="fade-up">
              <div
                class="items hvr-icon-up hvr-shutter-out-horizontal hvr-shadow aos-item"
              >
                <div class="icon hvr-icon">
                  <RiShieldCheckLine />
                </div>
                <div class="txt">
                  <h3>Network Security</h3>
                  <p>
                    Information Confidential<br />
                    Safe without loopholes<br />
                    Frequent update for protection
                  </p>
                </div>
              </div>
            </div>

            <div class="aos-item aos-init aos-animate" data-aos="fade-up">
              <div
                class="items aos-item hvr-icon-up hvr-shutter-out-horizontal hvr-shadow"
              >
                <div class="icon hvr-icon">
                  <RiServiceFill />
                </div>
                <div class="txt">
                  <h3>TrustWorthy</h3>
                  <p>
                    Offical government license<br />
                    Good user reputation<br />
                    Excellent product experience
                  </p>
                </div>
              </div>
            </div>

            <div class="aos-item aos-init aos-animate" data-aos="fade-up">
              <div
                class="items aos-item hvr-icon-up hvr-shutter-out-horizontal hvr-shadow"
              >
                <div class="icon hvr-icon">
                  <RiFlowChart />
                </div>
                <div class="txt">
                  <h3>Product</h3>
                  <p>
                    Best in the world<br />
                    The most adundant products<br />
                    Diverse selection
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="item-percent">
            <div class="aos-item" data-aos="fade-up">
              <div class="items">
                <div class="txt">
                  <h3>60's</h3>
                  <p>Average deposit time</p>
                </div>
              </div>
              <div class="items">
                <div class="txt">
                  <h3>76's</h3>
                  <p>Average withdrawal time</p>
                </div>
              </div>
              <div class="items">
                <div class="txt">
                  <h3>14</h3>
                  <p>Cooperative payment platform</p>
                </div>
              </div>
              <div class="items">
                <div class="txt">
                  <h3>90k</h3>
                  <p>Amount of client downloads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <GameModal ref="slotsGame"></GameModal>
    <a-modal
      class="notice-modal"
      wrap-class-name="noticeModal"
      width="100%"
      v-model:visible="isStationNotice"
      :maskClosable="false"
      :footer="null"
      centered
      title="ประกาศ"
    >
      <a-tabs
        class="announcementTabs"
        v-model:activeKey="announcementActive"
        @change="announcementTabChange"
      >
        <a-tab-pane
          v-for="tab in announcementTypes"
          :key="tab.id"
          :tab="tab.name"
        >
          <a-collapse v-model:activeKey="typeActive">
            <template v-for="(ann, idx) in announcementList" :key="idx">
              <template v-if="ann.typeId === tab.id">
                <a-collapse-panel :key="ann.typeId" :header="ann.title">
                  {{ ann.content }}
                </a-collapse-panel>
              </template>
            </template>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script lang="js">
import { ref, defineComponent, reactive, onMounted } from "vue";
import { getTabMatches } from "@/api/games/esports";
import moment from "moment";
// import HomeStatsCard from "@/components/HomeStatsCard";
import GameModal from "@/components/modal/GameModal";
// import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { RiFunctionLine, RiShieldCheckLine, RiVolumeUpLine, RiServiceFill, RiFlowChart
 } from "vue-remix-icons";
import { getAnnouncement } from "@/api/personal/personal"
import { getPlatformGames, getPlatformList } from "@/api/platform/platform";
import { loadPromoBanner } from "@/api/index/promo";
import MarqueeText from 'vue-marquee-text-component';

export default defineComponent({
  name: "HomeView",
  components: {
    GameModal, RiFunctionLine, MarqueeText, RiShieldCheckLine, RiVolumeUpLine, RiServiceFill, RiFlowChart
  },
  setup() {
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'
    const banners = ref([]);
    const platforms = ref([]);
    const router = useRouter();
    const slotsGame = ref(null);
    const homeState = reactive({
      tabMatchs: [],
      sportMatchs: [],
      hotMatchs: [],
      trendingGames: [],
      jiliGamesList: [],
      sgGamesList: [],
      esGamesList: []
    });
    const openGame = (game, platName, platStatus) => {
      if (game.gameType && game.gameType === 'SLOT') {
        slotsGame.value.open(game.name, platName, game.code, platStatus);
      } else {
        slotsGame.value.open(game.gameName, game.name, game.code, platStatus);
      }

    };
    const matchTabActive = ref("1");
    const sportEsportTabActive = ref("1");
    const hotTrendingGames = [
      {
        code: null,
        name: "Evo",
        gameName: "EVO",
        game: require("../assets/images/index/top-trending-games/platform-evo.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: null,
        name: "DreamGaming",
        gameName: "Dream Gaming",
        game: require("../assets/images/index/top-trending-games/platform-dream-gaming.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: null,
        name: "Awc",
        gameName: "AE Sexy",
        game: require("../assets/images/index/top-trending-games/platform-ae.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: "F-SF01",
        name: "SpadeGaming",
        gameName: "Fishing God",
        game: require("../assets/images/index/top-trending-games/platform-spadegaming.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      }, {
        code: "61",
        name: "JiliGames",
        gameName: "Dragon & Tiger",
        game: require("../assets/images/index/top-trending-games/platform-jili-tnd.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: "sLightnWmn",
        name: "NextSpin",
        gameName: "Lightning Woman",
        game: require("../assets/images/index/top-trending-games/platform-nextspinning.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: "71",
        name: "JiliGames",
        gameName: "Jili",
        game: require("../assets/images/index/top-trending-games/platform-jili-1.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      },
      {
        code: "S-PH02",
        name: "SpadeGaming",
        gameName: "King Pharaoh",
        game: require("../assets/images/index/top-trending-games/platform-spadegaming-king-pharaoh.png"),
        logo: require("../assets/images/index/top-trending-games/logo-spade.png")
      }
    ];

    const tabMatchData = [
      {
        gameLogo: 'ALL',
        gameName: "",
        gameId: ""
      },
      {
        gameLogo: require("../assets/images/index/game_icon_csgo.png"),
        gameName: "CS:GO",
        eventCount: 96,
        gameId: "1"
      },
      {
        gameLogo: require("../assets/images/index/game_icon_dota2.png"),
        gameName: "DOTA 2",
        eventCount: 30,
        gameId: "2"
      },
      {
        gameLogo: "https://assets.1kuaisudai.com/media/images/game/lol.png",
        gameName: "League Of Legends",
        eventCount: 30,
        gameId: "3"
      },
      {
        gameLogo: "https://assets.1kuaisudai.com/media/images/game/val.png",
        gameName: "Valorant",
        eventCount: 35,
        gameId: "24"
      },
      // {
      //   gameLogo: "https://assets.1kuaisudai.com/media/images/game/starcraft2.png",
      //   gameName: "Starcraft II",
      //   eventCount: 34,
      //   gameId: "4"
      // },
      // {
      //   gameLogo: "https://assets.1kuaisudai.com/media/images/game/basketball.png",
      //   gameName: "Basketball",
      //   eventCount: 29,
      //   gameId: "17"
      // }
    ];
    const sportsMatchData = [
      {
            // id: item.eventDate,
            // name: item.competitionName,
            // dateTime: matchDatetime,
            name: 'Popular Match',
            homeName: 'Spain',
            homeImg: require("../assets/images/index/index_team_1.png"),
            awayName: 'Portugal',
            awayImg: require("../assets/images/index/index_team_2.png"),
      },
      {
            // id: item.eventDate,
            // name: item.competitionName,
            // dateTime: matchDatetime,
            name: 'Match',
            homeName: 'Spain',
            homeImg: require("../assets/images/index/index_team_1.png"),
            awayName: 'Portugal',
            awayImg: require("../assets/images/index/index_team_2.png"),
      }
    ];
    const tabsChange = (nk) => {
      homeState.tabMatchs.forEach(element => {
        if (nk === element.gameId) {
          getMatchData(element);
        }
      });
    };
    const sportEsportChange = () => {
      // homeState.tabMatchs.forEach(element => {
      //   if (nk === element.gameId) {
      //     getMatchData(element);
      //   }
      // });
    };
    const getMatchData = (e) => {
      e.matchInfo = [];
      getTabMatches(e.gameId, 4).then((data) => {
        data.forEach(tab => {
          if (tab.gameType === 1) {
            tab.gameName = "CSGO";
            return;
          }
          if (tab.gameType === 2) {
            tab.gameName = "DOTA";
          }
          if (tab.gameType === 3) {
            tab.gameName = "League Of Legends";
          }
          if (tab.gameType === 24) {
            tab.gameName = "VALORANT";
          }
          if (tab.gameType === 4) {
            tab.gameName = "Starcraft II";
          }
          if (tab.gameType === 12) {
            tab.gameName = "Totem Esports";
          }
          if (tab.gameType === 17) {
            tab.gameName = "Basketball";
          }
          // homeState.tabMatchs.forEach(element => {
          //     if (tab.gameType === 1) {
          //       tab.gameName = 'CSGO'
          //     } else if (tab.gameType === 2) {
          //       element.gameName = 'DOTA'
          //     } else if (tab.gameType === 4) {
          //       element.gameName = 'DOTA'
          //     }
          //   });
        });
        e.matchInfo = data;
      });
    };

    const toPage = (path) => {
      router.push(path);
    };

    const getPlatList = () => {
      getPlatformList().then((data) => {
        platforms.value = data.filter(element => element.gameType.includes("SLOT"));
        platforms.value.forEach(element => {
          loadGameList(element)
        });
      }).catch((err) => {
        console.log(err.message);
      });
    };
    const loadBanners = () => {
      loadPromoBanner("HOME").then((res) => {
        if (res.code === 0) {
          banners.value = res.data
        }
      })
    }
    const loadGameList = (e) => {
      getPlatformGames(e.id, "SLOT").then((data) => {
        homeState.gameList = []
        data.forEach(element => {
          element.default = require("../assets/images/games/aviator/default.png");
          element.icon = `${process.env.VUE_APP_IMAGE_CDN}/slot/${e.code}/${element.icon}.png`;
        });
        homeState.gameList = data
        platforms.value.forEach(platform => {
          if (platform.id === e.id) {
            platform.games = homeState.gameList
          }
          // if (platform.id === e.id) {
          //   console.log(e)

          // }
        });
        // if (e.id === 8) {
        //   homeState.jiliGamesList = data;
        // } else if (e.id === 12) {
        //   homeState.sgGamesList = data;
        // } else if (e.id === 13) {
        //   homeState.esGamesList = data;
        // }
      }).catch((err) => {
        console.log(err.message);
      });
    };
    const announcementActive = ref()
    const typeActive = ref()
    const announcementList = ref([])
    const announcementTypes = ref([])
    const loadAnnouncement = () => {
      getAnnouncement().then((res) => {
        if (res.code === 0) {
          const d = res.data.announcements
          announcementTypes.value = res.data.type
          if (res.data.type.length > 0) {
            announcementActive.value = res.data.type[0].id
          }
          announcementList.value = d
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      })
    }
    const announcementTabChange = () => {
      // homeState.tabMatchs.forEach(element => {
      //   if (nk === element.gameId) {
      //     getMatchData(element);
      //   }
      // });
    };
    const isStationNotice = ref(false)
    const noticeTitle = ref('')
    const openPopup = (noticeType) => {
      if (noticeType) {
        console.log(noticeType)
        noticeTitle.value = noticeType.title
        isStationNotice.value = true
      }
    }

    onMounted(async () => {
      loadAnnouncement();
      getPlatList();
      loadBanners();

      const hotMatchData = [];

      await getTabMatches(1000, 4).then(function(data) {
        data.forEach(function(item) {
          let matchDatetime = moment(item.eventDate).format("ddd, DD MMM, HH:mma");
          hotMatchData.push({
            id: item.eventDate,
            name: item.competitionName,
            dateTime: matchDatetime,
            homeName: item.home,
            homeImg: item.homeLogo,
            awayName: item.away,
            awayImg: item.awayLogo
          });

        });
      });

      homeState.tabMatchs.push(...tabMatchData);
      matchTabActive.value = homeState.tabMatchs[0].gameId;
      homeState.sportMatchs.push(...sportsMatchData);
      tabsChange(matchTabActive.value);
      sportEsportChange(sportEsportTabActive.value);
      homeState.trendingGames.push(...hotTrendingGames);
      homeState.hotMatchs.push(...hotMatchData);

    });

    return {
      homeState,
      matchTabActive,
      sportEsportTabActive,
      sportEsportChange,
      tabsChange,
      slotsGame,
      toPage,
      openGame,
      loadGameList,
      platforms,
      banners,
      imgURL,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementActive,
      announcementTabChange,
      announcementTypes,
      typeActive
    };
  }
});
</script>
<style lang="scss">
.noticeModal {
  .notice-modal.ant-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 800px;

    .ant-modal-content {
      width: 95%;
      .ant-modal-header {
        background: #2b2b4b;
        border: 0;
        border-radius: 5px 5px 0 0;
        .ant-modal-title {
          color: #ffffff;
        }
      }
      .ant-modal-body {
        border-radius: 0 0 5px 5px;
        padding: 20px;
        .ant-tabs-top-bar {
          border: 0;
        }

        .announcementTabs {
          .ant-tabs-nav .ant-tabs-tab {
            margin: 0;
            color: #ffffff;
            border-radius: 0;
            &.ant-tabs-tab-active {
              background: #23263c;
              padding: 12px 16px;
            }
          }
          .ant-tabs-ink-bar {
            background-color: transparent;
          }
          .ant-collapse {
            border: 0;
          }
          .ant-collapse > .ant-collapse-item {
            border: 0;
          }
          .ant-collapse > .ant-collapse-item > .ant-collapse-header {
            background: #24222e;
            color: #ffffff;
            border-bottom: 1px solid #23263c;
          }
          .ant-collapse > .ant-collapse-item > .ant-collapse-content {
            background: #23263c;
            color: #ffffff;
            border: 0;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
$link-color: #db7e42;
.ant-carousel :deep(.slick-slider) {
  // height: 570px;
  // line-height: 570px;
  overflow: hidden;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  // height: 540px;
  // line-height: 540px;
  max-height: 540px;
  background: #23263c;
  display: flex;
  align-items: center;
  overflow: hidden;
  & > div {
    display: flex;
    width: 100%;
  }
  // div {
  //   height: 100%;
  // }
  // img {
  //   width: 100%;
  // }
}
@-webkit-keyframes scale {
  100% {
    -webkit-transform: scale(1, 1);
  }
}

@keyframes scale {
  100% {
    transform: scale(1, 1);
  }
}
.main-container {
  padding: 0;
  .main-wrapper {
    width: 100%;
    .top-container-wrapper {
      animation-duration: 0.5s;
      // height: calc(100vh - 60px);
      .top-container {
        // max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .banner-slider {
          width: 100%;
          .banner-container {
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
      }
    }
    $volume-icon: #ffffff;
    .station-notice-wrapper {
      background: #24222e;
      color: $volume-icon;
      padding: 10px 10px;
      width: 100%;
    }
    .station-notice-container {
      width: 100%;
      max-width: 1480px;
      height: 24px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: flex-start;
      svg {
        fill: $volume-icon;
      }
      .station-notice-box {
        position: relative;
        overflow: hidden;
        margin-left: 10px;
        width: 100%;
        justify-content: flex-start;
      }
      .station-notice {
        position: absolute;
        top: 0px;
        height: 24px;
        font-size: 17px;
        line-height: 24px;
        white-space: nowrap;
        color: var(--volume-icon);
        span {
          cursor: pointer;
          margin-right: 40px;
        }
      }
    }
    .esports {
      display: none;
      background: #23263c;
      .esport-wrapper {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: stretch;
        width: 95%;
      }
      overflow: hidden;
    }
    .sportesports {
      .wrp {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: stretch;
        padding: 110px 0;
      }
      // max-width: 1400px;
      // width: 100%;
      // margin: 0 auto;
      // display: flex;
      // align-items: flex-start;
    }
    .bet-box {
      width: 100%;
      // max-width: 495px;
      margin: 0 auto;
      max-width: 1400px;
      border-radius: 5px;
      padding: 0;
      display: flex;
      flex-direction: column;
      padding: 20px;
      border-radius: 20px;
      // background: rgb(26, 23, 28, .7);
      // overflow: hidden;
      // flex-direction: column;
      // justify-content: flex-start;
      font-size: 2rem;
      .matchesTabs.ant-tabs {
        width: 100%;
        svg {
          fill: #434343;
          display: block;
        }
        &.nav-scroll {
          overflow: unset;
        }

        :deep(.ant-tabs-bar) {
          margin-bottom: 0;
        }
        :deep(.ant-tabs-nav-container-scrolling) {
          padding: 0;
        }
        :deep(.ant-tabs-top-content) {
          background: unset;
          border-radius: 5px;
        }
        :deep(.ant-tabs-right-bar) {
          border: 0;
          .ant-tabs-nav-wrap {
            margin: 0;
          }
        }
        :deep(.ant-tabs-right-content) {
          background: unset;
          padding-right: 20px;
          border: 0;
        }
        :deep(.ant-tabs-nav-container) {
          // border-bottom: 1px solid #db7e42;
          border: 0;
        }
        :deep(.ant-tabs-tab) {
          width: 100%;
          text-align: center;
          border: 0;
          border-radius: 100%;
          padding: 16px;
          margin: 19px 0px;
          filter: grayscale(1);
          img {
            width: 30px;
          }
          &:hover {
            &:before {
              box-shadow: inset 2px 1px 3px 0px #ff6700e6;
              transform: rotate(360deg);
            }
          }
          &:before {
            box-shadow: inset 2px 1px 3px 0px #ff6700e6;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            transform: rotate(0deg);
            transition: all 0.3s ease-in;
          }
          &.ant-tabs-tab-active {
            filter: grayscale(0);
            // border-bottom: 1px solid linear-gradient(to right, #de4545, #db7e42);
            // background: linear-gradient(268deg, #de454500 20%, #db7e42 180%);
            svg {
              fill: #de4646;
            }
            &:before {
              box-shadow: inset 2px 1px 3px 0px #ff6700e6;
              width: 100%;
              height: 100%;
              border-radius: 100%;
              transform: rotate(155deg);
            }
          }
        }
        // :deep(.ant-tabs-tabpane) {
        //   background: rgba(0, 0, 0, 0.6);
        //   border-radius: 9px;
        //   padding: 10px;
        // }
        :deep(.ant-tabs-ink-bar) {
          background: none;
          border: 0;
        }
        .nomatches {
          min-height: 440px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
        }
      }
      .game-name {
        color: #ffffff;
        margin: 10px;
        display: block;
      }
      .inner-content {
        min-height: 440px;
        overflow: auto;
        padding: 0px;
      }
      .bet-more {
        padding: 10px;
        font-size: 14px;
        position: absolute;
        right: 20px;
        top: 25px;
        min-width: 120px;
      }
      ::-webkit-scrollbar {
        width: 0; /* Remove scrollbar space */
        background: transparent; /* Optional: just make scrollbar invisible */
      }

      .matches {
        width: 100%;
        background: #2b2b4b;
        margin-bottom: 20px;
        box-shadow: -10px 0px 15px rgb(0 0 0 / 15%);
        border-radius: 20px;
        .tab-match-info-wrapper {
          color: #ffffff;
          .tab-match-info {
            padding: 10px;
            border-bottom: 1px solid #23263c;
          }
          .tab-match-info-game {
            color: #ff6600;
            font-weight: bold;
          }
        }
        .bet-row {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 10px;
          .competitor {
            display: flex;
            justify-content: center;
            padding: 5px;
            width: 50%;
            max-width: 300px;
            border-radius: 3px;
            justify-content: space-between;
            align-items: center;

            &.facing-left {
              clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
              text-align: left;
              padding-left: 20px;
              justify-content: flex-start;
              flex-direction: column;
            }
            &.facing-right {
              clip-path: polygon(
                0 0,
                calc(100% - 10px) 0,
                100% 50%,
                calc(100% - 10px) 100%,
                0 100%
              );
              text-align: right;
              padding-right: 20px;
              justify-content: flex-end;
              flex-direction: column-reverse;
            }
            img {
              height: 40px;
              width: auto;
              display: block;
            }
            .match {
              padding: 0 10px;
              color: #ffffff;
              font-weight: bold;
            }
          }
        }
        .vs {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          color: #2b2b4b;
          font-weight: bold;
          font-size: 1.2rem;
          padding: 9px 12px;
          border-radius: 10px;
        }
      }
    }
    .sports {
      min-height: 550px;
      width: 100%;
      margin-left: 50px;
      padding: 20px;
      .bet-more {
        position: absolute;
        right: 20px;
        top: 25px;
      }
      .sports-wrapper {
        .matches {
          width: 100%;
          // border-radius: 5px;
          // margin: 0 auto 30px;
          // box-shadow: 0 -30px 15px -25px #de4645;
          border: 4px solid #2b2b4b;
          border-radius: 20px;
          margin-bottom: 20px;
          .tab-match-info-wrapper {
            color: #ffffff;
            border-bottom: 4px solid #2b2b4b;

            .tab-match-info {
              padding: 10px;
            }
            .tab-match-info-game {
              color: #ff6600;
              font-weight: bold;
            }
          }
          .bet-row {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            .competitor {
              display: flex;
              justify-content: center;
              padding: 15px;
              width: 50%;
              align-items: center;
              img {
                height: 40px;
                width: auto;
                display: block;
                filter: drop-shadow(-2px 2px 1px #434343);
                border-radius: 50%;
              }
              .match {
                padding: 0 10px;
                color: #ffffff;
                font-weight: bold;
              }
            }
          }
          .vs {
            color: #ffffff;
            font-weight: bold;
            font-size: 1.2rem;
            padding: 9px 12px;
            border-radius: 10px;
          }
        }
      }
    }

    .centername {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 40px auto;
      .game-title {
        background-image: linear-gradient(to right, #de4545, #db7e42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .leftname {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .game-title {
        background-image: linear-gradient(to right, #de4545, #db7e42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .module.parallax {
      height: auto;
      background-position: 50% 0;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100%;
      background-position: center right;
    }
    .module.parallax-1 {
      background-image: url("https://media.istockphoto.com/photos/sport-background-green-field-in-soccer-stadium-ready-for-game-in-the-picture-id1320104418?b=1&k=20&m=1320104418&s=170667a&w=0&h=-INWYfpOlMFID5L8LlOCgoZo1AblGc8Ebi49xG6JkIw=");
    }
    .module.parallax-1 .overlay {
      height: 100%;
      text-align: center;
    }
    .module.parallax-1 .overlay .inner {
      margin: auto;
      max-width: 900px;
      padding: 50px;
      width: calc(95% - 90px);
    }
    .module.parallax-1 p {
      color: #fff;
      font-size: 20px;
    }
    .module.parallax-1 {
      color: #fff;
      overflow: hidden;
    }
    .hot-matches {
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr;
      width: 100%;
      .hot-matches-match {
        background-size: 100%;
        color: #555555;
        padding: 50px;
        font-size: 20px;
        .no-matches {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .match-box {
        }
      }
    }
    .hot-slots {
      max-width: 1400px;
      width: 95%;
      margin: 30px auto;
      .plat-item {
        .top-content {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          .plat-icon {
            height: 40px;
            margin-bottom: 20px;
          }
          .more-btn {
            font-weight: bold;
            font-size: 20px;
            background-image: linear-gradient(to right, #de4545, #db7e42);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            cursor: pointer;
          }
        }
      }

      .game-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 30px;
        margin-bottom: 40px;
        .game-slot {
          box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;

          border-radius: 20px;
          color: white;
          font-family: sans-serif;
          font-size: 100%;
          font-weight: bold;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          // display: block;
          display: flex;
          height: 150px;

          -webkit-animation: scale 0.5s;
          animation: scale 0.5s;
          -webkit-transform: scale(0, 0);
          transform: scale(0, 0);
          -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
          img {
            display: block;
            // width: 100%;
            // height: 100%;
            // min-height: 94px;
            transition: all 0.3s ease;
            width: 105%;
            margin-left: -2.5%;
          }
          &:hover {
            img {
              -webkit-transform: scale(1.2, 1.2);
              transform: scale(1.2, 1.2);
            }
          }

          transition: all 0.3s ease-in;
          cursor: pointer;
          position: relative;
          .slot-name {
            position: absolute;
            opacity: 0;
            font-size: 15px;
            line-height: 15px;
            text-align: center;
            bottom: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.3) 10%,
              transparent
            );
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            transform: translate(0, 50px);

            .slide {
              padding: 10px;
              word-break: break-word;
              display: block;
            }
          }
          &:before {
            position: absolute;
            top: 0;
            left: -85%;
            z-index: 2;
            display: block;
            content: "";
            width: 50%;
            height: 100%;
            background: -webkit-linear-gradient(
              left,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 100%
            );
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 100%
            );
            -webkit-transform: skewX(-25deg);
            transform: skewX(-25deg);
          }

          @-webkit-keyframes shine {
            100% {
              left: 125%;
            }
          }
          @keyframes shine {
            100% {
              left: 125%;
            }
          }

          &:hover {
            &:before {
              -webkit-animation: shine 2s;
              animation: shine 2s;
            }

            .slot-name {
              opacity: 1;
              transform: translate(0px, 0px);
            }
          }
        }
      }
    }
    .trending-matches {
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      position: relative;
      overflow: hidden;
      margin: 50px;
      gap: 30px;
      max-width: 1400px;
      width: 95%;
      margin: 50px auto;
      .trending-match {
        border-radius: 20px;
        .overlay {
          background: rgba(20, 20, 20, 0.9);
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .play {
            width: unset;
            height: 30%;
            max-height: 70px;
          }
          .gamename {
            font-size: 20px;
            padding-bottom: 10px;
            color: #ffffff;
          }
          img {
            display: block;
            text-align: center;
            margin: 0 auto;
            max-width: unset;
            max-height: 30%;
            width: auto;
            transform: none;
          }
        }
        background: #434343;
        overflow: hidden;
        img {
          width: 105%;
          margin: -4%;
          display: block;
          transform: scale(1.2);
          transition: all 0.3s ease-in;
        }
        &:hover {
          .overlay {
            opacity: 1;
          }
          img {
            transform: scale(1);
          }
        }
      }
    }
    .section-advantage {
      /* background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)), url(../../images/advantage/bg.jpg); */
      background: #23263c;
      color: #fff;
      background-attachment: fixed;
      padding: 10px 0 80px 0;
      position: relative;
      .item-group {
        display: flex;
        justify-content: space-evenly;
        padding: 10px 0 50px;
        width: 100%;
        margin: 0 auto;
        max-width: 1400px;
        .title {
          width: 100%;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            height: 1px;
            width: 100%;
            left: 0;
            margin-top: 20px;
            background-color: rgb(44, 44, 44);
          }
        }
        .subintro {
          font-size: 16px;
          width: 100%;
          margin: auto;
          font-weight: 100;
          color: #eee;
        }
        .items {
          display: flex;
          width: 100%;
          text-align: left;
          padding: 20px;
          border-radius: 20px;
          justify-content: center;
          align-items: center;
          background: #2b2b4b;
          .icon {
            svg {
              fill: #de4646;
              width: 85px;
            }
          }
          img {
            width: 100px;
            filter: brightness(1) invert(1);
          }
          .txt {
            padding-left: 20px;
          }
          h3 {
            color: #ffffff;
            font-weight: bold;
            font-size: 20px;
          }
          &:hover {
            background: #2b2b4b;
          }
        }
      }
      .item-percent {
        max-width: 1400px;
        margin: 0 auto;
        .aos-item {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          .items {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            position: relative;
            .txt {
              padding: 10px;
            }

            h3 {
              font-size: 50px;
              line-height: 50px;
              color: #ffffff;
              margin: 0;
            }
            &:before {
              content: "";
              position: absolute;
              box-shadow: inset 2px 1px 3px 0px #ff6700e6;
              width: 100%;
              height: 100%;
              border-radius: 100%;
              transform: rotate(155deg);
              transition: all 0.3s ease-in;
            }
            &:hover {
              &:before {
                transform: rotate(0);
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .main-container {
    .main-wrapper {
      .centername {
        margin: 20px auto;
      }
      .top-container-wrapper {
        .top-container {
          .banner-slider {
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
      }
      .esports .esport-wrapper {
        flex-direction: column;
      }
      .sports {
        margin: 0;
        min-height: unset;
      }
      .hot-slots {
        .plat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 95%;
          margin: 0 auto;
          .game-container {
            grid-template-columns: repeat(2, 1fr);
            margin: 10px auto 40px;
            gap: 20px;
            .game-slot {
              max-height: 25vw;
              .slot-name {
                opacity: 1;
                transform: translate(0px, 0px);
              }
              img {
                opacity: 0.8;
              }
            }
          }
        }
      }
      .trending-matches {
        grid-template-columns: repeat(2, 1fr);
        margin: 10px auto 40px;
        gap: 10px;
      }
      .section-advantage {
        display: none;
        padding: 10px;
        .item-group {
          flex-wrap: wrap;
          gap: 20px;
          padding: 0 0 50px;
          .items {
            flex-direction: column;
            text-align: center;
            .txt {
              padding: 0;
            }
          }
        }
        .item-percent {
          overflow: hidden;
          width: 90%;

          .aos-item {
            flex-wrap: wrap;
            gap: 30px;
          }
        }
      }
    }
  }
}
</style>

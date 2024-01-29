<template>
  <div class="hotgame-section">
    <HomeTitle title="热门游戏" subtitle="TOP GAMES"></HomeTitle>
    <div class="hotgame-container">
      <div class="hotgame-wrapper" v-for="(hotgame, hotgameIndex) in hotgameData" :key="`${hotgame}-${hotgameIndex}`">
        <div class="hotgame-banner-wrapper">
          <div
            :class="`hotgame-banner ${hotgameIndex === currentBannerIndex ? 'highlight' : ''}`"
            @click="onBannerClick(hotgameIndex)"
          >
            <img class="hotgame-icon" :src="hotgameIndex === currentBannerIndex ? hotgame.iconActive : hotgame.icon" />
            <div :class="`hotgame-number ${hotgameIndex === currentBannerIndex ? 'highlight' : ''}`">
              {{ hotgame.number }}
            </div>
            <div class="hotgame-text">
              <div class="title">{{ hotgame.title }}</div>
              <div class="subtitle">{{ hotgame.subtitle }}</div>
            </div>
            <div class="character-wrapper">
              <img :class="`character-${hotgame.subtitle.toLowerCase()}`" :src="hotgame.charImgPath" />
            </div>
          </div>
        </div>
        <div :class="`hotgame-content-wrapper ${hotgame.isShow ? 'show' : ''}`">
          <div class="left-container">
            <div class="title-wrapper">
              <div class="title">{{ hotgame.content[hotgame.currentProvider].title }}</div>
              <div class="subtitle">{{ hotgame.content[hotgame.currentProvider].subtitle }}</div>
            </div>
            <div>
              <div class="desc">专注于彩票游戏行业多年，拥有经典彩种、玩法。</div>
              <div class="desc">还有超多独家创新玩法，足够新颖，极易操作的游戏界面， 更是在您游戏过程中增光添彩！</div>
            </div>
            <div v-if="hotgame.content.isShowSportsIcon" :class="`game-icon-wrapper ${hotgame.subtitle.toLowerCase()}`">
              <img
                v-for="(icon, iconIndex) in hotgame.content.isShowSportsIcon"
                :key="`${icon}-${iconIndex}`"
                :src="icon"
              />
            </div>
            <div class="game-provider-wrapper">
              <div
                v-for="(provider, providerIndex) in hotgame.content.providerList"
                :key="`${provider}-${providerIndex}`"
                class="game-provider"
                @click="setCurrentProvider(hotgame, provider.key)"
              >
                <img
                  :class="`game-provider-img ${hotgame.currentProvider === provider.key ? 'active' : ''}`"
                  :src="provider.icon"
                />
                <div :class="`game-provider-text ${hotgame.currentProvider === provider.key ? 'active' : ''}`">
                  {{ provider.name }}
                </div>
              </div>
            </div>
            <el-button size="small" class="common-btn game-start-btn" @click="onEnterGameClick(hotgame.path)">
              进入游戏
            </el-button>
          </div>
          <div class="right-container">
            <img
              :class="`character-${hotgame.subtitle.toLowerCase()}-${hotgame.currentProvider}`"
              :src="hotgame.content[hotgame.currentProvider].charImgPath"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import HomeTitle from "@/atoms/HomeTitle.vue";

const router = useRouter();

const hotgameData = ref([
  {
    number: "01",
    icon: require("../../assets/home/hotgame/banner/esports/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/esports/icon-active.png"),
    title: "电子竞技",
    subtitle: "ESPORTS",
    charImgPath: require("../../assets/home/hotgame/banner/esports/character.png"),
    isShow: false,
    path: "/eSports",
    currentProvider: "lh",
    content: {
      isShowSportsIcon: [
        require("../../assets/home/hotgame/content/esports/icon_cs.png"),
        require("../../assets/home/hotgame/content/esports/icon_dota2.png"),
        require("../../assets/home/hotgame/content/esports/icon_lol.png"),
        require("../../assets/home/hotgame/content/esports/icon_pubg.png"),
        require("../../assets/home/hotgame/content/esports/icon_valorant.png"),
        require("../../assets/home/hotgame/content/esports/icon_sc2.png")
      ],
      providerList: [
        {
          key: "lh",
          name: "雷火电竞",
          icon: require("../../assets/home/hotgame/content/esports/provider_lh.png"),
          providerInfo: {}
        },
        {
          key: "im",
          name: "IM电竞",
          icon: require("../../assets/home/hotgame/content/esports/provider_im.png"),
          providerInfo: {}
        },
        {
          key: "ia",
          name: "IA电竞",
          icon: require("../../assets/home/hotgame/content/esports/provider_ia.png"),
          providerInfo: {}
        },
        {
          key: "rg",
          name: "熊猫体育",
          icon: require("../../assets/home/hotgame/content/esports/provider_rg.png"),
          providerInfo: {}
        }
      ],
      lh: {
        title: "雷火电竞",
        subtitle: "ESPORTS",
        charImgPath: require("../../assets/home/hotgame/content/esports/lh/character.png")
      },
      im: {
        title: "IM电竞",
        subtitle: "ESPORTS",
        charImgPath: require("../../assets/home/hotgame/content/esports/im/character.png")
      },
      ia: {
        title: "IA电竞",
        subtitle: "ESPORTS",
        charImgPath: require("../../assets/home/hotgame/content/esports/ia/character.png")
      },
      rg: {
        title: "RG电竞",
        subtitle: "ESPORTS",
        charImgPath: require("../../assets/home/hotgame/content/esports/rg/character.png")
      }
    }
  },
  {
    number: "02",
    icon: require("../../assets/home/hotgame/banner/sports/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/sports/icon-active.png"),
    title: "体育赛事",
    subtitle: "SPORTS",
    charImgPath: require("../../assets/home/hotgame/banner/sports/character.png"),
    isShow: false,
    path: "/sports",
    currentProvider: "im",
    content: {
      isShowSportsIcon: [
        require("../../assets/home/hotgame/content/sports/icon_basketball.png"),
        require("../../assets/home/hotgame/content/sports/icon_football.png"),
        require("../../assets/home/hotgame/content/sports/icon_volleyball.png"),
        require("../../assets/home/hotgame/content/sports/icon_tennis.png"),
        require("../../assets/home/hotgame/content/sports/icon_union.png"),
        require("../../assets/home/hotgame/content/sports/icon_american_footerball.png"),
        require("../../assets/home/hotgame/content/sports/icon_shuttlecock.png"),
        require("../../assets/home/hotgame/content/sports/icon_badminton.png"),
        require("../../assets/home/hotgame/content/sports/icon_table_tennis.png"),
        require("../../assets/home/hotgame/content/sports/icon_hockey.png")
      ],
      providerList: [
        {
          key: "im",
          name: "IM体育",
          icon: require("../../assets/home/hotgame/content/sports/provider_im.png"),
          providerInfo: {}
        },
        {
          key: "saba",
          name: "沙巴体育",
          icon: require("../../assets/home/hotgame/content/sports/provider_saba.png"),
          providerInfo: {}
        },
        {
          key: "pinnacle",
          name: "平博体育",
          icon: require("../../assets/home/hotgame/content/sports/provider_pinnacle.png"),
          providerInfo: {}
        },
        {
          key: "panda",
          name: "熊猫体育",
          icon: require("../../assets/home/hotgame/content/sports/provider_panda.png"),
          providerInfo: {}
        },
        {
          key: "cr",
          name: "CR体育",
          icon: require("../../assets/home/hotgame/content/sports/provider_cr.png"),
          providerInfo: {}
        }
      ],
      im: {
        title: "IM体育",
        subtitle: "SPORTS",
        charImgPath: require("../../assets/home/hotgame/content/sports/im/character.png")
      },
      saba: {
        title: "沙巴体育",
        subtitle: "SPORTS",
        charImgPath: require("../../assets/home/hotgame/content/sports/saba/character.png")
      },
      pinnacle: {
        title: "平博体育",
        subtitle: "SPORTS",
        charImgPath: require("../../assets/home/hotgame/content/sports/pinnacle/character.png")
      },
      panda: {
        title: "熊猫体育",
        subtitle: "SPORTS",
        charImgPath: require("../../assets/home/hotgame/content/sports/panda/character.png")
      },
      cr: {
        title: "CR体育",
        subtitle: "SPORTS",
        charImgPath: require("../../assets/home/hotgame/content/sports/cr/character.png")
      }
    }
  },
  {
    number: "03",
    icon: require("../../assets/home/hotgame/banner/casino/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/casino/icon-active.png"),
    title: "真人娱乐",
    subtitle: "CASINO",
    charImgPath: require("../../assets/home/hotgame/banner/casino/character.png"),
    isShow: false,
    path: "/live-casino",
    currentProvider: "ag",
    content: {
      providerList: [
        {
          key: "ag",
          name: "AG真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_ag.png"),
          providerInfo: {}
        },
        {
          key: "db",
          name: "DB真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_db.png"),
          providerInfo: {}
        },
        {
          key: "bg",
          name: "BG真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_bg.png"),
          providerInfo: {}
        },
        {
          key: "we",
          name: "WE真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_we.png"),
          providerInfo: {}
        },
        {
          key: "ob",
          name: "欧博真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_ob.png"),
          providerInfo: {}
        },
        {
          key: "bbin",
          name: "BBIN真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_bbin.png"),
          providerInfo: {}
        },
        {
          key: "evo",
          name: "EVO真人",
          icon: require("../../assets/home/hotgame/content/casino/provider_evo.png"),
          providerInfo: {}
        }
      ],
      ag: {
        title: "AG真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/ag/character.png")
      },
      db: {
        title: "DB真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/db/character.png")
      },
      bg: {
        title: "BG真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/bg/character.png")
      },
      we: {
        title: "WE真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/we/character.png")
      },
      ob: {
        title: "欧博真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/ob/character.png")
      },
      bbin: {
        title: "BBIN真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/bbin/character.png")
      },
      evo: {
        title: "EVO真人",
        subtitle: "CASINO",
        charImgPath: require("../../assets/home/hotgame/content/casino/evo/character.png")
      }
    }
  },
  {
    number: "04",
    icon: require("../../assets/home/hotgame/banner/board/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/board/icon-active.png"),
    title: "棋牌游戏",
    subtitle: "BOARD",
    charImgPath: require("../../assets/home/hotgame/banner/board/character.png"),
    isShow: false,
    path: "/poker",
    currentProvider: "dat",
    content: {
      providerList: [
        {
          key: "dat",
          name: "大唐棋牌",
          icon: require("../../assets/home/hotgame/content/board/provider_dat.png"),
          providerInfo: {}
        },
        {
          key: "gd",
          name: "高登棋牌",
          icon: require("../../assets/home/hotgame/content/board/provider_gd.png"),
          providerInfo: {}
        },
        {
          key: "ky",
          name: "开元棋牌",
          icon: require("../../assets/home/hotgame/content/board/provider_ky.png"),
          providerInfo: {}
        },
        {
          key: "leyou",
          name: "乐游棋牌",
          icon: require("../../assets/home/hotgame/content/board/provider_leyou.png"),
          providerInfo: {}
        }
      ],
      dat: {
        title: "大唐棋牌",
        subtitle: "BOARD",
        charImgPath: require("../../assets/home/hotgame/content/board/dat/character.png")
      },
      gd: {
        title: "高登棋牌",
        subtitle: "BOARD",
        charImgPath: require("../../assets/home/hotgame/content/board/gd/character.png")
      },
      ky: {
        title: "开元棋牌",
        subtitle: "BOARD",
        charImgPath: require("../../assets/home/hotgame/content/board/ky/character.png")
      },
      leyou: {
        title: "乐游棋牌",
        subtitle: "BOARD",
        charImgPath: require("../../assets/home/hotgame/content/board/leyou/character.png")
      }
    }
  },
  {
    number: "05",
    icon: require("../../assets/home/hotgame/banner/lottery/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/lottery/icon-active.png"),
    title: "彩票投注",
    subtitle: "LOTTERY",
    charImgPath: require("../../assets/home/hotgame/banner/lottery/character.png"),

    isShow: false,
    path: "/lottery",
    currentProvider: "lh",
    content: {
      isShowSportsIcon: [
        require("../../assets/home/hotgame/content/sports/icon_basketball.png"),
        require("../../assets/home/hotgame/content/sports/icon_football.png"),
        require("../../assets/home/hotgame/content/sports/icon_volleyball.png"),
        require("../../assets/home/hotgame/content/sports/icon_tennis.png"),
        require("../../assets/home/hotgame/content/sports/icon_union.png"),
        require("../../assets/home/hotgame/content/sports/icon_american_footerball.png"),
        require("../../assets/home/hotgame/content/sports/icon_shuttlecock.png"),
        require("../../assets/home/hotgame/content/sports/icon_badminton.png"),
        require("../../assets/home/hotgame/content/sports/icon_table_tennis.png"),
        require("../../assets/home/hotgame/content/sports/icon_hockey.png")
      ],
      providerList: [
        {
          key: "lh",
          name: "雷火彩票",
          icon: require("../../assets/home/hotgame/content/lottery/provider_lh.png"),
          providerInfo: {}
        }
      ],
      lh: {
        title: "雷火彩票",
        subtitle: "LOTTERY",
        charImgPath: require("../../assets/home/hotgame/content/lottery/lh/character.png")
      }
    }
  },
  {
    number: "06",
    icon: require("../../assets/home/hotgame/banner/slots/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/slots/icon-active.png"),
    title: "电子游艺",
    subtitle: "SLOTS",
    charImgPath: require("../../assets/home/hotgame/banner/slots/character.png"),
    isShow: false,
    path: "/slot",
    currentProvider: "pg",
    content: {
      providerList: [
        {
          key: "pg",
          name: "PG电子",
          icon: require("../../assets/home/hotgame/content/slots/provider_pg.png"),
          providerInfo: {}
        },
        {
          key: "sw",
          name: "SW电子",
          icon: require("../../assets/home/hotgame/content/slots/provider_sw.png"),
          providerInfo: {}
        },
        {
          key: "pt",
          name: "PT电子",
          icon: require("../../assets/home/hotgame/content/slots/provider_pt.png"),
          providerInfo: {}
        },
        {
          key: "evo",
          name: "EVO电子",
          icon: require("../../assets/home/hotgame/content/slots/provider_evo.png"),
          providerInfo: {}
        }
      ],
      pg: {
        title: "PG电子",
        subtitle: "SLOT",
        charImgPath: require("../../assets/home/hotgame/content/slots/pg/character.png")
      },
      sw: {
        title: "SW电子",
        subtitle: "SLOT",
        charImgPath: require("../../assets/home/hotgame/content/slots/sw/character.png")
      },
      pt: {
        title: "PT电子",
        subtitle: "SLOT",
        charImgPath: require("../../assets/home/hotgame/content/slots/pt/character.png")
      },
      evo: {
        title: "EVO电子",
        subtitle: "SLOT",
        charImgPath: require("../../assets/home/hotgame/content/slots/evo/character.png")
      }
    }
  },
  {
    number: "07",
    icon: require("../../assets/home/hotgame/banner/fishing/icon.png"),
    iconActive: require("../../assets/home/hotgame/banner/fishing/icon-active.png"),
    title: "捕鱼游戏",
    subtitle: "FISHING",
    charImgPath: require("../../assets/home/hotgame/banner/fishing/character.png"),
    isShow: false,
    path: "/fishing",
    currentProvider: "ag",
    content: {
      providerList: [
        {
          key: "ag",
          name: "AG捕鱼",
          icon: require("../../assets/home/hotgame/content/fishing/provider_ag.png"),
          providerInfo: {}
        },
        {
          key: "mw",
          name: "决战中途岛",
          icon: require("../../assets/home/hotgame/content/fishing/provider_mw.png"),
          providerInfo: {}
        }
      ],
      ag: {
        title: "AG捕鱼",
        subtitle: "FISHING",
        charImgPath: require("../../assets/home/hotgame/content/fishing/ag/character.png")
      },
      mw: {
        title: "决战中途岛",
        subtitle: "FISHING",
        charImgPath: require("../../assets/home/hotgame/content/fishing/mw/character.png")
      }
    }
  }
]);

const setCurrentProvider = (element, value) => {
  element.currentProvider = value;
};

let currentBannerIndex = ref(0);
const setBannerPosition = (index) => {
  hotgameData.value.forEach((e, i) => {
    if (i === index) e.isShow = true;
    else e.isShow = false;
  });
};

const onBannerClick = (index) => {
  if (index === currentBannerIndex.value) return;

  setBannerPosition(index);
  currentBannerIndex = index;
};

const onEnterGameClick = (path) => {
  router.push(path);
};

onMounted(() => {
  setBannerPosition(currentBannerIndex.value);
});
</script>

<style scoped lang="scss">
$transition_timer: 0.5s;

.hotgame-section {
  width: 80%;
  max-width: 1040px;
  margin: 0 auto;

  .hotgame-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 2.5rem 0 0 0;

    .hotgame-wrapper {
      display: flex;
      align-items: center;

      .hotgame-banner-wrapper {
        display: flex;

        .hotgame-banner {
          width: 1.25rem;
          height: 36.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border-radius: 2.875rem;
          background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
          box-shadow: 0px 2px 4.58px 0px #bbdcff inset;
          overflow: hidden;
          position: relative;
          z-index: 1;
          transition: $transition_timer;
          cursor: pointer;

          &.highlight {
            color: white;
            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #93c7ff inset, 0px -1px 3.664px 0px #275ec1 inset;
          }

          .hotgame-icon {
            height: 2rem;
            margin: 0 0 1rem 0;
            transform: translate(0px, 1px);
          }

          .hotgame-number {
            text-align: center;
            font-family: Impact;
            font-size: 1.76444rem;
            font-weight: 400;
            line-height: normal;
            letter-spacing: 0.2595rem;
            border-bottom: 0.1rem solid #3981ff;
            margin: 0 0 0.5rem 0;

            &.highlight {
              border-bottom: 0.1rem solid white;
            }
          }

          .hotgame-text {
            display: flex;
            gap: 5px;
            margin: 0 0.25rem 3rem 0;

            .title {
              width: 1rem;
              word-break: break-all;
              text-align: center;
              font-family: PingFang SC;
              font-size: 1.156rem;
              font-weight: 500;
              line-height: 1.5rem;
            }

            .subtitle {
              width: 0.5rem;
              word-break: break-all;
              text-align: center;
              font-family: PingFang SC;
              font-size: 0.578rem;
              font-weight: 400;
              line-height: 0.75rem;
              margin: 0.075rem 0 0 0;
            }
          }

          .character-wrapper {
            .character-casino,
            .character-board,
            .character-fishing {
              position: relative;
              bottom: 1rem;
            }
          }
        }
      }

      .hotgame-content-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 0;
        height: 0;
        overflow: hidden;
        transition: $transition_timer;

        &.show {
          width: 38.5rem;
          height: 100%;
          margin: 0 0 0 0.75rem;
        }

        .left-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          width: 55%;

          .title-wrapper {
            filter: drop-shadow(3px 0 #5799e3);
            font-family: FZHanZhenGuangBiaoS-GB;
            font-weight: 600;
            background: linear-gradient(180deg, #c2e9fb 0%, #a1c4fc 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke-width: 0.5px;
            -webkit-text-stroke-color: white;
            line-height: normal;

            .title {
              font-size: 4.24106rem;
              word-break: keep-all;
            }

            .subtitle {
              font-size: 2.70775rem;
            }
          }

          .desc {
            color: #3063ab;
            font-family: Microsoft YaHei;
            font-size: 0.83838rem;
            font-weight: 400;
            line-height: 1.46719rem;
            width: 20rem;
          }

          .game-icon-wrapper {
            display: flex;
            gap: 10px;

            &.esports {
              gap: 25px;
            }

            img {
              width: 1.5rem;
              height: 1.5rem;
            }
          }

          .game-provider-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 12.5px;
            width: 20rem;

            .game-provider {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              width: 3.25rem;

              .game-provider-img {
                width: 2rem;
                height: 2rem;
                padding: 0.25rem;
                border-radius: 0.3145rem;
                border: 0.839px solid #fcfcfc;
                background: linear-gradient(180deg, #c3e8fa 0%, #a1c4fc 100%);
                object-fit: contain;

                &.active {
                  border-radius: 0.3145rem;
                  border: 2.516px solid #c5ebff;
                  background: linear-gradient(180deg, #2eadee 0%, #a1c4fc 100%);
                  box-shadow: 0px 3.35448px 3.35448px 0px rgba(0, 0, 0, 0.25);
                }
              }

              .game-provider-text {
                color: #3063ab;
                text-align: center;
                font-family: Microsoft YaHei;
                font-size: 0.73363rem;
                font-weight: 400;
                line-height: 1.46719rem;
                text-wrap: nowrap;

                &.active {
                  color: #3063ab;
                  font-weight: 700;
                }
              }
            }
          }

          .game-start-btn {
            width: 10rem;
            height: 2.5rem;
            border-radius: 1.875rem;
            background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
            box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
            font-family: Microsoft YaHei;
            font-size: 1.15281rem;
            font-weight: 400;
            line-height: normal;
          }
        }

        .right-container {
          display: flex;
          align-items: flex-end;
          position: relative;
          width: 45%;

          img {
            position: relative;
            right: 4rem;
            height: 27rem;
          }
          // esports
          .character-esports-lh {
            position: relative;
            right: 4rem;
            height: 27rem;
          }

          .character-esports-im {
            position: relative;
            right: 6rem;
            height: 25rem;
          }

          .character-esports-ia {
            position: relative;
            right: 7.5rem;
            height: 25rem;
          }

          .character-esports-rg {
            position: relative;
            right: 1rem;
            height: 27rem;
          }

          // sports
          .character-sports-im,
          .character-sports-saba {
            position: relative;
            right: 1rem;
            height: 25rem;
          }

          .character-sports-pinnacle,
          .character-sports-panda {
            position: relative;
            right: 0;
            height: 25rem;
          }

          .character-sports-cr {
            position: relative;
            right: 1.5rem;
            height: 24rem;
          }

          // casino
          .character-casino-ag {
            position: relative;
            right: 0.5rem;
            height: 23rem;
          }

          .character-casino-db {
            position: relative;
            right: 1rem;
            height: 23rem;
          }

          .character-casino-bg {
            position: relative;
            right: 1rem;
            height: 23rem;
          }

          .character-casino-we {
            position: relative;
            right: 4rem;
            height: 23rem;
          }

          .character-casino-ob {
            position: relative;
            right: 2.25rem;
            height: 23rem;
          }

          .character-casino-bbin {
            position: relative;
            right: 3.25rem;
            height: 23rem;
          }

          .character-casino-evo {
            position: relative;
            right: 6.5rem;
            height: 23rem;
          }

          // board
          .character-board-dat,
          .character-board-gd {
            position: relative;
            right: 2.25rem;
            height: 23rem;
          }

          .character-board-ky {
            position: relative;
            right: 3rem;
            height: 23rem;
          }

          .character-board-leyou {
            position: relative;
            right: 4rem;
            height: 23rem;
          }

          // lottery
          .character-lottery-lh {
            position: relative;
            right: 3rem;
            height: 25rem;
          }

          // slots
          .character-slots-pg {
            position: relative;
            right: 1.75rem;
            height: 23rem;
          }

          .character-slots-sw {
            position: relative;
            right: 2rem;
            height: 23rem;
          }

          .character-slots-pt {
            position: relative;
            right: 2rem;
            height: 23rem;
          }

          .character-slots-evo {
            position: relative;
            right: 2.75rem;
            height: 23rem;
          }

          // fishing
          .character-fishing-ag {
            position: relative;
            right: 4rem;
            height: 21rem;
          }

          .character-fishing-mw {
            position: relative;
            right: 5.5rem;
            height: 21rem;
          }
        }
      }
    }
  }
}
</style>

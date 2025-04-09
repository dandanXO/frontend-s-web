<template>
  <template v-if="!$q.dark.isActive">
    <div class="white">
      <div class="row justify-center q-pa-md">
        <q-btn-toggle
          v-model="tabValue"
          class="top-toggle-menu"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { value: 'liveStream', slot: 'liveStream' },
            { value: 'sport', slot: 'sport' }
          ]"
        >
          <template v-slot:liveStream>
            <div class="row items-center no-wrap">
              <q-icon left name="mic" />
              <div class="text-center">主播</div>
              <!-- <div class="float-stream">直播中</div> -->
              <q-badge color="red" rounded floating>直播中</q-badge>
            </div>
          </template>
          <template v-slot:sport>
            <div class="row items-center no-wrap">
              <q-icon left name="sports_soccer" />
              <div class="text-center">足球</div>
            </div>
          </template>
          <!-- <template v-slot:three>
            <div class="row items-center no-wrap">
              <q-icon left name="sports_soccer" />
              <div class="text-center">lan球</div>
            </div>
          </template> -->
        </q-btn-toggle>
      </div>

      <!-- <pre>
        liveStreamList-- {{ liveStreamList }}
      </pre> -->

      <template v-if="tabValue === 'liveStream'">
        <div class="selection-container q-px-md">
          <template v-for="(item, index) in liveStreamList" :key="index">
            <router-link
              :to="{
                path: '/livestream/streamplayer',
                query: {
                  streamId: item.id
                }
              }"
              class="selection-item"
            >
              <!-- // put item.supplierCdnPullUrl + item.streamerCdnPushUrl + streanerCdnPullUrl to the next page. -->
              <div class="item-img"><img src="../../assets/images/livestream/img-placeholder-stream.png" alt="" /></div>
              <div class="item-content">
                <div class="content-title">
                  <!-- 德国甲级联赛 -->
                  {{ item.homeNameZh }}
                </div>
                <div class="content-desc">{{ item.homeNameZh }} VS {{ item.awayNameZh }}</div>
              </div>
              <div class="item-float-content">
                <div class="content-float float-user">
                  <div class="user-avatar"><img src="https://cdn.quasar.dev/img/avatar.png" /></div>
                  <div>悦悦</div>
                </div>
                <div class="content-float float-filled">
                  <div>正在直播</div>
                </div>
              </div>
            </router-link>
          </template>

          <!-- <router-link to="/livestream/streamplayer" class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder-stream.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">德国甲级联赛</div>
              <div class="content-desc">沃尔夫斯堡VS库勒沃斯</div>
            </div>
            <div class="item-float-content">
              <div class="content-float float-user">
                <div class="user-avatar"><img src="https://cdn.quasar.dev/img/avatar.png" /></div>
                <div>悦悦</div>
              </div>
              <div class="content-float float-filled">
                <div>正在直播</div>
              </div>
            </div>
          </router-link> -->

          <!-- <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
            <div class="item-float-content">
              <div class="content-float float-user">
                <div class="user-avatar"><img src="https://cdn.quasar.dev/img/avatar.png" /></div>
                <div>悦悦</div>
              </div>
              <div class="content-float float-detail">
                <q-icon name="notifications" />
                <div>7人预约</div>
              </div>
            </div>
          </div> -->

          <!-- <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div>
          <div class="selection-item">
            <div class="item-img"><img src="../../assets/images/livestream/img-placeholder.png" alt="" /></div>
            <div class="item-content">
              <div class="content-title">2025LCK杯</div>
              <div class="content-desc">T1 vs Nongshim RedForce</div>
            </div>
          </div> -->
        </div>
      </template>

      <template v-if="tabValue === 'sport'">
        <template v-if="!$q.dark.isActive">
          <div class="white">
            <!-- <div class="hot-match-container">
              <div class="competition-items">
                <div
                  class="competition-item"
                  v-for="competitionType in competitionTypes"
                  :class="{ active: competitionType === selectedCompetitionType }"
                  @click="selectedCompetitionType = competitionType"
                  :key="competitionType"
                >
                  <img
                    class="competition-item-img"
                    :src="
                      competitionType === selectedCompetitionType
                        ? require(`../../assets/images/hotmatch/${competitionType.toLowerCase()}-w-active.png`)
                        : require(`../../assets/images/hotmatch/${competitionType.toLowerCase()}-w.png`)
                    "
                  />
                </div>
              </div>
            </div> -->
            <div class="hot-match-items">
              <div
                :class="selectedCompetitionType"
                class="hot-match-item"
                v-for="hotMatch in hotMatchesByType"
                :key="hotMatch.id"
              >
                <div class="hot-match-info">
                  <div class="hot-match-name">
                    {{ hotMatch.competitionName }}
                  </div>
                  <div class="hot-match-scores">
                    <div class="hot-match-team">
                      <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamOneLogo}`" />
                      <span>{{ hotMatch.teamOneName }}</span>
                    </div>
                    <div class="hot-match-time">
                      {{ hotMatch.competitionTime }}
                      <div
                        class="bet-btn"
                        @click="openGame(hotMatch.platformName, hotMatch.platformCode, hotMatch.gameCode)"
                      >
                        立即投注
                      </div>
                    </div>
                    <div class="hot-match-team">
                      <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamTwoLogo}`" />
                      <span>{{ hotMatch.teamTwoName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </template>

  <GameModal ref="gameRef" />
</template>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import GameModal from "components/modal/GameModal.vue";

const qs = require("qs");
const tabValue = ref("liveStream");
const hotMatches = ref([]);
const competitionTypes = ref([]);
const selectedCompetitionType = ref();
const imgUrl = process.env.IMAGE_CDN;

const now = moment().format("YYYY-MM-DD HH:mm:ss");

const hotMatchesByType = computed(() => {
  if (hotMatches.value.length > 0 && selectedCompetitionType.value) {
    return hotMatches.value.filter(
      ({ competitionType, displayStartTime, displayEndTime }) =>
        competitionType === selectedCompetitionType.value && now >= displayStartTime && now <= displayEndTime
    );
  }

  return [];
});

const gameRef = ref();

const openGame = (gameName, code, gameCode) => {
  gameRef.value.open(gameName, code, gameCode);
};

const liveStreamList = ref([]);

const liveStreamStatusInfo = reactive({
  status: 1
});

const getLiveUrlList = () => {
  // .post("/session/bankCard", qs.stringify(bankCardInfo))
  api.post("/live/list", qs.stringify(liveStreamStatusInfo)).then((res) => {
    if (res.code === 0) {
      liveStreamList.value = res.data.records;
    }

    // else {
    //   liveStreamList.value = [
    //     {
    //       id: 36,
    //       sportId: 1,
    //       homeNameZh: "萨尔茨堡红牛",
    //       homeNameEn: "Red Bull Salzburg",
    //       homeIcon: "https://cdn.sportnanoapi.com/football/team/4e07d3ac5c7d1f02fba7fa4c14c8ee76.png",
    //       awayNameZh: "米德尔斯堡f'lüflü",
    //       awayNameEn: "Middlesbrough",
    //       awayIcon: "https://cdn.sportnanoapi.com/football/team/f08f87259dc2abc1449b67081e8b7f83.png",
    //       eventStartTime: 1744100397000,
    //       title: "test--frank1",
    //       supplierCdnPullUrl:
    //         '{"540p": {"flv_url": "https://ozqak6.me/live/MA02K_540p.flv?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049", "hls_url": "https://ozqak6.me/live/MA02K_540p.m3u8?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049"}, "720p": {"flv_url": "https://ozqak6.me/live/MA02K_720p.flv?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049", "hls_url": "https://ozqak6.me/live/MA02K_720p.m3u8?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049"}, "1080p": {"flv_url": "https://ozqak6.me/live/MA02K_1080p.flv?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049", "hls_url": "https://ozqak6.me/live/MA02K_1080p.m3u8?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049"}, "original": {"flv_url": "https://ozqak6.me/live/MA02K.flv?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049", "hls_url": "https://ozqak6.me/live/MA02K.m3u8?txSecret=b285142e3fd7a2f3be8c0a0f2d9c8e17&txTime=20250408143049"}}',
    //       streamerCdnPushUrl:
    //         "rtmp://209959.push.tlivecloud.com/live/streamer/K7NBK?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219",
    //       streamerCdnPullUrl:
    //         '{"540p": {"flv_url": "https://ozqak6.me/live/streamer/K7NBK_540p.flv?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219", "hls_url": "https://ozqak6.me/live/streamer/K7NBK_540p.m3u8?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219"}, "720p": {"flv_url": "https://ozqak6.me/live/streamer/K7NBK_720p.flv?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219", "hls_url": "https://ozqak6.me/live/streamer/K7NBK_720p.m3u8?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219"}, "1080p": {"flv_url": "https://ozqak6.me/live/streamer/K7NBK_1080p.flv?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219", "hls_url": "https://ozqak6.me/live/streamer/K7NBK_1080p.m3u8?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219"}, "original": {"flv_url": "https://ozqak6.me/live/streamer/K7NBK.flv?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219", "hls_url": "https://ozqak6.me/live/streamer/K7NBK.m3u8?txSecret=734aa7a8c9c3ac8510d95eeefa5d6dcc&txTime=20250409030219"}}'
    //     }
    //   ];
    // }
  });
};

onMounted(() => {
  api.get("/platform-competition").then((res) => {
    if (res.code === 0) {
      const uniqueCompetitionTypes = Array.from(new Set(res.data.map(({ competitionType }) => competitionType)));
      competitionTypes.value = uniqueCompetitionTypes.reverse();

      if (uniqueCompetitionTypes.length > 0) {
        selectedCompetitionType.value = uniqueCompetitionTypes[2];
        hotMatches.value = res.data;
      }
    }
  });

  getLiveUrlList();
});
</script>

<style lang="scss" scoped>
.white {
  .hot-match-container {
    box-shadow: 0px -2.78px 2.78px 0px rgba(195, 212, 230, 1) inset, 0px 1.39px 0px 0px rgba(167, 194, 221, 1);
    margin: 8px 10px;
    border-radius: 8px;
  }
  .competition-items {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 14px;

    gap: 10px;

    .competition-item {
      display: flex;
      flex-direction: column;
      text-align: center;
      cursor: pointer;

      img {
        width: 100%;
      }

      .competition-item-name {
        font-family: "PingFang SC";
        font-size: 18px;
        font-weight: 500;
        line-height: 25.2px;
        text-align: left;
        color: #b7c1ff;
        margin-top: -30px;
        text-align: center;
      }
    }
  }

  .hot-match-items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 20px 20px 20px;

    .hot-match-item {
      background: unset;
      background-size: 100% 100%;
      aspect-ratio: 351 / 139;
      width: 100%;
      height: 150px;
      color: rgba(76, 76, 108, 1);
      box-shadow: 0px -3.71px 3.71px 0px rgba(195, 212, 230, 1) inset, 0px 1.85px 0px 0px rgba(167, 194, 221, 1);
      border-radius: 10px;
      &.ESport {
        background: #fff;
        background-size: 100% 100%;
      }

      &.Basketball {
        background: #fff;
        background-size: 100% 100%;
      }

      &.Football {
        background: #fff;
        background-size: 100% 100%;
      }

      .hot-match-info {
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        position: relative;

        .hot-match-name,
        .hot-match-time {
          font-family: "PingFang";
          font-size: 14px;
          font-weight: 400;
          line-height: 15px;
          color: rgba(76, 76, 108, 1);
          text-align: center;
        }

        .hot-match-scores {
          display: flex;
          align-items: center;
          gap: 10px;

          .hot-match-time {
            width: 85px;

            .bet-btn {
              position: absolute;
              left: 50%;
              bottom: 0%;
              transform: translate(-50%, -50%);
              padding: 3px 8px;
              background: #fff;
              border-radius: 5px;
              cursor: pointer;
              color: rgba(69, 139, 255, 1);
              border: rgba(69, 139, 255, 1) 1px solid;
              border-radius: 100px;
              &:hover {
                filter: brightness(1.1);
              }
            }
          }

          .hot-match-team {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            font-family: "PingFang";
            font-size: 14px;
            font-weight: 400;
            line-height: 15px;
            color: rgba(76, 76, 108, 1);
            text-align: center;
            gap: 5px;
            width: 120px;
          }

          .hot-match-img {
            width: 70px;
            background-color: #fff;
            border-radius: 100px;
            padding: 5px;
            aspect-ratio: 1 / 1;
            box-shadow: 0px 2.29px 2.29px 0px rgba(147, 199, 255, 1) inset,
              0px -1.84px 1.84px 0px rgba(39, 94, 193, 1) inset;
          }
        }
      }
    }
  }
}
.competition-items {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px;
  gap: 10px;

  .competition-item {
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: pointer;

    img {
      width: 100%;
    }

    .competition-item-name {
      font-family: "PingFang SC";
      font-size: 18px;
      font-weight: 500;
      line-height: 25.2px;
      text-align: left;
      color: #b7c1ff;
      margin-top: -30px;
      text-align: center;
    }
  }
}

.hot-match-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding: 0 20px 20px 20px;

  .hot-match-item {
    background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark.png") no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 351 / 139;
    width: 100%;
    height: 150px;

    &.ESport {
      background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-esport.png") no-repeat center center;
      background-size: 100% 100%;
    }

    &.Basketball {
      background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-basketball.png") no-repeat center center;
      background-size: 100% 100%;
    }

    &.Football {
      background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-soccer.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .hot-match-info {
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      position: relative;

      .hot-match-name,
      .hot-match-time {
        font-family: "PingFang";
        font-size: 14px;
        font-weight: 400;
        line-height: 15px;
        color: #fff;
        text-align: center;
      }

      .hot-match-scores {
        display: flex;
        align-items: center;
        gap: 10px;

        .hot-match-time {
          width: 85px;

          .bet-btn {
            position: absolute;
            left: 50%;
            bottom: 0%;
            transform: translate(-50%, -50%);
            padding: 3px 8px;
            background: linear-gradient(to bottom, #5d7dbf 0%, #242d6f 100%);
            border-radius: 5px;
            cursor: pointer;

            &:hover {
              filter: brightness(1.1);
            }
          }
        }

        .hot-match-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-family: "PingFang";
          font-size: 14px;
          font-weight: 400;
          line-height: 15px;
          color: #fff;
          text-align: center;
          gap: 5px;
          width: 120px;
        }

        .hot-match-img {
          width: 70px;
          background-color: #27385b;
          border-radius: 100px;
          padding: 5px;
          aspect-ratio: 1 / 1;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.top-toggle-menu {
  width: 100%;
  padding: 6px;
  background: #ffffff;
  box-shadow: 0px -1px 3.66px 0px #a2bff4 inset;

  :deep(.q-btn-item) {
    width: 100%;

    &.bg-primary {
      border-radius: 50px;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%) !important;
    }
  }

  .float-stream {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.selection-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 12px;
  column-gap: 12px;
  .selection-item {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 4px 4px 0px #10264517;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    .item-float-content {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      left: 0;
      padding: 8px;

      .content-float {
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 24px;
        font-size: 12px;
        min-height: 24px;
        &.float-user {
          padding: 0px 8px 0px 0px;
          .user-avatar {
            img {
              display: block;
              width: 100%;
              max-width: 24px;
              border-radius: 50%;
            }
          }
        }
        &.float-detail {
        }
        &.float-filled {
          border-radius: 6px;
          background: #1ac1a2;
        }
      }
    }

    .item-img {
      img {
        display: block;
        width: 100%;
        opacity: 0.9;
      }
    }
    .item-content {
      padding: 3px 6px;
      .content-title {
        font-size: 18px;
        font-weight: bold;
      }
      .content-desc {
        color: #7a80a1;
      }
    }
  }
}
</style>

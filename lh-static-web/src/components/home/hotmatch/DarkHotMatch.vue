<template>
  <div
  class="hot-match-container"
  >
  <img src="@/assets/home/hotmatch/hot-match-title.png" style="display: flex; margin: 20px auto 10px; width: 850px" />
    <img v-if="isFetchingHotMatches" class="hot-match-loading" src="@/assets/home/hotmatch/loading.gif" />
    <div class="competition-items" >
      <div
        class="competition-item"
        v-for="competitionType in competitionTypes"
        :class="{ active: competitionType === selectedCompetitionType }"
        @click="selectedCompetitionType = competitionType"
      >
        <div class="competition-item-img-wrapper">
          <img
            class="competition-item-img"
            :src="require(`@/assets/home/hotmatch/${competitionType.toLowerCase()}.png`)"
          />
        </div>
        <div class="competition-item-name">{{ getCompetitionTypeCnLabel(competitionType) }}</div>
      </div>
    </div>
    <el-carousel arrow="always" v-if="hotMatchesByChunk.length > 0">
      <el-carousel-item v-for="(hotMatchesByChunkItem, index) in hotMatchesByChunk" :key="index">
        <div class="hot-match-items">
          <div class="hot-match-item" v-for="hotMatch in hotMatchesByChunkItem" :key="hotMatch.id">
            <div class="hot-match-info">
              <div class="hot-match-name">
                {{ hotMatch.competitionName }}
              </div>
              <div class="hot-match-scores">
                <div class="hot-match-team">
                  <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamOneLogo}`" />
                  <span>{{ hotMatch.teamOneName }}</span>
                </div>
                <div class="hot-match-time">{{ hotMatch.competitionTime }}<div class="bet-btn" @click="props.openGame(hotMatch.platformName, hotMatch.platformCode, hotMatch.gameCode)">立即投注</div></div>
                <div class="hot-match-team">
                  <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamTwoLogo}`" />
                  <span>{{ hotMatch.teamTwoName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getHotMatches } from "@/api/index/hotmatch.js";
import { useLocalStorage } from "@vueuse/core";
import moment from 'moment';

const hotMatches = ref([]);
const competitionTypes = ref(['ESport', 'Football', 'Basketball']);
const selectedCompetitionType = ref();
const imgUrl = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
const isFetchingHotMatches = ref(false);
const props = defineProps(['openGame']);
const getCompetitionTypeCnLabel = (enLabel) => {
  switch (enLabel) {
    case "Football":
      return "足球";
    case "Basketball":
      return "篮球";
    case "ESport":
      return "电竞";
    default:
      return "";
  }
};

const getChunk = (list, size) =>
  [...Array(Math.ceil(list.length / size))].map((_, i) => list.slice(i * size, i * size + size));

const hotMatchesByChunk = computed(() => {
  if (hotMatches.value.length > 0 && selectedCompetitionType.value) {
    return getChunk(
      hotMatches.value.filter(({ competitionType }) => competitionType === selectedCompetitionType.value),
      4
    );
  }

  return [];
});

onMounted(() => {
  isFetchingHotMatches.value = true;

  getHotMatches().then((res) => {
    isFetchingHotMatches.value = false;

    if (res.code === 0) {
      const uniqueCompetitionTypes = Array.from(new Set(res.data.map(({ competitionType }) => competitionType)));
      // competitionTypes.value = uniqueCompetitionTypes;

      if (uniqueCompetitionTypes.length > 0) {
        selectedCompetitionType.value = uniqueCompetitionTypes[0];
        const ongoingCompetitions = res.data.filter((competition) => {
          const now = moment().format('YYYY-MM-DD HH:mm:ss');
          return moment(now).isBetween(competition.displayStartTime, competition.displayEndTime, undefined, '[]');
        });
        hotMatches.value = ongoingCompetitions;
      }
    }
  }).catch(() => {
    isFetchingHotMatches.value = false;
  }).finally(() => {
    isFetchingHotMatches.value = false;
  });
});
</script>

<style lang="scss" scoped>
.hot-match-loading {
  display: flex;
  margin: auto;
}

.hot-match-container {
  :deep(.el-carousel__arrow) {
    width: 45px;
  }

  :deep(.el-carousel__arrow--left) {
    background: url("@/assets/home/hotmatch/arrow-left.png") no-repeat center center;
    background-size: contain;
  }

  :deep(.el-carousel__arrow--right) {
    background: url("@/assets/home/hotmatch/arrow-right.png") no-repeat center center;
    background-size: contain;
  }

  :deep(.el-carousel) {
    max-width: 1400px;
    width: 100%;
    margin: auto;
    background: url("@/assets/home/hotmatch/hot-match-bg.png") no-repeat center center;
    background-size: 100% 100%;
  }

  :deep(.el-carousel__container) {
    height: 200px;
    width: 100%;
  }

  :deep(.el-carousel__arrow .el-icon) {
    visibility: hidden;
  }

  .hot-match-items {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    height: 100%;

    .hot-match-item {
      background: url("@/assets/home/hotmatch/hot-match-item-bg.png") no-repeat center center;
      background-size: 100% 100%;
      aspect-ratio: 638 / 290;

      .hot-match-info {
        height: 100%;
        padding: 15px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
        width: 300px;
        height: 145px;
        position: relative;

        .hot-match-name,
        .hot-match-time {
          font-family: "PingFang SC";
          font-size: 14px;
          font-weight: 400;
          line-height: 15px;
          color: #fff;
          text-align: center;
        }

        .hot-match-name {
          font-size: 18px;
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
              background: linear-gradient(to bottom, #6581ef 0%, #242d6f 100%);
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
            font-family: "PingFang SC";
            font-size: 14px;
            font-weight: 400;
            line-height: 15px;
            color: #fff;
            text-align: center;
            gap: 10px;
            width: 80px;
          }

          .hot-match-img {
            width: 50px;
            background-color: #27307c;
            border-radius: 100px;
            padding: 5px;
            aspect-ratio: 1/1;
          }
        }
      }
    }
  }
}

.competition-items {
  display: flex;
  aspect-ratio: 3387 / 144;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1385px;
  margin: auto;

  .competition-item {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    height: 100%;
    width: 215px;
    background: url("@/assets/home/hotmatch/competition-type-bg.png") no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 688 / 236;
    height: 70px;
    padding-bottom: 10px;
    padding-right: 20px;

    .competition-item-name {
      font-family: "PingFang SC";
      font-size: 20px;
      font-weight: 500;
      line-height: 25px;
      color: rgba(169, 143, 124, 1);
      text-align: center;
    }

    .competition-item-img-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .competition-item-img {
        height: 100%;
      }
    }

    &.active {
      background: url("@/assets/home/hotmatch/competition-type-bg-active.png") no-repeat center center;
    background-size: 100% 100%;

      .competition-item-img {
        filter: brightness(1);
      }

      .competition-item-name {
        color: #fff;
      }
    }
  }
}

:deep(.el-carousel__indicators) {
  bottom: -8px;
}
</style>

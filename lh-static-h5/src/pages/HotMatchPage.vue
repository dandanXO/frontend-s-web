<template>
  <template v-if="!$q.dark.isActive ">
    <div class="white">
      <div class="hot-match-container">
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
                ? require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-w-active.png`)
                : require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-w.png`)
            "
          />
        </div>
      </div>
    </div>
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
              <div class="bet-btn" @click="openGame(hotMatch.platformName, hotMatch.platformCode, hotMatch.gameCode)">
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
  <template v-else>
    <div class="hot-match-container">
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
                ? require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-active-bg.png`)
                : require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-bg.png`)
            "
          />
        </div>
      </div>
    </div>

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
              <div class="bet-btn" @click="openGame(hotMatch.platformName, hotMatch.platformCode, hotMatch.gameCode)">
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
  </template>

  <GameModal ref="gameRef" />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import moment from "moment";
import { api } from "boot/axios";
import GameModal from "../components/modal/GameModal.vue";

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

onMounted(() => {
  api.get("/platform-competition").then((res) => {
    if (res.code === 0) {
      const uniqueCompetitionTypes = Array.from(new Set(res.data.map(({ competitionType }) => competitionType)));
      competitionTypes.value = uniqueCompetitionTypes;

      if (uniqueCompetitionTypes.length > 0) {
        selectedCompetitionType.value = uniqueCompetitionTypes[0];
        hotMatches.value = res.data;
      }
    }
  });
});
</script>

<style lang="scss" scoped>
.white{
  .hot-match-container{
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
              background:#fff;
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
            box-shadow: 0px 2.29px 2.29px 0px rgba(147, 199, 255, 1) inset, 0px -1.84px 1.84px 0px rgba(39, 94, 193, 1) inset;

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
    background: url("../assets/images/hotmatch/hotmatch-item-bg-dark.png") no-repeat center center;
    background-size: 100% 100%;
    aspect-ratio: 351 / 139;
    width: 100%;
    height: 150px;

    &.ESport {
      background: url("../assets/images/hotmatch/hotmatch-item-bg-dark-esport.png") no-repeat center center;
      background-size: 100% 100%;
    }

    &.Basketball {
      background: url("../assets/images/hotmatch/hotmatch-item-bg-dark-basketball.png") no-repeat center center;
      background-size: 100% 100%;
    }

    &.Football {
      background: url("../assets/images/hotmatch/hotmatch-item-bg-dark-soccer.png") no-repeat center center;
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

<template>
    <div
        v-if="hotMatchesByType.length > 0"
        class="hot-match-container"
    >
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
                :src="competitionType === selectedCompetitionType ? require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-active-bg.png`) : require(`../assets/images/hotmatch/${competitionType.toLowerCase()}-bg.png`)"
            />
            </div>
        </div>
    </div>
    <div class="hot-match-items">
        <div :class="selectedCompetitionType" class="hot-match-item" v-for="hotMatch in hotMatchesByType" :key="hotMatch.id">
        <div class="hot-match-info">
            <div class="hot-match-name">
            {{ hotMatch.competitionName }}
            </div>
            <div class="hot-match-scores">
            <div class="hot-match-team">
                <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamOneLogo}`" />
                <span>{{ hotMatch.teamOneName }}</span>
            </div>
            <div class="hot-match-time">{{ hotMatch.competitionTime }}</div>
            <div class="hot-match-team">
                <img class="hot-match-img" :src="`${imgUrl}/promo/${hotMatch.teamTwoLogo}`" />
                <span>{{ hotMatch.teamTwoName }}</span>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { api } from "boot/axios";

const hotMatches = ref([]);
const competitionTypes = ref([]);
const selectedCompetitionType = ref();
const imgUrl = process.env.IMAGE_CDN;

const hotMatchesByType = computed(() => {
  if (hotMatches.value.length > 0 && selectedCompetitionType.value) {
    return hotMatches.value.filter(({ competitionType }) => competitionType === selectedCompetitionType.value)
  }

  return [];
});

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
})
</script>

<style lang="scss" scoped>
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
          }
        }
      }
    }
  }
  </style>
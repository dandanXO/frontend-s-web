<template>
  <div v-if="matchInfoArr" style="position: relative">
    <div class="claim-history-btn" @click="isClaimHistoryDialogVisible = true">领取记录</div>

    <div class="nba-water-battle-bg" v-for="matchInfo in matchInfoArr" :key="matchInfo.id">
      <div class="match-carousel">
        <div>
          <div class="match-info">
            <div class="match-info-team">
              <div class="team-img-wrapper"><img class="team-img" :src="`${imageDir}${matchInfo.homeTeamIcon}`" /></div>
              <div>{{ matchInfo.homeTeam }}</div>
            </div>
            <div class="match-info-time">
              <div class="time-text">{{ moment(matchInfo.matchTime).format("MM月DD日 HH:mm:ss") }}</div>
              <button class="claim-btn" @click="handleClaim(matchInfo.id)">领取奖励</button>
            </div>
            <div class="match-info-team">
              <div class="team-img-wrapper"><img class="team-img" :src="`${imageDir}${matchInfo.awayTeamIcon}`" /></div>
              <div>{{ matchInfo.awayTeam }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="isClaimHistoryDialogVisible">
    <div class="nba-water-battle-claim-history-dialog">
      <table class="nba-water-battle-claim-history-dialog-table" v-if="claimHistoryArr?.length">
        <tr class="nba-water-battle-claim-history-dialog-table-header">
          <th>赛事</th>
          <th>全场进10个三分球</th>
          <th>任意球员砍下30分</th>
          <th>任意球员拿到13个篮板</th>
          <th>任意球员判罚离场</th>
          <th>状态</th>
          <th>获得彩金</th>
        </tr>

        <tr v-for="claimHistoryItem in claimHistoryArr" :key="claimHistoryItem.id">
          <td>{{ claimHistoryItem.title }}</td>
          <td>{{ getStatusLabel(claimHistoryItem.threePointShots) }}</td>
          <td>{{ getStatusLabel(claimHistoryItem.shotPoints) }}</td>
          <td>{{ getStatusLabel(claimHistoryItem.scoringShots) }}</td>
          <td>{{ getStatusLabel(claimHistoryItem.foulOut) }}</td>
          <td>{{ getClaimStatus(claimHistoryItem.status) }}</td>
          <td>{{ claimHistoryItem.bonus }}</td>
        </tr>
      </table>
      <h6 class="no-content" v-else>暂无内容</h6>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";

import { getNBAUpcomingMatch, getNBAClaimHistory, claimNBABonus } from "../../../api/index/promo";
import moment from "moment";
import { useQuasar } from "quasar";

const $q = useQuasar();

const matchInfoArr = ref([]);
const claimHistoryArr = ref([]);
const isClaimHistoryDialogVisible = ref(false);
const slide = ref(0);
const imageDir = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const iniNBAUpcomingMatches = () => {
  getNBAUpcomingMatch().then((res) => {
    matchInfoArr.value = res.data;
  });
};

const getStatusLabel = (status) => {
  switch (status) {
    case true:
      return "✅";
    case false:
      return "❌";
    default:
      return "";
  }
};

const handleClaim = (id) => {
  claimNBABonus(id).then((res) => {
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: `领取成功`,
        icon: "check_circle_outline"
      });
    }
  });
};

const getClaimStatus = (status) => {
  switch (status) {
    case "PENDING_SETTLE ":
      return "待审核";
    case "SETTLED":
      return "已发放";
    case "CANCEL":
      return "已取消";
    default:
      return "";
  }
};

watch(
  () => isClaimHistoryDialogVisible.value,
  () => {
    if (isClaimHistoryDialogVisible.value === true) {
      getNBAClaimHistory().then((res) => {
        claimHistoryArr.value = res.data;
      });
    }
  }
);

onMounted(() => {
  iniNBAUpcomingMatches();
});
</script>

<style lang="scss">
.nba-water-battle-claim-history-dialog {
  font-family: "PingFang";
  font-size: 15px;
  background-color: white;
  margin: 20px;

  .no-content {
    margin: auto;
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .el-dialog__close {
    color: #000 !important;
  }

  .nba-water-battle-claim-history-dialog-table-header {
    height: 56px;
    font-size: 0.7rem;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);

    th {
      background: transparent !important;
      font-size: 14px;
    }
  }

  .nba-water-battle-claim-history-dialog-table {
    font-size: 12px;
    background-color: white;
    border-collapse: collapse;
    margin: 5%;

    td,
    th {
      border: 1px solid rgb(228, 228, 228);
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.claim-history-btn {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  margin-bottom: 16px;
  width: 100px;
  margin-left: auto;
  text-align: center;
  padding: 5px 15px;
  color: #fff;
  border-radius: 100px;
  cursor: pointer;
  z-index: 1;
  font-size: 0.75rem;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(2px);
  }
}

.nba-water-battle-bg {
  --font-size: 14px;
  --line-height: 22px;
  background: url("../../../assets/images/promo/hotpromo/nba-water-battle/nba-water-battle-widget-bg.png") no-repeat
    center center;
  background-size: 100% 100%;
  aspect-ratio: 702 / 280;
  position: relative;
  font-family: "PingFang SC";
  font-size: var(--font-size);
  font-weight: bold;
  margin-bottom: 30px;

  .match-carousel {
    height: 100%;
    background-color: unset;
    .q-carousel__slide {
      padding: unset;
    }
  }

  .match-info {
    gap: 30px;
    position: absolute;
    width: 100%;
    aspect-ratio: 702 / 280;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 9%;

    .match-info-time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      height: 100%;

      .time-text {
        background-color: #edf4ff;
        border-radius: 100px;
        padding: 4px 8px;
        font-size: var(--font-size);
        font-weight: 600;
        line-height: var(--line-height);
        color: #479af7;
      }

      .claim-btn {
        border-radius: 100px;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        border: none;
        box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.66px 0px #5894ff inset;
        padding: 7px 0;
        width: 100%;
        font-size: var(--font-size);
        font-weight: 600;
        line-height: var(--line-height);
        color: #fff;
        &:hover {
          filter: brightness(1.2);
        }
      }
    }

    .match-info-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .team-img-wrapper {
        height: 60px;
      }

      .team-img {
        height: 100%;
        width: auto;
      }
    }
  }
}

@media (max-width: 450px) {
  .nba-water-battle-bg {
    --font-size: 12px;
    --line-height: 18px;
    .claim-history-btn {
      top: 2%;
    }
  }
}

@media (max-width: 380px) {
  .nba-water-battle-bg {
    --font-size: 10px;
    --line-height: 16px;
  }
}
</style>

<template>
  <div v-if="matchInfoArr" style="position: relative">
    <div class="claim-history-btn" @click="isClaimHistoryDialogVisible = true">领取记录</div>

    <div class="nba-water-battle-bg" v-for="matchInfo in matchInfoArr" :key="matchInfo.id">
      <el-carousel class="match-carousel" indicator-position="none">
        <el-carousel-item class="match-carousel-item">
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
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>

  <el-dialog v-model="isClaimHistoryDialogVisible" class="nba-water-battle-claim-history-dialog">
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

      <tr v-for="claimHistoryItem in claimHistoryArr">
        <td>{{ claimHistoryItem.title }}</td>
        <td>{{ getStatusLabel(claimHistoryItem.threePointShots) }}</td>
        <td>{{ getStatusLabel(claimHistoryItem.shotPoints) }}</td>
        <td>{{ getStatusLabel(claimHistoryItem.scoringShots) }}</td>
        <td>{{ getStatusLabel(claimHistoryItem.foulOut) }}</td>
        <td>{{ getClaimStatus(claimHistoryItem.status) }}</td>
        <td>{{ claimHistoryItem.bonus }}</td>
      </tr>
    </table>
    <h3 class="no-content" v-else>暂无内容</h3>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";

import { getNBAUpcomingMatch, getNBAClaimHistory, claimNBABonus } from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";

const store = userStore();
const notify = useNotify();

const matchInfoArr = ref([]);
const claimHistoryArr = ref([]);
const isClaimHistoryDialogVisible = ref(false);
const imageDir = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

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

const handleClaim = (id) => {
  claimNBABonus(id).then((res) => {
    if (res.code === 0) {
      notify.success("领取成功");
    }
  });
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
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  iniNBAUpcomingMatches();
});
</script>

<style lang="scss">
.nba-water-battle-claim-history-dialog {
  font-family: "PingFang SC";
  font-size: 15px;

  .no-content {
    margin: auto;
    display: flex;
    justify-content: center;
  }

  .el-dialog__close {
    color: #000 !important;
  }

  .nba-water-battle-claim-history-dialog-table-header {
    height: 56px;
    font-size: 1rem;
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
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
.claim-history-btn {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  padding: 10px 30px;
  color: #fff;
  margin-bottom: 16px;
  border-radius: 100px;
  cursor: pointer;
  z-index: 1;
  width: 160px;
  margin-left: auto;
  text-align: center;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(2px);
  }
}

.nba-water-battle-bg {
  background: url("@/assets/images/promotion/hotpromo/nba-water-battle/nba-water-battle-widget-bg.png") no-repeat center
    center;
  background-size: 100% 100%;
  aspect-ratio: 1200 / 302;
  position: relative;
  font-family: "PingFang SC";
  font-weight: bold;
  margin-bottom: 30px;

  .match-carousel {
    height: 100%;
    .match-carousel-item {
      overflow: visible;
    }
  }

  .match-info {
    gap: 30px;
    position: absolute;
    width: 100%;
    aspect-ratio: 1200 / 302;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 5%;

    .match-info-time {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 100%;

      .time-text {
        background-color: #edf4ff;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 24px;
        font-weight: 600;
        line-height: 33.6px;
        color: #479af7;
      }
      .claim-btn {
        border-radius: 100px;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.66px 0px #5894ff inset;
        padding: 7px 0;
        width: 100%;
        font-size: 24px;
        font-weight: 600;
        line-height: 34px;
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
      gap: 20px;

      .team-img-wrapper {
        // height: 200px;
      }

      .team-img {
        max-height: 150px;
        height: 100%;
        width: auto;
        padding: unset;
        margin: unset;
        // margin-bottom: 20px;
      }
    }
  }

  :deep(.el-carousel__arrow) {
    display: none !important;
  }
}

.dark {
  .nba-water-battle-bg {
    background-image: url("@/assets/images/promotion/hotpromo/nba-water-battle/nba-water-battle-widget-bg-dark.png");
  }
  .match-info-team {
    color: #fff;
  }
}
</style>

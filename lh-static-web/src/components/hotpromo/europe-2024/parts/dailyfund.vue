<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>
  <div class="note">注：用户选定每组的参与队伍后不予更改；</div>
  <div class="fund-wrapper">
    <img src="../images/daily-fund-logo.png" class="fund-logo" />
    <div class="fund-inner-wrapper">
      <div class="fund-status">
        <span class="fund-status__point-title">总积分</span>
        <div class="fund-status__point">{{matchPoints.currentPoints}}</div>
        <div class="fund-contest-time-left">
          <img src="../images/daily-fund-icon-time.svg" />
          <span class="fund-contest-time-left__title">比赛剩余</span>
          <span class="fund-contest-time-left__content" v-if="remainingTime">{{ `${remainingTime.days} 天 ${remainingTime.hours} 小时` }}</span>
        </div>
      </div>
      <div class="fund-divider" />
      <div class="fund-progress-wrapper">
        <div class="fund-progress-ranking-wrapper firstrow">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i}`" :class="`ranking-${i}`">
            <div v-if="i === 0"></div>
            <div v-if="i !== 0">
              {{ num.amt }} 元
            <img :src="require(`../images/daily-fund-ranking-${i+1}.png`)" />
            </div>
          </div>
          
        </div>
        <el-progress
          :percentage="getPercentage(matchPoints.currentPoints)"
          class="fund-progress-bar"
          :show-text="false"
          color=" linear-gradient(180deg, #00D1FF 0%, #0D70D6 100%)"
        />
        <div class="fund-progress-ranking-wrapper">
          <div v-for="(num, i) in rankPoints" :key="`ranking-text-${i+1}`" :class="`ranking-${i+1}`">
              {{ num.points }}
              <div v-if="i !== 0">
              <div class="claim">
                <img @click="claimPoint(num.points)" v-if="matchPoints.currentPoints >= num.points && matchPoints.pointsClaimed && !matchPoints.pointsClaimed.includes(num.points)" src="../images/daily-fund-claim.png">
                <img v-else src="../images/daily-fund-claimed.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bracket-list-wrapper">
    <div class="bracket-wrapper" v-for="(match, index) in ongoingMatches" :key="index">
      <div class="bracket-team-select">
        <bracket-team :img-url="imgUrl + match.teamOneIcon" :country="match.teamOneName" />
        <button @click="matchSubmit(match, match.teamOneId, match.teamOneName)" v-if="!match.selectedTeamId" class="bracket-team-select__button">选择</button>
        <button v-if="match.selectedTeamId === match.teamOneId" class="bracket-team-select__button active">已选</button>
      </div>
      <div class="bracket-info">
        <div class="bracket-info__status">{{match.status === 'ONGOING' ? '进行中' : '已结束'}}</div>
        <div class="bracket-info__info-wrapper">
          <div class="bracket-info__info-wrapper-date">{{ match.matchTime }}</div>
          <div class="bracket-info__info-wrapper-contest">{{ match.title }}</div>
        </div>
      </div>
      <div class="bracket-team-select">
        <bracket-team  :img-url="imgUrl + match.teamTwoIcon" :country="match.teamTwoName" />
        <button @click="matchSubmit(match, match.teamTwoId, match.teamTwoName)" v-if="!match.selectedTeamId" class="bracket-team-select__button">选择</button>
        <button v-if="match.selectedTeamId === match.teamTwoId" class="bracket-team-select__button active">已选</button>
      </div>
    </div>
  </div>
  <table>
    <tr>
      <th>有效投注</th>
      <th>投注彩金</th>
      <th>专属队伍彩金</th>
      <th>彩金倍数</th>
    </tr>
    <tr>
      <td>≥1888</td>
      <td>18</td>
      <td>18</td>
      <td rowspan="4">3倍</td>
    </tr>
    <tr>
      <td>≥1888</td>
      <td>18</td>
      <td>18</td>
    </tr>
  </table>
  <el-dialog width="300" :title="selectedMatch.title" v-model="confirmDialog">
    <p>您确定要选择 <span style="font-weight: bold; color: #0051b3;">{{selectedItem.name}}</span> 吗？请注意，一旦选择后将无法更改。</p>
      <div style="margin-top: 20px;">
      <el-button type="primary" @click="confirmMatchSelect(selectedMatch.id, selectedItem.id)">确定</el-button>
      <el-button type="danger" @click="confirmDialog = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
import BracketTeam from "./components/BracketTeam.vue";
import { onMounted } from "vue";
import { euroMatchOngoing, euroMatchPoints, euroClaimMatchPoints, euroMatchSubmit } from "@/api/promotion/eurocup";
import { ElMessage } from "element-plus";

const props = defineProps({
  tabtitle: String
});
const rankPoints = [
  {
    amt: '',
    points: 0
  },
  {
    amt: 8,
    points: 1000
  },
  {
    amt: 8,
    points: 2000
  },
  {
    amt: 18,
    points: 3000
  },
  {
    amt: 58,
    points: 4000
  },
  {
    amt: 88,
    points: 5000
  },
  {
    amt: 188,
    points: 6000
  },
]
const imgUrl = process.env.VUE_APP_IMAGE_CDN + '/promo/';
const confirmDialog = ref(false);
const selectedMatch = ref('');
const selectedItem = ref({
  id: null,
  name: null
});
const matchPoints = ref([]);
const getPercentage = (points) => {
  return points / 6000 * 100
}
const isClaimed = ref(false)
const ongoingMatches = ref();
const remainingTime = ref();
const getMatchPoints = () => {
  euroMatchPoints().then((res) => {
    if (res.code === 0) {
      matchPoints.value = res.data
      remainingTime.value = calculateRemainingTime(res.data.endDate);
    } else {
      ElMessage.error(res.message);
    }
  })
}
const claimPoint = (points) => {
  euroClaimMatchPoints(points).then((res) => {
    if (res.code === 0) {
      ElMessage.success('领取成功');
    } else {
      ElMessage.error(res.message);
    }
  })
}
const getMatches = () => {
  euroMatchOngoing().then((res) => {
    if (res.code === 0) {
      ongoingMatches.value = res.data
    }
  })
}
const matchSubmit = (match, id, name) => {
  confirmDialog.value = true;
  selectedMatch.value = match
  selectedItem.value = {
    id: id,
    name: name
  }
}
const confirmMatchSelect = () => {
  euroMatchSubmit(selectedMatch.value.id, selectedItem.value.id).then((res) => {
    if (res.code === 0) {
      ElMessage.success('提交成功');
      confirmDialog.value = false;
      getMatches();
    }
  })
}
function calculateRemainingTime(endDate) {
  // Parse the end date string into a Date object
  const endDateTime = new Date(endDate);

  // Get the current date and time
  const now = new Date();

  // Calculate the difference in milliseconds between now and the end date
  const difference = endDateTime - now;

  // Convert milliseconds to days and hours
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // Return the remaining time as an object
  return {
    days,
    hours
  };
}

onMounted(() => {
  getMatches()
  getMatchPoints()
})
</script>
<style scoped lang="scss">
$ranking-list: 36px, 49px, 50px, 59px, 85px, 95px, 90px;

@for $i from 1 through length($ranking-list) {
  .ranking-#{$i} {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    div {
      display: flex;
      gap: 5px;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      font-size: 20px;
    }
    img {    
      width: nth($ranking-list, $i);
    }
  }
}

.ranking-0 {
  width: 50px;
}

.note {
  font-family: Microsoft YaHei UI;
  font-size: 24px;
  font-weight: 400;
  line-height: 31.92px;
  letter-spacing: 0.12em;
  text-align: center;
  color: #faff00;
  margin-bottom: 31.92px;
}

.fund-wrapper {
  padding: 10px 0;
  position: relative;
  font-family: Microsoft YaHei UI;
    margin-bottom: 43px;

  .fund-logo {
    position: absolute;
    top: 0;
    left: -54px;
    bottom: 0;
    margin: auto;
  }

  .fund-inner-wrapper {
    background-color: #143cda66;
    padding: 35px 28px 35px 192px;
    display: flex;
    gap: 35px;
    border-radius: 28px;
    color: #ffffff;

    .fund-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .fund-status__point-title {
        font-size: 24px;
        line-height: 31.92px;
        color: #ffffff66;
        margin-bottom: 16px;
      }

      .fund-status__point {
        background-color: #002977;
        font-size: 48px;
        font-weight: 700;
        line-height: 63.84px;
        margin-bottom: 25px;
        padding: 0 33px;
        border-radius: 9px;
      }

      .fund-contest-time-left {
        display: flex;
        gap: 8px;
        font-size: 16px;
        line-height: 21.28px;

        .fund-contest-time-left__title {
          color: #ffffff66;
        }
      }
    }

    .fund-divider {
      border: 1px solid #ffffff33;
    }

    .fund-progress-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .fund-progress-ranking-wrapper {
        display: flex;
        justify-content: space-between;

    align-items: flex-end;
        width: 100%;
          font-size: 24px;
          .claim {
            width: 100px;
            cursor: pointer;
            img {
              width: 100%;
            }
          }
        

        &:last-child {
          align-items: flex-start;
          font-size: 24px;
          line-height: 31.92px;
        }
        &:not(:last-child) {
          margin-bottom: 15px;
        }
      }

      .fund-progress-bar {
        width: 100%;
        margin-bottom: 38px;

        &:deep(.el-progress-bar) {
          .el-progress-bar__outer {
            height: 20px !important;
            background-color: #ffffff1a;
            .el-progress-bar__inner {
              background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%) !important;
            }
          }
        }
      }
    }
  }
}

.bracket-wrapper {
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  background: #051d4766;
  border: 1px solid #ffffff66;
  border-radius: 8px;
  margin-bottom: 65px;
  font-family: Microsoft YaHei UI;

  .bracket-team-select {
    width: 100%;
    height: 317px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-top: 50px;
    gap: 35px;
    .bracket-team-select__button {
      background: linear-gradient(180deg, #fcf5ff 0%, #8db9ee 100%);
      padding: 12px 90px;
      border-radius: 33px;
      font-size: 32px;
      font-weight: 700;
      line-height: 42.56px;
      letter-spacing: 0.12em;
      color: #333333;

      &:hover,
      &.active {
        background: linear-gradient(180deg, #008df9 0%, #0051b3 100%);
        color: #ffffff;
      }
    }
  }

  .bracket-info {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    gap: 45px;
    flex-shrink: 0;

    .bracket-info__status {
      background: linear-gradient(180deg, #00d1ff 0%, #0d70d6 100%);
      padding: 20px 118px;
      border-radius: 0px 0px 20px 20px;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 32px;
      line-height: 38px;
      letter-spacing: 0.12em;
      text-align: center;

      &.finished {
        background: linear-gradient(180deg, #f99500 0%, #b34b00 100%);
      }
    }

    .bracket-info__info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 22px;
      align-items: center;

      .bracket-info__info-wrapper-date {
        background-color: #458bff1a;
        padding: 7px 72px 15px 72px;
        border-radius: 100px;
        font-size: 32px;
        font-weight: 700;
        line-height: 42.56px;
        letter-spacing: 0.12em;
        text-align: center;
      }

      .bracket-info__info-wrapper-contest {
        font-size: 32px;
        line-height: 42.56px;
        letter-spacing: 0.12em;
        color: #ffffff99;
      }
    }
  }
}
</style>

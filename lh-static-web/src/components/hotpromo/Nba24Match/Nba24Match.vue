<template>
  <div class="nba24-match-box">
    <div class="nba24-match-container">
      <div class="nba24-match-game">
        <div class="nba24-match-game-status">进行中</div>
        <div class="nba24-match-game-content">
          <div class="nba24-match-game-content-left">
            <div class="nba24-match-game-content-team">
              <img src="../../../assets/promo/lh-nba24-match/team1.png" alt="" />
              <div class="nba24-match-game-content-team-name">老鷹</div>
              <div class="nba24-match-game-content-btn">投票</div>
            </div>
          </div>
          <div class="nba24-match-game-content-center">
            <div class="nba24-match-game-content-center-time">05月11日 16:00:00</div>
            <div class="nba24-match-game-content-center-schedule">季后总决赛</div>
            <div class="nba24-match-game-content-btn">平局</div>
          </div>
          <div class="nba24-match-game-content-right">
            <div class="nba24-match-game-content-team">
              <img src="../../../assets/promo/lh-nba24-match/team2.png" alt="" />
              <div class="nba24-match-game-content-team-name">火箭</div>
              <div class="nba24-match-game-content-btn">投票</div>
            </div>
          </div>
        </div>
      </div>
      <div class="nba24-match-game-bottom">
        <div class="nba24-match-game-bottom-left-title">
          例：用户当日投注NBA季后赛总决赛30,000元，且用户参与活动选择队伍胜利，用户则获得188元。
        </div>
        <div class="nba24-match-game-bottom-left-btn" @click="tableRecordDialog = true">[投票记录]</div>
      </div>
      <div class="nba24-match-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">
            活动期间，用户投注NBA季后赛总决赛当日有效投注≥1,000元后参与本活动竞猜，根据竞猜结果派发对应彩金。
            每日最高可获1,888元。
          </div>
        </div>
        <table class="nba24-match-game-info-table">
          <tr>
            <th>有效投注</th>
            <th>竞猜正确</th>
            <th>竞猜失败</th>
            <th>流水倍数</th>
          </tr>
          <tr>
            <td>≥1,000</td>
            <td>8</td>
            <td>-</td>
            <td rowspan="10">5倍/不限场馆</td>
          </tr>
          <tr>
            <td>≥1,500</td>
            <td>18</td>
            <td>-</td>
          </tr>
          <tr>
            <td>≥3,000</td>
            <td>28</td>
            <td>8</td>
          </tr>
          <tr>
            <td>≥5,000</td>
            <td>38</td>
            <td>18</td>
          </tr>
          <tr>
            <td>≥10,000</td>
            <td>88</td>
            <td>58</td>
          </tr>
          <tr>
            <td>≥30,000</td>
            <td>188</td>
            <td>88</td>
          </tr>
          <tr>
            <td>≥80,000</td>
            <td>388</td>
            <td>188</td>
          </tr>
          <tr>
            <td>≥150,000</td>
            <td>588</td>
            <td>288</td>
          </tr>
          <tr>
            <td>≥500,000</td>
            <td>1,088</td>
            <td>888</td>
          </tr>
          <tr>
            <td>≥1,000,000</td>
            <td>2,888</td>
            <td>1,888</td>
          </tr>
        </table>
      </div>
      <div class="nba24-match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            1.活动期间，用户投注NBA季后赛总决赛当日有效投注≥1,000元后参与本活动竞猜，根据竞猜结果派发对应彩金。；
          </div>
          <div class="item">2.活动期间，每日符合条件的会员彩金于次日24小时内派发，彩金5倍流水即可提款；</div>
          <div class="item">
            3.本活动有效投注额仅对已结算并产生输赢结果的投注额进行计算，任何滚球、走水、串关、提前结算的投注、取消的赛事将不
            计算在有效投注，任何低于欧洲盘1.70或亚洲盘0.70水位的投注以及在同一赛事中同时投注对等盘口，将不计算在投注额内；
          </div>
          <div class="item">
            4.若指定赛事发生因故改期、未开盘或其他不可控原因导致活动不能如期进行，本站保有将根据具体情况取消优惠活动或采取其
            他适当的措施；
          </div>
          <div class="item">
            5.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不
            通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            6.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一
            账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">7.为避免文字理解差异，本站保留此活动最终解释权；</div>
        </div>
      </div>

      <el-dialog v-model="tableRecordDialog" width="800px" align-center :close-on-click-modal="false">
        <div class="record-dialog-container">
          <div class="promo-records-count">
            <div>总竞猜次数:</div>
            <div>总竞猜正确次数:</div>
            <div>今日正确次数:</div>
          </div>

          <table class="promo-table record-table">
            <thead>
              <tr>
                <th>投票时间</th>
                <th>参赛队伍</th>
                <th>投票队伍</th>
              </tr>
            </thead>
            <tbody>
              <!-- <template v-for="(record, index) in answeredRecords" :key="index">
            <tr>
              <td>{{ record.createTime }}</td>
              <td>{{ record.quizTitle }}</td>
              <td>{{ record.answerOne === 'draw' ? '平局' : record.answerOne }}</td>
            </tr>
          </template> -->
            </tbody>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tableRecordDialog = ref(false);
</script>

<style scoped lang="scss">
.nba24-match-box {
  font-family: PingFang TC;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nba24-match-container {
  width: 1200px;
  height: 100%;
}

.nba24-match-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  .nba24-match-game-status {
    width: 240px;
    height: 40px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.nba24-match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .nba24-match-game-content-left,
  .nba24-match-game-content-right {
    .nba24-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .nba24-match-game-content-team-name {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: 12px;
        margin-bottom: 24px;
      }
    }
  }
  .nba24-match-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px 120px;
    .nba24-match-game-content-center-time {
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-top: 12px;
    }
    .nba24-match-game-content-center-schedule {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #1b1b1b99;
      margin-top: 23px;
      margin-bottom: 33px;
    }
  }
}

.nba24-match-game-content-btn {
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #00000066;
  background-image: url("../../../assets/promo/lh-nba24-match/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 180px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nba24-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  .nba24-match-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #000000;
  }
  .nba24-match-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #479af7;
    cursor: pointer;
  }
}

.nba24-match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lh-nba24-match/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 40px;
  }
  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .left {
      background-image: url("../../../assets/promo/lh-nba24-match/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
    }
  }
}

.nba24-match-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.nba24-match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/lh-nba24-match/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item {
      text-indent: -16px;
      padding-left: 24px;
    }
  }
}

</style>

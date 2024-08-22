<template>
  <div class="sport-zhongchao-match-game">
<!--    <div class="sport-zhongchao-match-game-status">{{ getMatchStatusText(match.status) }}</div>-->
    <div class="sport-zhongchao-match-game-content">
      <div class="sport-zhongchao-match-game-content-item left">
        <div class="sport-zhongchao-match-game-content-team">
          <img :src="match.homeTeamIcon" alt="" />
          <div class="sport-zhongchao-match-game-content-team-name">{{ match.homeTeam }}</div>
        </div>
      </div>
      <div class="sport-zhongchao-match-game-content-item center">
        <div class="sport-zhongchao-vs">
          <img src="../../../../assets/promo/lh-sport-zhongchao/vs.png"/>
        </div>
        <div class="sport-zhongchao-match-game-content-center-time">
          {{ moment(match.matchTime).format("MM/DD HH:mm") }}
        </div>
<!--        <div class="sport-zhongchao-match-game-content-center-schedule">{{ match.title }}</div>-->
      </div>
      <div class="sport-zhongchao-match-game-content-item right">
        <div class="sport-zhongchao-match-game-content-team">
          <img :src="match.awayTeamIcon" alt="" />
          <div class="sport-zhongchao-match-game-content-team-name">{{ match.awayTeam }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";

defineProps(["match"]);

const getMatchStatusText = (status) => {
  switch (status) {
    case "ACTIVE":
      return " 进行中";
    case "ENDED":
      return " 已结束";
    case "SETTLED":
      return " 已结算";
  }
};
</script>
<style scoped lang="scss">
.sport-zhongchao-match-game {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  .sport-zhongchao-match-game-status {
    width: 120px;
    height: 24px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
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

.sport-zhongchao-match-game-content {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .sport-zhongchao-match-game-content-item {
    margin: 15px 0 15px;

    &.left,
    &.right {
      align-self: flex-end;
      flex:3;

      .sport-zhongchao-match-game-content-team {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .sport-zhongchao-match-game-content-team-name {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.6rem;
          margin-top: 12px;
        }

        img {
          max-width: 44px;
        }
      }
    }

    &.center {
      flex: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 600;

      .sport-zhongchao-match-game-content-center-time {
        color: #479af7;
        border-radius: 20px;
        padding: 4px 10px;
        background: #edf4ff;
        margin-top: 4px;
        text-align: center;
      }
      .sport-zhongchao-match-game-content-center-schedule {
        color: #1b1b1b99;
        margin-top: 12px;
      }
    }
  }
}
</style>

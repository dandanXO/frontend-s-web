<template>
  <div class="match-info-wrapper">
    <div class="match-info-title">
      <span v-if="match.status === 'ACTIVE'" class="match-info-title__status active">进行中</span>
      <span v-else class="match-info-title__status">已结束</span>
      <span class="match-info-tit__time">{{ match.matchTime }}</span>
    </div>
    <div class="match-info-content">
      <div class="match-info-content__team-wrapper">
        <div class="match-info-content__team-inner-wrapper">
          <img :src="match.teamOneIcon" />
          <span>{{ match.teamOne }}</span>
        </div>
        <span>VS</span>
        <div class="match-info-content__team-inner-wrapper">
          <img :src="match.teamTwoIcon" />
          <span>{{ match.teamTwo }}</span>
        </div>
      </div>
      <div class="match-info-content__match-title">{{ match.matchTitle }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  match: {
    type: Object,
    default: () => ({})
  }
});
</script>
<style scoped lang="scss">
.match-info-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  font-family: Microsoft YaHei UI;
  background-color: #b4dbff1a;
  overflow: hidden;

  .match-info-title {
    display: flex;
    justify-content: space-between;
    padding: 9px 45px 10px 37px;
    background-color: #ffffff1a;
    font-size: 32px;
    line-height: 42.56px;

    .match-info-title__status {
      font-weight: 700;
      color: #999999;

      &.active {
        color: #ffffff;
      }
    }

    .match-info-tit__time {
      color: #c4c6e9;
    }
  }

  .match-info-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 53px;
    padding: 28px 61px 50px 54px;
    color: #ffffff;

    .match-info-content__team-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .match-info-content__team-inner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          font-family: Microsoft YaHei UI;
          font-size: 32px;
          font-weight: 400;
          line-height: 42.56px;
          text-align: center;
        }
      }

      > span {
        font-family: Microsoft YaHei UI;
        font-size: 50px;
        font-weight: 700;
        line-height: 66.5px;
        text-align: center;
      }
    }

    .match-info-content__match-title {
      font-family: Microsoft YaHei UI;
      font-size: 32px;
      font-weight: 400;
      line-height: 42.56px;
      text-align: center;
      background-color: #99baff1a;
      padding: 4px 38px 12px 55px;
      border-radius: 29.5px;
    }
  }
}
</style>

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
    padding: 4px 30px 5px 25px;
    background-color: #ffffff1a;
    font-size: 1rem;
    line-height: 1.3rem;

    .match-info-title__status {
      font-weight: 700;
      color: #999999;

      &.active {
        color: #ffffff;
      }
    }

    .match-info-tit__time {
      color: #ffd9d0;
    }
  }

  .match-info-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    padding: 0px 16px 15px 16px;
    color: #ffffff;

    .match-info-content__team-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .match-info-content__team-inner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 75px;
          height: 75px;
        }

        span {
          font-family: Microsoft YaHei UI;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.3rem;
          text-align: center;
        }
      }

      > span {
        font-family: Microsoft YaHei UI;
        font-size: 1.875rem;
        font-weight: 700;
        line-height: 2.5rem;
        text-align: center;
      }
    }

    .match-info-content__match-title {
      font-family: Microsoft YaHei UI;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.3rem;
      text-align: center;
      background-color: #99baff1a;
      padding: 2px 0 6px 0;
      border-radius: 29.5px;
    }
  }
}
</style>

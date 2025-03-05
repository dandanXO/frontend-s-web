<template>
  <div class="current-livestream-wrapper">
    <div class="current-livestream__streamer-info-wrapper">
      <div class="current-livestream__streamer-info">
        <img src="@/assets/home/livestream/mock-2.png" />
        <span class="current-livestream__streamer-info__name">⭐️满满⭐</span>
        <div class="current-livestream__streamer-info__on-air">正在直播</div>
      </div>
    </div>

    <div class="current-livestream__match-info">
      <span class="current-livestream__match-info__team-name">莱顿东方</span>
      <div class="current-livestream__match-info__team-emblem">
        <img src="@/assets/home/livestream/mock.png" />
      </div>
      <div class="current-livestream__match-info__team-vs">VS</div>
      <div class="current-livestream__match-info__team-emblem">
        <img src="@/assets/home/livestream/mock.png" />
      </div>
      <span class="current-livestream__match-info__team-name">莱顿东方</span>
    </div>

    <button class="current-livestream__bet-btn">投一注</button>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.current-livestream-wrapper {
  @include livestream-content-block;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  .current-livestream__streamer-info-wrapper {
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    padding: 0 26px 0 40px;
    border-radius: 22px;
    box-shadow: 0px 1.89px 4.32px 0px #bbdcff inset, 0px -0.94px 3.46px 0px #a2bff4 inset;

    .current-livestream__streamer-info {
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      margin-left: -40px;

      img {
        max-width: 40px;
        display: block;
        margin-bottom: 3px;
      }
      .current-livestream__streamer-info__name {
        font-size: 15px;
        line-height: 21px;
        color: #7a80a1;
      }
      .current-livestream__streamer-info__on-air {
        @include livestream-on-air;
        position: absolute;
        bottom: -4px;
      }
    }
  }

  .current-livestream__match-info {
    display: flex;
    align-items: center;
    gap: 18px;
    .current-livestream__match-info__team-name {
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      color: #7a80a1;
    }
    .current-livestream__match-info__team-emblem {
      @include livestream-team-emblem;
    }
    .current-livestream__match-info__team-vs {
      padding: 0 8px;
      font-size: 16px;
      line-height: 23px;
      color: #3981ff;
    }
  }

  .current-livestream__bet-btn {
    background: linear-gradient(180deg, #1745ff 0%, #69fffa 100%);
    box-shadow: 0px -1.89px 4.32px 0px #b1d7ff inset, 0px -0.94px 3.46px 0px #5894ff inset;
    padding: 10px 45px;
    border-radius: 22px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    color: #fff;
  }
}
</style>

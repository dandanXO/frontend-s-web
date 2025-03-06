<template>
  <div class="livestream-list-wrapper">
    <div
      v-for="i in 10"
      :key="i"
      class="livestream-list-item"
      :class="{
        selected: i === 1
      }"
    >
      <div class="livestream-list-item__title">英格兰足总杯赛</div>
      <div class="livestream-list-item__match-info">
        <div class="livestream-list-item__match-info__team">
          <div class="livestream-list-item__match-info__team-emblem">
            <img src="@/assets/home/livestream/mock.png" />
          </div>
          <span class="livestream-list-item__match-info__team-name">莱顿东方</span>
        </div>

        <div class="livestream-list-item__match-info__date">
          <div v-if="i % 2 === 0" class="livestream-list-item__match-info__date__on-air">正在直播</div>
          <div v-else class="livestream-list-item__match-info__date__date">今日22:30</div>
          <span class="livestream-list-item__match-info__date__vs">VS</span>
        </div>

        <div class="livestream-list-item__match-info__team">
          <div class="livestream-list-item__match-info__team-emblem">
            <img src="@/assets/home/livestream/mock.png" />
          </div>
          <span class="livestream-list-item__match-info__team-name">莱顿东方</span>
        </div>
      </div>
      <div class="livestream-list-item__badge-wrapper">
        <div class="livestream-list-item__badge">
          <img src="@/assets/home/livestream/mock-2.png" />
          终于换我播曼城了
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  list: Array
});
</script>
<style lang="scss" scoped>
@import "@/scss/pages/livestream.scss";

.livestream-list-wrapper {
  display: flex;
  gap: 18.87px;
  padding: 18px;
  align-items: center;
  overflow: auto;
  margin: 0 -14px -8px -18px;

  .livestream-list-item {
    @include livestream-content-block;
    position: relative;
    flex: 0 0 calc(25% - 12.87px);
    padding: 11px 0;
    margin: 18px 0 0;
    cursor: pointer;

    &.selected {
      border: 2px solid #468cff;
      background: #468cff1a;
      &::after {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #468cff;
      }
    }

    .livestream-list-item__title {
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      text-align: center;
      color: #333333;
    }
    .livestream-list-item__match-info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .livestream-list-item__match-info__team {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        .livestream-list-item__match-info__team-emblem {
          @include livestream-team-emblem;
        }
        .livestream-list-item__match-info__team-name {
          font-size: 12px;
          line-height: 15px;
          color: #7a80a1;
        }
      }
    }

    .livestream-list-item__match-info__date {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      .livestream-list-item__match-info__date__on-air {
        @include livestream-on-air;
      }
      .livestream-list-item__match-info__date__date {
        font-size: 11px;
        line-height: 15px;
        color: #7a80a1;
      }
      .livestream-list-item__match-info__date__vs {
        font-size: 16px;
        line-height: 23px;
        color: #3981ff;
      }
    }

    .livestream-list-item__badge-wrapper {
      position: absolute;
      top: 4px;
      left: 14px;
      transform: translateY(-100%);
      background: linear-gradient(
        259.14deg,
        #ffecce 11.64%,
        #f3cd92 27.82%,
        #fff2ca 52.4%,
        #efd190 72.12%,
        #e4bd80 99.13%
      );
      border: 0.94px solid #d3aa69;
      border-radius: 8px;

      .livestream-list-item__badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 7px;
        margin-left: -7px;
        font-size: 11px;
        line-height: 15px;
        img {
          max-width: 22px;
        }
      }
    }
  }
}
</style>

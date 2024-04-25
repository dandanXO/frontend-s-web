<template>
  <div class="tab-title">
    {{ tabtitle }}
  </div>
  <div class="note">注：用户选定每组的参与队伍后不予更改；</div>
  <div class="fund-wrapper">
    <img :src="FundLogoImg" class="fund-logo" />
    <div class="fund-inner-wrapper">
      <div class="fund-status">
        <span class="fund-status__point-title">总积分</span>
        <div class="fund-status__point">6000</div>
        <div class="fund-contest-time-left">
          <img :src="FundIconTimeImg" />
          <span class="fund-contest-time-left__title">比赛剩余</span>
          <span class="fund-contest-time-left__content">1天5小时</span>
        </div>
      </div>
      <div class="fund-divider" />
      <div class="fund-progress-wrapper">
        <div class="fund-progress-ranking-wrapper">
          <div />
          <img v-for="(img, index) in fundRankingList" :key="`ranking-icon-${index}`" :src="img" />
        </div>
        <el-progress
          :percentage="10"
          class="fund-progress-bar"
          :show-text="false"
          color=" linear-gradient(180deg, #00D1FF 0%, #0D70D6 100%)"
        />
        <div class="fund-progress-ranking-wrapper">
          <div class="ranking-0">0</div>
          <div v-for="num in 6" :key="`ranking-text-${num}`" :class="`ranking-${num}`">
            {{ num }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bracket-list-wrapper">
    <div class="bracket-wrapper">
      <div class="bracket-team-select">
        <bracket-team :img-url="FlagImg" country="德国" />
        <button class="bracket-team-select__button">选择</button>
      </div>
      <div class="bracket-info">
        <div class="bracket-info__status">进行中</div>
        <div class="bracket-info__info-wrapper">
          <div class="bracket-info__info-wrapper-date">6月15日 上午3:00</div>
          <div class="bracket-info__info-wrapper-contest">欧洲杯 半决赛</div>
        </div>
      </div>
      <div class="bracket-team-select">
        <bracket-team :img-url="FlagImg" country="德国" />
        <button class="bracket-team-select__button">选择</button>
      </div>
    </div>
    <div class="bracket-wrapper">
      <div class="bracket-team-select">
        <bracket-team :img-url="FlagImg" country="德国" />
        <button v-if="false" class="bracket-team-select__button">选择</button>
      </div>
      <div class="bracket-info">
        <div class="bracket-info__status">进行中</div>
        <div class="bracket-info__info-wrapper">
          <div class="bracket-info__info-wrapper-date">6月15日 上午3:00</div>
          <div class="bracket-info__info-wrapper-contest">欧洲杯 半决赛</div>
        </div>
      </div>
      <div class="bracket-team-select">
        <bracket-team :img-url="FlagImg" country="德国" />
        <button class="bracket-team-select__button active">已选</button>
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
</template>

<script setup>
import { defineProps, ref } from "vue";
import FlagImg from "@/components/hotpromo/europe-2024/images/flag.png";
import FundLogoImg from "@/components/hotpromo/europe-2024/images/daily-fund-logo.png";
import FundIconTimeImg from "@/components/hotpromo/europe-2024/images/daily-fund-icon-time.svg";
import FundRankingImg1 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-1.png";
import FundRankingImg2 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-2.png";
import FundRankingImg3 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-3.png";
import FundRankingImg4 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-4.png";
import FundRankingImg5 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-5.png";
import FundRankingImg6 from "@/components/hotpromo/europe-2024/images/daily-fund-ranking-6.png";
import BracketTeam from "./components/BracketTeam.vue";

const props = defineProps({
  tabtitle: String
});

const fundRankingList = ref([
  FundRankingImg1,
  FundRankingImg2,
  FundRankingImg3,
  FundRankingImg4,
  FundRankingImg5,
  FundRankingImg6
]);
</script>
<style scoped lang="scss">
$ranking-list: 36px, 49px, 50px, 59px, 85px, 129px;

@for $i from 1 through length($ranking-list) {
  .ranking-#{$i} {
    width: nth($ranking-list, $i);
    text-align: center;
  }
}

.ranking-0 {
  width: 0;
}

.fund-alert {
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

  .fund-logo {
    position: absolute;
    top: 0;
    left: -54px;
  }

  .fund-inner-wrapper {
    background-color: #143cda66;
    padding: 35px 28px 35px 192px;
    display: flex;
    gap: 35px;
    border-radius: 28px;
    margin-bottom: 43px;
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
        align-items: end;
        width: 100%;

        &:last-child {
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
      }
    }
  }
}
</style>

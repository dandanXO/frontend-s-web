<template>
  <div>
    <div class="ppdianzi">
      <q-tabs
        v-model="tabPosition"
        dense
        class="text-grey wrapcontent"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="first" label="天降幸运轮" />
        <q-tab name="sec" label="老虎机锦标赛" />
      </q-tabs>
      <q-tab-panels v-model="tabPosition" class="ppdianzi-tabs">
        <q-tab-panel name="first" label="精英召唤">
                    <div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title">
              <div class="ribbon">活动时间</div>
              <div class="right">2025年6月30日 - 2025年7月27日</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动内容</div>
              <div class="right">
                每周天降: <span class="blue">¥370,080</span>
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <thead>
                <tr>
                  <th>奖品</th>
                  <th>投注乘数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10</td>
                  <td>x100 投注乘数</td>
                </tr>
                <tr>
                  <td>70</td>
                  <td>x50 投注乘数</td>
                </tr>
                <tr>
                  <td>200</td>
                  <td>x20 投注乘数</td>
                </tr>
                <tr>
                  <td>720</td>
                  <td>x10 投注乘数</td>
                </tr>
                <tr>
                  <td>3,300</td>
                  <td>x8 投注乘数</td>
                </tr>
                <tr>
                  <td>8,700</td>
                  <td>x5 投注乘数</td>
                </tr>
                <tr>
                  <td>12,000</td>
                  <td>10次免费旋转</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                100,000名幸运玩家将于2025年6月30日00:00至2025年7月27日23:59(GMT+8)期间赢取总价值¥1,480,320元的奖金。
                </div>
                <div class="item">
                  <div class="item-num">2</div>
                  天降幸运轮自星期一 00:00至星期日 23:59 (GMT+8) 促销活动期间每周进行，共有25,000份奖励， 每周奖金池为¥370,080元。
                </div>
                <div class="item">
                  <div class="item-num">3</div>
                  为符合获得奖励的资格，玩家必须收集全部3个幸运轮拼图才能转动幸运轮。
                </div>
                <div class="item">
                  <div class="item-num">4</div>
                  任何投注可随机触发幸运轮拼图，每次仅会有一个奖励。收集第一个幸运轮拼图后，您将有资格收集之后的拼图，直至取得全部三个。
                </div>
                <div class="item">
                  <div class="item-num">5</div>
                  完成幸运轮后，您可以点击开始旋转，屏幕上将出现一个全屏垂直转盘以揭晓您的奖励。
                </div>
                <div class="item">
                  <div class="item-num">6</div>
                  奖励将以投注乘数或免费旋转的形式发放。<br />
                  • 投注乘数将根据您中奖时的投注额计算（所获得的倍数 × 投注额），且用于计算奖金的投注额将设有 ¥1.8 的上限<br />
                  • 免费旋转将以十(10)次免费旋转的形式发放，仅适用于中奖的同一款游戏，投注额与中奖时相同。若中奖时的投注额超过 ¥1.8，每次免费旋转将按 ¥1.8 的金额进行计算。
                </div>
                <div class="item">
                  <div class="item-num">7</div>
                  玩家可以选择立即使用或稍后使用免费旋转奖励。免费旋转自发放日起有效期为3天，逾期将失效。
                </div>
                <div class="item">
                  <div class="item-num">8</div>
                  合格游戏：除、财源滚滚、爱尔兰的魅力、永恒钻石3线、麻将大胜2、娱乐场大劫案 Megaways™、笑口迎财、麻将X、宝石、超人狂热、巴厘之龙、赛亚狂热、圣诞火花、极速悟空、黄金老矿工Megaways™、百搭超人星际战士、甜入心扉骰子、小丑珠宝骰子、汪汪之家骰子秀、奥林匹斯之门骰子、极速糖果骰子、野狼黄金骰子、金银闪电骰子、罗马帝国、黄金弓箭手、奥林匹斯之门帕奇、麻将大胜 – 恭喜发财、奥林匹斯之门1000骰子、甜入心扉 1000 骰子、疯狂大鲈鱼骰子、水果派对骰子、樱花盛开、麻将大胜3 – 黑金龙耀、绝地战场零式, 史莱姆泡泡、桌面游戏视频扑克和刮刮卡之外的所有PP王者电子游戏。
                </div>
                <div class="item">
                  <div class="item-num">9</div>
                  所赢得的奖励以现金形式提供且无需有投注要求。
                </div>
                <div class="item">
                  <div class="item-num">10</div>
                  您可于促销活动界面，实时追踪收集幸运轮拼图的情况。
                </div>
                <div class="item">
                  <div class="item-num">11</div>
                  每个每周天降幸运轮期间，每位玩家最多能赢得2份奖项。
                </div>
                <div class="item">
                  <div class="item-num">12</div>
                  本次活动不设最低投注额。
                </div>
                <div class="item">
                  <div class="item-num">13</div>
                  雷火电竞保留彻底审查玩家活动以识别任何潜在滥用行为的权利，以确保我们的网络推广活动公平进行。如果发现任何滥用行为，雷火电竞保留没收支付给获胜玩家的任何金额的权利。
                </div>
                <div class="item">
                  <div class="item-num">14</div>
                  雷火电竞保留随时修改，取消，停止活动而不做另行通知的权利。
                </div>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="sec" label="唤醒圣堂">
<div class="livepoker-rebate-game-info section-bg">
            <div class="title-img">活动详情</div>
            <div class="little-title">
              <div class="ribbon">活动时间</div>
              <div class="right">2025年6月30日起</div>
            </div>
            <div class="little-title">
              <div class="ribbon">活动内容</div>
              <div class="right">
                每日锦标赛 - 单次旋转最大奖金 <span class="blue">¥15,840</span> (按注码调整)
              </div>
            </div>
            <table class="livepoker-rebate-game-info-table section-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>奖金倍数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>x1000</td>
                </tr>
                <tr>
                  <td>2-5</td>
                  <td>x200</td>
                </tr>
                <tr>
                  <td>6-20</td>
                  <td>x80</td>
                </tr>
                <tr>
                  <td>21-200</td>
                  <td>x10</td>
                </tr>
                <tr>
                  <td>201-1000</td>
                  <td>x5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="livepoker-rebate-game-bottom-rule section-bg">
            <div class="title-img">活动规则</div>
            <br />
            <div class="content">
              <div class="item">
                <div class="item-num">1</div>
                第四级28,000名幸运玩家将于2025年6月30日20:00至2025年7月28日02:00(GMT+8)期间赢取总价值¥443,520元的奖金。
                </div>
                <div class="item">
                  <div class="item-num">2</div>
                  每日锦标赛活动于20:00至02:00(GMT+8)进行，每天有1,000个奖项，总价值¥ 15,840 元。活动期间总共有28场锦标赛。
                </div>
                <div class="item">
                  <div class="item-num">3</div>
                  锦标赛获胜者基于单次旋转最大奖金（按注码调整）。
                </div>
                <div class="item">
                  <div class="item-num">4</div>
                  
                <div style="display: flex; flex-direction: column">
                  得分 =（比赛中单次旋转最大获胜金额）/（比赛中投注额）* 100
                  <span>参考计算：</span>
                  <div class="hint">玩家 1：下注 1美元 -> 赢取 50美元（分数 = 50美元 / 1美元 * 100 = 5,000）</div>
                  <div class="hint">玩家 2：下注 1 美元 -> 赢得 5 美元（分数 = 5 美元 / 1 美元 * 100 = 500）</div>
                </div>
                  
                  
                  
                </div>
                <div class="item">
                  <div class="item-num">5</div>
                  本次活动不设最低投注额。
                </div>
                <div class="item">
                  <div class="item-num">6</div>
                  玩家将依照奖金列表，依玩家下注金额获胜的乘数赢得奖金。
                </div>
                <div class="item">
                  <div class="item-num">7</div>
                  若获胜旋转超过 ¥1.8，奖金将根据赌注的¥1.8 X 乘数支付。
                </div>
                <div class="item">
                  <div class="item-num">8</div>
                  合格游戏：除、财源滚滚、爱尔兰的魅力、永恒钻石3线、麻将大胜2、娱乐场大劫案 Megaways™、笑口迎财、麻将X、宝石、超人狂热、巴厘之龙、赛亚狂热、圣诞火花、极速悟空、黄金老矿工Megaways™、百搭超人星际战士、甜入心扉骰子、小丑珠宝骰子, 、汪汪之家骰子秀、奥林匹斯之门骰子、极速糖果骰子、野狼黄金骰子、金银闪电骰子、罗马帝国、黄金弓箭手、奥林匹斯之门帕奇、麻将大胜 – 恭喜发财、奥林匹斯之门1000骰子、甜入心扉 1000 骰子、疯狂大鲈鱼骰子、水果派对骰子、樱花盛开、麻将大胜3 – 黑金龙耀、绝地战场零式, 史莱姆泡泡、桌面游戏视频扑克和刮刮卡之外的所有PP王者电子游戏。
                </div>
                <div class="item">
                  <div class="item-num">9</div>
                  如果在排行榜上有2名以上玩家有相同的积分时，首先在排行榜取得高分的玩家为排名较高的赢家。
                </div>
                <div class="item">
                  <div class="item-num">10</div>
                  锦标赛排行榜内置于游戏内并且随时更新排名。
                </div>
                <div class="item">
                  <div class="item-num">11</div>
                  雷火电竞保留彻底审查玩家活动以识别任何潜在滥用行为的权利，以确保我们的网络推广活动公平进行。如果发现任何滥用行为，雷火电竞保留没收支付给获胜玩家的任何金额的权利。
                </div>
                <div class="item">
                  <div class="item-num">12</div>
                  雷火电竞保留随时修改，取消，停止 活动而不做另行通知的权利。
                </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { eventapi } from "src/boot/axios";
import { useQuasar} from "quasar";
import { useRouter } from "vue-router";
import { useNotify } from 'src/hooks/notify';

const notify = useNotify();
const router= useRouter();
const $q = useQuasar();
var qs = require("qs");
const tabPosition = ref('first')
const props = defineProps(["promoCode"]);

onMounted(() => {

})
</script>
<style lang="scss">
.body--dark {
  .ppdianzi {
    .q-tabs{
      margin-bottom: 16px;
      height: auto !important;
      &__content {
        gap: 10px;
      }
    }
    .q-tabs .q-tab {
      background: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg.png) no-repeat center center;
      width: 150px;
      height: 69px;
      background-size: contain;
      color: #95979A !important;
      font-size: 30px;
      font-weight: 600;
      line-height: 42px;
      text-align: center;
      padding: 0;
      .q-focus-helper {
        display: none !important;
      }
      // opacity: .6;

      &--active {
        opacity: 1;
        background-image: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg-active.png);
        color: #ffffff;
        .q-tab__label {
          color: #ffffff !important;
        }
        .q-tab__indicator {
          display: none !important;
        }
      }
      .q-ripple {
        display: none;
      }
    }
  }
  .ppdianzi-modal {
    .q-table {
      th {

        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
        color: #fff;
        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }
      td {
        color: #7A8EB9;
        background: #ffffff;
        border: 1px solid #ECEDF0;
      }
    }
  }
}
.ppdianzi {
  .q-tabs{
    background-color: unset !important;
    margin-bottom: 16px;
    height: auto !important;
  }
  .q-tabs .q-tab {
    background: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg.png) no-repeat center center;
    width: 180px;
    height: 69px;
    background-size: contain;
    color: #ffffff !important;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    opacity: .6;

    &--active {
      opacity: 1;
      .q-tab__label {
        color: #ffffff !important;
      }
      .q-tab__indicator {
        display: none !important;
      }
    }
    .q-ripple {
      display: none;
    }
  }
}
.ppdianzi-modal {
  .q-table {
    th {

      background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
      color: #fff;
      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }
    td {
      color: #7A8EB9;
      background: #ffffff;
      border: 1px solid #ECEDF0;
    }
  }
}
</style>
<style scoped lang="scss">
.body--dark {
  .ppdianzi {
    margin: 0 auto;
    max-width: 1380px;
  }

  .ppdianzi-tabs {
    :deep(.el-tabs__nav) {
      float: none;
      justify-content: space-between;
    }

    :deep(.el-tabs__nav-wrap:after) {
      display: none;
    }

    :deep(.el-tabs__active-bar) {
      display: none;
    }

    table {
      width: 100%;

      tr {
        background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%) !important;
      }

      td,
      th {
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        text-align: center;
        padding: 20px;
      }

      th {
        background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%) !important;
        color: white !important;

        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }

      td {
        color:  #ffffff;
        background: #2D4065 !important;
        border: 1px solid #ECEDF0;
      }
    }

    .summon-btn {
      margin: 10px auto;
      width: 200px;
      display: block;
      cursor: pointer;

      &:hover{
        opacity: 0.9;
      }
      &:active{
        filter:brightness(0.85);
      }

      img {
        width: 100%;
        max-width: 200px;
        display: block;
      }
    }

    .findfriend {
      margin: 0 auto;
      width: 200px;
      cursor: pointer;

      img {
        width: 100%;
      }
    }

    .rules {
      width: 100%;

      p {
        text-align: left;
        padding: 0px 4px;
        margin-bottom: 10px;
        color: white;
        font-size: 16px;

        img {
          margin: 20px auto;
          display: block;
        }
      }
    }
  }

  .main-desc {
    color: white;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin: 15px auto;
    text-align: center;
  }

  .sub-desc {
    color: white;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin: 15px auto;
    text-align: center;

  }
}
.ppdianzi {
  margin: 0 auto;
  max-width: 1380px;
}

.ppdianzi-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: space-between;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  table {
    width: 100%;

    td,
    th {
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      text-align: center;
      padding: 0px;
    }

    th {
      background: #E7F3FF;
      color: #424F72;
      height: unset !important;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }

    // td {
    //   color: #7A8EB9;
    //   background: #ffffff;
    //   border: 1px solid #ECEDF0;
    // }
  }

  .summon-btn {
    margin: 10px auto;
    width: 200px;
    display: block;
    cursor: pointer;

    &:hover{
      opacity: 0.9;
    }
    &:active{
      filter:brightness(0.85);
    }

    img {
      width: 100%;
      max-width: 200px;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 200px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 0px 4px;
      margin-bottom: 10px;
      color: #7a8eb9;
      font-size: 16px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: #7A8EB9;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin: 15px auto;
  text-align: center;
}

.sub-desc {
  color: #7A8EB9;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin: 15px auto;
  text-align: center;

}


.livepoker-rebate-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  // border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
}

.livepoker-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .livepoker-rebate-game-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff5d5d !important;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}

.livepoker-rebate-game-info {
  width: 100%;
  height: 100%;
  // margin-top: 40px;
  // background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/ppdianzi/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/ppdianzi/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 64px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
      // color: #000000;
      
      span.blue {
        color: #0085E8;
      }
    }
  }
}

.livepoker-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 36px;
    font-size: 12px;
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
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    background: transparent;
    border: 1px solid #acd4f6;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  // background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
    overflow-x: hidden;
  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/ppdianzi/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 20px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    // color: #000000;
    padding: 8px;
    .item {
      display: flex;
      gap: 10px;
      align-items: baseline;
      padding: 0;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(90deg, #41B9FF 8.15%, #0085E8 92.42%);

        // background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        // font-size: 12px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff0000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

</style>

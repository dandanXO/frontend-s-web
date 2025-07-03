<template>
  <div>
    <div class="ppdianzi">
      <el-tabs v-model="tabPosition" class="ppdianzi-tabs">
        <el-tab-pane name="first" label="天降幸运轮">
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
        </el-tab-pane>
        <el-tab-pane name="sec" label="老虎机锦标赛">
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
                  <div class="hint">玩家 1：下注 1 元 -> 赢取 50 元（分数 = 50 元 / 1 元 * 100 = 5,000）</div>
                  <div class="hint">玩家 2：下注 1 元 -> 赢得 5 元（分数 = 5 元 / 1 元 * 100 = 500）</div>
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
          
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog modal-class="ppdianzi-modal" align-center v-model="isShowFriendDialog">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="summonName" label="被唤醒会员账号" />
        <el-table-column prop="dayCount" label="连续存款天数" />
        <el-table-column prop="memberBonus" label="彩金金额" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
const tabPosition = ref("first");
const tableData = ref([]);
const page = reactive({
  current: 1,
  size: 20
});
const props = defineProps(["promoCode"]);

onMounted(() => {});
</script>
<style scoped lang="scss">
.dark {
  .ppdianzi {
  margin: 0 auto;
  max-width: 1380px;
}

.ppdianzi-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: center;
    gap: 100px;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    background: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg.png) no-repeat center center;
    width: 250px;
    height: 95px;
    background-size: contain;
    color: #95979A;
    font-family: PingFang SC;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    // opacity: 0.6;

    &.is-active {
      opacity: 1;
      background-image: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg-active.png);
      color: #ffffff;
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  table {
    width: 100%;

    tr {
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
    }

    td,
    th {
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: center;
      padding: 20px;
    }

    th {
      background: unset;
      color: white;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }

    td {
      color: white;
      background: #2D4065;
      border: 1px solid #ecedf0;
    }
  }

  .summon-btn {
    margin: 30px auto;
    width: 320px;
    display: block;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 300px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 20px;
      color: white;
      font-size: 20px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: white;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}

.sub-desc {
  color: white;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}
:deep(.ppdianzi-modal .el-dialog__body) {
  padding: 0;
  border-radius: 10px;
}
:deep(.ppdianzi-modal .el-dialog__header .el-dialog__headerbtn .el-dialog__close) {
  z-index: 99;
}
:deep(.el-dialog) {
  table {
    background: transparent;
    tr {
      th,
      td {
        text-align: center;
      }
      th {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #fff;
        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }
      td {
        color: #7a8eb9;
        background: #ffffff;
        border: 1px solid #ecedf0;
      }
      &:last-child {
        td {
          &:first-child {
            border-radius: 0 0 0 10px;
          }

          &:last-child {
            border-radius: 0 0 10px 0;
          }
        }
      }
    }
  }
}
}
.ppdianzi {
  margin: 0 auto;
  max-width: 1380px;
}

.ppdianzi-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: center;
    gap: 100px;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    background: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg.png) no-repeat center center;
    width: 250px;
    height: 95px;
    background-size: contain;
    color: #95979A;
    font-family: PingFang SC;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    // opacity: 0.6;

    &.is-active {
      opacity: 1;
       background-image: url(../../../assets/images/promotion/hotpromo/ppdianzi/tabbg-active.png);
      color: #ffffff;
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  .summon-btn {
    margin: 30px auto;
    width: 320px;
    display: block;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 300px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 20px;
      color: #7a8eb9;
      font-size: 20px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: #7a8eb9;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}

.sub-desc {
  color: #7a8eb9;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}
:deep(.ppdianzi-modal .el-dialog__body) {
  padding: 0;
  border-radius: 10px;
}
:deep(.ppdianzi-modal .el-dialog__header .el-dialog__headerbtn .el-dialog__close) {
  z-index: 99;
}
:deep(.el-dialog) {
  table {
    background: transparent;
    tr {
      th,
      td {
        text-align: center;
      }
      th {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #fff;
        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }
      td {
        color: #7a8eb9;
        background: #ffffff;
        border: 1px solid #ecedf0;
      }
      &:last-child {
        td {
          &:first-child {
            border-radius: 0 0 0 10px;
          }

          &:last-child {
            border-radius: 0 0 10px 0;
          }
        }
      }
    }
  }
}
.livepoker-rebate-wrapper {
  display: flex;
  justify-content: center;
}
.livepoker-rebate-container {
  width: 1200px;
  height: 100%;
}

.livepoker-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 30px 40px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  background: url("@/assets/promo/lh-livepoker-rebate/section-bg.png");
  background-size: 100% 100%;

  .livepoker-rebate-section-left {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: flex-start;
    gap: 25px;
  }

  .livepoker-rebate-section-right {
    margin-top: auto;
    margin-bottom: auto;
    width: 220px;

    .bonus-image {
      cursor: pointer;
      width: 100%;

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        transform: translate(0px, 1px);
        opacity: 0.9;
      }

      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .livepoker-rebate-section-title {
    color: #000000;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }
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
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #ff3333;
  }
  .livepoker-rebate-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #ff3333;
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
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  // align-items: center;
  gap: 20px;

  .title {
    background-image: url("@/assets/promo/lh-livepoker-rebate/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin: 0 auto 8px;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("@/assets/promo/lh-livepoker-rebate/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
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
  table-layout: fixed;
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
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}

.livepoker-rebate-game-bottom-rule {
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
    background-image: url("@/assets/promo/lh-livepoker-rebate/rule-title.png");
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
      padding-left: 24px;
      display: flex;
      gap: 10px;

      .item-num {
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        border-radius: 50%;
        height: 28px !important;
        width: 28px !important;
        min-width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        // font-size: 18px;
        font-weight: 400;
        line-height: 22.4px;
        color: #ff3333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.dark {
  .livepoker-rebate-section,
  .livepoker-rebate-game-info,
  .livepoker-rebate-game-bottom-rule {
    position: relative;
    background: linear-gradient(180deg, #2d3f64 0%, #232a36 100%);
    border: none;
  }

  .livepoker-rebate-section::before,
  .livepoker-rebate-game-info::before,
  .livepoker-rebate-game-bottom-rule::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(170deg, #be9457 1.91%, rgba(190, 148, 87, 0) 33.82%);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .livepoker-rebate-section {
    .livepoker-rebate-section-title {
      color: #fff;
    }
    .reward-info-content {
      color: #fff;
    }
  }

  .livepoker-rebate-game-info {
    .left {
      // background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-little-title-bg.png");
    }
    .right {
      color: #fff;
      span.blue {
        color: #2899ef;
      }
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-bottom-rule {
    .item {
      color: #fff;
    }
    .title {
      background-image: url("../../../assets/promo/lh-livepoker-rebate/dark-info-title.png");
    }
  }

  .livepoker-rebate-game-info-table {
    th {
      // background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    }
    td {
      color: white;
    }
  }
}

</style>

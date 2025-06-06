<template>
  <div class="fish-match-box">
    <div class="fish-match-container">
      <div class="fish-match-game-info-sub">
        活动期间，每日参与捕鱼场馆有效投注≥1,000 元或以上，即可点击开启红包，有效投注越高抢红包次数越多，单个金额越高，最高奖金 1,888 元
      </div>

      <div class="fish-match-game">
        <div class="fish-match-content-warp">
          <div class="fish-match-game-content">
            <div class="fish-match-game-status">今日打码</div>
            <div class="fish-match-game-detail">{{ validBet }} 元</div>
          </div>
          <div class="fish-match-game-content">
            <div class="fish-match-game-status">抽奖次数</div>
            <div class="fish-match-game-detail">{{ availableDraw }} 次</div>
          </div>
        </div>
        <div class="fish-match-honbao-content">
          <img class="fish-1" :src="require(`../../../assets/promo/lh-fish-honbao/fish-1.png`)" />
          <div class="hongbao-1">
            <img
              style="width: 266px; height: 280px"
              :src="require(`../../../assets/promo/lh-fish-honbao/hongbao.png`)"
            />
            <div class="fish-open-hongbao" @click="claimHongBao">立即开启</div>
          </div>
          <img class="fish-2" :src="require(`../../../assets/promo/lh-fish-honbao/fish-2.png`)" />
        </div>
      </div>
      <div class="fish-match-game-bottom">
        <div class="fish-match-game-bottom-left-title">注：今日打码每 15 分钟更新一次</div>
        <!-- <div class="fish-match-game-bottom-left-btn" @click="tableRecordDialog = true">[投票记录]</div> -->
      </div>
      <div class="fish-match-game-info">
        <div class="title"></div>
        <!--        <div class="fish-match-game-info-sub">-->
        <!--          活动期间，用户投注 NBA 季后赛总决赛当日有效投注≥1,000-->
        <!--          元后参与本活动竞猜，根据竞猜结果派发对应彩金。每日最高可获 1,888 元。-->
        <!--        </div>-->
        <table class="fish-match-game-info-table">
          <tr>
            <th>捕鱼机日总有效投注</th>
            <th>当日可得抽奖次数</th>
            <th>随机奖金</th>
          </tr>
          <tr>
            <td>1,000</td>
            <td>1</td>
            <td>3~8</td>
          </tr>
          <tr>
            <td>5,000</td>
            <td>2</td>
            <td>8~38</td>
          </tr>
          <tr>
            <td>12,000</td>
            <td>3</td>
            <td>28~88</td>
          </tr>
          <tr>
            <td>30,000</td>
            <td>4</td>
            <td>58~188</td>
          </tr>
          <tr>
            <td>50,000</td>
            <td>5</td>
            <td>188~288</td>
          </tr>
          <tr>
            <td>100,000</td>
            <td>6</td>
            <td>288~888</td>
          </tr>
          <tr>
            <td>500,000</td>
            <td>7</td>
            <td>888~1,888</td>
          </tr>
        </table>
        <div class="fish-match-game-info-sub">
          用户 A 当日在捕鱼场馆总有效投注金额为 5,000，用户 A 可获得对应 1,000 档位 1 次、5,000 档位一次，共 2 次红包抽奖，彩金只需完成 3 倍流水即可出款；
        </div>
      </div>
      <div class="fish-match-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            1.活动期间，用户参与捕鱼场馆日总有效投注≥1,000 元即可获得对应档位抽奖次数，抽奖红包金额每个档位按顺序进行抽取 1 次，彩金只需完成 3 倍流水即可出款
          </div>
          <div class="item">
            2.活动期间，捕鱼场馆总有效投注没 20 分钟刷新一次，若出现与会员总有效投注不符合的情况，请耐心等待 20
            分钟即可，若仍未正确，请联系客服查询；
          </div>
          <div class="item">
            3.符合条件的会员请在当日点击活动页面【点击开启】按钮，次日累计抽奖次数清零，若超时未点击则视为放弃；
          </div>
          <div class="item">
            4.本活动根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </div>
          <div class="item">
            5.本活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
            地址视为同一账户，若有违规者，将不享受此红利；
          </div>
          <div class="item">6.为避免文字理解差异，雷火电竟保留此活动最终解释权；</div>
        </div>
      </div>
      <q-dialog v-model="tableRecordDialog" persistent class="fish-match-table-record-dialog">
        <q-card class="confirm-vote-card">
          <div class="fish-img"><img src="../../../assets/promo/lh-fish-honbao/fish-dialog.png" /></div>
          <div class="title">恭喜你抽中</div>
          <div class="close-btn" @click="tableRecordDialog = false"></div>
          <div class="record-dialog-container">
            <div class="record-dialog-content-title">恭喜您获得以下奖金</div>
            <div class="record-dialog-content-detail">
              <span>{{ rewardMoney }}</span>
              元
            </div>
            <div @click="tableRecordDialog = false" class="hongbao-finish-btn">完成</div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { getHongbaoInfo, getHongbaoMoney } from "../../../api/promotion/fishHongbao";

import { useLocalStorage } from "@vueuse/core";

import { useQuasar } from "quasar";
import { userStore } from "src/stores/index";
import { useRouter } from "vue-router";
const router = useRouter();

const store = userStore();
const availableDraw = ref(0);
const validBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);
const $q = useQuasar();

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const getHongbao = async () => {
  const res = await getHongbaoInfo();
  console.log(res);
  if (res.code === 0) {
    availableDraw.value = res.data.availableDraw;
    validBet.value = res.data.validBet;
  }
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  getHongbao();
});

const claimHongBao = async () => {
  if (!store.token) {
    $q.dialog({
      class: "q-px-md q-pt-md",
      title: "系统提示",
      message: "请登录后再操作",
      ok: {
        push: true,
        color: "primary",
        label: "去登录",
        tabindex: 1
      },
      cancel: {
        push: true,
        color: "warning",
        label: "取消",
        tabindex: 0
      },
      persistent: true
    }).onOk(() => {
      router.push("/login");
    });
    return;
  }
  const res = await getHongbaoMoney();
  console.log(res);
  if (res.code === 0) {
    tableRecordDialog.value = true;
    rewardMoney.value = res.data;
  }
};
</script>

<style scoped lang="scss">
.body--dark {
  .fish-match-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .fish-match-container {
    width: 100%;
    height: 100%;
  }

  .fish-match-game {
    width: 100%;
    height: 335px;
    border-radius: 12px;
    border: 1px solid #51acff;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    position: relative;
    margin-bottom: 12px;
    .fish-match-content-warp {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
    }
    .fish-match-game-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: auto;
      max-height: 60px;
      margin-top: 12px;
    }
    .fish-match-game-status {
      width: 68px;
      height: 24px;
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
      font-size: 10px;
      font-weight: 500;
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .fish-match-game-detail {
      width: 158px;
      height: 32px;
      background: rgba(81, 172, 255, 0.3);
      border: 1px solid #51acff;
      font-size: 14px;
      font-weight: 500;
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #479af7;
      border-radius: 8px;
    }
  }
  .fish-match-honbao-content {
    max-height: 288px;
    display: flex;
    justify-content: center;
    bottom: 10px;
    flex-direction: row;
    position: relative;
    .fish-1 {
      width: 138px !important;
      height: 152px !important;
      position: relative;
      margin-top: 80px;
    }
    .hongbao-1 {
      margin-left: -85px;
      position: relative;
      width: 220px !important;
      height: 240px !important;
      .fish-open-hongbao {
        background-image: url("../../../assets/promo/lh-fish-honbao/hongbao-open-btn.png");
        background-size: cover;
        width: 120px;
        height: 32px;
        border-radius: 12px;
        position: absolute;
        bottom: 2%;
        right: 18%;
        color: #f22a00;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        line-height: 22.4px;
        text-align: left;
      }
      .fish-open-hongbao:hover {
        opacity: 0.8;
      }
      .fish-open-hongbao:active {
        filter: brightness(0.8);
        transform: translate(0px, 1px);
      }
    }
    .fish-2 {
      margin-left: -58px;
      margin-top: 80px;
      width: 156px !important;
      height: 138px !important;
    }
  }
  .fish-match-game-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: end;
    padding-bottom: 16px;

    .fish-match-game-content-left,
    .fish-match-game-content-right {
      flex: 1;
      .fish-match-game-content-team-img {
        width: 44px !important;
        height: 44px;
      }
      .fish-match-game-content-team {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .fish-match-game-content-team-name {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1rem;
          margin-top: 4px;
          margin-bottom: 12px;
        }
      }
    }
    .fish-match-game-content-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;

      .fish-match-game-content-center-time {
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1rem;
        color: #479af7;
        border-radius: 30px;
        padding: 4px 10px;
        background: #edf4ff;
        margin-bottom: 15px;
      }
      .fish-match-game-content-center-schedule {
        font-size: 12px;
        font-weight: 600;
        line-height: 1rem;
        color: #1b1b1b99;
        margin-bottom: 12px;
      }
    }
  }

  .fish-match-game-content-btn {
    font-size: 12px;
    font-weight: 500;
    line-height: 16.8px;
    color: #00000066;
    background-image: url("../../../assets/promo/lh-nba24-match/btn.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 72px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .nba2-match-game-content-btn__pseudo {
    height: 24px;
  }

  .fish-match-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .fish-match-game-bottom-left-title {
      font-size: 12px;
      font-weight: 500;
      line-height: 16.8px;
      color: white;
      width: calc(100% - 61px);
    }
    .fish-match-game-bottom-left-btn {
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      color: #479af7;
      cursor: pointer;
      width: 61px;
      margin-left: 24px;
    }
  }

  .fish-match-game-info {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border-radius: 12px;
    padding: 16px 16px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      background-image: url("../../../assets/promo/lh-nba24-match/info-title-black.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 335px;
      height: 20px;
      margin-bottom: 16px;
    }
    .little-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .right {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: white;
      }
    }
  }

  .fish-match-game-info-table {
    width: 100%;
    height: 100%;
    border-collapse: separate !important;
    border-spacing: 0;
    text-align: center;
    vertical-align: middle;
    margin: 12px 0;
    th {
      height: 32px;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #fff !important;
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
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
      &:nth-child(8) {
        td {
          &:last-child {
            border-bottom-right-radius: 12px;
          }
        }
      }
    }
    td {
      border: 1px solid #acd4f6 !important;
      height: 32px;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: white;
      background-color: #2D4065 !important;
    }
  }

  .fish-match-game-info-sub {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -0.02em;
    text-align: left;
  }
  .fish-match-game-bottom-rule {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border-radius: 12px;
    padding: 16px 0px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      background-image: url("../../../assets/promo/lh-nba24-match/rule-title-black.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 335px;
      height: 20px;
      margin-bottom: 16px;
    }
    .content {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: white;
      .item {
        text-indent: -11px;
        padding-left: 24px;
        padding-right: 8px;
      }
    }
  }

  .fish-match-table-record-dialog {
    position: relative;
    .fish-img {
      position: absolute;
      left: 0;
      right: 0;
      top: -108px;
      margin: auto;
      width: 100%;
      text-align: center;
    }
    .confirm-vote-card {
      width: 360px;
      height: 320px;
      background-color: #fff3df;
      position: relative;
      border-radius: 20px;
      overflow: unset;
    }
    .close-btn {
      background: url(../../../assets/promo/lh-fish-honbao/close-btn.png);
      content-visibility: hidden;
      background-size: contain;
      width: 24px;
      height: 24px;
      right: 14px;
      position: absolute;
    }

    .record-dialog-container {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 320px;
      .record-dialog-content-title {
        color: #ea5046;
        font-family: FZHanZhenGuangBiaoS-GB;
        font-size: 18px;
        font-weight: 400;
        line-height: 16.63px;
        letter-spacing: 0.2em;
        text-align: center;
      }
      .record-dialog-content-detail {
        font-family: FZHanZhenGuangBiaoS-GB;
        font-size: 24px;
        font-weight: 400;
        line-height: 28.5px;
        letter-spacing: 0.2em;
        text-align: center;
        color: #ea5046;
        span {
          font-size: 72px;
        }
      }
      .hongbao-finish-btn {
        width: 256px;
        height: 44px;
        top: 634px;
        left: 832px;
        gap: 0px;
        border-radius: 100px 0px 0px 0px;
        background-color: #ea574e;
        font-family: FZHanZhenGuangBiaoS-GB;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        line-height: 19px;
        letter-spacing: 0.2em;
        text-align: center;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .title {
      background-image: url("../../../assets/promo/lh-fish-honbao/info-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 244px;
      height: 44px;
      font-size: 18px;
      color: #fff;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-weight: 400;
      line-height: 44px;
      letter-spacing: 0.2em;
      text-align: center;
      position: absolute;
      top: -1%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 6;
    }

    .record-table {
      width: 96%;
      height: 100%;
      margin-top: 12px;
      margin-bottom: 20px;
      border-collapse: collapse !important;
      th {
        height: 32px;
        font-size: 12px;
        font-weight: 600;
        line-height: 18px;
        color: #fff;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        vertical-align: middle;
        text-align: left;

        &:first-child {
          border-top-left-radius: 6px;
        }
        &:last-child {
          border-top-right-radius: 6px;
        }
      }
      tr {
        height: 32px;
        font-size: 12px;
        font-weight: 600;
        line-height: 18px;
        color: #7a8eb9;
        vertical-align: middle;
        text-align: left;
        &:nth-child(odd) {
          background: #f2f8fe;
        }
        &:nth-child(even) {
          background: #fff;
        }
        th {
          &:first-child {
            padding-left: 20px;
          }
          &:last-child {
            text-align: right;
            padding-right: 14px;
          }
        }

        td {
          &:first-child {
            padding-left: 20px;
          }
          &:last-child {
            text-align: right;
            padding-right: 14px;
          }
        }

        &:last-child {
          td {
            &:first-child {
              border-bottom-left-radius: 6px;
            }
          }
        }
        &:last-child {
          td {
            &:last-child {
              border-bottom-right-radius: 6px;
            }
          }
        }
      }
    }
  }

  .record-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .record-close-btn {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 12px;
  }

  // confirm vote dialog
  .confirm-vote-card {
    padding: 20px;
    width: 100%;
    max-width: 400px;

    :deep(.q-form) {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }

    .h6-div {
      background: linear-gradient(0deg, #4fb2ff 0, #6daddf 100%), linear-gradient(#d0d1d3, #d0d1d3);
      width: calc(100%);
      text-align: center;
      line-height: 30px;
      font-size: 16px;
    }
  }
}
.fish-match-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fish-match-container {
  width: 100%;
  height: 100%;
}

.fish-match-game {
  width: 100%;
  height: 335px;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
  .fish-match-content-warp {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
  }
  .fish-match-game-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    max-height: 60px;
    margin-top: 12px;
  }
  .fish-match-game-status {
    width: 68px;
    height: 24px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 10px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .fish-match-game-detail {
    width: 158px;
    height: 32px;
    background: rgba(81, 172, 255, 0.3);
    border: 1px solid #51acff;
    font-size: 14px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 8px;
  }
}
.fish-match-honbao-content {
  max-height: 288px;
  display: flex;
  justify-content: center;
  bottom: 10px;
  flex-direction: row;
  position: relative;
  .fish-1 {
    width: 138px !important;
    height: 152px !important;
    position: relative;
    margin-top: 80px;
  }
  .hongbao-1 {
    margin-left: -85px;
    position: relative;
    width: 220px !important;
    height: 240px !important;
    .fish-open-hongbao {
      background-image: url("../../../assets/promo/lh-fish-honbao/hongbao-open-btn.png");
      background-size: cover;
      width: 120px;
      height: 32px;
      border-radius: 12px;
      position: absolute;
      bottom: 2%;
      right: 18%;
      color: #f22a00;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 22.4px;
      text-align: left;
    }
    .fish-open-hongbao:hover {
      opacity: 0.8;
    }
    .fish-open-hongbao:active {
      filter: brightness(0.8);
      transform: translate(0px, 1px);
    }
  }
  .fish-2 {
    margin-left: -58px;
    margin-top: 80px;
    width: 156px !important;
    height: 138px !important;
  }
}
.fish-match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 16px;

  .fish-match-game-content-left,
  .fish-match-game-content-right {
    flex: 1;
    .fish-match-game-content-team-img {
      width: 44px !important;
      height: 44px;
    }
    .fish-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .fish-match-game-content-team-name {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1rem;
        margin-top: 4px;
        margin-bottom: 12px;
      }
    }
  }
  .fish-match-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .fish-match-game-content-center-time {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.1rem;
      color: #479af7;
      border-radius: 30px;
      padding: 4px 10px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .fish-match-game-content-center-schedule {
      font-size: 12px;
      font-weight: 600;
      line-height: 1rem;
      color: #1b1b1b99;
      margin-bottom: 12px;
    }
  }
}

.fish-match-game-content-btn {
  font-size: 12px;
  font-weight: 500;
  line-height: 16.8px;
  color: #00000066;
  background-image: url("../../../assets/promo/lh-nba24-match/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 72px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nba2-match-game-content-btn__pseudo {
  height: 24px;
}

.fish-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .fish-match-game-bottom-left-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 16.8px;
    color: #000000;
    width: calc(100% - 61px);
  }
  .fish-match-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: #479af7;
    cursor: pointer;
    width: 61px;
    margin-left: 24px;
  }
}

.fish-match-game-info {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 16px 16px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lh-nba24-match/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 20px;
    margin-bottom: 16px;
  }
  .little-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #000000;
    }
  }
}

.fish-match-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate !important;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  margin: 12px 0;
  th {
    height: 32px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
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
    &:nth-child(8) {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6 !important;
    height: 32px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
    background-color: #f2f8fe !important;
  }
}

.fish-match-game-info-sub {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.02em;
  text-align: left;
}
.fish-match-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 16px 0px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/lh-nba24-match/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 335px;
    height: 20px;
    margin-bottom: 16px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #000000;
    .item {
      text-indent: -11px;
      padding-left: 24px;
      padding-right: 8px;
    }
  }
}

.fish-match-table-record-dialog {
  position: relative;
  .fish-img {
    position: absolute;
    left: 0;
    right: 0;
    top: -108px;
    margin: auto;
    width: 100%;
    text-align: center;
  }
  .confirm-vote-card {
    width: 360px;
    height: 320px;
    background-color: #fff3df;
    position: relative;
    border-radius: 20px;
    overflow: unset;
  }
  .close-btn {
    background: url(../../../assets/promo/lh-fish-honbao/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    right: 14px;
    position: absolute;
  }

  .record-dialog-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 320px;
    .record-dialog-content-title {
      color: #ea5046;
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 18px;
      font-weight: 400;
      line-height: 16.63px;
      letter-spacing: 0.2em;
      text-align: center;
    }
    .record-dialog-content-detail {
      font-family: FZHanZhenGuangBiaoS-GB;
      font-size: 24px;
      font-weight: 400;
      line-height: 28.5px;
      letter-spacing: 0.2em;
      text-align: center;
      color: #ea5046;
      span {
        font-size: 72px;
      }
    }
    .hongbao-finish-btn {
      width: 256px;
      height: 44px;
      top: 634px;
      left: 832px;
      gap: 0px;
      border-radius: 100px 0px 0px 0px;
      background-color: #ea574e;
      font-family: FZHanZhenGuangBiaoS-GB;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      line-height: 19px;
      letter-spacing: 0.2em;
      text-align: center;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .title {
    background-image: url("../../../assets/promo/lh-fish-honbao/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 244px;
    height: 44px;
    font-size: 18px;
    color: #fff;
    font-family: FZHanZhenGuangBiaoS-GB;
    font-weight: 400;
    line-height: 44px;
    letter-spacing: 0.2em;
    text-align: center;
    position: absolute;
    top: -1%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
  }

  .record-table {
    width: 96%;
    height: 100%;
    margin-top: 12px;
    margin-bottom: 20px;
    border-collapse: collapse !important;
    th {
      height: 32px;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      vertical-align: middle;
      text-align: left;

      &:first-child {
        border-top-left-radius: 6px;
      }
      &:last-child {
        border-top-right-radius: 6px;
      }
    }
    tr {
      height: 32px;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
      color: #7a8eb9;
      vertical-align: middle;
      text-align: left;
      &:nth-child(odd) {
        background: #f2f8fe;
      }
      &:nth-child(even) {
        background: #fff;
      }
      th {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      td {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 6px;
          }
        }
      }
      &:last-child {
        td {
          &:last-child {
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
  }
}

.record-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-close-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 12px;
}

// confirm vote dialog
.confirm-vote-card {
  padding: 20px;
  width: 100%;
  max-width: 400px;

  :deep(.q-form) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .h6-div {
    background: linear-gradient(0deg, #4fb2ff 0, #6daddf 100%), linear-gradient(#d0d1d3, #d0d1d3);
    width: calc(100%);
    text-align: center;
    line-height: 30px;
    font-size: 16px;
  }
}
</style>

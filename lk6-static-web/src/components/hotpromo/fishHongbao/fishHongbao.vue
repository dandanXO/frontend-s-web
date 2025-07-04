<template>
  <div class="fish-match-box">
    <div class="fish-match-container">
      <div class="fish-content-title">
        活动期间，每日参与捕鱼场馆有效投注≥1,000
        元或以上，即可点击开启红包，有效投注越高抢红包次数越多，单个金额越高，最高奖金 1,888 元
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
      </div>
      <div class="fish-match-game-info">
        <div class="title"></div>
        <table class="fish-match-game-info-table">
          <tbody>
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
          </tbody>
        </table>
        <div class="fish-content-sub-title">
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

      <el-dialog
        v-model="tableRecordDialog"
        width="800px"
        align-center
        :close-on-click-modal="false"
        class="fish-match-table-record-dialog"
      >
        <div class="fish-img"><img src="../../../assets/promo/lh-fish-honbao/fish-dialog.png" /></div>
        <template #header>
          <div class="title">恭喜你抽中</div>
        </template>
        <div class="record-dialog-container">
          <div class="record-dialog-content-title">恭喜您获得以下奖金</div>
          <div class="record-dialog-content-detail">
            <span>{{ rewardMoney }}</span>
            元
          </div>
          <div @click="tableRecordDialog = false" class="hongbao-finish-btn">完成</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHongbaoInfo, getHongbaoMoney } from "@/api/promotion/fishHongbao";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";

const notify = useNotify();
const store = userStore();
const availableDraw = ref(0);
const validBet = ref(0);
const tableRecordDialog = ref(false);
const rewardMoney = ref(0);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const getNbaMatchData = async () => {
  const res = await getHongbaoInfo();
  if (res.code === 0) {
    availableDraw.value = res.data.availableDraw;
    validBet.value = res.data.validBet;
  }
};

onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  getNbaMatchData();
});
const claimHongBao = async () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }
  const res = await getHongbaoMoney();
  console.log(res);
  if (res.code === 0) {
    tableRecordDialog.value = true;
    rewardMoney.value = res.data;
  } else {
    notify.error(res.message);
  }
};

// watch(tableRecordDialog, async () => {
//   if (tableRecordDialog.value) {
//     const res = await getHongbaoMoney();
//     if(res.code === 0){
//       rewardMoney.value = res.data
//     }
//   }
// });
</script>

<style scoped lang="scss">
.dark {
  .fish-match-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .fish-match-container {
    width: 1200px;
    height: 100%;
  }
  .fish-content-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: white;
  }

  .fish-match-game {
    width: 100%;
    height: 302px;
    border-radius: 12px;
    border: 1px solid #51acff;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    position: relative;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    .fish-match-content-warp {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }
    .fish-match-game-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      max-height: 200px;
    }
    .fish-match-game-status {
      width: 120px;
      height: 40px;
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
    .fish-match-game-detail {
      width: 276px;
      height: 48px;
      background: rgba(81, 172, 255, 0.3);
      border: 1px solid #51acff;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      border-top-right-radius: 16px;
    }
  }

  .fish-match-game-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: end;

    .fish-match-game-content-left,
    .fish-match-game-content-right {
      flex: 1;
      .fish-match-game-content-team {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .fish-match-game-icon {
          width: 80px;
          height: 80px;
        }
        .fish-match-game-content-team-name {
          font-size: 20px;
          font-weight: 600;
          line-height: 28px;
          margin-top: 12px;
          margin-bottom: 24px;
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
        font-size: 24px;
        font-weight: 600;
        line-height: 33.6px;
        color: #479af7;
        border-radius: 30px;
        padding: 8px 44px;
        background: #edf4ff;
        margin-bottom: 15px;
      }
      .fish-match-game-content-center-schedule {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        color: #1b1b1b99;
        margin-bottom: 33px;
      }
    }
  }
  .fish-match-honbao-content {
    max-height: 288px;
    display: flex;
    flex-direction: row;
    position: relative;
    .fish-1 {
      width: 266px;
      height: 280px;
    }
    .hongbao-1 {
      margin-left: -85px;
      position: relative;
      width: 275px;
      height: 300px;
      .fish-open-hongbao {
        background-image: url("../../../assets/promo/lh-fish-honbao/hongbao-open-btn.png");
        background-size: cover;
        width: 120px;
        height: 32px;
        border-radius: 12px;
        position: absolute;
        bottom: 25%;
        right: 32%;
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
      margin-left: -128px;
      width: 266px;
      height: 280px;
    }
  }

  .fish-match-game-content-btn {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    color: #00000066;
    background-image: url("../../../assets/promo/lh-fish-honbao/btn.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 180px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .nba2-match-game-content-btn__pseudo {
    height: 58px;
  }

  .fish-match-game-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .fish-match-game-bottom-left-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 22.4px;
      color: white;
    }
    .fish-match-game-bottom-left-btn {
      font-size: 16px;
      font-weight: 600;
      line-height: 22.4px;
      color: #479af7;
      cursor: pointer;
    }
  }

  .fish-match-game-info {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border-radius: 12px;
    padding: 40px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      background-image: url("../../../assets/promo/lh-fish-honbao/info-title-2-black.png");
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
        background-image: url("../../../assets/promo/lh-fish-honbao/info-little-title-bg.png");
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
        color: white;
      }
    }
  }

  .fish-match-game-info-table {
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
      border: 1px solid #acd4f6;
      height: 56px;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: white;
    }
  }
  .fish-content-sub-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: white;
    width: 100%;
  }
  .fish-match-game-bottom-rule {
    width: 100%;
    height: 100%;
    margin-top: 40px;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);

    border-radius: 12px;
    padding: 40px;
    border: 1px solid #acd4f6;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      background-image: url("../../../assets/promo/lh-fish-honbao/rule-title-black.png");
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
      color: white;
      .item {
        text-indent: -16px;
        padding-left: 24px;
      }
    }
  }

  :deep(.fish-match-table-record-dialog) {
    width: 320px;
    height: 360px;
    background-color: #fff3df;
    font-family: "FZHanZhenGuangBiaoS-GB";
    .fish-img {
      position: absolute;
      top: -110px;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      text-align: center;
    }
    .el-dialog__header {
      background: #fff3df;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-dialog__header .el-dialog__headerbtn {
      background: url(../../../assets/promo/lh-fish-honbao/close-btn.png);
      content-visibility: hidden;
      background-size: contain;
      width: 24px;
      height: 24px;
      top: 20px;
      right: 24px;
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
        font-size: 16px;
        font-weight: 400;
        line-height: 16.63px;
        letter-spacing: 0.2em;
        text-align: center;
      }
      .record-dialog-content-detail {
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
      margin-left: 24px;
      background-image: url("../../../assets/promo/lh-fish-honbao/info-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 244px;
      height: 44px;
      margin-top: -5px;
      font-size: 18px;
      color: #fff;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0.2em;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .record-table {
      width: 100%;
      height: 100%;
      th {
        height: 56px;
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
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
        height: 56px;
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
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

  .dialog-header {
    text-align: center;
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    margin-top: 8px;
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
  width: 1200px;
  height: 100%;
}
.fish-content-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  color: #000000;
}

.fish-match-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  .fish-match-content-warp {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }
  .fish-match-game-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    max-height: 200px;
  }
  .fish-match-game-status {
    width: 120px;
    height: 40px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .fish-match-game-detail {
    width: 276px;
    height: 48px;
    background: rgba(81, 172, 255, 0.3);
    border: 1px solid #51acff;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #479af7;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    border-top-right-radius: 16px;
  }
}

.fish-match-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;

  .fish-match-game-content-left,
  .fish-match-game-content-right {
    flex: 1;
    .fish-match-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .fish-match-game-icon {
        width: 80px;
        height: 80px;
      }
      .fish-match-game-content-team-name {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: 12px;
        margin-bottom: 24px;
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
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .fish-match-game-content-center-schedule {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #1b1b1b99;
      margin-bottom: 33px;
    }
  }
}
.fish-match-honbao-content {
  max-height: 288px;
  display: flex;
  flex-direction: row;
  position: relative;
  .fish-1 {
    width: 266px;
    height: 280px;
  }
  .hongbao-1 {
    margin-left: -85px;
    position: relative;
    width: 275px;
    height: 300px;
    .fish-open-hongbao {
      background-image: url("../../../assets/promo/lh-fish-honbao/hongbao-open-btn.png");
      background-size: cover;
      width: 120px;
      height: 32px;
      border-radius: 12px;
      position: absolute;
      bottom: 25%;
      right: 32%;
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
    margin-left: -128px;
    width: 266px;
    height: 280px;
  }
}

.fish-match-game-content-btn {
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #00000066;
  background-image: url("../../../assets/promo/lh-fish-honbao/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 180px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nba2-match-game-content-btn__pseudo {
  height: 58px;
}

.fish-match-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .fish-match-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #000000;
  }
  .fish-match-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #479af7;
    cursor: pointer;
  }
}

.fish-match-game-info {
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
    background-image: url("../../../assets/promo/lh-fish-honbao/info-title-2.png");
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
      background-image: url("../../../assets/promo/lh-fish-honbao/info-little-title-bg.png");
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

.fish-match-game-info-table {
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
    &:nth-child(8) {
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
.fish-content-sub-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 22.4px;
  color: #000000;
  width: 100%;
}
.fish-match-game-bottom-rule {
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
    background-image: url("../../../assets/promo/lh-fish-honbao/rule-title.png");
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

:deep(.fish-match-table-record-dialog) {
  width: 320px;
  height: 360px;
  background-color: #fff3df;
  font-family: "FZHanZhenGuangBiaoS-GB";
  .fish-img {
    position: absolute;
    top: -110px;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    text-align: center;
  }
  .el-dialog__header {
    background: #fff3df;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/promo/lh-fish-honbao/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 24px;
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
      font-size: 16px;
      font-weight: 400;
      line-height: 16.63px;
      letter-spacing: 0.2em;
      text-align: center;
    }
    .record-dialog-content-detail {
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
    margin-left: 24px;
    background-image: url("../../../assets/promo/lh-fish-honbao/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 244px;
    height: 44px;
    margin-top: -5px;
    font-size: 18px;
    color: #fff;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.2em;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .record-table {
    width: 100%;
    height: 100%;
    th {
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
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
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
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

.dialog-header {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>

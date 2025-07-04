<template>
  <div class="apphongbao-container">
    <div class="stage-wrapper">
      <img class="stage" src="../../../assets/images/promotion/hotpromo/apphongbao/stage.png" />

      <!-- <div class="button-wrapper" @click="getPromotion">
                <img :class="`button ${bonusOpened ? 'disabled' : ''}`"
                    src="../../../assets/images/promotion/hotpromo/apphongbao/button.png" />
            </div> -->

      <a class="button-wrapper" target="_blank" :href="downloadUrl" :title="downloadUrl">
        <img class="button" src="../../../assets/images/promotion/hotpromo/apphongbao/download-button.png" />
      </a>
    </div>

    <div class="bottom">
      <div class="table-wrapper">
        <img class="table" src="../../../assets/images/promotion/hotpromo/apphongbao/table.png" />
        <div class="table-data">
          <div class="row">
            <div class="header">活动对象</div>
            <div class="header">抽奖时段</div>
            <div class="header">抽奖资格</div>
            <div class="header">红包</div>
          </div>
          <div class="row">
            <div class="content" style="width: 370px">{{ params.audience }}</div>
            <div class="content" style="width: 285px">{{ params.gametime }}</div>
            <div class="content" style="width: 360px">{{ params.requirement }}</div>
            <div class="content" style="width: 290px">{{ params.hongbao }}</div>
          </div>
        </div>
      </div>

      <!-- <a class="download-button-wrapper" target="_blank" :href="downloadUrl" :title="downloadUrl">
                <img class="button" src="../../../assets/images/promotion/hotpromo/apphongbao/download-button.png" />
            </a> -->

      <div class="notes">
        <p>注：每场红包限量，抢完为止，若您抢到【本场红包雨已全部派发】，则代表该场次限量包数已全部抽完。</p>
        <p>注：限量红包不错过，下载APP开启推播通知&优惠通知，红包雨开始前3分钟，每分钟推送提醒一次。</p>
      </div>

      <div class="rules-header">
        <img class="rules-header-img" src="../../../assets/images/promotion/hotpromo/apphongbao/rules-header.png" />
        <p>1.活动需下载雷火APP即可参与抢夺红包雨，每场红包雨每日仅限抽1次，奖金由系统实时派发至用户账户内；</p>
        <p>
          2.活动期间，用户需使用APP登入记录并且当日任意存款一笔即可符合参与抢夺红包雨活动条件，红包雨彩金不限场馆3倍流水即可提款；
        </p>
        <p>3.活动期间，每场已开启的红包雨限量8888个红包，若限量红包已全数抽完，则提示【本场红包雨已全部派发】；</p>
        <p>4.流水仅计算当天下注且结算的注单，若提前兑现、注单未结算、取消或走盘皆不及不计算为有效投注；</p>
        <p>
          5.
          任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </p>
        <p>
          6.
          每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利；
        </p>
        <p>7. 为避免文字理解差异，本站保留最终解释权；</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { claimDailyRainItem } from "@/api/index/promo";
import { getAppDownloadUrlFromServer } from "@/api/index/site";
import { userStore } from "@/store";
import { useNotify } from "@/hooks/notify";
const store = userStore()

const props = defineProps(["promoCode", "params"]);

const notify = useNotify();

const params = JSON.parse(props.params || "{}");
const promoCode = ref(props.promoCode);
const loadingClaim = ref(false);
const downloadUrl = ref("");
const bonusOpened = ref(false);

const getAppDownloadUrl = () => {
  getAppDownloadUrlFromServer()
    .then((res) => {
      if (res.downloadPageUrl) {
        downloadUrl.value = res.downloadPageUrl;
      } else {
        notify.error(res.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getPromotion = () => {
  if (bonusOpened.value !== false) {
    return;
  }

  loadingClaim.value = true;

  claimDailyRainItem(promoCode.value)
    .then((res) => {
      loadingClaim.value = false;

      if (res.code === 0) {
        const claimedAmt = res.data.lastDigitAmount + res.data.vipAmount;
        notify({
          type: 'red-packet',
          message: "恭喜中奖！",
          params: {
            redPacket: claimedAmt
          }
        })

        store.getBalance();

        bonusOpened.value = true;
      } else {
        notify.error(res.message);
        loadingClaim.value = false;
      }
    })
    .catch((err) => {
      loadingClaim.value = false;
      console.log(err.message);
    });
};

onMounted(() => {
  getAppDownloadUrl();
});
</script>

<style lang="scss" scoped>
.apphongbao-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;

  .stage-wrapper {
    position: relative;
    width: 778px;
    height: 566px;
  }

  img.stage {
    aspect-ratio: 778 / 566;
  }

  .button-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    cursor: pointer;

    img.button {
      aspect-ratio: 368 / 160;

      &:hover {
        filter: brightness(1.1);
      }

      &:active {
        transform: translateY(2px);
      }

      &.disabled {
        cursor: not-allowed;
        filter: brightness(0.5);
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("../../../assets/images/promotion/hotpromo/apphongbao/notes-bg.png") no-repeat top center;
    background-size: 100% 100%;
    width: 100%;
    padding: 10px;

    .table-wrapper {
      position: relative;
      width: 1653px;
      height: 454px;

      img.table {
        aspect-ratio: 1653 / 454;
      }

      .table-data {
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 80%;
        display: table;

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          align-items: center;
          justify-content: center;
          display: table-row;

          .header {
            font-size: 1.8rem;
            color: #ffffffb2;
            text-align: center;
            display: table-cell;
            padding: 20px;
            padding-top: 135px;
          }

          .content {
            font-size: 1.5rem;
            color: #fff;
            text-align: center;
            display: table-cell;
            padding: 20px;
            overflow: auto;
            height: 200px;
          }
        }
      }
    }

    .download-button-wrapper {
      cursor: pointer;

      img.button {
        aspect-ratio: 314 / 113;

        &:hover {
          filter: brightness(1.1);
        }

        &:active {
          transform: translateY(2px);
        }
      }
    }

    .notes {
      margin: 0 auto;
      max-width: 1400px;
      width: 95%;
      text-align: left;
      padding: 0px 20px;
      color: #fff;
      font-size: 20px;
    }

    .rules-header {
      margin: 0 auto;
      max-width: 1400px;
      width: 95%;
      padding: 0px 20px;
      color: #fff;
      font-size: 20px;

      .rules-header-img {
        width: 100%;
        margin: 25px 0px;
      }
    }
  }
}
</style>

<template>
  <div class="weekly-deposit-bonus">
    <div class="claim-banner">
      <div class="claim-btn" @click="claimBonus">
        {{ $t("lang.weeklyDepositBonus.claimNow") }}
      </div>
    </div>
    <div class="section-bg">
      <div class="title-wrapper">
        <img src="@/assets/images/promotion/hotpromo/weekly-deposit-bonus/title-img-left.png" />
        <span>{{ $t("lang.weeklyDepositBonus.promotionDetails") }}</span>
        <img src="@/assets/images/promotion/hotpromo/weekly-deposit-bonus/title-img-right.png" />
      </div>
      <div class="little-title">
        <div class="right bold">{{ $t("lang.weeklyDepositBonus.promotionPeriod") }}</div>
      </div>
      <div class="little-title">
        <div class="ribbon">{{ $t("lang.weeklyDepositBonus.applicableFor") }}</div>
        <div class="right bold">{{ $t("lang.weeklyDepositBonus.applicableForText") }}</div>
      </div>

      <div class="little-title">
        <div class="ribbon">{{ $t("lang.weeklyDepositBonus.applicableProducts") }}</div>
        <div class="right bold">{{ $t("lang.weeklyDepositBonus.applicableProductsText") }}</div>
      </div>

      <div class="little-title">
        <div class="ribbon">{{ $t("lang.weeklyDepositBonus.promotionDetails") }}</div>
        <div class="right bold">{{ $t("lang.weeklyDepositBonus.promotionDetailsText") }}</div>
      </div>
      <table class="section-table">
        <thead>
          <tr>
            <th>{{ $t("lang.weeklyDepositBonus.vipLevel") }}</th>
            <th>{{ $t("lang.weeklyDepositBonus.weeklyDepositTier1") }}</th>
            <th>{{ $t("lang.weeklyDepositBonus.bonusRateTier1") }}</th>
            <th>{{ $t("lang.weeklyDepositBonus.weeklyDepositTier2") }}</th>
            <th>{{ $t("lang.weeklyDepositBonus.bonusRateTier2") }}</th>
            <th>{{ $t("lang.weeklyDepositBonus.maximumBonus") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VIP 1</td>
            <td>5,000 VNDP</td>
            <td>0.3%</td>
            <td>8,888 VNDP</td>
            <td>0.4%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 2</td>
            <td>5,000 VNDP</td>
            <td>0.4%</td>
            <td>8,888 VNDP</td>
            <td>0.5%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 3</td>
            <td>5,000 VNDP</td>
            <td>0.5%</td>
            <td>8,888 VNDP</td>
            <td>0.6%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 4</td>
            <td>5,000 VNDP</td>
            <td>0.6%</td>
            <td>8,888 VNDP</td>
            <td>0.7%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 5</td>
            <td>5,000 VNDP</td>
            <td>0.7%</td>
            <td>8,888 VNDP</td>
            <td>0.8%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 6</td>
            <td>5,000 VNDP</td>
            <td>0.8%</td>
            <td>8,888 VNDP</td>
            <td>0.9%</td>
            <td>1,088 VNDP</td>
          </tr>
          <tr>
            <td>VIP 7</td>
            <td>5,000 VNDP</td>
            <td>0.9%</td>
            <td>8,888 VNDP</td>
            <td>1.0%</td>
            <td>1,088 VNDP</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="section-bg">
      <div class="title-wrapper">
        <img src="@/assets/images/promotion/hotpromo/weekly-deposit-bonus/title-img-left.png" />
        <span>{{ $t("lang.weeklyDepositBonus.termsAndConditions") }}</span>
        <img src="@/assets/images/promotion/hotpromo/weekly-deposit-bonus/title-img-right.png" />
      </div>
      <br />

      <h3>{{ $t("lang.weeklyDepositBonus.titlerule") }}</h3>
      <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.rule1") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">2</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.rule2") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">3</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.rule3") }}</div>
          </div>
        </div>
      </div>

      <h3>{{ $t("lang.weeklyDepositBonus.titlecondition") }}</h3>
      <div class="content">
        <div class="item">
          <div class="item-num">1</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition1") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">2</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition2") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">3</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition3") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">4</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition4") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">5</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition5") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">6</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition6") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">7</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition7") }}</div>
          </div>
        </div>

        <div class="item">
          <div class="item-num">8</div>
          <div class="item-desc">
            <div class="hint">{{ $t("lang.weeklyDepositBonus.condition8") }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="remaining-draw-wrapper">
            <p class="remaining-draw-text">剩余抽奖次数：<span id="remaning-draw-amt">{{ remainingDraws }}</span></p>
        </div> -->
  </div>

  <q-dialog v-model="showPrizePopup">
    <div class="prizePopupContainer-weekly" @click="showPrizePopup = false">
      <div class="wrapper">
        <!-- <div class="popup-header bold-text golden-text">恭喜!</div> -->
        <div class="content">
          <!-- <div class="bold-text">您获得</div> -->
          <div class="bold-text">{{ prizePopupBonusAmt }}</div>
          <!-- <div class="bold-text">元</div>
                      <div class="action-btn" @click="showPrizePopup = false">
                          立即领取
                      </div>  -->
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { claimWeeklyBonus, weeklyBonusInit } from "@/api/promo/weeklyBonus";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { userStore } from "src/stores";

const { t } = useI18n();
const $q = useQuasar();
const store = userStore();
const props = defineProps(["promoCode"]);

const prizePopupBonusAmt = ref(0);
const bonus = ref(0);
const totalDeposit = ref(0);
const showPrizePopup = ref(false);
const initPage = () => {
  weeklyBonusInit(props.promoCode).then((res) => {
    if (res.code === 0) {
      const { data } = res;
      bonus.value = data.bonus;
      totalDeposit.value = data.totalDeposit;
    } else {
      ElMessage.error(res.message);
    }
  });
};
const claimBonus = () => {
  claimWeeklyBonus(props.promoCode).then((res) => {
    if (res.code === 0) {
      prizePopupBonusAmt.value = res.data;
      showPrizePopup.value = true;
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        // message: res.message
        message: t("error." + data.code)
      });
    }
  });
};
onMounted(() => {
  initPage();
});
</script>
<style lang="scss">
.weekly-deposit-bonus {
  h3 {
    margin-bottom: 4px !important;
    line-height: normal;
  }
  .claim-banner {
    max-width: 1200px;
    margin: 0 auto 10px;
    background: url(../../../assets/images/promotion/hotpromo/weekly-deposit-bonus/claim-banner.png) no-repeat center
      center;
    border-radius: 10px;
    background-size: cover;
    padding: 30px 0;
    .claim-btn {
      width: 150px;
      margin-left: auto;
      height: 50px;
      padding-bottom: 0px;
      background: url(../../../assets/images/promotion/hotpromo/weekly-deposit-bonus/claim-btn.png) no-repeat center
        center;
      background-size: contain;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #b6091b;
      cursor: pointer;

      text-shadow: 0px 2.84px 2.84px #ffffff99;

      font-family: Inter;
      font-weight: 800;
      font-size: 18px;
      line-height: 26.97px;
      letter-spacing: -2%;

      img {
        width: 100%;
        display: block;
      }
    }
  }
  .section-bg {
    .title-wrapper {
      color: #4c4c6c;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 50px;
      }
    }
    border: 1px solid rgba(172, 212, 246, 1);
    background: #f2f8fe;
    border-radius: 12px;
    padding: 10px;
    font-family: "Roboto";
    margin-bottom: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ribbon {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #70cbfb 26.32%, #4aa5ff 62.42%, #4aa5ff 93.74%, #6ec7fd 100%);
    padding-right: 10px;
    font-family: "Roboto";
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: fit-content;
    padding: 0px 20px 0px 10px;
    aspect-ratio: 94 / 15;
    white-space: nowrap;
    min-width: 160px;
  }

  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    flex-direction: column;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/weekly-deposit-bonus/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      min-width: 120px;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 14px;
      font-weight: 400;
      line-height: 28px;
    }
  }
  .item {
    display: flex;
    gap: 10px;
    margin-bottom: 5px;

    .item-num {
      color: #ffffff;
      font-size: 14px;
      line-height: 1;
      border-radius: 50%;
      height: 28px !important;
      width: 28px !important;
      min-width: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 2px;
      background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
    }

    .item-desc {
      display: flex;
      flex-direction: column;
      color: #ff0000;
      margin-top: 5px;

      .hint {
        font-size: 14px;
        font-weight: 400;
        line-height: 22.4px;
        color: #000;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
  table {
    width: 100%;
    height: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    text-align: center;
    vertical-align: middle;
    th {
      height: 56px;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 26.32%, #4aa5ff 62.42%, #4aa5ff 93.74%, #6ec7fd 100%);

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
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #000000;
    }
  }
}

.prizePopupContainer-weekly {
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 80px;
    align-items: center;
    width: 300px;
    height: 240px;
    gap: 45px;
    background: url("./../../../assets/images/promotion/hotpromo/weekly-deposit-bonus/popupp.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    .bold-text {
      font-family: sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      text-align: center;
      color: #ffffff;
    }

    .golden-text {
      font-size: 25px;
      letter-spacing: 2px;
      background: linear-gradient(94.81deg, #f6ff8c 7.45%, #ffba88 95.9%),
        linear-gradient(360deg, #ff932f 9.54%, #fffca9 86.08%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .popup-header {
      letter-spacing: normal;
      font-size: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .content {
      height: auto;
      margin-bottom: 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;

      .action-btn {
        //background: url("./../../../assets/images/promotion/hotpromo/xmas-spinwheel/prize-popup-action-btn.png");
        background-size: 100% 100%;
        width: 80%;
        height: 100%;
        max-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c12c1e;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

</style>

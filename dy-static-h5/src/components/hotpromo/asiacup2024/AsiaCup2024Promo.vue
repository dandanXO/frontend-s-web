<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs v-model="activeKey">
        <q-tab name="asia-war-guide"><span>亚战指南</span></q-tab>
        <q-tab name="betting-bonus"><span>投注好礼</span></q-tab>
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="asia-war-guide">
          <div class="tab1">
            <!-- <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/asiacup2024/btn1-claim.png" />
            </div> -->
            <div class="right-container">
              <!-- <div class="desc-title">2024亚战指南</div> -->

              <q-btn class="claim-btn" label="立即申请" @click="handleClaim('asian-cup-A', '亚战指南')" />
            </div>

            <div>
              <div class="img-liner">
                <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_title.png" />
              </div>
              <div>
                <p class="text-center">
                  赛事期间，投注亚洲杯赛事有效投注额≥500，若投注亚洲杯赛事中触发以下事件，即可获得彩金奖励，彩金奖励按触发事件奖励金额最高赛事派发彩金。每日最高可获388元！
                </p>
              </div>

              <table class="promo-table">
                <tbody>
                  <tr>
                    <th>任意赛事早盘有效投注</th>
                    <th>首当其冲</th>
                    <th>梅开二度</th>
                    <th>势如破竹</th>
                  </tr>
                  <tr>
                    <td>≥500</td>
                    <td>3</td>
                    <td>5</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>≥1,000</td>
                    <td>8</td>
                    <td>10</td>
                    <td>12</td>
                  </tr>
                  <tr>
                    <td>≥5,000</td>
                    <td>18</td>
                    <td>36</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td>≥10,000</td>
                    <td>36</td>
                    <td>58</td>
                    <td>88</td>
                  </tr>
                  <tr>
                    <td>≥50,000</td>
                    <td>188</td>
                    <td>288</td>
                    <td>388</td>
                  </tr>
                </tbody>
              </table>

              <div class="container-hint">
                <div class="hint-wrapper">
                  <div class="hint-title">首当其冲</div>
                  <p class="color-lightgreen">
                    15分钟内（含15分钟）
                    <br />
                    有进球
                  </p>
                </div>
                <div class="hint-wrapper">
                  <div class="hint-title">梅开二度</div>
                  <p class="color-lightgreen">任意方球员 进两个球</p>
                </div>
                <div class="hint-wrapper">
                  <div class="hint-title">势如破竹</div>
                  <p class="color-lightgreen">胜方赢球3个 且零封对手</p>
                </div>
              </div>

              <div class="img-liner q-mt-xl">
                <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_rule.png" />
              </div>
              <div>
                <p>1.活动期间，投注亚洲杯赛事有效投注≥500元且亚洲杯赛事触发事件即可申请对应彩金奖励。</p>
                <p>
                  2.满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款。
                </p>
                <p>
                  3.本活动限IM体育场馆的早盘盘口参与，滚球盘有效投注不予计算该活动流水内，其他场馆不予本活动统计范围内。
                </p>
                <p>4.活动彩金不累计多场触发条件，彩金按当日触发金额最高条件派发金额。</p>
                <p>
                  5.
                  仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.5、香港盘0.5赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算。
                </p>
                <p>
                  6.
                  每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关
                  闭相关账户的权利，并不退还款项，且用户列入黑名单。
                </p>
                <p>7. 为避免文字理解差异，本站保留最终解释权。</p>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="betting-bonus">
          <div class="tab1">
            <!-- <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/asiacup2024/btn2-claim.png" />
            </div> -->
            <div class="right-container">
              <!-- <div class="desc-title">2024投注好礼</div> -->

              <q-btn class="claim-btn" label="立即申请" @click="handleClaim('asian-cup-B', '投注好礼')" />
            </div>

            <div>
              <div class="img-liner">
                <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_title.png" />
              </div>
              <div>
                <p class="text-center">
                  赛事期间，用户投注亚洲杯联赛当日累计有效投注额≥2000元，即可获得对应层级彩金奖励，每日最高可获得1588元！
                </p>
              </div>

              <table class="promo-table">
                <tbody>
                  <tr>
                    <th>有效投注</th>
                    <th>彩金奖金</th>
                    <th>流水倍数</th>
                  </tr>

                  <tr>
                    <td>≥2,000</td>
                    <td>8</td>
                    <td rowspan="7">3倍流水</td>
                  </tr>
                  <tr>
                    <td>≥5,000</td>
                    <td>18</td>
                  </tr>
                  <tr>
                    <td>≥10,000</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td>≥30,000</td>
                    <td>88</td>
                  </tr>
                  <tr>
                    <td>≥80,000</td>
                    <td>288</td>
                  </tr>
                  <tr>
                    <td>≥200,000</td>
                    <td>588</td>
                  </tr>
                  <tr>
                    <td>≥500,000</td>
                    <td>1588</td>
                  </tr>
                </tbody>
              </table>

              <div class="img-liner q-mt-xl">
                <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_rule.png" />
              </div>
              <div class="lpl-ruler">
                <p>1. 活动期间，投注亚洲杯赛程赛事有效投注≥2000元即可申请彩金奖励。</p>
                <p>
                  2.
                  满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款。
                </p>
                <p>3. 本活动限IM体育场馆，其他场馆不予本活动统计范围内。</p>
                <p>
                  4.
                  仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.5、香港盘0.5赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计。
                </p>
                <p>
                  5.
                  每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关
                  闭相关账户的权利，并不退还款项，且用户列入黑名单。
                </p>
                <p>6. 为避免文字理解差异，本站保留最终解释权。</p>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";

const $q = useQuasar();
const store = userStore();
var qs = require("qs");

const activeKey = ref("asia-war-guide");

const handleClaim = (applyPromoCode, applyPromoTitle) => {
  eventapi
    .post("/promo-application/apply", qs.stringify({ promoCode: applyPromoCode, promoTitle: applyPromoTitle }))
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "申请成功！",
          icon: "report_problem"
        });
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: "申请失败",
          icon: "report_problem"
        });
      }
    });
};
</script>

<style scoped lang="scss">
.promo-4 {
  padding: 5px;

  .tabs {
    .q-tabs {
      height: 54px;
      text-align: center;
      background: #f3f4f6;
      margin: 0;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      border-radius: 8px;
      border: 1px solid #2f7cf7;
    }

    .q-tab {
      flex: 1;
      color: #87898a;
      border-radius: 0;

      span {
        display: block;
        line-height: 1;
        font-size: 18px;
        font-weight: 500;
        color: #374151;
      }

      &--active {
        // background: #6ad8ff;
        background-color: transparent;
        // background-image: url("../../../assets/images/promotion/hotpromo/asiacup2024/active-tab.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        background: linear-gradient(180deg, #2ca1fe 0%, #2f7cf7 100%);
        border-radius: 8px;
        color: #ffffff;

        span {
          color: #ffffff;
          font-weight: 700;
        }
      }
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      color: #3f3f3f;
      background: white;
      padding: 30px 0px;

      .left-container {
        img {
          max-width: 150px;
        }
      }

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 320px;
        margin-bottom: 30px;

        .desc {
          width: 90%;
          color: #87898a;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
        }

        .desc-title {
          width: 90%;
          color: #2f7cf7;
          font-weight: 600;
          font-size: 40px;
          line-height: 1;
          margin-bottom: 30px;
          text-align: center;
          font-family: YouSheBiaoTiHei;
        }

        form {
          margin: 6px 0;

          :deep(.q-field__native) {
            font-size: 16px;
            height: 48px;
            text-align: center;
            background-color: #f4f7f8;
            border-radius: 6px;
            border: 1px solid #87898a;
            color: #87898a;
          }
        }
      }
    }

    .tab2,
    .tab3 {
      .firstrow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        padding: 20px;
        flex-wrap: wrap;
        gap: 20px;

        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: #87898a;

          :deep(.q-field__append) {
            padding: 0;
          }

          :deep(.q-field__native) {
            width: 100px;
            padding: 0;
          }

          :deep(.q-field__control),
          :deep(.q-field__marginal) {
            height: 30px;
          }
        }

        :deep(.q-toggle__label) {
          color: #87898a;
        }

        .retrieve-btn {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          width: 75px;
          background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
          border-radius: 30px;
          font-weight: 600;
          margin-left: auto;
        }
      }

      :deep(.q-table th) {
        background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        color: white;
      }

      :deep(.q-table td) {
        text-wrap: wrap;
      }

      :deep(.q-table__bottom--nodata) {
        margin: 0 auto;
      }
    }

    .common-btn {
      color: white;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
      width: 175px;
      background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
      border-radius: 30px;
      font-weight: 600;
      opacity: 0.8;
    }
  }
}

.img-liner {
  margin-bottom: 20px;

  img {
    display: block;
    width: 100%;
  }
}

.text-center {
  text-align: center;
}

.container-hint {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-wrapper {
  text-align: center;
  // background-image: url("../../../assets/images/promotion/hotpromo/asiacup2024/active-tab.png");
  background: linear-gradient(180deg, #2ca1fe 0%, #2f7cf7 100%);
  padding: 15px 5px 5px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 168px;
  aspect-ratio: 168/54;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 16px;

  .hint-title {
    font-size: 18px;
    color: #fff;
  }
}

.click-btn {
  transition: 0.3s all;
  &:hover {
    filter: brightness(1.5);
  }
}

.claim-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #2ca1fe 0%, #c481fe 100%);
  color: #ffffff;
  width: 180px;
  font-weight: 700;
  font-size: 16px;
  height: 40px;
}

table.promo-table th {
  background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039) !important;
  color: white !important;
}
</style>

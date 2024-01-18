<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs v-model="activeKey">
        <q-tab name="shout-and-cheer"><span>呐喊助威</span></q-tab>
        <q-tab name="betting-bonus"><span>倍投赠礼</span></q-tab>
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="shout-and-cheer">
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/lpl-summer/btn2-claim.png" />
            </div>
            <div class="right-container">
              <div class="desc-title">LPL呐喊助威</div>

              <q-btn class="claim-btn" label="立即申请" @click="handleClaim('lpl-summer-A', '呐喊助威')" />
            </div>

            <div>
              <div class="img-liner">
                <img src="../../../assets/images/promotion/hotpromo/lpl-summer/promo_title.png" />
              </div>
              <div>
                <p class="text-center">
                  活动期间，2024年1月15日至LPL春季赛开赛前需满足累积存款≥5000且电竞场馆有效流水≥30000，开赛日时可派发58元，LPL春季赛开赛当日可点击申请按钮，次日24点前免费派发8元
                </p>
              </div>

              <table class="promo-table">
                <thead>
                  <tr>
                    <th style="width: 100px">达成条件</th>
                    <th style="white-space: wrap">
                      LPL春季赛开赛日前 累积存款≥5000 且
                      <br />
                      全电竞场馆有效流水≥30000
                    </th>
                    <th style="white-space: wrap">
                      LPL春季赛开赛当日
                      <br />
                      点击开赛日申请按钮
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>开赛祝贺礼</td>
                    <td>58</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>奖金派发时间</td>
                    <td>LPL春季赛开赛日</td>
                    <td>LPL春季赛开赛次日</td>
                  </tr>

                  <tr>
                    <td>奖金派发形式</td>
                    <td>无需申请 派发至会员钱包</td>
                    <td>需自助申请 派发至会员钱包</td>
                  </tr>
                  <tr>
                    <td>奖金流水</td>
                    <td>3倍</td>
                    <td>3倍</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="img-liner">
              <img src="../../../assets/images/promotion/hotpromo/lpl-summer/promo_rule.png" />
            </div>
            <div>
              <p>1. LPL春季赛赛前与开赛日均有祝贺礼，以上述条件及奖金派发为准；</p>
              <p>
                2.
                参与本活动会员需在LPL春季赛开赛当日23:59:59前登录该页面并点击【立即申请】，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需3倍流水即可取款
              </p>
              <p>
                3.
                仅计算已结算并产生输赢结果的注单，任何平局、串关、取消的注单不予计算，任何低于欧洲盘1.7、香港盘0.7赔率以下的注单以及在同一赛事中同时投注对等盘口将不予计算；
              </p>
              <p>
                4.
                每位有效会员、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑以及其他登录设备只能享受一次活动优惠，如有任何违规者或任何团体以不正常的方式进行套取活动优惠，我站保留在不通知的情况下冻结或关&nbsp;
                闭相关账户的权利，并不退还款项，且用户列入黑名单。
              </p>
              <p>5. 为避免文字理解差异，雷火电竞保留最终解释权。</p>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="betting-bonus">
          <div class="tab1">
            <div class="left-container">
              <img src="../../../assets/images/promotion/hotpromo/lpl-summer/btn2-claim.png" />
            </div>
            <div class="right-container">
              <div class="desc-title">LPL倍投赠礼</div>

              <q-btn class="claim-btn" label="立即申请" @click="handleClaim('lpl-summer-B', '倍投赠礼')" />
            </div>

            <div>
              <div class="img-liner">
                <img src="../../../assets/images/promotion/hotpromo/lpl-summer/promo_title.png" />
              </div>
              <div>
                <p class="text-center">
                  活动期间，LPL春季赛开赛前需满足累积存款≥5000且电竞场馆有效流水≥30000，开赛日时可派发58元，无需申请，
                  <br />
                  LPL春季赛开赛当日可点击申请按钮，次日24点前免费派发8元。
                </p>
              </div>

              <table class="promo-table">
                <thead>
                  <tr>
                    <th style="width: 400px">基础</th>
                    <th style="width: 400px">倍投彩金</th>
                    <th style="width: 400px">VIP等级</th>
                    <th style="width: 400px">VIP彩金上限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowspan="6">≥1000元=8元</td>
                    <td rowspan="6">当日LPL+LCK春季赛有效投注/1000*8</td>
                    <td>VIP0~VIP1</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>VIP2~VIP3</td>
                    <td>88</td>
                  </tr>
                  <tr>
                    <td>VIP4~VIP5</td>
                    <td>188</td>
                  </tr>
                  <tr>
                    <td>VIP6~VIP7</td>
                    <td>388</td>
                  </tr>
                  <tr>
                    <td>VIP8~VIP9</td>
                    <td>888</td>
                  </tr>
                  <tr>
                    <td>VIP10~VIP12</td>
                    <td>1288</td>
                  </tr>
                </tbody>
              </table>

              <p>
                例：用户小雷VIP3在
                2024年01月25日LPL春季赛总有效投注20000元，LCK春季赛总有效投注500元，用户小雷符合（20500/1000）*8=164元，由于小雷为VIP3用户达到88元上限，小雷1月26日可获88元彩金。
              </p>

              <div>
                <p>1.活动期间LPL春季赛与LCK春季赛赛事累计有效投注≥1000元即可获得对应彩金；</p>
                <p>
                  2.活动期间每位会员需手动申请，每日可申请一次，活动计算当日LPL春季赛与LCK春季赛总有效投注，次日清零重新计算LPL春季赛与LCK春节赛赛事总有效投注，逾期未申请则视为放弃；
                </p>
                <p>
                  3.活动期间彩金计算方式为：当日LPL春季赛与LCK春季赛总有效投注/1000*8=（彩金金额），每VIP等级达到彩金上限按最高上限派发，彩金次日24小时内统一派发，彩金3倍流水即可提款；
                </p>
                <p>
                  4.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；
                </p>
                <p>
                  5.任何会员或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且会员会被列入黑名单；
                </p>
                <p>6.为避免文字理解差异，雷火电竞保留本活动最终解释权；</p>
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

const activeKey = ref("shout-and-cheer");

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

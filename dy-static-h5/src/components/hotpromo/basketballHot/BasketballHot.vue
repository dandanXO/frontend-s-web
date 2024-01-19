<template>
    <div class="promo-4">
      <div class="tabs">
        <q-tab-panels v-model="activeKey">
          <q-tab-panel name="asia-war-guide">
            <div class="tab1">
              <div class="left-container">
                <img src="../../../assets/images/promotion/hotpromo/asiacup2024/btn1-claim.png" />
              </div>
              <div class="right-container">
                <div class="desc-title">热血迎蓝 战火延续</div>

                <q-btn class="claim-btn" label="立即申请" @click="handleClaim('basketball-hot', '热血迎蓝', 'NBA')" />
              </div>

              <div>
                <div class="img-liner">
                  <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_title.png" />
                </div>
                <div>
                  <p class="text-center">
                    活动期间，会员每天投注体育场馆的NBA赛事与CBA赛事，总有效投注额≥3,000元，即可点击【立即申请】按钮申请彩金，每日最高888元流水彩金！彩金仅需5倍流水即可取款！
                  </p>
                </div>

                <table class="promo-table">
                  <tbody>
                    <tr>
                        <th>有效投注</th>
                        <th>流水彩金</th>
                        <th>流水倍数</th>
                    </tr>
                    <tr>
                        <td>≥3000</td>
                        <td>8</td>
                        <td rowspan="9">5倍有效流水</td>
                    </tr>
                    <tr>
                        <td>≥10,000</td>
                        <td>28</td>
                    </tr>
                    <tr>
                        <td>≥15,000</td>
                        <td>38</td>
                    </tr>
                    <tr>
                        <td>≥30,000</td>
                        <td>68</td>
                    </tr>
                    <tr>
                        <td>≥60,000</td>
                        <td>88</td>
                    </tr>
                    <tr>
                        <td>≥100,000</td>
                        <td>188</td>
                    </tr>
                    <tr>
                        <td>≥300,000</td>
                        <td>388</td>
                    </tr>
                    <tr>
                        <td>≥500,000</td>
                        <td>588</td>
                    </tr>
                    <tr>
                        <td>≥1,000,000</td>
                        <td>888</td>
                    </tr>
                  </tbody>
                </table>

                <div class="img-liner q-mt-xl">
                  <img src="../../../assets/images/promotion/hotpromo/asiacup2024/promo_rule.png" />
                </div>
                <div>
                  <p>1. 本活动计算雷火电竞与IM体育的NBA&CBA当日全部赛事有效投注，每日达到对应有效投注即可领取对应流水彩金。</p>
                  <p>
                    2. 满足活动条件的会员需在当日的23:59:59前登录该页面并点击【立即申请】按钮进行活动申请，逾事不予补偿，申请成功后系统将于次日24小时内自动派发至会员钱包，彩金仅需5倍流水即可取款。
                  </p>
                  <p>
                    3. 流水仅计算当天下注且结算的注单，若提前兑现、注单未结算、取消或走盘皆不及不计算为有效投注。
                  </p>
                  <p>4. 任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。</p>
                  <p>
                    5. 每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消全部优惠的权利。
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

  const handleClaim = (applyPromoCode, applyPromoTitle, applyGameType) => {
    eventapi
      .post("/promo-application/apply", qs.stringify({ promoCode: applyPromoCode, promoTitle: applyPromoTitle, gameType: applyGameType}))
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
            width: 100%;
            color: #2f7cf7;
            font-weight: 600;
            font-size: 38px;
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

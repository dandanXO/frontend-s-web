<template>
  <div class="promo-4">
    <div class="tabs">
      <q-tabs v-model="activeKey">
        <q-tab name="angpao-rain" label="新年红包雨" />
        <q-tab name="cny-gift-pack" label="新年惊喜翻倍礼包" />
        <q-tab name="cny-celebration" label="亲朋好友 欢度新年" />
      </q-tabs>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="angpao-rain">
          <div class="head-title">
            <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-01.png" />
          </div>

          <div class="join-container">
            <div class="join-btn" @click="goToHongbaoyu()">
              <img src="../../../assets/images/promotion/hotpromo/cny2024/btn-join.png" />
            </div>
          </div>

          <div class="table-container">
            <div class="table-date">2/9/~2/11</div>

            <table border="0">
              <thead>
                <tr>
                  <td>新年红包发放时间</td>
                  <td>每日次数</td>
                  <td>当日红包开启时间</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024年02月09日</td>
                  <td rowspan="3">3次</td>
                  <td rowspan="3">15:00、18:00、20:00</td>
                </tr>
                <tr>
                  <td>2024年02月10日</td>
                </tr>
                <tr>
                  <td>2024年02月11日</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rules-container">
            <div class="rules-title">活动规则</div>
            <ol class="rules-content">
              <li>活动需每日充值≥100元且通过活动页面参与，未点击则视为放弃参与活动；</li>
              <li>红包金额随机不等，单个红包金额最大为1888元，红包奖金完成3倍水即可提现。</li>
              <li>每轮抢红包有效时间为1个小时（抢完为止）每轮开启1个小时后，红包自动关闭，等待下一轮抢红包时间。</li>
              <li>
                领取方式：【手机版】登录雷火APP或者手机网页→点击优惠→点击红包活动图→即可进入抢红包页面。电脑版：只需点击官网首页右侧“红包”漂浮图案，即可进入抢红包页面。
              </li>
              <li>
                此优惠活动只适用于拥有一个独立账户的玩家。住址、电子邮箱地址、电话号码、支付方式（相同借记卡/信用卡/银行账户号码）IP地址、同一网络环境等将可以作为判定是否独立玩家的条件。
              </li>
              <li>雷火电竞有权延长、缩短、终止，或者修改此活动！最终解释权归雷火电竞所有。</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="cny-gift-pack">
          <div class="head-title">
            <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-02.png" />
          </div>

          <div class="table-container">
            <div class="table-date">2/9/~2/18</div>

            <table border="0">
              <thead>
                <tr>
                  <td>每日存款</td>
                  <td>彩金</td>
                  <td>流水倍数</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>≥1,000</td>
                  <td>签到彩金*2</td>
                  <td rowspan="5">3倍</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>8+签到彩金*2+当日红包彩金*2</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>58元+签到彩金*2+当日红包彩金*2</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>208元+签到彩金*3+当日红包彩金*3</td>
                </tr>
                <tr>
                  <td>≥100,000</td>
                  <td>588元+签到彩金*5+当日红包彩金*5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rules-container">
            <div class="rules-title">活动规则</div>
            <ol class="rules-content">
              <li>活动期间每日存款达到对应条件即可获得对应条件彩金，彩金于次日24小时内派发至会员账号；</li>
              <li>
                红包彩金仅限2024年2月9日至2024年2月11日，超出红包彩金活动时间则当日红包彩金不计算本活动派发范围内；
              </li>
              <li>活动期间彩金每日只按符合最高彩金条件派发一次；</li>
              <li>活动仅限VIP1及VIP1以上会员参与，彩金3倍流水即可出款；</li>
              <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="activeKey">
        <q-tab-panel name="cny-celebration">
          <div class="head-title">
            <img src="../../../assets/images/promotion/hotpromo/cny2024/head-title-03.png" />
          </div>

          <div class="join-container">
            <div class="join-btn" @click="router.push('/account/invite')">
              <img src="../../../assets/images/promotion/hotpromo/cny2024/btn-join.png" />
            </div>
          </div>

          <div class="table-container">
            <div class="table-date">2/9/~2/11</div>

            <table border="0">
              <thead>
                <tr>
                  <td>新用户首存金额</td>
                  <td>推荐奖金</td>
                  <td>流水要求</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>≥100</td>
                  <td>28</td>
                  <td rowspan="6">1倍/不限制场馆</td>
                </tr>
                <tr>
                  <td>≥1,000</td>
                  <td>108</td>
                </tr>
                <tr>
                  <td>≥5,000</td>
                  <td>158</td>
                </tr>
                <tr>
                  <td>≥10,000</td>
                  <td>388</td>
                </tr>
                <tr>
                  <td>≥30,000</td>
                  <td>1588</td>
                </tr>
                <tr>
                  <td>≥50,000</td>
                  <td>1888</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rules-container">
            <div class="rules-title">活动规则</div>
            <ol class="rules-content">
              <li>
                每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，在单周内
                邀请人能最高可获得4208元。
              </li>
              <li>
                您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
                刷新1次，期间每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃。
              </li>
              <li>
                例如：会员A邀请一位好友首存100元，则可获取28元奖金；若想获取下一档位128元，则需好友再次存1000元；奖金将会自动派
                发至主钱包。
              </li>
              <li>邀请人等级不得低于青铜Ⅰ（vip2）</li>
              <li>
                普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
              </li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
                注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
                个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>

  <div class="bottom-bg"><img src="../../../assets/images/promotion/hotpromo/cny2024/bottom-bg.png" /></div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const store = userStore();
const router = useRouter();

const activeKey = ref("angpao-rain");

const goToHongbaoyu = async () => {
  // Navigate to the root path
  await router.push("/");
  router.push("/promo?name=hongbaoyu");
};
</script>

<style scoped lang="scss">
.promo-4 {
  .tabs {
    .q-tabs {
      height: 64px;
      // line-height: 64px;
      text-align: center;

      // background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
      background: transparent;
      margin: 0;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .q-tab {
      flex: 1;
      color: #c60000;
      font-weight: bold;
      border-radius: 0;
      background-image: url("../../../assets/images/promotion/hotpromo/cny2024/btn-inactive.png");
      background-size: 100% 100%;
      background-position: bottom center;
      background-color: transparent;
      padding: 0 0 12px;

      &--active {
        // background: #6ad8ff;
        color: #ffed90;
        background-image: url("../../../assets/images/promotion/hotpromo/cny2024/btn-active.png");
      }

      :deep(.q-tab__label) {
        font-weight: 800;
        font-size: 11px;
      }
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      color: #ffffff;
      background: white;
      padding: 30px 20px;

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

        .desc {
          width: 90%;
          color: #87898a;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
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

.head-title {
  margin-top: 10px;
}

.join-container {
  display: flex;
  justify-content: center;
  background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-join.png");
  background-size: 100%;
  background-repeat: no-repeat;
  .join-btn {
    :hover {
      filter: brightness(0.8);
    }
    img {
      display: block !important;
      width: 150px !important;
    }
  }
}

.table-container {
  padding: 0 20px;
  .table-date {
    color: #ff3f3f;
    margin-bottom: 10px;
  }

  table {
    thead {
      tr {
      }
      td {
        color: #c60000;
        font-weight: 800;
        background-color: #ffdada !important;
        border: 0 !important;
        padding: 15px 5px !important;

        &:first-child {
          border-top-left-radius: 20px;
          background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-table.png");
          background-position: top left;
          background-repeat: no-repeat;
          background-size: 34px 45px;
          padding-left: 30px !important;
        }

        &:last-child {
          border-top-right-radius: 20px;
          background-image: url("../../../assets/images/promotion/hotpromo/cny2024/bg-table.png");
          background-position: top right;
          background-repeat: no-repeat;
          background-size: 34px 45px;
          padding-right: 30px !important;
        }
      }
    }
    tbody {
      td {
        border: 1px solid #ecedf0 !important;
        color: #b97a7a;
      }
    }
  }
}

.rules-container {
  margin-top: 20px;
  padding: 0 20px;

  .rules-title {
    color: #c60000;
    font-weight: 600;
  }

  .rules-content {
    color: #b97a7a;

    li {
      margin-bottom: 10px !important;
    }
  }
}

.bottom-bg {
  // margin-left: -5%;
  // margin-right: -5%;
}
</style>

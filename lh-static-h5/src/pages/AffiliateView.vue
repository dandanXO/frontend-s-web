<template>
  <div class="affiliate-container">
    <div class="page-title">雷火合营计划</div>

    <div class="branding">
      <div class="branding-wrapper">
        <img class="hand-img" src="../assets/images/affiliate/hand.png" alt="" />
        <div class="desc-container">
          <div class="title">最专业的团队</div>
          <div class="desc">Professional Team</div>
        </div>
      </div>
      <div class="branding-wrapper">
        <img class="headset-img" src="../assets/images/affiliate/headset.png" alt="" />
        <div class="desc-container">
          <div class="title">最优质的服务</div>
          <div class="desc">Best Quality Service</div>
        </div>
      </div>
      <div class="branding-wrapper">
        <img class="vg-img" src="../assets/images/affiliate/vg.png" alt="" />
        <div class="desc-container">
          <div class="title">VG战队官方合作伙伴</div>
          <div class="desc">VG Official Partner</div>
        </div>
      </div>
    </div>

    <div class="ambassador">
      <img class="ambassador-img" src="../assets/images/affiliate/ambassador.png" alt="" />
      <div class="btn-wrapper">
        <q-btn
          :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"
          label="加入我们"
          size="md"
          class="join-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
        </q-btn>
        <q-btn
          :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"
          label="登录"
          size="md"
          class="login-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
        </q-btn>

        <!--        @click.stop.prevent="-->
        <!--        openWindow(-->
        <!--        `https://csweb01.amv4xjcbd.com/?partnerCode=LHCS&lang=zh-CN&way=${regDevice}&token=${store.token}`,-->
        <!--        'Chat Server',-->
        <!--        350,-->
        <!--        650-->
        <!--        )-->
        <!--        "-->
        <q-btn
          :href="affiliateUrl + 'login?view=2&agent=' + (affCode ? affCode : '')"
          label="联系我们"
          size="md"
          class="contact-btn"
        >
          <img class="mask" src="../assets/images/affiliate/btn-mask-white.png" alt="" />
        </q-btn>
      </div>
    </div>

    <div class="esport-commission">
      <div class="section-title">电竞佣金方案</div>
      <div class="subtitle">分红条款</div>
      <ul>
        <li>月充值金额>200元为活跃玩家，当月需要至少五个活跃会员才能结算佣金。</li>
        <li>当月的佣金分佣发放时间为下个月的五号到十号回结算完毕。</li>
        <li>分红有系统直接发放到代理账户，无需流水，绑定银行卡后即可申请提款。</li>
        <li>
          代理佣金计算方式：
          <ul>
            <li>「（投注输赢额-优惠100%）-（存款+提款）*1.6%-平台费*8%」*佣金比例</li>
          </ul>
        </li>
        <li>
          代理推广费每月至少需要新注册活跃会员达到3名，如无达到将视为无推广雷火平台，佣金减半，如果三个月累计新注册活跃会员未达到十位将会停用代理账户等待代理重新联系网站开启。
        </li>
      </ul>
    </div>

    <div class="table-commission">
      <div class="section-title">佣金如何计划</div>
      <q-table
        flat
        :hide-pagination="true"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :rows-per-page-options="[0]"
      ></q-table>
      <div class="red-note">备注：盈利=线下会员在所有场馆的总输赢减去会员申请的所有优惠</div>

      <div class="section-title">佣金如何计划</div>
      <div class="sample-container">
        <q-card-section>
          <div>例子1:存款1000元 提款0元 优惠申请100元</div>
          <div class="cell-wrapper">
            <div>平台输赢</div>
            <div>1100</div>
          </div>
          <div class="cell-wrapper">
            <div>扣除申请优惠</div>
            <div>-100</div>
          </div>
          <div class="cell-wrapper">
            <div>扣除存提手续费1.6%</div>
            <div>-16</div>
          </div>
          <div class="cell-wrapper">
            <div>平台服务费</div>
            <div>88</div>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="cell-wrapper">
            <div>盈利</div>
            <div>898</div>
          </div>
          <div class="cell-wrapper">
            <div>乘以佣金比例</div>
            <div>*35%</div>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="cell-wrapper">
            <div>代理佣金</div>
            <div>313.6</div>
          </div>
        </q-card-section>
      </div>
      <div class="red-note">备注：存提手续费=存款加上提款总额的1.6%</div>

      <div class="sample-container">
        <q-card-section>
          <div>例子1:存款130000元 提款10000元 优惠申请2000元 余额500</div>
          <div class="cell-wrapper">
            <div>平台输赢</div>
            <div>122000</div>
          </div>
          <div class="cell-wrapper">
            <div>扣除申请优惠</div>
            <div>-2000</div>
          </div>
          <div class="cell-wrapper">
            <div>扣除存提手续费1.6%</div>
            <div>-2240</div>
          </div>
          <div class="cell-wrapper">
            <div>平台服务费</div>
            <div>9760</div>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="cell-wrapper">
            <div>盈利</div>
            <div>108,000</div>
          </div>
          <div class="cell-wrapper">
            <div>乘以佣金比例</div>
            <div>*40%</div>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <div class="cell-wrapper">
            <div>代理佣金</div>
            <div>43200</div>
          </div>
        </q-card-section>
      </div>
    </div>

    <div class="contact-us">
      <div class="register-btn-wrapper">
        <q-btn
          :href="affiliateUrl + 'login?agent=' + (affCode ? affCode : '')"
          label="立即申请代理"
          size="lg"
          class="register-btn"
        >
          <img class="mask-img" src="../assets/images/affiliate/register-btn-icon.png" alt="" />
          <img class="mask-img2" src="../assets/images/affiliate/register-btn-icon2.png" alt="" />
        </q-btn>
      </div>

      <!--      @click.stop.prevent="-->
      <!--      openWindow(-->
      <!--      `https://csweb01.amv4xjcbd.com/?partnerCode=LHCS&lang=zh-CN&way=${regDevice}&token=${store.token}`,-->
      <!--      'Chat Server',-->
      <!--      350,-->
      <!--      650-->
      <!--      )-->
      <!--      "-->

      <div class="contact-info">
        <div class="title-wrapper">
          <div class="section-title">联系我们</div>
          <div class="two-four-hour-wrapper">
            <img class="two-four-mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
            <img class="two-four-mask" src="../assets/images/affiliate/btn-mask-blue.png" alt="" />
            <div class="two-four-content">
              <a :href="affiliateUrl + 'login?view=2&agent=' + (affCode ? affCode : '')" target="_blank">
                <img class="two-four-img" src="../assets/images/affiliate/headset-white.png" alt="" />
                <span class="two-four-text">24小时在线客服</span>
              </a>
            </div>
          </div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">合营部电邮</div>
          <div class="contact-id">affiliate@e8007.com</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">合营部skype</div>
          <div class="contact-id">live:.cd.ff6111f0549375a8 (点击图标以联系，联系时请提供用户名)</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">合营部letstalk</div>
          <div class="contact-id">t403523198</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">合营部Telegram</div>
          <div class="contact-id">LH18668</div>
        </div>
        <div class="contact-wrapper">
          <div class="contact-method">合营部泡泡</div>
          <div class="contact-id">LH10086</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "../stores/index";
import { Platform } from "quasar";
import { ref } from "vue";

const affiliateUrl = ref("https://lh1-affiliate.phoicynxeey.com/lh/");

const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
  const left = (screen.width - popupWinWidth) * 2;
  const top = (screen.height - popupWinHeight) / 4;
  window.open(
    pageURL,
    pageTitle,
    "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
  );
};

const affCode = sessionStorage.getItem("AFFILIATE_CODE");
const regDevice = Platform.is.mobile ? "H5" : "WEB";
const store = userStore();

const columns = [
  {
    name: "agent",
    required: true,
    label: "代理",
    align: "center",
    field: (row) => row.name
  },
  { name: "profit", label: "盈利", field: "profit", align: "center" },
  { name: "activeMember", label: "有效活跃会员", field: "activeMember", align: "center" },
  { name: "commission", label: "佣金比例", field: "commission", align: "center" }
];
const rows = [
  {
    name: "铜牌",
    profit: "<10W",
    activeMember: "5",
    commission: "35%"
  },
  {
    name: "银牌",
    profit: "10W-30W",
    activeMember: "10",
    commission: "40%"
  },
  {
    name: "金牌",
    profit: "30W-60W",
    activeMember: "25",
    commission: "45%"
  },
  {
    name: "钻石",
    profit: "60W-100W",
    activeMember: "50",
    commission: "50%"
  },
  {
    name: "皇冠",
    profit: ">100W",
    activeMember: "80",
    commission: "55%"
  }
];
</script>

<style lang="scss">
.affiliate-container {
  padding: 1.5rem;
  background: url("../assets/images/affiliate/page-bg.png");
  background-repeat: no-repeat;
  background-size: contain;

  .page-title {
    word-break: keep-all;
    text-align: center;
    text-shadow: 0px 7.804098606109619px 7.804098606109619px rgba(0, 0, 0, 0.47),
      3.9020493030548096px 3.9020493030548096px 0px #9da6d4;
    font-family: FZTanHeiS-B-GB;
    font-size: 3.46239rem;
    font-weight: 400;
    background: url("../assets/images/affiliate/title-bg.jpeg"), lightgray 50% / cover no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #b1e4ff;
  }

  .branding {
    display: flex;
    justify-content: space-between;
    padding: 0 1.25rem;
    margin: 1.25rem 0 2rem 0;

    .branding-wrapper {
      display: flex;

      .hand-img,
      .headset-img,
      .vg-img {
        width: 1.25rem;
        height: 1.25rem;
        margin: 0.15rem 0.25rem 0 0;
      }

      .desc-container {
        .title {
          color: $font-2;
          text-align: left;
          text-shadow: 1.1197850704193115px 1.1197850704193115px 0px #9da6d4;
          font-family: FZTanHeiS-B-GB;
          font-size: 1rem;

          font-weight: 400;
          line-height: normal;
        }

        .desc {
          color: $font-2;
          text-align: left;
          font-family: PingFang SC;
          font-size: 0.75rem;

          font-weight: 500;
          line-height: normal;
          margin: 0 0 0 0.05rem;
        }
      }
    }
  }

  .ambassador {
    display: flex;
    justify-content: center;
    padding: 0 1rem;

    .ambassador-img {
      width: 50%;
    }

    .btn-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 7.5rem;
      margin: 1.5rem 2rem 0 2rem;

      color: #fff;
      text-align: center;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: normal;
      word-break: keep-all;

      .join-btn,
      .login-btn {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #93c7ff inset, 0px -3.664px 3.664px 0px #275ec1 inset;
        overflow: hidden;

        .mask {
          width: 7rem;
          position: absolute;
          z-index: -1;
        }
      }

      .contact-btn {
        background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #bbdcff inset, 0px -3.664px 3.664px 0px #a2bff4 inset;
        overflow: hidden;
        color: $font-1;

        .mask {
          width: 7rem;
          position: absolute;
          z-index: -1;
        }
      }
    }
  }

  .esport-commission {
    ul {
      list-style-type: decimal;
      padding-inline-start: 0;
      padding: 0 1rem;

      li {
        color: $font-1;
        font-family: PingFang SC;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0.25rem 0;
        ul {
          padding: 0;
          li {
            list-style-type: none;
          }
        }
      }
    }

    .subtitle {
      color: $font-2;
      font-family: PingFang SC;
      font-size: 0.9rem;
      font-weight: 400;
    }
  }

  .table-commission {
    margin: 2rem 0 0 0;

    thead {
      th {
        font-size: 1.15rem;
        font-weight: 600;
        color: $font-2;
        border-bottom-width: 0;
      }
    }
    thead > :first-child {
      background: $lightblue;
    }

    td:not(:last-child) {
      border-right-width: 1px;
      border-color: #ecedf0;
    }

    td {
      color: $font-1;
      font-family: PingFang SC;
      font-size: 1rem;
      font-weight: 400;
    }

    .red-note {
      color: $negative;
      font-family: PingFang SC;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: normal;
      margin: 0.75rem 0;
    }

    .sample-container {
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
      padding: 1rem;

      color: $font-1;
      font-family: PingFang SC;
      font-size: 1rem;

      font-weight: 400;
      line-height: 2;

      .cell-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .contact-us {
    margin: 2.5rem 0;
    .register-btn-wrapper {
      position: relative;

      .register-btn {
        width: 100%;
        color: #fff;
        text-align: center;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: normal;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px 4.58px 4.58px 0px #93c7ff inset, 0px -3.664px 3.664px 0px #275ec1 inset;
      }

      .mask-img {
        position: absolute;
        left: 2.5rem;
        top: 0.25rem;
        width: 7rem;
      }

      .mask-img2 {
        position: absolute;
        right: 2.5rem;
        top: 0.25rem;
        width: 7rem;
      }
    }

    .contact-info {
      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 2.25rem;

        .two-four-hour-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 7rem;
          border-radius: 0.25rem;
          overflow: hidden;
          background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
          box-shadow: 0px 2.7097px 2.7097px 0px #93c7ff inset, 0px -2.16776px 2.16776px 0px #275ec1 inset;

          .two-four-mask {
            height: 1.5rem;
          }

          .two-four-content {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;

            .two-four-img {
              width: 1rem;
              margin: 0 0.25rem 0 0;
            }

            .two-four-text {
              color: white;
              font-size: 0.7379rem;
            }
          }
        }
      }

      .contact-wrapper {
        margin: 1rem 0;

        .contact-method {
          color: $font-1;
          font-family: PingFang SC;
          font-size: 1rem;
          font-weight: 400;
        }

        .contact-id {
          color: $grey-color;
          font-size: 1rem;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }

  .section-title {
    color: $primary;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: normal;
    margin: 1rem 0;
  }
}

.body--dark {
  .affiliate-container {
    .ambassador {
      .btn-wrapper {
        .join-btn,
        .login-btn {
          background: url("../assets/images/common/common-md-btn-dark.png") no-repeat;
          background-size: 100% 100%;
          box-shadow: none;
        }
        .contact-btn {
          background: url("../assets/images/common/common-md-white-btn-dark.png") no-repeat;
          background-size: 100% 100%;
          box-shadow: none;
          color: $white;
        }
        .mask {
          display: none;
        }
      }
    }
    .section-title {
      color: $primary-dark;
    }
    .contact-us {
      .register-btn-wrapper {
        .register-btn {
          background: $linear-bg-180-dark;
          box-shadow: 0px -2.28px 5.21px 0px #93F2FF inset;
        }
      }
      .contact-info {
        .title-wrapper {
          .two-four-hour-wrapper {
            background: $linear-bg-180-dark;
          }
        }
      }
    }
    .page-title {
      -webkit-text-stroke-color: $font-3-dark;
      text-shadow: 0px 7.8040986061px 7.8040986061px rgba(0, 0, 0, 0.47), 3.9020493031px 3.9020493031px 0px #9da6d4;
    }
    .branding {
      .branding-wrapper {
        .desc-container {
          .title,
          .desc {
            color: $font-3-dark;
            text-shadow: none;
          }
        }
      }
    }
    .esport-commission {
      .subtitle {
        color: $font-3-dark;
      }
    }
    .table-commission {
      .q-table__container {
        background: $background-dark-light;
        thead {
          > :first-child {
            background: $background-dark-header;
            th {
              color: $font-3-dark;
              &:not(:last-child) {
                border-right: 1px solid $border-dark;
              }
            }
          }
        }
        td:not(:last-child) {
          border-color: $border-dark;
        }
      }

      .sample-container {
        @include content-block-dark;
      }
    }
  }
}
</style>

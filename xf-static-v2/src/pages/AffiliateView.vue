<template>
  <div class="wrapper">
    <div class="affiliate">
      <img src="../assets/images/affiliate/affiliate_plan_title.png" />
      <div class="affiliate-container">
        <img src="../assets/images/affiliate/affiliate_plan_img.png" />
        <div class="btn-group">
          <img
            src="../assets/images/affiliate/join_us_btn.png"
            @click="navigateToUrl('https://affiliate-web.gwd4jptunz.com/xf/register?agent=' + (affCode ? affCode : ''))"
          />
          <img
            src="../assets/images/affiliate/login_btn.png"
            @click="navigateToUrl('https://affiliate-web.gwd4jptunz.com/xf/login')"
          />
          <img
            src="../assets/images/affiliate/email_btn.png"
            @click.stop.prevent="
              openWindow(
                `https://csweb01.amv4xjcbd.com/?partnerCode=XFCS&lang=zh-CN&way=${regDevice}&token=${store.token}`,
                '在线客服',
                350,
                650
              )
            "
          />
        </div>
      </div>
      <!-- <div class="buttons">
        <a :href="'https://affiliate-web.gwd4jptunz.com/xf/register?agent=' + (affCode ? affCode : '')">加入我们</a>
        <a href="https://affiliate-web.gwd4jptunz.com/xf/login">登录</a>
        <a
          @click.stop.prevent="
            openWindow(
              `https://csweb01.amv4xjcbd.com/?partnerCode=XFCS&lang=zh-CN&way=${regDevice}&token=${store.token}`,
              '在线客服',
              350,
              650
            )
          "
        >
          联系我们
        </a>
      </div> -->
    </div>
    <div class="affiliate-program">
      <div class="affiliate-main-title">兴發佣金方案</div>
      <div class="affiliate-subgroup agent-content-item">
        <div class="affiliate-sub" style="margin-top: 0">
          <div class="affiliate-subtitle">分红条款</div>
          <ul>
            <li>月充值金额≥200元为活跃玩家,当月需要至少五个活跃会员才能结算佣金。</li>
            <li>当月的佣金分佣发放时间为下个月的五号到十号会结算完毕。</li>
            <li>佣金有系统直接发放到代理账户，无需流水，绑定银行卡后即可申请提款。</li>
            <li>
              代理佣金计算方式：
              <br />
              <span class="agent-stress-tip">「（投注输赢额-优惠100%）-（存款+提款）*1.6%-平台费*8%」*佣金比例</span>
            </li>
            <li>
              代理推广每月至少需要新注册活跃会员达到3名，如无达到将视为无推广兴發平台，佣金减半，如果三个月累计新注册活跃会员未达到十位将会停用代理账户等待代理重新联系网站开启。
            </li>
          </ul>
        </div>
        <div class="affiliate-sub">
          <div class="affiliate-main-title q-mt-xs">佣金如何计划</div>
          <RowHeaderTable
            :header-data="['代理', '盈利', '有效活跃会员', '佣金比例']"
            :row-data="[
              ['铜牌', '＜10W', '5', '35%'],
              ['银牌', '10W-30W', '10', '40%'],
              ['金牌', '30W-60W', '25', '45%'],
              ['钻石', '60W-100W', '50', '50%'],
              ['皇冠', '＞100W', '88', '55%']
            ]"
          />
          <div class="agent-stress-tip">备注：盈利=线下会员在所有场馆的总输赢减去会员申请的所有优惠</div>
        </div>
      </div>
      <div class="affiliate-subgroup agent-content-item">
        <div class="affiliate-sub">
          <div class="affiliate-main-title q-mt-md">计算公式</div>
          <div class="agent-demo-bg">
            <div class="agent-demo-container">
              <div>例子1： 存款1000元 提款0元 优惠申请100元</div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">平台输赢</div>
                    <div class="txt-right">1100</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">扣除申请优惠</div>
                    <div class="txt-right">-100</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">扣除存提手续费1%</div>
                    <div class="txt-right">-10</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">平台服务费</div>
                    <div class="txt-right">88</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">盈利</div>
                    <div class="txt-right">902</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">乘以佣金比例</div>
                    <div class="txt-right">*35%</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">代理佣金</div>
                  <div class="txt-right">315.7</div>
                </div>
              </div>
            </div>
          </div>
          <div class="agent-stress-tip q-mb-sm">备注：存提手续费=存款加上提款总额的1%</div>
        </div>
        <div class="affiliate-sub">
          <div class="agent-demo-bg">
            <div class="agent-demo-container">
              <div>例子2：存款130000元 提款10000元 优惠申请2000元 余额500</div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">平台输赢</div>
                    <div class="txt-right">122000</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">扣除申请优惠</div>
                    <div class="txt-right">-2000</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">扣除存提手续费1%</div>
                    <div class="txt-right">-1400</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">平台服务费</div>
                    <div class="txt-right">9760</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">盈利</div>
                    <div class="txt-right">108840</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">乘以佣金比例</div>
                    <div class="txt-right">*40%</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">代理佣金</div>
                  <div class="txt-right">43536</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="agent-reg-btn">
        <img
          src="../assets/images/affiliate/apply_agency_btn.png"
          @click="navigateToUrl('https://affiliate-web.gwd4jptunz.com/xf/register?agent=' + (affCode ? affCode : ''))"
        />
        <!-- <a
          :href="'https://affiliate-web.gwd4jptunz.com/xf/register?agent=' + (affCode ? affCode : '')"
          class="agent-reg-btn"
        >
          立即申请代理
        </a> -->
      </div>
      <div class="contact-us-container">
        <div class="customer-service">
          <span class="affiliate-main-title">联系我们</span>
          <img src="../assets/images/affiliate/customer_service_btn.png" />
        </div>
        <div class="contact-item">
          <span class="label">合营部电邮</span>
          <span class="info">affiliate@e8007.com</span>
        </div>
        <div class="contact-item">
          <span class="label">合营部skype</span>
          <span class="info">
            live:.cd.ff6111f0549375a8(
            <a href=""><img class="skype_icon" src="../assets/images/affiliate/agent_skype.png" /></a>
            点击图标以联系，联系时请提供用户名)
          </span>
        </div>
        <div class="contact-item">
          <span class="label">合营部letstalk</span>
          <span class="info">t403523198</span>
        </div>
        <div class="contact-item">
          <span class="label">合营部Telegram</span>
          <span class="info">LH18668</span>
        </div>
        <div class="contact-item">
          <span class="label">合营部QQ</span>
          <span class="info">1903687863</span>
        </div>
      </div>
      <!-- <div class="agent-contact-bg">
        <div id="contactDetail" class="agent-contact-main">
          <div class="agent-contact-logo">
            <div>
              <img src="../assets/images/affiliate/agent_index_logo.png" />
            </div>
            <div>联系我们</div>
          </div>
          <div class="agent-contact-ways">
            <div class="agent-ways-box" style="margin-top: 0">
              <div class="agent-ways-way">合营部电邮</div>
              <div class="agent-ways-val">affiliate@xf926.com</div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营QQ</div>
              <div class="agent-ways-val">1193911745（工作时间：14:00-23:00）</div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营Skype</div>
              <div class="agent-ways-val">
                live:.cid.2e3257b6f3c30c1（
                <a href=""><img src="../assets/images/affiliate/agent_skype.png" /></a>
                点击图标以联系，联系时请提供用户名)
              </div>
            </div>
            <div class="agent-ways-box">
              <div class="agent-ways-way">合营Flygram</div>
              <div class="agent-ways-val">搜索ID：XF666888 (下载链接: https://www.flygram8.com)</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
// import { useI18n } from "vue-i18n";
import { userStore } from "../stores/index";
import { Platform } from "quasar";
import RowHeaderTable from "src/components/RowHeaderTable.vue";

export default defineComponent({
  components: {
    RowHeaderTable
  },
  setup() {
    // const { t } = useI18n();
    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      // console.log(top)
      window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
      );
    };

    const navigateToUrl = (url) => {
      window.location.href = url;
    };

    const regDevice = Platform.is.mobile ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Total Member Nett Winloss (MYR)",
        dataIndex: "winLoss",
        key: "winLoss"
      },
      {
        title: "Total Active Player",
        dataIndex: "activePlayer",
        key: "activePlayer"
      },
      {
        title: "Commission Rate",
        dataIndex: "commsRate",
        key: "commsRate"
      }
    ];
    const data = [
      {
        key: "1",
        winLoss: "5 and above",
        activePlayer: "< 5",
        commsRate: "12%"
      },
      {
        key: "2",
        winLoss: "5-66,825",
        activePlayer: "≥ 5",
        commsRate: "28%"
      },
      {
        key: "3",
        winLoss: "66,826 and above",
        activePlayer: "≥ 5",
        commsRate: "40%"
      }
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      data,
      affCode,
      regDevice,
      store,
      openWindow,
      navigateToUrl
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  background-color: #1a2338;
  font-size: 12px;
  font-family: PingFang SC;

  .affiliate {
    background: #1a2338;
    // margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    > img {
      width: 50%;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .affiliate-container {
      display: flex;
      padding-left: 10%;
      padding-right: 10%;
      > img {
        width: 60%;
        height: 60%;
      }
      .btn-group {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-evenly;
        > img {
          width: 80%;
        }
      }
    }
    // .buttons {
    //   display: flex;
    //   gap: 20px;
    //   width: 100%;
    //   margin: 0 auto;
    //   justify-content: center;
    //   align-items: center;
    //   flex-direction: column;
    //   padding: 50px 0;
    //   a {
    //     text-decoration: none;
    //     display: block;
    //     width: 221px;
    //     height: 78px;
    //     text-align: center;
    //     line-height: 78px;
    //     color: #e4e4e4;
    //     letter-spacing: 2px;
    //     font-size: 18px;
    //     cursor: pointer;
    //     background-image: url(../assets/images/affiliate/agent_index_btn.jpg);
    //     background-position: center;
    //     background-repeat: no-repeat;
    //     background-size: cover;
    //   }
    // }
    // .steps {
    //   background: #1e1b2e;
    //   padding: 40px;
    //   width: 95%;
    //   margin: 50px auto;
    //   max-width: 1200px;
    //   display: flex;
    //   justify-content: space-between;
    //   .step {
    //     display: flex;
    //     color: #ffffff;
    //     gap: 10px;
    //     justify-content: flex-start;
    //     align-items: center;
    //     .stepdesc {
    //       flex-direction: column;
    //       display: flex;
    //     }
    //     .game-title {
    //       font-family: Wave;
    //       color: #ffd200;
    //     }
    //   }
    // }
  }
  .affiliate-program {
    color: #96b6d4;
    text-align: left;
    width: 100%;
    padding: 20px;
    margin: 10px auto 0;
    .affiliate-main-title {
      font-size: 18px;
      font-weight: 600;
      color: #00bfd7;
      margin-bottom: 10px;
    }
    .affiliate-subgroup {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      .affiliate-sub {
        flex: 1;
        width: 100%;
        .affiliate-subtitle {
          font-size: 14px;
          color: #ffffff;
        }
      }
    }

    .agent-content-item {
    }
    .agent-content-item ul {
      margin-left: 16px;
      padding: 0;
      line-height: 22px;
    }
    .agent-content-item ul li {
      list-style: decimal;
      // margin-bottom: 41px;
    }
    .agent-content-item table {
      width: 100%;
      background-color: #151823;
      margin-top: 10px;
    }
    .agent-content-item table td,
    .agent-content-item table th {
      width: 25%;
      text-align: center;
    }
    .agent-content-item table td {
      height: 60px;
    }
    .agent-content-item table th {
      color: #fff;
      height: 56px;
      font-weight: normal;
      background-color: #193f6a;
    }
    .agent-stress-tip {
      color: #ee4148;
      margin-top: 21px;
    }
    .agent-demo-bg {
      background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
      // padding: 10px 40px 24px 40px;
      line-height: 32px;
      margin-top: 10px;

      border: 1px solid transparent;
      border-radius: 10px;
      background-image: linear-gradient(180deg, #384e79 0%, #212e4b 100%),
        linear-gradient(180deg, rgba(0, 191, 215, 0) 0%, #00bfd7 75.68%);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }
    .agent-demo-container {
      margin: 8px 16px;
    }
    .agent-demo-btm {
      border-bottom: 1px solid #242c3f;
    }
    .agent-demo-table {
      display: table;
      width: 100%;
    }
    .agent-demo-table-tr {
      display: table-row;
    }
    .agent-demo-table-tr div {
      display: table-cell;
      width: 50%;
    }
    .txt-left {
      text-align: left !important;
    }
    .txt-right {
      text-align: right !important;
    }
    .agent-reg-btn {
      cursor: pointer;
      margin-top: 20px;
      > img {
        width: 100%;
      }
    }

    .contact-us-container {
      margin-top: 16px;
      .customer-service {
        display: flex;
        align-items: center;
        > span {
          margin: 0;
        }
        > img {
          margin-left: 10px;
          width: 100px;
          height: 20px;
        }
      }
      .contact-item {
        display: flex;
        flex-direction: column;
        line-height: 22px;
        margin-top: 14px;
        .label {
          color: #7a80a1;
        }
        .info {
          color: #a4aabb;
        }
      }
    }

    .skype_icon {
      width: 20px;
      height: 20px;
    }

    .agent-contact-bg {
      background-color: #0f121f;
      border-radius: 5px;
      margin-top: 50px;
    }
    .agent-contact-main {
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      padding: 30px;
    }
    .agent-contact-logo {
      width: 150px;
      text-align: center;
      font-size: 24px;
      color: #bacef1;
    }
    .agent-contact-ways {
    }
    .agent-ways-box {
      margin-top: 25px;
    }
    .agent-ways-way {
      font-size: 16px;
      color: #bacef1;
    }
    .agent-ways-val {
      font-size: 16px;
      color: #506180;
    }
    .agent-contact-ewm {
      width: 150px;
    }
    .agent-contact-ewm img {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="affiliate-title">
      <img src="../assets/logo.svg" style="width: 200px;">
        {{ $t('affiliate.englishText') }}
      </div>
      <div class="affiliate-desc">
        <img src="../assets/images/affiliate/professional-team.png" height="55">
        <img src="../assets/images/affiliate/best-quality-service.png" height="55">
        <img src="../assets/images/affiliate/official-partner.png" height="55">
      </div>
      <div class="buttons">
        <a :href="'https://www.4luckypartner.com/?langge=' + languageVal + '&agent=' + (affCode ? affCode : '')">{{ $t('affiliate.joinus') }}</a>
        <a class="outline" :href="'https://www.4luckypartner.com/?langge=' + languageVal + '&agent=' + (affCode ? affCode : '')">{{ $t('affiliate.login') }}</a>
        <a class="outline" @click.stop.prevent="store.openLiveChat()">
          {{ $t('affiliate.contactus') }}
        </a>
      </div>
      <div class="affiliate-join">
        <img :src="require(`../assets/images/affiliate/join-${languageVal}.png`)" width="696">
      </div>

      <div class="affiliate-program">
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
            <div class="affiliate-subtitle">{{ $t('affiliate.eSportsCommissionProgram') }}</div>
            <div class="affiliate-terms">{{ $t('affiliate.bonusTerms') }}</div>
            <ul>
              <li>{{ $t('affiliate.activePlayerRequirement') }}</li>
              <li>{{ $t('affiliate.commissionIssuance') }}</li>
              <li>{{ $t('affiliate.directCommissionIssuance') }}</li>
              <li>{{ $t('affiliate.commissionCalculation') }}</li>
              <li>{{ $t('affiliate.promotionRequirement') }}</li>
            </ul>
          </div>
          <div class="affiliate-sub">
            <div class="affiliate-subtitle">{{ $t('affiliate.CommissionPlan') }}</div>
            <table>
              <tbody>
                <tr>
                  <th style="text-align: left; padding-left: 10px;">{{ $t('affiliate.agent') }}</th>
                  <th style="text-align: left; padding-left: 10px;">{{ $t('affiliate.profit') }}</th>
                  <th>{{ $t('affiliate.activePlayers') }}</th>
                  <th>{{ $t('affiliate.commissionRate') }}</th>
                </tr>
                <tr>
                  <td style="text-align: left; padding-left: 10px;">{{ $t('affiliate.bronze') }}</td>
                  <td style="text-align: left; padding-left: 10px;">＜10W</td>
                  <td>5</td>
                  <td>35%</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-left: 10px;">{{ $t('affiliate.silver') }}</td>
                  <td style="text-align: left; padding-left: 10px;">10W-30W</td>
                  <td>10</td>
                  <td>40%</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-left: 10px;">{{ $t('affiliate.gold') }}</td>
                  <td style="text-align: left; padding-left: 10px;">30W-60W</td>
                  <td>25</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-left: 10px;">{{ $t('affiliate.diamond') }}</td>
                  <td style="text-align: left; padding-left: 10px;">60W-100W</td>
                  <td>50</td>
                  <td>50%</td>
                </tr>
                <tr>
                  <td style="text-align: left; padding-left: 10px;">{{ $t('affiliate.crown') }}</td>
                  <td style="text-align: left; padding-left: 10px;">＞100W</td>
                  <td>80</td>
                  <td>55%</td>
                </tr>
              </tbody>
            </table>
            <div class="agent-stress-tip">{{ $t('affiliate.profitExplanation') }}</div>
          </div>
        </div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
            <div class="affiliate-subtitle">{{ $t('affiliate.CalculationFormula') }}</div>
            <div class="agent-demo">
              <div class="agent-demo-bg">
                <div class="agent-demo-example-text">{{ $t('affiliate.example') }} 1: {{ $t('affiliate.deposit1000') }}</div>
                <div class="agent-demo-btm">
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.platformWinLoss') }}</div>
                      <div class="txt-right">1100</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.deductPromotion') }}</div>
                      <div class="txt-right">-100</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.deductDepositWithdrawalFee') }}</div>
                      <div class="txt-right">-16</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.platformServiceFee') }}</div>
                      <div class="txt-right">88</div>
                    </div>
                  </div>
                </div>
                <div class="agent-demo-btm">
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.profit') }}</div>
                      <div class="txt-right">896</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.multiplyCommissionRate') }}</div>
                      <div class="txt-right">*35%</div>
                    </div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.agentCommission')}}</div>
                  <div class="txt-right">313.6</div>
                </div>
              </div>
            </div>

            <div class="agent-demo-bg">
              <div class="agent-demo-example-text">{{ $t('affiliate.example') }} 2 :{{ $t('affiliate.deposit130000')}}</div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.platformWinLoss')}}</div>
                <div class="txt-right">122000</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.deductPromotion')}}</div>
                    <div class="txt-right">-2000</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.deductDepositWithdrawalFee')}}1.6%</div>
                    <div class="txt-right">-2240</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.platformServiceFee')}}</div>
                    <div class="txt-right">9760</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-btm">
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.profit')}}</div>
                    <div class="txt-right">108000</div>
                  </div>
                </div>
                <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.multiplyCommissionRate')}}</div>
                    <div class="txt-right">*40%</div>
                  </div>
                </div>
              </div>
              <div class="agent-demo-table">
                <div class="agent-demo-table-tr">
                  <div class="txt-left">{{$t('affiliate.agentCommission')}}</div>
                  <div class="txt-right">43200</div>
                </div>
              </div>
            </div>
          </div>
          <div class="agent-stress-tip agent-margintop-normal">{{ $t('affiliate.transactionFeeNote') }}</div>
        </div>
      </div>
      <div>
        <a :href="'https://www.4luckypartner.com/?langge=' + languageVal + '&agent=' +
          (affCode ? affCode : '')
          " class="agent-reg-btn">{{ $t('affiliate.applyAgentNow') }}</a>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { i18nStore } from '@/store/language'
import { defineComponent } from "vue";
// import { useI18n } from "vue-i18n";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";

import { storeToRefs } from "pinia";  

export default defineComponent({
  setup() {
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    // const { t } = useI18n();
    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      // console.log(top)
      window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" +
        popupWinWidth +
        ", height=" +
        popupWinHeight +
        ", top=" +
        top +
        ", left=" +
        left,
      );
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const columns = [
      {
        title: "Total Member Nett Winloss (MYR)",
        dataIndex: "winLoss",
        key: "winLoss",
      },
      {
        title: "Total Active Player",
        dataIndex: "activePlayer",
        key: "activePlayer",
      },
      {
        title: "Commission Rate",
        dataIndex: "commsRate",
        key: "commsRate",
      },
    ];
    const data = [
      {
        key: "1",
        winLoss: "5 and above",
        activePlayer: "< 5",
        commsRate: "12%",
      },
      {
        key: "2",
        winLoss: "5-66,825",
        activePlayer: "≥ 5",
        commsRate: "28%",
      },
      {
        key: "3",
        winLoss: "66,826 and above",
        activePlayer: "≥ 5",
        commsRate: "40%",
      },
    ];
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    return {
      columns,
      data,
      affCode,
      regDevice,
      store,
      openWindow,languageVal
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  font-size: 15px;
  background-color: #F3F7FD;

  .affiliate {
    background: url("../assets/images/affiliate/agent_index_top_bg_vg.jpg") no-repeat center top;
    background-position: top center;
    background-size: 100%;
    margin: 0 auto;
    padding: 100px 20px 160px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 60px;

    .affiliate-title {
      gap: 10px;
      display: flex;
      flex-direction: column;
      color: #424F72;
      // font-family: Poppins;
      font-size: 40.79px;
      font-weight: 700;
      line-height: 70px;
      text-align: left;
      justify-content: center;
      align-items: center;
    }
    .affiliate-desc {
      display: flex;
      gap: 50px;
    }
    .buttons {
      display: flex;
      gap: 30px;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 300px;
      a {
        text-decoration: none;
        display: block;
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        padding: 0px 50px;
        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
        border-radius: 50px;
        box-shadow: 0px -2px 5px 0px #B1D7FF inset;

        &.outline {
          background: linear-gradient(180deg, #F8FBFF 0%, #FDFEFF 100%);
          box-shadow: 0px 2px 5px 0px #BBDCFF inset;
          box-shadow: 0px -1px 4px 0px #A2BFF4 inset;
          color: #424F72;
        }
      }
    }
    .steps {
      background: #1e1b2e;
      padding: 40px;
      width: 95%;
      margin: 50px auto;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      .step {
        display: flex;
        color: #ffffff;
        gap: 10px;
        justify-content: flex-start;
        align-items: center;
        .stepdesc {
          flex-direction: column;
          display: flex;
        }
        .game-title {
          // font-family: Wave;
          color: #ffd200;
        }
      }
    }

    .affiliate-program {
      color: #686c6f;
      text-align: left;
      max-width: $maxwidth;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 50px;
      .affiliate-main-title {
        font-size: 36px;
        color: #2e84f5;
        text-align: center;
      }
      .affiliate-subgroup {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 50px;
        .affiliate-sub {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0px 0px 10px 0px #0000001A;
          color: #424F72;
          .affiliate-subtitle {
            font-size: 20px;
            font-weight: 700;
            color: #2e84f5;
          }
          .affiliate-terms {
            color: #424F72;
            font-size: 18px;
            font-weight: 700;
          }
          .highlight {
            color: #2e84f5;
          }
        }
      }
      .agent-content-item ul {
        margin-left: 16px;
        padding: 0;
        width: 100%;
      }
      .agent-content-item ul li {
        list-style: decimal;
        &:not(:last-child) {
          margin-bottom: 41px;
        }
      }
      .agent-content-item table {
        width: 100%;
        margin-top: 10px;
        border-spacing: 0;
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
        color: #424F72;
        height: 56px;
        font-weight: 700;
        background-color: #E7F3FF;
      }
      .agent-stress-tip {
        color: #A7A5A5;
      }
      .agent-demo {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        justify-items: center;
      }
      .agent-demo-bg {
        padding: 10px 0px;
      }
      .agent-demo-example-text {
        color: #424F72;
        font-size: 18px;
        font-weight: 700;
      }
      .agent-demo-btm {
        border-bottom: 1px solid #00000033;
      }
      .agent-demo-table {
        display: table;
        width: 100%;
        background: linear-gradient(0deg, #F3F3F3, #F3F3F3),
          linear-gradient(0deg, #FFFFFF, #FFFFFF);
        margin: 20px auto;
      }
      .agent-demo-table-tr {
        display: table-row;
      }
      .agent-demo-table-tr div {
        display: table-cell;
        width: 50%;
        padding: 10px 20px;
        font-weight: 500;
        font-size: 14px;
        color: #424F72;
      }
      .txt-left {
        text-align: left !important;
      }
      .txt-right {
        text-align: right !important;
      }
      .agent-reg-btn {
        width: 413px;
        margin: 0px auto;
        text-decoration: none;
        display: block;
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
        border-radius: 50px;
        box-shadow: 0px -2px 5px 0px #B1D7FF inset;
        box-shadow: 0px -1px 4px 0px #5894FF inset;
      }
      .agent-contact-bg {
        background-color: #f8f8f8;
        box-shadow: 0px 5px 4px 0px rgba(12, 3, 7, 0.1);
        border-radius: 5px;
      }
      .agent-contact-main {
        width: 944px;
        height: 400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .agent-contact-logo {
        width: 150px;
        text-align: center;
        font-size: 24px;
        color: #518bf7;
      }
      .agent-contact-ways {
        width: 515px;
      }
      .agent-ways-box {
        margin-top: 25px;
      }
      .agent-ways-way {
        font-size: 16px;
        color: #518bf7;
      }
      .agent-ways-val {
        font-size: 16px;
        color: #506180;
        a {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .agent-contact-ewm {
        width: 150px;
      }
      .agent-contact-ewm img {
        width: 100%;
      }
    }
  }
}
</style>

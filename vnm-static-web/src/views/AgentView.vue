<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="affiliate-title">
      <img src="../assets/logo.svg" style="width: 200px;">
        <span v-html="$t('affiliate.englishText')"></span>
      </div>
      <div class="affiliate-desc">
        <img src="../assets/images/affiliate/professional-team.png" height="55">
        <img src="../assets/images/affiliate/best-quality-service.png" height="55">
        <img src="../assets/images/affiliate/official-partner.png" height="55">
      </div>
      <div class="buttons">
        <a :href="affiliateUrl + 'vi/login?isreg=1&agent=' + (affCode ? affCode : '')">{{ $t('affiliate.joinus') }}</a>
        <a class="outline" :href="affiliateUrl + 'vi/login?agent=' + (affCode ? affCode : '')">{{ $t('affiliate.login') }}</a>
        <a class="outline" :href="affiliateUrl + 'vi/login?view=2&agent=' + (affCode ? affCode : '')" target="_blank">
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
            <!-- <div class="affiliate-terms">{{ $t('affiliate.bonusTerms') }}</div> -->
            <ul>
              <li>{{ $t('affiliate.afftnc1') }}</li>
              <li>{{ $t('affiliate.afftnc2') }}
                <ul v-if="languageVal === 'en'">
                  <li>{{ $t('affiliate.afftnc2-1') }}</li>
                  <li>{{ $t('affiliate.afftnc2-2') }}</li>
                  <li>{{ $t('affiliate.afftnc2-3') }}</li>
                </ul>  
              </li>
              <li>{{ $t('affiliate.afftnc3') }}</li>
              <li>{{ $t('affiliate.afftnc4') }}</li>
              <li>{{ $t('affiliate.afftnc5') }}</li>
              <li>{{ $t('affiliate.afftnc6') }}</li>
              <li>{{ $t('affiliate.afftnc7') }}
                <ul v-if="languageVal === 'vi'">
                  <li>{{ $t('affiliate.afftnc2-1') }}</li>
                  <li>{{ $t('affiliate.afftnc2-2') }}</li>
                  <li>{{ $t('affiliate.afftnc2-3') }}</li>
                </ul>
              </li>
              <li v-if="languageVal === 'en'">{{ $t('affiliate.afftnc8') }}</li>
              <li v-if="languageVal === 'en'">{{ $t('affiliate.afftnc9') }}</li>
              <li v-if="languageVal === 'en'">{{ $t('affiliate.afftnc10') }}</li>
            </ul>
          </div>
          <div class="affiliate-sub sm">
            <div class="affiliate-subtitle">{{ $t('affiliate.CommissionPlan') }}</div>
            <table>
              <tbody>
                <tr>
                  <th>{{ $t('affiliate.activeUser') }}</th>
                  <th>{{ $t('affiliate.realProfit') }}</th>
                  <th>{{ $t('affiliate.commissionRate') }}</th>
                </tr>
                <tr>
                  <td>5</td>
                  <td style="font-family: 'Roboto';">{{ $t('affiliate.realProfit1') }}</td>
                  <td>40%</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td style="font-family: 'Roboto';">{{ $t('affiliate.realProfit2') }}</td>
                  <td>45%</td>
                </tr>
                <tr>
                  <td>30</td>
                  <td style="font-family: 'Roboto';">{{ $t('affiliate.realProfit3') }}</td>
                  <td>50%</td>
                </tr>
                <tr>
                  <td>50</td>
                  <td style="font-family: 'Roboto';">{{ $t('affiliate.realProfit4') }}</td>
                  <td>55%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
            <div class="affiliate-subtitle">{{ $t('affiliate.CalculationFormula') }}</div>
            <div class="agent-stress-tip" v-html="$t('affiliate.profitExplanation')"></div>
            <div class="agent-demo">
              <div class="agent-demo-bg">
                <div class="agent-demo-example-text">{{ $t('affiliate.example') }} 1: {{ $t('affiliate.deposit1000') }}</div>
                
                <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalLossCustomers') }}</div>
                      <div class="txt-right">10.150.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalAmtDepositMth') }}</div>
                      <div class="txt-right">19.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalAmtWithdrawnInMth') }}</div>
                      <div class="txt-right">8.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalPromoCustomersInMth') }}</div>
                      <div class="txt-right">850.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-btm">
                  <div class="agent-demo-table">
                      <div class="agent-demo-table-tr">
                        <div class="txt-left">{{ $t('affiliate.bankTransFee') }}</div>
                        <div class="txt-right">270.000</div>
                      </div>
                    </div>
                  </div>
                  <div class="agent-demo-btm">
                    <div class="agent-demo-table">
                      <div class="agent-demo-table-tr">
                        <div class="txt-left">{{ $t('affiliate.profit') }}</div>
                        <div class="txt-right">(10.150.000*90%)-850.000-270.000=8.015.000</div>
                      </div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.agentCommission')}}</div>
                  <div class="txt-right">8.015.000*40%=3.206.000</div>
                </div>
              </div>
            </div>

            
            <div class="agent-demo-bg">
                <div class="agent-demo-example-text">{{ $t('affiliate.example') }} 2: {{ $t('affiliate.deposit130000') }}</div>
                
                <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalLossCustomers') }}</div>
                      <div class="txt-right">4.200.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalAmtDepositMth') }}</div>
                      <div class="txt-right">6.300.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalAmtWithdrawnInMth') }}</div>
                      <div class="txt-right">1.850.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                    <div class="agent-demo-table-tr">
                      <div class="txt-left">{{ $t('affiliate.totalPromoCustomersInMth') }}</div>
                      <div class="txt-right">250.000.000</div>
                    </div>
                  </div>
                  <div class="agent-demo-btm">
                  <div class="agent-demo-table">
                      <div class="agent-demo-table-tr">
                        <div class="txt-left">{{ $t('affiliate.bankTransFee') }}</div>
                        <div class="txt-right">81.500.000</div>
                      </div>
                    </div>
                  </div>
                  <div class="agent-demo-btm">
                    <div class="agent-demo-table">
                      <div class="agent-demo-table-tr">
                        <div class="txt-left">{{ $t('affiliate.profit') }}</div>
                        <div class="txt-right">	(4.200.000.000*90%)-250.000.000-81.500.000=3.448.500.000</div>
                      </div>
                    </div>
                  </div>
                  <div class="agent-demo-table">
                  <div class="agent-demo-table-tr">
                    <div class="txt-left">{{$t('affiliate.agentCommission')}}</div>
                  <div class="txt-right">3.448.500.000*55%=1.896.675.000</div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="agent-stress-tip agent-margintop-normal">{{ $t('affiliate.transactionFeeNote') }}</div> -->
        </div>
      </div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
          <div class="affiliate-subtitle">{{ $t('affiliate.downlineAffiliate') }}</div>
          {{ $t('affiliate.downlineAffiliatept1') }}<br>
          {{ $t('affiliate.downlineAffiliatept2') }}<br>
          {{ $t('affiliate.downlineAffiliate2') }}
        </div></div>
        <div class="affiliate-subgroup agent-content-item">
          <div class="affiliate-sub">
          <div class="affiliate-subtitle">{{ $t('affiliate.paymentMethods') }}</div>
          <ul>
            <li>{{ $t('affiliate.paymentMethods1') }}</li>
            <li>{{ $t('affiliate.paymentMethods2') }}</li>
            <li>{{ $t('affiliate.paymentMethods3') }}</li>
            <li>{{ $t('affiliate.paymentMethods4') }}</li>
            <li>{{ $t('affiliate.paymentMethods5') }}</li>
          </ul>
        </div></div>
      <div>
        <a :href="affiliateUrl + 'vi/login?isreg=1&agent=' +
          (affCode ? affCode : '')
          " class="agent-reg-btn">{{ $t('affiliate.applyAgentNow') }}</a>

        <a style="text-align: center; width:100%;margin:16px auto 0px;display:block;" class="outline" :href="affiliateUrl + 'vi/login?view=2&agent=' + (affCode ? affCode : '')" target="_blank">
          {{ $t('affiliate.contactus') }}
        </a>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import { i18nStore } from '@/store/language'
import { defineComponent, ref } from "vue";
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";

import { storeToRefs } from "pinia";  

export default defineComponent({
  setup() {
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    const affiliateUrl = ref("https://vnm-affiliate.th80to83w1.com/");

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
      openWindow,
      languageVal,
      affiliateUrl
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
    padding: 100px 20px 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 60px;

    .affiliate-title {
      gap: 10px;
      display: flex;
      flex-direction: column;
      color: $font-5;
      // font-family: Poppins;
      font-size: 40.79px;
      font-weight: 700;
      line-height: 50px;
      text-align: center;
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
        flex-direction: column;
        gap: 50px;
        .affiliate-sub {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0px 0px 10px 0px #0000001A;
          color: $font-5;
          width: 100%;
          .affiliate-subtitle {
            font-size: 20px;
            font-weight: 700;
            color: #2e84f5;
          }
          .affiliate-terms {
            color: $font-5;
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
      }
      .agent-content-item ul li {
        list-style: decimal;
        ul li {
          list-style-type: disclosure-closed;
        }
        &:not(:last-child) {
          margin-bottom: 5px;
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
        color: $font-5;
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
        // justify-items: center;
      }
      .agent-demo-bg {
        padding: 10px 0px;
      }
      .agent-demo-example-text {
        color: $font-5;
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
        // width: 50%;
        padding: 10px 20px;
        font-weight: 500;
        font-size: 14px;
        color: $font-5;
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

<template>
  <ProfileSummary :homeProfile="true" /> 
  <div class="share-affiliate">
    <div class="top-box">
      <div class="login-btn" @click="directToLink()">
        {{ $t('shareAffiliate.login') }}
      </div>
    </div>
    <div class="table-box">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th colspan="2"><div>{{ $t('shareAffiliate.secondLevelTitle') }}</div></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t('shareAffiliate.agentType') }}</td>
            <td>{{ $t('shareAffiliate.merchantModel') }}</td>
          </tr>
          <tr>
            <td rowspan="2">{{ $t('shareAffiliate.investmentPromotion') }}</td>
            <td style="padding: 0;">
              <tr>
                <td><span class="bold">{{ $t('shareAffiliate.activeMembers') }}</span></td>
                <td><span class="bold">{{ $t('shareAffiliate.monthlyDividend') }}</span></td>
              </tr>
              <tr>
                <td colspan="2"><span class="bold">3%</span></td>
              </tr>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-box">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th colspan="2">
              <div>{{ $t('shareAffiliate.generalAgentTitle') }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="6">{{ $t('shareAffiliate.generalAgent') }}</td>
            <td><div>{{ $t('shareAffiliate.generalAgentTitle') }}</div></td>
            <td>{{ $t('shareAffiliate.weeklyDividend') }}</td>
          </tr>
          <tr class="numbers">
            <td>≥3</td><td>20%</td>
          </tr>
          <tr class="numbers">
            <td>≥5</td><td>25%</td>
          </tr>
          <tr class="numbers">
            <td>≥10</td><td>30%</td>
          </tr>
          <tr class="numbers">
            <td>≥20</td><td>35%</td>
          </tr>
          <tr class="numbers">
            <td>≥30</td><td>40%</td>
          </tr>
          <tr class="example">
            <td colspan="3">
              <span class="blue">{{ $t('shareAffiliate.memberDefinition') }}</span>
              {{ $t('shareAffiliate.memberCriteria') }}
            </td>
          </tr>
          <tr class="example">
            <td colspan="3">
              <span class="blue">{{ $t('shareAffiliate.profitFormulaTitle') }}</span>
              {{ $t('shareAffiliate.profitFormula') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section section--first">
      <div class="title">{{ $t('shareAffiliate.backendTitle') }}</div>
      <ol>
        <li>{{ $t('shareAffiliate.dividends') }}
          <ul>
            <li>{{ $t('shareAffiliate.dividendRequirements') }}</li>
          </ul>
        </li>
        <li>{{ $t('shareAffiliate.qualifiedDefinition') }}
          <ul>
            <li>{{ $t('shareAffiliate.effectiveBets') }}</li>
            <li>{{ $t('shareAffiliate.cumulativeRecharge') }}</li>
          </ul>
        </li>
        <li>{{ $t('shareAffiliate.profitDeduction') }}
          <ul>
            <li>{{ $t('shareAffiliate.deductionDetails') }}</li>
          </ul>
        </li>
      </ol>
    </div>

    <div class="section section--second">
      <div class="title">{{ $t('shareAffiliate.modelDescription') }}</div>
      {{ $t('shareAffiliate.generalCalc1') }}<br>
      {{ $t('shareAffiliate.basicSame') }}<br>
      {{ $t('shareAffiliate.lossBySuperior') }}<br>
      {{ $t('shareAffiliate.noSuperiorLoss') }}<br>
      <div class="point">
        1) {{ $t('shareAffiliate.generalCalculation') }}<br>
        <div class="calculation" v-html="$t('shareAffiliate.calcExample1')" />
      </div>
      <div class="point">
        2) {{ $t('shareAffiliate.noGeneralCalculation') }}<br>
        {{ $t('shareAffiliate.sameCalc') }}<br>
        {{ $t('shareAffiliate.cancelledLines') }}<br>
        {{ $t('shareAffiliate.subAgentNoLoss') }}<br>
        {{ $t('shareAffiliate.platformInvestment') }}<br>
        <div class="calculation" v-html="$t('shareAffiliate.calcExample2')" />
      </div>
    </div>
  </div>
</template>
<script setup>
import ProfileSummary from "../components/ProfileSummary.vue";
  const directToLink = () => {
    window.open("https://pak-affiliate-web.psna-staging.com/pak/login", "_blank");
  }
</script>
<style scoped lang="scss">
.share-affiliate {
  background: url(../assets/images/share/share-bg.png)no-repeat top center;

    background-size: contain;
    // height: 400px;
  .top-box {
    // background: url(../assets/images/share/share-box.png)no-repeat center center;
    // // background-size: contain;
    // // width: 95%;
    // // height: 400px;
    // // margin-top: 80px;
    // background-size: contain;
    // // height: 420px;
    // // padding-top: 80px;
    // padding-top: 140px;
    // display: block;
    height: 60%;
    justify-content: center;
    margin: 0 auto;
    padding: 250px 0 30px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      background: url(../assets/images/share/share-btn.png)no-repeat center center;
      background-size: contain;
      padding: 10px;
      text-align: center;
      font-size: 20px;
      width: 50%;
      border-radius: 3px;
      font-weight: 900;
      text-transform: uppercase;
      color: #5F3000;

    }
  }
  .table-box {
    width: 95%;
    margin: 30px auto;
    position: relative;
   thead {
    min-height: 50px;
    tr {
      background:#121829;
      border: 1px solid #FFFFFF14;
      th {
      background:#121829;
      border: 1px solid #FFFFFF14;
      padding: 25px;
      border-radius: 4px 4px 0 0;
        div { 
        display: flex;
        justify-content: center;
        align-items: center;
        background: url(../assets/images/share/share-top-header.png)no-repeat center center;
        height: 45px;
        margin: auto;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 0 10px;
        position: absolute;
        top: -8px;
        left:0;
        right:0;
        width: 98%;
        background-size: contain;
        }
      }
    }
   } 
  tbody {
    tr {
      &.numbers {
        font-weight: bold;
        td {
          color: #ffffff;

        }
      }
      &.example {
        td {
          text-align: left;
          color: #ffffff;
        .blue {
          color: #0666D3;
          display: block;
        }
        }
      }
      background: #121829;
      border: 1px solid #FFFFFF14;
      td {
        text-align: center;
        padding: 10px;
        background: #121829;
        border: 1px solid #FFFFFF14;
        color: #FFFFFF80;
        .bold {
          color: #ffffff;
          font-weight: 700;
        }
        
      }
    }
  }
  }
  .section {
    background: #121829;
    position: relative;
    border: 1px solid #FFFFFF14;
    width: 95%;
    margin: 0 auto 20px;
    border-radius: 4px;
    padding-top: 40px;
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        background: url(../assets/images/share/share-top-header.png)no-repeat center center;
        height: 45px;
        margin: auto;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 0 15px;
        position: absolute;
        top: -8px;
        left:0;
        right:0;
        width: 98%;
        background-size: contain;
        color: #ffffff;
    }
    ol {
      color: #FFFFFFB2;
      li {
        ul {
          li {
            color: #FBAB1B;
            list-style-type: disc;
          }
        }
      }
    }
    &--second {
      color: #FFFFFF80;
      padding: 50px 15px 15px;
      .calculation {
        color:#FBAB1B;
        margin: 10px auto;
      }
    }
  }
}
</style>
<template>
  <div class="agency-policy">
    <div class="agency-policy-main-img"><img src="../../assets/images/earn-money/about-bg.png" /></div>

    <div class="title">Invite to Earn</div>
    <div class="subtitle">Simply share your exclusive QR code</div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-invite.svg" />
      <div>
        Invite more friends and you will earn more. Every member who joins Skyace Club is both a player and an agent.
      </div>
    </div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-reward.svg" />
      <div>We advocate benefits and bonuses for everyone.</div>
    </div>

    <div class="agency-policy-separator"></div>
    <div class="agency-policy-title">Agency Policy</div>
    <div class="agency-policy-separator"></div>

    <h6>The table below shows how the rewards are assigned.</h6>
    <q-table
      flat
      :hide-pagination="true"
      :rows-per-page-options="[0]"
      class="table-container q-my-md"
      :columns="columns2"
      :rows="rows2"
      row-key="name"
      dense
    ></q-table>

    <ul>
      <li class="dot-style">Active users: daily bet amount 200</li>
      <li class="dot-style">
        Your reward will be calculated based on the total bet amount of your members. The reward gained can either be
        withdrawn or used for further betting.
      </li>
      <li class="dot-style">Refer as many friends as you can to gain bigger percentage of rebates.</li>
      <li class="dot-style">Earn lifetime revenue on your referred players.</li>
    </ul>

    <h4>&nbsp;&middot;&nbsp;FAQ</h4>
    <q-expansion-item label="1. How to earn commissions?">
      <ul>
        <li class="dot-style">
          You can earn up to 1.5% of the daily wagers of players you refer. The higher your level, the higher the
          commission percentage you can earn.
        </li>
        <li class="dot-style">
          If your affiliate or your affiliate becomes an agent and they are at a lower level than their immediate
          superior, then you can receive up to 1.2% of the affiliate's wagering rebate amount. The commission rate
          depends on the level difference between you and your affiliate, the greater the level difference, the more
          commission you receive.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="2. How to invite your friends?">
      <ul>
        <li class="dot-style">Share the game via social media or share the referral link to your friends.</li>
        <li class="dot-style">
          Friends must click on your promotion link, download the App, install the game and register to start betting to
          get commission.
        </li>
        <li class="dot-style">Registration must be completed through a referral link.</li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="3. What's the purpose of level?">
      <ul>
        <li class="dot-style">
          We have divided 13 levels based on the number of recommended users and betting performance.
        </li>
        <li class="dot-style">
          Upgrade conditions require that the bet amount and team size meet the requirements at the same time. The
          higher your level, the higher the commission percentage you will receive from members' bet amounts.
        </li>
        <li class="dot-style">
          Level difference: When the immediate superior minus the corresponding direct member level is ≥ 1, there is a
          level difference, otherwise there is no level difference.
        </li>
        <li class="dot-style">
          The higher your level, the higher the commission percentage you get from level difference bets.
        </li>

        <q-table
          flat
          :hide-pagination="true"
          :rows-per-page-options="[0]"
          class="table-container q-my-md"
          :columns="columns4"
          :rows="rows4"
          row-key="name"
          dense
        ></q-table>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="4. How to upgrade your level?">
      <ul>
        <li class="dot-style">
          The more members you bring to the game and the more they bet, the higher the tiers you can get.
        </li>
        <li class="dot-style">
          If you have extraordinary channel promotion capabilities, please contact our customer service center for
          verification.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="5. How to turn your friends into members?">
      <ul>
        <li class="dot-style">
          Log in to 55Ace, share your recommendation link with your friends on the recommendation page, guide them to
          register from the link, and they can become your direct members.
        </li>
        <li class="dot-style">
          Encourage your members to invite their friends to play games, and the friends they invite will become your
          indirect members.
        </li>
        <li class="dot-style">
          When friends of your direct members become your indirect members, they can still grow their membership this
          way. All their sub-members will be considered as your indirect sub-members.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="6. How to get commission from your members?">
      <ul>
        <li class="dot-style">
          There must be a level difference between you and all your lower-level members, otherwise no level difference
          commission will be generated.
        </li>
        <li class="dot-style">
          The proportion of commission is determined by the difference between your level and the level of your
          subordinate members.
        </li>
      </ul>

      <h4>&nbsp;&middot;&nbsp;Example</h4>

      <div class="text-center">
        <img class="affi-graph" src="../../assets/images/earn-money/afiliate-graph.png" />
      </div>

      <table class="rebate-example-table">
        <tbody>
          <tr>
            <td>Name</td>
            <td>Level</td>
            <td>Betting</td>
            <td>Members</td>
          </tr>
          <tr>
            <td>You</td>
            <td>8(1.0%)</td>
            <td>9,7020</td>
            <td>49</td>
          </tr>
          <tr>
            <td>A</td>
            <td>8(1.0%)</td>
            <td>7,6000</td>
            <td>35</td>
          </tr>
          <tr>
            <td>B</td>
            <td>6(0.8%)</td>
            <td>2,1000</td>
            <td>13</td>
          </tr>
          <tr>
            <td>C</td>
            <td>1(0.3%)</td>
            <td>200</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>

      <ul>
        <!--      <li class="dot-style">-->
        <!--        You level-->
        <!--        <em>V8</em>-->
        <!--        . Betting amount-->
        <!--        <em>{{ convertToCommaAmount(972000) }}rs</em>-->
        <!--        . Team members-->
        <!--        <em>49</em>-->
        <!--        people.-->
        <!--      </li>-->
        <!--      <li class="dot-style">-->
        <!--        A Level-->
        <!--        <em>V8</em>-->
        <!--        . Betting amount-->
        <!--        <em>{{ convertToCommaAmount(760000) }}rs</em>-->
        <!--        . Team members-->
        <!--        <em>35</em>-->
        <!--        people.-->
        <!--      </li>-->
        <!--      <li class="dot-style">-->
        <!--        B Level-->
        <!--        <em>V6</em>-->
        <!--        . Betting amount-->
        <!--        <em>{{ convertToCommaAmount(210000) }}rs</em>-->
        <!--        . Team members-->
        <!--        <em>13</em>-->
        <!--        people.-->
        <!--      </li>-->
        <!--      <li class="dot-style">-->
        <!--        C Level-->
        <!--        <em>V1</em>-->
        <!--        . Betting amount-->
        <!--        <em>{{ convertToCommaAmount(2000) }}rs</em>-->
        <!--        . Team members-->
        <!--        <em>1</em>-->
        <!--        person.-->
        <!--      </li>-->
        <li class="dot-style">You can't get A's betting rebate.</li>
        <li class="dot-style">You can get 0.2% commission on B's bet amount</li>
        <li class="dot-style">You can get 0.7% commission on C's bet amount</li>
      </ul>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { convertToCommaAmount } from "src/boot/utils";
import { userStore } from "stores/index";

const store = userStore();

const columns4 = [
  {
    name: "level",
    label: "Level Difference",
    field: "level",
    align: "center"
  },
  { name: "rebates", label: "Rebate (%)", field: "rebates", align: "center" }
];
const rows4 = [
  {
    level: 1,
    rebates: 0.1
  },
  {
    level: 2,
    rebates: 0.2
  },
  {
    level: 3,
    rebates: 0.3
  },
  {
    level: 4,
    rebates: 0.4
  },
  {
    level: 5,
    rebates: 0.5
  },
  {
    level: 6,
    rebates: 0.6
  },
  {
    level: 7,
    rebates: 0.7
  },
  {
    level: 8,
    rebates: 0.8
  },
  {
    level: 9,
    rebates: 0.9
  },
  {
    level: 10,
    rebates: "1.0"
  },
  {
    level: 11,
    rebates: 1.1
  },
  {
    level: 12,
    rebates: 1.2
  }
];

const columns2 = [
  {
    name: "level",
    label: "Level",
    field: "level",
    align: "center"
  },
  { name: "betAmount", label: `Bet Amount (${store.currency.value})`, field: "betAmount", align: "center" },
  { name: "teamMember", label: "Active Member", field: "teamMember", align: "center" },
  { name: "rebate", label: "Rate %", field: "rebate", align: "center" }
];
const rows2 = [
  {
    level: "v13",
    betAmount: `${store.currency.value}${convertToCommaAmount(16000000)}`,
    teamMember: "377",
    rebate: "1.5"
  },
  {
    level: "v12",
    betAmount: `${store.currency.value}${convertToCommaAmount(8500000)}`,
    teamMember: "233",
    rebate: "1.4"
  },
  {
    level: "v11",
    betAmount: `${store.currency.value}${convertToCommaAmount(5000000)}`,
    teamMember: "144",
    rebate: "1.3"
  },
  {
    level: "v10",
    betAmount: `${store.currency.value}${convertToCommaAmount(2600000)}`,
    teamMember: "89",
    rebate: "1.2"
  },
  {
    level: "v9",
    betAmount: `${store.currency.value}${convertToCommaAmount(1400000)}`,
    teamMember: "55",
    rebate: "1.1"
  },
  {
    level: "v8",
    betAmount: `${store.currency.value}${convertToCommaAmount(750000)}`,
    teamMember: "34",
    rebate: "1.0"
  },
  {
    level: "v7",
    betAmount: `${store.currency.value}${convertToCommaAmount(420000)}`,
    teamMember: "21",
    rebate: "0.9"
  },
  {
    level: "v6",
    betAmount: `${store.currency.value}${convertToCommaAmount(200000)}`,
    teamMember: "13",
    rebate: "0.8"
  },
  {
    level: "v5",
    betAmount: `${store.currency.value}${convertToCommaAmount(100000)}`,
    teamMember: "8",
    rebate: "0.7"
  },
  {
    level: "v4",
    betAmount: `${store.currency.value}${convertToCommaAmount(35000)}`,
    teamMember: "5",
    rebate: "0.6"
  },
  {
    level: "v3",
    betAmount: `${store.currency.value}${convertToCommaAmount(14000)}`,
    teamMember: "3",
    rebate: "0.5"
  },
  {
    level: "v2",
    betAmount: `${store.currency.value}${convertToCommaAmount(500)}`,
    teamMember: "2",
    rebate: "0.4"
  },
  {
    level: "v1",
    betAmount: `${store.currency.value}${convertToCommaAmount(200)}`,
    teamMember: "1",
    rebate: "0.3"
  }
];

const columns3 = [
  {
    name: "level",
    label: "Level",
    field: "level",
    align: "center"
  },
  { name: "1", label: "1", field: "1", align: "center" },
  { name: "2", label: "2", field: "2", align: "center" },
  { name: "3", label: "3", field: "3", align: "center" },
  { name: "4", label: "4", field: "4", align: "center" },
  { name: "5", label: "5", field: "5", align: "center" },
  { name: "6", label: "6", field: "6", align: "center" },
  { name: "7", label: "7", field: "7", align: "center" },
  { name: "8", label: "8", field: "8", align: "center" },
  { name: "9", label: "9", field: "9", align: "center" },
  { name: "10", label: "10", field: "10", align: "center" },
  { name: "11", label: "11", field: "11", align: "center" },
  { name: "12", label: "12", field: "12", align: "center" },
  { name: "13", label: "13", field: "13", align: "center" }
];
const rows3 = [
  {
    level: "Rebate %",
    1: "0.3",
    2: "0.4",
    3: "0.5",
    4: "0.6",
    5: "0.7",
    6: "0.8",
    7: "0.9",
    8: "1.0",
    9: "1.1",
    10: "1.2",
    11: "1.3",
    12: "1.4",
    13: "1.5"
  }
];
</script>

<style scoped lang="scss">
.agency-policy {
  img {
    width: 100%;
  }

  .title {
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0 0 15px 0;
    font-size: 16px;
    letter-spacing: 0.5px;
    font-weight: 400;
  }

  .desc-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 0 25px 0;
    letter-spacing: 0.5px;

    img {
      width: 56px;
      height: 56px;
    }
  }

  .agency-policy-main-img {
    margin-left: -16px;
    margin-right: -16px;

    &:after {
      content: "";
      background: linear-gradient(to bottom, rgba(17, 19, 31, 0.9), rgba(255, 255, 255, 0));
      position: absolute;
      top: 0;
      left: 0;
      height: 100px;
      width: 100%;
    }
  }

  .agency-policy-separator {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    height: 2px;
  }

  .agency-policy-title {
    // background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    background-image: url("../../assets/images/earn-money/agency-policy-label.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% auto;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin: 1px -16px;
  }

  :deep(.q-item) {
    padding: 0;
  }

  :deep(.q-expansion-item) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  :deep(.q-item__label) {
    color: #ffffff;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  ul {
    padding-inline-start: 1rem;

    li {
      list-style-type: decimal;
      font-size: 0.95rem;
      line-height: 1.25rem;
      text-align: left;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 0.75rem 0;
    }

    .dot-style {
      list-style-type: disc;
      letter-spacing: 0.5px;
      line-height: 1.7;
    }
  }
  :deep(.q-table__container) {
    background: transparent !important;
    border-radius: 12px;
  }
  .table-container {
    :deep(thead) {
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    }

    :deep(tbody) {
      background: #652c93;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      tr {
        &:nth-child(2n) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: #502175;
        }
      }
    }

    :deep(thead) {
      th:nth-child(3) {
        white-space: normal;
      }
    }

    .text-center {
      font-size: 0.95rem;
      font-weight: 700;
      width: 2rem;
      border-bottom-width: 0;
      border-right-width: 1px;
      border-color: black;
      padding: 0 0.25rem;
    }
  }

  .copy-link-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .copy-link {
      width: 25rem;
      padding: 1rem;
    }

    span {
      position: absolute;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }

  h6 {
    font-size: 14px;
    text-align: center;
    margin-bottom: 0px;
    margin-top: 7px;
  }

  h4 {
    margin-bottom: 5px;
    font-size: 22px;
  }

  .affi-graph {
    margin: 10px auto;
    width: calc(70% - 20px);
    text-align: center;
  }

  .rebate-example-table {
    width: calc(100% - 20px);
    margin: 0px auto 5px;
    border-collapse: collapse;

    tbody {
      table-layout: fixed;
    }

    td {
      padding: 4px 6px;
      border: 1px solid #fff;
      font-size: 16px;
    }
  }
}
</style>

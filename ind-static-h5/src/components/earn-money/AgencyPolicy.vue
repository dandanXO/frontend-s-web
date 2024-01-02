<template>
  <div class="agency-policy">
    <img src="../../assets/images/earn-money/about-bg.png" />

    <div class="title">Invite to Earn</div>
    <div class="subtitle">Simply share your exclusive QR code</div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-invite.png" />
      <div>
        Invite more friends and you will earn more. Every member who joins Skyace Club is both a player and an agent.
      </div>
    </div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-reward.png" />
      <div>We advocate benefits and bonuses for everyone.</div>
    </div>

    <div class="agency-policy-separator"></div>
    <div class="agency-policy-title">Agency Policy</div>
    <div class="agency-policy-separator"></div>

    <q-expansion-item label="1. How to earn commissions?">
      <ul>
        <li class="dot-style">
          You can earn up to 1.5% of the maximum daily wager paid by your referred players. Commissions are valid
          forever. The higher your level, the higher the commission percentage you can earn.
        </li>
      </ul>
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
        <li class="dot-style">
          If your affiliate or your affiliate's referrer, etc. becomes an agent and they are at a lower level than their
          direct superior, then you can get up to 1.2% of the affiliate wagering rebate amount. The commission rate
          depends on the level difference between you and your affiliate, the greater the level difference, the more
          commission you receive.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="2. How to invite your friends?">
      <ul>
        <li class="dot-style">Share the game via social media or share the referral link to your friends.</li>
        <li class="dot-style">
          You get commission after your friends click the promotional link, download App, install the game and register.
        </li>
        <li class="dot-style">
          The installation must be finished by the referral link. Sharing the App package by Sharelt etc is not allowed.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="3. What's the purpose of level?">
      <ul>
        <li class="dot-style">
          Based on the activity and performance of agent users, we have divided them into 13 levels.
        </li>
        <li class="dot-style">
          The higher your level, the higher the commission percentage you get from members' bets, and the upgrade
          conditions require that the bet amount and team members meet the requirements at the same time.
        </li>
      </ul>
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
        <li class="dot-style">
          Level difference occurs when the direct superior level minus the corresponding direct affiliate level is
          greater than or equal to 1; otherwise, there is no level difference.
        </li>
        <li class="dot-style">
          The higher your level, the higher the commission percentage you get from the level difference bet.
        </li>
      </ul>
      <q-table
        flat
        :hide-pagination="true"
        :rows-per-page-options="[0]"
        class="table-container q-my-md"
        :columns="columns3"
        :rows="rows3"
        row-key="name"
        dense
      ></q-table>
    </q-expansion-item>

    <q-expansion-item label="4. How to upgrade your level?">
      <ul>
        <li class="dot-style">
          The more referrals you bring to the game and the more they bet, the higher your score will be.
        </li>
        <li class="dot-style">
          If you have extraordinary promotional ability with channels, please get contact with our customer service
          center to verify your division.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="5. How to develop your referrals into affiliates?">
      <ul>
        <li class="dot-style">
          Log in to the IndWin7, share your referral link with your friends on the agent page, guide them to register
          from the link, and they can become your direct affiliates.
        </li>
        <li class="dot-style">
          Encourage your affiliates to invite their friends to play games, and the friends they invite will become your
          indirect affiliates.
        </li>
        <li class="dot-style">
          After your direct affiliates' friends become your indirect affiliates, they can still develop their affiliates
          in this way. All their affiliates will be regarded as your indirect affiliates.
        </li>
      </ul>
    </q-expansion-item>

    <q-expansion-item label="6. How to get commission from your affiliates?">
      <ul>
        <li class="dot-style">
          The top-up player is your indirect affiliate, and any pair of direct superiors and direct affiliates between
          you and the player must have a level difference, otherwise no level difference commission will be generated.
        </li>
        <li class="dot-style">
          The level difference commission ratio is determined by your direct membership and the level difference between
          you and the betting player.
        </li>
      </ul>
    </q-expansion-item>

    <ul>
      <li class="dot-style">
        You level
        <em>V8</em>
        . Betting amount
        <em>972000rs</em>
        . Team members
        <em>49</em>
        people.
      </li>
      <li class="dot-style">
        A Level
        <em>V8</em>
        . Betting amount
        <em>760000rs</em>
        . Team members
        <em>35</em>
        people.
      </li>
      <li class="dot-style">
        B Level
        <em>V6</em>
        . Betting amount
        <em>210000rs</em>
        . Team members
        <em>13</em>
        people.
      </li>
      <li class="dot-style">
        C Level
        <em>V1</em>
        . Betting amount
        <em>2000rs</em>
        . Team members
        <em>1</em>
        person.
      </li>
      <li class="dot-style">You can't get A's betting rebate</li>
      <li class="dot-style">You can get 0.2% commission on the bet amount of B's entire team</li>
      <li class="dot-style">You can get 0.7% commission on the bet amount of C the entire team</li>
    </ul>
  </div>
</template>

<script setup>
const columns2 = [
  {
    name: "level",
    label: "Level",
    field: "level",
    align: "center"
  },
  { name: "betAmount", label: "Bet Amount", field: "betAmount", align: "center" },
  { name: "teamMember", label: "Team Member", field: "teamMember", align: "center" },
  { name: "rebate", label: "Rebate %", field: "rebate", align: "center" }
];
const rows2 = [
  {
    level: "v13",
    betAmount: "₹160000000",
    teamMember: "377",
    rebate: "1.5"
  },
  {
    level: "v12",
    betAmount: "₹85000000",
    teamMember: "233",
    rebate: "1.4"
  },
  {
    level: "v11",
    betAmount: "₹50000000",
    teamMember: "144",
    rebate: "1.3"
  },
  {
    level: "v10",
    betAmount: "₹26000000",
    teamMember: "89",
    rebate: "1.2"
  },
  {
    level: "v9",
    betAmount: "₹14000000",
    teamMember: "55",
    rebate: "1.1"
  },
  {
    level: "v8",
    betAmount: "₹7500000",
    teamMember: "34",
    rebate: "1.0"
  },
  {
    level: "v7",
    betAmount: "₹4200000",
    teamMember: "21",
    rebate: "0.9"
  },
  {
    level: "v6",
    betAmount: "₹2000000",
    teamMember: "13",
    rebate: "0.8"
  },
  {
    level: "v5",
    betAmount: "₹1000000",
    teamMember: "8",
    rebate: "0.7"
  },
  {
    level: "v4",
    betAmount: "₹350000",
    teamMember: "5",
    rebate: "0.6"
  },
  {
    level: "v3",
    betAmount: "₹140000",
    teamMember: "3",
    rebate: "0.5"
  },
  {
    level: "v2",
    betAmount: "₹5000",
    teamMember: "2",
    rebate: "0.4"
  },
  {
    level: "v1",
    betAmount: "₹2000",
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
  }

  .desc-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 0 15px 0;

    img {
      width: 75px;
      height: 75px;
    }
  }

  .agency-policy-separator {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    height: 2px;
  }

  .agency-policy-title {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin: 1px 0;
  }

  :deep(.q-item) {
    padding: 0;
  }

  :deep(.q-expansion-item) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
}
</style>

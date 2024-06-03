<template>
  <div class="vip-container">
    <div class="menu-title-container">
      <span class="menu-title">VIP</span>
    </div>
    <!-- <div class="banner-container">
      <div class="btn-wrapper">
        <div class="center">
          <!- <div class="page-blend">GET NOW</div> ->
          <!- <div class="page-liner">
            Araw-araw na 10% deposito, hanggang 5,000 pesos
          </div> ->
        </div>
      </div>
    </div> -->
    <swiper-container slides-per-view="3.5" space-between="24" class="vip-badge-swiper">
      <swiper-slide v-for="(_, index) in 13" :key="index">
        <vip-badge class="slide-badge" :level="index" :current-deposit="currentDepositNumber" />
      </swiper-slide>
    </swiper-container>

    <div class="vip-reward-wrapper">
      <div v-for="(reward, index) in rewards" :key="index" class="vip-reward-ticket">
        <div class="vip-reward-ticket__icon">
          <img :src="require(`@/assets/images/vip/ticket/reward-icon-${index + 1}.svg`)" />
        </div>
        <div class="vip-reward-ticket__description">
          <span class="vip-reward-ticket__title">{{ reward.title }}</span>
          <br />
          <span>{{ reward.description }}</span>
        </div>
        <div class="vip-reward-ticket__info">
          <div class="vip-reward-ticket__amount">{{ reward.amount }}</div>
          <div class="vip-reward-ticket__status">
            <RiLockFill />
          </div>
        </div>
      </div>
    </div>
    <div class="vip-upgrade-rule">VIP status can be upgraded by accumulating monthly deposits</div>
    <table class="vip-ranking-table">
      <thead>
        <tr>
          <td><img src="@/assets/images/vip/vip-table-icon.png" /></td>
          <td>Award</td>
          <td>1st Day of Next mmonth</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="index in 7" :key="index">
          <td>VIP 0</td>
          <td>
            <img src="@/assets/images/vip/vip-table-coin-icon.png" />
            0
          </td>
          <td>
            <img src="@/assets/images/vip/vip-table-coin-icon.png" />
            0
          </td>
        </tr>
      </tbody>
    </table>
    <div class="vip-upgrade-rule-2">
      After the recharge on the day reaches the standard, the next day will increase the VIP level and issue
      corresponding upgrade rewards.
    </div>
    <!-- <Carousel :items-to-show="2.95" :wrap-around="true">
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <div class="vipcontents">
              <div class="title">VIP {{ vip.vipLevel }}</div>
              <div class="description" v-if="vipLevel && vip.vipLevel === '8'">
                Congratulations on reaching the highest level.
              </div>
              <div v-if="vip.vipLevel != '8'" class="description">
                {{ vip.upgrade !== "Successful deposit" ? `Accumulate Deposit: ${vip.upgrade}` : vip.upgrade }}
              </div>
              vip progress bar start
              <div class="progressBarContainer" v-if="vipLevel && vip.vipLevel != '8'">
                <div class="progressBarOuterBar">
                  <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vip) + '%' }" />
                </div>
                <div class="progressBarDescription">
                  <span>
                    {{ `VIP${vip.vipLevel}` }}
                  </span>
                  <span>
                    {{ `VIP${+vip.vipLevel + 1}` }}
                  </span>
                </div>
              </div>
              vip progress bar end
            </div>
            <div :class="`vipLevelReachStatus ${getVipLevelProgress(vip) === 100 && !!vipLevel ? 'vipLevelReached' : ''}`">
              <span>{{ getVipLevelProgress(vip) === 100 && !!vipLevel ? 'Achieved' : 'Not Yet' }}</span>
            </div>
          </div>

          <div class="inner-vip-mobile">
            <div class="game-title">REBATE BONUS</div>
            <div class="rebates">
              <div v-for="(rebate, i) in vip.rebates" :key="i" class="rebate">
                <div class="value">
                  {{ rebate.rebateValue }}
                </div>
                <div class="name">
                  {{ rebate.rebateName }}
                </div>
              </div>
            </div>
            <span class="note">*Note: All the Bonus, Deposit amount and withdrawal amount in PHP</span>
          </div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel> -->

    <!-- <div class="vip-program">
      <div class="buttons">
        <div class="vipp-btn" :class="{ active: showRebate }" @click="onShowRebateClick(true)">
          DAILY CASHBACK BONUS FOR VIP PLAYER
        </div>
        <div class="vipp-btn" :class="{ active: !showRebate }" @click="onShowRebateClick(false)">
          VIP PLAYER BIRTHDAY BONUS
        </div>
      </div>
      <div v-if="showRebate">
        <a-table :pagination="false" :columns="columns" :dataSource="columnsData" :locale="{ emptyText: ' ' }" />
        <div class="separator"></div>
        <a-table :pagination="false" :columns="columns3" :dataSource="column3Data" />
        <div class="separator"></div>
        <a-table :pagination="false" :columns="columns4" :dataSource="column4Data" />
      </div>
      <div v-else>
        <a-table :pagination="false" :columns="columns" :dataSource="birthdayColumnData" :locale="{ emptyText: ' ' }" />
        <div class="separator"></div>
        <a-table :pagination="false" :columns="columns3" :dataSource="column3Data" />
        <div class="separator"></div>
        <a-table :pagination="false" :columns="columns4" :dataSource="column4Data" />
      </div>

      <span class="note">*Note: All the Bonus, Deposit amount and withdrawal amount in PHP</span>

      <div class="left" />
      <div class="right" />
    </div>
    <div class="terms-conditions">
      <div class="game-title">Terms &amp; Conditions</div>
      <img
        class="terms-conditions-title-separator"
        :src="require('../../assets/images/vip/terms-condition-title-separator.png')"
      />
      <ol class="terms">
        <li v-for="(term, i) in currentDisplayTerms" :key="i" class="term">
          {{ term.text }}
        </li>
      </ol>
    </div> -->

    <a-modal v-model:visible="privilegeClaimedModalVisible" centered>
      <div class="modal-div">
        <span class="img-item">
          <div class="inner-contents">
            <div class="amount">{{ amount }}</div>
            <div class="bonus">BONUS</div>
          </div>
        </span>
        <img src="../../assets/images/index/bonus.svg" />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, defineComponent, computed } from "vue";
import { claimBonusItem } from "@/api/index/promo";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import VipBadge from "@/components/vip/VipBadge.vue";
import { storeToRefs } from "pinia";
import { RiLockFill } from "vue-remix-icons";
// import { message } from "ant-design-vue";

const store = userStore();
const { currentDepositNumber } = storeToRefs(store);

const amount = ref("$0");
const privilegeClaimedModalVisible = ref(false);
const rewards = [
  { title: "Level Upgrade", description: "Reward", amount: 20, status: "unavailable" },
  { title: "Level Upgrade", description: "Reward", amount: 20, status: "unavailable" },
  { title: "Level Upgrade", description: "Reward", amount: 20, status: "unavailable" }
];

const vipLevel = computed(() => {
  return store.vip;
});
const getVipLevelProgress = (vipInfo) => {
  const vipLevel = +store.vip.replace("VIP", "");
  const currentDeposit = +store.getCurrentDeposit();
  const upgradeStatus = vipInfo.upgrade;

  if (vipLevel > +vipInfo.vipLevel) {
    return 100;
  }

  const levelUpDeposit = +upgradeStatus.replaceAll(",", "");
  return (currentDeposit / levelUpDeposit) * 100;
};
const storeToken = computed(() => {
  return store.token;
});
const loadingClaim = ref(false);
const loadingMClaim = ref(false);
const loadingBClaim = ref(false);
const dailySlot = (bonusItem, vipType) => {
  loadingClaim.value = true;
  if (vipType === "monthly") {
    loadingMClaim.value = true;
  } else if (vipType === "birthday") {
    loadingBClaim.value = true;
  }
  claimBonusItem(bonusItem)
    .then((res) => {
      if (res.code === 0) {
        amount.value = "$" + res.data;
        privilegeClaimedModalVisible.value = true;
        loadingClaim.value = false;
        loadingMClaim.value = false;
        loadingBClaim.value = false;
        store.getBalance();
      }
    })
    .catch((err) => {
      console.log(err.message);
      loadingClaim.value = false;
      loadingMClaim.value = false;
      loadingBClaim.value = false;
    });
};

const terms = [
  {
    text: `Conditions for receiving the turnover bonus: The rebate will be calculated based on the valid turnover of all games played by members from 00:00 to 23:59 of the previous day.`
  },
  {
    text: `This bonus for withdrawals are issued before the turnover requirement of x1, Example: get bonus 10000 = turnover requirement 10000`
  },
  {
    text: `All invalid/cancelled/rejected bets, tied bets, bets on both outcomes,  Live Game, Poker, Sport Bet and E-Sport will not count in for turnover.`
  },
  {
    text: `Play4win Bonuses may not be traded, transferred or sold in any form.`
  },
  {
    text: `Only one account is allowed per player. Members may be required to show proof of identity prior to receiving any promotions or bonuses. Players who open multiple or fraudulent accounts, accounts with the same IP address, in the same household or family members will not be eligible to participate in the promotion and may forfeit funds and have their accounts blocked.`
  },
  {
    text: `Players with confirmed or suspected fraudulent accounts will not be entitled to this bonus.`
  },
  {
    text: `Play4win reserves the right to withhold all prizes and bonus if it is suspected that fraudulent activity has occurred.`
  },
  {
    text: `Play4win reserves the right of final decision and the right of final interpretation of this event.`
  }
];

const birthdayTerms = [
  {
    text: `Conditions for Birthday Bonus: Players registered reached 3 months and above need to contact customer service to apply , members will also be asked to show proof of identity and can only receive the bonus once a year. Birthday bonus will be paid according to the guidelines set by the management.`
  },
  {
    text: `This bonus for withdrawals are issued before the turnover requirement of x1, Example: get bonus 10000 = turnover requirement 10000`
  },
  {
    text: `All invalid/cancelled/rejected bets, tied bets, bets on both outcomes, Live Game, Poker, Sport Bet and E-Sport will not count in for turnover.`
  },
  {
    text: `Play4win Bonuses may not be traded, transferred or sold in any form.`
  },
  {
    text: `Only one account is allowed per player. Members may be required to show proof of identity prior to receiving any promotions or bonuses. Players who open multiple or fraudulent accounts, accounts with the same IP address, in the same household or family members will not be eligible to participate in the promotion and may forfeit funds and have their accounts blocked.`
  },
  {
    text: `Players with confirmed or suspected fraudulent accounts will not be entitled to this bonus.`
  },
  {
    text: `Play4win reserves the right to withhold all prizes and bonus if it is suspected that fraudulent activity has occurred. 8. Play4win reserves the right of final decision and the right of final interpretation of this event.`
  }
];

const showRebate = ref(false);
const currentDisplayTerms = ref(birthdayTerms);
const onShowRebateClick = (flag) => {
  showRebate.value = flag;
  if (showRebate.value) currentDisplayTerms.value = terms;
  else currentDisplayTerms.value = birthdayTerms;
};

const columns = [
  {
    title: "VIP Level",
    dataIndex: "vipLevel",
    key: "vipLevel",
    colSpan: 2,
    customCell: (_, index) => ({
      colSpan: index === 0 ? 2 : 1
    })
  },
  {
    title: "VIP 0",
    dataIndex: "vip0",
    key: "vip0"
  },
  {
    title: "VIP 1",
    dataIndex: "vip1",
    key: "vip1"
  },
  {
    title: "VIP 2",
    dataIndex: "vip2",
    key: "vip2"
  },
  {
    title: "VIP 3",
    dataIndex: "vip3",
    key: "vip3"
  },
  {
    title: "VIP 4",
    dataIndex: "vip4",
    key: "vip4"
  },
  {
    title: "VIP 5",
    dataIndex: "vip5",
    key: "vip5"
  },
  {
    title: "VIP 6",
    dataIndex: "vip6",
    key: "vip6"
  },
  {
    title: "VIP 7",
    dataIndex: "vip7",
    key: "vip7"
  },
  {
    title: "VIP 8",
    dataIndex: "vip8",
    key: "vip8"
  }
].map((props) => ({ ...props, className: "highlight" })); // add highlight color to every column

const columnsData = [
  {
    key: "1",
    vipLevel: "Turnover Bonus",
    vip0: "X",
    vip1: "X",
    vip2: "X",
    vip3: "X",
    vip4: "0.01%",
    vip5: "0.05%",
    vip6: "0.10%",
    vip7: "0.25%",
    vip8: "0.50%"
  }
];

const columns3 = [
  {
    title: "Upgrade Achievement",
    dataIndex: "upgradeAchievement",
    key: "upgradeAchievement",
    colSpan: 10,
    className: "highlight",
    customCell: (_, index) => {
      if (index < 2) return { colSpan: 2 };
    }
  },
  {
    title: "",
    dataIndex: "vip0",
    key: "vip0",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip1",
    key: "vip1",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip2",
    key: "vip2",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip3",
    key: "vip3",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip4",
    key: "vip4",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip5",
    key: "vip5",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip6",
    key: "vip6",
    colSpan: 0
  },
  {
    title: "",
    dataIndex: "vip7",
    key: "vip7",
    colSpan: 0
  }
];

const column3Data = [
  {
    key: "1",
    upgradeAchievement: "Accumulated Deposits",
    vip0: "≥100",
    vip1: "≥10000",
    vip2: "≥100000",
    vip3: "≥500000",
    vip4: "≥1000000",
    vip5: "≥3000000",
    vip6: "≥5000000",
    vip7: "≥10000000",
    className: "highlight"
  },
  {
    key: "2",
    upgradeAchievement: "Promotion Level",
    vip0: "VIP 1",
    vip1: "VIP 2",
    vip2: "VIP 3",
    vip3: "VIP 4",
    vip4: "VIP 5",
    vip5: "VIP 6",
    vip6: "VIP 7",
    vip7: "VIP 8"
  }
];

const columns4 = [
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    colSpan: 2,
    className: "highlight",
    customCell: (_, index) => ({
      colSpan: index === 0 ? 2 : 1
    })
  },
  {
    title: "VIP 0",
    dataIndex: "vip0",
    key: "vip0"
  },
  {
    title: "VIP 1",
    dataIndex: "vip1",
    key: "vip1"
  },
  {
    title: "VIP 2",
    dataIndex: "vip2",
    key: "vip2"
  },
  {
    title: "VIP 3",
    dataIndex: "vip3",
    key: "vip3"
  },
  {
    title: "VIP 4",
    dataIndex: "vip4",
    key: "vip4"
  },
  {
    title: "VIP 5",
    dataIndex: "vip5",
    key: "vip5"
  },
  {
    title: "VIP 6",
    dataIndex: "vip6",
    key: "vip6"
  },
  {
    title: "VIP 7",
    dataIndex: "vip7",
    key: "vip7"
  },
  {
    title: "VIP 8",
    dataIndex: "vip8",
    key: "vip8"
  }
];

const column4Data = [
  {
    key: "1",
    level: "Cumulative withdrawal limit for a single day",
    vip0: "50,000",
    vip1: "100,000",
    vip2: "500,000",
    vip3: "1,000,000",
    vip4: "5,000,000",
    vip5: "10,000,000",
    vip6: "10,000,000",
    vip7: "10,000,000",
    vip8: "10,000,000"
  }
];

const birthdayColumnData = [
  {
    key: "1",
    vipLevel: "Birthday Bonus",
    vip0: "X",
    vip1: "X",
    vip2: "X",
    vip3: "188",
    vip4: "288",
    vip5: "388",
    vip6: "488",
    vip7: "588",
    vip8: "888"
  }
];

const promoExclusive = [
  {
    title: "VIP Level",
    dataIndex: "vipLevel",
    key: "vipLevel",
    render: (text) => String(text)
  },
  {
    title: "VIP 1",
    dataIndex: "vip1",
    key: "vip1"
  },
  {
    title: "VIP 2",
    dataIndex: "vip2",
    key: "vip2"
  },
  {
    title: "VIP 3",
    dataIndex: "vip3",
    key: "vip3"
  },
  {
    title: "VIP 4",
    dataIndex: "vip4",
    key: "vip4"
  },
  {
    title: "VIP 5",
    dataIndex: "vip5",
    key: "vip5"
  },
  {
    title: "VIP 6",
    dataIndex: "vip6",
    key: "vip6"
  },
  {
    title: "VIP 7",
    dataIndex: "vip7",
    key: "vip7",
    render: (text) => String(text)
  }
];
const dataExclusive = [
  {
    key: "1",
    vipLevel: "Withdrawal Funds",
    vip1: "500,000/Day",
    vip2: "500,000/Day",
    vip3: "500,000/Day",
    vip4: "1,000,000/Day",
    vip5: "1,000,000/Day",
    vip6: "1,000,000/Day",
    vip7: "1,500,000/Day"
  },
  {
    key: "2",
    vipLevel: "Bet Limit",
    vip1: "Standard",
    vip2: "Standard",
    vip3: "Standard",
    vip4: "Standard",
    vip5: "High limit",
    vip6: "High limit",
    vip7: "High limit"
  },
  {
    key: "3",
    vipLevel: "Priority Payment Method",
    vip1: "",
    vip2: "",
    vip3: "",
    vip4: "",
    vip5: "✔",
    vip6: "✔",
    vip7: "✔"
  },
  {
    key: "4",
    vipLevel: "24/7 VIP Customer Care Team",
    vip1: "",
    vip2: "",
    vip3: "",
    vip4: "",
    vip5: "",
    vip6: "✔",
    vip7: "✔"
  },
  {
    key: "5",
    vipLevel: "Invitation to Exclusive Events",
    vip1: "",
    vip2: "",
    vip3: "",
    vip4: "",
    vip5: "",
    vip6: "",
    vip7: "✔"
  }
];

const vipItems = [
  {
    vipLevel: "1",
    upgrade: "100",
    monthly: "",
    birthday: "",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.20%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.30%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "2",
    upgrade: "10,000",
    monthly: "188",
    birthday: "",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.20%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.30%",
      // },

      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "3",
    upgrade: "100,000",
    monthly: "688",
    birthday: "888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.30%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.40%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "4",
    upgrade: "500,000",
    monthly: "1,588",
    birthday: "2,888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.40%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.40%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "5",
    upgrade: "1,000,000",
    monthly: "2,888",
    birthday: "5,888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.50%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.50%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "6",
    upgrade: "3,000,000",
    monthly: "6,888",
    birthday: "8,888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.60%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.50%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "7",
    upgrade: "5,000,000",
    monthly: "18,888",
    birthday: "48,888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.80%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.60%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  },
  {
    vipLevel: "8",
    upgrade: "",
    monthly: "18,888",
    birthday: "48,888",
    rebates: [
      {
        rebateName: "Slots Rebate",
        rebateValue: "1.00%"
      },
      {
        rebateName: "Fishing Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Live Casino Rebate",
        rebateValue: "0.80%"
      },
      // {
      //   rebateName: "เงินคืนไพ่",
      //   rebateValue: "0.80%",
      // },
      {
        rebateName: "Poker Rebate",
        rebateValue: "0.80%"
      },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      },
      // {
      //   rebateName: "เเงินคืนล็อตตารี่",
      //   rebateValue: "0.60%",
      // },
      {
        rebateName: "Sport/EsportsRebate",
        rebateValue: "0.65%"
      },
      {
        rebateName: "Lottery Rebate",
        rebateValue: "0.60%"
      }
    ]
  }
];
</script>
<style scoped lang="scss">
.modal-div {
  width: 340px;
  position: relative;
  margin: 0 auto;
  .img-item {
    color: rgb(255, 255, 255);
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 61%;
    text-align: center;
    .inner-contents {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  .amount {
    font-size: 55px;
    line-height: 65px;
    font-weight: bold;
  }
  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}

.vip-container {
  color: #ffffff;
}

.vip-badge-swiper {
  margin-bottom: 23px;

  &::part(container) {
    overflow-x: clip;
    overflow-y: visible;
  }

  swiper-slide {
    display: flex;
    align-items: center;

    .slide-badge {
      flex: 1;
    }
  }
}

.vip-reward-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;

  .vip-reward-ticket {
    display: flex;
    align-items: center;
    background-image: url(@/assets/images/vip/ticket/ticket-mask.png);
    background-size: cover;
    padding: 8px;
    width: 242px;
    height: 75px;

    .vip-reward-ticket__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      border-radius: 50%;
      width: 25px;
      height: 25px;
      margin-right: 19px;
    }

    .vip-reward-ticket__description {
      margin-right: 32px;
      font-family: Poppins;
      font-size: 12px;
      line-height: 18px;
      color: #ffffff;

      .vip-reward-ticket__title {
        font-weight: 700;
      }
    }

    .vip-reward-ticket__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      justify-content: space-between;
      align-items: end;

      .vip-reward-ticket__amount {
        padding: 4px 20px;
        border-radius: 10px;
        background: #ffffff1a;
        font-family: Poppins;
        font-size: 14px;
        font-weight: 700;
        line-height: 21px;
        text-align: center;
      }

      .vip-reward-ticket__status {
        svg {
          fill: #ffffff;
          width: 14px;
        }
      }
    }
  }
}

.vip-upgrade-rule {
  font-family: Poppins;
  font-size: 18px;
  font-weight: 700;
  line-height: 30px;
}

.vip-ranking-table {
  width: 90%;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  text-align: center;

  thead {
    background: linear-gradient(180deg, #70bc62 0%, #33562d 100%);
    td {
      padding: 8px 0;
      font-family: Manrope;
      font-size: 16px;
      font-weight: 700;
      line-height: 27.2px;
    }
  }

  tbody {
    background: #70bc621a;
    td {
      border: 1px solid #ffffff1a;
      padding: 6px 0;
    }
  }
}

.vip-upgrade-rule-2 {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 23.8px;
  color: #ffffffcc;
}
</style>

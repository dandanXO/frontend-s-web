<template>
  <div class="vip-container">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("personalView.vip.title") }}</span>
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
      <swiper-slide v-for="(data, index) in vipTableData" :key="index">
        <vip-badge
          class="slide-badge"
          :level="index"
          :current-deposit="currentDepositNumber"
          :qualification="data.qualification"
        />
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
    <div class="vip-upgrade-rule">{{ $t("personalView.vip.rule1") }}</div>
    <table class="vip-ranking-table">
      <thead>
        <tr>
          <td><img src="@/assets/images/vip/vip-table-icon.png" /></td>
          <td>{{ $t("personalView.vip.table.header.experience") }}</td>
          <td>{{ $t("personalView.vip.table.header.oneOffReward") }}</td>
          <td>{{ $t("personalView.vip.table.header.monthlyReward") }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in vipTableData" :key="index">
          <td>{{ data.name }}</td>
          <td>
            <img src="@/assets/images/vip/vip-table-coin-icon.png" />
            {{ addThousandsComma(data.qualification) }}
          </td>
          <td>
            <img src="@/assets/images/vip/vip-table-coin-icon.png" />
            {{ addThousandsComma(data.oneOff) }}
          </td>
          <td>
            <img src="@/assets/images/vip/vip-table-coin-icon.png" />
            {{ addThousandsComma(data.monthly) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="vip-upgrade-rule-2">
      {{ $t("personalView.vip.rule2") }}
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
import { addThousandsComma } from "@/utils/utils";
import { useI18n } from "vue-i18n";
// import { message } from "ant-design-vue";

const store = userStore();
const { currentDepositNumber, vip } = storeToRefs(store);
const { t } = useI18n();

const amount = ref("$0");
const privilegeClaimedModalVisible = ref(false);

const currentVipLevel = computed(() => {
  const level = vipTableData.value.find((data) => data.name.replace(" ") === vip.value);
  return level || vipTableData.value[0];
});

const rewards = computed(() => {
  return [
    {
      title: t("personalView.vip.privilege.oneOff.title"),
      description: t("personalView.vip.privilege.oneOff.type"),
      amount: currentVipLevel.value.oneOff,
      status: "unavailable"
    },
    {
      title: t("personalView.vip.privilege.monthly.title"),
      description: t("personalView.vip.privilege.monthly.type"),
      amount: currentVipLevel.value.monthly,
      status: "unavailable"
    },
    // TODO: check amount
    {
      title: t("personalView.vip.privilege.withdrawal.title"),
      description: t("personalView.vip.privilege.withdrawal.type"),
      amount: 20,
      status: "unavailable"
    }
  ];
});

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

const vipTableData = ref([
  {
    name: "VIP 0",
    qualification: 5000,
    oneOff: 0,
    monthly: 0
  },
  {
    name: "VIP 1",
    qualification: 5000,
    oneOff: 20,
    monthly: 38
  },
  {
    name: "VIP 2",
    qualification: 10000,
    oneOff: 25,
    monthly: 88
  },
  {
    name: "VIP 3",
    qualification: 20000,
    oneOff: 50,
    monthly: 188
  },
  {
    name: "VIP 4",
    qualification: 50000,
    oneOff: 100,
    monthly: 388
  },
  {
    name: "VIP 5",
    qualification: 100000,
    oneOff: 200,
    monthly: 588
  },
  {
    name: "VIP 6",
    qualification: 200000,
    oneOff: 300,
    monthly: 888
  },
  {
    name: "VIP 7",
    qualification: 500000,
    oneOff: 1000,
    monthly: 1888
  },
  {
    name: "VIP 8",
    qualification: 1000000,
    oneOff: 2000,
    monthly: 3888
  },
  {
    name: "VIP 9",
    qualification: 2000000,
    oneOff: 3000,
    monthly: 8888
  },
  {
    name: "VIP 10",
    qualification: 5000000,
    oneOff: 10000,
    monthly: 28888
  },
  {
    name: "VIP 11",
    qualification: 10000000,
    oneOff: 20000,
    monthly: 58888
  },
  {
    name: "VIP 12",
    qualification: 20000000,
    oneOff: 30000,
    monthly: 88888
  }
]);
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
  color: #8c968f;
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
      flex: 1;
      font-size: 12px;
      line-height: 18px;

      .vip-reward-ticket__title {
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
        font-size: 14px;
        line-height: 21px;
        text-align: center;
      }

      .vip-reward-ticket__status {
        display: flex;
        flex: 1;
        align-items: end;
        svg {
          fill: #ffffff;
          width: 14px;
        }
      }
    }
  }
}

.vip-upgrade-rule {
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 16px;
}

.vip-ranking-table {
  width: 90%;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  text-align: center;
  margin-bottom: 16px;

  thead {
    background: linear-gradient(180deg, #70bc62 0%, #33562d 100%);
    color: #ffffff;
    td {
      padding: 8px 0;
      font-size: 16px;
      line-height: 27.2px;
    }
  }

  tbody {
    > :nth-child(odd) {
      background: #70bc621a;
    }

    tr {
      td {
        border: 1px solid #ffffff1a;
        padding: 6px 0;
      }

      > :first-child {
        border-left: none;
      }

      > :last-child {
        border-right: none;
      }
    }
  }
}

.vip-upgrade-rule-2 {
  font-size: 14px;
  font-weight: 400;
  line-height: 23.8px;
}
</style>

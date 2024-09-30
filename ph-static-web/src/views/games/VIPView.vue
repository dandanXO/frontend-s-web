<template>
  <div class="vip-container">
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

    <Carousel :items-to-show="2.95" :wrap-around="true">
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
              <!-- vip progress bar start -->
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
              <!-- vip progress bar end -->
            </div>
            <!-- <div :class="`vipLevelReachStatus ${getVipLevelProgress(vip) === 100 && !!vipLevel ? 'vipLevelReached' : ''}`">
              <span>{{ getVipLevelProgress(vip) === 100 && !!vipLevel ? 'Achieved' : 'Not Yet' }}</span>
            </div> -->
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
    </Carousel>

    <div class="vip-program">
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
    </div>

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

<script>
import { ref, defineComponent, computed } from "vue";
import { claimBonusItem } from "@/api/index/promo";
import { userStore } from "@/store";
import { Carousel, Slide, Navigation } from "vue3-carousel";
// import { message } from "ant-design-vue";

export default defineComponent({
  name: "TransitRecordView",
  components: {
    Carousel,
    Slide,
    Navigation
  },
  setup() {
    const store = userStore();
    const amount = ref("$0");
    const privilegeClaimedModalVisible = ref(false);
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

    return {
      columns,
      columnsData,
      columns3,
      column3Data,
      columns4,
      column4Data,
      birthdayColumnData,
      showRebate,
      currentDisplayTerms,
      onShowRebateClick,
      promoExclusive,
      dataExclusive,
      terms,
      birthdayTerms,
      vipItems,
      vipLevel,
      getVipLevelProgress,
      storeToken,
      dailySlot,
      loadingClaim,
      loadingMClaim,
      loadingBClaim,
      amount,
      privilegeClaimedModalVisible
    };
  }
});
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

$max-width: $container-width;

.dark-theme {
  .vip-container .vip-program .note {
    color: #83a3ca;
  }
  .vip-container .terms-conditions .game-title {
    color: #ffffff;
  }
  .vip-container .vip-program .buttons {
    background: #ffffff0f;
    .vipp-btn {
      color: #ffffff;
    }
  }
}
.vip-container {
  color: #8d8d8d;
  min-height: 100vh;
  background: url("../../assets/images/index/centerbg.png") no-repeat center center;

  .banner-container {
    // background: url("../../assets/images/vip/banner.png") no-repeat center center;
    background-size: cover;
    padding-top: 100px;
    padding-bottom: 200px;
    // width: 1920px;
    // height: 450px;
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 371px;
    display: flex;
    .btn-wrapper {
      width: 95%;
      max-width: $container-width;
      margin: auto;
      position: relative;

      .center {
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: $primary-color;
        .page-blend {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          font-family: Wave;

          font-size: 60px;
          line-height: 60px;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          width: 100%;
          max-width: 460px;
          .pesos {
            font-family: sans-serif;
            font-weight: bold;
          }
        }
        .page-liner {
          font-size: 20px;
          text-transform: none;
        }
        img {
          max-width: unset;
        }
        .common-btn.getnow {
          background: #ffffff;
          color: #000000;
          border: transparent;
          &:hover {
            background: #ffd800;
          }
        }
      }
    }
  }
  .inner-vip-mobile {
    display: none;
  }
  .vipitem {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    position: relative;
    width: 564px;
    height: 284px;
    background: url("../../assets/images/vip/badge/banner-1.png") no-repeat top center;
    background-size: contain;

    &2 {
      background: url("../../assets/images/vip/badge/banner-2.png") no-repeat top center;
      background-size: contain;
    }

    &3 {
      background: url("../../assets/images/vip/badge/banner-3.png") no-repeat top center;
      background-size: contain;
    }

    &4 {
      background: url("../../assets/images/vip/badge/banner-4.png") no-repeat top center;
      background-size: contain;
    }

    &5 {
      background: url("../../assets/images/vip/badge/banner-5.png") no-repeat top center;
      background-size: contain;
    }

    &6 {
      background: url("../../assets/images/vip/badge/banner-6.png") no-repeat top center;
      background-size: contain;
    }

    &7 {
      background: url("../../assets/images/vip/badge/banner-7.png") no-repeat top center;
      background-size: contain;
    }

    &8 {
      background: url("../../assets/images/vip/badge/banner-8.png") no-repeat top center;
      background-size: contain;
    }

    .vipLevelReachStatus {
      // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-unachieved.png") no-repeat left
      //   center;
      background-size: contain;
      margin-top: 15px;
      margin-left: 2px;
      z-index: 1;
      text-align: left;
      height: 30px;

      &.vipLevelReached {
        // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-achieved.png") no-repeat left
        //   center;
        background-size: contain;
      }

      span {
        color: #fff;
        margin-left: 10px;
      }
    }

    .vipcontents {
      height: 100%;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
      padding: 80px 30px 30px;

      .title {
        color: #ffffff;
        text-align: center;
        font-family: "Baloo Bhaina";
        font-size: 44.319px;
        font-weight: 700;
        line-height: normal;
      }

      .description {
        color: #ffffff;
        font-size: 17.987px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      .progressBarContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .progressBarOuterBar {
          border-radius: 16px;
          background: #ffffff4d;
          width: 100%;
          overflow: hidden;
        }

        .progressBarInnerBar {
          color: #fff;
          border-radius: 16px;
          background: #ffffff;
          height: 10px;
        }

        .progressBarDescription {
          display: flex;
          justify-content: space-between;
          color: #ffffff;
          font-size: 17.987px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
      .inner-vip {
        background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 45px;
        line-height: 53px;
        font-family: "Arial";
      }
    }
  }

  .vip-program {
    margin: 50px auto;
    max-width: 1080px;
    width: 95%;

    .buttons {
      // display: flex;
      // justify-content: center;
      // align-items: stretch;
      // border: 1px solid #fce9c5;
      // border-radius: 58.321px;
      // width: fit-content;
      // margin: 0px auto 20px auto;

      position: relative;
      display: flex;
      background: #ffffff;
      border-radius: 5px;
      margin: 0px auto 20px;
      justify-content: center;
      align-items: center;
      width: 100%;
      text-align: center;
      max-width: 750px;

      .vipp-btn {
        // display: block;
        // text-align: center;
        // color: #858585;
        // background: #f9fcff;
        // border: 0px;
        // border-radius: 58.321px;
        cursor: pointer;
        color: #222222;
        padding: 8px 15px;
        transition: color 0.3s ease-out;
        z-index: 1;
        font-family: Inter Medium;
        flex: 1;
        &.active {
          // background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          // box-shadow: 0px 2.33286px 2.33286px 0px rgba(255, 255, 255, 0.25) inset,
          //   0px -2.33286px 2.33286px 0px rgba(137, 82, 0, 0.25) inset;
          // color: #fff;
          background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
          color: #ffffff;
          box-shadow: 0px -3.1666667461395264px 3.9583334922790527px 0px #0b081d33 inset;

          border-radius: 5px;
          top: 4px;
          left: 4px;
          opacity: 1;
          transition: left 0.4s ease-out, width 0.4s ease-out, opacity 0.4s ease-out 0.4s;
        }
      }
    }

    .separator {
      margin: 20px 0;
    }
    .note {
      color: #83a3ca;
      font-size: 14px;
      margin-top: 10px;
      display: block;
      font-family: Inter Medium;
      text-transform: uppercase;

      color: #83a3ca;
      position: relative;
      padding-left: 20px;
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        position: absolute;
        transform: rotateZ(45deg);
        left: 0px;
        top: 5px;
      }
    }
  }
  .terms-conditions {
    padding-bottom: 80px;
    margin: 0 auto;
    width: 90%;
    max-width: 1080px;
    position: relative;
    .game-title {
      color: #222222;
      font-family: Poppins Bold;
      font-size: 30px;
      text-align: left;
    }
    .terms-conditions-title-separator {
      width: 100%;
      height: 100%;
      display: none;
    }
    .terms {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      font-weight: 400;
      line-height: 30px;
      color: #83a3ca;
      margin: 0;
      padding: 0;
      align-items: flex-start;

      .term {
        width: 100%;
        list-style-type: none;
        color: #83a3ca;
        position: relative;
        padding-left: 20px;
        &:before {
          content: "";
          width: 8px;
          height: 8px;
          background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
          position: absolute;
          transform: rotateZ(45deg);
          left: 0px;
          top: 5px;
        }
      }
    }
  }
}
.section-product {
  width: 95%;
  min-height: 70vh;
  margin: 0 auto;
  padding: 50px 0 80px 0;
  max-width: $max-width;
  /* position: relative; */
  .title {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      margin-top: 20px;
      background-color: rgb(214, 214, 214);
    }
  }
  .subintro {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: 100;
    color: #190f25;
  }
  .item-group {
    padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    &:last-child {
      padding-top: 30px;
    }
  }
  .set {
    margin: auto;
    width: 100%;
  }
  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 340px;
    margin: auto;
    overflow: hidden;
    .theme {
      overflow: hidden;
      img {
        width: 100%;
        vertical-align: middle;
        margin-top: 70px;
        border-radius: 20px 20px 0 0;
      }
    }
    .main-object {
      position: absolute;
      top: 0;
      right: 0px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }
    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    .txt {
      position: absolute;
      bottom: 0px;
      padding: 20px 80px 20px 20px;
      color: #fff;
      width: 100%;
      filter: brightness(0.9);
      border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
      }
      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }
    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}
@media (max-width: 767px) {
  .section-product .item-group {
    grid-template-columns: 1fr;
  }

  .vip-program {
    display: none;
  }
  .vip-container {
    .banner-container {
      min-height: 300px;
      background-position: center center;
      .btn-wrapper {
        .center {
          max-width: 300px;
          width: 100%;
          margin: 0 auto;

          .page-headline {
            font-size: 5rem;
            line-height: 5rem;
          }
          .page-blend {
            font-size: 1.7rem;
            line-height: 1.7rem;
            padding: 10px;
          }
          .page-subline {
            font-size: 1rem;
            line-height: 1rem;
          }
          .page-liner {
            font-size: 0.7rem;
            line-height: 1rem;
          }
        }
      }
    }
    .vipitem {
      width: 430px;
      height: 215px;
      margin: auto;
      .vipLevelReachStatus {
        margin-top: 12px;
        margin-left: 3px;
      }
      .vipcontents {
        padding-bottom: 10px;
      }
    }
    .inner-vip-mobile {
      margin-top: 20px;
      display: block;

      .rebates {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100vw;
        gap: 10px;
        padding: 10px;
        .rebate {
          border-top: 5px solid #dc5e43;
          border-bottom: 5px solid #dc5e43;
          border-radius: 20px;
          .name {
            font-size: 12px;
            line-height: 15px;

            padding: 20px 0;
          }
          .value {
            margin: 20px 0 0;
            font-family: Wave;
            font-size: 30px;
          }
        }
      }
    }
  }
}
@media (max-width: 500px) {
  .vip-container {
    .inner-vip-mobile {
      .rebates {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.carousel {
  max-width: 1080px;
  margin: 0 auto;
}
.carousel__item {
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: 100%;
  font-size: 20px;
  border-radius: 8px;
}

.carousel__slide {
  padding: 10px;
  align-items: flex-start;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background: url(../../assets/images/vip/nextprev.png) no-repeat center center;
  background-size: contain;
  top: 45%;
  .carousel__icon {
    display: none;
  }
}
.carousel__prev {
  top: 46.5%;
  left: 4%;
}
.carousel__next {
  transform: rotate(180deg);
}
.carousel__slide > .carousel__item {
  transform: scale(0.2);
  filter: brightness(0.7) grayscale(1);
  transition: 0.5s;
}
.carousel__slide--visible > .carousel__item {
  opacity: 1;
  filter: brightness(1) grayscale(0);
  transform: rotateY(0);
}
.carousel__slide--next > .carousel__item {
  /* transform: scale(1.2) translate(-10px); */
  transform: scale(0.8) translate(-170px);
  z-index: -2;
}
.carousel__slide--prev > .carousel__item {
  transform: scale(0.8) translate(170px);
  z-index: -2;
  /* transform: scale(0.9) translate(10px); */
}
.carousel__slide--active > .carousel__item {
  transform: scale(1);
  z-index: 0;
}
@media (max-width: 767px) {
  .carousel__prev,
  .carousel__next {
    top: 15%;
  }
  .carousel__next {
    top: 13.5%;
    right: 2%;
  }

  .carousel__slide > .carousel__item {
    transform: scale(0);
    filter: brightness(0.7);
    transition: 0.5s;
  }
  .carousel__slide--visible > .carousel__item {
    opacity: 1;
    filter: brightness(1);
    transform: rotateY(0);
  }

  .carousel__slide--next > .carousel__item {
    /* transform: scale(1.2) translate(-10px); */
    // transform: scale(0.8) translate(-0px);
    // z-index: -2;
    .inner-vip-mobile {
      display: none;
    }
  }
  .carousel__slide--prev > .carousel__item {
    // transform: scale(0.8) translate(0px);
    // z-index: -2;
    /* transform: scale(0.9) translate(10px); */
    .inner-vip-mobile {
      display: none;
    }
  }
}
</style>

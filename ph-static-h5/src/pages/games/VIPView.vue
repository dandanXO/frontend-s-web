<template>
  <div class="vip-container">
    <div class="banner-container">
      <div class="btn-wrapper">
        <!--        <div class="center">-->
        <!--          <div class="page-headline">VIP</div>-->
        <!--          <div class="page-subline">VIP special privileges</div>-->
        <!--        </div>-->
      </div>
    </div>
    <q-carousel class="vip bg-transparent" animated v-model="slide" arrows infinite swipeable>
      <q-carousel-slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex" :name="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <!-- <div
              class="achieved-div"
              :style="
                vipLevel >= vip.vipLevel
                  ? 'background-image: url(' + require('../../assets/vip/achieved-bg.png') + ');'
                  : 'background-image: url(' + require('../../assets/vip/notyet-bg.png') + ');'
              "
            >
              {{ vipLevel >= vip.vipLevel ? "Achieved" : "Not Yet" }}
            </div> -->

            <div class="viplevelcircle">VIP{{ vip.vipLevel }}</div>

            <div class="vipcontents" :style="vip.upgrade === 'Successful deposit' ? 'padding-top: 120px;' : ''">
              <!--              <div class="title">Upgrade Requirements</div>-->
              <div class="inner-vip" v-if="vip.vipLevel !== '8'">
                <span v-if="vip.vipLevel !== '0'">Accummulate Deposit</span>
                {{ vip.upgrade }}
              </div>

              <div class="inner-vip" v-if="vip.vipLevel === '8'" style="max-width: 150px; text-align: left">
                <span style="font-size: 12px">Congratulations on reaching the highest level</span>
              </div>

              <div class="progressBarContainer" v-if="vip.vipLevel !== '8'">
                <div class="progressBarOuterBar">
                  <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vip) + '%' }" />
                </div>
                <div class="progressBarDescription">
                  <span>
                    {{ `VIP ${vip.vipLevel}` }}
                  </span>
                  <span>
                    {{ `VIP ${+vip.vipLevel + 1}` }}
                  </span>
                </div>
              </div>
              <div class="progressBarContainer" v-if="vipLevel === '8' && store.hasToken()">
                Congratulations on reaching this level!
              </div>

              <!--              <div class="second-vip">-->
              <!--                <div v-if="vip.monthly">-->
              <!--                  <div class="title">Monthly Bonus</div>-->
              <!--                  <div class="inner-vip">{{ vip.monthly }}</div>-->
              <!--                  <q-btn-->
              <!--                    :loading="loadingMClaim"-->
              <!--                    v-if="store.hasToken() && vip.vipLevel == vipLevel"-->
              <!--                    @click="claimRebate('jolly88-vip-monthly', 'monthly')"-->
              <!--                    color="brand"-->
              <!--                    glossy-->
              <!--                    label="Claim Now"-->
              <!--                  />-->
              <!--                </div>-->
              <!--                <div v-if="vip.birthday">-->
              <!--                  <div class="title">Birthday Bonus</div>-->
              <!--                  <div class="inner-vip">{{ vip.birthday }}</div>-->
              <!--                  <q-btn-->
              <!--                    :loading="loadingBClaim"-->
              <!--                    v-if="store.hasToken() && vip.vipLevel == vipLevel"-->
              <!--                    @click="claimRebate('jolly88-vip-birthday', 'birthday')"-->
              <!--                    color="brand"-->
              <!--                    glossy-->
              <!--                    label="Claim Now"-->
              <!--                  />-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="vip-program">
      <!--      <div class="game-title">VIP PROGRAM</div>-->
      <div class="buttons">
        <div class="common-btn" :class="{ active: showRebate }" @click="showRebate = true">
          VIP Daily cashback program
        </div>
        <div class="common-btn" :class="{ active: !showRebate }" @click="showRebate = false">
          VIP Birthday bonus program
        </div>
      </div>

      <div>
        <div class="rebate-table" v-if="showRebate">
          <div class="col bgcolor">VIP Level</div>
          <div class="col bgcolor">Turnover Bonus</div>

          <div class="col">VIP 0</div>
          <div class="col">-</div>
          <div class="col">VIP 1</div>
          <div class="col">-</div>
          <div class="col">VIP 2</div>
          <div class="col">-</div>
          <div class="col">VIP 3</div>
          <div class="col">-</div>
          <div class="col">VIP 4</div>
          <div class="col">0.01%</div>
          <div class="col">VIP 5</div>
          <div class="col">0.05%</div>
          <div class="col">VIP 6</div>
          <div class="col">0.10%</div>
          <div class="col">VIP 7</div>
          <div class="col">0.25%</div>
          <div class="col">VIP 8</div>
          <div class="col">0.50%</div>
        </div>

        <div class="rebate-table" v-if="!showRebate">
          <div class="col bgcolor">VIP Level</div>
          <div class="col bgcolor">Birthday Bonus</div>

          <div class="col">VIP 0</div>
          <div class="col">-</div>
          <div class="col">VIP 1</div>
          <div class="col">-</div>
          <div class="col">VIP 2</div>
          <div class="col">-</div>
          <div class="col">VIP 3</div>
          <div class="col">188</div>
          <div class="col">VIP 4</div>
          <div class="col">288</div>
          <div class="col">VIP 5</div>
          <div class="col">388</div>
          <div class="col">VIP 6</div>
          <div class="col">488</div>
          <div class="col">VIP 7</div>
          <div class="col">588</div>
          <div class="col">VIP 8</div>
          <div class="col">888</div>
        </div>

        <div class="rebate-table">
          <div class="col bgcolor" style="grid-column: 1/-1">Upgrade Achievement</div>

          <div class="col bgcolor">Accumulated Deposits</div>
          <div class="col bgcolor">Promotion Level</div>

          <div class="col">≥1,00</div>
          <div class="col">VIP 1</div>
          <div class="col">≥10,000</div>
          <div class="col">VIP 2</div>
          <div class="col">≥100,000</div>
          <div class="col">VIP 3</div>
          <div class="col">≥500,000</div>
          <div class="col">VIP 4</div>
          <div class="col">≥1,000,000</div>
          <div class="col">VIP 5</div>
          <div class="col">≥3,000,000</div>
          <div class="col">VIP 6</div>
          <div class="col">≥5,000,000</div>
          <div class="col">VIP 7</div>
          <div class="col">≥10,000,000</div>
          <div class="col">VIP 8</div>
        </div>

        <div class="rebate-table" style="grid-template-columns: 1fr 2fr">
          <div class="col bgcolor">Level</div>
          <div class="col bgcolor">Cumulative withdrawal limit for a single day</div>

          <div class="col">VIP 0</div>
          <div class="col">50,000</div>
          <div class="col">VIP 1</div>
          <div class="col">100,000</div>
          <div class="col">VIP 2</div>
          <div class="col">500,000</div>
          <div class="col">VIP 3</div>
          <div class="col">1000,000</div>
          <div class="col">VIP 4</div>
          <div class="col">5,000,000</div>
          <div class="col">VIP 5</div>
          <div class="col">10,000,000</div>
          <div class="col">VIP 6</div>
          <div class="col">10,000,000</div>
          <div class="col">VIP 7</div>
          <div class="col">10,000,000</div>
          <div class="col">VIP 8</div>
          <div class="col">10,000,000</div>
        </div>
      </div>

      <span class="note">*Note: All the Bonus, Deposit amount and withdrawal amount in PHP</span>

      <div class="left"></div>
      <div class="right"></div>
    </div>
    <div class="terms-conditions">
      <div class="vip-title">Terms and Conditions</div>
      <!-- <img src="../../assets/images/index/rule-title-bg.png" style="width: 100%" /> -->
      <div class="terms" v-if="showRebate">
        <div class="term" v-for="(term, i) in terms" :key="i">
          <!--          <div class="circle-wrapper">-->
          <!--            <div class="circle"></div>-->
          <!--          </div>-->
          <div class="term-text">{{ i + 1 }}. {{ term.text }}</div>
        </div>
      </div>

      <div class="terms" v-if="!showRebate">
        <div class="term" v-for="(term, i) in terms2" :key="i">
          <!--          <div class="circle-wrapper">-->
          <!--            <div class="circle">{{ i + 1 }}</div>-->
          <!--          </div>-->
          <div class="term-text">{{ i + 1 }}. {{ term.text }}</div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isClaimModal" persistent>
      <q-card class="win-rebate-model">
        <q-card-section class="row items-center">
          <div class="bonus-svg-div">
            <span class="claim-amt">{{ claimMsg }}</span>
            <span class="bonus-text">Bonus</span>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { userStore } from "stores/index";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();

    const slide = ref(0);
    const showRebate = ref(true);

    const store = userStore();
    const vipLevel = ref("");
    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel"
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
      }
    ];
    const data = [
      {
        key: "1",
        vipLevel: "Slots Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.50%",
        vip5: "0.60%",
        vip6: "0.80%",
        vip7: "1.00%"
      },
      {
        key: "2",
        vipLevel: "Fishing Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "3",
        vipLevel: "Live Casino Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "4",
        vipLevel: "Poker Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "5",
        vipLevel: "Sports/Esports Rebate",
        vip1: "0.20%",
        vip2: "0.30%",
        vip3: "0.35%",
        vip4: "0.40%",
        vip5: "0.45%",
        vip6: "0.55%",
        vip7: "0.65%"
      },
      {
        key: "6",
        vipLevel: "Lottery Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%"
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
        vip7: "2,000,000.00/Day"
      },
      {
        key: "2",
        vipLevel: "Bet Limit",
        vip1: "Standard",
        vip2: "Standard",
        vip3: "Standard",
        vip4: "Standard",
        vip5: "High Limit",
        vip6: "High Limit",
        vip7: "High Limit"
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

    const terms2 = [
      {
        text: `Conditions for Birthday Bonus:Players registered reached 3 months and above need to contact customer service to apply , members will also be asked to show proof of identity and can only receive the bonus once a year. Birthday bonus will be paid according to the guidelines set by the management.`
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
        text: `Play4win reserves the right to withhold all prizes and bonus if it is suspected that fraudulent activity has occurred.`
      },
      {
        text: `Play4win reserves the right of final decision and the right of final interpretation of this event.`
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
            rebateValue: "0.30%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.30%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.20%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.30%"
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
            rebateValue: "0.35%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.35%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.35%"
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
            rebateValue: "0.40%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.40%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.40%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.40%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.40%"
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
            rebateValue: "0.50%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.45%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.40%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.40%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.40%"
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
            rebateValue: "0.60%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.50%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.50%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.50%"
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
            rebateValue: "0.80%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.60%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.50%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.50%"
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
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.60%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%"
          }
        ]
      },
      {
        vipLevel: "8",
        upgrade: "10,000,000",
        monthly: "18,888",
        birthday: "48,888",
        rebates: [
          {
            rebateName: "Slots Rebate",
            rebateValue: "1.00%"
          },
          {
            rebateName: "Fishing Rebate",
            rebateValue: "0.30%"
          },
          {
            rebateName: "Live Casino Rebate",
            rebateValue: "0.80%"
          },
          // {
          //   rebateName: "Poker Rebate",
          //   rebateValue: "0.80%"
          // },
          {
            rebateName: "Sport/EsportsRebate",
            rebateValue: "0.60%"
          },
          {
            rebateName: "Lottery Rebate",
            rebateValue: "0.60%"
          }
        ]
      }
    ];

    const isClaimModal = ref(false);
    const claimMsg = ref("");

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

    onMounted(() => {
      vipLevel.value = store.vip.replace("VIP", "");
    });

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      // console.log(eventapi);
      const eventUrl = "/bonus/claim/" + type;
      console.log(eventUrl);
      eventapi
        .put(eventUrl)
        .then((res) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;

            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;

            // $q.dialog({
            //   class: "q-px-md q-pt-md",
            //   title: "สำเร็จ",
            //   message: "You won " + rebatePoint + " !",
            //   ok: {
            //     push: true,
            //     color: 'light-blue-4',
            //     label: "ตกลง",
            //     tabindex: 1
            //   },
            //   persistent: true
            // });
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }
        })
        .catch((error) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };

    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      terms2,
      vipItems,
      loading,
      vipLevel,
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      getVipLevelProgress
    };
  }
});
</script>
<style scoped lang="scss">
.vip-container {
  // background: #fff;
  min-height: 100vh;

  // .banner-container {
  //   background: url("../../assets/vip/vip-bg.png") no-repeat center center;
  //   background-size: cover;
  //   margin-bottom: -190px;
  //   padding-top: 0px;

  //   font-size: 30px;
  //   background-repeat: no-repeat;
  //   background-position: 0px -90px;
  //   width: 100%;
  //   aspect-ratio: 536/498;
  //   display: flex;

  //   .btn-wrapper {
  //     width: 95%;
  //     max-width: 1400px;
  //     margin: auto;
  //     position: relative;

  //     .center {
  //       text-transform: uppercase;
  //       display: flex;
  //       flex-direction: column;
  //       justify-content: center;
  //       align-items: center;
  //       text-align: center;
  //       color: #ffffff;

  //       .page-headline {
  //         font-size: 150px;
  //         line-height: 150px;
  //         font-family: Wave;
  //       }

  //       .page-subline {
  //         font-size: 25px;
  //         line-height: 25px;
  //         margin-bottom: 20px;
  //         font-family: Wave;
  //       }

  //       .page-blend {
  //         background-image: linear-gradient(1turn, #a2d2ff -59.29%, #e0efff 72.14%);
  //         font-family: Wave;
  //         color: #000;
  //         font-size: 60px;
  //         line-height: 60px;
  //         padding: 15px;
  //         border-radius: 20px;
  //         margin-bottom: 10px;
  //         width: 100%;
  //         max-width: 460px;

  //         .pesos {
  //           font-family: sans-serif;
  //           font-weight: bold;
  //         }
  //       }

  //       .page-liner {
  //         font-size: 20px;
  //         text-transform: none;
  //       }

  //       img {
  //         max-width: unset;
  //       }

  //       .common-btn.getnow {
  //         background: #ffffff;
  //         color: #000000;
  //         border: transparent;

  //         &:hover {
  //           background: #ffd800;
  //         }
  //       }
  //     }
  //   }

  //   // .jp-container {
  //   //   display: flex;
  //   //   justify-content: center;
  //   //   text-align: center;
  //   //   font-size: 110px;
  //   //   margin-top: 30px;
  //   //   color: #1bcef1;
  //   //   font-family: jp;
  //   //   font-weight: 600;
  //   //   line-height: 120px;

  //   //   .jp-number-item {
  //   //     width: 96px;
  //   //     height: 120px;
  //   //     // background-image: url("../../assets/images/games/casino/jp_bg.png");
  //   //     background-repeat: no-repeat;
  //   //     background-size: 100% 100%;
  //   //   }
  //   // }
  // }

  .inner-vip-mobile {
    display: none;
  }

  .vipitem {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    background: url("../../assets/vip/badge/banner-1.png") no-repeat top center;
    background-size: contain;
    width: 95%;
    aspect-ratio: 409/206;
    justify-content: flex-end;

    &2 {
      background: url("../../assets/vip/badge/banner-2.png") no-repeat top center;
      background-size: contain;
    }

    &3 {
      background: url("../../assets/vip/badge/banner-3.png") no-repeat top center;
      background-size: contain;
    }

    &4 {
      background: url("../../assets/vip/badge/banner-4.png") no-repeat top center;
      background-size: contain;
    }

    &5 {
      background: url("../../assets/vip/badge/banner-5.png") no-repeat top center;
      background-size: contain;
    }

    &6 {
      background: url("../../assets/vip/badge/banner-6.png") no-repeat top center;
      background-size: contain;
    }

    &7 {
      background: url("../../assets/vip/badge/banner-7.png") no-repeat top center;
      background-size: contain;
    }

    &8 {
      background: url("../../assets/vip/badge/banner-8.png") no-repeat top center;
      background-size: contain;
    }

    .achieved-div {
      z-index: 1;
      top: 4.5%;
      left: 0px;
      background-repeat: no-repeat;
      background-position: top center;
      background-size: contain;
      width: 116px;
      height: 32px;
      color: #fff;
      position: absolute;
    }

    .viplevelcircle {
      font-family: Baloo Bhaina;
      font-size: 24px;
      color: #ffffff;
      top: 25%;
      left: 8%;
      z-index: 1;
      position: absolute;
    }

    .vipcontents {
      padding-top: 60px;
      // background: #2b2b4b;
      color: #ffffff;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // border-top: 2px solid #db7e42;
      // border-bottom: 2px solid #db7e42;
      .title {
        font-size: 18px;
        line-height: 36px;
      }

      .progressBarContainer {
        width: 88%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: absolute;
        bottom: 8%;
        left: 6%;
        right: 6%;

        .progressBarOuterBar {
          border-radius: 16px;
          background: #ffffff4d;

          width: 100%;
          overflow: hidden;
        }

        .progressBarInnerBar {
          color: #fff;
          border-radius: 16px;
          background: white;
          height: 10px;
        }

        .progressBarDescription {
          display: flex;
          justify-content: space-between;
          color: #ffffff;
          font-family: Inter Regular;
          font-size: 10.987px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .inner-vip {
        position: absolute;
        width: 100%;
        margin-bottom: 5px;
        display: flex;
        justify-content: flex-start;
        gap: 10px;
        font-size: 10px;
        left: 20px;
        top: 63%;
        color: #ffffff;

        span {
          color: #ffffff;
        }
      }

      .second-vip {
        // background: #2b2b4b;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 45px;
        line-height: 53px;

        div {
          flex: 1;
        }

        .common-btn {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 20px;
          margin: 0 30px 30px;
        }
      }
    }
  }

  .vip-program {
    .game-title {
      margin-bottom: 10px;
    }

    margin: 50px auto;
    max-width: 1080px;
    width: 95%;

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      overflow: hidden;
      background: #ffffff;
      margin-bottom: 10px;
      color: #858585;

      .common-btn {
        height: 36px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #858585;
        background: #ffffff;

        &.active {
          border-radius: 8px;
          background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);

          color: #fff;
          font-weight: bold;
        }
      }
    }

    :deep(.ant-table-thead > tr > th) {
      text-align: center;

      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    :deep(.ant-table-tbody > tr > td) {
      &:nth-child(odd) {
        background: #2b2b4b;
      }
    }

    .note {
      color: #db7d42;
      margin-top: 5px;
      display: block;
    }
  }

  .terms-conditions {
    padding-bottom: 80px;
    max-width: 900px;
    margin: 0 auto;
    width: 95%;
    position: relative;

    .game-title {
      margin-top: 80px;
      margin-bottom: 30px;
    }

    .terms {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .term {
        .circle-wrapper {
          margin-right: -50px;

          z-index: 1;
          background: #2b2b4b;
          border: 4px solid $primary;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 10px;

          .circle {
            border: 2px solid $primary;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 50px;
            font-family: Wave;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
          }
        }

        .term-text {
          width: 100%;
          justify-content: flex-start;
          align-items: center;
          text-align: left;
          display: flex;
          font-size: 14px;
          line-height: 21px;
          color: #83a3ca;
          position: relative;
          padding-left: 10px;
          font-family: "Inter Medium";
          &:before {
            content: "";
            width: 4px;
            height: 4px;
            background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
            position: absolute;
            transform: rotateZ(45deg);
            left: 0px;
            top: 6px;
          }
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
      background: #2b2b4b;
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

.section-product .item-group {
  grid-template-columns: 1fr;
}

.vip-container {
  // .banner-container {
  //   .btn-wrapper {
  //     .center {
  //       max-width: 300px;
  //       width: 100%;
  //       margin: 0 auto;

  //       .page-headline {
  //         font-size: 5rem;
  //         line-height: 5rem;
  //       }

  //       .page-blend {
  //         font-size: 1.7rem;
  //         line-height: 1.7rem;
  //         padding: 10px;
  //       }

  //       .page-subline {
  //         font-size: 1rem;
  //         line-height: 1rem;
  //       }

  //       .page-liner {
  //         font-size: 0.7rem;
  //         line-height: 1rem;
  //       }
  //     }
  //   }
  // }

  .vipitem {
    margin: auto;

    .vipcontents {
      padding-bottom: 10px;
    }
  }

  .inner-vip-mobile {
    margin-top: 20px;
    display: block;

    .note {
      margin-top: 10px;
    }

    .rebates {
      display: grid;
      width: 100%;
      gap: 10px;

      .rebate {
        background: $primary-white;
        border-top: 5px solid $primary;
        border-bottom: 5px solid $primary;
        border-radius: 20px;

        .name {
          font-size: 12px;
          line-height: 15px;
          color: $text-color;
          padding: 20px 0;
        }

        .value {
          background: #2b2b4b;
          color: #ffffff;
          margin: 20px 0 0;
          font-family: Wave;
          font-size: 30px;
        }
      }
    }

    .note {
      color: #db7d42;
      font-size: 12px;
      text-align: left;
      padding: 0 10px;
      display: block;
    }
  }
}

// @media (max-width: 768px) {

// }

.vip-container {
  .inner-vip-mobile {
    .rebates {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

// @media (max-width: 500px) {
//   .vip-container {
//     .inner-vip-mobile {
//       .rebates {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }
//   }
// }
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.q-carousel {
  overflow: hidden;
  margin: 0 auto;
  text-align: center;

  ol {
    padding: 0;
    margin: 0 auto;
    width: 100%;
    list-style-type: none;
    display: flex;
  }

  .q-carousel__arrow .q-icon {
    font-size: 3rem;
  }

  .q-carousel__prev-arrow--horizontal {
    left: -10px;
    top: 60px;
  }

  .q-carousel__next-arrow--horizontal {
    right: -10px;
    top: 60px;
  }
}

.carousel__item {
  // background: url(../../assets/images/vip/vipbg.png)no-repeat center center;
  background-size: 100%;
  font-size: 20px;
  border-radius: 8px;
}

.carousel__slide {
  padding: 10px;
  width: 100%;
}

button {
  border: 0;
}

.rebate-table {
  margin: 10px auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  box-shadow: 0px 0px 8px 0px #00000038;
  border-radius: 12px;
  overflow: hidden;

  .col {
    &.bgcolor {
      text-align: center;
      width: 100%;
      color: #6b7280;
      display: flex;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      background: #ecf5ff;
    }
    font-size: 14px;
    padding: 5px 8px;
    border-bottom: 1px solid #dfdfdf;
    background: #ffffff;
    flex: 1;
    display: flex;
    align-items: center;
  }
}

.vip-title {
  font-size: 15px;
  font-family: Inter Medium;
  color: #222222;
}
.body--dark {
  .vip-container {
    .vip-program {
      .buttons {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06));
        border: 1px solid #535353;

        .common-btn {
          background: #00116b47;
          color: #ffffff;
        }
      }
    }
  }
  .rebate-table .col {
    background: #ffffff0f;
    color: #83a3ca;
    border-bottom: 1px solid #83a3ca;

    &.bgcolor {
      background: #00116b47;
      color: #ffffff;
    }
  }
  .vip-title {
    color: #ffffff;
  }
}
</style>

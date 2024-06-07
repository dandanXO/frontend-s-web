<template>
  <ProfileSummary :homeProfile="true" />

  <div class="vip-promo-tab-wrapper">
    <q-tabs
      v-model="vipPromoTab"
      dense
      no-caps
      class="vip-promo-tab-toggle"
      indicator-color="transparent"
      align="justify"
    >
      <q-tab class="left" name="promo" label="Promotion" />
      <q-tab class="right" name="vip" label="VIP" />
    </q-tabs>
  </div>

  <div class="receive-monthly">
    <div class="monthly-img"><img src="../../assets/images/vip/receive-monthly-img.png" width="120" /></div>
    <div class="monthly-txt">Receive monthly rewards</div>
    <div class="monthly-btn" @click="getMonthlyVip" :class="!monthlyVipReceive && 'disable'">
      <span v-if="!monthlyVipReceive">RECEIVED</span>
      <span v-else>RECEIVE</span>
    </div>
  </div>

  <div class="vip-container">
    <Carousel
      ref="vipCarouselRef"
      :items-to-show="1.15"
      :wrap-around="false"
      :snapAlign="'start'"
      v-model="vipCarouselIndex"
    >
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <div class="vip-level-header">VIP{{ vip.vipLevel }}</div>

            <div class="vip-contents" :style="vip.upgrade === 'Successful deposit' ? 'padding-top: 120px;' : ''">
              <div class="upgrade-requirements">
                <span v-if="vip.vipLevel !== '0'">Accummulate Deposit</span>
                {{ vip.ugprade }}
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar-outer-bar">
                  <span class="progress-bar-label">{{ currentVipLevelStats.progressBarText }}</span>

                  <div
                    class="progress-bar-inner-bar"
                    :style="{ width: currentVipLevelStats.levelUpPercentage + '%' }"
                  />
                </div>

                <div class="progress-bar-endpoint-label">
                  <template v-if="vip.vipLevel !== 0">
                    {{ `VIP${+vip.vipLevel - 1}` }}
                  </template>
                </div>

                <div class="progress-bar-endpoint-label">
                  {{ `VIP${vip.vipLevel}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>

    <div v-touch-swipe.left="swipeLeft" v-touch-swipe.right="swipeRight">
      <div class="vip-rewards">
        <div class="vip-reward-item">
          <div class="reward-desc">
            <div class="icon">
              <img src="../../assets/images/vip/level-upgrade-reward-icon.svg" />
            </div>
            <div class="title">
              <span class="bold">Level Upgrade</span>
              <br />
              Reward
            </div>
            <div class="reward-amt-wrapper">
              <div class="reward-amt bold">{{ currentVipLevelStats.levelUpgrade }}</div>
            </div>
          </div>
          <div class="unlock-status">
            <img
              v-if="currentVipLevelStats.rewardUnlocked"
              src="../../assets/images/vip/vip-reward-unlocked-icon.png"
            />
            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />
          </div>
        </div>
        <div class="vip-reward-item">
          <div class="reward-desc">
            <div class="icon">
              <img src="../../assets/images/vip/monthly-reward-icon.svg" />
            </div>
            <div class="title">
              <span class="bold">Monthly</span>
              <br />
              Reward
            </div>
            <div class="reward-amt-wrapper">
              <div class="reward-amt bold">{{ currentVipLevelStats.monthlyReward }}</div>
            </div>
          </div>
          <div class="unlock-status">
            <img
              v-if="currentVipLevelStats.rewardUnlocked"
              src="../../assets/images/vip/vip-reward-unlocked-icon.png"
            />
            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />
          </div>
        </div>
        <div class="vip-reward-item">
          <div class="reward-desc">
            <div class="icon">
              <img src="../../assets/images/vip/daily-withdrawal-limit-icon.svg" />
            </div>
            <div class="title">
              <span class="bold">Daily Withdrawal</span>
              <br />
              Limit
            </div>
            <div class="reward-amt-wrapper">
              <div class="reward-amt bold">{{ currentVipLevelStats.dailyWithdrawalLimit }}</div>
            </div>
          </div>
          <div class="unlock-status">
            <img
              v-if="currentVipLevelStats.rewardUnlocked"
              src="../../assets/images/vip/vip-reward-unlocked-icon.png"
            />
            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />
          </div>
        </div>
      </div>

      <div class="header-wrapper">
        <div class="header">VIP status can be upgraded by accumulating monthly deposits</div>
      </div>

      <q-table
        flat
        :hide-pagination="true"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :rows-per-page-options="[0]"
        style="overflow-x: scroll"
      >
        <template v-slot:header="props">
          <q-tr :props="props" style="display: none">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
              <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;</div>
              <!-- unable to adjust table width... -->
              <template v-else>
                <div style="white-space: normal; text-align: center">
                  Monthly Cumulative Deposit An Upgrade Vip Level
                </div>
              </template>
            </q-th>
          </q-tr>

          <q-tr class="top-header">
            <q-td>
              <div><img src="../../assets/images/vip/vip-col-level.png" /></div>
            </q-td>
            <q-td>
              Upgrade
              <br />
              Experience
            </q-td>
            <q-td>
              Upgrade
              <br />
              Rewards
            </q-td>
            <q-td>
              Monthly
              <br />
              Rewards
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1 || colIndex === 2 || colIndex === 3">
                <div style="justify-content: flex-end; display: flex; align-items: center; gap: 4px">
                  <img src="../../assets/images/vip/vip-coins.png" />
                  <span>{{ col.value }}</span>
                </div>
              </template>

              <template v-else>{{ col.value }}</template>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row>
          <q-tr style="display: none">
            <q-td colspan="100%" class="bottom-note text-left">
              Once the deposit meets the upgrade requirements, your VIP level will be immediately elevated, and the
              corresponding upgrade rewards will be issued.
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="hint-msg">
        Once the deposit meets the upgrade requirements, your VIP level will be immediately elevated, and the
        corresponding upgrade rewards will be issued.
      </div>

      <!-- <q-table
        flat
        :hide-pagination="true"
        :columns="columns3"
        :rows="rows3"
        row-key="name"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props" style="display: none">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
              <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <template v-else>
                <div style="white-space: normal; text-align: center">VIP Promotion Bonus</div>
              </template>
            </q-th>
          </q-tr>

          <q-tr class="top-header">
            <q-td>Level</q-td>
            <q-td>Amount</q-td>
            <q-td style="width: 60px">Turnover</q-td>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                <div style="text-align: center">
                  ₹
                  <span class="amt-text">{{ col.value }}</span>
                </div>
              </template>
              <template v-else>{{ col.value }}</template>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row>
          <q-tr style="display: none">
            <q-td colspan="100%" class="bottom-note text-left">
              Promotion Bonus: Every time you advance, you can instantly receive a promotion reward.
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="hint-msg">Promotion Bonus: Every time you advance, you can instantly receive a promotion reward.</div>

      <q-table
        flat
        :hide-pagination="true"
        :columns="columns4"
        :rows="rows4"
        row-key="name"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props" style="display: none">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
              <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <template v-else>
                <div style="text-align: center; padding-right: 60px">VIP Monthly Cash Bonus</div>
              </template>
            </q-th>
          </q-tr>

          <q-tr class="top-header">
            <q-td>Level</q-td>
            <q-td style="text-align: right">Amount</q-td>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                <div style="text-align: right">
                  ₹
                  <span class="amt-text">{{ col.value }}</span>
                </div>
              </template>
              <template v-else>{{ col.value }}</template>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row>
          <q-tr style="display: none">
            <q-td colspan="100%" class="bottom-note text-left">
              Cash Bonus: Based on your VIP level at the end of this month, this reward will be sent to you at 10 a.m.
              on the 1st of next month.
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="hint-msg">
        Cash Bonus: Based on your VIP level at the end of this month, this reward will be sent to you at 10 a.m. on the
        1st of next month.
      </div>

      <q-table
        flat
        :hide-pagination="true"
        :columns="columns2"
        :rows="rows2"
        row-key="name"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props" style="display: none">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
              <div v-else-if="colIndex === 2" style="width: 90px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <template v-else>
                <div style="text-align: center; padding-right: 60px">VIP Daily Withdrawal Limit</div>
              </template>
            </q-th>
          </q-tr>

          <q-tr class="top-header">
            <q-td>Level</q-td>
            <q-td style="text-align: right">Amount</q-td>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                ₹
                <span class="amt-text">{{ col.value }}</span>
              </template>
              <template v-else>{{ col.value }}</template>
            </q-td>
          </q-tr>
        </template>

        <template v-slot:bottom-row>
          <q-tr style="display: none">
            <q-td colspan="100%" class="bottom-note text-left">Daily withdrawal limits based on VIP levels.</q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="hint-msg">Daily withdrawal limits based on VIP levels.</div> -->
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onActivated, onMounted } from "vue";
import ProfileSummary from "components/ProfileSummary.vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const vipLevel = ref("");
const currentVipLevelStats = ref({
  levelUpPercentage: null,
  progressBarText: "",
  levelUpgrade: null,
  monthlyReward: null,
  dailyWithdrawalLimit: null,
  rewardUnlocked: false
});
const vipPromoTab = ref("vip");
const router = useRouter();
const route = useRoute();
const store = userStore();
const vipCarouselIndex = ref();
const vipCarouselRef = ref();

watch(
  () => vipPromoTab.value,
  () => {
    if (vipPromoTab.value === "promo") {
      router.push("/promo");
    }
  }
);

watch(
  () => route.path,
  () => {
    if (route.path === "/vip") {
      vipPromoTab.value = "vip";
    }
  }
);

const columns = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" },
  { name: "reward", field: "reward", align: "center" },
  { name: "flow", field: "flow", align: "center" }
];

// 1	5000	20	38
// 2	10000	25	88
// 3	20000	50	188
// 4	50000	100	388
// 5	100000	200	588
// 6	200000	300	888
// 7	500000	1000	1888
// 8	1000000	2000	3888
// 9	2000000	3000	8888
// 10	5000000	10000	28888
// 11	10000000	20000	58888
// 12	20000000	30000	88888

const rows = [
  {
    name: "VIP 0",
    ugprade: "0",
    reward: "0",
    flow: "0"
  },
  {
    name: "VIP 1",
    ugprade: "5,000",
    reward: "20",
    flow: "38"
  },
  {
    name: "VIP 2",
    ugprade: "10,000",
    reward: "25",
    flow: "88"
  },
  {
    name: "VIP 3",
    ugprade: "20,000",
    reward: "50",
    flow: "188"
  },
  {
    name: "VIP 4",
    ugprade: "50,000",
    reward: "100",
    flow: "388"
  },
  {
    name: "VIP 5",
    ugprade: "100,000",
    reward: "200",
    flow: "588"
  },
  {
    name: "VIP 6",
    ugprade: "200,000",
    reward: "300",
    flow: "888"
  },
  {
    name: "VIP 7",
    ugprade: "500,000",
    reward: "1,000",
    flow: "1,888"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000",
    reward: "2,000",
    flow: "3,888"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000",
    reward: "3,000",
    flow: "8,888"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000",
    reward: "10,000",
    flow: "28,888"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000",
    reward: "20,000",
    flow: "58,888"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000",
    reward: "30,000",
    flow: "88,888"
  }
];

const { vipItems, lastVipLevel } = rows.reduce(
  (acc, { name: vipName, ugprade: upgradeRequirement }) => {
    const vipLevelStr = vipName.replace("VIP ", "");
    const vipLevelNum = Number(vipLevelStr);

    return {
      ...acc,
      vipItems: [
        ...acc.vipItems,
        {
          vipLevel: vipLevelNum,
          ugprade: upgradeRequirement
        }
      ],
      lastVipLevel: vipLevelNum
    };
  },
  {
    lastVipLevel: "",
    vipItems: []
  }
);

onActivated(() => {
  store.getMemberInfo().then(() => {
    const vipLevelNum = Number(store.vip.replace("VIP", ""));
    vipLevel.value = vipLevelNum;

    // if vip0, show vip1 slide
    if (vipLevelNum === 0) {
      vipCarouselIndex.value = vipLevelNum;
    }
    // if vip level higher than existing info available, show last vip level slide
    else if (vipLevelNum > lastVipLevel) {
      // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
      vipCarouselIndex.value = lastVipLevel - 1;
    }
    // show vip slide correspond to current vip level
    else {
      // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
      vipCarouselIndex.value = vipLevelNum - 1;
    }

    vipCarouselRef.value.data.currentSlide.value = vipCarouselIndex.value;
  });
});

onMounted(() => {
  checkMonthlyVipReceive();
});

watch(
  () => vipCarouselIndex.value,
  () => {
    const carouselVipLevel =
      vipCarouselIndex.value === vipCarouselRef.value.data.maxSlide.value ? 12 : Math.round(vipCarouselIndex.value) + 1;

    const levelUpgrade = rows3.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
    const monthlyReward = rows4.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
    const dailyWithdrawalLimit = rows.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;

    const vipInfo = vipItems.find(({ vipLevel }) => vipLevel === carouselVipLevel);
    const vipLevel = Number(store.vip.replace("VIP", ""));
    const currentDeposit = Number(store.getCurrentDeposit());
    const upgradeStatus = vipInfo.ugprade;
    const levelUpDeposit = +upgradeStatus.replace(/,/g, "");

    const levelUpPercentage = (() => {
      if (vipLevel > +vipInfo.vipLevel) {
        return 100;
      }

      return (currentDeposit / levelUpDeposit) * 100;
    })();

    // alert(vipLevel);
    // alert(vipCarouselIndex.value);

    currentVipLevelStats.value = {
      levelUpgrade,
      monthlyReward,
      dailyWithdrawalLimit,
      levelUpPercentage,
      progressBarText: `${currentDeposit} / ${levelUpDeposit}`,
      rewardUnlocked: vipLevel > vipCarouselIndex.value
    };
  }
);

const columns2 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
const rows2 = [
  {
    name: "VIP 0",
    ugprade: "2,500",
    flow: "x10"
  },
  {
    name: "VIP 1",
    ugprade: "5,000",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "50,000",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "100,000",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "200,000",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "500,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000",
    flow: "x10"
  }
];

const columns3 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" },
  { name: "flow", field: "flow", align: "center" }
];
//row3 : Level Up Bonus.
const rows3 = [
  {
    name: "VIP 1",
    ugprade: "20",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "25",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "50",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "100",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "200",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "300",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "3,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "30,000",
    flow: "x10"
  }
];

const columns4 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
//row4 : Monthly Reward.
const rows4 = [
  {
    name: "VIP 1",
    ugprade: "38",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "88",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "188",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "388",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "588",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "888",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,888",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "3,888",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "8,888",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "28,888",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "58,888",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "88,888",
    flow: "x10"
  }
];

const swipeLeft = () => {
  // router.push("/vip");
};

// Handle swipe right
const swipeRight = () => {
  router.push("/promo");
};

const monthlyVipReceive = ref(false);

// api.get('/session/balance', {params: {platform: platform.code}}).then((res) => {

const checkMonthlyVipReceive = () => {
  eventapi
    .get("/privi/vip/canRedeem", { params: { promoCode: "pak-vip-monthly" } })
    .then((res) => {
      console.log(res);
      monthlyVipReceive.value = res.data;
    })
    .catch((err) => {
      console.log(err.message);
      $q.notify({
        color: "negative",
        position: "top",
        message: err.message,
        icon: "report_problem"
      });
    });
};

const getMonthlyVip = () => {
  eventapi
    .put("/bonus/claim/pak-vip-monthly")
    .then((res) => {
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Vip monthly claimed successfully",
          icon: "check_circle_outline"
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      // $q.notify({
      //   color: "negative",
      //   position: "top",
      //   message: err.message,
      //   icon: "report_problem"
      // });
    });
};
</script>

<style lang="scss" scoped>
.separator-line {
  border: 1px solid #49148f70;
  padding: 0 10px;
}

.vip-rewards {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 5px;

  .vip-reward-item {
    width: 120px;
    height: 182px;
    background: url("../../assets/images/vip/vip-reward-unlock-bg.png") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    .reward-desc {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .bold {
        font-weight: 800;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        height: 35px;
        width: 35px;
      }

      .title {
        color: #fff;
        font-size: 11px;
        height: 35px;
        line-height: 18px;
      }

      .reward-amt-wrapper {
        background: #ffffff1a;
        padding: 5px 15px;
        max-width: 100px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 12px;

        .reward-amt {
          line-height: 12px;
          word-wrap: break-word;
          color: #fff;
        }
      }
    }

    .unlock-status {
      display: flex;
      justify-content: center;
      padding: 10px;

      img {
        max-width: 20px;
      }
    }
  }
}

.vip-promo-tab-wrapper {
  width: 90%;
  margin: 0 auto;
  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #5c6c86;
    width: 50%;
  }

  .vip-promo-tab-toggle {
    background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    .right {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      background-size: 0;
    }

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: white;
      // background-size: 100% 100%;
      background: linear-gradient(
        180deg,
        rgba(97, 255, 0, 0) 0%,
        rgba(97, 255, 0, 0.25) 50.5%,
        rgba(97, 255, 0, 0) 100%
      );
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      &:before {
        content: "";
        background-color: #70bc62;
        height: 3px;
        border-radius: 4px;
        width: 30%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}

.vipitem {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  background-image: url("../../assets/images/vip/badge/banner-0.png");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 100% 100%;
  height: 190px;
  width: 100%;
  justify-content: flex-end;
  font-size: 12px;

  &1 {
    background-image: url("../../assets/images/vip/badge/banner-1.png");
  }
  &2 {
    background-image: url("../../assets/images/vip/badge/banner-2.png");
  }
  &3 {
    background-image: url("../../assets/images/vip/badge/banner-3.png");
  }
  &4 {
    background-image: url("../../assets/images/vip/badge/banner-4.png");
  }
  &5 {
    background-image: url("../../assets/images/vip/badge/banner-5.png");
  }
  &6 {
    background-image: url("../../assets/images/vip/badge/banner-6.png");
  }
  &7 {
    background-image: url("../../assets/images/vip/badge/banner-7.png");
  }
  &8 {
    background-image: url("../../assets/images/vip/badge/banner-8.png");
  }
  &9 {
    background-image: url("../../assets/images/vip/badge/banner-9.png");
  }
  &10 {
    background-image: url("../../assets/images/vip/badge/banner-10.png");
  }
  &11 {
    background-image: url("../../assets/images/vip/badge/banner-11.png");
  }
  &12 {
    background-image: url("../../assets/images/vip/badge/banner-12.png");
  }

  .vip-level-header {
    font-family: "Poppins";
    font-size: 30px;
    font-weight: 800;
    top: 25%;
    left: 6%;
    z-index: 1;
    position: absolute;
    color: #fff;

    // svg {
    //   font-family: Arial;
    //   font-size: 10rem;
    //   font-weight: bold;
    //   position: absolute;
    //   width: 125px;
    //   height: 70px;
    //   right: 0px;
    //   top: 0px;
    // }

    // .svgText {
    //   stroke: white;
    //   stroke-width: 10px;
    //   stroke-linejoin: round;
    //   paint-order: stroke;
    // }
  }

  .vip-contents {
    padding-top: 60px;
    color: #ffffff;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title {
      font-size: 18px;
      line-height: 36px;
    }

    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
      position: absolute;
      bottom: 10%;
      left: 6%;
      right: 6%;
      flex-wrap: wrap;

      .progress-bar-endpoint-label {
        color: #fff;

        &:last-child {
          margin-left: auto;
        }
      }

      .progress-bar-outer-bar {
        // border: 1px solid #fff;
        border-radius: 16px;
        background: #ffffff4d;
        width: 100%;
        overflow: hidden;
        position: relative;

        .progress-bar-label {
          position: absolute;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          text-align: center;
          color: #333;
          font-size: 10px;
          margin-top: -2px;
        }
      }

      .progress-bar-inner-bar {
        color: #fff;
        border-radius: 16px;
        // background: linear-gradient(356.25deg, #00430B -0.21%, #00AE00 93.65%);
        background: #fff;
        height: 12px;
      }
    }

    .upgrade-requirements {
      position: absolute;
      margin: 10px 0px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      font-size: 12px;
      left: 20px;
      top: 48%;
      color: #fff;

      span {
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.carousel__item {
  min-height: 170px;
  width: 100%;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 0px 10px 20px 10px;

  &.carousel__slide--next .vipitem,
  &.carousel__slide--prev .vipitem {
    filter: brightness(0.5);
    height: 150px;
    margin-top: 20px;

    .vip-contents .progress-bar-container .progress-bar-inner-bar {
      height: 8px;
    }
  }
}

.carousel__prev,
.carousel__next {
  display: none;
}

.vip-container {
  padding: 0 1.75rem;
  overflow: hidden;
  font-size: 1rem;
  text-align: center;

  .top-header {
    color: #f1f1f1;
    // background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
    background: linear-gradient(180deg, #70bc62 0%, #33562d 100%);
  }

  .q-table__card {
    background: transparent !important;
    margin: 0 0 1.25rem 0;
    border-radius: 8px;
    font-weight: 700;
  }

  .vip-icon {
    width: 3.5rem;
    margin: 0.5rem 0 0;
  }

  thead {
    th {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      text-align: left;
      border-width: 0px !important;

      &:first-child {
        width: 65px;
      }
    }
  }
  thead > :first-child {
    background: linear-gradient(270deg, #5d01b9 -0.1%, #b11bff 50.22%, #6a069c 97.6%);
  }
  tbody > :nth-child(odd) {
    // background: rgba(21, 0, 37, 0.2);
    background: rgba(112, 188, 98, 0.1);

    // background: #652c93;
    // background: #652c9315;
  }
  tbody > :nth-child(even) {
    // background: rgba(21, 0, 37, 0.5);
    // background: #502175;
    // background: #00ae000c;
  }

  span.amt-text {
    background-color: #f3ec78 !important;
    background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%) !important;
    background-size: 100% !important;
    -webkit-background-clip: text !important;
    -moz-background-clip: text !important;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }

  .text-center {
    border-bottom-width: 0 !important;
    padding: 0 0.25rem;
  }

  .text-right {
    border-bottom-width: 0 !important;
    padding: 0 1.5rem;
  }

  .bottom-note {
    color: #edd3ff;
    font-size: 0.85rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 0.5rem 1.25rem;
    white-space: normal;
  }

  .hint-msg {
    border-radius: 8px;
    background: #111215;
    padding: 10px;
    margin: 0 0 1.25rem 0;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    font-weight: 400;
    line-height: 19px;
  }

  .header-wrapper {
    display: flex;
    gap: 15px;
    padding: 10px 0px 20px;

    .header {
      font-size: 26px;
      font-weight: 800;
      line-height: 32px;
      text-align: left;
      color: #fff;
    }
  }
}

@media (max-width: 410px) {
  .vip-container {
    padding: 0 0.75rem;
  }
}

.receive-monthly {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  // padding: 0 12px;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin-top: 36px;
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 90px;
  position: relative;
  border-radius: 6px;
  .monthly-img {
    position: absolute;
    top: -30px;
    left: -20px;
  }
  .monthly-txt {
    margin: auto;
  }
  .monthly-btn {
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 6px;
    font-weight: bold;
    color: #000a01;

    &.disable {
      background: #313131;
      color: #999999;
    }
  }
}
</style>

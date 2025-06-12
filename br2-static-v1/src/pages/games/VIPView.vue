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
      <q-tab name="promo" :label="$t('header.promotion')" />
      <q-tab name="vip" :label="$t('header.vip')" />
    </q-tabs>
  </div>
  <div class="vip-container">
    <Carousel
      ref="vipCarouselRef"
      :items-to-show="1.3"
      :wrap-around="false"
      :snapAlign="'start'"
      v-model="vipCarouselIndex"
    >
      <Slide v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
        <div class="carousel__item">
          <div :class="`vipitem vipitem${vip.vipLevel}`">
            <!-- <div :class="`vip-badge vip${vip.vipLevel}`"></div> -->
            <div :class="`vip-badge vip0`"></div>

            <div class="vip-level-header">
              <!-- <svg viewBox="0 0 450 70"> -->
              <!-- <defs> -->
              <!-- Linear Gradient -->
              <!-- <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color: #00b9a1; stop-opacity: 1" />
                    <stop offset="100%" style="stop-color: #0097b9; stop-opacity: 1" />
                  </linearGradient> -->
              <!-- </defs> -->
              <!-- </svg> -->
              <div class="headText">{{ $t("header.vip") }}{{ vip.vipLevel }}</div>
            </div>

            <div class="vip-contents" :style="vip.upgrade === 'Successful deposit' ? 'padding-top: 120px;' : ''">
              <div class="upgrade-requirements">
                <span v-if="vip.vipLevel !== '0'">{{ $t("vip.accumulateDeposit") }}</span>
                {{ vip.ugprade }}
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-endpoint-label">
                  {{ `V${+vip.vipLevel - 1}` }}
                </div>
                <div class="progress-bar-outer-bar">
                  <span class="progress-bar-label">{{ currentVipLevelStats.progressBarText }}</span>
                  <div
                    class="progress-bar-inner-bar"
                    :style="{ width: currentVipLevelStats.levelUpPercentage + '%' }"
                  />
                </div>
                <div class="progress-bar-endpoint-label">
                  {{ `V${vip.vipLevel}` }}
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
      <hr class="separator-line" style="margin-bottom: 20px" />
      <div class="vip-rewards">
        <div class="vip-reward-item">
          <div class="reward-desc">
            <div class="icon">
              <img src="../../assets/images/vip/level-upgrade-reward-icon.png" />
            </div>
            <div class="title">
              <span class="bold">{{ $t("vip.levelUpgrade") }}</span>
              <br />
              <!-- {{ $t("vip.reward") }} -->
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
              <img src="../../assets/images/vip/monthly-reward-icon.png" />
            </div>
            <div class="title">
              <span class="bold">{{ $t("vip.monthly") }}</span>
              <br />
              <!-- {{ $t("vip.reward") }} -->
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
              <img src="../../assets/images/vip/daily-withdrawal-limit-icon.png" />
            </div>
            <div class="title">
              <span class="bold">{{ $t("vip.dailyWithdrawal") }}</span>
              <br />
              <!-- {{ $t("vip.limit") }} -->
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
      <hr class="separator-line" style="margin-top: 20px" />
      <div class="header-wrapper">
        <div class="header">{{ $t("vip.monthlyCumulativeDeposit") }}</div>
      </div>
      <q-table flat :hide-pagination="true" :columns="columns" :rows="rows" row-key="name" :rows-per-page-options="[0]">
        <template v-slot:header="props">
          <q-tr :props="props" style="display: none">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
              <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;</div>
              <!-- unable to adjust table width... -->
              <template v-else>
                <div style="white-space: normal; text-align: center">
                  {{ $t("vip.monthlyCumulativeDeposit") }}
                </div>
              </template>
            </q-th>
          </q-tr>
          <q-tr class="top-header">
            <q-td>{{ $t("vip.level") }}</q-td>
            <q-td>{{ $t("vip.amount") }}</q-td>
            <q-td style="width: 60px">{{ $t("vip.turnover") }}</q-td>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                <div style="text-align: center; font-size: 11px">
                  {{ $t("vip.deposit") }} {{ store.currency.value }}
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
              {{ $t("vip.aftertheRecharge") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="hint-msg">{{ $t("vip.aftertheRecharge") }}</div>
      <q-table
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
              <!-- unable to adjust table width... -->
              <template v-else>
                <div style="white-space: normal; text-align: center">{{ $t("vip.vipPromoBonus") }}</div>
              </template>
            </q-th>
          </q-tr>
          <q-tr class="top-header">
            <q-td>{{ $t("vip.level") }}</q-td>
            <q-td>{{ $t("vip.amount") }}</q-td>
            <q-td style="width: 60px">{{ $t("vip.turnover") }}</q-td>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                <div style="text-align: center">
                  {{ store.currency.value }}
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
              {{ $t("vip.promotionBonusDesc") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="hint-msg">{{ $t("vip.promotionBonusDesc") }}</div>
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
              <!-- unable to adjust table width... -->
              <template v-else>
                <div style="text-align: center; padding-right: 60px">{{ $t("vip.vipMonthlyCashBonus") }}</div>
              </template>
            </q-th>
          </q-tr>
          <q-tr class="top-header">
            <q-td>{{ $t("vip.level") }}</q-td>
            <q-td style="text-align: right">{{ $t("vip.amount") }}</q-td>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                <div style="text-align: right">
                  {{ store.currency.value }}
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
              {{ $t("vip.cashBonusDesc") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="hint-msg">{{ $t("vip.cashBonusDesc") }}</div>
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
            <q-td>{{ $t("vip.level") }}</q-td>
            <q-td style="text-align: right">{{ $t("vip.amount") }}</q-td>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1">
                {{ store.currency.value }}
                <span class="amt-text">{{ col.value }}</span>
              </template>
              <template v-else>{{ col.value }}</template>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom-row>
          <q-tr style="display: none">
            <q-td colspan="100%" class="bottom-note text-left">{{ $t("vip.dailyWithdrawalLimits") }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="hint-msg">{{ $t("vip.dailyWithdrawalLimits") }}</div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onActivated } from "vue";
import ProfileSummary from "components/ProfileSummary.vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

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
  { name: "flow", field: "flow", align: "center" }
];
const rows = [
  {
    name: "VIP 1",
    ugprade: "500",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "5,000",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "50,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "100,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "200,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "500,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "1,000,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "2,000,000",
    flow: "x10"
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
    ugprade: "250",
    flow: "x10"
  },
  {
    name: "VIP 1",
    ugprade: "500",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "5,000",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "50,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "100,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "200,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "500,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "1,000,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "2,000,000",
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
    ugprade: "2",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "3",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "5",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "10",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "20",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "30",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "100",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "200",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "300",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "3,000",
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
    ugprade: "3",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "8",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "18",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "38",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "58",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "88",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "188",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "388",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "888",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "2,888",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "5,888",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "8,888",
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
</script>
<style lang="scss" scoped>
.separator-line {
  border: 1px solid #0d333d;
  padding: 0 10px;
}

.vip-rewards {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .vip-reward-item {
    width: 107px;
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
      text-align: center;

      .bold {
        font-weight: 800;
        // white-space: nowrap;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        height: 35px;
        width: 35px;

        img {
          display: block;
          width: 35px;
        }
      }

      .title {
        color: #00b9a1;
        font-size: 10px;
        height: 35px;
        line-height: 12px;
      }

      .reward-amt-wrapper {
        background-color: #d0f3ec;
        padding: 5px 15px;
        max-width: 100px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 12px;

        .reward-amt {
          line-height: 12px;
          word-wrap: break-word;
          color: #8b36f8;
          background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%), linear-gradient(0deg, #ffffff, #ffffff);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
  margin: 30px auto 0;
  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    // background: rgba(43, 71, 74, 0.27);
    background: #2b474a;
    color: #01a1b2;
  }

  .vip-promo-tab-toggle {
    background-color: #2b474a;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: #fff;
      background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
      box-shadow: 0px 1px 2px 0px #0000000d;
      // border: 2px solid rgba(43, 71, 74, 0.27);
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
  background: url("../../assets/images/vip/badge/banner.png") no-repeat top center;
  background-size: 100% 100%;
  height: 170px;
  width: 100%;
  justify-content: flex-end;
  font-size: 12px;

  .vip-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    top: 0px;
    left: 10px;
    background-repeat: no-repeat;
    background-position: top left;
    background-size: contain;
    width: 102px;
    height: 100px;
    color: #fff;
    position: absolute;

    background: url("../../assets/images/vip/badge/vip1.png") no-repeat top center;
    background-size: 100% 100%;

    &.vip0 {
      background: url("../../assets/images/vip/badge/vip0.png") no-repeat top center;
      background-size: auto 100%;
      margin-top: -5px;
    }

    &.vip2 {
      background: url("../../assets/images/vip/badge/vip2.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip3 {
      background: url("../../assets/images/vip/badge/vip3.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip4 {
      background: url("../../assets/images/vip/badge/vip4.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip5 {
      background: url("../../assets/images/vip/badge/vip5.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip6 {
      background: url("../../assets/images/vip/badge/vip6.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip7 {
      background: url("../../assets/images/vip/badge/vip7.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip8 {
      background: url("../../assets/images/vip/badge/vip8.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip9 {
      background: url("../../assets/images/vip/badge/vip9.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip10 {
      background: url("../../assets/images/vip/badge/vip10.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip11 {
      background: url("../../assets/images/vip/badge/vip11.png") no-repeat top center;
      background-size: 100% 100%;
    }

    &.vip12 {
      background: url("../../assets/images/vip/badge/vip12.png") no-repeat top center;
      background-size: 100% 100%;
    }
  }

  .vip-level-header {
    font-family: sans-serif;
    font-size: 3.2em;
    font-weight: 800;
    // -webkit-text-stroke: 2px #fff;
    top: 28%;
    right: 10%;
    // z-index: 1;
    position: absolute;
    // color: #8b36f8;
    // color: rgba(0, 151, 185, 1);

    .headText {
      // font-size: 26px;
      // font-weight: 800;
      // line-height: 32px;
      // text-align: left;
      // background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
      background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

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

      .progress-bar-endpoint-label {
        color: #333;
      }

      .progress-bar-outer-bar {
        border: 1px solid #fff;
        border-radius: 16px;
        background: #fff;
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
        }
      }

      .progress-bar-inner-bar {
        color: #fff;
        border-radius: 16px;
        background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
        height: 12px;
      }
    }

    .upgrade-requirements {
      position: absolute;
      margin: 10px 0px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      font-size: 0.9em;
      left: 12px;
      top: 55%;
      color: #424f72;

      span {
        color: #7a80a1;
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
  // position: relative;
}

.carousel__slide {
  padding: 10px;

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
    // background: linear-gradient(180deg, #41206f 0%, #1f2862 100%);
    // background: linear-gradient(180deg, #005348 0%, rgba(0, 83, 72, 0.2) 96.35%);
    background: linear-gradient(180deg, #0a544c 0%, #0a4855 100%);

    td {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      font-size: 12px;
    }
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
    // background: linear-gradient(270deg, #5d01b9 -0.1%, #b11bff 50.22%, #6a069c 97.6%);
    background: linear-gradient(180deg, #005348 0%, rgba(0, 83, 72, 0.2) 96.35%);
  }
  tbody > :nth-child(odd) {
    background: rgba(21, 0, 37, 0.2);
    background: #016d5e;
  }
  tbody > :nth-child(even) {
    background: rgba(21, 0, 37, 0.5);
    background: #005348;
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
    padding: 0 0.5rem;
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
    // background: linear-gradient(180deg, #2f1b4d 0%, #1a2045 100%);
    background: linear-gradient(180deg, #005348 0%, rgba(0, 83, 72, 0.2) 96.35%);

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
      background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

@media (max-width: 410px) {
  .vip-container {
    padding: 0 0.75rem;
  }
}
</style>

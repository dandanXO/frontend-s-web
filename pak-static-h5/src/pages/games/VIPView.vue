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
      <q-tab name="promo" :label="$t('settings.promo')" />
      <q-tab name="vip" :label="$t('settings.vip')" />
    </q-tabs>
  </div>

  <!--  <div class="receive-monthly">-->
  <!--    <div class="monthly-img"><img src="../../assets/images/vip/receive-monthly-img.png" width="120" /></div>-->
  <!--    <div class="monthly-txt">{{ $t("vip.receiveMonthlyRewards") }}</div>-->
  <!--    <div class="monthly-btn" @click="getMonthlyVip" :class="!monthlyVipReceive && 'disable'">-->
  <!--      <span v-if="!monthlyVipReceive">{{ $t("vip.received") }}</span>-->
  <!--      <span v-else>{{ $t("vip.receive") }}</span>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="vip-container">
    <VIPCarousel :vipCarouselIndex="vipCarouselIndex" :onlyShowCurrentLevel="false" />
    <div class="vip-details" v-touch-swipe.left="swipeLeft" v-touch-swipe.right="swipeRight">
      <!--      <div class="vip-rewards">-->
      <!--        <div class="vip-reward-item">-->
      <!--          <div class="reward-desc">-->
      <!--            <div class="icon">-->
      <!--              <img src="../../assets/images/vip/level-upgrade-reward-icon.svg" />-->
      <!--            </div>-->
      <!--            <div class="title">-->
      <!--              <span class="bold">{{ $t("vip.levelUpgrade") }}</span>-->
      <!--              <br />-->
      <!--              {{ $t("vip.reward") }}-->
      <!--            </div>-->
      <!--            <div class="reward-amt-wrapper">-->
      <!--              <div class="reward-amt bold">{{ currentVipLevelStats.levelUpgrade }}</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="unlock-status">-->
      <!--            <img-->
      <!--              v-if="currentVipLevelStats.rewardUnlocked"-->
      <!--              src="../../assets/images/vip/vip-reward-unlocked-icon.png"-->
      <!--            />-->
      <!--            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="vip-reward-item">-->
      <!--          <div class="reward-desc">-->
      <!--            <div class="icon">-->
      <!--              <img src="../../assets/images/vip/monthly-reward-icon.svg" />-->
      <!--            </div>-->
      <!--            <div class="title">-->
      <!--              <span class="bold">{{ $t("vip.monthly") }}</span>-->
      <!--              <br />-->
      <!--              {{ $t("vip.reward") }}-->
      <!--            </div>-->
      <!--            <div class="reward-amt-wrapper">-->
      <!--              <div class="reward-amt bold">{{ currentVipLevelStats.monthlyReward }}</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="unlock-status">-->
      <!--            <img-->
      <!--              v-if="currentVipLevelStats.rewardUnlocked"-->
      <!--              src="../../assets/images/vip/vip-reward-unlocked-icon.png"-->
      <!--            />-->
      <!--            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="vip-reward-item">-->
      <!--          <div class="reward-desc">-->
      <!--            <div class="icon">-->
      <!--              <img src="../../assets/images/vip/daily-withdrawal-limit-icon.svg" />-->
      <!--            </div>-->
      <!--            <div class="title">-->
      <!--              <span class="bold">{{ $t("vip.dailyWithdrawal") }}</span>-->
      <!--              <br />-->
      <!--              {{ $t("vip.limit") }}-->
      <!--            </div>-->
      <!--            <div class="reward-amt-wrapper">-->
      <!--              <div class="reward-amt bold">{{ currentVipLevelStats.dailyWithdrawalLimit }}</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="unlock-status">-->
      <!--            <img-->
      <!--              v-if="currentVipLevelStats.rewardUnlocked"-->
      <!--              src="../../assets/images/vip/vip-reward-unlocked-icon.png"-->
      <!--            />-->
      <!--            <img v-else src="../../assets/images/vip/vip-reward-locked-icon.png" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="header-wrapper">
        <div class="header">{{ $t("vip.vipStatus_txt") }}</div>
      </div>

      <q-table
        flat
        :hide-pagination="true"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :rows-per-page-options="[0]"
        style="overflow-x: scroll"
        class="monthly-deposit-table"
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
              <div><img style="width: 30px;" src="../../assets/images/vip/vip-col-level.png" /></div>
            </q-td>
            <q-td>
              {{ $t("vip.upgrade") }}
              <br />
              {{ $t("vip.experience") }}
            </q-td>
            <q-td style="white-space: normal">
              {{ $t("vip.dailyWithdrawalTimes") }}
            </q-td>
            <!-- <q-td>
              {{ $t("vip.monthly") }}
              <br />
              {{ $t("vip.rewards") }}
            </q-td> -->
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <template v-if="colIndex === 1 || colIndex === 3">
                <div style="justify-content: flex-start; padding-left: 20px; display: flex; align-items: center; gap: 4px">
                  <img style="max-width: 25px;" src="../../assets/images/vip/vip-coins.png" />
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
              {{ $t("vip.vipTable_txt") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!--      <q-table-->
      <!--        flat-->
      <!--        :hide-pagination="true"-->
      <!--        :columns="columnsinvite"-->
      <!--        :rows="rows"-->
      <!--        row-key="name"-->
      <!--        :rows-per-page-options="[0]"-->
      <!--        style="overflow-x: scroll"-->
      <!--        class="monthly-deposit-table"-->
      <!--      >-->
      <!--        <template v-slot:header="props">-->
      <!--          <q-tr :props="props" style="display: none">-->
      <!--            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">-->
      <!--              <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />-->
      <!--              <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;</div>-->
      <!--              &lt;!&ndash; unable to adjust table width... &ndash;&gt;-->
      <!--              <template v-else>-->
      <!--                <div style="white-space: normal; text-align: center">-->
      <!--                  Monthly Cumulative Deposit An Upgrade Vip Level-->
      <!--                </div>-->
      <!--              </template>-->
      <!--            </q-th>-->
      <!--          </q-tr>-->

      <!--          <q-tr class="top-header">-->
      <!--            <q-td>-->
      <!--              <div><img src="../../assets/images/vip/vip-col-level.png" /></div>-->
      <!--            </q-td>-->
      <!--            <q-td>-->
      <!--              {{ $t("vip.accumulate") }}-->
      <!--              <br />-->
      <!--              {{ $t("vip.invites") }}-->
      <!--            </q-td>-->
      <!--            <q-td style="">-->
      <!--              {{ $t("vip.extra") }}-->
      <!--              <br />-->
      <!--              {{ $t("vip.rewardss") }}-->
      <!--            </q-td>-->
      <!--          </q-tr>-->
      <!--        </template>-->

      <!--        <template v-slot:body="props">-->
      <!--          <q-tr :props="props">-->
      <!--            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">-->
      <!--              <template v-if="colIndex === 2">-->
      <!--                <div style="justify-content: center; display: flex; align-items: center; gap: 4px">-->
      <!--                  <img src="../../assets/images/vip/vip-coins.png" />-->
      <!--                  <span>{{ col.value }}</span>-->
      <!--                </div>-->
      <!--              </template>-->

      <!--              <template v-else>{{ col.value }}</template>-->
      <!--            </q-td>-->
      <!--          </q-tr>-->
      <!--        </template>-->

      <!--        <template v-slot:bottom-row>-->
      <!--          <q-tr style="display: none">-->
      <!--            <q-td colspan="100%" class="bottom-note text-left">-->
      <!--              {{ $t("vip.vipTable_txt") }}-->
      <!--            </q-td>-->
      <!--          </q-tr>-->
      <!--        </template>-->
      <!--      </q-table>-->

      <div class="hint-msg">
        {{ $t("vip.vipTable_txt") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onActivated, onMounted } from "vue";
import ProfileSummary from "components/ProfileSummary.vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import VIPCarousel from "components/VIPCarousel.vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
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
  { name: "reward", field: "reward", align: "center" }
  // { name: "flow", field: "flow", align: "center" }
];

const columnsinvite = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "invitee", field: "invitee", align: "center" },
  { name: "extrareward", field: "extrareward", align: "center" }
  // { name: "flow", field: "flow", align: "center" }
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
    reward: "3",
    flow: "0",
    invitee: 0,
    extrareward: 0
  },
  {
    name: "VIP 1",
    ugprade: "1,000",
    reward: "3",
    flow: "38",
    invitee: 3,
    extrareward: 100
  },
  {
    name: "VIP 2",
    ugprade: "3,000",
    reward: "3",
    flow: "88",
    invitee: 5,
    extrareward: 200
  },
  {
    name: "VIP 3",
    ugprade: "5,000",
    reward: "3",
    flow: "188",
    invitee: 10,
    extrareward: 300
  },
  {
    name: "VIP 4",
    ugprade: "10,000",
    reward: "4",
    flow: "388",
    invitee: 20,
    extrareward: 400
  },
  {
    name: "VIP 5",
    ugprade: "30,000",
    reward: "5",
    flow: "588",
    invitee: 30,
    extrareward: 500
  },
  {
    name: "VIP 6",
    ugprade: "50,000",
    reward: "6",
    flow: "888",
    invitee: 40,
    extrareward: 600
  },
  {
    name: "VIP 7",
    ugprade: "100,000",
    reward: "7",
    flow: "1,888",
    invitee: 50,
    extrareward: 700
  },
  {
    name: "VIP 8",
    ugprade: "300,000",
    reward: "8",
    flow: "3,888",
    invitee: 60,
    extrareward: 800
  },
  {
    name: "VIP 9",
    ugprade: "500,000",
    reward: "9",
    flow: "8,888",
    invitee: 70,
    extrareward: 900
  },
  {
    name: "VIP 10",
    ugprade: "1,000,000",
    reward: "10",
    flow: "28,888",
    invitee: 80,
    extrareward: 1000
  },
  {
    name: "VIP 11",
    ugprade: "3,000,000",
    reward: t('vip.unlimited'),
    flow: "58,888",
    invitee: 90,
    extrareward: "1,188"
  },
  {
    name: "VIP 12",
    ugprade: "5,000,000",
    reward: t('vip.unlimited'),
    flow: "88,888",
    invitee: 100,
    extrareward: "2,888"
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

// onActivated(() => {
//   store.getMemberInfo().then(() => {
//     const vipLevelNum = Number(store.vip.replace("VIP", ""));
//     vipLevel.value = vipLevelNum;

//     // if vip0, show vip1 slide
//     if (vipLevelNum === 0) {
//       vipCarouselIndex.value = vipLevelNum;
//     }
//     // if vip level higher than existing info available, show last vip level slide
//     else if (vipLevelNum > lastVipLevel) {
//       // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
//       vipCarouselIndex.value = lastVipLevel - 1;
//     }
//     // show vip slide correspond to current vip level
//     else {
//       // carousel index starts from 0, thus any vip level will require minus 1 for slide index to show correctly
//       vipCarouselIndex.value = vipLevelNum - 1;
//     }

//     vipCarouselRef.value.data.currentSlide.value = vipCarouselIndex.value;
//   });
// });

onMounted(() => {
  checkMonthlyVipReceive();
});

// watch(
//   () => vipCarouselIndex.value,
//   () => {
//     const carouselVipLevel =
//       vipCarouselIndex.value === vipCarouselRef.value.data.maxSlide.value ? 12 : Math.round(vipCarouselIndex.value) + 1;

//     const levelUpgrade = rows3.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
//     const monthlyReward = rows4.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;
//     const dailyWithdrawalLimit = rows.find(({ name }) => name === `VIP ${carouselVipLevel}`).ugprade;

//     const vipInfo = vipItems.find(({ vipLevel }) => vipLevel === carouselVipLevel);
//     const vipLevel = Number(store.vip.replace("VIP", ""));
//     const currentDeposit = Number(store.getCurrentDeposit());
//     const upgradeStatus = vipInfo.ugprade;
//     const levelUpDeposit = +upgradeStatus.replace(/,/g, "");

//     const levelUpPercentage = (() => {
//       if (vipLevel > +vipInfo.vipLevel) {
//         return 100;
//       }

//       return (currentDeposit / levelUpDeposit) * 100;
//     })();

//     // alert(vipLevel);
//     // alert(vipCarouselIndex.value);
//     let progressBarText = `${currentDeposit} / ${levelUpDeposit}`
//     if (currentDeposit >= levelUpDeposit) {
//       progressBarText = ` ${levelUpDeposit} /  ${levelUpDeposit}`
//     }
//     currentVipLevelStats.value = {
//       levelUpgrade,
//       monthlyReward,
//       dailyWithdrawalLimit,
//       levelUpPercentage,
//       progressBarText: progressBarText,
//       rewardUnlocked: vipLevel > vipCarouselIndex.value
//     };
//   }
// );

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

.vip-promo-tab-wrapper {
  width: 90%;
  margin: 0 auto;
  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #FFFFFF80;

    width: 50%;
  }

  .vip-promo-tab-toggle {
    // background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background: #323738;
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
      font-weight: 700;
      // color: #FFFFFF80;
    }

    :deep(.q-tab--active) {
      color: white;
      // background-size: 100% 100%;
      // background: linear-gradient(
      //   180deg,
      //   rgba(97, 255, 0, 0) 0%,
      //   rgba(97, 255, 0, 0.25) 50.5%,
      //   rgba(97, 255, 0, 0) 100%
      // );
      // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      // &:before {
      //   content: "";
      //   background-color: #21EF89;
      //   height: 3px;
      //   border-radius: 4px;
      //   width: 30%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      background: #394142;

    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
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
  padding: 0px 5px 10px;

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
  // padding: 0 1.75rem;
  overflow: hidden;
  font-size: 1rem;
  text-align: center;
.vip-details {
  background:#373C3D;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
  .top-header {
    color: #FFFFFF80;
    // background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
    // background: linear-gradient(180deg, #21EF89 0%, #33562d 100%);
    background: #323738;
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
    // background: #FFFFFF0F
  }
  tbody > :nth-child(odd) {
    // background: rgba(21, 0, 37, 0.2);
    // background: rgba(112, 188, 98, 0.1);
    background: #FFFFFF0F;

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
    // border-radius: 8px;
    // background: #111215;
    // padding: 10px;
    // margin: 0 0 1.25rem 0;
    // color: rgba(255, 255, 255, 0.7);
    // text-align: center;
    // font-weight: 400;
    // line-height: 19px;
    color: #B2BDBF;
  }

  .header-wrapper {
    display: flex;
    gap: 15px;
    padding: 0 0px 20px;

    .header {
      font-size: 18px;
      font-weight: 800;
      line-height: 32px;
      text-align: left;
      color: #fff;
    }
  }
}

// @media (max-width: 410px) {
//   .vip-container {
//     padding: 0 0.75rem;
//   }
// }

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

@media (max-width: 480px) {
  .monthly-deposit-table {
    font-size: 10px;

    tbody td {
      font-size: 10px;

      img {
        width: 20px;
      }
    }
  }
}
</style>

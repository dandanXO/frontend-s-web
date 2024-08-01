<template>
  <div class="vip-container">
    <q-carousel
      v-model="slide"
      transition-next="slide-left"
      transition-prev="slide-right"
      swipeable
      animated
      padding
      arrows
      infinite
      control-color="black"
      class="bg-transparent"
    >
      <q-carousel-slide
        v-for="(vip, vipIndex) in vipItems"
        :key="`${vip}-${vipIndex}`"
        :name="vipIndex"
        class="column no-wrap flex-center"
      >
        <div class="vip-card-container">
          <div class="card-img-wrap">
            <img class="card-img" :src="require(`../../assets/images/vip/vip${vip.level}.png`)" alt="" />
          </div>

          <div class="status">
            <img
              :src="
                require(`../../assets/images/vip/status-${
                  vip.progressBarVal === 100 || vipLevel >= vip.level ? 'achieved' : 'inachieved'
                }.png`)
              "
              alt=""
            />
            <span class="vip-card-common-text">
              {{
                vip.progressBarVal === 100 || vipLevel >= vip.level
                  ? $t("lang.vip_achieved")
                  : $t("lang.vip_unachieved")
              }}
            </span>
          </div>
          <div class="vip-card-info">
            <div class="level q-mt-xs">
              <div class="vip-level">VIP{{ vipIndex + 1 }}</div>
              <div class="vip-card-common-text">{{ vip.title }}</div>
            </div>
            <div class="amount q-mt-xs">
              <div class="vip-card-common-text">{{ $t("lang.vip_upgrade_require") }}</div>
              <div class="vip-card-common-text amount-text">
                <span v-if="vipIndex === 0">{{ $t("lang.vip_3timedeposit") }}</span>
                <span v-else>{{ $t("lang.totalBetMonth") }} {{ vip.amount }}</span>
              </div>
            </div>
            <div class="progress">
              <q-linear-progress
                reverse
                rounded
                size="5px"
                :value="vip.progressBarVal"
                class="progress-bar"
                instant-feedback
              ></q-linear-progress>
              <div class="start-end">
                <div class="vip-card-common-text">V{{ vipIndex }}</div>
                <div class="vip-card-current-num" v-if="vipLevel === vipIndex">VNDP {{ currentDeposit }}</div>
                <div class="vip-card-common-text">V{{ vipIndex + 1 }}</div>
              </div>
            </div>
          </div>
        </div>

        <q-card class="level-promo-container">
          <q-card-section class="level-promo-header">
            <div class="level-promo-title">{{ $t("lang.free_bonus") }}</div>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-section class="level-promo-body">
            <div class="vip-promo-bonus">
              <div class="common-text">
                {{ $t("lang.vip_welcome_bonus") }}
              </div>
              <div class="common-amount">{{ vip.welcomeBonus }}</div>
              <div class="common-btn" v-if="vip.welcomeBonus !== '-'">
                <q-btn
                  class="btn-main"
                  no-caps
                  @click="claimDesc.availableBtn ? claim() : null"
                  v-if="claimDesc.availableBtn || claimDesc.claimedBtn"
                  :class="claimDesc.claimedBtn ? 'status-claimed' : ''"
                >
                  {{ claimDesc.claimedBtn ? $t("lang.vip_claimed") : $t("lang.vip_claim") }}
                </q-btn>
              </div>
            </div>
            <div class="vip-promo-bonus">
              <div class="common-text">
                {{ $t("lang.vip_monthly_bonus") }}
              </div>
              <div class="common-amount">{{ vip.monthlyBonus }}</div>
              <div class="common-btn" v-if="vip.monthlyBonus !== '-'">
                <q-btn
                  class="btn-main"
                  no-caps
                  @click="claimMonthly()"
                  v-if="canClaimMonthly && vipLevel === Number(vipIndex + 1)"
                >
                  {{ $t("lang.vip_claim") }}
                </q-btn>
              </div>
            </div>
            <div class="vip-promo-bonus">
              <div class="common-text">
                {{ $t("lang.vip_birthday_bonus") }}
              </div>
              <div class="common-amount">{{ vip.birthdayBonus }}</div>
              <div class="common-btn" v-if="vip.birthdayBonus !== '-'">
                <q-btn
                  class="btn-main"
                  v-if="vipIndex + 1 !== 1 && vipIndex + 1 !== 2 && vipIndex + 1 !== 3"
                  no-caps
                  @click="router.push('/liveChat')"
                >
                  {{ $t("lang.vip_contactcs") }}
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="level-promo-container">
          <q-card-section class="level-promo-header">
            <div class="level-promo-title">{{ $t("lang.rebate_bonus") }}</div>
          </q-card-section>

          <q-separator></q-separator>
          <q-card-section class="return-promo-body">
            <div class="return-grid">
              <div class="return-item">
                <div class="item-percent">{{ vip.rebateSport }}</div>
                <div class="item-desc">{{ $t("lang.vip_sport_rebate") }}</div>
              </div>
              <div class="return-item">
                <div class="item-percent">{{ vip.rebateEsports }}</div>
                <div class="item-desc">{{ $t("lang.vip_esport_rebate") }}</div>
              </div>
              <div class="return-item">
                <div class="item-percent">{{ vip.rebateLive }}</div>
                <div class="item-desc">{{ $t("lang.vip_livecasino_rebate") }}</div>
              </div>
              <div class="return-item">
                <div class="item-percent">{{ vip.rebatePoker }}</div>
                <div class="item-desc">{{ $t("lang.vip_poker_rebate") }}</div>
              </div>
              <div class="return-item">
                <div class="item-percent">{{ vip.rebateSlot }}</div>
                <div class="item-desc">{{ $t("lang.vip_slot_rebate") }}</div>
              </div>
              <div class="return-item">
                <div class="item-percent">{{ vip.rebateLottery }}</div>
                <div class="item-desc">{{ $t("lang.vip_lottery_rebate") }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-carousel-slide>
    </q-carousel>

    <div class="vip-detail-container">
      <!-- cannot flip cuz the border design will be upside down -->
      <!-- <q-tabs v-model="tab" dense align="center" narrow-indicator active-class="active-tab" class="vip-detail-tab">
        <q-tab name="rules" :ripple="false">
          <div class="vip-rules-btn-container">
            <img
              class="vip-rules-btn"
              :src="require(`../../assets/images/vip/left-vip-${tab === 'rules' ? 'active' : 'inactive'}-btn.png`)"
              alt=""
            />
            <span class="common-text">升级规则</span>
          </div>
        </q-tab>
        <q-tab name="privileges" :ripple="false">
          <div class="vip-privileges-btn-container">
            <img
              class="vip-privileges-btn"
              :src="
                require(`../../assets/images/vip/right-vip-${tab === 'privileges' ? 'active' : 'inactive'}-btn.png`)
              "
              alt=""
            />
            <span class="common-text">VIP特权</span>
          </div>
        </q-tab>
      </q-tabs> -->

      <q-tab-panels v-model="tab" class="rules-content q-mt-md">
        <q-tab-panel name="rules">
          <q-table
            flat
            :hide-pagination="true"
            :columns="columns"
            :rows="rows"
            row-key="name"
            :rows-per-page-options="[0]"
          >
            <template v-slot:header="props">
              <!-- <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr> -->
              <q-tr :props="props">
                <q-th rowspan="2">{{ $t("lang.vip_level") }}</q-th>
                <q-th colspan="4">{{ $t("lang.vip_monthly_reload") }}</q-th>
                <q-th colspan="4">{{ $t("lang.vip_exclusive_promotions") }}</q-th>
              </q-tr>
              <q-tr>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_percent_monthlyreload") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_min_deposit") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_max_bonus") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_return_over") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_bet_limit") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_priority_payment_method") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_24_7_cc_team") }}</q-th>
                <q-th style="background: #e7f3ff">{{ $t("lang.vip_invitation_to_ee") }}</q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props" class="common-text">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="privileges">
          <q-table
            flat
            :hide-pagination="true"
            :columns="columns2"
            :rows="rows2"
            row-key="name"
            :rows-per-page-options="[0]"
          ></q-table>
        </q-tab-panel>
      </q-tab-panels>

      <div class="q-mt-md vip-tips">{{ $t("lang.vip_notes") }}</div>
    </div>

    <div class="tnc-container">
      <div class="tnc-title">
        <img class="tnc-img" src="../../assets/images/vip/title-bg.png" alt="" />
        <span class="common-text">{{ $t("lang.vip_terms_title") }}</span>
      </div>

      <div class="tnc-note">
        <ul class="common-text">
          <li>{{ $t("lang.vip_terms_para_01") }}</li>
          <li>{{ $t("lang.vip_terms_para_02") }}</li>
          <li>{{ $t("lang.vip_terms_para_03") }}</li>
          <li>{{ $t("lang.vip_terms_para_04") }}</li>
          <li>{{ $t("lang.vip_terms_para_05") }}</li>
          <li>{{ $t("lang.vip_terms_para_06") }}</li>
          <li>{{ $t("lang.vip_terms_para_07") }}</li>
          <li>{{ $t("lang.vip_terms_para_08") }}</li>
          <li>{{ $t("lang.vip_terms_para_09") }}</li>
          <li>{{ $t("lang.vip_terms_para_10") }}</li>
        </ul>
      </div>
    </div>
  </div>

  <q-dialog
    width="100%"
    class="modal-common-div"
    v-model="isLoginModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">{{ $t("lang.system_please_login") }}</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn btn-standard-height" @click="router.push('/login')">
          {{ $t("lang.system_loginnow") }}
        </div>
        <div class="cacnels common-md-white-btn btn-standard-height" @click="isLoginModal = false">
          {{ $t("lang.system_cancel") }}
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onActivated, watch } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();
const { t } = useI18n();

const tab = ref("rules");

const slide = ref(0);
const vipItems = ref([
  {
    level: "1",
    title: t("lang.vip_iron"),
    welcomeBonus: "-",
    monthlyBonus: "-",
    birthdayBonus: "-",
    amount: "100",
    rebateSport: "0.30%",
    rebateEsports: "0.40%",
    rebateLive: "0.40%",
    rebatePoker: "0.40%",
    rebateSlot: "0.60%",
    rebateLottery: "0.30%",
    progressBarVal: 0
  },
  {
    level: "2",
    title: t("lang.vip_bronze"),
    welcomeBonus: "-",
    monthlyBonus: "-",
    birthdayBonus: "-",
    amount: "380,000",
    rebateSport: "0.38%",
    rebateEsports: "0.48%",
    rebateLive: "0.45%",
    rebatePoker: "0.48%",
    rebateSlot: "0.70%",
    rebateLottery: "0.30%",
    progressBarVal: 0
  },
  {
    level: "3",
    title: t("lang.vip_silver"),
    welcomeBonus: "888",
    monthlyBonus: "588",
    birthdayBonus: "-",
    amount: "1,000,000",
    rebateSport: "0.48%",
    rebateEsports: "0.58%",
    rebateLive: "0.50%",
    rebatePoker: "0.58%",
    rebateSlot: "0.80%",
    rebateLottery: "0.40%",
    progressBarVal: 0
  },
  {
    level: "4",
    title: t("lang.vip_gold"),
    welcomeBonus: "1,888",
    monthlyBonus: "888",
    birthdayBonus: "888",
    amount: "3,000,000",
    rebateSport: "0.58%",
    rebateEsports: "0.68%",
    rebateLive: "0.55%",
    rebatePoker: "0.68%",
    rebateSlot: "1.00%",
    rebateLottery: "0.40%",
    progressBarVal: 0
  },
  {
    level: "5",
    title: t("lang.vip_platinum"),
    welcomeBonus: "3,888",
    monthlyBonus: "1,888",
    birthdayBonus: "2,888",
    amount: "9,000,000",
    rebateSport: "0.68%",
    rebateEsports: "0.78%",
    rebateLive: "0.60%",
    rebatePoker: "0.78%",
    rebateSlot: "1.20%",
    rebateLottery: "0.50%",
    progressBarVal: 0
  },
  {
    level: "6",
    title: t("lang.vip_ruby"),
    welcomeBonus: "5,888",
    monthlyBonus: "3,888",
    birthdayBonus: "5,888",
    amount: "20,000,000",
    rebateSport: "0.78%",
    rebateEsports: "0.88%",
    rebateLive: "0.70%",
    rebatePoker: "0.88%",
    rebateSlot: "1.60%",
    rebateLottery: "0.50%",
    progressBarVal: 0
  },
  {
    level: "7",
    title: t("lang.vip_diamond"),
    welcomeBonus: "10,888",
    monthlyBonus: "5,888",
    birthdayBonus: "8,888",
    amount: "50,000,000",
    rebateSport: "0.88%",
    rebateEsports: "1.00%",
    rebateLive: "0.80%",
    rebatePoker: "1.00%",
    rebateSlot: "2.00%",
    rebateLottery: "0.60%",
    progressBarVal: 0
  }
]);

const vipClaimItems = [
  {
    benefit: "网站首存优惠",
    turnover: "无",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金88元",
    turnover: "电竞/体育10倍 老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少100元可申请一次再存20% 最高奖金1888元",
    turnover: "电竞/体育15倍 老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金188元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人15倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金388元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人15倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少200元可申请一次再存30%最高奖金1888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金888元",
    turnover: "电竞/体育 5倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少500元可申请每月一次再存35% 最高奖金8888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金1888元",
    turnover: "电竞/体育 8倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少500元可申请一次再存40%最高奖金18888元",
    turnover: "电竞/体育 15倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金8888元",
    turnover: "电竞/体育10倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  },
  {
    benefit: "存款最少20元可申请一次晋级奖金18888元",
    turnover: "电竞/体育10倍  老虎机12倍 真人18倍",
    availableBtn: false,
    claimedBtn: false,
    depositPromoBtn: false,
    monthlyBtn: false,
    progressBarVal: 0
  }
];

const claimDesc = ref(vipClaimItems[0]);
const currentDeposit = ref(0);

// for (let i = 0, l = vipItems.value.length; i < l; i++) {
//   if (!claimDesc.value) {
//     vipClaimItems[i].vip = i;
//     claimDesc.value = vipClaimItems[i];
//   }
// }

const canClaimMonthly = ref(false);
const checkVipRedeem = () => {
  // console.log(claimDesc.value)
  if (!claimDesc.value) {
    vipClaimItems.value.forEach((el, i) => {
      el[i].vip = i;
      if (i === 0) {
        claimDesc.value = el[0].vip;
      }
    });
  }
  getProgressBar();
  eventapi.get("/vip-welcome/canRedeem").then((res) => {
    if (res.code === 0) {
      // console.log(res.data);
      // Your arrays of elements
      const depositPromoAvailableElements = res.data.depositPromoAvailable;
      const promoAvailableElements = res.data.promoAvailable;
      const unavailableElements = res.data.unavailable;
      const claimedElements = res.data.claimed;

      // Function to update properties based on the provided elements
      function updatePropertiesBasedOnElements(elements, property) {
        // console.log(property)
        elements.forEach((element, i) => {
          const index = element - 1;
          // vipClaimItems[i].vip = i
          if (index >= 0 && index < vipClaimItems.length) {
            vipClaimItems[index][property] = true;
          }
        });
      }

      // Call the function to update properties based on depositPromoAvailable elements
      // updatePropertiesBasedOnElements(depositPromoAvailableElements, "depositPromoBtn");

      // Call the function to update properties based on promoAvailable elements
      updatePropertiesBasedOnElements(promoAvailableElements, "availableBtn");

      // Call the function to update properties based on unavailable elements
      updatePropertiesBasedOnElements(unavailableElements, "unavailable");

      // Call the function to update properties based on unavailable elements
      updatePropertiesBasedOnElements(claimedElements, "claimedBtn");

      // Now, vipItems array has the updated properties based on the provided elements
      // vipClaimItems[slide.value].vip = slide.value + 1;
      // claimDesc.value = vipClaimItems[slide.value];
      if (vipLevel.value !== 0) {
        slide.value = vipLevel.value - 1;
      } else {
        slide.value = 1;
      }

      vipClaimItems[slide.value].vip = slide.value;
      claimDesc.value = vipClaimItems[slide.value];
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });

  eventapi.get("/privi/vip/canRedeem?promoCode=vnm-vip-monthly").then((res) => {
    if (res.code === 0) {
      canClaimMonthly.value = res.data;
    }
  });
};
const getProgressBar = () => {
  vipItems.value.forEach((vip, i) => {
    if (Number(vipLevel.value + 1) > Number(vip.level)) {
      vip.progressBarVal = 0;
    } else {
      vip.progressBarVal = 1;
    }

    if (Number(vipLevel.value + 1 === Number(vip.level))) {
      let amt = vip.amount.replace(/,/g, "");
      let current = currentDeposit.value.replace(/,/g, "");
      let vipAmount = parseInt(amt, 10);
      let currentDep = parseInt(current, 10);

      // console.log("vipAmount", vipAmount); // Outputs: 400000
      // console.log("currentDep", currentDep);

      let percentageChange = (currentDep / vipAmount) * 100;
      vipItems.value[vipLevel.value].progressBarVal = 1 - percentageChange / 100;

      // console.log("percentageChange", percentageChange);
      // vipItems.value[vipLevel.value - 1].progressBarVal = 0.5;
    }
  });
};

watch(slide, (newValue) => {
  if (vipClaimItems[newValue]) {
    vipClaimItems[newValue].vip = newValue;
    claimDesc.value = vipClaimItems[newValue];
  }
});

const columns = [
  {
    name: "level",
    required: true,
    label: t("lang.vip_level"),
    align: "center",
    field: (row) => row.name
  },
  // { name: "amount", label: t("lang.vip_monthly_reload"), field: "amount", align: "center" },
  {
    name: "monthly_reload",
    align: "center",
    field: (row) => row.monthly_reload
  },
  {
    name: "min_deposit",
    align: "center",
    field: (row) => row.min_deposit
  },
  {
    name: "max_bonus",
    align: "center",
    field: (row) => row.max_bonus
  },
  {
    name: "return_over",
    align: "center",
    field: (row) => row.return_over
  },
  {
    name: "bet_limit",
    align: "center",
    field: (row) => row.bet_limit
  },
  {
    name: "priority_payment_method",
    align: "center",
    field: (row) => row.priority_payment_method
  },
  {
    name: "v24_7_cc_team",
    align: "center",
    field: (row) => row.v24_7_cc_team
  },
  {
    name: "invitation_to_ee",
    align: "center",
    field: (row) => row.invitation_to_ee
  }
];
const rows = [
  {
    name: "VIP1",
    amount: "一笔存款",
    monthly_reload: "0",
    min_deposit: "0",
    max_bonus: "0",
    return_over: "0",
    bet_limit: t("lang.vip_bet_limit_standard"),
    priority_payment_method: "",
    v24_7_cc_team: "",
    invitation_to_ee: ""
  },
  {
    name: "VIP2",
    amount: "3,000",
    monthly_reload: "0",
    min_deposit: "0",
    max_bonus: "0",
    return_over: "0",
    bet_limit: t("lang.vip_bet_limit_standard"),
    priority_payment_method: "",
    v24_7_cc_team: "",
    invitation_to_ee: ""
  },
  {
    name: "VIP3",
    amount: "30,000",
    monthly_reload: "0",
    min_deposit: "0",
    max_bonus: "0",
    return_over: "0",
    bet_limit: t("lang.vip_bet_limit_standard"),
    priority_payment_method: "",
    v24_7_cc_team: "",
    invitation_to_ee: ""
  },
  {
    name: "VIP4",
    amount: "80,000",
    monthly_reload: "0",
    min_deposit: "0",
    max_bonus: "0",
    return_over: "0",
    bet_limit: t("lang.vip_bet_limit_standard"),
    priority_payment_method: "",
    v24_7_cc_team: "",
    invitation_to_ee: ""
  },
  {
    name: "VIP5",
    amount: "200,000",
    monthly_reload: "30%",
    min_deposit: "3,500",
    max_bonus: "5,888",
    return_over: "15",
    bet_limit: t("lang.vip_bet_limit_highlimit"),
    priority_payment_method: "✓",
    v24_7_cc_team: "",
    invitation_to_ee: ""
  },
  {
    name: "VIP6",
    amount: "400,000",
    monthly_reload: "30%",
    min_deposit: "3,500",
    max_bonus: "8,888",
    return_over: "15",
    bet_limit: t("lang.vip_bet_limit_highlimit"),
    priority_payment_method: "✓",
    v24_7_cc_team: "✓",
    invitation_to_ee: ""
  },
  {
    name: "VIP7",
    amount: "600,000",
    monthly_reload: "30%",
    min_deposit: "3,500",
    max_bonus: "12,888",
    return_over: "15",
    bet_limit: t("lang.vip_bet_limit_highlimit"),
    priority_payment_method: "✓",
    v24_7_cc_team: "✓",
    invitation_to_ee: "✓"
  }
];

const columns2 = [
  {
    name: "level",
    required: true,
    label: "等级",
    align: "center",
    field: (row) => row.name
  },
  { name: "bronze", label: "青铜", field: "bronze", align: "center" },
  { name: "silver", label: "白银", field: "silver", align: "center" },
  { name: "gold", label: "黄金", field: "gold", align: "center" },
  { name: "platinum", label: "铂金", field: "platinum", align: "center" },
  { name: "diamond", label: "钻石", field: "diamond", align: "center" },
  { name: "rank", label: "最强王者", field: "rank", align: "center" },
  { name: "limit", label: "反水限额", field: "limit", align: "center" }
];
const rows2 = [
  {
    name: "电竞",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "无上限"
  },
  {
    name: "体育",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "无上限"
  },
  {
    name: "真人",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.55%",
    diamond: "0.6%",
    rank: "0.8%",
    limit: "88888元"
  },
  {
    name: "棋牌",
    bronze: "0.4%",
    silver: "0.45%",
    gold: "0.5%",
    platinum: "0.6%",
    diamond: "0.8%",
    rank: "1.0%",
    limit: "8888元"
  },
  {
    name: "老虎机",
    bronze: "0.6%",
    silver: "0.8%",
    gold: "1.0%",
    platinum: "1.2%",
    diamond: "1.6%",
    rank: "2.0%",
    limit: "无上限"
  }
];

const vipNumber = ref(null);
const extractNumber = (str) => {
  const match = str.match(/\d+/);
  vipNumber.value = match ? parseInt(match[0], 10) : null;
};

const claimMonthly = async () => {
  try {
    if (store.hasToken()) {
      const res = await eventapi.put("/bonus/claim/vnm-vip-monthly");
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("lang.vip_claim_success"),
          icon: "check_circle_outline"
        });
      }
    } else {
      isLoginModal.value = true;
    }
  } catch (error) {
    console.error("Error in VIP claim:", error);
  }
};

const claim = async () => {
  extractNumber(store.vip);

  try {
    if (store.hasToken()) {
      const res = await eventapi.post("/vip-welcome/claim", qs.stringify({ vipLevel: slide.value + 1 }));
      if (res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("lang.vip_claim_success"),
          icon: "check_circle_outline"
        });
        claimDesc.value.claimedBtn = true;
        claimDesc.value.availableBtn = false;
      }
    } else {
      isLoginModal.value = true;
    }
  } catch (error) {
    console.error("Error in VIP claim:", error);
  }
};
const vipLevel = ref(null);
const isLoginModal = ref(false);
onActivated(() => {
  if (store.hasToken()) {
    store.getMemberInfo().then(() => {
      vipLevel.value = +store.vip.replace("VIP", "");
      currentDeposit.value = parseFloat(store.currentDeposit).toLocaleString("en-US", { maximumFractionDigits: 0 });
      checkVipRedeem();
    });
  } else {
    claimDesc.value.vip = 0;
    vipItems.value.forEach((item) => {
      item.progressBarVal = 1;
    });
  }
});
</script>

<style lang="scss">
.vip-container {
  padding: 1.5rem;
  background: $secondary;

  .q-carousel {
    height: unset;
  }

  .q-carousel__prev-arrow--horizontal {
    left: 0;
    top: 70px;
    bottom: auto;
  }
  .q-carousel__next-arrow--horizontal {
    right: 0;
    top: 70px;
    bottom: auto;
  }

  .q-panel {
    overflow: hidden;
  }

  .vip-card-container {
    position: relative;
    margin: -16px -20px 0;

    .card-img-wrap {
      min-height: 160px;

      @media (min-width: 470px) {
        min-height: 210px;
      }
    }

    .card-img {
      width: 100%;
      min-height: 140px;
    }

    .status {
      position: absolute;
      left: 0;
      top: 13%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 20px;
        width: 120px;
      }

      span {
        position: absolute;
        color: white;
      }
    }

    .vip-card-info {
      position: absolute;
      left: 10%;
      top: 25%;

      @media (min-width: 470px) {
        top: 35%;
      }

      .level {
        display: flex;
        align-items: center;
        gap: 1.5vw;

        .vip-level {
          //   font-size: 2.85rem;
          font-size: 8vw;
          font-weight: 700;
          line-height: 1;
        }
      }

      .amount {
        display: flex;
        // gap: 3.5vw;
        flex-direction: column;

        .amount-text {
          color: $accent;
        }
      }

      .progress {
        margin: 2.5vw 0 0 0;
        width: 42.5vw;
        // width: 15rem;

        .progress-bar {
          background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          color: #ccc;
        }

        .start-end {
          display: flex;
          justify-content: space-between;
          margin: 0px -0.5rem;

          div {
            color: $dark;
            &.vip-card-current-num {
              color: #86570b;
            }
          }
        }
      }
    }
  }

  .level-promo-container {
    border-radius: 1.25rem;
    background: #fcfdfe;
    box-shadow: 0px -4px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
    margin-top: 12px;
    margin-left: -60px;
    margin-right: -60px;
    width: calc(100% + 120px);

    .level-promo-header {
      background: $lightblue;

      .level-promo-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: $accent;
        text-align: center;
        padding: 0.75rem 0;
      }
    }

    .return-promo-body {
      padding: 1rem;
    }

    .level-promo-body {
      // margin-left:-60px;
      // margin-right:-60px;
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .promo,
      .turnover {
        display: flex;
        gap: 2.5rem;
      }
    }

    .return-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      row-gap: 12px;
      column-gap: 6px;
    }
    .return-item {
      border-radius: 20px;

      .item-percent {
        background: #e7f3ff;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        padding: 6px;
        color: #468cff;
        font-weight: bold;
        font-size: 12px;
      }

      .item-desc {
        display: flex;
        text-align: center;
        justify-content: center;
        line-height: 1.4;
        font-size: 11px;
        color: #7a80a1;
        margin-top: 2px;
      }
    }

    .claim-btn-container {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1.145rem;

      &.status-claimed {
        opacity: 0.6;
        filter: grayscale(0.6);
      }

      .disabled {
        opacity: 0.6;
        filter: grayscale(0.6);
      }

      .claim-btn {
        width: 15rem;
        height: 2.5rem;
      }

      span {
        position: absolute;
        color: white;
      }
    }
  }

  .vip-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .vip-detail-tab {
      margin: 2rem 0 1rem 0;
    }

    .q-tab {
      padding: 0;
    }

    .q-tab--active .q-tab__indicator {
      opacity: 0;
      background: transparent;
    }

    .q-tab-panel {
      padding: 0;
    }

    .active-tab {
      span {
        color: white;
      }
    }

    .vip-rules-btn-container,
    .vip-privileges-btn-container {
      display: flex;
      align-items: center;
      justify-content: center;

      .vip-rules-btn,
      .vip-privileges-btn {
        width: 100%;
        height: 2.5rem;
      }

      span {
        position: absolute;
      }
    }

    .rules-content {
      width: 100%;
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 1px 0px #a7c2dd;

      thead {
        th {
          font-size: 1.15rem;
          font-weight: 600;
          color: $font-2;
          border-bottom-width: 0;
          white-space: wrap;
        }
      }
      thead > :first-child {
        background: $lightblue;
      }

      td:not(:last-child) {
        border-right-width: 1px;
      }
    }
  }

  .tnc-container {
    .tnc-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0 1rem 0;

      .tnc-img {
        width: 95%;
      }

      span {
        position: absolute;
        color: white;
      }
    }

    .tnc-note {
      padding: 1rem 2rem;
      border-radius: 1.25rem;
      background: #fcfdfe;
      box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 1px 0px #a7c2dd;

      ul {
        list-style-type: decimal;
        padding-inline-start: 0;

        li {
          font-size: 0.85rem;
          margin: 1rem 0;
        }
      }
    }
  }

  .q-icon {
    font-size: 7vw;
    border-radius: 5.5rem;
    background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);
    box-shadow: 0px 4.58px 4.58px 0px #bbdcff inset, 0px -3.664px 3.664px 0px #a2bff4 inset;
  }

  .vip-promo-bonus {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    gap: 20px;
    white-space: normal;
  }

  .vip-tips {
    color: #ff0000;
  }

  .common-text {
    font-size: 1rem;
    font-weight: 400;
    color: $font-1;

    &:first-child {
      min-width: 60px;
    }
  }

  .common-amount {
    color: #468cff;
    font-weight: bold;
  }

  .common-btn {
    margin-left: auto;
    .btn-main {
      background-image: url("../../assets/images/account/account-btn.png");
      background-size: 100% 100%;
      color: #fff;
      min-width: 60px;
      padding-left: 12px;
      padding-right: 12px;
      text-align: center;
      white-space: nowrap;
      font-size: 1rem;
      // aspect-ratio: 122/68;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      background-color: transparent;
      &:before {
        box-shadow: none;
      }

      &.status-claimed {
        opacity: 0.6;
        filter: grayscale(0.6);
        cursor: not-allowed;
      }
    }
  }

  .vip-card-common-text {
    font-size: 2.7vw;
    font-weight: 400;
    color: $font-1;
  }

  .vip-card-current-num {
    margin-top: 8px;
    font-size: 11px;
  }
}

@media (min-width: 551px) {
  .vip-container {
    .vip-card-container {
      .card-img {
        width: 100%;
      }

      .status {
        img {
          width: 6rem;
        }

        span {
          position: absolute;
          color: white;
        }
      }

      .vip-card-info {
        .level {
          gap: 0.5rem;
          .vip-level {
            font-size: 2.85rem;
          }
        }

        .amount {
          gap: 1.5rem;
        }

        .progress {
          margin: 1rem 0 0 0;
          width: 15rem;
        }
      }
    }

    .q-icon {
      font-size: 2.5rem;
    }

    .vip-card-common-text {
      font-size: 1rem;
    }
  }
}
</style>

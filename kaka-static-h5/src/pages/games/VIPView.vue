<template>
  <div class="vip-container">
    <div class="details">
      <h4 style="margin-top: 0; display: block; text-align: center;">{{$t('lang.vip_header1')}}</h4>
      <p><strong>{{$t('lang.vip_target')}}</strong> {{$t('lang.vip_targetdet')}}</p>
      <p><strong>{{$t('lang.vip_duration')}}</strong>{{$t('lang.vip_durationdet')}}</p>
      <p><strong>{{$t('lang.vip_note')}}</strong>{{$t('lang.vip_notedet')}}</p>
    </div>
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
            <img class="card-img" :src="require(`../../assets/images/vip/vip${returnNumber(vip.level)}.png`)" alt="" />
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
              <!-- <div class="vip-card-common-text">{{ vip.title }}</div> -->
            </div>
            <div class="amount q-mt-xs">
              <div class="vip-card-common-text">{{ $t("lang.vip_upgrade_require") }}</div>
              <div class="vip-card-common-text amount-text">
                <!-- <span v-if="vipIndex === 0">{{ $t('lang.vip_3timedeposit') }}</span> -->
                <span>{{ $t('lang.totalBetMonth') }} {{ vip.amount }}</span>
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
                <div class="vip-card-current-num" v-if="vipLevel === vipIndex ">VNDP {{ currentDeposit }}</div>
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
                  v-if="claimDesc.availableBtn || claimDesc.claimedBtn"
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
                  v-if="claimDesc.availableBtn || claimDesc.claimedBtn"
                  no-caps
                  @click="router.push('/liveChat')"
                >
                  {{ $t("lang.vip_contactcs") }}
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- <q-card class="level-promo-container">
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
        </q-card> -->
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
                <!-- <q-th rowspan="2">{{ $t("lang.vip_level") }}</q-th>
                <q-th colspan="4">{{ $t("lang.vip_monthly_reload") }}</q-th>
                <q-th colspan="4">{{ $t("lang.vip_exclusive_promotions") }}</q-th>
              </q-tr>
              <q-tr> -->
                <!-- <q-th style="background: #ffe7e7">{{ $t("lang.vip_percent_monthlyreload") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_min_deposit") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_max_bonus") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_return_over") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_bet_limit") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_priority_payment_method") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_24_7_cc_team") }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t("lang.vip_invitation_to_ee") }}</q-th>
                 -->
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader1') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader2') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader3') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader4') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader5') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader6') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader7') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader8') }}</q-th>
                <q-th style="background: #ffe7e7">{{ $t('lang.vip_tableHeader9') }}</q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props" class="common-text">
                  {{ col.value.toLocaleString() }}
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

      <!-- <div class="q-mt-md vip-tips">{{ $t("lang.vip_notes") }}</div> -->
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
        "level": "1",
        "welcomeBonus": "28",
        "monthlyBonus": "0",
        "birthdayBonus": "0",
        "amount": "30,000",
        "progressBarVal": 0
    },
    {
        "level": "2",
        "welcomeBonus": "58",
        "monthlyBonus": "0",
        "birthdayBonus": "0",
        "amount": "60,000",
        "progressBarVal": 0
    },
    {
        "level": "3",
        "welcomeBonus": "88",
        "monthlyBonus": "188",
        "birthdayBonus": "88",
        "amount": "100,000",
        "progressBarVal": 0
    },
    {
        "level": "4",
        "welcomeBonus": "188",
        "monthlyBonus": "288",
        "birthdayBonus": "88",
        "amount": "150,000",
        "progressBarVal": 0
    },
    {
        "level": "5",
        "welcomeBonus": "288",
        "monthlyBonus": "388",
        "birthdayBonus": "88",
        "amount": "200,000",
        "progressBarVal": 0
    },
    {
        "level": "6",
        "welcomeBonus": "388",
        "monthlyBonus": "588",
        "birthdayBonus": "88",
        "amount": "300,000",
        "progressBarVal": 0
    },
    {
        "level": "7",
        "welcomeBonus": "588",
        "monthlyBonus": "688",
        "birthdayBonus": "88",
        "amount": "500,000",
        "progressBarVal": 0
    },
    {
        "level": "8",
        "welcomeBonus": "888",
        "monthlyBonus": "888",
        "birthdayBonus": "188",
        "amount": "800,000",
        "progressBarVal": 0
    },
    {
        "level": "9",
        "welcomeBonus": "1,288",
        "monthlyBonus": "1,588",
        "birthdayBonus": "188",
        "amount": "1,500,000",
        "progressBarVal": 0
    },
    {
        "level": "10",
        "welcomeBonus": "1,588",
        "monthlyBonus": "1,888",
        "birthdayBonus": "588",
        "amount": "2,800,000",
        "progressBarVal": 0
    },
    {
        "level": "11",
        "welcomeBonus": "2,888",
        "monthlyBonus": "2,588",
        "birthdayBonus": "588",
        "amount": "5,000,000",
        "progressBarVal": 0
    },
    {
        "level": "12",
        "welcomeBonus": "5,888",
        "monthlyBonus": "2,888",
        "birthdayBonus": "588",
        "amount": "8,800,000",
        "progressBarVal": 0
    },
    {
        "level": "13",
        "welcomeBonus": "8,888",
        "monthlyBonus": "3,588",
        "birthdayBonus": "888",
        "amount": "12,800,000",
        "progressBarVal": 0
    },
    {
        "level": "14",
        "welcomeBonus": "12,888",
        "monthlyBonus": "3,888",
        "birthdayBonus": "888",
        "amount": "18,800,000",
        "progressBarVal": 0
    },
    {
        "level": "15",
        "welcomeBonus": "18,888",
        "monthlyBonus": "5,888",
        "birthdayBonus": "2,888",
        "amount": "25,000,000",
        "progressBarVal": 0
    },
    {
        "level": "16",
        "welcomeBonus": "25,888",
        "monthlyBonus": "8,888",
        "birthdayBonus": "2,888",
        "amount": "32,000,000",
        "progressBarVal": 0
    },
    {
        "level": "17",
        "welcomeBonus": "38,888",
        "monthlyBonus": "15,888",
        "birthdayBonus": "5,888",
        "amount": "42,000,000",
        "progressBarVal": 0
    },
    {
        "level": "18",
        "welcomeBonus": "58,888",
        "monthlyBonus": "18,888",
        "birthdayBonus": "5,888",
        "amount": "60,800,000",
        "progressBarVal": 0
    },
    {
        "level": "19",
        "welcomeBonus": "78,888",
        "monthlyBonus": "25,888",
        "birthdayBonus": "8,888",
        "amount": "77,300,000",
        "progressBarVal": 0
    },
    {
        "level": "20",
        "welcomeBonus": "88,888",
        "monthlyBonus": "28,888",
        "birthdayBonus": "8,888",
        "amount": "98,800,000",
        "progressBarVal": 0
    },
    {
        "level": "21",
        "welcomeBonus": "128,888",
        "monthlyBonus": "30,888",
        "birthdayBonus": "8,888",
        "amount": "128,800,000",
        "progressBarVal": 0
    },
    {
        "level": "22",
        "welcomeBonus": "158,888",
        "monthlyBonus": "35,888",
        "birthdayBonus": "15,888",
        "amount": "178,800,000",
        "progressBarVal": 0
    },
    {
        "level": "23",
        "welcomeBonus": "188,888",
        "monthlyBonus": "38,888",
        "birthdayBonus": "15,888",
        "amount": "268,800,000",
        "progressBarVal": 0
    },
    {
        "level": "24",
        "welcomeBonus": "198,888",
        "monthlyBonus": "52,888",
        "birthdayBonus": "18,888",
        "amount": "328,800,000",
        "progressBarVal": 0
    },
    {
        "level": "25",
        "welcomeBonus": "208,888",
        "monthlyBonus": "55,888",
        "birthdayBonus": "18,888",
        "amount": "398,800,000",
        "progressBarVal": 0
    },
    {
        "level": "26",
        "welcomeBonus": "258,888",
        "monthlyBonus": "58,888",
        "birthdayBonus": "28,888",
        "amount": "478,800,000",
        "progressBarVal": 0
    },
    {
        "level": "27",
        "welcomeBonus": "288,888",
        "monthlyBonus": "68,888",
        "birthdayBonus": "28,888",
        "amount": "568,800,000",
        "progressBarVal": 0
    },
    {
        "level": "28",
        "welcomeBonus": "588,888",
        "monthlyBonus": "88,888",
        "birthdayBonus": "58,888",
        "amount": "678,800,000",
        "progressBarVal": 0
    },
    {
        "level": "29",
        "welcomeBonus": "1,588,888",
        "monthlyBonus": "288,888",
        "birthdayBonus": "88,888",
        "amount": "1,158,800,000",
        "progressBarVal": 0
    },
    {
        "level": "30",
        "welcomeBonus": "2,888,888",
        "monthlyBonus": "888,888",
        "birthdayBonus": "88,888",
        "amount": "1,628,800,000",
        "progressBarVal": 0
    }
])
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
const returnNumber = (vipLevel) => {
  if (vipLevel <= 5) {
    return '1'
  } else if (vipLevel <= 10) {
    return '3'
  } else if (vipLevel <= 15) {
    return '5'
  } else if (vipLevel <= 20) {
    return '7'
  } else if (vipLevel <= 25) {
    return '9'
  } else if (vipLevel <= 29) {
    return '11'
  } else if (vipLevel <= 30) {
    return '12'
  }
}

const claimDesc = ref(vipClaimItems[0]);
const currentDeposit = ref(0);

// for (let i = 0, l = vipItems.value.length; i < l; i++) {
//   if (!claimDesc.value) {
//     vipClaimItems[i].vip = i;
//     claimDesc.value = vipClaimItems[i];
//   }
// }

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

  eventapi.get("/privi/vip/canRedeem", { promoCode: "vnm-vip-monthly" }).then((res) => {
    if (res.code === 0) {
      vipClaimItems[slide.value].monthlyBtn = res.data;
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
    label: t("lang.vip_header1"),
    align: "center",
    field: "level" // Use "name" directly since it's the property name in rows
  },
  {
    name: "total_bet",
    label: t("lang.vip_header2"),
    align: "center",
    field: "total_bet"
  },
  {
    name: "accumulated_deposit",
    label: t("lang.vip_header3"),
    align: "center",
    field: "accumulated_deposit"
  },
  {
    name: "retain_amount",
    label: t("lang.vip_header4"),
    align: "center",
    field: "retain_amount"
  },
  {
    name: "levelup_bonus",
    label: t("lang.vip_header5"),
    align: "center",
    field: "levelup_bonus"
  },
  {
    name: "monthly_bonus",
    label: t("lang.vip_header6"),
    align: "center",
    field: "monthly_bonus"
  },
  {
    name: "birthday_bonus",
    label: t("lang.vip_header7"),
    align: "center",
    field: "birthday_bonus" // Adjust based on your data structure
  },
  {
    name: "promotion_bonus",
    label: t("lang.vip_header8"),
    align: "center",
    field: "promotion_bonus" // Adjust based on your data structure
  },
  {
    name: "daily_withdrawal_limit",
    label: t("lang.vip_header9"),
    align: "center",
    field: "daily_withdrawal_limit" // Adjust based on your data structure
  }
];
const rows = [
  {
    "level": "VIP1",
    "total_bet": 30000,
    "accumulated_deposit": 200,
    "retain_amount": 500,
    "levelup_bonus": 28,
    "monthly_bonus": 0,
    "birthday_bonus": 0,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP2",
    "total_bet": 60000,
    "accumulated_deposit": 500,
    "retain_amount": 1000,
    "levelup_bonus": 58,
    "monthly_bonus": 0,
    "birthday_bonus": 0,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP3",
    "total_bet": 100000,
    "accumulated_deposit": 1000,
    "retain_amount": 2000,
    "levelup_bonus": 88,
    "monthly_bonus": 188,
    "birthday_bonus": 88,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP4",
    "total_bet": 150000,
    "accumulated_deposit": 3000,
    "retain_amount": 5000,
    "levelup_bonus": 188,
    "monthly_bonus": 288,
    "birthday_bonus": 88,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP5",
    "total_bet": 200000,
    "accumulated_deposit": 5000,
    "retain_amount": 5000,
    "levelup_bonus": 288,
    "monthly_bonus": 388,
    "birthday_bonus": 88,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP6",
    "total_bet": 300000,
    "accumulated_deposit": 10000,
    "retain_amount": 10000,
    "levelup_bonus": 388,
    "monthly_bonus": 588,
    "birthday_bonus": 88,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP7",
    "total_bet": 500000,
    "accumulated_deposit": 20000,
    "retain_amount": 20000,
    "levelup_bonus": 588,
    "monthly_bonus": 688,
    "birthday_bonus": 88,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP8",
    "total_bet": 800000,
    "accumulated_deposit": 50000,
    "retain_amount": 50000,
    "levelup_bonus": 888,
    "monthly_bonus": 888,
    "birthday_bonus": 188,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP9",
    "total_bet": 1500000,
    "accumulated_deposit": 75000,
    "retain_amount": 75000,
    "levelup_bonus": 1288,
    "monthly_bonus": 1588,
    "birthday_bonus": 188,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP10",
    "total_bet": 2800000,
    "accumulated_deposit": 100000,
    "retain_amount": 100000,
    "levelup_bonus": 1588,
    "monthly_bonus": 1888,
    "birthday_bonus": 588,
    "promotion_bonus": 10,
    "daily_withdrawal_limit": 700000
  },
  {
    "level": "VIP11",
    "total_bet": 5000000,
    "accumulated_deposit": 150000,
    "retain_amount": 150000,
    "levelup_bonus": 2888,
    "monthly_bonus": 2588,
    "birthday_bonus": 588,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP12",
    "total_bet": 8800000,
    "accumulated_deposit": 200000,
    "retain_amount": 200000,
    "levelup_bonus": 5888,
    "monthly_bonus": 2888,
    "birthday_bonus": 588,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP13",
    "total_bet": 12800000,
    "accumulated_deposit": 250000,
    "retain_amount": 250000,
    "levelup_bonus": 8888,
    "monthly_bonus": 3588,
    "birthday_bonus": 888,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP14",
    "total_bet": 18800000,
    "accumulated_deposit": 300000,
    "retain_amount": 300000,
    "levelup_bonus": 12888,
    "monthly_bonus": 3888,
    "birthday_bonus": 888,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP15",
    "total_bet": 25000000,
    "accumulated_deposit": 350000,
    "retain_amount": 350000,
    "levelup_bonus": 18888,
    "monthly_bonus": 5888,
    "birthday_bonus": 2888,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP16",
    "total_bet": 32000000,
    "accumulated_deposit": 500000,
    "retain_amount": 500000,
    "levelup_bonus": 25888,
    "monthly_bonus": 8888,
    "birthday_bonus": 2888,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP17",
    "total_bet": 42000000,
    "accumulated_deposit": 750000,
    "retain_amount": 750000,
    "levelup_bonus": 38888,
    "monthly_bonus": 15888,
    "birthday_bonus": 5888,
    "promotion_bonus": 20,
    "daily_withdrawal_limit": 1000000
  },
  {
    "level": "VIP18",
    "total_bet": 60800000,
    "accumulated_deposit": 1000000,
    "retain_amount": 1000000,
    "levelup_bonus": 58888,
    "monthly_bonus": 18888,
    "birthday_bonus": 5888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP19",
    "total_bet": 77300000,
    "accumulated_deposit": 1200000,
    "retain_amount": 1200000,
    "levelup_bonus": 78888,
    "monthly_bonus": 25888,
    "birthday_bonus": 8888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP20",
    "total_bet": 98800000,
    "accumulated_deposit": 1400000,
    "retain_amount": 1400000,
    "levelup_bonus": 88888,
    "monthly_bonus": 28888,
    "birthday_bonus": 8888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP21",
    "total_bet": 128800000,
    "accumulated_deposit": 1600000,
    "retain_amount": 1600000,
    "levelup_bonus": 128888,
    "monthly_bonus": 30888,
    "birthday_bonus": 8888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP22",
    "total_bet": 178800000,
    "accumulated_deposit": 1800000,
    "retain_amount": 1800000,
    "levelup_bonus": 158888,
    "monthly_bonus": 35888,
    "birthday_bonus": 15888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP23",
    "total_bet": 268800000,
    "accumulated_deposit": 2000000,
    "retain_amount": 2000000,
    "levelup_bonus": 188888,
    "monthly_bonus": 38888,
    "birthday_bonus": 15888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP24",
    "total_bet": 328800000,
    "accumulated_deposit": 2200000,
    "retain_amount": 2200000,
    "levelup_bonus": 198888,
    "monthly_bonus": 52888,
    "birthday_bonus": 18888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP25",
    "total_bet": 398800000,
    "accumulated_deposit": 2400000,
    "retain_amount": 2400000,
    "levelup_bonus": 208888,
    "monthly_bonus": 55888,
    "birthday_bonus": 18888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP26",
    "total_bet": 478800000,
    "accumulated_deposit": 2600000,
    "retain_amount": 2600000,
    "levelup_bonus": 258888,
    "monthly_bonus": 58888,
    "birthday_bonus": 28888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP27",
    "total_bet": 568800000,
    "accumulated_deposit": 2800000,
    "retain_amount": 2800000,
    "levelup_bonus": 288888,
    "monthly_bonus": 68888,
    "birthday_bonus": 28888,
    "promotion_bonus": 30,
    "daily_withdrawal_limit": 1500000
  },
  {
    "level": "VIP28",
    "total_bet": 678800000,
    "accumulated_deposit": 3000000,
    "retain_amount": 3000000,
    "levelup_bonus": 588888,
    "monthly_bonus": 88888,
    "birthday_bonus": 58888,
    "promotion_bonus": "Không Giới Hạn",
    "daily_withdrawal_limit": 2000000
  },
  {
    "level": "VIP29",
    "total_bet": 1158800000,
    "accumulated_deposit": 3500000,
    "retain_amount": 3500000,
    "levelup_bonus": 1588888,
    "monthly_bonus": 288888,
    "birthday_bonus": 88888,
    "promotion_bonus": "Không Giới Hạn",
    "daily_withdrawal_limit": 2000000
  },
  {
    "level": "VIP30",
    "total_bet": 1628800000,
    "accumulated_deposit": 4000000,
    "retain_amount": 4000000,
    "levelup_bonus": 2888888,
    "monthly_bonus": 88888,
    "birthday_bonus": 888888,
    "promotion_bonus": "Không Giới Hạn",
    "daily_withdrawal_limit": 2000000
  }
]

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
  background: #1e212c;

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
          color: #333333;
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
    box-shadow: 0px -4px 8px 0px #E6C3C3 inset, 0px 4px 0px 0px #a7c2dd;
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
        background: #FFE7E7;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        padding: 6px;
        color: #FD574C;
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
      box-shadow: 0px -8px 8px 0px #E6C3C3 inset, 0px 4px 1px 0px #a7c2dd;

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
        filter: hue-rotate(145deg);
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
      box-shadow: 0px -8px 8px 0px #E6C3C3 inset, 0px 4px 1px 0px #a7c2dd;

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
    color: #FD574C;
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

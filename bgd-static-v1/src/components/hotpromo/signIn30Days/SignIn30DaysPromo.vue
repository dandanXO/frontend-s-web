<template>
  <div>
    <div class="check-in-container content-card">
      <div class="header-amt">300,000,000BDT</div>
      <div class="check-in-days-visual">
        <div
          class="day-card"
          v-for="n in chestTotalDays"
          :key="n"
          :class="{ active: todayCheckInDay === n }"
          :ref="setDayItemRef(n)"
        >
          <span>{{ todayCheckInDay === n ? $t("hotPromo.signIn30Days.today") : n }}</span>
          <img
            class="day-card-img"
            :class="{ closed: !(n < todayCheckInDay || (todayCheckInDay === n && hasClaimedToday)) }"
            :src="
              require(`../../../assets/images/promotion/hotpromo/signin-30days/day-range-${getChestDesign(n)}-icon${
                n < todayCheckInDay || (todayCheckInDay === n && hasClaimedToday) ? '-open' : ''
              }.png`)
            "
          />
        </div>
      </div>
      <div class="check-in-btm">
        <div class="sign-in-btn" @click="claimReward" :class="{ 'is-disabled': hasClaimedToday || isLoadingClaim }">
          <span>
            {{ hasClaimedToday ? $t("hotPromo.signIn30Days.claimed") : $t("hotPromo.signIn30Days.signInNow") }}
          </span>
        </div>
        <template v-if="minValidBet > 0">
          <div class="bonus-progress-bar">
            <div class="bonus-progress-bar-fill" :style="{ width: progressBarWidth + '%' }"></div>
          </div>
          <div class="total-bet-txt">
            TOTAL BET：{{ convertToCommaAmount(totalValidBet) }}/{{ convertToCommaAmount(minValidBet) }} BDT
          </div>
        </template>
      </div>
    </div>
    <div class="reward-mech-container content-card">
      <div class="content-card-title">
        <img
          :src="
            require(`../../../assets/images/promotion/hotpromo/signin-30days/reward-mech-title-${$t(
              'lang.langVal'
            )}.png`)
          "
        />
      </div>
      <div class="q-mb-sm">
        {{ $t("hotPromo.signIn30Days.progressRewardSystem") }}
      </div>
      <div class="reward-day-range" v-for="(item, index) in rewardProbability" :key="index">
        <img
          class="day-range-img"
          :src="require(`../../../assets/images/promotion/hotpromo/signin-30days/day-range-${index + 1}-icon.png`)"
        />
        <span>
          {{ $t("hotPromo.signIn30Days.day") }}
          <b>{{ item.dayRange }}</b>
          {{ index === 3 ? "Super" : "" }}
          {{ $t("hotPromo.signIn30Days.claim") }}: {{ $t("hotPromo.signIn30Days.claimThe") }} {{ item.chestType }}
          {{ $t("hotPromo.signIn30Days.chestWithRandom") }}
          <span style="color: #eaff00cc; font-weight: 700">{{ item.maxReward }}BDT</span>
        </span>
      </div>
      <div class="missed-rules-txt">
        {{ $t("hotPromo.signIn30Days.missedRules01") }}
      </div>
      <img
        class="subtitle-img"
        :src="
          require(`../../../assets/images/promotion/hotpromo/signin-30days/reward-probability-dist-title-${$t(
            'lang.langVal'
          )}.png`)
        "
      />
      <table class="content-table" border="0" cellpadding="8" cellspacing="0" width="100%" style="text-align: center">
        <thead>
          <tr>
            <th>{{ $t("hotPromo.signIn30Days.dayRange") }}</th>
            <th>{{ $t("hotPromo.signIn30Days.maxReward") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rewardProbability" :key="index">
            <td>
              {{ $t("hotPromo.signIn30Days.days") }} {{ item.dayRange
              }}{{ index === 3 ? $t("hotPromo.signIn30Days.superChest") : "" }}
            </td>
            <td>
              <div class="reward-coin-container">
                <img
                  class="reward-coin"
                  src="../../../assets/images/promotion/hotpromo/signin-30days/reward-probability-coin.png"
                />
                <div class="reward-coin-txt">{{ item.maxReward }} BDT</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <img
        class="subtitle-img"
        :src="
          require(`../../../assets/images/promotion/hotpromo/signin-30days/reward-claim-conditions-title-${$t(
            'lang.langVal'
          )}.png`)
        "
      />
      <div class="q-mb-sm" style="text-transform: uppercase">
        {{ $t("hotPromo.signIn30Days.usersMustMeet") }}
      </div>
      <div class="reward-claim-condition">
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 1</span>
            : {{ $t("hotPromo.signIn30Days.noBettingRequired") }}
            <br />
            <span style="margin-top: 8px; margin-bottom: 4px; display: inline-block">
              &nbsp;&nbsp;&bull;
              <span v-html="$t('hotPromo.signIn30Days.ifRestartingOnDay1')" />
            </span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 2-3</span>
            : {{ $t("hotPromo.signIn30Days.noBettingRequired") }}
            <br />
            <span style="margin-top: 8px; margin-bottom: 4px; display: inline-block">
              &nbsp;&nbsp;&bull;
              <span v-html="$t('hotPromo.signIn30Days.ifRestartingOnDay2')" />
            </span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 4</span>
            :
            <span style="font-size: 14px; color: #11ff00">100 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 5</span>
            :
            <span style="font-size: 14px; color: #11ff00">100 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 6</span>
            :
            <span style="font-size: 14px; color: #11ff00">200 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 7</span>
            :
            <span style="font-size: 14px; color: #11ff00">300 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">{{ $t("hotPromo.signIn30Days.day") }} 8-13</span>
            : {{ $t("hotPromo.signIn30Days.minCumulativeBetsOf") }}
            <span style="font-size: 14px; color: #11ff00">500 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">
              {{ $t("hotPromo.signIn30Days.day") }} {{ rewardProbability[rewardProbability.length - 2].dayRange }}
            </span>
            : {{ $t("hotPromo.signIn30Days.minCumulativeBetsOf") }}
            <span style="font-size: 14px; color: #11ff00">600 BDT</span>
          </span>
        </div>
        <div class="reward-claim-condition-item">
          <span>
            <span style="font-size: 14px; color: #ffb700">
              {{ $t("hotPromo.signIn30Days.day") }} {{ rewardProbability[rewardProbability.length - 1].dayRange }}
            </span>
            : {{ $t("hotPromo.signIn30Days.minCumulativeBetsOf") }}
            <span style="font-size: 14px; color: #11ff00">1,000 BDT</span>
          </span>
        </div>
      </div>
      <div class="misuse-warning-txt">{{ $t("hotPromo.signIn30Days.usersMustMeetTheBettingReq") }}</div>
    </div>
    <div class="activity-rule-container">
      <img
        class="activity-rule-img"
        :src="
          require(`../../../assets/images/promotion/hotpromo/signin-30days/activity-rule-title-${$t(
            'lang.langVal'
          )}.png`)
        "
      />
      <ul class="activity-rule-list">
        <li v-html="$t('hotPromo.signIn30Days.activityRules01')" />
        <li v-html="$t('hotPromo.signIn30Days.activityRules02')" />
        <li v-html="$t('hotPromo.signIn30Days.activityRules03')" />
      </ul>
    </div>
    <div class="ranking-list-container">
      <img
        class="ranking-list-title"
        :src="
          require(`../../../assets/images/promotion/hotpromo/signin-30days/ranking-list-title-${$t(
            'lang.langVal'
          )}.png`)
        "
      />
      <div class="podium-div">
        <img class="podium" src="../../../assets/images/promotion/hotpromo/signin-30days/podium.png" />
        <div v-for="n in 3" :key="n" class="medal" :class="'medal-' + n">
          <img :src="require(`../../../assets/images/promotion/hotpromo/signin-30days/medal-${n}.png`)" />
          <div class="medal-txt">{{ rankingList?.length > 0 ? rankingList[n - 1]?.loginName : "" }}</div>
          <div v-if="rankingList?.length > 0" class="ranking-win-coin">
            <img src="../../../assets/images/promotion/hotpromo/signin-30days/ranking-coin.png" />
            <div>
              {{
                rankingList?.length > 0 && rankingList[n - 1]?.amount
                  ? convertToCommaAmount(rankingList[n - 1].amount, false)
                  : ""
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="rankingList?.length > 0" class="ranking-list">
        <div class="ranking-list-item" v-for="n in 7" :key="n">
          <div class="ranking-index">{{ n + 3 }}</div>
          <div class="icon-txt">
            <img src="../../../assets/images/promotion/hotpromo/signin-30days/ranking-badge.png" />
            <span>{{ rankingList?.length > 0 ? rankingList[n + 2]?.loginName : "" }}</span>
          </div>
          <div class="icon-txt">
            <img src="../../../assets/images/promotion/hotpromo/signin-30days/ranking-coin.png" />
            <span>
              {{
                rankingList?.length > 0 && rankingList[n + 2]?.amount
                  ? convertToCommaAmount(rankingList[n + 2].amount, false)
                  : ""
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="isShowCongratsDialog" @hide="handleReceiveBonus" persistent>
    <div class="congrats-container">
      <!-- <q-btn icon="close" round dense v-close-popup class="congrats-close" /> -->
      <div class="congrats-header">
        <img :src="require(`../../../assets/images/index/modal/congrats-header-long-${$t('lang.langVal')}.png`)" />
      </div>
      <div class="congrats-chest"><img src="../../../assets/images/index/modal/congrats-chest-dark.png" /></div>

      <div class="congrats-highlight">{{ convertToCommaAmount(bonusAmount) }}BDT</div>
      <div class="congrats-title">{{ randomWish }}</div>
      <div class="congrats-button">
        <q-btn no-caps unelevated class="receive-btn" @click="handleReceiveBonus">
          {{ $t("btn.receive") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="bindEmailDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindEmail") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.email')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.email_placeholder')"
                    v-model="updateEmailInfo.email"
                    ref="updateEmailRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => /.+@.+\..+/.test(val) || $t('form.email_rules_02')]"
                  >
                    <template v-slot:append>
                      <div class="pc-form-side-btn">
                        <q-btn
                          no-caps
                          dense
                          class="text-green"
                          :label="!startCountdownResendOTP && $t('form.send')"
                          :disable="startCountdownResendOTP"
                          @click="openVerificationCodeDialog"
                        />
                      </div>
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.code')">
                <template #input>
                  <q-input
                    outlined
                    clearable
                    :placeholder="$t('form.code_placeholder')"
                    v-model="updateEmailInfo.code"
                    ref="updateEmailCodeRef"
                    hide-bottom-space
                    type="text"
                    :rules="[(val) => val.length !== 0 || $t('form.code_rules_01')]"
                  >
                    <template v-slot:append v-if="startCountdownResendOTP">{{ countdownOTP }}s</template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdateEmail">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="verificationCodeDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.captchaCodeCheck") }}</div>

        <div class="pc-form">
          <div class="pc-form-item">
            <div class="pc-form-label">{{ $t("form.captchaCode") }}</div>
            <div class="pc-form-input">
              <q-input
                filled
                hide-bottom-space
                dense
                clearable
                :placeholder="$t('form.captchaCode_placeholder')"
                v-model="captchaRef"
                :rules="[
                  (val) => (val && val.length > 0) || $t('form.captchaCode_rules_01'),
                  (val) => (val && val.length > 3 && val.length < 5) || $t('form.captchaCode_rules_02')
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onCaptchaSubmit">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="changePhoneDialog">
    <div class="popout-dialog">
      <q-btn
        dense
        rounded
        icon="close"
        class="text-white popout-close"
        @click="changePhoneDialog = false"
        v-close-popup
      />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("form.bindPhoneNumber") }}</div>
        <div class="pc-form">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.phone')">
                <template #input>
                  <q-input
                    type="tel"
                    pattern="\d*"
                    maxlength="11"
                    hide-bottom-space
                    ref="phoneRef"
                    v-model="updatePhoneInfo.phone"
                    :rules="[
                      (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                      (val) => (val && val.length >= 10 && val.length <= 11) || $t('form.phone_rules_02'),
                      (val) => val.startsWith('01') || $t('form.phone_rules_03')
                    ]"
                    label-color="brand"
                    outlined
                    color="green"
                    :placeholder="$t('form.phone')"
                  >
                    <template v-slot:prepend>
                      <FancyIcon name="smartphone" />
                      <div class="prepend-number">+880</div>
                    </template>
                  </q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>
        </div>

        <div class="bottom-btn">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="submitUpdatePhone">
            {{ $t("btn.confirm") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { userStore } from "src/stores";
import { eventapi } from "src/boot/axios";
import { convertToCommaAmount } from "src/boot/utils";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { t } from "src/boot/lang";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";

const props = defineProps(["promocode"]);

const store = userStore();
const qs = require("qs");
const $q = useQuasar();

const rewardProbability = [
  {
    dayRange: "1-7",
    chestType: "Welfare",
    maxReward: "999"
  },
  {
    dayRange: "8-13",
    chestType: "Good Fortune",
    maxReward: "9,999"
  },
  {
    dayRange: "14-29",
    chestType: "Lucky",
    maxReward: "99,999"
  },
  {
    dayRange: "30",
    chestType: "Super",
    maxReward: "999,999"
  }
];

const todayCheckInDay = ref(0);
const chestTotalDays = ref(0);
const hasClaimedToday = ref(false);
const rankingList = ref([]);
const isLoadingClaim = ref(true);
const bonusAmount = ref(0);
const isShowCongratsDialog = ref(false);
const itemRefs = ref([]);
const minValidBet = ref(0);
const totalValidBet = ref(0);

const getChestDesign = (i) => {
  if (i < 8) {
    return 1;
  } else if (i < 14) {
    return 2;
  } else if (i < chestTotalDays.value) {
    return 3;
  }
  return 4;
};

const progressBarWidth = computed(() => {
  if (minValidBet.value === 0) return 0;
  return Math.min((totalValidBet.value / minValidBet.value) * 100, 100);
});

const setDayItemRef = (index) => {
  return (el) => {
    itemRefs.value[index] = el;
  };
};

const scrollToTodayItem = (index) => {
  const item = itemRefs.value[index];
  if (item) {
    item.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }
};

const handleReceiveBonus = async () => {
  store.getBalance();
  isShowCongratsDialog.value = false;

  getDailyCheckInData();
  getRankingList();
};

const getDailyCheckInData = () => {
  eventapi.get("/session/bgd-daily-check-in/init").then((res) => {
    todayCheckInDay.value = res.data.todayCheckInDay;
    chestTotalDays.value = res.data.thisMonthTotalDays;
    totalValidBet.value = res.data.totalValidBet ?? 0;
    minValidBet.value = res.data.minValidBet ?? 0;
    hasClaimedToday.value = res.data.todayClaimed;
    isLoadingClaim.value = false;

    rewardProbability[rewardProbability.length - 2].dayRange = `14-${chestTotalDays.value - 1}`;
    rewardProbability[rewardProbability.length - 1].dayRange = chestTotalDays.value.toString();

    setTimeout(() => {
      scrollToTodayItem(todayCheckInDay.value);
    }, 100);
  });
};

const getRankingList = () => {
  eventapi.post(`/session/bgd-daily-check-in/top-ranking?${props.promocode}`).then((res) => {
    rankingList.value = res.data;
  });
};

const bindEmailDialog = ref(false);
const formDetail = reactive([]);
const phoneRef = ref();
const updatePhoneRef = ref();
const updateEmailRef = ref();
const updateEmailCodeRef = ref();
const captchaRef = ref();
const showCaptchaDialog = ref(false);
const changePhoneDialog = ref(false);
const showVerificationTokenInput = ref(false);
const updateSecurityVerified = reactive({
  mobileNumber: "",
  verificationCode: ""
});
const verificationModalVisible = ref(false);

let verificationCodeID = "";
const startCountdownResendOTP = ref(false);
const countdownOTP = ref();

const claimReward = () => {
  isLoadingClaim.value = true;
  eventapi
    .post("/session/bgd-daily-check-in/check-in")
    .then((res) => {
      if (res.code === 0) {
        bonusAmount.value = res.data;

        isShowCongratsDialog.value = true;
      }

      if (res.code === 582301) {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });

        if (store.phone && !store.email) {
          bindEmailDialog.value = true;
        }

        if (store.email && !store.phone) {
          changePhoneDialog.value = true;
        }
      }
    })
    .catch(() => {})
    .finally(() => {
      isLoadingClaim.value = false;
    });
};

const updateEmailInfo = reactive({
  email: "",
  code: "",
  codeId: ""
});

const submitUpdateEmail = () => {
  updateEmailRef.value.validate();
  updateEmailCodeRef.value.validate();

  if (updateEmailRef.value.hasError || updateEmailCodeRef.value.hasError) {
  } else {
    api
      .post(
        "/session/verifyAndUpdateEmail",
        qs.stringify({
          email: updateEmailInfo.email,
          code: updateEmailInfo.code,
          codeId: updateEmailInfo.codeId
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.emailBindedSuccessfully"),
            icon: "check_circle_outline"
          });
          bindEmailDialog.value = false;
          formDetail.email = updateEmailInfo.email;
          formDetail.emailVerified = true;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const verificationCodeDialog = ref(false);
const openVerificationCodeDialog = () => {
  api
    .get(`/member/checkEmailRegisterStatus?email=${updateEmailInfo.email}`)
    .then((response) => {
      if (response.code === 0) {
        if (response.data) {
          $q.notify({
            color: "negative",
            position: "top",
            message: t("notify.emailAlreadyUsed"),
            icon: "report_problem"
          });
        } else {
          verificationCodeDialog.value = !verificationCodeDialog.value;
        }
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });

  captchaRef.value = "";
  getCode();
};

const onCaptchaSubmit = () => {
  api
    .post(
      `/otp/sendNewEmail`,
      qs.stringify({
        email: updateEmailInfo.email,
        captchaCode: captchaRef.value,
        codeId: updateSecurityVerified.codeId
      })
    )
    .then((res) => {
      let message = res.message,
        color = "positive";

      if (res.code === 0) {
        verificationCodeDialog.value = false;

        updateEmailInfo.codeId = res.data.codeId;

        showVerificationTokenInput.value = true;
        verificationCodeID = res.data.codeId;
        startCountdownResendOTP.value = true;

        countdownOTP.value = 59;
        let timer = setInterval(() => {
          countdownOTP.value -= 1;
          if (countdownOTP.value === 0) {
            clearInterval(timer);
            startCountdownResendOTP.value = false;
          }
        }, 1000);

        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.emailVerificationSent"),
          icon: "check_circle_outline"
        });
      } else color = "negative";

      if (message) $q.notify({ message, color });

      console.log("onCaptchaSubmit", res);
    });
};

const verificationImg = ref("");
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        updateSecurityVerified.codeId = response.data.id;
      }
    })
    .catch((e) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: e.message,
        icon: "report_problem"
      });
    });
};

const updatePhoneInfo = reactive({
  phone: ""
});

const submitUpdatePhone = () => {
  phoneRef.value.validate();

  if (!phoneRef.value.hasError) {
    api
      .post(
        "/session/account",
        qs.stringify({
          phone: updatePhoneInfo.phone
        })
      )
      .then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.phoneUpdatedSuccessfully"),
            icon: "check_circle_outline"
          });

          store
            .getMemberInfo()
            .then(() => {
              loadInfo();
            })
            .finally(() => {
              changePhoneDialog.value = false;
              updatePhoneInfo.phone = "";
            });
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: res.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {});
  }
};

const wishes = Array.from({ length: 16 }, (_, index) =>
  t(`hotPromo.signIn30Days.wish${String(index + 1).padStart(2, "0")}`)
);

const randomWish = ref("");
const generateRandomWish = () => {
  const randomIndex = Math.floor(Math.random() * wishes.length);
  randomWish.value = wishes[randomIndex];
};

onMounted(() => {
  getDailyCheckInData();
  getRankingList();
  getCode();
  generateRandomWish();
});
</script>

<style scoped lang="scss">
.content-card {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px;
  padding: 0 16px 16px;
  margin-top: calc(12px);
  width: 100%;

  .content-card-title {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    img {
      width: 80%;
      margin-top: -2%;
    }
  }
}
.content-table {
  text-align: center;
  font-family: "Manrope", sans-serif;
  font-size: 10px;
  color: #000;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  thead {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

    th {
      color: #076b2c;
      font-weight: 700;
      font-size: 12px;
      min-width: 100px;
    }
  }

  tbody {
    td {
      color: #fff;
      padding: 10px 4px;
      font-size: 12px;
      border: 1px solid #ffffff1a;
    }

    tr {
      background: none !important;
      &:nth-child(even) {
        td {
          background-color: #70bc621a !important;
        }
      }
      &:nth-child(odd) {
        td {
          background-color: transparent !important;
        }
      }

      .player-details {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }
}
.check-in-container {
  padding: 0;

  .header-amt {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-image: url("../../../assets/images/promotion/hotpromo/signin-30days/check-in-header-bg.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    color: #fff96f;
    font-size: 21px;
    font-weight: 700;
    text-align: center;
    padding: 6px 0;
  }

  .check-in-days-visual {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    margin-top: 20px;
    padding: 0 14px;
    height: 90px;
    margin-bottom: 10px;
    .day-card {
      display: flex;
      position: relative;
      background: #9dd29466;
      color: #7be0ac;
      border-radius: 8px;
      width: 50px;
      min-width: 50px;
      height: 70px;
      justify-content: center;
      font-size: 18px;
      span {
        position: absolute;
        top: 0;
        transform: translateY(30%);
      }
      .day-card-img {
        position: absolute;
        bottom: 0;
        transform: translateY(60%);
        height: 40px;
        &.closed {
          width: 40px;
        }
      }
      &.active {
        background: linear-gradient(180deg, rgba(0, 255, 76, 0.6) 0%, rgba(15, 99, 0, 0.6) 100%);
        color: #fff;
        span {
          font-weight: 700;
          font-size: 11px;
          transform: translateY(80%);
        }
      }
    }
  }
}

.check-in-btm {
  padding: 20px 14px;
  .sign-in-btn {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 28px;
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    color: #000;
    span {
      font-size: 16px;
      font-weight: 700;
    }
    &.is-disabled {
      filter: grayscale(100%);
      cursor: not-allowed;
      pointer-events: none;
      color: gray;
    }
    &:active {
      transform: translate(0px, 1px);
      filter: brightness(0.85);
    }
  }

  .bonus-progress-bar {
    height: 8px;
    border-radius: 100px;
    background-color: #ffffff1a;
    margin-top: 10px;

    .bonus-progress-bar-fill {
      height: 100%;
      border-radius: 100px;
      background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
      width: 10%;
    }
  }

  .total-bet-txt {
    margin-top: 6px;
    text-align: end;
  }
}

.reward-mech-container {
  .reward-day-range {
    display: flex;
    margin-top: 4px;
    .day-range-img {
      width: 18px !important;
      height: 18px;
      margin-right: 10px;
    }
  }

  .missed-rules-txt {
    color: #ff0000;
    font-weight: 700;
    font-size: 12px;
    margin-top: 10px;
  }

  .subtitle-img {
    margin: 20px 0 !important;
    width: 80% !important;
    place-self: center;
  }

  .reward-coin-container {
    display: grid;
    grid-template-columns: 6fr 10fr;
    align-items: center;
    padding: 4px;
    .reward-coin {
      height: 16px;
      width: 16px !important;
      margin-right: 8px;
      place-self: flex-end;
    }
    .reward-coin-txt {
      place-self: flex-start;
      color: #00ff80;
    }
  }

  .reward-claim-condition {
    .reward-claim-condition-item {
      margin-top: 4px;
    }
  }
  .misuse-warning-txt {
    color: #c1c400;
    font-weight: 700;
    margin-top: 4px;
  }
}

.activity-rule-container {
  margin: 20px 10px;

  .activity-rule-img {
    margin-bottom: 20px !important;
  }

  .activity-rule-list {
    li {
      color: #fff !important;
      margin-bottom: 4px !important;
    }
  }
}

.ranking-list-container {
  margin-top: 30px;
  .ranking-list-title {
    width: 80% !important;
    place-self: center;
  }
  .podium-div {
    margin-top: 5%;
    padding-top: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    .podium {
      width: 70% !important;
    }
    .medal {
      width: 22% !important;
      flex-direction: column;
      display: flex;
      text-align: center;
      align-items: center;
      position: absolute;
      img {
        width: 50% !important;
      }
    }
    .medal-1 {
      top: 14px;
    }
    .medal-2 {
      top: calc(15% + 14px);
      left: 10%;
    }
    .medal-3 {
      top: calc(21% + 14px);
      right: 12%;
    }
    @media (max-width: 450px) {
      .medal-1 {
        top: calc(3% + 14px);
      }
      .medal-2 {
        top: calc(17% + 14px);
      }
      .medal-3 {
        top: calc(23% + 14px);
      }
    }
    @media (max-width: 400px) {
      .medal-1 {
        top: calc(5% + 14px);
      }
      .medal-2 {
        top: calc(20% + 14px);
      }
      .medal-3 {
        top: calc(26% + 14px);
      }
    }
    @media (max-width: 350px) {
      .medal-1 {
        top: calc(10% + 14px);
      }
      .medal-2 {
        top: calc(25% + 14px);
      }
      .medal-3 {
        top: calc(31% + 14px);
      }
    }
    .medal-txt {
      width: 100%;
      font-size: 0.7rem;
    }
    .ranking-win-coin {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      overflow-wrap: anywhere;
      font-size: 0.7rem;
      img {
        width: 20% !important;
        margin-right: 8px;
      }
    }
  }
  .ranking-list {
    z-index: 2;
    background-color: #042403;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 2px solid #49634a66;
    margin-top: -10%;
    position: relative;
    font-size: 0.9rem;
    .ranking-list-item {
      min-height: 30px;
      display: grid;
      grid-template-columns: 30px 1fr 1fr;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding: 4px;
      img {
        height: 15%;
        width: 15% !important;
        margin-right: 6px;
      }
      .ranking-index {
        padding: 0 10px;
      }
      .icon-txt {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .ranking-list-item:nth-child(even) {
      background-color: #1e371f;
    }
  }
}

.congrats-container {
  background-color: #1e371f;
  border: 1px solid #337e3a;
  border-radius: 10px !important;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible;
  border-radius: 12px;
  margin: 0 20px;

  &:before {
    content: "";
    background-image: url(../../../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -150px;
  }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
    }
  }

  .congrats-chest {
    img {
      display: block;
      width: 90%;
      margin: auto;
      max-width: 190px;
    }
  }

  .congrats-title {
    color: #ffffff;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 16px;
  }

  .congrats-highlight {
    color: #fff96f;
    font-size: 2.75rem;
    text-align: center;
    background-image: url(../../../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 0 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
    font-weight: 900;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.congrats-button {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.receive-btn {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000a01;
}

.pc-form {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;

  .pc-form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;

    &.item-click {
      &:after {
        content: "";
        background: rgba(255, 255, 255, 0.05);
        height: calc(100% - 36px);
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 8px;
      }
    }
  }
  .pc-form-label {
    color: rgba(255, 255, 255, 1);
  }
  .pc-form-input {
    border-radius: 5px;
    position: relative;

    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 4px;
    }

    :deep(.q-field__native) {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .pc-form-side-btn {
    position: relative;
    right: -12px;

    :deep(.q-btn-item) {
      height: 38px;
    }

    &.copy-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>

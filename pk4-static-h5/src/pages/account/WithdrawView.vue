<template>
  <q-page>
    <div class="withdrawal-summary panel">
      <div class="balance">
        <q-skeleton v-if="isLoadingWithdrawalMethod" style="height: 20px" />
        <span v-else class="amount">{{ convertToCommaAmount(store.balance, false) }}</span>
        <div class="title">{{ $t("withdraw.cashBalance") }}</div>
      </div>

      <div class="separator"></div>

      <div class="withdrawable">
        <q-skeleton v-if="isLoadingWithdrawalMethod || isRefreshRemainWager" style="height: 20px" />
        <span v-else class="amount">
          {{
            selectedWithdrawalMethod.withdrawableBalance >= 0
              ? convertToCommaAmount(selectedWithdrawalMethod.withdrawableBalance, false)
              : "0.00"
          }}
        </span>
        <div class="title">{{ $t("withdraw.withdrawable") }}</div>
      </div>
    </div>
    <div ref="targetSection" class="target-section">
      <!-- The section to scroll to -->
    </div>
    <div class="withdraw-section">
      <div class="account-content last">
        <div class="withdrawalmethod">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="withdraw-type-item"
            @click="selectMethod(method, i)"
            :class="{ active: i === activeItem }"
          >
            <span class="promo" v-if="method.recommended">Recommended</span>
            <div class="withdraw-img">
              <img :src="imgURL + '/withdraw/' + method.icon" />
            </div>
            <div class="type-name">{{ method.name }}</div>
          </div>
        </div>
        <q-form v-if="!isSelectedWithdrawalMethodInMaintenance" ref="withdrawFormRef" class="q-mt-md">
          <q-select
            v-show="isLoaded"
            hide-bottom-space
            filled
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="$t('form.withdrawChoose_placeholder')"
            class="withdraw-selection q-mt-sm q-mb-sm"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || $t('form.withdrawChoose_rules_01')]"
            style="background:linear-gradient(90deg, #1C273D 0%, #12192B 100%);border: none;"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey isCentreDialog">
                  {{ $t('withdraw.noAcctAvailable')}}
                  <router-link class="text-positive" to="/account/bank">
                    {{ $t('withdraw.addAcct')}}
                    <!-- {{
                      isUSDT || isEWALLET
                        ? $t("lang.withdraw_add") + " " + chooseCard()
                        : $t("lang.withdraw_bind") + " " + chooseCard()
                    }} -->
                  </router-link>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item class="isCentreDialog" v-bind="scope.itemProps">
                <q-item-section avatar v-if="scope.opt.bankIcon">
                  <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.bankName }} - ****{{
                      scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item-section avatar v-if="scope.opt.bankIcon">
                <img
                  style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                  :src="imgURL + '/payment/' + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.bankName }} - ****{{
                    scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                  }}
                </q-item-label>
              </q-item-section>
            </template>
          </q-select>

          <div class="bot-wrapper-card">
            <div class="bank-card-item" @click="goToBank()">
              <div class="card-label">{{ $t("btn.addNewAccount") }}</div>
            </div>
          </div>

          <!-- <q-input
            hide-bottom-space
            ref="amountRef"
            type="number"
            v-model="withdrawInfo.amount"
            :label="$t('form.withdrawalAmount_placeholder')"
            class="withdraw-field q-mt-sm q-mb-sm"
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.withdraw_please_enter_withdraw_amount'),
              (val) =>
                val >= selectedWithdrawalMethod.withdrawMin || $t('lang.withdraw_please_enter_correct_withdraw_amount'),
              (val) =>
                val <= selectedWithdrawalMethod.withdrawMax || $t('lang.withdraw_please_enter_correct_withdraw_amount'),
              (val) => (val && /^([1-9][0-9]*)$/.test(val)) || $t('lang.withdraw_amt_no_decimal_allow'),
              isValidUSDTAmt
            ]"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 18px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 18px" class="text-bright">
                <q-btn
                  @click="updateWithdrawAmt"
                  no-caps
                  :label="$t('lang.withdraw_withdrawallamount')"
                  color="brightbtn"
                />
              </span>
            </template>
          </q-input> -->

          <!-- <div
            class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
            style="border-bottom: 1px solid #434343"
            v-show="selectedWithdrawalMethod"
          >
            <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
              {{
                $t("lang.withdraw_singlewithdrawal") +
                ": " +
                selectedWithdrawalMethod.withdrawMin.toLocaleString() +
                "RS - " +
                selectedWithdrawalMethod.withdrawMax.toLocaleString() +
                "RS"
              }}
              <br />
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
              {{
                $t("lang.withdraw_withdrawtoday") +
                ": " +
                selectedWithdrawalMethod.withdrawMaxAmount.toLocaleString() +
                "RS"
              }}
            </template>
            <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
              <br />
              {{
                " " +
                $t("lang.withdraw_remaining") +
                ": " +
                selectedWithdrawalMethod.withdrawMaxTimes +
                " " +
                $t("lang.withdraw_times")
              }}
            </template>
          </div> -->

          <InputRowGrid>
            <template #fields>
              <InputField :isDark="true"
                :label="`${$t('form.withdrawalAmount')} (${convertToCommaAmount(selectedWithdrawalMethod.withdrawMin)} -
          ${convertToCommaAmount(selectedWithdrawalMethod.withdrawMax)} RS)`"
              >
                <template #input>
                  <q-input
                    type="number"
                    ref="amountRef"
                    outlined
                    clearable
                    :placeholder="$t('form.withdrawalAmount_placeholder')"
                    v-model="withdrawInfo.amount"
                    :rules="[
                      (val) => !!val || $t('form.withdrawalAmount_rules_01'),
                      (val) => val > 0 || $t('form.withdrawalAmount_rules_02'),
                      (val) =>
                        val <= selectedWithdrawalMethod.withdrawableBalance || $t('form.withdrawalAmount_rules_03'),
                      (val) =>
                        (val >= selectedWithdrawalMethod.withdrawMin && val <= selectedWithdrawalMethod.withdrawMax) ||
                        `${$t('form.withdrawalAmount_rules_04')} ${selectedWithdrawalMethod.withdrawMin} - ${
                          selectedWithdrawalMethod.withdrawMax
                        }`,
                      (val) => Number.isInteger(+val) || $t('form.withdrawalAmount_rules_05')
                    ]"
                    hide-bottom-space
                  ></q-input>
                </template>
              </InputField>
            </template>
          </InputRowGrid>

          <div class="bot-wrapper panel">
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">
                  <img src="../../assets/images/account/withdraw-amt.svg" />
                  {{ $t("withdraw.withdrewAmount") }}
                </div>
              </div>
              <div class="desc">
                <img src="../../assets/images/account/right-green.svg" />
                <span>RS:{{ convertToCommaAmount(selectedWithdrawalMethod.withdrawAmount) }}</span>
              </div>
            </div>

            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">
                  <img src="../../assets/images/account/remain-wagers.svg" />
                  {{ $t("withdraw.remainWagers") }}
                </div>
              </div>
              <div class="desc remain-wager-wrapper" @click="refreshRemainWager">
                <img src="../../assets/images/account/right-green.svg" />
                <q-spinner v-if="isRefreshRemainWager" />
                <span v-else>RS:{{ convertToCommaAmount(selectedWithdrawalMethod.remainWagers) }}</span>
                <img
                  class="refresh-btn-img"
                  :class="{ rotate: isRefreshRemainWager }"
                  src="../../assets/images/account/refresh-icon.svg"
                />
              </div>
            </div>

            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">
                  <img src="../../assets/images/account/withdraw-max.svg" />
                  {{ $t("withdraw.withdrawMaxAmount") }}
                </div>
              </div>
              <div class="desc" style="color: #fbab1b">
                RS:{{ convertToCommaAmount(selectedWithdrawalMethod.withdrawMaxAmount) }}
              </div>
            </div>
          </div>

          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 2">{{ $t("form.realTimeExchangeRates") }}:</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center; color: #17cd27">
              <span style="flex: 1">{{ $t("form.estimatedArrival") }}：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{
                  selectedWithdrawalMethod &&
                  (withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin ||
                    (
                      withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                      selectedWithdrawalMethod.withdrawFee
                    ).toFixed(2) < 0)
                    ? "0.00"
                    : (
                        withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                        selectedWithdrawalMethod.withdrawFee
                      ).toFixed(2)
                }}
                USDT
              </span>
            </div>
          </div>
          <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
          <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
          <!--          </div>-->
          <div v-else-if="isEWALLET">
            <div class="q-mt-sm text-neontb">{{ $t("lang.withdraw_ewalletspecialnote") }}</div>
            <div class="q-mt-sm q-mb-sm text-center">
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial(selectedWithdrawalMethod.code)"
                :label="tutorialLabel()"
              />
            </div>
          </div>

          <div class="q-mt-sm text-neontb" v-if="selectedWithdrawalMethod.withdrawFee">
            {{ $t("form.usdtSpecialNote", { fee: selectedWithdrawalMethod.withdrawFee }) }}
          </div>
          <!-- <a-form-item
            class="select"
            name="cardId"
            label="Select Bank Card"
            :rules="[{ required: true, message: 'Please select a bank card' }]"
          >
            <a-select
              v-model:value="withdrawInfo.cardId"
              placeholder="Please select a bank card"
            >
              <a-select-option
                v-for="b in withdrawState.bankCardList"
                :key="b.id"
                :value="b.id"
              >
                {{ b.bankName }} - {{ b.cardNumber }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
        </q-form>
      </div>
    </div>

    <template v-if="!isSelectedWithdrawalMethodInMaintenance">
      <template v-if="withdrawState.bankCardList.length > 0">
        <div class="bottom-btn">
          <q-btn
            no-caps
            unelevated
            class="btn-primary btn-primary__full"
            :loading="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
            @click="submitWithdraw"
          >
            {{ $t("btn.submit") }}
          </q-btn>
          <!--
          <div class="q-mt-sm">
            {{ $t("withdraw.withdrawTutorial") }}
            <span class="tutorial-link" @click="isWithdrawTutorial = true">Picture</span>
            /
            <span class="tutorial-link" @click="openWithdrawTutorialVideo">Video</span>
          </div>
          -->
        </div>
      </template>
      <template v-else>
        <div class="bottom-btn">
          <q-btn
            no-caps
            unelevated
            class="btn-primary btn-primary__full"
            :loading="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
            @click="submitWithdraw"
          >
            {{ $t("btn.submit") }}
          </q-btn>
        </div>
      </template>
      <div v-if="selectedWithdrawalMethod.tips" class="q-mt-md q-mb-sm" v-html="selectedWithdrawalMethod.tips"></div>

      <div class="q-mt-sm step-desc-div q-mb-lg">
        <p>
          {{ $t("withdraw.withdrawTutorial") }}
          <span class="tutorial-link" @click="isWithdrawTutorial = true">{{ $t('withdraw.picture')}}</span>
          /
          <span class="tutorial-link" @click="openWithdrawTutorialVideo">{{ $t('withdraw.video')}}</span>
        </p>
        <p>1. {{ $t('withdraw.bindCardCorrectFormat') }}</p>
        <p>2. {{ $t('withdraw.dailyWalletLimit') }}</p>
        <p>
          3. {{ $t('withdraw.donotexceeddaily') }}
        </p>
        <p>4.{{ $t('withdraw.blockchainwithdrawfast')}}</p>
      </div>
    </template>

    <!-- <MediaSettingsComponent /> -->

    <q-dialog v-model="hasWithdrawCard" persistent>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section class="q-mb-md">
          <div class="text-h6 text-center">{{ $t("lang.msg_bind_card_first") }}</div>
        </q-card-section>

        <div class="flex flex-center">
          <router-link to="/account">
            <q-btn class="q-mr-md" :label="$t('lang.msg_cancel')" />
          </router-link>
          <router-link to="/account/withdraw">
            <q-btn color="brightbtn" :label="$t('lang.msg_bind')" />
          </router-link>
        </div>
      </q-card>
    </q-dialog>
  </q-page>

  <q-dialog class="modal-common-div" width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents">
        <strong class="black-titles">{{ $t("lang.withdraw_tipstitle") }}</strong>
        <br />
        <br />
        {{ $t("lang.withdraw_tipdesc") }}
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" no-caps :label="$t('lang.withdraw_proceedverify')" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isWithdrawTutorial">
    <q-card style="width: 90%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <div class="close-alert" v-close-popup>
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <img src="../../assets/images/account/tutorial-withdraw.jpg" class="tutorial-img" width="100%" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="guestKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="goBackPage" v-close-popup />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="goBackPage" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="checkCloseUserKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="errorDialog" persistent>
    <q-card class="q-pa-md error-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t("error.10008") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        {{ $t("error.12105") }}
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat :label="$t('btn.confirm')" v-close-popup /> -->
        <q-btn no-caps unelevated class="q-mt-md btn-primary btn-primary__full" v-close-popup>
          {{ $t("btn.confirm") }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="displayMaintenanceDialog">
    <q-card class="q-pa-md">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <i18n-t keypath="withdraw.withdrawalMethodInMaintenance" tag="span">
          <template #startTime>
            {{ selectedWithdrawalMethodMaintenanceDateRange[0] }}
          </template>
          <template #endTime>
            {{ selectedWithdrawalMethodMaintenanceDateRange[1] }}
          </template>
        </i18n-t>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn no-caps unelevated v-close-popup>{{ $t("btn.confirm") }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <AdditionalSteps
    v-if="isAdditionalWithdrawSteps"
    :currentAdditionalStep="currentWithdrawStep"
    :currentType="'withdraw'"
    @updateStep="handleStepUpdate"
    @closeGuide="closePlayerGuide"
  />
</template>

<script setup>
/* eslint-disable */
import { defineComponent, watch, nextTick, reactive, ref, onActivated, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import AcctBal from "../../components/AcctBal.vue";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
import { convertToCommaAmount } from "src/boot/utils";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { useRoute, useRouter } from "vue-router";
import KYCGuestForm from "../../components/KYCGuestForm.vue";
import KYCUserForm from "../../components/KYCUserForm.vue";
import { useCheckKYC } from "src/hooks/checkKYC";
import AdditionalSteps from "../../components/modal/AdditionalSteps.vue";

import { usePromoStore } from "src/stores/promo";
// import MediaSettingsComponent from "../../components/MediaSettingsComponent.vue";

const promoStore = usePromoStore();
const router = useRouter();
const store = userStore();
const isNewUser = ref(false);
const { t } = useI18n();
const $q = useQuasar();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

const kycUserFormRef = ref(null);

const { userKYCDialog, guestKYCDialog, closeGuestKYCDialog, closeUserKYCDialog } = useCheckKYC(
  ["mounted", "activated"],
  kycUserFormRef
);

const amountRef = ref();
const withdrawPwdRef = ref();
const cardRef = ref();
const activeItem = ref(0);
const withdrawFormRef = ref(null);
const withdrawState = reactive({
  bankCardList: []
});
const qs = require("qs");
const withdrawInfo = reactive({
  cardId: undefined,
  amount: ""
  // withdrawPassword: ""
});
const isLoaded = ref(false);
const hasWithdrawCard = computed(() => {
  return isLoaded == true && withdrawState.bankCardList.length === 0;
});
const withdrawalMethods = ref([]);
const selectedWithdrawalMethod = ref([]);
const isRefreshRemainWager = ref(false);

const checkCloseUserKYCDialog = () => {
  closeUserKYCDialog();

  const completedGuide = localStorage.getItem("completedwithdrawguide");
  if (route.query.isNewPlayer && completedGuide !== "true") {
    isAdditionalWithdrawSteps.value = true;
  }
};

const refreshRemainWager = () => {
  isRefreshRemainWager.value = true;

  api
    .get("/session/withdraw/withdrawableBalance/refresh")
    .then((res) => {
      if (res.code === 0) {
        selectedWithdrawalMethod.value = {
          ...selectedWithdrawalMethod.value,
          ...res.data
        };
      }
    })
    .finally(() => {
      isRefreshRemainWager.value = false;
    });
};

const checkNewUser = () => {
  if (store.phone == "") {
    isNewUser.value = true;
  } else {
    getWithdrawalMethods();
  }
};
const isAdditionalWithdrawSteps = ref(false);

const goBackPage = () => {
  // if (route.query.isNewPlayer) {
  //   setTimeout(() => {
  //     userKYCDialog.value = true;
  //   }, 250);
  // } else {
  //
  // }
  localStorage.setItem(`completedwithdrawguide`, JSON.stringify(true));
  router.go(-1);
};

onMounted(() => {
  checkNewUser();
  store.getBalance();
  // loadPlatform()

  const completedGuide = localStorage.getItem("completedwithdrawguide");
  if (route.query.isNewPlayer && completedGuide !== "true" && userKYCDialog.value === false) {
    isAdditionalWithdrawSteps.value = true;
  }
});

onActivated(() => {
  checkNewUser();
  store.getBalance();
  promoStore?.removeShownFloatingOrDialogList?.("newplayer-spin-wheel");
  // loadPlatform()
});

const platforms = reactive([]);
const loadPlatform = () => {
  api.get("/platform").then((res) => {
    res.data.forEach((p) => {
      if (p.walletType !== "SEAMLESS") {
        platforms.push({
          id: p.id,
          code: p.code,
          amount: 0
        });
      }
    });
    refreshBalance("all");
  });
};
const refreshBalance = (plat) => {
  if (plat === "all") {
    platforms.forEach((platform) => {
      platform.isLoading = true;
      if (platform.code) {
        api
          .get("/session/balance", { params: { platform: platform.code } })
          .then((res) => {
            if (platform) {
              platform.amount = res.data;
              platform.isLoading = false;
            }
          })
          .catch((e) => {
            platform.isLoading = false;
          });
      }
    });
  }
};

const errorDialog = ref(false);

const submitWithdraw = async () => {
  cardRef.value.validate();
  amountRef.value.validate();
  $q.loading.show({
    message: "Withdrawing..."
  });
  if (cardRef.value.hasError || amountRef.value.hasError) {
    $q.loading.hide();
  } else {
    console.log("");
    api
      .post("/session/withdraw/", qs.stringify(withdrawInfo))
      .then((response) => {
        console.log(response.code);
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t('notify.withdrewSuccessfully'),
            icon: "check_circle_outline"
          });
          getWithdrawalMethods();
          store.getBalance();

          // FB tracking :: apply-withdrawal
          if (store.isFbPixel) {
            fbq("track", "apply-withdrawal");
          }

          if (store.isTkPixel) {
            ttq.track("apply-withdrawal", { content_type: "product" }, { event_id: Date.now() });
          }

          withdrawInfo.amount = "";
          // withdrawInfo.withdrawPassword = "";
          if (amountRef.value) {
            setTimeout(() => {
              amountRef.value.resetValidation();
            }, 0);
          }
        } else if (response.code === 12105) {
          errorDialog.value = true;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {});
    $q.loading.hide();
  }
};

// const submitWithdraw = () => {
//   cardRef.value.validate();
//   amountRef.value.validate();
//   withdrawPwdRef.value.validate();
//   $q.loading.show({
//     message: "Withdrawing..."
//   });
//   if (cardRef.value.hasError || amountRef.value.hasError || withdrawPwdRef.value.hasError) {
//     $q.loading.hide();
//   } else {
//     api
//       .post("/session/withdraw/", qs.stringify(withdrawInfo))
//       .then((response) => {
//         if (response.code === 0) {
//           $q.notify({
//             color: "positive",
//             position: "top",
//             message: t("lang.msg_submit_successful"),
//             icon: "check_circle_outline"
//           });
//           getWithdrawalMethods();

//           // FB tracking :: apply-withdrawal
//           if (store.isAffiliateA) {
//             fbq("track", "apply-withdrawal");
//           }

//           withdrawInfo.amount = "";
//           withdrawInfo.withdrawPassword = "";
//           if (amountRef.value) {
//             setTimeout(() => {
//               amountRef.value.resetValidation();
//             }, 0);
//           }
//         } else {
//           $q.notify({
//             color: "negative",
//             position: "top",
//             message: response.message,
//             icon: "report_problem"
//           });
//         }
//       })
//       .catch((error) => {
//         console.log("error", error);
//         // $q.notify({
//         //   color: "negative",
//         //   position: "top",
//         //   message: response.message,
//         //   icon: "report_problem"
//         // });
//       });
//     $q.loading.hide();
//   }
// };
const isUSDT = ref(false);
const isEWALLET = ref(false);
const isALIPAY = ref(false);

const selectMethod = (method, index) => {
  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  selectedWithdrawalMethod.value = method;
  withdrawInfo.withdrawCode = method.code;
  displayMaintenanceDialog.value = method.status === false;
  isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
  isEWALLET.value =
    withdrawInfo.withdrawCode.includes("KDPAY") ||
    withdrawInfo.withdrawCode.includes("EBPAY") ||
    withdrawInfo.withdrawCode.includes("OKPAY");
  isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
  activeItem.value = index;
  loadCards();
};

const loadCards = () => {
  withdrawState.bankCardList = [];
  api
    .get("/session/bankCard")
    .then((response) => {
      isLoaded.value = true;
      if (response.code === 0) {
        // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
        response.data.forEach((element) => {
          if (element.bankType === "BANK") {
            if (element.bankCode !== "alipay" && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
              withdrawState.bankCardList.push(element);
            }
            if (element.bankCode === "alipay" && selectedWithdrawalMethod.value.code === "ALIPAY") {
              withdrawState.bankCardList.push(element);
            }
          } else {
            if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
              withdrawState.bankCardList.push(element);
            }
          }
        });
        // else {
        //   response.data.forEach(element => {
        //     if (element.bankId !== 39) {
        //       withdrawState.bankCardList.push(element)
        //     }
        //   });
        // }

        if (cardRef.value) {
          cardRef.value.resetValidation();
        }
        withdrawInfo.amount = "";
        if (amountRef.value) {
          setTimeout(() => {
            amountRef.value.resetValidation();
          }, 0);
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const isSelectedWithdrawalMethodInMaintenance = computed(() => selectedWithdrawalMethod.value.status === false);
const displayMaintenanceDialog = ref(false);
const selectedWithdrawalMethodMaintenanceDateRange = computed(() =>
  isSelectedWithdrawalMethodInMaintenance.value ? selectedWithdrawalMethod.value.remark.split(" | ") : []
);

const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  api
    .get("/session/withdraw/entrance")
    .then((response) => {
      if (response.code === 0) {
        // withdrawalMethods.value = response.data;
        withdrawalMethods.value = response.data.filter((item) => item.status === true);
        //Remove this for real data
        // withdrawalMethods.value = [
        //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
        //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
        if (withdrawalMethods.value.length > 0) {
          selectMethod(withdrawalMethods.value[0], 0);
        }
      } else {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: response.message,
        //   icon: "report_problem"
        // });
      }
    })
    .finally(() => (isLoadingWithdrawalMethod.value = false));
};
const updateWithdrawAmt = () => {
  withdrawInfo.amount = JSON.stringify(Math.floor(store.balance));
};

const chooseLabel = () => {
  if (isUSDT.value) {
    return t("lang.withdraw_crypto");
  } else if (isEWALLET.value) {
    return t("lang.withdraw_ewallet");
  } else {
    return t("lang.withdraw_bankcard");
  }
};

const isValidUSDTAmt = (val) => {
  if (!isUSDT.value) {
    return true;
  }
  const usdtPattern = /^([1-9][0-9]*)$/;
  return usdtPattern.test(withdrawInfo.amount) || "金额应为正数";
};

const chooseCard = () => {
  if (isUSDT.value) {
    return t("lang.withdraw_virtualwallet");
  } else if (isEWALLET.value) {
    return t("lang.withdraw_ewallet");
  } else {
    return t("lang.withdraw_bankcard");
  }
};
const tutorialLabel = () => {
  if (selectedWithdrawalMethod.value.code === "KDPAY") {
    return "K豆教程视频";
  } else if (selectedWithdrawalMethod.value.code === "EBPAY") {
    return "EB教程视频";
  } else if (selectedWithdrawalMethod.value.code === "OKPAY") {
    return "OK教程视频";
  }
};
const openEWalletTutorial = (code) => {
  const urlMap = {
    KDPAY: "http://jiaocheng.kdpay123.com/",
    EBPAY: "https://www.ebpay24.com/",
    OKPAY: "https://me-qr.com/l/okpay"
  };

  const url = urlMap[code];
  if (url) {
    window.open(url);
  }
};

const isLoadingBankCard = ref(false);
const isLoadingWithdrawalMethod = ref(false);
const isSubmitDisable = ref(false);
const route = useRoute();
const goToBank = () => {
  router.push("/account/bank?from=" + route.path);
};

const isWithdrawTutorial = ref(false);
const langSelect = localStorage.getItem("languageLocale") ?? "";

const openWithdrawTutorialVideo = () => {
  window.open("https://drive.google.com/file/d/1yOJgpa4C9y7XFDacL52f4MoQ1lLw3Pm-/view?usp=drivesdk", "_blank");
  // if (langSelect === "ur") {
  //   window.open("https://drive.google.com/file/d/1l35uyEQNp798iYAfuLvKFf_O56fl5ZIb/view?usp=sharing", "_blank");
  // } else {
  //   window.open("https://drive.google.com/file/d/1u796pIy2tqdLtRIqfGRDAQgKWa1guIG2/view?usp=sharing", "_blank");
  // }
};
const closePlayerGuide = () => {
  isAdditionalWithdrawSteps.value = false;
  if (currentWithdrawStep.value === 4) {
    localStorage.setItem("newPlayerGuide", "4");
  }
  enableScroll();
};
const enableScroll = () => {
  document.body.style.overflow = ""; // Restore scrolling
};
const currentWithdrawStep = ref(2);
const handleStepUpdate = (newStep) => {
  currentWithdrawStep.value = newStep;
};
const targetSection = ref();
watch(
  () => currentWithdrawStep.value,
  (newVal) => {
    if (newVal === 3) {
      nextTick(() => {
        setTimeout(() => {
          if (targetSection.value && currentWithdrawStep.value === 3) {
            const offset = 80;
            const rect = targetSection.value.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const finalPosition = rect.top + scrollTop - offset;

            window.scrollTo({
              top: finalPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.withdrawal-modal-view {
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 152px);

  .bank-account-container {
    border-radius: 0.5rem;
    background: rgba(21, 0, 37, 0.2);
    padding: 1rem;
    margin-top: 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;
      .title {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      background: rgba(46, 48, 52, 0.4);
      margin: 0 -1rem 0.5rem -1rem;
      padding: 0 1rem;
    }
  }

  .withdrawal-amount-container {
    border-radius: 0.5rem;
    background: rgba(21, 0, 37, 0.2);
    padding: 8px 0;
    margin-top: 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;
      .title {
        color: #637387;
        font-size: 14px;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      background: #263349;
      border-radius: 0.5rem;
      margin: 0 0 0.5rem 0;
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 1rem 0 0.5rem 0;

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        color: white;
        border-radius: 3.125rem;
        // opacity: 0.8;
        // background: linear-gradient(90deg, #157f42 -1.25%, rgba(44, 97, 67, 0) 104.06%);
        // background: linear-gradient(90deg, #13f129 -1.25%, #131313 104.06%);

        // padding: 5px 10px;
        // text-transform: uppercase;

        .desc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .desc {
          font-size: 0.825rem;
          font-weight: 400;
        }
      }
    }
  }

  .btn-submit {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    height: 46px;
    width: 100%;
    transition: 0.3s all;
    color: #ffffff;
    margin: auto;
    border-radius: 6px;
    background: #5c46e7;
    aspect-ratio: 335/46;

    &:before {
      box-shadow: none;
    }

    &.disabled {
      opacity: 0.7;
    }
  }

  .bottom-tnc {
    font-size: 80%;
    opacity: 0.5;
  }
}

.bottom-btn {
  margin-top: auto;
  padding: 20px 15px 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 468px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #24262b;
}

.tutorial-link {
  color: #21a7ef;
  text-decoration: underline;
}
.step-desc-div {
  margin-bottom: 105px;
  color: #B2BDBF;

  p {
    margin: 5px 0px;
  }
}

.close-alert {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1;
}

.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  overflow-x: unset;
  padding: 0px 5px;
  grid-gap: 10px;
  grid-column-gap: 10px;
  grid-row-gap: 5px;

  .withdraw-type-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      // background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
       background: #192234;
      padding: 5px;
      border-radius: 10px;
    }

    &.active {
      // background: #212534;
      // color: #db7e42;
      // box-shadow: none;
      // filter: drop-shadow(0px 0px 3px #ffffff);
      img {
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
      }

      .type-name {
        font-weight: bold;
      }

      // img {
      //   border: 2px solid #33bcd4;
      // }
    }

    .type-name {
      line-height: 15px;
      // overflow-wrap: break-word;
      white-space: nowrap;
    }

    .promo {
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      top: -8px;
      right: -1px;
      background: linear-gradient(to right, #de4545, #db7e42);
      padding: 5px;
      color: #ffffff;
      font-size: 12px;
      line-height: 10px;
      border-radius: 0 10px;
      font-weight: bold;

      ::after {
        position: relative;
      }
    }
  }

  .withdraw-btn {
    margin: 30px auto;

    &.cancel {
      margin-right: 60px;
    }
  }
}

.bot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // gap: 20px;
  margin: 1rem 0 0.5rem 0;
  padding: 10px;
  border-radius: 10px;
  
  :not(:last-child) {
    margin-bottom: 5px;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: white;
    border-radius: 3.125rem;
    font-size: 16px;
    :not(:last-child) {
      margin-right: 20px;
    }
    // opacity: 0.8;
    // // background: linear-gradient(90deg, #157f42 -1.25%, rgba(44, 97, 67, 0) 104.06%);
    // // background: linear-gradient(90deg, #13f129 -1.25%, #131313 104.06%);
    // padding: 5px 10px;
    // text-transform: uppercase;

    .desc-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: #b2bdbf;
      font-weight: 700;
      .desc {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: 2%;
        text-transform: capitalize;

        img {
          margin-right: 5px;
        }
      }
    }

    .desc {
      font-size: 0.925rem;
      font-weight: 400;
      display: flex;
      gap: 5px;
      justify-content: center;
      align-items: center;
      span {
        color: #21a7ef;
        &.orange {
          color: #fbab1b;
        }
      }
      .refresh-btn-img {
        width: 20px;
        height: 20px;

        &.rotate {
          animation: rotateTwice 1s infinite linear;
        }
      }
    }

    .remain-wager-wrapper {
      display: flex;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      color: #21ef89;
    }
  }
}

.withdrawal-summary {
  padding: 16px;
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 0.625rem;
  width: 100%;

  text-align: center;
  font-family: "Manrope", sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  aspect-ratio: 335/82;

  .balance {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 15px 0;
    // margin: 0 0 0 1rem;
  }

  .amount {
    font-size: 140%;
    font-weight: 700;
  }

  .withdrawable {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 15px 0;
    // margin: 0 1rem 0 0;
  }

  .separator {
    width: 2px;
    height: 90%;
    background: rgba(255, 255, 255, 0.05);
  }

  .title {
    color: #9f9f9f;
  }

  span {
    color: white;
  }
}

.bot-wrapper-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0 0.5rem 0;

  .bank-card-item {
    // padding: 8px;
    // border-radius: 8px;
    // position: relative;
    // transition: 0.3s all;
    // width: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // color: #150025;
    // background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
    // box-shadow: 0px 2px 0px 0px #1cca6a;
    // text-transform: uppercase;
    
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
    color: #fff;
    font-weight: 700;
    border-radius: 12px;
    padding: 5px;
    min-width: 68px;
    text-transform: uppercase;
    .card-label {
      font-size: 1.2rem;
      font-weight: 700;
    }

    .card-icon {
      width: 50px;
      margin-bottom: 0.25rem;
      display: flex;
      justify-content: center;
    }
  }
}

.error-dialog {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
}
</style>

<style lang="scss"> 
.q-field__control, .q-field__marginal {
  height: auto !important;
}
</style>

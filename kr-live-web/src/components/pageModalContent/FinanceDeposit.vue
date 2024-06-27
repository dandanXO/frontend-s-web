<template>
  <div class="page-container">


    <div class="form-wrapper">
      <div v-if="!isDisplay">

        <ReminderText :reminderText="$t('lang.deposit_reminder_text')" />

        <div class="deposit-options">
          <div class="lil-title">{{ $t('lang.deposit_payment_channel') }}</div>
          <div class="deposit-option-container">
            <div class="node-wrapper">
              <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect"
                :isFetchingApi="isFetchingApi" />
            </div>
          </div>
        </div>
      </div>

      <div class="inner-cont" v-if="isDisplay" style="overflow: auto">
        <div style="text-align: center">입금하기</div>
        <div class="submit-message">
          <div class="line">
            <span>은행 이름:</span>
            <div class="copy-wrapper">
              <textarea rows="1" readonly class="info" ref="subMsg0" :value="submitMessage[0]"
                v-on:focus="$event.target.select()" />
              <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('0')">
                {{ copybtntxt0 }}
              </q-btn>
            </div>
          </div>
          <div class="line">
            <span>이름:</span>
            <div class="copy-wrapper">
              <textarea rows="1" readonly class="info" ref="subMsg1" :value="submitMessage[1]"
                v-on:focus="$event.target.select()" />
              <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('1')">
                {{ copybtntxt1 }}
              </q-btn>
            </div>
          </div>
          <div class="line">
            <span>은행 계좌:</span>
            <div class="copy-wrapper">
              <textarea rows="1" readonly class="info" ref="subMsg2" :value="submitMessage[2]"
                v-on:focus="$event.target.select()" />
              <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('2')">
                {{ copybtntxt2 }}
              </q-btn>
            </div>
          </div>
          <div class="line">
            <span>은행지점:</span>
            <div class="copy-wrapper">
              <textarea rows="1" readonly class="info" ref="subMsg4" :value="submitMessage[4]"
                v-on:focus="$event.target.select()" />
              <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('4')">
                {{ copybtntxt4 }}
              </q-btn>
            </div>
          </div>
          <div class="line">
            <span>입금 금액:</span>
            <div class="copy-wrapper">
              <textarea rows="1" readonly class="info" ref="subMsg3" :value="submitMessage[3]"
                v-on:focus="$event.target.select()" />
              <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('3')">
                {{ copybtntxt3 }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else>
        <q-form ref="depositForm" class="content-form form-template">
          <div class="form-item">
            <label>{{ $t('lang.deposit_deposit_amount') }}</label>
            <q-skeleton v-if="isFetchingApi" type="QInput" />
            <template v-else>
              <q-input dense outlined v-if="amountList.length === 0" ref="depositAmtRef"
                :placeholder="isUSDT ? 'USDT 금액을 입력하세요' : '입금 금액을 입력하세요'" class="deposit-field" name="localAmount"
                v-model="depositAmountFormatted" :rules="verifyDepositAmount" clearable>
                <template v-slot:prepend>
                  <span style="z-index:1;font-size:16px;" class="text-bright">
                    <template v-if="isUSDT">USDT</template>
                    <template v-else>{{ store.currency.value }}</template>
                  </span>
                </template>
              </q-input>
              <q-select v-else ref="depositAmtRef" label="금액 선택" name="localAmount" class="deposit-selection" outlined
                color="accent" :options="amountList" v-model="form.localAmount" :rules="verifyDepositAmount"
                padding="none">
                <template v-slot:prepend>
                  <span style="font-size: 26px" class="text-bright">
                    {{ store.currency.value }}
                  </span>
                </template>
              </q-select>
            </template>

            <q-skeleton type="text" v-if="isFetchingApi" />
            <div v-else class="text-grey text-bold text-caption">
              {{ $t('lang.deposit_deposit_unit') }}：{{
                calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value === "₩" ? "만"
                  :
                  store.currency.value) : 0
              }}
              -
              {{ activeMethod.depositMax ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value ===
                "₩"
                ? "만" :
                store.currency.value) : " " }}
            </div>

            <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-xs" label="환율">
              <span class="text-positive">
                1.00 USDT ≈ {{ activeMethod.currencyRate }}
                {{ store.currency.value }}
              </span>
            </div>

            <div class="select-amt-btn-wrapper">
              <template v-for="(item, index) in countOptions" :key="index">
                <q-skeleton v-if="isFetchingApi" type="QBtn" />
                <q-btn dense v-else class="select-amt-btn" :key="index"
                  :label="isUSDT ? `${item} USDT` : item + $t('lang.deposit_ten_thousand_won')"
                  @click="selectAmt(item)"></q-btn>
              </template>
              <q-skeleton v-if="isFetchingApi" type="QBtn" />
              <q-btn dense v-else class="select-amt-btn active" :label="$t('lang.deposit_clear_amount')"
                @click="clearInfo"></q-btn>
            </div>
          </div>

          <div class="form-item" v-if="selectedPayType && bankCardList.length">
            <label>입금계좌</label>
            <BankComponent ref="payTypeClass" :is="selectedPayType" class="deposit-select-bank" v-model="form.bankId"
              :bank-list="bankCardList" @selected="selectedBank" @successful="isDeposited = true"></BankComponent>
          </div>

          <q-select ref="offerRef" class="deposit-selection q-mt-xs" label="할인 선택" outlined
            :options="unselectedPrivileges" v-model="selectedPrivilege" emit-value v-if="hasPrivilege && !isUSDT"
            :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`" clearable
            @update:model-value="checkMinDepositAmt">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label style="text-overflow: ellipsis; overflow: auto; white-space: nowrap">
                    {{ scope.opt.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="form-item">
            <label>{{ $t('lang.deposit_depositor_name') }}</label>
            <q-skeleton v-if="isFetchingApi" type="QInput" />
            <q-input v-else dense v-model="depositAccName" class="account-name-field" outlined readonly />
          </div>

          <div class="q-mt-sm" v-html="activeMethod.msg"></div>
        </q-form>
      </div>
    </div>

    <div class="action-buttons">
      <q-btn v-if="isDisplay" class="primary-button blue" :label="'신청완료'" v-close-popup />
      <q-btn v-else class="primary-button blue" @click="confirmDeposit" :label="$t('lang.deposit_confirm_deposit')" />
    </div>
  </div>
</template>

<script setup id="FinanceDeposit">
import { ref, onMounted, reactive, shallowRef, watch } from "vue";
import { userStore } from "src/stores";
import { useRouter, useRoute } from "vue-router";
import Node from "../../components/paymentSelect/node.vue";
import BankComponent from "../../components/finance/fBank";
import { cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import liff from "@line/liff";
import { storeToRefs } from "pinia";
import ReminderText from 'components/finance/ReminderText';
import { useI18n } from "vue-i18n";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const calculatedMinDeposit = ref("");
const isDeposited = ref(false);
const btnLoading = ref(false);
const payTypeClass = ref();
const payMethods = ref([]);
const activeMethod = ref({});
const bankCardList = ref([]);
const countOptions = ref([1, 5, 10, 50, 100, 500, 1000]);
const amountList = ref([]);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const subMsg4 = ref();

const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isUSDT = ref(false);
const depositForm = ref(null);
const privilegeList = ref([]);
const unselectedPrivileges = ref([]);
const selectedPrivilege = ref("");

const copybtntxt0 = ref("복사");
const copybtntxt1 = ref("복사");
const copybtntxt2 = ref("복사");
const copybtntxt3 = ref("복사");
const copybtntxt4 = ref("복사");

const depositAmtRef = ref("");
const { realName } = storeToRefs(store);
const depositAccName = realName;

const extensionState = ref(false);
const isFetchingApi = ref(false);

const form = reactive({
  paymentId: null,
  privilegeId: null,
  localAmount: null,
  bankId: null
});

const copyMessage = (position) => {
  if (position === '0') {
    subMsg0.value.focus();
  } else if (position === '1') {
    subMsg1.value.focus();
  } else if (position === '2') {
    subMsg2.value.focus();
  } else if (position === '3') {
    subMsg3.value.focus();
  } else if (position === '4') {
    subMsg4.value.focus();
  }

  document.execCommand('copy');

  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4];
  copybtntxt[position].value = "복사됨";
};

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4];
  copybtntxt.forEach((element) => {
    element.value = "복사";
  });
};

const depositAmountFormatted = ref('');

const parseDigitsWithComma = (value) => {
  const depositAmount = value?.replace(/\$\s?|(,*)/g, '');
  return depositAmount;
}

watch(() => depositAmountFormatted.value, () => {
  const depositAmount = depositAmountFormatted.value?.replace(/\$\s?|(,*)/g, '');
  if (isNaN(depositAmount)) {
  } else {
    depositAmountFormatted.value = `${depositAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    form.localAmount = Number(depositAmount);
  }
})

const verifyDepositAmount = ref([
  (val) => !!parseDigitsWithComma(val) || t('lang.deposit_please_enter_amount'),
  (val) => (parseDigitsWithComma(val) && /^\d+$/.test(parseDigitsWithComma(val))) || (val && isUSDT.value) || "입금 금액에는 소수가 포함될 수 없습니다",
  (val) =>
    parseDigitsWithComma(val) > calculatedMinDeposit.value - 1 ||
    "입금은 사이여야 합니다 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax,
  (val) =>
    parseDigitsWithComma(val) < activeMethod.value.depositMax + 1 ||
    "입금은 사이여야 합니다 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
]);

async function confirmDeposit() {
  if (btnLoading.value) {
    return;
  }

  // debugger;
  btnLoading.value = true;
  depositAmtRef.value.validate();
  if (selectedPayType.value && bankCardList.value.length > 0) {
    await payTypeClass.value.validateBank(form.bankId);
  }

  if (depositAmtRef.value.hasError || (selectedPayType.value && bankCardList.value.length > 0 && !form.bankId)) {
    btnLoading.value = false;
  } else {
    await cashier
      .get(`/session/payment/${activeMethod.value.paymentId}/amount/${form.localAmount}/verify`)
      .then((resp) => {
        // debugger;
        const d = resp.data;
        if (d.code === 11002) {
          if (d.data && d.data.suggestion) {
            form.localAmount = d.data.suggestion;
            btnLoading.value = false;
          }
          $q.notify({
            color: "negative",
            position: "top",
            message: d.message,
            icon: "report_problem"
          });
        } else {
          if (freePrivilege.value) {
            if (selectedPrivilege.value) {
              form.privilegeId = selectedPrivilege.value.id + "," + freePrivilege.value.id;
            } else {
              form.privilegeId = "," + freePrivilege.value.id;
            }
          } else {
            if (selectedPrivilege.value) {
              form.privilegeId = selectedPrivilege.value.id;
            } else {
              form.privilegeId = null;
            }
          }
          form.paymentId = activeMethod.value.paymentId;
          const copy = { ...form };
          const data = {};
          Object.entries(copy).forEach(([key, value]) => {
            if (value) {
              data[key] = value;
            }
          });
          data.bankCardId = 0;
          pDepo(data);
        }
      });
  }
}

async function pDepo(deposit) {
  btnLoading.value = true;
  const obj = {
    bankCardId: deposit.bankCardId,
    localAmount: deposit.localAmount,
    paymentId: deposit.paymentId,
    bankId: deposit.bankId
  };

  if (deposit.privilegeId) {
    obj.privilegeId = deposit.privilegeId;
  }
  await cashier
    .post("/session/payment/submit", qs.stringify(obj))
    .then((ret) => {
      const res = ret.data;
      // console.log(res)
      if (res.code === 0) {
        const response = res.data.result;
        if (res.data.result.payResultType === "OFFLINE") {
          btnLoading.value = false;
        }
        if (res.data.result.payResultType === "RENDER_HTML") {
          isDisplay.value = true;
          const submitResult = res.data.result.data;
          submitMessage.value = submitResult.split(",");
          btnLoading.value = false;
        } else {
          if (
            !extensionState.value &&
            (Platform.is.desktop || Platform.is.webkit) &&
            !Platform.is.capacitor &&
            Platform.is.name !== "webkit" &&
            !liff.isInClient()
          ) {
            if (store.getDeviceType() === "IOS" || store.isMobileSafari()) {
              const newWin = window.open(`/`, `_self`);
              if (response.payResultType === "GET_SUBMIT") {
                newWin.location.href = response.requestUrl;
                btnLoading.value = false;
              }
              if (response.payResultType === "POST_SUBMIT") {
                if (response.paramKey === null || response.paramKey === "") {
                  newWin.location.href = `display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                  btnLoading.value = false;
                } else {
                  newWin.location.href = `display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                  btnLoading.value = false;
                }
              }
            } else {
              const newWin = window.open(`/`);
              if (!newWin) {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message:
                    "충전 페이지를 열 수 없습니다. 브라우저가 팝업 차단을 하는지 확인하고 팝업 허용으로 변경한 후 충전 작업을 다시 진행하십시오。",
                  icon: "report_problem"
                });
                btnLoading.value = false;
                return;
              }
              newWin.localStorage.setItem("formDetails", JSON.stringify(form));
              if (response.payResultType === "GET_SUBMIT") {
                newWin.location.href = response.requestUrl;
                btnLoading.value = false;
              }
              if (response.payResultType === "POST_SUBMIT") {
                if (response.paramKey === null || response.paramKey === "") {
                  newWin.location.href = `display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                  btnLoading.value = false;
                } else {
                  newWin.location.href = `display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                  btnLoading.value = false;
                }
              }
            }
          } else {
            localStorage.setItem("formDetails", JSON.stringify(form));
            if (response.payResultType === "GET_SUBMIT") {
              if (
                (Platform.is.desktop || Platform.is.webkit) &&
                !Platform.is.capacitor &&
                Platform.is.name !== "webkit" &&
                !liff.isInClient()
              ) {
                location.href = response.requestUrl;
                btnLoading.value = false;
              } else {
                openURL(response.requestUrl);
                btnLoading.value = false;
              }
            }
            if (response.payResultType === "POST_SUBMIT") {
              localStorage.setItem("responseDetails", JSON.stringify(response));
              if (response.paramKey === null || response.paramKey === "") {
                if (store.getDeviceType() == "ANDROID") {
                  // alert("Adnroid");
                  var preUrl =
                    "https://" +
                    store.evip +
                    `/display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;

                  // alert(preUrl);
                  const newWin = window.open(preUrl, `_blank`);
                } else {
                  router.push(
                    `/display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`
                  );
                  btnLoading.value = false;
                }
              } else {
                router.push(
                  `/display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`
                );
                btnLoading.value = false;
              }
            }
          }
        }
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
        btnLoading.value = false;
      }
    })
    .catch((error) => {
      btnLoading.value = false;
    });
}

const isLoadingInitPay = ref(true);
const initPay = () => {
  isDisplay.value = false;
  // debugger;
  // $q.loading.show({
  //   message: "로딩 중... 잠시만 기다려 주세요..."
  // });

  isFetchingApi.value = true;

  payMethods.value = [];
  cashier
    .get("/session/deposit/index/")
    .then((resp) => {
      $q.loading.hide();
      const res = resp.data;
      if (res.code === 0) {
        const d = res.data;
        d.payments.forEach((element) => {
          element.promoValue = "";
          element.promoStyle = "right: -5px; top: 0px; padding: 20px;";
          payMethods.value.push(element);
        });
        if (payMethods.value[0].extra && payMethods.value[0].extra.banks) {
          bankCardList.value = payMethods.value[0].extra.banks;
        }

        console.log(payMethods.value);
      }

      if (
        !(
          (Platform.is.desktop || Platform.is.webkit) &&
          !Platform.is.capacitor &&
          Platform.is.name !== "webkit" &&
          !liff.isInClient()
        )
      ) {
        let isBacked = localStorage.getItem("isBacked");
        isBacked = isBacked ? JSON.parse(isBacked) : false;
        if (isBacked === true) {
          isDeposited.value = true;
        }
      }
      localStorage.removeItem("isBacked");
      isFetchingApi.value = false;
    })
    .catch((err) => {
      isFetchingApi.value = false;
    });
};

async function onSelect(value) {
  isDisplay.value = false;

  clearInfo();
  // if (!Platform.is.android || !Platform.is.capacitor) {
  // }
  // if (liff.isInClient()) {
  //   clearInfo();
  // }
  if (depositAmtRef.value) {
    depositAmtRef.value.resetValidation();
  }
  if (value) {
    if (value.group) {
      value.children.forEach((element) => {
        if (element.hasActive) {
          activeMethod.value = element;
          checkPrivilege(element);
        }
      });
    } else {
      activeMethod.value = value;
      checkPrivilege(value);
    }
    checkMinDepositAmt();
  }
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  hasPrivilege.value = false;
  await cashier.get(`/session/payment/${val.paymentId}/privileges`).then((res) => {
    if (res.code === 0) {
      privilegeList.value = res.data.privileges;

      unselectedPrivileges.value = [];
      freePrivilege.value = null;
      privilegeList.value.map((p) => {
        if (p.payTypes.indexOf(val.payType) >= 0) {
          if (p.triggerType == "FREE") {
            freePrivilege.value = p;
          } else {
            unselectedPrivileges.value.push(p);
            hasPrivilege.value = true;

            if (p.code === route.query?.privilegeCode && selectedPrivilege.value === "") {
              selectedPrivilege.value = p;
            }
          }
        }
      });
    } else {
      hasPrivilege.value = false;
      privilegeList.value = [];
    }
  });
}

function selectPayType(value) {
  if (value) {
    selectedPayType.value = value.payType;
    if (selectedPayType.value && selectedPayType.value.includes("USDT")) {
      isUSDT.value = true;
    } else {
      isUSDT.value = false;
    }
    if (value.extra && value.extra.amountArr) {
      amountList.value = value.extra.amountArr;
    }
    if (value.extra && value.extra.banks) {
      bankCardList.value = value.extra.banks;
    } else {
      bankCardList.value = [];
      form.bankId = null;
    }
  }
}

const selectAmt = (amt) => {
  const multiple = isUSDT.value ? 1 : 10000;
  // 1원 = 10000;
  depositAmountFormatted.value = `${Number(form.localAmount) + (amt * multiple)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
};

function clearInfo() {
  // isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";
  if (depositForm.value) {
    depositForm.value.reset();
  }
  checkMinDepositAmt();
}

function selectedBank(value) {
  form.bankId = value.value.id;
}

function checkMinDepositAmt() {
  if (!selectedPrivilege.value) {
    calculatedMinDeposit.value = activeMethod.value.depositMin;
  } else {
    calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, selectedPrivilege.value.depositMin);
  }
}

function checkPrivilege(v) {
  selectPayType(v);
  if (v.paymentId !== null && v.paymentId !== undefined) {
    loadPrivilege(v);
    // unselectedPrivileges.value = [];
  }
}

onMounted(() => {
  initPay();
  // checkNewUser();
});
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 20px;
}

.submit-message {
  // width: calc(100% - 40px);
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: auto;
  gap: 1px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color: #000000;

  .line {
    display: grid;
    grid-template-columns: 80px 1fr;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    font-size: 14px;
    align-items: center;
    background: #063c50;
    padding: 5px 15px;

    .copy-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 10px;
    }

    span:first-child {
      // flex: 1;
      color: #4fb2ff;
    }

    textarea.info {
      width: 100%;
      background: transparent;
      border: none;
      color: #fff;
      resize: none;

      &:focus {
        outline: none;
      }
    }

    span.info {
      flex: 3;
      color: #fff;
    }

    button {
      width: 80px;
      height: 30px;
      white-space: nowrap;
    }

    @media (max-width: 400px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
  }
}

.additional-tips {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
  font-size: 14px;
}

.deposit-field,
.account-name-field {
  :deep(.q-field__control) {
    background: #252e43;
  }

  :deep(.q-field__prepend) {
    padding-left: 10px;
  }
}

.deposit-select-bank {
  :deep(.q-field__control) {
    background: #252e43;
  }
}

.select-amt-btn-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  align-items: center;
  gap: 8px;
}

.select-amt-btn {
  background: linear-gradient(to right, #38F3FF 0%, #00B7ED 100%);
  color: #1a1a1a;
}
</style>

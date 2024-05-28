<template>
  <div class="modal-body-wrap" v-if="!isDisplay">
    <div class="deposit-options">
      <div class="lil-title">결제 채널</div>
      <div class="deposit-option-container">
        <div class="node-wrapper">
          <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
        </div>
      </div>
    </div>
  </div>

  <div class="inner-cont" v-if="isDisplay" style="overflow: auto">
    <div style="text-align: center">입금하기</div>
    <div class="submit-message">
      <div class="line">
        <span>은행 이름:</span>
        <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
        <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('0')">
          {{ copybtntxt0 }}
        </q-btn>
      </div>
      <div class="line">
        <span>은행 계좌:</span>
        <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
        <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('1')">
          {{ copybtntxt1 }}
        </q-btn>
      </div>
      <div class="line">
        <span>이름:</span>
        <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
        <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('2')">
          {{ copybtntxt2 }}
        </q-btn>
      </div>
      <div class="line">
        <span>입금 금액:</span>
        <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
        <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('3')">
          {{ copybtntxt3 }}
        </q-btn>
      </div>
    </div>
  </div>
  <div class="deposit-container" v-else>
    <q-form ref="depositForm" class="q-gutter-y-xs content-form">
      <label>입금금액</label>
      <q-input
        v-if="amountList.length === 0"
        hide-bottom-space
        ref="depositAmtRef"
        :label="isUSDT ? 'USDT 금액을 입력하세요' : '입금 금액을 입력하세요'"
        class="deposit-field"
        color="accent"
        name="localAmount"
        v-model="form.localAmount"
        placeholder="입금 금액을 입력하세요"
        :rules="verifyDepositAmount"
        padding="none"
        clearable
      >
        <template v-slot:prepend>
          <span style="font-size: 26px" class="text-bright">
            <template v-if="isUSDT">USDT</template>
            <template v-else>{{ store.currency.value }}</template>
          </span>
        </template>
      </q-input>

      <q-select
        v-else
        ref="depositAmtRef"
        label="금액 선택"
        name="localAmount"
        class="deposit-selection"
        filled
        color="accent"
        :options="amountList"
        v-model="form.localAmount"
        :rules="verifyDepositAmount"
        padding="none"
      >
        <template v-slot:prepend>
          <span style="font-size: 26px" class="text-bright">
            {{ store.currency.value }}
          </span>
        </template>
      </q-select>

      <div class="q-mt-sm q-mb-sm text-grey text-bold">
        입금단위：{{
          calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value === "₩" ? "만" : store.currency.value) : 0
        }}
        -
        {{ activeMethod.depositMax ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value === "₩" ? "만" : store.currency.value) : " " }}
      </div>

      <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-xs" label="환율">
        <span class="text-positive">
          1.00 USDT ≈ {{ activeMethod.currencyRate }}
          {{ store.currency.value }}
        </span>
      </div>

      <p class="option-btns">
        <q-btn
          class="select-amt-btn"
          v-for="(item, index) in countOptions"
          :key="index"
          :label="item + '원만'"
          @click="selectAmt(item)"
        ></q-btn>
        <q-btn class="select-amt-btn active" label="삭제" @click="clearInfo"></q-btn>
      </p>

      <label v-show="selectedPayType && bankCardList.length">입금계좌</label>
      <BankComponent
        v-show="selectedPayType && bankCardList.length"
        ref="payTypeClass"
        :is="selectedPayType"
        class="deposit-select-bank"
        v-model="form.bankId"
        :bank-list="bankCardList"
        @selected="selectedBank"
        @successful="isDeposited = true"
      ></BankComponent>

      <q-select
        ref="offerRef"
        class="deposit-selection q-mt-xs"
        label="할인 선택"
        filled
        :options="unselectedPrivileges"
        v-model="selectedPrivilege"
        emit-value
        v-if="hasPrivilege && !isUSDT"
        :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
        clearable
        @update:model-value="checkMinDepositAmt"
      >
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

      <label>입금금액</label>
      <q-input
        hide-bottom-space
        label="입금자명"
        v-model="depositAccName"
        class="account-name-field"
        padding="none"
        color="white"
        readonly
      />

      <div class="modal-body-buttons q-mt-md" align="center">
        <q-btn rounded flat class="primary-button blue" label="입금하기" :loading="btnLoading" @click="confirmDeposit"></q-btn>
      </div>

      <div class="q-mt-sm" v-html="activeMethod.msg"></div>
    </q-form>
  </div>

  <!--  <q-dialog class="modal-common-div" width="100%" v-model="isDeposited">-->
  <!--    <q-card style="width: 100%; padding: 1rem 0.5rem">-->
  <!--      <q-card-section class="contents q-pa-md">-->
  <!--        <strong class="black-titles">已存款</strong>-->
  <!--        <br />-->
  <!--        <div style="padding: 20px">-->
  <!--          <q-card-section class="q-mb-md q-pa-md">-->
  <!--            您将被重定向到您的银行页面以完成存款。-->
  <!--            <br />-->
  <!--            入金成功后会反映这里。-->
  <!--          </q-card-section>-->
  <!--          <q-btn class="common-md-btn" @click="clearInfo" label="明白" color="brightbtn" />-->
  <!--        </div>-->
  <!--      </q-card-section>-->
  <!--    </q-card>-->
  <!--  </q-dialog>-->
</template>

<script setup id="FinanceDeposit">
import { ref, onMounted, reactive, shallowRef } from "vue";
import { userStore } from "src/stores";
import { useRouter, useRoute } from "vue-router";
import Node from "../../components/paymentSelect/node.vue";
import BankComponent from "../../components/finance/fBank";
import { cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import liff from "@line/liff";

var qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();

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

const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isOpenFromAccount = ref(false);
const isUSDT = ref(false);
const depositForm = ref(null);
const privilegeList = ref([]);
const unselectedPrivileges = ref([]);
const selectedPrivilege = ref("");

const copybtntxt0 = ref("복사");
const copybtntxt1 = ref("복사");
const copybtntxt2 = ref("복사");
const copybtntxt3 = ref("복사");

const depositAmtRef = ref("");
const depositAccName = ref(store.realName);

const currentPath = ref(route.path);
const extensionState = ref(false);
const extensionToken = ref("");
const isFetchingApi = ref(false);

const form = reactive({
  paymentId: null,
  privilegeId: null,
  localAmount: null,
  bankId: null
});

const checkAmount = reactive({
  flag: true,
  errorMessage: ""
});

const copyMessage = (position) => {
  let copyText = null;
  copyText = eval(`subMsg${position}.value.innerText`);
  // Create a temporary textarea element
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt[position].value = "복사";
};

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach((element) => {
    element.value = "복사";
  });
};

const verifyDepositAmount = ref([
  (val) => !!val || "금액을 입력하세요",
  (val) => (val && /^\d+$/.test(val)) || (val && isUSDT.value) || "입금 금액에는 소수가 포함될 수 없습니다",
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    "입금은 사이여야 합니다 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax,
  (val) =>
    val < activeMethod.value.depositMax + 1 ||
    "입금은 사이여야 합니다 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
]);

async function confirmDeposit() {
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
      $q.notify({
        color: "negative",
        position: "top",
        message: error.message,
        icon: "report_problem"
      });
      btnLoading.value = false;
      // postMessage(
      //   {
      //     msg: error.message
      //   },
      //   "*"
      // );
    });
}

const isLoadingInitPay = ref(true);
const initPay = () => {
  isDisplay.value = false;
  // debugger;
  $q.loading.show({
    message: "로딩 중... 잠시만 기다려 주세요..."
  });

  isFetchingApi.value = window.location.pathname === "/deposit";

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
  const multiple = 10000;
  // 1원 = 10000;
  form.localAmount += amt * multiple;
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
.modal-body-wrap {
}
.modal-body-buttons {
  width: 100%;
  .form-button {
    height: 70px;
    width: 200px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    &.blue {
      background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
    }
    &.yellow {
      background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
    }
  }
}

.modal-body-content {
  .content-form {
    p {
      margin-top: 20px;
    }
    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;
    }
    label,
    input {
      width: 100%;
    }
    input {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5c5c5c;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    .option-btns {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto auto;
      grid-row-gap: 12px;
      grid-column-gap: 12px;
      :deep(.q-btn) {
        height: 40px;
        color: #fff;
        font-size: 14px;
        border-radius: 3px;
        background: #18324a;
        &.active {
          background: #237bff;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .modal-body-content {
    .content-form {
      p {
        margin-top: 10px;
      }
      label {
        margin-bottom: 8px;
        font-size: 13px;
      }
      input {
        font-size: 13px;
        line-height: 30px;
        color: #fff;
        padding: 3px 12px;
      }
      .option-btns {
        display: grid;
        grid-template-columns: auto auto auto auto;
        :deep(.q-btn) {
          max-width: unset;
        }
      }
    }
  }
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
    display: flex;
    gap: 10px;
    justify-content: space-between;
    // width: calc(100% - 30px);
    width: 100%;
    align-items: center;
    font-size: 14px;
    align-items: center;
    background: #063c50;
    padding: 15px 10px;

    span:first-child {
      // flex: 1;
      color: #4fb2ff;
      width: 80px;
    }

    span.info {
      flex: 3;
      color: #fff;
    }

    button {
      width: 80px;
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

.deposit-field, .account-name-field {
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

.select-amt-btn {
  background: #38f3ff;
  margin-right: 8px;
  color: #000;
  margin-bottom: 8px;
}
</style>

<template>
  <div class="q-pa-md" style="overflow: hidden">
    <div class="node-wrapper">
      <Node :level="1" :list="payMethods" ref="paymentNode" @clicked="onSelect" />
    </div>
    <div class="deposit-container">
      <div class="deposit-amt-quick-select-wrapper" v-if="allowedDepositAmtOptions.length > 0">
        <div class="deposit-amt-quick-select-title">Deposit Amounts</div>
        <div class="deposit-amt-quick-select-list">
          <div
            :class="`deposit-amt-quick-select-item ${depositAmtOption === Number(form.localAmount) ? 'active' : ''}`"
            v-for="depositAmtOption in allowedDepositAmtOptions"
            :key="depositAmtOption"
            @click="onDepositAmtQuickSelect(depositAmtOption)"
          >
            {{ depositAmtOption }}
          </div>
        </div>
      </div>
      <q-form ref="depositForm" class="q-gutter-y-sm deposit-page-form">
        <label class="field-label">Deposit Amount</label>
        <q-input
          class="q-mt-md"
          ref="depositAmtRef"
          label="Deposit Amount"
          name="localAmount"
          rounded
          outlined
          v-model="form.localAmount"
          placeholder="Enter an amount"
          color="white"
          :rules="verifyDepositAmount"
          padding="none"
          clearable
        />
        <div class="q-pb-md">
          <div class="desc-list">
            <div class="desc-list-item">
              <div class="bullet-point">
                <img src="../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                Min amount one time:
                <span style="color: orange">
                  {{ calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0 }}
                </span>
              </div>
            </div>
            <div class="desc-list-item">
              <div class="bullet-point">
                <img src="../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                Max amount one time:
                <span style="color: orange">
                  {{
                    activeMethod.depositMax
                      ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value)
                      : "No Limit"
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-md" label="Exchange Rate">
          <span style="color: #0b8f1a">1.00 USDT ≈ {{ activeMethod.currencyRate }} {{ store.currency.value }}</span>
        </div>
        <BankComponent
          v-show="selectedPayType && bankCardList.length"
          ref="payTypeClass"
          :is="selectedPayType"
          :bank-list="bankCardList"
          @selected="selectedBank"
          @successful="isDeposited = true"
        ></BankComponent>
        <label class="field-label">Select promotion</label>
        <q-select
          ref="offerRef"
          class="q-mt-md"
          rounded
          outlined
          label="Select promotion"
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          color="light-blue-4"
          label-color="grey"
          @update:model-value="checkMinDepositAmt"
          clearable
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div
          class="q-px-md text-red"
          v-if="
            selectedPrivilege &&
            (selectedPrivilege.id === 5 || selectedPrivilege.id === 6 || selectedPrivilege.id === 7)
          "
        >
          {{ promoRollOver }}X turnover
        </div>
        <div class="q-px-md text-red" v-if="promoBonus">Bonus Amount {{ promoBonus }}</div>
        <div class="q-mt-md" v-html="activeMethod.msg"></div>
        <div class="q-mt-md">
          <div class="desc-list">
            <div class="desc-list-item">
              <div class="bullet-point">
                <!-- <img src="../assets/images/finance/withdraw/diamond-bullet-icon.svg" /> -->
              </div>
              <div class="desc-text">
                <div class="q-pb-md text-red" v-if="!selectedPrivilege">
                  If the first-time deposit promotion is not selected, it is considered as giving up the second and
                  third deposit promotions.
                </div>
              </div>
            </div>
            <div class="desc-list-item">
              <div class="bullet-point">
                <img src="../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                New accounts with updated personal information can participate in the promotion.
              </div>
            </div>
            <div v-if="isIOSGCash" class="desc-list-item">
              <div class="bullet-point">
                <img src="../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text" style="color: #c99715">
                iOS only supports scanning QR codes through screenshots.
              </div>
            </div>
          </div>
        </div>
        <div class="q-mt-md">
          <q-btn class="submit-btn" @click="confirmDeposit" label="Confirm Deposit" />
        </div>
      </q-form>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        You have been redirected to your specific bank to proceed with the deposit.
        <br />
        <br />
        Once the deposit is successful, it will be reflected here.
      </q-card-section>
      <q-btn @click="clearInfo" label="I understand" class="common-btn" color="primary" />
    </q-card>
  </q-dialog>

  <AlertDialog
    v-model:open="open"
    btnText="I understand"
    message="<p>You have been redirected to your specific bank to proceed with the deposit</p><p>Once the deposit is successful, it will be reflected here.</p>"
  />
</template>

<script setup id="DepositComponent">
import { ref, reactive, onActivated, shallowRef, computed } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { api, cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import liff from "@line/liff";

import AlertDialog from "src/components/AlertDialog.vue";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRouter, useRoute } from "vue-router";

const open = ref(false);

const store = userStore();
const router = useRouter();

const isNewUser = ref(false);
const isNoBankCard = ref(false);

const checkNewUser = () => {
  if (store.phone == "") {
    isNewUser.value = true;
  } else {
    api.get("/session/bankCard").then((response) => {
      if (response.code === 0) {
        if (response.data.length === 0) {
          isNoBankCard.value = true;
        }
      }
    });
  }
};
const isDeposited = ref(false);
const isLoading = ref(true);
const btnLoading = ref(false);
const payTypeClass = ref();
const payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const bankCardList = ref([]);
const amountList = ref([]);
const privilegeList = ref([]);
const unselectedPrivileges = ref([]);
const selectedPrivilege = ref("");
const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isOpenFromAccount = ref(false);
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const depositAmtOptions = ref(new Set([100, 300, 500, 800, 1000, 3000, 5000, 8000, 10000, 20000]));
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const copybtntxt0 = ref("Copy");
const copybtntxt1 = ref("Copy");
const copybtntxt2 = ref("Copy");
const copybtntxt3 = ref("Copy");

const allowedDepositAmtOptions = computed(() => {
  const depositAmtOptionsArr = Array.from(depositAmtOptions.value);
  return depositAmtOptionsArr.filter(
    (depositAmtOption) =>
      depositAmtOption >= calculatedMinDeposit.value && depositAmtOption <= activeMethod.value.depositMax
  );
});

const isIOSGCash = computed(() => {
  if (Platform.is.ios && activeMethod.value.payType === "GCASH") {
    return true;
  }

  return false;
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
  copybtntxt[position].value = "Copied";
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};
const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach((element) => {
    element.value = "Copy";
  });
};

const verifyDepositAmount = ref([
  (val) => !!val || "Please enter the amount",
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    "Deposit should be between " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax,
  (val) =>
    val < activeMethod.value.depositMax + 1 ||
    "Deposit should be between " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
]);

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

const $q = useQuasar();
const calculatedMinDeposit = ref("");

function initPay() {
  $q.loading.show({
    message: "Loading data... Please wait..."
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((res) => {
    $q.loading.hide();
    if (res.code === 0) {
      const d = res.data;
      payMethods.length = 0;
      d.payments.forEach((element) => {
        element.promoValue = "";
        element.promoStyle = "right: -5px; top: -10px; padding: 20px;";
        payMethods.push(element);
      });
      if (payMethods[0].extra && payMethods[0].extra.banks) {
        bankCardList.value = payMethods[0].extra.banks;
      }
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
  });
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  hasPrivilege.value = false;
  await cashier.get(`/session/payment/${val.paymentId}/privileges`).then((res) => {
    if (res.code === 0) {
      privilegeList.value = res.data.privileges;
      hasPrivilege.value = true;
      unselectedPrivileges.value = [];
      freePrivilege.value = null;
      privilegeList.value.map((p) => {
        if (p.payTypes.indexOf(val.payType) >= 0) {
          if (p.triggerType == "FREE") {
            freePrivilege.value = p;
          } else {
            unselectedPrivileges.value.push(p);
          }
        }
      });
      checkWelcome();
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

const depositForm = ref(null);

async function onSelect(value) {
  isDisplay.value = false;

  clearInfo();
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
  console.log(activeMethod.value);
}
const route = useRoute();
const checkWelcome = () => {
  if (route.query && route.query.isFromWelcomePromo) {
    unselectedPrivileges.value.forEach((p) => {
      if (p.name === 'P4W-FIRST-DEPOSIT') {
        selectedPrivilege.value = p
      }
    })
    onDepositAmtQuickSelect(300)
  }
};

const onDepositAmtQuickSelect = (amt) => {
  form.localAmount = amt;
};

const promoRollOver = ref(0);
const promoBonus = computed(() => {
  const privilege = selectedPrivilege.value;

  if (privilege?.bonusType === "RATIO" && form.localAmount && privilege.bonusAmount) {
    const bonusAmt = Number(form.localAmount) * privilege.bonusAmount;
    return Math.min(privilege.bonusMax, bonusAmt);
  }

  return 0;
});

function checkMinDepositAmt() {
  if (!selectedPrivilege.value) {
    calculatedMinDeposit.value = activeMethod.value.depositMin;
  } else {
    calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, selectedPrivilege.value.depositMin);
    promoRollOver.value = selectedPrivilege.value.rollover;
  }
}

function checkPrivilege(v) {
  selectPayType(v);
  if (v.paymentId !== null && v.paymentId !== undefined) {
    loadPrivilege(v);
    // unselectedPrivileges.value = [];
  }
}

function selectedBank(value) {
  form.bankId = value.value.id;
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";

  // clear bank field
  payTypeClass.value.clearValue();
  form.bankId = null;

  if (depositForm.value) {
    depositForm.value.reset();
  }
  checkMinDepositAmt();
}

const depositAmtRef = ref("");

async function confirmDeposit() {
  btnLoading.value = true;
  depositAmtRef.value.validate();
  if (selectedPayType.value === "BANK" && !form.bankId) {
    payTypeClass.value.validateItem();
    btnLoading.value = false;
    return;
  }
  if (depositAmtRef.value.hasError) {
    btnLoading.value = false;
  } else {
    await cashier
      .get(`/session/payment/${activeMethod.value.paymentId}/amount/${form.localAmount}/verify`)
      .then((d) => {
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
    .then((res) => {
      //
      // console.log(res)

      if (res.code === 0) {
        // console.log("After SDubmit");
        // console.log(res);

        const response = res.data.result;
        if (res.data.result.payResultType === "OFFLINE") {
          btnLoading.value = false;
        }
        if (res.data.result.payResultType === "RENDER_HTML") {
          isDisplay.value = true;
          const submitResult = res.data.result.data;
          submitMessage.value = submitResult.split(",");
          btnLoading.value = false;
          router.push({
            path: "/display",
            query: {
              data: res.data.result.data,
              payResultType: "RENDER_HTML"
            }
          });
        } else {
          if (
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

        open.value = true;

        clearInfo();
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

onActivated(() => {
  initPay();
  checkNewUser();
});
</script>
<style scoped lang="scss">
.deposit-amt-quick-select-wrapper {
  border-top: 1px solid #484460;
}

.deposit-amt-quick-select-title {
  font-weight: bold;
  font-size: 12px;
  padding: 10px;
}

.deposit-amt-quick-select-list {
  display: grid;
  // grid-template-columns: repeat(auto-fit,minmax(10vw,1fr));
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  padding-bottom: 20px;
}

.deposit-amt-quick-select-item {
  padding: 10px 8px;
  cursor: pointer;
  background: #ebf2ff;
  color: #222222;
  // box-shadow: 6px 6px #161b23;
  border-radius: 100px;
  // border: solid 1px #000;
  display: flex;
  justify-content: center;
  width: 100%;

  &.active {
    // background-color: #0071ed;
    border-radius: 6px;
    color: #fff;
    // border: solid 1px #1c1c32;
    box-shadow: none;

    border-radius: 100px;
    background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
    color: #fff;
    width: 100%;
  }
}

.body--dark {
  .deposit-amt-quick-select-item {
    background-color: transparent;
    color: #d3d7dd;
    border: 1px solid #5e6982;

    &.active {
      color: #ffffff;
      background-color: #243354;
      border: 1px solid #9fc587;
    }
  }
}

.section-header {
  padding: 0px 20px;
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 20px;
}

.desc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  .desc-list-item {
    font-size: 16px;
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>

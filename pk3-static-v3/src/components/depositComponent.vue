<template>
  <div>
    <div class="deposit-item-container">
      <template v-for="(item, index) in depositItems" :key="index">
        <div @click="handleDepositItemClick(index)" :class="['deposit-item', item.isActive && 'active']">
          <div class="deposit-icon">
            <!--            <img-->
            <!--              :src="require(`../assets/images/index/popout/deposit-coin-${item.amount}.png`)"-->
            <!--              :alt="item.amount + ' Coin'"-->
            <!--            />-->
            <div class="deposit-hot-label" v-if="isUpi2Active">+{{ store.currency.value }}{{ item.hotLabel }}</div>
          </div>
          <div class="deposit-amt">{{ item.amount }}</div>
        </div>
      </template>
    </div>

    <div v-if="isDisplay" class="inner-cont" style="overflow: auto">
      <div class="submit-message">
        <div class="line">
          <span>Bank Name:</span>
          <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
          <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('0')">
            {{ copybtntxt0 }}
          </q-btn>
        </div>
        <div class="line">
          <span>Bank Account:</span>
          <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
          <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('1')">
            {{ copybtntxt1 }}
          </q-btn>
        </div>
        <div class="line">
          <span>Bank Card Number:</span>
          <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
          <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('2')">
            {{ copybtntxt2 }}
          </q-btn>
        </div>
        <div class="line">
          <span>Deposit Amount:</span>
          <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
          <q-btn class="bg-yellow text-black common-btn" @blur="blurCode" @click="copyMessage('3')">
            {{ copybtntxt3 }}
          </q-btn>
        </div>
      </div>
    </div>

    <div class="deposit-container" v-else>
      <q-form ref="depositForm" class="q-gutter-y-xs deposit-form">
        <div class="deposit-enter-amt" v-if="amountList.length === 0">
          <div>Amount</div>
          <q-input
            class="deposit-input"
            ref="depositAmtRef"
            name="localAmount"
            hide-bottom-space
            filled
            v-model="form.localAmount"
            :rules="verifyDepositAmount"
            dense
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 26px" class="text-grey">
                <template v-if="isUSDT">USDT</template>
                <template v-else>{{ store.currency.value }}</template>
              </span>
            </template>
          </q-input>
        </div>

        <q-select
          v-else
          ref="depositAmtRef"
          label="Select Amount"
          name="localAmount"
          filled
          :options="amountList"
          v-model="form.localAmount"
          color="bright"
          :rules="verifyDepositAmount"
          padding="none"
        >
          <template v-slot:prepend>
            <span style="font-size: 26px" class="text-grey">
              {{ store.currency.value }}
            </span>
          </template>
        </q-select>

        <!-- <div class="q-mt-md q-mb-md text-grey-7">
          Minimum Amount:
          {{ calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0 }}
          <br />
          Maximum Amount:
          {{
            activeMethod.depositMax
              ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value)
              : "No Limit"
          }}
        </div> -->

        <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-md" label="Exchange rate">
          <span style="color: #fff">
            1.00 USDT ≈ {{ activeMethod.currencyRate }}
            {{ store.currency.value }}
          </span>
        </div>

        <BankComponent
          v-show="selectedPayType && bankCardList.length"
          ref="payTypeClass"
          :is="selectedPayType"
          v-model="form.bankId"
          :bank-list="bankCardList"
          @selected="selectedBank"
          @successful="isDeposited = true"
        ></BankComponent>

        <div v-if="activeMethod.msg" class="q-mt-md" v-html="activeMethod.msg"></div>
      </q-form>
    </div>

    <div class="deposit-options">
      <q-btn
        flat
        class="deposit-option-btn"
        :class="{ active: isUpi1Active }"
        label="UPI"
        @click="handleDepositUpiClick(1)"
      />
      <!-- <q-btn
        flat
        class="deposit-option-btn label-on-discount"
        :class="{ active: isUpi2Active }"
        label="UPI2"
        @click="handleDepositUpiClick(2)"
      /> -->
    </div>

    <div class="q-mt-md">
      <div :class="`btn-go`" @click="confirmDeposit">
        <q-spinner v-if="isLoadingInitPay || btnLoading" color="white" size="2em" :thickness="2"></q-spinner>
        <template v-else>Go</template>
      </div>
    </div>

    <!-- <div class="q-my-lg">
      <span class="additional-tips">
        If you encounter deposit problems, please contact online customer service immediately to solve it!
      </span>
    </div> -->

    <div class="node-wrapper" style="display: none">
      <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-primary text-white">Deposited</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          You will be redirected to your bank page to complete the deposit.
          <br />
          <br />
          After deposited successfully, it will be reflected here.
        </q-card-section>
        <q-btn @click="clearInfo" label="Understood" class="bg-yellow text-black" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, shallowRef } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import { t } from "@/boot/lang";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();

const checkNewUser = () => {
  if (store.realName == "" || store.realName == null) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("notify.pleaseFillInPersonalDetails"),
      icon: "report_problem"
    });
    router.push(`/account/profile`);
  }
};

const isDeposited = ref(false);
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
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();

const copybtntxt0 = ref("复制");
const copybtntxt1 = ref("复制");
const copybtntxt2 = ref("复制");
const copybtntxt3 = ref("复制");
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

const $q = useQuasar();
const calculatedMinDeposit = ref("");

const depositItems = reactive([
  { amount: 100, hotLabel: 5, isActive: false },
  { amount: 300, hotLabel: 15, isActive: false },
  { amount: 500, hotLabel: 25, isActive: false },
  { amount: 1000, hotLabel: 50, isActive: false },
  { amount: 2000, hotLabel: 100, isActive: false },
  { amount: 3000, hotLabel: 150, isActive: false },
  { amount: 5000, hotLabel: 250, isActive: false },
  { amount: 10000, hotLabel: 500, isActive: false },
  { amount: 20000, hotLabel: 1000, isActive: false }
  // { amount: 30000, hotLabel: 1500, isActive: false },
  // { amount: 50000, hotLabel: 2500, isActive: false }
]);

const handleDepositItemClick = (index) => {
  depositItems.forEach((item, i) => {
    item.isActive = i === index;
    if (i === index) {
      form.localAmount = item.amount;
    }
  });
};

const isUpi1Active = ref(true);
const isUpi2Active = ref(false);

const handleDepositUpiClick = (option) => {
  if (option === 1) {
    isUpi1Active.value = true;
    isUpi2Active.value = false;
  } else if (option === 2) {
    isUpi1Active.value = false;
    isUpi2Active.value = true;
  }
};

const isLoadingInitPay = ref(true);
function initPay() {
  isLoadingInitPay.value = true;
  $q.loading.show({
    message: "Loading data... Please wait..."
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((res) => {
    $q.loading.hide();
    isLoadingInitPay.value = false;

    if (res.code === 0) {
      const d = res.data;
      d.payments.forEach((element) => {
        element.promoValue = "";
        element.promoStyle = "right: -5px; top: 0px; padding: 20px;";
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
        Platform.is.name !== "webkit"
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
}

function selectedBank(value) {
  form.bankId = value.value.id;
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";
  if (depositForm.value) {
    depositForm.value.reset();
  }
  checkMinDepositAmt();
}

const depositAmtRef = ref("");
async function confirmDeposit() {
  btnLoading.value = true;
  depositAmtRef.value.validate();
  if (depositAmtRef.value.hasError) {
    btnLoading.value = false;
  } else {
    await cashier
      .get(`/session/payment/${activeMethod.value.paymentId}/amount/${form.localAmount}/verify`)
      .then((d) => {
        if (d.code === 11002) {
          if (d.data && d.data.suggestion) {
            form.localAmount = d.data.suggestion;
          }
          $q.notify({
            color: "negative",
            position: "top",
            message: d.message,
            icon: "report_problem"
          });

          btnLoading.value = false;
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
      if (res.code === 0) {
        const response = res.data.result;

        // let isFirstDepo = localStorage.getItem("IS_FIRST_DEPOSIT");
        // if (!isFirstDepo) {
        //   console.log("First Depo");
        //   //ADJUST TRACKEVENT.
        //   var adjustEvent = new AdjustEvent("medfxb");
        //   adjustEvent.setRevenue(deposit.localAmount, "INR");
        //   Adjust.trackEvent(adjustEvent);
        //
        //   localStorage.setItem("IS_FIRST_DEPOSIT", "1");
        // }

        if (res.data.result.payResultType === "OFFLINE") {
        }
        if (res.data.result.payResultType === "RENDER_HTML") {
          isDisplay.value = true;
          const submitResult = res.data.result.data;
          submitMessage.value = submitResult.split(",");
        } else {
          if (
            (Platform.is.desktop || Platform.is.webkit) &&
            !Platform.is.capacitor &&
            Platform.is.name !== "webkit"
          ) {
            if (store.getDeviceType() === "IOS" || store.isMobileSafari()) {
              const newWin = window.open(`/`, `_self`);
              if (response.payResultType === "GET_SUBMIT") {
                newWin.location.href = response.requestUrl;
              }
              if (response.payResultType === "POST_SUBMIT") {
                if (response.paramKey === null || response.paramKey === "") {
                  newWin.location.href = `display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                } else {
                  newWin.location.href = `display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                }
              }
            } else {
              const newWin = window.open(`/`);
              newWin.localStorage.setItem("formDetails", JSON.stringify(form));
              if (response.payResultType === "GET_SUBMIT") {
                newWin.location.href = response.requestUrl;
              }
              if (response.payResultType === "POST_SUBMIT") {
                if (response.paramKey === null || response.paramKey === "") {
                  newWin.location.href = `display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                } else {
                  newWin.location.href = `display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
                }
              }
            }
          } else {
            localStorage.setItem("formDetails", JSON.stringify(form));
            if (response.payResultType === "GET_SUBMIT") {
              if (
                (Platform.is.desktop || Platform.is.webkit) &&
                !Platform.is.capacitor &&
                Platform.is.name !== "webkit"
              ) {
                location.href = response.requestUrl;
              } else {
                openURL(response.requestUrl);
              }
            }
            if (response.payResultType === "POST_SUBMIT") {
              localStorage.setItem("responseDetails", JSON.stringify(response));
              if (response.paramKey === null || response.paramKey === "") {
                if (store.getDeviceType() == "ANDROID") {
                  var preUrl =
                    "https://" +
                    store.evip +
                    `/display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;

                  const newWin = window.open(preUrl, `_blank`);
                } else {
                  router.push(
                    `/display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`
                  );
                }
              } else {
                router.push(
                  `/display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`
                );
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
      }
    })
    .catch((error) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: error.message,
        icon: "report_problem"
      });
    })
    .then(() => {
      btnLoading.value = false;
    });
}

onMounted(() => {
  initPay();
  checkNewUser();
});
</script>

<style scoped lang="scss">
.submit-message {
  // width: calc(100% - 40px);
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
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
    background: #55009a;
    padding: 15px 10px;

    span:first-child {
      // flex: 1;
      color: #ffdf38;
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

.q-select__dialog .q-field__control {
  background: #ffdf38 !important;
  color: #222222;
}

.deposit-item-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 12px;
  column-gap: 8x;

  .deposit-item {
    .deposit-icon {
      // background-image: url(../assets/images/index/popout/deposit-item-frame.png);
      background-position: top center;
      background-size: contain;
      background-repeat: no-repeat;
      display: flex;
      height: 80px;
      position: relative;
      align-items: center;
      justify-content: center;
      margin-left: 3px;
      margin-right: 3px;
      transition: all 0.3s;
      img {
        display: block;
        width: 70%;
        max-width: 70px;
      }
    }

    &.active > .deposit-icon {
      // background-image: url(../assets/images/index/popout/deposit-item-frame-active.png);
    }

    .deposit-hot-label {
      position: absolute;
      top: 0;
      right: 0;
      // background-image: url(../assets/images/index/popout/hot-label.png);
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center center;
      width: 50px;
      height: 28px;
      font-size: 0.725rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding-bottom: 3px;
    }

    .deposit-amt {
      // background-image: url(../assets/images/index/popout/deposit-item-frame-amount.png);
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      padding: 3px;
      width: 100%;
      max-width: 100px;
      margin: auto;
    }
  }
}

.deposit-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .deposit-form {
    width: 90%;

    .deposit-enter-amt {
      display: flex;
      gap: 16px;
      align-items: center;
      // max-width: 300px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;

      .deposit-input {
        background-color: rgba(21, 0, 37, 0.5);
        border-radius: 5px;
        width: 100%;
      }
    }
  }
}

.deposit-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 16px auto 0 auto;
  width: 90%;

  .deposit-option-btn {
    color: #cccccc;
    background-color: rgba(21, 0, 37, 0.5) !important;
    min-width: 100px;
    // max-width: 160px;
    width: 50%;
    border-radius: 6px;
    border: 3px solid transparent;
    height: 50px;

    &.active {
      color: #ffe66b;
      border: 3px solid #ffe66b;
    }

    &.label-on-discount {
      position: relative;
      &:after {
        content: "";
        // background-image: url(../assets/images/index/popout/label-discount.png);
        background-repeat: no-repeat;
        display: block;
        position: absolute;
        top: -4px;
        right: -5px;
        width: 30px;
        height: 30px;
        background-size: 100%;
      }
    }
  }
}

.btn-go {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 180px;
  height: 60px;
  transition: 0.3s all;
  // background-image: url(../assets/images/index/popout/btn-go.png);
  color: #ffffff;
  margin: auto;

  &:before {
    box-shadow: none;
  }

  &.disabled {
    opacity: 0.7;
  }
}
</style>

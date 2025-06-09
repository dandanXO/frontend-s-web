<template>
  <div class="deposit-wrapper" :class="isInputFocus && 'input-btm'">
    <div class="method-title q-mb-sm">Deposit Method</div>
    <div class="deposit-methods-container" v-if="isLoadingInitPay">
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
    </div>
    <template v-else>
      <div class="deposit-methods-container">
        <template v-for="(item, index) in paymentMethodsItems" :key="index">
          <div class="content-item" @click="goSelectedMethod(item)" :class="{ active: selectedItem === item }">
            <div class="item-img">
              <img :src="imgURL + '/payment/' + item.nodeIcon" />
            </div>
            <div class="item-title">{{ item.nodeName }}</div>
            <div class="item-ribbon" v-if="isPrivilege && paytypeWithPrivilege.includes(item.code)">
              <img src="../../assets/images/account/ribbon-five-percent.png" />
            </div>
          </div>
        </template>
      </div>

      <div class="method-title q-mt-md q-mb-sm">Payment Channels</div>
      <div class="deposit-methods-container col-three">
        <template v-for="(item, index) in selectedItemChannel" :key="index">
          <div class="content-item" @click="goSelectedChannel(item)" :class="{ active: selectedChannel === item }">
            <div class="item-title">{{ item.nodeName }}</div>
          </div>
        </template>
      </div>
      <div class="deposit-method-msg">{{ selectedChannel.msg }}</div>

      <template v-if="selectedChanelExtra.length > 0">
        <div class="method-title q-mt-md q-mb-sm">Bank</div>
        <div>
          <q-select
            v-model="selectedChannelBank"
            :options="selectedChanelExtra"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            filled
          />
        </div>
      </template>
    </template>

    <div class="slot-ftd-section" v-if="isFtdPrivilege">
      <img src="../../assets/images/bonus/slot-ftd-img.png" />
    </div>

    <!-- select amount -->
    <template v-if="isSelectedMethod">
      <div class="method-title q-mt-md q-mb-sm">Deposit Amount</div>
      <div class="deposit-methods-container">
        <template v-for="(amount, index) in selectedItemAmount" :key="index">
          <div @click="handleDepositItemClick(amount)" :class="'deposit-item '">
            <q-badge
              color="orange"
              floating
              rounded
              v-if="isPrivilege && paytypeWithPrivilege.includes(selectedChannel.payType)"
            >
              +{{ convertToCommaAmount(amount * 0.05) }}
            </q-badge>

            <q-badge color="orange" floating rounded v-if="isFtdPrivilege">+{{ getFtdCommaAmount(amount) }}</q-badge>

            <div :class="['deposit-amt', form.localAmount === amount && 'active']">
              {{ convertToCommaAmount(amount) }}
            </div>
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
            <q-checkbox
              style="margin-left: -5px"
              v-model="isFtdPrivilegeEnable"
              v-if="store.ftd === false && !isPrivilege"
            >
              Use Slot First Deposit Privilege
            </q-checkbox>
            <div class="lil-title">
              Amount ({{ convertToCommaAmount(selectedChannel.depositMin) }} -
              {{ convertToCommaAmount(selectedChannel.depositMax) }} {{ store.currency.label }})
            </div>
            <q-input
              type="number"
              class="deposit-input q-mt-sm"
              ref="depositAmtRef"
              name="localAmount"
              hide-bottom-space
              filled
              v-model="form.localAmount"
              :rules="[
                verifyDepositAmount,
                (val) => Number.isInteger(+val) || 'Deposit Amount Must Not Have Decimals',
                (val) =>
                  (val >= selectedChannel.depositMin && val <= selectedChannel.depositMax) ||
                  `Deposit Amount Must In Between ${convertToCommaAmount(
                    selectedChannel.depositMin
                  )} - ${convertToCommaAmount(selectedChannel.depositMax)}`
              ]"
              dense
              clearable
              @keyup.enter="confirmDeposit"
              @focus="scrollToInput"
              @blur="isInputFocus = false"
            >
              <template v-slot:prepend>
                <span style="font-size: 26px" class="currency">
                  <template v-if="isUSDT">USDT</template>
                  <template v-else>{{ store.currency.value }}</template>
                </span>
              </template>

              <template v-slot:append>
                <div class="amt-input-append" v-if="isFtdPrivilege && form.localAmount">
                  Extra:
                  <span>{{ getFtdCommaAmount(form.localAmount) }}P</span>
                </div>

                <div class="amt-input-append" v-if="isPrivilege && form.localAmount">
                  Extra:
                  <span>{{ convertToCommaAmount(form.localAmount * 0.05) }}P</span>
                </div>
              </template>
            </q-input>
          </div>

          <template v-else>
            <div class="lil-title q-mt-lg">Select Amount</div>
            <q-select
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
                <span style="font-size: 26px" class="currency">
                  {{ store.currency.value }}
                </span>
              </template>
            </q-select>
          </template>

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

      <div class="q-mt-lg">
        <div :class="`btn-submit`" @click="confirmDeposit">
          <q-spinner v-if="isLoadingInitPay || btnLoading" color="white" size="2em" :thickness="2"></q-spinner>
          <template v-else>Submit</template>
        </div>
      </div>

      <div class="q-mt-lg" style="color: #576373" v-if="isFtdPrivilege">
        <div class="q-mt-sm">Wager requirement (to withdrawal): 10 times of your deposit amount</div>
        <div class="q-mt-sm">
          Eg. Deposit {{ store.currency.value }}1,000, require {{ store.currency.value }}10,000 wager in slot games
        </div>
      </div>
      <div
        class="q-mt-lg"
        style="color: #576373"
        v-else-if="isPrivilege && selectedChannel && paytypeWithPrivilege.includes(selectedChannel.payType)"
      >
        <div class="q-mt-sm">Wager requirement (to withdrawal): 10 times of your deposit amount</div>
        <div class="q-mt-sm">
          Eg. Deposit {{ store.currency.value }}1,000, require {{ store.currency.value }}10,000 wager
        </div>
      </div>
    </template>
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

  <q-dialog width="100%" v-model="guestKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="router.go(-1)" v-close-popup />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="router.go(-1)" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, shallowRef, defineEmits, onActivated, computed, nextTick, watch } from "vue";
import Node from "../../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { api, cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import { userStore } from "stores/index";
import { useRouter, useRoute } from "vue-router";
import { convertToCommaAmount } from "src/boot/utils";
import KYCGuestForm from "../../components/KYCGuestForm.vue";
import KYCUserForm from "../../components/KYCUserForm.vue";
import { cached } from "boot/cache";
import { storeToRefs } from "pinia";

const imgURL = process.env.IMAGE_CDN;

var qs = require("qs");
const store = userStore();
const router = useRouter();
const route = useRoute();
const emits = defineEmits(["closeModal"]);

const checkNewUser = () => {
  if (store.realName == "" || store.realName == null) {
    emits("closeModal");
    $q.notify({
      color: "negative",
      position: "top",
      message: "Please fill in your personal details",
      icon: "report_problem"
    });
    // router.push(`/account/profile`);
  }
};

const isSelectedMethod = ref(false);
const paymentMethodsItems = ref();
const isDeposited = ref(false);
const btnLoading = ref(false);
const payTypeClass = ref();
const payMethods = ref([]);
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

const isFtdPrivilegeEnable = ref(false);
const isFromFtdPromo = computed(() => route.query?.from === "/promo" && route.query.privilegeId);

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
  (val) => val > calculatedMinDeposit.value - 1 || "Deposit should be more than " + calculatedMinDeposit.value
  // (val) =>
  //   val < activeMethod.value.depositMax + 1 ||
  //   "Deposit should be between " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
]);

const form = reactive({
  paymentId: null,
  privilegeId: null,
  localAmount: null,
  bankId: null
});

const $q = useQuasar();
const calculatedMinDeposit = ref("");

// const depositItems = computed(() => {
//   //   // if (!activeMethod.value.amountArr) return [];
//   //   // return activeMethod.value.amountArr.map((amount) => Number(amount));

//   return activeMethod.value;
// });

const depositItems = ref();

const handleDepositItemClick = (amount) => {
  form.localAmount = amount;
};

const getFtdCommaAmount = (amount) => {
  if (amount < 888) {
    return amount;
  } else {
    return 888;
  }
};

const handleDepositNodeClick = (item) => {
  activeMethod.value = item;
  depositItems.value = item.extra.amountArr;
  form.localAmount = null;
  nextTick(() => depositAmtRef.value.resetValidation());
};

const selectedItem = ref();
const selectedItemPrivilege = ref();
const selectedItemPrivilegeId = ref();
const extraPrivilegeId = ref();
const selectedItemChannel = ref();
const selectedItemAmount = ref();
const selectedChannel = ref();
const selectedChanelExtra = ref([]);
const isPrivilege = ref(false);
const selectedChannelBank = ref(null);
const paytypeWithPrivilege = ref("");
const { ftd } = storeToRefs(store);
const isFtdPrivilege = computed(
  () => extraPrivilegeId.value && ftd.value === false && isFtdPrivilegeEnable.value === true
);

const goSelectedMethod = (item) => {
  selectedItem.value = item;
  activeMethod.value = item;
  isSelectedMethod.value = true;
  selectedItemChannel.value = item.children;
  selectedChanelExtra.value = [];

  goSelectedChannel(item.children[0]);
};

const goSelectedChannel = (item) => {
  selectedChannel.value = item;
  selectedChanelExtra.value = item.extra.banks;
  selectedItemAmount.value = item.extra.amountArr;

  selectedChannelBank.value = null;
  if (selectedChanelExtra.value.length > 0) {
    selectedChannelBank.value = item.extra.banks[0].id;
  }
};

const isLoadingInitPay = ref(true);

function initPay() {
  isLoadingInitPay.value = true;
  $q.loading.show({
    message: "Loading data... Please wait..."
  });

  let promoParam = "";

  if (route.query.extra === "true") {
    // promoParam = "?promo=1";
    isPrivilege.value = true;
    selectedItemPrivilegeId.value = store.extraPrivilegeId;
  } else {
    isPrivilege.value = false;
    selectedItemPrivilegeId.value = "";
  }

  if (route.query.privilegeId) {
    extraPrivilegeId.value = route.query.privilegeId;
  } else {
    extraPrivilegeId.value = undefined;
  }

  payMethods.value = [];

  cashier.get(`/session/php/deposit/index/${promoParam}`).then((res) => {
    $q.loading.hide();
    isLoadingInitPay.value = false;

    if (res.code === 0) {
      paymentMethodsItems.value = res.data.payments;
      goSelectedMethod(res.data.payments[0]);
    }

    if (!((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== "webkit")) {
      let isBacked = localStorage.getItem("isBacked");
      isBacked = isBacked ? JSON.parse(isBacked) : false;
      if (isBacked === true) {
        isDeposited.value = true;
      }
    }
    localStorage.removeItem("isBacked");
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
  // api won't return min and max values from now on, currently min set to 100
  calculatedMinDeposit.value = 100;
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
  if (btnLoading.value) return;
  btnLoading.value = true;
  depositAmtRef.value.validate();
  if (depositAmtRef.value.hasError) {
    btnLoading.value = false;
  } else {
    await cashier
      .get(`/session/payment/${selectedChannel.value.paymentId}/amount/${form.localAmount}/verify`)
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
          form.paymentId = selectedChannel.value.paymentId;

          if (selectedChanelExtra.value.length > 0) {
            form.bankId = selectedChannelBank.value;
          } else {
            form.bankId = null;
          }

          if (selectedItemPrivilegeId.value) {
            if (store.paytypeWithPrivilege.indexOf(selectedChannel.value.payType) > -1) {
              form.privilegeId = selectedItemPrivilegeId.value;
            } else {
              form.privilegeId = null;
            }
          }

          if (isFtdPrivilege.value && extraPrivilegeId.value && isFtdPrivilegeEnable.value) {
            form.privilegeId = extraPrivilegeId.value;
          }

          const copy = { ...form };
          const data = {};
          Object.entries(copy).forEach(([key, value]) => {
            if (value) {
              data[key] = value;
            }
          });
          data.bankCardId = 0;

          verifyAUTopPayKYC()
            .then((res) => {
              if (res.data.url) {
                // redirect to KYC verification
                if (store.guest) {
                  openGuestKYCDialog();
                } else {
                  openUserKYCDialog();
                }
              } else {
                pDepo(data);
              }
            })
            .catch((e) => {
              console.error("KYC verification failed:", e);
              btnLoading.value = false;
            });
        }
      })
      .catch((e) => {
        btnLoading.value = false;
      });
  }
}

async function verifyAUTopPayKYC() {
  return api.get(`/session/verifyAUTopPayKYC`);
}

async function pDepo(deposit) {
  const obj = {
    bankCardId: deposit.bankCardId,
    localAmount: deposit.localAmount,
    paymentId: deposit.paymentId,
    bankId: deposit.bankId,
    privilegeId: deposit.privilegeId
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
          if ((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== "webkit") {
            if (store.getDeviceType() === "IOS" || store.isMobileSafari()) {
              const newWin = window.open(`/`, `_self`);
              if (!newWin) {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message:
                    "Unable to open the recharge page. Please check if your browser is blocking pop-up pages and change the settings to 'Allow pop-ups' before attempting to recharge again.",
                  icon: "report_problem"
                });
                btnLoading.value = false;
                return;
              }
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
              if (!newWin) {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message:
                    "Unable to open the recharge page. Please check if your browser is blocking pop-up pages and change the settings to 'Allow pop-ups' before attempting to recharge again.",
                  icon: "report_problem"
                });
                btnLoading.value = false;
                return;
              }
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
      // $q.notify({
      //   color: "negative",
      //   position: "top",
      //   message: error.message,
      //   icon: "report_problem"
      // });
    })
    .then(() => {
      btnLoading.value = false;
    });
}

// KYC Dialog
const personalState = reactive({
  memberInfo: {}
});
const userKYCDialog = ref(false);
const openUserKYCDialog = () => {
  userKYCDialog.value = true;
};
const closeUserKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    userKYCDialog.value = false;
  });
};

const guestKYCDialog = ref(false);
const openGuestKYCDialog = () => {
  guestKYCDialog.value = true;
};
const closeGuestKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    guestKYCDialog.value = false;
  });
};

const loadInfo = () => {
  personalState.memberInfo = userStore();

  if (store.guest && personalState.memberInfo.realName === null) {
    openGuestKYCDialog();
  }

  if (!store.guest && personalState.memberInfo.realName === null) {
    openUserKYCDialog();
  }
};

const resetSelectedMethod = () => {
  isSelectedMethod.value = false;
  // isAddNewAccount.value = false;
};

const loadAppTabs = () => {
  api.get("/opt-session/getAppTabs").then((res) => {
    if (res.code === 0) {
      const { data } = res;
      if (data && data.deposit) {
        store.paytypeWithPrivilege = data.deposit.paytypeWithPrivilege;
        store.extraPrivilegeId = data.deposit.privilegeId;
        extraPrivilegeId.value = data.deposit.ftdPrivilegeId;

        paytypeWithPrivilege.value = data.deposit.paytypeWithPrivilege;
      }
      if (data && data.hasOwnProperty("ftd")) {
        store.ftd = data.ftd;
      }
    }
  });
};

const isInputFocus = ref(false);

const scrollToInput = () => {
  if (Platform.is.capacitor && Platform.is.android) {
    isInputFocus.value = true;
    nextTick(() => {
      const input = document.activeElement;
      if (input) {
        input.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    });
  }
};

watch(
  isFromFtdPromo,
  (val) => {
    if (val) {
      isFtdPrivilegeEnable.value = true;
    } else {
      isFtdPrivilegeEnable.value = false;
    }
  },
  { immediate: true }
);

onActivated(() => {
  initPay();
  // checkNewUser();
  loadInfo();
  resetSelectedMethod();
  loadAppTabs();
});

onMounted(() => {
  loadAppTabs();
  initPay();
  // checkNewUser();
  loadInfo();
});
</script>

<style scoped lang="scss">
.deposit-tabs {
  width: 90%;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: #1b2232;
}

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

:deep(.q-field--filled.q-field--dark .q-field__control) {
  border-radius: 0.5rem;
  background: #263349 !important;
}

:deep(.q-tab__label) {
  font-weight: 600;
}

.deposit-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .deposit-form {
    // width: 90%;
    width: 100%;

    .deposit-enter-amt {
      margin: 20px auto 0 auto;

      .deposit-input {
        background-color: rgba(21, 0, 37, 0.5);
        border-radius: 5px;
        width: 100%;
        height: 46px;

        :deep(.q-field__control) {
          height: 46px;
        }

        :deep(.q-field__bottom) {
          padding-left: 0;
          padding-right: 0;
          margin: 0;
        }

        :deep(.amt-input-append) {
          padding-left: 6px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 16px;
          line-height: 20px;
          font-weight: 700;

          span {
            font-size: 18px;
            font-style: italic;
            font-weight: 700;
            color: #5c46e7;
            text-shadow: 1px 1px 2px #180b3bcc;
          }
        }
      }

      .currency {
        color: #698fd0;
        font-weight: 400;
      }
    }
  }
}

.deposit-options {
  margin: 16px auto 0 auto;
  // width: 90%;

  .deposit-option-container {
    display: flex;
    gap: 12px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .deposit-option-btn-wrapper {
    position: relative;
  }

  .deposit-option-btn {
    color: #cccccc;
    background: #1d2635;
    border: 3px solid transparent;
    // height: 38px;
    border-radius: 0.375rem;
    // aspect-ratio: 77/38;

    &.active {
      background: #5c46e7;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    }

    &.label-on-discount {
      position: relative;
      &:after {
        content: "";
        // background-image: url(../../assets/images/index/popout/label-discount.png);
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

  .selected-svg {
    position: absolute;
    right: 1px;
    bottom: 1px;
    display: none;

    svg {
      background: #5c46e7;
      border-radius: 3px;
    }

    &.active {
      display: block;
    }
  }
}

:deep(.q-btn) {
  font-weight: 600;
}

.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  height: 46px;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  background: #5c46e7;
  width: 100%;
  aspect-ratio: 335/46;

  &:before {
    box-shadow: none;
  }

  &.disabled {
    opacity: 0.7;
  }
}

.lil-title {
  color: #576373;
  font-weight: 600;
}

.deposit-wrapper {
  width: 95%;
  margin: auto;
}

.skeleton-deposit-option {
  width: 100%;
  aspect-ratio: 519 / 303;
  min-height: 50px;
}

.withdraw-methods-container {
  display: flex;
  gap: 12px;
  flex-direction: column;
  background-color: #161f2d;
  padding: 12px;
  border-radius: 6px;
}

.method-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .options-picker {
    display: flex;
    gap: 6px;
  }
}

.method-title {
  color: #98a6b4;
  font-size: 14px;
}

.method-item {
  border-radius: 6px;
  background-color: #263349;
  padding: 6px 8px 6px 12px;
  display: flex;
  align-items: center;

  &.active {
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  }

  &.disabled {
    cursor: not-allowed;
    backdrop-filter: grayscale(1) brightness(0.7);
    pointer-events: none;
    // opacity: 0.6;
  }

  .item-icon {
    border-right: 1px solid #4b6185;
    padding-right: 8px;

    img {
      display: block;
      // width: 100%;
      width: 50px;
    }
  }
  .item-detail {
    padding: 6px 6px 6px 8px;
    .txt-title {
      font-size: 11px;
      color: #ffffff;
    }
    .txt-content {
      font-size: 10px;
      color: #576373;
      // white-space: nowrap;
      margin-top: 4px;
    }
    .txt-maintenance {
      color: #f4b975;
      font-size: 11px;
    }
  }
  .item-amount {
    font-size: 10px;
    padding: 6px;
    margin-left: auto;
  }
  .item-arrow {
    margin-left: auto;
    width: 30px;
    min-width: 30px;
    max-width: 30px;
  }
}

.method-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .options-picker {
    display: flex;
    gap: 6px;
  }
}

.slot-ftd-section {
  width: 100%;
  margin: 24px auto 0px;

  img {
    width: 100%;
  }
}

.deposit-methods-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  gap: 12px;

  &.col-three {
    grid-template-columns: repeat(3, 1fr);
  }

  &.col-five {
    // grid-template-columns: repeat(5, 1fr);
  }

  .content-item {
    position: relative;
    background-color: rgba(38, 51, 73, 1);
    border: 2px solid rgba(120, 121, 133, 0.5);
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;

    .item-ribbon {
      display: block;
      position: absolute;
      top: -2px;
      left: -2px;
    }

    &.active {
      border: 2px solid #5c46e7;
      .item-title {
        color: rgba(255, 255, 255, 1);
      }
      &:before {
        content: "";
        height: 20px;
        width: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url(../../assets/images/account/active-tick.png);
        background-size: cover;
      }
    }

    .item-img {
      margin: auto;
      padding-bottom: 6px;
      img {
        display: block;
        width: 100%;
        max-width: max-content;
        border-radius: 6px;
      }
    }
    .item-title {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin-top: auto;
    }
  }

  .deposit-item {
    margin: auto;
    position: relative;
    width: 100%;

    .deposit-amt {
      padding: 8px;
      background-color: #263349;
      border: 2px solid rgba(120, 121, 133, 0.5);
      border-radius: 6px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;

      &.active {
        border: 2px solid #5c46e7;
        color: rgba(255, 255, 255, 1);

        &:before {
          content: "";
          height: 20px;
          width: 20px;
          position: absolute;
          bottom: 0;
          right: 0;
          background-image: url(../../assets/images/account/active-tick.png);
          background-size: cover;
        }
      }
    }
  }
}

.deposit-method-msg {
  margin-top: 10px;
}

.input-btm {
  padding-bottom: 270px;
}
</style>

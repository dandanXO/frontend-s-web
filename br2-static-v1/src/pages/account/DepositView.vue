<template>
  <div class="deposit-wrapper" :class="isInputFocus && 'input-btm'">
    <div class="node-wrapper">
      <Node :key="nodeKey" :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
    </div>

    <div class="deposit-item-container q-mt-sm">
      <template v-for="(item, index) in depositItems" :key="index">
        <div @click="handleDepositItemClick(index)" :class="'deposit-item'">

<!--          <q-badge v-if="selectedPrivilege === 'br222-redeposit-bonus'" color="green" floating rounded>-->
<!--            +{{ getFtdCommaAmount(item.amount) }}-->
<!--          </q-badge>-->

<!--          {{selectedPrivilege}}-->
          <q-badge v-if="selectedPrivilege.code === 'br2-redeposit-bonus'" color="green" floating rounded>
            +{{ get2ndDepoCommaAmount(item.amount) }}
          </q-badge>

          <div :class="['deposit-amt', item.isActive && 'active']">{{ convertToCommaAmount(item.amount) }}</div>
          <div :class="['deposit-svg', item.isActive && 'active']">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M8.12492 11.118L14.0828 5L15 5.94102L8.12492 13L4 8.76474L4.9165 7.82373L8.12492 11.118Z"
                fill="white"
              />
            </svg>
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
        <div class="deposit-enter-amt">
          <div class="lil-title flex-div" style="justify-content: space-between">
            <q-checkbox
              v-model="isFtdPrivilegeEnable"
              v-if="store.ftd === 'OPEN' && paytypeWithPrivilege.indexOf(activeMethod.payType) > -1"
            >
              {{ $t("deposit.useFtdPrivilege") }}
            </q-checkbox>
            <div v-else>&nbsp;</div>
            <!--            <div class="tutorial-link" @click="openDepositPage" style="margin-right: 10px">-->
            <!--              {{ $t("deposit.depositTutorial") }}-->
            <!--            </div>-->
          </div>

          <div v-if="isBank2" class="font-small" style="width: calc(100% - 18px); margin: 10px auto 8px">
            {{ $t("deposit.please_pay_exact_amt") }}
          </div>
          <q-input
            class="deposit-input q-mt-sm"
            ref="depositAmtRef"
            name="localAmount"
            hide-bottom-space
            outlined
            v-model="form.localAmount"
            :rules="verifyDepositAmount"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 16px" class="currency">
                <template v-if="isUSDT">USDT</template>
                <template v-else>{{ store.currency.value }}</template>
              </span>
            </template>
          </q-input>
        </div>

        <!-- <q-select
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
            <span style="font-size: 26px" class="currency">
              {{ store.currency.value }}
            </span>
          </template>
        </q-select> -->

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

        <div v-if="isUSDT && activeMethod.currencyRate" class="q-mt-lg" label="Exchange rate">
          <span style="color: #fff">
            <template v-if="form.localAmount > 0">{{ form.localAmount }}</template>
            <template v-else>1.00</template>
            USDT ≈
            <template v-if="form.localAmount > 0">
              {{ convertToTwoDecimalAmount(form.localAmount * activeMethod.currencyRate) }}
            </template>
            <template v-else>{{ activeMethod.currencyRate }}</template>

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

        <q-select
          style="width: 100%; margin-top: 25px"
          ref="offerRef"
          class="deposit-selection q-mt-xs"
          :label="$t('deposit.select_privilege')"
          filled
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege && unselectedPrivileges.length > 0"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          clearable
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

        <!--        <div-->
        <!--          class="rollover-info"-->
        <!--          v-if="-->
        <!--            selectedPrivilege &&-->
        <!--            selectedPrivilege.name &&-->
        <!--            (selectedPrivilege.gameTypeRollover || selectedPrivilege.rollover)-->
        <!--          "-->
        <!--        >-->
        <!--          <p v-if="selectedPrivilege.gameTypeRollover && selectedPromo.gameTypeRollover !== '{}'">-->
        <!--            {{ getRollOverText(selectedPrivilege.gameTypeRollover) }}-->
        <!--          </p>-->
        <!--          <p v-else>Wagering Requirements (Deposit + Bonus): {{ selectedPrivilege.rollover }}x</p>-->
        <!--        </div>-->
      </q-form>
    </div>

    <div class="q-mt-lg" style="color: #576373" v-if="activeMethod.privilegeId || isFtdPrivilegePayType">
      <div class="q-mt-sm">{{ $t("deposit.wagerRequirement") }}</div>
      <div class="q-mt-sm">{{ $t("deposit.wagerRequirementEg") }}</div>
    </div>

    <div class="bottom-btn">
      <q-btn
        no-caps
        unelevated
        class="btn-primary btn-primary__full bottom-fixed"
        :loading="isLoadingInitPay || btnLoading"
        @click="confirmDeposit"
      >
        {{ $t("btn.submit") }}
      </q-btn>
    </div>

    <div class="step-desc-div">
      <template v-if="activeMethod.msg">
        <div class="description-text" v-html="activeMethod.msg"></div>
      </template>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%">
      <q-card-section style="padding: 10px 20px" class="q-pa-md bg-primary text-white">
        {{ $t("deposit.deposited") }}
      </q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          {{ $t("deposit.youWillBeRedirect") }}
          <br />
          <br />
          {{ $t("deposit.afterDepositSuccessfully") }}
        </q-card-section>
        <q-btn @click="clearInfo" label="Understood" class="bg-yellow text-black" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="router.go(-1)" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  shallowRef,
  defineEmits,
  onActivated,
  computed,
  nextTick,
  watch,
  onDeactivated
} from "vue";
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
import { t } from "../../boot/lang";

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
      // message: "Please fill in your personal details",
      message: t("notify.fillInPersonalDetails"),
      icon: "report_problem"
    });
    // router.push(`/account/profile`);
  }
};

const isBank2 = computed(() => {
  return activeMethod.value.code === "BANK-2";
});

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
const freePrivilege = ref("");
const hasPrivilege = ref(false);
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const isInitialized = ref(false);

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
  (val) => !!val || t("form.depositAmount_placeholder"),
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    t("form.depositAmount_rules_01") + calculatedMinDeposit.value + "-" + calculatedMaxDeposit.value,
  (val) =>
    val < calculatedMaxDeposit.value + 1 ||
    t("form.depositAmount_rules_01") + calculatedMinDeposit.value + "-" + calculatedMaxDeposit.value
]);

const form = reactive({
  paymentId: null,
  privilegeId: null,
  localAmount: null,
  bankId: null
});

const $q = useQuasar();
const calculatedMinDeposit = ref("");
const calculatedMaxDeposit = ref("");

// const depositItems = computed(() => {
//   //   // if (!activeMethod.value.amountArr) return [];
//   //   // return activeMethod.value.amountArr.map((amount) => Number(amount));

//   return activeMethod.value;
// });

const depositItems = ref([]);

const handleDepositItemClick = (index) => {
  depositItems.value.forEach((item, i) => {
    item.isActive = i === index;
    if (i === index) {
      form.localAmount = item.amount;
    }
  });
};

const getFtdCommaAmount = (amount) => {
  return amount;
};

const get2ndDepoCommaAmount = (amount) => {
  if (amount < 2880) {
    return amount * 0.1;
  } else {
    return 288;
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
const ftdPrivilegeId = ref();
const selectedItemChannel = ref();
const selectedItemAmount = ref();
const selectedChannel = ref();
const selectedChanelExtra = ref([]);
const isPrivilege = ref(false);
const selectedChannelBank = ref(null);
const paytypeWithPrivilege = ref("");
const { ftd } = storeToRefs(store);
// const isFtdPrivilege = computed(() => extraPrivilegeId.value && ftd.value === false);

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
    message: t("btn.loading_data")
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
      payMethods.value = [];
      const d = res.data;
      d.payments.forEach((element) => {
        element.promoValue = "";
        element.promoStyle = "right: -5px; top: 0px; padding: 20px;";
        payMethods.value.push(element);
      });
      if (payMethods.value.length > 0) {
        activeMethod.value = payMethods.value[0];
      }
      if (payMethods.value[0].extra && payMethods.value[0].extra.banks) {
        bankCardList.value = payMethods.value[0].extra.banks;
      }
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
  depositItems.value.forEach((item) => (item.isActive = false));
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
          depositItems.value = element.extra.amountArr.map((item) => ({
            amount: parseInt(item),
            isActive: false
          }));
          checkPrivilege(element);
        }
      });
    } else {
      activeMethod.value = value;
      depositItems.value = value.extra.amountArr.map((item) => ({
        amount: parseInt(item),
        isActive: false
      }));
      checkPrivilege(value);
    }
  }
}

function checkMinDepositAmt(val) {
  // api won't return min and max values from now on, currently min set to 100
  calculatedMinDeposit.value = val.depositMin;
  calculatedMaxDeposit.value = val.depositMax;
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
  // checkMinDepositAmt();
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
      .get(`/session/payment/${activeMethod.value.paymentId}/amount/${form.localAmount}/verify`)
      .then((d) => {
        if (d.code === 11002) {
          if (d.data && d.data.suggestion) {
            form.localAmount = d.data.suggestion;
          }
          $q.notify({
            color: "negative",
            position: "top",
            message: t("error." + d.code),
            icon: "report_problem"
          });

          btnLoading.value = false;
        } else {
          // debugger;
          if (freePrivilege.value.length > 0) {
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

          // if (selectedChanelExtra.value.length > 0) {
          //   form.bankId = selectedChannelBank.value;
          // } else {
          //   form.bankId = null;
          // }

          // if (selectedItemPrivilegeId.value) {
          //   if (store.paytypeWithPrivilege.indexOf(selectedChannel.value.payType) > -1) {
          //     form.privilegeId = selectedItemPrivilegeId.value;
          //   } else {
          //     form.privilegeId = null;
          //   }
          // }

          if (isFtdPrivilege.value && ftdPrivilegeId.value) {
            form.privilegeId = ftdPrivilegeId.value;
          }

          if (isPrivilege.value && !isFtdPrivilege.value && extraPrivilegeId.value) {
            form.privilegeId = extraPrivilegeId.value;
          }

          if (isFtdPrivilegePayType.value && ftdPrivilegeId.value && isFtdPrivilegeEnable.value) {
            form.privilegeId = ftdPrivilegeId.value;
          }

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
      })
      .catch((e) => {
        btnLoading.value = false;
      });
  }
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

const nodeKey = ref(0);
const refreshNode = () => {
  // Update the key to force re-render
  nodeKey.value += 1;
};

//TODO :: NOT USING Now Yet
const openDepositPage = () => {
  window.open("https://tutorial.gc7dy.cc", "_blank");
};

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
        paytypeWithPrivilege.value = data.deposit.paytypeWithPrivilege;

        store.ftdPrivilegeId = data.deposit.ftdPrivilegeId;
        ftdPrivilegeId.value = data.deposit.ftdPrivilegeId;

        store.extraPrivilegeId = data.deposit.privilegeId;
        extraPrivilegeId.value = data.deposit.privilegeId;
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

const isFromFtdPromo = computed(() => route.query?.from === "/promo" && route.query.privilegeId);
const isFtdPrivilegeEnable = ref(false);
// const isFtdPrivilege = computed(() => extraPrivilegeId.value && ftd.value === false);
const isFtdPrivilegePayType = computed(
  () => isFtdPrivilege.value && paytypeWithPrivilege.value.indexOf(activeMethod.value.payType) > -1
);
const isFtdPrivilege = computed(() => extraPrivilegeId.value && !ftd.value && isFtdPrivilegeEnable.value === true);

const convertToTwoDecimalAmount = (amount) => {
  let formattedAmount = parseFloat(amount).toFixed(2);
  return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function checkPrivilege(v) {
  selectPayType(v);
  if (v.paymentId !== null && v.paymentId !== undefined) {
    loadPrivilege(v);
    checkMinDepositAmt(v);
    // unselectedPrivileges.value = [];
  }
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  hasPrivilege.value = false;

  await cashier.get(`/session/payment/${val.paymentId}/privileges`).then((res) => {
    if (res.code === 0) {
      privilegeList.value = res.data.privileges;
      hasPrivilege.value = true;
      unselectedPrivileges.value = [];
      freePrivilege.value = [];
      privilegeList.value.map((p) => {
        if (p.payTypes.indexOf(val.payType) >= 0) {
          if (p.triggerType === "FREE") {
            freePrivilege.value.push(p);
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


watch(
  isFromFtdPromo,
  (val) => {
    if (val) {
      isFtdPrivilegeEnable.value = true;
    }
  },
  { immediate: true }
);

onActivated(() => {
  if (!isInitialized.value) return;
  initPay();
  loadAppTabs();
  loadInfo();
  refreshNode();
  // resetSelectedMethod();
});

onMounted(() => {
  // alert("Tis")
  loadAppTabs();
  initPay();
  loadInfo();
  refreshNode();
});

onDeactivated(() => {
  isInitialized.value = true;
});
</script>

<style scoped lang="scss">
.deposit-tabs {
  width: 100%;
  margin: 0 16px;
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
  // border-radius: 0.5rem;
  // background: #0b0e0d !important;
  // border: 1px solid #072a19;
  border-radius: 0.5rem;
  border: 1px solid #ffffff14;
  background: #292d2f !important;
}

:deep(.q-tab__label) {
  font-weight: 600;
}

.deposit-item-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 10px;
  column-gap: 10px;

  .deposit-item {
    margin: auto;
    position: relative;
    width: 100%;

    .deposit-amt {
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      // padding: 3px 16px;
      width: 100%;
      height: 4rem;
      font-weight: 600;
      aspect-ratio: 106/64;
      box-shadow: 0px 2px 0px 0px #2a3637;
      background: #394142;
      color: #ffffff80;

      font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0.3px;
      text-align: center;
      vertical-align: middle;

      &.active {
        // background: #00b900;
        color: #000a01;
        // background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        box-shadow: 0px 2px 0px 0px #1cca6a;
        background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);

        color: #2d2d2d;
      }
    }

    .deposit-svg {
      position: absolute;
      right: 0;
      bottom: -5px;
      display: none;

      svg {
        display: none;
        // background: #30bb1a;
        border-radius: 3px;
      }

      &.active {
        display: block;
      }
    }
  }
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
      margin: 20px auto 0px auto;

      .deposit-input {
        --deposit-input-height: 48px;
        border-radius: 5px;
        width: 100%;
        height: var(--deposit-input-height);

        :deep(.q-field__control) {
          height: var(--deposit-input-height);
          &::before {
            border-color: #4b4943;
          }
        }
        :deep(.q-field__marginal) {
          height: var(--deposit-input-height);
        }
      }

      .deposit-selection {
        background-color: #0b0e0d;
        border-radius: 5px;
        width: 100%;
        height: 46px;

        :deep(.q-field__control) {
          height: 46px;
        }
      }

      .currency {
        color: #ffffff33;
        font-weight: 700;
      }
    }
  }
}

.deposit-options {
  margin: 16px auto 0 auto;
  // width: 90%;

  .deposit-option-container {
    // display: grid;
    // grid-template-columns: repeat(5, 1fr);
    display: flex;
    gap: 12px;
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
      background: #b81212;
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
      background: #b81212;
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
  color: #d0d0d0;
  font-weight: 600;
  white-space: nowrap;

  span {
    color: #b81212;
  }
}

.flex-between-c {
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.font-small {
  font-size: 12px;
}

.flex-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.deposit-wrapper {
  // width: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 168px);
}

.bottom-btn {
  margin-top: auto;
  padding: 24px 0;
  // position: fixed;
  // bottom: 0;
  width: 100%;
  // max-width: 468px;
  // left: 50%;
  // transform: translateX(-50%);
  // background-color: #171616;
  // margin: 16px;
}

.tutorial-link {
  color: #21ef89;
  text-decoration: underline;
}

.step-desc-div {
  color: #b2bdbf;

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

.slot-ftd-section {
  width: 100%;
  margin: 10px auto 10px;

  img {
    width: 100%;
  }
}
</style>
<style scoped>
.description-text {
  background-color: #1f241f;
  padding: 8px 12px;
  font-size: 12px;
  color: #fbab1b;
}
:deep(.description-text p) {
  margin: 5px 0px !important;
}
</style>

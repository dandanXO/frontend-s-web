<template>
  <div class="q-pa-md" style="overflow: hidden;">
    <div class="node-wrapper">
      <Node
        :level="1"
        :list="payMethods"
        ref="paymentNode"
        @clicked="onSelect"
      />
    </div>
    <div class="deposit-container">
      <q-form ref="depositForm" class="q-gutter-y-xs">
        <q-input
          ref="depositAmtRef"
          label="Deposit Amount"
          name="localAmount"
          filled
          v-model="form.localAmount"
          placeholder="Enter an amount"
          color="white"
          :rules="verifyDepositAmount"
          padding="none"
        />
        <div class="q-pb-md">
          Min amount one time:
          {{ calculatedMinDeposit ? calculatedMinDeposit + ' ' + (store.currency.value) : 0 }} <br />
          Max amount one time:
          {{ activeMethod.depositMax ? activeMethod.depositMax + ' ' + (store.currency.value) : "No Limit" }}

        </div>

          <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-md" label="Exchange Rate">
            <span style="color: #9bffd1"
              >1.00 USDT ≈ {{ activeMethod.currencyRate }} {{ store.currency.value }}</span
            >
          </div>
        <BankComponent
          v-show="selectedPayType && bankCardList.length"
          ref="payTypeClass"
          :is="selectedPayType"
          :bank-list="bankCardList"
          @selected="selectedBank"
          @successful="isDeposited = true"
        ></BankComponent>
        <q-select
          ref="offerRef"
          class="q-mt-md"
          filled
          label="Apply For Offer"
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          color="white"
          @update:model-value="checkMinDepositAmt"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.opt.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="q-mt-md" v-html="activeMethod.msg">
        </div>
        <div class="q-mt-md">
          New accounts with updated personal information can participate in the promotion.
        </div>
        <div class="q-mt-md">
          <q-btn
            color="brand"
            @click="confirmDeposit"
            label="Confirm Deposit"
          />
        </div>
      </q-form>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        You have been redirected to your specific bank to proceed with the
        deposit.<br /><br />
        Once the deposit is successful, it will be reflected
        here.
      </q-card-section
      >
      <q-btn @click="clearInfo" label="I understand" color="brand"/>
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import {ref, reactive, onMounted, shallowRef, onBeforeUnmount} from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import {cashier} from "boot/axios";
import {Platform, useQuasar} from "quasar";
import liff from '@line/liff';
import {userStore} from "stores/index";
import {useRouter} from "vue-router";

var qs = require("qs");

const store = userStore();
const router = useRouter();
const formRef = ref();
const isDeposited = ref(false);
const isLoading = ref(true);
const payTypeClass = ref();
const payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const bankCardList = ref([]);
const privilegeList = ref([]);
const unselectedPrivileges = ref([]);
const selectedPrivilege = ref("");
const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isOpenFromAccount = ref(false);
const isUSDT = ref(false);
const verifyDepositAmount = ref([
  (val) => !!val || "Please enter a desposit amount",
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    "Deposit should be between " +
    calculatedMinDeposit.value +
    " - " +
    activeMethod.value.depositMax,
  (val) =>
    val < activeMethod.value.depositMax + 1 ||
    "Deposit should be between " +
    calculatedMinDeposit.value +
    " - " +
    activeMethod.value.depositMax
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
const calculatedMinDeposit = ref('');
function initPay() {
  $q.loading.show({
    message: "Loading bank information. Hang on..."
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((ret) => {
    $q.loading.hide();
    const res = ret.data;
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

    // if (!((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit')) {
   if (!(((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit' && !liff.isInClient()))) {

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
  await cashier.get(`/session/payment/${val.paymentId}/privileges`).then((d) => {
    const res = d.data;
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
      selectedPayType.value = value.payType
      if (selectedPayType.value && selectedPayType.value.includes("USDT")) {
        isUSDT.value = true;
      } else {
        isUSDT.value = false;
      }
      if (value.extra && value.extra.banks) {
        bankCardList.value = value.extra.banks;
      } else {
        bankCardList.value = [];
        form.bankId = null;
      }
  }
}

const depositForm = ref(null)

async function onSelect(value) {
  if(!Platform.is.android || !Platform.is.capacitor){
    clearInfo()
  }
  if (liff.isInClient()) {
    clearInfo()
  }
  depositAmtRef.value.resetValidation()
  if (value) {
    if (value.group) {
      value.children.forEach((element) => {
        if (element.hasActive) {
          activeMethod.value = element;
          checkPrivilege(element)
        }
      });
    } else {
      activeMethod.value = value;
      checkPrivilege(value)
    }
    checkMinDepositAmt()
  }
}
function checkMinDepositAmt() {
  if (!selectedPrivilege.value) {
    calculatedMinDeposit.value = activeMethod.value.depositMin
  } else {
    calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, selectedPrivilege.value.depositMin)
  }  
}

function checkPrivilege(v) {
  selectPayType(v);
  if (v.paymentId !== null && v.paymentId !== undefined) {
    loadPrivilege(v);
    // unselectedPrivileges.value = [];
  }
}

function selectedBank(bankDetail) {
  form.bankId = bankDetail.value.id;
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";
  depositForm.value.reset()
  checkMinDepositAmt()
}

const depositAmtRef = ref("");

async function confirmDeposit() {
  depositAmtRef.value.validate();
  if (depositAmtRef.value.hasError) {
  } else {
    if (freePrivilege.value) {
      if (selectedPrivilege.value) {
        form.privilegeId = selectedPrivilege.value.id + "," + freePrivilege.value.id;
      } else {
        form.privilegeId = "," + freePrivilege.value.id;
      }
    } else {
      if (selectedPrivilege.value) {
        form.privilegeId = selectedPrivilege.value.id
      } else {
        form.privilegeId = null
      }
    }

    if (store.token) {
      form.paymentId = activeMethod.value.paymentId;
      if (((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit' && !liff.isInClient())) {
      // if ((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit') {
        
        console.log(form)
        const newWin = window.open(`/depositLoading`, "Bank");
        newWin.localStorage.setItem("formDetails", JSON.stringify(form));
      } else {
        localStorage.setItem("formDetails", JSON.stringify(form));
        router.push({path: "/depositLoading"});
      }


      window.addEventListener(
        "message",
        (event) => {
          if (event.data.msg) {
            if (event.data.msg === "Success") {
              isDeposited.value = true;
              localStorage.setItem("isBacked", JSON.stringify(true));

            } else {
              $q.notify({
                color: "negative",
                position: "top",
                message: event.data.msg,
                icon: "report_problem"
              });
            }
          }
        },
        {once: true}
      );


    }
    // cashier
    //   .get(
    //     "/session/payment/" +
    //       form.paymentId +
    //       "/amount/" +
    //       form.localAmount +
    //       "/verify"
    //   )
    //   .then((res) => {
    //     const d = res.data;
    //     if (d.code === 0) {
    //       checkAmount.flag = true;
    //       if (d.message === "System Error") {
    //         console.log("Error");
    //       } else {
    //       }
    //     }
    //   })
    //   .catch((e) => {
    //     checkAmount.flag = false;
    //     checkAmount.errorMessage = e.message;
    //   });
    // const copy = { ...form };
    // const data = {};
    // Object.entries(copy).forEach(([key, value]) => {
    //   if (value) {
    //     data[key] = value;
    //   }
    // });
    // data.bankCardId = 0;
    // payTypeClass.value.submitDeposit(data);
  }
}

// async function verifyDepositAmount(r, v) {
//   if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
//     if (
//       v < activeMethod.value.depositMin ||
//       v > activeMethod.value.depositMax
//     ) {
//       return Promise.reject(
//         "Deposit should be between " +
//           activeMethod.value.depositMin +
//           " - " +
//           activeMethod.value.depositMax
//       );
//     } else {
//       if (checkAmount.flag) {
//         return Promise.resolve();
//       } else {
//         return Promise.reject(checkAmount.errorMessage);
//       }
//     }
//   }
// }

// async function verifyBank(r, v) {
//   if (bankCardList.value.length) {
//     return payTypeClass.value.validateBank(v).then((d) => {
//       if (d) {
//         return Promise.resolve();
//       } else {
//         return Promise.reject("Bank is required");
//       }
//     });
//   }
// }

onMounted(() => {
  initPay();
});
</script>

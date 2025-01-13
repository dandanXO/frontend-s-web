<template>
  <div class="q-pa-xs" style="overflow: auto; margin: 0px 8px">
    <!-- <div class="q-mb-lg">
      <span class="additional-tips">
        {{ $t("lang.deposit_encounterproblem") }}
      </span>
    </div> -->

    <div class="node-wrapper">
      <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
    </div>

    <div v-if="isDisplay" class="inner-cont" style="overflow: auto">
      <div class="submit-message">
        <div class="line">
          <span>{{ $t("lang.dv_bank_name") }}：</span>
          <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('0')" class="common-btn">
            {{ copybtntxt0 }}
          </q-btn>
        </div>
        <div class="line">
          <span>{{ $t("lang.dv_bank_acc") }}：</span>
          <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('1')" class="common-btn">
            {{ copybtntxt1 }}
          </q-btn>
        </div>
        <div class="line">
          <span>{{ $t("lang.dv_bank_card_no") }}：</span>
          <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('2')" class="common-btn">
            {{ copybtntxt2 }}
          </q-btn>
        </div>
        <div class="line">
          <span>{{ $t("lang.dv_branch") }}：</span>
          <span class="info" ref="subMsg4">{{ submitMessage[4] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('4')" class="common-btn">
            {{ copybtntxt4 }}
          </q-btn>
        </div>
        <div class="line">
          <span>{{ $t("lang.dv_deposit_amount") }}：</span>
          <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('3')" class="common-btn">
            {{ copybtntxt3 }}
          </q-btn>
        </div>
        <div class="line" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
          <span>{{ $t("lang.dv_remark") }}：</span>
          <span class="info" ref="subMsg5">{{ submitMessage[5] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('5')" class="common-btn">
            {{ copybtntxt5 }}
          </q-btn>
        </div>
      </div>

      <q-btn no-caps color="brightbtn" class="common-btn q-mt-md" @click="recoverDepositState()">
        Make another deposit
      </q-btn>
    </div>
    <div class="deposit-container" v-else>
      <q-form ref="depositForm" class="q-gutter-y-xs">
        <q-input
          v-if="amountList.length === 0"
          hide-bottom-space
          ref="depositAmtRef"
          type="number"
          :label="$t('lang.withdraw_amount')"
          class="deposit-field"
          color="accent"
          name="localAmount"
          v-model="form.localAmount"
          :placeholder="$t('lang.deposit_enter_deposit_amount')"
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
          :label="$t('lang.deposit_select_amount')"
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

        <div class="q-mt-xs q-mb-sm text-grey text-bold">
          {{ $t("lang.deposit_minamount") }}:
          {{
            calculatedMinDeposit
              ? calculatedMinDeposit.toLocaleString() + " " + (isUSDT ? "USDT" : store.currency.value)
              : 0
          }}
          &nbsp;&nbsp;&nbsp;&nbsp;
          {{ $t("lang.deposit_maxamount") }}:
          {{
            activeMethod.depositMax
              ? activeMethod.depositMax.toLocaleString() + " " + (isUSDT ? "USDT" : store.currency.value)
              : " "
          }}
        </div>

        <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-xs" label="兑换率">
          <label class="label" style="width: 130px; display: inline-block;">{{ $t('lang.deposit_realtimeexchangerates') }}</label>
          <span class="text-positive">
            1.00 USDT ≈ {{ activeMethod.currencyRate }}
            {{ store.currency.value }}
          </span>
        </div>
        <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-xs" label="预计到账">
          <label class="label" style="width: 130px; display: inline-block;">{{ $t('lang.deposit_estimatedarrival') }}</label>
          <span class="text-positive">
            {{
              calculatedMinDeposit && form.localAmount < calculatedMinDeposit
                ? "0.00"
                : (form.localAmount * activeMethod.currencyRate).toFixed(2)
            }}
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
          ref="offerRef"
          class="deposit-selection q-mt-xs"
          :label="$t('lang.deposit_promo')"
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
        <div>
          <q-btn
            class="common-large-btn"
            :loading="btnLoading"
            color="brightbtn fit"
            @click="confirmDeposit"
            no-caps
            :label="$t('lang.deposit_confirm')"
          />
        </div>
        <div class="q-mt-sm" v-html="activeMethod.msg"></div>
        <!-- <div class="q-mt-md">更新个人信息的新帐户可以参与促销活动。</div> -->
      </q-form>
    </div>
  </div>

  <q-dialog class="modal-common-div" width="100%" v-model="isDeposited">
    <q-card style="width: 100%; padding: 1rem 0.5rem">
      <q-card-section class="contents q-pa-md">
        <strong class="black-titles">已存款</strong>
        <br />
        <div style="padding: 20px">
          <q-card-section class="q-mb-md q-pa-md">
            您将被重定向到您的银行页面以完成存款。
            <br />
            入金成功后会反映这里。
          </q-card-section>
          <q-btn class="common-md-btn" @click="clearInfo" label="明白" color="brightbtn" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents">
        <strong class="black-titles">{{ $t("lang.deposit_tipstitle") }}</strong>
        <br />
        <br />
        {{ $t("lang.deposit_tiptologin") }}
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" no-caps :label="$t('lang.deposit_proceedverify')" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" width="100%" v-model="isNoRealName" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents q-mb-md">
        <strong>{{ $t("lang.deposit_tipstitle") }}</strong>
        <br />
        <br />
        {{ $t("lang.deposit_tiptorealname") }}
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" no-caps :label="$t('lang.deposit_proceedverify')" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, shallowRef, watch } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { api, cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import { doIt } from "boot/action";
import liff from "@line/liff";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { isOperaPixelUrl } from "boot/utils";

const store = userStore();
const route = useRoute();
const { t } = useI18n();
const router = useRouter();
const formRef = ref();
const isNewUser = ref(false);
const isNoBankCard = ref(false);
const isNoRealName = ref(false);
const isDeposited = ref(false);
const checkNewUser = () => {
  if (store.phone === "" || store.phone === null) {
    isNewUser.value = true;
    return;
  }
  if (store.realName === "" || store.realName === null) {
    isNoRealName.value = true;
    return;
  }
  // else {
  //   api.get("/session/bankCard").then((response) => {
  //     if (response.code === 0) {
  //       if (response.data.length === 0) {
  //         isNoBankCard.value = true;
  //       }
  //     }
  //   });
  // }
};

const isLoading = ref(true);
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
const isOpenFromAccount = ref(false);
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const subMsg4 = ref();
const subMsg5 = ref();
const copybtntxt0 = ref(t("lang.dv_copy"));
const copybtntxt1 = ref(t("lang.dv_copy"));
const copybtntxt2 = ref(t("lang.dv_copy"));
const copybtntxt3 = ref(t("lang.dv_copy"));
const copybtntxt4 = ref(t("lang.dv_copy"));
const copybtntxt5 = ref(t("lang.dv_copy"));
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
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4, copybtntxt5];
  copybtntxt[position].value = t("lang.dv_copied");
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};
const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4, copybtntxt5];
  copybtntxt.forEach((element) => {
    element.value = t("lang.dv_copy");
  });
};

// const verifyDepositAmount = ref([
//   (val) => !!val || t("lang.deposit_please_enter_deposit"),
//   (val) => (val && /^\d+$/.test(val)) || t("lang.deposit_cantcontaindecimals"),
//   (val) =>
//     val > calculatedMinDeposit.value - 1 ||
//     t("lang.deposit_between") +
//       calculatedMinDeposit.value.toLocaleString() +
//       " - " +
//       activeMethod.value.depositMax.toLocaleString(),
//   (val) =>
//     val < activeMethod.value.depositMax + 1 ||
//     t("lang.deposit_between") +
//       calculatedMinDeposit.value.toLocaleString() +
//       " - " +
//       activeMethod.value.depositMax.toLocaleString()
// ]);

const verifyDepositAmount = ref([
  (val) => !!val || t("lang.deposit_please_enter_deposit"),
  (val) => (val && /^\d+(,\d{3})*(\.\d+)?$/.test(val.replace(/,/g, ""))) || t("lang.deposit_cantcontaindecimals"),
  (val) => {
    const value = parseFloat(val.replace(/,/g, ""));
    return (
      value > calculatedMinDeposit.value - 1 ||
      `${t(
        "lang.deposit_between"
      )}${calculatedMinDeposit.value.toLocaleString()} - ${activeMethod.value.depositMax.toLocaleString()}`
    );
  },
  (val) => {
    const value = parseFloat(val.replace(/,/g, ""));
    return (
      value < activeMethod.value.depositMax + 1 ||
      `${t(
        "lang.deposit_between"
      )}${calculatedMinDeposit.value.toLocaleString()} - ${activeMethod.value.depositMax.toLocaleString()}`
    );
  }
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

const initPay = () => {
  $q.loading.show({
    message: t("lang.deposit_loadingdatapleasewait")
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((res) => {
    $q.loading.hide();
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
};

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
          }
        }
      });

      unselectedPrivileges.value.push({
        code: "LATER",
        depositMin: 0,
        id: 0,
        name: t("lang.choose_later"),
        payTypes: "",
        triggerType: ""
      });
    } else {
      hasPrivilege.value = false;
      privilegeList.value = [];
    }
  });
}

watch(selectedPrivilege, (newVal) => {
  if (newVal && newVal.id === 0) {
    selectedPrivilege.value = null;
  }
});

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

function selectedBank(value) {
  form.bankId = value.value.id;
}

function clearInfo() {
  // isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";
  if (depositForm.value) {
    depositForm.value.reset();
  }
  checkMinDepositAmt();
}

const depositAmtRef = ref("");

async function confirmDeposit() {
  if (!extensionState.value && (store.phone === "" || store.phone === null)) {
    isNewUser.value = true;
  } else if (!extensionState.value && (store.realName === "" || store.realName === null)) {
    isNoRealName.value = true;
  } else {
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
      // const res = ret.data
      // console.log(res)
      if (res.code === 0) {
        if (
          isOperaPixelUrl()
        ) {
          otag("event", "deposit");
        }

        console.log(res);
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
                  message: t("lang.deposit_allowpopups"),
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

const currentPath = ref(route.path);
const extensionState = ref(false);
const extensionToken = ref("");
const checkExtension = () => {
  // console.log(currentPath.value);
  if (currentPath.value === "/deposit") {
    // const eToken = ref(route.query.name);
    extensionToken.value = route.query.token;
    extensionState.value = true;
    // store.dispatch("token", extensionToken);
    console.log(store);
  }
};

const recoverDepositState = () => {
  isDisplay.value = false;
  form.localAmount = "";
};

onMounted(() => {
  initPay();
  if (route.meta && route.meta.isApp) {
    checkExtension();
  }
  if (route.meta && !route.meta.isApp) {
    checkNewUser();
  }
});
</script>

<style lang="scss">
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
    background: #063c50;
    padding: 10px;

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

.q-select__dialog .q-field__control {
  background: #4fb2ff !important;
}

.deposit-selection {
  &.q-field {
    border-radius: 10px;
    box-shadow: $shadow-bg;
  }
  &.q-field--float .q-field__label {
    display: none;
  }
  .q-field--auto-height .q-field__native {
    line-height: 48px;
  }
  .q-field__control {
    min-height: 48px;
    height: 48px;

    .q-field__control-container {
      padding-top: 0px;
    }
    .q-field__marginal {
      height: 48px;
    }

    .q-field__label {
      line-height: 16px;
    }
  }
}

.deposit-field {
  &.q-field {
    border-radius: 10px;
    padding: 0px 8px 5px;
    background: rgba(0, 0, 0, 0.05);
    box-shadow: $shadow-bg;
  }

  .q-field--highlighted .q-field__label {
    color: $dark;
  }

  .q-field__control {
    min-height: 48px;
    height: 48px;

    .q-field__control-container {
      padding-top: 0px;
    }
    .q-field__marginal {
      height: 48px;
    }
  }
}
</style>

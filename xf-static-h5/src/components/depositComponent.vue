<template>
  <div class="q-pa-md">
    <div class="node-wrapper">
      <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
    </div>

    <div v-if="isDisplay" class="inner-cont transfer-details" style="overflow: auto">
      <div class="submit-message">
        <div class="line">
          <span>银行名称：</span>
          <q-input
            hide-bottom-space
            ref="subMsg0"
            label-color="brand"
            clearable
            v-model="submitMessage[0]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('0')" class="common-btn">
                {{ copybtntxt0 }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="line">
          <span>银行户名：</span>
          <q-input
            hide-bottom-space
            ref="subMsg1"
            label-color="brand"
            clearable
            v-model="submitMessage[1]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('1')" class="common-btn">
                {{ copybtntxt1 }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="line">
          <span>银行卡号：</span>
          <q-input
            hide-bottom-space
            ref="subMsg2"
            label-color="brand"
            clearable
            v-model="submitMessage[2]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('2')" class="common-btn">
                {{ copybtntxt2 }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="line">
          <span>支付行：</span>
          <q-input
            hide-bottom-space
            ref="subMsg4"
            label-color="brand"
            clearable
            v-model="submitMessage[4]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('4')" class="common-btn">
                {{ copybtntxt4 }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="line">
          <span>存款金额：</span>
          <q-input
            hide-bottom-space
            ref="subMsg3"
            label-color="brand"
            clearable
            v-model="submitMessage[3]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('3')" class="common-btn">
                {{ copybtntxt3 }}
              </q-btn>
            </template>
          </q-input>
        </div>
        <div class="line" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
          <span>备注：</span>

          <q-input
            hide-bottom-space
            ref="subMsg5"
            label-color="brand"
            clearable
            v-model="submitMessage[5]"
            rounded
            outlined
            color="white"
            bg-color="recinputstyle"
          >
            <template v-slot:append>
              <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('5')" class="common-btn">
                {{ copybtntxt5 }}
              </q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <div class="deposit-container q-mt-md" v-else>
      <q-form ref="depositForm" class="q-gutter-y-xs">
        <div v-if="amountList.length === 0">
          <div class="input-submit-wrapper">
            <!-- <div class="">存款金额</div> -->
            <q-input
              hide-bottom-space
              ref="depositAmtRef"
              v-model="form.localAmount"
              :placeholder="isUSDT ? '请输入USDT金额' : '请输入存款金额'"
              :rules="verifyDepositAmount"
              label-color="brand"
              clearable
              rounded
              outlined
              color="white"
              bg-color="recinputstyle"
            ></q-input>

            <div class="">
              <q-btn
                :loading="btnLoading"
                class="deposit-btn"
                color="brightbtn"
                @click="confirmDeposit"
                label="确认"
                rounded
              />
            </div>
          </div>
        </div>
        <div class="" v-else>
          <div class="input-submit-wrapper">
            <q-select
              class="deposit-input"
              ref="depositAmtRef"
              label="选择金额"
              name="localAmount"
              :options="amountList"
              v-model="form.localAmount"
              :rules="verifyDepositAmount"
              padding="none"
              emit-value
              map-options
              style="width: 100%"
              rounded
              outlined
              color="white"
              bg-color="recinputstyle"
            >
              <template v-slot:prepend>
                <span style="font-size: 26px" class="text-white">
                  {{ store.currency.value }}
                </span>
              </template>
            </q-select>
            <div>
              <q-btn
                color="brightbtn"
                rounded
                :loading="btnLoading"
                class="deposit-btn"
                @click="confirmDeposit"
                label="确认"
                style="height: 56px"
              />
            </div>
          </div>
        </div>

        <div class="q-mt-sm text-gray">
          单笔存款：{{
            calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0
          }}
          -
          {{
            activeMethod.depositMax
              ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value)
              : "No Limit"
          }}
        </div>

        <div v-if="isUSDT && activeMethod.currencyRate">
          <div class="q-mt-md text-gray">
            实时汇率:
            <span class="text-neontb">
              1.00 USDT ≈ {{ activeMethod.currencyRate }}
              {{ store.currency.value }}
            </span>
          </div>
          <div class="q-my-xs text-gray">
            预计到帐:
            <span class="text-neontb">
              {{
                calculatedMinDeposit && form.localAmount < calculatedMinDeposit
                  ? "0.00"
                  : (form.localAmount * activeMethod.currencyRate).toFixed(2)
              }}
              {{ store.currency.value }}
            </span>
          </div>
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
          class="q-mt-md"
          label="选择优惠"
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege && !isUSDT"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          clearable
          style="width: 100%"
          @update:model-value="checkMinDepositAmt"
          rounded
          outlined
          color="white"
          bg-color="recinputstyle"
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

        <div
          class="rollover-info"
          v-if="
            selectedPrivilege &&
            selectedPrivilege.name &&
            (selectedPrivilege.gameTypeRollover || selectedPrivilege.rollover)
          "
        >
          <span v-if="selectedPrivilege.depositMin">
            优惠最低存款要求：{{ selectedPrivilege.depositMin }}元，&nbsp;&nbsp;&nbsp;
          </span>
          <span v-if="selectedPrivilege.gameTypeRollover && selectedPrivilege.gameTypeRollover !== '{}'">
            {{ getRollOverText(selectedPrivilege.gameTypeRollover) }}
          </span>
          <span v-else>流水倍数要求（本金 + 彩金）：{{ selectedPrivilege.rollover }}倍</span>
        </div>

        <div class="q-mt-md text-gray" v-html="activeMethod.msg"></div>
        <!-- <div class="q-mt-md">更新个人信息的新帐户可以参与促销活动。</div> -->
        <!-- <div class="q-mt-md">
          <q-btn
              :loading="btnLoading"
              color="brightbtn fit"
              @click="confirmDeposit"
              label="确定存款"
          />
        </div> -->
      </q-form>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%">
      <q-card-section style="padding: 10px 20px" class="text-white q-pa-md bg-primary">已存款</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          您将被重定向到您的银行页面以完成存款。
          <br />
          <br />
          入金成功后会反映这里。
        </q-card-section>
        <q-btn @click="clearInfo" label="明白" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 20px" class="text-white">
      <q-card-section class="q-mb-md">
        <strong style="display: inline-block; padding-bottom: 12px; font-size: 20px">完成以下认证才可以存款</strong>
        <div v-if="!store.realName" style="margin: 16px 0">
          <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between">
            <div class="">
              <p style="margin: 0; color: #fff; font-size: 16px">存款需要绑定真实姓名</p>
              <div style="font-size: 12px; color: #d1d1d1">为了您的资金安全，银行卡姓名需一致</div>
            </div>
            <q-btn @click="router.push('/account/personal')" color="brightbtn" label="去绑定" />
          </div>
        </div>

        <div v-if="!store.phone">
          <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between">
            <div class="">
              <p style="margin: 0; color: #fff; font-size: 16px">存款需要绑定手机号</p>
              <div style="font-size: 12px; color: #d1d1d1">为了您的资金安全，请绑定手机号</div>
            </div>

            <q-btn @click="router.push('/account/personal')" color="brightbtn" label="去绑定" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn style="width: 100%" label="暂不认证" color="brightbtn" @click="isNewUser = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isNoBankCard" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 20px" class="text-white">
      <q-card-section class="q-mb-md">
        <strong>温馨提示</strong>
        <br />
        <br />
        为保证资金安全，存款前先绑定银行卡
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/withdraw">
          <q-btn label="前往绑定" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { api, cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import { doIt } from "boot/action";
import liff from "@line/liff";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();
const formRef = ref();
const isNewUser = ref(false);
const isNoBankCard = ref(false);
const checkNewUser = () => {
  if (!store.phone || !store.realName) {
    isNewUser.value = true;
    return false;
  }
  // else {
  //   api.get("/session/bankCard").then((response) => {
  //     if (response.code === 0) {
  //       if (response.data.length === 0) {
  //         isNoBankCard.value = true;
  //       }
  //     }
  //   });
  //
  //
  // }
  return true;
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
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const subMsg4 = ref();
const subMsg5 = ref();
const copybtntxt0 = ref("复制");
const copybtntxt1 = ref("复制");
const copybtntxt2 = ref("复制");
const copybtntxt3 = ref("复制");
const copybtntxt4 = ref("复制");
const copybtntxt5 = ref("复制");
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
  copybtntxt[position].value = "已复制";
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};
const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4, copybtntxt5];
  copybtntxt.forEach((element) => {
    element.value = "复制";
  });
};

const isValidDecimal = () => {
  const decimalPattern = /^[0-9]*(\.[0-9]{0,2})?$/;
  return decimalPattern.test(form.localAmount) || "金额数字不正确";
};

const verifyDepositAmount = ref([
  (val) => !!val || "请输入金额",
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    "存款应介于 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax,
  (val) =>
    val < activeMethod.value.depositMax + 1 ||
    "存款应介于 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
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
    message: "加载数据中... 请稍等..."
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((res) => {
    $q.loading.hide();
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
  freePrivilege.value = null;
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

const getRollOverText = (rolltext) => {
  const thetext = JSON.parse(rolltext);

  var fulltext = "流水倍数要求（本金 + 彩金）：";
  var rolloverlists = [];
  if (thetext.sport) {
    rolloverlists.push("体育" + thetext.sport + "倍");
  }
  if (thetext.esport) {
    rolloverlists.push("电竞" + thetext.esport + "倍");
  }
  if (thetext.slot) {
    rolloverlists.push("电子" + thetext.slot + "倍");
  }
  if (thetext.live) {
    rolloverlists.push("真人" + thetext.live + "倍");
  }
  if (thetext.poker) {
    rolloverlists.push("棋牌" + thetext.poker + "倍");
  }
  if (thetext.fish) {
    rolloverlists.push("捕鱼" + thetext.fish + "倍");
  }
  if (thetext.lottery) {
    rolloverlists.push("彩票" + thetext.lottery + "倍");
  }
  if (thetext.casual) {
    rolloverlists.push("小游戏" + thetext.casual + "倍");
  }
  fulltext += rolloverlists.join("，");
  return fulltext;
};

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
  // debugger;
  form.bankId = value.id;
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
  if (!checkNewUser()) return;

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
      // const res = ret.data
      // console.log(res)

      if (res.code === 0) {
        console.log("After SDubmit");
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

onMounted(() => {
  initPay();
  checkNewUser();
});
</script>

<style lang="scss">
.deposit-container {
  font-family: "PingFang";
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
  gap: 24px;

  .line {
    display: flex;
    gap: 10px;
    flex-direction: column;
    width: 100%;
    font-size: 14px;

    span:first-child {
      // flex: 1;
      color: #ffffff;
      // width: 80px;
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

.input-submit-wrapper {
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
  gap: 15px;
}

.deposit-btn {
  width: 100%;
  height: 100%;
  font-size: 18px;
}

.flex-c-center {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  // .deposit-input {
  //   width: 70%;
  // }
  // .deposit-btn {
  //   width: 25%;
  //   height: 56px;
  //   font-size: 20px;
  //   white-space: nowrap;
  //   background-color: #33bcd4;
  // }
}
.additional-tips {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff0000;
  font-size: 14px;
}

// .q-select__dialog .q-field__control {
//   background: #4fb2ff !important;
// }

.rollover-info {
  color: #bd4646;
  font-size: 12px;
}

.transfer-details {
  background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
  border-radius: 6px;
  padding: 24px 16px;
}

.q-field--outlined .q-field__control:before {
  box-shadow: 0px 0px 2.78px 0px rgba(169, 201, 234, 1) inset;
  border: none;
}

.text-gray {
  color: #7a80a1;
}
</style>

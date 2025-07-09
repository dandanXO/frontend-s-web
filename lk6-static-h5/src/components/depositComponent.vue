<template>
  <!--  <pre>extensionState: {{ extensionState }}</pre>-->
  <!--  <pre>extensionToken: {{ extensionToken }}</pre>-->
  <!--  <pre>store:{{ store }}</pre>-->

  <div class="q-pa-md deposit-section" style="overflow: auto">
    <!-- <label class="label">支付方式</label> -->
    <div class="node-wrapper q-mt-xs">
      <Node :level="1" :list="payMethods" name="支付方式" ref="paymentNode" @clicked="onSelect" />
    </div>

    <div v-if="isDisplay" class="inner-cont" style="overflow: auto">
      <div class="submit-message">
        <div class="line">
          <span>银行名称：</span>
          <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
          <button @blur="blurCode" @click="copyMessage('0')" class="common-btn">
            {{ copybtntxt0 }}
          </button>
        </div>
        <div class="line">
          <span>银行户名：</span>
          <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
          <button @blur="blurCode" @click="copyMessage('1')" class="common-btn">
            {{ copybtntxt1 }}
          </button>
        </div>
        <div class="line">
          <span>银行卡号：</span>
          <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
          <button @blur="blurCode" @click="copyMessage('2')" class="common-btn">
            {{ copybtntxt2 }}
          </button>
        </div>
        <div class="line">
          <span>支付行</span>
          <span class="info" ref="subMsg4">{{ submitMessage[4] }}</span>
          <button @blur="blurCode" @click="copyMessage('4')" class="common-btn">
            {{ copybtntxt4 }}
          </button>
        </div>
        <div class="line">
          <span>存款金额：</span>
          <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
          <button @blur="blurCode" @click="copyMessage('3')" class="common-btn">
            {{ copybtntxt3 }}
          </button>
        </div>
        <div class="line" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
          <span>备注：</span>
          <span class="info" ref="subMsg5">{{ submitMessage[5] }}</span>
          <button @blur="blurCode" @click="copyMessage('5')" class="common-btn">
            {{ copybtntxt5 }}
          </button>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="deposit-container">
        <label class="deposit-label">存款金额</label>
        <q-form ref="depositForm" class="q-gutter-y-xs">
          <div class="flex-c-center" v-if="amountList.length === 0">
            <q-input
              class="deposit-input"
              hide-bottom-space
              ref="depositAmtRef"
              name="localAmount"
              standout
              clearable
              v-model="form.localAmount"
              placeholder="输入金额"
              :rules="verifyDepositAmount"
              padding="none"
            ></q-input>
          </div>
          <div class="flex-c-center" v-else>
            <q-select
              class="deposit-input"
              ref="depositAmtRef"
              label="选择金额"
              name="localAmount"
              standout
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
            <q-btn color="dygreen" :loading="btnLoading" class="deposit-btn" @click="confirmDeposit" label="存款" />
          </div>

          <div class="q-mt-sm deposit-limit">
            单笔存款：{{
              calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0
            }}
            -
            {{
              activeMethod.depositMax ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value) : " "
            }}
          </div>

          <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-md row align-center" label="兑换率">
            <label class="label">实时汇率：</label>
            <span class="label-green" style="font-size: 16px; font-weight: 600">
              1.00 USDT ≈ {{ activeMethod.currencyRate }}
              {{ store.currency.value }}
            </span>
          </div>

          <div v-if="isUSDT && activeMethod.currencyRate" class="q-pb-md" label="预计到账">
            <label class="label">预计到账：</label>
            <span class="label-green" style="font-size: 16px; font-weight: 600">
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
            class="q-mt-md deposit-input"
            label="选择优惠"
            standout
            :options="unselectedPrivileges"
            v-model="selectedPrivilege"
            emit-value
            v-if="hasPrivilege"
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

          <div class="q-mt-md" v-html="activeMethod.msg"></div>
          <!-- <div class="q-mt-md">更新个人信息的新帐户可以参与促销活动。</div> -->
          <!-- <div class="q-mt-md">
            <q-btn color="dygreen" :loading="btnLoading" class="fit" @click="confirmDeposit" label="确定存款" />
          </div> -->
        </q-form>
      </div>
      <q-btn :loading="btnLoading" class="deposit-btn" @click="confirmDeposit" label="存款" />
    </template>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%">
      <q-card-section style="padding: 10px 20px" class="text-white q-pa-md bg-dyblue">已存款</q-card-section>
      <div style="padding: 20px">
        <q-card-section class="q-mb-md q-pa-md">
          您将被重定向到您的银行页面以完成存款。
          <br />
          <br />
          入金成功后会反映这里。
        </q-card-section>
        <q-btn @click="clearInfo" label="明白" color="dyblue" />
      </div>
    </q-card>
  </q-dialog>

  <CommonModal
    v-model="isNewUser"
    header="温馨提示"
    message="为保证资金安全，存款前需先验证手机号"
    no-backdrop-dismiss
    no-esc-dismiss
    :closable="false"
  >
    <template #action>
      <div />
      <div class="confirmsbtns common-md-btn">
        <router-link to="/account/verifyTelephone">前往验证</router-link>
      </div>
      <div />
    </template>
  </CommonModal>

  <!--  <q-dialog width="100%" v-model="isNoBankCard" no-backdrop-dismiss no-esc-dismiss>-->
  <!--    <q-card style="width: 100%; padding: 20px; flex-direction:column;" class="text-black">-->
  <!--      <q-card-section class="text-center q-mb-md" style="flex-direction:column;">-->
  <!--        <strong>温馨提示</strong>-->
  <!--        <br/>-->
  <!--        为保证资金安全，存款前先绑定银行卡-->
  <!--      </q-card-section>-->
  <!--      <q-card-actions align="right">-->
  <!--        <router-link to="/account/withdraw">-->
  <!--          <q-btn label="前往绑定" color="dyblue"/>-->
  <!--        </router-link>-->
  <!--      </q-card-actions>-->
  <!--    </q-card>-->
  <!--  </q-dialog>-->
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, onActivated, shallowRef } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { api, cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import { doIt } from "boot/action";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import CommonModal from "./CommonModal.vue";

const store = userStore();
const route = useRoute();
const router = useRouter();
const formRef = ref();
const isNewUser = ref(false);
const isNoBankCard = ref(false);
const checkNewUser = () => {
  if (store.phone === "" || store.phone === null) {
    // isNewUser.value = true;
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

const verifyDepositAmount = ref([
  (val) => !!val || "请输入金额",
  (val) => (val && /^\d+$/.test(val)) || (val && isUSDT.value) || "存款金额不能带有小数",
  (val) =>
    val >= calculatedMinDeposit.value ||
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

    // if (!((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit')) {
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
    if (isUSDT.value) {
      calculatedMinDeposit.value = Math.max(
        activeMethod.value.depositMin,
        parseFloat(selectedPrivilege.value.depositMin / activeMethod.value.currencyRate).toFixed(2)
      );
    } else {
      calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, selectedPrivilege.value.depositMin);
    }
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
  // if (form.bankId !== null || isUSDT.value) {
  if (!extensionState.value && (store.phone === "" || store.phone === null)) {
    isNewUser.value = true;
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
  // } else {
  //   $q.notify({
  //     color: "negative",
  //     position: "top",
  //     message: "请选择银行",
  //     icon: "report_problem"
  //   });
  // }
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
            Platform.is.name !== "webkit"
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
                  message: '无法打开充值页面。请检查游览器是否拦截弹窗页面，并修改为"允许弹窗"后再进行充值操作。',
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
                Platform.is.name !== "webkit"
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
        selectedPrivilege.value = "";
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

onMounted(() => {
  initPay();
  if (route.meta && route.meta.isApp) {
    checkExtension();
  }
});

onActivated(() => {
  console.log(route.meta.isApp);
  if (route.meta && !route.meta.isApp) {
    checkNewUser();
  }
});
</script>

<style lang="scss">
.submit-message {
  // width: calc(100% - 40px);
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
    background: #ffffff;
    padding: 15px 0;

    span:first-child {
      // flex: 1;
      color: #4669f8;
      width: 80px;
    }

    span.info {
      flex: 3;
    }

    button {
      width: 80px;
    }
  }
}
.flex-c-center {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.deposit-input {
  width: 100%;
  border-radius: 7px;
  overflow: hidden;

  .q-field__inner {
    .q-field__control,
    .q-field__marginal {
      height: 44px;
    }
    .q-field__control {
      background: #fcfdfe;
      box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;

      &::before {
        border-bottom: none;
      }

      .q-field__native,
      .q-field__append {
        color: #333;
        &::placeholder {
          color: #a4aabb;
          opacity: 1;
        }
      }

      .q-field__label {
        color: #a4aabb;
      }
    }
  }
}
.deposit-btn {
  width: 100%;
  background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
  border: 1px solid #ffffff;
  box-shadow: 0px 2px 0px 0px #9ab0ff70;
  border-radius: 30px;
  padding: 12px auto;
  font-size: 16px;
  white-space: nowrap;
  color: #fff;
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

.deposit-section {
  .label {
    font-size: 16px;
    color: #7a80a1;
  }

  .label-green {
    font-weight: 600;
    color: #00b05c;
  }

  .confirm-btn {
    background: linear-gradient(180deg, #58db8c, #0d932b);
    font-size: 16px;
    font-weight: 600;
    height: 45px;
    width: 100%;
    color: #fff;
    letter-spacing: 1px;
    border-radius: 12px;
  }
}

.rollover-info {
  color: #ff2c2c;
  font-size: 12px;
}

.deposit-container {
  background: #fff;
  padding: 12px;
  border-radius: 7px;
  margin-bottom: 16px;

  .deposit-limit {
    color: #7a80a1;
  }

  .deposit-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #424f72;
  }
}
</style>

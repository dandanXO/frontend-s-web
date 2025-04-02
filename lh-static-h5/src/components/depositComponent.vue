<template>
  <div class="loader" v-if="isFetchingApi" />
  <div class="q-pa-xs" style="overflow: auto; margin: 2px 8px">
    <DepositWithdrawTransferTabs
      v-if="$q.dark.isActive"
      activeTab="deposit"
      redirect="finance/deposit"
      style="padding: 10px 0px 10px"
    />
    <div class="q-mb-sm">
      <!--      <span class="additional-tips">如果遇到存款问题，请立即联系在线客服解决！</span>-->
    </div>

    <div class="node-wrapper">
      <Node :level="1" :list="payMethods" :gridcol="4" ref="paymentNode" @clicked="onSelect" />
    </div>

    <div v-if="isDisplay" class="inner-cont" style="overflow: auto">
      <div class="submit-message">
        <div class="line">
          <span>银行名称：</span>
          <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('0')" class="common-btn">
            {{ copybtntxt0 }}
          </q-btn>
        </div>
        <div class="line">
          <span>银行户名：</span>
          <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('1')" class="common-btn">
            {{ copybtntxt1 }}
          </q-btn>
        </div>
        <div class="line">
          <span>银行卡号：</span>
          <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('2')" class="common-btn">
            {{ copybtntxt2 }}
          </q-btn>
        </div>
        <div class="line">
          <span>支付行</span>
          <span class="info" ref="subMsg4">{{ submitMessage[4] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('4')" class="common-btn">
            {{ copybtntxt4 }}
          </q-btn>
        </div>
        <div class="line">
          <span>存款金额：</span>
          <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('3')" class="common-btn">
            {{ copybtntxt3 }}
          </q-btn>
        </div>
        <div class="line" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
          <span>备注：</span>
          <span class="info" ref="subMsg5">{{ submitMessage[5] }}</span>
          <q-btn color="brightbtn" @blur="blurCode" @click="copyMessage('5')" class="common-btn">
            {{ copybtntxt5 }}
          </q-btn>
        </div>
      </div>
    </div>
    <div class="deposit-container" v-else-if="$q.dark.isActive">
      <q-form ref="depositForm" class="q-gutter-y-xs deposit-container-form">
        <div v-if="amountList.length === 0" class="input-money q-mb-xs">
          <div class="input-currency">
            {{ isUSDT ? "USDT" : store.currency.value }}
          </div>

          <q-input
            ref="depositAmtRef"
            class="deposit-field"
            color="accent"
            name="localAmount"
            v-model="form.localAmount"
            :placeholder="isUSDT ? '请输入USDT金额' : '请输入存款金额'"
            :rules="verifyDepositAmount"
            clearable
            dense
            flat
            outlined
            hide-bottom-space
          ></q-input>
        </div>
        <div v-else class="flex-c-center q-mb-md">
          <div class="input-currency">
            {{ store.currency.value }}
          </div>

          <q-select
            ref="depositAmtRef"
            label="选择金额"
            name="localAmount"
            class="deposit-selection"
            flat
            outlined
            color="accent"
            :options="amountList"
            v-model="form.localAmount"
            :rules="verifyDepositAmount"
            padding="none"
            dense
          ></q-select>
        </div>

        <div class="q-mb-xs" style="color: #98a7b5">
          单笔存款：{{
            calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0
          }}
          -
          {{ activeMethod.depositMax ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value) : " " }}
        </div>

        <div v-if="isUSDT && activeMethod.currencyRate" class="currency-info q-mb-xs">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>实时汇率：</span>
            <span>
              1.00 USDT ≈ {{ activeMethod.currencyRate }}
              {{ store.currency.value }}
            </span>
          </div>
          <div style="display: flex; justify-content: center; align-items: center">
            <span>预计到帐：</span>
            <span class="text-white">
              {{
                calculatedMinDeposit && form.localAmount < calculatedMinDeposit
                  ? "0.00"
                  : (form.localAmount * activeMethod.currencyRate).toFixed(2)
              }}
            </span>
            <span>&nbsp;{{ store.currency.value }}</span>
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
          style="width: 100%"
          ref="offerRef"
          class="deposit-selection q-mb-md"
          label="选择优惠"
          flat
          outlined
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          clearable
          @update:model-value="checkMinDepositAmt"
          dense
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
          <span v-else>流水倍数要求（本金+彩金）：{{ selectedPrivilege.rollover }}倍</span>
        </div>

        <q-btn class="deposit-btn" :loading="btnLoading" @click="confirmDeposit" label="确认" />
      </q-form>

      <div class="q-mt-sm active-method-msg" v-html="activeMethod.msg"></div>
    </div>
    <div class="deposit-container" v-else>
      <q-form ref="depositForm" class="q-gutter-y-xs">
        <div v-if="amountList.length === 0" class="flex-c-center input-money">
          <q-input
            hide-bottom-space
            ref="depositAmtRef"
            :label="isUSDT ? '请输入USDT金额' : '请输入存款金额'"
            class="deposit-field"
            color="accent"
            name="localAmount"
            v-model="form.localAmount"
            placeholder="请输入存款金额"
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

          <q-btn
            class="common-large-btn deposit-btn"
            :loading="btnLoading"
            color="brightbtn"
            @click="confirmDeposit"
            label="确认"
          />
        </div>
        <div v-else class="flex-c-center">
          <q-select
            ref="depositAmtRef"
            label="选择金额"
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

          <q-btn
            class="common-large-btn deposit-btn"
            :loading="btnLoading"
            color="brightbtn"
            @click="confirmDeposit"
            label="确认"
          />
        </div>

        <div class="q-mb-xs text-grey text-bold">
          单笔存款：{{
            calculatedMinDeposit ? calculatedMinDeposit + " " + (isUSDT ? "USDT" : store.currency.value) : 0
          }}
          -
          {{ activeMethod.depositMax ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value) : " " }}
        </div>

        <div v-if="isUSDT && activeMethod.currencyRate">
          <div style="display: flex; justify-content: center; align-items: center">
            <span style="flex: 1">实时汇率：</span>
            <span style="flex: 3" class="text-positive">
              1.00 USDT ≈ {{ activeMethod.currencyRate }}
              {{ store.currency.value }}
            </span>
          </div>
          <div style="display: flex; justify-content: center; align-items: center">
            <span style="flex: 1">预计到帐：</span>
            <span style="flex: 3" class="text-positive">
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
          style="width: 100%"
          ref="offerRef"
          class="deposit-selection q-mt-xs"
          label="选择优惠"
          filled
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
          <span v-else>流水倍数要求（本金+彩金）：{{ selectedPrivilege.rollover }}倍</span>
        </div>

        <!--        <div class="q-mt-xs" v-if="amountList.length !== 0">-->
        <!--          <q-btn-->
        <!--            class="common-large-btn"-->
        <!--            :loading="btnLoading"-->
        <!--            color="brightbtn fit"-->
        <!--            @click="confirmDeposit"-->
        <!--            label="确定存款"-->
        <!--          />-->
        <!--        </div>-->
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
        <strong class="black-titles">温馨提示</strong>
        <br />
        <br />
        为保证资金安全，存款前需先验证手机号
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" label="前往验证" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" width="100%" v-model="isNoRealName" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents q-mb-md">
        <strong>温馨提示</strong>
        <br />
        <br />
        您还未绑定真实姓名，请前往绑定。
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" label="前往绑定" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, shallowRef } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { cashier } from "boot/axios";
import { Platform, useQuasar, openURL } from "quasar";
import DepositWithdrawTransferTabs from "components/finance/DepositWithdrawTransferTabs.vue";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "src/hooks/notify";

const notify = useNotify();

const store = userStore();
const route = useRoute();
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
const selectedPromo = ref({});
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

const getRollOverText = (rolltext) => {
  const thetext = JSON.parse(rolltext);

  var fulltext = "流水倍数要求（本金+彩金）：";
  var rolloverlists = [];
  if (thetext.rolloverType && thetext.rollover) {
    fulltext += `${thetext.rollover} 倍`;
    return fulltext;
  }

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

const verifyDepositAmount = ref([
  (val) => !!val || "请输入金额",
  (val) => (val && /^\d+$/.test(val)) || (val && isUSDT.value) || "存款金额不能带有小数",
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

const initPay = () => {
  $q.loading.show({
    message: "加载数据中... 请稍等..."
  });

  isFetchingApi.value = window.location.pathname === "/deposit";

  payMethods.value = [];
  cashier
    .get("/session/deposit/index/")
    .then((res) => {
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

      if (!((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== "webkit")) {
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

async function loadPrivilege(val) {
  privilegeList.value = [];
  freePrivilege.value = null;
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
            notify({
              type: "error",
              message: d.message
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
                notify({
                  type: "error",
                  message: '无法打开充值页面。请检查游览器是否拦截弹窗页面，并修改为"允许弹窗"后再进行充值操作。'
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
      } else {
        notify({
          type: "error",
          message: res.message
        });
        btnLoading.value = false;
      }
    })
    .catch((error) => {
      notify({
        type: "error",
        message: error.message
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
const isFetchingApi = ref(false);

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

.q-select__dialog .q-field__control {
  background: #fff !important;
}

.flex-c-center {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;

  .deposit-btn {
    width: 25%;
    height: 56px;
    font-size: 20px;
    white-space: nowrap;
  }
}

.deposit-selection {
  width: 75%;
  padding-bottom: 0px;

  &.q-field--labeled {
    color: #fff;
  }
  &.q-field {
    border-radius: 10px;
    box-shadow: $shadow-bg;
  }
}

.deposit-field {
  width: 75%;
  &.q-field {
    border-radius: 10px;
    padding: 0px 8px 10px;
    background: rgba(0, 0, 0, 0.05);
    box-shadow: $shadow-bg;
    margin-bottom: 4px;
    height: 56px;
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

.rollover-info {
  color: #bd4646;
  font-size: 12px;
}

.body--dark {
  .deposit-field {
    &.q-field {
      width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
      background: none;
      height: unset;
    }

    .q-field__control {
      min-height: unset;
      height: unset;
    }

    .q-field__control,
    .q-field__marginal {
      background: #273354;
    }

    &.q-field--dark .q-field__control:before {
      border-color: #d0a383;
    }

    .q-field__bottom {
      padding: 4px;
    }
  }

  .deposit-selection {
    &.q-field {
      width: 100%;
      box-shadow: none;
      background: none;
    }

    .q-field__control,
    .q-field__marginal {
      background: #273354;
    }

    &.q-field--dark .q-field__control:before {
      border-color: #d0a383;
    }

    .q-field__bottom {
      padding: 4px;
    }
  }
}
</style>
<style scoped lang="scss">
.loader {
  margin: auto;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
.input-money {
  :deep(.q-field--standard .q-field__control):before {
    border-bottom: 0px;
  }
}

.body--dark {
  .deposit-container-form {
    background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c);
    border-radius: 6px;
    padding: 10px;
    width: 100%;

    .input-money {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 10px;
      align-items: center;
    }

    .input-currency,
    .deposit-btn {
      background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
      background-size: cover;
      box-shadow: none;
      border-radius: 4px;
      border: 1px solid #3a93ce;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 32px;
    }

    .deposit-btn {
      width: 100%;
      height: 40px;
      border-radius: 4px;
    }

    .currency-info {
      display: flex;
      justify-content: space-between;
      color: #98a7b5;
      gap: 10px;
    }
  }

  .active-method-msg {
    color: #98a7b5;
  }
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

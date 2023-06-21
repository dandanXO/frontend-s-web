<template>
  <div class="q-pa-md" style="overflow: hidden; background: #fff; margin: 8px">
    <div class="node-wrapper">
      <Node
        :level="1"
        :list="payMethods"
        ref="paymentNode"
        @clicked="onSelect"
      />
    </div>
    <div v-if="submitMessage.length > 0 && isDisplay" class="inner-cont">
      <div class="submit-message">
        <div class="line">
          <span>银行名称：</span>
          <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span
          ><button
            @blur="blurCode"
            @click="copyMessage('0')"
            class="common-btn"
          >
            {{ copybtntxt0 }}
          </button>
        </div>
        <div class="line">
          <span>银行账号：</span>
          <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span
          ><button
            @blur="blurCode"
            @click="copyMessage('1')"
            class="common-btn"
          >
            {{ copybtntxt1 }}
          </button>
        </div>
        <div class="line">
          <span>银行卡号：</span>
          <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span
          ><button
            @blur="blurCode"
            @click="copyMessage('2')"
            class="common-btn"
          >
            {{ copybtntxt2 }}
          </button>
        </div>
        <div class="line">
          <span>存款金额：</span>
          <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span
          ><button
            @blur="blurCode"
            @click="copyMessage('3')"
            class="common-btn"
          >
            {{ copybtntxt3 }}
          </button>
        </div>
      </div>
    </div>
    <div class="deposit-container">
      <q-form ref="depositForm" class="q-gutter-y-xs">
        <q-input
          hide-bottom-space
          ref="depositAmtRef"
          label="存款金额"
          name="localAmount"
          v-model="form.localAmount"
          placeholder="输入金额"
          color="blue"
          :rules="verifyDepositAmount"
          padding="none"
        >
          <template v-slot:prepend>
            <span style="font-size: 26px" class="text-bright">{{
              store.currency.value
            }}</span>
          </template>
        </q-input>

        <div class="q-mt-md q-mb-md text-grey text-bold q-pb-md">
          最低金额:
          {{
            calculatedMinDeposit
              ? calculatedMinDeposit + " " + store.currency.value
              : 0
          }}
          <br />
          最高金额:
          {{
            activeMethod.depositMax
              ? activeMethod.depositMax + " " + store.currency.value
              : "No Limit"
          }}
        </div>

        <div
          v-if="isUSDT && activeMethod.currencyRate"
          class="q-pb-md"
          label="兑换率"
        >
          <span style="color: #000"
            >1.00 USDT ≈ {{ activeMethod.currencyRate }}
            {{ store.currency.value }}</span
          >
        </div>
        <BankComponent
          v-show="selectedPayType && bankCardList.length"
          ref="payTypeClass"
          :is="selectedPayType"
          v-model:value="form.bankId"
          :bank-list="bankCardList"
          @selected="selectedBank"
          @successful="isDeposited = true"
        ></BankComponent>
        <q-select
          ref="offerRef"
          class="q-mt-md"
          label="选择优惠"
          filled
          :options="unselectedPrivileges"
          v-model="selectedPrivilege"
          emit-value
          v-if="hasPrivilege"
          :display-value="`${selectedPrivilege ? selectedPrivilege.name : ''}`"
          color="blue"
          @update:model-value="checkMinDepositAmt"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label
                  style="
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                  >{{ scope.opt.name }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="q-mt-md" v-html="activeMethod.msg"></div>
        <!-- <div class="q-mt-md">更新个人信息的新帐户可以参与促销活动。</div> -->
        <div class="q-mt-md">
          <q-btn
            color="brightbtn fit"
            @click="confirmDeposit"
            label="确定存款"
          />
        </div>
      </q-form>
    </div>
  </div>

  <q-dialog width="100%" v-model="isDeposited">
    <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        您已被重定向到您的特定银行以继续进行存款。<br /><br />
        入金成功后会反映这里。
      </q-card-section>
      <q-btn @click="clearInfo" label="明白" color="dyblue" />
    </q-card>
  </q-dialog>
</template>

<script setup id="DepositComponent">
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from "vue";
import Node from "../components/paymentSelect/node.vue";
import BankComponent from "components/finance/fBank";
import { cashier } from "boot/axios";
import { Platform, useQuasar } from "quasar";
import liff from "@line/liff";

var qs = require("qs");

import { userStore } from "stores/index";
import { useRouter } from "vue-router";

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
  copybtntxt[position].value = "已复制";
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};
const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach((element) => {
    element.value = "复制";
  });
};

const verifyDepositAmount = ref([
  (val) => !!val || "请输入金额",
  (val) =>
    val > calculatedMinDeposit.value - 1 ||
    "存款应介于 " +
      calculatedMinDeposit.value +
      " - " +
      activeMethod.value.depositMax,
  (val) =>
    val < activeMethod.value.depositMax + 1 ||
    "存款应介于 " +
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
const calculatedMinDeposit = ref("");
function initPay() {
  $q.loading.show({
    message: "加载银行信息。 请稍等..."
  });

  payMethods.value = [];
  cashier.get("/session/deposit/index/").then((res) => {
    $q.loading.hide();
    res = {
      code: 0,
      data: {
        payments: [
          {
            nodeName: "加密货币",
            nodeIcon: "d643ccce-bfd0-474b-bf4a-214f9fba59c4.png",
            promotionIcon: null,
            groupId: 6451,
            lineName: null,
            children: [
              {
                nodeName: "USDT",
                nodeIcon: "65576157-d927-4775-a731-387a5d04def2.png",
                promotionIcon: null,
                groupId: 6452,
                lineName: null,
                children: [
                  {
                    nodeName: "TRC20-2",
                    nodeIcon: "7caa11e8-e30f-4169-a2e0-9f2352f84f92.png",
                    promotionIcon: null,
                    paymentId: 88,
                    payResultType: "GET_SUBMIT",
                    payType: "USDTTRC",
                    depositMin: 10.0,
                    depositMax: 50000.0,
                    currencyRate: 7.14,
                    msg: '<a style="color:orange;" target="_blank">1. 若提交不出码请换其他金额重试，存款上分以到账的U数量为准！</a>\n<br>2. 虚拟币USDT教程： <a style="color:purple;text-decoration:underline;" href="https://qwzr2.radiotopdance.com/dy-deposit_guide.mp4" style="color: #eee;" target="_blank">视频教程</a> \n<a style="color:purple;text-decoration:underline;" href="https://m.dyvip98.com/wap/other/usdt.html" style="color: #eee;" target="_blank">图文教程</a> \n<br>3. 每日赠送1.5%最高588元，仅限单笔充值100 USDT以上 ！\n<br> 4. 热门交易所平台推荐： <a style="color:purple;text-decoration:underline;" href="https://www.okex.com/" style="color: #eee;" target="_blank">Okex</a> <a style="color:purple;text-decoration:underline;" href="https://www.binance.com/zh-CN" style="color: #eee;" target="_blank">币安</a> ',
                    extra: {
                      banks: [],
                      amountArr: []
                    },
                    group: false
                  },
                  {
                    nodeName: "ERC20",
                    nodeIcon: "fe966e73-f6ea-4907-8b8d-a364305fb9a3.png",
                    promotionIcon: null,
                    paymentId: 89,
                    payResultType: "GET_SUBMIT",
                    payType: "USDTERC",
                    depositMin: 20.0,
                    depositMax: 50000.0,
                    currencyRate: 7.14,
                    msg: '<a style=""color:orange;"" target=""_blank"">1. 若提交不出码请换其他金额重试，存款上分以到账的U数量为准！</a>\n<br>2. 虚拟币USDT教程： <a style=""color:purple;text-decoration:underline;"" href=""https://qwzr2.radiotopdance.com/dy-deposit_guide.mp4"" style=""color: #eee;"" target=""_blank"">视频教程</a> \n<a style=""color:purple;text-decoration:underline;"" href=""https://m.dyvip98.com/wap/other/usdt.html"" style=""color: #eee;"" target=""_blank"">图文教程</a> \n<br>3. 每日赠送1.5%最高588元，仅限单笔充值100 USDT以上 ！\n<br> 4. 热门交易所平台推荐： <a style=""color:purple;text-decoration:underline;"" href=""https://www.okex.com/"" style=""color: #eee;"" target=""_blank"">Okex</a> <a style=""color:purple;text-decoration:underline;"" href=""https://www.binance.com/zh-CN"" style=""color: #eee;"" target=""_blank"">币安</a> ',
                    extra: {
                      banks: [],
                      amountArr: []
                    },
                    group: false
                  }
                ],
                group: true
              }
            ],
            group: true
          },
          {
            nodeName: "DY银行转账",
            nodeIcon: "63d74df4-07cf-46ea-9ea3-0712123c81d2.png",
            promotionIcon: null,
            paymentId: 85,
            payResultType: "RENDER_HTML",
            payType: "OFFLINE",
            depositMin: 100.0,
            depositMax: 200000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [
                {
                  code: "ABC",
                  name: "中国农业银行",
                  id: 20
                }
              ],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "VIP 转卡",
            nodeIcon: "25b20a24-a23d-4917-b719-bf2441c77d38.png",
            promotionIcon: "81384fb4-1e0f-4506-89d6-9e20ec03f9bf.png",
            paymentId: 197,
            payResultType: "GET_SUBMIT",
            payType: "BANK",
            depositMin: 3000.0,
            depositMax: 50000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 1. 请按照订单金额付款，否则无法核实到账\n<br> 2. 付款完成后请提供回单，可速度到账\n<br>每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "DYMGOpay卡转卡040",
            nodeIcon: "SPECIALPAY",
            promotionIcon: null,
            paymentId: 141,
            payResultType: "RENDER_HTML",
            payType: "SPECIALPAY",
            depositMin: 2000.0,
            depositMax: 8000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "DYDMPay2卡转卡337",
            nodeIcon: "SPECIALPAY",
            promotionIcon: null,
            paymentId: 143,
            payResultType: "RENDER_HTML",
            payType: "SPECIALPAY",
            depositMin: 3000.0,
            depositMax: 20000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "DYHCPay2卡转卡468",
            nodeIcon: "SPECIALPAY",
            promotionIcon: null,
            paymentId: 144,
            payResultType: "RENDER_HTML",
            payType: "SPECIALPAY",
            depositMin: 3000.0,
            depositMax: 30000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "DYMGOPay2卡转卡040",
            nodeIcon: "SPECIALPAY",
            promotionIcon: null,
            paymentId: 145,
            payResultType: "RENDER_HTML",
            payType: "SPECIALPAY",
            depositMin: 2000.0,
            depositMax: 20000.0,
            currencyRate: 1.0,
            msg: '<a style=""color:orange;"" target=""_blank"">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>\n<br> 每日赠送0.5%最高100元，仅限单笔存款5000元以上！\n',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          },
          {
            nodeName: "DY强盛小额转卡366",
            nodeIcon: "QUICKPAYMENT",
            promotionIcon: null,
            paymentId: 185,
            payResultType: "GET_SUBMIT",
            payType: "QUICKPAYMENT",
            depositMin: 300.0,
            depositMax: 2000.0,
            currencyRate: 1.0,
            msg: '<a style="color:orange;" target="_blank">**只支持（账户本人）姓名存款，若违规操作会进行冻结审查，亏损自负！</a>',
            extra: {
              banks: [],
              amountArr: []
            },
            group: false
          }
        ]
      }
    };
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
  await cashier
    .get(`/session/payment/${val.paymentId}/privileges`)
    .then((res) => {
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
  if (!Platform.is.android || !Platform.is.capacitor) {
    clearInfo();
  }
  if (liff.isInClient()) {
    clearInfo();
  }
  depositAmtRef.value.resetValidation();
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
    calculatedMinDeposit.value = Math.max(
      activeMethod.value.depositMin,
      selectedPrivilege.value.depositMin
    );
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
  form.bankId = value;
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = null;
  selectedPrivilege.value = "";
  depositForm.value.reset();
  checkMinDepositAmt();
}

const depositAmtRef = ref("");

async function confirmDeposit() {
  depositAmtRef.value.validate();
  if (depositAmtRef.value.hasError) {
  } else {
    await cashier
      .get(
        `/session/payment/${activeMethod.value.paymentId}/amount/${form.localAmount}/verify`
      )
      .then((d) => {
        console.log(d);
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
        } else {
          doDeposit();
        }
      });
  }
}

function doDeposit() {
  if (freePrivilege.value) {
    if (selectedPrivilege.value) {
      form.privilegeId =
        selectedPrivilege.value.id + "," + freePrivilege.value.id;
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

  depositAmtRef.value.validate();
  if (depositAmtRef.value.hasError) {
  } else {
    form.paymentId = activeMethod.value.paymentId;

    if (store.token) {
      if (
        (Platform.is.desktop || Platform.is.webkit) &&
        !Platform.is.capacitor &&
        Platform.is.name !== "webkit" &&
        !liff.isInClient()
      ) {
        // if ((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit') {
        const newWin = window.open(`/depositLoading`, "Bank");
        newWin.localStorage.setItem("formDetails", JSON.stringify(form));
      } else {
        localStorage.setItem("formDetails", JSON.stringify(form));
        router.push({ path: "/depositLoading" });
      }

      window.addEventListener(
        "message",
        (event) => {
          if (event.data?.msg) {
            if (event.data.msg === "success") {
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
        { once: true }
      );
    }
    // cashier.get("/session/payment/" +form.paymentId +"/amount/" +form.localAmount +"/verify")
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
    const copy = { ...form };
    const data = {};
    Object.entries(copy).forEach(([key, value]) => {
      if (value) {
        data[key] = value;
      }
    });
    data.bankCardId = 0;
    payTypeClass.value.submitDeposit(data);
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

<style lang="scss">
.submit-message {
  width: calc(100% - 40px);
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
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
    width: calc(100% - 30px);
    align-items: center;
    font-size: 16px;
    align-items: center;
    background: #dddddd;
    padding: 15px;
    span:first-child {
      flex: 1;
      color: #4669f8;
    }
    span.info {
      flex: 3;
    }
    button {
      width: 80px;
    }
  }
}

.q-select__dialog .q-field__control {
  background: #4fb2ff !important;
}
</style>

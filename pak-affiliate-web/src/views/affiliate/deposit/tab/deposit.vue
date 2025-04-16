<template>
  <div :class="isLoading ? 'wload deposit' : ''">
    <div class="loading" v-if="isLoading">
      <TFLoading v-if="siteId === 1" />
      <Jolly88Loading v-if="siteId === 3" />
    </div>
    <div v-if="!isLoading">
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
          <div class="linebox">
            <span>{{ $t('fields.bank') }}：</span>
            <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
            <button
              @blur="blurCode"
              @click="'0', copyMessage(submitMessage[0])"
              class="common-btn"
            >
              {{ copybtntxt0 }}
            </button>
          </div>
          <div class="linebox">
            <span>{{ $t('fields.cardAccount') }}：</span>
            <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
            <button
              @blur="blurCode"
              @click="'1', copyMessage(submitMessage[1])"
              class="common-btn"
            >
              {{ copybtntxt1 }}
            </button>
          </div>
          <div class="linebox">
            <span>$t('fields.cardNumber')：</span>
            <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
            <button
              @blur="blurCode"
              @click="'2', copyMessage(submitMessage[2])"
              class="common-btn"
            >
              {{ copybtntxt2 }}
            </button>
          </div>
          <div class="linebox">
            <span>{{ $t('fields.depositAmount') }}：</span>
            <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
            <button
              @blur="blurCode"
              @click="'3', copyMessage(submitMessage[3])"
              class="common-btn"
            >
              {{ copybtntxt3 }}
            </button>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          autocomplete="off"
          label-width="180px"
          label-suffix=":"
        >
          <el-space alignment="flex-start">
            <el-form-item class="helptxt" :label="$t('fields.depositAmount')" prop="localAmount">
              <el-input
                v-if="amountList.length === 0"
                v-model="depositAmountFormatted"
                :placeholder="isUSDT ? $t('message.inputUSDTAmount') : $t('message.inputAmount')"
              />

              <el-select
                :placeholder="$t('message.selectAmount')"
                v-else
                v-model="form.localAmount"
              >
                <el-option
                  v-for="amount in amountList"
                  :key="amount"
                  :value="amount"
                >
                  {{ amount }}
                </el-option>
              </el-select>
            </el-form-item>
            <div class="account-tip">
              {{ $t('message.minDepositeAmount') }}: {{ calculatedMinDeposit ? formatMoney(calculatedMinDeposit) : 0 }}
              {{ isUSDT ? "USDT" : returnCurrency() }}
              <br>
              {{ $t('message.maxDepositeAmount') }}:
              {{
                activeMethod.depositMax ? formatMoney(activeMethod.depositMax) : "No Limit"
              }}
              {{ isUSDT ? "USDT" : returnCurrency() }}
            </div>
          </el-space>

          <el-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            :label="$t('message.currencyRates')"
          >
            <span style="color: #17cd27">
              1.00 USDT ≈ {{ activeMethod.currencyRate }}
              {{ returnCurrency() }}
            </span>
          </el-form-item>
          <el-form-item
            v-show="selectedPayType && bankCardList.length"
            :label="$t('fields.bank')"
            prop="bankId"
            name="bankId"
            value="bankName"
          >
            <template #label />
            <BankComponent
              ref="payTypeClass"
              :is="selectedPayType"
              :bank-list="bankCardList"
              v-model="form.bankId"
              @selected="selectedBank"
            />
          </el-form-item>

          <!-- <el-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            label="จํานวนเงินโดยประมาณ"
          >
            <span style="color: #9bffd1"
              >{{
                (form.localAmount * activeMethod.currencyRate).toFixed(2)
              }}
              USDT</span
            >
          </el-form-item> -->
          <!-- <el-form-item v-if="selectedPayType" class="tip">
            <template #label></template>
            <span
              class="account-tip-text"
              style="margin-bottom: 10px; display: block; width: 100%"
            >
              <div v-html="activeMethod.msg" />
              {{ activeMethod.msg }}
            </span>
            <div class="account-tip-text">
              <el-icon><InfoFilled /> </el-icon>
                更新个人信息的新帐户可以参与促销活动。
            </div>
          </el-form-item> -->
          <div>
            <el-button
              :loading="loadingBtn"
              size="large"
              @click="confirmDeposit"
              class="common-btn"
              style="margin-left: 180px; margin-bottom: 20px;"
              type="primary"
            >
              {{ $t('fields.confirm') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <el-dialog
        width="500px"
        v-model="isDeposited"
        :maskClosable="false"
        :closable="false"
        :title="$t('message.DepositCompleted')"
      >
        {{ $t('message.depositNotification1') }}
        <br>
        <br>
        {{ $t('message.depositNotification2') }}

        <br>
        <br>
        <el-button class="common-btn" @click="clearInfo">{{ $t('message.understand') }}</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef, watch } from "vue";
import {
  loadPay,
  verifyAmount,
  postDeposit,
  loadBankCards
} from "@/api/deposit";
import { ElMessage, ElMessageBox } from "element-plus";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/BankComponent";
import TFLoading from "@/components/loading/TFLoading.vue";
import Jolly88Loading from "@/components/loading/Jolly88Loading.vue";
import { useRouter } from "vue-router";
import { doIt } from "@/utils/action";
import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
import { formatMoney } from "@/utils/format-money";
const { t } = useI18n();
const router = useRouter();
const loadingBtn = ref(false);
const store = useStore();
const siteId = store.state.user.siteId;
const formRef = ref();
const isDeposited = ref(false);
const isLoading = ref(true);
const payTypeClass = ref();
const payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const amountList = ref([]);
const bankCardList = ref([]);
const selectedPayType = shallowRef("");
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const copybtntxt0 = ref(t('common.copy'));
const copybtntxt1 = ref(t('common.copy'));
const copybtntxt2 = ref(t('common.copy'));
const copybtntxt3 = ref(t('common.copy'));
const copyMessage = (position, text) => {
  let copyText = null;
  copyText = text;
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
  copybtntxt[position].value = t('common.copied');
};

const depositAmountFormatted = ref('');

watch(() => depositAmountFormatted.value, () => {
  const depositAmount = depositAmountFormatted.value.replace(/\$\s?|(,*)/g, '');
  if (isNaN(depositAmount)) {
  } else {
    depositAmountFormatted.value = `${depositAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    form.localAmount = Number(depositAmount);
  }
})

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
  copybtntxt.forEach((element) => {
    element.value = t('common.copy');
  });
};
const form = reactive({
  paymentId: null,
  localAmount: null,
  bankId: null
});

const checkAmount = reactive({
  flag: true,
  errorMessage: ""
});

const calculatedMinDeposit = ref("");
const rules = {
  localAmount: [
    {
      required: true,
      message: t('message.requiredAmount'),
      trigger: "blur"
    },
    // {
    //   pattern: "^([1-9][0-9]*)$",
    //   message: t('message.requiredPositiveInteger'),
    //   trigger: "change"
    // },
    {
      validator: verifyDepositAmount,
      trigger: "blur"
    }
  ],
  bankId: [
    {
      validator: verifyBank,
      trigger: "change"
    }
  ]
};

const withdrawState = reactive({
  bankCardList: []
});

const loadCards = () => {
  withdrawState.bankCardList = [];
  loadBankCards()
    .then((response) => {
      if (response.code === 0) {
        response.data.forEach((element) => {
          if (element.bankType === "BANK") {
            withdrawState.bankCardList.push(element);
          } else {
            withdrawState.bankCardList.push(element);
          }
        });
      }
      if (withdrawState.bankCardList.length === 0) {
        ElMessageBox.alert(t('message.bindBankCard'), t('fields.systemAlert'), {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: t('fields.confirm'),
        draggable: false,
        buttonSize: 'small',
        closeOnClickModal: false,
        center: true,
      })
      .then(() => {
        router.push('/affiliate/bank-card')
      })
      .catch(() => {})
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  
};

function initPay() {
  isLoading.value = true;
  loadPay().then((d) => {
    if (d.code === 0) {
      payMethods.value = [];
      isLoading.value = false;
      d.data.payments.forEach((element) => {
        element.promoValue = "";
        element.promoStyle = "right: -5px; top: 0px; padding: 20px;";
        element.hasActive = false;
        payMethods.push(element);
      });
      if (payMethods[0].extra && payMethods[0].extra.banks) {
        bankCardList.value = payMethods[0].extra.banks;
      }
    }
  });
}

function selectPayType(value) {
  if (value) {
    if (value.extra && value.extra.amountArr) {
      amountList.value = value.extra.amountArr;
    } else {
      amountList.value = [];
    }
    if (value.extra && value.extra.banks) {
      bankCardList.value = value.extra.banks;
    } else {
      bankCardList.value = [];
      form.bankId = null;
    }
    selectedPayType.value = value.payType;
    if (selectedPayType.value && selectedPayType.value.includes("USDT")) {
      isUSDT.value = true;
    } else {
      isUSDT.value = false;
    }
  }
}

async function onSelect(value) {
  isDisplay.value = false;
  clearInfo();
  if (value) {
    if (value.group) {
      value.children.forEach((element) => {
        if (element.hasActive) {
          activeMethod.value = element;
        }
      });
    } else {
      activeMethod.value = value;
      selectPayType(value);
      if (formRef.value) {
        formRef.value.resetFields();
      }
    }
    checkMinDepositAmt();
  }
}
function checkMinDepositAmt(value, option) {
  calculatedMinDeposit.value = activeMethod.value.depositMin;
}

function selectedBank(value) {
  form.bankId = value.value;
  console.log(form.bankId);
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = "";
  form.bankId = "";
  checkMinDepositAmt();
}

function confirmDeposit() {
  if (store.token) {
    if (!store.phone) {
      ElMessageBox.alert("为保证资金安全，存款前请先验证手机号", "系统提示", {
        showClose: "false",
        cancelButtonClass: "cancel-btn",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        buttonSize: "small"
      })
        .then(() => {
          router.push("/center/personal");
        })
        .catch(() => {});
      return;
    } else if (withdrawState.bankCardList.length === 0) {
      if (isUSDT.value === true) {
        ElMessageBox.alert("请先绑定虚拟币钱包", "系统提示", {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: "确认",
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        })
          .then(() => {
            router.push("/center/withdrawbank");
          })
          .catch(() => {});
        return;
      } else {
        ElMessageBox.alert("请先绑定银行卡", "系统提示", {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: "确认",
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        })
          .then(() => {
            router.push("/center/withdrawbank");
          })
          .catch(() => {});
        return;
      }
    }
  }
  loadingBtn.value = true;

  form.paymentId = activeMethod.value.paymentId;
  formRef.value.validate().then(async () => {
    await verifyAmount(activeMethod.value.paymentId, form.localAmount)
      .then((d) => {
        if (d.code === 11002) {
          form.localAmount = d.data.suggestion;
          // message.error(d.message, 4);
          ElMessage.error(d.message);
          loadingBtn.value = false;
        } else {
          const copy = { ...form };
          const data = {};
          Object.entries(copy).forEach(([key, value]) => {
            if (value) {
              data[key] = value;
            }
          });
          data.bankCardId = 0;

          doDeposit(data);
        }
      })
      .catch((err) => {
        console.log(err);
        loadingBtn.value = false;
      });
  });
  loadingBtn.value = false;
}

function doDeposit(data) {
  loadingBtn.value = true;
  postDeposit(data)
    .then((d) => {
      if (d.code === 0) {
        doIt(d).then((resp) => {
          const response = resp.data.result;
          if (response.payResultType === "OFFLINE") {
          }
          if (response.payResultType === "RENDER_HTML") {
            if (response.paramKey === null || response.paramKey === "") {
              isDisplay.value = true;
              submitMessage.value = response.data.split(",");
            }
          } else {
            const newWin = window.open(`/`);
            newWin.localStorage.setItem("formDetails", JSON.stringify(form));
            if (response.payResultType === "GET_SUBMIT") {
              // isDeposited.value = true;
              newWin.location.href = response.requestUrl;
            }
            if (response.payResultType === "POST_SUBMIT") {
              // isDeposited.value = true;
              if (response.paramKey === null || response.paramKey === "") {
                newWin.location.href = `display?${response.data}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
              } else {
                newWin.location.href = `display?paramKey=${response.paramKey}&payResultType=${response.payResultType}&requestUrl=${response.requestUrl}`;
              }
            }
          }
        });
        loadingBtn.value = false;
      } else {
        ElMessage.error("优惠存款金额不符合规则");
      }
    })
    .catch((err) => {
      console.log(err);
      loadingBtn.value = false;
    });
  loadingBtn.value = false;
}

async function verifyDepositAmount(r, v) {
  v = v + "";
  if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
    if (v < calculatedMinDeposit.value || v > activeMethod.value.depositMax) {
      return Promise.reject(
        new Error(t('message.depositShouldBetween') +
          calculatedMinDeposit.value +
          " - " +
          activeMethod.value.depositMax
        ));
    } if (v%10000!==0) {
      return Promise.reject(new Error(t('message.amountMustBeMultipleOf10000')))
    } else {
      if (checkAmount.flag) {
        return Promise.resolve();
      } else {
        return Promise.reject(checkAmount.errorMessage);
      }
    }
  }
}

async function verifyBank(r, v) {
  if (bankCardList.value.length) {
    return payTypeClass.value.validateBank(v).then((d) => {
      if (d) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("请输入银行"));
      }
    });
  }
}
const returnCurrency = () => {
  if (siteId === 3 || siteId === '3') {
    return "THB"
  } else if (siteId === 8 || siteId === '8') {
    return "VNDP"
  } else if (siteId === 10 || siteId === '10') {
    return "원"
  } else {
    return "RMB"
  }
}

onMounted(() => {
  initPay();
  loadCards();
});
</script>
<style lang="scss" scoped>
.sm .ant-modal {
  width: 100%;
  max-width: 400px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
  .confirm-btn {
    padding: 5px;
    min-width: unset;
    font-weight: normal;
  }
}
</style>
<style lang="scss" scoped>
.payment-channel-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  grid-template-rows: 50px;
  grid-column-gap: 20px;

  .payment-channel-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1b232d;
    border: 1px solid #163d5b;
    cursor: pointer;
    &.payment-channel-item {
      flex-direction: column;
    }
    &.active {
      border-color: #1bcef1;
    }

    > img {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
  }
}

.form-input {
  margin-right: 24px;
  color: #4d97ac;
}

.confirm-btn {
  margin: 20px auto;
}
.account-tip {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: #7D8592;
}

.account-content {
  .loading {
    display: flex;
    justify-content: center;
    font-size: 30px;
    height: 100%;
    padding: 80px 0;
    img {
      width: 100%;
    }
    .icon {
      margin-right: 10px;
    }
  }
  .node-wrapper {
    border-bottom: 1px solid #484460;
    padding: 10px 0;
  }
  .deposit-container {
    padding: 20px 30px;
    .ant-form.ant-form-horizontal
      .ant-form-item
      .ant-form-item-control-input-content
      .ant-input {
      background: #23263c;
      border: #23263c;
      max-width: 280px;
      padding: 10px;
      margin-right: 20px;
    }
    :deep(.ant-form-item) {
      align-items: flex-start;
      gap: 10px;
      &.tip {
        color: #000000;
      }
    }
    :deep(.helptxt .ant-form-item-control-input-content) {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      row-gap: 10px;
    }
    :deep(.ant-form-item .ant-select) {
      max-width: 280px;
      width: 100%;
    }
    :deep(.ant-form-item.select .ant-form-item-control-input) {
      max-width: 280px;
    }
    :deep(
        .ant-select-single:not(.ant-select-customize-input)
          .ant-select-selector
          .ant-select-selection-search-input
      ) {
      height: 40px;
    }
    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      height: 40px;
      padding: 5px 20px;
      background: #23263c;
      color: #000000;
      border: 0;
    }
  }
}
</style>
<style scoped lang="scss">
.txt-center {
  margin: 50px auto 20px;
  text-align: center;
}
:deep(.ant-form-item-label > label) {
  color: #000000;
}

:deep(.ant-select) {
  height: 42px;
  width: 280px;
  margin-right: 24px;
}

:deep(
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector
  ) {
  height: 42px;
}
:deep(
    .ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input
  ) {
  height: 40px;
}
:deep(
    .ant-select-single .ant-select-selector .ant-select-selection-placeholder
  ) {
  line-height: 30px;
}
:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
  line-height: 30px;
}
</style>
<style lang="scss" scoped>
.inner-cont {
  height: 100%;
  display: flex;
  // justify-content: center;
  align-items: center;
}
.submit-message {
  width: calc(100% - 40px);
  max-width: 500px;
  margin: 0;
  padding: 20px 0;
  height: auto;
  gap: 1px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  color: #000000;
  .linebox {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: calc(100% - 30px);
    align-items: center;
    font-size: 16px;
    align-items: center;
    // background: #063c50;
    padding: 15px;
    span:first-child {
      flex: 1;
      color: #4fb2ff;
    }
    span.info {
      flex: 3;
      color:#000000;
    }
    button {
      width: 80px;
    }
  }
}
</style>

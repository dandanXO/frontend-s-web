<template>
  <div :class="isLoading ? 'wload deposit' : ''">
    <div v-if="isLoading" class="loading">
      <TFLoading />
    </div>
    <div v-if="!isLoading">
      <!-- <div class="account-tip-text">
        <RiSpamLine />
        Please note: The transaction unit in the game is TF VNDP, 1VNDP =
        1000VND
      </div> -->
      <div class="node-wrapper">
        <Node ref="paymentNode" :level="1" :list="payMethods" @clicked="onSelect" />
      </div>

      <div class="deposit-container">
        <div class="deposit-amt-quick-select-wrapper" v-if="allowedDepositAmtOptions.length > 0">
          <div class="deposit-amt-quick-select-title">{{ $t("personalView.finance.deposit.recharge") }}</div>
          <div class="deposit-amt-quick-select-list">
            <div
              :class="`deposit-amt-quick-select-item ${depositAmtOption === Number(form.localAmount) ? 'active' : ''}`"
              v-for="depositAmtOption in allowedDepositAmtOptions"
              :key="depositAmtOption"
              @click="onDepositAmtQuickSelect(depositAmtOption)"
            >
              {{ convertToCommaAmount(depositAmtOption) }}
            </div>
          </div>
        </div>

        <a-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :hide-required-mark="true"
          name="basic"
          :colon="false"
          autocomplete="off"
          label-align="left"
        >
          <div class="deposit-amt-quick-select-title">{{ $t("personalView.finance.deposit.form.amount.label") }}</div>
          <a-form-item class="helptxt" name="localAmount">
            <a-input
              :prefix="store.currency.value"
              v-model:value="form.localAmount"
              :placeholder="$t('personalView.finance.deposit.form.amount.placeholder')"
              allowClear
            />
            <!-- <div class="account-tip" style="flex-direction: column; align-items: flex-start">
              <span class="account-tip-text">
                Min amount one time :
                {{ calculatedMinDeposit ? calculatedMinDeposit : 0 }}
                {{ isUSDT ? "USDT" : store.currency.value }}
              </span>
              <span class="account-tip-text">
                Max Amount one time:
                {{
                  activeMethod.depositMax
                    ? activeMethod.depositMax + " " + (isUSDT ? "USDT" : store.currency.value)
                    : "No Limit"
                }}
              </span>
            </div> -->
          </a-form-item>

          <a-form-item v-if="isUSDT && activeMethod.currencyRate" class="helptxt" label="Exchange Rate">
            <span style="color: #0b8f1a">1.00 USDT ≈ {{ activeMethod.currencyRate }} ₱</span>
          </a-form-item>
          <a-form-item
            v-show="selectedPayType && bankCardList.length"
            ref="bankId"
            label="Please select a bank"
            name="bankId"
          >
            <template #label />
            <BankComponent
              :is="selectedPayType"
              ref="payTypeClass"
              v-model:value="form.bankId"
              :bank-list="bankCardList"
              @selected="selectedBank"
            />
          </a-form-item>
<!--          <template v-if="hasPrivilege && !isUSDT">-->
<!--            <div class="deposit-amt-quick-select-title">-->
<!--              {{ $t("personalView.finance.deposit.form.privilege.label") }}-->
<!--            </div>-->
<!--            <a-form-item class="helptxt" ref="privilegeId" name="privilegeId">-->
<!--              <a-select-->
<!--                v-model:value="selectedPrivilege"-->
<!--                :placeholder="$t('personalView.finance.deposit.form.privilege.placeholder')"-->
<!--                @select="checkMinDepositAmt"-->
<!--                allowClear-->
<!--              >-->
<!--                <a-select-option v-for="p in unselectedPrivileges" :key="p.id" :value="p.id">-->
<!--                  {{ p.name }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-item>-->
<!--          </template>-->
          <!-- <a-form-item v-if="selectedPayType" class="tip">
            <span v-if="activeMethod.msg" class="account-tip-text activemethod" style="margin-bottom: 10px">
              <div v-html="activeMethod.msg" />
            </span>
            <div class="account-tip-text">
              <!- <RiSpamLine /> ->
              New accounts that have updated personal information can participate in promotions
            </div>

            <div v-if="isIOSGCash" class="account-tip-text" style="color: #f1bb34">
              <!- <RiSpamLine /> ->
              iOS only supports scanning QR codes through screenshots.
            </div>
          </a-form-item> -->
        </a-form>
        <div class="txt-center">
          <button class="common-btn confirm-btn" @click="confirmDeposit">
            {{ $t("personalView.finance.deposit.confirmButton") }}
          </button>
        </div>
      </div>
      <a-modal
        v-model:visible="isDeposited"
        class="footer-modal"
        wrap-class-name="sm"
        width="100%"
        :mask-closable="false"
        :closable="false"
        :footer="null"
      >
        {{ $t("personalView.finance.deposit.modal.description") }}
        <div class="common-btn confirm-btn" @click="clearInfo">
          {{ $t("personalView.finance.deposit.modal.confirmButton") }}
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef, computed } from "vue";
import { loadPay, loadPrivileges } from "@/api/personal/deposit";
import { RiSpamLine } from "vue-remix-icons";
import { message } from "ant-design-vue";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/Bank";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
import { getMobileOS } from "@/utils/utils";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { convertToCommaAmount } from "@/utils/utils";

const { t } = useI18n();
const store = userStore();
const formRef = ref();
const isDeposited = ref(false);
const isLoading = ref(true);
const payTypeClass = ref();
const payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const bankCardList = ref([]);
const privilegeList = ref([]);
const selectedPrivilege = ref(null);
const unselectedPrivileges = ref([]);
const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isUSDT = ref(false);
const depositAmtOptions = ref(new Set([100, 300, 500, 800, 1000, 3000, 5000, 8000, 10000, 20000]));

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

const isIOSGCash = computed(() => {
  if (getMobileOS() === "IOS" && activeMethod.value.payType === "GCASH") {
    return true;
  }
  return false;
});

const calculatedMinDeposit = ref("");
const rules = {
  localAmount: [
    {
      required: true,
      message: t("personalView.finance.deposit.form.amount.error.required"),
      trigger: "blur"
    },
    {
      pattern: "^([1-9][0-9]*)$",
      message: t("personalView.finance.deposit.form.amount.error.pattern"),
      trigger: "change"
    },
    {
      validator: verifyDepositAmount,
      trigger: "change"
    }
  ],
  bankId: [
    {
      validator: verifyBank,
      trigger: "change"
    }
  ]
};

const allowedDepositAmtOptions = computed(() => {
  const depositAmtOptionsArr = Array.from(depositAmtOptions.value);
  return depositAmtOptionsArr.filter(
    (depositAmtOption) =>
      depositAmtOption >= calculatedMinDeposit.value && depositAmtOption <= activeMethod.value.depositMax
  );
});
const route = useRoute();
// const checkWelcome = () => {
//   if (route.query && route.query.isFromWelcomePromo) {
//     unselectedPrivileges.value.forEach((p) => {
//       if (p.name === "P4W-FIRST-DEPOSIT") {
//         selectedPrivilege.value = p.id;
//       }
//     });
//     onDepositAmtQuickSelect(300);
//   }
// };
const onDepositAmtQuickSelect = (amt) => {
  form.localAmount = amt.toString();
};

function initPay() {
  isLoading.value = true;
  loadPay().then((d) => {
    if (d.code === 0) {
      payMethods.value = [];
      isLoading.value = false;
      d.data.payments.forEach((element) => {
        element.promoValue = "";
        element.promoStyle = "right: -5px; top: -10px; padding: 20px;";
        element.hasActive = false;
        payMethods.push(element);
      });
      if (payMethods[0].extra && payMethods[0].extra.banks) {
        bankCardList.value = payMethods[0].extra.banks;
      }
    }
  });
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  hasPrivilege.value = false;
  await loadPrivileges(val.paymentId).then((res) => {
    if (res.code === 0) {
      privilegeList.value = res.data.privileges;
      hasPrivilege.value = true;
      freePrivilege.value = null;
      unselectedPrivileges.value = [];
      privilegeList.value.map((p) => {
        if (p.payTypes.indexOf(val.payType) >= 0) {
          if (p.triggerType == "FREE") {
            freePrivilege.value = p;
          } else {
            unselectedPrivileges.value.push(p);
          }
        }
      });
      // checkWelcome();
    } else {
      hasPrivilege.value = false;
      privilegeList.value = [];
    }
  });
}

function selectPayType(value) {
  if (value) {
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
    // console.log(selectedPayType.value.extra && selectedPayType.value.extra.banks.length === 0)
    // if (!selectedPayType.value.extra || selectedPayType.value.extra.banks.length === 0) {
    //   bankCardList.value = [];
    //   form.bankId = null;
    // }
  }
}

async function onSelect(value) {
  clearInfo();
  if (value) {
    if (value.group) {
      value.children.forEach((element) => {
        if (element.hasActive) {
          activeMethod.value = element;
          depositAmtOptions.value = element.extra.amountArr.map((item) => parseInt(item));
          checkPrivilege(element);
        }
      });
    } else {
      activeMethod.value = value;
      depositAmtOptions.value = value.extra.amountArr.map((item) => parseInt(item));
      checkPrivilege(value);
      formRef.value.resetFields();
    }
    checkMinDepositAmt();
  }
}

const promoRollOver = ref(0);
const promoBonus = computed(() => {
  const privilege = unselectedPrivileges.value.find((element) => {
    return element.id === selectedPrivilege.value;
  });

  if (privilege?.bonusType === "RATIO" && form.localAmount && privilege.bonusAmount) {
    const bonusAmt = Number(form.localAmount) * privilege.bonusAmount;
    return Math.min(privilege.bonusMax, bonusAmt);
  }

  return 0;
});

function checkMinDepositAmt(value, option) {
  calculatedMinDeposit.value = 300;
  activeMethod.value.depositMax = 50000;
  // if (!selectedPrivilege.value || !option) {
  //   calculatedMinDeposit.value = activeMethod.value.depositMin;
  // } else {
  //   unselectedPrivileges.value.forEach((element) => {
  //     if (element.id === option.key) {
  //       calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, element.depositMin);
  //       promoRollOver.value = element.rollover;
  //     }
  //   });
  // }
}

function checkPrivilege(v) {
  selectPayType(v);
  if (v.paymentId !== null && v.paymentId !== undefined) {
    loadPrivilege(v);
  }
}

function selectedBank(value) {
  form.bankId = value;
}

function clearInfo() {
  isDeposited.value = false;
  formRef.value.resetFields();
  form.localAmount = "";
  selectedPrivilege.value = null;
  checkMinDepositAmt();
}

function confirmDeposit() {
  if (freePrivilege.value) {
    if (selectedPrivilege.value) {
      form.privilegeId = selectedPrivilege.value + "," + freePrivilege.value.id;
    } else {
      form.privilegeId = "," + freePrivilege.value.id;
    }
  } else {
    if (selectedPrivilege.value) {
      form.privilegeId = selectedPrivilege.value;
    } else {
      form.privilegeId = null;
    }
  }
  formRef.value
    .validate()
    .then(() => {
      form.paymentId = activeMethod.value.paymentId;
      if (store.token) {
        const newWin = window.open(`/depositLoading`, "Bank");
        newWin.localStorage.setItem("formDetails", JSON.stringify(form));
        window.addEventListener(
          "message",
          (event) => {
            if (event.data.msg) {
              if (event.data.msg === "Success") {
                isDeposited.value = true;
              } else {
                message.error(event.data.msg, 4);
              }
            }
          },
          { once: true }
        );
      }
    })
    .catch((error) => console.log(error));
}

async function verifyDepositAmount(r, v) {
  if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
    if (v < calculatedMinDeposit.value || v > activeMethod.value.depositMax) {
      return Promise.reject(
        t("personalView.finance.deposit.form.amount.error.range", {
          min: calculatedMinDeposit.value,
          max: activeMethod.value.depositMax
        })
      );
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
        return Promise.reject("Bank is required");
      }
    });
  }
}

onMounted(() => {
  initPay();
});
</script>
<style lang="scss">
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
<style lang="scss">
.dark-theme {
  .confirm-btn {
    width: 100%;
    max-width: 500px;
    color: #000000;
  }
  .ant-input-affix-wrapper .ant-input-prefix {
    color: #5f6061;
  }
  .account-content .deposit-container .deposit-amt-quick-select-item {
    // background: #ffffff0f;
    background: #0b0e0d99;
    color: #ffffff;
    &.active {
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      filter: none;
      color: #000a01;
    }
  }
}
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

.account-tip {
  display: flex;
  align-items: center;
  &-text.activemethod {
    div {
      display: inline-block;
    }
  }
}

.deposit {
  margin-bottom: 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    height: 180px;
  }
}

.dark-theme {
  .account-content
    .deposit-container
    .ant-form.ant-form-horizontal
    .ant-form-item
    .ant-form-item-control-input-content {
    .ant-input-affix-wrapper,
    > .ant-input {
      border: 1px solid #072a19;
      background: #0b0e0d99;
    }
  }
}

.account-content {
  .wload {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // position: absolute;
    // left: 0;z
    // top: 0;
    // bottom: 0;
    // right: 0;
    // margin: auto;
  }

  .loading {
    display: flex;
    justify-content: center;
    font-size: 30px;
    height: 100%;

    // img {
    //   width: 100%;
    //   max-width: 750px;
    // }

    // .icon {
    //   margin-right: 10px;
    // }
  }

  .node-wrapper {
    border-bottom: 1px solid #83a3ca33;
    // margin: 30px -30px;
    padding: 0 30px;
    // background: url(../../assets/images/common/bg.jpg);
    // margin: 30px -30px;
    // padding: 30px;
  }
  .deposit-container {
    .deposit-amt-quick-select-wrapper {
    }
    .deposit-amt-quick-select-title {
      font-weight: bold;
      font-size: 16px;
    }
    .deposit-amt-quick-select-list {
      display: grid;
      // grid-template-columns: repeat(auto-fit, minmax(10vw, 1fr));
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
      padding-bottom: 20px;
      max-width: 500px;
    }
    .deposit-amt-quick-select-item {
      border-radius: 4px;
      // border: 1px solid #eaeaea;
      font-weight: normal;
      // background: #ecf5ff;
      background: #0b0e0d99;
      color: #ffffff;
      padding: 20px;
      text-align: left;
      cursor: pointer;

      &.active {
        background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
        color: #ffffff;
        font-weight: bold;
      }
    }
    padding: 20px 30px;
    //
    .ant-form.ant-form-horizontal .ant-form-item .ant-form-item-control-input-content {
      .ant-input-affix-wrapper,
      > .ant-input {
        max-width: 280px;
        padding: 10px;
        margin-right: 20px;
        // border: 1px solid #eaeaea;
        border-radius: 12px;
      }

      .ant-input-affix-wrapper > .ant-input {
        border: none;
      }
    }

    :deep(.ant-form-item) {
      align-items: flex-start;
      gap: 10px;

      &.tip {
      }
    }

    :deep(.helptxt .ant-form-item-control-input-content) {
      display: flex;
      align-items: center;
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

    :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
      height: 40px;
    }

    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      height: 40px;
      padding: 5px 20px;

      border: 0;
    }
  }
}
</style>
<style scoped lang="scss">
:deep(.ant-form-item-label > label) {
  font-family: "Inter Medium";
}

.account-tip {
  &-text {
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .account-content .node-wrapper {
    padding: 0;
  }
  .account-content .deposit-container {
    padding: 20px 0;
  }
  .account-content.deposit {
    .node-wrapper {
      margin: 30px -10px;
      padding: 0 10px;
    }
  }
  .payment-method-wrapper {
    grid-template-columns: repeat(auto-fill, 80px);
    grid-gap: 10px;

    .payment-method-item {
      > img {
        width: 40px;
        height: 40px;
      }
    }
  }
  .payment-channel-wrapper {
    grid-template-columns: repeat(auto-fill, 160px);
    grid-column-gap: 10px;
  }
  .deposit-container {
    :deep(.helptxt .ant-form-item-control-input-content) {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }
}
</style>

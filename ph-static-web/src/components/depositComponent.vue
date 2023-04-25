<template>
  <div :class="isLoading ? 'wload deposit' : ''">
    <div class="loading" v-if="isLoading">
      <TFLoading></TFLoading>
    </div>
    <div v-if="!isLoading">
      <!-- <div class="account-tip-text">
        <RiSpamLine />
        Please note: The transaction unit in the game is TF VNDP, 1VNDP =
        1000VND
      </div> -->
      <div class="node-wrapper">
        <Node
          :level="1"
          :list="payMethods"
          ref="paymentNode"
          @clicked="onSelect"
        />
      </div>

      <div class="deposit-container">
        <a-form
          ref="formRef"
          :model="form"
          :rules="rules"
          :hideRequiredMark="true"
          name="basic"
          :colon="false"
          autocomplete="off"
          labelAlign="left"
        >
          <a-form-item
            class="helptxt"
            label="Deposit Amount"
            name="localAmount"
          >
            <a-input
              v-model:value="form.localAmount"
              placeholder="Enter an amount"
            />
            <div class="account-tip">
              Min amount one time :
              {{ calculatedMinDeposit ? calculatedMinDeposit : 0 }}
              {{ store.currency.value }}
              <br />
              Max Amount one time:
              {{
                activeMethod.depositMax
                  ? activeMethod.depositMax + " " + store.currency.value
                  : "No Limit"
              }}
            </div>
          </a-form-item>

          <a-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            label="Exchange Rate"
          >
            <span style="color: #9bffd1"
              >1.00 USDT ≈ {{ activeMethod.currencyRate }} ₱</span
            >
          </a-form-item>
          <a-form-item
            v-show="selectedPayType && bankCardList.length"
            label="Please select a bank"
            ref="bankId"
            name="bankId"
          >
            <template #label></template>
            <BankComponent
              ref="payTypeClass"
              :is="selectedPayType"
              v-model:value="form.bankId"
              :bank-list="bankCardList"
              @selected="selectedBank"
            ></BankComponent>
          </a-form-item>
          <a-form-item
            ref="privilegeId"
            name="privilegeId"
            v-if="hasPrivilege"
            label="Apply For Offer"
          >
            <a-select
              v-model:value="selectedPrivilege"
              placeholder="Please select an offer"
              @select="checkMinDepositAmt"
              @focus="loadPrivilege(activeMethod)"
            >
              <a-select-option
                v-for="p in unselectedPrivileges"
                :key="p.id"
                :value="p.id"
              >
                {{ p.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="selectedPayType" class="tip">
            <template #label></template>
            <span class="account-tip-text" style="margin-bottom: 10px">
              <div v-html="activeMethod.msg"></div>
            </span>
            <div class="account-tip-text">
              <RiSpamLine />
              New accounts that have updated personal information can
              participate in promotions
            </div>
          </a-form-item>
        </a-form>
        <div class="txt-center">
          <button @click="confirmDeposit" class="common-btn confirm-btn">
            Confirm Deposit
          </button>
        </div>
      </div>
      <a-modal
        class="footer-modal"
        wrap-class-name="sm"
        width="100%"
        v-model:visible="isDeposited"
        :maskClosable="false"
        :closable="false"
        :footer="null"
      >
        You have been redirected to your specific bank to proceed with the
        deposit.<br /><br />
        Once the deposit is successful, it will be reflected here.
        <div class="common-btn confirm-btn" @click="clearInfo">
          I understand
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef } from "vue";
import { loadPay, loadPrivileges } from "@/api/personal/deposit";
import { RiSpamLine } from "vue-remix-icons";
import { message } from "ant-design-vue";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/Bank";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
{
  RiSpamLine;
}
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

const form = reactive({
  paymentId: null,
  privilegeId: null,
  localAmount: null,
  bankId: null,
});

const checkAmount = reactive({
  flag: true,
  errorMessage: "",
});

const calculatedMinDeposit = ref("");
const rules = {
  localAmount: [
    {
      required: true,
      message: "Deposit amount is required",
      trigger: "blur",
    },
    {
      pattern: "^([1-9][0-9]*)$",
      message: "Amount should be a positive number",
      trigger: "change",
    },
    {
      validator: verifyDepositAmount,
      trigger: "change",
    },
  ],
  bankId: [
    {
      validator: verifyBank,
      trigger: "change",
    },
  ],
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

async function loadPrivilege(val) {
  privilegeList.value = [];
  // hasPrivilege.value = false;
  await loadPrivileges(val.paymentId).then((d) => {
    if (d.code == 0) {
      privilegeList.value = d.data.privileges;
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
          checkPrivilege(element);
        }
      });
    } else {
      activeMethod.value = value;
      checkPrivilege(value);
      formRef.value.resetFields();
    }
    checkMinDepositAmt();
  }
}
function checkMinDepositAmt(value, option) {
  if (!selectedPrivilege.value || !option) {
    calculatedMinDeposit.value = activeMethod.value.depositMin;
  } else {
    unselectedPrivileges.value.forEach((element) => {
      if (element.id === option.key) {
        calculatedMinDeposit.value = Math.max(
          activeMethod.value.depositMin,
          element.depositMin
        );
      }
    });
  }
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
  formRef.value.validate().then(() => {
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
  });
}
async function verifyDepositAmount(r, v) {
  if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
    if (v < calculatedMinDeposit.value || v > activeMethod.value.depositMax) {
      return Promise.reject(
        "Deposit should be between " +
          calculatedMinDeposit.value +
          " - " +
          activeMethod.value.depositMax
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
  // width: 300px;
  // height: 50px;
  // background-color: #db7e42;
  // margin: 68px auto 0;
  // color: #000000;
  // font-size: 18px;
  margin: 20px auto;
}
.account-tip {
  display: flex;
  align-items: flex-start;
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
.account-content {
  .wload {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // position: absolute;
    // left: 0;
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
    img {
      width: 100%;
    }
    .icon {
      margin-right: 10px;
    }
  }
  .node-wrapper {
    border-bottom: 1px solid #484460;
    // margin: 30px -30px;
    padding: 0 30px;
    // background: url(../../assets/images/common/bg.jpg);
    // margin: 30px -30px;
    // padding: 30px;
  }
  .deposit-container {
    padding: 20px 30px;
    // background: #23263c;
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
        color: #ffffff;
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
    :deep(.ant-select-single:not(.ant-select-customize-input)
        .ant-select-selector
        .ant-select-selection-search-input) {
      height: 40px;
    }
    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      height: 40px;
      padding: 5px 20px;
      background: #23263c;
      color: #ffffff;
      border: 0;
    }
  }
}
</style>
<style scoped lang="scss">
:deep(.ant-form-item-label > label) {
  color: #ffffff;
}
.account-tip {
  color: #ffffff;
  &-text {
    color: #ffffff;
  }
}
:deep(.ant-select) {
  height: 42px;
  width: 280px;
  margin-right: 24px;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector) {
  height: 42px;
}
:deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input) {
  height: 40px;
}
:deep(.ant-select-single
    .ant-select-selector
    .ant-select-selection-placeholder) {
  line-height: 30px;
}
:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
  line-height: 30px;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
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

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
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          autocomplete="off"
          label-width="100px"
          label-suffix=":"
        >
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item class="helptxt" label="余额" prop="localAmount">
                  <!-- <el-input
                  v-model="form.localAmount"
                  placeholder="输入存款余额"
                /> -->
                <el-input v-if="amountList.length === 0"
                  v-model="form.localAmount"
                  placeholder="输入存款金额"
                />

                <el-select placeholder="选择存款金额" v-else v-model="form.localAmount">
                  <el-option v-for="amount in amountList" :key="amount" :value="amount">
                    {{ amount }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="account-tip">
                最低存款 :
                {{ calculatedMinDeposit ? calculatedMinDeposit : 0 }} USDT
                 <br />
                最高存款:
                {{
                  activeMethod.depositMax ? activeMethod.depositMax : "No Limit"
                }} USDT
              </div>
            </el-col>
          </el-row>

          <el-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            label="实时汇率"
          >
            <span style="color: #9bffd1"
              >1.00 USDT ≈ {{ activeMethod.currencyRate }} RMB</span
            >
          </el-form-item>
          <el-form-item
            v-show="selectedPayType && bankCardList.length"
            label="银行"
            prop="bankId"
            name="bankId"
            value="bankName"
          >
            <template #label></template>
            <BankComponent
              ref="payTypeClass"
              :is="selectedPayType"
              :bank-list="bankCardList"
              @selected="selectedBank"
            ></BankComponent>
          </el-form-item>
          <el-form-item
            prop="privilegeId"
            name="privilegeId"
            v-if="hasPrivilege"
            label="优惠"
          >
            <el-select
              v-model="selectedPrivilege"
              placeholder="选择优惠"
              @select="checkMinDepositAmt"
              @focus="loadPrivilege(activeMethod)"
            >
              <el-option
                v-for="p in unselectedPrivileges"
                :key="p.id"
                :value="p.id"
                :label="p.name"
              >
                {{ p.name }}
              </el-option>
            </el-select>
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
          <el-form-item v-if="selectedPayType" class="tip">
            <!-- <template #label></template> -->
            <span class="account-tip-text" style="margin-bottom: 10px">
              <div v-html="activeMethod.msg"></div>
              <!-- {{ activeMethod.msg }} -->
            </span>
            <div class="account-tip-text">
              <el-icon><InfoFilled /> </el-icon>
                更新个人信息的新帐户可以参与促销活动。
            </div>
          </el-form-item>
          <div class="txt-center">
            <el-button @click="confirmDeposit" class="common-btn">
              确定
            </el-button>
          </div>
        </el-form>
      </div>
      <el-dialog
        class="isDeposit"
        width="500px"
        v-model="isDeposited"
        :maskClosable="false"
        :closable="false"
        title="已存款"
      >
        您将被重定向到您的银行页面以完成存款。<br /><br />

        如果成功，您将在此页面上收到通知。<br /><br />
        <el-button class="common-btn" @click="clearInfo">理解</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef } from "vue";
import { loadPay, loadPrivileges,verifyAmount } from "@/api/personal/deposit";
import { RiSpamLine } from "vue-remix-icons";
// import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/BankComponent";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
import { InfoFilled } from "@element-plus/icons-vue"
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
const amountList = ref([]);
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
      message: "请输入金额",
      trigger: "blur",
    },
    {
      pattern: "^([1-9][0-9]*)$",
      message: "金额应为正数",
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
  console.log(value)
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
  formRef.value.validate(async(valid) => {
    if (valid) {
        await verifyAmount(activeMethod.value.paymentId, form.localAmount).then(
        (d) => {
          if (d.code === 11002) {
            form.localAmount = d.data.suggestion;
            // message.error(d.message, 4);
            ElMessage.error(d.message);
          } else {
            doDeposit();
          }
        },
    );
    } else {
      return;
    }
  })
}

function doDeposit() {
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
            if (event.data?.msg) {
              console.log(event.data?.msg)
              if (event.data.msg === "success") {
                isDeposited.value = true;
              } else {
                ElMessage.error(event.data.msg);
                // message.error(event.data.msg, 4);
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
        "存入金额介于 " +
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
        return Promise.reject("请输入银行");
      }
    });
  }
}

onMounted(() => {
  initPay();
});
</script>
<style lang="scss">
body {
  .isDeposit {
    .el-dialog__body {
      padding: 20px;
    }
  }
}
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
// .deposit {
//   margin-bottom: 0;
//   min-height: 70vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   & > div {
//     height: 180px;
//   }
// }
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
    padding: 50px 0;
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
    padding: 10px 0;
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
// <style scoped lang="scss">
// @media (max-width: 768px) {
//   .account-content .node-wrapper {
//     padding: 0;
//   }
//   .account-content .deposit-container {
//     padding: 20px 0;
//   }
//   .account-content.deposit {
//     .node-wrapper {
//       margin: 30px -10px;
//       padding: 0 10px;
//     }
//   }
//   .payment-method-wrapper {
//     grid-template-columns: repeat(auto-fill, 80px);
//     grid-gap: 10px;

//     .payment-method-item {
//       > img {
//         width: 40px;
//         height: 40px;
//       }
//     }
//   }
//   .payment-channel-wrapper {
//     grid-template-columns: repeat(auto-fill, 160px);
//     grid-column-gap: 10px;
//   }
//   .deposit-container {
//     :deep(.helptxt .ant-form-item-control-input-content) {
//       flex-direction: column;
//       align-items: flex-start;
//       gap: 5px;
//     }
//   }
// }
</style>

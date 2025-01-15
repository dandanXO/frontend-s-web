<template>
  <div :class="isLoading ? 'wload deposit' : ''">
    <div class="loading" v-if="isLoading">
      <TFLoading></TFLoading>
    </div>
    <div v-if="!isLoading">
      <div class="account-tip-warning">
        <div>
          <img width="20px" src="../assets/images/finance/volume-up-fill.svg" />
          {{ $t("deposit.note") }}
        </div>
        <ul>
          <li>{{ $t("deposit.notept1") }}</li>
        </ul>

        <div v-if="selectedPayType" v-html="activeMethod.msg"></div>
      </div>
      <div class="node-wrapper">
        <Node :level="1" :list="payMethods" ref="paymentNode" @clicked="onSelect" />
      </div>

      <div v-if="submitMessage.length > 0 && isDisplay" class="inner-cont">
        <div class="submit-message">
          <div class="linebox">
            <span>{{ $t("common.bankName") }}</span>
            <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
            <button @blur="blurCode" @click="copyMessage('0')" class="common-btn">{{ copybtntxt0 }}</button>
          </div>
          <div class="linebox">
            <span>{{ $t("common.bankAcc") }}</span>
            <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
            <button @blur="blurCode" @click="copyMessage('1')" class="common-btn">{{ copybtntxt1 }}</button>
          </div>
          <div class="linebox">
            <span>{{ $t("common.bankCard") }}</span>
            <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
            <button @blur="blurCode" @click="copyMessage('2')" class="common-btn">{{ copybtntxt2 }}</button>
          </div>
          <div class="linebox">
            <span>{{ $t("common.branch") }}</span>
            <span class="info" ref="subMsg4">{{ submitMessage[4] }}</span>
            <button @blur="blurCode" @click="copyMessage('4')" class="common-btn">{{ copybtntxt4 }}</button>
          </div>
          <div class="linebox">
            <span>{{ $t("common.depositAmount") }}</span>
            <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
            <button @blur="blurCode" @click="copyMessage('3')" class="common-btn">{{ copybtntxt3 }}</button>
          </div>
          <div class="linebox" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
            <span>{{ $t("common.remark") }}</span>
            <span class="info" ref="subMsg5">{{ submitMessage[5] }}</span>
            <button @blur="blurCode" @click="copyMessage('5')" class="common-btn">{{ copybtntxt5 }}</button>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else>
        <el-form class="deposit-form" ref="formRef" :model="form" :rules="rules" autocomplete="off" label-suffix=":">
          <el-space>
            <el-form-item class="helptxt" :label="$t('deposit.amount')" prop="localAmount">
              <el-input
                v-if="amountList.length === 0"
                v-model="form.localAmount"
                :placeholder="isUSDT ? $t('deposit.inputUSDT') : $t('deposit.inputDeposit')"
              />

              <el-select :placeholder="$t('deposit.chooseAmt')" v-else v-model="form.localAmount">
                <el-option v-for="amount in amountList" :key="amount" :value="amount">
                  {{ amount }}
                </el-option>
              </el-select>
            </el-form-item>
            <div class="account-tip" style="margin-top: -15px">
              {{ $t("deposit.minAmt") }}: {{ calculatedMinDeposit ? calculatedMinDeposit.toLocaleString() : 0 }}
              {{ isUSDT ? "USDT" : store.currency.label }}
              <br />
              {{ $t("deposit.maxAmt") }}:
              {{ activeMethod.depositMax ? activeMethod.depositMax.toLocaleString() : $t("deposit.noLimit") }}
              {{ isUSDT ? "USDT" : store.currency.label }}
            </div>
            <div class="btn-confirm">
              <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">
                {{ $t("common.confirm") }}
              </el-button>
            </div>
          </el-space>

          <el-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            :label="$t('deposit.realTimeExchangeRate')"
          >
            <span style="color: #17cd27">1.00 USDT ≈ {{ activeMethod.currencyRate }} {{ store.currency.label }}</span>
          </el-form-item>

          <el-form-item v-if="isUSDT && activeMethod.currencyRate" class="helptxt" :label="$t('deposit.estimatedRate')">
            <span style="color: #17cd27">
              {{
                calculatedMinDeposit && form.localAmount < calculatedMinDeposit
                  ? "0.00"
                  : (form.localAmount * activeMethod.currencyRate).toFixed(2)
              }}
              {{ store.currency.label }}
            </span>
          </el-form-item>
          <el-space v-show="selectedPayType && bankCardList.length">
            <el-form-item :label="$t('deposit.bank')" prop="bankId" name="bankId" value="bankName">
              <template #label></template>
              <BankComponent
                ref="payTypeClass"
                :is="selectedPayType"
                :bank-list="bankCardList"
                v-model="form.bankId"
                @selected="selectedBank"
              ></BankComponent>
            </el-form-item>
            <div class="account-tip" style="margin-top: -15px">
              {{ $t("deposit.napas") }}
            </div>
            <div class="btn-confirm">
              <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">
                {{ $t("common.confirm") }}
              </el-button>
            </div>
          </el-space>
          <el-form-item
            prop="privilegeId"
            name="privilegeId"
            v-if="hasPrivilege && !isUSDT"
            :label="$t('deposit.promo')"
          >
            <el-select
              v-model="selectedPrivilege"
              :placeholder="$t('deposit.promo')"
              @select="checkMinDepositAmt"
              @focus="loadPrivilege(activeMethod)"
              fit-input-width
              clearable
              style="width: 500px"
            >
              <el-option v-for="p in unselectedPrivileges" :key="p.id" :value="p.id" :label="p.name">
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

          <!-- <el-form-item v-if="selectedPayType" class="tip">
            <span class="account-tip-text" style="margin-bottom: 10px; display: block; width: 100%;">
              <div v-html="activeMethod.msg"></div>
            </span>
          </el-form-item> -->

          <!-- <div class="txt-center">
            <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">
              确定
            </el-button>
          </div> -->
        </el-form>
      </div>
      <el-dialog
        width="500px"
        v-model="isDeposited"
        :maskClosable="false"
        :closable="false"
        :title="$t('deposit.deposited')"
      >
        {{ $t("deposit.redirected") }}
        <br />
        <br />

        {{ $t("deposit.successful") }}
        <br />
        <br />
        <el-button class="common-btn" @click="clearInfo">{{ $t("common.understand") }}</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef, watch } from "vue";
import { loadPay, loadPrivileges, verifyAmount, postDeposit } from "@/api/personal/deposit";

import { ElMessage, ElMessageBox } from "element-plus";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/BankComponent";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { doIt } from "@/utils/action";
import { useI18n } from "vue-i18n";
import { isOperaPixelUrl } from "@/utils/utils";

const { t } = useI18n();
const router = useRouter();
const loadingBtn = ref(false);
const store = userStore();
const formRef = ref();
const isDeposited = ref(false);
const isLoading = ref(true);
const payTypeClass = ref();
const payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const amountList = ref([]);
const bankCardList = ref([]);
const privilegeList = ref([]);
const selectedPrivilege = ref(null);
const unselectedPrivileges = ref([]);
const selectedPayType = shallowRef("");
const freePrivilege = ref(null);
const hasPrivilege = ref(false);
const isUSDT = ref(false);
const isDisplay = ref(false);
const submitMessage = ref([]);
const subMsg0 = ref();
const subMsg1 = ref();
const subMsg2 = ref();
const subMsg3 = ref();
const subMsg4 = ref();
const subMsg5 = ref();
const copybtntxt0 = ref(t("common.copy"));
const copybtntxt1 = ref(t("common.copy"));
const copybtntxt2 = ref(t("common.copy"));
const copybtntxt3 = ref(t("common.copy"));
const copybtntxt4 = ref(t("common.copy"));
const copybtntxt5 = ref(t("common.copy"));
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
  copybtntxt[position].value = t("common.copied");
  // copyText.select()
  // document.execCommand("copy")
  // copybtntxt0.value = 'คัดลอกแล้ว'
};

const blurCode = () => {
  const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3, copybtntxt4, copybtntxt5];
  copybtntxt.forEach((element) => {
    element.value = t("account.str_copy");
  });
};
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

const calculatedMinDeposit = ref("");
const rules = {
  localAmount: [
    {
      required: true,
      message: t("placeholder.amount"),
      trigger: "blur"
    },
    {
      pattern: /^[1-9]\d*$/,
      message: t("placeholder.wholeNumber"),
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

watch(selectedPrivilege, (newVal) => {
  if (newVal !== undefined && newVal === 0) {
    selectedPrivilege.value = null;
  }
});

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
    } else {
      ElMessage.error(d.message);
    }
  });
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  await loadPrivileges(val.paymentId).then((d) => {
    if (d.code == 0) {
      privilegeList.value = d.data.privileges;
      freePrivilege.value = null;
      unselectedPrivileges.value = [];
      privilegeList.value.map((p) => {
        if (p.payTypes.indexOf(val.payType) >= 0) {
          if (p.triggerType == "FREE") {
            freePrivilege.value = p;
          } else {
            hasPrivilege.value = true;
            unselectedPrivileges.value.push(p);
          }
        }
      });

      // console.log(privilegeList.value)
      unselectedPrivileges.value.push({
        code: "LATER",
        depositMin: 0,
        id: 0,
        name: t("account.choose_later"),
        payTypes: "",
        triggerType: ""
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
  isDisplay.value = false;
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
      if (formRef.value) {
        formRef.value.resetFields();
      }
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
        calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, element.depositMin);
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
  form.bankId = value.value;
  // console.log(form.bankId);
}

function clearInfo() {
  isDeposited.value = false;
  form.localAmount = "";
  form.bankId = "";
  selectedPrivilege.value = null;
  checkMinDepositAmt();
}

function confirmDeposit() {
  if (store.token) {
    if (!store.phone) {
      ElMessageBox.confirm(t("bankError.safetyBeforePhone"), t("common.systemError"), {
        showClose: "false",
        cancelButtonClass: "cancel-btn",
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
        draggable: true,
        buttonSize: "small"
      })
        .then(() => {
          router.push("/center/personal");
        })
        .catch(() => {});
      return;
    }
    if (!store.realName) {
      ElMessageBox.confirm(t("bankError.bindRealName"), t("common.systemError"), {
        showClose: "false",
        cancelButtonClass: "cancel-btn",
        confirmButtonText: t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
        draggable: true,
        buttonSize: "small"
      })
        .then(() => {
          router.push("/center/personal");
        })
        .catch(() => {});
      return;
    }
  }
  loadingBtn.value = true;

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
  form.paymentId = activeMethod.value.paymentId;
  formRef.value
    .validate()
    .then(async () => {
      verifyAmount(activeMethod.value.paymentId, form.localAmount)
        .then((d) => {
          loadingBtn.value = false;
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
    })
    .catch((vali) => {
      // console.log(vali)
    });
  setTimeout(() => {
    loadingBtn.value = false;
  }, 1000);
}

function doDeposit(data) {
  loadingBtn.value = true;
  postDeposit(data)
    .then((d) => {
      if (d.code === 0) {
        if (isOperaPixelUrl()) {
          otag("event", "deposit");
        }

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
            // window.addEventListener(
            //     "message",
            //     (event) => {
            //       if (event.data?.msg) {
            //         if (event.data.msg === "success") {
            //           isDeposited.value = true;
            //         } else {
            //           ElMessage.error(event.data.msg);
            //         }
            //       }
            //     },
            //     { once: true }
            // );
          }
        });
        loadingBtn.value = false;
      } else {
        if (d.code === 11004) {
          d.message = t("common.privilegeDeposit");
        }
        ElMessage.error(d.message);
      }
    })
    .catch((err) => {
      console.log(err);
      loadingBtn.value = false;
    });
  loadingBtn.value = false;
}

async function verifyDepositAmount(r, v) {
  if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
    if (v < calculatedMinDeposit.value || v > activeMethod.value.depositMax) {
      return Promise.reject(
        t("account.deposit_should_between") + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax
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
        return Promise.reject(t("account.please_select_bank"));
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
.account-tip-warning {
  border: 1px solid #f8dd9a;
  background: #fef7e6;
  color: #000000;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  ul {
    margin: 0;
    padding: 0 0 0 21px;
  }
  svg {
    height: 15px;
    // fill: #FFC024;
    fill: #000000;
    margin-right: 10px;
  }
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
    // border-bottom: 1px solid #484460;
    // margin: 30px -30px;
    padding: 10px 0;
    // background: url(../../assets/images/common/bg.jpg);
    // margin: 30px -30px;
    // padding: 30px;
  }

  .deposit-container {
    .el-space {
      display: flex;
    }
    .el-input__wrapper {
      padding: 8px 20px;
    }
    .el-select__wrapper {
      padding: 15px 20px;
    }

    // padding: 20px 30px;
    // background: #23263c;
    .ant-form.ant-form-horizontal .ant-form-item .ant-form-item-control-input-content .ant-input {
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

    :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
      height: 40px;
    }

    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      height: 40px;
      padding: 5px 20px;
      background: #23263c;
      color: #ffffff;
      border: 0;
    }

    .el-select__wrapper {
      width: 500px;
    }
  }
}
</style>
<style scoped lang="scss">
.deposit-form {
  position: relative;
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background-color: #f7f8fb;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  }
  :deep(.el-form-item) {
    display: flex;
    // flex-direction: column;
    align-items: center;
  }
  :deep(.el-form-item__label) {
    // font-family: Poppins;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
    text-align: left;

    justify-content: flex-start;
  }
}

.txt-center {
  margin: 50px auto 20px;
  text-align: center;
}

:deep(.ant-form-item-label > label) {
  color: #ffffff;
}

// .account-tip {
//   color: #ffffff;
//   &-text {
//     color: #ffffff;
//   }
// }
:deep(.ant-select) {
  height: 42px;
  width: 280px;
  margin-right: 24px;
}

:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
  height: 42px;
}

:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  height: 40px;
}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
  line-height: 30px;
}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
  line-height: 30px;
}
</style>
<style scoped lang="scss">
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
<style lang="scss">
.inner-cont {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-message {
  width: calc(100% - 40px);
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
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

.el-button.cancel-btn {
  background-color: #bd4646;

  &:hover,
  &:focus {
    border-color: #dc6666;
    background-color: #d86d6d;
  }
}

.btn-confirm {
  padding-left: 20px;
  margin-bottom: 10px;
  .el-button {
    background: url(data:image/png;base64,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);
    background-size: 100% 100%;
  }
}
</style>

<template>
  <div :class="isLoading ? 'wload deposit' : ''">
    <div class="loading" v-if="isLoading">
      <TFLoading></TFLoading>
    </div>
    <div v-if="!isLoading">
      <div class="account-tip-warning">
        <div>
          {{ $t("deposit.note") }}
        </div>
        <!-- <div>
          <RiVolumeUpFill />
          {{ $t("deposit.note") }}
        </div>
        <ul>
          <li>{{ $t("deposit.notept1") }}</li>
        </ul> -->

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
                v-model="localAmountWithComma"
                :placeholder="isUSDT ? $t('deposit.inputUSDT') : $t('deposit.inputDeposit')"
              />

              <el-select :placeholder="$t('deposit.chooseAmt')" v-else v-model="form.localAmount">
                <el-option v-for="amount in amountList" :key="amount" :value="amount">
                  {{ amount }}
                </el-option>
              </el-select>
            </el-form-item>
            <div class="account-tip">
              {{ $t("deposit.minAmt") }}: {{ calculatedMinDeposit ? calculatedMinDeposit.toLocaleString() : 0 }}
              {{ isUSDT ? "USDT" : store.currency.label }}
              <br />
              {{ $t("deposit.maxAmt") }}:
              {{ activeMethod.depositMax ? activeMethod.depositMax.toLocaleString() : $t("deposit.noLimit") }}
              {{ isUSDT ? "USDT" : store.currency.label }}
            </div>
          </el-space>

          <el-form-item
            v-if="isUSDT && activeMethod.currencyRate"
            class="helptxt"
            :label="$t('deposit.realTimeExchangeRate')"
          >
            <span style="color: #17cd27">1.00 USDT ≈ {{ activeMethod.currencyRate }} {{ store.currency.label }}</span>
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
            <div class="account-tip">
              {{ $t("deposit.napas") }}
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

          <div class="btn-confirm">
            <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">
              {{ $t("common.confirm") }}
            </el-button>
          </div>

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
import { ref, reactive, onMounted, shallowRef, watch, computed, toRef } from "vue";
import { loadPay, loadPrivileges, verifyAmount, postDeposit } from "@/api/personal/deposit";
import { RiVolumeUpFill } from "vue-remix-icons";
// import { message } from "ant-design-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/BankComponent";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
// import { InfoFilled } from "@element-plus/icons-vue";
import { doIt } from "@/utils/action";
import { useI18n } from "vue-i18n";
import { useCommaInput } from "@/hooks/commaInput";

{
  RiVolumeUpFill;
}

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

const localAmountWithComma = useCommaInput(toRef(form, "localAmount"));

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
        // if (window.location.href.indexOf("5svn88.com") > -1 || window.location.href.indexOf("tfpromo88.com") > -1 || window.location.href.indexOf("tf88bof.com") > -1) {
        //   otag("event", "deposit");
        // }

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
  color: #ffc024;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  white-space: pre-line;
  ul {
    margin: 0;
    padding: 0 0 0 21px;
  }
  svg {
    height: 15px;
    fill: #ffc024;
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
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background-color: #f7f8fb;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  }
  :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
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
  margin-bottom: 10px;
}
</style>

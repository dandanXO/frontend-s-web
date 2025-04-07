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
        <Node :level="1" :list="payMethods" ref="paymentNode" @clicked="onSelect" />
      </div>

      <div v-if="submitMessage.length > 0 && isDisplay" class="inner-cont">
        <div class="submit-message">
          <div class="linebox">
            <span>银行名称：</span>
            <span class="info" ref="subMsg0">{{ submitMessage[0] }}</span>
            <button @blur="blurCode" @click="copyMessage('0')" class="common-btn">{{ copybtntxt0 }}</button>
          </div>
          <div class="linebox">
            <span>银行户名：</span>
            <span class="info" ref="subMsg1">{{ submitMessage[1] }}</span>
            <button @blur="blurCode" @click="copyMessage('1')" class="common-btn">{{ copybtntxt1 }}</button>
          </div>
          <div class="linebox">
            <span>银行卡号：</span>
            <span class="info" ref="subMsg2">{{ submitMessage[2] }}</span>
            <button @blur="blurCode" @click="copyMessage('2')" class="common-btn">{{ copybtntxt2 }}</button>
          </div>
          <div class="linebox">
            <span>支付行：</span>
            <span class="info" ref="subMsg4">{{ submitMessage[4] }}</span>
            <button @blur="blurCode" @click="copyMessage('4')" class="common-btn">{{ copybtntxt4 }}</button>
          </div>
          <div class="linebox">
            <span>存款金额：</span>
            <span class="info" ref="subMsg3">{{ submitMessage[3] }}</span>
            <button @blur="blurCode" @click="copyMessage('3')" class="common-btn">{{ copybtntxt3 }}</button>
          </div>
          <div class="linebox" v-if="submitMessage[5] && submitMessage[5] !== 'null'">
            <span>备注：</span>
            <span class="info" ref="subMsg5">{{ submitMessage[5] }}</span>
            <button @blur="blurCode" @click="copyMessage('5')" class="common-btn">{{ copybtntxt5 }}</button>
          </div>
        </div>
      </div>
      <div class="deposit-container" v-else>
        <el-form
          class="deposit-form"
          ref="formRef"
          :model="form"
          :rules="rules"
          autocomplete="off"
          label-width="100px"
          label-suffix=":"
        >
          <el-space>
            <el-form-item class="helptxt" label="金额" prop="localAmount">
              <el-input
                v-if="amountList.length === 0"
                v-model="form.localAmount"
                :placeholder="isUSDT ? '请输入USDT金额' : '请输入存款金额'"
              />

              <el-select placeholder="选择存款金额" v-else v-model="form.localAmount">
                <el-option v-for="amount in amountList" :key="amount" :value="amount">
                  {{ amount }}
                </el-option>
              </el-select>
            </el-form-item>
            <div class="account-tip">
              单笔存款：{{ calculatedMinDeposit ? calculatedMinDeposit : 0 }}
              {{ isUSDT ? "USDT" : store.currency.label }} -
              {{ activeMethod.depositMax ? activeMethod.depositMax : "No Limit" }}
              {{ isUSDT ? "USDT" : store.currency.label }}
            </div>

            <div class="btn-confirm">
              <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">确定</el-button>
            </div>
          </el-space>

          <el-form-item v-if="isUSDT && activeMethod.currencyRate" class="helptxt" label="实时汇率">
            <span style="color: #17cd27">1.00 USDT ≈ {{ activeMethod.currencyRate }} {{ store.currency.label }}</span>
          </el-form-item>

          <el-form-item v-if="isUSDT && activeMethod.currencyRate" class="helptxt" label="预计到账">
            <span style="color: #17cd27">
              {{
                calculatedMinDeposit && form.localAmount < calculatedMinDeposit
                  ? "0.00"
                  : (form.localAmount * activeMethod.currencyRate).toFixed(2)
              }}
              {{ store.currency.label }}
            </span>
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
              v-model="form.bankId"
              @selected="selectedBank"
            ></BankComponent>
          </el-form-item>
          <el-form-item prop="privilegeId" name="privilegeId" v-if="hasPrivilege" label="优惠">
            <el-select
              v-model="selectedPrivilege"
              class="privilege-select"
              placeholder="选择优惠"
              @change="checkMinDepositAmt"
              @focus="loadPrivilege(activeMethod)"
              fit-input-width
              clearable
              style="width: 350px"
            >
              <el-option v-for="p in unselectedPrivileges" :key="p.id" :value="p.id" :label="p.name">
                {{ p.name }}
              </el-option>
            </el-select>
          </el-form-item>

          <div
            class="rollover-info"
            v-if="selectedPromo && selectedPromo.name && (selectedPromo.gameTypeRollover || selectedPromo.rollover)"
          >
            <span v-if="selectedPromo.depositMin">
              优惠最低存款要求：{{ selectedPromo.depositMin }}元，&nbsp;&nbsp;&nbsp;
            </span>
            <span v-if="selectedPromo.gameTypeRollover && selectedPromo.gameTypeRollover !== '{}'">
              {{ getRollOverText(selectedPromo.gameTypeRollover) }}
            </span>
            <span v-else>流水倍数要求（本金+彩金）：{{ selectedPromo.rollover }}倍</span>
          </div>

          <el-form-item v-if="selectedPayType" class="tip">
            <!-- <template #label></template> -->
            <span class="account-tip-text" style="margin-bottom: 10px; display: block; width: 100%">
              <div v-html="activeMethod.msg"></div>
              <!-- {{ activeMethod.msg }} -->
            </span>
            <!-- <div class="account-tip-text">
              <el-icon><InfoFilled /> </el-icon>
                更新个人信息的新帐户可以参与促销活动。
            </div> -->
          </el-form-item>

          <!-- <div class="txt-center">
            <el-button :loading="loadingBtn" size="large" @click="confirmDeposit" class="common-btn">
              确定
            </el-button>
          </div> -->
        </el-form>
      </div>
      <el-dialog width="500px" v-model="isDeposited" :maskClosable="false" :closable="false" title="已存款">
        您将被重定向到您的银行页面以完成存款。
        <br />
        <br />

        如果成功，您将在此页面上收到通知。
        <br />
        <br />
        <el-button class="common-btn" @click="clearInfo">理解</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, shallowRef, watch } from "vue";
import { loadPay, loadPrivileges, verifyAmount, postDeposit } from "@/api/personal/deposit";
import { ElMessageBox } from "element-plus";
import Node from "@/components/paymentSelect/node";
import BankComponent from "@/components/finance/BankComponent";
import TFLoading from "@/components/loading/TFLoading.vue";
import { userStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
// import { InfoFilled } from "@element-plus/icons-vue";
import { doIt } from "@/utils/action";
import { useNotify } from "@/hooks/notify";

const router = useRouter();
const route = useRoute();
const loadingBtn = ref(false);
const store = userStore();
const notify = useNotify();
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
const selectedPromo = ref({});
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
      message: "请输入金额",
      trigger: "blur"
    },
    {
      validator: verifyDepositDecimal,
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
      notify({
        type: "error",
        message: d.message
      });
    }
  });
}

async function loadPrivilege(val) {
  privilegeList.value = [];
  freePrivilege.value = null;
  await loadPrivileges(val.paymentId).then((d) => {
    if (d.code === 0) {
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

            if (p.code === route.query?.privilegeCode && selectedPrivilege.value === null) {
              selectedPrivilege.value = p.id;
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

function checkMinDepositAmt(value) {
  if (!selectedPrivilege.value || !value) {
    calculatedMinDeposit.value = activeMethod.value.depositMin;
  } else {
    unselectedPrivileges.value.forEach((element) => {
      if (element.id === value) {
        if (isUSDT.value) {
          calculatedMinDeposit.value = Math.max(
            activeMethod.value.depositMin,
            parseFloat(element.depositMin / activeMethod.value.currencyRate).toFixed(2)
          );
        } else {
          calculatedMinDeposit.value = Math.max(activeMethod.value.depositMin, element.depositMin);
        }
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
  selectedPromo.value = {};
  checkMinDepositAmt();
}

function confirmDeposit() {
  if (store.token) {
    if (!store.phone) {
      ElMessageBox.confirm("为保证资金安全，存款前请先验证手机号", "系统提示", {
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
    }
    if (!store.realName) {
      ElMessageBox.confirm("您还未绑定真实姓名，请前往绑定", "系统提示", {
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
            notify({
              type: "error",
              message: d.message
            });
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
        notify({
          type: "error",
          message: d.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
      loadingBtn.value = false;
    });
  loadingBtn.value = false;
}

async function verifyDepositDecimal(r, v) {
  if (isUSDT.value) {
    return Promise.resolve();
  } else {
    var decimalPattern = /^[1-9]\d*$/;
    if (v.match(decimalPattern) !== null) {
      return Promise.resolve();
    } else {
      return Promise.reject("金额应为正数");
    }
  }
}

async function verifyDepositAmount(r, v) {
  if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
    if (v < calculatedMinDeposit.value || v > activeMethod.value.depositMax) {
      return Promise.reject("存入金额介于 " + calculatedMinDeposit.value + " - " + activeMethod.value.depositMax);
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

watch(
  () => selectedPrivilege.value,
  () => {
    if (selectedPrivilege.value) {
      selectedPromo.value = unselectedPrivileges.value.find((item) => item.id === selectedPrivilege.value);
    } else {
      selectedPromo.value = null;
    }
  }
);

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
  // margin-bottom: 10px;
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
    // margin: 30px -30px;
    padding: 10px 0;
    // background: url(../../assets/images/common/bg.jpg);
    // margin: 30px -30px;
    // padding: 30px;
  }

  .deposit-container {
    padding: 20px 30px;
    .el-space {
      margin-bottom: 8px;
    }
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
      width: 350px;
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
}

.privilege-select {
  :deep(.el-select__wrapper) {
    &.is-hovering {
      .el-select__caret {
        color: var(--el-color-error);
      }
    }
  }
}

.txt-center {
  margin: 50px auto 20px;
  text-align: center;
}

:deep(.ant-form-item-label > label) {
  color: #ffffff;
}

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
.deposit-container :deep(.el-form-item) {
  margin-bottom: 0px;
}
</style>
<style scoped lang="scss">
.dark {
  .deposit-container {
    color: $font-3-dark;

    .account-tip-text {
      color: $font-3-dark;
    }

    .deposit-form {
      :deep(.el-input__wrapper),
      :deep(.el-select__wrapper) {
        box-shadow: none;
        background-color: $background-content-block-lighter-dark;
      }
    }
  }
}
</style>
<style scoped lang="scss">
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

.rollover-info {
  color: #bd4646;
  margin-left: 100px;
  margin-bottom: 10px;
}

.btn-confirm {
  padding-left: 20px;
  // margin-bottom: 10px;
  .el-button {
    background-image: url(../assets/images/finance/deposit/btn-bg.png) !important;
    background-size: 100% 100%;
    &:hover {
      opacity: 0.9;
      background-size: 100% 100%;
    }
    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
}

.dark {
  .btn-confirm {
    .el-button {
      background: url("../assets/images/home/standard-button-bg.svg") no-repeat center center !important;
      background-size: cover !important;
      box-shadow: none;
      border-radius: 8px;
      border: 1px solid #3a93ce;
    }
  }
}
</style>

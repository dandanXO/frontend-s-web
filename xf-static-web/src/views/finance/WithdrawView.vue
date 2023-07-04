<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">快速提款</span>
    </div>

    <div class="menu-title-container">
      <span class="menu-title">提款流程：</span>
      <div class="account-content withdrawal">
        <div class="flex-box">
          <div class="step-item active">申请中</div>
          <div class="step-item">审核中</div>
          <div class="step-item">支付中</div>
          <div class="step-item">出款成功</div>
        </div>
        <div class="withdraw-tip">* 若提款失败请查看站内信提示的失败原因！</div>
      </div>
    </div>
    <div class="withdraw-form">
      <el-form
        ref="formRef"
        label-width="150px"
        label-position="left"
        label-suffix=":"
        :model="withdrawInfo"
        :rules="withdrawRules"
      >
        <el-form-item label="提款方式">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="txt-center withdraw-type-item"
            @click="selectMethod(method, i)"
            :class="{ active: i === activeItem }"
          >
            <span class="promo" v-if="method.recommended">
              {{ "finance.withdraw.recommended" }}
            </span>
            <img :src="imgURL + method.icon" />
            <div class="type-name">{{ method.name }}</div>
          </div>
        </el-form-item>

        <el-form-item
          class="helptxt"
          prop="amount"
          label="提款金额"
          name="amount"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input
                class="form-input"
                v-model="withdrawInfo.amount"
                placeholder="提款金额"
              >
                <template #append>{{ store.currency.label }}</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <span v-if="selectedWithdrawalMethod">
                {{
                  `单笔限额: ${selectedWithdrawalMethod.withdrawMin} ${store.currency.label} - ${selectedWithdrawalMethod.withdrawMax} ${store.currency.label}`
                }}
                <br />
                {{
                  `今日提款: ${selectedWithdrawalMethod.withdrawMaxAmount} ${store.currency.label}, 剩余: ${selectedWithdrawalMethod.withdrawMaxTimes} 次`
                }}
              </span>
            </el-col>
          </el-row>
          <!-- <div
            v-if="selectedWithdrawalMethod"
            class="account-tip remain-box"
            v-html="
              ('finance.withdraw.limitTip', {
                min: selectedWithdrawalMethod.withdrawMin,
                max: selectedWithdrawalMethod.withdrawMax,
                got: selectedWithdrawalMethod.withdrawMaxAmount,
                last: selectedWithdrawalMethod.withdrawMaxTimes,
              })
            "
          ></div> -->
        </el-form-item>
        <el-row>
          <el-col>
            <div
              v-if="!isUSDT && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
          </el-col>
        </el-row>
        <el-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          label="实时汇率"
        >
          <span style="color: #9bffd1">
            1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
            {{ store.currency.label }}
          </span>
        </el-form-item>
        <el-form-item
          class="select"
          style="margin-top: 20px"
          prop="cardId"
          :label="isUSDT ? '选择钱包地址' : '选择银行卡'"
          :rules="[
            {
              required: true,
              message: isUSDT ? '请选择钱包地址' : '请选择银行卡',
              trigger: 'blur'
            }
          ]"
        >
          <el-select
            @click="
              withdrawState.bankCardList.length === 0 ? checkBankCards() : ''
            "
            v-model="withdrawInfo.cardId"
            :placeholder="isUSDT ? '选择钱包地址' : '选择银行卡'"
            style="width: 300px"
          >
            <el-option
              v-for="b in withdrawState.bankCardList"
              :key="b.id"
              :value="b.id"
              :label="b.bankName + ' - ' + b.cardNumber"
            >
              {{ b.bankName }} - {{ b.cardNumber }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          label="预计到账"
        >
          <span style="color: #9bffd1">
            {{
              (
                withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate
              ).toFixed(2)
            }}
            USDT
          </span>
        </el-form-item>

        <div
          v-if="isUSDT && selectedWithdrawalMethod.tips"
          class="selected-tip"
          v-html="selectedWithdrawalMethod.tips"
        ></div>

        <div class="flex-box flex-justify-center">
          <el-button
            :loading="loadingBtn"
            size="large"
            class="common-btn withdraw-btn"
            @click="submitWithraw"
          >
            确定
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { loadBankCards, confirmWithdraw, withdrawEntrance } from "@/api/personal/personal";
// import { message } from "ant-design-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store";
import { RiArrowRightSLine } from "vue-remix-icons";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "WithdrawView",
  components: {
    RiArrowRightSLine
  },
  setup() {
    const router = useRouter();
    const loadingBtn = ref(false);
    const store = userStore();
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/withdraw/';
    const formRef = ref();
    const activeItem = ref(0);
    const isUSDT = ref(false);
    const withdrawState = reactive({
      bankCardList: [],
    });
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: "",
    });
    const withdrawalMethods = ref([
      // {
      //   bankIcon: require('../../assets/images/finance/bank_deposit.png',
      //   bankName: 'Bank Transfer',
      //   recommended: true
      // },
      // {
      //   bankIcon: require('../../assets/images/finance/usdt_deposit.png',
      //   bankName: 'USDT',
      //   recommended: true
      // },
      // {
      //   bankIcon: require('../../assets/images/finance/deposit/pay_method_zalo.png',
      //   bankName: 'ZALO',
      //   recommended: false
      // }
    ])
    onMounted(() => {
      getWithdrawalMethods();
    });
    const submitWithraw = () => {
      loadingBtn.value = true;
      formRef.value
        .validate()
        .then(() => {
          confirmWithdraw(withdrawInfo).then((response) => {
            if(response.code === 0) {
              store.getBalance();
              ElMessage({
                message: 'Success',
                type: 'success',
              })
              getWithdrawalMethods();
            } else {
              // message.error(response.message);
            }
          }).catch((error) => {
              console.log(error.message);
            // message.error(error.message, 4)
          });
        }).catch((error) => {
          console.log("error", error);
        });
        loadingBtn.value = false;
    };
    const withdrawRules = {
      amount: [
        {
          required: true,
          message: "请输入金额",
          trigger: "blur",
        },
        {
          pattern: '^([1-9][0-9]*)$',
          message: "金额应为正数",
          trigger: "change",
        },
        {
          validator: verifyWithdrawAmount,
          trigger: "change",
        },
      ],
    };
    const checkBankCards = () => {
      ElMessageBox.alert(
      '请先绑定银行卡', "系统提示",
      {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: '确认',
        draggable: false,
        buttonSize: 'small',
        closeOnClickModal: false,
        center: true,
      }
    )
      .then(() => {
        router.push('/center/withdrawbank')
      })
      .catch(() => {
      })
    }
    const loadCards = () => {
        withdrawState.bankCardList = []
        loadBankCards().then((response) => {
          if (response.code === 0) {
            response.data.forEach(element => {
              if (element.bankType === 'BANK') {
                  if (element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                    withdrawState.bankCardList.push(element)
                  }
                } else {
                  console.log(selectedWithdrawalMethod.value.code)
                  if (element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                    withdrawState.bankCardList.push(element)
                  }
                }
            });
          }
        }).catch((error) => {
          console.log(error.message);
          // message.error(error.message, 4)
           })
    }

    async function verifyWithdrawAmount(r, v) {
      if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
        if (v < selectedWithdrawalMethod.value.withdrawMin || v > selectedWithdrawalMethod.value.withdrawMax) {
          return Promise.reject(
            "存入金额介于 " +
              selectedWithdrawalMethod.value.withdrawMin +
              " - " +
              selectedWithdrawalMethod.value.withdrawMax
          );
        } else {
            return Promise.resolve();
        }
      }
    }
    const selectedWithdrawalMethod = ref({})
    const selectMethod = (method, index) => {
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method
      withdrawInfo.withdrawCode = method.code;
      activeItem.value = index;
      if (withdrawInfo.withdrawCode.includes('USDT')) {
        isUSDT.value = true
      } else {
        isUSDT.value = false
      }
      loadCards()
    }
    const getWithdrawalMethods = () => {
      withdrawEntrance().then((response) => {
        if (response.code === 0) {
          withdrawalMethods.value = response.data;
          if (withdrawalMethods.value.length) {
            selectMethod(withdrawalMethods.value[0], 0)
          }
        } else {
          // message.error(response.message);
        }
      })
    }
    return {
      formRef,
      withdrawInfo,
      submitWithraw,
      withdrawRules,
      withdrawState,
      withdrawalMethods,
      activeItem,
      selectedWithdrawalMethod,
      loadCards,
      selectMethod,
      imgURL,
      isUSDT,
      verifyWithdrawAmount,
      store,
      loadingBtn,
      checkBankCards
    };
  },
});
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
    .withdrawalmethod {
      overflow: auto;
    }
    .withdrawal {
      margin: 10px 0;
      .flex-box {
        display: flex;
        justify-content: center;
      }
      .withdraw-tip {
        color: #ff7f10;
      }
      ul {
        margin: 20px auto;
        padding: 0 0 0 20px;
        li {
          list-style-type: disc;
          margin-bottom: 10px;
        }
      }
    }
    .step-item {
      color: #ffffff;
      width: 130px;
      // height: 50px;
      line-height: 45px;
      background-color: #2a313e;
      text-align: center;
      position: relative;
      border: 2px solid #2a313e;
      border-left: 0;
      padding-left: 20px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      &::before,
      &::after {
        content: "";
        position: absolute;
        border-top: 23px solid transparent;
        border-bottom: 23px solid transparent;
        top: 0px;
      }
      &::before {
        left: 0;
        top: -2px;
        border-left: 25px solid #24222e;
        border-top: 25px solid transparent;
        border-bottom: 25px solid transparent;
      }
      &::after {
        border-left: 23px solid #2a313e;
        right: -23px;
        z-index: 1;
      }
      &.active {
        color: #ffffff;
        // background: #ffffff;
        background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%),
          linear-gradient(#45fdfb, #45fdfb);
        border: 0;
        padding-left: 0px;
        &::after {
          border-left: 25px solid #0a5f8a;
          top: 0;
          right: -25px;
          border-top: 25px solid transparent;
          border-bottom: 25px solid transparent;
        }
      }
      &:first-child::before,
      &:last-child::after {
        display: none;
      }
    }
    .withdraw-type-item {
      // width: 120px;
      // padding: 20px 30px;
      // margin-right: 10px;
      // border-radius: 6px;
      // border: solid 1px #484460;
      // position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      img {
        width: 40px;
        padding: 2px 20px;
        background: #2a313e;
      }
      &.active {
        // border-bottom: 4px solid #1bcef1;
        // border: 1px solid #ffd800;
        // color: #ffd800;
        img {
          border: 1px solid #45fdfb;
        }
      }
      .type-name {
        line-height: 15px;
        margin: 10px 0 0;
        overflow-wrap: break-word;
      }
      .promo {
        position: absolute;
        right: 0;
        top: 0;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: top center;
        top: -8px;
        right: -1px;
        background: #ffd800;
        padding: 5px;
        color: #000000;
        font-size: 12px;
        line-height: 10px;
        border-radius: 0 10px;
        font-weight: bold;
        ::after {
          position: relative;
        }
      }
    }
  }
  .withdraw-btn {
    // min-width: 300px;
    margin: 30px auto;
    &.cancel {
      margin-right: 60px;
    }
    // height: 50px;
    // margin-top: 50px;
    // &.withdraw {
    //   color: #161b23;
    //   background-color: #1bcef1;
    //   margin-left: 60px;
    // }
    // &.cancel {
    //   color: #ffffff;
    //   background-color: #163d5b;
    //   border: 1px solid #ffffff;
    // }
  }
}
.withdraw-form {
  padding: 20px 0;
}
</style>
<style scoped lang="scss">
// .ant-form.ant-form-horizontal .ant-form-item .ant-form-item-control-input-content .ant-input {
//   background: #16151c;
//   max-width: 280px;
// }
// :deep(.ant-select-single:not(.ant-select-customize-input)
//     .ant-select-selector) {
//   height: 42px;
// }
// :deep(.ant-select-single:not(.ant-select-customize-input)
//     .ant-select-selector
//     .ant-select-selection-search-input) {
//   height: 40px;
// }
// :deep(.ant-select-single
//     .ant-select-selector
//     .ant-select-selection-placeholder) {
//   line-height: 40px;
// }
// :deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
//   line-height: 40px;
// }
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      .withdraw-btn {
        min-width: unset;
        margin: 20px auto;
      }
      .step-item {
        font-size: 10px;
        line-height: 25px;
        font-weight: bold;
        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 0px;
        }
        &::before {
          left: 0;
          top: -2px;
          border-left: 15px solid #24222e;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }
        &::after {
          border-left: 13px solid #2a313e;
          right: -13px;
          border-top: 13px solid transparent;
          border-bottom: 13px solid transparent;
          z-index: 1;
        }
        &.active {
          color: #24222e;
          background: #ffffff;
          border: 0;
          padding-left: 0px;
          &::after {
            border-left: 15px solid #ffffff;
            top: 0;
            right: -15px;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
          }
        }
        &:first-child::before,
        &:last-child::after {
          display: none;
        }
      }
    }
  }

  :deep(.ant-form-horizontal .ant-form-item-label) {
    text-align: left;
    width: 120px;
    flex: none;
    max-width: unset;
  }

  :deep(.ant-form-horizontal .ant-form-item-control) {
    width: auto;
    flex: none;
    max-width: unset;
  }
  .helptxt {
    :deep(.ant-form-item-control-input-content) {
      display: flex;
      flex-direction: column;
    }
    .ant-input {
      width: 100%;
    }
  }
}
:deep(.ant-input-affix-wrapper) {
  background: #15141b;
  border: 0;
  padding: 8px 16px;
  max-width: 280px;
  .ant-input {
    border: 0;
  }
  .ant-input-suffix {
    color: #ffffff;
  }
}
:deep(
    .ant-form-item-has-error .ant-input-affix-wrapper:hover,
    .ant-form-item-has-error .ant-input-affix-wrapper:focus
  ) {
  background: #15141b;
}
:deep(
    .ant-form-item-has-error .ant-input,
    .ant-form-item-has-error .ant-input-affix-wrapper,
    .ant-form-item-has-error .ant-input:hover,
    .ant-form-item-has-error .ant-input-affix-wrapper:hover
  ) {
  background: #15141b;
}
</style>

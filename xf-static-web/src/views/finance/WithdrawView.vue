<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">
        {{ isAutoWithdrawal ? "快速提款" : "取款中心" }}
      </span>
      <el-button
        v-if="!isAutoWithdrawal"
        :loading="loadingBtn"
        :disable="loadingBtn"
        size="large"
        class="common-btn upgrade-btn"
        @click="handleUpgradeClick"
      >
        <img src="@/assets/images/finance/withdraw/rocket-icon.png" />
        <span>升级快速提款</span>
      </el-button>
    </div>

    <div class="steps-title-container">
      <span class="menu-title">提款流程</span>
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
        label-position="left"
        label-suffix=":"
        :model="withdrawInfo"
        :rules="withdrawRules"
      >
        <span class="menu-title">提款方式</span>
        <el-form-item class="withdraw-types">
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
            <img class="promo-img" :src="imgURL + method.icon" />
            <div class="type-name">{{ method.name }}</div>

            <div class="promo-label">
              <img v-if="method.privilegeIcon" :src="`${imgURL}${method.privilegeIcon}`" />
            </div>
          </div>
        </el-form-item>
        <div style="width: 343px;">
        <div class="common-title">提款金额</div>
        <el-form-item
          class="helptxt"
          :class="{ 'has-helper-text': isAutoWithdrawal }"
          prop="amount"
          name="amount"
        >
        <div style="width: 100%;">
                <el-input class="form-input" v-model="withdrawInfo.amount" placeholder="提款金额">
                  <template #append>{{ store.currency.label }}</template>
                </el-input>
                
                <span style="margin-top: 10px; display: flex; flex-direction: column; gap: 10px;" v-if="selectedWithdrawalMethod">
                  <div class="spaced">
                    <span>单笔限额：</span>
                    <span>{{
                    `${selectedWithdrawalMethod.withdrawMin} ${store.currency.label} - ${selectedWithdrawalMethod.withdrawMax} ${store.currency.label}`
                    }}</span>
                  </div>
                  <div class="spaced">
                    <span>今日提款：</span>
                    <span>{{
                    `${selectedWithdrawalMethod.withdrawMaxAmount} ${store.currency.label}, 剩余：${selectedWithdrawalMethod.withdrawMaxTimes} 次`
                    }}
                    </span>
                  </div>
                </span>
              </div>
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
        <!-- <el-form-item v-if="isAutoWithdrawal" class="helptxt">
          <div class="auto-withdraw-amount-wrapper">
            <span>可提余额：{{ selectedWithdrawalMethod.withdrawableBalance }}{{ store.currency.label }}</span>
            <span>剩余流水：{{ selectedWithdrawalMethod.remainWagers }}{{ store.currency.label }}</span>
          </div>
        </el-form-item> -->
        <el-row>
          <el-col>
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <!--            <div v-if="isALIPAY" class="selected-tip">-->
            <!--              “支付宝提款”可用时间：早 10 点 - 晚 12 点，其他时间提交系统会自动取消！-->
            <!--            </div>-->
          </el-col>
        </el-row>
        <el-form-item v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="helptxt" label="实时汇率">
          <span style="color: #9bffd1">
            1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
            {{ store.currency.label }}
          </span>
        </el-form-item>
        
        <div class="common-title">{{ `选择${cardLabel()}` }}</div>
        <el-form-item
          class="select"
          style="margin-top: 10px"
          prop="cardId"
          :rules="[
            {
              required: true,
              message: `请选择${cardLabel()}`,
              trigger: 'blur'
            }
          ]"
        >
          <el-select
            @click="withdrawState.bankCardList.length === 0 ? checkBankCards() : ''"
            v-model="withdrawInfo.cardId"
            :placeholder="`请选择${cardLabel()}`"
            style="width: 100%"
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
        <el-form-item v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="helptxt" label="预计到账">
          <div style="color: #9bffd1">
            {{
              selectedWithdrawalMethod && withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin
                ? "0.00"
                : (
                    withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                    selectedWithdrawalMethod.withdrawFee
                  ).toFixed(2)
            }}
            USDT
          </div>
        </el-form-item>
        <!-- K 豆教程视频 -->
        <div v-else-if="isEWALLET && selectedWithdrawalMethod.url">
          <div
            style="margin: 15px 0px; color: #FD574C;"
            v-if="['KDPAY', 'OKPAY', 'EBPAY', 'BLBPAY', 'JDPAY', 'SZPAY'].includes(selectedWithdrawalMethod.code)"
          >
            *特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！
          </div>
          <el-button class="common-btn grey" v-if="selectedWithdrawalMethod.code !== 'SZPAY'" @click="openEWalletTutorial">
            <span>{{ tutorialLabel }}</span>
          </el-button>
        </div>

        <div v-if="selectedWithdrawalMethod.withdrawFee" class="" style="color: #9bffd1">
          *提币手续费：{{ selectedWithdrawalMethod.withdrawFee }} USDT
        </div>


        <el-button
              :loading="loadingBtn"
              :disable="loadingBtn"
              size="large"
              class="common-btn withdraw-btn"
              @click="submitWithraw"
            >
              确定
            </el-button>
        <!-- <div
          v-if="isUSDT && selectedWithdrawalMethod.tips"
          class="selected-tip"
          v-html="selectedWithdrawalMethod.tips"
        ></div> -->

        <div class="flex-box flex-justify-center"></div>
        </div>
      </el-form>
    </div>

    <el-dialog
      width="500"
      v-model="isShowSubmitDialog"
      title="完成以下认证才可以取款"
      :close-on-click-modal="false"
      center
      class="dialog-wrapper"
    >
      <div class="submit-alert-message-wrapper">
        <div v-if="!store.realName">
          <div class="submit-alert-message-item">
            <div class="">
              <p style="color: #fff; margin-top: 0px">取款需要绑定真实姓名</p>
              <div style="font-size: 15px; color: #d1d1d1">为了您的资金安全，银行卡姓名需一致</div>
            </div>

            <button type="primary" class="common-btn" @click="handleBindRealName">去绑定</button>
          </div>
        </div>
        <div v-if="!store.phone">
          <div class="submit-alert-message-item">
            <div class="">
              <p style="color: #fff; margin-top: 0px">取款需要绑定手机号</p>
              <div style="font-size: 15px; color: #d1d1d1">为了您的资金安全，请绑定手机号</div>
            </div>
            <button type="primary" class="common-btn" @click="handleBindPhoneNumber">去绑定</button>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="common-btn" type="primary" style="width: 100%" @click="isShowSubmitDialog = false">
            暂不认证
          </button>
        </div>
      </template>
    </el-dialog>
    <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
    <el-dialog
      align-center
      width="530"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="isShowWithdrawErrorBlock"
    >
      您需要在交易记录-提款记录中点击 "确认到账" 完成上笔提款后, 才能提交新的提款订单。 感谢您的配合!
      <div class="withdraw-remaining-dialog__buttons">
        <el-button class="common-btn" @click="isShowWithdrawErrorBlock = false">返回</el-button>
        <router-link to="/center/transit-record?type=withdraw">
          <el-button class="common-btn">前往确认</el-button>
        </router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { loadBankCards, confirmWithdraw, withdrawEntrance, upgradeToAutoWithdrawal } from "@/api/personal/personal";
// import { message } from "ant-design-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store";
import { RiArrowRightSLine } from "vue-remix-icons";
import { useRouter } from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import WithdrawRemainingDialog from "@/components/finance/WithdrawRemainingDialog.vue";

export default defineComponent({
  name: "WithdrawView",
  components: {
    RiArrowRightSLine,
    WithdrawRemainingDialog
  },
  setup() {
    const router = useRouter();
    const loadingBtn = ref(false);
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + '/withdraw/';
    const formRef = ref();
    const activeItem = ref(0);
    const isUSDT = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const isShowSubmitDialog = ref(false);
    const isShowRemainingDialog = ref(false)
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
      checkBeforeSubmit();
      getWithdrawalMethods();
    });

    const checkBeforeSubmit = () => {
      if (!store.phone || !store.realName) {
        isShowSubmitDialog.value = true;
        return false;
      }

      return true;
    }

    const isShowWithdrawErrorBlock = ref(false);
    const submitWithraw = () => {
      if (!checkBeforeSubmit()) return

      loadingBtn.value = true;
      formRef.value
        .validate()
        .then(() => {
          confirmWithdraw(withdrawInfo).then((response) => {
            if(response.code === 1312) {
              isShowWithdrawErrorBlock.value = true;
              loadingBtn.value = false;
              return
            }
            if(response.code === 0) {
              store.getBalance();
              ElMessage({
                message: '成功',
                type: 'success',
              })
              getWithdrawalMethods();
              loadCards();
              loadingBtn.value = false;
            } else {
              loadingBtn.value = false;
              // message.error(response.message);
            }
          }).catch((error) => {
              console.log(error.message);
              loadingBtn.value = false;
            // message.error(error.message, 4)
          });
        }).catch((error) => {
          console.log("error", error);
          loadingBtn.value = false;
        });
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

    const tutorialLabel = computed(() => {
      switch(selectedWithdrawalMethod.value.code) {
        case "KDPAY":
          return "K 豆教程视频";
        case "EBPAY":
          return "EB 使用教程";
        case "OKPAY":
          return "OK 教程视频";
        case "BLBPAY":
          return "808 钱包教程视频";
        case "JDPAY":
          return "JDPAY 教程视频";
        default:
          return "";
      }
    })

    const checkBankCards = () => {

      if(isUSDT.value == true){
        ElMessageBox.alert(
          '请先绑定虚拟币钱包', "系统提示",
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
      } if(isEWALLET.value == true){
        ElMessageBox.alert(
          '请先绑定电子钱包', "系统提示",
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
      } else{
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

    }
    const loadCards = () => {
        withdrawState.bankCardList = []
        loadBankCards().then((response) => {
          if (response.code === 0) {
            response.data.forEach(element => {
              if (element.bankType === 'BANK') {
                  if (element.bankCode !== 'alipay' && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                    withdrawState.bankCardList.push(element)
                  }
                  if (element.bankCode === 'alipay' && selectedWithdrawalMethod.value.code === 'ALIPAY') {
                    withdrawState.bankCardList.push(element)
                  }
              } else {
                // console.log(selectedWithdrawalMethod.value.code)
                if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
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
      formRef.value.resetFields();
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method
      withdrawInfo.withdrawCode = method.code;
      activeItem.value = index;
      isUSDT.value = withdrawInfo.withdrawCode.includes('USDT')
      isEWALLET.value = withdrawInfo.withdrawCode.includes('KDPAY') || withdrawInfo.withdrawCode.includes('EBPAY') || withdrawInfo.withdrawCode.includes('OKPAY') || withdrawInfo.withdrawCode.includes('SZPAY') || withdrawInfo.withdrawCode.includes('JDPAY') || withdrawInfo.withdrawCode.includes('BLBPAY');
      isALIPAY.value = withdrawInfo.withdrawCode.includes('ALIPAY')
      loadCards()
    }
    const getWithdrawalMethods = () => {
      withdrawEntrance().then((response) => {
        if (response.code === 0) {
          if(isAutoWithdrawal.value) {
            isShowRemainingDialog.value = !response.data.withdrawStatus
          }
          const withdrawShowList = []
          response.data.withdrawShowList.forEach(element => {
            if (element.status) {
              withdrawShowList.push(element)
            }
          });
          withdrawalMethods.value = withdrawShowList;
          if (withdrawalMethods.value.length) {
            selectMethod(withdrawalMethods.value[0], 0)
          }
        } else {
          // message.error(response.message);
        }
      })
    }
    const cardLabel = () => {
      if (isUSDT.value) {
        return '钱包地址'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else if (isALIPAY.value) {
        return '支付宝'
      } else {
        return '银行卡'
      }
    }

    const handleBindRealName = () => {
      router.push("/center/personal");
    };

    const handleBindPhoneNumber = () => {
      router.push("/center/personal");
    };

    const openEWalletTutorial = () => {
      if(!selectedWithdrawalMethod.value.url) return
      window.open(selectedWithdrawalMethod.value.url);
    };

    const isAutoWithdrawal = computed(() => store.withdrawType === "AUTO_WITHDRAW")

    const handleUpgradeClick = () => {
      loadingBtn.value = true
      upgradeToAutoWithdrawal().then(async (res) => {
        if(res.code === 0) {
          ElMessage.success({
            type: "success",
            message: "成功升级为快速提款！"
          });
          await store.getMemberInfo()
        } else {
          ElMessage.error(res.message)
        }
      }).finally(() => loadingBtn.value = false)
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
      isEWALLET,
      isALIPAY,
      verifyWithdrawAmount,
      store,
      loadingBtn,
      checkBankCards,
      cardLabel,
      openEWalletTutorial,
      tutorialLabel,
      handleUpgradeClick,
      isAutoWithdrawal,
      isShowSubmitDialog,
      handleBindRealName,
      handleBindPhoneNumber,
      isShowRemainingDialog,
      isShowWithdrawErrorBlock
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
        color: #FD574C;
        margin-top: 10px;
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
        background-image: linear-gradient(90deg, #0ca9bc 0, #0a5e89 100%), linear-gradient(#45fdfb, #45fdfb);
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
      &:first-child::before
      {
        display: none;
      }
    }
    .withdraw-types {
      gap: 10px;
      display: flex;
      border-bottom: 1px solid #FFFFFF1A;
      padding: 20px 0;
    }
    .withdraw-type-item {
      // width: 120px;
      width: 120px;
      gap: 10px;
      padding: 20px 0;
      // padding: 20px 30px;
      // margin-right: 10px;
      // border-radius: 6px;
      // border: solid 1px #484460;
      border-radius: 15px;
        border: 1px solid #323233;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      margin-right: 15px;

      .promo-label {
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;

        img {
          width: 100%;
          height: auto;
        }
      }

      .promo-img {
        // width: 40px;
        // // padding: 6px 20px;
        // padding: 15px 10px;
        // margin-bottom: 5px;
        width: 28px;
      }
      &.active {
        &:after {
          content:"";
          background: url(@/assets/images/account/depotick.png)no-repeat bottom right;
          position: absolute;
          background-size: contain;
          right: 0px;
          bottom: 0px;
          width: 30px;
          height: 30px;
        }
        // border-bottom: 4px solid #1bcef1;
        // border: 1px solid #ffd800;
        // color: #ffd800;
        border-color: #32CEED;
        pointer-events: none;
        .type-name {
          
        font-weight: bold;
        color:#32CEED;
        }
        // .promo-img {
        //   border: 1px solid #45fdfb;
        // }
        .promo-label {
          border: none;
        }
      }
      .type-name {
        line-height: 15px;
        overflow-wrap: break-word;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
        color: #ffffff;
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
        font-size: 15px;
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
    // margin: 30px auto;
    width: 100%;
    background: linear-gradient(180deg, #32CEED 0%, #1C7587 100%);
    border-radius: 8px;
    margin-top: 30px;
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
  .el-form-item__content {
    gap: 15px;
  }
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

.selected-tip {
  margin-left: 150px;
  margin-bottom: 15px;
}

.upgrade-btn {
  padding: 8px 20px 34px !important;
  // height: 27px;
  align-self: center;
  img {
    height: 25px;
  }
  span {
    line-height: 25px;
  }
}
.auto-withdraw-amount-wrapper {
  display: flex;
  gap: 28px;
  justify-content: space-between;
  width: 244px;
  font-size: 15px;
  font-weight: 400;
  line-height: 13.58px;
  color: #00a478;
}
.has-helper-text {
  margin-bottom: 0;
}

.dialog-wrapper {
  overflow: hidden;
  border-radius: 8px !important;
}
.withdraw-remaining-dialog__buttons {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.spaced {
      display: flex;
      justify-content: space-between;
      color: #B8B8B8;
      margin: 0;

      .el-form-item__label {
        font-family: PingFang SC;
        font-size: 15px;
        font-weight: 400;
        color:#B8B8B8;
      }
      .el-form-item__content {
        font-family: PingFang SC;
        font-size: 15px;
        font-weight: 400;
        color:#B8B8B8;
        display: flex;
        justify-content: flex-end;

      }
      }
</style>

<template>
  <div class="card">
    <div class="menu-title-container">
      <span class="menu-title">{{ isAutoWithdrawal ? $t("withdraw.quickWithdraw") : $t("withdraw.withdraw") }}</span>
      <el-button
        v-if="!isAutoWithdrawal"
        :loading="loadingBtn"
        :disable="loadingBtn"
        size="large"
        class="common-btn upgrade-btn"
        @click="handleUpgradeClick"
      >
        <img src="@/assets/images/finance/withdraw/rocket-icon.png" />
        <span>{{ $t("withdraw.upgradeWithdraw") }}</span>
      </el-button>
    </div>

    <!-- <div class="menu-title-container">
      <div class="account-content withdrawal">
        <div class="flex-box">
          <span class="">提款流程：</span>
          <div class="step-item active">申请中</div>
          <RiArrowRightSLine />
          <div class="step-item">审核中</div>
          <RiArrowRightSLine />
          <div class="step-item">支付中</div>
          <RiArrowRightSLine />
          <div class="step-item">出款成功</div>
        </div>
        <div class="withdraw-tip">* 若提款失败请查看站内信提示的失败原因！</div>
      </div>
    </div> -->
    <el-radio-group style="margin-bottom: 20px" v-model="activeItem" size="small">
      <el-radio-button
        @change="selectMethod(method, method.name)"
        v-for="method in withdrawalMethods"
        :key="method.name"
        :value="method.name"
      >
        {{ method.name }}
      </el-radio-button>
    </el-radio-group>
    <el-card
      :class="{ selected: withdrawInfo.cardId === b.id }"
      v-if="withdrawState.bankCardList.length > 0"
      v-for="(b, i) in withdrawState.bankCardList"
      :key="i"
      @click="withdrawInfo.cardId = b.id"
      class="bank-card"
    >
      <div class="bank-card-contents">
        <div class="bankName">{{ b.bankName }}</div>
        <div class="name">{{ b.cardAccount }}</div>
        <div class="cardNumber">{{ b.cardNumber }}</div>
      </div>
      <!-- <img class="bank-card-img" src="../../assets/images/account/bank_icon.png"> -->
      <img class="bank-card-img" :src="imgURL + selectedWithdrawalMethod.icon" />
    </el-card>
    <el-card v-else>
      {{ $t("account.no_card_avail") }}
      <router-link to="/center/personal?name=Bank">{{ $t("account.add_a_bank_card") }}</router-link>
      .
    </el-card>
    <div class="withdraw-form">
      <el-form
        ref="formRef"
        label-width="200px"
        label-position="top"
        label-suffix=":"
        :model="withdrawInfo"
        :rules="withdrawRules"
      >
        <!-- <el-form-item label="提款方式">
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
        </el-form-item> -->

        <el-form-item class="helptxt" :class="{ 'has-helper-text': isAutoWithdrawal }" prop="amount" :label="$t('withdraw.amount')" name="amount">
          <el-space>
          <el-row :gutter="10" style="align-items: center; width: 54%">
            <el-col :span="24">
              <el-input class="form-input" v-model="withdrawInfo.amount" :placeholder="$t('withdraw.amount')">
                <template #append>{{ store.currency.label }}</template>
              </el-input>
            </el-col>
            <el-col :span="24">
              <span v-if="selectedWithdrawalMethod && selectedWithdrawalMethod.withdrawMin">
                {{
                  `${$t("withdraw.singleLimit")}: ${selectedWithdrawalMethod.withdrawMin.toLocaleString()} ${
                    store.currency.label
                  } - ${selectedWithdrawalMethod.withdrawMax.toLocaleString()} ${store.currency.label}`
                }}
                <br />
                {{
                  `${$t("withdraw.withdrawalToday")}: ${selectedWithdrawalMethod.withdrawMaxAmount.toLocaleString()} ${
                    store.currency.label
                  }, ${$t("withdraw.remaining")}: ${selectedWithdrawalMethod.withdrawMaxTimes} ${$t("withdraw.times")}`
                }}
              </span>
            </el-col>
          </el-row>
          
          <el-button style="margin-top: -30px;" :loading="loadingBtn" size="large" class="common-btn withdraw-btn" @click="submitWithdraw">
            {{ $t("common.confirm") }}
          </el-button>
        </el-space>
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
        <div class="values">
          <span @click="withdrawInfo.amount = amt.toString()" class="amt" v-for="amt in amounts">
            {{ amt.toLocaleString() }}
          </span>
        </div>
        <el-row>
          <el-col>
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <div v-if="isALIPAY" class="selected-tip">
              “支付宝提款” 可用时间：早10点-晚12点，其他时间提交系统会自动取消！
            </div>
          </el-col>
        </el-row>
        <el-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          :label="$t('deposit.realTimeExchangeRate')"
        >
          <span style="color: #17cd27; margin-top: -5px;">
            1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }} {{ store.currency.label }}
          </span>
        </el-form-item>
        <!-- <el-form-item
          class="select"
          prop="cardId"
          :label="`选择${cardLabel()}`"
          :rules="[
            {
              required: true,
              message: `请选择${cardLabel()}`,
              trigger: 'blur'
            }
          ]"
        >
          <template v-if="isLoaded">
            <el-select
              @click="withdrawState.bankCardList.length === 0 ? checkBankCards() : ''"
              v-model="withdrawInfo.cardId"
              :placeholder="`选择${cardLabel()}`"
              style="width: 300px"
            >
              <el-option
                v-for="b in withdrawState.bankCardList"
                :key="b.id"
                :value="b.id"
                :label="b.bankName + ' - ' + '****' + b.cardNumber.slice(-4)"
              >
                {{ b.bankName }} - {{ "****" + b.cardNumber.slice(-4) }}
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <span>加载中...</span>
          </template>

        </el-form-item> -->
        <el-form-item :label="$t('withdraw.withdrawPwd')">
          <el-row :gutter="10" style="align-items: center; width: 54%">
            <el-col :span="24">
              <el-input
                type="password"
                show-password
                v-model="withdrawInfo.withdrawPassword"
                :placeholder="$t('withdraw.withdrawPwd')"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="isUSDT && selectedWithdrawalMethod.exchangeRate"
          class="helptxt"
          :label="$t('withdraw.expectedAmount')"
        >
          <span style="color: #17cd27; margin-top: -5px;">
            {{
              selectedWithdrawalMethod &&
              (withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin ||
                (
                  withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                  selectedWithdrawalMethod.withdrawFee
                ).toFixed(2) < 0)
                ? "0.00"
                : (
                    withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                    selectedWithdrawalMethod.withdrawFee
                  ).toFixed(2)
            }}
            {{ $t("withdraw.usdt") }}
          </span>
        </el-form-item>

        <!-- K豆教程视频 -->
        <div style="margin-left: 150px" v-else-if="isEWALLET">
          <span class="tip-text">*特别说明：提款钱包和游戏账号的姓名务必一致</span>
          <el-button class="common-btn" @click="openEWalletTutorial(selectedWithdrawalMethod.code)">
            <span v-if="selectedWithdrawalMethod.code === 'KDPAY'">K豆教程视频</span>
            <span v-else-if="selectedWithdrawalMethod.code === 'EBPAY'">EB教程视频</span>
            <span v-else-if="selectedWithdrawalMethod.code === 'OKPAY'">OK教程视频</span>
          </el-button>
        </div>

        <div v-if="selectedWithdrawalMethod.withdrawFee" class="" style="color: #17cd27">
          {{ $t("withdraw.exchangeRateExample", { fee: selectedWithdrawalMethod.withdrawFee }) }}
        </div>

        <!-- <div
          v-if="isUSDT && selectedWithdrawalMethod.tips"
          class="selected-tip"
          v-html="selectedWithdrawalMethod.tips"
        ></div> -->

        <div class="flex-box flex-justify-center">
        </div>
      </el-form>
    </div>
    <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { loadBankCards, confirmWithdraw, withdrawEntrance, upgradeToAutoWithdrawal  } from "@/api/personal/personal";
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useLocalStorage } from "@vueuse/core";
import WithdrawRemainingDialog from "@/components/finance/WithdrawRemainingDialog.vue";

export default defineComponent({
  name: "WithdrawView",
  components: {
    WithdrawRemainingDialog
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const loadingBtn = ref(false);
    const store = userStore();
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/withdraw/";
    const formRef = ref();
    const activeItem = ref(0);
    const isUSDT = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const isLoaded = ref(false);
    const isShowRemainingDialog = ref(false)
    const withdrawState = reactive({
      bankCardList: []
    });
    const withdrawInfo = reactive({
      cardId: undefined,
      amount: ""
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
    ]);
    const amounts = reactive([50, 100, 200, 500, 1000, 5000, 10000, 20000, 50000, 100000]);
    onMounted(() => {
      getWithdrawalMethods();
    });
    const submitWithdraw = () => {
      loadingBtn.value = true;
      if (withdrawInfo.cardId === null) {
        loadingBtn.value = false;
        ElMessage({
          message: t("placeholder.selectBankCard"),
          type: "warning"
        });
        return;
      }
      formRef.value
        .validate()
        .then(() => {
          confirmWithdraw(withdrawInfo)
            .then((response) => {
              if (response.code === 0) {
                store.getBalance();
                ElMessage({
                  message: t("common.success"),
                  type: "success"
                });

                // FB tracking :: apply-withdrawal
                if (store.isAffiliateA) {
                  fbq("track", "apply-withdrawal");
                }

                getWithdrawalMethods();
                loadCards();
              } else {
                if (response.code === 12100) {
                  response.message = t("common.withdrawDoesNotMatch");
                }
                ElMessage.error({
                  type: "error",
                  message: response.message
                });
                // message.error(response.message);
              }
            })
            .catch((error) => {
              console.log(error.message);
              // message.error(error.message, 4)
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
      loadingBtn.value = false;
    };
    const withdrawRules = {
      amount: [
        {
          required: true,
          message: t("placeholder.amount"),
          trigger: "blur"
        },
        {
          pattern: "^([1-9][0-9]*)$",
          message: t("placeholder.wholeNumber"),
          trigger: "change"
        },
        {
          validator: verifyWithdrawAmount,
          trigger: "change"
        }
      ]
    };
    const checkBankCards = () => {
      if (isUSDT.value) {
        ElMessageBox.alert(t("bankError.bindUSDT"), t("common.systemError"), {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: t("common.confirm"),
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        })
          .then(() => {
            router.push("/center/personal");
          })
          .catch(() => {});
      } else if (isEWALLET.value) {
        ElMessageBox.alert(t("bankError.bindEWallet"), t("common.systemError"), {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: t("common.confirm"),
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        })
          .then(() => {
            router.push("/center/personal");
          })
          .catch(() => {});
      } else {
        ElMessageBox.alert(t("bankError.bankCardFirst"), t("common.systemError"), {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: t("common.confirm"),
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        })
          .then(() => {
            router.push("/center/personal");
          })
          .catch(() => {});
      }
    };
    const loadCards = () => {
      isLoaded.value = false;
      loadBankCards()
        .then((response) => {
          isLoaded.value = true;
          withdrawState.bankCardList = [];
          if (response.code === 0) {
            response.data.forEach((element) => {
              if (element.bankType === "BANK") {
                if (element.bankCode !== "alipay" && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
                  withdrawState.bankCardList.push(element);
                }
                if (element.bankCode === "alipay" && selectedWithdrawalMethod.value.code === "ALIPAY") {
                  withdrawState.bankCardList.push(element);
                }
              } else {
                // console.log(selectedWithdrawalMethod.value.code)
                if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
                  withdrawState.bankCardList.push(element);
                }
              }
            });
          } else {
            ElMessage.error({
              type: "error",
              message: response.message
            });
          }
        })
        .catch((error) => {
          console.log(error.message);
          isLoaded.value = true;
        });
    };

    async function verifyWithdrawAmount(r, v) {
      if (v !== null && v.trim() !== "" && v.match(/^([1-9][0-9]*)$/) !== null) {
        if (v < selectedWithdrawalMethod.value.withdrawMin || v > selectedWithdrawalMethod.value.withdrawMax) {
          return Promise.reject(
            t("withdraw.depositAmountRange") +
              " " +
              selectedWithdrawalMethod.value.withdrawMin.toLocaleString() +
              " - " +
              selectedWithdrawalMethod.value.withdrawMax.toLocaleString()
          );
        } else {
          return Promise.resolve();
        }
      }
    }

    const selectedWithdrawalMethod = ref({});
    const selectMethod = (method, index) => {
      formRef.value.resetFields();
      withdrawInfo.withdrawCode = null;
      withdrawInfo.cardId = null;
      selectedWithdrawalMethod.value = method;
      withdrawInfo.withdrawCode = method.code;
      activeItem.value = index;
      isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
      isEWALLET.value =
        withdrawInfo.withdrawCode.includes("KDPAY") ||
        withdrawInfo.withdrawCode.includes("EBPAY") ||
        withdrawInfo.withdrawCode.includes("OKPAY");
      isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
      loadCards();
    };
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
            selectMethod(withdrawalMethods.value[0], withdrawalMethods.value[0].name);
          }
        } else {
          ElMessage.error({
            type: "error",
            message: response.message
          });
          // message.error(response.message);
        }
      });
    };
    const cardLabel = () => {
      if (isUSDT.value) {
        return "钱包地址";
      } else if (isEWALLET.value) {
        return "电子钱包";
      } else {
        return "银行卡";
      }
    };
    const openEWalletTutorial = (code) => {
      const urlMap = {
        KDPAY: "http://jiaocheng.kdpay123.com",
        EBPAY: "https://www.ebpay009.com/syjc",
        OKPAY: "https://me-qr.com/l/okpay"
      };

      const url = urlMap[code];
      if (url) {
        window.open(url);
      }
    };
    const isAutoWithdrawal = computed(() => store.withdrawType === 'AUTO_WITHDRAW')

    const handleUpgradeClick = () => {
      loadingBtn.value = true
      upgradeToAutoWithdrawal().then(async (res) => {
        if(res.code === 0) {
          ElMessage.success(t("withdraw.successUpgradeQuick"));

          await store.getMemberInfo()
        } else {
          ElMessage.error(res.message);
        }
      }).finally(() => loadingBtn.value = false)
    }
    return {
      formRef,
      withdrawInfo,
      submitWithdraw,
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
      isLoaded,
      amounts,
      handleUpgradeClick,
      isAutoWithdrawal,
      isShowRemainingDialog
    };
  }
});
</script>

<style scoped lang="scss">
.values {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  text-align: center;
  margin-bottom: 15px;
  margin-top: 25px;
  grid-gap: 10px;
  width: 360px;
  .amt {
    padding: 15px 20px;
    color: #a4aabb;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    border-radius: 10px;
    background: #f7f8fb;
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
      background: #ffffff;
      border: 2px solid #468cff;
      box-shadow: 0px 0px 4px 0px #00358b4d;
    }
  }
}
.bank-card {
  width: 33%;
  background: linear-gradient(98.09deg, #f0f7ff -1.13%, #e7f3ff 97.1%);
  border: 2px solid transparent;
  cursor: pointer;
  margin-bottom: 15px;

  .bank-card-img {
    width: 40px;
  }
  &.selected {
    border: 2px solid #468cff;
  }
  :deep(.el-card__body) {
    // font-family: Poppins;
    text-align: left;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    .bank-card-contents {
      display: flex;
      gap: 10px;
      flex-direction: column;
      .bankName {
        color: #468cff;
        font-size: 14px;
        font-weight: 600;
        line-height: 21px;
        margin-bottom: 10px;
      }
      .name {
        color: #a4aabb;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
      }
      .cardNumber {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 19.6px;
        text-align: left;
        word-break: break-word;
      }
    }
  }
}
.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px 40px;
  color: #424f72;
  height: 100%;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
}

.account-container {
  .account-content-wrapper {
    .withdrawalmethod {
      overflow: auto;
    }

    .withdrawal {
      margin: 10px 0;

      .flex-box {
        display: flex;
        justify-content: flex-start;
        gap: 10px;
        align-items: center;

        svg {
          width: 20px;
          fill: #6c757d;
        }
      }

      .withdraw-tip {
        color: #ff7f10;
        margin-top: 15px;
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
      background-image: linear-gradient(267deg, #78abfa 0, #4877ec 100%), linear-gradient(#5b80e7, #5b80e7);
      text-align: center;
      position: relative;
      // border: 2px solid #74aef8;
      border-left: 0;
      // padding-left: 20px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      // &::before,
      // &::after {
      //   content: "";
      //   position: absolute;
      //   border-top: 23px solid transparent;
      //   border-bottom: 23px solid transparent;
      //   top: 0px;
      // }
      // &::before {
      //   left: 0;
      //   top: -2px;
      //   border-left: 25px solid #74aef8;
      //   border-top: 25px solid transparent;
      //   border-bottom: 25px solid transparent;
      // }
      // &::after {
      //   border-left: 23px solid #74aef8;
      //   right: -23px;
      //   z-index: 1;
      // }
      &.active {
        color: #ffffff;
        // background: #ffffff;
        // background-image: linear-gradient(90deg,#0ca9bc 0,#0a5e89 100%),linear-gradient(#45fdfb,#45fdfb);

        background-image: linear-gradient(267deg, #78abfa 0, #4877ec 100%), linear-gradient(#5b80e7, #5b80e7);
        border: 0;
        padding-left: 0px;

        &::after {
          border-left: 25px solid #74aef8;
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
      display: flex;
      cursor: pointer;
      justify-content: center;
      min-width: 6rem;
      background-color: #f7f8fb;
      border-radius: 15px;
      box-shadow: inset 0 0 8px 0 #a9c9ea;
      margin-bottom: 30px;
      border: 2px solid transparent;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 10px;

      img {
        //     width: 40px;
        // padding: 8px 20px;
        // background: #ffffff;
        // border: 1px solid #ced4da;
        max-width: 2.3rem;
        width: 100%;
        height: auto;
        margin-bottom: 0;
        border: 0;
        padding: 0;
      }

      &.active {
        border: 2px solid #468cff;
        box-shadow: unset;
        // border-bottom: 4px solid #1bcef1;
        // border: 1px solid #ffd800;
        // color: #ffd800;
        img {
          // border: 1px solid #4978ec;
          // background: #bad2ff;
          // border-color: #4873f1;
        }

        &:before {
          display: block;
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          height: 28px;
          width: 28px;
          z-index: 3;
          background-image: url("../../assets/svg/checkmark.svg");
          background-size: 100%;
          background-position: center center;
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
    margin-left: 65px;
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
.helptxt .el-form-item__label {
  margin-bottom: 0;
}
.withdraw-form {
  padding: 20px 0;
  position: relative;
  :deep(.el-form-item) {
    flex-direction: column;
    &.helptxt {
      margin: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      max-width: 630px;
    }
  }
  :deep(.el-form-item__content) {
    gap: 15px;
    
    max-width: 680px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background-color: #f7f8fb;
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
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
          border-left: 13px solid #74aef8;
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
  margin-bottom: 30px;
  color: #ff7f10;
}

.upgrade-btn {
  margin-left: 30px;
  padding: 1px 7px;
  height: 35px;
  width: auto;
  border-radius: 8px;
  align-self: center;
    font-family: "SF Pro";
    letter-spacing: normal;
    width: unset;
    min-width: unset;
    padding-right: 10px;
  img {
    height: 20px;
  }
  span {
    line-height: 20px;
    text-transform: none;
  }
}
.tip-text {
  margin-bottom: 10px;
  display: block;
  width: 100%;
  color: #ff7f10;
}

.menu-title-container {
  .additional-title {
    padding-left: 16px;
  }
}
</style>

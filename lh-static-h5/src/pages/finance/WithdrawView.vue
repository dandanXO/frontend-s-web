<template>
  <q-page :style="isShowRemainingDialog ? 'filter: blur(5px);': 'filter: none'">
    <div class="withdraw-section q-pa-md q-mx-sm q-my-md">
      <div class="title-wrapper q-pa-md" style="padding-bottom: 0px">
        <span>{{ isAutoWithdrawal ? "快速提款" : "提款" }}</span>
        <q-btn v-if="!isAutoWithdrawal" class="upgrade-btn" color="brightbtn" @click="handleUpgradeClick">
          <img src="../../assets/images/finance/withdraw/rocket-icon.png" />
          <span>升级快速提款</span>
        </q-btn>
      </div>

      <DepositWithdrawTransferTabs
        v-if="$q.dark.isActive"
        activeTab="withdraw"
        redirect="finance/withdraw"
        style="padding: 5px 0px 5px 0px"
      />
      <div class="account-content last">
        <div class="payment-method-section">
          <div class="section-title" v-if="$q.dark.isActive">
            <div class="section-title-decor" />
            <div class="section-title-text">提款方式</div>
          </div>
          <div class="withdrawalmethod">
            <div
              v-for="(method, i) in withdrawalMethods"
              :key="i"
              class="withdraw-type-item"
              @click="selectMethod(method, i)"
              :class="{ active: i === activeItem }"
            >
              <span class="promo" v-if="method.recommended">Recommended</span>
              <div class="withdraw-img">
                <img :src="imgURL + '/withdraw/' + method.icon" />
              </div>
              <div class="type-name">{{ method.name }}</div>

              <div class="promo-label">
                <img class="promo-img" v-if="method.privilegeIcon" :src="`${imgWithdrawURL}${method.privilegeIcon}`" />
              </div>
            </div>
          </div>
        </div>
        <q-form ref="withdrawFormRef" class="withdraw-form">
          <q-select
            v-show="isLoaded"
            hide-bottom-space
            filled
            ref="cardRef"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="'选择' + chooseLabel()"
            class="withdraw-selection q-mt-sm q-mb-sm"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || '请选择' + chooseLabel()]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ "没有可用的" + chooseCard() }}
                  <router-link class="text-bright" to="/account/withdraw">
                    {{ isUSDT || isEWALLET ? "加" + chooseCard() : "绑定" + chooseCard() }}
                  </router-link>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar v-if="scope.opt.bankIcon">
                  <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.bankName }} - ****{{
                      scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item-section avatar v-if="scope.opt.bankIcon">
                <img
                  style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                  :src="imgURL + '/payment/' + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.bankName }} - ****{{
                    scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                  }}
                </q-item-label>
              </q-item-section>
            </template>
          </q-select>

          <!-- {
          pattern: '^([1-9][0-9]*)$',
          message: "金额应为正数",
          trigger: "change",
        }, -->

          <q-input
            hide-bottom-space
            ref="amountRef"
            v-model="withdrawInfo.amount"
            label="金额"
            class="withdraw-field"
            :rules="[
              (val) => (val && val.length > 0) || '请输入提款金额',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || '请输入正确的提款金额',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || '请输入正确的提款金额',
              (val) => (val && /^\d+$/.test(val)) || '提款金额不能有小数',
              isValidUSDTAmt
            ]"
            clearable
          >
            <template v-slot:prepend>
              <span style="font-size: 26px" class="text-bright">
                {{ store.currency.value }}
              </span>
            </template>
            <template v-slot:append>
              <span style="font-size: 26px" class="text-bright">
                <q-btn
                  v-if="$q.dark.isActive"
                  @click="updateWithdrawAmt"
                  label="全额提款"
                  class="update-withdraw-amt-btn"
                />
                <q-btn v-else @click="updateWithdrawAmt" label="全额提款" color="brightbtn" />
              </span>
            </template>
          </q-input>
          <template v-if="$q.dark.isActive">
            <div
              class="q-mt-sm q-mb-sm q-pb-sm"
              style="border-bottom: 1px solid #434343; color: #98a7b5"
              v-show="selectedWithdrawalMethod"
            >
              <div v-if="isAutoWithdrawal && selectedWithdrawalMethod.currencyId" class="upgraded-helper-text">
                <span>可提余额：{{ selectedWithdrawalMethod.withdrawableBalance }}{{ store.currency.label }}</span>
                <span>剩余流水：{{ selectedWithdrawalMethod.remainWagers }}{{ store.currency.label }}</span>
              </div>
              <div
                style="display: flex; justify-content: space-between; align-items: center; color: #98a7b5; gap: 10px"
                v-if="
                  (selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin) ||
                  selectedWithdrawalMethod.withdrawMaxAmount
                "
              >
                <div v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
                  <span>{{ "单笔提款: " }}</span>
                  <span style="color: #fff">
                    {{ selectedWithdrawalMethod.withdrawMin }}
                  </span>
                  <span>
                    {{ " RMB - " }}
                  </span>
                  <span style="color: #fff">
                    {{ selectedWithdrawalMethod.withdrawMax }}
                  </span>
                  <span>
                    {{ " RMB" }}
                  </span>
                </div>
                <div v-if="selectedWithdrawalMethod.withdrawMaxAmount">
                  <span>{{ "今日提款: " }}</span>
                  <span style="color: #fff">
                    {{ selectedWithdrawalMethod.withdrawMaxAmount }}
                  </span>
                  <span>
                    {{ " RMB" }}
                  </span>
                </div>
              </div>
              <div
                style="display: flex; justify-content: space-between; align-items: center; color: #98a7b5"
                v-if="selectedWithdrawalMethod.withdrawMaxTimes"
              >
                <div v-if="selectedWithdrawalMethod.withdrawMaxTimes">
                  <span>{{ `今日提款剩余: ` }}</span>
                  <span style="color: #fff">{{ selectedWithdrawalMethod.withdrawMaxTimes }}</span>
                  <span>{{ ` 次` }}</span>
                </div>
                <div
                  class="q-mt-sm q-mb-sm text-center"
                  v-if="selectedWithdrawalMethod.code !== 'SZPAY' && tutorialLabel()"
                >
                  <span style="text-decoration: underline; color: #fff" @click="openEWalletTutorial">
                    {{ `*${tutorialLabel()}` }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="q-mt-sm q-mb-sm text-grey text-bold q-pb-sm"
              style="border-bottom: 1px solid #434343"
              v-show="selectedWithdrawalMethod"
            >
              <template v-if="selectedWithdrawalMethod.withdrawMin && selectedWithdrawalMethod.withdrawMin">
                {{
                  "单笔提款: " +
                  selectedWithdrawalMethod.withdrawMin +
                  "RMB - " +
                  selectedWithdrawalMethod.withdrawMax +
                  "RMB"
                }}
                <br />
              </template>
              <template v-if="selectedWithdrawalMethod.withdrawMaxAmount">
                {{ "今日提款: " + selectedWithdrawalMethod.withdrawMaxAmount + "RMB" }}
              </template>
              <template v-if="selectedWithdrawalMethod.withdrawMaxTimes">
                {{ " 剩余: " + selectedWithdrawalMethod.withdrawMaxTimes + " 次" }}
              </template>
            </div>
          </template>
          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate">
            <div class="q-my-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">实时汇率：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }}
                {{ store.currency.value }}
              </span>
            </div>
            <div class="q-mt-sm" style="display: flex; justify-content: center; align-items: center">
              <span style="flex: 1">预计到帐：</span>
              <span style="flex: 3" class="bg-neontb text-neontb q-pa-sm">
                {{
                  selectedWithdrawalMethod && withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin
                    ? "0.00"
                    : (
                        withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate -
                        selectedWithdrawalMethod.withdrawFee
                      ).toFixed(2)
                }}
                USDT
              </span>
            </div>
          </div>
          <!--          <div v-else-if="!isEWALLET && !isUSDT">-->
          <!--            <div class="q-mt-md text-neontb">*24小时内请勿提交相同提款金额，避免确认到账错误，需个人承担亏损！</div>-->
          <!--          </div>-->
          <div v-else-if="isEWALLET && selectedWithdrawalMethod.url">
            <div class="q-mt-sm text-neontb">*特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！</div>
            <div
              class="q-mt-sm q-mb-sm text-center"
              v-if="selectedWithdrawalMethod.code !== 'SZPAY'  && !$q.dark.isActive"
            >
              <q-btn
                style="border: 1px solid #33bcd4; color: #33bcd4"
                @click="openEWalletTutorial"
                :label="tutorialLabel()"
              />
            </div>
          </div>
          <div class="q-mt-sm text-neontb" v-if="selectedWithdrawalMethod.withdrawFee">
            *提币手续费：{{ selectedWithdrawalMethod.withdrawFee }} USDT
          </div>
          <!-- <a-form-item
            class="select"
            name="cardId"
            label="Select Bank Card"
            :rules="[{ required: true, message: 'Please select a bank card' }]"
          >
            <a-select
              v-model:value="withdrawInfo.cardId"
              placeholder="Please select a bank card"
            >
              <a-select-option
                v-for="b in withdrawState.bankCardList"
                :key="b.id"
                :value="b.id"
              >
                {{ b.bankName }} - {{ b.cardNumber }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
          <div class="flex-box flex-justify-center">
            <q-btn
              class="q-mt-md quick-withdraw-btn"
              :class="`${$q.dark.isActive ? '' : 'common-large-btn'}`"
              @click="submitWithdraw"
              :loading="withdrawLoading"
              :disable="withdrawLoading"
              label="立即提款"
            />
          </div>
          <div class="q-py-md">
            <div
              v-if="!isEWALLET && !isUSDT && !isALIPAY && selectedWithdrawalMethod.tips"
              class="selected-tip"
              v-html="selectedWithdrawalMethod.tips"
            ></div>
            <!--            <div v-if="isALIPAY" class="selected-tip">-->
            <!--              “支付宝提款” 可用时间：早10点-晚12点，其他时间提交系统会自动取消！-->
            <!--            </div>-->
          </div>
        </q-form>
      </div>
    </div>

    <!--    <q-dialog v-model="hasWithdrawCard" persistent>-->
    <!--      <q-card style="width: 100%; padding: 10px">-->
    <!--        <q-card-section class="q-mb-md">-->
    <!--          <div class="text-h6 text-center">请先绑定银行卡</div>-->
    <!--        </q-card-section>-->

    <!--        <div class="flex flex-center">-->
    <!--          <router-link to="/account">-->
    <!--            <q-btn class="q-mr-md" label="取消" />-->
    <!--          </router-link>-->
    <!--          <router-link to="/account/withdraw">-->
    <!--            <q-btn color="brightbtn" label="绑定" />-->
    <!--          </router-link>-->
    <!--        </div>-->
    <!--      </q-card>-->
    <!--    </q-dialog>-->
  </q-page>

  <q-dialog v-model="isShowWithdrawErrorBlock" persistent no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; max-width: 290px; padding: 15px; flex-direction: column" class="text-black">
      <q-card-section class="q-mb-md">
        <!-- <div class="text-h6 text-center">请先完成上比提款</div> -->
        您需要在交易记录-提款记录中点击 "确认到账" 完成上笔提款后, 才能提交新的提款订单。 感谢您的配合!
      </q-card-section>

      <div class="flex flex-center">
        <div>
          <q-btn style="width: 100px" @click="isShowWithdrawErrorBlock = false" class="q-mr-md" label="取消" />
        </div>
        <router-link to="/account/records/withdraw">
          <q-btn style="width: 100px" color="brightbtn" label="前往确认" />
        </router-link>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog class="modal-common-div" width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
    <q-card style="width: 100%; padding: 1rem 0.5rem" class="">
      <q-card-section class="contents">
        <strong class="black-titles">温馨提示</strong>
        <br />
        <br />
        为保证资金安全，存款前需先验证手机号
      </q-card-section>
      <q-card-actions align="right">
        <router-link to="/account/personal">
          <q-btn class="common-md-btn" label="前往验证" color="brightbtn" />
        </router-link>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <WithdrawRemainingDialog v-if="isShowRemainingDialog" v-model="isShowRemainingDialog" />
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
// import AcctBal from "../../components/AcctBal.vue";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "src/hooks/notify";
import DepositWithdrawTransferTabs from "components/finance/DepositWithdrawTransferTabs.vue";
import WithdrawRemainingDialog from "src/components/WithdrawRemainingDialog.vue";

const notify = useNotify();
const store = userStore();
const isNewUser = ref(false);
const $q = useQuasar();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
const imgWithdrawURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/withdraw/";

const amountRef = ref();
const cardRef = ref();
const activeItem = ref(0);
const withdrawFormRef = ref(null);
const withdrawState = reactive({
  bankCardList: []
});
const qs = require("qs");
const withdrawInfo = reactive({
  cardId: undefined,
  amount: ""
});
const isLoaded = ref(false);
const isShowRemainingDialog = ref(false);

// const hasWithdrawCard = computed(() => {
//   return false && withdrawState.bankCardList.length === 0;
// });
const withdrawalMethods = ref([]);
const selectedWithdrawalMethod = ref([]);

const checkNewUser = () => {
  if (store.phone == "") {
    isNewUser.value = true;
  } else {
    getWithdrawalMethods();
  }
};

onMounted(() => {
  checkNewUser();
  store.getBalance();
});
const platforms = reactive([]);
const refreshBalance = (plat) => {
  if (plat === "all") {
    platforms.forEach((platform) => {
      platform.isLoading = true;
      if (platform.code) {
        api
          .get("/session/balance", { params: { platform: platform.code } })
          .then((res) => {
            if (platform) {
              platform.amount = res.data;
              platform.isLoading = false;
            }
          })
          .catch((e) => {
            platform.isLoading = false;
          });
      }
    });
  }
};

const withdrawLoading = ref(false);
const isShowWithdrawErrorBlock = ref(false);

const submitWithdraw = () => {
  cardRef.value.validate();
  amountRef.value.validate();
  $q.loading.show({
    message: "确认中。。。"
  });
  withdrawLoading.value = true;
  if (cardRef.value.hasError || amountRef.value.hasError) {
    $q.loading.hide();
    withdrawLoading.value = false;
  } else {
    api
      .post("/session/withdraw/", qs.stringify(withdrawInfo))
      .then((response) => {
        if (response.code === 1312) {
          isShowWithdrawErrorBlock.value = true;
          withdrawLoading.value = false;
          return;
        }
        if (response.code === 0) {
          notify({
            type: "success",
            message: "提交成功"
          });
          getWithdrawalMethods();

          withdrawInfo.amount = "";
          if (amountRef.value) {
            setTimeout(() => {
              amountRef.value.resetValidation();
            }, 0);
          }

          withdrawLoading.value = false;
        } else {
          notify({
            type: "error",
            message: response.message
          });

          withdrawLoading.value = false;
        }
      })
      .catch((error) => {
        console.log("error", error);
        withdrawLoading.value = false;
        // notify({
        //   type: "error",
        //          //   message: response.message,
        //          // });
      });
    $q.loading.hide();
  }
};
const isUSDT = ref(false);
const isEWALLET = ref(false);
const isALIPAY = ref(false);
const selectMethod = (method, index) => {
  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  selectedWithdrawalMethod.value = method;
  withdrawInfo.withdrawCode = method.code;
  isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
  isEWALLET.value =
    withdrawInfo.withdrawCode.includes("KDPAY") ||
    withdrawInfo.withdrawCode.includes("EBPAY") ||
    withdrawInfo.withdrawCode.includes("OKPAY") ||
    withdrawInfo.withdrawCode.includes("SZPAY") ||
    withdrawInfo.withdrawCode.includes("NINEPAY") ||
    withdrawInfo.withdrawCode.includes("JDPAY") ||
    withdrawInfo.withdrawCode.includes("BLBPAY");
  isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
  activeItem.value = index;
  loadCards();
};

const loadCards = () => {
  withdrawState.bankCardList = [];
  api
    .get("/session/bankCard")
    .then((response) => {
      isLoaded.value = true;
      if (response.code === 0) {
        // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
        response.data.forEach((element) => {
          if (element.bankType === "BANK") {
            if (element.bankCode !== "alipay" && element.bankType.includes(selectedWithdrawalMethod.value.code)) {
              withdrawState.bankCardList.push(element);
            }
            if (element.bankCode === "alipay" && selectedWithdrawalMethod.value.code === "ALIPAY") {
              withdrawState.bankCardList.push(element);
            }
          } else {
            if (element.bankCode && element.bankCode.includes(selectedWithdrawalMethod.value.code)) {
              withdrawState.bankCardList.push(element);
            }
          }
        });

        if (cardRef.value) {
          cardRef.value.resetValidation();
        }
        withdrawInfo.amount = "";
        if (amountRef.value) {
          setTimeout(() => {
            amountRef.value.resetValidation();
          }, 0);
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const getWithdrawalMethods = () => {
  api.get("/session/withdraw/entrance/status").then((response) => {
    if (response.code === 0) {
      if (isAutoWithdrawal.value) {
        isShowRemainingDialog.value = !response.data.withdrawStatus;
      }
      const withdrawShowList = []
      response.data.withdrawShowList.forEach(element => {
        if (element.status) {
          withdrawShowList.push(element)
        }
      });
      withdrawalMethods.value = withdrawShowList;
      //Remove this for real data
      // withdrawalMethods.value = [
      //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
      //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
      if (withdrawalMethods.value.length > 0) {
        selectMethod(withdrawalMethods.value[0], 0);
      }
    } else {
      notify({
        type: "error",
        message: response.message
      });
    }
  });
};
const updateWithdrawAmt = () => {
  withdrawInfo.amount = JSON.stringify(Math.floor(store.balance));
};

const chooseLabel = () => {
  if (isUSDT.value) {
    return "钱包地址";
    // return '虚拟币'
  } else if (isEWALLET.value) {
    return "电子钱包";
  } else if (isALIPAY.value) {
    return '支付宝'
  } else {
    return "银行卡";
  }
};

const isValidUSDTAmt = (val) => {
  if (!isUSDT.value) {
    return true;
  }
  const usdtPattern = /^([1-9][0-9]*)$/;
  return usdtPattern.test(withdrawInfo.amount) || "金额应为正数";
};

const chooseCard = () => {
  if (isUSDT.value) {
    return "虚拟钱包";
  } else if (isEWALLET.value) {
    return "电子钱包";
  } else if (isALIPAY.value) {
    return '支付宝卡'
  } else {
    return "银行卡片";
  }
};
const tutorialLabel = () => {
  if (selectedWithdrawalMethod.value.code === "KDPAY") {
    return "K豆教程视频";
  } else if (selectedWithdrawalMethod.value.code === "EBPAY") {
    return "EB教程视频";
  } else if (selectedWithdrawalMethod.value.code === "OKPAY") {
    return "OK教程视频";
  } else if (selectedWithdrawalMethod.value.code === "BLBPAY") {
    return "808钱包教程视频";
  } else if (selectedWithdrawalMethod.value.code === "JDPAY") {
    return "JDPAY教程视频";
  }else if (selectedWithdrawalMethod.value.code === "NINEPAY") {
    return "98PAY教程视频";
  }
};
const openEWalletTutorial = () => {
  if (!selectedWithdrawalMethod.value.url) return;
  window.open(selectedWithdrawalMethod.value.url);
};

const isAutoWithdrawal = computed(() => store.withdrawType === "AUTO_WITHDRAW");

const handleUpgradeClick = () => {
  $q.loading.show({
    message: "升级中。。。"
  });
  api
    .get("/session/updateAutoWithdraw")
    .then(async (res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "成功升级为快速提款!"
        });

        await store.getMemberInfo();
      } else {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .finally(() => $q.loading.hide());
};
</script>
<style lang="scss">
.withdraw-section {
  .withdraw-field {
    &.q-field {
      border-radius: 10px;
      padding: 0px 8px 10px;
      box-shadow: $shadow-bg;
    }

    .q-field--highlighted .q-field__label {
      color: $dark;
    }
  }

  .withdraw-selection {
    &.q-field {
      border-radius: 10px;
      box-shadow: $shadow-bg;
    }
  }
}
</style>
<style scoped lang="scss">
.withdraw-section {
  width: $box-width;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px 12px 15px;
  box-shadow: $shadow-bg;
  background: $white;
}
.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  overflow-x: unset;
  padding: 0px 5px;
  grid-gap: 10px;
  grid-column-gap: 10px;
  grid-row-gap: 5px;

  .withdraw-type-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;

    .promo-label {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translate(-50%);
      width: 50px;

      img {
        width: 100%;
        height: auto;
        padding: 4px 6px;
      }
    }

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      padding: 5px 10px;
    }

    &.active {
      img {
        border: 3px solid #33bcd4;
        border-radius: 10px;
      }

      .promo-img {
        border: none;
        border-radius: 0px;
      }

      .type-name {
        font-weight: bold;
      }

      // img {
      //   border: 2px solid #33bcd4;
      // }
    }

    .type-name {
      line-height: 15px;
      overflow-wrap: break-word;
    }

    .promo {
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top center;
      top: -8px;
      right: -1px;
      background: linear-gradient(to right, #de4545, #db7e42);
      padding: 5px;
      color: #ffffff;
      font-size: 12px;
      line-height: 10px;
      border-radius: 0 10px;
      font-weight: bold;

      ::after {
        position: relative;
      }
    }
  }

  .withdraw-btn {
    margin: 30px auto;

    &.cancel {
      margin-right: 60px;
    }
  }
}
.selected-tip {
  color: $warning;
}

.title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 1rem;
  .upgrade-btn {
    padding: 1px 12px;
    img {
      height: 30px;
    }
  }
}

.upgraded-helper-text {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #00a478;
}

.flex-direction-column {
  flex-direction: column;
}

.quick-withdraw-btn {
  width: 100%;
}

.body--dark {
  .withdraw-section {
    @include content-block-dark;
    background: transparent;
    padding: 0;

    .account-content {
      .payment-method-section,
      .withdraw-form {
        background: linear-gradient(180deg, #384e79 2.08%, #2c3d61 47.5%, #212e4c 100%);
        padding: 10px;
        border-radius: 6px;
        width: 100%;
        margin: 10px 0;
      }
      .payment-method-section {
        .section-title {
          display: flex;
          gap: 5px;
          padding-bottom: 5px;

          .section-title-decor {
            width: 2px;
            background-color: #fff;
            margin: 5px 0;
            border-radius: 10px;
          }

          .section-title-text {
            font-size: 18px;
          }
        }
      }
    }

    .withdrawalmethod {
      .withdraw-type-item {
        border-radius: 4px;
        border: 1px solid #d9d9d94d;
        width: 100%;
        background: #273354;
        padding: 5px;

        .promo-label {
          top: -15%;
          left: 85%;
        }

        .withdraw-img {
          max-width: unset;
          width: 54px;
          height: 54px;
          border: none;

          img {
            padding: 5px;
          }
        }

        &.active {
          border-color: #d0a383;
          border-width: 1px;

          .withdraw-img {
            img {
              border: none;
            }
          }
          .type-name {
            font-weight: 400;
          }

          &:before {
            display: block;
            content: "";
            position: absolute;
            bottom: 0;
            right: 0;
            height: 18px;
            width: 18px;
            z-index: 3;
            background-image: url("../../assets/images/finance/deposit/checkmark-dark.svg");
            background-size: 100%;
            background-position: center center;
          }
        }
      }
    }
    .withdraw-selection.q-field,
    .withdraw-field.q-field {
      box-shadow: none;
    }

    .quick-withdraw-btn,
    .update-withdraw-amt-btn {
      background: url("../../assets/images/account/primary-btn.svg") no-repeat center center;
      background-size: cover;
      box-shadow: none;
      border: 1px solid #3a93ce;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 40px;
      border-radius: 4px;
    }
  }
}
</style>

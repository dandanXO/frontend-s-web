<template>
  <div>
    <div class="menu-title-container">
      <!-- <span class="menu-title">ถอน</span> -->
    </div>
    <!--    <div class="account-content withdrawal q-gutter-md q-pa-md">-->
    <!--      <div class="text-h6">Withdrawal Process</div>-->
    <!--      <q-stepper v-model="step" vertical active-color="#0071ed" inactive-color="black">-->
    <!--        <q-step :done="true" prefix="1" :name="1" status="process" title="Applying" icon=""></q-step>-->
    <!--        <q-step :done="true" prefix="2" :name="2" status="process" title="Pending"></q-step>-->
    <!--        <q-step :done="true" prefix="3" :name="3" status="process" title="Paying"></q-step>-->
    <!--        <q-step :done="true" prefix="4" :name="4" status="process" title="Successful"></q-step>-->
    <!--      </q-stepper>-->
    <!--    </div>-->
    <div class="q-pa-md q-mb-xl">
      <!-- <div class="section-header">Withdrawal Process</div> -->
      <!--      <div class="text-h6">Withdrawal Method</div>-->
      <!-- <div class="withdraw-steps">
        <img class="withdraw-steps-img" v-if="$q.dark.isActive" src="../../assets/images/finance/withdraw/withdrawal-process-steps-dark.png" />
        <img class="withdraw-steps-img"  v-if="!$q.dark.isActive" src="../../assets/images/finance/withdraw/withdrawal-process-steps.png" />
      </div> -->
      <!-- <div class="desc-list">
        <div class="desc-list-item">
          <div class="bullet-point">
            <img src="../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
          </div>
          <div class="desc-text">
            After the game is over. the system willcheck the score and synchronize thepayout. please be patient and wait for aminute. Thank you for your understandingand support!
          </div>
        </div>
        <div class="desc-list-item">
          <div class="bullet-point">
            <img src="../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
          </div>
          <div class="desc-text">
            If the withdrawal fails, please check thereason for the failure indicated in the letteron the site!
          </div>
        </div>
      </div> -->

      <div class="section-header">Withdrawal Method</div>
      <div class="account-content last">
        <div class="withdrawalmethod">
          <div
            v-for="(method, i) in withdrawalMethods"
            :key="i"
            class="txt-center withdraw-type-item"
            @click="selectMethod(method, i)"
            :class="{ active: i === activeItem }"
          >
            <span class="promo" v-if="method.recommended">Recommended</span>
            <img :src="imgURL + 'withdraw/' + method.icon" />
            <div class="type-name">{{ method.name }}</div>
          </div>
        </div>

        <q-form class="flex column q-gutter-y-sm withdraw-page-form">
          <label class="field-label">E-Wallet</label>
          <q-select
            rounded
            outlined
            ref="cardRef"
            :class="!(isUSDT && selectedWithdrawalMethod.exchangeRate) ? 'q-mb-lg' : ''"
            v-model="withdrawInfo.cardId"
            option-value="id"
            emit-value
            :label="selectCardText"
            color="light-blue-4"
            :options="withdrawState.bankCardList"
            map-options
            :rules="[(val) => !!val || errorCardText]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No cards available.
                  <router-link to="/account/withdraw">Add a card</router-link>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img v-if="scope.opt.bankIcon" style="width: 30px" :src="imgURL + 'payment/' + scope.opt.bankIcon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected-item="scope">
              <q-item-section avatar>
                <img
                  v-if="scope.opt.bankIcon"
                  style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                  :src="imgURL + 'payment/' + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                  {{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}
                </q-item-label>
              </q-item-section>
            </template>
          </q-select>

          <div class="withdraw-txt" v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" style="margin-bottom: 12px">
            <span style="color: #0b8f1a">
              1.00 USDT ≈ {{ selectedWithdrawalMethod.exchangeRate }} {{ store.currency.value }}
            </span>
          </div>

          <label class="field-label">Amount</label>
          <q-input
            rounded
            outlined
            ref="amountRef"
            v-model="withdrawInfo.amount"
            label="Amount"
            class="q-mb-md"
            color="white"
            mask="######"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter an amount',
              (val) => val >= selectedWithdrawalMethod.withdrawMin || 'The amount should be as specified.',
              (val) => val <= selectedWithdrawalMethod.withdrawMax || 'The amount should be as specified.'
            ]"
          >
            <template v-slot:append>
              <span style="font-size: 15px">₱</span>
            </template>
          </q-input>

          <div class="desc-list">
            <div class="desc-list-item" v-if="txtWithdrawMinMax">
              <div class="bullet-point">
                <img src="../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                <div v-html="txtWithdrawMinMax"></div>
              </div>
            </div>
            <div class="desc-list-item" v-if="txtWithDrawMaxAmt">
              <div class="bullet-point">
                <img src="../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                <div v-html="txtWithDrawMaxAmt"></div>
              </div>
            </div>
            <div class="desc-list-item" v-if="txtWithdrawTimes">
              <div class="bullet-point">
                <img src="../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
              </div>
              <div class="desc-text">
                <div v-html="txtWithdrawTimes"></div>
              </div>
            </div>
          </div>

          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="withdraw-txt">
            <span style="color: #0b8f1a">
              Withdraw Amount:
              {{
                selectedWithdrawalMethod && withdrawInfo.amount < selectedWithdrawalMethod.withdrawMin
                  ? "0.00"
                  : (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1).toFixed(2) > 0
                  ? (withdrawInfo.amount / selectedWithdrawalMethod.exchangeRate - 1).toFixed(2)
                  : "0.00"
              }}
              USDT
            </span>
          </div>

          <div v-if="isUSDT && selectedWithdrawalMethod.exchangeRate" class="withdraw-txt">
            <span style="color: #0b8f1a">1.00 USDT will be charged for each transaction</span>
          </div>

          <div class="flex-box flex-justify-center">
            <q-btn
              class="withdraw-btn full-width q-mt-md submit-btn"
              @click="submitWithdraw"
              label="Confirm Withdrawal"
            />
          </div>
        </q-form>
      </div>

      <!--      <ul>-->
      <!--        <li>-->
      <!--          After the game is over. the system will check the score and synchronize the payout. please be patient and wait-->
      <!--          for a minute. Thank you for your understanding and support!-->
      <!--        </li>-->
      <!--        <li>If the withdrawal fails, please check the reason for the failure indicated in the letter on the site!</li>-->
      <!--      </ul>-->
    </div>
  </div>
</template>

<script setup>
import { defineComponent, reactive, ref, onActivated, computed } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { getPlatformList } from "src/api/platform/platform";

const store = userStore();
const $q = useQuasar();
const imgURL = process.env.IMAGE_CDN + "/";
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

const isVirtual = computed(() => withdrawMethod.value !== "BANK");
const selectCardText = computed(() => {
  if (isVirtual.value) {
    return "Select eWallet";
  }
  return "Select Bank Card";
});
const errorCardText = computed(() => {
  if (isVirtual.value) {
    return "Please select an eWallet card.";
  }
  return "Please select a bank card.";
});

const hasWithdrawCard = computed(() => isLoaded.value == true && withdrawState.bankCardList.length === 0);

const step = ref(1);

const withdrawalMethods = ref([]);

const selectedWithdrawalMethod = ref(null);

const platforms = reactive([]);

const loadPlatform = () => {
  getPlatformList().then((res) => {
    res.data.forEach((p) => {
      if (p.walletType !== "SEAMLESS") {
        platforms.push({
          id: p.id,
          code: p.code,
          amount: 0
        });
      }
    });
    refreshBalance("all");
  });
};
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
const submitWithdraw = () => {
  cardRef.value.validate();
  amountRef.value.validate();
  $q.loading.show({
    message: "Verifying。。。"
  });
  if (cardRef.value.hasError || amountRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post("/session/withdraw/", qs.stringify(withdrawInfo))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Successfully Submitted.",
            icon: "check_circle_outline"
          });
          getWithdrawalMethods();
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: response.message,
        //   icon: "report_problem"
        // });
      });
    $q.loading.hide();
  }
};
const isUSDT = ref(false);
const isEWALLET = ref(false);
const isALIPAY = ref(false);
const withdrawMethod = ref("BANK");

const selectMethod = (method, index) => {
  withdrawMethod.value = method.code;

  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  selectedWithdrawalMethod.value = method;
  withdrawInfo.withdrawCode = method.code;
  isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
  isEWALLET.value =
    withdrawInfo.withdrawCode.includes("KDPAY") ||
    withdrawInfo.withdrawCode.includes("EBPAY") ||
    withdrawInfo.withdrawCode.includes("OKPAY");
  isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
  activeItem.value = index;
  loadCards();
};

const loadCards = () => {
  api
    .get("/session/bankCard")
    .then((response) => {
      isLoaded.value = true;
      withdrawState.bankCardList = [];
      if (response.code === 0) {
        // response.data = [{"id":381,"cardNumber":"234567","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"Maybank","bankType":"BANK, GCASH"},{"id":384,"cardNumber":"789456","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"},{"id":385,"cardNumber":"654987","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"CIMB Bank","bankType":"BANK"},{"id":386,"cardNumber":"963852","cardAccount":"frank li","cardAddress":"sdsadddsfsdfdsf","bankName":"GCASH","bankType":"GCASH"}]
        response.data.forEach((element) => {
          if (element && element.bankType === "BANK") {
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
        if (amountRef.value) {
          withdrawInfo.amount = "";
          amountRef.value.resetValidation();
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const getWithdrawalMethods = () => {
  api.get("/session/withdraw/entrance").then((response) => {
    if (response.code === 0) {
      withdrawalMethods.value = response.data;
      //Remove this for real data
      // withdrawalMethods.value = [
      //   {"currencyId":6,"name":"withdraw_bank","code":"BANK","icon":"71e4dd61-dfc3-4b19-97d8-6fb311c45c79.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3},
      //   {"currencyId":6,"name":"withdraw_gcash","code":"GCASH","icon":"c9d92237-4e44-4ee7-92c7-ceb5214f225f.png","withdrawMin":1000.00,"withdrawMax":10000.00,"withdrawMaxAmount":30000.00,"withdrawMaxTimes":3}]
      if (withdrawalMethods.value.length > 0) {
        selectMethod(withdrawalMethods.value[0], 0);
      }
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: response.message,
        icon: "report_problem"
      });
    }
  });
};
const updateWithdrawAmt = () => {
  withdrawInfo.amount = JSON.stringify(Math.floor(store.balance));
};

const chooseLabel = () => {
  if (isUSDT.value) {
    return "虚拟币";
  } else if (isEWALLET.value) {
    return "电子钱包";
  } else {
    return "银行卡";
  }
};

const chooseCard = () => {
  if (isUSDT.value) {
    return "虚拟钱包";
  } else if (isEWALLET.value) {
    return "电子钱包";
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
  }
};
const openEWalletTutorial = (code) => {
  const urlMap = {
    KDPAY: "http://jiaocheng.kdpay123.com",
    EBPAY: "https://www.ebpay009.com/xszn",
    OKPAY: "https://me-qr.com/l/okpay"
  };

  const url = urlMap[code];
  if (url) {
    window.open(url);
  }
};

const txtWithDrawMaxAmt = computed(() => {
  const { withdrawMaxAmount } = selectedWithdrawalMethod.value ?? {};
  if (withdrawMaxAmount) {
    return `Withdrawal today: <span style='color:orange'>${withdrawMaxAmount}</span>`;
  }
  return "";
});

const txtWithdrawTimes = computed(() => {
  const { withdrawMaxTimes } = selectedWithdrawalMethod.value ?? {};

  if (withdrawMaxTimes) {
    return `Remaining: <span style='color:orange'>${withdrawMaxTimes} time(s)</span>`;
  }
  return "";
});

const txtWithdrawMinMax = computed(() => {
  const { withdrawMin, withdrawMax, withdrawMaxAmount, withdrawMaxTimes } = selectedWithdrawalMethod.value ?? {};

  if (withdrawMin && withdrawMax) {
    return `Single Limit: <span style='color:orange'>${withdrawMin}</span> - <span style='color:orange'>${withdrawMax}</span>  `;
  }

  return "";
});

onActivated(() => {
  store.getBalance();

  getWithdrawalMethods();

  loadPlatform();
});
</script>

<style scoped lang="scss">
:deep(.ant-form-item) {
  align-items: center;

  &.tip {
    margin-top: -20px;
    color: #ffffff;
  }
}

.helptxt {
  display: flex;
  align-items: flex-start;

  .ant-input {
    background: #23263c;
    width: 50%;
    max-width: 280px;
    padding: 10px;
    border: #23263c;
  }

  :deep(.ant-form-item-control-input-content) {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    align-items: flex-start;
  }
}

:deep(.ant-form-horizontal .ant-form-item-label) {
  width: 160px;
}

:deep(.ant-form-horizontal .ant-form-item-control) {
  width: unset;
}

:deep(.ant-form-item .ant-select) {
  width: 280px;
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

.section-header {
  padding: 0px 20px;
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 20px;
}

.withdraw-steps {
  display: flex;
  justify-content: center;
  .withdraw-steps-img {

  }
}

.desc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  .desc-list-item {
    font-size: 16px;
    display: flex;
    align-items: flex-start;
    gap: 15px;
  }
}

.account-content {
  padding: 0px 10px 20px;
  width: calc(100%);
  margin: 0 auto;
  border-radius: 6px;
}

.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  overflow-x: auto;
  padding: 15px 5px;
  column-gap: 10px;
  row-gap: 25px;
}

.withdrawal {
  ul {
    padding: 0 0 0 20px;

    li {
      list-style-type: disc;
      margin-bottom: 10px;
    }
  }

  :deep(.ant-steps-item) {
    flex: unset;
  }

  :deep(.ant-steps-item-process .ant-steps-item-icon) {
    background: #2b2b4b;
    border: 1px solid #db7e42;
  }

  :deep(.ant-steps-item-finish .ant-steps-item-icon) {
    background-image: linear-gradient(to right, #de4545, #db7e42);

    border: 1px solid #2b2b4b;

    svg {
      color: #ffffff;
      stroke-width: 5px;
    }
  }

  :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: #db7e42;
  }

  :deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: #ffffff;
  }

  :deep(.ant-steps-item-title::after) {
    display: none;
  }
}

.step-item {
  color: #ffffff;
  width: 130px;
  // height: 50px;
  line-height: 45px;
  background-color: #2b2b4b;
  text-align: center;
  position: relative;
  border: 2px solid #2b2b4b;
  border-left: 0;
  padding-left: 20px;
  font-weight: bold;

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
    border-left: 23px solid #2b2b4b;
    right: -23px;
    z-index: 1;
  }

  &.active {
    color: #24222e;
    background: #ffffff;
    border: 0;
    padding-left: 0px;

    &::after {
      border-left: 25px solid #ffffff;
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
  cursor: pointer;
  position: relative;
  width: 100%;
  margin: auto;
  padding: 10px;

  img {
    max-width: 5rem;
    width: 100%;
    border: 2px solid #0000;
    border-radius: 6px;
  }

  &.active {
    border: none;
    box-shadow: none;
    border-radius: 15px;
    background-color: #a4c6ff;

    .type-name {
      color: #075BE8;
      font-weight: bold;
    }
  }

  .type-name {
    line-height: 15px;
    margin: 0px 0 0;
    overflow-wrap: break-word;
    color: $text-color;
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

.body--dark {
  .withdraw-type-item {
    &.active {
      background-color: #243354;
      border: 1px solid #9FC587;
      box-shadow: 1px 1px 1px $primary;
      .type-name {
        color: #FFFFFF;
      }
    }
    .type-name {
      color: #5A6881;
    }
  }
}

.withdraw-txt {
  margin-left: 16px;
  margin-top: 8px;
  margin-bottom: 3px;
}

.withdraw-btn {
  margin: 30px auto;

  &.cancel {
    margin-right: 60px;
  }
}
</style>
<style scoped lang="scss">
.desc-text {
  color: #5785be;
}

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
          border-left: 13px solid #2b2b4b;
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
</style>

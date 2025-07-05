<template>
  <div class="withdrawal-modal-view">
    <div class="withdrawal-summary">
      <div class="balance">
        <div class="title">{{ $t("withdraw.cashBalance") }}</div>
        <span class="amount">{{ convertToCommaAmount(store.balance, true) }}</span>
      </div>

      <div class="separator"></div>

      <div class="withdrawable">
        <div class="title">{{ $t("withdraw.withdrawable") }}</div>
        <span class="amount">
          {{
            withdrawalMethods[withdrawalDialogTab].withdrawableBalance >= 0
              ? convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawableBalance, false)
              : "0.00"
          }}
        </span>
      </div>
    </div>

    <div class="withdrawalmethod" v-if="!isLoadingWithdrawalMethod">
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
      </div>
    </div>

    <div class="bank-account-container" v-if="bankCardList.length > 0">
      <div class="top-wrapper">
        <div class="title">{{ $t("form.withdrawChoose_placeholder") }}</div>
      </div>

      <div class="mid-wrapper">
        <div class="w-form-item w-form-item--bankcard">
          <div class="w-form-input">
            <q-select
              ref="cardRef"
              class="w-select"
              filled
              dense
              clearable
              v-model="withdrawInfo.cardId"
              @update:model-value="onCardChanged"
              :options="bankCardList"
              option-value="id"
              emit-value
              map-options
              :rules="[(val) => !!val || $t('form.withdrawChoose_placeholder')]"
              lazy-rules
              hide-bottom-space
            >
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
                    <!-- <q-item-label>
                      IFSC
                      {{ scope.opt.cardAddress }}
                    </q-item-label> -->
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
                  <!-- <q-item-label>
                    IFSC
                    {{ scope.opt.cardAddress }}
                  </q-item-label> -->
                </q-item-section>
              </template>
            </q-select>
          </div>
        </div>
      </div>

      <div class="bot-wrapper">
        <div class="bank-card-item" @click="goToBank()">
          <div class="card-icon">
            <q-icon key="md" size="md" name="add" />
          </div>
          <div class="card-label">{{ $t("btn.addNewAccount") }}</div>
        </div>
      </div>
    </div>

    <div class="withdrawal-amount-container">
      <template v-if="bankCardList.length === 0">
        <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
          <div class="top-wrapper">
            <div class="title">Account Number</div>
          </div>
          <div class="mid-wrapper">
            <q-input
              filled
              dense
              clearable
              lazy-rules
              ref="bankNumberRef"
              placeholder="Enter Account Number"
              v-model="withdrawReadOnlyInfo.cardNumber"
              :rules="[(_) => isValidCardNumber()]"
              :readonly="bankCardList.length > 0 ? true : false"
              hide-bottom-space
            ></q-input>
          </div>
        </div>
        <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
          <div class="top-wrapper">
            <div class="title">Bank IFSC Code</div>
          </div>
          <div class="mid-wrapper">
            <q-input
              filled
              dense
              clearable
              lazy-rules
              ref="bankAddressRef"
              placeholder="Enter Bank IFSC Code"
              v-model="withdrawReadOnlyInfo.cardAddress"
              :rules="[(_) => isValidCardAddress()]"
              :readonly="bankCardList.length > 0 ? true : false"
              hide-bottom-space
            ></q-input>
          </div>
        </div>
      </template>

      <div class="top-wrapper">
        <div class="title">
          {{ $t("form.withdrawalAmount") }}
          <span class="amount">
            ({{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMin) }} -
            {{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMax) }} {{ store.currency.label }})
          </span>
        </div>
      </div>

      <div class="mid-wrapper">
        <q-input
          type="number"
          ref="amountRef"
          class="amount-input"
          outlined
          dense
          clearable
          placeholder="Withdraw Amount"
          v-model="withdrawInfo.amount"
          :rules="[
            (val) => !!val || $t('form.withdrawalAmount_rules_01'),
            (val) => val > 0 || $t('form.withdrawalAmount_rules_02'),
            (val) =>
              val < withdrawalMethods[withdrawalDialogTab].withdrawableBalance || $t('form.withdrawalAmount_rules_03'),
            (val) =>
              (val >= withdrawalMethods[withdrawalDialogTab].withdrawMin &&
                val <= withdrawalMethods[withdrawalDialogTab].withdrawMax) ||
              `${$t('form.withdrawalAmount_rules_03')} ${withdrawalMethods[withdrawalDialogTab].withdrawMin} - ${
                withdrawalMethods[withdrawalDialogTab].withdrawMax
              }`
          ]"
          lazy-rules
          hide-bottom-space
        ></q-input>
      </div>

      <div class="bot-wrapper">
        <div class="info">
          <div class="desc-wrapper">
            <div class="desc">{{ $t("withdraw.withdrewAmount") }}</div>
          </div>
          <div class="amount">
            {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawAmount) }}
          </div>
        </div>
        <div class="info">
          <div class="desc-wrapper">
            <div class="desc">{{ $t("withdraw.dailyLimit") }} {{ store.vip }}</div>
          </div>
          <div class="amount">
            {{ store.currency.label }}:{{
              convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount)
            }}
          </div>
        </div>
        <div class="info">
          <div class="desc-wrapper">
            <div class="desc">{{ $t("withdraw.remainWagers") }}</div>
          </div>
          <div class="amount">
            {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].remainWagers) }}
          </div>
        </div>
      </div>
    </div>

    <template v-if="bankCardList.length > 0">
      <div
        class="btn-submit"
        :class="{
          disabled: !isLoading && !store.canWithdraw
        }"
        @click="submitWithdraw"
      >
        <q-spinner v-if="isLoading" color="white" size="2em" :thickness="2"></q-spinner>
        <template v-else>{{ $t("btn.submit") }}</template>
      </div>
    </template>
    <template v-else>
      <div :class="`btn-submit`" @click="submitWithdrawBank">
        <q-spinner v-if="isLoading" color="white" size="2em" :thickness="2"></q-spinner>
        <template v-else>{{ $t("btn.submit") }}</template>
      </div>
    </template>

    <template v-if="withdrawalMethods.tips">
      <div class="bottom-tnc q-mt-md" v-html="withdrawalMethods.tips"></div>
    </template>
    <div v-if="!isLoading && !store.canWithdraw" class="withdraw-alert">
      {{ $t("withdraw.requireDeposit") }}
    </div>
  </div>

  <q-dialog width="100%" v-model="isShowRedirectAddBankModal">
    <q-card style="width: 100%; padding: 20px" class="bg-dark text-white text-center">
      <div class="q-mb-md">Please Add Account</div>
      <router-link to="/account/bank"><q-btn label="OK" color="brightbtn" /></router-link>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, onActivated, ref, reactive, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";
import { t } from "src/boot/lang";

// withdraw component
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();

const isLoading = computed(() => isLoadingBankCard.value || isLoadingWithdrawalMethod.value || isSubmitDisable.value);

const imgURL = process.env.IMAGE_CDN;

const refreshBalance = () => {
  if (store.token) store.getBalance();
};

const isLoadingWithdrawalMethod = ref(false);
const withdrawalDialogTab = ref("BANK");
const withdrawalMethods = reactive({
  BANK: {
    withdrawAmount: 0,
    withdrawMaxAmount: 0,
    remainWagers: 0,
    withdrawMin: 0,
    withdrawMax: 0,
    withdrawableBalance: 0
  }
  // UPI: {}
});
const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  let cbCount = 0;

  const checkCb = () => {
    if (cbCount === 2) isLoadingWithdrawalMethod.value = false;
  };

  api.get("/session/withdraw/entrance").then((response) => {
    if (response.code === 0) {
      for (let i = 0, l = response.data.length; i < l; i++) {
        const currentData = response.data[i];
        withdrawalMethods[currentData.code] = currentData;
        selectMethod(withdrawalMethods[currentData.code], currentData.code);
      }
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: response.message,
        icon: "report_problem"
      });
    }

    cbCount++;
    checkCb();
  });

  if (bankCardList.value.length === 0) {
    api
      .get("/session/withdraw/card")
      .then((res) => {
        if (res.code === 0) {
          res.data.forEach((e) => {
            bankCardField.bankId = e.id;
          });
        }
      })
      .catch((e) => {
        console.log("error", e);
      })
      .then(() => {
        cbCount++;
        checkCb();
      });
  } else {
    cbCount++;
    checkCb();
  }
};

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);
const isNoBankCard = computed(() => {
  return bankCardList.value.length === 0;
});

const activeItem = ref(0);

const selectMethod = (method, index) => {
  withdrawInfo.withdrawCode = null;
  withdrawInfo.cardId = null;
  // selectedWithdrawalMethod.value = method;
  withdrawInfo.withdrawCode = method.code;
  // displayMaintenanceDialog.value = method.status === false;
  // isUSDT.value = withdrawInfo.withdrawCode.includes("USDT");
  // isEWALLET.value =
  //   withdrawInfo.withdrawCode.includes("KDPAY") ||
  //   withdrawInfo.withdrawCode.includes("EBPAY") ||
  //   withdrawInfo.withdrawCode.includes("OKPAY");
  // isALIPAY.value = withdrawInfo.withdrawCode.includes("ALIPAY");
  activeItem.value = index;
  loadCards();
};

const loadCards = () => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then((res) => {
      if (res.code === 0) {
        bankCardList.value = [];
        bankCardList.value.push(...res.data);

        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: t("notify.addBankCardFirst"),
            icon: "report_problem"
          });
          router.push("/account/bank");
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isLoadingBankCard.value = false;
    });
};

const cardRef = ref();
const amountRef = ref();
const bankAddressRef = ref();
const bankNumberRef = ref();
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: ""
});
const withdrawReadOnlyInfo = reactive({
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: ""
});
const bankCardField = reactive({
  bankId: undefined,
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: "",
  withdrawCode: "",
  amount: ""
});
watch(withdrawalDialogTab, () => {
  withdrawInfo.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;

  withdrawInfo.cardId = null;
  withdrawInfo.amount = "";

  withdrawReadOnlyInfo.cardAccount = "";
  withdrawReadOnlyInfo.cardNumber = "";
  withdrawReadOnlyInfo.cardAddress = "";
});

const onCardChanged = () => {
  bankCardList.value.forEach((e) => {
    if (e.id === withdrawInfo.cardId) {
      withdrawReadOnlyInfo.cardAccount = e.cardAccount;
      withdrawReadOnlyInfo.cardNumber = e.cardNumber;
      withdrawReadOnlyInfo.cardAddress = e.cardAddress || "-";
    }
  });
};

const isShowRedirectAddBankModal = ref(false);
const isSubmitDisable = ref(false);
const submitWithdraw = () => {
  if (!store.canWithdraw || isLoading.value) {
    return;
  }

  isSubmitDisable.value = true;
  if (bankCardList.value.length === 0) {
    isShowRedirectAddBankModal.value = true;
    isSubmitDisable.value = false;
  } else {
    // cardRef.value.validate();
    amountRef.value.validate();

    $q.loading.show({
      message: t("btn.withdrawing")
    });

    // cardRef.value.hasError ||
    if (amountRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
    } else {
      withdrawGo(() => {
        isSubmitDisable.value = false;
      });
    }
  }
};

const submitWithdrawBank = async () => {
  isSubmitDisable.value = true;
  if (bankCardList.value.length === 0) {
    amountRef.value.validate();
    bankAddressRef.value.validate();
    bankNumberRef.value.validate();

    if (amountRef.value.hasError || bankAddressRef.value.hasError || bankNumberRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
      return;
    }

    bankCardField.cardNumber = withdrawReadOnlyInfo.cardNumber;
    bankCardField.cardAddress = withdrawReadOnlyInfo.cardAddress;
    bankCardField.amount = withdrawInfo.amount;
    bankCardField.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;

    // console.log(withdrawalMethods[withdrawalDialogTab.value].withdrawableBalance,'sss')

    // console.log(withdrawalMethods[withdrawalDialogTab].withdrawableBalance, "...");
    // console.log(withdrawableAmt);

    // if (withdrawInfo.amount > withdrawalMethods[withdrawalDialogTab.value].withdrawableBalance) {
    // $q.notify({
    //   color: "negative",
    //   position: "top",
    //   message: "Insufficient amount",
    //   icon: "report_problem"
    // });
    // } else {
    api
      .post("/session/withdrawAndBankCard", qs.stringify(bankCardField))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.withdrawalSubmitSucceed"),
            icon: "check_circle_outline"
          });
          // props.loadCards();
          refreshBalance();
          getWithdrawalMethods();

          emits("closeWithdraw");
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .then(() => {
        isSubmitDisable.value = false;
      });
    // }
  } else {
    // cardRef.value.validate();
    amountRef.value.validate();

    $q.loading.show({
      message: t("btn.withdrawing")
    });

    // cardRef.value.hasError ||
    if (amountRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
    } else {
      withdrawGo(() => {
        isSubmitDisable.value = false;
      });
    }
  }
};

const withdrawGo = (callback) => {
  withdrawInfo.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;
  api
    .post("/session/withdraw/", qs.stringify(withdrawInfo))
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.withdrawalSubmitSucceed"),
          icon: "check_circle_outline"
        });

        refreshBalance();
        getWithdrawalMethods();

        isShowModal.value = false;
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
    })
    .then(() => {
      $q.loading.hide();
      callback && callback();
    });
};

const goToBank = () => {
  router.push("/account/bank?from=" + route.path);
};

const checkNewUser = () => {
  if (store.realName == "" || store.realName == null) {
    $q.notify({
      color: "negative",
      position: "top",
      // message: "Please fill in your personal details",
      message: t("notify.fillInPersonalDetails"),
      icon: "report_problem"
    });
    router.push(`/deposit`);
  }
};

onMounted(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
});

onActivated(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
});

const isValidCardNumber = () => {
  const { cardNumber } = withdrawReadOnlyInfo;

  const result = !cardNumber ? "Please Enter Card Number" : true;
  return result;
};

const isValidCardAddress = () => {
  const { cardAddress } = withdrawReadOnlyInfo;
  const result = !cardAddress
    ? "Please Enter Bank Ifsc Code"
    : cardAddress.length < 3
    ? "Bank IFSC Code Must Be More Than 3 Characters"
    : true;
  return result;
};
</script>

<style scoped lang="scss">
.withdrawal-modal-view {
  margin: auto;
  width: 95%;

  .withdrawal-summary {
    padding: 1rem;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #35383f;
    border-radius: 6px;
    background: #1f241f;

    text-align: center;
    font-family: "Manrope", sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    aspect-ratio: 335/82;

    .balance {
      margin: 0 0 0 1rem;
    }

    .withdrawable {
      margin: 0 1rem 0 0;
    }

    .separator {
      width: 2px;
      height: 3rem;
      background: #35383f;
    }

    .title {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 700;
    }

    span {
      font-size: 20px;
      color: #00fd7c;
    }
  }

  .bank-account-container {
    border-radius: 0.5rem;
    background: rgba(21, 0, 37, 0.2);
    margin-top: 20px;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;
      .title {
        color: #ffffffb2;
        font-size: 14px;
        font-weight: 600;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      background: rgba(21, 0, 37, 0.5);
      margin: 0 -1rem 0.5rem -1rem;
      padding: 0 1rem;

      .w-form-item {
        .w-form-input {
          .w-select {
            :deep(.q-field__marginal) {
              height: 62px;
            }
          }
        }
      }
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin: 1rem 0 0.5rem 0;

      .bank-card-item {
        padding: 3px;
        border-radius: 4;
        background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
        position: relative;
        transition: 0.3s all;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2d2d2d;

        .card-label {
          font-size: 1rem;
          font-weight: 700;
        }

        .card-icon {
          width: 50px;
          margin-bottom: 0.25rem;
          display: flex;
          justify-content: center;
        }
      }
    }
  }

  .withdrawal-amount-container {
    border-radius: 0.5rem;
    margin: 20px 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;
      .title {
        color: #ffffffb2;
        font-size: 14px;
        font-weight: 600;
        .amount {
          color: #fbab1b;
        }
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      border-radius: 0.5rem;
      margin: 0 0 0.5rem 0;

      .amount-input {
        padding: 19px 0;
        :deep(.q-field__control) {
          &::before {
            border-color: #4b4943;
          }
        }
      }
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin: 1rem 0 0.5rem 0;

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        color: white;
        border-radius: 3.125rem;
        opacity: 0.8;
        background: linear-gradient(90deg, #abff3e -1.25%, rgba(62, 255, 133, 0) 104.06%);
        padding: 5px 10px;

        .desc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 12px;
        }

        .desc {
          font-weight: 700;
          text-shadow: 0px 4px 4px #00000040;
        }

        .amount {
          color: #fbab1b;
        }
      }
    }
  }

  .btn-submit {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    font-weight: 700;
    height: 46px;
    width: 100%;
    transition: 0.3s all;
    color: #2d2d2d;
    margin: auto;
    border-radius: 4px;
    background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
    box-shadow: 0px 2px 8px 0px #baffa633;
    aspect-ratio: 335/46;

    &:before {
      box-shadow: none;
    }

    &.disabled {
      filter: grayscale(1);
    }
  }

  .bottom-tnc {
    background-color: #1f241f;
    padding: 8px 12px;
    font-size: 12px;
    color: #fbab1b;
  }

  .withdraw-alert {
    padding-top: 8px;
    color: #e03f3f;
  }
}

.withdrawalmethod {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  overflow-x: unset;
  padding: 0px 5px;
  grid-gap: 10px;
  grid-column-gap: 10px;
  grid-row-gap: 5px;
  margin-top: 20px;

  .withdraw-type-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    position: relative;
    cursor: pointer;

    .withdraw-img {
      border: 2px solid transparent;
      border-radius: 10px;
      max-width: 4.5rem;
    }

    img {
      width: 100%;
      background: #394142;
      padding: 5px;
      border-radius: 10px;
    }

    &.active {
      // background: #212534;
      // color: #db7e42;
      // box-shadow: none;
      // filter: drop-shadow(0px 0px 3px #ffffff);
      img {
        background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
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
      // overflow-wrap: break-word;
      white-space: nowrap;
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
</style>

<template>
  <div class="withdrawal-modal-view" :class="isInputFocus && 'input-btm'">
    <div v-if="isSelectedMethod" class="withdrawal-summary">
      <div class="balance">
        <span class="amount">
          {{ store.balance > 0 ? convertToCommaAmount(store.balance, false) : "0.00" }}
        </span>
        <div class="title">Cash Balance</div>
      </div>

      <div class="separator"></div>

      <div class="withdrawable">
        <span class="amount">
          {{
            selectedMethodItem.withdrawableBalance > 0
              ? convertToCommaAmount(selectedMethodItem.withdrawableBalance, false)
              : "0.00"
          }}
        </span>
        <div class="title">Withdrawable</div>
      </div>
    </div>
    <div class="method-title q-mb-sm">Withdraw Currency</div>
    <div class="withdraw-methods-currency" v-if="isLoadingWithdrawalMethod">
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
      <div>
        <q-skeleton style="height: 96px" />
      </div>
    </div>

    <template v-else>
      <div class="withdraw-methods-currency">
        <div
          class="currency-item"
          v-for="(item, index) in paymentMethodsItems"
          :key="index"
          @click="selectWithdrawCurrency(item)"
          :class="{ active: item.code === selectedWithdraw[0].code }"
        >
          <div class="item-icon"><img :src="imgURL + '/payment/' + item.nodeIcon" /></div>
          <div>{{ item.code }}</div>
          <div class="item-hot-ribbon" v-if="item.hot">
            <img src="../../assets/images/account/ribbon-hot.png" />
          </div>
        </div>
      </div>

      <template v-if="selectedWithdraw">
        <div class="method-title q-mt-md q-mb-sm">Payment channels</div>
        <div class="withdraw-methods-container">
          <template v-for="(item, index) in selectedWithdraw" :key="index">
            <div
              class="method-item"
              @click="goSelectedMethod(item)"
              :class="{ disabled: item.maintenance, active: item.active }"
            >
              <template v-if="item.maintenance">
                <div class="item-detail">
                  <div class="txt-maintenance">
                    <q-icon name="build" size="16px" />
                    This channel is under maintenance
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="item-detail">
                  <div class="txt-title">{{ item.nodeName }}</div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>

      <template v-if="isSelectedMethod">
        <div
          class="bank-account-container"
          v-if="isBankType === 'BANK' && (bankCardList.length === 0 || isAddNewAccount)"
        >
          <div class="w-form-item w-form-item--bankcard">
            <div class="top-wrapper">
              <div class="title">Bank Name</div>
            </div>
            <div>
              <q-select
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.bankId"
                label-color="secondary"
                :options="filteredBankList"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                use-input
                input-debounce="100"
                fill-input
                hide-selected
                @filter="filterBank"
                behavior="menu"
              ></q-select>
            </div>
          </div>
        </div>

        <!-- bank options -->
        <div class="bank-account-container" v-if="bankCardList.length > 0 && !isAddNewAccount">
          <div class="method-title q-mb-sm">Choose {{ displayCardType }} Account</div>
          <div class="mid-wrapper">
            <div class="w-form-item w-form-item--bankcard">
              <div class="w-form-input">
                <q-select
                  ref="cardRef"
                  class="bank-select-input"
                  :loading="isLoadingBankCard"
                  filled
                  dense
                  clearable
                  v-model="withdrawInfo.cardId"
                  @update:model-value="onCardChanged"
                  :options="bankCardList"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || validateBankCardError()]"
                  hide-bottom-space
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar v-if="scope.opt.bankIcon">
                        <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          Acc No. ****{{
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
                        Acc No. {{ scope.opt.cardNumber }}
                      </q-item-label>
                    </q-item-section>
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <div class="bot-wrapper">
            <div class="bank-card-item" @click="onAddNewAccount">
              <div class="card-icon">
                <q-icon key="md" size="md" name="add" />
              </div>
              <div class="card-label">Add New Account</div>
            </div>
          </div>
        </div>

        <div class="withdrawal-amount-container">
          <template v-if="bankCardList.length === 0 || isAddNewAccount">
            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">Account Number</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  ref="bankNumberRef"
                  placeholder="Enter Account Number"
                  v-model="bankCardField.cardNumber"
                  :rules="[(_) => isValidCardNumber()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                ></q-input>
              </div>
            </div>
            <!--            <div class="w-form-item w-form-item&#45;&#45;bankcard" v-if="isBankType === 'BANK'">-->
            <!--              <div class="top-wrapper">-->
            <!--                <div class="title">Bank IFSC Code</div>-->
            <!--              </div>-->
            <!--              <div class="mid-wrapper">-->
            <!--                <q-input-->
            <!--                  filled-->
            <!--                  dense-->
            <!--                  clearable-->
            <!--                  ref="bankAddressRef"-->
            <!--                  placeholder="Enter Bank IFSC Code"-->
            <!--                  v-model="bankCardField.cardAddress"-->
            <!--                  :rules="[(_) => isValidCardAddress()]"-->
            <!--                  hide-bottom-space-->
            <!--                ></q-input>-->
            <!--              </div>-->
            <!--            </div>-->
          </template>

          <div class="top-wrapper">
            <!-- <div class="title">
            Withdrawal Amount ({{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMin) }} -
            {{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMax) }} {{ store.currency.label }})
          </div> -->
            <div class="title">
              Withdrawal Amount ({{ convertToCommaAmount(selectedMethodItem.withdrawMin) }} -
              {{ convertToCommaAmount(selectedMethodItem.withdrawMax) }} {{ store.currency.label }})
            </div>
          </div>

          <div class="mid-wrapper">
            <q-input
              type="number"
              ref="amountRef"
              filled
              dense
              clearable
              placeholder="Withdraw Amount"
              v-model="withdrawInfo.amount"
              :rules="[
                (val) => !!val || 'Please Enter Withdraw Amount',
                (val) => val > 0 || 'Withdraw Amount Must Be Greater Than 0',
                (val) => val <= selectedMethodItem.withdrawableBalance || `Withdraw Amount Insufficient`,
                (val) =>
                  (val >= selectedMethodItem.withdrawMin && val <= selectedMethodItem.withdrawMax) ||
                  `Withdraw Amount Must In Between ${selectedMethodItem.withdrawMin} - ${selectedMethodItem.withdrawMax}`,
                (val) => Number.isInteger(+val) || 'Withdraw Amount Must Not Have Decimals'
              ]"
              hide-bottom-space
              @focus="scrollToInput"
              @blur="isInputFocus = false"
            >
              <template v-slot:append>
                <q-btn-group>
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="min"
                    dense
                    no-caps
                    @click="toggleAmount('min')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="25%"
                    dense
                    no-caps
                    @click="toggleAmount('25')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="50%"
                    dense
                    no-caps
                    @click="toggleAmount('50')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="Max"
                    dense
                    no-caps
                    @click="toggleAmount('max')"
                  />
                </q-btn-group>
              </template>
            </q-input>
          </div>

          <div class="fund-container q-mt-sm q-mb-md">
            <div>
              <span class="fund-title">Available:</span>
              <q-spinner v-if="isRefreshRemainWager" />
              <span v-else>
                {{ store.currency.label }} {{ convertToCommaAmount(selectedMethodItem.withdrawableBalance) }}
              </span>
            </div>
          </div>

          <div class="bot-wrapper">
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">Withdrew Amount</div>
              </div>
              <div class="desc desc_white">
                <!-- {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawAmount) }} -->
                {{ store.currency.label }}: {{ selectedMethodItem.withdrawAmount }}
              </div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">{{ store.vip }} Daily Limit</div>
              </div>
              <div class="desc desc_white">
                <!-- {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount) }} -->
                {{ store.currency.label }}: {{ convertToCommaAmount(selectedMethodItem.withdrawMaxAmount) }}
              </div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">Remain Wagers</div>
              </div>
              <div class="desc desc_white">
                <!-- {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].remainWagers) }} -->
                <!-- {{ store.currency.label }}: {{ selectedMethodItem.remainWagers }} -->

                <div class="remain-wager-wrapper" @click="refreshRemainWager">
                  <q-spinner v-if="isRefreshRemainWager" />
                  <span v-else>
                    {{ store.currency.value }}: {{ convertToCommaAmount(selectedMethodItem.remainWagers, true) }}
                  </span>
                  <img
                    class="refresh-btn-img"
                    :class="{ rotate: isRefreshRemainWager }"
                    src="../../assets/images/account/refresh-icon.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-if="bankCardList.length > 0 && !isAddNewAccount">
          <div :class="`btn-submit`" @click="submitWithdraw">
            <q-spinner
              v-if="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
              color="white"
              size="2em"
              :thickness="2"
            ></q-spinner>
            <template v-else>Submit</template>
          </div>
        </template>

        <template v-else>
          <div :class="`btn-submit`" @click="submitWithdrawBank">
            <q-spinner
              v-if="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
              color="white"
              size="2em"
              :thickness="2"
            ></q-spinner>
            <template v-else>Submit</template>
          </div>
        </template>
        <div v-if="selectedMethodItem.tips" class="withdraw-tip-wrapper" v-html="selectedMethodItem.tips"></div>
      </template>
    </template>
  </div>

  <q-dialog width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="router.go(-1)" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, onActivated, ref, reactive, watch, computed, nextTick } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";
import KYCUserForm from "../../components/KYCUserForm.vue";

// withdraw component
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();
const isRefreshRemainWager = ref(false);

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
  },
  UPI: {}
});

const paymentMethodsItems = ref([]);
const selectedMethodsItems = ref([]);
const listItems = ref([]);

const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  let cbCount = 0;

  const checkCb = () => {
    if (cbCount === 2) isLoadingWithdrawalMethod.value = false;
  };

  api.get("/session/nga/withdraw/entrance").then((res) => {
    if (res.code === 0) {
      let bankWithdraws = res.data.withdraws
        .map((withdraw) => {
          return withdraw.children.map((child) => child.children.map((grandchild) => grandchild.children)).flat(2);
        })
        .flat();
      selectedMethodsItems.value = bankWithdraws.flat().sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      let groupedMethods = bankWithdraws.reduce((acc, method) => {
        if (!acc[method.code]) {
          acc[method.code] = method;
        }
        return acc;
      }, {});

      // listItems
      let listCurrency = res.data.withdraws
        .map((withdraw) => {
          return withdraw.children.map((child) => child.children).flat();
        })
        .flat();
      listItems.value = listCurrency.flat().sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      paymentMethodsItems.value = Object.values(groupedMethods).sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      selectWithdrawCurrency(paymentMethodsItems.value[0]);
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
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
            bankCardField.withdrawPlatformId = e.code;

            const bankType = e.bankType;
            if (bankType === "BANK") bankList.push(e);
            else if (bankType === "CRYPTO") cryptoList.push(e);
            else if (bankType === "EWALLET") ewalletList.push(e);
          });

          selectBankType();
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

const selectedWithdraw = ref();
const selectWithdrawCurrency = (item) => {
  const filteredMethods = selectedMethodsItems.value.filter((method) => method.code === item.code);
  if (filteredMethods.length > 0) {
    selectedWithdraw.value = filteredMethods;
  }
  isAddNewAccount.value = false;
  goSelectedMethod(selectedWithdraw.value[0]);
};

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);

const displayCardType = computed(() => {
  if (selectedMethodItem.value.payType === "EWALLET") {
    return "eWallet";
  } else if (selectedMethodItem.value.payType === "CRYPTO") {
    return "Crypto";
  }
  return "Bank";
});

const validateBankCardError = () => {
  if (selectedMethodItem.value.payType === "EWALLET") {
    return "Please Select eWallet Card";
  } else if (selectedMethodItem.value.payType === "CRYPTO") {
    return "Please Select Crypto Card";
  }
  return "Please Select Bank Card";
};

const isNoBankCard = ref(false);

const filterCards = (type) => {
  isLoadingBankCard.value = true;

  bankCardList.value = [];
  api
    .get("/session/bankCard")
    .then((res) => {
      isLoadingBankCard.value = false;

      if (res.code === 0) {
        let filteredData = [];
        if (isBankType.value === "BANK") {
          const bankType = type.bankType;
          filteredData = res.data.filter((item) => item.bankType === bankType);
          const bankCodes = filteredBankList.value.map((bank) => bank.code);
          filteredData = filteredData.filter((item) => bankCodes.includes(item.bankCode));
        } else {
          const typeCode = type.code;
          filteredData = res.data.filter((item) => item.bankCode === typeCode);
        }

        bankCardList.value = [...filteredData];
        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .finally(() => {
      isLoadingBankCard.value = false;
    });
};

const loadCards = () => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then((res) => {
      isLoadingBankCard.value = false;
      if (res.code === 0) {
        bankCardList.value = [];
        bankCardList.value.push(...res.data);

        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
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
// const bankAddressRef = ref();
const bankNumberRef = ref();
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: "",
  withdrawPlatformId: ""
});
const withdrawReadOnlyInfo = reactive({
  cardAccount: store.realName,
  cardNumber: ""
  // cardAddress: ""
});

const bankCardField = reactive({
  bankId: undefined,
  cardAccount: store.realName,
  cardNumber: "",
  // cardAddress: "",
  withdrawCode: "",
  withdrawPlatformId: "",
  amount: ""
});

watch(
  () => bankCardField.bankId,
  (newValue) => {
    const selectedBank = filteredBankList.value.find((bank) => bank.id === newValue);
    filterCards(selectedBank);
  }
);

watch(withdrawalDialogTab, () => {
  withdrawInfo.cardId = null;
  withdrawInfo.amount = "";
  bankCardField.cardAccount = "";
  bankCardField.cardNumber = "";
  bankCardField.cardAddress = "";
});

const onCardChanged = () => {
  bankCardList.value.forEach((e) => {
    if (e.id === withdrawInfo.cardId) {
      bankCardField.cardAccount = e.cardAccount;
      bankCardField.cardNumber = e.cardNumber;
      bankCardField.cardAddress = e.cardAddress || "-";
    }
  });
};

const isShowRedirectAddBankModal = ref(false);
const isSubmitDisable = ref(false);
const submitWithdraw = () => {
  isSubmitDisable.value = true;
  if (bankCardList.value.length === 0) {
    isShowRedirectAddBankModal.value = true;
    isSubmitDisable.value = false;
  } else {
    amountRef.value.validate();

    $q.loading.show({
      message: "Withdrawing..."
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

const submitWithdrawBank = () => {
  isSubmitDisable.value = true;
  amountRef.value.validate();
  bankNumberRef.value.validate();

  if (amountRef.value.hasError || bankNumberRef.value.hasError) {
    $q.loading.hide();
    isSubmitDisable.value = false;
    return;
  }

  bankCardField.amount = withdrawInfo.amount;
  bankCardField.withdrawCode = selectedMethodItem.value.code;
  bankCardField.withdrawPlatformId = selectedMethodItem.value.withdrawId;

  api
    .post("/session/withdrawAndBankCard", qs.stringify(bankCardField))
    .then((response) => {
      isSubmitDisable.value = false;
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Withdrawal Submit Succeed",
          icon: "check_circle_outline"
        });
        refreshBalance();
        getWithdrawalMethods();
        resetSelectedMethod();

        bankCardField.cardNumber = "";
        bankCardField.amount = "";
        withdrawInfo.amount = "";
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isSubmitDisable.value = false;
    });
};

const withdrawGo = (callback) => {
  withdrawInfo.withdrawCode = selectedMethodItem.value.code;
  withdrawInfo.withdrawPlatformId = selectedMethodItem.value.withdrawId;
  api
    .post("/session/withdraw/", qs.stringify(withdrawInfo))
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Withdrawal Submit Succeed",
          icon: "check_circle_outline"
        });
        refreshBalance();
        getWithdrawalMethods();
        withdrawInfo.amount = "";
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
      message: "Please fill in your personal details",
      icon: "report_problem"
    });
    router.push(`/withdraw`);
  }
};

const isSelectedMethod = ref(false);

const resetSelectedMethod = () => {
  isSelectedMethod.value = false;
  isAddNewAccount.value = false;
};

const isBankType = ref();

const selectedMethodItem = ref();
const goSelectedMethod = (item) => {
  // selectedWithdraw.value.forEach((method) => (method.active = false));
  // item.active = true;

  selectedWithdraw.value.forEach((method) => {
    method.active = false;
  });
  item.active = true;
  isSelectedMethod.value = true;
  // debugger;
  selectedMethodItem.value = item;
  filteredBankList.value = item.bankList;
  isBankType.value = filteredBankList.value[0].bankType;
  bankCardField.bankId = item.bankList[0].id;
  bankCardField.cardNumber = "";
  bankCardField.cardAddress = "";
  withdrawInfo.amount = "";
};

const onAddNewAccount = () => {
  bankCardField.cardNumber = "";
  isAddNewAccount.value = true;
};

const refreshRemainWager = () => {
  isRefreshRemainWager.value = true;

  api
    .get("/session/withdraw/withdrawableBalance/refresh")
    .then((res) => {
      selectedMethodItem.value = {
        ...selectedMethodItem.value,
        ...res.data
      };

      isRefreshRemainWager.value = false;
    })
    .catch(() => {
      isRefreshRemainWager.value = false;
    })
    .finally(() => {
      isRefreshRemainWager.value = false;
    });
};

onMounted(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
  loadInfo();
});

onActivated(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
  loadInfo();
});

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;

  const result = !cardNumber
    ? "Please Enter Card Number"
    : !cardNumber.includes(".")
    ? true
    : "Account number must not contain a decimal point";

  if (
    cardNumber &&
    (selectedMethodItem.value.code === "GCASH" ||
      selectedMethodItem.value.code === "MAYAPAY" ||
      selectedMethodItem.value.code === "GRABPAY")
  ) {
    const gCashCheck =
      cardNumber.substring(0, 1) !== "0"
        ? `The ${selectedMethodItem.value.code} card number must start with '0'`
        : cardNumber.length !== 11
        ? `The ${selectedMethodItem.value.code} card number length should be 11`
        : true;
    if (gCashCheck !== true) {
      return gCashCheck;
    }
  }

  return result;
};

const isValidCardAddress = () => {
  const { cardAddress } = bankCardField;
  const result = !cardAddress
    ? "Please Enter Bank Ifsc Code"
    : cardAddress.length < 3
    ? "Bank IFSC Code Must Be More Than 3 Characters"
    : true;
  return result;
};

const currBankList = ref([]);
const filteredBankList = ref([]);
const currentCardType = ref("Bank");
const bankList = [];
const cryptoList = [];
const ewalletList = [];

// validation
const isValidBank = () => {
  const { bankId } = bankCardField;

  const result = !bankId ? dialogDisplays.selectionError : true;
  return result;
};

const filterBank = (val, update) => {
  if (!val) {
    update(() => {
      filteredBankList.value = selectedMethodItem.value.bankList;
    });
    return;
  }
  update(() => {
    const result = selectedMethodItem.value.bankList.filter((bank) => {
      const bankName = bank.name.toLowerCase();
      const lowerCaseVal = val.toLowerCase();
      return bankName.includes(lowerCaseVal);
    });
    filteredBankList.value = result;
  });
};

const selectBankType = () => {
  currBankList.value = [];
  //bankCardField.bankId = undefined;

  if (currentCardType.value === "Bank") {
    currBankList.value = bankList;
    filteredBankList.value = currBankList.value;
  } else if (currentCardType.value === "Crypto") {
    currBankList.value = cryptoList;
    filteredBankList.value = currBankList.value;
  } else if (currentCardType.value === "EWallet") {
    currBankList.value = ewalletList;
    filteredBankList.value = currBankList.value;
  }
};

const isAddNewAccount = ref(false);

// withdrawalMethods[withdrawalDialogTab].withdrawMin
const toggleAmount = (type) => {
  const method = selectedMethodItem.value;

  switch (type) {
    case "min":
      withdrawInfo.amount = method.withdrawMin;
      break;
    case "25":
      withdrawInfo.amount = method.withdrawMaxAmount * 0.25;
      break;
    case "50":
      withdrawInfo.amount = method.withdrawMaxAmount * 0.5;
      break;
    case "max":
      withdrawInfo.amount = method.withdrawMaxAmount;
      break;
    default:
      break;
  }
};

const isInputFocus = ref(false);

const scrollToInput = () => {
  if (Platform.is.capacitor && Platform.is.android) {
    isInputFocus.value = true;
    nextTick(() => {
      const input = document.activeElement;
      if (input) {
        input.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    });
  }
};

// KYC Dialog
const personalState = reactive({
  memberInfo: {}
});
const userKYCDialog = ref(false);
const openUserKYCDialog = () => {
  userKYCDialog.value = true;
};
const closeUserKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    userKYCDialog.value = false;
  });
};

const loadInfo = () => {
  personalState.memberInfo = userStore();

  if (!store.guest && personalState.memberInfo.realName === null) {
    openUserKYCDialog();
  }
};
</script>

<style scoped lang="scss">
.withdrawal-modal-view {
  margin: auto;
  width: 95%;

  .withdraw-methods-currency {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .currency-item {
      padding: 8px 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      border: 2px solid #78798580;
      gap: 6px;
      border-radius: 8px;
      color: #ffffffb2;
      background-color: #263349;
      font-size: 12px;
      position: relative;

      &.active {
        border: 2px solid #5c46e7;
        .item-title {
          color: rgba(255, 255, 255, 1);
        }
        &:before {
          content: "";
          height: 20px;
          width: 20px;
          position: absolute;
          bottom: 0;
          right: 0;
          background-image: url(../../assets/images/account/active-tick.png);
          background-size: cover;
        }
      }

      img {
        display: block;
        width: 100%;
        max-width: 50px;
      }

      .item-hot-ribbon {
        position: absolute;
        top: 0;
        left: 0;

        img {
          display: block;
          width: 30px;
        }
      }
    }
  }

  .withdraw-methods-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    flex-direction: column;
    background-color: #161f2d;
    padding: 12px;
    border-radius: 6px;
  }

  .method-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    position: relative;

    .options-picker {
      display: flex;
      gap: 6px;
    }
  }

  .method-title {
    color: #576373;
  }

  .method-item {
    border-radius: 6px;
    background-color: #263349;
    padding: 6px 8px 6px 12px;
    display: flex;
    align-items: center;
    position: relative;
    border: 2px solid #78798580;

    &.disabled {
      cursor: not-allowed;
      backdrop-filter: grayscale(1) brightness(0.7);
      pointer-events: none;
      // opacity: 0.6;
    }

    &.active {
      border: 2px solid #5c46e7;
      .item-title {
        color: rgba(255, 255, 255, 1);
      }
      &:before {
        content: "";
        height: 20px;
        width: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url(../../assets/images/account/active-tick.png);
        background-size: cover;
      }
    }

    .item-icon {
      border-right: 1px solid #4b6185;
      padding-right: 8px;

      img {
        display: block;
        // width: 100%;
        width: 50px;
      }
    }

    .item-detail {
      padding: 6px 6px 6px 8px;
      .txt-title {
        font-size: 11px;
        color: #ffffff;
      }
      .txt-content {
        font-size: 10px;
        color: #576373;
        // white-space: nowrap;
        margin-top: 4px;
      }
      .txt-maintenance {
        color: #f4b975;
        font-size: 11px;
      }
    }
    .item-amount {
      font-size: 10px;
      padding: 6px;
    }
    .item-arrow {
      margin-left: auto;
      width: 30px;
      min-width: 30px;
      max-width: 30px;
    }
  }

  .withdrawal-summary {
    padding: 1rem;
    margin-top: 0;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 0.625rem;
    background: #1d2635;

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
      background: #2f3e57;
    }

    .title {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 700;
    }

    span {
      color: white;
    }
  }

  .bank-account-container {
    border-radius: 0.5rem;
    // background: rgba(21, 0, 37, 0.2);
    // background-color: #263349;
    padding: 1rem 0 0;
    margin-top: 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;

      .title {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.825rem;
        font-weight: 700;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      // background: rgba(21, 0, 37, 0.5);
      background-color: #263349;
      // margin: 0 -1rem 0.5rem -1rem;
      padding: 0 1rem;
      border-radius: 6px;
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin: 1rem 0 0.5rem 0;

      .bank-card-item {
        padding: 3px;
        // border-radius: 1.25rem;
        border-radius: 6px;
        // background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
        background-color: #5c46e7;
        position: relative;
        transition: 0.3s all;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;

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

    .bank-select-input {
      :deep(.q-field__append) {
        height: 60px;
      }
    }
  }

  .withdrawal-amount-container {
    border-radius: 0.5rem;
    // background: rgba(21, 0, 37, 0.2);
    padding: 1rem 0;
    margin-top: 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;

      &.btm-no-space {
        margin-bottom: 0;
      }

      .title {
        color: #637387;
        font-size: 0.825rem;
        font-weight: 600;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      background: #263349;
      border-radius: 0.5rem;
      margin: 0 0 0.5rem 0;
    }

    .minmax-btn {
      font-size: 10px;
      padding: 4px 8px;
      border-right: 1px solid #263349;

      &:last-child {
        border: 0;
      }
      // background: #101114;
    }

    .fund-container {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .fund-title {
        color: #576373;
      }
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      // gap: 10px;
      margin: 1rem 0 0.5rem 0;
      // background-color: rgba(74, 56, 185, 0.4);
      background-color: #263349;
      border-radius: 6px;
      padding: 6px;

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        // color: white;
        color: #a9a6bb;
        border-radius: 3.125rem;
        opacity: 0.8;
        // background: linear-gradient(90deg, #157f42 -1.25%, rgba(44, 97, 67, 0) 104.06%);
        padding: 5px 10px;

        .desc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .desc {
          font-size: 0.825rem;
          font-weight: 400;
          &_white {
            color: #ffffff;
          }
        }

        .remain-wager-wrapper {
          display: flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;

          .refresh-btn-img {
            width: 20px;
            height: 20px;

            &.rotate {
              animation: rotateTwice 1s infinite linear;
            }
          }
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
    font-weight: 600;
    height: 46px;
    width: 100%;
    transition: 0.3s all;
    color: #ffffff;
    margin: auto;
    border-radius: 6px;
    background: #5c46e7;
    aspect-ratio: 335/46;

    &:before {
      box-shadow: none;
    }

    &.disabled {
      opacity: 0.7;
    }
  }

  .bottom-tnc {
    font-size: 80%;
    opacity: 0.5;
  }
}

.dialog-input {
  background-color: #263349;
  border-radius: 6px;
}

.withdraw-tip-wrapper {
  background-color: rgba(21, 127, 66, 0.2);
  margin-top: 20px;
  border-radius: 10px;
  padding: 14px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.2px;
  letter-spacing: 0.045em;
  text-align: left;
  color: #a9a6bb;

  :deep(em) {
    color: #ffae00;
  }
}

.input-btm {
  padding-bottom: 270px;
}
</style>

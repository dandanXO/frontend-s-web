<template>
  <div class="withdrawal-modal-view">
    <template v-if="isSelectedMethod">
      <div class="method-options">
        <div class="method-title">Payment Method</div>
        <div class="options-picker" @click="resetSelectedMethod()">
          <div class="pick-title">{{ selectedMethodItem.nodeName }}</div>
          <q-icon name="arrow_drop_down" size="20px" />
        </div>
      </div>

      <div class="bank-account-container">
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
            >
              <!-- <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar v-if="scope.opt.bankIcon">
                    <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                  </q-item-section>
                  <q-item-section>
                  <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                    {{ scope.opt.name }}
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
                    {{ scope.opt.name }}
                  </q-item-label>
                </q-item-section>
              </template> -->
            </q-select>
          </div>
        </div>
      </div>

      <!-- bank options -->
      <div class="bank-account-container" v-if="bankCardList.length > 0 && !isAddNewAccount">
        <div class="method-title q-mt-sm">Choose Bank Account</div>
        <div class="mid-wrapper">
          <div class="w-form-item w-form-item--bankcard">
            <div class="w-form-input">
              <q-select
                ref="cardRef"
                filled
                dense
                clearable
                v-model="withdrawInfo.cardId"
                @update:model-value="onCardChanged"
                :options="bankCardList"
                option-value="id"
                emit-value
                map-options
                :rules="[(val) => !!val || 'Please Select A Bank Card']"
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
          <div class="bank-card-item" @click="isAddNewAccount = true">
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
              ></q-input>
            </div>
          </div>
          <div class="w-form-item w-form-item--bankcard">
            <div class="top-wrapper">
              <div class="title">Bank IFSC Code</div>
            </div>
            <div class="mid-wrapper">
              <q-input
                filled
                dense
                clearable
                ref="bankAddressRef"
                placeholder="Enter Bank IFSC Code"
                v-model="bankCardField.cardAddress"
                :rules="[(_) => isValidCardAddress()]"
                hide-bottom-space
              ></q-input>
            </div>
          </div>
        </template>

        <div class="top-wrapper">
          <!-- <div class="title">
            Withdrawal Amount ({{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMin) }} -
            {{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMax) }} NGN)
          </div> -->
          <div class="title">
            Withdrawal Amount ({{ convertToCommaAmount(selectedMethodItem.withdrawMin) }} -
            {{ convertToCommaAmount(selectedMethodItem.withdrawMax) }} NGN)
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
              (val) => val < selectedMethodItem.withdrawableBalance || `Withdraw Amount Insufficient`,
              (val) =>
                (val >= selectedMethodItem.withdrawMin && val <= selectedMethodItem.withdrawMax) ||
                `Withdraw Amount Must In Between ${selectedMethodItem.withdrawMin} - ${selectedMethodItem.withdrawMax}`
            ]"
            hide-bottom-space
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
                <q-btn class="minmax-btn" rounded color="black" label="25%" dense no-caps @click="toggleAmount('25')" />
                <q-btn class="minmax-btn" rounded color="black" label="50%" dense no-caps @click="toggleAmount('50')" />
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
            NGN {{ convertToCommaAmount(selectedMethodItem.withdrawableBalance) }}
          </div>
        </div>

        <div class="bot-wrapper">
          <div class="info">
            <div class="desc-wrapper">
              <div class="desc">Withdrew Amount</div>
            </div>
            <div class="desc desc_white">
              <!-- NGN:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawAmount) }} -->
              NGN: {{ selectedMethodItem.withdrawAmount }}
            </div>
          </div>
          <div class="info">
            <div class="desc-wrapper">
              <div class="desc">{{ store.vip }} Daily Limit</div>
            </div>
            <div class="desc desc_white">
              <!-- NGN:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount) }} -->
              NGN: {{ selectedMethodItem.withdrawMaxAmount }}
            </div>
          </div>
          <div class="info">
            <div class="desc-wrapper">
              <div class="desc">Remain Wagers</div>
            </div>
            <div class="desc desc_white">
              <!-- NGN:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].remainWagers) }} -->
              NGN: {{ selectedMethodItem.remainWagers }}
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

      <!-- <div class="bottom-tnc q-mt-md">
        Note: 2% + 50NGN of the withdrawal amount will be deducted as bank commission Please double check the withdrawal
        information, if withdrawal failed or you have any other questions, please contact CS 24/7
      </div> -->
    </template>

    <template v-else>
      <div class="method-title q-mb-md">Choose a payment method</div>
      <div class="withdraw-methods-container">
        <template v-for="(item, index) in paymentMethodsItems" :key="index">
          <div class="method-item" @click="goSelectedMethod(item)" :class="{ disabled: item.maintenance }">
            <div class="item-icon"><img :src="imgURL + '/payment/' + item.nodeIcon" /></div>

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
                <div class="txt-content">
                  ETA: {{ item.eta }}
                  <br />
                  Fee: {{ item.fee }}
                </div>
              </div>
            </template>

            <div class="item-amount" v-if="item.withdrawMin && item.withdrawMax">
              {{ item.withdrawMin }}~{{ item.withdrawMax }} NGN
            </div>

            <div class="item-arrow"><q-icon name="chevron_right" size="30px" color="grey" /></div>
          </div>
        </template>

        <!-- <div class="method-item">
          <div class="item-icon"><div style="background: teal; height: 50px; width: 50px"></div></div>
          <div class="item-detail">
            <div class="txt-title">Bank Transfer</div>
            <div class="txt-content">
              EAT: 4min
              <br />
              Fee: 2.25%+50.00NGN
            </div>
          </div>
          <div class="item-amount">257～1,000,000 NGN</div>
          <div class="item-arrow"><q-icon name="chevron_right" size="30px" color="grey" /></div>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onActivated, ref, reactive, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";

// withdraw component
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();

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

const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  let cbCount = 0;

  const checkCb = () => {
    if (cbCount === 2) isLoadingWithdrawalMethod.value = false;
  };

  api.get("/session/nga/withdraw/entrance").then((response) => {
    if (response.code === 0) {
      let bankWithdraws = response.data.withdraws;
      paymentMethodsItems.value = bankWithdraws.map((item) => item.children).flat();
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

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);

const isNoBankCard = ref(false);

const filterCards = (type) => {
  api
    .get("/session/bankCard")
    .then((res) => {
      if (res.code === 0) {
        let typeCode = type.code;
        let filteredData = res.data.filter((item) => item.bankCode === typeCode);

        bankCardList.value = [];
        bankCardList.value.push(...filteredData);

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
  withdrawCode: "",
  withdrawPlatformId: ""
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
  withdrawPlatformId: "",
  amount: ""
});

watch(
  () => bankCardField.bankId,
  (newValue) => {
    // console.log('..',newValue)
    const selectedBank = filteredBankList.value.find((bank) => bank.id === newValue);
    filterCards(selectedBank);

    // console.log('newValue',newValue);
    // console.log('selectedBank',selectedBank)
  }
);

// watch(
//   () => bankCardField.withdrawPlatformId,
//   (newValue) => {
//     const selectedBank = filteredBankList.value.find((bank) => bank.bankCode === newValue);
//     console.log("selectedBank", selectedBank);
//     filterCards(selectedBank);
//   }
// );

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
    // cardRef.value.validate();
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
  // isSubmitDisable.value = true;
  // if (bankCardList.value.length === 0) {
  amountRef.value.validate();
  bankAddressRef.value.validate();
  bankNumberRef.value.validate();

  if (amountRef.value.hasError || bankAddressRef.value.hasError || bankNumberRef.value.hasError) {
    $q.loading.hide();
    isSubmitDisable.value = false;
    return;
  }

  // bankCardField.cardNumber = withdrawReadOnlyInfo.cardNumber;
  // bankCardField.cardAddress = withdrawReadOnlyInfo.cardAddress;
  bankCardField.amount = withdrawInfo.amount;
  bankCardField.withdrawCode = selectedMethodItem.value.code;
  bankCardField.withdrawPlatformId = selectedMethodItem.value.withdrawId;

  api
    .post("/session/withdrawAndBankCard", qs.stringify(bankCardField))
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Withdrawal Submit Succeed",
          icon: "check_circle_outline"
        });
        // props.loadCards();
        refreshBalance();
        getWithdrawalMethods();

        emits("closeWithdraw");

        resetSelectedMethod();

        // bankCardField.cardNumber = "";
        // bankCardField.cardAddress = "";
        // bankCardField.withdrawCode = "";
        // bankCardField.withdrawPlatformId = "";
        // bankCardField.amount = "";

        // bankCardField.cardAddress = "";
        // bankCardField.cardNumber = "";
        // bankCardField.bankId = "";
        // withdrawInfo.cardId = "";
        withdrawInfo.amount = "";
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isSubmitDisable.value = false;
    });
  // }
  // } else {
  //   // cardRef.value.validate();
  //   amountRef.value.validate();

  //   $q.loading.show({
  //     message: "Withdrawing..."
  //   });

  //   // cardRef.value.hasError ||
  //   if (amountRef.value.hasError) {
  //     $q.loading.hide();
  //     isSubmitDisable.value = false;
  //   } else {
  //     withdrawGo(() => {
  //       isSubmitDisable.value = false;
  //     });
  //   }
  // }
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

        // isShowModal.value = false;
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
    router.push(`/deposit`);
  }
};

const isSelectedMethod = ref(false);

const resetSelectedMethod = () => {
  isSelectedMethod.value = false;
  isAddNewAccount.value = false;
};

const selectedMethodItem = ref();
const goSelectedMethod = (item) => {
  isSelectedMethod.value = true;
  selectedMethodItem.value = item;
  // withdrawInfo.withdrawCode = selectedMethodItem.value.code;

  // bankCardField.withdrawCode = selectedMethodItem.value.code;
  //   bankCardField.withdrawPlatformId = selectedMethodItem.value.withdrawId;

  // filterCards(item);

  // console.log(item);
  filteredBankList.value = item.bankList;
  bankCardField.bankId = item.bankList[0].id;
  // filterCards(item.bankList[0]);

  bankCardField.cardAccount = "";
  bankCardField.cardNumber = "";
  bankCardField.cardAddress = "";

  withdrawInfo.amount = "";
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
  const { cardNumber } = bankCardField;

  const result = !cardNumber ? "Please Enter Card Number" : true;
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

// const loadFilterBank = () => {
//   api
//     .get("/session/withdraw/card")
//     .then((res) => {
//       if (res.code === 0) {
//         res.data.forEach((e) => {
//           const bankType = e.bankType;
//           if (bankType === "BANK") bankList.push(e);
//           else if (bankType === "CRYPTO") cryptoList.push(e);
//           else if (bankType === "EWALLET") ewalletList.push(e);
//         });
//         selectBankType();
//         bankCardField.bankId = currBankList.value[0].id;
//       }
//     })
//     .catch((e) => {
//       console.log("error", e);
//     });
// };

const filterBank = (val, update) => {
  // if (currentCardType.value !== "Bank") return;
  if (!val) {
    update(() => {
      // filteredBankList.value = currBankList.value;
      filteredBankList.value = selectedMethodItem.value.bankList;
      // bankCardField.bankId = selectedMethodItem.value.bankList[0].id;
      // filterCards(item.bankList[0]);
      // filterCards(selectedMethodItem.value.bankList[0]);

      // if (selectedMethodItem.value.bankList.length > 0) {
      //   bankCardField.bankId = selectedMethodItem.value.bankList[0].id;
      //   filterCards(selectedMethodItem.value.bankList[0]);
      // }
    });
    return;
  }
  update(() => {
    const result = currBankList.value.filter((bank) => {
      const bankName = bank.name.toLowerCase();
      const lowerCaseVal = val.toLowerCase();
      return bankName.includes(lowerCaseVal);
    });
    filteredBankList.value = result;

    // console.log("result", result);
    // bankCardField.bankId = selectedMethodItem.value.bankList[0].id;
  });
};

const selectBankType = () => {
  currBankList.value = [];
  bankCardField.bankId = undefined;

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
</script>

<style scoped lang="scss">
.withdrawal-modal-view {
  margin: auto;
  width: 95%;

  .withdraw-methods-container {
    display: flex;
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

    &.disabled {
      cursor: not-allowed;
      backdrop-filter: grayscale(1) brightness(0.7);
      pointer-events: none;
      // opacity: 0.6;
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
        white-space: nowrap;
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
      background-color: rgba(74, 56, 185, 0.4);
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
</style>

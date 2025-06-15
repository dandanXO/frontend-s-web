<template>
  <!--  <AddBankCardModal ref="addBankCardModalRef" :loadCards="loadCards"></AddBankCardModal>-->

  <!--  <q-tabs-->
  <!--    v-model="withdrawalDialogTab"-->
  <!--    dense-->
  <!--    no-caps-->
  <!--    class="withdrawal-tab"-->
  <!--    indicator-color="transparent"-->
  <!--    align="justify"-->
  <!--  >-->
  <!--    <q-tab name="BANK" label="Bankcard" />-->
  <!--    &lt;!&ndash; <q-tab name="UPI" label="UPI" /> &ndash;&gt;-->
  <!--  </q-tabs>-->

  <!--  <q-tab-panels-->
  <!--    class="withdrawal-tab-panel"-->
  <!--    v-model="withdrawalDialogTab"-->
  <!--    animated-->
  <!--    transition-prev="fade"-->
  <!--    transition-next="fade"-->
  <!--  >-->
  <!--    <q-tab-panel name="BANK">-->
  <!--      <div class="withdrawal-table">-->
  <!--        <LoadingComponent v-if="isLoadingBankCard"></LoadingComponent>-->
  <!--        <div v-else-if="isNoBankCard" class="w-tbl-row">-->
  <!--          <div class="bank-card-item" @click="onAddCardClick()">-->
  <!--            <div class="bank-card-add">-->
  <!--              <div class="card-icon">-->
  <!--                <q-icon key="md" size="md" name="add" />-->
  <!--              </div>-->
  <!--              <div class="card-label">Add Bank Card</div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <template v-else>-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Cash Balance:</div>-->
  <!--            <div class="w-tbl-col">-->
  <!--              <span class="w-txt-red">{{ store.balance }}</span>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Withdrawable:</div>-->
  <!--            <div class="w-tbl-col">-->
  <!--              {{-->
  <!--                `${withdrawalMethods[withdrawalDialogTab].withdrawMin || 0} - ${-->
  <!--                  withdrawalMethods[withdrawalDialogTab].withdrawMax || 0-->
  <!--                }`-->
  <!--              }}-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Remaining Wager:</div>-->
  <!--            <div class="w-tbl-col">{{ withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount || 0 }}</div>-->
  <!--          </div>-->
  <!--        </template>-->
  <!--      </div>-->
  <!--    </q-tab-panel>-->
  <!--    &lt;!&ndash; <q-tab-panel name="UPI">-->
  <!--        <div class="withdrawal-table">-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Cash Balance:</div>-->
  <!--            <div class="w-tbl-col">-->
  <!--              <span class="w-txt-red">{{ store.balance }}</span>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Withdrawable:</div>-->
  <!--            <div class="w-tbl-col">-->
  <!--              {{-->
  <!--                `${withdrawalMethods[withdrawalDialogTab].withdrawMin} - ${withdrawalMethods[withdrawalDialogTab].withdrawMax}`-->
  <!--              }}-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="w-tbl-row">-->
  <!--            <div class="w-tbl-col">Remaining Wager:</div>-->
  <!--            <div class="w-tbl-col">{{ withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount }}</div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </q-tab-panel> &ndash;&gt;-->
  <!--  </q-tab-panels>-->

  <div class="withdrawal-form" v-if="withdrawalDialogTab === 'BANK'">
    <div class="w-form-item w-form-item--bankcard">
      <div class="w-form-label">Withdraw Amount</div>
      <div class="w-form-input">
        <q-input
          type="number"
          ref="amountRef"
          filled
          dense
          clearable
          placeholder="Enter Withdraw Amount"
          v-model="withdrawInfo.amount"
          :rules="[
            (val) => !!val || 'Please Enter Withdraw Amount',
            (val) => val > 0 || 'Withdraw Amount Must Be Greater Than 0',
            (val) =>
              (val >= withdrawalMethods[withdrawalDialogTab].withdrawMin &&
                val <= withdrawalMethods[withdrawalDialogTab].withdrawMax) ||
              `Withdraw Amount Must In Between ${withdrawalMethods[withdrawalDialogTab].withdrawMin} - ${withdrawalMethods[withdrawalDialogTab].withdrawMax}`
          ]"
          lazy-rules
          hide-bottom-space
        ></q-input>
      </div>
    </div>

    <div class="w-form-item w-form-item--bankcard" v-if="bankCardList.length > 0">
      <div class="w-form-label">Bank Card</div>
      <div class="w-form-input">
        <q-select
          ref="cardRef"
          filled
          dense
          clearable
          v-model="withdrawInfo.cardId"
          @update:model-value="onCardChanged"
          :label="`Select Bank Card`"
          :options="bankCardList"
          option-value="id"
          emit-value
          map-options
          :rules="[(val) => !!val || 'Please Select A Bank Card']"
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
                {{ scope.opt.bankName }} - {{ scope.opt.cardNumber }}
              </q-item-label>
            </q-item-section>
          </template>
        </q-select>
      </div>
    </div>

    <div class="w-form-item w-form-item--bankcard">
      <div class="w-form-label">Account Holder Name</div>
      <div class="w-form-input">
        <q-input
          filled
          dense
          clearable
          lazy-rules
          placeholder="Enter Account Holder Name"
          v-model="withdrawReadOnlyInfo.cardAccount"
          readonly
        ></q-input>
      </div>
    </div>
    <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
      <div class="w-form-label">Account Number</div>
      <div class="w-form-input">
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
        ></q-input>
      </div>
    </div>
    <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
      <div class="w-form-label">Bank IFSC Code</div>
      <div class="w-form-input">
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
        ></q-input>
      </div>
    </div>
  </div>

  <!--  <div class="withdrawal-form" v-if="withdrawalDialogTab === 'UPI'">-->
  <!--    <div class="w-form-item w-form-item&#45;&#45;UPI">-->
  <!--      <div class="w-form-label">Withdraw Amount</div>-->
  <!--      <div class="w-form-input">-->
  <!--        <q-input filled dense clearable placeholder="Enter Withdraw Amount"></q-input>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="w-form-item w-form-item&#45;&#45;UPI">-->
  <!--      <div class="w-form-label">VPA</div>-->
  <!--      <div class="w-form-input">-->
  <!--        <q-input filled dense clearable placeholder="Enter VPA"></q-input>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="btn-go" @click="submitWithdraw">Go</div>
  <div class="bottom-tnc">2% + 50{{ store.currency.label }} of the withdrawal amount would be deducted as bank commission</div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed, defineEmits } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import LoadingComponent from "./LoadingComponent.vue";
import AddBankCardModal from "./modal/AddBankCardModal.vue";

const qs = require("qs");
const $q = useQuasar();
const store = userStore();

const imgURL = process.env.IMAGE_CDN;

const refreshBalance = () => {
  if (store.token) store.getBalance();
};

const withdrawalDialogTab = ref("BANK");
const withdrawalMethods = reactive({ BANK: {}, UPI: {} });
const getWithdrawalMethods = () => {
  api.get("/session/withdraw/entrance").then((response) => {
    // debugger;
    if (response.code === 0) {
      for (let i = 0, l = response.data.length; i < l; i++) {
        const currentData = response.data[i];
        withdrawalMethods[currentData.code] = currentData;
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
      });
  }
};

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);
const isNoBankCard = computed(() => {
  return bankCardList.value.length === 0;
});
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
      // if (bankCardList.value.length === 0) isNoBankCard.value = true;
      isLoadingBankCard.value = false;
    });
};
const emits = defineEmits(["closeWithdraw"]);

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

const submitWithdraw = async () => {
  if (bankCardList.value.length === 0) {
    amountRef.value.validate();
    bankAddressRef.value.validate();
    bankNumberRef.value.validate();

    if (amountRef.value.hasError || bankAddressRef.value.hasError || bankNumberRef.value.hasError) {
      $q.loading.hide();
      return;
    }

    bankCardField.cardNumber = withdrawReadOnlyInfo.cardNumber;
    bankCardField.cardAddress = withdrawReadOnlyInfo.cardAddress;
    bankCardField.amount = withdrawInfo.amount;
    bankCardField.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;

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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  } else {
    // cardRef.value.validate();
    amountRef.value.validate();

    $q.loading.show({
      message: "Withdrawing..."
    });

    // cardRef.value.hasError ||
    if (amountRef.value.hasError) {
      $q.loading.hide();
    } else {
      await withdrawGo();
    }
  }
};

const withdrawGo = async () => {
  withdrawInfo.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;
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

        emits("closeWithdraw");
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
    });
};

const addBankCardModalRef = ref();
const onAddCardClick = () => {
  addBankCardModalRef.value.onAddCardClick();
};

onMounted(() => {
  refreshBalance();
  getWithdrawalMethods();
  loadCards();
});
</script>

<style lang="scss">
.withdrawal-tab {
  background-color: #896742;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;

  .q-tab__label {
    font-weight: 800;
  }

  .q-tab--active {
    color: #000000;
    background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
  }
}

.q-field--with-bottom {
  padding-bottom: 0px;
}

.q-field--error .q-field__bottom {
  color: #ff0000;
  padding-bottom: 5px;
}

.withdrawal-tab-panel {
  background: rgba(21, 0, 37, 0.3);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  .withdrawal-table {
    display: flex;
    gap: 10px;
    flex-direction: column;

    .w-tbl-row {
      display: flex;
      justify-content: space-between;
    }

    .w-tbl-col {
      font-weight: 700;

      &:nth-child(2) {
        font-size: 140%;
      }
    }

    .w-txt-red {
      color: #ff0000;
    }

    .bank-card-item {
      padding: 3px;
      border-radius: 1.25rem;
      position: relative;
      transition: 0.3s all;
      width: 100%;

      .bank-card-add {
        padding: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 1.25rem;
        backdrop-filter: blur(6px);

        .card-label {
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

    svg {
      width: 50px;
      height: 50px;
    }
  }
}

.withdrawal-form {
  margin-top: 20px;

  .w-form-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 12px;
    padding-top: 10px;
  }

  .w-form-input {
    background-color: rgba(21, 0, 37, 0.5);
    border-radius: 5px;
  }
}

.btn-go {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 180px;
  height: 60px;
  transition: 0.3s all;
  background-image: url(../assets/images/index/popout/btn-go.png);
  color: #ffffff;
  margin: auto;

  &:before {
    box-shadow: none;
  }
}

.bottom-tnc {
  font-size: 80%;
  text-align: center;
}
</style>

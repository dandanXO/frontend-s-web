<template>
  <q-dialog align-center v-model="isAddCardDialogOpen" width="500" ref="refBankCardModal" class="modal-container">
    <div class="bankcard-dialog">
      <q-btn rounded class="close-btn-div popout-close" v-close-popup>
        <q-icon name="close"></q-icon>
      </q-btn>

      <q-card>
        <DialogHeader :title="dialogDisplays.title"></DialogHeader>

        <q-card-section>
          <q-form>
            <!-- <div class="q-my-sm select-wrapper">
            <div class="input-title">Card Type</div>
            <q-select
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="currentCardType"
              label="Select A Card Type"
              lazy-rules
              :rules="[(val) => !!val || 'Please Select A Card Type']"
              label-color="secondary"
              :options="cardType"
              @update:model-value="selectBankType(opt)"
            />
          </div>-->

            <div class="q-my-sm" v-if="currentCardType === 'Bank' || currentCardType === 'EWallet'">
              <div class="input-title">{{ dialogDisplays.selectionTitle }}</div>
              <q-select
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.bankId"
                :label="dialogDisplays.selectionPlaceholder"
                :rules="[(_) => isValidBank()]"
                label-color="secondary"
                :options="currBankList"
                option-value="id"
                option-label="name"
                lazy-rules
                emit-value
                map-options
                @update:model-value="updateBankType"
              />
            </div>

            <div class="q-my-sm">
              <div class="input-title">Holder Name</div>
              <q-input
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardAccount"
                label="Enter Holder Name"
                lazy-rules
                :rules="[(_) => isValidCardAccount()]"
                label-color="secondary"
                disable
              />
            </div>

            <div class="q-my-sm">
              <div class="input-title">{{ accountTypeStr }}</div>
              <q-input
                :type="
                  currentCardType === 'Bank' || (selectedBankMethod && selectedBankMethod.code === 'GCASH')
                    ? 'number'
                    : 'text'
                "
                standout
                ref="refBankCardNum"
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardNumber"
                label="Enter Account Number"
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              />
            </div>

            <div class="q-my-sm" v-if="currentCardType === 'Bank'">
              <div class="input-title">BSB (Bank State Branch)</div>
              <q-input
                type="number"
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardAddress"
                label="Enter BSB"
                :rules="[(_) => isValidCardAddress()]"
                label-color="secondary"
              />
            </div>
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="Confirm"
          :confirmFunc="addCard"
          :isDisabled="
            !(
              // isValidBank() === true &&
              (isValidCardAccount() === true && isValidCardNumber() === true)
            ) || isDisableBtn
          "
        ></ConfirmButton>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import ConfirmButton from "../../atoms/ConfirmButton.vue";
import { useRouter } from "vue-router";

const props = defineProps(["loadCards"]);

const qs = require("qs");
const $q = useQuasar();
const store = userStore();

const refBankCardModal = ref();

// add card dialog
const cardType = ["Bank" /*, "Crypto", "EWallet"*/];
const currentCardType = ref("Bank");

const accountTypeStr = ref("");

const refBankCardNum = ref();

// display
const currBankList = ref([]);

// cache
const bankList = [];
const cryptoList = [];
const ewalletList = [];

const bankCardField = reactive({
  bankId: undefined,
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: ""
});
const router = useRouter();

const closeModal = () => {
  refBankCardModal.value.hide();
};

const selectedBankMethod = ref();
const updateBankType = (val) => {
  selectedBankMethod.value = currBankList.value.find((item) => item.id === val);
  console.log(selectedBankMethod.value);
  refBankCardNum.value.validate();
};

const isAddCardDialogOpen = ref(false);
const onAddCardClick = (type) => {
  // debugger;
  currentCardType.value = type;
  // alert(currentCardType.value);
  selectBankStr();

  store.getMemberInfo().then(() => {
    if (!store.realName || !store.phone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Please fill in your personal details",
        icon: "report_problem"
      });
      router.push("/account/profile");
    } else {
      isAddCardDialogOpen.value = true;

      // NOTE: fire once
      if (
        (currentCardType.value === "Bank" && bankList.length === 0) ||
        (currentCardType.value === "Crypto" && cryptoList.length === 0) ||
        (currentCardType.value === "EWallet" && ewalletList.length === 0)
      ) {
        api
          .get("/session/withdraw/card")
          .then((res) => {
            if (res.code === 0) {
              res.data.forEach((e) => {
                const bankType = e.bankType;
                if (bankType === "BANK") bankList.push(e);
                else if (bankType === "CRYPTO") cryptoList.push(e);
                else if (bankType === "EWALLET") ewalletList.push(e);
              });
              selectBankType();
              bankCardField.bankId = currBankList.value[0].id;
              selectedBankMethod.value = currBankList.value[0];
              console.log(selectedBankMethod.value);
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else {
        clearField();
        selectBankType();
        bankCardField.bankId = currBankList.value[0].id;
      }
    }
  });
};

const dialogDisplays = reactive({
  title: "Add Bank Account",
  selectionTitle: "Bank",
  selectionPlaceholder: "Select A Bank",
  selectionError: "Please Select A Bank"
});
const selectBankType = () => {
  currBankList.value = [];
  bankCardField.bankId = undefined;

  if (currentCardType.value === "Bank") {
    currBankList.value = bankList;
  } else if (currentCardType.value === "Crypto") {
    currBankList.value = cryptoList;
  } else if (currentCardType.value === "EWallet") {
    currBankList.value = ewalletList;
  }
  // console.log(currBankList.value);
};

const selectBankStr = () => {
  if (currentCardType.value === "Bank") {
    dialogDisplays.title = "Add Bank Account";
    dialogDisplays.selectionTitle = "Bank";
    dialogDisplays.selectionPlaceholder = "Select A Bank";
    dialogDisplays.selectionError = "Please Select A Bank";
    accountTypeStr.value = "Account Number";
  } else if (currentCardType.value === "Crypto") {
    dialogDisplays.title = "Add Crypto Wallet";
    dialogDisplays.selectionTitle = "Crypto";
    dialogDisplays.selectionPlaceholder = "Select Crypto";
    dialogDisplays.selectionError = "Please Select A Crypto";
    accountTypeStr.value = "Crypto Card Number";
  } else if (currentCardType.value === "EWallet") {
    dialogDisplays.title = "Add eWallet";
    dialogDisplays.selectionTitle = "eWallet";
    dialogDisplays.selectionPlaceholder = "Select eWallet";
    dialogDisplays.selectionError = "Please Select A eWallet";
    accountTypeStr.value = "eWallet Card Number";
  }
};

const clearField = () => {
  bankCardField.bankId = undefined;
  bankCardField.cardNumber = "";
  bankCardField.cardAccount = store.realName;
  bankCardField.cardAddress = "";
};

// validation
const isValidBank = () => {
  const { bankId } = bankCardField;

  const result = !bankId ? dialogDisplays.selectionError : true;
  return result;
};

const isDisableBtn = ref(false);

const isValidCardAccount = () => {
  const { cardAccount } = bankCardField;

  const result = !cardAccount
    ? "Please Enter Holder Name"
    : cardAccount.length < 2
    ? "Please Insert 2 or More Characters"
    : true;

  return result;
};

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;

  const result = !cardNumber
    ? "Please Enter Card Number"
    : !cardNumber.includes(".")
    ? true
    : "Account number must not contain a decimal point";

  if (
    cardNumber &&
    selectedBankMethod.value &&
    (selectedBankMethod.value.code === "GCASH" ||
      selectedBankMethod.value.code === "MAYAPAY" ||
      selectedBankMethod.value.code === "GRABPAY")
  ) {
    const gCashCheck =
      cardNumber.substring(0, 1) !== "0"
        ? `The ${selectedBankMethod.value.code} card number must start with '0'`
        : cardNumber.length !== 11
        ? `The ${selectedBankMethod.value.code} card number length should be 11`
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
    ? "Please Enter BSB (Bank State Branch)"
    : cardAddress.length !== 6
    ? "BSB (Bank State Branch) Must Be 6 Characters"
    : true;
  return result;
};

const addCard = () => {
  isDisableBtn.value = true;

  api
    .post("/session/bankCard", qs.stringify(bankCardField))
    .then((response) => {
      if (response.code === 0) {
        isAddCardDialogOpen.value = false;
        $q.notify({
          color: "positive",
          position: "top",
          message: "Add Succeed",
          icon: "check_circle_outline"
        });
        props.loadCards();
        isDisableBtn.value = false;
      }
    })
    .catch((error) => {
      console.log("error", error);
      isDisableBtn.value = false;
    });
};

defineExpose({
  onAddCardClick
});
</script>

<style lang="scss">
.modal-container {
  .q-dialog__inner {
    max-width: 500px;
    margin: 0 auto;
    //max-height: calc(100vh - 108px);
  }

  .close-btn-div {
    position: absolute;
    background: #cfcfcf;
    border-radius: 50%;
    color: #787878;
    padding: 8px;
    width: 40px;
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0px;
    right: 0;
    z-index: 10;
  }

  .input-title {
    color: #fff;

    font-family: Helvetica;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.25rem; /* 100% */
    text-transform: capitalize;
  }

  .dialog-input {
    border-radius: 1.25rem;
    min-height: 46px;

    :deep(.q-field__control) {
      min-height: 46px;
    }
    //background: rgba(21, 0, 37, 0.5);
  }

  .q-card {
    padding: 1.5rem;
    border-radius: 8px;
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    width: calc(100% - 16px);
  }

  .q-card__section {
    background: transparent;
  }

  .q-dialog__inner > div {
    overflow: hidden;
  }
}
</style>

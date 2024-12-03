<template>
  <q-dialog align-center v-model="isUpdateCardDialogOpen" width="500" ref="refBankCardModal" class="modal-container">
    <div class="bankcard-dialog">
      <q-btn rounded class="close-btn-div popout-close" v-close-popup>
        <q-icon name="close"></q-icon>
      </q-btn>

      <q-card>
        <DialogHeader :title="dialogDisplays.title"></DialogHeader>

        <q-card-section>
          <q-form>
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
              <div class="input-title">{{ dialogDisplays.accountNum }}</div>
              <q-input
                :type="currentCardType === 'Bank' || selectedBankCode === 'GCASH' ? 'number' : 'text'"
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardNumber"
                label="Enter Account Number"
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              />
            </div>

            <!--            <div class="q-my-sm" v-if="currentCardType === 'BANK'">-->
            <!--              <div class="input-title">IFSC Code</div>-->
            <!--              <q-input-->
            <!--                standout-->
            <!--                class="q-pb-xs dialog-input"-->
            <!--                hide-bottom-space-->
            <!--                filled-->
            <!--                v-model="bankCardField.cardAddress"-->
            <!--                label="Enter Bank IFSC Code"-->
            <!--                lazy-rules-->
            <!--                :rules="[(_) => isValidCardAddress()]"-->
            <!--                label-color="secondary"-->
            <!--              />-->
            <!--            </div>-->
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="Update"
          :confirmFunc="updateCard"
          :isDisabled="!(isValidCardAccount() === true && isValidCardNumber() === true) || isDisableBtn"
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
const currentCardType = ref("BANK");

const accountTypeStr = ref("");
const currBankList = ref([]);
// cache
const bankList = [];
const cryptoList = [];
const ewalletList = [];

const bankCardField = reactive({
  cardId: "",
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: ""
});
const router = useRouter();

const isUpdateCardDialogOpen = ref(false);
const selectedBankCode = ref();

const onUpdateCardClick = (bankCardDetails, type) => {
  currentCardType.value = type;

  if (currentCardType.value === "CRYPTO") {
    dialogDisplays.accountNum = "Crypto Card Number";
  } else if (currentCardType.value === "EWALLET") {
    dialogDisplays.accountNum = "eWallet Number";
  } else if (currentCardType.value === "BANK") {
    dialogDisplays.accountNum = "Account Number";
  }
  // debugger;

  bankCardField.cardAccount = bankCardDetails.cardAccount;
  bankCardField.cardNumber = bankCardDetails.cardNumber;
  bankCardField.cardAddress = bankCardDetails.cardAddress;
  bankCardField.cardId = bankCardDetails.id;

  selectedBankCode.value = bankCardDetails.bankCode;

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
      isUpdateCardDialogOpen.value = true;
    }
  });
};

const dialogDisplays = reactive({
  title: "Update Bank Card",
  accountNum: "Account Number"
});

// validation
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
    : "Account number must not contain a decimal point"

  if (
    cardNumber &&
    (selectedBankCode.value === "GCASH" ||
      selectedBankCode.value === "MAYAPAY" ||
      selectedBankCode.value === "GRABPAY")
  ) {
    const gCashCheck =
      cardNumber.substring(0, 1) !== "0"
        ? `The ${selectedBankCode.value} card number must start with '0'`
        : cardNumber.length !== 11
        ? `The ${selectedBankCode.value} card number length should be 11`
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

const updateCard = () => {
  isDisableBtn.value = true;

  api
    .post("/session/bankCard/update", qs.stringify(bankCardField))
    .then((response) => {
      if (response.code === 0) {
        isUpdateCardDialogOpen.value = false;
        $q.notify({
          color: "positive",
          position: "top",
          message: "Update Succeed",
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
  onUpdateCardClick
});
</script>

<style lang="scss">
.modal-container {
  .q-dialog__inner {
    max-width: 500px;
    margin: 0 auto;
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

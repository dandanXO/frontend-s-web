<template>
  <q-dialog align-center v-model="isAddCardDialogOpen" width="500" class="modal-container">
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
          </div>

          <div class="q-my-sm">
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
            />
          </div> -->

          <div class="q-my-sm">
            <div class="input-title">Holder Name</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardAccount"
              lazy-rules
              label-color="secondary"
              readonly
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">Account Number</div>
            <q-input
              type="number"
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardNumber"
              label="Enter Card Number"
              lazy-rules
              :rules="[(_) => isValidCardNumber()]"
              label-color="secondary"
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">IFSC Code</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardAddress"
              label="Enter Bank IFSC Code"
              lazy-rules
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
            (isValidCardAccount() === true && isValidCardNumber() === true && isValidCardAddress() === true)
          ) || isDisableBtn
        "
      ></ConfirmButton>
    </q-card>
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

// add card dialog
const cardType = ["Bank" /*, "Crypto", "EWallet"*/];
const currentCardType = ref("Bank");

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

const isAddCardDialogOpen = ref(false);
const onAddCardClick = () => {
  store.getMemberInfo().then(() => {
    if (!store.realName || !store.phone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Please fill in your personal details",
        icon: "report_problem"
      });
      router.push("/account");
    } else {
      isAddCardDialogOpen.value = true;

      // NOTE: fire once
      if (bankList.length === 0 && cryptoList.length === 0 && ewalletList.length === 0) {
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
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      } else {
        clearField();
        bankCardField.bankId = currBankList.value[0].id;
      }
    }
  });
};

const dialogDisplays = reactive({
  title: "Add Bank Card",
  selectionTitle: "Bank",
  selectionPlaceholder: "Select A Bank",
  selectionError: "Please Select A Bank"
});
const selectBankType = () => {
  currBankList.value = [];
  bankCardField.bankId = undefined;

  if (currentCardType.value === "Bank") {
    currBankList.value = bankList;
    dialogDisplays.title = "Add Bank Card";
    dialogDisplays.selectionTitle = "Bank";
    dialogDisplays.selectionPlaceholder = "Select A Bank";
    dialogDisplays.selectionError = "Please Select A Bank";
  } else if (currentCardType.value === "Crypto") {
    currBankList.value = cryptoList;
    dialogDisplays.title = "Add Crypto Wallet";
    dialogDisplays.selectionTitle = "Crypto";
    dialogDisplays.selectionPlaceholder = "Select Crypto";
    dialogDisplays.selectionError = "Please Select A Crypto";
  } else if (currentCardType.value === "EWallet") {
    currBankList.value = ewalletList;
    dialogDisplays.title = "Add A Virtual Currency";
    dialogDisplays.selectionTitle = "eWallet";
    dialogDisplays.selectionPlaceholder = "Select eWallet";
    dialogDisplays.selectionError = "Please Select A eWallet";
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

  const result = !cardAccount ? "Please Enter Card Account" : true;
  return result;
};

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
  .input-title {
    color: rgba(255, 255, 255, 0.5);
    font-family: Helvetica;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.25rem; /* 100% */
    text-transform: capitalize;
  }

  .dialog-input {
    border-radius: 1.25rem;
    background: rgba(21, 0, 37, 0.5);
  }

  .q-dialog__inner > div {
    padding: 1.5rem;
    border-radius: 3.5rem;
    background-image: url("../../assets/images/index/modal-bg.png");
    background-size: 100% 100%;
    background-color: transparent;
    width: 90%;
  }

  .q-card__section {
    background: transparent;
  }
}
</style>

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
                :options="filteredBankList"
                option-value="id"
                option-label="name"
                lazy-rules
                emit-value
                map-options
                use-input
                input-debounce="100"
                fill-input
                hide-selected
                @filter="filterBank"
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
                label="Enter Account Number"
                lazy-rules
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              />
            </div>

            <!-- <div class="q-my-sm">
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
            </div> -->
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="Update"
          :confirmFunc="updateCard"
          :isDisabled="
            !(isValidCardAccount() === true && isValidCardNumber() === true) ||
            isDisableBtn
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
const currBankList = ref([]);
const filteredBankList = ref([]);
const currentCardType = ref("Bank");

// cache
const bankList = [];
const cryptoList = [];
const ewalletList = [];

const bankCardField = reactive({
  bankId: "",
  cardId: "",
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: ""
});
const router = useRouter();

const isUpdateCardDialogOpen = ref(false);
const onUpdateCardClick = (bankCardDetails) => {
  bankCardField.cardAccount = bankCardDetails.cardAccount;
  bankCardField.cardNumber = bankCardDetails.cardNumber;
  bankCardField.cardAddress = bankCardDetails.cardAddress;
  bankCardField.cardId = bankCardDetails.id;

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
              // mapping bankId by bankCode
              const bank = currBankList.value.find(bank => bank.code === bankCardDetails.bankCode);
              if(!bank) return
              bankCardField.bankId = bank.id
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      }
    }
  });
};

const dialogDisplays = reactive({
  title: "Update Bank Card",
  selectionTitle: "Bank",
  selectionPlaceholder: "Select A Bank",
  selectionError: "Please Select A Bank"
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

  const result = !cardNumber ? "Please Enter Card Number" : true;
  return result;
};

const isValidBank = () => {
  const { bankId } = bankCardField;

  const result = !bankId ? dialogDisplays.selectionError : true;
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

const selectBankType = () => {
  currBankList.value = [];

  if (currentCardType.value === "Bank") {
    currBankList.value = bankList;
    filteredBankList.value = currBankList.value
    dialogDisplays.title = "Add Bank Account";
    dialogDisplays.selectionTitle = "Bank";
    dialogDisplays.selectionPlaceholder = "Select A Bank";
    dialogDisplays.selectionError = "Please Select A Bank";
  } else if (currentCardType.value === "Crypto") {
    currBankList.value = cryptoList;
    filteredBankList.value = currBankList.value
    dialogDisplays.title = "Add Crypto Wallet";
    dialogDisplays.selectionTitle = "Crypto";
    dialogDisplays.selectionPlaceholder = "Select Crypto";
    dialogDisplays.selectionError = "Please Select A Crypto";
  } else if (currentCardType.value === "EWallet") {
    currBankList.value = ewalletList;
    filteredBankList.value = currBankList.value
    dialogDisplays.title = "Add A Virtual Currency";
    dialogDisplays.selectionTitle = "eWallet";
    dialogDisplays.selectionPlaceholder = "Select eWallet";
    dialogDisplays.selectionError = "Please Select A eWallet";
  }
};

const filterBank = (val, update) => {
  if(currentCardType.value !== 'Bank') return

  if(!val) {
    update(() => {
      filteredBankList.value = currBankList.value
    })
    return
  }
  update(() => {
    const result = currBankList.value.filter(bank => {
      const bankName = bank.name.toLowerCase()
      const lowerCaseVal = val.toLowerCase()
      return bankName.includes(lowerCaseVal)
    })
    filteredBankList.value = result
  })
}

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

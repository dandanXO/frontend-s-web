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
                emit-value
                map-options
                @update:model-value="updateBankType"
              />
            </div>

            <!-- <div class="q-my-sm">
              <div class="input-title">{{ $t("form.holderName") }}</div>
              <q-input
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardAccount"
                :label="$t('form.holderName_placeholder')"
                :rules="[(_) => isValidCardAccount()]"
                label-color="secondary"
                disable
              />
            </div> -->

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
                :label="$t('form.accountNumber_placeholder')"
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              />
            </div>
          </q-form>
        </q-card-section>

        <ConfirmButton
          :label="$t('btn.confirm')"
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { t } from "@/boot/lang";
import ConfirmButton from "@/atoms/ConfirmButton.vue";
import { api } from "@/boot/axios";
import { userStore } from "@/stores/index";

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
  title: t("form.bank_title"),
  selectionTitle: t("form.bank_selectionTitle"),
  selectionPlaceholder: t("form.bank_select"),
  selectionError: t("form.bank_selectError")
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
};

const selectBankStr = () => {
  if (currentCardType.value === "Bank") {
    dialogDisplays.title = t("form.bank_title");
    dialogDisplays.selectionTitle = t("form.bank_selectionTitle");
    dialogDisplays.selectionPlaceholder = t("form.bank_select");
    dialogDisplays.selectionError = t("form.bank_selectError");
    accountTypeStr.value = t("form.bank_type");
  } else if (currentCardType.value === "Crypto") {
    dialogDisplays.title = t("form.crypto_title");
    dialogDisplays.selectionTitle = t("form.crypto_selectionTitle");
    dialogDisplays.selectionPlaceholder = t("form.crypto_select");
    dialogDisplays.selectionError = t("form.crypto_selectError");
    accountTypeStr.value = t("form.crypto_type");
  } else if (currentCardType.value === "EWallet") {
    dialogDisplays.title = t("form.ewallet_title");
    dialogDisplays.selectionTitle = t("form.ewallet_selectionTitle");
    dialogDisplays.selectionPlaceholder = t("form.ewallet_select");
    dialogDisplays.selectionError = t("form.ewallet_selectError");
    accountTypeStr.value = t("form.ewallet_type");
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
    ? t("form.holderName_rules_01")
    : cardAccount.length < 2
    ? t("form.holderName_rules_02")
    : true;
  return result;
};

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;

  // Check if cardNumber is missing
  if (!cardNumber) {
    return t("form.accountNumber_rules_01");
  }

  // Validate that cardNumber contains only 16 or 18 digits
  const isValidLength = /^[0-9]{16}$|^[0-9]{18}$/.test(cardNumber);
  if (!isValidLength) {
    return t("form.accountNumber_rules_04"); // Assume this is the correct error message
  }

  // Ensure cardNumber does not contain a period
  if (cardNumber.includes(".")) {
    return t("form.accountNumber_rules_03");
  }

  return true;
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
          message: t("notify.addSucceed"),
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

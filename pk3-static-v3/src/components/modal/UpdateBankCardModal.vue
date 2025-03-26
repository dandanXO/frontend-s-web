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
            <!-- <div class="q-my-sm">
              <div class="input-title">{{ $t("form.holderName") }}</div>
              <q-input
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardAccount"
                :label="$t('form.holderName_placeholder')"
                lazy-rules
                :rules="[(_) => isValidCardAccount()]"
                label-color="secondary"
                disable
              />
            </div> -->
            <div class="q-my-sm">
              <div class="input-title">{{ dialogDisplays.accountNum }}</div>
              <q-input
                :type="currentCardType === 'BANK' ? 'number' : 'text'"
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardNumber"
                :label="$t('form.accountNumber_placeholder')"
                lazy-rules
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              />
            </div>
          </q-form>
        </q-card-section>

        <ConfirmButton
          :label="$t('btn.update')"
          :confirmFunc="updateCard"
          :isDisabled="!(isValidCardAccount() === true && isValidCardNumber() === true) || isDisableBtn"
        ></ConfirmButton>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import ConfirmButton from "@/atoms/ConfirmButton.vue";
import { api } from "@/boot/axios";
import { t } from "@/boot/lang";
import { userStore } from "@/stores/index";
import { useQuasar } from "quasar";

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
    dialogDisplays.accountNum = t("form.accountNumber");
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
        message: t("notify.pleaseFillInPersonalDetails"),
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
    ? t("form.holderName_rules_01")
    : cardAccount.length < 2
    ? t("form.holderName_rules_02")
    : true;

  return result;
};

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;
  const result = !cardNumber
    ? t("form.accountNumber_rules_01")
    : !cardNumber.includes(".")
    ? true
    : t("form.accountNumber_rules_03")
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
          message: t("notify.updateSucceed"),
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

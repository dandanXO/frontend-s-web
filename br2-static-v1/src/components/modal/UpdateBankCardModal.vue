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
                :label="$t('form.phone_placeholder')"
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              >
                <template v-slot:prepend>
                  <img class="white-svg" src="../../assets/images/auth/phone.svg" />
                  <span class="prepend-number q-ml-sm">{{ $t("form.prependNumber") }}</span>
                </template>
              </q-input>
            </div>
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
import { t } from "src/boot/lang";

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
    dialogDisplays.accountNum = t("form.cryptoAccount");
  } else if (currentCardType.value === "EWALLET") {
    dialogDisplays.accountNum = t("form.eWalletNumber");
  } else if (currentCardType.value === "BANK") {
    dialogDisplays.accountNum = t("form.phone");
  }
  // debugger;

  bankCardField.cardAccount = bankCardDetails.cardAccount;
  // Remove +55 prefix if present
  let cardNumber = bankCardDetails.cardNumber;
  if (cardNumber.startsWith("+55")) {
    cardNumber = cardNumber.slice(3); // Remove '+55'
  }
  bankCardField.cardNumber = cardNumber;
  // bankCardField.cardNumber = bankCardDetails.cardNumber;
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
    ? t("form.holderName_rules_01")
    : cardAccount.length < 2
    ? t("form.holderName_rules_02")
    : true;

  return result;
};

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;
  const result = !cardNumber ? t("form.phone_rules_01") : true;

  // if (cardNumber.startsWith("0")) {
  //   return t("form.phone_rules_03");
  // }

  const digitCount = cardNumber.match(/\d/g)?.length || 0;
  if (digitCount < 8 || digitCount > 11) {
    return t("form.phone_rules_02");
  }

  if (!/^[0-9]*$/.test(cardNumber)) {
    return t("form.phone_rules_04");
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

  const formData = { ...bankCardField };

  if (!formData.cardNumber.startsWith("+55")) {
    formData.cardNumber = `+55${formData.cardNumber}`;
  }

  api
    .post("/session/bankCard/update", qs.stringify(formData))
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

const removePrefix = () => {
  if (bankCardField.cardNumber.startsWith("+55")) {
    bankCardField.cardNumber = bankCardField.cardNumber.slice(3);
  }
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
    border-radius: 50%;
    color: #fff;
    padding: 8px;
    width: 40px;
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 10px;
    right: 10px;
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
    // background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);
    width: 100%;
    height: max-content;
    max-height: 60vh;
    overflow: auto;
  }

  .q-card__section {
    background: transparent;
  }

  .q-dialog__inner > div {
    overflow: hidden;
  }
}
</style>

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
              />
            </div>
            <!-- <div class="q-my-sm">
              <div class="input-options">
                <div
                  v-for="option in options"
                  :key="option"
                  class="option-item"
                  :class="{ active: selectedOption === option }"
                  @click="selectOption(option)"
                >
                  {{ option.toUpperCase() }}
                </div>
              </div>
            </div> -->
            <div class="q-my-sm">
              <div class="input-title">{{ accountTypeStr }}</div>
              <!-- :type="['phone', 'cpf', 'cnpj'].includes(selectedOption) ? 'number' : 'text'" -->
              <q-input
                type="number"
                standout
                ref="refBankCardNum"
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardNumber"
                :placeholder="t('form.phone_placeholder')"
                :rules="[(_) => isValidCardNumber()]"
                label-color="secondary"
              >
                <template v-slot:prepend>
                  <!-- <template v-if="selectedOption === 'phone'"> -->
                  <img class="white-svg" src="../../assets/images/account/input-icon-phone-white.png" />
                  <span class="prepend-number q-ml-sm">{{ $t("form.prependNumber") }}</span>
                  <!-- </template> -->
                  <!-- <template v-if="selectedOption === 'email'">
                    <img class="white-svg" src="../../assets/images/account/input-icon-email-white.png" />
                  </template>
                  <template v-if="selectedOption === 'cpf'">
                    <img class="white-svg" src="../../assets/images/account/input-icon-cpf-white.png" />
                  </template>
                  <template v-if="selectedOption === 'cnpj'">
                    <img class="white-svg" src="../../assets/images/account/input-icon-cnpj-white.png" />
                  </template>
                  <template v-if="selectedOption === 'evp'">
                    <img class="white-svg" src="../../assets/images/account/input-icon-evp-white.png" />
                  </template> -->
                </template>
              </q-input>
            </div>

            <div class="q-my-sm">
              <div class="input-title">{{ $t("form.cpf") }}</div>
              <!-- :type="['phone', 'cpf', 'cnpj'].includes(selectedOption) ? 'number' : 'text'" -->
              <q-input
                type="number"
                standout
                ref="refBankCardAddress"
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.cardAddress"
                :placeholder="t('form.cpf_placeholder')"
                :rules="[(_) => isValidCardAddress()]"
                label-color="secondary"
              >
                <template v-slot:prepend>
                  <img class="white-svg" src="../../assets/images/account/input-icon-cpf-white.png" />
                </template>
              </q-input>
            </div>

            <div class="q-my-sm">
              <div class="input-title">{{ $t("form.email") }}</div>
              <!-- :type="['phone', 'cpf', 'cnpj'].includes(selectedOption) ? 'number' : 'text'" -->
              <q-input
                type="text"
                standout
                ref="refBankEmail"
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.email"
                :placeholder="t('form.email_placeholder')"
                :rules="[(_) => isValidEmail()]"
                label-color="secondary"
              >
                <template v-slot:prepend>
                  <img class="white-svg" src="../../assets/images/account/input-icon-email-white.png" />
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>
        <ConfirmButton
          :label="$t('btn.confirm')"
          :confirmFunc="addCard"
          :isDisabled="
            !(
              // isValidBank() === true &&
              (
                isValidCardAccount() === true &&
                isValidCardNumber() === true &&
                isValidCardAddress() === true &&
                isValidEmail() === true
              )
            ) || isDisableBtn
          "
        ></ConfirmButton>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
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

// add card dialog
const cardType = ["Bank" /*, "Crypto", "EWallet"*/];
const currentCardType = ref("Bank");

const accountTypeStr = ref("");

const refBankCardNum = ref();
const refBankCardAddress = ref();
const refBankCardEmail = ref();

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
  cardAddress: "",
  email: ""
});
const router = useRouter();

const closeModal = () => {
  refBankCardModal.value.hide();
};

const selectedBankMethod = ref();
const updateBankType = (val) => {
  selectedBankMethod.value = currBankList.value.find((item) => item.id === val);
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
        message: t("notify.fillInPersonalDetails"),
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
  title: t("form.addBankAccount"),
  selectionTitle: t("form.bank"),
  selectionPlaceholder: t("form.selectABank"),
  selectionError: t("form.pleaseSelectABank")
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
    dialogDisplays.title = t("form.addBankAccount");
    dialogDisplays.selectionTitle = t("form.bank");
    dialogDisplays.selectionPlaceholder = t("form.selectABank");
    dialogDisplays.selectionError = t("form.pleaseSelectABank");
    accountTypeStr.value = t("form.phone");
  } else if (currentCardType.value === "Crypto") {
    dialogDisplays.title = t("form.addCryptoWallet");
    dialogDisplays.selectionTitle = "Crypto";
    dialogDisplays.selectionPlaceholder = t("form.selectCrypto");
    dialogDisplays.selectionError = t("form.pleaseSelectACrypto");
    accountTypeStr.value = t("form.cryptoCardNumber");
  } else if (currentCardType.value === "EWallet") {
    dialogDisplays.title = t("form.addEWallet");
    dialogDisplays.selectionTitle = t("form.eWallet");
    dialogDisplays.selectionPlaceholder = t("form.selectEWallet");
    dialogDisplays.selectionError = t("form.pleaseSelectAEWallet");
    accountTypeStr.value = t("form.eWalletCardNumber");
  }
};

const clearField = () => {
  bankCardField.bankId = undefined;
  bankCardField.cardNumber = "";
  bankCardField.cardAccount = store.realName;
  bankCardField.cardAddress = "";
  bankCardField.email = "";
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
  let result = true;

  // if (selectedOption.value === "phone") {
  result = !cardNumber ? t("form.phone_rules_01") : true;
  if (cardNumber.startsWith("0")) {
    return t("form.phone_rules_03");
  }
  const digitCount = cardNumber.match(/\d/g)?.length || 0;
  if (digitCount !== 11) {
    return t("form.phone_rules_02");
  }
  // } else if (selectedOption.value === "email") {
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   result = emailPattern.test(cardNumber) ? true : t("form.email_rules_02");
  // } else if (selectedOption.value === "cpf") {
  //   const cpfPattern = /^\d{11}$/;
  //   result = cpfPattern.test(cardNumber) ? true : t("form.cpf_rules_02");
  // } else if (selectedOption.value === "cnpj") {
  //   const cnpjPattern = /^\d{14}$/;
  //   result = cnpjPattern.test(cardNumber) ? true : t("form.cnpj_rules_02");
  // } else if (selectedOption.value === "evp") {
  //   const evpPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  //   result = evpPattern.test(cardNumber) ? true : t("form.evp_rules_02");
  // }

  return result;
};

const isValidCardAddress = () => {
  const { cardAddress } = bankCardField;
  const result = !cardAddress ? t("form.cpf_rules_01") : cardAddress.length !== 11 ? t("form.cpf_rules_02") : true;
  return result;
};

const isValidEmail = () => {
  const { email } = bankCardField;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = !email ? t("form.email_rules_01") : !emailPattern.test(email) ? t("form.email_rules_02") : true;
  return result;
};

const addCard = () => {
  isDisableBtn.value = true;

  const formData = { ...bankCardField };

  // if (selectedOption.value === "phone") {
  if (!formData.cardNumber.startsWith("+55")) {
    formData.cardNumber = `+55${formData.cardNumber}`;
  }
  // }

  api
    .post("/session/bankCard", qs.stringify(formData))
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

const cardNumberPlaceholder = ref("");
const selectedOption = ref("phone");
const options = ["phone", "email", "cpf", "cnpj", "evp"];
const selectOption = (option) => {
  selectedOption.value = option;
  bankCardField.cardNumber = "";

  if (option === "phone") {
    accountTypeStr.value = t("form.phone");
    cardNumberPlaceholder.value = t("form.phone_placeholder");
  } else if (option === "email") {
    accountTypeStr.value = t("form.email");
    cardNumberPlaceholder.value = t("form.email_placeholder");
  } else if (option === "cpf") {
    accountTypeStr.value = t("form.cpf");
    cardNumberPlaceholder.value = t("form.cpf_placeholder");
  } else if (option === "cnpj") {
    accountTypeStr.value = t("form.cnpj");
    cardNumberPlaceholder.value = t("form.cnpj_placeholder");
  } else if (option === "evp") {
    accountTypeStr.value = t("form.evp");
    cardNumberPlaceholder.value = t("form.evp_placeholder");
  }
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

.input-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .option-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 6px;
    border-radius: 6px;
    text-align: center;
    font-size: 12px;
    background-color: #263349;
    border: 2px solid #263349;
    position: relative;

    &.active {
      border: 2px solid #ffffff;

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
  }
}
</style>

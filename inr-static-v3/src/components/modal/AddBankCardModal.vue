<template>
  <q-dialog align-center v-model="isAddCardDialogOpen" width="500" ref="refBankCardModal" class="modal-container">
    <div class="bankcard-dialog">
      <q-btn rounded class="close-btn-div popout-close" v-close-popup>
        <q-icon name="close"></q-icon>
      </q-btn>

      <!-- <pre>{{ bankCardField }}</pre> -->
      <!-- <pre>{{currBankList}}-currBankList</pre> -->

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
            <InputRowGrid>
              <template #fields>
                <InputField :label="'Holder Name'">
                  <template #input>
                    <q-input
                      class="q-pb-xs dialog-input"
                      hide-bottom-space
                      outlined
                      v-model="bankCardField.cardAccount"
                      label="Enter Holder Name"
                      lazy-rules
                      :rules="[(_) => isValidCardAccount()]"
                      label-color="brand"
                      color="white"
                    />
                  </template>
                </InputField>

                <InputField :label="'Account Number'">
                  <template #input>
                    <q-input
                      type="number"
                      class="q-pb-xs dialog-input"
                      hide-bottom-space
                      outlined
                      v-model="bankCardField.cardNumber"
                      label="Enter Account Number"
                      lazy-rules
                      :rules="[(_) => isValidCardNumber()]"
                      label-color="secondary"
                    />
                  </template>
                </InputField>

                <InputField :label="'IFSC Code'">
                  <template #input>
                    <q-input
                      class="q-pb-xs dialog-input"
                      hide-bottom-space
                      outlined
                      v-model="bankCardField.cardAddress"
                      label="Enter Bank IFSC Code"
                      lazy-rules
                      :rules="[(_) => isValidCardAddress()]"
                      label-color="secondary"
                    />
                  </template>
                </InputField>
              </template>
            </InputRowGrid>
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="CONFIRM"
          :confirmFunc="addCard"
          :isDisabled="
            !(
              // isValidBank() === true &&
              (isValidCardAccount() === true && isValidCardNumber() === true && isValidCardAddress() === true)
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
import InputField from "../auth/InputField.vue";
import InputRowGrid from "../auth/InputRowGrid.vue";

const props = defineProps(["loadCards"]);

const qs = require("qs");
const $q = useQuasar();
const store = userStore();

const refBankCardModal = ref();

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

const closeModal = () => {
  refBankCardModal.value.hide();
};

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
      router.push("/account/profile");
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
                if (bankType === "EWALLET") bankList.push(e);
                else if (bankType === "CRYPTO") cryptoList.push(e);
                else if (bankType === "BANK") ewalletList.push(e);
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
    dialogDisplays.title = "Add Bank Account";
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

  const result = !cardAccount
    ? "Please Enter Holder Name"
    : cardAccount.length < 2
    ? "Please Insert 2 or More Characters"
    : true;

  return result;
};

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;

  const result = !cardNumber ? "Please Enter Account Number" : true;
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
    background: #131313;
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

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
                      label-color="secondary"
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
          label="Update"
          :confirmFunc="updateCard"
          :isDisabled="
            !(isValidCardAccount() === true && isValidCardNumber() === true && isValidCardAddress() === true) ||
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
import InputRowGrid from "../auth/InputRowGrid.vue";
import InputField from "../auth/InputField.vue";

const props = defineProps(["loadCards"]);

const qs = require("qs");
const $q = useQuasar();
const store = userStore();

const refBankCardModal = ref();

const bankCardField = reactive({
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
    }
  });
};

const dialogDisplays = reactive({
  title: "Update Bank Card"
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
// .modal-container {
//   .q-dialog__inner {
//     max-width: 500px;
//     margin: 0 auto;
//   }

//   .close-btn-div {
//     position: absolute;
//     background: #cfcfcf;
//     border-radius: 50%;
//     color: #787878;
//     padding: 8px;
//     width: 40px;
//     height: 40px;
//     text-align: center;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     top: 0px;
//     right: 0;
//     z-index: 10;
//   }

//   .input-title {
//     color: #fff;

//     font-family: Helvetica;
//     font-size: 1rem;
//     font-style: normal;
//     font-weight: 700;
//     line-height: 2.25rem; /* 100% */
//     text-transform: capitalize;
//   }

//   .dialog-input {
//     border-radius: 1.25rem;
//     min-height: 46px;

//     :deep(.q-field__control) {
//       min-height: 46px;
//     }
//   }

//   .q-card {
//     padding: 1.5rem;
//     border-radius: 8px;
//     background: #19202D;
//     width: calc(100% - 16px);
//   }

//   .q-card__section {
//     background: transparent;
//   }

//   .q-dialog__inner > div {
//     overflow: hidden;
//   }
// }
</style>

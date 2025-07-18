<template>
  <q-page class="account-message-page">
    <!-- unbind dialog -->
    <q-dialog align-center v-model="isUnbindDialogOpen" width="500" class="modal-container">
      <q-card>
        <DialogHeader title="Are You Sure To Unbind?"></DialogHeader>

        <q-card-section>
          <q-form>
            <div class="input-title">Bank Account Number</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="unbindField.bankCardNumber"
              label="Bank Account Number"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please Enter Bank Account Number',
                (val) =>
                  (val && val == bankCardList[selectedBankIndex].cardNumber) ||
                  'Please Enter The Correct Account Number'
              ]"
              label-color="secondary"
            />
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="Confirm"
          :confirmFunc="unbind"
          :isDisabled="unbindField.bankCardNumber !== bankCardList[selectedBankIndex].cardNumber"
        ></ConfirmButton>
      </q-card>
    </q-dialog>

    <!-- add card dialog -->
    <AddBankCardModal ref="addBankCardModalRef" :loadCards="loadCards"></AddBankCardModal>

    <!-- add card dialog -->
    <UpdateBankCardModal ref="updateBankCardModalRef" :loadCards="loadCards"></UpdateBankCardModal>

    <div class="bank-card-container">
      <div
        v-for="(bc, bcIndex) in bankCardList"
        :key="bc.id"
        :class="`bank-card-item card-show`"
        @click="handleBankCardClick(bcIndex)"
      >
        <div class="bank-card-credentials">
          <div class="top">
            <div class="bank-name">{{ bc.bankName }}</div>
          </div>
          <div class="bottom">
            <div class="bank-card-num-wrapper">
              <div class="bank-card-num">{{ bc.cardNumber }}</div>
              <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(bc.cardNumber)" />
            </div>
            <div class="bank-card-address">IFSC: {{ bc.cardAddress }}</div>
          </div>

          <div class="card-update" @click.stop.prevent="onUpdateCardClick(bcIndex)">
            <q-icon size="sm" name="settings" />
          </div>
          <div class="card-unlink" @click.stop.prevent="onUnbindClick(bcIndex)">
            <q-icon size="sm" name="link_off" />
          </div>
        </div>
        <div class="bank-card-add" style="display: none">
          <!--
            <div class="card-icon">
              <img src="../../assets/images/account/bank-icon-bpi.png" alt="" />
            </div>
          -->
          <div class="card-label">{{ bc.bankName }}</div>
          <!--          <div class="card-label">{{ bc.bankName }}</div>-->
          <div class="card-num-wrapper">
            <div class="card-num">{{ bc.cardNumber }}</div>
            <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(bc.cardNumber)" />
          </div>
          <div class="card-num-wrapper">
            <div class="">IFSC: {{ bc.cardAddress }}</div>
          </div>
          <div class="card-update" @click.stop.prevent="onUpdateCardClick(bcIndex)">
            <q-icon size="sm" name="settings" />
          </div>
          <div class="card-unlink" @click.stop.prevent="onUnbindClick(bcIndex)">
            <q-icon size="sm" name="link_off" />
          </div>
        </div>
      </div>

      <div class="bank-card-item bank-addcard" @click="onAddCardClick()">
        <div class="bank-card-add">
          <div><img src="../../assets/images/account/icon-add.png" /></div>
          <!-- <div class="card-icon addcard-icon-div"> -->
          <!-- <q-icon class="add-card-icon" key="md" size="md" name="add" /> -->
          <!-- </div> -->
          <div class="card-label" style="margin-top: 10px">Add Bank Account</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from "vue";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import DialogHeader from "../../atoms//DialogHeader.vue";
import ConfirmButton from "../../atoms//ConfirmButton.vue";
import AddBankCardModal from "../../components/modal/AddBankCardModal.vue";
import UpdateBankCardModal from "../../components/modal/UpdateBankCardModal.vue";

const router = useRouter();
const store = userStore();
const $q = useQuasar();
const qs = require("qs");

let slideList = ref(["Bank", "Message", "Personal Center", "Discount", "Record", "Order"]);
let slideListPath = ref([
  "/account/bank",
  "/account/message",
  "/account",
  "/account/discount",
  "/account/record",
  "/account/order"
]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

let isCardShown = ref([]);
const handleBankCardClick = (index) => {
  if (!isCardShown.value[index]) isCardShown.value[index] = true;
  else isCardShown.value[index] = false;
};

const maskCardNumber = (cardNumber) => {
  return `*******${cardNumber.slice(-4)}`;
};

const copy = (val) => {
  copyToClipboard(val)
    .then(() => {
      $q.notify({
        color: "position",
        position: "top",
        message: `${val} copied to clipboard`,
        icon: "check_circle_outline"
      });
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed",
        icon: "report_problem"
      });
    });
};

// unbind dialog
const unbindField = reactive({ bankCardNumber: "" });
const isUnbindDialogOpen = ref(false);
const onUnbindClick = (index) => {
  unbindField.bankCardNumber = "";
  isUnbindDialogOpen.value = true;

  selectedBankIndex.value = index;
};

const unbind = () => {
  isUnbindDialogOpen.value = false;

  const selectedCardID = bankCardList.value[selectedBankIndex.value].id;
  api.post(`/session/bankCard/${selectedCardID}?_method=delete`).then((response) => {
    if (response.code === 0) {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Unbind succeed",
        icon: "check_circle_outline"
      });
      loadCards();
    }
  });
};

const selectedBankIndex = ref();

const addBankCardModalRef = ref();
const updateBankCardModalRef = ref();
const onAddCardClick = () => {
  addBankCardModalRef.value.onAddCardClick();
};
const onUpdateCardClick = (bcIndex) => {
  updateBankCardModalRef.value.onUpdateCardClick(bankCardList.value[bcIndex]);
};

// init
const bankCardList = ref([]);
const loadCards = () => {
  api
    .get("/session/bankCard")
    .then((res) => {
      if (res.code === 0) {
        bankCardList.value = [];
        bankCardList.value.push(...res.data);
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onActivated(() => {
  loadCards();
});
</script>

<style lang="scss">
.bank-card-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  .bank-card-item {
    padding: 3px;
    border-radius: 1.25rem;
    position: relative;
    transition: 0.3s all;

    &.card-unshow {
      // margin-bottom: -3.5rem;
      // border: 1px solid rgba(18, 0, 27, 0.1);
      // background: linear-gradient(180deg, #702fad 0%, #491960 100%), linear-gradient(180deg, #a95cec 0%, #795069 100%);
      // border-left-width: 2px;
      background: url(../../assets/images/account/bank-card-bg.png) no-repeat center center;
      background-size: 100% 100%;

      .bank-card-add {
        display: flex;
        flex-direction: row;
        height: auto;
        padding: 1rem 0 4rem;

        .card-update,
        .card-unlink {
          display: none;
        }

        .card-num-wrapper {
          display: none;
        }

        .card-icon {
          position: absolute;
          left: 1rem;
          height: 21px;

          img {
            display: block;
            width: 100%;
          }
        }
      }
    }

    &.card-show {
      // margin-bottom: -2rem;
      // border: 2px solid #a73dff;
      // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      background: url(../../assets/images/account/bank-card-bg.png) no-repeat center center;
      background-size: 100% 100%;

      .bank-card-credentials {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 200px;
        padding: 30px 20px 20px;

        .bottom {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .bank-card-num-wrapper {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }

      .bank-card-add {
        gap: 0.5rem;
      }

      .card-update,
      .card-unlink {
        position: absolute;
        top: 10px;
        color: white;
      }

      .card-update {
        left: 20px;
      }

      .card-unlink {
        right: 20px;
      }

      .card-num-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        gap: 0.5rem;

        .card-num {
          font-size: 1.1rem;
          word-break: break-all;
        }
      }
    }

    &.bank-addcard {
      // border: 1px solid #a73dff;
      // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      background: #2e30344f;

      &:active {
        opacity: 0.9;
        filter: brightness(0.9);
      }
    }

    .bank-card-add {
      padding: 10px;
      width: 100%;
      height: 15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 1.25rem;

      .card-label {
        font-weight: 700;
      }

      .card-icon {
        width: 50px;
        margin-bottom: 0.25rem;
        display: flex;
        justify-content: center;
      }
    }

    .addcard-icon-div {
      background: #ffffff;
      border-radius: 50%;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;

      .add-card-icon {
        font-size: 20px;
        width: 26px;

        font-weight: bold;
        color: #a735ff;
      }
    }
  }
}

.modal-container {
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
    // border-radius: 8px;
    // background: #ffffff26;
    // color: #ffffff90;
  }

  .q-dialog__inner > .q-card {
    padding: 2.4rem 1.5rem;
    border-radius: 12px;
    // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    //background-image: url("../../assets/images/index/modal-bg.png");
    background-size: 100% 100%;
    width: 90%;
  }

  .q-card__section {
    background: transparent;
  }
}
</style>

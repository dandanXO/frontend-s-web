<template>
  <!-- unbind dialog -->
  <q-dialog align-center v-model="isUnbindDialogOpen" width="500" class="modal-container">
    <q-card>
      <DialogHeader title="Are You Sure To Unbind?"></DialogHeader>

      <q-card-section>
        <q-form>
          <div class="input-title">Bank Card Number</div>
          <q-input
            standout
            class="q-pb-xs dialog-input"
            hide-bottom-space
            filled
            v-model="unbindField.bankCardNumber"
            label="Bank Card Number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please Enter Bank Card Number',
              (val) =>
                (val && val == bankCardList[selectedBankIndex].cardNumber) || 'Please Enter The Correct Card Number'
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

  <ProfileSummary></ProfileSummary>

  <SwiperNav :slideList="slideList" :slideListPath="slideListPath" :isActiveSlide="isActiveSlide"></SwiperNav>

  <!-- bank card -->
  <ContentView contentTopStatus="solid">
    <div class="bank-card-container">
      <div
        v-for="(bc, bcIndex) in bankCardList"
        :key="bc.id"
        :class="`bank-card-item ${isCardShown[bcIndex] ? 'card-show' : 'card-unshow'}`"
        @click="handleBankCardClick(bcIndex)"
      >
        <div class="bank-card-add">
          <div class="card-icon">
            <img src="../../assets/images/account/bank-icon-bpi.png" alt="" />
          </div>
          <div class="card-label">{{ bc.bankName }}</div>
          <div class="card-num-wrapper">
            <div class="card-num">{{ maskCardNumber(bc.cardNumber) }}</div>
            <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(bc.cardNumber)" />
          </div>
          <div class="card-unlink" @click.stop.prevent="onUnbindClick(bcIndex)">
            <q-icon size="sm" name="link_off" />
          </div>
        </div>
      </div>

      <div class="bank-card-item" @click="onAddCardClick()">
        <div class="bank-card-add">
          <div class="card-icon">
            <q-icon key="md" size="md" name="add" />
          </div>
          <div class="card-label">Add Card</div>
        </div>
      </div>
    </div>
  </ContentView>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import SwiperNav from "../../components/SwiperNav.vue";
import ContentView from "../../components/ContentView.vue";
import DialogHeader from "../../atoms//DialogHeader.vue";
import ConfirmButton from "../../atoms//ConfirmButton.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
import AddBankCardModal from "../../components/modal/AddBankCardModal.vue";

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
        message: `${maskCardNumber(val)} copied to clipboard`,
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
const onAddCardClick = () => {
  addBankCardModalRef.value.onAddCardClick();
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

onMounted(() => {
  loadCards();
});
</script>

<style lang="scss">
.bank-card-container {
  padding: 0 1rem;
  .bank-card-item {
    background: linear-gradient(90deg, #ffffff 0%, #703c98 100%);
    padding: 3px;
    border-radius: 1.25rem;
    position: relative;
    transition: 0.3s all;

    &.card-unshow {
      margin-bottom: -3.5rem;

      .bank-card-add {
        display: flex;
        flex-direction: row;
        height: auto;
        padding: 1rem 0 4rem;

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
      margin-bottom: -2rem;

      .bank-card-add {
        gap: 0.5rem;
      }

      .card-unlink {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: black;
      }

      .card-num-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        gap: 0.5rem;

        .card-num {
          word-break: break-all;
        }
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
      background: linear-gradient(180deg, #702fad 0%, #491960 100%);
      backdrop-filter: blur(6px);

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
  }
}

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

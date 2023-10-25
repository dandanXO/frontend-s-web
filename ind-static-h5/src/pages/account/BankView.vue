<template>
  <!-- unbind dialog -->
  <q-dialog align-center v-model="isUnbindDialogOpen" width="500" class="modal-container">
    <q-card>
      <DialogHeader title="Are You Sure To Unbind?"></DialogHeader>

      <q-card-section>
        <q-form>
          <div class="input-title">Bank Card Number</div>
          <q-input
            type="number"
            standout
            class="q-pb-xs dialog-input"
            hide-bottom-space
            filled
            v-model="unbindField.bankCardNumber"
            label="Bank Card Number"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please Enter Bank Card Number']"
            label-color="secondary"
          />
        </q-form>
      </q-card-section>

      <ConfirmButton label="Confirm" :confirmFunc="unbind"></ConfirmButton>
    </q-card>
  </q-dialog>

  <!-- add card dialog -->
  <q-dialog align-center v-model="isAddCardDialogOpen" width="500" class="modal-container">
    <q-card>
      <DialogHeader :title="dialogDisplays.title"></DialogHeader>

      <q-card-section>
        <q-form>
          <div class="q-my-sm select-wrapper">
            <div class="input-title">Card Type</div>
            <q-select
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="currentCardType"
              label="Select A Card Type"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please Select A Card Type']"
              label-color="secondary"
              :options="cardType"
              @update:model-value="selectBankType(opt)"
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">{{ dialogDisplays.selectionTitle }}</div>
            <q-select
              type="number"
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.bankId"
              :label="dialogDisplays.selectionPlaceholder"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please Select A Bank']"
              label-color="secondary"
              :options="currBankList"
              option-value="id"
              option-label="name"
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">Card Account</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardAccount"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please Enter Card Account']"
              label-color="secondary"
              readonly
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">Card Number</div>
            <q-input
              type="number"
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardNumber"
              label="Enter Card Number"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please Enter Card Number']"
              label-color="secondary"
            />
          </div>

          <div class="q-my-sm">
            <div class="input-title">Address</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="bankCardField.cardAddress"
              label="Enter Bank Ifsc Code"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please Enter Bank Ifsc Code']"
              label-color="secondary"
            />
          </div>
        </q-form>
      </q-card-section>

      <ConfirmButton label="Confirm" :confirmFunc="addCard"></ConfirmButton>
    </q-card>
  </q-dialog>

  <ProfileSummary></ProfileSummary>

  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <!-- bank card -->
  <ContentView contentTopStatus="solid">
    <div class="bank-card-container">
      <div
        v-for="(bc, bcIndex) in personalState.bankCardList"
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
            <div class="card-num">{{ bc.cardNumber }}</div>
            <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(bc.cardNumber)" />
          </div>
          <div class="card-unlink" @click.stop.prevent="onUnbindClick()">
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
import moment from "moment";
import SwiperNav from "../../components/SwiperNav.vue";
import ContentView from "../../components/ContentView.vue";
import DialogHeader from "../../atoms//DialogHeader.vue";
import ConfirmButton from "../../atoms//ConfirmButton.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";

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

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;
  router.push(slideListPath.value[i]);
  currentSlide.value = e;
};

let isCardShown = ref([]);
const handleBankCardClick = (index) => {
  if (!isCardShown.value[index]) isCardShown.value[index] = true;
  else isCardShown.value[index] = false;
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
const unbindField = ref({ bankCardNumber: "" });

const isUnbindDialogOpen = ref(false);

const onUnbindClick = () => {
  isUnbindDialogOpen.value = true;
};

const unbind = () => {
  isUnbindDialogOpen.value = false;

  const card = unbindField.value.bankCardNumber;
  api.post(`/session/bankCard/${card}?_method=delete`).then((response) => {
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

// add card dialog
const cardType = ["Bank", "Crypto", "EWallet"];
const currentCardType = ref("Bank");
// use to display
const currBankList = ref([]);

// use to cache
const bankList = [];
const cryptoList = [];
const ewalletList = [];

const bankCardField = ref({
  bankId: undefined,
  cardAccount: "",
  cardNumber: "",
  cardAddress: "",
  telephone: "",
  smsCode: "",
  smsCodeId: ""
});

const isAddCardDialogOpen = ref(false);
const onAddCardClick = () => {
  store.getMemberInfo().then(() => {
    if (
      !store.realName ||
      store.realName == "" ||
      store.realName == null ||
      !store.phone ||
      store.phone == "" ||
      store.phone == null
    ) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Please fill in your personal details",
        icon: "report_problem"
      });
      router.push("/account?personal");
    } else {
      isAddCardDialogOpen.value = true;

      bankCardField.value.bankId = undefined;
      bankCardField.value.cardNumber = "";
      bankCardField.value.cardAccount = store.realName;
      bankCardField.value.cardAddress = "";
      bankCardField.value.telephone = store.phone;
      bankCardField.value.smsCodeId = "";
      bankCardField.value.smsCode = "";

      if (bankList.length === 0 || cryptoList.length === 0 || ewalletList.length === 0) {
        api
          .get("/session/withdraw/card")
          .then((res) => {
            if (res.code === 0) {
              res.data.forEach((e) => {
                const bankType = e.bankType;
                if (bankType === "BANK") bankList.push(e);
                else if (bankType === "CRYPTO") cryptoList.push(e);
                else if (bankType === "EWallet") ewalletList.push(e);
              });
              selectBankType();
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
  title: "Add Bank Card",
  selectionTitle: "Bank",
  selectionPlaceholder: "Select A Bank",
  selectionError: "Please Select A Bank"
});
const selectBankType = () => {
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

const addCard = () => {
  api
    .post("/session/bankCard", qs.stringify(bankCardField.value))
    .then((response) => {
      if (response.code === 0) {
        isAddCardDialogOpen.value = false;
        $q.notify({
          color: "positive",
          position: "top",
          message: "Add Succeed",
          icon: "check_circle_outline"
        });
        loadCards();
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// api
const personalState = reactive({
  memberInfo: {},
  bankCardList: []
});

const loadCards = () => {
  personalState.bankCardList = [];

  api
    .get("/session/bankCard")
    .then((res) => {
      if (res.code === 0) personalState.bankCardList.push(...res.data);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  api
    .get("session/member")
    .then((response) => {
      if (response.code === 0) {
        personalState.memberInfo = response.data;

        if (personalState.memberInfo.birthday > 0) {
          personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
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

  .select-wrapper {
    .q-item--active {
      color: red;
    }
  }

  .q-dialog__inner > div {
    padding: 1.5rem;
    border-radius: 2rem;
    background: url("../../assets/images/index/modal-bg.png");
    width: 90%;
  }

  .q-card__section {
    background: transparent;
  }
}

.q-item--active {
  color: #fdd835;
}
</style>

<template>
  <q-page class="account-message-page">
    <div class="bank-add-lists">
      <div class="bank-card-add" @click="onAddCardClick()">
        <q-icon name="add" size="20px" />
        <div class="card-label">Add Bank</div>
      </div>
      <div class="bank-card-add" @click="onAddUSDTClick()">
        <q-icon name="add" size="20px" />
        <div class="card-label">Add eWallet</div>
      </div>
    </div>

    <!-- unbind dialog -->
    <q-dialog align-center v-model="isUnbindDialogOpen" width="500" class="modal-container">
      <q-card>
        <DialogHeader title="Are You Sure To Unbind?"></DialogHeader>

        <q-card-section>
          <q-form>
            <div class="input-title">Account Number</div>
            <q-input
              standout
              class="q-pb-xs dialog-input"
              hide-bottom-space
              filled
              v-model="unbindField.bankCardNumber"
              label="Enter Account Number"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please Enter Account Number',
                (val) => (val && val === selectedUnbindCardNum) || 'Please Enter The Correct Account Number'
              ]"
              label-color="secondary"
            />
          </q-form>
        </q-card-section>

        <ConfirmButton
          label="Confirm"
          :confirmFunc="unbind"
          :isDisabled="unbindField.bankCardNumber !== selectedUnbindCardNum"
        ></ConfirmButton>
      </q-card>
    </q-dialog>

    <!-- add card dialog -->
    <AddBankCardModal ref="addBankCardModalRef" :loadCards="loadCards"></AddBankCardModal>

    <!-- add card dialog -->
    <UpdateBankCardModal ref="updateBankCardModalRef" :loadCards="loadCards"></UpdateBankCardModal>

    <div class="bank-card-container">
      <!-- Bank Section -->
      <q-list class="list-cat-item" v-if="bankCardList.some((item) => item.bankType === 'BANK')">
        <q-expansion-item expand-separator label="Bank" default-opened>
          <div
            v-for="(item, index) in bankCardList.filter((item) => item.bankType === 'BANK')"
            :key="index"
            class="list-item"
          >
            <div class="item-top">
              <div class="item-icon">
                <img :src="imgURL + item.bankIcon" alt="Bank Icon" style="width: 30px" />
              </div>
              <div class="item-title">{{ item.bankName }}</div>
              <div class="item-bind" @click.stop.prevent="onUnbindClick(item.cardNumber, item.id)">
                <div class="card-unlink">
                  <q-icon size="sm" name="link_off" />
                </div>
              </div>
            </div>
            <div class="item-content">
              <div class="item-acc">
                Account: {{ item.cardNumber }}
                <!--                <br />-->
                <!--                IFSC: {{ item.cardAddress }}-->
              </div>
              <div class="item-copy">
                <div class="copy-update" @click.stop.prevent="onUpdateCardClick(item, item.bankType)">
                  <q-icon size="sm" name="settings" />
                </div>
                <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(item.cardNumber)" />
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-list>

      <!-- Crypto Section -->
      <q-list class="list-cat-item" v-if="bankCardList.some((item) => item.bankType === 'CRYPTO')">
        <q-expansion-item expand-separator label="Crypto" default-opened>
          <div
            v-for="(item, index) in bankCardList.filter((item) => item.bankType === 'CRYPTO')"
            :key="index"
            class="list-item"
          >
            <div class="item-top">
              <div class="item-icon">
                <img :src="imgURL + item.bankIcon" alt="Crypto Icon" style="width: 30px" />
              </div>
              <div class="item-title">{{ item.bankName }}</div>
              <div class="item-bind" @click.stop.prevent="onUnbindClick(item.cardNumber, item.id)">
                <div class="card-unlink">
                  <q-icon size="sm" name="link_off" />
                </div>
              </div>
            </div>
            <div class="item-content">
              <div class="item-acc">Account: {{ item.cardNumber }}</div>
              <div class="item-copy">
                <div class="copy-update" @click.stop.prevent="onUpdateCardClick(item, item.bankType)">
                  <q-icon size="sm" name="settings" />
                </div>
                <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(item.cardNumber)" />
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-list>

      <!-- EWALLET Section -->
      <q-list class="list-cat-item" v-if="bankCardList.some((item) => item.bankType === 'EWALLET')">
        <q-expansion-item expand-separator label="eWallet" default-opened>
          <div
            v-for="(item, index) in bankCardList.filter((car) => car.bankType === 'EWALLET')"
            :key="index"
            class="list-item"
          >
            <div class="item-top">
              <div class="item-icon">
                <img :src="imgURL + item.bankIcon" alt="Crypto Icon" style="width: 30px" />
              </div>
              <div class="item-title">{{ item.bankName }}</div>
              <div class="item-bind" @click.stop.prevent="onUnbindClick(item.cardNumber, item.id)">
                <div class="card-unlink">
                  <q-icon size="sm" name="link_off" />
                </div>
              </div>
            </div>
            <div class="item-content">
              <div class="item-acc">Account: {{ item.cardNumber }}</div>
              <div class="item-copy">
                <div class="copy-update" @click.stop.prevent="onUpdateCardClick(item, item.bankType)">
                  <q-icon size="sm" name="settings" />
                </div>
                <q-icon size="xs" name="content_copy" @click.stop.prevent="copy(item.cardNumber)" />
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from "vue";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import SwiperNav from "../../components/SwiperNav.vue";
import DialogHeader from "../../atoms//DialogHeader.vue";
import ConfirmButton from "../../atoms//ConfirmButton.vue";
import ProfileSummary from "../../components/ProfileSummary.vue";
import AddBankCardModal from "../../components/modal/AddBankCardModal.vue";
import UpdateBankCardModal from "../../components/modal/UpdateBankCardModal.vue";

const router = useRouter();
const store = userStore();
const $q = useQuasar();
const qs = require("qs");
const imgURL = process.env.IMAGE_CDN + "/payment/";

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
const onUnbindClick = (cardNumber, cardId) => {
  unbindField.bankCardNumber = "";
  isUnbindDialogOpen.value = true;

  selectedBankIndex.value = cardId;
  selectedUnbindCardNum.value = cardNumber;
};

const unbind = () => {
  isUnbindDialogOpen.value = false;

  const selectedCardID = selectedBankIndex.value;
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
const selectedUnbindCardNum = ref("");

const addBankCardModalRef = ref();
const updateBankCardModalRef = ref();
const onAddCardClick = () => {
  addBankCardModalRef.value.onAddCardClick("Bank");
};
const onAddUSDTClick = () => {
  addBankCardModalRef.value.onAddCardClick("EWallet");
};
const onUpdateCardClick = (bankCard, bankType) => {
  updateBankCardModalRef.value.onUpdateCardClick(bankCard, bankType);
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

        if (bankCardList.value.length > 0) {
          isCardShown.value[bankCardList.value.length - 1] = true;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// let bankCardList = reactive({ BANK: [], CRYPTO: [], EWALLET: [], ALIPAY: [] });
// const loadCards = () => {
//   api
//     .get("/session/allBankCard")
//     .then((res) => {
//       if (res.code === 0) {
//         // Empty each array in bankCardList
//         Object.keys(bankCardList).forEach((key) => {
//           bankCardList[key] = [];
//         });

//         for (let i = 0, l = res.data.length; i < l; i++) {
//           const data = res.data[i];
//           const { bankType, bankCode } = data;

//           if (isAlipay(bankCode)) {
//             const alipayBankType = "ALIPAY";
//             bankCardList[alipayBankType].push(data);
//           } else {
//             bankCardList[bankType].push(data);
//           }
//         }
//       }
//     })
//     .catch((error) => {
//       console.log("error", error);
//     });
// };

onActivated(() => {
  loadCards();
});
</script>

<style lang="scss">
.bank-card-container {
  padding: 8px 1rem 15px;
  .bank-card-item {
    padding: 3px;
    border-radius: 1.25rem;
    position: relative;
    transition: 0.3s all;

    &.card-unshow {
      margin-bottom: -3.5rem;
      border: 1px solid rgba(18, 0, 27, 0.1);
      background: linear-gradient(180deg, #702fad 0%, #491960 100%), linear-gradient(180deg, #a95cec 0%, #795069 100%);
      border-left-width: 2px;

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

      &:last-child {
        .bank-card-add {
          padding: 1rem 0 1.5rem;
        }
      }
    }

    &.card-show {
      margin-bottom: -2rem;
      border: 2px solid #a73dff;
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);

      .bank-card-add {
        gap: 0.5rem;
      }

      .card-update,
      .card-unlink {
        position: absolute;
        top: 1rem;
        color: black;
      }

      .card-update {
        left: 1rem;
      }

      .card-unlink {
        right: 1rem;
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

.bank-add-lists {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  width: calc(100% - 20px);
  margin: 0 auto 12px;

  .bank-card-add {
    flex: 1;
    color: #fff;
    font-weight: 700;
    align-items: center;
    border-radius: 0.5rem;
    gap: 6px;
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    display: flex;
    flex-direction: row;
    padding: 1rem 8px;
    height: 50px;
    justify-content: center;

    .card-update,
    .card-unlink {
      display: none;
    }

    .card-num-wrapper {
      display: none;
    }

    .card-label {
      font-size: 16px;
    }

    img {
      width: 28px;
    }
    &:active {
      opacity: 0.9;
      filter: brightness(0.9);
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
    border-radius: 8px;
    background: #ffffff26;
    color: #ffffff90;
  }

  .q-dialog__inner > .q-card {
    padding: 2.4rem 1.5rem;
    border-radius: 12px;
    background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
    //background-image: url("../../assets/images/index/modal-bg.png");
    background-size: 100% 100%;
    width: 90%;
  }

  .q-card__section {
    background: transparent;
  }
}

.list-cat-item {
  margin-bottom: 16px;

  .q-item.q-item-type {
    background-color: #263349;
    border-radius: 8px;
  }

  .list-item {
    background: #161f2d;
    padding: 12px;
    margin-top: 16px;
    border-radius: 8px;

    .item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
    }
    .item-icon {
    }
    .item-title {
      font-weight: bold;
    }
    .item-bind {
      color: #5c46e7;
      font-weight: bold;
    }

    .item-content {
      padding-top: 6px;
      display: flex;
      justify-content: space-between;

      .item-acc {
        font-size: 12px;
      }

      .item-copy {
        color: #5c46e7;
        display: flex;
        gap: 6px;
        align-items: center;
      }
    }
  }
}
</style>

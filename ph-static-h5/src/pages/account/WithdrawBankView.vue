<template>
  <div class="q-pa-md">
    <div class="account-title-container">
      <span class="account-title">Select Card</span>
    </div>
    <div class="account-content">
      <div class="account-tip-text wbot">
        <!-- <RiSpamLine /> -->
        New accounts that have updated personal information can participate in promotions
      </div>

      <div class="flex-box flex-wrap bank-card-list">
        <template v-for="bankCard in bankCards" :key="bankCard.id">
          <div class="bank-card-item" v-if="bankCard.bankName">
            <div class="card-name">
              <span>{{ bankCard.bankName }}</span>
              <span class="unlink" @click="unbindBankCard(bankCard)">
                <img src="../../assets/images/account/linkunlink.svg" />
              </span>
            </div>
            <img class="gold" src="../../assets/images/account/gold.svg" />
            <div class="card-contents">
              <div class="card-number">
                <div v-for="b in bankCard.cardNumberArr" :key="`${bankCard.id}--${b}`" class="card-num-box">
                  {{ b }}
                </div>
              </div>
            </div>
            <!-- <div class="icon">
              <img v-if="bankCard.bankIcon" :src="imgURL + bankCard.bankIcon" />
            </div> -->

            <!-- <div class="cardname">
              <div class="txt-center">
                <strong>{{ bankCard.bankName }}</strong>
              </div>
            </div>

            <div class="unlink-btn pointer-btn" @click="unbindBankCard(bankCard)">
              <RiLinkUnlink />
            </div>

            <div class="flex-box cards">
              <div v-for="b in bankCard.cardNumberArr" :key="`${bankCard.id}--${b}`" class="card-num-box">
                {{ b }}
              </div>
            </div> -->
          </div>
        </template>
        <div class="flex-box flex-align-center flex-justify-center add-bank-card" @click="bankCardModal"></div>
      </div>
    </div>
  </div>

  <div class="q-pa-md account-title-container bindunbind">
    <span class="account-title">Bank/E-wallet Card Unbind Record</span>

    <div class="account-content last">
      <div class="searchbar">
        <q-form layout="inline" :model="searchForm">
          <div class="left">
            <q-input color="primary" filled v-model="searchForm.startDate">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="searchForm.startDate" mask="MM/DD/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="searchForm.endDate">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="searchForm.endDate" mask="MM/DD/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn style="margin-top: 8px" color="brand" @click="searchRecord" label="Search" />
        </q-form>
      </div>
      <div class="unbind-record-wrapper">
        <div class="records" v-for="(record, r) in unbindRecords" :key="r">
          <div class="row">
            <span class="row-title">Bank Name</span>
            <span class="row-content">{{ record.bankName }}</span>
          </div>
          <div class="row">
            <span class="row-title">Card Account</span>
            <span class="row-content">{{ record.cardAccount }}</span>
          </div>
          <div class="row">
            <span class="row-title">Account Number</span>
            <span class="row-content">{{ record.cardNumber }}</span>
          </div>
          <div class="row">
            <span class="row-title">Address</span>
            <span class="row-content">{{ record.cardAddress }}</span>
          </div>
          <div class="row">
            <span class="row-title">Bind Time</span>
            <span class="row-content">{{ record.bindTime }}</span>
          </div>
          <div class="row">
            <span class="row-title">Unbind Time</span>
            <span class="row-content">{{ record.unbindTime }}</span>
          </div>
        </div>
        <!-- <q-table :rows="unbindRecords" :columns="columns">
          <template #unbindTime="{ text }">
            <span>{{ humanDatetime(text) }}</span>
          </template>
          <template #bindTime="{ text }">
            <span>{{ humanDatetime(text) }}</span>
          </template>
        </q-table> -->
      </div>
    </div>
  </div>

  <q-dialog v-model="bankCardModalState.visible" persistent>
    <q-card class="container-width q-pa-md q-mx-sm text-right">
      <q-btn style="color: #b9b9bb" dense flat icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
      <q-card-section class="q-mb-md">
        <div class="text-h6 text-center">
          {{ isVirtual ? "Add a virtual currency" : isEwallet ? "Add an E-wallet card" : "Add a bank card" }}
        </div>
      </q-card-section>

      <q-form class="flex column q-gutter-md">
        <q-select
          v-model="selectedBankType"
          filled
          :options="cardTypes"
          label="Card Type"
          color="#B1C6DF"
          label-color="#B1C6DF"
          @update:model-value="selectBankType(opt)"
          emit-value
          map-options
        />

        <q-select
          ref="bankCardRef"
          color="#B1C6DF"
          filled
          label-color="#B1C6DF"
          v-model="bankCardInfo.bankId"
          :options="banksList"
          option-value="id"
          option-label="name"
          :label="isVirtual ? 'Select Crypto Wallet' : !isEwallet ? 'Select Bank' : 'Select eWallet'"
          :rules="[(val) => !!val || errorCardText]"
          lazy-rules
          emit-value
          map-options
        >
          <!-- Selected Item -->
          <template v-slot:selected-item="scope">
            <q-item-section avatar>
              <img
                v-if="scope.opt.bankIcon"
                style="width: 30px; margin-block: 10px"
                :src="imgURL + scope.opt.bankIcon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="truncate">{{ scope.opt.name }}</q-item-label>
            </q-item-section>
          </template>

          <!-- Options Item -->
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <img
                  v-if="scope.opt.bankIcon"
                  style="width: 30px; margin-block: 10px"
                  :src="imgURL + scope.opt.bankIcon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          filled
          v-model="bankCardInfo.cardAccount"
          label="Card Account"
          :rules="cardAccountRules"
          lazy-rules
          :disable="true"
          ref="cardAccountRef"
          color="#B1C6DF"
        />

        <q-input
          filled
          v-model="bankCardInfo.cardNumber"
          :label="isVirtual || isEwallet ? 'Wallet' : 'Card Number'"
          :rules="isVirtual ? cryptoNumberRules : cardNumberRules"
          ref="cardNumberRef"
          color="#B1C6DF"
        />

        <q-input
          filled
          v-show="!(isVirtual || isEwallet)"
          v-model="bankCardInfo.cardAddress"
          label="Card Address"
          :rules="cardAddressRules"
          ref="cardAddressRef"
          color="#B1C6DF"
        />

        <div class="flex flex-center q-py-sm">
          <q-btn rounded class="q-mr-md" label="Cancel" @click="bankCardModalState.visible = false" />
          <q-btn rounded color="brand" label="Confirm" @click="submitBankCard" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onActivated, computed } from "vue";
import { RiSpamLine, RiLink, RiLinkUnlink } from "vue-remix-icons";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import moment from "moment";

import qs from "qs";

const router = useRouter();
const store = userStore();
const $q = useQuasar();

const searchForm = reactive({
  start: "",
  end: ""
});

const imgURL = process.env.IMAGE_CDN + "/payment/";

const columns = [
  {
    label: "Bank Name",
    field: "bankName"
  },
  {
    label: "Card Account",
    field: "cardAccount"
  },
  {
    label: "Account Number",
    field: "cardNumber"
  },
  {
    label: "Account Number",
    field: "cardNumber"
  },
  {
    label: "Address",
    field: "cardAddress"
  },
  {
    label: "Bind Time",
    field: "bindTime"
  },
  {
    label: "Unbind Time",
    field: "unbindTime"
  }
];
const unbindRecords = ref([]);

const bankCards = ref([]);
const loadCards = () => {
  bankCards.value = [];

  api
    .get("/session/allBankCard")
    .then((res) => {
      if (res.code === 0) {
        bankCards.value = res.data.map((d) => {
          const split = [d.cardNumber.slice(0, 4), "****", "****", d.cardNumber.slice(-4)];

          return {
            ...d,
            cardNumberArr: split
          };
        });
      }
    })
    .catch((error) => console.log("error", error));
};

//add bank card
const bankCardModalState = reactive({
  visible: false,
  banks: []
});

const bankCardRef = ref();
const cardNumberRef = ref();
const cardAccountRef = ref();
const cardAddressRef = ref();

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: "",
  cardAddress: ""
});

const isVirtual = computed(() => selectedBankType.value === "Crypto");
const isEwallet = computed(() => selectedBankType.value === "Ewallet");

const errorCardText = computed(() => {
  if (isVirtual.value) {
    return "Please select an Crypto card.";
  } else if (isEwallet.value) {
    return "Please select an eWallet card.";
  }
  return "Please select a bank card.";
});

const banksList = ref([]);
const selectedBankType = ref("Bank");

const cardTypes = ref(["Bank", "Ewallet", "Crypto"]);

//     computed(() => {
//   const cardTypes = [];
//
//   bankCardModalState.banks.forEach((b) => {
//     !cardTypes.includes(b.bankType) && cardTypes.push(b.bankType);
//   });
//
//   return cardTypes;
// });

const bankCardModal = () => {
  selectedBankType.value = cardTypes.value.length ? cardTypes.value[0] : "";

  store.getMemberInfo().then(() => {
    if (!store.realName) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Please enter your real name",
        icon: "report_problem"
      });

      router.push("/account/personal");
    } else {
      bankCardInfo.bankId = undefined;
      bankCardInfo.cardNumber = "";
      bankCardInfo.cardAccount = store.realName;
      bankCardInfo.cardAddress = "";
      bankCardModalState.visible = true;
    }
  });
};

const selectBankType = () => {
  bankCardInfo.bankId = "";
  bankCardInfo.cardNumber = "";

  banksList.value = bankCardModalState.banks.filter((b) => b.bankType === selectedBankType.value);
};

const submitBankCard = () => {
  bankCardRef.value.validate();
  cardAccountRef.value.validate();
  cardAddressRef.value.validate();
  cardNumberRef.value.validate();

  if (
    !bankCardRef.value.hasError &&
    !cardAccountRef.value.hasError &&
    !cardAddressRef.value.hasError &&
    !cardNumberRef.value.hasError
  ) {
    api
      .post("/session/bankCard", qs.stringify(bankCardInfo))
      .then((res) => {
        if (res.code === 0) {
          bankCardModalState.visible = false;
          $q.notify({
            color: "positive",
            position: "top",
            message: "Card Added",
            icon: "check_circle_outline"
          });

          loadCards();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const unbindBankCard = (card) => {
  const dialog = $q
    .dialog({
      class: "q-px-md q-py-md text-center",
      title: "Remove " + card.bankName,
      message: "Are you sure you want to remove " + card.bankName + "?",
      ok: {
        rounded: true,
        color: "brand",
        label: "Confirm",
        tabindex: 1
      },
      cancel: {
        rounded: true,
        color: "btncancel",
        textColor: "btncancel",
        label: "Cancel",
        tabindex: 0
      },
      persistent: true
    })
    .onOk(() => {
      api.post(`/session/bankCard/${card.id}?_method=delete`).then((res) => {
        if (res.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Success",
            icon: "check_circle_outline"
          });

          loadCards();
        }
      });
    });
};

// Card Rules
const validateBankLength = (val) => {
  if (selectedBankType.value === "Bank") {
    return (val.length > 5 && val.length < 13) || "Length should be 6 to 12 characters";
  } else if (selectedBankType.value === "Crypto") {
    return (val.length > 33 && val.length < 38) || "Length should be 34 to 37 characters.";
  } else if (selectedBankType.value === "Ewallet") {
    return (val.length > 10 && val.length < 12) || "Length should be 11 characters.";
  }
};

const cryptoNumberRules = [
  (val) => (val && val.length > 0) || "Card number is required",
  (val) => /^[A-Za-z0-9]*$/.test(val) || "Only numbers and alphabets are allowed"
  // (val) => validateBankLength(val),
];

const cardNumberRules = [
  (val) => (val && val.length > 0) || "Card number is required",
  (val) => /^\d+$/.test(val) || "Only numbers are allowed"
  // (val) => validateBankLength(val),
];

const cardAccountRules = [(val) => (val && val.length > 0) || "Card Account is required"];

const cardAddressRules = [];

const getTime = () => {
  searchForm.startDate = moment().add(-7, "day").format("MM/DD/YYYY");
  searchForm.endDate = moment().format("MM/DD/YYYY");
  searchRecord();
};

const searchRecord = () => {
  // console.log(searchForm);
  api
    .get("/session/unbindLog", {
      params: {
        startDate: moment(searchForm.startDate).format("YYYY-MM-DD"),
        endDate: moment(searchForm.endDate).format("YYYY-MM-DD")
      }
    })
    .then((response) => {
      // console.log(response);
      if (response.code === 0) {
        unbindRecords.value = response.data.records;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: response.message,
          icon: "report_problem"
        });
      }
    })
    .catch((e) => {
      console.log(e.message);
    });
};

onActivated(() => {
  loadCards();
  getTime();

  // Load Bank Vendor
  api
    .get("/session/withdraw/card")
    .then((res) => {
      if (res.code === 0) {
        bankCardModalState.banks = res.data.map((d) => ({
          ...d,
          bankType: d.bankType.slice(0, 1) + d.bankType.slice(1).toLowerCase()
        }));

        // console.log(bankCardModalState.banks)

        selectBankType();
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
});
</script>

<style lang="scss" scoped>
.text-h6 {
  background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 20.07%);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  font-family: Inter Bold;
}
.account-title-container {
  margin: 10px 0;
  font-size: 20px;

  .account-title {
    position: relative;
    font-family: "Inter Medium";
    font-size: 15px;
    line-height: 32px;
    letter-spacing: 0px;
    text-align: left;
  }
}

.account-content {
  .account-tip-text {
    font-size: 12px;
    color: #83a3ca;
    position: relative;
    padding-left: 10px;
    font-family: "Inter Medium";
    &:before {
      content: "";
      width: 4px;
      height: 4px;
      background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      position: absolute;
      transform: rotateZ(45deg);
      left: 0px;
      top: 6px;
    }
  }
  svg.remixicon {
    width: 15px;
    display: inline-block;
    vertical-align: middle;
  }
}

.passwordModal .ant-modal {
  max-width: 520px;
  width: 100%;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
}

.bankModal .ant-modal {
  max-width: 520px;
  width: 100%;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  color: #ffffff;

  .ant-modal-content {
    width: 90%;
  }

  .ant-form-item-control-input-content {
    color: #ffffff;
  }
}

.securityModal .ant-modal {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
}

.ant-modal.ant-modal-confirm {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style scoped lang="scss">
:deep(.ant-form-item-label > label) {
  color: #ffffff;
}

:deep(.ant-form-item.half .ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  .ant-input {
    width: 100%;
    flex-basis: 50%;
  }
}

:deep(.ant-form-item .ant-select) {
  width: 100%;
}

:deep(.ant-form-item.select .ant-form-item-control-input) {
  width: 100%;
}

:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  height: 40px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #23263c;
  color: #ffffff;
  border: 0;
}

.common-btn {
  width: 100%;
  cursor: pointer;

  &.search-btn {
    font-size: 14px;
  }

  &.verification-btn {
    padding: 8px;
  }

  &.submit-btn {
    padding: 8px;
  }
}

.bank-card-list {
  max-width: 300px;
  margin: 140px auto 30px;
  padding: 15% 0 0;
  display: flex;
  flex-wrap: wrap;

  .add-bank-card {
    border-radius: 20px;
    cursor: pointer;
    align-items: center;
    padding: 0;
    filter: none;
    background-image: url("../../assets/images/account/add_bank_card.png");
    background-position: center;
    overflow: hidden;
    box-shadow: -5px 0 10px rgb(0 0 0 / 60%);
    width: 100%;
    max-width: 320px;
    margin: 0;
    margin-top: -50%;
    flex-direction: column;
    height: 190px;
    z-index: 0;
  }
  .bank-card-item {
    border-radius: 20px;
    background-image: url("../../assets/images/account/bank_card_bg.png");
    background-size: cover;
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
    transition: all 0.3s ease-in;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    box-shadow: -5px 0 10px rgb(0 0 0 / 60%);
    width: 100%;
    max-width: 320px;
    margin: 0;
    margin-top: -50%;
    flex-direction: column;
    align-items: center;
    height: 190px;
    transform: none;
    padding: 10px 15px;
    gap: 10px;

    .card-name {
      font-family: Courier Bold;
      font-size: 17px;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: left;
      color: #ffffff;
      text-overflow: ellipsis;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        width: 225px;
        height: 20px;
        overflow: hidden;
        display: inline-flex;
      }
    }
    .gold {
      margin-right: auto;
      margin-top: 5px;
    }
    .unlink {
      display: none;
    }
    .card-contents {
      width: 100%;
      filter: blur(2px);
      .card-number {
        color: #ffffff;
        text-align: left;
        width: 100%;
        font-size: 16px;
        font-family: Courier Bold;
        display: flex;
        gap: 16px;
      }
    }
    .icon {
      position: absolute;
      left: 5px;
      bottom: 5px;
      width: 30px;

      img {
        width: 100%;
      }
    }

    &:hover {
      margin-bottom: 30%;
      padding-bottom: 10%;

      .card-name {
        overflow: unset;
        height: unset;
      }
      .unlink {
        background: #ffffff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
      .card-contents {
        filter: none;
      }

      .icon {
        width: 40px;
        position: relative;
      }

      .unlink-btn {
        display: block;
      }

      .txt-center {
        position: relative;
        padding-top: 0;
        transform: rotateZ(0);
        height: unset;
      }

      // &:hover {
      //   &:before {
      //     -webkit-animation: shine 2s;
      //     animation: shine 2s;
      //   }
      // }
    }

    &.inactive {
      margin-top: -40%;
    }

    .txt-center {
      left: 0px;
      bottom: 0;
      top: 0;
      margin: auto;
      text-overflow: ellipsis;
      overflow: hidden;
      #B1C6DF-space: nowrap;
      transition: all 0.3s ease-in-out;
      transform: none;
      padding-top: 10px;
      width: 100%;
      height: 140px;
    }

    .cards {
      gap: 10px;
      margin-top: 10px;
      justify-content: center;
      display: flex;
    }

    .unlink-btn {
      cursor: pointer;
      position: absolute;
      display: none;
      top: 10px;
      left: 10px;
    }

    svg {
      fill: #000;
      width: 20px;
    }

    .card-num-box {
      // padding: 40px 0 0;
    }

    &:before {
      position: absolute;
      top: 0;
      left: -85%;
      z-index: 0;
      display: block;
      content: "";
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
      border-radius: 10px;
      transform: skewX(320deg);
    }

    @-webkit-keyframes shine {
      100% {
        left: 125%;
      }
    }
    @keyframes shine {
      100% {
        left: 125%;
      }
    }
  }
}

.basic-info {
  position: relative;

  .buttons {
    position: absolute;
    top: 20px;
    right: 10%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .account-btn {
    cursor: pointer;
    padding: 5px 20px;
    font-size: 16px;
    min-width: 180px;
  }
}

.basic-info-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 70%;

  .tbl-row {
    display: flex;
    justify-content: flex-start;
    padding: 0 20px 15px 0px;
  }

  .basic-info-cell {
    padding-bottom: 0.5rem;

    &.title {
      width: 150px;
    }

    // &.content {
    //   // width: 170px;
    //   width: calc(100% - 100px);
    //   max-width: 250px;
    //   color: #1bcef1;
    // }
  }
}

.body--dark {
  .text-h6 {
    color: #ffffff;
    background: unset;
    -webkit-text-fill-color: unset;
    -moz-text-fill-color: unset;
  }
  .unbind-record-wrapper {
    .records {
      background: #ffffff05;
      .row {
        .row-title {
          color: #ffffff99;
        }
        .row-content {
          color: #ffffff;
        }
      }
    }
  }
}
.unbind-record-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  .records {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid #ffffff;
    .row {
      display: flex;
      padding: 10px;
      justify-content: space-between;
      .row-title {
        color: #22222299;
        font-size: 14px;
      }
      .row-content {
        color: #83a3ca;
        font-size: 14px;
      }
    }
  }
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.searchbar .ant-form {
  display: flex;
  justify-content: space-between;

  .ant-form-item {
    margin-right: 0;
  }
}
.q-dialog__inner--minimized > div.q-dark {
  background: #15141a;
}
body.body--dark {
  .q-dialog {
    .q-card {
      background: #15141a;
    }
  }
}
</style>

<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("personalView.bank.title") }}</span>
    </div>

    <!-- <div class="account-title-container">
      <span class="account-title">Select Card</span>
    </div> -->
    <div class="account-content">
      <!-- <div class="account-tip-text wbot">Please register for a withdrawal bank account below to be updated</div> -->
      <!-- <div class="addbuttons">
        <div
          class="flex-box flex-align-center flex-justify-center bank-card-item add-bank-card"
          @click="bankCardModal('bank')"
        >
          <RiLink />
          เพิ่มบัตร
        </div>
      </div> -->
      <div class="flex-box flex-wrap bank-card-list">
        <div
          v-for="(bc, index) in personalState.bankCardList"
          :key="bc.id"
          class="bank-card-item"
          :class="{
            active: index === isCardActive,
            inactive: index > isCardActive
          }"
          @click="showCard(bc, index)"
        >
          <!-- <div class="icon">
            <img v-if="bc.bankIcon" :src="imgURL + bc.bankIcon" />
          </div> -->
          <div class="cardname">
            <div class="txt-center">
              <strong>{{ bc.bankName }}</strong>
              <!-- <div>Bank Account Number</div> -->
            </div>
          </div>
          <div class="unlink-btn" @click="unbindBankCard(bc)">
            <RiLinkUnlink />
          </div>
          <!-- TODO: click event? -->
          <!-- <div class="setting-btn">
            <RiSettings3Line />
          </div> -->

          <div class="flex-box cards">
            <div class="card-num-box">
              <div v-for="(cardNumber, index) in bc.displayCardNumberList" :key="index">
                <span v-if="[1, 2].includes(index)">****</span>
                <span v-else>{{ cardNumber }}</span>
              </div>
            </div>
            <!-- <div class="card-address">{{ bc.cardAddress }}</div> -->
            <!-- <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              {{ b.slice(0, 4) }}
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              ****
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              ****
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              {{ b.slice(b.length - 4, b.length) }}
            </div> -->
          </div>
        </div>
        <div class="bank-card-item addcard" @click="bankCardModal('bank')">
          <RiAddCircleFill style="fill: currentColor" />
          {{ $t("personalView.bank.addButton") }}
        </div>
      </div>
    </div>
    <!-- <div class="account-title-container bindunbind">
      <span class="account-title">Bank/E-wallet Card Unbind Record</span>
    </div>
    <div class="account-content last bindunbind">
      <div class="searchbar">
        <a-form layout="inline" :model="searchForm">
          <div class="left">
            <a-form-item label="Start">
              <a-date-picker
                v-model:value="searchForm.startDate"
                show-time
                type="date"
                placeholder="Start"
                value-format="yyyy-MM-DD"
                format="MM/DD/yyyy"
              />
            </a-form-item>
            <a-form-item label="End">
              <a-date-picker
                v-model:value="searchForm.endDate"
                show-time
                type="date"
                placeholder="End"
                value-format="yyyy-MM-DD"
                format="MM/DD/yyyy"
              />
            </a-form-item>
          </div>
          <a-form-item>
            <button class="common-btn search-btn" @click="searchRecord()">Search</button>
          </a-form-item>
        </a-form>
      </div>
      <div class="unbind-record-wrapper">
        <a-table :columns="columns" :data-source="dataSource" :row-key="(record) => record.bankName">
          <template #unbindTime="{ text }">
            <span>{{ humanDatetime(text) }}</span>
          </template>
          <template #bindTime="{ text }">
            <span>{{ humanDatetime(text) }}</span>
          </template>
        </a-table>
      </div>
    </div> -->
    <a-modal v-model:visible="bankCardModalState.visible" wrap-class-name="bankModal" width="100%" :footer="null">
      <div class="modal-head-title">{{ $t("personalView.bank.addModal.title") }}</div>
      <a-form
        ref="bankCardFormRef"
        :hide-required-mark="true"
        :model="bankCardInfo"
        :rules="bankCardRules"
        :colon="false"
      >
        <a-form-item name="bankId">
          <div class="bank-btn-wrapper">
            <a-button
              v-for="(bank, index) in bankCardModalState.banks"
              :key="index"
              class="bank-btn"
              :class="{ selected: bankCardInfo.bankId === bank.id }"
              @click="handleSelectBank(bank.id)"
            >
              <img :src="imgURL + bank.bankIcon" class="bank-btn__img" />
              {{ bank.name }}
            </a-button>
          </div>
        </a-form-item>
        <!-- <a-form-item name="bankId">
          <a-space style="width: 100%; justify-content: space-between">
            <a-select
              v-model:value="selectedBankType"
              :placeholder="
                $t(
                  `personalView.bank.addModal.form.bankType.placeholder.${
                    isVirtual ? 'crypto' : !isEwallet ? 'bank' : 'eWallet'
                  }`
                )
              "
              style="width: 100%"
              :options="bankTypes.map((bank) => ({ value: bank }))"
              @change="selectBankType"
            />
            <a-select
              v-model:value="bankCardInfo.bankId"
              class="select"
              :placeholder="
                $t(
                  `personalView.bank.addModal.form.bankId.placeholder.${
                    isVirtual ? 'crypto' : !isEwallet ? 'bank' : 'eWallet'
                  }`
                )
              "
              style="width: 100%"
            >
              <a-select-option v-for="b in banksList" :key="b.id" :value="b.id">
                <span role="img" :aria-label="b.name">
                  <img
                    v-if="b.bankIcon"
                    style="height: 100%; max-width: 30px; margin-right: 10px"
                    :src="imgURL + b.bankIcon"
                  />
                  {{ b.name }}
                </span>
              </a-select-option>
            </a-select>
          </a-space>
        </a-form-item> -->

        <!-- <a-form-item
          name="cardAccount"
          label-align="left"
          :label="$t('personalView.bank.addModal.form.cardAccount.label')"
        >
          <a-input
            :disabled="true"
            v-model:value="bankCardInfo.cardAccount"
            :placeholder="$t('personalView.bank.addModal.form.cardAccount.placeholder')"
          />
        </a-form-item> -->
        <a-form-item
          ref="cardNumber"
          name="cardNumber"
          label-align="left"
          :label="
            $t(`personalView.bank.addModal.form.cardNumber.label.${isVirtual || isEwallet ? 'wallet' : 'cardNumber'}`)
          "
        >
          <a-input
            v-model:value="bankCardInfo.cardNumber"
            :placeholder="
              $t(
                `personalView.bank.addModal.form.cardNumber.placeholder.${
                  isVirtual || isEwallet ? 'wallet' : 'cardNumber'
                }`
              )
            "
          />
        </a-form-item>
        <!-- <a-form-item v-if="!(isVirtual || isEwallet)" ref="cardAddress" name="cardAddress" label="Card Address">
          <a-input v-model:value="bankCardInfo.cardAddress" placeholder="Card Address" />
        </a-form-item> -->
        <!-- <a-form-item v-if="!(isVirtual || isEwallet)"  name="cardNumber" label-align="left" label="Account Number">
          <a-input v-model:value="bankCardInfo.cardNumber" placeholder="Enter Account Number" />
        </a-form-item> -->
        <!-- <a-form-item
          name="cardAddress"
          label-align="left"
          :label="$t('personalView.bank.addModal.form.cardAddress.label')"
        >
          <a-input
            v-model:value="bankCardInfo.cardAddress"
            :placeholder="$t('personalView.bank.addModal.form.cardAddress.placeholder')"
          />
        </a-form-item> -->
        <a-form-item>
          <span class="remind">{{ $t("personalView.bank.addModal.remind") }}</span>
        </a-form-item>
        <a-form-item class="txt-center">
          <button class="txt-center common-btn" type="submit" @click="submitBankCard">
            {{ $t("personalView.bank.addModal.confirmButton") }}
          </button>
        </a-form-item>
      </a-form>
    </a-modal>
    <ConfirmModal
      v-model="open"
      centered
      :title="$t('personalView.bank.removeModal.title', { bankName: selectedUnbindingCard.bankName })"
      @confirm="handleOk"
    >
      {{ $t("personalView.bank.removeModal.description", { bankName: selectedUnbindingCard.bankName }) }}
    </ConfirmModal>
    <!-- <a-modal centered v-model:visible="open" :title="`Remove ${selectedUnbindingCard.bankName} ?`">
      Are you sure you want to remove {{ selectedUnbindingCard.bankName }} ?
      <div class="flex" style="gap: 10px; margin: 20px">
        <a-button class="common-btn outline" @click="handleCancel">Cancel</a-button>
        <a-button class="common-btn" @click="handleOk">Confirm</a-button>
      </div>
    </a-modal> -->
  </div>
</template>

<script setup>
import { defineComponent, reactive, ref, onMounted, createVNode, computed } from "vue";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { RiSpamLine, RiAddCircleFill, RiLinkUnlink, RiSettings3Line } from "vue-remix-icons";
import { loadBanks, loadAllBankCards, loadUnbindRecord, addBankCard, deleteBankCard } from "@/api/personal/personal";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import moment from "moment/moment";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

let validateBankLength = async (r, v) => {
  var min = 6;
  var max = 12;
  var reg = /^\d+$/;
  var allreg = /^[A-Za-z0-9]*$/;
  if (v === "") {
    return Promise.reject("Please enter card number");
  } else if (v.length < min || v.length > max) {
    return Promise.reject("Length should be between " + min + "-" + max);
  } else {
    return Promise.resolve();
  }
};
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/payment/";
const isCardActive = ref();
const store = userStore();
const searchForm = reactive({
  startDate: "",
  endDate: ""
});
const router = useRouter();
const columns = [
  {
    title: "Bank Name",
    dataIndex: "bankName",
    key: "bankName"
  },
  {
    title: "Card Account",
    dataIndex: "cardAccount",
    key: "cardAccount"
  },
  {
    title: "Card Address",
    dataIndex: "cardAddress",
    key: "cardAddress"
  },
  {
    title: "Bind Time",
    key: "bindTime",
    dataIndex: "bindTime",
    slots: { customRender: "bindTime" }
  },
  {
    title: "UnbindTime",
    key: "unbindTime",
    dataIndex: "unbindTime",
    slots: { customRender: "unbindTime" }
  }
];

const bankTypes = ["e-Wallet"];
const isVirtual = computed(() => selectedBankType.value === "Crypto");
const isEwallet = computed(() => selectedBankType.value === "e-Wallet");

const personalState = reactive({
  memberInfo: {},
  bankCardList: []
});
const dataSource = ref();
const searchRecord = () => {
  loadUnbindRecord(searchForm)
    .then((response) => {
      if (response.code === 0) {
        dataSource.value = response.data.records;
      } else {
        message.error(response.message, 4);
      }
    })
    .catch((e) => {
      console.log(e.message);
    });
};

const chgDate = (val) => {
  var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
  var oldDate = new Date(gapDate);
  var newDate = {
    Y: oldDate.getFullYear() + "-",
    M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
    D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
  };
  var useDate = newDate.Y + newDate.M + newDate.D;
  return useDate;
};

const getTime = () => {
  searchForm.startDate = chgDate(7);
  searchForm.endDate = chgDate(0);
  searchRecord();
};
onMounted(() => {
  getTime();
  loadCards();
});
const showCard = (item, index) => {
  // if (index === isCardActive.value) {
  //   isCardActive.value = null;
  //   console.log(isCardActive.value)
  // } else {
  //   isCardActive.value = index
  // }
  isCardActive.value = index;
};
const loadCards = () => {
  personalState.bankCardList = [];
  loadAllBankCards()
    .then((response) => {
      if (response.code === 0) {
        response.data.forEach((element) => {
          if (element) {
            const _element = {
              ...element,
              displayCardNumberList: element.cardNumber.split(/(\d{4})/).filter(Boolean)
            };
            personalState.bankCardList.push(_element);
          }
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

//add bank card
const bankCardModalState = reactive({
  visible: false,
  banks: []
});
const bankCardFormRef = ref();
const bankCardInfo = reactive({
  bankId: "",
  cardNumber: ""
  // cardAccount: "",
  // cardAddress: ""
});
const bankName = ref();
const banksList = ref([]);
const bankCardModal = () => {
  store.getMemberInfo().then(() => {
    if (!store.realName || store.realName == "") {
      message.error("Kindly fill in your personal details");
      router.push("/center/personal");
    } else {
      bankCardInfo.bankId = undefined;
      bankCardInfo.cardNumber = "";
      bankCardInfo.cardAccount = store.realName;
      // bankCardInfo.cardAddress = "";
      bankCardModalState.visible = true;
      if (bankCardModalState.banks.length === 0) {
        loadBanks()
          .then((res) => {
            if (res.code === 0) {
              bankCardModalState.banks.push(...res.data);
              selectBankType();
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      }
    }
  });
  // bankCardInfo.bankId = undefined;
  // bankCardInfo.cardNumber = "";
  // bankCardInfo.cardAccount = store.realName;
  // bankCardInfo.cardAddress = "";
  // bankCardModalState.visible = true;
  // if (bankCardModalState.banks.length === 0) {
  //   loadBanks().then((res) => {
  //     if (res.code === 0) {
  //       bankCardModalState.banks.push(...res.data)
  //       selectBankType();
  //     }
  //   }).catch((e) => {
  //     console.log("error", e);
  //   });
  // }
};

const selectedBankType = ref("e-Wallet");
const selectBankType = () => {
  bankCardFormRef.value.clearValidate();
  banksList.value = [];
  bankCardInfo.bankId = null;
  bankCardModalState.banks.forEach((element) => {
    if (selectedBankType.value === "Bank" && element.bankType === "BANK") {
      banksList.value.push(element);
    }
    if (selectedBankType.value === "Crypto" && element.bankType === "CRYPTO") {
      banksList.value.push(element);
    }
    if (selectedBankType.value === "e-Wallet" && element.bankType === "EWALLET") {
      banksList.value.push(element);
    }
  });
};
const submitBankCard = () => {
  bankCardFormRef.value
    .validate()
    .then(() => {
      addBankCard(bankCardInfo)
        .then((response) => {
          if (response.code === 0) {
            message.success("success");
            bankCardModalState.visible = false;
            loadCards();
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const bankCardRules = computed(() => ({
  cardNumber: [
    {
      required: true,
      message: t("personalView.bank.addModal.form.cardNumber.error.required"),
      trigger: "blur"
    }
    // {
    //   validator: validateBankLength,
    //   trigger: "blur",
    // }
  ],
  bankId: [
    {
      required: true,
      message: t(
        `personalView.bank.addModal.form.bankId.error.required.${isVirtual ? "crypto" : isEwallet ? "eWallet" : "bank"}`
      )
    }
  ],
  cardAccount: [
    {
      required: true,
      message: t("personalView.bank.addModal.form.cardAccount.error.required"),
      trigger: "blur"
    }
  ],
  cardAddress: [
    {
      required: true,
      message: t("personalView.bank.addModal.form.cardAddress.error.required"),
      trigger: "blur"
    }
  ]
}));
const open = ref(false);
const selectedUnbindingCard = ref({});
const unbindBankCard = (card) => {
  selectedUnbindingCard.value = card;
  open.value = true;
  // Modal.confirm({
  //   title: "Remove " + card.bankName + "?",
  //   content: "Are you sure you want to remove " + card.bankName + "?",
  //   icon: createVNode(ExclamationCircleOutlined),
  //   width: "100%",
  //   onOk() {
  //     deleteBankCard(card.id
  //     ).then((res) => {
  //       if (res.code === 0) {
  //         for (let i = 0; i < personalState.bankCardList.length; i++) {
  //           if (personalState.bankCardList[i].id === card.id) {
  //             personalState.bankCardList.splice(i, 1);
  //           }
  //         }
  //       }
  //     }).catch((e) => {
  //       console.log("error", e);
  //     });
  //   },
  //   onCancel() {
  //   },
  // });
};

const handleOk = (e) => {
  deleteBankCard(selectedUnbindingCard.value.id)
    .then((res) => {
      if (res.code === 0) {
        for (let i = 0; i < personalState.bankCardList.length; i++) {
          if (personalState.bankCardList[i].id === selectedUnbindingCard.value.id) {
            personalState.bankCardList.splice(i, 1);
          }
        }
        open.value = false;
      }
    })
    .catch((e) => {
      console.log("error", e);
      open.value = false;
    });
};

const handleCancel = (e) => {
  open.value = false;
};

const handleSelectBank = (id) => {
  bankCardInfo.bankId = id;
};
</script>

<style lang="scss">
.ant-space-item:nth-child(1) {
  width: 120px;
}

.ant-space-item:nth-child(2) {
  width: calc(100% - 120px);
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
    background-color: #131313;
  }

  .ant-form-item-control-input-content {
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

.account-container {
  .account-content-wrapper {
    .bank-card-list {
      padding-top: 20px;
      gap: 24px;
      // padding-right: 220px;
      // padding-left: 40px;

      .bank-card-item {
        margin-bottom: 20px;
        padding: 0 10px;
        width: 320px;
        height: 190px;
        border-radius: 20px;
        background-image: linear-gradient(to right, #de4545, #db7e42);
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease-in;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        // filter: grayscale(0.3);
        background-image: url("../../assets/images/finance/bankcard.png");
        transform: none;
        &.addcard {
          background-image: url("../../assets/images/finance/bankaddcard.png");
          // background-color: #e7e7ffc9;
          color: #dfeeff;
          display: flex;
          flex-direction: column;
          svg {
            width: 50px;
          }
        }

        &:hover {
          box-shadow: 0px 0px 10px 0 #000;
        }

        // .icon {
        //   position: absolute;
        //   left: 25px;
        //   bottom: 25px;
        //   width: 50px;

        //   img {
        //     width: 100%;
        //   }
        // }

        &.active {
          flex-direction: column;
          // margin: 0 -60px 20px 0px;
          gap: 10px;
          filter: none;

          // .icon {
          //   width: 20%;
          //   position: relative;
          //   left: 0;
          //   bottom: 0;
          // }
        }

        .txt-center {
          position: absolute;
          text-align: left;
          left: 20px;
          top: 35px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.3s ease-in-out;
        }

        .cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: absolute;
          top: 120px;
          left: 20px;

          .card-num-box {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16.64px;
            font-weight: 700;
            line-height: 18.69px;
          }

          .card-address {
            font-size: 13.93px;
            font-style: italic;
            font-weight: 400;
            line-height: 15.64px;
          }
        }

        &.add-bank-card {
          cursor: pointer;
          align-items: center;
          padding: 0;
          filter: none;
        }

        .unlink-btn {
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .setting-btn {
          cursor: pointer;
          position: absolute;
          top: 10px;
          left: 10px;
        }

        svg {
          fill: #ffffff;
          width: 20px;
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

        &:hover {
          &:before {
            -webkit-animation: shine 2s;
            animation: shine 2s;
          }
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
  }
}

.addbuttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;

  .add-bank-card {
    cursor: pointer;
    border: 1px solid #ffffff;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    gap: 10px;

    svg {
      width: 20px;
      fill: #ffffff;
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

.unbind-record-wrapper {
  margin-top: 20px;
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

.remind {
  color: #ffa031;
}

.bank-btn-wrapper {
  display: flex;
  gap: 20px;
  .bank-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    height: 40px;
    background-color: transparent;
    border: 1px solid #072a19;
    border-radius: 8px;
    position: relative;
    color: #fff;

    &:hover,
    &:focus,
    &.selected {
      border-color: #1baa99;
    }

    .bank-btn__img {
      max-width: 24px;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .account-container {
    .basic-info-table {
      grid-template-columns: 1fr;
    }
  }
  .basic-info {
    .buttons {
      position: relative;
      right: unset;
      left: unset;
      top: unset;
      margin-bottom: 20px;
      flex-direction: unset;
    }
  }
}

@media (max-width: 767px) {
  .bindunbind {
    display: none;
  }
  .basic-info {
    .account-btn {
      padding: 5px 0px;
      font-size: 12px;
      min-width: 140px;
    }
  }
}

@media (max-width: 767px) {
  .account-container {
    .account-content-wrapper {
      .bank-card-list {
        max-width: 300px;
        margin: 100px auto;
        padding: 15% 0 0;

        .bank-card-item {
          width: 100%;
          max-width: 300px;
          margin-right: 0;
          margin: 0;
          margin-top: -40%;
          flex-direction: column;
          align-items: center;
          height: 150px;
          transform: none;

          .icon {
            left: 5px;
            top: 2px;
            width: 22px;
            bottom: unset;
            right: unset;
          }

          .unlink-btn {
            right: 10px;
            left: unset;
            display: none;
            transition-delay: 0.5s;
            transition: all 0.3s ease-in;
          }

          .card-num-box {
            width: 100%;
            padding-right: 0;
            overflow-wrap: normal;
            white-space: nowrap;
            padding: 0 20px;
          }

          .txt-center {
            transform: none;
            padding-top: 10px;
            width: 260px;
            left: 20px;
            bottom: 0;
            text-align: center;
          }

          &.active {
            margin: -40% 0 30% 0;
            padding-bottom: 10%;

            .txt-center {
              left: 0px;
              padding-top: 5px;
              text-align: center;
            }

            .unlink-btn {
              display: block;
            }

            .icon {
              width: 40px;
            }
          }

          // &.inactive {
          //   // margin-top: -40%;
          // }
        }
      }
    }
  }
}
</style>

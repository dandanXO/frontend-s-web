<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Withdraw Bank Card</span>
    </div>

    <div class="account-title-container">
      <span class="account-title">Select Card</span>
    </div>
    <div class="account-content">
      <div class="account-tip-text wbot">
        <RiSpamLine /> Please register for a withdrawal bank account below to be
        updated
      </div>
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
          class="bank-card-item"
          :class="{
            active: index === isCardActive,
            inactive: index > isCardActive,
          }"
          @click="showCard(bc, index)"
          v-for="(bc, index) in personalState.bankCardList"
          :key="bc.id"
        >
          <div class="icon">
            <img v-if="bc.bankIcon" :src="imgURL + bc.bankIcon" />
          </div>
          <div class="cardname">
            <div class="txt-center">
              <strong>{{ bc.bankName }}</strong>
              <!-- <div>Bank Account Number</div> -->
            </div>
          </div>
          <div class="unlink-btn" @click="unbindBankCard(bc)">
            <!-- <img src="../../assets/images/account/unbind_bank_card.png" /> -->
            <RiLinkUnlink />
          </div>

          <div class="flex-box cards">
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              {{ b }}
            </div>
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
        <div class="bank-card-item" @click="bankCardModal('bank')">
          <RiLink />
          Add card
        </div>
      </div>
    </div>
    <div class="account-title-container bindunbind">
      <span class="account-title">Bank Card Unbind Record</span>
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
                valueFormat="yyyy-MM-DD"
                format="yyyy-MM-DD"
              />
            </a-form-item>
            <a-form-item label="End">
              <a-date-picker
                v-model:value="searchForm.endDate"
                show-time
                type="date"
                placeholder="End"
                valueFormat="yyyy-MM-DD"
                format="yyyy-MM-DD"
              />
            </a-form-item>
          </div>
          <a-form-item>
            <button
              class="common-btn outline search-btn"
              @click="searchRecord()"
            >
              Search For
            </button>
          </a-form-item>
        </a-form>
      </div>
      <div class="unbind-record-wrapper">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :row-key="(record) => record.bankName"
        ></a-table>
      </div>
    </div>
    <a-modal
      wrap-class-name="bankModal"
      width="100%"
      v-model:visible="bankCardModalState.visible"
      :footer="null"
    >
      <div class="modal-head-title">Add a bank card</div>
      <a-form
        ref="bankCardFormRef"
        :hideRequiredMark="true"
        :model="bankCardInfo"
        :rules="bankCardRules"
        :colon="false"
      >
        <a-form-item
          name="bankId"
          :rules="[{ required: true, message: 'Please select a bank' }]"
        >
          <a-space style="width: 100%; justify-content: space-between">
            <a-select
              placeholder="Bank type"
              v-model:value="selectedBankType"
              style="width: 100%"
              :options="bankTypes.map((bank) => ({ value: bank }))"
              @change="selectBankType"
            ></a-select>
            <a-select
              class="select"
              v-model:value="bankCardInfo.bankId"
              placeholder="Please select a bank"
              style="width: 100%"
            >
              <a-select-option v-for="b in banksList" :key="b.id" :value="b.id">
                <span role="img" :aria-label="b.name"
                  ><img
                    v-if="b.bankIcon"
                    style="height: 100%; max-width: 30px; margin-right: 10px"
                    :src="imgURL + b.bankIcon"
                  />
                  {{ b.name }}</span
                >
              </a-select-option>
            </a-select>
          </a-space>
        </a-form-item>

        <!-- <a-form-item v-if="isVirtual" name="bankId" label="ชื่อธนาคาร">
          {{ bankName }}
        </a-form-item> -->
        <a-form-item style="background: #23263c; padding: 5px 20px">{{
          bankCardInfo.cardAccount
        }}</a-form-item>
        <!-- <a-form-item ref="cardAccount" name="cardAccount">
          <a-input
            v-model:value="bankCardInfo.cardAccount"
            placeholder="ชื่อบัญชี (ชื่อตรงกันกับบัญชีที่ใช้ฝาก)"
          />
        </a-form-item> -->
        <a-form-item ref="cardNumber" name="cardNumber">
          <a-input
            v-model:value="bankCardInfo.cardNumber"
            placeholder="Card Number"
          />
        </a-form-item>
        <a-form-item ref="cardAddress" name="cardAddress">
          <a-input
            v-model:value="bankCardInfo.cardAddress"
            placeholder="Card Address"
          />
        </a-form-item>
        <a-form-item class="txt-center">
          <button
            class="txt-center common-btn"
            type="submit"
            @click="submitBankCard"
          >
            Confirm
          </button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { RiSpamLine, RiLink, RiLinkUnlink } from "vue-remix-icons";
import { loadBanks, loadBankCards, loadUnbindRecord, addBankCard, deleteBankCard } from "@/api/personal/personal";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RiSpamLine, RiLink, RiLinkUnlink, ExclamationCircleOutlined
  },
  setup() {
    let validateBankLength = async (r, v) => {
      var min = 6
      var max = 12
      if (selectedBankType.value === 'Bank') {
        min = 6;
        max = 12;
      } else if (selectedBankType.value === 'Crypto') {
        min = 34;
        max = 37;
      } else if (selectedBankType.value === 'e-Wallet') {
        min = 11;
        max = 11;
      }
      var reg = /^\d+$/;
      if (v === '') {
        return Promise.reject('Please enter card number');
      } else if (!reg.test(v)) {
        return Promise.reject('Only numbers are allowed');
      } else if (v.length < min || v.length > max) {
        if (selectedBankType.value === 'e-Wallet') {
          return Promise.reject('Length should be 11');
        } else {
          return Promise.reject('Length should be between ' + min + '-' + max );
        }
      } else {
        return Promise.resolve();
      }
    };
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/'
    const isCardActive = ref();
    const store = userStore();
    const searchForm = reactive({
      startDate: "",
      endDate: ""
    });
    const router = useRouter()
    const columns = [
      {
        title: "Bank Name",
        dataIndex: "bankName",
        key: "bankName",
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
      },
      {
        title: "UnbindTime",
        key: "unbindTime",
        dataIndex: "unbindTime"
      }
    ];
    const bankTypes = ['Bank', 'Crypto', 'e-Wallet']
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    const dataSource = ref();
    const searchRecord = () => {
      loadUnbindRecord(searchForm).then((response) => {
        if (response.code === 0) {
          dataSource.value = response.data.records
        } else {
          message.error(response.message, 4)
        }
      }).catch((e) => {
          console.log(e.message);
      });
    };


    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate()) < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + "")
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
      isCardActive.value = index
    }
    const loadCards = () => {
      personalState.bankCardList = [];
      loadBankCards().then((response) => {
        if (response.code === 0) {
          personalState.bankCardList.push(...response.data);
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }

    //add bank card
    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });
    const bankCardFormRef = ref();
    const bankCardInfo = reactive({
      bankId: undefined,
      cardNumber: "",
      cardAccount: "",
      cardAddress: ""
    });
    const bankName = ref()
    const banksList = ref([])
    const bankCardModal = () => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "") {
          router.push("/center/personal");
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          bankCardModalState.visible = true;
          if (bankCardModalState.banks.length === 0) {
            loadBanks().then((res) => {
              if (res.code === 0) {
                bankCardModalState.banks.push(...res.data)
                selectBankType();
              }
            }).catch((e) => {
              console.log("error", e);
            });
          }
        }
      })
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
    const selectedBankType = ref("Bank")
    const selectBankType = () => {
      bankCardFormRef.value.clearValidate()
      banksList.value = []
      bankCardInfo.bankId = null
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "Bank" && element.bankType === 'BANK') {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "Crypto" && element.bankType === 'CRYPTO') {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "e-Wallet" && element.bankType === 'EWALLET') {
          banksList.value.push(element);
        }
      })
    }
    const submitBankCard = () => {
      bankCardFormRef.value
        .validate()
        .then(() => {
          addBankCard(bankCardInfo).then((response) => {
            if (response.code === 0) {
              message.success("success");
              bankCardModalState.visible = false;
              loadCards();
            }
          }).catch((error) => {
            console.log(error.message);
          });
        }).catch((error) => {
        console.log("error", error);
      });
    };
    const bankCardRules = {
      cardNumber: [
        // {
        //   required: true,
        //   message: "Please enter card number",
        //   trigger: "blur",
        // },
        {
          validator: validateBankLength,
          trigger: "blur",
        }
      ],
      cardAccount: [
        {
          required: true,
          message: "Card account is required",
          trigger: "blur"
        }
      ]
    };
    const unbindBankCard = (card) => {
      Modal.confirm({
        title: "Remove " + card.bankName + "?",
        content: "Are you sure you want to remove " + card.bankName + "?",
        icon: createVNode(ExclamationCircleOutlined),
        width: "100%",
        onOk() {
          deleteBankCard(card.id
).then((res) => {
            if (res.code === 0) {
              for (let i = 0; i < personalState.bankCardList.length; i++) {
                if (personalState.bankCardList[i].id === card.id) {
                  personalState.bankCardList.splice(i, 1);
                }
              }
            }
          }).catch((e) => {
            console.log("error", e);
          });
        }
      });
    };
    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardFormRef,
      bankCardInfo,
      bankCardRules,
      submitBankCard,
      bankCardModal,
      unbindBankCard,
      showCard,
      isCardActive,
      bankName,
      bankTypes,
      selectBankType,
      selectedBankType,
      banksList,
      searchRecord,
      dataSource,
      validateBankLength,
      imgURL
    };
  }
});
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
:deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input) {
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

.account-container {
  .account-content-wrapper {
    .bank-card-list {
      padding-top: 20px;
      padding-right: 220px;
      padding-left: 40px;

      .bank-card-item {
        margin-bottom: 20px;
        padding: 0 10px;
        width: 300px;
        height: 200px;
        border-radius: 5px;
        background-image: linear-gradient(to right, #de4545, #db7e42);
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: -260px;

        cursor: pointer;
        transition: all 0.3s ease-in;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        box-shadow: -5px 0 10px rgba(0, 0, 0, 0.6);
        // filter: grayscale(0.3);
        transform: skewX(5deg);

        .icon {
          position: absolute;
          left: 5px;
          bottom: 5px;
          width: 30px;
          img {
            width: 100%;
          }
        }
        &.active {
          // background: #2b2b4b;
          // margin-top: -50px;
          // transform: rotate3d(1, 1, 1, 360deg);
          flex-direction: column;
          // margin-right: -60px;
          margin: 0 -60px 0 0px;

          filter: none;
          .icon {
            width: 80px;
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
          &:hover {
            &:before {
              -webkit-animation: shine 2s;
              animation: shine 2s;
            }
          }
        }
        .txt-center {
          position: absolute;
          padding-top: 10px;
          transform: rotateZ(-90deg);
          left: 0;
          bottom: 35px;
          top: 0;
          margin: auto;
          transform-origin: 50% 50%;
          width: 200px;
          width: 160px;
          text-overflow: ellipsis;
          height: 160px;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.3s ease-in-out;
        }
        .cards {
          gap: 10px;
          margin-top: 10px;
          justify-content: center;
          width: 100%;
          text-align: center;
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
          display: none;
          top: 10px;
          left: 10px;
        }
        svg {
          fill: #ffffff;
          width: 20px;
        }
        .card-num-box {
          // padding: 40px 0 0;
          width: 70%;
          padding-right: 20px;
          overflow-wrap: break-word;
          white-space: pre-wrap;
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
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 100%
          );
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
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
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
@media (max-width: 768px) {
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
@media (max-width: 768px) {
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
          // background-image: url("../../assets/images/account/bank_card_bg.png");
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

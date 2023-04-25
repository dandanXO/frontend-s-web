<template>
  <div>
    <div class="menu-title-container">
      <!-- <span class="menu-title">Withdraw Bank Card</span> -->
    </div>
    <div class="q-pa-md">
      <div class="account-title-container">
        <span class="account-title">Select Card</span>
      </div>
      <div class="account-content">
        <div class="account-tip-text wbot">
          <RiSpamLine /> Please register for a withdrawal bank account below to
          be updated
        </div>
        <div class="addbuttons"></div>
        <div class="flex-box flex-wrap bank-card-list">
          <template 
            v-for="(bc, index) in personalState.bankCardList"
            :key="bc.id"
          >
          <div
            class="bank-card-item"
            :class="{
              active: index === isCardActive,
              inactive: index > isCardActive
            }"
            v-if="bc.bankName"
            @click="showCard(bc, index)"
          >
            <div class="icon"><img v-if="bc.bankIcon" :src="imgURL + bc.bankIcon"></div>
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
          </template>
          <div
            class="flex-box flex-align-center flex-justify-center bank-card-item add-bank-card"
            @click="bankCardModal('bank')"
          >
            <RiLink />
            Add Bank Card
          </div>
        </div>
      </div>
    </div>
    <div class="account-title-container bindunbind">
      <span class="account-title">Bank Card Unbind Record</span>
    </div>
    <div class="account-content last bindunbind">
      <div class="searchbar">
        <q-form layout="inline" :model="searchForm">
          <div class="left">
            <q-input filled v-model="searchForm.start">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="searchForm.start" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="searchForm.end">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="searchForm.end" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn label="Search For" />
          <!-- <q-form-item>
            <button class="common-btn outline search-btn" type="submit">
              Search For
            </button>
          </q-form-item> -->
        </q-form>
      </div>
      <div class="unbind-record-wrapper">
        <q-table :columns="columns"></q-table>
      </div>
    </div>
    <q-dialog v-model="bankCardModalState.visible" persistent>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section v-if="!isVirtual" class="q-mb-md">
          <div class="text-h6">Add a bank card</div>
        </q-card-section>
        <q-card-section v-if="isVirtual" class="q-mb-md">
          <div class="text-h6">Add a virtual currency</div>
        </q-card-section>
        <q-form>
          <div v-if="!isVirtual">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <q-select
                  v-model="selectedBankType"
                  filled
                  :options="[{ name: 'Bank' }, { name: 'Crypto' }, { name: 'e-Wallet' }]"
                  label="Bank Type"
                  color="white"
                  label-color="grey"
                  option-label="name"
                  option-value="name"
                  @update:model-value="selectBankType(opt)"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12">
                <q-select
                  ref="bankCardRef"
                  class="q-mb-md"
                  color="white"
                  filled
                  label-color="grey"
                  v-model="bankCardInfo.bankId"
                  :options="banksList"
                  option-value="id"
                  option-label="name"
                  label="Select bank"
                  :rules="[(val) => !!val || 'Please select a bank']"
                  lazy-rules
                  emit-value
                  map-options
                >
                  <template v-slot:selected-item="scope">
                    <q-item-section avatar>
                      <img v-if="scope.opt.bankIcon" style="width: 30px; margin-top: 10px; margin-bottom: 10px;" :src="imgURL + scope.opt.bankIcon">
                    </q-item-section>
                    <q-item-section>
                      <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img v-if="scope.opt.bankIcon" style="width: 30px; margin-top: 10px; margin-bottom: 10px;" :src="imgURL + scope.opt.bankIcon">
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <div v-if="isVirtual">
            <q-input
              filled
              ref="bankCardRef"
              class="q-mb-md"
              v-model="bankName"
              disable
              readonly
              label="Bank Name"
              color="white"
            />
          </div>
          <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAccount"
            label="Card Account"
            :rules="cardAccountRules"
            lazy-rules
            :disable="true"
            ref="cardAccountRef"
            color="white"
          />
          <q-input
            filled
            class="q-mb-md"
            v-model="bankCardInfo.cardNumber"
            label="Card Number"
            :rules="cardNumberRules"
            ref="cardNumberRef"
            color="white"
          />
          <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAddress"
            label="Card Address"
            :rules="cardAddressRules"
            ref="cardAddressRef"
            color="white"
          />
          <div class="flex flex-center">
            <q-btn
              class="q-mr-md"
              label="Cancel"
              @click="bankCardModalState.visible = false"
            />
            <q-btn color="brand" label="Confirm" @click="submitBankCard" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- <q-dialog
      wrap-class-name="bankModal"
      width="100%"
      v-model:visible="virtualCurrencyModalState.visible"
      :footer="null"
    >
      <div class="modal-head-title">Add a virtual currency</div>
      <q-form
        ref="virtualCurrencyFormRef"
        :hideRequiredMark="true"
        :model="bankCardInfo"
        :colon="false"
        :label-col="{ span: 8 }"
      >
        <q-input
          v-model:value="virtualCurrencyInfo.wallet"
          label="Card Account"
          placeholder="Enter card account"
        />
        <q-input
          v-model:value="virtualCurrencyInfo.digitalCurrency"
          label="Digital Currency"
          placeholder="Enter digital currency"
        />
        <q-input
          v-model="virtualCurrencyInfo.digitalCurrency"
          label="Digital Currency"
          placeholder="Enter digital currency"
          disable
        />

        <q-input
          v-model="virtualCurrencyInfo.protocol"
          label="Protocol"
          placeholder="Enter protocol"
          disable
        />
        <q-btn color="brand" type="submit" @click="submitVirtualCurrency">
          Confirm
        </q-btn>
      </q-form>
    </q-dialog> -->
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
// import { Modal, message } from "ant-design-vue";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { RiSpamLine, RiLink, RiLinkUnlink } from "vue-remix-icons";
// import { loadMemberInfo, loadBanks, loadBankCards, addBankCard, deleteBankCard } from "@/api/personal/personal";
// import moment from "moment";
import { api } from "boot/axios"
import { useQuasar } from "quasar";
import { userStore } from "stores/index";

import { useRouter } from "vue-router";
var qs = require("qs");
export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RiSpamLine, RiLink, RiLinkUnlink
  },
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const isCardActive = ref();
    const searchForm = reactive({
      start: "",
      end: ""
    });
    const imgURL = process.env.IMAGE_CDN + '/'
    const columns = [
      {
        title: "Bank Name",
        dataIndex: "name",
        key: "name",
        slots: { title: "customTitle", customRender: "name" }
      },
      {
        title: "Account Number",
        dataIndex: "age",
        key: "age"
      },
      {
        title: "Branch",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Bind Time",
        key: "tags",
        dataIndex: "tags",
        slots: { customRender: "tags" }
      },
      {
        title: "Unbind Time",
        key: "action",
        slots: { customRender: "action" }
      }
    ];

    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    onMounted(() => {
      api.get("session/member").then((response) => {
        if (response.code === 0) {
          personalState.memberInfo = response.data;

          if (personalState.memberInfo.birthday > 0) {
            personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
          }
        }
      }).catch((error) => {
        console.log("error", error);
      });
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
      api.get("/session/bankCard").then((res) => {
        const response = res.data
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
    const router = useRouter();
    const bankName = ref();
    const banksList = ref([]);
    const isVirtual = ref(false)
    const bankCardModal = (type) => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "" || store.realName == null) {
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
        if (bankCardModalState.banks.length === 0) {
          api.get("/session/withdraw/card").then((ret) => {
            const res = ret.data
            if (res.code === 0) {
              bankCardModalState.banks.push(...res.data);
              selectBankType()
            }
          }).catch((e) => {
            console.log("error", e);
          });
        }
      }
      })
    };

    const selectedBankType = ref('Bank')
    const selectBankType = () => {
      bankCardInfo.bankId = "";
      banksList.value = []
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "Bank" && element.bankType === 'BANK') {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "Crypto" && element.bankType === 'CRYPTO') {
          const isCrypto = ref(true)
          banksList.value.push(element);
        }
        if (selectedBankType.value === "e-Wallet" && element.bankType === 'EWALLET') {
          const isEWallet = ref(true)
          banksList.value.push(element);
        }
      })
    }
    const submitBankCard = () => {
      bankCardRef.value.validate();
      cardAccountRef.value.validate();
      cardAddressRef.value.validate();
      cardNumberRef.value.validate();
      if (bankCardRef.value.hasError || cardAccountRef.value.hasError  || cardAddressRef.value.hasError || cardNumberRef.value.hasError) {
      }
      else {
          api.post("/session/bankCard", qs.stringify(bankCardInfo)).then((res) => {
            const response = res.data
            if (response.code === 0) {
              bankCardModalState.visible = false;
              $q.notify({
                color: "positive",
                position: "top",
                message: "Card Added",
                icon: "check_circle_outline"
              });
              loadCards();
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: response.message,
              //   icon: "report_problem"
              // });
            }
          }).catch((error) => {
            console.log("error", error);
          });


      }
    };
    const unbindBankCard = (card) => {
      console.log(card)
      const dialog = $q.dialog({
        class: "q-px-md q-pt-md",
        title: "Remove " + card.bankName + "?",
        message: "Are you sure you want to remove " + card.bankName + "?",
        ok: {
          push: true,
          color: 'deep-orange',
          label: "Confirm",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: '',
          label: "Cancel",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
          api.post(`/session/bankCard/${card.id}?_method=delete`).then((res) => {
            const response = res.data
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Success",
                icon: "check_circle_outline"
              });
              loadCards();
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: response.message,
              //   icon: "report_problem"
              // });
            }

          })
        })
    };

    //add virtual card
    // const virtualCurrencyModalState = reactive({
    //   visible: false,
    //   banks: []
    // });
    // const virtualCurrencyFormRef = ref();
    // const virtualCurrencyInfo = reactive({
    //   wallet: undefined,
    //   digitalCurrency: 'SGD',
    //   protocol: 'protocol_01'
    // });
    // const virtualCurrencyModal = () => {
    //   virtualCurrencyInfo.bankId = undefined;
    //   virtualCurrencyInfo.cardNumber = "";
    //   virtualCurrencyInfo.cardAccount = "";
    //   virtualCurrencyInfo.cardAddress = "";
    //   virtualCurrencyModalState.visible = true;
    //   if (virtualCurrencyModalState.banks.length === 0) {
    //     loadBanks(3).then((res) => {
    //       if (res.code === 0) {
    //         virtualCurrencyModalState.banks.push(...res.data);
    //       }
    //     }).catch((e) => {
    //       console.log("error", e);
    //     });
    //   }
    // };
    // const submitvirtualCurrency = () => {

    // };
    // const virtualCurrencyRules = {
    //   cardNumber: [
    //     {
    //       required: true,
    //       message: "card number is required",
    //       trigger: "blur",
    //     },
    //     {
    //       min: 6,
    //       max: 12,
    //       message: "Length should be 6 to 12",
    //       trigger: "blur",
    //     }
    //   ],
    //   cardAccount: [
    //     {
    //       required: true,
    //       message: "card account is required",
    //       trigger: "blur"
    //     }
    //   ],
    //   cardAddress: [
    //     {
    //       required: true,
    //       message: "card address is required",
    //       trigger: "blur"
    //     }
    //   ]
    // };
    let validateBankLength = (val) => {
        if (selectedBankType.value === 'Bank') {
         return (val.length > 5 && val.length < 13) || 'Length should be 6 to 12 characters'
        } else if (selectedBankType.value === 'Crypto') {
          return (val.length > 33 && val.length < 38) || 'Length should be 34 to 37 characters.'
        } else if (selectedBankType.value === 'e-Wallet') {
          return (val.length > 10 && val.length < 12) || 'Length should be 11 characters.'
        }
    }
    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardInfo,
      submitBankCard,
      bankCardModal,
      unbindBankCard,
      // virtualCurrencyModalState,
      // virtualCurrencyFormRef,
      // virtualCurrencyInfo,
      // virtualCurrencyRules,
      // submitvirtualCurrency,
      // virtualCurrencyModal,
      showCard,
      isCardActive,
      bankName,
      isVirtual,
      bankCardRef,
      cardNumberRef,
      cardAccountRef,
      cardAddressRef,
      cardNumberRules: [
        val => (val && val.length > 0) || 'Card number is required',
        val => (/^\d+$/.test(val)) || 'Only numbers are allowed',
        val => validateBankLength(val)
      ],
      cardAccountRules: [
         val => (val && val.length > 0) || 'Card Account is required',
      ],
      cardAddressRules: [
      ],
      selectedBankType,
      selectBankType,
      banksList,
      imgURL
    };
  }
});
</script>

<style lang="scss">
.account-title-container {
  margin: 10px 0;
  font-size: 20px;
}
.account-content {
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

.bank-card-list {
  max-width: 300px;
  margin: 100px auto;
  padding: 15% 0 0;
  display: flex;
  flex-wrap: wrap;

  .bank-card-item {
    border-radius: 5px;
    background-image: linear-gradient(90deg, #de4545, #db7e42);
    background-size: cover;
    display: flex;
    justify-content: center;

    cursor: pointer;
    transition: all 0.3s ease-in;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    box-shadow: -5px 0 10px rgb(0 0 0 / 60%);
    width: 100%;
    max-width: 300px;
    margin: 0;
    margin-top: -40%;
    flex-direction: column;
    align-items: center;
    height: 150px;
    transform: none;
    
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
      // margin-right: -60px;
      margin-bottom: 30%;
      padding-bottom: 10%;

      filter: none;
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
      &:hover {
        &:before {
          -webkit-animation: shine 2s;
          animation: shine 2s;
        }
      }
    }
    &.inactive {
      margin-top: -40%;
    }
    .txt-center {
      left: 0px;
      bottom: 0;
      top: 0;
      margin: auto;
      width: 200px;
      text-overflow: ellipsis;
      height: unset;
      overflow: hidden;
      white-space: nowrap;
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
.addbuttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
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
.bank-card-list {
  max-width: 300px;
  margin: 100px auto 0;
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
      left:  4px;
      top: 4px;
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
    .txt-center {
      transform: none;
      padding-top: 13px;
      width: 250px;
      text-align: center;
      margin-left: 30px;
    }
    &.active {
      margin-bottom: 30%;
      padding-bottom: 10%;
      .unlink-btn {
        display: block;
      }
    }
    &.inactive {
      margin-top: -40%;
    }
  }
}
</style>

<template>
  <q-dialog v-model="isShowModal" class="withdrawal-modal" no-backdrop-dismiss no-esc-dismis>
    <div class="withdrawal-modal-view">
      <div class="withdrawal-modal-view-top">
        <div class="withdrawal-modal-view-top--title">Withdrawal</div>
        <div class="withdrawal-modal-view-top--img">
          <!-- <img class="top-bg" src="../../assets/images/common/content-frame-top-short.png" /> -->
        </div>

        <q-btn
          dense
          rounded
          icon="close"
          class="withdrawal-modal-view-top--close bg-yellow text-black popout-close"
          v-close-popup
        />
      </div>
      <div class="withdrawal-modal-view-middle">
        <q-card class="withdrawal-summary">
          <div class="balance">
            <div class="title">Cash Balance</div>
            <span class="amount">{{ store.balance.toFixed(2) }}</span>
          </div>

          <div class="separator"></div>

          <div class="withdrawable">
            <div class="title">Withdrawable</div>
            <span class="amount">
              {{
                withdrawalMethods[withdrawalDialogTab].withdrawableBalance >= 0
                  ? withdrawalMethods[withdrawalDialogTab].withdrawableBalance.toFixed(2)
                  : "0.00"
              }}
            </span>
          </div>
        </q-card>

        <q-card class="bank-account-container" v-if="bankCardList.length > 0">
          <div class="top-wrapper">
            <div class="title">Choose Bank Account</div>
          </div>

          <q-card-section class="mid-wrapper">
            <div class="w-form-item w-form-item--bankcard">
              <div class="w-form-input">
                <q-select
                  ref="cardRef"
                  filled
                  dense
                  clearable
                  v-model="withdrawInfo.cardId"
                  @update:model-value="onCardChanged"
                  :options="bankCardList"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || 'Please Select A Bank Card']"
                  lazy-rules
                  hide-bottom-space
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar v-if="scope.opt.bankIcon">
                        <img style="width: 30px" :src="imgURL + '/payment/' + scope.opt.bankIcon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          Acc No. ****{{
                            scope.opt.cardNumber.slice(scope.opt.cardNumber.length - 4, scope.opt.cardNumber.length)
                          }}
                        </q-item-label>
                        <q-item-label>
                          IFSC
                          {{ scope.opt.cardAddress }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:selected-item="scope">
                    <q-item-section avatar v-if="scope.opt.bankIcon">
                      <img
                        style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                        :src="imgURL + '/payment/' + scope.opt.bankIcon"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                        Acc No. {{ scope.opt.cardNumber }}
                      </q-item-label>
                      <q-item-label>
                        IFSC
                        {{ scope.opt.cardAddress }}
                      </q-item-label>
                    </q-item-section>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>

          <div class="bot-wrapper">
            <div class="bank-card-item" @click="goToBank()">
              <div class="card-icon">
                <q-icon key="md" size="md" name="add" />
              </div>
              <div class="card-label">{{ $t("btn.addNewAccount") }}</div>
            </div>
          </div>
        </q-card>

        <q-card class="withdrawal-amount-container">
          <template v-if="bankCardList.length === 0">
            <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
              <div class="top-wrapper">
                <div class="title">Account Number</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  lazy-rules
                  ref="bankNumberRef"
                  placeholder="Enter Account Number"
                  v-model="withdrawReadOnlyInfo.cardNumber"
                  :rules="[(_) => isValidCardNumber()]"
                  :readonly="bankCardList.length > 0 ? true : false"
                  hide-bottom-space
                ></q-input>
              </div>
            </div>
            <div class="w-form-item w-form-item--bankcard" v-if="isNoBankCard">
              <div class="top-wrapper">
                <div class="title">Bank IFSC Code</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  lazy-rules
                  ref="bankAddressRef"
                  placeholder="Enter Bank IFSC Code"
                  v-model="withdrawReadOnlyInfo.cardAddress"
                  :rules="[(_) => isValidCardAddress()]"
                  :readonly="bankCardList.length > 0 ? true : false"
                  hide-bottom-space
                ></q-input>
              </div>
            </div>
          </template>

          <div class="top-wrapper">
            <div class="title">
              Withdrawal Amount ({{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMin) }} -
              {{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMax) }} RS)
            </div>
          </div>

          <div class="mid-wrapper">
            <q-input
              type="number"
              ref="amountRef"
              filled
              dense
              clearable
              placeholder="Withdraw Amount"
              v-model="withdrawInfo.amount"
              :rules="[
                (val) => !!val || 'Please Enter Withdraw Amount',
                (val) => val > 0 || 'Withdraw Amount Must Be Greater Than 0',
                (val) =>
                  val <= withdrawalMethods[withdrawalDialogTab].withdrawableBalance || `Withdraw Amount Insufficient`,
                (val) =>
                  (val >= withdrawalMethods[withdrawalDialogTab].withdrawMin &&
                    val <= withdrawalMethods[withdrawalDialogTab].withdrawMax) ||
                  `Withdraw Amount Must In Between ${withdrawalMethods[withdrawalDialogTab].withdrawMin} - ${withdrawalMethods[withdrawalDialogTab].withdrawMax}`
              ]"
              lazy-rules
              hide-bottom-space
            ></q-input>
          </div>

          <div class="bot-wrapper">
            <div class="info">
              <div class="desc-wrapper">
                <div class="yel-dot"></div>
                <div class="desc">{{ $t("withdraw.withdrewAmount") }}</div>
              </div>
              <div class="desc">
                RS:{{
                  withdrawalMethods[withdrawalDialogTab].withdrawMax -
                  withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount
                }}
              </div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="yel-dot"></div>
                <div class="desc">{{ store.vip }} Daily Limit</div>
              </div>
              <div class="desc">RS:{{ withdrawalMethods[withdrawalDialogTab].withdrawMax }}</div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="yel-dot"></div>
                <div class="desc">Remain Wagers</div>
              </div>
              <div class="desc">RS:{{ withdrawalMethods[withdrawalDialogTab].remainWagers }}</div>
            </div>
          </div>
        </q-card>

        <template v-if="bankCardList.length > 0">
          <ConfirmButton
            label="Submit"
            :confirmFunc="submitWithdraw"
            :isLoading="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
          ></ConfirmButton>
        </template>
        <template v-else>
          <ConfirmButton
            label="Submit"
            :confirmFunc="submitWithdrawBank"
            :isLoading="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
          ></ConfirmButton>
        </template>

        <div class="bottom-tnc">
          <div class="note-title">Note:</div>
          <div class="note">
            <span>3%+6Rs</span>
            of the withdrawal amount will be deducted as
            <span>bank commission</span>
          </div>
          <div class="note">
            Please double check the withdrawal information, if withdrawal failedor you have any other questions, please
            contact CS 24/7
          </div>
        </div>
      </div>
      <div class="withdrawal-modal-view-bottom"></div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isShowRedirectAddBankModal">
    <q-card style="width: 100%; padding: 20px" class="bg-dark text-white text-center">
      <q-card-section class="q-mb-md">Please Add Account</q-card-section>
      <router-link to="/account/bank"><q-btn label="OK" color="brightbtn" /></router-link>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import ConfirmButton from "../../atoms/ConfirmButton.vue";
import { convertToCommaAmount } from "boot/utils";

// modal
const isLoadingContent = ref(false);
const isShowModal = ref(false);
const open = () => {
  isShowModal.value = true;
  isLoadingContent.value = true;

  refreshBalance();
  getWithdrawalMethods();
  loadCards();
};

defineExpose({
  open
});

// withdraw component
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = process.env.IMAGE_CDN;

const refreshBalance = () => {
  if (store.token) store.getBalance();
};

const isLoadingWithdrawalMethod = ref(false);
const withdrawalDialogTab = ref("BANK");
const withdrawalMethods = reactive({ BANK: {}, UPI: {} });
const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  let cbCount = 0;

  const checkCb = () => {
    if (cbCount === 2) isLoadingWithdrawalMethod.value = false;
  };

  api.get("/session/withdraw/entrance").then((response) => {
    if (response.code === 0) {
      for (let i = 0, l = response.data.length; i < l; i++) {
        const currentData = response.data[i];
        withdrawalMethods[currentData.code] = currentData;
      }
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: response.message,
        icon: "report_problem"
      });
    }

    cbCount++;
    checkCb();
  });

  if (bankCardList.value.length === 0) {
    api
      .get("/session/withdraw/card")
      .then((res) => {
        if (res.code === 0) {
          res.data.forEach((e) => {
            bankCardField.bankId = e.id;
          });
        }
      })
      .catch((e) => {
        console.log("error", e);
      })
      .then(() => {
        cbCount++;
        checkCb();
      });
  } else {
    cbCount++;
    checkCb();
  }
};

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);
const isNoBankCard = computed(() => {
  return bankCardList.value.length === 0;
});
const loadCards = () => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then((res) => {
      if (res.code === 0) {
        bankCardList.value = [];
        bankCardList.value.push(...res.data);

        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isLoadingBankCard.value = false;
    });
};

const cardRef = ref();
const amountRef = ref();
const bankAddressRef = ref();
const bankNumberRef = ref();
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: ""
});
const withdrawReadOnlyInfo = reactive({
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: ""
});
const bankCardField = reactive({
  bankId: undefined,
  cardAccount: store.realName,
  cardNumber: "",
  cardAddress: "",
  withdrawCode: "",
  amount: ""
});
watch(withdrawalDialogTab, () => {
  withdrawInfo.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;

  withdrawInfo.cardId = null;
  withdrawInfo.amount = "";

  withdrawReadOnlyInfo.cardAccount = "";
  withdrawReadOnlyInfo.cardNumber = "";
  withdrawReadOnlyInfo.cardAddress = "";
});

const onCardChanged = () => {
  bankCardList.value.forEach((e) => {
    if (e.id === withdrawInfo.cardId) {
      withdrawReadOnlyInfo.cardAccount = e.cardAccount;
      withdrawReadOnlyInfo.cardNumber = e.cardNumber;
      withdrawReadOnlyInfo.cardAddress = e.cardAddress || "-";
    }
  });
};

const isShowRedirectAddBankModal = ref(false);
const isSubmitDisable = ref(false);
const submitWithdraw = () => {
  isSubmitDisable.value = true;
  if (bankCardList.value.length === 0) {
    isShowRedirectAddBankModal.value = true;
    isSubmitDisable.value = false;
  } else {
    // cardRef.value.validate();
    amountRef.value.validate();

    $q.loading.show({
      message: "Withdrawing..."
    });

    // cardRef.value.hasError ||
    if (amountRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
    } else {
      withdrawGo(() => {
        isSubmitDisable.value = false;
      });
    }
  }
};

const submitWithdrawBank = async () => {
  isSubmitDisable.value = true;
  if (bankCardList.value.length === 0) {
    amountRef.value.validate();
    bankAddressRef.value.validate();
    bankNumberRef.value.validate();

    if (amountRef.value.hasError || bankAddressRef.value.hasError || bankNumberRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
      return;
    }

    bankCardField.cardNumber = withdrawReadOnlyInfo.cardNumber;
    bankCardField.cardAddress = withdrawReadOnlyInfo.cardAddress;
    bankCardField.amount = withdrawInfo.amount;
    bankCardField.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;

    // console.log(withdrawalMethods[withdrawalDialogTab.value].withdrawableBalance,'sss')

    // console.log(withdrawalMethods[withdrawalDialogTab].withdrawableBalance, "...");
    // console.log(withdrawableAmt);

    // if (withdrawInfo.amount > withdrawalMethods[withdrawalDialogTab.value].withdrawableBalance) {
    // $q.notify({
    //   color: "negative",
    //   position: "top",
    //   message: "Insufficient amount",
    //   icon: "report_problem"
    // });
    // } else {
    api
      .post("/session/withdrawAndBankCard", qs.stringify(bankCardField))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Withdrawal Submit Succeed",
            icon: "check_circle_outline"
          });
          // props.loadCards();
          refreshBalance();
          getWithdrawalMethods();
          isShowModal.value = false;
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .then(() => {
        isSubmitDisable.value = false;
      });
    // }
  } else {
    // cardRef.value.validate();
    amountRef.value.validate();

    $q.loading.show({
      message: "Withdrawing..."
    });

    // cardRef.value.hasError ||
    if (amountRef.value.hasError) {
      $q.loading.hide();
      isSubmitDisable.value = false;
    } else {
      withdrawGo(() => {
        isSubmitDisable.value = false;
      });
    }
  }
};

const withdrawGo = (callback) => {
  withdrawInfo.withdrawCode = withdrawalMethods[withdrawalDialogTab.value].code;
  api
    .post("/session/withdraw/", qs.stringify(withdrawInfo))
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Withdrawal Submit Succeed",
          icon: "check_circle_outline"
        });

        refreshBalance();
        getWithdrawalMethods();

        isShowModal.value = false;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: response.message,
          icon: "report_problem"
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      $q.loading.hide();
      callback && callback();
    });
};

const goToBank = () => {
  router.push("/account/bank");
};

// NOTE: modal doesn't fire onMounted when open 2nd time.
// onMounted(() => {
//   refreshBalance();
//   getWithdrawalMethods();
//   loadCards();
// });

const isValidCardNumber = () => {
  const { cardNumber } = withdrawReadOnlyInfo;

  const result = !cardNumber ? "Please Enter Card Number" : true;
  return result;
};

const isValidCardAddress = () => {
  const { cardAddress } = withdrawReadOnlyInfo;
  const result = !cardAddress
    ? "Please Enter Bank Ifsc Code"
    : cardAddress.length < 3
    ? "Bank IFSC Code Must Be More Than 3 Characters"
    : true;
  return result;
};
</script>

<style lang="scss">
.withdrawal-modal-view {
  width: 450px;
  margin: auto;

  .withdrawal-modal-view-top {
    // background: url(../../assets/images/common/content-frame-top-short.png) no-repeat top center/contain;
    position: relative;
    margin-top: 40px;

    &--title {
      position: absolute;
      top: 40%;
      width: 100%;

      text-align: center;
      font-family: Helvetica;
      font-size: 2rem;
      font-weight: 700;
      text-transform: capitalize;
      background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;
    }

    &--close {
      position: absolute;
      right: 0;
      top: 10%;
    }

    &--img {
      position: relative;

      img.top-bg {
        display: block;
        width: 100%;
        visibility: hidden;
      }
    }
  }

  .withdrawal-modal-view-middle {
    position: relative;
    // background: url(../../assets/images/common/content-frame-middle-short.png) round top/100% auto;
    min-height: 435px;
    padding: 16px;
    margin-top: -1px;

    &--img {
      img {
        display: block;
        width: 100%;
        height: auto;
      }
    }

    .withdrawal-summary {
      font-family: "Manrope", sans-serif;
      border-radius: 10px;
      background: #373c3d;
      padding: 1rem;
      margin-top: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;

      text-align: center;
      font-size: 1.1rem;
      font-weight: 700;
      aspect-ratio: 335/82;

      .balance {
        margin: 0 0 0 1rem;
      }

      .withdrawable {
        margin: 0 1rem 0 0;
      }

      .separator {
        width: 2px;
        height: 3rem;
        background: linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, #fff 51.56%, rgba(217, 217, 217, 0) 100%);
      }

      span {
        background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .bank-account-container {
      border-radius: 0.5rem;
      background: rgba(21, 0, 37, 0.2);
      padding: 1rem;
      margin-top: 0;

      .top-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 0.5rem 0;
        .title {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.825rem;
          font-weight: 700;
        }
      }

      .mid-wrapper {
        font-size: 1rem;
        font-weight: 700;
        line-height: 2.25rem;
        background: rgba(21, 0, 37, 0.5);
        margin: 0 -1rem 0.5rem -1rem;
        padding: 0 1rem;
      }

      .bot-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin: 1rem 0 0.5rem 0;

        .bank-card-item {
          padding: 3px;
          border-radius: 8px;
          position: relative;
          transition: 0.3s all;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #150025;
          // background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
          // box-shadow: 0px 2px 0px 0px #1cca6a;
          background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
          .card-label {
            font-size: 1rem;
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

    .withdrawal-amount-container {
      border-radius: 0.5rem;
      background: rgba(21, 0, 37, 0.2);
      padding: 1rem;
      margin-top: 0;

      .top-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 0.5rem 0;
        .title {
          color: white;
          font-size: 0.825rem;
          font-weight: 700;
        }
      }

      .mid-wrapper {
        font-size: 1rem;
        font-weight: 700;
        line-height: 2.25rem;
        background: rgba(21, 0, 37, 0.5);
        border-radius: 1.25rem;
        margin: 0 0 0.5rem 0;
        padding: 0 1rem;
      }

      .bot-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        // margin: 1rem 0 0.5rem 0;
        background: #373c3d;

        .info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          color: white;

          .desc-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            color: #b2bdbf;
            font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: 700;
            font-size: 12px;
            line-height: 20px;
            letter-spacing: 2%;
            vertical-align: middle;
            text-transform: capitalize;

            .yel-dot {
              width: 0.25rem;
              height: 0.25rem;
              background: #ffba2b;
              transform: rotate(45deg);
            }
          }

          .desc {
            font-size: 0.825rem;
            font-weight: 400;
            color: #21ef89;
          }
        }
      }
    }

    .bottom-tnc {
      font-size: 0.825rem;
      text-align: left;
      margin: 10px;

      .note {
        margin: 0 0 1rem 0;

        span {
          background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }

  .withdrawal-modal-view-bottom {
    // background: url(../../assets/images/common/content-frame-bottom-short.png) round top/100% auto;
    min-height: 50px;
    position: relative;
    margin-bottom: 60px;

    @media (max-width: 370px) {
      background-size: 100% 100%;
      background-position: bottom center;
    }

    &:before {
      content: "";
      position: absolute;
      bottom: -40px;
      // background: url(../../assets/images/common/content-frame-down-icon.png) no-repeat center/contain;
      display: block;
      width: 100%;
      height: 30px;
    }
  }
}
</style>

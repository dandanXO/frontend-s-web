<template>
  <div class="withdrawal-modal-view" :class="isInputFocus && 'input-btm'">
    <div class="withdrawal-summary q-mb-md">
      <div class="balance">
        <span class="amount">
          <template v-if="isLoadingWithdrawalMethod"><q-skeleton style="height: 16px" /></template>
          <template v-else>{{ convertToCommaAmount(store.balance, 2) }}</template>
        </span>
        <div class="title">{{ $t("withdraw.cashBalance") }}</div>
      </div>

      <div class="separator"></div>

      <div class="withdrawable">
        <span class="amount">
          <template v-if="isLoadingWithdrawalMethod"><q-skeleton style="height: 16px" /></template>
          <template v-else>
            {{ convertToCommaAmount(withdrawableBalance, 2) }}
          </template>
        </span>
        <div class="title">{{ $t("withdraw.withdrawable") }}</div>
      </div>
    </div>

    <div class="method-title q-mb-sm">{{ $t("withdraw.withdrawCurrency") }}</div>
    <div class="withdraw-methods-currency" v-if="isLoadingWithdrawalMethod">
      <div><q-skeleton style="height: 96px" /></div>
      <div><q-skeleton style="height: 96px" /></div>
      <div><q-skeleton style="height: 96px" /></div>
      <div><q-skeleton style="height: 96px" /></div>
    </div>

    <template v-else>
      <div class="withdraw-methods-currency">
        <div
          class="currency-item"
          v-for="(item, index) in paymentMethodsItems"
          :key="index"
          @click="selectWithdrawCurrency(item)"
          :class="{ active: item.code === selectedWithdraw[0].code }"
        >
          <div class="item-icon"><img :src="imgURL + '/payment/' + item.nodeIcon" /></div>
          <div>{{ item.code }}</div>
          <div class="item-hot-ribbon" v-if="item.hot">
            <img src="../../assets/images/account/ribbon-hot.png" />
          </div>
        </div>
      </div>

      <template v-if="selectedWithdraw">
        <div class="method-title q-mt-md q-mb-sm">{{ $t("withdraw.paymentChannels") }}</div>
        <div class="withdraw-methods-container">
          <template v-for="(item, index) in selectedWithdraw" :key="index">
            <div
              class="method-item"
              @click="goSelectedMethod(item)"
              :class="{ disabled: item.maintenance, active: item.active }"
            >
              <template v-if="item.maintenance">
                <div class="item-detail">
                  <div class="txt-maintenance">
                    <q-icon name="build" size="16px" />
                    {{ $t("withdraw.channelUnderMaintenance") }}
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="item-detail">
                  <div class="txt-title">{{ item.nodeName }}</div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>

      <template v-if="isSelectedMethod">
        <div
          class="bank-account-container"
          v-if="isBankType === 'BANK' && (bankCardList.length === 0 || isAddNewAccount)"
          style="opacity: 0; visibility: hidden; position: absolute"
        >
          <div class="w-form-item w-form-item--bankcard">
            <div class="top-wrapper">
              <div class="title">{{ $t("header.bankName") }}</div>
            </div>
            <div>
              <q-select
                standout
                class="q-pb-xs dialog-input"
                hide-bottom-space
                filled
                v-model="bankCardField.bankId"
                label-color="secondary"
                :options="filteredBankList"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                use-input
                input-debounce="100"
                fill-input
                hide-selected
                @filter="filterBank"
                behavior="menu"
              ></q-select>
            </div>
          </div>
        </div>

        <!-- bank options -->
        <div class="bank-account-container" v-if="bankCardList.length > 0 && !isAddNewAccount">
          <div class="method-title q-mb-sm">
            {{ $t("header.choose") }} {{ displayCardType }} {{ $t("header.account") }}
          </div>
          <div class="mid-wrapper">
            <div class="w-form-item w-form-item--bankcard">
              <div class="w-form-input">
                <q-select
                  ref="cardRef"
                  class="bank-select-input"
                  :loading="isLoadingBankCard"
                  filled
                  dense
                  clearable
                  v-model="withdrawInfo.cardId"
                  @update:model-value="onCardChanged"
                  :options="bankCardList"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || validateBankCardError()]"
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
                    </q-item-section>
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <div class="bot-wrapper">
            <div class="bank-card-item" @click="onAddNewAccount">
              <div class="card-icon">
                <q-icon key="md" size="md" name="add" />
              </div>
              <div class="card-label">{{ $t("btn.addNewAccount") }}</div>
            </div>
          </div>
        </div>

        <div class="withdrawal-amount-container">
          <template v-if="bankCardList.length === 0 || isAddNewAccount">
            <!-- <div class="type-option-container">
              <div class="">Select Type</div>
              <q-select
                class="type-option"
                v-model="typeVal"
                :options="typeOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                filled
                @update:model-value="selectOption"
              />
            </div> -->

            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.firstName") }}</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  type="text"
                  ref="bankFirstNameRef"
                  :placeholder="$t('form.firstName_placeholder')"
                  v-model="bankCardField.firstName"
                  :rules="[(_) => isValidFirstName()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                ></q-input>
              </div>
            </div>

            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.lastName") }}</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  type="text"
                  ref="bankLastNameRef"
                  :placeholder="$t('form.lastName_placeholder')"
                  v-model="bankCardField.lastName"
                  :rules="[(_) => isValidLastName()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                ></q-input>
              </div>
            </div>

            <!-- <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.holderName") }}</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  type="text"
                  ref="bankAccountRef"
                  :placeholder="$t('form.holderName_placeholder')"
                  v-model="bankCardField.cardAccount"
                  :rules="[(_) => isValidCardAccount()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                ></q-input>
              </div>
            </div> -->

            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.phone") }}</div>
              </div>
              <div class="mid-wrapper">
                <!-- :type="['phone', 'cpf', 'cnpj'].includes(typeVal) ? 'number' : 'text'" -->
                <q-input
                  filled
                  dense
                  clearable
                  type="number"
                  ref="bankNumberRef"
                  :placeholder="$t('form.phone_placeholder')"
                  v-model="bankCardField.cardNumber"
                  :rules="[(_) => isValidCardNumber()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                >
                  <template v-slot:prepend>
                    <!-- <template v-if="typeVal === 'phone'"> -->
                    <img class="white-svg" src="../../assets/images/account/input-icon-phone.png" />
                    <span class="prepend-number q-ml-sm">{{ $t("form.prependNumber") }}</span>
                    <!-- </template> -->
                    <!-- <template v-if="typeVal === 'email'">
                      <img class="white-svg" src="../../assets/images/account/input-icon-email.png" />
                    </template>
                    <template v-if="typeVal === 'cpf'">
                      <img class="white-svg" src="../../assets/images/account/input-icon-cpf.png" />
                    </template>
                    <template v-if="typeVal === 'cnpj'">
                      <img class="white-svg" src="../../assets/images/account/input-icon-cnpj.png" />
                    </template>
                    <template v-if="typeVal === 'evp'">
                      <img class="white-svg" src="../../assets/images/account/input-icon-evp.png" />
                    </template> -->
                  </template>
                </q-input>
              </div>
            </div>

            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.cpf") }}</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  type="number"
                  ref="bankAddressRef"
                  :placeholder="$t('form.cpf_placeholder')"
                  v-model="bankCardField.cardAddress"
                  :rules="[(_) => isValidCardAddress()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                >
                  <template v-slot:prepend>
                    <img class="white-svg" src="../../assets/images/account/input-icon-cpf.png" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="w-form-item w-form-item--bankcard">
              <div class="top-wrapper">
                <div class="title">{{ $t("form.email") }}</div>
              </div>
              <div class="mid-wrapper">
                <q-input
                  filled
                  dense
                  clearable
                  type="text"
                  ref="bankEmailRef"
                  :placeholder="$t('form.email_placeholder')"
                  v-model="bankCardField.email"
                  :rules="[(_) => isValidEmail()]"
                  hide-bottom-space
                  @focus="scrollToInput"
                  @blur="isInputFocus = false"
                >
                  <template v-slot:prepend>
                    <img class="white-svg" src="../../assets/images/account/input-icon-email.png" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <div class="top-wrapper">
            <div class="title">
              {{ $t("form.withdrawalAmount") }} ({{ convertToCommaAmount(selectedMethodItem.withdrawMin) }} -
              {{ convertToCommaAmount(selectedMethodItem.withdrawMax) }} {{ store.currency.label }})
            </div>
          </div>
          <div class="mid-wrapper">
            <q-input
              type="number"
              ref="amountRef"
              filled
              dense
              clearable
              :placeholder="$t('form.withdrawalAmount')"
              v-model="withdrawInfo.amount"
              :rules="[
                (val) => !!val || $t('form.withdrawalAmount_rules_01'),
                (val) => val > 0 || $t('form.withdrawalAmount_rules_02'),
                (val) => val <= selectedMethodItem.withdrawableBalance || $t('form.withdrawalAmount_rules_03'),
                (val) =>
                  (val >= selectedMethodItem.withdrawMin && val <= selectedMethodItem.withdrawMax) ||
                  `${$t('form.withdrawalAmount_rules_04')} ${selectedMethodItem.withdrawMin} - ${
                    selectedMethodItem.withdrawMax
                  }`
              ]"
              hide-bottom-space
              @focus="scrollToInput"
              @blur="isInputFocus = false"
            >
              <template v-slot:append>
                <q-btn-group>
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="mín"
                    dense
                    no-caps
                    @click="toggleAmount('min')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="25%"
                    dense
                    no-caps
                    @click="toggleAmount('25')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="50%"
                    dense
                    no-caps
                    @click="toggleAmount('50')"
                  />
                  <q-btn
                    class="minmax-btn"
                    rounded
                    color="black"
                    label="Máx"
                    dense
                    no-caps
                    @click="toggleAmount('max')"
                  />
                </q-btn-group>
              </template>
            </q-input>
          </div>

          <div class="fund-container q-mt-sm q-mb-md">
            <div>
              <span class="fund-title">{{ $t("withdraw.available") }}:</span>
              <q-spinner v-if="isRefreshRemainWager" />
              <span v-else>
                {{ store.currency.value }} {{ convertToCommaAmount(selectedMethodItem.withdrawableBalance) }}
              </span>
            </div>
          </div>

          <div class="bot-wrapper">
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">{{ $t("withdraw.withdrewAmount") }}</div>
              </div>
              <div class="desc desc_white">
                <!-- {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawAmount) }} -->
                {{ store.currency.label }}: {{ selectedMethodItem.withdrawAmount }}
              </div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">{{ $t("withdraw.dailyLimit") }} {{ store.vip }}</div>
              </div>
              <div class="desc desc_white">
                <!-- {{ store.currency.label }}:{{ convertToCommaAmount(withdrawalMethods[withdrawalDialogTab].withdrawMaxAmount) }} -->
                {{ store.currency.label }}: {{ convertToCommaAmount(selectedMethodItem.withdrawMaxAmount) }}
              </div>
            </div>
            <div class="info">
              <div class="desc-wrapper">
                <div class="desc">{{ $t("withdraw.remainWagers") }}</div>
              </div>
              <div class="desc desc_white">
                <div class="remain-wager-wrapper" @click="refreshRemainWager">
                  <q-spinner v-if="isRefreshRemainWager" />
                  <span v-else>
                    {{ store.currency.value }}: {{ convertToCommaAmount(selectedMethodItem.remainWagers, 2) }}
                  </span>
                  <img
                    class="refresh-btn-img"
                    :class="{ rotate: isRefreshRemainWager }"
                    src="../../assets/images/account/refresh-icon.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-if="bankCardList.length > 0 && !isAddNewAccount">
          <div :class="`btn-submit`" @click="submitWithdraw">
            <q-spinner
              v-if="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
              color="white"
              size="2em"
              :thickness="2"
            ></q-spinner>
            <template v-else>{{ $t("btn.submit") }}</template>
          </div>
        </template>

        <template v-else>
          <div :class="`btn-submit`" @click="submitWithdrawBank">
            <q-spinner
              v-if="isLoadingBankCard || isLoadingWithdrawalMethod || isSubmitDisable"
              color="white"
              size="2em"
              :thickness="2"
            ></q-spinner>
            <template v-else>{{ $t("btn.submit") }}</template>
          </div>
        </template>
        <div v-if="selectedMethodItem.tips" class="withdraw-tip-wrapper" v-html="selectedMethodItem.tips"></div>
      </template>
    </template>
  </div>

  <q-dialog width="100%" v-model="userKYCDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" @click="router.go(-1)" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, onActivated, ref, reactive, watch, computed, nextTick } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { convertToCommaAmount } from "src/boot/utils";
import KYCUserForm from "../../components/KYCUserForm.vue";
import { t } from "src/boot/lang";

// withdraw component
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const route = useRoute();
const router = useRouter();

const imgURL = process.env.IMAGE_CDN;

const refreshBalance = () => {
  if (store.token) store.getBalance();
};

const isLoadingWithdrawalMethod = ref(false);
const withdrawalDialogTab = ref("BANK");
const withdrawalMethods = reactive({
  BANK: {
    withdrawAmount: 0,
    withdrawMaxAmount: 0,
    remainWagers: 0,
    withdrawMin: 0,
    withdrawMax: 0,
    withdrawableBalance: 0
  },
  UPI: {}
});

const paymentMethodsItems = ref([]);
const selectedMethodsItems = ref([]);
const listItems = ref([]);

const getWithdrawalMethods = () => {
  isLoadingWithdrawalMethod.value = true;
  let cbCount = 0;

  const checkCb = () => {
    if (cbCount === 2) isLoadingWithdrawalMethod.value = false;
  };

  api.get("/session/nga/withdraw/entrance").then((res) => {
    if (res.code === 0) {
      let bankWithdraws = res.data.withdraws
        .map((withdraw) => {
          return withdraw.children.map((child) => child.children.map((grandchild) => grandchild.children)).flat(2);
        })
        .flat();
      selectedMethodsItems.value = bankWithdraws.flat().sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      let groupedMethods = bankWithdraws.reduce((acc, method) => {
        if (!acc[method.code]) {
          acc[method.code] = method;
        }
        return acc;
      }, {});

      // listItems
      let listCurrency = res.data.withdraws
        .map((withdraw) => {
          return withdraw.children.map((child) => child.children).flat();
        })
        .flat();
      listItems.value = listCurrency.flat().sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      paymentMethodsItems.value = Object.values(groupedMethods).sort((a, b) => {
        if (a.payType < b.payType) return 1;
        if (a.payType > b.payType) return -1;
        return 0;
      });

      selectWithdrawCurrency(paymentMethodsItems.value[0]);
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
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
            bankCardField.withdrawPlatformId = e.code;

            const bankType = e.bankType;
            if (bankType === "BANK") bankList.push(e);
            else if (bankType === "CRYPTO") cryptoList.push(e);
            else if (bankType === "EWALLET") ewalletList.push(e);
          });

          selectBankType();
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

const selectedWithdraw = ref();
const selectWithdrawCurrency = (item) => {
  const filteredMethods = selectedMethodsItems.value.filter((method) => method.code === item.code);
  if (filteredMethods.length > 0) {
    selectedWithdraw.value = filteredMethods;
  }
  isAddNewAccount.value = false;
  goSelectedMethod(selectedWithdraw.value[0]);
};

const isLoadingBankCard = ref(false);
const bankCardList = ref([]);

const displayCardType = computed(() => {
  if (selectedMethodItem.value.payType === "EWALLET") {
    return "eWallet";
  } else if (selectedMethodItem.value.payType === "CRYPTO") {
    return "Crypto";
  }
  return "Bank";
});

const validateBankCardError = () => {
  if (selectedMethodItem.value.payType === "EWALLET") {
    return "Please Select eWallet Card";
  } else if (selectedMethodItem.value.payType === "CRYPTO") {
    return "Please Select Crypto Card";
  }
  return "Please Select Bank Card";
};

const isNoBankCard = ref(false);

const filterCards = (type) => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then((res) => {
      isLoadingBankCard.value = false;

      if (res.code === 0) {
        let filteredData = [];
        if (isBankType.value === "BANK") {
          const bankType = type.bankType ? type.bankType : "BANK";
          filteredData = res.data.filter((item) => item.bankType === bankType);
          const bankCodes = filteredBankList.value.map((bank) => bank.code);
          filteredData = filteredData.filter((item) => bankCodes.includes(item.bankCode));
        } else {
          const typeCode = type.code;
          filteredData = res.data.filter((item) => item.bankCode === typeCode);
        }

        bankCardList.value = [...filteredData];
        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .finally(() => {
      isLoadingBankCard.value = false;
    });
};

const loadCards = () => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then((res) => {
      isLoadingBankCard.value = false;
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
// const bankAddressRef = ref();
const bankFirstNameRef = ref();
const bankLastNameRef = ref();
const bankAccountRef = ref();
const bankNumberRef = ref();
const bankAddressRef = ref();
const bankEmailRef = ref();
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: "",
  withdrawPlatformId: ""
});
const withdrawReadOnlyInfo = reactive({
  cardAccount: store.realName,
  firstName: store.realName ? store.realName.split(",")[0]?.trim() : '',
  lastName: store.realName ? store.realName.split(",")[1]?.trim() : '',
  cardNumber: ""
  // cardAddress: ""
});

const bankCardField = reactive({
  bankId: undefined,
  cardAccount: store.realName,
  firstName: store.realName ? store.realName.split(",")[0]?.trim() : '',
  lastName: store.realName ? store.realName.split(",")[1]?.trim() : '',
  cardNumber: "",
  cardAddress: "",
  email: "",
  withdrawCode: "",
  withdrawPlatformId: "",
  amount: ""
});

watch(
  () => bankCardField.bankId,
  (newValue) => {
    const selectedBank = filteredBankList.value.find((bank) => bank.id === newValue);
    filterCards(selectedBank);
  }
);

watch(withdrawalDialogTab, () => {
  withdrawInfo.cardId = null;
  withdrawInfo.amount = "";
  bankCardField.cardAccount = "";
  bankCardField.firstName = "";
  bankCardField.lastName = "";
  bankCardField.cardNumber = "";
  bankCardField.cardAddress = "";
  bankCardField.email = "";
});

const onCardChanged = () => {
  bankCardList.value.forEach((e) => {
    if (e.id === withdrawInfo.cardId) {
      bankCardField.cardAccount = e.cardAccount;
      bankCardField.firstName = e.firstName;
      bankCardField.lastName = e.lastName;
      bankCardField.cardNumber = e.cardNumber;
      bankCardField.cardAddress = e.cardAddress || "-";
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
    amountRef.value.validate();

    $q.loading.show({
      message: t("btn.withdrawing")
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

const submitWithdrawBank = () => {
  isSubmitDisable.value = true;
  amountRef.value.validate();
  bankNumberRef.value.validate();
  bankAddressRef.value.validate();
  bankEmailRef.value.validate();

  if (
    amountRef.value.hasError ||
    bankNumberRef.value.hasError ||
    bankAddressRef.value.hasError ||
    bankEmailRef.value.hasError
  ) {
    $q.loading.hide();
    isSubmitDisable.value = false;
    return;
  }

  bankCardField.amount = withdrawInfo.amount;
  bankCardField.withdrawCode = selectedMethodItem.value.code;
  bankCardField.withdrawPlatformId = selectedMethodItem.value.withdrawId;
  bankCardField.cardAccount = `${bankCardField.firstName},${bankCardField.lastName}`;

  const formData = { ...bankCardField };

  // if (typeVal.value === "phone") {
  if (!formData.cardNumber.startsWith("+55")) {
    formData.cardNumber = `+55${formData.cardNumber}`;
  }
  // }

  api
    .post("/session/withdrawAndBankCard", qs.stringify(formData))
    .then((response) => {
      isSubmitDisable.value = false;
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.withdrawSuceed"),
          icon: "check_circle_outline"
        });
        refreshBalance();
        getWithdrawalMethods();
        resetSelectedMethod();

        // (bankCardField.cardAccount = store.realName), (bankCardField.cardNumber = "");
        (bankCardField.firstName = store.realName ? store.realName.split(",")[0]?.trim() : ''),
          (bankCardField.lastName = store.realName ? store.realName.split(",")[1]?.trim() : ''),
          (bankCardField.cardNumber = "");
        bankCardField.amount = "";
        withdrawInfo.amount = "";
        bankCardField.bankId = currBankList.value[0].id;
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isSubmitDisable.value = false;
    });
};

const withdrawGo = (callback) => {
  withdrawInfo.withdrawCode = selectedMethodItem.value.code;
  withdrawInfo.withdrawPlatformId = selectedMethodItem.value.withdrawId;
  api
    .post("/session/withdraw/", qs.stringify(withdrawInfo))
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.withdrawSuceed"),
          icon: "check_circle_outline"
        });
        refreshBalance();
        getWithdrawalMethods();
        withdrawInfo.amount = "";
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
  router.push("/account/bank?from=" + route.path);
};

const checkNewUser = () => {
  if (store.realName == "" || store.realName == null) {
    // $q.notify({
    //   color: "negative",
    //   position: "top",
    //   message: t("notify.fillInPersonalDetails"),
    //   icon: "report_problem"
    // });
    router.push(`/withdraw`);
  }
};

const isSelectedMethod = ref(false);

const resetSelectedMethod = () => {
  isSelectedMethod.value = false;
  isAddNewAccount.value = false;
};

const isBankType = ref("BANK");

// const withdrawableBalance = ref();
const withdrawableBalance = computed(() => {
  return selectedMethodItem.value?.withdrawableBalance ?? 0;
});

const selectedMethodItem = ref();
const goSelectedMethod = (item) => {
  // selectedWithdraw.value.forEach((method) => (method.active = false));
  // item.active = true;

  selectedWithdraw.value.forEach((method) => {
    method.active = false;
  });
  item.active = true;
  isSelectedMethod.value = true;
  // debugger;
  selectedMethodItem.value = item;
  // withdrawableBalance.value = item.withdrawableBalance;
  filteredBankList.value = item.bankList;
  isBankType.value = filteredBankList.value[0].bankType;
  bankCardField.bankId = item.bankList[0].id;
  bankCardField.cardNumber = "";
  bankCardField.cardAddress = "";
  bankCardField.email = "";
  withdrawInfo.amount = "";
};

const onAddNewAccount = () => {
  bankCardField.cardNumber = "";
  isAddNewAccount.value = true;
};

onMounted(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
  loadInfo();
});

onActivated(() => {
  getWithdrawalMethods();
  checkNewUser();
  // loadCards();
  loadInfo();
});

const isValidCardNumber = () => {
  const { cardNumber } = bankCardField;
  let result = true;

  result = !cardNumber ? t("form.phone_rules_01") : true;

  const digitCount = cardNumber.match(/\d/g)?.length || 0;
  if (digitCount < 8 || digitCount > 11) {
    return t("form.phone_rules_02");
  }

  if (!/^[0-9]*$/.test(cardNumber)) {
    return t("form.phone_rules_04");
  }

  return result;
};

const cardNumberLabel = ref("");
const cardNumberPlaceholder = ref("");

const selectOption = (option) => {
  bankCardField.cardNumber = "";
  if (option === "phone") {
    cardNumberLabel.value = t("form.phone");
    cardNumberPlaceholder.value = t("form.phone_placeholder");
  } else if (option === "email") {
    cardNumberLabel.value = t("form.email");
    cardNumberPlaceholder.value = t("form.email_placeholder");
  } else if (option === "cpf") {
    cardNumberLabel.value = t("form.cpf");
    cardNumberPlaceholder.value = t("form.cpf_placeholder");
  } else if (option === "cnpj") {
    cardNumberLabel.value = t("form.cnpj");
    cardNumberPlaceholder.value = t("form.cnpj_placeholder");
  } else if (option === "evp") {
    cardNumberLabel.value = t("form.evp");
    cardNumberPlaceholder.value = t("form.evp_placeholder");
  }
};

const isValidCardAddress = () => {
  const { cardAddress } = bankCardField;
  const result = !cardAddress ? t("form.cpf_rules_01") : cardAddress.length !== 11 ? t("form.cpf_rules_02") : true;
  return result;
};

const isValidEmail = () => {
  const { email } = bankCardField;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = !email ? t("form.email_rules_01") : !emailPattern.test(email) ? t("form.email_rules_02") : true;
  return result;
};

const isValidCardAccount = () => {
  const { cardAccount } = bankCardField;
  const result = !cardAccount
    ? t("form.holderName_rules_01")
    : cardAccount.length < 2
    ? t("form.holderName_rules_02")
    : true;
  return result;
};

const isValidFirstName = () => {
  const { firstName } = bankCardField;
  const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/;

  const result = !firstName
    ? t("form.firstName_rules_01")
    : !namePattern.test(firstName)
    ? t("form.firstName_rules_02")
    : true;
  return result;
};

const isValidLastName = () => {
  const { lastName } = bankCardField;
  const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]$/;

  const result = !lastName
    ? t("form.lastName_rules_01")
    : !namePattern.test(lastName)
    ? t("form.lastName_rules_02")
    : true;
  return result;
};

const currBankList = ref([]);
const filteredBankList = ref([]);
const currentCardType = ref("Bank");
const bankList = [];
const cryptoList = [];
const ewalletList = [];

// validation
const isValidBank = () => {
  const { bankId } = bankCardField;

  const result = !bankId ? dialogDisplays.selectionError : true;
  return result;
};

const filterBank = (val, update) => {
  if (!val) {
    update(() => {
      filteredBankList.value = selectedMethodItem.value.bankList;
    });
    return;
  }
  update(() => {
    const result = selectedMethodItem.value.bankList.filter((bank) => {
      const bankName = bank.name.toLowerCase();
      const lowerCaseVal = val.toLowerCase();
      return bankName.includes(lowerCaseVal);
    });
    filteredBankList.value = result;
  });
};

const selectBankType = () => {
  currBankList.value = [];
  bankCardField.bankId = undefined;

  if (currentCardType.value === "Bank") {
    currBankList.value = bankList;
    filteredBankList.value = currBankList.value;
  } else if (currentCardType.value === "Crypto") {
    currBankList.value = cryptoList;
    filteredBankList.value = currBankList.value;
  } else if (currentCardType.value === "EWallet") {
    currBankList.value = ewalletList;
    filteredBankList.value = currBankList.value;
  }
};

const isAddNewAccount = ref(false);

// withdrawalMethods[withdrawalDialogTab].withdrawMin
const toggleAmount = (type) => {
  const method = selectedMethodItem.value;

  switch (type) {
    case "min":
      withdrawInfo.amount = method.withdrawMin;
      break;
    case "25":
      withdrawInfo.amount = method.withdrawMaxAmount * 0.25;
      break;
    case "50":
      withdrawInfo.amount = method.withdrawMaxAmount * 0.5;
      break;
    case "max":
      withdrawInfo.amount = method.withdrawMaxAmount;
      break;
    default:
      break;
  }
};

const isInputFocus = ref(false);

const scrollToInput = () => {
  if (Platform.is.capacitor && Platform.is.android) {
    isInputFocus.value = true;
    nextTick(() => {
      const input = document.activeElement;
      if (input) {
        input.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    });
  }
};

// KYC Dialog
const personalState = reactive({
  memberInfo: {}
});
const userKYCDialog = ref(false);
const openUserKYCDialog = () => {
  userKYCDialog.value = true;
};
const closeUserKYCDialog = () => {
  store.getMemberInfo().then(() => {
    loadInfo();
    userKYCDialog.value = false;
  });
};

const loadInfo = () => {
  personalState.memberInfo = userStore();

  if (!store.guest && personalState.memberInfo.realName === null) {
    openUserKYCDialog();
  }
};

const typeVal = ref("phone");
const typeOptions = [
  {
    label: "Phone",
    value: "phone"
  },
  {
    label: "Email",
    value: "email"
  },
  {
    label: "CPF",
    value: "cpf"
  },
  {
    label: "CNPJ",
    value: "cnpj"
  },
  {
    label: "EVP",
    value: "evp"
  }
];

// remain wager refresh
const isRefreshRemainWager = ref(false);

const refreshRemainWager = () => {
  isRefreshRemainWager.value = true;

  api
    .get("/session/withdraw/withdrawableBalance/refresh")
    .then((res) => {
      selectedMethodItem.value = {
        ...selectedMethodItem.value,
        ...res.data
      };

      isRefreshRemainWager.value = false;
    })
    .catch(() => {
      isRefreshRemainWager.value = false;
    })
    .finally(() => {
      isRefreshRemainWager.value = false;
    });
};
</script>

<style scoped lang="scss">
.withdrawal-modal-view {
  margin: auto;
  width: 95%;

  .withdraw-methods-currency {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .currency-item {
      padding: 8px 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      border: 2px solid #78798580;
      gap: 6px;
      border-radius: 8px;
      color: #ffffffb2;
      background-color: #263349;
      font-size: 12px;
      position: relative;

      &.active {
        border: 2px solid #00B9A1;
        .item-title {
          color: rgba(255, 255, 255, 1);
        }
        &:before {
          content: "";
          height: 20px;
          width: 20px;
          position: absolute;
          bottom: 0;
          right: 0;
          background-image: url(../../assets/images/account/active-tick.png);
          background-size: cover;
        }
      }

      img {
        display: block;
        width: 100%;
        max-width: 50px;
      }

      .item-hot-ribbon {
        position: absolute;
        top: 0;
        left: 0;

        img {
          display: block;
          width: 30px;
        }
      }
    }
  }

  .withdraw-methods-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    flex-direction: column;
    background-color: #161f2d;
    padding: 12px;
    border-radius: 6px;
  }

  .method-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    position: relative;

    .options-picker {
      display: flex;
      gap: 6px;
    }
  }

  .method-title {
    color: #576373;
  }

  .method-item {
    border-radius: 6px;
    background-color: #263349;
    padding: 6px 8px 6px 12px;
    display: flex;
    align-items: center;
    position: relative;
    border: 2px solid #78798580;

    &.disabled {
      cursor: not-allowed;
      backdrop-filter: grayscale(1) brightness(0.7);
      pointer-events: none;
      // opacity: 0.6;
    }

    &.active {
      border: 2px solid #00B9A1;
      .item-title {
        color: rgba(255, 255, 255, 1);
      }
      &:before {
        content: "";
        height: 20px;
        width: 20px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url(../../assets/images/account/active-tick.png);
        background-size: cover;
      }
    }

    .item-icon {
      border-right: 1px solid #4b6185;
      padding-right: 8px;

      img {
        display: block;
        // width: 100%;
        width: 50px;
      }
    }

    .item-detail {
      padding: 6px 6px 6px 8px;
      .txt-title {
        font-size: 11px;
        color: #ffffff;
      }
      .txt-content {
        font-size: 10px;
        color: #576373;
        // white-space: nowrap;
        margin-top: 4px;
      }
      .txt-maintenance {
        color: #f4b975;
        font-size: 11px;
      }
    }
    .item-amount {
      font-size: 10px;
      padding: 6px;
    }
    .item-arrow {
      margin-left: auto;
      width: 30px;
      min-width: 30px;
      max-width: 30px;
    }
  }

  .withdrawal-summary {
    padding: 1rem;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 0.625rem;
    background: #1d2635;

    text-align: center;
    font-family: "Manrope", sans-serif;
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
      background: #2f3e57;
    }

    .title {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 700;
    }

    span {
      color: white;
    }
  }

  .bank-account-container {
    border-radius: 0.5rem;
    // background: rgba(21, 0, 37, 0.2);
    // background-color: #263349;
    padding: 1rem 0 0;
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
      // background: rgba(21, 0, 37, 0.5);
      background-color: #263349;
      // margin: 0 -1rem 0.5rem -1rem;
      padding: 0 1rem;
      border-radius: 6px;
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin: 1rem 0 0.5rem 0;

      .bank-card-item {
        padding: 3px;
        // border-radius: 1.25rem;
        border-radius: 6px;
        // background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
        background-color: #00B9A1;
        position: relative;
        transition: 0.3s all;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;

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

    .bank-select-input {
      :deep(.q-field__append) {
        height: 60px;
      }
    }
  }

  .withdrawal-amount-container {
    border-radius: 0.5rem;
    // background: rgba(21, 0, 37, 0.2);
    padding: 1rem 0;
    margin-top: 0;

    .top-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;

      &.btm-no-space {
        margin-bottom: 0;
      }

      .title {
        color: #637387;
        font-size: 0.825rem;
        font-weight: 600;
      }
    }

    .mid-wrapper {
      font-size: 1rem;
      font-weight: 700;
      line-height: 2.25rem;
      background: #263349;
      border-radius: 0.5rem;
      margin: 0 0 0.5rem 0;
    }

    .minmax-btn {
      font-size: 10px;
      padding: 4px 8px;
      border-right: 1px solid #263349;

      &:last-child {
        border: 0;
      }
      // background: #101114;
    }

    .fund-container {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .fund-title {
        color: #576373;
      }
    }

    .bot-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      // gap: 10px;
      margin: 1rem 0 0.5rem 0;
      // background-color: rgba(74, 56, 185, 0.4);
      background-color: #263349;
      border-radius: 6px;
      padding: 6px;

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        // color: white;
        color: #a9a6bb;
        border-radius: 3.125rem;
        opacity: 0.8;
        // background: linear-gradient(90deg, #157f42 -1.25%, rgba(44, 97, 67, 0) 104.06%);
        padding: 5px 10px;

        .desc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .desc {
          font-size: 0.825rem;
          font-weight: 400;
          &_white {
            color: #ffffff;
          }
        }

        .remain-wager-wrapper {
          display: flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;

          .refresh-btn-img {
            width: 20px;
            height: 20px;

            &.rotate {
              animation: rotateTwice 1s infinite linear;
            }
          }
        }
      }
    }
  }

  @keyframes rotateTwice {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .btn-submit {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    height: 46px;
    width: 100%;
    transition: 0.3s all;
    color: #ffffff;
    margin: auto;
    border-radius: 6px;
    background: linear-gradient(180deg, #00B9A1 0%, #0097B9 100%);
    aspect-ratio: 335/46;

    &:before {
      box-shadow: none;
    }

    &.disabled {
      opacity: 0.7;
    }
  }

  .bottom-tnc {
    font-size: 80%;
    opacity: 0.5;
  }
}

.dialog-input {
  background-color: #263349;
  border-radius: 6px;
}

.withdraw-tip-wrapper {
  background-color: rgba(21, 127, 66, 0.2);
  margin-top: 20px;
  border-radius: 10px;
  padding: 14px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16.2px;
  letter-spacing: 0.045em;
  text-align: left;
  color: #a9a6bb;

  :deep(em) {
    color: #ffae00;
  }
}

.input-btm {
  padding-bottom: 270px;
}

.type-option-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #98a6b4;
  font-size: 12px;
}

.type-option {
  width: 100px;
  font-size: 12px;
  min-height: 0;
  :deep(.q-field__native, q-field--auto-height) {
    min-height: 0px;
  }
}
</style>

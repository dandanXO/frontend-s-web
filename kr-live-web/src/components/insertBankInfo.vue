<template>
  <div
      style="
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    "
  >
    <q-form style="width: 100%;">
      <template v-if="step === 1">
        <q-input
            ref="updateInfoNameRef"
            class="q-mb-md"
            filled
            v-model="updateInfo.cardAccountName"
            :label="$t('lang.bank_account_name')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.enter_bank_account_name')]"
            color="white"
        >
          <template v-slot:prepend>
            <q-icon name="web" />
          </template>
        </q-input>
        <q-input
            ref="updateInfoSurnameRef"
            class="q-mb-md"
            filled
            v-model="updateInfo.cardAccountSurname"
            :label="$t('lang.bank_account_surname')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.enter_bank_account_surname')]"
            color="white"
        >
          <template v-slot:prepend>
            <q-icon name="web" />
          </template>
        </q-input>
        <!-- <q-input
          ref="updateInfoRef"
          class="q-mb-md"
          filled
          v-model="updateInfo.realName"
          label="ชื่อบัญชี (ชื่อตรงกันกับบัญชีที่ใช้ฝาก)"
          placeholder="ชื่อ"
          :rules="[
            (val) => (val && val.length > 0) || 'ชื่อ-นามสกุล'
          ]"
          lazy-rules
          color="white"
        /> -->
        <div class="flex">
          <q-btn
              class="q-mr-md"
              color="brand"
              :label="$t('lang.confirm')"
              @click="updateName"
          />
        </div>
      </template>
      <template v-if="step === 2">
        <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAccount"
            :label="$t('lang.account_name_with_desc')"
            :rules="[
              val => (val && val.length > 0) || $t('lang.please_enter_bank_account'),
            ]"
            lazy-rules
            :disable="true"
            ref="cardAccountRef"
            color="white"
        />
        <q-input
            class="q-mb-md"
            filled
            v-model="personalInfo.phone"
            :label="$t('lang.phone_number')"
            :rules="[
              val => (val && val.length > 0) || $t('lang.please_confirm_phone_number'),
              isValidPhone
            ]"
            lazy-rules
            :disable="phoneDisabled"
            ref="telephoneRef"
            color="white"
        />
        <div>
          <div class="row q-col-gutter-xs">
            <div class="col-12">
              <q-select
                  v-model="selectedBankType"
                  filled
                  :options="[{ name: 'Bank' }, { name: 'Crypto' }]"
                  :label="$t('lang.withdraw_methods')"
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
                  :label="$t('lang.select_account_add_different_banks')"
                  :rules="[(val) => !!val || $t('lang.please_select_a_bank_account')]"
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
        <q-input
            filled
            class="q-mb-md"
            v-model="bankCardInfo.cardNumber"
            :label="$t('lang.card_number')"
            :rules="[
              val => (val && val.length > 0) || $t('lang.log_in'),
              val => validateBankLength(val)
            ]"
            ref="cardNumberRef"
            color="white"
        />
        <q-input
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAddress"
            :label="$t('lang.branch_not_required')"
            ref="cardAddressRef"
            color="white"
        />
        <div class="flex">
          <q-btn color="brand" :label="$t('lang.confirm')" @click="submitBankCard" />
        </div>
      </template>
    </q-form>
    <q-dialog v-model="isShowInstruction">
      Kindly update your details first.
    </q-dialog>

    <q-dialog
        v-model="isShowInstruction"
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
        <q-card-section>
          <!-- <div class="text-h6">เปลี่ยนรหัสผ่าน</div> -->
          {{ $t('lang.please_edit_your_personal_information') }}
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-btn color="brand" class="bottombtn" @click="logout">
      <RiLogoutBoxLine />
      <div class="acct-nav-label">{{ $t('lang.logout') }}</div>
    </q-btn>
  </div>
</template>
<script setup>
import {onMounted, ref, reactive} from "vue";
import {useQuasar, Platform} from "quasar";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import {useRouter} from "vue-router";
import { RiLogoutBoxLine } from "vue-remix-icons";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const step = ref(1)
const store = userStore();
const imgURL = process.env.IMAGE_CDN + '/payment/'
const bankCardRef = ref();
const cardNumberRef = ref();
const cardAccountRef = ref();
const cardAddressRef = ref();
const telephoneRef = ref();
const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: "",
  cardAddress: ""
});
const personalInfo = reactive({
  telephone: "",
})
const updateInfo = reactive({
  realName: "",
})
const updateInfoNameRef = ref();
const updateInfoSurnameRef = ref();
const qs = require("qs");
const isShowInstruction = ref(true);
const router = useRouter();
const bankCardModalState = reactive({
  visible: false,
  banks: []
});

const banksList = ref([]);
const selectedBankType = ref("Bank");
const selectBankType = () => {
  bankCardInfo.bankId = "";
  banksList.value = [];
  bankCardModalState.banks.forEach((element) => {
    if (selectedBankType.value === "Bank" && element.bankType === "BANK") {
      banksList.value.push(element);
    }
    if (
        selectedBankType.value === "Crypto" &&
        element.bankType === "CRYPTO"
    ) {
      const isCrypto = ref(true);
      banksList.value.push(element);
    }
    if (
        selectedBankType.value === "e-Wallet" &&
        element.bankType === "EWALLET"
    ) {
      const isEWallet = ref(true);
      banksList.value.push(element);
    }
  });
};

const isValidPhone = () => {
  const phonePattern = /^\d+$/;
  return phonePattern.test(personalInfo.phone) || t('lang.invalid_phone_num');
};
const loadBankCards = () => {
  bankCardInfo.bankId = undefined;
  bankCardInfo.cardNumber = "";
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

const submitBankCard = () => {
  telephoneRef.value.validate();
  bankCardRef.value.validate();
  cardAccountRef.value.validate();
  cardAddressRef.value.validate();
  cardNumberRef.value.validate();
  if (bankCardRef.value.hasError || cardAccountRef.value.hasError  || cardAddressRef.value.hasError || cardNumberRef.value.hasError || telephoneRef.value.hasError) {
  }
  else {
    if (store.telephone) {
      phoneDisabled.value = true
      updateBankInfo()
    } else {
      api.post("/session/account", qs.stringify(personalInfo)).then((res) => {
        const r = res.data
        if (r.code === 0) {
          // $q.notify({
          //   color: "positive",
          //   position: "top",
          //   message: "อัพเดทเรียบร้อยแล้ว",
          //   icon: "check_circle_outline"
          // });
          store.telephone = personalInfo.telephone
          phoneDisabled.value = true
          updateBankInfo()
        }
      })
    }
  }
};
const updateBankInfo = () => {
  api.post("/session/bankCard", qs.stringify(bankCardInfo)).then((res) => {
    const response = res.data
    if (response.code === 0) {
      bankCardModalState.visible = false;
      $q.notify({
        color: "positive",
        position: "top",
        message: t('lang.card_added'),
        icon: "check_circle_outline"
      });
      router.push('/account')
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

let validateBankLength = (val) => {
  if (selectedBankType.value === "Bank") {
    return (
        (val.length > 5 && val.length < 13) || t('lang.length_between_6_12')
    );
  } else if (selectedBankType.value === "Crypto") {
    return (
        (val.length > 33 && val.length < 38) || t('lang.length_between_34_37')
    );
  }
};
const updateName = () => {
  updateInfoNameRef.value.validate()
  updateInfoSurnameRef.value.validate()
  if (updateInfoNameRef.value.hasError || updateInfoSurnameRef.value.hasError) {
  } else {
    updateInfo.realName = updateInfo.cardAccountName + '-' + updateInfo.cardAccountSurname
    api.post("/session/account", qs.stringify(updateInfo)).then((res) => {
      const r = res.data
      if (r.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: t('lang.updated_successfully'),
          icon: "check_circle_outline"
        });
        bankCardInfo.cardAccount = updateInfo.realName
        step.value = 2
        loadBankCards();
      }
    })
  }
}
const logout = () => {
  store.memberLogout().then(() => {
    router.push('/')
  });
}
const phoneDisabled = ref(false)
onMounted(() => {
  store.getMemberInfo()
  if (store.realName) {
    bankCardInfo.cardAccount = store.realName
    step.value = 2
    loadBankCards();
  }
  if (store.telephone) {
    personalInfo.phone = store.telephone
    phoneDisabled.value = true
  }
});
</script>
<style scoped>
.bottombtn {
  position:absolute;
  bottom: 10px;
  right: 10px;
}
</style>

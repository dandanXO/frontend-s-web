<template>
  <div class="form-wrapper">
    <q-card-section>
      <div style="display: grid;grid-template-columns: 1fr 1fr;">
        <div>
        <q-form class="form-template">
          <div class="form-item">
            <q-label>
              {{ $t('lang.withdraw_method') }}
              <em>*</em>
            </q-label>
            <q-select
              dense
              v-model="selectedBankType"
              outlined
              :options="bankTypes"
              option-label="name"
              option-value="code"
              emit-value
              map-options
              @update:model-value="bankCardInfo.bankId = ''"
            >
            <template v-slot:selected-item="scope">
                <q-item-section avatar>
                  <img
                    v-if="scope.opt.icon"
                    style="width: 24px; margin-top: 3px; margin-bottom:0px"
                    :src="imgURL + '/withdraw/' + scope.opt.icon"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                    {{ scope.opt.name }}
                  </q-item-label>
                </q-item-section>
              </template>
            </q-select>
          </div>

          <div class="form-item">
            <q-label>
              {{ $t('lang.withdraw_bank') }}
              <em>*</em>
            </q-label>
            <q-select
              dense
              ref="bankCardRef"
              outlined
              v-model="bankCardInfo.bankId"
              class="q-pb-xs"
              lazy-rules
              clearable
              :options="filteredBankListByType"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => val || $t('lang.withdraw_bank_choose')]"
            >
              <template v-slot:selected-item="scope">
                <q-item-section avatar>
                  <img
                    v-if="scope.opt.bankIcon"
                    style="width: 24px; margin-top: 3px; margin-bottom:0px"
                    :src="imgURL + '/payment/' + scope.opt.bankIcon"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                    {{ scope.opt.name }}
                  </q-item-label>
                </q-item-section>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <img
                      v-if="scope.opt.bankIcon"
                      style="width: 24px; margin-top: 3px; margin-bottom: 0px"
                      :src="imgURL + '/payment/' + scope.opt.bankIcon"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="form-item">
            <q-label>
              {{ $t('lang.withdraw_bank_num') }}
              <em>*</em>
            </q-label>
            <q-input
              dense
              ref="cardNumberRef"
              type="number"
              outlined
              v-model="bankCardInfo.cardNumber"
              class="q-pb-xs"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || $t('lang.withdraw_bank_num_choose'), validateBankLength]"
            ></q-input>
          </div>

          <div class="form-item">
            <q-label> 
              {{ $t('lang.withdraw_bank_holder') }}
              <em>*</em> 
            </q-label> 
            <q-input 
              dense
              outlined 
              v-model="bankCardInfo.cardAccount" 
              class="q-pb-xs"
              lazy-rules 
              clearable 
              readonly 
            ></q-input> 
          </div>

          <div class="form-item">
            <q-label>
              {{ $t('lang.withdraw_bank_address') }}
            </q-label>
            <q-input
              ref="cardAddressRef"
              dense
              outlined
              v-model="bankCardInfo.cardAddress"
              class="q-pb-xs"
              :label="$t('lang.withdraw_bank_address_placeholder')"
              clearable
            ></q-input>
          </div>
        </q-form>
        <div class="note">{{ $t('lang.withdraw_bank_holder_cannot_amend') }}.</div>
        <div class="note">{{ $t('lang.withdraw_bank_holder_mismatch') }}！</div>
      </div>
        <WithdrawBankView ref="bankCardListRef" />  
      </div>
    </q-card-section>
    <div class="action-buttons">
      <div class="primary-button blue" @click="submitBankCard()">
        제출
      </div>
    </div>
  </div>
</template>

<script setup id="AddWithdrawBankCard">
import { reactive, ref, watch, onMounted, computed } from "vue";


import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";
import WithdrawBankView from "src/pages/account/WithdrawBankView.vue";

const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = process.env.IMAGE_CDN;
const bankCardRef = ref();
const cardNumberRef = ref();
const cardAddressRef = ref();
const bankCardListRef = ref();
const phoneVerificationRef = ref();
const { realName } = storeToRefs(store);

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: realName,
  cardAddress: "",
  telephone: store.telephone
});

const validateBankLength = (val) => {
  if (!/^\d+$/.test(val)) return "숫자를 입력하세요";

  if (selectedBankType.value === "BANK") {
    return ((val.length > 10 && val.length < 21) || "길이는 10에서 20자 여야 합니다");
  } else if (selectedBankType.value.includes("USDT")) {
    return ((val.length >= 34 && val.length <= 36) || "길이는 34에서 36자 여야 합니다");
  }
};

// NOTE: no chance to validate, e.g. member telephone = 44****77
// const isValidCnPhone = () => {
//   const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
//   return phonePattern.test(bankCardInfo.telephone) || "请输入有效的电话号码";
// };

const phoneVerificationImg = ref("");
const innerCodeId = ref("");
const innerCaptchaCode = ref("");
const innerCaptchaRef = ref();
const getInnerCode = () => {
  isOtpSent.value = false;
  innerCaptchaCode.value = "";

  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
        innerCodeId.value = response.data.id;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const showCaptchaDialog = ref(false);
const openPhoneVeriDialog = () => {
  getInnerCode();
  showCaptchaDialog.value = true;
};

const isOtpSent = ref(false);
const showCaptchaSuccessDialog = ref(false);
const showCaptchaFailedDialog = ref(false);
const captchaFailedMessage = ref("");
const onCaptchaSubmit = () => {
  innerCaptchaRef.value.validate();
  if (innerCaptchaRef.value.hasError) return;

  api
    .post(
      `/session/sendSms`,
      qs.stringify({
        captchaCode: innerCaptchaCode.value,
        codeId: innerCodeId.value
      })
    )
    .then((res) => {
      if (res.code === 0) {
        isOtpSent.value = true;

        bankCardInfo.smsCode = "";
        bankCardInfo.smsCodeId = res.data.codeId;

        showCaptchaSuccessDialog.value = true;
      } else {
        captchaFailedMessage.value = res.message;
        showCaptchaFailedDialog.value = true;
      }

      showCaptchaDialog.value = false;
    })
    .catch(() => {
      getInnerCode();
    });
};

const selectedBankType = ref("BANK");
const bankTypes = ref([]);
const bankList = ref([]);
const filteredBankListByType = computed(() => bankList.value.filter(({ bankType }) => {
  if(selectedBankType.value.includes('USDT') && bankType === "CRYPTO") {
    return true;
  } else {
    return bankType === selectedBankType.value;
  }
}))
const loadBankCards = () => {
  bankCardInfo.bankId = null;
  bankCardInfo.cardNumber = "";
  bankCardInfo.cardAddress = "";
  bankCardInfo.currencyId = "";

  store.getMemberInfo().then(() => {
    if (!store.realName) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "진짜 이름을 입력해주세요",
        icon: "report_problem"
      });
      router.push("/?page=personal/info");
    } else if (!store.telephone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "전화번호를 입력해주세요",
        icon: "report_problem"
      });
      router.push("/account/verifyTelephone");
    } else {
      api
        .get("/session/withdraw/card")
        .then((ret) => {
          const res= ret.data;
          if (res.code === 0) {
            for (let i = 0, l = res.data.length; i < l; i++) {
              const data = res.data[i];
              const { bankType, bankCode } = data;
              // is bank & not alipay (78)
              if (bankType === "BANK" && bankCode !== 78) bankList.value.push(data);

              if (bankType === "CRYPTO") bankList.value.push(data);
            }
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
  });
};

const submitBankCard = () => {
  bankCardRef.value.validate();
  cardNumberRef.value.validate();

  // if (!phoneVerificationRef.value) {
  //   $q.notify({
  //     color: "negative",
  //     position: "top",
  //     message: "请点击获取验证码，并输入您的注册手机验证",
  //     icon: "report_problem"
  //   });
  // } else {
  //   phoneVerificationRef.value.validate();
  // }

  if (
    !(
      bankCardRef.value.hasError ||
      cardNumberRef.value.hasError
      // || phoneVerificationRef.value.hasError
    )
  ) {
    api
      .post("/session/bankCard", qs.stringify(bankCardInfo))
      .then((resp) => {
        const response= resp.data;
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "은행 카드가 추가되었습니다",
            icon: "check_circle_outline"
          });
          bankCardListRef.value.loadCards();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};

const handleEnterKey = () => {
  if (!document.activeElement || document.activeElement.tagName.toLowerCase() !== "input") {
    openPhoneVeriDialog();
  }
};

watch(
  () => bankCardInfo.bankId,
  (newVal, oldVal) => {
    const selectedBank = bankList.value.find((bank) => bank.id === newVal);
    if (selectedBank) {
      bankCardInfo.currencyId = selectedBank.currencyIds;
    }
  }
);

onMounted(() => {
  loadBankCards();
  api.get('/session/withdraw/entrance').then(({data: response}) => {
    if(response.code === 0) {
      bankTypes.value = response.data;
    }
  });
});

</script>

<style lang="scss" scoped>
.modal-body-content {

  :deep(.q-field__control){
    background:#252E43;
  }

  .personal-info-form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 30px;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 20px 10px 10px;
  }
}

q-label {
  color: #fff;
  display: inline-block;

  em {
    color: $negative;
  }
}

.note {
  color: #ffa031;
  font-size: 0.8rem;
  font-weight: 400;
  margin: 1rem 0;
}

</style>

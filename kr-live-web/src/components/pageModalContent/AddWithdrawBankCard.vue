<template>
  <div class="modal-body-wrap form-wrapper">
    <q-card-section class="modal-body-content">
        <q-form class="form-template">
          <div class="">
            <q-label>
              개설 은행
              <em>*</em>
            </q-label>
            <q-select
              dense
              ref="bankCardRef"
              outlined
              v-model="bankCardInfo.bankId"
              class="q-pb-xs"
              label="선택하세요"
              lazy-rules
              clearable
              :options="bankList"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              :rules="[(val) => val || '선택하세요']"
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

          <div class="">
            <q-label>
              은행 카드 번호
              <em>*</em>
            </q-label>
            <q-input
              dense
              ref="cardNumberRef"
              type="number"
              outlined
              v-model="bankCardInfo.cardNumber"
              class="q-pb-xs"
              label="은행 카드 번호를 입력하세요"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || '은행 카드 번호를 입력하세요', validateBankLength]"
            ></q-input>
          </div>

          <div class="">
            <q-label> 
              카드 계좌
              <em>*</em> 
            </q-label> 
            <q-input 
              dense
              outlined 
              v-model="bankCardInfo.cardAccount" 
              class="q-pb-xs"
              label="카드 계좌" 
              lazy-rules 
              clearable 
              readonly 
            ></q-input> 
          </div>

          <div class="">
            <q-label>
              카드 주소
            </q-label>
            <q-input
              ref="cardAddressRef"
              dense
              outlined
              v-model="bankCardInfo.cardAddress"
              class="q-pb-xs"
              label="계좌 개설 은행 주소를"
              clearable
            ></q-input>
          </div>

          <!-- since onMount API forced update name & phone, hence no validation needed. -->
<!--          <q-label>-->
<!--            手机号-->
<!--            <em>*</em>-->
<!--          </q-label>-->
<!--          <q-input-->
<!--            standout-->
<!--            v-model="bankCardInfo.telephone"-->
<!--            class="q-pb-xs"-->
<!--            hide-bottom-space-->
<!--            label="请输入您绑定的手机号"-->
<!--            lazy-rules-->
<!--            clearable-->
<!--            readonly-->
<!--          >-->
<!--            <template v-slot:append>-->
<!--              <q-btn-->
<!--                @click="openPhoneVeriDialog()"-->
<!--                type="submit"-->
<!--                class="common-sm-btn bottom-btn get-otp-btn"-->
<!--                label="获取验证码"-->
<!--                color="brightbtn"-->
<!--                rounded-->
<!--              />-->
<!--            </template>-->
<!--          </q-input>-->

<!--          <template v-if="isOtpSent">-->
<!--            <q-label>-->
<!--              验证码-->
<!--              <em>*</em>-->
<!--            </q-label>-->
<!--            <q-input-->
<!--              ref="phoneVerificationRef"-->
<!--              standout-->
<!--              v-model="bankCardInfo.smsCode"-->
<!--              class="q-pb-xs"-->
<!--              hide-bottom-space-->
<!--              label="请输入您的注册手机验证"-->
<!--              lazy-rules-->
<!--              clearable-->
<!--              maxlength="6"-->
<!--              :rules="[(val) => (val && val.length > 3) || '请输入您的注册手机验证']"-->
<!--              @keydown.enter.prevent="handleEnterKey"-->
<!--              @keydown.enter="submitBankCard()"-->
<!--            ></q-input>-->
<!--          </template>-->
        </q-form>
        <div class="note">결제자 이름은 수정이 불가능하며, 등록된 이름과 일치해야 합니다.</div>
        <div class="note">안내: 카드 소지자 이름이 일치하지 않을 경우 온라인 고객 서비스에 문의하여 정보를 수정할 수 있습니다. 지원과 이해에 감사드립니다！</div>
    </q-card-section>
    <div class="action-buttons">
      <div class="primary-button blue" @click="submitBankCard()">
        제출
      </div>
    </div>
  </div>
</template>

<script setup id="AddWithdrawBankCard">
import { reactive, ref, onActivated, watch, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";

const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = process.env.IMAGE_CDN;
const bankCardRef = ref();
const cardNumberRef = ref();
const cardAddressRef = ref();
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
  return (val.length > 10 && val.length < 21) || "길이는 10에서 20자 여야 합니다";
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

const bankList = ref([]);
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
          router.push("/?page=bankcardlist");
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

    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }

    input,
    select {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    select {
      height: 52px;
    }

    label,
    input,
    select {
      width: 100%;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 20px 10px 10px;
  }
}


.flex-box-c-c{
  display:flex;
  align-items: center;
  justify-content: center;
}

q-label {
  color: #fff;
  margin: 8px 0 4px 0;
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

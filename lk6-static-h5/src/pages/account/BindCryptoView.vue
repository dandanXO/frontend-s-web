<template>
  <q-dialog class="modal-common-div" v-model="showCaptchaDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">验证码</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <q-input
          ref="innerCaptchaRef"
          v-model="innerCaptchaCode"
          placeholder="验证码"
          maxlength="4"
          :rules="[
            (val) => (val && val.length > 0) || '请输入验证码',
            (val) => (val && val.length === 4) || '验证码必须为4个字符串'
          ]"
          @keydown.enter="onCaptchaSubmit()"
        >
          <template v-slot:append>
            <img
              :src="phoneVerificationImg"
              title="点击刷新验证码"
              style="margin-top: 6px; cursor: pointer"
              @click="getInnerCode()"
            />
          </template>
        </q-input>
      </div>

      <q-card-actions
        style="margin: 0 auto"
        align="center"
        class="text-teal"
        :class="$q.dark.isActive ? '' : 'bg-white'"
      >
        <q-btn style="width: 100%" class="common-md-btn" flat label="发送验证码" @click="onCaptchaSubmit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="showCaptchaSuccessDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">信息</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <!-- <img style="width: 2.5rem" src="../../assets/images/common/success-tick-icon.svg" /> -->
        <p>操作成功，请查看手机验证码！</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="text-teal" :class="$q.dark.isActive ? '' : 'bg-white'">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog class="modal-common-div" v-model="showCaptchaFailedDialog">
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="black-titles">系统提示</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>

      <div class="contents">
        <!-- <img style="width: 2.5rem" src="../../assets/images/common/failed-icon.svg" /> -->
        <p>{{ captchaFailedMessage || "验证码校验失败，请刷新" }}</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="text-teal" :class="$q.dark.isActive ? '' : 'bg-white'">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page class="bind-container">
    <div class="bind-wrapper">
      <q-form class="bind-item q-my-sm">
        <q-label>
          虚拟币账户
          <em>*</em>
        </q-label>
        <q-input
          ref="cardNumberRef"
          type="text"
          standout
          v-model="bankCardInfo.cardNumber"
          class="q-pb-xs"
          hide-bottom-space
          placeholder="请输入虚拟币账户"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || '请输入虚拟币账户', validateBankLength, validateCryptoNumber]"
        ></q-input>

        <q-label>
          虚拟币种类
          <em>*</em>
        </q-label>
        <div class="type-toggle">
          <q-btn
            v-for="(bank, bankIndex) in bankList"
            :key="`${bank}-${bankIndex}`"
            :class="`${selectedTypeToggleIndex === bankIndex ? 'common-md-btn' : 'common-md-white-btn'} content`"
            flat
            @click="onTypeToggleBtnClick(bankIndex)"
          >
            <img :src="imgURL + bank.bankIcon" alt="" />
            <div>{{ bank.name === "USDTTRC" ? "USDT" : bank.name }}</div>
          </q-btn>
        </div>

        <q-label>
          协议
          <em>*</em>
        </q-label>
        <div class="category-toggle">
          <q-btn
            v-for="(category, categoryIndex) in categoryToggleList"
            :key="`${category}-${categoryIndex}`"
            :class="`${
              selectedCategoryToggleIndex === categoryIndex ? 'common-md-btn' : 'common-md-white-btn'
            } content`"
            flat
            @click="onCategoryToggleBtnClick(categoryIndex)"
          >
            <div>{{ category }}</div>
          </q-btn>
        </div>

        <!-- since onMount API forced update name & phone, hence no validation needed. -->
        <!-- <q-label>
          手机号
          <em>*</em>
        </q-label>
        <q-input
          standout
          v-model="bankCardInfo.telephone"
          class="q-pb-xs"
          hide-bottom-space
          label="请输入您绑定的手机号"
          lazy-rules
          clearable
          readonly
        >
          <template v-slot:append>
            <q-btn
              @click="openPhoneVeriDialog()"
              type="submit"
              class="common-sm-btn bottom-btn get-otp-btn"
              :disable="otpCountdownCount > 0"
              :label="otpCountdownCount <= 0 ? `获取验证码` : `已发送（倒数${otpCountdownCount}秒)`"
              color="brightbtn"
              rounded
            />
          </template>
        </q-input>

        <template v-if="isOtpSent">
          <q-label>
            验证码
            <em>*</em>
          </q-label>
          <q-input
            ref="phoneVerificationRef"
            standout
            v-model="bankCardInfo.smsCode"
            class="q-pb-xs"
            hide-bottom-space
            label="请输入您的注册手机验证"
            lazy-rules
            clearable
            maxlength="6"
            :rules="[(val) => (val && val.length > 3) || '请输入您的注册手机验证']"
            @keydown.enter.prevent="handleEnterKey"
            @keydown.enter="submitBankCard()"
          ></q-input>
        </template> -->
      </q-form>

      <!-- <div class="note">温馨提示：若持卡人姓名不符可联系在线客服更正信息，感谢您的支持与 理解！</div> -->

      <q-btn class="submit-btn" label="提交" width="100%" style="width: 100%" @click="submitBankCard()" />
    </div>
  </q-page>
  <q-dialog v-model="gotoNewplayerPromoDialog" persistent>
    <q-card class="q-px-lg q-pt-sm">
      <q-card-section class="row items-center">
        <span class="q-ml-sm">綁定完成，是否跳转优惠页面？</span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="否" color="primary" v-close-popup />
        <q-btn flat label="是" @click="gotoNewplayerPromo()" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "src/hooks/notify";

// NOTE: temp mock
const selectedTypeToggleIndex = ref(0);
const onTypeToggleBtnClick = (index) => {
  selectedTypeToggleIndex.value = index;
  bankCardInfo.bankId = bankList.value[index].id;
};

const categoryToggleList = ref(["TRC20"]);
const selectedCategoryToggleIndex = ref(0);
const onCategoryToggleBtnClick = (index) => {
  selectedCategoryToggleIndex.value = index;
};

const notify = useNotify();
const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/payment/";

const bankCardRef = ref();
const cardNumberRef = ref();
const phoneVerificationRef = ref();

const bankCardInfo = reactive({
  bankId: undefined,
  cardNumber: "",
  cardAccount: store.realName,
  cardAddress: "",
  telephone: store.phone,
  smsCode: "",
  smsCodeId: "",
  currencyId: ""
});

const validateBankLength = (val) => {
  return (val.length > 33 && val.length < 37) || "长度应为34到36个字符";
};

const validateCryptoNumber = (val) => {
  var regex = /^[a-zA-Z0-9]+$/;

  return regex.test(val) || "请输入有效的虚拟账户号码";
};
const gotoNewplayerPromoDialog = ref(false);

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
const otpCountdownCount = ref(0);
let otpCountdownSchedule;
const countdownOtp = () => {
  otpCountdownCount.value = 60;
  otpCountdownSchedule = setInterval(() => {
    if (otpCountdownCount.value <= 0) {
      clearInterval(otpCountdownSchedule);
      return;
    }
    otpCountdownCount.value--;
  }, 1000);
};
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
        countdownOtp();

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
  store.getMemberInfo().then(() => {
    if (!store.realName) {
      notify({
        type: "error",
        message: "请输入您的真实姓名"
      });
      router.push("/account/personal");
      // } else if (!store.phone) {
      //   notify({
      //     type: "error",
      //     message: "请输入您的电话号码"
      //   });
      //   router.push("/account/verifyTelephone");
    } else {
      api
        .get("/session/withdraw/card")
        .then((res) => {
          if (res.code === 0) {
            for (let i = 0, l = res.data.length; i < l; i++) {
              const data = res.data[i];
              const { bankType } = data;
              if (bankType === "CRYPTO") bankList.value.push(data);
            }

            bankCardInfo.bankId = bankList.value[0].id;
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    }
  });
};

const submitBankCard = () => {
  if (bankCardRef.value) {
    bankCardRef.value.validate();
  }
  if (cardNumberRef.value) {
    cardNumberRef.value.validate();
  }

  // if (!isOtpSent.value) {
  //   notify({
  //     type: "error",
  //     message: "请点击获取验证码，并输入您的注册手机验证"
  //   });
  // } else if (phoneVerificationRef.value) {
  // }
  // phoneVerificationRef.value.validate();

  if (
    !(
      (bankCardRef.value && bankCardRef.value.hasError) ||
      (cardNumberRef.value && cardNumberRef.value.hasError) ||
      (phoneVerificationRef.value && phoneVerificationRef.value.hasError)
    )
  ) {
    // API call
    api
      .post("/session/bankCard", qs.stringify(bankCardInfo))
      .then((response) => {
        if (response.code === 0) {
          notify({
            type: "success",
            message: "已添加银行卡"
          });
          if (useLocalStorage("need-go-back-newplayer").value === "true") {
            openGotoNewplayerPromo();
          } else {
            router.push("/account/withdraw");
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
};
const openGotoNewplayerPromo = () => {
  if (useLocalStorage("need-go-back-newplayer").value === "true") {
    gotoNewplayerPromoDialog.value = true;
  }
};
const gotoNewplayerPromo = () => {
  router.push("/promo?name=lh1-newplayer-guide");
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

<style lang="scss">
.bind-container {
  font-size: 1rem;

  .bind-wrapper {
    width: calc(100% - 2rem);
    margin: 0 auto;
    padding: 1rem 0;

    .bind-item {
      background: $white;
      box-shadow: 0px -4px 6px 0px #c3d4e6 inset;
      border-radius: 10px;
      margin: 0 auto 14px;
      padding: 1.25rem;

      q-label {
        color: #424f72;
        margin: 8px 0 10px 0;
        display: inline-block;

        em {
          color: #f53434;
        }
      }
      .q-input {
        border-radius: 7px;
        .q-field__control {
          box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
          background-color: #f7f8fb;
        }
        .q-placeholder,
        .q-field__append {
          color: #424f72;
          &::placeholder {
            color: #a4aabb;
            opacity: 1;
          }
        }
      }

      .get-otp-btn {
        position: relative;
        right: -0.75rem;
        width: 100%;
        height: 100%;
        aspect-ratio: unset;
        font-size: 1rem;
      }

      .type-toggle,
      .category-toggle {
        display: flex;
        flex-wrap: wrap;
        box-shadow: unset;
        gap: 20px;

        .content {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          width: 6.5rem;

          img {
            width: 1.5rem;
            margin: 0 0.25rem;
          }

          .row {
            flex-wrap: nowrap;
          }
        }
      }
    }

    .note {
      color: #ffa031;
      font-size: 0.8rem;
      font-weight: 400;
      margin: 1rem 0;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
      box-shadow: 0px 2px 0px 0px #9ab0ff70;
      border: 1px solid #ffffff;
      border-radius: 48px;
      width: 100%;
      padding: 10px 0;
      margin: auto;
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
    }
  }
}
</style>

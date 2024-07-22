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

      <q-card-actions style="margin: 0 auto" align="center" class="bg-white text-teal">
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
        <img style="width: 2.5rem" src="../../assets/images/common/success-tick-icon.svg" />
        <p>操作成功，请查看手机验证码！</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
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
        <img style="width: 2.5rem" src="../../assets/images/common/failed-icon.svg" />
        <p>{{ captchaFailedMessage || "验证码校验失败，请刷新" }}</p>
      </div>

      <q-card-actions style="width: 100%" align="center" class="bg-white text-teal">
        <q-btn class="common-md-btn" flat label="确定" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page class="bind-container">
    <div class="bind-wrapper">
      <q-form class="bind-item q-my-sm">
        <q-label>
          电子钱包
          <em>*</em>
        </q-label>
        <q-input
          ref="cardNumberRef"
          type="text"
          standout
          v-model="bankCardInfo.cardNumber"
          class="q-pb-xs"
          hide-bottom-space
          label="请输入电子钱包"
          lazy-rules
          clearable
          :rules="[(val) => (val && val.length > 0) || '请输入电子钱包', validateBankLength, validateEWalletNumber]"
        ></q-input>

        <q-label>
          电子钱包种类
          <em>*</em>
        </q-label>
        <div class="type-toggle">
          <q-btn
            v-for="(bank, bankIndex) in bankList"
            :key="`${bank}-${bankIndex}`"
            :class="`${selectedTypeToggleIndex === bankIndex ? 'common-sm-btn' : 'common-sm-white-btn'} content`"
            @click="onTypeToggleBtnClick(bankIndex, bank.name)"
          >
            <img :src="imgURL + bank.bankIcon" alt="" />
            <div>{{ bank.name }}</div>
          </q-btn>
        </div>

        <q-label>
          协议
          <em>*</em>
        </q-label>
        <div class="category-toggle">
          <!-- <q-btn
            v-for="(category, categoryIndex) in categoryToggleList"
            :key="`${category}-${categoryIndex}`"
            :class="`${
              selectedCategoryToggleIndex === categoryIndex ? 'common-sm-btn' : 'common-sm-white-btn'
            } content`"
            @click="onCategoryToggleBtnClick(categoryIndex)"
          >
            <div>{{ category }}</div>
          </q-btn> -->
          <q-btn class="common-sm-btn">{{ selectedTypeToggleName }}</q-btn>
        </div>

        <!-- since onMount API forced update name & phone, hence no validation needed. -->
        <q-label>
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
              label="获取验证码"
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
        </template>
      </q-form>

      <div class="note">温馨提示：若持卡人姓名不符可联系在线客服更正信息，感谢您的支持与 理解！</div>

      <q-btn class="common-large-btn" label="提交" width="100%" style="width: 100%" @click="submitBankCard()" />
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { userStore } from "stores/index";
import {useLocalStorage} from "@vueuse/core";

// NOTE: temp mock
const selectedTypeToggleIndex = ref(0);
const selectedTypeToggleName = ref("KDOU");
const onTypeToggleBtnClick = (index, name) => {
  selectedTypeToggleIndex.value = index;
  selectedTypeToggleName.value = name;
  bankCardInfo.bankId = bankList.value[index].id;
};

const categoryToggleList = ref(["EBPAY", "ERC20", "EBPAY", "ERC20", "EBPAY", "ERC20", "EBPAY", "ERC20"]);
const selectedCategoryToggleIndex = ref(0);
const onCategoryToggleBtnClick = (index) => {
  selectedCategoryToggleIndex.value = index;
};

const qs = require("qs");
const $q = useQuasar();
const store = userStore();
const router = useRouter();

const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/payment/";

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
  smsCodeId: ""
});

const validateBankLength = (val) => {
  const bankCode = bankList.value[selectedTypeToggleIndex.value].code;

  switch (bankCode) {
    case "KDPAY":
      return (val.length > 33 && val.length < 35) || "长度应为34个字符";
    case "EBPAY":
      return (val.length > 33 && val.length < 35) || "长度应为34个字符";
    case "OKPAY":
      return (val.length > 15 && val.length < 17) || "长度应为16个字符";
    default:
      break;
  }
};

const validateEWalletNumber = (val) => {
  var regex = /^[a-zA-Z0-9]+$/;

  return regex.test(val) || "请输入有效的电子钱包号码";
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
    .get("/member/verificationEasyCode")
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
  store.getMemberInfo().then(() => {
    if (!store.realName) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "请输入您的真实姓名",
        icon: "report_problem"
      });
      router.push("/account/personal");
    } else if (!store.phone) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "请输入您的电话号码",
        icon: "report_problem"
      });
      router.push("/account/verifyTelephone");
    } else {
      api
        .get("/session/withdraw/card")
        .then((res) => {
          if (res.code === 0) {
            for (let i = 0, l = res.data.length; i < l; i++) {
              const data = res.data[i];
              const { bankType } = data;
              if (bankType === "EWALLET") bankList.value.push(data);
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

  if (!isOtpSent.value) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "请点击获取验证码，并输入您的注册手机验证",
      icon: "report_problem"
    });
  } else if (phoneVerificationRef.value) {
    phoneVerificationRef.value.validate();
  }

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
          $q.notify({
            color: "positive",
            position: "top",
            message: "已添加银行卡",
            icon: "check_circle_outline"
          });
          router.push("/account/withdraw");
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
        color: $font-2;
        margin: 8px 0 4px 0;
        display: inline-block;
        font-size: 0.95rem;

        em {
          color: $negative;
        }
      }

      q-btm {
        font-size: 1rem;
      }

      .q-field__label {
        font-size: 1rem;
      }

      .q-field__control {
        border-radius: 0.5rem;
        background: #f7f8fb;
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
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
  }
}
</style>

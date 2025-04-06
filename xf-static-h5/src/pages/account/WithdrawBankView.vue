<template>
  <div class="withdrawBankView">
    <!-- <div class="q-pa-md text-bold text-center" style="color: #33bcd4">专属网址：{{ store.evip }}</div> -->
    <div class="web">
      <q-icon name="volume_up" size="sm" class="q-mr-sm" />
      专属网址：{{ store.evip }}
    </div>

    <div class="widthdrawBankView--content">
      <div class="account-content text-center q-pa-md">
        <div class="flex-box flex-wrap bank-card-list q-gutter-y-md">
          <template v-for="(bc, index) in personalState.bankCardList" :key="bc.id">
            <div v-if="bc.bankName" @click="showCard(bc, index)" class="text-left bank-card-item">
              <div>
                <div class="txt-center">
                  {{ bc.bankName }}
                  <!-- <div>Bank Account Number</div> -->
                </div>
                <div class="flex-box cards">
                  <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">
                    ****{{ b.slice(b.length - 4, b.length) }}
                  </div>
                </div>
              </div>

              <q-btn @click="confirmUnbindCard(bc)" label="解绑" unelevated style="color: #00bfd7" rounded />
            </div>
          </template>
          <div class="widthdrawBankView--content-cta">
            <q-btn
              color="brightbtn"
              style="width: 100%"
              label="绑定"
              icon="add_circle_outline"
              @click="bankCardModal('bank')"
              rounded
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isUnbindCardModal" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card class="bg-darkbox" style="width: 90%">
        <div class="q-mb-md">
          <div class="text-h6 text-center">{{ unbindCardEnter() }}</div>
        </div>
        <q-form>
          <div>
            <q-input
              clearable
              ref="unbindCardNoRef"
              v-model="unbindCardNo"
              :label="unbindCardLabel()"
              :rules="[(val) => (val && val.length > 0) || '请输入' + unbindCardLabel()]"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            />
          </div>

          <div class="flex flex-center">
            <q-btn class="q-mr-md" label="取消" color="orangebtn" @click="isUnbindCardModal = false" rounded />
            <q-btn color="brightbtn" label="提交" @click="unbindBankCard(unbindcarddetail)" rounded />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bankCardModalState.visible" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card class="bg-darkbox">
        <div v-if="!isVirtual" class="q-mb-md">
          <div class="text-h6">绑定</div>
        </div>
        <div v-if="isVirtual" class="q-mb-md">
          <div class="text-h6">Add a virtual currency</div>
        </div>
        <q-form>
          <div v-if="!isVirtual">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="input-label q-mb-sm">
                  类型
                  <span style="color: #f53434">*</span>
                </div>
                <q-select
                  v-model="selectedBankType"
                  :options="bankTypeOptions"
                  option-label="name"
                  option-value="name"
                  @update:model-value="selectBankType(opt)"
                  emit-value
                  map-options
                  outlined
                  color="white"
                  bg-color="recinputstyle"
                  rounded
                />
              </div>
              <div class="col-12">
                <div class="input-label q-mb-sm">
                  选择{{ chooseCard() }}
                  <span style="color: #f53434">*</span>
                </div>
                <q-select
                  ref="bankCardRef"
                  v-model="bankCardInfo.bankId"
                  :options="banksList"
                  option-value="id"
                  option-label="name"
                  :placeholder="'选择' + chooseCard()"
                  @update:model-value="selectCard()"
                  :rules="[(val) => !!val || '请选择' + chooseCard()]"
                  lazy-rules
                  emit-value
                  map-options
                  outlined
                  color="white"
                  bg-color="recinputstyle"
                  rounded
                >
                  <template v-slot:selected-item="scope">
                    <q-item-section avatar>
                      <img
                        v-if="scope.opt.bankIcon"
                        style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                        :src="imgURL + scope.opt.bankIcon"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">
                        {{ scope.opt.name === "USDTTRC" ? "USDTTRC20" : scope.opt.name }}
                      </q-item-label>
                    </q-item-section>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img
                          v-if="scope.opt.bankIcon"
                          style="width: 30px; margin-top: 10px; margin-bottom: 10px"
                          :src="imgURL + scope.opt.bankIcon"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name === "USDTTRC" ? "USDTTRC20" : scope.opt.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <div v-if="isVirtual">
            <div class="input-label q-mb-sm">
              银行名城
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              ref="bankCardRef"
              v-model="bankName"
              disable
              readonly
              placeholder="银行名城"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            />
          </div>

          <div>
            <div class="input-label q-mb-sm">
              持卡人姓名
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              v-model="bankCardInfo.cardAccount"
              placeholder="持卡人姓名"
              :rules="cardAccountRules"
              lazy-rules
              :readonly="true"
              ref="cardAccountRef"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            />
          </div>

          <div>
            <div class="input-label q-mb-sm">
              {{ cardLabel() }}
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              v-model="bankCardInfo.cardNumber"
              :placeholder="cardLabel()"
              :rules="isCrypto || isEWALLET ? cardCryptoRules : cardNumberRules"
              ref="cardNumberRef"
              :type="isSZPAY ? 'number' : 'text'"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            ></q-input>
          </div>

          <div v-show="!isCrypto && !isEWALLET && !isALIPAY">
            <div class="input-label q-mb-sm">
              开户行地址
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              v-model="bankCardInfo.cardAddress"
              placeholder="开户行地址"
              :rules="cardAddressRules"
              ref="cardAddressRef"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            />
          </div>

          <div class="text-orange" v-if="isEWALLET">
            <span>*特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！</span>
          </div>

          <div class="q-mt-md">
            <div class="input-label q-mb-sm">
              电话号码
              <span style="color: #f53434">*</span>
            </div>

            <q-input
              ref="telRef"
              v-model="bankCardInfo.telephone"
              placeholder="电话号码"
              lazy-rules
              readonly
              clearable
              :rules="[(val) => (val && val.length > 7) || '请输入有效的电话号码', isValidCnPhone]"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="smartphone" />
              </template>
              <template v-slot:append>
                <q-btn
                  :label="otpCountdownCount <= 0 ? `获取验证码` : `已发送（倒数${otpCountdownCount}秒)`"
                  color="brightbtn"
                  :disable="otpCountdownCount > 0"
                  @click="openPhoneVeriDialog()"
                  rounded
                />
              </template>
            </q-input>
          </div>

          <div v-if="isSendOtp">
            <div class="input-label q-mb-sm">
              手机验证码
              <span style="color: #f53434">*</span>
            </div>
            <q-input
              v-show="bankCardInfo.smsCodeId"
              ref="phoneVerificationRef"
              type="text"
              v-model="bankCardInfo.smsCode"
              placeholder="手机验证码"
              lazy-rules
              maxlength="6"
              :rules="[(val) => (val && val.length > 3) || '请输入手机验证码']"
              outlined
              color="white"
              bg-color="recinputstyle"
              rounded
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="shield" />
              </template>
            </q-input>
          </div>

          <div class="flex flex-center">
            <q-btn class="q-mr-md" label="取消" color="orangebtn" @click="bankCardModalState.visible = false" rounded />
            <q-btn v-if="isSendOtp" color="brightbtn" label="提交" @click="submitBankCard" rounded />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCaptchaDialog" width="100%">
      <q-card width="100%" class="bg-darkbox">
        <q-toolbar-title class="q-mb-md">验证码</q-toolbar-title>

        <q-card-section>
          <q-input
            v-model="innerCaptchaRef"
            placeholder="验证码"
            outlined
            color="white"
            bg-color="recinputstyle"
            rounded
          >
            <template v-slot:append>
              <img
                :src="phoneVerificationImg"
                title="点击刷新验证码"
                style="margin-top: 6px; cursor: pointer; border-radius: 32px"
                @click="getCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <div class="row q-mt-md">
          <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" rounded class="q-ml-auto" />
        </div>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
      <q-card width="100%">
        <q-card-section style="padding: 10px 5px" class="q-pa-md bg-brightbtn text-white">
          <q-toolbar>
            <q-toolbar-title>验证码</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div style="padding: 20px">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input v-model="innerCaptchaRef" placeholder="验证码">
              <template v-slot:append>
                <img
                  :src="phoneVerificationImg"
                  title="点击刷新验证码"
                  style="margin-top: 6px; cursor: pointer"
                  @click="getInnerCode"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
        </div>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted, computed, watch} from "vue";
// import { Modal, message } from "ant-design-vue";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import {RiSpamLine, RiLink} from "vue-remix-icons";
// import { loadMemberInfo, loadBanks, loadBankCards, addBankCard, deleteBankCard } from "@/api/personal/personal";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar";
import {userStore} from "stores/index";
import * as _ from "lodash";
import {useLocalStorage} from "@vueuse/core";

import {useRouter} from "vue-router";

var qs = require("qs");
export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RiSpamLine, RiLink
  },
  setup() {
    const store = userStore();
    const $q = useQuasar();
    const isCrypto = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const isCardActive = ref();
    const isNoCard = ref(false);
    const searchForm = reactive({
      start: "",
      end: ""
    });
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + '/payment/'
    const columns = [
      {
        title: "Bank Name",
        dataIndex: "name",
        key: "name",
        slots: {title: "customTitle", customRender: "name"}
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
        slots: {customRender: "tags"}
      },
      {
        title: "Unbind Time",
        key: "action",
        slots: {customRender: "action"}
      }
    ];

    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
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
      setNewBankTypes();
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
      api.get("/session/allBankCard").then((res) => {
        if (res.code === 0) {
          personalState.bankCardList.push(...res.data);

          if (res.data.length === 0) {
            isNoCard.value = true;
          }
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
    const telRef = ref();

    const unbindCardNoRef = ref(null);
    const isUnbindCardModal = ref(false);
    const unbindCardNo = ref("");
    const unbindcarddetail = ref({});
    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const phoneVerificationRef = ref(null);

    const bankCardInfo = reactive({
      bankId: undefined,
      cardNumber: "",
      cardAccount: "",
      cardAddress: "",
      telephone: "",
      smsCode: "",
      smsCodeId: "",
      currencyId: "",
    });
    const router = useRouter();
    const bankName = ref();
    const banksList = ref([]);
    const isVirtual = ref(false)
    const isSZPAY = ref(false);
    const bankCardModal = (type) => {
      isNoCard.value = false;
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "" || store.realName == null) {
          $q.notify({
            color: "negative",
            position: "top",
            message: "请输入您的真实姓名",
            icon: "report_problem"
          });
          router.push("/account/personal");
        } else if (!store.phone || store.phone == "" || store.phone == null) {
          $q.notify({
            color: "negative",
            position: "top",
            message: "请输入您的电话号码",
            icon: "report_problem"
          });
          router.push("/account/verifyTelephone");
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          bankCardInfo.telephone = store.phone;
          bankCardInfo.smsCodeId = "";
          bankCardInfo.smsCode = "";
          bankCardInfo.currencyId = "";

          bankCardModalState.visible = true;
          if (bankCardModalState.banks.length === 0) {
            api.get("/session/withdraw/card").then((res) => {
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

    const selectedBankType = ref('银行卡')
    const selectBankType = () => {
      bankCardInfo.bankId = "";
      banksList.value = []
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "银行卡") {
          isCrypto.value = false
          isEWALLET.value = false
          isALIPAY.value = false
          if (element.bankType === 'BANK') {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "支付宝") {
          isCrypto.value = false
          isEWALLET.value = false
          isALIPAY.value = true
          if (element.bankType === 'BANK' && element.code === 'alipay') {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "数字货币") {
          isCrypto.value = true
          isEWALLET.value = false
          isALIPAY.value = false
          if (element.bankType === 'CRYPTO') {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "电子钱包") {
          isEWALLET.value = true
          isCrypto.value = false
          isALIPAY.value = false
          if (element.bankType === 'EWALLET') {
            banksList.value.push(element);
          }
        }
      })
    }
    const submitBankCard = () => {
      bankCardRef.value.validate();
      cardAccountRef.value.validate();
      // cardAddressRef.value.validate();
      cardNumberRef.value.validate();
      phoneVerificationRef.value.validate();
      // telRef.value.validate();

      if (bankCardRef.value.hasError || cardAccountRef.value.hasError
          // || cardAddressRef.value.hasError
          || phoneVerificationRef.value.hasError
          // || telRef.value.hasError
          || cardNumberRef.value.hasError) {
      } else {
        api.post("/session/bankCard", qs.stringify(bankCardInfo)).then((response) => {
          if (response.code === 0) {
            bankCardModalState.visible = false;
            if (isEWALLET.value === true) {
              $q.notify({
              color: "positive",
              position: "top",
              message: "已添加电子钱包",
              icon: "check_circle_outline"
            });
            } else {
              $q.notify({
                color: "positive",
                position: "top",
                message: "已添加银行卡",
                icon: "check_circle_outline"
              });
            }
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


    const confirmUnbindCard = (card) => {
      unbindCardNo.value = "";
      isUnbindCardModal.value = true;
      unbindcarddetail.value = card;
      console.log(unbindcarddetail.value);
    }
    const unbindCardEnter = () => {
      if (unbindcarddetail.value.bankType === 'CRYPTO') {
        return '请输入解绑钱包地址'
      } else if (unbindcarddetail.value.bankType === 'EWALLET') {
        return '请输入解绑电子钱包'
      } else {
        return '请输入解绑银行卡号'
      }
    }

    const selectCard = () => {
      // isALIPAY.value = false;
      // if(bankCardInfo.bankId === 78) {
      //     isALIPAY.value = true;
      //   }
    }

    const chooseCard = () => {
      if (isCrypto.value) {
        return '虚拟币'
      } else if (isEWALLET.value) {
        return '电子钱包'
      } else if (isALIPAY.value) {
      return "支付宝"
      } else {
        return '银行'
      }
    }
    const cardLabel = () => {
      if (isCrypto.value) {
        return '钱包地址'
      } else if (isEWALLET.value && !isSZPAY.value) {
        return '电子钱包'
      } else if (isEWALLET.value && isSZPAY.value) {
        return '数字人民币使用的手机号'
      } else if (isALIPAY.value) {
        return "支付宝账号"
      } else {
        return '银行卡号'
      }
    }


    const unbindCardLabel = () => {
      if (unbindcarddetail.value.bankType === 'CRYPTO') {
        return '钱包地址'
      } else if (unbindcarddetail.value.bankType === 'EWALLET') {
        return '电子钱包'
      } else {
        return '银行卡号'
      }
    }
    const unbindBankCard = (card) => {
      unbindCardNoRef.value.validate();

      if (unbindCardNoRef.value.hasError) {
        return;
      }

      // console.log(card);
      isUnbindCardModal.value = false;
      unbindcarddetail.value = _.clone({});
      const dialog = $q.dialog({
        class: "q-px-md q-pt-md",
        title: "解绑 " + card.bankName + "?",
        message: "你确定要解绑： " + card.bankName + "?",
        ok: {
          push: true,
          rounded: true,
          color: 'brightbtn',
          label: "确认",
          tabindex: 1
        },
        cancel: {
          push: true,
          rounded: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        api.post(`/session/bankCardByCardNo/${unbindCardNo.value}?_method=delete`).then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "操作成功",
              icon: "check_circle_outline"
            });
            unbindCardNo.value = "";
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
      if (isALIPAY.value == true) {
        return (val.length > 10 && val.length < 26) || '长度应为11到25个字符'
      } else if (isCrypto.value == true) {
        return (val.length > 33 && val.length < 37) || '长度应为34到36个字符'
      } else if (isEWALLET.value == true) {
        var selectedCode = null
        banksList.value.forEach(bank => {
          if (bank.id === bankCardInfo.bankId) {
            selectedCode = bank.code
          }
        });
        if (selectedCode === 'KDPAY') {
          return (val.length > 33 && val.length < 35) || '长度应为34个字符'
        } else if(selectedCode === 'EBPAY') {
          return (val.length > 33 && val.length < 35) || '长度应为34个字符'
        } else if(selectedCode === 'OKPAY') {
          return (val.length > 15 && val.length < 17) || '长度应为16个字符'
        }  else if(selectedCode === 'BLBPAY') {
          return (val.length > 31 && val.length < 33) || '长度应为32个字符'
        } else if(selectedCode === 'JDPAY') {
          return (val.length > 33 && val.length < 35) || '长度应为34个字符'
        } else if(selectedCode === 'SZPAY') {
          if (isNaN(val) || (/\s/.test(val))) {
            return '请输入数字人民币使用的手机号';
          }
          return (val.length > 10 && val.length < 12) || '长度应为11个字符'
        }
      } else {
        var selectedBankCode = null
        banksList.value.forEach(bank => {
          if (bank.id === bankCardInfo.bankId) {
            selectedBankCode = bank.code
          }
        });
        if (selectedBankCode === 'alipay') {
          return (val.length > 10 && val.length < 21) || '长度应为11到20个字符'
        } else {
          if (!/^\d+$/.test(val)) {
            return '请输入数字'
          }
          return (val.length > 15 && val.length < 20) || '长度应为16到19个字符'
        }
      }
    }
    const isValidCnPhone = () => {
      const phonePattern =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(bankCardInfo.telephone) || "请输入有效的电话号码";

    }

    const openPhoneVeriDialog = () => {
      // telRef.value.validate();
      // if (!telRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      // }

    }

    const getInnerCode = () => {
      api
          .get("/member/verificationCode")
          .then((response) => {
            if (response.code === 0) {
              phoneVerificationImg.value =
                  "data:image/png;base64," + response.data.img;
              innerCodeId.value = response.data.id;
              innerCaptchaRef.value = "";
            }
          })
          .catch((e) => {
            console.log(e)
          });
    }

    const isSendOtp = ref(false)
    const onCaptchaSubmit = () => {
      if (!bankCardInfo.telephone) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "手机号码不能为空",
          icon: "report_problem"
        });
        getInnerCode();
        return;
      }
      api.post(`/session/sendSms`, qs.stringify({
        captchaCode: innerCaptchaRef.value,
        codeId: innerCodeId.value
      }))
          .then(res => {
            let message = res.message || '发送手机验证码成功',
                color = 'positive'

            if (res.code === 0) {
              isSendOtp.value = true;
              showCaptchaDialog.value = false;
              countdownOtp();
              bankCardInfo.smsCode = "";
              bankCardInfo.smsCodeId = res.data.codeId;
              console.log(res.data.codeId)
            } else {
              color = 'negative';
              getInnerCode();
            }

            if (message) {
              $q.notify({message, color});
            }

            console.log('onCaptchaSubmit', res)
          }).catch(() => {
        getInnerCode();
      })
    }
    const cardNumberRules = computed(() => {
      var selectedCode = null
      banksList.value.forEach(bank => {
        if (bank.id === bankCardInfo.bankId) {
          selectedCode = bank.code
        }
      });
      if (selectedCode === 'SZPAY') {
        return [
          val => (val && val.length > 0) || '请绑定手机号',
          val => validateBankLength(val)
        ];
      } else {
        return [
          val => (val && val.length > 0) || '请输入卡号',
          val => validateBankLength(val)
        ];
      }
    });

    const bankTypeOptions = computed(() => [
      { name: "银行卡" },
      ...(alipayAvailable.value ? [{  name: "支付宝" }] : []),
      {  name: "数字货币" },
      {  name: "电子钱包" }
    ]);

    const alipayAvailable = ref(false);
    const setNewBankTypes = () => {
      api
        .get("/session/withdraw/card")
        .then((res) => {
          if (res.code === 0) {
            alipayAvailable.value = res.data.some(item =>
              item.code.toLowerCase().includes("alipay")
            );
          }
        })
        .catch((error) => {
          console.error("Error loading banks:", error);
        });
    };

    watch(
      () => bankCardInfo.bankId,
      (newVal, oldVal) => {
        isSZPAY.value = false;
        const selectedBank = banksList.value.find((bank) => bank.id === newVal);
        if (selectedBank) {
          bankCardInfo.currencyId = selectedBank.currencyIds;
          if (selectedBank.code === "SZPAY") {
            isSZPAY.value = true;
          }
        }
      }
    );

    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardInfo,
      submitBankCard,
      bankCardModal,
      unbindBankCard,
      isValidCnPhone,
      confirmUnbindCard,
      isUnbindCardModal,
      unbindCardNo,
      unbindcarddetail,
      unbindCardNoRef,
      telRef,
      openPhoneVeriDialog,
      showCaptchaDialog,
      phoneVerificationImg,
      innerCaptchaRef,
      getInnerCode,
      onCaptchaSubmit,
      phoneVerificationRef,
      // virtualCurrencyModalState,
      // virtualCurrencyFormRef,
      // virtualCurrencyInfo,
      // virtualCurrencyRules,
      // submitvirtualCurrency,
      // virtualCurrencyModal,
      showCard,
      isCardActive,
      isNoCard,
      isCrypto,
      isEWALLET,
      isALIPAY,
      bankName,
      isVirtual,
      bankCardRef,
      cardNumberRef,
      cardAccountRef,
      cardAddressRef,
      cardCryptoRules: [
        val => validateBankLength(val)
      ],
      cardNumberRules,
      cardAccountRules: [
        val => (val && val.length > 0) || '请输入银行卡号',
      ],
      cardAddressRules: [],
      selectedBankType,
      selectBankType,
      banksList,
      imgURL,
      store,
      chooseCard,
      selectCard,
      cardLabel,
      unbindCardEnter,
      unbindCardLabel,
      isSendOtp,
      isSZPAY,
      otpCountdownCount,
      bankTypeOptions,
      alipayAvailable,
      setNewBankTypes
    };
  }
});
</script>
<style scoped lang="scss">
.account-content {
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.withdrawBankView {
  // height: calc(100% - 109px);
  display: flex;
  flex-direction: column;
}

.widthdrawBankView--content > div > div,
.widthdrawBankView--content > div,
.widthdrawBankView--content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.widthdrawBankView--content-cta {
  margin-bottom: auto;
  padding-block: 1.2em;
}

.q-toolbar {
  background: #33bcd4;
}

.bank-card-item {
  background: #273354;
  box-shadow: 0px 0px 2px 0px #a9c9ea inset;
  border-radius: 32px;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
}
</style>

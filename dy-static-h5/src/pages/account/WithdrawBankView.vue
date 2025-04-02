<template>
  <div class="withdrawBankView">
    <!--    <div class="q-pa-md text-bold text-center" style="color: #33bcd4">-->
    <!--      专属网址：{{ store.evip }}-->
    <!--    </div>-->
    <div class="widthdrawBankView--content">
      <div class="account-content text-center">
        <div class="flex-box flex-wrap bank-card-list">
          <template v-for="(bc, index) in personalState.bankCardList" :key="bc.id">
            <q-card v-if="bc.bankName" @click="showCard(bc, index)" class="q-pa-sm text-left row items-center">
              <div class="bank-icon-div">
                <img src="../../assets/account/bank-icon.png" />
              </div>
              <div class="bank-card-info">
                <div class="cardname q-pa-xs">
                  <div class="txt-center">
                    {{ bc.bankName }}
                    <!-- <div>Bank Account Number</div> -->
                  </div>
                </div>
                <div class="bottom q-pa-xs">
                  <div class="flex-box cards">
                    <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">
                      ****{{ b.slice(b.length - 4, b.length) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="unbind-card-div">
                <q-btn @click="confirmUnbindCard(bc)" class="unbind-btn" rounded color="secondary">解绑</q-btn>
              </div>
            </q-card>
          </template>
          <div class="q-pa-sm widthdrawBankView--content-cta">
            <q-btn
              color="dyblue"
              style="width: 100%"
              label="绑定"
              icon="add_circle_outline"
              @click="bankCardModal('bank')"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="isUnbindCardModal" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section class="q-mb-md">
          <div class="text-h6 text-center">{{ unbindCardEnter() }}</div>
        </q-card-section>
        <q-form>
          <div>
            <!-- <q-input
              filled
              clearable
              ref="unbindCardNoRef"
              class="q-mb-md"
              v-model="unbindCardNo"
              :label="unbindCardLabel()"
              color="dyblue"
              :rules="[
                (val) => (val && val.length > 10 && val == unbindcarddetail.cardNumber) || unbindCardLabel() + '不正确'
              ]"
            /> -->
            <q-input
              filled
              clearable
              ref="unbindCardNoRef"
              class="q-mb-md"
              v-model="unbindCardNo"
              :label="unbindCardLabel()"
              color="dyblue"
              :rules="[(val) => (val && val.length > 0) || '请输入' + unbindCardLabel() ]"
            />
          </div>

          <div class="flex flex-center">
            <q-btn class="q-mr-md" label="取消" @click="isUnbindCardModal = false" />
            <q-btn color="dyblue" label="提交" @click="unbindBankCard(unbindcarddetail)" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bankCardModalState.visible" persistent no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; padding: 10px">
        <q-card-section v-if="!isVirtual" class="q-mb-md">
          <div class="text-h6">绑定</div>
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
                  :options="bankTypeOptions"
                  label="类型"
                  color="blue"
                  label-color="dyblue"
                  option-label="name"
                  option-value="name"
                  @update:model-value="selectBankType(opt)"
                  emit-value
                  map-options
                />
              </div>
              <span v-if="selectedBankType === '电子钱包'" class="tip-text">
                *特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！
              </span>

              <div class="col-12">
                <q-select
                  ref="bankCardRef"
                  class=""
                  color="dyblue"
                  filled
                  label-color="dyblue"
                  v-model="bankCardInfo.bankId"
                  :options="banksList"
                  option-value="id"
                  option-label="name"
                  :label="'选择' + chooseCard()"
                  @update:model-value="selectCard()"
                  :rules="[(val) => !!val || '请选择' + chooseCard()]"
                  lazy-rules
                  emit-value
                  map-options
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
            <q-input
              filled
              ref="bankCardRef"
              class=""
              v-model="bankName"
              disable
              readonly
              label="银行名城"
              color="dyblue"
            />
          </div>
          <q-input
            class=""
            filled
            v-model="bankCardInfo.cardAccount"
            label="特卡人姓名"
            :rules="cardAccountRules"
            lazy-rules
            :readonly="true"
            ref="cardAccountRef"
            color="dyblue"
          />
          <q-input
            filled
            class=""
            v-model="bankCardInfo.cardNumber"
            :label="cardLabel()"
            :rules="isCrypto || isEWALLET ? cardCryptoRules : cardNumberRules"
            ref="cardNumberRef"
            :type="isSZPAY ? 'number' : 'text'"
            color="dyblue"
          />

          <q-input
            v-show="!isCrypto && !isEWALLET && !isALIPAY"
            class="q-mb-md"
            filled
            v-model="bankCardInfo.cardAddress"
            label="开户行地址"
            :rules="cardAddressRules"
            ref="cardAddressRef"
            color="dyblue"
          />

          <q-input
            filled
            ref="telRef"
            v-model="bankCardInfo.telephone"
            label="电话号码"
            lazy-rules
            readonly
            clearable
            :rules="[(val) => (val && val.length > 7) || '请输入有效的电话号码', isValidCnPhone]"
            color="dyblue"
          >
            <template v-slot:prepend>
              <q-icon color="dark" name="smartphone" />
            </template>
            <template v-slot:append>
              <q-btn
              :label="otpCountdownCount <= 0 ? `获取验证码` : `已发送（倒数${otpCountdownCount}秒)`"
              color="brightbtn" @click="openPhoneVeriDialog()"
              :disable="otpCountdownCount > 0" />
            </template>
          </q-input>

          <q-input
            v-if="isSendOtp"
            filled
            class="q-mb-md"
            v-show="bankCardInfo.smsCodeId"
            ref="phoneVerificationRef"
            type="text"
            v-model="bankCardInfo.smsCode"
            label="手机验证码"
            lazy-rules
            color="dyblue"
            maxlength="6"
            :rules="[(val) => (val && val.length > 3) || '请输入手机验证码']"
          >
            <template v-slot:prepend>
              <q-icon color="dark" name="shield" />
            </template>
          </q-input>

          <div class="flex flex-center">
            <q-btn class="q-mr-md" label="取消" color="warning" @click="bankCardModalState.visible = false" />
            <q-btn v-if="isSendOtp" color="dyblue" label="提交" @click="submitBankCard" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
      <q-card width="100%">
        <q-card-section style="padding: 10px 5px" class="q-pa-md bg-dyblue text-white">
          <q-toolbar>
            <q-toolbar-title>验证码</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div style="padding: 20px">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input
              ref="refInnerCaptcha"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
              v-model="innerCaptchaRef"
              placeholder="验证码"
            >
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
          <q-btn @click="onCaptchaSubmit" label="发送验证码" color="dyblue" />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog width="100%" v-model="isNewUser" no-backdrop-dismiss no-esc-dismiss>
      <q-card style="width: 100%; padding: 20px" class="text-black">
        <q-card-section class="q-mb-md text-center" style="flex-direction: column">
          <strong>温馨提示</strong>
          <br />
          <br />
          为保证资金安全，绑卡前需先验证手机号
        </q-card-section>
        <q-card-actions align="right">
          <router-link to="/account/verifyTelephone">
            <q-btn label="前往验证" color="dyblue" />
          </router-link>
        </q-card-actions>
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
import {defineComponent, reactive, ref, onMounted, computed, watch} from "vue";
// import { Modal, message } from "ant-design-vue";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
// import { loadMemberInfo, loadBanks, loadBankCards, addBankCard, deleteBankCard } from "@/api/personal/personal";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar";
import {userStore} from "stores/index";

import {useRouter} from "vue-router";
import { useLocalStorage } from "@vueuse/core";

var qs = require("qs");
export default defineComponent({
  name: "WithdrawBankView",
  components: {
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
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + '/payment/'
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

    const isNewUser = ref(false);
    const checkNewUser = () => {
      if (store.phone === "" || store.phone === null) {
        isNewUser.value = true;
      }
    };

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
      checkNewUser();
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
          res.data.forEach(element => {
            if (element){
              personalState.bankCardList.push(element);
            }
          });

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
    const refInnerCaptcha = ref();

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
      isSendOtp.value = false;
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
            message: "请输入您的电话",
            icon: "report_problem"
          });
          router.push("/account/personal");
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
          if (element.bankType === 'BANK' && element.code !== 'alipay') {
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
      // console.log(unbindcarddetail.value);
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
      // if(bankCardInfo.bankId === 'alipay') {
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
          color: 'dyblue',
          label: "确认",
          tabindex: 1
        },
        cancel: {
          push: true,
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
          if (!/^\d+$/.test(val)) {
            return '请输入数字人民币使用的手机号'
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
          if (!/^\d+$/.test(val)) {
            return '请输入数字'
          }
          return (val.length > 15 && val.length < 20) || '长度应为16到19个字符'
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
      } else if (refInnerCaptcha.value?.hasError) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "验证码必须为4个字符串",
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
      telRef,
      openPhoneVeriDialog,
      confirmUnbindCard,
      isUnbindCardModal,
      unbindCardNo,
      unbindcarddetail,
      unbindCardNoRef,
      showCaptchaDialog,
      phoneVerificationImg,
      innerCaptchaRef,
      refInnerCaptcha,
      getInnerCode,
      onCaptchaSubmit,
      phoneVerificationRef,
      isNewUser,
      isValidCnPhone,
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

.add-card-btn {
  border-radius: 8px;
  height: 45px;
  font-size: 16px;
}

.bank-card-info {
  width: calc(100% - 142px);
  padding: 0px 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  .cardname {
    font-size: 16px;
    font-weight: 600;
  }

  .cards {
    font-size: 16px;
    letter-spacing: 1px;
  }
}

.unbind-card-div {
  margin-bottom: auto;
}

.unbind-btn {
  width: 70px;
  height: 32px;
  white-space: normal;
  background: #d9d9d9;
}

.withdrawBankView {
  height: calc(100% - 109px);

  display: flex;
  flex-direction: column;
}

.bank-icon-div {
  width: 64px;
  height: 64px;
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
  background: transparent;
}

.tip-text {
  display: block;
  width: 100%;
  color: #ff7f10;
}
</style>

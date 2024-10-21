<template>
  <div>
    <div class="account-title-container">
      <span class="account-title">{{ $t('withdraw.bankcard') }}</span>
    </div>
    <div class="account-content">
      <div class="account-tip-text wbot"></div>

      <div class="flex-box flex-wrap bank-card-list">
        <div
          class="bank-card-item active"
          :class="{
            USDT: bc.bankName === 'GCASH'
          }"
          @click="showCard(bc, index)"
          v-for="(bc, index) in personalState.bankCardList"
          :key="bc.id"
        >
          <div class="card-details">
            <div class="card-bank-icon">
              <img :src="imgURL + bc.bankIcon" />
            </div>

            <div class="card-name">
              <div class="card-bank-name">{{ bc.bankName === "USDTTRC" ? "USDTTRC20" : bc.bankName }}</div>
              <div class="card-bank-type">{{ checkType(bc.bankType) }}</div>
            </div>
          </div>

          <div class="flex-box card-num">
            <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">
              {{ b.slice(0, 4) }}
            </div>
            <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">&nbsp;****&nbsp;</div>
            <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">&nbsp;****&nbsp;</div>
            <div v-for="b in bc.cardNumber.split()" :key="b" class="card-num-box">
              {{ b.slice(b.length - 4, b.length) }}
            </div>
          </div>

          <div class="unlink-btn" @click="unbindBankCard(bc)">
            <img width="20" height="20" src="../../assets/images/finance/bank-card-unlink-icon.svg" />
          </div>
        </div>
        <div class="bank-card-item add" @click="bankCardModal('bank')">
          <img width="20" height="20" src="../../assets/images/finance/bank-card-link-icon.svg" />
          <span class="lock-card-txt">{{ $t('withdraw.addBankCard') }}</span>
        </div>
      </div>
    </div>
    <div class="account-title-container bindunbind">
      <span class="account-title">{{ $t('withdraw.unbindBankCardRecords') }}</span>
    </div>
    <div class="account-content last bindunbind">
      <div class="searchbar">
        <el-form layout="inline" :model="searchForm">
          <div class="left">
            <el-form-item :label="$t('common.startDate')">
              <el-date-picker
                v-model="searchForm.startDate"
                show-time
                type="date"
                :placeholder="$t('common.startDate')"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item :label="$t('common.endDate')">
              <el-date-picker
                v-model="searchForm.endDate"
                show-time
                type="date"
                :placeholder="$t('common.endDate')"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <button class="standard-button btn-color-blue" type="button" @click="searchRecord()">{{ $t('withdraw.search') }}</button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="unbind-record-wrapper">
        <!-- <el-table
            :columns="columns"
            :datel-source="dataSource"
            :row-key="(record) => record.bankName"
          ></el-table> -->

        <el-table :data="dataSource" style="width: 100%" v-loading="tblLoading">
          <template #empty>
            <emptyData />
          </template>
          <el-table-column v-for="tbl in columns" :key="tbl.key" :prop="tbl.dataIndex" :label="tbl.title">
            <template #default="scope">
              <template v-if="tbl.dataIndex === 'bankName'">
                {{ getOptionLabel(scope.row.bankName) }}
              </template>
              <template v-if="tbl.dataIndex === 'cardNumber'">
                {{ maskCardNumber(scope.row.cardNumber) }}
              </template>
            </template>
            <!-- <template
                    v-if="tbl.dataIndex === 'recordTime'"
                    #default="scope"
                  >
                    <div style="display: flex; align-items: center">
                      <span>{{ scope.row.recordTime }}</span>
                    </div>
                  </template>
            -->
          </el-table-column>
        </el-table>
        <el-divider />
        <el-pagination
          @current-change="handleCurrentChange"
          :total="pagination.totalPage"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :page-count="pagination.pageCount"
        />
      </div>
    </div>
    <el-dialog class="bankModal" width="600" v-model="bankCardModalState.visible" :footer="null" :title="$t('withdraw.bindCard')">
      <div type="warning" class="account-tip-warning">
        <ul>
          <li>{{ $t('personal.bankCardReminder1') }}</li>
          <li>{{ $t('personal.bankCardReminder2') }}</li>
        </ul>
      </div>
      <el-form ref="bankCardFormRef" :model="bankCardInfo" :rules="bankCardRules">
        <el-form-item prop="bankId" :rules="[{ required: true, message: $t('placeholder.selectBank'), trigger: 'blur' }]">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-select :placeholder="$t('withdraw.type')" v-model="selectedBankType" style="width: 100%" @change="selectBankType">
                <el-option v-for="bank in bankTypes" :key="bank.value" :value="bank.value" :label="bank.text">
                  {{ bank.text }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="15">
              <el-select
                class="select"
                v-model="bankCardInfo.bankId"
                :placeholder="$t('withdraw.choose') + ' ' + chooseCard()"
                style="width: 100%"
              >
                <el-option v-for="b in banksList" :key="b.id" :label="getOptionLabel(b.name)" :value="b.id">
                  <el-row style="align-items: center" v-if="b.bankIcon" :gutter="10">
                    <el-col :span="3">
                      <img style="max-height: 25px; display: block; margin: 5px" :src="imgURL + b.bankIcon" />
                    </el-col>
                    <el-col :span="21">
                      {{ getOptionLabel(b.name) }}
                    </el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-input disabled v-model="bankCardInfo.cardAccount" />
        </el-form-item>
        <el-form-item prop="cardNumber" name="cardNumber">
          <el-input v-model="bankCardInfo.cardNumber" :placeholder="numAddress()" />
        </el-form-item>
        <el-form-item prop="cardAddress" name="cardAddress" v-if="!isUSDT && !isEWALLET && !isALIPAY">
          <el-input
            v-model="bankCardInfo.cardAddress"
            :placeholder="$t('withdraw.bankBranchAddress')"
            :rules="[{ required: true, message: $t('placeholder.bankBranchAddress'), trigger: 'blur' }]"
          />
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-space>-->
<!--            <el-input-->
<!--              class="half"-->
<!--              v-model="bankCardInfo.telephone"-->
<!--              placeholder="输入电话号码"-->
<!--              readonly-->
<!--              :value="personalState.memberInfo.telephone"-->
<!--            />-->
<!--            <el-button class="common-btn" @click="openCaptchaForm()">获取验证码</el-button>-->
<!--          </el-space>-->
<!--        </el-form-item>-->

        <el-form-item name="smsCode" prop="smsCode" >
          <el-space>
          <el-input
            class="half"
            :readonly="!isSendOtp"
            v-model="bankCardInfo.smsCode"
            :placeholder="$t('withdraw.smsCodeRequired')"
            @keyup.enter="submitBankCard"
            style="width:340px;"
          />
            <el-button class="common-btn" @click="openCaptchaForm()">{{$t('personal.getVerificationCode')}}</el-button>
          </el-space>
        </el-form-item>

        <el-form-item class="txt-center" v-if="isSendOtp">
          <el-button class="txt-center common-btn" @click="submitBankCard">{{ $t('common.submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="phoneCaptchaDialogVisible" :title="$t('personal.captcha')" width="50%" align-center style="max-width: 500px">
      <el-button size="large" color="#3bafda" class="common-btn" style="width:100%;" @click="sendOtp">
        {{$t('common.submit')}}
      </el-button>
    </el-dialog>

    <el-dialog
      v-model="captchaDialogVisible"
      :title="$t('personal.captcha')"
      width="50%"
      align-center
      style="max-width: 500px"
      :close-on-click-modal="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="160" label-suffix=":">
        <el-form-item tabindex="3" :label="$t('personal.captcha')" prop="captchaCode" :rules="[{ required: true, message: $t('placeholder.captchareq'), trigger: 'blur' }]" >
          <el-row :gutter="10" style="justify-content: center; align-items: center">
            <el-col :span="12">
              <el-input v-model="captchaForm.captchaCode" :label="$t('personal.captcha')" :placeholder="$t('personal.captcha')" @keyup.enter="sendOtp" />
            </el-col>
            <el-col :span="12">
              <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="sendOtp">
          {{ $t('common.send') }}
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  loadBanks,
  loadBankCards,
  loadUnbindRecord,
  addBankCard,
  deleteBankCardByNumber,
  loadMemberInfo,
  loadMemberTelephone
} from "@/api/personal/personal";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { sendSessionSms } from "@/api/personal/personal";
import { InfoFilled } from "@element-plus/icons-vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import { i18nStore } from '@/store/language'
import emptyData from "@/components/emptyData.vue";
import { storeToRefs } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InfoFilled, emptyData
  },
  setup() {
    const { t } = useI18n();
    let validateEmptyCardNo = async (r, v) => {
      if (selectedBankType.value === "Bank") {
        if (v === "") {
          return Promise.reject(t('withdraw.inputAccNumber'));
        } else if (/^\d+$/.test(v) === false) {
          return Promise.reject(t('placeholder.onlyNumber'));
        } else {
          return Promise.resolve();
        }
      } else if (selectedBankType.value === "Crypto") {
        if (v === "") {
          return Promise.reject(t('withdraw.enterWalletNumber'));
        } else if (/^[A-Za-z0-9]*$/.test(v) === false) {
          return Promise.reject(t('withdraw.virtualWallet'));
        } else {
          return Promise.resolve();
        }
      }
      return Promise.resolve();
    };
    let validateBankLength = async (r, v) => {
        var min = 6;
        var max = 20;
      if (selectedBankType.value === "Bank") {
          min = 6;
          max = 20;
        var selectedBankCode = null;
        banksList.value.forEach(bank => {
          if (bank.id === bankCardInfo.bankId) {
            selectedBankCode = bank.code;
          }
        });
        if (selectedBankCode === "alipay") {
          // min = 11;
          // max = 20;
        } else {
          if (!/^\d+$/.test(v)) {
            return Promise.reject(t('withdraw.enterDigits'));
          }
        }

      } else if (selectedBankType.value === "Crypto") {
        min = 34;
        max = 36;
      } else if (selectedBankType.value === "e-Wallet") {
        // min = 34;
        // max = 34;
        var selectedCode = null;
        banksList.value.forEach(bank => {
          if (bank.id === bankCardInfo.bankId) {
            selectedCode = bank.code;
          }
        });
        if (selectedCode === "KDPAY") {
          // min = 34;
          // max = 34;
        } else if (selectedCode === "EBPAY") {
          // min = 34;
          // max = 34;
        } else if (selectedCode === "OKPAY") {
          // min = 16;
          // max = 16;
        }
      }
      if (v === "") {
        return Promise.reject(t('withdraw.inputAccNumber'));
      } else if (v.length < min || v.length > max) {
        if (min === max) {
          return Promise.reject(t('withdraw.lengthShouldBe') + " " + min);
        } else {
          return Promise.reject(t('withdraw.lengthShouldBe') + " " + min + "-" + max);
        }
      } else {
        return Promise.resolve();
      }
    };
    const checkType = (type) => {
      if (type === 'BANK') {
        return t('withdraw.bank')
      } else if (type === 'CRYPTO') {
        return t('withdraw.usdt')
      } else if (type === 'EWALLET') {
        return '电子钱包'
      }
    }
    const tblLoading = ref(false);
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/payment/";
    const isCardActive = ref();
    const isUSDT = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const store = userStore();
    const searchForm = reactive({
      startDate: "",
      endDate: "",
      size: 10
    });
    const router = useRouter();
    const columns = ref([
      {
        title: t('withdraw.bank'),
        dataIndex: "bankName",
        key: "bankName"
      },
      {
        title: t('withdraw.cardNumber'),
        dataIndex: "cardNumber",
        key: "cardNumber"
      },
      {
        title: t('withdraw.cardAddress'),
        dataIndex: "cardAddress",
        key: "cardAddress"
      },
      {
        title: t('withdraw.bindTime'),
        key: "bindTime",
        dataIndex: "bindTime"
      },
      {
        title: t('withdraw.unbindTime'),
        key: "unbindTime",
        dataIndex: "unbindTime"
      }
    ]);
    const maskCardNumber = (cardNumber) => {
      const maskedDigits = cardNumber.slice(0, -4).replace(/[a-zA-Z0-9]/g, "*");
      const lastFourDigits = cardNumber.slice(-4);
      return maskedDigits + lastFourDigits;
    };
    const pagination = ref([{
      currentPage: 1,
      totalPage: 1,
      pageSize: 5,
      pageCount: 1
    }]);
    const bankTypes = [{ value: "Bank", text: t('withdraw.bank') }, { value: "Crypto", text: t('withdraw.usdt') }
    // , {
    //   value: "e-Wallet",
    //   text: "电子钱包"
    // }
  ];
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    const dataSource = ref();
    const searchRecord = () => {
      if(!searchForm.startDate || !searchForm.endDate){
        ElMessage({
          message: t('withdraw.startEndDate'),
          type: "error"
        });
        return;
      }

      // debugger;
      tblLoading.value = true;
      loadUnbindRecord(searchForm).then((response) => {
        tblLoading.value = false;
        if (response.code === 0) {
          dataSource.value = response.data.records;
          pagination.value.currentPage = response.data.current;
          pagination.value.totalPage = response.data.total;
          pagination.value.pageCount = response.data.pages;
        } else {
          ElMessage.error({
            type: "error",
            message: res.message
          });
          tblLoading.value = false;
        }
      })
    };


    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate()) < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + "")
      };
      var useDate = newDate.Y + newDate.M + newDate.D;
      return useDate;
    };

    const getTime = () => {
      searchForm.startDate = chgDate(30);
      searchForm.endDate = chgDate(0);
      searchRecord();
    };

    const withdrawState = reactive({
      bankCardList: []
    });

    const loadInfo = () => {
      loadMemberInfo().then((response) => {
        if (response.code === 0) {
          personalState.memberInfo = response.data;
          bankCardInfo.telephone = personalState.memberInfo.telephone;
          // console.log(bankCardInfo.telephone);
          if (personalState.memberInfo.birthday) {
            personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
          }
        } else {
          ElMessage.error({
            type: "error",
            message: response.message
          });
        }
      })
      loadMemberTelephone().then((response) => {
        if (response.code === 0) {
          bankCardInfo.telephone = response.data;
        } else {
          ElMessage.error({
            type: "error",
            message: response.message
          });
        }
      })
    };

    const checkBankCards = () => {
      ElMessageBox.alert(
        t('bankError.bankCardFirst'), t('common.systemError'),
        {
          showClose: false,
          showCancelButton: false,
          confirmButtonText: t('common.confirm'),
          draggable: false,
          buttonSize: "small",
          closeOnClickModal: false,
          center: true
        }
      )
        .then(() => {
          router.push("/center/personal");
        })
        .catch(() => {
        });
    };

    onMounted(() => {
      getTime();
      loadCards();
      loadInfo();
    });

    const handleCurrentChange = (val) => {
      pagination.value.currentPage = val;
      searchForm.current = val;

      searchRecord();
    };
    const showCard = (item, index) => {
      // if (index === isCardActive.value) {
      //   isCardActive.value = null;
      //   console.log(isCardActive.value)
      // } else {
      //   isCardActive.value = index
      // }
      isCardActive.value = index;
    };
    const loadCards = () => {
      personalState.bankCardList = [];
      loadBankCards().then((response) => {
        if (response.code === 0) {
          personalState.bankCardList.push(...response.data);
        } else {
          ElMessage.error({
            type: "error",
            message: response.message
          });
        }
      })
    };

    //add bank card
    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });
    const bankCardFormRef = ref();
    const bankCardInfo = reactive({
      bankId: undefined,
      cardNumber: "",
      cardAccount: "",
      cardAddress: "",
      // telephone: "",
      smsCode: "",
      smsCodeId: ""
    });
    const bankName = ref();
    const banksList = ref([]);
    const bankCardModal = () => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "") {
          ElMessage.error(t('withdraw.realNameNotEmpty'));
          return;
        } else if (!store.phone || store.phone == "") {
          ElMessage.error(t('withdraw.beforeBindVerifyPhone'));
          return;
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          // bankCardInfo.telephone = "";
          bankCardInfo.smsCode = "";
          bankCardInfo.smsCodeId = "";
          bankCardModalState.visible = true;
          if (bankCardModalState.banks.length === 0) {
            loadBanks().then((res) => {
              if (res.code === 0) {
                bankCardModalState.banks.push(...res.data);
                selectBankType();
              } else {
                ElMessage.error({
                  type: "error",
                  message: res.message
                });
              }
            }).catch((e) => {
              console.log("error", e);
            });
          }
        }
      });
    };
    const selectedBankType = ref("Bank");
    const selectBankType = () => {
      banksList.value = [];
      bankCardInfo.bankId = null;
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "Bank") {
          isUSDT.value = false;
          isEWALLET.value = false;
          if (element.bankType === "BANK") {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "Crypto") {
          isUSDT.value = true;
          isEWALLET.value = false;
          if (element.bankType === "CRYPTO") {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "e-Wallet") {
          isEWALLET.value = true;
          isUSDT.value = false;
          if (element.bankType === "EWALLET") {
            banksList.value.push(element);
          }
        }
      });
      if (bankCardInfo.cardNumber != "") {
        bankCardFormRef.value.validateField("cardNumber");
      }
    };

    const phoneCaptchaDialogVisible = ref(false);
    const isSendOtp = ref(false);

    const sendOtp = async () => {
      if (captchaForm.captchaCode.length < 4) {
        
        ElMessage({
          type: "error",
          message: t('placeholder.captcha')
        });
        return
      }
      const smsDetail = {
        // telephone: bankCardInfo.telephone,
        captchaCode: captchaForm.captchaCode,
        codeId: captchaForm.codeId
      };
      sendSessionSms(smsDetail)
        .then((response) => {
          if (response.code == 0) {
            isSendOtp.value = true;
            captchaForm.smsCodeId = response.data.codeId;
            bankCardInfo.smsCodeId = response.data.codeId;

            ElMessage({
              type: "success",
              message: t('withdraw.verifyCodeSuccess')
            });
            captchaDialogVisible.value = false;
          } else {
            ElMessage.error({
              type: "error",
              message: response.message
            });
            getCode();
          }
        });
    };

    const verificationImg = ref("");

    const sendSmsForSubmitBankCard = () => {
      bankCardFormRef.value
        .validate()
        .then(() => {
          // console.log(bankCardFormRef.value)
          // bankCardModalState.visible = false;
          // openCaptchaForm();
          phoneCaptchaDialogVisible.value = true;
        }).catch((error) => {
        console.log("error", error);
      });
    };

    const getCode = () => {
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          captchaForm.codeId = res.data.id;
        } else {
          ElMessage.error({
            type: "error",
            message: res.message
          });
        }
      });
    };

    const captchaForm = reactive({
      captchaCode: "",
      codeId: "",
      smsCodeId: ""
    });

    const captchaDialogVisible = ref(false);

    const openCaptchaForm = () => {
      // bankCardFormRef.value.validateField('telephone').then((resp) => {
      // bankCardFormRef.telephone = "";
      captchaForm.captchaCode = "";
      captchaDialogVisible.value = true;
      getCode();
      // }).catch((err) => {
      // ElMessage({
      // message: '请输入有效的中国手机号码',
      // type: 'error',
      // })
      // })
    };

    const submitBankCard = () => {
      console.log(bankCardInfo);
      bankCardFormRef.value
        .validate()
        .then(() => {
          addBankCard(bankCardInfo).then((response) => {
            if (response.code === 0) {
              ElMessage({
                message: t('common.success'),
                type: "success"
              });
              bankCardModalState.visible = false;
              loadCards();
            } else {
              ElMessage.error({
                type: "error",
                message: response.message
              });
            }
          }).catch((error) => {
            console.log(error.message);
            // message.error(error.message, 4);
          });
        }).catch((error) => {
        console.log("error", error);
      });
    };

    const bankCardRules = {
      cardNumber: [
        {
          required: true,
          validator: validateEmptyCardNo,
          trigger: "blur"
        },
        {
          required: true,
          validator: validateBankLength,
          trigger: "blur"
        }

      ],
      cardAddress: [
        {
          required: true,
          message: t('withdraw.inputBankBranch'),
          trigger: "blur"
        }
      ]
      // telephone: [
      //   {
      //     required: true,
      //     message: "请输入电话号码",
      //     trigger: "blur"
      //   },
      //   {
      //     pattern: /^1[3-9]\d{9}$/,
      //     message: "请输入有效的中国手机号码",
      //     trigger: "blur",
      //   },
      // ],
      // smsCode: [
      //   {
      //     required: true,
      //     message: "请输入验证码",
      //     trigger: "blur"
      //   }
      // ]
    };

    const captchaRules = {
      captchaCode: [
        {
          required: true,
          validator: t('placeholder.captcha'),
          trigger: "blur"
        }
      ]
    };
    const unbindBankCard = (card) => {

      ElMessageBox.prompt(
        `${t('withdraw.enterUnbind')}${getOptionLabel(card.bankName)}${t('withdraw.of')}${card.bankType === "CRYPTO" || card.bankType === "EWALLET" ? "钱包地址" : t('withdraw.accountNo')}`,
        t('withdraw.confirmUnbind'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText:  t('common.cancel'),
          cancelButtonClass: "cancel-btn",
          type: "warning",
          inputErrorMessage: t('withdraw.confirmCorrectNumber') // Error message to display if input is invalid
        }
      )
      .then((inputValue) => {
          if (!inputValue.value) {
            ElMessage({
              type: 'error',
              message: t('placeholder.pleaseEnterCardNumber'),
            });
            return
          }
          deleteBankCardByNumber(inputValue.value).then((res) => {
              if (res.code === 0) {
                ElMessage({
                  type: "success",
                  message: t('withdraw.unbindSuccessful')
                });
                // loadCards();
                searchRecord();
                for (let i = 0; i < personalState.bankCardList.length; i++) {
                  if (personalState.bankCardList[i].id === card.id) {
                    personalState.bankCardList.splice(i, 1);
                  }
                }
              } else {
                ElMessage.error({
                  type: "error",
                  message: res.message
                });
              }
            }).catch((e) => {
              console.log("error", e);
            });
          })
        .catch(() => {
          ElMessage({
            type: "info",
            message:t('withdraw.cancelUnbind')
          });
        });
    };

    const getOptionLabel = (bankOption) => {
      if (bankOption === "USDTTRC") {
        return "USDTTRC20";
      } else {
        return bankOption;
      }
    };

    const chooseCard = () => {
      isALIPAY.value = false;
      if (isUSDT.value) {
        return t('withdraw.usdt');
      } else if (isEWALLET.value) {
        return "电子钱包";
      } else {
        banksList.value.forEach(bank => {
          if (bank.id === bankCardInfo.bankId) {
            if (bank.code === "alipay") {
              isALIPAY.value = true;
            }
          }
        });
        return t('withdraw.bank');
      }
    };

    const numAddress = () => {
      if (isUSDT.value) {
        return t('withdraw.usdtAddress');
      } else if (isEWALLET.value) {
        return "电子钱包";
      } else {
        return t('withdraw.accountNo');
      }
    };
    const i18nStoreLanguage = i18nStore()
    const { languageVal } = storeToRefs(i18nStoreLanguage)
    watch(languageVal, () => {
      
      columns.value = [
      {
        title: t('withdraw.bank'),
        dataIndex: "bankName",
        key: "bankName"
      },
      {
        title: t('withdraw.cardNumber'),
        dataIndex: "cardNumber",
        key: "cardNumber"
      },
      {
        title: t('withdraw.cardAddress'),
        dataIndex: "cardAddress",
        key: "cardAddress"
      },
      {
        title: t('withdraw.bindTime'),
        key: "bindTime",
        dataIndex: "bindTime"
      },
      {
        title: t('withdraw.unbindTime'),
        key: "unbindTime",
        dataIndex: "unbindTime"
      }
    ];
    })
    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardFormRef,
      bankCardInfo,
      bankCardRules,
      submitBankCard,
      sendSmsForSubmitBankCard,
      openCaptchaForm,
      captchaForm,
      captchaRules,
      getCode,
      verificationImg,
      captchaDialogVisible,
      bankCardModal,
      unbindBankCard,
      showCard,
      isCardActive,
      isUSDT,
      isEWALLET,
      isALIPAY,
      bankName,
      bankTypes,
      selectBankType,
      selectedBankType,
      banksList,
      searchRecord,
      dataSource,
      imgURL,
      pagination,
      handleCurrentChange,
      tblLoading,
      maskCardNumber,
      sendOtp,
      phoneCaptchaDialogVisible,
      isSendOtp,
      getOptionLabel,
      withdrawState,
      checkBankCards,
      chooseCard,
      numAddress,
      checkType
    };
  }
});
</script>

<style scoped lang="scss">
body {
  .bankModal {
    .el-dialog__body {
      padding: 20px;
    }

    .el-row {
      width: 100%;
    }
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
    width: 100%;
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

  .ant-modal-content {
    width: 100%;
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
    width: 100%;
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

.ant-space-item:nth-child(1) {
  flex: 2;
}

.ant-space-item:nth-child(2) {
  flex: 4;
}

.account-tip-warning {
  border: 1px solid #F8DD9A;
  background: #FEF7E6; 
  color: #FFC024;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  ul {
    margin: 0;
    padding: 0 0 0 21px;
  }
  svg {
    height: 15px;
    fill: #FFC024;
    margin-right: 10px;
  }
}
</style>

<style scoped lang="scss">
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

:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  height: 40px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #24222e;
  color: #ffffff;
  border: 0;
}

.common-btn {
  cursor: pointer;

  &.search-btn {
    margin-top: 0;
    padding: 3px 5px;
    font-size: 14px;
  }

  &.verification-btn {
    padding: 5px;
  }

  &.submit-btn {
    padding: 5px;
  }
}

.bank-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .bank-card-item {
    width: calc(50% - 10px);
    max-width: 315px;
    background: $lightblue;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 10px;
    position: relative;
    flex-wrap: wrap;
    &.add {
    justify-content: center;
    }

    .card-details {
      display: flex;
      gap: 16px;
      margin-left: 16px;
      margin-top: 12px;
      margin-right: 16px;
      align-items: flex-start;

      .card-bank-icon {
        img {
          display: block;
          width: 40px;
        }
      }

      .card-name {
        .card-bank-name {
          font-weight: 600;
          font-size: .8rem;
          &.txt-blue {
            color: $font-blue;
          }
        }

        .card-bank-type {
          font-size: 14px;
          color: $font-0;
        }
      }
    }

    .card-num {
      display: flex;
      // justify-content: center;
      margin-right: auto;
      margin-left: 16px;
      width: 100%;
      color: $font-0;
      font-size: 14px;
      padding-bottom: 8px;
    }

    &.USDT {
      background-image: url("../../assets/images/finance/download.png");
    }

    &.active {
      // filter: none;
      .unlink-btn {
        display: block;
      }

      .txt-center {
        position: relative;
        padding-top: 0;
        transform: rotateZ(0);
        height: unset;
      }
    }

    .lock-card-txt {
      margin-left: 5px;
      color: $font-0;
      cursor: pointer;
    }

    .cards {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      justify-content: center;
      width: 100%;
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
      right: 10px;
    }

    svg {
      fill: $font-2;
      width: 20px;
    }

    .card-num-box {
      // padding: 40px 0 0;
    }

    // &:before {
    //   position: absolute;
    //   top: 0;
    //   left: -85%;
    //   z-index: 0;
    //   display: block;
    //   content: "";
    //   width: 50%;
    //   height: 100%;
    //   background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
    //   border-radius: 10px;
    //   transform: skewX(320deg);
    // }

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
  justify-content: flex-start;
  align-items: flex-end;
  gap: 20px;
  margin: 20px 0;
}

.searchbar .ant-form {
  display: flex;
  justify-content: space-between;

  .ant-form-item {
    margin-right: 0;
  }
}

.account-title {
  color: $font-2;
  font-weight: bold;
  font-size: 16px;
}

.account-content {
  padding-bottom: 30px;
}
</style>

<style lang="scss">
.el-overlay {
  z-index: 2500 !important;
}
</style>
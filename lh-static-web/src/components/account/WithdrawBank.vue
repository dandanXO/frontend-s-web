<template>
  <div>
    <div class="account-title-container">
      <span class="account-title">提款银行卡</span>
    </div>
    <div class="account-content">
      <div class="account-tip-text wbot"></div>

      <div class="flex-wrap flex-box bank-card-list">
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
              <div class="card-bank-type">{{ checkType(bc.bankType, bc.bankCode) }}</div>
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
            <img width="24" height="24" class="fill-424f72" src="../../assets/home/link-unlink.svg" />
          </div>
        </div>
        <div class="bank-card-item" @click="bankCardModal('bank')">
          <img width="24" height="24" class="fill-424f72" src="../../assets/home/links-line.svg" />
          <span class="lock-card-txt">
            添加银行卡
            <template v-if="alipayAvailable">/ 支付宝</template>
            &nbsp;/ 电子钱包 / 虚拟币
          </span>
        </div>
      </div>
    </div>
    <div class="account-title-container bindunbind">
      <span class="account-title">解绑银行卡记录</span>
    </div>
    <div class="account-content last bindunbind">
      <div class="searchbar">
        <el-form layout="inline" :model="searchForm">
          <div class="left">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="searchForm.startDate"
                show-time
                type="date"
                placeholder="开始日期"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="searchForm.endDate"
                show-time
                type="date"
                placeholder="结束日期"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <button class="standard-button btn-color-blue" type="button" @click="searchRecord()">搜索</button>
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

        <el-table :data="dataSource" style="width: 100%" empty-text="暂无数据" v-loading="tblLoading">
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
    <el-dialog class="bankModal" width="600" v-model="bankCardModalState.visible" :footer="null" title="绑定银行卡">
      <el-form ref="bankCardFormRef" :model="bankCardInfo" :rules="bankCardRules">
        <el-form-item prop="bankId" :rules="[{ required: true, message: '请选择银行', trigger: 'blur' }]">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select placeholder="类型" v-model="selectedBankType" style="width: 100%" @change="selectBankType">
                <el-option v-for="bank in bankTypes" :key="bank.value" :value="bank.value" :label="bank.text">
                  {{ bank.text }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-select
                class="select"
                v-model="bankCardInfo.bankId"
                :placeholder="'选择' + chooseCard()"
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
          <el-input v-model="bankCardInfo.cardNumber" :placeholder="numAddress()" :type="isSZPAY ? 'number' : ''" />
        </el-form-item>
        <el-form-item prop="cardAddress" name="cardAddress" v-if="!isUSDT && !isEWALLET && !isALIPAY">
          <el-input
            v-model="bankCardInfo.cardAddress"
            placeholder="开户行地址"
            :rules="[{ required: true, message: '请输入开户行地址', trigger: 'blur' }]"
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

        <el-form-item name="smsCode" prop="smsCode">
          <el-space>
            <el-input
              class="half"
              :readonly="!isSendOtp"
              v-model="bankCardInfo.smsCode"
              placeholder="输入短信验证码"
              @keyup.enter="submitBankCard"
              style="width: 100%; min-height: 30px; font-size: 12px"
              :class="`blue-bg ${loginCountdown !== 0 ? 'disabled' : ''}`"
            />
            <el-button :disabled="loginCountdown !== 0" class="common-btn" @click="openCaptchaForm()">
              {{ loginCountdown === 0 ? "获取验证码" : `已发送（倒数${loginCountdown}秒）` }}
            </el-button>
          </el-space>
        </el-form-item>

        <el-form-item class="txt-center" v-if="isSendOtp">
          <el-button class="txt-center common-btn" @click="submitBankCard">提交</el-button>
        </el-form-item>
        <span v-if="isEWALLET" class="tip-text">
          *特别说明：请在App钱包完成实名验证，确保钱包绑定和游戏注册姓名一致！
        </span>
      </el-form>
    </el-dialog>
    <el-dialog v-model="phoneCaptchaDialogVisible" title="验证码" width="50%" align-center style="max-width: 500px">
      <el-button size="large" color="#3bafda" class="common-btn" style="width: 100%" @click="sendOtp">提交</el-button>
    </el-dialog>

    <el-dialog
      v-model="captchaDialogVisible"
      title="验证码"
      width="50%"
      align-center
      style="max-width: 500px"
      :close-on-click-modal="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="100" label-suffix=":">
        <el-form-item
          tabindex="3"
          label="验证码"
          prop="captchaCode"
          :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
        >
          <el-row :gutter="10" style="justify-content: center; align-items: center">
            <el-col :span="12">
              <el-input v-model="captchaForm.captchaCode" label="验证码" placeholder="验证码" @keyup.enter="sendOtp" />
            </el-col>
            <el-col :span="12">
              <img style="width: 50%; margin-top: 6px" :src="verificationImg" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button size="large" color="#3bafda" class="common-btn" style="margin-left: 100px" @click="sendOtp">
          发送
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, watch, computed } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { ElMessageBox } from "element-plus";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import {
  loadBanks,
  loadAllBankCards,
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
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "@/hooks/notify";

export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InfoFilled
  },
  setup() {
    const notify = useNotify();
    let validateEmptyCardNo = async (r, v) => {
      if (selectedBankType.value === "Bank") {
        if (v === "") {
          return Promise.reject("请输入银卡号");
        } else if (/^\d+$/.test(v) === false) {
          return Promise.reject("银行卡号只能包含数字");
        } else {
          return Promise.resolve();
        }
      } else if (selectedBankType.value === "Crypto") {
        if (v === "") {
          return Promise.reject("请输入虚拟钱包账号");
        } else if (/^[A-Za-z0-9]*$/.test(v) === false) {
          return Promise.reject("虚拟钱包账号只能包含数字及英文字母");
        } else {
          return Promise.resolve();
        }
      }
      return Promise.resolve();
    };
    let validateBankLength = async (r, v) => {
      var min = 6;
      var max = 12;
      if (selectedBankType.value === "alipay") {
        min = 11;
        max = 25;
      } else if (selectedBankType.value === "Bank") {
        min = 16;
        max = 19;
        if (!/^\d+$/.test(v)) {
          return Promise.reject("请输入数字");
        }
      } else if (selectedBankType.value === "Crypto") {
        min = 34;
        max = 36;
      } else if (selectedBankType.value === "e-Wallet") {
        min = 34;
        max = 34;
        var selectedCode = null;
        banksList.value.forEach((bank) => {
          if (bank.id === bankCardInfo.bankId) {
            selectedCode = bank.code;
          }
        });
        if (selectedCode === "KDPAY") {
          min = 34;
          max = 34;
        } else if (selectedCode === "EBPAY") {
          min = 34;
          max = 34;
        } else if (selectedCode === "OKPAY") {
          min = 16;
          max = 16;
        } else if (selectedCode === "JDOAY") {
          min = 34;
          max = 34;
        } else if (selectedCode === "BLBPAY") {
          min = 33;
          max = 33;
        } else if (selectedCode === "SZPAY") {
          min = 11;
          max = 11;
        }
      }
      if (v === "") {
        if (selectedCode === "SZPAY") {
          return Promise.reject("请输入数字人民币使用的手机号");
        } else {
          return Promise.reject("请输入卡号");
        }
      } else if (v.length < min || v.length > max) {
        if (min === max) {
          return Promise.reject("长度应为 " + min);
        } else {
          return Promise.reject("长度应为 " + min + "-" + max);
        }
      } else {
        return Promise.resolve();
      }
    };
    const checkType = (type, code) => {
      if (type === "BANK") {
        if (code === "alipay") {
          return "支付宝";
        }
        return "银行卡";
      } else if (type === "CRYPTO") {
        return "数字货币";
      } else if (type === "EWALLET") {
        return "电子钱包";
      }
    };
    const tblLoading = ref(false);
    const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/payment/";
    const isCardActive = ref();
    const isUSDT = ref(false);
    const isEWALLET = ref(false);
    const isALIPAY = ref(false);
    const store = userStore();
    const isSZPAY = ref(false);
    const searchForm = reactive({
      startDate: "",
      endDate: "",
      size: 10
    });
    const router = useRouter();
    const columns = [
      {
        title: "银行",
        dataIndex: "bankName",
        key: "bankName"
      },
      {
        title: "银行卡号",
        dataIndex: "cardNumber",
        key: "cardNumber"
      },
      {
        title: "开户行",
        dataIndex: "cardAddress",
        key: "cardAddress"
      },
      {
        title: "绑定时间",
        key: "bindTime",
        dataIndex: "bindTime"
      },
      {
        title: "解绑时间",
        key: "unbindTime",
        dataIndex: "unbindTime"
      }
    ];
    const maskCardNumber = (cardNumber) => {
      const maskedDigits = cardNumber.slice(0, -4).replace(/[a-zA-Z0-9]/g, "*");
      const lastFourDigits = cardNumber.slice(-4);
      return maskedDigits + lastFourDigits;
    };
    const pagination = ref([
      {
        currentPage: 1,
        totalPage: 1,
        pageSize: 5,
        pageCount: 1
      }
    ]);
    const bankTypes = computed(() => [
      { value: "Bank", text: "银行卡" },
      ...(alipayAvailable.value ? [{ value: "alipay", text: "支付宝" }] : []),
      { value: "Crypto", text: "数字货币" },
      { value: "e-Wallet", text: "电子钱包" }
    ]);
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    const dataSource = ref();
    const searchRecord = () => {
      if (!searchForm.startDate || !searchForm.endDate) {
        notify({
          message: "请选择日期",
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
          notify({
            type: "error",
            message: res.message
          });
          tblLoading.value = false;
        }
      });
    };

    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: oldDate.getMonth() + 1 < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : oldDate.getMonth() + 1 + "-",
        D: oldDate.getDate() < 10 ? "0" + (oldDate.getDate() + "") : oldDate.getDate() + ""
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
          notify({
            type: "error",
            message: response.message
          });
        }
      });
      loadMemberTelephone().then((response) => {
        if (response.code === 0) {
          bankCardInfo.telephone = response.data;
        } else {
          notify({
            type: "error",
            message: response.message
          });
        }
      });
    };

    const checkBankCards = () => {
      ElMessageBox.alert("请先绑定银行卡", "系统提示", {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: "确认",
        draggable: false,
        buttonSize: "small",
        closeOnClickModal: false,
        center: true
      })
        .then(() => {
          router.push("/center/personal");
        })
        .catch(() => {});
    };

    onMounted(() => {
      getTime();
      loadCards();
      loadInfo();
      setNewBankTypes();
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
      loadAllBankCards().then((response) => {
        if (response.code === 0) {
          personalState.bankCardList.push(...response.data);
        } else {
          notify({
            type: "error",
            message: response.message
          });
        }
      });
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
      smsCodeId: "",
      currencyId: ""
    });
    const bankName = ref();
    const banksList = ref([]);
    const bankCardModal = () => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "") {
          notify({ type: "error", message: "真实姓名不可为空" });
          return;
        } else if (!store.phone || store.phone == "") {
          notify({ type: "error", message: "绑定银行卡前，请先验证手机号。" });
          return;
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          bankCardInfo.currencyId = "";
          // bankCardInfo.telephone = "";
          bankCardInfo.smsCode = "";
          bankCardInfo.smsCodeId = "";
          bankCardModalState.visible = true;
          if (bankCardModalState.banks.length === 0) {
            loadBanks()
              .then((res) => {
                if (res.code === 0) {
                  bankCardModalState.banks.push(...res.data);
                  selectBankType();
                } else {
                  notify({
                    type: "error",
                    message: res.message
                  });
                }
              })
              .catch((e) => {
                console.log("error", e);
              });
          }
        }
      });
    };

    const alipayAvailable = ref(false);
    const setNewBankTypes = () => {
      if (bankCardModalState.banks.length === 0) {
        loadBanks()
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
      }
    };

    const selectedBankType = ref("Bank");
    const selectBankType = () => {
      banksList.value = [];
      bankCardInfo.bankId = null;
      bankCardModalState.banks.forEach((element) => {
        if (selectedBankType.value === "Bank") {
          isUSDT.value = false;
          isEWALLET.value = false;
          isALIPAY.value = false;
          console.log(element)
          if (element.bankType === "BANK" && element.code !== 'alipay') {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "alipay") {
          isUSDT.value = false;
          isEWALLET.value = false;
          isALIPAY.value = true;
          if (element.bankType === "BANK" && element.code === 'alipay') {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "Crypto") {
          isUSDT.value = true;
          isEWALLET.value = false;
          isALIPAY.value = false;
          if (element.bankType === "CRYPTO") {
            banksList.value.push(element);
          }
        }
        if (selectedBankType.value === "e-Wallet") {
          isEWALLET.value = true;
          isUSDT.value = false;
          isALIPAY.value = false;
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
      const smsDetail = {
        // telephone: bankCardInfo.telephone,
        captchaCode: captchaForm.captchaCode,
        codeId: captchaForm.codeId
      };
      sendSessionSms(smsDetail).then((response) => {
        if (response.code == 0) {
          isSendOtp.value = true;
          initCountdownTimer();
          captchaForm.smsCodeId = response.data.codeId;
          bankCardInfo.smsCodeId = response.data.codeId;

          notify({
            type: "success",
            message: `发送手机验证码成功`
          });
          captchaDialogVisible.value = false;
        } else {
          notify({
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
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const getCode = () => {
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          captchaForm.codeId = res.data.id;
        } else {
          notify({
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
    const gotoNewplayerPromo = () => {
      if (useLocalStorage("need-go-back-newplayer").value === "true") {
        ElMessageBox.confirm("綁定完成，是否跳转优惠页面？", "系统提示", {
          showClose: "false",
          cancelButtonClass: "cancel-btn",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          draggable: true,
          buttonSize: "default"
        })
          .then(() => {
            router.push("/promotion?name=lh1-newplayer-guide");
          })
          .catch(() => {});
      }
    };
    const submitBankCard = () => {
      console.log(bankCardInfo);
      bankCardFormRef.value
        .validate()
        .then(() => {
          addBankCard(bankCardInfo)
            .then((response) => {
              if (response.code === 0) {
                notify({
                  message: "成功",
                  type: "success"
                });
                bankCardModalState.visible = false;
                loadCards();
                gotoNewplayerPromo();
              } else {
                notify({
                  type: "error",
                  message: response.message
                });
              }
            })
            .catch((error) => {
              console.log(error.message);
              // message.error(error.message, 4);
            });
        })
        .catch((error) => {
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
          message: "请输入开户行地址",
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
          validator: "请输入验证码",
          trigger: "blur"
        }
      ]
    };
    const unbindBankCard = (card) => {
      ElMessageBox.prompt(
        `请输入解绑${getOptionLabel(card.bankName)}的${card.bankType === "CRYPTO" || card.bankType === "EWALLET" ? "钱包地址" : "卡号"}`,
        "确认解绑",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "cancel-btn",
          type: "warning" // Error message to display if input is invalid
        }
      )
        .then((inputValue) => {
          deleteBankCardByNumber(inputValue.value)
            .then((res) => {
              if (res.code === 0) {
                notify({
                  type: "success",
                  message: "解绑完成"
                });
                // loadCards();
                searchRecord();
                for (let i = 0; i < personalState.bankCardList.length; i++) {
                  if (personalState.bankCardList[i].id === card.id) {
                    personalState.bankCardList.splice(i, 1);
                  }
                }
              } else {
                notify({
                  type: "error",
                  message: res.message
                });
              }
            })
            .catch((e) => {
              console.log("error", e);
            });
        })
        .catch(() => {
          notify({
            type: "info",
            message: "删除取消"
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

    const checkAliType = (itemId) => {
      isALIPAY.value = false;
      // console.log(itemId)
      banksList.value.forEach((bank) => {
        if (bank.id === itemId) {
          if (bank.code === "alipay") {
            isALIPAY.value = true;
          }
        }
      });
    }

    const chooseCard = () => {
      if (isUSDT.value) {
        return "虚拟币";
      } else if (isEWALLET.value) {
        return "电子钱包";
      } else if (isALIPAY.value) {
        return "支付宝"
      } else {
        return "银行";
      }
    };

    const numAddress = () => {
      if (isUSDT.value) {
        return "钱包地址";
      } else if (isEWALLET.value && !isSZPAY.value) {
        return "电子钱包";
      } else if (isEWALLET.value && isSZPAY.value) {
        return "数字人民币使用的手机号";
      } else if (isALIPAY.value) {
        return "支付宝账号";
      } else {
        return "银行卡号";
      }
    };
    const loginCountdown = ref(0);
    const initCountdownTimer = () => {
      loginCountdown.value = 60;
      countdownTimer();
    };

    const countdownTimer = () => {
      if (loginCountdown.value > 0) {
        setTimeout(() => {
          loginCountdown.value -= 1;
          countdownTimer();
        }, 1000);
      }
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
      checkAliType,
      numAddress,
      checkType,
      isSZPAY,
      loginCountdown,
      initCountdownTimer,
      countdownTimer,
      alipayAvailable,
      setNewBankTypes
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
  gap: 15px;

  .bank-card-item {
    width: calc(50% - 10px);
    max-width: 315px;
    background: $lightblue;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    flex-wrap: wrap;

    .card-details {
      display: flex;
      gap: 16px;
      margin-right: auto;
      margin-left: 16px;
      margin-top: 12px;

      .card-bank-icon {
        img {
          display: block;
          width: 40px;
        }
      }

      .card-name {
        .card-bank-name {
          font-weight: 600;
          font-size: 1rem;

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
  align-items: center;
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

.dark {
  .account-title {
    color: $color-white;
  }

  .bank-card-list {
    .bank-card-item {
      background-color: $background-content-block-lighter-dark;

      .card-bank-name {
        color: $color-white;
      }
    }
  }
}

.tip-text {
  display: block;
  width: 100%;
  color: #ff7f10;
}
</style>

<style lang="scss">
.el-overlay {
  z-index: 2500 !important;
}
</style>

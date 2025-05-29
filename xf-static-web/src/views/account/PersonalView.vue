<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">推荐链接</span>
    </div>
    <div class="personal-container top">
      <input class="referral-link" @blur="blurCode" ref="copyinput" v-model="referralLink" readonly />
      <button class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
        {{ copybtntxt }}
      </button>
    </div>
    <div class="menu-title-container">
      <span class="menu-title">个人资料</span>
    </div>
    <div class="personal-container">
      <el-form ref="updateFormRef" :model="updateFormDetails">
        <div class="personal-wrapper">
          <div class="basic-info">
            <div class="basic-info-table">
              <div class="tbl-row">
                <div class="basic-info-cell title">昵称</div>
                <div v-if="personalState.memberInfo.loginName" class="basic-info-cell content">
                  {{ personalState.memberInfo.loginName }}
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">姓名</div>
                <div v-if="personalState.memberInfo.realName" class="basic-info-cell content">
                  {{ personalState.memberInfo.realName }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="realName"
                      prop="realName"
                      :rules="[
                        { required: true, message: '请输入姓名' },
                        {
                          pattern: '^([\u4e00-\u9fa5·]*)$',
                          message: '请输入中文字符',
                          trigger: 'change'
                        }
                      ]"
                    >
                      <el-input v-model="updateFormDetails.realName" placeholder="姓名" />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">生日</div>

                <el-button
                  class="common-btn"
                  v-if="!isEdit && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)"
                  @click="isEdit = !isEdit"
                >
                  编辑
                </el-button>

                <div v-if="personalState.memberInfo.birthday" class="basic-info-cell content">
                  {{ personalState.memberInfo.birthday }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item name="birthday" prop="birthday" :rules="[{ required: true, message: '请输入生日' }]">
                      <el-date-picker
                        style="max-width: 190px"
                        v-model="updateFormDetails.birthday"
                        value-format="YYYY-MM-DD"
                        placeholder="生日"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">电话</div>
                <div v-if="personalState.memberInfo.telephone" class="basic-info-cell content">
                  {{ personalState.memberInfo.telephone }}
                </div>

                <div v-else class="basic-info-cell content">
                  <!-- <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="phone"
                      prop="phone"
                      :rules="[
                        { required: true, message: '请输入电话' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.phone"
                        placeholder="电话"
                      />
                    </el-form-item>
                  </div> -->
                  <el-button
                    class="common-btn"
                    v-if="!personalState.memberInfo.phoneVerified"
                    type="button"
                    @click="updatePhoneModal"
                  >
                    验证
                  </el-button>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">邮箱</div>
                <div v-if="personalState.memberInfo.email" class="basic-info-cell content">
                  {{ personalState.memberInfo.email }}
                </div>
                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <!--                    <el-form-item-->
                    <!--                      name="email"-->
                    <!--                      prop="email"-->
                    <!--                      :rules="[-->
                    <!--                        { required: true, message: '请输入邮箱' },-->
                    <!--                        { type: 'email', message: '邮箱信息错误' }-->
                    <!--                      ]"-->
                    <!--                    >-->
                    <!--                      <el-input v-model="updateFormDetails.email" placeholder="邮箱" />-->
                    <!--                    </el-form-item>-->
                  </div>
                  <el-button
                    class="common-btn"
                    v-if="!personalState.memberInfo.emailVerified"
                    type="button"
                    @click="updateSecurityModal"
                  >
                    验证
                  </el-button>
                </div>
              </div>

              <el-button
                style="margin-top: 10px"
                :loading="loadingBtn"
                class="common-btn"
                v-if="isEdit"
                @click="updateState"
              >
                提交
              </el-button>

              <el-button
                class="common-btn"
                v-if="!isEdit && (!personalState.memberInfo.realName || !personalState.memberInfo.birthday)"
                @click="isEdit = !isEdit"
              >
                编辑
              </el-button>
            </div>
          </div>
          <div class="buttons">
            <el-button size="large" class="common-btn light" @click="updatePwdModal">修改密码</el-button>
          </div>
        </div>
        <div class="account-tip-text red">
          <el-icon>
            <InfoFilled style="font-size: 15px; line-height: 20px" />
          </el-icon>
          <div class="link">
            如果您需要修改个人资料，请您联系我们的
            <a @click.stop.prevent="store.openLiveChat()">在线客服</a>
          </div>
        </div>
      </el-form>
    </div>

    <el-dialog v-model="updatePwdModalVisible" :footer="null" width="500px" title="修改密码" align-center>
      <el-form ref="updatePwdFormRef" :hideRequiredMark="true" :model="updatePwdInfo" :rules="updatePwdRules">
        <el-form-item ref="oldPassword" name="oldPassword" prop="oldPassword">
          <el-input type="password" v-model="updatePwdInfo.oldPassword" :placeholder="'旧密码'" />
        </el-form-item>
        <el-form-item ref="password" name="password" prop="password">
          <el-input type="password" v-model="updatePwdInfo.password" :placeholder="'新密码'" />
        </el-form-item>
        <el-form-item class="txt-center">
          <el-button class="txt-center submit-btn common-btn" type="submit" @click="submitUpdatePwd">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="updateSecurityModalVisible"
      :footer="null"
      width="500px"
      title="安全验证"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="updateSecurityFormRef"
        :hideRequiredMark="true"
        :model="updateSecurityVerified"
        :rules="updateSecurityVerifiedRules"
      >
        <el-form-item ref="emailAddress" prop="emailAddress">
          <el-input v-model="updateSecurityVerified.emailAddress" placeholder="邮箱" />
        </el-form-item>
        <el-form-item class="half" ref="verificationCode" prop="verificationCode">
          <el-space>
            <el-input
              v-model="updateSecurityVerified.verificationCode"
              :placeholder="'验证码'"
              @keyup.enter="submitUpdateSecurity"
            />
            <el-button
              :disabled="disableSendVerificationButton"
              class="common-btn verification-btn"
              @click="openVerificationModal"
            >
              <span v-if="disableSendVerificationButton">已发送（倒数{{ countDown }}秒)</span>
              <span v-else>发送验证码</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingSecurityBtn" class="common-btn verification-btn" @click="submitUpdateSecurity">
          提交
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="verificationModalVisible"
      title="验证码"
      width="500px"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaUpdateRef" :model="updateSecurityVerified" @submit.prevent>
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <el-space>
            <el-input
              v-model="updateSecurityVerified.captchaCode"
              :maxlength="4"
              placeholder="验证码"
              @keyup.enter="verifyVerificationCode"
            />

            <div class="verification" @click="getCode()">
              <img :src="verificationImg" />
            </div>
          </el-space>
        </el-form-item>
      </el-form>
      <el-button class="common-btn" @click="verifyVerificationCode" :loading="isEmailSending">验证</el-button>
    </el-dialog>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="updatePhoneModalVisible"
      :footer="null"
      width="500px"
      title="手机验证"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="updatePhoneFormRef"
        :hideRequiredMark="true"
        :model="updatePhoneVerified"
        :rules="updatePhoneVerifiedRules"
      >
        <el-form-item ref="phone" prop="phone">
          <el-input autocomplete="off" v-model="updatePhoneVerified.phone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item class="half" ref="verificationCode" prop="verificationCode">
          <el-space>
            <el-input
              autocomplete="off"
              type="password"
              v-model="updatePhoneVerified.verificationCode"
              :placeholder="'验证码'"
            />
            <el-button
              :disabled="disableSendPhoneButton"
              class="common-btn verification-btn"
              @click="openPhoneVerificationModal"
            >
              <span v-if="disableSendPhoneButton">已发送（倒数{{ countDown }}秒)</span>
              <span v-else>发送验证码</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingPhoneBtn" class="common-btn verification-btn" @click="submitUpdatePhone">
          提交
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      wrap-class-name="phoneModal"
      v-model="verificationPhoneModalVisible"
      title="验证码"
      width="500px"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="captchaUpdateRef" :model="updatePhoneVerified" @submit.prevent>
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <el-space>
            <el-input
              @keypress.enter="verifyPhoneVerificationCode"
              v-model="updatePhoneVerified.captchaCode"
              :maxlength="4"
              placeholder="验证码"
            />

            <div class="verification" @click="getCode()">
              <img :src="verificationImg" />
            </div>
          </el-space>
        </el-form-item>
      </el-form>
      <el-button class="common-btn" @click="verifyPhoneVerificationCode" :loading="isPhoneSending">验证</el-button>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue"
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";
import {
  loadMemberInfo,
  changePwd,
  updateAccount,
  sendEmail,
  verifyEmail,
  sendSms,
  verifySms
} from "@/api/personal/personal";
import { getReferralLink } from "@/api/personal/share"
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from '@/utils/utils'

export default defineComponent({
  name: "PersonalView",
  components: {
    InfoFilled
  },
  setup() {
    // Send Verification Code
    const emailKey = `emailKey`
    const phoneKey = `phoneKey`
    const sendOtpDisabledKey = `sendOtpDisabled`

    const sendOtpDisabledTimeout = 60
    const sendOtpDisabledTimeoutLeft = getTimeout(sendOtpDisabledKey)

    const referralLink = ref('');
    const copybtntxt = ref("复制");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = '已复制'
    };
    const blurCode = () => {
      copybtntxt.value = '复制'
    };

    let cachedEmail = lsGet(emailKey);
    let cachedTelephone = lsGet(phoneKey);
    let initialSendOtpDisabledTimeout = false

    if (sendOtpDisabledTimeoutLeft) {
      initialSendOtpDisabledTimeout = true
    } else {
      lsRemove(sendOtpDisabledKey)
      lsRemove(emailKey)
      lsRemove(phoneKey)

      cachedEmail = '';
      cachedTelephone = '';
    }

    const disableSendVerificationButton = ref(initialSendOtpDisabledTimeout);
    const disableSendPhoneButton = ref(initialSendOtpDisabledTimeout);
    const countDown = ref(sendOtpDisabledTimeoutLeft);

    const loadingBtn = ref(false)
    const loadingPwBtn = ref(false)
    const loadingSecurityBtn = ref(false)
    const loadingPhoneBtn = ref(false)
    const isEmailSending = ref(false)
    const isPhoneSending = ref(false)
    const verificationDetails = reactive({
      memberInfo: {}
    });
    const verificationPhoneDetails = reactive({
      memberInfo: {}
    });
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });

    const getReferral = () => {
      getReferralLink().then((res) => {
        if(res.code === 0) {
          referralLink.value = `https://www.xf8578.com/refer/${res.data}`;
          // evip
        }
      }).catch((err) => {
        console.log(err)
      })
    };

    onMounted(() => {
      loadInfo();
      getCode();
      getReferral();
    });
      const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      window.open(pageURL, pageTitle,
                    'resizable=yes, width=' + popupWinWidth
                    + ', height=' + popupWinHeight + ', top='
                    + top + ', left=' + left);
    }
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const getCode = () => {
      updateSecurityVerified.captchaCode = ''
      updatePhoneVerified.captchaCode = ''
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          updateSecurityVerified.codeId = res.data.id;
          updatePhoneVerified.codeId = res.data.id;
        }
      }).catch(() => {
          // console.log(e.message);
        // message.error(e.message);
      });
    };
    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const captchaUpdateRef = ref();
    const updateSecurityVerified = reactive({
      mobileNumber: "",
      verificationCode: ""
    });
    const updatePhoneVerified = reactive({
      verificationCode: "",
      phone: "",
    });
    const verificationImg = ref("");
    const loadInfo = () => {
      loadMemberInfo().then((response) => {
        if (response.code === 0) {
          personalState.memberInfo = response.data;

          if (personalState.memberInfo.birthday) {
            personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
          }
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }
    const isSendEmailOTP = ref(false)
    const verificationModalVisible = ref(false)
    const updateSecurityModal = () => {
      updateSecurityVerified.emailAddress = cachedEmail;
      updateSecurityVerified.verificationCode = "";
      updateSecurityModalVisible.value = true;
    };
    const openVerificationModal = () => {

      updateSecurityFormRef.value.validateField('emailAddress').then((resp) => {
          // captchaForm.captchaCode = "";
          getCode();
          verificationModalVisible.value = true;
          isSendEmailOTP.value = true;
        }).catch((err) => {
            ElMessage({
              message: '请输入有效的邮件',
              type: 'error',
            })
        })
    }
    const verifyVerificationCode = () => {
      captchaUpdateRef.value
        .validate()
        .then(() => {
      isEmailSending.value = true
      verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress
      const emailDetails =  {
        email: updateSecurityVerified.emailAddress,
        captchaCode: updateSecurityVerified.captchaCode,
        codeId: updateSecurityVerified.codeId
      }
      sendEmail(emailDetails).then((res) => {
        if ( res.code === 0) {
          verificationDetails.memberInfo.codeId = res.data.codeId
          verificationModalVisible.value = false;
          // message.success("Success")

          ElMessage({
            message: '成功',
            type: 'success',
          })
          isEmailSending.value = false
        }
     }).catch((e) => {
          console.log(e.message);
        // message.error(e.message);
        getCode()
        isEmailSending.value = false
      });
    });
    }
    const submitUpdateSecurity = () => {
      loadingSecurityBtn.value = true
      updateSecurityFormRef.value
        .validate()
        .then(() => {
          verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode
          verifyEmail(verificationDetails.memberInfo).then((res) => {
            if (res.code === 0) {

              ElMessage({
                message: '成功',
                type: 'success',
              })

              updateSecurityModalVisible.value = false

              loadInfo()

            }
          }).catch((e) => {
            console.log(e.message);
            // message.error(e.message);
          });
        }).catch((error) => {
        console.log("error", error);
      });
      loadingSecurityBtn.value = false
    };
// Phone

const verificationPhoneModalVisible = ref(false)
    const openPhoneVerificationModal = () => {
      getCode();
      verificationPhoneModalVisible.value = true;
    }
    const updatePhoneModalVisible = ref(false)
    const updatePhoneFormRef = ref();
    const updatePhoneModal = () => {
      updatePhoneVerified.phone = cachedTelephone;
      updatePhoneVerified.phoneCode = "";
      updatePhoneModalVisible.value = true;
    };
    const verifyPhoneVerificationCode = () => {
      captchaUpdateRef.value
        .validate()
        .then(() => {

      isPhoneSending.value = true
      verificationPhoneDetails.memberInfo.phone = updatePhoneVerified.phone

      const phoneDetails =  {
        telephone: updatePhoneVerified.phone,
        captchaCode: updatePhoneVerified.captchaCode,
        codeId: updatePhoneVerified.codeId
      }

      sendSms(phoneDetails).then((res) => {
        if (res.code === 0) {

          disableSendPhoneButton.value = true

          const now = new Date();

          now.setSeconds(now.getSeconds() + sendOtpDisabledTimeout)

          lsStore(sendOtpDisabledKey, now.getTime());
          lsStore(phoneKey, verificationPhoneDetails.memberInfo.phone)

          countDown.value = sendOtpDisabledTimeout
          countdownTimer()

          verificationPhoneDetails.memberInfo.codeId = res.data.codeId
          verificationPhoneModalVisible.value = false;

          ElMessage({
            message: '成功',
            type: 'success',
          })

          isPhoneSending.value = false
        }
     }).catch((e) => {
          console.log(e.message);
        // message.error(e.message);
        getCode()
        isPhoneSending.value = false
      });

    })
    }
    const submitUpdatePhone = () => {
      loadingPhoneBtn.value = true
      updatePhoneFormRef.value
        .validate()
        .then(() => {
          verificationPhoneDetails.memberInfo.code = updatePhoneVerified.verificationCode
          verifySms(verificationPhoneDetails.memberInfo).then((res) => {
            if (res.code === 0) {
              ElMessage({
                message: '成功',
                type: 'success',
              })
              updatePhoneModalVisible.value = false
              store.getMemberInfo()
              loadInfo()
            }
          }).catch((e) => {
            console.log(e.message);
            // message.error(e.message);
          });
        }).catch((error) => {
        console.log("error", error);
      });


      loadingPhoneBtn.value = false
    };

    const countdownTimer = () => {
      if (countDown.value > 0) {
        setTimeout(() => {
          countDown.value -= 1
          countdownTimer()
        }, 1000)
      } else {
        lsRemove(sendOtpDisabledKey);
        lsRemove(phoneKey);

        disableSendVerificationButton.value = false
      }
    }

    const updateSecurityVerifiedRules = {
      emailAddress: [
        {
          required: true,
          message: "请输入邮箱地址",
          trigger: "blur",
        },
        {
          type: "email",
          message: "邮箱地址不符合",
          trigger: "blur",
        },
      ],
      verificationCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur",
        },
        {
          min: 4,
          message: "长度应为 4",
          trigger: "blur",
        },
      ],
    };

    const updatePhoneVerifiedRules = {
      phone: [
        {
          required: true,
          message: "请输入电话地址",
          trigger: "blur",
        },
      ],
      verificationCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur",
        },
        {
          min: 4,
          message: "长度应为 4",
          trigger: "blur",
        },
      ],
    };

    //update pwd
    const updatePwdModalVisible = ref(false);
    const updatePwdFormRef = ref();
    const updatePwdInfo = reactive({
      oldPassword: "",
      password: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdModalVisible.value = true;
    };
    const submitUpdatePwd = () => {
      updatePwdFormRef.value
        .validate()
        .then(() => {
          changePwd(updatePwdInfo.oldPassword, updatePwdInfo.password).then((response) => {
            if (response.code === 0) {
              // message.success("success");
              ElMessage({
                message: '成功',
                type: 'success',
              })
              updatePwdModalVisible.value = false;
            } else {
              // message.error(response.message);
            }
          }).catch((error) => {
            console.log(error.message);
            // message.error(error.message, 4)
          });
        }).catch((error) => {
          console.log("error", error);
      });
    };
    const updatePwdRules = {
      oldPassword: [
        {
          required: true,
          message: "请输入旧密码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "长度应为 6 到 12 数字",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "请输入新密码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "长度应为 6 到 12 数字",
          trigger: "blur"
        }
      ]
    };

    const isEdit = ref(false)
    const updateFormDetails = reactive(
      {
      }
    )
    const updateFormRef = ref()
    const updateState = () => {
      updateFormRef.value
        .validate()
        .then(() => {
          updateAccount(toRaw(updateFormDetails)).then((ret) => {
            if (ret.code === 0) {
              ElMessage({
                message: '成功更新',
                type: 'success',
              })
              loadInfo();
              store.getMemberInfo();
              isEdit.value = false
            }
          }).catch((err) => {
            console.log(err.message);
            // message.error(err.message, 4);
          })
        })
      // if (personalState.memberInfo.email) {
      //   updateFormDetails.email = personalState.memberInfo.email
      // }
      // if (personalState.memberInfo.realName) {
      //   updateFormDetails.realName = personalState.memberInfo.realName
      // }
      // if (personalState.memberInfo.telephone) {
      //   updateFormDetails.phone = personalState.memberInfo.telephone
      // }
      // if (personalState.memberInfo.birthday) {
      //   updateFormDetails.birthday = personalState.memberInfo.birthday
      // }
      // if (field === 'email' {
      //   isEditEmail.value = false
      // }
      // if (field === 'name' {
      //   isEditRealName.value = false
      // }
      // if (field === 'phone' {
      //   isEditPhone.value = false
      // }
      // if (field === 'birthday' {
      //   isEditBirthday.value = false
      // }
    }
    return {
      personalState,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      updateSecurityVerifiedRules,
      submitUpdateSecurity,
      updatePhoneFormRef,
      updatePhoneVerified,
      updatePhoneModal,
      updatePhoneModalVisible,
      updatePhoneVerifiedRules,
      verificationPhoneModalVisible,
      submitUpdatePhone,
      updatePwdFormRef,
      updatePwdInfo,
      updatePwdModal,
      updatePwdModalVisible,
      updatePwdRules,
      submitUpdatePwd,
      loadInfo,
      isEdit,
      updateFormDetails,
      updateState,
      getVerificationCode,
      verificationModalVisible,
      openVerificationModal,
      openPhoneVerificationModal,
      verificationImg,
      getCode,
      verifyVerificationCode,
      verifyPhoneVerificationCode,
      isEmailSending,
      isPhoneSending,
      updateFormRef,
      store,
      regDevice,
      openWindow,
      captchaUpdateRef,
      loadingBtn,
      loadingPwBtn,
      loadingSecurityBtn,
      loadingPhoneBtn,
      disableSendVerificationButton,
      disableSendPhoneButton,
      countDown,
      isSendEmailOTP,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink
    };
  }
});
</script>

<style scoped lang="scss">
.personal-container {
  // background-color: #232833;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
  border-radius: 2px;
  display: flex;
  padding: 20px;
  justify-content: space-between;
  margin: 0 auto 50px;
  &.top {
    padding: 0; overflow: hidden; box-shadow: none; border-radius: 8px;
    border-top: 0;
    margin-top: 35px;
  }
  .el-form {
    width: 100%;
  }
  .personal-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 50px;
    .basic-info {
      padding-bottom: 20px;
      flex: 1;
      border-right: 1px solid #aaaaaa;

      .basic-info-table {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        .tbl-row {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          align-items: center;
          .basic-info-cell {
            &.title {
              width: 40px;
            }
            &.content {
              padding: 5px 0;
            }
          }
          .el-form-item {
            margin: 0;
          }
        }
      }
    }
    .buttons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.referral-link {
  width: 100%;
  border: none;
  color: #b8b8b8;
  background: #262627;
  border: 1px solid #3c3c3d;
  padding: 10px 15px;
  color: #B8B8B8;
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
}

.verification {
  img {
    height: 32px;
    display: block;
  }
}
</style>

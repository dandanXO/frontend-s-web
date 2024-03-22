<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title">Personal Information</div>
    </div>
    <el-tabs v-model="selectedTab">
      <el-tab-pane :label="$t('personal.personalInfo')" name="personal">
        <!-- <el-form :inline="true" ref="updateFormRef" :model="updateFormDetails">
          <el-form-item ref="refRealName" :label="$t('personal.realName')" name="realName" prop="realName">
            <el-input style="width:650px;" type="password" v-model="updateFormDetails.realName" :placeholder="$t('placeholder.realName')" clearable show-password />
          </el-form-item>
          <el-form-item ref="refBirthday" :label="$t('personal.birthday')" name="birthday" prop="birthday">
            <el-input style="width:650px;" type="password" v-model="updateFormDetails.birthday" :placeholder="$t('placeholder.birthday')" clearable show-password />
          </el-form-item>
          <el-form-item ref="refEmail" :label="$t('personal.email')" name="email" prop="email">
            <el-input style="width:650px;" type="password" v-model="updateFormDetails.email" :placeholder="$t('placeholder.email')" clearable show-password />
          </el-form-item>
          <el-form-item ref="refMobileNo" :label="$t('personal.mobileNo')" name="mobileNo" prop="mobileNo">
            <el-input style="width:650px;" type="password" v-model="updateFormDetails.mobileNo" :placeholder="$t('placeholder.mobileNo')" clearable show-password />
          </el-form-item>
        </el-form> -->
        
      <el-form ref="updateFormRef" :model="updateFormDetails">
        <div class="personal-wrapper">
          <div class="basic-info">
            <div class="basic-info-table">

              <div class="info-tbl-row">
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">{{ $t('personal.realName') }}</div>
                    <div v-if="personalState.memberInfo.realName" class="basic-info-cell contentwtxt">
                      {{ personalState.memberInfo.realName }}
                    </div>

                    <div v-else class="basic-info-cell content">
                      <div class="datewsend" v-if="isEdit">
                        <el-form-item
                          name="realName"
                          prop="realName"
                          :rules="[
                            { required: true, message: $t('placeholder.realName') }
                          ]"
                        >
                          <el-input v-model="updateFormDetails.realName" placeholder="姓名" />
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-tbl-row">
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">{{ $t('personal.birthday') }}</div>
                    <div v-if="personalState.memberInfo.birthday" class="basic-info-cell contentwtxt">
                      {{ personalState.memberInfo.birthday }}
                    </div>

                    <div v-else class="basic-info-cell content">
                      <div class="datewsend" v-if="isEdit">
                        <el-form-item
                          name="birthday"
                          prop="birthday"
                          :rules="[{ required: true, message: $t('placeholder.birthday') }]"
                        >
                          <el-date-picker
                            style="max-width: 650px; width: 100%;"
                            v-model="updateFormDetails.birthday"
                            value-format="YYYY-MM-DD"
                            :placeholder="$t('personal.birthday')"
                          />
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">{{ $t('personal.mobileNo') }}</div>
                    <div v-if="personalState.memberInfo.telephone" class="basic-info-cell contentwtxt">
                      {{ personalState.memberInfo.telephone }}
                    </div>

                    <div v-else class="basic-info-cell contentwtxt">
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
                      <button
                        class="standard-button btn-color-blue sm-btn"
                        v-if="!personalState.memberInfo.phoneVerified"
                        type="button"
                        @click="updatePhoneModal"
                      >
                       {{ $t('common.verify') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="tbl-row">
                <div class="basic-info-cell title">QQ：</div>
                <div v-if="personalState.memberInfo.email" class="basic-info-cell content">
                  {{ personalState.memberInfo.email }}
                </div>
                <div v-else class="basic-info-cell content">
                  <!- <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="email"
                      prop="email"
                      :rules="[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '邮箱信息错误' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.email"
                        placeholder="邮箱"
                      />
                    </el-form-item>
                  </div> ->
                  <button
                    class="standard-button btn-color-blue sm-btn"
                    v-if="!personalState.memberInfo.emailVerified"
                    type="button"
                    @click="updateSecurityModal"
                  >
                    验证
                  </button>
                </div>
              </div> -->

              <div class="tbl-row">
                <div class="basic-info-cell title">{{$t('personal.email')}}</div>
                <div v-if="personalState.memberInfo.email" class="basic-info-cell contentwtxt">
                  {{ personalState.memberInfo.email }}
                </div>
                <div v-else class="basic-info-cell contentwtxt">
                  <!-- <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="email"
                      prop="email"
                      :rules="[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '邮箱信息错误' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.email"
                        placeholder="邮箱"
                      />
                    </el-form-item>
                  </div> -->
                  <button
                    class="standard-button btn-color-blue sm-btn"
                    v-if="!personalState.memberInfo.emailVerified"
                    type="button"
                    @click="updateSecurityModal"
                  >
                  {{ $t('common.verify') }}
                  </button>
                </div>
              </div>

              <el-button
                style="margin-top: 10px; border-radius: 2em;"
                :loading="loadingBtn"
                class="standard-button btn-color-blue"
                v-if="isEdit"
                @click="updateState"
              >
               {{ $t('common.submit')}}
              </el-button>

              <button
                class="standard-button btn-color-blue"
                v-if="
                  !isEdit &&
                  (
                    !personalState.memberInfo.birthday)
                "
                @click="isEdit = !isEdit"
              >
                {{ $t('common.edit') }}
              </button>
            </div>
          </div>
          <!-- <div class="buttons">
            <el-button size="large" class="common-btn light" @click="updatePwdModal">修改密码</el-button>
          </div> -->
        </div>
      </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('personal.bank')" name="Bank"><WithdrawBank /></el-tab-pane>
      <el-tab-pane :label="$t('personal.chgPwd')" name="chgPwd">
        <div class="update-pwd-container">

            <el-form ref="updatePwdFormRef" :hideRequiredMark="true" :model="updatePwdInfo" :rules="updatePwdRules">
              <el-form-item ref="refOldPassword" label="旧密码" name="oldPassword" prop="oldPassword">
                <el-input style="width:200px;" type="password" v-model="updatePwdInfo.oldPassword" :placeholder="'请输入旧密码'" clearable show-password />
              </el-form-item>

              <el-form-item ref="refPassword" label="新密码" name="password" prop="password">
                <el-input style="width:200px;" type="password" v-model="updatePwdInfo.password" :placeholder="'请输入新密码'" clearable show-password />
              </el-form-item>
              <el-form-item ref="refConfirmPassword" label="确认密码" name="confirmPassword" prop="confirmPassword">
                <el-input style="width:200px;" type="password" v-model="updatePwdInfo.confirmPassword" :placeholder="'请再次输入新密码'" clearable show-password />
              </el-form-item>
              <div class="txt-center btn-container">
                <button
                  :loading="loadingPwBtn"
                  class="standard-button btn-color-white"
                  type="button"
                  @click="clearPwd"
                >
                  {{ $t('personal.clear') }}
                </button>

                <button
                  :loading="loadingPwBtn"
                  class="standard-button btn-color-blue"
                  type="button"
                  @click="submitUpdatePwd"
                >
                  {{ $t('personal.submit') }}
                </button>
              </div>
            </el-form>
          </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('personal.chgWithdrawPwd')" name="chgWithdrawPwd">
        <div class="update-pwd-container">
            <el-form ref="updateWithdrawPwdFormRef" :hideRequiredMark="true" :model="updateWithdrawPwdInfo" :rules="updateWithdrawPwdRules">
              <el-form-item ref="refWithdrawOldPassword" label="旧密码" name="oldPassword" prop="oldPassword">
                <el-input style="width:200px;" type="password" v-model="updateWithdrawPwdInfo.oldPassword" :placeholder="'请输入旧密码'" clearable show-password />
              </el-form-item>

              <el-form-item ref="refWithdrawPassword" label="新密码" name="password" prop="password">
                <el-input style="width:200px;" type="password" v-model="updateWithdrawPwdInfo.password" :placeholder="'请输入新密码'" clearable show-password />
              </el-form-item>
              <el-form-item ref="refWithdrawConfirmPassword" label="确认密码" name="confirmPassword" prop="confirmPassword">
                <el-input style="width:200px;" type="password" v-model="updateWithdrawPwdInfo.confirmPassword" :placeholder="'请再次输入新密码'" clearable show-password />
              </el-form-item>
              <div class="txt-center btn-container">
                <button
                  :loading="loadingWdPwBtn"
                  class="standard-button btn-color-white"
                  type="button"
                  @click="clearWithdrawPwd"
                >
                  {{ $t('personal.clear') }}
                </button>

                <button
                  :loading="loadingWdPwBtn"
                  class="standard-button btn-color-blue"
                  type="button"
                  @click="submitUpdateWithdrawPwd"
                >
                  {{ $t('personal.submit') }}
                </button>
              </div>
            </el-form>
          </div>
      </el-tab-pane>
    </el-tabs>

    <!--    <el-dialog-->
    <!--      v-model="updatePwdModalVisible"-->
    <!--      :footer="null"-->
    <!--      width="500px"-->
    <!--      title="修改密码"-->
    <!--      align-center-->
    <!--      :close-on-click-modal="false"-->
    <!--      :close-on-press-escape="false"-->
    <!--    >-->
    <!--      <el-form ref="updatePwdFormRef" :hideRequiredMark="true" :model="updatePwdInfo" :rules="updatePwdRules">-->
    <!--        <el-form-item ref="oldPassword" name="oldPassword" prop="oldPassword">-->
    <!--          <el-input type="password" v-model="updatePwdInfo.oldPassword" :placeholder="'旧密码'" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item ref="password" name="password" prop="password">-->
    <!--          <el-input type="password" v-model="updatePwdInfo.password" :placeholder="'新密码'" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item class="txt-center">-->
    <!--          <el-button-->
    <!--            :loading="loadingPwBtn"-->
    <!--            class="txt-center submit-btn common-btn"-->
    <!--            type="submit"-->
    <!--            @click="submitUpdatePwd"-->
    <!--          >-->
    <!--            提交-->
    <!--          </el-button>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--    </el-dialog>-->

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
              size="small"
              class="common-btn verification-btn"
              @click="openVerificationModal"
            >
              <span v-if="disableSendVerificationButton">已发送（倒数{{ countDown }}秒)</span>
              <span v-else>{{ $t('common.sendVerificationCode') }}</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingSecurityBtn" class="standard-btn verification-btn" @click="submitUpdateSecurity">
          
          {{ $t('common.submit') }}
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
      <el-form ref="captchaUpdateRef" :model="updateSecurityVerified">
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: t('placeholder.captcha') }]">
          <el-space>
            <el-input
              @keyup.enter="verifyVerificationCode"
              v-model="updateSecurityVerified.captchaCode"
              :maxlength="4"
              :placeholder="$t('placeholder.captcha')"
            />

            <div class="verification" @click="getCode()">
              <img style="width: 80%; margin-top: 6px" :src="verificationImg" />
            </div>
          </el-space>
        </el-form-item>
      </el-form>
      <el-button class="common-btn" @click="verifyVerificationCode" :loading="isEmailSending">{{ $t('common.verify') }}</el-button>
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
          <el-input v-model="updatePhoneVerified.phone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item class="half" ref="verificationCode" prop="verificationCode">
          <el-space>
            <el-input v-model="updatePhoneVerified.verificationCode" :placeholder="'验证码'" />
            <el-button
              :disabled="disableSendPhoneButton"
              size="small"
              class="common-btn verification-btn"
              @click="openPhoneVerificationModal"
            >
              <span v-if="disableSendPhoneButton">{{ $t('common.sendVerificationCode') }}已发送（倒数{{ countDown }}秒)</span>
              <span v-else>{{ $t('common.sendVerificationCode') }}</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingPhoneBtn" class="common-btn verification-btn" @click="submitUpdatePhone">
          {{ $t('common.submit') }}
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
      <el-form ref="captchaUpdateRef" :model="updatePhoneVerified">
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <el-space>
            <el-input
              @keypress.enter.prevent="verifyPhoneVerificationCode"
              v-model="updatePhoneVerified.captchaCode"
              :maxlength="4"
              placeholder="验证码"
            />

            <div class="verification" @click="getCode()">
              <img style="width: 80%; margin-top: 6px" :src="verificationImg" />
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
import { userStore } from "@/store";
import { getDevice } from "@/utils/utils";
import {
  loadMemberInfo,
  changePwd,
  changeWithdrawPwd,
  updateAccount,
  sendEmail,
  verifyEmail,
  sendSms,
  verifySms
} from "@/api/personal/personal";
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from '@/utils/utils'
import WithdrawBank from "@/components/account/WithdrawBank.vue";

export default defineComponent({
  name: "PersonalView",
  components: {
    WithdrawBank
  },
  setup() {
    const selectedTab = 'personal'
    // Send Verification Code
    const emailKey = `emailKey`
    const phoneKey = `phoneKey`
    const sendOtpDisabledKey = `sendOtpDisabled`

    const sendOtpDisabledTimeout = 60
    const sendOtpDisabledTimeoutLeft = getTimeout(sendOtpDisabledKey)

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
    const countDownPhone = ref(sendOtpDisabledTimeoutLeft);

    const loadingBtn = ref(false)
    const loadingPwBtn = ref(false)
    const loadingWdPwBtn = ref(false)
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

    onMounted(() => {

      if(sendOtpDisabledTimeoutLeft)
        countdownTimer();

      loadInfo();
      getCode();
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
        } else {
          ElMessage.error(res.message);
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
      verificationCode: "",
      emailAddress: "",
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
        if (res.code === 0) {

          disableSendVerificationButton.value = true

          const now = new Date();

          now.setSeconds(now.getSeconds() + sendOtpDisabledTimeout)

          lsStore(sendOtpDisabledKey, now.getTime());
          lsStore(emailKey, verificationDetails.memberInfo.email)

          countDown.value = sendOtpDisabledTimeout
          countdownTimer()

          verificationDetails.memberInfo.codeId = res.data.codeId
          verificationModalVisible.value = false;

          ElMessage({
            message: '成功',
            type: 'success',
          })

          isEmailSending.value = false
        } else {
          ElMessage.error(res.message)
          getCode()
          isEmailSending.value = false
        }
     }).catch((e) => {
          console.log(e.message);
        // message.error(e.message);
      });

    })
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

            } else {
              ElMessage.error(res.message)
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
    // const openPhoneVerificationModal = () => {
    //   getCode();
    //   verificationPhoneModalVisible.value = true;
    // }
    const openPhoneVerificationModal = () => {
      updatePhoneFormRef.value.validateField('phone').then((resp) => {
          // captchaForm.captchaCode = "";
          getCode();
          verificationPhoneModalVisible.value = true;

        }).catch((err) => {
            ElMessage({
              message: '请输入有效的电话号码',
              type: 'error',
            })
        })
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
        } else {
            ElMessage.error(res.message)
            getCode()
            isPhoneSending.value = false
          }
     }).catch((e) => {
          console.log(e.message);
        // message.error(e.message);
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
            } else {
              ElMessage.error(res.message)
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
        disableSendPhoneButton.value = false
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
          message: "请输入电话号码",
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
      password: "",
      confirmPassword: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdModalVisible.value = true;
    };

    const refOldPassword= ref();
    const refPassword= ref();
    const clearPwd = () =>{
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password= "";
      updatePwdInfo.confirmPassword= "";
    }
    const submitUpdatePwd = () => {
      // debugger;
      loadingPwBtn.value = true
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
              clearPwd();
            } else {
              ElMessage.error(response.message)
            }
          }).catch((error) => {
            console.log(error.message);
            // message.error(error.message, 4)
          });
        }).catch((error) => {
          console.log("error", error);
      });
      loadingPwBtn.value = false
    };

    const validatePwd = async (r,v) => {
      if(updatePwdInfo.confirmPassword !== updatePwdInfo.password){
        return Promise.reject("确认密码与新密码不符合");
      } else {
        return Promise.resolve();
      }
    }

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
      ],
      confirmPassword: [
        {
          required: true,
          message: "请输入确认密码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "长度应为 6 到 12 数字",
          trigger: "blur"
        },
        {
          required: true,
          validator: validatePwd,
          trigger: "blur"
        }
      ]
    };


    //update withdrawa  pwd
    const updateWithdrawPwdModalVisible = ref(false);
    const updateWithdrawPwdFormRef = ref();
    const updateWithdrawPwdInfo = reactive({
      oldPassword: "",
      password: "",
      confirmPassword: ""
    });
    const updateWithdrawPwdModal = () => {
      updateWithdrawPwdInfo.oldPassword = "";
      updateWithdrawPwdInfo.password = "";
      updateWithdrawPwdModalVisible.value = true;
    };

    const refWithdrawOldPassword= ref();
    const refWithdrawPassword= ref();
    const clearWithdrawPwd = () =>{
      updateWithdrawPwdInfo.oldPassword = "";
      updateWithdrawPwdInfo.password= "";
      updateWithdrawPwdInfo.confirmPassword= "";
    }

    const submitUpdateWithdrawPwd = () => {
      // debugger;
      loadingWdPwBtn.value = true
      updateWithdrawPwdFormRef.value
        .validate()
        .then(() => {
          changeWithdrawPwd(updateWithdrawPwdInfo.oldPassword, updateWithdrawPwdInfo.password).then((response) => {
            if (response.code === 0) {
              // message.success("success");
              ElMessage({
                message: t('common.success'),
                type: 'success',
              })
              clearPwd();
            } else {
              ElMessage.error(response.message)
            }
          }).catch((error) => {
            console.log(error.message);
            // message.error(error.message, 4)
          });
        }).catch((error) => {
          console.log("error", error);
      });
      loadingPwBtn.value = false
    };

    const validateWithdrawPwd = async (r,v) => {
      if(updateWithdrawPwdInfo.confirmPassword !== updateWithdrawPwdInfo.password){
        return Promise.reject("确认密码与新密码不符合");
      } else {
        return Promise.resolve();
      }
    }

    const updateWithdrawPwdRules = {
      oldPassword: [
        {
          required: personalState.memberInfo.registeredWithdrawPassword !== false ? true : false,
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
      ],
      confirmPassword: [
        {
          required: true,
          message: "请输入确认密码",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "长度应为 6 到 12 数字",
          trigger: "blur"
        },
        {
          required: true,
          validator: validateWithdrawPwd,
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
      loadingBtn.value = true
      updateFormRef.value
        .validate()
        .then(() => {
          updateAccount(toRaw(updateFormDetails)).then((ret) => {
            if (ret.code === 0) {
              ElMessage({
                message: '提交成功',
                type: 'success',
              })
              loadInfo();
              isEdit.value = false;
            } else {
              ElMessage.error(ret.message)
            }
          }).catch((err) => {
            console.log(err.message);
          })
        })

      loadingBtn.value = false
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
      clearPwd,
      loadInfo,
      refOldPassword,
      refPassword,
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
      loadingWdPwBtn,
      loadingSecurityBtn,
      loadingPhoneBtn,
      disableSendVerificationButton,
      disableSendPhoneButton,
      countDown,
      countDownPhone,
      selectedTab,
      updateWithdrawPwdFormRef,
      updateWithdrawPwdInfo,
      updateWithdrawPwdModal,
      updateWithdrawPwdModalVisible,
      updateWithdrawPwdRules,
      submitUpdateWithdrawPwd,
      clearWithdrawPwd,
      refWithdrawOldPassword,
      refWithdrawPassword,
    };
  }
});
</script>

<style scoped lang="scss">
.el-form--inline .el-form-item {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 32px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.basic-info-cell {     
  &.content {
    width: 650px;
    .datewsend {
      :deep(.el-input) {
        min-height: 45px;
      }
      :deep(.el-input__inner) {
        &::placeholder {
            font-weight: bold;
          }
      }
      :deep(.el-input__wrapper) {
        
        color: #999999;
            font-weight: bold;
        width: 650px;
        box-shadow: 0px 0px 8px 0px #A9C9EA inset;
        background: #F7F8FB;
        border-radius: 6px;
        margin: 5px 0 20px;
        padding: 10px 20px;
        min-height: 40px;
        }
      }
      
  }
  &.contentwtxt {
    color: #999999;
        font-weight: bold;
    width: 650px;
    box-shadow: 0px 0px 8px 0px #A9C9EA inset;
    background: #F7F8FB;
    border-radius: 6px;
    margin: 5px 0 20px;
    padding: 10px 20px;
    .el-input__inner {  
      &::placeholder {
        font-weight: bold;
      }
    }
  }
  .datewsend {
    .el-date {
      width: 100%;
    }
  }
}
.personal-container {
  border-radius: 3px;
  display: flex;
  // padding: 20px;
  justify-content: space-between;
  margin: 0 auto;
  .el-form {
    width: 100%;
  }
  .personal-wrapper {
    display: flex;
    // justify-content: space-between;
    width: 100%;
    gap: 50px;

    .update-pwd-container {
      :deep(.el-form-item__label) {
        width: 80px;
      }

      :deep(.el-input__wrapper) {
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        border-radius: 20px;
        background: #f7f8fb;
        height: 38px;
      }
    }
    .basic-info {
      padding-bottom: 20px;
      max-width: 500px;
      flex: 1;
      // border-right: 1px solid #aaaaaa;

      .basic-info-table {
        display: flex;
        gap: 25px;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
      }
    }
    .info-tbl-row {
      display: flex;
      gap: 30px;
      width: 100%;
      align-items: center;
      flex-direction: column;

      .info-tbl-col {
        width: calc(50% - 15px);

        .update-pwd-txt {
          font-size: 16px;
          color: $link-active;
        }
      }
    }
    .tbl-row {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
      align-items: center;
      font-size: 16px;
      line-height: 1;
      .basic-info-cell {
        &.title {
          min-width: 50px;
        }

        &.main-title {
          color: $font-1;
        }
        &.content {
          .datewsend {
            width: 140px;
          }
        }

        &.mb-20 {
          margin-bottom: 20px;
        }
      }
      .el-form-item {
        margin: 0;
      }
    }
    .buttons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.btn-container {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 10px;
}
</style>

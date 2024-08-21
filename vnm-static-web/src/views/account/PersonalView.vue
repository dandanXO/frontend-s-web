<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title" style="display: flex; gap: 20px">
        {{ $t("personal.personalInfo") }}
        <span style="font-size: 14px">
          {{ $t("personal.url") }}:
          <a :href="evipWeb" style="color: #468cff">{{ evipWeb }}</a>
        </span>
      </div>
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
                      <div class="basic-info-cell title">{{ $t("personal.realName") }}</div>
                      <div v-if="personalState.memberInfo.realName" class="basic-info-cell contentwtxt">
                        {{ personalState.memberInfo.realName }}
                      </div>

                      <div v-else class="basic-info-cell content">
                        <div class="datewsend" v-if="isEdit">
                          <el-form-item
                            name="realName"
                            prop="realName"
                            :rules="[{ required: true, message: $t('placeholder.realName') }]"
                          >
                            <el-input v-model="updateFormDetails.realName" :placeholder="$t('personal.realName')" />
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="info-tbl-row">
                  <div class="info-tbl-col">
                    <div class="tbl-row">
                      <div class="basic-info-cell title">{{ $t("personal.birthday") }}</div>
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
                              style="max-width: 650px; width: 100%"
                              v-model="updateFormDetails.birthday"
                              value-format="YYYY-MM-DD"
                              :placeholder="$t('personal.birthday')"
                            />
                          </el-form-item>
                        </div>

                        <div class="basic-info-cell contentwtxt" style="min-height: 40px" v-else></div>
                      </div>
                    </div>
                  </div>
                  <div class="info-tbl-col">
                    <div class="tbl-row">
                      <div class="basic-info-cell title">{{ $t("personal.mobileNo") }}</div>
                      <div
                        class="basic-info-cell contentwtxt"
                        style="display: flex; justify-content: space-between; align-items: center"
                      >
                        {{ personalState.memberInfo.telephone }}

                        <button
                          class="standard-button btn-color-blue sm-btn"
                          v-if="!personalState.memberInfo.phoneVerified"
                          type="button"
                          @click="updatePhoneModal"
                        >
                          {{ $t("common.verify") }}
                        </button>
                      </div>

                      <!--                    <div v-else class="basic-info-cell contentwtxt">-->
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

                      <!--                    </div>-->
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
                  <div class="basic-info-cell title">{{ $t("personal.email") }}</div>
                  <div
                    class="basic-info-cell contentwtxt"
                    style="display: flex; justify-content: space-between; align-items: center"
                  >
                    {{ personalState.memberInfo.email }}

                    <button
                      class="standard-button btn-color-blue sm-btn"
                      v-if="!personalState.memberInfo.emailVerified"
                      type="button"
                      @click="updateSecurityModal"
                    >
                      {{ $t("common.verify") }}
                    </button>
                  </div>
                  <!--                <div v-else class="basic-info-cell contentwtxt">-->
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
                  <!--                </div>-->
                </div>

                <el-button
                  style="margin-top: 10px; border-radius: 2em"
                  :loading="loadingBtn"
                  class="standard-button btn-color-blue"
                  v-if="isEdit"
                  @click="updateState"
                >
                  {{ $t("common.submit") }}
                </el-button>

                <button
                  class="standard-button btn-color-blue"
                  v-if="!isEdit && !personalState.memberInfo.birthday"
                  @click="isEdit = !isEdit"
                >
                  {{ $t("common.edit") }}
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
            <el-form-item ref="refOldPassword" :label="$t('personal.oldPwd')" name="oldPassword" prop="oldPassword">
              <el-input
                type="password"
                v-model="updatePwdInfo.oldPassword"
                :placeholder="$t('placeholder.oldPwd')"
                clearable
                show-password
              />
            </el-form-item>

            <el-form-item ref="refPassword" :label="$t('personal.newPwd')" name="password" prop="password">
              <el-input
                type="password"
                v-model="updatePwdInfo.password"
                :placeholder="$t('placeholder.newPwd')"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item
              ref="refConfirmPassword"
              :label="$t('personal.confirmPwd')"
              name="confirmPassword"
              prop="confirmPassword"
            >
              <el-input
                type="password"
                v-model="updatePwdInfo.confirmPassword"
                :placeholder="$t('placeholder.confirmPwd')"
                clearable
                show-password
              />
            </el-form-item>
            <div class="txt-center btn-container">
              <button :loading="loadingPwBtn" class="standard-button btn-color-white" type="button" @click="clearPwd">
                {{ $t("personal.clear") }}
              </button>

              <button
                :loading="loadingPwBtn"
                class="standard-button btn-color-blue"
                type="button"
                @click="submitUpdatePwd"
              >
                {{ $t("personal.submit") }}
              </button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('personal.chgWithdrawPwd')" name="chgWithdrawPwd">
        <div class="update-pwd-container">
          <el-form
            ref="updateWithdrawPwdFormRef"
            :hideRequiredMark="true"
            :model="updateWithdrawPwdInfo"
            :rules="updateWithdrawPwdRules"
          >
            <el-form-item
              v-if="personalState.memberInfo.registeredWithdrawPassword && !receivedVerificationCode"
              ref="refWithdrawOldPassword"
              :label="$t('personal.oldWithdrawPwd')"
              name="oldPassword"
              prop="oldPassword"
            >
              <el-input
                type="password"
                v-model="updateWithdrawPwdInfo.oldPassword"
                :placeholder="$t('placeholder.oldWithdrawPwd')"
                clearable
                show-password
              />
            </el-form-item>

            <!-- <template v-if="receivedVerificationCode"></template> -->

            <el-form-item
              v-if="receivedVerificationCode"
              ref="refLoginPassword"
              :label="$t('personal.loginPwd')"
              name="loginPassword"
              prop="loginPassword"
            >
              <el-input
                type="password"
                v-model="updateWithdrawPwdInfo.loginPassword"
                :placeholder="$t('placeholder.loginPwd')"
              />
            </el-form-item>

            <el-form-item
              v-if="receivedVerificationCode"
              ref="refTelephone"
              :label="$t('personal.mobileNo')"
              name="telephone"
              prop="telephone"
            >
              <el-input v-model="updateWithdrawPwdInfo.telephone" :placeholder="$t('placeholder.mobileNo')" />
            </el-form-item>

            <el-form-item
              v-if="receivedVerificationCode"
              ref="refWithdrawPassword"
              :label="$t('personal.newWithdrawPwd')"
              name="withdrawPassword"
              prop="withdrawPassword"
            >
              <el-input
                type="password"
                v-model="updateWithdrawPwdInfo.withdrawPassword"
                :placeholder="$t('placeholder.newWithdrawPwd')"
                clearable
                show-password
              />
            </el-form-item>

            <el-form-item
              v-if="!receivedVerificationCode"
              ref="refNewWithdrawPassword"
              :label="$t('personal.newWithdrawPwd')"
              name="password"
              prop="password"
            >
              <el-input
                type="password"
                v-model="updateWithdrawPwdInfo.password"
                :placeholder="$t('placeholder.newWithdrawPwd')"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item
              v-if="!receivedVerificationCode"
              ref="refWithdrawConfirmPassword"
              :label="$t('personal.confirmWithdrawPwd')"
              name="confirmPassword"
              prop="confirmPassword"
            >
              <el-input
                type="password"
                v-model="updateWithdrawPwdInfo.confirmPassword"
                :placeholder="$t('placeholder.confirmWithdrawPwd')"
                clearable
                show-password
              />
            </el-form-item>
            <!-- <el-form-item v-if="receivedVerificationCode" ref="refWithdrawVerificationCode" :label="$t('personal.verificationCode')"  name="code" prop="code">
              <el-input v-model="updateWithdrawPwdInfo.code" :placeholder="$t('placeholder.verificationCode')" />
            </el-form-item> -->

            <div class="withdrawBottom">
              <div class="txt-center btn-container">
                <button
                  :loading="loadingWdPwBtn"
                  class="standard-button btn-color-white"
                  type="button"
                  @click="clearWithdrawPwd"
                >
                  {{ $t("personal.clear") }}
                </button>

                <button
                  :loading="loadingWdPwBtn"
                  class="standard-button btn-color-blue"
                  type="button"
                  @click="receivedVerificationCode ? submitChangeWithdrawPwd() : submitUpdateWithdrawPwd()"
                >
                  {{ $t("personal.submit") }}
                </button>
              </div>
              <div v-if="!receivedVerificationCode" class="link" @click="forgetWithdrawPwd">
                {{ $t("personal.forgetWithdrawPassword") }}
              </div>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="updateSecurityModalVisible"
      :footer="null"
      width="500px"
      :title="$t('personal.securityVerification')"
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
          <el-input v-model="updateSecurityVerified.emailAddress" :placeholder="$t('personal.email')" />
        </el-form-item>
        <el-form-item class="half" ref="verificationCode" prop="verificationCode">
          <el-space>
            <el-input
              v-model="updateSecurityVerified.verificationCode"
              :placeholder="$t('personal.verificationCode')"
              @keyup.enter="submitUpdateSecurity"
            />
            <el-button
              :disabled="disableSendVerificationButton"
              size="small"
              class="common-btn verification-btn"
              @click="openVerificationModal"
            >
              <span v-if="disableSendVerificationButton">{{ countDown + "" + $t("personal.countDown") }}</span>
              <span v-else>{{ $t("common.sendVerificationCode") }}</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingSecurityBtn" class="common-btn verification-btn" @click="submitUpdateSecurity">
          {{ $t("common.submit") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="verificationModalVisible"
      :title="$t('personal.captcha')"
      width="500px"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @keydown.enter.prevent
    >
      <el-form ref="captchaUpdateRef" :model="updateSecurityVerified">
        <el-form-item
          ref="captchaCode"
          prop="captchaCode"
          :rules="[{ required: true, message: $t('placeholder.captcha') }]"
        >
          <el-space>
            <el-input
              @keyup.enter="verifyVerificationCode"
              v-model="updateSecurityVerified.captchaCode"
              :maxlength="4"
              :placeholder="$t('placeholder.captcha')"
            />

            <div class="verification" @click="getCode()">
              <img :src="verificationImg" />
            </div>
          </el-space>
        </el-form-item>
      </el-form>
      <el-button class="common-btn" @click="verifyVerificationCode" :loading="isEmailSending">
        {{ $t("common.verify") }}
      </el-button>
    </el-dialog>

    <el-dialog
      wrap-class-name="securityModal"
      v-model="updatePhoneModalVisible"
      :footer="null"
      width="500px"
      :title="$t('personal.phoneVerification')"
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
          <el-input v-model="hidedUpdatePhoneVerifiedNumber" :placeholder="$t('personal.mobileNo')" disabled />
        </el-form-item>
        <el-form-item class="half" ref="verificationCode" prop="verificationCode">
          <el-space>
            <el-input v-model="updatePhoneVerified.verificationCode" :placeholder="$t('personal.verificationCode')" />
            <el-button
              :disabled="disableSendPhoneButton"
              size="small"
              class="common-btn verification-btn"
              @click="openPhoneVerificationModal"
            >
              <span v-if="disableSendPhoneButton">{{ countDown + "" + $t("personal.countDown") }}</span>
              <span v-else>{{ $t("common.sendVerificationCode") }}</span>
            </el-button>
          </el-space>
        </el-form-item>
        <el-button :loading="loadingPhoneBtn" class="common-btn verification-btn" @click="submitUpdatePhone">
          {{ $t("common.submit") }}
        </el-button>
      </el-form>
    </el-dialog>

    <el-dialog
      wrap-class-name="phoneModal"
      v-model="verificationPhoneModalVisible"
      :title="$t('personal.captcha')"
      width="500px"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="captchaUpdateRef" :model="updatePhoneVerified">
        <el-form-item
          ref="captchaCode"
          prop="captchaCode"
          :rules="[{ required: true, message: $t('placeholder.captcha') }]"
        >
          <el-space>
            <el-input
              @keypress.enter.prevent="verifyPhoneVerificationCode"
              v-model="updatePhoneVerified.captchaCode"
              :maxlength="4"
              :placeholder="$t('personal.captcha')"
            />

            <div class="verification" @click="getCode()">
              <img style="width: 80%; margin-top: 6px" :src="verificationImg" />
            </div>
          </el-space>
        </el-form-item>
      </el-form>
      <el-button class="standard-button btn-color-blue" @click="verifyPhoneVerificationCode" :loading="isPhoneSending">
        {{ $t("common.verify") }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script setup lang="js">
import { reactive, ref, onMounted, toRaw, computed, watch } from "vue";
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
  verifySms,
  verifyOtpAndChangePassword, withdrawPasswordWithPassNTel, forgetWithdrawSendEmail,
  getMemberTelephone
} from "@/api/personal/personal";
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from '@/utils/utils'
import WithdrawBank from "@/components/account/WithdrawBank.vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const selectedTab = ref('personal')
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
        personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).utcOffset('+08:00').format("DD-MM-YYYY");
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
      message: t('placeholder.emailFormat'),
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
            message: t('common.success'),
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
            message: t('common.success'),
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
      message: t('placeholder.mobileNo'),
      type: 'error',
    })
  })
}

const updatePhoneModalVisible = ref(false)
const updatePhoneFormRef = ref();
const hidedUpdatePhoneVerifiedNumber = computed(() => {
  if(!updatePhoneVerified.phone) return ""
  if(updatePhoneVerified.phone.length < 6) return updatePhoneVerified.phone.slice(-4)
  let result = ''
  for(const c in updatePhoneVerified.phone) {
    result += (c < 2 || c >= updatePhoneVerified.phone.length - 4) ? updatePhoneVerified.phone[c] : '*'
  }
  return result
})
const updatePhoneModal = () => {
  getMemberTelephone().then(res => {
    if(res.code === 0) {
      updatePhoneVerified.phone = res.data;
      updatePhoneVerified.phoneCode = "";
      updatePhoneModalVisible.value = true;
    } else {
      ElMessage.error(res.message)
    }
  })
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
            message: t('status.success'),
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
            message: t('common.success'),
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

const validatePhoneNumber = async (r, v) => {
  var reg = /^\d+$/;
  if (v === "") {
    return Promise.reject(t('placeholder.verifyPhone'));
  } else if (!reg.test(v)) {
    return Promise.reject(t('placeholder.onlyNumber'));
  } else {
    return Promise.resolve();
  }
};

const updateSecurityVerifiedRules = {
  emailAddress: [
    {
      required: true,
      message: t('placeholder.email'),
      trigger: "blur",
    },
    {
      type: "email",
      message: t('placeholder.emailFormat'),
      trigger: "blur",
    },
  ],
  verificationCode: [
    {
      required: true,
      message: t('placeholder.verificationCode'),
      trigger: "blur",
    },
    {
      min: 4,
      message: t('placeholder.min4'),
      trigger: "blur",
    },
  ],
};

const updatePhoneVerifiedRules = {
  phone: [
    {
      required: true,
      message: t('placeholder.mobileNo'),
      trigger: "blur",
    },
    {
      validator: validatePhoneNumber,
      trigger: "blur"
    }
  ],
  verificationCode: [
    {
      required: true,
      message: t('placeholder.verificationCode'),
      trigger: "blur",
    },
    {
      min: 4,
      message: t('placeholder.min4'),
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
            message: t('common.updateSuccess'),
            type: 'success',
          })
          clearPwd();
        } else {
          ElMessage.error(t(`response.${response.code}`))
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
    return Promise.reject(t('personal.common_and_new_password_not_match'));
  } else {
    return Promise.resolve();
  }
}

const updatePwdRules = {
  oldPassword: [
    {
      required: true,
      message: t('placeholder.oldPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: t('placeholder.newPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t('placeholder.confirmPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    },
    {
      required: true,
      validator: validatePwd,
      trigger: "blur"
    }
  ]
};

const updateWithdrawPwdFormRef = ref();
const updateWithdrawPwdInfo = reactive({
  // oldPassword: "",
  password: "",
  // confirmPassword: ""
  telephone: "",
  withdrawPassword: ""
});

const emailCodeId= ref();
const refWithdrawOldPassword= ref();
const refWithdrawPassword= ref();
const refNewWithdrawPassword = ref();
const refLoginPassword = ref();
const refTelephone = ref();
const clearWithdrawPwd = () =>{
  updateWithdrawPwdInfo.oldPassword = "";
  updateWithdrawPwdInfo.password= "";
  updateWithdrawPwdInfo.confirmPassword= "";
  updateWithdrawPwdInfo.code = "";
  updateWithdrawPwdInfo.telephone = "";
  updateWithdrawPwdInfo.withdrawPassword = "";
  updateWithdrawPwdInfo.loginPassword = "";
}

const submitUpdateWithdrawPwd = () => {
  loadingWdPwBtn.value = true
  updateWithdrawPwdFormRef.value
    .validate()
    .then(() => {
      changeWithdrawPwd(updateWithdrawPwdInfo.oldPassword, updateWithdrawPwdInfo.password).then((response) => {
        if (response.code === 0) {
          // message.success("success");
          ElMessage({
            message: t('common.updateSuccess'),
            type: 'success',
          })
          clearWithdrawPwd();
          window.location.reload();
        } else {
          ElMessage.error(response.message);
        }
      }).catch((error) => {
        console.log(error.message);
        // message.error(error.message, 4)
      });
    }).catch((error) => {
    console.log("error", error);
  });
  loadingWdPwBtn.value = false
};

// change withdraw password
const submitChangeWithdrawPwd = () => {

loadingWdPwBtn.value = true
updateWithdrawPwdFormRef.value
  .validate()
  .then(() => {
    const obj = {
      password: updateWithdrawPwdInfo.loginPassword,
      telephone: updateWithdrawPwdInfo.telephone,
      withdrawPassword: updateWithdrawPwdInfo.withdrawPassword,
    }
    withdrawPasswordWithPassNTel(obj).then((response) => {
      if (response.code === 0) {
        // message.success("success");
        ElMessage({
          message: t('common.updateSuccess'),
          type: 'success',
        })
        receivedVerificationCode.value = false;
        clearWithdrawPwd();
      } else {
        ElMessage.error(t(`response.${response.code}`))
      }
    }).catch((error) => {
      console.log(error.message);
      // message.error(error.message, 4)
    });
  }).catch((error) => {
  console.log("error", error);
});
loadingWdPwBtn.value = false
}

const codeChangeWithdrawPwd = () => {

  loadingWdPwBtn.value = true
  updateWithdrawPwdFormRef.value
    .validate()
    .then(() => {
      const obj = {
        password: updateWithdrawPwdInfo.password,
        code: updateWithdrawPwdInfo.code,
        codeId: emailCodeId.value
      }
      verifyOtpAndChangePassword(obj).then((response) => {
        if (response.code === 0) {
          // message.success("success");
          ElMessage({
            message: t('common.updateSuccess'),
            type: 'success',
          })
          receivedVerificationCode.value = false;
          clearWithdrawPwd();
        } else {
          ElMessage.error(t(`response.${response.code}`))
        }
      }).catch((error) => {
        console.log(error.message);
        // message.error(error.message, 4)
      });
    }).catch((error) => {
    console.log("error", error);
  });
  loadingWdPwBtn.value = false
}

const validateWithdrawPwd = async (r,v) => {
  if(updateWithdrawPwdInfo.confirmPassword !== updateWithdrawPwdInfo.password){
    return Promise.reject(t('placeholder.noMatch'));
  } else {
    return Promise.resolve();
  }
}

const validateRequireWithdrawPwd = () => {
}

const updateWithdrawPwdRules = {
  oldPassword: [
    {
      required: true,
      message: t('personal.oldWithdrawPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: t('personal.newWithdrawPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t('personal.confirmWithdrawPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    },
    {
      required: true,
      validator: validateWithdrawPwd,
      trigger: "blur"
    }
  ],

  telephone: [
    {
      required: true,
      message: t('placeholder.mobileNo'),
      trigger: "blur"
    }
  ],
  withdrawPassword: [
    {
      required: true,
      message: t('placeholder.newWithdrawPwd'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  loginPassword: [
  {
      required: true,
      message: t('placeholder.loginPwd'),
      trigger: "blur"
    }
  ],
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
            message: t('common.submitSuccess'),
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
const receivedVerificationCode = ref(false);
// Define a reactive variable to track the countdown timer
const countdownValue = ref(0);
let countdownInterval;

// Forget withdraw password
const forgetWithdrawPwd = () => {
  receivedVerificationCode.value = true;
}

// Function to send OTP email
const sendOTPEmail = () => {
  if (!personalState.memberInfo.email) {
    ElMessage.warning(t('common.bindEmailFirst'));
    selectedTab.value = 'personal'
    return
  }
  // Check if countdown timer is still running
  if (countdownValue.value === 0) {
    // If countdown timer has finished, reset the timer and send the email
    const obj = {
      email: personalState.memberInfo.email
    }
    forgetWithdrawSendEmail(obj).then((res) => {
      if (res.code === 0) {
        receivedVerificationCode.value = true;
        emailCodeId.value= res.data.codeId;
        ElMessage.success({
          type: "success",
          message: t('common.emailSent')
        });
        // Start the countdown timer again after sending the email
        countdownValue.value = 60;
        countdownInterval = setInterval(() => {
          countdownValue.value -= 1;
          if (countdownValue.value === 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      } else {
        ElMessage.error(res.message);
      }
    });
  } else {
    // If countdown timer is still running, show a message to try again later
    ElMessage.warning({
      type: "warning",
      message: t('common.tryAgain', { countDown: countdownValue.value })
    });
  }
};

const evipWeb = computed(() => {
      const evipString = personalState.memberInfo.evip;
      if (evipString) { // Check if evipString is defined
        const evipObject = JSON.parse(evipString);
        return 'https://' + evipObject.web;
      }
      return ''; // Return empty string if evipString is undefined
    });


onMounted(() => {
  if(sendOtpDisabledTimeoutLeft)
    countdownTimer();

  loadInfo();
  getCode();
});
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.name === 'Bank') {
      if (store.registeredWithdrawPassword === false) {
        ElMessage.error(t('withdraw.settleWithdrawPwd'));
        selectedTab.value = 'chgWithdrawPwd'
      }
    } else if (newQuery.name === 'chgWithdrawPwd') {
      selectedTab.value = 'chgWithdrawPwd'
    }
  },
  { immediate: true, deep: true }
);
watch (
  () => selectedTab.value,
  (newTab) => {
    if (newTab) {
      router.push({query: {name: selectedTab.value}})
    }
  }
)
</script>

<style scoped lang="scss">
.withdrawBottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 620px;
  .link {
    color: #468cff;
    cursor: pointer;
  }
}
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
        box-shadow: 0px 0px 8px 0px #a9c9ea inset;
        background: #f7f8fb;
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
    box-shadow: 0px 0px 8px 0px #a9c9ea inset;
    background: #f7f8fb;
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
}
</style>
<style lang="scss">
.account-content-wrapper {
  .el-form-item {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .el-form-item__content {
    width: 100%;
    max-width: 650px;
    .el-input__wrapper {
      padding: 10px 20px;
    }
  }
  .el-dialog {
    .el-form-item {
      flex-direction: row;
    }
    .el-input__wrapper {
      padding: 5px 10px;
    }
  }
}
</style>

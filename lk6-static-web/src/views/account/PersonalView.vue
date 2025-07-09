<template>
  <div class="account-box account-contents">
    <div class="menu-title-container">
      <div class="menu-title">个人中心</div>
    </div>

    <div class="personal-container">
      <el-form ref="updateFormRef" :model="updateFormDetails">
        <div class="personal-wrapper">
          <div class="basic-info">
            <div class="basic-info-table">
              <div class="tbl-row">
                <div class="basic-info-cell main-title">基本资料</div>
              </div>

              <div class="info-tbl-row">
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">昵称：</div>
                    <div v-if="personalState.memberInfo.loginName" class="basic-info-cell content">
                      {{ personalState.memberInfo.loginName }}
                    </div>
                  </div>
                </div>

                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">姓名：</div>
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
                              pattern: /^[\u4e00-\u9fa5·]+$/,
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
                </div>
              </div>

              <div class="info-tbl-row">
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">生日：</div>
                    <div v-if="personalState.memberInfo.birthday" class="basic-info-cell content">
                      {{ personalState.memberInfo.birthday }}
                    </div>

                    <div v-else class="basic-info-cell content">
                      <div class="datewsend" v-if="isEdit">
                        <el-form-item
                          name="birthday"
                          prop="birthday"
                          :rules="[{ required: true, message: '请输入生日' }]"
                        >
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
                </div>
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">电话：</div>
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
                      <button
                        class="standard-button btn-color-blue sm-btn"
                        v-if="!personalState.memberInfo.phoneVerified"
                        type="button"
                        @click="updatePhoneModal"
                      >
                        绑定
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

              <div class="info-tbl-row">
                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">邮箱：</div>
                    <div v-if="personalState.memberInfo.email" class="basic-info-cell content">
                      {{ personalState.memberInfo.email }}
                    </div>
                    <div v-else class="basic-info-cell content">
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
                        验证
                      </button>
                    </div>
                  </div>
                </div>

                <div class="info-tbl-col">
                  <div class="tbl-row">
                    <div class="basic-info-cell title">性别：</div>
                    <div v-if="personalState.memberInfo.gender" class="basic-info-cell content">
                      {{ personalState.memberInfo.gender === "Male" ? "男" : "女" }}
                    </div>
                    <div
                      v-else
                      class="basic-info-cell content"
                      v-if="personalState.memberInfo.gender || (!personalState.memberInfo.gender && isEdit)"
                    >
                      <el-select v-model="updateFormDetails.gender" placeholder="选择性别" style="min-width: 150px">
                        <el-option label="男" value="Male" />
                        <el-option label="女" value="Female" />
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>

              <el-button
                style="margin-top: 10px"
                :loading="loadingBtn"
                class="standard-button btn-color-blue"
                v-if="isEdit"
                @click="updateState"
              >
                提交
              </el-button>

              <button
                class="standard-button btn-color-blue"
                v-if="
                  !isEdit &&
                  (!personalState.memberInfo.birthday ||
                    !personalState.memberInfo.realName ||
                    !personalState.memberInfo.gender)
                "
                @click="isEdit = !isEdit"
              >
                编辑
              </button>
            </div>
          </div>
          <!-- <div class="buttons">
            <el-button size="large" class="common-btn light" @click="updatePwdModal">修改密码</el-button>
          </div> -->

          <div class="update-pwd-container">
            <div class="tbl-row">
              <div class="mb-20 basic-info-cell main-title">修改密码</div>
            </div>

            <el-form ref="updatePwdFormRef" :hideRequiredMark="true" :model="updatePwdInfo" :rules="updatePwdRules">
              <el-form-item ref="refOldPassword" label="旧密码" name="oldPassword" prop="oldPassword">
                <el-input
                  style="width: 200px"
                  type="password"
                  v-model="updatePwdInfo.oldPassword"
                  :placeholder="'请输入旧密码'"
                  clearable
                  show-password
                />
              </el-form-item>

              <el-form-item ref="refPassword" label="新密码" name="password" prop="password">
                <el-input
                  style="width: 200px"
                  type="password"
                  v-model="updatePwdInfo.password"
                  :placeholder="'请输入新密码'"
                  clearable
                  show-password
                />
              </el-form-item>
              <el-form-item ref="refConfirmPassword" label="确认密码" name="confirmPassword" prop="confirmPassword">
                <el-input
                  style="width: 200px"
                  type="password"
                  v-model="updatePwdInfo.confirmPassword"
                  :placeholder="'请再次输入新密码'"
                  clearable
                  show-password
                />
              </el-form-item>
              <div class="txt-center btn-container">
                <button
                  :loading="loadingPwBtn"
                  class="standard-button btn-color-white standout"
                  type="button"
                  @click="clearPwd"
                >
                  重新填写
                </button>

                <button
                  :loading="loadingPwBtn"
                  class="standard-button btn-color-blue"
                  type="button"
                  @click="submitUpdatePwd"
                >
                  确认修改
                </button>
              </div>
            </el-form>
          </div>
        </div>
        <div class="account-tip-text">
          <div class="link">
            如果您需要修改个人资料，请您联系我们的
            <a @click="store.openLiveChat()">在线客服</a>
          </div>
        </div>
      </el-form>
    </div>

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
      <el-form ref="captchaUpdateRef" :model="updateSecurityVerified">
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <el-space>
            <el-input
              @keyup.enter="verifyVerificationCode"
              v-model="updateSecurityVerified.captchaCode"
              :maxlength="4"
              placeholder="验证码"
            />

            <div class="verification" @click="getCode()">
              <img style="width: 80%; margin-top: 6px" :src="verificationImg" />
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

  <div class="account-box account-contents"><WithdrawBank /></div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted, toRaw } from "vue";
import { useNotify } from "@/hooks/notify";
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
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";
import { lsGet, lsStore, lsRemove, getTimeout } from "@/utils/utils";
import WithdrawBank from "@/components/account/WithdrawBank.vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useLocalStorage } from "@vueuse/core";

export default defineComponent({
  name: "PersonalView",
  components: {
    WithdrawBank
  },
  setup() {
    const notify = useNotify();
    // Send Verification Code
    const emailKey = `emailKey`;
    const phoneKey = `phoneKey`;
    const sendOtpDisabledKey = `sendOtpDisabled`;
    const router = useRouter();
    const sendOtpDisabledTimeout = 60;
    const sendOtpDisabledTimeoutLeft = getTimeout(sendOtpDisabledKey);

    let cachedEmail = lsGet(emailKey);
    let cachedTelephone = lsGet(phoneKey);
    let initialSendOtpDisabledTimeout = false;

    if (sendOtpDisabledTimeoutLeft) {
      initialSendOtpDisabledTimeout = true;
    } else {
      lsRemove(sendOtpDisabledKey);
      lsRemove(emailKey);
      lsRemove(phoneKey);

      cachedEmail = "";
      cachedTelephone = "";
    }

    const disableSendVerificationButton = ref(initialSendOtpDisabledTimeout);
    const disableSendPhoneButton = ref(initialSendOtpDisabledTimeout);
    const countDown = ref(sendOtpDisabledTimeoutLeft);
    const countDownPhone = ref(sendOtpDisabledTimeoutLeft);

    const loadingBtn = ref(false);
    const loadingPwBtn = ref(false);
    const loadingSecurityBtn = ref(false);
    const loadingPhoneBtn = ref(false);
    const isEmailSending = ref(false);
    const isPhoneSending = ref(false);
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
      if (sendOtpDisabledTimeoutLeft) countdownTimer();

      loadInfo();
      getCode();
    });
    const openWindow = (pageURL, pageTitle, popupWinWidth, popupWinHeight) => {
      var left = (screen.width - popupWinWidth) * 2;
      var top = (screen.height - popupWinHeight) / 4;
      window.open(
        pageURL,
        pageTitle,
        "resizable=yes, width=" + popupWinWidth + ", height=" + popupWinHeight + ", top=" + top + ", left=" + left
      );
    };
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const store = userStore();
    const getCode = () => {
      updateSecurityVerified.captchaCode = "";
      updatePhoneVerified.captchaCode = "";
      getVerificationCode()
        .then((res) => {
          if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            updateSecurityVerified.codeId = res.data.id;
            updatePhoneVerified.codeId = res.data.id;
          } else {
            notify.error(res.message);
          }
        })
        .catch(() => {
          // console.log(e.message);
          // message.error(e.message);
        });
    };
    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const captchaUpdateRef = ref();

    const isValidPhone = (r, v) => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!v) {
        return Promise.reject("请输入电话号码");
      } else if (phonePattern.test(v)) {
        return Promise.resolve();
      } else {
        return Promise.reject("请输入有效的电话号码");
      }
    };

    const updateSecurityVerified = reactive({
      verificationCode: "",
      emailAddress: ""
    });
    const updatePhoneVerified = reactive({
      verificationCode: "",
      phone: ""
    });
    const verificationImg = ref("");
    const loadInfo = () => {
      loadMemberInfo()
        .then((response) => {
          if (response.code === 0) {
            personalState.memberInfo = response.data;
            if (personalState.memberInfo.birthday) {
              personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const verificationModalVisible = ref(false);
    const updateSecurityModal = () => {
      updateSecurityVerified.emailAddress = cachedEmail;
      updateSecurityVerified.verificationCode = "";
      updateSecurityModalVisible.value = true;
    };
    const openVerificationModal = () => {
      updateSecurityFormRef.value
        .validateField("emailAddress")
        .then((resp) => {
          // captchaForm.captchaCode = "";
          getCode();
          verificationModalVisible.value = true;
        })
        .catch((err) => {
          notify({
            message: "请输入有效的邮件",
            type: "error"
          });
        });
    };
    const verifyVerificationCode = () => {
      captchaUpdateRef.value.validate().then(() => {
        isEmailSending.value = true;
        verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress;

        const emailDetails = {
          email: updateSecurityVerified.emailAddress,
          captchaCode: updateSecurityVerified.captchaCode,
          codeId: updateSecurityVerified.codeId
        };

        sendEmail(emailDetails)
          .then((res) => {
            if (res.code === 0) {
              disableSendVerificationButton.value = true;

              const now = new Date();

              now.setSeconds(now.getSeconds() + sendOtpDisabledTimeout);

              lsStore(sendOtpDisabledKey, now.getTime());
              lsStore(emailKey, verificationDetails.memberInfo.email);

              countDown.value = sendOtpDisabledTimeout;
              countdownTimer();

              verificationDetails.memberInfo.codeId = res.data.codeId;
              verificationModalVisible.value = false;

              notify({
                message: "成功",
                type: "success"
              });

              isEmailSending.value = false;
            } else {
              notify.error(res.message);
              getCode();
              isEmailSending.value = false;
            }
          })
          .catch((e) => {
            console.log(e.message);
            // message.error(e.message);
          });
      });
    };
    const submitUpdateSecurity = () => {
      loadingSecurityBtn.value = true;
      updateSecurityFormRef.value
        .validate()
        .then(() => {
          verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode;
          verifyEmail(verificationDetails.memberInfo)
            .then((res) => {
              if (res.code === 0) {
                notify({
                  message: "成功",
                  type: "success"
                });

                updateSecurityModalVisible.value = false;

                loadInfo();
              } else {
                notify.error(res.message);
              }
            })
            .catch((e) => {
              console.log(e.message);
              // message.error(e.message);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
      loadingSecurityBtn.value = false;
    };
    // Phone

    const verificationPhoneModalVisible = ref(false);
    // const openPhoneVerificationModal = () => {
    //   getCode();
    //   verificationPhoneModalVisible.value = true;
    // }
    const openPhoneVerificationModal = () => {
      updatePhoneFormRef.value
        .validateField("phone")
        .then((resp) => {
          // captchaForm.captchaCode = "";
          getCode();
          verificationPhoneModalVisible.value = true;
        })
        .catch((err) => {
          notify({
            message: "请输入有效的电话号码",
            type: "error"
          });
        });
    };

    const updatePhoneModalVisible = ref(false);
    const updatePhoneFormRef = ref();
    const updatePhoneModal = () => {
      updatePhoneVerified.phone = cachedTelephone;
      updatePhoneVerified.phoneCode = "";
      updatePhoneModalVisible.value = true;
    };
    const verifyPhoneVerificationCode = () => {
      captchaUpdateRef.value.validate().then(() => {
        isPhoneSending.value = true;
        verificationPhoneDetails.memberInfo.phone = updatePhoneVerified.phone;

        const phoneDetails = {
          telephone: updatePhoneVerified.phone,
          captchaCode: updatePhoneVerified.captchaCode,
          codeId: updatePhoneVerified.codeId
        };

        sendSms(phoneDetails)
          .then((res) => {
            if (res.code === 0) {
              disableSendPhoneButton.value = true;

              const now = new Date();

              now.setSeconds(now.getSeconds() + sendOtpDisabledTimeout);

              lsStore(sendOtpDisabledKey, now.getTime());
              lsStore(phoneKey, verificationPhoneDetails.memberInfo.phone);

              countDown.value = sendOtpDisabledTimeout;
              countdownTimer();

              verificationPhoneDetails.memberInfo.codeId = res.data.codeId;
              verificationPhoneModalVisible.value = false;

              notify({
                message: "成功",
                type: "success"
              });

              isPhoneSending.value = false;
            } else {
              notify.error(res.message);
              getCode();
              isPhoneSending.value = false;
            }
          })
          .catch((e) => {
            console.log(e.message);
            // message.error(e.message);
          });
      });
    };
    const submitUpdatePhone = () => {
      loadingPhoneBtn.value = true;
      updatePhoneFormRef.value
        .validate()
        .then(() => {
          verificationPhoneDetails.memberInfo.code = updatePhoneVerified.verificationCode;
          verifySms(verificationPhoneDetails.memberInfo)
            .then((res) => {
              if (res.code === 0) {
                notify({
                  message: "成功",
                  type: "success"
                });
                updatePhoneModalVisible.value = false;
                store.getMemberInfo();
                loadInfo();
                gotoNewplayerPromo();
              } else {
                notify.error(res.message);
              }
            })
            .catch((e) => {
              console.log(e.message);
              // message.error(e.message);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });

      loadingPhoneBtn.value = false;
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
    const countdownTimer = () => {
      if (countDown.value > 0) {
        setTimeout(() => {
          countDown.value -= 1;
          countdownTimer();
        }, 1000);
      } else {
        lsRemove(sendOtpDisabledKey);
        lsRemove(phoneKey);

        disableSendVerificationButton.value = false;
        disableSendPhoneButton.value = false;
      }
    };

    const updateSecurityVerifiedRules = {
      emailAddress: [
        {
          required: true,
          message: "请输入邮箱地址",
          trigger: "blur"
        },
        {
          type: "email",
          message: "邮箱地址不符合",
          trigger: "blur"
        }
      ],
      verificationCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          message: "长度应为 4",
          trigger: "blur"
        }
      ]
    };

    const updatePhoneVerifiedRules = {
      phone: [
        {
          required: true,
          message: "请输入电话号码",
          trigger: "blur"
        },
        {
          validator: isValidPhone,
          trigger: "blur"
        }
      ],
      verificationCode: [
        {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        {
          min: 4,
          message: "长度应为 4",
          trigger: "blur"
        }
      ]
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

    const refOldPassword = ref();
    const refPassword = ref();
    const clearPwd = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdInfo.confirmPassword = "";
    };

    const submitUpdatePwd = () => {
      // debugger;
      loadingPwBtn.value = true;
      updatePwdFormRef.value
        .validate()
        .then(() => {
          changePwd(updatePwdInfo.oldPassword, updatePwdInfo.password)
            .then((response) => {
              if (response.code === 0) {
                // message.success("success");
                notify({
                  message: "成功",
                  type: "success"
                });
                clearPwd();
              } else {
                notify.error(response.message);
              }
            })
            .catch((error) => {
              console.log(error.message);
              // message.error(error.message, 4)
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
      loadingPwBtn.value = false;
    };

    const validatePwd = async (r, v) => {
      if (updatePwdInfo.confirmPassword !== updatePwdInfo.password) {
        return Promise.reject("确认密码与新密码不符合");
      } else {
        return Promise.resolve();
      }
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

    const isEdit = ref(false);
    const updateFormDetails = reactive({});
    const updateFormRef = ref();
    const updateState = () => {
      loadingBtn.value = true;
      updateFormRef.value.validate().then(() => {
        updateAccount(toRaw(updateFormDetails))
          .then((ret) => {
            if (ret.code === 0) {
              notify({
                message: "提交成功",
                type: "success"
              });
              loadInfo();
              isEdit.value = false;
            } else {
              notify.error(ret.message);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      });

      loadingBtn.value = false;
    };

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
      loadingSecurityBtn,
      loadingPhoneBtn,
      disableSendVerificationButton,
      disableSendPhoneButton,
      countDown,
      countDownPhone
    };
  }
});
</script>

<style scoped lang="scss">
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
        border-radius: 20px;
        height: 38px;
        background: linear-gradient(180deg, #FFFFFF 0%, #E3EFFF 100%);
        box-shadow: 0px 2px 2px 0px #FFFFFFCC inset;
        box-shadow: 0px 2px 0px 0px #C6D9FF;

      }

      .btn-container {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 10px;
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
</style>

<style lang="scss">
.account-contents .searchbar {    
  .el-input__wrapper {
    background: #F7F8FB !important;
    box-shadow: 0px 0px 2.78px 0px #A9C9EA inset !important;
    border-radius: 8px !important;
  }
}
</style>

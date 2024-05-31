<template>
  <div class="menu-title-container">
    <span class="menu-title">Personal Information</span>
  </div>

  <div class="personal-wrapper">
    <a-form ref="updateFormRef" :model="updateFormDetails">
      <div class="personal-information-container">
        <div class="name-email" style="position: relative">
          <!-- <div class="top-right">
            <RiEditLine
              v-if="
                !isEdit &&
                (!personalState.memberInfo.realName ||
                  !personalState.memberInfo.email ||
                  !personalState.memberInfo.birthday ||
                  !personalState.memberInfo.telephone)
              "
              style="width: 20px; fill: currentColor"
              @click="isEdit = !isEdit"
            />
            <span v-if="isEdit">
              <div class="common-btn" @click="updateState">Submit</div>
            </span>
          </div> -->
          <div class="info-name">
            {{ personalState.memberInfo.loginName }}
          </div>
          <div v-if="personalState.memberInfo.email" class="info-email" style="display: flex; gap: 5px">
            {{ personalState.memberInfo.email }}
            <RiMailCheckLine v-if="personalState.memberInfo.emailVerified" style="width: 20px; fill: #ffffff" />
          </div>
          <div v-if="isEdit && !personalState.memberInfo.email" class="datewsend">
            <a-form-item
              name="email"
              :rules="[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Email address is not valid' }
              ]"
            >
              <a-input v-model:value="updateFormDetails.email" placeholder="Email" />
            </a-form-item>
            <!-- <a-input v-model="updateFormDetails.email" placeholder="อีเมลล์" /> -->
          </div>
        </div>
        <div class="other-info">
          <div class="account-content basic-info">
            <div class="basic-info-table">
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  <RiFileUserLine />
                  Name
                </div>
                <div v-if="personalState.memberInfo.realName" class="basic-info-cell content">
                  {{ personalState.memberInfo.realName }}
                </div>

                <div v-else>
                  <div v-if="isEdit" class="datewsend" style="margin-bottom: 10px">
                    <a-form-item
                      name="realName"
                      :rules="[
                        {
                          validator: validateName,
                          trigger: 'change'
                        },
                        {
                          required: true,
                          trigger: 'blur',
                          message: 'Real name is required'
                        }
                      ]"
                    >
                      <a-input v-model:value="updateFormDetails.realName" placeholder="Name" />
                    </a-form-item>
                  </div>
                  <div v-else class="basic-info-cell content">&nbsp;</div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  <RiCake2Line />
                  Birthday
                </div>
                <div v-if="personalState.memberInfo.birthday" class="basic-info-cell content">
                  {{ personalState.memberInfo.birthday }}
                </div>
                <div style="position: relative" v-else>
                  <div v-if="isEdit" class="datewsend" style="margin-bottom: 30px">
                    <a-form-item
                      name="birthday"
                      :rules="[
                        {
                          required: true,
                          message: 'Please enter your birthday'
                        }
                      ]"
                    >
                      <a-date-picker
                        v-model:value="updateFormDetails.birthday"
                        value-format="YYYY-MM-DD"
                        placeholder="Birthday"
                      />
                    </a-form-item>
                  </div>
                  <div v-else class="basic-info-cell content">&nbsp;</div>

                  <div class="top-right" style="display: inline-block; position: absolute; left: 350px; top: 10px">
                    <RiEditLine
                      v-if="
                        !isEdit &&
                        (!personalState.memberInfo.realName ||
                          !personalState.memberInfo.email ||
                          !personalState.memberInfo.birthday ||
                          !personalState.memberInfo.telephone)
                      "
                      style="width: 20px; display: block; fill: currentColor"
                      @click="isEdit = !isEdit"
                    />
                    <span v-if="isEdit">
                      <div class="common-btn" style="margin-top: -10px" @click="updateState">Submit</div>
                    </span>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  <RiSmartphoneLine />
                  Mobile Number
                </div>
                <div v-if="personalState.memberInfo.telephone" class="basic-info-cell content">
                  {{ personalState.memberInfo.telephone }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div v-if="isEdit" class="datewsend">
                    <a-form-item
                      name="birthday"
                      :rules="[
                        {
                          required: true,
                          message: 'Mobile Number is required'
                        }
                      ]"
                    >
                      <a-input v-model:value="updateFormDetails.phone" placeholder="Mobile Number" />
                    </a-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="account-tip-text danger" style="display: inline-block">
            If you need to modify your personal information, please contact our
            <a
              @click.stop.prevent="
                openWindow(
                  `https://csweb01.bcxu3ia8w.com/?partnerCode=Play4WinCS&lang=en&way=${regDevice}&token=${store.token}`,
                  'Chat Server',
                  350,
                  650
                )
              "
            >
              online customer service
            </a>
          </div>

          <div class="verifi-text-box">
            <template
              v-if="verificationStatus && (verificationStatus == 'NOT_EXIST' || verificationStatus == 'FAILED')"
            >
              <span class="text-red">You are required to submit/re-submit your photo for verification.</span>
            </template>
            <template v-else-if="verificationStatus && verificationStatus == 'PENDING'">
              <span class="text-red">Photo Verification Status: PENDING.</span>
            </template>
            <template v-else-if="verificationStatus && verificationStatus == 'SUCCESS'">
              <span class="color: #000;">Photo Verification Success.</span>
            </template>
          </div>
          <div class="buttons">
            <button class="common-btn account-btn" type="button" @click="updatePwdModal">Change Password</button>
            <button
              v-if="verificationStatus !== 'SUCCESS'"
              class="common-btn account-btn"
              type="button"
              @click="goToSecurityVerficationPage"
            >
              Security Verification
            </button>
          </div>
        </div>
      </div>
    </a-form>
    <a-modal v-model:visible="updatePwdModalVisible" wrap-class-name="passwordModal" :footer="null" width="100%">
      <div class="modal-head-title">Change Password</div>
      <a-form ref="updatePwdFormRef" :hide-required-mark="true" :model="updatePwdInfo" :rules="updatePwdRules">
        <a-form-item ref="oldPassword" name="oldPassword">
          <a-input v-model:value="updatePwdInfo.oldPassword" type="password" placeholder="Old Password" />
        </a-form-item>
        <a-form-item ref="password" name="password">
          <a-input v-model:value="updatePwdInfo.password" type="password" placeholder="New Password" />
        </a-form-item>
        <a-form-item ref="confirm_pass" name="confirm_pass">
          <a-input v-model:value="updatePwdInfo.confirm_pass" type="password" placeholder="Confirm New Password" />
        </a-form-item>

        <a-form-item class="txt-center">
          <button class="txt-center submit-btn common-btn" type="submit" @click="submitUpdatePwd">Confirm</button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="updateSecurityModalVisible" wrap-class-name="securityModal" :footer="null" width="100%">
      <div class="modal-head-title">Security Verification</div>
      <a-form
        ref="updateSecurityFormRef"
        :hide-required-mark="true"
        :model="updateSecurityVerified"
        :rules="updateSecurityVerifiedRules"
      >
        <a-form-item ref="emailAddress" name="emailAddress">
          <a-input v-model:value="personalState.memberInfo.email" placeholder="Please input email address" readonly />
        </a-form-item>
        <a-form-item ref="verificationCode" class="half" name="verificationCode">
          <a-input v-model:value="updateSecurityVerified.verificationCode" placeholder="Verification code" />
          <span class="common-btn verification-btn" @click="openVerificationModal">Verify</span>
        </a-form-item>
        <span class="common-btn verification-btn" @click="submitUpdateSecurity">Submit</span>
      </a-form>
    </a-modal>
    <!--    <a-modal-->
    <!--        v-model:visible="verificationModalVisible"-->
    <!--        wrap-class-name="securityModal"-->
    <!--    >-->
    <!--      <div class="modal-head-title">Captcha Code verification</div>-->
    <!--      <a-form :model="updateSecurityVerified">-->
    <!--        <a-form-item ref="captchaCode" required name="captchaCode">-->
    <!--          <a-input-->
    <!--              v-model:value="updateSecurityVerified.captchaCode"-->
    <!--              :maxlength="4"-->
    <!--              placeholder="Captcha Code"-->
    <!--              @keypress.enter="verifyVerificationCode"-->
    <!--          />-->
    <!--          <div class="verification" @click="getCode()">-->
    <!--            <img :src="verificationImg"/>-->
    <!--          </div>-->
    <!--        </a-form-item>-->
    <!--        <a-form-item>-->
    <!--          <button-->
    <!--              :disabled="isEmailSending"-->
    <!--              :style="isEmailSending ? 'opacity: .6' : ''"-->
    <!--              class="common-btn verification-btn"-->
    <!--              @click="verifyVerificationCode"-->
    <!--          >-->
    <!--            {{ isEmailSending ? "Verifying" : "Verify" }}-->
    <!--          </button>-->
    <!--        </a-form-item>-->
    <!--      </a-form>-->
    <!--    </a-modal>-->
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted, toRaw} from "vue";
import {message} from "ant-design-vue";
import {userStore} from "@/store";
import {getDevice} from "@/utils/utils";
import {
  RiFileUserLine, RiCake2Line, RiSmartphoneLine, RiEditLine, RiMailCheckLine

} from "vue-remix-icons";
import {
  loadMemberInfo,
  changePwd,
  loadVerifyStatus,
  updateAccount,
  sendEmail,
  verifyEmail,
} from "@/api/personal/personal";
import {getVerificationCode} from "@/api/index/login";
import moment from "moment";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "PersonalView",
  components: {
    RiFileUserLine,
    RiCake2Line,
    RiSmartphoneLine, RiEditLine, RiMailCheckLine,
  },
  setup() {
    let validateName = async (r, v) => {
      var reg = /[^a-zA-Z0-9 ]/g;
      if (v === '') {
        return Promise.reject('Please enter real name');
      } else if (reg.test(v)) {
        return Promise.reject('Only alphabets and numbers are allowed');
      } else {
        return Promise.resolve();
      }
    };
    let validateIC = async (r, v) => {
      var reg = /[^a-zA-Z0-9]/g;
      if (v === '') {
        return Promise.reject('Please enter IC No');
      } else if (reg.test(v)) {
        return Promise.reject('Only alphabets and numbers are allowed');
      } else {
        return Promise.resolve();
      }
    };

    let validatePass2 = async (r, v) => {
      if (v !== updatePwdInfo.password) {
        return Promise.reject('Confirm Password is not same');
      } else {
        return Promise.resolve();
      }
    }

    const isEmailSending = ref(false)
    const verificationDetails = reactive({
      memberInfo: {}
    });
    // const isCardActive = ref();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const personalState = reactive({
      memberInfo: {}
    });

    const verificationImg = ref("");
    onMounted(() => {
      loadInfo()
      loadVerificationStatus();
      // getCode();

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
    // const getCode = () => {
    //   updateSecurityVerified.captchaCode = ''
    //   getVerificationCode().then((res) => {
    //     if (res.code === 0) {
    //       verificationImg.value = "data:image/png;base64," + res.data.img;
    //       updateSecurityVerified.codeId = res.data.id;
    //     }
    //   }).catch((e) => {
    //     message.error(e.message);
    //   });
    // };
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

    const verificationStatus = ref(false);
    const loadVerificationStatus = () => {
      loadVerifyStatus().then((response) => {
        if (response.code === 0) {
          console.log(response.data);
          verificationStatus.value = response.data.status;

        }
      });
    }
    //update security

    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const updateSecurityVerified = reactive({
      mobileNumber: "",
      verificationCode: ""
    });
    const verificationModalVisible = ref(false)
    const updateSecurityModal = () => {
      updateSecurityVerified.emailAddress = "";
      updateSecurityVerified.verificationCode = "";
      updateSecurityModalVisible.value = true;
    };
    const openVerificationModal = () => {
      // getCode();
      verificationModalVisible.value = true;

    }
    const verifyVerificationCode = () => {
      isEmailSending.value = true
      verificationDetails.memberInfo.email = personalState.memberInfo.email
      const emailDetails = {
        email: personalState.memberInfo.email,
        captchaCode: updateSecurityVerified.captchaCode,
        codeId: updateSecurityVerified.codeId
      }
      sendEmail(emailDetails).then((res) => {
        if (res.code === 0) {
          verificationDetails.memberInfo.codeId = res.data.codeId
          verificationModalVisible.value = false;
          message.success("success")
          isEmailSending.value = false
        }
      }).catch((e) => {
        console.log(e.message);
        // getCode()
        isEmailSending.value = false
      });
    }
    const submitUpdateSecurity = () => {
      updateSecurityFormRef.value
          .validate()
          .then(() => {

            verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode
            verificationDetails.memberInfo.email = personalState.memberInfo.email

            verifyEmail(verificationDetails.memberInfo).then((res) => {
              if (res.code === 0) {
                message.success("success");
                updateSecurityModalVisible.value = false
                loadInfo()
              }
            }).catch((e) => {
              console.log(e.message);
            });
          }).catch((error) => {
        console.log("error", error);
      });
    };

    const updateSecurityVerifiedRules = {
      verificationCode: [
        {
          required: true,
          message: "Please enter verification code",
          trigger: "blur"
        },
        {
          min: 4,
          message: "Length should be 4",
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
      confirm_pass: ""
    });
    const updatePwdModal = () => {
      updatePwdInfo.oldPassword = "";
      updatePwdInfo.password = "";
      updatePwdInfo.confirm_pass = "";
      updatePwdModalVisible.value = true;
    };
    const submitUpdatePwd = () => {
      updatePwdFormRef.value
          .validate()
          .then(() => {
            changePwd(updatePwdInfo.oldPassword, updatePwdInfo.password).then((response) => {
              if (response.code === 0) {
                message.success("success");
                updatePwdModalVisible.value = false;
              } else {
                message.error(response.message);
              }
            }).catch((error) => {
              console.log("error", error);
            });
          }).catch((error) => {
        console.log("error", error);
      });
    };
    const updatePwdRules = {
      oldPassword: [
        {
          required: true,
          message: "Please enter old password",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be between 6 to 12",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "Password is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be 6 to 12",
          trigger: "blur"
        }
      ],
      confirm_pass: [
        {
          required: true,
          message: "Confirm New Password is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be 6 to 12",
          trigger: "blur"
        },
        {
          validator: validatePass2,
          trigger: "blur",
        },
      ],
      captchaCode: [
        {
          required: true,
          message: "Captcha code is required",
          trigger: "blur",
        },
        {
          min: 4,
          max: 4,
          message: "Length should be 4",
          trigger: "change",
        },
      ],
    };

    //update details
    const isEditRealName = ref(false)

    const isEditEmail = ref(false)
    const isEditPhone = ref(false)
    const isEditBirthday = ref(false)
    const isEdit = ref(false)
    const updateFormDetails = reactive(
        {}
    )
    const updateFormRef = ref()
    const updateState = async () => {
      try {
        await updateFormRef.value.validate();
        const ret = await updateAccount(toRaw(updateFormDetails));

        if (ret.code === 0) {
          message.success("Updated successfully");
          loadInfo();
          isEdit.value = false;
        } else {
          console.error("Update failed with code:", ret.code);
        }
      } catch (err) {
        console.error("An error occurred:", err.message);
      }
    };

    const router = useRouter()
    const goToSecurityVerficationPage = () => {
      if(verificationStatus.value && verificationStatus.value === 'PENDING'){
        message.warning("Photo verification is in Pending.");
      }else{
        router.push("/center/security-verification");
      }

    }

    return {
      searchForm,
      personalState,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      updateSecurityVerifiedRules,
      submitUpdateSecurity,
      updatePwdFormRef,
      updatePwdInfo,
      updatePwdModal,
      updatePwdModalVisible,
      updatePwdRules,
      submitUpdatePwd,
      isEditRealName,
      isEditEmail,
      isEditPhone,
      loadInfo,
      isEditBirthday,
      isEdit,
      updateFormDetails,
      updateState,
      getVerificationCode,
      verificationModalVisible,
      openVerificationModal,
      verificationImg,
      // getCode,
      verifyVerificationCode,
      isEmailSending,
      updateFormRef,
      store,
      regDevice,
      openWindow,
      validateName,
      validateIC,
      goToSecurityVerficationPage,
      verificationStatus
    };
  }
});
</script>

<style lang="scss">
.personal-information-container {
  .ant-form-item-explain.ant-form-item-explain-error {
    text-align: left;
    margin-top: 5px;
  }
}

.ant-input-group {
  .ant-input-group-addon {
    background: transparent;
    line-height: 10px;
    border: 0;

    svg {
      width: 20px;
      fill: #ffffff;
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
    width: 90%;
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
    width: 90%;
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
</style>
<style scoped lang="scss">
:deep(.ant-form-item.half .ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .ant-input {
    width: 100%;
    flex: 1;
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

  border: 0;
}

.common-btn {
  width: 100%;
  cursor: pointer;

  &.search-btn {
    margin-top: 0;
    padding: 3px 5px;
    font-size: 14px;
  }

  &.verification-btn {
    flex: 1;
    padding: 8px;
  }

  &.submit-btn {
    padding: 8px;
  }
}

.basic-info {
  position: relative;
  margin: 0;

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

.dark-theme {
  .basic-info-table {
    .basic-info-cell {
      &.content {
        color: #ffffff;
        border: 0;
        background: #ffffff0f;
      }
    }
  }
}
.basic-info-table {
  .tbl-row {
    display: flex;
    flex-direction: column;
    gap: 15px;

    svg {
      fill: #ffffff;
      width: 20px;
      display: none;
      vertical-align: middle;
    }
  }

  .basic-info-cell {
    &.title {
      width: 150px;
    }
    &.content {
      border: 1px solid #d7d7d7;
      border-radius: 12px;
      max-width: 337px;
      overflow: hidden;
      padding: 10px 15px;
      margin-bottom: 30px;
      color: #83a3ca99;
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
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.searchbar .ant-form {
  display: flex;
  justify-content: space-between;

  .ant-form-item {
    margin-right: 0;
  }
}

.personal-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  .personal-information-container {
    // display: flex;
    // justify-content: center;
    // flex-direction: column;
    // width: 100%;
    // max-width: 500px;
    // margin: 0 auto;
    // box-shadow: 2px 2px 10px 1px #000000;
    // border-radius: 20px;
    // overflow: hidden;

    .name-email {
      padding: 50px 0;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      position: relative;

      .top-right {
        position: absolute;
        right: 20px;
        top: 20px;
      }

      .info-name {
        font-size: 30px;
        background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
        background-size: 100%;
        background-repeat: repeat;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
        font-family: Poppins Bold;
      }

      .info-email {
        color: #83a3ca;
      }
    }

    .other-info {
      .account-tip {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        margin: 20px 0;

        a {
          color: #db7e42;
        }
      }

      .verifi-text-box {
        width: 100%;
        text-align: left;
        margin-bottom: 8px;

        .text-red {
          color: #ff4d4f;
        }
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }
    }
  }
}

.datewsend {
  display: flex;
  background: transparent;
  border: 0;

  .ant-form-item {
    width: 337px;
    margin-bottom: 0;
  }

  svg.ri-send-plane-line {
    padding: 0px 15px;
    width: 50px;
    background: transparent;
    fill: #ffffff;
    background: #40425c;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .account-container {
    .basic-info-table {
      grid-template-columns: 1fr;
    }
  }
  .personal-wrapper {
    .buttons {
      flex-direction: column;
    }
  }
}

@media (max-width: 767px) {
  .bindunbind {
    display: none;
  }
  .basic-info {
    .account-btn {
      padding: 5px 0px;
      font-size: 12px;
      min-width: 140px;
    }
  }
}

@media (max-width: 767px) {
  .account-container {
    .account-content-wrapper {
      //     .basic-info-table {
      //       width: 100%;
      //       .basic-info-cell {
      //         padding-right: 56px;
      //         padding-bottom: 16px;
      //         &.title {
      //           width: 100px;
      //         }
      //       }
      //     }
      .bank-card-list {
        max-width: 300px;
        margin: 100px auto;
        padding: 15% 0 0;

        .bank-card-item {
          width: 100%;
          max-width: 300px;
          margin-right: 0;
          margin: 0;
          margin-top: -40%;
          flex-direction: column;
          align-items: center;
          height: 150px;
          // background-image: url("../../assets/images/account/bank_card_bg.png");
          transform: none;

          .unlink-btn {
            right: 10px;
            left: unset;
            display: none;
            transition-delay: 0.5s;
            transition: all 0.3s ease-in;
          }

          .txt-center {
            transform: none;
            padding-top: 10px;
            width: 100%;
          }

          &.active {
            margin-bottom: 30%;
            padding-bottom: 10%;

            .unlink-btn {
              display: block;
            }
          }

          &.inactive {
            margin-top: -40%;
          }
        }
      }
    }
  }
}
</style>

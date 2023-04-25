<template>
  <div class="menu-title-container">
    <!-- <span class="menu-title">ข้อมูลส่วนตัว</span> -->
  </div>

  <div class="personal-wrapper">
    <div class="personal-information-container">
    <q-form>
      <div class="name-email">
        <div class="top-right">
          <RiEditLine style="width: 20px; fill:#ffffff;"
            v-if="!isEdit && (!personalState.memberInfo.realName || !personalState.memberInfo.validId || !personalState.memberInfo.email || !personalState.memberInfo.birthday || !personalState.memberInfo.telephone)"
            @click="isEdit = !isEdit"
          />
          <span v-if="isEdit">
            <q-btn outline @click="updateState">Update</q-btn>
          </span>
        </div>
        <div v-if="personalState.memberInfo.profilePicture" class="info-picture"><img :src="personalState.memberInfo.profilePicture"></div>
        <div class="info-name"><span v-if="!personalState.memberInfo.displayName">{{ personalState.memberInfo.nickName }}</span><span v-if="personalState.memberInfo.displayName">{{ personalState.memberInfo.displayName }} ({{ personalState.memberInfo.nickName }})</span></div>
        <div class="info-email" v-if="personalState.memberInfo.email">
          {{ personalState.memberInfo.email }}
          <q-icon size="xs" color="white" name="mark_email_read" v-if="personalState.memberInfo.emailVerified" />
        </div>
        <div v-if="isEdit && !personalState.memberInfo.email">
          <q-input
            class="whiteError"
            ref="emailRef"
            filled
            color="white"
            v-model="formDetail.email"
            placeholder="Email"
            :rules="[
              (val) => (val && val.length > 0) || 'Email is required'
            ]"
          >
            <!-- <template v-slot:append>
              <q-avatar>
                <RiSendPlane2Line @click="updateState('email')" />
              </q-avatar>
            </template> -->
          </q-input>
        </div>
      </div>
     </q-form>
      <div class="other-info">
        <div class="account-content basic-info">
          <div class="basic-info-table">
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiFileUserLine />
                Name
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.realName"
              >
                {{ personalState.memberInfo.realName }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.realName">
                <q-input
                  ref="realNameRef"
                  color="white"
                  filled
                  v-model="formDetail.realName"
                  placeholder="Real Name"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter real name'
                  ]"
                >
                  <!-- <template v-slot:append>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('realName')" />
                    </q-avatar>
                  </template> -->
                </q-input>
              </div>
            </div>
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiPassportLine />
                Valid ID
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.validId"
              >
                {{ personalState.memberInfo.validId }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.validId">
                <q-input
                  ref="validIdRef"
                  color="white"
                  filled
                  v-model="formDetail.validId"
                  placeholder="Valid ID"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter valid ID'
                  ]"
                >
                  <!-- <template v-slot:append>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('realName')" />
                    </q-avatar>
                  </template> -->
                </q-input>
              </div>
            </div>
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiCake2Line />
                Birthday
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.birthday"
              >
                {{ (moment(personalState.memberInfo.birthday).format("DD-MM-YYYY")) }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.birthday">
                <q-input ref="birthdayRef" filled v-model="formDetail.birthday" placeholder="Birthday"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter your birthday'
                  ]">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="formDetail.birthday" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <!-- <template v-slot:after>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('birthday')" />
                    </q-avatar>
                  </template> -->
                </q-input>
                <!-- <q-input color="white" filled v-model="formDetail.birthday" placeholder="วันเกิด">
                </q-input> -->
              </div>
            </div>
            <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiSmartphoneLine />
                Phone
              </div>
              <div
                class="basic-info-cell content"
                v-if="personalState.memberInfo.telephone"
              >
                {{ personalState.memberInfo.telephone }}
              </div>
              <div v-if="isEdit && !personalState.memberInfo.telephone">
                <q-input
                  ref="phoneRef"
                  color="white"
                  filled
                  v-model="formDetail.phone"
                  placeholder="Mobile Number"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please enter mobile number',
                    isValidPhone
                  ]"
                >
                  <!-- <template v-slot:append>
                    <q-avatar>
                      <RiSendPlane2Line @click="updateState('phone')" />
                    </q-avatar>
                  </template> -->
                </q-input>
              </div>
            </div>
            <!-- <div class="tbl-row">
              <div class="basic-info-cell title">
                <RiBankCardLine />
                Zalo
              </div>
              <div class="basic-info-cell content">
                {{ personalState.memberInfo.zalo }}
              </div>
            </div> -->
          </div>
        </div>
        <div class="account-tip danger">
          If you need to modify your personal information, please contact our
          online customer service
          <router-link to="/live">online service</router-link>
        </div>
        <div class="buttons">
          <q-btn
            class="full-width"
            label="Change Password"
            type="submit"
            color="brand"
            @click="updatePwdModal"
          />
          <q-btn v-if="!personalState.memberInfo.emailVerified"
            class="full-width"
            label="Security Verification"
            type="submit"
            color="brand"
            @click="updateSecurityModal"
          />
          <q-btn
            class="full-width"
            label="Withdrawal Password"
            type="submit"
            color="brand"
            @click="updateWithdrawPwdModal"
          />
        </div>
      </div></div>
   
    <q-dialog
      v-model="updatePwdModalVisible"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
        <q-card-section>
          <div class="text-h6">Change Password</div>
        </q-card-section>

        <q-form class="q-gutter-sm">
          <q-input
            ref="oldPasswordRef"
            type="password"
            v-model="updatePwdInfo.oldPassword"
            placeholder="Current Password"
            :rules="oldPwdRules"
          />
          <q-input
            ref="passwordRef"
            type="password"
            v-model="updatePwdInfo.password"
            placeholder="New Password"
            :rules="pwdRules"
          />
          <div class="flex flex-center">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Confirm" color="brand" @click="submitUpdatePwd" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="updateSecurityModalVisible"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        style="width: 100%; padding: 20px; margin: 0"
        class="bg-primary text-white"
      >
        <q-card-section>
          <div class="text-h6">Security Verification</div>
        </q-card-section>

        <q-form class="q-gutter-sm">
          <q-input
            ref="emailAddressRef"
            v-model="updateSecurityVerified.emailAddress"
            placeholder="Email"
            :rules="[
              (val) => (val && val.length > 0) || 'Email address cannot be empty'
            ]"
          />
          <div class="half">
            <q-input
              ref="verificationCodeRef"
              type="password"
              v-model="updateSecurityVerified.verificationCode"
              placeholder="Verification Code"
              :rules="[
                (val) => (val && val.length > 0) || 'Verification Code cannot be empty'
              ]"
            />
            <q-btn label="Get Verification" @click="openVerificationModal" />
          </div>
          <q-btn label="Verify" color="brand" @click="submitUpdateSecurity" />
        </q-form>
      </q-card>
    </q-dialog>

   <q-dialog
      v-model="verificationModalVisible"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card class="q-pa-md">
      <div class="modal-head-title q-pb-md">Verify Captcha Code</div>
      <q-form class="q-gutter-sm">
          <q-input
            ref="captchaCodeRef"
            filled
            type="text"
            v-model="updateSecurityVerified.captchaCode"
            label="Captcha Code"
            :rules="[
              (val) => (val && val.length > 3) || 'Enter verification code'
            ]"
            color="white"
          >
            <template v-slot:append>
              <img :src="verificationImg"  @click="getCode()" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
          <q-btn
            :disabled="isEmailSending"
            :style="isEmailSending ? 'opacity: .6' : ''"
            class="common-btn verification-btn"
            @click.prevent="verifyVerificationCode"
          >
            {{ isEmailSending ? 'Verifying' : 'Verify' }}
          </q-btn>
      </q-form>
    </q-card>
    </q-dialog>

    <q-dialog
      v-model="updateWithdrawPwdModalVisible"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 100%; padding: 20px" class="bg-primary text-white">
        <q-card-section>
          <div class="text-h6">Update Withdrawal Password</div>
        </q-card-section>

        <q-form class="q-gutter-sm">
          <q-input
            v-if="isWithdrawPasswordExist"
            ref="oldWithdrawPasswordRef"
            type="password"
            v-model="updateWithdrawPwdInfo.oldPassword"
            placeholder="Current Password"
            :rules="oldWithdrawPwdRules"
          />
          <q-input
            ref="withdrawPasswordRef"
            type="password"
            v-model="updateWithdrawPwdInfo.password"
            placeholder="New Password"
            :rules="withdrawPwdRules"
          />
          <div class="flex flex-center">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Confirm" color="brand" @click="submitUpdateWithdrawPwd" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import {
  RiSpamLine, RiLink, RiLinkUnlink, RiFileUserLine, RiCake2Line, RiSmartphoneLine, RiEditLine, RiPassportLine

} from "vue-remix-icons";
// import {
//   loadMemberInfo,
//   changePwd,
// } from "@/api/personal/personal";
import moment from "moment";
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import { userStore } from "src/stores"


export default defineComponent({
  name: "PersonalView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    RiSpamLine,
    // eslint-disable-next-line vue/no-unused-components
    RiLink,
    // eslint-disable-next-line vue/no-unused-components
    RiLinkUnlink,
    // eslint-disable-next-line vue/no-unused-components
    RiFileUserLine,
    RiCake2Line,
    RiSmartphoneLine,
    RiEditLine,
    RiPassportLine
  },
  setup() {
    // const isCardActive = ref();
    const qs = require("qs");
    const $q = useQuasar();
    const searchForm = reactive({
      start: "",
      end: ""
    });

    const loadInfo = () => {
    personalState.memberInfo = userStore()
    // if (personalState.memberInfo.birthday > 0) {
    //   personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
    // }
      // api.get("/session/member").then((res) => {
      //   const response = res.data
      //    if (response.code === 0) {
      //     personalState.memberInfo = response.data;

      //     if (personalState.memberInfo.birthday > 0) {
      //       personalState.memberInfo.birthday = moment(personalState.memberInfo.birthday).format("DD-MM-YYYY");
      //     }
      //    }
      // })
    }

    const personalState = reactive({
      memberInfo: {}
    });
    const verificationDetails = reactive({
      memberInfo: {}
    });

    onMounted(() => {
      loadInfo()
      getCode()
    });

    const verificationImg = ref("");

    const isWithdrawPasswordExist = ref(false)
        
    const isValidPhone = () => {
      const phonePattern = /^\d+$/;
      return phonePattern.test(regForm.telephone) || "Only numbers are allowed";
    };
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            updateSecurityVerified.codeId = response.data.id;
          }
        })
        .catch((e) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          });
        });
    };
    //update security

    const isEmailSending = ref(false)
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
      getCode();
      verificationModalVisible.value = true;
    }
    const verifyVerificationCode = () => {
      isEmailSending.value = true
      verificationDetails.memberInfo.email = updateSecurityVerified.emailAddress
      const emailDetails =  {
        email: updateSecurityVerified.emailAddress,
        captchaCode: updateSecurityVerified.captchaCode,
        codeId: updateSecurityVerified.codeId
      }
      api.post("/otp/sendEmail", qs.stringify(emailDetails)).then((res) => {
        const ret = res.data
        if (ret.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "An OTP code has been sent to your email.",
            icon: "check_circle_outline"
          });
          verificationDetails.memberInfo.codeId = ret.data.codeId
          verificationModalVisible.value = false;
          isEmailSending.value = false
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: ret.message,
          //   icon: "report_problem"
          // });
          isEmailSending.value = false
          getCode()
        }
      })
        .catch((e) => {
          getCode()
          isEmailSending.value = false
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
    }
    const emailAddressRef = ref()
    const verificationCodeRef = ref()
    const submitUpdateSecurity = () => {
      emailAddressRef.value.validate()
      verificationCodeRef.value.validate()
      if (emailAddressRef.value.hasError || verificationCodeRef.value.hasError) {
      } else {
        verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode
        api.post("/otp/verifyEmail", qs.stringify(verificationDetails.memberInfo)).then((res) => {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Successfully verified",
            icon: "check_circle_outline"
          });
          updateSecurityModalVisible.value = false
          loadInfo()
        }).catch((e) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
      }
    }
    //update pwd
    const updatePwdModalVisible = ref(false);
    const oldPasswordRef = ref();
    const passwordRef = ref();
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
      oldPasswordRef.value.validate()
      passwordRef.value.validate()

      if (oldPasswordRef.value.hasError || passwordRef.value.hasError) {
      } else {
        api.post("/session/password", qs.stringify({ oldPassword: updatePwdInfo.oldPassword, password: updatePwdInfo.password  })).then((res) => {
          const response = res.data
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Password updated successfully",
                icon: "check_circle_outline"
              });
              updatePwdModalVisible.value = false;
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
    const isEditRealName = ref(false)
    const isEditValidId = ref(false)
    const isEditEmail = ref(false)
    const isEditPhone = ref(false)
    const isEditBirthday = ref(false)
    const isEdit = ref(false)
    const emailRef = ref()
    const realNameRef = ref()
    const validIdRef = ref()
    const birthdayRef = ref()
    const phoneRef = ref()
    const formDetail = ref([{ }])
    const updateState = () => {
      const updateInfo = formDetail.value
      if (!personalState.memberInfo.email) {
        emailRef.value.validate()
        if (emailRef.value.hasError) {
          return
        }
      }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate()
        if (realNameRef.value.hasError) {
          return
        }
      }
      if (!personalState.memberInfo.validId) {
        validIdRef.value.validate()
        if (validIdRef.value.hasError) {
          return
        }
      }
      if (!personalState.memberInfo.birthday) {
        birthdayRef.value.validate()
        if (birthdayRef.value.hasError) {
          return
        }
      } 
      if (!personalState.memberInfo.telephone) {
        phoneRef.value.validate()
        if (phoneRef.value.hasError) {
          return
        }
      } 
      api.post("/session/account", qs.stringify(updateInfo)).then((res) => {
      const r = res.data
        if (r.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: "อัพเดทเรียบร้อยแล้ว",
            icon: "check_circle_outline"
          });
          loadInfo()
          isEdit.value = !isEdit.value
        }
      })
      // if (field === 'email') {
      //   isEditEmail.value = false
      // }
      // if (field === 'name') {
      //   isEditRealName.value = false
      // }
      // if (field === 'phone') {
      //   isEditPhone.value = false
      // }
      // if (field === 'birthday') {
      //   isEditBirthday.value = false
      // }
    }

    // update withdraw pwd
    const getWithdrawPassword = () => {
      api.get("/session/withdraw/entrance").then((res) => {
        const response = res.data
        if (response.code === 0) {
          isWithdrawPasswordExist.value = response.data
        } else {
          $q.notify({
            color: "negative",
            position: "top",
            message: response.message,
            icon: "report_problem"
          });
        }
      })
    }

    const updateWithdrawPwdModalVisible = ref(false);
    const oldWithdrawPasswordRef = ref();
    const withdrawPasswordRef = ref();
    const updateWithdrawPwdInfo = reactive({
      oldPassword: "",
      password: ""
    });
    const updateWithdrawPwdModal = () => {
      getWithdrawPassword()
      updateWithdrawPwdInfo.oldPassword = "";
      updateWithdrawPwdInfo.password = "";
      updateWithdrawPwdModalVisible.value = true;
    };
    const submitUpdateWithdrawPwd = () => {
      oldWithdrawPasswordRef.value.validate()
      withdrawPasswordRef.value.validate()

      if (oldWithdrawPasswordRef.value.hasError || withdrawPasswordRef.value.hasError) {
      } else {
        api.post("/session/withdrawPassword", qs.stringify({ oldPassword: updateWithdrawPwdInfo.oldPassword, password: updateWithdrawPwdInfo.password  })).then((res) => {
          const response = res.data
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Withdraw Password updated successfully",
                icon: "check_circle_outline"
              });
              updateWithdrawPwdModalVisible.value = false;
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
    
    return {
      searchForm,
      personalState,
      updateSecurityFormRef,
      updateSecurityVerified,
      updateSecurityModal,
      updateSecurityModalVisible,
      submitUpdateSecurity,
      updatePwdInfo,
      updatePwdModal,
      updatePwdModalVisible,
      submitUpdatePwd,
      oldPasswordRef,
      passwordRef,
      oldPwdRules: [
        val => (val && val.length > 0) || 'Old password is required',
        val => (val.length > 5 && val.length < 12) || 'Length should be 6 to 12'
      ],
      pwdRules: [
        val => (val && val.length > 0) || 'Password is required',
        val => (val.length > 5 && val.length < 12) || 'Length should be 6 to 12'
      ],
      isEditRealName,
      isEditValidId,
      isEditEmail,
      isEditPhone,
      loadInfo,
      isEditBirthday,
      formDetail,
      updateState,
      verificationModalVisible,
      openVerificationModal,
      isEmailSending,
      verificationImg,
      verifyVerificationCode,
      getCode,
      verificationDetails,
      verificationCodeRef,
      emailAddressRef,
      isEdit,
      emailRef,
      realNameRef,
      validIdRef,
      birthdayRef,
      phoneRef,
      moment,
      isValidPhone,
      isWithdrawPasswordExist,
      getWithdrawPassword,
      updateWithdrawPwdInfo,
      updateWithdrawPwdModal,
      updateWithdrawPwdModalVisible,
      submitUpdateWithdrawPwd,
      oldWithdrawPasswordRef,
      withdrawPasswordRef,
    };
  }
});
</script>

<style lang="scss">
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
.half {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px;
}
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

:deep(.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input) {
  height: 40px;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #23263c;
  color: #ffffff;
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

.basic-info-table {
  .tbl-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    align-items: center;

    svg {
      fill: #ffffff;
      width: 20px;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .basic-info-cell {
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
  justify-content: center;
  align-items: center;

  .personal-information-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    margin: 20px;
    box-shadow: 2px 2px 10px 1px #000000;
    border-radius: 20px;
    overflow: hidden;

    .name-email {
      background-image: linear-gradient(to right, #de4545, #db7e42);
      padding: 50px;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;
      .top-right {
        position:absolute;
        right: 20px; 
        top:20px;
      }
      .info-picture {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .info-name {
        color: #ffffff;
        font-size: 30px;
      }

      .info-email {
        color: #ffffff;
      }
    }

    .other-info {
      padding: 20px;

      .account-tip {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
        margin: 20px 0;

        a {
          color: #db7e42;
        }
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
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

@media (max-width: 768px) {
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

@media (max-width: 768px) {
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

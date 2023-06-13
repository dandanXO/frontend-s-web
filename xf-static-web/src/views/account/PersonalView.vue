<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">个人资料</span>
    </div>
    <div class="personal-container">
    <!-- <div
      class="account-title-container"
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <el-button
        class="a-common-btn"
        v-if="
          !isEdit &&
          (!personalState.memberInfo.realName ||
            !personalState.memberInfo.email ||
            !personalState.memberInfo.birthday ||
            !personalState.memberInfo.telephone)
        "
        @click="isEdit = !isEdit"
        style="padding: 10px; width: auto; font-size: 16px"
        >Edit</el-button
      >
      <el-button
        class="a-common-btn"
        v-if="isEdit"
        @click="updateState"
        style="padding: 10px; width: auto; font-size: 16px"
        >Submit</el-button
      >
    </div> -->
      <el-form ref="updateFormRef" :model="updateFormDetails">
        <div class="personal-wrapper">
          <div class="basic-info">
            <div class="basic-info-table">
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  昵称
                </div>
                <div
                  v-if="personalState.memberInfo.loginName"
                  class="basic-info-cell content"
                >
                  {{ personalState.memberInfo.loginName }}
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  名字
                </div>
                <div
                  v-if="personalState.memberInfo.realName"
                  class="basic-info-cell content"
                >
                  {{ personalState.memberInfo.realName }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="realName"
                      :rules="[
                        { required: true, message: '请输入真实姓名' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.realName"
                        placeholder="真实姓名"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  生日
                </div>
                <div
                  v-if="personalState.memberInfo.birthday"
                  class="basic-info-cell content"
                >
                  {{ personalState.memberInfo.birthday }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="birthday"
                      :rules="[{ required: true, message: '请完善生日信息' }]"
                    >
                      <el-date-picker
                        v-model="updateFormDetails.birthday"
                        value-format="YYYY-MM-DD"
                        placeholder="生日"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  电话
                </div>
                <div
                  v-if="personalState.memberInfo.telephone"
                  class="basic-info-cell content"
                >
                  {{ personalState.memberInfo.telephone }}
                </div>

                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="phone"
                      :rules="[
                        { required: true, message: 'Please key in phone number' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.phone"
                        placeholder="Phone Number"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  邮箱
                </div>
                <div
                  v-if="personalState.memberInfo.email"
                  class="basic-info-cell content"
                >
                  {{ personalState.memberInfo.email }}
                </div>
                <div v-else class="basic-info-cell content">
                  <div class="datewsend" v-if="isEdit">
                    <el-form-item
                      name="email"
                      :rules="[
                        { required: true, message: '请输入邮箱地址' },
                        { type: 'email', message: '邮箱地址格式错误' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.email"
                        placeholder="邮箱"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>

                <el-button
                  class="common-btn"
                  v-if="isEdit"
                  @click="updateState"
                  >提交</el-button
                >

              <el-button
                class="common-btn"
                v-if="
                  !isEdit &&
                  (!personalState.memberInfo.realName ||
                    !personalState.memberInfo.email ||
                    !personalState.memberInfo.birthday ||
                    !personalState.memberInfo.telephone)
                "
                @click="isEdit = !isEdit"
                >Edit</el-button
              >
            </div>
          </div>
          <div class="buttons">
            <el-button size="large"
              class="common-btn light"
              @click="updatePwdModal"
            >
              修改密码
            </el-button>
            <el-button size="large"
              class="common-btn"
              v-if="!personalState.memberInfo.emailVerified"
              type="button"
              @click="updateSecurityModal"
            >
              安全验证
            </el-button>
          </div>
        </div>
          <div class="account-tip-text">
            <el-icon>
            <InfoFilled style="font-size: 15px; line-height: 20px;" />
            </el-icon>
            <div class="link">
            如果您需要修改个人资料，请您联系我们的
            <a
              @click.stop.prevent="
                openWindow(
                  `https://csweb01.amv4xjcbd.com/?partnerId=6&lang=en-US&way=${regDevice}&token=${store.token}`,
                  'Chat Server',
                  350,
                  650,
                )
              "
            >
              在线客服
            </a>
            </div>
          </div>
      </el-form>
    </div>
    <el-dialog
      v-model="updatePwdModalVisible"
      :footer="null"
      width="500px"
      title="修改密码"
      align-center
    >
      <el-form
        ref="updatePwdFormRef"
        :hideRequiredMark="true"
        :model="updatePwdInfo"
        :rules="updatePwdRules"
      >
        <el-form-item ref="oldPassword" name="oldPassword">
          <el-input
            type="password"
            v-model="updatePwdInfo.oldPassword"
            :placeholder="'account.personal.oldPwd'"
          />
        </el-form-item>
        <el-form-item ref="password" name="password">
          <el-input
            type="password"
            v-model="updatePwdInfo.password"
            :placeholder="'login.password'"
          />
        </el-form-item>
        <el-form-item class="txt-center">
          <button
            class="txt-center submit-btn common-btn"
            type="submit"
            @click="submitUpdatePwd"
          >
            {{ "common.confirm" }}
          </button>
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
    >
      <el-form
        ref="updateSecurityFormRef"
        :hideRequiredMark="true"
        :model="updateSecurityVerified"
        :rules="updateSecurityVerifiedRules"
      >
        <el-form-item ref="emailAddress" name="emailAddress">
          <el-input
            v-model="updateSecurityVerified.emailAddress"
            placeholder="Email Address"
          />
        </el-form-item>
        <el-form-item
          class="half"
          ref="verificationCode"
          name="verificationCode"
        >
          <el-input
            type="password"
            v-model="updateSecurityVerified.verificationCode"
            :placeholder="'login.validCode'"
          />
          <span
            class="common-btn verification-btn"
            @click="openVerificationModal"
            >{{ "account.personal.getValidCode" }}
          </span>
        </el-form-item>
        <span class="common-btn verification-btn" @click="submitUpdateSecurity"
          >{{ "account.personal.submitValid" }}
        </span>
      </el-form>
    </el-dialog>
    <el-dialog
      wrap-class-name="securityModal"
      v-model="verificationModalVisible"
      title="Verify Captcha Code"
      width="500px"
    >
      <el-form :model="updateSecurityVerified">
        <el-form-item ref="captchaCode" name="captchaCode">
          <el-input
            @keypress.enter="verifyVerificationCode"
            v-model="updateSecurityVerified.captchaCode"
            :maxlength="4"
            placeholder="Captcha Code"
          >
          </el-input>
          <div class="verification" @click="getCode()">
            <img :src="verificationImg" />
          </div>
        </el-form-item>
      </el-form>
      <el-button
        class="a-common-btn"
        @click="verifyVerificationCode"
        :loading="isEmailSending"
        >Verify</el-button
      >
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
  verifyEmail
} from "@/api/personal/personal";
import { getVerificationCode } from "@/api/index/login";
import moment from "moment";

export default defineComponent({
  name: "PersonalView",
  components: {
    InfoFilled
  },
  setup() {
    const isEmailSending = ref(false)
    const verificationDetails = reactive({
      memberInfo: {}
    });
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });

    onMounted(() => {
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
      getVerificationCode().then((res) => {
        if (res.code === 0) {
          verificationImg.value = "data:image/png;base64," + res.data.img;
          updateSecurityVerified.codeId = res.data.id;
        }
      }).catch(() => {
          // console.log(e.message);
        // message.error(e.message);
      });
    };
    const updateSecurityModalVisible = ref(false);
    const updateSecurityFormRef = ref();
    const updateSecurityVerified = reactive({
      mobileNumber: "",
      verificationCode: ""
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
      sendEmail(emailDetails).then((res) => {
        if ( res.code === 0) {
          verificationDetails.memberInfo.codeId = res.data.codeId
          verificationModalVisible.value = false;
          // message.success("Success")

          ElMessage({
            message: 'Success',
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
    }
    const submitUpdateSecurity = () => {
      updateSecurityFormRef.value
        .validate()
        .then(() => {
          verificationDetails.memberInfo.code = updateSecurityVerified.verificationCode
          verifyEmail(verificationDetails.memberInfo).then((res) => {
            if (res.code === 0) {
              // message.success("Success");
              ElMessage({
                message: 'Success',
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
    };

    const updateSecurityVerifiedRules = {
      emailAddress: [
        {
          required: true,
          message: "Email is required",
          trigger: "blur",
        },
        {
          type: "email",
          message: "Email address is not valid",
          trigger: "blur",
        },
      ],
      verificationCode: [
        {
          required: true,
          message: "Verification code is required",
          trigger: "blur",
        },
        {
          min: 4,
          message: "Length should be 4",
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
                message: 'Success',
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
          message: "old password is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be 6 to 12",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "password is required",
          trigger: "blur"
        },
        {
          min: 6,
          max: 12,
          message: "Length should be 6 to 12",
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
                message: 'Successfully updated',
                type: 'success',
              })
              loadInfo();
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
      verificationImg,
      getCode,
      verifyVerificationCode,
      isEmailSending,
      updateFormRef,
      store,
      regDevice,
      openWindow
    };
  }
});
</script>

<style scoped lang="scss">
.personal-container {
    background-color: #232833;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
    border-radius: 2px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    margin: 0 auto;
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

</style>

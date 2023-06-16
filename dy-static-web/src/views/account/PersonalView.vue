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
                      prop="realName"
                      :rules="[
                        { required: true, message: '请输入名字' },
                      ]"
                    >
                      <el-input
                        v-model="updateFormDetails.realName"
                        placeholder="名字"
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
                      prop="birthday"
                      :rules="[{ required: true, message: '请输入生日' }]"
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
          <div class="account-tip-text red">
            <el-icon>
            <InfoFilled style="font-size: 15px; line-height: 20px;" />
            </el-icon>
            <div class="link">
            如果您需要修改个人资料，请您联系我们的
            <a
              @click.stop.prevent="
                openWindow(
                  `https://csweb01.v6kthwlug.com/?partnerId=3&lang=zh-CN&way=${regDevice}&token=${store.token}`,
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
        <el-form-item ref="oldPassword" name="oldPassword" prop="oldPassword">
          <el-input
            type="password"
            v-model="updatePwdInfo.oldPassword"
            :placeholder="'旧密码'"
          />
        </el-form-item>
        <el-form-item ref="password" name="password" prop="password">
          <el-input
            type="password"
            v-model="updatePwdInfo.password"
            :placeholder="'新密码'"
          />
        </el-form-item>
        <el-form-item class="txt-center">
          <el-button
            class="txt-center submit-btn common-btn"
            type="submit"
            @click="submitUpdatePwd"
          >
            提交
          </el-button>
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
        <el-form-item ref="emailAddress" prop="emailAddress">
          <el-input
            v-model="updateSecurityVerified.emailAddress"
            placeholder="邮箱"
          />
        </el-form-item>
        <el-form-item
          class="half"
          ref="verificationCode"
          prop="verificationCode"
        >
        <el-space>
              <el-input
                type="password"
                v-model="updateSecurityVerified.verificationCode"
                :placeholder="'验证码'"
              />
              <el-button
                size="small"
                class="common-btn verification-btn"
                @click="openVerificationModal"
                >发送验证码
              </el-button>
            </el-space>
        </el-form-item>
        <el-button class="common-btn verification-btn" @click="submitUpdateSecurity"
          >提交
        </el-button>
      </el-form>
    </el-dialog>
    <el-dialog
      wrap-class-name="securityModal"
      v-model="verificationModalVisible"
      title="验证码"
      width="500px"
    >
      <el-form ref="captchaUpdateRef" :model="updateSecurityVerified">
        <el-form-item ref="captchaCode" prop="captchaCode" :rules="[
                        { required: true, message: '请输入验证码' },
                      ]">
                      <el-space>
              <el-input
                @keypress.enter="verifyVerificationCode"
                v-model="updateSecurityVerified.captchaCode"
                :maxlength="4"
                placeholder="验证码"
              />

              <div class="verification" @click="getCode()">
            <img style="width: 80%; margin-top: 6px;" :src="verificationImg" />
          </div>
        </el-space>
        </el-form-item>
      </el-form>
      <el-button
        class="common-btn"
        @click="verifyVerificationCode"
        :loading="isEmailSending"
        >验证</el-button
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
    const captchaUpdateRef = ref();
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
      
    })
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
                message: '提交成功',
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
      openWindow,
      captchaUpdateRef
    };
  }
});
</script>

<style scoped lang="scss">
.personal-container {
    border-radius: 3px;
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
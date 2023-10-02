<template>

  <div class="main-section">
    <div class="personal-wrapper">

      <div class="personal-section">

        <div class="personal-top-tabs">
          <div class="top-tab-btn btn-pointer"
               :class="(select_menu === 'personal') ? 'is-active' : ''"
               @click="selectTab('personal')"
          >
            ข้อมูลพื้นฐาน
          </div>
          <div class="top-tab-btn btn-pointer"
               :class="(select_menu === 'password') ? 'is-active' : ''"
               @click="selectTab('password')"
          >
            เปลี่ยนรหัสผ่าน
          </div>
          <div class="top-tab-btn btn-pointer"
               :class="(select_menu === 'bank') ? 'is-active' : ''"
               @click="selectTab('bank')"
          >
            บัญชีถอนเงิน
          </div>
          <div class="top-tab-btn btn-pointer"
               :class="(select_menu === 'verify') ? 'is-active' : ''"
               @click="selectTab('verify')"
          >
            ตรวจสอบความปลอดภัย
          </div>
        </div>


      </div>


      <div class="personal-container"
           v-if="select_menu==='personal'"
      >
        <!--        <q-form>-->
        <!--          <div class="name-email">-->
        <!--            <div class="top-right">-->
        <!--              <RiEditLine style="width: 20px; fill:#ffffff;"-->
        <!--                          v-if="!isEdit && (!personalState.memberInfo.realName || !personalState.memberInfo.name2 || !personalState.memberInfo.email || !personalState.memberInfo.birthday || !personalState.memberInfo.telephone)"-->
        <!--                          @click="isEdit = !isEdit"-->
        <!--              />-->
        <!--              <span v-if="isEdit">-->
        <!--            <q-btn outline @click="updateState">ยืนยัน</q-btn>-->
        <!--          </span>-->
        <!--            </div>-->
        <!--            <div v-if="personalState.memberInfo.profilePicture" class="info-picture"><img-->
        <!--                :src="personalState.memberInfo.profilePicture"></div>-->
        <!--            <div class="info-name"><span v-if="!personalState.memberInfo.displayName">{{-->
        <!--                personalState.memberInfo.nickName-->
        <!--              }}</span><span v-if="personalState.memberInfo.displayName">{{-->
        <!--                personalState.memberInfo.displayName-->
        <!--              }} ({{ personalState.memberInfo.nickName }})</span></div>-->
        <!--            <div class="info-email" v-if="personalState.memberInfo.email">-->
        <!--              {{ personalState.memberInfo.email }}-->
        <!--              <q-icon size="xs" color="white" name="mark_email_read" v-if="personalState.memberInfo.emailVerified"/>-->
        <!--            </div>-->
        <!--            <div v-if="isEdit && !personalState.memberInfo.email">-->
        <!--              <q-input-->
        <!--                  class="whiteError"-->
        <!--                  ref="emailRef"-->
        <!--                  filled-->
        <!--                  color="white"-->
        <!--                  v-model="formDetail.email"-->
        <!--                  placeholder="อีเมลล์"-->
        <!--                  :rules="[-->
        <!--              (val) => (val && val.length > 0) || 'กรุณาใส่ที่อยู่อีเมลล์'-->
        <!--            ]"-->
        <!--              >-->
        <!--              </q-input>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </q-form>-->
        <div class="other-info">
          <div class="account-content basic-info">
            <div class="basic-info-table">
              <div class="tbl-row">
                <div class="basic-info-cell title">
                  <RiFileUserLine/>
                  ชื่อ
                </div>
                <div
                    class="basic-info-cell content"
                    v-if="personalState.memberInfo.nickName"
                >
                  {{
                    personalState.memberInfo.nickName
                  }}
                </div>
                <div v-if="isEdit && !personalState.memberInfo.nickName">
                  <q-input
                      ref="realNameRef"
                      color="white"
                      filled
                      v-model="formDetail.nickName"
                      placeholder="ชื่อ"
                      :rules="[
                    (val) => (val && val.length > 0) || 'ชื่อ-นามสกุล'
                  ]"
                  >
                  </q-input>
                </div>
              </div>


              <div class="tbl-row">
                <div class="basic-info-cell title">
                  <RiFileUserLine/>
                  ชื่อ
                </div>
                <div
                    class="basic-info-cell content"
                    v-if="personalState.memberInfo.realName"
                >
                  {{ personalState.memberInfo.realName }}
                </div>

                <div
                    class="basic-info-cell content flex items-center edit-div btn-pointer"
                    v-if="!personalState.memberInfo.realName && isEdit == false"
                    @click="isEdit=!isEdit;"
                >
                  <span>แก้ไข</span><RiEditBoxLine />
                </div>


                <div v-if="isEdit && !personalState.memberInfo.realName">
                  <q-input
                      ref="realNameRef"
                      color="white"
                      filled
                      v-model="formDetail.realName"
                      placeholder="ชื่อ"
                      :rules="[
                    (val) => (val && val.length > 0) || 'ชื่อ-นามสกุล'
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
                  <RiFileUserLine/>
                  ชื่อภาษาอังกฤษ
                </div>
                <div
                    class="basic-info-cell content"
                    v-if="personalState.memberInfo.name2"
                >
                  {{ personalState.memberInfo.name2 }}
                </div>
                <div
                    class="basic-info-cell content flex items-center edit-div btn-pointer"
                    v-if="!personalState.memberInfo.name2 && isEdit == false"
                    @click="isEdit=!isEdit;"
                >
                  <span>แก้ไข</span><RiEditBoxLine />
                </div>

                <div v-if="isEdit && !personalState.memberInfo.name2">
                  <q-input
                      ref="name2Ref"
                      color="white"
                      filled
                      v-model="formDetail.name2"
                      placeholder="ชื่อภาษาอังกฤษ"
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
                  <RiCake2Line/>
                  วันเกิด
                </div>
                <div
                    class="basic-info-cell content"
                    v-if="personalState.memberInfo.birthday "
                >
                  {{ (moment(personalState.memberInfo.birthday).format("DD-MM-YYYY")) }}
                </div>
                <div
                    class="basic-info-cell content flex items-center edit-div btn-pointer"
                    v-if="!personalState.memberInfo.birthday && isEdit == false"
                    @click="isEdit=!isEdit;"
                >
                  <span>แก้ไข</span><RiEditBoxLine />
                </div>

                <div v-if="isEdit && !personalState.memberInfo.birthday">
                  <q-input ref="birthdayRef" filled v-model="formDetail.birthday" placeholder="วันเกิด"
                           :rules="[
                    (val) => (val && val.length > 0) || 'กรุณายืนยันวันเกิด'
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
                  <RiSmartphoneLine/>
                  เบอร์โทรศัพท์
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
                      placeholder="เบอร์โทรศัพท์"
                      :rules="[
                    (val) => (val && val.length > 0) || 'กรุณายืนยันเบอร์โทรศัพท์',
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

            <div v-if="isEdit" class="flex items-center justify-center">
              <q-btn color="brand" class="login-btn common-large-btn" @click="updateState">ยืนยัน</q-btn>
            </div>
          </div>
          <div class="account-tip danger">
            หากต้องการเปลี่ยนแปลงข้อมูลส่วนบุคคล กรุณาติดต่อลูกค้าสัมพันธ์หรือ
            <router-link to="/liveChat">ไลฟ์แชท</router-link>
          </div>
          <!--          <div class="buttons">-->
          <!--            <q-btn-->
          <!--                class="full-width"-->
          <!--                label=" เปลี่ยนรหัสผ่าน "-->
          <!--                type="submit"-->
          <!--                color="brand"-->
          <!--                @click="updatePwdModal"-->
          <!--            />-->
          <!--            <q-btn v-if="!personalState.memberInfo.emailVerified"-->
          <!--                   class="full-width"-->
          <!--                   label=" ตรวจสอบความปลอดภัย "-->
          <!--                   type="submit"-->
          <!--                   color="brand"-->
          <!--                   @click="updateSecurityModal"-->
          <!--            />-->
          <!--          </div>-->
        </div>
      </div>

      <div class="personal-container"
           v-if="select_menu==='password'"
      >
        <q-form class="q-gutter-sm form-changepass">
          <q-input
              ref="oldPasswordRef"
              type="password"
              filled
              v-model="updatePwdInfo.oldPassword"
              label="รหัสผ่านเดิม"
              stack-label
              :rules="oldPwdRules"
              clearable
          />
          <q-input
              ref="passwordRef"
              type="password"
              filled
              v-model="updatePwdInfo.password"
              label="รหัสผ่าน"
              :rules="pwdRules"
              clearable
              class="q-mb-lg"
              stack-label
              hint="ขึ้นอยู่ที่ระหว่าง 6-16 ตัวอักษรและจำเป็นต้องมีการผสมของตัวอักษรและตัวเลข"
          />

          <q-input
              ref="confirmRef"
              type="password"
              filled
              v-model="updatePwdInfo.confirm_pass"
              label="ยืนยันรหัสผ่านใหม่"
              :rules="pwdRules"
              clearable
              stack-label
          />
          <div class="flex flex-center gap-10">
            <q-btn class="common-large-btn" label="ยืนยัน" color="brand" @click="submitUpdatePwd"/>
            <q-btn class="common-large-btn close-btn" label="ยกเลิก" v-close-popup/>
          </div>
        </q-form>
      </div>


      <div class="personal-container"
           v-if="select_menu==='verify'"
      >
        <q-form class="q-gutter-sm q-mt-lg form-verification">
          <q-input
              ref="emailAddressRef"
              v-model="updateSecurityVerified.emailAddress"
              label="อีเมลล์"
              stack-label
              clearable
              filled
          />
          <div class="half">
            <q-input
                ref="verificationCodeRef"
                type="password"
                v-model="updateSecurityVerified.verificationCode"
                placeholder="รหัสยืนยัน"
                label="อีเมลล์"
                stack-label
                clearable
                filled
            />
            <q-btn class="common-large-btn third-btn" label="รับรหัสยืนยัน" @click="openVerificationModal"/>
          </div>
          <div class="flex flex-center gap-10 q-mt-md">
            <q-btn label="ยืนยัน" class="common-large-btn" color="brand" @click="submitUpdateSecurity"/>
          </div>
        </q-form>
      </div>

      <q-dialog
          v-model="verificationModalVisible"
          transition-show="slide-up"
          transition-hide="slide-down"
      >
        <q-card class="q-pa-md">
          <div class="modal-head-title q-pb-md">ตรวจสอบรหัสแคปต์ชา</div>
          <q-form class="q-gutter-sm">
            <q-input
                ref="captchaCodeRef"
                filled
                type="text"
                v-model="updateSecurityVerified.captchaCode"
                label="รหัสยืนยัน"
                :rules="[
              (val) => (val && val.length > 3) || 'ใส่รหัสยืนยัน'
            ]"
                color="white"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode()"/>
              </template>
              <template v-slot:prepend>
                <q-icon name="security"/>
              </template>
            </q-input>
            <q-btn
                :disabled="isEmailSending"
                :style="isEmailSending ? 'opacity: .6' : ''"
                class="common-btn verification-btn"
                @click.prevent="verifyVerificationCode"
            >
              {{ isEmailSending ? 'กำลังตรวจสอบ' : 'ปุ่มยืนยัน' }}
            </q-btn>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent, reactive, ref, onMounted} from "vue";
import {
  RiSpamLine, RiLink, RiLinkUnlink, RiEditBoxLine, RiFileUserLine, RiCake2Line, RiSmartphoneLine, RiEditLine

} from "vue-remix-icons";
// import {
//   loadMemberInfo,
//   changePwd,
// } from "@/api/personal/personal";
import moment from "moment";
import {api} from "boot/axios"
import {useQuasar} from "quasar"
import {userStore} from "src/stores"


export default defineComponent({
  name: "PersonalView",
  components: {
    // RiSpamLine,
    // RiLink,
    // RiLinkUnlink,
    RiFileUserLine,
    RiCake2Line,
    RiSmartphoneLine,
    RiEditBoxLine,
    // RiEditLine
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

    const isValidPhone = () => {
      const phonePattern = /^\d+$/;
      return phonePattern.test(formDetail.value.phone) || "อนุญาตเฉพาะตัวเลขเท่านั้น";
    };
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
      const emailDetails = {
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
            message: "รหัส OTP ถูกส่งไปยังอีเมล์ของคุณแล้ว",
            icon: "check_circle_outline"
          });
          verificationDetails.memberInfo.codeId = ret.data.codeId
          verificationModalVisible.value = false;
          isEmailSending.value = false
        } else {
          getCode()
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
            message: "ยืนยันสำเร็จ",
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
      password: "",
      confirm_pass: ""
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
        api.post("/session/password", qs.stringify({
          oldPassword: updatePwdInfo.oldPassword,
          password: updatePwdInfo.password
        })).then((res) => {
          const response = res.data
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "อัพเดทพาสเวิดเรียบร้อยแล้ว",
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
    const isEditEmail = ref(false)
    const isEditPhone = ref(false)
    const isEditBirthday = ref(false)
    const isEdit = ref(false)
    const emailRef = ref()
    const realNameRef = ref()
    const name2Ref = ref()
    const birthdayRef = ref()
    const phoneRef = ref()
    const formDetail = ref([{}])

    const select_menu = ref('personal');
    const selectTab = (tab) => {
      select_menu.value = tab;
    }
    const updateState = () => {
      const updateInfo = formDetail.value
      // if (!personalState.memberInfo.email) {
      //   emailRef.value.validate()
      //   if (emailRef.value.hasError) {
      //     return
      //   }
      // }
      if (!personalState.memberInfo.realName) {
        realNameRef.value.validate()
        if (realNameRef.value.hasError) {
          return
        }
      }
      // if (!personalState.memberInfo.birthday) {
      //   birthdayRef.value.validate()
      //   if (birthdayRef.value.hasError) {
      //     return
      //   }
      // }
      // if (!personalState.memberInfo.telephone) {
      //   phoneRef.value.validate()
      //   if (phoneRef.value.hasError) {
      //     return
      //   }
      // }
      if (!personalState.memberInfo.name2 && !updateInfo.name2) {
        updateInfo.name2 = null;
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
          isEdit.value = false;
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
        val => (val && val.length > 0) || 'กรุณารหัสผ่านเดิม',
        val => (val.length > 5 && val.length < 12) || 'ความยาวควรเป็น 6 ถึง 12 ตัว'
      ],
      pwdRules: [
        val => (val && val.length > 0) || 'ใส่รหัสผ่าน',
        val => (val.length > 5 && val.length < 12) || 'ความยาวควรเป็น 6 ถึง 12 ตัว'
      ],
      isEditRealName,
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
      name2Ref,
      birthdayRef,
      phoneRef,
      moment,
      isValidPhone,
      selectTab,
      select_menu
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

:deep(.q-field--filled .q-field__control) {
  border-radius: 10px;
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
    font-size: $md-size;

    svg {
      fill: #ffffff;
      width: 20px;
      display: inline-block;
      vertical-align: middle;
    }

    .edit-div{
      color: $lightblue-color;

      svg{
        fill: $lightblue-color;
      }
    }
  }

  .basic-info-cell {
    &.title {
      width: 150px;
    }
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
  flex-direction: column;


  .account-tip {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    margin: 35px 0;

    a {
      color: #db7e42;
    }
  }

}

.personal-section {
  width: 100%;
}

.personal-top-tabs {
  margin: 15px auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  column-gap: 25px;
  align-items: center;
  justify-content: center;
  width: calc(100% - 20px);

  .top-tab-btn {
    background: $main-color;
    border-radius: 10px;
    height: auto;
    width: 100%;
    aspect-ratio: 200/45;
    max-width: 300px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    margin: 0 auto;

    &.is-active {
      background: $linear-bg-2;
    }

  }

}

.personal-container {
  width: calc(100% - 24px);
  max-width: 650px;
  margin: 0 auto;

}

.common-large-btn {
  border-radius: 20px;
}

.form-changepass {
  margin-top: 15px;
}


@media (max-width: 768px) {

  .personal-wrapper {
    .buttons {
      flex-direction: column;
    }
  }

  .account-container {
    .basic-info-table {
      grid-template-columns: 1fr;
    }

    .account-content-wrapper {

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


</style>

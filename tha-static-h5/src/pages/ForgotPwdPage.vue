<template>

  <div class="main-section">

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <div class="white q-px-md">
          {{ $t('lang.receive_by_phone') }}
        </div>
        <q-card>
          <q-form v-if="!isEmailSent" class="q-gutter-y-md rounded-borders q-pa-md q-ma-md">
            <q-input
                ref="loginNameRef"
                filled
                v-model="passwordForm.loginName"
                :label="$t('lang.input_username')"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || $t('lang.input_username_cannot_empty')
                ]"
                color="white"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline"/>
              </template>
            </q-input>
            <!-- <q-input
                ref="emailRef"
                type="email"
                filled
                v-model="passwordForm.email"
                :label="$t('lang.email_address')"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || $t('lang.enter_your_email'),
                  isValidEmail
                ]"
                color="white"
            >
              <template v-slot:prepend>
                <q-icon name="mail_outline"/>
              </template>
            </q-input> -->

            <q-input
                ref="phoneRef"
                filled
                v-model="passwordForm.phone"
                :label="$t('lang.phone_number')"
                lazy-rules
                :rules="[
                (val) => (val && val.length > 0) || $t('lang.please_confirm_phone_number'),
                (val) => (val && val.length > 7) || $t('lang.please_enter_valid_phone'),
                isValidPhone
              ]"
                color="white"
                clearable
            >
              <template v-slot:prepend>
                <q-icon name="smartphone"/>
              </template>
            </q-input>

            <q-input
                ref="ftCaptchaRef"
                filled
                type="text"
                v-model="passwordForm.captchaCode"
                :label="$t('lang.verification_code')"
                lazy-rules
                color="white"
                :rules="[
                  (val) =>
                    (val && val.length > 3) ||
                    $t('lang.input_code_empty')
                ]"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode()"/>
              </template>
              <template v-slot:prepend>
                <q-icon name="security"/>
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-btn
                  @click.prevent="onSubmitForgotPwd"
                  :label="$t('lang.send')"
                  type="submit"
                  color="brand"
                  class="common-btn"
                  rounded
                  size="md"
              />
            </div>
          </q-form>

          <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md">
            <p>{{ $t('lang.an_otp_has_been_sent_to_email') }}</p>
            <q-input
                ref="codeRef"
                filled
                v-model="verificationForm.code"
                :label="$t('lang.one_time_otp')"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || $t('lang.otp_cannot_be_empty')
                ]"
                color="white"
            >
              <template v-slot:prepend>
                <q-icon name="qr_code"/>
              </template>
            </q-input>
            <q-input
                ref="newPwdRef"
                type="password"
                filled
                v-model="verificationForm.newPassword"
                :label="$t('lang.new_password')"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || $t('lang.enter_new_password')
                ]"
                color="white"
            >
              <template v-slot:prepend>
                <q-icon name="lock_open"/>
              </template>
            </q-input>
            <q-input
                ref="captchaRef"
                filled
                type="text"
                v-model="verificationForm.captchaCode"
                :label="$t('lang.captcha_code')"
                lazy-rules
                color="white"
                :rules="[
                  (val) =>
                    (val && val.length > 3) ||
                    $t('lang.enter_captcha_code')
                ]"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode()"/>
              </template>
              <template v-slot:prepend>
                <q-icon name="security"/>
              </template>
            </q-input>

            <div class="row justify-between items-center">
              <q-btn
                  @click.prevent="onVerifyForgotPassword"
                  :label="$t('lang.send')"
                  type="submit"
                  color="brand"
                  class="common-btn"
                  rounded
                  size="large"
              />
            </div>
          </q-form>
          <!-- <q-tabs
            v-model="activeTab"
            dense
            class="text-grey"
            active-color="brand"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="phone" label="รีเซ็ตรหัสผ่านด้วยเบอร์โทรศัพท์" />
            <q-tab name="email" label="รีเซ็ตรหัสผ่านด้วยอีเมลล์" />
            <q-tab name="retrieve" label="รับบัญชีทางอีเมลล์" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="phone">
              <q-form padding="none" class="q-gutter-y-md" @reset="onReset">
                <q-input
                  ref="loginNameRef"
                  filled
                  v-model="loginForm.loginName"
                  label="ชื่อล็อกอิน"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'ใส่ชื่อผู้ใช้'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="person_outline" />
                  </template>
                </q-input>

                <q-input
                  ref="telRef"
                  filled
                  v-model="loginForm.telephone"
                  label="เบอร์โทรศัพท์"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'กรุณายืนยันเบอร์โทรศัพท์',
                    (val) => (val && val.length > 7) || 'โปรดป้อนหมายเลขโทรศัพท์มือถือที่ถูกต้อง',
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                  </template>
                </q-input>
                <q-input
                  ref="verificationRef"
                  filled
                  type="text"
                  v-model="loginForm.captchaCode"
                  label="รหัสยืนยัน"
                  lazy-rules
                  color="white"
                  :rules="[
                    (val) =>
                      (val && val.length > 3) ||
                      'ใส่รหัสยืนยัน'
                  ]"
                >
                  <template v-slot:append>
                    <img :src="verificationImg" @click="getCode()" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="security" />
                  </template>
                </q-input>
                <q-input
                  ref="pwdRef"
                  filled
                  v-model="loginForm.password"
                  label="รหัสผ่านเดิม"
                  type="password"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'ต้องใช้รหัสผ่านเก่า'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>

                <q-input
                  ref="confirmPwdRef"
                  filled
                  type="password"
                  v-model="loginForm.confirmPwd"
                  label="ยืนยันรหัสผ่าน"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'กรุณายืนยันรหัสผ่าน',
                    (val) =>
                      val === loginForm.password || 'รหัสผ่านไม่เหมือนกัน'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>

                <div class="row justify-between items-center">
                  <q-btn
                    @click.prevent=""
                    label="ส่ง"
                    type="submit"
                    color="brand"
                  />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="email">
              <q-form class="q-gutter-y-md">
                <q-input
                  ref="loginNameRef"
                  filled
                  v-model="loginForm.loginName"
                  label="ชื่อล็อกอิน"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'ใส่ชื่อผู้ใช้'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="person_outline" />
                  </template>
                </q-input>

                <q-input
                  ref="emailRef"
                  type="email"
                  filled
                  v-model="loginForm.email"
                  label="อีเมลล์"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'กรุณาใส่ที่อยู่อีเมลล์',
                    isValidEmail
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail_outline" />
                  </template>
                </q-input>

                <q-input
                  ref="verificationRef"
                  filled
                  type="text"
                  v-model="loginForm.captchaCode"
                  label="รหัสยืนยัน"
                  lazy-rules
                  color="white"
                  :rules="[
                    (val) =>
                      (val && val.length > 3) ||
                      'ใส่รหัสยืนยัน'
                  ]"
                >
                  <template v-slot:append>
                    <img :src="verificationImg" @click="getCode()" />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="security" />
                  </template>
                </q-input>
                <q-input
                  ref="pwdRef"
                  filled
                  type="password"
                  v-model="loginForm.password"
                  label="รหัสผ่านเดิม"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'ต้องใช้รหัสผ่านเก่า'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>

                <q-input
                  ref="confirmPwdRef"
                  filled
                  type="password"
                  v-model="loginForm.confirmPwd"
                  label="ยืนยันรหัสผ่าน"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'กรุณายืนยันรหัสผ่าน',
                    (val) =>
                      val === loginForm.password || 'รหัสผ่านไม่เหมือนกัน'
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>
                <div class="row justify-between items-center">
                  <q-btn
                    @click.prevent="onSubmit"
                    label="ส่ง"
                    type="submit"
                    color="brand"
                  />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="retrieve">
              <q-form padding="none">
                <q-input
                  ref="emailRef"
                  type="email"
                  filled
                  v-model="loginForm.email"
                  label="อีเมลล์"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'กรุณาใส่ที่อยู่อีเมลล์',
                    isValidEmail
                  ]"
                  color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="mail_outline" />
                  </template>
                </q-input>

                <div class="row justify-between items-center">
                  <q-btn
                    @click.prevent="onSubmit"
                    label="ส่ง"
                    type="submit"
                    color="brand"
                  />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels> -->
        </q-card>
      </div>
    </div>

    <div class="text-center q-mb-md">
      <router-link class="forget-pwd-tip" to="/login">
        {{ $t('lang.return_to_login') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {api} from "boot/axios";
import {useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import {SessionStorage} from "quasar";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const {t} = useI18n();
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      loginName: "",
      // email: "",
      phone: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      // email: "",
      phone: "",
      code: "",
      codeId: SessionStorage.getItem('emailCodeId'),
      newPassword: "",
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
          .get("/member/verificationCode")
          .then((res) => {
            const response = res.data;
            if (response.code === 0) {
              verificationImg.value =
                  "data:image/png;base64," + response.data.img;
              passwordForm.codeId = response.data.id;
            }
          })
          .catch((e) => {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: e.message,
            //   icon: "report_problem"
            // });
          });
    };
    const loginNameRef = ref();
    const emailRef = ref();
    const phoneRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const $q = useQuasar();
    const isValidEmail = () => {
      const emailPattern =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || $t('lang.invalid_email');
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false)
    const isEmailSending = ref(false)
    const onSubmitForgotPwd = () => {
      loginNameRef.value.validate();
      // emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: t('lang.verifying')
      });
      if (
          loginNameRef.value.hasError ||
          // emailRef.value.hasError ||
          ftCaptchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        api
            .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                isEmailSent.value = true
                SessionStorage.set("emailCodeId", res.data.codeId);
              } else {
                // $q.notify({
                //   color: "negative",
                //   position: "top",
                //   message: res.message,
                //   icon: "report_problem"
                // });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
        getCode();
      }
    };
    const onVerifyForgotPassword = () => {
      codeRef.value.validate();
      newPwdRef.value.validate();
      captchaRef.value.validate();
      $q.loading.show({
        message: t('lang.verifying')
      });
      if (
          codeRef.value.hasError ||
          newPwdRef.value.hasError ||
          captchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        verificationForm.codeId = SessionStorage.getItem('emailCodeId')
        verificationForm.email = passwordForm.email
        api
            .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {

                // $q.notify({
                //   color: "positive",
                //   position: "top",
                //   message: "สำเร็จ",
                //   icon: "check_circle_outline"
                // });
                router.push("/login")
              } else {
                // $q.notify({
                //   color: "negative",
                //   position: "top",
                //   message: res.message,
                //   icon: "report_problem"
                // });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
        getCode();
      }
    };
    return {
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      phoneRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef
    };
  }
});
</script>

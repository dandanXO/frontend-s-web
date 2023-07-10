<template>
  <div class="page-header">
    <div class="page">{{ header }}</div>
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
            <q-form class="q-pa-md">
              <q-input
                ref="emailRef"
                type="email"
                filled
                v-model="loginForm.email"
                label="邮箱"
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
                  label="提交"
                  type="submit"
                  color="brand"
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
                  label="Submit"
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
                  label="Submit"
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
                  label="Submit"
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
      กลับสู่เข้าสู่ระบบ
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "LoginPage",
  setup() {
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: ""
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            loginForm.codeId = response.data.id;
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
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const $q = useQuasar();
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "อีเมลยังไม่มีการใช้งาน";
    };
    const route = useRoute();
    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: "注册中..."
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        emailRef.value.hasError ||
        verificationRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        (regForm.regDevice = Platform.is.mobile ? "H5" : "WEB"),
          api
            .post("/member/register", regForm)
            .then((response) => {
              if (response.code === 0) {
                router.push("/login");

                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "成功",
                  icon: "report_problem"
                });
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
      header: "ลืมผู้ใช้งาน & รหัสผ่าน",
      loginForm,
      loginNameRef,
      pwdRef,
      verificationRef,
      verificationImg,
      activeTab,
      getCode
    };
  }
});
</script>

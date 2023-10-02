<template>
<!--  <div class="page-header">-->
<!--    <div class="page">{{ header }}</div>-->
<!--  </div>-->
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
            <q-form class="q-pa-md">
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
                  rounded
                />
              </div>
            </q-form>

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
        .then((res) => {
          const response = res.data;
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
        message: "Registering"
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
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                router.push("/login");

                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "ลงทะเบียนสำเร็จ",
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

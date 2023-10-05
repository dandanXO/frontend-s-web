<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title underline">ร่วมสนุกกับเรา , เพิ่มสีสันให้กับชีวิตคุณ</div>
      <div class="game-title sub"><img :src="jolly88Logo"></div>
      <div class="affiliate-login">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
        >
          <el-form-item prop="userName">
            <el-input
              ref="userNameRef"
              v-model="loginForm.userName"
              :placeholder="'ชื่อบัญชี'"
              name="userName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-tooltip
            v-model="capsTooltip"
            content="แคปล๊อคเปิดอยู่"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="passwordRef"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="'รหัสผ่าน'"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
              />
            </el-form-item>
          </el-tooltip>
          <el-tooltip
            v-model="capsTooltip"
            content="แคปล๊อคเปิดอยู่"
            placement="right"
            manual
          >
            <el-form-item prop="confirmPwd">
              <el-input
                :key="passwordType"
                ref="confirmPwdRef"
                v-model="loginForm.confirmPwd"
                :type="passwordType"
                :placeholder="'ยืนยันรหัสผ่าน'"
                name="password"
                tabindex="3"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
              />
            </el-form-item>
          </el-tooltip>
          <el-form-item prop="telephone">
            <el-input
              ref="telephoneRef"
              v-model="loginForm.telephone"
              :placeholder="'เบอร์โทรศัพท์'"
              name="telephone"
              type="text"
              tabindex="4"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              ref="emailRef"
              v-model="loginForm.email"
              :placeholder="'อีเมล'"
              name="Email"
              type="text"
              tabindex="5"
              autocomplete="on"
            />
          </el-form-item>
          <!-- <el-form-item prop="birthday">
            <el-date-picker
              v-model="loginForm.birthday"
              type="date"
              :placeholder="'Birthday'"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              popper-class="custom-date-picker"
              :disabled-date="disabledDate"
            />
          </el-form-item> -->
          <el-form-item prop="captchaCode">
            <el-input
              ref="verificationRef"
              v-model="loginForm.captchaCode"
              :placeholder="'รหัสยืนยัน'"
              name="captchaCode"
              type="text"
              tabindex="7"
              autocomplete="on"
            >
              <template #append class="verification">
                <img :src="verificationImg" @click="getCode()">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="codeAffiliate">
            <el-input v-if="hasAffiliate"
                      ref="codeAffiliateRef"
                      v-model="loginForm.codeAffiliate"
                      :placeholder="'รหัสผู้แนะนำ'"
                      name="codeAffiliate"
                      type="text"
                      tabindex="8"
                      autocomplete="on"
                      :disabled="true"
            />
            <el-input v-if="!hasAffiliate"
                      ref="codeAffiliateRef"
                      v-model="loginForm.codeAffiliate"
                      :placeholder="'รหัสผู้แนะนำ'"
                      name="codeAffiliate"
                      type="text"
                      tabindex="8"
                      autocomplete="on"
            />
          </el-form-item>
          <el-button
            class="common-btn"
            :loading="loading"
            type="danger"
            style="width:100%;"
            @click.prevent="handleRegister"
          >
            สมัครสมาชิก
          </el-button>
          <router-link to="/th/login" class="signlog">สมัครแล้ว , เข้าระบบ</router-link>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  ref,
  nextTick,
  toRefs
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { UserActionTypes } from "@/store/modules/user/action-types";
import { getVerificationCode } from '../../../api/user';
import jolly88Logo from "@/assets/images/th/logo-jolly88.png";
import { ElNotification } from 'element-plus';

export default defineComponent({
  setup() {
    const getCode = () => {
      getVerificationCode()
        .then((res) => {
          if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            state.loginForm.codeId = res.data.id;
          }
        })
        .catch((e) => {
        });
    };
    const verificationImg = ref("");
    const userNameRef = ref(null);
    const passwordRef = ref(null);
    const confirmPwdRef = ref(null);
    const telephoneRef = ref(null);
    const emailRef = ref(null);
    // const birthdayRef = ref(null);
    const verificationRef = ref(null);
    const loginFormRef = ref(null);
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const hasAffiliate = ref(false)
    const state = reactive({
      loginForm: {
        userName: "",
        password: "",
        confirmPwd: "",
        telephone: "",
        email: "",
        captchaCode: "",
        regHost: location.hostname,
        codeId: "",
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: "ใส่ชื่อผู้ใช้",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "ควรมีพยัญชนะ 6-12 ตัว",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "ใส่รหัสผ่าน",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "ควรมีพยัญชนะ 6-12 ตัว",
            trigger: "blur",
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: "กรุณายืนยันรหัสผ่าน",
            trigger: "blur",
          },
        ],
        telephone: [
          {
            required: true,
            message: "กรุณายืนยันเบอร์โทรศัพท์",
            trigger: "blur",
          },
        ],
        // birthday: [
        //   {
        //     required: true,
        //     message: "Birthday is required",
        //     trigger: "blur",
        //   },
        // ],
        email: [
          {
            required: true,
            message: "ระบุอีเมลที่ใช้",
            trigger: "blur",
          },
          {
            type: "email",
            message: "อีเมลยังไม่มีการใช้งาน",
            trigger: "blur",
          },
          {
            max: 50,
            message: "ความยาวควรน้อยกว่า 50",
            trigger: "blur",
          },
        ],
        captchaCode: [
          {
            required: true,
            message: "ใส่รหัสยืนยัน",
            trigger: "blur",
          },
          {
            min: 4,
            max: 4,
            message: "ความยาวควรเป็น4",
            trigger: "change",
          },
        ],
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      capsTooltip: false,
      redirect: "",
      otherQuery: {},
    });
    function disabledDate(time) {
      return time.getTime() > new Date().getTime();
    }
    const methods = reactive({
      validatePasswordLength: (rule, value, callback) => {
        if (value.length < 6 || value.length > 12) {
          callback(new Error("รหัสผ่านควรมีพยัญชนะ 6-12 ตัว"));
        } else {
          callback();
        }
      },
      checkCapslock: (e) => {
        const { key } = e;
        state.capsTooltip =
          key !== null && key.length === 1 && key >= "A" && key <= "Z";
      },
      showPwd: () => {
        if (state.passwordType === "password") {
          state.passwordType = "";
        } else {
          state.passwordType = "password";
        }
        nextTick(() => {
          (passwordRef.value).focus();
        });
      },
      handleRegister: () => {
        state.loginForm.siteId = 3;
        (loginFormRef.value).validate(async (valid) => {
          if (valid) {
            state.loading = true;
            try {
              await store.dispatch(UserActionTypes.ACTION_REGISTER, state.loginForm);
              ElNotification({
                title: 'Success',
                message: "สำเร็จ",
                showClose: false,
                type: 'success'
              })
            } catch (e) {
              ElNotification({
                title: 'Error',
                message: e.message,
                showClose: false,
                type: 'error'
              })
              getCode()
              state.loading = false;
              return;
            }
            router.push({
              path: state.redirect || "/th/login",
              query: state.otherQuery
            }).catch(err => {
              console.warn(err);
            });
          }
        });
      }
    });

    function getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }

    watch(() => route.query, query => {
      if (query) {
        state.redirect = query.redirect?.toString() ?? "";
        state.otherQuery = getOtherQuery(query);
      }
    });

    onMounted(() => {
      if (route.query.agent) {
        hasAffiliate.value = true
        state.loginForm.codeAffiliate = route.query.agent
      } else {
        hasAffiliate.value = false
      }
      getCode();
      if (state.loginForm.userName === "") {
        userNameRef.value.focus();
      } else if (state.loginForm.password === "") {
        passwordRef.value.focus();
      }
    });

    return {
      userNameRef,
      passwordRef,
      confirmPwdRef,
      telephoneRef,
      emailRef,
      // birthdayRef,
      verificationRef,
      loginFormRef,
      verificationImg,
      disabledDate,
      jolly88Logo,
      ...toRefs(state),
      ...toRefs(methods),
      getCode,
      hasAffiliate,
    };
  }
});
</script>
<style lang="scss">

.custom-date-picker {
    background: #24222e;
    .el-date-picker table {
      color: #ffffff;
    }
    .el-date-table td.disabled div {
      background-color: #3b3b3b;
    }
    .el-date-picker__header {
      padding: 12px;
      background: #24222e;
      margin: 0;
      color: #ffffff;
    }
    .el-picker-panel__body {
      background: #24222e;
    }
    .el-date-picker__header-label, .el-picker-panel__icon-btn {
      color: #ffffff;
    }
}
</style>
<style scoped lang="scss">
.common-btn {
      font-family: Jura;
    transition: all .8s,color .3s .3s;
    min-width: 120px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background: linear-gradient(to right, #de4545, #db7e42);
    font-size: 18px;
    color: #000;
    border: 1px solid transparent;
    font-weight: 700;
    border-radius: 0;
    &:hover {
    color: linear-gradient(to right, #de4545, #db7e42);
    border: 1px solid #db7e42;
    background-color: transparent;
    }
}
:deep(.el-input, .el-date-editor.el-input, .el-date-editor.el-input__inner) {
  width: 100%;
}
:deep(.el-input.is-disabled .el-input__inner) {
  background: #3f3f43;
  color: #ffffff;
  border: 0;
}
:deep(.el-input__inner) {
  background: #24222e;
  color: #ffffff;
  border: 0;
}
:deep(.el-input-group__append) {
    background: #24222e;
    border: 0;
    padding-top: 5px;
}
.wrapper {
  background: url("../../../assets/images/my/main.jpg") no-repeat center top;
  background-size: cover;

  .affiliate {
    background: url("../../../assets/images/my/bg.png") no-repeat center top;
    margin: 0 auto;
    min-height: 100vh;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .game-title {
      font-family: trending;
      font-size: 36px;
      text-transform: uppercase;
      &.sub {
        font-size: 30px;
        font-weight: normal;
        font-family: Jura;
      }
      &.underline {
        background-image: linear-gradient(to right, #de4545, #db7e42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 40px;
        &:after {
          content: "";
          width: 60px;
          height: 5px;
          background: linear-gradient(to right, #de4545, #db7e42);
          display: block;
          margin: 5px auto;
        }
      }
    }
    .affiliate-login {
      width: 95%;
      max-width: 480px;
      margin: 30px;
      background-color: #15141b;
      border-radius: 10px;
      border: solid 1px #24222e;
      padding: 46px 50px;
      .signlog {
        font-family: Jura;
        font-size: 14px;
        color: #ffffff;
        display: block;
        margin: 10px auto;
        text-align: center;
      }
    }
  }
}
@media (max-width: 768px) {
  .wrapper {
    .affiliate {
      .game-title {
        &.underline {
          font-size: 25px;
        }
      }
      .description {
        flex-direction: column-reverse;
      }

      .steps {
        display: flex;
        flex-direction: column;
        background: unset;
        justify-content: center;
        gap: 10px;
        padding: 0;
        .step {
          display: flex;
          color: #ffffff;
          background: #1e1b2e;
          padding: 10px;
          gap: 25px;
          justify-content: space-evenly;
          align-items: center;
          .stepdesc {
            flex-direction: row;
            gap: 5px;
            flex: 3;
            justify-content: flex-start;
          }
          .game-title {
            font-family: Wave;
            color: #ffd200;
            flex: 1;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>

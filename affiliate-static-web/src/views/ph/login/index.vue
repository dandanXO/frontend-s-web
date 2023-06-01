<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title underline">Join Us! Enjoy your life!</div>
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
              :placeholder="'Username'"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="passwordRef"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="'Password'"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
          </el-tooltip>

          <el-button
            class="common-btn"
            :loading="loading"
            type="danger"
            style="width:100%;"
            @click.prevent="handleLogin"
          >
            Login
          </el-button>
          <router-link to="/ph/register" class="signlog">Not an affiliate yet? Register Now</router-link>
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
import jolly88Logo from "@/assets/images/th/logo-jolly88.png";

export default defineComponent({
  setup() {
    const userNameRef = ref(null);
    const passwordRef = ref(null);
    const loginFormRef = ref(null);
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      loginForm: {
        userName: "",
        password: ""
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: "User name is required",
            trigger: "blur",
          }
        ],
        password: [
          {
            required: true,
            message: "Password is required",
            trigger: "blur",
          }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      capsTooltip: false,
      redirect: "",
      otherQuery: {}
    });

    const methods = reactive({
      validatePasswordLength: (rule, value, callback) => {
        if (value.length < 6 || value.length > 12) {
          callback(new Error("The password cannot be less than 6 digits or more than 12 digits"));
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
      handleLogin: () => {
        state.loginForm.siteId = 5;
        (loginFormRef.value).validate(async (valid) => {
          if (valid) {
            state.loading = true;
            try {
              await store.dispatch(UserActionTypes.ACTION_LOGIN, state.loginForm);
            } catch (e) {
              console.error(e);
              state.loading = false;
              return;
            }
            router.push({
              path: state.redirect || "/",
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
      if (state.loginForm.userName === "") {
        userNameRef.value.focus();
      } else if (state.loginForm.password === "") {
        passwordRef.value.focus();
      }
    });

    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      jolly88Logo,
      ...toRefs(state),
      ...toRefs(methods)
    };
  }
});
</script>

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
    border: 1px solid linear-gradient(to right, #de4545, #db7e42);
    background-color: transparent;
    }
}
:deep(.el-input__inner) {
  background: #24222e;
  color: #ffffff;
  border: 0;
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
        background-clip: text;
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

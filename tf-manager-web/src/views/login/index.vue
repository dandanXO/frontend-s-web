<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          Login
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
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
          <span class="svg-container">
            <i class="el-icon-lock" />
          </span>
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
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon
              :name="passwordType === 'password' ? 'eye-off' : 'eye-on'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.prevent="handleLogin"
      >
        Login
      </el-button>
    </el-form>
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
import { isValidUsername } from "@/utils/validate";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { UserActionTypes } from "@/store/modules/user/action-types";

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
        username: [{ validator: userNameRef, trigger: "blur" }],
        password: [{ validator: passwordRef, trigger: "blur" }]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      capsTooltip: false,
      redirect: "",
      otherQuery: {}
    });

    const methods = reactive({
      validateUsername: (rule, value, callback) => {
        if (!isValidUsername(value)) {
          callback(new Error("Please enter the correct user name"));
        } else {
          callback();
        }
      },
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
      if (state.loginForm.username === "") {
        userNameRef.value.focus();
      } else if (state.loginForm.password === "") {
        passwordRef.value.focus();
      }
    });

    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      ...toRefs(state),
      ...toRefs(methods)
    };
  }
});
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }

    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  background-color: #2d3a4b;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  // background-color: $loginBg;
  video {
    position: absolute;
    /* Vertical and Horizontal center*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

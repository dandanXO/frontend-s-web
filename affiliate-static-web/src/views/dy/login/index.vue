<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title sub"><img :src="dyLogo"></div>
      <div class="affiliate-login">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="no-fill"
        >

          <el-form-item prop="userName">
            <el-input
              ref="userNameRef"
              v-model="loginForm.userName"
              :placeholder="'用户名'"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="no-fill"
            >
              <template style="background-color: #c9cfdd;" #prepend><i><img src="../../../assets/images/dy/icon_name.png"></i></template>
            </el-input>
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
                :placeholder="'密码'"
                name="password"
                tabindex="2"
                autocomplete="no-fill"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter="handleLogin"
              >
                <template style="background-color: #2144c6;" #prepend>
                  <i><img src="../../../assets/images/dy/icon_pwd.png"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-tooltip>

          <el-button
            class="common-btn"
            :loading="loading"
            type="danger"
            style="width:100%;"
            @click.prevent="handleLogin"
          >
            登录
          </el-button>
          <router-link to="/dy/register" class="signlog">申请账号</router-link>
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
import dyLogo from "@/assets/images/dy/logo.png";

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
            message: "请输入用户名",
            trigger: "blur",
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
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
          callback(new Error("密码长度为6-12"));
        } else {
          callback();
        }
      },
      checkCapslock: (e) => {
        const { key } = e;
        if (key) {
          state.capsTooltip =
            key !== null && key.length === 1 && key >= "A" && key <= "Z";
        }
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
      dyLogo,
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
    background-color: #3bafda;
    font-size: 14px;
    color: #ffffff;
    border: 1px solid transparent;
    border-radius: 0;
    opacity: .9;
    &:hover {
      opacity: 1;
    }
}
:deep(.el-input-group__prepend) {
    background-color: #c9cfdd;
    border: 0;
    padding: 0;
    border-radius: 0;
    width: 40px;
    height: 40px;
    i {
      display: flex;
      justify-content: center;
      img {
      }
    }
}
:deep(.el-input__inner) {
    background-color: #e1e3ef !important;
    color: #333333 !important;
  border: 0;
  border-radius: 0;
}
input:placeholder {
    color: #434343;
  }
.wrapper {
  background: url("../../../assets/images/dy/main.jpg") no-repeat center top;
  background-size: cover;

  .affiliate {
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
      // background-color: #15141b;
      // border-radius: 10px;
      // border: solid 1px #24222e;
      padding: 10px 50px;
      .el-form-item {
        margin-bottom: 30px;
      }
      :deep(.el-form-item__error) {
        padding-top: 10px;
      }
      .signlog {
        font-family: Jura;
        font-size: 14px;
        color: #3c7cf4;
        display: block;
        margin: 10px auto;
        text-align: right;
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

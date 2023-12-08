<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title sub"><img :src="xfLogo"></div>
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
              <template style="background-color: #2144c6;" #prepend><i><img src="../../../assets/images/xf/icon_name.png"></i></template>
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
                  <i><img src="../../../assets/images/xf/icon_pwd.png"></i>
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
          <router-link to="/xf/register" class="signlog">申请账号</router-link>
        </el-form>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showDialog"
    width="25%"
    @close="onCloseDialog"
    :title="'安全验证, 请依次点击：' + words.join(' , ')"
  >
    <template #header>
      test
    </template>
    <div style="display: flex; flex-direction: column; gap: 20px">
      <el-image
        v-loading="dialogLoading"
        style="cursor: pointer"
        id="imageRef"
        fit="contain"
        :src="img"
        @click="onClickImage"
      />
    </div>
    <div>
      <el-button
        type="info"
        icon="el-icon-refresh"
        style="margin-top: 20px;"
        @click="onGetImage()"
      >
        刷新
      </el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        style="margin-top: 20px;"
        @click="userLogin()"
        :disabled="coordinates.length === 0"
      >
        提交
      </el-button>
    </div>
  </el-dialog>
  <div v-for="(point, index) in coordinates" :key="index">
    <div
      class="image-number-point"
      :style="{left: point.displayLeft + 'px', top: point.displayTop + 'px'}"
      @click="onClickNumber(index)"
    >
      {{ index + 1 }}
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
import xfLogo from "@/assets/images/xf/logo.png";
import { getVerificationImage } from '@/api/verification'

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
        password: "",
        site: "XF1",
        key: '',
        coordinates: '',
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
      otherQuery: {},
      words: [],
      codeId: '',
      img: '',
      coordinates: [],
      dialogLoading: false,
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
        (loginFormRef.value).validate(async (valid) => {
          if (valid) {
            methods.onGetImage()
            state.showDialog = true
          }
        });
      },
      onFail: () => {
        methods.onGetImage()
        state.coordinates.splice(0)
      },
      onSuccess: async (times) => {
        router
          .push({
            path: state.redirect || '/',
            query: state.otherQuery,
          })
          .catch(err => {
            console.warn(err)
          })
      },
      onClickImage: e => {
        if (state.coordinates.length < 5) {
          var image = document.getElementById('imageRef')
          var x = e.pageX - image.getBoundingClientRect().x
          var y = e.pageY - image.getBoundingClientRect().y
          var storeX = x
          var storeY = y
          if (image.getBoundingClientRect().x !== 200) {
            storeX = (x / image.offsetWidth) * 200
            storeY = (y / image.offsetHeight) * 100
          }
          state.coordinates.push({
            displayLeft: image.getBoundingClientRect().x + x - 12,
            displayTop: image.getBoundingClientRect().y + y - 12,
            left: x,
            top: y,
            x: storeX,
            y: storeY,
          })
        }
      },
      onClickNumber: index => {
        state.coordinates.splice(index)
      },
      onCloseDialog: () => {
        state.coordinates.splice(0)
      },
      onScrollEvent: () => {
        if (state.showDialog) {
          var image = document.getElementById('imageRef')
          var imageX = image.getBoundingClientRect().x
          var imageY = image.getBoundingClientRect().y
          for (var i in state.coordinates) {
            state.coordinates[i].displayLeft =
              imageX + state.coordinates[i].left - 12
            state.coordinates[i].displayTop =
              imageY + state.coordinates[i].top - 12
          }
        }
      },
      userLogin: async () => {
        try {
          state.loginForm.key = state.codeId
          const coordinatesString = []
          for (let i = 0; i < state.coordinates.length; i++) {
            const obj = []
            obj.push(state.coordinates[i].x)
            obj.push(state.coordinates[i].y)
            coordinatesString.push(obj.join(','))
          }
          state.loginForm.coordinates = coordinatesString.join('-')
          await store.dispatch(UserActionTypes.ACTION_LOGIN, state.loginForm)
          state.loading = true
          methods.onSuccess()
        } catch (e) {
          if (e.message === '验证失败') {
            methods.onFail()
          } else {
            state.showDialog = false
          }
          state.loading = false
          return
        }
        methods.onSuccess()
      },
      onGetImage: async () => {
        state.dialogLoading = true
        state.coordinates.splice(0)
        const { data } = await getVerificationImage('DY2')
        Object.keys({ ...data.data }).forEach(field => {
          state[field] = data.data[field]
        })
        state.dialogLoading = false
      },
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
      var dialog = document.querySelector('.el-overlay-dialog')
      dialog.addEventListener('scroll', methods.onScrollEvent)
      window.addEventListener('resize', methods.onScrollEvent)
    });

    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      xfLogo,
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
    background-color: #2144c6;
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
    background-color: #2144c6;
    border: 0;
    padding: 0;
    border-radius: 0;
    i {
      display: flex;
      justify-content: center;
      img {
        height: 40px;
      }
    }
}
:deep(.el-input__inner) {
  background: #24222e;
  background-color: #353f4b;
  color: #ffffff;
  border: 0;
  border-radius: 0;
}
.wrapper {
  background: url("../../../assets/images/xf/main.jpg") no-repeat center top;
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
        color: #31b0bf;
        display: block;
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}

.image-number-point {
  position: absolute;
  width: 25px;
  height: 25px;
  border: 2px solid white;
  border-radius: 50%;
  background: #3f4eff;
  z-index: 9999;
  color: white;
  padding: 2px 6px;
  user-select: none;
  cursor: pointer;
}

:deep(.el-image__inner) {
  max-height: 100% !important;
  max-width: 100% !important;
}

:deep(.el-image) {
  margin-top: -30px;
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

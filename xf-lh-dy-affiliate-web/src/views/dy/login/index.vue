<template>
  <!-- <div class="wrapper">
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
              <template style="background-color: #2144c6;" #prepend>
                <i><img src="../../../assets/images/dy/icon_name.png"></i>
              </template>
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
  </div> -->
  <Swiper
    :key="swiperKey"
    :slides-per-view="1"
    :direction="'vertical'"
    :pagination="{clickable: true}"
    :mousewheel="true"
    :autoHeight="true"
  >
    <SwiperSlide>
      <div class="firstPage">
        <div class="inner">
          <div class="loginPage">
            <div class="left">
              <div class="logo">
                <img :src="dyLogo">
              </div>
              <div class="first-liner"><img src="../../../assets/images/login/first-liner.svg"></div>
              <div class="second-liner"><img src="../../../assets/images/login/second-liner.svg"></div>
            </div>
            <div class="right">
              <div class="bg">
                <div class="top"><div class="log">{{ isReg ? '注册' : '登录' }}</div>
                  <div class="topright"><span class="noaccabs">{{ isReg ? '已经有账号? ' : '没有帐户？' }}</span><a @click="isReg = !isReg" class="signlog">{{ isReg ? '请登录' : '立即注册' }}</a></div></div>
                <div class="mid">
                  <el-form
                    v-if="!isReg"
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
                          :placeholder="'密码'"
                          name="password"
                          tabindex="2"
                          autocomplete="no-fill"
                          @keyup="checkCapslock"
                          @blur="capsTooltip = false"
                          @keyup.enter="handleLogin"
                        />
                      </el-form-item>
                    </el-tooltip>

                    <el-button
                      class="common-btn"
                      type="danger"
                      style="width:100%;"
                      @click.prevent="handleLogin"
                    >
                      立即登录
                    </el-button>
                  </el-form>
                  <el-form
                    v-if="isReg"
                    ref="regFormRef"
                    :model="regForm"
                    :rules="regRules"
                    class="reg-form"
                    autocomplete="on"
                  >
                    <div v-if="step === 1">
                      <el-form-item prop="userName">
                        <el-input
                          ref="userNameRef"
                          v-model="regForm.userName"
                          :placeholder="'合营账户'"
                          name="userName"
                          type="text"
                          tabindex="1"
                          autocomplete="off"
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
                            v-model="regForm.password"
                            :type="passwordType"
                            :placeholder="'密码'"
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
                        content="Caps lock is On"
                        placement="right"
                        manual
                      >
                        <el-form-item prop="confirmPwd">
                          <el-input
                            :key="passwordType"
                            ref="confirmPwdRef"
                            v-model="regForm.confirmPwd"
                            :type="passwordType"
                            :placeholder="'密码确认'"
                            name="password"
                            tabindex="3"
                            autocomplete="on"
                            @keyup="checkCapslock"
                            @blur="capsTooltip = false"
                          />
                        </el-form-item>
                      </el-tooltip>
                      <el-button
                        class="common-btn"
                        :loading="loading"
                        type="danger"
                        style="width:100%;"
                        @click.prevent="handleRegister"
                      >
                        下一步
                      </el-button>
                    </div>
                    <div v-if="step === 2">
                      <el-form-item prop="realName">
                        <el-input
                          ref="realNameRef"
                          v-model="regForm.realName"
                          :placeholder="'姓名'"
                          name="realName"
                          type="text"
                          tabindex="4"
                          autocomplete="on"
                        />
                      </el-form-item>
                      <el-form-item prop="telephone">
                        <el-input
                          ref="telephoneRef"
                          v-model="regForm.telephone"
                          :placeholder="'手机号码'"
                          name="telephone"
                          type="text"
                          tabindex="4"
                          autocomplete="on"
                        />
                      </el-form-item>
                      <el-form-item prop="email">
                        <el-input
                          ref="emailRef"
                          v-model="regForm.email"
                          :placeholder="'邮箱'"
                          name="Email"
                          type="text"
                          tabindex="5"
                          autocomplete="on"
                        />
                      </el-form-item>
                      <!-- <el-form-item prop="birthday">
                        <el-date-picker
                          v-model="regForm.birthday"
                          type="date"
                          :placeholder="'生日'"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          popper-class="custom-date-picker"
                          :disabled-date="disabledDate"
                        />
                      </el-form-item> -->
                      <el-form-item prop="captchaCode">
                        <el-input
                          ref="verificationRef"
                          v-model="regForm.captchaCode"
                          :placeholder="'验证码'"
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
                      <!-- <el-form-item prop="codeAffiliate" v-if="!hasAffiliate">
                        <el-input v-if="hasAffiliate"
                                  ref="codeAffiliateRef"
                                  v-model="regForm.codeAffiliate"
                                  :placeholder="'代理码'"
                                  name="codeAffiliate"
                                  type="text"
                                  tabindex="8"
                                  autocomplete="on"
                                  :disabled="true"
                        />
                        <el-input
                          ref="codeAffiliateRef"
                          v-model="regForm.codeAffiliate"
                          :placeholder="'代理码'"
                          name="codeAffiliate"
                          type="text"
                          tabindex="8"
                          autocomplete="on"
                        />
                      </el-form-item> -->
                      <el-button
                        class="common-btn"
                        :loading="loading"
                        type="danger"
                        style="width:100%;"
                        @click.prevent="handleRegister"
                      >
                        申请
                      </el-button>
                    </div>
                  </el-form>
                </div>
                <div class="bot">&nbsp;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <CustomerServicePage />
    </SwiperSlide>
    <SwiperSlide>
      <SupportPage />
    </SwiperSlide>
    <Navigation />
    <Pagination />
    <Mousewheel />
  </Swiper>
  <el-dialog
    v-model="showDialog"
    width="95%"
    custom-class="dialog400"
    @close="onCloseDialog"
    :title="'安全验证, 请依次点击：' + words.join(' , ')"
  >
    <div
      id="loadDiv"
      style="display: flex; flex-direction: column; margin-top: -30px"
      v-loading="dialogLoading"
    >
      <el-image
        style="cursor: pointer"
        id="imageRef"
        fit="contain"
        :src="img"
        @click="onClickImage"
      />
      <div
        :style="{
          width: imageOffSetWidth + 'px',
          height: imageOffSetHeight + 'px',
          position: 'absolute',
          'z-index': '3000',
          display: resultDisplay,
          'justify-content': 'center',
          'align-items': 'center',
        }"
      >
        <i
          class="el-icon-success"
          :style="{
            'font-size': imageOffSetHeight / 2 + 'px',
            color: 'rgb(130, 208, 130)',
          }"
        />
        <span
          :style="{
            'font-size': imageOffSetHeight / 3 + 'px',
            color: 'rgb(130, 208, 130)',
          }"
        >
          验证成功
        </span>
      </div>
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
  toRefs,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { UserActionTypes } from '@/store/modules/user/action-types'
import { ElNotification } from 'element-plus';
import dyLogo from '@/assets/images/dy/logowhitee.png'
import { getVerificationImage } from '@/api/verification'
import { getVerificationCode } from '../../../api/user';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Mousewheel } from 'swiper';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import "swiper/swiper-bundle.css";
import CustomerServicePage from '@/components/customer-service'
import SupportPage from '@/components/support-page'

// extra components
SwiperCore.use([Mousewheel, Pagination, Navigation])
export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    Navigation,
    Pagination,
    Mousewheel,
    CustomerServicePage,
    SupportPage
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
    };
    const validatePass2 = async (r, v) => {
      if (v === "") {
        return Promise.reject(new Error('密码确认不能为空'));
      } else if (v !== state.regForm.password) {
        return Promise.reject(new Error("与登录密码不一致"));
      } else {
        return Promise.resolve();
      }
    };
    const validateRealName = async (r, v) => {
      if (v === "") {
        return Promise.reject(new Error("请输入姓名"));
      } else if (!checkRealName(v)) {
        return Promise.reject(new Error("请输入中文字符"));
      } else {
        return Promise.resolve();
      }
    };

    const checkRealName = (v) => {
      // const alphanumeric = /^[\p{L}\p{N}]*$/u;
      const chineseCharOnly = /^([\u4e00-\u9fa5]*)$/u;
      return v.match(chineseCharOnly);
    };
    const getCode = () => {
      getVerificationCode()
        .then((res) => {
          if (res.code === 0) {
            verificationImg.value = "data:image/png;base64," + res.data.img;
            state.regForm.codeId = res.data.id;
          }
        })
        .catch((e) => {
        });
    };
    const isReg = ref(false)
    const userNameRef = ref(null)
    const passwordRef = ref(null)
    const loginFormRef = ref(null)
    const regFormRef = ref(null)
    const verificationImg = ref("");
    const confirmPwdRef = ref(null);
    const realNameRef = ref(null);
    const telephoneRef = ref(null);
    const emailRef = ref(null);
    const birthdayRef = ref(null);
    const verificationRef = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const hasAffiliate = ref(false)
    const step = ref(1);
    const state = reactive({
      loginForm: {
        userName: '',
        password: '',
        site: 'DY2',
        key: '',
        coordinates: '',
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
      regForm: {
        userName: "",
        password: "",
        confirmPwd: "",
        realName: "",
        telephone: "",
        email: "",
        captchaCode: "",
        regHost: location.hostname,
        codeId: "",
      },
      regRules: {
        userName: [
          {
            required: true,
            message: "代理账号不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 13,
            message: "由6-13位数字或字母组成",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "登录密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 13,
            message: "由6-13位数字或字母组成",
            trigger: "blur",
          },
        ],
        confirmPwd: [
          // {
          //   required: true,
          //   message: "密码确认不能为空",
          //   trigger: "blur",
          // },
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        realName: [
          {
            validator: validateRealName,
            trigger: "blur",
          }
        ],
        telephone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: "blur",
          },
        ],
        birthday: [
          {
            required: true,
            message: "生日不能为空",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
          {
            type: "email",
            message: "邮件地址无效",
            trigger: "blur",
          },
          {
            max: 50,
            message: "由少过50位数字或字母组成",
            trigger: "blur",
          },
        ],
        captchaCode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
          {
            min: 4,
            max: 4,
            message: "由4位数字组成",
            trigger: "change",
          },
        ],
      },
      passwordType: 'password',
      showDialog: false,
      capsTooltip: false,
      redirect: '',
      otherQuery: {},
      words: [],
      codeId: '',
      img: '',
      coordinates: [],
      dialogLoading: false,
      imageOffSetWidth: 200,
      imageOffSetHeight: 100,
      resultDisplay: 'none',
    })
    function disabledDate(time) {
      return time.getTime() > new Date().getTime();
    }
    const methods = reactive({
      validatePasswordLength: (rule, value, callback) => {
        if (value.length < 6 || value.length > 12) {
          callback(new Error('密码长度为6-12'))
        } else {
          callback()
        }
      },
      checkCapslock: e => {
        const { key } = e
        if (key) {
          state.capsTooltip =
            key !== null && key.length === 1 && key >= 'A' && key <= 'Z'
        }
      },
      showPwd: () => {
        if (state.passwordType === 'password') {
          state.passwordType = ''
        } else {
          state.passwordType = 'password'
        }
        nextTick(() => {
          passwordRef.value.focus()
        })
      },
      handleLogin: () => {
        loginFormRef.value.validate(async valid => {
          if (valid) {
            methods.onGetImage()
            state.showDialog = true
          }
        })
      },
      handleRegister: () => {
        state.regForm.siteId = 6;
        (regFormRef.value).validate(async (valid) => {
          if (valid) {
            if (step.value === 1) {
              step.value = 2
              return;
            } else {
            }
            state.loading = true;
            try {
              await store.dispatch(UserActionTypes.ACTION_REGISTER, state.regForm);
              ElNotification({
                title: '系统提示',
                message: "尊敬的合作伙伴，您的资料提交成功，我们的代理专员会在24小时内告知您审核结果，如有疑问请联系我们代理专员或在线客服，谢谢。",
                showClose: false,
                type: 'success'
              })
            } catch (e) {
              ElNotification({
                title: '系统提示',
                message: e.message,
                showClose: false,
                type: 'error'
              })
              getCode()
              state.loading = false;
              return;
            }
            // router.push({
            //   path: state.redirect || "/dy/login",
            //   query: state.otherQuery
            // }).catch(err => {
            //   console.warn(err);
            // });
            isReg.value = false;
          }
        });
      },
      onFail: () => {
        const elDialog = document.getElementsByClassName('el-dialog')[0]
        elDialog.classList.add('shake')
        setTimeout(() => {
          elDialog.classList.remove('shake')
        }, 500)
        methods.onGetImage()
        state.coordinates.splice(0)
      },
      onSuccess: async () => {
        state.resultDisplay = 'flex'
        var image = document.getElementById('imageRef')
        state.imageOffSetWidth = image.offsetWidth
        state.imageOffSetHeight = image.offsetHeight
        state.dialogLoading = false
        image.style.opacity = '0.1'
        setTimeout(() => {
          router
            .push({
              path: state.redirect || '/',
              query: state.otherQuery,
            })
            .catch(err => {
              console.warn(err)
            })
        }, 500)
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
          state.imageOffSetWidth = image.offsetWidth
          state.imageOffSetHeight = image.offsetHeight
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
        state.dialogLoading = true
        state.loginForm.key = state.codeId
        const coordinatesString = []
        for (let i = 0; i < state.coordinates.length; i++) {
          const obj = []
          obj.push(state.coordinates[i].x)
          obj.push(state.coordinates[i].y)
          coordinatesString.push(obj.join(','))
        }
        state.loginForm.coordinates = coordinatesString.join('-')
        state.coordinates.splice(0)
        try {
          await store.dispatch(UserActionTypes.ACTION_LOGIN, state.loginForm)
        } catch (e) {
          if (e.message === '验证失败') {
            methods.onFail()
          } else {
            state.showDialog = false
          }
          state.dialogLoading = false
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
    })

    function getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    watch(
      () => route.query,
      query => {
        if (query) {
          state.redirect = query.redirect?.toString() ?? ''
          state.otherQuery = getOtherQuery(query)
        }
      },
      () => isReg.value,
      (newIsReg) => {
        if (newIsReg) {
          if (route.query.agent) {
            hasAffiliate.value = true
            state.regForm.codeAffiliate = route.query.agent
          } else {
            hasAffiliate.value = false
          }
          getCode();
          if (state.regForm.userName === "") {
            userNameRef.value.focus();
          } else if (state.regForm.password === "") {
            passwordRef.value.focus();
          }
        }
      }
    )

    onMounted(() => {
      if (route.query.agent) {
        hasAffiliate.value = true
        state.regForm.codeAffiliate = route.query.agent
      } else {
        hasAffiliate.value = false
      }
      getCode();
      if (state.loginForm.userName === '') {
        userNameRef.value.focus()
      } else if (state.loginForm.password === '') {
        passwordRef.value.focus()
      }
      var dialog = document.querySelector('.el-overlay-dialog')
      dialog.addEventListener('scroll', methods.onScrollEvent)
      window.addEventListener('resize', methods.onScrollEvent)
    })
    const swiperKey = ref(0)

    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      confirmPwdRef,
      realNameRef,
      telephoneRef,
      emailRef,
      birthdayRef,
      verificationRef,
      regFormRef,
      dyLogo,
      verificationImg,
      disabledDate,
      ...toRefs(state),
      ...toRefs(methods),
      onSwiper,
      onSlideChange,
      getCode,
      hasAffiliate,
      step,
      swiperKey,
      isReg
    }
  }
})

</script>

<style scoped lang="scss">
.common-btn {
  font-family: Jura;
  transition: all 0.8s, color 0.3s 0.3s;
  min-width: 120px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #458BFF;
  border-radius: 14px;
  font-size: 14px;
  color: #ffffff;
  border: 1px solid transparent;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
}
:deep(.el-input-group__append) {
    background-color: #ffffff;
    border: 0;
    padding: 0 10px;
    border-radius: 0;
    img {
      display: flex;
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
  background: #F4F9FD;
  background-color: #F4F9FD;
  border: 1px solid #D8E0F0;
  color: #458BFF;
  border-radius: 14px;
  &::placeholder {
    color: #aaaaaa;
  }
}
.wrapper {
  background: url('../../../assets/images/dy/main.jpg') no-repeat center top;
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
          content: '';
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

.swiper-slide {
  max-height: 100vh;
}
.firstPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background: url('../../../assets/images/login/firstbg.svg')no-repeat center center;
  background-size: cover;
  .inner {
    max-width: 1200px;
    width: 100%;
    margin: 50px auto;
    height: 50%;
  }
  .logo {
    width: 200px;
    img {
      width: 100%;
    }
  }
  .loginPage {
    height: 80%;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .left {
      flex: 1;
      .first-liner, .second-liner {
        max-width: 400px;
        width: 100%;
        img {
          width: 100%;
        }
      }
      .first-liner {
        margin-bottom: 3rem;
      }
      .second-liner {
        max-width: 200px;
      }
    }
    .right {
      flex: 1;
      .bg {
        width: 520px;
      }
      .top {
        background: url(../../../assets/images/login/top.png)no-repeat center center;
        background-size: cover;
        padding: 20px;
        position: relative;
        .log {
          font-weight: bold;
          font-family: fzh;
          font-size: 32px;
          padding-left: 15px;
        }
        .topright {
          position: absolute;
          right: 30px;
          top: 18px;
          .noaccabs {
            font-size: 16px;
            color: #ffffff;
          }
          a {
            font-family: PFBold;
            font-size: 16px;
            color: #ffffff;
          }
        }
      }
      .mid {
        background: url(../../../assets/images/login/mid.png)no-repeat center center;
        background-size: cover;
        margin: 0 10px;
        padding: 25px 20px;
        .el-form {
          width: 95%;
          margin: 0 auto;
        }
      }
      .bot {
        background: url(../../../assets/images/login/dow.png)no-repeat center bottom;
        background-size: cover;
        padding: 10px;
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

<style>
.dialog400 {
  max-width: 400px;
}
.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}
</style>

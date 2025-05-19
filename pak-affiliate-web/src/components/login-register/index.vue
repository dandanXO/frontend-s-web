<template>
  <div class="firstPage kr">
    <div class="inner">
      <div class="loginPage">
        <div class="left">
          <div class="logo">
            <img :src="krLogo" />
          </div>
          <div class="first-liner">
            Start From DIAMOND
          </div>
          <div class="second-liner">
            Become a legend
            <br />
            Or become the eulogist of legend?
          </div>
        </div>
        <div class="right">
          <div class="bg">
            <div class="top">
              <div class="log">
                {{ isReg ? $t('common.signup') : $t('common.login') }}
              </div>
            </div>
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
                    :placeholder="$t('common.username')"
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
                      :placeholder="$t('common.password')"
                      name="password"
                      tabindex="2"
                      autocomplete="no-fill"
                      @keyup="checkCapslock"
                      @blur="capsTooltip = false"
                      @keyup.enter="handleLogin()"
                    />
                  </el-form-item>
                </el-tooltip>
                <div style="margin:20px 0px">
                  <el-link type="primary" @click="forgetPasswordDialog">
                    {{ $t('common.forgetpass') }}
                  </el-link>
                </div>
                <div class="flex-c-center-div">
                  <el-button
                    class="common-btn"
                    type="danger"
                    style="width:50%;"
                    @click.prevent="handleLogin"
                  >
                    {{ $t('common.loginnow') }}
                  </el-button>
                  <el-button
                    class="common-btn default-btn"
                    type="primary"
                    style="width:50%;"
                    @click="isReg = !isReg"
                  >
                    {{ $t('common.register_affi') }}
                  </el-button>
                </div>

                <div class="flex-c-center-div">
                  <div class="contact-div" @click="swipeToContactUs">
                    {{ $t('common.contact_us') }}
                  </div>
                </div>
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
                      :placeholder="$t('common.affiliateaccount')"
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
                        :placeholder="$t('common.password')"
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
                        :placeholder="$t('common.confirmpassword')"
                        name="password"
                        tabindex="3"
                        autocomplete="on"
                        @keyup="checkCapslock"
                        @blur="capsTooltip = false"
                      />
                    </el-form-item>
                  </el-tooltip>
                  <el-form-item prop="captchaCode">
                    <el-input
                      ref="verificationRef"
                      v-model="regForm.captchaCode"
                      :placeholder="$t('common.verificationcode')"
                      name="captchaCode"
                      type="text"
                      tabindex="7"
                      autocomplete="on"
                    >
                      <template #append class="verification">
                        <img :src="verificationImg" @click="getCode()" />
                      </template>
                    </el-input>
                  </el-form-item>

                  <div class="flex-c-center-div">
                    <el-button
                      class="common-btn"
                      :loading="loading"
                      type="danger"
                      style="width:50%;"
                      @click.prevent="handleRegister"
                    >
                      {{
                        props.siteId === '8' || props.siteId === 8
                          ? $t('google.next_step')
                          : $t('common.apply')
                      }}
                    </el-button>
                    <el-button
                      class="common-btn default-btn"
                      style="width:50%;"
                      @click="isReg = !isReg"
                    >
                      {{ $t('common.back_login') }}
                    </el-button>
                  </div>
                  <div
                    v-if="props.siteId !== '5' || props.siteId !== '8'"
                    class="flex-c-center-div"
                  >
                    <div class="contact-div" @click="swipeToContactUs">
                      {{ $t('common.contact_us') }}
                    </div>
                  </div>
                </div>
                <div v-if="step === 2 && props.siteId === '8'">
                  <el-form-item prop="realName">
                    <el-input
                      ref="realNameRef"
                      v-model="regForm.realName"
                      :placeholder="$t('fields.realName')"
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
                      :placeholder="$t('fields.telephone')"
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
                      :placeholder="$t('fields.email')"
                      name="Email"
                      type="text"
                      tabindex="5"
                      autocomplete="on"
                    />
                  </el-form-item>
                  <div class="flex-c-center-div">
                    <el-button
                      class="common-btn default-btn"
                      style="width:50%;"
                      @click="step = 1"
                    >
                      {{ $t('google.prev_step') }}
                    </el-button>
                    <el-button
                      class="common-btn"
                      :loading="loading"
                      type="danger"
                      style="width:50%;"
                      @click.prevent="handleRegister"
                    >
                      {{ $t('common.apply') }}
                    </el-button>
                  </div>
                </div>
              </el-form>
            </div>
            <div class="bot">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="showDialog"
    custom-class="dialog400"
    @close="onCloseDialog"
    :title="$t('common.verification_title') + words.join(' , ')"
  >
    <template #title>
      <span class="verification-title">
        {{ $t('common.verification_title') }}
      </span>
      <span style="font-weight: bold;">
        {{ words.join(' , ') }}
      </span>
    </template>
    <div id="loadDiv" v-loading="dialogLoading">
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
          {{ $t('common.verify_success') }}
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
        {{ $t('common.refresh') }}
      </el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        style="margin-top: 20px;"
        @click="userLogin()"
        :disabled="coordinates.length === 0"
      >
        {{ $t('common.submit') }}
      </el-button>
    </div>
  </el-dialog>
  <div v-for="(point, index) in coordinates" :key="index">
    <div
      class="image-number-point"
      :style="{ left: point.displayLeft + 'px', top: point.displayTop + 'px' }"
      @click="onClickNumber(index)"
    >
      {{ index + 1 }}
    </div>
  </div>
  <el-dialog v-model="showPasswordDialog" :title="t('fields.forgetPassword')">
    <el-steps :active="passwordStep" align-center>
      <el-step :title="t('forgetPassword.verifyAuth')" />
      <el-step :title="t('forgetPassword.verifyQues')" />
      <el-step :title="t('forgetPassword.resetPassword')" />
    </el-steps>
    <div class="auth-container" v-if="passwordStep === 1">
      <div class="auth-title">{{ $t('forgetPassword.messageAuth') }}</div>
      <el-form
        ref="googleAuthFormRef"
        :model="googleAuthForm"
        :rules="googleAuthRules"
        class="login-form"
        autocomplete="no-fill"
        label-width="100px"
      >
        <el-form-item prop="loginName" :label="t('fields.loginName')">
          <el-input
            v-model="googleAuthForm.loginName"
            :placeholder="t('fields.loginName')"
            name="loginName"
            type="text"
            autocomplete="no-fill"
          />
        </el-form-item>
        <el-form-item prop="code" :label="t('google.auth_code')">
          <el-input
            v-model="googleAuthForm.code"
            :placeholder="t('google.auth_code')"
            name="code"
            maxlength="6"
            @keypress="restrictIntegerInput($event)"
          />
        </el-form-item>
        <div class="flex-c-center-div">
          <el-button
            class="common-btn"
            type="danger"
            @click="submitVerifyGoogle"
          >
            {{ $t('forgetPassword.verify') }}
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="auth-container" v-if="passwordStep === 2">
      <el-form
        ref="quesAuthFormRef"
        :model="quesAuthForm"
        :rules="quesAuthRules"
        class="login-form"
        autocomplete="no-fill"
        label-position="top"
      >
        <div class="auth-title">{{ $t('forgetPassword.messageQues') }}</div>
        <div>
          <span>
            {{ securityQuestion.question[securityQuestion.currentIndex] }}
          </span>
          <el-link
            icon="el-icon-refresh"
            :underline="false"
            style="margin:20px"
            @click="nextQuestion()"
          />
        </div>
        <el-form-item prop="answer">
          <el-input
            v-model="quesAuthForm.answer"
            :placeholder="t('forgetPassword.answer')"
            name="answer"
            type="text"
            autocomplete="no-fill"
          />
        </el-form-item>
        <div class="flex-c-center-div">
          <el-button class="common-btn" type="danger" @click="submitVerifyQues">
            {{ $t('forgetPassword.submit') }}
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="auth-container" v-if="passwordStep === 3">
      <el-form
        ref="resetFormRef"
        :model="resetForm"
        :rules="resetRules"
        class="login-form"
        autocomplete="no-fill"
        label-width="100px"
      >
        <div class="auth-title">{{ $t('forgetPassword.messageReset') }}</div>
        <el-form-item prop="password" :label="t('fields.newPassword')">
          <el-input
            v-model="resetForm.password"
            :placeholder="t('fields.newPassword')"
            name="password"
            :type="passwordType"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
          />
        </el-form-item>
        <el-form-item
          prop="confirmPassword"
          :label="t('fields.confirmNewPassword')"
        >
          <el-input
            v-model="resetForm.confirmPassword"
            :placeholder="t('fields.confirmNewPassword')"
            name="confirmPassword"
            :type="passwordType"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
          />
        </el-form-item>
        <div class="flex-c-center-div">
          <el-button
            class="common-btn"
            type="danger"
            @click="submitResetPassword"
          >
            {{ $t('forgetPassword.reset') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
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
import { ElNotification, ElMessage } from 'element-plus'
import krLogo from '@/assets/logo-diamond.svg'
import { getVerificationImage } from '@/api/verification'
import {
  getVerificationCode,
  verifyGoogleAuthentication,
  getSecurityQuestionsList,
  verifySecurityQuestions,
  resetLoginPassword,
} from '@/api/user'
import { useI18n } from 'vue-i18n'
import { i18nStore } from '@/store/language'

export default defineComponent({
  props: {
    siteId: {
      type: [String, Number], // Specify the allowed types for the prop
      required: true,
    },
  },
  setup(props) {
    const validatePass2 = async (r, v) => {
      if (v === '') {
        return Promise.reject(new Error(t('message.required_confirm_pwd')))
      } else if (v !== state.regForm.password) {
        return Promise.reject(
          new Error(t('message.required_same_with_password'))
        )
      } else {
        return Promise.resolve()
      }
    }
    const validateResetPass2 = async (r, v) => {
      if (v === '') {
        return Promise.reject(new Error(t('message.required_confirm_pwd')))
      } else if (v !== state.resetForm.password) {
        return Promise.reject(
          new Error(t('message.required_same_with_password'))
        )
      } else {
        return Promise.resolve()
      }
    }
    const validateRealName = async (r, v) => {
      if (v === '') {
        return Promise.reject(new Error(t('message.requiredRealName')))
      } else if (!checkRealName(v) && props.siteId !== '8') {
        return Promise.reject(new Error('请输入中文字符'))
      } else {
        return Promise.resolve()
      }
    }

    const checkRealName = v => {
      // const alphanumeric = /^[\p{L}\p{N}]*$/u;
      const chineseCharOnly = /^([\u4e00-\u9fa5]*)$/u
      return v.match(chineseCharOnly)
    }
    const getCode = () => {
      getVerificationCode()
        .then(res => {
          if (res.code === 0) {
            // Data Image
            verificationImg.value = 'data:image/png;base64,' + res.data.img
            state.regForm.codeId = res.data.id
            state.loginForm.codeId = res.data.id
          }
        })
        .catch(e => {})
    }
    const isReg = ref(false)
    const userNameRef = ref(null)
    const passwordRef = ref(null)
    const loginFormRef = ref(null)
    const regFormRef = ref(null)
    const verificationImg = ref('')
    const confirmPwdRef = ref(null)
    const realNameRef = ref(null)
    const telephoneRef = ref(null)
    const emailRef = ref(null)
    const birthdayRef = ref(null)
    const verificationRef = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n()
    const hasAffiliate = ref(false)
    const step = ref(1)
    const passwordStep = ref(1)
    const googleAuthFormRef = ref(null)
    const quesAuthFormRef = ref(null)
    const resetFormRef = ref(null)
    const captchaImg = ref('')
    const state = reactive({
      loginForm: {
        userName: '',
        password: '',
        site: 'BPK',
        key: '',
        coordinates: '',
        captchaCode: '',
        codeId: '',
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: t('message.requiredLoginName'),
            trigger: 'blur',
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_]*$/,
            message: t('common.affiliateaccountcanonlycontainnumchar'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: t('message.requiredPassword'),
            trigger: 'blur',
          },
        ],
      },
      regForm: {
        userName: '',
        password: '',
        confirmPwd: '',
        realName: '',
        telephone: '',
        email: '',
        captchaCode: '',
        regHost: location.hostname,
        codeId: '',
        codeAffiliate: '',
        codePersonalAffiliate: '',
      },
      regRules: {
        userName: [
          {
            required: true,
            message: t('message.required_signup_account'),
            trigger: 'blur',
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_]*$/,
            message: t('common.affiliateaccountcanonlycontainnumchar'),
            trigger: 'blur',
          },
          {
            min: 6,
            max: 12,
            message: t('message.required_6_to_12'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: t('message.requried_password'),
            trigger: 'blur',
          },
          {
            min: 6,
            max: 12,
            message: t('message.required_6_to_12'),
            trigger: 'blur',
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
            trigger: 'blur',
          },
        ],
        realName: [
          {
            validator: validateRealName,
            trigger: 'blur',
          },
        ],
        telephone: [
          {
            required: true,
            message: t('message.requiredTelephone'),
            trigger: 'blur',
          },
        ],
        birthday: [
          {
            required: true,
            message: '生日不能为空',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: t('message.requiredEmail'),
            trigger: 'blur',
          },
          {
            type: 'email',
            message: t('message.emailFormat'),
            trigger: 'blur',
          },
          {
            max: 50,
            message: t('message.lessthan50'),
            trigger: 'blur',
          },
        ],
        captchaCode: [
          {
            required: true,
            message: t('message.required_captcha'),
            trigger: 'blur',
          },
          {
            min: 4,
            max: 4,
            message: t('message.required_4_digits'),
            trigger: 'change',
          },
        ],
        codePersonalAffiliate: [
          {
            min: 6,
            max: 6,
            message: t('message.required_6_digits_code'),
            trigger: 'change',
          },
          {
            pattern: /^[a-zA-Z1-9][a-zA-Z0-9]*$/,
            message: t('message.required_only_digits_and_alphabet'),
            trigger: 'blur',
          },
        ],
      },
      googleAuthForm: {
        loginName: '',
        code: '',
      },
      googleAuthRules: {
        loginName: [
          {
            required: true,
            message: t('message.requiredLoginName'),
            trigger: 'blur',
          },
          {
            required: true,
            pattern: /^[a-zA-Z1-9][a-zA-Z0-9]*$/,
            message: '代理账号只能有数字或字母组成',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: t('google.google_auth_code'),
            trigger: 'blur',
          },
        ],
      },
      quesAuthForm: {
        answer: '',
        questionNumber: '',
      },
      quesAuthRules: {
        answer: [
          {
            required: true,
            message: t('message.requiredAnswer'),
            trigger: 'blur',
          },
        ],
      },
      resetForm: {
        password: '',
        confirmPassword: '',
      },
      resetRules: {
        password: [
          {
            required: true,
            message: '登录密码不能为空',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 12,
            message: '由6-12位数字或字母组成',
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            validator: validateResetPass2,
            trigger: 'blur',
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
      showPasswordDialog: false,
      securityQuestion: {
        question: [],
        currentIndex: 0,
      },
      twoFaCode: '',
    })
    function disabledDate(time) {
      return time.getTime() > new Date().getTime()
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
            if (
              state.loginForm.site === 'BPK'
            ) {
              methods.userLogin()
            } else {
              methods.onGetImage()
              state.showDialog = true
            }
          }
        })
      },
      handleRegister: () => {
        state.regForm.siteId = props.siteId
        regFormRef.value.validate(async valid => {
          if (valid) {
            if (props.siteId === '15' || props.siteId === 15) {
              if (step.value === 1) {
                step.value = 2
                return
              } else {
              }
            }
            state.loading = true
            try {
              await store.dispatch(
                UserActionTypes.ACTION_REGISTER,
                state.regForm
              )
              ElNotification({
                title: t('fields.systemAlert'),
                message: t('fields.affiliateSuccessSubmit'),
                showClose: false,
                type: 'success',
              })
            } catch (e) {
              ElNotification({
                title: t('fields.systemAlert'),
                message: e.message,
                showClose: false,
                type: 'error',
              })
              step.value = 1
              getCode()
              state.loading = false
              return
            }
            isReg.value = false
          }
        })
      },
      onFail: () => {
        const elDialog = document.getElementsByClassName('el-dialog')[0]
        elDialog.classList.add('shake')
        setTimeout(() => {
          elDialog.classList.remove('shake')
        }, 500)
        methods.onGetImage()
        if (state.loginForm.site === 'KA1') {
          getCaptcha()
        }
        state.coordinates.splice(0)
      },
      onSuccess: async () => {
        if (
          state.loginForm.site === 'BPK'
        ) {
          router
            .push({
              path: state.redirect || '/',
              query: state.otherQuery,
            })
            .catch(err => {
              console.warn(err)
            })
        } else {
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
        }
      },
      onClickImage: e => {
        if (state.coordinates.length < 5) {
          var image = document.getElementById('imageRef')
          var x = e.clientX - image.getBoundingClientRect().x
          var y = e.clientY - image.getBoundingClientRect().y
          var storeX = x
          var storeY = y
          if (image.getBoundingClientRect().x !== 200) {
            storeX = (x / image.offsetWidth) * 200
            storeY = (y / image.offsetHeight) * 100
          }
          state.coordinates.push({
            displayLeft: e.pageX - 12,
            displayTop: e.pageY - 12,
            left: e.pageX - image.getBoundingClientRect().x,
            top: e.pageY - image.getBoundingClientRect().y,
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
          } else if (state.loginForm.site === 'VNM') {
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
        const imgType =
          languageVal === 'vi' || languageVal === 'en' || languageVal === 'kr'
            ? 1
            : 0
        const { data } = await getVerificationImage(imgType)
        Object.keys({ ...data.data }).forEach(field => {
          state[field] = data.data[field]
        })
        state.dialogLoading = false
      },
      forgetPasswordDialog: () => {
        passwordStep.value = 1
        state.googleAuthForm.loginName = ''
        state.googleAuthForm.code = ''
        state.quesAuthForm.answer = ''
        state.quesAuthForm.questionNumber = ''
        state.resetForm.password = ''
        state.resetForm.confirmPassword = ''
        state.showPasswordDialog = true
      },
      restrictIntegerInput: event => {
        var charCode = event.which ? event.which : event.keyCode
        if (charCode < 48 || charCode > 57 || charCode === 46) {
          event.preventDefault()
        }
      },
      submitVerifyGoogle: () => {
        googleAuthFormRef.value.validate(async valid => {
          if (valid) {
            const { data: ret } = await verifyGoogleAuthentication(
              state.googleAuthForm.loginName,
              props.siteId,
              state.googleAuthForm.code
            )
            const { data: ret1 } = await getSecurityQuestionsList(
              state.googleAuthForm.loginName,
              props.siteId
            )
            state.twoFaCode = ret
            if (ret1 === null || ret1 === undefined) {
              ElMessage.error(t('forgetPassword.noSecurityQuestionSet'))
            }
            state.securityQuestion.question.push(ret1.questionOne)
            state.securityQuestion.question.push(ret1.questionTwo)
            state.securityQuestion.question.push(ret1.questionThree)
            passwordStep.value = 2
          }
        })
      },
      nextQuestion: () => {
        state.securityQuestion.currentIndex =
          state.securityQuestion.currentIndex === 2
            ? 0
            : state.securityQuestion.currentIndex + 1
      },
      submitVerifyQues: () => {
        quesAuthFormRef.value.validate(async valid => {
          if (valid) {
            const { data: ret } = await verifySecurityQuestions(
              state.googleAuthForm.loginName,
              props.siteId,
              state.quesAuthForm.answer,
              state.securityQuestion.currentIndex + 1,
              state.twoFaCode
            )
            state.twoFaCode = ret
            passwordStep.value = 3
          }
        })
      },
      submitResetPassword: () => {
        resetFormRef.value.validate(async valid => {
          if (valid) {
            await resetLoginPassword(
              state.googleAuthForm.loginName,
              props.siteId,
              state.resetForm.password,
              state.twoFaCode
            )
            ElMessage.success(t('forgetPassword.resetSuccess'))
            state.showPasswordDialog = false
          }
        })
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
      newIsReg => {
        if (newIsReg) {
          if (route.query.agent) {
            hasAffiliate.value = true
            state.regForm.codeAffiliate = route.query.agent
          } else {
            hasAffiliate.value = false
          }
          getCode()
          if (state.regForm.userName === '') {
            userNameRef.value.focus()
          } else if (state.regForm.password === '') {
            passwordRef.value.focus()
          }
        }
      }
    )

    const swipeToContactUs = () => {
      window.open('https://t.me/dia88help', '_blank').focus()
    }

    const handleInput = event => {
      state.regForm.codePersonalAffiliate = state.regForm.codePersonalAffiliate.toUpperCase()
    }

    const getCaptcha = () => {
      state.loginForm.captchaCode = ''

      getVerificationCode().then(res => {
        if (res.code === 0) {
          captchaImg.value = 'data:image/png;base64,' + res.data.img
          state.loginForm.codeId = res.data.id
        } else {
          ElMessage.error({
            type: 'error',
            message: res.message,
          })
        }
      })
    }

    const i18nStoreLanguage = i18nStore()
    const { setLanguage, languageVal } = i18nStoreLanguage

    onMounted(() => {
      if (route.query.agent) {
        hasAffiliate.value = true
        state.regForm.codeAffiliate = route.query.agent
      } else {
        hasAffiliate.value = false
      }
      if (route.query.isreg) {
        isReg.value = true
      }
      getCode()

      if (state.loginForm.userName === '') {
        userNameRef.value.focus()
      } else if (state.loginForm.password === '') {
        passwordRef.value.focus()
      }
      var dialog = document.querySelector('.el-overlay-dialog')
      dialog.addEventListener('scroll', methods.onScrollEvent)
      window.addEventListener('resize', methods.onScrollEvent)
      setLanguage('en')
    })
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
      verificationImg,
      disabledDate,
      ...toRefs(state),
      ...toRefs(methods),
      getCode,
      hasAffiliate,
      step,
      isReg,
      props,
      t,
      swipeToContactUs,
      passwordStep,
      googleAuthFormRef,
      quesAuthFormRef,
      resetFormRef,
      getCaptcha,
      captchaImg,
      krLogo,
      handleInput,
    }
  },
})
</script>

<style scoped lang="scss">
a {
  cursor: pointer;
}

.common-btn {
  font-family: Jura;
  transition: all 0.8s, color 0.3s 0.3s;
  min-width: 120px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #458bff;
  border-radius: 14px;
  font-size: 14px;
  color: #ffffff;
  border: 1px solid transparent;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }

  &.default-btn {
    background-color: transparent;
    border: 1px solid #458bff;
    color: #458bff;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
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
  background: #f4f9fd;
  background-color: #f4f9fd;
  border: 1px solid #d8e0f0;
  color: #458bff;
  border-radius: 14px;

  &::placeholder {
    color: #aaaaaa;
  }
}

.wrapper {
  background: url('../../assets/images/dy/main.jpg') no-repeat center top;
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

.firstPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background: url('../../assets/images/login/bg_login.jpg') no-repeat center
    center;
  background-size: cover;

  .inner {
    max-width: 1200px;
    width: 100%;
    margin: 50px auto;
    height: 100%;
  }

  .logo {
    width: 300px;

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

      .first-liner,
      .second-liner {
        max-width: 400px;
        width: 100%;

        img {
          width: 100%;
        }
      }

      .first-liner {
        margin-bottom: 1rem;
        background: linear-gradient(
          180deg,
          #f6d99e 13.1%,
          #ffe3bd 50.03%,
          #fbbd68 79.37%
        );
        text-shadow: 0px 4px 4px 0px #1c1614;
        font-size: 5rem;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0px 4px 4px #1c1614);
        font-family: fzh;
      }

      .second-liner {
        font-family: fzh;
        color: #ffffff;
        font-size: 2rem;
      }
    }

    .right {
      flex: 1;

      .bg {
        width: 520px;
      }

      .top {
        background: url(../../assets/images/login/top.png) no-repeat center
          center;
        background-size: cover;
        padding: 20px;
        position: relative;

        .log {
          font-weight: bold;
          //font-family: fzh;
          font-family: Oxanium, -apple-system, BlinkMacSystemFont, Segoe UI,
            Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
            Microsoft YaHei, Arial, sans-serif;
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
        background: url(../../assets/images/login/mid.png) no-repeat center
          center;
        background-size: cover;
        margin: 0 10px;
        padding: 25px 20px;

        .el-form {
          width: 95%;
          margin: 0 auto;
        }
      }

      .bot {
        background: url(../../assets/images/login/dow.png) no-repeat center
          bottom;
        background-size: cover;
        padding: 10px;
      }
    }
  }
}

.flex-c-center-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
  text-align: center;

  .contact-div {
    margin-top: 10px;
    width: 50%;
    padding: 10px 20px 0px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
}

.auth-container {
  margin: 20px;

  .auth-title {
    font-size: 18px;
    font-weight: 600;
    margin: 30px 0 15px 0;
  }
}

@media (max-width: 1100px) {
  .firstPage {
    height: auto;

    .inner {
      padding-top: 100px;
    }

    .loginPage {
      flex-direction: column;
    }
  }
}

@media (max-width: 768px) {
  .firstPage {
    height: auto;

    .inner {
      padding-top: 50px;
    }

    .loginPage {
      flex-direction: column;
      gap: 60px;

      .right {
        width: 100%;

        .bg {
          width: 100%;
        }

        .top {
          padding: 15px;
          background-size: 100%;
          background-position: bottom;
          min-height: 13vw;

          .log {
            font-size: 20px;
          }

          .topright {
            right: 20px;
            top: 10px;
          }
        }

        .mid {
          background-size: 100% 100%;
          margin: 0;
        }

        .bot {
          background-size: 100%;
          background-position: top;
          padding: 4px 20px;
        }
      }
    }

    .logo {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 120px;
    }
  }

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

  .swiper-slide {
    max-height: unset;
    overflow: auto;
  }
}
</style>
<style lang="scss">
.dialog400 {
  width: 100%;
  max-width: 400px;

  #loadDiv {
    display: flex;
    flex-direction: column;
    margin-top: -30px;
  }
}

@media (max-width: 768px) {
  .dialog400 {
    width: 80%;
  }

  .el-dialog {
    --el-dialog-padding-primary: 10px;

    .el-button {
      margin-top: 10px !important;
      margin-bottom: -10px;
    }

    .el-dialog__header {
      margin: 10px 0;
    }
  }

  .verification-title {
    font-size: 0.8rem;
  }
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

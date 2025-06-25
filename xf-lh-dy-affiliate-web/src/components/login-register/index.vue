<template>
  <div
    class="firstPage"
    :class="[
      props.siteId !== '5' && props.siteId !== '9' && props.siteId !== '18' ? '' : 'ind-firstPage',
      props.siteId !== '7' ? '' : 'lh',
      props.siteId !== '8' ? '' : 'vi',
      props.siteId !== '10' ? '' : 'kr',
      props.siteId !== '11' ? '' : 'pak',
      props.siteId !== '15' ? '' : 'kaka',
      props.siteId !== '28' ? '' : 'br2',
    ]"
  >
    <img
      class="float-logo"
      v-if="props.siteId === '15'"
      :src="currentSite.logo"
    >
    <div class="inner">
      <div class="loginPage">
        <div class="left">
          <div class="logo">
            <img v-if="props.siteId !== '15'" :src="currentSite.logo">
          </div>
          <div class="first-liner" v-html="currentSite.firstLiner" />
          <div class="second-liner" v-html="currentSite.secondLiner" />
        </div>
        <div class="right">
          <div class="bg swiper-no-swiping">
            <div class="top">
              <div class="log">
                {{ isReg ? $t('common.signup') : $t('common.login') }}
              </div>
              <LangToggle v-if="props.siteId === '8'" />
              <!--              <div class="topright" v-if="props.siteId !== '5'">-->
              <!--                <span class="noaccabs">-->
              <!--                  {{ isReg ? '已经有账号? ' : '没有帐户？' }}-->
              <!--                </span>-->
              <!--                <a @click="isReg = !isReg" class="signlog">-->
              <!--                  {{ isReg ? '请登录' : '立即注册' }}-->
              <!--                </a>-->
              <!--              </div>-->
            </div>

            <div class="mid">
              <img class="top-img" v-if="props.siteId === '7'" src="../../assets//images/login/lh-login-1.png">
              <el-form
                v-if="!isReg"
                ref="loginFormRef"
                :model="loginForm"
                :rules="props.siteId === '8' ? loginRulesVi : loginRules"
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
                      @keyup.enter="props.siteId !== '8' ? handleLogin() : null"
                    />
                  </el-form-item>
                </el-tooltip>
                <el-form-item prop="captchaCode" v-if="props.siteId === '8'">
                  <el-input
                    v-model="loginForm.captchaCode"
                    :placeholder="$t('common.verificationcode')"
                    name="captchaCode"
                    type="text"
                    tabindex="7"
                    autocomplete="on"
                    @keyup.enter="handleLogin"
                    clearable
                  >
                    <template #append class="verification">
                      <img :src="captchaImg" @click="getCaptcha()">
                    </template>
                  </el-input>
                </el-form-item>
                <div class="forget-pw" v-if="props.siteId !== '8'">
                  <el-link type="primary" @click="forgetPasswordDialog">
                    {{ $t('common.forgetpass') }}
                  </el-link>
                </div>
                <div class="flex-c-center-div login-btn-grp">
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
                    v-if="props.siteId !== '28'"
                  >
                    {{ $t('common.register_affi') }}
                  </el-button>
                </div>

                <div
                  v-if="props.siteId !== '5' || props.siteId !== '8'"
                  class="flex-c-center-div"
                >
                  <div class="contact-div" @click="swipeToContactUs" v-if="props.siteId !== '28'">
                    {{ $t('common.contact_us') }}
                  </div>
                </div>
                <LhFeedback v-if="props.siteId === '7'" />
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
                  <el-form-item
                    prop="codeAffiliate"
                    v-if="props.siteId === '10'"
                  >
                    <el-input
                      ref="codeAffiliateRef"
                      v-model="regForm.codeAffiliate"
                      :placeholder="$t('fields.referralCode')"
                      name="codeAffiliate"
                      type="text"
                      tabindex="8"
                      autocomplete="on"
                    />
                  </el-form-item>
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
                        <img :src="verificationImg" @click="getCode()">
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
                    v-if="props.siteId !== '5' || props.siteId !== '8' || props.siteId !== '28'"
                    class="flex-c-center-div"
                  >
                    <div class="contact-div" @click="swipeToContactUs">
                      {{ $t('common.contact_us') }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="
                    step === 2 &&
                      (props.siteId === '8' || props.siteId === '15')
                  "
                >
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
                  </el-form-item-->
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
                  <!-- <el-button
                    class="common-btn"
                    :loading="loading"
                    type="danger"
                    style="width:100%;"
                    @click.prevent="handleRegister"
                  >
                    申请
                  </el-button> -->
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
  >
    <template #title>
      <span class="verification-title" v-if="isClick">
        {{ $t('common.verification_title') }}
      </span>
      <span style="font-weight: bold;" v-if="isClick">
        {{ words.join(' , ') }}
      </span>
      <span class="verification-title" v-if="!isClick">
        {{ $t('common.verification_drag_title') }}
      </span>
    </template>
    <div id="loadDiv" v-loading="dialogLoading">
      <el-image
        style="cursor: pointer"
        id="imageRef"
        fit="contain"
        :src="img"
        @click="onClickImage"
        v-if="isClick"
      />
      <div class="overlapParent" v-if="!isClick">
        <el-image id="imageRef" fit="contain" :src="img" />
        <el-image id="puzzleRef" fit="contain" :src="puzzle" />
      </div>
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
        v-if="isClick"
      >
        {{ $t('common.refresh') }}
      </el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        style="margin-top: 20px;"
        @click="userLogin()"
        :disabled="coordinates.length === 0"
        v-if="isClick"
      >
        {{ $t('common.submit') }}
      </el-button>
      <el-input
        id="dragInput"
        type="range"
        min="0"
        max="100"
        v-model="dragCoordinate"
        style="margin-top: 10px"
        @input="onDrag()"
        @change="onDragRelease()"
        v-if="!isClick"
      />
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
import dyLogo from '@/assets/images/dy/logowhitee.png'
import xfLogo from '@/assets/images/xf/logowhitee.png'
import indLogo from '@/assets/images/ind/ind-logo.png'
import ind2Logo from '@/assets/images/ind2/789logo.png'
import lhLogo from '@/assets/images/lh/logo.png'
import viLogo from '@/assets/images/vi/vilogo.svg'
import kakaLogo from '@/assets/images/kaka/logo-kaka-game.png'
import krLogo from '@/assets/images/kr/kr-logo.png'
import pakLogo from '@/assets/images/pak/logowhitee.png'
import br2Logo from '@/assets/images/br2/br2-logo.png'
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
import LhFeedback from '../customer-service/lh-feedback.vue'
import LangToggle from '../lang/LangToggle.vue'

export default defineComponent({
  props: {
    siteId: {
      type: [String, Number], // Specify the allowed types for the prop
      required: true,
    },
  },
  components: {
    LhFeedback,
    LangToggle
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
      } else if (
        !checkRealName(v) &&
        props.siteId !== '8' &&
        props.siteId !== '15'
      ) {
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
    const isClick = ref(1)
    const dragCoordinate = ref(0)
    const state = reactive({
      loginForm: {
        userName: '',
        password: '',
        site: 'DY2',
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
      loginRulesVi: {
        userName: [
          {
            required: true,
            message: t('message.requiredLoginName'),
            trigger: 'blur',
          },
          {
            required: true,
            pattern: /^[a-zA-Z1-9][a-zA-Z0-9]*$/,
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
      },
      regRules: {
        userName: [
          {
            required: true,
            message: t('message.required_signup_account'),
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
      puzzle: '',
      puzzleXvalue: '',
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
              state.loginForm.site === 'IND' ||
              state.loginForm.site === 'IW2' ||
              state.loginForm.site === 'VNM' ||
              state.loginForm.site === 'BR2' ||
              state.loginForm.site === 'KRW'
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
            if (
              props.siteId === '15' ||
              props.siteId === 15 ||
              props.siteId === '8' ||
              props.siteId === 8
            ) {
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
            // router.push({
            //   path: state.redirect || "/dy/login",
            //   query: state.otherQuery
            // }).catch(err => {
            //   console.warn(err);
            // });
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
        if (state.loginForm.site === 'KA2') {
          getCaptcha()
        }
        state.coordinates.splice(0)
      },
      onSuccess: async () => {
        if (
          state.loginForm.site === 'IND' ||
          state.loginForm.site === 'IW2' ||
          state.loginForm.site === 'VNM' ||
          state.loginForm.site === 'KA2' ||
          state.loginForm.site === 'KRW'
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
        if (isClick.value === 1) {
          const coordinatesString = []
          for (let i = 0; i < state.coordinates.length; i++) {
            const obj = []
            obj.push(state.coordinates[i].x)
            obj.push(state.coordinates[i].y)
            coordinatesString.push(obj.join(','))
            state.loginForm.coordinates = coordinatesString.join('-')
          }
          state.coordinates.splice(0)
        }

        try {
          await store.dispatch(UserActionTypes.ACTION_LOGIN, state.loginForm)
        } catch (e) {
          if (e.message === '验证失败') {
            methods.onFail()
          } else if (
            state.loginForm.site === 'VNM' ||
            state.loginForm.site === 'KA2'
          ) {
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
          languageVal === 'vi' ||
          languageVal === 'en' ||
          languageVal === 'kr' ||
          state.loginForm.site === 'VNM' ||
          state.loginForm.site === 'KA2'
            ? 1
            : 0
        dragCoordinate.value = 0
        if (state.loginForm.site === 'XF1' || state.loginForm.site === 'DY2' || state.loginForm.site === 'LH1') {
          isClick.value = 0
        }
        const { data } = await getVerificationImage(imgType, isClick.value)
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
      onDrag: () => {
        var image = document.getElementById('imageRef')
        var puzzle = document.getElementById('puzzleRef')
        puzzle.style.marginLeft = dragCoordinate.value / 100 * image.offsetWidth + 'px'
      },
      onDragRelease: () => {
        state.loginForm.coordinates = (dragCoordinate.value / 100) * 200
        methods.userLogin()
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
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 768;
      const isCitySite = props.siteId === '10';
      const contactUrl = 'https://t.me/city88888';

      if (isMobile) {
        if (!isCitySite) {
          const customerServiceElement = document.getElementById('div-customer-service');
          window.scrollTo({
            top: customerServiceElement.offsetTop,
            behavior: 'smooth'
          });
        } else {
          window.open(contactUrl, '_blank').focus();
        }
      } else {
        if (!isCitySite) {
          const loginSwiperElement = document.getElementById('login-swiper');
          loginSwiperElement.swiper.slideTo(1);
        } else {
          window.open(contactUrl, '_blank').focus();
        }
      }
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

    const currentSite = ref({})
    const i18nStoreLanguage = i18nStore()
    const { setLanguage, languageVal } = i18nStoreLanguage
    const populateCurrentSiteData = () => {
      if (props.siteId === '6') {
        currentSite.value.firstLiner = '从东赢开始'
        currentSite.value.secondLiner = '成为传奇<br>还是成为传奇的歌颂者'
        currentSite.value.logo = dyLogo
        state.loginForm.site = 'DY2'
        setLanguage('zh')
      }
      if (props.siteId === '1') {
        currentSite.value.firstLiner = '从兴发开始'
        currentSite.value.secondLiner = '成为传奇<br>还是成为传奇的歌颂者'
        currentSite.value.logo = xfLogo
        state.loginForm.site = 'XF1'
        setLanguage('zh')
      }
      if (props.siteId === '5') {
        currentSite.value.firstLiner = 'Starts from 55ACE'
        currentSite.value.secondLiner =
          'Become a legend<br>Or become the eulogist of legend?'
        currentSite.value.logo = indLogo
        state.loginForm.site = 'IND'
        currentSite.value.lang = 'EN'
        setLanguage('en')
      }
      if (props.siteId === '9') {
        currentSite.value.firstLiner = 'Starts from 789F'
        currentSite.value.secondLiner =
          'Become a legend<br>Or become the eulogist of legend?'
        currentSite.value.logo = ind2Logo
        state.loginForm.site = 'IW2'
        currentSite.value.lang = 'EN'
        setLanguage('en')
      }
      if (props.siteId === '7') {
        // currentSite.value.firstLiner = '从雷火开始'
        // currentSite.value.secondLiner = '成为传奇<br>还是成为传奇的歌颂者'
        const firstLinerImg = require('@/assets/images/login/lh-login-2.png');
        const secondLinerImg = require('@/assets/images/login/lh-login-3.png');

        currentSite.value.firstLiner = `<img class="top-img" src="${firstLinerImg}" style="width: 95%;">`;
        currentSite.value.secondLiner = `<img class="top-img" src="${secondLinerImg}" style="width: 95%;">`;

        currentSite.value.logo = lhLogo
        state.loginForm.site = 'LH1'
        setLanguage('zh')
      }
      if (props.siteId === '8') {
        currentSite.value.firstLiner = 'Start From TFGaming'
        currentSite.value.secondLiner =
          'Nơi bắt đầu mới -Chia sẻ cơ hội-Hợp tác thành công'
        currentSite.value.logo = viLogo
        state.loginForm.site = 'VNM'

        const hasPreferredLang = route?.query?.lang;
        if (hasPreferredLang && ['en', 'vi'].includes(hasPreferredLang)) {
          setLanguage(hasPreferredLang);
        } else {
          setLanguage('vi')
        }
      }
      if (props.siteId === '15') {
        currentSite.value.firstLiner = 'Bắt đầu với KAKA'
        currentSite.value.secondLiner =
          'trở thành một huyền thoại<br/>Hoặc trở thành nhà điếu văn của huyền thoại?'
        currentSite.value.logo = kakaLogo
        state.loginForm.site = 'KA2'
        setLanguage('vi')
      }
      if (props.siteId === '10') {
        currentSite.value.firstLiner = 'Start From CITY8'
        currentSite.value.secondLiner =
          'Become a legend<br>Or become the eulogist of legend?'
        currentSite.value.logo = krLogo
        state.loginForm.site = 'KRW'
        setLanguage('kr')
      }
      if (props.siteId === '11') {
        currentSite.value.firstLiner = 'Start From B9'
        currentSite.value.secondLiner =
          'Become a legend<br>Or become the eulogist of legend?'
        currentSite.value.logo = pakLogo
        state.loginForm.site = 'PAK'
        setLanguage('zh')
      }
      if (props.siteId === '18') {
        currentSite.value.firstLiner = 'Começa a partir de 55ACE'
        currentSite.value.secondLiner =
          'Torne-se uma lenda<br>Ou torne-se o elogista da lenda?'
        currentSite.value.logo = indLogo
        state.loginForm.site = 'BR1'
        currentSite.value.lang = 'PT'
        setLanguage('pt')
      }
      if (props.siteId === '28') {
        currentSite.value.firstLiner = 'Começa a partir de AKB188'
        currentSite.value.secondLiner =
          'Torne-se uma lenda<br>Ou torne-se o elogista da lenda?'
        currentSite.value.logo = br2Logo
        state.loginForm.site = 'BR2'
        currentSite.value.lang = 'PT'
        setLanguage('pt')
      }
    }

    onMounted(() => {
      // const swiper = new Swiper('.swiper-container', swiperOptions);
      if (route.query.agent) {
        hasAffiliate.value = true
        state.regForm.codeAffiliate = route.query.agent
      } else {
        hasAffiliate.value = false
      }
      if (route.query.isreg) {
        isReg.value = true
      }
      // if (props.siteId !== '8') {
      getCode()
      // }
      if (state.loginForm.userName === '') {
        userNameRef.value.focus()
      } else if (state.loginForm.password === '') {
        passwordRef.value.focus()
      }
      var dialog = document.querySelector('.el-overlay-dialog')
      dialog.addEventListener('scroll', methods.onScrollEvent)
      window.addEventListener('resize', methods.onScrollEvent)
      populateCurrentSiteData()
      if (props.siteId === '8') {
        getCaptcha()
      }
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
      dyLogo,
      xfLogo,
      lhLogo,
      verificationImg,
      disabledDate,
      ...toRefs(state),
      ...toRefs(methods),
      getCode,
      hasAffiliate,
      step,
      isReg,
      currentSite,
      props,
      t,
      swipeToContactUs,
      passwordStep,
      googleAuthFormRef,
      quesAuthFormRef,
      resetFormRef,
      getCaptcha,
      captchaImg,
      dragCoordinate,
      isClick
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
  position: relative;
  background: url('../../assets/images/login/firstbg.svg') no-repeat center
    center;
  background-size: cover;
  &.lh {
    .inner{
      height: unset;
    }
    background: url('../../assets/images/login/lh-bg.png') no-repeat center
      center;
      background-color: #19326D;
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .first-liner {
          margin: 25px 0 !important;

        }
        .first-liner,
        .second-liner {
          max-width: unset !important;
          @media (max-width: 1100px) {
            max-width: 400px !important;
          }
        }
      }

      .right {
        display: flex;
        justify-content: center;
        .top {
          background: #fff !important;
          margin: 0 10px;
          margin-bottom: -1px;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
          @media (max-width: 768px) {
            margin: 0 1.75%;
            margin-bottom: -1px;
          }
        }

        .mid {
          position: relative;
          .top-img {
            width: 35%;
            position: absolute;
            right: 40px;
            top: 0;
            transform: translateY(-50%);
          }
        }
        .forget-pw {
          margin: 20px 0px;
          place-self: end;
        }
        .login-btn-grp {
          display: block;
          width: 100%;
          button {
            width: 100% !important;
            margin: 8px 0;
            border-radius: 4px;
          }
          .el-button--danger {
            background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%, #3981FF 100%);
          }
        }
        .contact-div {
          margin-top: 0;
          color: #3981FF;
          text-decoration: underline;
        }
      }
      .bot {
        margin-top: -1px;
        width: calc(100% - 1.1px);
      }
  }
  &.vi,
  &.kaka {
    font-family: 'Roboto';
    .loginPage .right .top .log {
      font-family: 'Roboto';
    }
    .loginPage .left {
      .second-liner {
        font-family: 'Roboto';
      }
    }
  }
  &.kaka {
    --kaka-primary: #ff4545;
    background-image: url('../../assets/images/kaka/first-bg-kaka.png');

    .el-link.el-link--primary {
      --el-link-font-color: var(--kaka-primary);
      &:hover {
        color: var(--kaka-primary);
      }
    }

    :deep(.el-input__inner) {
      background-color: #fdf4f4;
      border: 1px solid #f0d8d8;
      color: #000;
      border-radius: 14px;
      &::placeholder {
        color: #dcd5d5;
      }
    }

    .float-logo {
      position: absolute;
      top: 30px;
      left: 30px;
    }

    .loginPage {
      .right {
        .top {
          background-image: url('../../assets/images/kaka/top-kaka.png');
        }
        .bot {
          background-image: url('../../assets/images/kaka/dow-kaka.png');
        }
      }
    }

    .inner {
      max-width: 1300px;
    }

    .common-btn {
      &:not(.default-btn) {
        background-color: var(--kaka-primary);
      }
      &.default-btn {
        border-color: var(--kaka-primary);
        color: var(--kaka-primary);
      }
    }

    .loginPage {
      max-width: 1300px;
      .left {
        flex: 2;
        .first-liner {
          font-family: 'Roboto', sans-serif;
          margin-bottom: 15px;
          width: 750px;
          max-width: 750px;
        }
        .second-liner {
          width: 750px;
          max-width: 750px;
        }
      }
    }
  }
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
      .first-liner,
      .second-liner {
        max-width: 400px;
        width: 100%;
        img {
          width: 100%;
        }
      }
      .first-liner {
        margin-bottom: 3rem;
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

  &.br2 {
    background: url('../../assets/images/br2/br2-bg.png') no-repeat center;
    height: 100vh;
    .logo {
      position: absolute;
      left: 70px;
      top: 40px;
      width: 207px;
    }

    .loginPage .left .first-liner {
      max-width: 750px;
      width: 750px;
    }

    .loginPage .left .second-liner {
      max-width: 600px;
      width: 600px;
    }

    .inner {
      max-width: 1300px;
    }

    .common-btn {
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      color: #fff;
    }
  }

  &.ind-firstPage {
    background: url('../../assets/images/ind/ind-bg.png') no-repeat center;
    height: 100vh;
    .logo {
      position: absolute;
      left: 70px;
      top: 40px;
      width: 207px;
    }

    .loginPage .left .first-liner {
      max-width: 750px;
      width: 750px;
    }

    .loginPage .left .second-liner {
      max-width: 600px;
      width: 600px;
    }

    .inner {
      max-width: 1300px;
    }

    .common-btn {
      background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      color: #fff;
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

    &.ind-firstPage {
      .logo {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 150px;
      }

      .loginPage {
        padding-top: 30px;
      }
      .loginPage .left {
        width: calc(100% - 20px);
      }
      .loginPage .left .first-liner {
        max-width: none;
        width: 100%;
      }

      .loginPage .left .second-liner {
        max-width: none;
        width: 100%;
      }

      .common-btn {
        background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
      }
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

.overlapParent {
  display: grid;
  grid-template-columns: 1fr;
  .el-image {
    align-self: flex-start
  }
}

.el-image {
  grid-row-start: 1;
  grid-column-start: 1;
}

#dragInput {
  height: 25px;
  padding: 0px 10px;
  pointer-events: none;
}

#dragInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #458bff;
  cursor: pointer;
}

#dragInput::-moz-range-thumb {
  pointer-events: auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

#dragInput::-ms-thumb {
  pointer-events: auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .dialog400 {
    width: 80%;
  }
  .el-dialog {
    --el-dialog-padding-primary: 10px;

    .el-button {
      margin-top: 10px !important;
      // margin-bottom: -10px;
    }

    .el-dialog__header {
      margin: 10px 0;
    }
  }

  .verification-title {
    font-size: 0.8rem;
  }
}
</style>

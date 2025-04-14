<template>
  <div class="roles-main">
    <el-card>
      <el-row class="affiliate-info">
        <el-card
          body-style="padding: 0 10px; display:flex; justify-content: space-between; align-items: left;"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
          shadow="none"
        >
          <template #header>
            <div class="clearfix">
              <span class="role-span">{{ $t('fields.personalInfo') }}</span>
            </div>
          </template>
          <el-form label-suffix=" : " label-width="150px" label-position="left">
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="person20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.affiliateAccount')"
              >
                {{ store.state.user.name }}
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="personInfo20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item style="display: flex" :label="t('fields.realName')">
                <span
                  v-if="
                    store.state.user.realName !== 'null' &&
                      store.state.user.realName !== 'undefined' &&
                      store.state.user.realName
                  "
                  class="card-panel-num"
                >
                  {{ store.state.user.realName }}
                </span>
                <span
                  v-if="
                    store.state.user.realName === 'null' ||
                      store.state.user.realName === 'undefined' ||
                      !store.state.user.realName
                  "
                  class="card-panel-num"
                >
                  <el-form
                    ref="editForm"
                    :model="eForm"
                    :inline="true"
                    size="normal"
                  >
                    <el-form-item prop="realName">
                      <el-row>
                        <el-input
                          v-model="eForm.realName"
                          maxlength="50"
                          size="normal"
                        />
                        <el-button
                          type="primary"
                          @click="editRealName()"
                          size="normal"
                          style="margin-left: 10px"
                        >
                          {{ $t('fields.confirm') }}
                        </el-button>
                      </el-row>
                    </el-form-item>
                  </el-form>
                </span>
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="bookCoins20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item style="display: flex" :label="t('fields.balance')">
                <span v-formatter="{data: balance, type: 'money'}" />
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="bookCoins20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item style="display: flex" :label="t('fields.commissionBalance')">
                <span v-formatter="{data: commissionBalance, type: 'money'}" />
              </el-form-item>
            </el-row>
          </el-form>
        </el-card>

        <el-card
          body-style="padding: 0 10px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
          shadow="none"
        >
          <template #header>
            <div class="clearfix">
              <span class="role-span">{{ $t('fields.securityInfo') }}</span>
            </div>
          </template>
          <el-form label-suffix=" : " label-width="150px" label-position="left">
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="lockClosed20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.withdrawPassword')"
              >
                <el-button
                  v-if="hasWithdrawPw"
                  type="primary"
                  @click="showDialog('WITHDRAW_PASSWORD')"
                  style="margin-top: 10px"
                  >
                  {{ t('fields.edit') }}
                </el-button>
                <el-button
                  v-if="hasWithdrawPw"
                  type="primary"
                  @click="showForgetPassword()"
                  style="margin-top: 10px"
                >
                  {{ t('fields.forgetPassword') }}
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  @click="showDialog('WITHDRAW_PASSWORD')"
                  style="margin-top: 10px"
                >
                  {{ t('fields.bind') }}
                </el-button>
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="lockClosed20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.loginPassword')"
              >
                <el-button type="primary" @click="showDialog('PASSWORD')" style="margin-top: 10px">
                  {{ t('fields.edit') }}
                </el-button>
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="lockShield20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.securityQuestion')"
              >
                <el-button v-if="hasSecurityQn" type="primary" disabled style="margin-top: 10px">
                  {{ t('fields.binded') }}
                </el-button>
                <el-button
                  v-else
                  type="primary"
                  @click="showDialog('SECURITY_QUESTION')"
                  style="margin-top: 10px"
                >
                  {{ t('fields.bind') }}
                </el-button>
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="lockShield20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.authenticator')"
              >
                <el-button v-if="hasGoogleAuthenticator" type="primary" disabled style="margin-top: 10px">
                  {{ t('fields.binded') }}
                </el-button>
                <el-button v-else type="primary" @click="goToGoogleAuthenticator" style="margin-top: 10px">
                  {{ t('fields.bind') }}
                </el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-card>

        <el-card
          body-style="padding: 0 10px; display:flex; justify-content: space-between; align-items: center"
          :xs="12"
          :sm="12"
          :lg="6"
          class="box-card"
          shadow="none"
        >
          <template #header>
            <div class="clearfix">
              <span class="role-span">{{ $t('fields.affiliateInfo') }}</span>
            </div>
          </template>
          <el-form label-suffix=" : " label-width="180px" label-position="left">
            <el-row class="info" v-if="parseInt(store.state.user.siteId) === 10">
              <el-icon color="#7D8792">
                <Icon :icon="documentPercent20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.gamecommission')"
              >
                {{ (affInfo.revenueShare * 100).toFixed() }} %
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="documentPercent20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.commission')"
              >
                {{ (affInfo.commission * 100).toFixed() }} %
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="peopleTeam20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.downlineAffiliate')"
              >
                {{ affInfo.downlineAffiliate }}
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="peopleList20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.downlineMember')"
              >
                {{ affInfo.downlineMember }}
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="barCodeScanner20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.affiliateCode')"
              >
                {{ affInfo.affiliateCode }}
              </el-form-item>
            </el-row>
            <el-row class="info">
              <el-icon color="#7D8792">
                <Icon :icon="barCodeScanner20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                label="Platform Commission"
              >
                {{ affInfo.revenueShare }}
              </el-form-item>
            </el-row>
            <el-row class="info" v-if="affInfo.shareRatio !== null && affInfo.shareRatio.length > 0">
              <el-icon color="#7D8792">
                <Icon :icon="documentPercent20Filled" class="stats-icon" />
              </el-icon>
              <el-form-item
                style="display: flex"
                :label="t('fields.shareRatio')"
              >
                <div v-for="item in affInfo.shareRatio" :key="item.code">
                  <el-row>{{ t('affiliateShareRatio.' + item.code) }} : {{ (item.value*100).toFixed(2) }}%</el-row>
                </div>
              </el-form-item>
            </el-row>
          </el-form>
        </el-card>
      </el-row>
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      width="580px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        v-if="uiControl.dialogType === 'PASSWORD'"
        :model="pwForm"
        :rules="pwRules"
        ref="pwRef"
        size="normal"
        label-width="162px"
      >
        <el-form-item :label="t('fields.currentPassword')" prop="oldPassword">
          <el-input
            type="password"
            v-model="pwForm.oldPassword"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('fields.newPassword')" prop="password">
          <el-input
            type="password"
            v-model="pwForm.password"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('fields.confirmNewPassword')" prop="cfmPW">
          <el-input
            type="password"
            v-model="pwForm.cfmPW"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button size="normal" @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button size="normal" type="primary" @click="updatePassword">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'WITHDRAW_PASSWORD'"
        :model="withdrawPwForm"
        :rules="withdrawPwRules"
        ref="withdrawPwRef"
        size="normal"
        label-width="162px"
      >
        <el-form-item
          v-if="hasWithdrawPw"
          :label="t('fields.currentPassword')"
          prop="oldPassword"
          :rules="[{validator: validateCurrentPassword, trigger: 'blur'}]"
        >
          <el-input
            type="password"
            v-model="withdrawPwForm.oldPassword"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('fields.newPassword')" prop="password">
          <el-input
            type="password"
            v-model="withdrawPwForm.password"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('fields.confirmNewPassword')" prop="cfmPW">
          <el-input
            type="password"
            v-model="withdrawPwForm.cfmPW"
            autocomplete="off"
            style="width: 350px;"
            show-password
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button size="normal" @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button
            size="normal"
            type="primary"
            @click="updateWithdrawPassword"
          >
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>

      <el-form
        v-if="uiControl.dialogType === 'SECURITY_QUESTION'"
        :model="securityQnForm"
        :rules="securityQnRules"
        ref="securityQnRef"
        size="normal"
        label-width="162px"
      >
        <el-form-item :label="t('fields.questionOne')" prop="questionOne">
          <el-select
            v-model="securityQnForm.questionOne"
            size="normal"
            :placeholder="t('fields.questionOne')"
            class="filter-item"
            style="width: 350px;"
            @focus="populateQuestionOne"
          >
            <el-option
              v-for="item in questions.one"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.answerOne')" prop="answerOne">
          <el-input v-model="securityQnForm.answerOne" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.questionTwo')" prop="questionTwo">
          <el-select
            v-model="securityQnForm.questionTwo"
            size="normal"
            :placeholder="t('fields.questionTwo')"
            class="filter-item"
            style="width: 350px;"
            @focus="populateQuestionTwo"
          >
            <el-option
              v-for="item in questions.two"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.answerTwo')" prop="answerTwo">
          <el-input v-model="securityQnForm.answerTwo" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="t('fields.questionThree')" prop="questionThree">
          <el-select
            v-model="securityQnForm.questionThree"
            size="normal"
            :placeholder="t('fields.questionThree')"
            class="filter-item"
            style="width: 350px;"
            @focus="populateQuestionThree"
          >
            <el-option
              v-for="item in questions.three"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.answerThree')" prop="answerThree">
          <el-input
            v-model="securityQnForm.answerThree"
            style="width: 350px;"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button size="normal" @click="uiControl.dialogVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button size="normal" type="primary" @click="addSecurityQuestion">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      v-model="uiControl.showPasswordDialog"
      :title="t('fields.forgetPassword')"
      append-to-body
    >
      <el-steps :active="passwordStep" align-center>
        <!-- <el-step :title="t('forgetPassword.verifyAuth')" /> -->
        <!-- <el-step :title="t('forgetPassword.verifyQues')" /> -->
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
            <el-button
              class="common-btn"
              type="danger"
              @click="submitVerifyQues"
            >
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
              type="password"
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
              type="password"
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
  </div>
</template>

<script setup>
import { useStore } from '@/store'
import { Icon } from '@iconify/vue'
import person20Filled from '@iconify-icons/fluent/person-20-filled'
import personInfo20Filled from '@iconify-icons/fluent/person-info-20-filled'
import bookCoins20Filled from '@iconify-icons/fluent/book-coins-20-filled'
import documentPercent20Filled from '@iconify-icons/fluent/document-percent-20-filled'
import peopleTeam20Filled from '@iconify-icons/fluent/people-team-20-filled'
import peopleList20Filled from '@iconify-icons/fluent/people-list-20-filled'
import barCodeScanner20Filled from '@iconify-icons/fluent/barcode-scanner-20-filled'
import lockClosed20Filled from '@iconify-icons/fluent/lock-closed-20-filled'
import lockShield20Filled from '@iconify-icons/fluent/lock-shield-20-filled'
import { onMounted, reactive, ref } from '@vue/runtime-core'
import {
  checkHasWithdrawPw,
  createSecurityQuestion,
  getAffiliateBalance,
  getAffiliateCommissionBalance,
  getAffiliateInfo,
  getSecurityQuestions,
  getAuthenticator,
} from '../../api/affiliate'
import { required } from '../../utils/validate'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { UserActionTypes } from '@/store/modules/user/action-types'
import {
  updatePasswordRequest,
  updateWithdrawPasswordRequest,
  verifyGoogleAuthentication,
  getSecurityQuestionsList,
  verifySecurityQuestions,
  resetWithdrawPassword,
} from '../../api/user'

const store = useStore()
const { t } = useI18n()
const router = useRouter()
const editForm = ref()
const pwRef = ref()
const withdrawPwRef = ref()
const securityQnRef = ref()
const questions = reactive({
  one: [],
  two: [],
  three: [],
})
const route = useRoute()
const uiControl = reactive({
  dialogTitle: '',
  dialogType: null,
  dialogVisible: false,
  loading: false,
  securityQn: [
    { key: 1, value: t('questions.mothersName') },
    { key: 2, value: t('questions.mothersBirthday') },
    { key: 3, value: t('questions.dadsName') },
    { key: 4, value: t('questions.dadsBirthday') },
    { key: 5, value: t('questions.spouseBirthday') },
    { key: 6, value: t('questions.cityBorn') },
    { key: 7, value: t('questions.highSchool') },
    { key: 8, value: t('questions.elementarySchool') },
    { key: 9, value: t('questions.firstPetName') },
    { key: 10, value: t('questions.firstCar') },
  ],
  showPasswordDialog: false,
})
const balance = ref(0)
const commissionBalance = ref(0)
const hasWithdrawPw = ref(false)
const hasSecurityQn = ref(false)
const hasGoogleAuthenticator = ref(false)
const passwordStep = ref(1)
const googleAuthFormRef = ref(null)
const quesAuthFormRef = ref(null)
const resetFormRef = ref(null)
const securityQuestion = reactive({
  question: [],
  currentIndex: 0,
})
let twoFaCode = ''
const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0,
  shareRatio: [],
})

const eForm = reactive({
  realName: null,
})

const pwForm = reactive({
  oldPassword: '',
  password: '',
  cfmPW: '',
  siteId: '',
})

const withdrawPwForm = reactive({
  oldPassword: '',
  password: '',
  cfmPW: '',
  siteId: '',
})

const securityQnForm = reactive({
  questionOne: null,
  answerOne: null,
  questionTwo: null,
  answerTwo: null,
  questionThree: null,
  answerThree: null,
  siteId: null,
})

const googleAuthForm = reactive({
  code: '',
})

const quesAuthForm = reactive({
  answer: '',
  questionNumber: '',
})

const resetForm = reactive({
  password: '',
  confirmPassword: '',
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('message.inputPassword')))
  } else {
    if (pwForm.cfmPW !== '') {
      pwRef.value.validateField('cfmPW')
    }
    callback()
  }
}

const validateResetPass2 = async (r, v) => {
  if (v === '') {
    return Promise.reject(new Error(t('message.inputPasswordAgain')))
  } else if (v !== resetForm.password) {
    return Promise.reject(new Error(t('message.twoPasswordNotMatch')))
  } else {
    return Promise.resolve()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('message.inputPasswordAgain')))
  } else if (value !== pwForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  } else {
    callback()
  }
}

const validateWithdrawPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('message.inputPassword')))
  } else {
    if (withdrawPwForm.cfmPW !== '') {
      withdrawPwRef.value.validateField('cfmPW')
    }
    callback()
  }
}

const validateWithdrawPass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('message.inputPasswordAgain')))
  } else if (value !== withdrawPwForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  } else {
    callback()
  }
}

const validatePasswordLength = (rule, value, callback) => {
  if (value.length < 6 || value.length > 12) {
    callback(new Error(t('message.passwordLength')))
  } else {
    callback()
  }
}

const validateCurrentPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t('message.requiredOldPassword')))
  } else {
    callback()
  }
}

const pwRules = reactive({
  oldPassword: [{ validator: validateCurrentPassword, trigger: 'blur' }],
  password: [
    { validator: validatePass, trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
  ],
  cfmPW: [
    { validator: validatePass2, trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
  ],
})

const withdrawPwRules = reactive({
  password: [
    { validator: validateWithdrawPass, trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
  ],
  cfmPW: [
    { validator: validateWithdrawPass2, trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
  ],
})

const securityQnRules = reactive({
  questionOne: [required(t('message.selectAQuestion'))],
  answerOne: [required(t('message.requiredAnswer'))],
  questionTwo: [required(t('message.selectAQuestion'))],
  answerTwo: [required(t('message.requiredAnswer'))],
  questionThree: [required(t('message.selectAQuestion'))],
  answerThree: [required(t('message.requiredAnswer'))],
})

const googleAuthRules = reactive({
  code: [
    {
      required: true,
      message: t('google.google_auth_code'),
      trigger: 'blur',
    },
  ],
})

const quesAuthRules = reactive({
  answer: [
    {
      required: true,
      message: t('message.requiredAnswer'),
      trigger: 'blur',
    },
  ],
})
const resetRules = reactive({
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
})

function showDialog(type) {
  if (type === 'PASSWORD') {
    pwForm.oldPassword = null
    if (pwRef.value) {
      pwRef.value.resetFields()
    }
    uiControl.dialogTitle = t('common.changePassword')
  } else if (type === 'WITHDRAW_PASSWORD') {
    withdrawPwForm.oldPassword = null
    if (withdrawPwRef.value) {
      withdrawPwRef.value.resetFields()
    }
    if (!hasWithdrawPw) {
      uiControl.dialogTitle = t('fields.bindWithdrawPw')
    } else {
      uiControl.dialogTitle = t('fields.changeWithdrawPw')
    }
  } else if (type === 'SECURITY_QUESTION') {
    if (securityQnRef.value) {
      securityQnRef.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.bindSecurityQn')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

async function loadAffiliateInfo() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  await loadAffiliateBalance()
  await loadAffiliateCommissionBalance()
}

async function loadAffiliateBalance() {
  const { data: bal } = await getAffiliateBalance(store.state.user.id)
  balance.value = bal
}

async function loadAffiliateCommissionBalance() {
  const { data: bal } = await getAffiliateCommissionBalance(store.state.user.id)
  commissionBalance.value = bal
}

async function editRealName() {
  editForm.value.validate(async valid => {
    if (valid) {
      try {
        await store.dispatch(UserActionTypes.ACTION_UPDATE_REAL_NAME, eForm)
      } catch (e) {}
    }
  })
}

async function checkWithdrawPw() {
  const { data: exists } = await checkHasWithdrawPw(
    store.state.user.id,
    store.state.user.siteId
  )
  if (!exists) {
    hasWithdrawPw.value = false
  } else {
    hasWithdrawPw.value = true
  }
}

async function updatePassword() {
  pwRef.value.validate(async valid => {
    if (valid) {
      pwForm.siteId = store.state.user.siteId
      await updatePasswordRequest(store.state.user.id, pwForm)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.success'), type: 'success' })
    }
  })
}

async function updateWithdrawPassword() {
  withdrawPwRef.value.validate(async valid => {
    if (valid) {
      withdrawPwForm.siteId = store.state.user.siteId
      await updateWithdrawPasswordRequest(store.state.user.id, withdrawPwForm)
      if (route.query && route.query.name === 'withdrawpw') {
        router.push('/personal')
      }
      await checkWithdrawPw()
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.success'), type: 'success' })
    }
  })
}

function populateQuestionOne() {
  let copy = uiControl.securityQn
  if (securityQnForm.questionTwo) {
    copy = copy.filter(c => c.value !== securityQnForm.questionTwo)
  }
  if (securityQnForm.questionThree) {
    copy = copy.filter(c => c.value !== securityQnForm.questionThree)
  }
  questions.one = copy
}

function populateQuestionTwo() {
  let copy = uiControl.securityQn
  if (securityQnForm.questionOne) {
    copy = copy.filter(c => c.value !== securityQnForm.questionOne)
  }
  if (securityQnForm.questionThree) {
    copy = copy.filter(c => c.value !== securityQnForm.questionThree)
  }
  questions.two = copy
}

function populateQuestionThree() {
  let copy = uiControl.securityQn
  if (securityQnForm.questionOne) {
    copy = copy.filter(c => c.value !== securityQnForm.questionOne)
  }
  if (securityQnForm.questionTwo) {
    copy = copy.filter(c => c.value !== securityQnForm.questionTwo)
  }
  questions.three = copy
}

async function checkSecurityQuestion() {
  const { data: qn } = await getSecurityQuestions(
    store.state.user.id,
    store.state.user.siteId
  )
  if (qn) {
    hasSecurityQn.value = true
  } else {
    hasSecurityQn.value = false
  }
}

async function addSecurityQuestion() {
  securityQnRef.value.validate(async valid => {
    if (valid) {
      securityQnForm.siteId = store.state.user.siteId
      await createSecurityQuestion(store.state.user.id, securityQnForm)
      await checkSecurityQuestion()
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.success'), type: 'success' })
    }
  })
}

async function checkAuthenticator() {
  const { data: key } = await getAuthenticator(
    store.state.user.id,
    store.state.user.siteId
  )
  if (key) {
    hasGoogleAuthenticator.value = true
  } else {
    hasGoogleAuthenticator.value = false
  }
}

async function goToGoogleAuthenticator() {
  router.push('/personal/google-authenticator')
}

function showForgetPassword() {
  passwordStep.value = 3
  googleAuthForm.code = ''
  quesAuthForm.answer = ''
  quesAuthForm.questionNumber = ''
  resetForm.password = ''
  resetForm.confirmPassword = ''
  uiControl.showPasswordDialog = true
}

function restrictIntegerInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57 || charCode === 46) {
    event.preventDefault()
  }
}

function submitVerifyGoogle() {
  googleAuthFormRef.value.validate(async valid => {
    if (valid) {
      const { data: ret } = await verifyGoogleAuthentication(
        store.state.user.name,
        store.state.user.siteId,
        googleAuthForm.code
      )
      const { data: ret1 } = await getSecurityQuestionsList(
        store.state.user.name,
        store.state.user.siteId
      )
      twoFaCode = ret
      if (ret1 === null || ret1 === undefined) {
        ElMessage.error(t('forgetPassword.noSecurityQuestionSet'))
      }
      securityQuestion.question.push(ret1.questionOne)
      securityQuestion.question.push(ret1.questionTwo)
      securityQuestion.question.push(ret1.questionThree)
      passwordStep.value = 2
    }
  })
}

function nextQuestion() {
  securityQuestion.currentIndex =
    securityQuestion.currentIndex === 2 ? 0 : securityQuestion.currentIndex + 1
}

function submitVerifyQues() {
  quesAuthFormRef.value.validate(async valid => {
    if (valid) {
      const { data: ret } = await verifySecurityQuestions(
        store.state.user.name,
        store.state.user.siteId,
        quesAuthForm.answer,
        securityQuestion.currentIndex + 1,
        twoFaCode
      )
      twoFaCode = ret
      passwordStep.value = 3
    }
  })
}

function submitResetPassword() {
  resetFormRef.value.validate(async valid => {
    if (valid) {
      await resetWithdrawPassword(
        store.state.user.name,
        store.state.user.siteId,
        resetForm.password,
        twoFaCode
      )
      ElMessage.success(t('forgetPassword.resetSuccess'))
      uiControl.showPasswordDialog = false
    }
  })
}

onMounted(async () => {
  if (route.query && route.query.name === 'realname') {
    ElMessage({
      message: t('message.inputRealName'),
      type: 'error',
      customClass: 'toTop',
    })
  } else if (route.query && route.query.name === 'withdrawpw') {
    ElMessage({
      message: t('message.setWithdrawPassword'),
      type: 'error',
      customClass: 'toTop',
    })
  } else if (route.query && route.query.name === 'securityQn') {
    ElMessage({
      message: t('message.setSecurityQn'),
      type: 'error',
      customClass: 'toTop',
    })
  } else if (route.query && route.query.name === 'secAndPw') {
    ElMessage({
      message: t('message.setSecAndPw'),
      type: 'error',
      customClass: 'toTop',
    })
  }
  await checkWithdrawPw()
  await checkSecurityQuestion()
  await checkAuthenticator()
  await loadAffiliateInfo()
})
</script>

<style scoped>
.affiliate-info {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.affiliate-info .box-card {
  flex: 1;
  flex-wrap: wrap;
}

.referral-link {
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.box-card i {
  font-size: 20px;
  width: 30px;
}

.box-card .el-form .el-form-item {
  margin-bottom: 0;
}

.card-panel-description {
  font-weight: 700;
  margin-left: 0;
}

.card-panel-description .card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
  text-align: right;
}

.card-panel-description .card-panel-link-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}

.card-panel-description .card-panel-num {
  font-size: 20px;
  float: right;
}

.btn-group {
  margin-top: 15px;
  display: flex;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.info {
  align-items: center;
}

.el-row {
  flex-wrap: nowrap;
}

::v-deep(.el-form-item__content) {
  align-self: center;
  font-weight: bold;
}

::v-deep(.el-form-item__label) {
  color: #b3b6bd;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-card {
  border: 0;
}

.auth-container {
  margin: 20px;

  .auth-title {
    font-size: 18px;
    font-weight: 600;
    margin: 30px 0 15px 0;
  }
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

@media (max-width: 1200px) {
  .affiliate-info {
    grid-template-columns: repeat(1, 1fr);
  }

  .column {
    margin-top: 20px;
  }
}
</style>

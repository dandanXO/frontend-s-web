<template>
  <div class="roles-main">
    <el-card>
      <el-steps :active="step" align-center>
        <el-step :title="$t('google.download_install')" />
        <el-step :title="$t('google.add_key')" />
        <el-step :title="$t('google.bind_verify')" />
      </el-steps>

      <!-- dialogs -->
      <el-dialog
        :title="$t('google.popup_title')"
        v-model="uiControl.defaultDialogVisible"
        append-to-body
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <div class="dialog-body">
          <div>
            {{ $t('google.popup_msg') }}
          </div>
          <div>{{ $t('google.popup_hint') }}</div>

          <div class="confirm-btn-wrapper">
            <el-button
              class="confirm-btn"
              type="primary"
              plain
              @click="uiControl.defaultDialogVisible = false"
            >
              {{ $t('google.i_know') }}
            </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        v-model="uiControl.step2DialogVisible"
        append-to-body
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :show-close="false"
      >
        <div class="dialog-body">
          <div>
            {{ $t('google.popup_msg') }}
          </div>
          <!-- prettier-ignore -->
          <img class="step2-modal-img" src="@/assets/google-auth/step-2-modal.png" alt="modal-img">
        </div>
      </el-dialog>

      <el-dialog
        v-model="isPassDialog"
        append-to-body
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :show-close="false"
        width="500px"
      >
        <div class="dialog-body">
          <div>
            {{ $t('google.keyin_your_password') }}
          </div>
          <!-- prettier-ignore -->
          <el-input
            class="google-ver-input"
            :placeholder="$t('google.keyin_your_password')"
            v-model="passCode"
            type="password"
            clearable
          />

          <div class="confirm-btn-wrapper">
            <el-button
              class="confirm-btn"
              type="primary"
              plain
              @click="confirmPass"
            >
              {{ $t('google.next_step') }}
            </el-button>
          </div>
        </div>
      </el-dialog>

      <div class="auth-container" v-if="step === 1">
        <div class="title">{{ $t('google.download_way') }}</div>
        <div class="list-title">{{ $t('google.download_through_way') }}</div>

        <div class="flex-base-start">
          <div class="flex-col-base-start">
            <a :href="iosLink" target="_blank">
              <el-button type="primary" class="common-btn" icon="el-icon-ios">
                {{ $t('google.ios_download') }}
              </el-button>
            </a>
            <a :href="androidLink" target="_blank">
              <el-button
                type="primary"
                class="common-btn"
                icon="el-icon-android"
              >
                {{ $t('google.android_download') }}
              </el-button>
            </a>
          </div>

          <div class="qr-code-div">
            <qrcode-vue
              id="ios-qrcode"
              :value="iosLink"
              :size="150"
              level="H"
            />
            <span>{{ $t('google.ios_scan_download') }}</span>
          </div>

          <div class="qr-code-div">
            <qrcode-vue
              id="android-qrcode"
              :value="androidLink"
              :size="150"
              level="H"
            />
            <span>{{ $t('google.android_scan_download') }}</span>
          </div>
        </div>

        <div class="list-title">
          {{ $t('google.if_cannot_download_you_can') }}
          <span>Google Authenticator</span>
          {{ $t('google.or_search_in_google') }}
          <span>Google Authenticator</span>
          {{ $t('google.download_and_install') }}
        </div>

        <div class="button-lists">
          <el-button @click="goToStep(2)" type="primary" class="next-btn">
            {{ $t('google.keyin_pass') }}
          </el-button>
        </div>

        <div class="hint-text-container">
          <span class="hint-text-title">
            {{ $t('google.tips_installed') }}
          </span>
        </div>
      </div>

      <div class="auth-container" v-if="step === 2">
        <div class="auth-title">{{ $t('google.qr_code') }}</div>
        <qrcode-vue
          id="google-qrcode"
          :value="qrcodeVal"
          :size="150"
          level="H"
        />

        <div class="auth-title">{{ $t('google.secret_key') }}</div>

        <div class="auth-key-div">
          <span>{{ authKey }}</span>
          <el-button
            icon="el-icon-copy-document"
            class="auth-key-copy"
            @click="copy(authKey, `Auth Key`)"
          >
            &nbsp;
          </el-button>
        </div>

        <div class="auth-title">{{ $t('google.add_step') }}</div>

        <div class="desc">
          {{ $t('google.add_step_desc') }}
        </div>
        <div class="example-text" @click="uiControl.step2DialogVisible = true">
          {{ $t('google.check_example') }}
        </div>

        <div class="button-lists">
          <el-button
            type="primary"
            plain
            @click="goToStep(1)"
            class="common-btn"
          >
            {{ $t('google.back') }}
          </el-button>
          <el-button type="primary" @click="goToStep(3)" class="next-btn">
            {{ $t('google.next_step') }}
          </el-button>
        </div>

        <div class="hint-text-container">
          <span class="hint-text-title">{{ $t('google.small_tips') }}</span>
          <span class="hint-text">
            {{ $t('google.small_tips_info_1') }}
          </span>
          <span class="hint-text">
            {{ $t('google.small_tips_info_2') }}
          </span>
        </div>
      </div>

      <div class="auth-container" v-if="step === 3">
        <div class="auth-title">{{ $t('google.auth_code') }}</div>

        <el-input
          class="google-ver-input"
          :placeholder="$t('google.keyin_6_digit_google')"
          v-model="googleVerCode"
          maxlength="6"
          type="number"
          clearable
        />

        <div class="button-lists">
          <el-button
            type="primary"
            plain
            @click="goToStep(2)"
            class="common-btn"
          >
            {{ $t('google.back') }}
          </el-button>
          <el-button
            type="primary"
            @click="submitVerification"
            :disabled="isSubmitDisable"
            class="next-btn"
          >
            {{ $t('google.bind_now') }}
          </el-button>
        </div>

        <div class="hint-text-container">
          <span class="hint-text-title">{{ $t('google.small_tips') }}</span>
          <span class="hint-text">
            {{ $t('google.small_tips_info_1') }}
          </span>
          <span class="hint-text">
            {{ $t('google.small_tips_info_2') }}
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { validPwd2GoogleKey, bindGoogleKey } from '../../../api/affiliate'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

const step = ref(1)
const iosLink = ref(
  'https://apps.apple.com/cn/app/google-authenticator/id388497605'
)
const androidLink = ref(
  'https://pos3img.5z7p5r3z.com/com.google.android.apps.authenticator2520.apk'
)

const isPassDialog = ref(false)
const qrcodeVal = ref('')
const authKey = ref('')
const passCode = ref('')

const goToStep = async stp => {
  if (step.value === 1) {
    isPassDialog.value = true
  } else if (step.value === 2) {
    step.value = stp
  } else if (step.value === 3) {
    step.value = stp
  }
}

const confirmPass = async () => {
  if (!passCode.value) {
    ElMessage.error(t('google.please_enter_password'))
    return
  }
  const resp = await validPwd2GoogleKey(
    store.state.user.id,
    store.state.user.siteId,
    passCode.value
  )
  if (resp.code === 0) {
    const secretKey = resp.data
    const username = store.state.user.name

    authKey.value = resp.data
    qrcodeVal.value = `otpauth://totp/${username}?secret=${secretKey}`

    step.value = 2
    isPassDialog.value = false
  } else {
    ElMessage.error(resp.message)
  }
}

const copy = (text, field) => {
  navigator.clipboard.writeText(text)
  ElMessage({
    message: field + t('message.copyToClipboard'),
    type: 'success',
  })
}

const googleVerCode = ref('')
const isSubmitDisable = computed(() => {
  if (googleVerCode.value.length < 6) {
    return true
  }
  return false
})

const submitVerification = async () => {
  const resp = await bindGoogleKey(
    store.state.user.id,
    store.state.user.siteId,
    googleVerCode.value
  )
  if (resp.code !== 0) {
    ElMessage.error(resp.message)
  } else {
    ElMessage({
      message: t('google.added_success'),
      type: 'success',
      duration: 1500,
    })
    router.go(-1)
  }
}

const uiControl = reactive({
  defaultDialogVisible: true,
  step2DialogVisible: false,
})
</script>

<style lang="scss" scoped>
.el-steps {
  max-width: 1200px;
}

.auth-container {
  width: 900px;
  margin: 20px 150px;
  padding: 0 20px 0 20px;

  .title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 25px;
  }

  .button-lists {
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .auth-title {
    font-size: 18px;
    font-weight: 600;
    margin: 30px 0 15px 0;
  }

  .google-ver-input {
    width: 360px;

    -webkit-appearance: none;
    -moz-appearance: textfield;
    margin: 0;
  }

  .auth-key-div {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-background-color-base);

    span {
      font-size: 20px;
      font-weight: bold;
    }

    .auth-key-copy {
      color: var(--el-color-primary);
      background: transparent;
      border: 0;
      padding: 0 5px;
      font-size: 20px;
    }
  }

  .example-text {
    color: var(--el-color-primary);
    text-decoration: underline;
    cursor: pointer;
    margin: 15px 0 0 0;
  }
}

.hint-text-container {
  display: flex;
  flex-direction: column;

  .hint-text-title {
    color: red;
    font-size: 12px;
    margin: 10px 0;
  }

  .hint-text {
    color: red;
    font-size: 12px;
    margin: 5px 0;
  }
}

.flex-base-start {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 30px;
}

.flex-col-base-start {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: flex-start;
  gap: 15px;
}

.qr-code-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

// common class
.list-title {
  span {
    font-weight: 600;
  }
}

.common-btn {
  margin-left: 0;
  width: 170px;
  text-align: center;
}

.next-btn {
  width: 200px;
}

// modal

.dialog-body {
  div {
    margin: 0 0 25px 0;
  }

  .confirm-btn-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .confirm-btn {
      width: 250px;
    }
  }
}

// step 2 modal
.step2-modal-img {
  width: 100%;
  height: auto;
}
</style>

<template>
  <el-steps :active="step" align-center>
    <el-step title="下载安装" />
    <el-step title="添加密钥" />
    <el-step title="绑定验证" />
  </el-steps>

  <!-- dialogs -->
  <el-dialog
    :title="`身份验证器`"
    v-model="uiControl.defaultDialogVisible"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="dialog-body">
      <div>
        身份验证器是谷歌的一款动态口令工具,每隔30秒自动更新。在代理
        后台进行转账、提现、安全设置等敏感操作需要进行校验身份时,输
        入这6位身份验证码即可。
      </div>
      <div>身份验证器必须与代理账户配合使用。</div>

      <div class="confirm-btn-wrapper">
        <el-button
          class="confirm-btn"
          type="primary"
          plain
          @click="uiControl.defaultDialogVisible = false"
        >
          我知道了
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
    <div class="">
      <!-- prettier-ignore -->
      <img class="step2-modal-img" src="@/assets/google-auth/step-2-modal.png" alt="modal-img">
    </div>
  </el-dialog>

  <div class="auth-container" v-if="step === 1">
    <div class="title">下载方法：</div>
    <div class="list-title">1.通过下述地址下载：</div>

    <div class="flex-base-start">
      <div class="flex-col-base-start">
        <el-button type="primary" class="common-btn" icon="el-icon-ios">
          iOS下载
        </el-button>
        <el-button type="primary" class="common-btn" icon="el-icon-android">
          Android下载
        </el-button>
      </div>

      <div class="qr-code-div">
        <qrcode-vue id="ios-qrcode" :value="iosLink" :size="150" level="H" />
        <span>IOS扫码下载</span>
      </div>

      <div class="qr-code-div">
        <qrcode-vue
          id="android-qrcode"
          :value="androidLink"
          :size="150"
          level="H"
        />
        <span>Android扫码下载</span>
      </div>
    </div>

    <div class="list-title">
      2.倘若无法下载，您可以在苹果商店搜索"
      <span>Google Authenticator</span>
      "，或安卓应用商店搜索"
      <span>Google</span>
      身份验证器"下载安装。
    </div>

    <div class="button-lists">
      <el-button @click="goToStep(2)" type="primary" class="next-btn">
        下一步
      </el-button>
    </div>

    <div class="hint-text-container">
      <span class="hint-text-title">
        小提示：已下载安装，点击“下一步”继续即可。
      </span>
    </div>
  </div>

  <div class="auth-container" v-if="step === 2">
    <div class="auth-title">二维码</div>
    <qrcode-vue id="google-qrcode" :value="qrcodeVal" :size="150" level="H" />

    <div class="auth-title">密钥</div>

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

    <div class="auth-title">添加步骤</div>

    <div class="desc">
      打开谷歌身份验证器，点击右下角的“+”，选择“手动输入密钥”，填入任意账户和上述秘钥绑定
      (扫描二维码可以自动添加)
    </div>
    <div class="example-text" @click="uiControl.step2DialogVisible = true">
      查看示例图
    </div>

    <div class="button-lists">
      <el-button type="primary" plain @click="goToStep(1)" class="common-btn">
        返回
      </el-button>
      <el-button type="primary" @click="goToStep(3)" class="next-btn">
        下一步
      </el-button>
    </div>

    <div class="hint-text-container">
      <span class="hint-text-title">小提示：</span>
      <span class="hint-text">
        1. 手机丢失或卸载身份验证后，密钥能够帮助您找回身份验证器，请妥善保管;
      </span>
      <span class="hint-text">
        2.为了您的账户安全，绑定时请勿标注代理账户及代理后台地址。
      </span>
    </div>
  </div>

  <div class="auth-container" v-if="step === 3">
    <div class="auth-title">身份验证码</div>

    <el-input
      class="google-ver-input"
      placeholder="请输入6位谷歌验证码"
      v-model="googleVerCode"
      maxlength="6"
      type="number"
      @blur="validateGoogleVerInput"
    />

    <div class="button-lists">
      <el-button type="primary" plain @click="goToStep(2)" class="common-btn">
        返回
      </el-button>
      <el-button
        type="primary"
        @click="submitVerification"
        :disabled="isSubmitDisable"
        class="next-btn"
      >
        立即绑定
      </el-button>
    </div>

    <div class="hint-text-container">
      <span class="hint-text-title">小提示：</span>
      <span class="hint-text">
        1. 手机丢失或卸载身份验证后，密钥能够帮助您找回身份验证器，请妥善保管;
      </span>
      <span class="hint-text">
        2.为了您的账户安全，绑定时请勿标注代理账户及代理后台地址。
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const step = ref(1)
const iosLink = ref(
  'https://apps.apple.com/cn/app/google-authenticator/id388497605'
)
const androidLink = ref(
  'https://pos3img.5z7p5r3z.com/com.google.android.apps.authenticator2520.apk'
)

const qrcodeVal = ref('')
const authKey = ref('PVF256Q6EXTNA33rhkdvlmbemkc3k0pq')

const goToStep = stp => {
  step.value = stp
}

const copy = (text, field) => {
  navigator.clipboard.writeText(text)
  ElMessage({
    message: field + t('message.copyToClipboard'),
    type: 'success',
  })
}

const googleVerCode = ref('')
const isSubmitDisable = ref(true)
const validateGoogleVerInput = () => {
  if (googleVerCode.value.length < 6) isSubmitDisable.value = true
  else isSubmitDisable.value = false

  console.log(googleVerCode.value.length)
}

const submitVerification = () => {}

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
  padding: 0 250px 0 30px;

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
  justify-content: flex-start;
  gap: 45px;
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
  width: 150px;
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

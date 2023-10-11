<template>

  <el-steps :active="step" align-center>
    <el-step title="下载安装" />
    <el-step title="添加密钥" />
    <el-step title="绑定验证" />
  </el-steps>

  <div class="auth-container" v-if="step===1">
    <div class="title">下载方法：</div>
    <div class="list-title">1.通过下述地址下载：</div>

    <div class="flex-base-start">
      <div class="flex-col-base-start">
        <el-button type="primary" class="common-btn" icon="el-icon-ios">iOS下载</el-button>
        <el-button type="primary" class="common-btn" icon="el-icon-android">Android下载</el-button>
      </div>

      <div class="qr-code-div">
        <qrcode-vue id="ios-qrcode" :value="iosLink" :size="150" level="H" />
        <span>IOS扫码下载</span>
      </div>

      <div class="qr-code-div">
        <qrcode-vue id="android-qrcode" :value="androidLink" :size="150" level="H" />
        <span>Android扫码下载</span>
      </div>
    </div>

    <div class="list-title">2.倘若无法下载，您可以在苹果商店搜索"Google Authenticator"，或安卓应用商店搜索"Google 身份验证器"下载安装。</div>

    <div class="button-lists">
      <el-button @click="goToStep(2)" class="common-btn">下一步</el-button>
    </div>

    <div class="">
      <span class="hint-text">小提示：已下载安装，点击“下一步”继续即可。</span>
    </div>

  </div>

  <div class="auth-container" v-if="step===2">
    <div class="auth-title">二维码</div>
    <qrcode-vue id="google-qrcode" :value="qrcodeVal" :size="150" level="H" />

    <div class="auth-title">密钥</div>

    <div class="auth-key-div">
      <span>PVF256Q6EXTNA33rhkdvlmbemkc3k0pq</span>
      <el-icon name="copy" />
    </div>

    <div class="auth-title">添加步骤</div>

    <div class="desc">打开谷歌身份验证器，点击右下角的“+”，选择“手动输入密钥”，填入任意账户和上述秘钥绑定 (扫描二维码可以自动添加)</div>
    <div class="example-text">查看示例图</div>

    <div class="">
      <el-button @click="goToStep(1)" class="common-btn">返回</el-button>
      <el-button @click="goToStep(3)" class="common-btn">下一步</el-button>
    </div>
  </div>
  <div class="auth-container" v-if="step===3">
    <div class="title">身份验证码</div>
    <el-input placeholder="请输入6位谷歌验证码" />
    <div class="">
      <el-button @click="goToStep(2)" class="common-btn">返回</el-button>
      <el-button @click="submitVerification" class="common-btn">立即绑定</el-button>
    </div>

    <div class="">
      <span class="hint-text">小提示：</span>
      <span class="hint-text">1. 手机丢失或卸载身份验证后，密钥能够帮助您找回身份验证器，请妥善保管;</span>
      <span class="hint-text">2.为了您的账户安全，绑定时请勿标注代理账户及代理后台地址。</span>
    </div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import QrcodeVue from 'qrcode.vue'

const step = ref(1);
const iosLink = ref("https://apps.apple.com/cn/app/google-authenticator/id388497605");
const androidLink = ref("https://pos3img.5z7p5r3z.com/com.google.android.apps.authenticator2520.apk");

const qrcodeVal = ref("");

const goToStep = (stp) => {
  step.value = stp;
}

const submitVerification = () => {

}

</script>

<style lang="scss" scoped>
.el-steps{
  max-width: 1200px;
}
.auth-container {
  width: 900px;
  margin: 20px 150px;

  .title{
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 25px;
  }

  .button-lists{
    margin-top: 40px;
    margin-bottom:40px;
  }

  .hint-text{
    color: red;
    font-size: 12px;
  }

}

.flex-base-start{
  display:flex;
  align-items: center;
  justify-content: flex-start;
  gap: 45px;
  margin-bottom:30px;
}

.flex-col-base-start{
  display:flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: flex-start;
  gap: 15px;
}

.qr-code-div{
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

</style>

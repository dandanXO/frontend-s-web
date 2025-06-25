<template>
  <div class="google-login">
    <img class="google-logo" src="../../assets/images/login/google-icon.png">
    雷火投诉邮箱：leihuo188@gmail.com<el-button class="google-login-copy-btn" @click="copyMessage('leihuo188@gmail.com')">{{ isCopied ? $t('common.copied') : $t('common.copy') }}</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isCopied = ref(false);

const copyMessage = async (copyText) => {
  // Create a temporary textarea element
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = copyText;
  document.body.appendChild(tempTextarea);

  // Select the text and copy it
  tempTextarea.select();
  document.execCommand("copy");

  // Remove the temporary textarea element
  document.body.removeChild(tempTextarea);

  isCopied.value = true;
};
</script>

<style lang="scss" scoped>
.google-login {
  display:flex;
  justify-content:center;
  align-items:center;
  gap: 6px;
  background-color: #E3EFFF;
  border-radius: 12px;
  padding: 14px 8px;
  .google-logo {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
  .google-login-copy-btn {
    padding: 7px 13px;
    min-height:20px;
  }
}

</style>

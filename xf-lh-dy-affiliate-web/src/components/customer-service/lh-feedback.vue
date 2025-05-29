<template>
  <div style="display:flex;justify-content:center; align-items:center;gap:5px;">
    雷火投诉邮箱：leihuo188@gmail.com<el-button style="padding:7px 13px;min-height:20px;" @click="copyMessage('leihuo188@gmail.com')">{{ isCopied ? $t('common.copied') : $t('common.copy') }}</el-button>
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

<style lang="scss" scoped></style>

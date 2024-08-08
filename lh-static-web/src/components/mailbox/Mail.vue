<template>
  <div class="close-mail" @click="props.closeMail">
    <el-icon size="18"><ArrowLeft /></el-icon>
    返回
  </div>
  <div class="mail-container">
    <div class="mail-title">
      <span class="mail-title-text" v-html="props.mail?.title"></span>
      <span class="send-time">{{ props.mail?.sendTime }}</span>
    </div>
    <el-divider />
    <div class="mail-content" v-html="props.mail?.content.replace(/\n/g, '<br/>')"></div>
  </div>
</template>

<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";

const props = defineProps(["mail", "closeMail"]);
</script>

<style lang="scss">
.mail-container {
  padding: 10px;
}

.close-mail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  padding-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: #595959;
  }
}

.mail-title {
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;

  .mail-title-text {
    margin-bottom: 5px;
  }

  .send-time {
    font-size: 12px;
    line-height: 15px;
  }
}

.mail-content {
  overflow-wrap: break-word;
  font-size: 16px;
  color: #1d1e1f;
}

.dark {
  .close-mail {
    color: $color-white;
  }

  .mail-container {
    .mail-title {
      color: $color-white;
    }

    .mail-content {
      color: $font-3-dark;
    }
  }
}
</style>

<script setup>
import { computed, defineProps, onMounted, ref, defineExpose } from "vue";

const props = defineProps({
  systemUserTypeListToSendNotification: {
    type: Array,
    required: true,
    default: () => []
  }
});

const userTypeArr = ref([]);
const isAdminChecked = computed({
  get: () => userTypeArr.value.includes("ADMIN"),
  set: (value) => {
    if (value) {
      if (!userTypeArr.value.includes("ADMIN")) {
        userTypeArr.value.push("ADMIN");
      }
    } else {
      userTypeArr.value = userTypeArr.value.filter((type) => type !== "ADMIN");
    }
  }
});

onMounted(async () => {
  userTypeArr.value = props.systemUserTypeListToSendNotification;
});

const fetchSystemUserTypeListToSendNotification = () => {
  return userTypeArr.value;
}

// 向父元件暴露方法
defineExpose({
  fetchSystemUserTypeListToSendNotification,
});
</script>

<template>
  <el-form-item label="指定用户类型">
    <el-checkbox v-model="isAdminChecked">
      最高管理者
    </el-checkbox>
  </el-form-item>
</template>

<style scoped lang="scss">

</style>

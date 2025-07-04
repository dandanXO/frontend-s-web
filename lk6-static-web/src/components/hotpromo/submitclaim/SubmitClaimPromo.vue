<template>
  <button class="common-btn apply-btn" @click="handleSubmit()">点击申请</button>
</template>
<script setup>
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
import { onMounted, ref, reactive } from "vue";
import { submitUefaForm, submitClaimForm } from "@/api/promotion/eSportSafety";

const store = userStore();
const notify = useNotify();

const isSubmitting = ref(false);
const props = defineProps({
  promoCode: String
});
const handleSubmit = async () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }
  isSubmitting.value = true;
  const res = await submitClaimForm(props.promoCode);

  if (res.code === 0) {
    notify.success({
      type: "success",
      message: "提交申请成功"
    });
    isSubmitting.value = false;
  } else {
    notify.error({
      type: "error",
      message: res.message
    });
    isSubmitting.value = false;
  }
  // toggleESportInsuranceModal(true);
};
onMounted(() => {});
</script>
<style>
.apply-btn {
  width: fit-content;
  display: flex;
  margin: 0 auto;
  padding: 10px 20px;
  margin-top: 20px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  border-radius: 30px;
  min-width: 400px;
  font-size: 20px;
  justify-content: center;
  align-items: center;
}
</style>

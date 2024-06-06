<template>
  <confirm-modal v-model="visible" centered title="Logout" :footer="null" :width="335" @confirm="handleConfirm">
    <span class="logout-modal-description">Confirm to log out?</span>
  </confirm-modal>
</template>
<script setup>
import ConfirmModal from "@/components/common/ConfirmModal.vue";

const visible = defineModel();
const emit = defineEmits(["confirm"]);

const handleConfirm = () => {
  visible.value = false;
  emit("confirm");
};
</script>
<style scoped lang="scss">
.logout-modal-description {
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: #8c968f;
}
</style>

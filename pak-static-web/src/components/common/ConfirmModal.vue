<template>
  <a-modal v-model:visible="visible">
    <div class="confirm-modal-wrapper">
      <h3 class="confirm-modal-title">{{ title }}</h3>
      <div class="confirm-modal-content-wrapper">
        <slot />
      </div>
      <div class="confirm-modal-action-wrapper">
        <button class="confirm-modal-action cancel" @click="handleCancel">
          {{ $t("common.confirmModal.cancelButton") }}
        </button>
        <button class="confirm-modal-action confirm" @click="handleConfirm">
          {{ $t("common.confirmModal.confirmButton") }}
        </button>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
const visible = defineModel();
const emit = defineEmits(["confirm"]);
defineProps({
  title: String
});

const handleConfirm = () => {
  visible.value = false;
  emit("confirm");
};

const handleCancel = () => {
  visible.value = false;
};
</script>
<style scoped lang="scss">
.confirm-modal-wrapper {
  border-radius: 10px;

  .confirm-modal-title {
    margin-bottom: 42px;
    font-size: 18px;
    font-weight: 700;
    line-height: 20.92px;
    text-align: center;
    color: #ffffff;
  }

  .confirm-modal-content-wrapper {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    color: #8c968f;
  }

  .confirm-modal-action-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 36px;

    .confirm-modal-action {
      padding: 11px 0;
      border-radius: 4px;
      background: transparent;
      flex: 1;
      font-size: 16px;
      font-weight: 700;
      line-height: 20.92px;
      text-align: center;

      &.cancel {
        color: #ffffff;
        position: relative;

        &::after {
          position: absolute;
          content: "";
          inset: 0;
          padding: 1px;
          border-radius: 4px;
          background: linear-gradient(180deg, #13a89e 0%, #8cc63f 100%);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
      }

      &.confirm {
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        color: #000a01;
      }
    }
  }
}
</style>

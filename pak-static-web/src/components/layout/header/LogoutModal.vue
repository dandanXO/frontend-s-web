<template>
  <a-modal v-model:visible="visible" :footer="null" centered :body-style="{ padding: 0 }" :width="335">
    <div class="logout-modal-wrapper">
      <h3 class="logout-modal-title">Logout</h3>
      <span class="logout-modal-description">Confirm to log out?</span>
      <div class="logout-modal-action-wrapper">
        <button class="logout-modal-action cancel">CANCEL</button>
        <button class="logout-modal-action confirm" @click="handleConfirm">CONFIRM</button>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
const visible = defineModel();
const emit = defineEmits(["confirm"]);

const handleConfirm = () => {
  visible.value = false;
  emit("confirm");
};
</script>
<style scoped lang="scss">
.logout-modal-wrapper {
  background-color: var(--body-background-color);
  border-radius: 10px;
  padding: 13px 18px;

  .logout-modal-title {
    margin-bottom: 42px;
    font-size: 18px;
    font-weight: 700;
    line-height: 20.92px;
    text-align: center;
    color: #ffffff;
  }

  .logout-modal-description {
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    color: #8c968f;
  }

  .logout-modal-action-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 36px;

    .logout-modal-action {
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

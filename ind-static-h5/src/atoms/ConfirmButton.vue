<template>
  <q-card-actions>
    <div :class="`confirm-btn-container ${isDisabled ? 'disabled' : ''}`" @click="onBtnClick()">
      <img class="confirm-btn" src="../assets/images/index/confirm-btn.png" alt="" />
      <span class="confirm-btn-text">{{ label }}</span>
    </div>
  </q-card-actions>
</template>

<script setup>
const props = defineProps(["label", "confirmFunc", "isDisabled"]);
// NOTE: declaring won't update the value, probably defineProps cloned it.
// const { confirmFunc, isDisabled } = props;

const onBtnClick = () => {
  const { confirmFunc, isDisabled } = props;
  if (isDisabled) return;

  confirmFunc && confirmFunc();
};
</script>

<style lang="scss">
.confirm-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  // NOTE: next time straight use q-btn + background url
  // standardize opacity value 0.7 w/ quasar framework
  &.disabled {
    opacity: 0.7;
  }

  .confirm-btn {
    width: 100%;
  }

  .confirm-btn-text {
    position: absolute;
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>

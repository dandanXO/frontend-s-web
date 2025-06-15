<template>
  <q-card-actions style="padding: 0">
    <div :class="`confirm-btn-container ${isDisabled ? 'disabled' : ''}`" @click="onBtnClick()">
      <q-spinner v-if="isLoading" color="white" size="3em" :thickness="2"></q-spinner>
      <span v-else class="confirm-btn-text">{{ label }}</span>
    </div>
  </q-card-actions>
</template>

<script setup>
const props = defineProps(["label", "confirmFunc", "isDisabled", "isLoading"]);
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
  margin: 26px 0;
  width: 100%;
  //height: 46px;
  aspect-ratio: 295/42;
  background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
  // background: linear-gradient(187.94deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
  border-radius: 8px;
  height: 56px;

  // NOTE: next time straight use q-btn + background url
  // standardize opacity value 0.7 w/ quasar framework
  &.disabled {
    opacity: 0.85;
  }

  .confirm-btn {
    width: 100%;
  }

  .confirm-btn-text {
    position: absolute;
    font-size: 1.25rem;
    font-weight: bold;
    color: #ffffff;
  }

  .q-spinner {
    position: absolute;
  }
}

.q-card--dark {
  box-shadow: none;
}
</style>

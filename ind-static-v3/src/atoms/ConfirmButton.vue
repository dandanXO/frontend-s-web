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
  // background: radial-gradient(68.92% 68.92% at 50% 50%, #00550e 0%, #57cd69 100%);
  background: linear-gradient(189.71deg, #a8ef9c 7.08%, #2f961e 92.75%);

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
    // color: #fff;
    color: #284426;
  }

  .q-spinner {
    position: absolute;
  }
}

.q-card--dark {
  box-shadow: none;
}
</style>

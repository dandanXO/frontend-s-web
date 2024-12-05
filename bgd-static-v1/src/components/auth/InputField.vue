<template>
  <span class="form-field-label">{{ props.label }}</span>
  <div class="landing-input" :class="{ fancy: fancy }">
    <slot name="input"></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  fancy: Boolean
});
</script>

<style lang="scss" scoped>
@import "../../css/mixin.scss";

.form-field-label {
  margin-top: 6px;
  color: #8c968f;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    background-color: #ffffff1a;
    // border: 2px solid transparent;
  }
  :deep(.q-field__control):before {
    @include gradient-border(
      linear-gradient(90deg, rgba(243, 195, 93, 0.15) 0%, rgba(243, 195, 93, 0) 24%, rgba(243, 195, 93, 0.15) 100%)
    );
  }
}

.fancy {
  $input-height: 48px;
  :deep(.q-input) {
    &.q-field--error {
      .q-field__control {
        background-image: url(../../assets/images/auth/input-bg-error.png);
      }
    }
    &.q-field--focused {
      .q-field__control {
        background-image: url(../../assets/images/auth/input-bg-active.png);
      }
    }
    .q-field__control {
      border: none;
      background-color: transparent;
      background: url(../../assets/images/auth/input-bg.png) no-repeat center center;
      background-size: 100% 100%;
      height: $input-height;
      &::before,
      &::after {
        display: none;
      }
      .q-field__marginal {
        height: $input-height;
      }
    }
  }
}
</style>

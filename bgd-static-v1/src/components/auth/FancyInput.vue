<template>
  <div class="test">
    <slot />
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
$input-height: 48px;

.test {
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

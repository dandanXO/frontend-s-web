<template>
  <div class="form-fields">
    <slot name="fields"></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.form-fields {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;
}
</style>

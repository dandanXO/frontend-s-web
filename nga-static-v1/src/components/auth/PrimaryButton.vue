<template>
  <q-btn
    @click.prevent="props.onClick"
    type="button"
    class="primary-btn"
    :class="{
      small: props.isSmall,
      isred: props.isHot
    }"
    :label="props.label"
    rounded
    no-caps
    :disabled="props.disabled"
    :loading="props.loading"
    unelevated
  >
    <template #loading>
      <q-spinner-hourglass size="24px" color="white" />
    </template>
  </q-btn>
</template>

<script setup>
const props = defineProps(["onClick", "label", "isSmall", "isHot"]);
</script>

<style lang="scss">
.primary-btn {
  background: url(../../assets/images/auth/primary-btn.png) no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 56px;
  border-radius: 4px;

  text-transform: uppercase;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 27.4px;

  &.small {
    background: url(../../assets/images/auth/primary-btn-short.png) no-repeat center center;
    background-size: 100% 100%;
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    height: auto;
    width: auto;
  }

  &.isred {
    background: url(../../assets/images/auth/primary-btn-short-red.png) no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>

<template>
    <q-btn @click.prevent="props.onClick" type="button" class="primary-btn" :label="props.label" rounded no-caps :disabled="props.disabled" :loading="props.loading">
        <template #loading>
            <q-spinner-hourglass size="24px" color="white" />
        </template>
    </q-btn>
</template>

<script setup>
    const props = defineProps(['onClick', 'label']);
</script>

<style lang="scss">
.primary-btn {
  background: url(../../assets/images/auth/primary-btn.png) no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  margin-top: 30px;
  
  text-transform: uppercase;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 27.4px;
}
</style>
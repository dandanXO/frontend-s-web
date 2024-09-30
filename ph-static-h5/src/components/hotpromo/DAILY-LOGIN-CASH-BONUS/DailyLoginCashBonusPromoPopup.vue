<template>
    <q-dialog v-model="visible" persistent>
        <div style="background:transparent;display:flex;flex-direction: column;">
            <q-icon v-close-popup name="cancel" size="md" color="white" style="margin-left:auto;" />
            <CheckInCalendar :isModal="true" />
        </div>
    </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import CheckInCalendar from "./CheckInCalendar.vue";

const visible = ref(false);

const open = () => {
    visible.value = true;
}

defineExpose({
    open
})
</script>
<style lang="scss" scoped>
</style>
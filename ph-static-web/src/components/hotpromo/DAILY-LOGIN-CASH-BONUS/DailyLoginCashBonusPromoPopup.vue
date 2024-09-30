<template>
    <a-modal 
        v-model:visible="visible"
        :footer="null"
        width="70%"
        :mask-closable="true"
        destroy-on-close
        centered>
            <div class="vip-daily-login-gift-header">VIP Day login gift</div>
            <CheckInCalendar :isModal="true" />
        </a-modal>
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
.vip-daily-login-gift-header {
    color: #222;
    font-size: 30px;
    font-weight: 900;
    max-width: 80vw;
    margin: 0 auto;
    padding: 0px 20px;
}

.dark-theme {
    .vip-daily-login-gift-header {
        color: #fff;
    }
}
</style>
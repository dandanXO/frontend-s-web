<template>
    <q-badge :label="unreadCount" class="red-dot shake" v-if="unreadCount" rounded style=""
        :title="$t('lang.message_unread')" :key="unreadCount" />
</template>
<script setup>
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";

const store = userStore();
const { unreadCount } = storeToRefs(store);
</script>
<style lang="scss" scoped>
.red-dot {
    position: absolute;
    top: -5px;
    right: -5px;
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
    background: #DF3D31;
    margin: auto;
    min-height: 9px;
    padding: 2px 4.5px;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
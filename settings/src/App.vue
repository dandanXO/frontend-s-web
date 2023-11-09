<script setup>
import { RouterView } from 'vue-router';
import CommonHeader from './components/CommonHeader.vue';
import CommonSidebar from './components/CommonSidebar.vue';
</script>

<template>
    <keep-alive>
        <CommonHeader></CommonHeader>
    </keep-alive>

    <div class="settings">
        <CommonSidebar></CommonSidebar>
        <RouterView />
    </div>
</template>

<style scoped>
.settings {
    width: 75%;
    margin: 0 auto;
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
}
</style>

<template>
    <div class="app-download-section">
        <HomeDownload :hideTitle="true"></HomeDownload>
    </div>
</template>

<script setup>
import HomeDownload from "@/components/home/download/index.vue";
</script>

<style scoped lang="scss">
.app-download-section {
    background-image: url("../assets/images/home/main-bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: top center;
    padding: 50px;
    width: 100%;
}
</style>

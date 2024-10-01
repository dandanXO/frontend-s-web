<template>
    <div class="container">
        <img class="guide-img" src="../assets/images/agentRegGuide/agent-reg-guide-img.png" />
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    .container {
        background: url('../assets/images/agentRegGuide/agent-reg-guide-bg.png') no-repeat center center;
        background-size: 100% 100%;
        position: relative;

        .guide-img {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 5%;
        }
    }
</style>
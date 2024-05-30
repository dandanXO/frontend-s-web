<template>
    <div class="app-tutorial-container">
        <img class="tutorial-img" src="../assets/images/appTutorial/1.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/2.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/3.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/4.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/5.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/6.png" />
    </div>
</template>

<script setup>
</script>

<style lang="scss">
.app-tutorial-container {
    background: url('../assets/images/appTutorial/bg.jpg') repeat-y top center;
    background-size: contain;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    gap: 50px;

    .tutorial-img {
        width: 85%;
    }
}
</style>
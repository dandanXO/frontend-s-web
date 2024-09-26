<template>
    <div class="app-tutorial-container">
        <img class="tutorial-img" src="../assets/images/appTutorial/registration.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/kyc.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/security-verification.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/binding-bank-card.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/deposit-1.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/deposit-2.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/withdraw.png" />
        <img class="tutorial-img" src="../assets/images/appTutorial/games.png" />
    </div>
</template>

<script setup>
</script>

<style lang="scss">
.app-tutorial-container {
    background: url('../assets/images/appTutorial/bg.jpg') repeat-y top center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 5px;

    .tutorial-img {
        width: 100%;
    }
}
</style>
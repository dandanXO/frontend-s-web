<template>
    <div class="progress-container">
        <div>
            <div class="section-header">Event terms</div>
            <div class="desc-list">
                <div class="desc-list-item">
                    <div class="bullet-point">
                        <img src="../../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
                    </div>
                    <div class="desc-text">
                        For members with deposit amount over 300 at play4win
                    </div>
                </div>
                <div class="desc-list-item">
                    <div class="bullet-point">
                        <img src="../../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
                    </div>
                    <div class="desc-text">
                        The account name, contact number, the bank card and E-wallet binded to the active member cannot be
                        duplicated
                    </div>
                </div>
            </div>

            <div class="section-header">Who can help you to get reward</div>
            <div class="desc-list">
                <div class="desc-list-item">
                    <div class="bullet-point">
                        <img src="../../../assets/images/finance/withdraw/diamond-bullet-icon.svg" />
                    </div>
                    <div class="desc-text">
                        It must not be the same as the IP, contact number, binded bank card and E-wallet of any member in
                        play4win. Meanwhile, if anyone registration information is the same as any other members, cant help
                        you increace your progress.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>

<style lang="scss" scoped>
.progress-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 15px;
    gap: 15px;
    align-items: center;

    .section-header {
        font-size: 16px;
        font-weight: 700;
    }

    .desc-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px;
    }

    .desc-list-item {
        font-size: 14px;
        display: flex;
        align-items: flex-start;
        gap: 10px;

        .desc-text {
            color: #6892c7;
        }
    }
}

.body--dark {
    .progress-container {

        .section-header {
            color: #fff
        }
    }
}
</style>
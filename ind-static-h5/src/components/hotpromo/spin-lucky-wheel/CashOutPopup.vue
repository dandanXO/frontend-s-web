<template>
    <q-dialog v-model="_modelValue" @hide="hideCashOutPopup">
        <div v-if="isShowInviteWins" class="invite-wins">
            <InviteWins />
        </div>
        <div class="cash-out" v-else>
            <GradientTextAmount :amountText="`CASH OUT COSTS  ${extractionDifference}$`" :width="300" />
            <span class="next-spin-remaining-time">COUNTDOWN: {{ nextFreeSpinRemainingTime }}</span>
            <img class="cash-out-backdrop"
                src="../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/cash-out-backdrop.png" />
            <ProgressBar />
            <CommonButton class="close-btn" @click="showInviteWins">Invitation wins</CommonButton>
        </div>
    </q-dialog>
</template>
<script setup>
import { computed, inject, ref } from "vue";
import CommonButton from "./CommonButton.vue";
import GradientTextAmount from "./GradientTextAmount.vue";
import ProgressBar from "./ProgressBar.vue";
import InviteWins from "./InviteWins.vue";

const props = defineProps(["modelValue", "prize"]);
const emit = defineEmits(["update:modelValue", "hide"]);
const showInviteWins = () => isShowInviteWins.value = true;

defineExpose({
    showInviteWins
});

const isShowInviteWins = ref(false);

const _modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value)
});

const hideCashOutPopup = () => {
    isShowInviteWins.value = false;
    emit('hide');
}

const extractionDifference = inject('extractionDifference');
const nextFreeSpinRemainingTime = inject('nextFreeSpinRemainingTime');

</script>
<style lang="scss" scoped>

.invite-wins {
    width: 90%;
    background: url(../../../assets/images/promotion/spin-lucky-wheel/wheel-stage/invite-win-popup-bg.png) no-repeat;
    aspect-ratio: 957 / 1152;
    background-size: cover;
    position: relative;
    padding: 40px 20px;
}
.cash-out-backdrop {
    aspect-ratio: 861 / 720;
    width: 100%;
}

.cash-out {
    width: 85%;

    .prize {
        position: absolute;
        top: 20%;
        width: 100%;
        font-size: 56px;
        font-weight: 900;
        color: #8100ae;
        text-align: center;
    }

    .close-btn {
        width: 65%;
        aspect-ratio: 228 / 90;
        margin: 0 auto;
    }
}

@media screen and (max-width: 500px) {
    .cash-out {
        .prize {
            font-size: 11vw;
        }
    }
}

.next-spin-remaining-time {
    display: flex;
    justify-content: center;
    font-family: Inter;
    font-weight: 700;
    font-size: 20px;
    line-height: 24.2px;
    letter-spacing: 0px;
}
</style>

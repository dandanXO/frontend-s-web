<template>
    <div class="gradient-amount-wrapper">
        <svg class="prize" width="300px" :height="`${props?.height || 60}px`" style="" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gradientAmount" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="#FDFD7A" />
                    <stop offset="100%" stop-color="#F75F00" />
                </linearGradient>
            </defs>
            <text id="test" class="amount" :style="`font-size: ${props?.fontSize}`" x="50%" y="60%" dominant-baseline="middle" text-anchor="middle">{{
                props?.amountText }}</text>
        </svg>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['amountText', 'height', 'fontSize']);
const isLongText = computed(() => props?.amountText?.length > 10);
</script>

<style lang="scss" scoped>
.gradient-amount-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .amount {
        font-size: 26px;
        font-weight: 900;
        font-style: italic;
        fill: url(#gradientAmount);
        text-shadow: 1px 3px #791802;
    }
}

@media screen and (max-width: 400px) {
    .gradient-amount-wrapper {
        .amount {
            font-size: 24px;
        }
    }
}


@media screen and (max-width: 350px) {
    .gradient-amount-wrapper {
        .amount {
            font-size: 22px;
        }
    }
}
</style>

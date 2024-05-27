<template>
    <div class="category-list">
        <div :class="`category ${category.name} ${props.selectedCategory === category.name ? 'active' : ''}`" v-for="(category, categoryIndex) in categoryList" :key="categoryIndex" 
            @click="() => props.onClickGameCategory(category.name, categoryIndex)">
            <div class="category-labels">
                <div class="category-kr-label">{{ category.label }}</div>
                <div class="category-en-label">{{ category.enLabel }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const categoryList = [
    { name: "live", label: "라이브카지노", enLabel: "LIVE CASINO" },
    { name: "slots", label: "슬롯게임", enLabel: "SLOT GAME" },
    { name: "esport", label: "E-스포츠", enLabel: "ESPORTS" },
    { name: "sport", label: "스포츠", enLabel: "SPORTS" },
    { name: "casual", label: "미니게임", enLabel: "MINI GAME" }
    // { name: "fish", label: "낚시 게임" }
];

const props = defineProps(['onClickGameCategory', 'selectedCategory']);
</script>

<style lang="scss" scoped>
.category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 20px;
    justify-content: center;

    
    @media (max-width: 768px) {
        padding: 5px;
        gap: 0px;
        flex-wrap: nowrap;
    }
}

.category {
    margin: 5px;
    filter: grayscale(1) brightness(1.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-width: 180px;
    max-width: 200px;
    height: 80px;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
    overflow: hidden;
    border: 1px solid #5dd8ff;
    transform: skewX(-16deg);
    border-radius: 10px;
    position: relative;

    @media (max-width: 768px) {
        min-width: 50px;
        max-width: 80px;
        transform: skewX(-8deg);
        border-radius: 4px;
        border: 1px solid #4b4b4b;
        height: 70px;
    }

    .category-labels {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-45%, -50%) skewX(16deg);
        overflow: auto;
        width: 180px;

        @media (max-width: 768px) {
            width: 60px;
            white-space: pre-wrap;
            text-align: center;
            transform: translate(-45%, -50%) skewX(8deg);
        }

        .category-kr-label {
            color: #01d9ab;
            font-size: 24px;
            font-weight: bold;

            @media (max-width: 768px) {
                font-size: 18px;
            }
        }

        .category-en-label {
            font-size: 10px;
            color: #fff;

            @media (max-width: 768px) {
                display: none;
            }
        }
    }

    &.slots {
        background: url('../../assets/home/menu/menu-slots.png') no-repeat center center;
        background-size: 120% 120%;
    }

    &.live {
        background: url('../../assets/home/menu/menu-live.png') no-repeat center center;
        background-size: 120% 120%;
    }

    &.esport {
        background: url('../../assets/home/menu/menu-esport.png') no-repeat center center;
        background-size: 120% 120%;
    }

    &.sport {
        background: url('../../assets/home/menu/menu-sport.png') no-repeat center center;
        background-size: 120% 120%;
    }

    &.casual {
        background: url('../../assets/home/menu/menu-casual.png') no-repeat center center;
        background-size: 120% 120%;
    }

    @media (max-width: 768px) {
        &.slots {
            background: url('../../assets/home/menu/menu-slots-mobile.png') no-repeat center center;
            background-size: 120% 120%;
        }

        &.live {
            background: url('../../assets/home/menu/menu-live-mobile.png') no-repeat center center;
            background-size: 120% 120%;
        }

        &.esport {
            background: url('../../assets/home/menu/menu-esport-mobile.png') no-repeat center center;
            background-size: 120% 120%;
        }

        &.sport {
            background: url('../../assets/home/menu/menu-sport-mobile.png') no-repeat center center;
            background-size: 120% 120%;
        }

        &.casual {
            background: url('../../assets/home/menu/menu-casual-mobile.png') no-repeat center center;
            background-size: 120% 120%;
        }
    }

    &:hover, &.active {
        filter: grayscale(0);
        background-size: 130% 130%;
    }
}
</style>
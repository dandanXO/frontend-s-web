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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: center;
}
.category {
    margin: 5px;
    filter: grayscale(1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-width: 180px;
    height: 80px;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
    overflow: hidden;
    border: 1px solid #5dd8ff;
    transform: skewX(-16deg);
    border-radius: 10px;
    position: relative;

    .category-labels {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-45%, -50%) skewX(16deg);
        overflow: auto;
        width: 180px;

        .category-kr-label {
            color: #01d9ab;
            font-size: 24px;
            font-weight: bold;
        }

        .category-en-label {
            font-size: 10px;
            color: #fff;
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

    &:hover, &.active {
        filter: grayscale(0);
        background-size: 130% 130%;
    }
}
</style>
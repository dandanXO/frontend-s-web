<template>
    <q-intersection>
        <q-resize-observer debounce="500" @resize="newSize => size = newSize" />
    </q-intersection>
    <q-virtual-scroll :items="gameList" separator v-slot="{ item: games, index }" class="slot-grid-virtualized">
        <div :key="index" class="slot-grid-row" :style="`grid-template-columns: repeat(${arrSize}, 1fr)`">
            <q-img class="slot-grid-item" @click="openSlotGame(game.name, game.code, selectedPlat.status, game)"
                v-for="game in games" :key="game.id" loading="lazy" :src="game.icon" :placeholder-src="game.default"
                fit="fill" height="auto" spinner-color="white" position="50% 20%"
                style="border-radius: 20px; overflow: hidden" :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''">
                <template v-slot:loading>
                    <img :src="game.default" style="width: 100%; height: 100%; border-radius: 15px; overflow: hidden" />
                </template>
            </q-img>
        </div>
    </q-virtual-scroll>
</template>

<script setup>
import { computed, ref } from 'vue';
const props = defineProps(['gameList', 'openSlotGame', 'selectedPlat']);

const size = ref();

const arrSize = computed(() => {
    if (size.value?.width <= 400) {
        return 3;
    }

    if (size.value?.width <= 600) {
        return 4;
    }

    if (size.value?.width <= 900) {
        return 6;
    }

    return 9;
});

const gameList = computed(() => {
    return chunk(props.gameList || [], arrSize.value);
})
const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}
</script>

<style lang="scss">
.slot-grid-virtualized {
    max-height: 500px;
}

.slot-grid-row {
    display: grid;
    gap: 20px;
    padding-bottom: 20px;
}

.slot-grid-item {
    cursor: pointer;
}
</style>
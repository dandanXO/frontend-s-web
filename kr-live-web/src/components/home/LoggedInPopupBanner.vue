<template>
    <q-dialog v-model="isVisible" no-route-dismiss persistent>
        <div>
            <div style="text-align: right;">
                <img class="header-close-btn" src="../../assets/images/index/modal-close-btn.svg"
                    @click="closeDialog" />
            </div>
            <img class="banner-img" :src="require('/src/assets/images/index/kr-logo.png')" />
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { userStore } from "stores/index";
import { storeToRefs } from "pinia";

const isVisible = ref(false);
const hasShown = ref(false);
const store = userStore();
const { token } = storeToRefs(store);

watch(() => token.value, () => {
    if (hasShown.value === false) {
        isVisible.value = true;
        hasShown.value = true;
    }
})

const closeDialog = () => {
    isVisible.value = false;
};
</script>

<style lang="scss" scoped>
.banner-img {
    width: 100%;
}

.header-close-btn {
    width: 40px;
    cursor: pointer;

    &:hover {
        filter: brightness(0.8);
    }
}
</style>
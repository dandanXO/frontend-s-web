<template>
    <div>
        <div class="platform-menu lottery">
            <div
                class="platform-box"
                v-for="nav in navigations"
                :key="nav.code"
                @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                <img
                    class="plat-icon"
                    :src="
                        require('../../assets/lottery/logo_' +
                            nav.icon +
                            '.png')
                    "
                />

                <p class="platform-title">{{ nav.label }}</p>

                <div class="platform-img" :class="'lottery-' + nav.icon"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    data: () => ({
        navigations: [
            {
                code: "TCG",
                icon: "tcg",
                label: "TCG彩票",
                slogan: "TCG",
            },
            // {
            //     code: "BBIN",
            //     icon: "bbin",
            //     label: "BBIN彩票",
            //     slogan: "BBIN",
            // },
        ],
    }),
});
</script>

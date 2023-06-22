<template>
    <div>
        <div class="platform-menu lottery">
            <div
                class="platform-box"
                v-for="nav in navigations"
                :key="nav.code"
                @click="$emit('loadModal', nav.label, nav.code, nav.gameCode)"
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
              gameCode: ""
            },
            {
                code: "BBINDY",
                icon: "bbin",
                label: "BBIN彩票",
                slogan: "BBIN",
              gameCode: "bbkeno_lobby_pc"
            },
            {
                code: "SGWin",
                icon: "sgwin",
                label: "SG-WIN彩票",
                slogan: "SGWin ",
              gameCode: "imlotto30000"
            },
        ],
    }),
});
</script>

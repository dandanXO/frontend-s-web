<template>
    <div>
        
        <div class="platform-menu games">
            
          <div
              class="platform-box"
              v-for="nav in navigations"
              :key="nav.code"
            >
                <router-link :to="`/game?plat=${nav.code}`">
                <img :src="require('../../assets/game/header_slot_logo_'+ nav.icon + '.png')" style="width: 75px;">
                <p class="platform-title">{{ nav.label }} 电子</p>
                <div class="platform-img" :class="'slot-' + nav.icon"></div>
                </router-link>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">电子游艺</p>
            <p class="fs-name">SLOT<br>GAME</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage p128"></div>
        </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        navigations: [
        { code: "AT", icon: "pp", label: "AT" },
        { code: "AMEBA", icon: "mg", label: "AMEBA" },
        { code: "PT", icon: "pt", label: "PT" },
        { code: "SW", icon: "sw", label: "SW" },
        { code: "BBIN", icon: "pg", label: "BBIN" },
        { code: "CQ9", icon: "sg", label: "CQ9" },
        ],
    }),
    setup() {
        
    },
})
</script>
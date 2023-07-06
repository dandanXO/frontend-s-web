<template>
    <div>
        
        <div class="platform-menu esports">
            
          <div
              v-for="nav in navigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                    <div class="platform-box">
                        <div class="imgbox" :style="`background-position-x: ${nav.percentage}`"></div>
                    <div class="contents">
                    <p class="platform-title">{{ nav.label }}电竞</p>
                    <p class="platform-slogan">{{ nav.slogan }}</p>
                    </div>
                    </div>
          </div>
          <div class="header-fs-box">
            <!-- <p class="fs-title">体育娱乐</p> -->
            <p class="fs-name">ELECTRONIC<br>SPORT</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage"></div>
        </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        navigations: [
        { code: "TFGaming", icon: "dy", label: "东赢", slogan: "亚洲第一 实时滚球", percentage: '32.48%' },
        { code: "IMES", icon: "im", label: "IM", slogan: "赛事齐全 玩法新颖", percentage: '66.7%' },
        // { code: "IA", icon: "ai", label: "小艾", slogan: "崭新玩法 全新体验", percentage: '99.4%' },
        ],
    }),
    setup() {
    },
})
</script>

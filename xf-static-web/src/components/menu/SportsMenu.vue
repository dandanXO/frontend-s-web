<template>
    <div>
        
        <div class="platform-menu sports">
            
          <div
              v-for="nav in navigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                    <div class="platform-box">
                    <img :src="require('../../assets/sports/sport_logo_'+ nav.icon + '.png')">
                    <div class="contents">
                    <p class="platform-title">{{ nav.label }} 体育</p>
                    <p class="platform-slogan">{{ nav.slogan }}</p>
                    <div class="platform">SPORT GAME</div>
                    </div>
                    </div>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">体育娱乐</p>
            <p class="fs-name">SPORT<br>GAME</p>
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
        { code: "IM", icon: "im", label: "IM", slogan: "赛事最多 玩法新颖" },
        // { code: "CR", icon: "xf", label: "CR", slogan: "崭新玩法 感受精彩" },
        ],
    }),
    setup() {
    },
})
</script>

<template>
    <div>
        
        <div class="platform-menu sports">
            
          <div
              class="platform-box"
              v-for="nav in navigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                <img :src="require('../../assets/poker/poker_logo_'+ nav.image + '.png')">
                <div class="contents">
                <p class="platform-title">{{ nav.label }}棋牌</p>
                <p class="platform-slogan">{{ nav.slogan }}</p>
                <div class="platform">CHESS GAME</div>
                </div>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">棋牌娱乐</p>
            <p class="fs-name">CHESS<br>GAME</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage"></div>
        </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data: () => ({
        navigations: [
        { code: "DT", image: "tx", label: "大唐", slogan: "赛事最多 玩法新颖" },
        { code: "KY", image: "ky", label: "开元", slogan: "崭新玩法 感受精彩" },
        ],
    }),
})
</script>

<template>
    <div>

        <div class="platform-menu poker">

          <div
              class="platform-box"
              v-for="nav in navigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label,  nav.code, nav.gameCode)"
            >
                <div class="imgbox" :style="`background-position-x: ${nav.percentage}`"></div>
                <div class="contents">
                <p class="platform-title">{{ nav.label }}棋牌</p>
                <p class="platform-slogan">{{ nav.slogan }}</p>
                <div class="platform">CHESS GAME</div>
                </div>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">棋牌游戏</p>
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
        { code: "DT", image: "tx", label: "大唐", slogan: "赛事最多 玩法新颖" , gameCode: '' },
        { code: "KYDY", image: "ky", label: "开元", slogan: "崭新玩法 感受精彩", gameCode: 'ky_lobby' },
        ],
    }),
})
</script>

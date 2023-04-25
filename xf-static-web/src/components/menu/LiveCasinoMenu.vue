<template>
    <div>
        
        <div class="platform-menu live">
            
          <div
              class="platform-box"
              v-for="nav in navigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                <img :src="require('../../assets/live/live_logo_'+ nav.icon + '.png')" style="width: 200px;">
                <p class="platform-title">{{ nav.label }} 真人</p>
                <p class="platform-slogan">{{ nav.slogan }}</p>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">真人娱乐</p>
            <p class="fs-name">LIVE<br>EVENTS</p>
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
        { code:"AG", icon: "ag", label: "AG", slogan: "全球顶尖, 尊享娱乐" },
        { code:"EBET", icon: "ebet", label: "EBET", slogan: "全球顶尖, 尊享娱乐"  },
        { code:"ALLBET", icon: "allbet", label: "ALLBET", slogan: "全球顶尖, 尊享娱乐"  },
        { code:"BBIN", icon: "bbin", label: "BBIN", slogan: "全球顶尖, 尊享娱乐"  },
        ],
    }),
})
</script>

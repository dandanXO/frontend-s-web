<template>
    <div>
        
        <div class="platform-menu promo">
            
          <div
              v-for="nav in navigations"
              :key="nav.code"
            >
            <router-link :to="nav.link" 
              class="platform-box">
                <img :src="require('../../assets/promo/header_promo'+ nav.code + '.png')">
                <div class="contents">
                <p class="platform">{{ nav.label }} </p>
                <p class="platform-slogan">{{ nav.slogan }}</p>
                </div>
            </router-link>
          </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        navigations: [
        { code: "1", label: "劲爆优惠", slogan: "新用户开户即享  68%优惠红利", link: "/promotion" },
        { code: "2", label: "VIP 尊享", slogan: "贵者为宾 尊者为君 尽享VIP尊贵礼遇", link: "/vip" },
        ],
    }),
    setup() {
        
    },
})
</script>

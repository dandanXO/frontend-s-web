<template>
    <div>
        
        <div class="platform-menu fish">
            
          <div
              class="platform-box"
              v-for="nav in navigations"
              :key="nav.code"              
              @click="$emit('loadModal', nav.name, nav.code, nav.gameCode)"
            >
                <img :src="require('../../assets/fishing/header_fish_'+ nav.image + '.png')" style="height: 40px;">
                <p class="platform-title">{{ nav.code }}捕鱼</p>
                <div class="platform-img" :class="'fish-' + nav.image"></div>
          </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        navigations: [
        {
            gameCode: '7202',
            name: '决战中途岛',
            code: 'GPS',
            image: 'gps',
            message: '决战中途岛是历史上一场经典的战役是太平洋战争的转捩点，进入游戏画面之后爽快的操控自己的飞机然后对着天空中的敌人射击！让你享受子弹最极速画面最丰富翱翔于天际唯我独尊的感受！'
        },
        // {
        //     gameCode: 'cmf0001',
        //     name: '龙珠捕鱼',
        //     code: 'AT',
        //     image: 'at',
        //     message: 'ICONIC GAMING主打的龙珠捕鱼，是一款具有3种精致场景和高赔率的热门射击游戏。 可爱逗趣的海底生物、特殊累积机制、5种随机倍数奖励，丰富的视觉效果带来前所未有的乐趣。'
        // },
        {
            gameCode: '6',
            name: 'AG捕鱼王',
            code: 'AG',
            image: 'ag',
            message: '最受欢迎的AG捕鱼，游戏设计简单但富有变化，更有多种风格做选择，游戏过程有趣令人爱不释手，是游戏娱乐的上佳选择。'
        },
        // {
        //     gameCode: 'F-SF01',
        //     name: 'SG捕鱼天王',
        //     code: 'SG',
        //     image: 'sg',
        //     message: '全新鱼种与创新玩法，搭配丰富游戏场景， 享受全屏激战，满屏爆金的震撼体验。'
        // }
        ],
    }),
    setup() {
    },

    
})
</script>

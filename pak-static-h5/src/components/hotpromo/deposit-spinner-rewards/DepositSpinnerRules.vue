<template>
    <div class="rules-container">
        <div class="rule-title">
            Activity rules
        </div>
        <ul>
            <li>The activity includes four types of carousels: Silver, Gold, Diamond, and Special. You can unlock different levels of carousels by recharging. The higher the level, the more generous the rewards will be.</li>
            <li>Every draw has a 100% chance of winning a prize.</li>
            <li>All rewards will be deposited directly into your wallet.</li>
            <li>The bonus requires one turnover to withdraw.</li>
            <li>The right to interpret this event belongs to B9.game. If you have any questions, please contact customer service.</li>
        </ul>
        <div class="badges">
            <div class="badge" :key="index" v-for="(badge,index) in badgesList">
                <img :src="require(`./img/spin-${index+1}.png`)">
                <span class="badgetitle">{{ badge.title }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from "vue";
    const badgesList = ref([
        {
            title: "Silver"
        },
        {
            title: "Gold"
        },
        {
            title: "Diamond"
        },
        {
            title: "Supreme"
        }
    ])
</script>
<style lang="scss">
    .rules-container {
        width: 100%;
        padding: 10px;
        margin: 0 auto;
        background: url(./img/bg-img.png)no-repeat center top;
        background-size: contain;
        .rule-title {
            display: flex;
            justify-content: center;
            background: linear-gradient(180deg, #13A89E 0%, #8CC63F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: Poppins;
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            flex:2;
            justify-content: center;
            align-items: center;
            &:before, &:after {
                content: "";
                background: url(./img/decal.png)no-repeat center center;
                height: 15px;
                width: 80%;
                background-size: contain;
                flex:1;
            }
            &:before {
                transform: rotateZ(180deg);
            }
        }
        ul {
            margin: 25px auto;
        }
        .badges {
            display: flex; 
            gap: 5px;
            width: 95%;
            margin: 10px auto;
            .badge {
                background: url(./img/greensquare.png)no-repeat center center;
                background-size: contain;
                padding: 5px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
                
                img {
                    width: 70%;
                    margin: 0 auto;
                }
            }
        }
    }
</style>
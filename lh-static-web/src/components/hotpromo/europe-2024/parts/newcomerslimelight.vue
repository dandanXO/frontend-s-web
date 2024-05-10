<template>
    <div class="newcomers-intro">
        活动期间，会员此前从未投注过选择的场馆，选择完成后，当日场馆有效投注额满足<span>≥500</span>即可获得体验彩金。    
    </div>
    <div class="newcomers-grid">
        <div class="item" v-for="item in items" :key="item.bonusType" @click="getBonus(item.bonusType)">
            <img :src=" require(`../images/newcomers-${item.bonusType.toLowerCase()}.png`)">
            <div class="button">点击领取</div>
        </div>
    </div>
   
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
            <th>激活条件​</th>
            <th>当日有效投注额​</th>
            <th>新秀金​</th>
            <th>流水要求​</th>
        </tr>
        <tr>
            <td rowspan="2">投注电竞场馆​</td>
            <td>500</td>
            <td>12</td>
            <td rowspan="2">1倍​</td>
        </tr>
        <tr>
            <td>2000</td>
            <td>38</td>
        </tr>
    </table>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { firstBet } from '@/api/promotion/eurocup';
import { ElMessage } from "element-plus";
   
const getBonus = (type) => {
        firstBet(type).then((res) => {
            if (res.code === 0) {
                ElMessage.success('成功领取' + res.data + '元')
            } else {
                ElMessage.error(res.message);
            }
        }) 
    }
const items = ref([
    { bonusType: 'ESPORT' },
    { bonusType: 'LIVE' },
    { bonusType: 'POKER' },
    { bonusType: 'SLOT' }
])
</script>
<style lang="scss">
    .newcomers-intro {
        font-family: Microsoft YaHei UI;
        font-size: 24px;
        font-weight: 400;
        line-height: 31.92px;
        letter-spacing: 0.12em;
        text-align: center;
        color: #ffffff;
        margin: 50px auto;
        span {
            font-family: Microsoft YaHei UI;
            font-size: 24px;
            font-weight: 400;
            line-height: 31.92px;
            letter-spacing: 0.12em;
            text-align: center;
            color: #60B3FF;

        }
    }
    .newcomers-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        .item {
            position:relative;
            cursor: pointer;
            img {
            width: 100%;
            }
            .button {
                border: 1px solid #ffffff;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 28%;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 90px;
                border-radius: 50px;
                margin: auto;
                color: #ffffff;
            }
        }
    }
</style>
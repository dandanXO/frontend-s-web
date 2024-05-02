<template>
    <div class="newcomers-intro">
        活动期间，会员此前从未投注过选择的场馆，选择完成后，当日场馆有效投注额满足<span>≥500</span>即可获得体验彩金。    
    </div>
    <div class="newcomers-grid">
        <img src="../images/newcomers-esport.png">
        <img src="../images/newcomers-live.png">
        <img src="../images/newcomers-poker.png">
        <img src="../images/newcomers-slot.png">
    </div>
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
            <th>有效投注</th>
            <th>投注彩金</th>
            <th>专属队伍彩金</th>
            <th>彩金倍数</th>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>18</td>
            <td>18</td>
            <td rowspan="4">3倍</td>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>28</td>
            <td>58</td>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>68</td>
            <td>88</td>
        </tr>
        <tr>
            <td>≥1888</td>
            <td>158</td>
            <td>188</td>
        </tr>
    </table>
</template>
<style>
    .newcomers-intro {
        font-family: Microsoft YaHei UI;
        font-size: 16px;
        font-weight: 400;
        line-height: 31.92px;
        letter-spacing: 0.12em;
        text-align: center;
        color: #ffffff;
        margin: 20px auto;
        span {
            font-family: Microsoft YaHei UI;
            font-size: 16px;
            font-weight: 400;
            line-height: 31.92px;
            letter-spacing: 0.12em;
            text-align: center;
            color: #60B3FF;

        }
    }
    .newcomers-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        img {
            width: 100%;
        }
    }
</style>
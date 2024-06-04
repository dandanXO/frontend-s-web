<template>
    <div class="emergency-intro">
        活动期间，会员当日场馆有效投注额满足且产生对应负盈利金额，即可获得最高<span>388元</span>返还。
    </div>
    <table cellpadding="0" cellspacing="0" border="0">
        <tr>
            <th>负盈利</th>
            <th>救援金</th>
            <th>流水要求</th>
        </tr>
        <tr>
            <td>500</td>
            <td>8</td>
            <td rowspan="5">1倍</td>
        </tr>
        <tr>
            <td>1000</td>
            <td>18</td>
        </tr>
        <tr>
            <td>5000</td>
            <td>58</td>
        </tr>
        <tr>
            <td>10000</td>
            <td>188</td>
        </tr>
        <tr>
            <td>30000</td>
            <td>388</td>
        </tr>
    </table>
    <div class="emergency-rules">
        <div class="emergency-rules__rule-title">活动规则</div>
        <ol class="emergency-rules__rule-content">
            <li>会员需每日通过点击【立即申请】按钮方可报名参与，未点击申请按钮视为自动放弃参与该活动；</li>
            <li>有效投注额已结算时间为准，仅计算官方场馆有效投注额；</li>
            <li>本次活动的彩金将于次日48小时内派发至主账户钱包，彩金仅需一倍流水即可出款；</li>
            <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
            <li>任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
            <li>为避免文字理解差异，本站保留本活动最终解释权</li>
        </ol>
    </div>
</template>
<style lang="scss">

.emergency-intro {
        font-family: Microsoft YaHei UI;
        font-size: 16px;
        font-weight: 400;
        line-height: 31.92px;
        letter-spacing: 0.12em;
        text-align: center;
        color: #ffffff;
        margin: 50px auto;
        span {
            color: #60B3FF;

        }
    }
    .emergency-rules {
        font-family: Microsoft YaHei UI;
        font-size: 20px;
        font-weight: 700;
        line-height: 42.6px;
        letter-spacing: 0.12em;
        text-align: left;
        color: #ffffff;
        margin: 60px 0;
        &__rule-title {
            margin: 10px 0;
        }
        &__rule-content {
            font-family: Microsoft YaHei UI;
            font-size: 14px;
            font-weight: 400;
            line-height: 31.95px;
            letter-spacing: 0.12em;
            text-align: left;
            li {
                margin-left: 5px;
            }


        }

    }
</style>
<template>
    <div class="euro-regen-container">
        <img class="banner-img" src="../../../assets/images/promo/hotpromo/EuroRegen/banner.png" />

        <div class="promo-content-wrapper">
            <div class="claim-wrapper">
                <div class="claim-button">立即领取</div>
            </div>

            <div class="promo-content-header">活动内容：活动期间，欧洲杯每周负盈利≥500即可在固定活动时间范围内领取对应档位彩金；
            </div>

            <table class="promo-content-table">
                <thead>
                    <th>负盈利</th>
                    <th>负盈利统计时间段</th>
                    <th>日日领取彩金</th>
                    <th>领取时间段</th>
                    <th>流水倍数</th>
                </thead>
                <tbody>
                    <tr>
                        <td>≥500</td>
                        <td rowspan="6">06月15日~07月15日</td>
                        <td>3</td>
                        <td rowspan="6">07月17日~07月21日</td>
                        <td rowspan="6">8倍/不限游戏</td>
                    </tr>
                    <tr>
                        <td>≥5,000</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>≥10,000</td>
                        <td>36</td>
                    </tr>
                    <tr>
                        <td>≥30,000</td>
                        <td>108</td>
                    </tr>
                    <tr>
                        <td>≥100,000</td>
                        <td>258</td>
                    </tr>
                    <tr>
                        <td>≥500,000</td>
                        <td>1,188</td>
                    </tr>
                </tbody>
            </table>

            <div class="promo-rules">
                <img class="promo-rules-header" style="width: 250px"
                    src="../../../assets/images/promo/hotpromo/EuroRegen/rules-header.png" />
                <div class="promo-rules-list">
                    <div class="promo-rules-list-item"><span class="blue-number">1.
                        </span>欧洲杯赛事结束后会统一计算负盈利，达标会员在7.17日~7.21日（共5天）领取回血礼金。</div>
                    <div class="promo-rules-list-item"><span class="blue-number">2.
                        </span>在7.17日00：00：00开启回血窗口，当天领取时间至7.17日23：59：59截止，彩金仅需8倍流水即可提款，逾期未领取视为放弃。</div>
                    <div class="promo-rules-list-item"><span class="blue-number">3.
                        </span>本活动负盈利以结算时间为准，仅对已结算并产生输赢结果进行计算。</div>
                    <div class="promo-rules-list-item"><span class="blue-number">4.
                        </span>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</div>
                    <div class="promo-rules-list-item"><span class="blue-number">5.
                        </span>任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</div>
                    <div class="promo-rules-list-item"><span class="blue-number">6. </span>为避免文字理解差异，本站保留本活动最终解释权。</div>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.euro-regen-container {
    background: url("../../../assets/images/promo/hotpromo/EuroRegen/bg.jpg") no-repeat top center;
    background-size: 100% 100%;
    position: relative;
    font-family: 'PingFang';
    font-weight: bold;
    font-size: small;
}

.banner-img {
    display: flex;
    margin: 0 auto;
    width: 100%;
}

.claim-wrapper {
    background: url("../../../assets/images/promo/hotpromo/EuroRegen/claim-bg.png") no-repeat top center;
    background-size: 100% 100%;
    aspect-ratio: 627 / 255;
    width: 70%;
    margin: 0 auto;
    position: relative;
}

.claim-button {
    background: linear-gradient(359.63deg, #FFCA63 0.32%, #CE861B 12.86%, #FFCA63 64.76%);
    color: #FFF;
    position: absolute;
    transform: translate(25%, -55%);
    right: 50px;
    top: 50%;
    aspect-ratio: 190 / 66;
    width: 120px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        filter: brightness(0.9);
    }

    &:active {
        transform: translate(25%, -55%) translateY(2px);
    }
}

.promo-content-wrapper {
    width: 100%;
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    padding-bottom: 150px;
}

.promo-content-header {
    margin: 0 auto;
    font-size: medium;
    text-align: center;
}

.promo-content-table {
    width: 100%;
    background-color: #FFFFFF;
    border-collapse: collapse;

    th {
        background: linear-gradient(180deg, #5274FC 0%, #1B43DD 100%);
        color: #FFFFFF;
    }

    td {
        color: #202020;
    }

    th,
    td {
        border: 1px solid #5274FC;
        padding: 5px 10px;
        text-align: center;
    }
}

.promo-rules {
    background-color: #FFF;
    border: 1px solid #5274FC;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    color: #202020;
    margin-top: 20px;
}

.promo-rules-list {
    padding-top: 10px;
}

.promo-rules-list-item {
    line-height: 30px;

    span.blue-number {
        color: #143CD9;
        padding-right: 10px;
    }
}

.promo-rules-header {
    position: absolute;
    top: 4px;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
}
</style>
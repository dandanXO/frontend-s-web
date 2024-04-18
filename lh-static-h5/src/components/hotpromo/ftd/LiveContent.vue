<template>
    <div class="ftd-promo-content-frame" v-if="props.tab === '复存'">
        <div class="row">
            <img style="width:25px" src="../../../assets/images/promo/hotpromo/ftd/diamond-bullet.png" />
            <span>活动期间，新会员完成注册后的第二笔存款，即可申请一次真人复存优惠，申请成功的用户可享受单笔存款最高30%的存款优惠。</span>
        </div>

        <div class="stats-table-wrapper">
            <table class="stats-table">
                <tr>
                    <th>首存金额</th>
                    <th>返利</th>
                    <th>最高赠送彩金</th>
                    <th>流水要求</th>
                </tr>
                <tr>
                    <td>≥100</td>
                    <td>30%</td>
                    <td>
                        388
                    </td>
                    <td>（本金+红利）X18真人
                    </td>
                </tr>
            </table>
        </div>

        <ActionButtons :tab="props.tab" :type="props.type"/>

        <div class="notes">
            <p>1.&nbsp;活动期间，新用户注册后第二笔存款可选择参与一次复存返利，完成第二笔存款时可联系在线客服申请活动；</p>
            <p>2.&nbsp;申请奖金后需在真人场馆中完成相对应的流水要求，当用户钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水；</p>
            <p>3.&nbsp;此活动不与其它首存活动共享，每个账户仅限申请一次；</p>
            <p>4.&nbsp;对于发现任何有损害、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利</p>
            <p>5.&nbsp;.每位有效玩家、每个手机号码、电子邮箱、银行卡、IP地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利。</p>
            <p>6.&nbsp;此活动最终解释权归雷火所有；</p>
        </div>
    </div>
    <div class="ftd-promo-content-frame" v-else-if="props.tab === '首存'">
        <div class="row">
            <img style="width:25px" src="../../../assets/images/promo/hotpromo/ftd/diamond-bullet.png" />
            <span>活动期间，新会员首次存款时可申请一次真人首存优惠，申请成功的用户可享受单笔存款最高38%的存款优惠。</span>
        </div>

        <div class="stats-table-wrapper">
            <table class="stats-table">
                <tr>
                    <th>首存金额</th>
                    <th>返利</th>
                    <th>最高赠送彩金</th>
                    <th>流水要求</th>
                </tr>
                <tr>
                    <td>≥100</td>
                    <td>38%</td>
                    <td>
                        588
                    </td>
                    <td>（本金+红利）X15真人</td>
                </tr>
            </table>
        </div>

        <ActionButtons :tab="props.tab" :type="props.type"/>

        <div class="notes">
            <p>1.&nbsp;活动期间，新用户注册后第一笔存款可选择参与一次首存返利，完成存款且未投注前可联系在线客服申请活动；</p>
            <p>2.&nbsp;申请奖金后需在真人场馆中完成相对应的流水要求，当用户钱包余额＜最低投注额且无未结算注单时，系统将自动判定已完成活动规定的有效流水；</p>
            <p>3.&nbsp;此活动不与其它首存活动共享，每个账户仅限申请一次；</p>
            <p>4.&nbsp;对于发现任何有损害、欺骗、或利用规则和条款进行非法获利的会员，雷火电竞保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利</p>
            <p>5.&nbsp;.每位有效玩家、每个手机号码、电子邮箱、银行卡、IP地址、设备只能使用一个账号享受优惠，如发现有违规者我们将保留无限期审核扣回红利以及所产生的利润权利。</p>
            <p>6.&nbsp;此活动最终解释权归雷火所有；</p>
        </div>
    </div>
</template>
<script setup>
import './styles.css';
import ActionButtons from './ActionButtons.vue';

const props = defineProps(['tab', 'type']);
</script>
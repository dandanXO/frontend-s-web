<template>
  <div class="provilege-invite-container">
    <div class="provilege-invite-wrapper">
      <HotPromoionNav :label="'共创未来'"></HotPromoionNav>

      <div class="referral-info">
        <div class="bg">
          <img src="../../../assets/images/privilege-invite/btn_referral.png" />
          <div class="title">邀请周存送</div>
        </div>
        <div class="bg">
          <img src="../../../assets/images/privilege-invite/btn_turnover.png" />
          <div class="title">好友流水返利</div>
        </div>
      </div>

      <div class="title">共创未来</div>
      <div class="desc-wrapper">
        <div class="desc">通过专属链接邀请至官网注册成为会员</div>
      </div>

      <table class="record-table">
        <thead>
          <tr>
            <th style="width: 25%">新用户首存金额</th>
            <th style="width: 25%">邀请人</th>
            <th style="width: 25%">被邀请人</th>
            <th style="width: 25%">流水要求</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(table, tableIndex) in tableData" :key="`table-data-${tableIndex}`">
            <td>{{ table.row1 }}</td>
            <td>{{ table.row2 }}</td>
            <td>{{ table.row3 }}</td>
            <td v-if="table.row4" rowSpan="6">{{ table.row4 }}</td>
          </tr>
        </tbody>
      </table>

      <div class="tnc">
        <div class="note">
          1.每个通过您推广链接进行注册，并完成相应首存的用户，邀请人与被邀请人都将获得对应的邀请奖金，邀请人能最高可获得2328元，被邀请人最高可获得1668元；
        </div>
        <div class="note">2.活动期间每邀请成功一次，每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃；</div>
        <div class="note">
          3.例如：会员A邀请一位被邀请人首存200元，邀请人可获取18元奖金，被邀请人可获取8元；若想获取下一档位58元，则需被邀请人再次存1000元；奖金将会自动派
          发至主钱包。
        </div>
        <div class="note">4.邀请人等级不得低于青铜Ⅰ（vip2）；</div>
        <div class="note">
          5.普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
        </div>
        <div class="note">
          6.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
          注额内。
        </div>
        <div class="note">
          7.邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
          个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
        </div>
        <div class="note">8.为避免文字理解差异，雷火电竞保留此活动最终解释权。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import HotPromoionNav from "@/components/HotPromotionNav.vue";

const tableData = [
  {
    row1: "≥200",
    row2: "18.00",
    row3: "8.00",
    row4: "1倍/不限场馆"
  },
  {
    row1: "≥1,000",
    row2: "58.00",
    row3: "38.00"
  },
  {
    row1: "≥5,000",
    row2: "88.00",
    row3: "58.00"
  },
  {
    row1: "≥10,00",
    row2: "188.00",
    row3: "88.00"
  },
  {
    row1: "≥30,000",
    row2: "888.00",
    row3: "588.00"
  },
  {
    row1: "≥50,000",
    row2: "1088.00",
    row3: "888.00"
  }
];

onMounted(() => {});
</script>

<style scoped lang="scss">
.provilege-invite-container {
  font-size: 14px;
  color: #596281;
  line-height: 26px;

  .provilege-invite-wrapper {
    width: 1075px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;

    .referral-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
      margin: 0 0 50px 0;

      .bg {
        width: 30%;
        background: url("../../../assets/images/promotion/hotpromo/common/btn_mask.png");
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 25px 50px;
        border-radius: 1.25rem;
        // background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        cursor: pointer;

        .title {
          color: #424f72;
          font-size: 1.5rem;
          font-weight: 700;
        }

        img {
          width: 125px;
        }
      }
    }

    .title {
      font-size: 2rem;
      color: #3f8cff;
      font-weight: bold;
      margin-left: 10px;
      text-align: center;
    }

    .desc-wrapper {
      margin: 0 0 20px 0;

      .desc {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: normal;
        text-align: center;
      }
    }

    .record-table {
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      margin: 0 0 20px 0;

      thead {
        background: #e7f3ff;
      }

      th,
      td {
        padding: 10px 0;
      }

      tbody {
        color: #7a8eb9;
        tr {
          border-collapse: collapse;
          td {
            border: 1px solid #ecedf0;
          }
        }
      }
    }

    .tnc {
      .note {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 132.5%;
        margin: 0 0 10px 0;
      }
    }
  }
}
</style>

<template>
  <div class="deposit-award-wrapper">
    <div class="deposit-award-content">
      <div class="content-main">
        <img src="../../../assets/images/promotion/hotpromo/deposit-award/activity-period.png" />
        <p>活动时间：5月17日起</p>

        <img
          style="padding-top: 30px"
          src="../../../assets/images/promotion/hotpromo/deposit-award/activity-content.png"
        />
        <p>
          活动内容：活动期间，会员存款≥500元即可获得对应彩金，若当日投注金额达到存款金额3倍或 以上则可获得对应加赠彩金
        </p>

        <table class="return-table" border="0" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <td rowspan="2">存款金额</td>
              <td rowspan="2">赠送彩金</td>
              <td colspan="2">流水加赠</td>
              <td rowspan="2">流水备注</td>
            </tr>
            <tr>
              <td>存款金额3倍流水</td>
              <td>存款金额5倍流水</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td>8</td>
              <td>8</td>
              <td>12</td>
              <td rowspan="7">5倍/不限场馆</td>
            </tr>
            <tr>
              <td>≥1,000</td>
              <td>18</td>
              <td>18</td>
              <td>28</td>
            </tr>
            <tr>
              <td>≥3,000</td>
              <td>28</td>
              <td>38</td>
              <td>58</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>88</td>
              <td>108</td>
              <td>128</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>288</td>
              <td>358</td>
              <td>388</td>
            </tr>
            <tr>
              <td>≥50,000</td>
              <td>588</td>
              <td>888</td>
              <td>1,088</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>1,088</td>
              <td>1,588</td>
              <td>1,888</td>
            </tr>
          </tbody>
        </table>

        <p style="text-align: left">例：用户A当日存款10,000元后投注体育场馆50,000元,用户A可获得88+128=216元</p>
      </div>

      <div class="content-rules">
        <img src="../../../assets/images/promotion/hotpromo/deposit-award/activity-rules.png" />

        <div class="content-rules-list">
          <p>
            1.活动期间，会员存款≥500元即可获得对应存款彩金，若当日有效投注金额达到存款金额3倍或
            以上则可获得对应流水加赠彩金；
          </p>
          <p>2. 符合条件的会员彩金于次日24内派发，彩金5倍流水即可提款；</p>
          <p>
            3.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
          </p>
          <p>
            4.根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </p>
          <p>
            5.此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及IP地址视为同一账户，若有违规者，将不享受此红利；
          </p>
          <p>6.为避免文字理解差异，本站保留此活动最终解释权；</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deposit-award-wrapper {
  padding-top: 32%;
  min-height: 100vh;

  .deposit-award-title {
    padding: 5% 30% 5% 15%;
    img {
      display: block;
      width: 100%;
      // max-width: 800px;
    }
  }

  .deposit-award-options {
    display: flex;
    justify-content: center;

    img {
      display: block;
      width: 100%;
      cursor: pointer;
    }
  }

  .deposit-award-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 60px;
    gap: 40px;

    p {
      text-align: center;
      font-size: 20px;
      color: #fff5d4;
    }
  }

  .return-table {
    padding-top: 15px;
    width: 100%;
    thead {
      background: linear-gradient(180deg, #b42614 0%, #7b0101 100%);

      td {
        color: #d7a29e;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: bold;
      }
    }

    tbody {
      background: rgba(52, 45, 45, 0.4);

      td {
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    td {
      padding: 12px 20px;
      text-align: center;
      font-size: 18px;
      color: #ffffff;
    }
  }

  .return-claim-btn {
    display: flex;
    justify-content: center;
    margin-top: 15px;

    img {
      cursor: pointer;
      &:hover {
        filter: brightness(0.8);
      }
    }
  }

  .content-rules-list {
    max-width: 1200px;
    background-image: url("../../../assets/images/promotion/hotpromo/deposit-award/rules-bg.png");
    background-size: 100% 100%;
    background-position: center center;
    padding: 20px 30px;
    margin-top: 20px;

    p {
      text-align: left;
      position: relative;
      padding-left: 36px;
      color: #fff5d4;

      &:before {
        content: "";
        background-image: url("../../../assets/images/promotion/hotpromo/deposit-award/rules-point.png");
        width: 36px;
        height: 36px;
        display: block;
        position: absolute;
        left: 0px;
        top: -2px;
      }
    }
  }
}
</style>

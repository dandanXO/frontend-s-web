<template>
  <div class="challenge-comeback-container">
    <div class="challenge-comeback-block detail-block">
      <div class="challenge-comeback-block-title">活动详情</div>

      <div class="detail-block-event-content">
        <div class="detail-block-event-content-title">活动内容</div>
        <span>活动期间，每周期负盈利≥500即可在固定活动时间范围内领取对应档位彩金</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>负盈利</th>
              <th>负盈利统计时间段</th>
              <th>日日领取彩金</th>
              <th>总彩金</th>
              <th>流水倍数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≥500</td>
              <td rowspan="6" style="border-bottom: none">每月1～31号</td>
              <td>3</td>
              <td>15</td>
              <td rowspan="6" style="border-bottom: none">8倍/不限游戏</td>
            </tr>
            <tr>
              <td>≥5,000</td>
              <td>10</td>
              <td>50</td>
            </tr>
            <tr>
              <td>≥10,000</td>
              <td>36</td>
              <td>180</td>
            </tr>
            <tr>
              <td>≥30,000</td>
              <td>108</td>
              <td>540</td>
            </tr>
            <tr>
              <td>≥100,000</td>
              <td>258</td>
              <td>1,290</td>
            </tr>
            <tr>
              <td>≥500,000</td>
              <td>1,188</td>
              <td>5,940</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>活动时间</th>
              <th>结算时间段</th>
              <th>派发领取时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>第一期</td>
              <td>1号～10号</td>
              <td>当月11～15号,每日15:00:00</td>
            </tr>
            <tr>
              <td>第二期</td>
              <td>11号～20号</td>
              <td>当月21～25号,每日15:00:00</td>
            </tr>
            <tr>
              <td>第三期</td>
              <td>21号～31号</td>
              <td>次月01～05号,每日15:00:00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="challenge-comeback-block rule-block">
      <div class="challenge-comeback-block-title">活动详情</div>
      <ol class="rules-content">
        <li>
          活动周期为10天/周期，第一周期为1日-10日、第二周期为11日-20日、第三周期为21日-月底、达标后从1日、11日、21日开始连续5天派发至彩金钱包，有效期72小时，彩金仅需8倍流水即可提款，逾期未领取视为放弃。
        </li>
        <li>
          说明：
          <br />
          ①周期输赢：周期内已结算并产生输赢结果所有注单的总输赢、任何提前结算或取消的注单不计算。
          <br />
          ②彩金不可购买免费旋转机会，不可投注捕鱼游戏；
        </li>
        <li>
          同一手机号、姓名、邮箱地址、银行卡号、IP地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理。
        </li>
        <li>为避免文字理解差异，如有疑问可联系在线客服，平台保留活动最终解释权。</li>
      </ol>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.challenge-comeback-container {
  font-family: PingFang TC;
  color: #000;
  > :not(:last-child) {
    margin-bottom: 12px;
  }

  .challenge-comeback-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f2f8fe;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 16px 12px 12px;
    border: 1px solid #f2f8fe;
    border-radius: 12px;

    .challenge-comeback-block-title {
      background: url(./img/block-title-bg.png) no-repeat;
      background-size: contain;
      aspect-ratio: 240 / 20;
      margin: 0 auto;
      font-family: Inter;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.25rem;
      text-align: center;
      color: #4c4c6c;
    }
  }
}

.detail-block {
  .detail-block-event-content {
    .detail-block-event-content-title {
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      width: max-content;
      padding: 3px 16px;
      clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1rem;
      color: #fff;
      margin-bottom: 4px;
    }

    span {
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.125rem;
    }
  }
}

.rule-block {
  .rules-content {
    color: #000;
    padding: 0;
    counter-reset: list-counter;

    .step-number {
      width: 20px;
      height: 20px;
      font-size: 14px;
    }

    li {
      display: flex;
      counter-increment: list-counter;
      margin-bottom: 0 !important;
      list-style-type: none;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.125rem;
      &::before {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        content: counter(list-counter);
        width: 16px;
        height: 16px;
        margin-right: 10px;
        background: linear-gradient(90deg, #89d3ff 8.15%, #0085e8 92.42%);
        border-radius: 50%;
        font-family: Play;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1rem;
        color: white;
      }
    }
  }
}

.table-wrapper {
  border: 1px solid #acd4f6;
  border-radius: 10px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #acd4f6;
    padding: 10px;
    text-align: center;
  }

  thead {
    color: white;
  }
  thead th {
    background: linear-gradient(180deg, #41b9ff -21.81%, #0085e8 95.54%);
    border: none;
  }

  tbody tr {
    > :first-child {
      border-left: none;
    }
    > :last-child {
      border-right: none;
    }
    &:last-child {
      td {
        border-bottom: none;
      }
    }
  }
}
</style>

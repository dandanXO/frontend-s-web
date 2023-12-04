<template>
  <div>
    <h2>佣金比例说明</h2>
    <p>
      代理的佣金比例由本月总输赢和活跃人数两项条件决定，同时满足时获取对应等级的佣金比例。
    </p>
    <p>
      活跃人数：当月存款>=100或有效投注>=500；
    </p>
    <table class="custom-table">
      <thead>
        <th>级别</th>
        <th>公司本月总输赢</th>
        <th>活跃数最低要求</th>
        <th>佣金比例</th>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>1 - 40000</td>
          <td>5</td>
          <td>30%</td>
        </tr>
        <tr>
          <td>2</td>
          <td>40001 - 150000</td>
          <td>10</td>
          <td>35%</td>
        </tr>
        <tr>
          <td>3</td>
          <td>150001 - 300000</td>
          <td>15</td>
          <td>40%</td>
        </tr>
        <tr>
          <td>4</td>
          <td>300001 - 500000</td>
          <td>25</td>
          <td>45%</td>
        </tr>
        <tr>
          <td>5</td>
          <td>500001 - 1000000</td>
          <td>35</td>
          <td>50%</td>
        </tr>
        <tr>
          <td>6</td>
          <td>≥1000001</td>
          <td>50</td>
          <td>55%</td>
        </tr>
      </tbody>
    </table>
    <h2>佣金计算方式</h2>
    <p>
      <ul>
        <li>佣金 = 冲正后净输赢 * 佣金比例 + 佣金调整 + 佣金补调；</li>
        <li>冲正后净输赢 = 当月净输赢 + 上月结余；</li>
        <li>当月净输赢 = 当月总输赢 - 红利 - 返水 - 场馆费 + 账户调整 + 补单输赢 - 存提手续费；</li>
        <li>红利 = 代理下线会员当月领取的平台发放红利的总和；</li>
        <li>返水 = 代理下线会员当月领取平台返水的总和；</li>
        <li>场馆费 = 各游戏场馆总输赢 * 平台费率，但只有当月产生盈利，平台才会收取场馆费；</li>
        <li>账户调整 = 当会员流水异常时，站点管理员对会员进行账户调整；</li>
        <li>补单输赢 = 上月实时数据净输赢 - 上月发放佣金净输赢；</li>
        <li>存款手续费 = 下级会员存款金额 * 存款费率 + 代理额度充值金额 * 存款费率；</li>
        <li>提款手续费 = 下级会员的取款金额 * 取款费率；</li>
        <li>佣金补调：当月佣金发放后，根据代理参与的相关活动，或其它原因核实后进行补调。</li>
      </ul>
    </p>
    <p class="note">注：请谨记任何使用无诚信的方法以骗取佣金将会被永久冻结账号，并终止合作关系，所有佣金一概不予发放。</p>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.note {
  color: red;
}
/* Scoped styles for the component */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.custom-table th, .custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.custom-table th {
  background-color: #f2f2f2;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>

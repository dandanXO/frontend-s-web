<template>
  <div>
    <div v-if="siteId !== 8 && siteId !== '8'">
      <h2>佣金比例说明</h2>
      <p>
        代理的佣金比例由本月总输赢和活跃人数两项条件决定，同时满足时获取对应等级的佣金比例。
      </p>
      <p>
        活跃人数：当月存款>=100或有效投注>=500；
      </p>
      <table class="custom-table">
        <thead>
          <th scope="col">级别</th>
          <th scope="col">公司本月总输赢</th>
          <th scope="col">新增/ 活跃数量最低要求</th>
          <th scope="col">佣金比例</th>
        </thead>
        <tbody>
          <tr>
            <td data-label="级别">1</td>
            <td data-label="公司本月总输赢">1 - 40000</td>
            <td data-label="活跃数最低要求">5</td>
            <td data-label="佣金比例">30%</td>
          </tr>
          <tr>
            <td data-label="级别">2</td>
            <td data-label="公司本月总输赢">40001 - 150000</td>
            <td data-label="活跃数最低要求">10</td>
            <td data-label="佣金比例">35%</td>
          </tr>
          <tr>
            <td data-label="级别">3</td>
            <td data-label="公司本月总输赢">150001 - 300000</td>
            <td data-label="活跃数最低要求">15</td>
            <td data-label="佣金比例">40%</td>
          </tr>
          <tr>
            <td data-label="级别">4</td>
            <td data-label="公司本月总输赢">300001 - 500000</td>
            <td data-label="活跃数最低要求">25</td>
            <td data-label="佣金比例">45%</td>
          </tr>
          <tr>
            <td data-label="级别">5</td>
            <td data-label="公司本月总输赢">500001 - 1000000</td>
            <td data-label="活跃数最低要求">35</td>
            <td data-label="佣金比例">50%</td>
          </tr>
          <tr>
            <td data-label="级别">6</td>
            <td data-label="公司本月总输赢">≥1000001</td>
            <td data-label="活跃数最低要求">50</td>
            <td data-label="佣金比例">55%</td>
          </tr>
        </tbody>
      </table>
      <h2>佣金计算方式</h2>
      <p>
        <ul>
          <li>佣金 = 冲正后净输赢 * 佣金比例 + 佣金调整 + 佣金补调；</li>
          <li>冲正后净输赢 = 当月净输赢 + 上月结余；</li>
          <li>当月净输赢 = 当月总输赢 - 红利 - 返水 - 场馆费 - 账户调整 + 补单输赢 - 存提手续费；</li>
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
  </div>
  <div v-if="siteId === 8 || siteId === '8'">
    <h2 class="agent-h2">KẾ HOẠCH CHIẾT KHÂU HOA HỒNG</h2>
    <ul style="list-style-type: disc; padding: 0 20px;">
      <li style="list-style-type: disc;">Tỷ lệ % hoa hồng được tính dựa trên tổng số tiền thua cược của các thành viên hàng tháng của
        Đại lý tại TF.com và số lượng thành viên hoạt động trong từng giai đoạn trong tháng.</li>
      <li style="list-style-type: disc;">Phần trăm hoa hồng của đại lý sẽ được dựa vào tổng doanh thu từ tất cả các khách hàng của
        đại lý đang cược tại TF.com và thỏa mãn những điều kiện để nhận thanh toán Hoa hồng.</li>
      <li style="list-style-type: disc;">Với 55% hoa hồng cho đại lý, Lợi nhuận hoa hồng sẽ dựa vào 55% và được tính trên tổng số tiền
        thua cược của các thành viên tham gia đặt cược tại Công ty TF.com. (tổng tiền thua cược sau khi trừ
        mọi chi phí) sẽ là tổng số tiền hoa hồng của đại lý được nhận.</li>
      <li style="list-style-type: disc;">Với ít nhất 05 thành viên có hoạt động động trong tháng (Nếu số thành viên hoạt động ít hơn 05
        sẽ không được tính hoa hồng) thì đại lý sẽ có cơ hội nhận được hoa hồng từ TF.com. Phần trăm hoa
        hồng tăng hay giảm sẽ phụ thuộc vào số lượng thành viên hoạt động và số tiền thua cược của các
        thành viên trong tháng.</li>
      <li style="list-style-type: disc;">Nếu tài khoản đại lý có lợi nhuận hoa hồng là số âm trong tháng (lợi nhuận âm: là số tiền nợ
        của đại lý với Công ty) thì số tiền âm đó sẽ được chuyển sang những tháng tiếp theo để khấu trừ
        cho đến hết thì đại lý mới được tiếp tục nhận tiền hoa hồng.</li>
      <li style="list-style-type: disc;">Thanh toán hoa hồng đại lí cũ: trong tháng ít nhất có 3 khách mới và tổng khách hoạt động 5 khách trở lên.
      </li>
      <li style="list-style-type: disc;">Tất cả các thành viên đại lý phải thanh toán chi phí.
        <ul style=" padding: 10px 20px;">
          <li>+ Phí gửi rút tiền của ngân hàng.</li>
          <li>+ Phí tiền thưởng khách nhận.</li>
          <li>+ Phí dịch vụ hệ thống trò chơi. (thanh toán trả nhà cung cấp dịch vụ).</li>
        </ul>
      </li>
    </ul>
    <h2 class="agent-h2" style="margin-top: 10px" data-locale="i18n_rule_title_2">BẢNG CHIẾT KHẤU % HOA HỒNG</h2>
    <table class="custom-table">
      <tbody>
        <tr>
          <th data-locale="i18n_detail_table_thead_1">Tổng số thành viên hoạt động</th>
          <th data-locale="i18n_detail_table_thead_3">Lợi nhuận(VND)</th>
          <th data-locale="i18n_detail_table_thead_4">Tỷ lệ % hoa hồng</th>
        </tr>
        <tr>
          <td>5</td>
          <td>0~2 tỷ</td>
          <td>40%</td>
        </tr>
        <tr>
          <td>15</td>
          <td>2.01 tỷ~3 tỷ</td>
          <td>45%</td>
        </tr>
        <tr>
          <td>30</td>
          <td>3.01 tỷ~4 tỷ</td>
          <td>50%</td>
        </tr>
        <tr>
          <td>50</td>
          <td data-locale="i18n_detail_table_td_4_3">4 tỷ trở lên</td>
          <td>55%</td>
        </tr>
      </tbody>
    </table>
    <h2 class="agent-h2" style="margin-top: 20px" data-locale="i18n_rule_title_3">CÔNG THỨC TÍNH TIỀN HOA HỒNG ĐẠI LÝ
      TF.COM</h2>
    <p style="margin: 10px 0px; line-height: 28px;" data-locale="i18n_rule_content_3">Lợi nhuận ròng = ( Tổng tiền
      thắng/thua x 90% ) - Tiền thưởng - ( Phí giao dịch ngân hàng x 1% ).<br> =&gt;Trong đó: Tổng tiền thắng/thua =
      Tổng tiền đặt cược - Tổng tiền thanh toán <br>Phí giao dịch ngân hàng: （phí nạp tiền + phí rút tiền）*1%<br>Tiền
      hoa hồng = Lợi nhuận ròng x Tỷ lệ % hoa hồng tương ứng.</p>

  </div>
</template>
<script setup>
import { useStore } from '@/store';
const store = useStore();
const siteId = store.state.user.siteId;
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-tab-pane p {
  color: #7D8792;

  &.note {
    color: #FB560A;
  }
}

.el-tab-pane ul {
  padding: 0;
  margin: 0;
}

.el-tab-pane ul li {
  color: #7D8792;
  padding: 0;
  margin: 0 0 10px 0;
  list-style: none;
}

/* Scoped styles for the component */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  // min-width: 500px;
}

.custom-table th,
.custom-table td {
  border: 0;
  padding: 10px;
  text-align: center;
}

.custom-table th {
  background-color: #F4F9FD;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #F4F9FD;
}

@media(max-width: 600px) {
  .custom-table td {
    text-align: right;
  }
}
</style>

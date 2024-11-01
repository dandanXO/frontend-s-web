<template>
  <div>
    <div v-if="siteId !== 8 && siteId !== '8'">
      <h2>{{ t('commissionInfo.commissionRateInfo') }}</h2>
      <p>
        {{ t('commissionInfo.commissionRateDescription') }}
      </p>
      <p>
        {{ t('commissionInfo.activeMemberRequirement') }}
      </p>
      <table class="custom-table">
        <thead>
          <tr>
            <td scope="col">{{ t('commissionInfo.level') }}</td>
            <td scope="col">{{ t('commissionInfo.companyMonthlyProfit') }}</td>
            <td scope="col">
              {{ t('commissionInfo.activeNumberRequirement') }}
            </td>
            <td scope="col">{{ t('commissionInfo.commissionRate') }}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :data-label="t('commissionInfo.level')">1</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              1 - 40000
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">5</td>
            <td :data-label="t('commissionInfo.commissionRate')">30%</td>
          </tr>
          <tr>
            <td :data-label="t('commissionInfo.level')">2</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              40001 - 150000
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">
              10
            </td>
            <td :data-label="t('commissionInfo.commissionRate')">35%</td>
          </tr>
          <tr>
            <td :data-label="t('commissionInfo.level')">3</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              150001 - 300000
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">
              15
            </td>
            <td :data-label="t('commissionInfo.commissionRate')">40%</td>
          </tr>
          <tr>
            <td :data-label="t('commissionInfo.level')">4</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              300001 - 500000
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">
              25
            </td>
            <td :data-label="t('commissionInfo.commissionRate')">45%</td>
          </tr>
          <tr>
            <td :data-label="t('commissionInfo.level')">5</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              500001 - 1000000
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">
              35
            </td>
            <td :data-label="t('commissionInfo.commissionRate')">50%</td>
          </tr>
          <tr>
            <td :data-label="t('commissionInfo.level')">6</td>
            <td :data-label="t('commissionInfo.companyMonthlyProfit')">
              ≥1000001
            </td>
            <td :data-label="t('commissionInfo.activeNumberRequirement')">
              50
            </td>
            <td :data-label="t('commissionInfo.commissionRate')">55%</td>
          </tr>
        </tbody>
      </table>
      <h2>{{ t('commissionInfo.commissionCalculateFormula') }}</h2>
      <div>
        <ul>
          <li>{{ t('commissionInfo.commissionFormula') }}</li>
          <li>{{ t('commissionInfo.correctionNetProfitFormula') }}</li>
          <li>{{ t('commissionInfo.monthlyNetProfitFormula') }}</li>
          <li>{{ t('commissionInfo.bonusFormula') }}</li>
          <li>{{ t('commissionInfo.rebateFormula') }}</li>
          <li>{{ t('commissionInfo.platformFeeFormula') }}</li>
          <li>{{ t('commissionInfo.adjustmentFormula') }}</li>
          <li>{{ t('commissionInfo.supplementWinLossFormula') }}</li>
          <li>{{ t('commissionInfo.depositFeeFormula') }}</li>
          <li>{{ t('commissionInfo.withdrawalFeeFormula') }}</li>
          <li>{{ t('commissionInfo.commissionAdjustmentNote') }}</li>
        </ul>
      </div>
      <p class="note">{{ t('commissionInfo.commissionNote') }}</p>
    </div>
  </div>
  <div v-if="siteId === 8 || siteId === '8'">
    <h2 class="agent-h2">KẾ HOẠCH CHIẾT KHÂU HOA HỒNG</h2>
    <ul style="list-style-type: disc; padding: 0 20px;">
      <li style="list-style-type: disc;">
        Tỷ lệ % hoa hồng được tính dựa trên tổng số tiền thua cược của các thành
        viên hàng tháng của Đại lý tại TF.com và số lượng thành viên hoạt động
        trong từng giai đoạn trong tháng.
      </li>
      <li style="list-style-type: disc;">
        Phần trăm hoa hồng của đại lý sẽ được dựa vào tổng doanh thu từ tất cả
        các khách hàng của đại lý đang cược tại TF.com và thỏa mãn những điều
        kiện để nhận thanh toán Hoa hồng.
      </li>
      <li style="list-style-type: disc;">
        Với 55% hoa hồng cho đại lý, Lợi nhuận hoa hồng sẽ dựa vào 55% và được
        tính trên tổng số tiền thua cược của các thành viên tham gia đặt cược
        tại Công ty TF.com. (tổng tiền thua cược sau khi trừ mọi chi phí) sẽ là
        tổng số tiền hoa hồng của đại lý được nhận.
      </li>
      <li style="list-style-type: disc;">
        Với ít nhất 05 thành viên có hoạt động động trong tháng (Nếu số thành
        viên hoạt động ít hơn 05 sẽ không được tính hoa hồng) thì đại lý sẽ có
        cơ hội nhận được hoa hồng từ TF.com. Phần trăm hoa hồng tăng hay giảm sẽ
        phụ thuộc vào số lượng thành viên hoạt động và số tiền thua cược của các
        thành viên trong tháng.
      </li>
      <li style="list-style-type: disc;">
        Nếu tài khoản đại lý có lợi nhuận hoa hồng là số âm trong tháng (lợi
        nhuận âm: là số tiền nợ của đại lý với Công ty) thì số tiền âm đó sẽ
        được chuyển sang những tháng tiếp theo để khấu trừ cho đến hết thì đại
        lý mới được tiếp tục nhận tiền hoa hồng.
      </li>
      <li style="list-style-type: disc;">
        Thanh toán hoa hồng đại lí cũ: trong tháng ít nhất có 3 khách mới và
        tổng khách hoạt động 5 khách trở lên.
      </li>
      <li style="list-style-type: disc;">
        Tất cả các thành viên đại lý phải thanh toán chi phí.
        <ul style=" padding: 10px 20px;">
          <li>+ Phí gửi rút tiền của ngân hàng.</li>
          <li>+ Phí tiền thưởng khách nhận.</li>
          <li>
            + Phí dịch vụ hệ thống trò chơi. (thanh toán trả nhà cung cấp dịch
            vụ).
          </li>
        </ul>
      </li>
    </ul>
    <h2
      class="agent-h2"
      style="margin-top: 10px"
      data-locale="i18n_rule_title_2"
    >
      BẢNG CHIẾT KHẤU % HOA HỒNG
    </h2>
    <table class="custom-table">
      <tbody>
        <tr>
          <th data-locale="i18n_detail_table_thead_1">
            Tổng số thành viên hoạt động
          </th>
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
    <h2
      class="agent-h2"
      style="margin-top: 20px"
      data-locale="i18n_rule_title_3"
    >
      CÔNG THỨC TÍNH TIỀN HOA HỒNG ĐẠI LÝ TF.COM
    </h2>
    <p
      style="margin: 10px 0px; line-height: 28px;"
      data-locale="i18n_rule_content_3"
    >
      Lợi nhuận ròng = ( Tổng tiền thắng/thua x 90% ) - Tiền thưởng - ( Phí giao
      dịch ngân hàng x 1% ).
      <br />
      =&gt;Trong đó: Tổng tiền thắng/thua = Tổng tiền đặt cược - Tổng tiền thanh
      toán
      <br />
      Phí giao dịch ngân hàng: （phí nạp tiền + phí rút tiền）*1%
      <br />
      Tiền hoa hồng = Lợi nhuận ròng x Tỷ lệ % hoa hồng tương ứng.
    </p>
  </div>
</template>
<script setup>
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
const store = useStore()
const siteId = store.state.user.siteId
const { t } = useI18n()
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-tab-pane p {
  color: #7d8792;

  &.note {
    color: #fb560a;
  }
}

.el-tab-pane ul {
  padding: 0;
  margin: 0;
}

.el-tab-pane ul li {
  color: #7d8792;
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
  background-color: #f4f9fd;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #f4f9fd;
}

@media (max-width: 600px) {
  .custom-table td {
    text-align: right;
  }
}
</style>

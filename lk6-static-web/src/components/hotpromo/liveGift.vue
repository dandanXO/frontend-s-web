<template>
  <div class="dan-test-promo">
    <div class="section-bg">
      <div class="title-img">{{ $t("danTestPromo.title") }}</div>
      <br />
      <div class="info-row">
        <div class="ribbon">{{ $t("danTestPromo.targetAudience") }}</div>
        <span>{{ $t("danTestPromo.targetAudienceContent") }}</span>
      </div>
      <div class="info-row">
        <div class="ribbon">{{ $t("danTestPromo.activityTime") }}</div>
        <span>{{ $t("danTestPromo.activityTimeContent") }}</span>
      </div>
      <div class="info-row">
        <div class="ribbon">{{ $t("danTestPromo.activityContent") }}</div>
        <span>
          {{ $t("danTestPromo.activityContentDetail") }}
        </span>
      </div>
      <table class="section-table promo-table">
        <tbody>
          <tr class="table-header">
            <th>{{ $t("danTestPromo.table.level") }}</th>
            <th>{{ $t("danTestPromo.table.winningStreaks") }}</th>
            <th>{{ $t("danTestPromo.table.bonus") }}</th>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row1.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row1.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row1.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row2.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row2.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row2.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row3.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row3.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row3.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row4.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row4.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row4.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row5.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row5.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row5.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row6.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row6.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row6.prize") }}</td>
          </tr>
          <tr>
            <td>{{ $t("danTestPromo.table.row7.bet") }}</td>
            <td>{{ $t("danTestPromo.table.row7.streak") }}</td>
            <td>{{ $t("danTestPromo.table.row7.prize") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "DanTestPromo"
};
</script>

<style scoped lang="scss">
.dan-test-promo {
  .section-bg {
    border: 1px solid rgba(172, 212, 246, 1);
    background: #f2f8fe;
    border-radius: 12px;
    padding: 30px;
    font-family: "PingFang SC";
  }

  .title-img {
    aspect-ratio: 2952 / 176;
    background: url("../../assets/images/promotion/hotpromo/common/promo-details-title-bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 905px 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    color: #4c4c6c;
    font-weight: bold;
    letter-spacing: 3px;
    margin: 0 auto;
  }

  .info-row {
    display: flex;
    justify-content: flex-start;
    gap: 5px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    font-size: 1rem;
  }

  .ribbon {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    padding-right: 10px;
    font-family: "PingFang SC";
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: fit-content;
    padding: 0px 20px 0px 10px;
    aspect-ratio: 94/30;
    white-space: nowrap;
  }

  .promo-table {
    width: 100%;
    margin: 10px auto;
    text-align: center;
    border-collapse: collapse;
  }

  .table-header {
    height: 56px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    white-space: pre-wrap;
  }

  .table-header th {
    background-color: transparent;
  }

  .promo-table th,
  .promo-table td {
    padding: 10px;
  }

  .promo-table tbody {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .promo-table th {
    background: #e7f3ff;
    p {
      margin: 0;
    }
    &:first-child {
      border-top-left-radius: 20px;
    }
    &:last-child {
      border-top-right-radius: 20px;
    }
  }

  .promo-table td {
    border: 1px solid #dcdce8;
    color: #333;
  }

  .promo-table tr {
    p {
      margin: 0px;
    }
  }
}
</style>
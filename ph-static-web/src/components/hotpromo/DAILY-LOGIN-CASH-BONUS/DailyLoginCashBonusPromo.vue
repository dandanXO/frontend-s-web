<template>
  <div class="container">
    <div class="top">
      <img
        class="taglines-and-monkey-image"
        src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/taglines-and-monkey.png"
      />
    </div>
    <!-- <div class="middle">
      <img
        class="treasure-chest-image"
        src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/treasure-chest.png"
      />
      <img
        class="claim-rewards-btn"
        src="../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/claim-rewards-btn.png"
      />
    </div> -->
    <div class="bottom">
      <CheckInCalendar />
    </div>

    <div class="btm-description">
      <!--      <table class="table-daily-desc">-->
      <!--        <thead>-->
      <!--          <th>VIP Level</th>-->
      <!--          <th>Sign in Days</th>-->
      <!--          <th>Bonus Amount</th>-->
      <!--          <th>Min. withdraw amount</th>-->
      <!--          <th>Turnover</th>-->
      <!--        </thead>-->

      <!--        <tbody>-->
      <!--          <tr>-->
      <!--            <td>1~7</td>-->
      <!--            <td>1</td>-->
      <!--            <td>8</td>-->
      <!--            <td>200</td>-->
      <!--            <td rowspan="14">20x</td>-->
      <!--          </tr>-->

      <!--          <tr>-->
      <!--            <td rowspan="4">1~3</td>-->
      <!--            <td>3</td>-->
      <!--            <td>18</td>-->
      <!--            <td rowspan="2">100</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">5</td>-->
      <!--            <td>28</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">7</td>-->
      <!--            <td>58</td>-->
      <!--            <td rowspan="2">200</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">14</td>-->
      <!--            <td>88</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td rowspan="4">4~5</td>-->
      <!--            <td>3</td>-->
      <!--            <td>28</td>-->
      <!--            <td>100</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">5</td>-->
      <!--            <td>58</td>-->
      <!--            <td rowspan="2">200</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">7</td>-->
      <!--            <td>88</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">14</td>-->
      <!--            <td>168</td>-->
      <!--            <td>500</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td rowspan="5">6~7</td>-->
      <!--            <td>3</td>-->
      <!--            <td>58</td>-->
      <!--            <td rowspan="2">200</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">5</td>-->
      <!--            <td>88</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">7</td>-->
      <!--            <td>168</td>-->
      <!--            <td rowspan="2">500</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">14</td>-->
      <!--            <td>288</td>-->
      <!--          </tr>-->
      <!--          <tr>-->
      <!--            <td class="with-border">30</td>-->
      <!--            <td>588</td>-->
      <!--            <td>2000</td>-->
      <!--          </tr>-->
      <!--        </tbody>-->
      <!--      </table>-->

      <div class="rich-content-control" v-html="props.pageContent" />
    </div>
  </div>
</template>
<script setup>
import CheckInCalendar from "./CheckInCalendar.vue";

const props = defineProps({
  pageContent: {
    type: String,
    required: false
  }
});
</script>
<style lang="scss" scoped>
.container {
  background-image: url("../../../assets/images/promotion/hotpromo/DAILY-LOGIN-CASH-BONUS/promo-bg2.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  background-color: #0c1510;
  max-width: 100%;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .taglines-and-monkey-image {
      width: 100%;
    }

    .monkey-wrapper {
      width: 100%;

      .monkey-image {
        width: 100%;
      }
    }
  }

  .middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -100px;

    .treasure-chest-image {
      width: 100%;
      max-width: 15vw;
    }

    .claim-rewards-btn {
      width: 100%;
      max-width: 15vw;
      cursor: pointer;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }

  .bottom {
    padding-bottom: 50px;
  }

  .table-daily-desc {
    border-collapse: collapse;
    margin-bottom: 20px;
    border-radius: 20px;
    overflow: hidden;

    thead {
      table-layout: fixed;
      background: #00116b60;
      color: #2b2b82;
      height: 60px;
    }
    tbody {
      table-layout: fixed;

      background: #00116b10;
    }

    th:not(:first-child),
    td:not(:first-child) {
      border-left: 1px solid #ffffff10;
    }

    td {
      color: #83a3ca;
      border-bottom: 1px solid #ffffff10;
    }

    .with-border {
      border-left: 1px solid #ffffff10;
    }

    th {
      text-align: center;
      color: #fff;
      font-size: 16px;
    }

    td {
      padding: 8px 12px;
      font-size: 16px;
      text-align: center;
    }
  }

  .btm-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    max-width: 80vw;
    margin: 0 auto;
    padding-bottom: 60px;

    p {
      width: 90%;
      color: #fff;
      margin: 0 auto 10px;
    }
  }
}

.light-theme {
  .table-daily-desc {
    thead {
      background: #ecf5ff;
    }

    th {
      color: #2b2b82;
    }

    tbody {
      background: #fff;
    }

    table,
    td {
      color: #83a3ca;
    }

    th:not(:first-child),
    td:not(:first-child) {
      border-left: 1px solid #83a3ca30;
    }

    td {
      border-bottom: 1px solid #83a3ca30;
    }

    .with-border {
      border-left: 1px solid #83a3ca30;
    }
  }
}
</style>

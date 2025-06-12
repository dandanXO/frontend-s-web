<template>
  <div class="agency-policy">
    <div class="agency-policy-main-img"><img src="../../assets/images/earn-money/about-bg.png" /></div>

    <div class="title">{{ $t("earnMoney.about.inviteToEarn") }}</div>
    <div class="subtitle">{{ $t("earnMoney.about.simplyShare") }}</div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-invite.svg" />
      <div>{{ $t("earnMoney.about.benefits_01") }}</div>
    </div>
    <div class="desc-wrapper">
      <img src="../../assets/images/earn-money/about-reward.svg" />
      <div>{{ $t("earnMoney.about.benefits_02") }}</div>
    </div>

    <div class="agency-policy-separator"></div>
    <div class="agency-policy-title">{{ $t("earnMoney.about.agencyPolicy") }}</div>
    <div class="agency-policy-separator"></div>

    <h6>{{ $t("earnMoney.about.tableRewardsAssigned") }}</h6>
    <q-table
      flat
      :hide-pagination="true"
      :rows-per-page-options="[0]"
      class="table-container q-my-md"
      :columns="columns2"
      :rows="rows2"
      row-key="name"
      dense
    ></q-table>

    <ul>
      <li class="dot-style">{{ $t("earnMoney.about.point_01") }}</li>
      <li class="dot-style">{{ $t("earnMoney.about.point_02") }}</li>
      <li class="dot-style">{{ $t("earnMoney.about.point_03") }}</li>
      <li class="dot-style">{{ $t("earnMoney.about.point_04") }}</li>
    </ul>

    <h4>&nbsp;&middot;&nbsp;{{ $t("earnMoney.about.faq") }}</h4>
    <q-expansion-item :label="$t('earnMoney.about.faq_01')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_01_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_01_02") }}</li>
      </ul>
    </q-expansion-item>

    <q-expansion-item :label="$t('earnMoney.about.faq_02')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_02_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_02_02") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_02_03") }}</li>
      </ul>
    </q-expansion-item>

    <q-expansion-item :label="$t('earnMoney.about.faq_03')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_03_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_03_02") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_03_03") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_03_04") }}</li>

        <q-table
          flat
          :hide-pagination="true"
          :rows-per-page-options="[0]"
          class="table-container q-my-md"
          :columns="columns4"
          :rows="rows4"
          row-key="name"
          dense
        ></q-table>
      </ul>
    </q-expansion-item>

    <q-expansion-item :label="$t('earnMoney.about.faq_04')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_04_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_04_02") }}</li>
      </ul>
    </q-expansion-item>

    <q-expansion-item :label="$t('earnMoney.about.faq_05')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_05_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_05_02") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_05_03") }}</li>
      </ul>
    </q-expansion-item>

    <q-expansion-item :label="$t('earnMoney.about.faq_06')">
      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_06_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_06_02") }}</li>
      </ul>

      <h4>&nbsp;&middot;&nbsp;{{ $t("earnMoney.about.faq_06_example") }}</h4>

      <div class="text-center">
        <img class="affi-graph" src="../../assets/images/earn-money/afiliate-graph.png" />
      </div>

      <table class="rebate-example-table">
        <tbody>
          <tr>
            <td>{{ $t("earnMoney.about.faq_06_table_name") }}</td>
            <td>{{ $t("earnMoney.about.faq_06_table_level") }}</td>
            <td>{{ $t("earnMoney.about.faq_06_table_betting") }}</td>
            <td>{{ $t("earnMoney.about.faq_06_table_members") }}</td>
          </tr>
          <tr>
            <td>{{ $t("earnMoney.about.faq_06_table_you") }}</td>
            <td>8(1.0%)</td>
            <td>972,000</td>
            <td>49</td>
          </tr>
          <tr>
            <td>A</td>
            <td>8(1.0%)</td>
            <td>760,000</td>
            <td>35</td>
          </tr>
          <tr>
            <td>B</td>
            <td>6(0.8%)</td>
            <td>210,000</td>
            <td>13</td>
          </tr>
          <tr>
            <td>C</td>
            <td>1(0.3%)</td>
            <td>2,000</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>

      <ul>
        <li class="dot-style">{{ $t("earnMoney.about.faq_06_dot_01") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_06_dot_02") }}</li>
        <li class="dot-style">{{ $t("earnMoney.about.faq_06_dot_03") }}</li>
      </ul>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { convertToCommaAmount } from "src/boot/utils";
import { userStore } from "stores/index";
import { t } from "src/boot/lang";

const store = userStore();

const columns4 = [
  {
    name: "level",
    label: t("earnMoney.about.table_col_levelDifference"),
    field: "level",
    align: "center"
  },
  { name: "rebates", label: t("earnMoney.about.table_col_rebate"), field: "rebates", align: "center" }
];
const rows4 = [
  {
    level: 1,
    rebates: 0.1
  },
  {
    level: 2,
    rebates: 0.2
  },
  {
    level: 3,
    rebates: 0.3
  },
  {
    level: 4,
    rebates: 0.4
  },
  {
    level: 5,
    rebates: 0.5
  },
  {
    level: 6,
    rebates: 0.6
  },
  {
    level: 7,
    rebates: 0.7
  },
  {
    level: 8,
    rebates: 0.8
  },
  {
    level: 9,
    rebates: 0.9
  },
  {
    level: 10,
    rebates: "1.0"
  },
  {
    level: 11,
    rebates: 1.1
  },
  {
    level: 12,
    rebates: 1.2
  }
];

const columns2 = [
  {
    name: "level",
    label: t("earnMoney.about.table_col_level"),
    field: "level",
    align: "center"
  },
  {
    name: "betAmount",
    label: `${t("earnMoney.about.table_col_betAmount")} (${store.currency.value})`,
    field: "betAmount",
    align: "center"
  },
  { name: "teamMember", label: t("earnMoney.about.table_col_activeMember"), field: "teamMember", align: "center" },
  { name: "rebate", label: t("earnMoney.about.table_col_rate"), field: "rebate", align: "center" }
];
const rows2 = [
  {
    level: "v13",
    betAmount: `${store.currency.value}${convertToCommaAmount(16000000)}`,
    teamMember: "377",
    rebate: "1.5"
  },
  {
    level: "v12",
    betAmount: `${store.currency.value}${convertToCommaAmount(8500000)}`,
    teamMember: "233",
    rebate: "1.4"
  },
  {
    level: "v11",
    betAmount: `${store.currency.value}${convertToCommaAmount(5000000)}`,
    teamMember: "144",
    rebate: "1.3"
  },
  {
    level: "v10",
    betAmount: `${store.currency.value}${convertToCommaAmount(2600000)}`,
    teamMember: "89",
    rebate: "1.2"
  },
  {
    level: "v9",
    betAmount: `${store.currency.value}${convertToCommaAmount(1400000)}`,
    teamMember: "55",
    rebate: "1.1"
  },
  {
    level: "v8",
    betAmount: `${store.currency.value}${convertToCommaAmount(750000)}`,
    teamMember: "34",
    rebate: "1.0"
  },
  {
    level: "v7",
    betAmount: `${store.currency.value}${convertToCommaAmount(420000)}`,
    teamMember: "21",
    rebate: "0.9"
  },
  {
    level: "v6",
    betAmount: `${store.currency.value}${convertToCommaAmount(200000)}`,
    teamMember: "13",
    rebate: "0.8"
  },
  {
    level: "v5",
    betAmount: `${store.currency.value}${convertToCommaAmount(100000)}`,
    teamMember: "8",
    rebate: "0.7"
  },
  {
    level: "v4",
    betAmount: `${store.currency.value}${convertToCommaAmount(35000)}`,
    teamMember: "5",
    rebate: "0.6"
  },
  {
    level: "v3",
    betAmount: `${store.currency.value}${convertToCommaAmount(14000)}`,
    teamMember: "3",
    rebate: "0.5"
  },
  {
    level: "v2",
    betAmount: `${store.currency.value}${convertToCommaAmount(500)}`,
    teamMember: "2",
    rebate: "0.4"
  },
  {
    level: "v1",
    betAmount: `${store.currency.value}${convertToCommaAmount(200)}`,
    teamMember: "1",
    rebate: "0.3"
  }
];

const columns3 = [
  {
    name: "level",
    label: t("earnMoney.about.table_col_level"),
    field: "level",
    align: "center"
  },
  { name: "1", label: "1", field: "1", align: "center" },
  { name: "2", label: "2", field: "2", align: "center" },
  { name: "3", label: "3", field: "3", align: "center" },
  { name: "4", label: "4", field: "4", align: "center" },
  { name: "5", label: "5", field: "5", align: "center" },
  { name: "6", label: "6", field: "6", align: "center" },
  { name: "7", label: "7", field: "7", align: "center" },
  { name: "8", label: "8", field: "8", align: "center" },
  { name: "9", label: "9", field: "9", align: "center" },
  { name: "10", label: "10", field: "10", align: "center" },
  { name: "11", label: "11", field: "11", align: "center" },
  { name: "12", label: "12", field: "12", align: "center" },
  { name: "13", label: "13", field: "13", align: "center" }
];
const rows3 = [
  {
    level: t("earnMoney.about.table_col_rebate"),
    1: "0.3",
    2: "0.4",
    3: "0.5",
    4: "0.6",
    5: "0.7",
    6: "0.8",
    7: "0.9",
    8: "1.0",
    9: "1.1",
    10: "1.2",
    11: "1.3",
    12: "1.4",
    13: "1.5"
  }
];
</script>

<style scoped lang="scss">
.agency-policy {
  background-size: cover;
  background-image: url("../../assets/images/account/shadow2-bg.png");

  img {
    width: 100%;
  }

  .title {
    background: linear-gradient(180deg, #d6b335 0%, #fff96b 50%, #f2ae01 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0 0 15px 0;
    font-size: 16px;
    letter-spacing: 0.5px;
    font-weight: 400;
  }

  .desc-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 0 25px 0;
    letter-spacing: 0.5px;

    img {
      width: 56px;
      height: 56px;
    }
  }

  .agency-policy-main-img {
    margin-left: -16px;
    margin-right: -16px;

    &:after {
      content: "";
      background: linear-gradient(to bottom, rgba(17, 19, 31, 0.9), rgba(255, 255, 255, 0));
      position: absolute;
      top: 0;
      left: 0;
      height: 100px;
      width: 100%;
    }
  }

  .agency-policy-separator {
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #00b9a1 0.01%, rgba(92, 70, 231, 0) 100%);
    height: 2px;
  }

  .agency-policy-title {
    // background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #5c46e7 0.01%, rgba(92, 70, 231, 0) 100%);
    // background-image: url("../../assets/images/earn-money/agency-policy-label.png");
    background-repeat: no-repeat;
    background-position: center center;
    background: radial-gradient(50% 75% at 50% 50%, rgba(92, 70, 231, 0) 0%, #00b9a1 0.01%, rgba(92, 70, 231, 0) 100%);
    background-size: 100% auto;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin: 1px -16px;
  }

  :deep(.q-item) {
    padding: 0;
  }

  :deep(.q-expansion-item) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  :deep(.q-item__label) {
    color: #ffffff;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  ul {
    padding-inline-start: 1rem;

    li {
      list-style-type: decimal;
      font-size: 0.95rem;
      line-height: 1.25rem;
      text-align: left;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 0.75rem 0;
    }

    .dot-style {
      list-style-type: disc;
      letter-spacing: 0.5px;
      line-height: 1.7;
    }
  }
  :deep(.q-table__container) {
    background: transparent !important;
    border-radius: 12px;
  }
  .table-container {
    :deep(thead) {
      background: linear-gradient(180deg, #0a534c 0%, #0a4855 100%);
    }

    :deep(tbody) {
      background: #016d5e;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      tr {
        &:nth-child(2n) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: #005348;
        }
      }
    }

    :deep(thead) {
      th:nth-child(3) {
        white-space: normal;
      }
    }

    .text-center {
      font-size: 0.95rem;
      font-weight: 700;
      width: 2rem;
      border-bottom-width: 0;
      border-right-width: 1px;
      border-color: black;
      padding: 0 0.25rem;
    }
  }

  .copy-link-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .copy-link {
      width: 25rem;
      padding: 1rem;
    }

    span {
      position: absolute;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }

  h6 {
    font-size: 14px;
    text-align: center;
    margin-bottom: 0px;
    margin-top: 7px;
  }

  h4 {
    margin-bottom: 5px;
    font-size: 22px;
  }

  .affi-graph {
    margin: 10px auto;
    width: calc(70% - 20px);
    text-align: center;
  }

  .rebate-example-table {
    width: calc(100% - 20px);
    margin: 0px auto 5px;
    border-collapse: collapse;

    tbody {
      table-layout: fixed;
    }

    td {
      padding: 4px 6px;
      border: 1px solid #fff;
      font-size: 16px;
    }
  }
}
</style>

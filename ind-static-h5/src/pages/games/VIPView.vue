<template>
  <ProfileSummary :homeProfile="true" />

  <div class="vip-container">

    <div class="header-wrapper">
      <div class="vertical-line"></div>
      <div class="header">
        Monthly Cumulative Deposit An Upgrade Vip Level
      </div>
    </div>

    <q-table flat :hide-pagination="true" :columns="columns" :rows="rows" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props" style="display:none">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;</div>
            <!-- unable to adjust table width... -->
            <template v-else>
              <div style="white-space: normal; text-align: center">Monthly Cumulative Deposit An Upgrade Vip Level</div>
            </template>
          </q-th>
        </q-tr>

        <q-tr class="top-header">
          <q-td>Level</q-td>
          <q-td>Amount</q-td>
          <q-td style="width: 60px">Turnover</q-td>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              <div style="text-align: center">
                Deposit ₹
                <span class>{{ col.value }}</span>
              </div>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

        <template v-slot:bottom-row>
        <q-tr style="display:none">
          <q-td colspan="100%" class="bottom-note text-left">
            After the recharge on the day reaches the standard, the next day will increase the VIP level and issue
            corresponding upgrade rewards.
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="hint-msg">After the recharge on the day reaches the standard, the next day will increase the VIP level and issue corresponding upgrade rewards.</div>

    <q-table flat :hide-pagination="true" :columns="columns3" :rows="rows3" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props" style="display:none">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <!-- unable to adjust table width... -->
            <template v-else>
              <div style="white-space: normal; text-align: center">VIP Promotion Bonus</div>
            </template>
          </q-th>
        </q-tr>

        <q-tr class="top-header">
          <q-td>Level</q-td>
          <q-td>Amount</q-td>
          <q-td style="width: 60px">Turnover</q-td>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              <div style="text-align: center">
                ₹
                <span class>{{ col.value }}</span>
              </div>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr style="display:none">
          <q-td colspan="100%" class="bottom-note text-left">
            Promotion Bonus: Every time you advance, you can instantly receive a promotion reward.
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="hint-msg">Promotion Bonus: Every time you advance, you can instantly receive a promotion reward.</div>

    <q-table flat :hide-pagination="true" :columns="columns4" :rows="rows4" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props" style="display:none">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <div v-else-if="colIndex === 2" style="width: 60px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <!-- unable to adjust table width... -->
            <template v-else>
              <div style="text-align: center; padding-right: 60px">VIP Monthly Cash Bonus</div>
            </template>
          </q-th>
        </q-tr>

        <q-tr class="top-header">
          <q-td>Level</q-td>
          <q-td style="text-align: right">Amount</q-td>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              <div style="text-align: right">
                ₹
                <span class>{{ col.value }}</span>
              </div>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr style="display:none">
          <q-td colspan="100%" class="bottom-note text-left">
            Cash Bonus: Based on your VIP level at the end of this month, this reward will be sent to you at 10 a.m. on
            the 1st of next month.
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="hint-msg">Cash Bonus: Based on your VIP level at the end of this month, this reward will be sent to you at 10 a.m. on
            the 1st of next month.</div>

    <q-table flat :hide-pagination="true" :columns="columns2" :rows="rows2" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props" style="display:none">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <div v-else-if="colIndex === 2" style="width: 90px">&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <template v-else>
              <div style="text-align: center; padding-right: 60px">VIP Daily Withdrawal Limit</div>
            </template>
          </q-th>
        </q-tr>

        <q-tr class="top-header">
          <q-td>Level</q-td>
          <q-td style="text-align: right">Amount</q-td>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              ₹
              <span class>{{ col.value }}</span>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr style="display:none">
          <q-td colspan="100%" class="bottom-note text-left">Daily withdrawal limits based on VIP levels.</q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="hint-msg">Daily withdrawal limits based on VIP levels.</div>
  </div>
</template>

<script setup>
import ProfileSummary from "components/ProfileSummary.vue";

const columns = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" },
  { name: "flow", field: "flow", align: "center" }
];
const rows = [
  {
    name: "VIP 1",
    ugprade: "5,000",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "50,000",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "100,000",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "200,000",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "500,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000",
    flow: "x10"
  }
];

const columns2 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
const rows2 = [
  {
    name: "VIP 0",
    ugprade: "2,500",
    flow: "x10"
  },
  {
    name: "VIP 1",
    ugprade: "5,000",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "50,000",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "100,000",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "200,000",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "500,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000",
    flow: "x10"
  }
];

const columns3 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" },
  { name: "flow", field: "flow", align: "center" }
];
const rows3 = [
  {
    name: "VIP 1",
    ugprade: "20",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "25",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "50",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "100",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "200",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "300",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,000",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "2,000",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "3,000",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "10,000",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "20,000",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "30,000",
    flow: "x10"
  }
];

const columns4 = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
const rows4 = [
  {
    name: "VIP 1",
    ugprade: "38",
    flow: "x10"
  },
  {
    name: "VIP 2",
    ugprade: "88",
    flow: "x10"
  },
  {
    name: "VIP 3",
    ugprade: "188",
    flow: "x10"
  },
  {
    name: "VIP 4",
    ugprade: "388",
    flow: "x10"
  },
  {
    name: "VIP 5",
    ugprade: "588",
    flow: "x10"
  },
  {
    name: "VIP 6",
    ugprade: "888",
    flow: "x10"
  },
  {
    name: "VIP 7",
    ugprade: "1,888",
    flow: "x10"
  },
  {
    name: "VIP 8",
    ugprade: "3,888",
    flow: "x10"
  },
  {
    name: "VIP 9",
    ugprade: "8,888",
    flow: "x10"
  },
  {
    name: "VIP 10",
    ugprade: "28,888",
    flow: "x10"
  },
  {
    name: "VIP 11",
    ugprade: "58,888",
    flow: "x10"
  },
  {
    name: "VIP 12",
    ugprade: "88,888",
    flow: "x10"
  }
];
</script>

<style lang="scss">
.vip-container {
  padding: 0 1.75rem;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;

  .top-header {
    color: #f1f1f1;
    background: linear-gradient(180deg, #41206F 0%, #1F2862 100%);
  }

  .q-table__card {
    background: transparent !important;
    margin: 0 0 1.25rem 0;
    border-radius: 8px;
  }

  .vip-icon {
    width: 3.5rem;
    margin: 0.5rem 0 0;
  }

  thead {
    th {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      text-align: left;
      border-width: 0px !important;

      &:first-child {
        width: 65px;
      }
    }
  }
  thead > :first-child {
    background: linear-gradient(270deg, #5d01b9 -0.1%, #b11bff 50.22%, #6a069c 97.6%);
  }
  tbody > :nth-child(odd) {
    background: rgba(21, 0, 37, 0.2);
    background: #652C93;
  }
  tbody > :nth-child(even) {
    background: rgba(21, 0, 37, 0.5);
    background: #502175;
  }

  span {
    background-color: #f3ec78 !important;
    background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%) !important;
    background-size: 100% !important;
    -webkit-background-clip: text !important;
    -moz-background-clip: text !important;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }

  .text-center {
    border-bottom-width: 0 !important;
    padding: 0 0.25rem;
  }

  .text-right {
    border-bottom-width: 0 !important;
    padding: 0 1.5rem;
  }

  .bottom-note {
    color: #edd3ff;
    font-size: 0.85rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 0.5rem 1.25rem;
    white-space: normal;
  }

  .hint-msg {
    border-radius: 8px;
    background: linear-gradient(180deg, #2F1B4D 0%, #1A2045 100%);
    padding: 10px;
    margin: 0 0 1.25rem 0;
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-weight: 400;
    line-height: 19px;
  }

  .header-wrapper {
    display: flex;
    gap: 15px;
    padding: 20px 0px;

    .vertical-line {
      width: 10px;
      background: linear-gradient(102.74deg, rgba(174, 110, 223, 0.5) 20.78%, rgba(255, 255, 255, 0) 100.75%);
    }

    .header {
    font-size: 26px;
    font-weight: 700;
    line-height: 32px;
    text-align: left;
    background: linear-gradient(90deg, #BC70DF 0%, #FCD23C 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  }

  
}

@media (max-width: 410px) {
  .vip-container {
    padding: 0 0.75rem;
  }
}
</style>

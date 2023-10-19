<template>
  <div class="vip-container">
    <q-table flat :hide-pagination="true" :columns="columns" :rows="rows" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <!-- unable to adjust table width... -->
            <template v-else>
              Monthly Cumulative Deposit
              <br />
              An Upgrade Vip Level
            </template>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              Deposit Rs
              <span class>{{ col.value }}</span>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="100%" class="bottom-note text-left">
            After The Recharge On The Day Reaches The Standard, The
            <br />
            Next Day Will Increase The VIP Level And Issue Corresponding
            <br />
            Upgrade Rewards
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table flat :hide-pagination="true" :columns="columns2" :rows="rows2" row-key="name" :rows-per-page-options="[0]">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <img v-if="colIndex === 0" class="vip-icon" src="../../assets/images/bonus/vip.png" alt="" />
            <!-- unable to adjust table width... -->
            <template v-else>
              Description Of Daily Withdrawal Limit
              <br />
              Corresponding To VIP Level
            </template>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
            <template v-if="colIndex === 1">
              Daily Maximum Withdrawal Amount:
              <span class>{{ col.value }}</span>
            </template>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "ugprade", label: "Monthly Cumulative Deposit An Upgrade Vip Level", field: "ugprade", align: "right" }
];
const rows = [
  {
    name: "VIP 1",
    ugprade: "5,000"
  },
  {
    name: "VIP 2",
    ugprade: "10,000"
  },
  {
    name: "VIP 3",
    ugprade: "20,000"
  },
  {
    name: "VIP 4",
    ugprade: "100,000"
  },
  {
    name: "VIP 5",
    ugprade: "150,000"
  },
  {
    name: "VIP 6",
    ugprade: "200,000"
  },
  {
    name: "VIP 7",
    ugprade: "500,000"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000"
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
    name: "VIP 1",
    ugprade: "2,500"
  },
  {
    name: "VIP 2",
    ugprade: "5,000"
  },
  {
    name: "VIP 3",
    ugprade: "10,000"
  },
  {
    name: "VIP 4",
    ugprade: "20,000"
  },
  {
    name: "VIP 5",
    ugprade: "100,000"
  },
  {
    name: "VIP 6",
    ugprade: "200,000"
  },
  {
    name: "VIP 7",
    ugprade: "500,000"
  },
  {
    name: "VIP 8",
    ugprade: "1,000,000"
  },
  {
    name: "VIP 9",
    ugprade: "2,000,000"
  },
  {
    name: "VIP 10",
    ugprade: "5,000,000"
  },
  {
    name: "VIP 11",
    ugprade: "10,000,000"
  },
  {
    name: "VIP 12",
    ugprade: "20,000,000"
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

  .q-table__card {
    background: transparent !important;
    margin: 0 0 1.25rem 0;
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
    }
  }
  thead > :first-child {
    background: linear-gradient(270deg, #5d01b9 -0.1%, #b11bff 50.22%, #6a069c 97.6%);
  }
  tbody > :nth-child(odd) {
    background: rgba(21, 0, 37, 0.2);
  }
  tbody > :nth-child(even) {
    background: rgba(21, 0, 37, 0.5);
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
  }
}
</style>

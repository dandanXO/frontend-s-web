<template>
  <div class="spinwheel-winner-container">
    <div class="winner-table-wrapper">
      <q-table
        class="winner-table q-mb-xl"
        no-data-label="ไม่มีข้อมูล"
        loading-label="กำลังโหลด..."
        :loading="loading"
        :columns="columns"
        :rows="rows"
        :hide-pagination="true"
      >
      </q-table>

      <img
        class="treasure-box-img"
        src="../assets/images/promotion/spinwheel/treasure_box.png"
      />
    </div>

    <div class="note">
      Come back daily to complete the multiwheel !
      <div>
        Come back daily to unlock the inside wheel and more chance to get bigger
        price and Iphone15 pro max !
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const columns = ref([
  {
    name: "name",
    field: "name",
    label: "Name",
    align: "center",
  },
  {
    name: "prize",
    field: "prize",
    label: "Prize",
    align: "center",
  },
  {
    name: "date",
    field: "date",
    label: "Date",
    align: "center",
  },
]);
const rows = ref([
  {
    name: "zau****13",
    prize: "IPhone 15 pro max",
    date: "2023-11-10 15:30:23",
  },
  {
    name: "zau****13",
    prize: "180",
    date: "2023-11-10 15:30:23",
  },
  {
    name: "zau****13",
    prize: "IPhone 15 pro max",
    date: "2023-11-10 15:30:23",
  },
  {
    name: "zau****13",
    prize: "180",
    date: "2023-11-10 15:30:23",
  },
]);
</script>

<style lang="scss">
.spinwheel-winner-container {
  .winner-table-wrapper {
    position: relative;

    .winner-table {
      border-radius: 1.25rem 1.25rem 0rem 0rem;
      border: 1px solid #5b0ed7;
      border-bottom: 0px solid transparent;
      box-shadow: unset;
      background: linear-gradient(
        180deg,
        rgba(127, 56, 217, 0.4) 0%,
        rgba(176, 38, 198, 0) 100%
      );
    }

    .q-table--horizontal-separator tbody tr:not(:last-child) > td {
      border-bottom-width: 0;
    }

    .q-table {
      tbody {
        tr {
          th {
            color: #fff;
            text-align: center;
            font-family: Arial;
            font-size: 14px;
            font-weight: 700;
            line-height: normal;
            letter-spacing: 0.151rem;
          }

          td {
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            font-family: Arial;
            font-size: 12px;
            font-weight: 400;
            line-height: normal;
            letter-spacing: 0.14063rem;
          }
        }
      }
    }

    .treasure-box-img {
      position: absolute;
      top: -7.5%;
      width: 50px;
    }
  }

  .note {
    color: #eda1ff;
    text-align: center;
    font-family: Arial Black;
    font-size: 14px;
    font-weight: 900;
    line-height: normal;
    letter-spacing: 0.14063rem;
    width: 90%;
    margin: 0 auto;
  }
}
</style>

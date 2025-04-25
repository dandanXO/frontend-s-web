<template>
  <ProfileSummary :homeProfile="true" />

  <div class="bonus-page">
    <ProfileProgressBanner />

    <div class="detail-btn-container" @click="onDetailClick()">
      <span class="">Bonus Pot Detail</span>
    </div>

    <div class="vip-table-container">
      <q-table
        flat
        :hide-pagination="true"
        :columns="columns"
        :rows="rows"
        row-key="name"
        :rows-per-page-options="[0]"
        bordered
        :separator="'cell'"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <img v-if="colIndex === 0" class="vip-icon" src="../assets/images/bonus/vip.png" alt="" />
              <template v-if="colIndex === props.cols.length - 1">
                1st Day Of
                <br />
                Next Month
              </template>
              <template v-else>
                {{ col.label }}
              </template>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
              <div :class="colIndex === 0 ? '' : 'coin-container'">
                <img v-if="colIndex !== 0" class="coin" src="../assets/images/bonus/coin.png" alt="" />
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="countdown-container">
      <div class="noticeboard">
        You Can Get
        <span>0.3%</span>
        Of The Daily Wager As A Reward, Credited To Your Account Every Day At 0:00 Indian Time
      </div>

      <img class="character-blue" src="../assets/images/bonus/character-blue.png" alt="" style="display: none" />
      <div class="right-container" style="display: none">
        <!-- <div class="countdown">
          <div class="common-text">
            Ready To
            <br />
            Use In
          </div>
          <div class="countdown-btn-container" @click="redeem()">
            <img class="countdown-btn" src="../assets/images/bonus/countdown-btn.png" alt="" />
            <span class="countdown-text">{{ timeRef }}</span>
          </div>
        </div> -->
        <div class="noticeboard">
          You Can Get
          <span>0.3%</span>
          Of The Daily Wager As A Reward, Credited To Your Account Every Day At 0:00 Indian Time
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { date } from "quasar";
import { useRoute, useRouter } from "vue-router";
import ProfileSummary from "components/ProfileSummary.vue";
import ProfileProgressBanner from "components/ProfileProgressBanner.vue";
import { convertToCommaAmount } from "src/boot/utils";

const route = useRoute();
const router = useRouter();

// detail btn
const onDetailClick = () => {
  router.push({ path: "/vip", query: { redirect: route.path } });
};

// table
const columns = [
  {
    name: "vip",
    required: true,
    label: "",
    align: "center",
    field: (row) => row.name
  },
  { name: "award", label: "Award", field: "award", align: "right" },
  { name: "firstDay", label: "1st Day Of Next Month", field: "firstDay", align: "right" }
];
const rows = [
  {
    name: "VIP 0",
    award: convertToCommaAmount(0),
    firstDay: convertToCommaAmount(0)
  },
  {
    name: "VIP 1",
    award: convertToCommaAmount(20),
    firstDay: convertToCommaAmount(38)
  },
  {
    name: "VIP 2",
    award: convertToCommaAmount(25),
    firstDay: convertToCommaAmount(88)
  },
  {
    name: "VIP 3",
    award: convertToCommaAmount(50),
    firstDay: convertToCommaAmount(188)
  },
  {
    name: "VIP 4",
    award: convertToCommaAmount(100),
    firstDay: convertToCommaAmount(388)
  },
  {
    name: "VIP 5",
    award: convertToCommaAmount(200),
    firstDay: convertToCommaAmount(588)
  },
  {
    name: "VIP 6",
    award: convertToCommaAmount(300),
    firstDay: convertToCommaAmount(888)
  },
  {
    name: "VIP 7",
    award: convertToCommaAmount(1000),
    firstDay: convertToCommaAmount(1888)
  },
  {
    name: "VIP 8",
    award: convertToCommaAmount(2000),
    firstDay: convertToCommaAmount(3888)
  },
  {
    name: "VIP 9",
    award: convertToCommaAmount(3000),
    firstDay: convertToCommaAmount(8888)
  },
  {
    name: "VIP 10",
    award: convertToCommaAmount(10000),
    firstDay: convertToCommaAmount(28888)
  },
  {
    name: "VIP 11",
    award: convertToCommaAmount(20000),
    firstDay: convertToCommaAmount(58888)
  },
  {
    name: "VIP 12",
    award: convertToCommaAmount(30000),
    firstDay: convertToCommaAmount(88888)
  }
];

// timer
let timeRef = ref("");
let scheduler;
scheduler = setInterval(() => {
  const curDate = new Date();
  const endDate = date.endOfDate(curDate, "day");
  const offset = 5.5 * 60 * 60 * 1000; // GMT+5.5
  const difference = endDate - curDate - offset;

  if (difference <= 0) {
    timeRef.value = "Redeem";
    clearInterval(scheduler);
    return;
  }

  timeRef.value = date.formatDate(difference, "HH:mm:ss");
}, 1000);

const redeem = () => {};
</script>

<style lang="scss">
.bonus-page {
  padding: 0 1.75rem;
  overflow: hidden;

  .detail-btn-container {
    background: linear-gradient(180deg, #ffe146 0%, #b54100 100%);
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
  }

  .vip-table-container {
    margin: 1.5rem 0 2rem 0;

    .q-table__card {
      background: transparent !important;
      border-radius: 8px;
    }

    .vip-icon {
      width: 3.5rem;
      margin: 0.5rem 0 0;
    }

    .coin-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .coin {
        width: 2rem;
        margin: 0 0.5rem 0 0;
      }
    }

    thead > :first-child {
      background: rgba(21, 0, 37, 0.5);
      background: linear-gradient(180deg, #41206f 0%, #1f2862 100%);
    }
    tbody > :nth-child(odd) {
      background: rgba(21, 0, 37, 0.2);
      background: #652c93;
    }
    tbody > :nth-child(even) {
      background: rgba(21, 0, 37, 0.5);
      background: #502175;
    }
    tbody > td {
      border-width: 1px;
    }

    .text-center,
    .text-right {
      font-size: 1rem;
      font-weight: 700;
      padding: 0.5rem 1.5rem;
      border-bottom-width: 0;
      text-align:center !important;
    }
  }

  .countdown-container {
    display: flex;
    position: relative;
    line-height: 1.25;
    // background: url("../assets/images/bonus/bonus-page-daily-wager-reward-banner.png");
    min-height: 150px;
    margin-bottom: 20px;

    .noticeboard {
      background: #00000099;
      margin: 20px;
      padding: 20px;
      border-radius: 10px;
      color: #d4cdd6;
      line-height: 25px;
      text-align: center;

      span {
        color: #fff;
      }
    }

    .character-blue {
      width: 15rem;
      height: 100%;
      position: relative;
      left: -6rem;
    }

    .right-container {
      position: absolute;
      right: 0;
      top: 1.5rem;
      height: 12.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .countdown {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 15rem;
        }

        .countdown-btn-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 0 0.5rem;

          .countdown-text {
            position: absolute;
            font-size: 1.75rem;
            font-weight: 700;
            text-align: center;
          }
        }
      }

      .noticeboard {
        font-size: 1.15rem;
        font-weight: 400;
        color: #edd3ff;
        width: 17rem;
        align-self: flex-end;

        span {
          color: #fae576;
        }
      }
    }
  }
}

.common-text {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
}
</style>

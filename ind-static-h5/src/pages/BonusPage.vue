<template>
  <q-dialog align-center v-model="isDetailModalOpen" title="" width="500">Hello</q-dialog>

  <div class="bonus-page">
    <div class="progress-container">
      <div class="left-container">
        <img class="character-red-bg" src="../assets/images/bonus/character-red-bg.png" alt="" />
        <img class="character-red" src="../assets/images/bonus/character-red.png" alt="" />

        <div class="bonus-pot-btn-container">
          <img class="bonus-pot-btn-frame" src="../assets/images/bonus/bonus-pot-btn-frame.png" alt="" />
          <img class="bonus-pot-btn" src="../assets/images/bonus/bonus-pot-btn.png" alt="" />
          <span class="common-text">Bonus Pot</span>
        </div>
      </div>

      <div class="right-container">
        <div class="amount-progress-container">
          <div class="common-text">VIP</div>
          <div class="common-text">{{ `${progressRef} / ${maxProgress}` }}</div>
        </div>
        <q-linear-progress reverse rounded size="5px" :value="progressBarRef" class="progress-bar"></q-linear-progress>
        <div class="common-text">Deposit Monthly To Win Gifts</div>

        <div class="detail-btn-container absolute-bottom-right" @click="openDetailModal()">
          <img class="detail-btn" src="../assets/images/bonus/detail-btn.png" alt="" />
          <span class="common-text">Detail</span>
        </div>
      </div>
    </div>

    <div class="vip-table-container">
      <q-table flat :hide-pagination="true" :columns="columns" :rows="rows" row-key="name" :rows-per-page-options="[0]">
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
      <img class="character-blue" src="../assets/images/bonus/character-blue.png" alt="" />
      <div class="right-container">
        <div class="countdown">
          <div class="common-text">
            Ready To
            <br />
            Use In
          </div>
          <div class="countdown-btn-container" @click="redeem()">
            <img class="countdown-btn" src="../assets/images/bonus/countdown-btn.png" alt="" />
            <span class="countdown-text">{{ timeRef }}</span>
          </div>
        </div>
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

// progress bar
const maxProgress = 5000;
const progressRef = ref(2350);

/**
 * NOTE: q-linear-progress
 * the coloring on the bar done w/ css props "background" & "color"
 * figma required linear-gradient which wasn't available in "color"
 * hence switch "background" to "color" & "color" to "background", reverse value 1 - result.
 */
let progressBarRef = ref();
progressBarRef.value = 1 - progressRef.value / maxProgress;

// detail btn
const isDetailModalOpen = ref(false);
const openDetailModal = () => {
  isDetailModalOpen.value = true;
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
    award: 0,
    firstDay: 0
  },
  {
    name: "VIP 1",
    award: 20,
    firstDay: 38
  },
  {
    name: "VIP 2",
    award: 25,
    firstDay: 88
  },
  {
    name: "VIP 3",
    award: 50,
    firstDay: 188
  },
  {
    name: "VIP 4",
    award: 100,
    firstDay: 388
  },
  {
    name: "VIP 5",
    award: 200,
    firstDay: 588
  },
  {
    name: "VIP 6",
    award: 300,
    firstDay: 888
  },
  {
    name: "VIP 7",
    award: 1000,
    firstDay: 1888
  },
  {
    name: "VIP 8",
    award: 2000,
    firstDay: 3888
  },
  {
    name: "VIP 9",
    award: 3000,
    firstDay: 8888
  },
  {
    name: "VIP 10",
    award: 10000,
    firstDay: 28888
  },
  {
    name: "VIP 11",
    award: 20000,
    firstDay: 58888
  },
  {
    name: "VIP 12",
    award: 30000,
    firstDay: 88888
  }
];

// timer
let timeRef = ref("");
let scheduler;
scheduler = setInterval(() => {
  const curDate = new Date();
  const endDate = date.endOfDate(curDate, "day");
  const offset = 7 * 60 * 60 * 1000; // GMT+7
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

  .progress-container {
    display: flex;
    justify-content: space-between;
    margin: 1.5rem 0 0 0;

    .left-container {
      position: relative;

      .character-red-bg {
        width: 7.5rem;
      }

      .character-red {
        position: absolute;
        left: 0.75rem;
        top: -0.5rem;
        width: 6.25rem;
      }

      .bonus-pot-btn-container {
        position: absolute;
        left: -0.75rem;
        bottom: -1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .bonus-pot-btn-frame {
          position: relative;
          width: 9rem;
        }

        .bonus-pot-btn {
          position: absolute;
          width: 8.5rem;
          left: 0.25rem;
        }

        span {
          position: absolute;
        }
      }
    }

    .right-container {
      position: relative;
      top: 1rem;

      .amount-progress-container {
        display: flex;
        justify-content: space-between;
      }

      .progress-bar {
        border: 1px solid #fed87d;
        background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
        color: #320b5b;
      }

      .detail-btn-container {
        display: flex;
        align-items: center;
        justify-content: center;

        .detail-btn {
          width: 7.5rem;
        }

        span {
          position: absolute;
        }
      }
    }
  }

  .vip-table-container {
    margin: 2.5rem 0 1rem 0;

    .q-table__card {
      background: transparent !important;
    }

    .vip-icon {
      width: 3.5rem;
      margin: 0.5rem 0 0;
    }

    .coin-container {
      display: flex;
      align-items: center;
      justify-content: end;

      .coin {
        width: 1.5rem;
        margin: 0 0.5rem 0 0;
      }
    }

    thead > :first-child {
      background: rgba(21, 0, 37, 0.5);
    }
    tbody > :nth-child(odd) {
      background: rgba(21, 0, 37, 0.2);
    }
    tbody > :nth-child(even) {
      background: rgba(21, 0, 37, 0.5);
    }

    .text-center,
    .text-right {
      font-size: 1rem;
      font-weight: 700;
      padding: 0.5rem 1.5rem;
      border-bottom-width: 0;
    }
  }

  .countdown-container {
    display: flex;
    position: relative;
    line-height: 1.25;

    .character-blue {
      width: 15rem;
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

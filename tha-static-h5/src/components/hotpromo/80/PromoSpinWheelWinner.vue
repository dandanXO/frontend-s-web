<template>
  <div class="spinwheel-winner-container">
    <div class="winner-table-wrapper q-mb-xl">
      <q-table
        class="winner-table"
        no-data-label="ไม่มีข้อมูล"
        loading-label="กำลังโหลด..."
        :loading="loading"
        :columns="columns"
        :rows="rows"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props" :class="props.value === grandPrize ? 'iphone' : ''">
            <img
              v-if="props.value === grandPrize ? true : false"
              class="iphone-img"
              src="../../../assets/images/promotion/spinwheel/iphone.png"
            />
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- <div class="note">
      Come back daily to complete the multiwheel !
      <div>Come back daily to unlock the inside wheel and more chance to get bigger price and Iphone15 pro max !</div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { eventapi } from "boot/axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();


const grandPrize = "IPhone 15 Pro Max";

const columns = ref([
  {
    name: "name",
    field: "name",
    label: t("lang.name"),
    align: "center"
  },
  {
    name: "prize",
    field: "prize",
    label: t("lang.prize"),
    align: "center"
  },
  {
    name: "date",
    field: "date",
    label: t("lang.date"),
    align: "center"
  }
]);

// mock data
// { name: "tes****0", prize: 74.8, date: "2023-11-17 18:20" }
const rows = ref([]);
const temp_rows = ref([]);

const loading = ref(false);

function initSpinWheelWinnerAPI(callback) {
  eventapi
    .post("/multiWheel/list?promoCode=multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        data.forEach((e) => {
          const { memberName, bonus, playTime, privilegeKey } = e;

          const obj = {
            name: memberName,
            prize: bonus || grandPrize,
            date: playTime,
            privilegeKey
          };

          if (!rows.value.length) {
            rows.value.push(obj);
          } else {
            let isNew = true;
            rows.value.forEach((e) => {
              if (e.privilegeKey === privilegeKey) isNew = false;
              if (!privilegeKey) isNew = true;
            });

            // if new --> scrollTop = 0 w/ smoothBehaviour
            // or put darker color indicate new
            if (isNew) {
            }
            temp_rows.value.push(obj);
          }
        });
      }
    })
    .catch((e) => {
      console.log("error", e);
    })
    .then(() => {
      callback && callback();
    });
}

let initSpinWheelWinnerAPIScheduler = null;
let tableScrollScheduler = null;
onMounted(() => {
  loading.value = true;
  initSpinWheelWinnerAPI(() => {
    loading.value = false;
  });
  
  initSpinWheelWinnerAPIScheduler = setInterval(() => {
    initSpinWheelWinnerAPI();
  }, 20000);

  tableScrollScheduler = setInterval(() => {
    if (temp_rows.value.length > 0) {
      let row = temp_rows.value[0];
      temp_rows.value.splice(0, 1);

      // console.log(temp_rows.value);
      rows.value.push(row);

      setTimeout(() => {
        var winnerTable = document.getElementsByClassName("winner-table")[0].getElementsByTagName("tbody")[0];
        if (winnerTable) {
          winnerTable.scrollTo({ top: winnerTable.scrollHeight, behavior: "smooth" });
        }
      }, 250);
    }
  }, 3500);
});

onUnmounted(() => {
  clearInterval(initSpinWheelWinnerAPIScheduler);
  clearInterval(tableScrollScheduler);
});
</script>

<style scoped lang="scss">
.spinwheel-winner-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }

  .winner-table-wrapper {
    position: relative;

    .winner-table {
      border-radius: 1.25rem 1.25rem 0rem 0rem;
      border: 1px solid #D71B0F;
      border-bottom: 0px solid transparent;
      box-shadow: unset;
      background: linear-gradient(180deg, rgba(145, 1, 1, 0.4) 0%, rgba(61, 25, 23, 0) 100%);

      .iphone {
        color: #ffa3e0;
        text-align: center;
        font-family: Arial;
        font-size: 12px;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.14063rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
    }

    :deep(.q-table--horizontal-separator tbody tr:not(:last-child) > td) {
      border-bottom-width: 0;
    }

    :deep(.q-table) {
      tbody {
        display: block;
        max-height: 250px;
        overflow-y: scroll;

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;

          td {
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            font-family: Arial;
            font-size: 12px;
            font-weight: 400;
            line-height: normal;
            letter-spacing: 0.14063rem;
            text-wrap: wrap;
          }
        }
      }

      thead {
        tr {
          display: table;
          width: 100%;
          table-layout: fixed;

          th {
            color: #fff;
            text-align: center;
            font-family: Arial;
            font-size: 14px;
            font-weight: 700;
            line-height: normal;
            letter-spacing: 0.151rem;
          }
        }
      }
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

  .spinlist-tr {
  }
}

.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-leave-active {
  transition: none;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

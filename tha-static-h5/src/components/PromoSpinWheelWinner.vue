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
          <q-td
            :props="props"
            :class="props.value === grandPrize ? 'iphone' : ''"
          >
            <img
              v-if="props.value === grandPrize ? true : false"
              class="iphone-img"
              src="../assets/images/promotion/spinwheel/iphone.png"
            />
            {{ props.value }}
          </q-td>
        </template>
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
import { onMounted, ref } from "vue";
import { eventapi } from "boot/axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const grandPrize = "IPhone 15 Pro Max";

const columns = ref([
  {
    name: "name",
    field: "name",
    label: t("lang.name"),
    align: "center",
  },
  {
    name: "prize",
    field: "prize",
    label: t("lang.prize"),
    align: "center",
  },
  {
    name: "date",
    field: "date",
    label: t("lang.date"),
    align: "center",
  },
]);
const rows = ref([]);

function initSpinWheelWinnerAPI() {
  eventapi
    .post("/multiWheel/list?promoCode=tha-multi-wheel")
    .then((res) => {
      const { code, data } = res.data;
      if (code === 0) {
        data.forEach((e) => {
          const { memberName, bonus, playTime, privilegeKey } = e;

          const obj = {
            name: memberName,
            prize: bonus || grandPrize,
            date: playTime,
            privilegeKey,
          };

          if (!rows.value.length) {
            rows.value.unshift(obj);
          } else {
            let isNew = true;
            rows.value.forEach((e) => {
              if (e.privilegeKey === privilegeKey) isNew = false;
              if (!privilegeKey) isNew = true;
            });

            // if new --> scrollTop = 0 w/ smoothBehaviour
            // or put darker color indicate new
            if (isNew) rows.value.unshift(obj);
          }
        });
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
}

onMounted(() => {
  initSpinWheelWinnerAPI();

  setInterval(() => {
    initSpinWheelWinnerAPI();
  }, 30000);
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
      border: 1px solid #5b0ed7;
      border-bottom: 0px solid transparent;
      box-shadow: unset;
      background: linear-gradient(
        180deg,
        rgba(127, 56, 217, 0.4) 0%,
        rgba(176, 38, 198, 0) 100%
      );

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
        max-height: 200px;
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

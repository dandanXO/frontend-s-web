<template>
  <q-dialog class="selection-modal" v-model="selectionRef" position="bottom">
    <div class="selection-modal-wrapper">
      <div class="selection-header">
        <div class="select-cancel" v-close-popup>取消</div>
        <div class="select-confirm" @click="searchRecord()" v-close-popup>确认</div>
      </div>
      <Swiper
        class="swiper-container"
        :slides-per-view="5"
        :loop="false"
        :pagination="false"
        :direction="'vertical'"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(e, i) in platformsList" :key="`${e}-${i}`" class="swiper-slide">
          <div class="slide-item" @click="onSlideClick(i)">
            <div :class="getLabelClass(i)">
              {{ e.label }}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </q-dialog>

  <div class="table-record">
    <div class="select-btn">
      <q-btn class="common-large-btn" label="点击选择平台" @click="showSelection" />
    </div>

    <RecordComponent
      ref="recordRef"
      recordType="bethistory"
      :loading="visible"
      :list="tableData"
      :headers="tableHeaders"
      @loadnewdata="loadNewData"
      :isEnded="isEnded"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { userStore } from "src/stores";
import moment from "moment/moment";
import RecordComponent from "../../components/RecordComponent.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";

const store = userStore();

const selectionRef = ref(false);
const showSelection = () => {
  selectionRef.value = true;
};

const swiperInstance = ref();
const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const selectedPlatformIndex = ref(0);
const onSlideClick = (i) => {
  // set value
  selectedPlatformIndex.value = i;

  // set color

  // set scroll position
  const centeredIndex = i - 2;
  swiperInstance.value.slideTo(centeredIndex);
};

const platformsList = ref([]);
const getLabelClass = (i) => {
  const difference = Math.abs(selectedPlatformIndex.value - i);
  if (!difference) return "active-text";
  else if (difference === 1) return "almost-active-text";
  else return "inactive-text";
};

const visible = ref(true);
const tableData = ref([]);

const recordRef = ref();
const searchRecord = () => {
  recordRef.value.clearTable();

  endDate = moment().format("YYYY-MM-DD");
  startDate = moment().add(-7, "days").format("YYYY-MM-DD");
  loadDepositTable(true);
};

const isEnded = ref(false);

var apiUrl = "/session/member/gameBetRecord";

var endDate = moment().format("YYYY-MM-DD");
var startDate = moment().add(-7, "days").format("YYYY-MM-DD");

const loadNewData = () => {
  startDate = moment(startDate).add(-7, "days").format("YYYY-MM-DD");
  endDate = moment(endDate).add(-7, "days").format("YYYY-MM-DD");

  if (startDate <= moment().add(-30, "days").format("YYYY-MM-DD")) {
    console.log("mor than 3 months");
    isEnded.value = true;
    return;
  }
  loadDepositTable(false);
};

const loadDepositTable = (isNew = true) => {
  if (isNew) {
    visible.value = true;
    tableData.value = [];
    isEnded.value = false;
  }
  console.log(startDate);
  console.log(endDate);

  const platform = platformsList.value[selectedPlatformIndex.value];
  const platformName = platform ? platform.value : "";
  let paramData = {
    startDate: startDate,
    endDate: endDate,
    platform: platformName,
    memberId: store.id
  };

  api
    .get(apiUrl, {
      params: paramData
    })
    .then((res) => {
      if (res.code === 0) {
        if (res.data.records.length > 0) {
          tableData.value.push(...res.data.records);
        }
      }
    })
    .finally(() => {
      if (isNew) {
        visible.value = false;
      }
    });
};

const loadPlatformLists = () => {
  cached
    .get("PLATFORMS", () =>
      api.get("/platform").then((response) => {
        return response;
      })
    )
    .then((data) => {
      console.log(data);
      _.each(data, function (item, index) {
        var option = {
          label: item.name,
          value: item.code
        };
        platformsList.value.push(option);
      });
    });
};

const tableHeaders = [
  {
    key: "betTime",
    label: "游戏时间"
  },
  {
    key: "platform",
    label: "游戏平台"
  },
  {
    key: "bet",
    label: "投注"
  },
  {
    key: "payout",
    label: "派彩"
  },
  {
    key: "gameType",
    label: "游戏类型"
  },
  {
    key: "betStatus",
    label: "投注状态"
  }
];

onMounted(async () => {
  loadPlatformLists();
  loadDepositTable();
});
</script>

<style lang="scss">
.table-record {
  width: 100%;
  gap: 10px;

  .select-platform {
    display: none;
  }

  .select-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;

    .q-btn {
      width: 95%;
    }
  }

  .q-card {
    background: rgb(33, 37, 52);
    color: rgb(186, 206, 241);
  }

  .label {
    color: #fff;
  }

  .q-btn {
    font-size: 11px !important;
  }
}

.selection-modal {
  .selection-modal-wrapper {
    width: 100%;
    background: $white;
    box-shadow: 0px 4px 6px 0px #c3d4e6 inset;
    border-radius: 10px;
    padding: 1.25rem;

    .selection-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 1.5rem 0;

      .select-cancel {
        color: $font-1;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .select-confirm {
        color: #468cff;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    .swiper-container {
      height: 15rem;

      .swiper-wrapper {
        .slide-item {
          font-size: 1rem;
          font-weight: 400;
          border-top: 1px solid #ecedf0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;

          .active-text {
            color: $font-2;
          }

          .almost-active-text {
            color: rgba(66, 79, 114, 0.5);
          }

          .inactive-text {
            color: rgba(66, 79, 114, 0.3);
          }
        }
      }
    }
  }
}
</style>

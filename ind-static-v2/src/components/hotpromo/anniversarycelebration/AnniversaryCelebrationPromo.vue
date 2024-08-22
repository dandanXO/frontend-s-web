<template>
  <div>
    <template v-if="rewardEligibility">
      <p class="font-bold">
        Dear players: On the occasion of the 3rd anniversary celebration, we have launched an unprecedented bonus
        giveaway. A total of 2888rs can be obtained! What are you waiting for? Just go online and you can get a huge
        bonus!
      </p>
      <div class="q-my-md">
        <img src="../../../assets/images/promotion/anniversary-celebration/title-img-dailyrewards.png" />
      </div>

      <div class="prize-container">
        <template v-for="(item, index) in dailyRewards" :key="index">
          <div class="content-item" :class="{ 'full-wide': index === dailyRewards.length - 1 }">
            <div class="item-checked" v-if="item.checked">
              <img src="../../../assets/images/promotion/anniversary-celebration/icon-checked.png" />
            </div>
            <div class="item-day">Day {{ index + 1 }}</div>
            <div class="item-img">
              <img :src="require(`../../../assets/images/promotion/anniversary-celebration/prize-0${index + 1}.png`)" />
            </div>
            <div class="item-free">Free {{ item.freeAmount }}rs</div>
          </div>
        </template>
      </div>

      <div class="q-mt-md">
        <div :class="`btn-submit`" @click="receiveCheckinReward">
          <q-spinner v-if="isLoadingInitPay || btnLoading" color="white" size="2em" :thickness="2"></q-spinner>
          <template v-else>Receive</template>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="not-available">
        <div>
          <img src="../../../assets/images/promotion/anniversary-celebration/img-sorry.png" />
        </div>

        <p class="font-gold">
          We regret to inform you that you did not meet the eligibility criteria for this event. Please stay tuned for
          our next event
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";

const $q = useQuasar();
const isLoading = ref(false);
const store = userStore();

const receiveCheckinReward = () => {
  isLoading.value = true;

  eventapi
    .put(`/bonus/claim/indwin2-check-in`)
    .then((res) => {
      const resp = res.data;

      $q.notify({
        type: "positive",
        position: "top",
        message: `Checked in successfully`,
        icon: "check_circle_outline"
      });

      initCheckIn();
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const dailyRewards = ref([]);
const rewardEligibility = ref(false);

const initCheckIn = () => {
  eventapi.get(`/check-in/init`).then((res) => {
    rewardEligibility.value = res.data.eligibility;
    dailyRewards.value = [
      { freeAmount: 88, checked: false },
      { freeAmount: 188, checked: false },
      { freeAmount: 288, checked: false },
      { freeAmount: 388, checked: false },
      { freeAmount: 460, checked: false },
      { freeAmount: 588, checked: false },
      { freeAmount: 888, checked: false }
    ];

    for (let i = 0; i < res.data.claimedDays; i++) {
      dailyRewards.value[i].checked = true;
    }

    store.getBalance();
  });
};

onMounted(() => {
  initCheckIn();
});
</script>

<style lang="scss" scoped>
.font-bold {
  font-weight: bold;
}

.font-gold {
  font-weight: bold;
  color: #ffba35;
}

.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  height: 46px;
  transition: 0.3s all;
  color: #ffffff;
  margin: auto;
  border-radius: 6px;
  background: radial-gradient(68.92% 68.92% at 50% 50%, #00550e 0%, #57cd69 100%);
  width: 100%;
  max-width: 120px;
  aspect-ratio: 335/46;

  &:before {
    box-shadow: none;
  }

  &.disabled {
    opacity: 0.7;
  }
}

.prize-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 10px;
  .content-item {
    background: linear-gradient(325.86deg, #0e1e08 5.38%, #1b6026 98.11%);
    padding: 12px;
    box-shadow: 0px 0px 20px 0px #b479ff40 inset;
    border-radius: 8px;
    border: 1px solid #55c253;
    position: relative;

    &.full-wide {
      grid-column: span 3;
      display: flex;
      align-items: center;

      .item-img {
        img {
          max-width: 110px;
          margin-left: 20px;
          margin-bottom: -10px;
        }
      }

      .item-free {
        margin: auto;
      }
    }

    .item-checked {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      img {
        display: block;
        width: 20px;
      }
    }

    .item-day {
      font-size: 9px;
      width: 26px;
      padding-left: 3px;
      padding-right: 3px;
      padding-bottom: 3px;
      background: #acffaf;
      font-weight: bold;
      color: #14461f;
      text-align: center;
      position: absolute;
      top: 0;
      right: 8px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .item-img {
      display: flex;
      justify-content: center;
      img {
        display: block;
        width: 100%;
        max-width: 80px;
      }
    }

    .item-free {
      text-align: center;
    }
  }
}

.not-available {
  img {
    display: block;
    width: 100%;
    max-width: 200px;
    margin: auto;
  }
}
</style>

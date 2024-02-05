<template>
  <div>
    <div class="dailylogin">
      <div class="dailylogin-title">
        <div><img src="../../../assets/images/promo/hotpromo/dailylogin/cal.png" /></div>
        <div>本月签到明细</div>
      </div>
      <div class="months">
        <div
          @click="mth.isCheckedIn = true"
          v-for="(mth, index) in dateDetails"
          :key="index"
          class="mth"
          :class="{ 'check-in': mth.checkInActive, 'checked-in': mth.isCheckedIn }"
        >
          <div class="day">
            {{ index + 1 }}
            <span class="times">次</span>
          </div>
          <div class="number">+{{ mth.number }}</div>
        </div>
      </div>
    </div>

    <div class="q-mt-lg q-mb-md">
      <img src="../../../assets/images/promo/hotpromo/lottery/title-content.png" />
    </div>

    <div>
      <p>
        活动时间:北京时间2020年01月01日00:00:00开始
        <br />
        活动内容:此活动适用于所有雷火电克网站会员，在活动开始后，会员仅需当日累计存款达到1.000元即可完成签到，并当日领取相对应的奖金;签到越多，奖金越多
      </p>
    </div>

    <div class="dailylogin daily-details">
      <div class="dailylogin-title">
        <div>本月签到明细</div>
      </div>
      <div class="months">
        <div
          v-for="(mth, index) in dateDetails"
          :key="index"
          class="mth"
          :class="{ 'check-in': mth.checkInActive, 'checked-in': mth.isCheckedIn }"
        >
          <div class="day">
            1
            <span class="times">次</span>
          </div>
          <div class="number">{{ mth.number }}元</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const dateDetails = ref([]);
const init = () => {
  dateDetails.value = [
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: true
    },
    {
      number: 7,
      checkInActive: true,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    },
    {
      number: 7,
      checkInActive: false,
      isCheckedIn: false
    }
  ];
};
onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped>
.dailylogin {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

  box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 12px;

  &.daily-details {
    background: #e7f3ff;

    .dailylogin-title {
      color: #3981ff;
    }

    .mth {
      background: transparent !important;

      .number {
        color: #1c1c25 !important;
        font-size: 14px !important;
        font-weight: bold;
      }
    }

    .months {
      padding: 0 0 20px;
      .mth {
        border: 1px solid #ecedf0;

        border-bottom: 0;
        border-left: 0;
      }
    }
  }

  .dailylogin-title {
    color: #ffffff;
    font-size: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px;

    img {
      display: block;
      width: 30px !important;
    }
  }
  .months {
    background: #ffffff;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0px 5px 20px;
    border-radius: 12px;
    overflow: hidden;
    background: radial-gradient(#ffffff 0%, #ffffff 100%);
    .mth {
      padding: 4px;

      &.check-in {
        cursor: pointer;
        background: url(../../../assets/images/promo/hotpromo/dailylogin/sign.png) no-repeat center center;
        background-size: 100% 100%;
      }
      &.checked-in {
        cursor: pointer;
        // background: url(../../../assets/images/promo/hotpromo/dailylogin/signed.png) no-repeat center center;
        background: transparent;
        opacity: 0.6;
        background-size: 100% 100%;
        .number {
          color: #434343;
        }
      }
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #4c4c6c;
      height: 80px;
      .day {
        font-size: 12px;

        .times {
          font-size: 9px;
        }
      }
      .number {
        color: #2095ff;
        font-size: 9px;
      }
    }
  }
}
</style>

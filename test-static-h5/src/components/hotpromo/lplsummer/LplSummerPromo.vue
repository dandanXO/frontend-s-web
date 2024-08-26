<template>
  <div class="flex justify-center q-my-md">
    <q-btn class="claim-btn" label="立即申请" @click="handleClaim('lh1-lpl-game')" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { eventapi } from "src/boot/axios";
import { useNotify } from "src/hooks/notify";

const notify = useNotify();
const $q = useQuasar();
const store = userStore();
var qs = require("qs");

const activeKey = ref("betting-bonus");

const handleClaim = (applyPromoCode) => {
  eventapi.post("/promo-application/apply", qs.stringify({ promoCode: applyPromoCode })).then((res) => {
    if (res.code === 0) {
      notify({
        type: "success",
        message: "申请成功！",
      });
    } else {
      notify({
        type: "error",
        message: "申请失败",
      });
    }
  });
};
</script>

<style scoped lang="scss">
.promo-4 {
  padding: 5px;

  .tabs {
    .q-tabs {
      height: 54px;
      text-align: center;
      background: #f3f4f6;
      margin: 0;
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      border-radius: 8px;
      border: 1px solid #2f7cf7;
    }

    .q-tab {
      flex: 1;
      color: #87898a;
      border-radius: 0;

      span {
        display: block;
        line-height: 1;
        font-size: 18px;
        font-weight: 500;
        color: #374151;
      }

      &--active {
        // background: #6ad8ff;
        background-color: transparent;
        // background-image: url("../../../assets/images/promo/hotpromo/asiacup2024/active-tab.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        background: linear-gradient(180deg, #2ca1fe 0%, #2f7cf7 100%);
        border-radius: 8px;
        color: #ffffff;

        span {
          color: #ffffff;
          font-weight: 700;
        }
      }
    }

    .tab1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      color: #3f3f3f;
      background: white;
      padding: 14px 0px;

      .left-container {
        img {
          max-width: 150px;
        }
      }

      .right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 320px;
        margin-bottom: 30px;

        .desc {
          width: 90%;
          color: #87898a;
          line-height: 1.75em;
          font-size: 14px;
          text-align: center;
        }

        .desc-title {
          width: 90%;
          color: #2f7cf7;
          font-weight: 600;
          font-size: 40px;
          line-height: 1;
          margin-bottom: 30px;
          text-align: center;
          font-family: YouSheBiaoTiHei;
        }

        form {
          margin: 6px 0;

          :deep(.q-field__native) {
            font-size: 16px;
            height: 48px;
            text-align: center;
            background-color: #f4f7f8;
            border-radius: 6px;
            border: 1px solid #87898a;
            color: #87898a;
          }
        }
      }
    }

    .tab2,
    .tab3 {
      .firstrow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        padding: 20px;
        flex-wrap: wrap;
        gap: 20px;

        .date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: #87898a;

          :deep(.q-field__append) {
            padding: 0;
          }

          :deep(.q-field__native) {
            width: 100px;
            padding: 0;
          }

          :deep(.q-field__control),
          :deep(.q-field__marginal) {
            height: 30px;
          }
        }

        :deep(.q-toggle__label) {
          color: #87898a;
        }

        .retrieve-btn {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          width: 75px;
          background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
          border-radius: 30px;
          font-weight: 600;
          margin-left: auto;
        }
      }

      :deep(.q-table th) {
        background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039);
        color: white;
      }

      :deep(.q-table td) {
        text-wrap: wrap;
      }

      :deep(.q-table__bottom--nodata) {
        margin: 0 auto;
      }
    }

    .common-btn {
      color: white;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
      width: 175px;
      background-image: linear-gradient(-41deg, #0094ff 0, #19c6ff 100%), linear-gradient(#10111a, #10111a);
      border-radius: 30px;
      font-weight: 600;
      opacity: 0.8;
    }
  }
}

.img-liner {
  margin-bottom: 20px;

  img {
    display: block;
    width: 100%;
  }
}

.text-center {
  text-align: center;
}

.container-hint {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-wrapper {
  text-align: center;
  // background-image: url("../../../assets/images/promo/hotpromo/asiacup2024/active-tab.png");
  background: linear-gradient(180deg, #2ca1fe 0%, #2f7cf7 100%);
  padding: 15px 5px 5px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 168px;
  aspect-ratio: 168/54;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 16px;

  .hint-title {
    font-size: 18px;
    color: #fff;
  }
}

.click-btn {
  transition: 0.3s all;
  &:hover {
    filter: brightness(1.5);
  }
}

.claim-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #2ca1fe 0%, #c481fe 100%);
  color: #ffffff;
  width: 180px;
  font-weight: 700;
  font-size: 16px;
  height: 40px;
}

table.promo-table th {
  background: linear-gradient(0deg, #0094ff 0, #19c6ff 100%), linear-gradient(#2e3039, #2e3039) !important;
  color: white !important;
}
</style>

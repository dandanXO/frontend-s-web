<template>
  <div class="eurocup-hongbaoyu-container">
    <div class="receive-container" v-if="!promoNotReady && !bonusOpened">
      <div @click="getPromotion" class="hongbao-open">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claimbg-new.png`)" />
      </div>
    </div>
  </div>

  <el-dialog
    class="award-modal hongbaoyu-modal"
    :close-on-click-modal="false"
    :modal="true"
    custom-class="hongbaoyu-dialog"
    v-model="privilegeClaimedModalVisible"
    align-center
  >
    <div class="modal-div">
      <div class="red-packet-opened">
        <img :src="require(`../../../assets/images/promotion/hotpromo/hongbaoyu/claim-bg.png`)" />
        <div class="amount">{{ winAmount }} 元</div>
        <div class="get-btn" @click="getPromotionPrize">我知道了</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { claimDailyRainItem, getDailyRainListing } from "@/api/index/promo";
import { userStore } from "@/store";
import { useNotify } from "@/hooks/notify";
import { ElMessageBox } from "element-plus";

const props = defineProps({
  promoCode: {
    type: String,
    required: true
  },
  pageContent: {
    type: String,
    required: true
  },
  promoParam: {
    type: String,
    required: true
  }
});

const notify = useNotify();

const promoCode = ref(props.promoCode);
const promoContent = ref(props.pageContent);
const promoParam = ref(props.promoParam);

const getDateRange = (param) => {
  try {
    const promoObject = JSON.parse(param);
    const dateTimeRange = promoObject["datetime"].trim(); // Trim the property name
    return dateTimeRange;
  } catch (error) {
    console.error("Error parsing promoParam:", error);
    return "";
  }
};

const store = userStore();
const privilegeClaimedModalVisible = ref(false);
const promoNotReady = ref(false);
const bonusOpened = ref(false);
const winAmount = ref(0);
const loadingClaim = ref(false);
const getPromotion = () => {
  if (!store.hasToken()) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large",
      closeOnClickModal: true
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  }

  if (loadingClaim.value) return;
  loadingClaim.value = true;
  claimDailyRainItem(promoCode.value)
    .then((res) => {
      loadingClaim.value = false;
      if (res.code === 0) {
        winAmount.value = res.data.lastDigitAmount + res.data.vipAmount;

        privilegeClaimedModalVisible.value = true;
        store.getBalance();

        // bonusOpened.value = true;
      } else {
        bonusOpened.value = false;
        notify.error(res.message);
      }
    })
    .catch((err) => {
      loadingClaim.value = false;
      console.log(err.message);
      bonusOpened.value = false;
    });
};

const getPromotionPrize = () => {
  store.getBalance();
  privilegeClaimedModalVisible.value = false;
  bonusOpened.value = false;
};

const promotionListing = ref();
const visibleItems = ref([]);
const maxVisibleItems = ref(5);
const intervalId = ref(null);

const getPromotionListing = () => {
  getDailyRainListing(promoCode.value)
    .then((res) => {
      if (res.code === 0) {
        promotionListing.value = res.data;
        visibleItems.value = promotionListing.value.slice(0, maxVisibleItems.value);
        setTimeout(() => {
          const addItem = () => {
            if (visibleItems.value.length < promotionListing.value.length) {
              const nextItemIndex = promotionListing.value.length - visibleItems.value.length - 1;
              visibleItems.value.unshift(promotionListing.value[nextItemIndex]);

              setTimeout(addItem, 1500);
            } else {
              clearInterval(intervalId.value);
            }
          };
          addItem();
        }, 4000);
      }
    })
    .catch((err) => {
      console.log(err.message);

      /** draft data **/
      // visibleItems.value = [
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   },
      //   {
      //     date: "2024-05-12 15:43",
      //     name: "1911****8888",
      //     amount: "888 元"
      //   }
      // ];
    });
};

onMounted(() => {
  if (!store.token) {
    return;
  }
  getPromotionListing();
});
</script>

<style scoped lang="scss">
.eurocup-hongbaoyu-container {
  //background-color: #e2e6f1;
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;

  img.banner-img {
    display: block;
    width: 100%;
  }

  .hongbao-subtitle {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    img {
      display: block;
      width: 100%;
      max-width: 800px;
    }
  }

  .receive-container {
    position: relative;
    margin-top: 0px;
    margin-bottom: 0px;

    .hongbao-open {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 240px;
      margin-left: 0px;

      img {
        width: 100%;
      }

      &:hover {
        filter: brightness(0.9);
      }
      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }
    }
  }

  .winner-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0 0 25px 0;

      span {
        margin-top: 12px;
        position: absolute;
        z-index: 1;
        font-size: 1.75rem;
        font-weight: 500;
        color: #ffffff;
      }
    }

    img {
      z-index: 1;
    }

    .winner-wrapper {
      position: relative;
      padding: 60px 20px 20px;
      background-color: #f2f8fe;
      border-radius: 8px;
      margin-bottom: 80px;
      margin-top: -60px;
      min-height: 250px;
      width: 100%;
      max-width: 1240px;
      border: 1px solid #51acff;

      .contents {
        max-height: 280px;
        overflow-y: hidden;
        scroll-behavior: smooth;
        .winner {
          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #7a8eb9;
          padding: 15px;
          gap: 20px;

          &:nth-child(odd) {
            background-color: #ffffff;
          }
        }

        .amount-txt {
          color: #fcc939;
        }
      }
    }
  }

  .content-container {
    width: 100%;
    position: relative;
    background-color: #f2f8fe;
    width: 100%;
    max-width: 1280px;
    margin: auto;
    padding-bottom: 40px;
    margin-bottom: 40px;
    border-radius: 8px;
    border: 1px solid #acd4f6;

    .contents {
      margin-top: 25px;
      padding: 0 40px;

      .rules-content {
        p {
          font-size: 1rem;
        }
      }

      .event-details {
        padding: 10px 0px 0;

        .details-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;

          .event-frame {
            background-image: url("../../../assets/images/promotion/hotpromo/hongbaoyu/eurocup/event-frame.png");
            background-size: 100% 100%;
            background-position: center center;
            background-repeat: no-repeat;
            padding: 6px 24px;

            color: #ffffff;
            font-weight: 600;
            font-size: 1rem;
          }

          .event-txt {
            font-size: 1.25rem;
            color: #000000;

            .color-red {
              color: #f41f1c;
            }
          }
        }

        .details-table {
          width: 100%;
          border-radius: 8px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #acd4f6;

          thead {
            background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
            color: #ffffff;
            font-weight: 600;
          }

          tbody {
            tr:nth-child(odd) {
              background-color: #ffffff;
            }
          }

          td {
            padding: 16px 24px;
            text-align: center;
          }
        }
      }

      .bullet-wrapper {
        display: flex;
        align-items: center;

        span {
          color: #fcd6a3;
          font-weight: 400;
        }
      }
    }
  }

  .check-tip,
  .money-account,
  .receive-btn {
    position: absolute;
  }

  .check-tip {
    color: #ccc;
    background-color: grey;
    min-height: 1rem;
    border-radius: 30px;
    border: none;
    white-space: normal;
    padding: 5px 15px;
    text-align: center;
    left: 0;
    right: 0;
    bottom: 0px;
    margin: auto;
    width: 90px;
  }

  .money-account {
    left: 0;
    right: 0;
    top: 20px;
    margin: auto;
    text-align: center;
    font-size: 1.5rem;

    span {
      font-size: 2.5rem;
    }
  }

  .receive-btn {
    text-align: center;
    line-height: 0.83rem;
    color: #fff;
    padding: 0;
    margin: 0.3rem auto 0;
    width: 180px;
    left: 0;
    right: 0;
    bottom: -15px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }
}

.modal-div {
  width: 100%;
}

.red-packet-opened {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 500px;
    padding-right: 30px;
  }

  .grats {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 200px;
    margin-top: 0px;
    z-index: 22;
    text-align: center;
    color: #fffbfb;
    text-align: center;
    font-family: PingFang SC;
    font-size: 36px;
    font-style: normal;
    padding-left: 10px;
    font-weight: 600;
    line-height: normal;
  }

  .amount {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    margin-top: 206px;
    left: 10px;
    // left: -15px;
    color: #e8280c;
    font-size: 40px;
    font-weight: bold;
  }

  .bonus {
  }
}
.get-btn {
  color: #ffefc2;
  border-radius: 30px;
  background: #ff1300;
  position: absolute;
  border: 1px solid #fde583;
  margin-top: 350px;
  //left: 0%;
  margin-left: -40px;
  width: 150px;
  text-align: center;
  font-size: 20px;
  padding: 12px 24px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
}
::v-global(.hongbaoyu-dialog .el-dialog__body) {
  box-shadow: unset;
}
::v-global(.hongbaoyu-dialog .el-dialog__header) {
  border-bottom: 0 !important;
}
</style>

<style lang="scss"></style>

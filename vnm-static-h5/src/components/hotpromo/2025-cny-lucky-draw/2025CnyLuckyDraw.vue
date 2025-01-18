s
<template>
  <div class="bonus-wrapper">
    <img src="@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bonus-bg.jpeg" class="bg-image" />
    <div class="bg-title">
      <div class="egg-available-draw">
        Tổng số lần đập trứng vàng:
        <span style="font-weight: 700">{{ availableDraw }}</span>
        lần
      </div>
    </div>
    <img
      src="@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bonus-egg2.png"
      class="bg-egg"
      @click="handleClaimClick"
    />
    <div @click="handleClaimClick" class="egg-button">Đập trứng vàng</div>
  </div>
  <div class="new-player-wrapper">
    <div style="display: flex; justify-content: center; align-items: center; gap: 12px">
      <img class="title" style="width: 17%" src="@/assets/images/promo/hotpromo/2025-cny-lucky-draw/title1.png" />
      <img class="title" style="width: 66%" src="@/assets/images/promo/hotpromo/2025-cny-lucky-draw/title2.png" />
      <img class="title" style="width: 17%" src="@/assets/images/promo/hotpromo/2025-cny-lucky-draw/title3.png" />
    </div>

    <div class="rule-block">
      <div class="rule-block-rule">
        <div class="rule-block-rule__title">Thời gian</div>
        <span class="rule-block-rule__description" style="line-height: 20px">00:00 20/01/2025-23:59 02/02/2025</span>
      </div>
      <div class="rule-block-rule">
        <div class="rule-block-rule__title">Áp dụng</div>
        <span class="rule-block-rule__description">Thành Viên từ cấp VIP 1 trở lên</span>
      </div>
      <div class="rule-block-rule">
        <div class="rule-block-rule__title">Sản phẩm</div>
        <span class="rule-block-rule__description">Tất cả sản phẩm tại TF88</span>
      </div>
      <div class="rule-block-rule" style="flex-direction: column; align-items: flex-start">
        <!--        <div class="rule-block-rule__title">Sản phẩm</div>-->
        <span class="rule-block-rule__description">
          Trong thời gian khuyến mãi, Thành viên đạt đủ doanh thu cược theo yêu cầu sẽ có cơ hội tham gia đập trứng vàng
          để nhận thưởng hấp dẫn, bao gồm tiền mặt ngẫu nhiên từ 18 VNDP đến 888 VNDP và giải thưởng cao nhất là 1 lượng
          vàng SJC 999.9 cùng nhiều phần quà khác.
        </span>
      </div>
      <div class="promo-view-container">
        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                Tổng tiền cược hợp lệ
              </td>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                Lượt đập trứng
              </td>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                Số lần đập tối đa nhận được mỗi ngày
              </td>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                Thời gian hiệu lực của cơ hội đập trứng vàng
              </td>
            </tr>
            <tr>
              <td>5,000 VNDP</td>
              <td>1</td>
              <td rowspan="3">3 lượt</td>
              <td>3 ngày</td>
            </tr>
            <tr>
              <td>10,000 VNDP</td>
              <td>1</td>
              <td>3 ngày</td>
            </tr>
            <tr>
              <td>15,000 VNDP</td>
              <td>1</td>
              <td>3 ngày</td>
            </tr>
          </tbody>
        </table>
        <div class="hint">
          *Khi tổng số tiền cược hợp lệ của Thành Viên trong ngày là 15,000 VNDP, sẽ nhận được ba cơ hội đập trứng vàng.
        </div>
      </div>
    </div>

    <div class="mission-block">
      <h3 class="mission-block-title">Cách thức tham gia:</h3>
      <p style="margin: 0">
        1. Thành Viên tham gia đặt cược và tích luỹ đủ số tiền cược hợp lệ tương ứng để nhận cơ hội đập trứng vàng.
        <br />
        2. Lượt đập trứng sẽ được cập nhật vào ngày hôm sau, Thành Viên cần đăng nhập vào tài khoản, truy cập trang
        khuyến mãi và bấm đập trứng để nhận thưởng.
      </p>
      <h3 class="mission-block-title">Giải thưởng bao gồm:</h3>
      <div class="mission-block-mission-wrapper promo-view-container">
        <table>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                STT
              </td>
              <td
                style="
                  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
                  color: white;
                "
              >
                Giải thưởng
              </td>
            </tr>
            <tr>
              <td>1</td>
              <td>1 Lượng Vàng SJC 999.9</td>
            </tr>
            <tr>
              <td>2</td>
              <td>iPhone 16 Pro Max 256 GB</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Apple Watch Series 10 42mm (GPS) Viền nhôm</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Loa Bluetooth JBL PartyBox 110</td>
            </tr>
            <tr>
              <td>5</td>
              <td>1 Chỉ Vàng SJC 999.9</td>
            </tr>
            <tr>
              <td>6</td>
              <td>888 VNDP</td>
            </tr>
            <tr>
              <td>7</td>
              <td>88 VNDP</td>
            </tr>
            <tr>
              <td>8</td>
              <td>38 VNDP</td>
            </tr>
            <tr>
              <td>9</td>
              <td>28 VNDP</td>
            </tr>
            <tr>
              <td>10</td>
              <td>18 VNDP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="mission-block-title">Giải thưởng bao gồm:</h3>
      <p style="margin: 0">
        1. Lượt đập trứng vàng sẽ có hiệu lực 3 ngày kể từ khi cập nhật vào tài khoản. Lượt chưa sử dụng sẽ tự động hết
        hạn khi quá thời gian.
        <br />
        2. Tiền thưởng nhận được cần hoàn thành 5 vòng cược trước khi thực hiện rút tiền.
        <br />
        3. Tất cả cược HÒA, cược HỦY, cược 2 BÊN, vé cược đặt tại tỷ lệ cược: DEC &lt; 1.75, MY -0.6 đến 0.75, Thể thao
        ảo, Đua ngựa, Number Game sẽ không được áp dụng cho chương trình này.
        <br />
        4. Các tài khoản có cùng IP hoặc thông tin dữ liệu tương tự sẽ không được tham gia chương trình khuyến mãi này.
        <br />
        5. Chương trình không thể kết hợp cùng các khuyến mãi nạp khác tại TF88.
        <br />
        6. TF88 có quyền chỉnh sửa, từ chối hoặc hủy bỏ chương trình Khuyến mãi này bất cứ thời gian nào mà không cần
        báo trước.
        <br />
        7. Điều khoản & Điều kiện khuyến mãi chung được áp dụng.
      </p>
    </div>
  </div>
  <q-dialog v-model="bonusModalVisible" persistent>
    <div class="dialog_continaer">
      <div class="dialog_inner">
        <!-- <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup /> -->
        <img class="bound-bg-top" :src="boundBgTop" />
        <div class="bound-bg-mid">
          <div>Chúc mừng bạn nhận được</div>
        </div>
        <img class="bound-image" :src="bonusImage[bonus]" />
        <!-- <img class="bound-image" :src="bonusImage[18]" /> -->
        <div class="bound-cycle-light"></div>
        <div class="bound-text">
          <div>
            {{ bonusText[bonus] }}
            <!-- {{bonusText[18]}} -->
          </div>
        </div>
        <div class="bound-close" @click="bonusModalVisible = false">
          <div>Nhận Ngay</div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { drawEventInit, claimDrawEvent } from "@/api/promo/drawEvent";
import { userStore } from "src/stores";

const { t } = useI18n();
const props = defineProps(["promoCode"]);

const bonusModalVisible = ref(false);

const validBet = ref(0);
const minValidBet = ref(0);
const availableDraw = ref(0);
const usedDraw = ref(0);
const totalDraw = ref(0);
const store = userStore();
const bonus = ref(0);
const bonusName = ref("");

const boundBgTop = require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-bg-top.png");

const bonusImage = {
  18: require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound18.png"),
  28: require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound28.png"),
  38: require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound38.png"),
  88: require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound88.png"),
  888: require("@/assets/images/promo/hotpromo/2025-cny-lucky-draw/bound888.png")
};
const bonusText = {
  18: "18 VNDP",
  28: "28 VNDP",
  38: "38 VNDP",
  88: "88 VNDP",
  888: "888 VNDP"
};

const handleClaimClick = () => {
  claimDrawEvent(props.promoCode).then((res) => {
    if (res.code === 0) {
      bonusModalVisible.value = true;
      bonus.value = res.data[0].bonus;
      bonusName.value = res.data[0].bonusName;

      initGoldenEgg();
      store.getBalance();
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message
      });
    }
  });
};

const initGoldenEgg = () => {
  drawEventInit(props.promoCode).then((res) => {
    if (res.code === 0) {
      const { data } = res;
      validBet.value = data.validBet;
      minValidBet.value = data.minValidBet;
      availableDraw.value = data.availableDraw;
      usedDraw.value = data.usedDraw;
      totalDraw.value = data.totalDraw;
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message
      });
    }
  });
};

onMounted(() => {
  initGoldenEgg();
});
</script>
<style lang="scss" scoped>
.dialog_continaer {
  height: 520px;
  width: 95%;
  position: relative;
  transform: scale(0.85);

  @media (max-width: 400px) {
    height: 430px;
  }
}
.dialog_inner {
  background-image: url(../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 260px;
  width: 100%;
  bottom: 0px;
  position: absolute;
  aspect-ratio: 560/529;

  .bound-bg-top {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -19%;
    width: 100%;
  }
  .bound-bg-mid {
    background-image: url(../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-bg-close-btn.png);
    position: absolute;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    left: 50%;
    transform: translateX(-50%);
    top: 9%;
    aspect-ratio: 392/62;
    width: 75%;
    // height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: #fff;
    z-index: 10;

    div {
      white-space: nowrap;
      text-transform: capitalize;
    }
  }
  .bound-image {
    z-index: 2;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 19%;
    width: 160px;
    height: 160px;
  }
  .bound-text {
    background-image: url(../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-money-bg.png);
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 66%;
    width: 80%;
    height: 34px;
    z-index: 20;
    display: flex;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: rgba(248, 47, 6, 1);
  }
  .bound-cycle-light {
    z-index: 1;
    background-image: url(../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-cycle-light.png);
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 30%;
    width: 160px;
    font-weight: bold;
    height: 160px;
  }
  .bound-close {
    background-image: url(../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bound-bg-mid.png);
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 80%;
    width: 50%;
    min-height: 50px;
    aspect-ratio: 230/72;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    color: #fff;

    div {
      margin-bottom: 6px;
    }
  }
}
.new-player-wrapper {
  display: flex;
  flex-direction: column;
  gap: 26px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 30px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  background: url("../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bg-top.png") top no-repeat,
    url("../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bg-content.png") center no-repeat,
    url("../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/bg-bottom.png") bottom no-repeat;
  background-size: 100%, 100% 90%, 100%;

  .title {
    max-width: 741px;
    margin: 0 auto;
  }

  .detail-wrapper {
    background-color: #fff;
    border: 1px solid #acd4f6;
    padding: 20px;
    border-radius: 12px;

    .detail-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
      line-height: 40px;
      color: #0080ff;
    }
  }

  .rule-block {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .rule-block-rule {
      display: flex;
      align-items: center;
      gap: 8px;

      .rule-block-rule__title {
        width: 85px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        padding: 3px 0;
        clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        line-height: 23.33px;
        color: #fff;
      }

      .rule-block-rule__description {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    }

    .detail-description {
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
    }

    .hint {
      font-size: 12px;
      color: #ff0000;
    }
  }

  .mission-block {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .mission-block-title {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      line-height: 29.05px;
    }

    .mission-block-mission-wrapper {
      position: relative;

      .mission-block-mission__bg {
        position: absolute;
        transform: translateY(-100%);
        top: 30px;
        right: 13px;
        z-index: 0;
      }

      .mission-block-mission {
        position: relative;
        background-color: #fff;
        border: 1px solid #acd4f6;
        padding: 12px 20px;
        border-radius: 12px;
        margin-bottom: 12px;

        .mission-block-mission-upside-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid #0000001a;

          .mission-block-mission-upside-title {
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
          }

          .mission-block-mission-upside-reward-wrapper {
            display: flex;
            align-items: center;
            gap: 6px;

            .mission-block-mission-upside-reward-amount {
              font-size: 24px;
              font-weight: 600;
              line-height: 18px;
              color: #ff8e15;
            }
          }
        }

        .mission-block-mission-downside-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .mission-block-mission-downside-description-outer-wrapper {
            display: flex;
            gap: 12px;
            align-items: center;

            .mission-block-mission-downside-description-inner-wrapper {
              display: flex;
              flex-direction: column;

              .mission-block-mission-downside-description {
                font-size: 14px;
                font-weight: 400;
                line-height: 21.78px;
              }

              .mission-block-mission-downside-description-progress {
                background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
                background-clip: text;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                color: transparent;
              }
            }
          }

          .mission-block-mission-btn {
            background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
            min-width: 128px;
            width: max-content;
            padding: 11px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            line-height: 18px;
            text-align: center;
            color: #fff;

            &:not([disabled]) {
              &:hover {
                background: linear-gradient(180deg, #41b9ff 8.15%, #0085e8 92.42%);
              }
            }

            &[disabled] {
              background: #d9d9d9;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .term-block {
    .detail-description {
      ol {
        padding: 0;
        counter-reset: list-counter;

        li {
          display: flex;
          align-items: baseline;
          counter-increment: list-counter;
          margin-bottom: 4px;
          list-style-type: none;
          font-size: 12px;
          font-weight: 400;
          line-height: 32px;

          &::before {
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            content: counter(list-counter);
            width: 24px;
            height: 24px;
            margin-right: 10px;
            background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
            border-radius: 50%;
            font-size: 12px;
            font-weight: 700;
            line-height: 24px;
            color: white;
          }
        }
      }
    }
  }
}

.bonus-wrapper {
  width: 100%;
  min-height: 255px;
  aspect-ratio: 702/550;
  margin: 0 auto 20px;
  position: relative;

  .egg-available-draw {
    font-size: 17px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    span {
      padding: 0px 6px;
    }
  }
  .bg-image {
    width: 100%;
    height: 100%;
    margin: 0 auto 20px;
    position: relative;
    .bg-image {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .popout-close {
    position: absolute;
    top: 0;
    left: 0;
  }

  .bg-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    width: 80%;
    aspect-ratio: 488/88;
    min-height: 20px;
    background-image: url("../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/title-img.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    color: #fff;

    .egg-available-draw {
      white-space: nowrap;
    }
  }

  .bg-egg {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 26%;
    cursor: pointer;

    &:active {
      filter: brightness(0.8);
      top: 27%;
    }
  }
  .egg-button {
    position: absolute;
    background-image: url("../../../assets/images/promo/hotpromo/2025-cny-lucky-draw/btn-btn.png");
    background-size: 100% auto;
    width: 160px;
    min-height: 50px;
    bottom: 12px;
    aspect-ratio: 360/117;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 21px;
    left: 50%;
    margin-left: -74px;
    text-transform: capitalize;
  }
}
.popout-close {
  position: absolute;
  right: 0px;
}
</style>

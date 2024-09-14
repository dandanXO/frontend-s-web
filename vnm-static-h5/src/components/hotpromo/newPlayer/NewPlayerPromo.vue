<template>
  <div class="new-player-wrapper">
    <img class="title" src="@/assets/images/promo/hotpromo/newPlayer/title.png" />

    <div class="rule-block">
      <div class="rule-block-rule">
        <div class="rule-block-rule__title">Thời gian</div>
        <span class="rule-block-rule__description">Chương trình khuyến mãi bắt đầu từ 00:00:00 ngày 16.08.2024</span>
      </div>
      <div class="rule-block-rule">
        <div class="rule-block-rule__title">Áp dụng</div>
        <span class="rule-block-rule__description">Tất cả thành viên mới tại TF88</span>
      </div>
      <div class="detail-wrapper">
        <h3 class="detail-title">
          <img class="detail-title__icon" src="@/assets/images/promo/hotpromo/newPlayer/arrow-right.svg" />
          Chi tiết khuyến mãi
        </h3>
        <span class="detail-description">
          Thành viên đăng ký tài khoản thành công và thực hiện các nhiệm vụ theo yêu cầu để nhận thưởng, chi tiết như
          sau:
        </span>
      </div>
    </div>

    <div class="mission-block">
      <h3 class="mission-block-title">
        <img class="detail-title__icon" src="@/assets/images/promo/hotpromo/newPlayer/gift.svg" />
        NHIỆM VỤ TÂN THỦ
      </h3>
      <div class="mission-block-mission-wrapper">
        <div v-for="(mission, index) in missions" class="mission-block-mission" :key="index">
          <div class="mission-block-mission-upside-wrapper">
            <span class="mission-block-mission-upside-title">Nhiệm vụ {{ index + 1 }}</span>
            <div class="mission-block-mission-upside-reward-wrapper">
              <img src="@/assets/images/promo/hotpromo/newPlayer/coin.svg" />
              <span class="mission-block-mission-upside-reward-amount">{{ mission.reward }} VNDP</span>
            </div>
          </div>
          <div class="mission-block-mission-downside-wrapper">
            <div class="mission-block-mission-downside-description-outer-wrapper">
              <img :src="mission.icon" />
              <div class="mission-block-mission-downside-description-inner-wrapper">
                <span class="mission-block-mission-downside-description">{{ mission.description }}</span>
              </div>
            </div>
          </div>
          <div class="mission-block-mission-third-block">
            <span class="mission-block-mission-third-block-description-progress">
              Tiến độ hoàn thành ({{ mission.missionProgress }})
            </span>
            <button
              class="mission-block-mission-btn"
              :disabled="mission.status !== 'Claim'"
              @click="handleClaimClick(mission, index)"
            >
              <span v-if="mission.status === 'Claimed'">Đã Nhận</span>
              <span v-else-if="mission.status === 'Incomplete'">Không Hợp Lệ</span>
              <span v-else>Nhận</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="term-block detail-wrapper">
      <h3 class="detail-title">
        <img class="detail-title__icon" src="@/assets/images/promo/hotpromo/newPlayer/arrow-right.svg" />
        Điều khoản và điều kiện
      </h3>
      <div class="detail-description">
        <ol>
          <li>Số tiền nạp có tham gia khuyến mãi nạp tiền sẽ không được tích lũy trong khuyến mãi này.</li>
          <li>
            Thành Viên cần hoàn thành nhiệm vụ để nhận thưởng trong vòng 30 ngày kể từ ngày đăng ký tài khoản , sau 30
            ngày khuyến mãi sẽ vô hiệu hóa.
          </li>
          <li>Thành viên vào trang khuyến mãi để bấm nhận thưởng</li>
          <li>Thành viên cần hoàn thành 5 vòng cược yêu cầu trước khi thực hiện rút tiền.</li>
          <li>
            Với các Thành Viên chưa tham gia nạp tiền , để rút tiền khuyến mãi Thành Viên cần nạp bằng với số tiền yêu
            cầu rút.
          </li>
          <li>
            Tất cả cược HÒA, cược HỦY, cược 2 BÊN, vé cược đặt tại tỷ lệ cược: DEC &lt; 1.75, MY -0.6 đến 0.75, Thể thao
            ảo, Đua ngựa, Number Game sẽ không được áp dụng cho chương trình này. Các tài khoản có cùng IP hoặc thông
            tin dữ liệu tương tự sẽ không được tham gia chương trình khuyến mãi này
          </li>
          <li>Chương trình không thể kết hợp cùng các khuyến mãi nạp khác tại TF88.</li>
          <li>
            TF88 có quyền chỉnh sửa, từ chối hoặc hủy bỏ chương trình Khuyến mãi này bất cứ thời gian nào mà không cần
            báo trước.
          </li>
          <li>Điều khoản & Điều kiện khuyến mãi chung được áp dụng.</li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { getNewPlayerMission, submitNewPlayerMission } from "@/api/promo/newPlayer";

import AccountSvg from "@/assets/images/promo/hotpromo/newPlayer/account.svg";
import transferSvg from "@/assets/images/promo/hotpromo/newPlayer/transfer.svg";
import depositSvg from "@/assets/images/promo/hotpromo/newPlayer/deposit.svg";
import walletSvg from "@/assets/images/promo/hotpromo/newPlayer/wallet.svg";

const $q = useQuasar();
const { t } = useI18n();

const missions = ref([
  {
    code: "newbie-mission-t1",
    description: "Cập nhật thông tin tài khoản ngân hàng, xác nhận số điện thoại.",
    reward: 8,
    icon: AccountSvg,
    missionProgress: "0/0",
    status: "Incomplete"
  },
  {
    code: "newbie-mission-t2",
    description: "Thực hiện rút tiền thành công 1 lần.",
    reward: 28,
    icon: transferSvg,
    missionProgress: "0/0",
    status: "Incomplete"
  },
  {
    code: "newbie-mission-t3",
    description: "Tích lũy tổng nạp tiền 700 VNDP, có tổng cộng 20 vé cược hợp lệ tại Thể Thao hoặc Live casino.",
    reward: 38,
    icon: depositSvg,
    missionProgress: "0/0",
    status: "Incomplete"
  },
  {
    code: "newbie-mission-t4",
    description: "Tích lũy tổng nạp tiền 3,500 VNDP, tích lũy tổng tiền cược hợp lệ 7,000 VNDP.",
    reward: 188,
    icon: walletSvg,
    missionProgress: "0/0",
    status: "Incomplete"
  }
]);

const handleClaimClick = (mission, index) => {
  if (mission.status !== "Claim") return;
  submitNewPlayerMission(mission.code).then((res) => {
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: t("lang.new_player_successfully"),
        icon: "check_circle_outline"
      });
      missions.value[index].status = "Claimed";
    } else {
      $q.notify({
        color: "negative",
        position: "top",
        message: res.message,
        icon: "report_problem"
      });
    }
  });
};

onMounted(() => {
  getNewPlayerMission().then((res) => {
    if (res.code === 0) {
      const { data } = res;
      missions.value.forEach((mission, index) => {
        mission.missionProgress = data[`task${index + 1}`];
        mission.status = data[`available${index + 1}`];
        mission.reward = data[`task${index + 1}amount`];
      });
    }
  });
});
</script>
<style lang="scss" scoped>
.new-player-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px 40px;
  border-radius: 12px;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;

  .title {
    max-width: 741px;
    margin: 0 auto;
  }

  .detail-wrapper {
    background-color: #fff;
    border: 1px solid #acd4f6;
    padding: 12px;
    border-radius: 12px;
    .detail-title {
      display: flex;
      align-items: center;
      gap: 3px;
      margin: 0 0 4px;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.25rem;
      color: #0080ff;
      .detail-title__icon {
        width: unset;
      }
    }
  }

  .rule-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .rule-block-rule {
      display: flex;
      align-items: center;
      gap: 12px;
      .rule-block-rule__title {
        flex-shrink: 0;
        width: 80px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
        padding: 3px 0;
        clip-path: polygon(0 50%, 12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%);
        text-align: center;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        color: #fff;
      }
      .rule-block-rule__description {
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 1rem;
      }
    }
    .detail-description {
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1rem;
    }
  }

  .mission-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .mission-block-title {
      display: flex;
      align-items: center;
      margin-top: 0;
      margin-bottom: 12px;
      gap: 10px;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.25rem;
      .detail-title__icon {
        width: unset;
        margin-bottom: 0;
      }
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
        padding: 8px 12px;
        border-radius: 12px;
        margin-bottom: 12px;
        img {
          width: unset;
        }
        .mission-block-mission-upside-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          margin-bottom: 12px;
          border-bottom: 1px solid #0000001a;
          .mission-block-mission-upside-title {
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.125rem;
          }
          .mission-block-mission-upside-reward-wrapper {
            display: flex;
            align-items: center;
            gap: 6px;
            .mission-block-mission-upside-reward-amount {
              font-size: 0.875rem;
              font-weight: 600;
              line-height: 1.25rem;
              color: #ff8e15;
            }
          }
        }
        .mission-block-mission-downside-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 8px;
          border-bottom: 1px solid #0000001a;
          .mission-block-mission-downside-description-outer-wrapper {
            display: flex;
            gap: 12px;
            align-items: center;
            .mission-block-mission-downside-description-inner-wrapper {
              display: flex;
              flex-direction: column;
              .mission-block-mission-downside-description {
                font-size: 0.75rem;
                font-weight: 400;
                line-height: 1rem;
              }
            }
          }
        }
        .mission-block-mission-third-block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .mission-block-mission-third-block-description-progress {
            background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
            background-clip: text;
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1.125rem;
            color: transparent;
          }
          .mission-block-mission-btn {
            background: linear-gradient(90deg, #41b9ff 8.15%, #0085e8 92.42%);
            min-width: 76px;
            padding: 4px 12px;
            border: none;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1.125rem;
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
          margin-bottom: 4px !important;
          list-style-type: none;
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.125rem;
          &::before {
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            content: counter(list-counter);
            width: 16px;
            height: 16px;
            margin-right: 10px;
            background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
            border-radius: 50%;
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1.125rem;
            color: white;
          }
        }
      }
    }
  }
}
</style>

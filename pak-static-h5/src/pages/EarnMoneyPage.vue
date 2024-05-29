<template>
  <ProfileSummary :homeProfile="true" />

  <div class="earn-money-wrapper">
    <div class="earn-money-container">
      <div class="earn-money-title">Bonus Pot Arrived</div>
      <div class="earn-money-pots">
        <div class="pot-item">
          <div class="item-amount">RS 0.00</div>
          <div class="item-desc">My Total Income</div>
          <div class="item-img"><img src="../assets/images/earn-money/pot-item-01.png" /></div>
        </div>
        <div class="pot-item pot-item__2">
          <div class="item-amount">0</div>
          <div class="item-desc">My Total Number Of Invites</div>
          <div class="item-img"><img src="../assets/images/earn-money/pot-item-02.png" /></div>
        </div>
      </div>

      <div class="earn-money-details-grid">
        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Invite</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-01.png" /></div>
        </div>

        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Top Up</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-02.png" /></div>
        </div>

        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Bet</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-03.png" /></div>
        </div>

        <div class="details-item">
          <div class="item-amount">
            Rs
            <span>0</span>
          </div>
          <div class="item-title">Achievement</div>
          <div class="item-icon"><img src="../assets/images/earn-money/details-icon-04.png" /></div>
        </div>
      </div>

      <div class="earn-money-invite">
        <div class="invite-title">Invite friends via link</div>
        <div class="invite-desc">How to get invitation bonus</div>

        <div class="invite-listing">
          <div class="listing-item">
            <span class="list-num">1</span>
            Invite friends via invitation link
          </div>

          <div class="listing-item">
            <span class="list-num">2</span>
            Register via link
          </div>

          <div class="listing-item">
            <span class="list-num">3</span>
            Complete deposit after registration
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProfileSummary from "components/ProfileSummary.vue";
</script>

<style scoped lang="scss">
.earn-money-wrapper {
  padding: 20px;
  .earn-money-container {
    .earn-money-title {
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }

    .earn-money-pots {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 24px;

      .pot-item {
        background-image: url("../assets/images/earn-money/pot-bg-01.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        display: flex;
        gap: 4px;
        flex-direction: column;
        padding: 28px 20px;
        border-radius: 8px;
        position: relative;

        &__2 {
          background-image: url("../assets/images/earn-money/pot-bg-02.png");
        }

        .item-amount {
          color: #ffffff;
          font-size: 24px;
          line-height: 1;
          font-weight: bold;
        }

        .item-desc {
          color: #ffffff99;
        }

        .item-img {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);

          img {
            display: block;
            width: 100%;
            max-width: 160px;
          }
        }
      }
    }

    .earn-money-details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 12px;
      margin-top: 16px;

      .details-item {
        display: flex;
        flex-direction: column;
        min-height: 100px;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        position: relative;

        .item-amount {
          span {
            font-size: 24px;
            font-weight: bold;
            color: #70bc62;
          }
        }

        .item-title {
          font-size: 16px;
          color: #8c968f;
        }

        .item-icon {
          position: absolute;
          top: 12px;
          left: 12px;

          img {
            display: block;
            width: 24px;
          }
        }
      }
    }

    .earn-money-invite {
      background-color: rgba(255, 255, 255, 0.05);
      margin-top: 16px;
      border-radius: 10px;
      padding: 16px;

      .invite-title {
        font-size: 22px;
        color: #ffffff;
        font-weight: bold;
      }
      .invite-desc {
        font-size: 16px;
        color: #8c968f;
      }

      .invite-listing {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .listing-item {
          border: 1px solid #ffffff0d;
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          display: flex;
          padding: 8px 16px;
          align-items: center;
          line-height: 1;
          gap: 12px;
          color: #8c968f;

          span.list-num {
            width: 14px;
            font-size: 24px;
            color: #ffd600;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>

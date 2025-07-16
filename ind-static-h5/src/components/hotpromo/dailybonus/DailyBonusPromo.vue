<template>
  <div>
    <div class="daily-bonus-main-img">
      <img src="./img/dailybonus-main-img.png" alt="" />
    </div>
    <div class="daily-bonus-wrap">
      <div class="bonus-amount">
        <img src="./img/bonus-amount.png" alt="" />
      </div>
      <div class="bonus-bar-status">
        <div class="status-filled" style="width: 70%"></div>
        <div class="status-amount">700/1888</div>
      </div>

      <div class="collect-btn">
        <img src="./img/collect-btn.png" alt="" />
      </div>

      <div class="round-ends">Round ends in: 5 days 12:45:30</div>

      <div class="bonus-info-wrap">
        <div class="bonus-info-box">
          <div class="bonus-info-img">
            <img src="./img/bonus-claim-01.png" alt="" />
          </div>
          <div class="bonus-info-details">
            <div class="bonus-info-amount">₹50</div>
            <div class="bonus-info-task">log into the game</div>
            <div class="bonus-info-bar">
              <div class="bar-filled" width="100%"></div>
              <div class="bar-amount">1/1</div>
            </div>
          </div>

          <div class="bonus-info-action">
            <img src="./img/go-btn.png" alt="" />
          </div>
        </div>

        <div class="bonus-info-box">
          <div class="bonus-info-img">
            <img src="./img/bonus-claim-02.png" alt="" />
          </div>
          <div class="bonus-info-details">
            <div class="bonus-info-amount txt-purple">₹100</div>
            <div class="bonus-info-task">Total ₹100 recharge</div>
            <div class="bonus-info-bar">
              <div class="bar-filled" width="100%"></div>
              <div class="bar-amount">1/1</div>
            </div>
          </div>

          <div class="bonus-info-action">
            <img src="./img/go-btn.png" alt="" />
          </div>
        </div>

        <div class="bonus-info-box">
          <div class="bonus-info-img">
            <img src="./img/bonus-claim-02.png" alt="" />
          </div>
          <div class="bonus-info-details">
            <div class="bonus-info-amount txt-purple">₹100</div>
            <div class="bonus-info-task">Complete a withdrawal</div>
            <div class="bonus-info-bar">
              <div class="bar-filled" width="100%"></div>
              <div class="bar-amount">1/1</div>
            </div>
          </div>

          <div class="bonus-info-action">
            <img src="./img/go-btn.png" alt="" />
          </div>
        </div>

        <div class="bonus-info-box">
          <div class="bonus-info-img">
            <img src="./img/bonus-claim-02.png" alt="" />
          </div>
          <div class="bonus-info-details">
            <div class="bonus-info-amount txt-purple">₹100</div>
            <div class="bonus-info-task">Play 10 games</div>
            <div class="bonus-info-bar">
              <div class="bar-filled" width="100%"></div>
              <div class="bar-amount">1/1</div>
            </div>
          </div>

          <div class="bonus-info-action">
            <img src="./img/go-btn.png" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div class="rules-title">
      <div class="event-rules"><img src="./img/title-event-rules.png" alt="" /></div>
    </div>

    <div class="rules-content">
      <ol>
        <li>
          This event is a 7-day limited-time task event. Users can get corresponding rewards by completing designated
          tasks. When the accumulated bonus reaches ₹1888, they can apply to add it to the game balance.
        </li>
        <li>
          Before withdrawing the bonus, you need to complete 1 times of effective turnover (i.e. complete equal bets),
          otherwise you cannot apply for withdrawal.
        </li>
        <li>
          During the event, if there is network abnormality, system failure or other force majeure factors that cause
          the task to be unable to be completed, the platform will not bear compensation liability. It is recommended
          that users contact customer service in time for assistance.
        </li>
        <li>
          Each user, device, and IP can only participate in one event. If malicious multi-opening or small account
          brushing tasks are found, the participation qualification and rewards will be cancelled.
        </li>
        <li>
          The final right of interpretation of this event belongs to XXX game platform. If there is any adjustment or
          termination, it will be announced in the platform in advance.
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from "vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
</script>

<style lang="scss" scoped>
.daily-bonus-main-img {
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.daily-bonus-wrap {
  background-image: url(img/dailybonus-container-bg.png);
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  // margin-top: 100px;
  margin-top: -100px;
  padding: 40px 20px 40px 20px;

  .bonus-amount {
    img {
      display: block;
      width: 160px !important;
      margin: auto;
    }
  }

  .bonus-bar-status {
    background: linear-gradient(180deg, #feeabb 0%, #fde4b2 53.85%, #ebcd68 100%);
    // padding: 10px;
    border-radius: 16px;
    border: #f9b939 2px solid;
    margin-top: 20px;
    position: relative;

    .status-filled {
      background: linear-gradient(180deg, #ba24e3 0%, #8d23d8 53.85%, #7923ab 100%);
      // width: 50%;
      height: 17px;
      border-radius: 20px;
    }

    .status-amount {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #1f2346;
      font-weight: bold;
      font-size: 14px;
      line-height: 1;
    }
  }

  .collect-btn {
    img {
      display: block;
      width: 150px !important;
      margin: 20px auto;
    }
  }

  .round-ends {
    color: #ffc637;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    margin-top: 12px;
  }

  .bonus-info-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;

    .bonus-info-box {
      background: linear-gradient(180deg, #fef0d4 0%, #feefd3 100%);
      width: 100%;
      border-radius: 16px;
      border: 2px solid #ffbf00;
      display: flex;
      align-items: center;

      .bonus-info-img {
        margin-bottom: -6px;
        img {
          width: 80px !important;
        }
      }

      .bonus-info-details {
        padding-left: 10px;
        // display: flex;
        // flex-direction: column;
        width: 100%;
        .bonus-info-amount {
          color: #ef4d0d;
          font-size: 20px;
          font-weight: 900;

          &.txt-purple {
            color: #9a40f8;
          }
        }

        .bonus-info-task {
          font-size: 12px;
          color: #74462a;
        }

        .bonus-info-bar {
          background: linear-gradient(180deg, #feeabb 0%, #fde4b2 53.85%, #ebcd68 100%);
          // padding: 10px;
          border-radius: 16px;
          box-shadow: 0px -2px 1px 0px #ffffff inset;
          background: #ffffff;
          // border: #f9b939 2px solid;
          margin-top: 8px;
          position: relative;
          width: 100%;

          .bar-filled {
            // background: linear-gradient(180deg, #ba24e3 0%, #8d23d8 53.85%, #7923ab 100%);
            background: linear-gradient(180deg, #ffe8a2 0%, #fbc15b 100%);
            // width: 50%;
            height: 12px;
            border-radius: 20px;
          }

          .bar-amount {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #6d2525;
            font-weight: bold;
            font-size: 14px;
            line-height: 1;
          }
        }
      }

      .bonus-info-action {
        margin-left: auto;
        padding: 12px;
        min-width: 80px;
      }
    }
  }
}

.rules-title {
  margin-top: 20px;
}
</style>

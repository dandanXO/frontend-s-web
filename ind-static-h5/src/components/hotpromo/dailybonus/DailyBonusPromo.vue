<template>
  <div>
    <div class="daily-bonus-main-img">
      <img src="./img/dailybonus-main-img.png" alt="" />
    </div>
    <div class="daily-bonus-wrap">
      <div v-if="loading" class="bonus-amount" style="padding-top: 50px;">
        <q-spinner></q-spinner>
      </div>
      <div v-if="!loading" class="bonus-amount">
        <!-- <img src="./img/bonus-amount.png" alt="" /> -->
         {{ store.currency.value }}{{ accumulatedBonus }}
      </div>
      <div v-if="!loading" class="bonus-bar-status">
        <div class="status-filled" :style="{ width: getBarPercentage(accumulatedBonus, minBonus) + '%' }">
        </div>
        <div class="status-amount">{{ accumulatedBonus < minBonus ? `${accumulatedBonus} / ${minBonus}` : `${minBonus} / ${minBonus}` }}</div>
      </div>

      <div v-if="!loading" class="collect-btn" @click="collectBonus" :class="{disabled: hasWithdrawn || (accumulatedBonus < minBonus)}">
        <img src="./img/collect-btn.png" alt="" />
      </div>

      <div v-if="!loading" class="round-ends">Round ends in: {{countdownText}}</div>

      <div class="bonus-info-wrap">
        <div v-for="(task, i) in sortedTasks" :key="i" class="bonus-info-box">
          <div class="bonus-info-day">
            <img :src="require(`./img/day${task.day}.png`)" alt="" />
          </div>
          <div class="bonus-info-img">
            <img src="./img/bonus-claim-01.png" v-if="task.status === 'COMPLETED'" alt="" />
            <img src="./img/bonus-claim-02.png" v-else alt="" />
          </div>
          <div class="bonus-info-details">
            <div class="bonus-info-amount">{{ store.currency.value }}{{ task.bonus }}</div>
            <div class="bonus-info-task">{{ task.name }}</div>
            <div class="bonus-info-bar">
              <div class="bar-filled" :style="{ width: getBarPercentage(task.completedAmount, task.requiredAmount) + '%' }"></div>
              <div class="bar-amount">{{ `${task.completedAmount} / ${task.requiredAmount}` }}</div>
            </div>
          </div>

          <div class="bonus-info-action">
            <img @click="gotoTask(task.type)" v-if="task.status === 'ONGOING'" src="./img/go-btn.png" alt="" />
            <div class="completed" v-if="task.status === 'COMPLETED'">
              <img src="./img/completedicon.png" alt="" />
              Completed
            </div>
          </div>
        </div>

        <!-- <div class="bonus-info-box">
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
        </div> -->
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
          The final right of interpretation of this event belongs to 55ACE.com. If there is any adjustment or
          termination, it will be announced in the platform in advance.
        </li>
      </ol>
    </div>
    

  <q-dialog v-model="bonusOpened" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="row items-center">
        <div class="bonus-svg-div">
          <span class="bonus-text">Congratulations! <br>You collected</span>
          <span class="claim-amt">{{ winAmount }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Confirm" color="primary" v-close-popup no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onActivated } from "vue";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
const loading = ref(false);
const router = useRouter();
const store = userStore();

const accumulatedBonus = ref();
const minBonus = ref();
const hasWithdrawn = ref(false);
const tasksStartTime = ref();
const tasksEndTime = ref();
const taskList = ref([]);
const bonusOpened = ref(false);
const winAmount = ref(0);
const countdownText = ref('');
const initData = () => {
//   loading.value = true;
//   loading.value = false;
//   const res = {
//   "code": 0,
//   "data": {
//       "accumulatedBonus": 1500.0000,
//       "minBonus": 1888,
//       "tasksStartTime": "2025-07-17 00:00:00",
//       "tasksEndTime": "2025-07-23 23:59:59",
//       "hasWithdrawn": false,
//       "tasks": [
//           {
//               "day": 6,
//               "sequence": 1,
//               "name": "Login",
//               "type": "LOGIN",
//               "subType": null,
//               "status": "COMPLETED",
//               "requiredAmount": 1.0000,
//               "subRequiredAmount": null,
//               "completedAmount": 1,
//               "completedSubAmount": null,
//               "bonus": 50.0000
//           },
//           {
//               "day": 3,
//               "sequence": 4,
//               "name": "Complete spin lucky wheel 1 time",
//               "type": "PROMO",
//               "subType": null,
//               "status": "ONGOING",
//               "requiredAmount": 1.0000,
//               "subRequiredAmount": null,
//               "completedAmount": 0,
//               "completedSubAmount": null,
//               "bonus": 50.0000
//           },
//           {
//               "day": 6,
//               "sequence": 3,
//               "name": "Successfully deposit 1000 or above",
//               "type": "DEPOSIT",
//               "subType": null,
//               "status": "ONGOING",
//               "requiredAmount": 1000.0000,
//               "subRequiredAmount": null,
//               "completedAmount": 250.0000,
//               "completedSubAmount": null,
//               "bonus": 150.0000
//           },
//           {
//               "day": 6,
//               "sequence": 2,
//               "name": "Refer 2 friends and complete at least 2 tasks",
//               "type": "REFER",
//               "subType": "TASK",
//               "status": "ONGOING",
//               "requiredAmount": 2.0000,
//               "subRequiredAmount": null,
//               "completedAmount": 1,
//               "completedSubAmount": null,
//               "bonus": 150.0000
//           }
//       ]
//   }
// }
  loading.value = true;
   eventapi.get('/session/member-tasks/init', {params: { promoCode: "ind-seven-days-bonus" }}).then((res) => {
    
    loading.value = false;
    
    if (res.code === 0) {
      loading.value = false;
      console.log(res.data)
      accumulatedBonus.value = res.data.accumulatedBonus;
      minBonus.value = res.data.minBonus;
      tasksStartTime.value = res.data.tasksStartTime;
      tasksEndTime.value = res.data.tasksEndTime;
      taskList.value = res.data.tasks;
      hasWithdrawn.value = res.data.hasWithdrawn;
      
      let timer = null;

        
      countdownText.value = getDuration(tasksEndTime.value, getIndiaNow());

      timer = setInterval(() => {
        countdownText.value = getDuration(tasksEndTime.value, getIndiaNow());
      }, 1000);
    }

  })
}
function getIndiaNow() {
  const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(indiaTime).getTime();
}
function getDuration(endTime, nowTime) {
  const end = new Date(endTime.replace(/-/g, '/'));
  const now = new Date(nowTime);

  let diffMs = end - now;
  if (diffMs <= 0) return 'Round has ended';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => n.toString().padStart(2, '0');

  return `${days} days ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


function getBarPercentage(part, total) {
  if (!total || total === 0) return 0;
  if (part >= total) return 100;
  return (part / total) * 100;
}
const gotoTask = (taskType) => {
  if (taskType === 'LOGIN') {
    router.push('/login');
  }
  if (taskType === 'PROMO') {
    router.push('/promo');
  }
  if (taskType === 'REFER') {
    router.push('/earn-money');
  }
  if (taskType === 'DEPOSIT' || taskType === 'DEPOSIT_WITHDRAW') {
    router.push('/deposit');
  }
  if (taskType === 'WITHDRAW') {
    router.push('/withdraw');
  }
  if (taskType === 'BET') {
    router.push('/home');
  }
   if (taskType === 'VIP') {
    router.push('/vip');
  }
}

const collectBonus = () => {
  eventapi
    .post(`/session/member-tasks/claimBonus?promoCode=ind-seven-days-bonus`)
    .then((res) => {
      if (res.code === 0) {
        winAmount.value = res.data;
        bonusOpened.value = true;
      } else {
        bonusOpened.value = false;
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
      bonusOpened.value = false;
    });
};
const sortedTasks = computed(() => {
  // return [...taskList.value].sort((a, b) => a.sequence - b.sequence);
  return taskList.value
});
onMounted(() => {
  initData();
})
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
    
    font-size: 50px;
    text-align: center;
    filter: drop-shadow(-2px -2px 2px white);
    color: #ef4d0d;
    font-weight: 900;
    line-height: 35px;
    text-shadow: 2px 2px 5px WHITE;
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
    &.disabled {
      pointer-events: none;
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
       position: relative;

      .bonus-info-day {
        position: absolute;
        top: -15px;
        left: -15px;
        width: 50px;
        img {
          width: 100%;
        }
      }
      .bonus-info-img {
        // margin-bottom: -6px;
        img {
          width: 80px !important;
          margin-bottom: 0;
        }
      }

      .bonus-info-details {
        padding-left: 10px;
        // display: flex;
        // flex-direction: column;
        width: 100%;
        .bonus-info-amount {
          color: #ef4d0d;
          font-size: 16px;
          font-weight: 900;

          &.txt-purple {
            color: #9a40f8;
          }
        }

        .bonus-info-task {
          font-size: 11px;
          color: #74462a;
        }

        .bonus-info-bar {
          background: linear-gradient(180deg, #feeabb 0%, #fde4b2 53.85%, #ebcd68 100%);
          // padding: 10px;
          border-radius: 16px;
          box-shadow: 0px -2px 1px 0px #ffffff inset;
          background: #ffffff;
          // border: #f9b939 2px solid;
          margin-top: 4px;
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
            font-size: 10px;
            line-height: 10px;
            width: 100%;
            text-align: center;
          }
        }
      }

      .bonus-info-action {
        margin-left: auto;
        padding: 12px;
        min-width: 80px;
        .completed {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          img {
            width: 30px;
          }
          color: #857971;
          font-size: 10px;
        }
      }
    }
  }
}

.rules-title {
  margin-top: 20px;
}
</style>

<template>
  <div>
    <div class="promo-page">
      <div class="promo-img">
        <img src="./img/bg-promo.png" alt="" />
      </div>

      <div class="promo-content-container q-px-md">
        <div class="day-selections">
          <template v-for="item in claimStatus" :key="item">
            <div class="select-day" :class="{ active: item.isActive }" @click="setActive(item)">
              <div class="day-img">
                <img :src="require(`./img/day-${item.day}.png`)" />
              </div>
              <div class="day-txt">{{ item.day }} days</div>
              <div class="tick-img">
                <img
                  :src="
                    item.hasClaimed === 'YES'
                      ? require('./img/tick-icon-active.png')
                      : item.hasClaimed === 'NO'
                      ? require('./img/tick-icon.png')
                      : require('./img/tick-icon-expired.png')
                  "
                />
              </div>
            </div>
          </template>
        </div>

        <div class="content-box" v-if="activeClaim">
          <!-- <div class="title-wrap">
            <div class="box-title">
              <div><img src="./img/icon-depositdays.png" alt="" /></div>
              Registration time:
            </div>
            <div class="box-desc">2025-03-09 20:26</div>
          </div>
          <div class="title-wrap">
            <div class="box-title">
              <div><img src="./img/icon-registrationtime.png" alt="" /></div>
              Total deposit days:
            </div>
            <div class="box-desc">2025-03-09 20:26</div>
          </div> -->

          <div class="bonus-box">
            <div class="bonus-title">Bonus claim time</div>
            <div class="bonus-date">
              <div><img src="./img/icon-time.png" alt="" /></div>
              {{ activeClaim && formatDateTime(activeClaim.bonusClaimTime) }}
            </div>

            <div class="bonus-img">
              <img src="./img/img-bonus.png" alt="" />
            </div>
          </div>

          <q-btn
            class="start-btn"
            no-caps
            size="lg"
            :disable="activeClaim && !activeClaim.isOpen"
            @click="claimNewPlayerAccDeposit()"
          >
            <div class="q-mr-sm"><img src="./img/img-start.png" alt="" /></div>
            <template v-if="activeClaim && activeClaim.hasClaimed === 'YES'">Claimed</template>
            <template v-if="activeClaim && activeClaim.hasClaimed === 'EXPIRED'">Expired</template>
            <template v-if="activeClaim && activeClaim.hasClaimed === 'NO'">Claim now</template>
            <!-- <template v-else>Claim now</template> -->
          </q-btn>
        </div>

        <div class="content-para">The registration time starts from the time the registration is completed.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { eventapi } from "src/boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const claimStatus = ref([]);

const initNewPlayerAccDeposit = () => {
  eventapi.get("/session/new-player-acc-deposit/init").then((res) => {
    if (res.code == 0) {
      let foundFirst = false;
      claimStatus.value = res.data.claimStatus.map((item) => {
        if (!foundFirst && item.highlight) {
          foundFirst = true;
          return { ...item, isActive: true };
        }
        return { ...item, isActive: false };
      });
    }
  });
};

const claimNewPlayerAccDeposit = () => {
  eventapi.post("/session/new-player-acc-deposit/claim").then((res) => {
    if (res.code === 0) {
      $q.notify({
        message: "Successfully Claimed",
        color: "positive",
        position: "top",
        timeout: 2000
      });
      initNewPlayerAccDeposit();
    }
  });
};

const setActive = (selectedItem) => {
  claimStatus.value = claimStatus.value.map((item) => ({
    ...item,
    isActive: item === selectedItem
  }));
};

const activeClaim = computed(() => claimStatus.value.find((item) => item.isActive));

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

onMounted(() => {
  initNewPlayerAccDeposit();
});
</script>

<style lang="scss" scoped>
.day-selections {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;

  .select-day {
    background: linear-gradient(180deg, #345024 0%, #1a341d 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    padding: 8px 6px;
    border: 4px solid #17301a;
    margin-bottom: 28px;
    position: relative;

    &.active {
      background: linear-gradient(180deg, #7ace23 0%, #195e0e 100%);

      .day-txt {
        color: #fffc00;
      }

      &:after {
        content: "";
        height: 22px;
        width: 29px;
        background-image: url("./img/icon-triangle.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: -36px;
      }
    }

    .day-img {
      img {
        display: block;
        width: 40px;
      }
    }

    .day-txt {
      font-size: 12px;
      font-weight: bold;
      color: #91a08f;
      text-align: center;
    }

    .tick-img {
      margin-top: 12px;
      img {
        display: block;
        width: 17px;
      }
    }
  }
}

.promo-img {
  margin-bottom: -24px;
}

.content-box {
  border-radius: 16px;
  border-top: 4px solid #6dff6b;
  border-bottom: 4px solid #6dff6b;
  background-color: #34603f;
  padding: 16px 16px 24px;
  margin-top: 16px;

  .title-wrap {
    display: flex;
    align-items: center;

    .box-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #aebfb2;
      font-weight: bold;
      gap: 6px;

      img {
        display: block;
        margin-top: 4px;
      }
    }

    .box-desc {
      color: #d6dfd9;
      font-size: 16px;
      font-weight: bold;
      margin-left: auto;
    }
  }

  .bonus-box {
    background: linear-gradient(107.93deg, #d1ff8c 1.62%, #90ff8c 100%);
    padding: 16px 16px 0;
    border-radius: 16px;
    margin-top: 16px;
    font-weight: bold;
    text-align: center;

    .bonus-title {
      font-size: 16px;
      color: #435931;
      margin-bottom: 6px;
    }

    .bonus-date {
      font-size: 18px;
      color: #002340;
      display: flex;
      gap: 6px;
      justify-content: center;

      img {
        margin-top: 4px;
        display: block;
      }
    }

    .bonus-img {
      img {
        display: block;
        width: 100%;
        max-width: 200px;
        margin: auto;
      }
    }
  }

  .start-btn {
    background: linear-gradient(180deg, #75cb5c 0%, #428849 100%);
    padding: 0px 16px 4px;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    gap: 8px;
    margin-top: 24px;
    width: 100%;
  }
}

.content-para {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-top: 16px;
}
</style>

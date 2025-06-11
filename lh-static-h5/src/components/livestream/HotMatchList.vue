<template>
  <div class="competition-list-wrapper">
    <div class="row justify-center q-py-md">
      <CategoryToggle
        v-model="model"
        :categories="[
          { value: 'ESport', slot: 'esport' },
          { value: 'Football', slot: 'football' },
          { value: 'Basketball', slot: 'basketball' }
        ]"
      />
    </div>
    <div v-if="!hotMatchesByType.length" class="no-data">目前没有赛程</div>
    <div class="hot-match-items">
      <TransitionGroup name="list">
        <div :class="tab" class="hot-match-item" v-for="hotMatch in hotMatchesByType" :key="hotMatch.id">
          <div class="hot-match-info">
            <div class="hot-match-name">
              {{ hotMatch.competitionName }}
            </div>
            <div class="hot-match-scores">
              <div class="hot-match-team">
                <img class="hot-match-img" :src="`${imgURL + hotMatch.teamOneLogo}`" />
                <span>{{ hotMatch.teamOneName }}</span>
              </div>
              <div class="hot-match-time">
                {{ hotMatch.competitionTime }}
                <div class="bet-btn" @click="$emit('betClick', hotMatch)">立即投注</div>
              </div>
              <div class="hot-match-team">
                <img class="hot-match-img" :src="`${imgURL + hotMatch.teamTwoLogo}`" />
                <span>{{ hotMatch.teamTwoName }}</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import { computed, ref, toRefs } from "vue";
import CategoryToggle from "./CategoryToggle.vue";
import moment from "moment";

const props = defineProps({
  hotMatches: {
    type: Array,
    default: () => []
  }
});
const { hotMatches } = toRefs(props);

defineEmits(["betClick"]);

const model = defineModel({
  type: String,
  default: ""
});

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const now = moment().format("YYYY-MM-DD HH:mm:ss");

const hotMatchesByType = computed(() => {
  return hotMatches.value.filter(
    ({ competitionType, displayStartTime, displayEndTime }) =>
      competitionType === model.value && now >= displayStartTime && now <= displayEndTime
  );
});
</script>
<style lang="scss" scoped>
.hot-match-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding-bottom: 80px;
  position: relative;
  overflow: hidden;

  .hot-match-item {
    background: unset;
    background-size: 100% 100%;
    aspect-ratio: 351 / 139;
    width: 100%;
    height: 150px;
    color: rgba(76, 76, 108, 1);
    box-shadow: 0px -3.71px 3.71px 0px rgba(195, 212, 230, 1) inset, 0px 1.85px 0px 0px rgba(167, 194, 221, 1);
    border-radius: 10px;
    background: #fff;

    .hot-match-info {
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      position: relative;

      .hot-match-name,
      .hot-match-time {
        font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
          sans-serif;

        font-size: 14px;
        font-weight: 400;
        line-height: 15px;
        color: rgba(76, 76, 108, 1);
        text-align: center;
      }

      .hot-match-scores {
        display: flex;
        align-items: center;
        gap: 10px;

        .hot-match-time {
          width: 85px;

          .bet-btn {
            position: absolute;
            left: 50%;
            bottom: 0%;
            transform: translate(-50%, -50%);
            padding: 3px 8px;
            background: #fff;
            border-radius: 5px;
            cursor: pointer;
            color: rgba(69, 139, 255, 1);
            border: rgba(69, 139, 255, 1) 1px solid;
            border-radius: 100px;
            &:hover {
              filter: brightness(1.1);
            }
          }
        }

        .hot-match-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
            sans-serif;

          font-size: 14px;
          font-weight: 400;
          line-height: 15px;
          color: rgba(76, 76, 108, 1);
          text-align: center;
          gap: 5px;
          width: 120px;
        }

        .hot-match-img {
          width: 70px;
          background-color: #fff;
          border-radius: 100px;
          padding: 5px;
          aspect-ratio: 1 / 1;
          box-shadow: 0px 2.29px 2.29px 0px rgba(147, 199, 255, 1) inset,
            0px -1.84px 1.84px 0px rgba(39, 94, 193, 1) inset;
        }
      }
    }
  }

  :deep(.list-enter-active),
  :deep(.list-leave-active) {
    transition: all 0.5s ease;
  }

  :deep(.list-enter-from),
  :deep(.list-leave-to) {
    opacity: 0;
    transform: translateY(50%);
  }

  :deep(.list-leave-active) {
    position: absolute;
    width: 100%;
    left: 0;
  }
}

.no-data {
  display: flex;
  justify-content: center;
  grid-column: 1 / span 2;
}

.body--dark {
  .hot-match-items {
    .hot-match-item {
      &.ESport {
        background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-esport.png") no-repeat center center;
        background-size: 100% 100%;
      }

      &.Basketball {
        background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-basketball.png") no-repeat center center;
        background-size: 100% 100%;
      }

      &.Football {
        background: url("../../assets/images/hotmatch/hotmatch-item-bg-dark-soccer.png") no-repeat center center;
        background-size: 100% 100%;
      }

      .hot-match-info {
        .hot-match-name,
        .hot-match-time {
          color: #fff;
        }

        .hot-match-scores {
          .hot-match-time {
            .bet-btn {
              background: linear-gradient(to bottom, #5d7dbf 0%, #242d6f 100%);
              cursor: pointer;

              &:hover {
                filter: brightness(1.1);
              }
            }
          }

          .hot-match-team {
            color: #fff;
          }

          .hot-match-img {
            background-color: #27385b;
          }
        }
      }
    }
  }
}
</style>

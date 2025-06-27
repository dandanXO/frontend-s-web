<template>
  <div v-if="pageLoading">
    <div class="loading-blue-icon"></div>
  </div>

  <div class="worldcup-2025-wrapper" v-else>
    <div class="toptitle-row">
      <div class="col-desc">
        活动期间，会员完成特殊事件竞猜或独赢竞猜，最高可获得
        <span>288</span>
        竞猜奖金。
      </div>
      <div class="col-record" @click="openTableRecord">【竞猜记录】</div>
    </div>

    <swiper class="livestream-list-wrapper" v-bind="swiperConfig" @swiper="handleSwiper">
      <swiper-slide v-for="(live, index) in list" :key="live.id">
        <div
          class="livestream-list-item"
          :class="{
            selected: model === index
          }"
          @click="handleLivestreamClick(index)"
        >
          <div class="livestream-list-item__match-info">
            <div class="livestream-list-item__match-info__team">
              <div class="livestream-list-item__match-info__team-emblem">
                <img :src="imgURL + live.homeTeamIcon || systemAvatarImg" loading="lazy" />
              </div>
              <span class="livestream-list-item__match-info__team-name">
                <!-- {{ live.homeNameZh || live.homeNameEn || live.homeName }} -->
                {{ live.homeTeam }}
              </span>
            </div>

            <div class="livestream-list-item__match-info__date">
              <span class="livestream-list-item__match-info__date__vs">VS</span>
              <div class="livestream-list-item__match-info__date__date">
                {{ live.matchTime }}
              </div>
            </div>
            <div class="livestream-list-item__match-info__team">
              <div class="livestream-list-item__match-info__team-emblem">
                <img :src="imgURL + live.awayTeamIcon || systemAvatarImg" loading="lazy" />
              </div>
              <span class="livestream-list-item__match-info__team-name">
                {{ live.awayTeam }}
              </span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <div class="current-match-container">
      <div class="match-info match-info--home">
        <div class="info-img">
          <img :src="imgURL + currentListItem.homeTeamIcon || systemAvatarImg" loading="lazy" />
        </div>
        <div class="info-txt">
          {{ currentListItem.homeTeam }}
        </div>
      </div>

      <div class="match-home-vs">
        <div class="vs-title-row">
          <div class="title-icon">
            <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-fifa.png" alt="" />
          </div>
          <div class="title-txt">世俱杯</div>

          <!--          <pre>{{ currentListItem }}</pre>-->
          <div class="title-status notstart" v-if="currentListItem.startTime > currentTime">
            <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-match-notstart.svg" alt="" />
            &nbsp; 未开始
          </div>
          <div class="title-status ended" v-else-if="currentListItem.endTime <= currentTime">
            <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-match-ended.svg" alt="" />
            &nbsp; 已结束
          </div>
          <div
            class="title-status ongoing"
            v-else-if="currentListItem.endTime > currentTime && currentTime >= currentListItem.startTime"
          >
            <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-match-ongoing.svg" alt="" />
            &nbsp; 进行中
          </div>
        </div>
        <div class="vs-time">{{ getDisplayDateTime(currentListItem.matchTime) }}</div>
        <div class="vs-icon"><img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-vs.png" alt="" /></div>
        <div class="vs-win">独赢</div>
        <div class="vs-notes">
          本场赛事竞猜时间 {{ getDisplayDateTime(currentListItem.startTime) }} -
          {{ getDisplayDateTime(currentListItem.endTime) }}
        </div>
      </div>

      <div class="match-info match-info--away">
        <div class="info-img">
          <img :src="imgURL + currentListItem.awayTeamIcon || systemAvatarImg" loading="lazy" />
        </div>
        <div class="info-txt">
          {{ currentListItem.awayTeam }}
        </div>
      </div>
    </div>

    <div class="title-match-row">
      <div class="col-txt">
        <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-win.png" alt="" />
        竞猜独赢事件
      </div>
      <div class="col-record">
        当日首存≥100可参与(
        <span>当前存款{{ totalDeposit }}元</span>
        )
      </div>
    </div>

    <div class="current-match-bet">
      <div
        class="bet-select"
        :class="{
          active: currentListItem.memberAnswerOne === choiceOneArray[0] || selectedTeam == choiceOneArray[0],
          disabled: currentListItem.memberAnswerOne || currentListItem.status === 'ENDED'
        }"
        @click="selectTeam(choiceOneArray[0])"
      >
        {{ choiceOneArray[0] }} 赢
      </div>
      <div
        class="bet-select"
        :class="{
          active: currentListItem.memberAnswerOne === choiceOneArray[1] || selectedTeam == choiceOneArray[1],
          disabled: currentListItem.memberAnswerOne || currentListItem.status === 'ENDED'
        }"
        @click="selectTeam(choiceOneArray[1])"
      >
        {{ choiceOneArray[1] }} 赢
      </div>
    </div>

    <!-- 独赢事件竞猜 -->
    <template v-if="currentListItem.memberAnswerOne || selectedTeam || currentListItem.status === 'ENDED'">
      <div class="match-btn disabled" v-if="currentListItem.hasClaimedBonus">已领取</div>
      <div
        class="match-btn"
        v-else-if="currentListItem.status === 'ENDED'"
        :class="{ disabled: loadingBtn }"
        @click="handleClaimFifaQuiz2025(currentListItem.id)"
      >
        立即领取
      </div>
      <div class="match-btn disabled" v-else-if="currentListItem.memberAnswerOne">已参与竞猜</div>
      <div
        class="match-btn"
        v-else
        :class="{ disabled: loadingBtn }"
        @click="handleSubmitFifaQuiz2025(currentListItem.id, selectedTeam)"
      >
        确认竞猜
      </div>
    </template>

    <div class="title-match-row">
      <div class="col-txt">
        <img src="@/assets/images/promotion/hotpromo/worldcup-2025/icon-special.png" alt="" />
        竞猜特殊事件
      </div>
    </div>

    <div class="current-match-bet">
      <div
        v-for="(item, index) in filteredSpecialList"
        :key="index"
        class="bet-select"
        :class="{
          active: currentListItem.memberSelectedOccasion === item.occasion || selectedSpecial == item.occasion,
          disabled: currentListItem.memberSelectedOccasion || currentListItem.status === 'ENDED'
        }"
        @click="selectSpecial(item.occasion)"
      >
        {{ item.occasion }}
        <img :src="require(`@/assets/images/promotion/hotpromo/worldcup-2025/special-${index}.png`)" alt="" />
        <div class="prize-amt">
          <span>{{ item.bonus }}</span>
          彩金
        </div>
      </div>
    </div>

    <!-- 特殊事件竞猜 -->
    <template v-if="currentListItem.memberSelectedOccasion || selectedSpecial || currentListItem.status === 'ENDED'">
      <div class="match-btn disabled" v-if="currentListItem.hasClaimedOccasionBonus">已领取</div>
      <div
        class="match-btn"
        v-else-if="currentListItem.status === 'ENDED'"
        :class="{ disabled: loadingBtn }"
        @click="handleClaimOccasionFifaQuiz2025(currentListItem.id)"
      >
        立即领取
      </div>
      <div class="match-btn disabled" v-else-if="currentListItem.memberSelectedOccasion">已参与竞猜</div>
      <div
        class="match-btn"
        v-else
        :class="{ disabled: loadingBtn }"
        @click="handleSubmitOccasionFifaQuiz2025(currentListItem.id, selectedSpecial)"
      >
        确认竞猜
      </div>
    </template>
  </div>

  <div class="tnc-wrapper">
    <div class="tnc-title">活动规则</div>
    <div class="tnc-content">
      <ol>
        <li>
          独赢竞猜：当日存款≥100元，即可获得独赢竞猜机会，仅限独赢竞猜，竞猜正确即可获得彩金。 ​
          <br />
          特殊事件竞猜：比赛开始前完成特殊事件竞猜，并在指定赛事中累计投注≥1000元，若竞猜正确，即可获得竞猜彩金。
          竞猜机会仅限当天使用有效，隔日无效。
        </li>
        <li>
          竞猜活动仅计算世俱杯赛事。任何低于欧洲盘 1.7 或亚洲盘 0.7
          水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>
          独赢竞猜结果分为：输、和、赢，竞猜结算（赢）猜中 即可获得8元奖金，若竞猜结果结算为“和”将会视为无效竞猜。
        </li>
        <li>竞猜正确的用户在次日优惠活动界面点击【立即领取】即可领取昨日竞猜成功的竞猜金，竞猜金仅需5倍流水出款。</li>
        <li>
          根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
        </li>
        <li>
          此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
          地址视为同一账户，若有违规者，将不享受此红利；
        </li>
        <li>为避免文字理解差异，东赢电竞保留此活动最终解释权；</li>
      </ol>
    </div>
  </div>

  <el-dialog
    v-model="tableRecordDialog"
    width="800px"
    align-center
    :close-on-click-modal="false"
    class="table-record-dialog"
  >
    <template #header>
      <div class="title"></div>
    </template>
    <div class="record-dialog-container">
      <div class="record-title">竞猜记录</div>
      <table class="record-table">
        <thead>
          <tr>
            <th>赛事</th>
            <th>竞猜队伍</th>
            <th>竞猜事件</th>
            <th>可获彩金</th>
            <th>竞猜结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in tableData" :key="index">
            <td>{{ record.quizTitle }}</td>
            <td>{{ record.answerOne }}</td>
            <td>{{ record.selectedOccasion }}</td>
            <td>{{ record.bonus }}</td>
            <td>{{ record.status }}</td>
          </tr>
        </tbody>
      </table>

      <div class="close-btn" @click="tableRecordDialog = false">关闭</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import systemAvatarImg from "@/assets/images/promotion/hotpromo/worldcup-2025/dy.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { userStore } from "@/store";
import { computed, ref, watch, onMounted, defineProps, toRefs, nextTick } from "vue";
import {
  getFifaQuiz2025PromoInit,
  getFifaQuiz2025PromoRecord,
  submitFifaQuiz2025,
  submitOccasionFifaQuiz2025,
  claimFifaQuiz2025,
  claimOccasionFifaQuiz2025
} from "@/api/index/promo";
import { ResponseCode } from "@/api/response";
import { useNotify } from "@/hooks/notify";

const notify = useNotify();
const list = ref([]);
const store = userStore();
const props = defineProps(["promoCode"]);
const { promoCode } = toRefs(props);
const totalValidBet = ref();
const totalDeposit = ref();
const tableData = ref();

const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

const fetchTableData = async () => {
  try {
    const res = await getFifaQuiz2025PromoRecord(promoCode.value);
    tableData.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    pageLoading.value = false;
    loadingBtn.value = false;
  }
};

const fetchData = async () => {
  try {
    const res = await getFifaQuiz2025PromoInit(promoCode.value);
    totalValidBet.value = res.data.totalValidBet;
    totalDeposit.value = res.data.totalDeposit;
    list.value = res.data.gameQuizList;
  } catch (error) {
    console.log(error);
  } finally {
    pageLoading.value = false;
    loadingBtn.value = false;
  }
};

const handleSubmitFifaQuiz2025 = (quizId, answerOne) => {
  loadingBtn.value = true;
  submitFifaQuiz2025(promoCode.value, quizId, answerOne)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "成功提交竞猜"
        });
        fetchData();
      } else if (
        !(
          res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_SYSTEM
        )
      ) {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const handleSubmitOccasionFifaQuiz2025 = (quizId, selectedOccasion) => {
  loadingBtn.value = true;
  submitOccasionFifaQuiz2025(promoCode.value, quizId, selectedOccasion)
    .then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "成功提交竞猜"
        });
        fetchData();
      } else if (
        !(
          res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_SYSTEM
        )
      ) {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const handleClaimFifaQuiz2025 = (quizId) => {
  loadingBtn.value = true;
  claimFifaQuiz2025(promoCode.value, quizId)
    .then((res) => {
      if (res.code === 0) {
        notify.redPacket("成功领取", res.data);
        fetchData();
      } else if (
        !(
          res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_SYSTEM
        )
      ) {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const handleClaimOccasionFifaQuiz2025 = (quizId) => {
  loadingBtn.value = true;
  claimOccasionFifaQuiz2025(promoCode.value, quizId)
    .then((res) => {
      if (res.code === 0) {
        notify.redPacket("成功领取", res.data);
        fetchData();
      } else if (
        !(
          res.code === ResponseCode.ERROR_USER_TOO_FAST ||
          res.code === ResponseCode.ERROR_PROMO_NOT_STARTED ||
          res.code === ResponseCode.ERROR_PROMO_USER_NOT_MEET_REQUIREMENT ||
          res.code === ResponseCode.ERROR_PROMO_CLAIMED ||
          res.code === ResponseCode.ERROR_SYSTEM
        )
      ) {
        notify({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const model = ref(0);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const swiperInstance = ref(null);

const swiperConfig = computed(() => {
  const SLIDE_PER_VIEW = 4;
  return {
    slidesPerView: SLIDE_PER_VIEW,
    // slidesPerGroup: SLIDE_PER_VIEW,
    slidesPerGroup: 1,
    spaceBetween: 20,
    modules: [Navigation],
    navigation: list.value.length > SLIDE_PER_VIEW
    // allowTouchMove: false
  };
});

const handleLivestreamClick = (index) => {
  model.value = index;

  const SLIDE_PER_VIEW = 4;
  const total = list.value.length;
  let targetIndex;

  if (index <= 1) {
    targetIndex = 0;
  } else if (index >= total - 2) {
    targetIndex = total - SLIDE_PER_VIEW;
  } else {
    targetIndex = index - 1;
  }

  targetIndex = Math.min(Math.max(0, targetIndex), total - SLIDE_PER_VIEW);

  if (swiperInstance.value) {
    swiperInstance.value.slideTo(0, 0);
    setTimeout(() => {
      if (index === 1) {
        swiperInstance.value.slideTo(0, 0);
      } else if (index === total - 1) {
        swiperInstance.value.slideTo(total - 1, 0);
      } else {
        swiperInstance.value.slideTo(targetIndex, 300);
      }
    }, 10);
  }
  selectedTeam.value = "";
  selectedSpecial.value = "";
};

const handleSwiper = (_swiperInstance) => {
  swiperInstance.value = _swiperInstance;
};

const getDisplayDateTime = (timestamp) => {
  const now = moment().startOf("day");
  const eventDate = moment(timestamp);
  const eventDay = moment(timestamp).startOf("day");

  const diffInDays = eventDay.diff(now, "days");

  if (diffInDays === 0) {
    return eventDate.format("今日 HH:mm");
  } else if (diffInDays === 1) {
    return eventDate.format("明日 HH:mm");
  } else {
    return eventDate.format("MM/DD HH:mm");
  }
};

const currentListItem = computed(() => {
  return list.value[model.value];
});

const choiceOneArray = computed(() => {
  try {
    return JSON.parse(currentListItem.value.choiceOne || "[]");
  } catch (e) {
    return [];
  }
});

const selectedTeam = ref("");
const selectTeam = (team) => {
  selectedTeam.value = team;
};

const selectedSpecial = ref("");
const selectSpecial = (special) => {
  selectedSpecial.value = special;
};
const specialList = ref([
  { id: "1", title: "全场零进球", prize: "18", img: "special-01.png" },
  { id: "2", title: "出现红牌", prize: "28", img: "special-02.png" },
  { id: "3", title: "补时进球", prize: "38", img: "special-03.png" },
  { id: "4", title: "点球得分", prize: "58", img: "special-04.png" },
  { id: "5", title: "梅开二度", prize: "88", img: "special-05.png" },
  { id: "6", title: "帽子戏法", prize: "128", img: "special-06.png" },
  { id: "7", title: "乌龙球", prize: "288", img: "special-07.png" }
]);

const filteredSpecialList = computed(() => {
  return currentListItem.value.occasions;
});

const findInitialIndex = () => {
  const priority = ["ONGOING", "ENDED"];

  for (const status of priority) {
    const idx = list.value.findIndex((item) => item.status === status);
    if (idx !== -1) return idx;
  }
  return 0;
};

watch(model, () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slideTo(model.value, 0);
});

watch(
  list,
  () => {
    model.value = findInitialIndex();

    nextTick(() => {
      const SLIDE_PER_VIEW = 4;
      const total = list.value.length;
      const index = model.value;

      let targetIndex;

      if (index <= 1) {
        targetIndex = 0;
      } else if (index >= total - 2) {
        targetIndex = total - SLIDE_PER_VIEW;
      } else {
        targetIndex = index - 1;
      }

      targetIndex = Math.min(Math.max(0, targetIndex), total - SLIDE_PER_VIEW);

      if (swiperInstance.value) {
        swiperInstance.value.slideTo(targetIndex, 0);
      }
    });
  },
  { immediate: true }
);

const showNotStart = computed(() => {
  return moment(currentListItem.value.startTime).isAfter(moment());
});

const tableRecordDialog = ref(false);

const openTableRecord = () => {
  fetchTableData();
  tableRecordDialog.value = true;
};

const pageLoading = ref(true);
const loadingBtn = ref(false);

onMounted(() => {
  if (!store.token) {
    return;
  }

  fetchData();
  fetchTableData();
});
</script>

<style lang="scss" scoped>
//   @import "@/scss/pages/livestream.scss";

.livestream-list-wrapper {
  display: flex;
  gap: 18.87px;
  padding: 0 18px 18px 0;
  align-items: center;
  margin: 0 0;
  --swiper-navigation-color: #3981ff;

  :deep(.swiper-button-prev) {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -1.67px 3.82px 0px #b1d7ff inset;

    &:after {
      font-size: 12px;
      color: #ffffff;
    }
    &.swiper-button-disabled {
      background: #ffffff;
      opacity: 1;

      &:after {
        color: #333333;
      }
    }
  }

  :deep(.swiper-button-next) {
    right: 28px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -1.67px 3.82px 0px #b1d7ff inset;

    &:after {
      font-size: 12px;
      color: #ffffff;
    }
    &.swiper-button-disabled {
      background: #ffffff;
      opacity: 1;

      &:after {
        color: #333333;
      }
    }
  }

  .livestream-list-item {
    // @include livestream-content-block;
    background-color: #fff;
    border-radius: 18px;
    box-shadow: 0px 3.77px 20.76px 0px #00000026;

    .dark & {
      background-color: #17223e;
      box-shadow: 2px 4px 10px 0px #00194b52;
    }
    background-color: #fff;
    border-radius: 18px;
    position: relative;
    padding: 11px 0;
    margin: 18px 0 0;
    cursor: pointer;

    .dark & {
      background-color: #304774;
      border: 1px solid transparent;
    }

    &.selected {
      border: 2px solid #468cff;
      background: rgba(0, 161, 255, 0.4);
      &::after {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #468cff;
      }
    }

    .livestream-list-item__title {
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      text-align: center;
      color: #333333;
    }
    .livestream-list-item__match-info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .livestream-list-item__match-info__team {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        flex-basis: 33%;
        max-width: 33%;
        .livestream-list-item__match-info__team-emblem {
          // @include livestream-team-emblem;
          padding: 7px;
          border-radius: 50%;
          img {
            // @include img-pseudo;
            position: relative;
            overflow: hidden;

            &::after {
              content: "";
              position: absolute;
              display: block;
              inset: 0;
              width: 100%;
              height: 100%;
              background: url(@/assets/images/promotion/hotpromo/worldcup-2025/icon-img-error.png) no-repeat center,
                #a9a9a9;
              background-size: 80% 80%;
            }
            display: block;
            width: 30px;
            aspect-ratio: 1;
            border-radius: 50%;
          }
        }
        .livestream-list-item__match-info__team-name {
          font-size: 12px;
          line-height: 15px;
          color: #7a80a1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 100%;
        }
      }
    }

    .livestream-list-item__match-info__date {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      .livestream-list-item__match-info__date__on-air {
        //   @include livestream-on-air;
        background-color: #1ac1a2;
        padding: 0 5px;
        border-radius: 4px;
        font-size: 10px;
        line-height: 13px;
        font-weight: 500;
        color: #fff;
      }
      .livestream-list-item__match-info__date__date {
        font-size: 11px;
        line-height: 15px;
        color: #7a80a1;
        margin-top: 12px;
        text-align: center;
      }
      .livestream-list-item__match-info__date__vs {
        font-size: 16px;
        line-height: 23px;
        color: #333333;
      }
    }

    .livestream-list-item__badge-wrapper {
      position: absolute;
      top: 4px;
      left: 14px;
      transform: translateY(-100%);
      background: linear-gradient(
        259.14deg,
        #ffecce 11.64%,
        #f3cd92 27.82%,
        #fff2ca 52.4%,
        #efd190 72.12%,
        #e4bd80 99.13%
      );
      border: 0.94px solid #d3aa69;
      border-radius: 8px;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;

      .livestream-list-item__badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 7px;
        font-size: 11px;
        line-height: 15px;
        color: #000000;
        img {
          // @include img-pseudo;
          border-radius: 50%;
          width: 22px;
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;

          &::after {
            content: "";
            position: absolute;
            display: block;
            inset: 0;
            width: 100%;
            height: 100%;
            background: url(@/assets/images/promotion/hotpromo/worldcup-2025/icon-img-error.png) no-repeat center,
              #a9a9a9;
            background-size: 80% 80%;
          }
        }
      }
    }
  }

  .livestream-list__pseudo {
    flex: 0 0 calc(25% - 12.87px);
    height: 100%;
    :deep(.path) {
      stroke: #4c88f8;
    }
  }
}

.dark {
  .livestream-list-wrapper {
    --swiper-navigation-color: #fff;

    :deep(.swiper-button-prev) {
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      box-shadow: 0px 1.57px 1.57px 0px #7488accc inset;
      &:after {
        color: #653b00;
      }
      &.swiper-button-disabled {
        background: #2d3e6a;
        &:after {
          color: #ffffff;
        }
      }
    }

    :deep(.swiper-button-next) {
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      box-shadow: 0px 1.57px 1.57px 0px #7488accc inset;
      &:after {
        color: #653b00;
      }
      &.swiper-button-disabled {
        background: #2d3e6a;
        &:after {
          color: #ffffff;
        }
      }
    }

    .livestream-list-item {
      &.selected {
        background: #be945766;
        background-size: 100% 100%;
        background-clip: border-box;
        border-color: #be9457;
        &::after {
          border-top: 10px solid #be9457;
        }

        .livestream-list-item__match-info__date {
          .livestream-list-item__match-info__date__vs {
            color: #fff;
          }
        }
      }

      .livestream-list-item__match-info__date {
        .livestream-list-item__match-info__date__vs {
          color: #fff;
        }
      }

      .livestream-list-item__title {
        color: #fff;
      }
      .livestream-list-item__match-info {
        .livestream-list-item__match-info__team {
          .livestream-list-item__match-info__team-emblem {
            //   @include livestream-team-emblem;
            background-color: #fff;
            border-radius: 18px;
            box-shadow: 0px 3.77px 20.76px 0px #00000026;

            padding: 7px;
            border-radius: 50%;
            img {
              display: block;
              width: 30px;
              aspect-ratio: 1;
              border-radius: 50%;
              position: relative;
              overflow: hidden;

              &::after {
                content: "";
                position: absolute;
                display: block;
                inset: 0;
                width: 100%;
                height: 100%;
                background: url(@/assets/images/promotion/hotpromo/worldcup-2025/icon-img-error.png) no-repeat center, #a9a9a9;
                background-size: 80% 80%;
              }
            }
          }
          .livestream-list-item__match-info__team-name {
            color: #fff;
          }
        }
      }

      .livestream-list-item__match-info__date {
        .livestream-list-item__match-info__date__date {
          color: #fff;
        }
      }
    }

    .livestream-list__pseudo {
      :deep(.path) {
        stroke: #fff;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.worldcup-2025-wrapper {
  max-width: 1200px;
  margin: auto;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 16px;

  .toptitle-row {
    display: flex;
    justify-content: space-between;

    .col-desc {
      color: #333333;

      span {
        color: #00a1ff;
      }
    }

    .col-record {
      color: #00a1ff;
      cursor: pointer;
    }
  }

  .current-match-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-image: url(@/assets/images/promotion/hotpromo/worldcup-2025/match-desktop-bg.png);
    background-repeat: no-repeat;
    background-position: top center;
    background-size: cover;
    border-radius: 16px;
    padding: 16px;

    .match-info {
      width: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &--home {
      }
      &--away {
      }

      .info-img {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        box-shadow: 0px 3.77px 20.76px 0px rgba(0, 0, 0, 0.1490196078);
        // padding: 7px;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        img {
          display: block;
          width: 80px;
        }
      }
      .info-txt {
        display: block;
        text-align: center;
        margin-top: 16px;
      }
    }

    .match-home-vs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .vs-title-row {
        display: flex;
        align-items: center;
        line-height: 1;
        gap: 8px;

        .title-icon {
          img {
            display: block;
            width: 40px;
          }
        }
        .title-txt {
          color: #333333;
          font-size: 24px;
        }
        .title-status {
          background: #00a1ff;
          border-radius: 24px;
          line-height: 1;
          font-size: 12px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6px 12px;

          &.ended {
            background: #ff5e00;
          }

          &.ongoing {
            background: #00a1ff;
          }

          &.notstart {
            background: #737373;
          }

          img {
            display: block;
            width: 16px;
          }
        }
      }
      .vs-time {
        font-size: 18px;
        color: #333333;
      }
      .vs-icon {
        margin-top: 20px;
        img {
          display: block;
          width: 80px;
        }
      }

      .vs-win {
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
      }
      .vs-notes {
        background: linear-gradient(
          90deg,
          rgba(0, 161, 255, 0) 0%,
          rgba(0, 161, 255, 0.2) 50%,
          rgba(0, 161, 255, 0) 100%
        );
        color: #737373;
        font-size: 12px;
        line-height: 1;
        padding: 8px 16px;
        margin-top: 16px;
      }
    }
  }

  .title-match-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    .col-txt {
      display: flex;
      gap: 6px;
      font-size: 24px;
      color: #333333;
      align-items: center;
      font-weight: bold;
      img {
        display: block;
        width: 32px;
        margin-bottom: 6px;
      }
    }
    .col-record {
      color: #666666;
      span {
        color: #00a1ff;
      }
    }
  }

  .match-btn {
    width: 160px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin: 20px auto 20px;

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
      color: #818181;
    }
  }
}

.tnc-wrapper {
  max-width: 1200px;
  margin: auto;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 16px;
  margin-top: 40px;
  .tnc-title {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFang TC;
    font-size: 32px;
    line-height: 1;

    &:before {
      content: "";
      background: url("@/assets/images/promotion/hotpromo/worldcup-2025/title-pattern-left.png") no-repeat center center;
      background-size: cover;
      width: 307px;
      height: 44px;
      display: block;
      margin-right: 10px;
    }
    &:after {
      content: "";
      background: url("@/assets/images/promotion/hotpromo/worldcup-2025/title-pattern-right.png") no-repeat center
        center;
      background-size: cover;
      width: 307px;
      height: 44px;
      display: block;
      margin-left: 10px;
    }
  }

  .tnc-content {
    ol {
      list-style: none;
      counter-reset: item;

      li {
        counter-increment: item;
        position: relative;
        padding-left: 32px;
        padding-bottom: 12px;

        &::before {
          content: counter(item);
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
          color: #653b00;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
      }
    }
  }
}

.current-match-bet {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  .bet-select {
    font-size: 18px;
    width: 100%;
    background: #ffffff;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    flex-direction: column;

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
    }

    img {
      display: block;
      width: 80px;
      margin: 12px 0;
    }

    .prize-amt {
      color: #535353;
      font-size: 14px;
      span {
        color: #00a1ff;
        font-size: 20px;
      }
    }

    &.active {
      background: #00a1ff66;
      border-color: #00a1ff;
      &:after {
        content: "";
        width: 32px;
        height: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url(@/assets/images/promotion/hotpromo/worldcup-2025/select-btn-active.svg);
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}

.dark {
  .worldcup-2025-wrapper {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border: 1px solid #be9457;

    .toptitle-row {
      .col-desc {
        color: #ffffff;

        span {
          color: #be9457;
        }
      }

      .col-record {
        color: #be9457;
      }
    }

    .current-match-container {
      .match-home-vs {
        .vs-title-row {
          .title-icon {
            img {
              filter: invert(1);
            }
          }
          .title-txt {
            color: #ffffff;
          }
          .title-status {
            color: #ffffff;
            &.ended {
              background: #ff5e00;
            }

            &.ongoing {
              background: #be9457;
            }

            &.notstart {
              background: #737373;
            }
          }
        }
        .vs-time {
          color: #ffffff;
        }
        .vs-icon {
          img {
            filter: invert(1);
          }
        }
        .vs-notes {
          color: #ffffff;
        }
      }
    }

    .title-match-row {
      .col-txt {
        color: #ffffff;
      }
      .col-record {
        color: #ffffff;
        span {
          color: #be9457;
        }
      }
    }

    .match-btn {
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      color: #653b00;
      border: 1px solid #ffffff;

      &.disabled {
        background: linear-gradient(180deg, #cbcbcb 0%, #757575 100%);
        color: #ffffff;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .tnc-wrapper {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);

    .tnc-content {
      ol {
        li {
          &::before {
            background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
          }
        }
      }
    }
  }

  .current-match-bet {
    .bet-select {
      background: #304774;

      .prize-amt {
        color: #ffffff;
        span {
          color: #ffdba8;
        }
      }

      &.active {
        background: #be945766;
        border-color: #be9457;
        &:after {
          background-image: url(@/assets/images/promotion/hotpromo/worldcup-2025/select-btn-active-dark.svg);
        }
      }
    }
  }
}

.close-btn {
  border: 1px solid #00a1ff;
  border-radius: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 144px;
  height: 44px;
  color: #00a1ff;
  margin: auto;
  cursor: pointer;
}

.dark {
  .close-btn {
    border-color: #be9457;
    color: #be9457;
  }
}

.loading-blue-icon {
  width: 200px;
  height: 200px;
  border: 2px solid #799df8; /* Light gold color */
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 4px auto;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.record-title {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFang TC;
  font-size: 32px;
  line-height: 1;
  white-space: nowrap;

  &:before {
    content: "";
    background: url("@/assets/images/promotion/hotpromo/worldcup-2025/title-pattern-left.png") no-repeat center center;
    background-size: cover;
    width: 307px;
    height: 44px;
    display: block;
    margin-right: 10px;
  }
  &:after {
    content: "";
    background: url("@/assets/images/promotion/hotpromo/worldcup-2025/title-pattern-right.png") no-repeat center center;
    background-size: cover;
    width: 307px;
    height: 44px;
    display: block;
    margin-left: 10px;
  }
}

.record-table {
  width: 100%;
  height: 100%;
  margin-bottom: 25px;
  border-collapse: collapse;
  th {
    height: 56px;
    font-size: 20px;
    // font-weight: 600;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    vertical-align: middle;
    text-align: center;

    &:first-child {
      border-top-left-radius: 6px;
    }
    &:last-child {
      border-top-right-radius: 6px;
    }
  }
  tr {
    height: 56px;
    font-size: 20px;
    // font-weight: 600;
    line-height: 28px;
    color: #333333;
    vertical-align: middle;
    text-align: center;
    &:nth-child(odd) {
      background: #f2f8fe;
    }
    &:nth-child(even) {
      background: #fff;
    }
    th {
      &:first-child {
        padding-left: 20px;
      }
      &:last-child {
        // text-align: right;
        padding-right: 14px;
      }
    }

    td {
      border: 1px solid #acd4f6;
      &:first-child {
        padding-left: 20px;
      }
      &:last-child {
        // text-align: right;
        padding-right: 14px;
      }
    }

    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 6px;
        }
      }
    }
    &:last-child {
      td {
        &:last-child {
          border-bottom-right-radius: 6px;
        }
      }
    }
  }
}

.dark {
  .record-table {
    th {
      color: #653b00;
      // background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
    }
    tr {
      color: #ffffff;
      &:nth-child(odd) {
        background: transparent;
      }
      &:nth-child(even) {
        background: transparent;
      }

      td {
        border: 1px solid #f2f6ac;
      }
    }
  }
}
</style>

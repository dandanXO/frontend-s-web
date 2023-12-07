<template>
  <div>
    <div class="tigercard-container">
      <div v-loading.fullscreen.lock="isPageLoading" :element-loading-text="pageLoadingText"></div>
      <div class="acc-pool-wrap">
        <div class="acc-pool">
          <div class="acc-pool-number">¥{{ cardInfo.cardDetail.setting.sumAward }}</div>
        </div>
      </div>

      <div class="text-center card-tips">
        已有{{ cardInfo.cardDetail.setting.cardCount }}人集齐,{{ cardInfo.cardDetail.setting.openStr }}开奖
      </div>
      <div class="text-center position-relative">
        <div class="huka-btn huka-take-btn waves-effect" @click="getNewTigerCard">领取虎卡</div>

        <div v-if="cardInfo.cardDetail.leftCount > 0" class="redeem-tips">剩下 {{ cardInfo.cardDetail.leftCount }} 次机会领取</div>
      </div>

      <div class="content">
        <div class="huka-wrap">
          <div class="huka-title">
            <img src="../../../assets/images/promotion/hotpromo/tigercard/my_huka.png" alt="" />
          </div>
          <div class="huka-container">
            <div class="huka-list">
              <div
                v-for="(huka, i) in hukaList"
                :key="i"
                :class="{ 'huka-selected': isSelected === huka.code }"
                class="huka"
                @click="selectHuka(huka)"
              >
                <img :src="require(`../../../assets/images/promotion/hotpromo/tigercard/${huka.image}.png`)" alt="" />
                <div class="huka-own-count">{{ cardInfo.cardDetail[huka.code] }}</div>
              </div>
            </div>
            <div class="huka-gold">
              <div class="goldhu" style="position: relative">
                <img src="../../../assets/images/promotion/hotpromo/tigercard/bonus.png" alt="" />
                <div class="huka-own-count" style="right: 4px; top: 8px">{{ cardInfo.cardDetail.goldhu }}</div>
              </div>
            </div>
          </div>
          <div class="huka-footer">
            <div class="huka-btn waves-effect give-btn" @click="isGiftModal = true">赠送虎卡</div>
            <div class="huka-btn waves-effect combo-btn" @click="compoundCard">合成大奖卡</div>
          </div>
        </div>
        <div class="huka-ranking-wrap">
          <div class="huka-ranking-title">
            <img src="../../../assets/images/promotion/hotpromo/tigercard/huka_ranking.png" alt="" />
          </div>

          <el-table :data="rankingRecord()" :loading="rankingPage.loading">
            <template #empty>
              <p>没有数据</p>
            </template>
            <el-table-column prop="num" label="名次" />
            <el-table-column prop="name" label="用户名称" />
            <el-table-column prop="amount" label="总卡数" />
          </el-table>
          <el-pagination
            small
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="pageNumChange"
            :total="rankingPage.records.length"
            :current-page="rankingPage.current"
            :page-size="rankingPage.pageSize"
          />
        </div>
      </div>
    </div>
    <el-dialog align-center v-model="isGiftModal" title="赠送虎卡" width="500">
      <el-form :rules="sendRules" ref="hukaFormRef" style="padding: 20px" :model="form">
        <el-form-item prop="type" label="虎卡" :label-width="formLabelWidth">
          <el-select style="width: 100%" v-model="form.type" placeholder="请选择虎卡">
            <el-option v-for="(huka, i) in hukaList" :key="i" :label="huka.label" :value="huka.code" />
          </el-select>
        </el-form-item>
        <el-form-item prop="friendLoginName" label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.friendLoginName" autocomplete="off" placeholder="请输入好友东瀛账号" />
        </el-form-item>
        <el-form-item prop="realName" label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" autocomplete="off" placeholder="请输入好友真实姓名" />
        </el-form-item>
        <div style="text-align: center">
          <el-button class="common-btn grey" color="#ff0000" @click="resetRegForm(hukaFormRef)">重置</el-button>
          <el-button :loading="isSubmitting" class="common-btn" @click="submitRegisterForm(hukaFormRef)">
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog align-center class="wonHukaBox" v-model="isCardModal" :show-close="false">
      <span v-for="(huka, i) in hukaList" :key="i">
        <div v-if="cardWon === huka.code" class="wincontents">
          <div class="message">恭喜您获得一张: {{ huka.label }}</div>
          <div class="amount">
            <img :src="require(`../../../assets/images/promotion/hotpromo/tigercard/${huka.image}.png`)" />
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import {
  tigerCardInit,
  getLeaderboard,
  getMemberCard,
  giveCardToFriend,
  synthesisCard
} from "@/api/promotion/tigerCard";
import { ElMessage } from "element-plus";
import { userStore } from "@/store";
import { useRouter } from "vue-router";

const cardInfo = reactive({
  cardDetail: {
    goldhu: 0,
    hongyunhu: 0,
    jilihu: 0,
    pinganhu: 0,
    ruyihu: 0,
    xinyunhu: 0,
    leftCount: 0,
    setting: {
      cardCount: 0,
      lotteryStr: "",
      openStr: "",
      periodStr: "",
      sumAward: 0,
      cardNum: {},
      count: 0
    }
  }
});

const rankingPage = reactive({
  current: 1,
  pageSize: 2,
  records: [],
  loading: false
});

const rankingRecord = () => {
  return rankingPage.records.filter(
    (item, index) =>
      index < rankingPage.current * rankingPage.pageSize && index >= rankingPage.pageSize * (rankingPage.current - 1)
  );
};

const pageNumChange = (i) => {
  rankingPage.current = i;
};

const pageInit = () => {
  tigerCardInit({ promoCode: "dy2-tiger-card" }).then((res) => {
    if (res.code === 0) {
      cardInfo.cardDetail = res.data;
    }
  });
};

const loadRanking = () => {
  getLeaderboard().then((res) => {
    if (res.code === 0) {
      rankingPage.records = res.data;
    }
  });
};
const isPageLoading = ref(false);
const pageLoadingText = ref("");
const getNewTigerCard = () => {
  isPageLoading.value = true;
  pageLoadingText.value = "正领取虎卡";
  getMemberCard({ promoCode: "dy2-tiger-card" })
    .then((res) => {
      if (res.code === 0) {
        cardInfo.cardDetail[res.data.cardType] = cardInfo.cardDetail[res.data.cardType] + 1;
        isCardModal.value = true;
        cardWon.value = res.data.cardType;
      } else {
        ElMessage.error({
          type: "error",
          message: res.message
        });
      }
    })
    .catch(() => {})
    .then(() => {
      isPageLoading.value = false;
      pageInit()
    });
};

const compoundCard = () => {

  isPageLoading.value = true;
  pageLoadingText.value = "正合成大奖卡";
  synthesisCard({ promoCode: "dy2-tiger-card" })
    .then((res) => {
      if (res.code === 0) {
        pageInit();
        ElMessage.success({
          type: "success",
          message: "success"
        });
      } else {
        ElMessage.error({
          type: "error",
          message: res.message
        });
      }
    })
    .catch(() => {})
    .then(() => {
      isPageLoading.value = false;
    });
};

const hukaList = ref([
  {
    code: "hongyunhu",
    image: "hyh",
    count: 0,
    label: "鸿运虎"
  },
  {
    code: "jilihu",
    image: "jlh",
    count: 0,
    label: "吉利虎"
  },
  {
    code: "pinganhu",
    image: "pah",
    count: 0,
    label: "平安虎"
  },
  {
    code: "ruyihu",
    image: "ryh",
    count: 0,
    label: "如意虎"
  },
  {
    code: "xinyunhu",
    image: "xyh",
    count: 0,
    label: "幸运虎"
  }
]);
const isSelected = ref("xinyunhu");
const selectHuka = (huka) => {
  isSelected.value = huka.code;
};

const isGiftModal = ref(false);
const isCardModal = ref(false);
const cardWon = ref("");
const store = userStore();
const router = useRouter();
onMounted(() => {
  if (store.token) {
    pageInit();
    loadRanking();
  } else {
    router.push("/login");
  }
});
const formLabelWidth = "140px";

const form = reactive({
  friendLoginName: null,
  realName: null,
  type: null
});

const sendRules = {
  friendLoginName: [
    {
      required: true,
      message: "请输入好友账户名",
      trigger: "blur"
    }
  ],
  realName: [
    {
      required: true,
      message: "请输入好友真实姓名",
      trigger: "blur"
    }
  ],
  type: [
    {
      required: true,
      message: "请选择虎卡",
      trigger: "change"
    }
  ]
};
const hukaFormRef = ref();
const isSubmitting = ref(false);
const resetRegForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
const submitRegisterForm = async (elForm) => {
  if (!elForm) return;
  await elForm.validate((valid) => {
    if (valid) {
      isSubmitting.value = true;
      form.promoCode = "dy2-tiger-card";
      giveCardToFriend(form).then((res) => {
        if (res.code === 0) {
          ElMessage.error({
            type: "success",
            message: "success"
          });
          isSubmitting.value = false;
        }
      });
      isSubmitting.value = false;
    }
  });
};
</script>
<style lang="scss">
.el-loading-spinner .path {
  stroke: #b46e00;
}
.el-loading-spinner .el-loading-text {
  color: #b46e00;
}
.tigercard-container {
  .el-table {
    &__empty-text p {
      color: #8a6b28;
    }
    max-width: 650px;
    margin: 0 auto;

    background: white;
    border-radius: 10px;
    border: 0;
    th {
      text-align: center;
      line-height: 32px;
      &.el-table__cell {
        color: #8a6b28;
        border-bottom: 1px solid #8a6b28;
        background-color: white;
        &.is-leaf {
          border-bottom: 1px solid #8a6b28;
        }
      }
    }
    td {
      &.el-table__cell {
        color: #8a6b28;
        text-align: center;
        border: 0;
      }
    }
  }
  .el-pagination {
    margin: 10px auto;
    justify-content: center;

    .el-pager {
      pointer-events: none;
    }
    .el-pager li {
      color: #8a6b28;
      min-width: unset;

      &.btn-quicknext {
        svg {
          display: none;
        }
      }
      &.is-active,
      &:hover {
        // &:after {
        //   content: "/";
        //   display: inline-block;
        //   margin-left: 8px;
        // }
        color: #8a6b28;
      }
    }
    button {
      color: #8a6b28;
    }
  }
}

body {
  .wonHukaBox {
    width: 500px;
    height: 500px;
    background: none;
    background-size: contain;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      background: none;
      box-shadow: none;
      height: 100%;
      .wincontents {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        flex-direction: column;
        gap: 10px;
        .message {
          padding: 10px;
          font-size: 40px;
          background-image: linear-gradient(67deg, #f1d784, #ffd81c, #f1d784);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
        .amount {
          color: #ffae00;
          font-size: 50px;
          font-weight: bold;
          padding-bottom: 10px;
          span {
            font-size: 30px;
          }
        }
        .el-button {
          margin-bottom: 20px;
          padding: 25px 0;
          width: 60%;
          font-size: 25px;
          border: 2px solid #cf8e03;
          border-radius: 30px;
          background-image: linear-gradient(358deg, #bea229, transparent);
          box-shadow: 0px 5px 1px #895d00;
          font-weight: bold;
          span {
            color: #3a0001;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.tigercard-container {
  margin: 0 auto;
  width: 100%;
  max-width: $maxwidth;
}
.banner {
  background: #000 url(https://eqwp2f.sdwukong.com/resource/es/img/banner.b26099dc.png) top no-repeat;
  max-width: 1920px;
  height: 500px;
}

.acc-pool-wrap {
  margin-top: 3rem;
}

.acc-pool {
  background: url(../../../assets/images/promotion/hotpromo/tigercard/bg_acc_pool.png) top no-repeat;
  width: 930px;
  height: 262px;
  margin: 0 auto;
}

.acc-pool-number {
  text-align: center;
  padding-top: 7rem;
  font-size: 3.5rem;
  font-family: Microsoft YaHei;
  font-weight: 700;
  background: #fffcc6;
  background: linear-gradient(180deg, #fffcc6 50%, #ffc760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.huka-wrap {
  display: inline-block;
  padding: 1.5rem;
  background-color: white;
}

.huka-wrap .huka-title {
  text-align: center;
}

.huka-container {
  display: flex;
  margin-top: 1.5rem;
}

.huka-wrap .huka-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
}

.card-tips {
  font-size: 15px;
  margin-top: 20px;
  color: #87898a;
  text-align: center;
}

.redeem-tips {
  display: flex;
  justify-content: center;
  padding-left: 70px;
  margin-top: -10px;
  color: #87898a;
  font-size: 12px;
  margin-bottom: 20px;
}

.huka-list {
  display: flex;
  flex-direction: row;
  background: #fffbce;
  border: 1px solid #3b435c;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  column-gap: 1.5rem;
  padding: 1.5rem;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

.huka {
  margin: 0 9px;
  cursor: pointer;
}

.huka-btn {
  background: transparent url(../../../assets/images/promotion/hotpromo/tigercard/btn_bg.png) 50% no-repeat;
  background-size: cover;
  width: 217px;
  height: 55px;
  text-align: center;
  line-height: 55px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #5d450c;
  cursor: pointer;
}

.huka-take-btn {
  margin: 20px auto;
}

.huka-list > div {
  position: relative;
  border: 3px solid #d72f2f;
  border-radius: 6px;
}

.huka-own-count {
  position: absolute;
  right: -14px;
  top: -14px;
  background-color: #b46e00;
  border: 2px solid #ffd200;
  text-align: center;
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-weight: 700;
  color: #ffd97f;
  -webkit-border-radius: 14px;
  -moz-border-radius: 14px;
  border-radius: 20px;
}

.huka-list > div img {
  width: 100%;
  max-width: 100%;
}

.huka-list > div.huka-selected {
  border: 3px solid #810203;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}

.huka-gold {
  width: 29.5%;
  margin-left: 1.5rem;
  padding: 0.5rem;
  background: #ffcf6f;
  border: 1px solid #ffd97f;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}

.huka-gold img {
  width: 100%;
  max-width: 100%;
}

.huka-ranking-wrap {
  text-align: center;
}

.huka-ranking-title {
  margin: 3rem 0 1rem;
}

.huka-ranking-table {
  background-color: #1d212e;
  margin: 0 auto;
  color: #ffd97f;
  text-align: center;
  width: 50%;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  font-weight: 400;
}

.huka-ranking-table th {
  border-bottom: 1px solid #ffd97f;
  line-height: 32px;
}

.huka-ranking-table tr {
  line-height: 32px;
}

.huka-ranking-pagination {
  margin: 0 auto;
  padding-top: 0.5rem;
  color: #ffd97f;
}

.huka-ranking-pagination .next-page,
.huka-ranking-pagination .prev-page {
  cursor: pointer;
}
</style>

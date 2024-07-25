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
      <div class="text-center">
        <div class="longka-btn longka-take-btn waves-effect" @click="getNewTigerCard">领取龙卡</div>
      </div>

      <div class="content">
        <div class="longka-wrap">
          <div class="longka-title">
            <img src="../../../assets/images/promotion/hotpromo/dragoncard/mycard-dragon.png" alt="" />
          </div>
          <div class="longka-container">
            <div class="longka-list">
              <div
                v-for="(longka, i) in longkaList"
                :key="i"
                :class="{ 'longka-selected': isSelected === longka.code }"
                class="longka"
                @click="selectlongka(longka)"
              >
                <img :src="require(`../../../assets/images/promotion/hotpromo/dragoncard/${longka.image}.png`)" alt="" />
                <div class="longka-own-count">{{ cardInfo.cardDetail[longka.code] }}</div>
              </div>
            </div>
            <div class="longka-gold">
              <div class="goldhu" style="position: relative">
                <img src="../../../assets/images/promotion/hotpromo/dragoncard/bonus.png" alt="" />
                <div class="longka-own-count" style="right: 4px; top: 8px">{{ cardInfo.cardDetail.goldhu }}</div>
              </div>
            </div>
          </div>
          <div class="longka-footer">
            <div class="longka-btn waves-effect give-btn" @click="isGiftModal = true">赠送龙卡</div>
            <div class="longka-btn waves-effect combo-btn" @click="compoundCard">合成大奖卡</div>
          </div>
        </div>
        <div class="longka-ranking-wrap">
          <div class="longka-ranking-title">
            <img src="../../../assets/images/promotion/hotpromo/dragoncard/dragon-rank.png" alt="" />
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

    <div class="bottom-content">
      <p>
        <img src="../../../assets/images/promotion/hotpromo/dragoncard/dragon-time.png" />
      </p>
      <table class="longka-ranking-table" v-if="cardInfo.cardDetail.setting">
        <thead>
        <tr>
          <td>期数</td>
          <td>集卡时间</td>
          <td>开奖时间</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ cardInfo.cardDetail.setting.periodStr }}</td>
          <td>{{ cardInfo.cardDetail.setting.lotteryStr }}</td>
          <td>{{ cardInfo.cardDetail.setting.openStr }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <el-dialog align-center v-model="isGiftModal" title="赠送龙卡" width="500">
      <el-form :rules="sendRules" ref="longkaFormRef" style="padding: 20px" :model="form">
        <el-form-item prop="type" label="龙卡" :label-width="formLabelWidth">
          <el-select style="width: 100%" v-model="form.type" placeholder="请选择龙卡">
            <el-option v-for="(longka, i) in longkaList" :key="i" :label="longka.label" :value="longka.code" />
          </el-select>
        </el-form-item>
        <el-form-item prop="friendLoginName" label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.friendLoginName" autocomplete="off" placeholder="请输入好友雷火账号" />
        </el-form-item>
        <el-form-item prop="realName" label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" autocomplete="off" placeholder="请输入好友真实姓名" />
        </el-form-item>
        <div style="text-align: center">
          <el-button class="common-btn grey" color="#ff0000" @click="resetRegForm(longkaFormRef)">重置</el-button>
          <el-button :loading="isSubmitting" class="common-btn" @click="submitRegisterForm(longkaFormRef)">
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog align-center class="wonlongkaBox" v-model="isCardModal" :show-close="false">
      <span v-for="(longka, i) in longkaList" :key="i">
        <div v-if="cardWon === longka.code" class="wincontents">
          <div class="message">恭喜您获得一张: {{ longka.label }}</div>
          <div class="amount">
            <img :src="require(`../../../assets/images/promotion/hotpromo/dragoncard/${longka.image}.png`)" />
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive, defineProps } from "vue";
import {
  tigerCardInit,
  getLeaderboard,
  getMemberCard,
  giveCardToFriend,
  synthesisCard
} from "@/api/promotion/tigerCard";
import { userStore } from "@/store";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["promoCode"]);
// alert(props.promoCode);

const notify = useNotify();

const cardInfo = reactive({
  cardDetail: {
    setting: {}
  }
});

const rankingPage = reactive({
  current: 1,
  pageSize: 5,
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
  tigerCardInit({ promoCode: props.promoCode }).then((res) => {
    if (res.code === 0) {
      cardInfo.cardDetail = res.data;
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
};

const loadRanking = () => {
  getLeaderboard().then((res) => {
    if (res.code === 0) {
      rankingPage.records = res.data;
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
};
const isPageLoading = ref(false);
const pageLoadingText = ref("");
const getNewTigerCard = () => {
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
  isPageLoading.value = true;
  pageLoadingText.value = "正领取龙卡";
  getMemberCard({ promoCode: props.promoCode }).then((res) => {
    if (res.code === 0) {
      cardInfo.cardDetail[res.data.cardType] = cardInfo.cardDetail[res.data.cardType] + 1;
      isCardModal.value = true;
      cardWon.value = res.data.cardType;
      isPageLoading.value = false;
    } else {
      notify({
        type: "error",
        message: res.message
      });
      isPageLoading.value = false;
    }
  });
};

const compoundCard = () => {
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
  isPageLoading.value = true;
  pageLoadingText.value = "正合成大奖卡";
  synthesisCard({ promoCode: props.promoCode }).then((res) => {
    if (res.code === 0) {
      pageInit();
      notify({
        type: "success",
        message: "success"
      });
      isPageLoading.value = false;
    } else {
      notify({
        type: "error",
        message: res.message
      });
      isPageLoading.value = false;
    }
  });
};

const longkaList = ref([
  {
    code: "hongyunhu",
    image: "hyl",
    count: 0,
    label: "鸿运龙"
  },
  {
    code: "jilihu",
    image: "jll",
    count: 0,
    label: "吉利龙"
  },
  {
    code: "pinganhu",
    image: "pal",
    count: 0,
    label: "平安龙"
  },
  {
    code: "ruyihu",
    image: "ryl",
    count: 0,
    label: "如意龙"
  },
  {
    code: "xinyunhu",
    image: "xyl",
    count: 0,
    label: "幸运龙"
  }
]);
const isSelected = ref("xinyunhu");
const selectlongka = (longka) => {
  isSelected.value = longka.code;
};

const isGiftModal = ref(false);
const isCardModal = ref(false);
const cardWon = ref("");
const store = userStore();
const router = useRouter();
onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
    pageInit();
    loadRanking();
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
      message: "请选择龙卡",
      trigger: "change"
    }
  ]
};
const longkaFormRef = ref();
const isSubmitting = ref(false);
const resetRegForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
const submitRegisterForm = async (elForm) => {
  if (!store.hasToken()) {
    isGiftModal.value = false
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
  if (!elForm) return;
  await elForm.validate((valid) => {
    if (valid) {
      isSubmitting.value = true;
      form.promoCode = props.promoCode;
      giveCardToFriend(form).then((res) => {
        if (res.code === 0) {
          notify({
            type: "success",
            message: "success"
          });
          isSubmitting.value = false;
        } else {
          notify({
            type: "error",
            message: res.message
          });
          isSubmitting.value = false;
        }
      });
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
      color: #B97A89;
    }

    max-width: 650px;
    margin: 0 auto;

    background: #FFF3F4;
    border-radius: 10px;
    border: 0;

    th {
      text-align: center;
      line-height: 32px;

      &.el-table__cell {
        color: #B97A89;
        border-bottom: 1px solid #ECEDF0;
        background-color: #FFF3F4;

        &.is-leaf {
          border-bottom: 1px solid #ECEDF0
        ;
        }
      }
    }

    td {
      &.el-table__cell {
        color: #B97A89;
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
      color: #B97A89;
      min-width: unset;

      &.btn-quicknext {
        svg {
          display: none;
        }
      }

      &.is-active,
      &:hover {
        &:after {
          content: "/";
          display: inline-block;
          margin-left: 8px;
        }

        color: #B97A89;
      }
    }

    button:hover {
      color: #B97A89;
    }
  }
}

body {
  .wonlongkaBox {
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
  max-width: 1920px;
  height: 500px;
}

.acc-pool-wrap {
  margin-top: 3rem;
}

.acc-pool {
  background: url(../../../assets/images/promotion/hotpromo/dragoncard/bg_acc_pool.png) top no-repeat;
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

.longka-wrap {
  display: inline-block;
  padding: 1.5rem;
}

.longka-wrap .longka-title {
  text-align: center;
}

.longka-container {
  display: flex;
  margin-top: 1.5rem;
}

.longka-wrap .longka-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
}

.card-tips {
  font-size: 15px;
  margin-top: 20px;
  color: #a19100;
  text-align: center;
}

.longka-list {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  border: 1px solid #ffae00;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  column-gap: 1.5rem;
  padding: 1.5rem;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

.longka {
  margin: 0 9px;
  cursor: pointer;
}

.longka-btn {
  background: transparent url(../../../assets/images/promotion/hotpromo/dragoncard/btn_bg.png) 50% no-repeat;
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

.longka-take-btn {
  margin: 20px auto;
}

.longka-list > div {
  position: relative;
}

.longka-own-count {
  position: absolute;
  right: -14px;
  top: -14px;
  background-color: #b46e00;
  border: 2px solid #ffd200;
  text-align: center;
  width: 24px;
  height: 24px;
  line-height: 22px;
  padding-bottom: 2px;
  font-weight: 700;
  color: #ffd97f;
  -webkit-border-radius: 14px;
  -moz-border-radius: 14px;
  border-radius: 20px;
}

.longka-list > div img {
  border: 3px solid transparent;
  width: 100%;
  max-width: 100%;
}

.longka-list > div.longka-selected img {
  border: 3px solid #ffd200;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}

.longka-gold {
  width: 29.5%;
  margin-left: 1.5rem;
  padding: 0.5rem;
  border: 1px solid #ffd97f;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}

.longka-gold img {
  width: 100%;
  max-width: 100%;
}

.longka-ranking-wrap {
  text-align: center;
}

.longka-ranking-title {
  margin: 3rem 0 1rem;
}

.longka-ranking-table {
  background-color: #fff;
  margin: 0 auto;
  color: #B97A89;
  text-align: center;
  width: 50%;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  font-weight: 400;
  table-layout: fixed;
}

.longka-ranking-table thead {
  line-height: 32px;
  background: #FFF3F4;
  color: #770202;
  font-weight: bold;
}

.longka-ranking-table tr {
  line-height: 32px;
}

.longka-ranking-pagination {
  margin: 0 auto;
  padding-top: 0.5rem;
  color: #ffd97f;
}

.bottom-content{
    p{
      text-align: center;
    }

}

.longka-ranking-pagination .next-page,
.longka-ranking-pagination .prev-page {
  cursor: pointer;
}
</style>

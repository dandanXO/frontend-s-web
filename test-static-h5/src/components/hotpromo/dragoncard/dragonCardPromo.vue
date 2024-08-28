<template>
  <div>
    <div class="tigercard-container">
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
      <div v-if="cardInfo.cardDetail.leftCount > 0" class="redeem-tips">
        剩下 {{ cardInfo.cardDetail.leftCount }} 次机会领取
      </div>

      <div class="content">
        <div class="longka-wrap">
          <div class="longka-title">
            <img src="../../../assets/images/promo/hotpromo/dragoncard/mycard-dragon.png" alt="" />
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
                <img :src="require(`../../../assets/images/promo/hotpromo/dragoncard/${longka.image}.png`)" alt="" />
                <div class="longka-own-count">
                  {{ cardInfo.cardDetail[longka.code] }}
                </div>
              </div>
            </div>
            <div class="longka-gold">
              <div class="goldhu" style="position: relative">
                <img src="../../../assets/images/promo/hotpromo/dragoncard/bonus.png" alt="" />
                <div class="longka-own-count" style="right: 4px; top: 8px">
                  {{ cardInfo.cardDetail.goldhu }}
                </div>
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
            <img src="../../../assets/images/promo/hotpromo/dragoncard/dragon-rank.png" alt="" />
          </div>

          <q-table :loading="rankingPage.loading" :columns="columns" :rows="rankingRecord()" square></q-table>
          <!-- <q-table
              :data="rankingRecord()"
              :loading="rankingPage.loading"
            >
            <template #empty>
              <p>没有数据</p>
            </template>
              <q-table-column prop="num" label="名次" />
              <q-table-column prop="name" label="用户名称" />
              <q-table-column prop="amount" label="总卡数" />
            </q-table>
            <q-pagination
              small
              hide-on-single-page
              layout="prev, pager, next"
              @current-change="pageNumChange"
              :total="rankingPage.records.length"
              :current-page="rankingPage.current"
              :page-size="rankingPage.pageSize"
            /> -->
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <p>
        <img :src="require(`../../../assets/images/promo/hotpromo/dragoncard/dragon-time.png`)" />
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

    <q-dialog align-center v-model="isGiftModal" title="赠送龙卡" width="500">
      <q-card class="q-pa-md" style="width: 100%">
        <q-form @submit="submitRegisterForm" @reset="resetRegForm" class="q-gutter-md">
          <q-select
            hide-bottom-space
            color=""
            ref="typeRef"
            class="q-mt-md"
            label="请选择龙卡"
            filled
            :options="longkaList"
            option-value="code"
            option-label="label"
            v-model="form.type"
            emit-value
            map-options
            :rules="[(val) => !!val || '请选择龙卡']"
          />
          <q-input
            ref="friendLoginNameRef"
            class="q-mt-md"
            hide-bottom-space
            color=""
            filled
            v-model="form.friendLoginName"
            autocomplete="off"
            placeholder="请输入好友雷火账号"
            label="账号"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请输入好友雷火账号']"
          />
          <q-input
            ref="realNameRef"
            class="q-mt-md"
            hide-bottom-space
            color=""
            filled
            v-model="form.realName"
            autocomplete="off"
            placeholder="请输入好友真实姓名"
            label="姓名"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || '请输入好友真实姓名']"
          />
          <div style="text-align: center">
            <q-btn type="reset" class="common-btn q-mr-md">重置</q-btn>
            <q-btn type="submit" :loading="isSubmitting" class="bg-dyblue">提交</q-btn>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog align-center class="wonlongkaBox" v-model="isCardModal" :show-close="false">
      <span v-for="(longka, i) in longkaList" :key="i">
        <div v-if="cardWon === longka.code" class="wincontents">
          <div class="message">恭喜您获得一张: {{ longka.label }}</div>
          <div class="amount">
            <img :src="require(`../../../assets/images/promo/hotpromo/dragoncard/${longka.image}.png`)" />
          </div>
        </div>
      </span>
    </q-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { eventapi } from "boot/axios";
// import { tigerCardInit, getLeaderboard, getMemberCard, giveCardToFriend, synthesisCard } from "@/api/promo/tigerCard";
// import { ElMessage } from "element-plus";
import { useQuasar } from "quasar";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores/index";
import { useRouter } from "vue-router";
const router = useRouter();

const store = userStore();

const notify = useNotify();
const $q = useQuasar();

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
  eventapi.post("/tigerCard/init", qs.stringify({ promoCode: "lh1-dragon-card" })).then((res) => {
    if (res.code === 0) {
      cardInfo.cardDetail = res.data;
    }
  });
};

const loadRanking = () => {
  eventapi.post("/tigerCard/getLeaderboard").then((res) => {
    if (res.code === 0) {
      rankingPage.records = res.data;
    }
  });
};
const isPageLoading = ref(false);
const pageLoadingText = ref("");
const getNewTigerCard = () => {
  if (!store.token) {
    $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: 'primary',
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        router.push('/login');
      })
      return
  }
  isPageLoading.value = true;
  pageLoadingText.value = "正领取龙卡";
  eventapi.post("/tigerCard/getMemberCard", qs.stringify({ promoCode: "lh1-dragon-card" })).then((res) => {
    if (res.code === 0) {
      cardInfo.cardDetail[res.data.cardType] = cardInfo.cardDetail[res.data.cardType] + 1;
      isCardModal.value = true;
      cardWon.value = res.data.cardType;
      isPageLoading.value = false;
      notify({
        type: "success",
        message: "已领取龙卡",
      });
      pageInit();
    } else {
      notify({
        type: "error",
        message: res.message,
      });
    }
    isPageLoading.value = false;
  });
};

const compoundCard = () => {
  if (!store.token) {
    $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: 'primary',
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        router.push('/login');
      })
      return
  }
  isPageLoading.value = true;
  pageLoadingText.value = "正合成大奖卡";
  eventapi.post("/tigerCard/synthesisCard", qs.stringify({ promoCode: "lh1-dragon-card" })).then((res) => {
    if (res.code === 0) {
      pageInit();
      ElMessage.success({
        type: "success",
        message: "success"
      });
      isPageLoading.value = false;
    }
    isPageLoading.value = false;
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
onMounted(() => {
      if (!store.token) {
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
var qs = require("qs");
const longkaFormRef = ref();
const typeRef = ref(null);
const friendLoginNameRef = ref(null);
const realNameRef = ref(null);
const isSubmitting = ref(false);
const resetRegForm = (formEl) => {
  // longkaFormRef.value.resetValidation();
  form.type = null;
  form.realName = null;
  form.friendLoginName = null;
  typeRef.value.resetValidation();
  friendLoginNameRef.value.resetValidation();
  realNameRef.value.resetValidation();
};
const submitRegisterForm = async () => {
  if (!store.token) {
    $q.dialog({
        class: "q-px-md q-pt-md",
        title: "系统提示",
        message: "请登录后再操作",
        ok: {
          push: true,
          color: 'primary',
          label: "去登录",
          tabindex: 1
        },
        cancel: {
          push: true,
          color: 'warning',
          label: "取消",
          tabindex: 0
        },
        persistent: true,
      }).onOk(() => {
        router.push('/login');
      })
      return
  }
  typeRef.value.validate();
  friendLoginNameRef.value.validate();
  realNameRef.value.validate();

  if (typeRef.value.hasError || friendLoginNameRef.value.hasError || realNameRef.value.hasError) {
    // form has error
  } else {
    isSubmitting.value = true;
    form.promoCode = "lh1-dragon-card";
    eventapi.post("/tigerCard/giveCardToFriend", qs.stringify(form)).then((res) => {
      if (res.code === 0) {
        notify({
          type: "success",
          message: "成功",
        });
        isSubmitting.value = false;
      } else {
        notify({
          type: "error",
          message: res.message,
        });
      }
    });
    isSubmitting.value = false;
  }
};
const columns = [
  {
    label: "名次",
    field: "num"
  },
  {
    label: "用户名称",
    field: "name"
  },
  {
    label: "总卡数",
    field: "amount"
  }
];
</script>
<style lang="scss">
.tigercard-container {
  .q-table {
    &__empty-text p {
      color: #B97A89;
    }

    max-width: 650px;
    margin: 0 auto;

    background: white;
    border-radius: 10px;
    border: 0;
    color: #B97A89;

    th {
      text-align: center;
      line-height: 32px;
      color: #770202;
      font-weight: bold;
      background: #FFF3F4 !important;
      border: 1px solid #ECEDF0;

      &.q-table__cell {
        color: #B97A89;
        border-bottom: 1px solid #ECEDF0;
        background-color: white;

        &.is-leaf {
          border-bottom: 1px solid #ECEDF0;
        }
      }
    }

    td {
      border: 1px solid #ECEDF0 !important;

      &.q-table__cell {
        color: #B97A89;
        text-align: center;
        border: 0;
      }
    }
  }

  .q-table__bottom {
    color: #B97A89;

    .q-field__native {
      color: #B97A89;
    }

    .q-field__append {
      color: #B97A89;
    }
  }

  .q-pagination {
    margin: 10px auto;
    justify-content: center;

    .q-pager {
      pointer-events: none;
    }

    .q-pager li {
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
</style>
<style lang="scss">
body {
  .wonlongkaBox {
    width: 100%;
    height: 500px;
    background: none;
    background-size: contain;
    box-shadow: none;

    .wincontents {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      flex-direction: column;
      gap: 10px;

      .message {
        padding: 10px;
        font-size: 30px;
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

      .q-button {
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
</style>
<style scoped lang="scss">
.tigercard-container {
  margin: 0 auto;
  width: 100%;
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
  background: url(../../../assets/images/promo/hotpromo/dragoncard/bg_acc_pool.png) top no-repeat;
  background-size: contain;
  width: 100%;
  margin: 0 auto;
  height: 7rem;
}

.acc-pool-number {
  text-align: center;
  padding: 3.3rem 0 0rem;
  font-size: 1.6rem;
  line-height: 1.6rem;

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
  width: 100%;
  background-color: white;
}

.longka-wrap .longka-title {
  text-align: center;
  width: 100%;

  img {
    width: 100%;
  }
}

.longka-container {
  display: flex;
  margin-top: 1.5rem;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.longka-wrap .longka-footer {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
}

.card-tips {
  font-size: 15px;
  margin-top: 20px;
  // color: #fed985;
}

.redeem-tips {
  display: flex;
  justify-content: center;
  padding-left: 0px;
  margin-top: -10px;
  color: #87898a;
  font-size: 12px;
  margin-bottom: 20px;
}

.longka-list {
  display: flex;
  flex-direction: row;
  background: #fffbce;
  border: 1px solid #e3b457;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  gap: 1rem;
  padding: 1.5rem 1rem;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  flex: 2;

  .longka {
    position: relative;
    width: calc(25% - 9px);
    margin: 0 9px;
    cursor: pointer;
  }
}

.longka-btn {
  background: transparent url(../../../assets/images/promo/hotpromo/dragoncard/btn_bg.png) 50% no-repeat;
  background-size: cover;
  width: 140px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #5d450c;
  cursor: pointer;
}

.longka-take-btn {
  margin: 20px auto;
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
  border: 2px solid transparent;
  width: 100%;
  max-width: 100%;
}

.longka-list > div.longka-selected img {
  border: 2px solid #810203;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}

.longka-gold {
  padding: 0.2rem;
  flex: 1;
  gap: 20px;
  display: flex;
  flex-direction: column;
  width: 60%;
  background: #ffcf6f;
}

.longka-gold-inner {
  border: 1px solid #8a6b28;
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

  img {
    width: 100%;
  }
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

.longka-ranking-table thead td{
  background-color: #FFF3F4 !important;
}

.longka-ranking-table tr {
  line-height: 32px;
}

.longka-ranking-pagination {
  margin: 0 auto;
  padding-top: 0.5rem;
  color: #8a6b28;
}

.longka-ranking-pagination .next-page,
.longka-ranking-pagination .prev-page {
  cursor: pointer;
}

.bottom-content {
  margin-top: 30px;
}
</style>

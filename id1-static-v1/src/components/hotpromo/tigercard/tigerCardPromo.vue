<template>
  <div>
    <div class="tigercard-container">

    <div class="acc-pool-wrap">
        <div class="acc-pool">
            <div class="acc-pool-number">¥{{ cardInfo.cardDetail.setting.sumAward }}</div>
        </div>
    </div>
    <div class="text-center card-tips">已有{{ cardInfo.cardDetail.setting.cardCount }}人集齐,{{ cardInfo.cardDetail.setting.openStr }}开奖</div>
    <div class="text-center">
        <div class="huka-btn huka-take-btn waves-effect" @click="getNewTigerCard">领取虎卡</div>
    </div>

    <div class="content">
        <div class="huka-wrap">
            <div class="huka-title">
                <!-- <img src="../../../assets/images/promotion/hotpromo/tigercard/my-huka.png" alt=""> -->
            </div>
            <div class="huka-container">
                <div class="huka-list">
                  <div v-for="(huka, i) in hukaList" :key="i" :class="{ 'huka-selected': isSelected === huka.code }" class="huka" @click="selectHuka(huka)">
                    <!-- <img :src="require(`../../../assets/images/promotion/hotpromo/tigercard/${huka.image}.png`)" alt=""> -->
                    <div class="huka-own-count">{{ cardInfo.cardDetail[huka.code] }}</div>
                  </div>
                </div>
                <div class="huka-gold">
                    <div class="goldhu" style="position: relative">
                        <!-- <img src="../../../assets/images/promotion/hotpromo/tigercard/bonus.png" alt=""> -->
                        <div class="huka-own-count" style="right:4px;top:8px">{{ cardInfo.cardDetail.goldhu }}</div>
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
                <!-- <img src="../../../assets/images/promotion/hotpromo/tigercard/huka-ranking.png" alt=""> -->
            </div>

            <q-table
              :loading="rankingPage.loading"
              :columns="columns"
              :rows="rankingRecord()"
            >
            </q-table>
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
  <q-dialog align-center v-model="isGiftModal" title="赠送虎卡" width="500">
    <q-card class="q-pa-md" style="width: 100%">
    <q-form
      @submit="submitRegisterForm"
      @reset="resetRegForm"
      class="q-gutter-md"
    >
        <!-- <q-select color="white" filled v-model="form.type" placeholder="请选择虎卡" label="虎卡" :options="hukaList"

          option-value="id"
          option-label="name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || '请选择虎卡'
          ]"
        /> -->

        <q-select
          hide-bottom-space
          color="white"
          ref="typeRef"
          class="q-mt-md"
          label="请选择虎卡"
          filled
          :options="hukaList"
          option-value="code"
          option-label="label"
          v-model="form.type"
          emit-value
          map-options
          :rules="[(val) => !!val || '请选择虎卡']"
        />
        <q-input
          ref="friendLoginNameRef"
          class="q-mt-md"
          hide-bottom-space color="white" filled v-model="form.friendLoginName" autocomplete="off" placeholder="请输入好友兴發账号" label="账号"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入好友兴發账号']"  />
        <q-input
          ref="realNameRef"
          class="q-mt-md"
          hide-bottom-space color="white" filled v-model="form.realName" autocomplete="off" placeholder="请输入好友真实姓名" label="姓名"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入好友真实姓名']" />
      <div style="text-align: center">
        <q-btn type="reset" class="common-btn grey q-mr-md" color="#ff0000">
          重置
        </q-btn>
        <q-btn type="submit" :loading="isSubmitting" class="common-btn">
          提交
        </q-btn>
      </div>
    </q-form>
    </q-card>
  </q-dialog>
  <q-dialog align-center class="wonHukaBox" v-model="isCardModal" :show-close="false">
    <span v-for="(huka, i) in hukaList" :key="i">
    <div v-if="cardWon === huka.code" class="wincontents" >
    <div class="message">
      恭喜您获得一张: {{ huka.label }}
    </div>
    <div class="amount">
      <!-- <img :src="require(`../../../assets/images/promotion/hotpromo/tigercard/${huka.image}.png`)" /> -->
    </div>
    </div>
    </span>
  </q-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { eventapi } from "boot/axios"
// import { tigerCardInit, getLeaderboard, getMemberCard, giveCardToFriend, synthesisCard } from "@/api/promotion/tigerCard";
// import { ElMessage } from "element-plus";

const cardInfo = reactive({
  cardDetail: {
    setting: {}
  },
})

const rankingPage = reactive({
  current: 1,
  pageSize: 2,
  records: [],
  loading: false,
})

const rankingRecord = () => {
  return rankingPage.records.filter((item, index) => index < rankingPage.current * rankingPage.pageSize && index >= (rankingPage.pageSize * (rankingPage.current - 1)))
}

const pageNumChange = (i) => {
  rankingPage.current = i
}

const pageInit = () => {
  eventapi.post("/tigerCard/init", qs.stringify({promoCode: "xf1-tiger-card"})).then((res) => {
    if(res.code === 0) {
      cardInfo.cardDetail = res.data
    }
  })
}

const loadRanking = () => {
  eventapi.post("/tigerCard/getLeaderboard").then((res) => {
    if(res.code === 0) {
      rankingPage.records = res.data
    }
  })
}
const isPageLoading = ref(false)
const pageLoadingText = ref('');
const getNewTigerCard = () => {
  isPageLoading.value = true
  pageLoadingText.value = "正领取虎卡"
  eventapi.post("/tigerCard/getMemberCard", qs.stringify({promoCode: "xf1-tiger-card"})).then((res) => {
    if(res.code === 0) {
      cardInfo.cardDetail[res.data.cardType] = cardInfo.cardDetail[res.data.cardType] + 1
      isCardModal.value = true;
      cardWon.value = res.data.cardType
      isPageLoading.value = false
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      })
    }
  })
  isPageLoading.value = false
}

const compoundCard = () => {
  isPageLoading.value = true
  pageLoadingText.value = "正合成大奖卡"
   eventapi.post("/tigerCard/synthesisCard", qs.stringify({promoCode: "xf1-tiger-card"})).then((res) => {
    if(res.code === 0) {
      pageInit()
      ElMessage.success({
        type: "success",
        message: "成功"
      })
      isPageLoading.value = false
    }
    isPageLoading.value = false
  })
}

const hukaList = ref([
  {
    code: 'hongyunhu',
    image: 'hyh',
    count: 0,
    label: '鸿运虎'
  },
  {
    code: 'jilihu',
    image: 'jlh',
    count: 0,
    label: '吉利虎'
  },
  {
    code: 'pinganhu',
    image: 'pah',
    count: 0,
    label: '平安虎'
  },
  {
    code: 'ruyihu',
    image: 'ryh',
    count: 0,
    label: '如意虎'
  },
  {
    code: 'xinyunhu',
    image: 'xyh',
    count: 0,
    label: '幸运虎'
  }
]);
const isSelected = ref('xinyunhu');
const selectHuka = (huka) => {
  isSelected.value = huka.code
}

const isGiftModal = ref(false);
const isCardModal = ref(true);
const cardWon = ref('')
onMounted(() => {
  pageInit();
  loadRanking();
})
const formLabelWidth = '140px'

const form = reactive({
  friendLoginName: null,
  realName: null,
  type: null
})

const sendRules = {
  friendLoginName: [
    {
      required: true,
      message: "请输入好友账户名",
      trigger: "blur",
    },
  ],
  realName: [
    {
      required: true,
      message: "请输入好友真实姓名",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择虎卡",
      trigger: "change",
    },
  ],
}
var qs = require('qs')
const hukaFormRef = ref();
const typeRef = ref(null);
const friendLoginNameRef = ref(null);
const realNameRef = ref(null);
const isSubmitting = ref(false);
const resetRegForm = (formEl) => {
  // hukaFormRef.value.resetValidation();
  form.type = null
  form.realName = null
  form.friendLoginName = null
  typeRef.value.resetValidation()
  friendLoginNameRef.value.resetValidation()
  realNameRef.value.resetValidation()
}
const submitRegisterForm = async () => {
  typeRef.value.validate()
    friendLoginNameRef.value.validate()
    realNameRef.value.validate()

  if (typeRef.value.hasError || friendLoginNameRef.value.hasError || realNameRef.value.hasError) {
    // form has error
  } else {
    isSubmitting.value = true;
    form.promoCode = "xf1-tiger-card"
    eventapi.post("/tigerCard/giveCardToFriend",qs.stringify(form)).then((res) => {
      if(res.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "成功",
          icon: "check_circle_outline"
        });
        isSubmitting.value = false;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    isSubmitting.value = false;
  }
}
const columns = [
  {
    label: "名次",
    field: "num"
  },
  {
    label: "用户名称",
    field: "name",
  },
  {
    label: "总卡数",
    field: "amount",
  }
]

</script>
<style lang="scss">
.tigercard-container {
  .q-table {
    &__empty-text p {
      color: #ffd97f;
    }
    max-width: 650px;
    margin: 0 auto;

    background: #1d212e;
    border-radius: 10px;
    border: 0;
  th {
    text-align: center;
    line-height: 32px;
    &.q-table__cell {
      color: #ffd683;
    border-bottom: 1px solid #ffd97f;
  background-color: #1d212e;
  &.is-leaf {
    border-bottom: 1px solid #ffd97f;
  }
  }
  }
  td {
    &.q-table__cell {
      color: #ffd683;
      text-align: center;
      border: 0;
    }
  }
  }
  .q-pagination {
    margin: 10px auto;
    justify-content: center;
    .q-pager {
      pointer-events: none;
    }
    .q-pager li {
      color: #ffd97f;
      min-width: unset;
      &.btn-quicknext {
        svg {
          display: none;
        }
      }
    &.is-active, &:hover {
      &:after {
        content: "/";
        display: inline-block;
        margin-left: 8px;
      }
      color: #ffd87f;
    }
    }
    button:hover {
      color: #ffd87f;
    }
  }
}
</style>
<style lang="scss">
 body {

  .wonHukaBox {
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
	background: url(https://eqwp2f.sdwukong.com/resource/es/img/bg_acc_pool.fbe0afb3.png) top no-repeat;
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
	background: linear-gradient(180deg,#fffcc6 50%,#ffc760);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.huka-wrap {
	display: inline-block;
	padding: 1.5rem;
  width: 100%;
	background-color: #1d212e;
}

.huka-wrap .huka-title {
	text-align: center;
  width: 100%;
  img {
    width: 100%;
  }
}

.huka-container {
	display: flex;
	margin-top: 1.5rem;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.huka-wrap .huka-footer {
	margin-top: 1rem;
	display: flex;
  gap: 10px;
	justify-content: space-evenly;
}

.card-tips {
	font-size: 15px;
	margin-top: 20px;
	color: #fed985;
}

.huka-list {
	display: flex;
	flex-direction: row;
	background: #11141c;
	border: 1px solid #3b435c;
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
     .huka{
	position: relative;
  width: calc(25% - 9px);
	margin: 0 9px;
	cursor: pointer;
}
}

.huka-btn {
	background: transparent url(https://eqwp2f.sdwukong.com/resource/es/img/btn_bg.906067a0.png) 50% no-repeat;
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

.huka-take-btn {
	margin: 20px auto;
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

.huka-list>div img {
	border: 2px solid transparent;
	width: 100%;
	max-width: 100%;
}

.huka-list>div.huka-selected img{
	border: 2px solid #ffd200;
	-webkit-border-radius: 6px;
	-moz-border-radius: 6px;
	border-radius: 6px;
}

.huka-gold {
	padding: .2rem;
  flex: 1;
  gap: 20px;
  display: flex;
  flex-direction: column;
  width: 60%;
}
.huka-gold-inner {
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
  img {
    width: 100%;
  }
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
	padding-top: .5rem;
	color: #ffd97f;
}

.huka-ranking-pagination .next-page,.huka-ranking-pagination .prev-page {
	cursor: pointer;
}

</style>

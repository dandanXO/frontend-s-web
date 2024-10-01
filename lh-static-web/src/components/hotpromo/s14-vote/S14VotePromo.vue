<template>
  <div>
     <!-- Tab headers -->
     <div class="tabs-header">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.period"
        :class="{ active: activeTab === tab.period }"
        @click="checkPeriod(tab.period)"
        class="tab-item"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="dates">
      <div class="column">
        <span class="title">瑞士轮阶段：</span>10月3日-7日；10月10日-13日
      </div>
      <div class="column">
        <span class="title">淘汰赛阶段：</span>10月17日-20日，10月26日-27日
      </div>
      <div class="column">
        <span class="title">冠亚军决赛：</span>11月2日
      </div>
    </div>

    <!-- Tab content -->
    <div class="tabs-content">
      <div v-if="activeTab === 1">
        <div class="center-numbers">
          <!--<div class="center-title">总奖金</div>-->
          <div id="prizePool" class="center-number">
            {{ convertToCommaAmount(votesData.award) }}
            <!-- <img style="max-height: 74px;" src="../s14-vote/images/2k.png"> -->
            <img style="max-height: 40px; margin-top: 15px;" src="../s14-vote/images/reward.png">
          </div>
        </div>
        
        <div class="main-title-box">活动详细阶段与队伍：投票分为3阶段，每一阶段结算一次</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-list" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="votesListItem in votesData.votesList">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
                <div class="c-name">{{ votesListItem.teamNameLocal }}</div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 1 ? votesListItem.votes-- : null">-</div>
                
                <!-- Input for the number of votes (bound to the specific list item) -->
                <el-form :model="votesListItem">
                  <el-form-item prop="votes">
                    <el-input-number :controls="false" v-model="votesListItem.votes" min="1" max="10" />
                  </el-form-item>
                </el-form>
                
                <!-- Vote increment button -->
                <div class="btn" @click="votesListItem.votes < 10 ? votesListItem.votes++ : null">+</div>
              </div>
              <div class="c-button"  @click.prevent="submit(votesListItem)">投票</div>
            </div>
          </div>
        </div>
        <!-- <div class="main-title-box">瑞士轮阶段活动投票时间：10.03~10.13</div>
        <div class="table">
          <div class="table-header">
            <div class="table-headertext">
              BO1瑞士轮参与队伍：16支队伍中选8支队伍进入淘汰赛
            </div>
          </div>
          <div class="table-content">
            <table>
                <tr>
                  <td>BLG</td>
                  <td>TES</td>
                  <td>LNG</td>
                  <td>WBG</td>
                </tr>
                <tr>
                  <td>GEN</td>
                  <td>HLE</td>
                  <td>DK</td>
                  <td>T1</td>
                </tr>
                <tr>
                  <td>G2</td>
                  <td>FNC</td>
                  <td>FLY</td>
                  <td>TL</td>
                </tr>
                <tr>
                  <td>入围赛晋级队伍1</td>
                  <td>入围赛晋级队伍2</td>
                  <td>入围赛晋级队伍3</td>
                  <td>入围赛晋级队伍4</td>
                </tr>
            </table>
          </div>
        </div> -->
      </div>
      <div v-if="activeTab === 2">
        <div class="center-numbers">
          <!--<div class="center-title">总奖金</div>-->
          <div id="prizePool" class="center-number">
            {{ convertToCommaAmount(votesData.award) }}
            <!-- <img style="max-height: 74px;" src="../s14-vote/images/2k.png"> -->
            <img style="max-height: 40px; margin-top: 15px;" src="../s14-vote/images/reward.png">
          </div>
        </div>
        
        <div class="main-title-box">活动详细阶段与队伍：投票分为3阶段，每一阶段结算一次</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-list" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="votesListItem in votesData.votesList">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
                <div class="c-name">{{ votesListItem.teamNameLocal }}</div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 1 ? votesListItem.votes-- : null">-</div>
                
                <!-- Input for the number of votes (bound to the specific list item) -->
                <el-form :model="votesListItem">
                  <el-form-item prop="votes">
                    <el-input-number :controls="false" v-model="votesListItem.votes" min="1" max="10" />
                  </el-form-item>
                </el-form>
                
                <!-- Vote increment button -->
                <div class="btn" @click="votesListItem.votes < 10 ? votesListItem.votes++ : null">+</div>
              </div>
              <div class="c-button"  @click.prevent="submit(votesListItem)">投票</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 3">
        <div class="center-numbers">
          <!--<div class="center-title">总奖金</div>-->
          <div id="prizePool" class="center-number">
            {{ convertToCommaAmount(votesData.award) }}
            <!-- <img style="max-height: 74px;" src="../s14-vote/images/2k.png"> -->
            <img style="max-height: 40px; margin-top: 15px;" src="../s14-vote/images/reward.png">
          </div>
        </div>
        
        <div class="main-title-box">活动详细阶段与队伍：投票分为3阶段，每一阶段结算一次</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-final" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="votesListItem in votesData.votesList.slice(0, 2)">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }}票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 1 ? votesListItem.votes-- : null">-</div>
                
                <!-- Input for the number of votes (bound to the specific list item) -->
                <el-form :model="votesListItem">
                  <el-form-item prop="votes">
                    <el-input-number :controls="false" v-model="votesListItem.votes" min="1" max="10" />
                  </el-form-item>
                </el-form>
                
                <!-- Vote increment button -->
                <div class="btn" @click="votesListItem.votes < 10 ? votesListItem.votes++ : null">+</div>
              </div>
              <div class="c-button"  @click.prevent="submit(votesListItem)">投票</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="main-title-box">{{selectedDate}}</div>
        <div class="table">
          <div class="table-header">
            <div class="table-headertext">
              {{selectedTitle}}
            </div>
          </div>
          <div class="table-content">
            <table>
              <tr v-for="(row, rowIndex) in teamRows" :key="rowIndex">
                <td v-for="(team, index) in row" :key="team.id">
                  {{ team.teamNameLocal }}
                </td>
              </tr>
            </table>
          </div>
        </div>
    </div>
    <div class="column">
      <div class="main-title-box">获取投票</div>
      <div class="sub-title">
          活动期间，根据对应档位条件获取票数后投给任意队伍，若投票的队伍晋级后即可瓜分奖金池彩金；
      </div>
      <div class="table">
        <div class="table-header">
          <div class="table-headertext">
            注：获得的投票票数可在活动期间时间段内任意投票，活动结束后，票数清零；
          </div>
        </div>
        <div class="table-content">
          <table>
              <tr>
                <td>单笔存款</td>
                <td>获得票数</td>
                <td>票数上限</td>
              </tr>
              <tr>
                <td>每日登陆</td>
                <td>1</td>
                <td>1</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>1</td>
                <td>3</td>
              </tr>
              <tr>
                <td>≥500</td>
                <td>1</td>
                <td>5</td>
              </tr>
              <tr>
                <td>≥1,500</td>
                <td>2</td>
                <td>12</td>
              </tr>
              <tr>
                <td>≥3,000</td>
                <td>5</td>
                <td>35</td>
              </tr>
              <tr>
                <td>≥5,000</td>
                <td>9</td>
                <td>72</td>
              </tr>
              <tr>
                <td>≥10,000</td>
                <td>20</td>
                <td>200</td>
              </tr>
          </table>
        </div>
      </div>
      <RouterLink to="/center/deposit" class="votebtn">
        <img src="../s14-vote/images/votebtn.png">
      </RouterLink>
    </div>
    <div class="column">
      <div class="main-title-box">活动规则</div>
      <div class="terms">
        <ol>
          <li>活动期间，根据对应条件可获得对应票数，获得的票数可以给任意队伍进行投票，当日完成投票需求即可再活动页面点击【点击领取】领取票数，对应档位当日票数已达至所获票数数量上限则无法继续获得；</li>
          <li>奖金池结算：（1,000,000➗晋级队伍总票数）*用户投票数量=投票彩金。彩金于赛事阶段结束后次日24小时内派发，彩金3倍流水即可提款；</li>
          <li>例：用户投注BLG队伍100票，BLG队伍再此阶段晋级并且BOG队伍总共获得150,000票，那么用户可获得（1,000,000➗150000）*100=666.7元彩金；</li>
          <li>根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；</li>
          <li>此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；</li>
          <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ol>
      </div>
    </div>

    <!-- <el-dialog align-center v-model="isCastVoteModalVisible" :title="castVoteFormData.teamNameLocal" width="500">
      <el-form :rules="castVoteFormValidationRules" ref="castVoteFormRef" style="padding: 20px;"
               :model="castVoteFormData">
        <el-form-item prop="votes" label="投票数量" :label-width="formLabelWidth">
          <el-input v-model="castVoteFormData.votes" type="number" min="1" max="10" />
        </el-form-item>
        <div style="text-align: center">
          <el-button class="common-btn grey" color="#ff0000" @click="castVoteFormData.votes = '1'">
            重置
          </el-button>
          <el-button :loading="isSubmitting" class="common-btn" @click.prevent="submit(castVoteFormRef)">
            提交
          </el-button>
        </div>
      </el-form>
    </el-dialog> -->

    <el-dialog align-center v-model="isVoteRecordModalVisible" width="450" style="background: unset;">
      <div class="cast-vote-container">
        <div class=title>投票记录</div>
        <div class="vote-records">
          <table class="table-titles">
            <tr>
              <th>队伍</th>
              <th>时间</th>
              <th>票数</th>
            </tr>
            <tr v-for="(voteRecord, voteIndex) in paginatedVoteRecords" :key="voteIndex">
              <td>{{ voteRecord.teamNameLocal }}</td>
              <td>{{ moment(voteRecord.voteTime, 'M/D/YY, h:mm A').format('YYYY年M月D日HH:mm') }}</td>
              <td style="font-family: 'HYYakuHei800'; color:#70CBFB;">{{ voteRecord.votes }} 票</td>
            </tr>
          </table>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            class="vote-record-pagination"
            v-model:current-page="votesData.votesRecord.current"
            :page-size="votesData.votesRecord.pageSize"
            :small="small"
            background
            layout="total, prev, next"
            :hide-on-single-page="true"
            :total="votesData.votesRecord.data.length"
          />
          <div class="page-info">
            {{ votesData.votesRecord.current + '/' + totalPages }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "@/api/promotion/poolPrizeVote";
import { convertToCommaAmount } from "@/utils/utils";
import { userStore } from "@/store/index";
import { useLocalStorage } from "@vueuse/core";
import { useNotify } from "@/hooks/notify";
import { RouterLink } from "vue-router";
import moment from "moment";

// Store and Notify hooks
const store = userStore();
const notify = useNotify();

// Image URL from local storage
const imgURL = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

// Form validation rules
const castVoteFormValidationRules = {
  votes: [
    { required: true, message: "请输入投票数量", trigger: "blur" },
    { pattern: "^([1-9]|1[0])$", message: "投票数量只能输入1-10之内的数字", trigger: "blur" }
  ]
};

// Refs and reactive data
const activeTab = ref(1);
const isSubmitting = ref(false);
const isCastVoteModalVisible = ref(false);
const isVoteRecordModalVisible = ref(false);
const castVoteFormRef = ref(null);
const castVoteFormData = reactive({
  teamId: undefined,
  teamName: '',
  teamNameLocal: '',
  votes: '1'
});

const votesData = ref({
  award: 0,
  myVotes: 0,
  votesList: [],
  votesRecord: {
    data: [],
    pageSize: 6,
    current: 1
  }
});

// Tabs data
const tabs = [
  { label: "瑞士轮", period: 1, date: '瑞士轮阶段活动投票时间：10.03~10.13', tabtitle: 'BO1瑞士轮参与队伍：16支队伍中选8支队伍进入淘汰赛' },
  { label: "淘汰赛", period: 2, date: '淘汰赛阶段活动投票时间：10.17~10.27', tabtitle: 'BO5淘汰赛参与队伍：8支队伍中选2支队伍进入冠亚决赛' },
  { label: "冠亚赛", period: 3, date: '冠亚赛阶段活动投票时间：11.02~11.02', tabtitle: 'BO5冠亚赛参与队伍：2支队伍中选1支队伍得冠' }
];

// Function to handle casting votes
const castVote = ({ teamId, teamName, teamNameLocal }) => {
  isCastVoteModalVisible.value = true;
  castVoteFormData.teamId = teamId;
  castVoteFormData.teamName = teamName;
  castVoteFormData.teamNameLocal = teamNameLocal;
};

// Submit vote function
const submit = async (voteData) => {

    if (Number(voteData.votes) > votesData.value.myVotes) {
      notify({ type: "error", message: "投票次数不足" });
      return;
    }
      isSubmitting.value = true;
      const params = { teamId: voteData.id, votes: Number(voteData.votes) };
      const res = await poolPrizeCastVote(params);
      if (res.code === 0) {
        notify({ type: "success", message: "投票成功" });
        isCastVoteModalVisible.value = false;
        if (votesData.value.myVotes > 0) votesData.value.myVotes--;
        setTimeout(() => loadVoteTeam(), 2000);
      } else {
        notify.error(res.message);
      }
      isSubmitting.value = false;
};

// Load voting data
const loadVoteTeam = () => {
  poolPrizeVoteInit().then((res) => {
    if (res.code === 0) {
      activeTab.value = res.data.period;
      const votesRecord = res.data.votesRecord.flatMap((voteRecordItem) => {
        const { countryImgUrl, teamNameLocal } = res.data.votesList.find(({ id }) => voteRecordItem.teamVotesId === id);
        return Array(voteRecordItem.votes).fill({ ...voteRecordItem, countryImgUrl, teamNameLocal });
      });
      const votesList = res.data.votesList.map((team) => {
        return {
          ...team,
          votes: 1 // Initialize each team's votes to 1
        };
      });
      votesData.value = {
        ...res.data,
        votesList: votesList,
        votesRecord: { ...votesData.value.votesRecord, data: votesRecord }
      };
    }
  });
};

const paginatedVoteRecords = computed(() => {
  const votesRecord = votesData.value.votesRecord;
  return votesRecord.data.slice((votesRecord.current - 1) * votesRecord.pageSize, votesRecord.current * votesRecord.pageSize);
});

const teamRows = computed(() => {
  const rows = [];
  if (activeTab.value === 2) {
    for (let i = 0; i < 8; i += 4) {
      rows.push(votesData.value.votesList.slice(i, i + 4));
    }
  } else if (activeTab.value === 3) {
    rows.push(votesData.value.votesList.slice(0, 2));
  } else {
    for (let i = 0; i < votesData.value.votesList.length; i += 4) {
      rows.push(votesData.value.votesList.slice(i, i + 4));
    }
  }
  return rows;
});

const selectedTabDetails = computed(() => {
  return tabs.find(tab => tab.period === activeTab.value) || {};
});

const selectedDate = computed(() => selectedTabDetails.value.date);
const selectedTitle = computed(() => selectedTabDetails.value.tabtitle);

const totalPages = computed(() => {
  return Math.ceil(votesData.value.votesRecord.data.length / votesData.value.votesRecord.pageSize);
});

const isClickable = ref(true); 
const checkPeriod = (tabClicked) => {
  if (!isClickable.value) return; // Prevent clicks if not clickable
  if (tabClicked > activeTab.value) {
    notify({ type: "error", message: "该赛段暂未开启" });
  } else if (tabClicked < activeTab.value) {
    notify({ type: "error", message: "该赛段已结束" });
  }
  // Disable clicking for 2 seconds
  isClickable.value = false;
  setTimeout(() => {
    isClickable.value = true; // Re-enable clicking after 2 seconds
  }, 2000);
}
onMounted(() => {
  if (!store.token) return;
  loadVoteTeam();
});
</script>

<style lang="scss">
.cast-vote-container {
  height: 296px;
  background: url(images/dialogbg.png)no-repeat center center;
  .el-pagination.is-background .el-pager li, .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
    // border: 2px solid #fff;
    // width: 32px;
    // height: 32px;
    // border-radius: 4px;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // color: #fff;
    // background-color: transparent;
    
    border: 0;
    background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%);

      margin-top: 5px;
  }
    .el-pagination.is-background .btn-prev:disabled,
    .el-pagination.is-background .btn-next:disabled {
      background: #0E3B87;
      color: #FFFFFF80;
    }
  .el-pagination__total {
    color: #fff;
    display: none;
  }

  .el-pagination.is-background .el-pager li.is-active {
    background: unset;
    border: 1px solid #ffffff;
    font-weight: bold;
    color: #ffffff;
  }
}

.el-dialog {
  /* For WebKit browsers (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 8px; /* Simplified width */
  }

  ::-webkit-scrollbar-thumb {
    background-color: #70CBFB; /* Simplified color */
  }

  /* For Firefox */
  * {
    scrollbar-width: thin; /* Simplified width */
    scrollbar-color: #70CBFB transparent; /* Thumb color, no track background */
  }
}
</style>

<style scoped lang="scss">
.top-tabs {
  width: 100%;
}

.tabs-header {
  display: flex;
  background: url(images/tabbg.png)no-repeat center center;
  background-size: contain;
  height: 70px;
  justify-content: flex-start;
  align-items: center;
  max-width: 700px;
  margin: 0 auto;
}

.tab-item {
    border-radius: 5px 5px 0 0;
    cursor: pointer;
    height: 40px;
    width: 23%;
    margin-top: 5px;
    margin-left: 25px;
    color: #52ACFF;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
    font-weight: bold;
}

.tab-item.active {
  color: #ffffff;
  background: url(images/activetab.png)no-repeat center center;
  background-size: cover;
}

.tabs-content {
  padding: 20px;
  font-size: 20px;
  font-family: 'HYYakuHei800';
}
.dates {
  display: flex;
  max-width: 1250px;
  gap: 20px;
  margin: 20px auto 0;
  justify-content: center;
  .column {
    background: url(images/dateborder.png)no-repeat left center;
    background-size: cover;
    padding: 12px;
    color: #8DC6FF;
    font-size: 18px;
    span {
      color: #ffffff;
    }
  }
}

.cast-vote-container {
  font-family: PingFang SC;
  margin: -15px;

  .title {
    text-align: left;
    background: linear-gradient(180deg, #FFFFFF 51.04%, #5AB0FF 100%);
    padding: 5px 10px;
    font-family: 'HYYakuHei800';
    font-size: 25px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .vote-records {
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    // gap: 10px;
    padding: 0 10px;
    color: #ffffff;
    overflow: auto;
    height:190px;
    table {
      width: 100%;
      text-align: center;
    }
    .table-titles {
      td, th {
        padding: 10px;
      }
      tr:first-child {
        position: sticky;
        top: 0;
        background: url(images/tblbg.png)no-repeat center center;
        background-size: contain;
        background-color: #002a4d;
      }
    }

    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }

    .vote-record-item {
      background-color: #0A243E;
      border: 2px solid #00EAFE4D;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      color: #fff;
      padding: 15px;
      gap: 40px;

      .vote-record-flag-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;

        .vote-record-item-flag {
          width: 35px;
          height: 25px;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin: 5px auto;
    .page-info {
      color: #ffffff;
      padding-right: 15px;
    }
  }
}
.center-numbers {
  margin: 0px auto;
  position: relative;
  max-width: 915px;
  background: url("images/prizepool.png") no-repeat center center;
  background-size: contain;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'DIN';
}


.winner-bar {
  background: conic-gradient(from 0deg at 50% 50%, #FFFFFF 0deg, #C7D0D4 76.84deg, #4F5F68 89.71deg, #2C3443 180deg, #4F6468 268.86deg, #C7CFD4 282.59deg, #FFFFFF 360deg);
  padding: 3px;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
  &__bg {
    border-radius: 15px;
    padding: 3px;
    background: linear-gradient(90deg, #0C8AFF 0%, #00F5E6 50%, #0C8AFF 100%);
  }
  &__inner {
    background: #070030;
    border: 1px solid #000000;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 15px;
  }
  &__text {
    background: linear-gradient(180deg, #03C3FF 0%, #B8EEFF 50%, #03C3FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: 600;
    line-height: 33.6px;

  }

}
.promo-title{
  text-align: center;
  width:100%;

  img{
    width: 750px;
  }
}

.content-info-item{
  color: #fff;
  margin-bottom: 10px;
}

.content-info{
  font-size: 16px;
  width: 1200px;
  margin: 10px auto;
}

.promo-rules-div{
  width: 1200px;
  margin: 10px auto;
  background-image: url("../s14-vote/images/rule-board.png");
  padding: 40px 20px;
  background-size: 100% 100%;

  p{
    color: #fff;
    font-size: 16px;
    margin-bottom: 14px;
  }
}

.content-table{
  color: #fff;
  width: 1200px;
  border-collapse: collapse;
  margin: 20px auto 50px;
  font-size: 18px;

  th, td {
    border: 1px solid #fff;
    padding: 12px 10px;
    text-align: center;
  }

  thead{
    background: linear-gradient(180deg, #00E9FE 0%, #0A8AFF 100%);
    color:#102628;
  }
}

.center-numbers .center-title {
  margin-left: 60px;
  font-size: 72px;
  line-height: 72px;
  font-weight: bold;
  color: #fff;
}

.center-numbers .center-number {
  margin-left: 6px;
  font-weight: bold;
  font-family: 'HYYAKUHEI800';
  color: #FFCF02;
  text-shadow: 4px 0px #FC8025;
  font-size: 72px;
  font-weight: 700;
  line-height: 72px;
  text-align: left;
  gap: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

}
.main-title-box {
  background: url(images/headerbg.png)no-repeat left center;
  background-size: contain;
  height: 50px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffffff;
  padding-left: 30px;
  font-weight: bold;
  font-size: 22px;
  padding-top: 5px;
  &:before {
    left: -30px;
    top: 15px;
    background: url(images/smtri.png)no-repeat center center;
    position: absolute;
    width: 20px;
    height: 20px;
    background-size: contain;
    content: "";
  }
}
.sub-title {
  font-size: 20px;
  color: #ffffff;
  margin: 15px auto;
  max-width: 1200px;
}
// .column {
//   margin: 15px auto 40px;
// }
.terms {
  font-family: 'HYYakuHei300';
  font-size: 20px;
  line-height: 45px;
  color: #ffffff;
  margin: 15px auto;
  max-width: 1200px;
  background: url(http://localhost:8090/static/img/box.eadefdb4.png) no-repeat center center;
    background-size: 100% 100%;
    padding: 20px 30px 20px 20px;
}

.table {
  max-width: 1200px;
  margin: 20px auto;
  background: url(images/box.png)no-repeat center center;
  background-size: 100% 100%;
  font-size: 20px;
  .table-content {
    padding: 10px;
    font-family: "HYYakuHei300";
  table {
    width: 100%;
    text-align: center;
    color: #ffffff;
    tr {
      &:first-child {
        td {
          border-top: 0;
        }
      }
      &:last-child {
        td {
          border-bottom: 0;
        }
      }
      td {
        padding: 10px;
        border: 1px solid #11234F;
        &:first-child {
          border-left: 0;
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  }
}
.table-header {
  font-family: "HYYakuHei400";
  background: url(images/tblheaderbg.png)no-repeat center center;
  min-height: 50px;
  padding: 10px 20px;
  .table-headertext {
    padding-left: 20px;
    font-size: 20px;
    background: linear-gradient(180deg, #FFFFFF 0%, #E8F8FF 69.55%, #0066FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.votebtn {
  max-width: 215px;
  margin: 0 auto;
  display: flex;
  img {
    width: 100%;
  }

}
.teams-wrapper {
  background: #00192B33;
  background: url(images/box.png)no-repeat center center;
  background-size: 100% 100%;
  max-width: 1200px;
  margin: 20px auto;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .point {
      font-family: "HYYakuHei400";
    font-size: 20px;
    padding-left: 20px;
    background: linear-gradient(180deg, #E8F8FF 49.55%, #0066FF 100%);

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .blue {
      color: #69B4FF;
    }
  }
  }
}


//.pattern-wrapper:before,
//.pattern-wrapper:after,
//.pattern-wrapper-bottom:before,
//.pattern-wrapper-bottom:after {
//  background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
//  background-repeat: no-repeat;
//  background-position: center center;
//  background-size: 14px 14px;
//  content: "";
//  width: 14px;
//  height: 14px;
//  display: inline-block;
//  position: absolute;
//}

.pattern-wrapper:before {
  transform: rotateZ(0deg);
  top: 0;
  left: 0;
}

.pattern-wrapper:after {
  transform: rotateZ(90deg);
  top: 0;
  right: 0;
}

.pattern-wrapper-bottom:before {
  transform: rotateZ(270deg);
  bottom: 0;
  left: 0;
}

.pattern-wrapper-bottom:after {
  transform: rotateZ(180deg);
  bottom: 0;
  right: 0;
}

.teams-wrapper .right-count {
  text-align: right;
  margin-top: -25px;
  font-weight: normal;
  color: #fff;
  span {
    color: #00E9FE;
  }

  .vote-record-btn {
    cursor: pointer;

    &:hover {
      color: #b4f9ff;
    }
  }
}

.teams-wrapper .teams-list {
  display: grid;
  gap: 5px;
  padding: 5px;
  grid-template-columns: repeat(10, 1fr);
}

.teams-wrapper .teams-list .teams-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  overflow: hidden;
  position: relative;
  font-family: "HYYakuHei400";
}
.teams-wrapper .teams-final {
  background: url(images/vsbg.png) no-repeat center 40%;
  height: 270px;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 150px;
  background-size: contain;
  margin: 20px auto;
  .teams-item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    overflow: hidden;
    position: relative;
    font-family: "HYYakuHei400";
      .c-flagname {
        padding: 5px 0px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row-reverse;
        width: 100%;
        gap: 40px;
        font-family: 'YouSheBiaoTiHei';
        font-weight: normal;
    }
    .c-price {
      background: linear-gradient(180deg, #FFFFFF 0%, #CAE2FF 74.24%, #8FACD7 102.38%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: #ffffff;
      background-clip: text;
      // text-shadow: 20px 45px #000000AA;
      text-shadow: 20px 35px rgba(0, 0, 0, 0.4); 
      font-size: 58px;
      padding-right: 15px;
    }
    .flexcast {
      width: unset;
    }
    &:first-child {
      align-items: flex-end;
      .c-flagname {
        flex-direction: row-reverse;
      }
    }
    &:last-child {
      align-items: flex-start;
      .c-flagname {
        flex-direction: row;
      }

    }
    .c-button {
      border: 0.82px solid #2B9EFF;
      padding: 5px 20px;
      border-radius: 4px;
      background: #0075FF29;
      display: block;
      margin-top: 10px;
      width: 80%;
      text-align: center;
      color: #ffffff;
      line-height: 16px;
      font-family: 'PingFang SC';
    max-width: 90px;
    }
    
  .c-flag {
    // background: #eeeee4;
    // border: 5px solid #53ABFF;
    // border-radius: 50%;
    height: 80px;
    width: 80px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }

  }
}

// .teams-wrapper .teams-list .teams-item:before,
// .teams-wrapper .teams-list .teams-item:after,
// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:before,
// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:after {
//   background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
//   background-repeat: no-repeat;
//   background-position: center center;
//   background-size: 12px 12px;
//   content: "";
//   width: 12px;
//   height: 12px;
//   display: inline-block;
//   position: absolute;
// }

// .teams-wrapper .teams-list .teams-item:before {
//   transform: rotateZ(0deg);
//   top: 0;
//   left: 0;
// }

// .teams-wrapper .teams-list .teams-item:after {
//   transform: rotateZ(90deg);
//   top: 0;
//   right: 0;
// }

// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:before {
//   transform: rotateZ(270deg);
//   bottom: 0;
//   left: 0;
// }

// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:after {
//   transform: rotateZ(180deg);
//   bottom: 0;
//   right: 0;
// }

.teams-wrapper .teams-list .c-button:hover {
  // background-color: #ffffff;
  // border-radius: 10px;
  // color: #498BCB;
  background: #0037ff4a;

}

.teams-wrapper .teams-list .teams-item .c-flagname {
  background: #00F0FF0D;
  padding: 5px 0px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 5px;

}
.teams-wrapper .teams-list .teams-item .c-flag {
  // background: #eeeee4;
  // border: 5px solid #53ABFF;
  // border-radius: 50%;
  height: 80px;
  width: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.teams-wrapper .teams-list .teams-item .c-flag img {
  max-width: 100%;
  max-height: 100%;
  /* border: 1px solid #d4c164; */
}

.teams-wrapper .teams-list .teams-item .c-name {
  color: #fff;
  font-weight: normal;
}
.flexcast {
  display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    margin: 10px 0 auto;
    width: 80%;
    text-align: center;
  .btn {
    background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%);
    color: #ffffff;
    padding: 3px 5px;
    border-radius: 3px;
    width: 23px;
  }
  :deep(.el-input__wrapper) {
    background: unset;
    color: #ffffff;
    border: 0;
    box-shadow: none;
    text-align: center;
    padding: 0;
  }
  .el-form {
    width: 40px;
  }
  .el-form-item {
    margin-bottom: 0;
    :deep(.el-input__inner) {
      text-align: center;
      color: #ffffff;
    }
  }
}

.teams-wrapper .teams-list .teams-item .c-price {
  color: transparent;
  font-size: 14px;
  font-weight: 500;
  line-height: 25.2px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #00E0FF 0%, #0075FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  gap: 2px;
  &:before {
    content: "";
    background: url("../../../assets/images/promotion/hotpromo/prizePoolVote/point-icon.png")no-repeat center center;
    background-size: contain;
    width: 15px;
    height: 15px;
  }
}

.teams-wrapper .teams-list .teams-item .c-button {
  border: 0.82px solid #2B9EFF;
  padding: 5px 20px;
  border-radius: 4px;
  background: #0075FF29;
  display: block;
  margin-top: 10px;
  width: 80%;
  text-align: center;
  color: #ffffff;
  line-height: 16px;
  font-family: 'PingFang SC'
}


.teams-wrapper .c-note {
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 40px;
  text-align: left;
  color: #58AEDE;
}

.table-details {
  border: 1px solid #00EAFE;
  margin: 50px auto;
  max-width: 1200px;
  font-size: 16px;
  font-weight: bold;
  padding: 5px;
  position: relative;
  .table-title{
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: 500;
    line-height: 33.6px;
    color: #00EAFE;
    text-align: center;
    margin: 5px auto;

  }
}

.table-details table {
  width: 100%;
}

.table-details table thead {
  border-bottom: 1px solid #232323;
  background: #00EAFE;

}

.table-details table thead td {
  text-align: center;
  color: #000000;
  padding: 10px;
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
}

.table-details table tbody {
  border-bottom: 1px solid #232323;
}

.table-details table tbody td {
  color: #ffffff;
  padding: 10px;
  text-align: center;
  font-weight: normal;
}

.footer-div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px auto;
  color: #ffffff;
}
</style>

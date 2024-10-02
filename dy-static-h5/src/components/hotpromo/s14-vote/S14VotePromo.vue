<template>
  <div style="padding: 10px;">
    <q-dialog v-model="isCastVoteModalVisible" :title="castVoteFormData.teamNameLocal" width="100%" align-center
              style="max-width: 800px" @close="toggleCastVoteModal(false)">
      <q-card style="width: 100%">
        <!-- <el-form :rules="castVoteFormValidationRules" ref="castVoteFormRef" style="padding: 20px;"
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
        </el-form> -->
        <q-form class="rounded-borders" ref="castVoteFormRef" id="vote-form">
          <div class="vote-form-header">
            <span>{{ castVoteFormData.teamNameLocal }}</span>
            <div>
              <button type="button" class="close-btn" @click="toggleCastVoteModal(false)">
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <div class="vote-form-content">
            <span><span class="text-red">*&nbsp;</span>投票数量:</span>
            <q-input color="white" square filled v-model="castVoteFormData.votes" />
            <!-- <q-input color="white" class="vote-input" standout bg-color="white" hide-bottom-space type="number" ref="voteRef"
                     v-model="castVoteFormData.votes" :rules="castVoteValidationRules" label-color="" /> -->

            <button type="submit" class="vote-btn" @click.prevent="submit">提交</button>
          </div>

        </q-form>
      </q-card>
    </q-dialog>

     <!-- Tab headers -->
     <div class="tabs-header">
      <div
        v-for="(tab) in tabs"
        :key="tab.period"
        :class="{ active: activeTab === tab.period }"
        @click="checkPeriod(tab.period)"
        class="tab-item"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="dates">
      <div class="datecolumn">
        <span class="title">瑞士轮阶段：</span>10月3日~10月14日
      </div>
      <div class="datecolumn">
        <span class="title">淘汰赛阶段：</span>10月17日~10月27日
      </div>
      <div class="datecolumn">
        <span class="title">冠亚军决赛：</span>11月2日22:00
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
            <!-- <img style="max-height: 20px; height: 20px; margin-top: 10px;" src="../s14-vote/images/reward.png"> -->
            <span style="color: white; text-shadow: none; font-size: 16px; margin-bottom: -5px;">奖金</span>
          </div>
        </div>
        
        <div class="main-title-box">{{selectedDate}}</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-list" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="(votesListItem, i) in votesData.votesList" :key="i">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
                <div class="c-name">{{ votesListItem.teamNameLocal }}</div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 0 ? votesListItem.votes-- : null">-</div>
                
                <!-- Input for the number of votes (bound to the specific list item) -->
               
                <q-input
                  v-model.number="votesListItem.votes"
                  type="number"
                  filled
                  :disable="true"
                  style="max-width: 200px"
                />
                
                
                <!-- Vote increment button -->
                <div class="btn" @click="votesListItem.votes < 10 ? votesListItem.votes++ : null">+</div>
              </div>
              <div class="c-button"  @click.prevent="submit(votesListItem)">投票</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 2">
        <div class="center-numbers">
          <!--<div class="center-title">总奖金</div>-->
          <div id="prizePool" class="center-number">
            {{ convertToCommaAmount(votesData.award) }}
            <!-- <img style="max-height: 74px;" src="../s14-vote/images/2k.png"> -->
            <img style="max-height: 20px; margin-top: 10px;" src="../s14-vote/images/reward.png">
          </div>
        </div>
        
        <div class="main-title-box">{{selectedDate}}</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.slice(0, 8).length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-list" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="(votesListItem, i) in votesData.votesList.slice(0, 8)" :key="i">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
                <div class="c-name">{{ votesListItem.teamNameLocal }}</div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 0 ? votesListItem.votes-- : null">-</div>
                
               
                <q-input
                  v-model.number="votesListItem.votes"
                  type="number"
                  filled
                  disable
                  style="max-width: 200px"
                />
                
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
            <img style="max-height: 20px; margin-top: 10px;" src="../s14-vote/images/reward.png">
          </div>
        </div>
        
        <div class="main-title-box">{{selectedDate}}</div>
        <div class="teams-wrapper pattern-wrapper">
          <div class="pattern-wrapper-bottom"></div>
          <div class="table-header">
            <div class="point">参赛队伍：{{votesData.votesList.slice(0, 2).length}}支</div>
            <div class="point">剩余票数：<span id="myVotes">{{ votesData.myVotes }} 次</span><span class="blue" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">「投票记录」</span></div>
            <!-- <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div> -->
          </div>
          <div class="teams-final" id="countrylist">
            <div id="btn_1" class="teams-item" v-for="(votesListItem, i) in votesData.votesList.slice(0, 2)" :key="i">
              <div class="teams-item-bottom-pattern"></div>
              <div class="c-flagname">
                <div class="c-price">{{ votesListItem.totalVotes }}票</div>
                <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
                </div>
              </div>
              <div class="flexcast">
                <!-- Vote decrement button -->
                <div class="btn" @click="votesListItem.votes > 0 ? votesListItem.votes-- : null">-</div>
                
                <!-- Input for the number of votes (bound to the specific list item) -->
                <q-input
                  v-model.number="votesListItem.votes"
                  type="number"
                  filled
                  :disable="true"
                  style="max-width: 200px"
                />
                
                
                <!-- Vote increment button -->
                <div class="btn" @click="votesListItem.votes < 10 ? votesListItem.votes++ : null">+</div>
              </div>
              <div class="c-button"  @click.prevent="submit(votesListItem)">投票</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="columne">
      <div class="main-title-box">{{selectedDate}}</div>
        <div class="table">
          <div class="table-header">
            <div class="table-headertext">
              {{selectedTitle}}
            </div>
          </div>
          <div class="table-content">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr v-for="(row, rowIndex) in teamRows" :key="rowIndex">
                <td v-for="(team) in row" :key="team.id">
                  {{ team.teamNameLocal }}
                </td>
              </tr>
            </table>
          </div>
        </div>
    </div> -->
    <div class="columne">
      <div class="main-title-box">获取投票</div>
      <div class="sub-title">
        {{ selectedTabDesc }}  
          <!-- 活动期间，根据对应档位条件获取票数后投给任意队伍，若投票的队伍晋级后即可瓜分奖金池彩金； -->
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
                <td>当日票数上限</td>
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
    <div class="columne">
      <div class="main-title-box">活动规则</div>
      <div class="terms">
        <ol>
          <li>活动期间，会员可根据完成的条件获得相应的票数。获得的票数可自由分配给任意队伍进行投票。当日完成获取票数的要求后，即可在活动页面自动获得对应票数。若当日票数已达到对应档位的数量上限，则无法继续获得更多票数；</li>
          <li v-if="activeTab === 1">瑞士轮奖金池结算：（200,000➗晋级队伍总票数）*用户投票数量=单票彩金。彩金于赛事阶段结束后次日24小时内派发，彩金3倍流水即可提款；
          <span class="eg">例：用户投注BLG队伍100票，BLG队伍在瑞士轮阶段晋级并且8支晋级队伍总共获得150,000票数，那么用户可获得（200,000➗150000）*100=133元彩金；</span></li>
          <li v-if="activeTab === 2">淘汰赛奖金池结算：（500,000➗晋级队伍总票数）*用户投票数量=单票彩金。彩金于赛事阶段结束后次日24小时内派发，彩金3倍流水即可提款；
            <span class="eg">例：用户投注BLG队伍100票，BLG队伍在淘汰赛阶段决赛并且2支晋级队伍总共获得300,000票数，那么用户可获得（500,000➗300000）*100=166元彩金；</span></li>
            <li v-if="activeTab === 3">决赛阶段赛奖金池结算：（1000,000➗晋级队伍总票数）*用户投票数量=单票彩金。彩金于赛事阶段结束后次日24小时内派发，彩金3倍流水即可提款；
              <span class="eg">例：用户投注BLG队伍100票，BLG队伍在决赛阶段获得冠军总共获得500,000票数，那么用户可获得（1000,000➗500,000）*100=200元彩金；</span></li>
          <li> 根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；</li>
          <li> 此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；</li>
          <li> 为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ol>
      </div>
    </div>
    <!-- <div class="table-details pattern-wrapper">
      <div class="table-title">投票历史</div>
      <div class="pattern-wrapper-bottom"></div>
      <table id="rankTable">
        <thead>
        <tr>
          <td>队伍名称 </td>
          <td>投票次数 </td>
          <td>投票时间 </td>
        </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <!- <div id="table-pagination"></div> ->

      <div class="listing-footer">
        <div class="footer-div">
          <span class="pointer-s prev-page">&nbsp;&lt;&nbsp;&nbsp;</span>
          <div class="footer-page">
            <span id="record_page">1/1</span>
          </div>
          <span class="pointer-s next-page">&nbsp;&nbsp;&gt;&nbsp;</span>
        </div>
      </div>
    </div> -->
      <q-dialog v-model="isVoteRecordModalVisible">
        <div class="cast-vote-container">
          <q-btn color="white" flat round dense icon="close" v-close-popup style="position: absolute; right: 10px;top: 10px;" />
      
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
            <q-pagination
              class="vote-record-pagination"
              v-model="votesData.votesRecord.current"
              :max="Math.ceil(votesData.votesRecord.data.length / votesData.votesRecord.pageSize)"
              direction-links
              :boundary-links="false"
              max-pages="6"
              boundary-numbers
              input
              input-class="white"
              @input="votesRecordChangePage"
            />
          </div>
        </div>
      </q-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, defineComponent, reactive, computed } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "../../../api/promotion/poolPrizeVote";
import { useQuasar } from "quasar";
import { convertToCommaAmount } from "boot/utils"
import { userStore } from "src/stores";
import {useLocalStorage} from "@vueuse/core"
import moment from "moment";

    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value + "/promo/";
    const store = userStore();
    var qs = require("qs");
    const allowedVoteRangeRule = (val) => {
      return /^(\b([1-9]|10)\b)$/.test(val) || '投票数量只能输入1-10之内的数字'
    }
    const castVoteValidationRules = [
      allowedVoteRangeRule
    ]
    const $q = useQuasar();
    const voteRef = ref(null);
    const activeTab = ref(1);
    const castVoteFormRef = ref();
    const isSubmitting = ref(false);
    const isCastVoteModalVisible = ref(false);
    const isVoteRecordModalVisible = ref(false);
    const castVoteFormData = reactive({
      teamId: undefined,
      teamName: '',
      teamNameLocal: "",
      votes: '1'
    })
    const votesData = ref({
      award: 0,
      myVotes: 0,
      votesList: [],
      votesRecord: {
        data: [],
        pageSize: 6,
        current: 1
      },
    });
    // Tabs data
    const tabs = [
      { label: "瑞士轮", period: 1, date: '瑞士轮阶段活动投票时间：10.03~10.14', tabtitle: 'BO1瑞士轮参与队伍：16支队伍中选8支队伍进入淘汰赛', tabdetail: '活动期间，统计八支晋级队伍票数瓜分奖金池，根据对应档位条件获取票数后投给任意队伍，若投票的队伍晋级后即可瓜分奖金池彩金；' },
      { label: "淘汰赛", period: 2, date: '淘汰赛阶段活动投票时间：10.17~10.27', tabtitle: 'BO5淘汰赛参与队伍：8支队伍中选2支队伍进入冠亚决赛', tabdetail: '活动期间，统计2支晋级决赛队伍票数瓜分奖金池，根据对应档位条件获取票数后投给任意队伍，若投票的队伍晋级后即可瓜分奖金池彩金；' },
      { label: "冠亚赛", period: 3, date: '冠亚赛阶段活动投票时间：11.02~11.02', tabtitle: 'BO5冠亚赛参与队伍：2支队伍中选1支队伍得冠', tabdetail: '活动期间，统计决赛冠军队伍票数瓜分奖金池，根据对应档位条件获取票数后投给任意队伍，若投票的队伍获得冠军后即可瓜分奖金池彩金；' }
    ];
    // const castVote = ({ teamId, teamName, teamNameLocal }) => {
    //   toggleCastVoteModal(true)
    //   castVoteFormData.teamId = teamId
    //   castVoteFormData.teamName = teamName
    //   castVoteFormData.teamNameLocal = teamNameLocal
    // }
    // const toggleCastVoteModal = (status) => {
    //   if (status === true) {
    //     castVoteFormData.teamId = undefined;
    //     castVoteFormData.teamName = '';
    //     castVoteFormData.teamNameLocal = ""
    //     castVoteFormData.votes = '1';
    //   }

    //   isCastVoteModalVisible.value = status;
    // }
    const submit = async (voteData) => {
      // voteRef.value.validate();

      // if (voteRef.value.hasError) {
      //   return;
      // }
      if (voteData.votes === 0) {
        $q.notify({
            color: "negative",
            position: "top",
            message: "请输入票数",
            icon: "report_problem"
        });
        return;
      }

      if (Number(voteData.votes) > votesData.value.myVotes) {
        $q.notify({
            color: "negative",
            position: "top",
            message: "投票次数不足",
            icon: "report_problem"
        });
        return;
      }

      isSubmitting.value = true;
      const params = {
        teamId: voteData.id,
        votes: Number(voteData.votes)
      }
      const res = await poolPrizeCastVote(qs.stringify(params));

      if (res.code === 0) {
        $q.notify({
            color: "positive",
            position: "top",
            message: "投票成功",
            icon: "check_circle_outline"
        });
        isCastVoteModalVisible.value= false;
        // loadVoteTeam();
        if(votesData.value.myVotes > 0){
          votesData.value.myVotes--;
        }
        setTimeout(()=>{
          loadVoteTeam();
        },2000)

      }

      isSubmitting.value = false;
    }
    const votesRecordChangePage = (page) => {
      const totalPages = Math.ceil(votesData.value.votesRecord.data.length / votesData.value.votesRecord.pageSize);

      if (page < 1) {
        votesData.value.votesRecord.current = 1;
      } else if (page > totalPages) {
        votesData.value.votesRecord.current = totalPages;
      } else {
        votesData.value.votesRecord.current = page;
      }
    };

    const paginatedVoteRecords = computed(() => {
      const votesRecord = votesData.value.votesRecord;
      return  votesRecord.data.slice((votesRecord.current - 1) * votesRecord.pageSize, votesRecord.current * votesRecord.pageSize);
    })


    const loadVoteTeam = () => {
      poolPrizeVoteInit().then((res) => {
        if(res.code===0){
          activeTab.value = res.data.period
          const votesRecord = res.data.votesRecord.flatMap((voteRecordItem) => {
            const voteItems = res.data.votesList.find(({ id }) => voteRecordItem.teamVotesId === id);
            if (voteItems) {
              const { countryImgUrl, teamNameLocal } = voteItems;
              return Array(voteRecordItem.votes).fill({ ...voteRecordItem, countryImgUrl, teamNameLocal });
            }
            return [];
        });
        const votesList = res.data.votesList.map((team) => {
          return {
            ...team,
            votes: 0 // Initialize each team's votes to 1
          };
        });

          votesData.value = {
            ...res.data,
            votesList: votesList,
            votesRecord: {
              ...votesData.value.votesRecord,
              data: votesRecord,
            }
          }
        }
      });
    }

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
  const selectedTabDesc = computed(() => selectedTabDetails.value.tabdetail);

  const isClickable = ref(true); 
  const checkPeriod = (tabClicked) => {
    if (!isClickable.value) return; // Prevent clicks if not clickable
    if (tabClicked > activeTab.value) {
      $q.notify({
          color: "negative",
          position: "top",
          message: "该赛段暂未开启",
          icon: "report_problem"
      });
    } else if (tabClicked < activeTab.value) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "该赛段已结束",
        icon: "report_problem"
    });
    }
    // Disable clicking for 2 seconds
    isClickable.value = false;
    setTimeout(() => {
      isClickable.value = true; // Re-enable clicking after 2 seconds
    }, 2000);
  }

    onMounted(() => {
      if (!store.token) {
        return;
      }
      loadVoteTeam();
    })
</script>

<style lang="scss">
.cast-vote-container {
  position: relative;
  background: url(images/dialogbg.png)no-repeat center center;
background-size: 100% 100%;
  .q-pagination__middle {
    gap: 5px;
  }

  .q-pagination__middle > .q-btn, .q-pagination__content > .q-btn {
    background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%) !important;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff !important;
    background-color: transparent;

    &.bg-primary {
      color: #102628;
      // background-color: #00EAFE !important;
      background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%) !important;

      // border: 2px solid #00EAFE;
      font-weight: bold;
      border: none;
    }
  }
}
</style>
<style scoped lang="scss">

.tabs-header {
  display: flex;
  background: url(images/tabbg.png)no-repeat center center;
  background-size: contain;
  height: 70px;
  justify-content: flex-start;
  align-items: center;
  max-width: 700px;
  margin: 0 auto;
  width: 95%;
}

.tab-item {
    border-radius: 5px 5px 0 0;
    font-size: 12px;
    font-weight: 700;
    height: 20px;
    line-height: 20px;
    margin-left: 18px;
    margin-top: 5px;
    text-align: center;
    width: 27%;
    color: #52ACFF;
}

.tab-item.active {
  color: #ffffff;
  background: url(images/activetab.png)no-repeat center center;
  background-size: cover;
}

.tabs-content {
  padding: 20px;
  font-size: 14px;
  font-family: 'HYYakuHei800';
}
.dates {
  display: flex;
  max-width: 500px;
  flex-direction: column;
  gap: 10px;
  margin: 20px auto;
  justify-content: center;
  width: calc(100% - 40px);
  .datecolumn {
    background: url(images/dateborder.png)no-repeat left center;
    background-size: cover;
    padding: 12px;
    color: #8DC6FF;
    font-size: 12px;
    span {
      color: #ffffff;
    }
  }
}
.cast-vote-container {
  background-color: #00192B;
  padding: 10px 20px;
  width: 90%;

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
    // padding: 20px;
    // grid-template-columns: 1fr;
    // gap: 10px;
    padding: 0 10px;
    margin-top: 20px;
    min-height: 220px;
    width: 100%;
    color:#ffffff;
    table {
      width: 100%;
      text-align: center;
    }
    .table-titles {
      td, th {
        padding: 5px 10px;
        border: 0;
      }
      tr:first-child {
        position: sticky;
        top: 0;
        background: url(images/tblbg.png)no-repeat center center;
        background-size: cover;
      }
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
      padding: 10px;
      gap: 30px;

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
    align-items: center;
    justify-content: center;
  }
}
.center-numbers {
  position: relative;
  background: url("images/prizepool.png") no-repeat center center;
  background-size: contain;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 50px;
  padding: 10px;
  position: relative;
  margin: -20px 0 20px;
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
  margin: 10px auto;
}

.promo-rules-div{
  margin: 10px auto;
  // background-image: url("../eurocup-2024-vote/images/rule-board.png");
  padding: 40px 20px;
  background-size: 100% 100%;

  p{
    color: #fff;
    font-size: 16px;
    margin-bottom: 14px;
  }
}
.promo-container .selected-promo .selected-promo-wrapper .inner .content-table{
  color: #fff;
  border-collapse: collapse;
  margin: 20px auto 50px;
  font-size: 18px;

  th, td {
    border: 1px solid #fff;
    padding: 12px 10px;
    text-align: center;
  }

  thead{
    th {

      background: linear-gradient(180deg, #00E9FE 0%, #0A8AFF 100%);
    }
    background: linear-gradient(180deg, #00E9FE 0%, #0A8AFF 100%);
    color:#102628;
  }
  td {
    background: unset;
  }
}


.center-numbers .center-title {
  padding-top: 10px;
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;
  color: #fff;
  margin-left: 30px;
}

.center-numbers .center-number {
  font-weight: bold;
  font-family: 'HYYAKUHEI800';
  color: #FFCF02;
  text-shadow: 4px 0px #FC8025;
  font-size: 30px;
  font-weight: 700;
  line-height: 35px;
  text-align: left;
  gap: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-left: 30px; */
}

.main-title-box {
  background: url(images/headerbg.png)no-repeat left center;
  background-size: contain;
  height: 25px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffffff;
  padding-left: 15px;
  font-weight: bold;
  font-size: 12px;
  padding-top: 3px;
  &:before {
    background: url(images/smtri.png)no-repeat center center;
    position: absolute;
    height: 15px;
    left: -20px;
    top: 5px;
    width: 15px;
    background-size: contain;
    content: "";
  }
}
.sub-title {
  font-size: 12px;
  color: #ffffff;
  margin: 15px auto;
  max-width: 1200px;
}
.columne {
  margin: 15px auto 40px;
  padding: 20px;
}
.terms {
  font-family: 'HYYakuHei300';
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
  margin: 15px auto;
  max-width: 1200px;
  background: url(http://localhost:8090/static/img/box.eadefdb4.png) no-repeat center center;
  background-size: 100% 100%;
  ol {
    padding: 16px 15px 16px 30px;
  }
  .eg {
    display: block;
  }
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
    font-size: 12px;
    background: unset;
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
        background: unset !important;
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
  background: url(images/tblheaderbg.png)no-repeat left center;
  min-height: 30px;
  background-size: cover;
  border-right: 2px solid #004c61;
  padding: 5px;
  .table-headertext {
    padding-left: 20px;
    font-size: 12px;
    background: linear-gradient(180deg, #FFFFFF 0%, #E8F8FF 69.55%, #0066FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.votebtn {
  max-width: 125px;
  margin: 0 auto;
  display: flex;
  img {
    width: 100%;
  }

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
    font-size: 17px;
    font-weight: 600;
    line-height: 20.6px;

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
      font-size: 12px;
      margin-left: 20px;
      background: linear-gradient(180deg, #E8F8FF 49.55%, #0066FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      &:last-child {
        text-align: right;
        margin: 0;
        white-space: nowrap;
      }
    .blue {
      color: #69B4FF;
    }
  }
  }
}

// .pattern-wrapper:before,
// .pattern-wrapper:after,
// .pattern-wrapper-bottom:before,
// .pattern-wrapper-bottom:after {
//     background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
//     background-repeat: no-repeat;
//     background-position: center center;
//     background-size: 14px 14px;
//     content: "";
//     width: 14px;
//     height: 14px;
//     display: inline-block;
//     position: absolute;
// }

// .pattern-wrapper:before {
//     transform: rotateZ(0deg);
//     top: 0;
//     left: 0;
// }

// .pattern-wrapper:after {
//     transform: rotateZ(90deg);
//     top: 0;
//     right: 0;
// }

// .pattern-wrapper-bottom:before {
//     transform: rotateZ(270deg);
//     bottom: 0;
//     left: 0;
// }

// .pattern-wrapper-bottom:after {
//     transform: rotateZ(180deg);
//     bottom: 0;
//     right: 0;
// }

.point {
  font-size: 12px;
  color: #00EAFE;
  width: 95%;
  margin: 0 auto;
}

/* .teams-wrapper .point:before {
    content: "";
    width: 8px;
    height: 8px;
    display: inline-block;
    transform: rotateZ(45deg);
    margin-right: 10px;
    background-color: #ffffff;
} */
.teams-wrapper .right-count {
  text-align: right;
  color: #ffffff;
  font-weight: normal;
  span {
    color: #00E9FE;
  }
}

.teams-wrapper .teams-list {
  display: grid;
  gap: 10px;
  padding: 5px;
  grid-template-columns: repeat(4, 1fr);
}

.teams-wrapper .teams-final {
  background: url(images/vsbg.png) no-repeat center 30%;
  height: 160px;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background-size: contain;
  margin: 10px auto;
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
    width: 100%;
      .c-flagname {
        padding: 5px 0px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row-reverse;
        width: 100%;
        gap: 10px;
        font-family: 'YouSheBiaoTiHei';
        font-weight: normal;
    }
    .c-price {
      background: linear-gradient(180deg, #FFFFFF 0%, #CAE2FF 74.24%, #8FACD7 102.38%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: #ffffff;
      background-clip: text;
      // text-shadow: 20px 45px #000000AA;
      text-shadow: 10px 10px rgba(0, 0, 0, 0.4);
      font-size: 15px;
      padding-right: 5px;
      width: 100%;
    }
    .flexcast {
      width: 85px;
    }
    &:first-child {
      align-items: flex-end;
      .c-flagname {
        flex-direction: row-reverse;
        text-align: right;
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
    width: 50px;
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
//     background-image: url("../../../assets/images/promotion/hotpromo/prizePoolVote/boardpettern_s13.png");
//     background-repeat: no-repeat;
//     background-position: center center;
//     background-size: 12px 12px;
//     content: "";
//     width: 12px;
//     height: 12px;
//     display: inline-block;
//     position: absolute;
// }

// .teams-wrapper .teams-list .teams-item:before {
//     transform: rotateZ(0deg);
//     top: 0;
//     left: 0;
// }

// .teams-wrapper .teams-list .teams-item:after {
//     transform: rotateZ(90deg);
//     top: 0;
//     right: 0;
// }

// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:before {
//     transform: rotateZ(270deg);
//     bottom: 0;
//     left: 0;
// }

// .teams-wrapper .teams-list .teams-item .teams-item-bottom-pattern:after {
//     transform: rotateZ(180deg);
//     bottom: 0;
//     right: 0;
// }

.teams-wrapper .teams-list .teams-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.teams-wrapper .teams-list .teams-item .c-button:hover {
  // background: #00E0FF4A;
  background: #0037ff4a;
}

.teams-wrapper .teams-list .teams-item .c-flagname {
  background: #00F0FF0D;
  padding: 5px 0;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

}

.teams-wrapper .teams-list .teams-item .c-flag {
  // background: #eeeee4;
  // border: 3px solid #53ABFF;
  // border-radius: 50%;
  height: 50px;
  width: 50px;
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
  padding: 5px;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.teams-wrapper .teams-list .teams-item .c-price {
  color: #fff;
  font-size: 10px;
  font-weight: normal;
  padding: 5px 0px 2px;
  width: 100%;
  text-align: center;
  display: inline;
  gap: 2px;
  //text-overflow: ellipsis;
  //overflow: hidden;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #00E0FF 0%, #0075FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  &:before {
    content: "";
    float: left;
    position: relative;
    top: 0px;
    margin-right: 2px;
    // background: url("../eurocup-2024-vote/images/point-icon.png")no-repeat center center;
    background-size: contain;
    width: 8px;
    height: 8px;
  }
}
.flexcast {
  display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    margin: 10px 0 auto;
    width: 90%;
    text-align: center;
  .btn {
    background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%);
    color: #ffffff;
    padding: 0px 5px;
    border-radius: 3px;
    width: 23px;
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

.teams-wrapper .teams-list .teams-item .c-button {
  border: 0.82px solid #2B9EFF;
  padding: 2px 10px;
  border-radius: 20px;
  display: block;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  border-radius: 4px;
  background: #0075FF29;
  color: #ffffff;
  font-size: 10px;
  line-height: 16px;
}



.teams-wrapper .c-note {
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  text-align: left;color: #58AEDE;


}

.table-details {
  border: 1px solid #00EAFE;
  background: linear-gradient(180deg, rgba(0, 117, 255, 0.45) 0%, #66ACFF 100%);

  max-width: 1298px;
  margin: 10px;
  font-size: 16px;
  font-weight: bold;
  padding: 5px;
  position: relative;
  .table-title{
    font-size: 14px;
    font-weight: 500;
    line-height: 17.6px;
    color: #00EAFE;
    text-align: center;
    margin: 5px auto;

  }
}
.promo-content {
  width: 95%;
  margin: 0 auto;
}
.promo-container .selected-promo .selected-promo-wrapper .inner .table-details table {
  width: 100%;
}
.promo-container .selected-promo .selected-promo-wrapper .inner .table-details table thead {
  border-bottom: 1px solid #ffffff;
  background: #00EAFE;
}
.promo-container .selected-promo .selected-promo-wrapper .inner .table-details table thead td {
  text-align: center;
  color: #000000;
  padding: 10px;
  background: unset;
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
}

.promo-container .selected-promo .selected-promo-wrapper .inner .table-details table tbody {
  border-bottom: 1px solid #ffffff;
}

.promo-container .selected-promo .selected-promo-wrapper .inner .table-details table tbody td {
  color: #ffffff;
  padding: 10px;
  text-align: center;
  font-weight: normal;
}

.footer-div {
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

#vote-form {
  display: flex;
  flex-direction: column;

  .vote-form-header {
    padding: 0px 15px;
    border-bottom: 1px solid #e5e5e5;
    display: inline-block;
    font-weight: 700;
    color: #00a9e5;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close-btn {
      cursor: pointer;
      background: none;
      border: none;
      float: right;
      font-size: 21px;
      font-weight: 700;
      line-height: 1;
      color: #000;
      text-shadow: 0 1px 0 #fff;
      filter: alpha(opacity=20);
      opacity: .2;
    }
  }

  .vote-form-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .vote-btn {
    padding: 10px 20px;
    border: 0;
    background-image: linear-gradient(90deg, #00cdc1 0%, #2b5b6c 100%), linear-gradient(#2b5b6c, #2b5b6c);
    box-shadow: 0px 3px 4px 0px rgba(13, 110, 200, 0.29);
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
    line-height: .7rem;
    text-align: center;
    cursor: pointer;
    width: fit-content;
  }

  .vote-btn:hover {
    background-image: linear-gradient(90deg, #2b5b6c 0%, #2b5b6c 100%), linear-gradient(#2b5b6c, #2b5b6c);
  }
}


.custom-modal-header h5 {
  display: inline-block;
  font-weight: bold;
  color: #2b5b6c;
}

.modal-content {
  width: 95%;
}

.modal.in .modal-dialog {
  width: 100%;
}
</style>

<style lang="scss">
#vote-form {
  .q-field {
    width: 100%;
  }

  .q-field .q-field__control {
    border: 1px solid #d7d7d7;
    color: black;
    background-color: #fff;
    width: 100%;
  }

  input.q-field__native {
    color: #ffffff;
  }
}
  .q-field {
    width: 100%;
  }
  .q-field__control {

    height: 20px;
  }

  .q-field__native {
    color: #ffffff;
    text-align: center;
    height: 100%;
  }
  .q-field--filled .q-field__control {
    padding: 0;
  }
</style>

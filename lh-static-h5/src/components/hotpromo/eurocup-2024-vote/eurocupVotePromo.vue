<template>
  <div>
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

            <q-input class="vote-input" standout bg-color="white" hide-bottom-space type="number" ref="voteRef"
                     v-model="castVoteFormData.votes" :rules="castVoteValidationRules" label-color="" />

            <button type="submit" class="vote-btn" @click.prevent="submit">提交</button>
          </div>

        </q-form>
      </q-card>
    </q-dialog>

    <div class="center-numbers">
      <!--<div class="center-title">总奖金</div>-->
      <div id="prizePool" class="center-number">
        {{ store.currency.value }} {{ convertToCommaAmount(votesData.award) }}
      </div>
    </div>
<!--    <div class="winner-bar">-->
<!--      <div class="winner-bar__bg">-->
<!--        <div class="winner-bar__inner">-->
<!--          <div class="winner-bar__text">-->
<!--            恭喜玩家SAFA赢得21314元-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="point">点击您喜欢的战队LOGO进行竞猜，票数越高，竞猜成功之后，彩金越高哦！</div>

    <div class="countries-wrapper pattern-wrapper">
      <div class="pattern-wrapper-bottom"></div>
      <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div>
      <div class="country-list" id="countrylist">
        <div id="btn_1" class="country-item" v-for="votesListItem in votesData.votesList" :key="votesListItem.id">
          <div class="country-item-bottom-pattern"></div>
          <div class="c-flagname">
            <div class="c-flag"><img :src="imgURL + votesListItem.countryImgUrl">
            </div>
            <div class="c-name">{{ votesListItem.teamNameLocal }}</div>
          </div>
          <div class="c-price">{{ votesListItem.totalVotes }} 票</div>
          <div class="c-button" @click="castVote({
                        teamId: votesListItem.id,
                        teamName: votesListItem.teamNameEn,
                        teamNameLocal: votesListItem.teamNameLocal
                    })">投票</div>
        </div>
      </div>

      <div class="c-note">举例：欧洲杯赛得出冠军后，则按票数瓜分累积奖池，例如会员A在活动期间，为西班牙总投票数为138票，若西班牙世界赛取得冠军后，则按票数瓜分奖池内奖金，以1,000,000元奖金和冠军队伍总票数5120票为例（100,0000÷5120=195元/票，会员A为西班牙总投票数为138票，138X195=26953元奖金）
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

    <div class="promo-content">

      <div class="promo-title">
        <img src="../eurocup-2024-vote/images/title-detail.png"/>
      </div>

      <div class="content-info">
        <div class="content-info-item">活动时间：2024年06月15号00:00至07月14号23:59:59</div>
        <div class="content-info-item" >
          活动内容：会员每日累计存款金额达到指定额度或以上，即可参与一次投票。
        </div>

        <table class="content-table" width="100%;" cellpadding="0" cellspacing="0" border="0">
          <thead>
          <tr>
            <th>获取条件</th>
            <th>获取投票次数</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>当日有登录记录</td>
            <td>1</td>
          </tr>
          <tr>
            <td>存款≥200</td>
            <td>2</td>
          </tr>
          <tr>
            <td>存款≥500</td>
            <td>3</td>
          </tr>
          <tr>
            <td>存款≥1,000</td>
            <td>6</td>
          </tr>
          <tr>
            <td>存款≥3,000</td>
            <td>8</td>
          </tr>
          <tr>
            <td>存款≥5,000</td>
            <td>9</td>
          </tr>
          <tr>
            <td>存款≥8,000</td>
            <td>10</td>
          </tr>
          </tbody>
        </table>


      </div>

      <div class="promo-title">
        <img src="../eurocup-2024-vote/images/title-rules.png"/>
      </div>

      <div class="promo-rules-div">
        <p>1.在活动日期内每日达到参与条件，即可在队伍下方点击投票，每位会员每日最高享受有10票名额；</p>

        <p>2.所有雷火电竞会员均可参加此活动，活动奖金只需3倍水即可提款；</p>

        <p>3.奖金派发时间以欧洲杯得出冠军队伍后，奖金将在24小时内派发到游戏主账户，并且站内信通知奖金公告；</p>

        <p>4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利；</p>

        <p>5.雷火电竞有权延长、缩短、终止，或者修改此活动，最终解释权归雷火电竞所有；</p>
      </div>

      <q-dialog v-model="isVoteRecordModalVisible">
        <div class="cast-vote-container">
          <div class=title>投票历史</div>
          <div class="vote-records">
            <div class="vote-record-item" v-for="voteRecord, index in paginatedVoteRecords" :key="index">
              <div class="vote-record-flag-wrapper"><img class="vote-record-item-flag" :src="imgURL + voteRecord.countryImgUrl" />{{ voteRecord.teamNameLocal }}</div>
              <div>2024/05/24 16:54</div>
            </div>
          </div>
          <div class="pagination-wrapper">
            <q-pagination
              class="vote-record-pagination"
              v-model="votesData.votesRecord.current"
              :max="votesData.votesRecord.data.length / votesData.votesRecord.pageSize"
              direction-links
              boundary-numbers
              :max-pages="6"
            />
          </div>
        </div>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, defineComponent, reactive, computed } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "../../../api/promotion/poolPrizeVote";
import { useQuasar } from "quasar";
import { convertToCommaAmount } from "boot/utils"
import { userStore } from "src/stores";
import {useLocalStorage} from "@vueuse/core"

export default defineComponent({
  name: "EurocupVotePromo",
  components: {
  },
  setup() {
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
    const castVote = ({ teamId, teamName, teamNameLocal }) => {
      toggleCastVoteModal(true)
      castVoteFormData.teamId = teamId
      castVoteFormData.teamName = teamName
      castVoteFormData.teamNameLocal = teamNameLocal
    }
    const toggleCastVoteModal = (status) => {
      if (status === true) {
        castVoteFormData.teamId = undefined;
        castVoteFormData.teamName = '';
        castVoteFormData.teamNameLocal = ""
        castVoteFormData.votes = '1';
      }

      isCastVoteModalVisible.value = status;
    }
    const submit = async () => {
      voteRef.value.validate();

      if (voteRef.value.hasError) {
        return;
      }

      if (Number(castVoteFormData.votes) > votesData.value.myVotes) {
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
        teamId: castVoteFormData.teamId,
        votes: Number(castVoteFormData.votes)
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
        loadVoteTeam();
      }

      isSubmitting.value = false;
    }

    const votesRecordChangePage = (page) => {
      if(page < 1) {
        votesData.value.votesRecord.current = 1;
      } else if(page > (votesData.value.votesRecord.data.length / votesData.value.votesRecord.pageSize)) {
        votesData.value.votesRecord.current = votesData.value.votesRecord.data.length / votesData.value.votesRecord.pageSize;
      } else {
        votesData.value.votesRecord.current = page;
      }
    }

    const paginatedVoteRecords = computed(() => {
      const votesRecord = votesData.value.votesRecord;
      return  votesRecord.data.slice((votesRecord.current - 1) * votesRecord.pageSize, votesRecord.current * votesRecord.pageSize);
    })


    const loadVoteTeam = () => {
      poolPrizeVoteInit().then((res) => {
        if(res.code===0){
          const votesRecord = res.data.votesRecord.map((voteRecordItem) => {
            const { countryImgUrl, teamNameLocal } = res.data.votesList.find(({ id }) => voteRecordItem.teamVotesId === id);
            return { ...voteRecordItem, countryImgUrl, teamNameLocal };
          });

          votesData.value = {
            ...res.data,
            votesRecord: {
              ...votesData.value.votesRecord,
              data: votesRecord,
            }
          }
        }
      });
    }


    onMounted(() => {
      loadVoteTeam();
    })

    return {
      votesData,
      isCastVoteModalVisible,
      castVoteFormData,
      castVoteValidationRules,
      castVoteFormRef,
      castVote,
      submit,
      voteRef,
      toggleCastVoteModal,
      convertToCommaAmount,
      store,
      imgURL,
      isVoteRecordModalVisible,
      paginatedVoteRecords,
      votesRecordChangePage
    }
  }
});




</script>

<style lang="scss">
.cast-vote-container {
  .q-pagination__middle {
    gap: 5px;
  }

  .q-pagination__middle > .q-btn, .q-pagination__content > .q-btn {
    border: 2px solid #fff;
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
      background-color: #00EAFE !important;
      border: 2px solid #00EAFE;
      font-weight: bold;
      border: none;
    }
  }
}
</style>
<style scoped lang="scss">
.cast-vote-container {
  background-color: #00192B;
  padding: 10px 20px;

  .title {
    font-size: 20px;
    text-align: center;
    color: #00E9FE;
    font-family: "PingFang", "Roboto";
  }

  .vote-records {
    display: grid;
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 10px;

    .vote-record-item {
      font-family: "PingFang", "Roboto";
      background-color: #0A243E;
      border: 2px solid #00EAFE4D;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      color: #fff;
      padding: 10px 25px;
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
    align-items: center;
    justify-content: center;
  }
}
.center-numbers {
  position: relative;
  background: url("images/prizepool.png") no-repeat center center;
  background-size: contain;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Arial';
  padding: 10px;
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
  background-image: url("../eurocup-2024-vote/images/rule-board.png");
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
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;
  color: #fff;
  margin-top: 32px;
  /* margin-left: 30px; */
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
    font-size: 17px;
    font-weight: 600;
    line-height: 20.6px;

  }

}
.countries-wrapper {
  background: #00192B33;
  border-radius: 4px;
  border: 1px solid #00EAFE;
  margin: 10px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  position: relative;
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

/* .countries-wrapper .point:before {
    content: "";
    width: 8px;
    height: 8px;
    display: inline-block;
    transform: rotateZ(45deg);
    margin-right: 10px;
    background-color: #ffffff;
} */
.countries-wrapper .right-count {
  text-align: right;
  color: #ffffff;
  font-weight: normal;
  span {
    color: #00E9FE;
  }
}

.countries-wrapper .country-list {
  display: grid;
  gap: 5px;
  padding: 10px 0;
  grid-template-columns: repeat(4, 1fr);
}

// .countries-wrapper .country-list .country-item:before,
// .countries-wrapper .country-list .country-item:after,
// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:before,
// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
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

// .countries-wrapper .country-list .country-item:before {
//     transform: rotateZ(0deg);
//     top: 0;
//     left: 0;
// }

// .countries-wrapper .country-list .country-item:after {
//     transform: rotateZ(90deg);
//     top: 0;
//     right: 0;
// }

// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:before {
//     transform: rotateZ(270deg);
//     bottom: 0;
//     left: 0;
// }

// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
//     transform: rotateZ(180deg);
//     bottom: 0;
//     right: 0;
// }

.countries-wrapper .country-list .country-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  padding: 10px;
  overflow: hidden;
  position: relative;
}

.countries-wrapper .country-list .country-item:hover .c-button {
  background: #00E0FF4A;
}

.countries-wrapper .country-list .country-item .c-flagname {
  background: #00F0FF0D;
  padding: 10px 15px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

}

.countries-wrapper .country-list .country-item .c-flag {
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

.countries-wrapper .country-list .country-item .c-flag img {
  max-width: 100%;
  max-height: 100%;
  /* border: 1px solid #d4c164; */
}

.countries-wrapper .country-list .country-item .c-name {
  padding: 5px;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.countries-wrapper .country-list .country-item .c-price {
  color: #fff;
  font-size: 10px;
  font-weight: normal;
  padding: 0 5px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 2px;
  gap: 5px;
  &:before {
    content: "";
    background: url("../eurocup-2024-vote/images/point-icon.png")no-repeat center center;
    background-size: contain;
    width: 10px;
    height: 10px;
  }
}

.countries-wrapper .country-list .country-item .c-button {
  border: 1px solid #00E0FF;
  padding: 2px 10px;
  border-radius: 20px;
  display: block;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  border-radius: 4px;
  background: #00E0FF1A;
  color: #ffffff;
  font-size: 10px;
  line-height: 16px;
}



.countries-wrapper .c-note {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  text-align: left;color: #58AEDE;


}

.table-details {
  border: 1px solid #00EAFE;
  max-width: 1298px;
  margin: 10px;
  font-size: 16px;
  font-weight: bold;
  padding: 5px;
  position: relative;
  .table-title{
    font-family: PingFang SC;
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
    color: #000;
  }
}
</style>

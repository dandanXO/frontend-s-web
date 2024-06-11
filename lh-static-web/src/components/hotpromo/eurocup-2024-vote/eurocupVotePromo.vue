<template>
  <div>

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
    <div class="countries-wrapper pattern-wrapper">
      <div class="pattern-wrapper-bottom"></div>
      <div class="point">点击您喜欢的战队LOGO进行竞猜，票数越高，竞猜成功之后，彩金越高哦！</div>
      <div class="right-count">我的投票次数: <span id="myVotes">{{ votesData.myVotes }} 次</span><span class="vote-record-btn" @click="isVoteRecordModalVisible = true" v-if="votesData?.votesRecord?.data?.length">【投票记录】</span></div>
      <div class="country-list" id="countrylist">
        <div id="btn_1" class="country-item" v-for="votesListItem in votesData.votesList">
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

    <div class="table-details pattern-wrapper" style="display:none">
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
        <tr class="table-row">
          <td colspan="3">暂无数据</td>
        </tr>
        </tbody>
      </table>
      <!-- <div id="table-pagination"></div> -->

      <div class="listing-footer">
        <div class="footer-div">
          <span class="pointer-s prev-page">&nbsp;&lt;&nbsp;&nbsp;</span>
          <div class="footer-page">
            <span id="record_page">1/1</span>
          </div>
          <span class="pointer-s next-page">&nbsp;&nbsp;&gt;&nbsp;</span>
        </div>
      </div>
    </div>

    <div class="promo-content">

      <div class="promo-title">
        <img src="../eurocup-2024-vote/images/title-detail.png"/>
      </div>

      <div class="content-info">
        <div class="content-info-item">活动时间：2024年06月15号00:00至07月14号23:59:59</div>
        <div class="content-info-item" >
          活动内容：会员每日累计存款金额达到指定额度或以上，即可参与一次投票。
        </div>

        <table class="content-table">
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
    </div>


    <el-dialog align-center v-model="isCastVoteModalVisible" :title="castVoteFormData.teamNameLocal" width="500">
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
    </el-dialog>

    <el-dialog align-center v-model="isVoteRecordModalVisible" width="700" style="background-color:#00192B;">
      <div class="cast-vote-container">    
        <div class=title>投票历史</div>
        <div class="vote-records">
          <div class="vote-record-item" v-for="voteRecord in paginatedVoteRecords">
            <div class="vote-record-flag-wrapper"><img class="vote-record-item-flag" :src="imgURL + voteRecord.countryImgUrl" />{{ voteRecord.teamNameLocal }}</div>
            <div>2024/05/24 16:54</div>
          </div>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            class="vote-record-pagination"
            v-model:current-page="votesData.votesRecord.current"
            :page-size="votesData.votesRecord.pageSize"
            :small="small"
            background
            layout="total, prev, pager, next"
            :total="votesData.votesRecord.data.length"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, ref, defineComponent, reactive, computed } from "vue";
import { poolPrizeVoteInit, poolPrizeCastVote } from "@/api/promotion/poolPrizeVote";
import { ElMessage } from "element-plus";
import { convertToCommaAmount } from "@/utils/utils"
import { userStore } from "@/store/index"
import { useLocalStorage } from "@vueuse/core";


export default defineComponent({
  name: "eurocupVotePromo",
  components: {
  },
  setup() {
    const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

    const store = userStore();
    const castVoteFormValidationRules = {
      votes: [
        {
          required: true,
          message: "请输入投票数量",
          trigger: "blur",
        },
        {
          pattern: "^([1-9]|1[0])$",
          message: "投票数量只能输入1-10之内的数字",
          trigger: "blur",
        },
      ],
    }
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
      isCastVoteModalVisible.value = true;
      castVoteFormData.teamId = teamId
      castVoteFormData.teamName = teamName;
      castVoteFormData.teamNameLocal = teamNameLocal
    }
    const submit = async (elForm) => {
      if (!elForm) return

      await elForm.validate(async (valid) => {
        if (Number(castVoteFormData.votes) > votesData.value.myVotes) {
          ElMessage.error({
            type: "error",
            message: "投票次数不足"
          })
          return;
        }
        if (valid) {
          isSubmitting.value = true;
          const params = {
            teamId: castVoteFormData.teamId,
            votes: Number(castVoteFormData.votes)
          }
          const res = await poolPrizeCastVote(params);

          if (res.code === 0) {
            ElMessage.success({
              type: "success",
              message: "投票成功"
            })
            isCastVoteModalVisible.value= false;
            loadVoteTeam();
          } else {
            ElMessage.error(res.message)
          }

          isSubmitting.value = false;
        }
      })
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
      isVoteRecordModalVisible,
      castVoteFormData,
      castVoteFormValidationRules,
      castVoteFormRef,
      castVote,
      submit,
      isSubmitting,
      convertToCommaAmount,
      store,
      imgURL,
      paginatedVoteRecords,
      votesRecordChangePage
    }
  }
});




</script>

<style lang="scss">
.cast-vote-container {
  .el-pagination.is-background .el-pager li, .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
    border: 2px solid #fff;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: transparent;
  }

  .el-pagination__total {
    color: #fff;
  }

  .el-pagination.is-background .el-pager li.is-active {
    color: #102628;
    background-color: #00EAFE;
    border: 2px solid #00EAFE;
    font-weight: bold;
  } 
}
</style>

<style scoped lang="scss">
.cast-vote-container {
  font-family: PingFang SC;
  
  .title {
    font-size: 20px;
    text-align: center;
    color: #00E9FE;
    }
    
    .vote-records {
      display: grid;
      padding: 20px;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

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
        padding: 15px 33px;
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
  margin: 0px auto;
  position: relative;
  background: url("images/prizepool.png") no-repeat center center;
  background-size: contain;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'DIN';
  padding-top: 82px;
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
  background-image: url("../eurocup-2024-vote/images/rule-board.png");
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
  font-size: 56px;
  line-height: 80px;
  font-weight: bold;
  color: #00FFE0;
  font-size: 56px;
  font-weight: 700;
  line-height: 68.38px;
  text-align: left;

}

.countries-wrapper {
  background: #00192B33;

  border: 1px solid #00EAFE;
  max-width: 1200px;
  margin: 50px auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  position: relative;
}

.countries-wrapper .point {
    color: #00E9FE;
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

.countries-wrapper .right-count {
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

.countries-wrapper .country-list {
  display: grid;
  gap: 10px;
  padding: 10px;
  grid-template-columns: repeat(8, 1fr);
}

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

// .countries-wrapper .country-list .country-item:before,
// .countries-wrapper .country-list .country-item:after,
// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:before,
// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
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

// .countries-wrapper .country-list .country-item:before {
//   transform: rotateZ(0deg);
//   top: 0;
//   left: 0;
// }

// .countries-wrapper .country-list .country-item:after {
//   transform: rotateZ(90deg);
//   top: 0;
//   right: 0;
// }

// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:before {
//   transform: rotateZ(270deg);
//   bottom: 0;
//   left: 0;
// }

// .countries-wrapper .country-list .country-item .country-item-bottom-pattern:after {
//   transform: rotateZ(180deg);
//   bottom: 0;
//   right: 0;
// }

.countries-wrapper .country-list .country-item:hover .c-button {
  // background-color: #ffffff;
  // border-radius: 10px;
  // color: #498BCB;
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
  // border: 5px solid #53ABFF;
  // border-radius: 50%;
  height: 80px;
  width: 80px;
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
  padding: 5px 0;
  color: #fff;
}

.countries-wrapper .country-list .country-item .c-price {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  line-height: 25.2px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto 0;
  gap: 5px;
  &:before {
    content: "";
    background: url("../../../assets/images/promotion/hotpromo/prizePoolVote/point-icon.png")no-repeat center center;
    background-size: contain;
    width: 20px;
    height: 20px;
  }
}

.countries-wrapper .country-list .country-item .c-button {
  border: 1px solid #00E0FF;
  padding: 5px 20px;
  border-radius: 4px;
  background: #00E0FF1A;
  display: block;
  margin-top: 10px;
  width: 80%;
  text-align: center;
  color: #ffffff;
  line-height: 16px;
  font-family: 'PingFang SC'
}


.countries-wrapper .c-note {
  font-family: PingFang SC;
font-size: 20px;
font-weight: 500;
line-height: 40px;
text-align: left;color: #58AEDE;


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
  
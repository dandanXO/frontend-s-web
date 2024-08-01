<template>
  <div>
    <div class="prediction">
      <div class="prize-pool">
        <div class="prize-title">奖池</div>
        <div class="prize-number">{{ "1,000,000" }}</div>
      </div>
      <div class="prediction-table">
        <div v-for="match in matchDetails">
          <div class="match-item">
            <div class="match-image">{{ match.image }}</div>
            <div class="match-title">{{ match.title }}</div>
            <div class="match-btn" @click="vote(match)">投票</div>
            <div class="match-current">当前票数: {{ match.currentTickets }}</div>
          </div>
        </div>
      </div>
      <div class="promo-view-container">
        <table>
          <tr>
            <th>队伍名称</th>
            <th>投票次数</th>
            <th>投票时间</th>
          </tr>
          <tr>
            <td>T1</td>
            <td>2</td>
            <td>2023.11.08</td>
          </tr>
        </table>
      </div>
    </div>
    <el-dialog @open="reset" width="400" v-model="isPredictModal" :title="matchTitle" align-center>
      <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="票数" prop="noOfVotes">
          <el-input v-model="form.noOfVotes" />
        </el-form-item>
        <el-button class="common-btn" @click="submitVotes">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { getTeamVotes, postVote } from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";
const notify = useNotify();

const validateVotes = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入投票"));
  } else if (value < 1) {
    callback(new Error("投票次数要大于0"));
  } else {
    callback();
  }
};
const matchDetails = ref([]);
const isPredictModal = ref(false);
const form = reactive({
  noOfVotes: 0
});
const formRef = ref();
const matchTitle = ref("");
const init = () => {
  // getTeamVotes().then((res) => {
  //   if (res.code === 0) {
  //     matchDetails.value = res.data;
  //   }
  // });
  matchDetails.value = [
    {
      teamId: 1,
      image: "",
      title: "T1",
      currentTickets: 1000
    },
    {
      teamId: 2,
      image: "",
      title: "BLG",
      currentTickets: 1000
    },
    {
      teamId: 3,
      image: "",
      title: "JDG",
      currentTickets: 1000
    },
    {
      teamId: 4,
      image: "",
      title: "WBG",
      currentTickets: 1000
    }
  ];
};
const selectedTeam = ref({});
const vote = (match) => {
  selectedTeam.value = match;
  matchTitle.value = match.title;
  isPredictModal.value = true;
};
const submitVotes = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      var obj = {
        teamId: selectedTeam.value.teamId,
        voteCount: form.noOfVotes
      };
      postVote(obj).then((res) => {
        if (res.code === 0) {
          isPredictModal.value = false;
        } else {
          notify.error({
            type: "error",
            message: res.message
          });
        }
      });
    }
  });
};
const rules = reactive({
  noOfVotes: [{ validator: validateVotes, trigger: blur }]
});
const reset = () => {
  formRef.value.resetFields();
};
onMounted(() => {
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  init();
});
</script>
<style lang="scss" scoped>
.prediction {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  .prize-pool {
    width: 80%;
    height: 400px;
    background: url("../../../assets/images/promotion/hotpromo/prediction/prizepool.png") no-repeat center center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    position: relative;
    .prize-title {
      position: absolute;
      top: 15px;
      left: 0;
      right: 0;
      margin: auto;
      color: #ffffff;
      font-size: 45px;
      text-align: center;
    }
    .prize-number {
      color: #3f5075;
      font-size: 80px;
    }
  }
  .prediction-table {
    background: url("../../../assets/images/promotion/hotpromo/prediction/predictionbg.png") no-repeat center center;
    background-size: 100% 100%;
    padding: 50px;
    display: flex;
    justify-content: space-evenly;
    gap: 80px;

    .match-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      .match-image {
        width: 150px;
        height: 150px;
        background: url("../../../assets/images/promotion/hotpromo/prediction/imgbg.png") no-repeat center center;
      }
      .match-title {
        color: #4c4c6c;
        font-weight: 600;
      }
      .match-btn {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px -2px 4.579999923706055px 0px #b1d7ff inset;

        box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
        padding: 10px 40px;
        color: #ffffff;
        border-radius: 100px;
        cursor: pointer;
      }
    }
  }
}
</style>

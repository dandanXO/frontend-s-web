<template>
  <div class="whole-section">
    <div class="section-guess">
      <div class="date">
        <!-- 6月17日 星期一 -->
        {{ formattedDate }}
      </div>
      <div class="match-details">
        免费参与竞猜，小组赛第三轮（共3轮）
      </div>
      <div class="winloss-matches">
        <div class="match" v-for="(match, i) in ongoingMatches" :key="i">
          <div class="team teamA">
            <div class="toprow team-details">
              <div class="teamicon">
                <img :src="imgURL + match.teamOneIcon">
              </div>
              <div class="teamname">
                {{ match.teamOneName }}
              </div>
            </div>
            <div class="match-btn" @click="matchSubmit(match, match.teamOneId, match.teamOneName)"
                 v-if="match.selectedTeamId === null">胜</div>
            <button v-else-if="match.selectedTeamId === match.teamOneId" class="match-btn active">
              已选
            </button>
            <div v-else class="match-btn pseudo" />
          </div>
          <div class="date-time">
            <div class="toprow row-details">
              {{ match.matchTime }}
            </div>

            <div class="match-btn"@click="matchSubmit(match, 0, '平局')"
                 v-if="match.selectedTeamId === null">平</div>

            <button v-else-if="match.selectedTeamId === 0" class="match-btn active">已选</button>
            <div v-else class="match-btn pseudo" />
          </div>
          <div class="team teamB">
            <div class="toprow team-details">
              <div class="teamicon">
                <img :src="imgURL + match.teamTwoIcon">
              </div>
              <div class="teamname">
                {{ match.teamTwoName }}
              </div>
            </div>
            <div class="match-btn" @click="matchSubmit(match, match.teamTwoId, match.teamTwoName)"
                 v-if="match.selectedTeamId === null">胜</div>
            <button v-else-if="match.selectedTeamId === match.teamTwoId" class="match-btn active">
              已选
            </button>
            <div v-else class="match-btn pseudo" />
          </div>
        </div>
      </div>
    </div>
    <div class="section-activity">
      <div class="title-img">
        <img src="./images/activity.png">
      </div>
      <div class="sub-desc">
        活动内容：活动期间，当日任意存款即可免费参与竞猜，每日竞猜指定欧洲杯比赛胜率≥25%且欧洲杯”滚球盘”有效投注≥500元即可获得最高2,888元彩金。
      </div>
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
        <tr>
          <th>当日有效投注</th>
          <th>竞猜胜率25%</th>
          <th>竞猜胜率50%</th>
          <th>竞猜胜率100%</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>≥500</td>
          <td>3</td>
          <td>5</td>
          <td>8</td>
        </tr>
        <tr>
          <td>≥1,000</td>
          <td>5</td>
          <td>8</td>
          <td>10</td>
        </tr>
        <tr>
          <td>≥5,000</td>
          <td>18</td>
          <td>28</td>
          <td>58</td>
        </tr>
        <tr>
          <td>≥10,000</td>
          <td>58</td>
          <td>68</td>
          <td>88</td>
        </tr>
        <tr>
          <td>≥30,000</td>
          <td>88</td>
          <td>128</td>
          <td>218</td>
        </tr>
        <tr>
          <td>≥80,000</td>
          <td>288</td>
          <td>588</td>
          <td>888</td>
        </tr>
        <tr>
          <td>≥150,000</td>
          <td>1,588</td>
          <td>1,888</td>
          <td>2,888</td>
        </tr>
        </tbody>
      </table>
      <div class="note">
        注：每日免费竞猜至少正确一场且有效投注符合即可获得最高2,888元彩金
      </div>
    </div>
    <div class="section-rules">
      <div class="title-img">
        <img src="./images/rules.png">
      </div>
      <ol>
        <li>活动期间，当日任意存款即可参与免费竞猜，参与当日指定免费竞猜且“欧洲杯”滚球盘有效投注≥500即可获得竞猜彩金，彩金于次日24小时内派发，彩金需完成3倍流水即可提款；</li>
        <li>活动胜率计算方式为：100 ÷ 每日竞猜赛事数量 × 获胜场次；</li>
        <li>本活动仅计算滚球盘的有效投注，流水赔率要求：亚洲盘赔率 &lt; 0.70、欧洲盘 &lt; 1.70、美洲盘 ≤ -133、马来盘 ≤ 0.70 且 &gt; 0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；</li>
        <li>本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算，单日单场赛事有在多体育场馆投注则累积计算，任何走盘、串关、特殊投注、取消的赛事将不计算在有效投注额内；</li>
        <li>同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；</li>
        <li>任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；</li>
        <li>为避免文字理解差异，本站保留本活动最终解释权。</li>
      </ol>
    </div>
    <el-dialog width="500" :title="selectedMatch.title" v-model="confirmDialog">
      <div class="dialog-header" style="margin: 5px auto 20px;">
      <span>
        您确定要选择
        <span style="font-weight: bold; color: #0051b3">{{ selectedItem.name }}</span>
        吗？请注意，一旦选择后将无法更改。
      </span>
      </div>
      <div class="dialog-footer">
        <el-button color="grey" @click="confirmDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmMatchSelect(selectedMatch.id, selectedItem.id)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>

import { onMounted, ref, computed } from "vue";
import { getFormattedDateComponents } from '@/utils/utils';
import { useDark, useLocalStorage } from "@vueuse/core";
import {
  euroMatchOngoing,
  euroMatchSubmit,
} from "@/api/promotion/eurocup";
import { userStore } from "@/store";
import { ElMessage } from "element-plus";
const store = userStore();
const ongoingMatches = ref([]);
const imgURL = useLocalStorage("IMAGE_CDN" ,process.env.VUE_APP_IMAGE_CDN).value + "/promo/";

const confirmDialog = ref(false);
const selectedMatch = ref("");
const selectedItem = ref({
  id: null,
  name: null
});
const formattedDate = ref(null);
const getMatches = () => {
  euroMatchOngoing().then((res) => {
    if (res.code === 0) {
      ongoingMatches.value = res.data;

      if (ongoingMatches.value.length > 0) {
        formattedDate.value = getFormattedDateComponents(ongoingMatches.value[0].matchTime);
      }
    }
  });
};
const matchSubmit = (match, id, name) => {
  confirmDialog.value = true;
  selectedMatch.value = match;
  selectedItem.value = {
    id: id,
    name: name
  };
};
const confirmMatchSelect = () => {
  euroMatchSubmit(selectedMatch.value.id, selectedItem.value.id).then((res) => {
    if (res.code === 0) {
      ElMessage.success("投票成功");
      confirmDialog.value = false;
      getMatches();
    } else {
      ElMessage.error(res.message)
    }
  });
};
onMounted(() => {
  getMatches();
})
</script>
<style lang="scss">
.whole-section {
    max-width: 1400px;
  width: 95%;
  margin: 30px auto;
}
.section-guess {
  background: #3469E4;
  border: 1px solid #C0BCB74D;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 30px;
  justify-content: center;
  align-items:  flex-start;
  font-family: Microsoft YaHei UI;
  border-radius: 15px;
  color: #ffffff;
  .date {
    font-size: 1em;
    font-weight: 700;
    line-height: 1.1em;
  }
  .match-details {
    font-size: .8em;
    font-weight: 400;
    line-height: 1em;

  }
  .winloss-matches {
    display: flex;
    gap: 25px;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    .match {
      border-radius: 15px;
      background: #3EA2FF;
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: flex-start;
      padding: 10px;

      .toprow {
        min-height: 80px;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
      }
      .date-time {
        color: #FFF849;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: .8rem;
        gap: 10px;
      }
      .team {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
        .team-details {
          // font-size: 1.1rem;
          font-size: .9rem;
          .teamicon {
            width: 30px;
            border: 1px solid #ffffff;
            border-radius: 3px;
            overflow: hidden;
            img {
              width: 100%;
              display: block;
            }
          }
        }
      }
      .match-btn {
        background: linear-gradient(180deg, #FFFFFF 0%, #61D0FF 100%);
        color: #3469E4;
        font-weight: bold;
        padding: 2px 10px;
        font-size: 1.3rem;
        border-radius: 15px;
        width: 90px;
        text-align: center;
        cursor: pointer;

        &:hover{
          filter:brightness(0.9);
        }
        &:active{
          filter:brightness(0.85);
          opacity: 0.9;
          transform: translate(0px,1px);
        }
      }
    }
  }
}
.section-activity {
  font-size: 22px;
  .title-img {
    margin: 10px auto;
    max-width: 900px;
    img {
      width: 100%;
    }
  }
  .sub-desc {
    color: #ffffff;
    font-size: 1.3rem;
    margin: 10px auto;
    text-align: center;
  }
  table {
    width: 100%;
    text-align: center;
    thead {
      tr{
        background: #0047FF;
        th {
          padding: 10px;
          background-color: unset !important;
          border: 1px solid #3C93FF;
          color: #CFF6FF;
        }
      }
    }
    tbody {
      tr {
        background: #89ADFF42;
        td {
          padding: 10px;
          background-color: unset !important;
          color: #CFF6FF;

          border: 1px solid #3C93FF;
        }
      }
    }
  }
  .note {
    color: #FFF500;
    font-size: 1rem;
    margin-top: 10px;
  }
}
.section-rules {
  font-size: 22px;
  .title-img {
    max-width: 900px;
    margin: 10px auto;
    img {
      width: 100%;
    }
  }
  ol {
    li {
      color: #ffffff;
      font-size: 1.3rem;
      line-height: 1.5rem;
      margin-bottom: .8rem;
    }
  }
}

.dialog-header {
  text-align: center;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}

</style>
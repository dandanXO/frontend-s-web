<template>
  <div class="luck8-box">
    <div class="luck8-container">
      <div class="luck8-game-money-info">
        <div class="title"></div>
        <!-- <div style="color:#ff0000;font-size:40px;" v-if="store.memberType==='TEST' || store.memberType==='PROMO_TEST'">
          还没完成，不要测试先。
        </div> -->
        <table class="luck8-game-info-table">
          <tbody>
            <tr>
              <th>电游平台</th>
              <th>游戏时间</th>
              <th>获奖注单号</th>
              <th>投注金额</th>
              <th>活动彩金</th>
              <th>操作</th>
            </tr>

            <tr v-for="(item, index) in tableData" :key="index">
              <td>
                {{ item.platform }}
                <!-- <span class="inner-time">{{ item.time }}</span> -->
              </td>
              <td>{{ item.betTime }}</td>
              <td>{{ item.betId }}</td>
              <td>{{ item.bet }}</td>
              <td>{{ item.prizeAmount }}</td>
              <td>
                <button
                  @click="!item.claimTime ? handleSubmitVote(item) : null"
                  :class="
                    item.claimTime ? 'option-btn-redeemed' : hasClaimed ? 'option-btn-disable' : 'option-btn-active'
                  "
                >
                  {{ item.claimTime ? "已领取" : hasClaimed ? "已失效" : "领取" }}
                </button>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="6">暂无数据</td>
            </tr>
          </tbody>
        </table>
        <div class="little-title" style="margin-top: 20px">
          <div class="left">申请方式</div>
          <div class="right">
            会员获得符合活动金额注单号，注单产生当日
            23:59:59内，通过活动详情页的领奖处点击领取彩金，彩金立即派发至中心钱包，逾期视为放弃。
          </div>
        </div>
        <div class="little-title" style="margin-bottom: 0px">
          <div class="" style="width: 116px; margin-right: 16px"></div>
          <div class="right red-font">注意：获奖的注单可能会有延迟，请每 5~10 分钟刷新一次活动页面</div>
        </div>
      </div>
      <div class="luck8-game-info">
        <div class="title"></div>
        <div class="little-title">
          <div class="left">活动场馆</div>
          <div class="right">PG电子、PT电子、PA电子</div>
        </div>
        <div class="little-title">
          <div class="left">活动内容</div>
          <div class="right">
            只要您在电子游戏中产生以下幸运注单号即可获得相对应的倍数彩金，最高赠送金额 2,888
            元！只看投注不管输赢，您的走运钱送的给力！
          </div>
        </div>
        <table class="luck8-game-info-table-2">
          <tbody>
            <tr>
              <th>注单编号</th>
              <th>获得投注金额倍数</th>
              <th>加赠最高礼金</th>
              <th>流水要求</th>
            </tr>
            <tr>
              <td>********888</td>
              <td>3</td>
              <td>388 元</td>
              <td rowspan="4">8 倍</td>
            </tr>
            <tr>
              <td>*******8888</td>
              <td>5</td>
              <td>888 元</td>
            </tr>
            <tr>
              <td>******88888</td>
              <td>8</td>
              <td>1,888 元</td>
            </tr>
            <tr>
              <td>*****888888</td>
              <td>10</td>
              <td>2,888 元</td>
            </tr>
          </tbody>
        </table>
        <div class="little2-title">
          <div
            style="margin-right: 4px; display: inline-block; width: 4px; height: 16px; background-color: #4ba5ff"
          ></div>
          范例
        </div>
        <div class="little2-content">
          会员 A 在任一电子娱乐游戏投注，获得注单编号******8888，该笔注单投注金额为 100，即可获得 5 X 100 =500 元
          幸运注单守护金。
        </div>
      </div>
      <div class="luck8-game-bottom-rule">
        <div class="title"></div>
        <div class="content">
          <div class="item">
            1.所中奖的注单请在北京时间当天 23:59 分前通过优惠活动详情页点击领取彩金
            (路径：电子幸运注单活动页->领取彩金)，逾期申请则视为自动放弃，彩金八倍流水即可提款；
          </div>
          <div class="item">
            2.投注中奖注单只限北京时间当日有效，免费旋转注单、投注额小于5元的注单不可参与此优惠，每位会员每天仅限申请一次，每个注单仅限申请一种优惠，不可使用同一笔注单申请多种官网优惠；
          </div>
          <div class="item">3.彩金不可购买免费旋转机会，不可投注捕鱼游戏；</div>
          <div class="item">
            4.同一手机号、姓名、邮箱地址、银行卡号、IP
            地址等身份认证信息视为同一账号，仅限一个账号参与、任何团体或个人以非法方式套取优惠（如投注对冲等），平台保留在不提前通知情况下做出处理；
          </div>
          <div class="item">5.为避免文字理解差异，如有疑问可联系在线客服，兴发电竞保留活动最终解释权；</div>
        </div>
      </div>

      <el-dialog
        v-model="tableRecordDialog"
        width="800px"
        align-center
        :close-on-click-modal="false"
        class="luck8-table-record-dialog"
      >
        <template #header>
          <div class="title"></div>
        </template>
        <div class="record-dialog-container">
          <table class="record-table">
            <thead>
              <tr>
                <th>投票时间</th>
                <th>参赛队伍</th>
                <th>投票队伍</th>
                <th>投票结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in recordList" :key="index">
                <td>{{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}</td>
                <td>{{ `${record.homeTeam}VS${record.awayTeam}` }}</td>
                <td>{{ displayTeamVictory(record) }}</td>
                <td :style="{ color: displayGuessResult(record).color }">{{ displayGuessResult(record).text }}</td>
              </tr>
              <!-- <tr>
                <td>2024-05-11 16:00</td>
                <td>老鹰 vs 火箭</td>
                <td>老鹰胜</td>
                <td style="color: #ff5151">错误</td>
              </tr>
              <tr>
                <td>2024-05-11 16:00</td>
                <td>老鹰 vs 火箭</td>
                <td>平局</td>
                <td style="color: #7a8eb9">未出结果</td>
              </tr> -->
            </tbody>
          </table>
        </div>
      </el-dialog>
      <el-dialog v-model="confirmVoteDialog" width="500px" align-center persistent title="投票">
        <div class="dialog-header" v-if="submitParam.team === 'DRAW'">您确定要投"平局"吗？</div>
        <div class="dialog-header" v-else>您确定要把票投给 {{ submitParam.team }} 吗？</div>
        <div class="dialog-footer">
          <el-button color="grey" @click="confirmVoteDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitVote()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import moment from "moment";
import { getSlotLucky8, submitSlotLucky8 } from "@/api/promotion/slotlucky";
import { ElMessage } from "element-plus";
import { useLocalStorage } from "@vueuse/core";
import { userStore } from "@/store";
const props = defineProps(["promoCode"]);
const promoCode = ref(props.promoCode);

const tableRecordDialog = ref(false);
const confirmVoteDialog = ref(false);

const tableData = ref([]);

const store = userStore();

const recordList = ref([]);

const hasClaimed = computed(() => tableData.value?.some((item) => item.claimTime));

const handleSubmitVote = (item) => {
  submitSlotLucky8(promoCode.value, item.id)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success({
          type: "success",
          message: "领取成功"
        });
        getSlotLucky8Data();
        store.getBalance();
      } else {
        ElMessage.error(res.message);
      }
    })
    .catch(() => {
      ElMessage.error(res.message);
    });
};
const displayTeamVictory = (record) => {
  if (record.teamChosen === "DRAW") return "平局";
  return record.teamChosen + "胜";
};
const displayGuessResult = (record) => {
  if (record.status !== "SETTLED" && record.status !== "PENDING_SETTLE") {
    return { text: "结果未出", color: "#7a8eb9" };
  } else if (record.teamChosen === "DRAW") {
    if (record.homeTeamResult === record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else if (record.homeTeam === record.teamChosen) {
    if (record.homeTeamResult > record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else if (record.awayTeam === record.teamChosen) {
    if (record.homeTeamResult < record.awayTeamResult) {
      return { text: "正确", color: "#51acff" };
    } else {
      return { text: "错误", color: "#ff5151" };
    }
  } else {
    return { text: "", color: "#51acff" };
  }
};

const getSlotLucky8Data = async () => {
  const res = await getSlotLucky8(promoCode.value);
  tableData.value = res.data;
};

onMounted(getSlotLucky8Data);
</script>

<style scoped lang="scss">
.luck8-box {
  font-family: PingFang TC;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.luck8-container {
  width: 1200px;
  height: 100%;
}

.luck8-game {
  width: 100%;
  height: 302px;
  border-radius: 12px;
  border: 1px solid #51acff;
  background-color: #fff;
  position: relative;
  margin-bottom: 12px;
  .luck8-game-status {
    width: 240px;
    height: 40px;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.luck8-game-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 40px;

  .luck8-game-content-left,
  .luck8-game-content-right {
    flex: 1;
    .luck8-game-content-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .luck8-game-icon {
        width: 80px;
        height: 80px;
      }
      .luck8-game-content-team-name {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: 12px;
        margin-bottom: 24px;
      }
    }
  }
  .luck8-game-content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .luck8-game-content-center-time {
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
      color: #479af7;
      border-radius: 30px;
      padding: 8px 44px;
      background: #edf4ff;
      margin-bottom: 15px;
    }
    .luck8-game-content-center-schedule {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #1b1b1b99;
      margin-bottom: 33px;
    }
  }
}

.luck8-game-content-btn {
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #00000066;
  background-image: url("../../../assets/promo/lh-luck8/btn.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 180px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nba2-match-game-content-btn__pseudo {
  height: 58px;
}

.luck8-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .luck8-game-bottom-left-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    color: #000000;
  }
  .luck8-game-bottom-left-btn {
    font-size: 16px;
    font-weight: 600;
    line-height: 22.4px;
    color: #479af7;
    cursor: pointer;
  }
}
.luck8-game-money-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    background-image: url("../../../assets/promo/lh-luck8/money-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 40px;
  }

  .little-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    .left {
      background-image: url("../../../assets/promo/lh-luck8/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
      width: 100%;

      &.red-font {
        color: #f53434;
      }
    }
  }
}
.luck8-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;

  .little2-title {
    width: 100%;
    font-family: PingFang TC;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: -0.02em;
    text-align: left;
    color: #4ba5ff;
    margin-top: 20px;
  }
  .little2-content {
    width: 100%;
    font-family: PingFang TC;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: -0.02em;
    text-align: left;
  }

  .title {
    background-image: url("../../../assets/promo/lh-luck8/info-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 40px;
  }
  .little-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    .left {
      background-image: url("../../../assets/promo/lh-luck8/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 120px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #000000;
      width: 100%;
    }
  }
}

.luck8-game-info-table-2 {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  margin: 12px 0;
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}
.luck8-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  margin-top: 12px;
  th {
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    &:first-child {
      border-top-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  tr {
    &:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 12px;
        }
      }
    }
    &:last-child {
      td {
        &:last-child {
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    border: 1px solid #acd4f6;
    height: 56px;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}
.option-btn-active {
  width: 120px;
  height: 36px;
  border-radius: 100px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
}
.option-btn-redeemed {
  width: 120px;
  height: 36px;
  border-radius: 100px;
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(180deg, #48d179 0%, #00a63a 100%);
  pointer-events: none;
}
.option-btn-disable {
  width: 120px;
  height: 36px;
  border-radius: 100px;
  background: rgba(217, 217, 217, 1);
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.luck8-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    background-image: url("../../../assets/promo/lh-luck8/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 738px;
    height: 44px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    color: #000000;
    .item {
      text-indent: -16px;
      padding-left: 24px;
    }
  }
}

:deep(.luck8-table-record-dialog) {
  width: 1000px;
  height: 652px;
  .el-dialog__header {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-dialog__header .el-dialog__headerbtn {
    background: url(../../../assets/promo/lh-luck8/close-btn.png);
    content-visibility: hidden;
    background-size: contain;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 24px;
  }
  .el-dialog__body {
    padding: 20px;
  }

  .record-dialog-container {
    width: 960px;
    height: 100%;
  }

  .title {
    background-image: url("../../../assets/promo/lh-luck8/record-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 536px;
    height: 32px;
    margin-top: 20px;
  }

  .record-table {
    width: 100%;
    height: 100%;
    th {
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #fff;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      vertical-align: middle;
      text-align: left;

      &:first-child {
        border-top-left-radius: 6px;
      }
      &:last-child {
        border-top-right-radius: 6px;
      }
    }
    tr {
      height: 56px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #7a8eb9;
      vertical-align: middle;
      text-align: left;
      &:nth-child(odd) {
        background: #f2f8fe;
      }
      &:nth-child(even) {
        background: #fff;
      }
      th {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      td {
        &:first-child {
          padding-left: 20px;
        }
        &:last-child {
          text-align: right;
          padding-right: 14px;
        }
      }

      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 6px;
          }
        }
      }
      &:last-child {
        td {
          &:last-child {
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
  }
}

.dialog-header {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>

<template>
  <div class="privilege-invite-container">
    <div>
      <img class="banner" src="../assets/images/privilege-invite/top-banner1.jpg" />
    </div>
    <div>
      <!-- tabs -->
      <div class="tabs">
        <div :class="{ tab: 'tab', active: activeKey === 1 }" @click="changeTab(1)">
          <h3>邀请首存奖金</h3>
        </div>
        <div :class="{ tab: 'tab', active: activeKey === 2 }" @click="changeTab(2)">
          <h3>邀请周存送</h3>
        </div>
        <div :class="{ tab: 'tab', active: activeKey === 3 }" @click="changeTab(3)">
          <h3>好友流水返利</h3>
        </div>
      </div>

      <!-- tab content -->
      <div v-if="activeKey === 1" class="tab-content">
        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-time.png"
            width="560"
            height="28"
          />
          <p>2022年11月17日00:00起</p>
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-content.png"
            width="560"
            height="28"
          />
          <p>
            东赢用户打开：个人中心--点击“呼朋唤友”复制推广链接，通过QQ、微信、论坛、贴吧、微博等方式分享，成功邀请好友即
            可获得现金奖励！
          </p>
          <p class="check-record-btn" @click="toggleCheckRecordModal(true)">查看我的推广记录</p>
          <button class="share-btn" @click="shareInvite">立刻分享</button>
          <div class="rebate-table-wrapper">
            <table border="0">
              <tr>
                <td>推荐新用户首存金额</td>
                <td>邀请人彩金</td>
                <td>被邀请人彩金</td>
                <td>流水要求</td>
              </tr>
              <tr>
                <td>≥100</td>
                <td>18元</td>
                <td>18元</td>
                <td rowspan="6">
                  3倍/
                  <br />
                  不限制场馆
                </td>
              </tr>
              <tr>
                <td>≥1,000</td>
                <td>58元</td>
                <td>58元</td>
              </tr>
              <tr>
                <td>≥5,000</td>
                <td>108元</td>
                <td>108元</td>
              </tr>
              <tr>
                <td>≥10,000</td>
                <td>288元</td>
                <td>288元</td>
              </tr>
              <tr>
                <td>≥30,000</td>
                <td>888元</td>
                <td>888元</td>
              </tr>
              <tr>
                <td>≥50,000</td>
                <td>1,088元</td>
                <td>1,088元</td>
              </tr>
              <tr>
                <td>≥100,000</td>
                <td>1,888元</td>
                <td>1,888元</td>
                <td></td>
              </tr>
            </table>
          </div>
          <!-- <div class="rebate-table">
            <div class="rebate-header">推荐新用户首存金额</div>
            <div class="rebate-header">可获得推荐奖金</div>
            <div class="rebate-header">流水要求</div>

            <div class="rebate-list bg-dark">≥100</div>
            <div class="rebate-list bg-dark">28</div>
            <div class="rebate-list bg-dark"></div>

            <div class="rebate-list">≥1,000</div>
            <div class="rebate-list">108</div>
            <div class="rebate-list"></div>

            <div class="rebate-list bg-dark">≥5,000</div>
            <div class="rebate-list bg-dark">158</div>
            <div class="rebate-list bg-dark">3倍/不限制场馆</div>

            <div class="rebate-list">≥10,000</div>
            <div class="rebate-list">388</div>
            <div class="rebate-list"></div>

            <div class="rebate-list bg-dark">≥30,000</div>
            <div class="rebate-list bg-dark">1588</div>
            <div class="rebate-list bg-dark"></div>

            <div class="rebate-list">≥50,000</div>
            <div class="rebate-list">1888</div>
            <div class="rebate-list"></div>
          </div> -->

          <p class="example-text">例：会员A邀请一位好友首存1,000元，会员A可获得58元，被邀请人可获得58元；</p>
        </div>
        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-rules.png"
            width="560"
            height="28"
          />

          <div class="rules">
            <ol>
              <li>邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。</li>
              <li>每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，双方都可获得彩金，邀请人最高可获得1,888元。</li>
              <li>本活动仅计算被推荐人首次单笔充值金额，非累计及第二笔以上充值金额计算。</li>
              <li>您每邀请一位新会员，被邀请人的第一笔首存金额达到对应档位，即可在次日24小时内获得对应档位彩金，彩金3倍流水即可提款。</li>
              <li>邀请人等级不得低于 VIP1。</li>
              <li>被推荐人注册后，无首次充值时间限制，完成首笔充值达到门槛即可参与。</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，将即刻终止发放奖金。</li>
              <li>任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注，以及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额。</li>
              <li>邀请人与受邀请人必须为不同身份的真实玩家。每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。如发现有违规行为，我们保留在任何时候停止、取消优惠或索回已支付全部优惠的权利。</li>
              <li>为避免文字理解差异，本站保留此活动的最终解释权。</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 2" class="tab-content">
        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-time.png"
            width="560"
            height="28"
          />
          <p>2022年11月17日00:00起</p>
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-content.png"
            width="560"
            height="28"
          />
          <p>
            活动期间，通过您的推广链接进行注册，并达到周累计存款要求，您和受邀请人均可获得该累计存款金额 1%
            的新人奖励，最高单周可获得 88888 元哦！
          </p>
          <p class="check-record-btn" @click="toggleCheckRecordModal(true)">查看我的推广记录</p>
          <button class="share-btn" @click="shareInvite">立刻分享</button>

          <div class="rebate-table rebate-table-tab2">
            <div class="rebate-header">邀请人等级要求</div>
            <div class="rebate-header">好友周累计存款</div>
            <div class="rebate-header">邀请人比例</div>
            <div class="rebate-header">受邀请人比例</div>
            <div class="rebate-header">好友周累计存款</div>
            <div class="rebate-header">流水要求</div>

            <div class="rebate-list bg-dark">VIP2</div>
            <div class="rebate-list bg-dark">≥5,000元</div>
            <div class="rebate-list bg-dark">&nbsp;</div>
            <div class="rebate-list bg-dark">&nbsp;</div>
            <div class="rebate-list bg-dark">88元</div>
            <div class="rebate-list bg-dark"></div>

            <div class="rebate-list">VIP3-VIP4</div>
            <div class="rebate-list">≥10,000元</div>
            <div class="rebate-list"></div>
            <div class="rebate-list"></div>
            <div class="rebate-list">188元</div>
            <div class="rebate-list"></div>

            <div class="rebate-list bg-dark">VIP5-VIP6</div>
            <div class="rebate-list bg-dark">≥50,000元</div>
            <div class="rebate-list bg-dark">1%</div>
            <div class="rebate-list bg-dark">1%</div>
            <div class="rebate-list bg-dark">388元</div>
            <div class="rebate-list bg-dark">1倍/不限场馆</div>

            <div class="rebate-list">VIP7-VIP8</div>
            <div class="rebate-list">≥100,000元</div>
            <div class="rebate-list"></div>
            <div class="rebate-list"></div>
            <div class="rebate-list">888元</div>
            <div class="rebate-list"></div>

            <div class="rebate-list bg-dark">VIP9</div>
            <div class="rebate-list bg-dark">≥500,000元</div>
            <div class="rebate-list bg-dark">&nbsp;</div>
            <div class="rebate-list bg-dark">&nbsp;</div>
            <div class="rebate-list bg-dark">8888元</div>
            <div class="rebate-list bg-dark"></div>

            <div class="rebate-list">VIP10</div>
            <div class="rebate-list">≥1,000,000元</div>
            <div class="rebate-list"></div>
            <div class="rebate-list"></div>
            <div class="rebate-list">88888元</div>
            <div class="rebate-list"></div>
          </div>

          <p class="example-text">
            例如：邀请人等级为VIP2，被邀请人周累计存款达到10000元，x1%=100元，
            按照等级对应奖金上限，则各派发88元，奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户
          </p>
        </div>

        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-rules.png"
            width="560"
            height="28"
          />

          <div class="rules">
            <ol>
              <li>邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。</li>
              <li>每个通过您的推广链接进行注册，并达到周累计存款≥5000元的用户，您和受邀请人均可获得该累计存款金额 1% 的新人奖励。周累计存款统计时间为自然周（每周一00:00至周日23:59）。</li>
              <li>您每邀请一位新会员，从注册的日期开始算起，可享 4 次邀请周累存送。符合获取条件奖金的会员，将会在每个自然周一 00:00:00 - 23:59:59 内由系统自动派发奖金至主钱包，并更新剩余获取奖金次数；逾期将视为自动放弃。</li>
              <li>任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注，以及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额。</li>
              <li>邀请人与受邀请人必须为不同身份的真实玩家。每位有效玩家、手机号码、电子邮箱、银行卡、IP 地址、每台设备只能使用一个账号享受优惠。如发现有违规行为，我们保留在任何时候停止、取消优惠或索回已支付全部优惠的权利。</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，将即刻终止发放奖金。</li>
              <li>为避免文字理解差异，东赢电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 3" class="tab-content">
        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-time.png"
            width="560"
            height="28"
          />
          <p>2022年11月17日00:00起</p>
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-content.png"
            width="560"
            height="28"
          />
          <p>活动期间，邀请人可获得每个好友从其注册时间开始计算15天的有效投注额0.4%的返利，无上限。</p>
          <p class="check-record-btn" @click="toggleCheckRecordModal(true)">查看我的推广记录</p>

          <div class="info-box">
            <div class="info-item">
              <div class="info-top">昨日好友投注总额</div>
              <div class="info-content yesterday-bet">{{ `${rebateInfo.yesterdayFriendBet || 0.0} 元` }}</div>
            </div>

            <div class="info-item">
              <div class="info-top">累计待派返利</div>
              <div class="info-content today-bonus">{{ `${rebateInfo.pendingRebate || 0.0} 元` }}</div>
            </div>

            <div class="info-item">
              <div class="info-top">近15天累计返利</div>
              <div class="info-content total-bouns">{{ `${rebateInfo.fifteenDaysRebate || 0.0} 元` }}</div>
            </div>
          </div>

          <button class="share-btn" @click="shareInvite">立刻分享</button>
        </div>

        <div class="tab-section">
          <img
            class="title-banner-image"
            src="../assets/images/privilege-invite/act-rules.png"
            width="560"
            height="28"
          />

          <div class="rules">
            <ol>
              <li>邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。</li>
              <li>活动有效投注额返利期限为15天，即从您好友注册时间开始算起。</li>
              <li>有效投注仅计算：体育场馆和电竞场馆的有效投注额（IM体育以美东时间计算为准）。</li>
              <li>每日有效投注返利结算发放时间为：奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户（发放前一日的有效投注返利）；奖金最低派发为1元，等于1元不派发，奖金只需1倍有效流水即可提款。</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，将即刻终止发放奖金。</li>
              <li>任何低于欧洲盘1.7或亚洲盘0.7水位的投注，以及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额。</li>
              <li>邀请人与受邀请人必须为不同身份的真实玩家。每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。如发现有违规者，我们保留在任何时候停止、取消优惠或索回已支付全部优惠的权利。</li>
              <li>为避免文字理解差异，东赢电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </div>
      </div>

      <el-dialog
        v-model="isCheckRecordModalVisible"
        title=""
        width="100%"
        align-center
        style="max-width: 800px"
        @close="toggleCheckRecordModal(false)"
      >
        <div class="record-modal-container">
          <button type="button" class="close close-btn" @click="toggleCheckRecordModal(false)">
            <span aria-hidden="true">×</span>
          </button>

          <div class="record-title">
            <img src="../assets/images/privilege-invite/record-title.png" />
          </div>
          <div class="record-selection">
            <div class="input-row">
              <label>返利类型</label>
              <select class="record-select-input record-type" v-model="checkRecordFormData.recordType">
                <option value="INVITER">邀请返利</option>
                <option value="INVITEES">受邀返利</option>
              </select>
            </div>
            <div class="input-row">
              <label>活动类型</label>
              <select class="record-select-input privilege-type" v-model="checkRecordFormData.privilegeType">
                <option value="WeekFirstDeposit">邀请首存送</option>
                <option value="WeekTotal">邀请周存送</option>
                <option value="Bet">返利无上限</option>
              </select>
            </div>
            <div class="input-row">&nbsp;</div>

            <div class="input-row">
              <label>选择日期</label>
              <input class="input-datetime" valueFormat="dd/mm/yyyy" type="date" v-model="checkRecordFormData.date" />
            </div>
            <div class="input-row" id="input-user-row">
              <label>用户名</label>
              <input class="input-user" placeholder="请输入" type="text" v-model="checkRecordFormData.user" />
            </div>
            <div class="input-row">
              <button class="search-btn" @click="getRecords">查询</button>
            </div>
          </div>
          <div class="record-content">
            <div class="record-table" id="recordBody">
              <div class="rebate-header">用户名</div>
              <div class="rebate-header">首存金额</div>
              <div class="rebate-header">今日已获返利</div>
            </div>
            <div class="no-item-table" v-if="tableRecords.length === 0">
              <p>暂无数据</p>
            </div>
            <div class="record-table" v-else>
              <template v-for="list of tableRecords">
                <div>{{ list.loginName }}</div>
                <div>{{ list.depositOrBet }}</div>
                <div>{{ list.bonusAmount }}</div>
              </template>
            </div>
            <!--            <div class="listing-footer">-->
            <!--              <div class="footer-div">-->
            <!--                <span class="pointer-s prev-page">&nbsp;&lt;&nbsp;&nbsp;</span>-->
            <!--                <div class="footer-page">-->
            <!--                  <span id="record_page">1/1</span>-->
            <!--                </div>-->
            <!--                <span class="pointer-s next-page">&nbsp;&nbsp;&gt;&nbsp;</span>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import moment from "moment";
import { useRoute, useRouter } from "vue-router";

import { getRecommendPrivilegeRecord, getRebateInfo } from "@/api/privilegeInvite/privilegeInvite";
import { userStore } from "@/store/index";

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute();
    const store = userStore();
    const activeKey = ref(1);

    const isCheckRecordModalVisible = ref(false);
    const rebateInfo = ref({
      fifteenDaysRebate: 0,
      pendingRebate: 0,
      yesterdayFriendBet: 0
    });
    const checkRecordFormData = reactive({
      recordType: "INVITER",
      privilegeType: "WeekFirstDeposit",
      date: moment().utcOffset("+08:00").format("YYYY-MM-DD"),
      user: ""
    });
    const router = useRouter();

    const changeTab = (tabNum) => {
      activeKey.value = tabNum;
    };

    const toggleCheckRecordModal = (toggleStatus) => {
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

      isCheckRecordModalVisible.value = toggleStatus;
    };

    const tableRecords = ref([]);
    const getRecords = () => {
      const params = {
        rebateType: checkRecordFormData.recordType,
        bonusType: checkRecordFormData.privilegeType,
        date: checkRecordFormData.date,
        loginName: checkRecordFormData.user,
        token: store.token
      };
      tableRecords.value = [];
      getRecommendPrivilegeRecord(params).then((data) => {
        console.log("here", data);
        tableRecords.value = data.data;
      });
    };

    const shareInvite = () => {
      router.push("/center/share");
    };

    onMounted(() => {
      if (!store.token) {
          return
      }
      getRebateInfo().then((data) => {
        rebateInfo.value = data;
      });

      const type = route.query.type ?? "";
      if (type) {
        activeKey.value = parseInt(type);
      }
    });

    return {
      activeKey,
      changeTab,
      isCheckRecordModalVisible,
      toggleCheckRecordModal,
      getRecords,
      checkRecordFormData,
      shareInvite,
      rebateInfo,
      tableRecords
    };
  }
});
</script>

<style scoped lang="scss">
$gold: #efcf68;

.privilege-invite-container {
  display: flex;
  flex-direction: column;

  .banner {
    width: 100%;
    height: auto;
  }

  .tabs {
    display: flex;
    justify-content: center;
    gap: 25px;
    align-items: center;
    margin: 24px auto;

    .tab {
      background: url(../assets/images/privilege-invite/tab-bg.png);
      width: 328px;
      height: 118px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.active {
        background: url(../assets/images/privilege-invite/tab-bg-active.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      h3 {
        font-size: 32px;
        color: #11131f;
        font-family: "Microsoft YaHei";
        font-weight: 800;
      }
    }
  }

  .tab-section {
    height: fit-content;
    width: 1000px;
    background-image: url(../assets/images/privilege-invite/tab-content.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto 20px;
    padding: 30px 25px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    text-align: center;
  }

  .title-banner-image {
    margin-top: 10px;
    text-align: center;
    margin-bottom: 30px;
  }

  p {
    font-size: 16px;
    color: #000;
    margin-bottom: 16px;
    line-height: 32px;
  }

  .check-record-btn {
    color: #b89523;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .info-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin: 30px auto 20px;
  }

  .info-item {
    width: 280px;
    height: 140px;
    border: solid 1px $gold;
  }

  .info-top {
    width: 280px;
    height: 50px;
    background-color: $gold;
    text-align: center;
    color: #11131f;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 18px;
    font-weight: 700;
  }

  .info-content {
    width: 280px;
    height: 90px;

    text-align: center;
    color: #b89523;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 18px;
    font-weight: 700;
  }

  .share-btn {
    font-size: 22px;
    font-weight: 800;
    line-height: 36px;
    letter-spacing: 1px;
    color: #11131f;
    width: 220px;
    height: 50px;
    background-color: $gold;
    border-radius: 25px;
    border: 0px;
    margin: 20px auto 15px;
  }

  .rebate-table-wrapper {
    width: 100%;
    margin-top: 20px;
    margin: 35px 6px 35px;

    table {
      width: 100%;
      text-align: center;
      border-collapse: collapse;

      tr:first-child td {
        height: 50px;
        background-color: $gold;
        color: #11131f;
      }

      tr td {
        border: 1px solid #b3b3b3 !important;
        font-size: 18px;
        font-weight: 600;
        height: 50px;
      }

      tr:nth-child(even) {
        background-color: #ebe2b5;
      }
    }
  }

  .rebate-table {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    margin: 35px 6px 35px;
    width: 100%;
    font-size: 18px;
  }

  .rebate-table-tab2 {
    display: grid;
    align-items: center;
    grid-template-columns: 3fr 3fr 2fr 2fr 3fr 2fr;
    margin: 35px 0px 35px;
  }

  .rebate-header,
  .rebate-list {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }

  .rebate-header {
    height: 50px;
    background-color: $gold;
    color: #11131f;
  }

  .rebate-list {
    height: 40px;
    color: #000;

    &.bg-dark {
      background-color: #ebe2b5;
    }
  }

  .example-text {
    color: #0bb013;
    line-height: 32px;
    width: 90%;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 30px;
  }

  .rules {
    margin-bottom: 30px;
    text-align: left;

    li {
      font-size: 16px;
      color: #000;
      margin-bottom: 16px;
      line-height: 32px;
    }
  }

  .record-modal-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 20px 25px 50px;

    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 35px;
    }

    .record-title {
      margin-top: 10px;
      text-align: center;
      margin-bottom: 30px;
    }

    .record-selection {
      display: grid;
      grid-template-columns: auto auto auto;

      label {
        display: inline-block;
        width: 82px;
        text-align: right;
        color: #000000;
        font-size: 18px;
        padding-right: 5px;
        font-weight: 400;
      }

      .record-select-input {
        width: 160px;
        height: 40px;
        background-color: #f5f5f5;
        border: solid 1px #b89523;
        color: #000000;
        font-size: 16px;
        border-radius: 4px;
      }

      .input-row {
        margin-bottom: 16px;
      }

      .input-user {
        width: 150px;
        height: 40px;
        background-color: #f5f5f5;
        border: solid 1px #b89523;
        color: #000000;
        font-size: 16px;
        border-radius: 4px;
        padding-left: 4px;
        padding-right: 4px;
      }

      .input-datetime {
        width: 150px;
        height: 40px;
        background-color: #f5f5f5;
        border: solid 1px #b89523;
        color: #000000;
        font-size: 16px;
        border-radius: 4px;
        padding-left: 4px;
        padding-right: 4px;
      }

      .search-btn {
        width: 150px;
        height: 40px;
        background-color: #fcec97;
        border-radius: 30px;
        display: flex;
        border: 0px;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .record-table {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin: 16px auto 0px;
      width: 100%;
    }

    .no-item-table {
      width: 100%;
      background-color: #ebe2b5 !important;
      height: 40px;

      > p {
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0px;
        height: 100%;
      }
    }

    .listing-footer {
      font-size: 16px;
      margin: 0px auto;
      padding: 14px 20px;
      border-top: 1px solid #fddfaa;
    }

    .footer-div {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pointer-s {
      cursor: pointer;
      background-color: #fcec97;
      color: #0a0b13;
      border-radius: 50%;
      font-size: 12px;
      height: 25px;
      width: 25px;
      line-height: 25px;
      text-align: center;
      font-weight: 800;
    }

    .footer-page {
      margin: 0px 5px;
      color: #efcf68;
    }
  }
}
</style>

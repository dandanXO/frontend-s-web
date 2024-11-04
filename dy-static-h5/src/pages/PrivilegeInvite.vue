<template>
  <div class="privilege-invite-container">
    <div>
      <img class="banner" src="../assets/images/privilege-invite/top-banner.jpg" />
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
          <div class="rebate-table">
            <div class="rebate-header">推荐新用户首存金额</div>
            <div class="rebate-header">可获得推荐奖金</div>
            <div class="rebate-header">流水要求</div>

            <div class="rebate-list bg-dark">≥100</div>
            <div class="rebate-list bg-dark">8元</div>
            <div class="rebate-list bg-dark"></div>

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
          </div>

          <p class="example-text">
            例如：会员A邀请一位好友首存100元，则可获取8元奖金；若想获取下一档位38元，则需好友再次存1000元；
            奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户，
            如果下周您邀请的好友依旧符合存款金额，那么您在下周会再次获得对应奖金。
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
            <p>
              1.每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，在单周内
              邀请人能最高可获得1472元。
            </p>
            <p>
              2.您每邀请一位新会员，从注册的日期开始算起，可享受4次推荐奖金，每个自然周一 00:00
              刷新1次，期间每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃。
            </p>
            <p>
              3.例如：会员A邀请一位好友首存100元，则可获取8元奖金；若想获取下一档位38元，则需好友再次存1000元；奖金将会自动派
              发至主钱包。
            </p>
            <p>4.邀请人等级不得低于vip1。</p>
            <p>5.普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金</p>
            <p>
              6.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
              注额内。
            </p>
            <p>
              7.邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
              个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
            </p>
            <p>8.为避免文字理解差异，东赢电竞保留此活动最终解释权。</p>
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
            <p>
              1.每个通过您的推广链接进行注册，并达到周累计存款≥5000元的用户，您和受邀请人均可获得该累计存款金额 1%
              的新人奖励。 周累计存款统计时间为自然周（每周一00:00至周日23:59）。
            </p>
            <p>
              2.您每邀请一位新会员，从注册的日期开始算起，可享4次邀请周累存送，符合获取条件奖金的会员，将会在每个自然周一00:00:00
              - 23:59:59内系统自动派发奖金至主钱包，并更新剩余获取奖金次数；逾期将会视为自动放弃。
            </p>
            <p>
              3.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
              注额内。
            </p>
            <p>
              4.邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
              个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
            </p>
            <p>
              5.普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金。
            </p>
            <p>6.为避免文字理解差异，东赢电竞保留此活动最终解释权。</p>
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
            <p>1.活动有效投注额返利期限为15天，即：从您好友注册时间开始算起。</p>
            <p>2.有效投注仅计算：体育场馆和电竞场馆的有效投注额。（IM体育以美东时间计算为准）</p>
            <p>
              3.每日有效投注返利结算发放时间为：奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户（发放前一日的有效投注返利）;
              奖金最低派发为1元，等于1元不 派发，奖金只需1倍有效流水提款。
            </p>
            <p>4.普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金</p>
            <p>
              5.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
              注额内。
            </p>
            <p>
              6.邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
              个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
            </p>
            <p>7.为避免文字理解差异，东赢电竞保留此活动最终解释权。</p>
          </div>
        </div>
      </div>

      <q-dialog
        v-model="isCheckRecordModalVisible"
        title=""
        width="100%"
        align-center
        style="max-width: 800px"
        @close="toggleCheckRecordModal(false)"
      >
        <q-card style="width: 100%">
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
              <div class="no-item-table">
                <p>暂无数据</p>
              </div>
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
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import moment from "moment";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
import { getRecommendPrivilegeRecord, getRebateInfo } from "../api/privilegeInvite/privilegeInvite";
import { userStore } from "stores/index";

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
        Swal.fire({
          title: "请登录后再操作",
          text: "系统提示",
          confirmButtonText: "确认"
        });
      }

      isCheckRecordModalVisible.value = toggleStatus;
    };

    const getRecords = () => {
      const params = {
        recordType: checkRecordFormData.recordType,
        privilegeType: checkRecordFormData.privilegeType,
        queryTime: checkRecordFormData.date,
        recommendedName: checkRecordFormData.user,
        token: store.token
      };
      getRecommendPrivilegeRecord(params).then((data) => {
        console.log("here", data);
      });
    };

    const shareInvite = () => {
      router.push("/account/invite");
    };

    onMounted(() => {
      if (!store.token) {
          return
      }
      getRebateInfo().then(({ data }) => (rebateInfo.value = data));

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
      rebateInfo
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
    gap: 10px;
    align-items: center;
    margin: 0 auto;

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
        font-size: 1.2em;
        white-space: nowrap;
        color: #11131f;
        font-family: "Microsoft YaHei";
        font-weight: 800;
      }
    }
  }

  .tab-section {
    height: fit-content;
    width: 100%;
    background-image: url(../assets/images/privilege-invite/tab-content.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto 20px;
    padding: 30px 14px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    text-align: center;
  }

  .title-banner-image {
    width: 100%;
    height: auto;
    margin-top: 10px;
    text-align: center;
    margin-bottom: 30px;
  }

  p {
    font-size: 14px;
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

    flex-wrap: nowrap;

    margin: 30px auto 20px;
  }

  .info-item {
    flex: 1;
    height: 100px;
    border: solid 1px $gold;
  }

  .info-top {
    height: 50px;
    background-color: $gold;
    text-align: center;
    color: #11131f;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 13px;
    font-weight: 700;
  }

  .info-content {
    height: 40px;

    text-align: center;
    color: #b89523;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 13px;
    font-weight: 700;
  }

  .share-btn {
    font-size: 18px;
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

  .rebate-table {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    margin: 35px 6px 35px;
    width: 100%;
    font-size: 13px;
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
    font-size: 13px;
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
    padding-left: 20px;
    text-indent: -15px;
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

  .record-title img {
    margin-top: 10px;
    text-align: center;
    margin-bottom: 30px;
    width: 100%;
    height: auto;
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
</style>

<template>
  <div class="privilege-invite-container">
    <div>
      <!-- tabs -->
      <div class="tab-wrapper">
        <div :class="{ tab: 'tab', active: activeKey === 1 }" @click="changeTab(1)">邀请首存奖金</div>
        <div :class="{ tab: 'tab', active: activeKey === 2 }" @click="changeTab(2)">邀请周存送</div>
        <div :class="{ tab: 'tab', active: activeKey === 3 }" @click="changeTab(3)">好友流水返利</div>
      </div>

      <!-- tab content -->
      <div v-if="activeKey === 1" class="new-section">
        <div class="new-rebate-section section-bg">
          <div class="new-rebate-section-left">
            <div class="new-rebate-section-title">
              <div class="new-rebate-section-title-inner">
                <div>
                  <div
                    class="claim-title-icon"
                  />
                  邀请首存奖金
                </div>
                <div @click="toggleCheckRecordModal(true)" class="tab active">查看我的推广记录</div>
              </div>
            </div>
            <div class="copy-section section-bg">
              <div class="copy-first">
                分享链接
                <!-- <img style="height: 24px;width: 24px;" src="../../../assets/images/privilege-invite/copy.png" /> -->
              </div>
              <div class="copy-sec">
                <div class="copy-sec-inner">
                  <div class="copy-link">{{ referralLink }}</div>
                  <div class="copy-btn" @click="copyText">复制</div>
                </div>
                <div @click="shareInvite" class="tab active" style="margin-top: 12px; height: 40px">立即分享</div>
              </div>
            </div>
          </div>
        </div>
        <div class="new-rebate-game-info section-bg">
          <div class="title-img">活动详情</div>
          <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
            <div class="ribbon">活动时间</div>
            <div class="right">2022 年 11 月 17 日 00:00 起</div>
          </div>
          <div
            class="little-title"
            style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
          >
            <div class="ribbon">活动内容</div>
            <div class="right">
              雷火用户打开：个人中心--点击“呼朋唤友”复制推广链接，通过
              QQ、微信、论坛、贴吧、微博等方式分享，成功邀请好友即 可获得现金奖励！
            </div>
          </div>
          <table class="new-rebate-game-info-table section-table">
            <tbody>
              <tr>
                <th>推荐新用户 首存金额</th>
                <th>邀请人彩金</th>
                <th>被邀请人彩金</th>
                <th>流水要求</th>
              </tr>
              <tr>
                <td>≥100</td>
                <td>18 元</td>
                <td>18 元</td>
                <td :rowspan="7">3倍/不限制场馆</td>
              </tr>
              <tr>
                <td>≥1,000</td>
                <td>58 元</td>
                <td>58 元</td>
              </tr>
              <tr>
                <td>≥5,000</td>
                <td>108 元</td>
                <td>108 元</td>
              </tr>
              <tr>
                <td>≥10,000</td>
                <td>288 元</td>
                <td>288 元</td>
              </tr>
              <tr>
                <td>≥30,000</td>
                <td>888 元</td>
                <td>888 元</td>
              </tr>
              <tr>
                <td>≥50,000</td>
                <td>1,088 元</td>
                <td>1,088 元</td>
              </tr>
              <tr>
                <td>≥100,000</td>
                <td>1,888 元</td>
                <td>1,888 元</td>
              </tr>
            </tbody>
          </table>
          <div class="new-rebate-game-bottom">
            <div class="new-rebate-game-bottom-left-title">
              <div class="new-rebate-game-bottom-left-btn">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                  alt=""
                  style="width: 10px"
                />
                <span>示例</span>
              </div>
              会员 A 邀请一位好友首存 1,000 元，会员 A 可获得 58 元，被邀请人可获得 58 元；
            </div>
          </div>
        </div>
        <div class="new-rebate-game-bottom-rule section-bg">
          <div class="title-img">活动规则</div><br/>
          <div class="content">
            <div class="item">
              <div class="item-num">1</div>
                <div style="display: flex; flex-direction: column">
                  邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。
                </div>
              </div>
              <div class="item">
                <div class="item-num">2</div>
                每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，双方都可获得彩金，邀请人能最高可获得1,888元；
              </div>
              <div class="item">
                <div class="item-num">3</div>
                本活动仅计算被推荐人首次单笔充值金额，非累计及第二笔以上充值金额计算；
              </div>
              <div class="item">
                <div class="item-num">4</div>
                您每邀请一位新会员，被邀请人的第一笔首存金额达到对应档位即可在次日24小时内活动对应档位彩金，彩金3倍流水即可提款；
              </div>
              <div class="item">
                <div class="item-num">5</div>
                邀请人等级不得低于vip1。
              </div>
              <div class="item">
                <div class="item-num">6</div>
                被推荐人注册后，无限制首次充值时间，完成首笔充值达到门槛，即可参与
              </div>
              <div class="item">
                <div class="item-num">7</div>
                普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
              </div>
              <div class="item">
                <div class="item-num">8</div>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
              </div>
              <div class="item">
                <div class="item-num">9</div>
                邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </div>
              <div class="item">
                <div class="item-num">10</div>
                为避免文字理解差异，本站保留此活动最终解释权。
              </div>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 2" class="new-section">
        <div class="new-rebate-section section-bg">
          <div class="new-rebate-section-left">
            <div class="new-rebate-section-title">
              <div class="new-rebate-section-title-inner">
                <div>
                  <div
                    class="claim-title-icon"
                  />
                  邀请周存送
                </div>
                <div @click="toggleCheckRecordModal(true)" class="tab active">查看我的推广记录</div>
              </div>
            </div>
            <div class="copy-section section-bg">
              <div class="copy-first">
                分享链接
                <!-- <img style="height: 24px;width: 24px;" src="../../../assets/images/privilege-invite/copy.png" /> -->
              </div>
              <div class="copy-sec">
                <div class="copy-sec-inner">
                  <div class="copy-link">{{ referralLink }}</div>
                  <div class="copy-btn" @click="copyText">复制</div>
                </div>
                <div @click="shareInvite" class="tab active" style="margin-top: 12px; height: 40px">立即分享</div>
              </div>
            </div>
          </div>
        </div>
        <div class="new-rebate-game-info section-bg">
          <div class="title-img">活动详情</div>
          <div class="little-title" style="justify-content: flex-start; align-items: flex-start">
            <div class="ribbon">活动时间</div>
            <div class="right">2022 年 11 月 17 日 00:00 起</div>
          </div>
          <div
            class="little-title"
            style="flex-direction: column; justify-content: flex-start; align-items: flex-start"
          >
            <div class="ribbon">活动内容</div>
            <div class="right">
              活动期间，通过您的推广链接进行注册，并达到周累计存款要求，您和受邀请人均可获得该累计存款金额 1%
              的新人奖励，最高单周可获得 88888 元哦！
            </div>
          </div>
          <table class="new-rebate-game-info-table section-table">
            <tr>
              <th>邀请人等级要求</th>
              <th>好友周累计存款</th>
              <th>邀请人比例</th>
              <th>受邀请人比例</th>
              <th>总奖金上限</th>
              <th>流水要求</th>
            </tr>
            <tr>
              <td>VIP2</td>
              <td>≥5,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>88 元</td>
              <td rowspan="6">1倍/不限场馆</td>
            </tr>
            <tr>
              <td>VIP3-VIP4</td>
              <td>≥10,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>188 元</td>
            </tr>
            <tr>
              <td>VIP5-VIP6</td>
              <td>≥50,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>388 元</td>
            </tr>
            <tr>
              <td>VIP7-VIP8</td>
              <td>≥100,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>888 元</td>
            </tr>
            <tr>
              <td>VIP9</td>
              <td>≥500,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>8,888 元</td>
            </tr>
            <tr>
              <td>VIP10-VIP12</td>
              <td>≥1,000,000 元</td>
              <td>1%</td>
              <td>1%</td>
              <td>88,888 元</td>
            </tr>
          </table>
          <div class="new-rebate-game-bottom">
            <div class="new-rebate-game-bottom-left-title">
              <div class="new-rebate-game-bottom-left-btn">
                <img
                  src="../../../assets/images/promotion/hotpromo/lh1-blast-premier/game-bottom-left-btn.png"
                  alt=""
                  style="width: 10px"
                />
                <span>示例</span>
              </div>
              邀请人等级为 VIP2，被邀请人周累计存款达到 10000 元，x1%=100 元，按照等级对应奖金上限，则各派发 88
              元，奖金将会在次日凌晨 00:00 至下午 16:00 之间自动派发至您的主账户
            </div>
          </div>
        </div>
        <div class="new-rebate-game-bottom-rule section-bg">
          <div class="title-img">活动规则</div><br/>
          <div class="content">
            <div class="item">
              <div class="item-num">1</div>
              邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。
            </div>
            <div class="item">
              <div class="item-num">2</div>
              每个通过您的推广链接进行注册，并达到周累计存款≥5000元的用户，您和受邀请人均可获得该累计存款金额 1% 的新人奖励。周累计存款统计时间为自然周（每周一00:00至周日23:59）。
            </div>
            <div class="item">
              <div class="item-num">3</div>
              您每邀请一位新会员，从注册的日期开始算起，可享4次邀请周累存送，符合获取条件奖金的会员，将会在每个自然周一00:00:00 - 23:59:59内系统自动派发奖金至主钱包，并更新剩余获取奖金次数；逾期将会视为自动放弃。
            </div>
            <div class="item">
              <div class="item-num">4</div>
              任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
            </div>
            <div class="item">
              <div class="item-num">5</div>
              邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
            </div>
            <div class="item">
              <div class="item-num">6</div>
              普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金。
            </div>
            <div class="item">
              <div class="item-num">7</div>
              为避免文字理解差异，雷火电竞保留此活动最终解释权。
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeKey === 3" class="new-section">
        <div class="new-rebate-section section-bg">
          <div class="new-rebate-section-left">
            <div class="new-rebate-section-title">
              <div class="new-rebate-section-title-inner">
                <div>
                  <div class="claim-title-icon"
                  />
                  邀请首存奖金
                </div>
                <div @click="toggleCheckRecordModal(true)" class="tab active">查看我的推广记录</div>
              </div>
            </div>
            <div class="info-box">
              <div class="info-item">
                <div class="info-top">昨日好友投注总额</div>
                <div class="info-content yesterday-bet">{{ `${rebateInfo?.yesterdayFriendBet || "0.00"} 元` }}</div>
              </div>

              <div class="info-item">
                <div class="info-top">累计待派返利</div>
                <div class="info-content today-bonus">{{ `${rebateInfo?.pendingRebate || "0.00"} 元` }}</div>
              </div>

              <div class="info-item">
                <div class="info-top">近 15 天累计返利</div>
                <div class="info-content total-bouns">{{ `${rebateInfo?.fifteenDaysRebate || "0.00"} 元` }}</div>
              </div>
            </div>

            <div class="copy-section section-bg">
              <div class="copy-first">
                分享链接
                <!-- <img style="height: 24px;width: 24px;" src="../../../assets/images/privilege-invite/copy.png" /> -->
              </div>
              <div class="copy-sec">
                <div class="copy-sec-inner">
                  <div class="copy-link">{{ referralLink }}</div>
                  <div class="copy-btn" @click="copyText">复制</div>
                </div>
                <div @click="shareInvite" class="tab active" style="margin-top: 12px; height: 40px">立即分享</div>
              </div>
            </div>
            <div style="margin-top: 12px">
              活动期间，邀请人可获得每个好友从其注册时间开始计算 15 天的有效投注额 0.4% 的返利，无上限。
            </div>
          </div>
        </div>
        <div class="new-rebate-game-bottom-rule section-bg">
          <div class="title-img">活动规则</div><br/>
          <div class="content">
            <div class="item">
              <div class="item-num">1</div>
              邀请人与受邀人均须完成手机号码及银行卡绑定后，才会成功建立邀请关系并领取奖励。
            </div>
            <div class="item">
              <div class="item-num">2</div>
              活动有效投注额返利期限为15天，即：从您好友注册时间开始算起。
            </div>
            <div class="item">
              <div class="item-num">3</div>
              有效投注仅计算：体育场馆和电竞场馆的有效投注额。（IM体育以美东时间计算为准）
            </div>
            <div class="item">
              <div class="item-num">4</div>
              每日有效投注返利结算发放时间为：奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户（发放前一日的有效投注返利）；奖金最低派发为1元，等于1元不派发，奖金只需1倍有效流水即可提款。
            </div>
            <div class="item">
              <div class="item-num">5</div>
              普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金。
            </div>
            <div class="item">
              <div class="item-num">6</div>
              任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
            </div>
            <div class="item">
              <div class="item-num">7</div>
              邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
            </div>
            <div class="item">
              <div class="item-num">8</div>
              为避免文字理解差异，雷火电竞保留此活动最终解释权。
            </div>
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
              <img src="../../../assets/images/promo/hotpromo/privilegeinvite/record-title.png" />
            </div>
            <div class="record-selection">
              <div class="input-row">
                <label>返利类型</label>
                <select class="record-select-input record-type" v-model="checkRecordFormData.recordType">
                  <option value="REFERRER">邀请返利</option>
                  <option value="FRIEND">受邀返利</option>
                </select>
              </div>
              <div class="input-row">
                <label>活动类型</label>
                <select class="record-select-input privilege-type" v-model="checkRecordFormData.privilegeType">
                  <option value="FIRST_DEPOSIT">邀请首存送</option>
                  <option value="WEEKLY_DEPOSIT">邀请周存送</option>
                  <option value="BET_REBATE">返利无上限</option>
                </select>
              </div>

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
                <template v-for="(list, i) of tableRecords" :key="i">
                  <div>{{ list.loginName }}</div>
                  <div>{{ list.depositOrBet }}</div>
                  <div>{{ list.bonusAmount }}</div>
                </template>
              </div>
              <!-- <div class="listing-footer">
                <div class="footer-div">
                  <span class="pointer-s prev-page">&nbsp;&lt;&nbsp;&nbsp;</span>
                  <div class="footer-page">
                    <span id="record_page">1/1</span>
                  </div>
                  <span class="pointer-s next-page">&nbsp;&nbsp;&gt;&nbsp;</span>
                </div>
              </div> -->
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
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { getRecommendPrivilegeRecord, getRebateInfo } from "../../../api/privilegeInvite/privilegeInvite";
import { userStore } from "stores/index";
import { api, eventapi } from "boot/axios";
import { isAndroid } from "boot/utils";
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  setup() {
    const notify = useNotify();
    const $q = useQuasar();
    const store = userStore();
    const activeKey = ref(1);
    const isCheckRecordModalVisible = ref(false);
    const rebateInfo = ref({
      fifteenDaysRebate: 0,
      pendingRebate: 0,
      yesterdayFriendBet: 0
    });
    const checkRecordFormData = reactive({
      recordType: "REFERRER",
      privilegeType: "FIRST_DEPOSIT",
      date: moment().utcOffset("+08:00").format("YYYY-MM-DD"),
      user: ""
    });
    const router = useRouter();

    const checkActiveKey = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paramName = urlParams.get("name");

      // Define the mapping of names to activeKey values
      const nameToActiveKeyMap = {
        "lh1-invite": 1,
        "lh1-invite-2": 2,
        "lh1-invite-3": 3
      };

      // Check if the paramName is in the mapping
      if (nameToActiveKeyMap.hasOwnProperty(paramName)) {
        activeKey.value = nameToActiveKeyMap[paramName];
      }
    };

    const changeTab = (tabNum) => {
      activeKey.value = tabNum;

      // Define the mapping of tabNum to names
      const tabNameMap = {
        1: "lh1-invite",
        2: "lh1-invite-2",
        3: "lh1-invite-3"
      };

      if (tabNameMap.hasOwnProperty(tabNum)) {
        const name = tabNameMap[tabNum];

        // Update URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("name", name);

        // Replace the current state in the history with the new URL
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    };

    const toggleCheckRecordModal = (toggleStatus) => {
      // if (toggleStatus === true) {
      //   Swal.fire({
      //     title: "请登录后再操作",
      //     text: "系统提示",
      //     confirmButtonText: "确认"
      //   });
      // }

      isCheckRecordModalVisible.value = toggleStatus;
    };

    var tableRecords = ref([]);
    const getRecords = () => {
      const params = {
        rebateType: checkRecordFormData.recordType,
        bonusTime: checkRecordFormData.privilegeType,
        date: checkRecordFormData.date,
        loginName: checkRecordFormData.user,
        token: store.token
      };
      tableRecords.value = [];
      getRecommendPrivilegeRecord(params).then((data) => {
        tableRecords.value = data.data;
      });
    };

    const shareInvite = () => {
      if (window.location.pathname === "/privilege/invite") {
        router.push("/invitefriend?token=" + store.token);
      } else if (window.location.pathname === "/promotion") {
        document.location.href = `app://invite#summon-share`;
      }
    else {
        router.push("/account/invite?from=promo?name=lh1-invite");
      }
    };

    const qrRef = ref();
    const qrImg = ref();
    const onQRCodeChange = () => {
      if (qrRef.value) {
        qrImg.value = qrRef.value.firstChild.src;
        console.log(qrImg.value);
      }
    };

    const referralLink = ref("");
    const getReferral = () => {
      api
        .get("/session/member/referralCode")
        .then(async (res) => {
          if (res.code === 0) {
            if (isAndroid()) {
              const appDownloadUrl = await store.getAppDownloadUrl();
              const appReferralLinkBaseURL = appDownloadUrl.replace(".app", ".com");
              const appReferralLink = `${appReferralLinkBaseURL}/refer/${res.data}`;
              referralLink.value = appReferralLink;
              return;
            }

            referralLink.value = `${window.location.origin}/refer/${res.data}`;
          }
        })
        .catch((err) => {});
    };
    const copyText = async () => {
      try {
        await navigator.clipboard.writeText(referralLink.value);
        notify({
          type: "success",
          message: "已复制链接"
        });
      } catch (err) {
        console.error(err);
      }
    };
    const copybtntxt = ref("Copy");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value;
      copyText.select();
      document.execCommand("copy");

      notify({
        type: "success",
        message: "已复制链接"
      });
    };

    const downloadQRCode = () => {
      const link = window.document.createElement("a");
      link.href = qrRef.value.firstChild.src;
      link.download = "app";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify({
        type: "success",
        message: "已下载二维码"
      });
    };

    const retrieve = () => {
      eventapi
        .put("/bonus/claim/" + "lh1-vip-upgrade-bonus")
        .then((res) => {
          if (res.code === 0) {
            notify({
              type: "success",
              message: "领取成功"
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    const registerMembers = ref(1);
    const bonusAmount = ref(1);

    const goToInvitePageOld = (type) => {
      router.push("/privilege/invite?type=" + type);
    };

    const getInviteCount = () => {
      api
        .get("/session/referredBonus/count")
        .then((res) => {
          if (res.code === 0) {
            registerMembers.value = res.data.registerMembers;
            bonusAmount.value = res.data.bonusAmount;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    onMounted(() => {
      if (store.hasToken()) {
        getRebateInfo().then(({ data }) => (rebateInfo.value = data));
        getReferral();

        getInviteCount();
      }
      checkActiveKey();
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
      getReferral,
      referralLink,
      copybtntxt,
      copyinput,
      copyCode,
      downloadQRCode,
      onQRCodeChange,
      qrRef,
      checkActiveKey,
      retrieve,
      getInviteCount,
      registerMembers,
      bonusAmount,
      goToInvitePageOld,
      tableRecords,
      copyText
    };
  }
});
</script>

<style scoped lang="scss">
.tab-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: calc(100% - 20px);
  margin: 0px auto 20px;

  .tab {
    width: 160px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}

.body--dark {
  .tab {
    &.active {
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
    }
  }

  .privilege-invite-container {
    .info-item {
      background: transparent;
      border-color: #3c5ec3;
    }
    .info-top {
      background: linear-gradient(180deg,#597adf,#3c5ec3);
    }
  }

  .record-selection {
    .input-row {
      label {
        color: white;
      }
    }
  }
}
.new-section {
  padding: 0px 12px;
}
.new-rebate-section {
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #acd4f6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/section-bg.png");
  background-size: 100% 100%;
  align-items: center;
  width: 100%;

  .new-rebate-section-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .new-rebate-section-right {
    width: 180px;
    margin-top: 20px;

    .bonus-image {
      width: 100%;
      cursor: pointer;

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      &.disabled {
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }

  .new-rebate-section-title {
    font-size: 16px;
    line-height: 1;
    font-weight: 600;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 20px;
  }

  .new-rebate-section-title-inner {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
}
.tab {
  width: 160px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
  background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
  color: #818181;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &.active {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    color: white;
  }
}
.copy-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgb(194, 221, 245);
  padding: 12px;
  border: 1px solid rgba(172, 212, 246, 1);
  border-radius: 8px;
  .copy-first {
    font-weight: 600;
    font-size: 1rem;
    color: rgba(0, 161, 255, 1);
    display: flex;
    justify-content: flex-start;
  }
  .copy-sec {
    margin-top: 12px;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(0, 161, 255, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .copy-sec-inner {
      background-color: rgba(242, 248, 254, 1);
      border: 1px solid rgba(172, 212, 246, 1);
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: 1fr auto;
      line-height: 2.5rem;
      height: 40px;
      width: 100%;
      white-space: nowrap;

      .copy-link {
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .copy-btn {
        padding-left: 5px;
      }

      > div {
        cursor: pointer;
      }
    }
  }
}
.new-rebate-game-info {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-title.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 240px;
    height: 26px;
    margin: 0 auto;
  }
  .little-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    .left {
      background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/info-little-title-bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 64px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 23.33px;
      color: #ffffff;
      margin-right: 16px;
    }
    .right {
      font-size: 12px;
      font-weight: 400;
      line-height: 28px;
    }
  }
}

.new-rebate-game-info-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  vertical-align: middle;
  th {
    height: 36px;
    font-size: 12px;
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
          // border-bottom-left-radius: 12px;
        }
      }
    }
    &:nth-child(2) {
      td {
        &:last-child {
          // border-bottom-right-radius: 12px;
        }
      }
    }
  }
  td {
    background: transparent;
    border: 1px solid #acd4f6;
    height: 36px;
    font-size: 12px;
    font-weight: 400;
    line-height: 28px;
    color: #000000;
  }
}
.new-rebate-game-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .new-rebate-game-bottom-left-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #f93a3a !important;
  }
  .new-rebate-game-bottom-left-btn {
    font-size: 12px;
    font-weight: 600;
    line-height: 22.4px;
    color: #f93a3a !important;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }
}
.new-rebate-game-bottom-rule {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  background: #f2f8fe;
  border-radius: 12px;
  padding: 20px 12px 12px;
  border: 1px solid #acd4f6;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  .title {
    background-image: url("../../../assets/images/promotion/hotpromo/lh1-blast-premier/rule-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 240px;
    height: 20px;
    margin-bottom: 20px;
  }
  .content {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    padding: 8px;
    .item {
      display: flex;
      gap: 10px;
      align-items: baseline;

      .item-num {
        color: #ffffff;
        font-size: 12px;
        line-height: 1;
        border-radius: 50%;
        height: 16px !important;
        width: 16px !important;
        min-width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2px;
        background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
      }

      .hint {
        font-size: 12px;
        font-weight: 400;
        line-height: 22.4px;
        color: #f93a3a !important;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

$gold: #efcf68;

.title-img {
  img {
    width: 100%;
  }
}

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
    gap: 5px;
    align-items: center;
    margin: 0 auto;

    .tab {
      background: url(../../../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
      width: 100%;

      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.5;
      &.active {
        background: url(../../../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        opacity: 1;
      }

      h3 {
        font-size: 13px;
        color: #ffffff;
        font-family: "Microsoft YaHei";
        font-weight: 800;
      }
    }
  }

  .tab-section {
    width: calc(100% - 20px);
    margin: 0 auto;
    // height: fit-content;
    // width: 100%;
    // background-image: url(../../../assets/images/promo/hotpromo/privilegeinvite/tab-content.png);
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    // margin: 0 auto 20px;
    // padding: 30px 25px 40px;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: space-around;
    // text-align: center;
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
    box-sizing: content-box;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .info-item {
    min-width: 101px;
    height: 100px;
    border: 1px solid rgba(172, 212, 246, 1);
    box-sizing: content-box;
    border-radius: 10px;
    background: linear-gradient(0deg, #dceeff, #dceeff);
  }

  .info-top {
    padding: 4px;
    height: 30px;
    background-color: $gold;
    text-align: center;
    color: #fff;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);

    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    font-size: 13px;
    font-weight: 700;
  }

  .info-content {
    height: 70px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
  }

  .share-btn {
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 1px;
    color: #ffffff;
    width: 160px;
    height: 40px;
    background-color: #0079fb;
    border-radius: 25px;
    border: 0px;
    margin: 20px auto 25px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    display: flex;
    flex-wrap: wrap;
    // display: grid;
    // grid-template-columns: auto auto auto;

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
      width: 50%;
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

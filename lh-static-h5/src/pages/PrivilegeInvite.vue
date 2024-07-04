<template>
  <div class="privilege-invite-container">
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
          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-time.png" />
          </div>

          <div class="blue-content-para">
            <p class="txt-center">2022年11月17日00:00起</p>
          </div>

          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-content.png" />
          </div>

          <div class="blue-content-para">
            <p>
              雷火用户打开：个人中心--点击“呼朋唤友”复制推广链接，通过QQ、微信、论坛、贴吧、微博等方式分享，成功邀请好友即
              可获得现金奖励！
            </p>
            <p class="txt-center q-mt-sm">
              <a @click="toggleCheckRecordModal(true)">查看我的推广记录</a>
            </p>

            <button class="share-btn" @click="shareInvite">立刻分享</button>

            <div class="blue-content-table-container">
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

            <p class="red q-mt-lg">
              例：会员A邀请一位好友首存1,000元，会员A可获得58元，被邀请人可获得58元；
            </p>
          </div>

          <div class="row justify-center">
            <q-btn color="brightbtn" @blur="blurCode" label="点击申请" />
          </div>

          <div class="blue-content-rules">
            <div class="rules-img">
              <img src="../assets/images/promo/hotpromo/privilegeinvite/title-rules.png" />
            </div>
            <ol>
              <li>每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请奖金；每个受邀请人完成对应存款金额，双方都可获得彩金， 邀请人能最高可获得1,888元；</li>
              <li>本活动仅计算被推荐人首次单笔充值金额,非累计及第二笔以上充值金额计算；</li>
              <li>您每邀请一位新会员，被邀请人的第一笔首存金额达到对应档位即可在次日24小时内活动对应档位彩金，彩金3倍流水即可提款；</li>
              <li>邀请人等级不得低于vip1。</li>
              <li>被推荐人注册后,无限制首次充值时间,完成首笔充值达到门槛,即可参与</li>
              <li>普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金</li>
              <li>任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投 注额内。</li>
              <li>邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一 个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。</li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 2" class="tab-content">
        <div class="tab-section">
          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-time.png" />
          </div>

          <div class="blue-content-para">
            <p class="txt-center">2022年11月17日00:00起</p>
          </div>

          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-content.png" />
          </div>

          <div class="blue-content-para">
            <p>
              活动期间，通过您的推广链接进行注册，并达到周累计存款要求，您和受邀请人均可获得该累计存款金额 1%
              的新人奖励，最高单周可获得 88888 元哦！
            </p>
            <p class="txt-center q-mt-sm">
              <a @click="toggleCheckRecordModal(true)">查看我的推广记录</a>
            </p>

            <button class="share-btn" @click="shareInvite">立刻分享</button>

            <div class="blue-content-table-container">
              <table border="0">
                <tr>
                  <td>邀请人等级要求</td>
                  <td>好友周累计存款</td>
                  <td>邀请人比例</td>
                  <td>受邀请人比例</td>
                  <td>总奖金上限</td>
                  <td>流水要求</td>
                </tr>
                <tr>
                  <td>VIP2</td>
                  <td>≥5,000元</td>
                  <td rowspan="6">1%</td>
                  <td rowspan="6">1%</td>
                  <td>88元</td>
                  <td rowspan="6">1倍/不限场馆</td>
                </tr>
                <tr>
                  <td>VIP3-VIP4</td>
                  <td>≥10,000元</td>
                  <td>188元</td>
                </tr>
                <tr>
                  <td>VIP5-VIP6</td>
                  <td>≥50,000元</td>
                  <td>388元</td>
                </tr>
                <tr>
                  <td>VIP7-VIP8</td>
                  <td>≥100,000元</td>
                  <td>888元</td>
                </tr>
                <tr>
                  <td>VIP9</td>
                  <td>≥500,000元</td>
                  <td>8,888元</td>
                </tr>
                <tr>
                  <td>VIP10-VIP12</td>
                  <td>≥1,000,000元</td>
                  <td>88,888元</td>
                </tr>
              </table>

              <!-- <table border="0" class="q-mt-md">
                <tr>
                  <td>好友累计存款</td>
                  <td>流水要求</td>
                </tr>
                <tr>
                  <td>88</td>
                  <td rowspan="6">1倍/不限场馆</td>
                </tr>
                <tr>
                  <td>188</td>
                </tr>
                <tr>
                  <td>388</td>
                </tr>
                <tr>
                  <td>888</td>
                </tr>
                <tr>
                  <td>8888</td>
                </tr>
                <tr>
                  <td>88888</td>
                </tr>
              </table> -->
            </div>

            <p class="red q-mt-lg">
              例如：邀请人等级为VIP2，被邀请人周累计存款达到10000元，x1%=100元，
              按照等级对应奖金上限，则各派发88元，奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户
            </p>
          </div>

          <div class="row justify-center">
            <q-btn color="brightbtn" @blur="blurCode" label="点击申请" />
          </div>

          <div class="blue-content-rules">
            <div class="rules-img">
              <img src="../assets/images/promo/hotpromo/privilegeinvite/title-rules.png" />
            </div>
            <ol>
              <li>
                每个通过您的推广链接进行注册，并达到周累计存款≥5000元的用户，您和受邀请人均可获得该累计存款金额
                1%的新人奖励。 周累计存款统计时间为自然周（每周一00:00至周日23:59）。
              </li>
              <li>
                您每邀请一位新会员，从注册的日期开始算起，可享4次邀请周累存送，符合获取条件奖金的会员，将会在每个自然周一00:00:00-
                23:59:59内系统自动派发奖金至主钱包，并更新剩余获取奖金次数；逾期将会视为自动放弃。
              </li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>
                普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 3" class="tab-content">
        <div class="tab-section">
          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-time.png" />
          </div>

          <div class="blue-content-para">
            <p class="txt-center">2022年11月17日00:00起</p>
          </div>

          <div class="title-img">
            <img src="../assets/images/promo/hotpromo/privilegeinvite/title-content.png" />
          </div>

          <div class="blue-content-para">
            <p>活动期间，邀请人可获得每个好友从其注册时间开始计算15天的有效投注额0.4%的返利，无上限。</p>
            <p class="txt-center q-mt-sm">
              <a @click="toggleCheckRecordModal(true)">查看我的推广记录</a>
            </p>

            <div class="blue-content-records">
              <div class="record-item">
                <div class="record-title">昨日好友投注总额</div>
                <div class="record-data">0.00</div>
              </div>

              <div class="record-item">
                <div class="record-title">累计待派返利</div>
                <div class="record-data">0.00</div>
              </div>

              <div class="record-item">
                <div class="record-title">近15天累计返利</div>
                <div class="record-data">0.00</div>
              </div>
            </div>

            <button class="share-btn" @click="shareInvite">立刻分享</button>
          </div>

          <!-- <div class="row justify-center">
            <q-btn color="brightbtn" @blur="blurCode" label="点击申请" />
          </div> -->

          <div class="blue-content-rules">
            <div class="rules-img">
              <img src="../assets/images/promo/hotpromo/privilegeinvite/title-rules.png" />
            </div>
            <ol>
              <li>活动有效投注额返利期限为15天，即：从您好友注册时间开始算起。</li>
              <li>有效投注仅计算：体育场馆和电竞场馆的有效投注额。（IM体育以美东时间计算为准）</li>
              <li>
                每日有效投注返利结算发放时间为：奖金将会在次日凌晨00:00至下午16:00之间自动派发至您的主账户（发放前一日的有效投注返利）;奖金最低派发为1元，等于1元不
                派发，奖金只需1倍有效流水提款。
              </li>
              <li>
                普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
              </li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，雷火电竞保留此活动最终解释权。</li>
            </ol>
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
              <img src="../assets/images/promo/hotpromo/privilegeinvite/record-title.png" />
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
import { getRecommendPrivilegeRecord, getRebateInfo } from "../api/privilegeInvite/privilegeInvite";
import { userStore } from "stores/index";
import { api, eventapi } from "boot/axios";
import { isAndroid } from "boot/utils";

export default defineComponent({
  setup() {
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
      if(window.location.pathname === "/privilege/invite"){
        router.push("/invitefriend?token=" + store.token);
      }else{
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

    const copybtntxt = ref("Copy");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value;
      copyText.select();
      document.execCommand("copy");

      $q.notify({
        color: "positive",
        position: "top",
        message: "已复制链接",
        icon: "check_circle_outline"
      });
    };

    const downloadQRCode = () => {
      const link = window.document.createElement("a");
      link.href = qrRef.value.firstChild.src;
      link.download = "app";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      $q.notify({
        color: "positive",
        position: "top",
        message: "已下载二维码",
        icon: "check_circle_outline"
      });
    };

    const retrieve = () => {
      eventapi
        .put("/bonus/claim/" + "lh1-vip-upgrade-bonus")
        .then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "领取成功",
              icon: "check_circle_outline"
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
      getRebateInfo().then(({ data }) => (rebateInfo.value = data));
      getReferral();
      checkActiveKey();
      getInviteCount();
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
      tableRecords
    };
  }
});
</script>

<style scoped lang="scss">
$gold: #efcf68;

.title-img {
  img {
    width: 100%;
  }
}

.white-btn-qr-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px -4px 4px 0px #0000001a inset;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 12px;
  width: 100%;
  // max-width: 180px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;

  :deep(img) {
    margin-bottom: 0 !important;
    width: 80px !important;
  }

  .qr-details {
    // background:
    // box-shadow: 0px -2px 4.579999923706055px 0px #B1D7FF inset;

    .qr-link {
      // box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
      // padding: 1px;
      // border-radius: 40px;
      // display: flex;
      // color: #7a8eb9;
      // padding: 6px 12px;
      // font-size: 10px;

      :deep(.q-field__control) {
        border-radius: 30px;
        font-size: 10px;
        background: #ffffff;
        border: 1px solid #5894ff;
      }
    }

    .qr-actions {
      display: flex;
      margin-top: 6px;
      gap: 8px;
      justify-content: flex-start;

      .qr-btn {
        color: #3f8cff;
        box-shadow: 0px -1px 3.6640000343322754px 0px #5894ff inset;
        padding: 8px 16px;
        border-radius: 30px;
        line-height: 1;
        &:hover {
          filter: brightness(0.8);
        }
      }

      .qr-btn-copy {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 30px;
        line-height: 1;
        &:hover {
          filter: brightness(0.8);
        }
      }
    }
  }
}
.white-btns-container {
  display: flex;
  position: relative;
  justify-content: space-around;
  gap: 20px;

  .white-btn-style {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0px -4px 4px 0px #0000001a inset;
    box-shadow: 0px 4px 4px 0px #00000040;
    border-radius: 12px;
    width: 100%;
    max-width: 180px;
    padding-top: 10px;
    padding-bottom: 10px;

    :hover {
      filter: brightness(1.2);
    }

    &--invite {
      // justify-content: space-between;
      // padding-left: 16px;
      // padding-right: 16px;
      margin-top: 20px;
    }

    .white-btn-img {
      img {
        height: 45px !important;
        width: auto !important;
        margin: 0 !important;
      }
    }

    .white-btn-text {
      color: #424f72;
      font-size: 12px;

      &--invite {
        color: #7a8eb9;
      }

      span {
        color: #424f72;
        font-size: 150%;
        font-weight: bold;
      }
    }
  }
}

.blue-content-top-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  padding-top: 20px;

  &.mtop-0 {
    margin-top: 0;
  }

  .blue-content-title-shadow {
    position: absolute;
    top: 0px;
    font-size: 22px;
    text-align: center;
    color: #3f8cff1a;
    font-weight: bold;
  }
  .blue-content-title {
    img {
      height: 35px !important;
      width: auto !important;
    }
  }
  .blue-content-title-text {
    color: #7a8eb9;
    width: 80%;
    margin: auto;
    text-align: center;
  }
}

.blue-content-table-container {
  margin-top: 20px;
  table {
    width: 100%;
    text-align: center;
    tr:first-child td {
      background: #e7f3ff !important;
      color: #424f72 !important;
      font-weight: bold;
    }
    tr td {
      border: 1px solid #ecedf0 !important;
      color: #7a8eb9 !important;
    }
  }
}

.blue-content-para {
  margin-top: 12px;
  margin-bottom: 24px;
  p {
    font-size: 16px;
    color: #424f72 !important;
    padding-bottom: 0px !important;
    margin-bottom: 0 !important;
    line-height: 1.5 !important;

    &.txt-center {
      text-align: center;
    }

    &.red {
      color: #f53434 !important;
    }
  }

  a {
    text-decoration: underline;
  }
}

.blue-content-rules {
  .rules-img {
    margin-top: 30px;
    img {
      display: block;
      width: 100%;
      // max-width: 300px;
    }
  }
  ol li {
    color: #424f72 !important;
    font-size: 13px;
    margin-bottom: 10px !important;
  }
}

.blue-content-btn-wrap {
  display: flex;
  justify-content: center;
}

.blue-content-records {
  display: flex;
  margin-top: 16px;
  gap: 12px;
  .record-item {
    background: #ffffff;
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
  }
  .record-title {
    background: linear-gradient(180deg, #2095ff 50%, rgba(255, 255, 255, 0.9) 100%);
    padding: 6px 12px 8px;
    color: #ffffff;
    font-size: 10px;
    display: flex;
    justify-content: center;
    font-weight: 400;
  }
  .record-data {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    font-size: 16px;
    line-height: 1;
    font-weight: 700;
    background-image: linear-gradient(180deg, #64a2ff 0%, #0057da 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;

    // background: linear-gradient(180deg, #64a2ff 0%, #0057da 100%), linear-gradient(0deg, #e6f1ff, #e6f1ff);
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
      background: url(../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
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
        background: url(../assets/images/promo/hotpromo/privilegeinvite/btn-blue.png);
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
    // background-image: url(../assets/images/promo/hotpromo/privilegeinvite/tab-content.png);
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

    margin: 30px auto 20px;
  }

  .info-item {
    width: 130px;
    height: 100px;
    border: solid 1px $gold;
  }

  .info-top {
    width: 130px;
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
    width: 130px;
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

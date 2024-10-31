<template>
  <div class="privilege-invite-container">
    <!-- <div>
          <img class="banner" src="../../../assets/images/privilege-invite/top-banner.jpg" />
      </div> -->
    <div>
      <!-- tabs -->
      <div class="tabs">
        <div :class="{ tab: 'tab', active: activeKey === 1 }" @click="changeTab(1)">
          <h3>晋升有礼</h3>
        </div>
        <div :class="{ tab: 'tab', active: activeKey === 2 }" @click="changeTab(2)">
          <h3>携手宏图</h3>
        </div>
        <div :class="{ tab: 'tab', active: activeKey === 3 }" @click="changeTab(3)">
          <h3>共创未来</h3>
        </div>
      </div>

      <!-- tab content -->
      <div v-if="activeKey === 1" class="tab-content">
        <div class="tab-section">
          <div class="blue-content-top-container mtop-0">
            <div class="blue-content-title-shadow">Promotion is polite</div>
            <div class="blue-content-title">
              <img src="../../../assets/images/privilege-invite/dy-refer-title-01.png" />
            </div>
          </div>

          <div class="blue-content-para">
            <p>活动时间: 长期活动</p>
            <p>活动对象: 全体会员</p>
            <p>
              活动内容: 限12月01日起注册的新会员，在注册日的两天内成功晋级后，可申请豪华晋级体验礼金一 倍流水即可提款。
            </p>
          </div>

          <div class="blue-content-table-container">
            <table border="0">
              <tr>
                <td>注单尾数</td>
                <td>可获礼金（注单有效投注倍数）</td>
                <td>礼金上限</td>
              </tr>
              <tr>
                <td rowspan="2">VIP0</td>
                <td>注册日两天内晋级VIP1</td>
                <td>8</td>
              </tr>
              <tr>
                <td>注册日两天内晋级VIP2</td>
                <td>58</td>
              </tr>
            </table>
          </div>

          <div class="blue-content-btn-wrap">
            <q-btn rounded size="12px" label="立即领取" color="primary" @click="retrieve" />
          </div>

          <div class="blue-content-rules">
            <div class="rules-img"><img src="../../../assets/images/privilege-invite/rules-title.png" /></div>
            <ol>
              <li>活动期间注册会员当日注册成功后，两日内晋级即可领取对应晋级体验金；</li>
              <li>符合对应晋级体验金在成功注册当日第三天即可进入活动页面点击领取彩金；</li>
              <li>活动晋级彩金不重复派发，晋级彩金以注册日最后一天晋升等级计算，彩金一倍流水即可提款；</li>
              <li>
                每位有效会员，每一手机号码，电子邮箱，相同银行卡，每一个IP地址，每一台电脑或上网设备只能享
                受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；
              </li>
              <li>
                任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
              </li>
              <li>为避免文字理解差异，本站保留本活动最终解释权；</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 2" class="tab-content">
        <div class="tab-section">
          <div class="blue-content-top-container mtop-0">
            <div class="blue-content-title-shadow">Join hands for a grand vision</div>
            <div class="blue-content-title">
              <img src="../../../assets/images/privilege-invite/dy-refer-title-02.png" />
            </div>
            <div class="blue-content-title-text">
              本站用户打开:个人中心--点击“呼朋唤友”复制推广链接，通过QQ、微信、论坛、贴吧、直播间、微博等方式分享，成功邀请即可获得现金奖励!
            </div>
          </div>

          <div class="white-btns-container">
            <a class="white-btn-style white-btn-style--invite">
              <div class="white-btn-img">
                <img src="../../../assets/images/privilege-invite/icon-invite.png" />
              </div>
              <div class="white-btn-text">
                邀请周存送
                <br />
                <span>{{ registerMembers }}</span>
                人
              </div>
            </a>

            <a class="white-btn-style white-btn-style--invite">
              <div class="white-btn-img">
                <img src="../../../assets/images/privilege-invite/icon-reward.png" />
              </div>
              <div class="white-btn-text">
                邀请周存送
                <br />
                <span>{{ bonusAmount }}</span>
                元
              </div>
            </a>
          </div>

          <div class="white-btn-qr-container">
            <div ref="qrRef">
              <VueQrious :value="`${referralLink}`" :change="onQRCodeChange()" />
            </div>
            <div class="qr-details">
              <q-input class="qr-link" filled dense color="white" ref="copyinput" v-model="referralLink" />

              <div class="qr-actions">
                <div class="qr-btn-copy" @click="copyCode">复制分享链接</div>
                <div class="qr-btn" @click="downloadQRCode()">下载分享二维码</div>
              </div>
            </div>
          </div>

          <div class="blue-content-rules">
            <div class="rules-img"><img src="../../../assets/images/privilege-invite/rules-title.png" /></div>
            <ol>
              <li>您邀请好友时，请分享给好友推广二维码或推广链接，好友完成注册后，绑定关系建立；</li>
              <li>
                您邀请的好友在活动期间绑定手机号即可算注册成功，您邀请的好友人数越多，
                邀请彩金将逐级增加，最高可获得30元/人邀请彩金；
              </li>
              <li>系统自动发放至中心钱包，仅需1倍流水即可取款；</li>
              <li>活动结束后，奖励彩金即刻终止，未领取的彩金将不再发放；</li>
              <li>
                同一IP和设备、同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；
              </li>
              <li>
                任何用户或团体以不正常的方式进行套取活动优惠，平台方保留在不通知的情况下冻结或关闭相关账号的权利，并不退还款项，且用户会被列入黑名单。若发现有套利客户，对冲或不诚实获取盈利之行为，将取消其优惠资格；
              </li>
              <li>为避免文字理解差异，本站保留本活动最终解释权；</li>
            </ol>
          </div>
        </div>
      </div>
      <div v-if="activeKey === 3" class="tab-content">
        <div class="tab-section">
          <div class="white-btns-container">
            <a class="white-btn-style" @click="goToInvitePageOld(2)">
              <div class="white-btn-img">
                <img src="../../../assets/images/privilege-invite/btn-img-refer.png" />
              </div>
              <div class="white-btn-text">邀请周存送</div>
            </a>

            <a class="white-btn-style" @click="goToInvitePageOld(3)">
              <div class="white-btn-img">
                <img src="../../../assets/images/privilege-invite/btn-img-friend.png" />
              </div>
              <div class="white-btn-text">邀请周存送</div>
            </a>
          </div>
          <div class="blue-content-top-container">
            <div class="blue-content-title-shadow">Create a better future together</div>
            <div class="blue-content-title">
              <img src="../../../assets/images/privilege-invite/dy-refer-title-03.png" />
            </div>
            <div class="blue-content-title-text">通过专属链接邀请至官网注册成为会员</div>
          </div>

          <div class="blue-content-table-container">
            <table border="0">
              <tr>
                <td>新用户首存金额</td>
                <td>邀请人</td>
                <td>被邀请人</td>
                <td>流水要求</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
                <td rowspan="6">1倍/不限场馆</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
              </tr>
              <tr>
                <td>≥200</td>
                <td>18.00</td>
                <td>8.00</td>
              </tr>
            </table>
          </div>

          <div class="blue-content-rules">
            <ol>
              <li>
                每个通过您推广链接进行注册，并完成相应首存的用户，邀请人与被邀请人都将获得对应的邀请奖金，邀请人能最高可获得2328元，被邀请人最高可获得1668元；
              </li>
              <li>活动期间每邀请成功一次，每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃；</li>
              <li>
                例如：会员A邀请一位被邀请人首存200元，邀请人可获取18元奖金，被邀请人可获取8元；若想获取下一档位58元，则需被邀请人再次存1000元；奖金将会自动派
                发至主钱包。
              </li>
              <li>邀请人等级不得低于青铜Ⅰ（vip2）；</li>
              <li>
                普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
              </li>
              <li>
                任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
                注额内。
              </li>
              <li>
                邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
                个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
              </li>
              <li>为避免文字理解差异，本站保留此活动最终解释权。</li>
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
              <img src="../../../assets/images/privilege-invite/record-title.png" />
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
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { getRecommendPrivilegeRecord, getRebateInfo } from "../../../api/privilegeInvite/privilegeInvite";
import { userStore } from "stores/index";
import VueQrious from "vue-qrious";
import { api, eventapi } from "boot/axios";
import { isAndroid } from "boot/utils";

export default defineComponent({
  components: {
    VueQrious
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const activeKey = ref(3);
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

    const checkActiveKey = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paramName = urlParams.get("name");

      // Define the mapping of names to activeKey values
      const nameToActiveKeyMap = {
        "dy2-vip-upgrade-bonus": 1,
        "dy2-refer-bonus": 2,
        "Dongying-refer": 3
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
        1: "dy2-vip-upgrade-bonus",
        2: "dy2-refer-bonus",
        3: "Dongying-refer"
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
      if (toggleStatus === true) {
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
      // getRecommendPrivilegeRecord(params).then((data) => {
      //     console.log('here', data)
      // })
    };

    const shareInvite = () => {
      router.push("/account/invite");
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
        .put("/bonus/claim/" + "dy2-vip-upgrade-bonus")
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
      if (!store.token) {
        return
      }
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
      VueQrious,
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
      goToInvitePageOld
    };
  }
});
</script>

<style scoped lang="scss">
$gold: #efcf68;

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
  p {
    font-size: 16px;
    color: #7a8eb9 !important;
    padding-bottom: 0px !important;
    margin-bottom: 0 !important;
  }
}

.blue-content-rules {
  .rules-img {
    margin-top: 30px;
    img {
      display: block;
      // max-width: 300px;
    }
  }
  ol li {
    color: #7a8eb9 !important;
  }
}

.blue-content-btn-wrap {
  display: flex;
  justify-content: center;
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
      background: url(../../../assets/images/privilege-invite/btn-blue.png);
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
        background: url(../../../assets/images/privilege-invite/btn-blue.png);
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
    // height: fit-content;
    // width: 100%;
    // background-image: url(../../../assets/images/privilege-invite/tab-content.png);
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

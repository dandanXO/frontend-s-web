<template>
  <div class="provilege-invite-container">
    <div class="provilege-invite-wrapper">
      <!-- <HotPromotionNav :label="'共创未来'"></HotPromotionNav> -->

      <div class="hot-promo-nav">
        <div
          v-for="(nav, navIndex) in hotPromoNav"
          :key="`hot-promo-nav-${navIndex}`"
          :class="`nav-tab-btn ${nav.id === activeTab ? 'active' : ''}`"
          @click="onTabClick(nav)"
        >
          {{ nav.label }}
        </div>
      </div>

      <template v-if="activeTab === 1">
        <div class="title">晋升有礼</div>
        <div class="desc-wrapper">
          <div class="desc">活动时间:长期活动</div>
          <div class="desc">活动对象:全体会员</div>
          <div class="desc">
            活动内容:限12月01日起注册的新会员，在注册日的两天内成功晋级后，可申请豪华晋级体验礼金一 倍流水即可提款。
          </div>
        </div>

        <table class="record-table">
          <thead>
            <tr>
              <th style="width: 33.3333%">注单尾数</th>
              <th style="width: 33.3333%">可获礼金（注单有效投注倍数）</th>
              <th style="width: 33.3333%">礼金上限</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="2">VIP0</td>
              <td>注册日两天内晋级VIP1</td>
              <td>8</td>
            </tr>
            <tr>
              <td>注册日两天内晋级VIP2</td>
              <td>58</td>
            </tr>
          </tbody>
        </table>

        <div class="btn-wrapper">
          <el-button size="medium" class="retrieve-btn" @click="retrieve()">立即领取</el-button>
        </div>
      </template>

      <template v-if="activeTab === 2">
        <div class="title">携手宏图</div>
        <div class="desc-wrapper">
          <div class="desc">
            本站用户打开:个人中心--点击“呼朋唤友”复制推广链接，通过QQ、微信、论坛、贴吧、直播间、微博等方式分享，成功邀请即可获得现金奖励!
          </div>
        </div>

        <div class="referral-info referbonuspromo">
          <div class="bg">
            <div class="left">
              <img src="../../../assets/images/promotion/hotpromo/common/referral_people.png" />
              <div class="title">邀请注册</div>
            </div>
            <div class="right">
              <div class="desc">
                <span>{{ registerMembers }}</span>
                人
              </div>
            </div>
          </div>

          <div class="bg">
            <div class="left">
              <img src="../../../assets/images/promotion/hotpromo/common/referral_fee.png" />
              <div class="title">获得邀请彩金</div>
            </div>
            <div class="right">
              <div class="desc">
                <span>{{ bonusAmount }}</span>
                元
              </div>
            </div>
          </div>
        </div>

        <div class="share-container">
          <div ref="qrRef" class="qr"><VueQrious :value="`${referralLink}`" /></div>
          <div class="share-link">
            <div class="copy" @click="copyLink()">复制分享链接</div>
            <div class="link">{{ referralLink }}</div>
          </div>
          <div class="dl-qr-btn" @click="downloadQRCode()">下载分享二维码</div>
        </div>
      </template>

      <template v-if="activeTab === 3">
        <div class="referral-info provillage">
          <div class="bg" @click="goToInvitePage(2)">
            <img src="../../../assets/images/privilege-invite/btn_referral.png" />
            <div class="title">邀请周存送</div>
          </div>
          <div class="bg" @click="goToInvitePage(3)">
            <img src="../../../assets/images/privilege-invite/btn_turnover.png" />
            <div class="title">好友流水返利</div>
          </div>
        </div>

        <div class="title">共创未来</div>
        <div class="desc-wrapper">
          <div class="desc">通过专属链接邀请至官网注册成为会员</div>
        </div>

        <table class="record-table">
          <thead>
            <tr>
              <th style="width: 25%">新用户首存金额</th>
              <th style="width: 25%">邀请人</th>
              <th style="width: 25%">被邀请人</th>
              <th style="width: 25%">流水要求</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(table, tableIndex) in tableData" :key="`table-data-${tableIndex}`">
              <td>{{ table.row1 }}</td>
              <td>{{ table.row2 }}</td>
              <td>{{ table.row3 }}</td>
              <td v-if="table.row4" rowSpan="6">{{ table.row4 }}</td>
            </tr>
          </tbody>
        </table>

        <div class="tnc">
          <div class="note">
            1.每个通过您推广链接进行注册，并完成相应首存的用户，邀请人与被邀请人都将获得对应的邀请奖金，邀请人能最高可获得2328元，被邀请人最高可获得1668元；
          </div>
          <div class="note">2.活动期间每邀请成功一次，每个对应的档位奖金都 可以领取一次；逾期将会视为自动放弃；</div>
          <div class="note">
            3.例如：会员A邀请一位被邀请人首存200元，邀请人可获取18元奖金，被邀请人可获取8元；若想获取下一档位58元，则需被邀请人再次存1000元；奖金将会自动派
            发至主钱包。
          </div>
          <div class="note">4.邀请人等级不得低于青铜Ⅰ（vip1）；</div>
          <div class="note">
            5.普通会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放奖金
          </div>
          <div class="note">
            6.任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投
            注额内。
          </div>
          <div class="note">
            7.邀请人与受邀请人必须为不同身份的真实玩家，每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一
            个账号享受优惠，如发现有违规者我们将保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。
          </div>
          <div class="note">8.为避免文字理解差异，本站保留此活动最终解释权。</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import VueQrious from "vue-qrious";
import { getReferralLink, getReferredBonus } from "@/api/personal/share";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import { claimBonusItem } from "@/api/index/promo";
const notify = useNotify();
const store = userStore();

const route = useRoute();
const router = useRouter();
const activeTab = ref(1);
const hotPromoNav = [
  {
    id: 1,
    label: "晋升有礼",
    path: "/promotion?name=lh1-invite"
  },
  {
    id: 2,
    label: "携手宏图",
    path: "/promotion?name=lh1-invite-2"
  },
  {
    id: 3,
    label: "共创未来",
    path: "/promotion?name=lh1-invite-3"
  }
];

const onTabClick = (nav) => {
  activeTab.value = nav.id;
  router.push(nav.path);
};

const goToInvitePage = (type) => {
  router.push("/privilege/invite?type=" + type);
};

const tableData = [
  {
    row1: "≥200",
    row2: "18.00",
    row3: "8.00",
    row4: "1倍/不限场馆"
  },
  {
    row1: "≥1,000",
    row2: "58.00",
    row3: "38.00"
  },
  {
    row1: "≥5,000",
    row2: "88.00",
    row3: "58.00"
  },
  {
    row1: "≥10,00",
    row2: "188.00",
    row3: "88.00"
  },
  {
    row1: "≥30,000",
    row2: "888.00",
    row3: "588.00"
  },
  {
    row1: "≥50,000",
    row2: "1088.00",
    row3: "888.00"
  }
];

const referralLink = ref("referralLink");
const getReferral = () => {
  getReferralLink()
    .then((res) => {
      if (res.code === 0) referralLink.value = `${window.location.origin}/refer/${res.data}`;
      else
        notify.error({
          type: "error",
          message: res.message
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const copyLink = () => {
  navigator.clipboard.writeText(referralLink.value);

  notify({
    message: `复制成功`,
    type: "success"
  });
};

const qrRef = ref();
const downloadQRCode = () => {
  const link = window.document.createElement("a");
  link.href = qrRef.value.firstChild.src;
  link.download = "app";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const registerMembers = ref(0);
const bonusAmount = ref(0);
const getInviteCount = () => {
  getReferredBonus()
    .then((res) => {
      if (res.code === 0) {
        registerMembers.value = res.data.registerMembers;
        bonusAmount.value = res.data.bonusAmount;
      } else {

        notify.error({
          type: "error",
          message: res.message
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const retrieve = () => {
  claimBonusItem("lh1-vip-upgrade-bonus")
    .then((res) => {
      if (res.code === 0) {
        this.store.getBalance();
        notify({
          message: `领取成功`,
          type: "success"
        });
      } else {
        notify.error(res.message);
      }
    })
    .catch((err) => {
      console.log(err.message);
      // message.error(err.message, 4);
    });
};
watch(
  () => route.query,
  () => {
    hotPromoNav.forEach((p) => {
      if (route.fullPath === p.path) {
        activeTab.value = p.id;
      }
    });
    // Optionally you can set immediate: true config for the watcher to run on init
    // }, { immediate: true });
  }
);

onMounted(() => {
  hotPromoNav.forEach((p) => {
    if (route.fullPath === p.path) {
      activeTab.value = p.id;
    }
  });
  if (!store.token) {
    // notify({
    //   message: "请登录后操作",
    //   type: "error"
    // });
    return;
  }
  getReferral();
  getInviteCount();
});
</script>

<style scoped lang="scss">
.provilege-invite-container {
  font-size: 14px;
  color: #596281;
  line-height: 26px;

  .provilege-invite-wrapper {
    width: 1075px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;

    .referral-info.provillage {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
      margin: 0 0 50px 0;

      .bg {
        width: 30%;
        background: url("../../../assets/images/promotion/hotpromo/common/btn_mask.png");
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 25px 50px;
        border-radius: 1.25rem;
        // background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
        box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        cursor: pointer;

        .title {
          color: #424f72;
          font-size: 1.5rem;
          font-weight: 700;
        }

        img {
          width: 125px;
        }
      }
    }

    .title {
      font-size: 2rem;
      color: #3f8cff;
      font-weight: bold;
      margin-left: 10px;
      text-align: center;
    }

    .desc-wrapper {
      margin: 0 0 20px 0;

      .desc {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: normal;
        text-align: center;
      }
    }

    .record-table {
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      margin: 0 0 20px 0;

      thead {
        background: #e7f3ff;
      }

      th,
      td {
        padding: 10px 0;
      }

      tbody {
        color: #7a8eb9;
        tr {
          border-collapse: collapse;
          td {
            border: 1px solid #ecedf0;
          }
        }
      }
    }

    .tnc {
      .note {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 132.5%;
        margin: 0 0 10px 0;
      }
    }
  }
}

.hot-promo-nav {
  display: flex;
  justify-content: space-between;
  padding: 0 75px;
  margin: 0 0 50px 0;

  .nav-tab-btn {
    background: url("../../../assets/images/promotion/hotpromo/common/btn_blue.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: white;
    font-weight: 600;
    opacity: 0.5;
    cursor: pointer;

    &.active {
      opacity: 1;
    }
  }
}
</style>

<style scoped lang="scss">
.referral-info.referbonuspromo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  .bg {
    width: 50%;
    background: url("../../../assets/images/promotion/hotpromo/common/btn_mask.png");
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px;
    border-radius: 1.25rem;
    background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .title {
        color: #7a8eb9;
        font-size: 1.5rem;
        font-weight: 700;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .desc {
        color: #7a8eb9;
        font-size: 1.5rem;
        font-weight: 700;

        span {
          color: #424f72;
        }
      }
    }

    img {
      width: 75px;
    }
  }
}

.share-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
  border-radius: 1.25rem;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.25) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

  .share-link {
    position: relative;
    font-size: 1rem;

    .copy {
      border-radius: 6.25rem;
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
      width: 700px;
      text-align: right;
      color: white;
      font-weight: 600;
      padding: 10px 15px;
      cursor: pointer;
    }

    .link {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 6.25rem;
      background: linear-gradient(180deg, #fff 0%, #fff 100%);
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
      width: 550px;
      font-weight: 400;
      color: #7a8eb9;
      padding: 10px 15px;
    }
  }

  .dl-qr-btn {
    padding: 10px 15px;
    color: #3f8cff;
    border-radius: 6.25rem;
    background: linear-gradient(180deg, #fff 0%, #fff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    text-align: center;
    font-size: 1rem;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
  }
}
</style>

<style scoped lang="scss">
.btn-wrapper {
  margin: 0 auto;

  .retrieve-btn {
    padding: 20px 40px;
    border-radius: 6.25rem;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  }
}
</style>

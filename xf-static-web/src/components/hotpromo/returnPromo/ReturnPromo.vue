<template>
  <div class="return-promo-wrapper">
    <div class="return-promo-title">
      <img src="../../../assets/images/promotion/hotpromo/return-promo/title-img2.png" />
    </div>

    <div class="return-promo-options">
      <div @click="toggleTabOption()">
        <img
          :src="require(`../../../assets/images/promotion/hotpromo/return-promo/option-${tabOption.toLowerCase()}.png`)"
        />
      </div>
    </div>

    <div class="return-promo-content">
      <div class="content-time">
        <img src="../../../assets/images/promotion/hotpromo/return-promo/activity-time.png" />
        <p>2024年5月7日 20:00起</p>
      </div>

      <template v-if="tabOption === 'returnLoginGift'">
        <div class="content-main">
          <img src="../../../assets/images/promotion/hotpromo/return-promo/activity-content.png" />
          <p>兴發娱乐回馈老会员，老会员登录账号后可免费领取对应VIP等级奖金，点击“立即领取”奖金自动派发至主钱包。</p>
          <div class="return-claim-btn">
            <div @click="onReturnBonusClick('xf1-member-return-red-packet')">
              <img src="../../../assets/images/promotion/hotpromo/return-promo/btn-claim.png" />
            </div>
          </div>
          <table class="return-table" border="0" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <td>VIP等级</td>
                <td>回归奖金</td>
                <td>流水要求</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VIP1</td>
                <td>5</td>
                <td rowspan="12">3倍/不限场馆</td>
              </tr>
              <tr>
                <td>VIP2</td>
                <td>10</td>
              </tr>
              <tr>
                <td>VIP3</td>
                <td>25</td>
              </tr>
              <tr>
                <td>VIP4</td>
                <td>50</td>
              </tr>
              <tr>
                <td>VIP5</td>
                <td>98</td>
              </tr>
              <tr>
                <td>VIP6</td>
                <td>158</td>
              </tr>
              <tr>
                <td>VIP7</td>
                <td>238</td>
              </tr>
              <tr>
                <td>VIP8</td>
                <td>388</td>
              </tr>
              <tr>
                <td>VIP9</td>
                <td>588</td>
              </tr>
              <tr>
                <td>VIP10</td>
                <td>888</td>
              </tr>
              <!--              <tr>-->
              <!--                <td>钻石</td>-->
              <!--                <td>1,188</td>-->
              <!--              </tr>-->
              <!--              <tr>-->
              <!--                <td>王者</td>-->
              <!--                <td>1,888</td>-->
              <!--              </tr>-->
            </tbody>
          </table>
        </div>

        <div class="content-rules">
          <img src="../../../assets/images/promotion/hotpromo/return-promo/activity-rules.png" />

          <div class="content-rules-list">
            <p>1.老会员判定标准：</p>
            <p>-最近15天无存款，且在兴發娱乐有历史累计存款1,000元或以上记录的会员。</p>
            <p>
              例如：会员A领取回归奖金时间为4月16日，则会员A需在4月1日-4月15日期间无存款，并且在4月1日之前有历史累计存款1,000元或以上记录的会员。
            </p>
            <p>
              2.符合条件的每位老会员，需在此优惠活动页面里点击“立即领取”按钮，点击领取后系统将自动派发至会员的主钱包中；仅需完成3倍有效流水即可提款。
            </p>
            <p>
              3.注单取消或本金退还，任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口，将不计算为有效投注额内。
            </p>
            <p>
              4.每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；兴發对本活动保有最终解释权。
            </p>
          </div>
        </div>
      </template>

      <template v-if="tabOption === 'returnDepositGift'">
        <div class="content-main">
          <img src="../../../assets/images/promotion/hotpromo/return-promo/activity-content.png" />
          <p>活动期间，回归老会员完成单笔存款≥500元，即可申请对应档位的奖金，最高可领2,188元。</p>

          <table class="return-table" border="0" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <td>首存金额</td>
                <td>赠送奖金</td>
                <td>流水要求</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>≥500</td>
                <td>58</td>
                <td rowspan="7">1倍/不限场馆</td>
              </tr>
              <tr>
                <td>≥1,000</td>
                <td>88</td>
              </tr>
              <tr>
                <td>≥3,000</td>
                <td>188</td>
              </tr>
              <tr>
                <td>≥5,000</td>
                <td>388</td>
              </tr>
              <tr>
                <td>≥10,000</td>
                <td>888</td>
              </tr>
              <tr>
                <td>≥30,000</td>
                <td>1,588</td>
              </tr>
              <tr>
                <td>≥50,000</td>
                <td>2,188</td>
              </tr>
            </tbody>
          </table>

          <div class="return-claim-btn">
            <div @click="onReturnBonusClick('xf1-member-return-first-deposit')">
              <img src="../../../assets/images/promotion/hotpromo/return-promo/btn-claim.png" />
            </div>
          </div>
        </div>

        <div class="content-rules">
          <img src="../../../assets/images/promotion/hotpromo/return-promo/activity-rules.png" />

          <div class="content-rules-list">
            <p>
              1.符合条件的老会员回归首次存款后，可在此优惠活动页面上点击“立即领取”
              按钮，对应的奖金将自动添加至会员的主钱包中；会员在申请此奖金时，账户主钱包余额需 ≥
              最近的一笔存款金额，等奖金到账后，方可投注游戏。
            </p>
            <p>2.存送奖金需在当天23:59:59之前领取完毕，逾期未领取视为自动放弃。</p>
            <p>3.存送活动奖金不限游戏。</p>
            <p>4.参与此活动当天不与其他任何存送优惠共享，每笔存款仅对应一项优惠。</p>
            <p>
              5.注单取消或本金退还，任何低于欧洲盘1.7或亚洲盘0.7水位的投注及在同一局游戏中同时投注对等盘口，将不计算为有效投注额内。
            </p>
            <p>
              6.每位有效玩家、每个手机号码、电子邮箱、IP地址、每张银行卡、每台设备只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利；兴發娱乐对本活动保有最终解释权。
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { userStore } from "@/store";
import { claimBonusItem } from "@/api/index/promo";

const store = userStore();
const tabOption = ref("returnLoginGift");
const toggleTabOption = () => {
  tabOption.value = tabOption.value === "returnLoginGift" ? "returnDepositGift" : "returnLoginGift";
};

const onReturnBonusClick = (bonusItem) => {
  if (!store.token) {
    ElMessageBox.alert("请登录后再操作", "系统提示", {
      // if you want to disable its autofocus
      // autofocus: false,
      center: true,
      confirmButtonText: "确认",
      showClose: false,
      buttonSize: "large"
    }).then(() => {
      store.loginPageVisible = true;
    });
    return;
  } else {
    claimBonusItem(bonusItem)
      .then((res) => {
        // console.log(res);
        if (res.code === 0) {
          // Success
          ElMessageBox.alert(`你已领取 ${res.data}元`, "领取成功", {
            confirmButtonText: "OK",
            type: "success",
            center: true
          });
        }
      })
      .catch((err) => {}); // End catch
  }
};
</script>

<style lang="scss" scoped>
.return-promo-wrapper {
  min-height: 100vh;

  .return-promo-title {
    padding: 5% 30% 5% 15%;
    img {
      display: block;
      width: 100%;
      // max-width: 800px;
    }
  }

  .return-promo-options {
    display: flex;
    justify-content: center;

    img {
      display: block;
      width: 100%;
      cursor: pointer;
    }
  }

  .return-promo-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 60px;
    gap: 40px;

    p {
      text-align: center;
      font-size: 20px;
    }
  }

  .return-table {
    padding-top: 15px;
    width: 100%;
    thead {
      background: linear-gradient(180deg, #ff0000 0%, #990000 100%);
    }

    tbody {
      background: rgba(4, 4, 4, 0.3);

      td {
        border: 1px solid rgba(224, 224, 224, 0.1);
      }
    }

    td {
      padding: 12px 20px;
      text-align: center;
      font-size: 18px;
    }
  }

  .return-claim-btn {
    display: flex;
    justify-content: center;
    margin-top: 15px;

    img {
      cursor: pointer;
      &:hover {
        filter: brightness(0.8);
      }
    }
  }

  .content-rules-list {
    max-width: 1200px;
    p {
      text-align: left;
    }
  }
}
</style>

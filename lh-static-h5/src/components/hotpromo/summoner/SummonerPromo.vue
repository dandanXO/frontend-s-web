<template>
  <div>
    <div class="summoner">
      <q-tabs
        v-model="tabPosition"
        dense
        class="text-grey wrapcontent"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="first" label="精英召唤" />
        <q-tab name="sec" label="唤醒圣堂" />
        <q-tab name="third" label="唤醒答谢" />
      </q-tabs>
      <q-tab-panels v-model="tabPosition" class="summoner-tabs">
        <q-tab-panel name="first" label="精英召唤">
          <div class="main-desc">
            唤醒人每日存款≥200元，唤醒人与被唤醒人都可活动对应的存款彩金。
          </div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>
                  被唤醒人每日存款
                </th>
                <th>
                  唤醒人每日返利
                </th>
                <th>
                  被唤醒人每日返利
                </th>
                <th>
                  彩金上限
                </th>
                <th>
                  流水倍数
                </th>
              </tr>
              <tr>
                <td>唤醒第一日存款≥200</td>
                <td>8</td>
                <td>当日存款5% </td>
                <td rowspan="5">888元 </td>
                <td rowspan="5">3倍 </td>
              </tr>
              <tr>
                <td>唤醒第二日存款≥200</td>
                <td>18</td>
                <td>当日存款5% </td>
              </tr>
              <tr>
                <td>唤醒第三日存款≥200</td>
                <td>28</td>
                <td>当日存款5% </td>
              </tr>
              <tr>
                <td>唤醒第四日存款≥200</td>
                <td>58</td>
                <td>当日存款8% </td>
              </tr>
              <tr>
                <td>唤醒第五日存款≥200</td>
                <td>88</td>
                <td>当日存款10% </td>
              </tr>
            </table>
          </div>
          <div @click="goToInvite" class="summon-btn">
            <img src="../../../assets/images/promo/hotpromo/summoner/summon-btn.png">
          </div>
          <div class="summon-btn" @click="claimReward" style="margin-bottom:16px;">
            <img src="../../../assets/images/promo/hotpromo/summoner/claim-summon-btn.png">
          </div>
          <div class="findfriend" @click="getSummonRecord">
            <img src="../../../assets/images/promo/hotpromo/summoner/findfriend-btn.png">
          </div>
          <div class="rules">
            <p>
              <img src="../../../assets/images/promo/hotpromo/summoner/rules-title.png">
            </p>
            <div>
              <p>1. 活动期间，获得唤醒人与被唤醒人身份即可参与此活动；</p>
              <div style="padding-left: 20px;">
                唤醒人：<br>
                VIP1或以上等级会员符 合唤醒人身份<br><br>
                被唤醒人：<br>
                VIP1或以上等级会员历史存款≥500且超过15天未投注与存款的会员符合被唤醒人身份；<br><br>
              </div>
              <p>2. 活动以被唤醒人当日开始计算，唤醒日五天内每日存款≥200元，唤醒人与被唤醒人即可享受存款彩金， 3倍流水即可提款；</p>
              <p>3. 被唤醒人五日内需连续每日存款，若中断存款将视为放弃本活动优惠彩金；</p>
              <p>4. 彩金需点击活动页面【点击领取】按钮领取彩金，彩金3倍流水即可提款；</p>
<!--              <p>5. 本活动不与【精英回归 再战未来】活动共享彩金；</p>-->
              <p>5. 同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册IP一致，设备一致；</p>
              <p>6. 任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单</p>
              <p>7. 为避免文字理解差异，本活动最终解释权归雷火电竞所有;</p>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="sec" label="唤醒圣堂">

          <div class="sub-desc">
            活动期间，会员历史存款≥500且超过15天未投注与存款的会员即可进行召回，唤醒会员需当日存款与投注≥100元即可领取彩金。
          </div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>
                  成功唤醒人数
                </th>
                <th>
                  唤醒礼金/人
                </th>
                <th>
                  流水倍数
                </th>
              </tr>
              <tr>
                <td>≥1</td>
                <td>10</td>
                <td rowspan="5">3倍流水</td>
              </tr>
              <tr>
                <td>≥5</td>
                <td>58</td>
              </tr>
              <tr>
                <td>≥10</td>
                <td>128</td>
              </tr>
              <tr>
                <td>≥20</td>
                <td>218</td>
              </tr>
              <tr>
                <td>≥30</td>
                <td>388</td>
              </tr>
            </table>
          </div>
          <div @click="goToInvite" class="summon-btn">
            <img src="../../../assets/images/promo/hotpromo/summoner/summon-btn.png">
          </div>
          <div class="findfriend" @click="getSummonRecord">
            <img src="../../../assets/images/promo/hotpromo/summoner/findfriend-btn.png">
          </div>
          <div class="rules">
            <p>
              <img src="../../../assets/images/promo/hotpromo/summoner/rules-title.png">
            </p>
            <p>
              1. 活动期间，会员历史存款≥500且会员超过15天未投注与存款的会员即可符合被唤醒人条件，申请当天被唤醒人当日存款与投注≥100元即可符合领取彩金条件。<br><br>

              2. 本活动全体会员皆可参与；<br><br>

              3. 唤醒奖励将随召回人数的上涨而增加，最高388元/人，仅需3倍流水即可出款；<br><br>

              4. 同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册IP一致，设备一致；<br><br>

              5. 任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；<br><br>

              6. 为避免文字理解差异，本活动最终解释权归雷火电竞所有；
            </p>
          </div>
        </q-tab-panel>
        <q-tab-panel name="third" label="唤醒答谢">

          <div class="main-desc">
            活动期间，被唤醒会员完成第五日存款数量≥5人即可获得额外加赠彩金。
          </div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>完成第5日存款被唤醒人数量 </th>
                <th>额外加赠</th>
                <th>流水倍数</th>
              </tr>
              <tr>
                <td>≥5</td>
                <td>58</td>
                <td rowspan="5">3倍流水</td>
              </tr>
              <tr>
                <td>≥10</td>
                <td>88</td>
              </tr>
              <tr>
                <td>≥20</td>
                <td>128</td>
              </tr>
              <tr>
                <td>≥30</td>
                <td>288</td>
              </tr>
            </table>
          </div>
          <div @click="goToInvite" class="summon-btn">
            <img src="../../../assets/images/promo/hotpromo/summoner/summon-btn.png">
          </div>

          <div class="rules">
            <p>
              <img src="../../../assets/images/promo/hotpromo/summoner/rules-title.png">
            </p>
            <p>
              1. 活动期间，唤醒人完成被唤醒人数≥5人且被唤醒人完成五日存款，唤醒人则符合额外加赠彩金；<br><br>

              2. 本活动全体会员皆可参与（合作代理所发展的下线不适合此优惠）；<br><br>

              3. 同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册IP一致，设备一致；<br><br>

              4. 任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；<br><br>

              5. 为避免文字理解差异，本活动最终解释权归雷火电竞所有；
            </p>
          </div>

        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog class="summoner-modal" align-center v-model="isShowFriendDialog">
      <q-table no-data-label="暂无资料" :rows="tableData" :columns="columns" style="width: 100%" />
    </q-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { eventapi } from "src/boot/axios";
import { useQuasar} from "quasar";
import { useRouter } from "vue-router";

const router= useRouter()
const $q = useQuasar();
var qs = require("qs");
const tabPosition = ref('first')
const isShowFriendDialog = ref(false);
const tableData = ref([]);
const page = reactive({
  current: 1,
  size: 20
});
const props = defineProps(["promoCode"]);
const columns = [
  {
    label: "被唤醒会员账号",
    field: "summonName",
    align: "center"
  },
  {
    label: "连续存款天数",
    field: "dayCount",
    align: "center"
  },
  {
    label: "彩金金额",
    field: "memberBonus",
    align: "center"
  },
];
const getSummonRecord = () => {
  eventapi
    .get("/member-summon/get-summon-reward-record", {page})
    .then((res) => {
      if (res.code == 0) {
        tableData.value = res.data.records
        isShowFriendDialog.value = true;
      }
    })
    .catch((err) => {
      console.log("here", err);
    });
}


const goToInvite = () => {
  if(window.location.pathname === "/promotion"){
    sessionStorage.setItem("GO_SUMMON", "1");
    localStorage.setItem("GO_SUMMON", "1");
    document.location.href = "app://invite#summon-share";
  }else{
    router.push("/account/invite#summon-share");
  }
}

const claimReward = () => {
  eventapi
    .post("/member-summon/claim",qs.stringify({
      promoCode : props.promoCode
    }))
    .then((res) => {
      if (res.code == 0) {
        $q.notify({
          message: "成功领取 " + res.data + " 元。",
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
      }else{
        $q.notify({
          color: "negative",
          position: "bottom",
          message: res.message,
          icon: "report_problem"
        });
      }
    })
    .catch((err) => {
      console.log("here", err);
    });
}


onMounted(() => {

})
</script>
<style lang="scss">

.summoner {
  .q-tabs{
    margin-bottom: 16px;
    height: auto !important;
  }
  .q-tabs .q-tab {
    background: url(../../../assets/images/promo/hotpromo/summoner/tabbg.png) no-repeat center center;
    width: 180px;
    height: 69px;
    background-size: contain;
    color: #ffffff !important;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    opacity: .6;

    &--active {
      opacity: 1;
      .q-tab__label {
        color: #ffffff !important;
      }
      .q-tab__indicator {
        display: none !important;
      }
    }
    .q-ripple {
      display: none;
    }
  }
}
.summoner-modal {
  .q-table {
    th {

      background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
      color: #fff;
      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }
    td {
      color: #7A8EB9;
      background: #ffffff;
      border: 1px solid #ECEDF0;
    }
  }
}
</style>
<style scoped lang="scss">
.summoner {
  margin: 0 auto;
  max-width: 1380px;
}

.summoner-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: space-between;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  table {
    width: 100%;

    td,
    th {
      font-size: 14px;
      font-weight: 600;
      line-height: 28px;
      text-align: center;
      padding: 20px;
    }

    th {
      background: #E7F3FF;
      color: #424F72;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }

    td {
      color: #7A8EB9;
      background: #ffffff;
      border: 1px solid #ECEDF0;
    }
  }

  .summon-btn {
    margin: 10px auto;
    width: 200px;
    display: block;
    cursor: pointer;

    &:hover{
      opacity: 0.9;
    }
    &:active{
      filter:brightness(0.85);
    }

    img {
      width: 100%;
      max-width: 200px;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 200px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 0px 4px;
      margin-bottom: 10px;
      color: #7a8eb9;
      font-size: 16px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: #7A8EB9;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin: 15px auto;
  text-align: center;
}

.sub-desc {
  color: #7A8EB9;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin: 15px auto;
  text-align: center;

}



</style>

<template>
  <div>
    <div class="summoner">
      <el-tabs v-model="tabPosition" class="summoner-tabs">
        <el-tab-pane name="first" label="精英召唤">
          <div class="main-desc">被唤醒人每日存款≥200 元，唤醒人与被唤醒人都可活动对应的存款彩金。</div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <th>被唤醒人每日存款</th>
                  <th>唤醒人每日返利</th>
                  <th>被唤醒人每日返利</th>
                  <th>彩金上限</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>唤醒第一日存款≥200</td>
                  <td>8</td>
                  <td>当日存款 5%</td>
                  <td rowspan="5">888 元</td>
                  <td rowspan="5">3 倍</td>
                </tr>
                <tr>
                  <td>唤醒第二日存款≥200</td>
                  <td>18</td>
                  <td>当日存款 5%</td>
                </tr>
                <tr>
                  <td>唤醒第三日存款≥200</td>
                  <td>28</td>
                  <td>当日存款 5%</td>
                </tr>
                <tr>
                  <td>唤醒第四日存款≥200</td>
                  <td>58</td>
                  <td>当日存款 8%</td>
                </tr>
                <tr>
                  <td>唤醒第五日存款≥200</td>
                  <td>88</td>
                  <td>当日存款 10%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <router-link to="center/share" class="summon-btn">
            <img src="../../../assets/images/promotion/hotpromo/summoner/summon-btn.png" />
          </router-link>
          <div class="summon-btn" @click="claimReward">
            <img src="../../../assets/images/promotion/hotpromo/summoner/claim-summon-btn.png" />
          </div>
          <div class="findfriend" @click="getSummonRecord">
            <img src="../../../assets/images/promotion/hotpromo/summoner/findfriend-btn.png" />
          </div>
          <div class="rules">
            <p>
              <img v-if="isDark" src="../../../assets/images/promotion/hotpromo/summoner/rules-title-black.png" />
              <img v-else src="../../../assets/images/promotion/hotpromo/summoner/rules-title.png" />
            </p>
            <p>
              1. 活动期间，获得唤醒人与被唤醒人身份即可参与此活动；
              <br />
              <br />
              <div style="padding-left: 20px">
                唤醒人：
                <br />
                VIP1 或以上等级会员符 合唤醒人身份
                <br />
                <br />
                被唤醒人：
                <br />
                VIP1 或以上等级会员历史存款≥500 且超过 15 天未投注与存款的会员符合被唤醒人身份；
                <br />
                <br />
              </div>
              2. 活动以被唤醒人当日开始计算，唤醒日五天内每日存款≥200 元，唤醒人与被唤醒人即可享受存款彩金，
              3 倍流水即可提款；
              <br />
              <br />
              3. 被唤醒人五日内需连续每日存款，若中断存款将视为放弃本活动优惠彩金；
              <br />
              <br />
              4. 彩金需点击活动页面【点击领取】按钮领取彩金，彩金 3 倍流水即可提款；
              <br />
              <br />
              <!--              5. 本活动不与【精英回归 再战未来】活动共享彩金；<br>-->
              <!--              <br>-->
              5.
              同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册 IP 一致，设备一致；
              <br />
              <br />
              6.
              任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
              <br />
              <br />
              7. 为避免文字理解差异，本活动最终解释权归雷火电竞所有；
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane name="sec" label="唤醒圣堂">
          <div class="sub-desc">
            活动期间，会员历史存款≥500 且超过 15 天未投注与存款的会员即可进行召回，被唤醒人需当日存款与投注≥100 元即可领取彩金。
          </div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <th>成功唤醒人数</th>
                  <th>唤醒礼金/人</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥1</td>
                  <td>10</td>
                  <td rowspan="5">3 倍流水</td>
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
              </tbody>
            </table>
          </div>
          <router-link to="center/share" class="summon-btn">
            <img src="../../../assets/images/promotion/hotpromo/summoner/summon-btn.png" />
          </router-link>
          <div class="findfriend" @click="getSummonRecord">
            <img src="../../../assets/images/promotion/hotpromo/summoner/findfriend-btn.png" />
          </div>
          <div class="rules">
            <p>
              <img v-if="isDark" src="../../../assets/images/promotion/hotpromo/summoner/rules-title-black.png" />
              <img v-else src="../../../assets/images/promotion/hotpromo/summoner/rules-title.png" />
            </p>
            <p>
              1.
              活动期间，会员历史存款≥500 且会员超过 15 天未投注与存款的会员即可符合被唤醒人条件，申请当天被唤醒人当日存款与投注≥100 元即可符合领取彩金条件。
              <br />
              <br />

              2. 本活动全体会员皆可参与；
              <br />
              <br />

              3. 唤醒奖励将随召回人数的上涨而增加，最高 388 元/人，仅需 3 倍流水即可出款；
              <br />
              <br />

              4.
              同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册 IP 一致，设备一致；
              <br />
              <br />

              5.
              任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
              <br />
              <br />

              6. 为避免文字理解差异，本活动最终解释权归雷火电竞所有；
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane name="third" label="唤醒答谢">
          <div class="main-desc">活动期间，被唤醒会员完成第五日存款数量≥5 人即可获得额外加赠彩金。</div>
          <div class="table">
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <th>完成第 5 日存款被唤醒人数量</th>
                  <th>额外加赠</th>
                  <th>流水倍数</th>
                </tr>
                <tr>
                  <td>≥5</td>
                  <td>58</td>
                  <td rowspan="5">3 倍流水</td>
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
              </tbody>
            </table>
          </div>
          <router-link to="center/share" class="summon-btn">
            <img src="../../../assets/images/promotion/hotpromo/summoner/summon-btn.png" />
          </router-link>

          <div class="rules">
            <p>
              <img v-if="isDark" src="../../../assets/images/promotion/hotpromo/summoner/rules-title-black.png" />
              <img v-else src="../../../assets/images/promotion/hotpromo/summoner/rules-title.png" />
            </p>
            <p>
              1. 活动期间，唤醒人完成被唤醒人数≥5 人且被唤醒人完成五日存款，唤醒人则符合额外加赠彩金；
              <br />
              <br />

              2. 本活动全体会员皆可参与（合作代理所发展的下线不适合此优惠）；
              <br />
              <br />

              3.
              同一姓名、手机号、银行卡号、邮箱地址等信息的用户账号，仅可参与一次，若有违规者，将不享受此优惠。会员与被邀请会员禁止注册 IP 一致，设备一致；
              <br />
              <br />

              4.
              任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
              <br />
              <br />

              5. 为避免文字理解差异，本活动最终解释权归雷火电竞所有；
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog modal-class="summoner-modal" align-center v-model="isShowFriendDialog">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="summonName" label="被唤醒会员账号" />
        <el-table-column prop="dayCount" label="连续存款天数" />
        <el-table-column prop="memberBonus" label="彩金金额" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { claimSummon, getSummonRewardRecord } from "@/api/index/promo.js";
import { useNotify } from "@/hooks/notify";
import { useDark } from "@vueuse/core";
const isDark = useDark();
const notify = useNotify();
const tabPosition = ref("first");
const isShowFriendDialog = ref(false);
const tableData = ref([]);
const page = reactive({
  current: 1,
  size: 20
});
const props = defineProps(["promoCode"]);
const getSummonRecord = () => {
  getSummonRewardRecord(page).then((res) => {
    if (res.code === 0) {
      tableData.value = res.data.records;
      isShowFriendDialog.value = true;
    }
  });
};

const claimReward = () => {
  // debugger;
  claimSummon(props.promoCode).then((res) => {
    if (res.code === 0) {
      notify.redPacket("成功领取奖励", res.data);
    } else {
      notify.error(res.message);
    }
  });
};

onMounted(() => {});
</script>
<style scoped lang="scss">
.dark {
  .summoner {
  margin: 0 auto;
  max-width: 1380px;
}

.summoner-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: center;
    gap: 100px;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    background: url(../../../assets/images/promotion/hotpromo/summoner/tabbg.png) no-repeat center center;
    width: 250px;
    height: 95px;
    background-size: contain;
    color: #ffffff;
    font-family: PingFang SC;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    opacity: 0.6;

    &.is-active {
      opacity: 1;
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  table {
    width: 100%;

    tr {
      background: linear-gradient(180deg, #597ADF 0%, #3C5EC3 100%);
    }

    td,
    th {
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: center;
      padding: 20px;
    }

    th {
      background: unset;
      color: white;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }

    td {
      color: white;
      background: #2D4065;
      border: 1px solid #ecedf0;
    }
  }

  .summon-btn {
    margin: 30px auto;
    width: 320px;
    display: block;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 300px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 20px;
      color: white;
      font-size: 20px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: white;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}

.sub-desc {
  color: white;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}
:deep(.summoner-modal .el-dialog__body) {
  padding: 0;
  border-radius: 10px;
}
:deep(.summoner-modal .el-dialog__header .el-dialog__headerbtn .el-dialog__close) {
  z-index: 99;
}
:deep(.el-dialog) {
  table {
    background: transparent;
    tr {
      th,
      td {
        text-align: center;
      }
      th {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #fff;
        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }
      td {
        color: #7a8eb9;
        background: #ffffff;
        border: 1px solid #ecedf0;
      }
      &:last-child {
        td {
          &:first-child {
            border-radius: 0 0 0 10px;
          }

          &:last-child {
            border-radius: 0 0 10px 0;
          }
        }
      }
    }
  }
}
}
.summoner {
  margin: 0 auto;
  max-width: 1380px;
}

.summoner-tabs {
  :deep(.el-tabs__nav) {
    float: none;
    justify-content: center;
    gap: 100px;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    background: url(../../../assets/images/promotion/hotpromo/summoner/tabbg.png) no-repeat center center;
    width: 250px;
    height: 95px;
    background-size: contain;
    color: #ffffff;
    font-family: PingFang SC;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    padding: 0;
    opacity: 0.6;

    &.is-active {
      opacity: 1;
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  table {
    width: 100%;

    td,
    th {
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: center;
      padding: 20px;
    }

    th {
      background: #e7f3ff;
      color: #424f72;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }
    }

    td {
      color: #7a8eb9;
      background: #ffffff;
      border: 1px solid #ecedf0;
    }
  }

  .summon-btn {
    margin: 30px auto;
    width: 320px;
    display: block;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      filter: brightness(0.85);
    }

    img {
      width: 100%;
      display: block;
    }
  }

  .findfriend {
    margin: 0 auto;
    width: 300px;
    cursor: pointer;

    img {
      width: 100%;
    }
  }

  .rules {
    width: 100%;

    p {
      text-align: left;
      padding: 20px;
      color: #7a8eb9;
      font-size: 20px;

      img {
        margin: 20px auto;
        display: block;
      }
    }
  }
}

.main-desc {
  color: #7a8eb9;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}

.sub-desc {
  color: #7a8eb9;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 34.45px;
  margin: 30px auto;
  text-align: center;
}
:deep(.summoner-modal .el-dialog__body) {
  padding: 0;
  border-radius: 10px;
}
:deep(.summoner-modal .el-dialog__header .el-dialog__headerbtn .el-dialog__close) {
  z-index: 99;
}
:deep(.el-dialog) {
  table {
    background: transparent;
    tr {
      th,
      td {
        text-align: center;
      }
      th {
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        color: #fff;
        &:first-child {
          border-radius: 10px 0 0 0;
        }

        &:last-child {
          border-radius: 0 10px 0 0;
        }
      }
      td {
        color: #7a8eb9;
        background: #ffffff;
        border: 1px solid #ecedf0;
      }
      &:last-child {
        td {
          &:first-child {
            border-radius: 0 0 0 10px;
          }

          &:last-child {
            border-radius: 0 0 10px 0;
          }
        }
      }
    }
  }
}
</style>

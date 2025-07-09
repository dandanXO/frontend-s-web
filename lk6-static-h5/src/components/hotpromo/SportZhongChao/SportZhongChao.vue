<template>
  <div class="sport-zhongchao-container">
    <div class="sport-zhongchao-tab">
      <div
        class="sport-zhongchao-tab-item"
        :class="tab === 'first' ? 'tab-active' : 'tab-inactive'"
        @click="tab = 'first'"
      >
        首战告捷
      </div>
      <div
        class="sport-zhongchao-tab-item"
        :class="tab === 'second' ? 'tab-active' : 'tab-inactive'"
        @click="tab = 'second'"
      >
        乘胜追击
      </div>
      <div
        class="sport-zhongchao-tab-item"
        :class="tab === 'third' ? 'tab-active' : 'tab-inactive'"
        @click="tab = 'third'"
      >
        逢八必发
      </div>
    </div>

    <div class="sport-zhongchao-match-game-wrapper">
      <q-carousel
        v-model="slide"
        transition-next="slide-left"
        transition-prev="slide-right"
        swipeable
        animated
        padding
        arrows
        infinite
        control-color="black"
        class="bg-transparent"
      >
        <q-carousel-slide
          v-for="(match, vipIndex) in matchList"
          :key="`${match}-${vipIndex}`"
          :name="vipIndex"
          class="column no-wrap flex-center"
        >
          <match-game :key="match.id" :match="match" />
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div
      class="sport-zhongchao-title"
      :style="{
        backgroundImage: 'url(' + require('../../../assets/promo/lh-sport-zhongchao/' + tab + '-title.png') + ')'
      }"
    ></div>
    <div class="sport-zhongchao-content-info">
      <div class="sport-zhongchao-content-info-item">活动时间：2024中国足球超级联赛新赛季</div>
      <div class="sport-zhongchao-content-info-item">活动对象：全体会员</div>
      <div class="sport-zhongchao-content-info-item" v-if="tab === 'first'">
        活动内容：活动期间，会员投注指定早盘中超赛事且有效投注额满足≥888，根据本场累积触发事件分，获得对应彩金奖励，最高送888。
      </div>
      <div class="sport-zhongchao-content-info-item" v-if="tab === 'second'">
        活动内容：活动期间，会员参与投注指定中超赛事且有效投注额≥1000，根据赛事总进球数和单双情况进行派彩，最高可获得888元。
      </div>
      <div class="sport-zhongchao-content-info-item" v-if="tab === 'third'">
        活动内容：活动期间，会员参与投注“首战告捷”的赛事，若注单尾号出现【8】字样，即享对应彩金，一倍流水即可提款。
      </div>
    </div>
    <div class="sport-zhongchao-content">
      <table class="first-table" v-if="tab === 'first'">
        <tr>
          <th>早盘有效投注额</th>
          <th>事件加分</th>
          <th>事件总分≥55</th>
          <th>事件总分≥70</th>
          <th>事件总分≥85</th>
        </tr>
        <tr>
          <td>888</td>
          <td
            rowspan="6"
            style="
              color: #05a5ff;
              line-height: 24px;
              font-size: 14px;
              border-left: 2px solid #05a5ff !important;
              border-right: 2px solid #05a5ff !important;
            "
          >
            <div>角球+1分</div>
            <div>黄牌+1分</div>
            <div>进球+2分</div>
            <div>红牌+2分</div>
            <div>射门数+2分</div>
            <div>乌龙球+2分</div>
          </td>
          <td>6</td>
          <td>8</td>
          <td>10</td>
        </tr>
        <tr>
          <td>2,888</td>
          <td>18</td>
          <td>22</td>
          <td>28</td>
        </tr>
        <tr>
          <td>8,888</td>
          <td>58</td>
          <td>72</td>
          <td>88</td>
        </tr>
        <tr>
          <td>28,888</td>
          <td>188</td>
          <td>238</td>
          <td>288</td>
        </tr>
        <tr>
          <td>58,888</td>
          <td>388</td>
          <td>488</td>
          <td>588</td>
        </tr>
        <tr>
          <td>88,888</td>
          <td>688</td>
          <td>788</td>
          <td>888</td>
        </tr>
      </table>

      <div
        v-if="tab === 'first'"
        style="
          line-height: 20px;
          padding: 16px;
          font-size: 14px;
          color: #ff5454;
          text-align: start;
          background: #ffefef;
          margin-top: 15px;
          margin-bottom: 12px;
          border: 1px solid #ffcbcb;
        "
      >
        注：奖金不累积，根据当场指定赛事触发事件总分派发。
      </div>
      <div v-if="tab === 'first'">
        <!--        <div-->
        <!--          class="sport-zhongchao-title"-->
        <!--          :style="{ backgroundImage: 'url(' + require('../../assets/promo/lh-sport-zhongchao/rules-title.png') + ')' }"-->
        <!--        ></div>-->

        <div class="sport-zhongchao-notice">
          <div class="sport-zhongchao-notice-item">
            1.活动期间，符合条件的会员彩金于次日24点前派发至账户，仅需一倍流水即可提款；​
          </div>
          <div class="sport-zhongchao-notice-item">
            2.本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算，单日单场赛事有在多体育场馆投注则累积计算，任何走盘、串关、特殊投注、取消的赛事将不计算在有效投注额内；​
          </div>
          <div class="sport-zhongchao-notice-item">
            3.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；​
          </div>
          <div class="sport-zhongchao-notice-item">
            4.任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；​
          </div>
          <div class="sport-zhongchao-notice-item">5.为避免文字理解差异，本站保留本活动最终解释权。</div>
        </div>
      </div>

      <table class="second-table" v-if="tab === 'second'">
        <tr>
          <th rowspan="2">累计有效投注</th>
          <th colspan="2" style="border-right: 2px solid #05a5ff !important; border-left: 2px solid #05a5ff !important">
            投注指定一场
          </th>
          <th colspan="2">投注指定两场</th>
        </tr>
        <tr>
          <td style="color: #05a5ff !important; font-size: 14px; line-height: 20px; font-weight: 500">
            <div>两队总比分</div>
            <div>双数彩金</div>
          </td>
          <td
            style="
              color: #05a5ff !important;
              font-size: 14px;
              line-height: 20px;
              font-weight: 500;
              border-right: 2px solid #05a5ff !important;
            "
          >
            <div>两队总比分</div>
            <div>单数彩金</div>
          </td>
          <td style="color: #05a5ff !important; font-size: 14px; line-height: 28px; font-weight: 500">
            <div>四队总比分</div>
            <div>双数彩金</div>
          </td>
          <td style="color: #05a5ff !important; font-size: 14px; line-height: 28px">
            <div>四队总比分</div>
            <div>单数彩金</div>
          </td>
        </tr>
        <tr>
          <td>≥1,000</td>
          <td style="border-left: 2px solid #05a5ff !important">5</td>
          <td style="border-right: 2px solid #05a5ff !important">6</td>
          <td>8</td>
          <td>10</td>
        </tr>
        <tr>
          <td>≥5,000</td>
          <td style="border-left: 2px solid #05a5ff !important">18</td>
          <td style="border-right: 2px solid #05a5ff !important">26</td>
          <td>28</td>
          <td>38</td>
        </tr>
        <tr>
          <td>≥10,000</td>
          <td style="border-left: 2px solid #05a5ff !important">28</td>
          <td style="border-right: 2px solid #05a5ff !important">38</td>
          <td>58</td>
          <td>68</td>
        </tr>
        <tr>
          <td>≥50,000</td>
          <td style="border-left: 2px solid #05a5ff !important">158</td>
          <td style="border-right: 2px solid #05a5ff !important">188</td>
          <td>288</td>
          <td>388</td>
        </tr>
        <tr>
          <td>≥100,000</td>
          <td style="border-left: 2px solid #05a5ff !important">328</td>
          <td style="border-right: 2px solid #05a5ff !important">388</td>
          <td>588</td>
          <td>888</td>
        </tr>
      </table>

      <div
        v-if="tab === 'second'"
        style="
          line-height: 20px;
          padding: 16px;
          font-size: 14px;
          color: #ff5454;
          text-align: start;
          background: #ffefef;
          margin-top: 15px;
          margin-bottom: 10px;
          border: 1px solid #ffcbcb;
        "
      >
        注：彩金奖励不叠加，根据会员所投注的场次以及档位进行派彩；若比分为0:0按双数计算
      </div>

      <div v-if="tab === 'second'">
        <div
          class="sport-zhongchao-title"
          :style="{
            backgroundImage: 'url(' + require('../../../assets/promo/lh-sport-zhongchao/rules-title.png') + ')'
          }"
        ></div>

        <div class="sport-zhongchao-notice">
          <div class="sport-zhongchao-notice-item">
            1.活动期间，符合条件的会员彩金于次日24点前派发至账户,彩金于次日24点前派发至福利中心，仅需一倍流水即可提款；​
          </div>
          <div class="sport-zhongchao-notice-item">
            2.本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算，单日单场赛事有在多体育场馆投注则累积计算，任何走盘、串关、特殊投注、取消的赛事将不计算在有效投注额内；​
          </div>
          <div class="sport-zhongchao-notice-item">
            3.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；
          </div>
          <div class="sport-zhongchao-notice-item">
            4.任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
          </div>
          <div class="sport-zhongchao-notice-item">5.为避免文字理解差异，本站保留本活动最终解释权。​</div>
        </div>
      </div>

      <table class="third-table" v-if="tab === 'third'">
        <tr>
          <th style="width: 160px">指定赛事</th>
          <th style="width: 210px">注单条件</th>
          <th>逢8奖金</th>
        </tr>
        <tr>
          <td
            rowspan="6"
            style="
              color: #05a5ff !important;
              line-height: 40px;
              font-size: 17px;
              border-right: 2px solid #05a5ff !important;
            "
          >
            <div>首战告捷</div>
            <div>乘胜追击</div>
          </td>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续两个8
          </td>
          <td>28</td>
        </tr>
        <tr>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续三个8
          </td>
          <td>88</td>
        </tr>
        <tr>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续四个8
          </td>
          <td>188</td>
        </tr>
        <tr>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续五个8
          </td>
          <td>688</td>
        </tr>
        <tr>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续六个8
          </td>
          <td>1,888</td>
        </tr>
        <tr>
          <td style="border-left: 2px solid #05a5ff !important; border-right: 2px solid #05a5ff !important">
            尾号连续七个或以上8
          </td>
          <td>2,888</td>
        </tr>
      </table>

      <div
        v-if="tab === 'third'"
        style="
          line-height: 20px;
          padding: 16px;
          font-size: 14px;
          color: #ff5454;
          text-align: start;
          background: #ffefef;
          margin-top: 15px;
          margin-bottom: 10px;
          border: 1px solid #ffcbcb;
        "
      >
        <div style="line-height: 20px; padding-bottom: 8px">
          注：若多注单出现多个尾号【8】字样注单，则只以礼金最高的注单派彩。
        </div>
      </div>
      <div v-if="tab === 'third'">
        <!--        <div-->
        <!--          class="sport-zhongchao-title"-->
        <!--          :style="{ backgroundImage: 'url(' + require('src/assets/promo/lh-sport-zhongchao/rules-title.png') + ')' }"-->
        <!--        ></div>-->

        <div class="sport-zhongchao-notice">
          <div class="sport-zhongchao-notice-item">
            1.活动期间，符合条件的会员彩金于次日24点前派发至账户,彩金于次日24点前派发至福利中心，仅需一倍流水即可提款；
          </div>
          <div class="sport-zhongchao-notice-item">
            2.本活动有效投注额以结算时间为准，仅对已结算并产生输赢结果的投注额进行计算，单日单场赛事有在多体育场馆投注则累积计算，任何走盘、串关、特殊投注、取消的赛事将不计算在有效投注额内；
          </div>
          <div class="sport-zhongchao-notice-item">
            3.同一手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，仅可参与一次，若有违规者，将不享受此红利；
          </div>
          <div class="sport-zhongchao-notice-item">
            4.任何用户或团体以不正常的方式进行套取活动优惠，本站保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单；
          </div>
          <div class="sport-zhongchao-notice-item">5.为避免文字理解差异，本站体育保留本活动最终解释权。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSportMatch } from "src/api/index/promo";
import MatchGame from "./components/MatchGame.vue";
import { useLocalStorage } from "@vueuse/core";
import { userStore } from "../../../stores/index";

const store = userStore();
const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const slide = ref(0);

const tab = ref("first");
const matchList = ref([]);

onMounted(async () => {
  if(!store.token) {
    return
  }
  const apiRes = await getSportMatch();
  matchList.value = apiRes.data.map((res) => ({
    ...res,
    awayTeamIcon: imgURL + res.awayTeamIcon,
    homeTeamIcon: imgURL + res.homeTeamIcon
  }));
});
</script>
<style lang="scss" scoped>
.promo-container .selected-promo .selected-promo-wrapper .inner table td {
  border: none;
}

.sport-zhongchao-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0px;

  :deep(.q-carousel) {
    height: unset;
    padding-left: 0px;
    padding-right: 0px;
    width: 100%;
  }

  :deep(.q-carousel__slide) {
    padding-left: 35px;
    padding-right: 35px;
  }

  :deep(.q-carousel__prev-arrow--horizontal) {
    left: 0;
  }
  :deep(.q-carousel__next-arrow--horizontal) {
    right: 0;
  }

  .q-panel {
    overflow: hidden;
  }

  .sport-zhongchao-match-game-wrapper {
    width: 100%;
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .sport-zhongchao-tab {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0px;
    margin-top: 10px;
    gap: 10px;
    flex-wrap: nowrap;
    .sport-zhongchao-tab-item {
      //width: 122px;
      //height: 40px;
      width: 100%;
      min-height: 25px;
      aspect-ratio: 122/40;
      color: #fff;
      font-size: 17px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 34.6px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
    }
    .tab-inactive {
      background-image: url("../../../assets/promo/lh-sport-zhongchao/btn-gray.png");
    }
    .tab-active {
      background-image: url("../../../assets/promo/lh-sport-zhongchao/btn-blue.png");
    }
  }

  .sport-zhongchao-title {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0px auto 20px;
  }

  .sport-zhongchao-content-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    line-height: 28px;
    font-weight: 500;
    color: #333;
    margin-bottom: 24px;
  }

  .sport-zhongchao-content {
    width: 100%;
    margin-bottom: 36px;
  }

  .first-table,
  .second-table,
  .third-table {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    border-left: 1px solid #05a5ff;
    border-right: 1px solid #05a5ff;
    border-color: #05a5ff;
    white-space: normal;

    th {
      background-color: initial !important;
      height: 40px;
      color: #fff;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      &:first-child {
        border-top-left-radius: 0px;
      }
      &:last-child {
        border-top-right-radius: 0px;
      }
    }
    td {
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      font-weight: 500;
      color: #333;
      background-color: #fff;
      border-bottom: 2px solid #05a5ff !important;
    }
  }

  .first-table,
  .third-table {
    tr:first-child {
      background: linear-gradient(180deg, #05d2ff 0%, #0070f4 100%);
    }
  }

  .second-table {
    tr:first-child {
      th {
        background: linear-gradient(180deg, #05d2ff 0%, #0070f4 100%);
      }
    }
  }

  .sport-zhongchao-notice {
    width: 100%;
    font-size: 14px;
    line-height: 28px;
    font-weight: 500;
    color: #333;
    border: 1px solid #01a4ff;
    padding: 16px;
  }
}
</style>

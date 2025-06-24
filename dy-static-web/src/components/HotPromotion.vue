<template>
  <div class="hot-promo" :class="list.redirectUrl === 'dy2-game-steps' && 'flat-border-radius'">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="loadingClaim"
      @daily-slot="handleSlot()"
    />
    <PrizePoolVotePromo v-if="list.redirectUrl === 'Dongying-team-vote'" />

    <OuZuLianPromo v-if="list.redirectUrl === 'ouzulian'" />
    <GoldenEggPromo v-if="list.redirectUrl === 'goldenegg'" />

    <WelcomeTaskPromo v-if="list.redirectUrl === 'welcomenewuser'" />
    <InviteFriendPromo v-if="list.redirectUrl === 'invitefriend'" />

    <EsportQuiz2 v-if="list.redirectUrl === 'dy2-quiz'"></EsportQuiz2>

    <LivepokerRebate v-if="list.redirectUrl === 'dy2-livepoker-rebate'" :promo-code="list.promoCode" />
    <PrivilegeInvite
      v-if="
        list.redirectUrl === 'Dongying-refer' ||
        list.redirectUrl === 'dy2-refer-bonus' ||
        list.redirectUrl === 'dy2-refer-bonus'
      "
    />

    <HongBaoPreEurocupPromo
      :promo-code="list.promoCode"
      :pageContent="list.pageContent"
      :promoParam="list.param"
      v-if="listParam.type === 'hongbaoyu'"
    />
    <BountyBlastPremier v-if="list.redirectUrl === 'bounty-blast-premier'" :promo-code="list.promoCode" />

    <fishHongbao v-if="list.redirectUrl === 'dy-fish-hongbao'" />

    <slotLucky8 v-if="list.redirectUrl === 'dy-lucky-slot'" :promo-code="list.promoCode" />

    <FootballFight v-if="list.redirectUrl === 'dy2-football'" :promo-code="list.promoCode" />

    <SubmitClaimPromo v-if="list.redirectUrl === 'dy2-UCL'" :promo-code="list.promoCode" />
    <ChallengeComebackPromo v-if="list.redirectUrl === 'dy2-cycle-loss-refund'" :promo-code="list.promoCode" />
    <LplPKlck2025loss
      v-if="list.redirectUrl === 'dy2-lpl-lck-2025'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />
    <AgYuanxiaohongbao v-if="list.redirectUrl === 'dy1-ag-yuanxiaohongbao'" :promo-code="list.promoCode" />
    <VctBangkok v-if="list.redirectUrl === 'dy2-vct-masters-bangkok-2025'" :promo-code="list.promoCode" />

    <PglS32025 v-if="list.redirectUrl === 'dy1-2025-pgl-s3'" :promo-code="list.promoCode" />

    <PullbackTide v-if="list.redirectUrl === 'dy2-pullback-tide'" :promo-code="list.promoCode" />
    <Cba30Dream v-if="list.redirectUrl === 'dy2-cba30-dream'" :promo-code="list.promoCode" />
    <newVip2025 v-if="list.redirectUrl === 'dy2-2025-new-vip'" :promo-code="list.promoCode" />
    <PglAstana2025 v-else-if="list.redirectUrl === 'dy2-pgl-astana-2025'" :promo-code="list.promoCode" />
    <Belgrade2025Promo v-if="list.redirectUrl === 'belgrade-2025'" :promo-code="list.promoCode" />
    <Dota2BlastSlam2025 v-if="list.redirectUrl === 'dy2-blast-slam-2025'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-if="list.redirectUrl === 'dy-official-gift'" :params="list.param" />
    <Lh1Enc2025 v-else-if="list.redirectUrl === 'dy2-enc-2025'" :promo-code="list.promoCode" />
    <LanternFestival2025
      v-if="list.redirectUrl === 'dy1-lantern-festival-bonus'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />
    <IemKatowice2025 v-if="list.redirectUrl === 'dy2-iem-katowice-2025'" :promo-code="list.promoCode" />
    <HongBaoYu2025 v-if="list.redirectUrl === 'dy2-cny2025-red-envelope'" :promo-code="list.promoCode" />
    <Monthly20HongBaoYu v-if="list.redirectUrl === 'dy2-monthly-20th-red-envelope'" :promo-code="list.promoCode" />
    <Blast2025 v-if="list.redirectUrl === 'dy2-blast-open-lisbon-2025'" :promo-code="list.promoCode" />
    <CS2Sign v-if="list.redirectUrl === 'dy2-cs2-copenhagen-major-2024'" :promo-code="list.promoCode" />
    <BlastPremierPromo v-if="list.redirectUrl === 'dy2-cs2-blast-2024'" :promo-code="list.promoCode" />
    <elsOne2025 v-if="list.redirectUrl === 'dy2-esl-one-raleigh-2025'" :promo-code="list.promoCode" />
    <SkyesportsSouvenir2025 v-if="list.redirectUrl === 'dy2-skyesports-souvenir-2025'" :promo-code="list.promoCode" />
    <PGLOnFireBuenosAires2025
      v-if="list.redirectUrl === 'dy2-pgl-on-fire-buenos-aires-2025'"
      :promo-code="list.promoCode"
    />
    <PGLBucharest2025 v-if="list.redirectUrl === 'dy2-pgl-bucharest-2025'" :promo-code="list.promoCode" />
    <EslProLeagueS21
      v-if="list.redirectUrl === 'dy2-esl-pro-league-s21'"
      :promo-param="listParam"
      :promo-code="list.promoCode"
    />
    <FissureUniverseS4 v-if="list.redirectUrl === 'dy2-fissure-universe-s4'" :promo-code="list.promoCode" />
    <YaLLa2025 v-if="list.redirectUrl === 'dy2-yalla-compass-qatar-2025'" :promo-code="list.promoCode" />
    <IemMelbourne2025 v-if="list.redirectUrl === 'dy2-iem-melbourne-2025'" :promo-code="list.promoCode" />
    <PglWallachiaS4 v-if="list.redirectUrl === 'dy2-pgl-wallachia-s4'" :promo-code="list.promoCode" />
    <tpWorldChamp2025Sa v-if="list.redirectUrl === 'dy2-tp-world-champ-2025-sa'" :promo-code="list.promoCode" />
    <BlastSlam32025 v-else-if="list.redirectUrl === 'dy2-blast-slam-3-2025'" :promo-code="list.promoCode" />
    <sport-refer-bet-bonus v-else-if="list.redirectUrl === 'dy2-sport-refer-bet-bonus'" :promo-code="list.promoCode" />
    <BlastRival2025 v-if="list.redirectUrl === 'dy2-blast-rivals-2025-s1'" :promo-code="list.promoCode" />
    <Cct2025 v-if="list.redirectUrl === 'dy2-cct-global-finals-2025'" :promo-code="list.promoCode" />
    <IemDallas2025 v-if="list.redirectUrl === 'dy2-iem-dallas-2025'" :promo-code="list.promoCode" />
    <DreamLeagueS26 v-if="list.redirectUrl === 'dy2-dream-league-s26'" :promo-code="list.promoCode" />
    <Lh1DuanWuRewards v-else-if="list.redirectUrl === 'dy2-duan-wu-rewards'" :promo-code="list.promoCode" />
    <NewUserSportBonus2025
      v-else-if="list.redirectUrl === 'dy2-new-user-sport-bonus-2025'"
      :promo-code="list.promoCode"
    />
    <div style="text-align: center" v-if="list.redirectUrl === 'fankuijianyi'">
      <img
        style="max-width: 1200px; width: 100%; margin: 25px auto 0px"
        src="../assets/images/promotion/webfeedback.png"
      />
    </div>

    <el-dialog class="award-modal" :modal="false" v-model="privilegeClaimedModalVisible" align-center>
      <div class="modal-div">
        <span class="img-item">
          <div class="inner-contents">
            <div class="amount">{{ amount }}</div>
            <div class="bonus">奖金</div>
          </div>
        </span>
        <img src="../assets/images/index/bonus.svg" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { claimBonusItem } from "@/api/index/promo";
import ClaimPromo from "../components/hotpromo/claimPromo.vue";

import PrizePoolVotePromo from "../components/hotpromo/prizePoolVote/prizePoolVotePromo.vue";

import GoldenEggPromo from "../components/hotpromo/goldenegg/goldenEggPromo.vue";
import InviteFriendPromo from "../components/hotpromo/invitefriend/inviteFriendPromo.vue";
import slotLucky8 from "../components/hotpromo/slot-lucky8-2024/slot-lucky8-2024.vue";
import WelcomeTaskPromo from "../components/hotpromo/welcometask/welcomeTaskPromo.vue";
import EsportQuiz2 from "../components/hotpromo/esportquiz2/EsportQuiz.vue";
import PrivilegeInvite from "../components/hotpromo/privilegeInvite/PrivilegeInvite.vue";

import HongBaoPreEurocupPromo from "../components/hotpromo/hongbaoyu/HongBaoPreEurocup.vue";
import fishHongbao from "../components/hotpromo/fishHongbao/fishHongbao.vue";

import LivepokerRebate from "@/components/hotpromo/livepoker-rebate/LivepokerRebate.vue";
import OuZuLianPromo from "../components/hotpromo/ouzulian/OuZuLianPromo.vue";

import SubmitClaimPromo from "@/components/hotpromo/submitclaim/SubmitClaimPromo.vue";

import Cba30Dream from "@/components/hotpromo/cba30-dream/Cba30Dream.vue";
import newVip2025 from "@/components/hotpromo/2025-new-vip/2025-new-vip.vue";
import ChallengeComebackPromo from "@/components/hotpromo/challenge-comeback/ChallengeComeback.vue";

import Belgrade2025Promo from "./hotpromo/belgrade-2025-promo/Belgrade2025Promo.vue";
import LplPKlck2025loss from "../components/hotpromo/lpl-lck-2025-loss/lpl-lck-2025-loss.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store";

import PglS32025 from "./hotpromo/pgl-s3-2025/PglS32025.vue";
import PullbackTide from "./hotpromo/pullback-tide/PullbackTide.vue";
import Lh1Enc2025 from "./hotpromo/Lh1-enc-2025/Lh1-enc-2025.vue";

import HongBaoYu2025 from "./hotpromo/hongbaoyu2025/HongBaoYu2025.vue";
import Monthly20HongBaoYu from "./hotpromo/hongbaoyu2025/Monthly20HongBaoYu.vue";
import BountyBlastPremier from "./hotpromo/bounty-blast/BountyBlastPremier.vue";
import VctBangkok from "./hotpromo/vct-bangkok/VctBangkok.vue";
import Dota2BlastSlam2025 from "./hotpromo/dota2-blast-slam-2025/Dota2BlastSlam2025.vue";
import OfficialGiftPromo from "../components/hotpromo/officialGift/OfficialGiftPromo.vue";
import IemKatowice2025 from "./hotpromo/lh1-iem-katowice-2025/Iem-katowice-2025.vue";
import SkyesportsSouvenir2025 from "./hotpromo/skyesports-souvenir-2025/SkyesportsSouvenir2025.vue";
import PGLOnFireBuenosAires2025 from "./hotpromo/pgl-on-fire-buenos-aires-2025/PGLOnFireBuenosAires2025.vue";
import AgYuanxiaohongbao from "../components/hotpromo/agyuanxiaohongbao/AgYuanxiaohongbao.vue";
import LanternFestival2025 from "../components/hotpromo/lantern-festival-2025/LanternFestival2025.vue";
import EslProLeagueS21 from "./hotpromo/esl-pro-league-s21/EslProLeagueS21.vue";
import PGLBucharest2025 from "./hotpromo/pgl-bucharest-2025/PGLBucharest2025.vue";
import Blast2025 from "../components/hotpromo/Blast2025/Blast2025.vue";
import elsOne2025 from "../components/hotpromo/elsOne2025/elsOne2025.vue";

import sportReferBetBonus from "./hotpromo/sport-refer-bet-bonus/sport-refer-bet-bonus.vue";
import Lh1DuanWuRewards from "./hotpromo/lh1-duan-wu-rewards/Lh1DuanWuRewards.vue";
import FootballFight from "@/components/hotpromo/newFootballfight/FootballFight.vue";
import FissureUniverseS4 from "./hotpromo/fissure-universe-s4/FissureUniverseS4.vue";
import YaLLa2025 from "./hotpromo/YaLLa2025/YaLLa2025.vue";
import IemMelbourne2025 from "./hotpromo/iem-melbourne-2025/IemMelbourne2025.vue";
import PglWallachiaS4 from "./hotpromo/pgl-wallachia-s4/PglWallachiaS4.vue";
import tpWorldChamp2025Sa from "./hotpromo/tp-world-champ-2025-sa/tp-world-champ-2025-sa.vue";
import BlastSlam32025 from "./hotpromo/blast-slam-3-2025/BlastSlam32025.vue";
import Cct2025 from "./hotpromo/Cct-2025/Cct-2025.vue";
import BlastRival2025 from "./hotpromo/BlastRival2025/BlastRival2025.vue";
import PglAstana2025 from "./hotpromo/pgl-astana-2025/Pgl-astana-2025.vue";
import IemDallas2025 from "./hotpromo/iem-dallas-2025/IemDallas2025.vue";
import CS2Sign from "@/components/hotpromo/CS2Sign/CS2Sign.vue";
import BlastPremierPromo from "@/components/hotpromo/BlastPremierPromo/BlastPremierPromo.vue";
import DreamLeagueS26 from "@/components/hotpromo/dream-league-s26/DreamLeagueS26.vue";
import NewUserSportBonus2025 from "./hotpromo/new-user-sport-bonus-2025/NewUserSportBonus2025.vue";

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    Lh1DuanWuRewards,
    sportReferBetBonus,
    BlastPremierPromo,
    CS2Sign,
    PglAstana2025,
    Lh1Enc2025,
    newVip2025,
    Cct2025,
    YaLLa2025,
    FootballFight,
    Blast2025,
    elsOne2025,
    EslProLeagueS21,
    LanternFestival2025,
    AgYuanxiaohongbao,
    PGLOnFireBuenosAires2025,
    PGLBucharest2025,
    SkyesportsSouvenir2025,
    IemKatowice2025,
    OfficialGiftPromo,
    Dota2BlastSlam2025,
    VctBangkok,
    LivepokerRebate,
    BountyBlastPremier,
    fishHongbao,
    ClaimPromo,
    HongBaoPreEurocupPromo,
    PrizePoolVotePromo,
    GoldenEggPromo,
    InviteFriendPromo,
    WelcomeTaskPromo,
    EsportQuiz2,
    PrivilegeInvite,
    slotLucky8,
    OuZuLianPromo,

    SubmitClaimPromo,

    PglS32025,
    PullbackTide,
    Cba30Dream,
    ChallengeComebackPromo,
    LplPKlck2025loss,
    Belgrade2025Promo,
    HongBaoYu2025,
    Monthly20HongBaoYu,
    FissureUniverseS4,
    IemMelbourne2025,
    PglWallachiaS4,
    tpWorldChamp2025Sa,
    BlastSlam32025,
    BlastRival2025,
    IemDallas2025,
    DreamLeagueS26,
    NewUserSportBonus2025
  },
  props: {
    list: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      emptyText: "今天没有获奖者。",
      privilegeClaimedModalVisible: false,
      store: userStore(),
      loadingClaim: false,
      memberId: null,
      amount: "$0",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      },
      formState: {
        dateTime: "",
        onlyMe: false
      },
      luckyNumber: null,

      columns: [
        {
          title: "号码",
          dataIndex: "number",
          key: "1"
        },
        {
          title: "登录名",
          dataIndex: "loginName",
          key: "2"
        },
        {
          title: "获奖状态",
          dataIndex: "winStatus",
          key: "3"
        },
        {
          title: "时间",
          dataIndex: "recordTime",
          key: "recordTime",
          slots: { customRender: "recordTime" }
        }
      ]
    };
  },
  computed: {
    listParam() {
      try {
        console.log(JSON.parse(this.list.param));
        return JSON.parse(this.list.param);
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },
  methods: {
    handleSlot() {
      const store = userStore();
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
      this.loadingClaim = true;
      const bonusItem = this.list.promoCode;

      claimBonusItem(bonusItem)
        .then((res) => {
          if (res.code === 0) {
            this.amount = "$" + res.data;
            this.privilegeClaimedModalVisible = true;
            this.loadingClaim = false;
            this.store.getBalance();
          } else {
            ElMessage.error(res.message);
            this.loadingClaim = false;
          }
        })
        .catch((err) => {
          console.log(err.message);
          // message.error(err.message, 4);
          this.loadingClaim = false;
        });
    }
  },
  mounted() {
    console.log("Mount");
    // console.log(this.list);
    // List for non common promo
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
  }
});
</script>

<style lang="scss">
.award-modal {
  background: none;
  box-shadow: none;

  .el-dialog__header .el-dialog__headerbtn {
    font-size: 40px;
    background: #3d8183;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-dialog__body {
    background: none;
  }
}

.modal-div {
  width: 340px;
  position: relative;
  margin: 0 auto;

  .img-item {
    color: rgb(255, 255, 255);
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    top: 61%;
    text-align: center;

    .inner-contents {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .amount {
    font-size: 60px;
    line-height: 65px;
  }

  .bonus {
    color: rgb(228, 0, 35);
    font-size: 35px;
    font-weight: bold;
    line-height: 38px;
  }
}

.hot-promo {
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &.flat-border-radius {
    border-radius: 0px !important;
  }

  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    &.isDesktop {
      display: block;
      height: 500px;
    }

    &.isMobile {
      display: none;
      height: 220px;
    }
  }

  .common-promo {
    display: flex;
    justify-content: center;
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;
    align-items: center;

    .extrel-img {
      position: absolute;
      right: 100px;
    }

    .contents {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;

      .orange {
        color: #ffd800;
      }

      .common-btn {
        display: inline-block;
      }
    }

    &.p19 {
      gap: 120px;
      text-align: center;
    }

    &.p-2 {
      gap: 120px;
      text-align: center;
    }

    &.p-5 {
      gap: 60px;
      text-align: left;

      .ant-form-item-label > label {
        color: #eeeeee;
      }
    }

    &.p-6 {
      .contents {
        gap: 50px;
      }
    }
  }
}

.cs-btn {
  cursor: pointer;
  display: block;
  width: 198px;
  height: 52px;
  background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%), linear-gradient(#000, #000);
  background-blend-mode: normal, normal;
  border-radius: 26px;
  color: #fff;
  font-size: 16px;
  margin: 0 auto;
  text-align: center;
  line-height: 52px;
  border: none;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

@media (max-width: 768px) {
  .hot-promo {
    .promo-bg {
      img {
        max-width: 140px;
      }
    }

    .common-promo {
      flex-direction: column;
      background-position: top center;

      .extrel-img {
        display: none;
      }

      &.p19,
      &.p-2,
      &.p-5,
      &.p-6 {
        gap: 20px;

        .contents {
          gap: 20px;
        }
      }
    }
  }
}

.ribbon {
  clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
  background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
  padding-right: 10px;
  font-family: "PingFang SC";
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  width: fit-content;
  padding: 0px 20px 0px 10px;
  aspect-ratio: 94/30;
  white-space: nowrap;
}

.title-img {
  aspect-ratio: 2952 / 176;
  background: url("../assets/images/promotion/hotpromo/common/promo-details-title-bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 905px 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  color: #4c4c6c;
  font-weight: bold;
  letter-spacing: 3px;
}
</style>

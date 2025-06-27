<template>
  <div class="hot-promo">
    <ClaimPromo
      v-if="listParam.type === 'claimpromo'"
      :promo-id="list.id"
      :promo-code="list.promoCode"
      :loading-claim="btnLoading"
      @daily-slot="handleSlot(list.promoCode)"
    />
    <DragonCardPromo v-if="list.redirectUrl === 'lh1-dragon-card'" />
    <OuZuLianPromo v-else-if="list.redirectUrl === 'ouzulian'" />
    <SubmitClaimPromo v-else-if="list.redirectUrl === 'LH1-UCL'" :promo-code="list.promoCode" />
    <FeedbackAwardPromo v-else-if="list.redirectUrl === 'lh1-feedback-award'" />
    <AppHongBao v-else-if="list.redirectUrl === 'lh1-app-hongbao'" :promo-code="list.promoCode" :params="list.param" />
    <PrivilegeInvitePromo
      v-else-if="
        list.redirectUrl === 'lh1-invite' || list.redirectUrl === 'lh1-invite-2' || list.redirectUrl === 'lh1-invite-3'
      "
    />
    <EsportQuiz v-else-if="list.redirectUrl === 'lh1-quiz'" />
    <SummonerPromo v-else-if="list.redirectUrl === 'lh1-summon-event'" :promo-code="list.promoCode" />
    <SlotLacky8 v-else-if="list.redirectUrl === 'lh1-slot-lucky8'" :promo-code="list.promoCode" />
    <fishHongbao v-else-if="list.redirectUrl === 'lh-fish-hongbao'" />
    <DepositRebate2 v-else-if="list.redirectUrl === 'lh1-deposit-rebate2'" />
    <AijiasuPromo v-else-if="list.redirectUrl === 'lh1-aijiasu'" />
    <newplayerGuide v-else-if="list.redirectUrl === 'lh1-newplayer-guide'" />
    <ChallengeComebackPromo v-else-if="list.redirectUrl === 'lh1-cycle-loss-refund'" :promo-code="list.promoCode" />
    <OfficialGiftPromo v-else-if="list.redirectUrl === 'lh-official-gift'" :params="list.param" />
    <DailyCheckin v-else-if="list.redirectUrl === 'lh1-daily-checkin'" :promo-info="list" />
    <NewFootball v-else-if="list.redirectUrl === 'lh1-football'" :promo-code="list.promoCode" />
    <EslOneBkk2024 v-else-if="list.redirectUrl === 'lh1-esl-one-bangkok-2024'" :promo-code="list.promoCode" />
    <AgYuanxiaohongbao v-else-if="list.redirectUrl === 'lh1-ag-yuanxiaohongbao'" :promo-code="list.promoCode" />

    <Cba30Dream v-else-if="list.redirectUrl === 'lh1-cba30-dream'" :promo-code="list.promoCode" />
    <PerfectWorldMajor2024 v-else-if="list.redirectUrl === 'lh1-perfect-world-major-2024'" :promo-param="listParam" />
    <DemaciaCup1 v-else-if="list.redirectUrl === 'lh-demacia-cup-1'" :promo-param="listParam" />
    <Lh1LplLck2025loss v-else-if="list.redirectUrl === 'lh1-lpl-lck-2025-loss'" :promo-param="listParam" />
    <LanternFestival2025 v-else-if="list.redirectUrl === 'lh1-lantern-festival-bonus'" :promo-param="listParam" />

    <LiveDailyRebates v-else-if="list.redirectUrl === 'lh1-live-daily-rebates'" :promo-code="list.promoCode" />
    <NewVipRebate v-else-if="list.redirectUrl === 'lh1-newvip-rebate'" :promo-code="list.promoCode" />
    <LoLS14 v-else-if="list.redirectUrl === 'lh1-lol-s14'" :promo-code="list.promoCode" />
    <DailiPromo v-else-if="list.redirectUrl === 'lh1-all-daili'" :params="list.param" />
    <lh1Vip v-else-if="list.redirectUrl === 'lh1-vip'" />
    <SlotLossBonusPromo v-else-if="list.redirectUrl === 'lh1-weekly-slot-loss-bonus'" />
    <ChristmasGachapon
      v-else-if="list.redirectUrl === 'lh1-christmas-gashapon'"
      :promo-code="list.promoCode"
      :promo-rules="list.pageContent"
    />
    <BountyBlastPremier v-else-if="list.redirectUrl === 'bounty-blast-premier'" :promo-code="list.promoCode" />
    <VctcnMatchPromo v-else-if="list.redirectUrl === 'lh1-vctcn'" :promo-code="list.promoCode" />
    <HongBaoYu2025 v-else-if="list.redirectUrl === 'hongbaoyu-2025'" :promo-code="list.promoCode" />
    <Monthly20HongBaoYu v-else-if="list.redirectUrl === 'lh1-monthly-20th-red-envelope'" :promo-code="list.promoCode" />
    <PGLBucharest2025 v-else-if="list.redirectUrl === 'lh1-pgl-bucharest-2025'" :promo-code="list.promoCode" />
    <Belgrade2025Promo v-else-if="list.redirectUrl === 'belgrade-2025'" :promo-code="list.promoCode" />
    <VctBangkok v-else-if="list.redirectUrl === 'lh1-vct-masters-bangkok-2025'" :promo-code="list.promoCode" />
    <DreamLeagueS25 v-else-if="list.redirectUrl === 'lh1-dream-league-s25'" :promo-code="list.promoCode" />
    <KatowiceS25 v-else-if="list.redirectUrl === 'lh1-iem-katowice-2025'" :promo-code="list.promoCode" />
    <Dota2BlastSlam2025 v-else-if="list.redirectUrl === 'lh1-blast-slam-2025'" :promo-code="list.promoCode" />
    <Blast2025S3 v-else-if="list.redirectUrl === 'lh1-blast-open-lisbon-2025'" :promo-code="list.promoCode" />
    <DarkModePromo v-else-if="list.redirectUrl === 'lh1-dark-mode'" />
    <PGLOnFireBuenosAires2025
      v-else-if="list.redirectUrl === 'lh1-pgl-on-fire-buenos-aires-2025'"
      :promo-code="list.promoCode"
    />
    <SkyesportsSouvenir2025
      v-else-if="list.redirectUrl === 'lh1-skyesports-souvenir-2025'"
      :promo-code="list.promoCode"
    />
    <EslProLeagueS21 v-else-if="list.redirectUrl === 'lh1-esl-pro-league-s21'" :promo-param="listParam" />
    <PglS32025 v-else-if="list.redirectUrl === 'lh1-2025-pgl-s3'" :promo-param="listParam" />
    <FissureUniverseS4 v-else-if="list.redirectUrl === 'lh1-fissure-universe-s4'" :promo-code="list.promoCode" />
    <YaLLa2025 v-else-if="list.redirectUrl === 'lh1-yalla-compass-qatar-2025'" :promo-code="list.promoCode" />
    <IemMelbourne2025 v-else-if="list.redirectUrl === 'lh1-iem-melbourne-2025'" :promo-code="list.promoCode" />
    <PglWallachiaS5 v-else-if="list.redirectUrl === 'lh1-pgl-wallachia-s5'" :promo-code="list.promoCode" />
    <tgWorldChamp2025 v-else-if="list.redirectUrl === 'lh1-tp-world-champ-2025-sa'" :promo-code="list.promoCode" />
    <lh1Ti14 v-else-if="list.redirectUrl === 'lh1-ti14'" :promo-code="list.promoCode" />
    <iemCologne2025 v-else-if="list.redirectUrl === 'lh1-iem-cologne-2025'" :promo-code="list.promoCode" />
    <BlastSlam32025 v-else-if="list.redirectUrl === 'lh1-blast-slam-3-2025'" :promo-code="list.promoCode" />
    <sport-refer-bet-bonus v-else-if="list.redirectUrl === 'lh1-sport-refer-bet-bonus'" :promo-code="list.promoCode" />
    <Lh1Enc2025 v-else-if="list.redirectUrl === 'lh1-enc-2025'" :promo-code="list.promoCode" />
    <PglastanaAc2025 v-else-if="list.redirectUrl === 'lh1-pgl-astana-2025'" :promo-code="list.promoCode" />
    <Cct2025 v-else-if="list.redirectUrl === 'lh1-cct-global-finals-2025'" :promo-code="list.promoCode" />
    <FpSlotPromo v-else-if="list.redirectUrl === 'lh1-fp-slot'" :promo-code="list.promoCode" />
    <elsOne2025 v-else-if="list.redirectUrl === 'lh1-esl-one-raleigh-2025'" :promo-code="list.promoCode" />
    <YuEBaoPromo v-else-if="list.redirectUrl === 'lh1-yu-e-bao'" :promo-code="list.promoCode" />
    <BlastRival2025 v-else-if="list.redirectUrl === 'lh1-blast-rivals-2025-s1'" :promo-code="list.promoCode" />
    <DragonBoat v-else-if="list.redirectUrl === 'lh-duanwujie24'" :promo-code="list.promoCode" />
    <DuanWuRewards v-else-if="list.redirectUrl === 'lh1-duan-wu-rewards'" :promo-code="list.promoCode" />
    <IemDallas2025 v-else-if="list.redirectUrl === 'lh1-iem-dallas-2025'" :promo-code="list.promoCode" />
    <DreamLeagueS26 v-else-if="list.redirectUrl === 'lh1-dream-league-s26'" :promo-code="list.promoCode" />
    <WorldCup2025 v-else-if="list.redirectUrl === 'lh1-fifa-quiz-2025'" :promo-code="list.promoCode" />
    <NewUserSportBonus2025
      v-else-if="list.redirectUrl === 'lh1-new-user-sport-bonus-2025'"
      :promo-code="list.promoCode"
    />
    <FissureUniverseS5 v-else-if="list.redirectUrl === 'lh1-fissure-universe-s5'" :promo-code="list.promoCode" />
    <EsportWorldCup2025 v-else-if="list.redirectUrl === 'lh1-esport-world-cup-2025'" :promo-code="list.promoCode" />
    <FifaCwcRedPacket v-else-if="list.redirectUrl === 'lh1-fifa-cwc-red-packet'" :promo-code="list.promoCode" />
    <FissureJulyFinal2025 v-else-if="list.redirectUrl === 'lh1-fissure-july-final-2025'" :promo-code="list.promoCode" />
  </div>

  <q-dialog v-model="isClaimModal" persistent>
    <q-card class="win-rebate-model">
      <q-card-section class="items-center row">
        <div class="bonus-svg-div">
          <span class="bonus-text">恭喜获得奖金</span>
          <span class="claim-amt">{{ claimMsg }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="确定" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { defineAsyncComponent, defineComponent, ref } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import moment from "moment";

const EslOneBkk2024 = defineAsyncComponent(() => import("../components/hotpromo/eslone-bkk-2024/EslOneBkk2024.vue"));
const AgYuanxiaohongbao = defineAsyncComponent(() =>
  import("../components/hotpromo/ag-yuanxiaohongbao/AgYuanxiaohongbao.vue")
);
const HongBaoYu2025 = defineAsyncComponent(() => import("../components/hotpromo/hongbaoyu2025/HongBaoYu2025.vue"));
const Monthly20HongBaoYu = defineAsyncComponent(() =>
  import("../components/hotpromo/hongbaoyu2025/Monthly20HongBaoYu.vue")
);
const VctBangkok = defineAsyncComponent(() => import("../components/hotpromo/vct-bangkok/VctBangkok.vue"));
const PGLOnFireBuenosAires2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/pgl-on-fire-buenos-aires-2025/PGLOnFireBuenosAires2025.vue")
);
const SkyesportsSouvenir2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/skyesports-souvenir-2025/SkyesportsSouvenir2025.vue")
);
const PglS32025 = defineAsyncComponent(() => import("../components/hotpromo/pgl-s3-2025/PglS32025.vue"));
const FissureUniverseS4 = defineAsyncComponent(() =>
  import("../components/hotpromo/fissure-universe-s4/FissureUniverseS4.vue")
);
const YaLLa2025 = defineAsyncComponent(() => import("../components/hotpromo/YaLLa2025/YaLLa2025.vue"));

const IemMelbourne2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/iem-melbourne-2025/IemMelbourne2025.vue")
);
const PglWallachiaS5 = defineAsyncComponent(() => import("../components/hotpromo/pgl-wallachia-s5/PglWallachiaS5.vue"));
const tgWorldChamp2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/tp-world-champ-2025-sa/tp-world-champ-2025-sa.vue")
);
const lh1Ti14 = defineAsyncComponent(() => import("../components/hotpromo/lh1-ti14/lh1-ti14.vue"));
const iemCologne2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/iem-cologne-2025/iem-cologne-2025.vue")
);
const BlastSlam32025 = defineAsyncComponent(() =>
  import("../components/hotpromo/blast-slam-3-2025/BlastSlam32025.vue")
);
const sportReferBetBonus = defineAsyncComponent(() =>
  import("../components/hotpromo/sport-refer-bet-bonus/sport-refer-bet-bonus.vue")
);

const Lh1Enc2025 = defineAsyncComponent(() => import("../components/hotpromo/Lh1-enc-2025/Lh1-enc-2025.vue"));
const PglastanaAc2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/lh1-pgl-astana-2025/pglastanaAc2025.vue")
);
const BlastRival2025 = defineAsyncComponent(() => import("../components/hotpromo/BlastRival2025/BlastRival2025.vue"));
const Cct2025 = defineAsyncComponent(() => import("../components/hotpromo/Cct-2025/Cct-2025.vue"));
const DragonBoat = defineAsyncComponent(() => import("../components/hotpromo/dragonboat/DragonBoat.vue"));
const DuanWuRewards = defineAsyncComponent(() => import("../components/hotpromo/duan-wu-rewards/DuanWuRewards.vue"));
const IemDallas2025 = defineAsyncComponent(() => import("../components/hotpromo/iem-dallas-2025/IemDallas2025.vue"));
const ClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/claimPromo.vue"));
const DragonCardPromo = defineAsyncComponent(() => import("../components/hotpromo/dragoncard/dragonCardPromo.vue"));
const FeedbackAwardPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/feedbackaward/feedbackAwardPromo.vue")
);
const PrivilegeInvitePromo = defineAsyncComponent(() =>
  import("../components/hotpromo/privilegeinvite/privilegeInvitePromo.vue")
);
const EsportQuiz = defineAsyncComponent(() => import("../components/hotpromo/esportquiz/EsportQuiz.vue"));
const SummonerPromo = defineAsyncComponent(() => import("../components/hotpromo/summoner/SummonerPromo.vue"));
const AppHongBao = defineAsyncComponent(() => import("../components/hotpromo/apphongbao/AppHongBao.vue"));
const SlotLacky8 = defineAsyncComponent(() => import("../components/hotpromo/slot-lacky8-24/slot-lacky8-24.vue"));
const fishHongbao = defineAsyncComponent(() => import("../components/hotpromo/fishHongbao/fishHongbao.vue"));
const DepositRebate2 = defineAsyncComponent(() => import("../components/hotpromo/depositRebate2/depositRebate2.vue"));
const AijiasuPromo = defineAsyncComponent(() => import("../components/hotpromo/aijiasu/AijiasuPromo.vue"));
const newplayerGuide = defineAsyncComponent(() => import("../components/hotpromo/newplayerGuide/newplayerGuide.vue"));
const OuZuLianPromo = defineAsyncComponent(() => import("../components/hotpromo/ouzulian/OuZuLianPromo.vue"));
const ChallengeComebackPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/challengeComeback/ChallengeComeback.vue")
);
const OfficialGiftPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/officialGift/OfficialGiftPromo.vue")
);
const DailyCheckin = defineAsyncComponent(() => import("../components/hotpromo/DailyCheckin/DailyCheckin.vue"));
const NewFootball = defineAsyncComponent(() => import("../components/hotpromo/NewFootball/NewFootball.vue"));
const Cba30Dream = defineAsyncComponent(() => import("./hotpromo/cba30-dream/Cba30Dream.vue"));
const PerfectWorldMajor2024 = defineAsyncComponent(() =>
  import("./hotpromo/perfect-world-major-2024/PerfectWorldMajor2024.vue")
);
const DemaciaCup1 = defineAsyncComponent(() => import("./hotpromo/demacia-cup-1/DemaciaCup1.vue"));
const Lh1LplLck2025loss = defineAsyncComponent(() =>
  import("./hotpromo/lh1-lpl-lck-2025-loss/lh1-lpl-lck-2025-loss.vue")
);
const LanternFestival2025 = defineAsyncComponent(() =>
  import("./hotpromo/lantern-festival-2025/LanternFestival2025.vue")
);
const LiveDailyRebates = defineAsyncComponent(() => import("./hotpromo/live-daily-rebates/LiveDailyRebates.vue"));
const NewVipRebate = defineAsyncComponent(() => import("../components/hotpromo/newVipRebate/newVipRebate.vue"));
const LoLS14 = defineAsyncComponent(() => import("../components/hotpromo/lol-s14/LoLS14.vue"));
const SubmitClaimPromo = defineAsyncComponent(() => import("../components/hotpromo/submitclaim/SubmitClaimPromo.vue"));
const DailiPromo = defineAsyncComponent(() => import("../components/hotpromo/daili/DailiPromo.vue"));
const lh1Vip = defineAsyncComponent(() => import("./hotpromo/lh1-vip/lh1Vip.vue"));
const SlotLossBonusPromo = defineAsyncComponent(() => import("./hotpromo/slot-loss-bonus/SlotLossBonusPromo.vue"));
const ChristmasGachapon = defineAsyncComponent(() => import("./hotpromo/christmas-gachapon/ChristmasGachapon.vue"));
const BountyBlastPremier = defineAsyncComponent(() =>
  import("../components/hotpromo/bounty-blast/BountyBlastPremier.vue")
);
const VctcnMatchPromo = defineAsyncComponent(() =>
  import("../components/hotpromo/vctcn-match-promo/VctcnMatchPromo.vue")
);
const Belgrade2025Promo = defineAsyncComponent(() =>
  import("../components/hotpromo/belgrade-2025-promo/Belgrade2025Promo.vue")
);

const KatowiceS25 = defineAsyncComponent(() => import("./hotpromo/katowice-s-25/KatowiceS25.vue"));
const lh1Vctcn = defineAsyncComponent(() => import("./hotpromo/lh1-vctcn/lh1Vctcn.vue"));
const DreamLeagueS25 = defineAsyncComponent(() => import("../components/hotpromo/dream-league-s25/DreamLeagueS25.vue"));
const Dota2BlastSlam2025 = defineAsyncComponent(() =>
  import("../components/hotpromo/dota2-blast-slam-2025/Dota2BlastSlam2025.vue")
);
const DarkModePromo = defineAsyncComponent(() => import("../components/hotpromo/dark-mode/DarkModePromo.vue"));
const EslProLeagueS21 = defineAsyncComponent(() => import("./hotpromo/esl-pro-league-s21/EslProLeagueS21.vue"));

const PGLBucharest2025 = defineAsyncComponent(() => import("./hotpromo/pgl-bucharest-2025/PGLBucharest2025.vue"));

const Blast2025S3 = defineAsyncComponent(() => import("./hotpromo/Blast2025-s3/Blast2025S3.vue"));
const FpSlotPromo = defineAsyncComponent(() => import("./hotpromo/fp-slot-promo/FpSlotPromo.vue"));
const elsOne2025 = defineAsyncComponent(() => import("./hotpromo/elsOne2025/elsOne2025.vue"));
const YuEBaoPromo = defineAsyncComponent(() => import("./hotpromo/yu-e-bao/YuEBaoPromo.vue"));
const DreamLeagueS26 = defineAsyncComponent(() => import("./hotpromo/dream-league-s26/DreamLeagueS26.vue"));
const WorldCup2025 = defineAsyncComponent(() => import("./hotpromo/worldcup-2025/WorldCup2025.vue"));
const NewUserSportBonus2025 = defineAsyncComponent(() =>
  import("./hotpromo/new-user-sport-bonus-2025/NewUserSportBonus2025.vue")
);
const FissureUniverseS5 = defineAsyncComponent(() => import("./hotpromo/fissure-universe-s5/FissureUniverseS5.vue"));
const EsportWorldCup2025 = defineAsyncComponent(() =>
  import("./hotpromo/esport-world-cup-2025/EsportWorldCup2025.vue")
);
const FifaCwcRedPacket = defineAsyncComponent(() => import("./hotpromo/fifa-cwc-red-packet/FifaCwcRedPacket.vue"));
const FissureJulyFinal2025 = defineAsyncComponent(() =>
  import("./hotpromo/fissure-july-final-2025/FissureJulyFinal2025.vue")
);

export default defineComponent({
  name: "HotPromo",
  order: 1,
  // setup: (props, { emit }) => {},
  components: {
    Lh1Enc2025,
    DragonBoat,
    DuanWuRewards,
    Cct2025,
    YaLLa2025,
    elsOne2025,
    Blast2025S3,
    PglS32025,
    KatowiceS25,
    VctBangkok,
    NewFootball,
    DailyCheckin,
    SlotLacky8,
    fishHongbao,
    ClaimPromo,
    DragonCardPromo,
    FeedbackAwardPromo,
    PrivilegeInvitePromo,
    EsportQuiz,
    SummonerPromo,
    AppHongBao,
    DepositRebate2,
    AijiasuPromo,
    newplayerGuide,
    OuZuLianPromo,
    ChallengeComebackPromo,
    OfficialGiftPromo,
    EslOneBkk2024,
    AgYuanxiaohongbao,
    Cba30Dream,
    PerfectWorldMajor2024,
    DemaciaCup1,
    Lh1LplLck2025loss,
    LanternFestival2025,
    LiveDailyRebates,
    NewVipRebate,
    LoLS14,
    SubmitClaimPromo,
    DailiPromo,
    lh1Vip,
    SlotLossBonusPromo,
    ChristmasGachapon,
    BountyBlastPremier,
    VctcnMatchPromo,
    HongBaoYu2025,
    Monthly20HongBaoYu,
    PGLBucharest2025,
    Belgrade2025Promo,
    lh1Vctcn,
    DreamLeagueS25,
    Dota2BlastSlam2025,
    DarkModePromo,
    PGLOnFireBuenosAires2025,
    SkyesportsSouvenir2025,
    EslProLeagueS21,
    FissureUniverseS4,
    IemMelbourne2025,
    PglWallachiaS5,
    tgWorldChamp2025,
    lh1Ti14,
    iemCologne2025,
    BlastSlam32025,
    sportReferBetBonus,
    PglastanaAc2025,
    FpSlotPromo,
    YuEBaoPromo,
    BlastRival2025,
    IemDallas2025,
    DreamLeagueS26,
    WorldCup2025,
    NewUserSportBonus2025,
    FissureUniverseS5,
    EsportWorldCup2025,
    FifaCwcRedPacket,
    FissureJulyFinal2025
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
      activeKey: "1",
      hotPromoList: [],
      selectedHotPromo: {
        id: "",
        bg: "",
        contents: ""
      }
    };
  },
  computed: {
    listParam() {
      try {
        return JSON.parse(this.list.param);
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },
  methods: {},
  mounted() {
    this.hotPromoList.forEach((element) => {
      if (this.list.id === element.id) {
        this.selectedHotPromo = element;
      }
    });
    const store = userStore();
    if (this.list.id == 30) {
      // console.log("Iphone promo");
      // this.loadLNWinnerList();
      if (store.hasToken()) {
        this.filterWinnerLists();
      }
    }
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    var qs = require("qs");
    const loading = ref(false);
    const btnLoading = ref(false);
    const isClaimModal = ref(false);
    const claimMsg = ref("");
    const formState = ref({
      dateTime: "",
      onlyMe: false,
      resultTime: ""
    });

    const winnerDataSource = ref([]);
    const filterWinnerLists = () => {
      var resultTime = formState.value.resultTime;
      var winnerUrl = "/privi/winners";
      if (resultTime) {
        winnerUrl += "?resultTime=" + resultTime;
      }

      // console.log(winnerUrl);

      winnerDataSource.value = [];
      loading.value = true;
      eventapi.get(winnerUrl).then((res) => {
        loading.value = false;
        var data = res.data.data;

        for (let i in data) {
          data[i].winners.forEach((winner) => {
            winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");
            winnerDataSource.value.push(winner);
          });
        }
      });
    };

    // const loadLNWinnerList = () => {
    //   const winnerUrl = "/privi/winners";
    //   winnerDataSource.value = [];
    //   loading.value = true;
    //   eventapi
    //     .get(winnerUrl)
    //     .then((res) => {
    //       loading.value = false;
    //       var data = res.data.data;

    //       for (let i in data) {
    //         _.each(data[i].winners, function (winner, index) {

    //           winner.date = moment(data[i].resultTime).format("DD/MM/YYYY");
    //           console.log(winner);

    //           winnerDataSource.value.push(winner);
    //         })
    //       }
    //     });
    // }

    // const ClaimDailyRebate = (id) => {
    //   if (!store.hasToken()) {
    //   } else {
    //     // var user_id = store.id;
    //     var claim_id = '';
    //     if (id == 27) {
    //       claim_id = 'jolly88-daily-rebate';
    //     } else if (id == 32) {
    //       claim_id = 'jolly88-daily-slot';
    //     } else if (id == 31) {
    //       claim_id = 'jolly88-refund';
    //     }

    //     // console.log(eventapi);

    // }
    // }

    const router = useRouter();
    const handleSlot = (promoCode) => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "primary",
            label: "去登录",
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: "取消",
            tabindex: 0
          },
          persistent: true
        }).onOk(() => {
          router.push("/login");
        });
        return;
      }
      const bonusItem = promoCode;
      const eventUrl = "/bonus/claim/" + bonusItem;
      btnLoading.value = true;
      eventapi
        .put(eventUrl)
        .then((res) => {
          btnLoading.value = false;
          if (res.code === 0) {
            var rebatePoint = res.data;
            claimMsg.value = "￥" + rebatePoint;
            isClaimModal.value = true;
          } else {
            btnLoading.value = false;
          }
        })
        .catch((error) => {
          btnLoading.value = false;
        });
    };

    const goToCsChat = () => {
      if (!store.token) {
        $q.dialog({
          class: "q-px-md q-pt-md",
          title: "系统提示",
          message: "请登录后再操作",
          ok: {
            push: true,
            color: "primary",
            label: "去登录",
            tabindex: 1
          },
          cancel: {
            push: true,
            color: "warning",
            label: "取消",
            tabindex: 0
          },
          persistent: true
        }).onOk(() => {
          router.push("/login");
        });
        return;
      }
      router.push("/liveChat");
    };

    return {
      goToCsChat,
      store,
      filterWinnerLists,
      formState,
      winnerDataSource,
      loading,
      btnLoading,
      isClaimModal,
      claimMsg,
      handleSlot
    };
  }
});
</script>
<style lang="scss">
.hot-promo {
  overflow: hidden;
  position: relative;

  .promo-bg {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .common-promo {
    background-size: contain;
    gap: 30px;
    text-align: center;
    padding: 20px;

    .extra-img {
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
      // color: #ffffff;

      .orange {
        color: #db7e42;
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

.promo-sjb,
.promo-invt {
  background: #2b2b4b;
  padding: 10px;
}

.win-rebate-model {
  width: 80%;
  max-width: 450px;
  min-width: 300px;
  padding: 10px;
  background: transparent;
  position: relative;
  box-shadow: none;

  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5;

    .q-btn,
    .q-btn__content {
      margin-top: 0px;
      width: 40px;
      height: 40px;
    }

    .q-btn__content {
      color: #000;
      width: 8px;
      background-image: none !important;
    }
  }

  .bonus-svg-div {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .claim-amt {
      font-size: 30px;
      color: var(--q-primary);
      text-align: center;
    }

    .bonus-text {
      font-size: 22px;
      // color: #ff3131;
      color: var(--q-primary);
      text-align: center;
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .q-btn-item {
    margin-top: 10px;
  }

  .q-btn__content {
    color: #fff;
    background-image: linear-gradient(90deg, #2d74f6 0, #7abdfc 100%) !important;
    width: 80px;
    border-radius: 5px;
    -moz-border-radius: 5px;
  }
}

.cs-btn {
  color: #ffffff;
  padding: 5px 30px;
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.5799999237px 0px #b1d7ff inset;
  box-shadow: 0px -1px 3.6640000343px 0px #5894ff inset;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
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

      .extra-img {
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

.section-bg {
  border: 1px solid rgba(172, 212, 246, 1);
  background: #f2f8fe;
  border-radius: 12px;
  padding: 30px;
  font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial, sans-serif;

  &.cny {
    background: url("../assets/images/promotion/hotpromo/hongbaoyu2025/section-bg.png");
    background-size: 100% 100%;
    border: none;
  }

  .claim-title-icon,
  .claim-coin-icon,
  .claim-gift-icon,
  .claim-stacked-coins-icon {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .claim-title-icon {
    background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/section-title-img.png") no-repeat center
      center;
    background-size: 100% 100%;
  }

  .claim-coin-icon {
    background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon1.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-gift-icon {
    background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon2.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-stacked-coins-icon {
    background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-icon3.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .claim-btn-img {
    aspect-ratio: 762/630;
    width: auto;
    height: 100%;
    background: url("../assets/images/promotion/hotpromo/lh-livepoker-rebate/reward-btn.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .section-table {
    th {
      height: 56px;
      font-size: 1rem;
      font-weight: 400;
      line-height: 28px;
      color: #fff !important;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%) !important;
      white-space: pre-wrap;

      &:not(:last-child) {
        border-right: 1px solid #dcdce8;
      }
    }

    td {
      border: 1px solid #dcdce8;
      color: #333;
      background: transparent !important;
    }

    &.cny {
      th {
        background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%) !important;
        color: #894800 !important;
      }
    }
  }

  .section-table2 {
    th {
      height: 56px;
      font-size: 1rem;
      font-weight: 400;
      line-height: 28px;
      color: #fff !important;
      background: linear-gradient(180deg, #00cc8c 0%, #006646 100%) !important;
      white-space: pre-wrap;
    }

    td {
      border: 1px solid #dcdce8;
      color: #014625 !important;
      background: transparent !important;
    }

    &.cny {
      th {
        background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%) !important;
        color: #894800 !important;
      }
    }
  }

  .element-bg {
    color: #fff !important;
    box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
      0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%) !important;
  }

  .ribbon {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    padding-right: 10px;
    font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
      sans-serif;

    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: fit-content;
    padding: 0px 20px 0px 10px;
    height: fit-content;
    min-width: 100px;

    &.cny {
      background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%);
      color: #894800;
    }
  }

  .ribbon2 {
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - 10px) 50%, 100% 100%, 0% 100%);
    background: linear-gradient(180deg, #00cc8c 0%, #006646 100%);
    padding-right: 10px;
    font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
      sans-serif;

    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: fit-content;
    padding: 0px 20px 0px 10px;

    &.cny {
      background: linear-gradient(180deg, #ffe190 0%, #ff9f40 100%);
      color: #894800;
    }
  }

  .title-img {
    aspect-ratio: 960 / 80;
    background: url("../assets/images/promotion/hotpromo/common/promo-details-title-bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 290px 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #4c4c6c;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .item {
    color: #333;
    padding-left: 24px;
    display: flex;
    gap: 10px;
    font-size: 1rem;

    .item-num {
      color: #ffffff;
      font-size: 1rem;
      line-height: 1;
      border-radius: 50%;
      height: 28px !important;
      width: 28px !important;
      min-width: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 2px;
      background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
    }
  }
}

.body--dark {
  .section-bg {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%) !important;
    border: 1px solid #be9457 !important;
    color: #fff;
  }
  .section-bg2 {
    background: #fbfbe3 !important;
    border: 1px solid #027c5f !important;
    color: #000000;
  }

  .section-bg,
  .section-bg2 {
    .claim-title-icon,
    .claim-coin-icon,
    .claim-gift-icon {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .claim-title-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-title-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .claim-coin-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-coin-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .claim-gift-icon {
      background: url("../assets/images/promotion/hotpromo/common/claim-gift-icon.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    .title-img {
      color: #fff;
    }

    .section-table {
      th {
        color: #fff !important;
        box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
          0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
        background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
      }

      td {
        border: 1px solid #484c5770;
        color: #fff;
      }
    }

    .element-bg {
      color: #fff !important;
      box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
        0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
    }

    .ribbon {
      background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%);
    }

    .item {
      color: #fff;

      .item-num {
        color: #fff !important;
        box-shadow: 0px 8px 9px 0px rgba(255, 255, 255, 0.25) inset, 0px 4px 4px 0px rgba(255, 255, 255, 0.25) inset,
          0px -4px 4px 0px rgba(255, 255, 255, 0.25) inset !important;
        background: linear-gradient(180deg, #597adf 0%, #3c5ec3 100%) !important;
      }
    }
  }
}
</style>

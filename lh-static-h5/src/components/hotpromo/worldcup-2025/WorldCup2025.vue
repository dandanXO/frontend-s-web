<template>
  <div class="worldcup-2025-wrapper">
    <div class="title-content">
      <div class="col-title">活动内容</div>
      <div class="col-record">【竞猜记录】</div>
    </div>
    <div class="toptitle-row">
      <div class="col-desc">
        活动期间，会员完成特殊事件竞猜或独赢竞猜，最高可获得
        <span>288</span>
        竞猜奖金。
      </div>
    </div>
    <div class="swiper-container-wrapper">
      <div class="swiper-button-prev">
        <i class="icon-chevron-left"></i>
      </div>
      <Swiper
        class="livestream-list-wrapper"
        :slides-per-view="1.5"
        :space-between="16"
        :loop="false"
        :pagination="false"
        :direction="'horizontal'"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(live, index) in list" :key="`${live}-${index}`" class="swiper-slide">
          <div
            class="livestream-list-item"
            :class="{
              selected: model === index
            }"
            @click="handleLivestreamClick(index)"
          >
            <div class="livestream-list-item__match-info">
              <div class="livestream-list-item__match-info__team">
                <div class="livestream-list-item__match-info__team-emblem">
                  <img :src="live.homeIcon || systemAvatarImg" loading="lazy" />
                </div>
                <span class="livestream-list-item__match-info__team-name">
                  {{ live.homeNameZh || live.homeNameEn || live.homeName }}
                </span>
              </div>

              <div class="livestream-list-item__match-info__date">
                <span class="livestream-list-item__match-info__date__vs">VS</span>
                <div v-if="live.liveStatus" class="livestream-list-item__match-info__date__on-air">正在直播</div>
                <div v-else class="livestream-list-item__match-info__date__date">
                  {{ getDisplayDateTime(live.eventStartTime) }}
                </div>
              </div>
              <div class="livestream-list-item__match-info__team">
                <div class="livestream-list-item__match-info__team-emblem">
                  <img :src="live.awayIcon || systemAvatarImg" loading="lazy" />
                </div>
                <span class="livestream-list-item__match-info__team-name">
                  {{ live.awayNameZh || live.awayNameEn || live.awayName }}
                </span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="swiper-button-next">
        <i class="icon-chevron-right"></i>
      </div>
    </div>

    <div class="current-match-container">
      <div class="match-info match-info--home">
        <div class="info-img">
          <img :src="currentListItem.homeIcon || systemAvatarImg" loading="lazy" />
        </div>
        <div class="info-txt">
          {{ currentListItem.homeNameZh || currentListItem.homeNameEn || currentListItem.homeName }}
        </div>
      </div>

      <div class="match-home-vs">
        <div class="vs-title-row">
          <div class="title-icon">
            <img src="../../../assets/images/promo/hotpromo/worldcup-2025/icon-fifa.png" alt="" />
          </div>
          <div class="title-txt">世具杯</div>
          <div class="title-status">未开始</div>
        </div>
        <div class="vs-time">{{ getDisplayDateTime(currentListItem.eventStartTime) }}</div>
        <div class="vs-icon">
          <img src="../../../assets/images/promo/hotpromo/worldcup-2025/icon-vs.png" alt="" />
        </div>
        <div class="vs-win">独赢</div>
        <div class="vs-notes">该场赛事竞猜截止时间 06.16 03:00</div>
      </div>

      <div class="match-info match-info--away">
        <div class="info-img">
          <img :src="currentListItem.awayIcon || systemAvatarImg" loading="lazy" />
        </div>
        <div class="info-txt">
          {{ currentListItem.awayNameZh || currentListItem.awayNameEn || currentListItem.awayName }}
        </div>
      </div>
    </div>

    <div class="title-match-row">
      <div class="col-txt">
        <img src="../../../assets/images/promo/hotpromo/worldcup-2025/icon-win.png" alt="" />
        竞猜独赢事件
      </div>
      <div class="col-record">
        满足存款≥100可参与(
        <span>当前存款100元</span>
        )
      </div>
    </div>

    <div class="current-match-bet">
      <div class="bet-select" :class="{ active: selectedTeam === 'home' }" @click="selectTeam('home')">
        {{ currentListItem.homeNameZh || currentListItem.homeNameEn || currentListItem.homeName }} 赢
      </div>
      <div class="bet-select" :class="{ active: selectedTeam === 'away' }" @click="selectTeam('away')">
        {{ currentListItem.awayNameZh || currentListItem.awayNameEn || currentListItem.awayName }} 赢
      </div>
    </div>

    <div class="match-btn active">确认竞猜</div>
    <!-- <div class="match-btn">已参与竞猜</div> -->
    <!-- <div class="match-btn">立即领取</div> -->
    <!-- <div class="match-btn">已领取</div> -->

    <div class="title-match-row">
      <div class="col-txt">
        <img src="../../../assets/images/promo/hotpromo/worldcup-2025/icon-special.png" alt="" />
        竞猜特殊事件
      </div>
    </div>

    <div class="current-match-bet special-grid">
      <div
        v-for="(item, index) in specialList"
        :key="item.id"
        class="bet-select"
        :class="{
          active: selectedSpecial === item.id,
          'long-select': index === specialList.length - 1
        }"
        @click="selectSpecial(item.id)"
      >
        {{ item.title }}
        <img :src="require(`../../../assets/images/promo/hotpromo/worldcup-2025/${item.img}`)" alt="" />
        <div class="prize-amt">
          <span>{{ item.prize }}</span>
          彩金
        </div>
      </div>
    </div>
    <div class="match-btn active">确认竞猜</div>
    <!-- <div class="match-btn">已参与竞猜</div> -->
    <!-- <div class="match-btn">立即领取</div> -->
    <!-- <div class="match-btn">已领取</div> -->
  </div>

  <div class="tnc-wrapper">
    <div class="tnc-title">活动规则</div>
    <div class="tnc-content">
      <ol>
        <li>
          独赢竞猜：当日存款≥100元，即可获得独赢竞猜机会，仅限独赢竞猜，竞猜正确即可获得彩金。 ​
          <br />
          特殊事件竞猜：比赛开始前完成特殊事件竞猜，并在指定赛事中累计投注≥1000元，若竞猜正确，即可获得竞猜彩金。
          竞猜机会仅限当天使用有效，隔日无效。
        </li>
        <li>
          竞猜活动仅计算世俱杯赛事。任何低于欧洲盘 1.7 或亚洲盘 0.7
          水位的投注及在同一局游戏中同时投注对等盘口、当日注单取消或本金退还，将不计算为有效投注额内；
        </li>
        <li>
          独赢竞猜结果分为：输、和、赢，竞猜结算（赢）猜中 即可获得8元奖金，若竞猜结果结算为“和”将会视为无效竞猜。
        </li>
        <li>竞猜正确的用户在次日优惠活动界面点击【立即领取】即可领取昨日竞猜成功的竞猜金，竞猜金仅需5倍流水出款。</li>
        <li>
          根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
        </li>
        <li>
          此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP
          地址视为同一账户，若有违规者，将不享受此红利；
        </li>
        <li>为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
      </ol>
    </div>
  </div>
</template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import moment from "moment";
import systemAvatarImg from "../../../assets/images/livestream/system-avatar.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper-bundle.css";
// import { Navigation } from "swiper/modules";
import { computed, ref, watch, onMounted } from "vue";

//   const props = defineProps({
//     list: Array,
//     isLivestreamListLoading: Boolean
//   });

SwiperCore.use([Navigation]);
// livestream list data
const list = ref([
  {
    id: 1057,
    siteId: 7,
    sportId: 5,
    eventId: 1024,
    awayName: "Team Nemesis",
    homeName: "Talon Esports",
    cover: "",
    isPopular: false,
    homeNameZh: "Talon Esports",
    homeNameEn: "Talon Esports",
    homeIcon: "https://esports-cdn.namitiyu.com/dota/team/FjWk6RaEOd3YAvNERphPDDpUJm9V",
    awayNameZh: "Team Nemesis",
    awayNameEn: "Team Nemesis",
    awayIcon: "https://esports-cdn.namitiyu.com/dota/team/FqPGjDFivDerY1FYAdLIh8xj3KaP",
    eventStartTime: 1750068000000,
    liveStatus: 0,
    streamId: "UA03B",
    sort: 11,
    title: "TI14国际邀请赛预选赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "12.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/UA03B_540p.flv?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510", "hls_url": "https://www.gdmzzj.com/live/streamer/UA03B_540p.m3u8?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/UA03B_720p.flv?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510", "hls_url": "https://www.gdmzzj.com/live/streamer/UA03B_720p.m3u8?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/UA03B_1080p.flv?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510", "hls_url": "https://www.gdmzzj.com/live/streamer/UA03B_1080p.m3u8?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/UA03B.flv?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510", "hls_url": "https://www.gdmzzj.com/live/streamer/UA03B.m3u8?txSecret=ec8308698812805f246191994e86c334&txTime=20250616175510"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046110000
  },
  {
    id: 1056,
    siteId: 7,
    sportId: 6,
    eventId: 1023,
    awayName: "BOA",
    homeName: "东莞WZ",
    cover: "",
    isPopular: false,
    homeNameZh: "东莞WZ",
    homeIcon: "https://esports-cdn.namitiyu.com/kog/team/8c0070eed968c177ec49d6424bdcc018.png",
    awayNameZh: "BOA",
    awayIcon: "https://esports-cdn.namitiyu.com/kog/team/12550df0e919378931d751b1e54ae91d.png",
    eventStartTime: 1750068000000,
    liveStatus: 0,
    streamId: "4E5RY",
    sort: 11,
    title: "2025K甲夏季赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "23.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/4E5RY_540p.flv?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507", "hls_url": "https://www.gdmzzj.com/live/streamer/4E5RY_540p.m3u8?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/4E5RY_720p.flv?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507", "hls_url": "https://www.gdmzzj.com/live/streamer/4E5RY_720p.m3u8?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/4E5RY_1080p.flv?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507", "hls_url": "https://www.gdmzzj.com/live/streamer/4E5RY_1080p.m3u8?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/4E5RY.flv?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507", "hls_url": "https://www.gdmzzj.com/live/streamer/4E5RY.m3u8?txSecret=cb393354539f461a916fca3cb3cb0541&txTime=20250616175507"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046108000
  },
  {
    id: 1045,
    siteId: 7,
    sportId: 2,
    eventId: 1012,
    awayName: "吉林",
    homeName: "新疆",
    cover: "",
    isPopular: false,
    eventStartTime: 1750066200000,
    liveStatus: 0,
    streamId: "55AOE",
    sort: 10,
    title: "全运男篮",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "111.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/55AOE_540p.flv?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722", "hls_url": "https://www.gdmzzj.com/live/streamer/55AOE_540p.m3u8?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/55AOE_720p.flv?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722", "hls_url": "https://www.gdmzzj.com/live/streamer/55AOE_720p.m3u8?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/55AOE_1080p.flv?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722", "hls_url": "https://www.gdmzzj.com/live/streamer/55AOE_1080p.m3u8?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/55AOE.flv?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722", "hls_url": "https://www.gdmzzj.com/live/streamer/55AOE.m3u8?txSecret=ffb486b3c277f58290ada1f0d40d9842&txTime=20250616120722"}}',
    name: "芊芊聊球",
    avatar: "7/800e8176-81b4-4bf6-a650-49bedad1a096.jpeg",
    roomMessage: "Amico下载链接：am165.cc 反馈专员ID：vip000 福利专员ID：gwh001",
    scheduledAnnouncement: "",
    subscribed: false,
    createTime: 1750025189000
  },
  {
    id: 1043,
    siteId: 7,
    sportId: 3,
    eventId: 1011,
    awayName: "Frank Esports",
    homeName: "WPE.PH",
    cover: "",
    isPopular: false,
    homeNameZh: "WPE.PH",
    homeNameEn: "West Point Esports PH",
    homeIcon: "https://esports-cdn.namitiyu.com/lol/team/FiOGPYRyxT9KCQ5R0PfSnKJdjN_k",
    awayNameZh: "Frank Esports",
    awayNameEn: "Frank Esports",
    awayIcon: "https://esports-cdn.namitiyu.com/lol/team/FiiEcJCtph5DgMPT_pCXHkV1tF2d",
    eventStartTime: 1750064400000,
    liveStatus: 0,
    streamId: "2AK7H",
    sort: 9,
    title: "2025PCS第二赛段",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "123.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/2AK7H_540p.flv?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535", "hls_url": "https://www.gdmzzj.com/live/streamer/2AK7H_540p.m3u8?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/2AK7H_720p.flv?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535", "hls_url": "https://www.gdmzzj.com/live/streamer/2AK7H_720p.m3u8?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/2AK7H_1080p.flv?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535", "hls_url": "https://www.gdmzzj.com/live/streamer/2AK7H_1080p.m3u8?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/2AK7H.flv?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535", "hls_url": "https://www.gdmzzj.com/live/streamer/2AK7H.m3u8?txSecret=44d0bc2415b254834e5306a302ff5c6e&txTime=20250616120535"}}',
    name: "电竞红魔渣渣辉",
    avatar: "7/4c55fa55-3fad-4084-ae2b-86229fee5615.jpeg",
    roomMessage: "Amico下载链接：am165.cc 反馈专员ID：vip000 福利专员ID：gwh001",
    scheduledAnnouncement: "",
    subscribed: false,
    createTime: 1750025099000
  },
  {
    id: 1055,
    siteId: 7,
    sportId: 4,
    eventId: 1022,
    awayName: "FAVBET",
    homeName: "Nexus",
    cover: "",
    isPopular: false,
    homeNameZh: "Nexus",
    homeNameEn: "Nexus",
    homeIcon: "https://esports-cdn.namitiyu.com/csgo/team/n52dbdba9adc8b883ff077b42a62f3a1d.png",
    awayNameZh: "FAVBET",
    awayNameEn: "FAVBET",
    awayIcon: "https://esports-cdn.namitiyu.com/csgo/team/n09367f21cd13217a8f14175e29d3bc0d.png",
    eventStartTime: 1750060800000,
    liveStatus: 0,
    streamId: "FN3BR",
    sort: 8,
    title: "银河之战 2025 第三阶段",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "12.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/FN3BR_540p.flv?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457", "hls_url": "https://www.gdmzzj.com/live/streamer/FN3BR_540p.m3u8?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/FN3BR_720p.flv?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457", "hls_url": "https://www.gdmzzj.com/live/streamer/FN3BR_720p.m3u8?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/FN3BR_1080p.flv?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457", "hls_url": "https://www.gdmzzj.com/live/streamer/FN3BR_1080p.m3u8?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/FN3BR.flv?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457", "hls_url": "https://www.gdmzzj.com/live/streamer/FN3BR.m3u8?txSecret=91b21d215d9e6968bdab1ff5b35d2418&txTime=20250616175457"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046098000
  },
  {
    id: 1054,
    siteId: 7,
    sportId: 4,
    eventId: 1021,
    awayName: "Sashi",
    homeName: "CYBERSHOKE",
    cover: "",
    isPopular: false,
    homeNameZh: "CYBERSHOKE",
    homeNameEn: "CYBERSHOKE",
    homeIcon: "https://esports-cdn.namitiyu.com/csgo/team/ne53667d6199da870530b0600ef08cb7d.png",
    awayNameZh: "Sashi",
    awayNameEn: "Sashi",
    awayIcon: "https://esports-cdn.namitiyu.com/csgo/team/nfd783c5eb334814968e316200971c61c.png",
    eventStartTime: 1750057200000,
    liveStatus: 0,
    streamId: "LF6W8",
    sort: 7,
    title: "Exort试验场 第1季",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "12.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/LF6W8_540p.flv?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454", "hls_url": "https://www.gdmzzj.com/live/streamer/LF6W8_540p.m3u8?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/LF6W8_720p.flv?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454", "hls_url": "https://www.gdmzzj.com/live/streamer/LF6W8_720p.m3u8?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/LF6W8_1080p.flv?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454", "hls_url": "https://www.gdmzzj.com/live/streamer/LF6W8_1080p.m3u8?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/LF6W8.flv?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454", "hls_url": "https://www.gdmzzj.com/live/streamer/LF6W8.m3u8?txSecret=092cf6db8ad8965b03ddfa4cfb80bb01&txTime=20250616175454"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046095000
  },
  {
    id: 1053,
    siteId: 7,
    sportId: 5,
    eventId: 1020,
    awayName: "Tech Free Gaming",
    homeName: "Execration",
    cover: "",
    isPopular: false,
    homeNameZh: "Execration",
    homeNameEn: "Execration",
    homeIcon: "https://esports-cdn.namitiyu.com/dota/team/Fq1ReZspKtHJdfKKr4qQ3dehJ4WC",
    awayNameZh: "Tech Free Gaming",
    awayNameEn: "Tech Free Gaming",
    awayIcon: "https://esports-cdn.namitiyu.com/dota/team/Fgn4aktIqXysrKXrYpd7pwyNqltO",
    eventStartTime: 1750057200000,
    liveStatus: 0,
    streamId: "7E0BA",
    sort: 6,
    title: "TI14国际邀请赛预选赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "12.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7E0BA_540p.flv?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451", "hls_url": "https://www.gdmzzj.com/live/streamer/7E0BA_540p.m3u8?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7E0BA_720p.flv?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451", "hls_url": "https://www.gdmzzj.com/live/streamer/7E0BA_720p.m3u8?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7E0BA_1080p.flv?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451", "hls_url": "https://www.gdmzzj.com/live/streamer/7E0BA_1080p.m3u8?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/7E0BA.flv?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451", "hls_url": "https://www.gdmzzj.com/live/streamer/7E0BA.m3u8?txSecret=ddf881aa10c1c065fd4b235fb92fc8df&txTime=20250616175451"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046091000
  },
  {
    id: 1052,
    siteId: 7,
    sportId: 6,
    eventId: 1019,
    awayName: "WST",
    homeName: "深圳KLG",
    cover: "",
    isPopular: false,
    homeNameZh: "深圳KLG",
    homeNameEn: "深圳KLG",
    homeIcon: "https://esports-cdn.namitiyu.com/kog/team/FpSe2CVwH3DBnLQiJznTiJIOL4sK",
    awayNameZh: "WST",
    awayNameEn: "WST",
    awayIcon: "https://esports-cdn.namitiyu.com/kog/team/Fp8YaHQV-lHlavxJU1eRmo-pisu8",
    eventStartTime: 1750057200000,
    liveStatus: 0,
    streamId: "490H6",
    sort: 5,
    title: "2025K甲夏季赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl: '{"original": {"hls_url": "请问.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/490H6_540p.flv?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449", "hls_url": "https://www.gdmzzj.com/live/streamer/490H6_540p.m3u8?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/490H6_720p.flv?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449", "hls_url": "https://www.gdmzzj.com/live/streamer/490H6_720p.m3u8?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/490H6_1080p.flv?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449", "hls_url": "https://www.gdmzzj.com/live/streamer/490H6_1080p.m3u8?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/490H6.flv?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449", "hls_url": "https://www.gdmzzj.com/live/streamer/490H6.m3u8?txSecret=353f65bb0f2a46e0f07e8a3f7e422f91&txTime=20250616175449"}}',
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046089000
  },
  {
    id: 1074,
    siteId: 7,
    sportId: 2,
    eventId: 1040,
    awayName: "圣塞巴斯蒂安学院金雄鹿",
    homeName: "玛布亚学院红雀",
    cover: "",
    isPopular: false,
    eventStartTime: 1750053600000,
    eventEndTime: 1750062600000,
    liveStatus: 1,
    streamId: "3PL4A",
    sort: 1,
    title: "菲季前赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl:
      '{"original": {"hls_url": "https://live1.jiatianxiazhuangshi.com/live/j374ws94jjrfgko_83db5fa5de150035d70d743112fdc52a_nsd.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/3PL4A_540p.flv?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926", "hls_url": "https://www.gdmzzj.com/live/streamer/3PL4A_540p.m3u8?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/3PL4A_720p.flv?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926", "hls_url": "https://www.gdmzzj.com/live/streamer/3PL4A_720p.m3u8?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/3PL4A_1080p.flv?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926", "hls_url": "https://www.gdmzzj.com/live/streamer/3PL4A_1080p.m3u8?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/3PL4A.flv?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926", "hls_url": "https://www.gdmzzj.com/live/streamer/3PL4A.m3u8?txSecret=c2b14ec3463fe4506e4f0f312832833e&txTime=20250616201926"}}',
    supplierPreviewUrl: "/live/cdn/2/7HZOK.jpg",
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750054766000
  },
  {
    id: 1051,
    siteId: 7,
    sportId: 5,
    eventId: 1018,
    awayName: "BOOM Esports",
    homeName: "Ivory",
    cover: "",
    isPopular: false,
    homeNameZh: "Ivory",
    homeNameEn: "Ivory",
    homeIcon: "https://esports-cdn.namitiyu.com/dota/team/FoP00Mz6f5vgwM4vW9pNoy6LtLEP",
    awayNameZh: "BOOM Esports",
    awayNameEn: "BOOM Esports",
    awayIcon: "https://esports-cdn.namitiyu.com/dota/team/945b468a26610d8a4288e49d01f255b5.png",
    eventStartTime: 1750046400000,
    liveStatus: 1,
    streamId: "JIF93",
    sort: 0,
    title: "TI14国际邀请赛预选赛",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl:
      '{"original": {"flv_url": "https://www.gdmzzj.com/live/U6I8M.flv?txSecret=c3de969eac344db322260bdfd70dc5ae&txTime=20250616095830", "hls_url": "https://www.gdmzzj.com/live/U6I8M.m3u8?txSecret=c3de969eac344db322260bdfd70dc5ae&txTime=20250616095830"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/JIF93_540p.flv?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444", "hls_url": "https://www.gdmzzj.com/live/streamer/JIF93_540p.m3u8?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/JIF93_720p.flv?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444", "hls_url": "https://www.gdmzzj.com/live/streamer/JIF93_720p.m3u8?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/JIF93_1080p.flv?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444", "hls_url": "https://www.gdmzzj.com/live/streamer/JIF93_1080p.m3u8?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/JIF93.flv?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444", "hls_url": "https://www.gdmzzj.com/live/streamer/JIF93.m3u8?txSecret=1be20f0877b9764bb1a746f53af40e2f&txTime=20250616175444"}}',
    supplierPreviewUrl: "",
    streamerPreviewUrl: "",
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750046084000
  },
  {
    id: 1050,
    siteId: 7,
    sportId: 1,
    eventId: 1017,
    awayName: "苏里南",
    homeName: "哥斯达黎加",
    cover: "",
    isPopular: false,
    homeNameZh: "哥斯达黎加",
    homeNameEn: "Costa Rica",
    homeIcon: "https://cdn.sportnanoapi.com/football/team/3533f39e923319b3afa4f2d4d388c886.png",
    awayNameZh: "苏里南",
    awayNameEn: "Suriname",
    awayIcon: "https://cdn.sportnanoapi.com/football/team/1036ec09039d9a5d63924ccff6adc2fe.png",
    eventStartTime: 1750042800000,
    liveStatus: 1,
    streamId: "7XDU6",
    sort: 17,
    title: "美金杯",
    isTest: false,
    streamerStatus: 0,
    supplierCdnPullUrl:
      '{"original": {"hls_url": "https://live1.jiatianxiazhuangshi.com/live/59807830_f793b250a1172e0333d7247b30cd6bc5_nsd.m3u8"}}',
    streamerCdnPullUrl:
      '{"540p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7XDU6_540p.flv?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203", "hls_url": "https://www.gdmzzj.com/live/streamer/7XDU6_540p.m3u8?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203"}, "720p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7XDU6_720p.flv?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203", "hls_url": "https://www.gdmzzj.com/live/streamer/7XDU6_720p.m3u8?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203"}, "1080p": {"flv_url": "https://www.gdmzzj.com/live/streamer/7XDU6_1080p.flv?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203", "hls_url": "https://www.gdmzzj.com/live/streamer/7XDU6_1080p.m3u8?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203"}, "original": {"flv_url": "https://www.gdmzzj.com/live/streamer/7XDU6.flv?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203", "hls_url": "https://www.gdmzzj.com/live/streamer/7XDU6.m3u8?txSecret=beb2bc39b2fbc8408d7dec81613e1b89&txTime=20250616171203"}}',
    supplierPreviewUrl: "",
    streamerPreviewUrl: "",
    name: "SYSTEM",
    subscribed: false,
    createTime: 1750043524000
  }
]);

// const model = defineModel({ type: Number });
const model = ref(0);
const emit = defineEmits(["scroll-reach-right"]);

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

// const swiperInstance = ref(null);

// const swiperConfig = computed(() => {
//   const SLIDE_PER_VIEW = 2;
//   return {
//     slidesPerView: SLIDE_PER_VIEW,
//     slidesPerGroup: SLIDE_PER_VIEW,
//     spaceBetween: 20,
//     modules: [Navigation],
//     navigation: list.value.length > SLIDE_PER_VIEW,
//     allowTouchMove: true
//   };
// });

const handleLivestreamClick = (index) => {
  model.value = index;
};

// const handleSwiper = (_swiperInstance) => {
//   swiperInstance.value = _swiperInstance;
// };

const swiperInstance = ref();
const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const onSlideClick = (i) => {
  // set value
  selectedPlatformIndex.value = i;

  // set color

  // set scroll position
  const centeredIndex = i - 2;
  swiperInstance.value.slideTo(centeredIndex);
};

const getDisplayDateTime = (date) => {
  const now = moment();
  const eventDate = moment(date);
  const diffInDays = eventDate.diff(now, "days");

  if (diffInDays === 0) {
    return eventDate.format("今日 HH:mm");
  } else if (diffInDays === 1) {
    return eventDate.format("明日 HH:mm");
  } else {
    return eventDate.format("MM/DD");
  }
};

const currentListItem = computed(() => {
  return list.value[model.value];
});

const selectedTeam = ref("");
const selectTeam = (team) => {
  selectedTeam.value = team;
};

const selectedSpecial = ref("");
const selectSpecial = (special) => {
  selectedSpecial.value = special;
};
const specialList = [
  { id: "1", title: "全场零进球", prize: "18", img: "special-01.png" },
  { id: "2", title: "出现红牌", prize: "28", img: "special-02.png" },
  { id: "3", title: "补时进球", prize: "38", img: "special-03.png" },
  { id: "4", title: "点球得分", prize: "58", img: "special-04.png" },
  { id: "5", title: "梅开二度", prize: "88", img: "special-05.png" },
  { id: "6", title: "帽子戏法", prize: "128", img: "special-06.png" },
  { id: "7", title: "乌龙球", prize: "288", img: "special-07.png" }
];

watch(model, () => {
  if (!swiperInstance.value) return;
  swiperInstance.value.slideTo(model.value, 0);
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
// @import "@/scss/pages/livestream.scss";

.livestream-list-wrapper {
  display: flex;
  gap: 18.87px;
  padding: 0 18px 18px 0;
  align-items: center;
  margin: 0 0;
  // --swiper-navigation-color: #3981ff;

  :deep(.swiper-button-prev) {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -1.67px 3.82px 0px #b1d7ff inset;

    &:after {
      font-size: 12px;
      color: #ffffff;
    }
    &.swiper-button-disabled {
      background: #ffffff;
      opacity: 1;

      &:after {
        color: #333333;
      }
    }
  }

  :deep(.swiper-button-next) {
    right: 28px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -1.67px 3.82px 0px #b1d7ff inset;

    &:after {
      font-size: 12px;
      color: #ffffff;
    }
    &.swiper-button-disabled {
      background: #ffffff;
      opacity: 1;

      &:after {
        color: #333333;
      }
    }
  }

  .livestream-list-item {
    // @include livestream-content-block;
    background-color: #fff;
    border-radius: 18px;
    position: relative;
    padding: 11px 0;
    margin: 18px 0 0;
    cursor: pointer;

    .q-dark & {
      background-color: #304774;
      border: 1px solid transparent;
    }

    &.selected {
      border: 2px solid #468cff;
      background: rgba(0, 161, 255, 0.4);
      &::after {
        display: block;
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #468cff;
      }
    }

    .livestream-list-item__title {
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 21px;
      font-weight: 500;
      text-align: center;
      color: #333333;
    }
    .livestream-list-item__match-info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .livestream-list-item__match-info__team {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        flex-basis: 33%;
        max-width: 33%;
        .livestream-list-item__match-info__team-emblem {
          // @include livestream-team-emblem;
          background-color: #fff;
          border-radius: 18px;
          box-shadow: 0px 3.77px 20.76px 0px #00000026;

          .q-dark & {
            background-color: #17223e;
            box-shadow: 2px 4px 10px 0px #00194b52;
          }

          padding: 7px;
          border-radius: 50%;

          img {
            display: block;
            width: 30px;
            aspect-ratio: 1;
            border-radius: 50%;
          }
        }
        .livestream-list-item__match-info__team-name {
          font-size: 12px;
          line-height: 15px;
          color: #7a80a1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 100%;
        }
      }
    }

    .livestream-list-item__match-info__date {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      .livestream-list-item__match-info__date__on-air {
        // @include livestream-on-air;
      }
      .livestream-list-item__match-info__date__date {
        font-size: 11px;
        line-height: 15px;
        color: #7a80a1;
        margin-top: 12px;
      }
      .livestream-list-item__match-info__date__vs {
        font-size: 16px;
        line-height: 23px;
        color: #333333;
      }
    }

    .livestream-list-item__badge-wrapper {
      position: absolute;
      top: 4px;
      left: 14px;
      transform: translateY(-100%);
      background: linear-gradient(
        259.14deg,
        #ffecce 11.64%,
        #f3cd92 27.82%,
        #fff2ca 52.4%,
        #efd190 72.12%,
        #e4bd80 99.13%
      );
      border: 0.94px solid #d3aa69;
      border-radius: 8px;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;

      .livestream-list-item__badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 7px;
        font-size: 11px;
        line-height: 15px;
        color: #000000;
        img {
          // @include img-pseudo;
          border-radius: 50%;
          width: 22px;
          aspect-ratio: 1;
        }
      }
    }
  }

  .livestream-list__pseudo {
    flex: 0 0 calc(25% - 12.87px);
    height: 100%;
    :deep(.path) {
      stroke: #4c88f8;
    }
  }
}

.q-dark {
  .livestream-list-wrapper {
    // --swiper-navigation-color: #fff;

    :deep(.swiper-button-prev) {
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      box-shadow: 0px 1.57px 1.57px 0px #7488accc inset;
      &:after {
        color: #653b00;
      }
      &.swiper-button-disabled {
        background: #2d3e6a;
        &:after {
          color: #ffffff;
        }
      }
    }

    :deep(.swiper-button-next) {
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      box-shadow: 0px 1.57px 1.57px 0px #7488accc inset;
      &:after {
        color: #653b00;
      }
      &.swiper-button-disabled {
        background: #2d3e6a;
        &:after {
          color: #ffffff;
        }
      }
    }

    .livestream-list-item {
      &.selected {
        background: #be945766;
        background-size: 100% 100%;
        background-clip: border-box;
        border-color: #be9457;
        &::after {
          border-top: 10px solid #be9457;
        }

        .livestream-list-item__match-info__date {
          .livestream-list-item__match-info__date__vs {
            color: #fff;
          }
        }
      }

      .livestream-list-item__match-info__date {
        .livestream-list-item__match-info__date__vs {
          color: #fff;
        }
      }

      .livestream-list-item__title {
        color: #fff;
      }
      .livestream-list-item__match-info {
        .livestream-list-item__match-info__team {
          .livestream-list-item__match-info__team-emblem {
            // @include livestream-team-emblem;
          }
          .livestream-list-item__match-info__team-name {
            color: #fff;
          }
        }
      }

      .livestream-list-item__match-info__date {
        .livestream-list-item__match-info__date__date {
          color: #fff;
        }
      }
    }

    .livestream-list__pseudo {
      :deep(.path) {
        stroke: #fff;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.worldcup-2025-wrapper {
  max-width: 600px;
  margin: auto;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 8px;

  .title-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .col-title {
      background-image: url(../../../assets/images/promo/hotpromo/worldcup-2025/title-ribbon.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      padding: 2px 12px 2px 8px;
      color: #ffffff;
    }
    .col-record {
      color: #00a1ff;
    }
  }

  .toptitle-row {
    display: flex;
    justify-content: space-between;

    .col-desc {
      color: #333333;

      span {
        color: #00a1ff;
      }
    }

    .col-record {
      color: #00a1ff;
    }
  }

  .current-match-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-image: url(../../../assets/images/promo/hotpromo/worldcup-2025/match-mobile-bg.png);
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: cover;
    border-radius: 16px;
    padding: 16px 8px 50px;
    position: relative;

    .match-info {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &--home {
      }
      &--away {
      }

      .info-img {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        box-shadow: 0px 3.77px 20.76px 0px rgba(0, 0, 0, 0.1490196078);
        // padding: 7px;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        img {
          display: block;
          width: 40px;
        }
      }
      .info-txt {
        display: block;
        text-align: center;
        margin-top: 16px;
      }
    }

    .match-home-vs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .vs-title-row {
        display: flex;
        align-items: center;
        line-height: 1;
        gap: 4px;

        .title-icon {
          img {
            display: block;
            width: 28px;
            margin: 0;
          }
        }
        .title-txt {
          color: #333333;
          font-size: 16px;
        }
        .title-status {
          background: #00a1ff;
          border-radius: 24px;
          line-height: 1;
          font-size: 10px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px 8px;

          img {
            display: block;
            width: 16px;
          }
        }
      }
      .vs-time {
        font-size: 14px;
        color: #333333;
      }
      .vs-icon {
        margin-top: 20px;
        img {
          display: block;
          width: 40px;
        }
      }

      .vs-win {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      .vs-notes {
        position: absolute;
        bottom: 10px;
        width: 100%;
        background: linear-gradient(
          90deg,
          rgba(0, 161, 255, 0) 0%,
          rgba(0, 161, 255, 0.2) 50%,
          rgba(0, 161, 255, 0) 100%
        );
        color: #737373;
        font-size: 12px;
        line-height: 1;
        padding: 8px 16px;
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .title-match-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    .col-txt {
      display: flex;
      gap: 6px;
      font-size: 16px;
      color: #333333;
      align-items: center;
      font-weight: bold;
      img {
        display: block;
        width: 32px;
        margin-bottom: 6px;
      }
    }
    .col-record {
      color: #666666;
      span {
        color: #00a1ff;
      }
    }
  }

  .match-btn {
    width: 90px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    background: linear-gradient(180deg, #e7e7e7 0%, #c9c9c9 100%);
    color: #818181;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    margin: 20px auto 20px;

    &.active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      color: white;
    }
  }
}

.tnc-wrapper {
  max-width: 600px;
  margin: auto;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 8px;
  margin-top: 40px;
  .tnc-title {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFang TC;
    font-size: 16px;
    line-height: 1;

    &:before {
      content: "";
      background: url("../../../assets/images/promo/hotpromo/worldcup-2025/title-pattern-left.png");
      background-size: cover;
      background-position: right center;
      width: 80px;
      height: 20px;
      display: block;
      margin-right: 6px;
    }
    &:after {
      content: "";
      background: url("../../../assets/images/promo/hotpromo/worldcup-2025/title-pattern-right.png");
      background-size: cover;
      background-position: left center;
      width: 80px;
      height: 20px;
      display: block;
      margin-left: 6px;
    }
  }

  .tnc-content {
    ol {
      list-style: none;
      counter-reset: item;
      padding: 0 !important;

      li {
        counter-increment: item;
        position: relative;
        padding-left: 24px;
        margin-bottom: 6px !important;

        &::before {
          content: counter(item);
          position: absolute;
          left: 0;
          top: 0;
          width: 16px;
          height: 16px;
          // background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
          // color: #653b00;
          background: linear-gradient(180deg, #70cbfb 0%, #4aa5ff 49%, #4aa5ff 91.5%, #6ec7fd 100%);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }
      }
    }
  }
}

.current-match-bet {
  display: flex;
  gap: 12px;
  margin-top: 20px;

  &.special-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    .bet-select {
      font-size: 14px;
      &.long-select {
        grid-column: span 2;
      }
    }
  }

  .bet-select {
    font-size: 18px;
    width: 100%;
    background: #ffffff;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 4px;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    flex-direction: column;

    img {
      display: block;
      max-width: 80px;
      margin: 12px 0;
    }

    .prize-amt {
      color: #535353;
      font-size: 14px;
      span {
        color: #00a1ff;
        font-size: 20px;
      }
    }

    &.active {
      background: #00a1ff66;
      border-color: #00a1ff;
      &:after {
        content: "";
        width: 24px;
        height: 24px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url(../../../assets/images/promo/hotpromo/worldcup-2025/select-btn-active.svg);
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}

.q-dark {
  .worldcup-2025-wrapper {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
    border: 1px solid #be9457;

    .title-content {
      .col-title {
        background-image: url(../../../assets/images/promo/hotpromo/worldcup-2025/title-ribbon-dark.png);
        color: #ffffff;
      }
      .col-record {
        color: #be9457;
      }
    }

    .toptitle-row {
      .col-desc {
        color: #ffffff;

        span {
          color: #be9457;
        }
      }

      .col-record {
        color: #be9457;
      }
    }

    .current-match-container {
      .match-home-vs {
        .vs-title-row {
          .title-icon {
            img {
              filter: invert(1);
            }
          }
          .title-txt {
            color: #ffffff;
          }
          .title-status {
            background: #be9457;

            img {
              filter: invert(1);
            }
          }
        }
        .vs-time {
          color: #ffffff;
        }
        .vs-icon {
          img {
            filter: invert(1);
          }
        }
        .vs-notes {
          color: #ffffff;
        }
      }
    }

    .title-match-row {
      .col-txt {
        color: #ffffff;
      }
      .col-record {
        color: #ffffff;
        span {
          color: #be9457;
        }
      }
    }

    .match-btn {
      background: linear-gradient(180deg, #cbcbcb 0%, #757575 100%);
      color: #ffffff;
      border: 1px solid #ffffff;

      &.active {
        background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
        color: #653b00;
      }
    }
  }

  .tnc-wrapper {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);

    .tnc-content {
      ol {
        li {
          &::before {
            background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
            color: #653b00;
          }
        }
      }
    }
  }

  .current-match-bet {
    .bet-select {
      background: #304774;

      .prize-amt {
        color: #ffffff;
        span {
          color: #ffdba8;
        }
      }

      &.active {
        background: #be945766;
        border-color: #be9457;
        &:after {
          background-image: url(../../../assets/images/promo/hotpromo/worldcup-2025/select-btn-active-dark.svg);
        }
      }
    }
  }
}

.swiper-container-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .swiper-button-prev,
  .swiper-button-next {
    z-index: 10;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px -2.35px 4.7px 0px #6a7f9e66 inset;
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    color: #ffffff;

    &.swiper-button-disabled {
      background: #f3f3f3;
      color: #94a4be;
      opacity: 1;
    }

    &:after {
      font-size: 10px;
    }
  }

  .swiper-button-prev {
    position: absolute;
    left: -4px;
    top: 60%;
    transform: translateY(-50%);
  }

  .swiper-button-next {
    position: absolute;
    right: -4px;
    top: 60%;
    transform: translateY(-50%);
  }
}

.q-dark {
  .swiper-container-wrapper {
    .swiper-button-prev,
    .swiper-button-next {
      box-shadow: 0px -0.78px 1.57px 0px #3c3c3c inset;
      background: linear-gradient(180deg, #ffe2b9 0%, #be9457 100%);
      color: #653b00;

      &.swiper-button-disabled {
        background: #2d3e6a;
        color: #ffffff;
        opacity: 1;
      }
    }
  }
}
</style>

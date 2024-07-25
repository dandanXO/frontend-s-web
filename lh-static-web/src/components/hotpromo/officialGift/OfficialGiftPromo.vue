<template>
  <div class="official-gift-container">
    <div class="official-gift-block download-block">
      <div class="download-block-left-side">
        <span class="download-block-title">添加雷火电竞指定管理账号，尽享全方位服务优待</span>
        <a :href="paramsObj.voxis_url" target="_blank">
          <button class="download-block-btn">点击进入</button>
        </a>
        <span class="download-block-description">
          请
          <a :href="paramsObj.voxis_url" target="_blank">下载</a>
          “Voxis”立即添加
        </span>
      </div>
      <!-- <div class="download-block-qr-code-wrapper">
        <img src="@/components/hotpromo/officialGift/img/download-qr-code.png" />
        <span>管理员：初夏</span>
      </div> -->
    </div>

    <div class="official-gift-block detail-block">
      <div class="detail-block-title">
        <img src="@/components/hotpromo/officialGift/img/gift.svg" />
        <span>认准雷火电竞官方福利群管理</span>
      </div>
      <div class="detail-block-content">
        <span class="detail-block-content-description">添加以下雷火官方福利群管理：领取彩金、投资计划、赛事推荐</span>
        <div class="detail-block-content-voxis">
          <img src="@/components/hotpromo/officialGift/img/voxis.svg" />
          <span class="detail-block-content-voxis__url">Voxis管理号：{{ paramsObj?.voxis_id }}</span>
          <button class="detail-block-content-voxis__btn" @click="handleCopyClick">复制</button>
        </div>
        <img class="detail-block-content-suffix" src="@/components/hotpromo/officialGift/img/detail-block-suffix.png" />
      </div>
    </div>

    <div class="official-gift-block reason-block">
      <div class="official-gift-block-title">为什么要加入官方福利群</div>
      <div class="reason-block-content">
        <div v-for="(reason, index) in reasons" :key="index" class="reason-block-content-reason">
          <div class="reason-block-content-reason__inner">
            <img :src="reason.icon" />
            <span>{{ reason.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { writeClipboard } from "@/utils/clipboard";

import BeautySvg from "@/components/hotpromo/officialGift/img/beauty.svg";
import Clock24Svg from "@/components/hotpromo/officialGift/img/clock-24.svg";
import QuestionSvg from "@/components/hotpromo/officialGift/img/question.svg";
import StackSvg from "@/components/hotpromo/officialGift/img/stack.svg";
import ClockSvg from "@/components/hotpromo/officialGift/img/clock.svg";
import DateSvg from "@/components/hotpromo/officialGift/img/date.svg";
import GiftLineSvg from "@/components/hotpromo/officialGift/img/gift-line.svg";
import ThumbSvg from "@/components/hotpromo/officialGift/img/thumb.svg";

const props = defineProps({
  params: String
});

const reasons = ref([
  { icon: BeautySvg, description: "美女专属客服1对1优质服务" },
  { icon: Clock24Svg, description: "客服全天7*24小时在线" },
  { icon: QuestionSvg, description: "优先解答您游戏中各种问题" },
  { icon: StackSvg, description: "提供各种优惠活动信息资料" },
  { icon: ClockSvg, description: "每日活动领取提醒专业引导" },
  { icon: DateSvg, description: "各种游戏类型专业投资计划" },
  { icon: ThumbSvg, description: "体育电竞游戏专家赛事推荐" },
  { icon: GiftLineSvg, description: "添加客服成功入群即领彩金" }
]);

const paramsObj = computed(() => {
  try {
    return JSON.parse(props.params);
  } catch (e) {
    return {};
  }
});

const handleCopyClick = () => writeClipboard(paramsObj.value?.voxis_id);
</script>
<style lang="scss" scoped>
.official-gift-container {
  max-width: 1200px;
  margin: 0 auto;
  color: #000;
  > :not(:last-child) {
    margin-bottom: 20px;
  }
}

.official-gift-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0px 0px 4px 0px #01497b0f;

  .official-gift-block-title {
    background: url(@/components/hotpromo/officialGift/img/block-title-bg.png) no-repeat;
    background-size: contain;
    aspect-ratio: 966 / 44;
    margin: 0 auto;
    font-size: 32px;
    font-weight: 400;
    line-height: 44px;
    text-align: center;
    color: #4c4c6c;
  }
}

.detail-block {
  .detail-block-title {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 32px;
    }

    span {
      font-size: 24px;
      font-weight: 600;
      line-height: 33.6px;
    }
  }

  .detail-block-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    padding: 20px;
    background-color: $color-white;
    border-radius: 12px;

    .detail-block-content-description {
      font-size: 16px;
      font-weight: 600;
      line-height: 22.4px;
      color: #00000099;
    }

    .detail-block-content-voxis {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #acd4f6;
      max-width: 720px;
      color: #0092ff;

      img {
        width: 32px;
        margin-right: 12px;
      }

      .detail-block-content-voxis__url {
        flex-grow: 1;
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
      }

      .detail-block-content-voxis__btn {
        background-color: transparent;
        border: 1px solid #0092ff;
        border-radius: 100px;
        padding: 3px 24px;
        &:hover {
          filter: brightness(0.7);
        }
      }
    }

    .detail-block-content-suffix {
      position: absolute;
      width: 272px;
      bottom: 20px;
      right: 48px;
    }
  }
}

.reason-block {
  .official-gift-block-title {
    margin-bottom: 20px;
  }

  .reason-block-content {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
    .reason-block-content-reason {
      border-radius: 10px;
      background-color: $color-white;
      padding: 4px;
      .reason-block-content-reason__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #acd4f6;
        img {
          margin-bottom: 8px;
          margin-top: -20px;
          width: 56px;
        }
        span {
          margin-bottom: 16px;
        }
      }
    }
  }
}

.download-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  background: url(@/components/hotpromo/officialGift/img/download-block-bg.png) no-repeat;
  background-size: cover;

  .download-block-left-side {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;

    .download-block-title {
      font-size: 32px;
      font-weight: 600;
      line-height: 44px;
      color: #0092ff;
    }
    .download-block-btn {
      background: linear-gradient(180deg, #41b9ff -11.36%, #0085e8 111.36%);
      border-radius: 100px;
      padding: 12px 38px;
      font-family: HYYakuHei;
      font-size: 20px;
      font-weight: 700;
      line-height: 20px;
      color: $color-white;
      &:hover {
        filter: brightness(1.2);
      }
    }
    .download-block-description {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #00000099;
      a {
        text-decoration: underline;
      }
    }
  }

  .download-block-qr-code-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: $color-white;
    border: 1px solid #acd4f6;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: #0092ff;
    img {
      width: 120px;
    }
  }
}
</style>

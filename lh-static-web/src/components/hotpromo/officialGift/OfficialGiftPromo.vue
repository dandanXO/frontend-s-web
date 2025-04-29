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
          “Amico”立即添加可申请专属红包
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
        <span>认准雷火电竞官方 VIP 客服管理</span>
      </div>
      <div class="detail-block-content">
        <span class="detail-block-content-description">
          添加以下您的雷火专属 VIP 客服：福利咨询，专属服务，赛事推荐专属红包
        </span>
        <div class="detail-block-content-voxis">
          <img src="@/components/hotpromo/officialGift/img/voxis.svg" />
          <span class="detail-block-content-voxis__url">Amico 客服号：{{ currentVoxisId }}</span>
          <button class="detail-block-content-voxis__btn" @click="handleCopyClick">复制</button>
        </div>
        <img class="detail-block-content-suffix" src="@/components/hotpromo/officialGift/img/detail-block-suffix.png" />
      </div>
    </div>

    <div class="official-gift-block reason-block">
      <div class="official-gift-block-title"></div>
      <!-- <img class="official-gift-block-title" src="./img/web-title.png" /> -->
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
import { userStore } from "@/store";
import { storeToRefs } from "pinia";

const props = defineProps({
  params: String
});

const store = userStore();
const { vip } = storeToRefs(store);

const reasons = ref([
  { icon: BeautySvg, description: "美女专属客服 1 对 1 优质服务" },
  // { icon: Clock24Svg, description: "客服全天 7*24 小时在线" },
  { icon: QuestionSvg, description: "优先解答您游戏中各种问题" },
  { icon: StackSvg, description: "提供各种优惠活动信息资料" },
  { icon: ClockSvg, description: "每日活动领取提醒专业引导" },
  { icon: DateSvg, description: "各种赛事推荐分析" },
  { icon: ThumbSvg, description: "体育电竞游戏专家赛事推荐" }
  // { icon: GiftLineSvg, description: "添加客服成功入群即领彩金" }
]);

const paramsObj = computed(() => {
  try {
    return JSON.parse(props.params);
  } catch (e) {
    return {};
  }
});

const currentVoxisId = computed(() => {
  if (typeof vip.value === "string") {
    const key = `${vip.value.toLocaleLowerCase()}_voxis_id`;
    return paramsObj.value[key] || "";
  } else {
    return paramsObj?.value?.["vip1_voxis_id"] ?? "";
  }
});

const handleCopyClick = () => writeClipboard(currentVoxisId.value);
</script>
<style lang="scss" scoped>
.dark {
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
      max-width: 966px;
      margin: 0 auto;
      background: url("./img/web-title-dark.png") no-repeat;
      background-size: contain;
      height: 44px;
      width: 100%;
      // background: url(@/components/hotpromo/officialGift/img/block-title-bg.png) no-repeat;
      // background-size: contain;
      // aspect-ratio: 966 / 44;
      // margin: 0 auto;
      // font-size: 32px;
      // font-weight: 400;
      // line-height: 44px;
      // text-align: center;
      // color: #4c4c6c;
    }
  }

  .detail-block {
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);

    .detail-block-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;

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
      background: #212b4ae0;
      border-radius: 12px;

      .detail-block-content-description {
        font-size: 16px;
        font-weight: 600;
        line-height: 22.4px;
        color: #ffffff99;
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
          color: #0092ff;
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
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);

    .official-gift-block-title {
      margin-bottom: 20px;
    }

    .reason-block-content {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(3, 1fr);
      .reason-block-content-reason {
        border-radius: 10px;
        background-color: #212b4ae0;
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
            color: #ffffff;
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
    background: linear-gradient(178.46deg, #2d4065 2.36%, rgba(45, 64, 101, 0.4) 98.7%);
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
        color: #ffffff99;
        a {
          text-decoration: underline;
          color: #0092ff;
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
}
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
    max-width: 966px;
    margin: 0 auto;
    max-width: 966px;
    margin: 0 auto;
    background: url("./img/web-title.png") no-repeat;
    background-size: contain;
    height: 44px;
    width: 100%;
    // background: url(@/components/hotpromo/officialGift/img/block-title-bg.png) no-repeat;
    // background-size: contain;
    // aspect-ratio: 966 / 44;
    // margin: 0 auto;
    // font-size: 32px;
    // font-weight: 400;
    // line-height: 44px;
    // text-align: center;
    // color: #4c4c6c;
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
    grid-template-columns: repeat(3, 1fr);
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

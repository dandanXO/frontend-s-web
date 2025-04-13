<template>
  <div class="official-gift-container">
    <div class="official-gift-block download-block">
      <div class="download-block-left-side">
        <span class="download-block-title">添加东赢电竞指定管理账号，尽享全方位服务优待</span>
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
        <img src="./img/download-qr-code.png" />
        <span>管理员：初夏</span>
      </div> -->
    </div>
    <div class="official-gift-block detail-block">
      <div class="detail-block-title">
        <img src="./img/gift.svg" />
        <span>认准东赢电竞官方 VIP 客服管理</span>
      </div>
      <div class="detail-block-content">
        <span class="detail-block-content-description">
          添加以下您的东赢专属 VIP 客服：福利咨询，专属服务，赛事推荐专属红包
        </span>
        <div class="detail-block-content-voxis">
          <img src="./img/voxis.svg" />
          <span class="detail-block-content-voxis__url">Amico 客服号：{{ currentVoxisId }}</span>
          <button class="detail-block-content-voxis__btn" @click="handleCopyClick">复制</button>
        </div>
      </div>
    </div>

    <div class="official-gift-block reason-block">
      <div class="official-gift-block-title"></div>
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
import { writeClipboard } from "boot/utils";
import { Platform } from "quasar";
import BeautySvg from "./img/beauty.svg";
import Clock24Svg from "./img/clock-24.svg";
import QuestionSvg from "./img/question.svg";
import StackSvg from "./img/stack.svg";
import ClockSvg from "./img/clock.svg";
import DateSvg from "./img/date.svg";
import GiftLineSvg from "./img/gift-line.svg";
import ThumbSvg from "./img/thumb.svg";
import { useNotify } from "src/hooks/notify";
import { userStore } from "src/stores";
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
    return paramsObj?.value?.[key] ?? paramsObj?.value?.["vip1_voxis_id"] ?? "";
  } else {
    return paramsObj?.value?.["vip1_voxis_id"] ?? "";
  }
});

function isHuaweiBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("huawei") || userAgent.includes("honor");
}

const handleCopyClick = async () => {
  if (window.location.pathname === "/promotion") {
    const textToCopy = currentVoxisId.value;
    // alert(textToCopy);

    const notify = useNotify();
    if (isHuaweiBrowser()) {
      writeClipboard(currentVoxisId.value);
    } else if (navigator.clipboard && window.isSecureContext && Platform.is.chrome) {
      await navigator.clipboard.writeText(textToCopy);

      setTimeout(() => {
        notify({
          type: "success",
          message: "复制成功"
        });
      }, 100);
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (error) {
        console.error(error);
      } finally {
        document.body.removeChild(textArea);
      }

      setTimeout(() => {
        notify({
          type: "success",
          message: "复制成功"
        });
      }, 100);
    }
  } else {
    writeClipboard(currentVoxisId.value);
  }
};
</script>
<style lang="scss" scoped>
.body--dark {
  .official-gift-container {
    max-width: 1200px;
    margin: 0 auto;
    color: #000;
    img {
      margin-bottom: 0 !important;
    }
    > :not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .official-gift-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #2d4065;
    box-shadow: 0px 0px 4px 0px #01497b0f;
    padding: 12px;
    border: 1px solid #f2f8fe;
    border-radius: 12px;

    .official-gift-block-title {
      background: url(./img/h5-title-dark.png) no-repeat;
      background-size: contain;
      aspect-ratio: 337 / 20;
      margin: 0 auto;
      font-size: 1.2rem;
      font-weight: 400;
      line-height: 1.45rem;
      text-align: center;
      color: #4c4c6c;
      height: 20px;
      width: 100%;
      margin: 0 auto;
      background-position: center;
    }
  }

  .detail-block {
    gap: 8px;
    .detail-block-title {
      display: flex;
      align-items: center;
      gap: 4px;

      img {
        max-width: 1.2rem;
      }

      span {
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.3rem;
        color: white;
      }
    }

    .detail-block-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      padding: 12px;
      background-color: #212b4ae0;
      border-radius: 12px;

      .detail-block-content-description {
        font-size: 0.7rem;
        font-weight: 600;
        line-height: 1.07rem;
        color: #ffffff99;
      }

      .detail-block-content-voxis {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 12px;
        border: none;
        max-width: 720px;
        color: #0092ff;

        img {
          max-width: 1.5rem;
          margin-right: 4px;
        }

        .detail-block-content-voxis__url {
          flex-grow: 1;
          font-size: 1.07rem;
          font-weight: 600;
          line-height: 1.5rem;
        }

        .detail-block-content-voxis__btn {
          background-color: transparent;
          border: 1px solid #0092ff;
          border-radius: 100px;
          padding: 1px 18px;
          font-size: 0.9rem;
          line-height: 1.3rem;
          color: #0092ff;
          &:hover {
            filter: brightness(0.7);
          }
        }
      }
    }
  }

  .reason-block {
    .reason-block-content {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(2, 1fr);
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
            margin-bottom: 4px !important;
            margin-top: -10px;
            max-width: 2.5rem;
          }
          span {
            font-size: 0.9rem;
            font-weight: 400;
            line-height: 1.3rem;
            margin-bottom: 10px;
            color: white;
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
    padding: 20px;

    .download-block-left-side {
      // flex-basis: 70%;
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 20px;

      .download-block-title {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.7rem;
        color: #0092ff;
      }
      .download-block-btn {
        background: linear-gradient(180deg, #41b9ff -11.36%, #0085e8 111.36%);
        border-radius: 100px;
        padding: 6px 16px;
        border: none;
        font-family: HYYakuHei;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.3rem;
        color: #fff;
        &:hover {
          filter: brightness(1.2);
        }
      }
      .download-block-description {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1rem;
        color: #ffffff99;
        a {
          color: #0092ff;
          text-decoration: underline;
        }
      }
    }

    .download-block-qr-code-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #acd4f6;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1rem;
      color: #0092ff;
      img {
        max-width: 5.5rem;
      }
    }
  }

  @media (max-width: 370px) {
    .official-gift-block {
      .official-gift-block-title {
        line-height: 1.5rem;
      }
    }

    .reason-block {
      .reason-block-content {
        grid-template-columns: 1fr;
      }
    }
  }
}
.official-gift-container {
  max-width: 1200px;
  margin: 0 auto;
  color: #000;
  img {
    margin-bottom: 0 !important;
  }
  > :not(:last-child) {
    margin-bottom: 12px;
  }
}

.official-gift-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f2f8fe;
  box-shadow: 0px 0px 4px 0px #01497b0f;
  padding: 12px;
  border: 1px solid #f2f8fe;
  border-radius: 12px;

  .official-gift-block-title {
    background: url(./img/h5-title.png) no-repeat;
    background-size: contain;
    aspect-ratio: 337 / 20;
    margin: 0 auto;
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.45rem;
    text-align: center;
    color: #4c4c6c;
    height: 20px;
    width: 100%;
    margin: 0 auto;
    background-position: center;
  }
}

.detail-block {
  gap: 8px;
  .detail-block-title {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      max-width: 1.2rem;
    }

    span {
      font-size: 0.9rem;
      font-weight: 600;
      line-height: 1.3rem;
    }
  }

  .detail-block-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    padding: 12px;
    background-color: #fff;
    border-radius: 12px;

    .detail-block-content-description {
      font-size: 0.7rem;
      font-weight: 600;
      line-height: 1.07rem;
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
        max-width: 1.5rem;
        margin-right: 4px;
      }

      .detail-block-content-voxis__url {
        flex-grow: 1;
        font-size: 1.07rem;
        font-weight: 600;
        line-height: 1.5rem;
      }

      .detail-block-content-voxis__btn {
        background-color: transparent;
        border: 1px solid #0092ff;
        border-radius: 100px;
        padding: 1px 18px;
        font-size: 0.9rem;
        line-height: 1.3rem;
        color: #0092ff;
        &:hover {
          filter: brightness(0.7);
        }
      }
    }
  }
}

.reason-block {
  .reason-block-content {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    .reason-block-content-reason {
      border-radius: 10px;
      background-color: #fff;
      padding: 4px;
      .reason-block-content-reason__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #acd4f6;
        img {
          margin-bottom: 4px !important;
          margin-top: -10px;
          max-width: 2.5rem;
        }
        span {
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1.3rem;
          margin-bottom: 10px;
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
  padding: 20px;

  .download-block-left-side {
    // flex-basis: 70%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;

    .download-block-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.7rem;
      color: #0092ff;
    }
    .download-block-btn {
      background: linear-gradient(180deg, #41b9ff -11.36%, #0085e8 111.36%);
      border-radius: 100px;
      padding: 6px 16px;
      border: none;
      font-family: HYYakuHei;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.3rem;
      color: #fff;
      &:hover {
        filter: brightness(1.2);
      }
    }
    .download-block-description {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1rem;
      color: #00000099;
      a {
        color: #0092ff;
        text-decoration: underline;
      }
    }
  }

  .download-block-qr-code-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #acd4f6;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1rem;
    color: #0092ff;
    img {
      max-width: 5.5rem;
    }
  }
}

@media (max-width: 370px) {
  .official-gift-block {
    .official-gift-block-title {
      line-height: 1.5rem;
    }
  }

  .reason-block {
    .reason-block-content {
      grid-template-columns: 1fr;
    }
  }
}
</style>

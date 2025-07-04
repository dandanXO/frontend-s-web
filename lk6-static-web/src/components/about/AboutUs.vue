<template>
  <div class="top-container">
    <b style="color: #424F72">雷火宗旨</b>
    – 提供给顾客最佳水位和最优秀的服务；
    <ul>
      <li style="color: #A4AABB">我们的优势：雷火网站，盘口赔率即时开出，您不需等待交易买卖。</li>
      <li style="color: #A4AABB">资金流动更具快捷性，让您随时随地自由分配您的资金以便投注更大金额，与此同时，享受最佳水位！</li>
    </ul>
  </div>
  <div class="bot-container">
    <div class="content">
      <img
        :src="require(`../../assets/about/aboutus/more${isDark ? '' : ''}.png`)"
        style="width: 33.87px; height: 34px"
      />
      <div class="title">更多产品</div>
      <div class="desc">“雷火是业界公认的滚球专家，每月平均提供约 10,000 场现场滚球赛事。”</div>
      <div class="info">
        并提供超过 400 个不同联赛的足球赛事。除了常见的职业联赛外，还提供以下联赛：
        希甲/意大利C联赛杯/波甲/俄甲/克罗地亚杯/保加
        利亚杯/挪威杯/德甲/罗乙/丹麦甲/法国乙/泰国国王杯/赛浦路斯杯/巴西B联赛/日本甲/韩国甲/阿根廷甲 ... ...
        还有更多赛事供您选择！
        如您发现我们有遗漏掉任何赛事或您对雷火网站有何意见或建议，请立即告知我们，以便我们不断完善。
      </div>
    </div>
    <div class="content">
      <img
        :src="require(`../../assets/about/aboutus/planet${isDark ? '' : ''}.png`)"
        style="width: 33.87px; height: 34px"
      />
      <div class="title">多样产品</div>
      <div class="desc">“雷火是业界公认的滚球专家，每月平均提供约 10,000 场现场滚球赛事。”</div>
      <div class="info">
        雷火除了为您提供体育赛事选择，为您提供的真人荷官电子竞技游戏及娱乐场也是无可挑剔的。为了满足来自于世界各地的会员，雷火
        精心挑选各种线上游戏，给您提供最好的游戏和平台选择。
        我们不断完善我们的产品并增加更多精彩刺激的新产品，让您享受一流的在 线娱乐。
      </div>
    </div>
    <div class="content">
      <img
        :src="require(`../../assets/about/aboutus/house${isDark ? '' : ''}.png`)"
        style="width: 34px; height: 34px"
      />
      <div class="title">公司资料</div>
      <div class="desc">“雷火是业界公认的滚球专家，每月平均提供约 10,000 场现场滚球赛事。”</div>
      <div class="info">
        雷火持有菲律宾 NorthCagayan (NCGAC) 博彩合法执照，总部位于菲律宾 Makati
        金融中心。目前我们拥有全球博彩行业的精英，超
        专业的技术和客服团队。希望可以通过提供优秀的产品和优质的客户服务来给客户带来最佳的在线娱乐体验。并提供比陆地赌场更高的
        赔率！为了确保游戏的公平性，在选择平台方面，雷火专业的客服团队每天为您提供 24/7 小时的热情服务；雄厚的资金和正规的财务团
        队，为您提供最快的取款体验。我们采用了目前最好的加密技术和防火墙系统保护您的安全、信息隐私，并保证您享受公平，公正的游
        戏。由于采用了企业级别的加密科技（1024 位 RSA 密钥交 换和
        448 位 blowfish），我们可以为您的数据提供比一般的商业级别的 SSL
        更高的保护。这一科技目前被世界上主要的金融机构所采用。
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<style scoped lang="scss">
.top-container {
  font-family: Microsoft YaHei;
  font-size: 18px;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;

  ul {
    margin-block-start: 0;
    padding-inline-start: 20px;
  }
}

.bot-container {
  display: flex;
  gap: 10px;

  .content {
    width: 33.33%;
    border-radius: 0.9375rem;
    background: #F3F8FF;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 10px;
    height: 1000px;
    position: relative;
    overflow: hidden;

    .title {
      color: #4c88f8;
      font-family: Microsoft YaHei;
      font-size: 12px;
      font-weight: 700;
      line-height: 27px;
      letter-spacing: 0.05em;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(270deg, #3080F4 0%, #70B1FF 100%);
      color: white;
      border-radius: 0px 0px 20px 0;
      width: 80px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .desc {
      color: black;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: 700;
      line-height: 27px;
      letter-spacing: 0.05em;
      text-align: center;
    }

    .info {
      color: #A4AABB;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: 400;
      line-height: 31px;
      letter-spacing: 0em;
      text-align: center;
    }

    img {
      margin-bottom: 20px;
    }
  }
}

.dark {
  .bot-container {
    .content {
      background: url(@/assets/about/aboutus/bg-dark.png) no-repeat;
      background-size: cover;

      .title,
      .desc {
        color: $color-white;
      }

      .info {
        color: inherit;
      }
    }
  }
}
</style>

<template>
  <div class="vip-upgrade-container">
    <div class="vip-upgrade-wrapper">
      <HotPromotionNav :label="'晋升有礼'"></HotPromotionNav>

      <div class="title">晋升有礼</div>
      <div class="desc-wrapper">
        <div class="desc">活动时间:长期活动</div>
        <div class="desc">活动对象:全体会员</div>
        <div class="desc">
          活动内容:限12月01日起注册的新会员，在注册日的两天内成功晋级后，可申请豪华晋级体验礼金一 倍流水即可提款。
        </div>
      </div>

      <table class="record-table">
        <thead>
          <tr>
            <th style="width: 33.3333%">注单尾数</th>
            <th style="width: 33.3333%">可获礼金（注单有效投注倍数）</th>
            <th style="width: 33.3333%">礼金上限</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="2">VIP0</td>
            <td>注册日两天内晋级VIP1</td>
            <td>8</td>
          </tr>
          <tr>
            <td>注册日两天内晋级VIP2</td>
            <td>58</td>
          </tr>
        </tbody>
      </table>

      <div class="btn-wrapper">
        <el-button size="medium" class="retrieve-btn" @click="retrieve()">立即领取</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import HotPromotionNav from "@/components/HotPromotionNav.vue";

const retrieve = () => {};

onMounted(() => {});
</script>

<style scoped lang="scss">
.vip-upgrade-container {
  font-size: 14px;
  color: #596281;
  line-height: 26px;

  .vip-upgrade-wrapper {
    width: 1075px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;

    .title {
      font-size: 2rem;
      color: #3f8cff;
      font-weight: bold;
      margin-left: 10px;
      text-align: center;
    }

    .desc-wrapper {
      .desc {
        color: #7a8eb9;
        font-family: PingFang SC;
        font-size: 1rem;
        font-weight: 400;
        line-height: normal;
      }
    }

    .record-table {
      width: 100%;
      text-align: center;
      border-collapse: collapse;

      thead {
        background: #e7f3ff;
      }

      th,
      td {
        padding: 10px 0;
      }

      tbody {
        tr {
          border-collapse: collapse;
          td {
            border: 1px solid #ecedf0;
          }
        }
      }
    }

    .btn-wrapper {
      margin: 0 auto;

      .retrieve-btn {
        padding: 20px 40px;
        border-radius: 6.25rem;
        background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
        box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
      }
    }
  }
}
</style>

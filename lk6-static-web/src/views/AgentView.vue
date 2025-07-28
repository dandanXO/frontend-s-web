<template>
  <div class="affiliate-container">
    <img class="banner" src="@/assets/images/affiliate/banner.jpg" />
    <div class="contact-container">
      <div class="contact-cards">
        <div class="contact-card">
          <img src="@/assets/images/affiliate/contact-1.png" />
          <div class="contact-card-right">
            <div>Telegram代理</div>
            <div class="contact-tag">@xy66vip</div>
          </div>
        </div>
        <div class="contact-card">
          <img src="@/assets/images/affiliate/contact-2.png" />
          <div class="contact-card-right">
            <div>Telegram客服</div>
            <div class="contact-tag">@xy6vip</div>
          </div>
        </div>
      </div>

      <div>
        <el-button class="login-btn contact-btn">登陆</el-button>
        <el-button class="join-us-btn contact-btn">加入我们</el-button>
      </div>
    </div>

    <div class="section-container">
      <div class="section-title">
        <img src="@/assets/images/affiliate/title-type-1.png" />
      </div>
      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        不占成代理模式 幸运6提供丰厚的流水返佣 无需担心客户输赢，固定盈利，百分比赚钱！
      </div>
      <table class="section-table">
        <thead>
          <tr>
            <th>活跃用户</th>
            <th>周打码量</th>
            <th>返佣比例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>5+</td>
            <td>10000+</td>
            <td>0.3%</td>
          </tr>
          <tr>
            <td>5+</td>
            <td>100万+</td>
            <td>0.4%</td>
          </tr>
          <tr>
            <td>5+</td>
            <td>2000万+</td>
            <td>0.5%</td>
          </tr>
        </tbody>
      </table>
      <div class="hint-txt">例：线下会员本周共有有效打码量1600000x0.4%=6400U即可获得6400U的佣金。</div>
      <div>
        <span>返佣比例可能根据月度调动</span>
        <br />
        <span>返佣要求每月需达到5个活跃用户要求，未达标不能领取返佣</span>
        <br />
        <span>活跃用户标准：每周充值1000或者有效投注达到1000。</span>
        <br />
        <span>
          其他具体规则和条款需要通过合营专线Telegram代理专员：
          <span class="hint-txt">@xy66vip</span>
          确认。
        </span>
      </div>
    </div>
    <div class="section-container">
      <div class="section-title">
        <img src="@/assets/images/affiliate/title-type-2.png" />
      </div>
      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        占成代理模式   最高可占9成
      </div>
      <div>
        <span>
          授信额度，按占成比例交付公司，由代理自己给会员上下分。可以自己提供域名或者由公司提供独立的代理域名。占成代理反水输赢统一由代理商自己结算，本公司按码量0.8%占成比去结算。
        </span>
        <span>
          其他具体规则和条款需要通过合营专线Telegram代理专员：
          <span class="hint-txt">@xy66vip</span>
          确认。
        </span>
      </div>
    </div>
    <div class="section-container">
      <div class="section-title">
        <img src="@/assets/images/affiliate/title-type-3.png" />
      </div>
      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        三级代理模式
      </div>
      <div>
        <span>
          代理佣金结算，周结。会员打码的0.3%，直属代理（包含会员和代理）总打码的0.15%，直属代理的下线（包含会员和代理）总打码0.05%
        </span>
        <br />
        <br />
        <span>
          举例：直属会员打码本周打码100万，直属代理300万，直属代理的代理200万。您的佣金计算：会员，100wX0.3%=3000，直属代理，300WX0.15%=4500，直属代理的下线，200wX0.05%=1000，总记8500U。
        </span>
        <br />
        <br />
        <span>
          其他具体规则和条款需要通过合营专线Telegram代理专员：
          <span class="hint-txt">@xy66vip</span>
          确认。
        </span>
      </div>
    </div>
    <div class="footer-txt">以上3种模式只可三选一，添加Telegram代理专员：@xy66vip了解更多详情！</div>
  </div>
</template>
<script setup></script>

<style scoped lang="scss">
.banner {
  width: 100%;
}
.contact-container {
  margin: 10px auto 20px;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .contact-cards {
    display: flex;
  }
  .contact-card {
    background: linear-gradient(180deg, #aed9ff 0%, #6dbaff 100%);
    border: 2.65px solid #acd4f6;
    border-radius: 10px;
    display: flex;
    width: fit-content;
    padding: 10px 3vw;
    color: #425583;
    font-weight: 600;
    margin-right: 20px;
    > img {
      width: auto;
      height: 50px;
      margin-right: 10px;
    }
    .contact-card-right {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      .contact-tag {
        background: linear-gradient(180deg, #edf5fd 0%, #c5e3ff 100%);
        color: #227dce;
        font-size: 13px;
        border-radius: 20px;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }
    }
  }
  .login-btn {
    background: url(../assets/images/affiliate/btn-bg-2.png);
    color: #3f4f75;
  }
  .join-us-btn {
    background: url(../assets/images/affiliate/btn-bg.png);
    color: #fff;
  }
  .contact-btn {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: none;
    height: 50px;
    width: 150px;
    padding-bottom: 10px;
    font-weight: 600;
  }
}

.section-container {
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 25px;
  margin: 0 auto;
  max-width: 1200px;
  margin-bottom: 20px;
  .section-title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    > img {
      width: 25%;
      min-width: 200px;
    }
  }
  .section-subtitle {
    display: flex;
    color: #5c99ff;
    align-items: center;
    font-weight: 600;
    margin-bottom: 25px;
    > img {
      width: 65px;
    }
  }

  .section-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    thead {
      background: linear-gradient(180deg, #4b91f5 0%, #c4ddff 100%),
        radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
      color: #fff;

      th {
        padding: 10px 20px;
      }
      th:first-child {
        border-top-left-radius: 8px;
      }
      th:last-child {
        border-top-right-radius: 8px;
      }
    }
    tbody {
      td {
        padding: 10px;
        border: 1px solid #acd4f6;
        text-align: center;
      }
    }
  }

  .hint-txt {
    color: #ff0000;
  }
}

.footer-txt {
  display: flex;
  justify-content: center;
  color: #5c99ff;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>

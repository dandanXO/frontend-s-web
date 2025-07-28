<template>
  <div class="affiliate-container">
    <img class="banner" src="@/assets/images/affiliate/banner.jpg" />
    <div class="contact-container">
      <div class="contact-cards">
        <div class="contact-card">
          <img src="@/assets/images/affiliate/contact-1.png" />
          <div class="contact-card-right">
            <div>{{ $t("agent.telegramAgent") }}</div>
            <div class="contact-tag">@xy66vip</div>
          </div>
        </div>
        <div class="contact-card">
          <img src="@/assets/images/affiliate/contact-2.png" />
          <div class="contact-card-right">
            <div>{{ $t("agent.telegramCs") }}</div>
            <div class="contact-tag">@xy6vip</div>
          </div>
        </div>
      </div>

      <div>
        <el-button class="login-btn contact-btn">{{ $t("agent.login") }}</el-button>
        <el-button class="join-us-btn contact-btn">{{ $t("agent.joinUs") }}</el-button>
      </div>
    </div>

    <div class="section-container">
      <div class="section-title">
        <div class="title">
          {{ $t("agent.sectionTitle1") }}
        </div>
      </div>

      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        {{ $t("agent.sectionSubtitle1") }}
      </div>
      <table class="section-table">
        <thead>
          <tr>
            <th>{{ $t("agent.tableHeader1") }}</th>
            <th>{{ $t("agent.tableHeader2") }}</th>
            <th>{{ $t("agent.tableHeader3") }}</th>
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
            <td>{{ $t("agent.oneMillionPlus") }}</td>
            <td>0.4%</td>
          </tr>
          <tr>
            <td>5+</td>
            <td>{{ $t("agent.twentyMillionPlus") }}</td>
            <td>0.5%</td>
          </tr>
        </tbody>
      </table>
      <div class="hint-txt">{{ $t("agent.section1_info1") }}</div>
      <div>
        <span>{{ $t("agent.section1_info2") }}</span>
        <br />
        <span>{{ $t("agent.section1_info3") }}</span>
        <br />
        <span>{{ $t("agent.section1_info4") }}</span>
        <br />
        <span>
          {{ $t("agent.section1_info5") }}
          <span class="hint-txt">@xy66vip</span>
          {{ $t("agent.section1_info6") }}
        </span>
      </div>
    </div>
    <div class="section-container">
      <div class="section-title">
        <div class="title">
          {{ $t("agent.sectionTitle2") }}
        </div>
      </div>
      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        {{ $t("agent.sectionSubtitle2") }}
      </div>
      <div>
        <span>
          {{ $t("agent.section2_info1") }}
        </span>
        <br />
        <span>
          {{ $t("agent.section2_info2") }}
          <span class="hint-txt">@xy66vip</span>
          {{ $t("agent.section2_info3") }}
        </span>
      </div>
    </div>
    <div class="section-container">
      <div class="section-title">
        <div class="title">
          {{ $t("agent.sectionTitle3") }}
        </div>
      </div>
      <div class="section-subtitle">
        <img src="@/assets/images/affiliate/section-icon.png" />
        {{ $t("agent.sectionSubtitle3") }}
      </div>
      <div>
        <span>
          {{ $t("agent.section3_info1") }}
        </span>
        <br />
        <br />
        <span>
          {{ $t("agent.section3_info2") }}
        </span>
        <br />
        <br />
        <span>
          {{ $t("agent.section3_info3") }}
          <span class="hint-txt">@xy66vip</span>
          {{ $t("agent.section3_info4") }}
        </span>
      </div>
    </div>
    <div class="footer">
      <img src="@/assets/images/affiliate/footer-icon.png" />
      <div class="footer-txt">{{ $t("agent.footer") }}</div>
    </div>
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
    background-image: url(../assets/images/affiliate/btn-bg-2.png);
    color: #3f4f75;
  }
  .join-us-btn {
    background-image: url(../assets/images/affiliate/btn-bg.png);
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
    align-items: center;
    justify-content: center;
  }
  .title {
    background-image: url(../assets/images/affiliate/title-bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    color: #fff;
    height: 100px;
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
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

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  > img {
    width: 40px;
    margin-right: 10px;
  }
  .footer-txt {
    color: #5c99ff;
    font-weight: 600;
  }
}
</style>

<template>
  <div class="affiliate-page">
    <div class="affiliate-container">
      <img class="banner" :src="require(`../assets/images/affiliate/banner_${languageVal}.png`)" />
      <div class="contact-container">
        <div class="contact-cards">
          <div class="contact-card">
            <img src="../assets/images/affiliate/contact-1.png" />
            <div class="contact-card-right">
              <div>{{ $t("agent.telegramAgent") }}</div>
              <div class="contact-tag" @click="writeClipboard('@xy66vip')">@xy66vip</div>
            </div>
          </div>
          <div class="contact-card">
            <img src="../assets/images/affiliate/contact-2.png" />
            <div class="contact-card-right">
              <div>{{ $t("agent.telegramCs") }}</div>
              <div class="contact-tag" @click="writeClipboard('@xy6vip')">@xy6vip</div>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-btn-group">
        <el-button class="login-btn contact-btn" @click="onClickLogin">{{ $t("agent.login") }}</el-button>
        <el-button class="join-us-btn contact-btn" @click="onClickLogin">{{ $t("agent.joinUs") }}</el-button>
      </div>

      <div class="section-container">
        <div class="section-title">
          <div class="title">
            {{ $t("agent.sectionTitle1") }}
          </div>
        </div>

        <div class="section-subtitle">
          <img src="../assets/images/affiliate/section-icon.png" />
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
          <img src="../assets/images/affiliate/section-icon.png" />
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
          <img src="../assets/images/affiliate/section-icon.png" />
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
        <img src="../assets/images/affiliate/footer-icon.png" />
        <div class="footer-txt">
          {{ $t("agent.footer") }}
          <span style="text-decoration: underline">@xy66vip</span>
          {{ $t("agent.footer2") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { writeClipboard } from "src/boot/utils";
import { i18nStore } from "src/router/language";
import { ref } from "vue";
const affiliateUrl = ref("https://6666vip.cc/lk6/");
const affCode = sessionStorage.getItem("AFFILIATE_CODE");
const lang = localStorage.getItem("languageLocale") || "zh";

const { languageVal } = storeToRefs(i18nStore());

const onClickLogin = () => {
  window.location.href = affiliateUrl.value + "login?agent=" + (affCode ? affCode : "");
};
</script>

<style scoped lang="scss">
.affiliate-page {
  background-image: url(../assets/images/affiliate/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
.affiliate-container {
  margin: 0 auto;
  max-width: 450px;
  width: 90%;
}
.banner {
  width: 100%;
}
.contact-container {
  margin: 10px auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .contact-cards {
    display: flex;
    width: 100%;
  }
  .contact-card:first-child {
    margin-right: 10px;
  }
  .contact-card {
    background: linear-gradient(180deg, #ecf6ff 0%, #feffff 100%);
    // border: 1px solid;
    // border-image-source: linear-gradient(180deg, #a5d2fe 0%, #d6ecff 46.15%, #a3d2ff 100%);
    border: 1px solid #acd4f6;
    border-radius: 10px;
    display: flex;
    width: 100%;
    padding: 10px 20px;
    color: #425583;
    font-weight: 600;
    align-items: center;

    > img {
      width: auto;
      height: 50px;
      margin-right: 10px;
      @media (max-width: 420px) {
        width: auto;
        height: 35px;
      }
      @media (max-width: 380px) {
        width: auto;
        height: 20px;
      }
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
}

.contact-btn-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  .login-btn {
    background-image: url(../assets/images/affiliate/btn-bg-2.png);
    color: #3f4f75;
  }
  .join-us-btn {
    background-image: url(../assets/images/affiliate/btn-bg.png);
    color: #fff;
  }
  .contact-btn {
    display: flex;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: none;
    height: 50px;
    width: 150px;
    font-weight: 600;
    background-color: transparent;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
    cursor: pointer;
  }
}

.section-container {
  background-color: #f2f8fe;
  border: 1px solid #acd4f6;
  border-radius: 12px;
  padding: 10px 25px 20px;
  margin-bottom: 20px;
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    font-family: Microsoft YaHei;
    background-image: url(../assets/images/affiliate/title-bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    color: #fff;
    height: 75px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-text-stroke: 1px #4b91f5;
    font-weight: bolder;
    font-size: 1.2rem;
    background-position: center;
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
  padding-bottom: 16px;
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

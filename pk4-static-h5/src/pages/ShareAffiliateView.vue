<template>
  <ProfileSummary :homeProfile="true" /> 
  <div class="share-affiliate">
    <div class="top-box">
      <div class="login-btn" @click="directToLink()">
        Login
      </div>
    </div>
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <th colspan="2">Second-level agent-dividend system</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            Agent Type
          </td>
          <td>
            Merchants Monthly Dividend Model (Cumulative)
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import ProfileSummary from "../components/ProfileSummary.vue";
  const directToLink = () => {
    window.open("https://pak-affiliate-web.psna-staging.com/pak/login", "_blank");
  }
</script>
<style scoped lang="scss">
.share-affiliate {
  background: url(../assets/images/share/share-bg.png)no-repeat center center;
  min-height: 400px;
  background-size: cover;
  .top-box {
    // background: url(../assets/images/share/share-box.png)no-repeat center center;
    // // background-size: contain;
    // // width: 95%;
    // // height: 400px;
    // // margin-top: 80px;
    // background-size: contain;
    // // height: 420px;
    // // padding-top: 80px;
    // padding-top: 140px;
    // display: block;
    padding: 125px 0;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      background: url(../assets/images/share/share-btn.png)no-repeat center center;
      background-size: contain;
      padding: 10px;
      text-align: center;
      font-size: 20px;
      width: 50%;
      border-radius: 3px;
      font-weight: 700;
      color: #5F3000;

    }
  }
  .table-box {
    width: 95%;
    margin: 0 auto;
   thead {
    tr {
      th {
        background: linear-gradient(180deg, #EFE6CB 0%, #F9A427 100%);
        border-radius: 10px 10px 0 0;
        padding: 10px;
      }
    }
    tbody {
      tr {
        background: #121829;
      }
    }

   } 
  }
}
</style>
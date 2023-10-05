<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Security Verified</span>
    </div>
    <div>
      <div class="flex-box flex-align-center security-wrapper">
        <div class="security-name">Phone</div>
        <input class="form-input" :value="personalState.memberInfo.telephone" />
        <button class="security-btn verified">Verified</button>
      </div>
      <div class="flex-box flex-align-center security-wrapper">
        <div class="security-name">Email</div>
        <input class="form-input" :value="personalState.memberInfo.email" />
        <button class="security-btn unverified">Unverified</button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, onMounted } from "vue";
import { loadMemberInfo } from "@/api/personal/personal";
export default defineComponent({
  name: "SecurityView",
  setup() {
    const personalState = reactive({
      memberInfo: {},
    });
    onMounted(() => {
      loadMemberInfo().then((response) => {
        if(response.code === 0) {
          personalState.memberInfo = response.data;
        }
      }).catch((error) => {
        console.log("error", error);
      });
    });
    return {
      personalState
    }
  }
});
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
    .security-wrapper {
      margin-bottom: 20px;
      .security-name {
        width: 160px;
      }
      .form-input {
        margin-right: 30px;
      }
      .security-btn {
        width: 100px;
        text-align: center;
        line-height: 26px;
        padding: 2px;
        &.verified {
          background-color: #1bcef1;
          color: #161b23;
        }
        &.unverified {
          background-color: #163d5b;
          border: 1px solid #4d97ac;
          color: #4d97ac;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
      background-image: none;
      .security-wrapper {
        margin-bottom: 20px;
        .security-name {
          width: 60px;
        }
        .form-input {
          width: 50%;
          margin-right: 16px;
        }
        .security-btn {
          width: 80px;
        }
      }
    }
  }
}
</style>

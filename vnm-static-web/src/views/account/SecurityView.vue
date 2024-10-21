<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">{{ "account.security.title" }}</span>
    </div>
    <div>
      <div class="flex-box flex-align-center security-wrapper">
        <div class="security-name">{{ "account.personal.personal" }}</div>
        <input class="form-input" :value="personalState.memberInfo.telephone" />
        <button class="security-btn verified">
          {{ "account.personal.verified" }}
        </button>
      </div>
      <div class="flex-box flex-align-center security-wrapper">
        <div class="security-name">{{ "login.email" }}</div>
        <input class="form-input" :value="personalState.memberInfo.email" />
        <button class="security-btn unverified">
          {{ "account.security.unverified" }}
        </button>
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
        console.log(error)
        // message.error(error.message, 4)
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
          border: 1px solid #ffffff;
          color: #ffffff;
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

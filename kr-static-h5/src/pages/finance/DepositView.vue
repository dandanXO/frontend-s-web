<template>
  <q-page>
    <div class="account-tabs-div">
      <div>
        <div class="account-item is-active">
          <span>{{ $t("lang.transfer_deposit") }}</span>
        </div>
      </div>
      <router-link to="/finance/withdraw?redirect=/finance/deposit">
        <div class="account-item">
          <span>{{ $t("lang.transfer_withdraw") }}</span>
        </div>
      </router-link>
    </div>
    <DepositComponent />
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import DepositComponent from "components/depositComponent.vue";
export default defineComponent({
  name: "DepositView",
  components: {
    DepositComponent
  },
  setup() {}
});
</script>

<style lang="scss" scoped>
.account-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 0.6rem 0.9rem 0.6rem;
  margin: 6px auto;
  background: $white;
  box-shadow: $shadow-bg;
  border-radius: 10px;

  .account-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 8px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}
</style>

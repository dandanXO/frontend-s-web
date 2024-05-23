<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <form class="personal-info-form">
        <div>
          <label>아이디(개인정보)</label>
          <input
            :value="store.nickName || ''"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
          />
        </div>
        <div>
          <label>잔액</label>
          <input
            :value="store.token ? mainWallet : ''"
            :readonly="store.token ?  'readonly' : false"
            placeholder=""
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            :value="store.email || ''"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
          />
        </div>
        <div>
          <label>전화</label>
          <input
            :value="store.telephone || ''"
            :readonly="store.token ? 'readonly' : false"
            placeholder=""
          />
        </div>
      </form>
      <div class="action-buttons">
        <q-btn rounded flat style="width:200px;height:70px;" @click="closetheModal" :label="'닫기'" class="primary-button blue" />
      </div>
    </q-card-section>
  </div>
</template>

<script setup id="RegisterComponent">
import { reactive, ref, onMounted, computed, defineEmits } from "vue";
import { userStore } from "stores/index";

const emits = defineEmits(["closeModal"]);


const store = userStore();
const mainWallet = computed(() => {
  const balanceWithTwoDecimalPlaces = parseFloat(store.balance).toFixed(2);
  return store.currency.value + " " + balanceWithTwoDecimalPlaces;
});

const closetheModal = () => {
  emits("closeModal");
}

</script>

<style lang="scss" scoped>
.modal-body-content {
  .personal-info-form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 30px;

    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }

    input,
    select {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    select {
      height: 52px;
    }

    label,
    input,
    select {
      width: 100%;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding: 20px 10px 10px;
  }
}
</style>

<template>
<div class="modal-body-wrap">
  <q-card-section class="modal-body-content">
    <form class="withdraw-form content-form">
      <p>
        <label>은행 카드</label>
        <q-select
          filled
          ref="bankCardRef"
          v-model="withdrawInfo.cardId"
          :options="bankCardList"
          option-value="id"
          option-label="bankName" 
          emit-value
          map-options
        />
      </p>
      <p>
        <label>보유금액</label>
        <input />
      </p>
      <p>
        <label>환전암호</label>
        <input />
      </p>
      <p>
        <label>출금금액</label>
        <input />
      </p>
      <p class="option-btns">
        <q-btn v-for="(item, index) in countOptions" :key="index" size="md" class="" :label="item + '원'"></q-btn>
        <q-btn size="md" class="active" label="정정하기"></q-btn>
        </p>
    </form>
  </q-card-section>
  <q-card-actions  class="modal-body-buttons" align="center">
    <q-btn class="form-button blue" label="입금하기"></q-btn>
  </q-card-actions>
</div>
</template>

<script setup id="FinanceWithdraw">

import { ref, onMounted, reactive } from "vue";
import { api } from "boot/axios";

const countOptions = ref([1,5,10,50,100]);
const isLoadingBankCard = ref(false);
const bankCardList = ref([]);
const withdrawInfo = reactive({
  cardId: undefined,
  amount: "",
  withdrawCode: ""
});

const loadCards = () => {
  isLoadingBankCard.value = true;

  api
    .get("/session/bankCard")
    .then(({ data: res }) => {
      if (res.code === 0) {
        bankCardList.value = [];
        bankCardList.value.push(...res.data);

        if (bankCardList.value.length > 0) {
          withdrawInfo.cardId = bankCardList.value[0].id;
        }
      }
    })
    .catch((error) => {
      console.log("error", error);
    })
    .then(() => {
      isLoadingBankCard.value = false;
    });
};

onMounted(() => {
  loadCards();
});
</script>

<style lang="scss">
.withdraw-form {
  .q-field--filled.q-field--dark .q-field__control, .q-field--filled.q-field--dark .q-field__control:before {
    width: 100%;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid #5C5C5C;
    line-height: 40px;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.modal-body-wrap {
}
.modal-body-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  .form-button {
    height: 70px;
    width: 200px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    margin: auto 10px;
    &.blue {
      background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
    }
    &.yellow {
      background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
    }
  }
}

.modal-body-content {
  .content-form {
    p {
      margin-top: 20px;

    }
    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }
    label, input {
      width: 100%;
    }
    input {
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }

    .option-btns {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto auto;
      grid-row-gap: 12px;
      grid-column-gap: 12px;
      :deep(.q-btn) {
        height: 40px;
        color: #fff;
        font-size: 14px;
        border-radius: 3px;
        background: #18324A;
        &.active {
          background: #237BFF;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .modal-body-content {
    .content-form {
      p {
        margin-top: 10px;
      }
      label {
        margin-bottom: 8px;
        font-size: 13px;
      }
      input {
        font-size: 13px;
        line-height: 30px;
        color: #fff;
        padding: 3px 12px;
      }
      .option-btns {
        display: grid;
        grid-template-columns: auto auto auto auto;
        :deep(.q-btn) {
          max-width: unset;
        }
      }
    }
  }
}

</style>

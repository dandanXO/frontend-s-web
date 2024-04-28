<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
    <form class="content-form">
      <p>
        <label>입금계좌번호</label>
        <input />
      </p>
      <p>
        <label>보유금액</label>
        <input />
      </p>
      <p>
        <label>입금자명</label>
        <input />
      </p>
      <p>
        <label>입금금액</label>
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

<script setup id="FinanceDeposit">

import { ref } from "vue";

const countOptions = ref([1,5,10,50,100]);
</script>

<style lang="scss" scoped>
.modal-body-wrap {
}
.modal-body-buttons {
  position: absolute;
  bottom: 0;
}
.modal-body-content {
}
.modal-body-buttons {
  width: 100%;
  .form-button {
    //display: inline-block;
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
      :deep(.q-btn) {
        width: 100px;
        height: 40px;
        margin-right: 15px;
        color: #fff;
        font-size: 14px;
        border-radius: 3px;
        padding: 5px 15px;
        margin-top: 20px;
        background: #18324A;
        &.active {
          background: #237BFF;
        }
      }
    }
  }

}


</style>

<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
    </q-card-section>
    <q-card-actions  class="modal-body-buttons" align="center">
      <q-btn class="form-button blue" label="입금하기"></q-btn>
      <q-btn class="form-button yellow" label="전체확인"></q-btn>
    </q-card-actions>
  </div>
</template>

<script setup id="FinanceDeposit">
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

</style>

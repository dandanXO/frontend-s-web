<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <div class="">
        <q-item-section class="notify-table-row notify-table-header">
          <q-item-label>번호</q-item-label>
          <q-item-label>제목</q-item-label>
          <q-item-label>날짜</q-item-label>
        </q-item-section>
        <template v-for="(item) in articleData" :key="item.page">
          <q-item-section class="notify-table-row table-row-title">
            <q-item-label>{{ item.number }}</q-item-label>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label>{{ item.date }}</q-item-label>
          </q-item-section>
        </template>
      </div>
      <form class="content-form">
        <p>
          <input placeholder="제목을 입력해주세요."/>
        </p>
        <p>
          <textarea rows="3"/>
        </p>
      </form>
    </q-card-section>
    <q-card-actions  class="modal-body-buttons" align="center">
      <q-btn class="form-button blue" label="입금하기"></q-btn>
      <q-btn class="form-button yellow" label="전체확인"></q-btn>
    </q-card-actions>
  </div>
</template>

<script setup id="FinanceDeposit">
import { ref } from "vue";
const articleData = ref([
  {
    number: 2,
    title: "[필독] ※ 카지노 잭팟, 고배당 양방성 ※",
    date: "2024/01/13"
  },
  {
    number: 1,
    title: "[필독] ※ 카지노 잭팟, 고배당 양방성 ※",
    date: "2024/01/13"
  }
])
</script>

<style lang="scss" scoped>
.modal-body-wrap {
}
.modal-body-content {
  .notify-table-row {
    display: flex;
  }
  .notify-table-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    .q-item__label {
      &:first-child {
        width: 100px;
        text-align: center;
      }
      &:nth-child(2) {
        flex: 1;
        text-align: left;
      }
      &:last-child {
        text-align: right;
        width: 100px;
      }
    }


  }
  .table-row-title {
    background: #212121;
    margin-bottom: 5px;
  }
  .content-form {
    p {
      margin-top: 20px;

    }
    input, textarea {
      width: 100%;
      font-size: 14px;
      border-radius: 3px;
      border: 1px solid #5C5C5C;
      line-height: 40px;
      color: #fff;
      background: #212121;
      padding: 5px 15px;
    }
  }
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

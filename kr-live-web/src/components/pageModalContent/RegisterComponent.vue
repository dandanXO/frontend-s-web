<template>
  <div class="modal-body-wrap">
    <q-card-section class="modal-body-content">
      <form class="content-form">
        <div>
          <label>추천인</label>
          <input placeholder="추천인입력" />
        </div>

        <div>
          <label>휴대폰번호</label>
          <input placeholder="없이 숫자 만 입력" />
        </div>

        <div>
          <label>아이디</label>
          <input />
        </div>

        <div>
          <label>인증 코드</label>
          <input placeholder="6자리 숫자" />
        </div>

        <div>
          <label>닉네임</label>
          <input placeholder="2자이상한글,영문만가능" />
        </div>

        <div>
          <label>은행명</label>
          <input placeholder="은행선택" />
        </div>

        <div>
          <label>비밀번호</label>
          <input placeholder="비밀번호입력" />
        </div>

        <div>
          <label>계좌번호</label>
          <input placeholder="'-'없이숫자만입력." />
        </div>

        <div>
          <label>비밀번호확인</label>
          <input placeholder="비밀번호확인입력" />
        </div>

        <div>
          <label>예금주</label>
          <input placeholder="2자이상한글,영문만가능(예금주는수정불가/고객센터문의)" />
        </div>

        <div>
          <label>환전암호</label>
          <input placeholder="환전암호입력" />
        </div>
      </form>
    </q-card-section>
  </div>
</template>

<script setup id="FinanceDeposit">

import { ref } from "vue";

const countOptions = ref([1, 5, 10, 50, 100]);
</script>

<style lang="scss" scoped>
.modal-body-wrap {}

.modal-body-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
}

.modal-body-content {}

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
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;

    label {
      margin-bottom: 10px;
      display: block;
      font-size: 14px;
      color: #fff;

    }

    label,
    input {
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
  }

}
</style>
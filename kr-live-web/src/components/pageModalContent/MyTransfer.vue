<template>
    <div class="modal-body-wrap">
        <q-card-section class="modal-body-content">
            <form class="personal-info-form">
                <div>
                    <label>보유포인트</label>
                    <input placeholder="" />
                </div>
                <div>
                    <label>전환포인트</label>
                    <input placeholder="" />
                </div>
            </form>
            <div class="option-btns">
                <q-btn v-for="(item, index) in countOptions" :key="index" size="md" class="" :label="item + '원'"></q-btn>
                <q-btn size="md" class="active" label="전액"></q-btn>
                <q-btn size="md" class="active" label="정정하기"></q-btn>
            </div>
            <div class="action-buttons">
                <q-btn class="form-button blue" label="입금하기"></q-btn>
            </div>
        </q-card-section>
    </div>
</template>

<script setup id="RegisterComponent">
import { reactive, ref, onMounted } from "vue";

const countOptions = ref([1,5,10,50,100]);
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

            &.blue {
                background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
            }

            &.yellow {
                background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
            }
        }
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
</style>
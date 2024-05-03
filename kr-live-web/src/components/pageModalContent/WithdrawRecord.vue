<template>
    <div class="modal-body-wrap">
        <q-card-section class="modal-body-content withdraw-record-form">
            <div class="search-container">
                <div class="date-field">
                    <q-input filled v-model="searchForm.startDate" readonly>
                        <template v-slot:prepend>
                            <q-icon name="calendar_today" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="searchForm.startDate" @update:model-value="searchRecord(true)"
                                        mask="YYYY-MM-DD">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="white" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                    <span>to</span>
                    <q-input filled v-model="searchForm.endDate" readonly>
                        <template v-slot:prepend>
                            <q-icon name="calendar_today" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="searchForm.endDate" @update:model-value="searchRecord(true)"
                                        mask="YYYY-MM-DD">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="white" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="">
                <q-item-section class="notify-table-row notify-table-header">
                    <q-item-label>번호</q-item-label>
                    <q-item-label>금액</q-item-label>
                    <q-item-label>상태</q-item-label>
                    <q-item-label>날짜</q-item-label>
                </q-item-section>
                <div class="no-data">
                    조회된 데이터가 없습니다.
                </div>
            </div>
        </q-card-section>
        <q-card-actions class="modal-body-buttons" align="center">
            <q-btn class="form-button blue" label="입금하기"></q-btn>
            <q-btn class="form-button yellow" label="전체확인"></q-btn>
        </q-card-actions>
    </div>
</template>

<script setup id="FinanceDeposit">
import { ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { updateDate } from "src/boot/utils";


const store = userStore();
const searchForm = reactive({
    startDate: updateDate(7), 
    endDate: updateDate(0)
});
const pagination = reactive({
    pageSize: 20,
    total: 0,
    pages: 1,
    current: 1,
    pagingState: null
});
const isLoading = ref(true);

const searchRecord = (isNewSearch) => {
    if (!searchForm.startDate || !searchForm.endDate) {
        return;
    }
    if (isNewSearch) {
        pagination.current = 1;
        pagination.pagingState = null;
    }

    isLoading.value = true;

    const { startDate, endDate } = searchForm;

    api
        .get("/session/member/withdraw", {
            params: {
                startDate,
                endDate,
                memberId: store.id,
                current: pagination.current,
                size: pagination.pageSize,
                pagingState: pagination.pagingState
            }
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => { })
        .then(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    searchRecord();
});

</script>

<style lang="scss" scoped>
.withdraw-record-form {
    .search-container {
        border-radius: 0.5rem;
        background: transparent;
        padding: 1rem;
        margin-top: 0;

        .date-field {
            display: flex;
            align-items: center;
        }
    }
}

.modal-body-wrap {}

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
                width: 100px;
                text-align: center;
            }

            &:nth-child(3) {
                width: 100px;
                text-align: center;
            }

            &:nth-child(4) {
                width: 100px;
                text-align: center;
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

        input,
        textarea {
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

    .no-data {
        width: 100%;
        min-height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #212121;
        color: #767676;
    }
}

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
</style>
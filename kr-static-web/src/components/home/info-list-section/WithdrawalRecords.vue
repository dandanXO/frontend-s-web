<template>
    <template v-if="isLoading">
        <el-skeleton :rows="5" style="width:100%;" />
    </template>
    <template v-else-if="financeRecords.length > 0">
        <div style="max-height:500px;overflow:auto;">
            <div v-for="(item, index) in financeRecords" :key="index" class="withdraw-records-item-box">
                <div class="withdraw-records-item-left">
                    <div class="withdraw-records-item-title" :title="item.title">
                        [
                        {{ item.title }}
                        ] ※
                        {{ item.content }}
                        ※
                    </div>
                </div>
                <div class="withdraw-records-item-right">
                    <div class="withdraw-records-item-date">{{ item.createTime }}</div>
                </div>
            </div>
        </div>
    </template>
    <div v-else class="withdraw-records-item-box" style="justify-content: center;">
        콘텐츠 없음
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { userStore } from '@/store';

const store = userStore();
const isLoading = ref(false);
const financeRecords = ref([]);

const loadFinanceRecords = () => {
    isLoading.value = true;

    store.getFinanceRecordsList().then((records) => {
        financeRecords.value = records;
        isLoading.value = false;
    }).catch((err) => {
        console.log(err)
        isLoading.value = false;
    });
};

onMounted(() => {
    loadFinanceRecords();
})
</script>

<style lang="scss" scoped>
:deep(.el-skeleton__item) {
    background-color: #9AB9E330;
}

.withdraw-records-item-box {
    width: calc(100% - 20px);
    height: 60px;
    background-color: #9AB9E330;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 25px;
    font-size: 12px;
    line-height: 16.8px;
    margin: 20px 0;
    border-radius: 15px;
    display: grid;
    grid-template-columns: minmax(calc(90% - 100px), 90%) minmax(120px, 10%);

    .withdraw-records-item-title {
        color: #7A80A1;
    }

    .withdraw-records-item-date {
        color: #92959F;
    }

    @media (min-width: 769px) {
        grid-template-columns: minmax(calc(80% - 100px), 90%) minmax(200px, 20%);
    }

    @media (min-width: 769px) {
        padding: 0px 40px;
        font-size: 16px;
        line-height: 22px;
    }

    .withdraw-records-item-left {
        width: 100%;

        @media (min-width: 769px) {
            width: 60%;
        }

        .withdraw-records-item-sort {
            padding-right: 8px;
        }

        .withdraw-records-item-title {
            transition: 0.3s all;
            padding-right: 8px;
            padding-left: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 769px) {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .withdraw-records-item-box {
        @media (min-width: 769px) {
            width: 100%;
        }
    }

    .withdraw-records-item-right {
        .withdraw-records-item-date {
            transition: 0.3s all;
            color: #92959f;
            text-align: right;
        }
    }
}
</style>
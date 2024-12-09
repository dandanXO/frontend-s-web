<template>
    <div class="christmas-gachapon-container">
        <div class="el-loading-mask" v-if="isLoading">
            <p class="spinner"><img src="../christmas-gachapon/img/spinner.png"></p>
            <p class="loading-text">加载中... </p>
        </div>
        <div class="snow-container">
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        <div class="snowflake"></div>
        </div>
        <div class="promorule" @click="openModal('rule')"><img src="../christmas-gachapon/img/rules.png"></div>
        <div class="promorecord" @click="openModal('record')"><img src="../christmas-gachapon/img/record.png"></div>
        <div class="once" @click="getGachapon('once')"><img src="../christmas-gachapon/img/once.png"></div>
        <div class="fivex" @click="getGachapon('five')"><img src="../christmas-gachapon/img/fivex.png"></div>
        <div class="amtleft">抽奖次数剩余: <span>{{ availableDraw }}次</span></div>
    </div>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" class="christmas-modal" v-model="isModal">
        <div class="christmas-side" v-if="isRules">
            <img src="../christmas-gachapon/img/tiny.png">
        </div>
        <div class="inner-contents">
            <div class="title">
                <img src="../christmas-gachapon/img/side.png">
                {{ modalContent.title }}
                <img src="../christmas-gachapon/img/side.png">
            </div>
            <div v-if="isRules" class="rules" v-html="rules"></div>
            <div class="table-scroll" v-if="!isRules">
            <el-table :data="paginatedData" style="width: 100%">

                <!-- Other columns -->
                <el-table-column prop="prizeNo" label="编号"></el-table-column>
                <el-table-column prop="bonusName" label="内容"></el-table-column>
                <el-table-column prop="recordTime" label="时间" width="300"></el-table-column>
                <!-- <el-table-column prop="status" label="状态" width="100"></el-table-column> -->
            </el-table>
    </div>

        <el-pagination v-if="!isRules"
        style="margin-top: 20px; justify-content: center; text-align: right;"
        background
        v-model:current-page="params.current"
        v-model:page-size="params.size"
        :total="totalItems"
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[5, 10, 20, 30, 50]"
        @current-change="onPageSizeChange"
        @update:page-size="onPageSizeChange"
        />
        </div>
    </el-dialog>

    <el-dialog :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="prize-modal" :class="{ 'five': prizes.length > 1, 'once': prizes.length <= 1 }" v-model="isPrizeModal" align-center>
        <div class="prizes">
            <div class="prize" v-for="prize in prizes">
                <div class="imgball"><img :src="require(`../christmas-gachapon/img/${prize.img}.png`)"></div>
                <div class="redbar">{{ prize.type }}</div>
            </div>
        </div>
        <div class="claimbtn" @click="getBalance()">
            <img src="../christmas-gachapon/img/claim.png">
        </div>
    </el-dialog>
</template>
<script setup>
import { onMounted, ref, reactive, watch, defineProps, computed } from "vue";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";
import moment from "moment";
import {
    getDrawPrizes,
    initDrawEvent,
    getDrawRecord
} from "@/api/index/promo";
    const store = userStore();
    const isLoading = ref(false);
    const props = defineProps(["promoCode","promoRules"]);
    const promoCode = ref(props.promoCode);
    const rules = ref(props.promoRules);
    const notify = useNotify();
    const isModal = ref(false);
    const isRules = ref(false);
    const isPrizeModal = ref(false)
    const modalContent = {
        title: ''
    }
    const prizes = ref([]);
    const availableDraw = ref(0);
    const params = reactive({
        size: 30,
        current: 1
    })
    const totalItems = ref(0);
    const onPageSizeChange = async () => {
        tableData.value = []
        getDrawRecord(promoCode.value, params).then((res) => {
            if (res.code === 0) {
                totalItems.value = res.data.total
                tableData.value = res.data.records
            }
        })
    }
    const openModal = (type) => {
        if (type === 'rule') {
            modalContent.title = '活动规则'
            isRules.value = true
        } else if (type === 'record') {
            tableData.value = []
            getDrawRecord(promoCode.value, params).then((res) => {
                if (res.code === 0) {
                    totalItems.value = res.data.total
                    tableData.value = res.data.records
                    console.log(tableData.value)
                }
            })
            modalContent.title = '活动记录'
            isRules.value = false
        } else {}
        isModal.value = true
    }
    const getGachapon = (t) => {
    if (availableDraw.value === 0) {
        notify({
        type: "warning",
        message: `抽奖次数不足`
        });
        return
    }
    isLoading.value = true;

    var times = 1
    if (t === 'five') {
        times = 5
    }
    // Simulating an async operation (e.g., an API call) with a Promise.
    getDrawPrizes(promoCode.value, times) // Replace this with your actual async operation (e.g., an API call)
        .then((res) => {
            if (res.code === 0) {
                prizes.value = [];
                res.data.forEach(item => {
                    if (!item.bonus) {
                        if (item.bonusName === '苹果16 256GB') {
                            prizes.value.push({
                                img: 'iphone',
                                type: 'IPhone16 256GB'
                            })
                        }
                        if (item.bonusName === '苹果耳机一副') {
                            prizes.value.push({
                                img: 'ipods',
                                type: '苹果耳机一副'
                            })

                        }
                    } else {
                        const bonusMapping = {
                            大红包: 'big',
                            中红包: 'med',
                            小红包: 'small',
                        };

                        if (bonusMapping[item.bonusName]) {
                        prizes.value.push({
                            img: bonusMapping[item.bonusName],
                            type: `${item.bonusName} ${item.bonus}元彩金`,
                        });
                        }
                    }
                });
                isPrizeModal.value = true;
            }
        })
        .catch((error) => {
            // Handle error
            // notify({
            //     type: "error",
            //     message: `Error fetching prizes: ${error.message}`
            // });
            console.error('Error fetching prizes:', error);
        })
        .finally(() => {
            // Always run (after success or error)
            isLoading.value = false;
            console.log('Loading state finished');
            init();
        });
    };
    const getBalance = () => {
        store.getBalance();
        isPrizeModal.value = false;
    }

    const tableData = ref([]);

    const paginatedData = computed(() => {
    // Translate the data before pagination
    const translatedData = translateTableData(tableData.value);

    return translatedData  // Pagination on translated data
    });

    // Status translation mapping
    const statusTranslations = {
        PENDING: '待处理',
        CLAIMED: '已领取'
    };
    // const translatedTableData = computed(() => {
    //     return tableData.value.map((row) => ({
    //         ...row,
    //         bonusName: row.bonusAmount
    //         ? `恭喜获得 ${row.bonusName} ${row.bonusAmount}元彩金`
    //         : `恭喜获得 ${row.bonusName}`,
    //         status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
    //         recordTime: moment(row.recordTime).format('YYYY年MM月DD日HH:mm:ss'), // Format time
    //     }));
    // });

    // Translate the table data
    const translateTableData = (data) => {
    return data.map((row) => ({
        ...row,
        bonusName: row.bonusAmount
        ? `恭喜获得${row.bonusName}${row.bonusAmount}元彩金`
        : `恭喜获得${row.bonusName}`,
        status: statusTranslations[row.status] || row.status, // Use translation or fallback to original
        recordTime: moment(row.recordTime).format('YYYY年MM月DD日HH:mm:ss'), // Format time
    }));
    };

    const init = () => {
        initDrawEvent(promoCode.value).then((res) => {
            if (res.code === 0) {
                availableDraw.value = res.data.availableDraw
            }
        })
    }
    onMounted(() => {
    if (!store.token) {
        return;
    }
    init();
    });
</script>
<style scoped lang="scss">

.snow-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .snowflake {
    position: absolute;
    top: -10px; // Start slightly above the visible area
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: fall linear infinite;


    // Randomly generate animation values for variety
    &:nth-child(1) {
      left: 5%;
      animation-duration: 10s;
      animation-delay: 0s;
      animation-timing-function: ease-in;
    }
    &:nth-child(2) {
      left: 15%;
      animation-duration: 12s;
      animation-delay: 2s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-duration: 8s;
      animation-delay: 1s;
    }
    &:nth-child(4) {
      left: 50%;
      animation-duration: 15s;
      animation-delay: 3s;
    }
    &:nth-child(5) {
      left: 75%;
      animation-duration: 11s;
      animation-delay: 0.5s;
    }
  }
}

@keyframes fall {
  0% {
    transform: translateY(-100px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh); // Fall beyond the bottom edge
    opacity: 0; // Fade out at the end
  }
}
.spinner {
  display: inline-block;
  width: 150px; /* Set the width of your PNG */
  height: 150px; /* Set the height of your PNG */
  overflow: hidden; /* Optional: Ensures content stays within the div */
}
.el-loading-mask {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
}
.loading-text {
    font-size: 24px; /* Adjust size as needed */
    color: #ffffff; /* Text color */
    background: linear-gradient(90deg, #ff7e5f, #feb47b); /* Gradient text */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; /* Make gradient visible in text */
    text-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3); /* Add a soft shadow */
    animation: bounce 2s linear infinite; /* Apply spinning animation */
}
.spinner img {
  width: 88%; /* Ensures the image scales properly */
  height: 88%;
  animation: spin 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0% {
    transform: translateX(0); /* Start at the center, no rotation */
  }
  25% {
    transform: translateX(-15px); /* Move up and rotate 90 degrees */
  }
  50% {
    transform: translateX(0); /* Return to center and rotate 180 degrees */
  }
  75% {
    transform: translateX(15px); /* Move down and rotate 270 degrees */
  }
  100% {
    transform: translateX(0); /* Return to center and complete rotation */
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg); /* Start with no rotation */
  }
  to {
    transform: rotate(360deg); /* Complete a full rotation */
  }
}
.christmas-gachapon-container {
    position: relative;
    background: url(img/christmas-bg.png)no-repeat top left;
    background-size: cover;
    width: 100%;
    max-width: 1920px;
    height: 890px;
    margin: 0 auto;
    .promorule {
        position: absolute;
        bottom: 240px;
        left: 470px;
        cursor: pointer;
        &:hover {
            filter: hue-rotate(340deg) saturate(2.5);
        }
    }
    .promorecord {
        position: absolute;
        bottom: 181px;
        left: 480px;
        cursor: pointer;
        &:hover {
            filter: hue-rotate(340deg) saturate(2.5);
        }
    }
    .once {
        position: absolute;
        bottom: 100px;
        left: 670px;
        width: 240px;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
    .fivex {
        position: absolute;
        bottom: 100px;
        left: 920px;
        width: 240px;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
    .amtleft {
        position: absolute;
        bottom: 65px;
        left: 670px;
        text-align: center;
        width: 500px;
        font-weight: bold;
        font-size: 18px;
        color: #ffffff;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        span {
            color: #FFD900;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);

        }
        background: linear-gradient(90deg, rgba(255, 217, 0, 0) 0%, rgba(255, 217, 0, 0.6) 52.5%, rgba(255, 217, 0, 0) 93.5%);
    }
}
body .el-dialog.christmas-modal{
    box-shadow: none;
    background-color: unset;
    width: 80%;
    max-width: 1020px;
    overflow: unset;
    * {
        scrollbar-color: #fb7070 transparent;
    }
    .el-dialog__header .el-dialog__headerbtn {
        top: 100px;
    }
}
body .el-dialog.prize-modal {
    * {
        scrollbar-color: #fb7070 transparent;
    }
    box-shadow: none;
    background-color: unset;
    width: 90%;
    max-width: 1400px;
    overflow: unset;
    &.once {
        max-width: 500px;
    }
}
body .el-dialog.christmas-modal .el-dialog__body {
    background: url(img/modal-bg.png)no-repeat center center;
    background-size: cover;
    min-height: 720px;
    padding: 210px 80px 0;
    margin-top: -120px;
    .el-pagination.is-background .btn-next.is-active, .el-pagination.is-background .btn-prev.is-active, .el-pagination.is-background .el-pager li.is-active {
        background-color: #ff0000;
        color: #ffffff;
    }
    .el-pager li.is-active, .el-pager li:hover {
        color: #ff0000;
    }
}
body .el-dialog.prize-modal.once .el-dialog__body {
    background: url(img/modal-one.png)no-repeat center center;
    background-size: contain;
    min-height: 703px;
    padding: 200px 80px 0;
    margin-top: -120px;
    .prizes {
        .prize {
            .imgball {
                width: 300px;
            }
        }
    }
    .redbar {
        background-size: cover;
        font-size: 20px;
    }
    .claimbtn {
        width: 250px;
    }
}
body .el-dialog.prize-modal.five .el-dialog__body {
    background: url(img/modal-five.png)no-repeat center center;
    background-size: contain;
    min-height: 640px;
    padding: 260px 80px 0;
}
.christmas-modal {
    .title {
        text-align: center;
        margin: 10px auto;
        color: #1F774C;
        font-family: PingFang;
        font-size: 32px;
        font-weight: 600;
        line-height: 44px;
        display: flex;
        gap: 5px;
        justify-content: center;
        align-items: center;
        img {
            width: 50px;
        }
    }
    .christmas-side {
        position: absolute;
        right: 20px;
        bottom: 0px;
    }
}
.prize-modal {
    .prizes {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0px;
        .prize {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .imgball {
                width: 220px;
                img {
                    width: 100%;
                }
            }
            .redbar {
                background: url(img/redbar.png)no-repeat center center;
                padding: 10px 30px;
                width: 100%;
                font-size: 18px;
                text-align: center;
                color: #F82F06;
                font-weight: bold;

            }
        }
    }
    .claimbtn {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        margin: 10px auto 0;
        cursor: pointer;
        img {
            width: 100%;
        }
    }
}
.rules {

font-size: 14px;
color: #333; // Default text color
line-height: 1.6;
padding: 0;
border-radius: 8px; // Optional: Rounded corners for the rules container

ul {
list-style: none;
padding: 0;
margin: 0;
counter-reset: item; // Initialize counter

li {
    position: relative;
    padding-left: 30px; // Space for numbered circle
    margin-bottom: 15px;

    &::before {
    content: counter(item); // Display the index
    counter-increment: item; // Increment counter
    position: absolute;
    top: 10px;
    left: 0px;
    transform: translateY(-50%);
    background: linear-gradient(135deg, #E6374A, #AC1828);
    color: #FFFFFF;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    }
}
}

font {
color: #c24f4a;
font-weight: bold; // Optional: Emphasize important notes
}
}
.el-table thead {
  position: sticky;
  top: 0;
  background-color: #fff; /* Ensure the header background is white */
  z-index: 1; /* Ensure it stays above the table body */
}
.table-scroll {
    height: 305px;
    overflow: auto;
    position: relative;
}
.el-table {
    font-weight: bold;
    font-family: PingFang SC;
}
.el-table th.el-table__cell.is-leaf {
    background: #F34E38;
    color: #ffffff;
    border: 1px solid;
    text-align: center;
}

.el-table .cell {
    text-align: center;
}
.el-table__row:nth-child(even) {
  background-color: #F34E3851;
  color: #000000;
}

/* Set the background color for odd rows to transparent */
.el-table__row:nth-child(odd) {
  background-color: transparent;
  color: #000000;
}
</style>

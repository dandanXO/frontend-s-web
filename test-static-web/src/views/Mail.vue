<template>
    <div class="app-mail-container">
        <div class="header">
            <img  src="../assets/images/mail/app-mail.title.png">
        </div>
        <div class="horizontal-bar">
            <div class="horizontal-bar-text">
                <div class="split-bar"></div>
                活动预热
            </div>
            <div class="bottom" data-aos="fade-up">
                <div class="tabs">
                    <div :class="`tab tab-left ${activeTab === 0 ? 'active' : ''}`" @click="handleActiveClick(0) ">精选活动</div>
                    <div :class="`tab tab-right ${activeTab === 1 ? 'active' : ''}`" @click="handleActiveClick(1)">超前盘点</div>
                </div>
            </div>
        </div>
        <div class="event-content">
            <div class="event-label">
                <div @click="handleEvetnClick(index)" v-for="(event, index) in eventList[activeTab]" :key="event.name" class="event-label-item" :class="{active: event.active}">
                    <div class="event-label-item-wrap">
                        <div class="tag"> 精選 </div><div class="label"> {{event.name}} </div>
                    </div>
                    <div class="active-button" v-show="event.active"> 
                        <div style="width: 0;height: 0;border-style: solid;border-width: 6px 0 6px 12px;border-color: transparent transparent transparent #2E4977;"></div>
                    </div>
                </div>
            </div>
            <div class="event-info">
                <div>
                    <img src="../assets/images/mail/test-evet.png" />
                </div>
                <div class="event-info-detail">
                    <div class="time">
                        <img src="../assets/images/mail/colck-icon.png" />
                        活动时间
                        {{ activeEvent?.time || '' }}
                        {{ activeEvent?.name || '' }} 
                    </div>
                    <button class="notify-btn">参与提醒</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';



const activeTab = ref(0);
const activeEvent = ref(null);
const eventList = reactive({
    0:[{name:'新年红包雨', time:'10', active:false},{name:'神龙贺新春', time:'101', active:false},{name:'BB 冬季别墅杯', time:'102', active:false},{name:'BB 冬季别墅杯', time:'103', active:false},{name:'LPL 春季赛', time:'104', active:false},{name:'LPL 春季赛', time:'105', active:false}],
    1:[{name:'1', time:'11', active:false},{name:'2', time:'11', active:false},{name:'3', time:'11', active:false},{name:'4', time:'11', active:false},{name:'5' ,time:'11', active:false},{name:'6', time:'11', active:false}]
})
const handleActiveClick = (index)=>{
    eventList[index].forEach(item=>{
        item.active = false
    })
    activeTab.value = index
    eventList[activeTab.value][0].active = true
    activeEvent.value = eventList[activeTab.value][0]
}
const handleEvetnClick = (index)=>{
    eventList[activeTab.value].forEach(item=>{
        item.active = false
    })
    eventList[activeTab.value][index].active = true
    activeEvent.value = eventList[activeTab.value][index]
}

onMounted(() => {
    eventList[0][0].active = true
    activeEvent.value = eventList[0][0]
});
</script>

<style lang="scss" scope>
.header{
    margin: 35px 0px;
}
.tabs {
    display: flex;
    align-items: center;
    .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        width: 217px;
        height: 50px;
        cursor: pointer;
    
        &:hover {
            filter: brightness(0.9);
        }
}

    .tab-left {
        background: url('../assets/images/mail/tab-left.png') no-repeat center center;
        background-size: 100% 100%;

        &.active {
            background: url('../assets/images/mail/tab-left-active.png') no-repeat center center;
            background-size: 100% 100%;
            color: #fff;
        }
    }

    .tab-right {
        background: url('../assets/images/mail/tab-right.png') no-repeat center center;
        background-size: 100% 100%;

        &.active {
            background: url('../assets/images/mail/tab-right-active.png') no-repeat center center;
            background-size: 100% 100%;
            color: #fff;
        }
    }
}
.app-mail-container {
    min-height: 821px;
    background: url('../assets/images/mail/app-mail-bg.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
}
/* Define the container for the horizontal bar */
.horizontal-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:rgb(234, 227, 227, 0.4);
    padding: 10px;
    width: 1319px;
    height: 76px;
}

/* Style for the text part */
.horizontal-bar-text {
    display: flex;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    color: white;
    font-family: 'FZHanZhenGuangBiaoS';
    .split-bar{
        border-left:3px solid white ;
        border-radius: 12px;
        height: 36px;
        width: 0px;
        margin-right: 15px;
        margin-left: 20px;
    }
}

/* Style for the button-like elements */
.horizontal-bar-button {
    background: #0055CC;
    border: none;
    color: white;
    padding: 10px 20px;
    margin: 0 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

/* Hover effect for buttons */
.horizontal-bar-button:hover {
    background-color: #0044BB;
}

.event-content{
    width: 1319px;
    display: flex;
    justify-content: space-between;
    .event-label{
        .event-label-item{
            width: 274px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            background-color:rgba(55, 53, 53, 0.4);
            margin-top: 25px;
            border-radius: 5px;
            opacity: 0.5;
            .event-label-item-wrap{
                display: flex;
                align-items: center;
            }
            .active-button{
                width: 18px;
                height: 50px;
                background: linear-gradient(to left , #fff, #6EDCFF);
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                display:flex;
                justify-content: center;
                align-items:center;
            }
            .tag{
                color: white;
                border-radius: 5px;
                width: 53px;
                height: 22px;
                background: linear-gradient(to left , blue, rgb(195, 0, 255));
                text-align: center;
                margin: 0px 14px;
            }
            .label{
                color: white;
                font-size: 24px;
            }
        }
        .active{
                opacity: 1;
            }
    }
}
.event-info {
    width: 1012px;
    height: 413px;
    margin-top: 25px;
    flex-direction: column;
    display: flex;
    border-radius: 12px;
    img{
        border-top-left-radius: 18.8px;
        border-top-right-radius: 18.8px;
    }
    .event-info-detail{
        background: rgba(36, 36, 36, 0.4);
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-right-radius: 18.8px;
        border-bottom-left-radius: 18.8px;
        .time{
            margin-left:24px ;
            color:white;
            font-size:24px;
            font-weight: 700;
        }
        .notify-btn{
           margin-right: 19.8px;
            padding: 10px 20px;
            font-size: 24px;
            font-weight: bold;
            color: white;
            border: none;
            border-radius: 30px; /* This creates the rounded corners. Adjust as needed */
            cursor: pointer;
            text-align: center;
            background: linear-gradient(to right, #7ba8d7, #7ba8d7); /* Gradient background */
            box-shadow: 
                inset 0 -2px 4.58px 0 rgba(177, 215, 255, 1), /* First inner shadow */
                inset 0 -1px 3.66px 0 rgba(88, 148, 255, 1);  /* Second inner shadow */
            width: 222.64px;
            height: 53.64px; /* Adjust width and height as needed */
            display: inline-block; /* For proper width and height application */
        }
    }
}

</style>
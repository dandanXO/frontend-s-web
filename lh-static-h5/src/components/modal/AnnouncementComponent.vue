<template>
  <q-carousel
    v-model="innerSlide"
    swipeable
    animated
    :navigation="false"
    infinite
    :arrows="false"
    @update:model-value="emits('chageSlide',$event)"
  >
    <q-carousel-slide v-for="(item, index) in 6" :key="index" :name="index" class="column no-wrap flex-center">
      <div class="announcement-component">
        <div class="announcement-title">体育场馆维护公告 {{ index + 1 }}</div>
        <div class="announcement-content">
          尊敬的会员，恭喜您于 2023/08/1
          使用 PAY 钱包、USDT 进行提款，产生一笔幸运订单。彩金已经派发至您的游戏账户内请您当日内查收。恭喜您于 2023/08/1
          使用 PAY 钱包、USDT 进行提款，产生一笔幸运订单。彩金已经派发至您的游戏账户内请您当日内查收。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。天天爆米。祝您好运连连！天天爆米。祝您好运连连！天天爆米。
        </div>
        <div class="announcement-footer">
          <div class="footer-button" @click="handleService">
            联系客服
            <img src="../../assets/images/home/announcement/arrow-right.svg" alt="">
          </div>
          <div class="footer-button" @click="handleDetail">
            查看详情
            <img src="../../assets/images/home/announcement/arrow-right.svg" alt="">
          </div>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script setup>
import { ref,watch, defineEmits } from "vue";

const props = defineProps({
  slide: {
    type: Number,
    default: 1
  }
})
const emits = defineEmits(['chageSlide']);
const innerSlide = ref(0)
watch(()=>props.slide,(newV, oldV)=>{
  innerSlide.value = newV
  
  if(newV!=oldV){
    
    
  }
  
},{immediate: true})
watch(()=> innerSlide, (newV)=>{
  console.log('inin')
  emits('chageSlide',newV)
})
const handleService = () => {
};

const handleDetail = () => {
  console.log("handleDetail");
};
</script>

<style lang="scss" scoped>
.announcement-component {
  padding: 10px 12px 16px;
  background: white;
  height: 100%;
  overflow: auto;
}

.announcement-title {
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
}

.announcement-content {
  font-size: 16px;
  color: #666666;
  margin-bottom: 12px;
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;

  .footer-button {
    cursor: pointer;
    background: #cfcfcf;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    height: 30px;
    font-size: 16px;
    gap: 2px;
    padding: 8px 12px;
    color: white;
  }
}
</style>

<template>
  <div
    class="floating-button-wrapper"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @mousedown.prevent="startDrag"
    @click="handleToggle"
  >
    <div class="floating-button-container">
      <div
        ref="buttonRef"
        class="floating-button"
        :class="{'is-dragging': isDragging}"
      >
        <el-button v-if="!isShow" icon="el-icon-document-add" class="floating-button-content" />
        <el-button v-else icon="el-icon-arrow-left" class="floating-button-content" />
      </div>

      <div class="floating-button-list" v-show="isShow">
        <div class="float-button" type="button">1: 跳转页面</div>
        <div class="float-button" type="button">2: 复制页面</div>
        <div class="float-button" type="button">3: 请无视这个按钮。</div>
        <div class="float-button" type="button">4: 按钮功能还在制作中。</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
// defineProps

// defineProps({
//   buttonText: {
//     type: String,
//     default: '+',
//   },
// })

const buttonRef = ref(null)
const isDragging = ref(false)
const isMoving = ref(false)
const isShow = ref(false)
const offset = reactive({ x: 0, y: 0 })
const position = reactive({
  x: 0,
  y: 0,
})

const buttonText = ref("+");

const startDrag = e => {
  isDragging.value = true
  isMoving.value = false

  // 計算偏移量
  const rect = buttonRef.value.getBoundingClientRect()
  offset.x = e.clientX - rect.left
  offset.y = e.clientY - rect.top

  // 添加事件監聽器
  window.addEventListener('mousemove', drag)
  window.addEventListener('mouseup', stopDrag);

  const floatingButtonList = document.querySelector('.floating-button-list');
  if (floatingButtonList) {
    const divCount = floatingButtonList.querySelectorAll('div').length;
    floatingButtonList.style.top = `${(divCount - 2) * -50}%`;
  }
}

const drag = e => {
  if (!isDragging.value) return

  // 標記為正在移動
  isMoving.value = true

  // 更新位置
  position.x = e.clientX - offset.x
  position.y = e.clientY - offset.y

  // 防止拖出可視範圍
  position.x = Math.max(
    0,
    Math.min(position.x, window.innerWidth - buttonRef.value.offsetWidth)
  )
  position.y = Math.max(
    0,
    Math.min(position.y, window.innerHeight - buttonRef.value.offsetHeight)
  )
}

const stopDrag = () => {
  isDragging.value = false

  // 移除事件監聽器
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
}
//
// watch(isShow, (val) => {
//   if (val === true) {
//     buttonText.value = "&lt;"
//   } else {
//     buttonText.value = "+"
//   }
// })

const handleToggle = () => {
  // 如果在拖曳過程中移動了，則不觸發點擊事件
  if (!isMoving.value) {
    console.log('Button clicked!')
    isShow.value = !isShow.value;
  }

  // 重置移動狀態
  isMoving.value = false
}

// 在掛載時計算初始位置（右下角）
onMounted(() => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const buttonWidth = 50 // 預估按鈕寬度
  const buttonHeight = 50 // 預估按鈕高度
  const margin = 20 // 距離邊緣的邊距

  position.x = viewportWidth - buttonWidth - margin
  position.y = viewportHeight - buttonHeight - margin
})

// 組件卸載時清理事件監聽器
onUnmounted(() => {
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.floating-button-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  font-size: 24px;
}
.floating-button-container {
  position: relative;
}
.floating-button-list {
  position: absolute;
  right: 60px;
  top: -100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
}
.floating-button-list .float-button{
  min-width: 210px;
  padding: 6px 8px;
  background: rgb(38, 52, 69);
  border-radius: 6px;
  border: 2px solid #304156;
  cursor: pointer;
  color: #fff;

  &:hover{
    opacity: 0.9;
    font-weight: bold;
  }
  &:active{
    filter: brightness(90%);
    transform: translate(0px, 1px);
  }
}
.floating-button {
  cursor: move;
  border-radius: 50%;
  background-color: #3b82f6; /* 藍色 */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-button.is-dragging {
  transform: scale(1.05);
}

.floating-button-content {
  border-radius: 50%;
  border: none;
  color: inherit;
  outline: none;
  background: none;
  cursor: pointer;
  font-size: 24px;

  &:hover{
    background: none;
    filter: brightness(90%);
    color: #fff;
  }
}
</style>

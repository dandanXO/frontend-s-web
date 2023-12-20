<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <div class="role-span">{{ route.name }}</div>
      <div class="contact-boxes">
        <div class="contact-box" v-for="(c, i) in contactlist" :key="i">
          <div class="contacticon"><img :src="require(`../../../assets/images/${c.icon}.svg`)"></div>
          <div class="type">{{ c.type }}</div>
          <div class="link">{{ c.link }}</div>
          <div class="buttons">
            <el-button v-for="(btn, btnkey) in c.btns" :key="btnkey" :type="btnkey === 1 ? 'primary' : 'plain'">{{ btn.text }}</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const contactlist = ref([
  {
    icon: 'cchat',
    type: '合营咨询',
    link: '点击进入在线咨询',
    btns: [{
      text: '咨询',
      action: ''
    }]
  },
  {
    icon: 'cskype',
    type: '合营部Skype',
    link: 'Live:cid.b2a14236...',
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: ''
    }]
  },
  {
    icon: 'cmeetalk',
    type: '合营部Mee Talk',
    link: 'Kyaff05',
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: ''
    }]
  }
])
</script>
<style lang="scss" scoped>
.contact-boxes {
  display: flex;
  justify-content: center;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1000px;
}
.contact-box {
  font-family: PFBold;
  background: #F4F9FD;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 280px;
  .type, .link {
    margin: 10px;
  }
  .buttons {
    margin-top: 20px;
  }
}
</style>

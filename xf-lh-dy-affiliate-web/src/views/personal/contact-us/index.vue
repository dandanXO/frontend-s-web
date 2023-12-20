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
    icon: 'cmail',
    type: '合营部电邮',
    link: 'affiliate@dyvip99.com',
    btns: [{
      text: '咨询',
      action: ''
    }]
  },
  {
    icon: 'cqq',
    type: '合营QQ',
    link: '100983290',
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
    icon: 'cflygram',
    type: '合营Flygram',
    link: 'dybet5',
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
    icon: 'cbat',
    type: '合营蝙蝠ID',
    link: '12830840',
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

<template>
  <div class="customer-service">
    <div class="inner">
      <div class="bg-design"><img src="../../assets/images/login/cus-service.png"></div>
      <div class="title">
        专属客服服务
      </div>
      <div class="subtitle">
        EXCLUSIVE CUSTOMER SERVICE
      </div>
      <div class="bar" />
      <div class="services">
        <div class="contact-boxes">
          <div class="contact-box" v-for="(c, i) in contactlist" :key="i">
            <div class="contacticon"><img :src="require(`../../assets/images/${c.icon}.svg`)"></div>
            <div class="type">{{ c.type }}</div>
            <div class="link">{{ c.link }}</div>
            <div class="buttons">
              <el-button v-for="(btn, btnkey) in c.btns" :key="btnkey" :type="btnkey === 1 ? 'primary' : 'plain'">{{ btn.text }}</el-button>
            </div>
          </div>
        </div>
        <div class="girl"><img src="../../assets/images/login/cus-girl.png"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

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
<style lang="scss">
.customer-service {
    background: url('../../assets/images/login/cus-bg.png');
    width: 100%;
    height: 100vh;
    .inner {
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
        padding: 50px;
        position: relative;
        height: 100%;
    }
    .bg-design {
        position: absolute;
        width: 90%;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        height: 50px;
        z-index: -1;
        img {
            width: 100%;
        }
    }
    .title {
     color: #043860;
     font-size: 50px;
     font-family: PFBold;
    }
    .subtitle {
     color: #7F7F7F;
     margin-top: 20px;
    }
    .bar {
        width: 100%;
        max-width: 600px;
        height: 5px;
        margin-top: 10px;
        background: linear-gradient(90deg, #33B5FF 0%, rgba(26, 173, 255, 0) 101.54%);
    }
    .services {
        display: flex;
        flex-direction: row-reverse;
        margin: 50px auto;
        .girl {
            flex: 1;
            img {
                width: 100%;
            }
        }
        .contact-boxes {
            flex: 2;
            display: flex;
            justify-content: center;
            margin: 20px auto;
            flex-wrap: wrap;
            gap: 20px;
            align-items: center;
            }
            .contact-box {
            box-shadow: 0px -3px 4px 0px #FFFFFF inset;
            box-shadow: 0px 4px 4px 0px #0000000D;
            background: linear-gradient(180deg, #FEFFFF 0%, #DAEEFD 100%);
            font-family: PFBold;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            width: 100%;
            max-width: 200px;
            .type, .link {
                margin: 10px;
            }
            .buttons {
                margin-top: 20px;
            }
            }
    }
}
@media (max-width: 768px) {
  .customer-service {
    .inner {
      padding: 20px;
    }
    height: unset;
    .services {
      flex-direction: column;
    }
  }
}
</style>

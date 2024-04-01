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
            <div class="contacticon"><img style="max-width: 75px;" :src="require(`../../assets/images/${c.icon}.svg`)"></div>
            <div class="type">{{ c.type }}</div>
            <div class="link">{{ c.link }}</div>
            <div class="buttons">
              <el-button @click="copyMessage(i, btn.text, btnkey)" v-for="(btn, btnkey) in c.btns" :key="btnkey" :type="btnkey === 1 ? 'primary' : 'plain'">{{ btn.text }}</el-button>
            </div>
          </div>
        </div>
        <div class="girl"><img v-if="props.siteId === '7'" src="../../assets/images/login/cus-guy.png"><img v-else src="../../assets/images/login/cus-girl.png"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  siteId: {
    type: [String, Number], // Specify the allowed types for the prop
    required: true
  },
});
const mailLink = () => {
  if (props.siteId === '7') {
    return 'mailto:affiliate@e8007.com'
  } else {
    return 'mailto:affiliate@dyvip99.com'
  }
}
const qqLink = () => {
  if (props.siteId === '7') {
    return '1903687863'
  } else {
    return '100983290'
  }
}
const telegramLink = () => {
  if (props.siteId === '7') {
    return '@LH18668'
  } else {
    return 'leihuo123'
  }
}
const contactlist = ref([
  {
    icon: 'cmail',
    type: '合营部电邮',
    link: mailLink(),
    btns: [{
      text: '咨询',
      action: ''
    }]
  },
  {
    icon: 'cqq',
    type: '合营QQ',
    link: qqLink(),
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: 'https://im.qq.com/index/'
    }]
  },
  {
    icon: 'cskype',
    type: '合营部Skype',
    link: 'live:.cid.1b8d9a018a52a8f5',
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: 'https://www.skype.com/zh-Hans/get-skype/'
    }]
  },
  {
    icon: 'ctelegram',
    type: 'Telegram',
    link: telegramLink(),
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: 'https://telegram.org/'
    }]
  },
  {
    icon: 'bubble-logo',
    type: '泡泡',
    link: 'LH10086',
    btns: [{
      text: '复制',
      action: ''
    },
    {
      text: '下载',
      action: 'https://paopaoim.com/index.html'
    }]
  }
])
const copyMessage = (position, text, btnPosition) => {
  console.log(position);
  console.log(text);
  console.log(contactlist.value)
  if (text === '咨询') {
    const mailtoLink = contactlist.value[position].link
    window.open(mailtoLink, '_blank');
  }
  if (text === '复制') {
    let copyText = null;
    copyText = contactlist.value[position].link;
    // Create a temporary textarea element
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = copyText;
    document.body.appendChild(tempTextarea);

    // Select the text and copy it
    tempTextarea.select();
    document.execCommand("copy");

    // Remove the temporary textarea element
    document.body.removeChild(tempTextarea);
    // const copybtntxt = [copybtntxt0, copybtntxt1, copybtntxt2, copybtntxt3];
    contactlist.value[position].btns[btnPosition].text = '已复制'
    // copybtntxt[position].value = "已复制";
    setTimeout(() => {
      contactlist.value[position].btns[btnPosition].text = '复制';
    }, 2000);
  }
  if (text === '下载') {
    const downloadLink = contactlist.value[position].btns[btnPosition].action
    window.open(downloadLink, '_blank');
  }
};
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
            display: flex;
            justify-content: center;
            align-items: center;
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
                margin: 10px auto;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
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

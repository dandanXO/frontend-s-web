<template>
  <div class="customer-service">
    <div class="inner">
      <div class="bg-design"><img src="../../assets/images/login/cus-service.png"></div>
      <div class="title">
        {{ t('common.zhuanshukefufuwu') }}
      </div>
      <div class="subtitle">
        EXCLUSIVE CUSTOMER SERVICE
      </div>
      <div class="bar" />
      <div class="services">
        <div class="contact-boxes" :style="props.siteId === '8' ? 'gap: 50px;': ''">
          <div class="contact-box" v-for="(c, i) in contactlist" :key="i">
            <div class="contacticon"><img v-if="c.icon !== 'czalo'" style="max-width: 67px;" :src="require(`../../assets/images/${c.icon}.svg`)">
              <img v-if="c.icon === 'czalo'" style="max-width: 67px;" :src="require(`../../assets/images/${c.icon}.png`)">
            </div>
            <div class="type">{{ c.type }}</div>
            <div class="link">{{ c.link }}</div>
            <div class="buttons">
              <el-button @click="copyMessage(i, btn.text, btnkey)" v-for="(btn, btnkey) in c.btns" :key="btnkey" :type="btnkey === 1 ? 'primary' : 'plain'">{{ btn.text }}</el-button>
            </div>
          </div>
        </div>
        <div class="girl">
          <img v-if="props.siteId === '7'" src="../../assets/images/login/cus-guy.png">
          <img v-else-if="props.siteId === '8' || props.siteId === '15'" src="../../assets/images/login/cus-girl-vn.png">
          <img v-else src="../../assets/images/login/cus-girl.png"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, defineProps, ref } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  siteId: {
    type: [String, Number], // Specify the allowed types for the prop
    required: true
  },
});
const mailLink = () => {
  if (props.siteId === '7') {
    return 'mailto:affiliate@e8007.com'
  } else if (props.siteId === '8') {
    return 'vnaffiliates@tf88.com'
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
  } else if (props.siteId === '8') {
    return '@dailitf88'
  } else {
    return 'leihuo123'
  }
}
const contactlist = ref()

const initContactList = () => {
  contactlist.value = [
    {
      icon: 'cmail',
      type: t('common.email'),
      link: mailLink(),
      btns: [{
        text: t('common.askus'),
        action: ''
      }]
    },
    {
      icon: 'cqq',
      type: t('common.qq'),
      link: qqLink(),
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://im.qq.com/index/'
      }]
    },
    {
      icon: 'cskype',
      type: t('common.skype'),
      link: 'live:.cid.1b8d9a018a52a8f5',
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://www.skype.com/zh-Hans/get-skype/'
      }]
    },
    {
      icon: 'ctelegram',
      type: 'Telegram',
      link: telegramLink(),
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://telegram.org/'
      }]
    },
    {
      icon: 'bubble-logo',
      type: t('common.paopao'),
      link: 'LH10086',
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://paopaoim.com/index.html'
      }]
    }
  ]
  if (props.siteId === '8') {
    contactlist.value = [
      {
        icon: 'cmail',
        type: t('common.email'),
        link: mailLink(),
        btns: [{
          text: t('common.askus'),
          action: ''
        }]
      },
      {
        icon: 'czalo',
        type: t('common.zalo'),
        link: '+639278280893',
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'http://zaloapp.com/qr/p/1j6eul1u6866m'
        }]
      },
      {
        icon: 'cskype',
        type: t('common.skype'),
        link: 'live:.cid.f284aa8f5c120ae5',
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://www.skype.com/get-skype/'
        }]
      },
      {
        icon: 'ctelegram',
        type: 'Telegram',
        link: telegramLink(),
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://telegram.org/'
        }]
      },
    ]
  }
}
const copyMessage = (position, text, btnPosition) => {
  console.log(position);
  console.log(text);
  console.log(contactlist.value)
  if (text === t('common.askus')) {
    var mailtoLink = contactlist.value[position].link
    if (props.siteId === '8') {
      mailtoLink = 'mailto:' + contactlist.value[position].link
    }
    window.open(mailtoLink, '_blank');
  }
  if (text === t('common.copy')) {
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
    contactlist.value[position].btns[btnPosition].text = t('common.copied');
    // copybtntxt[position].value = "已复制";
    setTimeout(() => {
      contactlist.value[position].btns[btnPosition].text = t('common.copy');
    }, 2000);
  }
  if (text === t('common.download')) {
    const downloadLink = contactlist.value[position].btns[btnPosition].action
    window.open(downloadLink, '_blank');
  }
};

onMounted(() => {
  initContactList();
})

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
            max-width: 235px;
            .type, .link {
                margin: 10px auto;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }
            .buttons {
                margin-top: 20px;
              white-space: nowrap;
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

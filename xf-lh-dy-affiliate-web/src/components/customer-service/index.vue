<template>
  <div
    class="customer-service"
    id="div-customer-service"
    :class="{
      kaka: props.siteId === '15'
    }"
  >
    <div class="inner">
      <div class="bg-design">
        <img v-if="props.siteId === '15'" src="../../assets/images/kaka/cus-service-kaka.png">
        <img v-else src="../../assets/images/login/cus-service.png">
      </div>
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
            <div class="contacticon">
              <img v-if="c.icon === 'czalo'" style="max-width: 67px;" :src="require(`../../assets/images/${c.icon}.png`)">
              <img v-else-if="c.icon === 'sigua'" style="max-width: 67px;" :src="require(`../../assets/images/${c.icon}.png`)">
              <img v-else style="max-width: 67px;" :src="require(`../../assets/images/${c.icon}.svg`)">
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
          <img v-else src="../../assets/images/login/cus-girl.png">
          <!--          <div v-if="props.siteId === '15'" class="kaka-cs-24">-->
          <!--            <img src="../../assets/images/kaka/cs-24-kaka.svg">-->
          <!--            <p>-->
          <!--              {{ $t('common.24.line1') }}-->
          <!--              <br>-->
          <!--              <br>-->
          <!--              {{ $t('common.24.line2') }}-->
          <!--            </p>-->
          <!--          </div>-->
        </div>
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
const skypeLink = () => {
  if (props.siteId === '6') {
    return 'live:.cid.1b8d9a018a52a8f5'
  } else if (props.siteId === '1') {
    return 'live:.cid.178f76828f54342e'
  } else if (props.siteId === '7') {
    return 'live:.cid.8099acb97a5ea41'
  } else {
    return 'live:.cid.1a1ab9b6b5b0721f'
  }
}
const loofahLink = () => {
  if (props.siteId === '7') {
    return 'Lh16816808'
  } else if (props.siteId === '1') {
    return 'xfdlk001'
  }
}
const bubbleLink = () => {
  if (props.siteId === '6') {
    return 'LH1008666'
  } else if (props.siteId === '1') {
    return 'xfdlkf001'
  } else {
    return 'Lh16816808'
  }
}

const amicoLink = () => {
  if (props.siteId === '6') {
    return 'vip777'
  } else if (props.siteId === '1') {
    return 'vip444'
  } else {
    return 'vip333'
  }
}

const mailLink = () => {
  if (props.siteId === '7') {
    return 'mailto:affiliate@e8007.com'
  } else if (props.siteId === '8') {
    return 'vnaffiliates@tf88.com'
  } else if (props.siteId === '1') {
    return ''
  } else {
    return 'mailto:affiliate@dyvip99.com'
  }
}
const qqLink = () => {
  if (props.siteId === '7') {
    return '2115894008'
  } else if (props.siteId === '1') {
    return '1600337511'
  } else if (props.siteId === '6') {
    return '1827985941'
  } else {
    return '100983290'
  }
}
const telegramLink = () => {
  if (props.siteId === '7') {
    return '@leihuo686'
  } else if (props.siteId === '15') {
    return '@dailykakagame'
  } else if (props.siteId === '8') {
    return '@dailitf88'
  } else if (props.siteId === '1') {
    return '@xf100200'
  } else if (props.siteId === '6') {
    return '@dyghs_01'
  } else {
    return '@leihuo123'
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
      icon: 'cteams',
      type: t('common.teams'),
      link: skypeLink(),
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://www.microsoft.com/en-sg/microsoft-teams/download-app'
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
      link: bubbleLink(),
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
        icon: 'cteams',
        type: t('common.teams'),
        link: 'live:.cid.f284aa8f5c120ae5',
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://www.microsoft.com/en-sg/microsoft-teams/download-app'
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
  if (props.siteId === '15') {
    contactlist.value = [
      {
        icon: 'cflygram-kaka',
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
      }
    ]
  }
  if (props.siteId === '7') {
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
        icon: 'cteams',
        type: t('common.teams'),
        link: skypeLink(),
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://www.microsoft.com/en-sg/microsoft-teams/download-app'
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
        icon: 'sigua',
        type: t('common.loofah'),
        link: loofahLink(),
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://ya.cn/index.html'
        }]
      }
    ]
  }
  if (props.siteId === '1') {
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
        icon: 'cteams',
        type: t('common.teams'),
        link: skypeLink(),
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://www.microsoft.com/en-sg/microsoft-teams/download-app'
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
        icon: 'sigua',
        type: t('common.loofah'),
        link: loofahLink(),
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://ya.cn/index.html'
        }]
      }
    ]
  }
  // 上面 if 各自有的客服管道
  // 下面兩個 if 是大家固定要刪除或新增的 就不動
  if (props.siteId === '6' || props.siteId === '1' || props.siteId === '7') {
    contactlist.value.shift()
  }
  if (props.siteId === '6' || props.siteId === '1' || props.siteId === '7') {
    contactlist.value.push({
      icon: 'amico-logo',
      type: "AMICO",
      link: amicoLink(),
      btns: [{
        text: t('common.copy'),
        action: ''
      },
      {
        text: t('common.download'),
        action: 'https://am35.cc/'
      }]
    })
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
    &.kaka {
      background: url('../../assets/images/kaka/cus-bg-kaka.png') no-repeat center 33%;
      background-color: #1E212C;

      .el-button--primary {
        --el-button-background-color: #FF4545;
        --el-button-border-color: #FF4545;
        &:hover,
        &:active {
          border-color: var(--el-button-border-color);
          background-color: var(--el-button-background-color);
          filter: brightness(1.2);
        }
      }
      .el-button--plain {
        --el-button-background-color: transparent;
        --el-button-border-color: #FF4545;
        --el-button-font-color: #FF4545;
        &:hover,
        &:active {
          --el-color-primary: #FF4545;
          border-color: var(--el-button-border-color);
          background-color: #FDF4F4;
        }
      }
      .bar {
        background: linear-gradient(90deg, #FF3333 0%, rgba(255, 26, 26, 0) 101.54%);
      }
      .inner {
        .title {
          color: #fff;
        }
        .bg-design {
          z-index: 0;
        }
        .services {
          z-index: 1;
          position: relative;

          .contact-box {
            background: linear-gradient(180deg, #FEFFFF 0%, #FDDADA 100%);
            box-shadow: 0px -3px 4px 0px #FFFFFF inset, 0px 4px 4px 0px #0000000D;
          }
          .girl {
            position: relative;
            .kaka-cs-24 {
              display: flex;
              align-items: center;
              gap: 17px;
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              background-color: #fff;
              border-radius: 22px;
              padding: 16px 20px;
              img {
                width: 86px;
              }
              p {
                font-size: 16px;
                font-style: italic;
                font-weight: 900;
                line-height: 19.36px;
              }
            }
          }
        }

      }
    }
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

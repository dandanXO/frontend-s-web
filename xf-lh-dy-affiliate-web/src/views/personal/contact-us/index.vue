<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <div class="role-span">{{ route.name }}</div>
      <div class="contact-boxes" :style="siteId === '8' || siteId === 8 ? 'gap: 90px;': ''">
        <div class="contact-box" :style="siteId ==='8' || siteId === 8 ? 'max-width: 400px;' : ''" v-for="(c, i) in contactlist" :key="i">
          <div class="contacticon">
            <img v-if="c.icon === 'czalo'" style="max-width: 67px;" :src="require(`../../../assets/images/${c.icon}.png`)">
            <img v-else-if="c.icon === 'whatsapp'" style="max-width: 67px;" :src="require(`../../../assets/images/${c.icon}.png`)">
            <img v-else style="max-width: 67px;" :src="require(`../../../assets/images/${c.icon}.svg`)">
          </div>
          <div class="type">{{ c.type }}</div>
          <div class="link">{{ c.link }}</div>
          <div class="buttons">
            <el-button @click="copyMessage(i, btn.text, btnkey)" v-for="(btn, btnkey) in c.btns" :key="btnkey" :type="btnkey === 1 ? 'primary' : 'plain'">{{ btn.text }}</el-button>
          </div>
        </div>
      </div>
      <LhFeedback v-if="siteId === '7'" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from "pinia";
import { useI18n } from 'vue-i18n'
import { useStore } from "@/store"
import { useRoute } from 'vue-router'

import { i18nStore } from "@/store/language";
import LhFeedback from '../../../components/customer-service/lh-feedback.vue';

const store = useStore();
const route = useRoute()
const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);
const { t } = useI18n()

const siteId = store.state.user.siteId;
const mailLink = () => {
  if (siteId === '7' || siteId === 7) {
    return 'mailto:affiliate@e8007.com'
  } else if (siteId === '8' || siteId === 8) {
    return 'vnaffiliates@tf88.com'
  } else {
    return 'mailto:affiliate@dyvip99.com'
  }
}
const qqLink = () => {
  if (siteId === '7' || siteId === 7) {
    return '1903687863'
  } else {
    return '100983290'
  }
}
const telegramLink = () => {
  if (siteId === '7' || siteId === 7) {
    return '@LH18668'
  } else if (siteId === '8' || siteId === 8) {
    return '@dailitf88'
  } else if (siteId === '10' || siteId === 10) {
    return '@city88888'
  } else {
    return 'leihuo123'
  }
}
const contactlist = ref()

const copyMessage = (position, text, btnPosition) => {
  console.log(position);
  console.log(text);
  console.log(contactlist.value)
  if (text === t('common.askus')) {
    var mailtoLink = contactlist.value[position].link
    if (siteId === '8' || siteId === 8) {
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
      link: 'live:.cid.1a1ab9b6b5b0721f',
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
      link: 'LH1008666',
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
  if (siteId === '8' || siteId === 8) {
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
        icon: 'whatsapp',
        type: t('common.whatsapp'),
        link: '+855975762995',
        btns: [{
          text: t('common.copy'),
          action: ''
        },
        {
          text: t('common.download'),
          action: 'https://wa.me/qr/AZRPLDZZ23DWO1'
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
  if (siteId === '10' || siteId === 10) {
    contactlist.value = [
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

watch(languageVal, () => {
  initContactList();
})

onMounted(() => {
  initContactList();
})

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

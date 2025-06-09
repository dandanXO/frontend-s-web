<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Share</span>
    </div>

    <div class="share-wrapper">
      <div class="sharing-container">
        <div class="qr-container">
          <VueQRCodeComponent size="150" :text="referralLink" />
          <!-- <qr-code :text="referralLink" error-level="L"></qr-code> -->
          <!-- <img src="../../assets/images/account/share/qr_code.png" /> -->
        </div>
        <div class="right-container">
          <div class="share-content">
            Get Daily Bonus The bonus has no expiration date. It's as simple as sharing a QR. Code or link to friends
            Get bonuses when friends register or download.
          </div>
          <div class="share-link-wrapper">
            <q-input style="width: 100%" filled color="white" ref="copyinput" v-model="referralLink" @blur="blurCode" />
            <q-btn color="brand" class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
              {{ copybtntxt }}
            </q-btn>
          </div>
        </div>
      </div>
      <div class="otherlinks">
        <span class="note">Note: Your Invite Bonus has not been shared</span>

        <div class="links"></div>
      </div>
    </div>
    <div>
      <!-- <div class="account-title-container">
         <span class="account-title">Reference</span>
       </div>
       <div class="account-content last">
         <div class="preferred">
           <div class="account-tip-text query-tip">
             <RiSpamLine /> Question of the Month
           </div>
           <div class="txt-center">
             <a-date-picker
               v-model:value="searchForm.date"
               :inputReadOnly="true"
             />
           </div>
         </div>
         <div class="share-tab-wrapper">
           <a-table :columns="columns" />
         </div>
       </div> -->
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import moment from 'moment'
import { api } from "boot/axios";
import VueQRCodeComponent from 'vue-qrcode-component'
export default defineComponent({
  name: "ShareView",
  setup() {
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const copybtntxt = ref("Copy");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = 'Copied'
    };
    const blurCode = () => {
      copybtntxt.value = 'Copy'
    };
    // const columns = [
    //   {
    //     title: "ชื่อ",
    //     dataIndex: "name",
    //     key: "name",
    //   },
    //   {
    //     title: "ฝาก",
    //     dataIndex: "deposit",
    //     key: "deposit",
    //   },
    // ];
    const getReferral = () => {
      api.get('/session/member/referralCode').then((res) => {
        if(res.code === 0) {
          referralLink.value = `https://mph.jolly88.com/refer/${res.data}`;
        }
      }).catch((err) => {

      })
    };
    onMounted(() => {
      getReferral()
    })
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent
    };
  },
});
</script>

<style scoped lang="scss">
.share-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  width: 90%;
  margin: 0 auto;
  gap: 20px;
  .sharing-container {
    flex-direction: column;
    box-shadow: 0px 0px 20px 1px #10101c;
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    flex: 2;

    .qr-container {
      background: #ffffff;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 120px;
        margin: 0 auto;
      }
    }
    .right-container {
      background: #212534;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      .share-content {
        padding: 10px 30px;
      }
      .share-link-wrapper {
        padding: 10px 30px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 20px;
        input {
          width: 100%;
          border: none;
          background-color: #2b2b4b;
          padding: 10px;
        }
      }
    }
  }
  .otherlinks {
    display: flex;
    gap: 10px;
    flex-direction: column;
    .links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      svg {
        width: 30px;
        fill: #ffffff;
      }
    }
    .note {
      font-size: 12px;
    }
  }
}
.preferred {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .share-wrapper {
    flex-direction: column;
    margin-bottom: 50px;
    align-items: center;
    .sharing-container {
      flex-direction: column;
      .share-link-wrapper {
        flex-direction: column;
      }
    }
  }
}
</style>

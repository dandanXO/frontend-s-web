<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">分享</span>
    </div>

    <div class="share-wrapper">
      <div class="sharing-container">
        <div class="qr-container">
          <VueQRCodeComponent :size="150" :text="referralLink" />
          <!-- <qr-code :text="referralLink" error-level="L"></qr-code> -->
          <!-- <img src="../../assets/images/account/share/qr_code.png" /> -->
        </div>
        <div class="right-container">
          <div class="share-content">
            每天领取奖金，奖金没有过期日期，只需将 QR 码或链接分享给朋友即可。当朋友注册或下载后，您将立即获得奖金。
          </div>
          <div class="share-link-wrapper">
            <input @blur="blurCode" ref="copyinput" v-model="referralLink" />
            <button
                class="common-btn copy-btn"
                @blur="blurCode"
                @click="copyCode"
            >
              {{ copybtntxt }}
            </button>
          </div>
        </div>
      </div>
<!--      <div class="otherlinks">-->
<!--        <span class="note">备注：您的邀请奖励还未被分享。</span>-->

<!--        <div class="links">-->
<!--          <RiFacebookCircleLine /><RiWhatsappLine />-->
<!--          <RiTelegramLine /><RiTwitterLine />-->
<!--          <RiInstagramLine />-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div>
      <!-- <div class="account-title-container">
        <span class="account-title">ข้อมูลอ้างอิง</span>
      </div>
      <div class="account-content last">
        <div class="preferred">
          <div class="account-tip-text query-tip">
            <RiSpamLine /> คำถามประจำเดือน
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
import { getReferralLink } from "@/api/personal/share"
import { RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine
} from "vue-remix-icons"
import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
export default defineComponent({
  name: "ShareView",
  components: {
    RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine, VueQRCodeComponent
  },
  setup() {
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const copybtntxt = ref("คัดลอก");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = '复制'
    };
    const blurCode = () => {
      copybtntxt.value = '复制'
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
      getReferralLink().then((res) => {
        if(res.code === 0) {
          referralLink.value = `https://xf123.com/refer/${res.data}`;
        }
      }).catch((err) => {
        console.log(err)
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
.account-container {
  .account-content-wrapper {
    .share-wrapper {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #ffffff;
      gap: 20px;
      .sharing-container {
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
          background: #1d222e;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          padding: 30px;
          .share-content {
            // padding: 10px 30px;
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
              background-color: #2c444f;
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
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .account-container {
    .account-content-wrapper {
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
  }
}
</style>

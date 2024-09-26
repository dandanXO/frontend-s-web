<template>
  <div>
    <div class="menu-title-container">
      <span class="menu-title">Share</span>
    </div>

    <div class="share-wrapper">
      <div class="sharing-container">
        <div class="qr-container">
          <VueQRCodeComponent :size="100" :text="referralLink" />
          <!-- <qr-code :text="referralLink" error-level="L"></qr-code> -->
          <!-- <img src="../../assets/images/account/share/qr_code.png" /> -->
        </div>
        <div class="right-container">
          <div class="share-content">
            Share the QR code or link with your friends. Once they register or download the APP. you will get bonus
            amount every day. this bonus works for the lifetime
          </div>
        </div>
      </div>
      <div class="share-link-wrapper">
        <input ref="copyinput" v-model="referralLink" @blur="blurCode" />
        <button class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
          {{ copybtntxt }}
        </button>
      </div>
      <div class="otherlinks">
        <span class="note">Note: Your referral bonus will not be shared</span>

        <div class="links">
          <RiFacebookCircleLine />
          <RiWhatsappLine />
          <RiTelegramLine />
          <RiTwitterLine />
          <RiInstagramLine />
        </div>
      </div>

      <div class="friendlist-container">
        <div class="title">Friend List</div>
        
        <table class="friendlist-table" style="border-collapse: collapse;" border="1">
          <tr>
            <td>Login Name</td>
            <td>Registered At</td>
            <td>Deposit Amount</td>
          </tr>
          <tr v-for="(friend, friendIndex) in friendList" :key="`friend-${friendIndex}`">
            <td>{{ friend.loginName }}</td>
            <td>{{ friend.regTime }}</td>
            <td>{{ friend.depositAmount ?? '-' }}</td>
          </tr>
        </table>
      </div>
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
import { getReferralLink, getFriendList } from "@/api/personal/share"
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
    const friendList = ref([]);
    const referralLink = ref('');
    const copybtntxt = ref("Copy");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = 'Copied!'
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
      getReferralLink().then((res) => {
        if(res.code === 0) {
          referralLink.value = `${location.origin}/refer/${res.data}`;
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    const initFriendList = () => {
      getFriendList().then((res) => {
        if(res.code === 0) {
          friendList.value = res.data.records
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    onMounted(() => {
      getReferral()
      initFriendList();
    })
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent,
      friendList
    };
  },
});
</script>

<style scoped lang="scss">
.dark-theme {
  .account-container {
    .account-content-wrapper {
      .share-wrapper {
        .share-link-wrapper {
          border: 1px solid #48a7ff29;
          background: #ffffff0f;
        }

        .friendlist-container {
          .friendlist-table {
            background: #ffffff0f;
          }
        }
      }
    }
  }
}
.account-container {
  .account-content-wrapper {
    .share-wrapper {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      gap: 20px;
      .sharing-container {
        // box-shadow: 0px 0px 20px 1px #10101c;
        width: 100%;
        margin: 10px auto;
        display: flex;
        justify-content: center;
        border-radius: 12px;
        overflow: hidden;
        flex: 2;

        .qr-container {
          background: #ffffff05;

          padding: 10px;
          border-radius: 12px;
          border: 1px solid #48a7ff29;
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
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .share-content {
            padding: 10px 30px;
          }
        }
      }
      .share-link-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1em;
        border-radius: 12px;

        input {
          width: 100%;
          border: 0;
          padding-inline: 0.7em;
          background: transparent;
          flex: 8;
        }
        .common-btn {
          flex: 1;
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
            fill: #4832e5;
          }
        }
        .note {
          font-size: 12px;
        }
      }

      .friendlist-container {
        padding: 0 30px 10px;
        position: relative;
        width: 100%;

        .title {
          color: #9d9d9d;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .friendlist-table {
          width: auto !important;
          overflow: auto;
          display: inline-block;
          margin-block: 2rem;
          border: 1px solid #eaeaea;
          background: #ffffff;
          border-radius: 12px;
          color: #83a3ca;

          td,
          th {
            padding: 10px;
            &:first-child {
              border-left: 0 !important;
            }
            &:last-child {
              border-right: 0 !important;
            }
          }

          th {
            background: #ecf5ff;
            color: #2b2b82;
          }
          tr:first-child {
            td,
            th {
              border-top: 0 !important;
            }
            td {
              background: #ecf5ff;
              color: #2b2b82;
              font-family: "Poppins Bold";
              text-align: center;
            }
            td:first-child {
              border-radius: 12px 0 0 0;
            }
          }

          tr:last-child {
            td,
            th {
              border-bottom: 0 !important;
            }
          }
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
@media (max-width: 767px) {
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

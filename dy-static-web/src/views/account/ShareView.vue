<template>
  <div>
    <div class="share-title-container">
      <span class="share-title">推广分享</span>
    </div>

    <div class="sharing-content">
      <p>
        您通过推广链接邀请的用户注册并存款，您将获得最高累计
        <span class="prize-span">2,000</span>
        元的奖励。
        <span class="link" @click="router.push('/privilege/invite')">活动详情</span>
      </p>
    </div>

    <hr class="divider-style" />

    <div class="share-title-container">
      <span class="share-title">推广链接</span>

      <div class="sharing-content">
        <div class="right-container">
          <div class="share-link-wrapper">
            <input @blur="blurCode" ref="copyinput" v-model="referralLink" />
            <el-button class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
              {{ copybtntxt }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <hr class="divider-style" />

    <div class="share-title-container">
      <span class="share-title">推广二维码</span>

      <div class="sharing-content">
        <div class="right-container">
          <div class="share-link-wrapper">
            <VueQRCodeComponent :size="150" :text="referralLink" />
          </div>

          <div class="share-info-div">
            <div class="share-info-box">
              <!-- <i class="remixicon-user-3-fill"></i> -->
              <el-icon><UserFilled /></el-icon>
              <span>累计注册</span>
              <div class="total-info-div">
                <span class="total-span" id="total-signup-no">{{ referredMember }}</span>
                人
              </div>
            </div>

            <div class="share-info-box">
              <!-- <i class="remixicon-money-cny-circle-fill money-sign"></i> -->
              <el-icon><Money /></el-icon>
              <span>累计充值</span>
              <div class="total-info-div">
                <span class="total-span" id="total-topup-no">{{ depositMember }}</span>
                人
              </div>
            </div>
          </div>
        </div>
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
import { getReferralLink, getInviteFriendListCount } from "@/api/personal/share"
import { RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine,
} from "vue-remix-icons"
import { UserFilled, Money } from "@element-plus/icons-vue";
import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
import {useRouter} from "vue-router";

export default defineComponent({
  name: "ShareView",
  components: {
    RiFacebookCircleLine, RiWhatsappLine, RiTelegramLine, RiTwitterLine, RiInstagramLine, VueQRCodeComponent, UserFilled, Money
  },
  setup() {
    const router = useRouter()
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const referredMember = ref(0);
    const depositMember = ref(0);
    const copybtntxt = ref("复制");
    const copyinput = ref(null);
    const copyCode = () => {
      const copyText = copyinput.value
      copyText.select()
      document.execCommand("copy")
      copybtntxt.value = '已复制'
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
          referralLink.value = 'https://' + location.hostname + `/refer/${res.data}`;
        }
      }).catch((err) => {
        console.log(err)
      })
    };

    const getInviteCount = () => {
      getInviteFriendListCount().then((res) => {
        if(res.code === 0) {
          referredMember.value = res.data.referredMember;
          depositMember.value = res.data.depositMember;
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    onMounted(() => {
      getReferral()
      getInviteCount()
    })
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent,
      router,
      referredMember,
      depositMember
    };
  },
});
</script>

<style scoped lang="scss">
.account-container {
  .account-content-wrapper {
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
      // background: #34cfe5;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #000000;
      // padding: 10px;
      // background: #ebebeb;
      .share-content {
        // padding: 10px 30px;
      }
      .share-link-wrapper {
        // padding: 10px 30px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        // width: calc(100% - 30px);
        gap: 20px;
        input {
          // width: 100%;
          width: 400px;
          border: none;
          border: 1px solid #c7c7c7;
          padding: 10px;
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

.share-title-container {
  display: flex;
  gap: 20px;
  // align-items: center;

  .share-title {
    font-size: 18px;
    min-width: 110px;
  }
}

.sharing-content {
  // padding: 10px 0;

  span.prize-span {
    color: #32afda;
    font-size: 20px;
  }

  span.link {
    color: #32afda;
    cursor: pointer;
  }
}

.divider-style {
  margin-top: 30px;
  margin-bottom: 30px;
}

.share-info-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 22px;
  gap: 15px;

  .el-icon {
    border-radius: 50%;
    width: 70px;
    min-height: 70px;
    background: #466aeb;
    color: #638bf0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;

    svg {
      font-size: 40px;
      color: #638bf0;
    }
  }
}

.share-info-box {
  width: 140px;
  height: 80px;
  background-image: linear-gradient(-37deg, #597ceb 0, #83bcfe 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
  padding-bottom: 10px;
  padding-left: 14px;
  padding-top: 6px;
}

.total-info-div {
  font-size: 14px;
  color: #fff;
}

.share-info-box > span {
  position: absolute;
  top: 14px;
  z-index: 3;
  color: #fff;
  font-size: 18px;
}
.share-info-box .total-span {
  font-size: 24px;
  color: #fff;
  padding-right: 4px;
  font-weight: 700;
}
</style>

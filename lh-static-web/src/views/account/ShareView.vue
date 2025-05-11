<template>
  <div class="share-container">
    <div class="share-content left">
      <div class="desc">
        <div class="form-field">
          <div class="label label-grad">推广分享</div>
        </div>
        <p style="margin: 1em 0px">
          您通过推广链接邀请的用户注册并存款，您将获得最高累计
          <span class="number">2,000</span>
          元的奖励。
          <router-link to="/privilege/invite">活动详情</router-link>
        </p>
      </div>
      <hr class="divider-style" />

      <div class="form-field share-input">
        <div class="label">推广链接</div>

        <div class="content">
          <input class="referral-link-input" @blur="blurCode" ref="copyinput" v-model="referralLink" />
          <el-button class="common-btn copy-btn" @blur="blurCode" @click="copyCode('refer')">
            {{ copybtntxt }}
          </el-button>
        </div>
      </div>

      <hr class="divider-style" />

      <div class="form-field qr-bg">
        <div class="label qrtitle">推广二维码</div>

        <VueQRCodeComponent :size="180" :text="referralLink" />
        <div class="content">
          <div class="qr-code-and-stats-wrapper">
            <div class="share-info-div">
              <div class="share-info-box">
                <span class="label">累计注册</span>
                <div class="total-info-div">
                  <span class="total-span" id="total-signup-no">{{ referredMember }}</span>
                  人
                </div>
              </div>

              <div class="share-info-box">
                <span class="label">累计充值</span>
                <div class="total-info-div">
                  <span class="total-span" id="total-topup-no">{{ depositMember }}</span>
                  人
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="share-content right">
      <div class="desc">
        <div class="form-field">
          <div class="label label-grad">唤醒分享</div>
        </div>
        <p style="margin: 1em 0px">
          您通过唤醒链接激活的老用户存款，双方都可获得不限量彩金。
          <router-link to="/promotion?name=lh1-summon-event">活动详情</router-link>
        </p>
      </div>
      <hr class="divider-style" />

      <div class="form-field share-input">
        <div class="label">唤醒链接</div>

        <div class="content">
          <input class="referral-link-input" @blur="blurCode" ref="copyinput2" v-model="summonerLink" />
          <el-button class="common-btn copy-btn" @blur="blurCode" @click="copyCode('summon')">
            {{ copybtntxt2 }}
          </el-button>
        </div>
      </div>

      <hr class="divider-style" />

      <div class="form-field qr-bg">
        <div class="label qrtitle">唤醒二维码</div>

        <VueQRCodeComponent :size="180" :text="summonerLink" />
        <div class="content">
          <div class="qr-code-and-stats-wrapper">
            <div class="share-info-div">
              <div class="share-info-box">
                <span class="label">成功唤醒</span>
                <div class="total-info-div">
                  <span class="total-span" id="total-topup-no">{{ summonMember }}</span>
                  人
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { getReferralLink, getInviteFriendListCount, getSummonListCount } from "@/api/personal/share"
import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
import { useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";
import { userStore } from "@/store";

export default defineComponent({
  name: "ShareView",
  components: {
    VueQRCodeComponent
  },
  setup() {
    const notify = useNotify();
    const store= userStore();
    const router = useRouter()
    const searchForm = reactive({
      date: moment('2022-03-03', 'YYYY-MM-DD'),
    });
    const referralLink = ref('');
    const summonerLink = ref('');
    const referredMember = ref(0);
    const depositMember = ref(0);
    const summonMember = ref(0);
    const copybtntxt = ref("复制");
    const copybtntxt2 = ref("复制");
    const copyinput = ref(null);
    const copyinput2 = ref(null);
    const copyCode = (val) => {
      if (val === 'refer') {
        const copyText = copyinput.value
        copyText.select()
        document.execCommand("copy")
        copybtntxt.value = '已复制'
      } else if (val === 'summon') {

        const copyText2 = copyinput2.value
        copyText2.select()
        document.execCommand("copy")
        copybtntxt2.value = '已复制'
      }
    };
    const blurCode = () => {
      copybtntxt.value = '复制'
      copybtntxt2.value = '复制'
    };

    const getReferral = () => {
      getReferralLink().then((res) => {
        if (res.code === 0) {
          referralLink.value = 'https://' + location.hostname + `/refer/${res.data}`;
          summonerLink.value = 'https://' + location.hostname + `/summon/${res.data}`;
        } else {
          notify.error(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    };

    const getInviteCount = () => {
      getInviteFriendListCount().then((res) => {
        if (res.code === 0) {
          referredMember.value = res.data.referredMember;
          depositMember.value = res.data.depositMember;
        } else {
          notify.error(res.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    };
    const getSummonCount = () => {
      getSummonListCount().then((res) => {
        if (res.code === 0) {
          summonMember.value = res.data
        } else {
          notify.error(res.message)
        }
      })
    }
    onMounted(() => {
      getReferral()
      getInviteCount()
      getSummonCount()
    })
    return {
      searchForm,
      copybtntxt,
      copyinput,
      copybtntxt2,
      copyinput2,
      copyCode,
      blurCode,
      referralLink,
      VueQRCodeComponent,
      router,
      referredMember,
      depositMember,
      summonMember,
      summonerLink,
      store
    };
  },
});
</script>

<style scoped lang="scss">
.share-container {
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(206, 223, 227, 0.25);
  border-radius: 15px;
  padding: 20px 40px;
  height: 100%;
  display: flex;
  .share-content {
    width: 100%;
    .desc {
      height: 90px;
      padding: 0 10px;
      p {
        width: 60%;
        .number {
          color: #4c88f8;
          font-family: Microsoft YaHei;
          font-size: 16px;
          font-weight: 700;
          line-height: 21.12px;
          letter-spacing: 0.07em;
          text-align: left;
        }
      }
    }
    &.left {
      .desc {
        border-right: 1px solid #ecedf0;
      }
      .form-field {
        &.share-input {
          border-right: 1px solid #ecedf0;
        }
      }
    }
  }

  .form-field {
    display: flex;
    align-items: center;
    position: relative;
    &.share-input {
      padding: 0 10px;
      .label {
        min-width: 110px;
      }
    }
    &.qr-bg {
      background: url(../../assets/images/account/qrbg.png) no-repeat center center;
      flex-direction: column;
      height: 500px;
      padding: 20px;
      justify-content: space-between;
      .label {
        color: #ffffff;
        &.qrtitle {
          text-shadow: 2px 2px 10px #000000;
          font-size: 30px;
        }
      }
    }
    .label {
      display: flex;
      gap: 20px;
      font-size: 18px;
      &.label-grad {
        font-family: "PingFang SC";
        font-weight: 600;
        background: linear-gradient(180deg, #488aee 0%, #4768eb 100%);

        -webkit-background-clip: text;
        -moz-background-clip: text;
        background-clip: text;

        color: transparent;

        -webkit-text-fill-color: transparent;
      }
    }

    .content {
      display: flex;
      gap: 20px;

      input.referral-link-input {
        height: 100%;
        width: 400px;
        border: none;
        border: 1px solid #c7c7c7;
        padding: 15px 20px;
        box-shadow: 0px 0px 7.31px 0px #a9c9ea inset;
        background: #f7f8fb;
        color: #3f8cff;
        border-radius: 10px;
      }

      .qr-code-and-stats-wrapper {
        display: flex;
        flex-direction: column;
      }
    }
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
  gap: 30px;

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
  width: 155px;
  height: 100px;
  background: linear-gradient(180deg, #518bf7 0%, #64acff 100%);
  background-blend-mode: normal, normal;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;

  .total-info-div {
    font-size: 14px;
    color: #fff;
  }

  .label {
    position: absolute;
    top: 14px;
    z-index: 3;
    color: #fff;
    font-size: 18px;
  }

  .total-span {
    font-size: 24px;
    color: #fff;
    padding-right: 4px;
    font-weight: 700;
  }
}

.copy-btn {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  border-radius: 30px;
  position: absolute;
  right: 22px;
  height: 30px;
  width: 80px;
  top: 8px;
}

.dark {
  .share-container {
    @include content-block-dark;
    background: #17223E;

    .share-info-box {
      background: url(../../assets/images/account/share-info-box.png) no-repeat center center;
      background-size: 155px 85px;
    }

    .share-content {
      .form-field {
        &.qr-bg {
          background: url(../../assets/images/account/qrbg-dark.png) no-repeat center center;
          background-size: 438px 484px;
        }
      }
      .desc {
        .form-field {
          .label {
            background: none;
            color: $color-white;
            -webkit-text-fill-color: unset;
          }
        }
      }

      p {
        color: $font-3-dark;
        .number {
          color: $active-color-dark;
        }
      }

      .share-input {
        .label {
          color: $color-white;
        }
      }
    }

    .form-field {
      .content {
        input.referral-link-input {
          box-shadow: none;
          background-color: $background-content-block-lighter-dark;
          border: none;
          color: $active-color-dark;
        }
      }
    }
  }

  .copy-btn {
    background: url('../../assets/images/home/standard-button-bg.svg') no-repeat center center;
    background-size: auto;
    box-shadow: none;
    border-radius: 8px;
    padding: 12px 20px;
  }

  .qrtitle {
    font-weight: bold;
  }
}
</style>

<template>
  <q-page>
    <div class="profile">
      <div class="left">
        <div class="avatar" @click="updateProfilePhoto">
          <img v-if="!store.profilePhoto" src="../assets/images/account/avatar.png" />
          <img
            v-if="store.profilePhoto && store.profilePhoto.includes('default')"
            :src="require(`../assets/images/profile/${store.profilePhoto}.png`)"
          />
          <img
            v-if="store.profilePhoto && !store.profilePhoto.includes('default')"
            :src="imageDir + store.profilePhoto + '?v=' + timestamp"
          />
        </div>
        <div class="pro-details">
          <span class="nickname-span">{{ store.nickName }}</span>

          <!-- <span class="join-span">加入雷火电竞第一天</span> -->
          <!--          <span v-if="appVersionNo">版本：{{ appVersionNo }}</span>-->
        </div>
      </div>
      <!-- <div class="right">
        <div class="custom-service" @click="handleClickCustomService">
          <img src="../assets/images/account/custom-service.png" alt="" />
          <span>专属客服</span>
        </div>
      </div> -->
    </div>

    <div class="vipcard">
      <q-card-section class="top-section">
        <!-- <div class="name">{{ header }}</div> -->
        <q-card-section class="acct-section">
          <div class="left-sect">
            <div class="label">
              <!-- <img
                v-if="$q.dark.isActive"
                src="../assets/images/account/account-wallet-icon-dark.png"
                style="display: none"
              /> -->
              <img src="../assets/images/account/account-wallet-icon.png" />
              <span>中心钱包</span>
              <div class="refresh-btn" @click="getBalance">
                <img src="../assets/images/account/account-refresh-btn.png" />
              </div>
            </div>
            <div class="amt">
              {{ !isLoadingBalance ? "¥" + mainWallet : "加载中..." }}
            </div>
          </div>
          <div class="right-sect">
            <q-btn label="存款" class="btn-main btn-pointer deposit-btn" style="" @click="openDeposit" />

            <q-btn label="提款" class="btn-main btn-pointer" style="" @click="openWithdraw" />

            <q-btn label="转账" class="btn-main btn-pointer" style="" @click="openTransfer" />
          </div>
        </q-card-section>
        <hr v-if="$q.dark.isActive" style="width: 100%; border: 1px solid #3b5385; margin: 5px 0 15px 0" />
        <q-card-section class="acct-btm-section">
          <div class="vip-level-detail">
            <div class="vip-link">{{ store.vip }}</div>

            <div class="vip-progress">
              <q-linear-progress size="10px" :value="store.vipProgress" />
            </div>

            <div class="vip-link">{{ updatedVip() }}</div>
          </div>
          <div class="vip-info-div">
            <!-- <div class="vip-left">
              VIP等级：
              <div class="vip-level">
                {{ store.vip }}
              </div>
            </div> -->

            <div class="vip-txt-left" :class="isHideLevelUp && 'opacity-0'">
              <div>晋级流水（元）</div>
              <div v-if="store.currentBetAmt !== ''">
                <div v-if="store.currentBetAmt <= store.currentUpgradeBetAmt">
                  {{ formatNumber(store.currentBetAmt) }}/{{ formatNumber(store.currentUpgradeBetAmt) }}
                </div>
                <div v-else>
                  {{ formatNumber(store.currentUpgradeBetAmt) }}/{{ formatNumber(store.currentUpgradeBetAmt) }}
                </div>
              </div>
              <div v-else>计算中...</div>
            </div>

            <router-link to="/account/vip?from=account">
              <div class="vip-right btn-pointer">
                更多VIP特权
                <!-- <img v-if="$q.dark.isActive" src="../assets/images/account/account-right-small-dark.svg" /> -->
                <img src="../assets/images/account/account-right-small.png" />
              </div>
            </router-link>
          </div>

          <!-- <div class="eshare-div">
            <span v-if="store.evip">
              专属网址:
              <a class="share-link" :href="store.evip" target="_blank">
                {{ store.evip }}
              </a>
              <img
                class="copy-btn btn-pointer"
                src="../assets/images/account/account-copy-icon.png"
                @click="copyLink"
              />
            </span>
          </div> -->
          <div class="list-reward-wapper" style="display: none">
            <div class="list-reward-received">
              <div class="list-item collected">
                <div><img src="../assets/images/account/list-tick.png" /></div>
                <div>每周红包</div>
              </div>
              <div class="list-item collected">
                <div><img src="../assets/images/account/list-tick.png" /></div>
                <div>晋级礼金</div>
              </div>
              <div class="list-item">
                <div><img src="../assets/images/account/list-cross.png" /></div>
                <div>专属豪礼</div>
              </div>
              <div class="list-item">
                <div><img src="../assets/images/account/list-cross.png" /></div>
                <div>生日礼金</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- <q-separator /> -->

        <!-- <q-card class="bluecard vip-info-board" @click="goToVip"> -->
        <!-- <div class="vipline q-mt-sm"> -->
        <!-- <div class="circle"> -->
        <!-- <span class="bigV">v</span> -->
        <!-- <span class="small">{{ vipLevel }}</span> -->
        <!-- </div> -->
        <!-- <div class="middle"> -->
        <!-- <div class="row items-center justify-between"> -->
        <!-- <div class="left">成长值</div> -->
        <!-- <div class="right">{{ store.currentDeposit }}/{{ store.levelUpDeposit }}</div> -->
        <!-- </div> -->

        <!-- <q-linear-progress :value="vip_progress" rounded class="q-mt-xs" color="white" /> -->
        <!-- </div> -->
        <!-- <div class="circle"> -->
        <!-- <span class="bigV">v</span> -->
        <!-- <span class="small">{{ vipLevel + 1 }}</span> -->
        <!-- </div> -->
        <!-- </div> -->

        <!-- <div class="vip-get-div row justify-between items-center q-mt-sm"> -->
        <!-- <div class="vip-getpromo-div"> -->
        <!-- <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon> -->
        <!-- <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" /> -->
        <!-- <span>晋级礼包</span> -->
        <!-- </div> -->
        <!-- <div class="vip-getpromo-div"> -->
        <!-- <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon> -->

        <!-- <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" /> -->
        <!-- <span>生日礼金</span> -->
        <!-- </div> -->
        <!-- <div class="vip-getpromo-div"> -->
        <!-- <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon> -->

        <!-- <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" /> -->
        <!-- <span>每月活动</span> -->
        <!-- </div> -->
        <!-- <div class="vip-getpromo-div"> -->
        <!-- <q-icon v-if="vipLevel < 2" size="13px" name="close" class="getpromo-icon" rounded></q-icon> -->
        <!-- <img v-if="vipLevel >= 2" src="../assets/account/vip-tick-icon.png" /> -->
        <!-- <span>专属活动</span> -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- </q-card> -->
      </q-card-section>
    </div>

    <q-item-section class="acct-nav">
      <div class="acct-title">
        <div class="acct-title-1">功能区</div>
      </div>
      <div class="acct-menu" id="id-acct-menu">
        <router-link to="/account/personal">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-personal-icon.png" />
            <div class="acct-nav-label">账户信息</div>
          </div>
        </router-link>

        <router-link to="/account/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-bank-icon.png" />
            <div class="acct-nav-label">银行信息</div>
          </div>
        </router-link>

        <router-link to="/account/records">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-record-icon.png" />
            <div class="acct-nav-label">交易信息</div>
          </div>
        </router-link>

        <router-link to="/account/records/bet">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-record-bet-icon.png" />
            <div class="acct-nav-label">投注记录</div>
          </div>
        </router-link>

        <router-link to="/account/inbox">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-notice-icon.png" />
            <div class="acct-nav-label">消息提醒</div>
            <div class="unread" v-if="store.unreadInboxMail > 0">
              {{ store.unreadInboxMail > 99 ? "99+" : store.unreadInboxMail.toString() }}
            </div>
          </div>
        </router-link>

        <router-link to="/account/letters">
          <div class="acct-nav-item">
            <img src="../assets/images/account/user-feedback-icon.png" />
            <div class="acct-nav-label">意见反馈</div>
          </div>
        </router-link>

        <router-link to="/account/vip?from=account">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-vip-icon.png" />
            <div class="acct-nav-label">VIP 特权</div>
          </div>
        </router-link>

        <router-link to="/account/changePwd">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-changepwd-icon.png" />
            <div class="acct-nav-label">修改密码</div>
          </div>
        </router-link>
      </div>
    </q-item-section>

    <q-item-section class="acct-nav">
      <div class="acct-title">
        <div class="acct-title-1">热门推荐</div>
      </div>
      <div class="acct-menu" id="id-acct-menu">
        <router-link to="/promo">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-promo-icon.png" />
            <div class="acct-nav-label">优惠活动</div>
          </div>
        </router-link>

        <router-link to="/account/invite">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-share-icon.png" />
            <div class="acct-nav-label">推广赚钱</div>
          </div>
        </router-link>

        <router-link to="/account/invite#summon-share">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-summon-share-icon.png" />
            <div class="acct-nav-label">精英召回</div>
          </div>
        </router-link>

        <router-link to="/affiliate">
          <div class="acct-nav-item">
            <img src="../assets/images/account/account-affiliate-icon.png" />
            <div class="acct-nav-label">合作加盟</div>
          </div>
        </router-link>
      </div>
    </q-item-section>

    <q-card class="card-account-banner">
      <q-card-section>
        <q-carousel
          class="account"
          autoplay
          navigation
          v-model="slide"
          swipeable
          transition-next="slide-left"
          transition-prev="slide-right"
          animated
          infinite
          height="150px"
        >
          <template v-slot:navigation-icon="{ active, onClick }">
            <q-btn
              padding="3px"
              v-if="active"
              size="xs"
              color="white"
              @click="onClick"
              style="border: 1px solid #ffffff; border-radius: 50%; margin: 6px 8px"
            />
            <q-btn
              padding="3px"
              v-else
              size="xs"
              color="transparent"
              @click="onClick"
              style="border: 1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px"
            />
          </template>

          <q-carousel-slide
            v-for="(banner, i) in btm_banners"
            :key="i"
            :name="i"
            class="column no-wrap flex-center"
            :img-src="
              imgURL +
              ($q.dark.isActive && banner.mobileImageUrlDark ? banner.mobileImageUrlDark : banner.mobileImageUrl)
            "
            @click="gotoPromo(banner)"
          ></q-carousel-slide>
        </q-carousel>
      </q-card-section>
    </q-card>

    <a @click="isLogoutModal = true">
      <div class="acct-logout btn-pointer">
        <div class="acct-nav-label">退出登录</div>
        <!-- <img v-if="$q.dark.isActive" src="../assets/images/account/account-logout-icon-dark.svg" /> -->
        <img src="../assets/images/account/account-logout-icon.png" />
      </div>
    </a>
  </q-page>

  <q-dialog
    width="100%"
    class="modal-common-div"
    v-model="isLogoutModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="modalcontent with-decorator">
      <div class="headers">
        <div class="titles">系统提示</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">确认要退出登录吗？</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn" @click="logout">确定</div>
        <div class="cacnels common-md-white-btn" @click="isLogoutModal = false">取消</div>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="profileDialogVisible" persistent class="profile-dialog">
    <q-card style="flex-direction: column; display: flex">
      <div class="header">
        修改头像
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </div>

      <div class="grid-container">
        <div
          class="grid-item"
          v-for="(profImg, profIndex) in 13"
          :key="profIndex"
          :class="{ selected: selectedImage === 'default-' + (profIndex + 1) }"
          @click="selectImage('default-' + (profIndex + 1))"
        >
          <img :src="require(`../assets/images/profile/default-${profIndex + 1}.png`)" />
        </div>
        <div class="grid-item">
          <div
            @click="updateDialogVisible = true"
            style="
              border-radius: 50%;
              width: 100px;
              height: 100px;
              background: #e7f3ff;
              color: #a4aabb;
              font-size: 80px;
              cursor: pointer;
              padding-bottom: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            +
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <q-btn :loading="submitPhotoLoading" class="submitImgBtn" @click="submitPhoto">确认</q-btn>
      </div>
    </q-card>
  </q-dialog>
  <q-dialog v-model="updateDialogVisible" persistent class="profile-dialog">
    <q-card style="flex-direction: column; display: flex">
      <div class="header">
        修改头像
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </div>

      <div class="uploader">
        <div class="leftBox">
          <el-form-item class="upload-box" v-if="!uploadedImage.url" style="margin: 0" prop="path">
            <input
              id="uploadFile"
              type="file"
              ref="inputImage"
              style="display: none"
              accept="image/*"
              @change="attachImage"
            />
            <div @click="$refs.inputImage.click()" class="upload-btn">上传头像</div>
            上传头像支持jpg,jpeg,png,bmp格式的图片，文件小于1MB
          </el-form-item>
          <cropper
            v-if="uploadedImage.url"
            background-class="cropper-background"
            ref="cropperRef"
            class="cropper"
            :src="
              uploadedImage.url
                ? uploadedImage.url
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH_pqa6TIV5oR8BeTCCNhAbkqIrri2Xi8qbMusW_ulvA&s'
            "
            circle-stencil
            :stencil-props="{
              handlers: {},
              movable: false,
              resizable: false,
              aspectRatio: 1 / 1
            }"
            :stencil-size="{
              width: 150,
              height: 150
            }"
            image-restriction="stencil"
            @change="change"
          />
        </div>
        <div class="rightBox">
          <div class="cropped_title">头像预览</div>
          <div v-if="!croppedImg" class="croppedImgHolder"></div>
          <img v-if="croppedImg" style="border-radius: 50%; width: 150px; height: 150px" :src="croppedImg" />
        </div>
      </div>
      <div v-if="croppedImg" class="dialog-footer">
        <q-btn :loading="isLoadingUpload" class="submitImgBtn" @click="saveCroppedImage()">保存</q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, onActivated } from "vue";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useLocalStorage, useSessionStorage } from "@vueuse/core";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";
import moment from "moment";
import { useNotify } from "src/hooks/notify";
export default defineComponent({
  name: "AccountPage",
  components: {
    Cropper
  },
  setup() {
    const notify = useNotify();
    const timestamp = moment().unix();
    const cropperRef = ref(null);
    const croppedImg = ref(null);
    const getImageFromCropper = () => {
      if (cropperRef.value) {
        // Access the cropper instance using the value of cropperRef
        const { coordinates, canvas } = cropperRef.value.getResult();
        croppedImg.value = canvas.toDataURL("image/jpeg", 0.6);
      }
    };
    const change = ({ coordinates, canvas }) => {
      console.log(coordinates, canvas);
      getImageFromCropper();
    };
    const inputImage = ref(null);
    const store = userStore();
    const router = useRouter();
    const $q = useQuasar();

    const isLogoutModal = ref(false);
    const isHideLevelUp = ref(false);

    const logout = () => {
      store.memberLogout().then(() => {
        router.push("/");
      });
    };

    // const appVersionNo = ref(null);
    const vipLevel = computed(() => {
      if (store.vip == "VIP0") {
        return 0;
      } else if (store.vip == "VIP1") {
        return 1;
      } else if (store.vip == "VIP2") {
        return 2;
      } else if (store.vip == "VIP3") {
        return 3;
      } else if (store.vip == "VIP4") {
        return 4;
      } else if (store.vip == "VIP5") {
        return 5;
      } else if (store.vip == "VIP6") {
        return 6;
      } else if (store.vip == "VIP7") {
        return 7;
      } else if (store.vip == "VIP8") {
        return 8;
      } else if (store.vip == "VIP9") {
        return 9;
      } else if (store.vip == "VIP10") {
        return 10;
      } else if (store.vip == "VIP11") {
        return 11;
      } else if (store.vip == "VIP12") {
        return 12;
      }
      return store.vip;
    });
    const vip_progress = ref(store.currentDeposit / store.levelUpDeposit);
    const goToVip = () => {
      router.push("/account/vip?redirect=account");
    };

    const timerBalance = ref();
    const mainWallet = computed(() => {
      return store.balance.toFixed(2);
    });
    // const getVersionNo = async () => {
    //   if (store.getDeviceType() == "ANDROID") {
    //     const info = await App.getInfo();
    //     var current_version = info.version + "." + info.build;
    //     appVersionNo.value = current_version;
    //   } else if (store.getDeviceType() == "IOS") {
    //     appVersionNo.value = "iOS v0.6";
    //   } else {
    //   }
    // };
    const isLoadingBalance = ref(false);

    const selfTgurl = ref("https://" + store.evip);

    const copyLink = () => {
      const copyText = store.evip;
      const textarea = document.createElement("textarea");
      textarea.value = copyText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      notify({
        type: "success",
        message: "已复制专属网址"
      });
    };
    onActivated(() => {
      store.getUnreadTotal();
    });
    onMounted(() => {
      getBalance();
      store.getBalance();
      store.getVIPInfo();
      // getVersionNo();
      getPromoImage();
      if (store.isApp()) {
        var btmSwiper = document.getElementById("id-acct-menu");
        btmSwiper.classList.add("shorter-menu");
      }
      // getVipProgress();
      if (store.profilePhoto && store.profilePhoto.includes("default")) {
        selectedImage.value = store.profilePhoto;
      }
    });

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const imageDir = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/profile/";
    const btm_banners = ref([]);
    const getPromoImage = () => {
      api
        .get("/opt-session/promo/banner?category=CENTERPROMO")
        .then((res) => {
          if (res.code === 0) {
            btm_banners.value = res.data.filter((promo) => {
              if ($q.dark.isActive) {
                return promo.mobileImageUrlDark;
              }

              return promo;
            });
          }
        })
        .catch(() => {});
    };
    const gotoPromo = (banner) => {
      const redirectU = "/promo?name=" + banner.redirectUrl;
      router.push(`${redirectU}`);
    };

    onBeforeUnmount(() => {
      clearInterval(timerBalance.value);
    });
    const openDeposit = () => {
      // to="finance/deposit"
      localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
      router.push("finance/deposit");
    };
    const openWithdraw = () => {
      router.push("finance/withdraw");
    };
    const openTransfer = () => {
      router.push("account/transfer");
    };
    const getBalance = () => {
      isLoadingBalance.value = true;
      store.getBalance().then(() => {
        isLoadingBalance.value = false;
      });
      //123
      timerBalance.value = setInterval(function () {
        if (store.hasToken()) {
          store.getBalance();
        }
      }, 20000);
    };

    const formatNumber = (numberString) => {
      const number = parseFloat(numberString);
      if (!isNaN(number)) {
        return number.toLocaleString("en-US");
      }
      return "";
    };

    const updatedVip = () => {
      const currentVip = parseInt(store.vip.match(/\d+/)[0]);
      const updatedVip = currentVip + 1;

      if (currentVip < 12) {
        return "VIP" + updatedVip.toString();
      } else {
        // getVipProgress(true);
        isHideLevelUp.value = true;
        return "已满级";
      }
    };

    const getVipProgress = (max) => {
      // if (max) {
      //   store.vipProgress = parseFloat(store.currentUpgradeBetAmt) / parseFloat(store.currentUpgradeBetAmt);
      // } else {
      //   store.vipProgress = parseFloat(store.currentBetAmt) / parseFloat(store.currentUpgradeBetAmt);
      // }
    };
    const submitPhotoLoading = ref(false);
    var qs = require("qs");
    const selectedImage = ref(null);
    const profileDialogVisible = ref(false);
    const uploadedImage = reactive({
      url: null
    });
    const imageForm = reactive({
      path: null
    });
    const isLoadingUpload = ref(false);
    const updateProfilePhoto = () => {
      // if (!(store.memberType === "TEST" || store.memberType === "PROMO_TEST")) {
      //   return;
      // }

      profileDialogVisible.value = true;
    };
    const selectImage = (item) => {
      selectedImage.value = item;
    };
    const onShowProfile = () => {
      // if (!(store.memberType === "TEST" || store.memberType === "PROMO_TEST")) {
      //   return;
      // }

      imageForm.path = null;
      inputImage.value = null;
      uploadedImage.url = null;
      croppedImg.value = null;
      profileDialogVisible.value = true;
    };
    async function saveCroppedImage() {
      isLoadingUpload.value = true;
      if (croppedImg.value) {
        const data = await attachPhoto(croppedImg.value);
        if (data.code === 0) {
          selectedImage.value = data.data;
          inputImage.value = "";
          isLoadingUpload.value = false;

          submitPhoto();
        } else {
          // Handle case when croppedImg is not available
          console.error("No cropped image available");
          isLoadingUpload.value = false;
        }
      }
    }

    async function attachImage(event) {
      console.log(event.target.files[0].size);
      // if (event.target.files[0].size > 1000000) {
      //   return notify({
      //     type: "error",
      //      //     message: "图片必须小于1MB,请重新上传",
      //      //   });
      // } else {
      const file = event.target.files[0];
      uploadedImage.url = URL.createObjectURL(file);
      // }
    }

    function isBase64(str) {
      // Regular expression to match Base64 encoding pattern
      const base64Regex = /^(data:image\/\w+;base64,)?([A-Za-z0-9+/]+={0,2})(\s|$)/;

      // Test if the string matches the Base64 pattern
      return base64Regex.test(str);
    }
    async function attachPhoto(fileImg) {
      var file = null;
      if (typeof fileImg === "string" && isBase64(fileImg)) {
        console.log("Treating input as base64");
        // Extract the MIME type from the base64 string
        const mimeType = fileImg.split(";")[0].split(":")[1];
        var data = fileImg.replace(/^data:image\/\w+;base64,/, "");
        // Decode the Base64 string
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        // Convert to an ArrayBuffer
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the ArrayBuffer
        const blob = new Blob([byteArray], { type: mimeType });

        // Create a File object from the Blob
        file = new File([blob], "image." + mimeType.split("/")[1], { type: mimeType });
      } else {
        file = fileImg;
      }
      // Use the File object for further processing
      const allowFileTypes = ["image/jpeg", "image/png", "image/gif"];
      const dir = "temp";

      if (!file || !allowFileTypes.includes(file.type)) {
        notify({
          type: "error",
          message: "照片格式错误"
        });

        isLoadingUpload.value = false;
        return null; // Exit the function if file is not valid
      }
      if (file && file.size > 1000000) {
        notify({
          type: "error",
          message: "上传的图片已大于1mb，请刷新页面重新上传"
        });
        isLoadingUpload.value = false;
        return null; // Exit the function if file is not valid
      }

      var formData = new FormData();
      formData.append("files", file);
      formData.append("dir", dir);
      formData.append("overwrite", false);
      selectedImage.value = URL.createObjectURL(file); // Set the URL for preview
      var rstUrl = localStorage.getItem("LH_H5_RST_URL");
      if (!rstUrl) {
        rstUrl = process.env.RST_API.split(",")[0];
      }
      try {
        const response = await fetch(`${rstUrl}/session/profile-photo/upload`, {
          method: "POST",
          body: formData,
          headers: {
            token: `${store.token}`
          }
        });
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    }
    const updateDialogVisible = ref(false);
    const submitPhoto = async () => {
      submitPhotoLoading.value = true;
      if (!selectedImage.value) {
        return notify({
          type: "error",
          message: "请选择图片"
        });
      }
      await api.post("/session/profile-photo/save", qs.stringify({ imageUuid: selectedImage.value })).then((data) => {
        // Handle response here
        store.profilePhoto = data.data;
        notify({
          type: "success",
          message: "修改成功"
        });
        submitPhotoLoading.value = false;
        profileDialogVisible.value = false;
        isLoadingUpload.value = false;
        updateDialogVisible.value = false;
        window.location.reload();
      });
    };

    const customService = useSessionStorage("CUSTOM_SERVICE", "");
    const handleClickCustomService = () => {
      router.push("/promo?name=lh-official-gift");
    };
    return {
      header: "Account",
      logout,
      mainWallet,
      getBalance,
      vipLevel,
      store,
      openDeposit,
      openWithdraw,
      openTransfer,
      isLoadingBalance,
      selfTgurl,
      vip_progress,
      goToVip,
      btm_banners,
      imgURL,
      imageDir,
      gotoPromo,
      slide: ref(0),
      isLogoutModal,
      copyLink,
      getVipProgress,
      formatNumber,
      updatedVip,
      isHideLevelUp,
      updateProfilePhoto,
      profileDialogVisible,
      selectedImage,
      selectImage,
      submitPhoto,
      updateDialogVisible,
      uploadedImage,
      onShowProfile,
      saveCroppedImage,
      attachImage,
      croppedImg,
      attachPhoto,
      cropperRef,
      change,
      timestamp,
      isLoadingUpload,
      handleClickCustomService
    };
  }
});
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 4px;
  gap: 10px;
  width: 100%;

  .left {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    width: 100%;
  }

  .avatar {
    width: 50px;
    height: 50px;
    max-width: 60px;
    min-width: 60px;
    max-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    flex: 1;
    img {
      width: 50px;
      height: 50px;
      aspect-ratio: 1/1;
      border-radius: 50%;
    }
  }

  .right {
    .custom-service {
      width: 84px;
      height: 24px;
      border-radius: 8px;
      background: linear-gradient(106.6deg, #5db5ff 35.17%, #4b0fff 101.26%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      font-size: 12px;
      color: white;
      cursor: pointer;
    }
  }

  .pro-details {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 6px;

    .nickname-span {
      color: #333333;
      font-size: 1.15rem;
      line-height: 1.15rem;
      font-weight: 700;
      word-break: break-all;
    }

    // .join-span {
    //   font-size: 0.9rem;
    //   line-height: 0.9rem;
    //   color: $font-1;
    // }
  }

  .livechat {
    background: #0089ed;
    color: #ffffff;
    border-radius: 50px;
    cursor: pointer;
    padding: 5px 15px;
    font-size: 16px;
    width: auto;
    white-space: nowrap;
    margin-top: 6px;
    text-decoration: none;
  }
}

.vipcard {
  margin: 5px auto;
  border-radius: 15px;
  width: calc(100% - 2em);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
  overflow: hidden;

  .q-card__section--vert {
    padding: 0;
  }

  .btn-main {
    background-image: url("../assets/images/account/account-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 60px;
    text-align: center;
    white-space: nowrap;
    font-size: 1rem;
    aspect-ratio: 122/68;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.5px 2px 0px #ffffff;
    border-radius: 45.9px;
  }

  .top-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(90deg, #333333 1.5%, #6b6b6b 100%);
    align-items: center;
    padding: 10px 14px;
  }

  .acct-section {
    display: flex;
    text-align: left;
    justify-content: space-evenly;
    align-items: flex-start;
    width: 100%;
    color: #a4aabb;
    margin-bottom: 8px;

    > div {
      flex: 1;
    }

    .left-sect {
      flex-wrap: nowrap;

      .label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-top: 0px;
        gap: 8px;

        span {
          font-size: 1rem;
          line-height: 1rem;
        }

        img {
          display: block;
          width: 15px;
          margin-bottom: 3px;
        }
      }
    }

    .right-sect {
      display: flex;
      justify-content: space-between;
      max-width: 220px;
      gap: 20px;

      a {
        font-size: 16px;
        display: block;
        //color: #0089ed;
        color: #fff;
        text-decoration: none;
      }
    }
  }

  .amt {
    color: $white;
    font-size: 1rem;
    font-weight: bold;
    width: calc(100% - 25px);
    margin-left: 25px;
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      height: 1.2rem;
    }
  }

  .acct-btm-section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;

    .vip-info-div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 4px;

      .vip-txt-left {
        display: flex;
        color: #a4aabb;
        font-size: 0.875rem;

        &.opacity-0 {
          opacity: 0;
        }
      }

      .vip-left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 13px;
        color: #a4aabb;
        font-size: 1.2rem;

        // .vip-level {
        //   background-image: url("../assets/images/account/account-vip-tab.png");
        //   width: 90px;
        //   aspect-ratio: 168/45;
        //   background-size: 100% 100%;
        //   background-repeat: no-repeat;
        //   text-align: center;
        //   color: $white;
        //   font-size: 1.2rem;
        //   font-style: italic;
        //   padding-left: 28px;
        //   padding-right: 10px;
        // }
      }

      .vip-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;

        color: #a4aabb;
        font-size: 0.875rem;

        img {
          width: 7px;
        }
      }
    }

    .eshare-div {
      margin-right: auto;
      width: 100%;
      color: #7a80a1;
      font-size: 1.2rem;

      > span {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
      }

      .copy-btn {
        width: 20px;
      }

      .share-link {
        color: $white;
        text-decoration: none;
      }
    }
  }
}

.acct-nav {
  width: calc(100% - 2em);
  margin: 0px auto;
  padding: 0px;
  gap: 0px;

  a {
    padding: 5px;
    display: block;
  }

  .acct-title {
    display: flex;
    padding: 12px 4px 8px;
    margin-top: 4px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: #424f72;
    // background-color: $lightblue;
    background: rgba(203, 229, 255, 1);
    border-radius: 20px 20px 0 0;
    position: relative;
    &:before {
      background: #458bff;
      width: 5px;
      height: 20px;
      left: 0;
      top: 5px;
      bottom: 0;
      margin: auto;
      content: "";
      position: absolute;
    }

    .acct-title-1 {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      padding-left: 10px;
      font-size: 1.2rem;
      color: #0e436c;
    }

    .acct-title-link {
      background: linear-gradient(271.61deg, #0d8be6 22.35%, #68e4eb 100%);
      color: #ffffff;
      position: absolute;
      top: 0;
      right: 0;
      border-top-right-radius: 12px;
      border-bottom-left-radius: 12px;
      width: 120px;
      height: 30px;
      padding-left: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
  }

  .acct-menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0px;
    gap: 0px;
    row-gap: 0px;
    height: auto;
    max-height: 180px;

    margin-bottom: 10px;
    background-color: $white;
    border-radius: 0px 0px 20px 20px;
    padding: 15px 0;
    box-shadow: 0px -4px 4px 0px #c3d4e6 inset;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      text-decoration: none;
      height: 80px;
      display: block;

      .acct-nav-item {
        font-size: 1rem;
        gap: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        text-decoration: none;
        padding: 6px;
        border-radius: 4px;
        position: relative;

        .acct-nav-label {
          white-space: nowrap;
          color: #7a80a1;
        }
        .unread {
          position: absolute;
          border-radius: 50%;
          background: #ff0000;
          left: 70%;
          top: -3px;
          color: #ffffff;
          padding: 1px 5px;
          font-size: 10px;
        }

        img {
          height: 32px;
          fill: white;
          padding: 0;
        }

        &:active {
          background: rgba(0, 0, 0, 0.2);
          filter: brightness(0.9);
        }
      }
    }
  }
}

.acct-logout {
  padding: 12px;
  box-shadow: 0px -2px 8px 0px #c3d4e6 inset;
  text-align: center;
  font-size: 1.2rem;
  background: $white;
  color: #7a80a1;
  border-radius: 20px;
  line-height: 15px;
  width: calc(100% - 2em);
  letter-spacing: 1px;
  margin: 6px auto 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  img {
    width: 25px;
  }
}

.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}

.card-account-banner {
  width: calc(100% - 2rem);
  margin: auto;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;

  .account-banner-img {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
  }
}

#personal_vip_img {
  height: 14px;
}

.list-reward-wapper {
  overflow: hidden; /* Hide horizontal scrollbar from the wrapper */
  width: 100%;
}

.list-reward-received {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* Make the section scrollable horizontally */
  overflow-y: hidden; /* Hide vertical scrollbar */
  // padding-bottom: 16px; /* Add padding to ensure space for scrollbar */
}
.list-reward-received::-webkit-scrollbar {
  display: none; /* Hide scrollbar for WebKit (Chrome, Safari) */
}

.list-item {
  border-radius: 24px;
  height: 25px;
  padding-left: 5px;
  padding-right: 9px;
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.875rem;
  color: #ffffff;
  background: rgba(207, 235, 255, 0.25);
  opacity: 0.5;

  &.collected {
    opacity: 1;
  }

  img {
    width: 15px;
    display: block;
  }
}

.vip-level-detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.vip-progress {
  width: 100%;
  margin: 0 6px;

  :deep(.q-linear-progress) {
    border-radius: 30px;
  }

  :deep(.q-linear-progress__model) {
    background: linear-gradient(180deg, #32a9ff 0%, #3b5afe 100%);
  }

  :deep(.q-linear-progress__track) {
    opacity: 1;
    background: linear-gradient(180deg, #f8ffff 0%, #85e2ff 100%);
  }
}
.vip-link {
  background: linear-gradient(180deg, #32a9ff 0%, #3b5afe 100%);
  min-width: 60px;
  height: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.875rem;
  padding-left: 10px;
  margin-left: 10px;
  position: relative;
  line-height: 1;
  padding-top: 2px;

  &:before {
    content: "";
    background-image: url("../assets/images/account/vip-diamond.png");
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: -10px;
    width: 25px;
    height: 21px;
  }
}

// .body--dark {
//   .profile {
//     .pro-details {
//       .nickname-span {
//         // color: $font-3-dark;
//       }
//     }
//   }

//   .acct-nav {
//     .acct-menu {
//       @include content-block-dark;
//       background: transparent;
//       max-height: 280px;
//     }
//   }

//   .acct-section {
//     .left-sect {
//       .label {
//         color: #fff;
//         font-family: "PingFang", "Roboto", "-apple-system", "Helvetica Neue", "Microsoft YaHei", Helvetica, Arial,
//           sans-serif;
//       }

//       .amt {
//         margin-left: 0;
//         margin-top: 5px;
//         letter-spacing: 2px;
//         font-size: 1.5rem;
//       }
//     }
//   }

//   .acct-logout {
//     @include content-block-dark;
//     background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
//     background-size: cover;
//     box-shadow: none;
//     border-radius: 4px;
//     border: 1px solid #3a93ce;

//     .acct-nav-label {
//       color: #fff;
//     }
//   }

//   .vipcard {
//     background: none;
//     border-radius: 4px;
//     overflow: hidden;

//     .top-section {
//       background: linear-gradient(180deg, #384e79 0%, #212e4b 100%);
//     }
//     .btn-main {
//       // background-image: url("../assets/images/account/account-btn-dark.png");
//       background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
//       background-size: cover;
//       box-shadow: none;
//       border-radius: 4px;
//       border: 1px solid #3a93ce;
//     }

//     .acct-btm-section {
//       gap: 12px;

//       .vip-info-div {
//         .vip-right {
//           color: #fff;
//           font-size: 18px;
//           font-family: "YouSheBiaoTiHei";
//           background: url("../assets/images/account/vip-right-bg-dark.svg") no-repeat center center;
//           background-size: 100% 100%;
//           padding: 4px 10px 4px 20px;
//           margin-right: -14px;
//           margin-bottom: -12px;

//           img {
//             width: 9px;
//           }
//         }
//       }
//     }
//   }

//   .acct-nav {
//     .acct-title {
//       background: #ffffff1a;
//       &::before {
//         background: $primary-dark;
//       }
//       .acct-title-1 {
//         color: $white;
//       }
//     }
//   }

//   .profile-dialog {
//     .q-card {
//       box-shadow: none;
//     }
//     .submitImgBtn {
//       background-image: url("../assets/images/download/active-tab-bg-dark.png");
//     }
//   }

//   .vip-link {
//     background: none;
//     &::before {
//       background-image: url("../assets/images/account/vip-diamond-dark.svg");
//       height: 58px;
//       width: 58px;
//       left: -25px;
//       top: -17px;
//     }
//   }

//   .vip-progress {
//     :deep(.q-linear-progress__model) {
//       background: #d0a383;
//     }
//     :deep(.q-linear-progress__track) {
//       background: #d0a38333;
//     }
//   }
// }

@media (max-width: 430px) {
  .acct-nav {
    .acct-menu {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .vipcard .acct-section .right-sect {
    gap: 10px;
  }

  .vipcard .btn-main {
    min-height: 14px;
    width: 50px;
  }

  .profile .avatar {
    max-width: 50px;
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
}

@media (max-width: 380px) {
  .acct-nav {
    .acct-menu {
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }
  }
  .acct-nav .acct-menu a .acct-nav-item img {
    height: 32px;
  }
}
.profile-dialog .q-card {
  box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
  border-radius: 10px;
}
.profile-dialog .header {
  font-size: 20px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.profile-dialog .submitImgBtn {
  background-image: url("../assets/images/download/active-tab-bg.png");
  background-size: 100% 100%;
  color: #ffffff;
  width: 100px;
  margin: 20px auto;
  display: block;
  box-shadow: none;
  &:before {
    box-shadow: none;
  }
}
.grid-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 400px;
  padding: 20px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  transition: transform 0.5s;
  img {
    width: 80px;
    cursor: pointer;
  }
}

.grid-item .el-image:hover {
  cursor: pointer;
}

.grid-item.selected {
  position: relative;
  color: #ffffff;
  img {
    border: 3px solid #33bc03;
    border-radius: 50%;
  }
  &:after {
    content: "✓";
    position: absolute;
    background: #33bc03;
    font-size: 13px;
    width: 20px;
    height: 20px;
    right: 0px;
    bottom: 5px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
}
.uploader {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  margin: 10px 50px 20px;
  .leftBox {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    overflow: hidden;
    .upload-box {
      gap: 10px;
      padding: 10px;
      width: 200px;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #a4aabb;
      background: #e7f3ff;
      border-radius: 20px;
      flex-direction: column;
      text-align: center;
      .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding: 50px 0;
        text-align: center;
        gap: 10px;
      }

      .upload-btn {
        cursor: pointer;
        padding: 8px 20px;
        background: linear-gradient(180deg, #f8fbff 0%, #fdfeff 100%);

        box-shadow: 0px -0.96px 3.51px 0px #a2bff4 inset;
      }
    }
  }
  .rightBox {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    .cropped_title {
      color: #7a80a1;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      text-align: center;
    }
    .croppedImgHolder {
      border: 3px dotted #7a80a1;
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
  }
}
.cropper {
  height: 150px;
  width: 150px;
  border-radius: 10px;
  background: aliceblue;
}
.vue-preview__wrapper {
  border-radius: 20px;
}
.vue-bounding-box {
  border-radius: 50%;
}
.cropper-background {
  background: aliceblue;
}
</style>

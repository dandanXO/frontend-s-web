<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="account-info-bg" >
        <div @click="onShowProfile" class="account-avatar">
          <img v-if="!store.profilePhoto" src="../../assets/images/home/profile-pic.png" />
          <img v-if="store.profilePhoto && store.profilePhoto.includes('default')" :src="require(`../../assets/images/profile/${store.profilePhoto}.png`)" />
          <img v-if="store.profilePhoto && !store.profilePhoto.includes('default')" :src="imageDir + store.profilePhoto" />
        </div>
        <div class="account-name">欢迎您 {{ loginName }}</div>
        <span class="account-vip-label">{{ vip }}</span>
        <div @click="refreshBalance" class="account-details-balance">
          <span>总资产:</span>
          <span class="amount">
            <span v-if="isLoadingBalance">加载中...</span>
            <span v-if="!isLoadingBalance">{{ store.currency.value }} {{ store.balance }}</span>
          </span>
          <el-icon style="cursor: pointer;">
            <RiRefreshLine color="#468CFF" />
          </el-icon>
        </div>
        <div class="profile-actions">
          <router-link to="/center/deposit" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-deposit.png" />
            </div>
            存款
          </router-link>
          <router-link to="/center/withdraw" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-withdraw.png" />
            </div>
            取款
          </router-link>
          <router-link to="/center/transfer" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-transfer.png" />
            </div>
            转账
          </router-link>
        </div>
      </div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <div class="menu-box">
        <div class="account-menu-list">
          <router-link v-for="item in menuItems" :key="item.route" :to="item.route" class="account-menu-item">
            <img class="account-avatar" :src="require(`../../assets/images/account/menu-icon-${item.icon}.png`)" />
            {{ item.label }}

            <div v-if="item.icon === 'inbox' && store.unreadTotal > 0" class="unread-total">
              <span>{{ store.unreadTotal }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="profileDialogVisible"
    append-to-body
    :close-on-press-escape="false"
    class="profile-dialog"
  >
    <div class="header">
      修改头像
    </div>
    <el-form :inline="true" size="small" label-width="180px">
      <div class="grid-container">
        <div class="grid-item" v-for="(profImg, profIndex) in 13" :key="profIndex" :class="{selected : selectedImage === 'default-' + (profIndex+1) }" @click="selectImage('default-' + (profIndex+1))">
          <img :src="require(`../../assets/images/profile/default-${profIndex + 1}.png`)">
        </div>
        <div class="grid-item" v-if="uploadedImage.url"
          :class="selectedImage === imageForm.path ? 'selected' : ''"
        >
          <el-image
            v-if="uploadedImage.url"
            :src="uploadedImage.url"
            fit="contain"
            @click="selectImage(imageForm.path)"
          />
        </div>
      <div class="grid-item">
       <el-form-item style="margin: 0;" prop="path">
            <!- eslint-disable ->
            <input
              id="uploadFile"
              type="file"
              ref="inputImage"
              style="display: none"
              accept="image/*"
              @change="attachImage"
            />
              <div @click="$refs.inputImage.click()" style="border-radius: 50%; width: 100px; height: 100px; background: #E7F3FF; color: #A4AABB; font-size: 80px; cursor: pointer; padding-bottom: 10px; display: flex; justify-content: center; align-items: center;"> +
              </div>
      </el-form-item>
    </div>
      </div>
      <div class="dialog-footer">
        <!-- <el-button type="primary" @click="profileDialogVisible = false">取消</el-button> -->
        <el-button :loading="submitPhotoLoading" type="submit" class="standard-button btn-color-blue" size="large" @click.prevent="submitPhoto">确认</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { userStore } from "@/store";
import { getUnreadTotal } from "@/api/personal/mailbox";
import { RiRefreshLine, RiAddLine } from "vue-remix-icons";
import { uploadImage, saveImage } from '@/api/personal/common';
import { ElMessage } from "element-plus";

const inputImage = ref(null)
const selectedImage = ref(null)
const store = userStore();
const isLoadingBalance = ref(false);
const refreshBalance = () => {
  isLoadingBalance.value = true;
  store.getBalance().then(() => {
    isLoadingBalance.value = false;
  });
};
const imageDir = process.env.VUE_APP_IMAGE_CDN + "/profile/";

const loginName = computed(() => {
  return store.nickName;
});

const vip = computed(() => {
  if (store.vip.toUpperCase() === "NORMAL") {
    return 1;
  }
  return store.vip;
});

const menuItems = ref([
  // { route: "/center/deposit", label: "充值中心", icon: "transitrecord" },
  // { route: "/center/withdraw", label: "快速提款", icon: "transitrecord" },
  // { route: "/center/transfer", label: "快速转账", icon: "transitrecord" },
  { route: "/center/transit-record", label: "交易记录", icon: "transitrecord" },
  // { route: "/center/transit-record?type=6", label: "投注记录", icon: "betrecord" },
  { route: "/center/personal", label: "个人资料", icon: "personal" },
  // { route: "/center/withdrawbank", label: "银行卡管理", icon: "transitrecord" },
  { route: "/center/mailbox", label: "消息中心", icon: "inbox" },
  { route: "/vip", label: "VIP特权", icon: "vip" },
  // { route: "/center/promo", label: "优惠领取", icon: "promo" },
  { route: "/center/feedback", label: "会员建议", icon: "feedback" },
  { route: "/center/share", label: "分享好友", icon: "transitrecord" }
]);

const checkMailboxUnread = () => {
  getUnreadTotal()
    .then((res) => {
      const { code, data } = res;
      if (code === 0) {
        store.unreadTotal = data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const profileDialogVisible = ref(false);
const uploadedImage = reactive({
  url: null,
})
const imageForm = reactive({
  path: null,
})
const onShowProfile = () => {
  if(!(store.memberType==='TEST' || store.memberType==='PROMO_TEST')){
    return;
  }

  imageForm.path = null
  inputImage.value = null
  uploadedImage.url = null
  profileDialogVisible.value = true
};

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    imageForm.path = data.data
    selectedImage.value = imageForm.path
    inputImage.value = ''
  } else {
    ElMessage({ message: '照片上传失败', type: 'error' })
  }
};

async function attachPhoto(event) {
  const files = event.target.files[0]

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'temp'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: '照片格式错误', type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    uploadedImage.url = URL.createObjectURL(files)
    return await uploadImage(formData)
  }
}
const submitPhotoLoading = ref(false)
async function submitPhoto() {
  if (!selectedImage.value) {
    return ElMessage.warning('请选择图片');
  }
  submitPhotoLoading.value = true
  const data = await saveImage(selectedImage.value);
  profileDialogVisible.value = false
  ElMessage({ message: '修改成功', type: 'success' })
  store.profilePhoto = data.data
  submitPhotoLoading.value = false
}

const selectImage = (item) => {
  selectedImage.value = item
}

onMounted(() => {
  checkMailboxUnread();
  setInterval(checkMailboxUnread, 60000);
  if (store.profilePhoto && store.profilePhoto.includes('default')) {
    selectedImage.value = store.profilePhoto
  }
});
</script>

<style lang="scss">
.account-container {
  background-size: cover;
  background-position: center center;
  .account-container-wrap {
    .account-avatar {
      width: 75px;
    }
    .account-name {
      display: flex;
      gap: 5px;
      margin: 10px 0 14px;
      color: $color-white;
    }
    .account-vip-label {
      background-image: url(../../assets/images/account/vip-label.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 63px 17px;
      width: 100%;
      height: 17px;
      font-size: 0.675rem;
      color: $color-white;
      padding-left: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .account-details-balance {
      margin-top: 10px;
      color: $color-white;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      svg {
        color: #ffffff;
      }
    }

    .profile-actions {
      display: flex;
      justify-content: space-evenly;
      margin-top: 15px;
      width: 100%;

      .action-btn {
        gap: 5px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.75rem;
        color: $color-white;
        cursor: pointer;

        &:hover {
          .icon-rounded {
            box-shadow: 0px 2px 5px 0px #498bd1 inset;
          }
        }

        .icon-rounded {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: $color-white;
          box-shadow: 0px 2px 5px 0px #bbdcff inset;
        }

        img {
          display: block;
          width: 16px;
        }
      }
    }
  }

  .unread-total {
    width: 45px;
    height: 25px;
    border-radius: 25px;
    text-align: center;
    color: #fff;
    background: red;
    font-size: 16px;
    line-height: 25px;
  }
}
</style>

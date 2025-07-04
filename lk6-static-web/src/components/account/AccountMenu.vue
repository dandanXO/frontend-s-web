<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="account-info-bg">
        <div @click="onShowProfile" class="account-avatar">
          <img v-if="!store.profilePhoto" src="../../assets/images/home/profile-pic.png" />
          <img
            v-if="store.profilePhoto && store.profilePhoto.includes('default')"
            :src="require(`../../assets/images/profile/${store.profilePhoto}.png`)"
          />
          <img
            v-if="store.profilePhoto && !store.profilePhoto.includes('default')"
            :src="imageDir + store.profilePhoto + '?v=' + timestamp"
          />
        </div>
        <div class="account-name">欢迎您 {{ loginName }}</div>
        <span class="account-vip-label">{{ vip }}</span>
        <div @click="refreshBalance" class="account-details-balance">
          <span>总资产:</span>
          <span class="amount">
            <span v-if="isLoadingBalance">加载中...</span>
            <span v-if="!isLoadingBalance">{{ store.currency.value }} {{ floor(store.balance, 2) }}</span>
          </span>
          <el-icon style="cursor: pointer">
            <!--            <RiRefreshLine color="#468CFF" />-->
            <img class="fill-white" src="../../assets/home/refresh-line.svg" />
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
            <img class="account-avatar" :src="loadMenuItemIcon(item.icon)" />
            {{ item.label }}

            <div v-if="item.icon === 'inbox' && store.unreadTotal > 0" class="unread-total">
              <span>{{ store.unreadTotal }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="profileDialogVisible" append-to-body :close-on-press-escape="false" class="profile-dialog">
    <div class="header">修改头像</div>
    <el-form :inline="true" size="small" label-width="180px">
      <div class="grid-container">
        <div
          class="grid-item"
          v-for="(profImg, profIndex) in 13"
          :key="profIndex"
          :class="{ selected: selectedImage === 'default-' + (profIndex + 1) }"
          @click="selectImage('default-' + (profIndex + 1))"
        >
          <img :src="require(`../../assets/images/profile/default-${profIndex + 1}.png`)" />
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
        <!-- <el-button type="primary" @click="profileDialogVisible = false">取消</el-button> -->
        <el-button
          :loading="submitPhotoLoading"
          type="submit"
          class="standard-button btn-color-blue"
          size="large"
          @click.prevent="submitPhoto"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog v-model="updateDialogVisible" append-to-body :close-on-press-escape="false" class="profile-dialog update">
    <div class="header">上传头像</div>
    <div class="uploader">
      <div class="leftBox">
        <el-form-item class="upload-box" v-if="!uploadedImage.url" style="margin: 0" prop="path">
          <!- eslint-disable ->
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
        <img v-if="croppedImg" style="border-radius: 50%; width: 250px; height: 250px" :src="croppedImg" />
      </div>
    </div>

    <el-button
      :loading="isLoadingUpload"
      class="standard-button btn-color-blue"
      size="large"
      v-if="croppedImg"
      @click="saveCroppedImage()"
    >
      保存
    </el-button>
  </el-dialog>
</template>

<script setup>
import moment from "moment";
import { computed, ref, reactive, onMounted } from "vue";
import { userStore } from "@/store";
import { getUnreadTotal } from "@/api/personal/mailbox";
import { uploadImage, saveImage } from "@/api/personal/common";
import { Cropper, CircleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";
import { useDark, useLocalStorage } from "@vueuse/core";
import floor from "lodash/floor";
import { useNotify } from "@/hooks/notify";

components: {
  Cropper, CircleStencil;
}

const isDark = useDark();
const notify = useNotify();

const timestamp = moment().unix();

const cropperRef = ref(null);
const croppedImg = ref(null);
const getImageFromCropper = () => {
  if (cropperRef.value) {
    // Access the cropper instance using the value of cropperRef
    const { coordinates, canvas } = cropperRef.value.getResult();
    croppedImg.value = canvas.toDataURL("image/jpeg", 0.7);
  }
};
const change = ({ coordinates, canvas }) => {
  console.log(coordinates, canvas);
  getImageFromCropper();
};
const inputImage = ref(null);
const selectedImage = ref(null);
const store = userStore();
const isLoadingBalance = ref(false);
const refreshBalance = () => {
  isLoadingBalance.value = true;
  store.getBalance().then(() => {
    isLoadingBalance.value = false;
  });
};
const imageDir = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value + "/profile/";

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
  { route: "/center/feedback", label: "反馈奖励", icon: "feedback" },
  { route: "/center/share", label: "推广赚钱", icon: "transitrecord" }
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
  url: null
});
const imageForm = reactive({
  path: null
});
const isLoadingUpload = ref(false);
const onShowProfile = () => {
  // if(!(store.memberType==='TEST' || store.memberType==='PROMO_TEST')){
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
      // Reset all values after submission
      selectedImage.value = "";
      inputImage.value = "";
      croppedImg.value = "";
    } else {
      // Handle case when croppedImg is not available
      console.error("No cropped image available");
      isLoadingUpload.value = false;
    }
  }
}

async function attachImage(event) {
  if (event.target.files[0].size > 1000000) {
    return notify({
      type: "error",
      message: "图片必须小于1MB,请重新上传"
    });
  } else {
    const file = event.target.files[0];
    uploadedImage.url = URL.createObjectURL(file);
  }
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
    notify({ message: "照片格式错误", type: "error" });
    isLoadingUpload.value = false;
    return null; // Exit the function if file is not valid
  }
  if (file && file.size > 1024000) {
    notify({ message: "上传的图片已大于1mb，请刷新页面重新上传", type: "error" });
    isLoadingUpload.value = false;
    return null; // Exit the function if file is not valid
  }

  var formData = new FormData();
  formData.append("files", file);
  formData.append("dir", dir);
  formData.append("overwrite", false);
  selectedImage.value = URL.createObjectURL(file); // Set the URL for preview

  return await uploadImage(formData);
}
const submitPhotoLoading = ref(false);
async function submitPhoto() {
  if (!selectedImage.value) {
    return notify({ type: "warning", message: "请选择图片" });
  }
  submitPhotoLoading.value = true;
  isLoadingUpload.value = true;
  const data = await saveImage(selectedImage.value);
  profileDialogVisible.value = false;
  updateDialogVisible.value = false;
  notify({ message: "修改成功", type: "success" });
  store.profilePhoto = data.data;
  store.getMemberInfo();
  window.location.reload();
  submitPhotoLoading.value = false;
  isLoadingUpload.value = false;
}

const selectImage = (item) => {
  selectedImage.value = item;
};

const updateDialogVisible = ref(false);
onMounted(() => {
  checkMailboxUnread();
  setInterval(checkMailboxUnread, 60000);
  if (store.profilePhoto && store.profilePhoto.includes("default")) {
    selectedImage.value = store.profilePhoto;
  }
});

const loadMenuItemIcon = (icon) => {
  if (isDark.value) {
    try {
      return require(`@/assets/images/account/menu-icon-${icon}-dark.png`);
    } catch (e) {
      return require(`@/assets/images/account/menu-icon-${icon}.png`);
    }
  } else {
    return require(`@/assets/images/account/menu-icon-${icon}.png`);
  }
};
</script>
<style scoped lang="scss">
.dark {
  .account-container {
    .account-container-wrap {
      .profile-actions {
        .action-btn {
          .icon-rounded {
            img {
              filter: brightness(0) saturate(100%) invert(44%) sepia(45%) saturate(828%) hue-rotate(146deg)
                brightness(85%) contrast(83%);
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
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

.uploader {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
  align-items: center;
  margin: 50px 0;
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
      width: 250px;
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #a4aabb;
      background: #e7f3ff;
      border-radius: 20px;
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
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      text-align: center;
    }
    .croppedImgHolder {
      border: 3px dotted #7a80a1;
      width: 250px;
      height: 250px;
      border-radius: 50%;
    }
  }
}
.cropper {
  height: 250px;
  width: 250px;
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
.profile-dialog.update {
}
</style>

<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.liveStatus"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.name')"
        />

        <!-- 搜索按钮 -->
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadStreamer">
          {{ t('fields.search') }}
        </el-button>

        <!-- 重置按钮 -->
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="showDialog('CREATE')">
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="780px"
    >
      <el-form
        v-if="uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.account')" prop="loginName">
          <el-input v-model="form.loginName" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item
          v-if="uiControl.dialogType === 'CREATE'"
          :label="t('fields.password')"
          prop="password"
        >
          <el-input
            v-model="form.password"
            style="width: 350px;"
            type="password"
            show-password
            maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="t('fields.photo')" prop="avatar">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-image
                v-if="form.avatar && uiControl.dialogType === 'EDIT'"
                :src="form.avatar.startsWith('http:') ? form.avatar : promoDir + form.avatar"
                fit="contain"
                style="aspect-ratio: 1/1"
                class="preview"
              />
              <el-image
                v-else-if="form.avatar"
                :src="promoDir + form.avatar"
                fit="contain"
                style="aspect-ratio: 1/1"
                class="preview"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-button icon="el-icon-upload" size="mini" type="success" @click="$refs.inputImage.click()">
              {{ t('fields.upload') }}
            </el-button>
          </el-row>
          <input id="uploadFile" type="file" ref="inputImage" style="display: none" accept="image/*" @change="attachImage">
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table :data="page.records" v-loading="page.loading" ref="table" row-key="id" size="small" highlight-current-row>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" :label="t('fields.name')" width="200" />
      <el-table-column prop="liveStatus" :label="t('fields.status')" width="100">
        <template #default="scope">
          {{ getStatusName(scope.row.liveStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="loginName" :label="t('fields.account')" width="200" />
      <el-table-column prop="avatar" :label="t('fields.photo')" width="150">
        <template #default="scope">
          <el-image
            v-if="scope.row.avatar"
            style="width: 50px; height: 50px; border: 1px solid grey"
            :src="promoDir + scope.row.avatar"
            class="preview"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope">
          <el-button
            icon="el-icon-key"
            size="mini"
            type="info"
            @click="showChangePasswordDialog(scope.row)"
          >
            {{ t('fields.updatePassword') }}
          </el-button>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="showDialog('EDIT', scope.row)"
          >
            {{ t('fields.edit') }}
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteStreamer(scope.row.id)"
          >
            {{ t('fields.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination"
                   @current-change="changePage"
                   layout="prev, pager, next"
                   :page-size="request.size"
                   :page-count="page.pages"
                   :current-page="request.current"
    />
  </div>
  <el-dialog
    v-model="changePasswordDialog.visible"
    :title="t('fields.updatePassword')"
    width="500px"
  >
    <el-form :model="changePasswordDialog.form" :rules="changePasswordRules" ref="changePasswordRef" label-width="100px">
      <el-form-item :label="t('fields.newPassword')" prop="newPassword">
        <el-input v-model="changePasswordDialog.form.newPassword" type="password" />
      </el-form-item>
      <el-form-item :label="t('fields.confirmPassword')" prop="confirmPassword">
        <el-input v-model="changePasswordDialog.form.confirmPassword" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="changePasswordDialog.visible = false">{{ t('fields.cancel') }}</el-button>
      <el-button type="primary" @click="submitChangePassword">{{ t('fields.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import { createSportLiveStreamer, deleteSportLiveStreamer, getStreamers, updateSportLiveStreamer } from "@/api/sport-live";
import { required, size } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { uploadImage } from "@/api/image";
import { useSessionStorage } from "@vueuse/core";
import { createSiteImage } from '@/api/site-image'

const { t } = useI18n();
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  dialogLoading: false,
  status: [
    { name: t('fields.notStarted'), display: "t('fields.notStarted')", id: 0 },
    { name: t('fields.inProgress'), display: "t('fields.inProgress')", id: 1 },
  ]
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  liveStatus: null,
  name: null,
});

const imageForm = reactive({
  id: null,
  name: null,
  path: null,
  displayPath: null,
  category: null,
  siteId: null,
  remark: null,
  imageDimension: null,
  promoType: null,
})

const changePasswordDialog = reactive({
  visible: false,
  userId: null,
  form: {
    newPassword: '',
    confirmPassword: ''
  }
});

const changePasswordRef = ref(null);

const timezone = ref(null);
const inputImage = ref(null)
const formRef = ref(null);
const store = useStore()
const passwordVisible = reactive({});

function resetQuery() {
  request.status = null;
  request.name = null;
}

async function attachImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  if (data) {
    form.avatar = data;
    await submitImageUpload();
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' });
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0];
  if (!files) return;

  var fr = new FileReader();
  fr.onload = function () {
    var img = new Image();
    img.onload = function () {
      imageForm.imageDimension = img.width + ' * ' + img.height;
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(files);

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowFileType.includes(files.type)) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' });
    return null;
  }

  const formData = new FormData();
  formData.append('files', files);
  formData.append('dir', 'temp');
  formData.append('overwrite', false);

  try {
    const response = await uploadImage(formData);
    return response.code === 0 ? response.data : null;
  } catch (error) {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    return null;
  }
}

function showChangePasswordDialog(row) {
  changePasswordDialog.userId = row.id;
  changePasswordDialog.form.newPassword = '';
  changePasswordDialog.form.confirmPassword = '';
  changePasswordDialog.visible = true;
}

const changePasswordRules = {
  newPassword: [required(t('message.validatePasswordRequired')), size(6, 12, t('message.validatePasswordSize'))],
  confirmPassword: [
    required(t('message.validatePasswordRequired')), size(6, 12, t('message.validatePasswordSize')),
    {
      validator: (rule, value, callback) => {
        if (value !== changePasswordDialog.form.newPassword) {
          callback(new Error(t('message.passwordNotMatch')));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

async function submitChangePassword() {
  await changePasswordRef.value.validate(async (valid) => {
    if (!valid) return;
    await updateSportLiveStreamer({
      id: changePasswordDialog.userId,
      password: changePasswordDialog.form.newPassword
    });
    ElMessage.success(t('message.updateSuccess'));
    changePasswordDialog.visible = false;
    await loadStreamer();
  });
}

function generateRandomString(charSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < charSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

function getStatusName(statusId) {
  const status = uiControl.status.find(item => item.id === statusId);
  return status.name;
}

async function submitImageUpload() {
  imageForm.name = generateRandomString(8);
  imageForm.path = form.avatar;
  imageForm.category = 'PROMO';
  imageForm.siteId = store.state.user.siteId;

  try {
    const response = await createSiteImage(imageForm);

    if (response && response.code === 0) {
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      autoSelectImage();
    } else {
      ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
    }
  } catch (error) {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

function autoSelectImage() {
  if (!form.avatar) {
    return;
  }
  form.avatar = store.state.user.siteId + "/" + form.avatar;
}

async function loadStreamer() {
  page.loading = true;
  const { data: ret } = await getStreamers(request);
  page.pages = ret.pages;
  page.records = ret.records;

  ret.records.forEach(row => {
    passwordVisible[row.id] = false;
  });

  page.loading = false;
}

async function deleteStreamer(teamId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      await deleteSportLiveStreamer(teamId);
      ElMessage({ message: t("message.deleteSuccess"), type: "success" });
      await loadStreamer();
    } catch (error) {
      ElMessage({ message: t("message.deleteFailed"), type: "error" });
    }
  }).catch(() => {
  });
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create();
  } else if (uiControl.dialogType === 'EDIT') {
    edit();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.avatar = form.avatar?.startsWith("http") ? store.state.user.siteId + "/" + form.avatar.split('/').pop() : form.avatar;
      console.log(form);
      await createSportLiveStreamer(form);
      uiControl.dialogVisible = false;
      await loadStreamer();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.avatar = form.avatar?.startsWith("http") ? store.state.user.siteId + "/" + form.avatar.split('/').pop() : form.avatar;
      await updateSportLiveStreamer(form);
      uiControl.dialogVisible = false;
      await loadStreamer();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

function changePage(page) {
  request.current = page;
  loadStreamer();
}

function showDialog(type, row = null) {
  uiControl.dialogVisible = true;
  uiControl.dialogType = type;
  if (type === "EDIT" && row) {
    Object.assign(form, {
      id: row.id,
      name: row.name,
      loginName: row.loginName,
      avatar: row.avatar
    });
    form.id = row.id;
    form.avatar = row.avatar ? promoDir + row.avatar : null;
    console.log(form.avatar)
  } else {
    Object.assign(form, {
      id: null,
      name: null,
      liveStatus: 0,
      loginName: null,
      password: null,
      avatar: null
    });
  }
}

const form = reactive({
  id: null,
  name: null,
  loginName: null,
  password: null,
  avatar: null
});

const formRules = reactive({
  name: [required(t('message.validateNameRequired'))],
  loginName: [required(t('message.validateLoginNameRequired')), size(6, 12, t('message.validateLoginNameSize'))],
});

onMounted(async () => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone
  await loadStreamer();
});

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin-bottom: 10px;
}

.search {
  display: flex;
  justify-content: flex-start;
}

.btn-group {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
</style>

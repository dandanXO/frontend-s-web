<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.sportType"
          size="small"
          :placeholder="t('fields.sportType')"
          class="filter-item"
          style="width: 120px;"
        >
          <el-option
            v-for="item in uiControl.sport"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-input
          v-model="request.nameEn"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.teamNameEn')"
        />

        <el-input
          v-model="request.nameZh"
          size="small"
          style="width: 200px; margin-left: 5px"
          :placeholder="t('fields.teamNameZh')"
        />

        <!-- 搜索按钮 -->
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadTeam">
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
        <el-form-item :label="t('fields.sportType')" prop="sportId">
          <el-select
            v-model="form.sportId"
            size="small"
            :placeholder="t('fields.sportType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.sport"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.teamNameEn')" prop="nameEn">
          <el-input v-model="form.nameEn" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.teamNameZh')" prop="nameZh">
          <el-input v-model="form.nameZh" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.teamIcon')" prop="icon">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-image
                v-if="form.icon && uiControl.dialogType === 'EDIT'"
                :src="form.icon.startsWith('http:') ? form.icon : promoDir + form.icon"
                fit="contain"
                style="aspect-ratio: 1/1"
                class="preview"
              />
              <el-image
                v-else-if="form.icon"
                :src="promoDir + form.icon"
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
      <el-table-column prop="id" label="ID" width="240" />
      <el-table-column prop="sportId" :label="t('fields.sportType')" width="200" />
      <el-table-column prop="nameEn" :label="t('fields.teamNameEn')" width="350" />
      <el-table-column prop="nameZh" :label="t('fields.teamNameZh')" width="350" />
      <el-table-column prop="icon" :label="t('fields.teamIcon')" width="150">
        <template #default="scope">
          <el-image v-if="scope.row.icon" :src="promoDir + scope.row.icon" class="preview" />
        </template>
      </el-table-column>
      <el-table-column :label="t('fields.operate')" align="right" fixed="right">
        <template #default="scope">
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
            @click="deleteTeam(scope.row.id)"
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
</template>

<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { getSiteTimeZoneById } from "@/api/site";
import { createSportLiveTeam, deleteSportLiveTeam, getTeams, updateSportLiveTeam } from "@/api/sport-live";
import { required } from "@/utils/validate";
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
  sport: [
    { name: 'FOOTBALL', display: '足球', id: 1 },
    { name: 'BASKETBALL', display: '篮球', id: 2 },
    { name: 'LOL', display: 'LOL', id: 3 },
    { name: 'CSGO', display: 'CSGO', id: 4 },
    { name: 'DOTA2', display: 'DOTA2', id: 5 },
    { name: 'KOG', display: '王者荣耀', id: 6 },
  ],
  eventStatus: computed(() => [
    { name: '1', display: t('fields.active') },
    { name: '2', display: t('fields.inactive') },
  ]),
});
const page = reactive({
  pages: 0,
  records: [],
  loading: false
});
const request = reactive({
  size: 30,
  current: 1,
  sportType: null,
  nameZh: null,
  nameEn: null,
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

const timezone = ref(null);
const inputImage = ref(null)
const formRef = ref(null);
const store = useStore()

function resetQuery() {
  request.sportType = null;
  request.nameEn = null;
  request.nameZh = null;
}

async function attachImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const data = await attachPhoto(event);
  if (data) {
    form.icon = data;
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

function generateRandomString(charSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < charSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

async function submitImageUpload() {
  imageForm.name = generateRandomString(8);
  imageForm.path = form.icon;
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
  if (!form.icon) {
    return;
  }
  form.icon = store.state.user.siteId + "/" + form.icon;
}

async function loadTeam() {
  page.loading = true;
  const { data: ret } = await getTeams(request);
  page.pages = ret.pages;
  page.records = ret.records;
  page.loading = false;
}

async function deleteTeam(teamId) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: "warning",
  }).then(async () => {
    try {
      console.log(teamId)
      await deleteSportLiveTeam(teamId);
      ElMessage({ message: t("message.deleteSuccess"), type: "success" });
      await loadTeam();
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
      form.icon = form.icon?.startsWith("http") ? store.state.user.siteId + "/" + form.icon.split('/').pop() : form.icon;
      console.log(form);
      await createSportLiveTeam(form);
      uiControl.dialogVisible = false;
      await loadTeam();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.icon = form.icon?.startsWith("http") ? store.state.user.siteId + "/" + form.icon.split('/').pop() : form.icon;
      await updateSportLiveTeam(form);
      uiControl.dialogVisible = false;
      await loadTeam();
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    }
  });
}

function changePage(page) {
  request.current = page;
  loadTeam();
}

function showDialog(type, row = null) {
  uiControl.dialogVisible = true;
  uiControl.dialogType = type;
  if (type === "EDIT" && row) {
    Object.assign(form, {
      id: row.id,
      sportId: row.sportId,
      nameZh: row.nameZh,
      nameEn: row.nameEn,
      icon: row.icon
    });
    form.id = row.id;
    form.icon = row.icon ? promoDir + row.icon : null;
    console.log(form.icon)
  } else {
    Object.assign(form, {
      id: null,
      sportId: null,
      nameZh: null,
      nameEn: null,
      icon: null
    });
  }
}

const form = reactive({
  id: null,
  sportId: null,
  nameZh: null,
  nameEn: null,
  icon: null
});

const formRules = reactive({
  nameZh: [required(t('message.validateTeamNameRequired'))],
  nameEn: [required(t('message.validateTeamNameRequired'))],
  icon: [required(t('message.validateTeamIconRequired'))]
});

onMounted(async () => {
  const store = useStore()
  const { data: timeZone } = getSiteTimeZoneById(
    store.state.user.siteId
  )
  timezone.value = timeZone
  await loadTeam();
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

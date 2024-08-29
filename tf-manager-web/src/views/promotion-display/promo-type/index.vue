<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="changeSiteSearch"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-if="uiControl.showSiteTypeSearch"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="t('siteType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          clearable
          v-model="request.status"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px;margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('common.status.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadPromoType"
        >{{ t('fields.search') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">{{ t('fields.reset') }}</el-button>
      </div>
      <div class="btn-group" v-if="!hasRole(['SUB_TENANT'])">
        <el-button icon="el-icon-plus" size="mini" type="primary" v-permission="['sys:promo-type:add']" @click="showDialog('CREATE')">{{ t('fields.add') }}</el-button>
        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          v-permission="['sys:promo-type:update']"
          @click="showEdit()"
          :disabled="uiControl.editBtn"
        >{{ t('fields.edit') }}</el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promo-type:del']"
          @click="removePromoType()"
          :disabled="uiControl.removeBtn"
        >{{ t('fields.delete') }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="720px"
    >
      <el-form
        ref="promoTypeForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @change="changeSite"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.siteType')" prop="siteType" v-if="uiControl.showSiteType">
          <el-select
            v-model="form.siteType"
            size="small"
            class="filter-item"
            :placeholder="t('fields.siteType')"
            style="width: 350px"
            :disabled="uiControl.dialogType === 'EDIT'"
          >
            <el-option
              v-for="item in siteType.list"
              :key="item.value"
              :label="t('siteType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.name')" prop="name">
          <div v-for="(item, index) in name" :key="index">
            <el-select
              v-model="item.key"
              size="small"
              :placeholder="t('fields.language')"
              class="filter-item"
              style="width: 170px; margin-top: 5px"
            >
              <el-option
                v-for="lang in uiControl.language"
                :key="lang.key"
                :label="t(`language.${lang.displayName}`)"
                :value="lang.value"
              />
            </el-select>
            :
            <el-input style="width: 170px " v-model="item.value" />
            <el-button
              v-if="index === name.length - 1"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              style="margin-left: 20px"
              @click="addName()"
              plain
            >
              {{ t('fields.add') }}
            </el-button>
            <el-button
              v-else
              icon="el-icon-remove"
              size="mini"
              type="danger"
              style="margin-left: 20px"
              @click="delName(index)"
              plain
            >
              {{ t('fields.delete') }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item :label="t('fields.value')" prop="value">
          <el-input v-model="form.value" style="width: 350px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            controls-position="right"
            style="width: 350px;"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.icon')"
          prop="iconUrl"
        >
          <el-row :gutter="5">
            <el-col v-if="form.iconUrl" style="width: 350px">
              <el-image
                v-if="form.iconUrl"
                :src="promoDir + form.iconUrl"
                fit="contain"
                class="preview"
                :preview-src-list="[promoDir + form.iconUrl]"
              />
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              v-permission="['sys:siteimage:add']"
              @click="showImageDialog()"
            >
              {{ t('fields.upload') }}
            </el-button>
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('ICON', false)"
            >
              {{ t('fields.browse') }}
            </el-button>
            <el-button
              v-if="form.iconUrl"
              icon="el-icon-remove"
              size="mini"
              type="danger"
              @click="form.iconUrl = ''"
            >
              {{ t('fields.remove') }}
            </el-button>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="page.loading"
      :empty-text="t('fields.noData')"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="120" />
      <el-table-column v-if="uiControl.showSiteTypeColumn" prop="siteType" :label="t('fields.siteType')" width="200">
        <template #default="scope">
          {{ t('siteType.' + scope.row.siteType) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('fields.name')" width="200">
        <template #default="scope">
          <span>{{ getName(scope.row.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" :label="t('fields.value')" width="200" />
      <el-table-column prop="status" :label="t('fields.state')" width="200">
        <template #default="scope">
          <el-switch
            v-if="hasPermission(['sys:promo-type:update:state'])"
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changestatus(scope.row.id, scope.row.status)"
          />
          <el-switch
            v-else
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{data: scope.row.createTime, timeZone: scope.row.timeZone, type: 'date'}"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column :label="t('fields.operate')" align="right" v-if="!hasRole(['SUB_TENANT']) && (hasPermission(['sys:promo-type:update'])|| hasPermission(['sys:promo-type:del']))">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" v-permission="['sys:promo-type:update']" @click="showEdit(scope.row)" />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:promo-type:del']"
            @click="removePromoType(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="changePage"
      layout="prev, pager, next"
      :page-size="request.size"
      :page-count="page.pages"
      :current-page="request.current"
    />
    <el-dialog
      :title="uiControl.imageSelectionTitle"
      v-model="uiControl.imageSelectionVisible"
      append-to-body
      width="50%"
      :close-on-press-escape="false"
    >
      <div class="search">
        <el-input
          v-model="imageRequest.name"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.imageName')"
        />
        <el-select
          v-model="imageRequest.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          ref="searchImage"
          @click="loadSiteImage()"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetImageQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="grid-container">
        <div
          v-for="item in imageList.list"
          :key="item"
          class="grid-item"
          :class="item.id === selectedImage.id ? 'selected' : ''"
        >
          <el-image
            :src="promoDir + item.path"
            fit="contain"
            style="aspect-ratio: 1/1"
            @click="selectImage(item)"
          />
        </div>
      </div>
      <el-pagination
        class="pagination"
        @current-change="changeImagePage"
        layout="prev, pager, next"
        :page-size="imageRequest.size"
        :page-count="imageList.pages"
        :current-page="imageRequest.current"
      />
      <div class="image-info" v-if="selectedImage.id !== 0">
        <el-row>
          <el-col :span="4">
            <h3>{{ t('fields.selectedImage') }}</h3>
          </el-col>
          <el-col :span="20">
            <el-image
              :src="promoDir + selectedImage.path"
              fit="contain"
              class="smallPreview"
              :preview-src-list="[promoDir + selectedImage.path]"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageSite') }} :</el-col>
          <el-col :span="20">{{ selectedImage.siteName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageName') }} :</el-col>
          <el-col :span="20">{{ selectedImage.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ t('fields.imageRemark') }} :</el-col>
          <el-col :span="20">{{ selectedImage.remark }}</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.imageSelectionVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitImage">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="uiControl.uploadDialogTitle"
      v-model="uiControl.uploadDialogVisible"
      append-to-body
      width="600px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="imageFormRef"
        :model="imageForm"
        :rules="imageFormRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <div id="preview">
          <el-image
            v-if="uploadedImage.url"
            :src="uploadedImage.url"
            :fit="contain"
            :preview-src-list="[uploadedImage.url]"
          />
        </div>
        <el-form-item :label="t('fields.image')" prop="path">
          <el-row :gutter="10">
            <el-col :span="2">
              <!-- eslint-disable -->
              <input
                id="uploadFile"
                type="file"
                ref="inputImage"
                style="display: none"
                accept="image/*"
                @change="attachImage"
              />
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="$refs.inputImage.click()"
              >
                {{ t('fields.upload') }}
              </el-button>
            </el-col>
            <el-col :span="1" />
          </el-row>
        </el-form-item>
        <el-form-item :label="t('fields.imageName')" prop="name">
          <el-input v-model="imageForm.name" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.category')" prop="category">
          <span style="width: 350px">{{ t('fields.promo') }}</span>
        </el-form-item>
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="imageForm.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.promoType')" prop="promoType">
          <span style="width: 350px">{{ t('fields.other') }}</span>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            v-model="imageForm.remark"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.uploadDialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitImageUpload">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>

import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage, ElMessageBox } from "element-plus";
import { createPromoType, updatePromoType, getPromoType, updatestatus, deletePromoType } from "@/api/promo-type";
import { getSiteListSimple } from "@/api/site";
import { hasRole, hasPermission } from "@/utils/util";
import { useI18n } from "vue-i18n";
import { useStore } from '@/store';
import { isVnm } from '@/utils/site'
import { TENANT } from "@/store/modules/user/action-types";
import { createSiteImage, getSiteImage } from '@/api/site-image'
import { uploadImage } from '@/api/image'
import { useSessionStorage } from "@vueuse/core";

const store = useStore();
const { t, locale } = useI18n();
const promoTypeForm = ref(null);
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const name = ref([])
const inputImage = ref(null)
const imageFormRef = ref(null)
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const siteList = reactive({
  list: []
});
const imageList = reactive({
  dataList: [],
  pages: 0,
})
const uploadedImage = reactive({
  url: null,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  editBtn: true,
  removeBtn: true,
  status: [
    { key: 1, displayName: "OPEN", value: true },
    { key: 2, displayName: "CLOSE", value: false }
  ],
  showSiteType: false,
  showSiteTypeSearch: false,
  showSiteTypeColumn: false,
  imageSelectionTitle: '',
  imageSelectionVisible: false,
  uploadDialogTitle: '',
  uploadDialogVisible: false,
  language: [
    { key: 1, displayName: 'en', value: 'en' },
    { key: 2, displayName: 'zh', value: 'zh' },
    { key: 3, displayName: 'th', value: 'th' },
    { key: 4, displayName: 'kr', value: 'kr' },
    { key: 5, displayName: 'vn', value: 'vn' },
  ]
});

const siteType = reactive({
  list: [
    { displayName: 'main', value: 'main' },
    { displayName: 'slot', value: 'slot' },
  ],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false
});

const request = reactive({
  size: 30,
  current: 1,
  status: null,
  siteType: null,
  siteId: null,
});

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const form = reactive({
  id: null,
  siteId: null,
  siteType: null,
  name: null,
  value: null,
  sequence: 1,
  iconUrl: null
});

const validateName = (rule, value, callback) => {
  const inputName = JSON.parse(constructName())
  if (!Object.entries(inputName)[0] || !Object.values(inputName)[0]) {
    callback(new Error(t('message.validateNameRequired')))
  }
  callback()
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [{ validator: validateName, trigger: 'blur' }],
  value: [required(t('message.validateValueRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))]
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

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  promoType: [required(t('messsage.validatePromoTypeRequired'))],
})

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

let choosePromoType = [];

function resetQuery() {
  request.status = null;
  request.siteId = site.value ? site.value.id : siteList.list[0].id;
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSiteSearch() {
  request.siteType = 'main'
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
  } else {
    uiControl.showSiteTypeSearch = false;
  }
}

async function changeSite() {
  form.siteType = 'main'
  if (isVnm(form.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
}

function handleSelectionChange(val) {
  choosePromoType = val;
  if (choosePromoType.length === 0) {
    uiControl.editBtn = true;
    uiControl.removeBtn = true;
  } else if (choosePromoType.length === 1) {
    uiControl.editBtn = false;
    uiControl.removeBtn = false;
  } else {
    uiControl.editBtn = true;
    uiControl.removeBtn = false;
  }
}

async function loadPromoType() {
  page.loading = true;
  const { data: ret } = await getPromoType(request);
  page.pages = ret.pages;
  ret.records.forEach(data => {
    data.timeZone = store.state.user.sites.find(e => e.id === data.siteId) !== undefined
      ? store.state.user.sites.find(e => e.id === data.siteId).timeZone
      : null
  });
  page.records = ret.records;
  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeColumn = true
  } else {
    uiControl.showSiteTypeColumn = false
  }
  page.loading = false;
}

function changePage(page) {
  request.current = page;
  loadPromoType();
}

function showDialog(type) {
  if (type === "CREATE") {
    if (promoTypeForm.value) {
      promoTypeForm.value.resetFields();
    }
    name.value = []
    addName()
    form.id = null;
    form.siteId = request.siteId;
    form.siteType = request.siteType
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
    uiControl.dialogTitle = t('fields.addPromoType');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editPromoType');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(promoType) {
  showDialog("EDIT");
  if (!promoType) {
    promoType = choosePromoType[0];
  }
  nextTick(() => {
    for (const key in promoType) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = promoType[key];
      }
    }

    name.value = []
    Object.entries(JSON.parse(form.name)).forEach(
      ([key, value]) => {
        const json = {}
        json.key = key
        json.value = value
        name.value.push(json)
      }
    )
    addName()

    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true;
    } else {
      uiControl.showSiteType = false;
    }
  });
}

/**
 * 新增公告类型
 */
function create() {
  promoTypeForm.value.validate(async (valid) => {
    if (valid) {
      form.name = constructName()
      await createPromoType(form);
      uiControl.dialogVisible = false;
      await loadPromoType();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

/**
 * 编辑公告类型
 */
function edit() {
  promoTypeForm.value.validate(async (valid) => {
    if (valid) {
      form.name = constructName()
      await updatePromoType(form.id, form);
      uiControl.dialogVisible = false;
      await loadPromoType();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function changestatus(id, state) {
  await updatestatus(id, state);
}

async function removePromoType(promoType) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    if (promoType) {
      await deletePromoType([promoType.id]);
    } else {
      await deletePromoType(choosePromoType.map(a => a.id));
    }
    await loadPromoType();
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

function addName() {
  name.value.push({
    key: '',
    value: '',
  })
}

function delName(index) {
  name.value.splice(index, 1)
}

function constructName() {
  const json = {}
  Object.values(name.value).forEach(item => {
    if (item.key) {
      json[item.key] = item.value
    }
  })
  return JSON.stringify(json)
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  siteList.list = site;
}

function showImageDialog() {
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = 'PROMO'
  imageForm.promoType = 'OTHER'
  imageForm.siteId = form.siteId
  uiControl.uploadDialogTitle = t('fields.addImage')
  uiControl.uploadDialogVisible = true
}

async function loadSiteImage() {
  selectedImage.id = 0
  imageRequest.promoType = 'OTHER'
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : null
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

function browseImage() {
  loadSiteImage()
  uiControl.imageSelectionTitle = t('fields.icon')
  uiControl.imageSelectionVisible = true
}

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    imageForm.path = data.data
    inputImage.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
  }
}

async function attachPhoto(event) {
  const files = event.target.files[0]

  // record file dimension
  var fr = new FileReader()
  fr.onload = function() {
    var img = new Image()
    img.onload = function() {
      imageForm.imageDimension = img.width + ' * ' + img.height
    }
    img.src = fr.result
  }
  fr.readAsDataURL(files)

  const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
  const dir = 'temp'
  if (!allowFileType.find(ftype => ftype.includes(files.type))) {
    ElMessage({ message: t('message.invalidFileType'), type: 'error' })
  } else {
    var formData = new FormData()
    formData.append('files', files)
    formData.append('dir', dir)
    formData.append('overwrite', false)
    uploadedImage.url = URL.createObjectURL(files)
    return await uploadImage(formData)
  }
}

function submitImageUpload() {
  imageFormRef.value.validate(async valid => {
    if (valid) {
      await createSiteImage(imageForm)
      uiControl.uploadDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function submitImage() {
  form.iconUrl = selectedImage.path
  uiControl.imageSelectionVisible = false
}

function getName(nameStr) {
  const json = JSON.parse(nameStr)
  if (json[locale.value]) {
    return json[locale.value]
  } else {
    return Object.values(json)[0]
  }
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    request.siteId = siteList.list[0].id
  }

  if (isVnm(request.siteId)) {
    uiControl.showSiteTypeSearch = true;
    request.siteType = 'main'
  } else {
    uiControl.showSiteTypeSearch = false;
  }

  await loadPromoType();
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

<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="request.name"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.name')"
        />
        <el-input
          v-model="request.code"
          size="small"
          style="width: 200px; margin-left: 10px;"
          :placeholder="t('fields.code')"
        />
        <el-select
          v-model="request.type"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('giftType.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.status"
          size="small"
          :placeholder="t('fields.status')"
          class="filter-item"
          style="width: 200px; margin-left: 10px;"
          @focus="loadSites"
        >
          <el-option
            v-for="item in uiControl.status"
            :key="item.key"
            :label="t('status.gift.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" icon="el-icon-search" size="mini" type="success" @click="loadGift">
          {{ t('fields.search') }}
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" type="warning" @click="resetQuery()">
          {{ t('fields.reset') }}
        </el-button>
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:gift:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="680px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId" v-if="!hasRole(['TENANT'])">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadSites"
          >
            <el-option
              v-for="item in sites.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.name')" prop="name">
          <el-input v-model="form.name" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.code')" prop="code">
          <el-input v-model="form.code" style="width: 350px;" maxlength="50" />
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="type">
          <el-radio-group v-model="form.type" style="width: 300px;">
            <el-radio
              v-for="item in uiControl.type"
              :key="item.key"
              :label="item.value"
              size="small"
            >{{ t('giftType.' + item.displayName) }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group v-model="form.status" style="width: 300px;">
            <el-radio
              v-for="item in uiControl.status"
              :key="item.key"
              :label="item.value"
              size="small"
            >{{ t('status.gift.' + item.displayName) }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('fields.redeemPoints')" prop="redeemPoints">
          <el-input v-model="form.redeemPoints" style="width: 350px" maxlength="11" @keypress="restrictDecimalInput($event)" />
        </el-form-item>
        <el-form-item :label="t('fields.limitNumber')" prop="limitNumber">
          <el-input v-model="form.limitNumber" style="width: 350px" maxlength="11" @keypress="restrictInput($event)" />
        </el-form-item>
        <el-row>
          <el-form-item :label="t('fields.desktopImage')" prop="desktopImgUrl">
            <el-row :gutter="5">
              <el-col v-if="form.desktopImgUrl" :span="18" style="width: 250px">
                <el-image
                  v-if="form.desktopImgUrl"
                  :src="promoDir + form.desktopImgUrl"
                  fit="contain"
                  class="preview"
                  :preview-src-list="[promoDir + form.desktopImgUrl]"
                />
              </el-col>
              <el-col :span="6">
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('DESKTOP_IMG')"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="t('fields.mobileImage')" prop="mobileImgUrl">
            <el-row :gutter="5">
              <el-col v-if="form.mobileImgUrl" :span="18" style="width: 250px">
                <el-image
                  v-if="form.mobileImgUrl"
                  :src="promoDir + form.mobileImgUrl"
                  fit="contain"
                  class="preview"
                  :preview-src-list="[promoDir + form.mobileImgUrl]"
                />
              </el-col>
              <el-col :span="6">
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('MOBILE_IMG')"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
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
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="name" :label="t('fields.name')" width="180" />
      <el-table-column prop="code" :label="t('fields.code')" width="180" />
      <el-table-column prop="status" :label="t('fields.status')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'OPEN'" type="success" size="mini">{{ t('status.gift.' + scope.row.status) }}</el-tag>
          <el-tag v-if="scope.row.status === 'CLOSE'" type="danger" size="mini">{{ t('status.gift.' + scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('fields.type')" width="140">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'ENTITY'" size="mini">{{ t('giftType.' + scope.row.type) }}</el-tag>
          <el-tag v-if="scope.row.type === 'VIRTUAL'" type="warning" size="mini">{{ t('giftType.' + scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="redeemPoints" :label="t('fields.redeemPoints')" width="150">
        <template #default="scope">
          $ <span v-formatter="{data: scope.row.redeemPoints,type: 'money'}" />
        </template>
      </el-table-column>
      <el-table-column prop="limitNumber" :label="t('fields.limitNumber')" width="120" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" width="120" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" width="200" />
      <el-table-column :label="t('fields.operate')" align="center" v-if="!hasRole(['SUB_TENANT']) && hasPermission(['sys:gift:update'])" fixed="right">
        <template #default="scope">
          <el-button icon="el-icon-edit" size="mini" type="success" @click="showEdit(scope.row)"
                     v-permission="['sys:gift:update']"
          >
            {{ t('fields.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="page.total"
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadGift"
      @size-change="loadGift"
    />
  </div>
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
          v-for="item in sites.list"
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
        @click="loadSiteImage"
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
</template>

<script setup>

import { computed, reactive, ref } from "vue";
import { required } from "@/utils/validate";
import { ElMessage } from "element-plus";
import { getSiteListSimple } from "@/api/site";
import { getGift, createGift, updateGift } from "@/api/gift";
import { hasRole, hasPermission } from "@/utils/util";
import { nextTick, onMounted } from "@vue/runtime-core";
import { useStore } from '@/store';
import { TENANT } from "@/store/modules/user/action-types";
import { useI18n } from "vue-i18n";
import { getSiteImage } from "@/api/site-image";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'

const imageList = reactive({
  dataList: [],
  pages: 0,
})

const request = reactive({
  size: 20,
  current: 1,
  siteId: null,
  name: null,
  code: null,
  type: null,
  status: null
});

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const formRef = ref(null);
const sites = reactive({
  list: []
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "CREATE",
  removeBtn: true,
  status: [
    { key: 1, displayName: 'OPEN', value: 'OPEN' },
    { key: 2, displayName: 'CLOSE', value: 'CLOSE' }
  ],
  type: [
    { key: 1, displayName: 'ENTITY', value: 'ENTITY' },
    { key: 2, displayName: 'VIRTUAL', value: 'VIRTUAL' }
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false
});

const page = reactive({
  pages: 0,
  records: [],
  total: 0,
  loading: false
});

const form = reactive({
  siteId: null,
  name: null,
  code: null,
  type: null,
  redeemPoints: null,
  limitNumber: null,
  desktopImgUrl: null,
  mobileImgUrl: null,
  status: null
});

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  name: [required(t('message.validateNameRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  type: [required(t('message.validateTypeRequired'))],
  status: [required(t('message.validateStatusRequired'))],
  redeemPoints: [required(t('message.validateRedeemPointsRequired'))],
  limitNumber: [required(t('message.validateLimitNumberRequired'))],
  desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  mobileImgUrl: [required(t('message.validateMobileImageRequired'))]
});

function restrictInput(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

function restrictDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    form.redeemPoints !== null &&
    form.redeemPoints.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
  }
}

async function loadGift() {
  page.loading = true;
  const requestCopy = { ...request };
  const query = {};
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value;
    }
  });
  const { data: ret } = await getGift(query);
  page.pages = ret.pages;
  page.records = ret.records;
  page.total = ret.total;
  page.loading = false;
}

function showDialog(type) {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  if (type === "CREATE") {
    form.siteId = request.siteId;
    form.status = 'OPEN';
    uiControl.dialogTitle = t('fields.addGift');
  } else if (type === "EDIT") {
    uiControl.dialogTitle = t('fields.editGift');
  }
  uiControl.dialogType = type;
  uiControl.dialogVisible = true;
}

function showEdit(gift) {
  showDialog("EDIT");
  form.id = gift.id
  nextTick(() => {
    for (const key in gift) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = gift[key];
      }
    }
  });
}

function submit() {
  if (uiControl.dialogType === "CREATE") {
    create();
  } else if (uiControl.dialogType === "EDIT") {
    edit();
  }
}

function create() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createGift(form);
      uiControl.dialogVisible = false;
      await loadGift();
      ElMessage({ message: t('message.addSuccess'), type: "success" });
    }
  });
}

function edit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateGift(form);
      uiControl.dialogVisible = false;
      await loadGift();
      ElMessage({ message: t('message.editSuccess'), type: "success" });
    }
  });
}

async function loadSites() {
  const { data: site } = await getSiteListSimple();
  sites.list = site;
}

function resetQuery() {
  request.siteId = site.value.id;
  request.name = null;
  request.code = null;
  request.type = null;
  request.status = null;
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

async function browseImage(type) {
  await loadSiteImage()
  switch (type) {
    case 'DESKTOP_IMG':
      uiControl.imageSelectionTitle = t('fields.desktopImage')
      break
    case 'MOBILE_IMG':
      uiControl.imageSelectionTitle = t('fields.mobileImage')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
  switch (uiControl.imageSelectionType) {
    case 'DESKTOP_IMG':
      form.desktopImgUrl = selectedImage.path
      break
    case 'MOBILE_IMG':
      form.mobileImgUrl = selectedImage.path
      break
  }
  uiControl.imageSelectionVisible = false
}

onMounted(async () => {
  await loadSites();
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName);
  } else {
    site.value = sites.list[0];
  }
  request.siteId = site.value.id;
  await loadGift();
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

.el-form-item--level-color:deep .el-form-item__content {
  display: flex !important;
}
</style>

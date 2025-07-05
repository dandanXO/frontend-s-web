<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-select
          v-model="request.type"
          size="small"
          class="filter-item"
          :placeholder="t('fields.redirectType')"
          style="width: 170px;margin-right:10px;"
        >

          <el-option
            v-for="item in redirectType.list"
            :key="item.value"
            :label="t('fields.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px; margin-right: 10px"
          :placeholder="t('fields.title')"
        />
        <el-select
          v-if="uiControl.showSiteType === true"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-right:10px;"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 200px;margin-left:10px;margin-right:10px;display:none"
          @focus="loadSites"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadRedirect"
          :disabled="!uiControl.isLoaded"
        >
          {{ t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetQuery()"
        >
          {{ t('fields.reset') }}
        </el-button>
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="showDialog('CREATE')"
          v-permission="['sys:site:redirect:create']"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
    </div>
    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      v-loading="page.loading"
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column
        prop="title"
        :label="t('fields.title')"
        min-width="250"
      />
      <el-table-column prop="type" :label="t('fields.type')" min-width="250">
        <template #default="scope">
          <span v-if="scope.row.type === 'GAME'">
            {{ t('fields.gameCode') }}
          </span>
          <span v-else-if="scope.row.type === 'PROMO'">
            {{ t('fields.promo') }}
          </span>
          <span v-else-if="scope.row.type === 'DOMAIN'">
            {{ t('fields.domainEasy') }}
          </span>
          <span v-else-if="scope.row.type === 'VIDEO'">
            {{ t('fields.videoShiPin') }}
          </span>
          <span v-else-if="scope.row.type === 'CHARITY'">
            {{ t('fields.CHARITY') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="platform"
        :label="t('fields.platform')"
        min-width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.platform">{{ scope.row.platform }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="t('fields.status')"
        min-width="200"
      >
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.status"
            size="mini"
            v-if="hasPermission(['sys:site:redirect:update'])"
            @change="changeRedirectStatus(scope.row)"
          >
            <el-radio-button label="1">
              {{ t('common.status.OPEN') }}
            </el-radio-button>
            <el-radio-button label="0">
              {{ t('common.status.CLOSE') }}
            </el-radio-button>
            <el-radio-button label="2">
              {{ t('common.status.TEST') }}
            </el-radio-button>
          </el-radio-group>
          <div v-else>
            <div v-if="scope.row.status === 0" style="color:red">
              {{ t('common.status.CLOSE') }}
            </div>
            <div v-if="scope.row.status === 1" style="color: green;">
              {{ t('common.status.OPEN') }}
            </div>
            <div v-if="scope.row.status === 2">
              {{ t('common.status.TEST') }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        :label="t('fields.startTime')"
        width="180"
      >
        <template #default="scope">
          <span v-if="scope.row.startTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.startTime !== null"
            v-formatter="{
              data: scope.row.startTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="t('fields.endTime')" width="180">
        <template #default="scope">
          <span v-if="scope.row.endTime === null">-</span>
          <!-- eslint-disable -->
          <span
            v-if="scope.row.endTime !== null"
            v-formatter="{
              data: scope.row.endTime,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('fields.operate')"
        align="right"
        fixed="right"
        width="200"
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:site:redirect:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:site:redirect:del']"
            @click="removeRedirect(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[20, 50, 100, 150]"
      layout="total,sizes,prev, pager, next"
      class="pagination"
      v-model:page-size="request.size"
      v-model:page-count="page.pages"
      v-model:current-page="request.current"
      @current-change="loadRedirect"
      @size-change="loadRedirect"
    />
  </div>

  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="700px"
  >
    <el-form
      v-if="
        uiControl.dialogType === 'CREATE' || uiControl.dialogType === 'EDIT'
      "
      ref="formRef"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="200px"
    >
      <el-form-item :label="t('fields.title')" prop="title">
        <el-input v-model="form.title" style="width: 350px;" maxlength="100" />
      </el-form-item>
      <el-form-item
        :label="t('fields.site')"
        prop="siteId"
        v-if="!hasRole(['TENANT'])"
      >
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadSites"
          @change="form.platform = null"
        >
          <el-option
            v-for="item in sites.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('fields.siteType')"
        prop="siteType"
        v-if="uiControl.showDialogSiteType === true"
      >
        <el-select
          v-model="form.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 350px;"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.type')" prop="type">
        <el-select
          v-model="form.type"
          size="small"
          :placeholder="t('fields.type')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
        >
          <el-option
            v-for="item in uiControl.type"
            :key="item.key"
            :label="t('fields.' + item.displayName)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.code')" prop="code">
        <el-select
          v-if="form.type === 'PROMO'"
          v-model="form.code"
          size="small"
          :placeholder="t('fields.code')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadPrivileges"
        >
          <el-option
            v-for="item in privileges.list"
            :key="item.id"
            :label="item.title"
            :value="item.redirectUrl"
          />
        </el-select>
        <el-input
          v-else
          v-model="form.code"
          style="width: 350px;"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item
        v-if="form.type === 'GAME'"
        :label="t('fields.platform')"
        prop="platform"
      >
        <el-select
          v-model="form.platform"
          size="small"
          :placeholder="t('fields.platform')"
          class="filter-item"
          style="width: 350px;"
          default-first-option
          @focus="loadPlatform"
        >
          <el-option
            v-for="item in platforms.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type" :label="t('fields.desktopImage')" prop="icon" style="width: 550px">
        <el-row >
          <el-col v-if="form.icon" :span="18" style="width: 350px">
            <el-image
              v-if="form.icon && form.type === 'PROMO'"
              :src="promoDir + form.icon"
              fit="contain"
              class="preview"
              style="max-width: 230px;"
              :preview-src-list="[promoDir + form.icon]"
            />
            <el-image
              v-if="form.icon && form.type === 'GAME'"
              :src="gameDir + form.icon"
              fit="contain"
              class="preview"
              style="max-width: 230px;"
              :preview-src-list="[gameDir + form.icon]"
            />
          </el-col>
          <el-col>
            <el-button
              v-if="form.type !== 'GAME' || form.platform !== null"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="showImageDialog('DESKTOP_IMAGE')"
            >
              {{ t('fields.upload') }}
            </el-button>
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('DESKTOP_IMAGE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="form.type" :label="t('fields.mobileImage')" prop="icon" style="width: 550px">
        <el-row>
          <el-col v-if="form.iconMobile" :span="18" style="width: 350px">
            <el-image
              v-if="form.iconMobile && form.type === 'PROMO'"
              :src="promoDir + form.iconMobile"
              fit="contain"
              class="preview"
              style="max-width: 230px;"
              :preview-src-list="[promoDir + form.iconMobile]"
            />
            <el-image
              v-if="form.iconMobile && form.type === 'GAME'"
              :src="gameDir + form.iconMobile"
              fit="contain"
              class="preview"
              style="max-width: 230px;"
              :preview-src-list="[gameDir + form.iconMobile]"
            />
          </el-col>
          <el-col>
            <el-button
              v-if="form.type !== 'GAME' || form.platform !== null"
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="showImageDialog('MOBILE_IMAGE')"
            >
              {{ t('fields.upload') }}
            </el-button>
            <el-button
              icon="el-icon-search"
              size="mini"
              type="success"
              @click="browseImage('MOBILE_IMAGE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="VIP" prop="vips">
        <el-checkbox
          v-model="checkboxes.vip.checkAll"
          :indeterminate="checkboxes.vip.isIndeterminate"
          @change="handleVIPCheckAllChange"
        >
          {{ t('fields.checkall') }}
        </el-checkbox>
        <el-checkbox-group
          v-model="selectedVIPs.vipChecked"
          @change="handleCheckedChange"
          style="width: 300px"
        >
          <el-checkbox v-for="v in vipList.list" :label="v.id" :key="v.id">
            {{ v.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="t('fields.showTime')" prop="showTime">
        <el-switch
          v-model="form.showTime"
          active-color="#409EFF"
          inactive-color="#F56C6C"
        />
      </el-form-item>
      <el-form-item :label="t('fields.specificMember')" prop="specificMember">
        <el-switch
          v-model="form.specificMember"
          active-color="#409EFF"
          inactive-color="#F56C6C"
        />
      </el-form-item>
      <el-form-item :label="t('fields.startTime')" prop="startTime">
        <el-date-picker
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="form.startTime"
          style="width: 350px;"
        />
      </el-form-item>
      <el-form-item :label="t('fields.endTime')" prop="endTime">
        <el-date-picker
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="form.endTime"
          style="width: 350px;"
        />
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>

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
          v-if="imageRequest.category === 'PROMO'"
          :src="promoDir + item.path"
          fit="contain"
          style="aspect-ratio: 1/1"
          @click="selectImage(item)"
        />
        <el-image
          v-if="imageRequest.category === 'GAME'"
          :src="gameDir + item.path"
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
            v-if="imageRequest.category === 'PROMO'"
            :src="promoDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[promoDir + selectedImage.path]"
          />
          <el-image
            v-if="imageRequest.category === 'GAME'"
            :src="gameDir + selectedImage.path"
            fit="contain"
            class="smallPreview"
            :preview-src-list="[gameDir + selectedImage.path]"
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
    :title="uiControl.imageDialogTitle"
    v-model="uiControl.imageDialogVisible"
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
        <span style="width: 350px">
          {{
            imageForm.category === 'GAME'
              ? t('fields.game')
              : t('fields.promo')
          }}
        </span>
      </el-form-item>
      <el-form-item :label="t('fields.promoType')" prop="promoType">
        <span style="width: 350px">
          {{
            imageForm.promoType === 'DESKTOP_IMAGE'
              ? t('fields.desktopImage')
              : t('fields.mobileImage')
          }}
        </span>
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
        <el-button @click="uiControl.imageDialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitImageUpload">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
/* eslint-disable */
import { computed, reactive, ref } from 'vue'
import { hasRole, hasPermission } from '@/utils/util'
import { getSiteListSimple } from '@/api/site'
import { nextTick, onMounted } from '@vue/runtime-core'
import { useStore } from '@/store'
import { TENANT } from '@/store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import {
  getRedirect,
  createRedirect,
  updateRedirect,
  updateRedirectStatus,
  deleteRedirect,
} from '@/api/redirect'
import { getPlatformsBySite } from '@/api/platform'
import { getActivePromoPageList } from '@/api/promoPages'
import { required } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createSiteImage, getSiteImage } from '@/api/site-image'
import { useSessionStorage } from '@vueuse/core'
import { getVipList } from '../../../../api/vip'
import { isVnm } from '@/utils/site'
import { formatInputTimeZone } from '@/utils/format-timeZone'
import { uploadImage } from '../../../../api/image'

let timeZone = null

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const formRef = ref(null)
const imageFormRef = ref(null)
const inputImage = ref(null)
const promoDir =
  useSessionStorage('IMAGE_CDN', process.env.VUE_APP_IMAGE).value + '/promo/'
const gameDir =
  useSessionStorage('IMAGE_CDN', process.env.VUE_APP_IMAGE).value + '/game/'
const selectedId = ref(null)
const platforms = reactive({
  list: [],
})
const privileges = reactive({
  list: [],
})
const imageList = reactive({
  dataList: [],
  pages: 0,
})
const vipList = reactive({
  list: [],
})

const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

const uiControl = reactive({
  isLoaded: false,
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  type: [
    { key: 0, displayName: 'gameCode', value: 'GAME' },
    { key: 1, displayName: 'promo', value: 'PROMO' },
    { key: 2, displayName: 'domainEasy', value: 'DOMAIN' },
    { key: 3, displayName: 'videoShiPin', value: 'VIDEO' },
    { key: 4, displayName: 'CHARITY', value: 'CHARITY' },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  showSiteType: false,
  showDialogSiteType: false,
  imageSelectionVisible: false,
  imageDialogVisible: false,
  imageDialogTitle: '',
})

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const redirectType = reactive({
  list: [
    { key: 0, displayName: 'gameCode', value: 'GAME' },
    { key: 1, displayName: 'promo', value: 'PROMO' },
    { key: 2, displayName: 'domainEasy', value: 'DOMAIN' },
    { key: 3, displayName: 'videoShiPin', value: 'VIDEO' },
    { key: 4, displayName: 'CHARITY', value: 'CHARITY' },
  ],
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const request = reactive({
  size: 20,
  current: 1,
  siteType: null,
  siteId: null,
})

const sites = reactive({
  list: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const form = reactive({
  siteId: null,
  type: null,
  code: null,
  platform: null,
  icon: null,
  iconMobile: null,
  startTime: null,
  endTime: null,
  title: null,
  vips: null,
  siteType: null,
  showTime: null,
  specificMember: null,
})

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
  platform: null,
})

const uploadedImage = reactive({
  url: null,
})

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  promoType: [required(t('messsage.validatePromoTypeRequired'))],
})

const checkboxes = reactive({
  vip: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
})

const selectedVIPs = reactive({ vipChecked: [] })

const validateStartTime = (rule, value, callback) => {
  if (form.endTime && form.endTime < form.startTime) {
    callback(new Error(t('message.startMustBeforeEnd')))
  } else {
    callback()
  }
}

const validateEndTime = (rule, value, callback) => {
  if (form.startTime && form.startTime > form.endTime) {
    callback(new Error(t('message.endMustAfterStart')))
  } else {
    callback()
  }
}

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  type: [required(t('message.validateTypeRequired'))],
  code: [required(t('message.validateCodeRequired'))],
  platform: [required(t('message.validatePlatformRequired'))],
  icon: [required(t('message.validateIconRequired'))],
  siteType: [required(t('message.validateSiteTypeRequired'))],
  startTime: [{ validator: validateStartTime, trigger: 'blur' }],
  endTime: [{ validator: validateEndTime, trigger: 'blur' }],
})

async function loadRedirect() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  const { data: ret } = await getRedirect(query)
  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  sites.list = site
}

async function loadPlatform() {
  const { data: platform } = await getPlatformsBySite(form.siteId)
  platforms.list = platform
}

async function loadPrivileges() {
  const { data: privilege } = await getActivePromoPageList(form.siteId)
  privileges.list = privilege
}

async function showDialog(type) {
  selectedVIPs.vipChecked = []

  if (type != 'EDIT') {
    checkboxes.vip.checkAll = false
  }

  if (formRef.value) {
    formRef.value.resetFields()
    form.platform = null
    form.icon = null
    form.iconMobile = null
    form.startTime = null
    form.endTime = null
  }
  if (type === 'CREATE') {
    uiControl.dialogTitle = t('fields.addRedirect')
  } else if (type === 'EDIT') {
    uiControl.dialogTitle = t('fields.editRedirect')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true

  if (isVnm(form.siteId)) {
    uiControl.showDialogSiteType = true
  } else {
    uiControl.showDialogSiteType = false
  }
}

function showEdit(redirect) {
  showDialog('EDIT')
  nextTick(() => {
    for (const key in redirect) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = redirect[key]
      }
    }
    selectedId.value = redirect.id

    const vipArr = form.vips ? form.vips.split(',') : []
    vipArr.forEach(element => {
      selectedVIPs.vipChecked.push(parseInt(element))
    })

    if (vipArr.length === vipList.list.length) {
      checkboxes.vip.checkAll = true
      checkboxes.vip.isIndeterminate = false
    } else if (vipArr.length == 0) {
      checkboxes.vip.checkAll = false
      checkboxes.vip.isIndeterminate = false
    } else {
      checkboxes.vip.checkAll = false
      checkboxes.vip.isIndeterminate = true
    }
  })
}

async function loadVips() {
  const { data: vip } = await getVipList()
  vipList.list = vip.filter(vip => vip.siteId === form.siteId)
}

const handleVIPCheckAllChange = val => {
  selectedVIPs.vipChecked = []
  if (val) {
    vipList.list.forEach(vip => {
      selectedVIPs.vipChecked.push(vip.id)
    })
  }
  handleCheckedChange()
}

function handleCheckedChange() {
  form.vips = selectedVIPs.vipChecked.join(',')
  const vipIds = [...new Set(vipList.list.map(el => el.id))]
  handleCategoryChange(selectedVIPs.vipChecked, checkboxes.vip, vipIds)
}

function handleCategoryChange(selectedList, checkboxData, dataList) {
  const selectedCount = selectedList.filter(el => dataList.includes(el)).length
  const listCount = dataList.length
  checkboxData.checkAll = selectedCount === listCount
  checkboxData.isIndeterminate = selectedCount > 0 && selectedCount < listCount
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  }
}

function create() {
  formRef.value.validate(async valid => {
    if (valid) {
      await createRedirect(form)
      uiControl.dialogVisible = false
      await loadRedirect()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  formRef.value.validate(async valid => {
    if (valid) {
      await updateRedirect(selectedId.value, form)
      uiControl.dialogVisible = false
      await loadRedirect()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
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
  switch (form.type) {
    case 'PROMO':
      imageRequest.category = 'PROMO'
      break
    case 'GAME':
      imageRequest.category = 'GAME'
      break
  }
  imageRequest.current = 1
  await loadSiteImage(type)

  uiControl.imageSelectionTitle = type == "DESKTOP_IMAGE"?t('fields.desktopImage'):t('fields.mobileImage')
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

async function loadSiteImage(type) {
  selectedImage.id = 0
  if(form.type != 'GAME'){
    imageRequest.promoType = type
  }
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function submitImage() {
    console.log(form.type)
  if(uiControl.imageSelectionType == "DESKTOP_IMAGE"){
    form.icon = selectedImage.path
  } else {
    form.iconMobile = selectedImage.path
  }
  uiControl.imageSelectionVisible = false
}

async function removeRedirect(id) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteRedirect(id)
    await loadRedirect()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeRedirectStatus(row) {
  try{
    await updateRedirectStatus(row.id, row.status)
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  }catch(error) {
    ElMessage({ message: t('message.updateFailed'), type: 'error' })
  }
}

function resetQuery() {
  request.type = null
  request.title = null
}

function showImageDialog(type) {
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = form.type
  console.log(form.type)

  uiControl.imageSelectionType = type

  imageForm.platform = form.platform
  imageForm.promoType = type
  imageForm.siteId = imageRequest.siteId
  uiControl.imageDialogTitle = t('fields.addImage')
  uiControl.imageDialogVisible = true
}

function submitImageUpload() {
  imageFormRef.value.validate(async valid => {
    if (valid) {
      await createSiteImage(imageForm)
      uiControl.imageDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      var pathurl = ""

      if(form.type == 'PROMO'){
        pathurl = `${imageForm.siteId}/${imageForm.path}`
      } else {
        pathurl = `${imageForm.siteId}/${form.platform}/${imageForm.path}`
      }

      selectImage({
        id: imageForm.id,
        name: imageForm.name,
        path: pathurl,
        remark: imageForm.remark,
        siteName: '',
      })
      submitImage()
    }
  })
}

async function attachImage(event) {
  const data = await attachPhoto(event)
  if (data.code === 0) {
    imageForm.name = generateRandomString(10)
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

function generateRandomString(charSize) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < charSize; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

onMounted(async () => {
  await loadSites()
  uiControl.isLoaded = true
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = sites.list.find(s => s.siteName === store.state.user.siteName)
  } else {
    site.value = sites.list[0]
  }
  imageRequest.siteId = store.state.user.siteId
  request.siteId = site.value.id
  timeZone = sites.list.find(e => e.id === request.siteId).timeZone
  form.siteId = request.siteId

  console.log(request.siteId)
  console.log(isVnm(request.siteId))

  if (isVnm(request.siteId)) {
    uiControl.showSiteType = true
  } else {
    uiControl.showSiteType = false
  }

  request.siteType = 'main'
  form.siteType = 'main'
  await loadVips()

  loadRedirect()
})
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

.el-form-item--level-color:deep(.el-form-item__content) {
  display: flex !important;
}

.param-label {
  display: inline-block;
  width: 100px;
  margin-top: 5px;
  margin-left: 5px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}

.param-input {
  width: 170px;
  margin-left: 5px;
  margin-right: 15px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>

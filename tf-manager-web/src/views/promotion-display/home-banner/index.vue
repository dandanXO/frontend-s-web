<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.title"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.title')"
        />
        <el-select
          clearable
          v-model="request.state"
          size="small"
          :placeholder="t('fields.state')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in uiControl.bannerState"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-if="uiControl.showSiteType === true"
          v-model="request.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 120px;margin-left:5px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="request.language"
          size="small"
          :placeholder="t('fields.language')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @focus="getLanguage"
        >
          <el-option
            v-for="item in languageList.list"
            :key="item"
            :label="t('language.' + item)"
            :value="item"
          />
        </el-select>

        <!-- <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select> -->
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadHomebanner"
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
      </div>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:promo:banner:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
        <el-button
          icon="el-icon-remove"
          size="mini"
          type="danger"
          v-permission="['sys:promo:banner:del']"
          @click="removeBanner()"
          :disabled="uiControl.removeBtn"
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="800px"
      :close-on-press-escape="false"
    >
      <el-form
        ref="bannerForm"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="180px"
      >
        <el-form-item :label="t('fields.site')" prop="siteId">
          <el-select
            v-model="form.siteId"
            size="small"
            :placeholder="t('fields.site')"
            class="filter-item"
            style="width: 350px"
            default-first-option
            @focus="loadSites"
            @change="loadDarkMode"
          >
            <el-option
              v-for="item in siteList.list"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.language')" prop="language">
          <el-select
            v-model="form.language"
            size="small"
            :placeholder="t('fields.language')"
            class="filter-item"
            style="width: 350px"
            default-first-option
            @focus="getLanguage"
          >
            <el-option
              v-for="item in languageList.list"
              :key="item"
              :label="t('language.' + item)"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.title')" prop="title">
          <el-input
            :disabled="uiControl.dialogType !== 'CREATE'"
            v-model="form.title"
            style="width: 350px"
          />
        </el-form-item>
        <div style="display: flex; flex-direction: column; align-items: start">
          <div style="display: flex">
            <el-form-item :label="t('fields.desktopBanner')" prop="desktopImageUrl" style="flex: 1">
              <el-row :gutter="10">
                <el-col v-if="form.desktopImageUrl" style="width: 250px">
                  <el-image
                    v-if="form.desktopImageUrl"
                    :src="promoDir + form.desktopImageUrl"
                    fit="contain"
                    class="preview"
                    :preview-src-list="[promoDir + form.desktopImageUrl]"
                  />
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  v-permission="['sys:site:image:add']"
                  @click="showImageDialog('DESKTOP_BANNER')"
                >
                  {{ t('fields.upload') }}
                </el-button>
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('DESKTOP', false)"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-row>
            </el-form-item>
            <el-form-item v-if="uiControl.supportDarkMode" :label="t('fields.desktopBannerDark')" prop="deskTopImageUrlDark" style="flex: 1">
              <el-row :gutter="10">
                <el-col v-if="form.deskTopImageUrlDark" style="width: 250px">
                  <el-image
                    v-if="form.deskTopImageUrlDark"
                    :src="promoDir + form.deskTopImageUrlDark"
                    fit="contain"
                    class="preview"
                    :preview-src-list="[promoDir + form.deskTopImageUrlDark]"
                  />
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  v-permission="['sys:site:image:add']"
                  @click="showImageDialog('DESKTOP_BANNER', true)"
                >
                  {{ t('fields.upload') }}
                </el-button>
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('DESKTOP', true)"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-row>
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item :label="t('fields.mobileBanner')" prop="mobileImageUrl" style="flex: 1">
              <el-row :gutter="10">
                <el-col v-if="form.mobileImageUrlDark || form.mobileImageUrl" style="width: 200px; max-height: 200px">
                  <el-image
                    v-if="form.mobileImageUrl"
                    :src="promoDir + form.mobileImageUrl"
                    fit="contain"
                    class="preview"
                    :preview-src-list="[promoDir + form.mobileImageUrl]"
                  />
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  v-permission="['sys:site:image:add']"
                  @click="showImageDialog('MOBILE_BANNER', false)"
                >
                  {{ t('fields.upload') }}
                </el-button>
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('MOBILE', false)"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-row>
            </el-form-item>
            <el-form-item v-if="uiControl.supportDarkMode" :label="t('fields.mobileBannerDark')" prop="mobileImageUrlDark" style="flex: 1">
              <el-row :gutter="10">
                <el-col v-if="form.mobileImageUrlDark || form.mobileImageUrl" style="width: 200px">
                  <el-image
                    v-if="form.mobileImageUrlDark"
                    :src="promoDir + form.mobileImageUrlDark"
                    fit="contain"
                    class="preview"
                    :preview-src-list="[promoDir + form.mobileImageUrlDark]"
                  />
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  v-permission="['sys:site:image:add']"
                  @click="showImageDialog('MOBILE_BANNER', true)"
                >
                  {{ t('fields.upload') }}
                </el-button>
                <el-button
                  icon="el-icon-search"
                  size="mini"
                  type="success"
                  @click="browseImage('MOBILE', true)"
                >
                  {{ t('fields.browse') }}
                </el-button>
              </el-row>
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="t('fields.redirect')" prop="redirectUrl">
          <el-input v-model="form.redirectUrl" style="width: 350px" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            v-model="form.sequence"
            controls-position="right"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item :label="t('fields.category')" prop="category">
          <el-select
            v-model="form.category"
            size="small"
            :placeholder="t('fields.category')"
            class="filter-item"
            style="width: 350px"
          >
            <el-option
              v-for="item in uiControl.category"
              :key="item.key"
              :label="t('homeBannerType.' + item.displayName)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :rows="2"
            type="textarea"
            :placeholder="t('fields.pleaseInput')"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.displayStartTime')"
          prop="displayStartTime"
        >
          <el-date-picker
            v-model="form.displayStartTime"
            format="DD/MM/YYYY HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            type="datetime"
            range-separator=":"
            :placeholder="t('fields.displayStartTime')"
            style="width: 250px"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item :label="t('fields.displayEndTime')" prop="displayEndTime">
          <el-date-picker
            v-model="form.displayEndTime"
            format="DD/MM/YYYY HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="small"
            type="datetime"
            range-separator=":"
            :placeholder="t('fields.displayEndTime')"
            style="width: 250px"
            :editable="false"
            :clearable="false"
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
          @click="loadSiteImage(uiControl.imageSelectionType)"
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

    <el-table
      :data="page.records"
      ref="table"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="sequence" :label="t('fields.sequence')" width="80" />
      <el-table-column prop="title" :label="t('fields.title')" />
      <el-table-column prop="category" :label="t('fields.category')">
        <template #default="scope">
          <span>{{ t('homeBannerType.' + scope.row.category) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="siteName" :label="t('fields.site')" />
      <el-table-column prop="language" :label="t('fields.language')" align="center" min-width="120">
        <template #default="scope">
          <span v-if="scope.row.language">{{ t('language.' + scope.row.language) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="state" :label="t('fields.state')">
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeBannerState(scope.row.id, scope.row.state)"
          />
          <el-tag v-if="scope.row.state" size="mini" type="success" style="margin-left: 10px;">{{ t('common.status.OPEN') }}</el-tag>
          <el-tag v-else size="mini" type="danger" style="margin-left: 10px;">{{ t('common.status.CLOSE') }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="state" :label="t('fields.status')" min-width="120">
        <template #default="scope">
          <el-radio-group
            v-model="scope.row.state"
            size="mini"
            @change="changeBannerState(scope.row.id, scope.row.state)"
          >
            <el-radio-button label="1">{{ t('common.status.OPEN') }}</el-radio-button>
            <el-radio-button label="0">{{ t('common.status.CLOSE') }}</el-radio-button>
            <el-radio-button label="2">{{ t('common.status.TEST') }}</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="t('fields.updateTime')">
        <template #default="scope">
          <span v-if="scope.row.updateTime === null">-</span>
          <span
            v-if="scope.row.updateTime !== null"
            v-formatter="{
              data: scope.row.updateTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')">
        <template #default="scope">
          <span v-if="scope.row.createTime === null">-</span>
          <span
            v-if="scope.row.createTime !== null"
            v-formatter="{
              data: scope.row.createTime,
              timeZone: scope.row.timeZone,
              type: 'date',
            }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column
        type="title"
        :label="t('fields.action')"
        v-if="
          hasPermission(['sys:promo:banner:update']) ||
            hasPermission(['sys:promo:banner:del'])
        "
      >
        <template #default="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            v-permission="['sys:promo:banner:update']"
            @click="showEdit(scope.row)"
          />
          <el-button
            icon="el-icon-remove"
            size="mini"
            type="danger"
            v-permission="['sys:promo:banner:del']"
            @click="removeBanner(scope.row)"
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
  </div>
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
      <el-form-item
        :label="t('fields.promoType')"
        prop="promoType"
      >
        <!--insert image size-->
        <div v-if="imageForm.promoType === 'DESKTOP_BANNER'">
          <el-row>
            <span style="width: 350px" disabled>{{ t('fields.desktopBanner') }}</span>
          </el-row>
          <span v-if="isXF(imageForm.siteId)">{{ t('fields.imageSize') }}: 1920*500</span>
          <span v-if="isThai(imageForm.siteId)">{{ t('fields.imageSize') }}: 2000*500</span>
          <span v-if="isDY(imageForm.siteId)">{{ t('fields.imageSize') }}: 1920*500</span>
          <span v-if="isLH(imageForm.siteId)">{{ t('fields.imageSize') }}: 1920*568</span>
        </div>
        <div v-if="imageForm.promoType === 'MOBILE_BANNER'">
          <el-row>
            <span style="width: 350px" disabled>{{ t('fields.mobileBanner') }}</span>
          </el-row>
          <span v-if="isXF(imageForm.siteId)">{{ t('fields.imageSize') }}: 1080*534</span>
          <span v-if="isThai(imageForm.siteId)">{{ t('fields.imageSize') }}: 1080*675</span>
          <span v-if="isDY(imageForm.siteId)">{{ t('fields.imageSize') }}: 1080*534</span>
          <span v-if="isLH(imageForm.siteId)">{{ t('fields.imageSize') }}: 1000*400</span>
        </div>
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
        <el-button @click="uiControl.dialogVisible = false">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  createHomeBanner,
  deleteHomeBanner,
  getHomeBannerList,
  updateBannerState,
  updateHomeBanner,
} from '../../../api/homeBanner'
import { createSiteImage, getSiteImage } from '../../../api/site-image'
import { uploadImage } from '../../../api/image'
import { getSiteListSimple } from '../../../api/site'
import { required } from '../../../utils/validate'
import { hasPermission } from '../../../utils/util'
import { useStore } from '../../../store'
import { TENANT } from '../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getSupportDarkMode, getConfigList } from "@/api/config";
import { isXF, isThai, isDY, isLH, isVnm } from '@/utils/site'
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const inputImage = ref(null)
const imageFormRef = ref(null)
// const inputDesktop = ref(null)
// const inputMobile = ref(null)
const bannerForm = ref(null)
const promoDir = useSessionStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE).value + '/promo/'
const siteList = reactive({
  list: [],
})
const imageList = reactive({
  dataList: [],
  pages: 0,
})
const languageList = reactive({
  list: []
})
const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})

const uploadedImage = reactive({
  url: null,
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  imageDialogVisible: false,
  imageDialogTitle: '',
  editBtn: true,
  removeBtn: true,
  bannerState: [
    { key: 1, displayName: 'Open', value: true },
    { key: 2, displayName: 'Close', value: false },
  ],
  category: [
    { key: 1, displayName: 'HOME', value: 'HOME' },
    { key: 2, displayName: 'LIVE', value: 'LIVE' },
    { key: 3, displayName: 'SLOT', value: 'SLOT' },
    { key: 4, displayName: 'FISH', value: 'FISH' },
    { key: 5, displayName: 'POKER', value: 'POKER' },
    { key: 6, displayName: 'PROMO', value: 'PROMO' },
    { key: 7, displayName: 'HOMEPROMO', value: 'HOMEPROMO' },
    { key: 8, displayName: 'HOMEPOP', value: 'HOMEPOP' },
    { key: 9, displayName: 'CENTERPROMO', value: 'CENTERPROMO' },
    { key: 10, displayName: 'LOGIN', value: 'LOGIN' },
    { key: 11, displayName: 'REGISTER', value: 'REGISTER' },
    { key: 12, displayName: 'VIP', value: 'VIP' },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
  supportDarkMode: false,
  selectDarkImage: false,
  showSiteType: false,
})

let chooseBanner = []

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const request = reactive({
  size: 30,
  current: 1,
  title: null,
  state: null,
  siteId: null,
  siteType: null,
  language: null
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const form = reactive({
  id: null,
  title: null,
  desktopImageUrl: null,
  deskTopImageUrlDark: null,
  desktopImageUrlDark: null,
  mobileImageUrl: null,
  mobileImageUrlDark: null,
  redirectUrl: null,
  sequence: null,
  category: null,
  siteId: null,
  remark: null,
  state: true,
  displayStartTime: "2020-01-01 00:00:00",
  displayEndTime: "2030-01-01 23:59:59"
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
})

const page = reactive({
  pages: 0,
  records: [],
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  desktopImageUrl: [required(t('message.validateDesktopImageRequired'))],
  mobileImageUrl: [required(t('message.validateMobileImageRequired'))],
  redirectUrl: [required(t('message.validateRedirectRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
})

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  promoType: [required(t('messsage.validatePromoTypeRequired'))],
})

function resetQuery() {
  request.title = null
  request.state = null
  request.siteType = "main"
  request.siteId = store.state.user.siteId
  request.language = null
  uiControl.showSiteType = false;
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = store.state.user.siteId
}

function changePage(page) {
  request.current = page
  loadHomebanner()
}

async function changeImagePage(page) {
  imageRequest.current = page
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (bannerForm.value) {
      bannerForm.value.resetFields()
      form.id = null
    }
    form.siteId = request.siteId
    uiControl.dialogTitle = t('fields.addBanner')
  } else {
    uiControl.dialogTitle = t('fields.editBanner')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function handleChange() {}

function handleSelectionChange(val) {
  chooseBanner = val
  if (chooseBanner.length === 0) {
    uiControl.removeBtn = true
  } else if (chooseBanner.length === 1) {
    uiControl.removeBtn = false
  } else {
    uiControl.removeBtn = false
  }
}

function showEdit(banner) {
  showDialog('EDIT')
  if (!banner) {
    banner = chooseBanner[0]
  }
  nextTick(() => {
    for (const key in banner) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = banner[key]
      }
    }
    siteList.list.forEach(element => {
      if (element.siteName === banner.siteName) {
        form.siteId = element.id
      }
    })
  })
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

async function browseImage(type, isDark) {
  loadSiteImage(type)
  if (type === 'DESKTOP') {
    uiControl.imageSelectionTitle = t('fields.desktopBanner')
  } else {
    uiControl.imageSelectionTitle = t('fields.mobileBanner')
  }
  if (uiControl.supportDarkMode && isDark) {
    uiControl.selectDarkImage = true
  } else {
    uiControl.selectDarkImage = false
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
  uiControl.selectDarkImage = isDark;
}

async function loadHomebanner() {
  const { data: ret } = await getHomeBannerList(request)
  page.pages = ret.pages
  ret.records.forEach(data => {
    data.timeZone =
      store.state.user.sites.find(e => e.siteName === data.siteName) !==
      undefined
        ? store.state.user.sites.find(e => e.siteName === data.siteName)
          .timeZone
        : null
  })
  page.records = ret.records
}

async function loadSiteImage(type) {
  selectedImage.id = 0
  if (type === 'DESKTOP') {
    imageRequest.promoType = 'DESKTOP_BANNER'
  } else {
    imageRequest.promoType = 'MOBILE_BANNER'
  }
  imageRequest.siteId = store.state.user.siteId
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function removeBanner(banner) {
  ElMessageBox.confirm(t('message.confirmDelete'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    if (banner) {
      await deleteHomeBanner([banner.id])
    } else {
      await deleteHomeBanner(chooseBanner.map(u => u.id))
    }
    await loadHomebanner()
    ElMessage({ message: t('message.deleteSuccess'), type: 'success' })
  })
}

async function changeBannerState(id, state) {
  const res = await updateBannerState(id, state)
  // console.log(res);
  if (res.code === 0) {
    ElMessage({ message: t('message.changeSuccess'), type: 'success' })
  }
}

function create() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await createHomeBanner(form)
      uiControl.dialogVisible = false
      await loadHomebanner()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  bannerForm.value.validate(async valid => {
    if (valid) {
      await updateHomeBanner(form)
      uiControl.dialogVisible = false
      await loadHomebanner()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else {
    edit()
  }
}

function autoSelectImage() {
  if (uiControl.imageSelectionType === 'DESKTOP_BANNER') {
    if (uiControl.supportDarkMode && uiControl.selectDarkImage) {
      form.deskTopImageUrlDark = imageForm.siteId + '/' + imageForm.path;
      form.desktopImageUrlDark = imageForm.siteId + '/' + imageForm.path;
    } else {
      form.desktopImageUrl = imageForm.siteId + '/' + imageForm.path;
    }
  } else if (imageForm.promoType === 'MOBILE_BANNER') {
    if (uiControl.supportDarkMode && uiControl.selectDarkImage) {
      form.mobileImageUrlDark = imageForm.siteId + '/' + imageForm.path;
    } else {
      form.mobileImageUrl = imageForm.siteId + '/' + imageForm.path;
    }
  }
}

function submitImage() {
  if (uiControl.imageSelectionType === 'DESKTOP') {
    if (uiControl.supportDarkMode && uiControl.selectDarkImage) {
      form.deskTopImageUrlDark = selectedImage.path
      form.desktopImageUrlDark = selectedImage.path
    } else {
      form.desktopImageUrl = selectedImage.path
    }
  } else {
    if (uiControl.supportDarkMode && uiControl.selectDarkImage) {
      form.mobileImageUrlDark = selectedImage.path
    } else {
      form.mobileImageUrl = selectedImage.path
    }
  }
  uiControl.imageSelectionVisible = false
}

function showImageDialog(type, isDark = false) {
  imageForm.siteId = request.siteId;
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = 'PROMO'
  switch (type) {
    case 'DESKTOP_BANNER':
      imageForm.promoType = 'DESKTOP_BANNER'
      break
    case 'MOBILE_BANNER':
      imageForm.promoType = 'MOBILE_BANNER'
      break
  }

  uiControl.imageSelectionType = type
  uiControl.imageDialogTitle = t('fields.addImage')
  uiControl.imageDialogVisible = true;
  uiControl.selectDarkImage = isDark;
}

async function attachImage(event) {
  imageForm.name = generateRandomString(8);
  const data = await attachPhoto(event)
  if (data.code === 0) {
    imageForm.path = data.data
    inputImage.value.value = ''
  } else {
    ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
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
      uiControl.imageDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })

      autoSelectImage()
    }
  })
}

async function loadDarkMode() {
  if (request.siteId) {
    const { data: darkMode } = await getSupportDarkMode(request.siteId)
    uiControl.supportDarkMode = darkMode;
  }
}

// async function changeSite() {
//   request.siteType = 'main'
//   if (isVnm(request.siteId)) {
//     uiControl.showSiteType = true;
//   } else {
//     uiControl.showSiteType = false;
//   }
// }

async function getLanguage() {
  languageList.list = []
  const { data: lang } = await getConfigList("language_list", request.siteId)
  if (lang[0].value) {
    const arr = lang[0].value.split(',')
    for (const a of arr) {
      languageList.list.push(a)
    }
  }
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = store.state.user.siteId
  }
  if (isVnm(request.siteId)) {
    uiControl.showSiteType = true;
  } else {
    uiControl.showSiteType = false;
  }
  request.siteType = "main";
  await loadDarkMode()
  await getLanguage()
  await loadHomebanner()
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

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}
.grid-container {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: transform 0.5s;
}

.grid-item .el-image:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.grid-item.selected {
  box-shadow: 0 4px 8px rgba(12, 20, 242, 0.12), 0 0 6px rgba(12, 20, 242, 0.12);
  border: 1px solid blue;
}

.image-info {
  margin: 10px;
}

.image-info .el-row {
  margin-top: 10px;
}

.preview {
  width: 200px;
  height: 200px;
}

.smallPreview {
  width: 100px;
  height: 100px;
}
</style>

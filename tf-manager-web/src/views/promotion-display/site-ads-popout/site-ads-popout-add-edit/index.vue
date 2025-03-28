<template>
  <el-form
    ref="adsPopoutForm"
    :model="form"
    :rules="formRules"
    :inline="true"
    size="small"
    label-width="120px"
  >
    <el-row>
      <el-form-item :label="t('fields.title')" prop="title">
        <el-col :span="24">
          <el-input v-model="form.title" class="form-input" />
        </el-col>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.site')" prop="siteId">
        <!-- eslint-disable -->
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 260px"
          default-first-option
          @focus="loadSites"
          @change="changeSite"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row v-if="uiControl.showSiteType === true">
      <el-form-item :label="t('fields.siteType')" prop="siteType">
        <el-select
          v-model="form.siteType"
          size="small"
          class="filter-item"
          :placeholder="t('fields.siteType')"
          style="width: 240px;margin-bottom:10px"
        >
          <el-option
            v-for="item in siteType.list"
            :key="item.value"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.type')" prop="type">
        <el-select
          v-model="form.type"
          size="small"
          :placeholder="t('fields.frequency')"
          class="filter-item"
          style="width: 260px"
        >
          <el-option
            v-for="item in filterTypes"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.redirect')" prop="path">
        <el-input v-model="form.path" class="form-input" />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.frequency')" prop="frequency">
        <el-select
          v-model="form.frequency"
          size="small"
          :placeholder="t('fields.frequency')"
          class="filter-item"
          style="width: 260px"
        >
          <el-option
            v-for="item in uiControl.frequency"
            :key="item.key"
            :label="item.displayName"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item
          :label="t('fields.displayStartTime')"
          prop="displayStartTime"
        >
          <el-date-picker
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.displayStartTime"
          />
        </el-form-item>
        <el-form-item :label="t('fields.displayEndTime')" prop="displayEndTime">
          <el-date-picker
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.displayEndTime"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="t('fields.startTime')" prop="startTime">
          <el-date-picker
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.startTime"
          />
        </el-form-item>
        <el-form-item :label="t('fields.endTime')" prop="endTime">
          <el-date-picker
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="form.endTime"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="t('fields.sequence')" prop="sequence">
          <el-input-number
            type="number"
            v-model.number="form.sequence"
            :min="0"
            style="width: 350px"
            @keypress="restrictInput($event)"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
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
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="mini"
            style="width: 300px"
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
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.desktopImage')"
        prop="desktopImgUrl"
        v-if="form.type === 'IMG'"
      >
        <el-row :gutter="5">
          <el-col v-if="form.desktopImgUrl" :span="12" style="width: 250px">
            <el-image
              v-if="form.desktopImgUrl"
              :src="promoDir + form.desktopImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopImgUrl]"
            />
          </el-col>
          <el-col
            :span="form.desktopImgUrl ? 12 : 24"
            style="display: flex;justify-content: center;align-items: center;"
          >
            <el-button
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
              @click="browseImage('DESKTOP')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.mobileImage')"
        prop="mobileImgUrl"
        v-if="form.type === 'IMG'"
      >
        <el-row :gutter="5">
          <el-col v-if="form.mobileImgUrl" :span="12" style="width: 250px">
            <el-image
              v-if="form.mobileImgUrl"
              :src="promoDir + form.mobileImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileImgUrl]"
            />
          </el-col>
          <el-col
            :span="form.desktopImgUrl ? 12 : 24"
            style="display: flex;justify-content: center;align-items: center;"
          >
            <el-button
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
              @click="browseImage('MOBILE')"
            >
              {{ t('fields.browse') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.content')"
        prop="content"
        v-if="form.type === 'TEXT'"
      >
        <!-- editor here -->
        <Editor v-model:value="form.content" @input="getInput"></Editor>
      </el-form-item>
    </el-row>
    <el-row></el-row>
    <el-row>
      <el-form-item
        :label="t('fields.contentList')"
        v-if="form.type === 'TEXT'"
      >
        <div>
          <draggable
            v-model="uiControl.contentList"
            handle=".drag-handle"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <div
                style="display: flex; align-items: center; margin-bottom: 5px;"
              >
                <i
                  class="drag-handle el-icon-rank"
                  style="cursor: grab; margin-right: 5px;"
                ></i>
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="removeContent(element)"
                  style="margin-right: 5px; padding-top: 5px;"
                  :title="element"
                >
                  {{ stripHtmlTags(element) }}
                </el-tag>
              </div>
            </template>
          </draggable>
        </div>
        <div style="padding-top: 5px;">
          <Editor
            v-if="uiControl.inputVisible"
            ref="InputRef"
            v-model="inputValue"
            @input="getContentInput"
          ></Editor>
        </div>
        <div style="float: right; padding-top: 5px;">
          <el-button
            v-if="uiControl.inputButtonVisible"
            type="primary"
            @click="handleInputConfirm"
          >
            {{ t('fields.add') }}
          </el-button>
        </div>
        <div style="float: left; padding-top: 5px;">
          <el-button class="button-new-tag" size="small" @click="showInput">
            + {{ t('fields.AddList') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <div class="form-footer">
      <el-button type="primary" @click="submit">
        {{ t('fields.confirm') }}
      </el-button>
      <el-button @click="back">{{ t('fields.cancel') }}</el-button>
    </div>
  </el-form>
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
import { computed, nextTick, reactive, ref, onMounted, watch } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import {
  createAdsPopout,
  updateAdsPopout,
  getAdsPopOutById,
} from '../../../../api/site-ads-popout'
import { ElMessage } from 'element-plus'
import { uploadImage } from '../../../../api/image'
import { useRoute, useRouter } from 'vue-router'
import { createSiteImage, getSiteImage } from '../../../../api/site-image'
import { getSiteListSimple } from '../../../../api/site'
import { getVipList } from '../../../../api/vip'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import draggable from 'vuedraggable'
import { isVnm } from '@/utils/site'
import { useSessionStorage } from '@vueuse/core'

const { t } = useI18n()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const route = useRoute()
const store = useStore()
const site = ref(null)
const promoDir =
  useSessionStorage('IMAGE_CDN', process.env.VUE_APP_IMAGE).value + '/promo/'
const inputImage = ref(null)
const imageFormRef = ref(null)
const vipList = reactive({
  list: [],
})
const adsPopoutForm = ref(null)

const siteType = reactive({
  list: [
    { displayName: t('siteType.main'), value: 'main' },
    { displayName: t('siteType.slot'), value: 'slot' },
  ],
})

const inputValue = ref('')
const form = reactive({
  id: null,
  title: null,
  desktopImgUrl: null,
  mobileImgUrl: null,
  path: null,
  sequence: null,
  frequency: null,
  siteId: null,
  type: null,
  content: null,
  contentList: null,
  status: '0',
  siteType: null,
  displayStartTime: null,
  displayEndTime: null,
  startTime: null,
  endTime: null,
  vips: null,
})

const checkboxes = reactive({
  vip: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
})

const selectedVIPs = reactive({ vipChecked: [] })

const uiControl = reactive({
  titleDisable: false,
  frequency: [
    {
      key: 1,
      displayName: t('message.frequencyEveryTime'),
      value: 'EVERYTIME',
    },
    { key: 2, displayName: t('message.frequencyEveryDay'), value: 'EVERYDAY' },
    {
      key: 3,
      displayName: t('message.frequencyEverySession'),
      value: 'SESSION',
    },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
  contentList: [],
  inputVisible: false,
  inputButtonVisible: false,
  imageDialogVisible: false,
  imageDialogTitle: '',
  showSiteType: false,
})

const filterTypes = computed(() => {
  if (isVnm(form.siteId)) {
    return [
      { key: 1, displayName: 'Text', value: 'TEXT' },
      { key: 2, displayName: 'Image', value: 'IMG' },
    ]
  } else {
    return [{ key: 2, displayName: '图片', value: 'IMG' }]
  }
})

function changeSite() {
  if (isVnm(form.siteId)) {
    uiControl.showSiteType = true
  } else {
    uiControl.showSiteType = false
  }
  if (form.siteId !== 8) {
    form.type = 'IMG'
  }
}

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  // desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  // mobileImgUrl: [required(t('message.validateMobileImageRequired'))],
  path: [required(t('message.validateRedirectRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  frequency: [required(t('message.validateFrequencyRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  type: [required(t('message.validateAdsTypeRequired'))],
  desktopImgUrl: [
    {
      validator: (rule, value, callback) => {
        if (form.type === 'IMG' && !value) {
          callback(new Error(t('message.validateDesktopImageRequired')))
        } else {
          callback()
        }
      }
    }
  ],
  mobileImgUrl: [
    {
      validator: (rule, value, callback) => {
        if (form.type === 'IMG' && !value) {
          callback(new Error(t('message.validateMobileImageRequired')))
        } else {
          callback()
        }
      }
    }
  ],
  content: [
    {
      validator: (rule, value, callback) => {
        if (form.type === 'TEXT' && !value) {
          callback(new Error(t('message.validateContentRequired')))
        } else {
          callback()
        }
      }
    }
  ]
})

const siteList = reactive({
  list: [],
})
const imageList = reactive({
  dataList: [],
  pages: 0,
})
const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})
const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
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

const showInput = () => {
  uiControl.inputVisible = true
  uiControl.inputButtonVisible = true
}

const removeContent = content => {
  uiControl.contentList.splice(uiControl.contentList.indexOf(content), 1)
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    uiControl.contentList.push(inputValue.value)
  }
  uiControl.inputVisible = false
  uiControl.inputButtonVisible = false
  inputValue.value = ''
}

const onDragEnd = () => {
  if (inputValue.value) {
    inputValue.value = uiControl.contentList
  }
}

const stripHtmlTags = htmlString => {
  return htmlString.replace(/(&nbsp;|<([^>]+)>)/g, '')
}

function resetImageQuery() {
  imageRequest.name = null
  imageRequest.siteId = site.value ? site.value.id : siteList.list[0].id
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

function browseImage(type) {
  loadSiteImage(type)
  if (type === 'DESKTOP') {
    uiControl.imageSelectionTitle = t('fields.desktopImage')
  } else {
    uiControl.imageSelectionTitle = t('fields.mobileImage')
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

// is bind to the onchange event in the editor
function getInput(value) {
  form.content = value
}

function getContentInput(value) {
  inputValue.value = value
}

function create() {
  if (uiControl.contentList !== null) {
    form.contentList = uiControl.contentList.join('|')
  }

  if (form.type === 'IMG') {
    form.contentList = null
  }

  adsPopoutForm.value.validate(async valid => {
    if (valid) {
      await createAdsPopout(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  if (uiControl.contentList !== null) {
    form.contentList = uiControl.contentList.join('|')
  }

  if (form.type === 'IMG') {
    form.contentList = ''
  }
  adsPopoutForm.value.validate(async valid => {
    if (valid) {
      await updateAdsPopout(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  if (route.name.includes('Add')) {
    create()
  } else {
    edit()
  }
}

const router = useRouter()

function back() {
  // router.push({ path: `list` })
  router.push({
    name: 'Ads Popout',
    query: { current: route.query.current },
  })
}

async function loadForm(id, siteId) {
  const { data: adspopout } = await getAdsPopOutById(id, siteId)
  nextTick(() => {
    for (const key in adspopout) {
      if (adspopout.contentList !== null && adspopout.contentList !== '') {
        uiControl.contentList = adspopout.contentList.split('|')
      }
      if (Object.keys(form).find(k => k === key)) {
        form[key] = adspopout[key]
      }
    }

    const vipArr = form.vips ? form.vips.split(',') : []
    vipArr.forEach(element => {
      selectedVIPs.vipChecked.push(parseInt(element))
    })

    if (vipArr.length === vipList.list.length) {
      checkboxes.vip.checkAll = true
    } else {
      checkboxes.vip.checkAll = false
    }

    siteList.list.forEach(element => {
      if (element.siteName === adspopout.siteName) {
        form.siteId = element.id
      }
    })

    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true
    } else {
      uiControl.showSiteType = false
    }
  })
}

async function loadSiteImage(type) {
  selectedImage.id = 0
  if (type === 'DESKTOP') {
    imageRequest.promoType = 'DESKTOP_IMAGE'
  } else {
    imageRequest.promoType = 'MOBILE_IMAGE'
  }
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function showImageDialog(type) {
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = 'PROMO'
  if (type === 'DESKTOP_IMAGE') {
    uiControl.imageSelectionType = 'DESKTOP'
  } else {
    uiControl.imageSelectionType = 'MOBILE'
  }

  imageForm.promoType = type
  imageForm.siteId = imageRequest.siteId
  uiControl.imageDialogTitle = t('fields.addImage')
  uiControl.imageDialogVisible = true
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

function submitImageUpload() {
  imageFormRef.value.validate(async valid => {
    if (valid) {
      await createSiteImage(imageForm)
      uiControl.imageDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })

      selectImage({
        id: imageForm.id,
        name: imageForm.name,
        path: `${imageForm.siteId}/${imageForm.path}`,
        remark: imageForm.remark,
        siteName: '',
      })
      submitImage()
    }
  })
}

function submitImage() {
  if (uiControl.imageSelectionType === 'DESKTOP') {
    form.desktopImgUrl = selectedImage.path
  } else {
    form.mobileImgUrl = selectedImage.path
  }
  uiControl.imageSelectionVisible = false
}

function restrictInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
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

watch(
  () => route.name,
  () => {
    if (route.name.includes('Edit')) {
      uiControl.titleDisable = true
      loadForm(route.params.id, route.params.siteId)
    } else {
      adsPopoutForm.value.resetFields()
      form.type = filterTypes.value[0].value
    }
  }
)
onMounted(async () => {
  await loadSites()

  imageRequest.siteId = store.state.user.siteId
  form.siteId = store.state.user.siteId
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    imageRequest.siteId = store.state.user.siteId
  }
  await loadVips()
  form.siteType = 'main'
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
  } else {
    form.type = filterTypes.value[0].value
    if (isVnm(form.siteId)) {
      uiControl.showSiteType = true
    } else {
      uiControl.showSiteType = false
    }
  }
})
</script>

<style scoped>
.form-footer {
  display: flex;
  margin-left: 7.5em;
  justify-content: flex-start;
}

.form-input {
  width: 520px;
}

.image-input {
  width: 420px;
}
</style>

<style lang="scss">
.w-e-toolbar {
  z-index: 7 !important;
}

.w-e-menu {
  z-index: 2 !important;
}

.w-e-text-container {
  z-index: 1 !important;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
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

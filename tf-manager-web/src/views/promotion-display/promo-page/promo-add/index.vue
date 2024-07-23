<template>
  <el-form
    ref="promoForm"
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
      <el-form-item :label="t('fields.desktopImage')" prop="desktopImgUrl">
        <el-row :gutter="5">
          <el-col v-if="form.desktopImgUrl" style="width: 250px">
            <el-image
              v-if="form.desktopImgUrl"
              :src="promoDir + form.desktopImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopImgUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('DESKTOP_IMAGE')"
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
          <el-button
            v-if="form.desktopImgUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.desktopImgUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.desktopBackgroundImage')"
        prop="desktopImgBackgroundUrl"
      >
        <el-row :gutter="5">
          <el-col v-if="form.desktopImgBackgroundUrl" style="width: 250px">
            <el-image
              v-if="form.desktopImgBackgroundUrl"
              :src="promoDir + form.desktopImgBackgroundUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopImgBackgroundUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('DESKTOP_BACKGROUND_IMAGE')"
          >
            {{ t('fields.upload') }}
          </el-button>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="browseImage('DESKTOP_BACKGROUND_IMAGE')"
          >
            {{ t('fields.browse') }}
          </el-button>
          <el-button
            v-if="form.desktopImgBackgroundUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.desktopImgBackgroundUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.mobileImage')" prop="mobileImgUrl">
        <el-row :gutter="5">
          <el-col v-if="form.mobileImgUrl" style="width: 250px">
            <el-image
              v-if="form.mobileImgUrl"
              :src="promoDir + form.mobileImgUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileImgUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('MOBILE_IMAGE')"
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
          <el-button
            v-if="form.mobileImgUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.mobileImgUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item
        :label="t('fields.mobileBackgroundImage')"
        prop="mobileImgBackgroundUrl"
      >
        <el-row :gutter="5">
          <el-col v-if="form.mobileImgBackgroundUrl" style="width: 250px">
            <el-image
              v-if="form.mobileImgBackgroundUrl"
              :src="promoDir + form.mobileImgBackgroundUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileImgBackgroundUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('MOBILE_BACKGROUND_IMAGE')"
          >
            {{ t('fields.upload') }}
          </el-button>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="browseImage('MOBILE_BACKGROUND_IMAGE')"
          >
            {{ t('fields.browse') }}
          </el-button>
          <el-button
            v-if="form.mobileImgBackgroundUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.mobileImgBackgroundUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.desktopBanner')" prop="desktopBannerUrl">
        <el-row :gutter="5">
          <el-col v-if="form.desktopBannerUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.desktopBannerUrl"
              :src="promoDir + form.desktopBannerUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.desktopBannerUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('DESKTOP_BANNER')"
          >
            {{ t('fields.upload') }}
          </el-button>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="browseImage('DESKTOP_BANNER')"
          >
            {{ t('fields.browse') }}
          </el-button>
          <el-button
            v-if="form.desktopBannerUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.desktopBannerUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.mobileBanner')" prop="mobileBannerUrl">
        <el-row :gutter="5">
          <el-col v-if="form.mobileBannerUrl" :span="18" style="width: 250px">
            <el-image
              v-if="form.mobileBannerUrl"
              :src="promoDir + form.mobileBannerUrl"
              fit="contain"
              class="preview"
              :preview-src-list="[promoDir + form.mobileBannerUrl]"
            />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-permission="['sys:siteimage:add']"
            @click="showDialog('MOBILE_BANNER')"
          >
            {{ t('fields.upload') }}
          </el-button>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="success"
            @click="browseImage('MOBILE_BANNER')"
          >
            {{ t('fields.browse') }}
          </el-button>
          <el-button
            v-if="form.mobileBannerUrl"
            icon="el-icon-remove"
            size="mini"
            type="danger"
            @click="form.mobileBannerUrl = ''"
          >
            {{ t('fields.remove') }}
          </el-button>
        </el-row>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.redirect')" prop="redirectUrl">
        <el-input v-model="form.redirectUrl" class="form-input" />
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.site')" prop="siteId">
        <el-select
          v-model="form.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 260px"
          default-first-option
          @focus="loadSites"
          @change="onChangeSite"
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
    <el-row>
      <el-form-item :label="t('fields.label')" prop="labelType">
        <el-radio-group v-model="form.labelType">
          <el-radio
            v-for="c in labelType.list"
            :label="c.value"
            :key="c.key"
            v-model="form.labelType"
          >
            {{ c.displayName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.labelType !== null" class="label-cancel">
        <el-button type="danger" @click="handleCancelClick">
          {{ t('fields.labelCancel') }}
        </el-button>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.promoType')" prop="promoType">
        <el-col :span="12">
          <el-checkbox-group
            v-model="selected.promoTypeChecked"
            @change="handleCheckedChangePromoType"
            class="form-input"
          >
            <el-checkbox
              v-for="p in promoTypes"
              :label="p.typeName"
              :key="p.value"
            >
              {{ p.displayName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item>

      <el-col :span="12">
        <el-form-item :label="t('fields.hasPromo')" prop="hasPromo">
          <el-switch
            v-model="form.hasPromo"
            active-color="#409EFF"
            inactive-color="#F56C6C"
          />
        </el-form-item>

        <el-form-item :label="t('fields.status')" prop="status">
          <el-radio-group
            v-model="form.status"
            size="mini"
            style="width: 300px"
          >
            <el-radio-button label="0">Open</el-radio-button>
            <el-radio-button label="1">Close</el-radio-button>
            <el-radio-button label="2">Test</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.siteId === 8">
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
    </el-row>
    <el-row v-if="form.siteId === 8">
      <el-form-item :label="t('fields.affiliateCode')" prop="affiliates">
        <el-checkbox @change="onCheckAllAffiliate" v-model="checkAllAff">
          {{ t('fields.all') }}
        </el-checkbox>
        <div class="flex gap-2 mt-4">
          <el-tag
            v-for="aff in uiControl.affList"
            :key="aff"
            closable
            :disable-transitions="false"
            @close="removeAff(aff)"
            style="margin-right: 5px;"
          >
            {{ aff }}
          </el-tag>
        </div>
        <el-input
          v-if="uiControl.inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <div v-else>
          <el-button class="button-new-tag" size="small" @click="showInput">
            + {{ t('fields.affiliateCode') }}
          </el-button>
        </div>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item :label="t('fields.sequence')" prop="sequence">
        <el-col :span="7">
          <el-input-number v-model="form.sequence" controls-position="right" />
        </el-col>
      </el-form-item>

      <el-col :span="17">
        <el-form-item :label="t('fields.promoCode')" prop="promoCode">
          <el-input
            v-model="form.promoCode"
            size="small"
            style="width: 260px"
            :placeholder="t('fields.promoCode')"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="t('fields.param')" prop="param">
      <div v-for="(item, index) in param" :key="index">
        <el-input style="width: 170px; margin-top: 5px;" v-model="item.key" />
        :
        <el-input style="width: 170px " v-model="item.value" />
        <el-button
          v-if="index === param.length - 1"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          style="margin-left: 20px"
          @click="addParam()"
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
          @click="delParam(index)"
          plain
        >
          {{ t('fields.delete') }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item :label="t('fields.content')" prop="pageContent">
      <!-- editor here -->
      <Editor v-model:value="form.pageContent" @input="getInput" />
    </el-form-item>
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
  <el-dialog
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
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
        <!--insert image size-->
        <div v-if="imageForm.promoType === 'DESKTOP_IMAGE'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.desktopImage') }}
            </span>
          </el-row>
          <span v-if="imageForm.siteId === 1">
            {{ t('fields.imageSize') }}: 355*180
          </span>
          <span v-if="imageForm.siteId === 3">
            {{ t('fields.imageSize') }}: 800*188
          </span>
          <span v-if="imageForm.siteId === 6">
            {{ t('fields.imageSize') }}: 355*180
          </span>
          <span v-if="imageForm.siteId === 7">
            {{ t('fields.imageSize') }}: 1920*600
          </span>
        </div>
        <div v-if="imageForm.promoType === 'DESKTOP_BACKGROUND_IMAGE'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.desktopBackgroundImage') }}
            </span>
          </el-row>
        </div>
        <div v-if="imageForm.promoType === 'MOBILE_IMAGE'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.mobileImage') }}
            </span>
          </el-row>
          <span v-if="imageForm.siteId === 1">
            {{ t('fields.imageSize') }}: 1004*252
          </span>
          <span v-if="imageForm.siteId === 3">
            {{ t('fields.imageSize') }}: 1000*454
          </span>
          <span v-if="imageForm.siteId === 6">
            {{ t('fields.imageSize') }}: 1004*252
          </span>
          <span v-if="imageForm.siteId === 7">
            {{ t('fields.imageSize') }}: 1080*512
          </span>
        </div>
        <div v-if="imageForm.promoType === 'MOBILE_BACKGROUND_IMAGE'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.mobileBackgroundImage') }}
            </span>
          </el-row>
        </div>
        <div v-if="imageForm.promoType === 'DESKTOP_BANNER'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.desktopBanner') }}
            </span>
          </el-row>
          <span v-if="imageForm.siteId === 1">
            {{ t('fields.imageSize') }}: 1920*500
          </span>
          <span v-if="imageForm.siteId === 3">
            {{ t('fields.imageSize') }}: 2000*500
          </span>
          <span v-if="imageForm.siteId === 6">
            {{ t('fields.imageSize') }}: 1920*500
          </span>
          <span v-if="imageForm.siteId === 7">
            {{ t('fields.imageSize') }}: 1920*568
          </span>
        </div>
        <div v-if="imageForm.promoType === 'MOBILE_BANNER'">
          <el-row>
            <span style="width: 350px" disabled>
              {{ t('fields.mobileBanner') }}
            </span>
          </el-row>
          <span v-if="imageForm.siteId === 1">
            {{ t('fields.imageSize') }}: 1080*534
          </span>
          <span v-if="imageForm.siteId === 3">
            {{ t('fields.imageSize') }}: 1080*675
          </span>
          <span v-if="imageForm.siteId === 6">
            {{ t('fields.imageSize') }}: 1080*534
          </span>
          <span v-if="imageForm.siteId === 7">
            {{ t('fields.imageSize') }}: 1000*400
          </span>
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { required } from '../../../../utils/validate'
import Editor from '../../../../components/editor/index.vue'
import {
  createPromoPages,
  getPromoPageById,
  updatePromoPages,
} from '../../../../api/promoPages'
import { createSiteImage, getSiteImage } from '../../../../api/site-image'
import { ElMessage } from 'element-plus'
import { uploadImage } from '../../../../api/image'
import { useRoute, useRouter } from 'vue-router'
import { getSiteListSimple } from '../../../../api/site'
import { useStore } from '../../../../store'
import { TENANT } from '../../../../store/modules/user/action-types'
import { useI18n } from 'vue-i18n'
import { getVipList } from '../../../../api/vip'

const { t } = useI18n()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const route = useRoute()
const store = useStore()
const LOGIN_SITE_ID = store.state.user.siteId
const site = ref(null)
const inputImage = ref(null)
const imageFormRef = ref(null)
const promoDir = process.env.VUE_APP_IMAGE + '/promo/'
const promoForm = ref(null)
const param = ref([])
const inputValue = ref('')
const InputRef = ref(null)
const checkAllAff = ref(false)

const vipList = reactive({
  list: [],
})
const uploadedImage = reactive({
  url: null,
})

const form = reactive({
  id: null,
  title: null,
  imgUrl: null,
  desktopImgUrl: null,
  desktopImgBackgroundUrl: null,
  mobileImgUrl: null,
  mobileImgBackgroundUrl: null,
  desktopBannerUrl: null,
  mobileBannerUrl: null,
  backgroundImgUrl: null,
  redirectUrl: null,
  siteId: null,
  labelType: null,
  promoType: null,
  sequence: 0,
  promoCode: null,
  pageContent: null,
  status: '0',
  createTime: null,
  createBy: null,
  hasPromo: false,
  param: null,
  vips: null,
  affiliates: null,
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

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  titleDisable: false,
  promoState: [
    { key: 1, displayName: 'active', value: true },
    { key: 2, displayName: 'disable', value: false },
  ],
  imageSelectionTitle: '',
  imageSelectionType: '',
  imageSelectionVisible: false,
  inputVisible: false,
  affList: [],
})

const checkboxes = reactive({
  vip: {
    checkAll: ref(false),
    isIndeterminate: ref(false),
  },
})

const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PROMO',
})

const selected = reactive({
  promoTypeChecked: [],
  labelRadio: ref(),
})

const formRules = reactive({
  title: [required(t('message.validateTitleRequired'))],
  desktopImgUrl: [required(t('message.validateDesktopImageRequired'))],
  mobileImgUrl: [required(t('message.validateMobileImageRequired'))],
  desktopBannerUrl: [required(t('message.validateDesktopBannerRequired'))],
  mobileBannerUrl: [required(t('message.validateMobileBannerRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  promoType: [required(t('message.validatePromoTypeRequired'))],
  promoCode: [required(t('message.validatePromoCodeRequired'))],
  pageContent: [required(t('message.validateContentRequired'))],
  sequence: [required(t('message.validateSequenceRequired'))],
  vips: [required(t('message.validateVIPRequired'))],
  affiliates: [required(t('message.validateAffiliateCodeRequired'))],
})

const imageFormRules = reactive({
  path: [required(t('message.validateImageRequired'))],
  name: [required(t('message.validateImageNameRequired'))],
  category: [required(t('message.validateCategoryRequired'))],
  siteId: [required(t('message.validateSiteRequired'))],
  promoType: [required(t('messsage.validatePromoTypeRequired'))],
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

const labelType = reactive({
  list: [
    { key: 1, displayName: t('promoLabel.new'), value: 0 },
    { key: 2, displayName: t('promoLabel.hot'), value: 1 },
    { key: 3, displayName: t('promoLabel.normal'), value: 2 },
    { key: 4, displayName: t('promoLabel.recommend'), value: 3 },
    { key: 5, displayName: t('promoLabel.daily'), value: 4 },
    { key: 6, displayName: t('promoLabel.newbie'), value: 5 },
    { key: 7, displayName: t('promoLabel.limit'), value: 6 },
    { key: 8, displayName: t('promoLabel.featured'), value: 7 },
  ],
})

const promoTypes = ref([])
const selectedVIPs = reactive({ vipChecked: [] })

function loadPromoTypes() {
  if (LOGIN_SITE_ID === 11 || form.siteId === 11) {
    promoTypes.value = [
      { typeName: 'EARN', value: 12, displayName: 'EARN' },
      { typeName: 'HOT', value: 13, displayName: 'HOT' },
      { typeName: 'NEW USER', value: 14, displayName: 'NEW' },
      { typeName: 'SPORTS', value: 17, displayName: 'SPORTS' },
      { typeName: 'LIVE', value: 18, displayName: 'LIVE' },
      { typeName: 'SLOT', value: 16, displayName: 'SLOT' },
      { typeName: 'VIP', value: 15, displayName: 'VIP' },
    ]
  } else if (LOGIN_SITE_ID === 0) {
    promoTypes.value = [
      { typeName: 'WELCOME', value: 1, displayName: t('promoType.WELCOME') },
      { typeName: 'SPORT', value: 2, displayName: t('promoType.SPORT') },
      { typeName: 'ESPORT', value: 3, displayName: t('promoType.ESPORT') },
      { typeName: 'FISH', value: 4, displayName: t('promoType.FISH') },
      {
        typeName: 'LIVE CASINO',
        value: 5,
        displayName: t('promoType.LIVECASINO'),
      },
      { typeName: 'SLOT GAME', value: 6, displayName: t('promoType.SLOTGAME') },
      { typeName: 'POKER', value: 7, displayName: t('promoType.POKER') },
      { typeName: 'DAILY', value: 8, displayName: t('promoType.DAILY') },
      { typeName: 'FTD', value: 9, displayName: t('promoType.FTD') },
      { typeName: 'LOTTERY', value: 11, displayName: t('promoType.LOTTERY') },
      { typeName: 'OTHER', value: 10, displayName: t('promoType.OTHER') },

      { typeName: 'EARN', value: 12, displayName: 'EARN' },
      { typeName: 'HOT', value: 13, displayName: 'HOT' },
      { typeName: 'NEW USER', value: 14, displayName: 'NEW' },
      { typeName: 'SPORTS', value: 17, displayName: 'SPORTS' },
      { typeName: 'LIVE', value: 18, displayName: 'LIVE' },
      { typeName: 'SLOT', value: 16, displayName: 'SLOT' },
      { typeName: 'VIP', value: 15, displayName: 'VIP' },
    ]
  } else if (LOGIN_SITE_ID === 6) {
    // Dongying 东赢
    promoTypes.value = [
      { typeName: 'WELCOME', value: 1, displayName: "新人优惠" },
      { typeName: 'ESPORT', value: 3, displayName: t('promoType.ESPORT') },
      { typeName: 'SPORT', value: 2, displayName: t('promoType.SPORT') },
      { typeName: 'LIVE CASINO', value: 5, displayName: "真人棋牌" },
      { typeName: 'SLOT GAME', value: 6, displayName: "电游活动" },
      { typeName: 'VIP', value: 15, displayName: 'VIP特权' },
      { typeName: 'LIMITED', value: 16, displayName: "限时热门" },
      { typeName: 'FTD', value: 9, displayName: "充提优惠" },
    ];
  } else {
    promoTypes.value = [
      { typeName: 'WELCOME', value: 1, displayName: t('promoType.WELCOME') },
      { typeName: 'SPORT', value: 2, displayName: t('promoType.SPORT') },
      { typeName: 'ESPORT', value: 3, displayName: t('promoType.ESPORT') },
      { typeName: 'FISH', value: 4, displayName: t('promoType.FISH') },
      {
        typeName: 'LIVE CASINO',
        value: 5,
        displayName: t('promoType.LIVECASINO'),
      },
      { typeName: 'SLOT GAME', value: 6, displayName: t('promoType.SLOTGAME') },
      { typeName: 'POKER', value: 7, displayName: t('promoType.POKER') },
      { typeName: 'DAILY', value: 8, displayName: t('promoType.DAILY') },
      { typeName: 'FTD', value: 9, displayName: t('promoType.FTD') },
      { typeName: 'LOTTERY', value: 11, displayName: t('promoType.LOTTERY') },
      { typeName: 'OTHER', value: 10, displayName: t('promoType.OTHER') },
      { typeName: 'VIP', value: 15, displayName: 'VIP' },
      { typeName: 'LIMITED', value: 16, displayName: t('promoType.LIMITED') },
    ]
  }
}

function handleCheckedChangePromoType() {
  form.promoType = selected.promoTypeChecked.join(',')
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

function browseImage(type) {
  loadSiteImage(type)
  switch (type) {
    case 'DESKTOP_IMAGE':
      uiControl.imageSelectionTitle = t('fields.desktopImage')
      break
    case 'DESKTOP_BACKGROUND_IMAGE':
      uiControl.imageSelectionTitle = t('fields.desktopBackgroundImage')
      break
    case 'MOBILE_IMAGE':
      uiControl.imageSelectionTitle = t('fields.mobileImage')
      break
    case 'MOBILE_BACKGROUND_IMAGE':
      uiControl.imageSelectionTitle = t('fields.mobileBackgroundImage')
      break
    case 'DESKTOP_BANNER':
      uiControl.imageSelectionTitle = t('fields.desktopBanner')
      break
    case 'MOBILE_BANNER':
      uiControl.imageSelectionTitle = t('fields.mobileBanner')
      break
  }
  uiControl.imageSelectionType = type
  uiControl.imageSelectionVisible = true
}

// function handleRadioChangeLabel() {
//   form.labelType = selected.labelRadio;
// }

// is bind to the onchange event in the editor
function getInput(value) {
  form.pageContent = value
}

function create() {
  promoForm.value.validate(async valid => {
    if (valid) {
      form.param = constructParam()
      await createPromoPages(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function edit() {
  promoForm.value.validate(async valid => {
    if (valid) {
      form.param = constructParam()
      await updatePromoPages(form)
      // redirect to promotion pages
      back()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function addParam() {
  param.value.push({
    key: '',
    value: '',
  })
}

function delParam(index) {
  param.value.splice(index, 1)
}

function constructParam() {
  const json = {}
  Object.values(param.value).forEach(item => {
    if (item.key) {
      json[item.key] = item.value
    }
  })
  if (checkboxes.vip.checkAll) {
    form.vips = null
  }
  if (checkAllAff.value) {
    form.affiliates = null
  } else {
    form.affiliates = uiControl.affList.join(',')
  }
  return JSON.stringify(json)
}

function submit() {
  if (!form.labelType && form.labelType !== 0) {
    form.labelType = -1
  }
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
    name: 'Promotion pages',
    query: { current: route.query.current },
  })
}

async function loadForm(id, siteId) {
  const { data: ret } = await getPromoPageById(id, siteId)

  nextTick(() => {
    for (const key in ret) {
      if (Object.keys(form).find(k => k === key)) {
        form[key] = ret[key]
      }
    }

    form.siteId = ret.siteId
    loadPromoTypes()
    if (form.siteId === 8) {
      loadVips()
    }
    // checked promoType checkboxes
    // const promoArr = form.promoType.split(",").map(Number)
    const promoArr = form.promoType.split(',')
    promoArr.forEach(element => {
      selected.promoTypeChecked.push(element)
    })
    const vipArr = form.vips ? form.vips.split(',') : []
    vipArr.forEach(element => {
      selectedVIPs.vipChecked.push(parseInt(element))
    })
    if (vipArr.length === 0) {
      checkboxes.vip.checkAll = true
    }
    const affArr = form.affiliates ? form.affiliates.split(',') : []
    affArr.forEach(element => {
      uiControl.affList.push(element)
    })
    if (affArr.length === 0) {
      onCheckAllAffiliate(true)
    }
    param.value = []
    if (form.param) {
      Object.entries(JSON.parse(form.param)).forEach(([key, value]) => {
        const json = {}
        json.key = key
        json.value = value
        param.value.push(json)
      })
    }
    addParam()
  })
}

async function loadSiteImage(type) {
  selectedImage.id = 0
  imageRequest.promoType = type
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

// async function attachPhoto(event) {
//   const files = event.target.files[0]
//   const allowFileType = ['image/jpeg', 'image/png', 'image/gif']
//   const dir = 'promo'

//   if (!allowFileType.find(ftype => ftype.includes(files.type))) {
//     ElMessage({ message: t('message.invalidFileType'), type: 'error' })
//   } else {
//     var formData = new FormData()
//     formData.append('files', files)
//     formData.append('dir', dir)
//     formData.append('overwrite', false)
//     return await uploadImage(formData)
//   }
// }

// async function attachDesktopImg(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.desktopImgUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

// async function attachMobileImg(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.mobileImgUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

// async function attachDesktopBanner(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.desktopBannerUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

// async function attachMobileBanner(event) {
//   const data = await attachPhoto(event)
//   if (data.code === 0) {
//     form.mobileBannerUrl = data.data
//   } else {
//     ElMessage({ message: t('message.failedToUploadImage'), type: 'error' })
//   }
// }

function submitImage() {
  switch (uiControl.imageSelectionType) {
    case 'DESKTOP_IMAGE':
      form.desktopImgUrl = selectedImage.path
      break
    case 'DESKTOP_BACKGROUND_IMAGE':
      form.desktopImgBackgroundUrl = selectedImage.path
      break
    case 'MOBILE_IMAGE':
      form.mobileImgUrl = selectedImage.path
      break
    case 'MOBILE_BACKGROUND_IMAGE':
      form.mobileImgBackgroundUrl = selectedImage.path
      break
    case 'DESKTOP_BANNER':
      form.desktopBannerUrl = selectedImage.path
      break
    case 'MOBILE_BANNER':
      form.mobileBannerUrl = selectedImage.path
      break
  }
  uiControl.imageSelectionVisible = false
}

const handleCancelClick = () => {
  form.labelType = null
}

function showDialog(type) {
  if (imageFormRef.value) {
    imageFormRef.value.resetFields()
    uploadedImage.url = null
    imageForm.id = null
  }
  imageForm.category = 'PROMO'
  switch (type) {
    case 'DESKTOP_IMAGE':
      imageForm.promoType = 'DESKTOP_IMAGE'
      break
    case 'DESKTOP_BACKGROUND_IMAGE':
      imageForm.promoType = 'DESKTOP_BACKGROUND_IMAGE'
      break
    case 'MOBILE_IMAGE':
      imageForm.promoType = 'MOBILE_IMAGE'
      break
    case 'MOBILE_BACKGROUND_IMAGE':
      imageForm.promoType = 'MOBILE_BACKGROUND_IMAGE'
      break
    case 'DESKTOP_BANNER':
      imageForm.promoType = 'DESKTOP_BANNER'
      break
    case 'MOBILE_BANNER':
      imageForm.promoType = 'MOBILE_BANNER'
      break
  }
  uiControl.dialogTitle = t('fields.addImage')
  uiControl.dialogVisible = true
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
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function onChangeSite() {
  if (parseInt(form.siteId) === 8) {
    loadVips()
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

const showInput = () => {
  uiControl.inputVisible = true
}

function onCheckAllAffiliate(value) {
  checkAllAff.value = value
  if (value) {
    form.affiliates = "test"
  } else {
    form.affiliates = uiControl.affList.join(",")
  }
}

const removeAff = aff => {
  uiControl.affList.splice(uiControl.affList.indexOf(aff), 1)
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!inputValue.value.includes(',') && !inputValue.value.includes('\n')) {
      uiControl.affList.push(inputValue.value)
    } else {
      const arr = inputValue.value.split(/,|\n/)
      arr.forEach(item => {
        if (item) {
          uiControl.affList.push(item)
        }
      })
    }
    form.affiliates = uiControl.affList.join(",")
  }
  uiControl.inputVisible = false
  inputValue.value = ''
}

onMounted(() => {
  loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    imageRequest.siteId = store.state.user.siteId
  }
  if (route.name.includes('Edit')) {
    uiControl.titleDisable = true
    loadForm(route.params.id, route.params.siteId)
  } else {
    addParam()
    loadPromoTypes()
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

.label-cancel {
  margin-left: 40px;
}
</style>

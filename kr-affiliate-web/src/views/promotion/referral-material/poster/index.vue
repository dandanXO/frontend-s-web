<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never">
      <div class="back-container" @click="router.go(-1)">
        <el-icon class="el-icon--left">
          <arrow-left-bold />
        </el-icon>
        <span class="role-span">{{ $t('menu.Referral Material') }}</span>
      </div>
      <div class="body-container">
        <div class="config-container">
          <el-tabs stretch="true">
            <el-tab-pane :label="$t('fields.qrCode')">
              <div style="padding: 20px">
                <div class="label-row">
                  <span>{{ $t('fields.qrCodeColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.qrColor"
                      format="hex"
                      @change="onQrColorChange"
                      show-alpha
                      @close-picker="onQrColorClose"
                    />
                    <b style="margin-left:5px">{{ data.qrColor }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onQrColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.qrColor"
                    format="hex"
                    @change="onQrColorChange"
                    show-alpha
                    @close-picker="onQrColorClose"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.qrCodeBgColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.qrBgColor"
                      format="hex"
                      show-alpha
                      @change="onQrBgColorChange"
                      @close-picker="onQrBgColorClose"
                    />
                    <b style="margin-left:5px">{{ data.qrBgColor }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onQrBgColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.qrBgColor"
                    format="hex"
                    show-alpha
                    @change="onQrBgColorChange"
                    @close-picker="onQrBgColorClose"
                  />
                </div>
                <div class="label-row">
                  {{ $t('fields.qrCodeLink') }}
                </div>
                <div class="label-row">
                  <el-input
                    v-model="data.qrData"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                    @input="onQrDataChange()"
                  />
                </div>
                <div style="margin-top: 20px; float :right">
                  <el-checkbox
                    v-model="qrPreview"
                    :label="$t('fields.qrCodePreview')"
                    size="large"
                    @input="qrPreviewCheck()"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('fields.textInfo')">
              <div style="padding: 20px">
                <div class="label-row">
                  {{ $t('fields.text') }} 1
                  <el-input-number
                    size="normal"
                    v-model="data.text1Size"
                    :min="10"
                    :max="100"
                    @change="handleText1SizeChange"
                  />
                </div>
                <div class="label-row">
                  <el-input
                    v-model="data.text1"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                    @input="onText1DataChange()"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text1Color"
                      format="hex"
                      @change="onText1ColorChange"
                      show-alpha
                      @close-picker="onText1ColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text1Color }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText1ColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text1Color"
                    format="hex"
                    @change="onText1ColorChange"
                    show-alpha
                    @close-picker="onText1ColorClose"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text1BgColor"
                      format="hex"
                      @change="onText1BgColorChange"
                      show-alpha
                      @close-picker="onText1BgColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text1BgColor }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText1BgColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text1BgColor"
                    format="hex"
                    @change="onText1BgColorChange"
                    show-alpha
                    @close-picker="onText1BgColorClose"
                  />
                </div>
                <div class="label-row">
                  {{ $t('fields.text') }} 2
                  <el-input-number
                    size="normal"
                    v-model="data.text2Size"
                    :min="10"
                    :max="100"
                    @change="handleText2SizeChange"
                  />
                </div>
                <div class="label-row">
                  <el-input
                    v-model="data.text2"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                    @input="onText2DataChange()"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text2Color"
                      format="hex"
                      @change="onText2ColorChange"
                      show-alpha
                      @close-picker="onText2ColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text2Color }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText2ColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text2Color"
                    format="hex"
                    @change="onText2ColorChange"
                    show-alpha
                    @close-picker="onText2ColorClose"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text2BgColor"
                      format="hex"
                      @change="onText2BgColorChange"
                      show-alpha
                      @close-picker="onText2BgColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text2BgColor }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText2BgColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text2BgColor"
                    format="hex"
                    @change="onText2BgColorChange"
                    show-alpha
                    @close-picker="onText2BgColorClose"
                  />
                </div>
                <div class="label-row">
                  {{ $t('fields.text') }} 3
                  <el-input-number
                    size="normal"
                    v-model="data.text3Size"
                    :min="10"
                    :max="100"
                    @change="handleText3SizeChange"
                  />
                </div>
                <div class="label-row">
                  <el-input
                    v-model="data.text3"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                    @input="onText3DataChange()"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text3Color"
                      format="hex"
                      @change="onText3ColorChange"
                      show-alpha
                      @close-picker="onText3ColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text3Color }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText3ColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text3Color"
                    format="hex"
                    @change="onText3ColorChange"
                    show-alpha
                    @close-picker="onText3ColorClose"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <pick-colors
                      v-model:value="data.text3BgColor"
                      format="hex"
                      @change="onText3BgColorChange"
                      show-alpha
                      @close-picker="onText3BgColorClose"
                    />
                    <b style="margin-left:5px">{{ data.text3BgColor }}</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                    @click="onText3BgColorPresetChange(item)"
                  />
                  <div class="custom-container">
                    {{ $t('fields.custom') }} :
                  </div>
                  <pick-colors
                    v-model:value="data.text3BgColor"
                    format="hex"
                    @change="onText3BgColorChange"
                    show-alpha
                    @close-picker="onText3BgColorClose"
                  />
                </div>
                <div style="margin-top: 20px; float :right">
                  <el-checkbox
                    v-model="textPreview"
                    :label="$t('fields.textPreview')"
                    size="large"
                    @input="textPreviewCheck()"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div id="image-container" class="image-container">
          <div>
            <span>{{ $t('fields.preview') }}</span>
            <el-button type="primary" size="normal" @click="download()">
              {{ $t('fields.download') }}
            </el-button>
          </div>
          <div style="justify-content: center">
            <canvas ref="myCanvas" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from '@vue/runtime-core'
import { nextTick, onMounted, reactive } from 'vue'
import Poster from './Poster'
import PickColors from 'vue-pick-colors'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getPathById, increaseDownloadCount } from '../../../../api/poster'
import { useStore } from '@/store'
import { getAffiliateInfo } from '../../../../api/affiliate'
import { getConfigs } from '../../../../api/system-config'

const store = useStore()
const route = useRoute()
const router = useRouter()
const myCanvas = ref(null)
const qrPreview = ref(true)
const textPreview = ref(true)
const posterDir = process.env.VUE_APP_IMAGE_CDN + '/poster/'

let poster
const colorList = [
  '#000000',
  '#FFFFFF',
  '#FF2133',
  '#FF5B00',
  '#FF9C00',
  '#00B73F',
  '#009AB0',
  '#007CDE',
  '#7B3Bf0',
]

async function generateQrcode() {
  await poster.qrcode({
    data: data.qrData,
    dark: data.qrColor,
    light: data.qrBgColor,
    radius: 0,
  })
}

let posterInfo = null
const affInfo = reactive({
  affiliateCode: null,
})

const data = reactive({
  qrColor: '#000000',
  qrBgColor: '#FFFFFF',
  qrData: '',
  text1: null,
  text1Size: 30,
  text1Color: '#000000',
  text1BgColor: '#FFFFFF',
  text2: null,
  text2Size: 30,
  text2Color: '#000000',
  text2BgColor: '#FFFFFF',
  text3: null,
  text3Size: 30,
  text3Color: '#000000',
  text3BgColor: '#FFFFFF',
})

function onQrColorChange(value, color, index) {
  data.qrColor = value
  generateQrcode()
}

function onQrColorPresetChange(value) {
  data.qrColor = value
  generateQrcode()
}

function onQrColorClose(value) {
  data.qrColor = value
  generateQrcode()
}

function onQrBgColorChange(value, color, index) {
  data.qrBgColor = value
  generateQrcode()
}

function onQrBgColorPresetChange(value) {
  data.qrBgColor = value
  generateQrcode()
}

function onQrBgColorClose(value) {
  data.qrBgColor = value
  generateQrcode()
}

function onText1ColorChange(value, color, index) {
  data.text1Color = value
  generateText1()
}
function onText1ColorClose(value) {
  data.text1Color = value
  generateText1()
}
function onText1ColorPresetChange(value) {
  data.text1Color = value
  generateText1()
}

function onText1BgColorChange(value, color, index) {
  data.text1BgColor = value
  generateText1()
}
function onText1BgColorClose(value) {
  data.text1BgColor = value
  generateText1()
}
function onText1BgColorPresetChange(value) {
  data.text1BgColor = value
  generateText1()
}

function onText2ColorChange(value, color, index) {
  data.text2Color = value
  generateText2()
}
function onText2ColorClose(value) {
  data.text2Color = value
  generateText2()
}
function onText2ColorPresetChange(value) {
  data.text2Color = value
  generateText2()
}

function onText2BgColorChange(value, color, index) {
  data.text2BgColor = value
  generateText2()
}
function onText2BgColorClose(value) {
  data.text2BgColor = value
  generateText2()
}
function onText2BgColorPresetChange(value) {
  data.text2BgColor = value
  generateText2()
}

function onText3ColorChange(value, color, index) {
  data.text3Color = value
  generateText3()
}
function onText3ColorClose(value) {
  data.text3Color = value
  generateText3()
}
function onText3ColorPresetChange(value) {
  data.text3Color = value
  generateText3()
}

function onText3BgColorChange(value, color, index) {
  data.text3BgColor = value
  generateText3()
}
function onText3BgColorClose(value) {
  data.text3BgColor = value
  generateText3()
}
function onText3BgColorPresetChange(value) {
  data.text3BgColor = value
  generateText3()
}

function handleText1SizeChange(value) {
  data.text1Size = value
  generateText1()
}

function handleText2SizeChange(value) {
  data.text2Size = value
  generateText2()
}

function handleText3SizeChange(value) {
  data.text3Size = value
  generateText3()
}

function onQrDataChange() {
  if (data.qrData === '') {
    poster.clearQR()
  } else {
    generateQrcode()
  }
}

function onText1DataChange() {
  if (data.text1 === '') {
    poster.removeTextById(1)
  } else {
    generateText1()
  }
}

function onText2DataChange() {
  if (data.text2 === '') {
    poster.removeTextById(2)
  } else {
    generateText2()
  }
}

function onText3DataChange() {
  if (data.text3 === '') {
    poster.removeTextById(3)
  } else {
    generateText3()
  }
}

let textId1 = 1
async function generateText1() {
  textId1 = await poster.text({
    text: data.text1,
    color: data.text1Color,
    id: textId1,
    fontSize: data.text1Size,
    fontFamily: 'Courier New',
    backgroundColor: data.text1BgColor,
  })
}

let textId2 = 2
async function generateText2() {
  textId2 = await poster.text({
    text: data.text2,
    color: data.text2Color,
    id: textId2,
    fontSize: data.text2Size,
    fontFamily: 'Courier New',
    backgroundColor: data.text2BgColor,
  })
}

let textId3 = 3
async function generateText3() {
  textId3 = await poster.text({
    text: data.text3,
    color: data.text3Color,
    id: textId3,
    fontSize: data.text3Size,
    fontFamily: 'Courier New',
    backgroundColor: data.text3BgColor,
  })
}

function qrPreviewCheck() {
  if (qrPreview.value) {
    poster.clearQR()
  } else {
    generateQrcode()
  }
}

function textPreviewCheck() {
  if (textPreview.value) {
    poster.clearText()
  } else {
    onText1DataChange()
    onText2DataChange()
    onText3DataChange()
  }
}

async function download() {
  await increaseDownloadCount(route.query.id)
  poster.download()
}

async function initCanvas() {
  await poster.background(posterDir + posterInfo.path)
  // await poster.background(
  //   'https://file.rd7etvkrgt.com/promo/c9974e9e-7aaf-4afc-b2b4-a55c7bbdbedd.jpg'
  // )
  generateQrcode()
}

async function loadImage() {
  if (route.query.id) {
    const { data: ret } = await getPathById(route.query.id)
    posterInfo = ret
    posterInfo.width = parseInt(
      posterInfo.size.substring(0, posterInfo.size.lastIndexOf('*') - 1)
    )
    posterInfo.height = parseInt(
      posterInfo.size.substring(posterInfo.size.lastIndexOf('*') + 2)
    )
    const ratioDiff =
      document.getElementById('image-container').clientWidth / posterInfo.width
    posterInfo.width = posterInfo.width * ratioDiff
    posterInfo.height = posterInfo.height * ratioDiff
  } else {
    router.push('/promotion/referral-material')
  }
}

async function loadQrData() {
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  await loadReferralLink()
}

async function loadReferralLink() {
  const query = {}
  query.siteId = store.state.user.siteId
  const { data: ret } = await getConfigs(query)

  const temWebLongLink = ret.find(obj => obj.code === 'affiliate_web_link')
    .value
  data.qrData = temWebLongLink + 'agent/' + affInfo.affiliateCode
  await nextTick()
}

onMounted(async () => {
  await loadImage()
  poster = new Poster(myCanvas.value, posterInfo.width, posterInfo.height)
  await loadQrData()
  initCanvas()
})
</script>

<style lang="scss">
.back-container {
  cursor: pointer;
  width: fit-content;
}

.body-container {
  margin-top: 20px;
  background-color: #f2f2f6;
  padding: 20px;
  display: flex;
  gap: 20px;
  border-radius: 8px;
}

.config-container {
  background-color: white;
  width: 35%;
  border-radius: 8px;
}

.image-container {
  width: 65%;
  background-color: white;
  border-radius: 8px;

  div {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f6;

    span {
      display: inline-flex;
      align-items: center;
    }
  }
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.color-container {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #e4e6ed;
}

.custom-container {
  // border-radius: 20%;
  // border: 1px solid rgb(0, 189, 222);
  width: 50px;
  height: 20px;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(0, 189, 222);
  user-select: none;
  cursor: pointer;
}

.color-preview {
  width: 20px;
  height: 20px;
  border: 2px solid #e4e6ed;
}

#poster {
  border: 1px solid rgb(199, 198, 198);
}

.color-item {
  margin: 0px !important;
}
@media (max-width: 768px) {
  .body-container {
    flex-direction: column;
    padding: 0;
    .config-container,.image-container {
      width: 100%;
    }
  }
}
</style>

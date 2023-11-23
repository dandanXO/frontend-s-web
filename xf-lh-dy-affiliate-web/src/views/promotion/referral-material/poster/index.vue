<template>
  <div class="roles-main">
    <el-card class="box-card" shadow="never" style="margin-top: 20px">
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
                    <i class="color-preview" :style="'background-color:' + data.qrColor" />
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
                  <div class="custom-container" @click="toggleQrPicker">
                    Custom
                  </div>
                  <pick-colors
                    width="0"
                    height="0"
                    v-model:value="data.qrColor"
                    v-model:show-picker="showQrColor"
                    format="hex"
                    show-alpha
                    @change="onQrColorChange"
                    @close-picker="onQrColorClose"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.qrCodeBgColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" :style="'background-color:' + data.qrBgColor" />
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
                  <div class="custom-container" @click="toggleQrBgPicker">
                    Custom
                  </div>
                  <pick-colors
                    width="0"
                    height="0"
                    v-model:value="data.qrBgColor"
                    v-model:show-picker="showQrBgColor"
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
                    @change="onQrDataChange()"
                  />
                </div>
                <div style="margin-top: 20px; float :right">
                  <el-checkbox
                    v-model="qrPreview"
                    :label="$t('fields.qrCodePreview')"
                    size="large"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('fields.textInfo')">
              <div style="padding: 20px">
                <div class="label-row">{{ $t('fields.text') }} 1</div>
                <div class="label-row">
                  <el-input
                    v-model="textData1"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div class="label-row">{{ $t('fields.text') }} 2</div>
                <div class="label-row">
                  <el-input
                    v-model="textData1"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div class="label-row">{{ $t('fields.text') }} 3</div>
                <div class="label-row">
                  <el-input
                    v-model="textData1"
                    :autosize="{minRows: 1, maxRows: 4}"
                    type="textarea"
                  />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div class="label-row">
                  <span>{{ $t('fields.textBgColor') }}</span>
                  <div style="display:flex">
                    <i class="color-preview" style="background-color: black;" />
                    <b>#000000</b>
                  </div>
                </div>
                <div class="label-row">
                  <div
                    v-for="item in colorList"
                    :key="item"
                    class="color-container"
                    :style="{backgroundColor: item}"
                  />
                  <el-color-picker show-alpha v-model="colorList[0]" />
                </div>
                <div style="margin-top: 20px; float :right">
                  <el-checkbox
                    v-model="textPreview"
                    :label="$t('fields.qrCodePreview')"
                    size="large"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="image-container">
          <div>
            <span> {{ $t('fields.preview') }} </span>
            <el-button type="primary" size="small" @click="download()"> {{ $t('fields.download') }}</el-button>
          </div>
          <canvas ref="myCanvas" />
        </div>
      </div>
      <!-- <el-card class="box-card">
        <el-input
          v-model="qrcodeData"
          size="small"
          style="width: 200px;margin:2px"
          placeholder="qrcode Data"
        />
        <el-input
          v-model="radius"
          size="small"
          style="width: 200px;margin:2px"
          placeholder="radius"
        />
        <pick-colors
          v-model="darkColor"
          format="hex"
          show-alpha
          @close-picker="pickDark"
        />
        <pick-colors
          v-model="lightColor"
          format="hex"
          show-alpha
          @close-picker="pickLight"
        />
        <el-button size="small" @click="generateQrcode" type="primary">
          generate
        </el-button>
      </el-card>
      <el-card>
        <el-input
          v-model="text1"
          size="small"
          style="width: 200px;margin:2px"
          placeholder="text"
        />
        <pick-colors
          v-model="text1Color"
          format="hex"
          show-alpha
          @close-picker="pickText1"
        />
        <el-button size="small" @click="addText1" type="primary">
          add
        </el-button>
      </el-card>
      <el-button size="small" @click="download" type="primary">
        download
      </el-button>

      <canvas ref="myCanvas" id="poster" /> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref } from '@vue/runtime-core'
import { onMounted, reactive } from 'vue'
import Poster from './Poster'
import PickColors from 'vue-pick-colors'
// import testBg from './1125-3181.jpg'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const myCanvas = ref(null)
const showQrColor = ref(false)
const showQrBgColor = ref(false)
const qrPreview = ref(true)
const textPreview = ref(true)

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

const data = reactive({
  qrColor: '#000000',
  qrBgColor: '#FFFFFF',
  qrData: 'https://www.youtube.com/agent/A0684D',
  text1: null,
  text1Color: '#FFFFFF',
  text1BgColor: '#000000',
  text2: null,
  text2Color: '#FFFFFF',
  text2BgColor: '#000000',
  text3: null,
  text3Color: '#FFFFFF',
  text3BgColor: '#000000',
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
}

function toggleQrPicker() {
  showQrColor.value = !showQrColor.value
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
}

function toggleQrBgPicker() {
  showQrBgColor.value = !showQrBgColor.value
}

function onQrDataChange() {
  console.log(data.qrData)
}

// function pickText1(color) {
//   text1Color.value = color
// }

// let textId

// async function addText1() {
//   textId = await poster.text({
//     text: text1.value,
//     color: text1Color.value,
//     id: textId,
//     fontSize: 30,
//     fontFamily: 'Courier New',
//   })
// }

function download() {
  poster.download()
}

function initCanvas() {
  poster.background("https://file.rd7etvkrgt.com/promo/c9974e9e-7aaf-4afc-b2b4-a55c7bbdbedd.jpg")
  generateQrcode()
}

onMounted(async () => {
  poster = new Poster(myCanvas.value, 600, 400)
  initCanvas();
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
  border-radius: 20%;
  border: 1px solid rgb(0, 189, 222);
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
</style>

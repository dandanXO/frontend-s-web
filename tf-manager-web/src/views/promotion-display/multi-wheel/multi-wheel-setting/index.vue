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
          @change="loadSetting"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>

        <el-button
          icon="el-icon-edit"
          size="mini"
          type="success"
          @click="edit()"
          style="margin-left:10px"
        >
          {{ t('fields.edit') }}
        </el-button>
      </div>
    </div>
  </div>
  <el-form
    ref="memberMultiWheelSettingForm"
    :model="form"
    :rules="formRules"
    :inline="true"
    size="small"
    label-width="150px"
  >
    <el-row :gutter="24" style="margin-top:15px">
      <el-col :span="12">
        <el-card shadow="never">
          <div class="card-header">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Setup the eligible to get the ticket"
            >
              <span>{{ t('fields.ticketSetting') }}</span>
            </el-tooltip>
          </div>
          <el-divider />
          <div>
            <el-form-item :label="t('fields.firstTicket')" prop="siteName">
              <el-input v-model="form.bet1" style="width: 180px;" />
              <el-input
                v-model="form.deposit1"
                style="width: 180px;margin-left:10px"
              />
            </el-form-item>

            <el-form-item :label="t('fields.secondTicket')" prop="siteName">
              <el-input v-model="form.bet2" style="width: 180px;" />
              <el-input
                v-model="form.deposit2"
                style="width: 180px;;margin-left:10px"
              />
            </el-form-item>

            <el-form-item :label="t('fields.thirdTicket')" prop="siteName">
              <el-input v-model="form.bet3" style="width: 180px;" />
              <el-input
                v-model="form.deposit3"
                style="width: 180px;;margin-left:10px"
              />
            </el-form-item>

            <el-form-item :label="t('fields.maxTicket')" prop="siteName">
              <el-input v-model="form.maxTicket" style="width: 200px;display:none" />
            </el-form-item>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <div class="card-header">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Setup the inner wheel minimum unlock requirement"
            >
              <span>{{ t('fields.unlockSetting') }}</span>
            </el-tooltip>
          </div>
          <el-divider />
          <div>
            <el-form-item :label="t('fields.day2')" prop="siteName">
              <el-input v-model="form.unlock1" style="width: 200px;" />
            </el-form-item>

            <el-form-item :label="t('fields.day3')" prop="siteName">
              <el-input v-model="form.unlock2" style="width: 200px;" />
            </el-form-item>

            <el-form-item :label="t('fields.day4')" prop="siteName">
              <el-input v-model="form.unlock3" style="width: 200px;" />
            </el-form-item>

            <el-form-item :label="t('fields.day5')" prop="siteName">
              <el-input v-model="form.unlock4" style="width: 200px;" />
            </el-form-item>

            <el-form-item :label="t('fields.day6')" prop="siteName">
              <el-input v-model="form.unlock5" style="width: 200px;" />
            </el-form-item>

            <el-form-item :label="t('fields.day7')" prop="siteName">
              <el-input v-model="form.unlock6" style="width: 200px;" />
            </el-form-item>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:15px">
        <el-card shadow="never">
          <div class="card-header">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Setup the inner wheel percentage of winning"
            >
              <span>{{ t('fields.innerSetting') }}</span>
            </el-tooltip>
          </div>
          <el-divider />
          <div>
            <el-form-item label="day1 (110)" prop="siteName">
              <el-input
                v-model="form.d1a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day1 (200)" prop="siteName">
              <el-input
                v-model="form.d1b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day2 (130)" prop="siteName">
              <el-input
                v-model="form.d2a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day2 (300)" prop="siteName">
              <el-input
                v-model="form.d2b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day3 (150)" prop="siteName">
              <el-input
                v-model="form.d3a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day3 (250)" prop="siteName">
              <el-input
                v-model="form.d3b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day4 (120)" prop="siteName">
              <el-input
                v-model="form.d4a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day4 (140)" prop="siteName">
              <el-input
                v-model="form.d4b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day5 (250)" prop="siteName">
              <el-input
                v-model="form.d5a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day5 (500)" prop="siteName">
              <el-input
                v-model="form.d5b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day6 (200)" prop="siteName">
              <el-input
                v-model="form.d6a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day6 (110)" prop="siteName">
              <el-input
                v-model="form.d6b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day7 (1000)" prop="siteName">
              <el-input
                v-model="form.d7a"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="day7 (Grand Prize)" prop="siteName">
              <el-input
                v-model="form.d7b"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top:15px">
        <el-card shadow="never">
          <div class="card-header">
            <span>{{ t('fields.outerSetting') }}</span>
          </div>
          <el-divider />
          <div>
            <el-form-item label="28" prop="siteName">
              <el-input
                v-model="form.o1"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="38" prop="siteName">
              <el-input
                v-model="form.o2"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="58" prop="siteName">
              <el-input
                v-model="form.o3"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="68" prop="siteName">
              <el-input
                v-model="form.o4"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="88" prop="siteName">
              <el-input
                v-model="form.o5"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="188" prop="siteName">
              <el-input
                v-model="form.o6"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="238" prop="siteName">
              <el-input
                v-model="form.o7"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="288" prop="siteName">
              <el-input
                v-model="form.o8"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="388" prop="siteName">
              <el-input
                v-model="form.o9"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="588" prop="siteName">
              <el-input
                v-model="form.o10"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>

            <el-form-item label="880" prop="siteName">
              <el-input
                v-model="form.o11"
                style="width: 200px;margin-right:10px"
              />
              <span>%</span>
            </el-form-item>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { onMounted, reactive, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../../store'
import { getSiteListSimple } from '../../../../api/site'
import { TENANT } from '../../../../store/modules/user/action-types'
import {
  getMemberMultiWheelSetting,
  editMemberMultiWheelSetting,
} from '../../../../api/member-multi-wheel'
import { ElMessage } from 'element-plus'
import { required, numericOnly } from '../../../../utils/validate'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
const request = reactive({
  siteId: null,
})

const memberMultiWheelSettingForm = ref(null)

const form = reactive({
  maxTicket: 0,
  unlock1: 0,
  unlock2: 0,
  unlock3: 0,
  unlock4: 0,
  unlock5: 0,
  unlock6: 0,
  o1: 0,
  o2: 0,
  o3: 0,
  o4: 0,
  o5: 0,
  o6: 0,
  o7: 0,
  o8: 0,
  o9: 0,
  o10: 0,
  o11: 0,

  d1a: 0,
  d1b: 0,
  d2a: 0,
  d2b: 0,
  d3a: 0,
  d3b: 0,
  d4a: 0,
  d4b: 0,
  d5a: 0,
  d5b: 0,
  d6a: 0,
  d6b: 0,
  d7a: 0,
  d7b: 0,

  bet1: 0,
  deposit1: 0,
  bet2: 0,
  deposit2: 0,
  bet3: 0,
  deposit3: 0,
})

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

function edit() {
  memberMultiWheelSettingForm.value.validate(async valid => {
    if (valid) {
      await editMemberMultiWheelSetting(form, request.siteId)
      await loadSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

const formRules = reactive({
  maxTicket: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock1: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock2: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock3: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock4: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock5: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  unlock6: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],

  bet1: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  bet2: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  bet3: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  deposit1: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  deposit2: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  deposit3: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],

  o1: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o2: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o3: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o4: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o5: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o6: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o7: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o8: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o9: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o10: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  o11: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],

  d1a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d1b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d2a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d2b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d3a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d3b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d4a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d4b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d5a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d5b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d6a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d6b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d7a: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
  d7b: [
    required(t('message.validateAmountRequired')),
    numericOnly(t('message.validateNumberOnly')),
  ],
})

async function loadSetting() {
  const { data: ref } = await getMemberMultiWheelSetting(request.siteId)
  console.log(ref)
  var json = JSON.parse(ref)

  form.maxTicket = json.setting.maxTicket

  form.unlock1 = json.unlock.day2
  form.unlock2 = json.unlock.day3
  form.unlock3 = json.unlock.day4
  form.unlock4 = json.unlock.day5
  form.unlock5 = json.unlock.day6
  form.unlock6 = json.unlock.day7

  form.bet1 = json.countRule[0].bet
  form.bet2 = json.countRule[1].bet
  form.bet3 = json.countRule[2].bet
  form.deposit1 = json.countRule[0].deposit
  form.deposit2 = json.countRule[1].deposit
  form.deposit3 = json.countRule[2].deposit

  var o1 = (json.outer[0].rate / 10000) * 100
  var o2 = (json.outer[1].rate / 10000) * 100
  var o3 = (json.outer[2].rate / 10000) * 100
  var o4 = (json.outer[3].rate / 10000) * 100
  var o5 = (json.outer[4].rate / 10000) * 100
  var o6 = (json.outer[5].rate / 10000) * 100
  var o7 = (json.outer[6].rate / 10000) * 100
  var o8 = (json.outer[7].rate / 10000) * 100
  var o9 = (json.outer[8].rate / 10000) * 100
  var o10 = (json.outer[9].rate / 10000) * 100
  var o11 = (json.outer[10].rate / 10000) * 100
  form.o1 = o1.toFixed(4)
  form.o2 = o2.toFixed(4)
  form.o3 = o3.toFixed(4)
  form.o4 = o4.toFixed(4)
  form.o5 = o5.toFixed(4)
  form.o6 = o6.toFixed(4)
  form.o7 = o7.toFixed(4)
  form.o8 = o8.toFixed(4)
  form.o9 = o9.toFixed(4)
  form.o10 = o10.toFixed(4)
  form.o11 = o11.toFixed(4)

  var d1a = (json.inner[0].rate / 100000) * 100
  var d1b = (json.inner[1].rate / 100000) * 100
  var d2a = (json.inner[2].rate / 100000) * 100
  var d2b = (json.inner[3].rate / 100000) * 100
  var d3a = (json.inner[4].rate / 100000) * 100
  var d3b = (json.inner[5].rate / 100000) * 100
  var d4a = (json.inner[6].rate / 100000) * 100
  var d4b = (json.inner[7].rate / 100000) * 100
  var d5a = (json.inner[8].rate / 100000) * 100
  var d5b = (json.inner[9].rate / 100000) * 100
  var d6a = (json.inner[10].rate / 100000) * 100
  var d6b = (json.inner[11].rate / 100000) * 100
  var d7a = (json.inner[12].rate / 100000) * 100
  var d7b = (json.inner[13].rate / 100000) * 100

  form.d1a = d1a.toFixed(4)
  form.d1b = d1b.toFixed(4)
  form.d2a = d2a.toFixed(4)
  form.d2b = d2b.toFixed(4)
  form.d3a = d3a.toFixed(4)
  form.d3b = d3b.toFixed(4)
  form.d4a = d4a.toFixed(4)
  form.d4b = d4b.toFixed(4)
  form.d5a = d5a.toFixed(4)
  form.d5b = d5b.toFixed(4)
  form.d6a = d6a.toFixed(4)
  form.d6b = d6b.toFixed(4)
  form.d7a = d7a.toFixed(4)
  form.d7b = d7b.toFixed(4)
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
  } else {
    request.siteId = 1
  }
  loadSetting()
})
</script>

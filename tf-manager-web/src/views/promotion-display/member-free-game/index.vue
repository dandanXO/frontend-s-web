<template>
  <div class="roles-main">
    <div class="header-container">
      <div class="search">
        <el-input
          v-model="request.loginName"
          size="small"
          style="width: 200px"
          :placeholder="t('fields.loginName')"
        />
        <el-select
          v-model="request.siteId"
          size="small"
          :placeholder="t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
          @change="loadPlatform(request.siteId)"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="request.platform"
          size="small"
          class="filter-item"
          :placeholder="t('fields.platform')"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in platform.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-select
          v-model="request.status"
          size="small"
          class="filter-item"
          :placeholder="t('fields.status')"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in statusList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadMemberFreeGame"
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
          v-permission="['sys:member:free:game:add']"
          @click="showDialog()"
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
      highlight-current-row
      :empty-text="t('fields.noData')"
    >
      <el-table-column prop="loginName" :label="t('fields.loginName')" />
      <el-table-column prop="validity" :label="t('fields.validity')" />
      <el-table-column prop="round" :label="t('fields.round')" />
      <el-table-column prop="platform" :label="t('fields.platform')" />
      <el-table-column prop="createBy" :label="t('fields.createBy')" />
      <el-table-column prop="createTime" :label="t('fields.createTime')" />
      <el-table-column prop="updateBy" :label="t('fields.updateBy')" />
      <el-table-column prop="updateTime" :label="t('fields.updateTime')" />
      <el-table-column type="title" :label="t('fields.status')">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" size="mini" type="success">
            {{ t('fields.success') }}
          </el-tag>
          <el-tag v-else size="mini" type="danger">
            {{ t('fields.fail') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column type="title" :label="t('fields.action')">
        <template #default="scope">
          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="success"
            v-permission="['sys:member:free:game:resend']"
            v-if="scope.row.status === 1"
            @click="resendApi(scope.row)"
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
    :title="uiControl.dialogTitle"
    v-model="uiControl.dialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
      ref="memberFreeGameForm"
      :model="form"
      :rules="formRules"
      :inline="true"
      size="small"
      label-width="150px"
    >
      <el-form-item :label="t('fields.site')" prop="siteId">
        <el-select
          v-model="form.siteId"
          :placeholder="t('fields.site')"
          style="width: 350px;"
          filterable
          @change="loadPlatform(form.siteId)"
        >
          <el-option
            v-for="item in siteList.list"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.platform')" prop="platform">
        <el-select
          v-model="form.platform"
          :placeholder="t('fields.platform')"
          style="width: 350px;"
          filterable
          default-first-option
        >
          <el-option
            v-for="item in platform.list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('fields.loginName')" prop="loginName">
        <el-input
          v-model="form.loginName"
          style="width: 350px"
          type="textarea"
          :rows="6"
          :placeholder="t('message.memberFreeGameLogin')"
        />
      </el-form-item>
      <el-form-item :label="t('fields.round')" prop="round">
        <el-input
          v-model="form.round"
          style="width: 350px"
          maxlength="11"
          type="number"
          :placeholder="t('message.memberFreeGameRound')"
        />
      </el-form-item>

      <el-form-item :label="t('fields.gameCode')" prop="gameIds">
        <el-select
          multiple
          filterable
          v-model="selected.gameId"
          size="small"
          :placeholder="t('fields.memberFreeGameIds')"
          class="filter-item"
          style="width: 350px; margin-bottom: 10px"
        >
          <el-option
            v-for="item in game.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('fields.validity')" prop="validity">
        <el-date-picker
          v-model="form.validity"
          format="DD/MM/YYYY HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          type="datetime"
        />
      </el-form-item>

      <div class="dialog-footer">
        <el-button @click="uiControl.dialogVisible = false">
          {{ t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="createMemberFreeGame">
          {{ t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {
  getMemberFreeGame,
  addMemberFreeGame,
  resend,
} from '../../../api/member-free-game'
import { getPlatformsBySite } from '../../../api/platform'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../../store'
import { getSiteListSimple } from '../../../api/site'
import { TENANT } from '../../../store/modules/user/action-types'
import { required } from '../../../utils/validate'

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType)
const site = ref(null)
const siteList = reactive({
  list: [],
})
const platform = reactive({
  list: null,
})

const statusList = reactive({
  list: [
    {
      id: '0',
      name: t('fields.sendSuccess'),
    },
    {
      id: '1',
      name: t('fields.sendFail'),
    },
  ],
})

const game = reactive({
  list: [
    { name: '火熱辣椒Hot Chilli', id: '5' },
    { name: '秦皇傳說Chin Shi Huang', id: '2' },
    { name: '發財樹Fortune Tree', id: '6' },
    { name: '上海甜心Shanghai Beauty', id: '17' },
    { name: '極速發發發Fa Fa Fa', id: '21' },
    { name: '極速777SevenSevenSeven', id: '27' },
    { name: '瘋狂777Crazy777', id: '35' },
    { name: '人魚甜心Bubble Beauty', id: '30' },
    { name: '包青天Bao boon chin', id: '36' },
    { name: '瘋狂一路發Crazy FaFaFa', id: '40' },
    { name: '喜洋洋XiYangYang', id: '43' },
    { name: '極速豬來了FortunePig', id: '33' },
    { name: '封神Fengshen', id: '38' },
    { name: '瘋狂搶金樂Golden Bank', id: '45' },
    { name: '霸金磚Lucky Goldbricks', id: '48' },
    { name: '衝鋒野牛Charge Buffalo', id: '47' },
    { name: '超級王牌Super Ace', id: '49' },
    { name: '黃金艷后Golden Queen', id: '58' },
    { name: '瘋狂錢來也Money Coming', id: '51' },
    { name: '叢林之王Jungle King', id: '16' },
    { name: '拳王Boxing King', id: '77' },
    { name: '秘境奪寶Secret Treasure', id: '78' },
    { name: '象財神Lucky Coming', id: '91' },
    { name: '猴子派對Monkey Party', id: '67' },
    { name: '幸運女神Lucky Lady', id: '89' },
    { name: '真有錢Super Rich', id: '100' },
    { name: '羅馬XRomaX', id: '102' },
    { name: '黃金帝國Golden Empire', id: '103' },
    { name: '迦羅寶石Fortune Gems', id: '109' },
    { name: '嗨翻夜Party Night', id: '76' },
    { name: '阿拉丁Magic Lamp', id: '108' },
    { name: '王牌特務Agent Ace', id: '115' },
    { name: 'TWINWINS', id: '106' },
    { name: '阿里巴巴Ali Baba', id: '110' },
    { name: '無限王牌Mega Ace', id: '134' },
    { name: '黃金之書Book of Gold', id: '87' },
    { name: '雷神X Thor X', id: '130' },
    { name: 'Happy Taxi', id: '116' },
    { name: '瘋狂淘金Gold Rush', id: '137' },
    { name: '瑪雅帝國Mayan Empire', id: '135' },
    { name: '慶典之月Bone Fortune', id: '126' },
    { name: '吉利財神JILI CAISHEN', id: '144' },
    { name: '賞金獵人Bonus Hunter', id: '142' },
    { name: '世界盃World Cup', id: '146' },
    { name: '森巴嘉年華Samba', id: '136' },
    { name: '招財貓Neko Fortune', id: '145' },
    { name: '搖滾甜心Rock Beauty', id: '18' },
    { name: '夜上海Night City', id: '37' },
    { name: '鑽石派對DiamondParty', id: '44' },
    { name: '海島甜心Hawaii Beauty', id: '26' },
    { name: '球好運Lucky Ball', id: '13' },
    { name: '超爆Hyper Burst', id: '14' },
  ],
})

const startDate = new Date()
const defaultDate = convertDate(startDate)

const memberFreeGameForm = ref(null)
const form = reactive({
  siteId: null,
  loginName: null,
  round: null,
  validity: null,
  platform: null,
  gameIds: null,
})

const selected = reactive({ gameId: [] })

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function resetQuery() {
  request.siteId = siteList.list[0].id
  request.platform = null
  request.loginName = null
  request.status = null
}

const request = reactive({
  size: 20,
  current: 1,
  loginName: null,
  siteId: null,
  status: null,
  platform: null,
})

const page = reactive({
  pages: 0,
  records: [],
})

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: t('fields.add'),
})

async function showDialog() {
  if (memberFreeGameForm.value) {
    memberFreeGameForm.value.resetFields()
  }

  selected.gameId = [
    '2',
    '5',
    '6',
    '17',
    '21',
    '27',
    '35',
    '30',
    '36',
    '40',
    '43',
    '33',
    '38',
    '45',
    '48',
    '47',
    '49',
    '58',
    '51',
    '16',
    '77',
    '78',
    '91',
    '67',
    '89',
    '100',
    '102',
    '103',
    '109',
    '76',
    '108',
    '115',
    '106',
    '110',
    '134',
    '87',
    '130',
    '116',
    '137',
    '135',
    '126',
    '144',
    '142',
    '146',
    '136',
    '145',
    '18',
    '37',
    '44',
    '26',
    '13',
    '14',
  ]

  uiControl.dialogVisible = true
  form.validity = defaultDate
}

function changePage(page) {
  request.current = page
  loadMemberFreeGame()
}

const formRules = reactive({
  siteId: [required(t('message.validateSiteRequired'))],
  loginName: [required(t('message.validateLoginNameRequired'))],
  gameIds: [required(t('message.validateGameCodeRequired'))],
  platform: [required(t('message.validatePlatformRequired'))],
  round: [required(t('message.validateRoundRequired'))],
})

async function loadMemberFreeGame() {
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })

  const { data: ret } = await getMemberFreeGame(query)
  page.pages = ret.pages
  page.records = ret.records
}

function createMemberFreeGame() {
  form.gameIds = selected.gameId.join(',')
  memberFreeGameForm.value.validate(async valid => {
    if (valid) {
      await addMemberFreeGame(form)
      uiControl.dialogVisible = false
      await loadMemberFreeGame()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

async function resendApi(freeGame) {
  var status = await resend(freeGame.id)
  if (status === true) {
    ElMessage({ message: t('message.success'), type: 'success' })
  } else {
    ElMessage({ message: t('fields.fail'), type: 'error' })
  }

  await loadMemberFreeGame()
}

async function loadSites() {
  const { data: site } = await getSiteListSimple()
  siteList.list = site
}

async function loadPlatform(siteId) {
  const { data: ret } = await getPlatformsBySite(siteId)
  platform.list = ret
}

onMounted(async () => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = siteList.list.find(
      s => s.siteName === store.state.user.siteName
    )
    request.siteId = site.value.id
    form.siteId = site.value.id
  } else {
    request.siteId = 1
    form.siteId = 1
  }

  await loadPlatform(request.siteId)
  await loadMemberFreeGame()
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
</style>

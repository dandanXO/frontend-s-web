<template>
  <div class="page-container">
    <div class="panel-item">
      <div class="panel-header">{{ $t('fields.downlineMember') }}</div>

      <el-form @submit.prevent>
        <div class="inputs-wrap">
          <el-row :gutter="20">
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <el-form-item :label="t('fields.loginName') + ' :'">
                <el-input size="normal" v-model="request.loginName" />
              </el-form-item>
            </el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <el-form-item :label="t('fields.registerTime') + ' :'">
                <el-date-picker
                  v-model="request.regTime"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  size="normal"
                  class="input-small"
                  type="daterange"
                  range-separator=":"
                  :start-placeholder="t('fields.startDate')"
                  :end-placeholder="t('fields.endDate')"
                  :shortcuts="shortcuts"
                  :editable="false"
                  :clearable="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="inputs-wrap">
          <el-row>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <el-form-item :label="t('fields.downlineAffiliate') + ' :'">
                <el-select
                  style="width: 100%;"
                  size="normal"
                  v-model="request.downlineAffiliate"
                  @focus="getAllAffiliateDownlines"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in affiliate.list"
                    :key="item.affiliateId"
                    :label="item.loginName"
                    :value="item.affiliateId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <div
                style="margin-top: 10px; width: 100%; display: flex; align-items: center; justify-content: center"
              >
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="loadAffiliateMembers()"
                  size="normal"
                >
                  {{ $t('fields.search') }}
                </el-button>
                <el-button
                  size="normal"
                  type="primary"
                  plain
                  @click="resetQuery()"
                >
                  {{ $t('fields.reset') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="inputs-wrap">
          <el-button
            icon="el-icon-plus"
            size="normal"
            type="primary"
            @click="showCreateMember()"
          >
            {{ $t('fields.createMember') }}
          </el-button>
        </div>
      </el-form>

      <div class="custom-table-wrapper">
        <table cellspacing="0" border class="custom-table">
          <thead>
            <tr>
              <th scope="col">{{ t('fields.loginName') }}</th>
              <th scope="col">{{ t('fields.vip') }}</th>
              <th scope="col">{{ t('fields.balance') }}</th>
              <th scope="col">{{ t('fields.totalDeposit') }}</th>
              <th scope="col">{{ t('fields.totalWithdraw') }}</th>
              <th scope="col">{{ t('fields.affiliate') }}</th>
              <th scope="col">{{ t('fields.registerTime') }}</th>
              <th scope="col">{{ t('fields.lastLoginTime') }}</th>
              <th scope="col">{{ t('fields.operate') }}</th>
            </tr>
          </thead>
          <tbody v-if="page.loading || page.records.length === 0">
            <tr>
              <td colspan="13">
                <Loading v-if="page.loading" />
                <emptyComp v-else-if="page.records.length === 0" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="page.records.length > 0">
            <template v-for="item in page.records" :key="item.id">
              <tr>
                <td :data-label="t('fields.loginName')">
                  <div>
                    <div
                      v-formatter="{
                        data: {
                          loginName: item.loginName,
                          vip: item.vip,
                        },
                        type: 'loginName',
                      }"
                      style="display:inline-block"
                    />
                    <el-button
                      v-if="affInfo.recycleMoney"
                      size="small"
                      style="float:right"
                      @click="openRecycle(item)"
                    >
                      {{ t('fields.recycle') }}
                    </el-button>
                  </div>
                  <span>{{ item.nickName }}</span>
                </td>
                <td>
                  {{ item.vip }}
                </td>
                <td :data-label="t('fields.balance')">
                  <div v-formatter="{ data: item.balance, type: 'money' }" />
                </td>
                <td :data-label="t('fields.totalDeposit')">
                  <div
                    v-formatter="{ data: item.totalDeposit, type: 'money' }"
                  />
                </td>
                <td :data-label="t('fields.totalWithdraw')">
                  <div
                    v-formatter="{ data: item.totalWithdraw, type: 'money' }"
                  />
                </td>
                <td>
                  {{ request.downlineAffiliate === null || request.downlineAffiliate === '' ? store.state.user.name : request.downlineAffiliate }}
                </td>
                <td :data-label="t('fields.registerTime')">
                  <div
                    v-formatter="{ data: item.regTime, type: 'date' }"
                  />
                </td>
                <td :data-label="t('fields.lastLoginTime')">
                  <div
                    v-formatter="{ data: item.lastLoginTime, type: 'date' }"
                  />
                </td>
                <td
                  class="relativerow"
                  :data-label="t('fields.operate')"
                >
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      {{ t('fields.more') }}
                      <el-icon class="el-icon--right">
                        <arrow-down />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="showMemberInfo(item)">
                          {{ t('fields.memberInfo') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="showOperation"
                          @click="transferRedirect(item.loginName)"
                        >
                          {{ t('menu.Transfer') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click="showEditRemark(item)"
                          v-if="showOperation"
                        >
                          {{ t('fields.remark') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="
                            parseInt(store.state.user.siteId) === 10 &&
                              showOperation
                          "
                          @click="showEditShareRatio(item)"
                        >
                          {{ t('fields.editShareRatio') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="showDepositRecord(item)">
                          {{ t('fields.depositRecord') }}
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click="
                            showGameRecord(item.loginName, downlineAffiliate)
                          "
                        >
                          {{ t('fields.betRecord') }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="showPrivilegeRecord(item)">
                          {{ t('fields.privilegeRecord') }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </td>
              </tr>
            </template>

            <!-- <td :data-label="t('fields.regTime')">
                <span v-if="item.regTime === null">-</span>
                <span v-formatter="{ data: item.regTime, type: 'date' }" />
              </td>
              <td :data-label="t('fields.lastLoginTime')">
                <span v-if="item.lastLoginTime === null">-</span>
                <span
                  v-formatter="{ data: item.lastLoginTime, type: 'date' }"
                />
              </td>
              <td :data-label="t('fields.memberTag')">
                {{ formatmTag(item.tags) }}
              </td> -->
          </tbody>
        </table>
        <el-pagination
          class="pagination"
          @current-change="changePage"
          layout="prev, pager, next"
          :page-size="request.size"
          :page-count="page.pages"
          :current-page="request.current"
        />
      </div>
    </div>
  </div>

  <el-dialog
    :title="t('fields.memberInfo')"
    v-model="uiControl.infoDialogVisible"
    modal-class="dialog900"
    width="90%"
  >
    <el-form>
      <div style="display: flex; gap: 10px;">
        <el-row :gutter="20" style="gap: 10px">
          <el-col :xl="8" :lg="18" :md="16" :xs="16">
            <el-form-item :label="t('fields.recordTime') + ' :'">
              <el-date-picker
                v-model="memberRequest.recordTime"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                size="normal"
                class="input-small"
                type="daterange"
                range-separator=":"
                :start-placeholder="t('fields.startDate')"
                :end-placeholder="t('fields.endDate')"
                :shortcuts="shortcuts"
                :disabled-date="disabledDate"
                :editable="false"
                :clearable="false"
              />
            </el-form-item>
          </el-col>
          <el-col :xl="5" :lg="3" :md="3" :xs="3">
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="showMemberInfo()"
              size="normal"
            >
              {{ $t('fields.search') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="scrollable-container" v-loading="dialog.loading">
      <div class="info-container">
        <el-form label-suffix=" : ">
          <div class="info-row-container">
            <el-form-item :label="t('fields.loginName')">
              {{ memberInfo.loginName }}
            </el-form-item>
            <el-form-item :label="t('fields.status')">
              <el-tag
                v-if="memberInfo.status === 'NORMAL'"
                type="success"
                size="normal"
              >
                {{ t('member.status.normal') }}
              </el-tag>
              <el-tag
                v-if="memberInfo.status === 'FROZEN'"
                type="danger"
                size="normal"
              >
                {{ t('member.status.frozen') }}
              </el-tag>
              <el-tag
                v-if="memberInfo.status === null"
                type="info"
                size="normal"
              >
                -
              </el-tag>
            </el-form-item>
            <el-form-item :label="t('fields.deposit')">
              {{ memberInfo.totalDeposit }}
            </el-form-item>
            <el-form-item :label="t('fields.withdraw')">
              {{ memberInfo.totalWithdraw }}
            </el-form-item>
            <el-form-item :label="t('fields.bonus')">
              {{ memberInfo.totalBonus }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.rebate')">
              {{ memberInfo.totalRebate }}
            </el-form-item>
            <el-form-item :label="t('fields.validBet')">
              {{ memberInfo.totalValidBet }}
            </el-form-item>
            <el-form-item :label="t('fields.totalBet')">
              {{ memberInfo.totalBet }}
            </el-form-item>
            <el-form-item :label="t('fields.adjustAmount')">
              {{ memberInfo.totalAdjustment }}
            </el-form-item>
            <el-form-item :label="t('fields.winLoss')">
              {{ memberInfo.winLoss }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.registerTime')">
              {{ memberInfo.regTime }}
            </el-form-item>
            <el-form-item :label="t('fields.ftdTime')">
              {{ memberInfo.ftdTime }}
            </el-form-item>
            <el-form-item :label="t('fields.transferRecord')">
              {{ memberInfo.transferRecord }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.memberTag')">
              {{ memberInfo.tags }}
            </el-form-item>
          </div>
          <div class="info-row-container">
            <el-form-item :label="t('fields.remark')">
              {{ memberInfo.remark }}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div style="width: 95%; margin: 10px auto">
        <table class="custom-table">
          <thead>
            <tr>
              <th scope="col">{{ t('fields.sequence') }}</th>
              <th scope="col">{{ t('fields.platform') }}</th>
              <th scope="col">{{ t('fields.validBet') }}</th>
              <th scope="col">{{ t('fields.winLoss') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="memberInfo.memberBetRecordSummaryVOList.length === 0">
              <td colspan="4">
                <!-- Display your empty component or message here -->
                <emptyComp />
              </td>
            </tr>
            <tr
              v-for="(record, index) in memberInfo.memberBetRecordSummaryVOList"
              :key="index"
            >
              <td :data-label="t('fields.sequence')">{{ index + 1 }}</td>
              <td :data-label="t('fields.platform')">
                {{ record.platform + ' - ' + record.gameType }}
              </td>
              <td :data-label="t('fields.validBet')">{{ record.validBet }}</td>
              <td :data-label="t('fields.winLoss')">{{ record.winLoss }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.editTag')"
    v-model="uiControl.tagDialogVisible"
    append-to-body
    width="90%"
    modal-class="dialog400"
  >
    <el-form @submit.prevent>
      <el-form-item :label="t('fields.loginName')">
        <b v-if="uiControl.editType === 'One'">
          {{ selectedMember.loginName }}
        </b>
        <b v-else>{{ selectedMemberList.loginName.join(', ') }}</b>
      </el-form-item>
      <el-form-item :label="t('fields.memberTag')">
        <el-checkbox-group v-model="tagRequest.tags">
          <el-checkbox
            v-for="tag in assignTaglist"
            :key="tag.id"
            :label="tag.description"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="uiControl.tagDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitTag()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.editTag')"
    v-model="uiControl.remarkDialogVisible"
    append-to-body
  >
    <el-form @submit.prevent>
      <el-form-item :label="t('fields.loginName')">
        <b>{{ selectedMember.loginName }}</b>
      </el-form-item>
      <el-form-item :label="t('fields.remark')">
        <el-input
          v-model="selectedMember.remark"
          :rows="2"
          type="textarea"
          :placeholder="t('message.remarkMessage')"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="uiControl.remarkDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitRemark()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    :title="t('fields.editShareRatio')"
    v-model="uiControl.shareRatioDialogVisible"
    width="500px"
    append-to-body
  >
    <el-form @submit.prevent>
      <el-form-item prop="memberShareRatio">
        <div
          v-for="item in selectedMember.shareRatio"
          :key="item.code"
          style="display: flex; margin-bottom:5px;"
        >
          <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
          <el-input
            v-model="item.value"
            style=" width:100px; margin-left: auto;"
          />
          <span style="color:red">
            &emsp; (0% - {{ (getAffiliateRatio(item.code) * 100).toFixed(2) }}%)
          </span>
        </div>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="uiControl.remarkDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitShareRatio()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    :title="t('fields.recycle')"
    v-model="uiControl.recycleDialogVisible"
    append-to-body
    width="90%"
    modal-class="dialog400"
  >
    <el-form label-width="100px" @submit.prevent>
      <el-form-item :label="t('fields.loginName')">
        <b>
          {{ recycleForm.memberName }}
        </b>
      </el-form-item>
      <el-form-item :label="t('fields.amount')">
        <el-input v-model="recycleForm.amount" />
      </el-form-item>
    </el-form>

    <div class="dialog-footer" style="margin-top:10px">
      <el-button @click="uiControl.recycleDialogVisible = false">
        {{ $t('fields.cancel') }}
      </el-button>
      <el-button type="primary" @click="confirmRecycle()">
        {{ $t('fields.confirm') }}
      </el-button>
    </div>
  </el-dialog>

  <el-dialog
    :title="t('fields.depositRecord')"
    v-model="uiControl.depositDialogVisible"
    width="1100px"
    append-to-body
  >
    <el-form label-suffix=" : " style="margin-top: -20px;">
      <div class="info-row-container">
        <el-form-item :label="t('fields.loginName')">
          {{ memberDepositInfo.loginName }}
        </el-form-item>
        <el-form-item :label="t('fields.realName')">
          {{ memberDepositInfo.realName }}
        </el-form-item>
        <el-form-item :label="t('fields.registerTime')">
          {{ memberDepositInfo.regTime }}
        </el-form-item>
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.sequence') }}</th>
            <th scope="col">{{ t('fields.serialNumber') }}</th>
            <th scope="col">{{ t('fields.paymentType') }}</th>
            <th scope="col">{{ t('fields.depositAmount') }}</th>
            <th scope="col">{{ t('fields.depositDate') }}</th>
            <th scope="col">{{ t('fields.finishDate') }}</th>
            <th scope="col">{{ t('fields.status') }}</th>
          </tr>
        </thead>
        <tbody v-if="memberDepositInfo.page.records.length > 0">
          <tr
            v-for="(item, index) in memberDepositInfo.page.records"
            :key="item.id"
          >
            <td>{{ (depositRequest.current - 1) * 10 + index + 1 }}</td>
            <td>{{ item.serialNumber }}</td>
            <td>{{ item.paymentType }}</td>
            <td>
              <div
                v-formatter="{ data: item.depositAmount, type: 'money' }"
              ></div>
            </td>
            <td>
              {{ formatDate(item.depositDate) }}
            </td>
            <td>
              {{ formatDate(item.finishDate) }}
            </td>
            <td>
              <span
                v-if="['SUCCESS', 'SUPPLEMENT_SUCCESS'].includes(item.status)"
              >
                <span class="success-tag">
                  {{ t('depositStatus.' + item.status) }}
                </span>
              </span>
              <span v-else-if="item.status === 'CLOSED'">
                <span class="danger-tag">
                  {{ t('depositStatus.' + item.status) }}
                </span>
              </span>
              <span v-else-if="item.status === 'PENDING'">
                <span class="warning-tag">
                  {{ t('depositStatus.' + item.status) }}
                </span>
              </span>
              <span v-else>
                <span class="info-tag">-</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="memberDepositInfo.page.records.length === 0">
        <emptyComp />
      </div>
      <el-pagination
        class="pagination"
        @current-change="changeDepositPage"
        layout="total, prev, pager, next"
        :total="memberDepositInfo.page.total"
        :page-size="depositRequest.size"
        :page-count="memberDepositInfo.page.pages"
        :current-page="depositRequest.current"
      />
    </el-form>
  </el-dialog>
  <el-dialog
    :title="t('fields.privilegeRecord')"
    v-model="uiControl.privilegeDialogVisible"
    width="1100px"
    append-to-body
  >
    <el-form label-suffix=" : " style="margin-top: -20px;">
      <div class="info-row-container">
        <el-form-item :label="t('fields.loginName')">
          {{ memberPrivilegeInfo.loginName }}
        </el-form-item>
        <el-form-item :label="t('fields.realName')">
          {{ memberPrivilegeInfo.realName }}
        </el-form-item>
        <el-form-item :label="t('fields.registerTime')">
          {{ memberPrivilegeInfo.regTime }}
        </el-form-item>
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th scope="col">{{ t('fields.serialNumber') }}</th>
            <th scope="col">{{ t('fields.privilegeName') }}</th>
            <th scope="col">{{ t('fields.amount') }}</th>
            <th scope="col">{{ t('fields.rollover') }}</th>
            <th scope="col">{{ t('fields.recordTime') }}</th>
          </tr>
        </thead>
        <tbody v-if="memberPrivilegeInfo.page.records.length > 0">
          <tr v-for="item in memberPrivilegeInfo.page.records" :key="item.id">
            <td>{{ item.serialNumber }}</td>
            <td>{{ item.privilegeName }}</td>
            <td>
              <div v-formatter="{ data: item.amount, type: 'money' }" />
            </td>
            <td>{{ item.rollover }}</td>
            <td>
              {{ formatDate(item.recordTime) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="memberPrivilegeInfo.page.records.length === 0">
        <emptyComp />
      </div>
      <el-pagination
        class="pagination"
        @current-change="changePrivilegePage"
        layout="total, prev, pager, next"
        :total="memberPrivilegeInfo.page.total"
        :page-size="privilegeRequest.size"
        :page-count="memberPrivilegeInfo.page.pages"
        :current-page="privilegeRequest.current"
      />
    </el-form>
  </el-dialog>
  <el-dialog
    :title="t('fields.createMember')"
    v-model="uiControl.createMemberDialogVisible"
    append-to-body
    width="580px"
  >
    <el-form
      ref="createForm"
      class="create-form"
      :model="createMemberForm"
      :rules="createFormRules"
      inline="true"
      size="normal"
      label-width="150px"
    >
      <el-form-item :label="t('fields.loginName')" prop="loginName">
        <el-input
          v-model="createMemberForm.loginName"
          style="width: 350px;"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item :label="t('fields.password')" prop="password">
        <el-input
          v-model="createMemberForm.password"
          type="password"
          style="width: 350px;"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item :label="t('fields.reenterPassword')" prop="reEnterPassword">
        <el-input
          v-model="createMemberForm.reEnterPassword"
          type="password"
          style="width: 350px;"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item
        v-if="parseInt(store.state.user.siteId) === 10"
        :label="t('fields.memberShareRatio')"
        prop="memberShareRatio"
      >
        <div
          v-for="item in memberShareRatioList.list"
          :key="item.code"
          style="width: 350px; display: flex; margin-bottom:5px;"
        >
          <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
          <el-input
            v-model="item.value"
            style=" width:100px; margin-left: auto;"
          />
          <span style="color:red">
            &emsp; (0% - {{ (getAffiliateRatio(item.code) * 100).toFixed(2) }}%)
          </span>
        </div>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="uiControl.createMemberDialogVisible = false">
          {{ $t('fields.cancel') }}
        </el-button>
        <el-button type="primary" @click="createMember()">
          {{ $t('fields.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from '@/store'
import moment from 'moment'
import {
  loadMemberSummary,
  loadMemberInfo,
  assignTag,
  assignRemark,
  registerMember,
  editMemberRatio,
  getAffiliateInfo,
  recycleMemberBalance,
  getDownlineAffiliates,
} from '../../../api/affiliate'
import { getAffiliateTagList } from '../../../api/affiliate-tag'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMemberDepositRecords } from '../../../api/affiliate-deposit-record'
import { getMemberPrivilegeRecords } from '../../../api/affiliate-privilege-record'
import emptyComp from '@/components/empty'
import Loading from '@/components/loading/Loading.vue'
import { required, size } from '../../../utils/validate'
import { getConfigListByGroup } from '../../../api/system-config'

const store = useStore()
const { t } = useI18n()
const router = useRouter()
const startDate = new Date()
const defaultStartDate = convertDate(
  startDate.setTime(
    moment(startDate)
      .startOf('month')
      .format('x')
  )
)
const defaultEndDate = convertDate(new Date())
const tagList = reactive({
  list: [],
  description: [],
})
let assignTaglist = []
// const table = ref(null)
const selected = reactive({
  tags: [],
})
const memberShareRatioList = reactive({
  list: [],
})
const affiliate = reactive({
  list: [],
})
const downlineAffiliate = ref(null)
const showOperation = ref(true)

const uiControl = reactive({
  infoDialogVisible: false,
  tagDialogVisible: false,
  remarkDialogVisible: false,
  depositDialogVisible: false,
  privilegeDialogVisible: false,
  createMemberDialogVisible: false,
  shareRatioDialogVisible: false,
  recycleDialogVisible: false,
  editBtn: true,
  editType: 'One',
  orderBy: [
    { display: 'registerTime', value: 'reg_time' },
    { display: 'totalDeposit', value: 'total_deposit' },
    { display: 'totalWithdraw', value: 'total_withdraw' },
    // { display: 'lastLoginTime', value: 'last_login_time' },
  ],
  sortType: [
    { display: 'ASC', value: 'ASC' },
    { display: 'DESC', value: 'DESC' },
  ],
})

const memberInfo = reactive({
  loginName: '',
  realName: '',
  status: '',
  totalDeposit: 0,
  totalWithdraw: 0,
  totalBonus: 0,
  totalRebate: 0,
  totalValidBet: 0,
  totalBet: 0,
  totalAdjustment: 0,
  winLoss: 0,
  regTime: '',
  ftdTime: '',
  transferRecord: 0,
  remark: '',
  memberBetRecordSummaryVOList: [],
})

const memberDepositInfo = reactive({
  loginName: '',
  realName: '',
  regTime: '',
  page: {
    pages: 0,
    records: [],
    loading: false,
    total: 0,
    totalDeposit: 0,
  },
})

const memberPrivilegeInfo = reactive({
  loginName: '',
  realName: '',
  regTime: '',
  page: {
    pages: 0,
    records: [],
    loading: false,
    total: 0,
  },
})

const depositRequest = reactive({
  size: 10,
  current: 1,
  loginName: null,
})

const privilegeRequest = reactive({
  size: 10,
  current: 1,
  loginName: null,
  memberId: null,
})

const checkAll = ref(false)
const isIndeterminate = ref(false)
const unAssigned = reactive({
  id: -1,
  description: t('fields.unAssigned'),
})
const dialog = reactive({
  loading: false,
})
const formatMoney = value => {
  if (typeof value !== 'number') {
    return '-'
  }
  // Assuming you want to format to two decimal places
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatmTag = tags => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return '-'
  }
  return tags.join(', ')
}

const shortcuts = [
  {
    text: t('fields.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: t('fields.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'days')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'days')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'weeks')
          .startOf('isoWeek')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'weeks')
          .endOf('isoWeek')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.thisMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .startOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
  {
    text: t('fields.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(
        moment(start)
          .subtract(1, 'months')
          .startOf('month')
          .format('x')
      )
      end.setTime(
        moment(end)
          .subtract(1, 'months')
          .endOf('month')
          .format('x')
      )
      return [start, end]
    },
  },
]

const request = reactive({
  regTime: null,
  recordTime: [defaultStartDate, defaultEndDate],
  loginName: null,
  realName: null,
  telephone: null,
  email: null,
  isBet: '-1',
  depositMinAmount: null,
  depositMaxAmount: null,
  size: 20,
  current: 1,
  memberTags: [],
  orderBy: uiControl.orderBy[0].value,
  sortType: uiControl.sortType[0].value,
  nickName: null,
  downlineAffiliate: null,
})

const memberRequest = reactive({
  memberId: null,
  recordTime: [defaultStartDate, defaultEndDate],
})

const tagRequest = reactive({
  tags: [],
})

const selectedMember = reactive({
  id: null,
  loginName: null,
  remark: null,
  shareRatio: null,
})

const selectedMemberList = reactive({
  id: [],
  loginName: [],
})

const page = reactive({
  pages: 0,
  records: [],
  loading: false,
})

const createForm = ref(null)
const createMemberForm = reactive({
  id: null,
  loginName: null,
  password: null,
  reEnterPassword: null,
  telephone: null,
  email: null,
  siteId: null,
  memberShareRatio: null,
  name2: null,
})

const affInfo = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineAffiliate: 0,
  downlineMember: 0,
  commission: 0,
  revenueShare: 0,
  shareRatio: [],
  recycleMoney: null,
})

const recycleForm = reactive({
  memberId: null,
  memberName: null,
  amount: 0,
})

const validatePassword = (rule, value, callback) => {
  if (value !== '' && createMemberForm.reEnterPassword !== '') {
    createForm.value.validateField('reEnterPassword')
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== createMemberForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const validateMemberShareRatio = (rule, value, callback) => {
  memberShareRatioList.list.forEach(item => {
    if (item.value === '' || item.value < 0 || item.value > 100) {
      callback(new Error(t('message.validateShareRatioFormat')))
    }
  })
  callback()
}

const createFormRules = reactive({
  loginName: [
    required(t('message.requiredLoginName')),
    size(6, 12, t('message.length6To12')),
  ],
  password: [
    required(t('message.requiredPassword')),
    size(6, 12, t('message.length6To12')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.reenterPassword')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
})

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

function disabledDate(time) {
  return time.getTime() > new Date().getTime()
}

function resetQuery() {
  request.regTime = null
  request.recordTime = null
  request.loginName = null
  request.realName = null
  request.telephone = null
  request.email = null
  request.isBet = '-1'
  request.depositMinAmount = null
  request.depositMaxAmount = null
  request.downlineAffiliate = null
  selected.tags = []
  checkAll.value = false
}

async function loadAffiliateMembers() {
  selectedMemberList.id.length = 0
  selectedMemberList.loginName.length = 0
  downlineAffiliate.value = null
  showOperation.value = true
  // table.value.clearSelection()
  uiControl.editBtn = true
  page.loading = true
  const requestCopy = { ...request }
  const query = {}
  Object.entries(requestCopy).forEach(([key, value]) => {
    if (value) {
      query[key] = value
    }
  })
  if (request.regTime !== null) {
    if (request.regTime.length === 2) {
      query.regTime = request.regTime.join(',')
    }
  } else {
    query.regTime = null
  }
  if (request.recordTime !== null) {
    if (request.recordTime.length === 2) {
      query.recordTime = request.recordTime.join(',')
    }
  }
  query.siteId = store.state.user.siteId
  query.memberTypes = 'NORMAL,TEST'
  switch (query.isBet) {
    case '-1':
      query.isBet = null
      break
    case '1':
      query.isBet = true
      break
    case '0':
      query.isBet = false
      break
  }
  query.memberTags = tagList.list.filter(function(obj) {
    return selected.tags.includes(obj.description)
  })
  query.memberTags = query.memberTags
    .map(function(obj) {
      return obj.id
    })
    .join(',')

  let userId = store.state.user.id
  if (
    request.downlineAffiliate !== null &&
    request.downlineAffiliate.trim() !== ''
  ) {
    downlineAffiliate.value = request.downlineAffiliate
    userId = request.downlineAffiliate
    showOperation.value = false
  }
  const { data: ret } = await loadMemberSummary(userId, query)

  page.pages = ret.pages
  page.records = ret.records
  page.loading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateMembers()
  }
}

function changeDepositPage(page) {
  if (depositRequest.current >= 1) {
    depositRequest.current = page
    loadDepositRecords()
  }
}

function changePrivilegePage(page) {
  if (privilegeRequest.current >= 1) {
    privilegeRequest.current = page
    loadPrivilegeRecords()
  }
}

function formatTag(tags) {
  if (tags.length > 0) {
    tags = tagList.list.filter(function(obj) {
      return tags.includes(obj.id)
    })
    tags = tags
      .map(function(obj) {
        return obj.description
      })
      .join(',')
    return tags
  }
  return '-'
}

async function loadAllTags() {
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  const { data: ret } = await getAffiliateTagList(userId)
  tagList.list = ret
  assignTaglist = JSON.parse(JSON.stringify(ret))
  tagList.list.push(unAssigned)
  tagList.description = tagList.list.map(function(obj) {
    return obj.description
  })
}

function goToTagSetting() {
  router.push('/downline/tag-setting')
}

function transferRedirect(name) {
  router.push(`/affiliate/transfer?user=${name}`)
}

function showGameRecord(name, affiliate) {
  if (affiliate) {
    router.push(`/downline/game-record?user=${name}&affiliate=${affiliate}`)
  } else {
    router.push(`/downline/game-record?user=${name}`)
  }
}

function showDepositRecord(member) {
  memberDepositInfo.loginName = member.loginName
  memberDepositInfo.realName = member.realName
  memberDepositInfo.regTime = member.regTime
  uiControl.depositDialogVisible = true
  depositRequest.current = 1
  depositRequest.loginName = member.loginName
  depositRequest.siteId = store.state.user.siteId
  loadDepositRecords()
}

async function loadDepositRecords() {
  memberDepositInfo.page.loading = true
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  const { data: ret } = await getMemberDepositRecords(userId, depositRequest)
  memberDepositInfo.page = ret
  memberDepositInfo.page.loading = false
}

function showPrivilegeRecord(member) {
  memberPrivilegeInfo.loginName = member.loginName
  memberPrivilegeInfo.realName = member.realName
  memberPrivilegeInfo.regTime = member.regTime
  uiControl.privilegeDialogVisible = true
  privilegeRequest.current = 1
  privilegeRequest.memberId = member.id
  privilegeRequest.loginName = member.loginName
  privilegeRequest.siteId = store.state.user.siteId
  loadPrivilegeRecords()
}

async function loadPrivilegeRecords() {
  memberPrivilegeInfo.page.loading = true
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  const { data: ret } = await getMemberPrivilegeRecords(
    userId,
    privilegeRequest
  )
  memberPrivilegeInfo.page = ret
  memberPrivilegeInfo.page.loading = false
}

function handleCheckAll(val) {
  selected.tags = val ? tagList.description : []
  isIndeterminate.value = false
}

function handleCheckedTags(value) {
  const checkedCount = value.length
  checkAll.value = checkedCount === tagList.description.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < tagList.description.length
}

async function showMemberInfo(row) {
  if (row) {
    uiControl.infoDialogVisible = true
    memberRequest.recordTime = [defaultStartDate, defaultEndDate]
    memberRequest.memberId = row.id
    memberInfo.tags = formatTag(row.tags)
    memberInfo.remark = row.remark
  }
  dialog.loading = true
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  const { data: ret } = await loadMemberInfo(
    userId,
    memberRequest.memberId,
    memberRequest.recordTime.join(',')
  )
  Object.entries(ret).forEach(([key, value]) => {
    if (value) {
      memberInfo[key] = value
    } else {
      memberInfo[key] = 0
    }
  })
  dialog.loading = false
}

function showEditTag(member) {
  selectedMember.id = member.id
  selectedMember.loginName = member.loginName
  tagRequest.tags = assignTaglist.filter(function(obj) {
    return member.tags.includes(obj.id)
  })
  tagRequest.tags = tagRequest.tags.map(function(obj) {
    return obj.description
  })
  uiControl.editType = 'One'
  uiControl.tagDialogVisible = true
}

function showBatchEditTag() {
  tagRequest.tags = []
  uiControl.editType = 'Many'
  uiControl.tagDialogVisible = true
}

async function submitTag() {
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  tagRequest.tags = assignTaglist.filter(function(obj) {
    return tagRequest.tags.includes(obj.description)
  })
  tagRequest.tags = tagRequest.tags.map(function(obj) {
    return obj.id
  })
  if (uiControl.editType === 'One') {
    await assignTag(userId, selectedMember.id, tagRequest.tags)
    selectedMember.id = null
    selectedMember.loginName = null
  } else {
    await assignTag(userId, selectedMemberList.id.join(','), tagRequest.tags)
  }
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
  await loadAffiliateMembers()
  uiControl.tagDialogVisible = false
}

function handleSelectionChange(val) {
  selectedMemberList.loginName = val.map(function(item) {
    return item.loginName
  })
  selectedMemberList.id = val.map(function(item) {
    return item.id
  })
  if (selectedMemberList.id.length === 0) {
    uiControl.editBtn = true
  } else {
    uiControl.editBtn = false
  }
}

function showEditRemark(member) {
  selectedMember.id = member.id
  selectedMember.loginName = member.loginName
  uiControl.remarkDialogVisible = true
  selectedMember.remark = member.remark
}

function showEditShareRatio(member) {
  selectedMember.id = member.id
  selectedMember.shareRatio = JSON.parse(JSON.stringify(member.shareRatio))
  if (
    selectedMember.shareRatio === null ||
    selectedMember.shareRatio === undefined
  ) {
    selectedMember.shareRatio = []
  }
  for (var item = 0; item < memberShareRatioList.list.length; item++) {
    if (
      !selectedMember.shareRatio.some(
        child => child.code === memberShareRatioList.list[item].code
      )
    ) {
      selectedMember.shareRatio.push({
        code: memberShareRatioList.list[item].code,
        value: 0,
      })
    }
  }
  for (var index = 0; index < selectedMember.shareRatio.length; index++) {
    selectedMember.shareRatio[index].value *= 100
    selectedMember.shareRatio[index].value = parseFloat(
      selectedMember.shareRatio[index].value
    ).toFixed(2)
  }
  uiControl.shareRatioDialogVisible = true
}

async function submitRemark() {
  let userId = store.state.user.id
  if (downlineAffiliate.value) {
    userId = downlineAffiliate.value
  }
  await assignRemark(userId, selectedMember.id, selectedMember.remark)
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
  await loadAffiliateMembers()
  uiControl.remarkDialogVisible = false
}

async function submitShareRatio() {
  const editedRatio = selectedMember.shareRatio
    .map(item => item.code + ':' + item.value / 100)
    .join(',')
  await editMemberRatio(selectedMember.id, editedRatio)
  ElMessage({ message: t('message.editSuccess'), type: 'success' })
  await loadAffiliateMembers()
  uiControl.shareRatioDialogVisible = false
}

function formatDate(date) {
  return date ? moment(date).format('YYYY/MM/DD HH:mm:ss') : '-'
}

function showCreateMember() {
  if (createForm.value) {
    createForm.value.resetFields()
  }
  createMemberForm.siteId = store.state.user.siteId
  uiControl.createMemberDialogVisible = true
}

async function createMember() {
  createForm.value.validate(async valid => {
    if (valid) {
      if (parseInt(createMemberForm.siteId) === 10) {
        createMemberForm.memberShareRatio = memberShareRatioList.list
          .map(item => item.code + ':' + item.value / 100)
          .join(',')
      }
      await registerMember(createMemberForm)
      uiControl.createMemberDialogVisible = false
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      await loadAffiliateMembers()
    }
  })
}

function getAffiliateRatio(code) {
  const shareRatio = affInfo.shareRatio.filter(item => item.code === code)
  return shareRatio === null ||
    shareRatio === undefined ||
    shareRatio.length === 0
    ? 0
    : shareRatio[0].value
}

async function getAllAffiliateDownlines() {
  const { data: downlines } = await getDownlineAffiliates()
  affiliate.list = downlines
}

function openRecycle(member) {
  uiControl.recycleDialogVisible = true
  recycleForm.memberId = member.id
  recycleForm.memberName = member.loginName
  recycleForm.amount = 0
}

const confirmRecycle = async () => {
  await recycleMemberBalance(recycleForm)
  ElMessage({ message: t('message.recycleSuccess'), type: 'success' })
  uiControl.recycleDialogVisible = false
  loadAffiliateMembers()
}

onMounted(async () => {
  await loadAllTags()
  await loadAffiliateMembers()
  const { data: aff } = await getAffiliateInfo(store.state.user.id)
  Object.keys({ ...aff }).forEach(field => {
    affInfo[field] = aff[field]
  })
  getConfigListByGroup('AGENT_SHARE_RATIO', store.state.user.siteId).then(
    res => {
      res.data.forEach(ratio => {
        memberShareRatioList.list.push({
          code: ratio.code,
          value: 0,
        })
      })
    }
  )
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-container {
  margin: 40px 0 20px;
  display: flex;
}

.number-division {
  display: inline-flex;
  align-items: center;
}

.amount-input input {
  border: 5px solid red;
}

.input-min {
  width: 55%;

  :deep(.el-input-group__append) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.el-input-group {
  vertical-align: unset;
}

.input-max {
  width: 40%;

  :deep(.el-input__inner) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

:deep(.el-date-editor.el-input__inner) {
  width: 100%;
}

.scrollable-container {
  max-height: 600px;
  overflow-y: auto;
}

.info-container {
  border-radius: 5px;
  border: 1px solid #f2f2f6;
  padding: 0 20px;
  margin: 24px 0;
}

.info-row-container {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-form-item {
    flex: 1;
    margin-bottom: 0;
  }
}

.el-form-item {
  flex: 1;
  margin-bottom: 0;
}

.create-form > * {
  margin-bottom: 22px;
}

.info-row-container:not(:first-child) {
  border-top: 1px solid #f2f2f6;
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.relativerow {
  position: relative;
}

.absbuttons {
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-dropdown-menu-box-shadow);
  right: 0px;
  bottom: 0px;

  button {
    font-size: 12px;
    cursor: pointer;
    border: 0;
    padding: 10px;
    background: #ffffff;

    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
  }
}

.inputs-wrap {
  margin: 0px 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  .input-small {
    width: 100%;
    max-width: 200px;

    &.el-range-editor--small.el-input__inner {
      height: 40px;
      max-width: 300px;
    }
  }

  .btn-grp {
    display: flex;
  }

  .el-row .el-col {
    display: flex;
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .memberTag {
    position: absolute;
    top: -20px;
    right: 0;
  }

  .info-row-container {
    flex-direction: column;
  }
}
</style>
<style>
.dialog900 .el-dialog {
  max-width: 900px;
}

.dialog400 .el-dialog {
  max-width: 400px;
}

.custom-table tr:hover > td {
  background: none !important;
}
</style>

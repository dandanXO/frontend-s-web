<template>
  <div class="tables-container-wrap1">
    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.accountInfo') }}</span>
        </div>
      </template>
      <el-descriptions
        size="small"
        class="margin-top"
        :column="3"
        border
        v-loading="loading.accountInfo"
      >
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.loginName') }}
            </div>
          </template>
          <span v-if="memberDetail.loginName !== null">{{ memberDetail.loginName }}</span>
          <span v-if="memberDetail.loginName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user1" style="height: 16px;width: 16px;" />
              {{ t('fields.realName') }}
            </div>
          </template>
          <span v-if="memberDetail.realName !== null">{{ memberDetail.realName }}</span>
          <span v-if="memberDetail.realName === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:detail:unmask']"
            @click="unmaskDetail('NAME')"
            :disabled="memberDetail.realName === null"
          >
            {{ t('fields.show') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="password" style="height: 16px;width: 16px;" />
              {{ t('fields.password') }}
            </div>
          </template>
          <el-button type="info" size="mini" v-permission="['sys:affiliate:update:password']" @click="showDialog('UPDATE_PASSWORD')">
            {{ t('fields.updatePassword') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="lock" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateStatus') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.affiliateStatus === 'APPLY'" size="mini">
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag v-if="memberDetail.affiliateStatus === 'NORMAL'" size="mini" type="success">
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag v-if="memberDetail.affiliateStatus === 'DISABLE'" size="mini" type="danger">
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag v-if="memberDetail.affiliateStatus === null" size="mini" type="info">
            -
          </el-tag>
          <el-button v-if="memberDetail.affiliateStatus === 'APPLY'" type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:state']" @click="approve">
            {{ t('fields.approve') }}
          </el-button>
          <el-button v-if="memberDetail.affiliateStatus === 'NORMAL'" type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:state']" @click="showDialog('DISABLE_AFFILIATE')">
            {{ t('fields.disable') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="redis" style="height: 16px;width: 16px;" />
              {{ t('fields.financialLevel') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.financial !== null" size="mini">{{ memberDetail.financial }}</el-tag>
          <el-tag v-if="memberDetail.financial === null" type="info" size="mini">-</el-tag>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:financial']" @click="showDialog('UPDATE_FINANCIAL')" :disabled="financialList.list.length === 0">
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="phone" style="height: 16px;width: 16px;" />
              {{ t('fields.telephone') }}
            </div>
          </template>
          <span v-if="memberDetail.telephone !== null">{{ memberDetail.telephone }}</span>
          <span v-if="memberDetail.telephone === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:detail:unmask']"
            @click="unmaskDetail('TELEPHONE')"
            :disabled="memberDetail.telephone === null"
          >
            {{ t('fields.show') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="email" style="height: 16px;width: 16px;" />
              {{ t('fields.email') }}
            </div>
          </template>
          <span v-if="memberDetail.email !== null">{{ memberDetail.email }}</span>
          <span v-if="memberDetail.email === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:detail:unmask']"
            @click="unmaskDetail('EMAIL')"
            :disabled="memberDetail.email === null"
          >
            {{ t('fields.show') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="international" style="height: 16px;width: 16px;" />
              {{ t('fields.country') }}
            </div>
          </template>
          <span v-if="memberDetail.country !== null">{{ memberDetail.country }}</span>
          <span v-if="memberDetail.country === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="visits" style="height: 16px;width: 16px;" />
              {{ t('fields.site') }}
            </div>
          </template>
          <span v-if="memberDetail.site !== null">{{ memberDetail.site }}</span>
          <span v-if="memberDetail.site === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="monitor" style="height: 16px;width: 16px;" />
              {{ t('fields.commissionModel') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.commissionModel === 'SIMPLE'" size="mini">
            {{ t('affiliate.commissionModel.' + memberDetail.commissionModel) }}
          </el-tag>
          <el-tag v-if="memberDetail.commissionModel === 'NORMAL'" size="mini" type="success">
            {{ t('affiliate.commissionModel.' + memberDetail.commissionModel) }}
          </el-tag>
          <el-tag v-if="memberDetail.commissionModel === null" size="mini" type="info">
            -
          </el-tag>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:commission-model']" @click="showDialog('UPDATE_MODEL')">
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.totalBalance') }}
            </div>
          </template>
          <div style="display: inline-block;" v-loading="loading.total">
            <div class="balance">
              $ <span v-formatter="{data: memberDetail.balance,type: 'money'}" />
            </div>
          </div>
          <el-button class="refresh-btn" icon="el-icon-refresh" size="mini" @click="refreshAllBalance" />
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="visits" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateLink') }}
            </div>
          </template>
          <a :href="link" v-if="affiliateDetails.affiliateCode !== null" target="_blank" style="color: #1fa8db">{{ link }}</a>
          <span v-if="affiliateDetails.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="monitor" style="height: 16px;width: 16px;" />
              {{ t('fields.timeType') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.timeType === 'MONTHLY'" size="mini">
            {{ t('affiliate.timeType.' + memberDetail.timeType) }}
          </el-tag>
          <el-tag v-if="memberDetail.timeType === 'WEEKLY'" size="mini" type="success">
            {{ t('affiliate.timeType.' + memberDetail.timeType) }}
          </el-tag>
          <el-tag v-if="memberDetail.timeType === null" size="mini" type="info">
            -
          </el-tag>
          <el-button type="info" size="mini" style="float: right;" v-if="hasPermission(['sys:affiliate:update:time-type'])" v-permission="['sys:affiliate:update:time-type']" @click="showDialog('UPDATE_TIME_TYPE')">
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context" />
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context" />
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateInfo') }}</span>
        </div>
      </template>
      <el-descriptions
        size="small"
        class="margin-top"
        :column="3"
        border
        v-loading="loading.affiliateInfo"
      >
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="education" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateCode') }}
            </div>
          </template>
          <span v-if="affiliateDetails.affiliateCode !== null">{{ affiliateDetails.affiliateCode }}</span>
          <span v-if="affiliateDetails.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="tree-table" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateLevel') }}
            </div>
          </template>
          <span v-if="affiliateDetails.affiliateLevel !== null">{{ affiliateDetails.affiliateLevel }}</span>
          <span v-if="affiliateDetails.affiliateLevel === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.commission') }}
            </div>
          </template>
          <span v-if="affiliateDetails.commission !== null">{{ affiliateDetails.commission }} %</span>
          <span v-if="affiliateDetails.commission === null">0 %</span>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:commission']" @click="showDialog('UPDATE_COMMISSION')">
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="peoples" style="height: 16px;width: 16px;" />
              {{ t('fields.totalDownlineMembers') }}
            </div>
          </template>
          <span v-if="affiliateDetails.downlineMember !== null">{{ affiliateDetails.downlineMember }}</span>
          <span v-if="affiliateDetails.downlineMember === null">0</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="peoples" style="height: 16px;width: 16px;" />
              {{ t('fields.totalDownlineAffiliates') }}
            </div>
          </template>
          <span v-if="affiliateDetails.downlineAffiliate !== null">{{ affiliateDetails.downlineAffiliate }}</span>
          <span v-if="affiliateDetails.downlineAffiliate === null">0</span>
        </el-descriptions-item>
        <el-descriptions-item />
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.superiorAffiliateInfo') }}</span>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:change-affiliate']"
                     @click="showDialog('CHANGE_AFF')"
          >
            {{ t('fields.changeAffiliate') }}
          </el-button>
        </div>
      </template>
      <el-descriptions
        size="small"
        class="margin-top"
        :column="3"
        border
        v-loading="loading.superiorAffiliateInfo"
      >
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.superiorAffiliateName') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.loginName !== null">{{ superiorAffiliateDetail.loginName }}</span>
          <span v-if="superiorAffiliateDetail.loginName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="example" style="height: 16px;width: 16px;" />
              {{ t('fields.superiorAffiliateCode') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.affiliateCode !== null">{{ superiorAffiliateDetail.affiliateCode }}</span>
          <span v-if="superiorAffiliateDetail.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              {{ t('fields.superiorAffiliateLevel') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.affiliateLevel !== null">{{ superiorAffiliateDetail.affiliateLevel }}</span>
          <span v-if="superiorAffiliateDetail.affiliateLevel === null">-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.remark') }}</span>
        </div>
      </template>
      <el-table :data="page.records" ref="table"
                v-loading="loading.remark"
                row-key="id"
                size="small"
                highlight-current-row
                :empty-text="t('fields.noData')"
      >
        <el-table-column prop="remark" :label="t('fields.remark')" />
        <el-table-column prop="createTime" :label="t('fields.createTime')" width="200px">
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{data: scope.row.createTime, timeZone: timeZone, type: 'date'}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createBy" :label="t('fields.createBy')" width="200px" />
        <el-table-column align="right" fixed="right">
          <template #default="scope">
            <el-button icon="el-icon-edit"
                       size="mini"
                       type="success" @click="showEditRemark(scope.row)"
            />
            <el-button icon="el-icon-remove"
                       size="mini"
                       type="danger" @click="removeRemark(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination"
                     @current-change="changePage"
                     layout="prev, pager, next"
                     :page-size="request.size"
                     :page-count="page.pages"
                     :current-page="request.current"
                     style="float: left;"
      />
      <el-button type="info" size="mini" style="float: right; margin-top: 5px; margin-bottom: 5px;"
                 v-permission="['sys:affiliate:add:remark']" @click="showDialog('ADD_REMARK')"
      >
        {{ t('fields.addRemark') }}
      </el-button>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.loginInfo') }}</span>
        </div>
      </template>
      <el-descriptions
        size="small"
        class="margin-top"
        :column="3"
        border
        v-loading="loading.loginInfo"
      >
        <el-descriptions-item label-align="left" :label="t('fields.registerTime')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.regTime !== null" v-formatter="{data: memberDetail.regTime,timeZone: timeZone,type: 'date'}" />
          <span v-if="memberDetail.regTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.registerIp')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.regIp !== null">{{ memberDetail.regIp }}</span>
          <span v-if="memberDetail.regIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.registerAddress')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.regAddress !== '-,-,-' && memberDetail.regAddress !== 'null,null,null' && memberDetail.regAddress !== null">{{ memberDetail.regAddress }}</span>
          <span v-if="memberDetail.regAddress === '-,-,-' || memberDetail.regAddress === 'null,null,null' || memberDetail.regAddress === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginTime')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.lastLoginTime === null" v-formatter="{data: memberDetail.lastLoginTime,timeZone: timeZone,type: 'date'}" />
          <span v-if="memberDetail.lastLoginTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginIp')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.lastLoginIp !== null">{{ memberDetail.lastLoginIp }}</span>
          <span v-if="memberDetail.lastLoginIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginAddress')" label-class-name="member-label" class-name="member-context">
          <span v-if="memberDetail.lastLoginAddress !== '-,-,-' && memberDetail.lastLoginAddress !== 'null,null,null' && memberDetail.lastLoginAddress !== null">{{ memberDetail.lastLoginAddress }}</span>
          <span v-if="memberDetail.lastLoginAddress === '-,-,-' || memberDetail.lastLoginAddress === 'null,null,null' || memberDetail.lastLoginAddress === null">-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form v-if="uiControl.dialogType === 'UPDATE_PASSWORD'" ref="updatePasswordForm" :model="passwordForm" :rules="passwordFormRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input v-model="passwordForm.password" type="password" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <el-form-item :label="t('fields.reenterPassword')" prop="reEnterPassword">
          <el-input v-model="passwordForm.reEnterPassword" type="password" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="changePassword">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'DISABLE_AFFILIATE'" ref="freezeMemberForm" :model="freezeForm" :rules="freezeFormRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.disableType')" prop="freezeType">
          <el-select
            v-model="freezeForm.freezeType"
            size="small"
            :placeholder="t('fields.disableType')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in freezeType.list"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.reason')" prop="reason">
          <el-select
            v-model="freezeForm.reason"
            size="small"
            :placeholder="t('fields.reason')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in freezeReason.list"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.remark')" prop="remark" :required="freezeForm.reason === 'Others'">
          <el-input type="textarea" v-model="freezeForm.remark" :rows="6" style="width: 350px;" maxlength="500" show-word-limit />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="freeze">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_FINANCIAL'" ref="updateFinancialForm" :model="financialForm" :rules="financialFormRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.financialLevel')" prop="financial">
          <el-select
            v-model="financialForm.financial"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadFinancialLevels"
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateField('FINANCIAL')">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_MODEL'" ref="updateModelForm" :model="modelForm" :rules="modelFormRules" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.commissionModel')" prop="commissionModel">
          <el-select
            v-model="modelForm.commissionModel"
            size="small"
            :placeholder="t('fields.commissionModel')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.commissionModelType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateModel">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_COMMISSION'" ref="commissionForm" :model="commForm" :rules="commFormRules" :inline="true" size="small" label-width="200px">
        <el-form-item :label="t('fields.commissionRate')" prop="commission">
          <el-input v-model="commForm.commission" style="width: 250px" :maxlength="uiControl.commissionMax" @keypress="restrictCommissionDecimalInput($event)" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible=false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateCommission()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'ADD_REMARK'" ref="addRemarkForm" :model="remarkForm"
               :rules="remarkFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="remarkForm.remark" :rows="6" style="width: 350px;" maxlength="500"
                    show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="addRemark()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'EDIT_REMARK'" ref="editRemarkForm" :model="remarkForm"
               :rules="remarkFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="remarkForm.remark" :rows="6" style="width: 350px;" maxlength="500"
                    show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="editRemark()">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_TIME_TYPE'" ref="updateTimeTypeModel" :model="timeTypeForm" :inline="true" size="small" label-width="150px">
        <el-form-item :label="t('fields.timeType')" prop="timeType">
          <el-select
            v-model="timeTypeForm.timeType"
            size="small"
            :placeholder="t('fields.timeType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.timeType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateMemberTimeType">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <div v-if="uiControl.dialogType === 'UNMASK'">
        {{ unmaskedValue }}
      </div>
      <el-form
        v-if="uiControl.dialogType === 'CHANGE_AFF'"
        ref="changeAffForm"
        :model="affForm"
        :rules="affFormRules"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.affiliateCode')" prop="affiliateCode">
          <el-input v-model="affForm.affiliateCode" style="width: 350px;" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="changeAffiliate">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, defineProps, nextTick, onMounted, reactive, ref } from "vue";
import { useRoute } from 'vue-router'
import { hasPermission } from "../../../../../utils/util";
import { ElMessage } from "element-plus";
import { required, size } from "../../../../../utils/validate";
import { getAffiliateInfo, getMemberBalance, getMemberEmail, getMemberRealName, getMemberTelephone } from "../../../../../api/member";
import { getFinancialLevels } from "../../../../../api/financial-level";
import { getAffiliateRecord } from "../../../../../api/affiliate-record";
import {
  addAffiliateRemark, approveAffiliate, changeNewAffilaite, deleteAffiliateRemark, disableAffiliate,
  editAffiliateRemark, getAffiliateDetails, getAffiliateRemark, updateAffiliateFinancial,
  updateAffiliatePassword, updateCommissionModel, updateCommissionRate, updateTimeType
} from "../../../../../api/member-affiliate";
import { useStore } from '../../../../../store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const LOGIN_USER_NAME = computed(() => store.state.user.name);
const link = ref("");
const props = defineProps({
  affId: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true
  }
});
const unmaskedValue = ref(null);
const route = useRoute()
const site = reactive({
  id: route.query.site
});

const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: "",
  dialogType: "",
  commissionModelType: [
    { key: 1, displayName: t('affiliate.commissionModel.NORMAL'), value: "NORMAL" },
    { key: 2, displayName: t('affiliate.commissionModel.SIMPLE'), value: "SIMPLE" },
  ],
  timeType: [
    { key: 1, displayName: t('affiliate.timeType.MONTHLY'), value: "MONTHLY" },
    { key: 2, displayName: t('affiliate.timeType.WEEKLY'), value: "WEEKLY" },
  ],
  commissionMax: 2
});

const loading = reactive({
  accountInfo: false,
  loginInfo: false,
  remark: false,
  total: false,
  affiliateInfo: false,
  superiorAffiliateInfo: false
});

const updatePasswordForm = ref(null);
const freezeMemberForm = ref(null);
const updateFinancialForm = ref(null);
const updateModelForm = ref(null);
const addRemarkForm = ref(null);
const editRemarkForm = ref(null);
const commissionForm = ref(null);
const updateTimeTypeModel = ref(null);
const changeAffForm = ref(null);
const freezeType = reactive({
  list: [
    { key: 1, name: t('types.NORMAL'), value: "NORMAL" },
    { key: 2, name: t('types.TEMPORARY'), value: "TEMPORARY" },
    { key: 3, name: t('types.PERMANENT'), value: "PERMANENT" }
  ]
});

const freezeReason = reactive({
  list: [
    { key: 1, name: t('types.gameViolation'), value: "Game Violation" },
    { key: 2, name: t('types.memberRequest'), value: "Member Request" },
    { key: 3, name: t('types.others'), value: "Others" }
  ]
});

const financialList = reactive({
  list: []
});

const memberDetail = reactive({
  id: 0,
  loginName: "",
  superiorAffName: "",
  regTime: "",
  balance: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  lastLoginTime: "",
  affiliateStatus: "",
  commissionModel: "",
  timeType: "",
  realName: "",
  email: "",
  telephone: "",
  regIp: "",
  lastLoginIp: "",
  birthday: "",
  country: "",
  financial: "",
  totalBonus: 0,
  site: "",
  siteId: 0,
});

const affiliateDetails = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineMember: 0,
  downlineAffiliate: 0,
  commission: 0
});

const superiorAffiliateDetail = reactive({
  id: 0,
  loginName: null,
  affiliateCode: null,
  affiliateLevel: null
});

const page = reactive({
  pages: 0,
  records: []
});

const request = reactive({
  size: 5,
  current: 1
});

const passwordForm = reactive({
  password: null,
  reEnterPassword: null
});

const freezeForm = reactive({
  id: null,
  freezeType: null,
  reason: null,
  remark: null,
  site: null
});

const financialForm = reactive({
  financial: null
});

const modelForm = reactive({
  commissionModel: null
});

const commForm = reactive({
  commission: 0
});

const remarkForm = reactive({
  id: null,
  memberId: null,
  remark: null
});

const timeTypeForm = reactive({
  timeType: null
});

const affForm = reactive({
  affiliateCode: null
});

const validatePassword = (rule, value, callback) => {
  if (value !== "" && passwordForm.reEnterPassword !== "") {
    updatePasswordForm.value.validateField(t('message.reenterPassword'));
  }
  callback();
};

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== passwordForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback();
};

const validateCommission = (rule, value, callback) => {
  if (value !== "" &&
    ((commForm.commission < 0 || commForm.commission > 1))) {
    callback(new Error(t('message.validateCommissionFormat')))
  }
  callback();
};

const passwordFormRules = reactive({
  password: [required(t('message.validatePasswordRequired')), size(6, 12, t('message.validatePasswordSize')), { validator: validatePassword, trigger: "blur" }],
  reEnterPassword: [required(t('message.validateReenterPasswordRequired')), { validator: validateReEnterPassword, trigger: "blur" }]
});

const freezeFormRules = reactive({
  freezeType: [required(t('message.validateFreezeTypeRequired'))],
  reason: [required(t('message.validateReasonRequired'))]
});

const financialFormRules = reactive({
  financial: [required(t('message.validateFinancialLevelRequired'))]
});

const commFormRules = reactive({
  commission: [required(t('message.validateCommissionRequired')), { validator: validateCommission, trigger: "blur" }],
});

const remarkFormRules = reactive({
  remark: [required(t('message.validateRemarkRequired'))]
});

const affFormRules = reactive({
  affiliateCode: [required(t('message.validateAffiliateCodeRequired'))]
});

const loadAffiliateRemark = async () => {
  loading.remark = true;
  const { data: ret } = await getAffiliateRemark(props.affId, request);
  page.pages = ret.pages;
  page.records = ret.records;
  loading.remark = false;
};

const changePage = (page) => {
  if (request.current >= 1) {
    request.current = page;
    loadAffiliateRemark();
  }
};

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels();
  financialList.list = financial;
}

async function loadReferralLink() {
  if (memberDetail.siteId === '1') {
    link.value = "https://xf1869.com/agent/" + affiliateDetails.affiliateCode;
  } else if (memberDetail.siteId === '2') {
    link.value = "https://www.dy1698.com/agent/" + affiliateDetails.affiliateCode;
  } else if (memberDetail.siteId === '3') {
    link.value = "https://www.jolly8858.com/agent/" + affiliateDetails.affiliateCode;
  } else {
    link.value = "";
  }
}

function showDialog(type) {
  uiControl.dialogType = type;
  if (type === "UPDATE_PASSWORD") {
    if (updatePasswordForm.value) {
      updatePasswordForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.updatePassword');
  } else if (type === "DISABLE_AFFILIATE") {
    if (freezeMemberForm.value) {
      freezeMemberForm.value.resetFields();
    }
    freezeForm.site = site.id;
    freezeForm.freezeType = freezeType.list[0].value;
    freezeForm.reason = freezeReason.list[0].value;
    uiControl.dialogTitle = t('fields.disableAffiliate');
  } else if (type === "UPDATE_FINANCIAL") {
    if (updateFinancialForm.value) {
      updateFinancialForm.value.resetFields();
    }
    if (memberDetail.financial) {
      const financial = financialList.list.find(f => f.name === memberDetail.financial);
      financialForm.financial = financial.id;
    } else {
      financialForm.financial = financialList.list[0].id;
    }
    uiControl.dialogTitle = t('fields.updateFinancialLevel');
  } else if (type === "UPDATE_MODEL") {
    if (memberDetail.commissionModel) {
      const commissionModel = uiControl.commissionModelType.find(c => c.value === memberDetail.commissionModel);
      modelForm.commissionModel = commissionModel.value;
    } else {
      modelForm.commissionModel = uiControl.commissionModelType[0].value;
    }
    uiControl.dialogTitle = t('fields.updateCommissionModel');
  } else if (type === 'UPDATE_COMMISSION') {
    commForm.commission = affiliateDetails.commission / 100;
    uiControl.dialogTitle = t('fields.updateCommissionRate');
  } else if (type === "ADD_REMARK") {
    if (addRemarkForm.value) {
      addRemarkForm.value.resetFields();
    }
    remarkForm.id = null;
    remarkForm.remark = null;
    uiControl.dialogTitle = t('fields.addRemark');
  } else if (type === "EDIT_REMARK") {
    if (editRemarkForm.value) {
      editRemarkForm.value.resetFields();
    }
    uiControl.dialogTitle = t('fields.editRemark');
  } else if (type === "UPDATE_TIME_TYPE") {
    if (memberDetail.timeType !== null) {
      const timeType = uiControl.timeType.find(c => c.value === memberDetail.timeType);
      timeTypeForm.timeType = timeType.value;
    } else {
      timeTypeForm.timeType = uiControl.timeType[0].value;
    }
    uiControl.dialogTitle = t('fields.editTimeType');
  } else if (type === 'CHANGE_AFF') {
    if (changeAffForm.value) {
      changeAffForm.value.resetFields();
    }
    affForm.affiliateCode = null;
    uiControl.dialogTitle = t('fields.changeAffiliate');
  }
  uiControl.dialogVisible = true;
}

function changePassword() {
  updatePasswordForm.value.validate(async (valid) => {
    if (valid) {
      await updateAffiliatePassword(props.affId, passwordForm.password, memberDetail.siteId);
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.updatePasswordSuccess'), type: "success" });
    }
  });
}

function freeze() {
  freezeMemberForm.value.validate(async (valid) => {
    if (valid) {
      await disableAffiliate(props.affId, freezeForm);
      const data = await getAffiliateDetails(props.affId, site.id);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField];
      });
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.affiliateDisabled'), type: "success" });
    }
  });
}

async function approve() {
  await approveAffiliate(props.affId, LOGIN_USER_NAME.value);
  const data = await getAffiliateRecord(props.affId);
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField];
  });
  uiControl.dialogVisible = false;
  ElMessage({ message: t('message.affiliateApproved'), type: "success" });
}

function updateModel() {
  updateModelForm.value.validate(async (valid) => {
    if (valid) {
      await updateCommissionModel(props.affId, modelForm.commissionModel);
      const data = await getAffiliateRecord(props.affId);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField];
      });
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.updateCommissionModelSuccess'), type: "success" });
    }
  });
}

function updateField(type) {
  if (type === "FINANCIAL") {
    updateFinancialForm.value.validate(async (valid) => {
      if (valid) {
        await updateAffiliateFinancial(props.affId, financialForm.financial, site.id);
        const data = await getAffiliateDetails(props.affId, site.id);
        Object.keys({ ...data.data }).forEach(detailField => {
          memberDetail[detailField] = data.data[detailField];
        });
        uiControl.dialogVisible = false;
        ElMessage({ message: t('message.updateFinancialLevelSuccess'), type: "success" });
      }
    });
  }
}

async function updateCommission() {
  commissionForm.value.validate(async valid => {
    if (valid) {
      await updateCommissionRate(props.affId, commForm.commission);
      await loadAffiliateRecord();
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.updateCommissionRateSuccess'), type: "success" });
    }
  });
}

function updateMemberTimeType() {
  updateTimeTypeModel.value.validate(async (valid) => {
    if (valid) {
      await updateTimeType(props.affId, timeTypeForm.timeType);
      const data = await getAffiliateRecord(props.affId);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField];
      });
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.updateTimeTypeSuccess'), type: "success" });
    }
  });
}
const addRemark = () => {
  addRemarkForm.value.validate(async (valid) => {
    if (valid) {
      remarkForm.memberId = props.affId;
      await addAffiliateRemark(remarkForm);
      await loadAffiliateRemark();
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.addRemarkSuccess'), type: "success" });
    }
  });
};

const editRemark = async () => {
  editRemarkForm.value.validate(async (valid) => {
    if (valid) {
      await editAffiliateRemark(remarkForm.id, remarkForm.remark);
      await loadAffiliateRemark();
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.editRemarkSuccess'), type: "success" });
    }
  });
};

const removeRemark = async (remark) => {
  await deleteAffiliateRemark(remark.id);
  await loadAffiliateRemark();
  uiControl.dialogVisible = false;
  ElMessage({ message: t('message.removeRemarkSuccess'), type: "success" });
};

const showEditRemark = (row) => {
  showDialog('EDIT_REMARK');
  nextTick(() => {
    for (const key in row) {
      if (Object.keys(remarkForm).find(k => k === key)) {
        remarkForm[key] = row[key]
      }
    }
  });
};

async function loadBalance() {
  const { data: balance } = await getMemberBalance(props.affId);
  memberDetail.balance = balance;
}

async function refreshAllBalance() {
  loading.total = true;
  await loadBalance();
  loading.total = false;
}

async function loadAffiliateRecord() {
  const { data: record } = await getAffiliateRecord(props.affId);
  affiliateDetails.affiliateCode = record.affiliateCode;
  affiliateDetails.affiliateLevel = record.affiliateLevel;
  affiliateDetails.downlineMember = record.downlineMember;
  affiliateDetails.downlineAffiliate = record.downlineAffiliate;
  affiliateDetails.commission = record.commission * 100;
}

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if (
    (charCode < 48 || charCode > 57) && charCode !== 46
  ) {
    event.preventDefault();
  }

  if (
    (commForm.commission !== null &&
    commForm.commission.toString().indexOf('.') > -1)
  ) {
    if (charCode === 46) {
      event.preventDefault();
    }
    uiControl.commissionMax = 4;
  } else if (commForm.commission === "1") {
    uiControl.commissionMax = 1;
  } else {
    uiControl.commissionMax = 2;
  }
}

async function unmaskDetail(type) {
  if (type === 'NAME') {
    const { data: name } = await getMemberRealName(props.affId, site.id);
    unmaskedValue.value = name;
    uiControl.dialogTitle = t('fields.realName');
  } else if (type === 'EMAIL') {
    const { data: email } = await getMemberEmail(props.affId, site.id);
    unmaskedValue.value = email;
    uiControl.dialogTitle = t('fields.email');
  } else if (type === 'TELEPHONE') {
    const { data: telephone } = await getMemberTelephone(props.affId, site.id);
    unmaskedValue.value = telephone;
    uiControl.dialogTitle = t('fields.telephone');
  }
  showDialog("UNMASK");
}

async function changeAffiliate() {
  await changeNewAffilaite(props.affId, affForm.affiliateCode, memberDetail.memberType);
  ElMessage({ message: t('message.changeAffiliateSuccess'), type: "success" });
  uiControl.dialogVisible = false;
  loading.superiorAffiliateInfo = true;
  const { data: aff } = await getAffiliateInfo(props.affId, site.id);
  Object.keys({ ...aff }).forEach(detailField => {
    superiorAffiliateDetail[detailField] = aff[detailField];
  });
  loading.superiorAffiliateInfo = false;
}

onMounted(async () => {
  loading.accountInfo = true;
  loading.loginInfo = true;
  loading.affiliateInfo = true;
  loading.superiorAffiliateInfo = true;
  await loadFinancialLevels();
  const data = await getAffiliateDetails(props.affId, site.id);
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField];
  });
  const { data: aff } = await getAffiliateInfo(props.affId, site.id);
  Object.keys({ ...aff }).forEach(detailField => {
    superiorAffiliateDetail[detailField] = aff[detailField];
  });
  await loadAffiliateRemark();
  await loadBalance();
  await loadAffiliateRecord();
  await loadReferralLink();
  loading.accountInfo = false;
  loading.loginInfo = false;
  loading.affiliateInfo = false;
  loading.superiorAffiliateInfo = false;
});

</script>

<style lang="scss">
.member-label {
  width: 150px;

  div {
    display: flex;
    align-items: center;
  }
}

.member-context {
  width: 20%;
}

</style>

<style lang="scss" scoped>
.tables-container-wrap1 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .info-card {
    margin-bottom: 10px;
  }
}

.box-card {
  ::v-deep(.el-card__body) {
    padding: 0;
  }
}

::v-deep {
  .el-tabs__content {
    padding: 0;
  }
}

.platform {
  display: flex;
  text-align: center;
  width: fit-content;
  flex: 1;

  * {
    // add back paddings supposed to be present
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    background-color: #f5f7fa;
    width: 73px;
  }

  .plat-ctrl {
    flex: 1;
  }
}

::v-deep([class^="el-table"]) {
  .cell,
  .remove-padding {
    padding: 0 !important;
  }

  .remove-padding {
    .cell {
      display: flex;
    }
  }
}

.balance {
  padding: 3px 50px;
  border: solid 1px #dcdfe6;
  background-color: #e9ecef;
  border-radius: 5px;
  display: inline-block;
}

.platform-balance {
  padding: 5px;
  display: inline-block;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.refresh-btn {
  float: right;
}

.refresh-platform-btn {
  float: right;
}

</style>

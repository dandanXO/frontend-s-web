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
          <el-button type="info" size="mini" v-permission="['sys:member:logout-player']"
                     style="float: right;" @click="logoutPlayer"
          >{{ t('fields.logoutPlayer') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" :class-name="memberDetail.dupName === 'red'?'member-context-red':'member-context'">
          <template #label>
            <div>
              <svg-icon icon-class="user1" style="height: 16px;width: 16px;" />
              {{ t('fields.realName') }}
            </div>
          </template>
          <span v-if="memberDetail.realName !== null">{{ memberDetail.realName }} </span>
          <span v-else-if="memberDetail.realName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.englishName') }}
            </div>
          </template>
          <span v-if="memberDetail.name2 !== null && memberDetail.name2 !== ''">{{ memberDetail.name2 }}</span>
          <span v-if="memberDetail.name2 === null || memberDetail.name2 === ''">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="password" style="height: 16px;width: 16px;" />
              {{ t('fields.password') }}
            </div>
          </template>
          <el-button type="info" size="mini" v-permission="['sys:member:update:password']"
                     @click="showDialog('UPDATE_PASSWORD')"
          >
            {{ t('fields.updatePassword') }}
          </el-button>
          <el-button type="info" size="mini" v-permission="['sys:member:unlock']"
                     @click="unlock()"
          >
            {{ t('fields.unlockMember') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="lock" style="height: 16px;width: 16px;" />
              {{ t('fields.status') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.status === 'NORMAL'" size="mini" type="success">
            {{ t('status.member.' + memberDetail.status) }}
          </el-tag>
          <el-tag v-if="memberDetail.status === 'FROZEN'" size="mini" type="danger">
            {{ t('status.member.' + memberDetail.status) }}
          </el-tag>
          <el-tag v-if="memberDetail.status === null" size="mini" type="info">
            -
          </el-tag>
          <el-button v-if="memberDetail.status === 'NORMAL'" type="info" size="mini" style="float: right;"
                     v-permission="['sys:member:update:state']" @click="showDialog('FREEZE_MEMBER')"
          >
            {{ t('fields.freeze') }}
          </el-button>
          <el-button v-if="memberDetail.status === 'FROZEN'" type="info" size="mini" style="float: right;"
                     v-permission="['sys:member:update:state']" @click="changeToNormal(memberDetail.id)"
          >
            {{ t('fields.open') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="redis" style="height: 16px;width: 16px;" />
              VIP
            </div>
          </template>
          <el-tag v-if="memberDetail.vip !== null" size="mini">{{ memberDetail.vip }}</el-tag>
          <el-tag v-if="memberDetail.vip === null" type="info" size="mini">-</el-tag>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:member:update:vip']"
                     @click="showDialog('UPDATE_VIP')" :disabled="vipList.list.length === 0"
          >
            {{ t('fields.update') }}
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
          <span class="level-color" :style="{backgroundColor: memberDetail.financialColor}" />
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:member:update:financial']"
                     @click="showDialog('UPDATE_FINANCIAL')" :disabled="financialList.list.length === 0"
          >
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

          <el-button
            style="margin-left: 5px"
            icon="el-icon-phone"
            size="mini"
            type="success"
            v-if="memberDetail.telephone !== null && uiControl.showCall"
            v-permission="['sys:member:call:phone']"
            @click="callPhone(memberDetail.id, memberDetail.siteId)"
          />
          <el-button
            style="margin-left: 5px"
            icon="el-icon-video-pause"
            size="mini"
            type="danger"
            v-if="memberDetail.telephone !== null && uiControl.showCall1"
            v-permission="['sys:member:stop:phone']"
            @click="stopPhone(memberDetail.id, memberDetail.siteId)"
          />
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="email" style="height: 16px;width: 16px;" />
              {{ t('fields.email') }}
            </div>
          </template>
          <span v-if="memberDetail.email !== ''">{{ memberDetail.email }}</span>
          <span v-if="memberDetail.email === ''">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            :disabled="memberDetail.email === ''"
            v-permission="['sys:member:detail:unmask']"
            @click="unmaskDetail('EMAIL')"
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
              <svg-icon icon-class="skill" style="height: 16px;width: 16px;" />
              {{ t('fields.riskLevel') }}
            </div>
          </template>
          <span v-if="memberDetail.risk !== null">{{ memberDetail.risk }}</span>
          <span v-if="memberDetail.risk === null">-</span>
          <span class="level-color" :style="{backgroundColor: memberDetail.riskColor}" />
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:member:update:risk']"
                     @click="showDialog('UPDATE_RISK')" :disabled="riskList.list.length === 0"
          >
            {{ t('fields.update') }}
          </el-button>
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
              <svg-icon icon-class="table" style="height: 16px;width: 16px;" />
              {{ t('fields.birthday') }}
            </div>
          </template>
          <span v-if="memberDetail.birthday !== null">{{ memberDetail.birthday }}</span>
          <span v-if="memberDetail.birthday === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="dev" style="height: 16px;width: 16px;" />
              {{ t('fields.registerHost') }}
            </div>
          </template>
          <span v-if="memberDetail.regHost !== null">{{ memberDetail.regHost }}</span>
          <span v-if="memberDetail.regHost === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="mnt" style="height: 16px;width: 16px;" />
              {{ t('fields.registerDevice') }}
            </div>
          </template>
          <span v-if="memberDetail.regDevice !== null">{{ memberDetail.regDevice }}</span>
          <span v-if="memberDetail.regDevice === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.referrer') }}
            </div>
          </template>
          <span v-if="memberDetail.referrerName !== null">{{ memberDetail.referrerName }}</span>
          <span v-if="memberDetail.referrerName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.userType') }}
            </div>
          </template>
          <span v-if="memberDetail.memberType !== null">{{ t('types.' + memberDetail.memberType) }}</span>
          <span v-if="memberDetail.memberType === null">-</span>
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:member:update:memberType']"
                     @click="showDialog('UPDATE_USERTYPE')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.sid') }}
            </div>
          </template>
          <span v-if="memberDetail.sid !== null">{{ memberDetail.sid }}</span>
          <span v-if="memberDetail.sid === null">-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateInfo') }}</span>
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
        v-loading="loading.affiliateInfo"
      >
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateName') }}
            </div>
          </template>
          <span v-if="affiliateDetail.loginName !== null">{{ affiliateDetail.loginName }}</span>
          <span v-if="affiliateDetail.loginName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="example" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateCode') }}
            </div>
          </template>
          <span v-if="affiliateDetail.affiliateCode !== null">{{ affiliateDetail.affiliateCode }}</span>
          <span v-if="affiliateDetail.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateLevel') }}
            </div>
          </template>
          <span v-if="affiliateDetail.affiliateLevel !== null">{{ affiliateDetail.affiliateLevel }}</span>
          <span v-if="affiliateDetail.affiliateLevel === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="timing" style="height: 16px;width: 16px;" />
              {{ t('fields.startTime') }}
            </div>
          </template>
          <span v-if="affiliateDetail.startTime !== null">{{ affiliateDetail.startTime }}</span>
          <span v-if="affiliateDetail.startTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context">
          <template #label>
            <div>
              <svg-icon icon-class="timing" style="height: 16px;width: 16px;" />
              {{ t('fields.endTime') }}
            </div>
          </template>
          <span v-if="affiliateDetail.endTime !== null">{{ affiliateDetail.endTime }}</span>
          <span v-if="affiliateDetail.endTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item />
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
            <span v-formatter="{data: scope.row.createTime, type: 'date', timeZone: timeZone}" />
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
                 v-permission="['sys:member:add:remark']" @click="showDialog('ADD_REMARK')"
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
        <el-descriptions-item label-align="left" :label="t('fields.registerTime')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span v-if="memberDetail.regTime !== null"
                v-formatter="{data: memberDetail.regTime,timeZone: timeZone,type: 'date'}"
          />
          <span v-if="memberDetail.regTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.registerIp')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span
            v-if="memberDetail.regIp !== null && memberDetail.dupIp === 'red'"
            style="color:red"
          >
            {{ memberDetail.regIp }}
          </span>
          <span
            v-if="memberDetail.regIp !== null && memberDetail.dupIp !== 'red'"
            :style="[selectedIpColor.registerIpColor !== null ? {color: selectedIpColor.registerIpColor}: {}]"
          >
            {{ memberDetail.regIp }}
          </span>
          <span v-if="memberDetail.regIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.registerAddress')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span
            v-if="memberDetail.regAddress !== '-,-,-' && memberDetail.regAddress !== 'null,null,null' && memberDetail.regAddress !== null"
          >{{
            memberDetail.regAddress
          }}</span>
          <span
            v-if="memberDetail.regAddress === '-,-,-' || memberDetail.regAddress === 'null,null,null' || memberDetail.regAddress === null"
          >-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginTime')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span v-if="memberDetail.lastLoginTime !== null"
                v-formatter="{data: memberDetail.lastLoginTime,timeZone: timeZone,type: 'date'}"
          />
          <span v-if="memberDetail.lastLoginTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginIp')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span
            v-if="memberDetail.lastLoginIp !== null"
            :style="[selectedIpColor.loginIpColor !== null ? {color: selectedIpColor.loginIpColor}: {}]"
          >
            {{ memberDetail.lastLoginIp }}
          </span>
          <span v-if="memberDetail.lastLoginIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" :label="t('fields.lastLoginAddress')" label-class-name="member-label"
                              class-name="member-context"
        >
          <span
            v-if="memberDetail.lastLoginAddress !== '-,-,-' && memberDetail.lastLoginAddress !== 'null,null,null' && memberDetail.lastLoginAddress !== null"
          >{{
            memberDetail.lastLoginAddress
          }}</span>
          <span
            v-if="memberDetail.lastLoginAddress === '-,-,-' || memberDetail.lastLoginAddress === 'null,null,null' || memberDetail.lastLoginAddress === null"
          >-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.fundingInfo') }}</span>
        </div>
      </template>
      <div v-loading="loading.fundingInfo">
        <el-descriptions>
          <el-descriptions-item :label="t('fields.totalBalance')" width="20%">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $ <span v-formatter="{data: memberDetail.balance,type: 'money'}" />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.withdrawableBalance')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $ <span v-formatter="{data: memberDetail.withdrawableBalance,type: 'money'}" />
              </div>
            </div>
            <el-button class="refresh-btn" icon="el-icon-refresh" size="mini" @click="refreshAllBalance" />
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          size="small"
          class="margin-top"
          :column="4"
          border
        >
          <el-descriptions-item v-for="(value, key, index) in platformWallet" label-align="left" :key="index"
                                label-class-name="member-label"
                                :label="key"
          >
            <div class="platform-balance" v-loading="loading.balance[key]">
              $ <span v-formatter="{data: value,type: 'money'}" />
            </div>
            <div>
              <el-button class="refresh-platform-btn" icon="el-icon-refresh" size="mini"
                         @click="refreshPlatformBalance(key)"
              />
              <el-button class="refresh-platform-btn" icon="el-icon-plus" size="mini"
                         @click="showTransferDialogue(key, 'DEPOSIT')"
              />
              <el-button class="refresh-platform-btn" icon="el-icon-minus" size="mini"
                         @click="showTransferDialogue(key, 'WITHDRAW')"
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" style="margin-top: 10px">
          <el-descriptions-item :label="t('fields.totalDeposit')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $ <span v-formatter="{data: memberDetail.totalDeposit,type: 'money'}" />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.totalWithdraw')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $ <span v-formatter="{data: memberDetail.totalWithdraw,type: 'money'}" />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.totalBonus')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $ <span v-formatter="{data: memberDetail.totalBonus,type: 'money'}" />
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-dialog :title="uiControl.dialogTitle" v-model="uiControl.dialogVisible" append-to-body width="580px">
      <el-form v-if="uiControl.dialogType === 'UPDATE_PASSWORD'" ref="updatePasswordForm" :model="passwordForm"
               :rules="passwordFormRules" :inline="true" size="small" label-width="150px"
      >
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
      <el-form v-if="uiControl.dialogType === 'FREEZE_MEMBER'" ref="freezeMemberForm" :model="freezeForm"
               :rules="freezeFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.freezeType')" prop="freezeType">
          <el-select
            v-model="freezeForm.freezeType"
            size="small"
            :placeholder="t('fields.freezeType')"
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
          <el-input type="textarea" v-model="freezeForm.remark" :rows="6" style="width: 350px;" maxlength="500"
                    show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="freeze">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_VIP'" ref="updateVipForm" :model="vipForm" :rules="vipFormRules"
               :inline="true" size="small" label-width="150px"
      >
        <el-form-item label="VIP" prop="vip">
          <el-select
            v-model="vipForm.vip"
            size="small"
            :placeholder="t('fields.vipLevel')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
            @focus="loadVips"
          >
            <el-option
              v-for="item in vipList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateField('VIP')">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_FINANCIAL'" ref="updateFinancialForm" :model="financialForm"
               :rules="financialFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.financialLevel')" prop="financial">
          <el-select
            v-model="financialForm.financial"
            size="small"
            :placeholder="t('fields.financialLevel')"
            class="filter-item"
            style="width: 315px;"
            default-first-option
            @change="populateFinancialColor"
            @focus="loadFinancialLevels"
          >
            <el-option
              v-for="item in financialList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span class="level-color" :style="{backgroundColor: selectedFinancialColor.levelColor}" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateField('FINANCIAL')">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_RISK'" ref="updateRiskForm" :model="riskForm"
               :rules="riskFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.member')">
          <el-input style="width: 350px" :placeholder="t('fields.loginName')" disabled />
        </el-form-item>
        <el-form-item :label="t('fields.riskLevel')" prop="risk">
          <el-select
            v-model="riskForm.risk"
            size="small"
            :placeholder="t('fields.riskLevel')"
            class="filter-item"
            style="width: 315px;"
            default-first-option
            @change="populateRiskColor"
            @focus="loadRiskLevels"
          >
            <el-option
              v-for="item in riskList.list"
              :key="item.id"
              :label="item.levelName"
              :value="item.id"
            />
          </el-select>
          <span class="level-color" :style="{backgroundColor: selectedRiskColor.levelColor}" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="updateField('RISK')">{{ t('fields.confirm') }}</el-button>
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
      <el-form v-if="uiControl.dialogType === 'PLATFORM_TRANSFER'" ref="platformTransferForm" :model="transferForm"
               :rules="transferFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input v-model="transferForm.amount" type="money" style="width: 350px;" maxlength="11" />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="transferFund">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_USERTYPE'" ref="updateUserTypeForm" :model="userTypeForm"
               :rules="userTypeFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.userType')" prop="memberType">
          <el-select
            v-model="userTypeForm.memberType"
            size="small"
            :placeholder="t('fields.userType')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in userType.list"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="editUserType">{{ t('fields.confirm') }}</el-button>
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

<script>
import { nextTick, defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from 'vue-router'
import { ElMessage } from "element-plus";
import { required, size, isNumeric } from "../../../../../utils/validate";
import {
  getMemberDetails,
  getMemberRemark,
  updatePassword,
  platformFundTransfer,
  freezeMember,
  getPlatformBalance,
  updateVip,
  updateFinancial,
  updateRisk,
  addMemberRemark,
  editMemberRemark,
  deleteMemberRemark,
  getMemberRealName,
  getMemberEmail,
  getMemberTelephone, normalMember, getAffiliateInfo,
  updateMemberType,
  unlockMember,
  refreshBalance,
  forceLogout
} from "../../../../../api/member";
import { getPlatformsBySite } from "../../../../../api/platform";
import { selectIpLabelAll } from "../../../../../api/ip-label";
import { getVipList } from "../../../../../api/vip";
import { selectList } from "../../../../../api/risk-level";
import { getFinancialLevels } from "../../../../../api/financial-level";
import { useStore } from "../../../../../store";
import { AppActionTypes } from '@/store/modules/app/action-types'
import { useI18n } from "vue-i18n";
import { changeNewAffilaite } from "../../../../../api/member-affiliate";
import { callTelephone, stopTelephone } from "../../../../../api/vcall";

const store = useStore()
export default defineComponent({
  props: {
    mbrId: {
      type: String,
      required: true
    },
    timeZone: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n();
    const uiControl = reactive({
      dialogVisible: false,
      dialogTitle: "",
      dialogType: "",
      showCall: false,
      showCall1: false,
    });
    const route = useRoute()
    const site = reactive({
      id: route.query.site
    });

    const loading = reactive({
      accountInfo: false,
      affiliateInfo: false,
      remark: false,
      loginInfo: false,
      fundingInfo: false,
      total: false,
      balance: []
    });

    const updatePasswordForm = ref(null);
    const freezeMemberForm = ref(null);
    const updateVipForm = ref(null);
    const updateFinancialForm = ref(null);
    const updateRiskForm = ref(null);
    const addRemarkForm = ref(null);
    const editRemarkForm = ref(null);
    const platformWallet = ref({});
    const platformTransferForm = ref(null);
    const unmaskedValue = ref(null);
    const updateUserTypeForm = ref(null);
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

    const userType = reactive({
      list: [
        { key: 1, name: t('types.NORMAL'), value: "NORMAL" },
        { key: 2, name: t('types.TEST'), value: "TEST" },
        { key: 3, name: t('types.AFFILIATE'), value: "AFFILIATE" },
        { key: 4, name: t('types.OUTSIDE'), value: "OUTSIDE" }
      ]
    });

    const vipList = reactive({
      list: []
    });
    const riskList = reactive({
      list: []
    });
    const financialList = reactive({
      list: []
    });
    const selectedRiskColor = reactive({
      levelColor: null,
    });

    const selectedFinancialColor = reactive({
      levelColor: null,
    });

    const selectedIpColor = reactive({
      registerIpColor: null,
      loginIpColor: null,
    });

    const memberDetail = reactive({
      id: 0,
      loginName: "",
      superiorAffName: "",
      regTime: "",
      balance: 0,
      withdrawableBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      lastLoginTime: "",
      status: "",
      realName: "",
      name2: "",
      email: "",
      telephone: "",
      vip: "",
      regIp: "",
      lastLoginIp: "",
      birthday: "",
      country: "",
      financial: "",
      totalBonus: 0,
      risk: "",
      site: "",
      siteId: 0,
      memberType: "",
      dupName: "",
      dupIp: ""
    });

    const affiliateDetail = reactive({
      id: 0,
      loginName: null,
      affiliateCode: null,
      affiliateLevel: null,
      startTime: null,
      endTime: null
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

    const vipForm = reactive({
      vip: null
    });

    const financialForm = reactive({
      financial: null
    });

    const riskForm = reactive({
      risk: null
    });

    const remarkForm = reactive({
      id: null,
      memberId: null,
      remark: null
    });

    const transferForm = reactive({
      platformCode: null,
      amount: 0,
      action: null,
      siteId: null
    });

    const userTypeForm = reactive({
      memberType: null
    });

    const affForm = reactive({
      affiliateCode: null
    });

    const validatePassword = (rule, value, callback) => {
      if (value !== "" && passwordForm.reEnterPassword !== "") {
        updatePasswordForm.value.validateField("reEnterPassword");
      }
      callback();
    };

    const validateReEnterPassword = (rule, value, callback) => {
      if (value !== passwordForm.password) {
        callback(new Error(t('message.twoPasswordNotMatch')))
      }
      callback();
    };

    const passwordFormRules = reactive({
      password: [required(t('message.validatePasswordRequired')), size(6, 12, t('message.validatePasswordSize')), {
        validator: validatePassword,
        trigger: "blur"
      }],
      reEnterPassword: [required(t('message.validateReenterPasswordRequired')), { validator: validateReEnterPassword, trigger: "blur" }]
    });

    const transferFormRules = reactive({
      platformCode: [required(t('message.validatePlatformCodeRequired'))],
      amount: [required(t('message.validateAmountRequired')), isNumeric(t('messsage.validateNumberFourDecimalOnly'))],
      action: [required(t('message.validateActionRequired'))]
    });

    const freezeFormRules = reactive({
      freezeType: [required(t('message.validateFreezeTypeRequired'))],
      reason: [required(t('message.validateReasonRequired'))]
    });

    const vipFormRules = reactive({
      vip: [required(t('message.validateVIPRequired'))]
    });

    const financialFormRules = reactive({
      financial: [required(t('message.validateFinancialLevelRequired'))]
    });

    const riskFormRules = reactive({
      risk: [required(t('message.validateRiskLevelRequired'))]
    });

    const remarkFormRules = reactive({
      remark: [required(t('message.validateRemarkRequired'))]
    });

    const userTypeFormRules = reactive({
      memberType: [required(t('message.validateUserTypeRequired'))]
    });

    const affFormRules = reactive({
      affiliateCode: [required(t('message.validateAffiliateCodeRequired'))]
    });

    const loadMemberRemark = async () => {
      loading.remark = true;
      const { data: ret } = await getMemberRemark(props.mbrId, request);
      page.pages = ret.pages;
      page.records = ret.records;
      loading.remark = false;
    };

    const loadVips = async () => {
      const { data: vip } = await getVipList({ siteId: memberDetail.siteId });
      vipList.list = vip;
    };

    const loadFinancialLevels = async () => {
      const { data: financial } = await getFinancialLevels({ siteId: memberDetail.siteId });
      financialList.list = financial;
    };

    const loadRiskLevels = async () => {
      const { data: risk } = await selectList({ siteId: memberDetail.siteId });
      riskList.list = risk;
    };

    const populateRiskColor = () => {
      const risk = riskList.list.find(r => r.id === riskForm.risk);
      selectedRiskColor.levelColor = risk.levelColor;
    };

    const populateFinancialColor = () => {
      const financial = financialList.list.find(f => f.id === financialForm.financial);
      selectedFinancialColor.levelColor = financial.levelColor;
    };

    const populateIpColor = () => {
      const regIpLabel = store.state.app.ipLabels.find(r => r.ip === memberDetail.regIp);
      const lastLoginIpLabel = store.state.app.ipLabels.find(r => r.ip === memberDetail.lastLoginIp);
      if (regIpLabel) {
        selectedIpColor.registerIpColor = regIpLabel.color;
      }
      if (lastLoginIpLabel) {
        selectedIpColor.loginIpColor = lastLoginIpLabel.color;
      }
    };

    const changePage = (page) => {
      if (request.current >= 1) {
        request.current = page;
        loadMemberRemark();
      }
    };

    const showDialog = (type) => {
      uiControl.dialogType = type;
      if (type === "UPDATE_PASSWORD") {
        if (updatePasswordForm.value) {
          updatePasswordForm.value.resetFields();
        }
        uiControl.dialogTitle = t('fields.updatePassword');
      } else if (type === "FREEZE_MEMBER") {
        if (freezeMemberForm.value) {
          freezeMemberForm.value.resetFields();
        }
        freezeForm.freezeType = freezeType.list[0].value;
        freezeForm.reason = freezeReason.list[0].value;
        freezeForm.site = site.id;
        uiControl.dialogTitle = t('fields.freezeMember');
      } else if (type === "UPDATE_VIP") {
        if (updateVipForm.value) {
          updateVipForm.value.resetFields();
        }
        if (memberDetail.vip) {
          const vip = vipList.list.find(v => v.name === memberDetail.vip);
          vipForm.vip = vip.id;
        } else {
          vipForm.vip = vipList.list[0].id;
        }
        uiControl.dialogTitle = t('fields.updateVIPLevel');
      } else if (type === "UPDATE_FINANCIAL") {
        if (updateFinancialForm.value) {
          updateFinancialForm.value.resetFields();
        }
        if (memberDetail.financial) {
          const financial = financialList.list.find(f => f.name === memberDetail.financial);
          financialForm.financial = financial.id;
          selectedFinancialColor.levelColor = financial.levelColor;
        } else {
          financialForm.financial = financialList.list[0].id;
          selectedFinancialColor.levelColor = financialList.list[0].levelColor;
        }
        uiControl.dialogTitle = t('fields.updateFinancialLevel');
      } else if (type === "UPDATE_RISK") {
        if (updateRiskForm.value) {
          updateRiskForm.value.resetFields();
        }
        if (memberDetail.risk) {
          const risk = riskList.list.find(r => r.levelName === memberDetail.risk);
          riskForm.risk = risk.id;
          selectedRiskColor.levelColor = risk.levelColor;
        } else {
          riskForm.risk = riskList.list[0].id;
          selectedRiskColor.levelColor = riskList.list[0].levelColor;
        }
        uiControl.dialogTitle = t('fields.updateRiskLevel');
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
      } else if (type === "PLATFORM_TRANSFER") {
        uiControl.dialogTitle = t('fields.platformFundTransfer');
      } else if (type === "UPDATE_USERTYPE") {
        if (updateUserTypeForm.value) {
          updateUserTypeForm.value.resetFields();
        }
        userTypeForm.memberType = userType.list[0].value;
        uiControl.dialogTitle = t('fields.userType');
      } else if (type === 'CHANGE_AFF') {
        if (changeAffForm.value) {
          changeAffForm.value.resetFields();
        }
        affForm.affiliateCode = null;
        uiControl.dialogTitle = t('fields.changeAffiliate');
      }
      uiControl.dialogVisible = true;
    };

    const changePassword = () => {
      updatePasswordForm.value.validate(async (valid) => {
        if (valid) {
          await updatePassword(props.mbrId, passwordForm.password, memberDetail.siteId);
          uiControl.dialogVisible = false;
          ElMessage({ message: t('message.updatePasswordSuccess'), type: "success" });
        }
      });
    };

    const transferFund = () => {
      platformTransferForm.value.validate(async (valid) => {
        if (valid) {
          transferForm.siteId = memberDetail.siteId;
          await platformFundTransfer(props.mbrId, transferForm);
          uiControl.dialogVisible = false;

          loading.total = true;
          const data = await getMemberDetails(props.mbrId, site.id);
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField];
          });
          const key = transferForm.platformCode;
          loading.balance[key] = true;
          await refreshPlatformBalance(key);
          loading.balance[key] = false;
          loading.total = false;
          ElMessage({ message: t('message.transferSuccess'), type: "success" });
        }
      });
    };

    const freeze = () => {
      freezeMemberForm.value.validate(async (valid) => {
        if (valid) {
          await freezeMember(props.mbrId, freezeForm);
          const data = await getMemberDetails(props.mbrId, site.id);
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField];
          });
          uiControl.dialogVisible = false;
          ElMessage({ message: t('message.freezeMemberSuccess'), type: "success" });
        }
      });
    };

    const changeToNormal = async (id) => {
      await normalMember(id, site.id);
      const data = await getMemberDetails(props.mbrId, site.id);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField];
      });
      ElMessage({ message: t('message.updateSuccess'), type: "success" });
    };

    const updateField = (type) => {
      if (type === "VIP") {
        updateVipForm.value.validate(async (valid) => {
          if (valid) {
            await updateVip(props.mbrId, vipForm.vip, site.id);
            const data = await getMemberDetails(props.mbrId, site.id);
            Object.keys({ ...data.data }).forEach(detailField => {
              memberDetail[detailField] = data.data[detailField];
            });
            uiControl.dialogVisible = false;
            ElMessage({ message: t('message.updateVIPLevelSuccess'), type: "success" });
          }
        });
      } else if (type === "FINANCIAL") {
        updateFinancialForm.value.validate(async (valid) => {
          if (valid) {
            await updateFinancial(props.mbrId, financialForm.financial, site.id);
            const data = await getMemberDetails(props.mbrId, site.id);
            Object.keys({ ...data.data }).forEach(detailField => {
              memberDetail[detailField] = data.data[detailField];
            });
            uiControl.dialogVisible = false;
            ElMessage({ message: t('message.updateFinancialLevelSuccess'), type: "success" });
          }
        });
      } else if (type === "RISK") {
        updateRiskForm.value.validate(async (valid) => {
          if (valid) {
            await updateRisk(props.mbrId, riskForm.risk, site.id);
            const data = await getMemberDetails(props.mbrId, site.id);
            Object.keys({ ...data.data }).forEach(detailField => {
              memberDetail[detailField] = data.data[detailField];
            });
            uiControl.dialogVisible = false;
            ElMessage({ message: t('message.updateRiskLevelSuccess'), type: "success" });
          }
        });
      }
    };

    const addRemark = () => {
      addRemarkForm.value.validate(async (valid) => {
        if (valid) {
          remarkForm.memberId = props.mbrId;
          await addMemberRemark(remarkForm);
          await loadMemberRemark();
          uiControl.dialogVisible = false;
          ElMessage({ message: t('message.addRemarkSuccess'), type: "success" });
        }
      });
    };

    const editRemark = async () => {
      editRemarkForm.value.validate(async (valid) => {
        if (valid) {
          await editMemberRemark(remarkForm.id, remarkForm.remark);
          await loadMemberRemark();
          uiControl.dialogVisible = false;
          ElMessage({ message: t('message.editRemarkSuccess'), type: "success" });
        }
      });
    };

    const removeRemark = async (remark) => {
      await deleteMemberRemark(remark.id);
      await loadMemberRemark();
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
    const editUserType = () => {
      updateUserTypeForm.value.validate(async (valid) => {
        if (valid) {
          await updateMemberType(props.mbrId, userTypeForm.memberType, site.id);
          const data = await getMemberDetails(props.mbrId, site.id);
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField];
          });
          uiControl.dialogVisible = false;
          ElMessage({ message: t('message.updateUserTypeSuccess'), type: "success" });
        }
      });
    };

    const loadBalance = async () => {
      const platform = await getPlatformsBySite(memberDetail.siteId);
      for (const item of platform.data) {
        if (item.walletType === "TRANSFER") {
          platformWallet.value[item.code] = 0;
          loading.balance[item.code] = false;
        }
      }
    };

    const refreshAllBalance = async () => {
      loading.total = true;
      Object.entries(loading.balance).forEach(([key, value]) => {
        loading.balance[key] = true;
      });

      const { data: balance } = await refreshBalance(props.mbrId, site.id);
      memberDetail.balance = balance.balance;
      memberDetail.withdrawableBalance = balance.withdrawableBalance;
      memberDetail.totalDeposit = balance.totalDeposit;
      memberDetail.totalWithdraw = balance.totalWithdraw;
      memberDetail.totalBonus = balance.totalBonus;

      for (const key of Object.keys(platformWallet.value)) {
        const { data: balance } = await getPlatformBalance(props.mbrId, key, site.id);
        platformWallet.value[key] = balance;
        loading.balance[key] = false;
      }
      loading.total = false;
    };

    const refreshPlatformBalance = async (key) => {
      loading.balance[key] = true;
      const { data: balance } = await getPlatformBalance(props.mbrId, key, site.id);
      platformWallet.value[key] = balance;
      loading.balance[key] = false;
    };

    const showTransferDialogue = async (key, action) => {
      transferForm.action = action;
      transferForm.platformCode = key;
      transferForm.amount = 0;
      showDialog("PLATFORM_TRANSFER");
    };

    async function setIpLabelsIfEmpty() {
      if (store.state.app.ipLabels.length < 1 || store.state.app.ipLabels === undefined) {
        const { data: labels } = await selectIpLabelAll();
        store.dispatch(AppActionTypes.ACTION_SET_IP_LABELS, labels)
      }
    }

    async function unmaskDetail(type) {
      if (type === 'NAME') {
        const { data: name } = await getMemberRealName(props.mbrId, site.id);
        unmaskedValue.value = name;
        uiControl.dialogTitle = t('fields.realName');
      } else if (type === 'EMAIL') {
        const { data: email } = await getMemberEmail(props.mbrId, site.id);
        unmaskedValue.value = email;
        uiControl.dialogTitle = t('fields.email');
      } else if (type === 'TELEPHONE') {
        const { data: telephone } = await getMemberTelephone(props.mbrId, site.id);
        unmaskedValue.value = telephone;
        uiControl.dialogTitle = t('fields.telephone');
      }
      showDialog("UNMASK");
    }

    async function unlock() {
      await unlockMember(props.mbrId, site.id);
      const data = await getMemberDetails(props.mbrId, site.id);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField];
      });
      ElMessage({ message: t('message.unlockMemberSuccess'), type: "success" });
    }

    async function logoutPlayer() {
      await forceLogout(props.mbrId, site.id);
      ElMessage({ message: t('message.logoutPlayerSuccess'), type: "success" });
    }

    async function changeAffiliate() {
      await changeNewAffilaite(props.mbrId, affForm.affiliateCode, memberDetail.memberType);
      ElMessage({ message: t('message.changeAffiliateSuccess'), type: "success" });
      uiControl.dialogVisible = false;
      loading.affiliateInfo = true;
      const { data: aff } = await getAffiliateInfo(props.mbrId, site.id);
      Object.keys({ ...aff }).forEach(detailField => {
        affiliateDetail[detailField] = aff[detailField];
      });
      loading.affiliateInfo = false;
    }

    async function callPhone(id, site) {
      var res = await callTelephone(id, site);
      if (res.data === 'true') {
        ElMessage({ message: t('message.success'), type: "success" });
      } else {
        ElMessage({ message: t('fields.fail'), type: "fail" });
      }
    }

    async function stopPhone(id, site) {
      var res = await stopTelephone(id, site);
      if (res.data === 'true') {
        ElMessage({ message: t('message.success'), type: "success" });
      } else {
        ElMessage({ message: t('fields.fail'), type: "fail" });
      }
    }

    onMounted(async () => {
      loading.accountInfo = true;
      loading.affiliateInfo = true;
      loading.loginInfo = true;
      loading.fundingInfo = true;
      await setIpLabelsIfEmpty();
      const data = await getMemberDetails(props.mbrId, site.id, 1);
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField] ? data.data[detailField] : "";
      });

      const { data: aff } = await getAffiliateInfo(props.mbrId, site.id);
      Object.keys({ ...aff }).forEach(detailField => {
        affiliateDetail[detailField] = aff[detailField];
      });

      loadMemberRemark();
      await loadVips();
      await loadFinancialLevels();
      await loadRiskLevels();
      await populateIpColor();
      loading.accountInfo = false;
      loading.affiliateInfo = false;
      loading.loginInfo = false;

      await loadBalance();
      loading.fundingInfo = false;
      if (site.id === '3') {
        uiControl.showCall = true;
        uiControl.showCall1 = true;
      }
    });

    return {
      uiControl,
      loading,
      freezeType,
      freezeReason,
      vipList,
      financialList,
      riskList,
      selectedRiskColor,
      selectedFinancialColor,
      selectedIpColor,
      memberDetail,
      affiliateDetail,
      platformWallet,
      page,
      request,
      updatePasswordForm,
      passwordForm,
      passwordFormRules,
      freezeMemberForm,
      freezeForm,
      freezeFormRules,
      updateVipForm,
      vipForm,
      vipFormRules,
      updateFinancialForm,
      financialForm,
      financialFormRules,
      updateRiskForm,
      riskForm,
      riskFormRules,
      addRemarkForm,
      editRemarkForm,
      remarkForm,
      remarkFormRules,
      platformTransferForm,
      transferForm,
      transferFormRules,
      showTransferDialogue,
      validatePassword,
      validateReEnterPassword,
      loadMemberRemark,
      loadVips,
      loadFinancialLevels,
      loadRiskLevels,
      populateRiskColor,
      populateFinancialColor,
      changePage,
      showDialog,
      changePassword,
      transferFund,
      freeze,
      updateField,
      addRemark,
      editRemark,
      removeRemark,
      showEditRemark,
      loadBalance,
      refreshAllBalance,
      refreshPlatformBalance,
      unmaskDetail,
      unmaskedValue,
      changeToNormal,
      userType,
      updateUserTypeForm,
      userTypeForm,
      userTypeFormRules,
      editUserType,
      unlock,
      t,
      logoutPlayer,
      affForm,
      affFormRules,
      changeAffiliate,
      callPhone,
      stopPhone
    };
  }
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

.member-context-red {
  background: #ff0000;
  color: white;
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

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.refresh-btn {
  margin-left: 20px;
}

.refresh-platform-btn {
   margin-left: 5px;
   display: inline-block;
}

</style>

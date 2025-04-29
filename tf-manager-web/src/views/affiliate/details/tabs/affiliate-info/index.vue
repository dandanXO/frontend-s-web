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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.loginName') }}
            </div>
          </template>
          <span v-if="memberDetail.loginName !== null">
            {{ memberDetail.loginName }}
          </span>
          <span v-if="memberDetail.loginName === null">-</span>
          <el-button type="info" size="mini" style="float: right;" @click="syncMember">{{ t('fields.sync') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user1" style="height: 16px;width: 16px;" />
              {{ t('fields.realName') }}
            </div>
          </template>
          <span v-if="memberDetail.realName !== null">
            {{ memberDetail.realName }}
          </span>
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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="password"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.password') }}
            </div>
          </template>
          <el-button
            type="info"
            size="mini"
            v-permission="['sys:affiliate:update:password']"
            @click="showDialog('UPDATE_PASSWORD')"
          >
            {{ t('fields.updatePassword') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="lock" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateStatus') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.affiliateStatus === 'APPLY'" size="mini">
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.affiliateStatus === 'NORMAL'"
            size="mini"
            type="success"
          >
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.affiliateStatus === 'DISABLE'"
            size="mini"
            type="danger"
          >
            {{ t('affiliate.status.' + memberDetail.affiliateStatus) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.affiliateStatus === null"
            size="mini"
            type="info"
          >
            -
          </el-tag>
          <el-button
            v-if="memberDetail.affiliateStatus === 'APPLY'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:state']"
            @click="approve"
          >
            {{ t('fields.approve') }}
          </el-button>
          <el-button
            v-if="memberDetail.affiliateStatus === 'NORMAL'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:state']"
            @click="showDialog('DISABLE_AFFILIATE')"
          >
            {{ t('fields.disable') }}
          </el-button>
          <el-button
            v-if="memberDetail.affiliateStatus === 'DISABLE'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:state']"
            @click="reactivate"
          >
            {{ t('fields.activate') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label-align="left" label-class-name="member-label" class-name="member-context" v-permission="['sys:affiliate:detail']">
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
                     v-permission="['sys:affiliate:update:state']" @click="showDialog('FREEZE_MEMBER')"
          >
            {{ t('fields.freeze') }}
          </el-button>
          <el-button v-if="memberDetail.status === 'FROZEN'" type="info" size="mini" style="float: right;"
                     v-permission="['sys:affiliate:update:state']" @click="showDialog('UNFREEZE_MEMBER')"
          >
            {{ t('fields.open') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="redis" style="height: 16px;width: 16px;" />
              {{ t('fields.financialLevel') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.financial !== null" size="mini">
            {{ memberDetail.financial }}
          </el-tag>
          <el-tag
            v-if="memberDetail.financial === null"
            type="info"
            size="mini"
          >
            -
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:financial']"
            @click="showDialog('UPDATE_FINANCIAL')"
            :disabled="financialList.list.length === 0"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="phone" style="height: 16px;width: 16px;" />
              {{ t('fields.telephone') }}
            </div>
          </template>
          <span v-if="memberDetail.telephone !== null">
            {{ memberDetail.telephone }}
          </span>
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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="email" style="height: 16px;width: 16px;" />
              {{ t('fields.email') }}
            </div>
          </template>
          <span v-if="memberDetail.email !== null">
            {{ memberDetail.email }}
          </span>
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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="international"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.country') }}
            </div>
          </template>
          <span v-if="memberDetail.country !== null">
            {{ memberDetail.country }}
          </span>
          <span v-if="memberDetail.country === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="visits" style="height: 16px;width: 16px;" />
              {{ t('fields.site') }}
            </div>
          </template>
          <span v-if="memberDetail.site !== null">{{ memberDetail.site }}</span>
          <span v-if="memberDetail.site === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="monitor"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.commissionModel') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.commissionModel === 'SIMPLE'" size="mini">
            {{ t('affiliate.commissionModel.' + memberDetail.commissionModel) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.commissionModel === 'NORMAL'"
            size="mini"
            type="success"
          >
            {{ t('affiliate.commissionModel.' + memberDetail.commissionModel) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.commissionModel === 'DETAILS'"
            size="mini"
            type="primary"
          >
            {{ t('affiliate.commissionModel.' + memberDetail.commissionModel) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.commissionModel === null"
            size="mini"
            type="info"
          >
            -
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:commission-model']"
            @click="showDialog('UPDATE_MODEL')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateWallet') }}
            </div>
          </template>
          <div style="display: inline-block;" v-loading="loading.total">
            <div class="balance">
              $
              <span
                v-formatter="{data: memberDetail.balance, type: 'money'}"
              />
            </div>
          </div>
          <el-button
            class="refresh-btn"
            icon="el-icon-refresh"
            size="mini"
            @click="refreshAllBalance"
          />
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.commissionWallet') }}
            </div>
          </template>
          <div style="display: inline-block;" v-loading="loading.commissionBalance">
            <div class="balance">
              $
              <span
                v-formatter="{data: memberDetail.commissionBalance, type: 'money'}"
              />
            </div>
          </div>
          <el-button
            class="refresh-btn"
            icon="el-icon-refresh"
            size="mini"
            @click="refreshCommissionBalance"
          />
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="visits" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateLink') }}
            </div>
          </template>
          <a
            :href="link"
            v-if="affiliateDetails.affiliateCode !== null"
            target="_blank"
            style="color: #1fa8db"
          >
            {{ link }}
          </a>
          <span v-if="affiliateDetails.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="monitor"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.timeType') }}
            </div>
          </template>
          <el-tag
            size="mini"
            type="success"
          >
            {{ t('affiliate.timeType.' + memberDetail.timeType) }}
          </el-tag>
          <el-tag v-if="memberDetail.timeType === null" size="mini" type="info">
            -
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-if="hasPermission(['sys:affiliate:update:time-type'])"
            v-permission="['sys:affiliate:update:time-type']"
            @click="showDialog('UPDATE_TIME_TYPE')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="monitor"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.securityQuestion') }}
            </div>
          </template>
          <el-tag
            v-if="memberDetail.hasSecurityQuestion"
            size="mini"
            type="success"
          >
            {{ t('fields.binded') }}
          </el-tag>
          <el-tag v-else size="mini" type="danger">
            {{ t('fields.notBinded') }}
          </el-tag>
          <el-button
            v-if="
              hasPermission(['sys:affiliate:update:security-question']) &&
                memberDetail.hasSecurityQuestion
            "
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:security-question']"
            @click="resetSecurityQuestion"
          >
            {{ t('fields.reset') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="web" style="height: 16px;width: 16px;" />
              {{ t('fields.belongType') }}
            </div>
          </template>
          <el-tag v-if="memberDetail.belongType === 'OFFICIAL'" size="mini">
            {{ t('affiliate.belongType.' + memberDetail.belongType) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.belongType === 'PACKAGE'"
            size="mini"
            type="success"
          >
            {{ t('affiliate.belongType.' + memberDetail.belongType) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.belongType === null"
            size="mini"
            type="info"
          >
            -
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-if="hasPermission(['sys:affiliate:update:belong-type'])"
            v-permission="['sys:affiliate:update:belong-type']"
            @click="showDialog('UPDATE_BELONG_TYPE')"
          >
            {{ t('fields.update') }}
          </el-button>
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
          <el-button type="info" size="mini" style="float: right;" v-permission="['sys:affiliate:update:risk']"
                     @click="showDialog('UPDATE_RISK')" :disabled="riskList.list.length === 0"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="password"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.withdrawPassword') }}
            </div>
          </template>
          <el-button
            type="info"
            size="mini"
            v-permission="['sys:affiliate:update:password']"
            @click="showDialog('UPDATE_WITHDRAW_PASSWORD')"
          >
            {{ t('fields.updatePassword') }}
          </el-button>
        </el-descriptions-item>
        <!-- <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div v-if="(isKorea(memberDetail.siteId))">
              <svg-icon
                icon-class="money"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.ignoreSettlement') + ' (16th)' }}
            </div>
          </template>
          <template #default>
            <div v-if="(isKorea(memberDetail.siteId))">
              <el-switch
                :disabled="!isKorea(memberDetail.siteId)"
                v-model="memberDetail.ignoreSettlement"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="
                  changeIgnoreSettlement(memberDetail.id, memberDetail.ignoreSettlement)
                "
              />
            </div>

          </template>

        </el-descriptions-item> -->

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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="education"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.affiliateCode') }}
            </div>
          </template>
          <span v-if="affiliateDetails.affiliateCode !== null">
            {{ affiliateDetails.affiliateCode }}
          </span>
          <span v-if="affiliateDetails.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="tree-table"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.affiliateLevel') }}
            </div>
          </template>
          <span v-if="affiliateDetails.affiliateLevel !== null">
            {{ t(`affiliate.level.${affiliateDetails.affiliateLevel}`) }}
          </span>
          <span v-if="affiliateDetails.affiliateLevel === null">-</span>
          <el-button
            v-if="isKorea(memberDetail.siteId) && memberDetail.affiliateStatus === 'NORMAL'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:affiliate-level']"
            @click="showDialog('UPDATE_AFFILIATE_LEVEL')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.commission') }}
            </div>
          </template>
          <span v-if="affiliateDetails.commission !== null">
            {{ (affiliateDetails.commission).toFixed() }} %
          </span>
          <span v-if="affiliateDetails.commission === null">0 %</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:commission']"
            @click="showDialog('UPDATE_COMMISSION')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.paymentFee') }}
            </div>
          </template>
          <span v-if="affiliateDetails.paymentFee !== null">
            {{ affiliateDetails.paymentFee }} %
          </span>
          <span v-if="affiliateDetails.paymentFee === null">{{ t('fields.undefined') }}</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:payment-fee']"
            @click="showDialog('UPDATE_PAYMENT_FEE')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="money" style="height: 16px;width: 16px;" />
              {{ t('fields.platformFee') }}
            </div>
          </template>
          <span v-if="affiliateDetails.platformFee !== null">
            {{ affiliateDetails.platformFee }} %
          </span>
          <span v-if="affiliateDetails.platformFee === null">{{ t('fields.undefined') }}</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:platform-fee']"
            @click="showDialog('UPDATE_PLATFORM_FEE')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="peoples"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.totalDownlineMembers') }}
            </div>
          </template>
          <span v-if="affiliateDetails.downlineMember !== null">
            {{ affiliateDetails.downlineMember }}
          </span>
          <span v-if="affiliateDetails.downlineMember === null">0</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="peoples"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.totalDownlineAffiliates') }}
            </div>
          </template>
          <span v-if="affiliateDetails.downlineAffiliate !== null">
            {{ affiliateDetails.downlineAffiliate }}
          </span>
          <span v-if="affiliateDetails.downlineAffiliate === null">0</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="peoples"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.viewLoginName') }}
            </div>
          </template>
          <el-tag v-if="affiliateDetails.viewLoginName" size="mini" type="success">
            {{ t('fields.show') }}
          </el-tag>
          <el-tag v-else size="mini" type="danger">
            {{ t('fields.hidden') }}
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:view-login-name']"
            @click="changeViewLoginName()"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="user"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.alias') }}
            </div>
          </template>
          <span v-if="affiliateDetails.alias !== null">
            {{ affiliateDetails.alias }}
          </span>
          <span v-if="affiliateDetails.alias === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:update:alias']"
            @click="showDialog('UPDATE_AFFILIATE_ALIAS')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item />
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.superiorAffiliateInfo') }}</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:affiliate:change-affiliate']"
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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.superiorAffiliateName') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.loginName !== null">
            {{ superiorAffiliateDetail.loginName }}
          </span>
          <span v-if="superiorAffiliateDetail.loginName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon
                icon-class="example"
                style="height: 16px;width: 16px;"
              />
              {{ t('fields.superiorAffiliateCode') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.affiliateCode !== null">
            {{ superiorAffiliateDetail.affiliateCode }}
          </span>
          <span v-if="superiorAffiliateDetail.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              {{ t('fields.superiorAffiliateLevel') }}
            </div>
          </template>
          <span v-if="superiorAffiliateDetail.affiliateLevel !== null">
            {{ superiorAffiliateDetail.affiliateLevel }}
          </span>
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
      <el-table
        :data="page.records"
        ref="table"
        v-loading="loading.remark"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
      >
        <el-table-column prop="remark" :label="t('fields.remark')" />
        <el-table-column
          prop="createTime"
          :label="t('fields.createTime')"
          width="200px"
        >
          <template #default="scope">
            <span v-if="scope.row.createTime === null">-</span>
            <span
              v-if="scope.row.createTime !== null"
              v-formatter="{
                data: scope.row.createTime,
                timeZone: timeZone,
                type: 'date',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          :label="t('fields.createBy')"
          width="200px"
        />
        <el-table-column align="right" fixed="right">
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              @click="showEditRemark(scope.row)"
            />
            <el-button
              icon="el-icon-remove"
              size="mini"
              type="danger"
              @click="removeRemark(scope.row)"
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
        style="float: left;"
      />
      <el-button
        type="info"
        size="mini"
        style="float: right; margin-top: 5px; margin-bottom: 5px;"
        v-permission="['sys:affiliate:add:remark']"
        @click="showDialog('ADD_REMARK')"
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
        <el-descriptions-item
          label-align="left"
          :label="t('fields.registerTime')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span
            v-if="memberDetail.regTime !== null"
            v-formatter="{
              data: memberDetail.regTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
          <span v-if="memberDetail.regTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          :label="t('fields.registerIp')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span v-if="memberDetail.regIp !== null">
            {{ memberDetail.regIp }}
          </span>
          <span v-if="memberDetail.regIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          :label="t('fields.registerAddress')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span
            v-if="
              memberDetail.regAddress !== '-,-,-' &&
                memberDetail.regAddress !== 'null,null,null' &&
                memberDetail.regAddress !== null
            "
          >
            {{ memberDetail.regAddress }}
          </span>
          <span
            v-if="
              memberDetail.regAddress === '-,-,-' ||
                memberDetail.regAddress === 'null,null,null' ||
                memberDetail.regAddress === null
            "
          >
            -
          </span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          :label="t('fields.lastLoginTime')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span
            v-if="memberDetail.lastLoginTime !== null"
            v-formatter="{
              data: memberDetail.lastLoginTime,
              timeZone: timeZone,
              type: 'date',
            }"
          />
          <span v-if="memberDetail.lastLoginTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          :label="t('fields.lastLoginIp')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span v-if="memberDetail.lastLoginIp !== null">
            {{ memberDetail.lastLoginIp }}
          </span>
          <span v-if="memberDetail.lastLoginIp === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          :label="t('fields.lastLoginAddress')"
          label-class-name="member-label"
          class-name="member-context"
        >
          <span
            v-if="
              memberDetail.lastLoginAddress !== '-,-,-' &&
                memberDetail.lastLoginAddress !== 'null,null,null' &&
                memberDetail.lastLoginAddress !== null
            "
          >
            {{ memberDetail.lastLoginAddress }}
          </span>
          <span
            v-if="
              memberDetail.lastLoginAddress === '-,-,-' ||
                memberDetail.lastLoginAddress === 'null,null,null' ||
                memberDetail.lastLoginAddress === null
            "
          >
            -
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="580px"
    >
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_PASSWORD' || uiControl.dialogType === 'UPDATE_WITHDRAW_PASSWORD'"
        ref="updatePasswordForm"
        :model="passwordForm"
        :rules="passwordFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.password')" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item
          :label="t('fields.reenterPassword')"
          prop="reEnterPassword"
        >
          <el-input
            v-model="passwordForm.reEnterPassword"
            type="password"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="changePassword">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'DISABLE_AFFILIATE' || uiControl.dialogType === 'FREEZE_MEMBER'"
        ref="freezeMemberForm"
        :model="freezeForm"
        :rules="freezeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
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
        <el-form-item
          :label="t('fields.remark')"
          prop="remark"
          :required="freezeForm.reason === 'Others'"
        >
          <el-input
            type="textarea"
            v-model="freezeForm.remark"
            :rows="6"
            style="width: 350px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="freeze">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UNFREEZE_MEMBER'" ref="unfreezeMemberForm" :model="unfreezeForm"
               :rules="unfreezeFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.reason')" prop="reason">
          <el-select
            v-model="unfreezeForm.reason"
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
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input type="textarea" v-model="unfreezeForm.remark" :rows="6" style="width: 350px;" maxlength="500"
                    show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="unfreeze">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_FINANCIAL'"
        ref="updateFinancialForm"
        :model="financialForm"
        :rules="financialFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
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
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateField('FINANCIAL')">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_MODEL'"
        ref="updateModelForm"
        :model="modelForm"
        :rules="modelFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item
          :label="t('fields.commissionModel')"
          prop="commissionModel"
        >
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
        <el-form-item v-if="modelForm.commissionModel === 'DETAILS'" :label="t('fields.shareRatio')" prop="shareRatio">
          <div v-for="item in shareRatioList.list" :key="item.code" style="width: 350px; display: flex; margin-bottom:5px;">
            <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
            <el-input
              :disabled="!hasPermission(['sys:affiliate:update:share-ratio'])"
              v-model="item.value"
              style=" width:100px; margin-left: auto;"
            />
            <span style="color:red"> &emsp; ({{ getDownlineRatio(item.code) }} - {{ getAffiliateRatio(item.code) }}) </span>
          </div>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateModel">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_COMMISSION' || uiControl.dialogType === 'UPDATE_PAYMENT_FEE' || uiControl.dialogType === 'UPDATE_PLATFORM_FEE'"
        ref="commissionForm"
        :model="commForm"
        :rules="commFormRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.rate')" prop="commission">
          <el-input
            v-model="commForm.commission"
            style="width: 250px"
            :maxlength="uiControl.commissionMax"
            @keypress="restrictCommissionDecimalInput($event)"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button v-if="uiControl.dialogType !== 'UPDATE_COMMISSION'" @click="updateFeeUndefined()">
            {{ t('fields.setUndefined') }}
          </el-button>
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateFeeRate()">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_AFFILIATE_ALIAS'"
        ref="updateAliasForm"
        :model="aliasForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.alias')" prop="alias">
          <el-input
            v-model="aliasForm.alias"
            style="width: 350px;"
            maxlength="50"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateAlias">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'ADD_REMARK'"
        ref="addRemarkForm"
        :model="remarkForm"
        :rules="remarkFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            v-model="remarkForm.remark"
            :rows="6"
            style="width: 350px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="addRemark()">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'EDIT_REMARK'"
        ref="editRemarkForm"
        :model="remarkForm"
        :rules="remarkFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.remark')" prop="remark">
          <el-input
            type="textarea"
            v-model="remarkForm.remark"
            :rows="6"
            style="width: 350px;"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editRemark()">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_TIME_TYPE'"
        ref="updateTimeTypeModel"
        :model="timeTypeForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
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
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateMemberTimeType">
            {{ t('fields.confirm') }}
          </el-button>
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
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="changeAffiliate">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_BELONG_TYPE'"
        ref="updateBelongTypeModel"
        :model="belongTypeForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.belongType')" prop="belongType">
          <el-select
            v-model="belongTypeForm.belongType"
            size="small"
            :placeholder="t('fields.belongType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.belongType"
              :key="item.key"
              :label="item.displayName"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateMemberBelongType">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form v-if="uiControl.dialogType === 'UPDATE_RISK'" ref="updateRiskForm" :model="riskForm"
               :rules="riskFormRules" :inline="true" size="small" label-width="150px"
      >
        <el-form-item :label="t('fields.member')">
          <el-input style="width: 350px" :placeholder="t('fields.loginName')" v-model="memberDetail.loginName" disabled />
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
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_AFFILIATE_LEVEL'"
        ref="updateLevelModel"
        :model="levelForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.affiliateLevel')" prop="level">
          <el-select
            v-model="levelForm.level"
            size="small"
            :placeholder="t('fields.timeType')"
            class="filter-item"
            style="width: 350px;"
            default-first-option
          >
            <el-option
              v-for="item in uiControl.affiliateLevel"
              :key="item.key"
              :label="t(`affiliate.level.${item.value}`)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateAffiliateLevel">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, defineProps, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { hasPermission } from '../../../../../utils/util'
import { ElMessage, ElMessageBox } from 'element-plus'
import { required, size } from '../../../../../utils/validate'
import { getAffiliateInfo } from '../../../../../api/affiliate'
import {
  getMemberBalance,
  getMemberEmail,
  getMemberRealName,
  getMemberTelephone,
  getMemberStatus,
  freezeMember, unfreezeMember, updateRisk
} from '../../../../../api/member'
import { getFinancialLevels } from '../../../../../api/financial-level'
import { getAffiliateRecord, getCommissionBalance } from '../../../../../api/affiliate-record'
import {
  addAffiliateRemark,
  approveAffiliate,
  changeNewAffilaite,
  deleteAffiliateRemark,
  deleteSecurityQuestion,
  disableAffiliate,
  editAffiliateRemark,
  getAffiliateDetails,
  getAffiliateRemark,
  updateAffiliateFinancial,
  updateAffiliatePassword,
  updateCommissionModel,
  updateCommissionRate,
  updatePaymentFeeRate,
  updatePlatformFeeRate,
  updateTimeType,
  updateBelongType,
  updateViewLoginName,
  getAffiliateShareRatio,
  updateLevel,
  getDownlineShareRatio,
  reactivateAffiliate,
  updateAffiliateWithdrawPassword,
  syncAffiliateParentChildren,
  updateAffiliateAlias
  // updateIgnoreSettlement
} from '../../../../../api/member-affiliate'
import { useStore } from '../../../../../store'
import { useI18n } from 'vue-i18n'
import { getConfigList, getConfigListByGroup } from '../../../../../api/config'
import { selectList } from "@/api/risk-level";
import { isKorea } from "@/utils/site"

const { t } = useI18n()
const store = useStore()
const LOGIN_USER_NAME = computed(() => store.state.user.name)
const link = ref('')
const props = defineProps({
  affId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: true,
  },
})
const unmaskedValue = ref(null)
const route = useRoute()
const site = reactive({
  id: route.query.site,
})
// const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)
const riskList = reactive({
  list: []
});
const shareRatioList = reactive({
  list: [],
})
const downlineShareRatioList = reactive({
  list: [],
})
const selectedRiskColor = reactive({
  levelColor: null,
});
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: '',
  commissionModelType: [
    {
      key: 1,
      displayName: t('affiliate.commissionModel.NORMAL'),
      value: 'NORMAL',
    },
    {
      key: 2,
      displayName: t('affiliate.commissionModel.SIMPLE'),
      value: 'SIMPLE',
    },
    {
      key: 2,
      displayName: t('affiliate.commissionModel.DETAILS'),
      value: 'DETAILS',
    },
  ],
  timeType: [
    { key: 1, displayName: t('affiliate.timeType.MONTHLY'), value: 'MONTHLY' },
    { key: 2, displayName: t('affiliate.timeType.WEEKLY'), value: 'WEEKLY' },
    { key: 3, displayName: t('affiliate.timeType.HALF_MONTH'), value: 'HALF_MONTH' },
  ],
  belongType: [
    {
      key: 1,
      displayName: t('affiliate.belongType.OFFICIAL'),
      value: 'OFFICIAL',
    },
    {
      key: 2,
      displayName: t('affiliate.belongType.PACKAGE'),
      value: 'PACKAGE',
    },
  ],
  commissionMax: 2,
  affiliateLevel: [
    { key: 1, displayName: 'MASTER AFFILIATE', value: 'MASTER_AFFILIATE' },
    { key: 2, displayName: 'SUPER AFFILIATE', value: 'SUPER_AFFILIATE' },
    { key: 3, displayName: 'AFFILIATE', value: 'AFFILIATE' },
    { key: 4, displayName: 'SUB AFFILIATE', value: 'SUB_AFFILIATE' },
    { key: 5, displayName: 'JUNIOR AFFILIATE', value: 'JUNIOR_AFFILIATE' },
  ],
})

const loading = reactive({
  accountInfo: false,
  loginInfo: false,
  remark: false,
  total: false,
  commissionBalance: false,
  affiliateInfo: false,
  superiorAffiliateInfo: false,
})

const updatePasswordForm = ref(null)
const freezeMemberForm = ref(null)
const unfreezeMemberForm = ref(null)
const updateFinancialForm = ref(null)
const updateModelForm = ref(null)
const addRemarkForm = ref(null)
const editRemarkForm = ref(null)
const commissionForm = ref(null)
const updateAliasForm = ref(null)
const updateTimeTypeModel = ref(null)
const updateBelongTypeModel = ref(null)
const changeAffForm = ref(null)
const updateLevelModel = ref(null)
const riskForm = reactive({
  risk: null
});
const updateRiskForm = ref(null);
const freezeType = reactive({
  list: [
    { key: 1, name: t('types.NORMAL'), value: 'NORMAL' },
    { key: 2, name: t('types.TEMPORARY'), value: 'TEMPORARY' },
    { key: 3, name: t('types.PERMANENT'), value: 'PERMANENT' },
  ],
})

const freezeReason = reactive({
  list: [
    { key: 1, name: t('types.gameViolation'), value: 'Game Violation' },
    { key: 2, name: t('types.memberRequest'), value: 'Member Request' },
    { key: 3, name: t('types.others'), value: 'Others' },
  ],
})

const financialList = reactive({
  list: [],
})

const memberDetail = reactive({
  id: 0,
  loginName: '',
  superiorAffName: '',
  regTime: '',
  balance: 0,
  commissionBalance: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  lastLoginTime: '',
  status: '',
  affiliateStatus: '',
  commissionModel: '',
  timeType: '',
  belongType: '',
  realName: '',
  email: '',
  telephone: '',
  regIp: '',
  lastLoginIp: '',
  birthday: '',
  country: '',
  financial: '',
  totalBonus: 0,
  site: '',
  siteId: 0,
  risk: '',
  riskColor: '',
  ignoreSettlement: '',
})

const affiliateDetails = reactive({
  affiliateCode: null,
  affiliateLevel: null,
  downlineMember: 0,
  downlineAffiliate: 0,
  commission: 0,
  paymentFee: null,
  platformFee: null,
  viewLoginName: 1
})

const superiorAffiliateDetail = reactive({
  id: 0,
  loginName: null,
  affiliateCode: null,
  affiliateLevel: null,
  affiliateShareRatio: [],
})

const page = reactive({
  pages: 0,
  records: [],
})

const request = reactive({
  size: 5,
  current: 1,
})

const passwordForm = reactive({
  password: null,
  reEnterPassword: null,
})

const freezeForm = reactive({
  id: null,
  freezeType: null,
  reason: null,
  remark: null,
  site: null,
})

const unfreezeForm = reactive({
  id: null,
  remark: null,
  reason: null,
  site: null
});

const financialForm = reactive({
  financial: null,
})

const modelForm = reactive({
  commissionModel: null,
  shareRatio: null,
})

const commForm = reactive({
  commission: 0,
})

const remarkForm = reactive({
  id: null,
  memberId: null,
  remark: null,
})

const timeTypeForm = reactive({
  timeType: null,
})

const belongTypeForm = reactive({
  belongType: null,
})

const affForm = reactive({
  affiliateCode: null,
})

const levelForm = reactive({
  level: null,
})

const aliasForm = reactive({
  alias: null
})

const validatePassword = (rule, value, callback) => {
  if (value !== '' && passwordForm.reEnterPassword !== '') {
    updatePasswordForm.value.validateField(t('message.reenterPassword'))
  }
  callback()
}

const validateReEnterPassword = (rule, value, callback) => {
  if (value !== passwordForm.password) {
    callback(new Error(t('message.twoPasswordNotMatch')))
  }
  callback()
}

const validateCommission = (rule, value, callback) => {
  if (value !== '' && (commForm.commission < 0 || commForm.commission > 1)) {
    callback(new Error(t('message.validateCommissionFormat')))
  }
  callback()
}

const validateShareRatio = (rule, value, callback) => {
  if (memberDetail.commissionModel === 'DETAILS') {
    shareRatioList.list.forEach((item) => {
      if (item.value === '' || item.value < 0 || item.value > 1) {
        callback(new Error(t('message.validateShareRatioFormat')))
      }
    })
  }
  callback()
}

const passwordFormRules = reactive({
  password: [
    required(t('message.validatePasswordRequired')),
    size(6, 12, t('message.validatePasswordSize')),
    { validator: validatePassword, trigger: 'blur' },
  ],
  reEnterPassword: [
    required(t('message.validateReenterPasswordRequired')),
    { validator: validateReEnterPassword, trigger: 'blur' },
  ],
})

const freezeFormRules = reactive({
  freezeType: [required(t('message.validateFreezeTypeRequired'))],
  reason: [required(t('message.validateReasonRequired'))],
})

const unfreezeFormRules = reactive({
  reason: [required(t('message.validateReasonRequired'))],
  remark: [required(t('message.validateRemarkRequired'))]
});

const financialFormRules = reactive({
  financial: [required(t('message.validateFinancialLevelRequired'))],
})

const commFormRules = reactive({
  commission: [
    required(t('message.validateCommissionRequired')),
    { validator: validateCommission, trigger: 'blur' },
  ],
})

const modelFormRules = reactive({
  shareRatio: [
    { validator: validateShareRatio, trigger: 'blur' },
  ],
})

const remarkFormRules = reactive({
  remark: [required(t('message.validateRemarkRequired'))],
})

const affFormRules = reactive({
  // affiliateCode: [required(t('message.validateAffiliateCodeRequired'))],
})

const riskFormRules = reactive({
  risk: [required(t('message.validateRiskLevelRequired'))]
});

const loadAffiliateRemark = async () => {
  loading.remark = true
  const { data: ret } = await getAffiliateRemark(props.affId, request)
  page.pages = ret.pages
  page.records = ret.records
  loading.remark = false
}

const loadRiskLevels = async () => {
  const { data: risk } = await selectList({ siteId: memberDetail.siteId });
  riskList.list = risk;
};

const loadShareRatio = async () => {
  const { data: shareRatio } = await getAffiliateShareRatio(memberDetail.id)
  shareRatioList.list = shareRatio
  if (shareRatio.length > 0) {
    const { data: shareRatio } = await getConfigListByGroup('AGENT_SHARE_RATIO', memberDetail.siteId)
    const missingRatio = shareRatio.filter(item => !shareRatioList.list.some(ratio => ratio.code === item.code))
    missingRatio.forEach(ratio => {
      shareRatioList.list.push({
        code: ratio.code,
        value: 0
      })
    })
  } else {
    const { data: shareRatio } = await getConfigListByGroup('AGENT_SHARE_RATIO', memberDetail.siteId)
    shareRatioList.list = JSON.parse(JSON.stringify(shareRatio))
  }
  const { data: downlineShareRatio } = await getDownlineShareRatio(memberDetail.id)
  downlineShareRatioList.list = downlineShareRatio
}

const populateRiskColor = () => {
  const risk = riskList.list.find(r => r.id === riskForm.risk);
  selectedRiskColor.levelColor = risk.levelColor;
};

const changePage = page => {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateRemark()
  }
}

async function loadFinancialLevels() {
  const { data: financial } = await getFinancialLevels()
  financialList.list = financial
}

async function loadReferralLink() {
  const { data: affiliateUrl } = await getConfigList("affiliate_web_link", memberDetail.siteId);
  if (affiliateUrl[0].value) {
    link.value = affiliateUrl[0].value + 'agent/' + affiliateDetails.affiliateCode;
  } else {
    link.value = ''
  }
}

async function loadMemberStatus() {
  const { data: status } = await getMemberStatus(props.affId, memberDetail.siteId)
  memberDetail.status = status
}

// async function changeIgnoreSettlement(id, state) {
//   await updateIgnoreSettlement(id, state)
// }

function showDialog(type) {
  uiControl.dialogType = type
  if (type === 'UPDATE_PASSWORD' || type === 'UPDATE_WITHDRAW_PASSWORD') {
    if (updatePasswordForm.value) {
      updatePasswordForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.updatePassword')
    if (type === 'UPDATE_WITHDRAW_PASSWORD') {
      uiControl.dialogTitle = t('fields.updateWithdrawPassword')
    }
  } else if (type === 'DISABLE_AFFILIATE') {
    if (freezeMemberForm.value) {
      freezeMemberForm.value.resetFields()
    }
    freezeForm.site = site.id
    freezeForm.freezeType = freezeType.list[0].value
    freezeForm.reason = freezeReason.list[0].value
    uiControl.dialogTitle = t('fields.disableAffiliate')
  } else if (type === 'UPDATE_FINANCIAL') {
    if (updateFinancialForm.value) {
      updateFinancialForm.value.resetFields()
    }
    if (memberDetail.financial) {
      const financial = financialList.list.find(
        f => f.name === memberDetail.financial
      )
      financialForm.financial = financial.id
    } else {
      financialForm.financial = financialList.list[0].id
    }
    uiControl.dialogTitle = t('fields.updateFinancialLevel')
  } else if (type === 'UPDATE_MODEL') {
    if (memberDetail.commissionModel) {
      const commissionModel = uiControl.commissionModelType.find(
        c => c.value === memberDetail.commissionModel
      )
      modelForm.commissionModel = commissionModel.value
    } else {
      modelForm.commissionModel = uiControl.commissionModelType[0].value
    }
    uiControl.dialogTitle = t('fields.updateCommissionModel')
  } else if (type === 'UPDATE_COMMISSION') {
    commForm.commission = affiliateDetails.commission / 100
    uiControl.dialogTitle = t('fields.updateCommissionRate')
  } else if (type === 'UPDATE_PAYMENT_FEE') {
    commForm.commission = affiliateDetails.paymentFee / 100
    uiControl.dialogTitle = t('fields.updatePaymentFee')
  } else if (type === 'UPDATE_PLATFORM_FEE') {
    commForm.commission = affiliateDetails.platformFee / 100
    uiControl.dialogTitle = t('fields.updatePlatformFee')
  } else if (type === 'ADD_REMARK') {
    if (addRemarkForm.value) {
      addRemarkForm.value.resetFields()
    }
    remarkForm.id = null
    remarkForm.remark = null
    uiControl.dialogTitle = t('fields.addRemark')
  } else if (type === 'EDIT_REMARK') {
    if (editRemarkForm.value) {
      editRemarkForm.value.resetFields()
    }
    uiControl.dialogTitle = t('fields.editRemark')
  } else if (type === 'UPDATE_TIME_TYPE') {
    if (memberDetail.timeType !== null) {
      const timeType = uiControl.timeType.find(
        c => c.value === memberDetail.timeType
      )
      timeTypeForm.timeType = timeType.value
    } else {
      timeTypeForm.timeType = uiControl.timeType[0].value
    }
    uiControl.dialogTitle = t('fields.editTimeType')
  } else if (type === 'UPDATE_BELONG_TYPE') {
    if (memberDetail.belongType !== null) {
      const belongType = uiControl.belongType.find(
        c => c.value === memberDetail.belongType
      )
      belongTypeForm.belongType = belongType.value
    } else {
      belongTypeForm.belongType = uiControl.belongType[0].value
    }
    uiControl.dialogTitle = t('fields.editBelongType')
  } else if (type === 'CHANGE_AFF') {
    if (changeAffForm.value) {
      changeAffForm.value.resetFields()
    }
    affForm.affiliateCode = null
    uiControl.dialogTitle = t('fields.changeAffiliate')
  } else if (type === "FREEZE_MEMBER") {
    if (freezeMemberForm.value) {
      freezeMemberForm.value.resetFields();
    }
    freezeForm.freezeType = freezeType.list[0].value;
    freezeForm.reason = freezeReason.list[0].value;
    freezeForm.site = memberDetail.siteId;
    uiControl.dialogTitle = t('fields.freezeMember');
  } else if (type === "UNFREEZE_MEMBER") {
    if (unfreezeMemberForm.value) {
      unfreezeMemberForm.value.resetFields();
    }
    unfreezeForm.remark = "";
    unfreezeForm.site = site.id;
    uiControl.dialogTitle = t('fields.unfreezeMember');
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
  } else if (type === 'UPDATE_AFFILIATE_LEVEL') {
    levelForm.level = affiliateDetails.affiliateLevel
    uiControl.dialogTitle = t('fields.updateAffiliateLevel')
  } else if (type === "UPDATE_AFFILIATE_ALIAS") {
    aliasForm.alias = affiliateDetails.alias
    uiControl.dialogTitle = t('fields.updateAlias')
  }
  uiControl.dialogVisible = true
}

function changePassword() {
  updatePasswordForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.dialogType === 'UPDATE_WITHDRAW_PASSWORD') {
        await updateAffiliateWithdrawPassword(
          props.affId,
          passwordForm.password,
          memberDetail.siteId
        )
      } else {
        await updateAffiliatePassword(
          props.affId,
          passwordForm.password,
          memberDetail.siteId
        )
      }
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updatePasswordSuccess'),
        type: 'success',
      })
    }
  })
}

function freeze() {
  freezeMemberForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.dialogType === 'DISABLE_AFFILIATE') {
        await disableAffiliate(props.affId, freezeForm)
        const data = await getAffiliateDetails(props.affId, site.id)
        Object.keys({ ...data.data }).forEach(detailField => {
          memberDetail[detailField] = data.data[detailField]
        })
      } else if (uiControl.dialogType === 'FREEZE_MEMBER') {
        await freezeMember(props.affId, freezeForm)
        await loadMemberStatus()
      }
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.affiliateDisabled'), type: 'success' })
    }
  })
}

const unfreeze = () => {
  unfreezeMemberForm.value.validate(async (valid) => {
    if (valid) {
      await unfreezeMember(props.affId, unfreezeForm);
      await loadMemberStatus();
      uiControl.dialogVisible = false;
      ElMessage({ message: t('message.unfreezeMemberSuccess'), type: "success" });
    }
  });
};

async function approve() {
  await approveAffiliate(props.affId, LOGIN_USER_NAME.value)
  const data = await getAffiliateRecord(props.affId)
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField]
  })
  uiControl.dialogVisible = false
  ElMessage({ message: t('message.affiliateApproved'), type: 'success' })
}

async function reactivate() {
  await reactivateAffiliate(props.affId)
  const data = await getAffiliateRecord(props.affId)
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField]
  })
  uiControl.dialogVisible = false
  ElMessage({ message: t('message.affiliateReactivated'), type: 'success' })
}

async function syncMember() {
  await syncAffiliateParentChildren(props.affId, memberDetail.siteId);
  ElMessage({ message: t('message.syncMemberDetailSuccess'), type: "success" });
}

function updateModel() {
  updateModelForm.value.validate(async valid => {
    if (valid) {
      if (modelForm.commissionModel === 'DETAILS' && hasPermission(['sys:affiliate:update:share-ratio'])) {
        const shareRatio = shareRatioList.list.map(item => item.code + ":" + item.value).join(',');
        await updateCommissionModel(props.affId, modelForm.commissionModel, shareRatio)
      } else {
        await updateCommissionModel(props.affId, modelForm.commissionModel, null)
      }
      const data = await getAffiliateRecord(props.affId)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
      })
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updateCommissionModelSuccess'),
        type: 'success',
      })
    }
  })
}

function updateField(type) {
  if (type === 'FINANCIAL') {
    updateFinancialForm.value.validate(async valid => {
      if (valid) {
        await updateAffiliateFinancial(
          props.affId,
          financialForm.financial,
          site.id
        )
        const data = await getAffiliateDetails(props.affId, site.id)
        Object.keys({ ...data.data }).forEach(detailField => {
          memberDetail[detailField] = data.data[detailField]
        })
        uiControl.dialogVisible = false
        ElMessage({
          message: t('message.updateFinancialLevelSuccess'),
          type: 'success',
        })
      }
    })
  } else if (type === "RISK") {
    updateRiskForm.value.validate(async (valid) => {
      if (valid) {
        await updateRisk(props.affId, riskForm.risk, site.id);
        const data = await getAffiliateDetails(props.affId, site.id);
        Object.keys({ ...data.data }).forEach(detailField => {
          memberDetail[detailField] = data.data[detailField];
        });
        uiControl.dialogVisible = false;
        ElMessage({ message: t('message.updateRiskLevelSuccess'), type: "success" });
      }
    });
  }
}

async function updateFeeRate() {
  commissionForm.value.validate(async valid => {
    if (valid) {
      // detailField
      if (uiControl.dialogType === 'UPDATE_COMMISSION') {
        await updateCommissionRate(props.affId, commForm.commission)
      } else if (uiControl.dialogType === 'UPDATE_PAYMENT_FEE') {
        await updatePaymentFeeRate(props.affId, commForm.commission)
      } else if (uiControl.dialogType === 'UPDATE_PLATFORM_FEE') {
        await updatePlatformFeeRate(props.affId, commForm.commission)
      }
      await loadAffiliateRecord()
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updateSuccess'),
        type: 'success',
      })
    }
  })
}

async function updateFeeUndefined() {
  if (uiControl.dialogType === 'UPDATE_PAYMENT_FEE') {
    await updatePaymentFeeRate(props.affId, null)
  } else if (uiControl.dialogType === 'UPDATE_PLATFORM_FEE') {
    await updatePlatformFeeRate(props.affId, null)
  }
  await loadAffiliateRecord()
  uiControl.dialogVisible = false
  ElMessage({
    message: t('message.updateSuccess'),
    type: 'success',
  })
}

function updateMemberTimeType() {
  updateTimeTypeModel.value.validate(async valid => {
    if (valid) {
      await updateTimeType(props.affId, timeTypeForm.timeType)
      const data = await getAffiliateRecord(props.affId)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
      })
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updateTimeTypeSuccess'),
        type: 'success',
      })
    }
  })
}

function updateAffiliateLevel() {
  updateLevelModel.value.validate(async valid => {
    if (valid) {
      await updateLevel(props.affId, levelForm.level)
      const data = await getAffiliateRecord(props.affId)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
      })
      const { data: aff } = await getAffiliateInfo(props.affId, site.id)
      superiorAffiliateDetail.id = 0
      superiorAffiliateDetail.loginName = null
      superiorAffiliateDetail.affiliateCode = null
      superiorAffiliateDetail.affiliateLevel = null
      superiorAffiliateDetail.affiliateShareRatio = []
      Object.keys({ ...aff }).forEach(detailField => {
        superiorAffiliateDetail[detailField] = aff[detailField]
      })
      uiControl.dialogVisible = false
      affiliateDetails.affiliateLevel = levelForm.level
      ElMessage({
        message: t('message.updateAffiliateLevelSuccess'),
        type: 'success',
      })
    }
  })
}

function updateMemberBelongType() {
  updateBelongTypeModel.value.validate(async valid => {
    if (valid) {
      await updateBelongType(props.affId, belongTypeForm.belongType)
      const data = await getAffiliateRecord(props.affId)
      console.log('get data : ', data)
      Object.keys({ ...data.data }).forEach(detailField => {
        console.log('detailField : ', detailField)
        memberDetail[detailField] = data.data[detailField]
      })
      uiControl.dialogVisible = false
      ElMessage({
        message: t('message.updateBelongTypeSuccess'),
        type: 'success',
      })
    }
  })
}

function updateAlias() {
  updateAliasForm.value.validate(async valid => {
    if (valid) {
      await updateAffiliateAlias(props.affId, aliasForm.alias)
      uiControl.dialogVisible = false
      await loadAffiliateRecord()
      ElMessage({
        message: t('message.updateSuccess'),
        type: 'success',
      })
    }
  })
}

const addRemark = () => {
  addRemarkForm.value.validate(async valid => {
    if (valid) {
      remarkForm.memberId = props.affId
      await addAffiliateRemark(remarkForm)
      await loadAffiliateRemark()
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.addRemarkSuccess'), type: 'success' })
    }
  })
}

const editRemark = async () => {
  editRemarkForm.value.validate(async valid => {
    if (valid) {
      await editAffiliateRemark(remarkForm.id, remarkForm.remark)
      await loadAffiliateRemark()
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.editRemarkSuccess'), type: 'success' })
    }
  })
}

const removeRemark = async remark => {
  await deleteAffiliateRemark(remark.id)
  await loadAffiliateRemark()
  uiControl.dialogVisible = false
  ElMessage({ message: t('message.removeRemarkSuccess'), type: 'success' })
}

const showEditRemark = row => {
  showDialog('EDIT_REMARK')
  nextTick(() => {
    for (const key in row) {
      if (Object.keys(remarkForm).find(k => k === key)) {
        remarkForm[key] = row[key]
      }
    }
  })
}

async function loadBalance() {
  const { data: balance } = await getMemberBalance(props.affId)
  memberDetail.balance = balance
}

async function refreshAllBalance() {
  loading.total = true
  await loadBalance()
  loading.total = false
}

async function loadCommissionBalance() {
  const { data: balance } = await getCommissionBalance(props.affId)
  memberDetail.commissionBalance = balance
}

async function refreshCommissionBalance() {
  loading.commissionBalance = true
  await loadCommissionBalance()
  loading.commissionBalance = false
}

async function loadAffiliateRecord() {
  const { data: record } = await getAffiliateRecord(props.affId)
  affiliateDetails.affiliateCode = record.affiliateCode
  affiliateDetails.affiliateLevel = record.affiliateLevel
  affiliateDetails.downlineMember = record.downlineMember
  affiliateDetails.downlineAffiliate = record.downlineAffiliate
  affiliateDetails.commission = record.commission * 100
  affiliateDetails.paymentFee = record.paymentFee === null ? null : record.paymentFee * 100
  affiliateDetails.platformFee = record.platformFee === null ? null : record.platformFee * 100
  affiliateDetails.viewLoginName = record.viewLoginName
  affiliateDetails.alias = record.alias
}

function restrictCommissionDecimalInput(event) {
  var charCode = event.which ? event.which : event.keyCode
  if ((charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault()
  }

  if (
    commForm.commission !== null &&
    commForm.commission.toString().indexOf('.') > -1
  ) {
    if (charCode === 46) {
      event.preventDefault()
    }
    if (uiControl.dialogType === 'UPDATE_COMMISSION') {
      uiControl.commissionMax = 4
    } else {
      uiControl.commissionMax = 6
    }
  } else if (commForm.commission === '1') {
    uiControl.commissionMax = 1
  } else {
    uiControl.commissionMax = 2
  }
}

async function unmaskDetail(type) {
  if (type === 'NAME') {
    const { data: name } = await getMemberRealName(props.affId, site.id)
    unmaskedValue.value = name
    uiControl.dialogTitle = t('fields.realName')
  } else if (type === 'EMAIL') {
    const { data: email } = await getMemberEmail(props.affId, site.id)
    unmaskedValue.value = email
    uiControl.dialogTitle = t('fields.email')
  } else if (type === 'TELEPHONE') {
    const { data: telephone } = await getMemberTelephone(props.affId, site.id)
    unmaskedValue.value = telephone
    uiControl.dialogTitle = t('fields.telephone')
  }
  showDialog('UNMASK')
}

async function changeAffiliate() {
  if (!affForm.affiliateCode) {
    ElMessageBox.confirm(t('message.confirmUnbindAffiliateAccesss'), {
      title: t('message.confirmUnbindAffiliateAccesss'),
      confirmButtonText: t('fields.confirm'), // Replace with your translation key for "OK"
      cancelButtonText: t('fields.cancel') // Optional: Replace with your translation key for "Cancel"
    })
      .then(async () => {
        await changeNewAffilaite(
          props.affId,
          affForm.affiliateCode,
          memberDetail.memberType
        )
        ElMessage({ message: t('message.changeAffiliateSuccess'), type: 'success' })
        uiControl.dialogVisible = false
        loading.superiorAffiliateInfo = true
        const { data: aff } = await getAffiliateInfo(props.affId, site.id)
        Object.keys({ ...aff }).forEach(detailField => {
          superiorAffiliateDetail[detailField] = aff[detailField]
        })
        loading.superiorAffiliateInfo = false
      })
      .catch(() => {
        // catch error
      })
  } else {
    await changeNewAffilaite(
      props.affId,
      affForm.affiliateCode,
      memberDetail.memberType
    )
    ElMessage({ message: t('message.changeAffiliateSuccess'), type: 'success' })
    uiControl.dialogVisible = false
    loading.superiorAffiliateInfo = true
    const { data: aff } = await getAffiliateInfo(props.affId, site.id)
    Object.keys({ ...aff }).forEach(detailField => {
      superiorAffiliateDetail[detailField] = aff[detailField]
    })
    loading.superiorAffiliateInfo = false
  }
}

async function resetSecurityQuestion() {
  ElMessageBox.confirm(t('message.confirmReset'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await deleteSecurityQuestion(props.affId)
    const data = await getAffiliateDetails(props.affId, site.id)
    Object.keys({ ...data.data }).forEach(detailField => {
      memberDetail[detailField] = data.data[detailField]
    })
    ElMessage({ message: t('message.resetSuccess'), type: 'success' })
  })
}

async function changeViewLoginName() {
  ElMessageBox.confirm(t('message.confirmUpdate'), {
    confirmButtonText: t('fields.confirm'),
    cancelButtonText: t('fields.cancel'),
    type: 'warning',
  }).then(async () => {
    await updateViewLoginName(props.affId)
    await loadAffiliateRecord()
    ElMessage({ message: t('message.updateSuccess'), type: 'success' })
  })
}

function getAffiliateRatio(code) {
  const shareRatio = superiorAffiliateDetail.affiliateShareRatio.filter(item => item.code === code);
  return shareRatio === null || shareRatio === undefined || shareRatio.length === 0 ? (superiorAffiliateDetail.loginName === null ? 1 : 0) : shareRatio[0].value;
}

function getDownlineRatio(code) {
  const shareRatio = downlineShareRatioList.list.filter(item => item.code === code);
  return shareRatio === null || shareRatio === undefined || shareRatio.length === 0 ? 0 : shareRatio[0].value;
}

onMounted(async () => {
  loading.accountInfo = true
  loading.loginInfo = true
  loading.affiliateInfo = true
  loading.superiorAffiliateInfo = true
  await loadFinancialLevels()
  const data = await getAffiliateDetails(props.affId, site.id)
  Object.keys({ ...data.data }).forEach(detailField => {
    memberDetail[detailField] = data.data[detailField]
  })
  await loadShareRatio()
  const { data: aff } = await getAffiliateInfo(props.affId, site.id)
  Object.keys({ ...aff }).forEach(detailField => {
    superiorAffiliateDetail[detailField] = aff[detailField]
  })
  await loadMemberStatus()
  await loadAffiliateRemark()
  await loadBalance()
  await loadCommissionBalance()
  await loadAffiliateRecord()
  await loadReferralLink()
  await loadRiskLevels();
  loading.accountInfo = false
  loading.loginInfo = false
  loading.affiliateInfo = false
  loading.superiorAffiliateInfo = false
})
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
  :deep(.el-card__body) {
    padding: 0;
  }
}

:deep {
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

:deep([class^='el-table']) {
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

.level-color {
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}
</style>

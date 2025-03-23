<template>
  <div class="tables-container-wrap1">
    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.accountInfo') }}</span>
        </div>
      </template>
      <!--      <el-button-->
      <!--        type="info"-->
      <!--        size="mini"-->
      <!--        style="float: right;"-->
      <!--        @click="toggleWallet"-->
      <!--      >Toggle Wallet</el-button>-->
      <!--      <el-row>-->
      <!--        <span>-->
      <!--          Wallet Type : {{ memberDetail.walletType }}-->
      <!--        </span>-->
      <!--      </el-row>-->
      <!--      <el-row>-->
      <!--        <span>-->
      <!--          Fiat Balance : {{ memberDetail.fiatBalance }}, USDT Balance : {{ memberDetail.usdtBalance }}-->
      <!--        </span>-->
      <!--      </el-row>-->
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
          <span v-if="memberDetail.loginName !== null && memberDetail.maskedLoginName !== null">
            {{ memberDetail.loginName + " [" + memberDetail.maskedLoginName + "]" }}
          </span>
          <span v-else-if="memberDetail.loginName !== null">
            {{ memberDetail.loginName }}
          </span>
          <span v-else>-</span>
          <el-button
            type="info"
            size="mini"
            v-permission="['sys:member:logout-player']"
            style="float: right;"
            @click="logoutPlayer"
          >
            {{ t('fields.logoutPlayer') }}
          </el-button>
          <el-button
            type="info"
            size="mini"
            style="float: right;margin-right:5px;"
            @click="syncMember"
          >
            {{ t('fields.sync') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          :class-name="
            memberDetail.dupName === 'red'
              ? 'member-context-red'
              : 'member-context'
          "
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
          <span v-else-if="memberDetail.realName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              <span v-if="Number(memberDetail.siteId) === 3">
                {{ t('fields.englishName') }}
              </span>
              <span v-else>{{ t('fields.nickName') }}</span>
            </div>
          </template>
          <span v-if="memberDetail.name2 !== null && memberDetail.name2 !== ''">
            {{ memberDetail.name2 }}
          </span>
          <span v-if="memberDetail.name2 === null || memberDetail.name2 === ''">
            -
          </span>
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
            v-permission="['sys:member:update:password']"
            @click="showDialog('UPDATE_PASSWORD')"
          >
            {{ t('fields.updatePassword') }}
          </el-button>
          <el-button
            type="info"
            size="mini"
            v-permission="['sys:member:unlock']"
            @click="unlock()"
          >
            {{ t('fields.unlockMember') }}
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
              {{ t('fields.status') }}
            </div>
          </template>
          <el-tag
            v-if="memberDetail.status === 'NORMAL'"
            size="mini"
            type="success"
          >
            {{ t('status.member.' + memberDetail.status) }}
          </el-tag>
          <el-tag
            v-if="memberDetail.status === 'FROZEN'"
            size="mini"
            type="danger"
          >
            {{ t('status.member.' + memberDetail.status) }}
          </el-tag>
          <el-tag v-if="memberDetail.status === null" size="mini" type="info">
            -
          </el-tag>
          <el-button
            v-if="memberDetail.status === 'NORMAL'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:state']"
            @click="showDialog('FREEZE_MEMBER')"
          >
            {{ t('fields.freeze') }}
          </el-button>
          <el-button
            v-if="memberDetail.status === 'FROZEN'"
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:state']"
            @click="showDialog('UNFREEZE_MEMBER')"
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
              VIP
            </div>
          </template>
          <el-tag v-if="memberDetail.vip !== null" size="mini">
            {{ memberDetail.vip }}
          </el-tag>
          <el-tag v-if="memberDetail.vip === null" type="info" size="mini">
            -
          </el-tag>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:vip']"
            @click="showDialog('UPDATE_VIP')"
            :disabled="vipList.list.length === 0"
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
          <span
            class="level-color"
            :style="{backgroundColor: memberDetail.financialColor}"
          />
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:financial']"
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

          <el-tag v-if="memberDetail.phoneVerified" size="mini" type="success" style="float: right; margin-right: 10px">
            {{ t('fields.verified') }}
          </el-tag>
          <el-tag v-else size="mini" type="danger" style="float: right; margin-right: 10px">
            {{ t('fields.notVerified') }}
          </el-tag>

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
          <el-button
            style="margin-left: 5px"
            icon="el-icon-message"
            size="mini"
            type="warning"
            v-if="memberDetail.telephone !== null && uiControl.showSend"
            v-permission="['sys:sendsms:onesms:send']"
            @click="showDialog('SEND_SMS')"
          />
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
          <el-tag v-if="memberDetail.emailVerified" size="mini" type="success" style="float: right; margin-right: 10px">
            {{ t('fields.verified') }}
          </el-tag>
          <el-tag v-else size="mini" type="danger" style="float: right; margin-right: 10px">
            {{ t('fields.notVerified') }}
          </el-tag>
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
              <svg-icon icon-class="skill" style="height: 16px;width: 16px;" />
              {{ t('fields.riskLevel') }}
            </div>
          </template>
          <span v-if="memberDetail.risk !== null">{{ memberDetail.risk }}</span>
          <span v-if="memberDetail.risk === null">-</span>
          <span
            class="level-color"
            :style="{backgroundColor: memberDetail.riskColor}"
          />
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:risk']"
            @click="showDialog('UPDATE_RISK')"
            :disabled="riskList.list.length === 0"
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
              <svg-icon icon-class="table" style="height: 16px;width: 16px;" />
              {{ t('fields.birthday') }}
            </div>
          </template>
          <span v-if="memberDetail.birthday !== null">
            {{ memberDetail.birthday }}
          </span>
          <span v-if="memberDetail.birthday === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="dev" style="height: 16px;width: 16px;" />
              {{ t('fields.registerHost') }}
            </div>
          </template>
          <span v-if="memberDetail.regHost !== null">
            {{ memberDetail.regHost }}
          </span>
          <span v-if="memberDetail.regHost === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="mnt" style="height: 16px;width: 16px;" />
              {{ t('fields.registerDevice') }}
            </div>
          </template>
          <span v-if="memberDetail.regDevice !== null">
            {{ memberDetail.regDevice }}
          </span>
          <span v-if="memberDetail.regDevice === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.referrer') }}
            </div>
          </template>
          <span v-if="memberDetail.referrerName !== null">
            {{ memberDetail.referrerName }}
          </span>
          <span v-if="memberDetail.referrerName === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.userType') }}
            </div>
          </template>
          <span v-if="memberDetail.memberType !== null">
            {{ t('types.' + memberDetail.memberType) }}
          </span>
          <span v-if="memberDetail.memberType === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:member-type']"
            @click="showDialog('UPDATE_USERTYPE')"
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
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.sid') }}
            </div>
          </template>
          <span v-if="memberDetail.sid !== null">{{ memberDetail.sid }}</span>
          <span v-if="memberDetail.sid === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.traceId') }}
            </div>
          </template>
          <span v-if="memberDetail.traceId !== null">{{ memberDetail.traceId }}</span>
          <span v-if="memberDetail.traceId === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
          v-if="affiliateDetail.loginName !== null && parseInt(memberDetail.siteId) === 10"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.memberShareRatio') }}
            </div>
          </template>
          <el-button
            type="info"
            size="mini"
            style="float: left;"
            v-if="hasPermission(['sys:member:update:shareRatio'])"
            @click="showDialog('UPDATE_SHARE_RATIO')"
          >
            {{ t('fields.update') }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item v-if="affiliateDetail.loginName !== null && parseInt(memberDetail.siteId) === 10" />
        <el-descriptions-item v-if="affiliateDetail.loginName !== null && parseInt(memberDetail.siteId) === 10" />
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.withdrawType') }}
            </div>
          </template>
          <span v-if="memberDetail.withdrawType !== null">
            {{ t('withdrawType.' + memberDetail.withdrawType) }}
          </span>
          <span v-if="memberDetail.withdrawType === null">-</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:update:withdraw-type']"
            @click="showDialog('UPDATE_WITHDRAWTYPE')"
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
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.gender') }}
            </div>
          </template>
          <span v-if="memberDetail.gender !== null && memberDetail.gender !== ''">{{ t(`fields.${memberDetail.gender}`) }}</span>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="isPak(memberDetail.siteId)"
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px; width: 16px;" />
              {{ t('fields.transfer') }}
            </div>
          </template>
          <el-switch
            :disabled="!hasPermission(['sys:member:open-transfer:update:state'])"
            v-model="memberDetail.isOpenTransfer"
            @change="changeOpenTransferState(memberDetail.isOpenTransfer)"
          />
        </el-descriptions-item>
        <el-descriptions-item v-else />
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.affiliateInfo') }}</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:change-affiliate']"
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
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="user" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateName') }}
            </div>
          </template>
          <span v-if="affiliateDetail.loginName !== null">
            {{ affiliateDetail.loginName }}
          </span>
          <!-- :style="[{color: affiliateDetail.riskColor}]" -->
          <span v-if="affiliateDetail.loginName === null">-</span>

          <span
            class="level-color"
            :style="{backgroundColor: affiliateDetail.riskColor}"
          />
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
              {{ t('fields.affiliateCode') }}
            </div>
          </template>
          <span v-if="affiliateDetail.affiliateCode !== null">
            {{ affiliateDetail.affiliateCode }}
          </span>
          <span v-if="affiliateDetail.affiliateCode === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="nested" style="height: 16px;width: 16px;" />
              {{ t('fields.affiliateLevel') }}
            </div>
          </template>
          <span v-if="affiliateDetail.affiliateLevel !== null">
            {{ affiliateDetail.affiliateLevel }}
          </span>
          <span v-if="affiliateDetail.affiliateLevel === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="timing" style="height: 16px;width: 16px;" />
              {{ t('fields.startTime') }}
            </div>
          </template>
          <span v-if="affiliateDetail.startTime !== null">
            {{ affiliateDetail.startTime }}
          </span>
          <span v-if="affiliateDetail.startTime === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              <svg-icon icon-class="timing" style="height: 16px;width: 16px;" />
              {{ t('fields.endTime') }}
            </div>
          </template>
          <span v-if="affiliateDetail.endTime !== null">
            {{ affiliateDetail.endTime }}
          </span>
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
            <span
              v-formatter="{
                data: scope.row.createTime,
                type: 'date',
                timeZone: timeZone,
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
        v-permission="['sys:member:add:remark']"
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
          <span
            v-if="memberDetail.regIp !== null"
            :style="[
              selectedIpColor.registerIpColor !== null
                ? {color: selectedIpColor.registerIpColor}
                : {},
            ]"
          >
            {{ memberDetail.regIp }}
            <template v-if="selectedIpRemark.registerIpRemark">
              ( {{ selectedIpRemark.registerIpRemark }} )
            </template>
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
          <span
            v-if="memberDetail.lastLoginIp !== null"
            :style="[
              selectedIpColor.loginIpColor !== null
                ? {color: selectedIpColor.loginIpColor}
                : {},
            ]"
          >
            {{ memberDetail.lastLoginIp }}
            <template v-if="selectedIpRemark.loginIpRemark">
              ( {{ selectedIpRemark.loginIpRemark }} )
            </template>
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

    <el-card class="info-card" v-if="uiControl.supportMultiWallet">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.walletInfo') }}</span>
          <el-button
            type="info"
            size="mini"
            style="float: right;"
            v-permission="['sys:member:change-wallet-type']"
            @click="toggleWallet"
          >
            {{ t('fields.toggleWallet') }}
          </el-button>
        </div>
      </template>
      <el-descriptions
        size="small"
        class="margin-top"
        :column="3"
        border
        v-loading="loading.walletInfo"
      >
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.walletType') }}
            </div>
          </template>
          <span v-if="memberDetail.walletType !== null">
            {{ t('fields.' + memberDetail.walletType) }}
          </span>
          <!-- :style="[{color: affiliateDetail.riskColor}]" -->
          <span v-if="memberDetail.walletType === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.fiatBalance') }}
            </div>
          </template>
          <div class="balance">
            $
            <span
              v-formatter="{
                data: memberDetail.fiatBalance,
                type: 'money',
              }"
            />
          </div>
          <span v-if="memberDetail.fiatBalance === null">-</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="left"
          label-class-name="member-label"
          class-name="member-context"
        >
          <template #label>
            <div>
              {{ t('fields.usdtBalance') }}
            </div>
          </template>
          <div class="balance">
            $
            <span
              v-formatter="{
                data: memberDetail.usdtBalance,
                type: 'money',
              }"
            />
          </div>
          <span v-if="memberDetail.usdtBalance === null">-</span>
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
          <el-descriptions-item :label="t('fields.totalBalance')" width="30%">
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
            v-if="isInd(memberDetail.siteId)"
            :label="t('fields.withdrawableBalance')"
          >
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.withdrawableBalance,
                    type: 'money',
                  }"
                />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.thirtyDaysdw')">
            <div style="display: inline-block;" v-loading="loading.dnw">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.companyProfit,
                    type: 'money',
                  }"
                />
              </div>
            </div>
            <el-button
              class="refresh-btn"
              icon="el-icon-refresh"
              size="mini"
              @click="refreshDnW"
            />
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.claimableRebate')">
            <div style="display: inline-block;" v-loading="loading.rebate">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.claimableRebate,
                    type: 'money',
                  }"
                />
              </div>
            </div>
            <el-button
              class="refresh-btn"
              icon="el-icon-refresh"
              size="mini"
              @click="refreshClaimableRebate"
            />
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions size="small" class="margin-top" :column="4" border>
          <el-descriptions-item
            v-for="(value, key, index) in platformWallet"
            label-align="left"
            :key="index"
            label-class-name="member-platform-label"
            :label="key"
          >
            <div class="platform-balance" v-loading="loading.balance[key]">
              $
              <span v-formatter="{data: value, type: 'money'}" />
            </div>
            <div>
              <el-button
                class="refresh-platform-btn"
                icon="el-icon-refresh"
                size="mini"
                @click="refreshPlatformBalance(key)"
              />
              <el-button
                class="refresh-platform-btn"
                icon="el-icon-plus"
                size="mini"
                @click="showTransferDialogue(key, 'DEPOSIT')"
              />
              <el-button
                class="refresh-platform-btn"
                icon="el-icon-minus"
                size="mini"
                @click="showTransferDialogue(key, 'WITHDRAW')"
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" style="margin-top: 10px">
          <el-descriptions-item :label="t('fields.totalDeposit')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.totalDeposit,
                    type: 'money',
                  }"
                />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.totalWithdraw')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.totalWithdraw,
                    type: 'money',
                  }"
                />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.totalBonus')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{data: memberDetail.totalBonus, type: 'money'}"
                />
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" style="margin-top: 10px">
          <el-descriptions-item :label="t('fields.bet')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{data: memberDetail.totalBet, type: 'money'}"
                />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.validBet')" v-if="parseInt(memberDetail.siteId) === 7">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{data: memberDetail.totalValidBet, type: 'money'}"
                />
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('fields.payout')">
            <div style="display: inline-block;" v-loading="loading.total">
              <div class="balance">
                $
                <span
                  v-formatter="{
                    data: memberDetail.totalPayout,
                    type: 'money',
                  }"
                />
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="680px"
    >
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_PASSWORD'"
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
        v-if="uiControl.dialogType === 'FREEZE_MEMBER'"
        ref="freezeMemberForm"
        :model="freezeForm"
        :rules="freezeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
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
      <el-form
        v-if="uiControl.dialogType === 'UNFREEZE_MEMBER'"
        ref="unfreezeMemberForm"
        :model="unfreezeForm"
        :rules="unfreezeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
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
          <el-input
            type="textarea"
            v-model="unfreezeForm.remark"
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
          <el-button type="primary" @click="unfreeze">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_VIP'"
        ref="updateVipForm"
        :model="vipForm"
        :rules="vipFormRules"
        :inline="true"
        size="small"
        label-width="150px"
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
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateField('VIP')">
            {{ t('fields.confirm') }}
          </el-button>
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
          <span
            class="level-color"
            :style="{backgroundColor: selectedFinancialColor.levelColor}"
          />
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
        v-if="uiControl.dialogType === 'UPDATE_RISK'"
        ref="updateRiskForm"
        :model="riskForm"
        :rules="riskFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.member')">
          <el-input
            style="width: 350px"
            :placeholder="t('fields.loginName')"
            disabled
          />
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
          <span
            class="level-color"
            :style="{backgroundColor: selectedRiskColor.levelColor}"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateField('RISK')">
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
        v-if="uiControl.dialogType === 'PLATFORM_TRANSFER'"
        ref="platformTransferForm"
        :model="transferForm"
        :rules="transferFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.amount')" prop="amount">
          <el-input
            v-model="transferForm.amount"
            type="money"
            style="width: 350px;"
            maxlength="11"
          />
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="transferFund">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_USERTYPE'"
        ref="updateUserTypeForm"
        :model="userTypeForm"
        :rules="userTypeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
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
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editUserType">
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
        v-if="uiControl.dialogType === 'UPDATE_SHARE_RATIO'"
        ref="updateModelForm"
        :model="modelForm"
        :rules="modelFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.shareRatio')" prop="shareRatio">
          <div v-for="item in shareRatioList.list" :key="item.code" style="width: 350px; display: flex; margin-bottom:5px;">
            <span>{{ t('affiliateShareRatio.' + item.code) }}</span>
            <el-input
              v-model="item.value"
              style=" width:100px; margin-left: auto"
            />
            <span style="color:red"> &emsp; (0 - {{ getAffiliateRatio(item.code) }}) </span>
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
        v-if="uiControl.dialogType === 'SEND_SMS'"
        ref="sendSmsForm"
        :model="smsForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.smsType')" prop="param">
          <el-radio-group v-model="smsForm.param" size="mini" style="width: 450px">
            <el-radio-button label="1">{{ t('smsSend.template1') }}</el-radio-button>
            <el-radio-button label="2">{{ t('smsSend.template2') }}</el-radio-button>
            <el-radio-button label="3">{{ t('smsSend.template3') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="sendSms">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
      <el-form
        v-if="uiControl.dialogType === 'UPDATE_WITHDRAWTYPE'"
        ref="updateWithdrawTypeForm"
        :model="withdrawTypeForm"
        :rules="withdrawTypeFormRules"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.withdrawType')" prop="withdrawType">
          <el-select
            v-model="withdrawTypeForm.withdrawType"
            size="small"
            :placeholder="t('fields.withdrawType')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in withdrawType.list"
              :key="item.key"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">
            {{ t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="editWithdrawType">
            {{ t('fields.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { nextTick, defineComponent, onMounted, reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { required, size, isNumeric } from '../../../../../utils/validate'
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
  getMemberTelephone,
  normalMember,
  getAffiliateInfo,
  unfreezeMember,
  updateMemberType,
  unlockMember,
  refreshBalance,
  getDnW,
  getClaimableRebate,
  forceLogout,
  syncMemberDetail,
  getShareRatio,
  editShareRatio,
  updateWithdrawType,
  toggleMemberWallet,
  walletBalance,
  updateOpenTransfer
} from '../../../../../api/member'
import { getPlatformsBySite } from '../../../../../api/platform'
import { selectIpLabelAll } from '../../../../../api/ip-label'
import { getVipList } from '../../../../../api/vip'
import { selectList } from '../../../../../api/risk-level'
import { getFinancialLevels } from '../../../../../api/financial-level'
import { useStore } from '../../../../../store'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { useI18n } from 'vue-i18n'
import { changeNewAffilaite } from '../../../../../api/member-affiliate'
import { callTelephone, stopTelephone } from '../../../../../api/vcall'
import { getConfigListByGroup, getOpenForMember } from '../../../../../api/config'
import { sendOneSms } from '../../../../../api/send-sms'
import { isInd, isKorea, isPak } from '@/utils/site'
import { hasPermission } from '@/utils/util'

const store = useStore()
export default defineComponent({
  props: {
    mbrId: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const uiControl = reactive({
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      showCall: false,
      showCall1: false,
      showSend: false,
      supportMultiWallet: false,
    })
    const route = useRoute()
    const site = reactive({
      id: route.query.site,
    })
    const LOGIN_USER_SITEID = computed(() => store.state.user.siteId)

    const loading = reactive({
      accountInfo: false,
      affiliateInfo: false,
      remark: false,
      loginInfo: false,
      fundingInfo: false,
      total: false,
      dnw: false,
      balance: [],
      rebate: false
    })

    const updatePasswordForm = ref(null)
    const freezeMemberForm = ref(null)
    const unfreezeMemberForm = ref(null)
    const updateVipForm = ref(null)
    const updateFinancialForm = ref(null)
    const updateRiskForm = ref(null)
    const addRemarkForm = ref(null)
    const editRemarkForm = ref(null)
    const platformWallet = ref({})
    const platformTransferForm = ref(null)
    const unmaskedValue = ref(null)
    const updateUserTypeForm = ref(null)
    const changeAffForm = ref(null)
    const updateModelForm = ref(null)
    const sendSmsForm = ref(null)
    const updateWithdrawTypeForm = ref(null)

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

    const userType = reactive({
      list: [
        { key: 1, name: t('types.NORMAL'), value: 'NORMAL' },
        { key: 2, name: t('types.TEST'), value: 'TEST' },
        { key: 3, name: t('types.PROMO_TEST'), value: 'PROMO_TEST' },
      ],
    })

    const withdrawType = reactive({
      list: [
        { key: 1, name: t('withdrawType.Manual'), value: 'Manual' },
        { key: 2, name: t('withdrawType.AUTO_WITHDRAW'), value: 'AUTO_WITHDRAW' },
      ],
    })

    const vipList = reactive({
      list: [],
    })
    const riskList = reactive({
      list: [],
    })
    const financialList = reactive({
      list: [],
    })
    const selectedRiskColor = reactive({
      levelColor: null,
    })

    const selectedFinancialColor = reactive({
      levelColor: null,
    })

    const selectedIpColor = reactive({
      registerIpColor: null,
      loginIpColor: null,
    })

    const selectedIpRemark = reactive({
      registerIpRemark: null,
      loginIpRemark: null,
    })

    const memberDetail = reactive({
      id: 0,
      loginName: '',
      superiorAffName: '',
      regTime: '',
      balance: 0,
      withdrawableBalance: 0,
      companyProfit: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      lastLoginTime: '',
      status: '',
      realName: '',
      name2: '',
      email: '',
      telephone: '',
      vip: '',
      regIp: '',
      lastLoginIp: '',
      birthday: '',
      country: '',
      financial: '',
      totalBonus: 0,
      risk: '',
      site: '',
      siteId: 0,
      memberType: '',
      dupName: '',
      dupIp: '',
      claimableRebate: 0,
      fiatBalance: null,
      usdtBalance: null,
      walletType: null,
      gender: null,
      isOpenTransfer: null,
      maskedLoginName: null,
    })

    const affiliateDetail = reactive({
      id: 0,
      loginName: null,
      affiliateCode: null,
      affiliateLevel: null,
      startTime: null,
      endTime: null,
      affiliateShareRatio: []
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
      site: null,
    })

    const vipForm = reactive({
      vip: null,
    })

    const financialForm = reactive({
      financial: null,
    })

    const riskForm = reactive({
      risk: null,
    })

    const remarkForm = reactive({
      id: null,
      memberId: null,
      remark: null,
    })

    const transferForm = reactive({
      platformCode: null,
      amount: 0,
      action: null,
      siteId: null,
    })

    const userTypeForm = reactive({
      memberType: null,
    })

    const affForm = reactive({
      affiliateCode: null,
    })

    const modelForm = reactive({
      shareRatio: null,
    })

    const shareRatioList = reactive({
      list: [],
    })

    const smsForm = reactive({
      param: "1",
      memberId: null,
      siteId: null
    })

    const withdrawTypeForm = reactive({
      withdrawType: null,
    })

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

    const modelFormRules = reactive({
      shareRatio: [
        { validator: validateShareRatio, trigger: 'blur' },
      ],
    })

    const validatePassword = (rule, value, callback) => {
      if (value !== '' && passwordForm.reEnterPassword !== '') {
        updatePasswordForm.value.validateField('reEnterPassword')
      }
      callback()
    }

    const validateReEnterPassword = (rule, value, callback) => {
      if (value !== passwordForm.password) {
        callback(new Error(t('message.twoPasswordNotMatch')))
      }
      callback()
    }

    const passwordFormRules = reactive({
      password: [
        required(t('message.validatePasswordRequired')),
        size(6, 12, t('message.validatePasswordSize')),
        {
          validator: validatePassword,
          trigger: 'blur',
        },
      ],
      reEnterPassword: [
        required(t('message.validateReenterPasswordRequired')),
        { validator: validateReEnterPassword, trigger: 'blur' },
      ],
    })

    const transferFormRules = reactive({
      platformCode: [required(t('message.validatePlatformCodeRequired'))],
      amount: [
        required(t('message.validateAmountRequired')),
        isNumeric(t('messsage.validateNumberFourDecimalOnly')),
      ],
      action: [required(t('message.validateActionRequired'))],
    })

    const freezeFormRules = reactive({
      freezeType: [required(t('message.validateFreezeTypeRequired'))],
      reason: [required(t('message.validateReasonRequired'))],
    })

    const unfreezeFormRules = reactive({
      remark: [required(t('message.validateRemarkRequired'))],
    })

    const vipFormRules = reactive({
      vip: [required(t('message.validateVIPRequired'))],
    })

    const financialFormRules = reactive({
      financial: [required(t('message.validateFinancialLevelRequired'))],
    })

    const riskFormRules = reactive({
      risk: [required(t('message.validateRiskLevelRequired'))],
    })

    const remarkFormRules = reactive({
      remark: [required(t('message.validateRemarkRequired'))],
    })

    const userTypeFormRules = reactive({
      memberType: [required(t('message.validateUserTypeRequired'))],
    })

    const affFormRules = reactive({
      affiliateCode: [required(t('message.validateAffiliateCodeRequired'))],
    })

    const withdrawTypeFormRules = reactive({
      memberType: [required(t('message.validateWithdrawTypeRequired'))],
    })

    const loadMemberRemark = async () => {
      loading.remark = true
      const { data: ret } = await getMemberRemark(props.mbrId, request)
      page.pages = ret.pages
      page.records = ret.records
      loading.remark = false
    }

    const loadVips = async () => {
      const { data: vip } = await getVipList({ siteId: memberDetail.siteId })
      vipList.list = vip
    }

    const loadFinancialLevels = async () => {
      const { data: financial } = await getFinancialLevels({
        siteId: memberDetail.siteId,
      })
      financialList.list = financial
    }

    const loadRiskLevels = async () => {
      const { data: risk } = await selectList({ siteId: memberDetail.siteId })
      riskList.list = risk
    }

    const populateRiskColor = () => {
      const risk = riskList.list.find(r => r.id === riskForm.risk)
      selectedRiskColor.levelColor = risk.levelColor
    }

    const populateFinancialColor = () => {
      const financial = financialList.list.find(
        f => f.id === financialForm.financial
      )
      selectedFinancialColor.levelColor = financial.levelColor
    }

    const populateIpColor = () => {
      const regIpLabel = store.state.app.ipLabels.find(
        r => r.ip === memberDetail.regIp
      )
      const lastLoginIpLabel = store.state.app.ipLabels.find(
        r => r.ip === memberDetail.lastLoginIp
      )
      if (regIpLabel) {
        selectedIpColor.registerIpColor = regIpLabel.color
        selectedIpRemark.registerIpRemark = regIpLabel.remark
      }
      if (lastLoginIpLabel) {
        selectedIpColor.loginIpColor = lastLoginIpLabel.color
        selectedIpRemark.loginIpRemark = lastLoginIpLabel.remark
      }
    }

    const changePage = page => {
      if (request.current >= 1) {
        request.current = page
        loadMemberRemark()
      }
    }

    const showDialog = async type => {
      console.log(type)
      uiControl.dialogType = type
      if (type === 'UPDATE_PASSWORD') {
        if (updatePasswordForm.value) {
          updatePasswordForm.value.resetFields()
        }
        uiControl.dialogTitle = t('fields.updatePassword')
      } else if (type === 'FREEZE_MEMBER') {
        if (freezeMemberForm.value) {
          freezeMemberForm.value.resetFields()
        }
        freezeForm.freezeType = freezeType.list[0].value
        freezeForm.reason = freezeReason.list[0].value
        freezeForm.site = site.id
        uiControl.dialogTitle = t('fields.freezeMember')
      } else if (type === 'UNFREEZE_MEMBER') {
        if (unfreezeMemberForm.value) {
          unfreezeMemberForm.value.resetFields()
        }
        unfreezeForm.remark = ''
        unfreezeForm.site = site.id
        uiControl.dialogTitle = t('fields.unfreezeMember')
      } else if (type === 'UPDATE_VIP') {
        if (updateVipForm.value) {
          updateVipForm.value.resetFields()
        }
        if (memberDetail.vip) {
          const vip = vipList.list.find(v => v.name === memberDetail.vip)
          vipForm.vip = vip.id
        } else {
          vipForm.vip = vipList.list[0].id
        }
        uiControl.dialogTitle = t('fields.updateVIPLevel')
      } else if (type === 'UPDATE_FINANCIAL') {
        if (updateFinancialForm.value) {
          updateFinancialForm.value.resetFields()
        }
        if (memberDetail.financial) {
          const financial = financialList.list.find(
            f => f.name === memberDetail.financial
          )
          financialForm.financial = financial.id
          selectedFinancialColor.levelColor = financial.levelColor
        } else {
          financialForm.financial = financialList.list[0].id
          selectedFinancialColor.levelColor = financialList.list[0].levelColor
        }
        uiControl.dialogTitle = t('fields.updateFinancialLevel')
      } else if (type === 'UPDATE_RISK') {
        if (updateRiskForm.value) {
          updateRiskForm.value.resetFields()
        }
        if (memberDetail.risk) {
          const risk = riskList.list.find(
            r => r.levelName === memberDetail.risk
          )
          riskForm.risk = risk.id
          selectedRiskColor.levelColor = risk.levelColor
        } else {
          riskForm.risk = riskList.list[0].id
          selectedRiskColor.levelColor = riskList.list[0].levelColor
        }
        uiControl.dialogTitle = t('fields.updateRiskLevel')
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
      } else if (type === 'PLATFORM_TRANSFER') {
        uiControl.dialogTitle = t('fields.platformFundTransfer')
      } else if (type === 'UPDATE_USERTYPE') {
        if (updateUserTypeForm.value) {
          updateUserTypeForm.value.resetFields()
        }
        userTypeForm.memberType = userType.list[0].value
        if (memberDetail.memberType !== null) {
          userTypeForm.memberType = memberDetail.memberType
        }
        uiControl.dialogTitle = t('fields.userType')
      } else if (type === 'CHANGE_AFF') {
        if (changeAffForm.value) {
          changeAffForm.value.resetFields()
        }
        affForm.affiliateCode = null
        uiControl.dialogTitle = t('fields.changeAffiliate')
      } else if (type === 'UPDATE_SHARE_RATIO') {
        await loadShareRatio()
        uiControl.dialogTitle = t('fields.updateShareRatio')
      } else if (type === 'SEND_SMS') {
        uiControl.dialogTitle = t('fields.send')
      } else if (type === 'UPDATE_WITHDRAWTYPE') {
        if (updateWithdrawTypeForm.value) {
          updateWithdrawTypeForm.value.resetFields()
        }
        withdrawTypeForm.withdrawType = withdrawType.list[0].value
        if (memberDetail.withdrawType !== null) {
          withdrawTypeForm.withdrawType = memberDetail.withdrawType
        }
        uiControl.dialogTitle = t('fields.withdrawType')
      }
      uiControl.dialogVisible = true
    }

    const changePassword = () => {
      updatePasswordForm.value.validate(async valid => {
        if (valid) {
          await updatePassword(
            props.mbrId,
            passwordForm.password,
            memberDetail.siteId
          )
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.updatePasswordSuccess'),
            type: 'success',
          })
        }
      })
    }

    function updateModel() {
      updateModelForm.value.validate(async valid => {
        if (valid) {
          const shareRatio = shareRatioList.list.map(item => item.code + ":" + item.value).join(',');
          await editShareRatio(props.mbrId, shareRatio)
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.updateCommissionModelSuccess'),
            type: 'success',
          })
        }
      })
    }

    const loadShareRatio = async () => {
      const { data: shareRatio } = await getShareRatio(props.mbrId)
      if (shareRatio.length > 0) {
        shareRatioList.list = shareRatio
        if (shareRatio.length !== 5) {
          const { data: shareRatio } = await getConfigListByGroup('AGENT_SHARE_RATIO', site.id)
          const missingRatio = shareRatio.filter(item => !shareRatioList.list.some(ratio => ratio.code === item.code))
          missingRatio.forEach(ratio => {
            shareRatioList.list.push({
              code: ratio.code,
              value: 0
            })
          })
        }
      } else {
        const { data: shareRatio } = await getConfigListByGroup('AGENT_SHARE_RATIO', site.id)
        const missingRatio = shareRatio.filter(item => !shareRatioList.list.some(ratio => ratio.code === item.code))
        missingRatio.forEach(ratio => {
          shareRatioList.list.push({
            code: ratio.code,
            value: 0
          })
        })
      }
    }

    const transferFund = () => {
      platformTransferForm.value.validate(async valid => {
        if (valid) {
          transferForm.siteId = memberDetail.siteId
          await platformFundTransfer(props.mbrId, transferForm)
          uiControl.dialogVisible = false

          loading.total = true
          const data = await getMemberDetails(props.mbrId, site.id)
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField]
          })
          const key = transferForm.platformCode
          loading.balance[key] = true
          await refreshPlatformBalance(key)
          loading.balance[key] = false
          loading.total = false
          ElMessage({ message: t('message.transferSuccess'), type: 'success' })
        }
      })
    }

    const freeze = () => {
      freezeMemberForm.value.validate(async valid => {
        if (valid) {
          await freezeMember(props.mbrId, freezeForm)
          const data = await getMemberDetails(props.mbrId, site.id)
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField]
          })
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.freezeMemberSuccess'),
            type: 'success',
          })
        }
      })
    }

    const unfreeze = () => {
      unfreezeMemberForm.value.validate(async valid => {
        if (valid) {
          await unfreezeMember(props.mbrId, unfreezeForm)
          const data = await getMemberDetails(props.mbrId, site.id)
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField]
          })
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.freezeMemberSuccess'),
            type: 'success',
          })
        }
      })
    }

    const changeToNormal = async id => {
      await normalMember(id, site.id)
      const data = await getMemberDetails(props.mbrId, site.id)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
      })
      ElMessage({ message: t('message.updateSuccess'), type: 'success' })
    }

    const updateField = type => {
      if (type === 'VIP') {
        updateVipForm.value.validate(async valid => {
          if (valid) {
            await updateVip(props.mbrId, vipForm.vip, site.id)
            const data = await getMemberDetails(props.mbrId, site.id)
            Object.keys({ ...data.data }).forEach(detailField => {
              memberDetail[detailField] = data.data[detailField]
            })
            uiControl.dialogVisible = false
            ElMessage({
              message: t('message.updateVIPLevelSuccess'),
              type: 'success',
            })
          }
        })
      } else if (type === 'FINANCIAL') {
        updateFinancialForm.value.validate(async valid => {
          if (valid) {
            await updateFinancial(props.mbrId, financialForm.financial, site.id)
            const data = await getMemberDetails(props.mbrId, site.id)
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
      } else if (type === 'RISK') {
        updateRiskForm.value.validate(async valid => {
          if (valid) {
            await updateRisk(props.mbrId, riskForm.risk, site.id)
            const data = await getMemberDetails(props.mbrId, site.id)
            Object.keys({ ...data.data }).forEach(detailField => {
              memberDetail[detailField] = data.data[detailField]
            })
            uiControl.dialogVisible = false
            ElMessage({
              message: t('message.updateRiskLevelSuccess'),
              type: 'success',
            })
          }
        })
      }
    }

    const addRemark = () => {
      addRemarkForm.value.validate(async valid => {
        if (valid) {
          remarkForm.memberId = props.mbrId
          await addMemberRemark(remarkForm)
          await loadMemberRemark()
          uiControl.dialogVisible = false
          ElMessage({ message: t('message.addRemarkSuccess'), type: 'success' })
        }
      })
    }

    const editRemark = async () => {
      editRemarkForm.value.validate(async valid => {
        if (valid) {
          await editMemberRemark(remarkForm.id, remarkForm.remark)
          await loadMemberRemark()
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.editRemarkSuccess'),
            type: 'success',
          })
        }
      })
    }

    const removeRemark = async remark => {
      await deleteMemberRemark(remark.id)
      await loadMemberRemark()
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
    const editUserType = () => {
      updateUserTypeForm.value.validate(async valid => {
        if (valid) {
          await updateMemberType(props.mbrId, userTypeForm.memberType, site.id)
          const data = await getMemberDetails(props.mbrId, site.id)
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField]
          })
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.updateUserTypeSuccess'),
            type: 'success',
          })
        }
      })
    }

    const editWithdrawType = () => {
      updateWithdrawTypeForm.value.validate(async valid => {
        if (valid) {
          await updateWithdrawType(props.mbrId, withdrawTypeForm.withdrawType, site.id)
          const data = await getMemberDetails(props.mbrId, site.id)
          Object.keys({ ...data.data }).forEach(detailField => {
            memberDetail[detailField] = data.data[detailField]
          })
          uiControl.dialogVisible = false
          ElMessage({
            message: t('message.updateWithdrawTypeSuccess'),
            type: 'success',
          })
        }
      })
    }

    const loadBalance = async () => {
      const platform = await getPlatformsBySite(memberDetail.siteId)
      for (const item of platform.data) {
        if (item.walletType === 'TRANSFER') {
          platformWallet.value[item.code] = 0
          loading.balance[item.code] = false
        }
      }
    }

    const refreshAllBalance = async () => {
      loading.total = true
      Object.entries(loading.balance).forEach(([key, value]) => {
        loading.balance[key] = true
      })

      const { data: balance } = await refreshBalance(props.mbrId, site.id)
      memberDetail.balance = balance.balance
      memberDetail.withdrawableBalance = balance.withdrawableBalance
      memberDetail.totalDeposit = balance.totalDeposit
      memberDetail.totalWithdraw = balance.totalWithdraw
      memberDetail.totalBonus = balance.totalBonus

      for (const key of Object.keys(platformWallet.value)) {
        const { data: balance } = await getPlatformBalance(
          props.mbrId,
          key,
          site.id
        )
        platformWallet.value[key] = balance
        loading.balance[key] = false
      }
      loading.total = false
    }

    const refreshDnW = async () => {
      loading.dnw = true
      const { data: balance } = await getDnW(props.mbrId, site.id)
      memberDetail.companyProfit = balance
      loading.dnw = false
    }

    const refreshClaimableRebate = async () => {
      loading.rebate = true
      const { data: rebate } = await getClaimableRebate(props.mbrId, site.id)
      memberDetail.claimableRebate = rebate
      loading.rebate = false
    }

    const refreshPlatformBalance = async key => {
      loading.balance[key] = true
      const { data: balance } = await getPlatformBalance(
        props.mbrId,
        key,
        site.id
      )
      platformWallet.value[key] = balance
      loading.balance[key] = false
    }

    const showTransferDialogue = async (key, action) => {
      transferForm.action = action
      transferForm.platformCode = key
      transferForm.amount = 0
      showDialog('PLATFORM_TRANSFER')
    }

    async function setIpLabelsIfEmpty() {
      if (
        store.state.app.ipLabels.length < 1 ||
        store.state.app.ipLabels === undefined
      ) {
        const { data: labels } = await selectIpLabelAll()
        store.dispatch(AppActionTypes.ACTION_SET_IP_LABELS, labels)
      }
    }

    async function unmaskDetail(type) {
      if (type === 'NAME') {
        const { data: name } = await getMemberRealName(props.mbrId, site.id)
        unmaskedValue.value = name
        uiControl.dialogTitle = t('fields.realName')
      } else if (type === 'EMAIL') {
        const { data: email } = await getMemberEmail(props.mbrId, site.id)
        unmaskedValue.value = email
        uiControl.dialogTitle = t('fields.email')
      } else if (type === 'TELEPHONE') {
        const { data: telephone } = await getMemberTelephone(
          props.mbrId,
          site.id
        )
        unmaskedValue.value = telephone
        uiControl.dialogTitle = t('fields.telephone')
      }
      showDialog('UNMASK')
    }

    async function unlock() {
      await unlockMember(props.mbrId, site.id)
      const data = await getMemberDetails(props.mbrId, site.id)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
      })
      ElMessage({ message: t('message.unlockMemberSuccess'), type: 'success' })
    }

    async function logoutPlayer() {
      await forceLogout(props.mbrId, site.id)
      ElMessage({ message: t('message.logoutPlayerSuccess'), type: 'success' })
    }

    async function syncMember() {
      await syncMemberDetail(props.mbrId, site.id)
      ElMessage({
        message: t('message.syncMemberDetailSuccess'),
        type: 'success',
      })
    }

    async function changeAffiliate() {
      await changeNewAffilaite(
        props.mbrId,
        affForm.affiliateCode,
        memberDetail.memberType
      )
      ElMessage({
        message: t('message.changeAffiliateSuccess'),
        type: 'success',
      })
      uiControl.dialogVisible = false
      loading.affiliateInfo = true
      const { data: aff } = await getAffiliateInfo(props.mbrId, site.id)
      Object.keys({ ...aff }).forEach(detailField => {
        affiliateDetail[detailField] = aff[detailField]
      })
      loading.affiliateInfo = false
    }

    async function callPhone(id, site) {
      var res = await callTelephone(id, site)
      if (res.data === 'true') {
        ElMessage({ message: t('message.success'), type: 'success' })
      } else {
        ElMessage({ message: t('fields.fail'), type: 'fail' })
      }
    }

    async function stopPhone(id, site) {
      var res = await stopTelephone(id, site)
      if (res.data === 'true') {
        ElMessage({ message: t('message.success'), type: 'success' })
      } else {
        ElMessage({ message: t('fields.fail'), type: 'fail' })
      }
    }

    function getAffiliateRatio(code) {
      const shareRatio = affiliateDetail.affiliateShareRatio.filter(item => item.code === code);
      return shareRatio === null || shareRatio === undefined || shareRatio.length === 0 ? 0 : shareRatio[0].value;
    }

    const sendSms = async () => {
      smsForm.siteId = site.id
      smsForm.memberId = props.mbrId
      await sendOneSms(smsForm)
      uiControl.dialogVisible = false
      ElMessage({ message: t('message.success'), type: 'success' })
    }

    const loadSupportMultiWallet = async () => {
      const { data: config } = await getOpenForMember(site.id, 'support_multi_wallet', props.mbrId)
      uiControl.supportMultiWallet = config
    }

    const loadWallet = async () => {
      await loadSupportMultiWallet()
      if (uiControl.supportMultiWallet) {
        const { data: wallet } = await walletBalance(props.mbrId, site.id)
        memberDetail.fiatBalance = wallet.fiat
        memberDetail.usdtBalance = wallet.usdt
        memberDetail.walletType = wallet.walletType
      }
    }

    async function toggleWallet() {
      await toggleMemberWallet(props.mbrId, site.id)
      await loadWallet()
      ElMessage({ message: t('message.success'), type: 'success' })
    }

    async function changeOpenTransferState(state) {
      await updateOpenTransfer(memberDetail.id, memberDetail.siteId, state);
    }

    onMounted(async () => {
      loading.accountInfo = true
      loading.affiliateInfo = true
      loading.loginInfo = true
      loading.fundingInfo = true
      await setIpLabelsIfEmpty()
      loading.accountInfo = false
      const data = await getMemberDetails(props.mbrId, site.id, 1)
      Object.keys({ ...data.data }).forEach(detailField => {
        memberDetail[detailField] = data.data[detailField]
          ? data.data[detailField]
          : '';

        if (detailField === 'maskedLoginName') {
          memberDetail[detailField] = data.data[detailField]
        }

        if (detailField === 'isOpenTransfer') {
          memberDetail[detailField] = data.data[detailField]
        }
      })

      const { data: aff } = await getAffiliateInfo(props.mbrId, site.id)
      Object.keys({ ...aff }).forEach(detailField => {
        affiliateDetail[detailField] = aff[detailField]
      })
      loading.affiliateInfo = false

      loadMemberRemark()
      await loadVips()
      await loadFinancialLevels()
      await loadRiskLevels()
      await populateIpColor()
      loading.accountInfo = false
      loading.loginInfo = false

      await loadBalance()
      await refreshClaimableRebate()
      await loadWallet()
      loading.fundingInfo = false
      if (site.id === '3' || site.id === '8') {
        uiControl.showCall = true
        uiControl.showCall1 = true
        uiControl.showSend = true
      }
    })

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
      selectedIpRemark,
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
      unfreezeMemberForm,
      unfreezeForm,
      unfreezeFormRules,
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
      smsForm,
      sendSmsForm,
      sendSms,
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
      unfreeze,
      updateField,
      addRemark,
      editRemark,
      removeRemark,
      showEditRemark,
      loadBalance,
      refreshAllBalance,
      refreshDnW,
      refreshClaimableRebate,
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
      syncMember,
      affForm,
      affFormRules,
      changeAffiliate,
      callPhone,
      stopPhone,
      modelFormRules,
      updateModel,
      shareRatioList,
      updateModelForm,
      modelForm,
      getAffiliateRatio,
      isInd,
      isKorea,
      LOGIN_USER_SITEID,
      toggleWallet,
      editWithdrawType,
      withdrawTypeFormRules,
      withdrawTypeForm,
      withdrawType,
      updateWithdrawTypeForm,
      hasPermission,
      changeOpenTransferState,
      isPak
    }
  },
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

.member-platform-label {
  width: 10%;
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
  :deep(.el-card__body) {
    padding: 0;
  }
}

:deep(
  .el-tabs__content) {
    padding: 0;
  }

.platform {
  display: flex;
  text-align: center;
  width: fit-content;
  flex: 1;

  * {
    // add back paddings supposed to be present 1
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

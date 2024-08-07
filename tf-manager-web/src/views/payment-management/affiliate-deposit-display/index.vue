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
          @change="handleChangeSite()"
        >
          <el-option
            v-for="item in list.sites"
            :key="item.id"
            :label="item.siteName"
            :value="item.id"
          />
        </el-select>
        <el-select
          filterable
          clearable
          v-model="request.affiliateId"
          size="small"
          :placeholder="t('fields.affiliate')"
          class="filter-item"
          style="width: 200px; margin-left: 5px;"
        >
          <el-option
            v-for="item in list.allAffiliates"
            :key="item.affiliateId"
            :label="item.loginName"
            :value="item.affiliateId"
          />
        </el-select>
        <el-button
          style="margin-left: 20px"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="loadAffiliateDepositDisplay()"
        >
          {{ t('fields.search') }}
        </el-button>
      </div>
    </div>
    <el-dialog
      :title="uiControl.dialogSettingTitle"
      v-model="uiControl.dialogSettingVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="affiliateFinancialDepositSettingForm"
        v-loading="uiControl.dialogLoading"
        :model="settingForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item :label="t('fields.privilegeName') + 1" prop="privilegeId1" v-if="checkSetting(1)">
          <el-select
            filterable
            clearable
            v-model="settingForm.privilegeId1"
            size="small"
            :placeholder="t('fields.privilegeName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.privileges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName') + 2" prop="privilegeId2" v-if="checkSetting(2)">
          <el-select
            filterable
            clearable
            v-model="settingForm.privilegeId2"
            size="small"
            :placeholder="t('fields.privilegeName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.privileges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName') + 3" prop="privilegeId3" v-if="checkSetting(3) && !uiControl.isPRKSite">
          <el-select
            filterable
            clearable
            v-model="settingForm.privilegeId3"
            size="small"
            :placeholder="t('fields.privilegeName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.privileges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fields.icon') + 1" prop="icon1" v-if="checkSetting(1)">
          <el-row :gutter="24">
            <el-col v-if="settingForm.icon1" :span="18" style="width: 250px">
              <el-image
                v-if="settingForm.icon1"
                :src="paymentDir + settingForm.icon1"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('ICON1')"
              >
                {{ $t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('fields.icon') + 2" prop="icon2" v-if="checkSetting(2)">
          <el-row :gutter="24">
            <el-col v-if="settingForm.icon2" :span="18" style="width: 250px">
              <el-image
                v-if="settingForm.icon2"
                :src="paymentDir + settingForm.icon2"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('ICON2')"
              >
                {{ $t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('fields.icon') + 3" prop="icon3" v-if="checkSetting(3)">
          <el-row :gutter="24">
            <el-col v-if="settingForm.icon3" :span="18" style="width: 250px">
              <el-image
                v-if="settingForm.icon3"
                :src="paymentDir + settingForm.icon3"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('ICON3')"
              >
                {{ $t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogSettingVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submitSetting">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="uiControl.dialogTitle"
      v-model="uiControl.dialogVisible"
      append-to-body
      width="600px"
    >
      <el-form
        ref="affiliateFinancialDepositDisplayForm"
        v-loading="uiControl.dialogLoading"
        :model="form"
        :rules="formRules"
        :inline="true"
        size="small"
        label-width="200px"
      >
        <el-form-item :label="t('fields.affiliate')" prop="affiliateId">
          <el-select
            filterable
            clearable
            v-model="form.affiliateId"
            size="small"
            :placeholder="t('fields.affiliate')"
            class="filter-item"
            style="width: 350px;"
            v-show="uiControl.dialogType === 'CREATE'"
          >
            <el-option
              v-for="item in list.affiliates"
              :key="item.affiliateId"
              :label="item.loginName"
              :value="item.affiliateId"
            />
          </el-select>
          <el-input
            v-model="form.loginName"
            size="small"
            style="width: 350px;"
            v-show="uiControl.dialogType !== 'CREATE'"
            disabled
          />
        </el-form-item>
        <el-form-item :label="uiControl.payment1Title" prop="paymentId1" v-if="!uiControl.isPRKSite && !uiControl.isNGASite">
          <el-select
            filterable
            clearable
            v-model="form.paymentId1"
            size="small"
            :placeholder="t('fields.paymentChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="uiControl.payment2Title" prop="paymentId2" v-if="!uiControl.isPRKSite && !uiControl.isNGASite">
          <el-select
            filterable
            clearable
            v-model="form.paymentId2"
            size="small"
            :placeholder="t('fields.paymentChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="uiControl.payment3Title" prop="paymentId3" v-if="!uiControl.isPRKSite && !uiControl.isNGASite">
          <el-select
            filterable
            clearable
            v-model="form.paymentId3"
            size="small"
            :placeholder="t('fields.paymentChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.riskPaymentChannel')" prop="paymentId4" v-if="!uiControl.isPRKSite && !uiControl.isNGASite">
          <el-select
            filterable
            clearable
            v-model="form.paymentId4"
            size="small"
            :placeholder="t('fields.riskPaymentChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="uiControl.withdraw1Title" prop="withdrawPlatformId" v-if="!uiControl.isNGASite">
          <el-select
            filterable
            clearable
            v-model="form.withdrawPlatformId"
            size="small"
            :placeholder="t('fields.withdrawChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.siteWithdrawPlatform"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="uiControl.withdraw2Title" prop="withdrawPlatformId2" v-if="uiControl.isPRKSite">
          <el-select
            filterable
            clearable
            v-model="form.withdrawPlatformId2"
            size="small"
            :placeholder="t('fields.withdrawChannel')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.siteWithdrawPlatform"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.type')" prop="paymentType" v-if="uiControl.dialogType === 'ADD'">
          <el-switch
            v-model="form.paymentType"
            class="mb-2"
            :active-text="t('fields.paymentChannel')"
            :inactive-text="t('fields.withdrawChannel')"
            active-value="Deposit"
            inactive-value="Withdraw"
            v-if="uiControl.dialogType === 'ADD'"
          />
        </el-form-item>
        <el-form-item :label="t('fields.paymentChannel')" prop="channelId" v-if="uiControl.isNGASite && form.paymentType === 'Deposit' && uiControl !== 'CREATE'">
          <el-select
            filterable
            clearable
            v-model="form.channelId"
            size="small"
            :placeholder="t('fields.paymentChannel')"
            class="filter-item"
            style="width: 350px;"
            :disabled="uiControl.dialogType === 'ITEM'"
          >
            <el-option
              v-for="item in list.paymentInfo"
              :key="item.id"
              :label="item.paymentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.withdrawChannel')" prop="channelId" v-if="uiControl.isNGASite && form.paymentType === 'Withdraw' && uiControl !== 'CREATE'">
          <el-select
            filterable
            clearable
            v-model="form.channelId"
            size="small"
            :placeholder="t('fields.withdrawChannel')"
            class="filter-item"
            style="width: 350px;"
            :disabled="uiControl.dialogType === 'ITEM'"
          >
            <el-option
              v-for="item in list.siteWithdrawPlatform"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('fields.channelName')" prop="channelName" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-input v-model="form.channelName" style="width: 240px" placeholder="Please input" size="small" />
        </el-form-item>
        <el-form-item :label="t('fields.eta')" prop="eta" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-input v-model="form.eta" style="width: 240px" placeholder="Please input" size="small" />
        </el-form-item>
        <el-form-item :label="t('fields.sequence')" prop="order" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-input-number v-model="form.order" style="width: 240px" :min="1" size="small" />
        </el-form-item>
        <el-form-item :label="t('fields.privilegeName')" prop="privilegeId1" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-select
            filterable
            clearable
            v-model="form.privilegeId"
            size="small"
            :placeholder="t('fields.privilegeName')"
            class="filter-item"
            style="width: 350px;"
          >
            <el-option
              v-for="item in list.privileges"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fields.icon')" prop="icon" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-row :gutter="24">
            <el-col v-if="form.icon" :span="18" style="width: 250px">
              <el-image
                v-if="form.icon"
                :src="paymentDir + form.icon"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('ICON')"
              >
                {{ $t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('fields.privilege') + $t('fields.icon')" prop="privilegeIcon" v-if="uiControl.dialogType === 'ITEM' || uiControl.dialogType === 'ADD'">
          <el-row :gutter="24">
            <el-col v-if="form.privilegeIcon" :span="18" style="width: 250px">
              <el-image
                v-if="form.privilegeIcon"
                :src="paymentDir + form.privilegeIcon"
                fit="contain"
                class="preview"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                icon="el-icon-search"
                size="mini"
                type="success"
                @click="browseImage('PRIVILEGE')"
              >
                {{ $t('fields.browse') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="uiControl.dialogVisible = false">{{ t('fields.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ t('fields.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="uiControl.imageDialogTitle"
      v-model="uiControl.imageDialogVisible"
      append-to-body
      width="50%"
      :close-on-press-escape="false"
    >
      <div class="search">
        <el-input
          v-model="imageRequest.name"
          size="small"
          style="width: 200px"
          :placeholder="$t('fields.imageName')"
        />
        <el-select
          v-model="imageRequest.siteId"
          size="small"
          :placeholder="$t('fields.site')"
          class="filter-item"
          style="width: 120px; margin-left: 5px"
        >
          <el-option
            v-for="item in list.sites"
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
          @click="loadSiteImage"
        >
          {{ $t('fields.search') }}
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          type="warning"
          @click="resetImageQuery()"
        >
          {{ $t('fields.reset') }}
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
            :src="paymentDir + item.path"
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
            <h3>{{ $t('fields.selectedImage') }}</h3>
          </el-col>
          <el-col :span="20">
            <el-image
              :src="paymentDir + selectedImage.path"
              fit="contain"
              class="smallPreview"
              :preview-src-list="[paymentDir + selectedImage.path]"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ $t('fields.imageSite') }} :</el-col>
          <el-col :span="20">{{ selectedImage.siteName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ $t('fields.imageName') }} :</el-col>
          <el-col :span="20">{{ selectedImage.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{ $t('fields.imageRemark') }} :</el-col>
          <el-col :span="20">{{ selectedImage.remark }}</el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="uiControl.imageSelectionVisible = false">
            {{ $t('fields.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitImage">
            {{ $t('fields.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-card class="box-card" shadow="never" style="margin-top: 40px" v-if="!uiControl.isPRKSite && !uiControl.isNGASite">
      <template #header>
        <div class="clearfix">
          <span class="role-span">{{ t('fields.paymentDisplay') }}</span>
        </div>
      </template>
      <div class="btn-group">
        <el-button
          v-if="setting !== null"
          icon="el-icon-edit"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-deposit-display:update']"
          @click="showSettingEdit('ALL')"
        >
          {{ t('fields.update') }}
        </el-button>
        <el-button
          v-if="setting === null"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-deposit-display:update']"
          @click="showSettingDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
      <el-row>
        <div>
          <el-col
            v-for="item in list.setting"
            :key="item.id"
            style="margin: 10px; width: 230px;"
          >
            <el-card class="box-card" :body-style="{padding: '14px'}" @click="showSettingEdit(item.id)">
              <el-image
                v-if="item.icon === 'OFFLINE1' || item.icon === 'test'"
                :src="paymethodicon + '/000/fff.png&text=payment'"
              />
              <el-image :src="paymentDir + item.icon" fit="contain" class="preview" />
            </el-card>
          </el-col>
        </div>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top: 30px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="t('fields.superiorAffiliatePaymentChannel')" name="superior" />
        <el-tab-pane :label="t('fields.downlineAffiliatePaymentChannel')" name="normal" />
      </el-tabs>
      <div class="btn-group">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          v-permission="['sys:affiliate-deposit-display:add']"
          @click="showDialog('CREATE')"
        >
          {{ t('fields.add') }}
        </el-button>
      </div>
      <el-table
        :data="page.records"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
        style="width: 100%"
        v-if="!uiControl.isNGASite"
      >
        <el-table-column prop="loginName" :label="t('fields.affiliateName')" width="150">
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`/affiliate/details/${scope.row.affiliateId}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentName1" :label="uiControl.payment1Title" v-if="!uiControl.isPRKSite" />
        <el-table-column prop="paymentName2" :label="uiControl.payment2Title" v-if="!uiControl.isPRKSite" />
        <el-table-column prop="paymentName3" :label="uiControl.payment3Title" v-if="!uiControl.isPRKSite" />
        <el-table-column prop="paymentName4" :label="t('fields.riskPaymentChannel')" v-if="!uiControl.isPRKSite" />
        <el-table-column prop="withdrawPlatformName" :label="uiControl.withdraw1Title" />
        <el-table-column prop="withdrawPlatformName2" :label="uiControl.withdraw2Title" v-if="uiControl.isPRKSite" />
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
          <template #default="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="success"
              @click="showEdit(scope.row,'EDIT')"
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
        v-if="!uiControl.isNGASite"
      />
      <el-table
        :data="page.records"
        v-loading="page.loading"
        ref="table"
        row-key="id"
        size="small"
        highlight-current-row
        :empty-text="t('fields.noData')"
        style="width: 100%"
        v-if="uiControl.isNGASite"
      >
        <el-table-column type="expand">
          <template #default="props">
            <el-collapse v-model="activeTabName" accordion style="margin-left: 60px;">
              <el-collapse-item :title="t('fields.payment')" :name="props.row.affiliateCode + 'payment'">
                <div class="clearfix">
                  <el-table :data="props.row.affiliateDepositSettingVO" ref="table" size="small" style="width: 90%;">
                    <el-table-column :label="t('fields.channelName')" prop="channelName" />
                    <el-table-column prop="paymentShow" :label="t('fields.show')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-switch
                          v-model="scope.row.paymentShow"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                          @change="changeChannelShow(scope.row, scope.row.paymentShow)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="recommended" :label="t('fields.recommend')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-switch
                          v-model="scope.row.recommended"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                          @change="changeChannelRecommend(scope.row, scope.row.recommended)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-button
                          icon="el-icon-edit"
                          size="mini"
                          type="success"
                          @click="showEdit(scope.row, 'ITEM')"
                        />
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          type="danger"
                          v-permission="['sys:affiliate-deposit-display:delete']"
                          @click="deletItem(scope.row)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
              <el-collapse-item :title="t('fields.withdrawPlatform')" :name="props.row.affiliateCode + 'withdraw'">
                <div class="clearfix">
                  <el-table :data="props.row.affiliateWithdrawSettingVO" ref="table" size="small" style="width: 90%;">
                    <el-table-column :label="t('fields.channelName')" prop="channelName" />
                    <el-table-column prop="paymentShow" :label="t('fields.show')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-switch
                          v-model="scope.row.paymentShow"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                          @change="changeChannelShow(scope.row, scope.row.paymentShow)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="recommend" :label="t('fields.recommend')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-switch
                          v-model="scope.row.recommend"
                          active-color="#409EFF"
                          inactive-color="#F56C6C"
                          @change="changeChannelRecommend(scope.row, scope.row.recommend)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
                      <template #default="scope">
                        <el-button
                          icon="el-icon-edit"
                          size="mini"
                          type="success"
                          @click="showEdit(scope.row, 'ITEM')"
                        />
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          type="danger"
                          v-permission="['sys:affiliate-deposit-display:delete']"
                          @click="deletItem(scope.row)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column prop="loginName" :label="t('fields.affiliateName')" width="150">
          <template
            #default="scope"
            v-if="hasPermission(['sys:affiliate:detail'])"
          >
            <router-link :to="`/affiliate/details/${scope.row.affiliateId}?site=${scope.row.siteId}`">
              <el-link type="primary">{{ scope.row.loginName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="affiliateCode" :label="t('fields.affiliateCode')" width="150">
          <template #default="scope">
            <span v-if="scope.row.affiliateCode === null">-</span>
            <span v-if="scope.row.affiliateCode !== null">{{ scope.row.affiliateCode }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('fields.action')" v-if="hasPermission(['sys:affiliate-deposit-display:update'])">
          <template #default="scope">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="success"
              @click="showEdit(scope.row,'ADD')"
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
        v-if="uiControl.isNGASite"
      />
    </el-card>
    <el-button
      size="mini"
      type="primary"
      @click="changeToNewUI()"
      v-if="hasPermission(['sys:affiliate-deposit-display:newUI'])"
    >NEW UI</el-button>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { getSiteListSimple } from '../../../api/site'
import {
  getAffiliateDepositDisplayList,
  createAffiliateDepositDisplay,
  updateAffiliateDepositDisplay,
  getAffiliateDepositSetting,
  createAffiliateDepositSetting,
  updateAffiliateDepositSetting,
  getAffiliateBySiteId,
  getAffiliateRecordBySiteId,
  getAffiliatePaymentSettingList,
  createAffiliatePaymentSetting,
  updateAffiliatePaymentSetting,
  createAffiliatePaymentSettingItem,
  deleteAffiliatePaymentSetting
} from '../../../api/affiliate-deposit-display'
import { getAffiliateList } from '../../../api/affiliate-record'
import { getActivePrivilegeInfoBySiteId } from '../../../api/privilege-info'
import { getSiteImage } from '../../../api/site-image'
import { required } from '../../../utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from '../../../store'
import { useI18n } from "vue-i18n";
import { TENANT } from '../../../store/modules/user/action-types'
import { hasPermission } from '../../../utils/util'
import { getPaymentsSimpleBySiteId } from "../../../api/payment-display";
import { getWithdrawPlatformsSimpleBySiteId } from "../../../api/withdraw-platform";
import { getSiteWithdrawPlatform } from "../../../api/site-withdraw-platform";

const { t } = useI18n()
const activeTabName = ref(null)
const store = useStore()
const LOGIN_USER_TYPE = computed(() => store.state.user.userType);
const site = ref(null);
const affiliateFinancialDepositDisplayForm = ref(null)
const affiliateFinancialDepositSettingForm = ref(null)
const setting = ref(null)
const paymentDir = process.env.VUE_APP_IMAGE + '/payment/'
const paymethodicon = process.env.VUE_APP_IMAGE
const activeName = ref('superior')
const uiControl = reactive({
  dialogVisible: false,
  dialogTitle: '',
  dialogType: 'CREATE',
  dialogSettingVisible: false,
  dialogSettingTitle: '',
  dialogSettingType: 'CREATE',
  dialogLoading: false,
  imageDialogVisible: false,
  imageDialogTitle: '',
  imageDialogType: '',
  dialogSetting: '',
  payment1Title: t('fields.paymentChannel') + ' 1',
  payment2Title: t('fields.paymentChannel') + ' 2',
  payment3Title: t('fields.paymentChannel') + ' 3',
  withdraw1Title: t('fields.withdrawChannel'),
  withdraw2Title: t('fields.withdrawChannel'),
  isPRKSite: false,
  isNGASite: false,
})
const request = reactive({
  size: 30,
  current: 1,
  siteId: null,
  affiliateLevel: 'MASTER_AFFILIATE'
})
const list = reactive({
  sites: [],
  paymentInfo: [],
  withdrawPlatform: [],
  siteWithdrawPlatform: [],
  affiliates: [],
  allAffiliates: [],
  allNewAffiliates: [],
  privileges: [],
  setting: [],
})
const page = reactive({
  pages: 1,
  records: [],
  loading: false,
})
const form = reactive({
  id: null,
  affiliateCode: null,
  paymentId1: null,
  paymentId2: null,
  paymentId3: null,
  paymentId4: null,
  affiliateId: null,
  withdrawPlatformId: null,
  withdrawPlatformId2: null,
  loginName: null,
  channelName: null,
  eta: null,
  icon: null,
  privilegeIcon: null,
  privilegeId: null,
  type: null,
  code: null,
  paymentType: null,
  channelId: null,
  order: null,
})
const settingForm = reactive({
  id: null,
  privilegeId1: null,
  privilegeId2: null,
  privilegeId3: null,
  icon1: null,
  icon2: null,
  icon3: null,
  privilegeId: null,
})
const formRules = reactive({
  affiliateId: [required(t('message.validateAffiliateNameRequired'))],
  paymentId1: [required(t('message.validatePaymentNameRequired'))],
  paymentId2: [required(t('message.validatePaymentNameRequired'))],
  paymentId3: [required(t('message.validatePaymentNameRequired'))],
  paymentId4: [required(t('message.validatePaymentNameRequired'))],
  withdrawPlatformId: [required(t('message.validateWithdrawPlatformNameRequired'))],
})
const selectedImage = reactive({
  id: 0,
  name: '',
  siteName: '',
  remark: '',
  path: '',
})
const imageRequest = reactive({
  size: 10,
  current: 1,
  name: null,
  siteId: null,
  category: 'PAYMENT',
})
const imageList = reactive({
  dataList: [],
  pages: 0,
})

async function loadSites() {
  const { data: ret } = await getSiteListSimple()
  list.sites = ret
}

async function loadPayment() {
  const { data: ret } = await getPaymentsSimpleBySiteId(request.siteId)
  list.paymentInfo = ret
}

async function loadWithdrawPlatform() {
  const { data: ret } = await getWithdrawPlatformsSimpleBySiteId(request.siteId);
  list.withdrawPlatform = ret
}

async function loadSiteWithdrawPlatform(siteId) {
  const { data: ret } = await getSiteWithdrawPlatform(siteId);
  list.siteWithdrawPlatform = ret;
  list.siteWithdrawPlatform.forEach(platform => {
    const matchingItem = list.withdrawPlatform.find(item => item.id === platform.withdrawPlatformId);
    if (matchingItem) {
      platform.name = matchingItem.name;
      platform.id = matchingItem.id;
    }
  });
}

async function loadAffiliateDepositDisplay() {
  page.loading = true
  const { data: ret } = uiControl.isNGASite ? await getAffiliatePaymentSettingList(request) : await getAffiliateDepositDisplayList(request)
  page.records = ret.records.filter(item => item.affiliateId !== "9999")
  page.pages = ret.pages
  page.loading = false
}

async function loadAffiliateDepositSetting() {
  list.setting = []
  setting.value = null
  const { data: ret } = await getAffiliateDepositSetting(request)
  if (ret) {
    setting.value = ret
    list.setting.push({ id: 1, privilegeId: setting.value.privilegeId1, icon: setting.value.icon1 })
    list.setting.push({ id: 2, privilegeId: setting.value.privilegeId2, icon: setting.value.icon2 })
    if (!uiControl.isPRKSite) {
      list.setting.push({ id: 3, privilegeId: setting.value.privilegeId3, icon: setting.value.icon3 })
    }
  }
}

async function loadAffiliates() {
  const { data: ret } = await getAffiliateList(request.siteId);
  list.allAffiliates = ret
}

async function loadNewAffiliates() {
  const { data: ret } = uiControl.isNGASite ? await getAffiliateRecordBySiteId(request.siteId) : await getAffiliateBySiteId(request.siteId);
  list.allNewAffiliates = ret
  list.affiliates = list.allNewAffiliates.filter(item => item.affiliateLevel === 'MASTER_AFFILIATE')
}

async function loadPrivilege() {
  const { data: ret } = await getActivePrivilegeInfoBySiteId(request.siteId);
  list.privileges = ret
}

async function loadSiteImage() {
  selectedImage.id = 0
  const { data: ret } = await getSiteImage(imageRequest)
  imageList.list = ret.records
  imageList.pages = ret.pages
}

const handleClick = (tab, event) => {
  switchToList(tab.props.name)
}

async function switchToList(type) {
  if (type !== 'superior') {
    request.affiliateLevel = 'AFFILIATE,SUPER_AFFILIATE,CHIEF_AFFILIATE'
    list.affiliates = list.allNewAffiliates.filter(item => item.affiliateLevel !== 'MASTER_AFFILIATE')
  } else {
    request.affiliateLevel = 'MASTER_AFFILIATE'
    list.affiliates = list.allNewAffiliates.filter(item => item.affiliateLevel === 'MASTER_AFFILIATE')
  }
  await loadAffiliateDepositDisplay()
}

async function browseImage(type) {
  loadSiteImage()
  uiControl.imageDialogTitle = t('fields.icon')
  uiControl.imageDialogType = type
  uiControl.imageDialogVisible = true
}

function selectImage(item) {
  selectedImage.id = item.id
  selectedImage.name = item.name
  selectedImage.siteName = item.siteName
  selectedImage.path = item.path
  selectedImage.remark = item.remark
}

function submitImage() {
  if (uiControl.imageDialogType === 'ICON1') {
    settingForm.icon1 = selectedImage.path
  } else if (uiControl.imageDialogType === 'ICON2') {
    settingForm.icon2 = selectedImage.path
  } else if (uiControl.imageDialogType === 'ICON3') {
    settingForm.icon3 = selectedImage.path
  } else if (uiControl.imageDialogType === 'ICON') {
    form.icon = selectedImage.path
  } else if (uiControl.imageDialogType === 'PRIVILEGE') {
    form.privilegeIcon = selectedImage.path
  }
  uiControl.imageDialogVisible = false
}

function showEdit(data, type) {
  showDialog(type)
  nextTick(() => {
    for (const key in data) {
      if (Object.keys(form).find(k => k === key)) {
        if (data[key] === 0) {
          form[key] = ""
        } else {
          form[key] = data[key]
        }
      }
    }
  })
}

function checkSetting(setting) {
  if (uiControl.dialogSetting === 'ALL') {
    return true
  }
  if (setting === uiControl.dialogSetting) {
    return true
  }
}

function showSettingEdit(mode) {
  showSettingDialog('EDIT')
  nextTick(() => {
    for (const key in setting.value) {
      if (Object.keys(settingForm).find(k => k === key)) {
        settingForm[key] = setting.value[key]
        if (setting.value[key] === 0) {
          settingForm[key] = ""
        }
      }
    }
  })
  if (mode) {
    uiControl.dialogSetting = mode
  }
}

function showDialog(type) {
  if (type === 'CREATE') {
    if (affiliateFinancialDepositDisplayForm.value) {
      affiliateFinancialDepositDisplayForm.value.resetFields()
    }
    form.id = null
    uiControl.dialogTitle = t('fields.addAffiliateFinancialConfig')
  } else if (type === 'EDIT' || type === 'ITEM') {
    uiControl.dialogTitle = t('fields.editAffiliateFinancialConfig')
  } else if (type === 'ADD') {
    uiControl.dialogTitle = t('fields.addAffiliateFinancialConfig')
  }
  uiControl.dialogType = type
  uiControl.dialogVisible = true
}

function showSettingDialog(type) {
  if (type === 'CREATE') {
    uiControl.dialogSetting = 'ALL'
    if (affiliateFinancialDepositSettingForm.value) {
      affiliateFinancialDepositSettingForm.value.resetFields()
    }
    settingForm.id = null
    uiControl.dialogSettingTitle = t('fields.addAffiliateFinancialConfig')
  } else if (type === 'EDIT') {
    uiControl.dialogSettingTitle = t('fields.editAffiliateFinancialConfig')
  }
  uiControl.dialogSettingType = type
  uiControl.dialogSettingVisible = true
}

function deletItem(data) {
  ElMessageBox.confirm(
    t('message.confirmDelete'),
    {
      confirmButtonText: t('fields.confirm'),
      cancelButtonText: t('fields.cancel'),
      type: "warning"
    }
  ).then(async () => {
    await deleteAffiliatePaymentSetting(data)
    await loadAffiliateDepositDisplay()
    ElMessage({ message: t('message.deleteSuccess'), type: "success" });
  }).catch(() => {});
}

function create() {
  affiliateFinancialDepositDisplayForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      if (uiControl.isNGASite) {
        if (uiControl.dialogType === 'ADD') {
          await createAffiliatePaymentSettingItem(form)
        } else {
          await createAffiliatePaymentSetting(form)
        }
      } else {
        await createAffiliateDepositDisplay(form)
      }
      uiControl.dialogVisible = false
      await loadAffiliateDepositDisplay()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
      await loadNewAffiliates()
    }
  })
}

function edit() {
  affiliateFinancialDepositDisplayForm.value.validate(async valid => {
    if (valid) {
      if (uiControl.isPRKSite) {
        form.paymentId1 = 0
        form.paymentId2 = 0
        form.paymentId3 = 0
        form.paymentId4 = 0
      }
      form.siteId = request.siteId
      await updateAffiliateDepositDisplay(form)
      uiControl.dialogVisible = false
      await loadAffiliateDepositDisplay()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function editItem() {
  affiliateFinancialDepositDisplayForm.value.validate(async valid => {
    if (valid) {
      form.siteId = request.siteId
      await updateAffiliatePaymentSetting(form)
      uiControl.dialogVisible = false
      await loadAffiliateDepositDisplay()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

async function changeChannelShow(row, show) {
  row.show = show
  await updateAffiliatePaymentSetting(row)
  await loadAffiliateDepositDisplay()
}

async function changeChannelRecommend(row, recommended) {
  row.recommended = recommended
  await updateAffiliatePaymentSetting(row)
  await loadAffiliateDepositDisplay()
}

function createSetting() {
  affiliateFinancialDepositSettingForm.value.validate(async valid => {
    if (valid) {
      settingForm.siteId = request.siteId
      for (let i = 1; i <= 3; i++) {
        const propertyName = `privilegeId${i}`;
        if (settingForm[propertyName] === "" || settingForm[propertyName] === null) {
          settingForm[propertyName] = 0;
        }
      }
      await createAffiliateDepositSetting(settingForm)
      uiControl.dialogSettingVisible = false
      await loadAffiliateDepositSetting()
      ElMessage({ message: t('message.addSuccess'), type: 'success' })
    }
  })
}

function editSetting() {
  affiliateFinancialDepositSettingForm.value.validate(async valid => {
    if (valid) {
      settingForm.siteId = request.siteId
      for (let i = 1; i <= 3; i++) {
        const propertyName = `privilegeId${i}`;
        if (settingForm[propertyName] === "") {
          settingForm[propertyName] = 0;
        }
      }
      await updateAffiliateDepositSetting(settingForm)
      uiControl.dialogSettingVisible = false
      await loadAffiliateDepositSetting()
      ElMessage({ message: t('message.editSuccess'), type: 'success' })
    }
  })
}

function submit() {
  uiControl.dialogLoading = true
  if (uiControl.dialogType === 'CREATE') {
    create()
  } else if (uiControl.dialogType === 'EDIT') {
    edit()
  } else if (uiControl.dialogType === 'ITEM') {
    editItem()
  } else if (uiControl.dialogType === 'ADD') {
    create()
  }
  uiControl.dialogLoading = false
}

function submitSetting() {
  uiControl.dialogLoading = true
  if (uiControl.dialogSettingType === 'CREATE') {
    createSetting()
  } else if (uiControl.dialogSettingType === 'EDIT') {
    editSetting()
  }
  uiControl.dialogLoading = false
}

function changePage(page) {
  if (request.current >= 1) {
    request.current = page
    loadAffiliateDepositDisplay()
  }
}

async function changeToNewUI() {
  uiControl.isNGASite = true
  uiControl.isPRKSite = false
  await loadAffiliates()
  await loadNewAffiliates()
  await loadPrivilege()
  await loadWithdrawPlatform()
  await loadSiteWithdrawPlatform(request.siteId)
  await loadPayment()
  await loadAffiliateDepositSetting()
  await loadAffiliateDepositDisplay()
}

async function handleChangeSite() {
  if (request.siteId === 11) {
    uiControl.withdraw1Title = t('fields.withdrawChannel') + ' (EASYPAISA)'
    uiControl.withdraw2Title = t('fields.withdrawChannel') + ' (JAZZCASH)'
    form.paymentId1 = 0
    form.paymentId2 = 0
    form.paymentId3 = 0
    form.paymentId4 = 0
    uiControl.isPRKSite = true
    uiControl.isNGASite = false
  // } else if (request.siteId === 14) {
  //   // uiControl.isNGASite = true
  //   // uiControl.isPRKSite = false
  } else {
    form.paymentId1 = null
    form.paymentId2 = null
    form.paymentId3 = null
    form.paymentId4 = null
    uiControl.withdraw1Title = t('fields.withdrawChannel')
    uiControl.isPRKSite = false
    uiControl.isNGASite = false
  }
  await loadAffiliates()
  await loadNewAffiliates()
  await loadPrivilege()
  await loadWithdrawPlatform()
  await loadSiteWithdrawPlatform(request.siteId)
  await loadPayment()
  await loadAffiliateDepositSetting()
  await loadAffiliateDepositDisplay()
}

onMounted(async() => {
  await loadSites()
  if (LOGIN_USER_TYPE.value === TENANT.value) {
    site.value = list.sites.find(s => s.siteName === store.state.user.siteName);
    request.siteId = site.value.id;
  } else {
    site.value = list.sites[0];
    request.siteId = site.value.id;
  }
  handleChangeSite()
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
  margin-bottom: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-right: 18px;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 4px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

:deep(.el-radio__input) {
  display: none !important;
}

:deep(.el-radio.is-bordered.is-checked) {
  background-color: var(--el-color-primary);
}

:deep(.is-checked .el-radio__label) {
  color: white;
}

.el-radio {
  margin-right: 10px;
  margin-bottom: 5px;
}

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 0;
}

.form-border {
  border-color: #dcdfe6;
  border-style: solid;
  border-width: 1px
}

.form-header {
  color: white;
  background-color: var(--el-color-primary);
  padding: 10px;
}

.form-body {
  padding: 10px;
}

.el-icon-caret-top {
  color: red;
}

.el-icon-caret-bottom {
  color: green;
}

.line-break {
  white-space: pre;
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
</style>

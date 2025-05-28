<template>
  <div class="vip-container test-con2">
    <img src="../../assets/logo.png" class="vip-logo" />
    <div class="header-section">
      <img src="../../assets/images/vip/vip-header.png" class="vip-header" />
    </div>
    <!--    <div class="banner-container" />-->
    <div class="outerContainer">
      <div class="innerContainer">
        <div class="vip-cards">
          <Carousel ref="refCarousel" v-model="currentSlide" :items-to-show="2.99" :wrap-around="true">
            <Slide @click="handleSlideClick(vipIndex)" v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
              <div class="carousel__item">
                <div :class="`vipitem vipitem${vip.vipLevel}`">
                  <div class="vipcontents">
                    <div class="badge">
                      <img :src="require(`../../assets/images/vip/level/vip${vip.vipLevel}.png`)" />
                    </div>
                    <div class="description">
                      晋级所需有效流水
                      <!-- <span>
                        {{ formatNumber(vip.upgradeBetAmount) }}
                      </span> -->
                      <div v-show="originalUpgradeBetAmounts.length == 0" class="loading-icon" />
                      <span v-show="originalUpgradeBetAmounts.length != 0">
                        <span v-if="store.token && vipIndex < +vipLevel">已完成</span>
                        <span
                          v-else-if="
                            store.token && vipIndex === +vipLevel && currentBetAmt >= +originalUpgradeBetAmounts[vipIndex]
                          "
                        >
                          待晋级
                        </span>
                        <span v-else>{{ formatNumber(originalUpgradeBetAmounts[vipIndex]) }}</span>
                      </span>
                    </div>
                    <div class="viplevel">
                      <div class="title">
                        <span class="type">{{ vip.vipTitle }} V {{ vip.vipLevel }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slide>
            <template #addons>
              <!-- <Navigation /> -->
              <div>
                <button @click="prev" class="carousel__prev"></button>
                <button @click="next" class="carousel__next"></button>
              </div>
            </template>
          </Carousel>
      </div>
    <div class="current-vip-status" v-if="store.token">
      <div class="vip-progress" :class="{ load: isDataLoaded }">
        <!-- <div class="amount">
          <div class="text" v-if="vipLevel + 1 && currentUpgradeDepAmt && currentUpgradeDepAmt >= currentDepAmt">
            还要
            <div class="required-amount">{{ formatNumber(currentUpgradeDepAmt - currentDepAmt) }}</div>
            存款升级到 VIP {{ vipLevel + 1 }}
          </div>
          <div class="text" v-else-if="vipLevel === 0">需要一笔存款到达 VIP 1</div>
          <div class="text" v-else>
            已到达
            <div class="required-amount">{{ currentUpgradeDepAmt }}</div>
            存款 VIP {{ vipLevel + 1 }}
          </div>
          <div class="progressBarContainer">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vipLevel, 'deposit') + '%' }" />
            </div>
          </div>
        </div> -->
        <!-- <template v-for="(vip, vipIndex) in vipItems" :key="vipIndex">
          <div class="amount" v-if="vipLevel === vip.vipLevel">
            {{ vip }}
            {{ currentBetAmt }}
            <div class="text">

            </div>
          </div>
        </template> -->

        <div class="amount">
          <div v-show="isDataLoaded" v-if="currentBetAmt <= currentUpgradeBetAmt || vipLevel === 12">
            <div
              class="text"
              v-if="vipLevel + 1 && currentUpgradeBetAmt && currentUpgradeBetAmt >= currentBetAmt && vipLevel != 12"
            >
              还需
              <div class="required-amount">{{ formatNumber(currentUpgradeBetAmt - currentBetAmt) || 0 }}</div>
              有效投注晋升到 VIP {{ vipLevel + 1 }}
            </div>

            <!-- <div class="text" v-else-if="vipLevel === 0">
                还需
                <div class="required-amount">
                  {{
                    currentBetAmt > originalUpgradeBetAmounts[0]
                      ? formatNumber(originalUpgradeBetAmounts[0] - currentBetAmt)
                      : formatNumber(originalUpgradeBetAmounts[0])
                  }}
                </div>
                有效投注晋升到 VIP 1
              </div> -->

            <div class="text" v-else-if="vipLevel === 12">您已达到或超越最高 VIP 等级所需的有效流水</div>
            <div class="text" v-else>
              已到达
              <div class="required-amount">{{ currentUpgradeBetAmt }}</div>
              有效流水 VIP {{ vipLevel + 1 }}
            </div>
          </div>

          <div class="text" v-show="isDataLoaded" v-else>已到达有效流水 VIP {{ vipLevel + 1 }}</div>
          <div class="text" v-show="!isDataLoaded">正在为您计算有效投注</div>

          <div v-show="isDataLoaded" class="progressBarContainer" v-if="vipLevel != 0 && vipLevel != 12">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" :style="{ width: getVipLevelProgress(vipLevel, 'bet') + '%' }"></div>
            </div>
            <div class="progressBarDescription">
              {{
                currentBetAmt <= currentUpgradeBetAmt
                  ? `${currentBetAmt}/${currentUpgradeBetAmt}`
                  : `${currentUpgradeBetAmt}/${currentUpgradeBetAmt}`
              }}
            </div>
          </div>

          <div v-show="isDataLoaded" class="progressBarContainer" v-if="vipLevel === 0 || vipLevel === 12">
            <div class="progressBarOuterBar">
              <div
                class="progressBarInnerBar"
                :style="{
                  width: vipLevel === 12 ? '100%' : vipLevel === 0 ? getVipLevelProgress(vipLevel, 'bet') + '%' : null
                }"
              ></div>
            </div>
            <div class="progressBarDescription" v-if="vipLevel == 0">
              {{
                currentBetAmt <= originalUpgradeBetAmounts[0]
                  ? `${currentBetAmt}/${originalUpgradeBetAmounts[0]}`
                  : `${originalUpgradeBetAmounts[0]}/${originalUpgradeBetAmounts[0]}`
              }}
            </div>
            <div class="progressBarDescription" v-if="vipLevel == 12">
              {{ originalUpgradeBetAmounts[11] + "/" + originalUpgradeBetAmounts[11] }}
            </div>
          </div>
          <div class="progressBarContainer" v-show="!isDataLoaded">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" style="width: 0%"></div>
            </div>
            <div class="progressBarDescription" style="font-size: 12px">计算中...</div>
          </div>
        </div>
        <div class="amount" v-show="isDataLoaded && vipLevel !== 0">
          <div class="text">
            保级剩余天数：
            <span class="required-amount">{{ balanceRetainDay }}</span>
            天
          </div>
          <div class="progressBarContainer">
            <div class="progressBarOuterBar">
              <div class="progressBarInnerBar" :style="{ width: retainPercentage + '%' }"></div>
            </div>
            <div class="progressBarDescriptionRetain">
              {{ currentRetainAmount + "/" + retainAmountRequired }}
            </div>
          </div>
        </div>
      </div>
      <div class="badge" v-show="isDataLoaded">
        <img :src="badgeSrc" />
      </div>
      <div class="badge" v-show="!isDataLoaded" style="width: 50px; height: 50px;"></div>
      
      <!-- <div
        class="claim-btn"
        :class="{ disabled: isLoading['all'] || !isDataLoaded }"
        @click="handleClick('all', vipLevel)"
      >
        {{ isLoading["all"] ? "领取中" : "一键领取" }}
      </div> -->
    </div>

    <div class="tips">
      等级晋升后开启 90 天保级期，保级期内完成有效投注要求则保级成功，未完成则降一级。
      <div @click="isShowTable = !isShowTable" class="linktotable">查看升保级明细</div>
    </div>
    </div>
    </div>
    <div class="outerContainer">
      <div class="innerContainer">
        <div class="month-birthday-bonus">
          <div class="left">
            <!-- <img class="abs" src="../../assets/images/vip/img-border.png" style="pointer-events: none" /> -->
            <div class="inner-slide">
              <Carousel v-model="currentCarousel" :items-to-show="1">
                <Slide v-for="(item, i) in banners" :key="i">
                  <a style="display: block" target="_blank" @click="handleBannerClick(item.redirectUrl)">
                    <img :src="imgURL + item.mobileImageUrl" />
                  </a>
                </Slide>
                <template #addons>
                  <Pagination />
                </template>
              </Carousel>
            </div>
          </div>
          <div class="right">
            <div class="vip-boxes">
              <Carousel v-model="currentBoxes" :items-to-show="1" :wrapAround="false">
                <Slide v-for="(categoryPair, slideIndex) in categoryPairs" :key="slideIndex" class="px-2">
                  <template v-for="category in categoryPair" :key="category.key">
                    <template v-for="(item, index) in vipItems" :key="index">
                      <template v-if="category.key !== 'birthday' || (index !== 0 && index !== 1 && index !== 2)">
                        <template
                          v-if="
                            store.token && isFirstTime && vipLevel !== 0
                              ? +item.vipLevel === currentSlide
                              : +item.vipLevel === currentSlide + 1
                          "
                        >
                          <div
                            class="box"
                            :class="{
                              inactive:
                                (store.token && item[`${category.key}Prize`] === '0') ||
                                item[`${category.key}Prize`] === 0 ||
                                item[`${category.key}Prize`] === 'null'
                            }"
                          >
                            <div class="vip-inner">
                              <div class="box-det">
                                <div class="icon">
                                  <img
                                    :src="
                                      require(`../../assets/images/vip/${category.image}${
                                        (store.token && item[`${category.key}Prize`] === '0') ||
                                        item[`${category.key}Prize`] === 0 ||
                                        item[`${category.key}Prize`] === 'null'
                                          ? '-inactive'
                                          : ''
                                      }.png`)
                                    "
                                  />
                                </div>
                                <div>
                                  <div class="item-amt" v-show="isDataLoaded">
                                    {{ item[`${category.key}Prize`] ? item[`${category.key}Prize`] : 0 }}
                                  </div>
                                  <div class="loading-blue-icon" v-show="!isDataLoaded"></div>
                                  <div class="item-name">{{ category.displayName }}</div>
                                  <!-- <div class="item-amt">
                                    {{ item[`${category.key}Prize`] ? item[`${category.key}Prize`] : 0 }}
                                  </div> -->
                                </div>
                              </div>
                            </div>
                            <template
                              v-if="
                                item.redPacketClaimStatus === 'CANT_CLAIM' &&
                                category.key === 'redPacket' &&
                                +item.vipLevel === vipLevel
                              "
                            >
                              <div class="claim-now disabled">
                                {{ formatNumber(currentRedPacketAmount, "redPacket") }}
                              </div>
                            </template>
                            <template v-if="item[`${category.key}ClaimStatus`] === 'CAN_CLAIM'">
                              <div
                                class="claim-now"
                                :class="{ disabled: isLoading[category.key] }"
                                @click="handleClick(category.key, item)"
                              >
                                {{
                                  !isLoading[category.key]
                                    ? category.key === "redPacket"
                                      ? currentRedPacketAmount !== 0 && +item.vipLevel === vipLevel
                                        ? formatNumber(currentRedPacketAmount, "redPacket")
                                        : "立即领取"
                                      : "立即领取"
                                    : "领取中"
                                }}
                              </div>
                            </template>
                            <template v-else-if="item[`${category.key}ClaimStatus`] === 'CLAIMED'">
                              <div class="claimed">已领取</div>
                            </template>
                            <template v-else-if="item[`${category.key}ClaimStatus`] === 'EXPIRED'">
                              <div class="expired">已过期</div>
                            </template>
                          </div>
                        </template>
                      </template>
                    </template>
                  </template>
                </Slide>
                <template #addons>
                  <Pagination />
                </template>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="outerContainer">
      <div class="innerContainer">
        <div class="vip-benefit-section-title">
          <div class="heading">
            <div class="headingtext">
              <!-- VIP 特权说明 -->
              <img src="../../assets/images/vip/vip-tqsm.png">
            </div>
          </div>
        </div>
        <div class="tabs">
          <div class="tab" :class="{active: tabActive == 1}" @click="tabActive = 1">
            <div class="tabtext">
              <!-- VIP权益 -->
              <img :src="require(`../../assets/images/vip/vip-qy${tabActive == 1 ? '-active' : ''}.png`)" @click="tabActive = 1" />
            </div>
            <!-- <img :src="require(`../assets/vip/vip-benefit${tabActive == 1 ? '-active' : ''}.png`)" @click="tabActive = 1" /> -->
          </div>
          <div class="tab" :class="{active: tabActive == 2}" @click="tabActive = 2">
            <div class="tabtext">
              <!-- VIP返水 -->
              <img :src="require(`../../assets/images/vip/vip-fs${tabActive == 2 ? '-active' : ''}.png`)" @click="tabActive = 2" />
            </div>
            <!-- <img :src="require(`../assets/vip/vip-rebate${tabActive == 2 ? '-active' : ''}.png`)" @click="tabActive = 2" /> -->
          </div>
        </div>
        <div v-if="benefitActive" class="instructions">
          <table border="0" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>
                  VIP
                  <br />
                  等级
                </th>
                <!-- <th>会员等级</th> -->
                <th>首次保级彩金</th>
                <th>年度保级彩金</th>
                <th>
                  生日
                  <br />
                  彩金
                </th>
                <!--            <th>节日礼金</th>-->
                <th>每日额外返水红包</th>
                <th>
                  每月 15 号
                  <br />
                  红包
                </th>
                <th>充值加赠20% 奖金</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VIP1</td>
                <!-- <td>青铜 II</td> -->
                <td>18 元</td>
                <td>208</td>
                <td>-</td>
                <!--            <td>-</td>-->
                <td>0.1%</td>
                <td>8</td>
                <td>38</td>
              </tr>
              <tr>
                <td>VIP2</td>
                <!-- <td>青铜 I</td> -->
                <td>18 元</td>
                <td>208</td>
                <td>-</td>
                <!--            <td>-</td>-->
                <td>0.2%</td>
                <td>18</td>
                <td>88</td>
              </tr>
              <tr>
                <td>VIP3</td>
                <!-- <td>白银 III</td> -->
                <td>58 元</td>
                <td>588</td>
                <td>-</td>
                <!--            <td>-</td>-->
                <td>0.3%</td>
                <td>28</td>
                <td>158</td>
              </tr>
              <tr>
                <td>VIP4</td>
                <!-- <td>白银 II</td> -->
                <td>58 元</td>
                <td>588</td>
                <td>38</td>
                <!--            <td>-</td>-->
                <td>0.5%</td>
                <td>58</td>
                <td>288</td>
              </tr>
              <tr>
                <td>VIP5</td>
                <!-- <td>白银 I</td> -->
                <td>58 元</td>
                <td>588</td>
                <td>58</td>
                <!--            <td>-</td>-->
                <td>0.6%</td>
                <td>88</td>
                <td>388</td>
              </tr>
              <tr>
                <td>VIP6</td>
                <!-- <td>黄金 III</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>88</td>
                <!--            <td>-</td>-->
                <td>0.8%</td>
                <td>128</td>
                <td>488</td>
              </tr>
              <tr>
                <td>VIP7</td>
                <!-- <td>黄金 II</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>188</td>
                <!--            <td>-</td>-->
                <td>1.0%</td>
                <td>208</td>
                <td>588</td>
              </tr>
              <tr>
                <td>VIP8</td>
                <!-- <td>黄金 I</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>288</td>
                <!--            <td>188</td>-->
                <td>1.2%</td>
                <td>388</td>
                <td>688</td>
              </tr>
              <tr>
                <td>VIP9</td>
                <!-- <td>铂金 II</td> -->
                <td>588 元</td>
                <td>1,888</td>
                <td>388</td>
                <!--            <td>288</td>-->
                <td>1.3%</td>
                <td>588</td>
                <td>788</td>
              </tr>
              <tr>
                <td>VIP10</td>
                <!-- <td>铂金 I</td> -->
                <td>588 元</td>
                <td>1,888</td>
                <td>588</td>
                <!--            <td>388</td>-->
                <td>1.5%</td>
                <td>888</td>
                <td>888</td>
              </tr>

            </tbody>
          </table>
        </div>
        <div v-if="rebateActive" class="instructions">
          <table border="0" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>VIP 等级</th>
                <th>电竞</th>
                <th>体育</th>
                <th>真人</th>
                <th>棋牌</th>
                <th>电子</th>
                <!--            <th>捕鱼</th>-->
                <th>返水上限</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VIP0</td>
                <td>0.45%</td>
                <td>0.40%</td>
                <td>0.40%</td>
                <td>0.40%</td>
                <td>0.60%</td>
                <!-- <td>0.15%</td> -->
                <td>8,888</td>
              </tr>
              <tr>
                <td>VIP1</td>
                <td>0.45%</td>
                <td>0.40%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.60%</td>
                <!--            <td>0.2%</td>-->
                <td>8,888</td>
              </tr>
              <tr>
                <td>VIP2</td>
                <td>0.45%</td>
                <td>0.40%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.60%</td>
                <!--            <td>0.2%</td>-->
                <td>8,888</td>
              </tr>
              <tr>
                <td>VIP3</td>
                <td>0.48%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.60%</td>
                <!--            <td>0.25%</td>-->
                <td>12,888</td>
              </tr>
              <tr>
                <td>VIP4</td>
                <td>0.48%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.50%</td>
                <td>0.80%</td>
                <!--            <td>0.30%</td>-->
                <td>18,888</td>
              </tr>
              <tr>
                <td>VIP5</td>
                <td>0.48%</td>
                <td>0.50%</td>
                <td>0.48%</td>
                <td>0.55%</td>
                <td>0.80%</td>
                <!--            <td>0.30%</td>-->
                <td>18,888</td>
              </tr>
              <tr>
                <td>VIP6</td>
                <td>0.50%</td>
                <td>0.50%</td>
                <td>0.50%</td>
                <td>0.60%</td>
                <td>0.80%</td>
                <!--            <td>0.35%</td>-->
                <td>28,888</td>
              </tr>
              <tr>
                <td>VIP7</td>
                <td>0.50%</td>
                <td>0.55%</td>
                <td>0.55%</td>
                <td>0.70%</td>
                <td>0.85%</td>
                <!--            <td>0.35%</td>-->
                <td>28,888</td>
              </tr>
              <tr>
                <td>VIP8</td>
                <td>0.55%</td>
                <td>0.60%</td>
                <td>0.65%</td>
                <td>0.80%</td>
                <td>0.90%</td>
                <!--            <td>0.35%</td>-->
                <td>38,888</td>
              </tr>
              <tr>
                <td>VIP9</td>
                <td>0.55%</td>
                <td>0.65%</td>
                <td>0.68%</td>
                <td>0.90%</td>
                <td>1.00%</td>
                <!--            <td>0.40%</td>-->
                <td>58,888</td>
              </tr>
              <tr>
                <td>VIP10</td>
                <td>0.60%</td>
                <td>0.70%</td>
                <td>0.70%</td>
                <td>1.00%</td>
                <td>1.05%</td>
                <!--            <td>0.40%</td>-->
                <td>88,888</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="outerContainer">
      <div class="innerContainer">
        
    <div class="terms-conditions">
      <!-- <div class="section-title">规则与条款</div> -->
      <div class="heading">
        <div class="headingtext">
          <!-- 规则与条款 -->
          <img src="../../assets/images/vip/vip-gzytk.png">
        </div>
      </div>
      <!-- <img
        class="terms-conditions-title-separator"
        :src="require('../assets/vip/terms-condition-title-separator.png')"
      /> -->
      <!-- <ol class="terms">
        <li v-for="(term, i) in currentDisplayTerms" :key="i" class="term">
          {{ term.text }}
        </li>
      </ol> -->
      <!-- <h2>一。会员晋级/保级/降级规则</h2>
      <ol class="terms got-bullets">
        <li>完成等级要求的累计有效流水后系统于次日北京时间早上 10 点自动更新，具体完成时间以系统为准，请耐心等待；</li>
        <li>VIP 等级达到相应的要求可每天晋升一级，但 VIP 等级不可越级晋升；</li>
        <li>会员在达到某 VIP 等级后，90 天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</li>
        <li>
          假设会员在一个季度（90 天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；
        </li>
        <li>每个级别的升级礼金每位会员仅能获得 1 次（升级礼金 1 倍流水即可提款）；</li>
      </ol>

      <h2>二。生日礼金</h2>
      <ol class="terms">
        <li>
          生日符合资格的会员，每年生日当天及当天后 7 日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金 1 倍流水即可提款；
        </li>
      </ol>

      <h2>三。首次保级彩金</h2>
      <ol class="terms">
        <li>会员在 90 天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金 1 倍流水即可提款。</li>
      </ol>

      <h2>四。年度保级彩金</h2>
      <ol class="terms">
        <li>首次保级成功后计算会员 12 个月内未降级（可晋级），彩金于第 13 个月首日进行派发；彩金 1 倍流水即可提款</li>
      </ol>

      <h2>五。每日额外返水红包</h2>
      <ol class="terms">
        <li>
          统计每日返水金额，对应 VIP 等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至 10 元即可领取（不足 10 元则不可领取），彩金 1 倍流水即可提款。
          <br />
          例：VIP12 会员当日的返水金额为 1000 元，则按照 VIP12 每日额外返水红包赠送比例 2.0% 计算：1000*2.0%=20 元，返水红包为 20 元，会员可在页面上点击领取。
        </li>
      </ol>

      <h2>六。每月 15 号红包</h2>
      <ol class="terms">
        <li>
          会员日为每月 15 号 00:00 起：东赢会员在上个月有任意一笔有效存款，即可在会员日 15 号 00:00 至 21 号 23:59 期间领取对应等级的会员日礼金（以领取时的等级为准）会员礼金仅需三倍流水即可出款，过期未领者则视为主动放弃：
        </li>
      </ol>

      <h2>七。充值加赠20% 奖金</h2>
      <ol class="terms got-bullets">
        <li class="numbered">
          VIP1及以上会员在会员日当天至21号23:59可登录VIP活动页面领取专属充值加码券且加码券需在15日内在充值页面进行勾选优惠使用，成功使用后需要（本金+彩金）x8倍流水即可提款；
        </li>
        <li class="numbered">加码券使用当日不可与其他存款优惠共享。</li>
      </ol> -->
      <ol class="terms got-gold-bullets">
        <li class="wbg"><h2>会员晋级/保级/降级规则</h2></li>
        
        <ol class="terms got-bullets">
          <li>完成等级要求的累计有效流水后系统于次日北京时间早上 10 点自动更新，具体完成时间以系统为准，请耐心等待；</li>
          <li>VIP 等级达到相应的要求可每天晋升一级，但 VIP 等级不可越级晋升；</li>
          <li>会员在达到某 VIP 等级后，90 天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</li>
          <li>假设会员在一个季度（90 天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；</li>
          <li>每个级别的升级礼金每位会员仅能获得 1 次（升级礼金 1 倍流水即可提款）；</li>
        </ol>
        <li class="wbg"><h2>生日礼金</h2></li>
        <ol class="terms">
          <li>生日符合资格的会员，每年生日当天及当天后 7 日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金 1 倍流水即可提款；</li>
        </ol>
        
        <li class="wbg"><h2>首次保级彩金</h2></li>
        <ol class="terms">
          <li>会员在 90 天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金 1 倍流水即可提款。</li>
        </ol>

        <li class="wbg"><h2>年度保级彩金</h2></li>
        <ol class="terms">
          <li>首次保级成功后计算会员 12 个月内未降级（可晋级），彩金于第 13 个月首日进行派发；彩金 1 倍流水即可提款</li>
        </ol>

        <li class="wbg"><h2>每日额外返水红包</h2></li>
        <ol class="terms">
          <li>统计每日返水金额，对应 VIP 等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至 10 元即可领取（不足 10 元则不可领取），彩金 1 倍流水即可提款。<br>例：VIP12 会员当日的返水金额为 1000 元，则按照 VIP12 每日额外返水红包赠送比例 2.0% 计算：1000*2.0%=20 元，返水红包为 20 元，会员可在页面上点击领取。</li>
        </ol>
        
        <li class="wbg"><h2>每月 15 号红包</h2></li>
        <ol class="terms">
          <li>会员日为每月 15 号 00:00 起：东赢会员在上个月有任意一笔有效存款，即可在会员日 15 号 00:00 至 21 号 23:59 期间领取对应等级的会员日礼金（以领取时的等级为准）会员礼金仅需三倍流水即可出款，过期未领者则视为主动放弃：</li>
        </ol>
        
        <li class="wbg"><h2>充值加赠20%奖金</h2></li>
        <ol class="terms got-bullets">
        <li>VIP1及以上会员在会员日当天至21号23:59可登录VIP活动页面领取专属充值加码券且加码券需在15日内在充值页面进行勾选优惠使用，成功使用后需要（本金+彩金）x8倍流水即可提款；</li>
        <li>加码券使用当日不可与其他存款优惠共享。</li>
      </ol>
        
      </ol>

      <!--      <h2>八。节日礼金</h2>-->
      <!--      <ol class="terms">-->
      <!--        <li class="numbered">-->
      <!--          每年特殊重大节日，等级≥VIP8 的会员可在节日当天通过在线客服申请礼金，逾期不补；礼金 1 倍流水即可提款，具体节日礼金派发时间，请以客服站内信通知为准；-->
      <!--        </li>-->
      <!--      </ol>-->

      <!-- <div class="section-title" @click="toggleAccordion">一般规则</div>
       -->
      <div class="heading"  @click="toggleAccordion">
        <div class="headingtext">
          <!-- 一般规则 -->
          
          <img src="../../assets/images/vip/vip-ybgz.png">
        </div>
      </div>
      <button class="accordion" @click="toggleAccordion">
        {{ isOpenTerms ? "收起详细规则" : "查看详细规则" }}
      </button>
      <div v-if="isOpenTerms" class="panel">
        <ol class="terms got-bullets">
          <li class="numbered">
            有效流水仅计算在游戏中产生输赢结果的注单，香港盘&lt;0.7（中国盘&lt;0.7）、欧洲盘&lt;1.7、美国盘 -143、印尼盘 -1.42、马来盘&lt;0.7 且&gt;0，负赔率&gt;-0.7 且＜0、走水、注单取消、对冲、未结算、连串过关、平半盘、提前结算不计算为有效流水；
          </li>
          <li class="numbered">
            根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；
          </li>
          <li class="numbered">
            此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；
          </li>
          <li class="numbered">为避免文字理解差异，雷火电竞保留此活动最终解释权；</li>
        </ol>
      </div>
    </div>
      </div>
    </div>

    <GameModal ref="gameModalRef" />
  </div>
  <q-dialog class="newTable" v-model="isShowTable">
    <!-- <table border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th class="dy-vip-th">等级</th>
              <th class="dy-vip-th">VIP1</th>
              <th class="dy-vip-th">VIP2</th>
              <th class="dy-vip-th">VIP3</th>
              <th class="dy-vip-th">VIP4</th>
              <th class="dy-vip-th">VIP5</th>
              <th class="dy-vip-th">VIP6</th>
              <th class="dy-vip-th">VIP7</th>
              <th class="dy-vip-th">VIP8</th>
              <th class="dy-vip-th">VIP9</th>
              <th class="dy-vip-th">VIP10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>电竞返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>体育返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>真人返水</td>
              <td>0.4%</td>
              <td>0.4%</td>
              <td>0.45%</td>
              <td>0.45%</td>
              <td>0.5%</td>
              <td>0.55%</td>
              <td>0.65%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1%</td>
            </tr>
            <tr>
              <td>电子返水</td>
              <td>0.5%</td>
              <td>0.6%</td>
              <td>0.7%</td>
              <td>0.8%</td>
              <td>0.9%</td>
              <td>1.2%</td>
              <td>1.5%</td>
              <td>1.8%</td>
              <td>1.9%</td>
              <td>2%</td>
            </tr>
          </tbody>
        </table> -->
    <table border="0" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th style="background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%); color: #000000;">VIP 等级</th>
          <th style="background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%); color: #000000;">升级条件（流水）</th>
          <th style="background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%); color: #000000;">保级条件流水（90 天）</th>
          <th style="background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%); color: #000000;">晋级彩金</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>VIP 1</td>
          <td>3,000</td>
          <td>500</td>
          <td>18</td>
        </tr>
        <tr>
          <td>VIP 2</td>
          <td>10,000</td>
          <td>2,000</td>
          <td>28</td>
        </tr>
        <tr>
          <td>VIP 3</td>
          <td>50,000</td>
          <td>10,000</td>
          <td>38</td>
        </tr>
        <tr>
          <td>VIP 4</td>
          <td>240,000</td>
          <td>30,000</td>
          <td>58</td>
        </tr>
        <tr>
          <td>VIP 5</td>
          <td>1,000,000</td>
          <td>50,000</td>
          <td>88</td>
        </tr>
        <tr>
          <td>VIP 6</td>
          <td>5,000,000</td>
          <td>100,000</td>
          <td>188</td>
        </tr>
        <tr>
          <td>VIP 7</td>
          <td>7,500,000</td>
          <td>300,000</td>
          <td>288</td>
        </tr>
        <tr>
          <td>VIP 8</td>
          <td>10,000,000</td>
          <td>1,000,000</td>
          <td>588</td>
        </tr>
        <tr>
          <td>VIP 9</td>
          <td>15,000,000</td>
          <td>3,000,000</td>
          <td>888</td>
        </tr>
        <tr>
          <td>VIP 10</td>
          <td>25,000,000</td>
          <td>10,000,000</td>
          <td>1,888</td>
        </tr>
      </tbody>
    </table>
  </q-dialog>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { eventapi } from "boot/axios";
import { useQuasar } from "quasar";
import Swal from "sweetalert2";

export default defineComponent({
  name: "TransitRecordView",
  setup() {
    const $q = useQuasar();
    const tab = ref("special");

    const slide = ref(0);
    const showRebate = ref(false);

    const router = useRouter();
    const store = userStore();
    const vipLevel = ref("");
    const loading = ref(false);
    const loadingMClaim = ref(false);
    const loadingBClaim = ref(false);

    const isBeforeCheckBonus = ref(true);
    const isBeforeCheckBirthday = ref(true);

    const isClaimedBonus = ref(false);
    const isClaimedBirthday = ref(false);

    const btnIsDisabled = ref(false);

    const errorCount = ref(0);
    let countdownInterval;

    const onVIPButtonClick = (type) => {
      // Check if the button is already disabled
      if (localStorage.getItem("vipButtonDisabled") === "true") {
        const currentTime = new Date().getTime();
        const expirationTime = parseInt(localStorage.getItem("vipButtonExpirationTime"), 10);

        // Check if the expiration time has passed
        if (currentTime < expirationTime) {
          return; // Exit the function if the button is still disabled
        } else {
          localStorage.removeItem("vipButtonDisabled");
          localStorage.removeItem("vipButtonExpirationTime");
          clearInterval(countdownInterval);
        }
      }

      if (!store.token) {
        Swal.fire({
          title: "请登录后再操作",
          text: "系统提示",
          confirmButtonText: "登录"
        }).then((dialog) => {
          if (dialog.isConfirmed) {
            router.push({ path: "/login" });
          }
        });
      } else {
        const bonusItem = `dy2-vip-${type}`;
        eventapi
          .put("/bonus/claim/" + bonusItem)
          .then((res) => {
            // console.log(res);
            if (res.code === 0) {
              Swal.fire({
                title: "系统提示",
                text: `您已成功领取 ${res.data}`,
                confirmButtonText: "确认"
              }).then((dialog) => {
                // if (dialog.isConfirmed) {
                //   router.push({path: "/finance/deposit"});
                // }
              });
            }
          })
          .catch((err) => {
            errorCount.value++;
            if (errorCount.value >= 3) {
              // Disable the button after 3 or more errors
              btnIsDisabled.value = true;
              const currentTime = new Date().getTime();
              const expirationTime = currentTime + 10000; // 10 secs in milliseconds

              localStorage.setItem("vipButtonDisabled", "true");
              localStorage.setItem("vipButtonExpirationTime", expirationTime.toString());
              // Start the countdown
              startCountdown(expirationTime);
              Swal.fire({
                title: "系统提示",
                text: `${err.message}`,
                confirmButtonText: "确认"
              });
            }
          });
      }
    };

    // Function to start the countdown
    const startCountdown = (expirationTime) => {
      countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const remainingTime = expirationTime - currentTime;

        if (remainingTime > 0) {
          const seconds = Math.floor(remainingTime / 1000) % 60;
          if (seconds === 0) {
            btnIsDisabled.value = false;
            errorCount.value = 0;
          }
        } else {
          clearInterval(countdownInterval); // Clear the countdown interval
          // Remove the stored disabled state and expiration time
          localStorage.removeItem("vipButtonDisabled");
          localStorage.removeItem("vipButtonExpirationTime");
        }
      }, 1000);
    };

    // Check if the button should be initially disabled after a page refresh
    if (localStorage.getItem("vipButtonDisabled") === "true") {
      const currentTime = new Date().getTime();
      const expirationTime = parseInt(localStorage.getItem("vipButtonExpirationTime"), 10);

      // Check if the expiration time has passed
      if (currentTime < expirationTime) {
        // Disable the button
        btnIsDisabled.value = true;
        // Start the countdown
        startCountdown(expirationTime);
      } else {
        // Remove the stored disabled state and expiration time
        localStorage.removeItem("vipButtonDisabled");
        localStorage.removeItem("vipButtonExpirationTime");
      }
    }

    const columns = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel"
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7"
      },
      {
        title: "VIP 8",
        dataIndex: "vip8",
        key: "vip8"
      },
      {
        title: "VIP 9",
        dataIndex: "vip9",
        key: "vip9"
      },
      {
        title: "VIP 10",
        dataIndex: "vip10",
        key: "vip10"
      },
      {
        title: "VIP 11",
        dataIndex: "vip11",
        key: "vip11"
      },
      {
        title: "VIP 12",
        dataIndex: "vip12",
        key: "vip12"
      }
    ];
    const data = [
      {
        key: "1",
        vipLevel: "Slots Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.50%",
        vip5: "0.60%",
        vip6: "0.80%",
        vip7: "1.00%"
      },
      {
        key: "2",
        vipLevel: "Fishing Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "3",
        vipLevel: "Live Casino Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "4",
        vipLevel: "Poker Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.45%",
        vip5: "0.50%",
        vip6: "0.60%",
        vip7: "0.80%"
      },
      {
        key: "5",
        vipLevel: "Sports/Esports Rebate",
        vip1: "0.20%",
        vip2: "0.30%",
        vip3: "0.35%",
        vip4: "0.40%",
        vip5: "0.45%",
        vip6: "0.55%",
        vip7: "0.65%"
      },
      {
        key: "6",
        vipLevel: "Lottery Rebate",
        vip1: "0.30%",
        vip2: "0.35%",
        vip3: "0.40%",
        vip4: "0.40%",
        vip5: "0.50%",
        vip6: "0.50%",
        vip7: "0.60%"
      }
    ];
    const promoExclusive = [
      {
        title: "VIP Level",
        dataIndex: "vipLevel",
        key: "vipLevel",
        render: (text) => String(text)
      },
      {
        title: "VIP 1",
        dataIndex: "vip1",
        key: "vip1"
      },
      {
        title: "VIP 2",
        dataIndex: "vip2",
        key: "vip2"
      },
      {
        title: "VIP 3",
        dataIndex: "vip3",
        key: "vip3"
      },
      {
        title: "VIP 4",
        dataIndex: "vip4",
        key: "vip4"
      },
      {
        title: "VIP 5",
        dataIndex: "vip5",
        key: "vip5"
      },
      {
        title: "VIP 6",
        dataIndex: "vip6",
        key: "vip6"
      },
      {
        title: "VIP 7",
        dataIndex: "vip7",
        key: "vip7",
        render: (text) => String(text)
      }
    ];
    const dataExclusive = [
      {
        key: "1",
        vipLevel: "Withdrawal Funds",
        vip1: "500,000/Day",
        vip2: "500,000/Day",
        vip3: "500,000/Day",
        vip4: "1,000,000/Day",
        vip5: "1,000,000/Day",
        vip6: "1,000,000/Day",
        vip7: "2,000,000.00/Day"
      },
      {
        key: "2",
        vipLevel: "Bet Limit",
        vip1: "Standard",
        vip2: "Standard",
        vip3: "Standard",
        vip4: "Standard",
        vip5: "High Limit",
        vip6: "High Limit",
        vip7: "High Limit"
      },
      {
        key: "3",
        vipLevel: "Priority Payment Method",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "✔",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "4",
        vipLevel: "24/7 VIP Customer Care Team",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "✔",
        vip7: "✔"
      },
      {
        key: "5",
        vipLevel: "Invitation to Exclusive Events",
        vip1: "",
        vip2: "",
        vip3: "",
        vip4: "",
        vip5: "",
        vip6: "",
        vip7: "✔"
      }
    ];
    const terms = [
      {
        text: `The program applies to VIP members with valid accounts. The VIP upgrade is based on the member's total accumulated deposit amount, the daily total successful deposit amount is calculate from 00:00:01 to 23:59:59  (GMT+8)`
      },
      {
        text: `The system will automatically upgrade VIP level after 00:00:00 (GMT+8) of the next day, the VIP level only can upgrade one level a day if the member's  total
deposit amount is eligible for the corresponding VIP level.`
      },
      {
        text: `The Free bonus, rebates and promotins benefits level corresponding to the VIP level will be updated as soon as the member's account is updated in the
next day.`
      },
      {
        text: `Birthday bonus:the bonus need to be claim on VIP page by member self on the birthday day and overdue void, Members who celebrate their birthday less
than 90 days from registration day will not receive this year's birthday bonus, Only members who have registered for more than 90 days can receive it, once
a year. (Birthday bonus can be withdrawal after 1x turnover)`
      },
      {
        text: `Monthly bonus:the bonus need to be claim on VIP page by member self after the member have upgraded to a new level in the next day, Each member can
claim 1 monthly bonus in upgrade month.(Monthly bonus can be withdrawal after 3x turnover)`
      },
      {
        text: `All draw bets, CANCEL bets, 2 sided bets, bets on Europe Handicap under 1.75, Asian Handicap under 0.75, Number Games, Fantasy Sports, Progressive RNG
Jackpots, Progressive RNG Slot will not be counted in this promotion.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership
program at any time without prior notice.`
      },
      {
        text: `Jolly88 reserves the right to modify, refuse or cancel this VIP membership program at any time without prior notice.`
      }
    ];

    const vipList = ref([
      {
        level: 1,
        description: "> 有一笔存款",
        monthlyBonus: `无`,
        birthdayBonus: `无`,
        cunsong: `无`,
        drawTimes: `无`,
        perEsport: "0.40%",
        perSport: "0.40%",
        perLive: "0.40%",
        perSlot: "0.50%",
        perPoker: "0.50%"
      },
      {
        level: 2,
        description: `升级要求 &gt; 5000≤累积存款<br> 保级要求 &gt; 1888≤一个月内累积存款`,
        monthlyBonus: "28",
        birthdayBonus: "38",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金588元`,
        drawTimes: "15",
        perEsport: "0.40%",
        perSport: "0.40%",
        perLive: "0.40%",
        perSlot: "0.60%",
        perPoker: "0.60%"
      },
      {
        level: 3,
        description: `升级要求 &gt; 50000≤累积存款<br>
							保级要求 &gt; 10888≤一个月内累积存款`,
        monthlyBonus: "88",
        birthdayBonus: "108",
        cunsong: `存款至少100元可申请每月一次再存20% 最高奖金888元`,
        drawTimes: "15",
        perEsport: "0.45%",
        perSport: "0.45%",
        perLive: "0.45%",
        perSlot: "0.70%",
        perPoker: "0.70%"
      },
      {
        level: 4,
        description: `升级要求 &gt; 250000≤累积存款<br>
							保级要求 &gt; 38888≤一个月内累积存款`,
        monthlyBonus: "188",
        birthdayBonus: "388",
        cunsong: `存款至少100元可申请每周一次再存25% 最高奖金888元`,
        drawTimes: "15",
        perEsport: "0.45%",
        perSport: "0.45%",
        perLive: "0.45%",
        perSlot: "0.80%",
        perPoker: "0.75%"
      },
      {
        level: 5,
        description: `升级要求 &gt; 500000≤累积存款<br>
							保级要求 &gt; 58888≤一个月内累积存款`,
        monthlyBonus: "388",
        birthdayBonus: "688",
        cunsong: `存款至少500元可申请每月一次再存50% 最高奖金1888元`,
        drawTimes: "15",
        perEsport: "0.50%",
        perSport: "0.50%",
        perLive: "0.50%",
        perSlot: "0.90%",
        perPoker: "0.80%"
      },
      {
        level: 6,
        description: `升级要求 &gt; 2500000≤累积存款<br>
							保级要求 &gt; 88888≤一个月内累积存款`,
        monthlyBonus: "888",
        birthdayBonus: "1088",
        cunsong: `存款至少500元可申请每周一次再存30% 最高奖金2888元`,
        drawTimes: "15",
        perEsport: "0.55%",
        perSport: "0.55%",
        perLive: "0.55%",
        perSlot: "1.20%",
        perPoker: "0.85%"
      },
      {
        level: 7,
        description: `升级要求 &gt; 5000000≤累积存款<br>
							保级要求 &gt; 188888≤一个月内累积存款`,
        monthlyBonus: "2888",
        birthdayBonus: "6888",
        cunsong: `存款至少500元可申请每周一次再存35% 最高奖金3888元`,
        drawTimes: "15",
        perEsport: "0.65%",
        perSport: "0.65%",
        perLive: "0.65%",
        perSlot: "1.50%",
        perPoker: "0.90%"
      },
      {
        level: 8,
        description: `升级要求 &gt; 8000000≤累积存款<br>
							保级要求 &gt; 288888≤一个月内累积存款`,
        monthlyBonus: "5888",
        birthdayBonus: "8888",
        cunsong: `存款至少500元可申请每周一次再存40% 最高奖金5888元`,
        drawTimes: "15",
        perEsport: "0.80%",
        perSport: "0.80%",
        perLive: "0.80%",
        perSlot: "1.80%",
        perPoker: "0.95%"
      },
      {
        level: 9,
        description: `升级要求 &gt; 12000000≤累积存款<br>
							保级要求 &gt; 588888≤一个月内累积存款`,
        monthlyBonus: "6888",
        birthdayBonus: "10888",
        cunsong: `存款至少500元可申请每周一次再存45% 最高奖金8888元`,
        drawTimes: "15",
        perEsport: "0.90%",
        perSport: "0.90%",
        perLive: "0.90%",
        perSlot: "1.90%",
        perPoker: "1.00%"
      },
      {
        level: 10,
        description: `升级要求 &gt; 20000000≤累积存款<br>
							保级要求 &gt; 888888≤一个月内累积存款`,
        monthlyBonus: "8888",
        birthdayBonus: "18888",
        cunsong: `存款至少500元可申请每周一次再存50% 最高奖金12888元`,
        drawTimes: "15",
        perEsport: "1.00%",
        perSport: "1.00%",
        perLive: "1.00%",
        perSlot: "2.00%",
        perPoker: "1.20%"
      }
    ]);

    const vipItems = [
      {
        vipLevel: "1",
        monthly: "",
        birthday: "",
        saving: "有一笔",
        monthlySaving: "",
        oneMonthSaving: "无保级要求"
      },
      {
        vipLevel: "2",
        upgrade: "70,000",
        monthly: "188",
        birthday: "",
        saving: "5000≤累积",
        monthlySaving: "1888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "3",
        upgrade: "500,000",
        monthly: "688",
        birthday: "888",
        saving: "50000≤累积",
        monthlySaving: "10888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "4",
        upgrade: "2,000,000",
        monthly: "1,588",
        birthday: "2,888",
        saving: "250000≤累积",
        monthlySaving: "38888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "5",
        upgrade: "7,000,000",
        monthly: "2,888",
        birthday: "5,888",
        saving: "500000≤累积",
        monthlySaving: "58888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "6",
        upgrade: "20,000,000",
        monthly: "6,888",
        birthday: "8,888",
        saving: "2500000≤累积",
        monthlySaving: "88888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "7",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "5000000≤累积",
        monthlySaving: "188888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "8",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "8000000≤累积",
        monthlySaving: "288888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "9",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "12000000≤累积",
        monthlySaving: "588888≤",
        oneMonthSaving: "一个月内累积存款"
      },
      {
        vipLevel: "10",
        upgrade: "60,000,000",
        monthly: "18,888",
        birthday: "48,888",
        saving: "20000000≤累积",
        monthlySaving: "888888≤",
        oneMonthSaving: "一个月内累积存款"
      }
    ];

    const isClaimModal = ref(false);
    const claimMsg = ref("");

    onMounted(() => {
      if (!store.token) {
        return;
      }
      vipLevel.value = store.vip.replace("VIP", "");
      if (vipLevel.value >= 1) {
        slide.value = vipLevel.value ? parseInt(vipLevel.value) - 1 : 0;
      }

      eventapi
        .get("/privi/vip/canRedeem?promoCode=dy2-vip-monthly")
        .then((res) => {
          console.log(res);
          isBeforeCheckBonus.value = true;
          if (res.data === false) {
            isClaimedBonus.value = true;
          }
        })
        .catch((e) => {
          isBeforeCheckBonus.value = true;
        });
      eventapi
        .get("/privi/vip/canRedeem?promoCode=dy2-vip-birthday")
        .then((res) => {
          console.log(res);
          isBeforeCheckBirthday.value = true;
          if (res.data === false) {
            isClaimedBirthday.value = true;
          }
        })
        .catch((e) => {
          isBeforeCheckBirthday.value = true;
        });
    });

    const claimRebate = (type, vipType) => {
      loading.value = true;
      if (vipType === "monthly") {
        loadingMClaim.value = true;
      } else if (vipType === "birthday") {
        loadingBClaim.value = true;
      }
      const eventUrl = "/bonus/claim/" + type;
      // console.log(eventUrl);
      eventapi
        .put(eventUrl)
        .then((res) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;
          var responseCode = res.data;
          if (responseCode.code === 0) {
            var rebatePoint = responseCode.data;

            claimMsg.value = "$" + rebatePoint;
            isClaimModal.value = true;
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: responseCode.message,
            //   icon: "report_problem"
            // });
          }
        })
        .catch((error) => {
          loading.value = false;
          loadingMClaim.value = false;
          loadingBClaim.value = false;

          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: error.message,
          //   icon: "report_problem"
          // });
        });
    };

    return {
      columns,
      data,
      showRebate,
      promoExclusive,
      dataExclusive,
      terms,
      vipItems,
      vipList,
      loading,
      vipLevel,
      slide,
      claimRebate,
      store,
      isClaimModal,
      claimMsg,
      loadingMClaim,
      loadingBClaim,
      tab,
      onVIPButtonClick,
      btnIsDisabled,
      startCountdown,
      isBeforeCheckBonus,
      isBeforeCheckBirthday,
      isClaimedBirthday,
      isClaimedBonus
    };
  }
});
</script>
<style scoped lang="scss">
// @import url("https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Purple+Purse&display=swap");
$border-settings: 1px solid #e5e7eb;
.carousel__slide {
  .vipLevelButton {
    display: none;
  }
}
.carousel__slide--active {
  .vipLevelButton {
    background: url("../../assets/images/vip/button.png") no-repeat center center;
    background-size: contain;
    padding: 15px;
    color: #000000;
    display: flex;
    justify-content: center;
    margin-top: 15px;
    padding-bottom: 23px;
    cursor: pointer;
    &.claimed {
      background: #d7d7d7;
      border-radius: 40px;
      color: #959595;
      padding: 15px;
      width: 50%;
      margin: 20px auto;
    }
  }
}
.outerContainer {
    max-width: 1300px;
    margin: 0 auto 20px;
    width: 95%;
    border-radius: 6px;
    background: #F3E5D1;
    padding: 5px;
  .innerContainer {
    
    border: 1px solid #996F37;
    border-radius: 6px;
  }
}
.vip-container {
  min-height: 100vh;

  .loading-icon {
    width: 10px;
    height: 10px;
    border: 2px solid #f1dda0; /* Light gold color */
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 12px 0;
  }
  .loading-blue-icon {
    width: 10px;
    height: 10px;
    border: 2px solid #799df8; /* Light gold color */
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 4px auto;
  }

  .q-tabs {
    background: #fff;
    border-radius: 30px;
    width: 90%;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    overflow: hidden;
  }
  .vip-logo {
    margin: 0 auto;
    padding-top: 10px;
    display: flex
;
    justify-content: center;
    align-items: center;
  }
  .vip-header {
    margin: 10px auto -30px;
    width: 55%;
  }

  .banner-container {
    //background: url("../../assets/vip/banner.png") no-repeat center center;
    background-size: cover;
    margin-bottom: -200px;
    padding-top: 100px;
    padding-bottom: 200px;
    // width: 1920px;
    // height: 450px;
    font-size: 30px;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 600px;
  }
  .current-vip-status {
    // border: 2px solid #799df8;
    max-width: 480px;
    width: 95%;
    margin: 0 auto;
    background: #212b4ae0;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: #FFFFFF;
    .badge {
      // width: 80px;
      // position: absolute;
      // left: 15px;
      
      width: 80px;
      img {
        width: 100%;
        // padding: 10px;
      }
    }
    .vip-progress {
      display: flex;
      flex-direction: column;
      // width: calc(100% - 120px);
      // margin-left: 80px;
      width: 100%;
      gap: 20px;

      &.load {
        // margin-left: 65px;
        min-width: 210px;
      }

      .amount {
        display: flex;
        flex-direction: column;
        // gap: 10px;
        gap: 5px;
        .text {
          font-size: 12px;
          // color: #ffffff;
          color: #585858;
          // white-space: nowrap;
          .required-amount {
            color: #6F3F00;
            display: inline-block;
            font-weight: 600;
          }
        }
      }
      .progressBarContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .progressBarOuterBar {
          border-radius: 16px;
          // background: #405471;
          background: #C5C5C5;
          border: 2px solid #C5C5C5;
          width: 100%;
          overflow: hidden;
        }

        .progressBarInnerBar {
          color: #fff;
          border-radius: 16px;
          // background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          background: linear-gradient(180deg, #FFE79E 0%, #FFA013 100%);

          height: 8px;
        }

        .progressBarDescription {
          // display: flex;
          display: none;
          justify-content: space-between;
          color: #333;
          font-size: 13.987px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin: -28px auto 0;
          &Retain {
            display: flex;
            justify-content: space-between;
            color: #fff;
            font-size: 9.987px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin: -24px auto 0;
          }
        }
      }
    }
    .claim-btn {
      border: 2px solid #799df8;
      background: #405471;
      color: #ffffff;
      width: 74px;
      min-width: 74px;
      text-align: center;
      display: block;
      border-radius: 8px;
      font-size: 12px;
      padding: 5px 0px;
      text-align: center;
      // margin-left: 70px;
    }
  }
  .month-birthday-bonus {
    // border: 2px solid #799df8;
    // max-width: 480px;
    width: 100%;
    margin: 0px auto 0;
    // background: #212b4ae0;
    border-radius: 12px;
    display: flex;
    justify-content: stretch;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
    ol {
      margin: 0;
      padding: 0;
    }
    .left {
      flex: 2;
      position: relative;
      width: 100%;
      // height: 280px;
      height: 235px;
      a {
        height: 100%;
        width: 100%;
        img {
          height: 100%;
          width: 100%;
        }
      }
      img.abs {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
      .inner-slide {
        width: 100%;
        overflow: hidden;
        height: 100%;
        background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%);
        border-radius: 10px;
        .card-img {
          position: relative;
          width: unset;
          height: 100%;
          max-height: 100%;
        }
        .card-img-wrap {
          min-height: 160px;

          @media (min-width: 470px) {
            min-height: 210px;
          }
        }
      }
    }
    .right {
      flex: 2;
      // width: 220px;
      .vip-boxes {
        // display: grid;
        // grid-template-columns: repeat(2, 1fr);
        width: 100%;
        height: 100%;
        max-width: 200px;
        gap: 15px;
        .box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          font-size: 8px;
          min-height: 112px;
          border: 1px solid #6F3F00;
          padding: 10px 5px;
          border-radius: 10px;
          .vip-inner {
            // border: 1px solid #799df8;
            // background: #1f2231;
            // padding: 4px;
            border-radius: 6px;
            width: 100%;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 2px;
            .box-det {
              min-height: 70px;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              gap: 1px;
              flex-direction: column;
            }
          }
          &.inactive {
            .vip-inner {
              border: 1px solid #596589;
              background: #2f3547;
            }
            .icon {
              background: url(../../assets/images/vip/bg-circle-inactive.png) no-repeat center center;
              background-size: contain;
            }
            .item-amt {
              color: #596589;
              font-size: 10px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
            }
          }
          .icon {
            background: url(../../assets/images/vip/bg-circle.png) no-repeat center center;
            background-size: contain;
            padding: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            // width: 60px;
            // height: 60px;
            width: 30px;
            height: 30px;
            margin: 0 auto;
            img {
              height: 50%;
            }
          }
          .item-name {
            color: #585858;
          }
          .item-amt {
            // color: #799df8;
            font-family: 'Impact';
            background: linear-gradient(180deg, #996F37 0%, #6F3F00 100%);
            font-size: 20px;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .claim-now {
            // background: linear-gradient(90deg, #f1dda0 0%, #ffcc80 100%);
            // color: #000000;
            background: url(../../assets/images/vip/claim-btn.png)no-repeat center center;
            background-size: contain;
            color: #6F3F00;
            font-size: 9px;
            font-weight: 400;
            line-height: 18px;
            text-align: center;
            padding: 0px 9px;
            border-radius: 10px;
            margin: 5px auto 0;
            // min-width: 80px;
            min-width: 80%;
            font-weight: bold;
            cursor: pointer;
            &.disabled {
              pointer-events: none;
              // background: linear-gradient(90deg, #6e6e6e 0%, #858585 100%);
              // color: #434343;
              color: #434343;
              background: url(../../assets/images/vip/claim-btn-disabled.png)no-repeat center center;
              background-size: contain;
            }
          }
          .claimed,
          .expired {
            background: url(../../assets/images/vip/claim-btn-claimed.png)no-repeat center center;
            background-size: contain;
            // background: linear-gradient(90deg, #F1DDA0 0%, #FFCC80 100%);
            color: #ffffff;
            font-size: 9px;
            line-height: 18px;
            text-align: center;
            padding: 0px 9px;
            border-radius: 10px;
            margin: 5px auto 0;
            font-weight: bold;
            min-width: 80%;
          }
          .expired {
            // color: #596589;
            background: url(../../assets/images/vip/claim-btn-disabled.png)no-repeat center center;
            background-size: contain;
            color: #FFFFFF;
          }
        }
      }
    }
  }
  .tips {
    color: #585858;
    font-size: 13px;
    font-weight: 400;
    line-height: 22.8px;
    text-align: center;
    margin: 10px auto;
    max-width: 500px;
    width: 95%;
    position: relative;
    .linktotable {
      border-bottom: 1px solid #6F3F00;
      color: #6F3F00;
      display: block;
      margin: 0 auto;
      width: 98px;
    }
    .absolute-box {
      position: absolute;
      width: 100%;
      // right: -30px;
      z-index: 2;
      // overflow: hidden;
    }
    .arrow_box {
      // width: 85%;
      width: 90%;
      left: 5%;
      top: 30px;
      position: relative;
      background: #1f2231;
      border: 2px solid #799df8; /*set border colour here*/
      -webkit-filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8)); /*set shadow colour  and size here*/
      -moz-box-shadow: 0 1px 10px rgba(113, 158, 206, 0.8);
      filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8));
      padding: 20px 12px;
      border-radius: 10px;
      .overflow-table {
        overflow-x: auto;
        width: 100%;
        &::-webkit-scrollbar {
          width: 8px; /* Change this value to your desired width */
          height: 8px; /* Change this value for horizontal scrollbars */
        }

        /* Customize the scrollbar track */
        &::-webkit-scrollbar-track {
          background: #1f2231; /* You can change this to the color you prefer */
        }

        /* Customize the scrollbar handle */
        &::-webkit-scrollbar-thumb {
          background: #799df8; /* You can change this to the color you prefer */
          border-radius: 10px; /* Makes the scrollbar handle rounded */
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #2f3547; /* Darker color on hover */
        }
      }
      table {
        width: auto;
        tr {
          th {
            border: 2px solid #f1dda0;
            padding: 20px 10px;
          }
          td {
            white-space: nowrap;
            padding: 20px 10px;
            // border: 2px solid #799df8;
          }
          &:first-child {
            background: #2f3547;
          }
          &:nth-child(2) {
            background: #2f3547;
          }
          &:nth-child(3) {
            background: #282c3e;
          }
        }
      }
    }

    .arrow_box:after,
    .arrow_box:before {
      bottom: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    .arrow_box:after {
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: #1f2231;
      border-width: 19px;
      left: 85%;
      margin-left: -19px;
    }

    .arrow_box:before {
      border-color: rgba(113, 158, 206, 0);
      border-bottom-color: #799df8;
      border-width: 20px;
      left: 85%;
      margin-left: -20px;
    }
  }

  .vipitem {
    position: relative;
    width: 400px;
    height: 520px;
    max-width: 250px;
    max-height: 350px;
    background: url("../../assets/images/vip/cardbg.png") no-repeat top center;
    background-size: contain;
    width: 320px;
    padding: 40px 0;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

    .viplevelcard {
      // padding: 10px;
      width: 70%;
      height: 150px;
      background: url("../../assets/vip/vip_logo_bg.png") no-repeat center center;
      background-size: contain;
      position: relative;
      text-align: left;
      height: 47px;

      &.vipLevelReached {
        // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-achieved.png") no-repeat left center;
        background-size: contain;
      }

      span {
        color: #fff;
        margin-left: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
      }
    }
    .vipcontents {
      height: 98%;
      border-radius: 20px;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      // padding: 30px 30px;
      .title {
        color: #333;
        text-align: center;
        font-family: "PingFang";
        font-size: 24.319px;
        font-style: italic;
        font-weight: 700;
        line-height: normal;
        
        margin-top: 10px;
        // position: absolute;
        .type {
          // color: #799df8;
          // font-weight: 600;
          // font-size: 18.319px;
          // display: inline-block;
          // font-style: normal;
          background: linear-gradient(180deg, #996F37 0%, #6F3F00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          font-size: 18.23px;
          line-height: 20.45px;
          letter-spacing: 16%;
          text-align: center;
          padding: 5px;

          /* Optional: for better cross-browser support */
          background-clip: text;
          color: transparent;
        }
      }
      .badge {
        // width: 75%;
        width: 43%;
        // margin-top: 15%;
        img {
          width: 100%;
        }
      }

      .description {
        color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        line-height: 15px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        span {
          color: #FFF0C8;
          font-size: 30px;
          font-weight: 400;
          line-height: 30px;
          text-align: center;
          font-family: "Impact";
        }
      }
      .viplevel {
        color: #ffffff;
        font-family: "Purple Purse", sans-serif;
        font-size: 20px;
        font-weight: 400;
        line-height: 30px;
        text-align: center;
      }

      .inner-vip {
        background-color: #303450;
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        font-size: 45px;
        line-height: 53px;
        font-family: "Arial";
      }

      .second-vip {
        // background: #2b2b4b;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 45px;
        line-height: 53px;

        div {
          flex: 1;
        }

        .common-btn {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 20px;
          margin: 0 30px 30px;
        }
      }
    }
  }

  .vip-benefits {
    padding: 10px;
    font-size: 0.75rem;
    background: #eaeef2;

    .bft-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #0a3255;
      font-size: 18px;
      font-weight: bold;
      padding: 2px 0px 4px;
      height: 24px;
      border-bottom: 1px solid #baa57f;
      gap: 10px;

      //&:before {
      //  content: "";
      //  width: 10px;
      //  height: 19px;
      //  display: inline-block;

      //}
    }

    .separator {
      margin: 20px 0;
    }
  }
  .tabs {
    display: flex;
    max-width: 320px;
    width: 95%;
    margin: 0 auto 14px;
    justify-content: space-evenly;
    background: url(../../assets/images/vip/tab-bg.png)no-repeat center center;
    background-size: contain;
    padding: 1px;
    
    .tab {
      // max-width: 120px;
      padding: 8px 40px;
      font-weight: 900;
      img {
        width: 100%;
        display: block;
      }
      &.active {
        background: url(../../assets/images/vip/tab-active-bg.png)no-repeat center center;
        background-size: cover;
        .tabtext {
          background: linear-gradient(180deg, #996F37 0%, #6F3F00 100%);

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          /* Optional: for better cross-browser support */
          background-clip: text;
          color: transparent;
        }
      }
    }
  }
  .heading {
    background: url(../../assets/images/vip/heading-bg.png)no-repeat center center;
    background-size: contain;
    max-width: 980px;
    margin: 0 auto 5px;
    font-size: 25px;
    font-weight: 900;
    padding-bottom: 30px;
    text-align: center;
    .headingtext {
    background: linear-gradient(90deg, #996F37 0%, #F4D999 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Optional: for better cross-browser support */
    background-clip: text;
    color: transparent;
    filter: drop-shadow(2px 3px 1px #996F37);
    img {
      max-width: 180px;
      margin-bottom: -10px;
      width: 38%;
    }
    }
  }
  .vip-benefit-section-title {
    max-width: 800px;
    margin: 10px auto;
    img {
      width: 100%;
    }
  }
  .instructions {
    overflow: auto;
    border-radius: 15px;
    width: 100%;
    margin: 0px auto 20px;
    table {
      width: 95%;
      text-align: center;
      margin: 0 auto;
      // border-radius: 10px;
      // border-radius: 0 0 10px 10px;
      border-radius: 10px;

      word-break: break-word;
      table-layout: fixed;
      font-size: 12px;
      overflow: hidden;
      thead {
        background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%);

        color: #000000;
      }
      tbody {
        background: #F3E5D1;
        color: #585858;
      }
      th,
      td {
        padding: 5px;
        border: 0.5px solid #996f373d;
      }
    }
  }
  .terms-conditions {
    color: #585858;
    // max-width: 480px;
    margin: 0 auto;
    // width: 95%;
    position: relative;
    // border: 2px solid #799df8;
    padding: 10px;
    // background: linear-gradient(0deg, #2f3547, #2f3547);
    border-radius: 15px;
    .section-title {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #ffffff 18.57%, #b3d7f0 85%);
      font-size: 18px;
      -webkit-text-fill-color: transparent;
      font-weight: 600;
      background-clip: text;
      text-align: center;

      &:before {
        content: "";
        background: url(../../assets/images/vip/decal.png);
        // width: 70px;
        // height: 70px;
        height: 30px;
        width: 30px;
        display: block;
        background-size: cover;
      }
      &:after {
        content: "";
        background: url(../../assets/images/vip/decal.png);
        // width: 70px;
        // height: 70px;
        height: 30px;
        width: 30px;
        display: block;
        background-size: cover;
        transform: rotateY(180deg);
      }
    }
    .accordion {
      cursor: pointer;
      text-align: center;
      border: 0;
      outline: none;
      font-size: 13px;
      transition: 0.4s;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #996f37;
      background: none;
      border-bottom: 1px solid;
      margin: 0 auto 20px;
      box-shadow: none;
    }

    h2 {
      font-size: 12px;
      line-height: 16px;
      color: #6F3F00;
      // color: #ffffff;
    }
    .terms-conditions-title-separator {
      width: 100%;
      height: 100%;
    }

    .terms {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 12px;
      font-weight: 400;
      line-height: 26px;
      // background: linear-gradient(0deg, #2f3547, #2f3547ad);
      counter-reset: item;
      padding: 0;
      color: #585858;

      &.got-bullets {
        li {
          &::before {
            content: counter(item) ".";
            counter-increment: item;
            // background: url("../../assets/images/vip/tnc-no-bg.png") no-repeat center center;
            // font-weight: 600;
            padding: 5px;
            margin-top: 4px;
            background-size: contain;
            color: #585858;
            text-align: center;
            // min-width: 30px;
            // min-height: 42px;
            // max-width: 30px;
            // max-height: 42px;
            width: 5px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      
      &.got-gold-bullets {
        h2 {
          color:#996F37;
          margin:0;
          font-weight: normal;
        }
        li.wbg {
          margin-left: 0;
          align-items: center;
          &::before {
            content: counter(item);
            counter-increment: item;
            background: url("../../assets/images/vip/tnc-no-bg.png") no-repeat center center;
            font-weight: 600;
            padding: 10px;
            margin-top: 4px;
            background-size: contain;
            color: #000000;
            text-align: center;
            // min-width: 30px;
            // min-height: 42px;
            // max-width: 30px;
            // max-height: 42px;
            width: 16px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      li {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 5px;
        list-style-type: none;
        position: relative;
        margin-bottom: 10px;
        margin-left: 25px;
      }

      .common-btn {
        display: block;
        width: 100%;
        margin-top: 10px;
        list-style-type: decimal;
        color: #ffffff;
      }
    }
  }
}

@media (max-width: 767px) {
  .vip-program {
    display: none;
  }

  .vip-container {
    .banner-container {
      min-height: 300px;
      background-position: center center;
    }

    .vipitem {
      height: 265px;
      margin: auto;
      width: 200px;
      // height: 320px;
      // margin: auto;
      // width: 300px;
      .vipLevelReachStatus {
        margin-top: 12px;
        margin-left: 3px;
      }

      .vipcontents {
        padding-bottom: 13px;
        gap: 0;
      }
    }
  }
}

// @media (max-width: 380px) {

//   .vip-container .month-birthday-bonus {
//     flex-direction: column;
//   }
//   .vip-container .month-birthday-bonus .right .vip-boxes {
//     justify-content: center;
//     align-items: center;
//   }
//   .vip-boxes .carousel {
//     max-width: unset !important;
//   }
// }
</style>

<style scoped lang="scss">
.left {
  .carousel {
    height: 100%;
    // max-width: 140px;
    margin: 0 auto;
  }
  // .carousel__slide {
  //   overflow: hidden;
  //   gap: 5px;
  // }
  .carousel__pagination {
    padding: 0;
    margin: 10px;
    position: absolute;
    z-index: 3;
    left: 0;
    right: 0;
    bottom: 0;
    gap: 5px;
  }
  :deep(.carousel__viewport) {
    height: 100%;
  }
  :deep(.carousel__track) {
    margin: 0;
    height: 100%;
  }
  :deep(.carousel__pagination-button:after) {
    background: #ffffff80;
    border-radius: 10px;
    padding: 0;
    width: 8px;
    height: 8px;
  }
  :deep(.carousel__pagination-button--active:after) {
    background: #6F4000;
  }
}
.vip-boxes {
  .carousel {
    // max-width: 200px;
    // margin: 0 auto;
  }
  .carousel__slide {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
    align-items: flex-start;
    // &:first-child {
    //   margin-right: 4px;
    //   // padding-right: 4px;
    // }
    // &:last-child {
    //   margin-left: -4px;
    //   padding-left: 8px;
    // }
  }
}
</style>
<!-- Carousel CSS only -->
<style lang="scss">
.vip-container {
  .q-tabs {
    background: url(../../assets/vip/top_bg.png) no-repeat top right;
    background-attachment: fixed;
  }
}
.vip-cards {
  .carousel {
    max-width: 100%;
    margin: -40px auto -60px;
    // margin: 0 auto;
  }
  .carousel__slide {
    padding: 5px;
  }

  .carousel__viewport {
    perspective: 2000px;
  }

  :deep(.carousel__track) {
    transform-style: preserve-3d;
  }

  .carousel__slide--sliding {
    transition: 0.5s;
  }

  .carousel__slide {
    opacity: 0;
    transform: scale(0.4);
    filter: grayscale(0.5) brightness(0.9);
  }

  .carousel__slide--active ~ .carousel__slide {
    z-index: -1;
    transform: scale(0.4);
    filter: grayscale(0.8) brightness(0.9);
    .vipcontents {
      &:before {
        content: "";
        //box-shadow: 200px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
  .carousel__slide--active ~ .carousel__slide.carousel__slide--next {
    transform: scale(0.45);
    // margin-left: -45px;
    filter: grayscale(1) brightness(0.7);
    z-index: -3;
    .vipitem {
      margin-left: 10px;
    }

    .vipcontents {
      &:before {
        content: "";
        //box-shadow: 110px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
  .carousel__slide.carousel__slide--prev {
    transform: scale(0.45);
    filter: grayscale(1) brightness(0.7);
    // margin-left: 40px;
    .vipitem {
      // margin-left: 50px;
    }
    
    .vipitem {
      margin-right: 10px;
    }
    .vipcontents {
      &:before {
        content: "";
        //box-shadow: -110px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
  .carousel__slide--prev {
    opacity: 1;
    transform: scale(0.45);
    z-index: -2;
    filter: grayscale(1) brightness(0.5);
    .vipcontents {
      &:before {
        content: "";
        //box-shadow: -110px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }

  .carousel__slide--next {
    transform: scale(0.45);
    opacity: 1;
    z-index: -2;
    filter: grayscale(1) brightness(0.5);

    .vipcontents {
      &:before {
        content: "";
        //box-shadow: 110px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }

  .carousel__slide--prev + .carousel__slide.carousel__slide--visible {
    .vipcontents {
      &:before {
        content: "";
        //box-shadow: -200px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
  .carousel__slide--next + .carousel__slide.carousel__slide--visible {
    .vipcontents {
      &:before {
        content: "";
        //box-shadow: 200px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
  .carousel__slide--visible {
    transform: scale(0.7);
    opacity: 0.9;
    z-index: -1;
  }

  :deep(.carousel__prev) {
    // z-index: 2001 !important;
    background: url("../../assets/images/vip/nextprev.png");
    background-size: contain;
    // padding: 5px;
    margin: 0px;
    transform: translate3d(-20px, -20px, 10px);
    display: none;
  }
  :deep(.carousel__next) {
    // z-index: 2001 !important;
    background: url("../../assets/images/vip/nextprev.png");
    background-size: contain;
    // padding: 5px;
    margin: 0px;
    transform: translate3d(20px, -20px, 10px) rotateY(180deg);
    display: none;
  }
  :deep(.carousel__icon) {
    opacity: 0;
  }
  .carousel__slide--active {
    opacity: 1;
    transform: scale(0.7);
    filter: grayscale(0);
    // margin-left: -40px;
    z-index: 1;
    .vipcontents {
      &:before {
        content: unset !important;
        //box-shadow: 200px 0 30px -10px black inset;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 2;
      }
    }
  }
}
.newTable {
  table {
    table-layout: fixed;
    font-size: 14px;
    width: 95%;
    text-align: center;
    margin: 0 auto;
    thead {
      // background: linear-gradient(180deg, #4d6abe 0%, #354d93 24.31%, #16234e 100%);
      // color: #ffffff;
      color: #000000;
      background: linear-gradient(180deg, #DFAA71 0%, #F1CB91 100%);

    }
    tbody {
      background: #F3E5D1;
      // color: #ffffff;
      
      color: #585858;
    }
    th,
    td {
      padding: 10px;
      border: 0.5px solid #f1dda0;
    }
  }
}
</style>

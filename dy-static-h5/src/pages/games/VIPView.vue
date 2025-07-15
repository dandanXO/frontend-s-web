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
                        <span class="type">{{ vip.vipTitle }} V{{ vip.vipLevel }}</span>
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
          <div v-show="isDataLoaded" v-if="currentBetAmt <= currentUpgradeBetAmt || vipLevel === 10">
            <div
              class="text"
              v-if="vipLevel + 1 && currentUpgradeBetAmt && currentUpgradeBetAmt >= currentBetAmt && vipLevel != 10"
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

            <div class="text" v-else-if="vipLevel === 10">您已达到或超越最高 VIP 等级所需的有效流水</div>
            <div class="text" v-else>
              已到达
              <div class="required-amount">{{ currentUpgradeBetAmt }}</div>
              有效流水 VIP {{ vipLevel + 1 }}
            </div>
          </div>

          <div class="text" v-show="isDataLoaded" v-else>已到达有效流水 VIP {{ vipLevel + 1 }}</div>
          <div class="text" v-show="!isDataLoaded">正在为您计算有效投注</div>

          <div v-show="isDataLoaded" class="progressBarContainer" v-if="vipLevel != 0 && vipLevel != 10">
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

          <div v-show="isDataLoaded" class="progressBarContainer" v-if="vipLevel === 0 || vipLevel === 10">
            <div class="progressBarOuterBar">
              <div
                class="progressBarInnerBar"
                :style="{
                  width: vipLevel === 10 ? '100%' : vipLevel === 0 ? getVipLevelProgress(vipLevel, 'bet') + '%' : null
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
            <div class="progressBarDescription" v-if="vipLevel == 10">
              {{ originalUpgradeBetAmounts[9] + "/" + originalUpgradeBetAmounts[9] }}
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
                      <template v-if="category.key !== 'birthday' || (index !== 0)">
                        <template
                          v-if="
                            store.token && isFirstTime && vipLevel !== 0 && vipLevel !== 10
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
                <td>58 元</td>
                <td>588</td>
                <td>-</td>
                <!--            <td>-</td>-->
                <td>0.30%</td>
                <td>8</td>
                <td>58</td>
              </tr>
              <tr>
                <td>VIP2</td>
                <!-- <td>青铜 I</td> -->
                <td>58 元</td>
                <td>588</td>
                <td>38</td>
                <!--            <td>-</td>-->
                <td>0.50%</td>
                <td>18</td>
                <td>88</td>
              </tr>
              <tr>
                <td>VIP3</td>
                <!-- <td>白银 III</td> -->
                <td>58 元</td>
                <td>588</td>
                <td>58</td>
                <!--            <td>-</td>-->
                <td>0.60%</td>
                <td>28</td>
                <td>158</td>
              </tr>
              <tr>
                <td>VIP4</td>
                <!-- <td>白银 II</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>88</td>
                <!--            <td>-</td>-->
                <td>0.80%</td>
                <td>58</td>
                <td>268</td>
              </tr>
              <tr>
                <td>VIP5</td>
                <!-- <td>白银 I</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>188</td>
                <!--            <td>-</td>-->
                <td>1.00%</td>
                <td>88</td>
                <td>288</td>
              </tr>
              <tr>
                <td>VIP6</td>
                <!-- <td>黄金 III</td> -->
                <td>288 元</td>
                <td>1,088</td>
                <td>288</td>
                <!--            <td>-</td>-->
                <td>1.20%</td>
                <td>128</td>
                <td>588</td>
              </tr>
              <tr>
                <td>VIP7</td>
                <!-- <td>黄金 II</td> -->
                <td>588 元</td>
                <td>1,888</td>
                <td>388</td>
                <!--            <td>-</td>-->
                <td>1.30%</td>
                <td>208</td>
                <td>788</td>
              </tr>
              <tr>
                <td>VIP8</td>
                <!-- <td>黄金 I</td> -->
                <td>588 元</td>
                <td>1,888</td>
                <td>588</td>
                <!--            <td>188</td>-->
                <td>1.50%</td>
                <td>388</td>
                <td>888</td>
              </tr>
              <tr>
                <td>VIP9</td>
                <!-- <td>铂金 II</td> -->
                <td>888 元</td>
                <td>2,888</td>
                <td>888</td>
                <!--            <td>288</td>-->
                <td>1.80%</td>
                <td>588</td>
                <td>1,288</td>
              </tr>
              <tr>
                <td>VIP10</td>
                <!-- <td>铂金 I</td> -->
                <td>1,888 元</td>
                <td>8,888</td>
                <td>1,888</td>
                <!--            <td>388</td>-->
                <td>2.00%</td>
                <td>888</td>
                <td>2,888</td>
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
                <td>0.48%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.60%</td>
                <!--            <td>0.2%</td>-->
                <td>12,888</td>
              </tr>
              <tr>
                <td>VIP3</td>
                <td>0.48%</td>
                <td>0.45%</td>
                <td>0.45%</td>
                <td>0.50%</td>
                <td>0.80%</td>
                <!--            <td>0.25%</td>-->
                <td>18,888</td>
              </tr>
              <tr>
                <td>VIP4</td>
                <td>0.48%</td>
                <td>0.50%</td>
                <td>0.48%</td>
                <td>0.55%</td>
                <td>0.80%</td>
                <!--            <td>0.30%</td>-->
                <td>18,888</td>
              </tr>
              <tr>
                <td>VIP5</td>
                <td>0.50%</td>
                <td>0.50%</td>
                <td>0.50%</td>
                <td>0.60%</td>
                <td>0.80%</td>
                <!--            <td>0.30%</td>-->
                <td>28,888</td>
              </tr>
              <tr>
                <td>VIP6</td>
                <td>0.50%</td>
                <td>0.55%</td>
                <td>0.55%</td>
                <td>0.70%</td>
                <td>0.85%</td>
                <!--            <td>0.35%</td>-->
                <td>28,888</td>
              </tr>
              <tr>
                <td>VIP7</td>
                <td>0.55%</td>
                <td>0.65%</td>
                <td>0.68%</td>
                <td>0.90%</td>
                <td>1.00%</td>
                <!--            <td>0.35%</td>-->
                <td>58,888</td>
              </tr>
              <tr>
                <td>VIP8</td>
                <td>0.60%</td>
                <td>0.70%</td>
                <td>0.70%</td>
                <td>1.00%</td>
                <td>1.05%</td>
                <!--            <td>0.35%</td>-->
                <td>88,888</td>
              </tr>
              <tr>
                <td>VIP9</td>
                <td>0.70%</td>
                <td>0.75%</td>
                <td>0.75%</td>
                <td>1.10%</td>
                <td>1.10%</td>
                <!--            <td>0.40%</td>-->
                <td>88,888</td>
              </tr>
              <tr>
                <td>VIP10</td>
                <td>0.80%</td>
                <td>0.80%</td>
                <td>0.80%</td>
                <td>1.20%</td>
                <td>1.20%</td>
                <!--            <td>0.40%</td>-->
                <td>128,888</td>
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
        <div class="headingtext gz">
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
          <li>完成等级要求的累计有效流水后系统于次日北京时间早上10点自动更新，具体完成时间以系统为准，请耐心等待；</li>
          <li>VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升；</li>
          <li>会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；</li>
          <li>假设会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；</li>
          <li>每个级别的升级礼金每位会员仅能获得1次（升级礼金1倍流水即可提款）；</li>
        </ol>
        <li class="wbg"><h2>生日礼金</h2></li>
        <ol class="terms">
          <li>生日符合资格的会员，每年生日当天及当天后7日内到在线客服提供相关资料申请生日礼金，逾期不补，彩金1倍流水即可提款；</li>
        </ol>

        <li class="wbg"><h2>首次保级彩金</h2></li>
        <ol class="terms">
          <li>会员在90天保级期内达到保级要求时，第 91 天即可领取首次保级彩金，首次保级彩金1倍流水即可提款。</li>
        </ol>

        <li class="wbg"><h2>年度保级彩金</h2></li>
        <ol class="terms">
          <li>
            老会员（2025年6月1日前注册）：自VIP改版当年起，已升级至VIP1及以上的会员，须于每年6月1日至次年5月31日期间完成年度保级任务，在此期间无任何降级记录（可晋级），方可自次年6月1日起手动领取年度保级彩金。领取额度将以当周期起始时，即当年6月1日会员所处的VIP等级标准为准。仍为VIP0的老会员暂不适用年度保级彩金规则，需升级至VIP1后方可纳入保级计算。
          </li>
          <li>
            新会员（2025年6月1日后注册）：自升级至VIP1之日起，须在12个月内完成年度保级任务，在此期间无任何降级记录（可晋级），方可自第13个月首日起手动领取年度保级彩金。领取额度将以会员升级至VIP当月所处的VIP等级标准为准。若未完成年度保级任务，则须待下一周期符合条件后方可领取。
          </li>
        </ol>

        <li class="wbg"><h2>每日额外返水红包</h2></li>
        <ol class="terms">
          <li>统计每日返水金额，对应 VIP 等级返水加赠比例派发。次日可领取每日额外返水红包彩金，返水红包积累至 10 元即可领取（不足 10 元则不可领取），彩金 1 倍流水即可提款。<br>例：VIP10会员当日的返水金额为1000元，则按照VIP10每日额外返水红包赠送比例2.0%计算：1000*2.0%=20元，返水红包为20元，会员可在页面上点击领取。</li>
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
        <div class="headingtext gz">
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
          <li class="numbered">为避免文字理解差异，东嬴电竞保留此活动最终解释权；</li>
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
              <th style="background: #ad9870">等级</th>
              <th style="background: #f1dda0; color: #766442">VIP 1</th>
              <th style="background: #f1dda0; color: #766442">VIP 2</th>
              <th style="background: #f1dda0; color: #766442">VIP 3</th>
              <th style="background: #f1dda0; color: #766442">VIP 4</th>
              <th style="background: #f1dda0; color: #766442">VIP 5</th>
              <th style="background: #f1dda0; color: #766442">VIP 6</th>
              <th style="background: #f1dda0; color: #766442">VIP 7</th>
              <th style="background: #f1dda0; color: #766442">VIP 8</th>
              <th style="background: #f1dda0; color: #766442">VIP 9</th>
              <th style="background: #f1dda0; color: #766442">VIP 10</th>
              <th style="background: #f1dda0; color: #766442">VIP 11</th>
              <th style="background: #f1dda0; color: #766442">VIP 12</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>会员勋章</td>
              <td>青铜 I</td>
              <td>青铜 II</td>
              <td>白银 I</td>
              <td>白银 II</td>
              <td>白银 III</td>
              <td>黄金 I</td>
              <td>黄金 II</td>
              <td>黄金 III</td>
              <td>铂金 I</td>
              <td>铂金 II</td>
              <td>钻石</td>
              <td>王者</td>
            </tr>
            <tr>
              <td>
                升级条件
                <br />
                （流水）
              </td>
              <td>3,000</td>
              <td>17,500</td>
              <td>50,000</td>
              <td>150,000</td>
              <td>600,000</td>
              <td>1,200,000</td>
              <td>2,400,000</td>
              <td>6,400,000</td>
              <td>24,000,000</td>
              <td>64,000,000</td>
              <td>150,000,000</td>
              <td>250,000,000</td>
            </tr>
            <tr>
              <td>
                保级条件
                <br />
                （90 天）
              </td>
              <td>1,500</td>
              <td>7,500</td>
              <td>19,000</td>
              <td>32,500</td>
              <td>75,000</td>
              <td>200,000</td>
              <td>620,000</td>
              <td>1,900,000</td>
              <td>6,250,000</td>
              <td>12,500,000</td>
              <td>21,000,000</td>
              <td>50,000,000</td>
            </tr>
            <tr>
              <td>晋级彩金</td>
              <td>8</td>
              <td>18</td>
              <td>28</td>
              <td>38</td>
              <td>58</td>
              <td>88</td>
              <td>188</td>
              <td>288</td>
              <td>388</td>
              <td>588</td>
              <td>888</td>
              <td>1,888</td>
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

<script setup>
import "vue3-carousel/dist/carousel.css";
import { ref, onActivated, computed, reactive, watch, h } from "vue";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { getVIPDetails, getVIPDetailsNotLoggedIn, claimItems, loadPromoBanner } from "src/api/index/promo";
import { useNotify } from "src/hooks/notify";
import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";
import { useLocalStorage } from "@vueuse/core";
import GameModal from "src/components/modal/GameModal.vue";
// import { useCloudWiseHelper } from "src/hooks/cloudWiseHelper";

// useCloudWiseHelper({
//   pageName: "vip"
// })

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
const isShowTable = ref(false);
const router = useRouter();
const notify = useNotify();
const store = userStore();
const amount = ref("$0");
const gameModalRef = ref();
const privilegeClaimedModalVisible = ref(false);
const vipLevel = computed(() => {
  return +store.vip.replace("VIP", "");
});
const currentDepositAmt = computed(() => {
  return store.getCurrentDeposit();
});
const isOpenTerms = ref(false);

const toggleAccordion = () => {
  isOpenTerms.value = !isOpenTerms.value;
};
const currentDepAmt = ref(0);
const currentBetAmt = ref(0);
const currentRetainAmount = ref(0);
const retainAmountRequired = ref(0);
const currentRetainDay = ref(0);
const retainDayRequired = ref(0);
const retainPercentage = computed(() => {
  if (retainAmountRequired.value === 0) return 0; // Prevent division by 0
  return ((+currentRetainAmount.value / +retainAmountRequired.value) * 100).toFixed(2);
});
const balanceRetainDay = ref(0);
const currentRedPacketAmount = ref(0);
const currentUpgradeDepAmt = ref(0);
const currentUpgradeBetAmt = ref(0);
const currentClaimAllStatus = ref("CANT_CLAIM");
const refCarousel = ref();
const getVipLevelProgress = (lvl, status) => {
  if (lvl === 0 || !lvl) {
    currentUpgradeBetAmt.value = originalUpgradeBetAmounts.value[0];
    if (currentBetAmt.value > 0) {
      return (currentBetAmt.value / originalUpgradeBetAmounts.value[0]) * 100;
    }
    return 0;
  }
  if (vipItems.find((item) => item.claimAllStatus === "CAN_CLAIM")) {
    currentClaimAllStatus.value = "CAN_CLAIM";
  } else {
    currentClaimAllStatus.value = "CANT_CLAIM";
  }
  const vipInfo = vipItems.find((item) => +item.vipLevel === lvl);
  console.log(vipInfo);
  const vipLevel = +store.vip.replace("VIP", "");
  const currentDeposit = +store.getCurrentDeposit();
  currentUpgradeDepAmt.value = vipInfo.upgradeDepositAmount;
  currentUpgradeBetAmt.value = vipInfo.upgradeBetAmount;
  if (status === "bet") {
    if (currentBetAmt.value > currentUpgradeBetAmt.value) {
      return 100;
    }
    if (currentUpgradeBetAmt.value === 0) {
      return 0; // Avoid division by zero
    }
    return (currentBetAmt.value / currentUpgradeBetAmt.value) * 100;
  }

  if (status === "deposit") {
    // Ensure that currentDepAmt equals currentUpgradeDepAmt.value for 100%
    if (currentDepAmt.value > currentUpgradeDepAmt.value) {
      return 100;
    }
    if (currentUpgradeDepAmt.value === 0) {
      return 0; // Avoid division by zero
    }
    return (currentDepAmt.value / currentUpgradeDepAmt.value) * 100;
  }

  return 0; // Default return value if status doesn't match
};
// const loadingClaim = ref(false);
// const loadingMClaim = ref(false);
// const loadingBClaim = ref(false);
// const dailySlot = (bonusItem, vipType) => {
//   loadingClaim.value = true;
//   if (vipType === "monthly") {
//     loadingMClaim.value = true;
//   } else if (vipType === "birthday") {
//     loadingBClaim.value = true;
//   }
//   claimBonusItem(bonusItem)
//     .then((res) => {
//       if (res.code === 0) {
//         amount.value = "$" + res.data;
//         privilegeClaimedModalVisible.value = true;
//         loadingClaim.value = false;
//         loadingMClaim.value = false;
//         loadingBClaim.value = false;
//         store.getBalance();
//       } else {
//         notify.error(res.message);
//         loadingClaim.value = false;
//         loadingMClaim.value = false;
//         loadingBClaim.value = false;
//       }
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const terms = [
  { text: "会员累计投注额达到相应级别的要求，即可在次日 24 点前晋级相应 VIP 等级；" },
  { text: "VIP 等级达到相应的要求可每天晋升一级，但 VIP 等级不可越级晋升；" },
  { text: "会员在达到某 VIP 等级后，90 天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算；" },
  {
    text: "如果会员在一个季度（90 天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级；"
  },
  { text: "每个级别的升级礼金每位会员仅能获得 1 次（升级礼金 1 倍流水即可提款）；" },
  {
    text: "会员在注册 90 天内过生日，本年度内将不能领取生日礼金。另注册时间大于 90 天的会员需在生日当天的 VIP 页面进行自助领取，每年可领取一次（生日彩金 1 倍流水即可提款）；"
  },
  { text: "当月晋级后未晋级且达到保级要求，次月 1 日可领取保级彩金；" },
  { text: "首次保级成功后计算会员 12 个月内未降级（可晋级），彩金与第 13 个月首日进行派发；" },
  {
    text: "统计每日返水金额，对应 VIP 等级返水加赠比例派发。次日可领取每日反水加赠礼金，返水加赠礼金达到 10 元即可领取，礼金无流水限制；"
  },
  {
    text: "从每月会员日 15 号 00:00:00 起，相应等级的玩家只要在上月有一笔及其以上的存款，即可在活动页面领取一次会员红包（以领取时的等级为准），领取时间截至 24 号 23:59:59，仅需完成一倍流水，过期未领取视为放弃；"
  },
  {
    text: "非 0 级玩家从会员日 18 号 00:00:00 起均可在活动页面领取一张“10% 充值加码券”，领取时间截至 21 号 23:59:59，且领取后需在 7 日内使用充值加码券，成功使用后需在 15 日内完成相应流水要求；"
  },
  { text: "本加码券单日内不可与其他活动加码券同时使用；" },
  {
    text: "有效流水仅计算在游戏中产生输赢结果的注单，香港盘<0.75（中国盘<0.75）、欧洲盘<1.75、美洲盘<-133、马来盘<0.75 且>0，负赔率>-0.75 且＜0、走水、注单取消、对冲、未结算、连串过关、平半盘、提前结算不计算为有效流水；"
  },
  {
    text: "根据博彩公平有序规则，任何用户或团体以不正常的方式进行投注，如有风险投注、对赌行为或欺骗方式，本站保留权力在不通知的情况下冻结或关闭相关账户；"
  },
  {
    text: "此活动只适用于拥有一个账户的会员，每一个住址、每一个电子邮箱地址、每一个电话号码、相同支付方式及 IP 地址视为同一账户，若有违规者，将不享受此红利；"
  },
  { text: "为避免文字理解差异，东嬴电竞保留此活动最终解释权；" }
];

const vipTerms = [
  {
    text: `返水奖金根据北京时间每天 00:00:00-23:59:59 之间的有效投注额进行计算，所有游戏场馆投注额都是按照北京时间计算，返水彩金无需申请，系统会在次日下午 14:00 派发到您的主账户；`
  },
  {
    text: `东嬴电竞夺宝、捕鱼和彩票 不参与返水优惠；`
  },
  {
    text: `电竞/体育中的连串过关投注额返水将以注单结算时间为准。`
  },
  {
    text: `返水根据有效投注进行计算，在所有产品中，任何注单取消或本金退还，任何低于欧洲盘 1.7 或亚洲盘 0.7 水位的投注以及在同一游戏中同时投注对等盘口，将不计算在有效投注额内，赢半和输半只计算一半流水，体育提前注单按照实际输赢金额的绝对值作为有效投注；`
  },
  {
    text: `返水奖金可投注于任何平台游戏，奖金只需 1 倍投注额即可申请提款，最低返水 1 元，低于 1 元不予派发。`
  },
  {
    text: `此优惠促销只适用于拥有一个独立账户的玩家。住址、电子邮箱地址，电话号码，支付方式 (相同借记卡/信用卡/银行账户号码) IP 地址，同一网络环境等将可以作为判定是否独立玩家的条件。`
  },
  {
    text: `对于发现任何有违背、欺骗、或利用规则和条款进行非法获利的会员，东嬴保留在任何时候都可以停止、取消优惠或索回已支付的全部优惠的权利。`
  },
  {
    text: `在某些未知因素超出可控范围的情况下，东嬴保留可单方面执行的决定权，并承诺会在这类紧急问题发生时解释给客户原因并听取客户反馈与客户沟通协商解决。`
  },
  {
    text: `东嬴保留对本次活动的修订、终止和最终解释权，超出本网站控制外的技术错误，东嬴将不承担任何责任。`
  }
];

const showRebate = ref(true);
const currentDisplayTerms = ref(terms);
const onShowRebateClick = (flag) => {
  showRebate.value = flag;
  if (showRebate.value) currentDisplayTerms.value = terms;
  else currentDisplayTerms.value = vipTerms;
};

const badgeSrc = computed(() => {
  const currentVIP = +store.vip.replace("VIP", "");
  const matchedVIP = vipItems.find((vip) => +vip.vipLevel === currentVIP);
  return require(`../../assets/images/vip/level/vip${matchedVIP ? currentVIP : "1"}.png`);
});

const vipItems = reactive([
{
    vipLevel: "1",
    upgrade: "一笔存款",
    vipTitle: "青铜 II",
    imgName:"青铜 II"
  },
  {
    vipLevel: "2",
    upgrade: "3,000",
    vipTitle: "青铜 I",
    imgName:"青铜 I"
  },
  {
    vipLevel: "3",
    upgrade: "30,000",
    vipTitle: "白银 III",
    imgName:"白银 III"
  },
  {
    vipLevel: "4",
    upgrade: "80,000",
    vipTitle: "白银 II",
    imgName:"白银 II"
  },
  {
    vipLevel: "5",
    upgrade: "200,000",
    vipTitle: "白银 I",
    imgName:"白银 I"
  },
  {
    vipLevel: "6",
    upgrade: "400,000",
    vipTitle: "黄金 II",
    imgName:"黄金 III"
  },
  {
    vipLevel: "7",
    upgrade: "600,000",
    vipTitle: "黄金 I",
    imgName:"黄金 II"
  },
  {
    vipLevel: "8",
    upgrade: "1,000,000",
    vipTitle: "铂金",
    imgName:"黄金 I"
  },
  {
    vipLevel: "9",
    upgrade: "2,000,000",
    vipTitle: "钻石",
    imgName:"铂金 II"
  },
  {
    vipLevel: "10",
    upgrade: "4,000,000",
    vipTitle: "王者",
    imgName:"铂金 I"
  }
  // {
  //   vipLevel: "11",
  //   upgrade: "8,000,000",
  //   vipTitle: "钻石"
  // },
  // {
  //   vipLevel: "12",
  //   upgrade: "12,000,000",
  //   vipTitle: "最强王者"
  // }
]);
const maxVipLevel = ref(0);
const formatPercentageRange = (range) => {
  const percentages = range.split(" - "); // Split the range into two percentages
  const formattedPercentages = percentages.map(
    (percentage) => parseFloat(percentage).toFixed(2) // Convert to float and fix to two decimal places
  );
  return formattedPercentages.join("% - ") + "%"; // Join the formatted percentages
};
const banners = ref([]);
const getImages = () => {
  loadPromoBanner("VIP").then((res) => {
    if (res.code === 0) {
      banners.value = res.data;
    }
  });
};
const originalUpgradeBetAmounts = ref([]);
const isDataLoaded = ref(false);
const initVIPTable = async (wLoad) => {
  if (wLoad !== "noload") {
    isDataLoaded.value = false;
  }
  getImages();
  // const storedData = sessionStorage.getItem("vipData");

  // if (storedData) {
  //   var res = JSON.parse(storedData);
  //   const statuses = [
  //     "upgradeClaimStatus",
  //     "monthlyClaimStatus",
  //     "couponClaimStatus",
  //     "rebateClaimStatus",
  //     "retainClaimStatus",
  //     "yearlyRetainClaimStatus"
  //   ];

  //   statuses.forEach((status) => {
  //     res.data[status] = "CANT_CLAIM";
  //   });
  //   runVipAPI(res);
  // }
  var res = await store.getVIPInfo();

  runVipAPI(res);
};
const runVipAPI = (res) => {
  let _maxVipLevel = 0
  if (res.code === 0) {
    const { vipBonusVOList } = res.data;

    // Step 1: Extract original upgradeBetAmount values into an array.
    console.log('dan',vipBonusVOList)
    originalUpgradeBetAmounts.value = vipBonusVOList.map((item) => item.upgradeBetAmount);

    // Step 2: Shift values backward by one position.
    // const shiftedUpgradeBetAmounts = [];
    // for (let i = 0; i < originalUpgradeBetAmounts.length; i++) {
    //   if (i === 0) {
    //     shiftedUpgradeBetAmounts[i] = 0;  // The first value should be 0 or a base value
    //   } else {
    //     shiftedUpgradeBetAmounts[i] = originalUpgradeBetAmounts[i - 1]; // Shift backward
    //   }
    // }
    vipBonusVOList.forEach((vipBonusItem, i) => {
      // vipBonusItem.upgradeBetAmount = shiftedUpgradeBetAmounts[i];
      if (vipLevel.value === vipBonusItem.vipLevel) {
        vipBonusItem.holidayClaimStatus = "NO_STATUS";
        // vipBonusItem.rebateClaimStatus = "NO_STATUS";
      } else {
        vipBonusItem.holidayClaimStatus = "CANT_CLAIM";
        // vipBonusItem.rebateClaimStatus = "CANT_CLAIM";
      }
      // vipBonusItem.rebatePrize = formatPercentageRange(vipBonusItem.rebateRange);
      vipBonusItem.redPacketPrize = vipBonusItem.redPacketPrize + "%";
      const index = vipItems.findIndex((item) => item.vipLevel.toString() === vipBonusItem.vipLevel.toString());

      if (index !== -1) {
        // vipItems[index] = {
        //   ...vipItems[index],
        //   ...vipBonusItem
        // };

        vipItems.splice(index, 1, {
          ...vipItems[index],
          ...vipBonusItem
        });
      }
      if (vipBonusItem.vipLevel > _maxVipLevel) {
        _maxVipLevel = vipBonusItem.vipLevel
      }
    });
    currentDepAmt.value = res.data.currentDepositAmount;
    currentBetAmt.value = res.data.currentBetAmount;
    currentRetainAmount.value = res.data.currentRetainAmount;
    retainAmountRequired.value = res.data.retainAmountRequired;
    // balanceRetainAmount.value = +res.data.retainAmountRequired - +res.data.currentRetainAmount
    currentRetainDay.value = res.data.currentRetainDay;
    retainDayRequired.value = res.data.retainDayRequired;
    balanceRetainDay.value = +res.data.retainDayRequired - +res.data.currentRetainDay;
    currentRedPacketAmount.value = res.data.currentRedPacketAmount;
    getVipLevelProgress(vipLevel.value, "bet");
    isDataLoaded.value = true;
    maxVipLevel.value = _maxVipLevel
  } else {
    notify({ type: "error", message: res.message });
  }
  slideTo();
  changeSlideToIsFirstTime();
};
//TODO: 节日礼金去掉了
const categories = [
  { key: "upgrade", image: "upgrade", displayName: "晋级彩金" },
  { key: "monthly", image: "monthly", displayName: "每月 15 号红包" },
  { key: "coupon", image: "coupon", displayName: "充值加赠20% 奖金" },
  { key: "redPacket", image: "rebate", displayName: "每日额外返水红包" },
  { key: "retain", image: "retain", displayName: "保级彩金" },
  { key: "yearlyRetain", image: "yearly", displayName: "年度保级彩金" },
  { key: "birthday", image: "birthday", displayName: "生日礼金" }
  // { key: "holiday", image: "holiday", displayName: "节日礼金" }
];
// Group categories into pairs
const categoryPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < categories.length; i += 4) {
    pairs.push(categories.slice(i, i + 4));
  }
  console.log('dan', categories)
  return pairs;
});
const isLoading = reactive({});
const handleClick = async (key, item) => {
  if (key === "all" && currentClaimAllStatus.value === "CANT_CLAIM") {
    return notify({ type: "error", message: "当前没有可领取的内容" });
  }
  if (!isLoading[key]) {
    isLoading[key] = true; // Set loading state for this specific key
    const res = await claimItems(key, key === "all" ? item : item.vipLevel);

    if (res.code === 0) {
      if (key !== "all") {
        item[`${key}ClaimStatus`] = "CLAIMED";
      } else {
        // Get item that has the same level
        const vipInfo = vipItems.find((vip) => +vip.vipLevel === item);

        const statuses = [
          "upgradeClaimStatus",
          "birthdayClaimStatus",
          "monthlyClaimStatus",
          "couponClaimStatus",
          "redPacketClaimStatus",
          "retainClaimStatus",
          "yearlyRetainClaimStatus"
        ];

        statuses.forEach((status) => {
          if (vipInfo[status] === "CAN_CLAIM") {
            vipInfo[status] = "CLAIMED";
          }
        });
      }
      notify({ type: "success", message: "领取成功！" });
      store.getBalance();
      initVIPTable("noload");
      isLoading[key] = false;
    } else {
      notify({ type: "error", message: res.message });
      isLoading[key] = false;
    }

    isLoading[key] = false; // Reset loading state after operation completes
  }
};
const currentSlide = ref(9);
const isFirstTime = ref(true);
const currentCarousel = ref(0);
const currentBoxes = ref(0);
const handleSlideClick = (vipIndex) => {
  // if (currentSlide.value >= 10 && vipIndex <= 1) {
  //   refCarousel.value.next();
  // }
  // if (currentSlide.value <= 1 && vipIndex >= 10) {
  //   refCarousel.value.prev();
  // }
  if (vipIndex === currentSlide.value) {
    slideTo(vipLevel.value);
  } else {
    slideTo(vipIndex); // If you still want to slide to the clicked item
  }
};
const changeSlideToIsFirstTime = () => {
  isFirstTime.value = true;
};
const next = () => {
  refCarousel.value.next();
  isFirstTime.value = false;
};
const prev = () => {
  refCarousel.value.prev();
  isFirstTime.value = false;
};
const slideTo = (vipIndex) => {
  isFirstTime.value = false;
  if (vipIndex || vipIndex === 0) {
    if (store.token && currentBetAmt.value >= currentUpgradeBetAmt.value) {
      currentSlide.value = vipIndex;
      return;
    }
    currentSlide.value = vipIndex;
    return;
  }
  const vipLevel = +store.vip.replace("VIP", "");
  if (store.vip && currentBetAmt.value >= currentUpgradeBetAmt.value) {
    currentSlide.value = vipLevel;
    return;
  }
  if (!store.vip) {
    currentSlide.value = 9;
    return;
  }
  if (vipLevel === 0) {
    currentSlide.value = 0;
    return;
  }
  if(vipLevel === maxVipLevel.value) {
    currentSlide.value = maxVipLevel.value -1;
  }else {
    currentSlide.value = vipLevel;
  }
};
function formatNumber(value, type) {
  if (value === undefined) {
    return "-";
  }
  // Convert the string to a float
  const number = parseFloat(value);

  // Check if there are any decimal places
  if (number % 1 !== 0 || type === "redPacket") {
    // Return with two decimal places
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    // Return without decimal places
    return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
const tabActive = ref(1); // Bind this to the active tab

// Conditional logic for active states
const benefitActive = computed(() => tabActive.value === 1);
const rebateActive = computed(() => tabActive.value === 2);
// watch(
//   () => store.token,
//   () => {
//     initVIPTable();
//   },
//   { immediate: true }
// );

const openGame = (gameName, code, gameCode) => {
  gameModalRef.value.open(gameName, code, gameCode);
};

const handleBannerClick = (url) => {
  const openPattern = /^open\/(.*)/;
  if (url.match(openPattern)) {
    const extractedUrl = url.match(openPattern)[1];
    const [gameName, platformCode, gameCode] = extractedUrl.split("/");
    openGame(gameName, platformCode, gameCode);
  } else if (url === "0") {
    return;
  } else if (url.startsWith("/")) {
    router.push(url);
  } else {
    router.push({ path: "/promo", query: { name: url } });
  }
};

onActivated(() => {
  initVIPTable();
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
    // background: url("../../assets/images/vip/button.png") no-repeat center center;
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
  z-index: 0;
  position: relative;
  background-image: url("../../assets/images/vip/vip-bg.jpg");
  background-color: #f3f7fd;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-attachment: fixed;
  color: #8d8d8d;
  min-height: 100vh;
  padding: 0 0 80px;

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
    border: 2px solid #624215;  /* Light gold color */
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 4px auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .header-section {
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
    // background: url("../../assets/images/vip/banner.png") no-repeat center center;
    background-size: cover;
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
              color: #ffffff;
              background: url(../../assets/images/vip/claim-btn-disabled.png)no-repeat center center;
              background-size: contain;
              width: 95%;
            }
          }
          .claimed,
          .expired {
            // background: url(../../assets/images/vip/claim-btn-claimed.png)no-repeat center center;
            // background-size: contain;
            // background: linear-gradient(90deg, #F1DDA0 0%, #FFCC80 100%);
            // color: #ffffff;
            color: #9b6f35;
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
            // background: url(../../assets/images/vip/claim-btn-disabled.png)no-repeat center center;
            // background-size: contain;
            // color: #FFFFFF;
            color: #999999;
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
        text-align: center;
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
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    position: relative;
    width: 400px;
    height: 520px;
    max-width: 250px;
    max-height: 350px;
    background: url("../../assets/images/vip/cardbg.png") no-repeat top center;
    background-size: contain;
    &9,
    &10,
    &11,
    &12 {
      background: url("../../assets/images/vip/cardbg-shiny.png") no-repeat top center;
      background-size: contain;
    }

    // &2 {
    //   background: url("../../assets/images/vip/badge/banner-2.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &3 {
    //   background: url("../../assets/images/vip/badge/banner-3.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &4 {
    //   background: url("../../assets/images/vip/badge/banner-4.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &5 {
    //   background: url("../../assets/images/vip/badge/banner-5.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &6 {
    //   background: url("../../assets/images/vip/badge/banner-6.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &7 {
    //   background: url("../../assets/images/vip/badge/banner-7.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &8 {
    //   background: url("../../assets/images/vip/badge/banner-8.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &9 {
    //   background: url("../../assets/images/vip/badge/banner-9.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &10 {
    //   background: url("../../assets/images/vip/badge/banner-10.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &11 {
    //   background: url("../../assets/images/vip/badge/banner-11.png") no-repeat top center;
    //   background-size: contain;
    // }

    // &12 {
    //   background: url("../../assets/images/vip/badge/banner-12.png") no-repeat top center;
    //   background-size: contain;
    // }
    .vipLevelReachStatus {
      // background: url("../../assets/images/vip/badge/vip-level-banner-status-ribbon-unachieved.png") no-repeat left center;
      background-size: contain;
      margin-top: 15px;
      margin-left: 2px;
      z-index: 1;
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
    }
  }

  .vip-program {
    margin: 50px auto;
    max-width: 1300px;
    width: 95%;

    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      border: $border-settings;

      th {
        border-bottom: $border-settings;
        background-color: #f9fafb;
        color: #6b7280;
      }

      td {
        color: #111827;
        border-right: $border-settings;

        &:has(.disable) {
          background-color: #e7e7e74f;
        }
      }

      th,
      td {
        padding: 16px 24px 16px 24px;
        border-bottom: $border-settings;
      }
    }

    .buttons {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border: 1px solid #fce9c5;
      border-radius: 58.321px;
      width: fit-content;
      margin: 0px auto 20px auto;

      .common-btn {
        display: block;
        text-align: center;
        color: #858585;
        background: #f9fcff;
        border: 0px;
        border-radius: 58.321px;
        padding: 8px 30px;
        font-size: 18px;
        font-weight: 700;
        transition: all 0.3s;
        filter: brightness(1);
        margin: 5px;

        &:hover {
          filter: brightness(0.9);
        }

        &.active {
          background: linear-gradient(90deg, #e5cda5 0.87%, #b48f57 100%);
          box-shadow: 0px 4px 4px 0px #ffffff40 inset;
          box-shadow: 0px -4px 4px 0px #89520040 inset;
          color: #fff;
        }
      }
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
      &.gz {
        img {
          max-width: 140px;
          width: 100%;
          margin-bottom: -10px;
        }
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
        // background: url(../../assets/images/vip/decal.png);
        // width: 70px;
        // height: 70px;
        height: 30px;
        width: 30px;
        display: block;
        background-size: cover;
      }
      &:after {
        content: "";
        // background: url(../../assets/images/vip/decal.png);
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

      .term {
        max-width: 1300px;
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
    &:first-child {
      margin-right: 4px;
      padding-right: 4px;
    }
    &:last-child {
      margin-left: -4px;
      padding-left: 8px;
    }
  }
  :deep(.carousel__track) {
    transform-style: preserve-3d;
    margin: 0;
  }
  .carousel__pagination {
    padding: 0;
    margin: 10px;
    gap: 5px;
  }
  :deep(.carousel__pagination-button:after) {
    background: #ffffff80;
    border-radius: 10px;
    padding: 0;
    width: 8px;
    height: 8px;
  }
  :deep(.carousel__pagination-button--active:after) {
    background: #f1dda0;
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
    // background: url("../../assets/images/vip/nextprev.png");
    background-size: contain;
    // padding: 5px;
    margin: 0px;
    transform: translate3d(-20px, -20px, 10px);
    display: none;
  }
  :deep(.carousel__next) {
    // z-index: 2001 !important;
    // background: url("../../assets/images/vip/nextprev.png");
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

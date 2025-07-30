<template>
  <q-tabs v-model="activeTab" class="dashboard-tabs" color="black" no-caps indicator-color="transparent">
    <q-tab name="commission">
        Available Commission
    </q-tab>
    <q-tab name="currency">
        Commission by currency
    </q-tab>
    <q-tab name="upgrade">
        Upgrade
    </q-tab>
  </q-tabs>
  <q-tab-panels
      v-model="activeTab"
      class="active-tab-panels"
    >
      <q-tab-panel name="commission">

      </q-tab-panel>
      <q-tab-panel name="currency">
        <div class="card">
            <div class="section">
                <div class="sectrow">
                    <div class="title">Available Commission Incentives</div>
                    <div class="info"><img src="../../assets/images/earn-money/info.png"></div>
                </div>
                <div class="amount">{{ store.currency.value }}0.00</div>
                <div class="sectrow">
                    <div class="title">Total Received</div> 
                </div>
            </div>
            <div class="section last">
                <div class="sectrow">
                    <div class="title">Available Referral Rewards</div>
                    <div class="info"><img src="../../assets/images/earn-money/info.png"></div>
                </div>
                <div class="amount">{{ store.currency.value }}0.00</div>
                <div class="sectrow">
                    <div class="title">Total Received <span>$0.00</span></div> 
                    
                </div>
                <div class="sectrow">
                    <div class="title">Additional Reward <span>$3000.00</span></div> 
                    
                </div>
            </div>
        </div>
        <div class="card">
            <div class="searchbar">
                Date: 2025/04/26 - 2025/07/25
            </div>
            <div class="table-header">
                <div class="phone">Phone number</div>
                <div class="total">Total Reward</div>
            </div>
            <div class="invitation-details">
                <div class="invite">Invalid Invitation: <span>1</span></div>
                <div class="invite">Valid Invitation: <span>1</span></div>
            </div>
            <div class="table-items" v-for="(item, i) in commissionList" :key="i">
                <div class="phone">{{ item.phone }}</div>
                <div class="total">{{ item.total }}<span class="arrow"></span></div>
            </div>
            
        </div>
      </q-tab-panel>
    
      <q-tab-panel name="upgrade">

      </q-tab-panel>
    </q-tab-panels>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { userStore } from "src/stores";
const store = userStore();
const activeTab = ref("currency");
const commissionList = ref([]);

onMounted(() => {
    commissionList.value = [
        {
            phone: '51522zzwlwlbb11',
            total: 0
        },
        {
            phone: '51522zzwlwlbb11',
            total: 0
        },
        {
            phone: '51522zzwlwlbb11',
            total: 0
        },
    ]
})
</script>
<style lang="scss" scoped>
.q-tab-panels {
    background: unset;
}
    :deep(.q-tab-panel) {
        background: unset;
        padding: 20px 0;
    }
 .dashboard-tabs {
    :deep(.q-tabs__content) {
      // background: #422171;
      border-radius: 12px;
      padding: 4px;
      gap: 20px;
    }

    :deep(.q-tab) {
      // margin: 0 15px;
      margin: 0;
      color: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      width: 280px;
      background: transparent;
      border: 1px solid #ffffff;
      font-size: 12px;
      font-weight: 500;
      padding: 0 20px;
      
      svg {
        filter: brightness(0.5);
      }
    }

    :deep(.q-tab__content) {
      gap: 2px;
    }

    :deep(.q-tab--active) {
      color: white;
      background: linear-gradient(187.94deg, rgba(255, 255, 255, 0.8) 5.77%, #8EB5FF 93.57%);
      border: unset;
      color: #5C46E7;
      // border: 2px solid #422171;

      svg {
        fill: white;
        filter: brightness(1);
      }
    }
  }
  .card {
        background: linear-gradient(180deg, #8b36f859 0%, #334ad657 100%);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
    .section {
        border-bottom: 1px solid #ffffff1A;
        
        padding: 0px 0 15px 0px;
        &.last {
            border-bottom: 0;
            padding: 15px 0 5px 0px;
        }
        .sectrow {
            color: #FFFFFFCC;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .info {
                img {
                    width: 20px;
                    display: block;
                }
            }
            .title {
                span {
                    color: #ffffff;
                    font-weight: bold;
                }
            }
        }
        .amount {
            color: #30E3FF;
            margin: 10px 0;
            font-size: 22px;
            font-weight: bold;
        }
    }
    .searchbar {
        background: linear-gradient(325.86deg, #1E1236 5.38%, #2F1661 98.11%);
        border: 1px solid #7753C2;
        border-radius: 6px;
        padding: 10px;
        color: #ffffff7d;
    }
    .table-header {
        display: flex;
        justify-content: space-between;
        margin: 20px auto;
    }
    .invitation-details {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
        .invite {
            span {
                font-weight: bold;
            }
        }

    }
    .table-items {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #ffffff1a;
        padding: 10px 0;
        .total {
            color: #30E3FFCC;
        }
    }
  }
</style>
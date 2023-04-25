<template>
  <div>
    <div v-if="store.hasToken()" class="table-details">
      <div class="searchbar">
        <q-form layout="inline" :model="searchForm">
          <div class="left q-gutter-sm">
            <q-input clearable placeholder="select date" filled v-model="searchForm.regTime">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="searchForm.regTime" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input placeholder="Name" filled v-model="searchForm.loginName" />
          </div>
              <q-btn
                class="q-mt-md"
                label="Search"
                color="brand"
                @click="searchRecord"
                :loading="btnLoading"
              />
        </q-form>
      </div>
      <q-table :loading="btnLoading" no-data-label="No data"
          loading-label="Loading..."
          class="q-mt-md"
          :columns="tableColumns"
          :rows="dataSource"
          row-key="id">
      </q-table>
    </div>
   
    <div class="invitePromo">
      <p class="menu-title" style="font-weight: bold;">
        Invite friends, get rewards
      </p>
      <div>
        <p class="menu-title sub inv-title">Event Time</p>
        <p style="margin-bottom: 30px">
          Starting 20/11/2022 time 00:00:00 (GMT+8)
        </p>

        <p class="menu-title sub inv-title">Event Details</p>
        <p style="margin-bottom: 30px">
          Jolly88 Member Open : Personal - Click "Invite Friends"
          To copy the promotional link, share via Facebook, LINE, Instagram, what's
          app, telegram and YouTube, etc.
          When successfully inviting friends, get instant cash rewards!
        </p>
      <q-btn color="brand" class="fit q-mb-lg" to="/share">Share Now</q-btn>
        <div class="table-inv">
        <table style="width: 600px;">
          <tbody>
            <tr>
              <th>Level</th>
              <th>
                Invite new friends to top up for the first time.
              </th>
              <th>GET BONUS MONEY</th>
              <th>Turn round requirements</th>
            </tr>
            <tr>
              <td>Level 1</td>
              <td>≥฿500</td>
              <td>48</td>
              <td rowspan="6" colspan="1">1x/unlimited turns</td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>≥฿1,000</td>
              <td>68</td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>≥฿5,000</td>
              <td>288</td>
            </tr>
            <tr>
              <td>Level 4</td>
              <td>≥฿10,000</td>
              <td>688</td>
            </tr>
            <tr>
              <td>Level 5</td>
              <td>≥฿50,000</td>
              <td>1,898</td>
            </tr>
            <tr>
              <td>Level 6</td>
              <td>≥฿100,000</td>
              <td>3,898</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p style="text-align: left; color: #00ff16; margin-top: 10px">
          For example: Member A invites friends to deposit 500 baht for the first time.
          Then he will receive a bonus of 48 baht if he wants to get the next level to 68 baht.
          He needs to deposit another 1000 baht. The bonus will be paid automatically to your wallet.
          if next week The friend you invited still has a full deposit balance.
          You will receive another bonus next week.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios"
import moment from "moment";
import { userStore } from "src/stores";

var qs = require("qs");
export default defineComponent({
  name: 'SJBPromo',
  setup() {
    const $q = useQuasar();
    const btnLoading = ref(false)
    const pagination = reactive({
      pageSize: 5,
      total: 50,
    });
    const dataSource = ref([]);
    const tableColumns = [
      {
        label: "ID",
        field: "id",
      },
      {
        label:"Login Name",
        field: "loginName",
      },
      {
        label: "Registration Time",
        field: "regTime",
      },
      {
        label: "Deposit Amount",
        field: "depositAmount",
      },
      {
        label: "Bonus received",
        field: "bonusReceived",
      },
      {
        label: "Receive Date",
        field: "dateReceived",
      },
    ];
    const recordPage = (pagination) => {
      searchRecord();
    };
    const store = userStore()
    const searchForm = reactive({
       regTime: null,
       loginName: null,
    });
    
    const searchRecord = () => {
      btnLoading.value = true;
      if (searchForm.loginName === '') {
        searchForm.loginName = null
      }
      if (searchForm.regTime === '') {
        searchForm.regTime = null
      }
      api.get("/session/referred", {
        params:{
          memberId: store.id,
          loginName: searchForm.loginName,
          regTime: searchForm.regTime
        }
      }
    )
        .then((ret) => {
          const res = ret.data;
          if (res.code === 0) {
            dataSource.value = res.data.records;
            btnLoading.value = false;
          }
        }).catch((err) => {
           console.log(err)
           btnLoading.value = false;
        })
    };
    onMounted(() => {
      if (store.token) {
        recordPage()
      }
    });
    return {
      tableColumns,
      dataSource,
      recordPage,
      pagination,
      btnLoading,
      searchForm,
      searchRecord,
      store
    };
  },
});
</script>
<style scoped lang="scss">

.invitePromo {
  text-align: center;
  background: url(../../../assets/images/promotion/hotpromo/35/orangeborder.png)
    no-repeat center center;
  background-size: cover;
  padding: 10px;
  height: 100%;
  min-height: 1010px;
  margin: 20px auto 0;
  .table-inv {
    width: 100%;
    overflow: auto;
    tr th {
      background: #db7e42;
      padding: 10px;
    }
    tr {
      &:nth-child(even) {
        background: #2b2b4b;
      }
    }
    tr td {
      padding: 10px;
    }

  }
  .inv-title {
    font-size: 1.5em;
    display: inline-block;
    vertical-align: middle;
    &:before {
      content: "";
      // padding: 5px 30px;
      padding: .4em .8em;
      background: url(../../../assets/images/promotion/hotpromo/35/left.png)
        no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    &:after {
      content: "";
      // padding: 5px 30px;
      padding: .4em .8em;
      background: url(../../../assets/images/promotion/hotpromo/35/right.png)
        no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
</style>

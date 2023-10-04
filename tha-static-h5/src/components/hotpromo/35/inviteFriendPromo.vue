<template>
  <div>
    <div v-if="store.hasToken()" class="table-details">
      <div class="searchbar">
        <q-form layout="inline" :model="searchForm">
          <div class="left q-gutter-sm">
            <q-input clearable
                     :placeholder="$t('lang.select_date')" filled v-model="searchForm.regTime">
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
                          :label="$t('lang.close_btn')"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input :placeholder="$t('lang.name')" filled v-model="searchForm.loginName" />
          </div>
              <q-btn
                class="q-mt-md"
                :label="$t('lang.search')"
                color="brand"
                @click="searchRecord"
                :loading="btnLoading"
              />
        </q-form>
      </div>
      <q-table :loading="btnLoading" :no-data-label="$t('lang.no_data_label')"
          :loading-label="$t('lang.loading')"
          class="q-mt-md"
          :columns="tableColumns"
          :rows="dataSource"
          row-key="id">
      </q-table>
    </div>

    <div class="invitePromo">
      <p class="menu-title" style="font-weight: bold;">
        {{ $t('lang.invite_friend_to_receive_prize') }}
      </p>
      <div>
        <p class="menu-title sub inv-title">{{ $t('lang.event_time') }}</p>
        <p style="margin-bottom: 30px">
          {{ $t('lang.start_time') }} 20/11/2022 เวลา 00:00:00 (GMT+8)
        </p>

        <p class="menu-title sub inv-title">{{ $t('lang.event_details') }}</p>
        <p style="margin-bottom: 30px">
          {{
            $t('lang.event_details_content')
          }}
        </p>
      <q-btn color="brand" class="fit q-mb-lg" to="/share">{{ $t('lang.share_now')}}</q-btn>
        <div class="table-inv">
        <table style="width: 600px;">
          <tbody>
            <tr>
              <th>{{ $t('lang.level_grade') }}</th>
              <th>
                {{ $t('lang.ivnite_fren_first_time') }}
              </th>
              <th>รับเงินโบนัส</th>
              <th>ข้อกำหนดรอบเทิร์น</th>
            </tr>
            <tr>
              <td>Level 1</td>
              <td>≥฿501</td>
              <td>48</td>
              <td rowspan="6" colspan="1">1เท่า/ไม่จำกัดรอบ</td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>≥฿1,001</td>
              <td>68</td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>≥฿5,001</td>
              <td>288</td>
            </tr>
            <tr>
              <td>Level 4</td>
              <td>≥฿10,001</td>
              <td>688</td>
            </tr>
            <tr>
              <td>Level 5</td>
              <td>≥฿50,001</td>
              <td>1,898</td>
            </tr>
            <tr>
              <td>Level 6</td>
              <td>≥฿100,001</td>
              <td>3,898</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p style="text-align: left; color: #00ff16; margin-top: 10px">
          ตัวอย่างเช่น: สมาชิก A ชวนเพื่อนฝากเงิน 500 บาทเป็นครั้งแรก
          จากนั้นเขาจะได้รับโบนัส 48 บาท หากต้องการรับระดับถัดไปเป็น 68 บาท
          เขาต้องฝากอีก 1,000 บาท โบนัสจะจ่ายไปยังกระเป๋าเงินของคุณโดยอัตโนมัติ
          หากสัปดาห์หน้า เพื่อนที่คุณเชิญยังคงมียอดเงินฝากครบ
          คุณจะได้รับโบนัสอีกครั้งในสัปดาห์หน้า
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
        label:"ชื่อเข้าใช้",
        field: "loginName",
      },
      {
        label: "เวลาลงทะเบียน",
        field: "regTime",
      },
      {
        label: "จํานวนเงินฝาก",
        field: "depositAmount",
      },
      {
        label: "ได้รับโบนัสแล้ว",
        field: "bonusReceived",
      },
      {
        label: "วันที่รับ",
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

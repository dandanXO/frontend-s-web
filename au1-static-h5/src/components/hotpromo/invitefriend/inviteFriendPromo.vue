<template>
  <div>
    <div v-if="store.hasToken()" class="table-details">
      <div class="searchbar">
        <q-form layout="inline" :model="searchForm">
          <div class="left q-gutter-sm">
            <q-input clearable placeholder="选择日期" filled v-model="searchForm.regTime">
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
            <q-input placeholder="姓名" filled v-model="searchForm.loginName"/>
          </div>
          <q-btn
            class="q-mt-md"
            label="搜索"
            color="brand"
            @click="searchRecord"
            :loading="btnLoading"
          />
        </q-form>
      </div>
      <q-table :loading="btnLoading" no-data-label="数据为空"
               loading-label="加载中..."
               class="q-mt-md"
               :columns="tableColumns"
               :rows="dataSource"
               row-key="id">
      </q-table>
    </div>

    <div class="invitePromo">
      <p class="menu-title" style="font-weight: bold;">
        邀请好友，领取奖励
      </p>
      <div>
        <p class="menu-title sub inv-title">活动时间</p>
        <p style="margin-bottom: 30px">
          开始时间 20/11/2022 时间 00:00:00 (GMT+8)
        </p>

        <p class="menu-title sub inv-title">活动详情</p>
        <p style="margin-bottom: 30px">
          兴發会员：点击“邀请朋友”以复制邀请链接，并通过 Facebook、LINE、Instagram、WhatsApp、Telegram 和 YouTube
          等分享。成功邀请朋友后，即可立即获得现金奖励！
        </p>
        <q-btn color="brand" class="fit q-mb-lg" to="/share">马上分享</q-btn>
        <div class="table-inv">
          <table style="width: 600px;">
            <tbody>
            <tr>
              <th>等级</th>
              <th>邀请新朋友首次充值。</th>
              <th>可领取奖金
              </th>
              <th>提取要求
              </th>
            </tr>
            <tr>
              <td>Level 1</td>
              <td>500元</td>
              <td>48</td>
              <td rowspan="6" colspan="1">1次/无限次</td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>1,000元</td>
              <td>68</td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>5,000元</td>
              <td>288</td>
            </tr>
            <tr>
              <td>Level 4</td>
              <td>10,000元</td>
              <td>688</td>
            </tr>
            <tr>
              <td>Level 5</td>
              <td>50,000元</td>
              <td>1,898</td>
            </tr>
            <tr>
              <td>Level 6</td>
              <td>100,000元</td>
              <td>3,898</td>
            </tr>
            </tbody>
          </table>
        </div>
        <p style="text-align: left; color: #00ff16; margin-top: 10px">
          例如：会员 A 邀请朋友首次存款 500 人民币，然后他将获得 48 人民币的奖金。如果他想获得下一个级别的奖金，即 68
          人民币，他需要再存款
          1,000 人民币。奖金将自动支付到您的钱包中。如果在下周，您邀请的朋友的存款总额达到了指定额度，您将在下下周再次获得奖金。
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {useQuasar} from "quasar";
import {api} from "boot/axios"
import moment from "moment";
import {userStore} from "src/stores";

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
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "登录名",
        dataIndex: "loginName",
      },
      {
        title: "注册时间",
        dataIndex: "regTime",
      },
      {
        title: "充值数目",
        dataIndex: "depositAmount",
      },
      {
        title: "获得奖励",
        dataIndex: "bonusReceived",
      },
      {
        title: "获得时间",
        dataIndex: "dateReceived",
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
          params: {
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
  //background: url(../../../assets/images/promotion/hotpromo/35/orangeborder.png) no-repeat center center;
  background-size: cover;
  padding: 10px;
  height: 100%;
  //min-height: 1010px;
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
      //background: url(../../../assets/images/promotion/hotpromo/35/left.png) no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }

    &:after {
      content: "";
      // padding: 5px 30px;
      padding: .4em .8em;
      //background: url(../../../assets/images/promotion/hotpromo/35/right.png) no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
</style>

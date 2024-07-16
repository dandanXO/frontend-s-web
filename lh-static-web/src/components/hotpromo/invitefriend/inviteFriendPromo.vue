<template>
  <div>
    <div v-if="store.token" class="table-details">
      <div style="margin-bottom: 20px">
        <el-form layout="inline" :model="searchForm">
          <el-row gutter="20" class="left">
            <el-col span="6">
            <el-form-item>
              <el-date-picker
                  v-model="searchForm.regTime"
                  valueFormat="yyyy-MM-DD"
                  placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item>
              <el-input
                  v-model="searchForm.loginName"
                  placeholder="姓名"
              />
            </el-form-item>
          </el-col>
          <el-col span="6">
          <el-form-item class="search">
            <el-button
                class="common-btn"
                type="submit"
                @click="searchRecord"
            >
              ค้นหา
            </el-button>
          </el-form-item></el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="dataSource"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="loginName" label="登录名" />
        <el-table-column prop="regTime" label="注册时间" />
        <el-table-column prop="depositAmount" label="充值数目" />
        <el-table-column prop="bonusReceived" label="获得奖励" />
        <el-table-column prop="dateReceived" label="获得时间" />
      </el-table>
    </div>
    <div class="invitePromo">
      <p class="game-title" style="font-weight: bold; margin-top: 30px">
        邀请好友，领取奖励
      </p>
      <div>
        <p class="game-title sub inv-title">活动时间</p>
        <p style="margin-bottom: 30px">
          开始时间 20/11/2022 时间 00:00:00 (GMT+8)
        </p>

        <p class="game-title sub inv-title">活动详情</p>
        <p style="margin-bottom: 30px">
          雷火会员：点击“邀请朋友”以复制邀请链接，并通过 Facebook、LINE、Instagram、WhatsApp、Telegram 和 YouTube
          等分享。成功邀请朋友后，即可立即获得现金奖励！
        </p>
        <router-link
            to="/center/share"
            style="display: block; width: 200px; margin: 0 auto 40px"
        >
          <button class="common-btn" style="width: 100%">马上分享
          </button>
        </router-link>
        <div class="table-inv">
          <table style="width: 100%; min-width: 600px">
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
import {userStore} from "@/store";
import {defineComponent, ref, reactive, onMounted} from "vue";
import {getInviteFriendList} from "@/api/index/promo";
import { useNotify } from "@/hooks/notify";


export default defineComponent({
  name: "InviteFriendPromo",
  setup() {
    const notify = useNotify();
    const btnLoading = ref(false);
    const loading = ref(true);
    const pagination = reactive({
      pageSize: 5,
      total: 5,
    });
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
    const dataSource = reactive([]);
    const searchForm = reactive({
      regTime: null,
      loginName: null,
      current: 1,
    });
    const store = userStore();
    const searchRecord = () => {
      loading.value = true;
      if (searchForm.loginName === "") {
        searchForm.loginName = null;
      } else if (searchForm.regTime === "") {
        searchForm.regTime = null;
      }
      const obj = {
        memberId: store.id,
        loginName: searchForm.loginName,
        regTime: searchForm.regTime,
        current: searchForm.current,
      };
      getInviteFriendList(obj)
          .then((response) => {
            if (response.code === 0) {
              pagination.total = response.data.total;
              dataSource.splice(0);
              dataSource.push(...response.data.records);
            } else {
              notify({
                type: "error",
                message: response.message
              });
            }
          })
          .catch((error) => {
            console.log("error", error);
            // message.error( error.message, 4 );
          })
          .then(() => {
            loading.value = false;
          });
    };
    const recordPage = (pagination) => {
      searchForm.current = pagination.current;
      searchRecord();
    };
    onMounted(() => {
      if (store.token) {
        searchRecord();
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
      store,
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.ant-select:hover .ant-select-clear) {
  background: #2b2b4b;
}

.account-container {
  .account-content-wrapper {
    .unbind-record-wrapper {
      margin-top: 20px;
    }

    .common-btn {
      cursor: pointer;

      &.search-btn {
        margin-top: 0;
        font-size: 14px;
      }
    }

    .transit .ant-form {
      display: flex;
      justify-content: space-between;
    }

    .ant-form-inline .ant-form-item.search {
      margin-right: 0;
    }
  }
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.invitePromo {
  text-align: center;
  //background: url(../../../assets/images/promotion/hotpromo/35/orangeborder.png)
  //no-repeat center center;
  background-size: cover;
  padding: 10px;
  height: 100%;
  //min-height: 1010px;
  margin: 0 auto;

  .table-inv {
    width: 100%;
    overflow: auto;

    table {
      tr th {
        background: #037395;
        padding: 10px;
      }

      tr td {
        padding: 10px;

        &:nth-child(even),
        &:nth-child(odd) {
          background: unset;
        }
      }

      tr {
        &:nth-child(even) {
          background: #2b2b4b;
        }
      }
    }
  }

  .inv-title {
    display: inline-block;
    vertical-align: middle;

    &:before {
      content: "";
      padding: 20px 100px;
      //background: url(../../../assets/images/promotion/hotpromo/35/left.png)
      //no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }

    &:after {
      content: "";
      padding: 20px 100px;
      //background: url(../../../assets/images/promotion/hotpromo/35/right.png)
      //no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }

  .game-title {
    font-size: 30px;
    line-height: 50px;
    color: #06a2b5;
    text-align: center;
    background-image: linear-gradient(to right, #de4545, #db7e42);
    -webkit-background-clip: text;
  }
}

@media (max-width: 768px) {
  .left {
    flex-direction: column;
    margin-bottom: 10px;
    width: 100%;
    gap: 10px;

    :deep(.ant-form-item) {
      margin-right: 0;
    }
  }
  .invitePromo {
    .inv-title {
      font-size: 1.5em;
      display: inline-block;
      vertical-align: middle;

      &:before {
        content: "";
        // padding: 5px 30px;
        padding: 0.4em 0.8em;
        //background: url(../../../assets/images/promotion/hotpromo/35/left.png)
        //no-repeat center center;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }

      &:after {
        content: "";
        // padding: 5px 30px;
        padding: 0.4em 0.8em;
        //background: url(../../../assets/images/promotion/hotpromo/35/right.png)
        //no-repeat center center;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
      }
    }
  }
}
</style>

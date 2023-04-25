<template>
  <div>
    <div v-if="store.token" class="table-details">
      <div style="margin-bottom: 20px">
        <a-form layout="inline" :model="searchForm">
          <div class="left">
            <a-form-item>
              <a-date-picker
                v-model:value="searchForm.regTime"
                valueFormat="yyyy-MM-DD"
                placeholder="เลือกวันที่"
              />
            </a-form-item>
            <a-form-item>
              <a-input
                v-model:value="searchForm.loginName"
                placeholder="ชื่อ"
              />
            </a-form-item>
          </div>
          <a-form-item class="search">
            <button
              class="common-btn outline search-btn"
              type="submit"
              @click="searchRecord"
            >
              ค้นหา
            </button>
          </a-form-item>
        </a-form>
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="dataSource"
        :row-key="(record) => record.id"
        :loading="btnLoading"
        :pagination="pagination"
        @change="recordPage"
      >
      </a-table>
    </div>
    <div class="invitePromo">
      <p class="game-title" style="font-weight: bold; margin-top: 30px">
        เชิญเพื่อน รับเงินรางวัล
      </p>
      <div>
        <p class="game-title sub inv-title">เวลากิจกรรม</p>
        <p style="margin-bottom: 30px">
          เริ่ม 20/11/2022 เวลา 00:00:00 (GMT+8)
        </p>

        <p class="game-title sub inv-title">รายละเอียดกิจกรรม</p>
        <p style="margin-bottom: 30px">
          สมาชิก Jolly88 เปิด : ส่วนบุคคล - คลิก "เชิญเพื่อน"
          เพื่อคัดลอกลิงก์โปรโมชั่น แชร์ผ่าน Facebook, LINE, Instagram, what's
          app, telegram และ YouTube ฯลฯ
          เมื่อเชิญเพื่อนสำเร็จรับรางวัลเงินสดทันที!
        </p>
        <router-link
          to="/center/share"
          style="display: block; width: 200px; margin: 0 auto 40px"
        >
          <button class="common-btn" style="width: 100%">แชร์ตอนนี้</button>
        </router-link>
        <div class="table-inv">
          <table style="width: 100%; min-width: 600px">
            <tbody>
              <tr>
                <th>ระดับ</th>
                <th>เชิญเพื่อนใหม่เติมเงินครั้งแรก</th>
                <th>รับเงินโบนัส</th>
                <th>ข้อกำหนดรอบเทิร์น</th>
              </tr>
              <tr>
                <td>Level 1</td>
                <td>≥฿500</td>
                <td>48</td>
                <td rowspan="6" colspan="1">1เท่า/ไม่จำกัดรอบ</td>
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
import { userStore } from "@/store";
import { defineComponent, ref, reactive, onMounted } from "vue";
import { getInviteFriendList } from "../../../api/index/promo";

export default defineComponent({
  name: "InviteFriendPromo",
  setup() {
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
        title: "ชื่อเข้าใช้",
        dataIndex: "loginName",
      },
      {
        title: "เวลาลงทะเบียน",
        dataIndex: "regTime",
      },
      {
        title: "จํานวนเงินฝาก",
        dataIndex: "depositAmount",
      },
      {
        title: "ได้รับโบนัสแล้ว",
        dataIndex: "bonusReceived",
      },
      {
        title: "วันที่รับ",
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
          }
        })
        .catch((error) => {
          console.log("error", error);
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
  background: url(../../../assets/images/promotion/hotpromo/35/orangeborder.png)
    no-repeat center center;
  background-size: cover;
  padding: 30px;
  height: 100%;
  min-height: 1010px;
  margin: 0 auto;
  .table-inv {
    width: 100%;
    overflow: auto;
    table {
      tr th {
        background: #db7e42;
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
      background: url(../../../assets/images/promotion/hotpromo/35/left.png)
        no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    &:after {
      content: "";
      padding: 20px 100px;
      background: url(../../../assets/images/promotion/hotpromo/35/right.png)
        no-repeat center center;
      background-size: contain;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
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
        padding: 0.4em 0.8em;
        background: url(../../../assets/images/promotion/hotpromo/35/right.png)
          no-repeat center center;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
      }
    }
  }
}
</style>

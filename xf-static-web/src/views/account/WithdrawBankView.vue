<template>
  <div>
    <div class="account-title-container">
      <span class="account-title">添加银行卡</span>
    </div>
    <div class="account-content">
      <div class="account-tip-text wbot">
        <!-- <el-icon><InfoFilled /></el-icon> -->
      </div>
      <!-- <div class="addbuttons">
        <div
          class="flex-box flex-align-center flex-justify-center bank-card-item add-bank-card"
          @click="bankCardModal('bank')"
        >
          <RiLink />
          เพิ่มบัตร
        </div>
      </div> -->
      <div class="flex-box flex-wrap bank-card-list">
        <div
          class="bank-card-item"
          :class="{
            active: index === isCardActive,
            inactive: index > isCardActive,
            USDT: bc.bankName === 'GCASH',
          }"
          @click="showCard(bc, index)"
          v-for="(bc, index) in personalState.bankCardList"
          :key="bc.id"
        >
          <div class="cardname">
            <div class="txt-center">
              <strong>{{ bc.bankName }}</strong>
              <!-- <div>Bank Account Number</div> -->
            </div>
          </div>
          <div class="unlink-btn" @click="unbindBankCard(bc)">
            <!-- <img src="../../assets/images/account/unbind_bank_card.png" /> -->
            <RiLinkUnlink />
          </div>

          <div class="flex-box cards">
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              {{ b.slice(0, 4) }}
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              ****
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              ****
            </div>
            <div
              v-for="b in bc.cardNumber.split()"
              :key="b"
              class="card-num-box"
            >
              {{ b.slice(b.length - 4, b.length) }}
            </div>
          </div>
        </div>
        <div class="bank-card-item" @click="bankCardModal('bank')">
          <RiLink />
          绑卡
        </div>
      </div>
    </div>
    <div class="account-title-container bindunbind">
      <span class="account-title">绑卡历史</span>
    </div>
    <div class="account-content last bindunbind">
      <div class="searchbar">
        <el-form layout="inline" :model="searchForm">
          <div class="left">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="searchForm.startDate"
                show-time
                type="date"
                placeholder="开始日期"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="searchForm.endDate"
                show-time
                type="date"
                placeholder="结束日期"
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="common-btn" @click="searchRecord()">
                搜索
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="unbind-record-wrapper">
        <!-- <el-table
          :columns="columns"
          :datel-source="dataSource"
          :row-key="(record) => record.bankName"
        ></el-table> -->

        <el-table :data="dataSource" style="width: 100%">
          <el-table-column
            v-for="tbl in columns"
            :key="tbl.key"
            :prop="tbl.dataIndex"
            :label="tbl.title"
          />
        </el-table>
        <el-divider />
        <el-pagination
          @current-change="handleCurrentChange"
          :total="pagination.totalPage"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :page-count="pagination.pageCount"
        />
      </div>
    </div>
    <el-dialog
      class="bankModal"
      width="500"
      v-model="bankCardModalState.visible"
      :footer="null"
      title="绑定银行卡"
    >
      <el-form
        ref="bankCardFormRef"
        :model="bankCardInfo"
        :rules="bankCardRules"
      >
        <el-form-item
          prop="bankId"
          :rules="[{ required: true, message: '请选择银行', trigger: 'blur' }]"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select
                placeholder="Bank type"
                v-model="selectedBankType"
                style="width: 100%"
                @change="selectBankType"
              >
                <el-option
                  v-for="bank in bankTypes"
                  :key="bank.value"
                  :value="bank.value"
                  :label="bank.text"
                >
                  {{ bank.text }}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-select
                class="select"
                v-model="bankCardInfo.bankId"
                placeholder="选择银行"
                style="width: 100%"
              >
                <el-option
                  v-for="b in banksList"
                  :key="b.id"
                  :label="b.name"
                  :value="b.id"
                >
                  <el-row
                    style="align-items: center"
                    v-if="b.bankIcon"
                    :gutter="10"
                  >
                    <el-col :span="3">
                      <img
                        style="max-height: 25px; display: block; margin: 5px"
                        :src="imgURL + b.bankIcon"
                      />
                    </el-col>
                    <el-col :span="21">
                      {{ b.name }}
                    </el-col>
                  </el-row>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- <el-form-item v-if="isVirtual" name="bankId" label="ชื่อธนาคาร">
          {{ bankName }}
        </el-form-item> -->
        <el-form-item>
          <el-input disabled v-model="bankCardInfo.cardAccount" />
        </el-form-item>
        <!-- <el-form-item prop="cardAccount" name="cardAccount">
          <el-input
            v-model="bankCardInfo.cardAccount"
            placeholder="ชื่อบัญชี (ชื่อตรงกันกับบัญชีที่ใช้ฝาก)"
          />
        </el-form-item> -->
        <el-form-item prop="cardNumber" name="cardNumber">
          <el-input v-model="bankCardInfo.cardNumber" placeholder="银行卡号" />
        </el-form-item>
        <el-form-item prop="cardAddress" name="cardAddress">
          <el-input
            v-model="bankCardInfo.cardAddress"
            placeholder="开户行地址"
          />
        </el-form-item>
        <el-form-item class="txt-center">
          <el-button class="txt-center common-btn" @click="submitBankCard">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="js">
import { defineComponent, reactive, ref, onMounted } from "vue";
// import { Modal, message } from "ant-design-vue";
import { ElMessage, ElMessageBox } from "element-plus";
// import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { RiLink, RiLinkUnlink } from "vue-remix-icons";
import { loadBanks, loadBankCards, loadUnbindRecord, addBankCard, deleteBankCard } from "@/api/personal/personal";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import { InfoFilled } from "@element-plus/icons-vue";
export default defineComponent({
  name: "WithdrawBankView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    InfoFilled, RiLink, RiLinkUnlink
  },
  setup() {
    let validateBankLength = async (r, v) => {
      var min = 6
      var max = 12
      if (selectedBankType.value === 'Bank') {
        min = 6;
        max = 19;
      } else if (selectedBankType.value === 'Crypto') {
        min = 34;
        max = 37;
      }
      if (v === '') {
        return Promise.reject('请输入卡号');
      } else if (v.length < min || v.length > max) {
        return Promise.reject('长度应为 ' + min + '-' + max);
      } else {
        return Promise.resolve();
      }
    };
    const imgURL = process.env.VUE_APP_IMAGE_CDN + '/payment/';
    const isCardActive = ref();
    const store = userStore();
    const searchForm = reactive({
      startDate: "",
      endDate: "",
      size: 10
    });
    const router = useRouter()
    const columns = [
      {
        title: "银行",
        dataIndex: "bankName",
        key: "bankName",
      },
      {
        title: "账号",
        dataIndex: "cardAccount",
        key: "cardAccount"
      },
      {
        title: "开户行",
        dataIndex: "cardAddress",
        key: "cardAddress"
      },
      {
        title: "绑定时间",
        key: "bindTime",
        dataIndex: "bindTime"
      },
      {
        title: "解绑时间",
        key: "unbindTime",
        dataIndex: "unbindTime"
      }
    ];
    const pagination = ref([{
      currentPage: 1,
      totalPage: 1,
      pageSize: 5,
      pageCount: 1
    }])
    const bankTypes = [{ value: 'Bank', text: '银行卡' }, { value: 'Crypto', text: '数字货币' }]
    const personalState = reactive({
      memberInfo: {},
      bankCardList: []
    });
    const dataSource = ref();
    const searchRecord = () => {
      loadUnbindRecord(searchForm).then((response) => {
        if (response.code === 0) {
          dataSource.value = response.data.records
          pagination.value.currentPage = response.data.current
          pagination.value.totalPage = response.data.total
          pagination.value.pageCount = response.data.pages
        } else {
          // message.error(response.message, 4)
        }
      }).catch((e) => {
        console.log(e.message);
        // message.error(e.message, 4);
      });
    };


    const chgDate = (val) => {
      var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
      var oldDate = new Date(gapDate);
      var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate()) < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + "")
      };
      var useDate = newDate.Y + newDate.M + newDate.D;
      return useDate;
    };

    const getTime = () => {
      searchForm.startDate = chgDate(7);
      searchForm.endDate = chgDate(0);
      searchRecord();
    };
    onMounted(() => {
      getTime();
      loadCards();
    });

    const handleCurrentChange = (val) => {
      pagination.value.currentPage = val
      searchForm.current = val

      searchRecord();
    }
    const showCard = (item, index) => {
      // if (index === isCardActive.value) {
      //   isCardActive.value = null;
      //   console.log(isCardActive.value)
      // } else {
      //   isCardActive.value = index
      // }
      isCardActive.value = index
    }
    const loadCards = () => {
      personalState.bankCardList = [];
      loadBankCards().then((response) => {
        if (response.code === 0) {
          personalState.bankCardList.push(...response.data);
        }
      }).catch((error) => {
        console.log("error", error);
      });
    }

    //add bank card
    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });
    const bankCardFormRef = ref();
    const bankCardInfo = reactive({
      bankId: undefined,
      cardNumber: "",
      cardAccount: "",
      cardAddress: ""
    });
    const bankName = ref()
    const banksList = ref([])
    const bankCardModal = () => {
      store.getMemberInfo().then(() => {
        if (!store.realName || store.realName == "") {
          ElMessage.error('真实姓名不可为空');
          router.push("/center/personal");
        } else {
          bankCardInfo.bankId = undefined;
          bankCardInfo.cardNumber = "";
          bankCardInfo.cardAccount = store.realName;
          bankCardInfo.cardAddress = "";
          bankCardModalState.visible = true;
          if (bankCardModalState.banks.length === 0) {
            loadBanks().then((res) => {
              if (res.code === 0) {
                bankCardModalState.banks.push(...res.data)
                selectBankType();
              }
            }).catch((e) => {
              console.log("error", e);
            });
          }
        }
      })
    };
    const selectedBankType = ref("Bank")
    const selectBankType = () => {
      banksList.value = []
      bankCardInfo.bankId = null
      bankCardModalState.banks.forEach(element => {
        if (selectedBankType.value === "Bank" && element.bankType === 'BANK') {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "Crypto" && element.bankType === 'CRYPTO') {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "e-Wallet" && element.bankType === 'EWALLET') {
          banksList.value.push(element);
        }
      })
    }
    const submitBankCard = () => {
      bankCardFormRef.value
        .validate()
        .then(() => {
          addBankCard(bankCardInfo).then((response) => {
            if (response.code === 0) {
              ElMessage({
                message: 'Success',
                type: 'success',
              })
              bankCardModalState.visible = false;
              loadCards();
            } else {
              // message.error(response.message);
            }
          }).catch((error) => {
              console.log(error.message);
              // message.error(error.message, 4);
          });
        }).catch((error) => {
        console.log("error", error);
      });
    };
    const bankCardRules = {
      cardNumber: [
        // {
        //   required: true,
        //   message: "Card number is required",
        //   trigger: "blur",
        // },
        {
          validator: validateBankLength,
          trigger: "blur",
        }
      ],
      cardAccount: [
        {
          required: true,
          message: "请输入银行卡号",
          trigger: "blur"
        }
      ]
    };
    const unbindBankCard = (card) => {
      ElMessageBox.confirm(
        `解绑 ${card.bankName} ?`,
        '警告',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          deleteBankCard(card.id).then((res) => {
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: 'Remove completed',
              })
              for (let i = 0; i < personalState.bankCardList.length; i++) {
                if (personalState.bankCardList[i].id === card.id) {
                  personalState.bankCardList.splice(i, 1);
                }
              }
            }
          }).catch((e) => {
            console.log("error", e);
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Remove canceled',
          })
        })
//       Modal.confirm({
//         title: "Remove " + card.bankName + "?",
//         content: "Are you sure you want to remove " + card.bankName + "?",
//         icon: createVNode(ExclamationCircleOutlined),
//         width: "100%",
//         onOk() {
//           deleteBankCard(card.id
// ).then((res) => {
//             if (res.code === 0) {
//               for (let i = 0; i < personalState.bankCardList.length; i++) {
//                 if (personalState.bankCardList[i].id === card.id) {
//                   personalState.bankCardList.splice(i, 1);
//                 }
//               }
//             }
//           }).catch((e) => {
//             console.log("error", e);
//           });
//         }
//       });
    };
    return {
      searchForm,
      columns,
      personalState,
      bankCardModalState,
      bankCardFormRef,
      bankCardInfo,
      bankCardRules,
      submitBankCard,
      bankCardModal,
      unbindBankCard,
      showCard,
      isCardActive,
      bankName,
      bankTypes,
      selectBankType,
      selectedBankType,
      banksList,
      searchRecord,
      dataSource,
      imgURL,
      pagination,
      handleCurrentChange
    };
  }
});
</script>

<style lang="scss">
body {
  .bankModal {
    .el-dialog__body {
      padding: 20px;
    }
  }
}
.passwordModal .ant-modal {
  max-width: 520px;
  width: 100%;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 100%;
  }
}
.bankModal .ant-modal {
  max-width: 520px;
  width: 100%;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 100%;
  }
}
.securityModal .ant-modal {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 100%;
  }
}
.ant-modal.ant-modal-confirm {
  width: 100%;
  max-width: 600px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ant-space-item:nth-child(1) {
  flex: 2;
}
.ant-space-item:nth-child(2) {
  flex: 4;
}
</style>
<style scoped lang="scss">
:deep(.ant-form-item.half .ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  .ant-input {
    width: 100%;
    flex-basis: 50%;
  }
}
:deep(.ant-form-item .ant-select) {
  width: 100%;
}
:deep(.ant-form-item.select .ant-form-item-control-input) {
  width: 100%;
}
:deep(
    .ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input
  ) {
  height: 40px;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  height: 40px;
  padding: 5px 20px;
  background: #24222e;
  color: #ffffff;
  border: 0;
}

.common-btn {
  cursor: pointer;
  &.search-btn {
    margin-top: 0;
    padding: 3px 5px;
    font-size: 14px;
  }
  &.verification-btn {
    padding: 5px;
  }
  &.submit-btn {
    padding: 5px;
  }
}

.bank-card-list {
  // justify-content: space-evenly;
  // margin: 100px auto;
  // gap: 20px;
  // padding-left: 25%;
  padding-top: 50px;
  padding-right: 220px;
  padding-left: 40px;
  display: flex;
  flex-wrap: wrap;

  .bank-card-item {
    margin-bottom: 20px;
    padding: 0 10px;
    width: 300px;
    height: 200px;
    border-radius: 5px;
    background-image: url("../../assets/images/finance/hk.png");
    background-position: right;
    // background: #24222e;
    // background: url(../../assets/images/account/bank_card_lrg_bg.png) no-repeat
    //   0% 50%;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: -280px;

    cursor: pointer;
    transition: all 0.3s ease-in;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    box-shadow: -5px 0 10px rgba(0, 0, 0, 0.6);
    filter: grayscale(0.3);
    transform: skewX(5deg);
    &.USDT {
      background-image: url("../../assets/images/finance/download.png");
    }

    &.active {
      // background: #2f2c3f;
      // margin-top: -50px;
      // transform: rotate3d(1, 1, 1, 360deg);
      flex-direction: column;
      // margin-right: -60px;
      margin: 0 -60px 0 0px;

      filter: none;
      .unlink-btn {
        display: block;
      }
      .txt-center {
        position: relative;
        padding-top: 0;
        transform: rotateZ(0);
        height: unset;
      }
      &:hover {
        &:before {
          -webkit-animation: shine 2s;
          animation: shine 2s;
        }
      }
    }
    .txt-center {
      position: absolute;
      padding-top: 10px;
      transform: rotateZ(-90deg);
      left: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      transform-origin: 50% 50%;
      width: 200px;
      width: 160px;
      text-overflow: ellipsis;
      height: 160px;
      overflow: hidden;
      white-space: nowrap;
      transition: all 0.3s ease-in-out;
    }
    .cards {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      justify-content: center;
    }
    &.add-bank-card {
      cursor: pointer;
      align-items: center;
      padding: 0;
      filter: none;
    }
    .unlink-btn {
      cursor: pointer;
      position: absolute;
      display: none;
      top: 10px;
      left: 10px;
    }
    svg {
      fill: #ffffff;
      width: 20px;
    }
    .card-num-box {
      // padding: 40px 0 0;
    }
    &:before {
      position: absolute;
      top: 0;
      left: -85%;
      z-index: 0;
      display: block;
      content: "";
      width: 50%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 100%
      );
      border-radius: 10px;
      transform: skewX(320deg);
    }

    @-webkit-keyframes shine {
      100% {
        left: 125%;
      }
    }
    @keyframes shine {
      100% {
        left: 125%;
      }
    }
  }
}
.basic-info {
  position: relative;
  .buttons {
    position: absolute;
    top: 20px;
    right: 10%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .account-btn {
    cursor: pointer;
    padding: 5px 20px;
    font-size: 16px;
    min-width: 180px;
  }
}
.basic-info-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 70%;
  .tbl-row {
    display: flex;
    justify-content: flex-start;
    padding: 0 20px 15px 0px;
  }
  .basic-info-cell {
    padding-bottom: 0.5rem;

    &.title {
      width: 150px;
    }
    // &.content {
    //   // width: 170px;
    //   width: calc(100% - 100px);
    //   max-width: 250px;
    //   color: #1bcef1;
    // }
  }
}
.unbind-record-wrapper {
  margin-top: 20px;
}
.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}
.searchbar .ant-form {
  display: flex;
  justify-content: space-between;
  .ant-form-item {
    margin-right: 0;
  }
}
</style>

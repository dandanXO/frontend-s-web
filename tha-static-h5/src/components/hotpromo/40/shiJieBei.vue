<template>
  <div>
    <div class="center-numbers">
      <div class="center-title">โบนัสรวม</div>
      <div class="center-number">{{ prizePool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
    </div>
    <div class="countries-wrapper">
      <div class="point">
        เลือกทีมโปรดของคุณยิ่งคุณได้รับคะแนนโหวดมากเท่าไหร่ ยิ่งมีสิทธิ์ได้ลุ้นรับรางวัลมากขึ้น
      </div>
      <div class="right-count">
        โหวตของฉัน: <span>{{ myVotes }}</span>
      </div>
      <div class="country-list" id="countrylist">
        <div
          v-for="(country, i) in countriesList"
          :key="i"
          class="country-item"
          @click="voteModal(country)"
        >
          <div class="c-flag">
            <img v-if="country.countryImgUrl"
              :src="`${imgURL}${country.countryImgUrl}`"
            />
          </div>
          <div class="c-name">{{ country.teamNameLocal }}</div>
          <div class="c-price">{{ country.totalVotes }} โหวด</div>
          <div class="c-button">โหวด</div>
        </div>
      </div>
    </div>
    
    <div class="table-details">
      <q-table title="เลขนำโชคบันทึกรา" no-data-label="ไม่มีข้อมูล" loading-label="กำลังโหลด..."
          class="q-mt-md" :columns="tableColumns.votesRecord"
                :rows="dataSource"
            row-key="id">
      </q-table>
    </div>
    

  <q-dialog v-model="voteModalVisible">
    <q-card class="q-pa-md" style="min-width: 360px;">
      <div class="text-h6">{{ selectedCountry }}</div>
      <q-card-section style="width: 100%;" class="row items-center">
        <q-form style="width: 100%">
            <q-input filled
             style="width: 100%"
              ref="voteCountRef"
              type="number"
              placeholder="จํานวนคะแนนเสียง"
              v-model="voteForm.voteCount"
              color="white"
              :rules="[
                (val) =>
                  (val && val.length) ||
                  'กรุณาใส่เลขที่ต้องการโหวด',
                  (val) =>
                  (val && val > 0) ||
                  'เลขที่ต้องการโหวดต้องเป็นจำนวนเต็ม'
              ]"
            />
        </q-form>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn style="width: 140px" :loading="btnLoading" label="ส่ง" color="deep-orange" @click="submitVotes">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            กำลังตรวจสอบ
          </template>
          </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { eventapi } from "boot/axios"
import moment from "moment";

var qs = require("qs");
export default defineComponent({
  name: 'SJBPromo',
  setup() {
    const $q = useQuasar();
    const btnLoading = ref(false)
    const loading = ref(true);
    const imgURL = process.env.IMAGE_CDN + "/"
    const pagination = reactive({
      pageSize: 5,
      total: 5,
    });
    const prizePool = ref(0);
    const tableColumns = {
      votesRecord: [
        {
          label: "ชื่อทีม",
          field: "teamVotesId",
        },
        {
          label: "จํานวนคะแนนเสียง",
          field: "votes"
        },
        {
          label: "เวลาโหวต",
          field: "voteTime"
        },
      ],
    };
    const dataSource = ref([]);
    const selectedCountry = ref(null);
    const selectedTeamId = ref();
    const countriesList = ref([]);
    const myVotes = ref("");
    const voteModalVisible = ref(false);
    const voteModal = (ctry) => {
      voteModalVisible.value = true;
      selectedCountry.value = ctry.teamNameLocal;
      voteForm.voteCount = null
      voteForm.teamId = ctry.id;
    };
    const loadCountryList = () => {
          eventapi.get("/privi/team-votes/init")
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                prizePool.value = res.data.award
                countriesList.value = res.data.votesList;
                myVotes.value = res.data.myVotes;
                dataSource.value = res.data.votesRecord;
                updateTableItems()
                loading.value = false;
              } else {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: res.message === 'too often request' ? 'คำขอบ่อยเกินไป' : i18n.global.t('error.' + res.code),
                  icon: "report_problem"
                });
              }
            })
    };
    const updateTableItems = () => {
      dataSource.value.forEach(element => {
        let teamNameEquivalent = countriesList.value.find((ctry) => ctry.id === element.teamVotesId);
        if (teamNameEquivalent) {
          element.teamVotesId = teamNameEquivalent.teamNameLocal
        }
      });
    }
    const voteCountRef = ref();
    const voteForm = reactive([
      {
        voteCount: 0,
        teamId: null
      },
    ]);
    const submitVotes = () => {
      btnLoading.value = true
      voteCountRef.value.validate();
      if (
        voteCountRef.value.hasError
      ) {
        btnLoading.value = false
      } else {
        btnLoading.value = true
        if(myVotes.value > 0) {
          const obj = {
            teamId: voteForm.teamId,
            votes: Number(voteForm.voteCount)
          }
          
          eventapi.post(`/privi/team-votes/vote`, qs.stringify(obj)).then((res) => {
            $q.notify({
              color: "positive",
              position: "top",
              message: "สำเร็จ",
              icon: "check_circle_outline"
            });
            countriesList.value.forEach(element => {
              if (Number(element.id) === Number(voteForm.teamId)) {
                if (myVotes.value >= voteForm.voteCount) {
                  element.totalVotes = Number(element.totalVotes) + Number(voteForm.voteCount)
                  myVotes.value = Number(myVotes.value) - Number(voteForm.voteCount)
                  const obj = {
                    teamVotesId: voteForm.teamId,
                    votes: voteForm.voteCount,
                    voteTime: moment(new Date()).format("YYYY/MM/DD, hh:mm A"),
                  }
                  dataSource.value.push(obj);
                }
              }
            });
            updateTableItems();
            voteModalVisible.value = false;
            btnLoading.value = false;
            
          }).catch((err) => {
            console.log(err)
            btnLoading.value = false
          })
        } else {
          btnLoading.value = false;
          $q.notify({
            color: "negative",
            position: "top",
            message: "คุณมีคะแนนโหวดไม่เพียงพอ",
            icon: "report_problem"
          });
        }
      }
    }
    const votingRules = {
      voteCount: [
        {
          required: true,
          message: "กรุณาใส่เลขที่ต้องการโหวด",
          trigger: "blur",
        },
        {
          min: 1,
          message: "เลขที่ต้องการโหวดต้องเป็นจำนวนเต็ม",
        },
      ],
    };
    onMounted(() => {
      loadCountryList();
    });
    return {
      prizePool,
      dataSource,
      tableColumns,
      // recordPage,
      pagination,
      countriesList,
      loading,
      voteModal,
      voteModalVisible,
      selectedCountry,
      voteForm,
      submitVotes,
      myVotes,
      voteCountRef,
      votingRules,
      loadCountryList,
      selectedTeamId,
      btnLoading,
      imgURL
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.ant-table-content) {
    min-width: 400px;
}
.votesm .vote-submit {
  margin: 20px auto 0;
  display: block;
}
.center-numbers {
  gap: 5px;
  position: relative;
  background: url("../../../assets/images/promotion/hotpromo/40/fifa.png")
    no-repeat center center;
  background-size: cover;
  width: 100%;
  min-height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Arial";
  .center-title {
    padding-top: 32px;
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
  }
  .center-number {
    font-size: 50px;
    line-height: 50px;
    font-weight: bold;
    color: #ffffff;
  }
}
.countries-wrapper {
  font-family: "Arial";
  background-color: #290315;
  border-radius: 10px;
  border: solid 1px #a81538;
  max-width: 1298px;
  margin: 50px auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  .point {
    color: #ffffff;
    &:before {
      content: "";
      width: 8px;
      height: 8px;
      display: inline-block;
      transform: rotateZ(45deg);
      margin-right: 10px;
      background-color: #ff004c;
    }
  }
  .right-count {
    text-align: right;
    color: #ffffff;
    margin-top: 15px;
    font-weight: normal;
  }
  .country-list {
    display: flex;
    gap: 15px;
    padding: 20px 0;
    flex-wrap: wrap;
    justify-content: flex-start;
    .country-item {
      width: 30%;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px;
      background: #ffffff;
      padding: 10px;
      border-radius: 10px;
      overflow: hidden;
      &:hover {
        .c-button {
          background: #a81538;
          color: #ffffff;
        }
      }
      .c-flag {
        background: #eeeee4;
        padding: 10px;
        border-radius: 10px;
        height: 60px;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 100%;
          max-height: 100%;
          border: 1px solid #d4c164;
        }
      }
      .c-name {
        padding: 5px 0;
        color: #a81538;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
      }
      .c-price {
        background: #eeeee4;
        color: #000000;
        font-size: 14px;
        font-weight: normal;
        padding: 0 5px;
        border-left: 2px solid #d4c164;
        border-right: 2px solid #d4c164;
        width: 100%;
        text-align: center;
      }
      .c-button {
        border: 2px solid #a81538;
        padding: 2px 10px;
        border-radius: 20px;
        display: block;
        margin-top: 10px;
        width: 100%;
        text-align: center;
        color: #a81538;
        line-height: 16px;
      }
    }
  }
}
.table-details {
  font-family: "Arial";
  background-color: #290315;
  border-radius: 10px;
  border: solid 1px #a81538;
  max-width: 1298px;
  margin: 50px auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
  table {
    width: 100%;

    thead {
      border-bottom: 1px solid #ffffff;
      td {
        text-align: center;
        color: #ffffff;
        padding: 10px;
      }
    }
    tbody {
      border-bottom: 1px solid #ffffff;
      td {
        color: #ffffff;
        padding: 10px;
        text-align: center;
        font-weight: normal;
      }
    }
  }
}
@media (max-width: 768px) {
}
</style>

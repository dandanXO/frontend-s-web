<template>
  <div class="wrapper">
    <div class="affiliate">
      <div class="game-title">Jolly88</div>
      <div class="game-title sub">{{ $t('lang.affiliate_program') }}</div>
      <div class="description">
        <div class="desc pro">
          <img src="../assets/images/affiliate/01.png" />
          <span>{{ $t('lang.the_most_professional_team') }}</span>
        </div>
        <div class="desc best">
          <img src="../assets/images/affiliate/02.png" />
          <span>{{ $t('lang.excellent_service') }}</span>
        </div>
      </div>
      <div class="buttons">
        <!-- Action Required - Contact Us Link -->
        <a :href="'https://www.jollycobber.com/th/register?agent=' + (affCode ? affCode : '')">
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{ $t('lang.apply') }}</q-btn>
        </a>
        <a href="https://www.jollycobber.com/th/login">
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{ $t('lang.login') }}</q-btn>
        </a>
        <router-link to="/liveChat" name="live">
          <q-btn :color="ui.themeColor" align="around" class="full-width">{{ $t('lang.contact_us') }}</q-btn>
        </router-link>
      </div>
      <div class="steps">
        <div class="step">
          <div class="game-title">01</div>
          <div class="stepdesc">
            {{ $t('lang.stepdesc_1') }}
          </div>
        </div>
        <div class="step">
          <div class="game-title">02</div>
          <div class="stepdesc">
            {{ $t('lang.stepdesc_2') }}
          </div>
        </div>
        <div class="step">
          <div class="game-title">03</div>
          <div class="stepdesc">
            {{ $t('lang.stepdesc_3') }}
          </div>
        </div>
      </div>
      <div class="information">
        <div class="game-title sub">{{ $t('lang.affiliate_tnc_title') }}</div>
        <ol class="terms">
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_1') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_2_1') }}
              <br />
              {{ $t('lang.affiliate_tnc_para_2_2') }}
              <br />
              {{ $t('lang.affiliate_tnc_para_2_3') }} <br />
              {{ $t('lang.affiliate_tnc_para_2_4') }} <br />
              {{ $t('lang.affiliate_tnc_para_2_5') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_3') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_4') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_5') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_6') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_7') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_8') }}
            </p>
          </li>
          <li>
            <p>
              {{ $t('lang.affiliate_tnc_para_9') }}
            </p>
          </li>
        </ol>
        <div class="table">
          <div class="game-title sub">{{ $t('lang.commission_table') }}</div>
          <a-table
            :pagination="false"
            :columns="columns"
            row-key="activeUser"
            :data-source="dataSource"
          />
        </div>
        <div class="game-title sub">{{ $t('lang.how_to_calculate_commission') }}</div>
        <p>
          กําไรสุทธิ = ( ชนะ/ขาดทุนทั้งหมด x 90% ) - โบนัส - (
          ค่าธรรมเนียมการทําธุรกรรมธนาคาร x 1% ) => ในนั้น: ชนะ/แพ้ทั้งหมด =
          เดิมพันทั้งหมด - การจ่ายเงินทั้งหมด <br />

          ค่าธรรมเนียมการทําธุรกรรมธนาคาร:( ฝาก +ถอน)*1% <br />

          คอมมิชชั่น = กําไรสุทธิ x เปอร์เซ็นต์ค่าคอมมิชชั่นที่สอดคล้องกัน
        </p>
        <div class="boxes">
          <div class="box">
            <p>
              ตัวอย่างที่ 1: พันธมิตร A ได้รับกําไรค่าคอมมิชชั่นรายเดือน 30%
            </p>
            <div class="bx-table">
              <div class="rw-left">- ลูกค้าเสียทั้งหมด:</div>
              <div class="rw-rgt">200,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- จํานวนเงินฝากทั้งหมดในเดือน:</div>
              <div class="rw-rgt">300,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- จํานวนเงินที่ถอนออกทั้งหมดในเดือน:</div>
              <div class="rw-rgt">60,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - โปรโมชั่นทั้งหมดที่ลูกค้าได้รับในเดือน:
              </div>
              <div class="rw-rgt">5,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - ค่าธรรมเนียมการทําธุรกรรมผ่านธนาคาร ((ฝาก + ถอนออก) * 1%):
              </div>
              <div class="rw-rgt">3,600</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">=>กําไรสุทธิ =</div>
              <div class="rw-rgt">(200,000*90%)-5,000-3,600=171,400</div>
            </div>

            <div class="bx-table">
              <div class="rw-left">=>ค่าคอมมิชชั่น =</div>
              <div class="rw-rgt">171,400*30%=51,420</div>
            </div>
          </div>

          <div class="box">
            <p>
              ตัวอย่างที่ 2: พันธมิตร B ได้รับกําไรค่าคอมมิชชั่นรายเดือน 55%
            </p>
            <div class="bx-table">
              <div class="rw-left">- ลูกค้าเสียทั้งหมด:</div>
              <div class="rw-rgt">8,000,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- จํานวนเงินฝากทั้งหมดในเดือน:</div>
              <div class="rw-rgt">9,600,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">- จํานวนเงินที่ถอนออกทั้งหมดในเดือน:</div>
              <div class="rw-rgt">6,500,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - โปรโมชั่นทั้งหมดที่ลูกค้าได้รับในเดือน:
              </div>
              <div class="rw-rgt">600,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">
                - ค่าธรรมเนียมการทําธุรกรรมผ่านธนาคาร ((ฝาก + ถอนออก) * 1%):
              </div>
              <div class="rw-rgt">160,000</div>
            </div>
            <div class="bx-table">
              <div class="rw-left">=>กําไรสุทธิ =</div>
              <div class="rw-rgt">
                (8,000,000*90%)-600,000-160,000=6,440,000
              </div>
            </div>
            <div class="bx-table">
              <div class="rw-left">=>คอมมิชชัน=</div>
              <div class="rw-rgt">6,440,000*55%=3,542,000</div>
            </div>
          </div>
        </div>
        <div class="game-title sub">พันธมิตรดาวน์ไลน์</div>
        <p>
          ฐานดาวน์ไลน์ของพันธมิตร
          ต้องมาจากสมาชิกทีสมัครผ่านลิ้งค์ของพันธมิตรเท่านั้น
          เพื่อรับค่าคอมมิชชั่นเพิ่มเติม จากดาวน์ไลน์บวกค่าคอมมิชชั่นของตัวเอง
        </p>
        <div class="game-title sub">ขั้นตอนการรับค่าคอมมิชชั่น</div>
        <ol>
          <li>
            <p>

             ค่าคอมมิชชั่นจะได้รับทุกวันที่ 1 ของเดือน โดยจะได้รับเป็นเงินไทยบาท ( THB ) หลังจากได้รับคอมมิชชั่นแล้ว พันธมิตรจึงดําเนินการถอนค่าคอมมิชชั่นได้ ตามปกติ
            </p>
          </li>
          <!-- <li><p>ค่าคอมมิชชั่นจะถูกจ่ายเป็นเงินไทยเท่านั้น</p></li> -->
          <li>
            <p>
              การร้องเรียนเกี่ยวกับค่าคอมมิชชั่นจะต้องส่งไปยัง ฝ่ายดูแลพันธมิตร
              ก่อนวันที่ 10 ของแต่ละเดือน
              มิฉะนั้นค่าคอมมิชชั่นที่ชําระแล้วจะไม่สามารถเปลี่ยนแปลงได้
            </p>
          </li>
          <li>
            <p>
              Jolly88
              ขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือแก้ไขเปอร์เซ็นต์ค่าคอมมิชชั่นที่เราเห็นว่าเหมาะสม
            </p>
          </li>
          <li>
            <p>
              Jolly88
              ขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือแก้ไขข้อกําหนดข้างต้นหรือเพิ่มข้อกําหนดเพิ่มเติมใด
              ๆ ตามความจําเป็
            </p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import {useUI} from "stores/ui";

export default defineComponent({
  setup() {
    const ui= useUI();
    const affCode = sessionStorage.getItem("AFFILIATE_CODE");
    const columns = [
      {
        title: "ยูสเซอร์ที่เปิดใช้งาน",
        dataIndex: "activeUser",
        key: "activeUser",
      },
      {
        title: "ผลกำไรจริง",
        dataIndex: "realProfit",
        key: "realProfit",
      },
      {
        title: "คอมมิชชั่น",
        dataIndex: "commission",
        key: "commission",
      },
    ];
    const dataSource = [
      {
        activeUser: "5",
        realProfit: "1-250,000",
        commission: "30%",
      },
      {
        activeUser: "10",
        realProfit: "250,001-750,000",
        commission: "35%",
      },
      {
        activeUser: "15",
        realProfit: "750,001-1,500,000",
        commission: "40%",
      },
      {
        activeUser: "25",
        realProfit: "1,500,001-2,500,000",
        commission: "45%",
      },
      {
        activeUser: "35",
        realProfit: "2,500,001-5,000,000",
        commission: "50%",
      },
      {
        activeUser: "50",
        realProfit: ">=5,000,001",
        commission: "55%",
      },
    ];

    return {
      columns,
      dataSource,
      affCode,
      ui
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  background: url("../assets/images/affiliate/bg.png") no-repeat center center;
  background-size: cover;
  background-attachment: fixed;

  .affiliate {
    max-width: 1550px;
    margin: 0 auto;
    min-height: 90vh;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .game-title {
      &.sub {
        font-size: 30px;
      }
    }
    .description {
      margin: 50px;
      display: flex;
      gap: 50px;
      .desc {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        gap: 10px;
        img {
          width: 50px;
        }
      }
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 20px;
       width: 200px;
    }
    .steps {
      background: #23263c;
      padding: 40px;
      border-radius: 20px;
      width: 95%;
      margin: 50px auto;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
       max-width: 260px;
       gap: 10px;
      .step {
        display: flex;
        color: #ffffff;
        gap: 10px;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .information {
      max-width: 1200px;
      width: 90%; margin: 0 auto;
      text-align: left;
      .game-title {
        text-align: left;
        margin: unset;
      }
      p {
        font-size: 16px;
        color: #ffffff;
      }
      ol {
        color: #ffffff;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .terms {
        color: #ffffff;
        text-align: left;
        margin: 0;
        padding-left: 15px;
      }
      .table {
        :deep(.ant-table .ant-table-thead > tr > th) {
          text-align: center;
        }
        :deep(.ant-table .ant-table-thead > tr > th:nth-child(odd)),
        :deep(.ant-table .ant-table-tbody > tr > td:nth-child(odd)) {
          background: #303450;
        }
      }
      .boxes {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 40px;
        .box {
          flex: 1;
          background-color: #2b2b4b;
          padding: 20px;
          color: #ffffff;
          .bx-table {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .wrapper {
    .affiliate {
      .description {
        flex-direction: column-reverse;
      }
      .information {
        .boxes {
          flex-direction: column;
        }
      }
      .steps {
        flex-direction: column;
        justify-content: flex-start;
        gap: 20px;
        max-width: 260px;
        .step {
        }
      }
    }
  }
}
</style>

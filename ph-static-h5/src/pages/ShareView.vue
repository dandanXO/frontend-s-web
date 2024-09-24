<template>
  <div class="share-wrapper">
    <div class="sharing-container">
      <div class="qr-container">
        <VueQRCodeComponent size="150" :text="referralLink" class="qr-comp" />
      </div>
      <div class="share-link-wrapper">
        <q-input
          class="link"
          style="width: 100%"
          filled
          color="white"
          ref="copyinput"
          v-model="referralLink"
          @blur="blurCode"
        />
        <q-btn color="brand" class="common-btn copy-btn" @blur="blurCode" @click="copyCode">
          {{ copybtntxt }}
        </q-btn>
      </div>
    </div>

    <div class="friendlist-container">
      <div class="title">Friend List</div>
      
      <table class="friendlist-table" style="border-collapse: collapse;">
        <tr style="background-color: #ecf5ff;
          font-weight: 700;
          color: #2b2b82;
          white-space: pre-wrap;">
          <td>Login Name</td>
          <td>Registered At</td>
          <td>Deposit Amount</td>
        </tr>

        <tbody>
          <tr v-for="(friend, friendIndex) in friendList" :key="`friend-${friendIndex}`">
            <td>{{ friend.loginName }}</td>
            <td>{{ friend.regTime }}</td>
            <td>{{ friend.depositAmount ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

<!--    <div class="note-container">-->
<!--      <ul>-->
<!--        <li>Promotion starts at 00:00:00 on 01/06/2022 to 23:59:59 on 30/06/2022 (GMT+8)</li>-->
<!--        <li>-->
<!--          Simply refer customers to join at Play4Win and you will receive a bonus of 300 VNDP each. Customers you refer-->
<!--          will also receive a welcome bonus of 150 VNDP.-->
<!--        </li>-->
<!--        <li>To be eligible to receive the bonus, you will need to meet</li>-->
<!--      </ul>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { api } from "boot/axios";
import VueQRCodeComponent from "vue-qrcode-component";

const friendList = ref([]);

const referralLink = ref("");
const copybtntxt = ref("Copy");
const copyinput = ref(null);
const copyCode = () => {
  const copyText = copyinput.value;
  copyText.select();
  document.execCommand("copy");
  copybtntxt.value = "Copied";
};

const blurCode = () => {
  copybtntxt.value = "Copy";
};

const getReferral = () => {
  api
    .get("/session/member/referralCode")
    .then((res) => {
      if (res.code === 0) {
        referralLink.value = `https://m.play4win.cc/refer/${res.data}`;
      }
    })
    .catch((err) => {});
};

const getFriendList = () => {
  api
    .get("/session/referred")
    .then((res) => {
      if (res.code === 0) {
        friendList.value = res.data.records;
      }
    })
    .catch((err) => {});
};

onMounted(() => {
  getReferral();
  getFriendList();
});
</script>

<style scoped lang="scss">
.share-wrapper {
  .sharing-container {
    flex-direction: column;
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    flex: 2;

    .qr-container {
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .qr-comp {
        padding: 15px;
        border-radius: 0.75rem;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid;
        border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
      }

      img {
        width: 120px;
        margin: 0 auto;
      }
    }

    .share-link-wrapper {
      padding: 10px 30px;
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;

      :deep(input) {
        width: 77.5%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .copy-btn {
        position: absolute;
        right: 0;
        margin: 10px 30px;
        height: 57.5px;
        width: 100px;
        border-radius: 12px;
      }
    }
  }

  .friendlist-container {
    padding: 0 30px 10px;
    position: relative;
    width: 100%;

    .friendlist-table {
      width: 100%;

      td, th {
        border: 1px solid;
        padding: 5px 10px;
      }
    }

    .title {
      color: #222;
      font-size: 0.9375rem;
      font-weight: 500;
      padding: 0 0 10px 0;
    }

    .friendlist-wrapper {
      height: 260px;
      overflow-y: scroll;
      padding: 15px 10px;
      border-radius: 0.75rem;
      background: #fff;
      border: 0.5px solid;
      border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);

      .friend-info-wrapper {
        .friend-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          align-items: center;
          justify-content: center;

          .friend-name {
            color: #2b2b82;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .friend-date {
            color: #83a3ca;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .friend-deposit-amt {
            color: #83a3ca;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }

        .separator {
          height: 1px;
          width: 100%;
          margin: 15px 0;
          border: 0.5px solid #ddebfb;
        }
      }
    }
  }

  .note-container {
    padding: 0 30px 0 0;

    ul {
      li {
        color: #83a3ca;
        font-size: 0.75rem;
        font-weight: 500;
        margin: 0 0 15px 0;
      }
    }
  }
}
</style>

<!-- dark theme -->
<style scoped lang="scss">
body.body--dark {
  .share-wrapper {
    .sharing-container {
      .qr-container {
        .qr-comp {
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(159, 197, 135, 0.5);
          box-shadow: 1px 1px 1px rgba(0, 113, 237, 0.5);
        }
      }
    }

    .share-link-wrapper {
      .link {
        border-radius: 12px;
        border: 1px solid rgba(159, 197, 135, 0.5);
        box-shadow: 1px 1px 1px rgba(0, 113, 237, 0.5);
      }

      .copy-btn {
        color: rgba(255, 255, 255, 0.8) !important;
      }
    }

    .friendlist-container {
      .title {
        color: rgba(255, 255, 255, 0.8);
      }

      .friendlist-wrapper {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(159, 197, 135, 0.5);
        box-shadow: 1px 1px 1px rgba(0, 113, 237, 0.5);

        .friend-info-wrapper {
          .friend-info {
            .friend-name,
            .friend-date {
              color: rgba(255, 255, 255, 0.8);
            }
          }

          .separator {
            border: 0.5px solid rgba(255, 255, 255, 0.08);
          }
        }
      }
    }
  }
}
</style>

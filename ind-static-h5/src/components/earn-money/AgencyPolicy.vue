<template>
  <ContentView contentTopStatus="faded">
    <div class="agency-policy">
      <ul class="margin-style">
        <li>How To Earn Commissions?</li>
        <li>How To Invite Your Friends?</li>
        <li>How To Upgrade Your Level?</li>
        <li>How To Develop Your Referrals Into Affiliates?</li>
        <li>
          How To Get Commission From Your Affiliates? The Agent Level Is Divided According To The Number Of Active
          Members You Invite. As Long As The Member You Invite Has Recharged Once, He Is An Active Member.
        </li>
      </ul>

      <q-table
        flat
        :hide-pagination="true"
        class="table-container q-mt-md"
        :columns="columns"
        :rows="rows"
        row-key="name"
        dense
      ></q-table>

      <ul>
        <li>How To Earn Commissions?</li>
        <li class="dot-style">
          You Can Get Up To 16% Of Each Payments Made By Your Referred Players. The Commission Is Valid Forever. The
          Higher Your Level Is, The Higher The Commission Percentage You Can Get.
        </li>
      </ul>

      <q-table
        flat
        :hide-pagination="true"
        class="table-container q-mt-md"
        :columns="columns2"
        :rows="rows2"
        row-key="name"
        dense
      ></q-table>

      <div class="copy-link-container" @click="copyShareLink(selfTgurl)">
        <img class="copy-link" src="../../assets/images/earn-money/copy-link-btn.png" alt="" />
        <span>Copy Share Link</span>
      </div>
    </div>
  </ContentView>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, copyToClipboard } from "quasar";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import ContentView from "../ContentView.vue";

const $q = useQuasar();
const store = userStore();

const columns = [
  {
    name: "name",
    required: true,
    label: "Agency Lever",
    align: "center",
    field: (row) => row.name
  },
  { name: "lever1", label: "1", field: "lever1", align: "center" },
  { name: "lever2", label: "2", field: "lever2", align: "center" },
  { name: "lever3", label: "3", field: "lever3", align: "center" },
  { name: "lever4", label: "4", field: "lever4", align: "center" },
  { name: "lever5", label: "5", field: "lever5", align: "center" },
  { name: "lever6", label: "6", field: "lever6", align: "center" }
];
const rows = [
  {
    name: "Active User",
    lever1: 0,
    lever2: 20,
    lever3: 40,
    lever4: 80,
    lever5: 160,
    lever6: 320
  }
];

const columns2 = [
  {
    name: "name",
    required: true,
    label: "VIP Level",
    align: "center",
    field: (row) => row.name
  },
  { name: "vip1", label: "VIP1", field: "vip1", align: "center" },
  { name: "vip2", label: "VIP2", field: "vip2", align: "center" },
  { name: "vip3", label: "VIP3", field: "vip3", align: "center" },
  { name: "vip4", label: "VIP4", field: "vip4", align: "center" },
  { name: "vip5", label: "VIP5", field: "vip5", align: "center" },
  { name: "vip6", label: "VIP6", field: "vip6", align: "center" }
];
const rows2 = [
  {
    name: "Commission",
    vip1: "1%",
    vip2: "1.5%",
    vip3: "2%",
    vip4: "2.5%",
    vip5: "3%",
    vip6: "3.5%"
  }
];

const selfTgurl = ref("");
const copyShareLink = (selfTgurl) => {
  copyToClipboard(selfTgurl)
    .then(() => {
      $q.notify({
        color: "position",
        position: "top",
        message: `${selfTgurl} copied to clipboard`,
        icon: "check_circle_outline"
      });
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed",
        icon: "report_problem"
      });
    });
};

onMounted(() => {
  let tgDomain = location.origin;
  if (store.isApp()) tgDomain = "https://" + store.evip;

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) selfTgurl.value = tgDomain + "/refer/" + res.data;
  });
});
</script>

<style scoped lang="scss">
.agency-policy {
  .margin-style {
    margin: 0;
  }

  ul {
    padding-inline-start: 1.5rem;

    li {
      list-style-type: decimal;
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.25rem;
      text-align: left;
      color: #edd3ff;
      margin: 0 0 0.75rem 0;
    }

    .dot-style {
      list-style-type: disc;
    }
  }
  :deep(.q-table__container) {
    background: transparent !important;
    border-radius: 12px;
  }
  .table-container {
    :deep(thead) {
      background: rgba(21, 0, 37, 0.5);
    }

    :deep(tbody) {
      background: rgba(21, 0, 37, 0.2);
    }

    .text-center {
      font-size: 0.95rem;
      font-weight: 700;
      width: 2rem;
      border-bottom-width: 0;
      border-right-width: 1px;
      border-color: black;
      padding: 0 0.25rem;
    }
  }

  .copy-link-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .copy-link {
      width: 25rem;
      padding: 1rem;
    }

    span {
      position: absolute;
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
}
</style>

<template>
  <div class="q-pa-md cs-verifier">
    <div class="flex justify-center csv-icon">
      <img src="../assets/images/cs-verifier/csv-icon.png" alt="" />
    </div>
    <div class="main-title">PK1.GAME</div>
    <div class="sub-title">{{ $t("customerServiceVerifier.subTitle") }}</div>
    <div class="content-para q-mt-sm" v-html="$t('customerServiceVerifier.contentPara01')"></div>

    <InputRowGrid class="q-mt-lg">
      <template #fields>
        <InputField :isDark="true">
          <template #input>
            <q-input
              outlined
              clearable
              :placeholder="$t('form.telegramDiscordId_placeholder')"
              v-model="agentAccountId"
              ref="agentAccountIdRef"
              hide-bottom-space
              @keydown.enter="checkAgentId()"
              :rules="[(val) => (val && val.length > 0) || $t('form.telegramDiscordId_rules_01')]"
            >
              <template v-slot:append>
                <div @click="checkAgentId()"><img style="width: 20px;" src="../assets/images/cs-verifier/search-btn.png" alt="" /></div>
              </template>
            </q-input>
          </template>
        </InputField>
      </template>
    </InputRowGrid>

    <div class="content-para q-mt-lg">{{ $t("customerServiceVerifier.contentPara02") }}</div>
  </div>

  <q-dialog width="100%" v-model="accountVerifiedDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="flex justify-center">
          <template v-if="accountValid"><img src="../assets/images/cs-verifier/correct-icon.png" alt="" /></template>
          <template v-else><img src="../assets/images/cs-verifier/wrong-icon.png" alt="" /></template>
        </div>
        <div class="text-center q-py-md">
          <span class="txt-green" v-if="accountValid">
            {{ agentAccountId }} {{ $t('csVerifier.validAccDesc') }}
          </span>
          <span class="txt-red" v-else>
            {{ agentAccountId }} {{ $t('csVerifier.invalidAccDesc') }}
          </span>
        </div>

        <div class="bottom-btn flex full-width">
          <q-btn no-caps unelevated class="btn-primary btn-primary__full" v-close-popup>OK</q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import InputRowGrid from "src/components/auth/InputRowGrid.vue";
import InputField from "src/components/auth/InputField.vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const agentAccountId = ref("");
const agentAccountIdRef = ref();

const accountValid = ref(false);
const accountVerifiedDialog = ref(false);

const checkAgentId = () => {
  if (agentAccountId.value === "") {
    agentAccountIdRef.value.focus();
  } else {
    $q.loading.show({
      message: "Checking customer service account..."
    });

    const csAccount = agentAccountId.value;
    const csApiUrl = `/official-cs-acc/verify?csAccount=${csAccount}`;
    api
      .get(csApiUrl)
      .then((res) => {
        if (res.code === 0) {
          accountVerifiedDialog.value = true;
          accountValid.value = res.data;
          $q.loading.hide();
        }
      })
      .catch((e) => {
        $q.loading.hide();
      });
  }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.cs-verifier {
  .csv-icon {
    width: 120px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .main-title {
    display: flex;
    justify-content: center;
    color: #0286F1;
    font-weight: 700;
    font-size: 18.46px;
    margin-top: 16px;
  }

  .sub-title {
    display: flex;
    justify-content: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin-top: 8px;
  }

  .content-para {
    color: #b2bdbf;
    font-size: 14px;
    text-align: center;
  }
}

.txt-red {
  color: #ff3434;
}
.txt-green {
  color: #21ef89;
}
</style>

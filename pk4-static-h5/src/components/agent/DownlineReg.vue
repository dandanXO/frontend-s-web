<template>
  <div>
    <div class="acc-type-radio-container">
      <div>Account type:</div>
      <q-radio v-model="accTypeDownline" val="player" class="acc-type-radio">
        <template #default>
          <div class="row items-center no-wrap">
            <span>
              <img
                v-if="accTypeDownline === 'player'"
                src="@/assets/images/agent/check.png"
                alt="Checked"
                width="24"
                height="24"
              />
              <img v-else src="@/assets/images/agent/uncheck.png" alt="Unchecked" width="24" height="24" />
            </span>
            <span class="q-ml-sm">Player</span>
          </div>
        </template>
      </q-radio>
      <q-radio v-model="accTypeDownline" val="agent" class="acc-type-radio">
        <template #default>
          <div class="row items-center no-wrap">
            <span>
              <img
                v-if="accTypeDownline === 'agent'"
                src="@/assets/images/agent/check.png"
                alt="Checked"
                width="24"
                height="24"
              />
              <img v-else src="@/assets/images/agent/uncheck.png" alt="Unchecked" width="24" height="24" />
            </span>
            <span class="q-ml-sm">Agent</span>
          </div>
        </template>
      </q-radio>
    </div>

    <InputRowGrid>
      <template #fields>
        <InputField :isDark="true" label="UserName">
          <template #input>
            <q-input
              outlined
              clearable
              lazy-rules
              ref="ifscRef"
              type="number"
              maxlength="13"
              placeholder="Please Enter The Username"
              v-model="downlineRegForm.username"
              hide-bottom-space
              :rules="[]"
            ></q-input>
          </template>
        </InputField>

        <InputField :isDark="true" label="Login Password">
          <template #input>
            <q-input
              outlined
              clearable
              lazy-rules
              ref="ifscRef"
              type="number"
              maxlength="13"
              placeholder="Please Enter The Login Password"
              v-model="downlineRegForm.password"
              hide-bottom-space
              :rules="[]"
            ></q-input>
          </template>
        </InputField>

        <InputField :isDark="true" label="Remarks">
          <template #input>
            <q-input
              outlined
              clearable
              lazy-rules
              ref="ifscRef"
              type="number"
              maxlength="13"
              placeholder="Please Enter The Remarks"
              v-model="downlineRegForm.remarks"
              hide-bottom-space
              :rules="[]"
            ></q-input>
          </template>
        </InputField>
      </template>
    </InputRowGrid>

    <div class="rebate-setting-container">
      <div>Rebate Setting:</div>
      <div class="toggle-container">
        <span class="toggle-left-label" :class="!isHighestDownlineReg ? 'active' : ''">Lowest</span>
        <q-toggle
          v-model="isHighestDownlineReg"
          color="primary"
          keep-color
          dense
          size="md"
          ripple="false"
          class="custom-toggle"
        />
        <span class="toggle-right-label" :class="isHighestDownlineReg ? 'active' : ''">Highest</span>
      </div>
    </div>

    <div class="custom-btn">SUBMIT</div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import InputField from "@/components/auth/InputField.vue";
import InputRowGrid from "@/components/auth/InputRowGrid.vue";

const accTypeDownline = ref("player");
const downlineRegForm = reactive({
  username: "",
  password: "",
  remarks: ""
});
const isHighestDownlineReg = ref(false);
</script>

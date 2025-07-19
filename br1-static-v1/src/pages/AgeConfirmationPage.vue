<template>
  <div class="age-confirmation-container">
    <img class="ace-logo" src="../assets/55-ace-logo.png" />
    <div class="content">Please tell us: when were you born?</div>
    <img class="no-under-18-img" src="../assets/images/index/no-under-18.png" />
    <div>
      <div class="row q-col-gutter-x-md">
        <q-input
          type="text"
          inputmode="numeric"
          pattern="\d*"
          maxlength="2"
          hide-bottom-space
          v-model="regForm.dayOfBirth"
          color="white"
          class="landing-input col-3"
          outlined
          placeholder="DD"
          @keypress="onlyDigits"
          @blur="padOnBlur('dayOfBirth')"
        />
        <q-input
          type="text"
          inputmode="numeric"
          pattern="\d*"
          maxlength="2"
          hide-bottom-space
          v-model="regForm.monthOfBirth"
          class="landing-input col-3"
          outlined
          placeholder="MM"
          label-color="white"
          @keypress="onlyDigits"
          @blur="padOnBlur('monthOfBirth')"
        />
        <q-input
          type="text"
          inputmode="numeric"
          pattern="\d*"
          maxlength="4"
          hide-bottom-space
          v-model="regForm.yearOfBirth"
          class="landing-input col-3"
          outlined
          placeholder="YYYY"
          label-color="white"
          @keypress="onlyDigits"
          @blur="validateBirthYear()"
        />
        <q-btn class="col-3 enter-btn" flat label="ENTER" @click="onEnterBirthdate" />
      </div>
      <div class="text-negative text-center q-mt-lg" v-if="isBirthdateInvalid || isInvalidBirthYear">Date inválida</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useQuasar } from "quasar";
import { t } from "src/boot/lang";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const regForm = reactive({
  dayOfBirth: "",
  monthOfBirth: "",
  yearOfBirth: ""
});

const onlyDigits = (e) => {
  // Allow only digits (0–9)
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

const padOnBlur = (field) => {
  if (regForm[field].length === 1) {
    regForm[field] = "0" + regForm[field];
  }
};

const isInvalidBirthYear = ref(false);
const validateBirthYear = () => {
  isInvalidBirthYear.value = regForm.yearOfBirth.length !== 4;
};

const isBirthdateInvalid = computed(() => {
  const { dayOfBirth, monthOfBirth, yearOfBirth } = regForm;

  const day = parseInt(dayOfBirth, 10);
  const month = parseInt(monthOfBirth, 10);
  const year = parseInt(yearOfBirth, 10);

  const hasDay = dayOfBirth.length > 0;
  const hasMonth = monthOfBirth.length > 0;
  const hasYear = yearOfBirth.length === 4;

  // Immediate invalid range checks
  if (hasDay && (day < 1 || day > 31)) return true;
  if (hasMonth && (month < 1 || month > 12)) return true;

  if (hasDay && hasMonth && hasYear) {
    const inputDate = new Date(year, month - 1, day);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 200, now.getMonth(), now.getDate());

    // Check if it's a valid calendar date
    const isRealDate =
      inputDate.getFullYear() === year && inputDate.getMonth() === month - 1 && inputDate.getDate() === day;

    if (!isRealDate) return true;

    // Check if date is in the future
    if (inputDate > now) return true;

    // Check if date is more than 200 years ago
    if (inputDate < minDate) return true;
  }

  return false;
});

const isUnder18 = () => {
  const { dayOfBirth, monthOfBirth, yearOfBirth } = regForm;

  if (dayOfBirth.length !== 2 || monthOfBirth.length !== 2 || yearOfBirth.length !== 4) {
    return true; // Incomplete date, treat as underage
  }

  const birthDate = new Date(parseInt(yearOfBirth), parseInt(monthOfBirth) - 1, parseInt(dayOfBirth));
  const today = new Date();

  const age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  const actualAge = hasHadBirthdayThisYear ? age : age - 1;

  return actualAge < 18;
};

const onEnterBirthdate = () => {
  if (isBirthdateInvalid.value || isInvalidBirthYear.value) {
    return;
  }

  if (isUnder18()) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("notify.siteAgeRestrict"),
      icon: "report_problem"
    });
    return;
  }

  localStorage.setItem("age_confirmation", true);
  router.replace("/home");
};
</script>
<style scoped lang="scss">
.age-confirmation-container {
  // min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
  background: url("../assets/images/index/auth-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // justify-content: center;
  align-items: center;
}
.content {
  font-family: Poppins;
  font-weight: 800;
  font-style: ExtraBold;
  font-size: 26.17px;
  leading-trim: NONE;
  line-height: 44.86px;
  letter-spacing: 0%;
  text-align: center;
  padding-top: 20px;
}
.ace-logo {
  width: 50%;
  min-width: 180px;
  padding-top: 75px;
}
.no-under-18-img {
  width: 25%;
  min-width: 75px;
  padding: 20px 0 50px;
}
.landing-input {
  width: 25%;
  font-size: 1rem;
  margin-bottom: 10px;
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
  }
  :deep(.q-field__control):before {
    border-color: #ffffff3d;
    background-color: #ffffff21;
    border-width: 2px;
  }

  :deep(.q-placeholder) {
    color: #a7a7a7;
  }

  .white-svg {
    filter: brightness(0) invert(1);
  }
}

.enter-btn {
  // border: 2px solid #ffffff21;
  background-color: #ffffff21;
  border-radius: 4px;
  height: 56px;
  width: 20%;
  font-size: 1rem;
  margin-left: 16px;
  color: #717171;
}
</style>

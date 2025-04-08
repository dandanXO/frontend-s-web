<template>
  <BlockUI :blocked="store.isAuthLoading" style="width: 100vw; height: 100vh">
    <!-- <LangToggle style="position: absolute; top: 20px; right: 20px; z-index: 1" /> -->
    <ThemeToggle style="position: absolute; top: 20px; left: 20px; z-index: 1" />

    <canvas class="background"></canvas>
    <Card class="login-form">
      <template #content>
        <LoadingSpinner v-if="store.isAuthLoading" />

        <template v-else>
          <img src="../assets/logo.png" height="80px;" style="display: flex; margin: 0 auto 20px" />
          <Form
            class="flex flex-col gap-4 w-full sm:w-56"
            style="display: flex; flex-direction: column; gap: 15px"
          >
            <FormField
              v-slot="$field"
              as="section"
              name="username"
              initialValue=""
              class="flex flex-col gap-2"
            >
              <InputText
                type="text"
                :placeholder="$t('username')"
                style="width: 100%"
                v-model="loginForm.loginName"
                :disabled="store.isAuthLoading"
              />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" asChild name="password" initialValue="">
              <section class="flex flex-col gap-2">
                <Password
                  type="text"
                  :placeholder="$t('password')"
                  :feedback="false"
                  toggleMask
                  fluid
                  v-model="loginForm.password"
                  :disabled="store.isAuthLoading"
                />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                  $field.error?.message
                }}</Message>
              </section>
            </FormField>
            <Button
              type="submit"
              severity="info"
              :label="$t('submit')"
              style="width: 100%"
              @click="onFormSubmit"
              :disabled="store.isAuthLoading"
            />
          </Form>
        </template>
      </template>
    </Card>
  </BlockUI>
</template>

<script setup>
import { onMounted, reactive, onUnmounted } from 'vue'
import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { DashboardService } from '@/service/DashboardService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUserStore } from '@/stores/userStore'
import ThemeToggle from '@/components/Header/ThemeToggle.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()

const store = useUserStore()

const loginForm = reactive({
  loginName: 'paul001',
  password: '111111',
})

const toast = useToast()

const onFormSubmit = () => {
  store.isAuthLoading = true
  store.loginName = loginForm.loginName
  DashboardService.logIn(loginForm.loginName, loginForm.password)
    .then((result) => {
      if (result) {
        router.push({ path: '/' })
        store.isAuthLoading = false
        toast.add({ severity: 'success', summary: t('loggedInSuccessfully'), life: 3000 })
      } else {
        store.isAuthLoading = false
      }
    })
    .catch(() => {
      store.isAuthLoading = false
    })
}

onMounted(() => {})

onUnmounted(() => {})
</script>

<style lang="scss" scoped>
.background {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  z-index: 0;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
}
</style>

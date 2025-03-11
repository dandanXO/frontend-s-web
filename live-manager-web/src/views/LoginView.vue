<template>
  <canvas class="background"></canvas>
  <Card class="login-form" v-if="isLoading">
    <template #content>
      <LoadingSpinner />
    </template>
  </Card>
  <Card class="login-form" v-else>
    <template #content>
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
            placeholder="Username"
            style="width: 100%"
            v-model="loginForm.loginName"
            :disabled="isLoading"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
            $field.error?.message
          }}</Message>
        </FormField>
        <FormField v-slot="$field" asChild name="password" initialValue="">
          <section class="flex flex-col gap-2">
            <Password
              type="text"
              placeholder="Password"
              :feedback="false"
              toggleMask
              fluid
              v-model="loginForm.password"
              :disabled="isLoading"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </section>
        </FormField>
        <Button
          type="submit"
          severity="info"
          label="Submit"
          style="width: 100%"
          @click="onFormSubmit"
          :disabled="isLoading"
        />
      </Form>
    </template>
  </Card>
</template>

<script setup>
import Particles from 'particlesjs'
import { onMounted, reactive, inject, ref } from 'vue'
import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { DashboardService } from '@/service/DashboardService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loginForm = reactive({
  loginName: 'testloginname',
  password: 'testpassword',
})

const isLoading = ref(false)

const toast = useToast()

const isLoggedIn = inject('isLoggedIn')

const onFormSubmit = () => {
  isLoading.value = true
  console.log('here', loginForm)
  DashboardService.logIn(loginForm.loginName, loginForm.password)
    .then((result) => {
      console.log('here', result)

      if (result) {
        setTimeout(() => {
          isLoggedIn.value = true
          isLoading.value = false
          toast.add({ severity: 'success', summary: '成功登录', life: 3000 })
        }, 2000)
      }
    })
    .catch(() => {
      isLoading.value = false
    })
}

const initParticles = () => {
  Particles.init({
    selector: '.background',
    color: ['#9ddafa', '#418cc5', '#dddff1', '#708ac6'],
    connectParticles: true,
    responsive: [
      {
        breakpoint: 10,
        options: {
          color: '#00C9B1',
          maxParticles: 1,
          connectParticles: false,
          speed: 0.2,
        },
      },
    ],
  })
}

onMounted(() => {
  initParticles()
})
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

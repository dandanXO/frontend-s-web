<template>
  <canvas class="background"></canvas>
  <div class="login-form">
    <img src="../assets/gif.gif" height="80px;" />
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
      />
    </Form>
  </div>
</template>

<script setup>
import Particles from 'particlesjs'
import { onMounted, reactive, inject } from 'vue'
import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { DashboardService } from '@/service/DashboardService'

const loginForm = reactive({
  loginName: 'testloginname',
  password: 'testpassword',
})

const toast = useToast()

const isLoggedIn = inject('isLoggedIn')

const onFormSubmit = ({ valid }) => {
  console.log('here', loginForm)
  DashboardService.logIn(loginForm.loginName, loginForm.password).then((result) => {
    console.log('here', result)

    if (result) {
      toast.add({ severity: 'success', summary: '已登入，页面即将转变...', life: 3000 })

      setTimeout(() => {
        isLoggedIn.value = true
      }, 2000)
    }
  })
  //   if (valid) {
  //     toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })
  //   }
}

const initParticles = () => {
  Particles.init({
    selector: '.background',
    color: ['#bdbdbd', '#636363'],
    connectParticles: true,
    responsive: [
      {
        breakpoint: 100,
        options: {
          color: '#00C9B1',
          maxParticles: 5,
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
  background: url('../assets/bg1.jpg') center center no-repeat;
  background-size: 100% 100%;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #00000040;
  padding: 30px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
}
</style>

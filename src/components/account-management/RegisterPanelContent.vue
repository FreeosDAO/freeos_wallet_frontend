<template>
  <div>
    <q-stepper
      v-model="registerStep"
      ref="registerStepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="step1"
        :done="registerStep > 1"
      >
        <div class="text-h6 text-center q-mb-lg">Join FreeOS</div>
        <div>
          <q-input placeholder="FULL NAME" filled ref="myRegisterFullName" v-model="registerFullName" type="text" :rules="[val => !!val || 'Please enter your full name']">
          </q-input>
        </div>
        <div class="text-center q-pt-md q-pb-lg">
          Please enter your phone number
        </div>
        <div>
          <q-input placeholder="FULL NAME" filled ref="myRegisterFullName" v-model="registerFullName" type="text" :rules="[val => !!val || 'Please enter your full name']">
          </q-input>
        </div>
        <div class="text-center q-pt-md q-pb-lg">
          Verification code will be sent to this phone
        </div>
        <div class="text-center q-pt-md q-pb-lg">
          <q-checkbox v-model="isCheckTerm" /> I accept
          <span style="text-decoration: underline; cursor: pointer;" class="text-teal">Terms and Conditions</span>
          and
          <span style="text-decoration: underline; cursor: pointer;" class="text-teal">Privacy Policy</span>
        </div>
      </q-step>
      <q-step
        :name="2"
        title="step2"
        :done="registerStep > 2"
      >
        <div class="text-h6 text-center">
          We sent you an verification code to your email2
        </div>
        <div class="text-center q-pt-sm">
          Please check your email including spam folder
        </div>
        <div class="q-mt-xl">
          <q-input filled v-model="registerEmailCode" type="text" />
        </div>
        <div class="text-center q-mt-sm q-mb-xl">
          <q-btn flat color="primary" no-caps @click="onRegisterEmailResend()">Resend</q-btn>
        </div>
      </q-step>
      <q-step
        :name="3"
        title="step3"
        :done="registerStep > 3"
      >
        <div class="text-h6 text-center q-mb-xl">Welcome to FreeOS3</div>
        <div>
          <q-input filled ref="myRegisterEmail" v-model="registerEmail" type="email" :rules="[val => !!val || 'Email is missing', isValidEmail]">
          </q-input>
        </div>
        <div class="text-center q-pt-sm q-pb-xl">
          A verification code will be sent to this email
        </div>
        <div class="text-center">
          <q-btn color="primary" no-caps @click="onRegularRegister()">Register</q-btn>
        </div>
        <div class="text-center q-pt-sm q-pb-sm">
          OR
        </div>
        <div class="text-center">
          <q-btn color="primary" no-caps>Register using EOS wallet</q-btn>
        </div>
      </q-step>
      <q-step
        :name="4"
        title="step4"
      >
        <div class="text-h6 text-center">
          We sent you an verification code to your email4
        </div>
        <div class="text-center q-pt-sm">
          Please check your email including spam folder
        </div>
        <div class="q-mt-xl">
          <q-input filled v-model="registerEmailCode" type="text" />
        </div>
        <div class="text-center q-mt-sm q-mb-xl">
          <q-btn flat color="primary" no-caps @click="onRegisterEmailResend()">Resend</q-btn>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation style="display: flex; justify-content: space-between;">
          <q-btn v-if="registerStep > 1" flat color="primary" @click="$refs.registerStepper.previous()" label="Go back" class="q-ml-sm" />
          <q-btn v-if="registerStep === 1" flat color="primary" style="visibility: hidden;" label="Go back" class="q-ml-sm" />
          <q-btn v-if="registerStep < 4" :disable="registerStep === 1 && !isCheckTerm" @click="$refs.registerStepper.next()" color="primary" label="Continue" />
          <q-btn v-if="registerStep === 4" @click="onRegisterFinish()" color="primary" label="Continue" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
export default {
  name: 'RegisterPanelContent',
  data () {
    return {
      tab: 'register',
      registerFullName: 'Jack Lee',
      registerEmail: 'test@gmail.com',
      registerEmailCode: 'QlB3EI',
      registerStep: 1,
      isCheckTerm: true
    }
  },
  methods: {
    onRegularRegister () {
      if (this.registerEmail && this.isValidEmail(this.registerEmail) !== 'Invalid email') {
        this.$refs.registerStepper.next()
      }
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    onRegisterEmailResend () {},
    onRegisterFinish () {
      this.$emit('onRegisterFinish', {
        isFinished: true,
        username: 'Tom'
      })
    }
  }
}
</script>

<style scoped>

</style>

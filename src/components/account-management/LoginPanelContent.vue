<template>
  <div>
    <q-stepper
      v-model="signinStep"
      ref="signinStepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="step1"
        :done="signinStep > 1"
      >
        <div class="text-h6 text-center q-mb-xl">Welcome to FreeOS</div>
        <div>
          <q-input filled ref="mySigninEmail" v-model="signinEmail" type="email" :rules="[val => !!val || 'Email is missing', isValidEmail]">
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
        </div>
        <div class="text-center q-pt-sm q-pb-xl">
          A verification code will be sent to this email
        </div>
        <div class="text-center">
          <q-btn color="primary" no-caps @click="onRegularLogin()">Login</q-btn>
        </div>
        <div class="text-center q-pt-sm q-pb-sm">
          OR
        </div>
        <div class="text-center">
          <q-btn color="primary" @click="onLoginByWallet" no-caps>Login using EOS wallet</q-btn>
        </div>
      </q-step>
      <q-step
        :name="2"
        title="step2"
      >
        <div class="text-h6 text-center">
          We sent you an verification code to your email
        </div>
        <div class="text-center q-pt-sm">
          Please check your email including spam folder
        </div>
        <div class="q-mt-xl">
          <q-input filled ref="mySigninEmailCode" v-model="signinEmailCode" type="text" :rules="[val => !!val || 'Required']" />
        </div>
        <div class="text-center q-mt-sm q-mb-xl">
          <q-btn flat color="primary" no-caps @click="onSigninEmailResend()">Resend</q-btn>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation style="display: flex; justify-content: space-between;">
          <q-btn v-if="signinStep > 1" flat color="primary" @click="$refs.signinStepper.previous()" label="Go back" class="q-ml-sm" />
          <q-btn v-if="signinStep === 2" @click="onSigninFinish()" color="primary" label="Continue" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import ApiCall from 'src/services/api-call'
export default {
  name: 'LoginPanelContent',
  data () {
    return {
      tab: 'signin',
      signinEmail: '',
      signinEmailCode: '',
      signinStep: 1
    }
  },
  methods: {
    onLoginByWallet () {
      ApiCall.actionReguser('yvetecoleman', 'e')
    },
    onRegularLogin () {
      this.$refs.mySigninEmail.validate()
      if (!this.$refs.mySigninEmail.hasError) {
        this.$refs.signinStepper.next()
      }
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    onSigninEmailResend () {},
    onSigninFinish () {
      this.$refs.mySigninEmailCode.validate()
      if (!this.$refs.mySigninEmailCode.hasError) {
        this.$emit('onSigninFinish', {
          isFinished: true,
          username: 'Tom(Signed)'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

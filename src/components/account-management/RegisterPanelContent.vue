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
        <div
          style="display: flex; align-items: baseline; justify-content: space-between;"
        >
          <q-select
            filled
            v-model="telPrefix"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="telPrefixOptions"
            @filter="telPrefixFilterFn"
            ref="myRegisterTelPrefix"
            style="width: 20%"
            :rules="[val => !!val || 'Please select an option']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            style="width: 75%"
            placeholder="Phone number"
            filled
            ref="myRegisterPhoneNumber"
            v-model="registerPhoneNumber"
            type="text"
            :rules="[val => !!val || 'Please enter your phone number', val => val > 0 && val < 10000000000000000000 || 'Wrong phone number',]"
          >
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
          Enter the verification code sent to your phone
        </div>
        <div class="q-mt-xl">
          <q-input filled ref="myRegisterPhoneCode" v-model="registerPhoneCode" type="text" :rules="[val => !!val || 'Required']" />
        </div>
        <div class="text-center q-mt-sm q-mb-xl">
          <q-btn flat color="primary" no-caps @click="onRegisterPhoneResend()">Resend</q-btn>
        </div>
      </q-step>
      <q-step
        :name="3"
        title="step3"
        :done="registerStep > 3"
      >
        <div class="text-h6 text-center q-mb-xl">Protect your account with two-factor authentication</div>
        <div>
          <q-input filled ref="myRegisterEmail" v-model="registerEmail" type="email" :rules="[val => !!val || 'Email is missing', isValidEmail]">
          </q-input>
        </div>
        <div class="text-center q-pt-sm q-pb-xl">
          A verification code will be sent to this email
        </div>
      </q-step>
      <q-step
        :name="4"
        title="step4"
      >
        <div class="text-h6 text-center">
          We sent you an verification code to your email
        </div>
        <div class="text-center q-pt-sm">
          Please check your email including spam folder
        </div>
        <div class="q-mt-xl">
          <q-input filled ref="myRegisterEmailCode" v-model="registerEmailCode" type="text" :rules="[val => !!val || 'Required']" />
        </div>
        <div class="text-center q-mt-sm q-mb-xl">
          <q-btn flat color="primary" no-caps @click="onRegisterEmailResend()">Resend</q-btn>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation style="display: flex; justify-content: space-between; align-items: flex-end;">

          <q-btn v-if="registerStep > 1 && registerStep !== 3" flat color="primary" @click="$refs.registerStepper.previous()" label="Go back" class="q-ml-sm" />
          <q-btn v-if="registerStep === 1" flat color="primary" style="visibility: hidden;" label="Go back" class="q-ml-sm" />
          <div v-if="registerStep === 3">
            <q-btn style="display: block;" flat color="primary" @click="$refs.registerStepper.previous()" label="Go back" class="q-ml-sm" />
            <q-btn style="display: block;" flat color="primary" @click="onRegisterFinish('Without2FA')" label="Continue without 2FA" class="q-ml-sm" />
          </div>
          <q-btn v-if="registerStep < 5" :disable="registerStep === 1 && !isCheckTerm" @click="onNext" color="primary" :label="registerStep === 2 ? 'Register' : 'Continue'" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
const telPrefixOptions = ['+64', '+61', '+86']
export default {
  name: 'RegisterPanelContent',
  data () {
    return {
      tab: 'register',
      registerFullName: '',
      registerEmail: '',
      registerEmailCode: '',
      registerPhoneCode: '',
      registerStep: 1,
      isCheckTerm: false,
      telPrefix: '+64',
      telPrefixOptions: telPrefixOptions,
      registerPhoneNumber: ''
    }
  },
  methods: {
    telPrefixFilterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.telPrefixOptions = telPrefixOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    onNext () {
      switch (this.registerStep) {
        case 1:
          this.$refs.myRegisterFullName.validate()
          this.$refs.myRegisterPhoneNumber.validate()
          this.$refs.myRegisterTelPrefix.validate()
          if (
            !this.$refs.myRegisterFullName.hasError &&
            !this.$refs.myRegisterTelPrefix.hasError &&
            !this.$refs.myRegisterPhoneNumber.hasError
          ) {
            this.$refs.registerStepper.next()
          }
          break
        case 2:
          this.$refs.myRegisterPhoneCode.validate()
          if (
            !this.$refs.myRegisterPhoneCode.hasError
          ) {
            this.$refs.registerStepper.next()
          }
          break
        case 3:
          this.$refs.myRegisterEmail.validate()
          if (
            !this.$refs.myRegisterEmail.hasError
          ) {
            this.$refs.registerStepper.next()
          }
          break
        case 4:
          this.$refs.myRegisterEmailCode.validate()
          if (
            !this.$refs.myRegisterEmailCode.hasError
          ) {
            this.onRegisterFinish()
          }
          break
      }
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    onRegisterPhoneResend () {},
    onRegisterEmailResend () {},
    onRegisterFinish (type) {
      this.$emit('onRegisterFinish', {
        isFinished: true,
        username: 'Tom(Registered' + type + ')'
      })
    }
  }
}
</script>

<style scoped>

</style>

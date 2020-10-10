<template>
  <div>
    <q-toolbar-title v-if="username" class="fixed-right q-mr-md q-mt-xs">
      <q-avatar>
        <q-icon size='md' name="face" />
      </q-avatar>
      {{username}}
    </q-toolbar-title>
    <q-btn flat v-if="!username" @click="isShowDialog=true">Sign up</q-btn>
    <q-dialog v-model="isShowDialog">
      <q-card>
        <q-tabs
          v-model="tab"
          class="text-teal"
        >
          <q-tab name="signin" label="Sign In" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="signin">
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
                    <q-btn color="primary" no-caps>Login using EOS wallet</q-btn>
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
                    <q-input filled v-model="signinEmailCode" type="text" />
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
          </q-tab-panel>
          <q-tab-panel name="register">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'LoginAndRegisterDialog',
  data () {
    return {
      username: '',
      isShowDialog: false,
      tab: 'signin',
      signinEmail: '',
      signinEmailCode: '',
      signinStep: 1
    }
  },
  methods: {
    onRegularLogin () {
      if (this.signinEmail && this.isValidEmail(this.signinEmail) !== 'Invalid email') {
        this.$refs.signinStepper.next()
      }
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    onSigninEmailResend () {},
    onSigninFinish () {
      this.isShowDialog = false
      this.username = 'Tom'
    }
  }
}
</script>

<style>
.q-stepper__header--border {
  display: none;
}
.q-tab-panel {
  padding: 0;
}
</style>

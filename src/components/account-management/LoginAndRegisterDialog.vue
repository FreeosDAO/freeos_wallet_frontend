<template>
  <div>
    <div>
      <q-toolbar-title v-if="username" class="q-mr-md q-mt-xs">
        <q-avatar>
          <q-icon size='md' name="face" />
        </q-avatar>
        {{username}}
      </q-toolbar-title>
    </div>
    <q-btn no-caps flat v-if="!username" @click="isShowDialog=true">Login</q-btn>
    <q-dialog
      v-model="isShowDialog"
    >
      <q-card
        style="width: 33%; min-width: 23rem;"
      >
        <q-tabs
          v-model="tab"
          align="justify"
          narrow-indicator
          indicator-color="transparent"
          active-color="teal"
          active-bg-color="teal-1"
          class="text-grey-5 shadow-2"
        >
          <q-tab :no-caps="false" name="signin" label="Sign In" />
          <q-tab :no-caps="false" name="register" label="Register" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="signin">
            <LoginPanelContent v-on:onSigninFinish="onSigninFinish"></LoginPanelContent>
          </q-tab-panel>
          <q-tab-panel name="register">
            <RegisterPanelContent v-on:onRegisterFinish="onRegisterFinish"></RegisterPanelContent>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import LoginPanelContent from './LoginPanelContent'
import RegisterPanelContent from './RegisterPanelContent'
export default {
  name: 'LoginAndRegisterDialog',
  components: {
    LoginPanelContent,
    RegisterPanelContent
  },
  data () {
    return {
      username: '',
      isShowDialog: false,
      tab: 'signin'
    }
  },
  methods: {
    onSigninFinish (event) {
      if (event.isFinished) {
        this.username = event.username
        this.isShowDialog = false
        this.$emit('onSigninFinish', {
          isFinished: event.isFinished,
          username: event.username
        })
      }
    },
    onRegisterFinish (event) {
      if (event.isFinished) {
        this.username = event.username
        this.isShowDialog = false
      }
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

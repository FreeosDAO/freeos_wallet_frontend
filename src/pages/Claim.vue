<template>
  <div>
    <div class="text-center">
      <div class="q-ma-md q-mt-lg">
        <q-btn color="primary" @click="onClaim" no-caps label="Claim FreeOS" />
      </div>
      <div class="q-ma-md">
        Next claim will be available in 3 days
      </div>
      <div class="q-ma-md q-mt-lg">
        To be able to claim you need to have 5 EOS staked on your account.<br>
        More Information staking/unstaking you can find <span @click="$router.push('/stake')" class="text-primary" style="text-decoration: underline; cursor: pointer;">here</span>
      </div>
      <div class="q-ma-md q-mt-xl">
        You can get notified about upcoming claim via email or pop-notification on your mobile device
      </div>
      <div class="q-ma-md">
        <span class="q-mr-lg">Notification</span>
        <q-toggle
          :label="isNotification ? 'ON' : 'OFF'"
          color="green"
          v-model="isNotification"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Claim',
  data () {
    return {
      isNotification: true
    }
  },
  methods: {
    ...mapActions('claim', ['actionClaim']),
    async onClaim () {
      const result = await this.actionClaim()
      console.log(result) // Display the result/error of the
    }
  }
}
</script>

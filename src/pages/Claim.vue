<template>
  <div>
    <div class="text-center">
      <div class="q-ma-md q-mt-lg">
        <q-btn color="primary" @click="() => actionClaim()" no-caps label="Claim FreeOS" />
      </div>
      <div class="q-ma-md" v-if="claimInfo">
        Next claim will be available in {{getDateDiff()}} days
      </div>
      <div class="q-ma-md q-mt-lg" v-if="claimInfo">
        To be able to claim you need to have {{claimInfo.freeosHoldingRequire.tokens_required}} EOS staked on your account.<br>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Claim',
  data () {
    return {
      isNotification: true
    }
  },
  computed: {
    ...mapGetters('account', ['claimInfo'])
  },
  methods: {
    ...mapActions('claim', ['actionClaim']),
    getDateDiff () {
      const endDate = new Date(this.claimInfo.claimCalendar.end_date)
      const startDate = new Date()
      return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
    }
  }
}
</script>

<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h5 q-pa-md q-mx-auto" style="width: 70%;">
          Stake {{claimInfo.liquidInAccount.balance}}
        </div>
        <p>To be eligible to Claim your weekly FREEOS tokens</p>
        <div class="q-ma-md q-mt-lg">
          <q-btn color="primary" :disable="!isMeetStakeMinRequirment()" @click="() => onStake()" no-caps label="Stake" />
        </div>
      </q-card-section>
    </q-card>
    <p class="text-center q-mt-md">Current Staking Requirement = {{claimInfo.respStakeRequirement.default_stake}}</p>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('account', ['claimInfo'])
  },
  methods: {
    ...mapActions('stake', ['actionStake']),
    ...mapActions('account', ['getAccountInfo']),
    async onStake () {
      await this.actionStake()
      this.getAccountInfo()
    },
    isMeetStakeMinRequirment () {
      return this.getAbsoluteAmount(this.claimInfo.liquidInAccount.balance) >= this.getAbsoluteAmount(this.claimInfo.respStakeRequirement.default_stake)
    },
    getAbsoluteAmount (balance) {
      if (!balance) {
        return 0
      }
      const amount = balance.split(' ')[0]
      return parseFloat(amount)
    }
  }
}
</script>

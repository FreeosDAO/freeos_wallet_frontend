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
import { mapState, mapActions, mapGetters } from 'vuex'
import { getAbsoluteAmount } from '@/utils/currency'

export default {
  computed: {
    ...mapState({
      accountName: state => state.account.accountName
    }),
    ...mapGetters('account', ['claimInfo'])
  },
  methods: {
    ...mapActions('stake', ['actionStake']),
    ...mapActions('account', ['getAccountInfo']),
    async onStake () {
      await this.actionStake(this.accountName)
      this.getAccountInfo()
    },
    isMeetStakeMinRequirment () {
      return getAbsoluteAmount(this.claimInfo.liquidInAccount.balance) >= getAbsoluteAmount(this.claimInfo.respStakeRequirement.default_stake)
    }
  }
}
</script>

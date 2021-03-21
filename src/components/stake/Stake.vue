<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h5 q-pa-md q-mx-auto" style="width: 70%;">
          Stake {{userStakeRequirement}} XPR
        </div>
        <p>To be eligible to Claim your weekly FREEOS tokens</p>
        <div class="q-ma-md q-mt-lg">
          <q-btn  :color="isMeetStakeMinRequirment() ? 'primary' : 'dark'"  :disable="!isMeetStakeMinRequirment()" @click="() => onStake()" no-caps label="Stake" />
        </div>
      </q-card-section>
    </q-card>
    <p class="text-center q-my-lg text-h6">Current Staking Requirement = {{userStakeRequirement}} XPR</p>
    <p v-if="!isMeetStakeMinRequirment()" class="text-negative text-bold">You currently do not have enough XPR to stake.</p>
    <p v-if="!isMeetStakeMinRequirment()">
      Please <router-link :to="{name: 'transfer'}">tranfer</router-link> an additional {{shortageAmount}} in order to stake.
    </p>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getAbsoluteAmount, getCurrency } from '@/utils/currency'

export default {
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      stakedInfo: state => state.account.claimInfo.stakedInfo,
      userCount: state => state.account.claimInfo.statistics.usercount,
      stakeRequirmentList: state => state.account.claimInfo.stakeRequirmentList
      // respStakeRequirement: state => state.account.claimInfo.respStakeRequirement
    }),
    ...mapGetters('account', ['claimInfo']),
    usersCurrentStakeReq () {
      const result = this.stakeRequirmentList.findIndex((r, index) => {
        if (this.userCount < r.threshold) {
          return index
        }
      })
      return this.stakeRequirmentList[result - 1]
    },
    userStakeRequirement () {
      if (!this.stakedInfo) {
        return ''
      }
      const accountType = String.fromCharCode(this.stakedInfo.account_type)
      if (!accountType) {
        return ''
      }
      let requirement = null
      for (const [key, value] of Object.entries(this.usersCurrentStakeReq)) {
        const requirementType = key.split('_')
        if (requirementType[1] === accountType) {
          requirement = value
          break
        }
      }

      return requirement
    },
    shortageAmount () {
      if (!this.userStakeRequirement || !this.claimInfo.liquidInAccount) {
        return ''
      }
      const currency = getCurrency(this.claimInfo.liquidInAccount.balance)
      const amount = this.userStakeRequirement - getAbsoluteAmount(this.claimInfo.liquidInAccount.balance)
      return `${amount} ${currency}`
    }
  },
  methods: {
    ...mapActions('stake', ['actionStake']),
    ...mapActions('account', ['getAccountInfo']),
    async onStake () {
      const amount = parseFloat(this.userStakeRequirement).toFixed(4) + ' ' + getCurrency(this.claimInfo.liquidInAccount.balance)
      const data = {
        accountName: this.accountName,
        amount
      }
      await this.actionStake(data)
      this.getAccountInfo()
    },
    isMeetStakeMinRequirment () {
      if (!this.claimInfo.liquidInAccount) {
        return false
      }
      return getAbsoluteAmount(this.claimInfo.liquidInAccount.balance) >= this.userStakeRequirement
    }
  }
}
</script>

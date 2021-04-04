<template>
  <div>
    <div class="col-xs-3"></div>
    <div class="col-xs-8">
      <div class="row">
        <div class="col-5">Liquid {{currency}}: </div>
        <div class="col-5 text-primary text-weight-bold">{{(claimInfo.liquidInAccount&&claimInfo.liquidInAccount.balance) || '0'}}</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row">
        <div class="col-5">Staked {{currency}}: </div>
        <div class="col-5 text-primary text-weight-bold">{{(claimInfo.stakedInfo&&claimInfo.stakedInfo.stake) || '0'}}</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row">
        <div class="col-5">Liquid FREEOS: </div>
        <div class="col-5 text-primary text-weight-bold">{{claimInfo.freeosInAccount}}</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <balance-vest />
      <div class="row text-green text-weight-bold">
        <div class="col-5">Total FREEOS: </div>
        <div class="col-5 flex items-center">{{totalFreeos}}
          <q-icon name="vpn_key" class="q-ml-md" title="air key" v-if="userHasAirKey"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAbsoluteAmount, getCurrency } from '@/utils/currency'
import { mapState, mapActions, mapGetters } from 'vuex'
import BalanceVest from './BalanceVest'
export default {
  computed: {
    ...mapState({
      vestedBalance: state => state.vest.balance
    }),
    ...mapGetters('account', ['claimInfo', 'userHasAirKey']),
    currency () {
      if (!this.claimInfo.liquidInAccount) {
        return ''
      }
      return getCurrency(this.claimInfo.liquidInAccount.balance)
    },
    totalFreeos () {
      const amount = getAbsoluteAmount(this.claimInfo.freeosInAccount) + getAbsoluteAmount(this.vestedBalance)
      return parseFloat(amount).toFixed(4) + ' FREEOS'
    }
  },
  components: {
    BalanceVest
  },
  methods: {
    ...mapActions({
      getLiquidInAccount: 'account/getLiquidInAccount',
      getUserStakedInfo: 'account/getUserStakedInfo',
      getFreeosInfo: 'account/getFreeosInfo'
    })
  },
  mounted () {
    setInterval(() => {
      this.getLiquidInAccount()
      this.getUserStakedInfo()
      this.getFreeosInfo()
    }, 10000)
  }
}
</script>

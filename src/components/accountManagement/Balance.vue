<template>
  <div>
    <div class="col-xs-3"></div>
    <div class="col-xs-8">
      <div class="row">
        <div class="col-5">Liquid: </div>
        <div class="col-5 text-primary text-weight-bold">{{(claimInfo.liquidInAccount&&claimInfo.liquidInAccount.balance) || '0'}}</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row">
        <div class="col-5">Staked: </div>
        <div class="col-5 text-primary text-weight-bold">{{(claimInfo.eosStaked&&claimInfo.eosStaked.stake) || '0'}}</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <balance-vest />
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row text-green text-weight-bold">
        <div class="col-5">Total FREEOS: </div>
        <div class="col-5">{{(claimInfo.freeosInAccount&&claimInfo.freeosInAccount.balance) || '0'}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BalanceVest from './BalanceVest'
export default {
  computed: {
    ...mapGetters('account', ['claimInfo'])
  },
  components: {
    BalanceVest
  }
}
</script>

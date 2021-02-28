<template>
  <div class="row">
    <div class="col-5 text-grey">Vested FREEOS: </div>
    <div class="col-5 text-grey text-weight-bold">{{vestedBalance}}</div>
    <div class="col-2">
      <q-btn
        size="sm"
        label="Unvest"
        color="primary"
        no-caps
        @click="unvest(accountName)"
        :disable="!canUnvest"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      vestedBalance: state => state.vest.balance,
      unVestHistory: state => state.vest.unVestHistory,
      unVestPercentage: state => state.vest.unVestPercentage,
      accountName: state => state.account.accountName,
      iterationNumber: state => state.calendar.currentIteration.iteration_number
    }),
    canUnvest () {
      if (this.vestedBalance !== '0.0000 FREEOS' && !this.unVestHistory && this.unVestPercentage > 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions({
      unvest: 'vest/unVest',
      getVestedRecord: 'vest/getVestedRecord',
      getUnVestHistory: 'vest/getUnVestHistory',
      getUnvestPercentage: 'vest/getUnvestPercentage'
    })
  },
  mounted () {
    this.getVestedRecord(this.accountName)
    const data = {
      accountName: this.accountName,
      iterationNumber: this.iterationNumber
    }
    this.getUnVestHistory(data)
    this.getUnvestPercentage(this.accountName)
  }
}
</script>

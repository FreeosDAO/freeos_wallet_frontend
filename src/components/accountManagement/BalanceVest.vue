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
        @click="unvest()"
        :disable="!canUnvest"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      canUnvest: true
    }
  },
  computed: {
    ...mapState({
      vestedBalance: state => state.vest.balance
    })
  },
  methods: {
    ...mapActions({
      unvest: 'vest/unVest',
      getVestedRecord: 'vest/getVestedRecord',
      getUnVestHistory: 'vest/getUnVestHistory'
    })
  },
  mounted () {
    this.getVestedRecord()
    this.getUnVestHistory()
  }
}
</script>

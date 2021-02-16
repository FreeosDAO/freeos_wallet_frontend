<template>
  <div class="text-center q-mx-auto" style="max-width: 1000px;">
    <div class="row full-width justify-around">
      <div class="col-xs-10 col-sm-5 q-mb-lg" v-if="stakeStatus === 'canStake'">
        <stake-card />
      </div>
      <div class="col-xs-10 col-sm-5 q-mb-lg" v-if="stakeStatus === 'canUnStake'">
        <unstake-card />
      </div>
    </div>
    <unstake-status v-if="stakeStatus === 'unStaking' "/>
    <unstaking-dialog />
  </div>
</template>

<script>
import StakeCard from 'components/stake/Stake'
import UnstakeCard from 'components/stake/Unstake'
import UnstakingDialog from 'components/stake/UnstakingDialog'
import UnstakeStatus from 'components/stake/UnstakeStatus'
import { mapGetters } from 'vuex'
import { getAbsoluteAmount } from '@/utils/currency'
export default {
  name: 'StakeAndUnstake',
  data () {
    return {
      stakedAmount: null,
      stakeStatus: null
    }
  },
  components: {
    StakeCard,
    UnstakeCard,
    UnstakeStatus,
    UnstakingDialog
  },
  computed: {
    ...mapGetters('account', ['claimInfo'])
  },
  watch: {
    claimInfo: {
      handler () {
        this.switchStatus()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    switchStatus () {
      if (!this.claimInfo) {
        return
      }
      if (this.userCanStake()) {
        this.stakeStatus = 'canStake'
      } else if (this.userCanUnstake()) {
        this.stakeStatus = 'canUnStake'
      }
    },
    userCanStake () {
      if (getAbsoluteAmount(this.claimInfo.liquidInAccount.balance) > 0) {
        return true
      } else {
        return false
      }
    },
    userCanUnstake () {
      if (getAbsoluteAmount(this.claimInfo.eosStaked.stake) > 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

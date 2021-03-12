<template>
  <div class="text-center q-mx-auto" style="max-width: 1000px;">
    <div class="row full-width justify-around">
      <div class="col-xs-10 col-sm-5 q-mb-lg" v-if="!stakedInfo">
        <q-btn
          color="primary"
          label="register"
        @click="onRegisterUser(accountName)" />
        <p><small>(you are not register yet)</small></p>
        <stake-card v-if="userCanStake"/>
      </div>
      <div class="col-xs-10 col-sm-5 q-mb-lg" v-if="stakedInfo">
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
import { mapState, mapActions } from 'vuex'
import { getAbsoluteAmount } from '@/utils/currency'
export default {
  name: 'StakeAndUnstake',
  data () {
    return {
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
    ...mapState({
      stakedInfo: state => state.account.claimInfo.stakedInfo,
      liquidInAccount: state => state.account.claimInfo.liquidInAccount,
      accountName: state => state.account.accountName
    })
  },
  methods: {
    ...mapActions('stake', ['onRegisterUser']),
    userCanStake () {
      if (getAbsoluteAmount(this.liquidInAccount.balance) > 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<template>
  <div class="text-center">
    <div class="col-xs-10 col-sm-5 q-mb-lg" v-if="!stakedInfo">
        <q-btn
          color="primary"
          label="register"
        @click="registerUser()" />
        <p><small>(you are not register yet)</small></p>
      </div>
    <div v-if="claimInfo&&!isMasterSwitchOpen">
      <b>Freeos system is not currently operational. Please check back later.</b>
    </div>
    <div v-if="claimInfo&&isMasterSwitchOpen">
      <div class="q-ma-md q-mt-lg">
        <q-btn :disable="isDisableClaim()" :color="isDisableClaim() ? 'dark' : 'primary'" @click="() => onClaim(accountName)" no-caps label="Claim FreeOS" />
      </div>
      <div class="q-ma-md" v-if="claimInfo&&claimInfo.respIsUserAlreadyClaimed">
        <template v-if=" nextCalendar">
          Next claim will be available in {{getDateDiff()}} days
        </template>
        <template v-else>
          Airclaim is completed.
        </template>
      </div>
      <div class="q-mt-lg" v-if="claimInfo&&isDisplayingStakedMessage() && userStakeRequirement">
        <p>To be able to claim, you need a total of <b>
          {{
            userStakeRequirement
          }}
        </b> staked on your account.</p>
        <p>
          More Information staking/unstaking you can find <router-link :to="{name: 'stake'}" class="text-primary" >here</router-link>.
        </p>
      </div>
      <div class="q-mt-lg q-mb-lg" v-if="isDisplayingHoldingRequirement() && !isUserHasAirKey">
        To be able to Claim, you need a total of <b>{{currentIteration.tokens_required}} FREEOS</b> in your account. <br>
        Please <span @click="$router.push('/transfer')" class="text-primary" style="text-decoration: underline; cursor: pointer;">transfer</span> an additional
        <b>{{currentIteration.tokens_required - parseFloat(totalFreeos)}} FREEOS</b>
        in order to Claim.
      </div>
<!--      <div class="q-ma-md q-mt-xl">-->
<!--        You can get notified about upcoming claim via email or pop-notification on your mobile device-->
<!--      </div>-->
<!--      <div class="q-ma-md">-->
<!--        <span class="q-mr-lg">Notification</span>-->
<!--        <q-toggle-->
<!--          :label="isNotification ? 'ON' : 'OFF'"-->
<!--          color="green"-->
<!--          v-model="isNotification"-->
<!--        />-->
<!--      </div>-->
    </div>
    <q-dialog v-model="isShowSuccessDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-h4 text-center" style="color: #5a89a3; font-weight: bolder;">Congratulations!</div>
          <div class="text-h6 text-center q-mt-lg q-mb-lg">You earned <b style="color: #41aad6">{{currentIteration && currentIteration.claim_amount}} FREEOS</b></div>
          <div class="text-center" v-if="nextCalendar">Come back next week to earn <b>{{nextCalendar.claim_amount}} FREEOS</b></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getAbsoluteAmount } from '@/utils/currency'
export default {
  name: 'Claim',
  data () {
    return {
      isNotification: true,
      isShowSuccessDialog: false
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      currentIteration: state => state.calendar.currentIteration,
      nextCalendar: state => state.calendar.nextCalendar,
      vestedBalance: state => state.vest.balance,
      freeosInAccount: state => state.account.claimInfo.freeosInAccount,
      stakedInfo: state => state.account.claimInfo.stakedInfo,
      userCount: state => state.account.claimInfo.statistics.usercount,
      stakeRequirmentList: state => state.account.claimInfo.stakeRequirmentList,
      airKey: state => state.account.claimInfo.respAirKey
    }),
    ...mapGetters('account', ['claimInfo']),
    ...mapGetters('claim', ['isClaimed', 'userAfterBalance', 'userPreviousBalance']),
    isMasterSwitchOpen () {
      return Number(this.claimInfo.respMasterSwitch.value) === 1
    },
    isUserHasAirKey () {
      const amount = getAbsoluteAmount(this.airKey)
      return amount !== 0
    },
    totalFreeos () {
      const amount = getAbsoluteAmount(this.claimInfo.freeosInAccount) + getAbsoluteAmount(this.vestedBalance)
      return amount + ' FREEOS'
    },
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
    }
  },
  methods: {
    ...mapActions('account', ['getAccountInfo']),
    ...mapActions('stake', ['onRegisterUser']),
    ...mapActions('claim', ['actionClaim']),
    async onClaim (accountName) {
      await this.actionClaim(accountName)
      this.getAccountInfo()
    },
    async registerUser () {
      await this.onRegisterUser(this.accountName)
      this.getAccountInfo()
    },
    getDateDiff () {
      const endDate = new Date(this.currentIteration.end_date).getTime()
      const startDate = new Date().getTime()
      return parseInt((endDate - startDate) / (1000 * 60 * 60 * 24))
    },
    isDisableClaim () {
      if (!this.isMasterSwitchOpen) {
        return true
      }
      // For it to to in a valid claim week. i.e. NOT week 0
      if (this.currentIteration.iteration_number === 0) {
        return true
      }
      // if week 1, stake_requirement can be 0
      if (this.currentIteration.iteration_number === 1 && this.isMasterSwitchOpen) {
        return false
      }

      // 2. For the user to have staked. i.e. their 'stake' field in the user record is equal to the 'stake_requirement' field.
      if (!this.hasUserStaked()) {
        return true
      }

      if (this.isUserHasAirKey) {
        if (!this.claimInfo.respIsUserAlreadyClaimed) {
          return false
        }
      }
      // 3. For the user to have balance of FREEOS >= the holding requirement for the week (go to week record and look at 'tokens_required'
      if (getAbsoluteAmount(this.totalFreeos) >= this.currentIteration.tokens_required) {
        // 5. They have not already claimed in the current week (see the table read required in the ‘Suggested Coding Activities’ section).
        if (!this.claimInfo.respIsUserAlreadyClaimed) {
          return false
        }
      }
      return true
    },
    isDisplayingStakedMessage () {
      if (!this.isDisableClaim()) {
        return false
      }
      if (this.currentIteration.iteration_number !== 0 && this.isMasterSwitchOpen && !this.hasUserStaked()) {
        return true
      }
      return false
    },
    hasUserStaked () {
      if (!this.claimInfo.respFreeosRecord) {
        return false
      }
      return this.claimInfo.respFreeosRecord.staked_iteration > 0
      // return !(
      //   !this.claimInfo.respFreeosRecord ||
      //   (this.claimInfo.respFreeosRecord.stake !== this.claimInfo.respFreeosRecord.stake_requirement)
      // )
    },
    isDisplayingHoldingRequirement () {
      if (!this.currentIteration) {
        return false
      }
      const tokensRequired = this.currentIteration.tokens_required
      return (getAbsoluteAmount(this.claimInfo.freeosInAccount) < tokensRequired)
    }
  },
  watch: {
    isClaimed: {
      immediate: true,
      handler: function (val) {
        if (val) {
          if (this.userPreviousBalance + this.currentIteration?.claim_amount === this.userAfterBalance) {
            this.isShowSuccessDialog = true
            this.getAccountInfo(this.accountName)
          }
        }
      }
    }
  }
}
</script>

<template>
  <div class="text-center">
    <div v-if="claimInfo&&!isMasterSwitchOpen">
      <b>Freeos system is not currently operational. Please check back later.</b>
    </div>
    <div v-if="claimInfo&&isMasterSwitchOpen">
      <div class="q-ma-md q-mt-lg">
        <q-btn :disable="isDisableClaim()" :color="isDisableClaim() ? 'dark' : 'primary'" @click="() => actionClaim(accountName)" no-caps label="Claim FreeOS" />
      </div>
      <div class="q-ma-md" v-if="claimInfo&&claimInfo.respIsUserAlreadyClaimed">
        Next claim will be available in {{getDateDiff()}} days
      </div>
      <div class="q-ma-md q-mt-lg" v-if="claimInfo&&isDisplayingStakedMessage()">
        To be able to claim you need to have <b>
          {{
            claimInfo.respFreeosRecord && claimInfo.respFreeosRecord.stake_requirement ||
            claimInfo.respStakeRequirement.default_stake
          }}
        </b> staked on your account.
      </div>
      <div class="q-mt-lg q-mb-lg" v-if="isDisplayingHoldingRequirement()">
        To be able to Claim, you need a total of <b>{{claimInfo.freeosHoldingRequire.tokens_required}} FREEOS</b> in your account. <br>
        Please <span @click="$router.push('/transfer')" class="text-primary" style="text-decoration: underline; cursor: pointer;">transfer</span> an additional
        <b>{{claimInfo.freeosHoldingRequire.tokens_required - parseFloat(claimInfo.freeosInAccount.balance)}} FREEOS</b>
        in order to Claim.
      </div>
      <div v-if="claimInfo&&isDisplayingStakedMessage()">
        More Information staking/unstaking you can find <span @click="$router.push('/stake')" class="text-primary" style="text-decoration: underline; cursor: pointer;">here</span>
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
      nextCalendar: state => state.calendar.nextCalendar
    }),
    ...mapGetters('account', ['claimInfo']),
    ...mapGetters('claim', ['isClaimed', 'userAfterBalance', 'userPreviousBalance']),
    isMasterSwitchOpen () {
      return Number(this.claimInfo.respMasterSwitch.value) === 1
    }
  },
  methods: {
    ...mapActions('account', ['getAccountInfo']),
    ...mapActions('claim', ['actionClaim']),
    getDateDiff () {
      const endDate = new Date(this.currentIteration.end_date).getTime()
      const startDate = new Date().getTime()
      return parseInt((endDate - startDate) / (1000 * 60 * 60 * 24))
    },
    isDisableClaim () {
      // For it to to in a valid claim week. i.e. NOT week 0
      if (this.currentIteration.iteration_number === 0) {
        return true
      }
      // if week 1, stake_requirement can be 0
      if (this.currentIteration.iteration_number === 1 && this.isMasterSwitchOpen) {
        return false
      }
      // 2. For the user to have staked. i.e. their 'stake' field in the user record is equal to the 'stake_requirement' field.
      if (
        this.claimInfo.respFreeosRecord &&
        (this.claimInfo.respFreeosRecord.stake === this.claimInfo.respFreeosRecord.stake_requirement)
      ) {
        // 3. For the user to have balance of FREEOS >= the holding requirement for the week (go to week record and look at 'tokens_required'
        if (
          this.claimInfo.freeosInAccount &&
          (parseFloat(this.claimInfo.freeosInAccount.balance) > this.claimInfo.freeosHoldingRequire.tokens_required)
        ) {
          // 4. For 'masterswitch' value to be '1'
          if (this.isMasterSwitchOpen) {
            // 5. They have not already claimed in the current week (see the table read required in the ‘Suggested Coding Activities’ section).
            if (!this.claimInfo.respIsUserAlreadyClaimed) {
              return false
            }
          }
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
      return !(
        !this.claimInfo.respFreeosRecord ||
        (this.claimInfo.respFreeosRecord.stake !== this.claimInfo.respFreeosRecord.stake_requirement)
      )
    },
    isDisplayingHoldingRequirement () {
      return this.claimInfo.freeosInAccount && (this.claimInfo.freeosInAccount.balance < this.claimInfo.freeosHoldingRequire.tokens_required)
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

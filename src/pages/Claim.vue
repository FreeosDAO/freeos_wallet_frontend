<template>
  <div class="text-center">
<!--    <div v-if="claimInfo&&parseFloat(claimInfo.respMasterSwitch.value) !== 1">-->
<!--      <b>Freeos system is not currently operational. Please check back later.</b>-->
<!--    </div>-->
    <div v-if="claimInfo&&parseFloat(claimInfo.respMasterSwitch.value) === 1">
      <div class="q-ma-md q-mt-lg">
        <q-btn :disable="isButtonDisable()" :color="isButtonDisable() ? 'dark' : 'primary'" @click="() => actionClaim(accountInfo.account_name)" no-caps label="Claim FreeOS" />
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
          <div class="text-h6 text-center q-mt-lg q-mb-lg">You earned <b style="color: #41aad6">{{claimInfo.claimCalendar.claim_amount}} FREEOS</b></div>
          <div class="text-center">Come back next week to earn <b>{{claimInfo.nextCalendar.claim_amount}} FREEOS</b></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Claim',
  data () {
    return {
      isNotification: true,
      isShowSuccessDialog: false
    }
  },
  computed: {
    ...mapGetters('account', ['accountInfo', 'claimInfo']),
    ...mapGetters('claim', ['isClaimed', 'userAfterBalance', 'userPreviousBalance'])
  },
  methods: {
    ...mapActions('account', ['getClaimInfo']),
    ...mapActions('claim', ['actionClaim']),
    getDateDiff () {
      const endDate = new Date(this.claimInfo.claimCalendar.end * 1000)
      const startDate = new Date()
      return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
    },
    isDisableClaim () {
      // 1. For it to to in a valid claim week. i.e. NOT week 0
      if (this.claimInfo.claimCalendar.week_number !== 0) {
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
            if (parseFloat(this.claimInfo.respMasterSwitch.value) === 1) {
              // 5. They have not already claimed in the current week (see the table read required in the ‘Suggested Coding Activities’ section).
              if (!this.claimInfo.respIsUserAlreadyClaimed) {
                return false
              }
            }
          }
        }
      }
      return true
    },
    isDisplayingStakedMessage () {
      if (this.claimInfo.claimCalendar.week_number !== 0) {
        if (parseFloat(this.claimInfo.respMasterSwitch.value) === 1) {
          if (!this.hasUserStaked()) {
            return true
          }
        }
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
    },
    isButtonDisable () {
      return this.isDisableClaim() ||
        this.isDisplayingStakedMessage() ||
        this.isDisplayingHoldingRequirement() ||
        this.claimInfo.respIsUserAlreadyClaimed
    }
  },
  watch: {
    isClaimed: {
      immediate: true,
      handler: function (val) {
        if (val) {
          if (this.userPreviousBalance + this.claimInfo.claimCalendar.claim_amount === this.userAfterBalance) {
            console.log(this.accountInfo.account_name)
            console.log(this.claimInfo.nextCalendar.claim_amount)
            this.isShowSuccessDialog = true
            this.getClaimInfo(this.accountInfo.account_name)
          }
        }
      }
    }
  }
}
</script>

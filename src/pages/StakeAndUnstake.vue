<template>
  <div class="text-center" style="max-width: 1000px; margin: 0 auto;">
    <div class="q-ma-lg">
      You have 100 EOS staked on your account
    </div>
    <div class="row full-width justify-around">
      <div class="col-xs-10 col-sm-5 q-mb-lg">
        <q-card>
          <q-card-section>
            <div class="q-ma-md">
              Stake EOS tokens
            </div>
            <div class="q-pa-md q-ml-auto q-mr-auto" style="width: 70%;">
              <q-input
                v-model.number="stakeAmount"
                type="number"
                outlined
                placeholder="Amount"
              />
            </div>
            <div class="q-ma-md q-mt-lg">
              <q-btn color="primary" @click="() => actionStake()" no-caps label="Stake" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-10 col-sm-5 q-mb-lg">
        <q-card>
          <q-card-section>
            <div class="q-ma-md">
              Unstake EOS tokens
            </div>
            <div class="q-pa-md q-ml-auto q-mr-auto" style="width: 70%;">
              <q-input
                v-model.number="unstakeAmount"
                type="number"
                outlined
                placeholder="Amount"
              />
            </div>
            <div class="q-ma-md q-mt-lg">
              <q-btn color="primary" no-caps label="Unstake" @click="() => actionUnstake()" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-ma-lg">
      You have 1 unstaking operation in process
    </div>
    <div class="q-ma-lg" style="width: 90%; margin: auto;">
      <q-card class="q-ma-lg">
        <q-card-section>
          <div class="full-width q-pl-md q-pr-md" style="display: flex; justify-content: space-between; align-items: center;">
            <span>Unstake 20 EOS for asdfwerok from 06.09.2020</span>
            <q-btn flat color="negative" no-caps label="Cancel" />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="isShowUnstakeDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Please check transaction details below</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-6">
              From:
            </div>
            <div class="col-6">
              asdgfhtj37kd
            </div>
          </div>
          <div class="row q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-6">
              Unstake:
            </div>
            <div class="col-6">
              {{ unstakeAmount }} EOS
            </div>
          </div>
          <div class="row q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-6">
              Date/time:
            </div>
            <div class="col-6">
              8.11.2020 / 6:16
            </div>
          </div>
          <div class="q-mt-xl">
            Please note that unstaking operation takes 3 weeks. You can cancel unstaking any time. Your funds will be available on your account 29.11.2020
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Confirm" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StakeAndUnstake',
  data () {
    return {
      stakeAmount: null,
      unstakeAmount: null,
      isShowUnstakeDialog: false
    }
  },
  methods: {
    ...mapActions('stake', ['actionStake']),
    ...mapActions('unstake', ['actionUnstake'])
  }
}
</script>

<style scoped>

</style>

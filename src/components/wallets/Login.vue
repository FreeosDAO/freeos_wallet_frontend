<template>
  <div>
    <!-- Login dropdown (if logged out)-->
    <div v-if="!authInfo.accountInfo && !mobileWallet">
      <q-btn @click="connectWallet('scatter')" color="dark" label="Scatter" />
<!--      <el-dropdown trigger="click">-->
<!--        <q-btn :loading="progress">-->
<!--          {{("Login")}} <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--        </q-btn>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item>-->
<!--            <div @click="connectWallet('scatter')">-->
<!--              <img style="width:24px;height:auto;margin-right:2px;" src="/images/scatter_logo.jpg"/>-->
<!--              <img style="width:75px;height:auto;margin-bottom: -5px;" src="/images/scatter.png"/>-->
<!--            </div>-->
<!--          </el-dropdown-item>-->
<!--          <el-dropdown-item>-->
<!--            <div style="padding-top:15px;" @click="connectWallet('ledger')">-->
<!--              <img style="" src="/images/ledger.svg"/>-->
<!--            </div>-->
<!--          </el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
    </div>

    <!-- Account info and actions (if logged in) -->
    <div v-else-if="authInfo.accountInfo">
      <q-btn @click="logout" style="margin-bottom:20px;" :disabled="mobileWallet">
        {{ wallet.accountInfo.account_name }} <i v-show="!mobileWallet" style="margin-left:5px;" class="el-icon-close"></i>
      </q-btn><br>
      <p style="color:grey;">Balance: {{authInfo.accountInfo.core_liquid_balance}}</p>
      <div v-if="voting && !finishedVoting">
        <div v-if="authInfo.accountInfo.voter_info.proxy.length>0" style="color:grey;">You are currently voting for proxy: {{authInfo.accountInfo.voter_info.proxy}}</div>
        <div v-else style="color:grey;">You are currently voting for {{authInfo.accountInfo.voter_info.producers.length}} producers</div>
        <br>
        <q-btn size="small" @click="vote">Refresh your vote</q-btn>
      </div>
      <div v-if="!voting">
        <p style="color:grey;">You have never voted with this account, please vote for EOS Titan Proxy</p>
        <q-btn size="small" @click="vote">Vote EOS Titan</q-btn>
      </div>
      <div v-if="finishedVoting">
        <p style="color:grey;">Thank you for voting and testing Transit API !</p>
      </div>

    </div>

    <!-- Show user agent if there is an issue logging in to a mobile wallet -->
    <div v-else>{{nav}}</div>

    <!-- Choose Account Info for wallet providers supporting key discovery-->
<!--    <transition name="el-zoom-in-center">-->
<!--      <div v-show="accountsModal" style="padding-top:35px;">-->
<!--        <div v-for="(a, i) in accounts" :key="i" style="margin-bottom:25px">-->
<!--          <div :title="'Ledger index: ' + a.index" class="keyIndex">{{ a.index }}</div>-->
<!--          <div :title="a.key" class="pubKey">{{ a.key }}</div>-->
<!--          <div style="margin-top:10px;padding:0;">-->
<!--            <transition-group name="el-zoom-in-center">-->
<!--              <q-btn v-for="(act, j) in a.accounts" :key="'index'+j" class="accountButton" small @click="accountLogin(a.index, j)">-->
<!--                <span class="accountName">{{ act.account }}</span>-->
<!--                <span class="accountAuth">{{ act.authorization }}</span>-->
<!--              </q-btn>-->
<!--            </transition-group>-->
<!--          </div>-->
<!--        </div>-->
<!--        <q-btn small @click="accountsModal=false">Hide</q-btn>-->
<!--      </div>-->
<!--    </transition>-->
  </div>
</template>
<script>
import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
import ledger from 'eos-transit-ledger-provider'
import lynx from 'eos-transit-lynx-provider'
import tp from 'eos-transit-tokenpocket-provider'
import meetone from 'eos-transit-meetone-provider'

import { mapState } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      nav: navigator.userAgent,
      mobileWallet: false,
      accountsModal: false,
      finishedVoting: false,
      message: {},
      accessContext: null,
      wallet: null,
      walletId: 'scatter',
      discoveryData: []
    }
  },
  created () {
    // if client is using mobile wallet (Now set for Lynx)
    if (navigator.userAgent.toLowerCase().includes('eoslynx')) {
      this.mobileWallet = true
      this.walletId = 'EOS Lynx'
      // if lynxMobile is already loaded, initialize transit
      if (window.lynxMobile) this.initTransit()
      // otherwise wait for lynxMobile to load first
      else window.addEventListener('lynxMobileLoaded', () => this.initTransit())
    } else if (navigator.userAgent.toLowerCase().includes('tokenpocket')) {
      this.mobileWallet = true
      this.walletId = 'TokenPocket'
      // if TokenPocket is already loaded, initialize transit
      if (window.scatter) this.initTransit()
      // otherwise wait for TokenPocket to load
      else window.addEventListener('scatterLoaded', () => this.initTransit())
    } else if (navigator.userAgent.toLowerCase().includes('meet.one')) {
      this.mobileWallet = true
      this.walletId = 'meetone_provider'
      // initialize transit with Meet.One wallet (transit will wait for window.scatter to load)
      this.initTransit()
    } else this.initTransit() // if client is not using a mobile wallet
  },
  computed: {
    ...mapState({
      authInfo: state => state.auth.authInfo
    }),
    // reactive accounts list of all discovered public keys
    accounts () {
      var list = []
      if (this.discoveryData.keyToAccountMap) {
        for (var key of this.discoveryData.keyToAccountMap) {
          if (key.accounts && key.accounts[0]) { list.push(key) }
        }
      }
      return list
    },
    progress () { return this.authInfo.connecting || this.authInfo.authenticating || this.authInfo.fetchingAccount || false },
    voting () {
      if (this.authInfo.accountInfo.voter_info && (this.authInfo.accountInfo.voter_info.proxy.length > 0 || this.authInfo.accountInfo.voter_info.producers.length > 0)) { return true } else return false
    }
  },
  methods: {
    initTransit () {
      var options = {
        appName: 'quizinfo1234',
        network: {
          blockchain: 'eos',
          protocol: 'https',
          host: 'api-kylin.eosasia.one',
          port: 443,
          chainId: '82bfaabcf3a1c3741ac3a6d25f23f5d9eb00be243406f7e9eba87e2bd8aee5c5'
        }
      }
      // set desired wallet providers
      if (this.mobileWallet) options.walletProviders = [lynx(), tp(), meetone()]
      else options.walletProviders = [scatter(), ledger()]

      // initialize Transit with the options object
      this.accessContext = initAccessContext(options)

      // Auto connect and login if user is on a mobile wallet
      if (this.mobileWallet) this.connectWallet(this.walletId)

      // auto login to last wallet if user never logged out
      else if (localStorage.autoLogin) this.connectWallet(localStorage.autoLogin)
    },
    async discoverMore (n) {
      for (var i = 1; i < n; i++) { this.discoveryData = await this.wallet.discover({ pathIndexList: [i] }) }
    },
    connectWallet (walletId) {
      this.walletId = walletId

      // fetch provider using the walletId;
      const provider = this.accessContext.getWalletProviders().find(r => { return r.id === walletId })
      if (!provider) return

      // initialize Transit wallet instance with your desired signature provider
      this.wallet = this.accessContext.initWallet(provider)

      // Subscrible to Transit wallet changes and bind it to a vue variable
      this.wallet.subscribe(walletState => {
        this.$store.commit('auth/UPDATE_AUTH', walletState)
      })

      this.startLogin(walletId)
    },
    async startLogin () {
      // Connect to wallet provider
      await this.wallet.connect()

      try {
        // start public key discovery for first index
        this.discoveryData = await this.wallet.discover({ pathIndexList: [0] })

        // if wallet does not provide public keys (eg. scatter), proceed to login
        if (this.discoveryData.keyToAccountMap.length === 0) { await this.wallet.login() } else {
          // if wallet provides one or more public keys (eg. ledger), allow user to choose desired account
          this.accountsModal = true
          this.message.connecting.dismiss()
          this.message.authenticating = this.$q.notify({
            color: 'info',
            message: `Choose account on ${this.walletId}`,
            timeout: 0
          })
          // start async discovery on additional indices
          this.discoverMore(10)
        }
      } catch (ex) {
        this.message.connecting.dismiss()
        if (this.walletId === 'ledger') {
          this.$q.notify({
            color: 'negative', message: 'Cannot connect to Ledger', timeout: 5000
          })
        }
      }
    },
    async accountLogin (index = 0, accountIndex = 0) {
      var keyObj = this.discoveryData.keyToAccountMap[index]
      await this.wallet.login(keyObj.accounts[accountIndex].account, keyObj.accounts[accountIndex].authorization)
      this.message.authenticating.dismiss()
    },
    async logout () {
      // null autologin
      localStorage.removeItem('autoLogin')
      this.message.logout = this.$q.notify({
        color: 'info',
        message: 'Logging out',
        timeout: 0
      })
      await this.wallet.terminate()
      this.message.logout.dismiss()
      this.message.logout = this.$q.notify({
        color: 'positive',
        message: 'You have logged out successfully',
        timeout: 3000
      })
    },
    async vote () {
      var data

      // show notification
      this.message.voting = this.$q.notify({
        color: 'info',
        message: 'Please confirm the transaction',
        timeout: 0
      })

      // if user has ever voted, refresh their last vote
      if (this.voting) {
        data = { voter: this.authInfo.auth.accountName, proxy: this.authInfo.accountInfo.voter_info.proxy, producers: this.authInfo.accountInfo.voter_info.producers }
      } else {
        // if user has never voted, allow voting for TITAN proxy
        data = { voter: this.authInfo.auth.accountName, proxy: 'eostitanvote', producers: [] }
      }
      // create the array of actions for this tx
      var actions = [{
        account: 'eosio',
        name: 'voteproducer',
        authorization: [{
          actor: this.authInfo.auth.accountName,
          permission: this.authInfo.auth.permission
        }],
        data: data
      }]
      try {
        // wait for user to accept tx on their wallet
        var tx = await this.wallet.eosApi.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 60 })
        this.message.voting.dismiss()

        // if transaction was successfull, show notification with transaction id link
        if (tx.transaction_id) {
          this.finishedVoting = true
          this.$q.notify({
            color: 'positive',
            message: `<p>You voted sucessfully</p><br><button class="q-btn q-btn--default q-btn--small" onclick="window.open('https://eosq.app/tx/${tx.transaction_id}')">View Transaction</div>`,
            timeout: 15000,
            dangerouslyUseHTMLString: true
          })
        }
      } catch (ex) {
        this.message.voting.dismiss()
        if (ex.message) { this.$q.notify({ color: 'negative', message: ex.message, timeout: 5000 }) }
      }
    }
  },
  watch: {
    authInfo: {
      handler (val) {
        // watching state variable to provide custom notifications to user
        if (!val.connecting && this.message.connecting && this.walletId !== 'ledger') {
          //TODO
          this.message.connecting.dismiss()
        }
        if (this.message.authenticating) { this.message.authenticating.dismiss() }
        if (val.connecting) {
          this.message.connecting = this.$q.notify({ color: 'info', message: `Connecting to ${this.walletId}`, timeout: 0, group: 'connecting' })
        } else if (val.authenticating) {
          this.message.authenticating = this.$q.notify.info({ message: `Logging in to ${this.walletId}`, timeout: 0 })
        } else if (val.authenticationError) {
          this.$q.notify({ color: 'negative', message: val.authenticationErrorMessage, timeout: 5000 })
        } else if (val.connectionError) {
          this.$q.notify({ color: 'negative', message: val.connectionErrorMessage, timeout: 5000 })
        } else if (val.accountInfo) {
          if (this.message.accountInfo) this.message.accountInfo.dismiss()
          this.message.accountInfo = this.$q.notify({ color: 'positive', message: `Logged in successfully as ${val.accountInfo.account_name}`, timeout: 3000 })
          this.accountsModal = false
          // once user logs in successfully with scatter, save variable to localstorage to allow auto login
          localStorage.autoLogin = this.walletId
        }
      },
      deep: true
    }
  }
}
</script>

import notifyAlert from 'src/services/notify-alert'

/**
 * Connect to a wallet
 * Don't use arrow function here to have access to Vue prototype (this.$...)
 *
 * @param commit
 * @param walletId
 * @returns {Promise<void>}
 */
export const connect = async function ({ commit }, walletId) {
  commit('setConnecting', true)
  console.log(this.$transit)
  const wallet = this.$transit.accessContext.initWallet(this.$transit.accessContext.getWalletProviders().find(r => r.id === walletId))
  wallet.subscribe(walletState => {
    let message
    let messageStatus = 1
    if (walletState.connecting) {
      message = `Connecting to ${walletId}`
    } else if (walletState.authenticating) {
      message = `Logging in to ${walletId}`
    } else if (walletState.authenticationError) {
      message = walletState.authenticationErrorMessage
      messageStatus = 0
    } else if (walletState.connectionError) {
      message = walletState.connectionErrorMessage
      messageStatus = 0
    } else if (walletState.accountInfo) {
      if (!this.$transit.wallet) {
        message = 'login successfully'
        commit('setAccount', {
          account: walletState.accountInfo,
          walletId
        })
      }
    }
    if (message) {
      // You can add some snackbar message here
      // console.log(message)
      notifyAlert(messageStatus, message)
    }
  })
  await wallet.connect()
  await wallet.login()
  this.$transit.wallet = wallet
  this.$transit.eosApi = wallet.eosApi
}

export const logout = async function ({ commit }) {
  await this.$transit.wallet.terminate()
  commit('clearAccount', null)
  // this.$router.push('/')
}

export const getClaimInfo = async function ({ commit }, accountName) {
  const { JsonRpc } = require('eosjs')
  const rpc = new JsonRpc('https://' + process.env.NETWORK_HOST + ':' + process.env.NETWORK_PORT, { fetch }) // endpoint
  const resp1 = await rpc.get_table_rows({
    json: true,
    code: 'eosio.token', // account containing smart contract
    scope: accountName, // the subset of the table to query
    table: 'accounts', // the name of the table
    limit: 10 // limit on number of rows returned
  })
  const resp2 = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName,
    table: 'users',
    limit: 1
  })
  const resp3 = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName,
    table: 'accounts',
    limit: 10
  })
  const resp4 = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'weeks',
    limit: 26
  })
  const claimInfo = {
    eosInAccount: resp1.rows[0],
    eosStaked: resp2.rows[0],
    freeosInAccount: resp3.rows[0],
    claimCalendar: resp4.rows[0],
    freeosHoldingRequire: resp4.rows[0]
  }
  console.log(claimInfo)
  commit('setClaimInfo', claimInfo)
}

export const setpath = function ({ commit }, pathe) {
  console.log(this.$route.fullPath)
  console.log('whatever', pathe)
  commit('setPath', pathe)
  // this.$router.push('/')
}

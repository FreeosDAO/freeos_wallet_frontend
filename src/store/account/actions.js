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
      if (!this.$transit.wallet || !this.$transit.wallet.accountInfo) {
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
  const respFreeosRecord = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName, // the subset of the table to query
    table: 'users' // the name of the table
  })
  const respStakeRequirement = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: process.env.AIRCLAIM_CONTRACT,
    table: 'stake' // the name of the table
  })
  const respAirKey = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: accountName,
    table: 'accounts',
    lower_bound: 'AIRKEY',
    limit: 1
  })
  const resp1 = await rpc.get_table_rows({
    json: true,
    code: 'eosio.token', // account containing smart contract
    scope: accountName, // the subset of the table to query
    table: 'accounts', // the name of the table
    limit: -1 // limit on number of rows returned
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
    lower_bound: 'FREEOS',
    limit: 1
  })
  const resp4 = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'weeks',
    limit: 26
  })
  const respMasterSwitch = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'parameters',
    lower_bound: 'masterswitch',
    limit: 1
  })
  const currentDate = Math.floor((new Date()).getTime() / 1000)
  let calendarAndRequireRow = null
  let nextCalendar = null
  if (resp4.rows && resp4.rows.length) {
    resp4.rows.map((row, index) => {
      const iStartDate = row.start
      const iEndDate = row.end
      if (currentDate > iStartDate && currentDate < iEndDate) {
        calendarAndRequireRow = row
        nextCalendar = resp4.rows[index + 1]
      }
    })
  }
  let respIsUserAlreadyClaimed = null
  if (calendarAndRequireRow && calendarAndRequireRow.week_number) {
    respIsUserAlreadyClaimed = await rpc.get_table_rows({
      json: true,
      code: process.env.AIRCLAIM_CONTRACT,
      scope: accountName,
      table: 'claims',
      lower_bound: calendarAndRequireRow.week_number,
      limit: 1
    })
  }
  const claimInfo = {
    liquidInAccount: resp1.rows[0],
    eosStaked: resp2.rows[0],
    freeosInAccount: resp3.rows[0],
    claimCalendar: calendarAndRequireRow ?? {
      week_number: 0
    },
    nextCalendar: nextCalendar,
    freeosHoldingRequire: calendarAndRequireRow ?? {
      week_number: 0
    },
    respMasterSwitch: respMasterSwitch.rows[0],
    respFreeosRecord: respFreeosRecord.rows[0],
    respStakeRequirement: respStakeRequirement.rows[0],
    respIsUserAlreadyClaimed: respIsUserAlreadyClaimed?.rows[0],
    respAirKey: respAirKey.rows[0]
  }
  console.log(claimInfo)
  commit('setClaimInfo', claimInfo)
  console.log(respFreeosRecord)
  console.log(respStakeRequirement)
  console.log(respAirKey)
  console.log(resp1)
  console.log(resp2)
  console.log(resp3)
  console.log(respIsUserAlreadyClaimed)
  console.log(resp4)
}

export const setpath = function ({ commit }, pathe) {
  console.log(this.$route.fullPath)
  console.log('whatever', pathe)
  commit('setPath', pathe)
  // this.$router.push('/')
}

import notifyAlert from 'src/services/notify-alert'
const { JsonRpc } = require('eosjs')
const rpc = new JsonRpc('https://' + process.env.NETWORK_HOST + ':' + process.env.NETWORK_PORT, { fetch }) // endpoint

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
        console.log(walletState.accountInfo, walletId)
        commit('setAccount', {
          accountName: walletState.accountInfo.account_name,
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
  commit('clearAccount', null)
  // TODO
  await this.$transit.wallet.terminate()

  // this.$router.push('/')
}

export function getAccountInfo (state) {
  state.dispatch('GetFreeosRecord')
  state.dispatch('getLiquidInAccount')
  state.dispatch('getStakeRequirementInfo')
  state.dispatch('getResAirKey')
  state.dispatch('getUserStakedInfo')
  state.dispatch('getFreeosInfo')
  state.dispatch('getRespMasterSwitch')
  state.dispatch('getClaimDetailInfo')
}

export async function GetFreeosRecord (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: state.state.accountName, // the subset of the table to query
    table: 'users' // the name of the table
  })
  const val = {
    key: 'respFreeosRecord',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getLiquidInAccount (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: 'eosio.token', // account containing smart contract
    scope: state.state.accountName, // the subset of the table to query
    table: 'accounts', // the name of the table
    limit: -1 // limit on number of rows returned
  })
  const val = {
    key: 'liquidInAccount',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getStakeRequirementInfo (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: process.env.AIRCLAIM_CONTRACT,
    table: 'stake' // the name of the table
  })

  const val = {
    key: 'respStakeRequirement',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getResAirKey (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: state.state.accountName,
    table: 'accounts',
    lower_bound: 'AIRKEY',
    limit: 1
  })

  const val = {
    key: 'respAirKey',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getUserStakedInfo (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: state.state.accountName,
    table: 'users',
    limit: 1
  })

  const val = {
    key: 'eosStaked',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getFreeosInfo (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONTRACT,
    scope: state.state.accountName,
    table: 'accounts',
    lower_bound: 'FREEOS',
    limit: 1
  })

  const val = {
    key: 'freeosInAccount',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getRespMasterSwitch (state, acccountName) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'parameters',
    lower_bound: 'masterswitch',
    limit: 1
  })

  const val = {
    key: 'respMasterSwitch',
    value: result.rows[0]
  }
  state.commit('setClaimAttributeVal', val)
}

export async function getClaimCalendar (state) {
  const result = await rpc.get_table_rows({
    json: true,
    code: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    scope: process.env.AIRCLAIM_CONFIGRATION_CONTRACT,
    table: 'weeks',
    limit: 26
  })

  const currentDate = Math.floor((new Date()).getTime() / 1000)
  let calendarAndRequireRow = null
  let nextCalendar = null
  if (result.rows && result.rows.length) {
    result.rows.map((row, index) => {
      const iStartDate = row.start
      const iEndDate = row.end
      if (currentDate > iStartDate && currentDate < iEndDate) {
        calendarAndRequireRow = row
        nextCalendar = result.rows[index + 1]
      }
    })
  }

  const val = {
    key: 'nextCalendar',
    value: nextCalendar
  }
  state.commit('setClaimAttributeVal', val)

  return calendarAndRequireRow
}

export async function getClaimDetailInfo (state) {
  const calendarAndRequireRow = state.dispatch('getClaimCalendar')

  const claimCalendarVal = {
    key: 'claimCalendar',
    value: calendarAndRequireRow ?? {
      week_number: 0
    }
  }
  state.commit('setClaimAttributeVal', claimCalendarVal)

  const freeosHoldingRequireVal = {
    key: 'freeosHoldingRequire',
    value: calendarAndRequireRow ?? {
      week_number: 0
    }
  }
  state.commit('setClaimAttributeVal', freeosHoldingRequireVal)

  let respIsUserAlreadyClaimed = null
  if (calendarAndRequireRow && calendarAndRequireRow.week_number) {
    respIsUserAlreadyClaimed = await rpc.get_table_rows({
      json: true,
      code: process.env.AIRCLAIM_CONTRACT,
      scope: state.state.accountName,
      table: 'claims',
      lower_bound: calendarAndRequireRow.week_number,
      limit: 1
    })
  }

  const respIsUserAlreadyClaimedVal = {
    key: 'respIsUserAlreadyClaimed',
    value: respIsUserAlreadyClaimed?.rows[0]
  }
  state.commit('setClaimAttributeVal', respIsUserAlreadyClaimedVal)
}

export const setpath = function ({ commit }, pathe) {
  console.log(this.$route.fullPath)
  console.log('whatever', pathe)
  commit('setPath', pathe)
  // this.$router.push('/')
}

import { ConnectWallet } from '@protonprotocol/proton-web-sdk'
const endpoints = ['https://api-testnet-proton.eosarabia.net']
const selectorOptions = {
  appName: 'Freeos', /* Optional: Name to show in modal, Default 'app' */
  appLogo: '', /* Optional: Logo to show in modal */
  customStyleOptions: { /* Optional: Custom style options for modal */
    modalBackgroundColor: '#F4F7FA',
    logoBackgroundColor: 'white',
    isLogoRound: true,
    optionBackgroundColor: 'white',
    optionFontColor: 'black',
    primaryFontColor: 'black',
    secondaryFontColor: '#6B727F',
    linkColor: '#752EEB'
  }
  // walletType: 'proton' /* Optional: Connect to only specified wallet (e.g. 'proton', 'anchor') */
}
export async function connectProton (state) {
  // const result = await ConnectWallet({
  //   linkOptions: {
  //     endpoints
  //     // rpc: rpc /* Optional: if you wish to provide rpc directly instead of endpoints */
  //   },
  //   transportOptions: {
  //     requestAccount: '', /* Optional: Your proton account */
  //     requestStatus: true /* Optional: Display request success and error messages, Default true */
  //   },
  //   selectorOptions
  // })
  // console.log(result)
  // // state.commit('setAccount', {
  // //   account: walletState.accountInfo,
  // //   walletId
  // // })
  // // Login
  const { link, session } = await ConnectWallet({
    linkOptions: { chainId: process.env.NETWORK_CHAIN_ID, endpoints: endpoints },
    transportOptions: { requestAccount: this.requestAccount, backButton: true },
    selectorOptions: { appName: selectorOptions.appName, appLogo: selectorOptions.appLogo }
  })
  console.log(link, session)
  state.commit('setAccount', {
    accountName: session.auth.actor,
    walletId: link.walletType
  })
}

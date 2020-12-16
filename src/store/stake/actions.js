import notifyAlert from 'src/services/notify-alert'
import { JsonRpc, RpcError } from 'eosjs'

export const actionStake = async function ({ state }) {
  try {
    const rpc = new JsonRpc('https://kylin-dsp-1.liquidapps.io/')
    const userRecord = await rpc.get_table_rows({
      json: true, // Get the response as json
      code: 'freeos333333', // Contract that we target
      scope: this.$transit.wallet.auth.accountName, // Account that owns the data
      table: 'users', // Table name
      limit: 1 // Maximum number of rows that we want to get
    })

    const result = await this.$transit.eosApi.transact({
      actions: [{
        account: process.env.TOKEN_SMARTCONTRACT, // the name of the EOS currency administration contract
        name: 'transfer', // name of the action to call
        authorization: [{
          actor: this.$transit.wallet.auth.accountName, // the stake action is called on behalf of the user
          permission: this.$transit.wallet.auth.permission // name of permission, e.g. this and the line above are the equivalent of  -p yvetecoleman@active
        }],
        data: {
          // Kenneth: only the following parameters required for transfer action
          from: this.$transit.wallet.auth.accountName, // account name = yvetecoleman
          to: 'freeos333333', // Kenneth, can we make this account name a constant somewhere? It will change when we go live.
          quantity: userRecord.rows[0].stake_requirement,
          memo: 'stake from ' + this.$transit.wallet.auth.accountName
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })
    if (result.processed.receipt.status === 'executed') {
      notifyAlert('success', result.processed.action_traces[0].console) // Kenneth: Notify message in green
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later') // Kenneth: Notify error in red
    }
    return result
  } catch (e) {
    // notifyAlert('err', 'Other error: ', e.message)
    // Kenneth: All of the following log messages should be replaced with Notify messages in red

    if (e.message.startsWith("Cannot read property 'stake_requirement'")) {
      notifyAlert('err', 'You are not yet registered with freeos')
    } else if (e.message === 'UnAuthorized') {
      notifyAlert('err', 'Please check that your wallet contains the correct keys for the account you are trying to register')
    } else if (e.message.startsWith('assertion failure with message: ')) {
      notifyAlert('err', e.message.split('assertion failure with message: ')[1])
    } else if (e.message === 'unrecognized private key type') {
      notifyAlert('err', 'There is a problem with your private key. Please check your wallet has the correct key(s)')
    } else if (e instanceof RpcError || e instanceof TypeError) {
      notifyAlert('err', 'Connection error. Please try later') // Notify in red
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
  }
}

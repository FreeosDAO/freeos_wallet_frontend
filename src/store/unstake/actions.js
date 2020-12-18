import notifyAlert from 'src/services/notify-alert'
import { RpcError } from 'eosjs'

export const actionUnstake = async function ({ state }) {
  try {
    const result = await this.$transit.eosApi.transact({
      actions: [{
        account: 'freeos333333', // the name of the airclaim contract (i'm using freeos333333 as a test account on Kylin)
        name: 'unstake', // name of the action to call
        authorization: [{
          actor: this.$transit.wallet.auth.accountName, // the unstake action is called on behalf of the user
          permission: 'active' // name of permission, e.g. this and the line above are the equivalent of  -p yvetecoleman@active
        }],
        data: {
          // Kenneth: only the following parameters required for unstake action
          user: this.$transit.wallet.auth.accountName // account name = yvetecoleman
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

    if (e.message === 'UnAuthorized') {
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

import notifyAlert from 'src/services/notify-alert'
import { RpcError } from 'eosjs'

export const actionClaim = async function ({ state }) {
  try {
    const result = await this.$transit.eosApi.transact({
      actions: [{
        account: process.env.AIRCLAIM_CONTRACT_NAME,
        name: 'claim',
        authorization: [{
          actor: this.$transit.wallet.auth.accountName,
          permission: this.$transit.wallet.auth.permission
        }],
        data: {
          user: this.$transit.wallet.auth.accountName
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    })
    console.log(result)
    if (result.processed.receipt.status === 'executed') {
      notifyAlert(1, result.processed.action_traces[0].console) // Kenneth: Notify message in green
    } else {
      notifyAlert(0, 'The action could not be completed. Please try later') // Kenneth: Notify error in red
    }
    return result
  } catch (e) {
    if (e.message === 'UnAuthorized') {
      notifyAlert(0, 'Please check that your wallet contains the correct keys for the account you are trying to register')
    } else if (e.message.startsWith('assertion failure with message: ')) {
      notifyAlert(0, e.message.split('assertion failure with message: ')[1])
    } else if (e.message === 'unrecognized private key type') {
      notifyAlert(0, 'There is a problem with your private key. Please check your wallet has the correct key(s)')
    } else if (e instanceof RpcError || e instanceof TypeError) {
      notifyAlert(0, 'Connection error. Please try later') // Notify in red
    } else {
      notifyAlert(0, 'The action could not be completed. Please try later')
    }
    return e
  }
}
